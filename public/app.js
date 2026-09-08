import { STRATEGIES } from './strategies.js';
import {
  initFirebase,
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  logout,
  onAuthStatusChanged,
  subscribeToAllUsers,
  approveUser,
  rejectUser,
  setUserRole,
  deleteUserProfile,
  ADMIN_EMAIL
} from './firebase-service.js';

const MODULES = [
  { id: 'basics', num: '01', name: 'Market Basics & Terminology', description: 'Build a clean foundation before touching advanced setups.', tasks: [
    ['Understand what stocks and shares represent', 'High', 'Beginner'],
    ['Learn primary market vs secondary market', 'High', 'Beginner'],
    ['Learn Nifty 50, Sensex, and sector indices', 'Medium', 'Beginner'],
    ['Learn market, limit, stop-loss, and GTT orders', 'High', 'Beginner'],
    ['Learn demat accounts, NSDL/CDSL, and T+1 settlement', 'Medium', 'Beginner'],
    ['Separate trading decisions from investing decisions', 'Medium', 'Beginner'],
  ]},
  { id: 'fundamental', num: '02', name: 'Fundamental Analysis', description: 'Read the business behind the stock price.', tasks: [
    ['Read an income statement confidently', 'High', 'Intermediate'],
    ['Read a balance sheet confidently', 'High', 'Intermediate'],
    ['Read and reconcile the cash-flow statement', 'High', 'Intermediate'],
    ['Use P/E, P/B, ROE, ROCE, and debt/equity correctly', 'High', 'Intermediate'],
    ['Judge the quality of revenue and profit growth', 'Medium', 'Intermediate'],
    ['Spot promoter holding, pledge, and dilution red flags', 'High', 'Intermediate'],
    ['Complete an annual-report teardown on a real company', 'Medium', 'Advanced'],
  ]},
  { id: 'technical', num: '03', name: 'Technical Analysis', description: 'Read price, volume, trend, and market structure.', tasks: [
    ['Learn the purpose and limits of candlestick patterns', 'Medium', 'Beginner'],
    ['Mark support and resistance objectively', 'High', 'Beginner'],
    ['Use 50 EMA and 200 EMA in trend context', 'High', 'Intermediate'],
    ['Read RSI and MACD without treating them as signals alone', 'Medium', 'Intermediate'],
    ['Confirm or reject price moves with volume', 'Medium', 'Intermediate'],
    ['Identify accumulation, markup, distribution, and markdown', 'High', 'Advanced'],
  ]},
  { id: 'risk', num: '04', name: 'Risk Management & Position Sizing', description: 'Survive long enough for skill to compound.', tasks: [
    ['Compare structural, volatility, and percentage stop-losses', 'High', 'Beginner'],
    ['Calculate position size from risk per trade', 'High', 'Intermediate'],
    ['Calculate risk-reward and trading expectancy', 'High', 'Intermediate'],
    ['Apply portfolio diversification without over-diversifying', 'Medium', 'Beginner'],
    ['Set drawdown limits and a stop-trading rule', 'Medium', 'Advanced'],
  ]},
  { id: 'swing', num: '05', name: 'Swing-Trading Concepts (3-Indicator System)', description: 'Master the 3-Indicator Swing System by Bharat Jhunjhunwala: Moving Average, ZigZag, and MACD.', tasks: [
    ['Identify Trend Direction using Moving Average: Price above rising MA = Uptrend, below falling MA = Downtrend', 'High', 'Beginner'],
    ['Master Expansion vs Contraction Cycles: Never chase expansion, enter exclusively during contraction pullbacks', 'High', 'Intermediate'],
    ['Read Market Structure with ZigZag (Dev 3, Pivot Legs 2) for HH/HL, BOS (continuation) & CHOCH (reversal)', 'High', 'Intermediate'],
    ['Verify Momentum Expansion with MACD (12, 26, 9) histogram turning positive/green above zero', 'High', 'Intermediate'],
    ['Execute Long Setup Checklist: Uptrend MA + Contraction Pullback + ZigZag Higher Low / CHOCH + Rising MACD', 'High', 'Intermediate'],
    ['Execute Short Setup Checklist: Downtrend MA + Pullback to MA + ZigZag Lower High / CHOCH + Falling MACD', 'High', 'Intermediate'],
    ['Set Precise Stop-Loss below ZigZag Swing Low / Lower MA and size position for 1–2% account risk', 'High', 'Intermediate'],
    ['Manage Trades with 1:2 to 1:3+ RRR: Lock 50% profit at Target 1, shift SL to Breakeven & trail runner along ZigZag HLs / MA', 'High', 'Advanced'],
    ['Paper-trade five complete 3-indicator swing setups with stacked proof', 'High', 'Advanced'],
  ]},
  { id: 'options', num: '06', name: 'Options Basics', description: 'Understand the instrument before using leverage.', tasks: [
    ['Understand calls, puts, buyers, and sellers', 'High', 'Beginner'],
    ['Understand ITM, ATM, and OTM moneyness', 'High', 'Beginner'],
    ['Learn delta, theta, vega, and gamma', 'Medium', 'Intermediate'],
    ['Read an option chain in context', 'Medium', 'Intermediate'],
    ['Understand expiry mechanics and premium decay', 'Medium', 'Intermediate'],
  ]},
  { id: 'option-selling', num: '07', name: 'Option Selling & Covered Calls', description: 'Study income strategies and their asymmetric risks.', tasks: [
    ['Model a covered-call payoff', 'Medium', 'Intermediate'],
    ['Model a cash-secured put payoff', 'Medium', 'Intermediate'],
    ['Understand exchange and broker margin requirements', 'High', 'Advanced'],
    ['Compare defined-risk theta strategies', 'Medium', 'Advanced'],
    ['Document why naked option selling can be catastrophic', 'High', 'Advanced'],
  ]},
  { id: 'arbitrage', num: '08', name: 'Arbitrage Concepts', description: 'Understand pricing relationships across instruments.', tasks: [
    ['Learn cash-futures arbitrage mechanics', 'Low', 'Advanced'],
    ['Learn calendar-spread arbitrage', 'Low', 'Advanced'],
    ['Understand statistical-arbitrage assumptions', 'Low', 'Advanced'],
    ['Calculate cost of carry and implied financing', 'Low', 'Advanced'],
  ]},
  { id: 'ipo', num: '09', name: 'IPO Research', description: 'Read the offer, incentives, valuation, and demand.', tasks: [
    ['Navigate a DRHP and RHP efficiently', 'High', 'Intermediate'],
    ['Understand what GMP can and cannot signal', 'Medium', 'Intermediate'],
    ['Interpret QIB, NII, and RII subscription data', 'Medium', 'Intermediate'],
    ['Compare IPO valuation with relevant listed peers', 'High', 'Advanced'],
    ['Understand anchor investors and lock-in periods', 'Medium', 'Intermediate'],
  ]},
  { id: 'checklist', num: '10', name: 'Company-Analysis Checklist', description: 'Create a repeatable, evidence-first research process.', tasks: [
    ['Build the six-document company evidence pack', 'High', 'Intermediate'],
    ['Spot management red flags in concall language', 'High', 'Advanced'],
    ['Benchmark valuation against sector peers', 'Medium', 'Advanced'],
    ['Complete a full company teardown with the AI copilot', 'High', 'Advanced'],
  ]},
  { id: 'journal', num: '11', name: 'Trading Journal & Review Routine', description: 'Turn outcomes into feedback and better decisions.', tasks: [
    ['Set up a trade-journal template', 'High', 'Beginner'],
    ['Record entry and exit reasoning for every trade', 'High', 'Intermediate'],
    ['Complete a weekly win/loss review', 'Medium', 'Intermediate'],
    ['Track win rate and average R-multiple', 'Medium', 'Advanced'],
    ['Set and review one measurable monthly goal', 'Low', 'Beginner'],
  ]},
];

MODULES.forEach((module) => {
  module.tasks = module.tasks.map(([title, priority, difficulty], index) => ({
    id: `${module.id}-${index}`,
    title,
    priority,
    difficulty,
  }));
});

const DEFAULT_IPOS = [
  {
    id: 'purple-style-labs',
    symbol: 'PURPLE',
    name: 'Purple Style Labs Limited',
    exchange: 'NSE / BSE · Mainboard',
    openDate: '2026-08-20',
    closeDate: '2026-08-25',
    priceBand: '₹360 – ₹380',
    lotSize: '39 shares (₹14,820)',
    gmp: '₹54 (14.2% gain)',
    subscription: '28.02×',
    bids: '18,45,20,000 shares',
    sharesOffered: '65,85,000 shares',
    promoter: 'Abhishek Agarwal & High Networth Backers',
    link: 'https://www.chittorgarh.com/ipo/purple-style-labs-ipo/2670/',
    notes: 'Luxury fashion omnichannel retailer operating Pernia\'s Pop-Up Shop. Expanding physical presence across tier-1 cities with growing luxury designer partnerships.',
    source: 'seed',
  },
  {
    id: 'priority-jewels',
    symbol: 'PRIORITY',
    name: 'Priority Jewels Limited',
    exchange: 'NSE / BSE · Mainboard',
    openDate: '2026-08-21',
    closeDate: '2026-08-26',
    priceBand: '₹240 – ₹255',
    lotSize: '58 shares (₹14,790)',
    gmp: '₹32 (12.5% gain)',
    subscription: '13.19×',
    bids: '7,12,26,000 shares',
    sharesOffered: '54,00,000 shares',
    promoter: 'Shailesh Sangani & Family',
    link: 'https://www.chittorgarh.com/ipo/priority-jewels-ipo/2671/',
    notes: 'B2B studded diamond and gold jewellery manufacturer serving large retail chains in India and key export markets in the US and UAE.',
    source: 'seed',
  },
  {
    id: 'esds-software-solution',
    symbol: 'ESDS',
    name: 'ESDS Software Solution Limited',
    exchange: 'NSE / BSE · Mainboard',
    openDate: '2026-08-22',
    closeDate: '2026-08-27',
    priceBand: '₹160 – ₹175',
    lotSize: '85 shares (₹14,875)',
    gmp: '₹28 (16.0% gain)',
    subscription: '13.26×',
    bids: '6,40,00,000 shares',
    sharesOffered: '48,25,000 shares',
    promoter: 'Piyush Somani',
    link: 'https://www.chittorgarh.com/ipo/esds-software-solution-ipo/2672/',
    notes: 'Enterprise cloud computing, data center colocation, and managed IT services provider. Strong presence in government and BFSI sectors.',
    source: 'seed',
  },
  {
    id: 'lumino-industries',
    symbol: 'LUMINO',
    name: 'Lumino Industries Limited',
    exchange: 'NSE / BSE · Mainboard',
    openDate: '2026-08-24',
    closeDate: '2026-08-28',
    priceBand: '₹285 – ₹300',
    lotSize: '50 shares (₹15,000)',
    gmp: '₹18 (6.0% gain)',
    subscription: '0.68×',
    bids: '42,16,000 shares',
    sharesOffered: '62,00,000 shares',
    promoter: 'Goel Family & Associates',
    link: 'https://www.chittorgarh.com/ipo/lumino-industries-ipo/2673/',
    notes: 'Specialized manufacturing of power transmission conductors, overhead cables, and EPC turnkey services for state electricity boards and solar farms.',
    source: 'seed',
  },
  {
    id: 'ashutosh-fibre',
    symbol: 'ASHUTOSH',
    name: 'Ashutosh Fibre Products Limited',
    exchange: 'NSE Emerge · SME',
    openDate: '2026-08-25',
    closeDate: '2026-08-29',
    priceBand: '₹95 – ₹100',
    lotSize: '1200 shares (₹1,20,000)',
    gmp: '₹14 (14.0% gain)',
    subscription: '0.42×',
    bids: '8,40,00,000 shares',
    sharesOffered: '20,00,000 shares',
    promoter: 'Ashutosh V. & Management Team',
    link: 'https://www.chittorgarh.com/ipo/ashutosh-fibre-ipo/2674/',
    notes: 'High-density polyester and polypropylene fibre manufacturer catering to technical textiles, geo-textiles, and protective packaging.',
    source: 'seed',
  },
  {
    id: 'shanti-inorganics',
    symbol: 'SHANTI',
    name: 'Shanti Inorganics Limited',
    exchange: 'NSE Emerge · SME',
    openDate: '2026-08-26',
    closeDate: '2026-08-30',
    priceBand: '₹72 – ₹76',
    lotSize: '1600 shares (₹1,21,600)',
    gmp: '₹8 (10.5% gain)',
    subscription: '0.05×',
    bids: '1,20,000 shares',
    sharesOffered: '24,00,000 shares',
    promoter: 'Shanti Chemical Group',
    link: 'https://www.chittorgarh.com/ipo/shanti-inorganics-ipo/2675/',
    notes: 'Speciality chemicals and inorganic chemical compounds for agrochemical, dye, and pharmaceutical intermediates.',
    source: 'seed',
  },
];

const STORAGE_KEY = 'marketmind-ai-v1';
const TOUR_STORAGE_KEY = 'marketmind-tour-seen-v1';
const TOUR_STEPS = [
  {
    kicker: 'Command center',
    title: 'See the whole workspace at a glance',
    description: 'Overview summarizes your learning progress, active IPO queue, current module, and AI connection. Use it as the starting point for every research session.',
    view: 'dashboard',
    targets: ['.hero-panel'],
  },
  {
    kicker: 'Learning path',
    title: 'Build skills one checkbox at a time',
    description: 'Open a module, tick lessons as you finish them, and filter by status, priority, or difficulty. Progress is saved automatically in this browser.',
    view: 'learning',
    targets: ['.learning-toolbar'],
  },
  {
    kicker: 'Live IPO feed',
    title: 'Know where every IPO figure came from',
    description: 'IPO Watch asks the server for current NSE mainboard issues. This banner tells you whether the page is showing live, cached, or saved fallback data; Refresh live checks again.',
    view: 'ipos',
    targets: ['#ipo-source-banner'],
  },
  {
    kicker: 'Due diligence',
    title: 'Turn an IPO card into a research file',
    description: 'Record promoter details, GMP context, subscription figures, links, and your own notes. Use Analyze with AI when you are ready to attach the RHP and question the evidence.',
    view: 'ipos',
    targets: ['#ipo-list .ipo-card', '#ipo-list'],
  },
  {
    kicker: 'Strategy Simpler',
    title: 'Start from the verified video strategy',
    description: 'The catalog contains four verified strategies: 1% Athishaktham (NIFTY options), 20 EMA Pullback Swing (equity), Futures Convergence Magic (arbitrage), and Covered Call Income (stock + option income). Select a card to see the plain-language rules and editable example.',
    view: 'strategies',
    targets: ['#strategy-catalog'],
  },
  {
    kicker: 'Decision formula',
    title: 'Write why the range should hold',
    description: 'Set the upper and lower levels NIFTY should not cross, then record your reason for each. The worksheet builds all four option legs and calculates each side’s premium difference, maximum profit, and 3× stop automatically.',
    view: 'strategies',
    strategyDetail: true,
    targets: ['#strategy-formula-panel'],
  },
  {
    kicker: 'Trading chart',
    title: 'Check the range against real price action',
    description: 'The interactive NIFTY chart provides candles, time intervals, indicators, and drawing tools. The level strip above it mirrors the lower boundary, current spot, and upper boundary from your worksheet so technical context stays connected to the strategy.',
    view: 'strategies',
    strategyDetail: true,
    targets: ['#strategy-market-chart-panel'],
  },
  {
    kicker: 'Real market sample',
    title: 'Load real quotes without risking money',
    description: 'This panel loads the latest official NSE NIFTY spot, expiry, permitted lot size, and option bid/ask prices. Start paper trade records simulated fills only—no broker account or real order is involved.',
    view: 'strategies',
    strategyDetail: true,
    targets: ['#live-paper-panel'],
  },
  {
    kicker: 'Risk before reward',
    title: 'Test the payoff and stop before a trade',
    description: 'Change spot, strikes, premiums, lot size, or capital and the payoff chart updates automatically. Enter live broker P&L in the tracker to see whether either side has reached its planned stop.',
    view: 'strategies',
    strategyDetail: true,
    targets: ['.strategy-detail-grid'],
  },
  {
    kicker: 'AI copilot',
    title: 'Ask questions against real evidence',
    description: 'Choose a research mode and company context, attach filings or charts, then ask in plain language. The AI can make mistakes, so confirm important figures against primary documents.',
    view: 'dashboard',
    openCoach: true,
    targets: ['#coach-panel'],
  },
  {
    kicker: 'Keep your work',
    title: 'Export a backup whenever you want',
    description: 'Your checks, notes, manual IPOs, and chat display history stay in this browser. Export creates a backup file; Import restores that saved workspace later.',
    view: 'dashboard',
    mobileMenu: true,
    targets: ['.sidebar-footer'],
  },
];
const state = loadState();
let currentUser = null;
let currentProfile = null;
let allUsersList = [];
let adminFilter = 'all';
let adminSearchTerm = '';
let openModules = new Set([firstIncompleteModule()?.id || MODULES[0].id]);
let pendingAttachments = [];
let aiHealth = { configured: false, model: 'Gemini' };
let isSending = false;
let toastTimer;
let activeStrategyId = null;
let strategyInputs = null;
let liveMarketData = null;
let liveMarketSetup = null;
let strategyInputMode = 'video';
let isMarketLoading = false;
let paperTrade = null;
let paperTradeRefreshTimer = null;
const formulaBoundaryTimers = {};
let tourIndex = -1;
let tourRestoreHash = '#dashboard';
let tourRestoreStrategyId = null;
let tourCoachWasOpen = false;
let tourReturnFocus = null;
let tourPositionTimer;
let tourAutostartScheduled = false;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

init();

async function init() {
  $('#today-label').textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date());
  bindNavigation();
  bindLearning();
  bindIpos();
  bindSyncModal();
  bindStrategies();
  bindChat();
  bindBackup();
  bindTour();
  bindAuth();
  applyCoachMinimizedState();
  renderAll();
  routeFromHash();
  await Promise.all([checkAI(), syncLiveIpos(), initFirebaseAuth()]);
  maybeStartTour();
}

function defaultState() {
  return { taskState: {}, ipos: [], messages: [], liveMeta: null, strategyWorksheet: normalizeStrategyWorksheet(), coachMinimized: false };
}

function normalizeStrategyWorksheet(value = {}) {
  return {
    thesisReason: String(value?.thesisReason || '').slice(0, 500),
    upperReason: String(value?.upperReason || '').slice(0, 500),
    lowerReason: String(value?.lowerReason || '').slice(0, 500),
  };
}

function mergeWithDefaults(existing = [], defaults = DEFAULT_IPOS) {
  const result = [...existing];
  for (const def of defaults) {
    const existingIndex = result.findIndex((item) =>
      item.id === def.id ||
      (item.symbol && def.symbol && item.symbol.toUpperCase() === def.symbol.toUpperCase()) ||
      normalizeCompanyName(item.name) === normalizeCompanyName(def.name)
    );
    if (existingIndex >= 0) {
      result[existingIndex] = {
        ...def,
        ...result[existingIndex],
        priceBand: result[existingIndex].priceBand || def.priceBand,
        lotSize: result[existingIndex].lotSize || def.lotSize,
        gmp: result[existingIndex].gmp || def.gmp,
        subscription: result[existingIndex].subscription || def.subscription,
        bids: result[existingIndex].bids || def.bids,
        sharesOffered: result[existingIndex].sharesOffered || def.sharesOffered,
        promoter: result[existingIndex].promoter || def.promoter,
        notes: result[existingIndex].notes || def.notes,
        link: result[existingIndex].link || def.link,
      };
    } else {
      result.push(structuredClone(def));
    }
  }
  return result;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const ipos = Array.isArray(parsed?.ipos) ? parsed.ipos.filter((ipo) => ipo?.source !== 'seed') : [];
    return {
      taskState: parsed?.taskState && typeof parsed.taskState === 'object' ? parsed.taskState : {},
      ipos,
      messages: Array.isArray(parsed?.messages) ? parsed.messages.slice(-30) : [],
      liveMeta: parsed?.liveMeta || null,
      strategyWorksheet: normalizeStrategyWorksheet(parsed?.strategyWorksheet),
      coachMinimized: Boolean(parsed?.coachMinimized),
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    taskState: state.taskState,
    ipos: state.ipos,
    messages: state.messages.slice(-30),
    liveMeta: state.liveMeta,
    strategyWorksheet: state.strategyWorksheet,
    coachMinimized: Boolean(state.coachMinimized),
  }));
}

function renderAll() {
  renderLearning();
  renderIpos();
  renderStrategyCatalog();
  renderDashboard();
  renderChat();
  populateChatIpos();
}

function bindNavigation() {
  window.addEventListener('hashchange', routeFromHash);
  $$('[data-nav]').forEach((link) => link.addEventListener('click', () => closeMobileMenu()));
  $$('[data-go]').forEach((button) => button.addEventListener('click', () => navigate(button.dataset.go)));
  $('#mobile-menu-button').addEventListener('click', toggleMobileMenu);
  $('#menu-scrim').addEventListener('click', closeMobileMenu);
}

function navigate(view) {
  window.location.hash = view;
}

function routeFromHash() {
  const requested = location.hash.slice(1);
  let view = ['dashboard', 'learning', 'ipos', 'strategies', 'admin'].includes(requested) ? requested : 'dashboard';

  // Guard admin route
  if (view === 'admin') {
    const isAdmin = currentProfile?.role === 'admin' || (currentUser?.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (!isAdmin) {
      toast('Access restricted: Administrator role required.');
      view = 'dashboard';
      location.hash = 'dashboard';
    }
  }

  $$('.page-view').forEach((item) => item.classList.toggle('active', item.dataset.view === view));
  $$('.nav-item[data-nav]').forEach((item) => item.classList.toggle('active', item.dataset.nav === view));
  const viewTitle = { dashboard: 'Overview', learning: 'Learning Path', ipos: 'IPO Watch', strategies: 'Strategies', admin: 'Admin Approvals' }[view];
  document.title = `${viewTitle} — MarketMind AI`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
  const open = !$('#sidebar').classList.contains('open');
  $('#sidebar').classList.toggle('open', open);
  $('#menu-scrim').classList.toggle('active', open);
  $('#mobile-menu-button').setAttribute('aria-expanded', String(open));
}

function closeMobileMenu() {
  $('#sidebar').classList.remove('open');
  $('#menu-scrim').classList.remove('active');
  $('#mobile-menu-button').setAttribute('aria-expanded', 'false');
}

function bindTour() {
  $('#start-tour-button').addEventListener('click', startTour);
  $('#tour-close-button').addEventListener('click', () => endTour(false));
  $('#tour-back-button').addEventListener('click', () => showTourStep(tourIndex - 1));
  $('#tour-next-button').addEventListener('click', () => {
    if (tourIndex === TOUR_STEPS.length - 1) endTour(true);
    else showTourStep(tourIndex + 1);
  });

  window.addEventListener('resize', () => {
    if (tourIndex >= 0) positionTourStep();
  });
  window.addEventListener('keydown', (event) => {
    if (tourIndex < 0) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      endTour(false);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      $('#tour-next-button').click();
    } else if (event.key === 'ArrowLeft' && tourIndex > 0) {
      event.preventDefault();
      showTourStep(tourIndex - 1);
    } else if (event.key === 'Tab') {
      trapTourFocus(event);
    }
  });
}

function maybeStartTour() {
  const isSuperAdmin = (currentUser?.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const hasWorkspaceAccess = Boolean(currentUser && (isSuperAdmin || currentProfile?.status === 'approved'));
  if (!hasWorkspaceAccess || tourAutostartScheduled) return;
  try {
    if (!localStorage.getItem(TOUR_STORAGE_KEY)) {
      tourAutostartScheduled = true;
      setTimeout(() => startTour(), 650);
    }
  } catch {
    // The replay button still works if browser storage is unavailable.
  }
}

function startTour() {
  if (tourIndex >= 0) return;
  tourRestoreHash = location.hash || '#dashboard';
  tourRestoreStrategyId = activeStrategyId;
  tourCoachWasOpen = $('#coach-panel').classList.contains('open');
  tourReturnFocus = document.activeElement;
  $('#ipo-modal').hidden = true;
  $('#tour-layer').hidden = false;
  document.body.classList.add('tour-open');
  showTourStep(0);
}

function showTourStep(nextIndex) {
  if (nextIndex < 0 || nextIndex >= TOUR_STEPS.length) return;
  tourIndex = nextIndex;
  const step = TOUR_STEPS[tourIndex];

  if (!step.openCoach && !tourCoachWasOpen) closeCoach();
  if (step.view) {
    location.hash = `#${step.view}`;
    routeFromHash();
  }
  if (step.view === 'strategies' && !step.strategyDetail && activeStrategyId) closeStrategy();
  if (step.strategyDetail) openStrategy(STRATEGIES[0].id);
  if (step.openCoach) openCoach();

  closeMobileMenu();
  if (step.mobileMenu && window.matchMedia('(max-width: 820px)').matches) {
    $('#sidebar').classList.add('open');
    $('#menu-scrim').classList.remove('active');
    $('#mobile-menu-button').setAttribute('aria-expanded', 'true');
  }

  $('#tour-step-count').textContent = `Step ${tourIndex + 1} of ${TOUR_STEPS.length}`;
  $('#tour-kicker').textContent = step.kicker;
  $('#tour-title').textContent = step.title;
  $('#tour-description').textContent = step.description;
  $('#tour-back-button').disabled = tourIndex === 0;
  $('#tour-next-button').textContent = tourIndex === TOUR_STEPS.length - 1 ? 'Finish tour' : 'Next';
  $('#tour-progress-bar').style.width = `${(tourIndex + 1) / TOUR_STEPS.length * 100}%`;
  $('#tour-dots').innerHTML = TOUR_STEPS.map((_, index) => `<i class="${index < tourIndex ? 'done' : index === tourIndex ? 'current' : ''}"></i>`).join('');

  clearTimeout(tourPositionTimer);
  requestAnimationFrame(() => {
    const target = getTourTarget(step);
    const isFixedArea = target?.closest('.topbar, .sidebar, .coach-panel');
    if (target && !isFixedArea) target.scrollIntoView({ block: 'center', behavior: 'smooth' });
    tourPositionTimer = setTimeout(() => {
      positionTourStep();
      $('#tour-next-button').focus();
    }, isFixedArea ? 60 : 330);
  });
}

function getTourTarget(step = TOUR_STEPS[tourIndex]) {
  if (!step) return null;
  for (const selector of step.targets || []) {
    const element = $(selector);
    if (element && element.getClientRects().length) return element;
  }
  return null;
}

function positionTourStep() {
  if (tourIndex < 0 || $('#tour-layer').hidden) return;
  const target = getTourTarget();
  const highlight = $('#tour-highlight');
  const card = $('#tour-card');
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const edge = 10;
  const gap = 16;

  if (!target) {
    highlight.style.display = 'none';
    card.style.left = `${Math.max(12, (viewportWidth - card.offsetWidth) / 2)}px`;
    card.style.top = `${Math.max(12, (viewportHeight - card.offsetHeight) / 2)}px`;
    return;
  }

  highlight.style.display = 'block';
  const raw = target.getBoundingClientRect();
  const left = Math.max(edge, raw.left - 8);
  const top = Math.max(edge, raw.top - 8);
  const right = Math.min(viewportWidth - edge, raw.right + 8);
  const bottom = Math.min(viewportHeight - edge, raw.bottom + 8);
  highlight.style.left = `${left}px`;
  highlight.style.top = `${top}px`;
  highlight.style.width = `${Math.max(38, right - left)}px`;
  highlight.style.height = `${Math.max(38, bottom - top)}px`;

  card.style.left = '12px';
  card.style.top = '12px';
  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const candidates = [
    { left: right + gap, top },
    { left: left - cardWidth - gap, top },
    { left: Math.min(viewportWidth - cardWidth - edge, Math.max(edge, left)), top: bottom + gap },
    { left: Math.min(viewportWidth - cardWidth - edge, Math.max(edge, left)), top: top - cardHeight - gap },
  ];
  const fit = candidates.find((item) => item.left >= edge && item.top >= edge && item.left + cardWidth <= viewportWidth - edge && item.top + cardHeight <= viewportHeight - edge);
  const chosen = fit || {
    left: Math.min(viewportWidth - cardWidth - edge, Math.max(edge, raw.left + raw.width / 2 - cardWidth / 2)),
    top: Math.min(viewportHeight - cardHeight - edge, Math.max(edge, raw.top + raw.height / 2 - cardHeight / 2)),
  };
  card.style.left = `${chosen.left}px`;
  card.style.top = `${chosen.top}px`;
}

function trapTourFocus(event) {
  const focusable = $$('button:not([disabled])', $('#tour-card'));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function endTour(completed) {
  if (tourIndex < 0) return;
  clearTimeout(tourPositionTimer);
  $('#tour-layer').hidden = true;
  document.body.classList.remove('tour-open');
  tourIndex = -1;
  try { localStorage.setItem(TOUR_STORAGE_KEY, 'true'); } catch { /* Replay remains available. */ }

  closeMobileMenu();
  if (activeStrategyId) closeStrategy();
  location.hash = tourRestoreHash;
  routeFromHash();
  if (tourRestoreHash === '#strategies' && tourRestoreStrategyId) openStrategy(tourRestoreStrategyId);
  if (tourCoachWasOpen) openCoach();
  else closeCoach();
  if (tourReturnFocus?.focus) tourReturnFocus.focus();
  toast(completed ? 'Tour complete. You can replay it from the Tour button.' : 'Tour closed. Replay it anytime from the top bar.');
}

function taskStats() {
  const tasks = MODULES.flatMap((module) => module.tasks);
  const done = tasks.filter((task) => state.taskState[task.id]).length;
  return { total: tasks.length, done, left: tasks.length - done, pct: tasks.length ? Math.round(done / tasks.length * 100) : 0 };
}

function moduleStats(module) {
  const done = module.tasks.filter((task) => state.taskState[task.id]).length;
  return { done, total: module.tasks.length, pct: Math.round(done / module.tasks.length * 100) };
}

function firstIncompleteModule() {
  return MODULES.find((module) => module.tasks.some((task) => !state.taskState[task.id]));
}

function bindLearning() {
  ['#filter-status', '#filter-priority', '#filter-difficulty'].forEach((selector) => $(selector).addEventListener('change', renderLearning));
  $('#module-list').addEventListener('click', (event) => {
    const moduleButton = event.target.closest('[data-module-toggle]');
    if (moduleButton) {
      const id = moduleButton.dataset.moduleToggle;
      openModules.has(id) ? openModules.delete(id) : openModules.add(id);
      renderLearning();
    }
  });
  $('#module-list').addEventListener('change', (event) => {
    if (!event.target.matches('[data-task-id]')) return;
    state.taskState[event.target.dataset.taskId] = event.target.checked;
    saveState();
    renderAll();
  });
}

function renderLearning() {
  const stats = taskStats();
  $('#learning-done-count').textContent = stats.done;
  $('#learning-left-count').textContent = stats.left;
  $('#learning-orbit').style.setProperty('--progress', `${stats.pct * 3.6}deg`);
  $('#learning-orbit span').textContent = `${stats.pct}%`;
  $('#nav-learning-count').textContent = `${stats.pct}%`;

  const filters = {
    status: $('#filter-status').value,
    priority: $('#filter-priority').value,
    difficulty: $('#filter-difficulty').value,
  };

  const html = MODULES.map((module) => {
    const visible = module.tasks.filter((task) => {
      if (filters.status === 'done' && !state.taskState[task.id]) return false;
      if (filters.status === 'pending' && state.taskState[task.id]) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.difficulty !== 'all' && task.difficulty !== filters.difficulty) return false;
      return true;
    });
    if (!visible.length) return '';
    const progress = moduleStats(module);
    const expanded = openModules.has(module.id) || filters.status !== 'all' || filters.priority !== 'all' || filters.difficulty !== 'all';
    const lessons = visible.map((task) => `
      <label class="lesson-row ${state.taskState[task.id] ? 'done' : ''}">
        <input type="checkbox" data-task-id="${task.id}" ${state.taskState[task.id] ? 'checked' : ''}>
        <span class="checkmark">✓</span>
        <span class="lesson-title">${escapeHTML(task.title)}</span>
        <span class="tag ${task.priority.toLowerCase()}">${task.priority}</span>
        <span class="tag">${task.difficulty}</span>
      </label>`).join('');
    return `
      <article class="module-card panel ${expanded ? 'open' : ''}">
        <button class="module-head" type="button" data-module-toggle="${module.id}" aria-expanded="${expanded}">
          <span class="module-index">${module.num}</span>
          <span class="module-title"><strong>${escapeHTML(module.name)}</strong><small>${escapeHTML(module.description)}</small></span>
          <span class="module-progress"><i style="width:${progress.pct}%"></i></span>
          <span class="module-count">${progress.done}/${progress.total}</span>
          <span class="module-chevron">›</span>
        </button>
        <div class="lesson-list">${lessons}</div>
      </article>`;
  }).join('');
  $('#module-list').innerHTML = html || '<div class="empty-state panel">No lessons match these filters.</div>';
}

function bindIpos() {
  $('#refresh-ipos-button').addEventListener('click', () => syncLiveIpos(true));
  $('#add-ipo-button').addEventListener('click', openIpoModal);
  $('#close-ipo-modal').addEventListener('click', closeIpoModal);
  $('#cancel-ipo-modal').addEventListener('click', closeIpoModal);
  $('#ipo-modal').addEventListener('click', (event) => { if (event.target === $('#ipo-modal')) closeIpoModal(); });
  $('#ipo-form').addEventListener('submit', addIpo);
  $('#ipo-list').addEventListener('change', updateIpoField);
  $('#ipo-list').addEventListener('input', debounce(updateIpoField, 220));
  $('#ipo-list').addEventListener('click', (event) => {
    const analyze = event.target.closest('[data-analyze-ipo]');
    if (analyze) analyzeIpo(analyze.dataset.analyzeIpo);
    const remove = event.target.closest('[data-remove-ipo]');
    if (remove) removeIpo(remove.dataset.removeIpo);
  });
}

function openIpoModal() {
  $('#ipo-form').reset();
  $('#ipo-modal').hidden = false;
  setTimeout(() => $('#ipo-form [name=name]').focus(), 0);
}

function closeIpoModal() {
  $('#ipo-modal').hidden = true;
}

function addIpo(event) {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const name = String(data.get('name') || '').trim();
  if (!name) return;
  state.ipos.unshift({
    id: `${slugify(name)}-${Date.now()}`,
    symbol: String(data.get('symbol') || '').toUpperCase().trim(),
    name,
    exchange: String(data.get('exchange') || 'NSE / BSE · Mainboard'),
    openDate: String(data.get('openDate') || ''),
    closeDate: String(data.get('closeDate') || ''),
    priceBand: String(data.get('priceBand') || ''),
    lotSize: String(data.get('lotSize') || ''),
    gmp: String(data.get('gmp') || ''),
    subscription: String(data.get('subscription') || ''),
    sharesOffered: String(data.get('sharesOffered') || ''),
    bids: String(data.get('bids') || ''),
    promoter: String(data.get('promoter') || ''),
    link: String(data.get('link') || ''),
    notes: String(data.get('notes') || ''),
    source: 'manual',
  });
  saveState();
  closeIpoModal();
  renderAll();
  toast(`${name} added to your research queue.`);
}

function updateIpoField(event) {
  const input = event.target.closest('[data-ipo-field]');
  if (!input) return;
  const ipo = state.ipos.find((item) => item.id === input.dataset.ipoId);
  if (!ipo) return;
  ipo[input.dataset.ipoField] = input.value;
  saveState();
  renderDashboard();
  renderIpoSummary();
}

function removeIpo(id) {
  const ipo = state.ipos.find((item) => item.id === id);
  if (!ipo || !window.confirm(`Remove ${ipo.name} and its notes from this dashboard?`)) return;
  state.ipos = state.ipos.filter((item) => item.id !== id);
  saveState();
  renderAll();
  toast('IPO removed from the watchlist.');
}

function renderIpos() {
  $('#nav-ipo-count').textContent = state.ipos.length;
  $('#ipo-list').innerHTML = state.ipos.length ? state.ipos.map(ipoCardHTML).join('') : '<div class="empty-state panel">Your IPO watchlist is empty. Add an IPO or sync with Google Sheets to begin.</div>';
  renderIpoSummary();
  renderIpoSource();
}

function ipoCardHTML(ipo) {
  const status = ipoStatus(ipo);
  const initials = ipo.name.split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  const safeLink = safeURL(ipo.link);
  return `
    <article class="ipo-card panel">
      <div class="ipo-card-head">
        <div class="ipo-title-wrap">
          <span class="company-avatar">${escapeHTML(initials)}</span>
          <div>
            <h2>${escapeHTML(ipo.name)} ${ipo.symbol ? `<span class="symbol-tag">(${escapeHTML(ipo.symbol)})</span>` : ''}</h2>
            <div class="ipo-subtitle">${ipo.source === 'nse' ? '● LIVE FROM NSE · ' : ''}${escapeHTML(ipo.exchange || 'Mainboard IPO')}</div>
          </div>
        </div>
        <div class="ipo-card-dates">
          <span class="date-pair"><span>Opens</span><strong>${formatDate(ipo.openDate)}</strong></span>
          <span class="date-pair"><span>Closes</span><strong>${formatDate(ipo.closeDate)}</strong></span>
          <span class="status ${status.key}">${status.label}</span>
        </div>
      </div>

      <div class="ipo-facts">
        ${ipoFactInput(ipo, 'priceBand', 'Price band', '₹ —')}
        ${ipoFactInput(ipo, 'lotSize', 'Lot size', '— shares')}
        ${ipoFactInput(ipo, 'gmp', 'GMP · Grey Market', '₹ —')}
        ${ipoFactInput(ipo, 'subscription', 'Subscription', '—×')}
      </div>

      <div class="ipo-facts">
        ${ipoFactInput(ipo, 'sharesOffered', 'Shares offered', '—')}
        ${ipoFactInput(ipo, 'bids', 'Total bids', '—')}
        ${ipoFactInput(ipo, 'openDate', 'Issue open date (YYYY-MM-DD)', 'YYYY-MM-DD')}
        ${ipoFactInput(ipo, 'closeDate', 'Issue close date (YYYY-MM-DD)', 'YYYY-MM-DD')}
      </div>

      <div class="ipo-facts">
        ${ipoFactInput(ipo, 'promoter', 'Parent / promoter group', 'Add promoter details', true)}
        ${ipoFactInput(ipo, 'link', 'RHP / official detail URL', 'https://...', true)}
      </div>

      <textarea class="ipo-notes" data-ipo-id="${escapeAttr(ipo.id)}" data-ipo-field="notes" placeholder="Record business quality, use of proceeds, valuation, promoter concerns, GMP context, and questions for the AI…">${escapeHTML(ipo.notes || '')}</textarea>

      <div class="ipo-actions">
        <button class="button primary compact" type="button" data-analyze-ipo="${escapeAttr(ipo.id)}">✦ Analyze with AI</button>
        ${safeLink ? `<a class="external-link" href="${escapeAttr(safeLink)}" target="_blank" rel="noopener noreferrer">Open source ↗</a>` : ''}
        <button class="button danger compact remove-ipo" type="button" data-remove-ipo="${escapeAttr(ipo.id)}">Remove</button>
      </div>
    </article>`;
}

function ipoFactInput(ipo, field, label, placeholder, wide = false) {
  return `<label class="ipo-fact"${wide ? ' style="grid-column:span 2"' : ''}><span>${label}</span><input value="${escapeAttr(ipo[field] || '')}" placeholder="${escapeAttr(placeholder)}" data-ipo-id="${escapeAttr(ipo.id)}" data-ipo-field="${field}"></label>`;
}

function renderIpoSummary() {
  const statuses = state.ipos.map(ipoStatus);
  $('#ipo-strip-open').textContent = statuses.filter((item) => ['open', 'closing'].includes(item.key)).length;
  $('#ipo-strip-closing').textContent = statuses.filter((item) => item.key === 'closing').length;
  $('#ipo-strip-upcoming').textContent = statuses.filter((item) => item.key === 'upcoming').length;
  $('#ipo-strip-research').textContent = state.ipos.filter((item) => item.notes?.trim()).length;
}

async function syncLiveIpos(force = false) {
  const button = $('#refresh-ipos-button');
  button.classList.add('loading');
  button.disabled = true;
  $('#ipo-source-title').textContent = 'Refreshing from NSE India…';
  $('#ipo-source-detail').textContent = 'Your saved research notes and custom values will be preserved.';
  try {
    const response = await fetch(`/api/ipos/live${force ? '?refresh=1' : ''}`, { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Live request failed (${response.status})`);
    if (!Array.isArray(payload.ipos)) throw new Error('The live source returned an invalid response.');
    state.ipos = mergeLiveIpos(payload.ipos);
    state.liveMeta = {
      source: payload.source || 'NSE India',
      sourceUrl: payload.sourceUrl || 'https://www.nseindia.com/market-data/all-upcoming-issues-ipo',
      fetchedAt: payload.fetchedAt || new Date().toISOString(),
      stale: Boolean(payload.stale),
      count: state.ipos.length,
    };
    saveState();
    renderAll();
    if (force) toast(`${state.ipos.length} active and upcoming IPOs synced from NSE.`);
  } catch (error) {
    state.liveMeta = {
      ...(state.liveMeta || {}),
      stale: true,
      error: error.message,
    };
    saveState();
    renderIpoSource();
    if (force) toast('NSE could not be reached. Showing your saved records.');
  } finally {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function mergeLiveIpos(liveIpos) {
  const existing = state.ipos;
  const merged = existing.filter((ipo) => ipo?.source !== 'nse' && ipo?.source !== 'seed');

  for (const live of liveIpos) {
    const existingIndex = merged.findIndex((ipo) =>
      ipo.id === live.id ||
      (ipo.symbol && live.symbol && ipo.symbol.toUpperCase() === live.symbol.toUpperCase()) ||
      normalizeCompanyName(ipo.name) === normalizeCompanyName(live.name)
    );

    if (existingIndex >= 0) {
      merged[existingIndex] = {
        ...live,
        ...merged[existingIndex],
        openDate: live.openDate || merged[existingIndex].openDate,
        closeDate: live.closeDate || merged[existingIndex].closeDate,
        priceBand: live.priceBand || merged[existingIndex].priceBand,
        lotSize: live.lotSize || merged[existingIndex].lotSize,
        subscription: live.subscription || merged[existingIndex].subscription,
        bids: live.bids || merged[existingIndex].bids,
        sharesOffered: live.sharesOffered || merged[existingIndex].sharesOffered,
        source: 'nse',
      };
    } else {
      merged.push({
        ...live,
        gmp: '',
        promoter: '',
        notes: '',
        source: 'nse',
      });
    }
  }
  return merged;
}

function renderIpoSource() {
  const banner = $('#ipo-source-banner');
  const title = $('#ipo-source-title');
  const detail = $('#ipo-source-detail');
  const icon = $('#ipo-source-icon');
  const link = $('#ipo-source-link');
  banner.classList.remove('live', 'stale');

  if (!state.liveMeta) {
    title.textContent = 'Connecting to market feeds…';
    detail.textContent = 'All tracked records remain available.';
    icon.textContent = '↻';
    return;
  }

  if (state.liveMeta.stale) {
    banner.classList.add('stale');
    title.textContent = 'Live feed is temporarily offline.';
    detail.textContent = state.liveMeta.fetchedAt
      ? `Showing saved records from ${formatTimestamp(state.liveMeta.fetchedAt)}.`
      : 'Showing saved records. Use Refresh live or Google Sheets Sync to update.';
    icon.textContent = '!';
  } else {
    banner.classList.add('live');
    title.textContent = `IPOs synchronized with ${state.liveMeta.source}.`;
    detail.textContent = `${state.ipos.length} active and upcoming issues · updated ${formatTimestamp(state.liveMeta.fetchedAt)}.`;
    icon.textContent = '✓';
  }
  if (state.liveMeta.sourceUrl) link.href = safeURL(state.liveMeta.sourceUrl) || link.href;
}

function ipoStatus(ipo) {
  const today = localISODate();
  if (!ipo.openDate || !ipo.closeDate) return { key: 'upcoming', label: 'Dates needed' };
  if (today < ipo.openDate) return { key: 'upcoming', label: 'Upcoming' };
  if (today > ipo.closeDate) return { key: 'closed', label: 'Closed' };
  if (today === ipo.closeDate) return { key: 'closing', label: 'Closes today' };
  return { key: 'open', label: 'Open now' };
}

function renderDashboard() {
  const stats = taskStats();
  const current = firstIncompleteModule();
  const openCount = state.ipos.filter((ipo) => ['open', 'closing'].includes(ipoStatus(ipo).key)).length;
  const upcomingCount = state.ipos.filter((ipo) => ipoStatus(ipo).key === 'upcoming').length;
  const totalTracked = state.ipos.length;

  $('#metric-progress').textContent = `${stats.pct}%`;
  $('#metric-progress-bar').style.width = `${stats.pct}%`;
  $('#metric-progress-copy').textContent = `${stats.done} of ${stats.total} lessons complete`;
  $('#metric-current-module').textContent = current?.name || 'Curriculum complete';
  $('#metric-current-copy').textContent = current ? `${moduleStats(current).done} of ${current.tasks.length} lessons done` : 'Excellent work';
  $('#metric-open-ipos').textContent = totalTracked;
  $('#metric-ipo-copy').textContent = `${openCount} open now · ${upcomingCount} upcoming`;

  $('#dashboard-learning-list').innerHTML = MODULES.slice(0, 4).map((module) => {
    const progress = moduleStats(module);
    return `<div class="module-preview-row"><span class="module-number">${module.num}</span><span><strong>${escapeHTML(module.name)}</strong><small>${progress.done} of ${progress.total} complete</small></span><span class="row-progress"><i style="width:${progress.pct}%"></i></span><em>${progress.pct}%</em></div>`;
  }).join('');

  const prioritized = [...state.ipos].sort((a, b) => {
    const order = { closing: 0, open: 1, upcoming: 2, closed: 3 };
    return order[ipoStatus(a).key] - order[ipoStatus(b).key];
  });

  $('#dashboard-ipo-list').innerHTML = prioritized.length ? prioritized.map((ipo) => {
    const status = ipoStatus(ipo);
    const subText = ipo.subscription ? ` · ${escapeHTML(ipo.subscription)} sub` : '';
    const gmpText = ipo.gmp ? ` · GMP ${escapeHTML(ipo.gmp)}` : '';
    return `
      <div class="ipo-mini">
        <div class="ipo-mini-top">
          <div>
            <strong>${escapeHTML(ipo.name)}</strong>
            <small>${escapeHTML(ipo.priceBand || 'Price band not added')}${subText}${gmpText} · closes ${formatDate(ipo.closeDate)}</small>
          </div>
          <span class="status ${status.key}">${status.label}</span>
        </div>
      </div>`;
  }).join('') : '<div class="empty-state">No IPOs tracked.</div>';
}

/* ================= GOOGLE SHEETS & CSV DATA SYNC ================= */

let selectedSyncFile = null;

function bindSyncModal() {
  const openBtn = $('#open-sheet-sync-button');
  const modal = $('#ipo-sync-modal');
  const closeBtn = $('#close-ipo-sync-modal');

  if (openBtn) openBtn.addEventListener('click', openSyncModal);
  if (closeBtn) closeBtn.addEventListener('click', closeSyncModal);
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeSyncModal();
    });
  }

  // Cancel buttons inside tabs
  $('#cancel-sync-url-btn')?.addEventListener('click', closeSyncModal);
  $('#cancel-sync-paste-btn')?.addEventListener('click', closeSyncModal);
  $('#cancel-sync-file-btn')?.addEventListener('click', closeSyncModal);
  $('#close-export-tab-btn')?.addEventListener('click', closeSyncModal);

  // Tab switching
  const tabs = [
    { btn: '#tab-sheet-url', content: '#content-sheet-url' },
    { btn: '#tab-sheet-paste', content: '#content-sheet-paste' },
    { btn: '#tab-sheet-upload', content: '#content-sheet-upload' },
    { btn: '#tab-sheet-export', content: '#content-sheet-export' },
  ];

  tabs.forEach(({ btn, content }) => {
    $(btn)?.addEventListener('click', () => {
      tabs.forEach((t) => {
        $(t.btn)?.classList.remove('active');
        const c = $(t.content);
        if (c) c.hidden = true;
      });
      $(btn)?.classList.add('active');
      const targetContent = $(content);
      if (targetContent) targetContent.hidden = false;
      if (btn === '#tab-sheet-export') {
        $('#export-count-label').textContent = `${state.ipos.length} IPOs`;
      }
    });
  });

  // Action: Google Sheets URL Fetch
  $('#fetch-sheet-url-btn')?.addEventListener('click', handleSheetUrlFetch);

  // Action: Paste Rows Import
  $('#import-pasted-data-btn')?.addEventListener('click', handlePastedDataImport);

  // Action: File upload
  const dropZone = $('#file-drop-zone');
  const fileInput = $('#sync-file-input');
  const importFileBtn = $('#import-uploaded-file-btn');

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files?.length) {
        processSyncFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files?.length) {
        processSyncFile(e.target.files[0]);
      }
    });
  }

  if (importFileBtn) {
    importFileBtn.addEventListener('click', handleImportUploadedFile);
  }

  // Action: Export CSV
  $('#download-csv-btn')?.addEventListener('click', exportIposToCsv);
}

function openSyncModal() {
  const modal = $('#ipo-sync-modal');
  if (!modal) return;
  modal.hidden = false;
  $('#export-count-label').textContent = `${state.ipos.length} IPOs`;
}

function closeSyncModal() {
  const modal = $('#ipo-sync-modal');
  if (modal) modal.hidden = true;
}

async function handleSheetUrlFetch() {
  const input = $('#sync-sheet-url-input');
  const button = $('#fetch-sheet-url-btn');
  const url = (input?.value || '').trim();

  if (!url) {
    toast('Please enter a Google Sheets or CSV URL.');
    input?.focus();
    return;
  }

  button.classList.add('loading');
  button.disabled = true;

  try {
    const res = await fetch('/api/ipos/sync-sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch spreadsheet');

    const parsedIpos = parseCsvIpos(data.csv);
    if (!parsedIpos.length) {
      throw new Error('No valid IPO rows could be parsed from the spreadsheet. Check columns.');
    }

    state.ipos = mergeWithDefaults(state.ipos, parsedIpos);
    state.liveMeta = {
      source: 'Google Sheets / Online Sync',
      sourceUrl: url,
      fetchedAt: new Date().toISOString(),
      stale: false,
      count: state.ipos.length,
    };
    saveState();
    renderAll();
    closeSyncModal();
    toast(`Successfully imported ${parsedIpos.length} IPOs from Google Sheets!`);
  } catch (err) {
    alert(`Could not sync Google Sheet: ${err.message}`);
  } finally {
    button.classList.remove('loading');
    button.disabled = false;
  }
}

function handlePastedDataImport() {
  const textarea = $('#sync-paste-textarea');
  const rawText = (textarea?.value || '').trim();
  if (!rawText) {
    toast('Please paste table data from Google Sheets or Excel.');
    textarea?.focus();
    return;
  }

  const parsedIpos = parseCsvIpos(rawText);
  if (!parsedIpos.length) {
    toast('Could not find valid rows in the pasted data. Please check format.');
    return;
  }

  state.ipos = mergeWithDefaults(state.ipos, parsedIpos);
  saveState();
  renderAll();
  closeSyncModal();
  toast(`Imported ${parsedIpos.length} IPOs from pasted data.`);
}

function processSyncFile(file) {
  selectedSyncFile = file;
  const preview = $('#file-upload-preview');
  const btn = $('#import-uploaded-file-btn');
  if (preview) {
    preview.hidden = false;
    preview.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  }
  if (btn) btn.disabled = false;
}

function handleImportUploadedFile() {
  if (!selectedSyncFile) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const text = e.target.result;
      let parsedIpos = [];
      if (selectedSyncFile.name.endsWith('.json')) {
        const json = JSON.parse(text);
        parsedIpos = Array.isArray(json) ? json : (json.ipos || []);
      } else {
        parsedIpos = parseCsvIpos(text);
      }

      if (!parsedIpos.length) {
        throw new Error('No IPO items found in this file.');
      }

      state.ipos = mergeWithDefaults(state.ipos, parsedIpos);
      saveState();
      renderAll();
      closeSyncModal();
      toast(`Imported ${parsedIpos.length} IPOs from ${selectedSyncFile.name}!`);
    } catch (err) {
      alert(`File import error: ${err.message}`);
    }
  };
  reader.readAsText(selectedSyncFile);
}

function parseCsvIpos(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  // Determine delimiter: tab or comma
  const firstLine = lines[0];
  const delimiter = firstLine.includes('\t') ? '\t' : ',';

  function parseLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ''));
    return values;
  }

  const rows = lines.map(parseLine);
  if (!rows.length) return [];

  // Check if first row is header
  const headerRow = rows[0].map((h) => h.toLowerCase());
  const hasHeader = headerRow.some((h) =>
    h.includes('name') || h.includes('company') || h.includes('symbol') || h.includes('ipo') || h.includes('price')
  );

  const colMap = {};
  if (hasHeader) {
    headerRow.forEach((col, idx) => {
      if (col.includes('company') || col.includes('name') || col.includes('issuer')) colMap.name = idx;
      else if (col.includes('symbol') || col.includes('ticker')) colMap.symbol = idx;
      else if (col.includes('exchange') || col.includes('series') || col.includes('segment')) colMap.exchange = idx;
      else if (col.includes('open') || col.includes('start')) colMap.openDate = idx;
      else if (col.includes('close') || col.includes('end')) colMap.closeDate = idx;
      else if (col.includes('price') || col.includes('band')) colMap.priceBand = idx;
      else if (col.includes('lot')) colMap.lotSize = idx;
      else if (col.includes('gmp') || col.includes('premium')) colMap.gmp = idx;
      else if (col.includes('sub') || col.includes('times')) colMap.subscription = idx;
      else if (col.includes('shares') || col.includes('issue size')) colMap.sharesOffered = idx;
      else if (col.includes('bid')) colMap.bids = idx;
      else if (col.includes('promoter') || col.includes('parent')) colMap.promoter = idx;
      else if (col.includes('link') || col.includes('rhp') || col.includes('url')) colMap.link = idx;
      else if (col.includes('note') || col.includes('research') || col.includes('detail')) colMap.notes = idx;
    });
  }

  const dataRows = hasHeader ? rows.slice(1) : rows;
  const ipos = [];

  for (const row of dataRows) {
    if (!row.length || !row.some((cell) => cell.length > 0)) continue;

    let name = '';
    let symbol = '';
    let exchange = 'NSE / BSE · Mainboard';
    let openDate = '';
    let closeDate = '';
    let priceBand = '';
    let lotSize = '';
    let gmp = '';
    let subscription = '';
    let sharesOffered = '';
    let bids = '';
    let promoter = '';
    let link = '';
    let notes = '';

    if (hasHeader && Object.keys(colMap).length > 0) {
      name = colMap.name !== undefined ? row[colMap.name] : (row[0] || '');
      symbol = colMap.symbol !== undefined ? row[colMap.symbol] : '';
      exchange = colMap.exchange !== undefined ? row[colMap.exchange] : 'NSE / BSE · Mainboard';
      openDate = colMap.openDate !== undefined ? row[colMap.openDate] : '';
      closeDate = colMap.closeDate !== undefined ? row[colMap.closeDate] : '';
      priceBand = colMap.priceBand !== undefined ? row[colMap.priceBand] : '';
      lotSize = colMap.lotSize !== undefined ? row[colMap.lotSize] : '';
      gmp = colMap.gmp !== undefined ? row[colMap.gmp] : '';
      subscription = colMap.subscription !== undefined ? row[colMap.subscription] : '';
      sharesOffered = colMap.sharesOffered !== undefined ? row[colMap.sharesOffered] : '';
      bids = colMap.bids !== undefined ? row[colMap.bids] : '';
      promoter = colMap.promoter !== undefined ? row[colMap.promoter] : '';
      link = colMap.link !== undefined ? row[colMap.link] : '';
      notes = colMap.notes !== undefined ? row[colMap.notes] : '';
    } else {
      // Positional fallback
      name = row[0] || '';
      openDate = row[1] || '';
      closeDate = row[2] || '';
      priceBand = row[3] || '';
      lotSize = row[4] || '';
      gmp = row[5] || '';
      subscription = row[6] || '';
      promoter = row[7] || '';
      link = row[8] || '';
      notes = row[9] || '';
    }

    name = String(name || '').trim();
    if (!name || name.toLowerCase() === 'name' || name.toLowerCase() === 'company') continue;

    // Normalize dates
    openDate = normalizeImportDate(openDate);
    closeDate = normalizeImportDate(closeDate);

    // If exchange contains SME
    if (name.toLowerCase().includes('sme') || exchange.toLowerCase().includes('sme')) {
      exchange = 'NSE Emerge · SME';
    }

    ipos.push({
      id: `${slugify(name)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      symbol: symbol ? symbol.toUpperCase().trim() : '',
      name,
      exchange: exchange || 'NSE / BSE · Mainboard',
      openDate: openDate || localISODate(),
      closeDate: closeDate || localISODate(),
      priceBand: priceBand || '',
      lotSize: lotSize || '',
      gmp: gmp || '',
      subscription: subscription || '',
      sharesOffered: sharesOffered || '',
      bids: bids || '',
      promoter: promoter || '',
      link: link || '',
      notes: notes || '',
      source: 'sheet',
    });
  }

  return ipos;
}

function normalizeImportDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const clean = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, '0');
    const d = String(parsed.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return clean;
}

function exportIposToCsv() {
  const headers = [
    'Company Name',
    'Symbol',
    'Segment / Exchange',
    'Open Date',
    'Close Date',
    'Price Band',
    'Lot Size',
    'GMP',
    'Subscription',
    'Shares Offered',
    'Total Bids',
    'Promoter Group',
    'RHP / Official Link',
    'Research Notes',
  ];

  const rows = state.ipos.map((ipo) => [
    `"${(ipo.name || '').replace(/"/g, '""')}"`,
    `"${(ipo.symbol || '').replace(/"/g, '""')}"`,
    `"${(ipo.exchange || '').replace(/"/g, '""')}"`,
    ipo.openDate || '',
    ipo.closeDate || '',
    `"${(ipo.priceBand || '').replace(/"/g, '""')}"`,
    `"${(ipo.lotSize || '').replace(/"/g, '""')}"`,
    `"${(ipo.gmp || '').replace(/"/g, '""')}"`,
    `"${(ipo.subscription || '').replace(/"/g, '""')}"`,
    `"${(ipo.sharesOffered || '').replace(/"/g, '""')}"`,
    `"${(ipo.bids || '').replace(/"/g, '""')}"`,
    `"${(ipo.promoter || '').replace(/"/g, '""')}"`,
    `"${(ipo.link || '').replace(/"/g, '""')}"`,
    `"${(ipo.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `marketmind_ipos_${localISODate()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast('IPO watchlist CSV exported successfully.');
}

/* ================= STRATEGY SIMPLER ================= */
function bindStrategies() {
  $('#strategy-catalog').addEventListener('click', (event) => {
    const card = event.target.closest('[data-strategy-id]');
    if (card) openStrategy(card.dataset.strategyId);
  });
  $('#strategy-back-button').addEventListener('click', closeStrategy);
  $('#reset-strategy-button').addEventListener('click', resetStrategyToVideo);
  $('#formula-reset-video-button').addEventListener('click', resetStrategyToVideo);
  $('#reset-pnl-button').addEventListener('click', () => {
    if (!strategyInputs) return;
    strategyInputs.pnl = {};
    renderPnlInputs(getActiveStrategy());
    updatePnlTracker(getActiveStrategy());
  });
  ['#strategy-spot', '#strategy-lot-size', '#strategy-lots', '#strategy-capital'].forEach((selector) => {
    $(selector).addEventListener('input', handleStrategyBaseInput);
  });
  $('#strategy-leg-inputs').addEventListener('input', (event) => {
    const input = event.target.closest('[data-leg-id]');
    if (!input || !strategyInputs) return;
    const stoppedPaper = Boolean(paperTrade);
    if (paperTrade) stopPaperTrade({ silent: true });
    liveMarketSetup = null;
    strategyInputMode = 'custom';
    const leg = strategyInputs.legs.find((item) => item.id === input.dataset.legId);
    if (!leg) return;
    leg[input.dataset.legField] = Number(input.value) || 0;
    updateStrategyAnalytics(getActiveStrategy());
    renderLiveMarketPanel();
    if (stoppedPaper) toast('Paper trade ended because its entry legs were changed.');
  });
  $('#pnl-inputs').addEventListener('input', (event) => {
    const input = event.target.closest('[data-pnl-side]');
    if (!input || !strategyInputs) return;
    strategyInputs.pnl[input.dataset.pnlSide] = Number(input.value) || 0;
    updatePnlTracker(getActiveStrategy());
  });
  $('#load-live-market-button').addEventListener('click', () => loadLiveMarketData({ force: true, refreshPaper: Boolean(paperTrade) }));
  $('#live-expiry-select').addEventListener('change', (event) => loadLiveMarketData({ force: true, expiry: event.target.value }));
  $('#start-paper-trade-button').addEventListener('click', () => {
    if (paperTrade) loadLiveMarketData({ force: true, expiry: paperTrade.expiry, refreshPaper: true });
    else startPaperTrade();
  });
  $('#end-paper-trade-button').addEventListener('click', () => stopPaperTrade());
  [
    ['#formula-thesis-reason', 'thesisReason'],
    ['#formula-upper-reason', 'upperReason'],
    ['#formula-lower-reason', 'lowerReason'],
  ].forEach(([selector, key]) => {
    $(selector).addEventListener('input', (event) => {
      state.strategyWorksheet[key] = event.target.value.slice(0, 500);
      saveState();
    });
  });
  [
    ['#formula-upper-level', 'call'],
    ['#formula-lower-level', 'put'],
  ].forEach(([selector, side]) => {
    $(selector).addEventListener('input', (event) => {
      clearTimeout(formulaBoundaryTimers[side]);
      formulaBoundaryTimers[side] = setTimeout(() => updateFormulaBoundary(side, event.target.value), 350);
    });
    $(selector).addEventListener('change', (event) => {
      clearTimeout(formulaBoundaryTimers[side]);
      updateFormulaBoundary(side, event.target.value);
    });
  });
}

function renderStrategyCatalog() {
  const count = STRATEGIES.length;
  $('#nav-strategy-count').textContent = count;
  $('#strategy-count').textContent = count;
  $('#strategy-count-label').textContent = count === 1 ? 'strategy' : 'strategies';

  if (count === 0) {
    $('#strategy-catalog').innerHTML = `
      <div class="empty-catalog-state" style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: rgba(11, 18, 34, 0.6); border: 1px dashed var(--line); border-radius: 12px;">
        <span style="font-size: 32px; display: block; margin-bottom: 12px;">📋</span>
        <h3 style="font-size: 18px; margin: 0 0 8px; color: var(--text);">Ready for Your Custom Strategy</h3>
        <p style="color: var(--muted); font-size: 14px; max-width: 480px; margin: 0 auto; line-height: 1.5;">
          All previous strategies have been cleared. Share the exact strategy rules, indicators, and framework you want to build deeply and correctly!
        </p>
      </div>
    `;
    return;
  }

  $('#strategy-catalog').innerHTML = STRATEGIES.map((strategy, index) => `
    <button class="strategy-card" type="button" data-strategy-id="${escapeAttr(strategy.id)}" data-accent="${escapeAttr(strategy.accent)}">
      <span class="strategy-card-top"><span class="strategy-card-index">${String(index + 1).padStart(2, '0')}</span><span class="strategy-card-risk">${escapeHTML(strategy.risk)}</span></span>
      <h2>${escapeHTML(strategy.name)}</h2>
      <p>${escapeHTML(strategy.subtitle)}</p>
      <span class="strategy-card-meta">
        <span>Entry<strong>${escapeHTML(strategy.entryTiming)}</strong></span>
        <span>Target<strong>${escapeHTML(strategy.targetROI)}</strong></span>
      </span>
      <span class="strategy-card-open">↗</span>
    </button>`).join('');
}

function openStrategy(id) {
  const strategy = STRATEGIES.find((item) => item.id === id);
  if (!strategy) return;
  activeStrategyId = id;
  liveMarketSetup = null;
  strategyInputMode = 'video';
  strategyInputs = createStrategyInputs(strategy);
  $('#strategy-catalog-view').hidden = true;
  $('#strategy-detail-view').hidden = false;
  renderStrategyDetail(strategy);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (strategy.simulator.underlying === 'NIFTY') {
    loadLiveMarketData({ force: false });
  }
}

function closeStrategy() {
  stopPaperTrade({ silent: true });
  activeStrategyId = null;
  strategyInputs = null;
  $('#strategy-detail-view').hidden = true;
  $('#strategy-catalog-view').hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getActiveStrategy() {
  return STRATEGIES.find((item) => item.id === activeStrategyId) || null;
}

function createStrategyInputs(strategy) {
  return {
    spot: strategy.simulator.spot,
    lotSize: strategy.simulator.lotSize,
    lots: 1,
    capital: strategy.simulator.capital,
    legs: structuredClone(strategy.simulator.legs),
    pnl: {},
  };
}

function resetStrategyToVideo() {
  const strategy = getActiveStrategy();
  if (!strategy) return;
  stopPaperTrade({ silent: true });
  liveMarketSetup = null;
  strategyInputMode = 'video';
  strategyInputs = createStrategyInputs(strategy);
  renderStrategyDetail(strategy);
  toast('Formula reset to the video example.');
}

function renderStrategyDetail(strategy) {
  $('#strategy-detail-name').textContent = strategy.name;
  $('#strategy-detail-subtitle').textContent = strategy.subtitle;
  $('#strategy-detail-source').textContent = strategy.source;
  $('#strategy-detail-risk').textContent = strategy.risk;
  $('#strategy-entry-timing').textContent = strategy.entryTiming;
  $('#strategy-target-roi').textContent = strategy.targetROI;
  $('#strategy-underlying').textContent = strategy.simulator.underlying;
  $('#strategy-stop-method').textContent = `${strategy.stopLossMultiplier}× planned profit`;
  $('#strategy-market-note').textContent = strategy.marketNote;
  $('#strategy-rules').innerHTML = strategy.rules.map((rule) => `<li>${escapeHTML(rule)}</li>`).join('');

  const linksWrap = $('#strategy-video-links-wrap');
  if (strategy.videoLinks && strategy.videoLinks.length) {
    linksWrap.innerHTML = strategy.videoLinks.map((item, idx) => `
      <a class="strategy-video-link" href="${safeURL(item.url)}" target="_blank" rel="noopener noreferrer">
        ▶ Video ${idx + 1}: ${escapeHTML(item.title)} ↗
      </a>
    `).join('');
  } else if (strategy.videoUrl) {
    linksWrap.innerHTML = `
      <a class="strategy-video-link" href="${safeURL(strategy.videoUrl)}" target="_blank" rel="noopener noreferrer">
        ▶ Watch source: ${escapeHTML(strategy.source || 'Strategy Video')} ↗
      </a>
    `;
  } else {
    linksWrap.innerHTML = '';
  }

  const hasCondorLegs = Boolean(
    strategyInputs.legs.find((l) => l.id === 'shortCall') &&
    strategyInputs.legs.find((l) => l.id === 'longCall') &&
    strategyInputs.legs.find((l) => l.id === 'shortPut') &&
    strategyInputs.legs.find((l) => l.id === 'longPut')
  );
  $('#strategy-formula-panel').hidden = !hasCondorLegs;
  $('#strategy-market-chart-panel').hidden = strategy.simulator.underlying !== 'NIFTY';
  $('#live-paper-panel').hidden = strategy.simulator.underlying !== 'NIFTY';

  $('#formula-thesis-reason').value = state.strategyWorksheet.thesisReason;
  $('#formula-upper-reason').value = state.strategyWorksheet.upperReason;
  $('#formula-lower-reason').value = state.strategyWorksheet.lowerReason;

  $('#strategy-spot').value = strategyInputs.spot;
  $('#strategy-lot-size').value = strategyInputs.lotSize;
  $('#strategy-lots').value = strategyInputs.lots;
  $('#strategy-capital').value = strategyInputs.capital;
  renderStrategyLegs();
  renderPnlInputs(strategy);
  updateStrategyAnalytics(strategy);
  renderCaseStudy(strategy);
  if (strategy.simulator.underlying === 'NIFTY') {
    renderLiveMarketPanel();
  }
}

async function loadLiveMarketData({ force = false, expiry = '', refreshPaper = false } = {}) {
  if (isMarketLoading || !getActiveStrategy()) return;
  isMarketLoading = true;
  const status = $('#live-market-status');
  const loadButton = $('#load-live-market-button');
  status.className = 'market-state-badge loading';
  status.textContent = 'Loading NSE data';
  loadButton.disabled = true;
  loadButton.innerHTML = '<span aria-hidden="true">↻</span> Loading…';

  try {
    const params = new URLSearchParams();
    if (force) params.set('refresh', '1');
    if (expiry) params.set('expiry', expiry);
    const response = await fetch(`/api/market/nifty-options?${params}`, { cache: 'no-store' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || `Market-data request failed (${response.status})`);
    liveMarketData = payload;

    if (paperTrade && refreshPaper) {
      updatePaperTradeFromMarket(payload);
    } else {
      if (paperTrade) stopPaperTrade({ silent: true });
      liveMarketSetup = buildLiveMarketSetup(payload);
      applyLiveMarketSetup(liveMarketSetup, payload);
    }
    isMarketLoading = false;
    renderLiveMarketPanel();
    if (force) toast(payload.stale ? 'Using the last available NSE option-chain snapshot.' : 'Real NIFTY option data loaded from NSE.');
  } catch (error) {
    status.className = 'market-state-badge error';
    status.textContent = 'Data unavailable';
    const message = $('#live-setup-message');
    message.className = 'live-setup-message error';
    message.innerHTML = `<span>!</span><p>${escapeHTML(error.message)} The video example remains available, or open the NSE source to check manually.</p>`;
    if (force) toast('NSE options data could not be loaded.');
  } finally {
    isMarketLoading = false;
    loadButton.disabled = false;
    loadButton.innerHTML = '<span aria-hidden="true">↻</span> Load real NSE data';
  }
}

function buildLiveMarketSetup(market) {
  const spot = Number(market.underlyingValue);
  const rows = Array.isArray(market.quotes) ? market.quotes : [];
  const sellPrice = (quote) => Number(quote?.bid) > 0 ? Number(quote.bid) : Number(quote?.last) || 0;
  const buyPrice = (quote) => Number(quote?.ask) > 0 ? Number(quote.ask) : Number(quote?.last) || 0;
  const chooseShort = (type) => rows
    .filter((row) => type === 'call' ? row.strike > spot : row.strike < spot)
    .filter((row) => sellPrice(type === 'call' ? row.call : row.put) > 0)
    .sort((a, b) => {
      const aPrice = sellPrice(type === 'call' ? a.call : a.put);
      const bPrice = sellPrice(type === 'call' ? b.call : b.put);
      return Math.abs(aPrice - 9) - Math.abs(bPrice - 9);
    })[0];

  const shortCall = chooseShort('call');
  const shortPut = chooseShort('put');
  if (!shortCall || !shortPut) throw new Error('No liquid call/put pair was available near the video’s ₹8–₹10 target.');
  const longCall = rows.filter((row) => row.strike >= shortCall.strike + 150 && buyPrice(row.call) > 0).sort((a, b) => a.strike - b.strike)[0];
  const longPut = rows.filter((row) => row.strike <= shortPut.strike - 150 && buyPrice(row.put) > 0).sort((a, b) => b.strike - a.strike)[0];
  if (!longCall || !longPut) throw new Error('NSE did not return both protection strikes 150 points away.');

  return {
    spot,
    lotSize: Number(market.lotSize) || 65,
    expiry: market.expiry,
    legs: [
      { id: 'longPut', strike: longPut.strike, premium: buyPrice(longPut.put), quote: longPut.put },
      { id: 'shortPut', strike: shortPut.strike, premium: sellPrice(shortPut.put), quote: shortPut.put },
      { id: 'shortCall', strike: shortCall.strike, premium: sellPrice(shortCall.call), quote: shortCall.call },
      { id: 'longCall', strike: longCall.strike, premium: buyPrice(longCall.call), quote: longCall.call },
    ],
  };
}

function applyLiveMarketSetup(setup, market) {
  if (!setup || !strategyInputs) return;
  strategyInputMode = 'live';
  strategyInputs.spot = setup.spot;
  strategyInputs.lotSize = setup.lotSize;
  strategyInputs.pnl = {};
  for (const update of setup.legs) {
    const leg = strategyInputs.legs.find((item) => item.id === update.id);
    if (!leg) continue;
    leg.strike = update.strike;
    leg.premium = Number(update.premium.toFixed(2));
  }
  $('#strategy-spot').value = strategyInputs.spot;
  $('#strategy-lot-size').value = strategyInputs.lotSize;
  renderStrategyLegs();
  renderPnlInputs(getActiveStrategy());
  updateStrategyAnalytics(getActiveStrategy());
  liveMarketData = market;
}

function renderLiveMarketPanel() {
  if (!getActiveStrategy()) return;
  const status = $('#live-market-status');
  const market = liveMarketData;
  const setupMessage = $('#live-setup-message');
  const startButton = $('#start-paper-trade-button');
  const endButton = $('#end-paper-trade-button');
  const summary = $('#paper-trade-summary');

  if (!market) {
    status.className = 'market-state-badge loading';
    status.textContent = 'Waiting for data';
    startButton.disabled = true;
    endButton.hidden = true;
    summary.hidden = true;
    return;
  }

  const isOpen = String(market.marketStatus).toLowerCase() === 'open';
  status.className = `market-state-badge ${market.stale ? 'error' : isOpen ? '' : 'closed'}`;
  status.textContent = market.stale ? 'Stale NSE snapshot' : isOpen ? 'NSE market open' : 'NSE market closed';
  $('#live-nifty-spot').textContent = Number(market.underlyingValue).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const change = Number(market.dayChange) || 0;
  const changePct = Number(market.dayChangePercent) || 0;
  const changeElement = $('#live-nifty-change');
  changeElement.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)} · ${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`;
  changeElement.style.color = change < 0 ? 'var(--red)' : change > 0 ? 'var(--mint)' : '';
  $('#live-exchange-time').textContent = market.exchangeTimestamp || 'Not provided';
  $('#live-fetch-time').textContent = `Fetched ${new Date(market.fetchedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}${market.cached ? ' · cached' : ''}`;
  $('#live-selected-expiry').textContent = market.expiry || '—';
  $('#live-lot-size').textContent = Number(market.lotSize).toLocaleString('en-IN');
  $('#live-market-source').href = safeURL(market.sourceUrl);

  const expirySelect = $('#live-expiry-select');
  expirySelect.innerHTML = (market.expiries || []).map((expiry) => `<option value="${escapeAttr(expiry)}" ${expiry === market.expiry ? 'selected' : ''}>${escapeHTML(expiry)}</option>`).join('');

  if (liveMarketSetup) {
    const leg = (id) => liveMarketSetup.legs.find((item) => item.id === id);
    const netCredit = strategyInputs.legs.reduce((total, item) => total + (item.action === 'sell' ? item.premium : -item.premium), 0);
    setupMessage.className = 'live-setup-message success';
    setupMessage.innerHTML = `<span>✓</span><p>Loaded ${escapeHTML(market.expiry)}: sell ${leg('shortPut').strike} PE at bid ${formatQuote(leg('shortPut').premium)} and ${leg('shortCall').strike} CE at bid ${formatQuote(leg('shortCall').premium)}; protection is 150 points farther away at executable asks. Net paper credit is ${formatQuote(netCredit)} points. Capital remains your editable estimate because NSE does not provide broker margin.</p>`;
  } else {
    setupMessage.className = 'live-setup-message';
    setupMessage.innerHTML = '<span>i</span><p>Real quotes are loaded, but the simulator is showing custom or video-example inputs. Load real NSE data again to rebuild the market-based setup.</p>';
  }

  startButton.disabled = !liveMarketSetup || isMarketLoading;
  startButton.textContent = paperTrade ? 'Refresh paper P&L' : isOpen ? 'Start paper trade' : 'Start from last close';
  endButton.hidden = !paperTrade;
  summary.hidden = !paperTrade;
  if (!paperTrade) return;

  $('#paper-trade-started').textContent = `Started ${new Date(paperTrade.startedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}`;
  $('#paper-entry-credit').textContent = formatCurrency(paperTrade.entryCredit);
  const pnl = $('#paper-current-pnl');
  pnl.textContent = formatCurrency(paperTrade.currentPnl);
  pnl.style.color = paperTrade.currentPnl < 0 ? 'var(--red)' : paperTrade.currentPnl > 0 ? 'var(--mint)' : '';
  $('#paper-entry-spot').textContent = paperTrade.entrySpot.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  $('#paper-current-spot').textContent = paperTrade.currentSpot.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  $('#paper-trade-note').textContent = `${market.marketStatusMessage}. Position marked from NSE bid/ask at ${market.exchangeTimestamp}; ${isOpen ? 'it refreshes about every 60 seconds while the market is open' : 'use Refresh paper P&L after new exchange data is available'}. Charges and slippage are excluded.`;
}

function startPaperTrade() {
  if (!liveMarketData || !liveMarketSetup || !strategyInputs) return;
  const quantity = strategyInputs.lotSize * strategyInputs.lots;
  paperTrade = {
    startedAt: new Date().toISOString(),
    expiry: liveMarketData.expiry,
    entrySpot: Number(liveMarketData.underlyingValue),
    currentSpot: Number(liveMarketData.underlyingValue),
    lotSize: strategyInputs.lotSize,
    lots: strategyInputs.lots,
    legs: strategyInputs.legs.map((leg) => ({ ...leg, entryPremium: leg.premium })),
    entryCredit: strategyInputs.legs.reduce((total, leg) => total + (leg.action === 'sell' ? leg.premium : -leg.premium), 0) * quantity,
    currentPnl: 0,
  };
  updatePaperTradeFromMarket(liveMarketData);
  schedulePaperTradeRefresh();
  renderLiveMarketPanel();
  toast('Paper trade started. No broker order was sent.');
}

function updatePaperTradeFromMarket(market) {
  if (!paperTrade || !strategyInputs || market.expiry !== paperTrade.expiry) return;
  const quantity = paperTrade.lotSize * paperTrade.lots;
  const sidePnl = {};
  let total = 0;
  for (const leg of paperTrade.legs) {
    const row = market.quotes.find((item) => Number(item.strike) === Number(leg.strike));
    const quote = leg.type === 'call' ? row?.call : row?.put;
    const mark = leg.action === 'sell'
      ? (Number(quote?.ask) > 0 ? Number(quote.ask) : Number(quote?.last) || leg.entryPremium)
      : (Number(quote?.bid) > 0 ? Number(quote.bid) : Number(quote?.last) || leg.entryPremium);
    const legPnl = (leg.action === 'sell' ? leg.entryPremium - mark : mark - leg.entryPremium) * quantity;
    total += legPnl;
    sidePnl[leg.side || 'position'] = (sidePnl[leg.side || 'position'] || 0) + legPnl;
  }
  paperTrade.currentPnl = Math.round(total * 100) / 100;
  paperTrade.currentSpot = Number(market.underlyingValue);
  strategyInputs.pnl = Object.fromEntries(Object.entries(sidePnl).map(([side, value]) => [side, Math.round(value * 100) / 100]));
  renderPnlInputs(getActiveStrategy());
  updateStrategyAnalytics(getActiveStrategy());
  liveMarketData = market;
}

function stopPaperTrade({ silent = false } = {}) {
  if (!paperTrade) return;
  clearInterval(paperTradeRefreshTimer);
  paperTradeRefreshTimer = null;
  paperTrade = null;
  if (strategyInputs) {
    strategyInputs.pnl = {};
    renderPnlInputs(getActiveStrategy());
    updateStrategyAnalytics(getActiveStrategy());
  }
  renderLiveMarketPanel();
  if (!silent) toast('Paper trade ended. No real order was placed.');
}

function schedulePaperTradeRefresh() {
  clearInterval(paperTradeRefreshTimer);
  paperTradeRefreshTimer = null;
  if (!paperTrade || String(liveMarketData?.marketStatus).toLowerCase() !== 'open') return;
  paperTradeRefreshTimer = setInterval(() => {
    if (paperTrade && !isMarketLoading) loadLiveMarketData({ force: true, expiry: paperTrade.expiry, refreshPaper: true });
  }, 60_000);
}

function formatQuote(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function renderStrategyFormula(strategy, analytics) {
  if (!strategy || !strategyInputs) return;
  const leg = (id) => strategyInputs.legs.find((item) => item.id === id);
  const shortCall = leg('shortCall');
  const longCall = leg('longCall');
  const shortPut = leg('shortPut');
  const longPut = leg('longPut');
  if (!shortCall || !longCall || !shortPut || !longPut) return;
  const quantity = strategyInputs.lotSize * strategyInputs.lots;
  const callDifference = shortCall.premium - longCall.premium;
  const putDifference = shortPut.premium - longPut.premium;
  const callMaxProfit = Math.max(0, callDifference * quantity);
  const putMaxProfit = Math.max(0, putDifference * quantity);
  const currentPnl = Object.values(strategyInputs.pnl || {}).reduce((sum, value) => sum + (Number(value) || 0), 0);

  $('#formula-underlying').textContent = strategy.simulator.underlying;
  $('#formula-spot').textContent = Number(strategyInputs.spot).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  $('#formula-expiry').textContent = strategyInputMode === 'video' ? '9 May · video example' : liveMarketData?.expiry || 'Custom plan';
  $('#formula-roi').textContent = `${analytics.roi.toFixed(2)}%`;
  $('#formula-position-pnl').textContent = formatCurrency(currentPnl);
  $('#formula-position-pnl').style.color = currentPnl < 0 ? 'var(--red)' : currentPnl > 0 ? 'var(--mint)' : '';
  $('#formula-upper-level').value = shortCall.strike;
  $('#formula-lower-level').value = shortPut.strike;
  $('#formula-call-sell').textContent = `${shortCall.strike} CE`;
  $('#formula-call-buy').textContent = `${longCall.strike} CE`;
  $('#formula-put-sell').textContent = `${shortPut.strike} PE`;
  $('#formula-put-buy').textContent = `${longPut.strike} PE`;
  $('#formula-call-contract').textContent = `${shortCall.strike} / ${longCall.strike} CE`;
  $('#formula-put-contract').textContent = `${shortPut.strike} / ${longPut.strike} PE`;
  $('#formula-call-sell-premium').textContent = formatQuote(shortCall.premium);
  $('#formula-call-buy-premium').textContent = formatQuote(longCall.premium);
  $('#formula-call-difference').textContent = `${formatQuote(callDifference)} · ${formatCurrency(callDifference * quantity)} total`;
  $('#formula-call-max-profit').textContent = formatCurrency(callMaxProfit);
  $('#formula-call-stop').textContent = formatCurrency(callMaxProfit * strategy.stopLossMultiplier);
  $('#formula-put-sell-premium').textContent = formatQuote(shortPut.premium);
  $('#formula-put-buy-premium').textContent = formatQuote(longPut.premium);
  $('#formula-put-difference').textContent = `${formatQuote(putDifference)} · ${formatCurrency(putDifference * quantity)} total`;
  $('#formula-put-max-profit').textContent = formatCurrency(putMaxProfit);
  $('#formula-put-stop').textContent = formatCurrency(putMaxProfit * strategy.stopLossMultiplier);

  $('#market-chart-spot').textContent = Number(strategyInputs.spot || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  $('#market-chart-lower').textContent = Number(shortPut.strike || 0).toLocaleString('en-IN');
  $('#market-chart-upper').textContent = Number(shortCall.strike || 0).toLocaleString('en-IN');
  $('#market-chart-put-leg').textContent = `Sell ${shortPut.strike} PE · protect ${longPut.strike} PE`;
  $('#market-chart-call-leg').textContent = `Sell ${shortCall.strike} CE · protect ${longCall.strike} CE`;
  const expiryLabel = strategyInputMode === 'video' ? '9 May' : liveMarketData?.expiry || 'Active';
  $('#market-chart-expiry').textContent = `Expiry ${expiryLabel}`;
}

function updateFormulaBoundary(side, rawValue) {
  if (!strategyInputs) return;
  const boundary = Math.round((Number(rawValue) || 0) / 50) * 50;
  if (boundary <= 0) {
    updateStrategyAnalytics(getActiveStrategy());
    return;
  }
  const stoppedPaper = Boolean(paperTrade);
  if (paperTrade) stopPaperTrade({ silent: true });
  const shortLeg = strategyInputs.legs.find((item) => item.id === (side === 'call' ? 'shortCall' : 'shortPut'));
  const longLeg = strategyInputs.legs.find((item) => item.id === (side === 'call' ? 'longCall' : 'longPut'));
  shortLeg.strike = boundary;
  longLeg.strike = side === 'call' ? boundary + 150 : Math.max(0, boundary - 150);
  syncFormulaPremiumsFromMarket(shortLeg, longLeg);
  liveMarketSetup = null;
  strategyInputMode = 'custom';
  renderStrategyLegs();
  updateStrategyAnalytics(getActiveStrategy());
  renderLiveMarketPanel();
  toast(stoppedPaper ? 'Boundary updated and the active paper trade was ended.' : 'Boundary and 150-point protection updated.');
}

function syncFormulaPremiumsFromMarket(shortLeg, longLeg) {
  if (!liveMarketData?.quotes?.length) return;
  const quoteFor = (leg) => {
    const row = liveMarketData.quotes.find((item) => Number(item.strike) === Number(leg.strike));
    return leg.type === 'call' ? row?.call : row?.put;
  };
  const shortQuote = quoteFor(shortLeg);
  const longQuote = quoteFor(longLeg);
  const sellPremium = Number(shortQuote?.bid) > 0 ? Number(shortQuote.bid) : Number(shortQuote?.last) || 0;
  const buyPremium = Number(longQuote?.ask) > 0 ? Number(longQuote.ask) : Number(longQuote?.last) || 0;
  if (sellPremium > 0) shortLeg.premium = Number(sellPremium.toFixed(2));
  if (buyPremium > 0) longLeg.premium = Number(buyPremium.toFixed(2));
}

function renderStrategyLegs() {
  $('#strategy-leg-inputs').innerHTML = strategyInputs.legs.map((leg) => `
    <div class="strategy-leg-row">
      <span class="strategy-leg-label"><span class="leg-action ${leg.action}">${leg.action}</span>${escapeHTML(leg.label)}</span>
      <input type="number" step="50" value="${leg.strike}" data-leg-id="${escapeAttr(leg.id)}" data-leg-field="strike" aria-label="${escapeAttr(leg.label)} strike">
      <input type="number" step="0.05" min="0" value="${leg.premium}" data-leg-id="${escapeAttr(leg.id)}" data-leg-field="premium" aria-label="${escapeAttr(leg.label)} entry premium">
    </div>`).join('');
}

function handleStrategyBaseInput(event) {
  if (!strategyInputs) return;
  const key = {
    'strategy-spot': 'spot',
    'strategy-lot-size': 'lotSize',
    'strategy-lots': 'lots',
    'strategy-capital': 'capital',
  }[event.target.id];
  if (!key) return;
  const stoppedPaper = Boolean(paperTrade);
  if (paperTrade) stopPaperTrade({ silent: true });
  if (key === 'spot' || key === 'lotSize') {
    liveMarketSetup = null;
    strategyInputMode = 'custom';
  }
  strategyInputs[key] = Math.max(key === 'spot' ? 0 : 1, Number(event.target.value) || 0);
  updateStrategyAnalytics(getActiveStrategy());
  renderLiveMarketPanel();
  if (stoppedPaper) toast('Paper trade ended because its position inputs were changed.');
}

function renderPnlInputs(strategy) {
  if (!strategy || !strategyInputs) return;
  const sides = strategySides();
  $('#pnl-inputs').innerHTML = sides.map((side) => `
    <label><span>${escapeHTML(sideLabel(side))}</span><input type="number" step="50" value="${strategyInputs.pnl[side] || ''}" placeholder="₹0" data-pnl-side="${escapeAttr(side)}"></label>`).join('');
}

function strategySides() {
  return [...new Set(strategyInputs.legs.map((leg) => leg.side || 'position'))];
}

function sideLabel(side) {
  return side === 'call' ? 'Call-side P&L' : side === 'put' ? 'Put-side P&L' : 'Position P&L';
}

function updateStrategyAnalytics(strategy) {
  if (!strategy || !strategyInputs) return;
  const analytics = calculateStrategyAnalytics(strategy);
  $('#strategy-max-profit').textContent = formatCurrency(analytics.maxProfit);
  $('#strategy-max-loss').textContent = formatCurrency(analytics.maxLoss);
  $('#strategy-credit').textContent = formatCurrency(analytics.credit);
  $('#strategy-roi').textContent = `${analytics.roi.toFixed(2)}%`;
  renderStrategyFormula(strategy, analytics);
  renderPayoffChart(analytics.points, strategyInputs.spot);
  updatePnlTracker(strategy, analytics);
}

function calculateStrategyAnalytics(strategy) {
  const strikes = strategyInputs.legs.map((leg) => leg.strike);
  const padding = strategy.simulator.range;
  const lower = Math.max(0, Math.min(strategyInputs.spot - padding, Math.min(...strikes) - padding / 2));
  const upper = Math.max(strategyInputs.spot + padding, Math.max(...strikes) + padding / 2);
  const steps = 80;
  const expiries = Array.from({ length: steps + 1 }, (_, index) => lower + (upper - lower) * index / steps);
  const points = expiries.map((expiry) => ({ expiry, pnl: payoffAtExpiry(expiry) }));
  const pnls = points.map((point) => point.pnl);
  const maxProfit = Math.max(...pnls);
  const maxLossValue = Math.min(...pnls);
  const multiplier = strategyInputs.lotSize * strategyInputs.lots;
  const creditPoints = strategyInputs.legs.reduce((sum, leg) => sum + (leg.action === 'sell' ? leg.premium : -leg.premium), 0);
  const credit = creditPoints * multiplier;
  const roi = strategyInputs.capital > 0 ? maxProfit / strategyInputs.capital * 100 : 0;
  return { points, maxProfit, maxLoss: Math.abs(Math.min(0, maxLossValue)), credit, roi };
}

function payoffAtExpiry(expiry, side = null) {
  const multiplier = strategyInputs.lotSize * strategyInputs.lots;
  return strategyInputs.legs
    .filter((leg) => !side || (leg.side || 'position') === side)
    .reduce((total, leg) => {
      const intrinsic = leg.type === 'call' ? Math.max(0, expiry - leg.strike) : Math.max(0, leg.strike - expiry);
      const perUnit = leg.action === 'buy' ? intrinsic - leg.premium : leg.premium - intrinsic;
      return total + perUnit * multiplier;
    }, 0);
}

function sideMaximumProfit(side) {
  const strikes = strategyInputs.legs.map((leg) => leg.strike);
  const lower = Math.max(0, Math.min(...strikes) - 2000);
  const upper = Math.max(...strikes) + 2000;
  let maximum = -Infinity;
  for (let index = 0; index <= 120; index += 1) {
    maximum = Math.max(maximum, payoffAtExpiry(lower + (upper - lower) * index / 120, side));
  }
  return Math.max(0, maximum);
}

function updatePnlTracker(strategy, analytics = null) {
  if (!strategy || !strategyInputs) return;
  const sides = strategySides();
  const total = sides.reduce((sum, side) => sum + (Number(strategyInputs.pnl[side]) || 0), 0);
  $('#pnl-current-total').textContent = formatCurrency(total);
  $('#pnl-current-total').style.color = total < 0 ? 'var(--red)' : total > 0 ? 'var(--mint)' : '';
  $('#formula-position-pnl').textContent = formatCurrency(total);
  $('#formula-position-pnl').style.color = total < 0 ? 'var(--red)' : total > 0 ? 'var(--mint)' : '';

  let triggered = null;
  for (const side of sides) {
    const maxProfit = sideMaximumProfit(side);
    const stop = maxProfit * strategy.stopLossMultiplier;
    const current = Number(strategyInputs.pnl[side]) || 0;
    if (stop > 0 && current <= -stop) triggered = { side, stop, current };
  }

  const alert = $('#strategy-stop-alert');
  if (triggered) {
    alert.classList.add('triggered');
    alert.innerHTML = `<span class="stop-alert-icon">!</span><div><strong>Stop level reached on ${escapeHTML(sideLabel(triggered.side).replace(' P&L', ''))}</strong><p>Entered loss ${formatCurrency(Math.abs(triggered.current))} is at or beyond the planned ${formatCurrency(triggered.stop)} limit. Follow the documented exit order.</p></div>`;
  } else {
    const totalMax = analytics?.maxProfit ?? calculateStrategyAnalytics(strategy).maxProfit;
    alert.classList.remove('triggered');
    alert.innerHTML = `<span class="stop-alert-icon">✓</span><div><strong>Within the planned limit</strong><p>No entered side has reached its stop. Reference maximum strategy profit: ${formatCurrency(totalMax)}.</p></div>`;
  }
}

function renderPayoffChart(points, spot) {
  const svg = $('#payoff-chart');
  const width = 700;
  const height = 280;
  const margin = { left: 62, right: 20, top: 22, bottom: 38 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const minX = points[0].expiry;
  const maxX = points.at(-1).expiry;
  let minY = Math.min(...points.map((point) => point.pnl), 0);
  let maxY = Math.max(...points.map((point) => point.pnl), 0);
  const yPadding = Math.max(1, (maxY - minY) * .12);
  minY -= yPadding;
  maxY += yPadding;
  const x = (value) => margin.left + (value - minX) / (maxX - minX || 1) * innerWidth;
  const y = (value) => margin.top + (maxY - value) / (maxY - minY || 1) * innerHeight;
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(point.expiry).toFixed(1)},${y(point.pnl).toFixed(1)}`).join(' ');
  const zeroY = y(0);
  const grid = Array.from({ length: 5 }, (_, index) => {
    const gx = margin.left + innerWidth * index / 4;
    const value = minX + (maxX - minX) * index / 4;
    return `<line class="chart-grid" x1="${gx}" y1="${margin.top}" x2="${gx}" y2="${height - margin.bottom}"></line><text class="chart-label" x="${gx}" y="${height - 15}" text-anchor="middle">${Math.round(value).toLocaleString('en-IN')}</text>`;
  }).join('');
  const yLabels = [maxY - yPadding, 0, minY + yPadding].map((value) => `<text class="chart-label" x="${margin.left - 9}" y="${y(value) + 3}" text-anchor="end">${compactCurrency(value)}</text>`).join('');
  const spotX = x(Math.min(maxX, Math.max(minX, spot)));
  svg.innerHTML = `
    <title>Strategy expiry payoff chart</title>
    <desc>Estimated profit or loss across possible expiry prices. The vertical dashed line marks the current spot reference.</desc>
    <rect class="chart-area-profit" x="${margin.left}" y="${margin.top}" width="${innerWidth}" height="${Math.max(0, zeroY - margin.top)}"></rect>
    <rect class="chart-area-loss" x="${margin.left}" y="${zeroY}" width="${innerWidth}" height="${Math.max(0, height - margin.bottom - zeroY)}"></rect>
    ${grid}
    <line class="chart-axis" x1="${margin.left}" y1="${zeroY}" x2="${width - margin.right}" y2="${zeroY}"></line>
    <line class="chart-axis" x1="${spotX}" y1="${margin.top}" x2="${spotX}" y2="${height - margin.bottom}" stroke-dasharray="4 5"></line>
    <text class="chart-zero-label" x="${spotX + 5}" y="${margin.top + 10}">spot</text>
    ${yLabels}
    <path class="chart-line" d="${line}"></path>`;
}

function renderCaseStudy(strategy) {
  const panel = $('#strategy-case-study-panel');
  if (!panel) return;
  if (!strategy || !strategy.caseStudy) {
    panel.hidden = true;
    return;
  }
  panel.hidden = false;
  const cs = strategy.caseStudy;
  const titleEl = $('#case-study-title');
  if (titleEl) titleEl.textContent = cs.title;
  const badgeEl = $('#case-study-badge');
  if (badgeEl) badgeEl.textContent = cs.step1Screening.badge || 'Worked Case Study';

  const content = $('#case-study-content');
  if (!content) return;
  content.innerHTML = `
    <div class="case-study-grid">
      <!-- Step 1: Screening Check -->
      <div class="case-step-card">
        <div class="case-step-header">
          <span class="case-step-num">Step 01</span>
          <h3>${escapeHTML(cs.step1Screening.title)}</h3>
        </div>
        <p class="case-step-desc">${escapeHTML(cs.step1Screening.summary)}</p>
        <div class="case-filter-tags">
          <span class="case-tag pass">✓ Nifty 100 Constituent</span>
          <span class="case-tag pass">✓ Price &lt; ₹3,000 (₹446.75)</span>
          <span class="case-tag pass">✓ High-Beta Auto / Momentum</span>
          <span class="case-tag metric">+44.19% (6M)</span>
          <span class="case-tag metric">+16.96% (1M)</span>
        </div>
      </div>

      <!-- Step 2: Real Price Levels -->
      <div class="case-step-card">
        <div class="case-step-header">
          <span class="case-step-num">Step 02</span>
          <h3>${escapeHTML(cs.step2Levels.title)}</h3>
          <span class="case-date-badge">${escapeHTML(cs.step2Levels.timeLabel)}</span>
        </div>
        <div class="case-price-matrix">
          <div class="price-box highlight">
            <span>Live Traded Price</span>
            <strong>₹${cs.step2Levels.livePrice.toFixed(2)}</strong>
            <em class="change-neg">${escapeHTML(cs.step2Levels.liveChange)} today</em>
          </div>
          <div class="price-box">
            <span>52-Week High</span>
            <strong>₹${cs.step2Levels.high52W.toFixed(2)}</strong>
            <em>Swing Target Zone</em>
          </div>
          <div class="price-box">
            <span>52-Week Low</span>
            <strong>₹${cs.step2Levels.low52W.toFixed(2)}</strong>
            <em>Base Support</em>
          </div>
          <div class="price-box full-width">
            <span>Recent Consolidation / Resistance Area</span>
            <strong>${escapeHTML(cs.step2Levels.consolidationZone)}</strong>
          </div>
        </div>
      </div>

      <!-- Step 3: Dummy Trade Setup Table -->
      <div class="case-step-card full-span">
        <div class="case-step-header">
          <span class="case-step-num">Step 03</span>
          <h3>${escapeHTML(cs.step3Setup.title)}</h3>
        </div>
        <div class="case-table-wrap">
          <table class="case-trade-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Strategy Execution Logic</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Stock</strong></td>
                <td><span class="stock-chip">${escapeHTML(cs.stock)}</span></td>
                <td>High-beta, Nifty 100 auto momentum constituent</td>
              </tr>
              <tr>
                <td><strong>Entry</strong></td>
                <td><strong class="entry-val">₹${cs.step3Setup.entry.toFixed(2)}</strong></td>
                <td>${escapeHTML(cs.step3Setup.entryLogic)}</td>
              </tr>
              <tr>
                <td><strong>Stop-loss</strong></td>
                <td><strong class="sl-val">₹${cs.step3Setup.stopLoss.toFixed(2)}</strong></td>
                <td>${escapeHTML(cs.step3Setup.stopLossLogic)}</td>
              </tr>
              <tr>
                <td><strong>Target</strong></td>
                <td><strong class="target-val">₹${cs.step3Setup.target.toFixed(2)}</strong></td>
                <td>${escapeHTML(cs.step3Setup.targetLogic)}</td>
              </tr>
              <tr>
                <td><strong>Risk per share</strong></td>
                <td><strong class="risk-val">₹${cs.step3Setup.riskPerShare.toFixed(2)}</strong></td>
                <td>₹${cs.step3Setup.entry.toFixed(2)} − ₹${cs.step3Setup.stopLoss.toFixed(2)} initial buffer</td>
              </tr>
              <tr>
                <td><strong>Reward per share</strong></td>
                <td><strong class="reward-val">₹${cs.step3Setup.rewardPerShare.toFixed(2)}</strong></td>
                <td>₹${cs.step3Setup.target.toFixed(2)} − ₹${cs.step3Setup.entry.toFixed(2)} swing potential</td>
              </tr>
              <tr class="highlight-row">
                <td><strong>Risk : Reward (RRR)</strong></td>
                <td><strong class="rrr-val">~${escapeHTML(cs.step3Setup.riskRewardRatio)}</strong></td>
                <td>Favorable asymmetric payoff fulfilling the video's &gt;1:2 RRR rule</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Step 4: Position Sizing Calculator & Dual Constraint Rules -->
      <div class="case-step-card full-span sizing-card">
        <div class="case-step-header">
          <span class="case-step-num">Step 04</span>
          <h3>${escapeHTML(cs.step4Sizing.title)}</h3>
          <span class="dual-rule-badge">Dual-Constraint Risk Engine</span>
        </div>

        <!-- Interactive Controls -->
        <div class="sizing-inputs-bar">
          <label>
            <span>Portfolio Capital (₹)</span>
            <input type="number" id="calc-portfolio" value="${cs.step4Sizing.portfolioCapital}" step="25000" min="10000">
          </label>
          <label>
            <span>Risk Cap (% per trade)</span>
            <input type="number" id="calc-risk-pct" value="${cs.step4Sizing.riskPct}" step="0.25" min="0.25" max="5">
          </label>
          <label>
            <span>Max Capital Allocation (%)</span>
            <input type="number" id="calc-cap-pct" value="${cs.step4Sizing.diversificationPct}" step="5" min="5" max="50">
          </label>
          <label>
            <span>Entry Price (₹)</span>
            <input type="number" id="calc-entry" value="${cs.step3Setup.entry}" step="0.5" min="1">
          </label>
          <label>
            <span>Stop-Loss (₹)</span>
            <input type="number" id="calc-sl" value="${cs.step3Setup.stopLoss}" step="0.5" min="1">
          </label>
          <label>
            <span>Target Price (₹)</span>
            <input type="number" id="calc-target" value="${cs.step3Setup.target}" step="0.5" min="1">
          </label>
        </div>

        <!-- Sizing Results Display -->
        <div id="sizing-results-display">
          <!-- Dynamically generated -->
        </div>
      </div>

      <!-- Step 5: Exit Logic -->
      <div class="case-step-card full-span">
        <div class="case-step-header">
          <span class="case-step-num">Step 05</span>
          <h3>${escapeHTML(cs.step5Exit.title)}</h3>
        </div>
        <div class="case-exit-rules">
          ${cs.step5Exit.rules.map((rule, idx) => `
            <div class="exit-rule-item">
              <span class="exit-icon">${idx === 0 ? '🎯' : idx === 1 ? '🔄' : '🛑'}</span>
              <p>${escapeHTML(rule)}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Caveats and Training Note -->
      <div class="case-caveats-box">
        <div class="caveats-head">
          <span>⚠️</span>
          <strong>Analytical Caveat &amp; Training Context</strong>
        </div>
        <p>${escapeHTML(cs.caveats)}</p>
      </div>
    </div>
  `;

  bindSizingCalcEvents();
  updateSizingCalc();
}

function bindSizingCalcEvents() {
  ['#calc-portfolio', '#calc-risk-pct', '#calc-cap-pct', '#calc-entry', '#calc-sl', '#calc-target'].forEach((sel) => {
    const input = $(sel);
    if (input) {
      input.addEventListener('input', updateSizingCalc);
      input.addEventListener('change', updateSizingCalc);
    }
  });
}

function updateSizingCalc() {
  const container = $('#sizing-results-display');
  if (!container) return;

  const portfolio = Math.max(1000, Number($('#calc-portfolio')?.value) || 500000);
  const riskPct = Math.max(0.1, Number($('#calc-risk-pct')?.value) || 1.5);
  const capPct = Math.max(1, Number($('#calc-cap-pct')?.value) || 20);
  const entry = Math.max(0.5, Number($('#calc-entry')?.value) || 466);
  const sl = Math.max(0.1, Number($('#calc-sl')?.value) || 448);
  const target = Math.max(entry + 0.1, Number($('#calc-target')?.value) || 509);

  const riskPerShare = Math.max(0.01, entry - sl);
  const rewardPerShare = Math.max(0.01, target - entry);
  const rrr = (rewardPerShare / riskPerShare).toFixed(2);

  const maxRiskRupees = portfolio * (riskPct / 100);
  const sharesByRisk = Math.floor(maxRiskRupees / riskPerShare);

  const maxAllocationRupees = portfolio * (capPct / 100);
  const sharesByCapital = Math.floor(maxAllocationRupees / entry);

  const isCapBinding = sharesByCapital < sharesByRisk;
  const tradeShares = Math.min(sharesByRisk, sharesByCapital);
  const capitalDeployed = tradeShares * entry;
  const capitalDeployedPct = ((capitalDeployed / portfolio) * 100).toFixed(1);
  const actualRiskRupees = tradeShares * riskPerShare;
  const actualRiskPct = ((actualRiskRupees / portfolio) * 100).toFixed(2);
  const potentialRewardRupees = tradeShares * rewardPerShare;
  const potentialRewardPct = ((potentialRewardRupees / portfolio) * 100).toFixed(2);

  container.innerHTML = `
    <div class="sizing-rules-grid">
      <!-- Rule 1: Risk Cap -->
      <div class="rule-calc-card ${!isCapBinding ? 'is-binding' : ''}">
        <div class="rule-card-top">
          <span class="rule-title">Rule 1 — Risk Cap (${riskPct}% per trade)</span>
          ${!isCapBinding ? '<span class="binding-tag">Binding Constraint</span>' : ''}
        </div>
        <ul class="rule-math-list">
          <li>${riskPct}% of ${formatCurrency(portfolio)} = <strong>${formatCurrency(maxRiskRupees)} max risk</strong></li>
          <li>Shares by risk = ${formatCurrency(maxRiskRupees)} ÷ ₹${riskPerShare.toFixed(2)}</li>
        </ul>
        <div class="rule-result-shares">
          <span>Allowed by risk limit:</span>
          <strong>${sharesByRisk.toLocaleString('en-IN')} shares</strong>
        </div>
      </div>

      <!-- Rule 2: Diversification Cap -->
      <div class="rule-calc-card ${isCapBinding ? 'is-binding' : ''}">
        <div class="rule-card-top">
          <span class="rule-title">Rule 2 — Diversification Cap (max ${capPct}% capital)</span>
          ${isCapBinding ? '<span class="binding-tag">Binding Constraint</span>' : ''}
        </div>
        <ul class="rule-math-list">
          <li>${capPct}% of ${formatCurrency(portfolio)} = <strong>${formatCurrency(maxAllocationRupees)} max allocation</strong></li>
          <li>Shares by capital = ${formatCurrency(maxAllocationRupees)} ÷ ₹${entry.toFixed(2)}</li>
        </ul>
        <div class="rule-result-shares">
          <span>Allowed by capital limit:</span>
          <strong>${sharesByCapital.toLocaleString('en-IN')} shares</strong>
        </div>
      </div>
    </div>

    <div class="binding-banner">
      <div class="binding-icon">⚡</div>
      <div class="binding-text">
        <strong>Binding Constraint: ${isCapBinding ? `Diversification Rule (${capPct}% max capital per stock)` : `Risk Rule (${riskPct}% max portfolio risk)`}</strong>
        <p>Because the ${isCapBinding ? 'diversification cap is stricter' : 'risk cap is stricter'}, the recommended safe trade size is strictly capped at <strong>${tradeShares.toLocaleString('en-IN')} shares</strong>.</p>
      </div>
    </div>

    <div class="sizing-summary-strip">
      <article>
        <span>Capital Deployed</span>
        <strong>${formatCurrency(capitalDeployed)}</strong>
        <small>${capitalDeployedPct}% of portfolio</small>
      </article>
      <article>
        <span>Actual ₹ Risk</span>
        <strong class="orange">${formatCurrency(actualRiskRupees)}</strong>
        <small>${actualRiskPct}% of portfolio (${riskPct}% ceiling)</small>
      </article>
      <article>
        <span>Potential Reward</span>
        <strong class="mint">+${formatCurrency(potentialRewardRupees)}</strong>
        <small>+${potentialRewardPct}% portfolio gain</small>
      </article>
      <article>
        <span>Risk : Reward (RRR)</span>
        <strong class="mint">~${rrr} : 1</strong>
        <small>₹${rewardPerShare.toFixed(2)} reward vs ₹${riskPerShare.toFixed(2)} risk</small>
      </article>
    </div>
  `;
}

function formatCurrency(value) {
  const sign = Number(value) < 0 ? '-' : '';
  return `${sign}₹${Math.abs(Math.round(Number(value) || 0)).toLocaleString('en-IN')}`;
}

function compactCurrency(value) {
  const amount = Math.abs(value);
  const formatted = amount >= 100000 ? `${(amount / 100000).toFixed(1)}L` : amount >= 1000 ? `${(amount / 1000).toFixed(1)}k` : Math.round(amount);
  return `${value < 0 ? '-' : ''}₹${formatted}`;
}

function clearChat(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  state.messages = [];
  pendingAttachments = [];
  renderAttachments();
  const input = $('#chat-input');
  if (input) {
    input.value = '';
    autoSizeComposer();
  }
  saveState();
  renderChat();
  toast('Chat cleared. New session started.');
}

function bindChat() {
  ['#open-coach-button', '#sidebar-chat-button', '#hero-chat-button', '#floating-coach-button'].forEach((selector) => {
    const el = $(selector);
    if (el) el.addEventListener('click', openCoach);
  });
  const minBtn = $('#minimize-coach-button');
  if (minBtn) minBtn.addEventListener('click', minimizeCoach);
  const expandBtn = $('#expand-coach-button');
  if (expandBtn) expandBtn.addEventListener('click', expandCoach);
  const minStrip = $('#coach-minimized-strip');
  if (minStrip) minStrip.addEventListener('click', expandCoach);
  const closeBtn = $('#close-coach-button');
  if (closeBtn) closeBtn.addEventListener('click', closeCoach);
  const scrim = $('#coach-scrim');
  if (scrim) scrim.addEventListener('click', closeCoach);
  const clearBtn = $('#clear-chat-button');
  if (clearBtn) clearBtn.addEventListener('click', clearChat);
  $('#chat-form').addEventListener('submit', sendChat);
  $('#chat-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      $('#chat-form').requestSubmit();
    }
  });
  $('#chat-input').addEventListener('input', autoSizeComposer);
  $('#quick-prompts').addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.promptAction === 'teardown') {
      const selectedId = $('#chat-ipo-select').value;
      const ipo = state.ipos.find((item) => item.id === selectedId) || state.ipos[0] || null;
      $('#chat-mode').value = 'ipo';
      $('#chat-input').value = getEquityAnalystTeardownPrompt(ipo);
      autoSizeComposer();
      $('#chat-input').focus();
      return;
    }
    if (button.dataset.prompt) {
      $('#chat-input').value = button.dataset.prompt;
      autoSizeComposer();
      $('#chat-input').focus();
    }
  });
  $('#attachment-input').addEventListener('change', queueAttachments);
  $('#attachment-tray').addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-attachment]');
    if (!button) return;
    pendingAttachments.splice(Number(button.dataset.removeAttachment), 1);
    renderAttachments();
  });
}

function getEquityAnalystTeardownPrompt(ipo) {
  const companyName = ipo ? (ipo.symbol ? `${ipo.name} (${ipo.symbol})` : ipo.name) : '[Company Name]';
  const facts = [];
  if (ipo?.exchange) facts.push(`Exchange / Segment: ${ipo.exchange}`);
  if (ipo?.priceBand) facts.push(`Price Band: ${ipo.priceBand}`);
  if (ipo?.lotSize) facts.push(`Lot Size: ${ipo.lotSize}`);
  if (ipo?.gmp) facts.push(`GMP (Grey Market): ${ipo.gmp}`);
  if (ipo?.subscription) facts.push(`Subscription: ${ipo.subscription}`);
  if (ipo?.sharesOffered) facts.push(`Shares Offered: ${ipo.sharesOffered}`);
  if (ipo?.bids) facts.push(`Total Bids: ${ipo.bids}`);
  if (ipo?.promoter) facts.push(`Parent / Promoter Group: ${ipo.promoter}`);
  if (ipo?.notes) facts.push(`Workspace Research Notes: ${ipo.notes}`);

  const knownContext = facts.length ? `\n\nKnown IPO / Watchlist parameters for ${ipo.name}:\n${facts.map((f) => `• ${f}`).join('\n')}\n` : '';

  return `Act as a seasoned equity research analyst with 20 years of experience across fundamental analysis, technical analysis, and behavioral finance. I am providing you with the following documents for ${companyName}: annual financial statements, Management Discussion & Analysis, concall transcripts, a daily technical chart, key ratios from Screener, and the latest shareholding pattern.${knownContext}
Tear this company apart across these dimensions:

FUNDAMENTALS - Is this business genuinely healthy or just looks good on surface? Dig into revenue quality, margin trajectory, cash flow vs reported profits, debt structure, and ROE sustainability. Flag any accounting red flags.

MANAGEMENT DNA - Read between the lines of the concall transcripts and MDA. Is management confident or defensive? Are they overpromising and underdelivering? Any change in language tone vs last year? Promoter pledge or stake reduction is an automatic red flag - call it out.

VALUATION REALITY - Is the market pricing in perfection? Compare current P/E, EV/EBITDA against historical averages and sector peers. Tell me if I am paying a premium for growth that may never come.

TECHNICAL STRUCTURE - Where is the stock in its trend cycle? Is it in accumulation, markup, distribution or markdown phase? Key support and resistance levels. Is volume confirming price action or diverging?

RISK FACTORS - What are the 3 things that could destroy this thesis? Sector risk, company-specific risk, macro risk.

FINAL VERDICT - Buy, Hold, or Avoid. Conviction score out of 10. Price at which this becomes interesting if not now. One line that summarizes this stock.

Required verification documents / checklist:
1. Annual Report - Last 2-3 years - from BSE/NSE or the company website
2. MDA Report - Already inside the Annual Report - same PDF
3. Concall Transcripts - Last 2-3 quarters - from Screener.in or Tijori Finance
4. 1D Technical Chart Screenshot - TradingView - with 50 EMA, 200 EMA, RSI, Volume
5. Screener.in Screenshot - P/E, ROE, Debt/Equity, Revenue growth, Profit growth, Operating Cash Flow, Promoter holding
6. Shareholding Pattern - Latest quarter - from BSE/NSE

Upload all 6 to Screener.in / ChatGPT / Claude or attach them here in MarketMind, then execute the teardown.`;
}

function applyCoachMinimizedState() {
  const panel = $('#coach-panel');
  const ws = $('.workspace');
  const isMin = Boolean(state.coachMinimized);
  if (panel) panel.classList.toggle('minimized', isMin);
  if (ws) ws.classList.toggle('coach-minimized', isMin);
}

function minimizeCoach(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (window.innerWidth <= 1080) {
    closeCoach();
    return;
  }
  state.coachMinimized = true;
  saveState();
  applyCoachMinimizedState();
  toast('AI Copilot minimized. Click the sidebar strip or Ask AI to expand.');
}

function expandCoach(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  state.coachMinimized = false;
  saveState();
  applyCoachMinimizedState();
  openCoach();
}

function openCoach() {
  state.coachMinimized = false;
  saveState();
  applyCoachMinimizedState();
  const panel = $('#coach-panel');
  if (panel) panel.classList.add('open');
  const scrim = $('#coach-scrim');
  if (scrim) scrim.classList.add('active');
  setTimeout(() => $('#chat-input')?.focus(), 120);
}

function closeCoach() {
  const panel = $('#coach-panel');
  if (panel) panel.classList.remove('open');
  const scrim = $('#coach-scrim');
  if (scrim) scrim.classList.remove('active');
}

async function checkAI() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    aiHealth = { configured: Boolean(data.aiConfigured), model: data.model || 'Gemini', mock: data.mock };
  } catch {
    aiHealth = { configured: false, model: 'Unavailable' };
  }
  const onlineText = aiHealth.mock ? 'Mock AI ready' : aiHealth.configured ? 'AI ready' : 'Setup needed';
  $('#connection-label').textContent = onlineText;
  $('#connection-pill').classList.toggle('offline', !aiHealth.configured);
  $('#coach-status-dot').classList.toggle('offline', !aiHealth.configured);
  const miniDot = $('#coach-mini-status-dot');
  if (miniDot) miniDot.classList.toggle('offline', !aiHealth.configured);
  $('#coach-status-text').textContent = onlineText;
  $('#metric-ai-status').textContent = onlineText;
  $('#metric-ai-model').textContent = aiHealth.configured ? aiHealth.model : 'Add GEMINI_API_KEY to .env';
}

function populateChatIpos() {
  const select = $('#chat-ipo-select');
  const value = select.value;
  select.innerHTML = '<option value="">No IPO selected</option>' + state.ipos.map((ipo) => `<option value="${escapeAttr(ipo.id)}">${escapeHTML(ipo.name)}</option>`).join('');
  if (state.ipos.some((ipo) => ipo.id === value)) select.value = value;
}

function analyzeIpo(id) {
  const ipo = state.ipos.find((item) => item.id === id);
  if (!ipo) return;
  $('#chat-ipo-select').value = id;
  $('#chat-mode').value = 'ipo';
  $('#chat-input').value = getEquityAnalystTeardownPrompt(ipo);
  autoSizeComposer();
  openCoach();
  toast(aiHealth.configured
    ? `20-Yr Analyst teardown prompt loaded for ${ipo.name}. Attach documents or press send.`
    : `20-Yr Analyst teardown prompt loaded for ${ipo.name}.`);
}

async function queueAttachments(event) {
  const files = [...event.target.files];
  event.target.value = '';
  const allowed = new Set(['application/pdf', 'text/plain', 'text/csv', 'application/json', 'image/png', 'image/jpeg', 'image/webp']);
  for (const file of files) {
    if (pendingAttachments.length >= 6) { toast('You can attach up to six documents per message.'); break; }
    const type = file.type || mimeFromName(file.name);
    if (!allowed.has(type)) { toast(`${file.name} is not a supported file type.`); continue; }
    if (file.size > 7 * 1024 * 1024) { toast(`${file.name} is larger than 7 MB.`); continue; }
    const total = pendingAttachments.reduce((sum, item) => sum + item.size, 0) + file.size;
    if (total > 18 * 1024 * 1024) { toast('Keep total attachments below 18 MB.'); break; }
    pendingAttachments.push({ name: file.name, type, size: file.size, data: await fileToBase64(file) });
  }
  renderAttachments();
}

function renderAttachments() {
  const tray = $('#attachment-tray');
  tray.classList.toggle('active', pendingAttachments.length > 0);
  tray.innerHTML = pendingAttachments.map((file, index) => `<span class="attachment-chip" title="${escapeAttr(file.name)}"><span>▱ ${escapeHTML(file.name)}</span><button type="button" data-remove-attachment="${index}" aria-label="Remove ${escapeAttr(file.name)}">×</button></span>`).join('');
}

async function sendChat(event) {
  event?.preventDefault();
  if (isSending) return;
  let content = $('#chat-input').value.trim();
  if (!content && pendingAttachments.length) content = 'Analyze the attached documents. Summarize the evidence, flag contradictions and red flags, and list the most important follow-up questions.';
  if (!content) return;

  const attachments = pendingAttachments;
  pendingAttachments = [];
  renderAttachments();
  $('#chat-input').value = '';
  autoSizeComposer();

  state.messages.push({ id: crypto.randomUUID(), role: 'user', content, time: Date.now() });
  saveState();
  renderChat();
  isSending = true;
  $('#send-button').disabled = true;

  const assistant = { id: crypto.randomUUID(), role: 'assistant', content: '', time: Date.now() };
  state.messages.push(assistant);
  renderChat();

  try {
    const selectedIPO = state.ipos.find((ipo) => ipo.id === $('#chat-ipo-select').value) || null;
    const stats = taskStats();
    const historyMessages = state.messages
      .filter((m) => m.id !== assistant.id && m.content && m.content.trim())
      .map(({ role, content: text }) => ({ role, content: text }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: historyMessages,
        attachments,
        context: {
          mode: $('#chat-mode').value,
          selectedIPO,
          learningProgress: { completed: stats.done, total: stats.total, percent: stats.pct },
        },
      }),
    });

    if (!response.ok) {
      let message = `Request failed (${response.status}).`;
      try { message = (await response.json()).error || message; } catch { /* use fallback */ }
      throw new Error(message);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistant.content += decoder.decode(value, { stream: true });
      updateMessageBubble(assistant);
    }
    assistant.content += decoder.decode();
    if (!assistant.content.trim()) assistant.content = 'The model returned an empty response. Try again with a shorter request.';
  } catch (error) {
    assistant.content = `**Could not complete the analysis.**\n\n${error.message}`;
  } finally {
    isSending = false;
    $('#send-button').disabled = false;
    saveState();
    updateMessageBubble(assistant);
    $('#chat-input').focus();
  }
}

function renderChat() {
  const messages = $('#chat-messages');
  const welcome = `<div class="welcome-message"><h3>Ask harder questions.</h3><p>I can read PDFs and charts, test an IPO thesis, explain a ratio, or tutor you through the learning path. Attach primary evidence whenever possible.</p></div>`;
  messages.innerHTML = welcome + state.messages.map((message) => messageHTML(message)).join('');
  if (isSending && state.messages.at(-1)?.role === 'assistant' && !state.messages.at(-1).content) {
    const bubble = $(`[data-message-id="${state.messages.at(-1).id}"] .message-bubble`, messages);
    if (bubble) bubble.innerHTML = '<span class="typing-dots"><i></i><i></i><i></i></span>';
  }
  scrollChat();
}

function messageHTML(message) {
  const body = message.content ? renderMarkdown(message.content) : '<span class="typing-dots"><i></i><i></i><i></i></span>';
  return `<div class="message ${message.role === 'user' ? 'user' : 'assistant'}" data-message-id="${message.id}"><span class="message-avatar">✦</span><div class="message-bubble">${body}</div></div>`;
}

function updateMessageBubble(message) {
  const bubble = $(`[data-message-id="${message.id}"] .message-bubble`);
  if (bubble) bubble.innerHTML = message.content ? renderMarkdown(message.content) : '<span class="typing-dots"><i></i><i></i><i></i></span>';
  scrollChat();
}

function scrollChat() {
  const messages = $('#chat-messages');
  requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; });
}

function autoSizeComposer() {
  const input = $('#chat-input');
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
}

function bindBackup() {
  $('#export-data-button').addEventListener('click', () => {
    const data = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `marketmind-backup-${localISODate()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    toast('Backup downloaded.');
  });
  $('#import-data-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    event.target.value = '';
    if (!file || !window.confirm('Import this backup and replace the current dashboard data?')) return;
    try {
      const data = JSON.parse(await file.text());
      if (!data.taskState || !Array.isArray(data.ipos)) throw new Error('This is not a MarketMind backup.');
      state.taskState = data.taskState;
      state.ipos = data.ipos;
      state.messages = Array.isArray(data.messages) ? data.messages.slice(-30) : [];
      state.liveMeta = data.liveMeta || null;
      state.strategyWorksheet = normalizeStrategyWorksheet(data.strategyWorksheet);
      saveState();
      renderAll();
      toast('Backup imported successfully.');
    } catch (error) {
      toast(error.message || 'Could not import that backup.');
    }
  });
}

function renderMarkdown(text) {
  const safe = escapeHTML(text).replace(/\r\n/g, '\n');
  const lines = safe.split('\n');
  let html = '';
  let list = null;
  let inCodeBlock = false;
  let codeBlockContent = '';

  const closeList = () => { if (list) { html += `</${list}>`; list = null; } };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre><code>${codeBlockContent.trimEnd()}</code></pre>`;
        inCodeBlock = false;
        codeBlockContent = '';
      } else {
        closeList();
        inCodeBlock = true;
        codeBlockContent = '';
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += `${rawLine}\n`;
      continue;
    }

    if (/^###\s+/.test(line)) { closeList(); html += `<h3>${inlineMarkdown(line.replace(/^###\s+/, ''))}</h3>`; }
    else if (/^##\s+/.test(line)) { closeList(); html += `<h2>${inlineMarkdown(line.replace(/^##\s+/, ''))}</h2>`; }
    else if (/^#\s+/.test(line)) { closeList(); html += `<h2>${inlineMarkdown(line.replace(/^#\s+/, ''))}</h2>`; }
    else if (/^[-*]\s+/.test(line)) { if (list !== 'ul') { closeList(); list = 'ul'; html += '<ul>'; } html += `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''))}</li>`; }
    else if (/^\d+\.\s+/.test(line)) { if (list !== 'ol') { closeList(); list = 'ol'; html += '<ol>'; } html += `<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>`; }
    else if (/^>\s+/.test(line)) { closeList(); html += `<blockquote>${inlineMarkdown(line.replace(/^>\s+/, ''))}</blockquote>`; }
    else if (!line.trim()) { closeList(); }
    else { closeList(); html += `<p>${inlineMarkdown(line)}</p>`; }
  }

  if (inCodeBlock) {
    html += `<pre><code>${codeBlockContent.trimEnd()}</code></pre>`;
  }
  closeList();
  return html;
}

function inlineMarkdown(text) {
  return text
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function formatDate(value) {
  if (!value) return 'Date needed';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'recently';
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function normalizeCompanyName(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\b(limited|ltd|india)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function localISODate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function mimeFromName(name) {
  const extension = name.split('.').pop()?.toLowerCase();
  return ({ pdf: 'application/pdf', txt: 'text/plain', csv: 'text/csv', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp' })[extension] || '';
}

function safeURL(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ipo';
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function escapeAttr(value) { return escapeHTML(value); }

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('show'), 2600);
}

/* ==========================================================================
   Authentication & Admin Approval Handlers
   ========================================================================== */

let authMode = 'login'; // 'login' | 'register'
let unsubAdminUsers = null;
let activeInspectedUser = null;

async function initFirebaseAuth() {
  try {
    await initFirebase();
    onAuthStatusChanged(({ user, profile, loading }) => {
      currentUser = user;
      currentProfile = profile;
      handleAuthStateUpdate();
    });
  } catch (err) {
    console.error('Firebase setup failed in browser:', err);
  }
}

function handleAuthStateUpdate() {
  const isSuperAdmin = (currentUser?.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isAdmin = isSuperAdmin || currentProfile?.role === 'admin';
  const isApproved = isSuperAdmin || currentProfile?.status === 'approved';

  // Update Topbar Profile Pill
  const userProfileBtn = $('#user-profile-btn');
  const userAvatar = $('#topbar-user-avatar');
  const userName = $('#topbar-user-name');
  const userRole = $('#topbar-user-role');
  const navAdminItem = $('#nav-admin-item');

  if (currentUser) {
    userName.textContent = currentProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    if (currentUser.photoURL) {
      userAvatar.innerHTML = `<img src="${escapeAttr(currentUser.photoURL)}" alt="Avatar" referrerpolicy="no-referrer">`;
    } else {
      userAvatar.textContent = (userName.textContent[0] || 'U').toUpperCase();
    }

    if (isAdmin) {
      userRole.hidden = false;
      userRole.textContent = 'Admin';
      userRole.style.color = 'var(--lime)';
      navAdminItem.hidden = false;
    } else {
      userRole.hidden = false;
      userRole.textContent = currentProfile?.status === 'approved' ? 'Member' : 'Pending';
      userRole.style.color = currentProfile?.status === 'approved' ? 'var(--mint)' : 'var(--orange)';
      navAdminItem.hidden = true;
    }
  } else {
    userName.textContent = 'Sign In';
    userAvatar.textContent = '👤';
    userRole.hidden = true;
    navAdminItem.hidden = true;
  }

  // Handle Admin Realtime Subscription
  if (isAdmin) {
    if (!unsubAdminUsers) {
      unsubAdminUsers = subscribeToAllUsers((users) => {
        allUsersList = users;
        renderAdminUsersTable();
        if (activeInspectedUser) {
          const fresh = allUsersList.find((u) => u.id === activeInspectedUser.id);
          if (fresh) populateRequestModal(fresh);
        }
      });
    }
  } else {
    if (unsubAdminUsers) {
      unsubAdminUsers();
      unsubAdminUsers = null;
    }
  }

  // Update Mandatory Authentication & Approval Gate Overlay
  const approvalGate = $('#approval-gate');
  const gateUnauthActions = $('#gate-unauth-actions');
  const gatePendingActions = $('#gate-pending-actions');
  const gateStatusPill = $('#gate-status-pill');

  if (!currentUser) {
    // Unauthenticated -> Show mandatory sign-in gate
    approvalGate.hidden = false;
    $('#gate-icon').textContent = '🔐';
    $('#gate-kicker').textContent = 'Authentication Required';
    $('#gate-title').textContent = 'Sign In to MarketMind';
    $('#gate-description').textContent = 'Please sign in with your Google account or email to access the MarketMind options strategy builder, IPO watch, and AI research desk.';
    if (gateStatusPill) gateStatusPill.hidden = true;
    if (gateUnauthActions) gateUnauthActions.hidden = false;
    if (gatePendingActions) gatePendingActions.hidden = true;
  } else if (!isApproved) {
    // Signed in but waiting for approval (or rejected)
    approvalGate.hidden = false;
    if (gateUnauthActions) gateUnauthActions.hidden = true;
    if (gatePendingActions) gatePendingActions.hidden = false;
    if (gateStatusPill) gateStatusPill.hidden = false;

    const isRejected = currentProfile?.status === 'rejected';
    if (isRejected) {
      $('#gate-icon').textContent = '🚫';
      $('#gate-kicker').textContent = 'Access Restricted';
      $('#gate-title').textContent = 'Account Access Revoked';
      $('#gate-description').textContent = 'Your access request was revoked by workspace administrator. Please contact the administrator to request reinstatement.';
      gateStatusPill.innerHTML = `<span style="color:var(--red)">●</span> Status: Rejected`;
      gateStatusPill.style.color = 'var(--red)';
      gateStatusPill.style.borderColor = 'rgba(239, 116, 111, 0.3)';
      gateStatusPill.style.background = 'rgba(239, 116, 111, 0.12)';
    } else {
      $('#gate-icon').textContent = '⏳';
      $('#gate-kicker').textContent = 'Access Restricted';
      $('#gate-title').textContent = 'Approval Pending';
      $('#gate-description').innerHTML = `Your account (<strong>${escapeHTML(currentUser.email)}</strong>) is registered. A workspace administrator must approve your profile before you can access MarketMind research tools.`;
      gateStatusPill.innerHTML = `<span class="pulse-dot"></span> Status: <span id="gate-status-text">Pending Admin Approval</span>`;
      gateStatusPill.style.color = 'var(--orange)';
      gateStatusPill.style.borderColor = 'rgba(246, 154, 102, 0.3)';
      gateStatusPill.style.background = 'rgba(246, 154, 102, 0.12)';
    }
  } else {
    // Signed in and approved (or SuperAdmin) -> Complete instant access
    approvalGate.hidden = true;
    maybeStartTour();
  }
}

function bindAuth() {
  // Topbar Profile button click
  $('#user-profile-btn').addEventListener('click', () => {
    if (currentUser) {
      openAccountModal();
    } else {
      openAuthModal('login');
    }
  });

  // Auth Modal Tab switching
  $('#tab-login-btn').addEventListener('click', () => setAuthMode('login'));
  $('#tab-register-btn').addEventListener('click', () => setAuthMode('register'));

  // Close modals
  $('#close-auth-modal').addEventListener('click', closeAuthModal);
  $('#close-account-modal').addEventListener('click', closeAccountModal);
  $('#close-req-modal').addEventListener('click', closeRequestDetailModal);

  // Social Google Auth
  $('#google-auth-btn').addEventListener('click', async () => {
    try {
      showAuthError(null);
      await loginWithGoogle();
      closeAuthModal();
      toast('Signed in successfully with Google!');
    } catch (err) {
      console.error('Google login error:', err);
      showAuthError(err.message || 'Google sign-in failed.');
    }
  });

  // Direct Google Auth from Gate
  const gateGoogleBtn = $('#gate-google-btn');
  if (gateGoogleBtn) {
    gateGoogleBtn.addEventListener('click', async () => {
      try {
        await loginWithGoogle();
        toast('Signed in successfully with Google!');
      } catch (err) {
        console.error('Gate Google login error:', err);
        toast(`Sign-in failed: ${err.message}`);
      }
    });
  }

  // Gate Email Auth buttons
  const gateEmailBtn = $('#gate-email-login-btn');
  if (gateEmailBtn) {
    gateEmailBtn.addEventListener('click', () => {
      openAuthModal('login');
    });
  }

  // Email Auth Form Submit
  $('#auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#auth-email').value.trim();
    const password = $('#auth-password').value;
    const displayName = $('#auth-display-name').value.trim();
    const submitBtn = $('#auth-submit-btn');

    if (!email || !password) return;

    submitBtn.disabled = true;
    submitBtn.textContent = authMode === 'login' ? 'Signing in…' : 'Creating account…';
    showAuthError(null);

    try {
      if (authMode === 'login') {
        await loginWithEmail(email, password);
        toast('Signed in successfully!');
      } else {
        await registerWithEmail(email, password, displayName);
        toast('Registration complete! Account submitted for admin review.');
      }
      closeAuthModal();
    } catch (err) {
      console.error('Auth error:', err);
      showAuthError(err.message?.replace('Firebase: ', '') || 'Authentication error occurred.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = authMode === 'login' ? 'Sign In' : 'Create Account';
    }
  });

  // Logout buttons
  $('#logout-btn').addEventListener('click', async () => {
    await logout();
    closeAccountModal();
    toast('You have been signed out.');
  });

  // Gate overlay actions
  $('#gate-logout-btn').addEventListener('click', async () => {
    try {
      await logout();
    } catch {}
    currentUser = null;
    currentProfile = null;
    handleAuthStateUpdate();
    toast('Signed out successfully.');
  });

  $('#gate-admin-login-btn').addEventListener('click', () => {
    openAuthModal('login');
    $('#auth-email').focus();
  });

  const gateSwitchAdminBtn = $('#gate-switch-admin-btn');
  if (gateSwitchAdminBtn) {
    gateSwitchAdminBtn.addEventListener('click', async () => {
      try {
        await logout();
      } catch {}
      currentUser = null;
      currentProfile = null;
      handleAuthStateUpdate();
      openAuthModal('login');
      $('#auth-email').focus();
    });
  }

  $('#gate-check-status-btn').addEventListener('click', () => {
    toast('Refreshing authorization status…');
    handleAuthStateUpdate();
  });

  $('#admin-shortcut-btn').addEventListener('click', () => {
    closeAccountModal();
    navigate('admin');
  });

  // Admin filter tabs
  $$('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      $$('.filter-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      adminFilter = tab.dataset.adminFilter;
      renderAdminUsersTable();
    });
  });

  // Admin search input
  $('#admin-user-search').addEventListener('input', debounce((e) => {
    adminSearchTerm = e.target.value.toLowerCase().trim();
    renderAdminUsersTable();
  }, 200));

  // Admin Pending Cards Grid click handler
  $('#admin-pending-cards').addEventListener('click', async (e) => {
    const inspectBtn = e.target.closest('.btn-inspect');
    const approveBtn = e.target.closest('.btn-approve');
    const card = e.target.closest('.pending-user-card');

    if (approveBtn) {
      e.stopPropagation();
      const uid = approveBtn.dataset.userId;
      const email = approveBtn.dataset.userEmail;
      approveBtn.disabled = true;
      try {
        await approveUser(uid, currentUser?.email || ADMIN_EMAIL);
        toast(`Approved access for ${email}`);
      } catch (err) {
        toast(`Approval failed: ${err.message}`);
      } finally {
        approveBtn.disabled = false;
      }
      return;
    }

    if (card) {
      const uid = card.dataset.userId;
      const user = allUsersList.find((u) => u.id === uid);
      if (user) openRequestDetailModal(user);
    }
  });

  // Admin table event delegation for row inspection & action buttons
  $('#admin-users-tbody').addEventListener('click', async (e) => {
    const actionBtn = e.target.closest('button');
    const row = e.target.closest('tr');

    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const userId = actionBtn.dataset.userId;
      const userEmail = actionBtn.dataset.userEmail;

      if (!action || !userId) return;

      actionBtn.disabled = true;
      try {
        if (action === 'approve') {
          await approveUser(userId, currentUser?.email || ADMIN_EMAIL);
          toast(`Approved access for ${userEmail}`);
        } else if (action === 'reject') {
          await rejectUser(userId, currentUser?.email || ADMIN_EMAIL);
          toast(`Rejected access for ${userEmail}`);
        } else if (action === 'toggle-role') {
          const currentRole = actionBtn.dataset.currentRole;
          const newRole = currentRole === 'admin' ? 'member' : 'admin';
          await setUserRole(userId, newRole);
          toast(`Changed role for ${userEmail} to ${newRole}`);
        } else if (action === 'delete') {
          if (confirm(`Are you sure you want to remove user record for ${userEmail}?`)) {
            await deleteUserProfile(userId);
            toast(`Removed user ${userEmail}`);
          }
        }
      } catch (err) {
        console.error(`Action ${action} error:`, err);
        toast(`Action failed: ${err.message}`);
      } finally {
        actionBtn.disabled = false;
      }
      return;
    }

    // Row clicked -> Inspect request
    if (row && row.dataset.userId) {
      const user = allUsersList.find((u) => u.id === row.dataset.userId);
      if (user) openRequestDetailModal(user);
    }
  });

  // Request Modal Action Buttons
  $('#req-modal-approve-btn').addEventListener('click', async () => {
    if (!activeInspectedUser) return;
    const btn = $('#req-modal-approve-btn');
    btn.disabled = true;
    try {
      await approveUser(activeInspectedUser.id, currentUser?.email || ADMIN_EMAIL);
      toast(`Approved access for ${activeInspectedUser.email}`);
      closeRequestDetailModal();
    } catch (err) {
      toast(`Failed: ${err.message}`);
    } finally {
      btn.disabled = false;
    }
  });

  $('#req-modal-reject-btn').addEventListener('click', async () => {
    if (!activeInspectedUser) return;
    const btn = $('#req-modal-reject-btn');
    btn.disabled = true;
    try {
      await rejectUser(activeInspectedUser.id, currentUser?.email || ADMIN_EMAIL);
      toast(`Access revoked/rejected for ${activeInspectedUser.email}`);
      closeRequestDetailModal();
    } catch (err) {
      toast(`Failed: ${err.message}`);
    } finally {
      btn.disabled = false;
    }
  });

  $('#req-modal-role-btn').addEventListener('click', async () => {
    if (!activeInspectedUser) return;
    const btn = $('#req-modal-role-btn');
    const newRole = activeInspectedUser.role === 'admin' ? 'member' : 'admin';
    btn.disabled = true;
    try {
      await setUserRole(activeInspectedUser.id, newRole);
      toast(`Role updated to ${newRole}`);
      activeInspectedUser.role = newRole;
      populateRequestModal(activeInspectedUser);
    } catch (err) {
      toast(`Failed: ${err.message}`);
    } finally {
      btn.disabled = false;
    }
  });
}

function openAuthModal(mode = 'login') {
  setAuthMode(mode);
  showAuthError(null);
  $('#auth-email').value = '';
  $('#auth-password').value = '';
  $('#auth-display-name').value = '';
  $('#auth-modal').hidden = false;
}

function closeAuthModal() {
  $('#auth-modal').hidden = true;
}

function setAuthMode(mode) {
  authMode = mode;
  $('#tab-login-btn').classList.toggle('active', mode === 'login');
  $('#tab-register-btn').classList.toggle('active', mode === 'register');
  $('#auth-modal-title').textContent = mode === 'login' ? 'Sign in to workspace' : 'Create an account';
  $('#auth-submit-btn').textContent = mode === 'login' ? 'Sign In' : 'Create Account';
  $('#auth-name-field').hidden = mode === 'login';
}

function showAuthError(msg) {
  const errEl = $('#auth-error');
  if (msg) {
    errEl.textContent = msg;
    errEl.hidden = false;
  } else {
    errEl.hidden = true;
  }
}

function openAccountModal() {
  if (!currentUser) return;
  const isSuperAdmin = (currentUser.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isAdmin = isSuperAdmin || currentProfile?.role === 'admin';

  $('#acc-name').textContent = currentProfile?.displayName || currentUser.displayName || currentUser.email?.split('@')[0] || 'Trader';
  $('#acc-email').textContent = currentUser.email || '';

  const avatarEl = $('#acc-avatar');
  if (currentUser.photoURL) {
    avatarEl.innerHTML = `<img src="${escapeAttr(currentUser.photoURL)}" alt="Avatar" referrerpolicy="no-referrer">`;
  } else {
    avatarEl.textContent = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();
  }

  const statusBadge = $('#acc-status-badge');
  const status = currentProfile?.status || (isSuperAdmin ? 'approved' : 'pending');
  statusBadge.textContent = status.toUpperCase();
  statusBadge.className = `status-badge status-${status}`;

  const roleBadge = $('#acc-role-badge');
  roleBadge.textContent = (currentProfile?.role || (isSuperAdmin ? 'admin' : 'member')).toUpperCase();

  $('#admin-shortcut-btn').hidden = !isAdmin;
  $('#account-modal').hidden = false;
}

function closeAccountModal() {
  $('#account-modal').hidden = true;
}

function openRequestDetailModal(user) {
  activeInspectedUser = user;
  populateRequestModal(user);
  $('#request-detail-modal').hidden = false;
}

function closeRequestDetailModal() {
  $('#request-detail-modal').hidden = true;
  activeInspectedUser = null;
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '—';
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function populateRequestModal(user) {
  const isSuperAdmin = (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const isApproved = user.status === 'approved';

  $('#req-modal-name').textContent = user.displayName || user.email?.split('@')[0] || 'User';
  $('#req-modal-email').textContent = user.email || '—';
  $('#req-modal-uid').textContent = user.id || '—';

  const avatarEl = $('#req-modal-avatar');
  if (user.photoURL) {
    avatarEl.innerHTML = `<img src="${escapeAttr(user.photoURL)}" alt="" referrerpolicy="no-referrer">`;
  } else {
    avatarEl.textContent = (user.displayName || user.email || 'U')[0].toUpperCase();
  }

  const statusBadge = $('#req-modal-status');
  statusBadge.textContent = (user.status || 'pending').toUpperCase();
  statusBadge.className = `status-badge status-${user.status || 'pending'}`;

  const roleBadge = $('#req-modal-role');
  roleBadge.textContent = (user.role || 'member').toUpperCase();
  roleBadge.style.color = user.role === 'admin' ? 'var(--lime)' : 'var(--muted)';

  const formattedTime = user.createdAt ? new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).format(new Date(user.createdAt)) : '—';

  $('#req-modal-time').textContent = formattedTime;
  $('#req-modal-elapsed').textContent = formatRelativeTime(user.createdAt);
  $('#req-modal-approvedby').textContent = isSuperAdmin ? 'Super Administrator' : (user.approvedBy ? (user.approvedBy.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'Super Administrator' : 'Administrator') : 'None (Awaiting Review)');

  // Configure action buttons in inspector modal
  const approveBtn = $('#req-modal-approve-btn');
  const rejectBtn = $('#req-modal-reject-btn');
  const roleBtn = $('#req-modal-role-btn');

  if (isSuperAdmin) {
    approveBtn.hidden = true;
    rejectBtn.hidden = true;
    roleBtn.hidden = true;
  } else {
    approveBtn.hidden = false;
    rejectBtn.hidden = false;
    roleBtn.hidden = false;

    approveBtn.textContent = isApproved ? '✓ Re-Confirm Access' : '✓ Approve Access Now';
    rejectBtn.textContent = isApproved ? '✕ Revoke Access' : '✕ Reject Request';
    roleBtn.textContent = user.role === 'admin' ? 'Demote to Member Role' : 'Promote to Admin Role';
  }
}

function renderAdminUsersTable() {
  const tbody = $('#admin-users-tbody');
  if (!tbody) return;

  // Compute counts
  const total = allUsersList.length;
  const pendingUsers = allUsersList.filter((u) => u.status === 'pending');
  const pending = pendingUsers.length;
  const approved = allUsersList.filter((u) => u.status === 'approved').length;

  $('#admin-count-pending').textContent = pending;
  $('#admin-count-approved').textContent = approved;
  $('#admin-count-total').textContent = total;
  $('#admin-badge-pending').textContent = pending;
  $('#nav-pending-count').textContent = pending;

  // Update Pending Requests Cards Banner
  const pendingBanner = $('#admin-pending-banner');
  const pendingCards = $('#admin-pending-cards');
  if (pending > 0) {
    pendingBanner.hidden = false;
    $('#pending-banner-count').textContent = pending;
    pendingCards.innerHTML = pendingUsers.map((user) => {
      const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
      const avatarHtml = user.photoURL
        ? `<img src="${escapeAttr(user.photoURL)}" alt="" referrerpolicy="no-referrer">`
        : `<span>${escapeHTML(initial)}</span>`;
      return `
        <div class="pending-user-card" data-user-id="${escapeAttr(user.id)}">
          <div class="pending-card-top">
            <div class="pending-card-avatar">${avatarHtml}</div>
            <div class="pending-card-meta">
              <strong>${escapeHTML(user.displayName || user.email?.split('@')[0] || 'User')}</strong>
              <span>${escapeHTML(user.email || '—')}</span>
            </div>
          </div>
          <div class="pending-card-time">
            <span>⏱️ Requested ${formatRelativeTime(user.createdAt)}</span>
          </div>
          <div class="pending-card-actions">
            <button class="btn-inspect" type="button">👁️ Inspect</button>
            <button class="btn-approve" data-user-id="${escapeAttr(user.id)}" data-user-email="${escapeAttr(user.email)}" type="button">✓ Approve</button>
          </div>
        </div>
      `;
    }).join('');
  } else {
    pendingBanner.hidden = true;
    pendingCards.innerHTML = '';
  }

  // Filter list for the main directory table
  let filtered = allUsersList;
  if (adminFilter !== 'all') {
    filtered = filtered.filter((u) => u.status === adminFilter);
  }
  if (adminSearchTerm) {
    filtered = filtered.filter((u) =>
      (u.email || '').toLowerCase().includes(adminSearchTerm) ||
      (u.displayName || '').toLowerCase().includes(adminSearchTerm)
    );
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">No user accounts found matching this filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((user) => {
    const isSuperAdmin = (user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isApproved = user.status === 'approved';
    const registeredDate = user.createdAt ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(user.createdAt)) : '—';
    const initial = (user.displayName || user.email || 'U')[0].toUpperCase();
    const avatarHtml = user.photoURL
      ? `<img src="${escapeAttr(user.photoURL)}" alt="" referrerpolicy="no-referrer">`
      : `<span>${escapeHTML(initial)}</span>`;

    return `
      <tr class="clickable-row" data-user-id="${escapeAttr(user.id)}" title="Click to inspect full request details">
        <td>
          <div class="user-cell">
            <div class="user-cell-avatar">${avatarHtml}</div>
            <div class="user-cell-info">
              <strong>${escapeHTML(user.displayName || user.email?.split('@')[0] || 'User')}</strong>
              <small>${isSuperAdmin ? '👑 Super Admin' : (user.approvedBy ? `Approved by ${escapeHTML(user.approvedBy)}` : 'Awaiting admin review')}</small>
            </div>
          </div>
        </td>
        <td><code>${escapeHTML(user.email || '—')}</code></td>
        <td><small>${registeredDate} (${formatRelativeTime(user.createdAt)})</small></td>
        <td>
          <span class="role-badge" style="${user.role === 'admin' ? 'color:var(--lime);border-color:rgba(200,240,93,0.3);' : 'color:var(--muted);border-color:var(--line);'}">
            ${escapeHTML((user.role || 'member').toUpperCase())}
          </span>
        </td>
        <td>
          <span class="status-badge status-${user.status || 'pending'}">
            ${escapeHTML((user.status || 'pending').toUpperCase())}
          </span>
        </td>
        <td class="actions-col">
          <div class="action-btn-group">
            ${!isSuperAdmin ? `
              ${!isApproved ? `
                <button class="btn-approve" data-action="approve" data-user-id="${escapeAttr(user.id)}" data-user-email="${escapeAttr(user.email)}" type="button" title="Grant access">✓ Approve</button>
              ` : `
                <button class="btn-reject" data-action="reject" data-user-id="${escapeAttr(user.id)}" data-user-email="${escapeAttr(user.email)}" type="button" title="Revoke access">✕ Revoke</button>
              `}
              <button class="btn-role-toggle" data-action="toggle-role" data-user-id="${escapeAttr(user.id)}" data-user-email="${escapeAttr(user.email)}" data-current-role="${escapeAttr(user.role || 'member')}" type="button" title="Toggle Admin/Member role">
                Make ${user.role === 'admin' ? 'Member' : 'Admin'}
              </button>
              <button class="icon-button" data-action="delete" data-user-id="${escapeAttr(user.id)}" data-user-email="${escapeAttr(user.email)}" type="button" title="Delete record" style="color:var(--red);">🗑</button>
            ` : `
              <small style="color:var(--lime); font-weight:600;">Super Administrator</small>
            `}
          </div>
        </td>
      </tr>
    `;
  }).join('');
}
