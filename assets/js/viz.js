/* =========================================================
   viz.js — trusa de ilustrații: obiecte desenate în SVG
   (pahar, termometru, flacără, gheață, atomi, săgeți de căldură …)
   Toate funcțiile întorc text SVG; culorile vin din variabilele CSS.
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz = {};
  var seq = 0;

  V.uid = function (p) { return (p || 'v') + (++seq); };
  V.reduced = function () { try { return g.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
  function f(n) { return +(+n).toFixed(1); }
  V.f = f;
  function mix(c, p, base) { return 'color-mix(in srgb, ' + c + ' ' + p + '%, ' + (base || 'var(--paper)') + ')'; }
  V.mix = mix;
  // temperatură (0..100 °C) → culoare între albastru și portocaliu
  V.tempColor = function (t, lo, hi) {
    lo = lo == null ? 0 : lo; hi = hi == null ? 100 : hi;
    var q = T.clamp((t - lo) / (hi - lo), 0, 1);
    if (q < .38) return 'var(--endo)';
    return 'color-mix(in srgb, var(--exo) ' + Math.round((q - .38) / .62 * 100) + '%, #f0a020)';
  };

  function lg(id, x1, y1, x2, y2, stops) {
    return '<linearGradient id="' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" style="stop-color:' + s[1] + (s[2] != null ? ';stop-opacity:' + s[2] : '') + '"/>'; }).join('') + '</linearGradient>';
  }
  function rg(id, stops) {
    return '<radialGradient id="' + id + '" cx=".5" cy=".5" r=".5">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" style="stop-color:' + s[1] + ';stop-opacity:' + s[2] + '"/>'; }).join('') + '</radialGradient>';
  }

  /* ---------- definiții (gradiente, filtre) ---------- */
  V.defs = function (p) {
    var s = '<defs>';
    s += lg(p + '-glass', 0, 0, 1, 0, [[0, 'var(--il-hi)'], [.28, 'var(--il-hi2)'], [.78, 'var(--il-hi2)'], [1, 'var(--il-hi)']]);
    [['w', 'var(--endo)', 30, 56], ['exo', 'var(--exo)', 38, 66], ['endo', 'var(--endo)', 42, 68], ['sol', 'var(--ok)', 26, 44], ['gas', 'var(--endo)', 14, 28]].forEach(function (L) {
      s += lg(p + '-liq-' + L[0], 0, 0, 0, 1, [[0, mix(L[1], L[2])], [1, mix(L[1], L[3])]]);
    });
    s += lg(p + '-fo', 0, 0, 0, 1, [[0, '#ff9a2a'], [1, '#ff3d14']]);
    s += lg(p + '-fm', 0, 0, 0, 1, [[0, '#ffcf45'], [1, '#ff8f1f']]);
    s += lg(p + '-fi', 0, 0, 0, 1, [[0, '#fff6c4'], [1, '#ffd24a']]);
    s += lg(p + '-ice', 0, 0, 1, 1, [[0, '#f4fbff'], [1, '#a4d4fb']]);
    s += lg(p + '-metal', 0, 0, 1, 0, [[0, 'var(--il-metal-a)'], [.5, 'var(--il-metal-b)'], [1, 'var(--il-metal-a)']]);
    s += lg(p + '-gold', 0, 0, 1, 1, [[0, 'var(--il-gold-hi)'], [1, 'var(--il-gold)']]);
    s += rg(p + '-gx', [[0, 'var(--exo)', .42], [1, 'var(--exo)', 0]]);
    s += rg(p + '-gn', [[0, 'var(--endo)', .38], [1, 'var(--endo)', 0]]);
    s += '<filter id="' + p + '-sh" x="-20%" y="-20%" width="140%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#1c2640" flood-opacity=".18"/></filter>';
    s += '<pattern id="' + p + '-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="var(--grid)" stroke-width="1.2"/></pattern>';
    return s + '</defs>';
  };

  // atomi: gradient radial pentru fiecare culoare
  var ATOM = { H: '#e8eef8', O: '#e5484d', C: '#4b5568', N: '#3b82f6', Cl: '#2fb344', S: '#f2c230', Na: '#8b5cf6', Al: '#9aa5b8', Fe: '#c2763a', A: '#14a39a', B: '#f08c2a', X: '#8b5cf6', Y: '#2fb344' };
  V.atomColor = function (k) { return ATOM[k] || '#8b95aa'; };
  V.atomDefs = function (p, keys) {
    return '<defs>' + keys.map(function (k) {
      var c = ATOM[k] || '#8b95aa';
      return '<radialGradient id="' + p + '-at-' + k + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".35" stop-color="' + c + '"/><stop offset="1" stop-color="' + c + '" stop-opacity="1"/></radialGradient>';
    }).join('') + '</defs>';
  };

  /* ---------- fundal, etichete ---------- */
  V.panel = function (p, w, h, fill) {
    return '<rect x="2" y="2" width="' + (w - 4) + '" height="' + (h - 4) + '" rx="22" fill="' + (fill || 'var(--il-env)') + '" stroke="var(--il-env-line)" stroke-width="2"/>' +
      '<rect x="2" y="2" width="' + (w - 4) + '" height="' + (h - 4) + '" rx="22" fill="url(#' + p + '-grid)"/>';
  };
  V.pill = function (x, y, text, o) {
    o = o || {};
    var tone = o.tone || 'ink', hh = o.h || 26, w = o.w || Math.round(text.length * (o.cw || 9.2) + 26);
    var fill = { ink: 'var(--ink)', exo: 'var(--exo)', endo: 'var(--endo)', gold: 'var(--il-gold)', soft: 'var(--paper)', ok: 'var(--ok)', warn: '#b07d00' }[tone];
    var tcol = { ink: 'var(--paper)', exo: '#fff', endo: '#fff', gold: '#3a2f00', soft: 'var(--ink-2)', ok: '#fff', warn: '#fff' }[tone];
    return '<g class="' + (o.cls || '') + '"' + (o.attrs ? ' ' + o.attrs : '') + '><rect x="' + f(x - w / 2) + '" y="' + f(y - hh / 2) + '" width="' + w + '" height="' + hh + '" rx="' + (hh / 2) + '" fill="' + fill + '"' + (tone === 'soft' ? ' stroke="var(--line-2)" stroke-width="1.5"' : '') + '/>' +
      '<text class="pill-t" x="' + f(x) + '" y="' + f(y + 4.6) + '" text-anchor="middle" style="fill:' + tcol + (o.lower ? ';letter-spacing:0;font-weight:700' : '') + '">' + text + '</text></g>';
  };
  // puncte plutitoare (aer / particule)
  V.air = function (n, x, y, w, h, seed) {
    var R = T.rng(seed || 7), s = '<g>';
    for (var i = 0; i < n; i++) {
      var cx = x + R.next() * w, cy = y + R.next() * h, r = 1.7 + R.next() * 2.2;
      s += '<circle class="v-air" cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '" style="--dx:' + f((R.next() - .5) * 18) + 'px;--dy:' + f((R.next() - .5) * 18) + 'px;animation-delay:-' + f(R.next() * 6) + 's"/>';
    }
    return s + '</g>';
  };
  V.table = function (x, y, w, h) {
    return '<g><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + (h || 16) + '" rx="7" fill="var(--line-2)"/><rect x="' + (x + 6) + '" y="' + (y + 2) + '" width="' + (w - 12) + '" height="3" rx="1.5" fill="var(--il-hi)"/></g>';
  };

  /* ---------- paharul de laborator ----------
     o: {p, x, y, w, h, level 0..1, tone, bubbles, id}  → {svg, id}
     Lichidul are 4 straturi (apă / exo / endo / soluție) cu opacitate, ca să se poată face tranziție de culoare. */
  V.beaker = function (o) {
    var p = o.p, x = o.x, y = o.y, w = o.w, h = o.h, r = o.r || 12, id = o.id || V.uid('bk');
    var lev = o.level == null ? .6 : o.level, tone = o.tone || 'w';
    function body(ix, iw, ih, ir) {
      return 'M' + ix + ' ' + y + ' L' + ix + ' ' + (y + ih - ir) + ' Q' + ix + ' ' + (y + ih) + ' ' + (ix + ir) + ' ' + (y + ih) + ' L' + (ix + iw - ir) + ' ' + (y + ih) + ' Q' + (ix + iw) + ' ' + (y + ih) + ' ' + (ix + iw) + ' ' + (y + ih - ir) + ' L' + (ix + iw) + ' ' + y;
    }
    var x0 = x - 44, x1 = x + w + 44, wv = 'M' + x0 + ' 0';
    for (var xx = x0; xx < x1; xx += 40) wv += ' q10 -6 20 0 t20 0';
    wv += ' L' + (x0 + Math.ceil((x1 - x0) / 40) * 40) + ' ' + (h + 20) + ' L' + x0 + ' ' + (h + 20) + ' Z';
    var ty = y + h * (1 - lev);
    var s = '<g id="' + id + '">';
    s += '<ellipse cx="' + f(x + w / 2) + '" cy="' + f(y + h + 4) + '" rx="' + f(w * .62) + '" ry="6" fill="var(--il-shadow)"/>';
    s += '<path d="' + body(x, w, h, r) + 'Z" fill="var(--il-hi2)"/>';
    s += '<clipPath id="' + id + '-c"><path d="' + body(x + 3, w - 6, h - 3, r - 3) + ' L' + (x + w - 3) + ' ' + (y - 40) + ' L' + (x + 3) + ' ' + (y - 40) + ' Z"/></clipPath>';
    s += '<g clip-path="url(#' + id + '-c)"><g class="v-liq" id="' + id + '-lq" style="transform:translateY(' + f(ty) + 'px)">';
    ['w', 'exo', 'endo', 'sol'].forEach(function (k) {
      s += '<g class="v-fade" data-tone="' + k + '" style="opacity:' + (k === tone ? 1 : 0) + '"><g class="v-wave"><path d="' + wv + '" fill="url(#' + p + '-liq-' + k + ')"/></g></g>';
    });
    s += '</g>';
    // bule
    s += '<g class="v-fade" id="' + id + '-bub" style="opacity:' + (o.bubbles ? 1 : 0) + '">';
    var R = T.rng(o.seed || 11);
    for (var i = 0; i < (o.nBub || 9); i++) {
      var bx = x + 14 + R.next() * (w - 28), by = y + h - 14 - R.next() * 10, br = 1.8 + R.next() * 3;
      s += '<circle class="v-bub" cx="' + f(bx) + '" cy="' + f(by) + '" r="' + f(br) + '" style="--rise:' + f(h * (.45 + R.next() * .3)) + 'px;animation-delay:-' + f(R.next() * 2.6) + 's;animation-duration:' + f(2 + R.next() * 1.6) + 's"/>';
    }
    s += '</g></g>';
    // sticla în față
    s += '<path class="v-glass-edge" d="' + body(x, w, h, r) + '"/>';
    s += '<path d="M' + (x - 7) + ' ' + y + ' L' + (x + w + 7) + ' ' + y + '" class="v-glass-edge" style="stroke-width:3.4"/>';
    s += '<path d="' + body(x, w, h, r) + 'Z" fill="url(#' + p + '-glass)" style="pointer-events:none"/>';
    s += '<rect x="' + (x + 8) + '" y="' + (y + 12) + '" width="5" height="' + f(h - 34) + '" rx="2.5" fill="#fff" opacity=".42"/>';
    s += '<rect x="' + (x + 8) + '" y="' + f(y + h - 20) + '" width="5" height="8" rx="2.5" fill="#fff" opacity=".35"/>';
    for (var k = 1; k <= 4; k++) s += '<line x1="' + (x + w - 17) + '" y1="' + f(y + 18 + k * (h - 36) / 4.6) + '" x2="' + (x + w - 5) + '" y2="' + f(y + 18 + k * (h - 36) / 4.6) + '" stroke="var(--il-edge)" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>';
    s += '</g>';
    return { svg: s, id: id, top: ty };
  };
  // actualizează nivelul / culoarea / bulele unui pahar existent
  V.setBeaker = function (root, id, st) {
    var lq = root.querySelector('#' + id + '-lq');
    if (st.top != null && lq) lq.style.transform = 'translateY(' + f(st.top) + 'px)';
    if (st.tone) T.$$('#' + id + '-lq > g[data-tone]', root).forEach(function (n) { n.style.opacity = n.dataset.tone === st.tone ? 1 : 0; });
    if (st.opac) T.$$('#' + id + '-lq > g[data-tone]', root).forEach(function (n) { if (st.opac[n.dataset.tone] != null) n.style.opacity = st.opac[n.dataset.tone]; });
    if (st.bubbles != null) { var b = root.querySelector('#' + id + '-bub'); if (b) b.style.opacity = st.bubbles ? 1 : 0; }
  };

  /* ---------- termometru ---------- */
  // o: {p, x, y (sus), h (tubul), level 0..1, id, ticks}
  V.thermo = function (o) {
    var x = o.x, y = o.y, h = o.h, id = o.id || V.uid('th'), lev = o.level == null ? .5 : o.level, col = o.color || 'var(--exo)';
    var s = '<g id="' + id + '">';
    s += '<rect x="' + (x - 7) + '" y="' + y + '" width="14" height="' + (h + 10) + '" rx="7" fill="var(--paper)" stroke="var(--il-edge)" stroke-width="2.4"/>';
    s += '<circle cx="' + x + '" cy="' + (y + h + 16) + '" r="13" fill="var(--paper)" stroke="var(--il-edge)" stroke-width="2.4"/>';
    s += '<circle cx="' + x + '" cy="' + (y + h + 16) + '" r="8.5" id="' + id + '-b" style="fill:' + col + ';transition:fill .6s"/>';
    s += '<rect x="' + (x - 3) + '" y="' + (y + 5) + '" width="6" height="' + (h + 14) + '" rx="3" id="' + id + '-m" style="fill:' + col + ';transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(' + f(lev) + ');transition:transform .7s cubic-bezier(.3,.7,.3,1),fill .6s"/>';
    if (o.ticks !== false) for (var i = 0; i <= 5; i++) s += '<line x1="' + (x + 9) + '" y1="' + f(y + 8 + i * (h - 6) / 5) + '" x2="' + (x + (i % 5 === 0 ? 17 : 14)) + '" y2="' + f(y + 8 + i * (h - 6) / 5) + '" stroke="var(--il-edge)" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>';
    s += '<rect x="' + (x - 4.5) + '" y="' + (y + 6) + '" width="2.4" height="' + f(h - 4) + '" rx="1.2" fill="#fff" opacity=".5"/>';
    return s + '</g>';
  };
  V.setThermo = function (root, id, lev, col) {
    var m = root.querySelector('#' + id + '-m'), b = root.querySelector('#' + id + '-b');
    if (m) { m.style.transform = 'scaleY(' + f(T.clamp(lev, 0.02, 1)) + ')'; if (col) m.style.fill = col; }
    if (b && col) b.style.fill = col;
  };

  /* ---------- flacără ---------- */
  V.flame = function (o) {
    var p = o.p, x = o.x, y = o.y, sc = o.s || 1, on = o.on !== false;
    var s = '<g class="v-fade" id="' + (o.id || '') + '" style="opacity:' + (on ? 1 : 0) + '" transform="translate(' + f(x) + ' ' + f(y) + ') scale(' + sc + ')">';
    s += '<ellipse cx="0" cy="-6" rx="46" ry="40" fill="url(#' + p + '-gx)" class="v-pulse"/>';
    s += '<g transform="translate(-30 -80)">';
    s += '<path class="v-flame" fill="url(#' + p + '-fo)" d="M30 0 C33 17 56 30 56 52 C56 68 44 80 30 80 C16 80 4 68 4 52 C4 40 12 32 18 22 C20 30 24 34 28 34 C26 22 26 10 30 0Z"/>';
    s += '<path class="v-flame f2" fill="url(#' + p + '-fm)" d="M30 22 C33 34 47 42 47 56 C47 68 40 78 30 78 C20 78 13 68 13 56 C13 46 20 40 24 33 C26 38 28 40 30 40 C29 34 29 28 30 22Z"/>';
    s += '<path class="v-flame f3" fill="url(#' + p + '-fi)" d="M30 44 C33 52 40 56 40 64 C40 72 36 78 30 78 C24 78 20 72 20 64 C20 56 27 52 30 44Z"/>';
    return s + '</g></g>';
  };

  /* ---------- gheață ---------- */
  V.ice = function (o) {
    var p = o.p, x = o.x, y = o.y, s0 = o.s || 40, id = o.id || '';
    var a = s0, d = s0 * .28;
    var s = '<g id="' + id + '" transform="translate(' + f(x) + ' ' + f(y) + ')" style="' + (o.style || '') + '">';
    s += '<path d="M0 ' + f(d) + ' L' + f(d) + ' 0 L' + f(a + d) + ' 0 L' + f(a) + ' ' + f(d) + 'Z" fill="#e8f6ff" stroke="#6fb4ea" stroke-width="2" stroke-linejoin="round"/>';
    s += '<path d="M' + f(a) + ' ' + f(d) + ' L' + f(a + d) + ' 0 L' + f(a + d) + ' ' + f(a - d) + ' L' + f(a) + ' ' + f(a) + 'Z" fill="#9bcdf5" stroke="#6fb4ea" stroke-width="2" stroke-linejoin="round"/>';
    s += '<rect x="0" y="' + f(d) + '" width="' + f(a) + '" height="' + f(a - d) + '" rx="4" fill="url(#' + p + '-ice)" stroke="#6fb4ea" stroke-width="2"/>';
    s += '<path d="M' + f(a * .16) + ' ' + f(d + a * .14) + ' L' + f(a * .16) + ' ' + f(d + a * .42) + '" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>';
    s += '<path d="M' + f(a * .3) + ' ' + f(d + a * .12) + ' L' + f(a * .52) + ' ' + f(d + a * .12) + '" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
    return s + '</g>';
  };

  /* ---------- atomi și legături ---------- */
  V.atom = function (o) {
    var r = o.r || 15, k = o.k || 'X', id = o.id || '';
    var dark = (k === 'C' || k === 'N' || k === 'O' || k === 'Cl' || k === 'Na' || k === 'A' || k === 'X' || k === 'Y' || k === 'Fe');
    return '<g id="' + id + '" transform="translate(' + f(o.x) + ' ' + f(o.y) + ')"><g class="' + (o.cls || '') + '" style="' + (o.style || '') + '"><circle r="' + r + '" fill="url(#' + o.p + '-at-' + k + ')" stroke="rgba(28,38,64,.55)" stroke-width="1.6"/>' +
      (o.label === false ? '' : '<text x="0" y="' + f(r * .34) + '" text-anchor="middle" style="font-size:' + f(r * .88) + 'px;font-weight:800;fill:' + (dark ? '#fff' : '#1c2640') + '">' + (o.text || k) + '</text>') + '</g></g>';
  };
  V.bond = function (x1, y1, x2, y2, o) {
    o = o || {};
    return '<line ' + (o.id ? 'id="' + o.id + '" ' : '') + 'x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" stroke="' + (o.color || 'var(--ink-3)') + '" stroke-width="' + (o.w || 6) + '" stroke-linecap="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + ' style="' + (o.style || '') + '"/>';
  };

  /* ---------- energie: jeton și săgeată de căldură ---------- */
  V.token = function (o) {
    var p = o.p, r = o.r || 11, lab = o.label == null ? 'Q' : o.label, mo = '';
    if (o.path && !V.reduced()) mo = '<animateMotion dur="' + (o.dur || 2.4) + 's" begin="' + (o.begin || 0) + 's" repeatCount="indefinite" path="' + o.path + '" keyPoints="0;1" keyTimes="0;1" calcMode="linear"/>';
    return '<g transform="translate(' + f(o.x || 0) + ' ' + f(o.y || 0) + ')"' + (o.id ? ' id="' + o.id + '"' : '') + ' style="' + (o.style || '') + '">' + mo +
      '<circle r="' + (r + 3) + '" fill="var(--il-gold)" opacity=".25"/><circle r="' + r + '" fill="url(#' + p + '-gold)" stroke="#b07d00" stroke-width="1.6"/>' +
      '<text x="0" y="' + f(r * .36) + '" text-anchor="middle" style="font-size:' + f(r * 1.05) + 'px;font-weight:850;fill:#4a3800">' + lab + '</text></g>';
  };
  // săgeată cu puncte care „curg”: (x1,y1) → (x2,y2)
  V.flow = function (o) {
    var x1 = o.x1, y1 = o.y1, x2 = o.x2, y2 = o.y2, tone = o.tone || 'exo', col = tone === 'endo' ? 'var(--endo)' : tone === 'ink' ? 'var(--ink-2)' : tone === 'gold' ? 'var(--il-gold)' : 'var(--exo)';
    var ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, len = Math.hypot(x2 - x1, y2 - y1), wd = o.w || 10;
    var bx = x2 - Math.cos(ang * Math.PI / 180) * 12, by = y2 - Math.sin(ang * Math.PI / 180) * 12;
    var s = '<g class="' + (o.cls || '') + '" style="' + (o.style || '') + '">';
    s += '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(bx) + '" y2="' + f(by) + '" stroke="' + col + '" stroke-opacity=".2" stroke-width="' + (wd + 6) + '" stroke-linecap="round"/>';
    s += '<line class="v-dash' + (o.rev ? ' rev' : '') + '" x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(bx) + '" y2="' + f(by) + '" stroke="' + col + '" stroke-width="' + wd + '"/>';
    s += '<polygon points="0,-' + (wd * 1.1) + ' ' + (wd * 1.9) + ',0 0,' + (wd * 1.1) + '" fill="' + col + '" transform="translate(' + f(x2 - Math.cos(ang * Math.PI / 180) * wd * 1.9) + ' ' + f(y2 - Math.sin(ang * Math.PI / 180) * wd * 1.9) + ') rotate(' + f(ang) + ')" stroke="' + col + '" stroke-width="2" stroke-linejoin="round"/>';
    return s + '</g>';
  };
  // unde de căldură deasupra unui obiect
  V.heatWaves = function (x, y, w, on) {
    var s = '<g class="v-heatw v-fade" style="opacity:' + (on ? 1 : 0) + '">';
    [0, 1, 2].forEach(function (i) {
      var cx = x + w * (.2 + i * .3);
      s += '<path d="M' + f(cx) + ' ' + f(y) + ' q-6 -9 0 -18 q6 -9 0 -18" stroke="var(--exo)" style="animation-delay:-' + (i * .7) + 's"/>';
    });
    return s + '</g>';
  };


  /* ---------- cilindru cu piston ----------
     o: {p, x, y, w, h, n particule, id, load:true}.  set(root, lift 0..1, heat 0..1) mută pistonul și colorează gazul */
  V.cylinder = function (o) {
    var p = o.p, x = o.x, y = o.y, w = o.w, h = o.h, id = o.id || V.uid('cy'), yB = y + h, nP = o.n == null ? 14 : o.n;
    var R = T.rng(o.seed || 3), pts = [], i;
    for (i = 0; i < nP; i++) pts.push({ fx: .1 + R.next() * .8, fy: .08 + R.next() * .84 });
    function gh(l) { return h * (.3 + .32 * l); }
    var s = '<g id="' + id + '">';
    s += '<ellipse cx="' + f(x + w / 2) + '" cy="' + f(yB + 5) + '" rx="' + f(w * .62) + '" ry="6" fill="var(--il-shadow)"/>';
    s += '<g id="' + id + '-gas" style="transform-box:fill-box;transform-origin:50% 100%;transform:scaleY(' + f(gh(0) / h) + ');transition:transform .7s cubic-bezier(.3,.7,.3,1)">' +
      '<rect x="' + (x + 3) + '" y="' + y + '" width="' + (w - 6) + '" height="' + h + '" fill="url(#' + p + '-liq-gas)"/>' +
      '<rect id="' + id + '-hot" x="' + (x + 3) + '" y="' + y + '" width="' + (w - 6) + '" height="' + h + '" style="fill:' + mix('var(--exo)', 34) + ';opacity:0;transition:opacity .7s"/></g>';
    s += '<g id="' + id + '-pts">';
    pts.forEach(function (q, k) { s += '<circle class="v-jig" id="' + id + '-p' + k + '" r="3.2" cx="' + f(x + 5 + q.fx * (w - 10)) + '" cy="' + f(yB - q.fy * gh(0)) + '" style="fill:var(--ink-2);opacity:.75;animation-delay:-' + f(R.next() * .4) + 's"/>'; });
    s += '</g>';
    s += '<path d="M' + x + ' ' + (y - 6) + ' L' + x + ' ' + yB + ' L' + (x + w) + ' ' + yB + ' L' + (x + w) + ' ' + (y - 6) + '" class="v-glass-edge" style="stroke-width:3.6"/>';
    s += '<rect x="' + (x + 6) + '" y="' + (y + 4) + '" width="4" height="' + f(h - 18) + '" rx="2" fill="#fff" opacity=".4"/>';
    var py0 = yB - gh(0) - 12;
    if (o.stops) s += '<rect x="' + (x - 7) + '" y="' + f(py0 - 16) + '" width="11" height="14" rx="3" fill="var(--ink)"/><rect x="' + (x + w - 4) + '" y="' + f(py0 - 16) + '" width="11" height="14" rx="3" fill="var(--ink)"/>';
    s += '<g id="' + id + '-pg" style="transition:transform .7s cubic-bezier(.3,.7,.3,1)">';
    s += '<rect x="' + (x - 3) + '" y="' + f(py0 - 34) + '" width="6" height="36" rx="3" fill="url(#' + p + '-metal)" transform="translate(' + f(w / 2) + ' 0)"/>';
    if (o.load !== false) s += '<g transform="translate(' + f(x + w / 2 - 24) + ' ' + f(py0 - 58) + ')"><rect width="48" height="26" rx="5" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="2"/><text x="24" y="18" text-anchor="middle" style="font-size:12px;font-weight:800;fill:var(--ink)">sarcină</text></g>';
    s += '<rect x="' + (x + 1) + '" y="' + f(py0) + '" width="' + (w - 2) + '" height="12" rx="4" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="2"/>';
    s += '</g></g>';
    return {
      svg: s, id: id,
      set: function (root, lift, heat) {
        var g1 = gh(lift), g0 = gh(0);
        var gas = root.querySelector('#' + id + '-gas'); if (gas) gas.style.transform = 'scaleY(' + f(g1 / h) + ')';
        var hot = root.querySelector('#' + id + '-hot'); if (hot) hot.style.opacity = f(heat);
        var pg = root.querySelector('#' + id + '-pg'); if (pg) pg.style.transform = 'translateY(' + f(-(g1 - g0)) + 'px)';
        pts.forEach(function (q, k) { var c = root.querySelector('#' + id + '-p' + k); if (c) c.setAttribute('cy', f(yB - q.fy * g1)); });
        var cls = heat > .66 ? 'v-jig hot' : heat < .25 ? 'v-jig cold' : 'v-jig';
        T.$$('#' + id + '-pts circle', root).forEach(function (c) { c.setAttribute('class', cls); });
      }
    };
  };

  /* ---------- ciclu de animație comun (pornește doar cât timp elementul e în pagină și vizibil) ---------- */
  var loops = [], rafId = null, lastT = 0;
  function tick(ts) {
    var dt = Math.min(.05, (ts - lastT) / 1000 || .016); lastT = ts;
    loops = loops.filter(function (L) { return L.el.isConnected && !L.stopped; });
    loops.forEach(function (L) { if (L.vis !== false) { try { L.fn(dt, ts); } catch (e) { L.stopped = true; console.error(e); } } });
    rafId = loops.length ? requestAnimationFrame(tick) : null;
  }
  V.loop = function (el, fn) {
    var L = { el: el, fn: fn, vis: true, stopped: false };
    if ('IntersectionObserver' in g) {
      var io = new IntersectionObserver(function (en) { L.vis = en[0].isIntersecting; }, { rootMargin: '80px' });
      io.observe(el);
    }
    loops.push(L);
    if (!rafId) { lastT = performance.now(); rafId = requestAnimationFrame(tick); }
    return { stop: function () { L.stopped = true; } };
  };

  /* cadru standard pentru o scenă: <svg class="vz"> într-un chenar */
  V.frame = function (vb, inner, label) {
    return '<div class="vz-frame"><svg class="vz" viewBox="0 0 ' + vb[0] + ' ' + vb[1] + '" role="img" aria-label="' + (label || 'Ilustrație') + '" xmlns="http://www.w3.org/2000/svg">' + inner + '</svg></div>';
  };
})(window);
