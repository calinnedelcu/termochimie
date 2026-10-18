/* =========================================================
   widgets-calor.js — calculator de formule, curba de încălzire
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  function pnum(inp) { var c = T.parseNum(inp.value); return c.length ? c[0] : NaN; }

  /* ---------------------------------------------------------
     Laborator de calorimetrie: rearanjează formula
     --------------------------------------------------------- */
  var REL = [
    { id: 'mc', tab: 'Q = m·c·ΔT', fac: ['m', 'c', 'dT'], nm: { m: ['m', 'g'], c: ['c', 'J/(g·K)'], dT: ['ΔT', 'K'] }, def: { m: 200, c: 4.184, dT: 60 } },
    { id: 'C', tab: 'Q = C·ΔT', fac: ['C', 'dT'], nm: { C: ['C', 'J/K'], dT: ['ΔT', 'K'] }, def: { C: 836.8, dT: 60 } },
    { id: 'Cm', tab: 'Q = ν·c_m·ΔT', fac: ['n', 'Cm', 'dT'], nm: { n: ['ν', 'mol'], Cm: ['c_m', 'J/(mol·K)'], dT: ['ΔT', 'K'] }, def: { n: 2, Cm: 75.3, dT: 60 } },
    { id: 'lam', tab: 'Q = m·λ', fac: ['m', 'lam'], nm: { m: ['m', 'g'], lam: ['λ', 'J/g'] }, def: { m: 10, lam: 334 } }
  ];
  var SUBST = [['apă (din caiet)', 4.184], ['sodiu, solid (din caiet)', 1.23]];

  T.widget('calcLab', function (el) {
    var body = T.shell(el, {
      title: 'Laboratorul formulelor: Q, m, c, ΔT',
      help: 'Alege relația și necunoscuta. Completează restul datelor — vezi cum se „rearanjează” formula și ce rezultat dă.'
    });
    var cur = REL[0], unk = 'Q', Qunit = 'J';
    var relSeg, unkSeg, inputs = {}, box = T.h('div', { class: 'wd-ctrl' }), out = T.h('div', { class: 'wd-out' });

    function build() {
      var vars = ['Q'].concat(cur.fac);
      if (vars.indexOf(unk) < 0) unk = 'Q';
      unkSeg = T.seg(vars.map(function (k) { return { v: k, label: '$' + (k === 'Q' ? 'Q' : cur.nm[k][0]) + '$' }; }), unk, function (v) { unk = v; build(); }, 'Necunoscuta');
      box.replaceChildren();
      box.append(T.h('div', { class: 'wd-row' }, T.h('label', { text: 'Ce vrei să afli?' }), unkSeg));
      inputs = {};
      var rows = [];
      vars.forEach(function (k) {
        if (k === unk) return;
        var label = k === 'Q' ? 'Q' : cur.nm[k][0], unit = k === 'Q' ? '' : cur.nm[k][1];
        var v0 = k === 'Q' ? T.sig(cur.id === 'mc' ? 50208 : cur.id === 'C' ? 50208 : cur.id === 'Cm' ? 9036 : 3340, 6) : cur.def[k];
        var inp = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: T.fmt(v0, 4), 'aria-label': label });
        inp.addEventListener('input', calc);
        inputs[k] = inp;
        var extra = null;
        if (k === 'Q') {
          var sel = T.h('select', { class: 'inp sm', 'aria-label': 'Unitatea lui Q' }, ['J', 'kJ'].map(function (u) { return T.h('option', { value: u, text: u, selected: u === Qunit ? true : null }); }));
          sel.addEventListener('change', function () { Qunit = sel.value; calc(); });
          extra = sel;
        } else extra = T.h('span', { class: 'unit', html: unit });
        var rowEl = T.h('div', { class: 'wd-row' }, T.h('label', { html: '$' + label + '$ =' }), inp, extra);
        if (cur.id === 'mc' && k === 'c') {
          var ps = T.h('select', { class: 'inp sm', style: { maxWidth: '170px' }, 'aria-label': 'Substanță' }, [T.h('option', { value: '', text: 'alege substanța…' })].concat(SUBST.map(function (s) { return T.h('option', { value: s[1], text: s[0] + ' (' + T.fmt(s[1], 3) + ')' }); })));
          ps.addEventListener('change', function () { if (ps.value) { inp.value = T.fmt(+ps.value, 3); calc(); } });
          rowEl.append(ps);
        }
        rows.push(rowEl);
      });
      rows.forEach(function (r) { box.append(r); });
      calc();
    }

    function calc() {
      var vals = {}, bad = false;
      Object.keys(inputs).forEach(function (k) { var v = pnum(inputs[k]); if (!isFinite(v)) bad = true; vals[k] = v; });
      if (bad) { out.className = 'wd-out'; out.textContent = 'Completează toate câmpurile cu numere.'; return; }
      var f = cur.fac, res, formula, expr, shown;
      var sym = function (k) { return k === 'Q' ? 'Q' : cur.nm[k][0]; };
      var Qj = function () { return vals.Q * (Qunit === 'kJ' ? 1000 : 1); };
      if (unk === 'Q') {
        res = f.reduce(function (p, k) { return p * vals[k]; }, 1);
        formula = 'Q = ' + f.map(sym).join('·');
        expr = 'Q = ' + f.map(function (k) { return T.fmt(vals[k], 4); }).join(' · ') + ' = ' + T.fmt(res, 4) + ' J';
        shown = T.fmt(res, 4) + ' J = ' + T.fmt(res / 1000, 5) + ' kJ';
      } else {
        var others = f.filter(function (k) { return k !== unk; });
        var prod = others.reduce(function (p, k) { return p * vals[k]; }, 1);
        res = Qj() / prod;
        formula = sym(unk) + ' = (Q)//(' + others.map(sym).join('·') + ')';
        expr = sym(unk) + ' = (' + T.fmt(Qj(), 4) + ' J)//(' + others.map(function (k) { return T.fmt(vals[k], 4); }).join(' · ') + ') = ' + T.fmt(res, 4);
        shown = T.fmt(res, 4) + ' ' + cur.nm[unk][1];
      }
      out.className = 'wd-out ok';
      out.innerHTML = T.rich('<div>Formula rearanjată: <b>$' + formula + '$</b></div><div style="margin-top:6px">Cu datele tale: $' + expr + '$</div>' +
        '<div style="margin-top:6px">Rezultat: <b class="big">' + shown + '</b></div>' +
        (unk !== 'Q' && Qunit === 'kJ' ? '<div class="muted" style="margin-top:4px">Q l-ai dat în kJ; formula se calculează cu J (1 kJ = 1000 J), de aceea apare convertit.</div>' : ''));
    }

    relSeg = T.seg(REL.map(function (r) { return { v: r.id, label: '$' + r.tab + '$' }; }), cur.id, function (v) { cur = REL.find(function (r) { return r.id === v; }); unk = 'Q'; build(); }, 'Relația');
    body.append(T.h('div', { class: 'wd-row' }, T.h('label', { text: 'Relația:' }), relSeg), box, out);
    build();
  });

  /* ---------------------------------------------------------
     Curba de încălzire (T în funcție de căldura primită)
     --------------------------------------------------------- */
  var PRESETS = {
    sodiu: {
      name: 'Sodiu (Tema 8)', m: 10, mMax: 50, T0: 20,
      segs: function () { return [{ k: 'heat', T0: 20, T1: 98, c: 1.23, st: 'solid' }, { k: 'melt', T: 98, lam: 2600 / 23, lamMol: 2600, M: 23, st: 'topire' }]; },
      note: 'Datele din Tema 8 (sodiu): $c = 1,23 J/(g·K)$ (sodiu solid), de la 20 °C până la 98 °C, apoi topirea, cu $λ = 2,6 kJ/mol$ (pe mol, $M = 23 g/mol$). În caiet: $Q = m·c·ΔT + ν·λ$.'
    }
  };

  T.widget('heatingCurve', function (el) {
    var body = T.shell(el, {
      title: 'Curba de încălzire: temperatura în funcție de căldura primită',
      help: 'Cât timp temperatura crește, folosești $Q = m·c·ΔT$. Cât timp se schimbă starea, temperatura rămâne constantă și folosești $Q = ν·λ$ (λ dat pe mol). Mută cursorul „căldura primită”.'
    });
    var pre = 'sodiu', m = PRESETS.sodiu.m, frac = 0.55;
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' }), tbl = T.h('div', { class: 'tbl-wrap' }), note = T.h('p', { class: 'muted' });
    var mSl, qSl;

    function compute() {
      var P = PRESETS[pre], segs = P.segs(), cum = 0, T0 = P.T0, pts = [{ q: 0, t: T0 }];
      segs.forEach(function (s) {
        if (s.k === 'heat') { s.Q = m * s.c * (s.T1 - s.T0); s.q0 = cum; cum += s.Q; pts.push({ q: cum, t: s.T1 }); }
        else { s.Q = m * s.lam; s.q0 = cum; cum += s.Q; pts.push({ q: cum, t: s.T }); }
        s.q1 = cum;
      });
      return { P: P, segs: segs, pts: pts, tot: cum };
    }

    function draw() {
      var C = compute(), P = C.P, tot = C.tot, Q = frac * tot;
      var Tmin = Math.min.apply(null, C.pts.map(function (p) { return p.t; })), Tmax = Math.max.apply(null, C.pts.map(function (p) { return p.t; }));
      Tmin = Math.floor((Tmin - 10) / 10) * 10; Tmax = Math.ceil((Tmax + 10) / 10) * 10;
      var X0 = 70, X1 = 540, Y0 = 250, Y1 = 24;
      var X = function (q) { return X0 + (X1 - X0) * q / tot; }, Y = function (t) { return Y0 - (Y0 - Y1) * (t - Tmin) / (Tmax - Tmin); };
      var kJ = tot >= 5000, qs = kJ ? 1000 : 1, qu = kJ ? 'kJ' : 'J';
      var s = '<svg viewBox="0 0 580 300" role="img" aria-label="Curba de încălzire">' + T.svgs.defs('hc');
      s += '<line class="ed-ax" x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="12" marker-end="url(#hc-ink)"/><line class="ed-ax" x1="' + X0 + '" y1="' + Y0 + '" x2="568" y2="' + Y0 + '" marker-end="url(#hc-ink)"/>';
      s += '<text class="ed-t b" x="' + (X0 - 8) + '" y="18" text-anchor="end">t (°C)</text><text class="ed-t m" x="560" y="' + (Y0 + 44) + '" text-anchor="end">Q primită (' + qu + ')</text>';
      var stepT = (Tmax - Tmin) <= 60 ? 10 : (Tmax - Tmin) <= 130 ? 20 : 25;
      var special = C.segs.filter(function (sg) { return sg.k === 'melt'; }).map(function (sg) { return sg.T; });
      for (var tt = Math.ceil(Tmin / stepT) * stepT; tt <= Tmax; tt += stepT) {
        var clash = special.some(function (sp) { return Math.abs(sp - tt) < 8; });
        s += '<line class="ed-guide" x1="' + X0 + '" y1="' + Y(tt) + '" x2="' + X1 + '" y2="' + Y(tt) + '" opacity=".35"/>' + (clash ? '' : '<text class="ed-t m" x="' + (X0 - 8) + '" y="' + (Y(tt) + 4) + '" text-anchor="end">' + tt + '</text>');
      }
      special.forEach(function (sp) { s += '<text class="ed-t b" x="' + (X0 - 8) + '" y="' + (Y(sp) + 4) + '" text-anchor="end">' + sp + '</text>'; });
      var rawStep = tot / qs / 5, mag = Math.pow(10, Math.floor(Math.log10(rawStep))), nmv = rawStep / mag;
      var qStep = (nmv <= 1 ? 1 : nmv <= 2 ? 2 : nmv <= 5 ? 5 : 10) * mag;
      for (var qd = 0; qd <= tot / qs + 1e-9; qd += qStep) {
        var qv = qd * qs;
        s += '<line class="ed-tick" x1="' + X(qv) + '" y1="' + Y0 + '" x2="' + X(qv) + '" y2="' + (Y0 + 5) + '"/><text class="ed-t m" x="' + X(qv) + '" y="' + (Y0 + 20) + '" text-anchor="middle">' + T.fmt(qd, qs > 1 ? 1 : 0) + '</text>';
      }
      C.segs.forEach(function (sg) {
        var a = { x: X(sg.q0), y: Y(sg.k === 'heat' ? sg.T0 : sg.T) }, b = { x: X(sg.q1), y: Y(sg.k === 'heat' ? sg.T1 : sg.T) };
        s += '<line class="hc-seg ' + (sg.k === 'melt' ? 'plateau' : '') + '" x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '"/>';
        var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (sg.k === 'melt') s += T.viz.pill(mx, my - 26, 'topire · t° constantă', { tone: 'warn', w: 176, lower: true, h: 26 });
        else s += T.viz.pill(mx + 52, my + 30, 'se încălzește (solid)', { tone: 'ink', w: 176, lower: true, h: 26 });
      });
      // markerul curent
      var cur = locate(C, Q);
      s += '<line class="ed-guide" x1="' + X(Q) + '" y1="' + Y0 + '" x2="' + X(Q) + '" y2="' + Y(cur.t) + '"/><line class="ed-guide" x1="' + X0 + '" y1="' + Y(cur.t) + '" x2="' + X(Q) + '" y2="' + Y(cur.t) + '"/>';
      s += '<circle class="hc-dot" cx="' + X(Q) + '" cy="' + Y(cur.t) + '" r="7"/>';
      holder.innerHTML = s + '</svg>';

      out.className = 'wd-out endo';
      out.innerHTML = T.rich('<b>Q = ' + T.fmt(Q / qs, 3) + ' ' + qu + '</b> ⟹ t = <b>' + T.fmt(cur.t, 1) + ' °C</b> · ' + cur.text);

      var rows = C.segs.map(function (sg, i) {
        var f = sg.k === 'heat' ? '$Q_' + (i + 1) + ' = m·c·ΔT = ' + T.fmt(m, 2) + ' · ' + T.fmt(sg.c, 3) + ' · ' + T.fmt(sg.T1 - sg.T0, 1) + '$' : '$Q_' + (i + 1) + ' = ν·λ = (' + T.fmt(m, 2) + ')//(' + sg.M + ') · ' + T.fmt(sg.lamMol, 0) + '$';
        return '<tr><td>' + sg.st + '</td><td>' + f + '</td><td class="c"><b>' + T.fmt(sg.Q, 1) + ' J</b></td></tr>';
      }).join('');
      tbl.innerHTML = T.rich('<table class="tbl"><thead><tr><th>Etapa</th><th>Calcul</th><th class="c">Căldura</th></tr></thead><tbody>' + rows +
        '<tr><td colspan="2"><b>Total</b> (suma căldurilor)</td><td class="c"><b>' + T.fmt(tot, 1) + ' J = ' + T.fmt(tot / 1000, 3) + ' kJ</b></td></tr></tbody></table>');
      note.innerHTML = T.rich(P.note);
    }

    function locate(C, Q) {
      for (var i = 0; i < C.segs.length; i++) {
        var sg = C.segs[i];
        if (Q <= sg.q1 + 1e-9 || i === C.segs.length - 1) {
          var f = sg.Q ? T.clamp((Q - sg.q0) / sg.Q, 0, 1) : 0;
          if (sg.k === 'heat') {
            var t = sg.T0 + f * (sg.T1 - sg.T0);
            return { t: t, plateau: false, text: 'se încălzește (' + sg.st + '); temperatura crește pe măsură ce primește căldură.' };
          }
          var pct = Math.round(f * 100);
          return { t: sg.T, plateau: true, text: sg.st + ' în curs: ' + pct + '% din substanță și-a schimbat starea; <b>temperatura rămâne constantă</b>.' };
        }
      }
      return { t: 0, text: '' };
    }

        mSl = T.slider({ label: 'Masa m', min: 1, max: PRESETS.sodiu.mMax, step: 1, value: m, unit: 'g', onInput: function (v) { m = v; draw(); } });
    qSl = T.slider({ label: 'Căldura primită (% din total)', min: 0, max: 100, step: 1, value: Math.round(frac * 100), unit: '%', onInput: function (v) { frac = v / 100; draw(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, mSl, qSl), holder, out, tbl, note);
    draw();
  });
})(window);
