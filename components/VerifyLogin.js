'use client';

import { useState } from 'react';

export default function VerifyLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/verify/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Incorrect password.');
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError('Something went wrong. Try again.');
      setBusy(false);
    }
  }

  return (
    <form className="verify-login" onSubmit={handleSubmit}>
      <label className="verify-login__label" htmlFor="verify-password">
        Password
      </label>
      <input
        id="verify-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        disabled={busy}
      />
      <button type="submit" disabled={busy || !password}>
        {busy ? 'Checking...' : 'Enter'}
      </button>
      {error && <p className="verify-login__error">{error}</p>}
    </form>
  );
}
