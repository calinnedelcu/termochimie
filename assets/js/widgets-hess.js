/* =========================================================
   widgets-hess.js — căldura de formare, legea lui Hess
   (diagrama din caiet + combinator de ecuații)
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
    'Fe2O3(s)': -824.2, 'MgO(s)': -601.8, 'CH3OH(l)': -238.6, 'C2H5OH(l)': -277.7, 'C3H8(g)': -103.7, 'C6H6(l)': 49,
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
      id: 'reformare', name: 'Reformarea metanului cu vapori de apă',
      target: { L: [[1, 'CH4(g)'], [1, 'H2O(g)']], R: [[1, 'CO(g)'], [3, 'H2(g)']] },
      eqs: [E([[1, 'CH4(g)'], [2, 'O2(g)']], [[1, 'CO2(g)'], [2, 'H2O(g)']], -802.3, 'CH4(g)', 1),
        E([[1, 'CO(g)'], [0.5, 'O2(g)']], [[1, 'CO2(g)']], -283, 'CO(g)', -1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(g)']], -241.8, 'H2(g)', -3)]
    },
    {
      id: 'carbon-apa', name: 'Cărbune + vapori de apă → CO₂ + H₂',
      target: { L: [[1, 'C(s)'], [2, 'H2O(g)']], R: [[1, 'CO2(g)'], [2, 'H2(g)']] },
      eqs: [E([[1, 'C(s)'], [0.5, 'O2(g)']], [[1, 'CO(g)']], -110.5, 'C(s)', 1),
        E([[1, 'CO(g)'], [0.5, 'O2(g)']], [[1, 'CO2(g)']], -283, 'CO2(g)', 1),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(g)']], -241.8, 'H2(g)', -2)]
    },
    {
      id: 'benzen', name: 'Formarea benzenului din elemente',
      target: { L: [[6, 'C(s)'], [3, 'H2(g)']], R: [[1, 'C6H6(l)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 6),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 3),
        E([[1, 'C6H6(l)'], [7.5, 'O2(g)']], [[6, 'CO2(g)'], [3, 'H2O(l)']], -3267.4, 'C6H6(l)', -1)]
    },
    {
      id: 'propan', name: 'Formarea propanului din elemente',
      target: { L: [[3, 'C(s)'], [4, 'H2(g)']], R: [[1, 'C3H8(g)']] },
      eqs: [E([[1, 'C(s)'], [1, 'O2(g)']], [[1, 'CO2(g)']], -393.5, 'C(s)', 3),
        E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(l)']], -285.8, 'H2(g)', 4),
        E([[1, 'C3H8(g)'], [5, 'O2(g)']], [[3, 'CO2(g)'], [4, 'H2O(l)']], -2220, 'C3H8(g)', -1)]
    },
    {
      id: 'hcl', name: 'Sinteza acidului clorhidric',
      target: { L: [[1, 'H2(g)'], [1, 'Cl2(g)']], R: [[2, 'HCl(g)']] },
      eqs: [E([[1, 'H2(g)'], [0.5, 'O2(g)']], [[1, 'H2O(g)']], -241.8, 'H2(g)', 1),
        E([[4, 'HCl(g)'], [1, 'O2(g)']], [[2, 'Cl2(g)'], [2, 'H2O(g)']], -114.4, 'HCl(g)', -0.5)]
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
    var sum = T.h('div', { class: 'wd-out' }), hint = T.h('div', { class: 'wd-out', hidden: true }), board = T.h('div', { class: 'bd' });
    function boardHtml() {
      var tot = {}, keys;
      cfg.eqs.forEach(function (e, i) {
        var m = mult[i]; if (!m) return; var tr = transformed(e, m);
        tr.L.forEach(function (q) { (tot[q[1]] = tot[q[1]] || { L: 0, R: 0 }).L += q[0]; });
        tr.R.forEach(function (q) { (tot[q[1]] = tot[q[1]] || { L: 0, R: 0 }).R += q[0]; });
      });
      keys = Object.keys(tot).sort(function (a, b) { var ia = order.indexOf(a), ib = order.indexOf(b); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); });
      if (!keys.length) return '';
      var mx = Math.max.apply(null, keys.map(function (k) { return Math.max(tot[k].L, tot[k].R); }).concat([1]));
      var h = '<div class="bd-h"><span></span><span class="l">în stânga (reactanți)</span><span class="r">în dreapta (produși)</span><span></span></div>';
      keys.forEach(function (k) {
        var L = tot[k].L, R = tot[k].R, c = Math.min(L, R), lo = L - c, ro = R - c, wl = function (x) { return (x / mx * 100).toFixed(1) + '%'; };
        var want = tnet[k] || 0, have = R - L, good = Math.abs(want - have) < 1e-9;
        var st = Math.abs(L - R) < 1e-9 ? '<span class="bd-s cancel">se simplifică</span>' : lo > 0 ? '<span class="bd-s keep">rămâne ' + T.fmt(lo, 1) + ' la reactanți</span>' : '<span class="bd-s keep">rămâne ' + T.fmt(ro, 1) + ' la produși</span>';
        h += '<div class="bd-row' + (good ? ' ok' : ' no') + '"><span class="bd-f">' + T.rich('[[' + k + ']]') + '</span>' +
          '<span class="bd-l">' + (lo > 0 ? '<i class="keep" style="width:' + wl(lo) + '"></i>' : '') + (c > 0 ? '<i class="cx" style="width:' + wl(c) + '"></i>' : '') + '</span>' +
          '<span class="bd-r">' + (c > 0 ? '<i class="cx" style="width:' + wl(c) + '"></i>' : '') + (ro > 0 ? '<i class="keep" style="width:' + wl(ro) + '"></i>' : '') + '</span>' + st + '</div>';
      });
      return '<div class="bd-t">Bilanțul substanțelor (ce se simplifică și ce rămâne)</div>' + h;
    }
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
      board.innerHTML = boardHtml();
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
      if (hintN === 0) hint.innerHTML = T.rich('<b>Metodă (ca în caiet):</b> pentru fiecare substanță din țintă, găsește ecuația dată în care apare. Dacă e în partea <b>opusă</b>, o <b>inversezi</b>; apoi potrivești coeficientul înmulțind.');
      else hint.innerHTML = T.rich('<b>Raționament:</b><br>' + cfg.eqs.map(function (e, i) { return why(i); }).join('<br>'));
      hintN++;
    }, 'ghost');
    var bSol = T.btn('Arată rezolvarea', function () {
      mult = cfg.eqs.map(function (e) { return e.m; }); update(); hint.hidden = false; hint.className = 'wd-out';
      hint.innerHTML = T.rich('<b>Raționament:</b><br>' + cfg.eqs.map(function (e, i) { return why(i); }).join('<br>'));
    }, 'ghost');
    body.append(targetBox, list, sum, board, T.h('div', { class: 'wd-row' }, bHint, bSol), hint);
    update();
  });

  /* ---------------------------------------------------------
     Legea lui Hess: diagrama din caiet (A+B → I₁ → I₂ → C+D)
     --------------------------------------------------------- */
  T.widget('hessCycle', function (el) {
    var body = T.shell(el, {
      title: 'Legea lui Hess: diagrama din caiet',
      help: 'Reactanții (A + B) ajung la produși (C + D) direct, cu ΔH, sau prin stările intermediare I₁ și I₂. Schimbă etapele: ΔH este mereu suma lor.'
    });
    var S = { d1: -90, d2: 40, d3: -60 }, id = T.uid('hy');
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    function draw() {
      var tot = S.d1 + S.d2 + S.d3;
      var lv = [0, S.d1, S.d1 + S.d2, tot];
      var lo = Math.min.apply(null, lv), hi = Math.max.apply(null, lv);
      var pad = Math.max(30, (hi - lo) * 0.18); lo -= pad; hi += pad;
      var Yt = 40, Yb = 310, Y = function (v) { return Yb - (Yb - Yt) * (v - lo) / (hi - lo); };
      var s = '<svg viewBox="0 0 520 360" role="img" aria-label="Reactanții ajung la produși direct sau prin stări intermediare, cu aceeași variație totală de entalpie">' + T.svgs.defs(id);
      s += '<line class="ed-ax" x1="30" y1="' + Yb + '" x2="30" y2="20" marker-end="url(#' + id + '-ink)"/><text class="ed-t b" x="22" y="26" text-anchor="end">H</text>';
      function bar(x, lvl, label) { return '<line class="hy-bar" x1="' + x + '" y1="' + Y(lvl) + '" x2="' + (x + 56) + '" y2="' + Y(lvl) + '"/><text class="ed-t" x="' + (x + 28) + '" y="' + (Y(lvl) + (lvl >= 0 ? -9 : 20)) + '" text-anchor="middle">' + label + '</text>'; }
      function arr(xa, va, xb, vb, lab, cls) {
        var xm = (xa + xb) / 2, ym = (Y(va) + Y(vb)) / 2;
        return '<line class="wa ' + cls + '" x1="' + xa + '" y1="' + Y(va) + '" x2="' + xb + '" y2="' + Y(vb) + '" style="stroke-width:3px" marker-end="url(#' + id + '-' + cls + ')"/><text class="ed-t b ' + cls + '" x="' + xm + '" y="' + (ym - 8) + '" text-anchor="middle">' + lab + '</text>';
      }
      var X = [60, 160, 260, 360];
      s += bar(X[0], 0, 'A + B') + bar(X[1], lv[1], 'I' + '₁') + bar(X[2], lv[2], 'I' + '₂') + bar(X[3], lv[3], 'C + D');
      s += arr(X[0] + 56, lv[0], X[1], lv[1], 'ΔH₁', 'ink') + arr(X[1] + 56, lv[1], X[2], lv[2], 'ΔH₂', 'ink') + arr(X[2] + 56, lv[2], X[3], lv[3], 'ΔH₃', 'ink');
      s += '<text class="ed-t m" x="88" y="' + (Y(0) - 28) + '" text-anchor="middle">reactanți</text><text class="ed-t m" x="388" y="' + (Y(tot) + (tot >= 0 ? -28 : 40)) + '" text-anchor="middle">produși</text>';
      // săgeata directă
      s += '<line class="hy-dir" x1="448" y1="' + Y(0) + '" x2="448" y2="' + Y(tot) + '" marker-end="url(#' + id + '-' + (tot < 0 ? 'exo' : 'endo') + ')"/>';
      s += '<text class="ed-t b ' + (tot < 0 ? 'exo' : 'endo') + '" x="458" y="' + ((Y(0) + Y(tot)) / 2 + 5) + '">ΔH</text>';
      holder.innerHTML = s + '</svg>';
      var f = function (x) { return (x > 0 ? '+' : '') + T.fmt(x, 0); };
      out.className = 'wd-out ' + (tot < 0 ? 'exo' : 'endo');
      out.innerHTML = T.rich('$ΔH = ΔH_1 + ΔH_2 + ΔH_3 = ' + f(S.d1) + ' ' + f(S.d2) + ' ' + f(S.d3) + ' = <b>' + f(tot) + '</b>$ kJ ⟹ ' + (tot < 0 ? '<b class="tag-exo">exotermă</b>' : tot > 0 ? '<b class="tag-endo">endotermă</b>' : '$ΔH = 0$') + '.');
    }
    var sl = [
      T.slider({ label: '$ΔH_1$', min: -150, max: 150, step: 5, value: S.d1, unit: 'kJ', dec: 0, onInput: function (v) { S.d1 = v; draw(); } }),
      T.slider({ label: '$ΔH_2$', min: -150, max: 150, step: 5, value: S.d2, unit: 'kJ', dec: 0, onInput: function (v) { S.d2 = v; draw(); } }),
      T.slider({ label: '$ΔH_3$', min: -150, max: 150, step: 5, value: S.d3, unit: 'kJ', dec: 0, onInput: function (v) { S.d3 = v; draw(); } })
    ];
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, out);
    draw();
  });

  /* ---------------------------------------------------------
     Căldura de reacție din căldurile de formare
     --------------------------------------------------------- */
  var METAN = { id: 'metan', name: 'Arderea metanului (problema 8 din caiet)', L: [[1, 'CH4(g)'], [2, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(g)']] };
  function levelChart(r, vals) {
    var cols = ['var(--endo)', 'var(--ok)', '#8b5cf6', '#d9a400', '#14a39a', '#f08c2a'];
    function side(arr, off) { return arr.map(function (q, i) { return { f: q[1], nu: q[0], v: q[0] * (vals[q[1]] || 0), c: cols[(i + off) % cols.length] }; }); }
    var SL = side(r.L, 0), SR = side(r.R, r.L.length);
    function sums(S) { var pos = 0, neg = 0, net = 0; S.forEach(function (x) { if (x.v > 0) pos += x.v; else neg += -x.v; net += x.v; }); return { pos: pos, neg: neg, net: net }; }
    var a = sums(SL), b = sums(SR), posMax = Math.max(a.pos, b.pos), negMax = Math.max(a.neg, b.neg), tot = Math.max(posMax + negMax, 1), k = 190 / tot;
    var z = 50 + posMax * k, W = 520, H = z + negMax * k + 56, V = T.viz, p = V.uid('lv');
    var s = V.defs(p) + V.panel(p, W, H, 'var(--paper-2)');
    s += '<line x1="30" y1="' + V.f(z) + '" x2="490" y2="' + V.f(z) + '" stroke="var(--ink-2)" stroke-width="2.4" stroke-dasharray="7 5"/><text class="t-s t-b" x="34" y="' + V.f(z - 28) + '">elemente în stare standard: ΔH<tspan class="sb" dy="3">f</tspan><tspan dy="-3"> = 0</tspan></text>';
    function stack(S, xc, anchor) {
      var up = z, down = z, t = '';
      S.forEach(function (x) {
        var h = Math.abs(x.v) * k;
        if (Math.abs(x.v) < 1e-9) { t += '<path d="M' + (xc - 6) + ' ' + V.f(z) + ' l6 -7 l6 7 l-6 7z" fill="var(--ink-2)"/>'; t += '<text class="t-s t-m" x="' + (anchor === 'end' ? xc - 12 : xc + 82) + '" y="' + V.f(z - 10) + '" text-anchor="' + anchor + '">' + T.uni(x.f.replace(/\((s|l|g|aq)\)$/, '')) + ' (element)</text>'; return; }
        h = Math.max(h, 3);
        var y = x.v > 0 ? up - h : down;
        t += '<rect x="' + xc + '" y="' + V.f(y) + '" width="70" height="' + V.f(h) + '" rx="3" style="fill:' + V.mix(x.c, 70, 'transparent') + '" stroke="' + x.c + '" stroke-width="1.6"/>';
        t += '<text class="t-s" x="' + (anchor === 'end' ? xc - 8 : xc + 78) + '" y="' + V.f(y + h / 2 + 4) + '" text-anchor="' + anchor + '">' + T.uni(x.f.replace(/\((s|l|g|aq)\)$/, '')) + ' · ' + (x.nu !== 1 ? T.fmt(x.nu, 1) + '×' : '') + T.fmt(vals[x.f] || 0, 1) + '</text>';
        if (x.v > 0) up -= h; else down += h;
      });
      return t;
    }
    s += stack(SL, 130, 'end') + stack(SR, 320, 'start');
    var yR = z - a.net * k, yP = z - b.net * k, d = b.net - a.net, col = d < 0 ? 'var(--exo)' : 'var(--endo)';
    s += '<line x1="124" y1="' + V.f(yR) + '" x2="206" y2="' + V.f(yR) + '" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/><line x1="314" y1="' + V.f(yP) + '" x2="396" y2="' + V.f(yP) + '" stroke="var(--ink)" stroke-width="3.2" stroke-linecap="round"/>';
    s += '<line x1="206" y1="' + V.f(yR) + '" x2="262" y2="' + V.f(yR) + '" stroke="var(--ink-3)" stroke-dasharray="4 4"/><line x1="262" y1="' + V.f(yP) + '" x2="314" y2="' + V.f(yP) + '" stroke="var(--ink-3)" stroke-dasharray="4 4"/>';
    if (Math.abs(yP - yR) > 8) s += '<line x1="262" y1="' + V.f(yR) + '" x2="262" y2="' + V.f(yP) + '" stroke="' + col + '" stroke-width="4"/><path d="M262 ' + V.f(yP) + ' l-8 ' + (yP > yR ? -13 : 13) + ' h16z" fill="' + col + '"/>';
    s += '<text class="t-b" x="268" y="' + V.f((yR + yP) / 2 + 5) + '" style="fill:' + col + '">ΔH<tspan class="sb" dy="3">r</tspan><tspan dy="-3"> = ' + T.fmt(d, 1) + '</tspan></text>';
    s += '<text class="t-b" x="130" y="' + V.f(H - 30) + '" text-anchor="middle">reactanți</text><text class="t-s t-m" x="130" y="' + V.f(H - 12) + '" text-anchor="middle">ΣΔH<tspan class="sb" dy="3">f</tspan><tspan dy="-3"> = ' + T.fmt(a.net, 1) + '</tspan></text>';
    s += '<text class="t-b" x="355" y="' + V.f(H - 30) + '" text-anchor="middle">produși</text><text class="t-s t-m" x="355" y="' + V.f(H - 12) + '" text-anchor="middle">ΣΔH<tspan class="sb" dy="3">f</tspan><tspan dy="-3"> = ' + T.fmt(b.net, 1) + '</tspan></text>';
    return V.frame([W, H], s, 'Nivelurile căldurilor de formare ale reactanților și produșilor; diferența lor este căldura de reacție');
  }

  T.widget('formationCalc', function (el, o) {
    var FORM = [(o && o.L && o.R) ? { id: 'cfg', name: o.name || 'Reacția din problemă', L: o.L, R: o.R } : METAN];
    var body = T.shell(el, {
      title: 'ΔH reacției din căldurile de formare',
      help: '$ΔH_r = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$. Valorile $ΔH_f$ din tabel sunt date de exemplu (în exerciții se dau în enunț); le poți modifica. Elementele au $ΔH_f = 0$ (ca în caiet).'
    });
    var cur = FORM[0].id, vals = {}, nmol = 5;
    function mainOf(r) { var l = r.L.filter(function (x) { return x[1] !== 'O2(g)'; }); return (l.length ? l : r.L)[0]; }
    var host = T.h('div'), out = T.h('div', { class: 'wd-out' }), vis = T.h('div');
    function reset() { var r = FORM.find(function (x) { return x.id === cur; }); vals = {}; r.L.concat(r.R).forEach(function (p) { vals[p[1]] = T.HF[p[1]]; }); }
    function build() {
      var r = FORM.find(function (x) { return x.id === cur; });
      var sel = T.h('div', { class: 'muted', html: '<b>' + r.name + '</b>' });
      var mainTxt = '[[' + mainOf(r)[1] + ']]';
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
      host.replaceChildren(T.h('div', { class: 'wd-row' }, sel), eq, tbl, T.h('div', { class: 'wd-row' }, T.h('label', { html: 'Câți <b>mol</b> de ' + mainTxt }), nIn, T.h('label', { text: ' (calculat prin proporție cu coeficientul din ecuație)' })));
      calc();
    }
    function calc() {
      var r = FORM.find(function (x) { return x.id === cur; });
      var P = r.R.reduce(function (s, p) { return s + p[0] * vals[p[1]]; }, 0), Rr = r.L.reduce(function (s, p) { return s + p[0] * vals[p[1]]; }, 0);
      var dH = P - Rr;
      var ps = r.R.map(function (p) { return T.fmt(p[0], 1) + '·(' + T.fmt(vals[p[1]], 1) + ')'; }).join(' + '), rs = r.L.map(function (p) { return T.fmt(p[0], 1) + '·(' + T.fmt(vals[p[1]], 1) + ')'; }).join(' + ');
      vis.innerHTML = levelChart(r, vals);
      out.className = 'wd-out ' + (dH < 0 ? 'exo' : 'endo');
      out.innerHTML = T.rich('$ΔH_r = [' + ps + '] − [' + rs + '] = ' + T.fmt(P, 1) + ' − (' + T.fmt(Rr, 1) + ') = <b>' + T.fmt(dH, 1) + ' kJ</b>$ ⟹ ' + (dH < 0 ? '<b class="tag-exo">exotermă</b> ($ΔH < 0$)' : '<b class="tag-endo">endotermă</b> ($ΔH > 0$)') +
        '<br>Pentru ' + T.fmt(nmol, 2) + ' mol de [[' + mainOf(r)[1] + ']] (coeficient ' + T.fmt(mainOf(r)[0], 1) + ' în ecuație): $|Q| = (' + T.fmt(nmol, 2) + ' · ' + T.fmt(Math.abs(dH), 1) + ')//(' + T.fmt(mainOf(r)[0], 1) + ') = ' + T.fmt(nmol / mainOf(r)[0] * Math.abs(dH), 1) + ' kJ$ ' + (dH < 0 ? 'degajați' : 'absorbiți') + '.');
    }
    body.append(host, out, vis);
    reset(); build();
  });

})(window);
