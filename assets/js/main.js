/* Agentific — site interactions */
(function () {
  'use strict';

  // ---- Sticky nav state ----
  var nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile menu ----
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { mobileMenu.classList.add('hidden'); });
    });
  }

  // ---- Scroll reveal ----
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---- Animated counters ----
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var val = (target * (0.2 + 0.8 * p)) * p; // ease
      var eased = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (Number.isInteger(target) ? Math.round(eased) : eased.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (Number.isInteger(target) ? target : target.toFixed(1)) + suffix;
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  // ---- Lead form ----
  var form = document.getElementById('lead-form');

  function setStatus(status, msg, cls) {
    if (status) { status.textContent = msg; status.className = 'mt-4 text-sm ' + cls; }
  }

  // Supabase config (from assets/js/config.js)
  var SB = (window.AGENTIFIC_CONFIG || {});
  var supabaseReady = SB.SUPABASE_URL && SB.SUPABASE_ANON_KEY && window.supabase;

  function saveToSupabase(data) {
    var client = window.supabase.createClient(SB.SUPABASE_URL, SB.SUPABASE_ANON_KEY);
    return client.from('leads').insert([{
      name: data.get('name') || '',
      email: data.get('email') || '',
      organisation: data.get('organisation') || '',
      interest: data.get('interest') || '',
      message: data.get('message') || '',
      source: 'website',
      user_agent: navigator.userAgent,
      page: window.location.pathname
    }]);
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      var status = document.getElementById('form-status');
      var endpoint = form.getAttribute('action') || '';
      var data = new FormData(form);

      // PREFERRED: save the lead into your Supabase database.
      if (supabaseReady) {
        ev.preventDefault();
        setStatus(status, 'Sending…', 'text-slate-300');
        saveToSupabase(data).then(function (res) {
          if (res && res.error) {
            setStatus(status, 'Something went wrong. Please email amit.gulati@gmail.com', 'text-rose-400');
          } else {
            form.reset();
            setStatus(status, "Thank you — we'll be in touch within 1 business day.", 'text-emerald-400');
          }
        }).catch(function () {
          setStatus(status, 'Network error. Please email amit.gulati@gmail.com', 'text-rose-400');
        });
        return;
      }

      // FALLBACK A: no Supabase yet → open email client so no lead is lost.
      if (endpoint.indexOf('FORMSPREE_ID') !== -1 || endpoint === '' || endpoint === '#') {
        ev.preventDefault();
        var subject = encodeURIComponent('New enquiry — Agentific website');
        var body = encodeURIComponent(
          'Name: ' + (data.get('name') || '') + '\n' +
          'Email: ' + (data.get('email') || '') + '\n' +
          'Organisation: ' + (data.get('organisation') || '') + '\n' +
          'Interest: ' + (data.get('interest') || '') + '\n\n' +
          'Message:\n' + (data.get('message') || '')
        );
        window.location.href = 'mailto:amit.gulati@gmail.com?subject=' + subject + '&body=' + body;
        if (status) {
          status.textContent = 'Opening your email app… or write to us directly at amit.gulati@gmail.com';
          status.className = 'mt-4 text-sm text-cyan-300';
        }
        return;
      }

      // Real Formspree/AJAX submit
      ev.preventDefault();
      if (status) { status.textContent = 'Sending…'; status.className = 'mt-4 text-sm text-slate-300'; }
      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (r.ok) {
          form.reset();
          if (status) { status.textContent = "Thank you — we'll be in touch within 1 business day."; status.className = 'mt-4 text-sm text-emerald-400'; }
        } else {
          if (status) { status.textContent = 'Something went wrong. Please email amit.gulati@gmail.com'; status.className = 'mt-4 text-sm text-rose-400'; }
        }
      }).catch(function () {
        if (status) { status.textContent = 'Network error. Please email amit.gulati@gmail.com'; status.className = 'mt-4 text-sm text-rose-400'; }
      });
    });
  }

  // ---- Footer year ----
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
