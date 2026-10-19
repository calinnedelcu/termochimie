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
      statement: '<p>Se dau ecuațiile termochimice:</p>' + eqsHtml(cfg.eqs) + '<p><b>a)</b> Calculează $ΔH$ pentru reacția ' + targetStr(cfg.target) + '.</p><p><b>b)</b> Ce masă de metanol se obține, în această reacție, atunci când se degajă <b>1281 kJ</b>? <span class="muted">(M = 32 g/mol)</span></p>',
      data: ['⚠ exercițiu marcat „important” în caiet'],
      method: 'Aranjează ecuațiile ca să obții ținta: ce e la alt capăt decât în țintă se inversează; ce are alt coeficient se înmulțește. Apoi aduni și ecuațiile, și valorile ΔH.',
      tool: { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } },
      parts: [
        { id: 'a', ask: 'ΔH al reacției', a: cfg.dH, unit: 'kJ', dec: 1, tol: 0.006, steps: steps },
        { id: 'b', ask: 'Masa de metanol', a: 320, unit: 'g', dec: 0, steps: ['La reacția din a) se formează $1 mol$ ($32 g$) de ' + C('CH3OH(l)') + ' și se degajă $128,1 kJ$.', 'Proporție: $32 g ... 128,1 kJ$ &nbsp;și&nbsp; $x g ... 1281 kJ$.', '$x = (32 · 1281)//(128,1) = <b>320 g</b>$.'] }
      ]
    };
  }

  function hessMake(seed, level) {
    var R = T.rng(seed), h = R.pick(T.HESS.slice(1)), n = h.eqs.length;
    var perm = R.shuffle(h.eqs.map(function (_, i) { return i; }));
    var scale = 1, rev = false, mode = 'normal';
    if (level === 3) { mode = R.pick(['x2', 'x3', 'rev']); scale = mode === 'x2' ? 2 : mode === 'x3' ? 3 : 1; rev = mode === 'rev'; }
    var cfg = hessBuild(h, perm, scale, rev), steps = hessSteps(cfg), exo = cfg.dH < 0;
    var tool = { name: 'hessCombiner', opts: { eqs: cfg.eqs, target: cfg.target } };
    var intro = '<p>Se dau ecuațiile termochimice:</p>' + eqsHtml(cfg.eqs);
    var typePart = { id: 'b', type: 'mc', ask: 'Reacția din a) este:', opts: ['exotermă', 'endotermă', 'fără efect termic', 'nu se poate stabili'], correct: exo ? 0 : 1, steps: ['$ΔH ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? 'căldura se degajă ⟹ <b>exotermă</b>' : 'căldura se absoarbe ⟹ <b>endotermă</b>') + '.'] };

    if (level === 1) {
      return { statement: intro + '<p><b>a)</b> Calculează $ΔH$ pentru reacția ' + targetStr(cfg.target) + '.</p><p><b>b)</b> Reacția este exotermă sau endotermă?</p>', method: 'Pentru fiecare substanță din țintă caută ecuația în care apare. Parte opusă ⟹ inversezi; alt coeficient ⟹ înmulțești.', tool: tool,
        parts: [{ id: 'a', ask: 'ΔH al reacției', a: cfg.dH, unit: 'kJ', dec: 1, tol: 0.006, steps: steps }, typePart] };
    }
    if (level === 2) {
      var pr = firstProduct(cfg.target), Mp = T.massOf(pr[1]), k = R.pick([1, 2, 3, 4, 5, 10]), Q = T.round(k * Math.abs(cfg.dH), 1), mass = k * pr[0] * Mp;
      return { statement: intro + '<p><b>a)</b> Calculează $ΔH$ pentru reacția ' + targetStr(cfg.target) + '.</p><p><b>b)</b> Ce masă de ' + C(pr[1]) + ' se formează în această reacție atunci când se ' + (exo ? 'degajă' : 'absorb') + ' <b>' + N(Q, 1) + ' kJ</b>?</p>', data: mchips([pr[1]]), method: 'a) Hess. b) La reacția scrisă se formează ' + pr[0] + ' mol din produsul cerut și $|ΔH|$ kJ; apoi proporție.', tool: tool,
        parts: [{ id: 'a', ask: 'ΔH al reacției', a: cfg.dH, unit: 'kJ', dec: 1, tol: 0.006, steps: steps },
          { id: 'b', ask: 'Masa de ' + C(pr[1]), a: mass, unit: 'g', dec: 1, steps: ['Pe ecuație se formează $' + N(pr[0], 1) + ' mol$ ' + C(pr[1]) + ' $= ' + N(pr[0] * Mp, 1) + ' g$ și se ' + (exo ? 'degajă' : 'absorb') + ' $' + N(Math.abs(cfg.dH), 1) + ' kJ$.', 'Proporție: $' + N(pr[0] * Mp, 1) + ' g ... ' + N(Math.abs(cfg.dH), 1) + ' kJ$ &nbsp;și&nbsp; $x ... ' + N(Q, 1) + ' kJ$.', '$x = (' + N(pr[0] * Mp, 1) + ' · ' + N(Q, 1) + ')//(' + N(Math.abs(cfg.dH), 1) + ') = <b>' + N(mass, 1) + ' g</b>$.'] }] };
    }
    var sp = cfg.target.L[0], Ms = T.massOf(sp[1]), j = R.pick([0.5, 1, 2, 3]), ms = j * sp[0] * Ms, Qh = j * Math.abs(cfg.dH);
    return { statement: intro + '<p>Se consideră reacția:</p><div class="eqn">' + targetStr(cfg.target) + '</div><p><b>a)</b> Calculează $ΔH$ pentru această reacție.</p><p><b>b)</b> Ce căldură (kJ) se ' + (exo ? 'degajă' : 'absoarbe') + ' când reacționează <b>' + N(ms, 1) + ' g</b> de ' + C(sp[1]) + ' în reacția de mai sus?</p>', data: mchips([sp[1]]),
      method: 'Mai întâi ecuația dată de enunț (de ex. ținta simplă); apoi aplici regulile: dublezi ⟹ dublezi ΔH; inversezi ⟹ schimbi semnul.', tool: tool,
      parts: [{ id: 'a', ask: 'ΔH al reacției', a: cfg.dH, unit: 'kJ', dec: 1, tol: 0.006, steps: steps },
        { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Qh, unit: 'kJ', dec: 1, steps: ['Pe ecuație reacționează $' + N(sp[0], 1) + ' mol$ ' + C(sp[1]) + ' $= ' + N(sp[0] * Ms, 1) + ' g$ la $|ΔH| = ' + N(Math.abs(cfg.dH), 1) + ' kJ$.', 'Avem $' + N(ms, 1) + ' g$ ⟹ $' + N(ms / (sp[0] * Ms), 2) + '$ din cantitatea de pe ecuație.', '$Q = ' + N(ms / (sp[0] * Ms), 2) + ' · ' + N(Math.abs(cfg.dH), 1) + ' = <b>' + N(Qh, 1) + ' kJ</b>$.'] }] };
  }

  reg({
    id: 'hess', short: 'Legea lui Hess', title: 'Legea lui Hess: calculul lui ΔH din alte ecuații',
    blurb: 'Exercițiul „important” din caiet și variații: inversezi, înmulțești, aduni ecuațiile — și aduni valorile ΔH.',
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
    { n: 'reacția din exercițiul 4/14 (Al + Fe₂O₃)', L: [[2, 'Al(s)'], [1, 'Fe2O3(s)']], R: [[1, 'Al2O3(s)'], [2, 'Fe(s)']] },
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
    r.L.concat(r.R).forEach(function (p) { var f = p[1]; if (isComp(f) && !seen[f] && f !== skip) { seen[f] = 1; out.push('$ΔH_f$(' + C(f) + ') = ' + N(T.HF[f], 1) + ' kJ/mol'); } });
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
  function frStepsDH(r) {
    var a = frArith(r), dH = frDH(r);
    return ['Formula: $ΔH = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$. Elementele au $ΔH_f = 0$ (ca în caiet, ex. [[O2]]).',
      'Produși: $' + a.P + ' = ' + N(a.sp, 2) + '$ kJ. &nbsp; Reactanți: $' + a.R + ' = ' + N(a.sr, 2) + '$ kJ.',
      '$ΔH = ' + N(a.sp, 2) + ' − (' + N(a.sr, 2) + ') = <b>' + N(dH, 2) + ' kJ</b>$ ⟹ ' + (dH < 0 ? 'exotermă.' : 'endotermă.')];
  }
  function mainReactant(r) { var l = r.L.filter(function (p) { return p[1] !== 'O2(g)'; }); return (l.length ? l : r.L)[0]; }

  function formOriginal() {
    var r = FR[0], dH = frDH(r);
    return {
      statement: '<p>Se dă reacția de ardere a metanului:</p>' + eqNoQ(r) + '<p>Se cunosc căldurile de formare: ' + hfChips(r).join('; ') + '.</p><p><b>a)</b> Calculează $ΔH$ pentru reacție.</p><p><b>b)</b> Ce căldură se degajă la arderea a <b>5 mol</b> de metan?</p>',
      data: hfChips(r).concat(['$ΔH_f$([[O2]]) = 0 (element)']), method: '$ΔH = Σ ν·ΔH_f(produși) − Σ ν·ΔH_f(reactanți)$. Nu uita coeficienții și că elementele au $ΔH_f = 0$. La b) înmulțești cu numărul de moli de metan (coeficientul lui în ecuație este 1).',
      tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
      parts: [{ id: 'a', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r) },
        { id: 'b', ask: 'Căldura degajată la arderea a 5 mol de metan', a: 5 * Math.abs(dH), unit: 'kJ', dec: 1, tol: 0.003, steps: ['Pe ecuație: $1 mol$ ' + C('CH4') + ' ⟹ $' + N(Math.abs(dH), 1) + ' kJ$ degajați.', '$|Q| = 5 · ' + N(Math.abs(dH), 1) + ' = <b>' + N(5 * Math.abs(dH), 1) + ' kJ</b>$.'] }]
    };
  }

  function formMake(seed, level) {
    var R = T.rng(seed), r;
    if (level === 3) { var pool = FR.filter(function (x) { return x.R.some(function (p) { return T.isGas(p[1]); }); }); r = R.pick(pool); }
    else r = R.pick(FR);
    var dH = frDH(r), exo = dH < 0, word = exo ? 'degajă' : 'absoarbe';

    if (level === 1) {
      var mn = mainReactant(r), nmol = R.pick([2, 3, 4, 5, 10]), Q = nmol / mn[0] * Math.abs(dH);
      return {
        statement: '<p>Se dă reacția (' + r.n + '):</p>' + eqNoQ(r) + '<p>Se cunosc: ' + hfChips(r).join('; ') + '.</p><p><b>a)</b> Calculează $ΔH$ pentru reacție.</p><p><b>b)</b> Ce căldură se ' + word + ' când reacționează <b>' + nmol + ' mol</b> de ' + C(mn[1]) + '?</p>',
        method: '$ΔH = Σ ν·ΔH_f(produși) − Σ ν·ΔH_f(reactanți)$; elementele au $ΔH_f = 0$. La b) pornești de la ceea ce înseamnă $ΔH$: căldura pentru coeficienții scriși.', tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
        parts: [{ id: 'a', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r) },
          { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Q, unit: 'kJ', dec: 1, tol: 0.005, steps: ['Pe ecuație: $' + N(mn[0], 1) + ' mol$ ' + C(mn[1]) + ' ⟹ $|ΔH| = ' + N(Math.abs(dH), 1) + ' kJ$.', '$|Q| = (' + nmol + ' · ' + N(Math.abs(dH), 1) + ')//(' + N(mn[0], 1) + ') = <b>' + N(Q, 1) + ' kJ</b>$.'] }]
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
      return { statement: '<p>Pentru reacția (' + r.n + '):</p>' + eqNoQ(r) + '<p>se cunoaște $ΔH = ' + N(dH, 1) + ' kJ$. Se mai cunosc: ' + chips.join('; ') + '.</p><p><b>a)</b> Calculează căldura de formare a lui ' + C(u) + '.</p>' + (v ? '<p><b>b)</b> Care dintre ' + C(u) + ' și ' + C(v) + ' este mai stabilă?</p>' : ''), data: chips, method: 'Scrii formula pentru $ΔH$ cu o necunoscută $x$ și o rezolvi.', parts: parts };
    }
    // nivel 3
    var mn3 = mainReactant(r), M3 = T.massOf(mn3[1]), kk = R.pick([0.5, 1, 2, 3]), m3 = kk * mn3[0] * M3, Q3 = kk * Math.abs(dH);
    var gp = r.R.filter(function (p) { return T.isGas(p[1]); })[0], V3 = kk * gp[0] * 22.4;
    return { statement: '<p>Se dă reacția (' + r.n + '):</p>' + eqNoQ(r) + '<p>Se cunosc: ' + hfChips(r).join('; ') + '.</p><p><b>a)</b> Calculează $ΔH$.</p><p><b>b)</b> Ce căldură se ' + word + ' la reacția a <b>' + N(m3, 1) + ' g</b> de ' + C(mn3[1]) + '?</p><p><b>c)</b> Ce volum de ' + C(gp[1]) + ' (c.n.) se formează în același timp?</p>',
      data: mchips([mn3[1]]).concat(['$V_m = 22,4 L/mol$ (c.n.)']), method: 'a) $ΔH$ din $ΔH_f$. b) g → mol → proporție cu $|ΔH|$. c) din coeficienții ecuației: $ν_{gaz}$ pentru aceeași cantitate de reactant.', tool: { name: 'formationCalc', opts: { name: r.n, L: r.L, R: r.R } },
      parts: [{ id: 'a', ask: 'ΔH al reacției', a: dH, unit: 'kJ', dec: 1, tol: 0.003, steps: frStepsDH(r) },
        { id: 'b', ask: 'Căldura ' + (exo ? 'degajată' : 'absorbită'), a: Q3, unit: 'kJ', dec: 1, tol: 0.005, steps: ['$ν = (' + N(m3, 1) + ')//(' + N(M3, 1) + ') = ' + N(m3 / M3, 3) + ' mol$; pe ecuație: $' + N(mn3[0], 1) + ' mol$ ' + C(mn3[1]) + ' ⟹ $|ΔH| = ' + N(Math.abs(dH), 1) + ' kJ$.', '$|Q| = (' + N(m3 / M3, 3) + ' · ' + N(Math.abs(dH), 1) + ')//(' + N(mn3[0], 1) + ') = <b>' + N(Q3, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Volumul de ' + C(gp[1]) + ' (c.n.)', a: V3, unit: 'L', dec: 1, steps: ['Pe ecuație: $' + N(mn3[0], 1) + ' mol$ ' + C(mn3[1]) + ' ⟹ $' + N(gp[0], 1) + ' mol$ ' + C(gp[1]) + '. Pentru $' + N(m3 / M3, 3) + ' mol$ de reactant: $ν_{gaz} = ' + N(kk * gp[0], 2) + ' mol$.', '$V = ν · 22,4 = ' + N(kk * gp[0], 2) + ' · 22,4 = <b>' + N(V3, 1) + ' L</b>$.'] }] };
  }

  reg({
    id: 'entalpii-formare', short: 'ΔH din căldurile de formare', title: 'Căldura de reacție din căldurile de formare',
    blurb: 'ΔH = Σ(produși) − Σ(reactanți); căldura pentru n moli; ΔH_f necunoscut; stabilitate.',
    skill: '$ΔH_r = ΣνΔH_f(P) − ΣνΔH_f(R)$',
    intro: T.callout('warn', '<b>Atenție:</b> (1) înmulțește fiecare $ΔH_f$ cu <b>coeficientul</b> din ecuație; (2) <b>produși − reactanți</b> (nu invers: reactanții se „desfac” în elemente, iar produșii se formează din elemente, lecția 11); (3) elementele au $ΔH_f = 0$; (4) pentru $n$ mol dintr-o substanță, raportezi la coeficientul ei din ecuație (proporție).'),
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
      statement: '<p>Se încălzesc <b>200 g</b> de apă de la <b>20 °C</b> la <b>80 °C</b> ($c = 4,184 J/(g·K)$, $M = 18 g/mol$).</p><p><b>a)</b> Cât este $ΔT$?</p><p><b>b)</b> Ce căldură (kJ) primește apa?</p><p><b>c)</b> Care este capacitatea calorică a acestei cantități de apă (J/K)?</p><p><b>d)</b> Care este căldura specifică molară a apei (J/(mol·K))?</p>',
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
      return { statement: '<p>Se încălzește o probă de <b>' + m + ' g</b> de ' + s.n + ' ($c = ' + N(s.c, 3) + ' J/(g·K)$) de la <b>' + t1 + ' °C</b> la <b>' + t2 + ' °C</b>.</p><p><b>a)</b> Ce căldură (kJ) este necesară?</p><p><b>b)</b> Care este capacitatea calorică a probei (J/K)?</p>', method: '$Q = m·c·ΔT$ și $C = Q/ΔT$.',
        parts: [{ id: 'a', ask: 'Căldura necesară', a: Q / 1000, unit: 'kJ', dec: 3, steps: ['$ΔT = ' + t2 + ' − ' + t1 + ' = ' + dT + ' K$.', '$Q = m·c·ΔT = ' + m + ' · ' + N(s.c, 3) + ' · ' + dT + ' = ' + N(Q, 1) + ' J = <b>' + N(Q / 1000, 3) + ' kJ</b>$.'] },
          { id: 'b', ask: 'Capacitatea calorică C', a: m * s.c, unit: 'J/K', dec: 2, steps: ['$C = (Q)//(ΔT) = (' + N(m * s.c * dT, 1) + ')//(' + dT + ') = <b>' + N(m * s.c, 2) + ' J/K</b>$.'] }] };
    }
    if (level === 2) {
      var Qj = Math.round(m * s.c * dT / 10) * 10, cc = Qj / (m * dT), opts = R.shuffle(SUB.map(function (x) { return x.n; }).filter(function (x, i) { return i < 4 || x === s.n; })).slice(0, 4);
      if (opts.indexOf(s.n) < 0) opts[0] = s.n; opts = R.shuffle(opts);
      var tbl = SUB.map(function (x) { return x.n + ' ' + N(x.c, 3); }).join(' · ');
      return { statement: '<p>Un corp metalic sau lichid de <b>' + m + ' g</b> primește <b>' + N(Qj, 0) + ' J</b> și temperatura lui crește de la <b>' + t1 + ' °C</b> la <b>' + t2 + ' °C</b>.</p><p class="muted">Căldurile specifice (J/(g·K)): ' + tbl + '.</p><p><b>a)</b> Capacitatea calorică a corpului?</p><p><b>b)</b> Căldura specifică?</p><p><b>c)</b> Din ce substanță este corpul?</p>',
        method: '$C = Q/ΔT$ și $c = Q/(m·ΔT)$; compară valoarea cu tabelul.',
        parts: [{ id: 'a', ask: 'Capacitatea calorică C', a: Qj / dT, unit: 'J/K', dec: 2, steps: ['$ΔT = ' + dT + ' K$; $C = (Q)//(ΔT) = (' + N(Qj, 0) + ')//(' + dT + ') = <b>' + N(Qj / dT, 2) + ' J/K</b>$.'] },
          { id: 'b', ask: 'Căldura specifică c', a: cc, unit: 'J/(g·K)', dec: 3, steps: ['$c = (Q)//(m·ΔT) = (' + N(Qj, 0) + ')//(' + m + ' · ' + dT + ') = <b>' + N(cc, 3) + ' J/(g·K)</b>$.'] },
          { id: 'c', type: 'mc', ask: 'Substanța este:', opts: opts, correct: opts.indexOf(s.n), noShuffle: true, steps: ['Valoarea $' + N(cc, 3) + '$ J/(g·K) se potrivește cu <b>' + s.n + '</b> ($' + N(s.c, 3) + '$).'] }] };
    }
    var m3 = R.pick([10, 20, 25, 50, 100]), t0 = -R.pick([5, 10, 15, 20]), tf = R.pick([10, 20, 30]);
    var Q1 = m3 * 2.09 * (0 - t0), Q2 = m3 * 334, Q3 = m3 * 4.184 * tf, Qt = Q1 + Q2 + Q3;
    return { statement: '<p>Se încălzesc <b>' + m3 + ' g</b> de gheață de la <b>' + N(t0, 0) + ' °C</b> până la apă lichidă la <b>' + tf + ' °C</b>.</p>', data: ['$c_{gheață} = 2,09 J/(g·K)$', '$c_{apă} = 4,184 J/(g·K)$', '$λ_{topire} = 334 J/g$'], method: 'Trei etape: gheața se încălzește până la 0 °C, apoi se topește (la 0 °C), apoi apa se încălzește.',
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
      statement: '<p>Într-un sistem izolat se amestecă <b>200 g</b> de apă la <b>80 °C</b> cu <b>300 g</b> de apă la <b>20 °C</b> ($c = 4,18 J/(g·K)$).</p><p><b>a)</b> Care este temperatura finală?</p><p><b>b)</b> Ce căldură (kJ) cedează apa caldă?</p>',
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
      return { statement: '<p>Într-un sistem izolat se amestecă <b>' + m1 + ' g</b> de apă la <b>' + T1 + ' °C</b> cu <b>' + m2 + ' g</b> de apă la <b>' + T2 + ' °C</b> ($c = 4,18 J/(g·K)$).</p><p><b>a)</b> Temperatura finală?</p><p><b>b)</b> Căldura (kJ) cedată de apa caldă?</p>', method: '$Q_1 + Q_2 = 0$ cu $Q = m·c·ΔT$; aceeași substanță ⟹ $c$ se simplifică.',
        parts: [{ id: 'a', ask: 'Temperatura finală', a: Tf, unit: '°C', dec: 1, steps: ['Apa caldă cedează, apa rece primește (aceeași substanță ⟹ $c$ se simplifică): $m_1 (t_1 − t_f) = m_2 (t_f − t_2)$.', 'Cu valorile: $' + m1 + ' (' + T1 + ' − t_f) = ' + m2 + ' (t_f − ' + T2 + ')$ ⟹ $' + (m1 + m2) + ' · t_f = ' + (m1 * T1 + m2 * T2) + '$.', '$t_f = (' + (m1 * T1 + m2 * T2) + ')//(' + (m1 + m2) + ') = <b>' + N(Tf, 2) + ' °C</b>$.'] },
          { id: 'b', ask: 'Căldura cedată', a: Q1 / 1000, unit: 'kJ', dec: 2, steps: ['$Q = m_1 c (t_1 − t_f) = ' + m1 + ' · 4,18 · ' + N(T1 - Tf, 2) + ' = ' + N(Q1, 1) + ' J = <b>' + N(Q1 / 1000, 2) + ' kJ</b>$.'] }] };
    }
    if (level === 2) {
      var s = R.pick(SUB.slice(1, 5)), mm = R.pick([100, 150, 200, 250]), Tm = R.pick([80, 90, 100]), mw = R.pick([200, 300, 400, 500]), Tw = R.pick([15, 20, 25]);
      var A = mm * s.c, B = mw * 4.184, Tf2 = (A * Tm + B * Tw) / (A + B), Qw = B * (Tf2 - Tw);
      return { statement: '<p>Un bloc de <b>' + s.n + '</b> de <b>' + mm + ' g</b> ($c = ' + N(s.c, 3) + ' J/(g·K)$) încălzit la <b>' + Tm + ' °C</b> este introdus în <b>' + mw + ' g</b> de apă la <b>' + Tw + ' °C</b> ($c = 4,184 J/(g·K)$), într-un sistem izolat (se neglijează recipientul).</p><p><b>a)</b> Temperatura de echilibru?</p><p><b>b)</b> Câtă căldură (J) primește apa?</p>', method: '$m_1 c_1 (t_1 − t_f) = m_2 c_2 (t_f − t_2)$; rezolvi pentru $t_f$.',
        parts: [{ id: 'a', ask: 'Temperatura de echilibru', a: Tf2, unit: '°C', dec: 2, steps: ['Metalul cedează: $' + N(A, 2) + ' (' + Tm + ' − t_f)$; apa primește: $' + N(B, 2) + ' (t_f − ' + Tw + ')$.', 'Egalez: $' + N(A, 2) + ' (' + Tm + ' − t_f) = ' + N(B, 2) + ' (t_f − ' + Tw + ')$ ⟹ $' + N(A + B, 2) + ' · t_f = ' + N(A * Tm + B * Tw, 2) + '$.', '$t_f = (' + N(A * Tm + B * Tw, 2) + ')//(' + N(A + B, 2) + ') = <b>' + N(Tf2, 2) + ' °C</b>$.'] },
          { id: 'b', ask: 'Căldura primită de apă', a: Qw, unit: 'J', dec: 0, steps: ['$Q = m c (t_f − t_i) = ' + N(B, 2) + ' · ' + N(Tf2 - Tw, 2) + ' = <b>' + N(Qw, 0) + ' J</b>$.'] }] };
    }
    var v = R.pick(['cal', 'masa']);
    if (v === 'cal') {
      var s3 = R.pick(SUB.slice(1, 5)), mw3 = R.pick([150, 200, 250]), Tw3 = R.pick([18, 20, 22]), Ccal = R.pick([80, 100, 120]), mx = R.pick([80, 100, 150]), Tx = R.pick([95, 100]), cx = s3.c;
      var Tf3 = (mx * cx * Tx + (mw3 * 4.18 + Ccal) * Tw3) / (mx * cx + mw3 * 4.18 + Ccal), Qp = (mw3 * 4.18 + Ccal) * (Tf3 - Tw3);
      Tf3 = T.round(Tf3, 1); var cxc = (mw3 * 4.18 + Ccal) * (Tf3 - Tw3) / (mx * (Tx - Tf3));
      return { statement: '<p>Un vas cu capacitatea calorică <b>' + Ccal + ' J/K</b> conține <b>' + mw3 + ' g</b> de apă la <b>' + Tw3 + ' °C</b> ($c = 4,18 J/(g·K)$). Se introduce un corp metalic de <b>' + mx + ' g</b>, încălzit la <b>' + Tx + ' °C</b>. Temperatura de echilibru este <b>' + N(Tf3, 1) + ' °C</b>.</p><p><b>a)</b> Ce căldură (J) primesc apa și vasul?</p><p><b>b)</b> Care este căldura specifică a metalului (J/(g·K))?</p>', method: 'Primesc căldură: apa ($m c ΔT$) și vasul ($C·ΔT$). Metalul cedează $m·c_x·(t_x − t_f)$. Egalezi.',
        parts: [{ id: 'a', ask: 'Căldura primită de apă + vas', a: (mw3 * 4.18 + Ccal) * (Tf3 - Tw3), unit: 'J', dec: 0, steps: ['$ΔT = ' + N(Tf3, 1) + ' − ' + Tw3 + ' = ' + N(Tf3 - Tw3, 1) + ' K$.', '$Q = (m·c + C)·ΔT = (' + mw3 + ' · 4,18 + ' + Ccal + ') · ' + N(Tf3 - Tw3, 1) + ' = <b>' + N((mw3 * 4.18 + Ccal) * (Tf3 - Tw3), 0) + ' J</b>$.'] },
          { id: 'b', ask: 'Căldura specifică a metalului', a: cxc, unit: 'J/(g·K)', dec: 3, tol: 0.03, steps: ['Metalul cedează aceeași căldură: $m·c_x·(t_x − t_f) = Q$.', '$c_x = (Q)//(m·(t_x − t_f)) = (' + N((mw3 * 4.18 + Ccal) * (Tf3 - Tw3), 0) + ')//(' + mx + ' · ' + N(Tx - Tf3, 1) + ') = <b>' + N(cxc, 3) + ' J/(g·K)</b>$.'] }] };
    }
    var m1b = R.pick([200, 250, 300]), T1b = R.pick([80, 90]), T2b = R.pick([10, 15, 20]), Tt = R.pick([40, 45, 50]);
    var m2b = m1b * (T1b - Tt) / (Tt - T2b);
    return { statement: '<p>Ce masă de apă la <b>' + T2b + ' °C</b> trebuie adăugată la <b>' + m1b + ' g</b> de apă la <b>' + T1b + ' °C</b> pentru ca amestecul să aibă <b>' + Tt + ' °C</b>? (sistem izolat, aceeași substanță)</p>', method: '$Q_{cedată} = Q_{primită}$ ⟹ $m_1 (t_1 − t_f) = m_2 (t_f − t_2)$; scoți $m_2$.',
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
      statement: '<p>Un gaz primește <b>800 J</b> sub formă de căldură și efectuează un lucru mecanic de <b>300 J</b>.</p><p><b>a)</b> Cât este variația energiei interne?</p><p><b>b)</b> Dacă același gaz ar fi încălzit cu aceeași căldură într-un vas rigid ($V = ct.$), cât ar fi $ΔU$?</p>',
      method: '$Q = ΔU + L$ ⟹ $ΔU = Q − L$. La volum constant nu se efectuează lucru mecanic.',
      parts: [{ id: 'a', ask: 'ΔU', a: 500, unit: 'J', dec: 0, steps: ['$Q = 800 J$ (primită), $L = 300 J$ (efectuat de gaz).', '$ΔU = Q − L = 800 − 300 = <b>500 J</b>$.'] },
        { id: 'b', ask: 'ΔU la volum constant', a: 800, unit: 'J', dec: 0, steps: ['La $V = ct.$: $ΔV = 0 ⟹ L = 0$, deci $Q_V = ΔU$.', '$ΔU = <b>800 J</b>$ — toată căldura crește energia internă.'] }]
    };
  }
  function p1Make(seed, level) {
    var R = T.rng(seed);
    if (level === 1) {
      var Q = R.step(300, 1500, 50), L = R.step(50, Q - 100, 50), dU = Q - L, pct = L / Q * 100;
      return { statement: '<p>Un gaz primește <b>' + Q + ' J</b> sub formă de căldură și efectuează un lucru mecanic de <b>' + L + ' J</b>.</p><p><b>a)</b> Cât este $ΔU$?</p><p><b>b)</b> Ce procent din căldura primită se transformă în lucru mecanic?</p>', method: '$ΔU = Q − L$. Procentul: $(L)//(Q) · 100$.',
        parts: [{ id: 'a', ask: 'ΔU', a: dU, unit: 'J', dec: 0, steps: ['$ΔU = Q − L = ' + Q + ' − ' + L + ' = <b>' + dU + ' J</b>$.'] }, { id: 'b', ask: 'Procentul transformat în lucru', a: pct, unit: '%', dec: 1, steps: ['$(L)//(Q) · 100 = (' + L + ')//(' + Q + ') · 100 = <b>' + N(pct, 1) + '%</b>$.'] }] };
    }
    if (level === 2) {
      var forms = R.shuffle(['cede', 'caldura', 'lucru']).slice(0, 2), parts = [], txt = '', ids = 'ab';
      forms.forEach(function (f, i) {
        var id = ids[i];
        if (f === 'cede') {
          var Qc = R.step(200, 900, 50), r = -Qc;
          txt += '<p><b>' + id + ')</b> Un sistem cedează <b>' + Qc + ' J</b> mediului și nu efectuează lucru mecanic ($L = 0$). Cât este $ΔU$?</p>';
          parts.push({ id: id, ask: 'ΔU', a: r, unit: 'J', dec: 0, steps: ['Cedează căldură: $Q = −' + Qc + ' J$; $L = 0$.', '$ΔU = Q − L = −' + Qc + ' − 0 = <b>' + N(r, 0) + ' J</b>$.'] });
        } else if (f === 'caldura') {
          var dU2 = R.step(100, 900, 50), L2 = R.step(50, 500, 50), r2 = dU2 + L2;
          txt += '<p><b>' + id + ')</b> Energia internă a unui gaz crește cu <b>' + dU2 + ' J</b>, iar gazul efectuează un lucru mecanic de <b>' + L2 + ' J</b>. Ce căldură a primit?</p>';
          parts.push({ id: id, ask: 'Căldura primită', a: r2, unit: 'J', dec: 0, steps: ['$Q = ΔU + L = ' + dU2 + ' + ' + L2 + ' = <b>' + r2 + ' J</b>$.'] });
        } else {
          var Q3 = R.step(200, 800, 50), x = R.step(50, 300, 50), L3 = Q3 + x;
          txt += '<p><b>' + id + ')</b> Un gaz primește <b>' + Q3 + ' J</b> de căldură, iar energia lui internă <b>scade</b> cu <b>' + x + ' J</b>. Ce lucru mecanic efectuează gazul?</p>';
          parts.push({ id: id, ask: 'Lucrul mecanic efectuat', a: L3, unit: 'J', dec: 0, steps: ['$ΔU = −' + x + ' J$, $Q = ' + Q3 + ' J$.', '$L = Q − ΔU = ' + Q3 + ' − (−' + x + ') = <b>' + L3 + ' J</b>$.'] });
        }
      });
      return { statement: txt, method: 'Scrie $Q = ΔU + L$ ($Q$ = căldura primită de sistem, $L$ = lucrul mecanic efectuat) și află mărimea cerută.', parts: parts };
    }
    var dUk = -R.step(200, 900, 10), pdV = R.pick([1.5, 2, 2.5, 3, 4, 5]), QV = dUk, QP = dUk + pdV;
    return { statement: '<p>O reacție chimică are $ΔU = ' + N(dUk, 0) + ' kJ$ și $pΔV = +' + N(pdV, 1) + ' kJ$.</p><p><b>a)</b> Cât este căldura de reacție la volum constant, $Q_V$?</p><p><b>b)</b> Cât este căldura de reacție la presiune constantă, $Q_P = ΔH$?</p><p><b>c)</b> Care dintre cele două este mai mare (algebric)?</p>',
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
  function dgOriginal() {
    var L = { HR: 12, HP: 24, HCA: 38, k: 5 };
    var inst = dgInst(L, 3);
    return { statement: '<p>Diagrama de entalpie a unei reacții este reprezentată mai jos (valori în kJ/mol).</p><div class="qn-fig" style="margin:10px 0;max-width:640px">' + dgFig(L) + '</div>',
      method: '$ΔH = H_P − H_R$ (produși − reactanți); $E_a = H_{CA}^* − H_R$ (de la reactanți la vârf).',
      parts: inst.parts.map(function (p, i) { var q = Object.assign({}, p); q.id = 'abc'[i]; return q; }) };
  }
  function dgMake(seed, level) {
    var R = T.rng(seed), L = dgLevels(R);
    if (level === 3) {
      var HR = L.HR * L.k, HP = L.HP * L.k, HC = L.HCA * L.k, dH = HP - HR, Ea = HC - HR, exo = dH < 0;
      return { statement: '<p>Pentru o reacție se cunosc: $H_R = ' + HR + ' kJ/mol$, $ΔH = ' + N(dH, 0) + ' kJ/mol$ și $E_a = ' + Ea + ' kJ/mol$.</p><p><b>a)</b> Cât este $H_P$?</p><p><b>b)</b> Cât este $H_{CA}^*$?</p><p><b>c)</b> Reacția este exotermă sau endotermă?</p>',
        method: '$ΔH = H_P − H_R$ ⟹ $H_P = H_R + ΔH$; $E_a = H_{CA}^* − H_R$ ⟹ $H_{CA}^* = H_R + E_a$.',
        parts: [
          { id: 'a', ask: 'H_P', a: HP, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$H_P = H_R + ΔH = ' + HR + ' + (' + N(dH, 0) + ') = <b>' + HP + ' kJ/mol</b>$.'] },
          { id: 'b', ask: 'H_CA*', a: HC, unit: 'kJ/mol', dec: 0, tol: 0.001, steps: ['$H_{CA}^* = H_R + E_a = ' + HR + ' + ' + Ea + ' = <b>' + HC + ' kJ/mol</b>$.'] },
          { id: 'c', type: 'mc', ask: 'Reacția este:', opts: ['exotermă', 'endotermă', 'nu se poate stabili', 'are $ΔH = 0$'], correct: exo ? 0 : 1, noShuffle: true, steps: ['$ΔH ' + (exo ? '< 0' : '> 0') + '$ ⟹ ' + (exo ? '<b>exotermă</b>' : '<b>endotermă</b>') + '.'] }
        ] };
    }
    var D = dgInst(L, level);
    var parts = D.parts.map(function (p, i) { var q = Object.assign({}, p); q.id = 'abc'[i]; return q; });
    return { statement: '<p>Diagrama de entalpie a unei reacții este reprezentată mai jos (valori în kJ/mol).</p><div class="qn-fig" style="margin:10px 0;max-width:640px">' + dgFig(L) + '</div>', method: '$ΔH = H_P − H_R$; $E_a = H_{CA}^* − H_R$.', parts: parts };
  }
  reg({
    id: 'diagrame', short: 'Diagrame de entalpie', title: 'Citirea diagramelor de entalpie',
    blurb: 'Din valorile de pe grafic (sau din valorile date): tipul reacției, ΔH, energia de activare.',
    skill: '$ΔH = H_P − H_R$ · $E_a = H_{CA}^* − H_R$', originalLabel: 'Model rezolvat',
    intro: T.callout('key', '<b>Citește în ordine:</b> nivelul reactanților $H_R$, nivelul produșilor $H_P$, vârful $H_{CA}^*$. Apoi: $ΔH = H_P − H_R$ (semnul ⟹ exo/endo) și $E_a = H_{CA}^* − H_R$.'),
    original: dgOriginal, make: dgMake
  });
})(typeof window !== 'undefined' ? window : globalThis);
