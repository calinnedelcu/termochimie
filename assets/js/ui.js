/* =========================================================
   ui.js — controale, motor de întrebări, quiz-uri, mini-verificări
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  /* ---------- controale ---------- */
  T.slider = function (o) {
    var wrap = T.h('label', { class: 'sl' });
    var lab = T.h('span', { class: 'sl-l', html: o.label });
    var val = T.h('output', { class: 'sl-v' });
    var inp = T.h('input', { type: 'range', min: o.min, max: o.max, step: o.step == null ? 1 : o.step, value: o.value, 'aria-label': (o.aria || o.label || '').replace(/<[^>]+>|[$\[\]]/g, '') });
    function show() {
      var v = +inp.value;
      val.textContent = (o.fmt ? o.fmt(v) : T.fmt(v, o.dec == null ? 2 : o.dec)) + (o.unit ? ' ' + o.unit : '');
    }
    inp.addEventListener('input', function () { show(); if (o.onInput) o.onInput(+inp.value); });
    show();
    wrap.append(lab, inp, val);
    wrap.set = function (v) { inp.value = v; show(); };
    wrap.get = function () { return +inp.value; };
    wrap.input = inp;
    return wrap;
  };

  T.seg = function (options, value, onChange, label) {
    var wrap = T.h('div', { class: 'seg', role: 'group', 'aria-label': label || null });
    var btns = options.map(function (o) {
      return T.h('button', {
        type: 'button', class: 'seg-b ' + (o.cls || ''), html: o.label, 'aria-pressed': String(o.v === value),
        onclick: function () { wrap.set(o.v); if (onChange) onChange(o.v); }
      });
    });
    wrap.set = function (v) {
      btns.forEach(function (b, i) { b.setAttribute('aria-pressed', String(options[i].v === v)); });
      wrap.value = v;
    };
    wrap.value = value;
    btns.forEach(function (b) { wrap.append(b); });
    return wrap;
  };

  T.btn = function (label, onclick, cls) {
    return T.h('button', { type: 'button', class: 'btn ' + (cls || ''), html: label, onclick: onclick });
  };

  // ---------- widget-uri ----------
  T.widget = function (name, fn) { T.widgets[name] = fn; };

  T.shell = function (el, o) {
    o = o || {};
    el.classList.add('wd');
    var head = T.h('div', { class: 'wd-head' },
      T.h('span', { class: 'wd-badge', text: o.badge || 'Încearcă' }),
      T.h('b', { class: 'wd-title', html: o.title || '' }),
      o.reset ? T.h('button', { type: 'button', class: 'btn small ghost', onclick: o.reset, text: 'Resetează' }) : null);
    var body = T.h('div', { class: 'wd-body' });
    el.replaceChildren(head);
    if (o.help) el.append(T.h('p', { class: 'wd-help', html: o.help }));
    el.append(body);
    return body;
  };

  T.mountWidgets = function (root) {
    T.$$('[data-widget]', root).forEach(function (el) {
      if (el.dataset.mounted) return;
      el.dataset.mounted = '1';
      var fn = T.widgets[el.dataset.widget], opts = {};
      try { opts = el.dataset.opts ? JSON.parse(el.dataset.opts) : {}; } catch (e) { /* ignorat */ }
      if (!fn) { el.append(T.h('p', { class: 'wd-err', text: 'Parte interactivă lipsă: ' + el.dataset.widget })); return; }
      try { fn(el, opts); } catch (err) {
        console.error('Widget ' + el.dataset.widget, err);
        el.append(T.h('p', { class: 'wd-err', text: 'Nu s-a putut încărca această parte interactivă.' }));
      }
    });
  };

  // helper pentru a include un widget în șabloane HTML
  T.W = function (name, opts) {
    return '<div class="wd" data-widget="' + name + '"' + (opts ? " data-opts='" + JSON.stringify(opts).replace(/'/g, '&#39;') + "'" : '') + '></div>';
  };
  T.QZ = function (id) { return '<div class="quiz" data-quiz="' + id + '"></div>'; };
  T.PR = function (id, opts) { return '<div class="prob" data-problem="' + id + '"' + (opts ? " data-opts='" + JSON.stringify(opts) + "'" : '') + '></div>'; };

  /* ---------- casete de text (șabloane) ---------- */
  var CALL = {
    key: ['Reține', '★'], warn: ['Atenție', '!'], tip: ['În cuvinte simple', '≈'], note: ['Notă', 'i'],
    exo: ['Exotermă', '↑'], endo: ['Endotermă', '↓'], imp: ['Marcat în caiet', '✓'], ex: ['Exemplu', '▸'], why: ['De ce?', '?']
  };
  T.callout = function (kind, body, title) {
    var c = CALL[kind] || CALL.note;
    return '<div class="callout ' + kind + '"><div class="ct"><span class="ct-i" aria-hidden="true">' + c[1] + '</span>' + (title || c[0]) + '</div><div class="cb">' + body + '</div></div>';
  };
  T.fig = function (html, cap) { return '<figure class="fig">' + html + (cap ? '<figcaption>' + cap + '</figcaption>' : '') + '</figure>'; };
  T.details = function (title, body, open) { return '<details class="more"' + (open ? ' open' : '') + '><summary>' + title + '</summary><div class="more-b">' + body + '</div></details>'; };

  /* ---------- motor de întrebări ---------- */
  // q: {t:'mc'|'multi'|'num'|'match', q, opts, a, why, unit, tol, fig, noShuffle}
  T.Q = {};
  var LETTERS = 'ABCDEFGH';

  T.Q.create = function (q, o) {
    o = o || {};
    var mode = o.mode || 'instant';
    var root = T.h('div', { class: 'qn', 'data-type': q.t });
    var head = T.h('div', { class: 'qn-q' },
      o.num != null ? T.h('span', { class: 'qn-n', text: o.num }) : null,
      T.h('div', { class: 'qn-t', html: q.q }));
    root.append(head);
    if (q.fig) root.append(T.h('div', { class: 'qn-fig', html: q.fig }));
    if (q.t === 'multi') root.append(T.h('div', { class: 'qn-sub', text: 'Alege toate variantele corecte.' }));

    var fb = T.h('div', { class: 'qn-fb', hidden: true, 'aria-live': 'polite' });
    var actions = T.h('div', { class: 'qn-actions' });
    var state = { done: false, first: null, result: null };
    var api = { el: root, q: q };
    var ui = {};

    /* --- construirea intrărilor --- */
    if (q.t === 'mc' || q.t === 'multi') {
      var idx = q.opts.map(function (_, i) { return i; });
      var order = (q.noShuffle || o.shuffle === false) ? idx : T.rng((Math.random() * 1e9) | 0).shuffle(idx);
      var sel = [];
      var optsEl = T.h('div', { class: 'qn-opts', role: q.t === 'mc' ? 'radiogroup' : 'group' });
      ui.btns = order.map(function (orig, pos) {
        var b = T.h('button', {
          type: 'button', class: 'opt', 'data-o': orig, role: q.t === 'mc' ? 'radio' : 'checkbox', 'aria-checked': 'false',
          onclick: function () {
            if (state.done) return;
            var k = sel.indexOf(orig);
            if (q.t === 'mc') sel = [orig];
            else if (k >= 0) sel.splice(k, 1); else sel.push(orig);
            ui.btns.forEach(function (x) {
              var on = sel.indexOf(+x.dataset.o) >= 0;
              x.classList.toggle('sel', on); x.setAttribute('aria-checked', String(on));
            });
            if (o.onChange) o.onChange(api);
          }
        }, T.h('span', { class: 'opt-k', text: LETTERS[pos] }), T.h('span', { class: 'opt-t', html: q.opts[orig] }));
        optsEl.append(b);
        return b;
      });
      root.append(optsEl);
      api.value = function () { return sel.slice(); };
      api.answered = function () { return sel.length > 0; };
      api.evaluate = function () {
        var want = [].concat(q.a).sort().join(',');
        var have = sel.slice().sort().join(',');
        if (q.t === 'mc') return { correct: sel.length === 1 && sel[0] === q.a, score: sel.length === 1 && sel[0] === q.a ? 1 : 0, state: sel.length ? 'x' : 'empty' };
        var A = [].concat(q.a), good = sel.filter(function (s) { return A.indexOf(s) >= 0; }).length, bad = sel.length - good;
        var sc = Math.max(0, (good - bad) / A.length);
        return { correct: want === have, score: want === have ? 1 : sc, state: sel.length ? 'x' : 'empty' };
      };
      api.mark = function () {
        var A = [].concat(q.a);
        ui.btns.forEach(function (b) {
          var oi = +b.dataset.o, chosen = sel.indexOf(oi) >= 0, right = A.indexOf(oi) >= 0;
          b.classList.remove('ok', 'bad', 'miss');
          if (chosen && right) b.classList.add('ok');
          else if (chosen && !right) b.classList.add('bad');
          else if (!chosen && right) b.classList.add('miss');
          b.disabled = true;
        });
      };
      api.unmark = function () {
        sel = [];
        ui.btns.forEach(function (b) { b.classList.remove('ok', 'bad', 'miss', 'sel'); b.disabled = false; b.setAttribute('aria-checked', 'false'); });
      };
    } else if (q.t === 'num') {
      var inp = T.h('input', {
        type: 'text', inputmode: 'decimal', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', class: 'inp',
        placeholder: 'răspunsul tău', 'aria-label': 'Răspuns numeric'
      });
      var row = T.h('div', { class: 'qn-in' }, inp, q.unit ? T.h('span', { class: 'unit', html: q.unit }) : null);
      root.append(row);
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (mode === 'instant') api.check(); } });
      inp.addEventListener('input', function () { if (o.onChange) o.onChange(api); });
      ui.inp = inp;
      api.value = function () { return inp.value; };
      api.answered = function () { return inp.value.trim() !== ''; };
      api.evaluate = function () {
        var cands = T.parseNum(inp.value);
        if (!cands.length) return { correct: false, score: 0, state: 'empty' };
        var targets = [].concat(q.a, q.alts || []);
        var tol = q.tol == null ? 0.01 : q.tol, abs = q.abs || 0, ci, ti;
        for (ci = 0; ci < cands.length; ci++) for (ti = 0; ti < targets.length; ti++)
          if (T.near(cands[ci], targets[ti], tol, abs)) return { correct: true, score: 1, state: 'ok' };
        var t0 = targets[0];
        for (ci = 0; ci < cands.length; ci++) {
          if (t0 !== 0 && T.near(cands[ci], -t0, tol, abs)) return { correct: false, score: 0, state: 'sign' };
          if (t0 !== 0 && (T.near(cands[ci], t0 * 1000, tol) || T.near(cands[ci], t0 / 1000, tol))) return { correct: false, score: 0, state: 'unit' };
        }
        return { correct: false, score: 0, state: 'bad' };
      };
      api.mark = function (res) { inp.classList.toggle('ok', !!res.correct); inp.classList.toggle('bad', !res.correct); };
      api.unmark = function () { inp.classList.remove('ok', 'bad'); };
    } else if (q.t === 'match') {
      var rights = q.pairs.map(function (p) { return p[1]; });
      var uniq = [];
      rights.forEach(function (r) { if (uniq.indexOf(r) < 0) uniq.push(r); });
      var shuffled = T.rng((Math.random() * 1e9) | 0).shuffle(uniq.map(function (_, i) { return i; }));
      var rowsEl = T.h('div', { class: 'qn-match' });
      ui.sels = q.pairs.map(function (p, i) {
        var s = T.h('select', { class: 'inp', 'aria-label': 'Alege potrivirea' });
        s.append(T.h('option', { value: '', text: '— alege —' }));
        shuffled.forEach(function (ri) { var d = document.createElement('div'); d.innerHTML = T.rich(uniq[ri]); s.append(T.h('option', { value: ri, text: d.textContent })); });
        s.addEventListener('change', function () { if (o.onChange) o.onChange(api); });
        rowsEl.append(T.h('div', { class: 'qm-row' }, T.h('span', { class: 'qm-l', html: p[0] }), s));
        return s;
      });
      root.append(rowsEl);
      api.value = function () { return ui.sels.map(function (s) { return s.value; }); };
      api.answered = function () { return ui.sels.every(function (s) { return s.value !== ''; }); };
      api.evaluate = function () {
        var n = 0;
        ui.sels.forEach(function (s, i) { if (s.value !== '' && uniq[+s.value] === rights[i]) n++; });
        var empty = ui.sels.every(function (s) { return s.value === ''; });
        return { correct: n === q.pairs.length, score: n / q.pairs.length, state: empty ? 'empty' : 'x' };
      };
      api.mark = function () {
        ui.sels.forEach(function (s, i) {
          var good = s.value !== '' && uniq[+s.value] === rights[i];
          s.classList.toggle('ok', good); s.classList.toggle('bad', !good); s.disabled = true;
        });
      };
      api.unmark = function () { ui.sels.forEach(function (s) { s.classList.remove('ok', 'bad'); s.disabled = false; s.value = ''; }); };
    }

    /* --- feedback --- */
    function showFb(res, reveal) {
      var msg = '', cls = res.correct ? 'ok' : (res.score > 0 && q.t !== 'num' ? 'part' : 'bad');
      if (res.correct) msg = '<b>Corect!</b> ';
      else if (res.state === 'empty') { msg = '<b>Alege sau scrie un răspuns.</b>'; cls = 'bad'; }
      else if (res.state === 'sign') msg = '<b>Aproape.</b> Valoarea e bună ca mărime, dar <b>semnul</b> nu. Gândește-te: sistemul cedează sau primește căldură? ';
      else if (res.state === 'unit') msg = '<b>Aproape.</b> Pare o problemă de <b>unități</b> (kJ ↔ J, kg ↔ g, kcal ↔ cal). Verifică în ce unitate ți se cere răspunsul. ';
      else if (q.t === 'num') msg = '<b>Nu încă.</b> Verifică datele, unitățile și rotunjirea. ';
      else if (q.t === 'match') msg = '<b>Unele perechi nu sunt corecte.</b> ';
      else if (res.score > 0) msg = '<b>Parțial corect.</b> ';
      else msg = '<b>Nu e corect.</b> ';
      var extra = '';
      if (reveal && q.t === 'num') extra += '<div class="qn-ans">Răspuns: <b>' + T.fmt(q.a, q.dec == null ? 3 : q.dec) + '</b>' + (q.unit ? ' ' + q.unit : '') + '</div>';
      if (reveal && q.t === 'match') extra += '<div class="qn-ans">' + q.pairs.map(function (p) { return p[0] + ' → <b>' + p[1] + '</b>'; }).join('<br>') + '</div>';
      if (reveal && q.why) extra += '<div class="qn-why">' + q.why + '</div>';
      fb.className = 'qn-fb ' + cls;
      fb.innerHTML = T.rich(msg + extra);
      fb.hidden = false;
    }

    api.check = function () {
      if (state.done && mode === 'instant') return state.result;
      var res = api.evaluate();
      if (res.state === 'empty') { showFb(res, false); return res; }
      var firstTime = state.first === null;
      if (firstTime) { state.first = res; }
      api.mark(res);
      var lock = (q.t !== 'num') || res.correct;
      if (lock) state.done = true;
      state.result = res;
      showFb(res, lock || mode === 'deferred');
      root.classList.toggle('is-ok', !!res.correct);
      root.classList.toggle('is-bad', !res.correct);
      if (btnCheck) btnCheck.hidden = state.done;
      if (btnShow) btnShow.hidden = state.done || q.t !== 'num';
      if (btnRetry) btnRetry.hidden = !(state.done && !res.correct && q.t !== 'num');
      if (firstTime && o.onResult) o.onResult(res, api);
      return res;
    };
    api.reveal = function () {
      if (q.t === 'num' && ui.inp && !ui.inp.value) { /* arată doar răspunsul */ }
      var res = state.result || { correct: false, score: 0, state: 'x' };
      state.done = true;
      if (state.first === null) { state.first = { correct: false, score: 0, state: 'shown' }; if (o.onResult) o.onResult(state.first, api); }
      showFb(res, true);
      fb.className = 'qn-fb bad';
      fb.innerHTML = T.rich('<div class="qn-ans">Răspuns: <b>' + T.fmt(q.a, q.dec == null ? 3 : q.dec) + '</b>' + (q.unit ? ' ' + q.unit : '') + '</div>' + (q.why ? '<div class="qn-why">' + q.why + '</div>' : ''));
      if (btnCheck) btnCheck.hidden = true;
      if (btnShow) btnShow.hidden = true;
    };
    api.reset = function () {
      state = { done: false, first: null, result: null };
      api.unmark();
      fb.hidden = true; fb.innerHTML = '';
      root.classList.remove('is-ok', 'is-bad');
      if (ui.inp) ui.inp.value = '';
      if (btnCheck) btnCheck.hidden = false;
      if (btnShow) btnShow.hidden = q.t !== 'num';
      if (btnRetry) btnRetry.hidden = true;
    };
    api.lock = function () {
      state.done = true;
      if (ui.inp) ui.inp.disabled = true;
      if (ui.btns) ui.btns.forEach(function (b) { b.disabled = true; });
      if (ui.sels) ui.sels.forEach(function (s) { s.disabled = true; });
    };
    api.isDone = function () { return state.done; };
    api.first = function () { return state.first; };

    var btnCheck = null, btnShow = null, btnRetry = null;
    if (mode === 'instant') {
      btnCheck = T.h('button', { type: 'button', class: 'btn primary', text: 'Verifică', onclick: function () { api.check(); } });
      actions.append(btnCheck);
      if (q.t === 'num') {
        btnShow = T.h('button', { type: 'button', class: 'btn ghost', text: 'Arată răspunsul', onclick: function () { api.reveal(); } });
        actions.append(btnShow);
      }
      btnRetry = T.h('button', { type: 'button', class: 'btn ghost', text: 'Încearcă din nou', hidden: true, onclick: function () { api.unmark(); fb.hidden = true; state.done = false; root.classList.remove('is-ok', 'is-bad'); btnCheck.hidden = false; btnRetry.hidden = true; } });
      actions.append(btnRetry);
      root.append(actions);
    }
    root.append(fb);
    return api;
  };

  /* ---------- quiz pe capitole ---------- */
  T.mountQuiz = function (el, id) {
    var list = T.quizData[id];
    if (!list || !list.length) { el.append(T.h('p', { class: 'wd-err', text: 'Întrebări în curs de pregătire.' })); return; }
    var results = {}, qs = [];
    var best = T.store.get('quiz.' + id + '.best', null);
    var score = T.h('span', { class: 'quiz-score', 'aria-live': 'polite' });
    var head = T.h('div', { class: 'quiz-head' },
      T.h('div', null, T.h('span', { class: 'wd-badge', text: 'Verifică-te' }), T.h('b', { class: 'quiz-title', text: ' Întrebări' })),
      score);
    var body = T.h('div', { class: 'quiz-body' });
    var foot = T.h('div', { class: 'quiz-foot', hidden: true });
    function upd() {
      var done = Object.keys(results).length, good = 0;
      Object.keys(results).forEach(function (k) { good += results[k].score >= 1 ? 1 : 0; });
      score.textContent = good + ' corecte din ' + list.length + (done < list.length ? ' · răspunse ' + done : '');
      if (done === list.length) {
        foot.hidden = false;
        var pct = Math.round(100 * good / list.length);
        var msg = pct === 100 ? 'Perfect — ai înțeles capitolul.' : pct >= 70 ? 'Bine! Recitește explicațiile la întrebările greșite.' : 'Mai ai de lucru — reia lecția, apoi încearcă din nou.';
        foot.innerHTML = '';
        foot.append(T.h('div', { class: 'quiz-sum ' + (pct >= 70 ? 'ok' : 'bad') }, T.h('b', { text: good + ' / ' + list.length + ' (' + pct + '%)' }), T.h('span', { text: ' — ' + msg })));
        var prev = T.store.get('quiz.' + id + '.best', -1);
        if (pct > prev) T.store.set('quiz.' + id + '.best', pct);
        T.store.set('quiz.' + id + '.last', pct);
      }
    }
    function build() {
      body.replaceChildren(); qs = []; results = {}; foot.hidden = true;
      list.forEach(function (q, i) {
        var api = T.Q.create(q, { num: i + 1, onResult: function (res) { results[i] = res; upd(); } });
        qs.push(api); body.append(api.el);
      });
      upd();
    }
    var again = T.h('button', { type: 'button', class: 'btn small ghost', text: 'Reia quiz-ul', onclick: function () { build(); } });
    head.append(again);
    if (best != null && best >= 0) head.append(T.h('span', { class: 'quiz-best', text: 'Cel mai bun: ' + best + '%' }));
    el.classList.add('quiz');
    el.replaceChildren(head, body, foot);
    build();
  };

  /* ---------- mini-verificări în text ---------- */
  // T.mq('întrebare', ['opt1', 'opt2'], indexCorect, 'explicație')
  T.mq = function (q, opts, a, why) {
    var h = '<div class="mq" data-a="' + a + '"><div class="mq-q"><span class="mq-tag">Gândește-te</span> ' + q + '</div><div class="mq-opts">';
    opts.forEach(function (o, i) { h += '<button type="button" class="opt" data-i="' + i + '"><span class="opt-k">' + LETTERS[i] + '</span><span class="opt-t">' + o + '</span></button>'; });
    return h + '</div><div class="mq-why" hidden>' + why + '</div></div>';
  };
  T.initMini = function (root) {
    root.addEventListener('click', function (e) {
      var b = e.target.closest('.mq .opt'); if (!b) return;
      var mq = b.closest('.mq'); if (mq.dataset.done) return;
      mq.dataset.done = '1';
      var a = +mq.dataset.a, i = +b.dataset.i;
      T.$$('.opt', mq).forEach(function (x) {
        var xi = +x.dataset.i; x.disabled = true;
        if (xi === a) x.classList.add('ok');
        else if (xi === i) x.classList.add('bad');
      });
      var why = T.$('.mq-why', mq); why.hidden = false; why.classList.add(i === a ? 'ok' : 'bad');
      why.innerHTML = '<b>' + (i === a ? 'Corect. ' : 'Nu chiar. ') + '</b>' + why.innerHTML;
    });
  };

  /* ---------- montare generală ---------- */
  T.mountAll = function (root) {
    T.rawRoot = root;
    T.mountWidgets(root);
    T.$$('[data-quiz]', root).forEach(function (el) { if (!el.dataset.mounted) { el.dataset.mounted = '1'; T.mountQuiz(el, el.dataset.quiz); } });
    if (T.mountProblems) T.mountProblems(root);
  };
})(typeof window !== 'undefined' ? window : globalThis);
