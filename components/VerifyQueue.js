'use client';

import { useState } from 'react';

export default function VerifyQueue({ initialEntries }) {
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);

  async function decide(id, decision) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/verify/${id}/decide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    await fetch('/api/verify/login', { method: 'DELETE' });
    window.location.reload();
  }

  return (
    <div className="verify-queue-wrap">
      <div className="verify-queue__header">
        <p>{entries.length} waiting for review</p>
        <button type="button" className="verify-queue__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="verify-queue__empty">Nothing waiting for review.</p>
      ) : (
        <ul className="verify-queue">
          {entries.map((entry) => (
            <li className="verify-queue__item" key={entry.id}>
              <div className="verify-queue__who">
                {entry.image ? (
                  <img
                    className="verify-queue__avatar"
                    src={entry.image}
                    alt=""
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <div>
                  <p className="verify-queue__name">{entry.name}</p>
                  <p className="verify-queue__meta">
                    via {entry.provider} &middot; {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="verify-queue__message">{entry.message}</p>
              <div className="verify-queue__actions">
                <button
                  type="button"
                  disabled={busyId === entry.id}
                  onClick={() => decide(entry.id, 'approve')}
                >
                  Approve
                </button>
                <button
                  type="button"
                  disabled={busyId === entry.id}
                  onClick={() => decide(entry.id, 'reject')}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
