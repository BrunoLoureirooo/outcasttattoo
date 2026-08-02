# Handoff — Content Draft Automation (AI caption step)

## State

Workflow built, not yet imported/activated. Files:

- `content-draft-automation.json` — importable n8n workflow (Workflows → Import from File)
- `content-draft-automation.md` — design notes

Flow: Directus webhook → Prepare Prompt (code) → **Claude: Draft Caption Line** (HTTP Request) → Assemble Row (code) → Google Sheets append.

## Ollama tried first, dropped

First pass used Ollama (free/local). Checked this Coolify host's specs via Coolify MCP — no GPU. CPU-only inference isn't worth it for a task this small (one 15-word PT-PT sentence per new piece published). Switched to Claude (`claude-haiku-4-5-20251001` — cheapest/fastest tier, plenty for this).

## Still pending before activation

All noted in the sticky note inside `content-draft-automation.json` too:

- Create an n8n "Header Auth" credential (`x-api-key` = your Anthropic API key), attach to the "Claude: Draft Caption Line" node — currently `REPLACE_WITH_ANTHROPIC_CREDENTIAL_ID`
- `REPLACE_WITH_GOOGLE_SHEET_ID` in the Google Sheets node
- Real Google Sheets OAuth2 credential (currently placeholder `Google Sheets account`)
- Directus `pieces` Flow still needs wiring to POST to the webhook URL
