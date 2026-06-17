# 06 — Phase 1: Developer Tools (Cursor Prompts)

Run **05-tools-restructure-prompt.md** first. This file has one self-contained prompt
per tool — paste them into Cursor one at a time, in whatever order you like. Suggested
build order (easiest → hardest, so you get momentum early): `hash-generator` →
`json-formatter` → `jwt-decoder` → `markdown-editor` → `color-palette-generator` →
`gradient-generator` → `regex-tester` → `cron-expression-generator`.

Every prompt assumes the shared design system already in the codebase: white background,
`#FF6B35` orange accent, Plus Jakarta Sans for headings / Inter for body, Smallpdf-style
clean layout, no database, fully client-side (`'use client'`), and the existing tool
page template/layout used by your already-implemented tools. **Reference an existing
implemented tool's page as the structural template** rather than inventing a new layout
— header, breadcrumb, related-tools sidebar, etc. should stay consistent site-wide.

After each tool ships: flip its `implemented` flag to `true` in `constants/tools.ts` and
add it to the homepage featured list if there's a free slot.

---

## 1. Regex Tester & Debugger — `regex-tester`

Build the Regex Tester page following the existing tool page template.

**Functional requirements**
- Two inputs: a regex pattern field (with delimiters shown, e.g. `/pattern/`) and a flag
  toggle row (`g`, `i`, `m`, `s`, `u`) as small pill buttons.
- A multi-line test-string textarea below.
- Live evaluation on every keystroke (debounce ~150ms) — no submit button.
- Highlight every match directly inside the test string (wrap matches in a styled
  `<mark>`-style span, orange-tinted background) rather than just listing them.
- Below the test string, a "Matches" panel listing each match with its index range and,
  if there are capture groups, the named/numbered groups broken out.
- Invalid regex (bad syntax) should show an inline error message under the pattern
  field, not crash the page — wrap construction in try/catch.
- A "Common Patterns" quick-insert dropdown (email, URL, phone number, IPv4, hex color)
  that fills the pattern field on click — this is also useful SEO content.

**Edge cases**: empty pattern, empty test string, catastrophic patterns (cap evaluation
somehow or at least don't block the main thread — fine to just let it run, no need for a
worker for v1), regex with no matches (show "No matches" state, not an empty panel).

**SEO content block** (below the tool, same pattern as other tool pages): H1 "Free
Regex Tester & Debugger", a 2-3 paragraph intro explaining what it's for, a "How to use"
section, and a short FAQ (3-4 Q&As: "What regex flavor does this use?" — JavaScript;
"Does my data leave my browser?" — no, everything runs client-side; etc.).

Mark `regex-tester` as `implemented: true` once done.

---

## 2. JSON Formatter & Validator — `json-formatter`

This replaces the old basic version — build it as a genuinely upgraded tool, not a copy.

**Functional requirements**
- Large textarea/code editor for raw JSON input (a plain `<textarea>` with monospace
  font is fine for v1 — no need for a full code-editor library).
- Three actions as buttons: **Format** (pretty-print with 2-space indent), **Minify**
  (strip whitespace), **Validate** (just checks and reports valid/invalid without
  changing the input).
- On invalid JSON, show the specific parse error and, if derivable from the error
  message, the approximate line/column — don't just say "invalid JSON."
- A collapsible tree view of the parsed JSON below the editor (objects/arrays
  expand/collapse, primitive values shown inline, type-colored: strings, numbers,
  booleans, null each get a distinct subtle color).
- A "Copy" button for the formatted/minified output, and a character/byte size readout
  (useful for people checking payload size).

**Edge cases**: empty input, deeply nested JSON (tree view should handle depth without
breaking layout — indent visually, allow horizontal scroll if needed), very large input
(no hard limit needed for v1, just don't freeze on reasonable sizes).

**SEO content block**: H1 "Free JSON Formatter, Validator & Viewer", intro, "How to use",
FAQ covering things like "Is this safe for sensitive JSON data?" (yes — nothing is sent
to a server) and "Can I minify JSON here too?" (yes).

Mark `json-formatter` as `implemented: true` once done.

---

## 3. JWT Decoder & Inspector — `jwt-decoder`

**Functional requirements**
- Single input field for pasting a JWT.
- Split the token into header / payload / signature on `.` and base64url-decode header
  and payload (do this manually or with a tiny decode helper — do **not** attempt to
  verify the signature, this tool only decodes/inspects, it never validates trust).
- Display header and payload each as their own labeled, color-coded JSON tree (reuse the
  tree-view component you build for `json-formatter` if it's done first).
- If the payload contains standard claims (`exp`, `iat`, `nbf`), show a human-readable
  summary above the raw JSON: "Issued at: [date]", "Expires: [date] ([relative time, e.g.
  'in 2 hours' or 'expired 3 days ago'])". Color the expiry line red if expired, green if
  valid.
- Clear inline error if the pasted string isn't a well-formed 3-part JWT.
- A small disclaimer line near the input: "This tool only decodes — it does not verify
  the signature. Never paste tokens from systems you don't trust into any online tool."
  (This is also good for trust/SEO and reduces support questions.)

**SEO content block**: H1 "Free JWT Decoder & Inspector", intro explaining what a JWT is
in plain language, "How to use", FAQ ("Is my token uploaded anywhere?" — no, decoded
entirely in your browser; "Does this verify my JWT signature?" — no, explain why).

Mark `jwt-decoder` as `implemented: true` once done.

---

## 4. Cron Expression Generator — `cron-expression-generator`

**Functional requirements**
- Two modes, switchable by tab: **Visual Builder** (dropdowns/selects for
  minute/hour/day-of-month/month/day-of-week, each with an "every"/"specific
  value(s)"/"range" choice) and **Raw Input** (type a cron string directly).
- Both modes stay in sync with a single source of truth — building visually updates the
  raw string live, and typing a raw string updates the visual builder's selections (best
  effort; if a raw string is too complex to map back cleanly, just show the raw value
  without forcing the builder to match).
- A human-readable translation line that updates live, e.g. "At 9:00 AM, every Monday."
  You can write this translation logic by hand for the common patterns — it doesn't need
  to handle every possible cron edge case perfectly, just the common ones people
  actually search for.
- A "Next 5 run times" preview list, computed from the current expression.
- A "Copy expression" button.

**Edge cases**: invalid combinations (e.g. day 31 in February) — don't block input, just
let the next-run-time calculation naturally skip invalid dates. Malformed raw input
should show an inline error without crashing the visual builder.

**SEO content block**: H1 "Free Cron Expression Generator & Translator", intro
explaining cron syntax briefly, a small reference table of the 5 field meanings, FAQ
("What does `*` mean in cron?", "How do I run a job every 15 minutes?", etc. — these
exact-match common search queries are good for ranking).

Mark `cron-expression-generator` as `implemented: true` once done.

---

## 5. Hash Generator — `hash-generator`

**Functional requirements**
- Textarea for input text, plus a toggle for "Text" vs "File" mode — file mode lets the
  user drop/select a file and hashes its bytes instead of typed text (keep file mode
  simple: read via `FileReader`/`arrayBuffer`, no size limit needed for v1 beyond
  reasonable browser memory).
- Compute and display SHA-1, SHA-256, and SHA-512 using the Web Crypto API
  (`crypto.subtle.digest`) — these don't need an external library.
- MD5 is not available in Web Crypto — use a small, well-known pure-JS MD5
  implementation (a single dependency-free function is fine, or a tiny npm package like
  `blueimp-md5` — pick whichever is less code).
- Show all four hashes at once, each with its own "Copy" button, labeled clearly.
- Live recompute on input change (debounced), no submit button needed for text mode;
  file mode computes on file select.

**Edge cases**: empty input (show nothing or a placeholder, not hashes of empty string
unless that's actually useful — empty-string hashes are arguably fine to show, your
call), very large files (show a simple loading state while hashing).

**SEO content block**: H1 "Free Online Hash Generator (MD5, SHA-1, SHA-256, SHA-512)",
intro, "How to use", FAQ ("Is MD5 secure?" — explain briefly it's not for security
purposes anymore, "Can I hash a file instead of text?" — yes).

Mark `hash-generator` as `implemented: true` once done.

---

## 6. Color Palette Generator — `color-palette-generator`

**Functional requirements**
- A color picker (native `<input type="color">` is fine, or a small custom swatch
  picker) for the base color.
- Generate and display four palette types from that base color, each as a row of
  clickable swatches: **Complementary**, **Analogous**, **Triadic**, and
  **Monochromatic** (shades/tints of the same hue). Compute these with simple HSL
  rotation math — no external color library needed.
- Each swatch shows its hex code on hover/below it, and clicking a swatch copies the hex
  to clipboard with a small toast/checkmark confirmation.
- A "Randomize base color" button for quick exploration.
- Optionally let the user lock in a palette and export all hex codes as one
  copyable block (nice-to-have, not required for v1).

**SEO content block**: H1 "Free Color Palette Generator", intro explaining the four
harmony types in plain language (this doubles as genuinely useful content), FAQ ("What's
the difference between complementary and analogous colors?", etc.).

Mark `color-palette-generator` as `implemented: true` once done.

---

## 7. CSS Gradient Generator — `gradient-generator`

**Functional requirements**
- Toggle between **Linear** and **Radial** gradient type.
- For linear: an angle control (slider or draggable dial, 0-360°). For radial: a
  shape/position control (keep it simple — center position as two sliders is fine for
  v1, no need for full CSS radial-gradient shape/size keyword coverage).
- A color-stop list: start with 2 stops, allow adding more (up to a reasonable cap like
  6), each stop has a color picker and a position percentage slider/input. Allow
  removing stops (minimum 2).
- A large live preview box showing the actual rendered gradient, updating in real time
  as any control changes.
- A read-only output box showing the generated CSS (`background: linear-gradient(...)`
  or `radial-gradient(...)`), with a "Copy CSS" button.
- A handful of preset gradients (5-6 nice-looking ones) as one-click swatches to start
  from, since blank-canvas tools are intimidating.

**SEO content block**: H1 "Free CSS Gradient Generator", intro, "How to use", FAQ ("How
do I add more than 2 colors to a gradient?", "What's the difference between linear and
radial gradients?").

Mark `gradient-generator` as `implemented: true` once done.

---

## 8. Markdown Editor & Preview — `markdown-editor`

**Functional requirements**
- Split-pane layout: raw Markdown textarea on the left, rendered live preview on the
  right (stack vertically on mobile instead of side-by-side — check your existing
  responsive breakpoints/conventions for other split-view components if you have any).
- Use a small markdown-rendering library (e.g. `marked` or `markdown-it`) rather than
  hand-rolling a parser. Sanitize rendered HTML output (e.g. with `DOMPurify`) since
  it's user input being rendered as HTML.
- Live preview updates as the user types (no debounce needed unless it's visibly janky).
- Toolbar above the editor with quick-insert buttons for common syntax: bold, italic,
  link, image, code block, bullet list, numbered list, heading — clicking wraps/inserts
  at the cursor position.
- A "Copy Markdown" and a "Copy as HTML" button for the two outputs.
- Persist nothing server-side — this is a pure in-browser session tool, no save/share
  link needed for v1.

**SEO content block**: H1 "Free Online Markdown Editor with Live Preview", intro, "How
to use", FAQ ("Can I export this as HTML?" — yes, "Is my text saved anywhere?" — no,
purely local to your browser session).

Mark `markdown-editor` as `implemented: true` once done.

---

## After Phase 1 is done

Once all 8 are live: re-check the homepage featured section and footer (from the
restructure prompt) — with 8 new tools shipped you'll likely want to refresh which
tools are featured, since "featured" should probably lean toward your highest
search-volume, most-impressive tools (regex tester, JSON formatter, JWT decoder are
good homepage anchors).

Phase 2 (Math & Science — 4 tools) is next whenever you're ready for that prompt set.