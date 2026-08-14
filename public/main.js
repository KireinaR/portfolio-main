/* ============================================================
   Ujaan Mukherjee - portfolio interactions
   Theme toggle, mobile nav, journal entries fetch.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- Theme toggle ----------
     The server picks the initial theme from the `theme` cookie (default
     dark), so there's no client-side flash to fix here - this just handles
     the click and keeps the cookie in sync for the next navigation/reload. */
  var toggle = document.querySelector('.theme-toggle');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    document.cookie = 'theme=' + theme + '; path=/; max-age=31536000; SameSite=Lax';
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  if (toggle) {
    toggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ---------- Current year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Dateline ---------- */
  var dateEls = document.querySelectorAll('.js-date');
  if (dateEls.length) {
    var now = new Date();
    var formatted;
    try {
      formatted = now.toLocaleDateString('en-GB', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch (e) {
      formatted = now.toDateString();
    }
    dateEls.forEach(function (el) { el.textContent = formatted; });
  }

  /* ---------- Journal Entries (home page) ---------- */
  var journalList = document.getElementById('journal-entries');
  if (journalList) {
    var escapeHtml = function (s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    };
    fetch('/journal/index.json', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res); })
      .then(function (posts) {
        if (!posts || !posts.length) return;
        var html = posts.slice(0, 5).map(function (p, i) {
          var num = String(i + 1).padStart(2, '0');
          return '<li><a href="' + p.url + '">' +
            '<span class="num">' + num + '</span>' +
            '<span class="name">' + escapeHtml(p.title) + '</span>' +
            '<span class="desc">' + escapeHtml(p.date) + '</span>' +
            '</a></li>';
        }).join('');
        journalList.innerHTML = html;
      })
      .catch(function () { /* keep the static fallback link */ });
  }

  /* ---------- Mobile nav toggle (hamburger) ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.classList.remove('is-active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- In-page anchors (instant jump, offset for sticky header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = id === '#top' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: top });
      history.replaceState(null, '', id);
    });
  });
})();
