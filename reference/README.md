# Reference: original terminal chatbot

`original_terminal_chatbot.py` is the Python script you uploaded. It is kept
here only for reference — it is not used by the web app.

`src/services/chatService.ts` is the browser port of this script: same
"AgStock/AgriSense AI" persona, same preset commodity prices, same
Groq-first / rule-based-fallback priority order, adapted to run from
React instead of a terminal.

Note: the `.env` file that came with the original script (containing your
Groq API key) was intentionally **not** copied into this project. Put your
own key in a `.env` file at the project root as `VITE_GROQ_API_KEY=...`
(see `.env.example`) — never commit a real key to source control.
