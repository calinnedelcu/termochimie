/* =========================================================
   problems-hard-3.js — nivelul 4, „Foarte greu”, pentru legea lui Hess și ΔH din ΔH_f
   Doar noțiunile din caiet: inversare / înmulțire / adunare de ecuații, ΔH_r = ΣΔH_f(produși) − ΣΔH_f(reactanți),
   ΔH_f al elementelor = 0, stabilitate; dificultatea vine din mai multe ecuații cu coeficienți diferiți,
   necunoscute puse „invers” și lanțuri (Hess → ΔH_f → ΔH reacției).
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, H = T.hard;
  var N = H.N, C = H.C, Cn = H.Cn, gen = H.gen, mchips = H.mchips, qline = H.qline, near = H.near, reg = H.reg, VM = H.VM;
  function mlab(m) { return (m < 0 ? '−' : '') + (Math.abs(m) === 0.5 ? '½' : Math.abs(m) === 1.5 ? '3/2' : N(Math.abs(m), 2)); }
  function neg(x, d) { return x < 0 ? '(' + N(x, d) + ')' : N(x, d); }

  /* ---------- construcția unui exercițiu Hess: ecuații date (permutate, la scări diferite) + țintă (înmulțită / inversată) ---------- */
  function scaleEq(e, s) {
    var sc = function (arr) { return arr.map(function (p) { return [p[0] * s, p[1]]; }); };
    return { L: sc(e.L), R: sc(e.R), dH: e.dH * s, key: e.key, m: e.m / s };
  }
  function build(h, perm, scales, tscale, rev) {
    var sgn = (rev ? -1 : 1) * tscale;
    var eqs = perm.map(function (i, j) { var e = scaleEq(h.eqs[i], scales[j]); return { L: e.L, R: e.R, dH: T.round(e.dH, 2), key: e.key, m: sgn * e.m }; });
    var sc = function (arr) { return arr.map(function (p) { return [p[0] * tscale, p[1]]; }); };
    var tg = rev ? { L: sc(h.target.R), R: sc(h.target.L) } : { L: sc(h.target.L), R: sc(h.target.R) };
    return { eqs: eqs, target: tg, dH: eqs.reduce(function (s, e) { return s + e.m * e.dH; }, 0) };
  }
  function eqsHtml(eqs, hideIdx) {
    return eqs.map(function (e, i) {
      return '<p style="margin:.3em 0">(' + (i + 1) + ') ' + T.hessEqStr(e) + ' &nbsp; $ΔH_' + (i + 1) + ' = ' + (i === hideIdx ? '?' : N(e.dH, 2) + ' kJ') + '$</p>';
    }).join('');
  }
  function targetStr(t) { return T.hessEqStr({ L: t.L, R: t.R }); }
  function multSteps(cfg) {
    var tnet = T.targetNet(cfg.target), st = [];
    st.push('Țintă: ' + targetStr(cfg.target) + '. Pentru fiecare substanță din țintă caut ecuația dată în care apare și o potrivesc (parte + coeficient).');
    cfg.eqs.forEach(function (e, i) { st.push(T.hessWhy(e, '(' + (i + 1) + ')', tnet)); });
    var terms = '', first = true;
    cfg.eqs.forEach(function (e, i) {
      var a = Math.abs(e.m), body = (Math.abs(a - 1) < 1e-9 ? '' : mlab(a) + '·') + '(' + (i + 1) + ')';
      terms += (e.m < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + body; first = false;
    });
    st.push('Adun ecuațiile: $' + terms + '$. După simplificarea substanțelor care apar și la reactanți, și la produși, rămâne exact ținta: ' + T.hessNetStr(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.hessOrder(cfg.target)) + ' ✓');
    return st;
  }
  function sumLine(cfg, hideIdx, label) {
    var ar = '', f2 = true;
    cfg.eqs.forEach(function (e, i) {
      var a = Math.abs(e.m), dh = i === hideIdx ? 'ΔH_' + (i + 1) : neg(e.dH, 2), body = (Math.abs(a - 1) < 1e-9 ? '' : mlab(a) + '·') + (i === hideIdx ? dh : '(' + N(e.dH, 2) + ')');
      ar += (e.m < 0 ? (f2 ? '−' : ' − ') : (f2 ? '' : ' + ')) + body; f2 = false;
    });
    return ar;
  }
  /* o specie din țintă pentru o cantitate dată: gaz → litri la c.n., altfel → grame */
  function pickQty(R, target) {
    var all = target.L.map(function (p) { return { nu: p[0], f: p[1], side: 'L' }; }).concat(target.R.map(function (p) { return { nu: p[0], f: p[1], side: 'R' }; })).filter(function (x) { return x.f !== 'O2(g)' && !/^(H2|C)\(/.test(x.f) || (x.side === 'R'); });
    var sp = R.pick(all.filter(function (x) { return x.f !== 'O2(g)'; }));
    sp.M = T.massOf(sp.f); sp.vol = T.isGas(sp.f);
    return sp;
  }

  /* =====================================================
     6. Legea lui Hess
     ===================================================== */
  var POOL = function () { return T.HESS.slice(1).filter(function (h) { return h.eqs.length >= 3; }); };

  /* 6a. Hess cu ecuații la scări diferite, țintă înmulțită sau inversată, plus cantități */
  function hessHard(R) {
    var h = R.pick(POOL()), perm = R.shuffle(h.eqs.map(function (_, i) { return i; })), scales = perm.map(function () { return R.pick([1, 1, 2]); });
    var mode = R.pick(['x2', 'x3', 'rev', 'rev2']), tscale = mode === 'x2' || mode === 'rev2' ? 2 : mode === 'x3' ? 3 : 1, rev = mode === 'rev' || mode === 'rev2';
    var cfg = build(h, perm, scales, tscale, rev), dH = cfg.dH, exo = dH < 0, sp = pickQty(R, cfg.target);
    var k = R.pick([0.5, 1, 1.5, 2, 3, 4]), qty = k * sp.nu * (sp.vol ? VM : sp.M), Qk = k * Math.abs(dH);
    var sideVerb = sp.side === 'L' ? 'reacționează' : 'se formează', heatVerb = exo ? 'se degajă' : 'se absoarbe';
    var dInv = -2 * dH;
    return {
      statement: '<p>Se consideră reacția:</p><div class="eqn">' + targetStr(cfg.target) + '</div>' +
        qline('a', 'Determinați variația de entalpie în condiții standard pentru această reacție, cunoscând variațiile de entalpie pentru următoarele reacții, care se desfășoară în condiții standard:') + eqsHtml(cfg.eqs) +
        qline('b', 'Calculați cantitatea de căldură (în kJ) ' + (exo ? 'degajată' : 'absorbită') + ' când ' + sideVerb + ' <b>' + N(qty, 1) + ' ' + (sp.vol ? 'L' : 'g') + '</b>' + (sp.vol ? ' (c.n.)' : '') + ' de ' + Cn(sp.f) + ' în această reacție.') +
        qline('c', 'Determinați variația de entalpie pentru reacția <b>inversă</b>, scrisă cu coeficienții <b>dublați</b>.'),
      data: mchips([sp.f]).concat(sp.vol ? ['$V_m = 22,4 L/mol$ (c.n.)'] : []),
      method: 'Pentru fiecare substanță din țintă caută ecuația dată în care apare: parte opusă ⟹ inversezi; alt coeficient ⟹ înmulțești (poate fi o fracție). Aduni ecuațiile și, cu aceiași multiplicatori, valorile $ΔH$.',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      check: function () { return T.sameNet(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.targetNet(cfg.target)) && near(sp.nu * 0 + dH, cfg.eqs.reduce(function (s, e) { return s + e.m * e.dH; }, 0)); },
      parts: [
        { id: 'a', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.006, steps: multSteps(cfg).concat(['Aceiași multiplicatori se aplică și lui $ΔH$: $ΔH = ' + sumLine(cfg, -1) + ' = <b>' + N(dH, 2) + ' kJ</b>$ ⟹ ' + (exo ? 'reacție <b>exotermă</b>.' : 'reacție <b>endotermă</b>.')]) },
        { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Qk, unit: 'kJ', dec: 1, tol: 0.015, steps: ['Pe ecuație ' + sideVerb.replace('reacționează', 'reacționează').replace('se formează', 'se formează') + ' $' + N(sp.nu, 1) + ' mol$ ' + C(sp.f) + ' $= ' + N(sp.nu * (sp.vol ? VM : sp.M), 1) + ' ' + (sp.vol ? 'L' : 'g') + '$ la $|ΔH| = ' + N(Math.abs(dH), 2) + ' kJ$.', 'Avem $' + N(qty, 1) + ' ' + (sp.vol ? 'L' : 'g') + '$ ⟹ $' + N(k, 2) + '$ × cantitatea de pe ecuație ⟹ $Q = ' + N(k, 2) + ' · ' + N(Math.abs(dH), 2) + ' = <b>' + N(Qk, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'ΔH al reacției inverse, cu coeficienții dublați', a: dInv, unit: 'kJ', dec: 1, tol: 0.006, steps: ['Reacția inversă are $ΔH$ de semn opus: $' + N(-dH, 2) + ' kJ$.', 'Coeficienții dublați ⟹ $ΔH$ dublat: $2 · (' + N(-dH, 2) + ') = <b>' + N(dInv, 2) + ' kJ</b>$.'] }
      ]
    };
  }

  /* 6b. Hess cu o valoare ΔH necunoscută printre ecuațiile date */
  function hessUnknown(R) {
    var h = R.pick(POOL()), perm = R.shuffle(h.eqs.map(function (_, i) { return i; })), scales = perm.map(function () { return R.pick([1, 1, 2]); });
    var cfg = build(h, perm, scales, 1, false), k = R.pick(cfg.eqs.map(function (_, i) { return i; })), dT = T.round(cfg.dH, 2);
    var others = cfg.eqs.reduce(function (s, e, i) { return i === k ? s : s + e.m * e.dH; }, 0), ek = cfg.eqs[k], dk = (dT - others) / ek.m, exo = dk < 0;
    var key = ek.key, ks = null; ek.L.concat(ek.R).forEach(function (p) { if (p[1] === key) ks = p[0]; });
    var M = T.massOf(key), mq = R.pick([0.5, 1, 2, 5]) * ks * M, Qq = mq / (ks * M) * Math.abs(dk);
    return {
      statement: '<p>Se cunosc ecuațiile termochimice de mai jos (pentru una dintre ele valoarea $ΔH$ nu este cunoscută):</p>' + eqsHtml(cfg.eqs, k) + '<p>Pentru reacția</p><div class="eqn">' + targetStr(cfg.target) + '</div><p>se cunoaște variația de entalpie $ΔH = ' + N(dT, 2) + ' kJ$.</p>' +
        qline('a', 'Determinați $ΔH_' + (k + 1) + '$.') + qline('b', 'Precizați dacă ecuația (' + (k + 1) + ') descrie o reacție exotermă sau endotermă.') + qline('c', 'Calculați cantitatea de căldură (în kJ) ' + (exo ? 'degajată' : 'absorbită') + ' în reacția a <b>' + N(mq, 1) + ' g</b> de ' + Cn(key) + ' conform ecuației (' + (k + 1) + ').'),
      data: mchips([key]),
      method: 'Găsește multiplicatorii ca în exercițiile obișnuite. Apoi scrie $ΔH$ al țintei ca sumă cu multiplicatori, în care $ΔH_' + (k + 1) + '$ este necunoscută, și rezolvă ecuația.',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      check: function () { return T.sameNet(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.targetNet(cfg.target)) && near(others + ek.m * dk, dT); },
      parts: [
        {
          id: 'a', ask: 'ΔH' + (k + 1), a: dk, unit: 'kJ', dec: 1, tol: 0.01, steps: multSteps(cfg).concat([
            '$ΔH = ' + sumLine(cfg, k) + ' = ' + N(dT, 2) + '$.',
            'Termenii cunoscuți dau $' + N(others, 2) + '$, deci $' + mlab(ek.m) + ' · ΔH_' + (k + 1) + ' = ' + N(dT, 2) + ' − (' + N(others, 2) + ') = ' + N(dT - others, 2) + '$.',
            '$ΔH_' + (k + 1) + ' = (' + N(dT - others, 2) + ')//(' + N(ek.m, 2) + ') = <b>' + N(dk, 2) + ' kJ</b>$.'])
        },
        { id: 'b', type: 'mc', ask: 'Ecuația (' + (k + 1) + ') este:', opts: ['exotermă', 'endotermă', 'fără efect termic', 'nu se poate stabili'], correct: exo ? 0 : 1, steps: ['$ΔH_' + (k + 1) + ' = ' + N(dk, 2) + ' ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? 'căldura se degajă ⟹ <b>exotermă</b>' : 'căldura se absoarbe ⟹ <b>endotermă</b>') + '.'] },
        { id: 'c', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Qq, unit: 'kJ', dec: 1, tol: 0.015, steps: ['Pe ecuația (' + (k + 1) + ') intră $' + N(ks, 2) + ' mol$ ' + C(key) + ' $= ' + N(ks * M, 1) + ' g$ la $|ΔH_' + (k + 1) + '| = ' + N(Math.abs(dk), 2) + ' kJ$.', 'Avem $' + N(mq, 1) + ' g$ ⟹ $Q = (' + N(mq, 1) + ' · ' + N(Math.abs(dk), 2) + ')//(' + N(ks * M, 1) + ') = <b>' + N(Qq, 1) + ' kJ</b>$.'] }
      ]
    };
  }

  /* 6c. lanț: Hess → ΔH_f al unui compus → ΔH al unei reacții cu acel compus */
  var CHAINS = [
    { hess: 'acetilena', X: 'C2H2(g)', rx: { L: [[1, 'C2H2(g)'], [2, 'H2(g)']], R: [[1, 'C2H6(g)']] }, known: { 'C2H6(g)': -84.7 }, ref: 'C2H6(g)', qty: 'C2H2(g)' },
    { hess: 'etanol', X: 'C2H5OH(l)', rx: { L: [[1, 'C2H4(g)'], [1, 'H2O(l)']], R: [[1, 'C2H5OH(l)']] }, known: { 'C2H4(g)': 52.3, 'H2O(l)': -285.8 }, ref: 'C2H4(g)', qty: 'C2H5OH(l)' },
    { hess: 'metan', X: 'CH4(g)', rx: { L: [[1, 'CH4(g)'], [1, 'H2O(g)']], R: [[1, 'CO(g)'], [3, 'H2(g)']] }, known: { 'CO(g)': -110.5, 'H2O(g)': -241.8 }, ref: 'CO(g)', qty: 'CH4(g)' },
    { hess: 'propan', X: 'C3H8(g)', rx: { L: [[1, 'C3H8(g)']], R: [[1, 'C2H4(g)'], [1, 'CH4(g)']] }, known: { 'C2H4(g)': 52.3, 'CH4(g)': -74.8 }, ref: 'C2H4(g)', qty: 'C3H8(g)' },
    { hess: 'benzen', X: 'C6H6(l)', rx: { L: [[3, 'C2H2(g)']], R: [[1, 'C6H6(l)']] }, known: { 'C2H2(g)': 226.7 }, ref: 'C2H2(g)', qty: 'C6H6(l)' }
  ];
  function hessChain(R) {
    var ch = R.pick(CHAINS), h = T.HESS.filter(function (x) { return x.id === ch.hess; })[0], perm = R.shuffle(h.eqs.map(function (_, i) { return i; })), scales = perm.map(function () { return R.pick([1, 1, 2]); });
    var cfg = build(h, perm, scales, 1, false), hfX = T.round(cfg.dH, 2), hf = {}; Object.keys(ch.known).forEach(function (k) { hf[k] = ch.known[k]; }); hf[ch.X] = hfX;
    var val = function (f) { return /^(H2|C)\(/.test(f) && f !== 'C2H2(g)' ? 0 : (hf[f] == null ? 0 : hf[f]); };
    var P = ch.rx.R.reduce(function (s, p) { return s + p[0] * val(p[1]); }, 0), Rr = ch.rx.L.reduce(function (s, p) { return s + p[0] * val(p[1]); }, 0), dH = P - Rr, exo = dH < 0;
    var sp = ch.rx.L.concat(ch.rx.R).filter(function (p) { return p[1] === ch.qty; })[0], M = T.massOf(ch.qty), k = R.pick([0.5, 1, 2, 3]), qm = k * sp[0] * M, Qk = k * Math.abs(dH);
    var known = Object.keys(ch.known).map(function (f) { return '$ΔH°_f$([[' + f + ']]) = ' + N(ch.known[f], 1) + ' kJ/mol'; });
    var stableX = hfX < ch.known[ch.ref];
    var pTerms = ch.rx.R.map(function (p) { return N(p[0], 1) + '·' + neg(val(p[1]), 2); }).join(' + '), rTerms = ch.rx.L.map(function (p) { return N(p[0], 1) + '·' + neg(val(p[1]), 2); }).join(' + ');
    return {
      statement: '<p>Se cunosc următoarele ecuații termochimice:</p>' + eqsHtml(cfg.eqs) +
        qline('a', 'Folosind legea lui Hess, determinați entalpia molară de formare standard a ' + gen(ch.X) + '.') +
        qline('b', 'Cu valoarea de la a), determinați variația de entalpie în condiții standard pentru reacția ' + T.hessEqStr(ch.rx) + '.') + qline('c', 'Calculați cantitatea de căldură (în kJ) ' + (exo ? 'degajată' : 'absorbită') + ' în reacția de la b) a <b>' + N(qm, 1) + ' g</b> de ' + Cn(ch.qty) + '.') +
        qline('d', 'Precizați care dintre substanțele ' + C(ch.X) + ' și ' + C(ch.ref) + ' este mai stabilă.'),
      data: known.concat(mchips([ch.qty])),
      method: 'a) Hess, ca în exercițiile cu ecuații. b) $ΔH = ΣΔH_f(produși) − ΣΔH_f(reactanți)$, cu $ΔH_f$ calculat la a) și cele date; elementele au $ΔH_f = 0$. d) Mai stabilă este substanța cu $ΔH_f$ mai mic.',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      check: function () { return T.sameNet(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.targetNet(cfg.target)) && near(hfX, cfg.eqs.reduce(function (s, e) { return s + e.m * e.dH; }, 0)); },
      parts: [
        { id: 'a', ask: 'ΔH_f(' + C(ch.X) + ')', a: hfX, unit: 'kJ/mol', dec: 1, tol: 0.01, steps: multSteps(cfg).concat(['Aceiași multiplicatori se aplică și lui $ΔH$: $ΔH = ' + sumLine(cfg, -1) + ' = <b>' + N(hfX, 2) + ' kJ</b>$, adică $ΔH_f$(' + C(ch.X) + ') $= ' + N(hfX, 2) + ' kJ/mol$ (reacția dă 1 mol din compus, din elemente).']) },
        { id: 'b', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.01, steps: ['Formula: $ΔH = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$. Elementele au $ΔH_f = 0$.', 'Produși: $' + pTerms + ' = ' + N(P, 2) + ' kJ$. &nbsp; Reactanți: $' + rTerms + ' = ' + N(Rr, 2) + ' kJ$.', '$ΔH = ' + N(P, 2) + ' − (' + N(Rr, 2) + ') = <b>' + N(dH, 2) + ' kJ</b>$ ⟹ ' + (exo ? 'exotermă.' : 'endotermă.')] },
        { id: 'c', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Qk, unit: 'kJ', dec: 1, tol: 0.015, steps: ['Pe ecuație: $' + N(sp[0], 1) + ' mol$ ' + C(ch.qty) + ' $= ' + N(sp[0] * M, 1) + ' g$ ↔ $|ΔH| = ' + N(Math.abs(dH), 2) + ' kJ$.', '$Q = (' + N(qm, 1) + ' · ' + N(Math.abs(dH), 2) + ')//(' + N(sp[0] * M, 1) + ') = <b>' + N(Qk, 1) + ' kJ</b>$.'] },
        { id: 'd', type: 'mc', ask: 'Care este mai stabilă?', opts: [nm2(ch.X), nm2(ch.ref), 'au aceeași stabilitate', 'nu se poate stabili'], correct: stableX ? 0 : 1, noShuffle: true, steps: ['$ΔH_f$(' + C(ch.X) + ') $= ' + N(hfX, 1) + '$ și $ΔH_f$(' + C(ch.ref) + ') $= ' + N(ch.known[ch.ref], 1) + '$ kJ/mol. Este mai stabilă substanța cu $ΔH_f$ <b>mai mic (mai negativ)</b>: ' + nm2(stableX ? ch.X : ch.ref) + '.'] }
      ]
    };
  }
  function nm2(f) { return T.hard.nm(f); }


  /* 6d. dehidrogenare avansată, în două etape (ca în manual): ΔH total, ce lege se aplică, m³ (c.n.), randament maxim */
  var LADDER = [
    { key: 'dehidrogenare-butan', A: 'C4H10(g)', C: 'C4H6(g)', nA: 'n-butan', gA: 'n-butanului', nC: 'butadienă' },
    { key: 'dehidrogenare-propan', A: 'C3H8(g)', C: 'C3H4(g)', nA: 'propan', gA: 'propanului', nC: 'propină' },
    { key: 'dehidrogenare-etan', A: 'C2H6(g)', C: 'C2H2(g)', nA: 'etan', gA: 'etanului', nC: 'acetilenă' }
  ];
  var LAWS4 = ['legea lui Hess', 'legea conservării masei', 'legea lui Avogadro', 'legea lui Boyle–Mariotte'];
  function hessLadder(R) {
    var lad = R.pick(LADDER), h = T.HESS.filter(function (x) { return x.id === lad.key; })[0], cfg = build(h, [0, 1], [1, 1], 1, false), dH = T.round(cfg.dH, 2);
    var perm = R.shuffle([0, 1]); cfg = build(h, perm, [1, 1], 1, false);
    var Vm3 = R.pick([11.2, 22.4, 44.8, 56, 112]), nA = Vm3 * 1000 / VM, QV = nA * dH, kq = R.pick([1, 2, 5, 10]), Qabs = T.round(kq * dH, 2), kk = Qabs / dH, VC = kk * VM;
    return {
      statement: '<p>Se consideră reacția de dehidrogenare avansată a ' + lad.gA + ', conform ecuației:</p><div class="eqn">' + targetStr(cfg.target) + '</div>' +
        '<p>Se cunosc variațiile de entalpie, în condiții standard, pentru următoarele reacții:</p>' + eqsHtml(cfg.eqs) +
        qline('a', 'Determinați variația de entalpie, în condiții standard, în reacția de dehidrogenare avansată a ' + lad.gA + '.') + qline('b', 'Precizați ce lege se aplică pentru rezolvarea cerinței de la a).') +
        qline('c', 'Calculați variația de entalpie în procesul de dehidrogenare avansată a <b>' + N(Vm3, 1) + ' m³</b> (c.n.) de ' + lad.nA + '.') +
        qline('d', 'Calculați volumul (c.n.) de ' + lad.nC + ' care se poate obține, dacă în proces s-au absorbit <b>' + N(Qabs, 2) + ' kJ</b> și dacă randamentul este maxim.'),
      data: ['$V_m = 22,4 L/mol$ (c.n.)', '1 m³ = 1000 L'],
      method: 'Cele două reacții se adună: ce apare la produșii primei și la reactanții celei de-a doua se simplifică. „Randamentul maxim” înseamnă că reacția este totală. Un mol de ' + lad.nA + ' (22,4 L la c.n.) corespunde variației de entalpie de la a).',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      check: function () { return T.sameNet(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.targetNet(cfg.target)) && near(dH, cfg.eqs.reduce(function (s, e) { return s + e.m * e.dH; }, 0)) && near(VC, Qabs / dH * VM) && dH > 0; },
      parts: [
        { id: 'a', ask: 'ΔH al reacției de dehidrogenare avansată', a: dH, unit: 'kJ', dec: 2, tol: 0.006, steps: multSteps(cfg).concat(['Aceiași multiplicatori se aplică și lui $ΔH$: $ΔH = ' + sumLine(cfg, -1) + ' = <b>' + N(dH, 2) + ' kJ</b>$ ⟹ reacție <b>endotermă</b> (se absoarbe căldură).']) },
        { id: 'b', type: 'mc', ask: 'Legea care se aplică este:', opts: LAWS4, correct: 0, steps: ['Reacția de dehidrogenare avansată se obține prin însumarea celor două reacții date, iar variația de entalpie este suma lor, indiferent de drum: se aplică <b>legea lui Hess</b>.'] },
        { id: 'c', ask: 'ΔH pentru ' + N(Vm3, 1) + ' m³ de ' + lad.nA, a: QV, unit: 'kJ', dec: 0, tol: 0.012, steps: ['$V = ' + N(Vm3, 1) + ' m^3 = ' + N(Vm3 * 1000, 0) + ' L$ ⟹ $ν = (' + N(Vm3 * 1000, 0) + ')//(22,4) = ' + N(nA, 1) + ' mol$ de ' + lad.nA + '.', 'Pentru $1 mol$ variația de entalpie este $' + N(dH, 2) + ' kJ$ (valoarea de la a).', '$ΔH = ' + N(nA, 1) + ' · ' + N(dH, 2) + ' = <b>' + N(QV, 0) + ' kJ</b>$.'] },
        { id: 'd', ask: 'Volumul de ' + lad.nC + ' (c.n.)', a: VC, unit: 'L', dec: 1, tol: 0.012, steps: ['Randament maxim ⟹ tot ' + lad.nA + 'ul se transformă. La $1 mol$ de ' + lad.nA + ' se absorb $' + N(dH, 2) + ' kJ$ și se formează $1 mol$ de ' + lad.nC + '.', '$ν = (' + N(Qabs, 2) + ')//(' + N(dH, 2) + ') = ' + N(kk, 2) + ' mol$ de ' + lad.nC + '.', '$V = ν · 22,4 = ' + N(kk, 2) + ' · 22,4 = <b>' + N(VC, 1) + ' L</b>$.'] }
      ]
    };
  }

  reg('hess', [hessHard, hessUnknown, hessChain, hessLadder]);

  /* =====================================================
     7. ΔH din căldurile de formare
     ===================================================== */
  var CO2 = -393.5, H2OL = -285.8, H2OG = -241.8;
  var FU = [
    { f: 'CH4(g)', x: 1, y: 4, z: 0, hf: -74.8, M: 16 }, { f: 'C2H6(g)', x: 2, y: 6, z: 0, hf: -84.7, M: 30 }, { f: 'C3H8(g)', x: 3, y: 8, z: 0, hf: -103.7, M: 44 },
    { f: 'C2H4(g)', x: 2, y: 4, z: 0, hf: 52.3, M: 28 }, { f: 'C2H2(g)', x: 2, y: 2, z: 0, hf: 226.7, M: 26 }, { f: 'CH3OH(l)', x: 1, y: 4, z: 1, hf: -238.6, M: 32 }, { f: 'C2H5OH(l)', x: 2, y: 6, z: 1, hf: -277.7, M: 46 },
    { f: 'C4H10(g)', x: 4, y: 10, z: 0, hf: -125.7, M: 58 }, { f: 'C3H6(g)', x: 3, y: 6, z: 0, hf: 20.4, M: 42 }, { f: 'C6H6(l)', x: 6, y: 6, z: 0, hf: 49, M: 78 }
  ];
  function combEq(fu, water) { return { type: 'exo', L: [[1, fu.f], [fu.x + fu.y / 4 - fu.z / 2, 'O2(g)']], R: [[fu.x, 'CO2(g)'], [fu.y / 2, water]] }; }
  function combDH(fu, hw) { return fu.x * CO2 + fu.y / 2 * hw - fu.hf; }
  function eqNoQ(r) { return '<div class="eqn">' + T.eqStr(r, { noQ: true }) + '</div>'; }
  function combSteps(fu, hw, label, water) {
    var tx = N(fu.x, 0) + '·(' + N(CO2, 1) + ')', th = (fu.y / 2 === 1 ? '' : N(fu.y / 2, 0) + '·') + '(' + N(hw, 1) + ')';
    var d = combDH(fu, hw);
    return '<b>' + label + '</b>: ' + T.hessEqStr(combEq(fu, water)) + '. $ΔH = [' + tx + ' + ' + th + '] − ' + neg(fu.hf, 1) + ' = ' + N(fu.x * CO2 + fu.y / 2 * hw, 2) + ' − ' + neg(fu.hf, 1) + ' = <b>' + N(d, 2) + ' kJ/mol</b>$ ($ΔH_f$ al ' + C('O2') + ' este 0).';
  }

  /* 7a. amestec de doi combustibili: ΔH_c din ΔH_f, apoi sistem cu două necunoscute */
  function formMix(R) {
    for (var tries = 0; tries < 40; tries++) {
      var pair = R.shuffle(FU).slice(0, 2), A = pair[0], B = pair[1], a = R.pick([0.1, 0.2, 0.25, 0.4, 0.5]), b = R.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      if (T.isGas(A.f) !== T.isGas(B.f)) continue;   // amestec de substanțe în aceeași stare de agregare
      var dA = combDH(A, H2OL), dB = combDH(B, H2OL), hA = -dA / A.M, hB = -dB / B.M;
      if (Math.abs(hA - hB) < 2) continue;
      var m = a * A.M + b * B.M, Q = T.round(a * -dA + b * -dB, 2), x = (Q - hB * m) / (hA - hB), y = m - x;
      if (!(x > 0.05 * m && y > 0.05 * m)) continue;
      var nA = x / A.M, nB = y / B.M, VC = (nA * A.x + nB * B.x) * VM;
      return {
        statement: '<p>Un amestec de ' + Cn(A.f) + ' și ' + Cn(B.f) + ', cu masa totală de <b>' + N(m, 2) + ' g</b>, arde complet în condiții standard (se formează ' + C('CO2') + ' și apă lichidă). Din ardere se degajă <b>' + N(Q, 2) + ' kJ</b>.</p>' +
          qline('a', 'Determinați variația de entalpie pentru arderea unui mol de ' + Cn(A.f) + '.') + qline('b', 'Determinați variația de entalpie pentru arderea unui mol de ' + Cn(B.f) + '.') + qline('c', 'Calculați masa de ' + Cn(A.f) + ' din amestec.') + qline('d', 'Calculați volumul de ' + C('CO2') + ' (c.n.) care se formează.'),
        data: ['$ΔH°_f$([[CO2(g)]]) = ' + N(CO2, 1) + ' kJ/mol', '$ΔH°_f$([[H2O(l)]]) = ' + N(H2OL, 1) + ' kJ/mol', '$ΔH°_f$([[' + A.f + ']]) = ' + N(A.hf, 1) + ' kJ/mol', '$ΔH°_f$([[' + B.f + ']]) = ' + N(B.hf, 1) + ' kJ/mol'].concat(mchips([A.f, B.f]), ['$V_m = 22,4 L/mol$ (c.n.)']),
        method: 'Scrie ecuația arderii fiecărui compus (echilibrată) și calculează $ΔH = ΣΔH_f(produși) − ΣΔH_f(reactanți)$. Apoi, cu căldura pe gram, scrie un sistem cu necunoscutele $x$, $y$ (mase).',
        check: function () { return near(hA * x + hB * y, Q) && near(x + y, m) && x > 0 && y > 0; },
        parts: [
          { id: 'a', ask: 'ΔH la arderea unui mol de ' + C(A.f), a: dA, unit: 'kJ', dec: 1, tol: 0.006, steps: [combSteps(A, H2OL, C(A.f), 'H2O(l)')] },
          { id: 'b', ask: 'ΔH la arderea unui mol de ' + C(B.f), a: dB, unit: 'kJ', dec: 1, tol: 0.006, steps: [combSteps(B, H2OL, C(B.f), 'H2O(l)')] },
          {
            id: 'c', ask: 'Masa de ' + C(A.f), a: x, unit: 'g', dec: 2, tol: 0.03, steps: [
              'Căldura degajată pe gram: $h_A = (' + N(-dA, 2) + ')//(' + N(A.M, 1) + ') = ' + N(hA, 4) + ' kJ/g$; $h_B = (' + N(-dB, 2) + ')//(' + N(B.M, 1) + ') = ' + N(hB, 4) + ' kJ/g$.',
              '$x + y = ' + N(m, 2) + '$ și $h_A·x + h_B·y = ' + N(Q, 2) + '$ ⟹ $x = (' + N(Q, 2) + ' − h_B · ' + N(m, 2) + ')//(h_A − h_B)$.',
              '$x = (' + N(Q, 2) + ' − ' + N(hB, 4) + ' · ' + N(m, 2) + ')//(' + N(hA, 4) + ' − ' + N(hB, 4) + ') = <b>' + N(x, 2) + ' g</b>$ ' + C(A.f) + ' (iar ' + C(B.f) + ': $' + N(m, 2) + ' − ' + N(x, 2) + ' = ' + N(y, 2) + ' g$).']
          },
          { id: 'd', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: VC, unit: 'L', dec: 1, tol: 0.03, steps: ['Moli: $ν_A = ' + N(nA, 3) + ' mol$, $ν_B = ' + N(nB, 3) + ' mol$. Din ecuații: $' + N(A.x, 0) + ' mol$ ' + C('CO2') + ' la 1 mol ' + C(A.f) + ', $' + N(B.x, 0) + ' mol$ la 1 mol ' + C(B.f) + '.', '$ν(CO_2) = ' + N(A.x, 0) + ' · ' + N(nA, 3) + ' + ' + N(B.x, 0) + ' · ' + N(nB, 3) + ' = ' + N(nA * A.x + nB * B.x, 3) + ' mol$ ⟹ $V = ' + N(nA * A.x + nB * B.x, 3) + ' · 22,4 = <b>' + N(VC, 1) + ' L</b>$.'] }
        ]
      };
    }
    return formWater(R);
  }

  /* hidrocarburi: ΔH_f (kJ/mol, gaz) pe clase și număr de atomi de carbon */
  var HC = {
    alchina: { fam: 'alchină', art: 'alchina', pl: 'alchinelor', o2: '(3n−1)/2', gen: 'C_nH_{2n−2}', d: -1, hf: { 2: 226.7, 3: 185.4, 4: 165.2 }, nm: { 2: 'etină (acetilenă)', 3: 'propină', 4: '1-butină' } },
    alchena: { fam: 'alchenă', art: 'alchena', pl: 'alchenelor', o2: '3n/2', gen: 'C_nH_{2n}', d: 0, hf: { 2: 52.3, 3: 20.4, 4: -0.5 }, nm: { 2: 'etenă', 3: 'propenă', 4: '1-butenă' } },
    alcan: { fam: 'alcan', art: 'alcanul', pl: 'alcanilor', o2: '(3n+1)/2', gen: 'C_nH_{2n+2}', d: 1, hf: { 2: -84.7, 3: -103.7, 4: -125.7 }, nm: { 2: 'etan', 3: 'propan', 4: 'butan' } }
  };
  /* 7b. lanț de necunoscute ΔH_f: fiecare reacție dă ΔH_f al unui compus nou */
  var UCHAINS = [
    {
      given: [],
      steps: [
        { eq: { L: [[1, 'N2(g)'], [1, 'O2(g)']], R: [[2, 'NO(g)']] }, dH: 180.6, f: 'NO(g)', calc: function () { return 180.6 / 2; }, how: 'din $ΔH = 2·ΔH_f(NO)$ (elementele au $ΔH_f = 0$)' },
        { eq: { L: [[2, 'NO(g)'], [1, 'O2(g)']], R: [[2, 'NO2(g)']] }, dH: -114.2, f: 'NO2(g)', calc: function (p) { return (-114.2 + 2 * p[0]) / 2; }, how: 'din $ΔH = 2·ΔH_f(NO_2) − 2·ΔH_f(NO)$' },
        { eq: { L: [[2, 'NO2(g)']], R: [[1, 'N2O4(g)']] }, dH: -57.2, f: 'N2O4(g)', calc: function (p) { return -57.2 + 2 * p[1]; }, how: 'din $ΔH = ΔH_f(N_2O_4) − 2·ΔH_f(NO_2)$' }
      ]
    }
  ];
  /* ΔH_f (kJ/mol) pentru seria „hidrocarbură nesaturată → alchenă → alcan”: n = 2, 3 alchină; n = 4 butadienă (ca să coincidă cu structura afișată); sunt gaze la c.n. */
  var HCH = { 2: [226.7, 52.3, -84.7], 3: [185.4, 20.4, -103.7], 4: [110.0, -0.5, -125.7] };
  /* alchină → alchenă → alcan (n = 2…4): arderea alchinei dă ΔH_f(alchină), apoi fiecare hidrogenare dă ΔH_f al următorului compus */
  [2, 3, 4].forEach(function (n) { ['l', 'g'].forEach(function (wst) {
    var Bw = wst === 'l' ? H2OL : H2OG, wf = 'H2O(' + wst + ')';
    var fa = 'C' + n + 'H' + (2 * n - 2) + '(g)', fe = 'C' + n + 'H' + (2 * n) + '(g)', fn = 'C' + n + 'H' + (2 * n + 2) + '(g)';
    var ha = HCH[n][0], he = HCH[n][1], hn = HCH[n][2];
    var dc = T.round(n * CO2 + (n - 1) * Bw - ha, 1), d2 = T.round(he - ha, 1), d3 = T.round(hn - he, 1);
    UCHAINS.push({
      given: ['$ΔH°_f$([[CO2(g)]]) = ' + N(CO2, 1) + ' kJ/mol', '$ΔH°_f$([[' + wf + ']]) = ' + N(Bw, 1) + ' kJ/mol'],
      steps: [
        { eq: { L: [[1, fa], [(3 * n - 1) / 2, 'O2(g)']], R: [[n, 'CO2(g)'], [n - 1, wf]] }, dH: dc, f: fa, calc: function () { return n * CO2 + (n - 1) * Bw - dc; }, how: 'din ecuația arderii: $ΔH = [' + n + '·(' + N(CO2, 1) + ') + ' + (n - 1 === 1 ? '' : (n - 1) + '·') + '(' + N(Bw, 1) + ')] − ΔH_f$(' + fa.replace('(g)', '') + ')' },
        { eq: { L: [[1, fa], [1, 'H2(g)']], R: [[1, fe]] }, dH: d2, f: fe, calc: function (p) { return p[0] + d2; }, how: 'din $ΔH = ΔH_f$(' + fe.replace('(g)', '') + ') $− ΔH_f$(' + fa.replace('(g)', '') + ')' },
        { eq: { L: [[1, fe], [1, 'H2(g)']], R: [[1, fn]] }, dH: d3, f: fn, calc: function (p) { return p[1] + d3; }, how: 'din $ΔH = ΔH_f$(' + fn.replace('(g)', '') + ') $− ΔH_f$(' + fe.replace('(g)', '') + ')' }
      ]
    });
  }); });
  function formUnknownChain(R) {
    var ch = R.pick(UCHAINS), vals = [];
    ch.steps.forEach(function (s) { vals.push(T.round(s.calc(vals), 2)); });
    var stable = vals.indexOf(Math.min.apply(null, vals)), names = ch.steps.map(function (s) { return T.hard.nm(s.f); });
    var order = R.shuffle([0, 1, 2]);
    return {
      statement: '<p>Se cunosc următoarele ecuații termochimice' + (ch.given.length ? '' : ', în care substanțele simple (elementele) au $ΔH°_f = 0$') + ':</p>' +
        order.map(function (si, j) { var s = ch.steps[si]; return '<p style="margin:.3em 0">(' + (j + 1) + ') ' + T.hessEqStr(s.eq) + ' &nbsp; $ΔH_' + (j + 1) + ' = ' + N(s.dH, 1) + ' kJ$</p>'; }).join('') +
        qline('a', 'Determinați entalpia molară de formare standard a ' + gen(ch.steps[0].f) + '.') + qline('b', 'Determinați entalpia molară de formare standard a ' + gen(ch.steps[1].f) + '.') + qline('c', 'Determinați entalpia molară de formare standard a ' + gen(ch.steps[2].f) + '.') + qline('d', 'Precizați care dintre cele trei substanțe este cea mai stabilă.'),
      data: ch.given,
      method: 'Folosește fiecare ecuație o singură dată: din $ΔH = ΣΔH_f(produși) − ΣΔH_f(reactanți)$ afli câte un $ΔH_f$ nou. Începe cu ecuația în care apare o singură necunoscută, apoi folosește valorile găsite. Mai stabilă este substanța cu $ΔH_f$ mai mic.',
      check: function () { return vals.every(Number.isFinite); },
      parts: [0, 1, 2].map(function (i) {
        return { id: 'abc'[i], ask: 'ΔH_f(' + C(ch.steps[i].f) + ')', a: vals[i], unit: 'kJ/mol', dec: 1, tol: 0.012, abs: 0.06, steps: ['Ecuația (' + (order.indexOf(i) + 1) + '): ' + ch.steps[i].how + '.' + (i > 0 ? ' Folosesc valorile găsite: ' + vals.slice(0, i).map(function (v, j) { return '$ΔH_f$(' + C(ch.steps[j].f) + ') $= ' + N(v, 2) + '$'; }).join('; ') + '.' : ''), '$ΔH_f$(' + C(ch.steps[i].f) + ') $= <b>' + N(vals[i], 2) + ' kJ/mol</b>$.'] };
      }).concat([{ id: 'd', type: 'mc', ask: 'Cea mai stabilă este:', opts: names.concat(['toate la fel']), correct: stable, steps: ['$ΔH_f$: ' + names.map(function (n, i) { return n + ' = ' + N(vals[i], 1); }).join('; ') + ' kJ/mol. Mai stabilă este substanța cu $ΔH_f$ <b>mai mic</b>: ' + names[stable] + '.'] }])
    };
  }

  /* 7c. apă lichidă sau vapori: aceeași ardere, două valori ale lui ΔH */
  function formWater(R) {
    var fu = R.pick(FU.filter(function (x) { return x.z === 0 || x.f === 'CH3OH(l)'; })), dL = combDH(fu, H2OL), dG = combDH(fu, H2OG), gas = T.isGas(fu.f);
    var k = R.pick([0.5, 1, 2, 3, 5, 10]), qty = k * fu.M * (gas ? 1 : 1), V = k * VM, QL = k * -dL, QG = k * -dG, vap = H2OG - H2OL, nW = fu.y / 2, extra = k * nW * vap;
    return {
      statement: '<p>Se ' + (gas ? 'ard în condiții standard <b>' + N(V, 1) + ' L</b> (c.n.) de ' + Cn(fu.f) : 'ard în condiții standard <b>' + N(qty, 1) + ' g</b> de ' + Cn(fu.f)) + ', complet. Se compară două situații: apa rezultă ca <b>lichid</b> sau ca <b>vapori</b>.</p>' +
        qline('a', 'Determinați variația de entalpie pentru arderea unui mol de ' + Cn(fu.f) + ', cu apă lichidă.') + qline('b', 'Determinați variația de entalpie pentru arderea unui mol de ' + Cn(fu.f) + ', cu apă sub formă de vapori.') +
        qline('c', 'Calculați diferența dintre cantitățile de căldură degajate la arderea cantității date în cele două cazuri.') + qline('d', 'Calculați cantitatea de căldură (în kJ) absorbită la vaporizarea unui mol de apă, pe baza datelor.'),
      data: ['$ΔH°_f$([[CO2(g)]]) = ' + N(CO2, 1) + ' kJ/mol', '$ΔH°_f$([[H2O(l)]]) = ' + N(H2OL, 1) + ' kJ/mol', '$ΔH°_f$([[H2O(g)]]) = ' + N(H2OG, 1) + ' kJ/mol', '$ΔH°_f$([[' + fu.f + ']]) = ' + N(fu.hf, 1) + ' kJ/mol'].concat(mchips([fu.f]), gas ? ['$V_m = 22,4 L/mol$ (c.n.)'] : []),
      method: 'Scrie ecuația arderii în două variante și aplică $ΔH = ΣΔH_f(produși) − ΣΔH_f(reactanți)$. Diferența dintre cele două valori vine din starea de agregare a apei.',
      check: function () { return near(QL - QG, extra) && near(vap, 44); },
      parts: [
        { id: 'a', ask: 'ΔH (apă lichidă)', a: dL, unit: 'kJ', dec: 1, tol: 0.006, steps: [combSteps(fu, H2OL, 'Apă lichidă', 'H2O(l)')] },
        { id: 'b', ask: 'ΔH (vapori de apă)', a: dG, unit: 'kJ', dec: 1, tol: 0.006, steps: [combSteps(fu, H2OG, 'Vapori de apă', 'H2O(g)')] },
        { id: 'c', ask: 'Diferența dintre căldurile degajate', a: extra, unit: 'kJ', dec: 1, tol: 0.015, steps: ['Cantitatea dată: $' + N(k, 2) + ' mol$ ' + C(fu.f) + (gas ? ' ($' + N(V, 1) + ' / 22,4$)' : ' ($' + N(qty, 1) + ' / ' + N(fu.M, 1) + '$)') + '.', 'Apă lichidă: $Q = ' + N(k, 2) + ' · ' + N(-dL, 2) + ' = ' + N(QL, 1) + ' kJ$; vapori: $Q = ' + N(k, 2) + ' · ' + N(-dG, 2) + ' = ' + N(QG, 1) + ' kJ$.', 'Diferența: $' + N(QL, 1) + ' − ' + N(QG, 1) + ' = <b>' + N(extra, 1) + ' kJ</b>$ (mai multă căldură se degajă dacă apa rezultă lichidă).'] },
        { id: 'd', ask: 'Căldura de vaporizare a unui mol de apă', a: vap, unit: 'kJ', dec: 1, tol: 0.01, steps: ['Din $H_2O(l) → H_2O(g)$: $ΔH = ΔH_f(H_2O, g) − ΔH_f(H_2O, l) = (' + N(H2OG, 1) + ') − (' + N(H2OL, 1) + ') = <b>' + N(vap, 1) + ' kJ</b>$.', 'Verificare: la ' + N(k, 2) + ' mol de combustibil se formează $' + N(k * nW, 1) + ' mol$ apă ⟹ $' + N(k * nW, 1) + ' · ' + N(vap, 1) + ' = ' + N(extra, 1) + ' kJ$ ✓ (diferența de la c).'] }
      ]
    };
  }


  /* 7d. identificarea unei hidrocarburi din ΔH_f și ΔH de ardere, apoi topirea unui metal cu căldura degajată (ex. 9 din manual) */
  /* metale: c în kJ/kg·K, λ în kJ/kg (ca în manual) */
  var METALS_KG = [
    { n: 'zinc', d: 'zincul', f: 'Zn', tm: 419, c: 0.39, lam: 111 }, { n: 'plumb', d: 'plumbul', f: 'Pb', tm: 327, c: 0.13, lam: 23 }, { n: 'staniu', d: 'staniul', f: 'Sn', tm: 232, c: 0.23, lam: 59 },
    { n: 'aluminiu', d: 'aluminiul', f: 'Al', tm: 660, c: 0.9, lam: 397 }, { n: 'cupru', d: 'cuprul', f: 'Cu', tm: 1085, c: 0.385, lam: 209 }
  ];
  function formIdentify(R) {
    var key = R.pick(['alchina', 'alchina', 'alchina', 'alchena', 'alcan']), fam = HC[key], n = R.pick([2, 3, 4]), f = fam.hf[n];
    var water = R.pick(['g', 'g', 'l']), b = water === 'g' ? H2OG : H2OL, A = CO2, w = n + fam.d;
    var dH = T.round(n * A + w * b - f, 1), nSol = (dH + f - fam.d * b) / (A + b);
    var mt = R.pick(METALS_KG), ti = 20, p = R.pick([50, 60, 70, 75, 80]), k = R.pick([0.1, 0.25, 0.5, 1]), V = k * VM, Q = k * -dH, Qu = p / 100 * Q, qkg = mt.c * (mt.tm - ti) + mt.lam, mm = Qu / qkg;
    var fx = 'C' + n + 'H' + (2 * n + (key === 'alchina' ? -2 : key === 'alcan' ? 2 : 0)) + '(g)';
    var opts = [2, 3, 4].map(function (j) { return HC[key].nm[j] + ' — ' + '[[C' + j + 'H' + (2 * j + (key === 'alchina' ? -2 : key === 'alcan' ? 2 : 0)) + ']]'; });
    var ok = Math.abs(nSol - n) < 0.01;
    var ng = key === 'alchina' ? 'alchinei' : key === 'alchena' ? 'alchenei' : 'alcanului', art = key === 'alcan' ? 'un alcan' : 'o ' + fam.fam;
    var wordW = water === 'g' ? 'H2O(g)' : 'H2O(l)';
    return {
      statement: '<p>Pentru ' + art + ' se cunosc: entalpia molară de formare standard $ΔH°_f = ' + N(f, 1).replace(/^(\d)/, '+$1') + ' kJ/mol$ și variația de entalpie pentru reacția de oxidare (ardere) în condiții standard a unui mol de ' + fam.fam + ' $ΔH = ' + N(dH, 1) + ' kJ/mol$. Formula generală a ' + fam.pl + ' este $' + fam.gen + '$.</p>' +
        qline('a', 'Determinați numărul $n$ de atomi de carbon din moleculă, cunoscând $ΔH°_f$ [[CO2(g)]] = ' + N(A, 1) + ' kJ/mol și $ΔH°_f$ [[' + wordW + ']] = ' + N(b, 1) + ' kJ/mol.') +
        qline('b', 'Identificați ' + fam.art + '.') +
        qline('c', 'Calculați cantitatea de căldură degajată la arderea a <b>' + N(V, 2) + ' L</b> (c.n.) de ' + fam.fam + '.') +
        qline('d', 'Calculați masa de ' + mt.n + ', aflat la temperatura de <b>' + ti + ' °C</b>, ce ar putea fi adusă în stare topită cu căldura degajată din arderea celor ' + N(V, 2) + ' L (c.n.) de ' + fam.fam + ', dacă numai <b>' + p + '%</b> din cantitatea de căldură degajată este utilizată pentru încălzirea și topirea bucății de ' + mt.n + '.'),
      data: ['p.t. ' + mt.f + ' = ' + mt.tm + ' °C', '$c_{' + mt.f + '} = ' + N(mt.c, 3) + ' kJ/kg·K$', '$λ_{topire ' + mt.f + '} = ' + N(mt.lam, 0) + ' kJ/kg$', '$V_m = 22,4 L/mol$ (c.n.)'],
      method: 'Scrie ecuația arderii hidrocarburii în funcție de $n$ (câți mol de ' + C('CO2') + ' și de apă rezultă) și aplică $ΔH = ΣΔH_f(produși) − ΣΔH_f(reactanți)$; rezolvi ecuația în $n$. Apoi: moli din volum, căldura degajată, partea utilă și, pentru metal, $c·ΔT + λ$ pe kilogram.',
      check: function () { return ok && near(mm * qkg, Qu) && near(Q, V / VM * -dH); },
      parts: [
        { id: 'a', ask: 'Numărul de atomi de carbon (n)', a: n, unit: '', dec: 0, tol: 0.001, steps: ['Ecuația arderii (în funcție de $n$): $' + fam.gen + ' + ' + fam.o2 + ' O_2 → n CO_2 + ' + (w === n ? 'n' : w === n - 1 ? '(n−1)' : '(n+1)') + ' H_2O$ (apa este ' + (water === 'g' ? 'sub formă de vapori' : 'lichidă') + ').', '$ΔH = n·ΔH_f(CO_2) + ' + (w === n ? 'n' : w === n - 1 ? '(n−1)' : '(n+1)') + '·ΔH_f(H_2O) − ΔH_f(hidrocarbură)$ ($ΔH_f$ al ' + C('O2') + ' este 0).', '$' + N(dH, 1) + ' = n·(' + N(A, 1) + ') + ' + (w === n ? 'n' : w === n - 1 ? '(n−1)' : '(n+1)') + '·(' + N(b, 1) + ') − (' + N(f, 1) + ')$ ⟹ $n·(' + N(A + b, 1) + ') = ' + N(dH + f - fam.d * b, 1) + '$.', '$n = (' + N(dH + f - fam.d * b, 1) + ')//(' + N(A + b, 1) + ') = <b>' + N(nSol, 2) + '</b> ≈ ' + n + '$.'] },
        { id: 'b', type: 'mc', ask: 'Hidrocarbura este:', opts: opts, correct: [2, 3, 4].indexOf(n), noShuffle: true, steps: ['Pentru $n = ' + n + '$: formula $' + fam.gen.replace('n', n).replace(/n/g, String(n)) + '$ ⟹ ' + C(fx) + ', adică <b>' + fam.nm[n] + '</b>.'] },
        { id: 'c', ask: 'Căldura degajată la arderea a ' + N(V, 2) + ' L', a: Q, unit: 'kJ', dec: 2, tol: 0.012, steps: ['$ν = (' + N(V, 2) + ')//(22,4) = ' + N(k, 3) + ' mol$ de hidrocarbură.', 'Pentru $1 mol$ se degajă $' + N(-dH, 1) + ' kJ$ ⟹ $Q = ' + N(k, 3) + ' · ' + N(-dH, 1) + ' = <b>' + N(Q, 2) + ' kJ</b>$.'] },
        { id: 'd', ask: 'Masa de ' + mt.n, a: mm, unit: 'kg', dec: 3, tol: 0.015, steps: ['Căldura utilă: $' + p + '% · ' + N(Q, 2) + ' = ' + N(Qu, 2) + ' kJ$.', 'Pentru $1 kg$ de ' + mt.n + ': încălzire $c·ΔT = ' + N(mt.c, 3) + ' · (' + mt.tm + ' − ' + ti + ') = ' + N(mt.c * (mt.tm - ti), 2) + ' kJ$, topire $λ = ' + N(mt.lam, 0) + ' kJ$ ⟹ $q = ' + N(qkg, 2) + ' kJ/kg$.', '$m = (Q_u)//(q) = (' + N(Qu, 2) + ')//(' + N(qkg, 2) + ') = <b>' + N(mm, 3) + ' kg</b>$.'] }
      ]
    };
  }

  reg('entalpii-formare', [formMix, formUnknownChain, formWater, formIdentify]);
})(typeof window !== 'undefined' ? window : globalThis);
