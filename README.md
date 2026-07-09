# Ledger — AI Chat Box

A small AI chat widget styled as an old-fashioned accounting ledger book. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

Every message is rendered as a numbered ledger entry: your messages are tagged **DR** (debit), Ledger's replies are tagged **CR** (credit), complete with ruled paper, a red margin rule, and a little ink "stamp" on each response.

## Files

```
ledger/
├── index.html   # Markup + font and Puter.js script tags
├── style.css    # All ledger-book styling
└── script.js    # Chat logic and API calls
```

All three files must stay in the same folder — `index.html` loads the other two by relative path.

## How it works

The chat is powered by **[Puter.js](https://js.puter.com/v2/)**, a free client-side AI API that requires no API key or backend server. It's backed by OpenAI models — the app explicitly pins the model to `gpt-5-nano` in `script.js`.

```js
const response = await puter.ai.chat(history, { model: 'gpt-5-nano' });
```

On first use, Puter may open a small authentication popup in the browser — this is expected and only happens once.

## Running it

No installation needed. Just open `index.html` in any modern browser:

- Double-click the file, **or**
- Right-click → Open with → your browser, **or**
- Serve it locally, e.g. `npx serve .` or Python's `python3 -m http.server`

## Customizing

- **Persona**: edit the `system` message at the top of `script.js` to change how Ledger behaves or responds.
- **Model / provider**: swap the `model` value in the `puter.ai.chat(...)` call, or replace that call entirely with a `fetch()` to a different provider (OpenAI, Groq, OpenRouter, etc.) — note that using your own provider directly will require you to supply and manage an API key yourself, which shouldn't be hardcoded in client-side files.
- **Look and feel**: colors, fonts, and spacing are all defined as CSS variables at the top of `style.css` under `:root`.

## Notes

- This is a front-end-only demo — there is no backend, database, or persistence. Chat history resets on page reload.
- Not affiliated with Google or Claude/Anthropic APIs by design; the underlying model is OpenAI-based via Puter.js.
