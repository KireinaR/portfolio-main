# Ujaan Mukherjee — The Wanderer's Dispatch

A minimal, newspaper-set portfolio, built as a Next.js app (App Router). Baskerville
(via Libre Baskerville), light (bone) / dark (true black) themes, newspaper columns.
The Journal (blog) is Markdown, rendered at build time — no CMS, no database.

## Layout
```
app/                      # routes
  layout.js               # shared <head>, theme-flash script, fonts
  page.js                 # home
  about/page.js
  work/page.js
  resume/page.js
  journal/
    page.js               # /journal   (post list)
    [slug]/page.js         # /journal/<slug>
    index.xml/route.js     # /journal/index.xml   (RSS)
    index.json/route.js    # /journal/index.json  (feed the homepage fetches)
  tags/
    page.js                # /tags        (topic cloud)
    [tag]/page.js           # /tags/<tag>
components/                # Header, Footer, PdfViewer (shared React components)
lib/
  posts.js                 # reads journal/, frontmatter, tags, reading time
  markdown.js               # markdown -> HTML (remark/rehype), image captions
  dates.js                 # date formatting helpers
  ascii-wanderer-fragment.html  # the homepage's ASCII-art render, extracted verbatim
journal/                   # blog posts live here — see "Writing a post" below
  <slug>/index.md          # one folder per post; drop that post's images here too
public/                    # static assets served at the site root (images, resume.pdf, main.js)
scripts/
  copy-journal-assets.mjs  # copies images from journal/ into public/journal/ before dev/build
  copy-pdfjs-worker.mjs    # copies the pdf.js worker into public/ before dev/build
```

## The Wanderer (homepage)
*Wanderer above the Sea of Fog* on the home page is **real, selectable ASCII
text** — colored `<span>`s in the `ascii.woff2` export font, on a black plate to
mimic the original painting. Not an image. The markup lives in
`lib/ascii-wanderer-fragment.html` and is inlined into the homepage at build time.

## Writing a post
Each entry is a folder under `journal/` holding an `index.md` plus any images
that entry uses:

```bash
mkdir journal/my-post
```

`journal/my-post/index.md`:
```markdown
---
title: "My Post Title"
date: "2026-08-03T10:00:00+05:30"
draft: false
description: "One-line summary shown in the journal list and RSS."
tags: ["AI", "Hardware"]
---

Write your post here, in Markdown.
```

Add images into that same `journal/my-post/` folder. Reference them with an
**absolute path** rooted at the post's own URL (not a bare relative filename):

```markdown
![Alt text](/journal/my-post/photo.jpg)
```

Images with alt text are automatically wrapped in a captioned `<figure>` (the
alt text becomes the caption). The `journal/` folder is copied into
`public/journal/` by `scripts/copy-journal-assets.mjs`, which runs automatically
before `npm run dev` and `npm run build` — restart the dev server after adding a
new image so it picks up the copy.

Set `draft: false` to publish (draft posts are excluded from the build). Reading
time and tag pages (`/tags/<tag>/`) are computed automatically; RSS is at
`/journal/index.xml`, and the homepage's "Journal Entries" list is driven by
`/journal/index.json` so it never goes stale.

## Résumé viewer
The About and Resume pages render `resume.pdf` with a custom PDF.js viewer
(`components/PdfViewer.js`) instead of the browser's native PDF plugin, so the
toolbar matches the site's theme. It supports zoom in/out, keyword search
(with match highlighting and next/previous navigation), and download —
nothing else from pdf.js's default chrome. The pdf.js worker file is copied
into `public/pdf.worker.min.mjs` by `scripts/copy-pdfjs-worker.mjs`.

## Preview locally
```bash
npm install
npm run dev
```
Then open <http://localhost:3000/>.

## Build
```bash
npm run build
```

## Deploy to Vercel
This is a standard Next.js app — Vercel detects the framework automatically with
zero configuration. Two ways to deploy manually:
- **CLI**: run `vercel` (preview) or `vercel --prod` (production) from the
  project root. Requires the [Vercel CLI](https://vercel.com/docs/cli)
  (`npm i -g vercel`) and being logged in (`vercel login`).
- **Git-connected**: push this repo to GitHub/GitLab/Bitbucket and import it at
  [vercel.com/new](https://vercel.com/new).

`.vercelignore` keeps the scratch/source files (`wanderer*.*`, `asciiw.html`,
`ascii_convert.py`) out of the deployment upload.

## Notes
- Theme respects `prefers-color-scheme` on first visit, then remembers your choice.
- Smooth/inertia scrolling has been removed site-wide; in-page anchor jumps are instant.
- Root-level scratch files (`wanderer*.*`, `asciiw.html`, `ascii_convert.py`) are
  leftover source assets from designing the ASCII art and are not part of the app.
