# MarketMind AI

A local-first Indian market learning, IPO research, and option-strategy dashboard with streamed Gemini chat and PDF/image analysis.

Open mainboard IPOs are fetched server-side from NSE India when the app loads and whenever **Refresh live** is pressed. The backend handles NSE's session cookies, normalizes the response, and caches it for five minutes. Saved records are used only as a fallback when NSE is unreachable; your notes, promoter details, GMP field, and manual IPOs are preserved across refreshes.

## Run it

1. Revoke the API key that was pasted into chat and create a new Gemini API key.
2. Put the new key after `GEMINI_API_KEY=` in the existing `.env` file.
3. Run:

   ```powershell
   npm start
   ```

4. Open [http://127.0.0.1:4173](http://127.0.0.1:4173).

No `npm install` is required. Node.js 20 or newer is sufficient.

## What stays local

- Learning progress, IPO notes, and chat display history use browser `localStorage`.
- The API key stays in `.env` on the server and is never returned to the browser.
- Files are sent only with the individual AI request; this app does not save uploaded documents to disk.

## Test without an API key

Set `MOCK_AI=true` in `.env`, restart, and send a message. This checks the complete streaming UI and backend route without calling Gemini.

## Strategy Simpler

The **Strategies** workspace contains one reusable catalog, payoff chart, P&L tracker, and stop-loss alert. Strategy definitions live in `public/strategies.js`, so adding or tuning a strategy does not duplicate the UI.

The **1% Athishaktham** entry follows Sharique Samsudheen's linked video example: four protected NIFTY option legs, about ₹6 net credit per side, one 25-unit lot, roughly ₹30,000 capital, and a side-specific stop at three times that side's maximum profit. The 2024 video entered on Wednesday for Thursday expiry; the app flags that current NSE NIFTY weekly expiry is Tuesday and that any Monday adaptation needs fresh testing.

### Formula worksheet

The strategy detail screen includes a linked beginner-friendly worksheet for the trading range, four option legs, target ROI, premiums, maximum profit, and the 3x side-specific stop. Editing either boundary automatically moves that side's sell strike and its 150-point protective hedge; when a matching live NSE strike is available, the worksheet also uses its current bid/ask premiums. The **Use video example** button restores the exact 22,240 / 22,650 / 21,900 example with ₹150 maximum profit and ₹450 stop on each side. Thesis and boundary-reason notes are saved locally.

### Real-data paper trading

Opening the strategy automatically loads the latest official NSE NIFTY option-chain snapshot, market status, exchange timestamp, available expiries, and permitted lot size. The app selects sell quotes closest to the video's ₹8–₹10 target, buys protection at least 150 points farther away, uses bid prices for simulated sells and ask prices for simulated buys, and feeds those values into the shared payoff and stop-loss tools.

The strategy page also embeds TradingView's interactive NIFTY chart with candles, intervals, indicators, and drawing tools. A linked level strip mirrors the worksheet's lower boundary, current spot, upper boundary, protected option legs, and expiry. TradingView data may be delayed; the option-chain and paper-fill calculations continue to use the app's separate NSE feed.

**Start paper trade** records simulated entry fills only. It does not connect to a broker or place an order. Paper P&L marks short legs at the current ask and long legs at the current bid, so the opening spread is visible. While NSE reports the market open, an active paper position refreshes about once per minute; it can also be refreshed manually. Exchange data use remains subject to NSE's terms, and brokerage, taxes, slippage, margin changes, and execution risk are not included.

## Guided tour

The first visit automatically starts an eleven-step walkthrough covering Overview, Learning Path, the live IPO source, IPO notes, Strategy Simpler, the linked decision formula, the interactive trading chart, real-data paper trading, the payoff and stop tools, the AI copilot, and local backups. The **Tour** button in the top bar replays it at any time. Completing or skipping the walkthrough returns you to the page where you started.

## Limits

- Up to six PDF, text, CSV, JSON, PNG, JPG, or WEBP files per message.
- Each attachment must be below 7 MB, with roughly 18 MB total per request.
- Manually added IPO dates and figures are not verified automatically. Confirm time-sensitive values with official filings/exchanges.
- NSE-sourced opening dates, closing dates, price bands, and subscription multiples are live at the time shown in the source banner. GMP remains manually entered because it is unofficial market data.
- Strategy payoffs are expiry-only estimates. They exclude brokerage, taxes, slippage, margin changes, liquidity, volatility changes, and pre-expiry option value.
