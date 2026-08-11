'use client';

import { useEffect, useRef, useState } from 'react';

// Async clipboard first, then the legacy execCommand path (still works where
// the clipboard API is blocked, e.g. an embedded iframe) — if both fail the
// button just falls back to showing the address so it can be copied by hand.
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* keep going */
  }
  try {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    return copied;
  } catch {
    return false;
  }
}

export default function CopyEmailButton({ email }) {
  const [state, setState] = useState('idle'); // idle | copied | manual
  const timeoutRef = useRef(undefined);

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  async function handleClick() {
    const copied = await copyText(email);
    setState(copied ? 'copied' : 'manual');
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setState('idle'), copied ? 2500 : 6000);
  }

  return (
    <button type="button" className="contact-card__button" onClick={handleClick}>
      {state === 'idle' && 'Copy email'}
      {state === 'copied' && 'Copied!'}
      {state === 'manual' && `Copy failed — ${email}`}
    </button>
  );
}
