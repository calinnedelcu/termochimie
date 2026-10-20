/* =========================================================
   problems2.js — tipurile 6–11: Hess, ΔH din ΔH_f, mărimi calorimetrice,
   amestecare, primul principiu, diagrame de entalpie
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  var N = function (x, d) { return T.fmt(x, d == null ? 2 : d); };
  var nm = function (f) { return f.replace(/\((s|l|g|aq)\)$/, ''); };
  var C = function (f) { return '[[' + nm(f) + ']]'; };
  function reg(def) { T.problems[def.id] = def; T.problemOrder.push(def.id); }
  function mchips(list) { return list.map(function (f) { return 'M(' + C(f) + ') = ' + N(T.massOf(f), 1) + ' g/mol'; }); }
  var Cn = T.cname;
  var TOTAL = ['considerând transformarea totală', 'considerând că reacția este totală', 'considerând că transformarea este totală'];
  function qp(id, txt) { return '<p><b>' + id + ')</b> ' + txt + '</p>'; }
  function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  /** «A, B și C» */
  function listAnd(a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' și ' + a[a.length - 1] : a.join(''); }
  function neg(x, d) { return x < 0 ? '(' + N(x, d) + ')' : N(x, d); }
  function mlab(m) { return (m < 0 ? '−' : '') + (Math.abs(m) === 0.5 ? '½' : Math.abs(m) === 1.5 ? '3/2' : N(Math.abs(m), 1)); }

  /* =====================================================
     6. Legea lui Hess
     ===================================================== */
  function hessBuild(h, perm, scale, rev) {
    var sgn = (rev ? -1 : 1) * scale;
    var eqs = perm.map(function (i) { var e = h.eqs[i]; return { L: e.L, R: e.R, dH: e.dH, key: e.key, m: sgn * e.m }; });
    var sc = function (arr) { return arr.map(function (p) { return [p[0] * scale, p[1]]; }); };
    var tg = rev ? { L: sc(h.target.R), R: sc(h.target.L) } : { L: sc(h.target.L), R: sc(h.target.R) };
    var dH = eqs.reduce(function (s, e) { return s + e.m * e.dH; }, 0);
    return { eqs: eqs, target: tg, dH: dH };
  }
  function eqsHtml(eqs) {
    return eqs.map(function (e, i) { return '<p style="margin:.3em 0">(' + (i + 1) + ') ' + T.hessEqStr(e) + ' &nbsp; $ΔH_' + (i + 1) + ' = ' + N(e.dH, 1) + ' kJ$</p>'; }).join('');
  }
  function targetStr(t) { return T.hessEqStr({ L: t.L, R: t.R }); }
  function hessSteps(cfg) {
    var tnet = T.targetNet(cfg.target), st = [];
    st.push('Țintă: ' + targetStr(cfg.target) + '. Pentru fiecare substanță din țintă caut ecuația dată în care apare și o potrivesc (parte + coeficient).');
    cfg.eqs.forEach(function (e, i) { st.push(T.hessWhy(e, '(' + (i + 1) + ')', tnet)); });
    var terms = '', first = true;
    cfg.eqs.forEach(function (e, i) {
      var a = Math.abs(e.m), body = (Math.abs(a - 1) < 1e-9 ? '' : mlab(a) + '·') + '(' + (i + 1) + ')';
      terms += (e.m < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + body; first = false;
    });
    st.push('Adun ecuațiile: $' + terms + '$. După simplificarea substanțelor care apar și la reactanți, și la produși, rămâne exact ținta: ' + T.hessNetStr(T.netOf(cfg.eqs, cfg.eqs.map(function (e) { return e.m; })), T.hessOrder(cfg.target)) + ' ✓');
    var ar = '', f2 = true;
    cfg.eqs.forEach(function (e) {
      var a = Math.abs(e.m), body = (Math.abs(a - 1) < 1e-9 ? '' : N(a, 1) + '·') + '(' + N(e.dH, 1) + ')';
      ar += (e.m < 0 ? (f2 ? '−' : ' − ') : (f2 ? '' : ' + ')) + body; f2 = false;
    });
    st.push('Aceiași multiplicatori se aplică și lui $ΔH$: $ΔH = ' + ar + ' = <b>' + N(cfg.dH, 2) + ' kJ</b>$ ⟹ ' + (cfg.dH < 0 ? 'reacție <b>exotermă</b> ($ΔH < 0$).' : 'reacție <b>endotermă</b> ($ΔH > 0$).'));
    return st;
  }
  function firstProduct(t) { return t.R[0]; }

  function hessOriginal() {
    var cfg = hessBuild(T.HESS[0], [0, 1, 2], 1, false), steps = hessSteps(cfg);
    return {
      statement: '<p>În industrie, alcoolul metilic ([[CH3OH]]) se obține din gaz de sinteză conform ecuației:</p><div class="eqn">' + targetStr(cfg.target) + '</div>' +
        qp('a', 'Determinați variația de entalpie în condiții standard pentru această reacție, cunoscând variațiile de entalpie pentru următoarele reacții, care se desfășoară în condiții standard:') + eqsHtml(cfg.eqs) +
        qp('b', 'Calculați masa de metanol pur ce se poate obține, știind că din reacție se degajă <b>1281 kJ</b>.'),
      data: ['M([[CH3OH]]) = 32 g/mol'],
      note: T.callout('imp', 'Acest exercițiu este marcat „important” în caiet.', 'Din caiet'),
      method: 'Aranjează ecuațiile ca să obții ținta: ce e la alt capăt decât în țintă se inversează; ce are alt coeficient se înmulțește. Apoi aduni și ecuațiile, și valorile ΔH.',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      parts: [
        { id: 'a', ask: 'ΔH al reacției', a: cfg.dH, unit: 'kJ', dec: 1, tol: 0.006, steps: steps },
        { id: 'b', ask: 'Masa de metanol', a: 320, unit: 'g', dec: 0, steps: ['La reacția din a) se formează $1 mol$ ($32 g$) de ' + C('CH3OH(l)') + ' și se degajă $128,1 kJ$.', 'Proporție: $32 g ... 128,1 kJ$ &nbsp;și&nbsp; $x g ... 1281 kJ$.', '$x = (32 · 1281)//(128,1) = <b>320 g</b>$.'] }
      ]
    };
  }

  /** reacția-țintă este formarea unui mol de substanță din elementele ei */
  function isFormation(t) { return t.R.length === 1 && Math.abs(t.R[0][0] - 1) < 1e-9 && t.L.every(function (p) { return /^(C\(s\)|H2\(g\)|O2\(g\)|N2\(g\)|S\(s\)|Cl2\(g\))$/.test(p[1]); }); }
  var LAWS = ['legea lui Hess', 'legea conservării masei', 'legea lui Avogadro', 'legea lui Boyle–Mariotte'];
  function lawPart(id) { return { id: id, type: 'mc', ask: 'Legea care se aplică este:', opts: LAWS, correct: 0, steps: ['Variația de entalpie a unei reacții este aceeași, indiferent de drum (dintr-o singură etapă sau din mai multe): se aplică <b>legea lui Hess</b>.'] }; }

  /* verificarea legii lui Hess pe două căi (schema din manual: propena → CO2 + H2O) */
  var CHK = [
    { w: 'propenei', alkene: 'C3H6(g)', alkane: 'C3H8(g)', n: 3, hfe: 20.4, hfa: -103.7 }, { w: 'etenei', alkene: 'C2H4(g)', alkane: 'C2H6(g)', n: 2, hfe: 52.3, hfa: -84.7 },
    { w: '1-butenei', alkene: 'C4H8(g)', alkane: 'C4H10(g)', n: 4, hfe: -0.5, hfa: -125.7 }
  ];
  function hessCheck(R) {
    var c = R.pick(CHK), A = -393.5, B = -285.8, n = c.n;
    var d2 = T.round(c.hfa - c.hfe, 1), d3 = T.round(n * A + (n + 1) * B - c.hfa, 1), d4 = 285.8, d1 = T.round(d2 + d3 + d4, 1), sum = d2 + d3 + d4;
    var e1 = { L: [[1, c.alkene], [1.5 * n, 'O2(g)']], R: [[n, 'CO2(g)'], [n, 'H2O(l)']] }, e2 = { L: [[1, c.alkene], [1, 'H2(g)']], R: [[1, c.alkane]] },
      e3 = { L: [[1, c.alkane], [1.5 * n + 0.5, 'O2(g)']], R: [[n, 'CO2(g)'], [n + 1, 'H2O(l)']] }, e4 = { L: [[n, 'CO2(g)'], [n + 1, 'H2O(l)']], R: [[n, 'CO2(g)'], [n, 'H2O(l)'], [1, 'H2(g)'], [0.5, 'O2(g)']] };
    var line = function (e, i, v) { return '<p style="margin:.3em 0">' + T.hessEqStr(e) + ' &nbsp; $ΔH_' + i + ' = ' + (v > 0 ? '+' : '') + N(v, 1) + ' kJ/mol$</p>'; };
    return {
      statement: '<p>Se consideră două posibilități de transformare a ' + c.w + ' (' + C(c.alkene) + ') în dioxid de carbon și apă, în condiții standard:</p>' +
        '<p><b>Calea 1</b> (într-o singură etapă):</p>' + line(e1, 1, d1) + '<p><b>Calea 2</b> (în trei etape):</p>' + line(e2, 2, d2) + line(e3, 3, d3) + line(e4, 4, d4) +
        qp('a', 'Calculați suma $ΔH_2 + ΔH_3 + ΔH_4$.') + qp('b', 'Verificați legea lui Hess: precizați ce relație există între $ΔH_1$ și suma de la a).'),
      method: 'Legea lui Hess: variația de entalpie este aceeași pe orice cale (într-o singură etapă sau în mai multe), deci $ΔH_1 = ΔH_2 + ΔH_3 + ΔH_4$.',
      check: function () { return near(sum, d1, 0.2); },
      parts: [
        { id: 'a', ask: 'ΔH₂ + ΔH₃ + ΔH₄', a: sum, unit: 'kJ/mol', dec: 1, tol: 0.003, steps: ['$ΔH_2 + ΔH_3 + ΔH_4 = (' + N(d2, 1) + ') + (' + N(d3, 1) + ') + (+' + N(d4, 1) + ') = <b>' + N(sum, 1) + ' kJ/mol</b>$.'] },
        { id: 'b', type: 'mc', ask: 'Relația dintre $ΔH_1$ și suma de la a) este:', opts: ['$ΔH_1 = ΔH_2 + ΔH_3 + ΔH_4$ (legea lui Hess se verifică)', '$ΔH_1 > ΔH_2 + ΔH_3 + ΔH_4$', '$ΔH_1 < ΔH_2 + ΔH_3 + ΔH_4$', 'nu se poate stabili'], correct: 0, noShuffle: true,
          steps: ['Suma este egală cu $ΔH_1 = ' + N(d1, 1) + ' kJ/mol$: variația de entalpie nu depinde de drum, deci <b>legea lui Hess se verifică</b>.'] }
      ]
    };
  }
  function near(a, b, t) { return Math.abs(a - b) <= t; }

  function hessMake(seed, level) {
    var R = T.rng(seed); if (level === 1 && R.pick([0, 0, 0, 0, 1]) === 1) return hessCheck(R);
    var h = R.pick(T.HESS.slice(1)), n = h.eqs.length;
    var perm = R.shuffle(h.eqs.map(function (_, i) { return i; }));
    var scale = 1, rev = false, mode = 'normal';
    if (level === 3) { mode = R.pick(['x2', 'x3', 'rev']); scale = mode === 'x2' ? 2 : mode === 'x3' ? 3 : 1; rev = mode === 'rev'; }
    var cfg = hessBuild(h, perm, scale, rev), steps = hessSteps(cfg), exo = cfg.dH < 0;
    var tool = { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } };
    var form = isFormation(cfg.target), special = h.ask && scale === 1 && !rev;
    var head = form || (special && /^hidrogenare/.test(h.ask)) ? '' : '<p>Se consideră reacția' + (special ? ' de ' + h.ask : '') + ':</p><div class="eqn">' + targetStr(cfg.target) + '</div>';
    var askA = form ? 'Determinați entalpia molară de formare standard a ' + T.cgen(cfg.target.R[0][1]) + ', dacă se cunosc variațiile de entalpie în următoarele reacții:'
      : special && /^hidrogenare/.test(h.ask) ? 'Determinați variația de entalpie în reacția de ' + h.ask + ', dacă se cunosc variațiile de entalpie în următoarele reacții de hidrogenare:'
      : 'Determinați variația de entalpie în condiții standard pentru ' + (special ? 'reacția de ' + h.ask : 'această reacție') + ', cunoscând variațiile de entalpie pentru următoarele reacții, care se desfășoară în condiții standard:';
    var qa = qp('a', askA) + eqsHtml(cfg.eqs);
    var pa = { id: 'a', ask: form ? 'Entalpia molară de formare standard' : 'ΔH al reacției', a: cfg.dH, unit: form ? 'kJ/mol' : 'kJ', dec: 1, tol: 0.006, steps: steps };
    var typePart = { id: 'b', type: 'mc', ask: (form ? 'Formarea' : 'Reacția') + ' din a) este:', opts: ['exotermă', 'endotermă', 'fără efect termic', 'nu se poate stabili'], correct: exo ? 0 : 1, steps: ['$ΔH ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? 'căldura se degajă ⟹ <b>exotermă</b>' : 'căldura se absoarbe ⟹ <b>endotermă</b>') + '.'] };

    if (level === 1) {
      return { statement: head + qa + qp('b', 'Precizați dacă ' + (form ? 'formarea este o reacție exotermă sau endotermă.' : 'reacția este exotermă sau endotermă.')) + qp('c', 'Precizați ce lege se aplică pentru rezolvarea cerinței de la a).'), method: 'Pentru fiecare substanță din țintă caută ecuația în care apare. Parte opusă ⟹ inversezi; alt coeficient ⟹ înmulțești.', tool: tool,
        parts: [pa, typePart, lawPart('c')] };
    }
    if (level === 2) {
      var pr = firstProduct(cfg.target), Mp = T.massOf(pr[1]), k = R.pick([1, 2, 3, 4, 5, 10]), Q = T.round(k * Math.abs(cfg.dH), 1), mass = k * pr[0] * Mp;
      return { statement: head + qa + qp('b', 'Calculați masa de ' + Cn(pr[1]) + ' ce se poate obține, știind că din reacție se ' + (exo ? 'degajă' : 'absorb') + ' <b>' + N(Q, 1) + ' kJ</b>.'), data: mchips([pr[1]]), method: 'a) Hess. b) La reacția scrisă se formează ' + pr[0] + ' mol din produsul cerut și $|ΔH|$ kJ; apoi proporție.', tool: tool,
        parts: [pa,
          { id: 'b', ask: 'Masa de ' + Cn(pr[1]), a: mass, unit: 'g', dec: 1, steps: ['Pe ecuație se formează $' + N(pr[0], 1) + ' mol$ ' + C(pr[1]) + ' $= ' + N(pr[0] * Mp, 1) + ' g$ și se ' + (exo ? 'degajă' : 'absorb') + ' $' + N(Math.abs(cfg.dH), 1) + ' kJ$.', 'Proporție: $' + N(pr[0] * Mp, 1) + ' g ... ' + N(Math.abs(cfg.dH), 1) + ' kJ$ &nbsp;și&nbsp; $x ... ' + N(Q, 1) + ' kJ$.', '$x = (' + N(pr[0] * Mp, 1) + ' · ' + N(Q, 1) + ')//(' + N(Math.abs(cfg.dH), 1) + ') = <b>' + N(mass, 1) + ' g</b>$.'] }] };
    }
    var sp = cfg.target.L[0], Ms = T.massOf(sp[1]), j = R.pick([0.5, 1, 2, 3]), ms = j * sp[0] * Ms, Qh = j * Math.abs(cfg.dH);
    return { statement: head + qa + qp('b', 'Calculați cantitatea de căldură ' + (exo ? 'degajată' : 'absorbită') + ' în reacția a <b>' + N(ms, 1) + ' g</b> de ' + Cn(sp[1]) + ', ' + R.pick(TOTAL) + '.'), data: mchips([sp[1]]),
      method: 'Mai întâi ecuația dată de enunț (de ex. ținta simplă); apoi aplici regulile: dublezi ⟹ dublezi ΔH; inversezi ⟹ schimbi semnul.', tool: tool,
      parts: [pa,
        { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Qh, unit: 'kJ', dec: 1, steps: ['Pe ecuație reacționează $' + N(sp[0], 1) + ' mol$ ' + C(sp[1]) + ' $= ' + N(sp[0] * Ms, 1) + ' g$ la $|ΔH| = ' + N(Math.abs(cfg.dH), 1) + ' kJ$.', 'Avem $' + N(ms, 1) + ' g$ ⟹ $' + N(ms / (sp[0] * Ms), 2) + '$ din cantitatea de pe ecuație.', '$Q = ' + N(ms / (sp[0] * Ms), 2) + ' · ' + N(Math.abs(cfg.dH), 1) + ' = <b>' + N(Qh, 1) + ' kJ</b>$.'] }] };
  }

  reg({
    id: 'hess', short: 'Legea lui Hess', title: 'Legea lui Hess: calculul lui ΔH din alte ecuații',
    blurb: 'Exercițiul „important” din caiet și variații: inversezi, înmulțești, aduni ecuațiile — și aduni valorile ΔH. Include formarea din elemente, hidrogenarea parțială și dehidrogenarea pe etape.',
    skill: 'inversare · înmulțire · adunare',
    intro: T.callout('key', '<b>Reguli:</b> inversezi ecuația ⟹ $ΔH$ își schimbă semnul; o înmulțești cu $k$ ⟹ $ΔH$ se înmulțește cu $k$; adunând ecuațiile, adunăm și valorile $ΔH$. <i>De ce:</i> procesul invers absoarbe exact ce degaja cel direct; $ΔH$ este pentru cantitățile din ecuație; $ΔH$ nu depinde de drum (lecția 12).  Sub problemă ai un <b>combinator</b> cu care poți testa multiplicatorii.'),
    original: hessOriginal, make: hessMake
  });

  /* =====================================================
     7. ΔH din căldurile de formare
     ===================================================== */
  var FR = [
    { n: 'arderea metanului (apă gazoasă)', L: [[1, 'CH4(g)'], [2, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(g)']] },
    { n: 'arderea metanului (apă lichidă)', L: [[1, 'CH4(g)'], [2, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(l)']] },
    { n: 'arderea etanului', L: [[1, 'C2H6(g)'], [3.5, 'O2(g)']], R: [[2, 'CO2(g)'], [3, 'H2O(l)']] },
    { n: 'arderea etenei', L: [[1, 'C2H4(g)'], [3, 'O2(g)']], R: [[2, 'CO2(g)'], [2, 'H2O(l)']] },
    { n: 'arderea acetilenei', L: [[1, 'C2H2(g)'], [2.5, 'O2(g)']], R: [[2, 'CO2(g)'], [1, 'H2O(l)']] },
    { n: 'arderea metanolului', L: [[1, 'CH3OH(l)'], [1.5, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(l)']] },
    { n: 'arderea etanolului', L: [[1, 'C2H5OH(l)'], [3, 'O2(g)']], R: [[2, 'CO2(g)'], [3, 'H2O(l)']] },
    { n: 'sudarea prin aluminotermie', L: [[2, 'Al(s)'], [1, 'Fe2O3(s)']], R: [[1, 'Al2O3(s)'], [2, 'Fe(s)']] },
    { n: 'descompunerea carbonatului de calciu', L: [[1, 'CaCO3(s)']], R: [[1, 'CaO(s)'], [1, 'CO2(g)']] },
    { n: 'formarea oxidului de azot', L: [[1, 'N2(g)'], [1, 'O2(g)']], R: [[2, 'NO(g)']] },
    { n: 'sinteza amoniacului', L: [[1, 'N2(g)'], [3, 'H2(g)']], R: [[2, 'NH3(g)']] },
    { n: 'hidrogenarea etenei', L: [[1, 'C2H4(g)'], [1, 'H2(g)']], R: [[1, 'C2H6(g)']] },
    { n: 'arderea monoxidului de carbon', L: [[1, 'CO(g)'], [0.5, 'O2(g)']], R: [[1, 'CO2(g)']] },
    { n: 'reducerea oxidului de fier cu CO', L: [[1, 'Fe2O3(s)'], [3, 'CO(g)']], R: [[2, 'Fe(s)'], [3, 'CO2(g)']] },
    { n: 'oxidarea dioxidului de sulf', L: [[1, 'SO2(g)'], [0.5, 'O2(g)']], R: [[1, 'SO3(g)']] }
  ];
  function frDH(r) { var s = 0; r.R.forEach(function (p) { s += p[0] * T.HF[p[1]]; }); r.L.forEach(function (p) { s -= p[0] * T.HF[p[1]]; }); return T.round(s, 2); }
  function isComp(f) { return T.HF[f] !== 0; }
  function eqNoQ(r) { return '<div class="eqn">' + T.eqStr({ L: r.L, R: r.R, type: 'exo' }, { noQ: true }) + '</div>'; }
  function hfChips(r, skip) {
    var seen = {}, out = [];
    r.L.concat(r.R).forEach(function (p) { var f = p[1]; if (isComp(f) && !seen[f] && f !== skip) { seen[f] = 1; out.push('$ΔH°_f$([[' + f + ']]) = ' + N(T.HF[f], 1) + ' kJ/mol'); } });
    return out;
  }
  function frArith(r) {
    var P = r.R.map(function (p) { return N(p[0], 1) + '·' + neg(T.HF[p[1]], 1); }).join(' + '), Rr = r.L.map(function (p) { return N(p[0], 1) + '·' + neg(T.HF[p[1]], 1); }).join(' + ');
    var sp = r.R.reduce(function (s, p) { return s + p[0] * T.HF[p[1]]; }, 0), sr = r.L.reduce(function (s, p) { return s + p[0] * T.HF[p[1]]; }, 0);
    return { P: P, R: Rr, sp: sp, sr: sr };
  }
  function knownTerms(list, skip) {
    return list.filter(function (p) { return p[1] !== skip && isComp(p[1]); }).map(function (p) { return '$' + N(p[0], 1) + '·(' + N(T.HF[p[1]], 1) + ')$'; }).join(' + ');
  }
  function frStepsDH(r, withEq) {
    var a = frArith(r), dH = frDH(r);
    var water = r.L.concat(r.R).filter(function (p) { return /^H2O\(/.test(p[1]); })[0];
    return (withEq ? ['Scriu ecuația reacției: ' + T.eqStr({ L: r.L, R: r.R, type: 'exo' }, { noQ: true }) + '.' + (water ? ' Starea apei este cea pentru care se dă $ΔH°_f$: [[' + water[1] + ']].' : '')] : []).concat(['Formula: $ΔH = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$. Elementele au $ΔH_f = 0$ (ca în caiet, ex. [[O2]]).',
      'Produși: $' + a.P + ' = ' + N(a.sp, 2) + '$ kJ. &nbsp; Reactanți: $' + a.R + ' = ' + N(a.sr, 2) + '$ kJ.',
      '$ΔH = ' + N(a.sp, 2) + ' − (' + N(a.sr, 2) + ') = <b>' + N(dH, 2) + ' kJ</b>$ ⟹ ' + (dH < 0 ? 'exotermă.' : 'endotermă.')]);
  }
  function mainReactant(r) { var l = r.L.filter(function (p) { return p[1] !== 'O2(g)'; }); return (l.length ? l : r.L)[0]; }

  function formOriginal() {
    var r = FR[0], dH = frDH(r);
    return {
      statement: '<p>Calculați cantitatea de căldură degajată la arderea în condiții standard a <b>5 moli</b> de metan, dacă se cunosc: ' + listAnd(['H2O(g)', 'CO2(g)', 'CH4(g)'].map(function (f) { return '$ΔH°_f$([[' + f + ']]) = ' + N(T.HF[f], 1) + ' kJ/mol'; })) + '.</p>',
      data: ['$ΔH°_f$([[O2]]) = 0 (element)'], method: '$ΔH = Σ ν·ΔH_f(produși) − Σ ν·ΔH_f(reactanți)$. Nu uita coeficienții și că elementele au $ΔH_f = 0$. La b) înmulțești cu numărul de moli de metan (coeficientul lui în ecuație este 1).',
      tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
      parts: [{ id: 'a', ask: 'Pasul 1 — ΔH pentru arderea unui mol de metan', a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r, true) },
        { id: 'b', ask: 'Răspunsul — căldura degajată la arderea a 5 moli de metan', a: 5 * Math.abs(dH), unit: 'kJ', dec: 1, tol: 0.003, steps: ['Pe ecuație: $1 mol$ ' + C('CH4') + ' ⟹ $' + N(Math.abs(dH), 1) + ' kJ$ degajați.', '$|Q| = 5 · ' + N(Math.abs(dH), 1) + ' = <b>' + N(5 * Math.abs(dH), 1) + ' kJ</b>$.'] }]
    };
  }

  function formMake(seed, level) {
    var R = T.rng(seed), r;
    if (level === 3) { var pool = FR.filter(function (x) { return x.R.some(function (p) { return T.isGas(p[1]); }); }); r = R.pick(pool); }
    else if (level === 1) r = R.pick(FR.filter(function (x) { return /^arderea/.test(x.n); }));
    else r = R.pick(FR);
    var dH = frDH(r), exo = dH < 0, word = exo ? 'degajă' : 'absoarbe';

    if (level === 1) {
      var mn = mainReactant(r), nmol = R.pick([2, 3, 4, 5, 10]), Q = nmol / mn[0] * Math.abs(dH);
      return {
        statement: '<p>Calculați cantitatea de căldură degajată la arderea în condiții standard a <b>' + nmol + ' moli</b> de ' + Cn(mn[1]) + ', dacă se cunosc: ' + listAnd(hfChips(r)) + '.</p>',
        data: ['$ΔH°_f$([[O2]]) = 0 (element)'],
        method: '$ΔH = Σ ν·ΔH_f(produși) − Σ ν·ΔH_f(reactanți)$; elementele au $ΔH_f = 0$. La b) pornești de la ceea ce înseamnă $ΔH$: căldura pentru coeficienții scriși.', tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
        parts: [{ id: 'a', ask: 'Pasul 1 — ΔH pentru arderea unui mol de ' + Cn(mn[1]), a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r, true) },
          { id: 'b', ask: 'Răspunsul — căldura degajată la arderea a ' + nmol + ' moli de ' + Cn(mn[1]), a: Q, unit: 'kJ', dec: 1, tol: 0.005, steps: ['Pe ecuație: $' + N(mn[0], 1) + ' mol$ ' + C(mn[1]) + ' ⟹ $|ΔH| = ' + N(Math.abs(dH), 1) + ' kJ$.', '$|Q| = (' + nmol + ' · ' + N(Math.abs(dH), 1) + ')//(' + N(mn[0], 1) + ') = <b>' + N(Q, 1) + ' kJ</b>$.'] }]
      };
    }
    if (level === 2) {
      var comps = r.L.concat(r.R).map(function (p) { return p[1]; }).filter(isComp).filter(function (f, i, a) { return a.indexOf(f) === i; });
      var u = R.pick(comps), inR = r.L.some(function (p) { return p[1] === u; }), nu = (inR ? r.L : r.R).filter(function (p) { return p[1] === u; })[0][0];
      var others = comps.filter(function (f) { return f !== u; });
      var P_known = r.R.reduce(function (s, p) { return s + (p[1] === u ? 0 : p[0] * T.HF[p[1]]); }, 0), R_known = r.L.reduce(function (s, p) { return s + (p[1] === u ? 0 : p[0] * T.HF[p[1]]); }, 0);
      var x = inR ? (P_known - R_known - dH) / nu : (dH + R_known - P_known) / nu;
      var v = others.length ? R.pick(others) : null;
      var chips = hfChips(r, u);
      var parts = [{
        id: 'a', ask: '$ΔH_f$(' + C(u) + ')', a: x, unit: 'kJ/mol', dec: 1, tol: 0.004, steps: [
          'Scriu formula: $ΔH = Σ ν_P·ΔH_f(P) − Σ ν_R·ΔH_f(R)$ și înlocuiesc ce cunosc ($ΔH_f$ pentru elemente = 0).',
          'Termenii cunoscuți: produși ' + (knownTerms(r.R, u) || '0') + '; reactanți ' + (knownTerms(r.L, u) || '0') + '; necunoscuta ' + N(nu, 1) + '·x este la ' + (inR ? 'reactanți' : 'produși') + '.',
          inR ? '$' + N(dH, 1) + ' = [' + N(P_known, 2) + '] − [' + N(R_known, 2) + ' + ' + N(nu, 1) + '·x]$' : '$' + N(dH, 1) + ' = [' + N(P_known, 2) + ' + ' + N(nu, 1) + '·x] − [' + N(R_known, 2) + ']$',
          '$x = ΔH_f(' + nm(u) + ') = <b>' + N(x, 1) + ' kJ/mol</b>$.']
      }];
      if (v) {
        var smaller = x < T.HF[v] ? u : v;
        parts.push({ id: 'b', type: 'mc', ask: 'Care dintre ' + C(u) + ' și ' + C(v) + ' ($ΔH_f$ = ' + N(T.HF[v], 1) + ' kJ/mol) este mai stabilă?', opts: [nm(u), nm(v), 'au aceeași stabilitate', 'nu se poate stabili'], correct: smaller === u ? 0 : 1, noShuffle: true,
          steps: ['$ΔH_f(' + nm(u) + ') = ' + N(x, 1) + '$ și $ΔH_f(' + nm(v) + ') = ' + N(T.HF[v], 1) + '$. Este mai stabilă substanța cu $ΔH_f$ <b>mai mică (mai negativă)</b>: ' + nm(smaller) + '.'] });
      }
      return { statement: '<p>' + cap(r.n) + ' are loc conform ecuației:</p>' + eqNoQ(r) + '<p>Se cunoaște variația de entalpie a reacției: $ΔH = ' + N(dH, 1) + ' kJ$.</p>' + qp('a', 'Determinați entalpia molară de formare standard a ' + T.cgen(u) + '.') + (v ? qp('b', 'Precizați care dintre substanțele ' + C(u) + ' și ' + C(v) + ' este mai stabilă.') : ''), data: chips, method: 'Scrii formula pentru $ΔH$ cu o necunoscută $x$ și o rezolvi.', parts: parts };
    }
    // nivel 3
    var mn3 = mainReactant(r), M3 = T.massOf(mn3[1]), kk = R.pick([0.5, 1, 2, 3]), m3 = kk * mn3[0] * M3, Q3 = kk * Math.abs(dH);
    var gp = r.R.filter(function (p) { return T.isGas(p[1]); })[0], V3 = kk * gp[0] * 22.4;
    return { statement: '<p>' + cap(r.n) + ' are loc conform ecuației:</p>' + eqNoQ(r) + qp('a', 'Determinați variația de entalpie în condiții standard pentru această reacție.') + qp('b', 'Calculați cantitatea de căldură ' + (exo ? 'degajată' : 'absorbită') + ' în reacția a <b>' + N(m3, 1) + ' g</b> de ' + Cn(mn3[1]) + ', ' + R.pick(TOTAL) + '.') + qp('c', 'Calculați volumul de ' + Cn(gp[1]) + ' (c.n.) care se formează în același timp.'),
      data: hfChips(r).concat(mchips([mn3[1]]), ['$V_m = 22,4 L/mol$ (c.n.)']), method: 'a) $ΔH$ din $ΔH_f$. b) g → mol → proporție cu $|ΔH|$. c) din coeficienții ecuației: $ν_{gaz}$ pentru aceeași cantitate de reactant.', tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
      parts: [{ id: 'a', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r) },
        { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Q3, unit: 'kJ', dec: 1, tol: 0.005, steps: ['$ν = (' + N(m3, 1) + ')//(' + N(M3, 1) + ') = ' + N(m3 / M3, 3) + ' mol$; pe ecuație: $' + N(mn3[0], 1) + ' mol$ ' + C(mn3[1]) + ' ⟹ $|ΔH| = ' + N(Math.abs(dH), 1) + ' kJ$.', '$|Q| = (' + N(m3 / M3, 3) + ' · ' + N(Math.abs(dH), 1) + ')//(' + N(mn3[0], 1) + ') = <b>' + N(Q3, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Volumul de ' + C(gp[1]) + ' (c.n.)', a: V3, unit: 'L', dec: 1, steps: ['Pe ecuație: $' + N(mn3[0], 1) + ' mol$ ' + C(mn3[1]) + ' ⟹ $' + N(gp[0], 1) + ' mol$ ' + C(gp[1]) + '. Pentru $' + N(m3 / M3, 3) + ' mol$ de reactant: $ν_{gaz} = ' + N(kk * gp[0], 2) + ' mol$.', '$V = ν · 22,4 = ' + N(kk * gp[0], 2) + ' · 22,4 = <b>' + N(V3, 1) + ' L</b>$.'] }] };
  }

  reg({
    id: 'entalpii-formare', short: 'ΔH din căldurile de formare', title: 'Căldura de reacție din căldurile de formare',
    blurb: 'ΔH = Σ(produși) − Σ(reactanți); căldura pentru n moli; ΔH_f necunoscut; stabilitate; identificarea unei hidrocarburi din ΔH_f și ΔH de ardere.',
    skill: '$ΔH_r = ΣνΔH_f(P) − ΣνΔH_f(R)$',
    intro: T.callout('warn', '<b>Notație:</b> $ΔH°_f$ (sau $ΔH_f$) este entalpia molară de formare standard. <b>Atenție:</b> (1) înmulțește fiecare $ΔH_f$ cu <b>coeficientul</b> din ecuație; (2) <b>produși − reactanți</b> (nu invers: reactanții se „desfac” în elemente, iar produșii se formează din elemente, lecția 11); (3) elementele au $ΔH_f = 0$; (4) pentru $n$ mol dintr-o substanță, raportezi la coeficientul ei din ecuație (proporție).'),
    original: formOriginal, make: formMake
  });

  /* =====================================================
     8. Mărimi calorimetrice
     ===================================================== */
  var SUB = [
    { n: 'apă', M: 18, c: 4.184 }, { n: 'aluminiu', M: 27, c: 0.9 }, { n: 'fier', M: 56, c: 0.45 },
    { n: 'cupru', M: 64, c: 0.385 }, { n: 'plumb', M: 207, c: 0.13 }, { n: 'etanol', M: 46, c: 2.44 }
  ];
  function calOriginal() {
    var m = 200, c = 4.184, dT = 60, Q = m * c * dT, Cc = m * c, Cm = 18 * c;
    return {
      statement: '<p>Se încălzesc <b>200 g</b> de apă de la temperatura de <b>20 °C</b> la temperatura de <b>80 °C</b> ($c_{H_2O} = 4,184 J/(g·K)$, $M_{H_2O} = 18 g/mol$).</p>' + qp('a', 'Calculați variația de temperatură $ΔT$.') + qp('b', 'Calculați cantitatea de căldură (în kJ) primită de apă.') + qp('c', 'Calculați capacitatea calorică a acestei cantități de apă (în J/K).') + qp('d', 'Calculați căldura specifică molară a apei (în J/(mol·K)).'),
      method: 'Folosește pe rând: $ΔT = t_f − t_i$; $Q = m·c·ΔT$; $C = Q/ΔT$; $c_m = Q/(ν·ΔT)$.',
      parts: [{ id: 'a', ask: 'ΔT', a: 60, unit: 'K', dec: 0, steps: ['$ΔT = 80 − 20 = <b>60 K</b>$ (aceeași valoare ca în °C).'] },
        { id: 'b', ask: 'Căldura primită', a: Q / 1000, unit: 'kJ', dec: 3, steps: ['$Q = m·c·ΔT = 200 · 4,184 · 60 = 50 208 J = <b>50,208 kJ</b>$.'] },
        { id: 'c', ask: 'Capacitatea calorică C', a: Cc, unit: 'J/K', dec: 1, steps: ['$C = (Q)//(ΔT) = (50208)//(60) = <b>836,8 J/K</b>$.'] },
        { id: 'd', ask: 'Căldura specifică molară', a: Cm, unit: 'J/(mol·K)', dec: 2, steps: ['$ν = (m)//(M) = (200)//(18) = 11,11 mol$.', '$c_m = (Q)//(ν·ΔT) = (50208)//(11,11 · 60) = <b>75,31 J/(mol·K)</b>$ (căldura pe mol, nu pe gram).'] }]
    };
  }
  function calMake(seed, level) {
    var R = T.rng(seed), s = R.pick(SUB), m = R.step(50, 500, 25), t1 = R.pick([10, 15, 18, 20, 25]), t2 = t1 + R.pick([20, 30, 40, 50, 60]), dT = t2 - t1;
    if (level === 1) {
      var Q = m * s.c * dT;
      return { statement: '<p>Se încălzește o probă de <b>' + m + ' g</b> de ' + s.n + ' ($c = ' + N(s.c, 3) + ' J/(g·K)$) de la temperatura de <b>' + t1 + ' °C</b> la temperatura de <b>' + t2 + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură (în kJ) necesară încălzirii probei.') + qp('b', 'Calculați capacitatea calorică a probei (în J/K).'), method: '$Q = m·c·ΔT$ și $C = Q/ΔT$.',
        parts: [{ id: 'a', ask: 'Căldura necesară', a: Q / 1000, unit: 'kJ', dec: 3, steps: ['$ΔT = ' + t2 + ' − ' + t1 + ' = ' + dT + ' K$.', '$Q = m·c·ΔT = ' + m + ' · ' + N(s.c, 3) + ' · ' + dT + ' = ' + N(Q, 1) + ' J = <b>' + N(Q / 1000, 3) + ' kJ</b>$.'] },
          { id: 'b', ask: 'Capacitatea calorică C', a: m * s.c, unit: 'J/K', dec: 2, steps: ['$C = (Q)//(ΔT) = (' + N(m * s.c * dT, 1) + ')//(' + dT + ') = <b>' + N(m * s.c, 2) + ' J/K</b>$.'] }] };
    }
    if (level === 2) {
      var Qj = Math.round(m * s.c * dT / 10) * 10, cc = Qj / (m * dT), opts = R.shuffle(SUB.map(function (x) { return x.n; }).filter(function (x, i) { return i < 4 || x === s.n; })).slice(0, 4);
      if (opts.indexOf(s.n) < 0) opts[0] = s.n; opts = R.shuffle(opts);
      var tbl = SUB.map(function (x) { return x.n + ' ' + N(x.c, 3); }).join(' · ');
      return { statement: '<p>Un corp metalic sau lichid de <b>' + m + ' g</b> primește <b>' + N(Qj, 0) + ' J</b> și temperatura lui crește de la <b>' + t1 + ' °C</b> la <b>' + t2 + ' °C</b>. Se cunosc căldurile specifice (în J/(g·K)): ' + tbl + '.</p>' + qp('a', 'Calculați capacitatea calorică a corpului.') + qp('b', 'Calculați căldura specifică a substanței din care este format corpul.') + qp('c', 'Precizați din ce substanță este format corpul.'),
        method: '$C = Q/ΔT$ și $c = Q/(m·ΔT)$; compară valoarea cu tabelul.',
        parts: [{ id: 'a', ask: 'Capacitatea calorică C', a: Qj / dT, unit: 'J/K', dec: 2, steps: ['$ΔT = ' + dT + ' K$; $C = (Q)//(ΔT) = (' + N(Qj, 0) + ')//(' + dT + ') = <b>' + N(Qj / dT, 2) + ' J/K</b>$.'] },
          { id: 'b', ask: 'Căldura specifică c', a: cc, unit: 'J/(g·K)', dec: 3, steps: ['$c = (Q)//(m·ΔT) = (' + N(Qj, 0) + ')//(' + m + ' · ' + dT + ') = <b>' + N(cc, 3) + ' J/(g·K)</b>$.'] },
          { id: 'c', type: 'mc', ask: 'Substanța este:', opts: opts, correct: opts.indexOf(s.n), noShuffle: true, steps: ['Valoarea $' + N(cc, 3) + '$ J/(g·K) se potrivește cu <b>' + s.n + '</b> ($' + N(s.c, 3) + '$).'] }] };
    }
    var m3 = R.pick([10, 20, 25, 50, 100]), t0 = -R.pick([5, 10, 15, 20]), tf = R.pick([10, 20, 30]);
    var Q1 = m3 * 2.09 * (0 - t0), Q2 = m3 * 334, Q3 = m3 * 4.184 * tf, Qt = Q1 + Q2 + Q3;
    return { statement: '<p>Se încălzesc <b>' + m3 + ' g</b> de gheață de la temperatura de <b>' + N(t0, 0) + ' °C</b> până la apă lichidă la temperatura de <b>' + tf + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură necesară încălzirii gheții până la 0 °C.') + qp('b', 'Calculați cantitatea de căldură necesară topirii gheții.') + qp('c', 'Calculați cantitatea totală de căldură necesară (în kJ).'), data: ['$c_{gheață} = 2,09 J/(g·K)$', '$c_{apă} = 4,184 J/(g·K)$', '$λ_{topire} = 334 J/g$'], method: 'Trei etape: gheața se încălzește până la 0 °C, apoi se topește (la 0 °C), apoi apa se încălzește.',
      parts: [{ id: 'a', ask: 'Căldura de încălzire a gheții până la 0 °C', a: Q1, unit: 'J', dec: 1, steps: ['$Q_1 = m·c·ΔT = ' + m3 + ' · 2,09 · ' + (0 - t0) + ' = <b>' + N(Q1, 1) + ' J</b>$.'] },
        { id: 'b', ask: 'Căldura de topire', a: Q2, unit: 'J', dec: 0, steps: ['$Q_2 = m·λ = ' + m3 + ' · 334 = <b>' + N(Q2, 0) + ' J</b>$.'] },
        { id: 'c', ask: 'Căldura totală', a: Qt / 1000, unit: 'kJ', dec: 3, steps: ['Apa lichidă: $Q_3 = ' + m3 + ' · 4,184 · ' + tf + ' = ' + N(Q3, 1) + ' J$.', '$Q = Q_1 + Q_2 + Q_3 = ' + N(Q1, 1) + ' + ' + N(Q2, 0) + ' + ' + N(Q3, 1) + ' = ' + N(Qt, 1) + ' J = <b>' + N(Qt / 1000, 3) + ' kJ</b>$.'] }] };
  }
  reg({
    id: 'calorimetrie', short: 'Formule calorimetrice', title: 'Mărimile calorimetrice: $C$, $c$, $c_m$ și $λ$',
    blurb: 'Aplici direct definițiile: Q, capacitatea calorică, căldura specifică, căldura specifică molară, căldura latentă.',
    skill: '$Q = m·c·ΔT$ · $C = Q/ΔT$ · $c_m = Q/(ν·ΔT)$', originalLabel: 'Model rezolvat',
    intro: T.callout('tip', '<b>Alege formula după ce ți se cere:</b> temperatura se schimbă ⟹ $Q = m·c·ΔT$; corp întreg ⟹ $C = Q/ΔT$; pe mol ⟹ $c_m = Q/(ν·ΔT)$; schimbare de stare ⟹ $Q = m·λ$ (sau $ν·λ$). Nu uita: $ΔT$ în °C = $ΔT$ în K.'),
    original: calOriginal, make: calMake
  });

  /* =====================================================
     9. Amestecare — echilibru termic
     ===================================================== */
  function mixOriginal() {
    var c = 4.18, Tf = (200 * 80 + 300 * 20) / 500, Q1 = 200 * c * (80 - Tf);
    return {
      statement: '<p>Într-un sistem izolat se amestecă <b>200 g</b> de apă la <b>80 °C</b> cu <b>300 g</b> de apă la <b>20 °C</b> ($c_{H_2O} = 4,18 J/(g·K)$).</p>' + qp('a', 'Calculați temperatura finală a amestecului.') + qp('b', 'Calculați cantitatea de căldură (în kJ) cedată de apa caldă.'),
      method: '$Q_{cedată} = Q_{primită}$, cu $Q = m·c·ΔT$ și aceeași substanță ⟹ $c$ se simplifică.',
      parts: [{ id: 'a', ask: 'Temperatura finală', a: Tf, unit: '°C', dec: 1, steps: ['Apa caldă cedează: $Q_1 = 200 · c · (80 − t_f)$; apa rece primește: $Q_2 = 300 · c · (t_f − 20)$.', 'Egalăm: $200 (80 − t_f) = 300 (t_f − 20)$ ⟹ $16000 − 200 t_f = 300 t_f − 6000$.', '$500 t_f = 22000$ ⟹ $t_f = <b>44 °C</b>$'] },
        { id: 'b', ask: 'Căldura cedată de apa caldă', a: Q1 / 1000, unit: 'kJ', dec: 2, steps: ['$Q_1 = m·c·(80 − t_f) = 200 · 4,18 · 36 = 30 096 J = <b>30,1 kJ</b>$.'] }]
    };
  }
  function mixMake(seed, level) {
    var R = T.rng(seed);
    if (level === 1) {
      var m1 = R.step(100, 400, 50), m2 = R.step(100, 400, 50), T1 = R.pick([60, 70, 80, 90]), T2 = R.pick([10, 15, 20, 25]), c = 4.18;
      var Tf = (m1 * T1 + m2 * T2) / (m1 + m2), Q1 = m1 * c * (T1 - Tf);
      return { statement: '<p>Într-un sistem izolat se amestecă <b>' + m1 + ' g</b> de apă la <b>' + T1 + ' °C</b> cu <b>' + m2 + ' g</b> de apă la <b>' + T2 + ' °C</b> ($c_{H_2O} = 4,18 J/(g·K)$).</p>' + qp('a', 'Calculați temperatura finală a amestecului.') + qp('b', 'Calculați cantitatea de căldură (în kJ) cedată de apa caldă.'), method: '$Q_1 + Q_2 = 0$ cu $Q = m·c·ΔT$; aceeași substanță ⟹ $c$ se simplifică.',
        parts: [{ id: 'a', ask: 'Temperatura finală', a: Tf, unit: '°C', dec: 1, steps: ['Apa caldă cedează, apa rece primește (aceeași substanță ⟹ $c$ se simplifică): $m_1 (t_1 − t_f) = m_2 (t_f − t_2)$.', 'Cu valorile: $' + m1 + ' (' + T1 + ' − t_f) = ' + m2 + ' (t_f − ' + T2 + ')$ ⟹ $' + (m1 + m2) + ' · t_f = ' + (m1 * T1 + m2 * T2) + '$.', '$t_f = (' + (m1 * T1 + m2 * T2) + ')//(' + (m1 + m2) + ') = <b>' + N(Tf, 2) + ' °C</b>$.'] },
          { id: 'b', ask: 'Căldura cedată', a: Q1 / 1000, unit: 'kJ', dec: 2, steps: ['$Q = m_1 c (t_1 − t_f) = ' + m1 + ' · 4,18 · ' + N(T1 - Tf, 2) + ' = ' + N(Q1, 1) + ' J = <b>' + N(Q1 / 1000, 2) + ' kJ</b>$.'] }] };
    }
    if (level === 2) {
      var s = R.pick(SUB.slice(1, 5)), mm = R.pick([100, 150, 200, 250]), Tm = R.pick([80, 90, 100]), mw = R.pick([200, 300, 400, 500]), Tw = R.pick([15, 20, 25]);
      var A = mm * s.c, B = mw * 4.184, Tf2 = (A * Tm + B * Tw) / (A + B), Qw = B * (Tf2 - Tw);
      return { statement: '<p>Un bloc de <b>' + s.n + '</b> de <b>' + mm + ' g</b> ($c = ' + N(s.c, 3) + ' J/(g·K)$) încălzit la <b>' + Tm + ' °C</b> este introdus în <b>' + mw + ' g</b> de apă la <b>' + Tw + ' °C</b> ($c = 4,184 J/(g·K)$), într-un sistem izolat (se neglijează recipientul).</p>' + qp('a', 'Calculați temperatura de echilibru.') + qp('b', 'Calculați cantitatea de căldură (în J) primită de apă.'), method: '$m_1 c_1 (t_1 − t_f) = m_2 c_2 (t_f − t_2)$; rezolvi pentru $t_f$.',
        parts: [{ id: 'a', ask: 'Temperatura de echilibru', a: Tf2, unit: '°C', dec: 2, steps: ['Metalul cedează: $' + N(A, 2) + ' (' + Tm + ' − t_f)$; apa primește: $' + N(B, 2) + ' (t_f − ' + Tw + ')$.', 'Egalez: $' + N(A, 2) + ' (' + Tm + ' − t_f) = ' + N(B, 2) + ' (t_f − ' + Tw + ')$ ⟹ $' + N(A + B, 2) + ' · t_f = ' + N(A * Tm + B * Tw, 2) + '$.', '$t_f = (' + N(A * Tm + B * Tw, 2) + ')//(' + N(A + B, 2) + ') = <b>' + N(Tf2, 2) + ' °C</b>$.'] },
          { id: 'b', ask: 'Căldura primită de apă', a: Qw, unit: 'J', dec: 0, steps: ['$Q = m c (t_f − t_i) = ' + N(B, 2) + ' · ' + N(Tf2 - Tw, 2) + ' = <b>' + N(Qw, 0) + ' J</b>$.'] }] };
    }
    var v = R.pick(['cal', 'masa']);
    if (v === 'cal') {
      var s3 = R.pick(SUB.slice(1, 5)), mw3 = R.pick([150, 200, 250]), Tw3 = R.pick([18, 20, 22]), Ccal = R.pick([80, 100, 120]), mx = R.pick([80, 100, 150]), Tx = R.pick([95, 100]), cx = s3.c;
      var Tf3 = (mx * cx * Tx + (mw3 * 4.18 + Ccal) * Tw3) / (mx * cx + mw3 * 4.18 + Ccal), Qp = (mw3 * 4.18 + Ccal) * (Tf3 - Tw3);
      Tf3 = T.round(Tf3, 1); var cxc = (mw3 * 4.18 + Ccal) * (Tf3 - Tw3) / (mx * (Tx - Tf3));
      return { statement: '<p>Un vas cu capacitatea calorică <b>' + Ccal + ' J/K</b> conține <b>' + mw3 + ' g</b> de apă la <b>' + Tw3 + ' °C</b> ($c = 4,18 J/(g·K)$). Se introduce un corp metalic de <b>' + mx + ' g</b>, încălzit la <b>' + Tx + ' °C</b>. Temperatura de echilibru este <b>' + N(Tf3, 1) + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură (în J) primită de apă și de vas.') + qp('b', 'Calculați căldura specifică a metalului (în J/(g·K)).'), method: 'Primesc căldură: apa ($m c ΔT$) și vasul ($C·ΔT$). Metalul cedează $m·c_x·(t_x − t_f)$. Egalezi.',
        parts: [{ id: 'a', ask: 'Căldura primită de apă + vas', a: (mw3 * 4.18 + Ccal) * (Tf3 - Tw3), unit: 'J', dec: 0, steps: ['$ΔT = ' + N(Tf3, 1) + ' − ' + Tw3 + ' = ' + N(Tf3 - Tw3, 1) + ' K$.', '$Q = (m·c + C)·ΔT = (' + mw3 + ' · 4,18 + ' + Ccal + ') · ' + N(Tf3 - Tw3, 1) + ' = <b>' + N((mw3 * 4.18 + Ccal) * (Tf3 - Tw3), 0) + ' J</b>$.'] },
          { id: 'b', ask: 'Căldura specifică a metalului', a: cxc, unit: 'J/(g·K)', dec: 3, tol: 0.03, steps: ['Metalul cedează aceeași căldură: $m·c_x·(t_x − t_f) = Q$.', '$c_x = (Q)//(m·(t_x − t_f)) = (' + N((mw3 * 4.18 + Ccal) * (Tf3 - Tw3), 0) + ')//(' + mx + ' · ' + N(Tx - Tf3, 1) + ') = <b>' + N(cxc, 3) + ' J/(g·K)</b>$.'] }] };
    }
    var m1b = R.pick([200, 250, 300]), T1b = R.pick([80, 90]), T2b = R.pick([10, 15, 20]), Tt = R.pick([40, 45, 50]);
    var m2b = m1b * (T1b - Tt) / (Tt - T2b);
    return { statement: '<p>Într-un sistem izolat se amestecă apă la <b>' + T2b + ' °C</b> cu <b>' + m1b + ' g</b> de apă la <b>' + T1b + ' °C</b>, iar temperatura finală a amestecului este <b>' + Tt + ' °C</b>.</p>' + qp('a', 'Calculați masa de apă rece care a fost adăugată.'), method: '$Q_{cedată} = Q_{primită}$ ⟹ $m_1 (t_1 − t_f) = m_2 (t_f − t_2)$; scoți $m_2$.',
      parts: [{ id: 'a', ask: 'Masa de apă rece', a: m2b, unit: 'g', dec: 1, steps: ['Apa caldă cedează: $' + m1b + ' · c · (' + T1b + ' − ' + Tt + ')$; apa rece primește: $m_2 · c · (' + Tt + ' − ' + T2b + ')$.', '$' + m1b + ' · ' + (T1b - Tt) + ' = m_2 · ' + (Tt - T2b) + '$ ⟹ $m_2 = (' + (m1b * (T1b - Tt)) + ')//(' + (Tt - T2b) + ') = <b>' + N(m2b, 1) + ' g</b>$.'] }] };
  }
  reg({
    id: 'amestec', short: 'Amestecare / echilibru', title: 'Amestecarea corpurilor: echilibru termic',
    blurb: 'Temperatura finală, căldurile schimbate, căldura specifică a unui metal.',
    skill: '$Q_{cedată} = Q_{primită}$', originalLabel: 'Model rezolvat',
    intro: T.callout('key', '<b>Metoda:</b> notează $t_f$ necunoscută; pentru fiecare corp $Q = m·c·(t_f − t_i)$; pune $Q_1 + Q_2 = 0$ (sau $Q_{cedat} = Q_{primit}$ în modul).'),
    original: mixOriginal, make: mixMake
  });

  /* =====================================================
     10. Primul principiu al termodinamicii
     ===================================================== */
  function p1Original() {
    return {
      statement: '<p>Un gaz primește <b>800 J</b> sub formă de căldură și efectuează un lucru mecanic de <b>300 J</b>.</p>' + qp('a', 'Calculați variația energiei interne a gazului.') + qp('b', 'Dacă același gaz ar fi încălzit cu aceeași căldură într-un vas rigid ($V = ct.$), calculați $ΔU$.'),
      method: '$Q = ΔU + L$ ⟹ $ΔU = Q − L$. La volum constant nu se efectuează lucru mecanic.',
      parts: [{ id: 'a', ask: 'ΔU', a: 500, unit: 'J', dec: 0, steps: ['$Q = 800 J$ (primită), $L = 300 J$ (efectuat de gaz).', '$ΔU = Q − L = 800 − 300 = <b>500 J</b>$.'] },
        { id: 'b', ask: 'ΔU la volum constant', a: 800, unit: 'J', dec: 0, steps: ['La $V = ct.$: $ΔV = 0 ⟹ L = 0$, deci $Q_V = ΔU$.', '$ΔU = <b>800 J</b>$ — toată căldura crește energia internă.'] }]
    };
  }
  function p1Make(seed, level) {
    var R = T.rng(seed);
    if (level === 1) {
      var Q = R.step(300, 1500, 50), L = R.step(50, Q - 100, 50), dU = Q - L, pct = L / Q * 100;
      return { statement: '<p>Un gaz primește <b>' + Q + ' J</b> sub formă de căldură și efectuează un lucru mecanic de <b>' + L + ' J</b>.</p>' + qp('a', 'Calculați variația energiei interne $ΔU$.') + qp('b', 'Calculați ce procent din căldura primită se transformă în lucru mecanic.'), method: '$ΔU = Q − L$. Procentul: $(L)//(Q) · 100$.',
        parts: [{ id: 'a', ask: 'ΔU', a: dU, unit: 'J', dec: 0, steps: ['$ΔU = Q − L = ' + Q + ' − ' + L + ' = <b>' + dU + ' J</b>$.'] }, { id: 'b', ask: 'Procentul transformat în lucru', a: pct, unit: '%', dec: 1, steps: ['$(L)//(Q) · 100 = (' + L + ')//(' + Q + ') · 100 = <b>' + N(pct, 1) + '%</b>$.'] }] };
    }
    if (level === 2) {
      var forms = R.shuffle(['cede', 'caldura', 'lucru']).slice(0, 2), parts = [], txt = '', ids = 'ab';
      forms.forEach(function (f, i) {
        var id = ids[i];
        if (f === 'cede') {
          var Qc = R.step(200, 900, 50), r = -Qc;
          txt += qp(id, 'Un sistem cedează <b>' + Qc + ' J</b> mediului și nu efectuează lucru mecanic ($L = 0$). Calculați $ΔU$.');
          parts.push({ id: id, ask: 'ΔU', a: r, unit: 'J', dec: 0, steps: ['Cedează căldură: $Q = −' + Qc + ' J$; $L = 0$.', '$ΔU = Q − L = −' + Qc + ' − 0 = <b>' + N(r, 0) + ' J</b>$.'] });
        } else if (f === 'caldura') {
          var dU2 = R.step(100, 900, 50), L2 = R.step(50, 500, 50), r2 = dU2 + L2;
          txt += qp(id, 'Energia internă a unui gaz crește cu <b>' + dU2 + ' J</b>, iar gazul efectuează un lucru mecanic de <b>' + L2 + ' J</b>. Calculați căldura primită de gaz.');
          parts.push({ id: id, ask: 'Căldura primită', a: r2, unit: 'J', dec: 0, steps: ['$Q = ΔU + L = ' + dU2 + ' + ' + L2 + ' = <b>' + r2 + ' J</b>$.'] });
        } else {
          var Q3 = R.step(200, 800, 50), x = R.step(50, 300, 50), L3 = Q3 + x;
          txt += qp(id, 'Un gaz primește <b>' + Q3 + ' J</b> de căldură, iar energia lui internă <b>scade</b> cu <b>' + x + ' J</b>. Calculați lucrul mecanic efectuat de gaz.');
          parts.push({ id: id, ask: 'Lucrul mecanic efectuat', a: L3, unit: 'J', dec: 0, steps: ['$ΔU = −' + x + ' J$, $Q = ' + Q3 + ' J$.', '$L = Q − ΔU = ' + Q3 + ' − (−' + x + ') = <b>' + L3 + ' J</b>$.'] });
        }
      });
      return { statement: txt, method: 'Scrie $Q = ΔU + L$ ($Q$ = căldura primită de sistem, $L$ = lucrul mecanic efectuat) și află mărimea cerută.', parts: parts };
    }
    var dUk = -R.step(200, 900, 10), pdV = R.pick([1.5, 2, 2.5, 3, 4, 5]), QV = dUk, QP = dUk + pdV;
    return { statement: '<p>O reacție chimică are $ΔU = ' + N(dUk, 0) + ' kJ$ și $pΔV = +' + N(pdV, 1) + ' kJ$.</p>' + qp('a', 'Calculați căldura de reacție la volum constant, $Q_V$.') + qp('b', 'Calculați căldura de reacție la presiune constantă, $Q_P = ΔH$.') + qp('c', 'Precizați care dintre cele două călduri este mai mare (algebric).'),
      method: '$Q_V = ΔU$; $Q_P = ΔU + pΔV = ΔH$.',
      parts: [{ id: 'a', ask: 'Q_V', a: QV, unit: 'kJ', dec: 1, steps: ['La $V = ct.$: $Q_V = ΔU = <b>' + N(QV, 1) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Q_P = ΔH', a: QP, unit: 'kJ', dec: 1, steps: ['$Q_P = ΔH = ΔU + pΔV = ' + N(dUk, 0) + ' + ' + N(pdV, 1) + ' = <b>' + N(QP, 1) + ' kJ</b>$.'] },
        { id: 'c', type: 'mc', ask: 'Care este mai mare?', opts: ['$Q_P > Q_V$', '$Q_P < Q_V$', '$Q_P = Q_V$', 'nu se poate stabili'], correct: 0, noShuffle: true, steps: ['$Q_P − Q_V = pΔV = +' + N(pdV, 1) + ' kJ > 0$ ⟹ $Q_P$ este mai mare (mai puțin negativ).'] }] };
  }
  reg({
    id: 'principiul1', short: 'Primul principiu', title: 'Primul principiu: $Q = ΔU + L$; $Q_V$ și $Q_P$',
    blurb: 'Calcule cu $Q = ΔU + L$ și diferența dintre Q_V și Q_P.',
    skill: '$Q = ΔU + L$ · $Q_P = ΔH$', originalLabel: 'Model rezolvat',
    intro: T.callout('key', '<b>Reține:</b> $Q$ = căldura primită de sistem, $ΔU$ = variația energiei interne, $L$ = lucrul mecanic efectuat. La $V = ct.$: $pΔV = 0$ ⟹ $Q_V = ΔU$. La $p = ct.$: $Q_P = ΔU + pΔV = ΔH$.'),
    original: p1Original, make: p1Make
  });

  /* =====================================================
     11. Diagrame de entalpie
     ===================================================== */
  function dgLevels(R) {
    var HR, HP, HCA, k = 3;
    do { HR = R.step(10, 60, 5); HP = R.step(10, 60, 5); } while (Math.abs(HP - HR) < 10);
    HCA = Math.max(HR, HP) + R.step(15, 30, 5);
    return { HR: HR, HP: HP, HCA: HCA, k: k };
  }
  function dgFig(L) { return T.svgs.energy({ HR: L.HR, HP: L.HP, HCA: L.HCA, neutral: true, caption: false, dh: false, ea: false, vals: { HR: L.HR * L.k, HP: L.HP * L.k, HCA: L.HCA * L.k } }); }
  function dgInst(L, which) {
    var HR = L.HR * L.k, HP = L.HP * L.k, HC = L.HCA * L.k, dH = HP - HR, Ea = HC - HR, exo = dH < 0;
    var mc = { id: 'a', type: 'mc', ask: 'Reacția ($R → P$) este:', opts: ['exotermă', 'endotermă', 'nu se poate stabili', 'are $ΔH = 0$'], correct: exo ? 0 : 1, noShuffle: true, steps: ['$H_P ' + (exo ? '<' : '>') + ' H_R$ ⟹ $ΔH ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? '<b>exotermă</b>' : '<b>endotermă</b>') + '.'] };
    var pdH = { id: 'b', ask: 'ΔH al reacției', a: dH, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$ΔH = H_P − H_R = ' + HP + ' − ' + HR + ' = <b>' + N(dH, 0) + ' kJ/mol</b>$.'] };
    var pEa = { id: 'c', ask: 'Energia de activare E_a', a: Ea, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$E_a = H_{CA}^* − H_R = ' + HC + ' − ' + HR + ' = <b>' + N(Ea, 0) + ' kJ/mol</b>$.'] };
    return { which: which, parts: which === 1 ? [mc, pdH] : which === 2 ? [pdH, pEa] : [mc, pdH, pEa] };
  }
  var DGQ = { a3: ['type', 'dH', 'Ea'], a1: ['type', 'dH'], a2: ['dH', 'Ea'] };
  var DGT = { type: 'Precizați dacă reacția ($R → P$) este exotermă sau endotermă.', dH: 'Determinați variația de entalpie $ΔH$ a reacției.', Ea: 'Determinați energia de activare $E_a$.' };
  function dgLines(which) { return DGQ['a' + which].map(function (k, i) { return qp('abc'[i], DGT[k]); }).join(''); }
  function dgOriginal() {
    var L = { HR: 12, HP: 24, HCA: 38, k: 5 };
    var inst = dgInst(L, 3);
    return { statement: '<p>Diagrama de entalpie a unei reacții este reprezentată mai jos (valori în kJ/mol).</p><div class="qn-fig" style="margin:10px 0;max-width:640px">' + dgFig(L) + '</div>' + dgLines(3),
      method: '$ΔH = H_P − H_R$ (produși − reactanți); $E_a = H_{CA}^* − H_R$ (de la reactanți la vârf).',
      parts: inst.parts.map(function (p, i) { var q = Object.assign({}, p); q.id = 'abc'[i]; return q; }) };
  }
  function dgMake(seed, level) {
    var R = T.rng(seed), L = dgLevels(R);
    if (level === 3) {
      var HR = L.HR * L.k, HP = L.HP * L.k, HC = L.HCA * L.k, dH = HP - HR, Ea = HC - HR, exo = dH < 0;
      return { statement: '<p>Pentru o reacție se cunosc: $H_R = ' + HR + ' kJ/mol$, $ΔH = ' + N(dH, 0) + ' kJ/mol$ și $E_a = ' + Ea + ' kJ/mol$.</p>' + qp('a', 'Calculați entalpia produșilor $H_P$.') + qp('b', 'Calculați entalpia complexului activat $H_{CA}^*$.') + qp('c', 'Precizați dacă reacția este exotermă sau endotermă.'),
        method: '$ΔH = H_P − H_R$ ⟹ $H_P = H_R + ΔH$; $E_a = H_{CA}^* − H_R$ ⟹ $H_{CA}^* = H_R + E_a$.',
        parts: [
          { id: 'a', ask: 'H_P', a: HP, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$H_P = H_R + ΔH = ' + HR + ' + (' + N(dH, 0) + ') = <b>' + HP + ' kJ/mol</b>$.'] },
          { id: 'b', ask: 'H_CA*', a: HC, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$H_{CA}^* = H_R + E_a = ' + HR + ' + ' + Ea + ' = <b>' + HC + ' kJ/mol</b>$.'] },
          { id: 'c', type: 'mc', ask: 'Reacția este:', opts: ['exotermă', 'endotermă', 'nu se poate stabili', 'are $ΔH = 0$'], correct: exo ? 0 : 1, noShuffle: true, steps: ['$ΔH ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? '<b>exotermă</b>' : '<b>endotermă</b>') + '.'] }
        ] };
    }
    var D = dgInst(L, level);
    var parts = D.parts.map(function (p, i) { var q = Object.assign({}, p); q.id = 'abc'[i]; return q; });
    return { statement: '<p>Diagrama de entalpie a unei reacții este reprezentată mai jos (valori în kJ/mol).</p><div class="qn-fig" style="margin:10px 0;max-width:640px">' + dgFig(L) + '</div>' + dgLines(D.which), method: '$ΔH = H_P − H_R$; $E_a = H_{CA}^* − H_R$.', parts: parts };
  }
  reg({
    id: 'diagrame', short: 'Diagrame de entalpie', title: 'Citirea diagramelor de entalpie',
    blurb: 'Din valorile de pe grafic (sau din valorile date): tipul reacției, ΔH, energia de activare.',
    skill: '$ΔH = H_P − H_R$ · $E_a = H_{CA}^* − H_R$', originalLabel: 'Model rezolvat',
    intro: T.callout('key', '<b>Citește în ordine:</b> nivelul reactanților $H_R$, nivelul produșilor $H_P$, vârful $H_{CA}^*$. Apoi: $ΔH = H_P − H_R$ (semnul ⟹ exo/endo) și $E_a = H_{CA}^* − H_R$.'),
    original: dgOriginal, make: dgMake
  });

  /* =====================================================
     12. Descriere → exotermă / endotermă → ecuația termochimică
     ===================================================== */
  /* indiciile din descriere sunt cele din lecțiile 5–6: se degajă / se absoarbe căldură, temperatura crește / scade, trebuie încălzit permanent */
  var SCEN = [
    { r: 'metan', t: 'Metanul arde cu flacără în aer, iar aerul din jurul flăcării se încălzește puternic.' },
    { r: 'magneziu', t: 'O panglică de magneziu, aprinsă, arde cu o flacără orbitoare, iar în jur temperatura crește mult.' },
    { r: 'hidrogen', t: 'Într-un balon, un amestec de hidrogen și oxigen, aprins cu o scânteie, explodează și încălzește puternic aerul din jur.' },
    { r: 'sulf', t: 'Sulful aprins arde în aer cu flacără albastră, iar temperatura vasului în care are loc arderea crește.' },
    { r: 'termita', t: 'Un amestec de aluminiu și oxid de fier(III), aprins, reacționează violent; căldura degajată este atât de mare, încât fierul obținut se topește.' },
    { r: 'neutr', t: 'La amestecarea unei soluții de hidroxid de sodiu cu o soluție de acid sulfuric, temperatura soluției obținute crește.' },
    { r: 'amoniac', t: 'Amoniacul se obține din azot și hidrogen într-un reactor care trebuie răcit permanent, pentru ca temperatura să nu crească.' },
    { r: 'sodiu-apa', t: 'La scurt timp după ce este introdusă într-un cristalizor cu apă, bucata de sodiu se topește și se plimbă pe suprafața apei, sub formă de bobiță sferică, până când se consumă total în reacția cu apa.' },
    { r: 'azot', t: 'În timpul descărcărilor electrice, temperatura aerului din zonă poate depăși 3000 °C. În aceste condiții, azotul și oxigenul din aer se combină.' },
    { r: 'calcar', t: 'Carbonatul de calciu (calcarul) se descompune numai dacă este încălzit permanent, la temperaturi ridicate; dacă încălzirea se oprește, descompunerea se oprește.' },
    { r: 'etan', t: 'Etena se obține industrial din etan, la temperaturi ridicate; dacă încălzirea se întrerupe, reacția se oprește.' },
    { r: 'gazapa', t: 'Vaporii de apă reacționează cu cărbunele numai dacă acesta este menținut permanent incandescent; dacă încălzirea se oprește, cărbunele se răcește și reacția se oprește.' },
    { r: 'apa-desc', t: 'Apa se descompune în elementele ei numai dacă i se furnizează permanent energie (de exemplu prin electroliză); fără energie primită din exterior, reacția se oprește.' },
    { r: 'reformare', t: 'Metanul reacționează cu vaporii de apă numai dacă amestecul este încălzit permanent; dacă încălzirea se oprește, reacția încetează.' }
  ];
  function perturb(r, wrongSide) {
    var rr = { type: wrongSide ? (r.type === 'exo' ? 'endo' : 'exo') : r.type, Q: null, L: r.L.map(function (p) { return [p[0], p[1]]; }), R: r.R.map(function (p) { return [p[0], p[1]]; }) };
    return rr;
  }
  function scenInst(sc, ask) {
    var r = T.RXN[sc.r], exo = r.type === 'exo';
    var right = T.eqStr(r, { Q: null }), flip = T.eqStr(perturb(r, true), { Q: null });
    // ecuație dezechilibrată: modific coeficientul primului produs
    var bad = perturb(r, false), c0 = bad.R[0][0]; bad.R[0][0] = c0 === 1 ? 2 : c0 === 2 ? 1 : c0 + 1;
    var bad2 = perturb(r, true); bad2.R[0][0] = bad.R[0][0];
    var opts = [right, flip, T.eqStr(bad, { Q: null }), T.eqStr(bad2, { Q: null })];
    var typeP = { id: 'a', type: 'mc', ask: 'Reacția este:', opts: ['exotermă', 'endotermă', 'fără efect termic', 'nu se poate stabili'], correct: exo ? 0 : 1,
      steps: ['Din descriere: ' + (exo ? 'în timpul reacției se degajă căldură (temperatura crește, se topește, flăcări, răcire necesară) ⟹ <b>exotermă</b>.' : 'reacția are loc doar dacă i se furnizează permanent căldură (temperaturi ridicate, încălzire continuă) ⟹ ea <b>absoarbe</b> căldură ⟹ <b>endotermă</b>.')] };
    var eqP = { id: 'b', type: 'mc', ask: 'Ecuația termochimică (cu $Q$ = căldura de reacție) este:', opts: opts, correct: 0,
      steps: ['Scriu ecuația echilibrată: ' + T.eqStr(r, { noQ: true }) + '.', exo ? 'Reacția este exotermă ⟹ căldura se degajă ⟹ $Q$ se scrie la <b>produși</b> (în dreapta): ' + right : 'Reacția este endotermă ⟹ căldura se absoarbe ⟹ $Q$ se scrie la <b>reactanți</b> (în stânga): ' + right] };
    return { statement: '<p>' + sc.t + '</p>' + qp('a', 'Precizați dacă reacția descrisă este exotermă sau endotermă.') + qp('b', 'Alegeți ecuația termochimică corectă a reacției (se notează cu $Q$ căldura de reacție).'),
      method: 'Caută în text indiciul: temperatura crește / se degajă căldură ⟹ exotermă; trebuie încălzit permanent / temperatura scade ⟹ endotermă. Apoi scrii ecuația echilibrată și pui $Q$ la produși (exo) sau la reactanți (endo).',
      parts: [typeP, eqP] };
  }
  function descOriginal() {
    var a = SCEN.filter(function (x) { return x.r === 'azot'; })[0], b = SCEN.filter(function (x) { return x.r === 'sodiu-apa'; })[0];
    var ia = scenInst(a), ib = scenInst(b);
    var rename = function (p, id, ask) { var q = Object.assign({}, p); q.id = id; q.ask = ask; return q; };
    return {
      statement: '<p>Sunt descrise mai jos două procese chimice. Precizați dacă sunt reacții exoterme sau endoterme și scrieți ecuațiile lor termochimice.</p>' +
        qp('a', a.t) + qp('b', b.t),
      method: ia.method,
      parts: [rename(ia.parts[0], 'a', 'Procesul a) este o reacție:'), rename(ia.parts[1], 'b', 'Ecuația termochimică a procesului a) este:'), rename(ib.parts[0], 'c', 'Procesul b) este o reacție:'), rename(ib.parts[1], 'd', 'Ecuația termochimică a procesului b) este:')]
    };
  }
  function descMake(seed, level) {
    var R = T.rng(seed);
    if (level === 1) return scenInst(R.pick(SCEN));
    // nivelul 2: două procese (ca în manual); nivelul 3: trei procese
    var cnt = level === 2 ? 2 : 3, kinds = level === 2 ? ['exo', 'endo'] : R.shuffle([['exo', 'exo', 'endo'], ['exo', 'endo', 'endo']])[0];
    var used = {}, list = kinds.map(function (k) {
      var pool = SCEN.filter(function (x) { return T.RXN[x.r].type === k && !used[x.r]; }), x = R.pick(pool); used[x.r] = 1; return x;
    });
    list = R.shuffle(list);
    var words = ['a', 'b', 'c'], parts = [], st = '<p>Sunt descrise mai jos ' + (cnt === 2 ? 'două' : 'trei') + ' procese chimice. Precizați dacă sunt reacții exoterme sau endoterme și scrieți ecuațiile lor termochimice (se notează cu $Q$ căldura de reacție).</p>';
    list.forEach(function (sc, i) {
      var inst = scenInst(sc), n = i + 1;
      st += '<p><b>' + n + ')</b> ' + sc.t + '</p>';
      var q1 = Object.assign({}, inst.parts[0]), q2 = Object.assign({}, inst.parts[1]);
      q1.id = 'abcdef'[2 * i]; q1.ask = 'Procesul ' + n + ') este o reacție:';
      q2.id = 'abcdef'[2 * i + 1]; q2.ask = 'Ecuația termochimică a procesului ' + n + ') este:';
      parts.push(q1, q2);
    });
    return { statement: st, method: 'Pentru fiecare proces: caută indiciul din text (se degajă căldură / trebuie încălzit permanent), apoi alege ecuația echilibrată cu $Q$ la produși (exotermă) sau la reactanți (endotermă).', parts: parts };
  }
  reg({
    id: 'tip-reactie', short: 'Exo / endo + ecuația', title: 'Tipul reacției și ecuația termochimică',
    blurb: 'Pornind de la descrierea unui proces: este exotermă sau endotermă? Unde se scrie $Q$ în ecuația termochimică?',
    skill: 'exo / endo · poziția lui $Q$', originalLabel: 'Model rezolvat',
    intro: T.callout('key', '<b>Indicii în text:</b> se degajă căldură, temperatura crește, flacără, răcire necesară ⟹ <b>exotermă</b> ($Q$ la produși, $ΔH < 0$). Trebuie încălzit permanent, temperatura scade ⟹ <b>endotermă</b> ($Q$ la reactanți, $ΔH > 0$). Ecuația trebuie să fie și <b>echilibrată</b>.'),
    original: descOriginal, make: descMake
  });
})(typeof window !== 'undefined' ? window : globalThis);
