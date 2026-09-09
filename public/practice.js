const money = n => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR' }).format(n);
const key = 'marketmind-practice-v1';
let journal;
try { journal = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(journal)) journal = []; } catch { journal = []; }
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function openPractice(strategy) {
  document.querySelector('#strategy-catalog-view').hidden = true;
  document.querySelector('#strategy-detail-view').hidden = true;
  document.querySelector('#practice-desk')?.remove();
  const root = document.createElement('section');
  root.id = 'practice-desk';
  root.className = 'panel';
  document.querySelector('#view-strategies').append(root);
  const equity = strategy.kind === 'equity';
  const futures = strategy.kind === 'futures';
  const field = (id, label, value, type='number') => '<label style="display:grid;gap:8px"><span>'+label+'</span><input id="p-'+id+'" type="'+type+'" value="'+value+'" '+(type==='number'?'min="0" step="any"':'')+'></label>';
  root.innerHTML = '<button class="button secondary" id="p-back">← Choose a strategy</button><h1>'+esc(strategy.name)+'</h1><p>'+esc(strategy.subtitle)+'</p><p><strong>Paper trading · no real orders</strong> · Saved in this browser</p><details open><summary>How to practice</summary><ol>'+strategy.rules.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ol></details>'+
    (strategy.videoUrl?'<a class="strategy-reference" target="_blank" rel="noopener noreferrer" href="'+esc(strategy.videoUrl)+'"><strong>▶ Watch reference video first ↗</strong><span>'+esc(strategy.videoTitle || strategy.name)+'</span><small>'+esc(strategy.videoChannel || '')+'</small></a>':'')+
    (strategy.scriptUrl ? '<section class="strategy-reference"><strong>Install Deva Strategy in TradingView</strong><p>Download the script, open it as text, and copy it. In TradingView open Pine Editor → New strategy, replace the template, Save, then Add to chart. Use standard 1D candles. The checklist shows why a setup passes or waits.</p><a class="button primary" href="'+esc(strategy.scriptUrl)+'" download>Download Deva Strategy script</a><button class="button secondary" id="p-copy-script">Copy script for TradingView</button><small>Open the strategy results report to inspect historical simulated trades. Fees default to 0.1% per fill and slippage to 2 ticks; adjust them for your broker. This page records manual practice; the script runs on TradingView data. No live orders are sent.</small></section>' : '')+
    '<p>1. Study the chart and rules. 2. Record entry and risk. 3. Update prices. 4. Save and review your result.</p>'+
    '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:18px;margin:24px 0">'+
    field('symbol','NSE symbol / underlying','INFY','text')+field('capital','Practice capital ₹',100000)+field('qty','Quantity (shares / contract units)',1)+
    field('entry',futures?'Near future entry':'Stock entry price',1000)+field('current',futures?'Near future current':'Stock current price',1000)+
    (equity?field('stop','Stop price',975)+field('target','Target price',1050):
     field('shortEntry',futures?'Far future entry':'Call premium received',futures?1220:20)+field('shortCurrent',futures?'Far future current':'Call premium now',futures?1220:20)+field('expiry','Short contract expiry','','date')+
     (futures?field('nearExpiry','Near contract expiry','','date'):field('strike','Sold call strike',1050)))+
    field('costs','Total estimated round-trip costs ₹',0)+field('limit','Maximum planned loss ₹',1000)+'</div>'+
    '<div style="display:flex;gap:12px;flex-wrap:wrap"><button class="button secondary" id="p-quote" '+(futures?'disabled':'')+'>Fetch NSE stock quote</button><a class="button secondary" id="p-chart" target="_blank" rel="noopener noreferrer">Open daily chart ↗</a><button class="button secondary" id="p-size" '+(!equity?'hidden':'')+'>Size at 1% risk / 20% allocation</button></div>'+
    '<p id="p-feed" role="status">'+(futures?'Futures prices are manual: a live futures feed is not connected.':'Stock quotes are fetched on request. They may be delayed or from the last market session. Option premiums remain manual.')+'</p>'+
    '<div id="p-result" aria-live="polite" style="font-size:20px;padding:20px 0"></div>'+
    '<label style="display:grid;gap:8px">Why this trade? What did you learn?<textarea id="p-note" rows="3"></textarea></label>'+
    '<button class="button primary" id="p-save" style="margin:20px 0">Save practice snapshot</button><h2>Practice journal</h2><div id="p-journal"></div>';
  const $ = id => root.querySelector('#p-'+id);
  if ($('copy-script')) $('copy-script').onclick = async () => {
    try {
      const response = await fetch(strategy.scriptUrl);
      if (!response.ok) throw Error('Script download failed');
      await navigator.clipboard.writeText(await response.text());
      $('copy-script').textContent = 'Copied — paste into Pine Editor';
    } catch { $('copy-script').textContent = 'Copy unavailable — use Download above'; }
  };
  const n = id => Number($(id)?.value);
  let quote = null;
  function render() {
    const entry=n('entry'), current=n('current'), qty=n('qty'), costs=n('costs');
    const valid = entry>0 && current>0 && Number.isInteger(qty) && qty>0 && costs>=0 && n('capital')>0 && n('limit')>0 &&
      (equity?n('stop')>0 && n('stop')<entry && n('target')>entry:n('shortEntry')>=0 && n('shortCurrent')>=0 && (futures || n('strike')>0));
    $('save').disabled=!valid;
    $('chart').href='https://www.tradingview.com/chart/?symbol='+encodeURIComponent('NSE:'+ $('symbol').value.trim().toUpperCase())+'&interval=D';
    if(!valid) { $('result').textContent='Enter positive prices and whole units. For a stock trade use stop < entry < target.'; return null; }
    const pnl=((current-entry)+(equity?0:n('shortEntry')-n('shortCurrent')))*qty-costs;
    let detail = 'Current practice P&L: '+money(pnl);
    if(equity) {
      const risk=(entry-n('stop'))*qty+costs;
      detail+=' · Planned risk: '+money(risk)+' · Target P&L: '+money((n('target')-entry)*qty-costs);
      if(current<=n('stop')) detail+=' · STOP BREACHED — review exit';
      if(current>=n('target')) detail+=' · TARGET REACHED — review exit';
      if(entry*qty>n('capital')*.2) detail+=' · Above 20% stock allocation';
    } else if(!futures) {
      detail+=' · Expiry P&L at this stock price: '+money((current-entry+n('shortEntry')-Math.max(0,current-n('strike')))*qty-costs);
    } else detail+=' · Spread now: '+(n('shortCurrent')-current).toFixed(2);
    if(pnl<=-n('limit')) detail+=' · LOSS LIMIT REACHED';
    $('result').textContent=detail;
    return pnl;
  }
  function list() {
    $('journal').innerHTML=journal.filter(x=>x.strategy===strategy.id).slice(-20).reverse().map(x=>'<article style="border-top:1px solid #334155;padding:12px"><strong>'+esc(x.symbol)+' · '+money(x.pnl)+'</strong><p>'+esc(x.time)+' · '+esc(x.source)+'</p><p>'+esc(x.note)+'</p></article>').join('') || '<p>No snapshots yet. Save your first practice review.</p>';
  }
  root.addEventListener('input', e=>{ if(e.target.id==='p-current'||e.target.id==='p-symbol'){quote=null;$('feed').textContent='Manual price — fetch a quote to update its source and timestamp.';} render(); });
  $('back').onclick=()=>{root.remove();document.querySelector('#strategy-catalog-view').hidden=false;};
  $('size').onclick=()=>{const risk=n('entry')-n('stop');if(risk>0) $('qty').value=Math.max(0,Math.floor(Math.min(Math.max(0,n('capital')*.01-n('costs'))/risk,n('capital')*.2/n('entry')))); render();};
  $('quote').onclick=async()=>{
    const symbol=$('symbol').value.trim().toUpperCase();
    $('quote').disabled=true; $('feed').textContent='Fetching NSE quote…'; quote=null;
    try {
      const response=await fetch('/api/market/equity?symbol='+encodeURIComponent(symbol),{cache:'no-store'});
      const data=await response.json(); if(!response.ok)throw Error(data.error);
      if($('symbol').value.trim().toUpperCase()!==symbol)throw Error('Symbol changed; fetch again.');
      $('current').value=data.price; quote=data;
      $('feed').textContent=data.source+' · Exchange timestamp: '+data.asOf+' · Last traded price, not an executable fill'+(!equity?' · Call premium still manual':'');
      render();
    } catch(error){$('feed').textContent=error.message+' Current input remains manual.';}finally{$('quote').disabled=false;}
  };
  $('save').onclick=()=>{
    const pnl=render(); if(pnl===null)return;
    const inputs=Object.fromEntries([...root.querySelectorAll('input')].map(el=>[el.id.slice(2),el.value]));
    const item={strategy:strategy.id,symbol:$('symbol').value,time:new Date().toISOString(),pnl,inputs,note:$('note').value,source:quote?'NSE stock as of '+quote.asOf+'; other prices manual':'Manual scenario'};
    try { const next=[...journal,item];localStorage.setItem(key,JSON.stringify(next));journal=next;list();$('feed').textContent='Practice snapshot saved.'; }catch{$('feed').textContent='Could not save: browser storage is full or unavailable.';}
  };
  render();list();
}
