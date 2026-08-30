import http from 'node:http';
import { createReadStream, existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const publicRoot = resolve(root, 'public');

loadEnv(join(root, '.env'));

const port = Number(process.env.PORT || 4173);
const model = process.env.GEMINI_MODEL || 'gemini-3.7-flash';
const apiKey = process.env.GEMINI_API_KEY || '';
const mockAI = /^(1|true|yes)$/i.test(process.env.MOCK_AI || '');
const MAX_BODY_BYTES = 24 * 1024 * 1024;
const NSE_PAGE_URL = 'https://www.nseindia.com/market-data/all-upcoming-issues-ipo';
const NSE_CURRENT_IPO_URL = 'https://www.nseindia.com/api/ipo-current-issue';
const NSE_CACHE_MS = 5 * 60 * 1000;
const NSE_OPTION_PAGE_URL = 'https://www.nseindia.com/option-chain?symbol=NIFTY';
const NSE_OPTION_CONTRACT_URL = 'https://www.nseindia.com/api/option-chain-contract-info?symbol=NIFTY';
const NSE_MARKET_STATUS_URL = 'https://www.nseindia.com/api/marketStatus';
const NSE_LOT_SIZE_URL = 'https://nsearchives.nseindia.com/content/fo/fo_mktlots.csv';
const NSE_OPTION_CACHE_MS = 60 * 1000;
let nseCache = null;
let nseOptionCache = null;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const SYSTEM_PROMPT = `You are MarketMind, a rigorous Indian equity-research copilot and patient stock-market tutor.

Rules:
- Be direct, structured, and evidence-led. Separate facts in supplied documents from assumptions.
- Never invent prices, ratios, dates, filings, subscription figures, management quotes, or sources.
- When documents are attached, cite the document filename and page/section when visible.
- For analysis, cover business quality, financial quality, management/promoters, valuation, technical structure when chart data exists, catalysts, risks, and a clear conclusion.
- Explain financial jargon briefly. Use INR and Indian market conventions where relevant.
- A verdict must include confidence, missing evidence, and what would change the view.
- This is research support, not personalised financial advice. Never claim guaranteed returns.
- Prefer concise answers first, followed by optional detail. Use Markdown.`;

const server = http.createServer(async (req, res) => {
  setSecurityHeaders(res);

  if (req.method === 'GET' && req.url === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      aiConfigured: Boolean(apiKey) || mockAI,
      mock: mockAI,
      model,
    });
  }

  if (req.method === 'GET' && req.url?.startsWith('/api/ipos/live')) {
    try {
      const force = new URL(req.url, 'http://127.0.0.1').searchParams.get('refresh') === '1';
      const live = await getLiveIpos(force);
      return sendJson(res, 200, live);
    } catch (error) {
      if (nseCache?.ipos?.length) {
        return sendJson(res, 200, { ...nseCache, stale: true, error: error.message });
      }
      return sendJson(res, 502, { error: `Could not reach NSE India: ${error.message}` });
    }
  }

  if (req.method === 'GET' && req.url?.startsWith('/api/market/nifty-options')) {
    const url = new URL(req.url, 'http://127.0.0.1');
    const force = url.searchParams.get('refresh') === '1';
    const requestedExpiry = String(url.searchParams.get('expiry') || '').slice(0, 20);
    try {
      const market = await getLiveNiftyOptions({ force, requestedExpiry });
      return sendJson(res, 200, market);
    } catch (error) {
      if (nseOptionCache?.quotes?.length) {
        return sendJson(res, 200, { ...nseOptionCache, stale: true, error: error.message });
      }
      return sendJson(res, 502, { error: `Could not load NIFTY options from NSE India: ${error.message}` });
    }
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    try {
      const body = await readJson(req, MAX_BODY_BYTES);
      validateChatBody(body);

      if (mockAI) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
        const mock = mockResponse(body);
        for (const word of mock.split(/(\s+)/)) res.write(word);
        return res.end();
      }

      if (!apiKey) {
        return sendJson(res, 503, {
          error: 'AI is not configured. Add GEMINI_API_KEY to .env and restart the server.',
        });
      }

      await streamGemini(body, res);
    } catch (error) {
      if (!res.headersSent) {
        sendJson(res, error.statusCode || 500, { error: error.message || 'Unexpected server error.' });
      } else {
        res.write(`\n\n[Connection error: ${error.message || 'stream interrupted'}]`);
        res.end();
      }
    }
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, { error: 'Method not allowed.' });
  }

  serveStatic(req, res);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`MarketMind AI is running at http://127.0.0.1:${port}`);
  console.log(`AI: ${mockAI ? 'mock mode' : apiKey ? `configured (${model})` : 'not configured'}`);
});

async function streamGemini(body, res) {
  const contents = body.messages.slice(-14).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(message.content).slice(0, 24000) }],
  }));

  const lastUser = [...contents].reverse().find((item) => item.role === 'user');
  if (lastUser && Array.isArray(body.attachments)) {
    for (const file of body.attachments.slice(0, 6)) {
      lastUser.parts.push({ text: `Attached document: ${file.name}` });
      lastUser.parts.push({
        inline_data: {
          mime_type: file.type,
          data: file.data,
        },
      });
    }
  }

  const context = buildContext(body.context);
  const requestBody = {
    system_instruction: {
      parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent workspace context:\n${context}` }],
    },
    contents,
    generation_config: {
      max_output_tokens: 8192,
      thinking_config: { thinking_level: 'low' },
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`;
  const upstream = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(180000),
  });

  if (!upstream.ok) {
    const details = await upstream.text();
    const safeDetails = extractGoogleError(details);
    const error = new Error(`Gemini request failed (${upstream.status}): ${safeDetails}`);
    error.statusCode = upstream.status >= 400 && upstream.status < 500 ? 400 : 502;
    throw error;
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Accel-Buffering': 'no',
  });

  const decoder = new TextDecoder();
  let buffer = '';

  for await (const chunk of upstream.body) {
    buffer += decoder.decode(chunk, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() || '';
    for (const event of events) writeSseText(event, res);
  }
  if (buffer.trim()) writeSseText(buffer, res);
  res.end();
}

function writeSseText(event, res) {
  const dataLines = event.split(/\r?\n/)
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim());
  if (!dataLines.length) return;
  const data = dataLines.join('\n');
  if (data === '[DONE]') return;
  try {
    const packet = JSON.parse(data);
    const parts = packet?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.text && !part.thought) res.write(part.text);
    }
  } catch {
    // Ignore non-JSON keepalive events.
  }
}

function buildContext(context = {}) {
  const safe = {
    mode: String(context.mode || 'general').slice(0, 80),
    selectedIPO: context.selectedIPO || null,
    learningProgress: context.learningProgress || null,
  };
  return JSON.stringify(safe, null, 2).slice(0, 16000);
}

function validateChatBody(body) {
  if (!body || !Array.isArray(body.messages) || !body.messages.length) {
    const error = new Error('A non-empty messages array is required.');
    error.statusCode = 400;
    throw error;
  }
  for (const message of body.messages) {
    if (!['user', 'assistant'].includes(message.role) || typeof message.content !== 'string') {
      const error = new Error('Each message needs a valid role and text content.');
      error.statusCode = 400;
      throw error;
    }
  }
  const attachments = Array.isArray(body.attachments) ? body.attachments : [];
  if (attachments.length > 6) {
    const error = new Error('Attach at most 6 documents per message.');
    error.statusCode = 400;
    throw error;
  }
  const allowed = new Set(['application/pdf', 'text/plain', 'text/csv', 'application/json', 'image/png', 'image/jpeg', 'image/webp']);
  for (const file of attachments) {
    if (!file || typeof file.data !== 'string' || !allowed.has(file.type) || file.data.length > 10_000_000) {
      const error = new Error('An attachment is unsupported or too large. Use PDF, TXT, CSV, JSON, PNG, JPG or WEBP under 7 MB.');
      error.statusCode = 400;
      throw error;
    }
  }
}

function mockResponse(body) {
  const prompt = body.messages.at(-1)?.content || '';
  const ipo = body.context?.selectedIPO?.name;
  return `## Research brief\n\nMock AI mode is working. I received your request${ipo ? ` about **${ipo}**` : ''}: “${prompt.slice(0, 120)}${prompt.length > 120 ? '…' : ''}”\n\nConfigure a fresh \`GEMINI_API_KEY\` in \`.env\` to receive the full streamed analysis. Your dashboard data and attachments reached the secure backend successfully.`;
}

async function getLiveIpos(force = false) {
  if (!force && nseCache && Date.now() - new Date(nseCache.fetchedAt).getTime() < NSE_CACHE_MS) {
    return { ...nseCache, cached: true };
  }

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  };
  const landing = await fetch(NSE_PAGE_URL, {
    headers: { ...browserHeaders, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(20000),
  });
  if (!landing.ok) throw new Error(`NSE session failed with status ${landing.status}`);

  const setCookies = typeof landing.headers.getSetCookie === 'function'
    ? landing.headers.getSetCookie()
    : [landing.headers.get('set-cookie')].filter(Boolean);
  const cookie = setCookies.map((value) => value.split(';')[0]).join('; ');

  const response = await fetch(NSE_CURRENT_IPO_URL, {
    headers: {
      ...browserHeaders,
      Accept: 'application/json,text/plain,*/*',
      Referer: NSE_PAGE_URL,
      Cookie: cookie,
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`NSE data request failed with status ${response.status}`);

  const payload = await response.json();
  if (!Array.isArray(payload)) throw new Error('NSE returned an unexpected response');
  const ipos = payload
    .filter((item) => item?.series === 'EQ' && item?.companyName)
    .map(normalizeNseIpo)
    .filter((item) => item.openDate && item.closeDate);

  nseCache = {
    source: 'NSE India',
    sourceUrl: NSE_PAGE_URL,
    fetchedAt: new Date().toISOString(),
    stale: false,
    cached: false,
    ipos,
  };
  return nseCache;
}

async function getLiveNiftyOptions({ force = false, requestedExpiry = '' } = {}) {
  const cacheIsFresh = nseOptionCache
    && Date.now() - new Date(nseOptionCache.fetchedAt).getTime() < NSE_OPTION_CACHE_MS
    && (requestedExpiry
      ? requestedExpiry === nseOptionCache.expiry
      : nseOptionCache.expiry === nseOptionCache.expiries?.[0]);
  if (!force && cacheIsFresh) return { ...nseOptionCache, cached: true };

  const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  };
  const landing = await fetch(NSE_OPTION_PAGE_URL, {
    headers: { ...browserHeaders, Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' },
    signal: AbortSignal.timeout(20000),
  });
  if (!landing.ok) throw new Error(`NSE option-chain session failed with status ${landing.status}`);

  const setCookies = typeof landing.headers.getSetCookie === 'function'
    ? landing.headers.getSetCookie()
    : [landing.headers.get('set-cookie')].filter(Boolean);
  const cookie = setCookies.map((value) => value.split(';')[0]).join('; ');
  const fetchNseJson = async (url) => {
    const response = await fetch(url, {
      headers: {
        ...browserHeaders,
        Accept: 'application/json,text/plain,*/*',
        Referer: NSE_OPTION_PAGE_URL,
        Cookie: cookie,
      },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`NSE request failed with status ${response.status}`);
    return response.json();
  };

  const contracts = await fetchNseJson(NSE_OPTION_CONTRACT_URL);
  const expiries = Array.isArray(contracts?.expiryDates) ? contracts.expiryDates.map(String) : [];
  if (!expiries.length) throw new Error('NSE did not return any NIFTY expiries');
  const expiry = expiries.includes(requestedExpiry) ? requestedExpiry : expiries[0];
  const chainUrl = `https://www.nseindia.com/api/option-chain-v3?type=Indices&symbol=NIFTY&expiry=${encodeURIComponent(expiry)}`;
  const [chain, marketPayload, lotSize] = await Promise.all([
    fetchNseJson(chainUrl),
    fetchNseJson(NSE_MARKET_STATUS_URL),
    fetchNiftyLotSize(expiry, browserHeaders),
  ]);

  const records = Array.isArray(chain?.records?.data) ? chain.records.data : [];
  const underlyingValue = Number(chain?.records?.underlyingValue)
    || Number(records.find((row) => row?.CE?.underlyingValue || row?.PE?.underlyingValue)?.CE?.underlyingValue)
    || Number(records.find((row) => row?.PE?.underlyingValue)?.PE?.underlyingValue);
  if (!records.length || !Number.isFinite(underlyingValue)) throw new Error('NSE returned an empty option chain');

  const quoteRange = 1800;
  const quotes = records
    .map((row) => ({
      strike: Number(row?.CE?.strikePrice ?? row?.PE?.strikePrice),
      call: normalizeNseOptionQuote(row?.CE),
      put: normalizeNseOptionQuote(row?.PE),
    }))
    .filter((row) => Number.isFinite(row.strike) && Math.abs(row.strike - underlyingValue) <= quoteRange)
    .sort((a, b) => a.strike - b.strike);
  if (!quotes.length) throw new Error('NSE returned no usable NIFTY strikes');

  const capitalMarket = Array.isArray(marketPayload?.marketState)
    ? marketPayload.marketState.find((item) => item?.market === 'Capital Market')
    : null;
  nseOptionCache = {
    source: 'NSE India',
    sourceUrl: NSE_OPTION_PAGE_URL,
    lotSizeSourceUrl: NSE_LOT_SIZE_URL,
    symbol: 'NIFTY',
    underlyingValue,
    expiry,
    expiries,
    lotSize,
    exchangeTimestamp: String(chain?.records?.timestamp || capitalMarket?.tradeDate || ''),
    marketStatus: String(capitalMarket?.marketStatus || 'Unknown'),
    marketStatusMessage: String(capitalMarket?.marketStatusMessage || 'Market status unavailable'),
    dayChange: Number(capitalMarket?.variation) || 0,
    dayChangePercent: Number(capitalMarket?.percentChange) || 0,
    fetchedAt: new Date().toISOString(),
    cached: false,
    stale: false,
    quotes,
  };
  return nseOptionCache;
}

function normalizeNseOptionQuote(quote) {
  if (!quote) return null;
  const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;
  return {
    last: number(quote.lastPrice),
    bid: number(quote.buyPrice1),
    ask: number(quote.sellPrice1),
    change: number(quote.change),
    changePercent: number(quote.pChange ?? quote.PChange),
    iv: number(quote.impliedVolatility),
    openInterest: number(quote.openInterest),
    volume: number(quote.totalTradedVolume),
  };
}

async function fetchNiftyLotSize(expiry, browserHeaders) {
  try {
    const response = await fetch(NSE_LOT_SIZE_URL, {
      headers: { ...browserHeaders, Accept: 'text/csv,*/*' },
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`lot-size file returned ${response.status}`);
    const lines = (await response.text()).split(/\r?\n/).filter(Boolean);
    const headers = lines[0].split(',').map((value) => value.trim().toUpperCase());
    const nifty = lines.map((line) => line.split(',').map((value) => value.trim()))
      .find((columns) => columns[1]?.toUpperCase() === 'NIFTY');
    const expiryMatch = String(expiry).match(/^[0-9]{2}-([A-Za-z]{3})-([0-9]{4})$/);
    const expiryColumn = expiryMatch ? `${expiryMatch[1].toUpperCase()}-${expiryMatch[2].slice(-2)}` : '';
    const index = headers.indexOf(expiryColumn);
    const lotSize = Number(index >= 0 ? nifty?.[index] : nifty?.[2]);
    return Number.isFinite(lotSize) && lotSize > 0 ? lotSize : 65;
  } catch {
    return 65;
  }
}

function normalizeNseIpo(item) {
  const subscription = Number(item.noOfTime);
  return {
    id: String(item.symbol || item.companyName).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    symbol: String(item.symbol || ''),
    name: String(item.companyName).replace(/\s+Limited$/i, '').trim(),
    exchange: 'NSE / BSE · Mainboard',
    openDate: nseDateToIso(item.issueStartDate),
    closeDate: nseDateToIso(item.issueEndDate),
    priceBand: String(item.issuePrice || '').replace(/Rs\.?/gi, '₹').replace(/\s+to\s+/i, ' – '),
    lotSize: '',
    gmp: '',
    subscription: Number.isFinite(subscription) ? `${subscription.toFixed(2)}×` : '',
    promoter: '',
    link: NSE_PAGE_URL,
    notes: '',
    source: 'nse',
    live: true,
    issueSizeShares: Number(item.issueSize) || null,
  };
}

function nseDateToIso(value) {
  const match = String(value || '').match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!match) return '';
  const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  const month = months[match[2][0].toUpperCase() + match[2].slice(1).toLowerCase()];
  return month ? `${match[3]}-${month}-${match[1].padStart(2, '0')}` : '';
}

function serveStatic(req, res) {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = resolve(publicRoot, normalize(relative));
  if (filePath !== publicRoot && !filePath.startsWith(publicRoot + sep)) {
    return sendJson(res, 403, { error: 'Forbidden.' });
  }
  if (!existsSync(filePath)) return sendJson(res, 404, { error: 'Not found.' });

  res.writeHead(200, {
    'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  if (req.method === 'HEAD') return res.end();
  createReadStream(filePath).pipe(res);
}

function setSecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https://*.tradingview.com https://*.tvcdn.io; style-src 'self' 'unsafe-inline' https://*.tradingview.com; script-src 'self' https://s3.tradingview.com https://*.tradingview.com 'unsafe-inline'; frame-src https://*.tradingview.com; connect-src 'self' https://*.tradingview.com; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function readJson(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        const error = new Error('Request is too large. Keep total attachments under 18 MB.');
        error.statusCode = 413;
        reject(error);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        const error = new Error('Invalid JSON request.');
        error.statusCode = 400;
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function extractGoogleError(raw) {
  try {
    const parsed = JSON.parse(raw);
    return String(parsed?.error?.message || 'Unknown API error').slice(0, 500);
  } catch {
    return String(raw || 'Unknown API error').slice(0, 500);
  }
}

function loadEnv(path) {
  if (!existsSync(path)) return;
  const lines = readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index < 1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
