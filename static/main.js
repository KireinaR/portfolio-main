/* ============================================================
   Ujaan Mukherjee — portfolio interactions
   Inertia scroll (Lenis), theme toggle, mobile nav, progress bar.
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle ---------- */
  var toggle = document.querySelector('.theme-toggle');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  }
  if (toggle) {
    applyTheme(root.getAttribute('data-theme') || 'light');
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

  /* ---------- Inertia scrolling (Lenis) ---------- */
  var lenis = null;
  if (!prefersReduced && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });

    var rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
  }

  /* ---------- Smooth in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = id === '#top' ? document.body : document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 72;
      if (lenis) {
        lenis.scrollTo(top, { duration: 1.2 });
      } else {
        window.scrollTo({ top: top, behavior: prefersReduced ? 'auto' : 'smooth' });
      }
      history.replaceState(null, '', id);
    });
  });

  /* ---------- Reading progress + sticky header state ---------- */
  var progress = document.querySelector('.progress');
  var progressBar = document.querySelector('.progress__bar');
  var header = document.querySelector('.site-header');
  var hero = document.getElementById('hero');
  var ticking = false;

  function updateProgress(scroll) {
    var y = typeof scroll === 'number' ? scroll : window.scrollY;
    var docH = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docH > 0 ? Math.min(1, Math.max(0, y / docH)) : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + ratio + ')';

    var heroBottom = hero ? hero.offsetTop + hero.offsetHeight - 80 : 400;
    var past = y > heroBottom;
    if (progress) progress.classList.toggle('is-visible', past);
    if (header) header.classList.toggle('is-stuck', y > 8);
  }

  if (lenis) {
    lenis.on('scroll', function (e) { updateProgress(e.scroll); });
  } else {
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { updateProgress(); ticking = false; });
      }
    }, { passive: true });
  }
  window.addEventListener('resize', function () { updateProgress(); });
  updateProgress();
})();
