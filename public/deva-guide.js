import { explainWords } from './trading-words.js';
const storageKey = 'deva-guided-lesson-v1';
const lessonWords = [[], [], ['Candle', 'LTP', 'Volume'], ['EMA'], ['EMA'], ['Resistance', 'Support', 'Breakout', 'Volume', 'RSI'], ['P&L', 'Drawdown', 'Profit factor', 'Slippage'], ['ATR', 'Stop-loss', 'Target', 'Reward-to-risk']];
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const steps = [
  { title:'Start with the business', text:'A good company is not automatically a good entry today. First say what it earns money from. Muthoot Finance lends against pledged gold jewellery; you are buying a lender, not a piece of gold.',
    action:'Choose the stock symbol below. Open its company website and read what it does. For Muthoot, check loan growth, borrowing costs, bad loans, and results dates before forming a view.',
    question:'If gold rises, must Muthoot shares rise?', choices:['No — it is a lender with other business risks','Yes — the share price follows gold exactly'], correct:0,
    feedback:'Gold affects collateral value and lending capacity, but funding costs, loan demand, regulation, valuation, and investor expectations also matter. A gold rally is context, not a buy signal.',
    link:['Muthoot business / gold loans','https://www.muthootfinance.com/gold-loan'] },
  { title:'Check the market: what is NIFTY?', text:'NIFTY 50 is an index of 50 large companies across sectors. Think of it as a broad market reference, not a forecast for every share. Your stock can fall while the index rises.',
    action:'Open NIFTY on a 1D chart. Compare the last few weeks: are highs and lows rising, falling, or mixed? Then check the stock over those SAME dates. Financial companies can also be compared with a financial-sector index; not every lender is a bank.',
    question:'NIFTY rises but your stock keeps making lower highs. What does that tell you?', choices:['The stock must catch up tomorrow','The stock is relatively weak; its own setup still matters'], correct:1,
    feedback:'A stronger market is useful context, but it cannot override weak price action in this stock. NIFTY and gold are NOT automatic filters in Deva v1; these are extra observations for your journal.',
    link:['Open NIFTY daily chart','https://www.tradingview.com/chart/?symbol=NSE%3ANIFTY&interval=D'] },
  { title:'Set up a clean daily chart', text:'One daily candle summarises a trading day: open, high, low, and close. The body joins open to close; thin wicks show the extremes. With standard colours, green closes above its open and red below.',
    action:'Open your stock with the button below. Select 1D and standard Candles. Temporarily hide extra indicators using the eye icon next to their names. In your screenshot, “Volume Delta Footprint Map” adds many coloured levels; those are not Deva levels. Keep Volume and Deva for this lesson.',
    question:'The current daily candle has a countdown. Is its final close known?', choices:['No — it is still forming','Yes — use the current price as the final close'], correct:0,
    feedback:'Wait for the daily candle to finish. A price can break a level during the day and close below it. Also move the crosshair to the candle you mean: the OHLC numbers at the top may describe an old candle, not today.',
    candle:true },
  { title:'Install the script and read its lines', text:'In TradingView open Pine Editor, create a strategy, replace the starter text with Deva, Save, then Add to chart. If “Deva Strategy - Daily Breakout v1” already appears on your chart, it is installed—do not add a second copy.',
    action:'Use Copy script below if needed. Orange = 20-day EMA; blue = 50-day EMA. EMA means an average that gives recent prices more weight. Grey = highest high of the previous 20 candles. Red/green stop and target lines belong to simulated trades.',
    question:'What is an old “Deva Long” arrow in January?', choices:['A buy instruction for today','A historical simulated entry at that time'], correct:1,
    feedback:'Read the rightmost CLOSED candle for today’s setup. Historical arrows explain the backtest; they are not current recommendations.',
    script:true },
  { title:'Is the trend actually rising?', text:'Deva requires all three: price above the blue 50 EMA, orange 20 EMA above blue, and blue higher than it was five candles ago. A falling stock is not a bargain signal just because it used to be expensive.',
    action:'Look at the latest closed candle and the two EMA lines. If any condition fails, record WAIT. In your September 9 screenshot the displayed price is about ₹2,811, below orange around ₹2,969 and blue around ₹3,014. At that captured moment, Deva’s trend test fails. These are screenshot values, not live quotes.',
    question:'Price is below both averages and orange is below blue. What does Deva say?', choices:['WAIT — the rising-trend test fails','Buy because the old high was much higher'], correct:0,
    feedback:'WAIT is a useful result. You can keep watching for the structure to change or study another stock. It does not mean the stock can never recover.' },
  { title:'Find resistance, then check the breakout', text:'Resistance is an area where previous advances met selling; support is an area where previous declines met buying. They are zones, not guaranteed walls. Deva uses the previous 20 candles’ highest high as a simple breakout level.',
    action:'Use the horizontal-line drawing tool to mark that prior high, excluding the candle being tested. Does the completed candle CLOSE above it? A wick above with a close below does not pass. Then check Volume ≥ 1.5× its prior 20-day average and RSI(14) between 50 and 70. Use the Deva checklist, or add RSI through Indicators.',
    question:'A candle’s wick crosses resistance but its close is below it. Is that a Deva breakout?', choices:['Yes — touching the level is enough','No — the close must be above it'], correct:1,
    feedback:'All four checks must pass on the same closed candle: trend, breakout, volume, and RSI. A pass is a testable setup, not a measured probability of profit. RSI describes momentum; it does not predict tomorrow.' },
  { title:'Understand the test results before trading', text:'Your screenshot shows 26 simulated trades, 11 winners (42.31%), about ₹2,851.80 total P&L, ₹5,557.36 maximum drawdown, and profit factor 1.211. The displayed date range spans May 2011 to September 2026—not one month.',
    action:'Open the strategy results report and its trades list. Click a losing trade, then a winning one, and inspect their entry and exit candles. Check fees, slippage, date range, and trade count. Profit factor compares gross profits with gross losses; drawdown measures a peak-to-trough decline.',
    question:'Does +2.85% across that displayed test mean +2.85% every month?', choices:['No — it is the total over that test','Yes — that is the monthly return'], correct:0,
    feedback:'This screenshot is not convincing evidence of a dependable strategy. Results depend on settings and sample; test other stocks and untouched periods. Keep a separate forward paper journal rather than adjusting rules until old results look good.' },
  { title:'Write your decision, then practice', text:'Finish with a decision you can explain: WAIT because a condition failed, or PAPER SETUP because every required check passed. Waiting and recording why is a complete lesson.',
    action:'If a setup passes, record the stock, candle date, entry assumption, stop, target, size, and reason. Deva simulates entry on the next bar, a stop 2× ATR away, and a target twice that distance. ATR measures recent price movement. The form below is manual and does not read TradingView.',
    question:'Which plan is specific enough to review?', choices:['It looks cheap; I hope to make ₹100','Record conditions, entry, stop, target, quantity, and what invalidates the idea'], correct:1,
    feedback:'Example only: entry ₹1,000, stop ₹980, target ₹1,040. With ₹1 lakh capital, the 1% risk cap allows 50 shares, but the 20% allocation cap allows only 20. Use the smaller 20: ₹400 price risk and ₹800 target gain before costs. Gaps can produce worse fills.' },
];
export function mountDevaGuide(root, onPractice) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch {}
  let index = Number.isInteger(saved.index) ? Math.max(0, Math.min(steps.length-1,saved.index)) : 0;
  let answers = saved.answers && typeof saved.answers === 'object' ? saved.answers : {};
  let notes = saved.notes && typeof saved.notes === 'object' ? saved.notes : {};
  let symbol = typeof saved.symbol === 'string' && /^[A-Z0-9&-]{1,30}$/.test(saved.symbol) ? saved.symbol : 'MUTHOOTFIN';
  let status = '';
  function save() { try { localStorage.setItem(storageKey,JSON.stringify({index,answers,notes,symbol})); } catch { status='Progress could not be saved in this browser.'; } }
  function render(focus=false) {
    const step=steps[index], answered=Number.isInteger(answers[index]), correct=answers[index]===step.correct;
    root.innerHTML='<div class="deva-guide-heading"><div><span class="eyebrow">Learn by doing · Deva Strategy</span><h2 tabindex="-1">Let’s read your stock together</h2><p>Keep this guide beside TradingView. You observe the chart; the guide explains each next action.</p></div><button class="button secondary" id="g-restart">Restart lesson</button></div>'+
      '<label class="deva-symbol">Your NSE stock symbol<input id="g-symbol" value="'+escape(symbol)+'" maxlength="30"></label><a class="button secondary" id="g-chart" href="https://www.tradingview.com/chart/?symbol='+encodeURIComponent('NSE:'+symbol)+'&interval=D" target="_blank" rel="noopener noreferrer">Open '+escape(symbol)+' daily chart ↗</a>'+
      '<p class="deva-progress">Step '+(index+1)+' of '+steps.length+' · '+Object.keys(answers).filter(k=>answers[k]===steps[k]?.correct).length+' checks understood</p><progress max="'+steps.length+'" value="'+(index+1)+'"></progress>'+
      '<nav class="deva-step-nav" aria-label="Lesson steps">'+steps.map((s,i)=>'<button class="button secondary" data-step="'+i+'" '+(i===index?'aria-current="step"':'')+'>'+ (i+1) +'. '+escape(s.title)+'</button>').join('')+'</nav>'+
      '<article class="deva-lesson"><h3 tabindex="-1">'+escape(step.title)+'</h3><p>'+escape(step.text)+'</p>'+
      (step.candle?'<svg viewBox="0 0 440 150" role="img" aria-label="Illustration of a green daily candle: high and low at the wick ends, close at body top and open at body bottom"><line x1="95" y1="15" x2="95" y2="135" stroke="#73d9b5" stroke-width="3"/><rect x=" seventy" y="45" width="50" height="55" fill="#73d9b5"/><text x="145" y="23">High: highest traded price</text><text x="145" y="55">Close (green candle)</text><text x="145" y="100">Open (green candle)</text><text x="145" y="140">Low: lowest traded price</text></svg>'.replace('x=" seventy"','x="70"'):'')+
      '<div class="deva-action"><strong>Do this now</strong><p>'+escape(step.action)+'</p></div>'+
      (step.link?'<a href="'+step.link[1]+'" target="_blank" rel="noopener noreferrer">'+escape(step.link[0])+' ↗</a>':'')+
      (step.script?'<div class="deva-guide-actions"><button class="button primary" id="g-copy">Copy Deva script</button><a href="/deva-strategy.pine" download class="button secondary">Download script</a></div>':'')+
      (lessonWords[index].length ? explainWords(lessonWords[index]) : '')+
      '<fieldset><legend>Quick check: '+escape(step.question)+'</legend>'+step.choices.map((c,i)=>'<label><input type="radio" name="guide-answer" value="'+i+'" '+(answers[index]===i?'checked':'')+'>'+escape(c)+'</label>').join('')+'</fieldset>'+
      (answered?'<p class="deva-feedback" role="status"><strong>'+(correct?'That’s right. ':'Take another look. ')+'</strong>'+escape(step.feedback)+'</p>':'')+
      '<label class="deva-observation">What do you see on your chart?<textarea id="g-note" rows="3" placeholder="For example: price is below both averages, so I am waiting.">'+escape(notes[index]||'')+'</textarea></label>'+
      '<p id="g-status" role="status">'+escape(status)+'</p><div class="deva-guide-actions"><button class="button secondary" id="g-prev" '+(index===0?'disabled':'')+'>← Previous</button><button class="button primary" id="g-next" '+(!correct?'disabled':'')+'>'+(index===steps.length-1?'Finish lesson & open practice':'Understood — next →')+'</button><button class="button secondary" id="g-practice">Open manual worksheet</button></div></article>'+
      '<p class="deva-source">References: <a href="https://www.niftyindices.com/indices/equity/broad-based-indices/nifty--50" target="_blank" rel="noopener noreferrer">NIFTY 50</a> · <a href="https://www.muthootfinance.com/gold-loan" target="_blank" rel="noopener noreferrer">Muthoot gold lending</a>. Chart figures are from your supplied screenshot, not a live feed.</p>';
    root.querySelector('#g-symbol').oninput=e=>{const value=e.target.value.trim().toUpperCase();if(/^[A-Z0-9&-]{1,30}$/.test(value)){symbol=value;save();const a=root.querySelector('#g-chart');a.href='https://www.tradingview.com/chart/?symbol='+encodeURIComponent('NSE:'+symbol)+'&interval=D';a.textContent='Open '+symbol+' daily chart ↗';}};
    root.querySelector('#g-note').oninput=e=>{notes[index]=e.target.value;save();};
    root.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{index=Number(b.dataset.step);save();render(true);});
    root.querySelectorAll('[name="guide-answer"]').forEach(r=>r.onchange=()=>{answers[index]=Number(r.value);save();render();});
    root.querySelector('#g-prev').onclick=()=>{index=Math.max(0,index-1);save();render(true);};
    root.querySelector('#g-next').onclick=()=>{if(index<steps.length-1){index++;save();render(true);}else onPractice(symbol,Object.values(notes).join('\n'));};
    root.querySelector('#g-practice').onclick=()=>onPractice(symbol,Object.values(notes).join('\n'));
    root.querySelector('#g-restart').onclick=()=>{index=0;save();render(true);};
    const copy=root.querySelector('#g-copy');
    if(copy)copy.onclick=async()=>{try{const r=await fetch('/deva-strategy.pine');if(!r.ok)throw Error();await navigator.clipboard.writeText(await r.text());copy.textContent='Copied — paste into Pine Editor';}catch{copy.textContent='Use Download; clipboard unavailable';}};
    if(focus)root.querySelector('.deva-lesson h3').focus();
  }
  render();
}
