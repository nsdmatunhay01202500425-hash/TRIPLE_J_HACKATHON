#!/usr/bin/env python3
"""
Terminal Chatbot (free cloud AI via Groq)
--------------------------------------------
A chatbot that runs in the command line / terminal, backed by a real AI
model through Groq's free cloud API.

Priority order each time it starts:
    1. Groq API (free) — used if GROQ_API_KEY is set.
    2. Anthropic's Claude API — used if ANTHROPIC_API_KEY is set instead.
    3. Simple rule-based mode — used if neither key is set.

--- Setup ---
    1. Get a free key at https://console.groq.com/keys
    2. Open the .env file (next to this script) and paste your key:
         GROQ_API_KEY=gsk_your-key-here
    3. Run: python chatbot.py

"""

import json
import os
import random
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime


# ---------------------------------------------------------------------------
# Load variables from the .env file (no extra packages needed)
# ---------------------------------------------------------------------------
ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
ENV_FOUND = os.path.exists(ENV_PATH)


def load_env(path: str = ENV_PATH) -> None:
    """Read KEY=VALUE lines from the .env file next to this script and put
    them into os.environ. A non-empty real environment variable wins."""
    if not os.path.exists(path):
        return
    # utf-8-sig strips the invisible BOM that Windows Notepad can add
    with open(path, encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if value and not os.environ.get(key):
                os.environ[key] = value


load_env()

BOT_NAME = "AgStock AI"

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b")

ANTHROPIC_MODEL = "claude-sonnet-5"

# ---------------------------------------------------------------------------
# Preset commodity prices (PHP per kg). These are treated as ground truth —
# the AI is instructed to always use these exact numbers when a listed
# product is asked about, instead of guessing or making up a price.
# ---------------------------------------------------------------------------
PRESET_PRICES = {
    "rice": 57,
    "tomato": 88.7,
    "corn": 51.6,
    "pechay": 62,
    "sayote": 36,
    "onion": 150.2,
    "garlic": 95.3,
    "durian": 75,
    "mangga": 80,
    "kamote": 40,
}

_price_list_str = "\n".join(
    f"- {name.capitalize()}: PHP {price}/kg" for name, price in PRESET_PRICES.items()
)

SYSTEM_PROMPT = f"""AgStock Intelligence Agent
You are AgStock AI, an expert agricultural economist, commodity trader, and real-time spatial profit advisor. Your core objective is to analyze crop, fruit, and vegetable markets like a financial stock terminal—helping farmers, traders, and agri-logistics managers calculate precise net profitability, evaluate location-based arbitrage, and track commodity price trends.
---
1. CORE OPERATIONAL MANDATE
When responding to user queries, you must evaluate agricultural transactions not just by gross market price, but through land-to-market net profitability.
Mathematical Profit Framework
For any yield/crop profitability calculation, evaluate:
Net Profit (P) = (W_usable * P_market) - [ C_production + C_logistics + C_storage + C_spoilage + C_platform ]
Where:
W_usable: Effective marketable weight in kg after transit/holding spoilage losses:
`W_usable = W_total * (1 - Spoilage_Rate_Percentage)`
P_market: Target market price per kg at destination location.
C_production: Total base production cost (seeds, fertilizer, water, labor, harvesting).
C_logistics: Freight cost based on distance: `(Cost_per_kg_per_km * Distance_km * W_total)`.
C_storage: Holding costs over time (cold storage, warehousing per day/week).
C_spoilage: Opportunity cost of lost/spoiled crops.
C_platform: Market fees, commissions, or local trading taxes.
---
2. KEY AGSTOCK TERMINAL CAPABILITIES
A. Ticker Identification & Standardization
Treat agricultural commodities like stock assets:
Use structured ticker symbols in the format: `[CROP]-[VARIETY]-[GRADE]` (e.g., `TOM-ROMA-A` for Grade A Roma Tomatoes, `BAN-CAV-A` for Class A Cavendish Bananas, `MAN-CAR-PREM` for Premium Carabao Mangoes).
Report metrics using financial standards: OHLC (Open, High, Low, Close daily spot prices), Basis Spread (price difference between Farmgate and Urban/Wholesale markets), and Volume.
B. Spatial Arbitrage Engine
When given multiple market options or locations:
Compare target destination market prices against local farmgate prices.
Deduct exact transportation and transit risk costs for each location.
Recommend the optimal market hub that yields the highest NET profit (not just highest gross price).
C. Risk & Sensitivity Analysis
Automatically highlight risk factors:
Shelf-Life vs. Distance: Alert if transport/storage time approaches crop perishability limits.
Price Volatility: Highlight historical daily fluctuation ranges for the target crop.
---
3. RESPONSE STRUCTURE & OUTPUT FORMAT
Always format your analysis cleanly and professionally using standard Markdown:
Executive Verdict: 1-2 sentence summary stating the calculated net profit, optimal market destination, and return on investment (ROI %).
Profitability Breakdown Table: Clear line-item display of gross revenue, transport costs, spoilage deductions, base costs, and final net margin.
Location & Arbitrage Comparison: A table or comparative summary comparing local vs. regional destination hubs if multiple locations are evaluated.
Actionable Recommendations: Bulleted risk mitigation strategies (e.g., optimal harvesting times, cold-chain transport advice, market timing).
---
4. INTERACTION BEHAVIOR & RULES
Never assume zero logistics costs: If distance/location is provided without transport rates, apply reasonable regional standards or explicitly state your benchmark assumptions.
Always quantify in kg and local currency: Standardize weights to Kilograms (kg) or Metric Tons (MT) unless explicitly requested otherwise.
Precision: Perform step-by-step math before declaring final profit numbers. Always distinguish between Gross Revenue and Net Profit.
---
5. PRESET COMMODITY PRICES (PHP per kg) — TREAT AS GROUND TRUTH
For the following products, you MUST always use these exact preset prices as
the current market/farmgate price (P_market) unless the user explicitly gives
you a different price to use for a calculation:
{_price_list_str}

Rules for pricing:
- If the user asks the price of one of the products above, state that exact
  preset price. Do not recalculate or estimate it.
- If the user asks about a real agricultural crop, fruit, or vegetable that is
  NOT in the preset list above (e.g. "sitaw", "banana", "calamansi"), give a
  reasonable rough estimate in PHP/kg based on typical current Philippine
  market rates, and clearly label it as an estimate (e.g. "~PHP 60/kg,
  estimated — not an official preset price").
- If the user asks about something that is not an agricultural
  crop/fruit/vegetable commodity at all (e.g. a random object, brand, or
  unrelated item), reply that the product is not in the list and is outside
  AgStock's scope.
"""

EXIT_WORDS = {"bye", "goodbye", "exit", "quit", "see ya"}

# ---------------------------------------------------------------------------
# Figure out which backend to use, in priority order: Groq > Claude > rules
# ---------------------------------------------------------------------------
MODE = "rules"
anthropic_client = None

groq_key = os.environ.get("GROQ_API_KEY", "").strip()
anthropic_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()

# Ignore the placeholder text from the template .env file
if groq_key.startswith("gsk_paste"):
    groq_key = ""

if groq_key:
    MODE = "groq"
elif anthropic_key:
    try:
        import anthropic
        anthropic_client = anthropic.Anthropic(api_key=anthropic_key)
        MODE = "anthropic"
    except ImportError:
        print("(Note: 'anthropic' package not installed — run "
              "'pip install anthropic' to use it. Falling back.)\n")

# ---------------------------------------------------------------------------
# Rule-based fallback data (used only if no AI backend is available)
# ---------------------------------------------------------------------------
PATTERNS = [
    (r"\b(hi|hello|hey|yo|sup)\b", [
        "Hey there! How's it going?",
        "Hello! What's on your mind?",
        "Hi! Good to see you."
    ]),
    (r"\bhow are you\b", [
        "I'm just a bunch of if-statements, but I'm doing great! You?",
        "Running smoothly, thanks for asking!",
    ]),
    (r"\bmy name is (\w+)", [
        "Nice to meet you, {0}!",
        "Got it, I'll remember you as {0}."
    ]),
    (r"\bwhat('?s| is) your name\b", [
        f"I'm {BOT_NAME}, your friendly terminal chatbot.",
    ]),
    (r"\b(bye|goodbye|exit|quit|see ya)\b", [
        "Goodbye! Talk soon.",
        "See you later!",
    ]),
    (r"\bthank(s| you)\b", [
        "You're welcome!",
        "Anytime!",
    ]),
    (r"\bwhat time is it\b", [
        lambda: f"It's currently {datetime.now().strftime('%H:%M:%S')}.",
    ]),
    (r"\bwhat('?s| is) the date\b", [
        lambda: f"Today's date is {datetime.now().strftime('%Y-%m-%d')}.",
    ]),
    (r"\bhow old are you\b", [
        "I was just started this session, so I'm brand new!",
    ]),
    (r"\b(joke|funny)\b", [
        "Why do programmers prefer dark mode? Because light attracts bugs.",
        "I would tell you a UDP joke, but you might not get it.",
    ]),
    (r"\b(help|commands)\b", [
        "You can just chat normally! Type 'bye' or 'quit' to leave, "
        "or 'help' to see this message again.",
    ]),
    (r"\?$", [
        "That's an interesting question. Tell me more?",
        "Hmm, I'm not totally sure — what do you think?",
    ]),
]

FALLBACKS = [
    "I'm not sure I understand. Could you rephrase that?",
    "Interesting — tell me more.",
    "Hmm, I don't have a good answer for that yet.",
    "Go on...",
]


def get_rule_response(user_input: str) -> str:
    text = user_input.lower().strip()
    for pattern, replies in PATTERNS:
        match = re.search(pattern, text)
        if match:
            reply = random.choice(replies)
            if callable(reply):
                return reply()
            if match.groups():
                return reply.format(*match.groups())
            return reply
    return random.choice(FALLBACKS)


def should_exit(user_input: str) -> bool:
    text = user_input.lower().strip()
    return any(re.search(rf"\b{w}\b", text) for w in EXIT_WORDS)


# ---------------------------------------------------------------------------
# AI backends
# ---------------------------------------------------------------------------
def get_groq_response(history: list) -> str:
    """Call Groq's free, cloud-hosted OpenAI-compatible chat API."""
    payload = {
        "model": GROQ_MODEL,
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + history,
    }
    try:
        req = urllib.request.Request(
            GROQ_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {groq_key}",
                "User-Agent": "Mozilla/5.0 (compatible; TerminalChatbot/1.0)",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        return data["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        return f"[Groq API error {e.code}: {body}]"
    except Exception as e:
        return f"[Error contacting Groq API: {e}]"


def get_anthropic_response(history: list) -> str:
    try:
        response = anthropic_client.messages.create(
            model=ANTHROPIC_MODEL,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=history,
        )
        return response.content[0].text
    except Exception as e:
        return f"[Error contacting Claude API: {e}]"


def main():
    labels = {
        "groq": f"free AI mode — Groq ({GROQ_MODEL})",
        "anthropic": "AI mode — Claude API",
        "rules": "rule-based mode",
    }
    print(f"=== {BOT_NAME} Chatbot — {labels[MODE]} ===")
    if MODE == "rules":
        print("(No API key found, so using simple rule-based replies.)")
        if not ENV_FOUND:
            print(f"  -> No .env file found. Expected it at: {ENV_PATH}")
            print("     (On Windows, check it isn't named '.env.txt'.)")
        else:
            print(f"  -> Found .env at {ENV_PATH}, but GROQ_API_KEY is "
                  "missing, empty, or still the placeholder.")
    print("Type 'bye' or 'quit' to end the conversation.\n")

    history = []  # used in groq/anthropic modes to keep conversation context

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print(f"\n{BOT_NAME}: Goodbye!")
            sys.exit(0)

        if not user_input:
            continue

        if MODE == "groq":
            history.append({"role": "user", "content": user_input})
            response = get_groq_response(history)
            history.append({"role": "assistant", "content": response})
        elif MODE == "anthropic":
            history.append({"role": "user", "content": user_input})
            response = get_anthropic_response(history)
            history.append({"role": "assistant", "content": response})
        else:
            response = get_rule_response(user_input)

        print(f"{BOT_NAME}: {response}")

        if should_exit(user_input):
            sys.exit(0)


if __name__ == "__main__":
    main()
