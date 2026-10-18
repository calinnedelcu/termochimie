/* =========================================================
   problems-ui.js — afișarea problemelor (enunț, părți, pași)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  /**
   * Desenează o instanță de problemă.
   * inst: {statement, data[], note, parts:[{id, ask, type, a, unit, tol, dec, opts, correct, steps[], why}], tool:{name, opts}}
   * o: {mode:'instant'|'deferred', label, onResult(res, part)}
   */
  T.renderProblem = function (inst, o) {
    o = o || {};
    var mode = o.mode || 'instant';
    var el = T.h('div', { class: 'prob-card' });
    el.append(T.h('div', { class: 'prob-statement', html: inst.statement }));
    if (inst.data && inst.data.length) {
      el.append(T.h('div', { class: 'prob-data' }, inst.data.map(function (d) { return T.h('span', { class: 'chip', html: d }); })));
    }
    if (inst.note) el.append(T.h('div', { html: inst.note }));

    var partsEl = T.h('div', { class: 'prob-parts' });
    var apis = inst.parts.map(function (p) {
      var q = p.type === 'mc'
        ? { t: 'mc', q: p.ask, opts: p.opts, a: p.correct, why: p.why, noShuffle: p.noShuffle }
        : { t: 'num', q: p.ask, a: p.a, alts: p.alts, tol: p.tol == null ? 0.015 : p.tol, abs: p.abs, unit: p.unit, dec: p.dec == null ? 2 : p.dec, why: p.why };
      var api = T.Q.create(q, {
        num: (o.label ? o.label + ' ' : '') + p.id + ')', mode: mode,
        onResult: function (res) { if (o.onResult) o.onResult(res, p); }
      });
      partsEl.append(T.h('div', { class: 'prob-part' }, api.el));
      return api;
    });
    el.append(partsEl);

    // ---- rezolvare pas cu pas ----
    var steps = [], heads = [], sol = T.h('div', { class: 'prob-solution', hidden: true });
    var multi = inst.parts.filter(function (p) { return p.steps && p.steps.length; }).length > 1;
    inst.parts.forEach(function (p) {
      if (!p.steps || !p.steps.length) return;
      if (multi) { var hd = T.h('h4', { text: 'Rezolvare ' + p.id + ')', hidden: true }); heads.push({ el: hd, at: steps.length }); sol.append(hd); }
      p.steps.forEach(function (s, i) {
        var st = T.h('div', { class: 'step' + (i === p.steps.length - 1 ? ' final' : ''), hidden: true },
          T.h('span', { class: 'sn', text: i + 1 }), T.h('div', { class: 'sb-t', html: s }));
        steps.push(st); sol.append(st);
      });
    });
    var shown = 0;
    function reveal(n) {
      shown = Math.min(steps.length, n);
      steps.forEach(function (s, i) { s.hidden = i >= shown; });
      heads.forEach(function (h) { h.el.hidden = shown <= h.at; });
      sol.hidden = shown === 0;
      btnNext.hidden = shown >= steps.length;
      btnAll.hidden = shown >= steps.length;
      btnHide.hidden = shown === 0;
    }
    var btnNext = T.h('button', { type: 'button', class: 'btn', text: 'Arată următorul pas', onclick: function () { reveal(shown + 1); } });
    var btnAll = T.h('button', { type: 'button', class: 'btn ghost', text: 'Rezolvarea completă', onclick: function () { reveal(steps.length); } });
    var btnHide = T.h('button', { type: 'button', class: 'btn small ghost', text: 'Ascunde rezolvarea', hidden: true, onclick: function () { reveal(0); } });
    if (mode === 'instant' && steps.length) {
      el.append(T.h('div', { class: 'prob-help' }, btnNext, btnAll, btnHide));
    }
    if (inst.method && mode === 'instant') el.append(T.h('details', { class: 'more prob-method' }, T.h('summary', { text: 'Ideea de rezolvare (indiciu)' }), T.h('div', { class: 'more-b', html: inst.method })));
    el.append(sol);

    // ---- unealtă interactivă (ex.: combinatorul Hess) ----
    if (inst.tool && T.widgets[inst.tool.name] && mode === 'instant') {
      var host = T.h('div', { class: 'wd prob-tools' });
      el.append(host);
      try { T.widgets[inst.tool.name](host, inst.tool.opts || {}); } catch (e) { console.error(e); }
    }

    return {
      el: el, apis: apis,
      finish: function () {
        var good = 0;
        apis.forEach(function (api) {
          var r = api.check();
          if (r.state === 'empty') api.reveal();
          api.lock();
          if (r.correct) good++;
        });
        reveal(steps.length);
        btnNext.hidden = btnAll.hidden = btnHide.hidden = true;
        sol.hidden = steps.length === 0;
        return { good: good, total: apis.length };
      },
      showSolution: function () { reveal(steps.length); }
    };
  };

  /* ---------- pagina unui tip de problemă ---------- */
  T.mountProblems = function (root) {
    T.$$('[data-problem]', root).forEach(function (host) {
      if (host.dataset.mounted) return;
      host.dataset.mounted = '1';
      mountOne(host, host.dataset.problem);
    });
  };

  var LEVELS = [
    { v: 0, label: 'Din caiet' },
    { v: 1, label: 'Variație ușoară' },
    { v: 2, label: 'Variație medie' },
    { v: 3, label: 'Dificil' }
  ];

  function mountOne(host, id) {
    var P = T.problems[id];
    if (!P) { host.append(T.h('p', { class: 'wd-err', text: 'Problemă lipsă: ' + id })); return; }
    var level = 0, hist = { 1: [], 2: [], 3: [] }, pos = { 1: -1, 2: -1, 3: -1 };
    var seedLbl = T.h('span', { class: 'prob-seed' });
    var lv = T.h('div', { class: 'lv', role: 'group', 'aria-label': 'Nivel' });
    var btnPrev = T.h('button', { type: 'button', class: 'btn small ghost', text: '‹ Anterioara', onclick: function () { go(-1); } });
    var btnNext = T.h('button', { type: 'button', class: 'btn small primary', text: 'Altă variație ↻', onclick: function () { go(1); } });
    var view = T.h('div', { class: 'prob-view' });
    var bar = T.h('div', { class: 'prob-bar' }, lv, T.h('span', { class: 'spacer' }), seedLbl, btnPrev, btnNext);
    host.append(bar, view);

    var lvBtns = LEVELS.map(function (L) {
      var b = T.h('button', { type: 'button', 'aria-pressed': String(L.v === level), text: L.v === 0 ? (P.originalLabel || L.label) : L.label, onclick: function () { setLevel(L.v); } });
      lv.append(b); return b;
    });

    function setLevel(v) {
      level = v;
      lvBtns.forEach(function (b, i) { b.setAttribute('aria-pressed', String(LEVELS[i].v === v)); });
      if (v > 0 && pos[v] < 0) { hist[v].push(newSeed()); pos[v] = 0; }
      render();
    }
    function newSeed() { return Math.floor(Math.random() * 900000) + 100; }
    function go(d) {
      if (level === 0) return;
      var p = pos[level] + d;
      if (p < 0) return;
      if (p >= hist[level].length) hist[level].push(newSeed());
      pos[level] = p;
      render();
    }
    function render() {
      var inst, seed = null;
      if (level === 0) inst = P.original();
      else { seed = hist[level][pos[level]]; inst = P.make(seed, level); }
      var isVar = level > 0;
      btnPrev.hidden = btnNext.hidden = seedLbl.hidden = !isVar;
      if (isVar) { btnPrev.disabled = pos[level] <= 0; seedLbl.textContent = 'Variația nr. ' + (pos[level] + 1); }
      var counted = {};
      var pv = T.renderProblem(inst, {
        mode: 'instant',
        onResult: function (res, part) {
          if (counted[part.id]) return; counted[part.id] = 1;
          T.store.update('prob.' + id + '.tot', function (v) { return (v || 0) + 1; }, 0);
          if (res.correct) T.store.update('prob.' + id + '.ok', function (v) { return (v || 0) + 1; }, 0);
        }
      });
      view.replaceChildren(pv.el);
      T.mountWidgets(view);
    }
    render();
  }
})(typeof window !== 'undefined' ? window : globalThis);
