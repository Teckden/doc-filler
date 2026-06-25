# DocFill

A fully client-side web app for filling `.docx` templates with data — built so that **no document or field data ever leaves the browser**.

Users upload a Word template that contains placeholder fields, the app auto-generates a form from those fields, and a live preview of the resulting document renders alongside the form as they type. The finished document is exported back as a real `.docx` with the original formatting preserved exactly.

Designed for long, repetitive, sensitive document work — the kind where privacy is non-negotiable and the interface needs to stay out of the way.

## Why it exists

Filling the same Word template over and over by hand is slow and error-prone. Existing online tools usually send your document to a server to do the work — a non-starter when the data is sensitive. DocFill does everything **in the browser**: parsing, form generation, rendering, and export all run locally. There is no backend, no API call, no telemetry. The app can run fully offline after first load.

## Key features

- **Upload templates** — drop in a `.docx` containing placeholder fields.
- **Automatic field discovery** — the template is parsed and its dynamic fields are extracted.
- **Auto-generated form** — a form is built from the detected fields for the user to fill in.
- **Live preview** — a read-only render of the filled document updates as you type.
- **Export** — download the completed document as a real `.docx`, formatting intact.
- **Multiple templates** — uploaded templates are stored locally and persist across page refreshes. The user switches between them; originals are never overwritten.
- **Light & dark themes** — neutral, low-glare palettes tuned for long working sessions.

## Privacy & data handling

This is the core design constraint, not a feature:

- All processing happens in the browser. No document content or field data is transmitted anywhere.
- Templates are stored locally in **IndexedDB** and never uploaded.
- The app is built to run offline (PWA) after the initial load.
- A strict Content-Security-Policy (`connect-src 'none'`, or limited to the app's own origin) blocks any outbound network request at the browser level — including from transitive dependencies.

If you fork or modify this project, **preserve these guarantees** and re-verify them (see *Verifying the privacy guarantee* below).

## Tech stack

| Concern | Choice | Notes |
|---|---|---|
| Build tool | **Vite** | Fast dev loop; PWA via `vite-plugin-pwa` |
| Language | **TypeScript** | Field models as discriminated unions (scalar / loop / conditional) |
| UI framework | **React** | |
| Styling | **Tailwind CSS + daisyUI** | App chrome only — kept off the preview pane |
| Local storage | **Dexie.js** | IndexedDB wrapper; stores template Blobs directly |
| Template filling | **docx-templates** (MIT) | Fills placeholders, preserves formatting, fully client-side |
| Document preview | **docx-preview** (MIT) | Renders the filled `.docx` to the DOM |
| Export | **FileSaver.js** | Cross-browser download of the output Blob |

### A note on the docx library choice

`docx-templates` (MIT) is the default because it is permissively licensed, free including loops and image insertion, and has no paywalled modules — the right fit for a public, source-disclosed project handling sensitive data.

Alternatives, if your needs differ:
- **docxtemplater** — larger ecosystem and a built-in inspect module for field discovery, but its core uses a non-standard license and several modules are commercial. Verify current license terms before relying on any paid module.
- **easy-template-x** (MIT) — a lighter permissive alternative.

> **Not used:** full WYSIWYG editors like SuperDoc, OnlyOffice, or Collabora. This app is a *fill-the-fields* tool, not a freeform document editor — those are the wrong interaction model here.

## How it works

```
upload .docx template
        │
        ▼
parse template ──► extract dynamic fields ──► store template Blob (IndexedDB)
        │
        ▼
auto-generate form
        │
   user types  ──────────────┐
        │                     │ (debounced)
        ▼                     ▼
  docx-templates  ──►  filled .docx Blob (in memory)
                              │
                              ▼
                        docx-preview ──► live preview pane
                              │
                              ▼
                       export → download .docx
```

The preview loop is debounced (~300–500ms) so large documents stay responsive while typing.

## Getting started

### Prerequisites
- Node.js (LTS) and a package manager (npm / pnpm / yarn)

### Install & run

```bash
git clone <repo-url>
cd docfill
npm install
npm run dev
```

Open the printed local URL. To build for production:

```bash
npm run build
npm run preview
```

## Usage

1. Open the app and upload a `.docx` template containing placeholder fields.
2. The app detects the fields and generates a form.
3. Fill in the form — watch the preview update live on the right.
4. Click **Export .docx** to download the completed document.
5. Upload more templates and switch between them from the template list; each is saved locally.

### Authoring a template

Placeholders use the templating library's tag syntax. With `docx-templates`, fields are written into the Word document as tags (for example `{{fieldName}}`), including loops and conditional sections for repeating or optional content. Author and save the template in Word as a normal `.docx`, then upload it.

> **Tip:** Word can silently split a placeholder across internal text runs (spellcheck, formatting, revisions). The templating library handles this, but if a field isn't detected, retype the placeholder in one go to keep it in a single run.

## Implementation notes / gotchas

- **Isolate the preview from Tailwind.** Tailwind's Preflight reset will clobber the styles `docx-preview` produces. Render the preview inside a **Shadow DOM** boundary (or scope/disable Preflight for that subtree) so the document renders faithfully.
- **docx-preview lives outside React.** It paints into a raw DOM node — drive it via a `ref` and `useEffect`, not as JSX children.
- **Preview fidelity.** `docx-preview` is very close to Word but not pixel-identical. It's reliable for a fill-the-fields workflow; don't promise "exactly what prints."
- **Storage.** Use IndexedDB (via Dexie), not localStorage — Blobs are stored directly and there's no ~5MB string ceiling.
