'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.15;
const DEFAULT_SCALE = 1.25;

function clampScale(scale) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export default function PdfViewer({ src, fileName }) {
  const pagesElRef = useRef(null);
  const pdfDocRef = useRef(null);
  const pdfjsRef = useRef(null);
  const pageEntriesRef = useRef([]); // { pageEl, canvas, textLayerDiv, textDivs, itemStrings }
  const scaleRef = useRef(DEFAULT_SCALE);
  const queryRef = useRef('');
  const matchesRef = useRef([]); // { pageIndex, divIndex, start, length }
  const currentMatchRef = useRef(-1);
  const renderTokenRef = useRef(0);

  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [query, setQuery] = useState('');
  const [matchInfo, setMatchInfo] = useState({ total: 0, current: 0 });

  const clearHighlights = useCallback(() => {
    for (const entry of pageEntriesRef.current) {
      entry.textDivs.forEach((div, i) => {
        div.textContent = entry.itemStrings[i];
      });
    }
  }, []);

  const applyHighlights = useCallback(() => {
    clearHighlights();
    const matches = matchesRef.current;
    const current = currentMatchRef.current;

    // Group matches per (pageIndex, divIndex) so a div with several hits
    // only gets rebuilt once.
    const byDiv = new Map();
    matches.forEach((m, matchIdx) => {
      const key = `${m.pageIndex}:${m.divIndex}`;
      if (!byDiv.has(key)) byDiv.set(key, []);
      byDiv.get(key).push({ ...m, matchIdx });
    });

    for (const [key, hits] of byDiv) {
      const [pageIndex, divIndex] = key.split(':').map(Number);
      const entry = pageEntriesRef.current[pageIndex];
      if (!entry) continue;
      const div = entry.textDivs[divIndex];
      const text = entry.itemStrings[divIndex];
      if (!div) continue;

      hits.sort((a, b) => a.start - b.start);
      div.textContent = '';
      let cursor = 0;
      for (const hit of hits) {
        if (hit.start > cursor) {
          div.appendChild(document.createTextNode(text.slice(cursor, hit.start)));
        }
        const span = document.createElement('span');
        span.className = hit.matchIdx === current ? 'pdfv-hit pdfv-hit--current' : 'pdfv-hit';
        span.textContent = text.slice(hit.start, hit.start + hit.length);
        div.appendChild(span);
        cursor = hit.start + hit.length;
      }
      if (cursor < text.length) {
        div.appendChild(document.createTextNode(text.slice(cursor)));
      }
    }
  }, [clearHighlights]);

  const scrollToCurrentMatch = useCallback(() => {
    const idx = currentMatchRef.current;
    const match = matchesRef.current[idx];
    if (!match) return;
    const entry = pageEntriesRef.current[match.pageIndex];
    const div = entry?.textDivs[match.divIndex];
    div?.scrollIntoView({ block: 'center' });
  }, []);

  const recomputeMatches = useCallback((rawQuery) => {
    const q = rawQuery.trim().toLowerCase();
    const matches = [];
    if (q) {
      pageEntriesRef.current.forEach((entry, pageIndex) => {
        entry.itemStrings.forEach((str, divIndex) => {
          const lower = str.toLowerCase();
          let from = 0;
          for (;;) {
            const at = lower.indexOf(q, from);
            if (at === -1) break;
            matches.push({ pageIndex, divIndex, start: at, length: q.length });
            from = at + q.length;
          }
        });
      });
    }
    matchesRef.current = matches;
    currentMatchRef.current = matches.length ? 0 : -1;
    setMatchInfo({ total: matches.length, current: matches.length ? 1 : 0 });
    applyHighlights();
    scrollToCurrentMatch();
  }, [applyHighlights, scrollToCurrentMatch]);

  const goToMatch = useCallback((delta) => {
    const total = matchesRef.current.length;
    if (!total) return;
    currentMatchRef.current = (currentMatchRef.current + delta + total) % total;
    setMatchInfo({ total, current: currentMatchRef.current + 1 });
    applyHighlights();
    scrollToCurrentMatch();
  }, [applyHighlights, scrollToCurrentMatch]);

  const renderAllPages = useCallback(async (targetScale) => {
    const pdfjsLib = pdfjsRef.current;
    const pdfDoc = pdfDocRef.current;
    const container = pagesElRef.current;
    if (!pdfjsLib || !pdfDoc || !container) return;

    const token = ++renderTokenRef.current;
    container.innerHTML = '';
    pageEntriesRef.current = [];

    const outputScale = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;

    for (let num = 1; num <= pdfDoc.numPages; num++) {
      if (token !== renderTokenRef.current) return;
      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: targetScale });

      const pageEl = document.createElement('div');
      pageEl.className = 'pdf-viewer__page';
      pageEl.style.setProperty('--scale-factor', String(targetScale));
      pageEl.style.width = `${viewport.width}px`;
      pageEl.style.height = `${viewport.height}px`;

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(outputScale, outputScale);
      pageEl.appendChild(canvas);

      const textLayerDiv = document.createElement('div');
      textLayerDiv.className = 'textLayer';
      pageEl.appendChild(textLayerDiv);

      container.appendChild(pageEl);

      await page.render({ canvasContext: ctx, viewport }).promise;
      if (token !== renderTokenRef.current) return;

      const textContent = await page.getTextContent();
      const textLayer = new pdfjsLib.TextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
      });
      await textLayer.render();
      if (token !== renderTokenRef.current) return;

      pageEntriesRef.current.push({
        pageEl,
        canvas,
        textLayerDiv,
        textDivs: textLayer.textDivs,
        itemStrings: textLayer.textContentItemsStr,
      });
    }

    if (queryRef.current) recomputeMatches(queryRef.current);
  }, [recomputeMatches]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const pdfjsLib = await import('pdfjs-dist/build/pdf.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        pdfjsRef.current = pdfjsLib;

        const pdfDoc = await pdfjsLib.getDocument(src).promise;
        if (cancelled) return;
        pdfDocRef.current = pdfDoc;
        setStatus('ready');
        await renderAllPages(scaleRef.current);
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to load PDF', err);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
      pdfDocRef.current?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const changeScale = useCallback((delta) => {
    const next = clampScale(Math.round((scaleRef.current + delta) * 100) / 100);
    if (next === scaleRef.current) return;
    scaleRef.current = next;
    setScale(next);
    if (status === 'ready') renderAllPages(next);
  }, [renderAllPages, status]);

  function handleSearchChange(e) {
    const value = e.target.value;
    setQuery(value);
    queryRef.current = value;
    recomputeMatches(value);
  }

  function handleSearchKeyDown(e) {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    goToMatch(e.shiftKey ? -1 : 1);
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer__toolbar">
        <div className="pdf-viewer__group">
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={() => changeScale(-SCALE_STEP)}
            disabled={status !== 'ready' || scale <= MIN_SCALE}
            aria-label="Zoom out"
          >
            &minus;
          </button>
          <span className="pdf-viewer__zoom-level">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={() => changeScale(SCALE_STEP)}
            disabled={status !== 'ready' || scale >= MAX_SCALE}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>

        <div className="pdf-viewer__search">
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search"
            aria-label="Search the document"
            disabled={status !== 'ready'}
          />
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={() => goToMatch(-1)}
            disabled={!matchInfo.total}
            aria-label="Previous match"
          >
            Prev
          </button>
          <button
            type="button"
            className="pdf-viewer__button"
            onClick={() => goToMatch(1)}
            disabled={!matchInfo.total}
            aria-label="Next match"
          >
            Next
          </button>
          <span className="pdf-viewer__match-count">
            {query ? `${matchInfo.current} / ${matchInfo.total}` : ''}
          </span>
        </div>

        <a className="pdf-viewer__button pdf-viewer__download" href={src} download={fileName}>
          Download
        </a>
      </div>

      <div className="pdf-viewer__pages">
        {status === 'loading' && <p className="pdf-viewer__message">Loading&hellip;</p>}
        {status === 'error' && (
          <p className="pdf-viewer__message">
            This document couldn&#39;t be displayed. <a href={src}>Download it</a> instead.
          </p>
        )}
        {/* Never given React children in JSX - everything inside is rendered imperatively by pdf.js. */}
        <div className="pdf-viewer__pages-inner" ref={pagesElRef} />
      </div>
    </div>
  );
}
