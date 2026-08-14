'use client';

import { useMemo, useState } from 'react';

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 200;

function counterText(length) {
  if (length < MESSAGE_MIN) {
    return `${length.toLocaleString()} typed, needs at least ${MESSAGE_MIN}`;
  }
  if (length <= MESSAGE_MAX) {
    return `${length.toLocaleString()} of ${MESSAGE_MAX}`;
  }
  return `${length.toLocaleString()} typed, ${MESSAGE_MAX} maximum`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [company, setCompany] = useState(''); // honeypot, real visitors never fill this
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');

  const messageLength = message.length;
  const messageValid = messageLength >= MESSAGE_MIN && messageLength <= MESSAGE_MAX;
  const nameValid = fullName.trim().length > 0 && fullName.trim().length <= 100;
  const emailValid = EMAIL_RE.test(email.trim());
  const subjectValid = subject.trim().length > 0 && subject.trim().length <= 120;
  const canSubmit = nameValid && emailValid && subjectValid && messageValid && status !== 'sending';

  const counter = useMemo(() => counterText(messageLength), [messageLength]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          company,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('sent');
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  }

  if (status === 'sent') {
    return (
      <div className="contact-form">
        <p className="contact-form__kicker">Send a message</p>
        <p className="contact-form__status contact-form__status--sent">
          Thanks, your message is on its way. I&rsquo;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <p className="contact-form__kicker">Send a message</p>

      <div className="contact-form__grid">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contact-name">Full name</label>
          <input
            id="contact-name"
            className="contact-form__input"
            type="text"
            maxLength={100}
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor="contact-email">Your email</label>
          <input
            id="contact-email"
            className="contact-form__input"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="contact-form__field contact-form__field--full">
          <label className="contact-form__label" htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            className="contact-form__input"
            type="text"
            maxLength={120}
            autoComplete="off"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="contact-form__field contact-form__field--full">
          <label className="contact-form__label" htmlFor="contact-message">Message</label>
          <div className="contact-form__textarea-wrap">
            <textarea
              id="contact-message"
              className="contact-form__textarea"
              autoComplete="off"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <span className={`contact-form__counter${messageValid ? '' : ' contact-form__counter--invalid'}`}>
              {counter}
            </span>
          </div>
        </div>

        {/* Honeypot, hidden from real visitors, catches simple bots */}
        <div className="contact-form__honeypot" aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input
            id="contact-company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      <div className="contact-form__actions">
        <button type="submit" className="contact-form__submit" disabled={!canSubmit}>
          {status === 'sending' ? 'Sending...' : (
            <>Send message <span aria-hidden="true">&rarr;</span></>
          )}
        </button>
        {status === 'error' && <p className="contact-form__status contact-form__status--error">{error}</p>}
      </div>
    </form>
  );
}
