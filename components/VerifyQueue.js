'use client';

import { useState } from 'react';

const STATUS_LABEL = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

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
        const status = decision === 'approve' ? 'approved' : 'rejected';
        setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, status } : entry)));
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this note permanently? This cannot be undone.')) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/verify/${id}`, { method: 'DELETE' });
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
        <p>{entries.length} total</p>
        <button type="button" className="verify-queue__logout" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {entries.length === 0 ? (
        <p className="verify-queue__empty">No notes yet.</p>
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
                  <p className="verify-queue__name">
                    {entry.name}
                    {entry.username ? ` (${entry.username})` : ''}
                  </p>
                  <p className="verify-queue__meta">
                    via {entry.provider} &middot; {new Date(entry.createdAt).toLocaleString()}
                    {' '}&middot;{' '}
                    <span className="verify-queue__status">{STATUS_LABEL[entry.status]}</span>
                  </p>
                </div>
              </div>
              <p className="verify-queue__message">{entry.message}</p>
              <div className="verify-queue__actions">
                {entry.status === 'pending' && (
                  <>
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
                  </>
                )}
                <button
                  type="button"
                  disabled={busyId === entry.id}
                  onClick={() => remove(entry.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
