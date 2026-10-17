/* =========================================================
   app.js — pornirea aplicației: navigare, temă, rutare
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  var main = null;

  function readCount() {
    return T.chapters.filter(function (c) { return T.store.get('read.' + c.id, false); }).length;
  }

  /* ---------- bara laterală ---------- */
  function renderNav(current) {
    var side = T.$('#side');
    var h = '<div class="nav-sec"><a class="nav-a" href="#/" ' + (current === 'home' ? 'aria-current="page"' : '') + '><span class="nav-ic">⌂</span>Acasă</a></div>';
    h += '<div class="nav-title">Lecții</div><div class="nav-sec">';
    T.chapters.forEach(function (c, i) {
      var done = T.store.get('read.' + c.id, false);
      h += '<a class="nav-a' + (done ? ' done' : '') + '" href="#/lectia/' + c.id + '" ' + (current === 'lectia/' + c.id ? 'aria-current="page"' : '') + '><span class="nav-n">' + (done ? '✓' : (i + 1)) + '</span><span>' + c.title + '</span></a>';
    });
    h += '</div><div class="nav-title">Exersează</div><div class="nav-sec">';
    h += '<a class="nav-a" href="#/probleme" ' + (current === 'probleme' ? 'aria-current="page"' : '') + '><span class="nav-ic">✎</span>Probleme și variații</a>';
    T.problemOrder.forEach(function (id) {
      var p = T.problems[id];
      h += '<a class="nav-a" style="padding-left:34px;font-size:.88rem" href="#/probleme/' + id + '" ' + (current === 'probleme/' + id ? 'aria-current="page"' : '') + '><span>' + p.short + '</span></a>';
    });
    h += '<a class="nav-a" href="#/cartonase" ' + (current === 'cartonase' ? 'aria-current="page"' : '') + '><span class="nav-ic">▤</span>Cartonașe</a>';
    h += '<a class="nav-a" href="#/test" ' + (current === 'test' ? 'aria-current="page"' : '') + '><span class="nav-ic">✔</span>Test</a>';
    h += '</div><div class="nav-title">Referință</div><div class="nav-sec">';
    h += '<a class="nav-a" href="#/formule" ' + (current === 'formule' ? 'aria-current="page"' : '') + '><span class="nav-ic">Σ</span>Formule și reguli</a></div>';
    side.innerHTML = h;
    updateTop();
  }

  function updateTop() {
    var n = readCount(), tot = T.chapters.length;
    var tp = T.$('#topProgress');
    if (!tp) return;
    T.$('.tp-bar i', tp).style.width = (tot ? 100 * n / tot : 0) + '%';
    T.$('.tp-n', tp).textContent = n + '/' + tot;
  }

  /* ---------- rutare ---------- */
  function route() {
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    var key = parts.join('/') || 'home';
    var page;
    try { page = T.pages.render(parts); }
    catch (err) {
      console.error(err);
      page = { title: 'Eroare', html: '<div class="page"><h1>Hopa!</h1><p>Pagina nu s-a putut afișa. Reîncarcă pagina sau întoarce-te <a href="#/">acasă</a>.</p></div>' };
    }
    main.innerHTML = T.rich(page.html);
    document.title = (page.title ? page.title + ' · ' : '') + 'Termochimie interactivă';
    renderNav(page.nav || key);
    T.mountAll(main);
    if (page.after) { try { page.after(main); } catch (e) { console.error(e); } }
    window.scrollTo(0, 0);
    closeMenu();
  }

  /* ---------- meniu mobil ---------- */
  function closeMenu() {
    T.$('#side').classList.remove('open');
    T.$('#scrim').classList.remove('show');
    T.$('#menuBtn').setAttribute('aria-expanded', 'false');
  }
  function toggleMenu() {
    var open = T.$('#side').classList.toggle('open');
    T.$('#scrim').classList.toggle('show', open);
    T.$('#menuBtn').setAttribute('aria-expanded', String(open));
  }

  /* ---------- temă ---------- */
  function currentTheme() {
    var a = document.documentElement.getAttribute('data-theme');
    if (a) return a;
    return g.matchMedia && g.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    var next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('termochimie.theme', next); } catch (e) { /* ignorat */ }
  }

  /* ---------- pornire ---------- */
  function start() {
    main = T.$('#main');
    T.initMini(main);
    T.$('#menuBtn').addEventListener('click', toggleMenu);
    T.$('#scrim').addEventListener('click', closeMenu);
    T.$('#themeBtn').addEventListener('click', toggleTheme);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    main.addEventListener('click', function (e) {
      var j = e.target.closest('[data-jump]');
      if (j) {
        e.preventDefault();
        var t = document.getElementById(j.dataset.jump);
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    T.bus.on('store', function (p) { if (/^read\./.test(p) || p === '*') { renderNavKeep(); } });
    g.addEventListener('hashchange', route);
    route();
  }
  function renderNavKeep() {
    var cur = T.$('.side [aria-current="page"]');
    var keep = null;
    var parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    keep = parts.join('/') || 'home';
    renderNav(keep);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})(window);
