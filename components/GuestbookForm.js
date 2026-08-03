'use client';

import { useEffect, useRef, useState } from 'react';

const MAX_LENGTH = 200;

function formatCountdown(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export default function GuestbookForm({ initialRemainingMs }) {
  const [message, setMessage] = useState('');
  const [remainingMs, setRemainingMs] = useState(initialRemainingMs);
  const [status, setStatus] = useState('idle'); // idle | submitting | submitted | error
  const [errorMsg, setErrorMsg] = useState('');
  const tickRef = useRef(null);

  useEffect(() => {
    if (remainingMs <= 0) return undefined;
    tickRef.current = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(tickRef.current);
  }, [remainingMs > 0]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || remainingMs > 0 || status === 'submitting') return;

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 429) {
        setStatus('error');
        setErrorMsg(data.error || 'You can only post once every 10 minutes.');
        setRemainingMs(data.retryAfterMs || 0);
        return;
      }
      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Try again.');
        return;
      }

      setMessage('');
      setStatus('submitted');
      setRemainingMs(10 * 60 * 1000);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Try again.');
    }
  }

  const disabled = remainingMs > 0 || status === 'submitting' || !message.trim();

  return (
    <form className="guestbook-form" onSubmit={handleSubmit}>
      <label className="guestbook-form__label" htmlFor="guestbook-message">
        Leave a note
      </label>
      <textarea
        id="guestbook-message"
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, MAX_LENGTH))}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="Say hello..."
        disabled={status === 'submitting'}
      />
      <div className="guestbook-form__row">
        <span className="guestbook-form__count">
          {message.length}/{MAX_LENGTH}
        </span>
        <button type="submit" className="guestbook-form__submit" disabled={disabled}>
          {status === 'submitting' ? 'Posting...' : 'Post'}
        </button>
      </div>

      {remainingMs > 0 && (
        <p className="guestbook-form__note">
          You can post again in {formatCountdown(remainingMs)}.
        </p>
      )}
      {status === 'submitted' && (
        <p className="guestbook-form__note guestbook-form__note--ok">
          Thanks. Your note is awaiting approval before it appears above.
        </p>
      )}
      {status === 'error' && errorMsg && remainingMs <= 0 && (
        <p className="guestbook-form__note guestbook-form__note--error">{errorMsg}</p>
      )}
    </form>
  );
}
