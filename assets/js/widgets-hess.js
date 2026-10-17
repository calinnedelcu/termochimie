/* =========================================================
   widgets-hess.js — căldura de formare, stabilitate,
   legea lui Hess (ciclu + combinator de ecuații)
   + date: T.HF (entalpii de formare), T.HESS (exerciții)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  /* ---------- entalpii standard de formare (kJ/mol), valori uzuale de manual ---------- */
  T.HF = {
    'CO2(g)': -393.5, 'CO(g)': -110.5, 'H2O(l)': -285.8, 'H2O(g)': -241.8, 'CH4(g)': -74.8, 'C2H6(g)': -84.7,
    'C2H4(g)': 52.3, 'C2H2(g)': 226.7, 'NH3(g)': -46.1, 'NO(g)': 90.3, 'NO2(g)': 33.2, 'SO2(g)': -296.8,
    'SO3(g)': -395.7, 'HCl(g)': -92.3, 'CaO(s)': -635.1, 'CaCO3(s)': -1206.9, 'Al2O3(s)': -1675.7,
    'Fe2O3(s)': -824.2, 'MgO(s)': -601.8, 'CH3OH(l)': -238.6, 'C2H5OH(l)': -277.7,
    'O2(g)': 0, 'H2(g)': 0, 'N2(g)': 0, 'C(s)': 0, 'Al(s)': 0, 'Fe(s)': 0, 'Mg(s)': 0, 'S(s)': 0, 'Cl2(g)': 0, 'Ca(s)': 0
  };

  /* ---------- exerciții Hess ----------
     eqs: ecuații date, cu cheia (substanța care „decide” multiplicatorul) și multiplicatorul corect m.
     ΔH ținta = Σ m_i · ΔH_i */
  function E(L, R, dH, key, m) { return { L: L, R: R, dH: dH, key: key, m: m }; }
  T.HESS = [
    {
      id: 'metanol', name: 'Sinteza metanolului (din caiet)',
      target: { L: [[1, 'CO(g)'], [2, 'H2(g)']], R: [[1, 'CH3OH(l)']] },
      eqs: [E([[1, 'CO(g)'], [0.5, 'O2(g)']], [[1, 'CO2(g)']], -283, 'CO(g)', 1),
        E([[1, 'CH3OH(l)'], [1.5, 'O2(g)']], [[1, 'CO2(g)'], [2, 'H2O(l)']], -726.5, 'CH3OH(l)', -1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 2)]
    },
    {
      id: 'metan', name: 'Formarea metanului din elemente',
      target: { L: [[1, 'C(s)'], [2, 'H2(g)']], R: [[1, 'CH4(g)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 2),
        E([[1, 'CH4(g)'], [2, 'O2(g)']], [[1, 'CO2(g)'], [2, 'H2O(l)']], -890.3, 'CH4(g)', -1)]
    },
    {
      id: 'co', name: 'Formarea monoxidului de carbon',
      target: { L: [[1, 'C(s)'], [0.5, 'O2(g)']], R: [[1, 'CO(g)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 1),
        E([[1, 'CO(g)'], [0.5, 'O2(g)']], [[1, 'CO2(g)']], -283, 'CO(g)', -1)]
    },
    {
      id: 'etena', name: 'Hidrogenarea etenei',
      target: { L: [[1, 'C2H4(g)'], [1, 'H2(g)']], R: [[1, 'C2H6(g)']] },
      eqs: [E([[1, 'C2H4(g)'], [3, 'O2(g)']], [[2, 'CO2(g)'], [2, 'H2O(l)']], -1411, 'C2H4(g)', 1),
        E([[1, 'C2H6(g)'], [3.5, 'O2(g)']], [[2, 'CO2(g)'], [3, 'H2O(l)']], -1560, 'C2H6(g)', -1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 1)]
    },
    {
      id: 'acetilena', name: 'Formarea acetilenei din elemente',
      target: { L: [[2, 'C(s)'], [1, 'H2(g)']], R: [[1, 'C2H2(g)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 2),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 1),
        E([[1, 'C2H2(g)'], [2.5, 'O2(g)']], [[2, 'CO2(g)'], [1, 'H2O(l)']], -1299.6, 'C2H2(g)', -1)]
    },
    {
      id: 'so3', name: 'Oxidarea dioxidului de sulf',
      target: { L: [[1, 'SO2(g)'], [0.5, 'O2(g)']], R: [[1, 'SO3(g)']] },
      eqs: [E([[1, 'S(s)'], [1, 'O2(g)']], [[1, 'SO2(g)']], -296.8, 'SO2(g)', -1),
        E([[1, 'S(s)'], [1.5, 'O2(g)']], [[1, 'SO3(g)']], -395.7, 'SO3(g)', 1)]
    },
    {
      id: 'etanol', name: 'Formarea etanolului din elemente',
      target: { L: [[2, 'C(s)'], [3, 'H2(g)'], [0.5, 'O2(g)']], R: [[1, 'C2H5OH(l)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 2),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 3),
        E([[1, 'C2H5OH(l)'], [3, 'O2(g)']], [[2, 'CO2(g)'], [3, 'H2O(l)']], -1367, 'C2H5OH(l)', -1)]
    },
    {
      id: 'gazapa', name: 'Gazul de apă (cărbune + vapori)',
      target: { L: [[1, 'C(s)'], [1, 'H2O(g)']], R: [[1, 'CO(g)'], [1, 'H2(g)']] },
      eqs: [E([[1, 'C(s)'], [0.5, 'O2(g)']], [[1, 'CO(g)']], -110.5, 'CO(g)', 1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(g)']], -241.8, 'H2O(g)', -1)]
    },
    {
      id: 'calcar', name: 'Descompunerea carbonatului de calciu',
      target: { L: [[1, 'CaCO3(s)']], R: [[1, 'CaO(s)'], [1, 'CO2(g)']] },
      eqs: [E([[1, 'Ca(s)'], [0.5, 'O2(g)']], [[1, 'CaO(s)']], -635.1, 'CaO(s)', 1),
        E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'CO2(g)', 1),
        E([[1, 'Ca(s)'], [1, 'C(s)'], [1.5, 'O2(g)']], [[1, 'CaCO3(s)']], -1206.9, 'CaCO3(s)', -1)]
    }
  ];

  /** coeficienții netti ai unei sume ponderate de ecuații: {specie: coef (+ produși, − reactanți)} */
  T.netOf = function (eqs, mult) {
    var net = {};
    eqs.forEach(function (e, i) {
      var m = mult[i]; if (!m) return;
      e.R.forEach(function (p) { net[p[1]] = (net[p[1]] || 0) + m * p[0]; });
      e.L.forEach(function (p) { net[p[1]] = (net[p[1]] || 0) - m * p[0]; });
    });
    Object.keys(net).forEach(function (k) { if (Math.abs(net[k]) < 1e-9) delete net[k]; });
    return net;
  };
  T.targetNet = function (t) {
    var net = {};
    t.R.forEach(function (p) { net[p[1]] = (net[p[1]] || 0) + p[0]; });
    t.L.forEach(function (p) { net[p[1]] = (net[p[1]] || 0) - p[0]; });
    return net;
  };
  T.sameNet = function (a, b) {
    var ks = Object.keys(a).concat(Object.keys(b));
    return ks.every(function (k) { return Math.abs((a[k] || 0) - (b[k] || 0)) < 1e-9; });
  };
  function eqOf(L, R) { return L.map(function (p) { return T.coef(p[0]) + p[1]; }).join(' + ') + ' -> ' + R.map(function (p) { return T.coef(p[0]) + p[1]; }).join(' + '); }
  T.hessEqStr = function (e) { return '[[' + eqOf(e.L, e.R) + ']]'; };
  T.hessNetStr = function (net, order) {
    var keys = Object.keys(net).sort(function (a, b) { var ia = order.indexOf(a), ib = order.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
    var L = [], R = [];
    keys.forEach(function (k) { (net[k] < 0 ? L : R).push([Math.abs(net[k]), k]); });
    if (!L.length && !R.length) return 'ecuația nulă (0 = 0)';
    return '[[' + (L.length ? eqOf(L, R) : '? -> ' + R.map(function (p) { return T.coef(p[0]) + p[1]; }).join(' + ')) + ']]';
  };
  T.hessOrder = function (t) { return t.L.concat(t.R).map(function (p) { return p[1]; }); };

  /** explicația multiplicatorului unei ecuații, pe baza substanței-cheie */
  T.hessWhy = function (e, lab, tnet) {
    var k = e.key, tc = tnet[k] || 0, ec = 0;
    e.R.forEach(function (p) { if (p[1] === k) ec += p[0]; });
    e.L.forEach(function (p) { if (p[1] === k) ec -= p[0]; });
    var m = tc / ec;
    return '<b>' + lab + '</b>: [[' + k + ']] este în țintă ' + (tc < 0 ? 'la <b>reactanți</b>' : 'la <b>produși</b>') + ' (coeficient ' + T.fmt(Math.abs(tc), 1) + '), iar în ecuația ' + lab + ' este ' + (ec < 0 ? 'la reactanți' : 'la produși') + ' (coeficient ' + T.fmt(Math.abs(ec), 1) + ') ⟹ ' +
      (m < 0 ? '<b>inversezi</b>' + (Math.abs(Math.abs(m) - 1) > 1e-9 ? ' și ' : '') : '') + (Math.abs(Math.abs(m) - 1) > 1e-9 ? 'înmulțești cu <b>' + mlab(Math.abs(m)) + '</b>' : (m > 0 ? 'o păstrezi <b>așa cum e</b> (×1)' : '')) + ' ⟹ multiplicator <b>' + mlab(m) + '</b>.';
  };

  /* ---------------------------------------------------------
     Combinatorul lui Hess
     --------------------------------------------------------- */
  var MULT = [-3, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 3];
  function mlab(m) { return m === 0 ? '0' : (m < 0 ? '−' : '') + (Math.abs(m) === 0.5 ? '½' : Math.abs(m) === 1.5 ? '3/2' : T.fmt(Math.abs(m), 1)); }

  T.widget('hessCombiner', function (el, o) {
    var cfg = (o && o.eqs) ? o : T.HESS[0];
    var body = T.shell(el, {
      title: 'Combinatorul lui Hess: obține ecuația țintă',
      help: 'Pentru fiecare ecuație dată alege un multiplicator. <b>Negativ</b> = inversezi ecuația (și îi schimbi semnul lui ΔH). Adunând ecuațiile, substanțele din exces se simplifică. Scopul: să ajungi la ecuația țintă.',
      reset: function () { mult = cfg.eqs.map(function () { return 0; }); update(); }
    });
    var mult = cfg.eqs.map(function () { return 0; });
    var order = T.hessOrder(cfg.target), tnet = T.targetNet(cfg.target);
    var rows = [], hintN = 0;
    var targetBox = T.h('div', { class: 'eqn', html: '<b>Țintă:</b> ' + T.hessEqStr(cfg.target) + '&nbsp; $ΔH = ?$' });
    var list = T.h('div', { class: 'hc-list' });
    cfg.eqs.forEach(function (e, i) {
      var lab = '(' + (i + 1) + ')';
      var mEl = T.h('b', { class: 'hc-m' });
      var minus = T.h('button', { type: 'button', class: 'btn small', 'aria-label': 'Micșorează multiplicatorul ' + lab, text: '◀', onclick: function () { step(i, -1); } });
      var plus = T.h('button', { type: 'button', class: 'btn small', 'aria-label': 'Mărește multiplicatorul ' + lab, text: '▶', onclick: function () { step(i, 1); } });
      var res = T.h('div', { class: 'hc-res' });
      var row = T.h('div', { class: 'hc-row' },
        T.h('div', { class: 'hc-lab', text: lab }),
        T.h('div', { class: 'hc-eq', html: T.hessEqStr(e) + ' &nbsp;<span class="hc-dh">$ΔH_' + (i + 1) + ' = ' + T.fmt(e.dH, 1) + ' kJ$</span>' }),
        T.h('div', { class: 'hc-ctl' }, T.h('span', { class: 'muted', text: '×' }), minus, mEl, plus),
        res);
      list.append(row); rows.push({ mEl: mEl, res: res, row: row });
    });
    var sum = T.h('div', { class: 'wd-out' }), hint = T.h('div', { class: 'wd-out', hidden: true });
    function step(i, d) {
      var k = MULT.indexOf(mult[i]); k = T.clamp(k + d, 0, MULT.length - 1); mult[i] = MULT[k]; update();
    }
    function transformed(e, m) {
      if (m === 0) return null;
      var a = Math.abs(m), sc = function (arr) { return arr.map(function (p) { return [p[0] * a, p[1]]; }); };
      return m > 0 ? { L: sc(e.L), R: sc(e.R) } : { L: sc(e.R), R: sc(e.L) };
    }
    function update() {
      var totalH = 0;
      cfg.eqs.forEach(function (e, i) {
        var m = mult[i], r = rows[i];
        r.mEl.textContent = mlab(m);
        r.row.classList.toggle('off', m === 0);
        r.row.classList.toggle('rev', m < 0);
        var tr = transformed(e, m);
        if (!tr) { r.res.innerHTML = '<span class="muted">neutilizată</span>'; return; }
        totalH += m * e.dH;
        r.res.innerHTML = T.rich((m < 0 ? '<span class="chip exo">inversată</span> ' : '') + (Math.abs(m) !== 1 ? '<span class="chip">× ' + mlab(Math.abs(m)) + '</span> ' : '') + T.hessEqStr(tr) + ' &nbsp;<b>$ΔH = ' + T.fmt(m * e.dH, 2) + ' kJ$</b>');
      });
      var net = T.netOf(cfg.eqs, mult), ok = Object.keys(net).length && T.sameNet(net, tnet);
      var used = mult.some(function (m) { return m !== 0; });
      sum.className = 'wd-out ' + (ok ? 'ok' : used ? '' : '');
      if (!used) sum.innerHTML = 'Alege multiplicatori pentru a combina ecuațiile.';
      else if (ok) sum.innerHTML = T.rich('<b>Ai obținut ecuația țintă!</b><br>' + T.hessNetStr(net, order) + '<br>$ΔH = ' + mult.map(function (m, i) { return m ? (m < 0 ? '(' + T.fmt(m, 1) + ')' : T.fmt(m, 1)) + '·(' + T.fmt(cfg.eqs[i].dH, 1) + ')' : null; }).filter(Boolean).join(' + ') + ' = <b>' + T.fmt(totalH, 2) + ' kJ</b>$ ⟹ ' + (totalH < 0 ? '<b class="tag-exo">exotermă</b>' : '<b class="tag-endo">endotermă</b>') + '.');
      else {
        var diff = [];
        Object.keys(tnet).concat(Object.keys(net).filter(function (k) { return !(k in tnet); })).forEach(function (k) {
          var want = tnet[k] || 0, have = net[k] || 0, msg;
          if (Math.abs(want - have) < 1e-9) return;
          if (want === 0) msg = 'nu trebuie să apară (acum e ' + T.fmt(Math.abs(have), 1) + (have < 0 ? ' la reactanți' : ' la produși') + ')';
          else if (have === 0) msg = 'lipsește (trebuie ' + (want < 0 ? 'la reactanți' : 'la produși') + ', coeficient ' + T.fmt(Math.abs(want), 1) + ')';
          else msg = 'coeficient greșit (acum ' + T.fmt(have, 1) + ', trebuie ' + T.fmt(want, 1) + ')';
          diff.push('[[' + k + ']]: ' + msg);
        });
        sum.innerHTML = T.rich('<b>Suma ecuațiilor, după simplificare:</b><br>' + T.hessNetStr(net, order) + '<br><b>Încă nu e ținta.</b> ' + diff.join(' · ') + '<br><span class="muted">$ΔH$ parțial = ' + T.fmt(totalH, 2) + ' kJ</span>');
      }
    }
    function why(i) { return T.hessWhy(cfg.eqs[i], '(' + (i + 1) + ')', tnet); }
    var bHint = T.btn('Indiciu', function () {
      hint.hidden = false; hint.className = 'wd-out';
      if (hintN === 0) hint.innerHTML = T.rich('<b>Metodă:</b> pentru fiecare ecuație dată caută o substanță din <b>ținta</b> care apare doar în ea. Compară în ce parte (reactanți / produși) este în țintă și în ecuație; dacă diferă, o <b>inversezi</b>. Apoi potrivești coeficientul înmulțind.');
      else hint.innerHTML = T.rich('<b>Raționament:</b><br>' + cfg.eqs.map(function (e, i) { return why(i); }).join('<br>'));
      hintN++;
    }, 'ghost');
    var bSol = T.btn('Arată rezolvarea', function () {
      mult = cfg.eqs.map(function (e) { return e.m; }); update(); hint.hidden = false; hint.className = 'wd-out';
      hint.innerHTML = T.rich('<b>Raționament:</b><br>' + cfg.eqs.map(function (e, i) { return why(i); }).join('<br>'));
    }, 'ghost');
    body.append(targetBox, list, sum, T.h('div', { class: 'wd-row' }, bHint, bSol), hint);
    update();
  });

  /* ---------------------------------------------------------
     Legea lui Hess: drumul nu contează (diagrama „altitudine”)
     --------------------------------------------------------- */
  T.widget('hessCycle', function (el) {
    var body = T.shell(el, {
      title: 'Legea lui Hess: aceeași schimbare, drumuri diferite',
      help: 'Entalpia este ca o altitudine: contează doar de unde pornești și unde ajungi, nu pe ce drum mergi. Schimbă etapele și vezi că suma rămâne aceeași.'
    });
    var S = { d1: -90, d2: 40, d3: -60, d4: -120 }, id = T.uid('hy');
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    function draw() {
      var tot = S.d1 + S.d2 + S.d3, d5 = tot - S.d4;
      var lv1 = [0, S.d1, S.d1 + S.d2, tot], lv2 = [0, S.d4, tot];
      var all = lv1.concat(lv2), lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
      var pad = Math.max(30, (hi - lo) * 0.18); lo -= pad; hi += pad;
      var Yt = 40, Yb = 310, Y = function (v) { return Yb - (Yb - Yt) * (v - lo) / (hi - lo); };
      var s = '<svg viewBox="0 0 620 360" role="img" aria-label="Două drumuri de la reactanți la produși, cu aceeași variație totală de entalpie">' + T.svgs.defs(id);
      s += '<line class="ed-ax" x1="30" y1="' + Yb + '" x2="30" y2="20" marker-end="url(#' + id + '-ink)"/><text class="ed-t b" x="22" y="26" text-anchor="end">H</text>';
      function bar(x, lvl, label) { return '<line class="hy-bar" x1="' + x + '" y1="' + Y(lvl) + '" x2="' + (x + 56) + '" y2="' + Y(lvl) + '"/><text class="ed-t" x="' + (x + 28) + '" y="' + (Y(lvl) + (lvl >= 0 ? -9 : 20)) + '" text-anchor="middle">' + label + '</text>'; }
      function arr(xa, va, xb, vb, lab, cls) {
        var xm = (xa + xb) / 2, ym = (Y(va) + Y(vb)) / 2;
        return '<line class="wa ' + cls + '" x1="' + xa + '" y1="' + Y(va) + '" x2="' + xb + '" y2="' + Y(vb) + '" style="stroke-width:3px" marker-end="url(#' + id + '-' + cls + ')"/><text class="ed-t b ' + cls + '" x="' + xm + '" y="' + (ym - 8) + '" text-anchor="middle">' + lab + '</text>';
      }
      var X1 = [60, 150, 240, 330];
      s += '<text class="ed-t m" x="195" y="342" text-anchor="middle">Drumul 1 (trei etape)</text>';
      s += bar(X1[0], 0, 'A + B') + bar(X1[1], lv1[1], 'I' + '₁') + bar(X1[2], lv1[2], 'I' + '₂') + bar(X1[3], lv1[3], 'C + D');
      s += arr(X1[0] + 56, lv1[0], X1[1], lv1[1], 'ΔH₁', 'ink') + arr(X1[1] + 56, lv1[1], X1[2], lv1[2], 'ΔH₂', 'ink') + arr(X1[2] + 56, lv1[2], X1[3], lv1[3], 'ΔH₃', 'ink');
      var X2 = [430, 500, 570];
      s += '<text class="ed-t m" x="500" y="342" text-anchor="middle">Drumul 2 (două etape)</text>';
      s += bar(X2[0] - 40, 0, 'A + B') + bar(X2[1] - 34, lv2[1], "I'") + bar(X2[2] - 20, lv2[2], 'C + D');
      s += arr(X2[0] + 16, 0, X2[1] - 34, lv2[1], 'ΔH₄', 'ea') + arr(X2[1] + 22, lv2[1], X2[2] - 20, lv2[2], 'ΔH₅', 'ea');
      // săgeata directă
      s += '<line class="hy-dir" x1="388" y1="' + Y(0) + '" x2="388" y2="' + Y(tot) + '" marker-end="url(#' + id + '-' + (tot < 0 ? 'exo' : 'endo') + ')"/>';
      s += '<text class="ed-t b ' + (tot < 0 ? 'exo' : 'endo') + '" x="396" y="' + ((Y(0) + Y(tot)) / 2 + 5) + '">ΔH</text>';
      holder.innerHTML = s + '</svg>';
      var f = function (x) { return (x > 0 ? '+' : '') + T.fmt(x, 0); };
      out.className = 'wd-out ' + (tot < 0 ? 'exo' : 'endo');
      out.innerHTML = T.rich('<b>Drumul 1:</b> $ΔH = ΔH_1 + ΔH_2 + ΔH_3 = ' + f(S.d1) + ' ' + f(S.d2) + ' ' + f(S.d3) + ' = ' + f(tot) + '$ kJ<br><b>Drumul 2:</b> $ΔH = ΔH_4 + ΔH_5 = ' + f(S.d4) + ' ' + f(d5) + ' = ' + f(tot) + '$ kJ<br>Aceeași valoare! ⟹ ' + (tot < 0 ? '<b class="tag-exo">exotermă</b>' : tot > 0 ? '<b class="tag-endo">endotermă</b>' : 'efect termic nul') + ' (depinde doar de starea inițială și finală).');
    }
    var sl = [
      T.slider({ label: '$ΔH_1$', min: -150, max: 150, step: 5, value: S.d1, unit: 'kJ', dec: 0, onInput: function (v) { S.d1 = v; draw(); } }),
      T.slider({ label: '$ΔH_2$', min: -150, max: 150, step: 5, value: S.d2, unit: 'kJ', dec: 0, onInput: function (v) { S.d2 = v; draw(); } }),
      T.slider({ label: '$ΔH_3$', min: -150, max: 150, step: 5, value: S.d3, unit: 'kJ', dec: 0, onInput: function (v) { S.d3 = v; draw(); } }),
      T.slider({ label: '$ΔH_4$ (drumul 2, prima etapă)', min: -250, max: 250, step: 5, value: S.d4, unit: 'kJ', dec: 0, onInput: function (v) { S.d4 = v; draw(); } })
    ];
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, out);
    draw();
  });

  /* ---------------------------------------------------------
     Căldura de reacție din căldurile de formare
     --------------------------------------------------------- */
  var FORM = [
    { id: 'metan', name: 'Arderea metanului', L: [[1, 'CH4(g)'], [2, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(g)']] },
    { id: 'termita', name: 'Reacția aluminotermică', L: [[2, 'Al(s)'], [1, 'Fe2O3(s)']], R: [[1, 'Al2O3(s)'], [2, 'Fe(s)']] },
    { id: 'calcar', name: 'Descompunerea CaCO₃', L: [[1, 'CaCO3(s)']], R: [[1, 'CaO(s)'], [1, 'CO2(g)']] },
    { id: 'azot', name: 'Formarea NO din elemente', L: [[1, 'N2(g)'], [1, 'O2(g)']], R: [[2, 'NO(g)']] },
    { id: 'etena', name: 'Hidrogenarea etenei', L: [[1, 'C2H4(g)'], [1, 'H2(g)']], R: [[1, 'C2H6(g)']] }
  ];
  T.widget('formationCalc', function (el) {
    var body = T.shell(el, {
      title: 'ΔH reacției din căldurile de formare',
      help: '$ΔH_R = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$. Poți modifica valorile din tabel. Observă că elementele în stare standard au $ΔH_f = 0$.'
    });
    var cur = 'metan', vals = {}, nmol = 5;
    var host = T.h('div'), out = T.h('div', { class: 'wd-out' });
    function reset() { var r = FORM.find(function (x) { return x.id === cur; }); vals = {}; r.L.concat(r.R).forEach(function (p) { vals[p[1]] = T.HF[p[1]]; }); }
    function build() {
      var r = FORM.find(function (x) { return x.id === cur; });
      var sel = T.h('select', { class: 'inp', 'aria-label': 'Reacția' }, FORM.map(function (x) { return T.h('option', { value: x.id, text: x.name, selected: x.id === cur ? true : null }); }));
      sel.addEventListener('change', function () { cur = sel.value; reset(); build(); });
      var eq = T.h('div', { class: 'eqn', html: '[[' + eqOf(r.L, r.R) + ']]' });
      var tbody = T.h('tbody');
      function rowFor(side, p) {
        var inp = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: T.fmt(vals[p[1]], 1), 'aria-label': 'ΔHf ' + p[1] });
        inp.addEventListener('input', function () { var v = T.parseNum(inp.value)[0]; if (v != null) { vals[p[1]] = v; calc(); } });
        tbody.append(T.h('tr', null, T.h('td', { html: side }), T.h('td', { html: '[[' + p[1] + ']]' }), T.h('td', { class: 'c', text: T.fmt(p[0], 1) }), T.h('td', { class: 'c' }, inp)));
      }
      r.L.forEach(function (p) { rowFor('reactant', p); }); r.R.forEach(function (p) { rowFor('produs', p); });
      var tbl = T.h('div', { class: 'tbl-wrap' }, T.h('table', { class: 'tbl' }, T.h('thead', null, T.h('tr', null, T.h('th', { text: 'Rol' }), T.h('th', { text: 'Substanța' }), T.h('th', { class: 'c', html: '$ν$' }), T.h('th', { class: 'c', html: '$ΔH_f$ (kJ/mol)' }))), tbody));
      var nIn = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: String(nmol), 'aria-label': 'Numărul de moli' });
      nIn.addEventListener('input', function () { var v = T.parseNum(nIn.value)[0]; if (v != null) { nmol = v; calc(); } });
      host.replaceChildren(T.h('div', { class: 'wd-row' }, sel), eq, tbl, T.h('div', { class: 'wd-row' }, T.h('label', { html: 'Câte <b>reacții</b> (ecuația de mai sus, de ' }), nIn, T.h('label', { text: 'ori)' })));
      calc();
    }
    function calc() {
      var r = FORM.find(function (x) { return x.id === cur; });
      var P = r.R.reduce(function (s, p) { return s + p[0] * vals[p[1]]; }, 0), Rr = r.L.reduce(function (s, p) { return s + p[0] * vals[p[1]]; }, 0);
      var dH = P - Rr;
      var ps = r.R.map(function (p) { return T.fmt(p[0], 1) + '·(' + T.fmt(vals[p[1]], 1) + ')'; }).join(' + '), rs = r.L.map(function (p) { return T.fmt(p[0], 1) + '·(' + T.fmt(vals[p[1]], 1) + ')'; }).join(' + ');
      out.className = 'wd-out ' + (dH < 0 ? 'exo' : 'endo');
      out.innerHTML = T.rich('$ΔH_R = [' + ps + '] − [' + rs + '] = ' + T.fmt(P, 1) + ' − (' + T.fmt(Rr, 1) + ') = <b>' + T.fmt(dH, 1) + ' kJ</b>$ ⟹ ' + (dH < 0 ? '<b class="tag-exo">exotermă</b> ($ΔH < 0$)' : '<b class="tag-endo">endotermă</b> ($ΔH > 0$)') +
        '<br>Pentru ' + T.fmt(nmol, 2) + ' reacții: $|Q| = ' + T.fmt(nmol, 2) + ' · ' + T.fmt(Math.abs(dH), 1) + ' = ' + T.fmt(nmol * Math.abs(dH), 1) + ' kJ$ ' + (dH < 0 ? 'degajați' : 'absorbiți') + '.');
    }
    body.append(host, out);
    reset(); build();
  });

  /* ---------------------------------------------------------
     Stabilitatea substanțelor: ΔH_f în grafic
     --------------------------------------------------------- */
  var STAB = ['C2H2(g)', 'NO(g)', 'NO2(g)', 'NH3(g)', 'CH4(g)', 'HCl(g)', 'H2O(g)', 'H2O(l)', 'SO2(g)', 'CO2(g)', 'CaO(s)'];
  T.widget('stabilityChart', function (el) {
    var body = T.shell(el, {
      title: 'Cu cât ΔH_f e mai mică (mai negativă), cu atât substanța e mai stabilă',
      help: 'Apasă pe două bare ca să le compari.'
    });
    var picked = [], holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    var data = STAB.map(function (k) { return { k: k, v: T.HF[k] }; }).sort(function (a, b) { return b.v - a.v; });
    function draw() {
      var W = 600, rowH = 28, top = 14, x0 = 330, sc = 215 / 650, H = top * 2 + rowH * data.length + 22;
      var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Căldurile de formare ale unor substanțe">';
      s += '<line class="ed-ax" x1="' + x0 + '" y1="' + (top - 4) + '" x2="' + x0 + '" y2="' + (H - 22) + '"/>';
      data.forEach(function (d, i) {
        var y = top + i * rowH, w = Math.abs(d.v) * sc, on = picked.indexOf(d.k) >= 0;
        s += '<g class="sb-g' + (on ? ' on' : '') + '" data-k="' + d.k + '" tabindex="0" role="button" aria-label="' + T.uni(d.k) + '">';
        s += '<rect class="sb-hit" x="0" y="' + y + '" width="' + W + '" height="' + (rowH - 2) + '"/>';
        s += '<text class="ed-t" x="' + (x0 - 232) + '" y="' + (y + 18) + '">' + T.uni(d.k.replace(/\((s|l|g)\)$/, '')) + ' <tspan class="m">(' + d.k.match(/\((s|l|g)\)$/)[1] + ')</tspan></text>';
        s += '<rect class="sb-bar ' + (d.v < 0 ? 'exo' : 'endo') + '" x="' + (d.v < 0 ? x0 - w : x0) + '" y="' + (y + 3) + '" width="' + Math.max(2, w) + '" height="' + (rowH - 8) + '" rx="4"/>';
        s += '<text class="se-val" x="' + (d.v < 0 ? x0 - w - 6 : x0 + w + 6) + '" y="' + (y + 18) + '" text-anchor="' + (d.v < 0 ? 'end' : 'start') + '">' + T.fmt(d.v, 1) + '</text></g>';
      });
      s += '<text class="ed-t m" x="' + (x0 + 6) + '" y="' + (H - 6) + '">ΔH_f (kJ/mol)  →  mai pozitivă = mai puțin stabilă</text>';
      holder.innerHTML = s + '</svg>';
      if (picked.length === 2) {
        var a = T.HF[picked[0]], b = T.HF[picked[1]], more = a < b ? picked[0] : picked[1], less = a < b ? picked[1] : picked[0];
        out.className = 'wd-out ok';
        out.innerHTML = T.rich('[[' + more + ']] ($ΔH_f = ' + T.fmt(Math.min(a, b), 1) + '$) are $ΔH_f$ <b>mai mică</b> decât [[' + less + ']] ($' + T.fmt(Math.max(a, b), 1) + '$) ⟹ [[' + more + ']] este <b>mai stabilă</b>.');
      } else { out.className = 'wd-out'; out.textContent = picked.length ? 'Alege încă o substanță.' : 'Alege două substanțe (apasă pe bare) ca să vezi care e mai stabilă.'; }
    }
    function toggle(k) { var i = picked.indexOf(k); if (i >= 0) picked.splice(i, 1); else { if (picked.length === 2) picked.shift(); picked.push(k); } draw(); }
    holder.addEventListener('click', function (e) { var gg = e.target.closest('[data-k]'); if (gg) toggle(gg.dataset.k); });
    holder.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var gg = e.target.closest('[data-k]'); if (gg) { e.preventDefault(); toggle(gg.dataset.k); } } });
    body.append(holder, out);
    draw();
  });
})(window);
