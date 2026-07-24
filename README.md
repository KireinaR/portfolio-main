# Ujaan Mukherjee — The Wanderer's Dispatch

A minimal, newspaper-set portfolio. The pages are hand-written vanilla HTML/CSS/JS
(no build step); a **Hugo**-powered blog ("Dispatches") is bolted on for
Markdown posts. Baskerville (via Libre Baskerville), light (bone) / dark (true
black) themes, newspaper columns, and Lenis inertia scrolling.

## Layout
```
hugo.toml                 # Hugo config
content/dispatches/       # blog posts (Markdown)  ->  /dispatches/<slug>/
  _index.md               # the /dispatches/ section page
  *.md                    # one file per post
archetypes/default.md     # front-matter template for `hugo new`
layouts/                  # Hugo templates for the blog only
  _default/{baseof,list,single}.html
  partials/{head,header,footer}.html
static/                   # the hand-built site, served at /
  index.html about.html work.html contact.html
  styles.css main.js lenis.min.js ascii.woff2 favicon.svg iem.png dbl.png
public/                   # build output (generated; git-ignore it)
```
Files in `static/` are published verbatim at the site root. The homepage and the
four portfolio pages are plain HTML there; Hugo only generates the blog. The
blog templates reuse `static/styles.css`, so posts match the site's typesetting.

## The Wanderer (homepage)
*Wanderer above the Sea of Fog* on the home page is **real, selectable ASCII
text** — colored `<span>`s in the `ascii.woff2` export font (from `asciiw.html`),
on a black plate to mimic the original `wanderer.png`. Not an image.

## Writing a post
```bash
hugo new content/dispatches/my-post.md   # scaffolds front matter (draft = true)
```
Front matter fields: `title`, `date`, `draft`, `description`, `tags = [...]`.
Set `draft = false` (or use `hugo server -D` to preview drafts). Reading time and
tag pages (`/tags/<tag>/`) are automatic; RSS is at `/dispatches/index.xml`.
Note: posts dated in the future are hidden until their date.

## Preview locally
Requires [Hugo](https://gohugo.io) (extended). Installed here via
`winget install Hugo.Hugo.Extended` — if `hugo` isn't found, open a new terminal
so PATH refreshes.
```bash
hugo server -D
```
Then open <http://localhost:1313/>.

## Build
```bash
hugo --gc --minify        # outputs to ./public
```

## Deploy to Vercel
Structure is Vercel's Hugo preset out of the box. Import the repo at
[vercel.com/new](https://vercel.com/new), set **Framework = Hugo**, add a
`HUGO_VERSION` env var (currently `0.164.0`), build `hugo --gc --minify`, output
`public/`. (Deployment not yet wired up.)

## Notes
- Theme respects `prefers-color-scheme` on first visit, then remembers your choice.
- Inertia scroll and reveals are disabled under `prefers-reduced-motion`.
- Root-level scratch files (`wanderer*.*`, `asciiw.html`, `ascii_convert.py`) are
  not published — only `static/` and `content/` are.
