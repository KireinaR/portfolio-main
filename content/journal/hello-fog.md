+++
title = "Notes on Starting a Journal"
date = 2026-07-15T10:00:00+05:30
draft = false
description = "Why this blog exists, and how it is put together."
tags = ["writing", "meta"]
+++

Every so often something is worth writing down: a bug that taught me
something, a paper that reframed a problem, a small tool that turned out to be
more useful than it had any right to be. This is where those go.

## Why a blog

The portfolio pages are a snapshot: who I am and what I have made. A journal
entry is the opposite: a timestamp. It records *thinking*, not conclusions, and
it is allowed to be provisional.

> To build is to stand at the edge of the known and lean out into the fog.

## How it is built

The site itself is hand-written HTML, CSS and JavaScript with no build step.
This section, though, runs on **Hugo**: posts are plain Markdown files, and Hugo
turns them into pages that borrow the same typesetting as the rest of the site:
Baskerville, the newspaper column, the light and dark themes.

A few things I wanted from day one:

- **Markdown in, HTML out.** No fighting a CMS.
- **The same look as the portfolio.** One stylesheet, shared.
- **An RSS feed**, so the three people who still use a reader can subscribe.

```python
def entry(thought: str) -> None:
    """The whole workflow, more or less."""
    write(thought)
    commit()
    deploy()
```

That is the entire idea. More soon.
