# Content draft automation

Directus → n8n → Google Sheet. Design approved. Workflow JSON built: `content-draft-automation.json` in this dir — import via n8n UI (Workflows → Import from File). n8n MCP tools (search/get-details/execute) can't create workflows, so import is manual. See sticky note in the JSON for setup steps (Sheet ID, credential, Directus Flow wiring).

## Trigger

Directus Flow (webhook) on `pieces` collection, item create/publish. Fires from Directus admin directly — independent of Astro static-site rebuild.

## n8n workflow

Receives payload (artistName, service, styles[], images[], dateCompleted) → builds PT-PT caption block:

- Line 1: AI-drafted hook line via Claude (`claude-haiku-4-5-20251001`) — short PT-PT sentence announcing the piece, no emojis/hashtags. Falls back to plain template ("Nova tatuagem por {artist}") if the call fails or errors.
- Line 2: hashtags derived from styles[] + fixed tags (#outcasttattoo, #leiria) — template-generated, not AI, so tagging stays deterministic/on-brand
- Line 3: image reminder — Directus asset URLs, note "usar imagem 1" (first image = grid tile, matches site convention in `Piece` type)

Nodes: HTTP trigger → Prepare Prompt (code) → Claude HTTP Request (`/v1/messages`) → Assemble Row (code) → Google Sheets append node. Needs an Anthropic API key (Header Auth credential) — see sticky note in the JSON for setup.

Ollama was the first pass (free/local) but this Coolify host has no GPU — CPU-only inference wasn't worth it for one short caption line per new piece. Switched to Claude Haiku, cheap enough per-call that it doesn't matter.

## Output

Append row to shared Google Sheet. Columns: date | artist | caption | hashtags | image links | posted?

Sheet chosen over Doc — sortable rows + "posted" checkbox.

## Human step

Artist/owner opens sheet, copies caption, posts manually to IG. No auto-post — deliberate, caption tone/curation matters, auto-posting rejected as too risky.

## Other lanes discussed, not started

Booking → Calendar auto-block, no-show reminders, Google Business review nudges.
