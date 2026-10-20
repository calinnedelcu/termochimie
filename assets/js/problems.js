/* =========================================================
   problems.js — problemele din caiet + variații (tipurile 1–5)
   Fiecare tip: original() = problema din caiet; make(seed, level) = variație
   level: 1 = ușoară (aceeași structură), 2 = medie, 3 = dificilă
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  var N = function (x, d) { return T.fmt(x, d == null ? 2 : d); };
  var nm = function (f) { return f.replace(/\((s|l|g|aq)\)$/, ''); };
  var C = function (f) { return '[[' + nm(f) + ']]'; };
  function reg(def) { T.problems[def.id] = def; T.problemOrder.push(def.id); }
  function eqBlock(r, o) { return '<div class="eqn ' + r.type + '">' + T.eqStr(r, o) + '</div>'; }
  function mchips(list) { return list.map(function (f) { return 'M(' + C(f) + ') = ' + N(T.massOf(f), 1) + ' g/mol'; }); }
  function side(r) { return r.L.map(function (p) { return { nu: p[0], f: p[1], M: T.massOf(p[1]) }; }); }
  function prod(r) { return r.R.map(function (p) { return { nu: p[0], f: p[1], M: T.massOf(p[1]) }; }); }
  function pickMain(r, R) {
    var l = side(r).filter(function (x) { return x.f !== 'O2(g)'; });
    return R.pick(l.length ? l : side(r));
  }
  function pickProd(r, R, pref) {
    var l = prod(r), s = l.filter(function (x) { return pref === 'gas' ? T.isGas(x.f) : !T.isGas(x.f); });
    return R.pick(s.length ? s : l);
  }
  var CAL = 4.18;
  function kcalToKJ(k) { return k * CAL; }
  var Cn = T.cname;
  /* formulări din manual: «considerând transformarea totală», «nu au loc pierderi de căldură și reacția este totală» */
  var TOTAL = ['considerând transformarea totală', 'considerând că reacția este totală', 'considerând că transformarea este totală'];
  var NOLOSS = 'considerând că nu au loc pierderi de căldură și că reacția este totală';
  function qp(id, txt) { return '<p><b>' + id + ')</b> ' + txt + '</p>'; }

  /* =====================================================
     1. Ecuația termochimică (termita) — regula de trei, cal ↔ J
     ===================================================== */
  var EXO = ['termita', 'carbon', 'metan', 'hidrogen', 'magneziu', 'sulf', 'metanol', 'monoxid', 'etena-h', 'hcl'];

  function termitaOriginal() {
    var r = T.RXN.termita, kcal = 256.57, Qkj = kcalToKJ(kcal), m = 54 * Qkj / 852;
    return {
      statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + qp('a', 'Calculați masa de aluminiu necesară cedării a <b>256,57 kcal</b>, considerând transformarea totală.') + qp('b', 'Calculați cantitatea de căldură degajată în reacția unui mol de Al cu [[Fe2O3]].'),
      data: mchips(['Al(s)']).concat(['1 cal = 4,18 J']),
      tool: { name: 'moleScale', opts: { rxn: 'termita' } },
      method: 'Sub ecuație scrii „pe ecuație”: 2 mol Al = 2·27 g ↔ 852 kJ. Transformi cele 256,57 kcal în kJ (× 4,18 și apoi ÷ 1000, trecând prin cal → J → kJ) și faci proporția.',
      parts: [
        {
          id: 'a', ask: 'Masa de aluminiu', a: m, unit: 'g', dec: 2, steps: [
            'Pe ecuație: $2 mol Al = 2 · 27 = 54 g$ degajă $852 kJ$.',
            'Convertesc căldura din enunț: $256,57 kcal = 256,57 · 10^3 cal$, deci $Q = 256,57 · 10^3 · 4,18 J = 1 072 462,6 J ≈ 1072,46 kJ$.',
            'Proporție: &nbsp; $54 g Al ... 852 kJ$ &nbsp; și &nbsp; $x g Al ... 1072,46 kJ$.',
            '$x = (54 · 1072,46)//(852) ≈ <b>' + N(m, 2) + ' g</b>$ de aluminiu (aprox. 68 g).']
        },
        { id: 'b', ask: 'Căldura degajată la reacția unui mol de Al', a: 426, unit: 'kJ', dec: 1, steps: ['Din ecuație: $2 mol Al ↔ 852 kJ$.', 'Pentru un mol: $852 / 2 = <b>426 kJ</b>$.'] }
      ]
    };
  }

  function termitaMake(seed, level) {
    var R = T.rng(seed), r = T.RXN[R.pick(EXO)], mainSp = pickMain(r, R);
    var stmt = function (qs) { return '<p>' + T.lead(r) + '</p>' + eqBlock(r) + qs; };

    if (level === 1) {
      var k = R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), Q = k * r.Q, kcal = T.round(Q / CAL, 2), Qkj = kcalToKJ(kcal), m = mainSp.nu * mainSp.M * Qkj / r.Q;
      var nme = Cn(mainSp.f);
      return {
        statement: stmt(qp('a', 'Calculați masa de ' + nme + ' necesară cedării a <b>' + N(kcal, 2) + ' kcal</b>, ' + R.pick(TOTAL) + '.') + qp('b', 'Calculați cantitatea de căldură (în kJ) degajată în reacția unui mol de ' + nme + '.')),
        data: mchips([mainSp.f]).concat(['1 cal = 4,18 J']),
        method: 'Pe ecuație: ν mol ↔ Q kJ. Transformă kcal în kJ (× 4,18) și fă proporția.',
        parts: [
          {
            id: 'a', ask: 'Masa de ' + nme, a: m, unit: 'g', dec: 2, steps: [
              'Pe ecuație: $' + N(mainSp.nu, 1) + ' mol$ ' + nme + ' $= ' + N(mainSp.nu, 1) + ' · ' + N(mainSp.M, 1) + ' = ' + N(mainSp.nu * mainSp.M, 1) + ' g$ degajă $' + N(r.Q, 1) + ' kJ$.',
              'Convertesc: $' + N(kcal, 2) + ' kcal = ' + N(kcal, 2) + ' · 10^3 cal$ ⟹ $Q = ' + N(kcal, 2) + ' · 10^3 · 4,18 J = ' + N(Qkj * 1000, 0) + ' J = ' + N(Qkj, 2) + ' kJ$.',
              'Proporție: $' + N(mainSp.nu * mainSp.M, 1) + ' g ... ' + N(r.Q, 1) + ' kJ$ &nbsp;și&nbsp; $x g ... ' + N(Qkj, 2) + ' kJ$.',
              '$x = (' + N(mainSp.nu * mainSp.M, 1) + ' · ' + N(Qkj, 2) + ')//(' + N(r.Q, 1) + ') = <b>' + N(m, 2) + ' g</b>$.']
          },
          { id: 'b', ask: 'Căldura degajată la reacția unui mol de ' + nme, a: r.Q / mainSp.nu, unit: 'kJ', dec: 2, steps: ['$' + N(mainSp.nu, 1) + ' mol ↔ ' + N(r.Q, 1) + ' kJ$.', 'Pentru 1 mol: $' + N(r.Q, 1) + ' / ' + N(mainSp.nu, 1) + ' = <b>' + N(r.Q / mainSp.nu, 2) + ' kJ</b>$.'] }
        ]
      };
    }

    if (level === 2) {
      var forms = R.shuffle(['kcal', 'mass', 'gas']), parts = [], data = [];
      var chosen = [];
      forms.forEach(function (f) {
        if (chosen.length >= 2) return;
        if (f === 'gas' && !prod(r).some(function (x) { return T.isGas(x.f); })) return;
        chosen.push(f);
      });
      var txt = '';
      chosen.forEach(function (f, i) {
        var id = 'ab'[i];
        if (f === 'kcal') {
          var kk = R.pick([0.5, 1, 1.5, 2, 3]), m1 = kk * mainSp.nu * mainSp.M, Qk = kk * r.Q;
          txt += qp(id, 'Calculați cantitatea de căldură, exprimată în <b>kcal</b>, degajată în reacția a <b>' + N(m1, 1) + ' g</b> de ' + Cn(mainSp.f) + '.');
          parts.push({
            id: id, ask: 'Căldura degajată, în kcal', a: Qk / CAL, unit: 'kcal', dec: 2, steps: [
              '$ν = (' + N(m1, 1) + ')//(' + N(mainSp.M, 1) + ') = ' + N(m1 / mainSp.M, 3) + ' mol$ ' + C(mainSp.f) + '.',
              'Pe ecuație $' + N(mainSp.nu, 1) + ' mol ↔ ' + N(r.Q, 1) + ' kJ$, deci pentru $' + N(m1 / mainSp.M, 3) + ' mol$: $Q = ' + N(Qk, 2) + ' kJ$.',
              'Convertesc în kcal: $Q = ' + N(Qk, 2) + ' kJ = ' + N(Qk * 1000, 1) + ' J$; $' + N(Qk * 1000, 1) + ' / 4,18 = ' + N(Qk * 1000 / CAL, 1) + ' cal = <b>' + N(Qk / CAL, 2) + ' kcal</b>$.']
          });
          data = data.concat([mainSp.f]);
        } else if (f === 'mass') {
          var p = pickProd(r, R, 'solid'), kk2 = R.pick([1, 1.5, 2, 2.5, 3, 4]), Q2 = kk2 * r.Q, m2 = kk2 * p.nu * p.M;
          txt += qp(id, 'Calculați masa de ' + Cn(p.f) + ' ce se poate obține, știind că din reacție se degajă <b>' + N(Q2, 1) + ' kJ</b>.');
          parts.push({
            id: id, ask: 'Masa de ' + C(p.f) + ' formată', a: m2, unit: 'g', dec: 2, steps: [
              'Pe ecuație se formează $' + N(p.nu, 1) + ' mol$ ' + C(p.f) + ' $= ' + N(p.nu, 1) + ' · ' + N(p.M, 1) + ' = ' + N(p.nu * p.M, 1) + ' g$ și se degajă $' + N(r.Q, 1) + ' kJ$.',
              'Proporție: $' + N(p.nu * p.M, 1) + ' g ... ' + N(r.Q, 1) + ' kJ$ &nbsp;și&nbsp; $x g ... ' + N(Q2, 1) + ' kJ$.',
              '$x = (' + N(p.nu * p.M, 1) + ' · ' + N(Q2, 1) + ')//(' + N(r.Q, 1) + ') = <b>' + N(m2, 2) + ' g</b>$.']
          });
          data.push(p.f);
        } else {
          var pg = pickProd(r, R, 'gas'), kk3 = R.pick([1, 1.5, 2, 2.5, 3, 4]), Q3 = kk3 * r.Q, V = kk3 * pg.nu * 22.4;
          txt += qp(id, 'Calculați volumul de ' + Cn(pg.f) + ' (c.n.) ce se poate obține, știind că din reacție se degajă <b>' + N(Q3, 1) + ' kJ</b>.');
          parts.push({
            id: id, ask: 'Volumul de ' + C(pg.f) + ' (c.n.)', a: V, unit: 'L', dec: 2, steps: [
              'Pe ecuație se formează $' + N(pg.nu, 1) + ' mol$ ' + C(pg.f) + ' $= ' + N(pg.nu, 1) + ' · 22,4 = ' + N(pg.nu * 22.4, 1) + ' L$ (c.n.) și se degajă $' + N(r.Q, 1) + ' kJ$.',
              'Proporție: $' + N(pg.nu * 22.4, 1) + ' L ... ' + N(r.Q, 1) + ' kJ$ &nbsp;și&nbsp; $x L ... ' + N(Q3, 1) + ' kJ$.',
              '$x = (' + N(pg.nu * 22.4, 1) + ' · ' + N(Q3, 1) + ')//(' + N(r.Q, 1) + ') = <b>' + N(V, 2) + ' L</b>$.']
          });
        }
      });
      return { statement: stmt(txt), data: mchips(data.filter(function (x, i, a) { return a.indexOf(x) === i; })).concat(chosen.indexOf('kcal') >= 0 ? ['1 cal = 4,18 J'] : [], chosen.indexOf('gas') >= 0 ? ['$V_m = 22,4 L/mol$ (c.n.)'] : []), method: 'Pune în față ce spune ecuația (moli → grame sau litri) și căldura ei; apoi proporția.', parts: parts };
    }

    // nivel 3: determini Q din experiment, apoi o folosești
    var kS = R.pick([0.1, 0.2, 0.25, 0.5]), mS = kS * mainSp.nu * mainSp.M, kcalS = T.round(kS * r.Q / CAL, 2);
    var pr = pickProd(r, R, 'solid'), k2 = R.pick([2, 3, 5]), Qb = k2 * r.Q, mb = k2 * pr.nu * pr.M;
    var QeqExp = kcalToKJ(kcalS) * (mainSp.nu * mainSp.M) / mS;
    return {
      statement: '<p>Pentru reacția descrisă de ecuația termochimică</p>' + eqBlock(r, { Q: null }) + '<p>s-a constatat experimental că, în reacția a <b>' + N(mS, 2) + ' g</b> de ' + Cn(mainSp.f) + ', se degajă <b>' + N(kcalS, 2) + ' kcal</b>.</p>' +
        qp('a', 'Determinați căldura $Q$ din ecuația termochimică (în kJ), corespunzătoare coeficienților din ecuație.') +
        qp('b', 'Folosind valoarea lui $Q$ obținută la a), calculați masa de ' + Cn(pr.f) + ' ce se poate obține, știind că din reacție se degajă <b>' + N(Qb, 1) + ' kJ</b>.'),
      data: mchips([mainSp.f, pr.f]).concat(['1 cal = 4,18 J']),
      method: 'Mai întâi afli căldura pentru cantitatea din ecuație (ν·M grame), printr-o proporție: căldura dată corespunde unei cantități mai mici, iar ecuația unei cantități mai mari. Abia apoi o folosești la întrebarea b).',
      parts: [
        {
          id: 'a', ask: 'Căldura din ecuația termochimică', a: r.Q, unit: 'kJ', tol: 0.02, dec: 1, steps: [
            'Convertesc: $' + N(kcalS, 2) + ' kcal = ' + N(kcalS, 2) + ' · 10^3 · 4,18 J = ' + N(kcalToKJ(kcalS), 2) + ' kJ$.',
            'Pe ecuație reacționează $' + N(mainSp.nu, 1) + ' mol = ' + N(mainSp.nu * mainSp.M, 1) + ' g$ ' + C(mainSp.f) + '; experimental am avut doar $' + N(mS, 2) + ' g$.',
            'Proporție: $' + N(mS, 2) + ' g ... ' + N(kcalToKJ(kcalS), 2) + ' kJ$ &nbsp;și&nbsp; $' + N(mainSp.nu * mainSp.M, 1) + ' g ... Q$.',
            '$Q = (' + N(mainSp.nu * mainSp.M, 1) + ' · ' + N(kcalToKJ(kcalS), 2) + ')//(' + N(mS, 2) + ') ≈ <b>' + N(QeqExp, 1) + ' kJ</b>$ (≈ ' + N(r.Q, 1) + ' kJ).']
        },
        {
          id: 'b', ask: 'Masa de ' + C(pr.f) + ' formată', a: mb, unit: 'g', dec: 2, steps: [
            'Pe ecuație se formează $' + N(pr.nu, 1) + ' mol$ ' + C(pr.f) + ' $= ' + N(pr.nu * pr.M, 1) + ' g$ la $Q = ' + N(r.Q, 1) + ' kJ$ (valoarea de la a).',
            '$x = (' + N(pr.nu * pr.M, 1) + ' · ' + N(Qb, 1) + ')//(' + N(r.Q, 1) + ') = <b>' + N(mb, 2) + ' g</b>$.']
        }
      ]
    };
  }

  reg({
    id: 'termita', short: 'Ecuația termochimică', title: 'Calcule pe ecuația termochimică (cal ↔ J, regula de trei)',
    blurb: 'Ce masă de reactant dă o anumită căldură; căldura pe mol. Cu conversii între kcal, cal, J și kJ.',
    skill: 'regula de trei · conversii kcal → kJ',
    intro: T.callout('tip', '<b>Reține:</b> coeficienții din ecuație sunt moli. Scrii sub formule cantitatea „pe ecuație” (ν · M) și căldura din ecuație, iar pe rândul de jos ce ai din enunț. Dacă ți se dă căldura în <b>kcal</b>, o transformi mai întâi în kJ: $1 kcal = 1000 cal ≈ 4,18 kJ$.'),
    original: termitaOriginal, make: termitaMake
  });

  /* =====================================================
     2. Gaze la condiții normale și căldura de reacție (etan)
     ===================================================== */
  var ENDO_GAS = ['etan', 'azot', 'gazapa', 'reformare', 'boudouard', 'amoniac-desc', 'apa-desc'];     // au cel puțin un gaz (altul decât vaporii de apă)
  var VM = 22.4;

  function etanOriginal() {
    var r = T.RXN.etan, V = 448, n = V / VM, Q = n * 137;
    return {
      statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + qp('a', 'Precizați dacă etanul trebuie încălzit sau răcit pentru a se descompune.') + qp('b', 'Calculați cantitatea de căldură necesară descompunerii a <b>448 L</b> (c.n.) de etan, ' + NOLOSS + '.'),
      data: ['$V_m = 22,4 L/mol$ (c.n.)'],
      tool: { name: 'moleScale', opts: { rxn: 'etan' } },
      note: T.callout('note', 'În caiet, rezultatul scris este 2470 kJ, dar $20 · 137 = 2740$ kJ — aici am corectat calculul.', 'Corectură'),
      method: 'Transformă volumul în moli: $ν = V / 22,4$. Apoi ecuația îți dă căldura pentru 1 mol.',
      parts: [
        {
          id: 'a', type: 'mc', ask: 'Etanul trebuie:', opts: ['încălzit, deoarece reacția este endotermă (absoarbe căldură)', 'răcit, deoarece reacția este endotermă (absoarbe căldură)', 'încălzit, deoarece reacția este exotermă (degajă căldură)', 'răcit, deoarece reacția este exotermă (degajă căldură)'], correct: 0,
          steps: ['În ecuație, căldura apare în <b>stânga</b> (la reactanți): $C_2H_6 + 137 kJ → ...$', 'Deci reacția <b>absoarbe</b> căldură din mediu ⟹ <b>endotermă</b> ($Q > 0$, $ΔH > 0$). Fără încălzire, nu are loc.']
        },
        { id: 'b', ask: 'Căldura absorbită', a: Q, unit: 'kJ', dec: 0, steps: ['$ν = (V)//(V_m) = (448)//(22,4) = 20 mol$ etan.', 'Pe ecuație: $1 mol ↔ 137 kJ$.', 'Pentru 20 mol: $Q = 20 · 137 = <b>2740 kJ</b>$.'] }
      ]
    };
  }

  function etanMake(seed, level) {
    var R = T.rng(seed);
    if (level === 1) {
      var r = T.RXN[R.pick(ENDO_GAS)], gs = side(r).concat(prod(r)).filter(function (x) { return T.isGas(x.f); }), sp = R.pick(gs), kind1 = side(r).some(function (x) { return x.f === sp.f; }) ? 'reacționează' : 'se formează';
      var kk = R.pick([0.5, 1, 2, 2.5, 3, 4, 5, 10, 20]), V = kk * sp.nu * VM, Q = kk * r.Q;
      return {
        statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + qp('a', 'Precizați dacă reacția este exotermă sau endotermă.') + qp('b', 'Calculați cantitatea de căldură absorbită când ' + kind1 + ' <b>' + N(V, 1) + ' L</b> (c.n.) de ' + Cn(sp.f) + ', ' + NOLOSS + '.'),
        data: ['$V_m = 22,4 L/mol$ (c.n.)'], method: 'ν = V / 22,4; apoi regula de trei cu căldura din ecuație.',
        parts: [
          { id: 'a', type: 'mc', ask: 'Reacția este:', opts: ['endotermă: $Q$ apare în stânga, căldura se absoarbe', 'exotermă: $Q$ apare în stânga, căldura se degajă', 'endotermă: $Q$ apare în dreapta', 'nu se poate stabili'], correct: 0, steps: ['$Q$ este scris lângă reactanți ⟹ căldura este <b>absorbită</b> ⟹ endotermă.'] },
          {
            id: 'b', ask: 'Căldura absorbită', a: Q, unit: 'kJ', dec: 1, steps: [
              '$ν = (' + N(V, 1) + ')//(22,4) = ' + N(V / VM, 2) + ' mol$ ' + C(sp.f) + '.',
              'Pe ecuație: $' + N(sp.nu, 1) + ' mol ↔ ' + N(r.Q, 1) + ' kJ$.',
              '$Q = (' + N(V / VM, 2) + ' · ' + N(r.Q, 1) + ')//(' + N(sp.nu, 1) + ') = <b>' + N(Q, 1) + ' kJ</b>$.']
          }
        ]
      };
    }
    if (level === 2) {
      var which = R.pick(['etan', 'calcar', 'azot', 'reformare', 'boudouard', 'amoniac-desc', 'apa-desc']), r2 = T.RXN[which];
      var kk2 = R.pick([1, 2, 2.5, 3, 4, 5]), Q2 = kk2 * r2.Q;
      var gr = (side(r2).concat(prod(r2))).filter(function (x) { return T.isGas(x.f); });
      var g1 = R.pick(gr), V2 = kk2 * g1.nu * VM;
      var kind = side(r2).some(function (x) { return x.f === g1.f; }) ? 'consumă' : 'formează';
      return {
        statement: '<p>' + T.lead(r2) + '</p>' + eqBlock(r2) + qp('a', 'Calculați volumul de ' + Cn(g1.f) + ' (c.n.) care se ' + kind + ', dacă se absorb <b>' + N(Q2, 1) + ' kJ</b> și ' + R.pick(['reacția este totală', 'transformarea este totală']) + '.') + qp('b', 'Precizați dacă reacția este exotermă sau endotermă.'),
        data: ['$V_m = 22,4 L/mol$ (c.n.)'], method: 'Pe ecuație: ν·22,4 L ↔ Q. Aici cunoști căldura și cauți volumul.',
        parts: [
          {
            id: 'a', ask: 'Volumul de ' + C(g1.f) + ' (c.n.)', a: V2, unit: 'L', dec: 1, steps: [
              'Pe ecuație: $' + N(g1.nu, 1) + ' mol$ ' + C(g1.f) + ' $= ' + N(g1.nu * VM, 1) + ' L$ (c.n.) ↔ $' + N(r2.Q, 1) + ' kJ$.',
              'Proporție: $' + N(g1.nu * VM, 1) + ' L ... ' + N(r2.Q, 1) + ' kJ$ &nbsp;și&nbsp; $x L ... ' + N(Q2, 1) + ' kJ$.',
              '$x = (' + N(g1.nu * VM, 1) + ' · ' + N(Q2, 1) + ')//(' + N(r2.Q, 1) + ') = <b>' + N(V2, 1) + ' L</b>$.']
          },
          { id: 'b', type: 'mc', ask: 'Reacția este:', opts: ['endotermă (căldura este absorbită)', 'exotermă (căldura este degajată)', 'fără efect termic', 'depinde de volum'], correct: 0, steps: ['$Q$ este în stânga ⟹ absorbită ⟹ endotermă.'] }
        ]
      };
    }
    // nivel 3: masă → căldură și volumul total de gaze produse
    var w = R.pick(['etan', 'calcar', 'amoniac-desc', 'apa-desc']), r3 = T.RXN[w], main = side(r3)[0], kk3 = R.pick([0.5, 1, 1.5, 2, 3, 5, 10]);
    var m3 = kk3 * main.nu * main.M, Q3 = kk3 * r3.Q;
    var ng = prod(r3).filter(function (x) { return T.isGas(x.f); }).reduce(function (s, x) { return s + x.nu; }, 0), Vt = kk3 * ng * VM;
    return {
      statement: '<p>' + T.lead(r3) + '</p>' + eqBlock(r3) + '<p>O probă de <b>' + N(m3, 1) + ' g</b> de ' + Cn(main.f) + ' se descompune total.</p>' + qp('a', 'Calculați cantitatea de căldură absorbită, ' + NOLOSS + '.') + qp('b', 'Calculați <b>volumul total de gaze</b> (c.n.) care rezultă din reacție.'),
      data: mchips([main.f]).concat(['$V_m = 22,4 L/mol$ (c.n.)']), method: 'Mai întâi moli: $ν = m / M$. Apoi căldura prin proporție, iar la gaze numeri câți moli de gaz apar pe ecuație.',
      parts: [
        {
          id: 'a', ask: 'Căldura absorbită', a: Q3, unit: 'kJ', dec: 1, steps: [
            '$ν = (' + N(m3, 1) + ')//(' + N(main.M, 1) + ') = ' + N(m3 / main.M, 3) + ' mol$ ' + C(main.f) + '.',
            'Pe ecuație $' + N(main.nu, 1) + ' mol ↔ ' + N(r3.Q, 1) + ' kJ$.',
            '$Q = ' + N(kk3, 2) + ' · ' + N(r3.Q, 1) + ' = <b>' + N(Q3, 1) + ' kJ</b>$.']
        },
        {
          id: 'b', ask: 'Volumul total de gaze (c.n.)', a: Vt, unit: 'L', dec: 1, steps: [
            'Pe ecuație, produsele gazoase însumează $' + N(ng, 1) + ' mol$ la fiecare $' + N(main.nu, 1) + ' mol$ de reactant.',
            'Avem $' + N(kk3, 2) + '$ × cantitatea de pe ecuație ⟹ $ν_{gaze} = ' + N(kk3 * ng, 2) + ' mol$.',
            '$V = ν · 22,4 = ' + N(kk3 * ng, 2) + ' · 22,4 = <b>' + N(Vt, 1) + ' L</b>$.']
        }
      ]
    };
  }

  reg({
    id: 'etan', short: 'Gaze și volume (c.n.)', title: 'Căldura de reacție și volumele gazelor la condiții normale',
    blurb: 'Volum de gaz → moli → căldură (și invers). Recunoști o reacție endotermă din ecuație.',
    skill: 'ν = V/22,4 · reacții endoterme',
    intro: T.callout('tip', '<b>Reține:</b> la c.n. (condiții normale: 0 °C și 1 atm) un mol de gaz ocupă $22,4$ L ($V_m = 22,4$ L/mol). Transformi volumul în moli, apoi folosești căldura din ecuație pentru acei moli. Dacă $Q$ e în <b>stânga</b> ecuației, reacția este <b>endotermă</b> (absoarbe căldură).'),
    original: etanOriginal, make: etanMake
  });

  /* =====================================================
     3. Moli, milimoli, kilograme (glucoza)
     ===================================================== */
  var ANY = ['carbon', 'metan', 'hidrogen', 'sulf', 'metanol', 'termita', 'magneziu', 'etan', 'calcar', 'azot', 'gazapa', 'amoniac', 'monoxid', 'etena-h', 'hcl', 'so3', 'reformare', 'boudouard', 'amoniac-desc', 'apa-desc', 'no2'];
  function typeOpts(r) {
    var ex = r.type === 'exo';
    return { opts: ['endotermă', 'exotermă', 'fără efect termic', 'nu se poate stabili'], correct: ex ? 1 : 0 };
  }

  function glucozaOriginal() {
    var r = T.RXN.glucoza;
    return {
      statement: '<p>Se consideră ecuația termochimică:</p><div class="eqn exo">' + T.eqStr(r) + '</div><p class="muted">glucoză &nbsp;→&nbsp; acid piruvic</p><p>Alegeți și subliniați varianta corectă din fiecare item.</p>',
      data: ['M(glucoză) = 180 g/mol', '1 mmol = 10⁻³ mol'],
      tool: { name: 'moleScale', opts: { rxn: 'glucoza' } },
      method: 'Convertește milimolii în moli și scrie proporția cu căldura pe mol. La c) afli mai întâi moli, apoi masa $m = ν · M$. Atenție la unitățile din variantele de răspuns.',
      parts: [
        { id: 'a', type: 'mc', ask: 'Reacția de oxidare a glucozei la acid piruvic este:', opts: ['endotermă', 'nu este însoțită de efect termic', 'exotermă', 'ardere vie'], correct: 2, noShuffle: true, steps: ['În ecuație căldura apare în dreapta (la produși): se <b>degajă</b> ⟹ reacție <b>exotermă</b> (varianta C).', 'Reacția are efect termic ($483 kJ$ pe ecuație), deci varianta B nu e corectă.'] },
        { id: 'b', type: 'mc', ask: 'Cantitatea de căldură degajată din oxidarea a 100 mmoli de glucoză este:', opts: ['48,3 kJ', '4830 J', '24,15 kJ', '4,83 kJ'], correct: 0, noShuffle: true, steps: ['$100 mmol = 0,1 mol$.', 'Pe ecuație: $1 mol ↔ 483 kJ$.', '$Q = 0,1 · 483 = <b>48,3 kJ</b>$ (varianta A).', 'Atenție la unități: $4830 J = 4,83 kJ$, deci varianta B ar fi de zece ori prea mică.'] },
        { id: 'c', type: 'mc', ask: 'Pentru a se degaja 7245 kJ, se consumă:', opts: ['15 kmoli de glucoză', '2,7 kg de glucoză', '2700 kg de glucoză', '1500 moli de glucoză'], correct: 1, noShuffle: true, steps: ['$ν = (7245)//(483) = 15 mol$ glucoză (nu $15$ kmoli).', '$M = 6·12 + 12·1 + 6·16 = 180 g/mol$.', '$m = ν · M = 15 · 180 = 2700 g = <b>2,7 kg</b>$ (varianta B), nu $2700$ kg.'] }
      ]
    };
  }

  function glucozaMake(seed, level) {
    var R = T.rng(seed), r = T.RXN[R.pick(ANY)];
    var sp = pickMain(r, R), ex = r.type === 'exo', verb = ex ? 'degajă' : 'absoarbe', verbP = ex ? 'degajată' : 'absorbită', inf = ex ? 'degaja' : 'absorbi';
    var typ = typeOpts(r);
    var partType = { id: 'a', type: 'mc', ask: 'Tipul reacției:', opts: typ.opts, correct: typ.correct, steps: ['$Q$ apare în ' + (ex ? 'dreapta (la produși): căldura se <b>degajă</b> ⟹ <b>exotermă</b>' : 'stânga (la reactanți): căldura se <b>absoarbe</b> ⟹ <b>endotermă</b>') + '.'] };
    var nme = Cn(sp.f), M = sp.M;

    if (level === 1) {
      var mmol = R.pick([50, 100, 200, 250, 400, 500, 750, 1000]), n = mmol / 1000, Qb = n / sp.nu * r.Q;
      var nt = R.pick([2, 4, 5, 8, 10, 12, 20, 25]), Y = T.round(nt / sp.nu * r.Q, 1), n2 = Y * sp.nu / r.Q, kg = n2 * M / 1000;
      return {
        statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + '<p>Alegeți și subliniați varianta corectă din fiecare item.</p>',
        data: mchips([sp.f]).concat(['1 mmol = 10⁻³ mol']), method: 'mmol → mol; proporție cu căldura pe ecuație; la c) mai întâi moli, apoi masa. Atenție la unitățile din variantele de răspuns (J / kJ, mol / kmol, g / kg).',
        parts: [
          { id: 'a', type: 'mc', ask: 'Reacția descrisă de ecuația termochimică este:', opts: typ.opts, correct: typ.correct, steps: partType.steps },
          { id: 'b', type: 'mc', ask: 'Cantitatea de căldură ' + verbP + ' în reacția a ' + N(mmol, 0) + ' mmoli de ' + nme + ' este:', opts: [N(Qb, 3) + ' kJ', N(Qb * 100, 3) + ' J', N(Qb / 2, 3) + ' kJ', N(Qb / 10, 3) + ' kJ'], correct: 0,
            steps: ['$' + N(mmol, 0) + ' mmol = ' + N(n, 3) + ' mol$.', 'Pe ecuație: $' + N(sp.nu, 1) + ' mol ↔ ' + N(r.Q, 1) + ' kJ$.', '$Q = (' + N(n, 3) + ' · ' + N(r.Q, 1) + ')//(' + N(sp.nu, 1) + ') = <b>' + N(Qb, 3) + ' kJ</b>$.', 'Atenție la unități: $' + N(Qb / 10, 3) + ' kJ = ' + N(Qb * 100, 3) + ' J$, deci varianta cu J nu este egală cu cea cu kJ.'] },
          { id: 'c', type: 'mc', ask: 'Pentru a se ' + inf + ' ' + N(Y, 1) + ' kJ, se consumă:', opts: [N(kg, 4) + ' kg de ' + nme, N(n2, 3) + ' kmoli de ' + nme, N(n2 * M, 3) + ' kg de ' + nme, N(n2 * 100, 3) + ' moli de ' + nme], correct: 0,
            steps: ['$ν = (' + N(Y, 1) + ' · ' + N(sp.nu, 1) + ')//(' + N(r.Q, 1) + ') = ' + N(n2, 3) + ' mol$ ' + nme + ' (nu kmoli).', '$M = ' + N(M, 1) + ' g/mol$ ⟹ $m = ' + N(n2, 3) + ' · ' + N(M, 1) + ' = ' + N(n2 * M, 1) + ' g = <b>' + N(kg, 4) + ' kg</b>$, nu ' + N(n2 * M, 3) + ' kg.'] }
        ]
      };
    }
    if (level === 2) {
      var kmolish = R.pick([0.5, 1, 2, 2.5, 4, 5]), m2 = kmolish * sp.nu * M, Qk = kmolish * r.Q;
      var unitPick = R.pick(['J', 'kcal']);
      var Qu = unitPick === 'J' ? Qk * 1000 : Qk / CAL, mm = R.pick([20, 40, 50, 80, 100, 250]);
      var Q3 = (mm / 1000) / sp.nu * r.Q;
      return {
        statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + qp('a', 'Precizați dacă reacția este exotermă sau endotermă.') + qp('b', 'Calculați cantitatea de căldură, exprimată în <b>' + unitPick + '</b>, ' + verbP + ' în reacția a <b>' + N(m2, 1) + ' g</b> de ' + nme + '.') + qp('c', 'Calculați cantitatea de căldură (în <b>kJ</b>) ' + verbP + ' în reacția a <b>' + N(mm, 0) + ' mmoli</b> de ' + nme + '.'),
        data: mchips([sp.f]).concat(['1 mmol = 10⁻³ mol'], unitPick === 'kcal' ? ['1 cal = 4,18 J'] : []), method: 'g → mol cu $ν = m/M$; proporție; apoi conversia de unități cerută.',
        parts: [partType,
          { id: 'b', ask: 'Căldura în ' + unitPick, a: Qu, unit: unitPick, dec: 2, steps: ['$ν = (' + N(m2, 1) + ')//(' + N(M, 1) + ') = ' + N(m2 / M, 3) + ' mol$.', 'Pe ecuație $' + N(sp.nu, 1) + ' mol ↔ ' + N(r.Q, 1) + ' kJ$ ⟹ $Q = ' + N(Qk, 2) + ' kJ$.', unitPick === 'J' ? '$' + N(Qk, 2) + ' kJ = <b>' + N(Qu, 1) + ' J</b>$.' : '$' + N(Qk, 2) + ' kJ = ' + N(Qk * 1000, 1) + ' J ⟹ ' + N(Qk * 1000, 1) + ' / 4,18 = ' + N(Qk * 1000 / CAL, 1) + ' cal = <b>' + N(Qu, 2) + ' kcal</b>$.'] },
          { id: 'c', ask: 'Căldura în kJ', a: Q3, unit: 'kJ', dec: 3, steps: ['$' + N(mm, 0) + ' mmol = ' + N(mm / 1000, 3) + ' mol$.', '$Q = (' + N(mm / 1000, 3) + ' · ' + N(r.Q, 1) + ')//(' + N(sp.nu, 1) + ') = <b>' + N(Q3, 3) + ' kJ</b>$.'] }
        ]
      };
    }
    // nivel 3: pornind de la un PRODUS
    var p = R.pick(prod(r)), mp = R.pick([0.1, 0.2, 0.5, 1, 2]) * 1000;
    var np_ = mp / p.M, Q4 = np_ / p.nu * r.Q, nr = np_ / p.nu * sp.nu * 1000;
    return {
      statement: '<p>' + T.lead(r) + '</p>' + eqBlock(r) + '<p>În reacție se obțin <b>' + N(mp / 1000, 2) + ' kg</b> de ' + Cn(p.f) + '.</p>' + qp('a', 'Precizați dacă reacția este exotermă sau endotermă.') + qp('b', 'Calculați cantitatea de căldură (în kJ) ' + verbP + '.') + qp('c', 'Calculați cantitatea de ' + nme + ' consumată, exprimată în <b>mmoli</b>.'),
      data: mchips([p.f, sp.f]).concat(['1 mmol = 10⁻³ mol']), method: 'Pornești de la produs: masa lui → moli; apoi raportezi la coeficienții din ecuație.',
      parts: [partType,
        { id: 'b', ask: 'Căldura ' + verbP, a: Q4, unit: 'kJ', dec: 1, steps: ['$ν(' + nm(p.f) + ') = (' + N(mp, 0) + ')//(' + N(p.M, 1) + ') = ' + N(np_, 3) + ' mol$.', 'Pe ecuație se formează $' + N(p.nu, 1) + ' mol$ ' + C(p.f) + ' la $' + N(r.Q, 1) + ' kJ$.', '$Q = (' + N(np_, 3) + ' · ' + N(r.Q, 1) + ')//(' + N(p.nu, 1) + ') = <b>' + N(Q4, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Cantitatea de ' + nme + ' consumată', a: nr, unit: 'mmol', dec: 1, steps: ['Raport din ecuație: $' + N(sp.nu, 1) + ' mol$ ' + nme + ' la $' + N(p.nu, 1) + ' mol$ ' + C(p.f) + '.', '$ν = ' + N(np_, 3) + ' · (' + N(sp.nu, 1) + ')//(' + N(p.nu, 1) + ') = ' + N(nr / 1000, 3) + ' mol = <b>' + N(nr, 1) + ' mmol</b>$.'] }
      ]
    };
  }

  reg({
    id: 'glucoza', short: 'Moli, mmol, kg', title: 'Moli, milimoli și kilograme pe ecuația termochimică',
    blurb: 'Tipul reacției, căldura pentru mmol sau grame și masa de substanță pentru o căldură dată.',
    skill: 'mmol ↔ mol ↔ g · exo / endo',
    intro: T.callout('tip', '<b>Atenție la unități:</b> $1 mmol = 10^{-3} mol$; $1 kg = 1000 g$; $1 kJ = 1000 J$. Mai întâi aduci totul în <b>moli</b>, apoi folosești coeficienții din ecuație.'),
    original: glucozaOriginal, make: glucozaMake
  });

  /* =====================================================
     4. Apă + ardere: Q = m·c·ΔT cu pierderi de căldură (randament)
     ===================================================== */
  var FUELS = [
    { f: 'C2H5OH(l)', n: 'etanolului', M: 46, Hc: 1234.8, co2: 2 },
    { f: 'CH4(g)', n: 'metanului', M: 16, Hc: 890, co2: 1, gas: true },
    { f: 'CH3OH(l)', n: 'metanolului', M: 32, Hc: 726.5, co2: 1 },
    { f: 'C3H8(g)', n: 'propanului', M: 44, Hc: 2220, co2: 3, gas: true },
    { f: 'C4H10(g)', n: 'butanului', M: 58, Hc: 2877, co2: 4, gas: true },
    { f: 'C(s)', n: 'carbonului', M: 12, Hc: 393.5, co2: 1 },
    { f: 'C2H2(g)', n: 'acetilenei', M: 26, Hc: 1299.6, co2: 2, gas: true },
    { f: 'C2H6(g)', n: 'etanului', M: 30, Hc: 1560, co2: 2, gas: true },
    { f: 'CO(g)', n: 'monoxidului de carbon', M: 28, Hc: 283, co2: 1, gas: true }
  ];
  T.FUELS = FUELS;

  function apaOriginal() {
    var Q = 200 * 4.184 * 60 / 1000, Qt = Q / 0.7, n = Qt / 1234.8, m = n * 46;
    return {
      statement: '<p>Se încălzește pe o spirtieră, într-un pahar Berzelius, <b>200 g</b> de apă, de la temperatura de <b>20 °C</b> la temperatura de <b>80 °C</b>.</p>' +
        qp('a', 'Calculați cantitatea de căldură necesară încălzirii apei din pahar ($c_{H_2O} = 4,184 J/(g·K)$).') +
        qp('b', 'Calculați masa de etanol ([[C2H5—OH]]) care s-a ars pentru a încălzi apa, dacă la arderea unui mol de etanol se eliberează o cantitate de căldură de <b>1234,8 kJ</b> și <b>30%</b> din căldura eliberată prin arderea etanolului se pierde.'),
      data: ['M([[C2H5OH]]) = 46 g/mol'],
      method: 'a) $Q = m·c·ΔT$. b) Doar 70% din căldura degajată ajunge la apă: $0,70 · Q_{total} = Q_{apă}$. Apoi moli de etanol $ν$ din căldura de ardere (kJ/mol) și masa $m = ν · M$.',
      parts: [
        { id: 'a', ask: 'Căldura necesară încălzirii apei', a: Q, unit: 'kJ', dec: 3, steps: ['$ΔT = 80 − 20 = 60 °C = 60 K$.', '$Q = m · c · ΔT = 200 · 4,184 · 60 = 50 208 J$.', '$Q = <b>50,208 kJ</b>$.'] },
        { id: 'b', ask: 'Masa de etanol', a: m, unit: 'g', dec: 2, steps: ['30% se pierd ⟹ doar 70% încălzește apa: $0,70 · Q_{total} = 50,208 kJ$.', '$Q_{total} = (50,208)//(0,70) ≈ 71,73 kJ$.', '$ν = (71,73)//(1234,8) ≈ 0,0581 mol$ etanol.', '$m = ν · M = 0,0581 · 46 ≈ <b>2,67 g</b>$.'] }
      ]
    };
  }

  function apaMake(seed, level) {
    var R = T.rng(seed), fu = R.pick(FUELS), mw = R.step(100, 500, 50), t1 = R.pick([15, 18, 20, 22, 25]), t2 = R.pick([60, 70, 75, 80, 90, 100]);
    var loss = R.pick([10, 20, 25, 30, 40]), eta = (100 - loss) / 100, c = R.pick([4.18, 4.184]);
    var dT = t2 - t1, Qw = mw * c * dT / 1000, Qt = Qw / eta, nfu = Qt / fu.Hc, mfu = nfu * fu.M;
    var how = fu.f === 'C2H5OH(l)' || fu.f === 'CH3OH(l)' ? 'pe o spirtieră, într-un pahar Berzelius,' : fu.f === 'C(s)' ? 'într-un pahar Berzelius, deasupra unui jar de cărbune,' : fu.gas && fu.f !== 'CO(g)' ? 'într-un pahar Berzelius, cu ajutorul unui bec de gaz,' : 'într-un pahar Berzelius,';
    var fn = Cn(fu.f), hotMol = 'la arderea unui mol de ' + fn + ' se eliberează o cantitate de căldură de <b>' + N(fu.Hc, 1) + ' kJ</b>';
    var head = '<p>Se încălzește ' + how + ' <b>' + mw + ' g</b> de apă, de la temperatura de <b>' + t1 + ' °C</b> la temperatura de <b>' + t2 + ' °C</b>.</p>';
    var cChip = '$c_{H_2O} = ' + N(c, 3) + ' J/(g·K)$';
    var dataBase = ['M(' + C(fu.f) + ') = ' + fu.M + ' g/mol'];
    if (level === 1) {
      return {
        statement: head + qp('a', 'Calculați cantitatea de căldură necesară încălzirii apei din pahar ($c_{H_2O} = ' + N(c, 3) + ' J/(g·K)$).') + qp('b', 'Calculați masa de ' + fn + ' care s-a ars pentru a încălzi apa, dacă ' + hotMol + ' și <b>' + loss + '%</b> din căldura eliberată prin arderea ' + fu.n + ' se pierde.'), data: dataBase,
        method: 'a) $Q = m·c·ΔT$. b) Căldura utilă este ' + (100 - loss) + '% din cea degajată.',
        parts: [
          { id: 'a', ask: 'Căldura necesară încălzirii apei', a: Qw, unit: 'kJ', dec: 3, steps: ['$ΔT = ' + t2 + ' − ' + t1 + ' = ' + dT + ' K$.', '$Q = m·c·ΔT = ' + mw + ' · ' + N(c, 3) + ' · ' + dT + ' = ' + N(mw * c * dT, 1) + ' J = <b>' + N(Qw, 3) + ' kJ</b>$.'] },
          { id: 'b', ask: 'Masa de ' + fn, a: mfu, unit: 'g', dec: 2, steps: ['Se pierde ' + loss + '% ⟹ la apă ajunge ' + (100 - loss) + '%: $' + N(eta, 2) + ' · Q_{total} = ' + N(Qw, 3) + ' kJ$.', '$Q_{total} = (' + N(Qw, 3) + ')//(' + N(eta, 2) + ') = ' + N(Qt, 2) + ' kJ$.', '$ν = (' + N(Qt, 2) + ')//(' + N(fu.Hc, 1) + ') = ' + N(nfu, 4) + ' mol$.', '$m = ν · M = ' + N(nfu, 4) + ' · ' + fu.M + ' = <b>' + N(mfu, 2) + ' g</b>$.'] }
        ]
      };
    }
    if (level === 2) {
      var variant = R.pick(['mapa', 'tfinal', 'randament']);
      var mf = R.pick([1, 2, 3, 4, 5, 8, 10]) * (fu.M / 10) , nf = mf / fu.M, Qdeg = nf * fu.Hc;
      if (variant === 'mapa') {
        var Qutil = eta * Qdeg, mwat = Qutil * 1000 / (c * dT);
        return {
          statement: '<p>Prin arderea a <b>' + N(mf, 2) + ' g</b> de ' + fn + ' (' + hotMol + ') se încălzește apă, într-un pahar Berzelius, de la <b>' + t1 + ' °C</b> la <b>' + t2 + ' °C</b>. <b>' + loss + '%</b> din căldura eliberată se pierde.</p>' + qp('a', 'Calculați cantitatea de căldură eliberată prin arderea ' + fu.n + '.') + qp('b', 'Calculați masa de apă care poate fi încălzită ($c_{H_2O} = ' + N(c, 3) + ' J/(g·K)$).'), data: dataBase,
          method: 'Moli de combustibil → căldură degajată → partea utilă → masa de apă din $Q = m·c·ΔT$.',
          parts: [
            { id: 'a', ask: 'Căldura degajată la ardere', a: Qdeg, unit: 'kJ', dec: 2, steps: ['$ν = (' + N(mf, 2) + ')//(' + fu.M + ') = ' + N(nf, 4) + ' mol$.', '$Q = ν · ΔH_{ardere} = ' + N(nf, 4) + ' · ' + N(fu.Hc, 1) + ' = <b>' + N(Qdeg, 2) + ' kJ</b>$.'] },
            { id: 'b', ask: 'Masa de apă', a: mwat, unit: 'g', dec: 1, steps: ['Căldura utilă: $' + N(eta, 2) + ' · ' + N(Qdeg, 2) + ' = ' + N(Qutil, 2) + ' kJ = ' + N(Qutil * 1000, 0) + ' J$.', '$ΔT = ' + dT + ' K$ ⟹ $m = (Q)//(c·ΔT) = (' + N(Qutil * 1000, 0) + ')//(' + N(c, 3) + ' · ' + dT + ') = <b>' + N(mwat, 1) + ' g</b>$.'] }
          ]
        };
      }
      if (variant === 'tfinal') {
        var Qu2 = eta * Qdeg, dTt = R.pick([30, 40, 50, 60]), mw2 = Math.max(50, Math.round(Qu2 * 1000 / (c * dTt) / 10) * 10), dTf = Qu2 * 1000 / (mw2 * c), tf = t1 + dTf;
        return {
          statement: '<p>Se ard <b>' + N(mf, 2) + ' g</b> de ' + fn + ' (' + hotMol + '). Căldura utilă (<b>' + (100 - loss) + '%</b> din cea eliberată) încălzește <b>' + mw2 + ' g</b> de apă aflată inițial la temperatura de <b>' + t1 + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură care ajunge la apă.') + qp('b', 'Calculați temperatura finală a apei ($c_{H_2O} = ' + N(c, 3) + ' J/(g·K)$).'), data: dataBase,
          method: 'Calculezi căldura utilă, apoi $ΔT = Q/(m·c)$ și $t_f = t_i + ΔT$.',
          parts: [
            { id: 'a', ask: 'Căldura utilă', a: Qu2, unit: 'kJ', dec: 2, steps: ['$ν = (' + N(mf, 2) + ')//(' + fu.M + ') = ' + N(nf, 4) + ' mol$; $Q_{degajată} = ' + N(nf, 4) + ' · ' + N(fu.Hc, 1) + ' = ' + N(Qdeg, 2) + ' kJ$.', 'Utilă: $' + N(eta, 2) + ' · ' + N(Qdeg, 2) + ' = <b>' + N(Qu2, 2) + ' kJ</b>$.'] },
            { id: 'b', ask: 'Temperatura finală a apei', a: tf, unit: '°C', dec: 1, steps: ['$ΔT = (Q)//(m·c) = (' + N(Qu2 * 1000, 0) + ')//(' + mw2 + ' · ' + N(c, 3) + ') = ' + N(dTf, 2) + ' K$.', '$t_f = t_i + ΔT = ' + t1 + ' + ' + N(dTf, 2) + ' = <b>' + N(tf, 1) + ' °C</b>$.'] }
          ]
        };
      }
      // randament
      var Qdeg3 = nf * fu.Hc, rt = R.pick([40, 50, 60, 70, 75, 80, 85]), mwr = Math.max(5, Math.round(rt / 100 * Qdeg3 * 1000 / (c * dT) / 5) * 5), Qutil3 = mwr * c * dT / 1000, rend = Qutil3 / Qdeg3 * 100;
      return {
        statement: '<p>Prin arderea a <b>' + N(mf, 2) + ' g</b> de ' + fn + ' (' + hotMol + ') se încălzesc <b>' + mwr + ' g</b> de apă, de la temperatura de <b>' + t1 + ' °C</b> la temperatura de <b>' + t2 + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură primită de apă ($c_{H_2O} = ' + N(c, 3) + ' J/(g·K)$).') + qp('b', 'Calculați procentul din căldura eliberată prin ardere care a ajuns la apă.'), data: dataBase,
        method: 'Procentul = căldura primită de apă / căldura degajată · 100.',
        parts: [
          { id: 'a', ask: 'Căldura primită de apă', a: Qutil3, unit: 'kJ', dec: 3, steps: ['$Q = m·c·ΔT = ' + mwr + ' · ' + N(c, 3) + ' · ' + dT + ' = <b>' + N(Qutil3, 3) + ' kJ</b>$.'] },
          { id: 'b', ask: 'Procentul din căldura degajată care a ajuns la apă', a: rend, unit: '%', dec: 1, steps: ['Degajată: $ν = (' + N(mf, 2) + ')//(' + fu.M + ') = ' + N(nf, 4) + ' mol$ ⟹ $Q = ' + N(nf, 4) + ' · ' + N(fu.Hc, 1) + ' = ' + N(Qdeg3, 2) + ' kJ$.', '$p = (Q_{apă})//(Q_{degajată}) · 100 = (' + N(Qutil3, 3) + ')//(' + N(Qdeg3, 2) + ') · 100 = <b>' + N(rend, 1) + '%</b>$.'] }
        ]
      };
    }
    // nivel 3: combustibil gazos în litri, apă în litri, volum de CO2
    var gasF = FUELS.filter(function (x) { return x.gas; }), fg = R.pick(gasF), Vw = R.pick([1, 1.5, 2, 2.5, 3]), mwg = Vw * 1000, tt1 = R.pick([15, 20, 25]), tt2 = R.pick([60, 70, 80]);
    var lossg = R.pick([20, 25, 30, 40]), etag = (100 - lossg) / 100, dTg = tt2 - tt1, Qwg = mwg * 4.18 * dTg / 1000, Qtg = Qwg / etag, ng2 = Qtg / fg.Hc, Vg = ng2 * 22.4, Vco2 = ng2 * fg.co2 * 22.4;
    return {
      statement: '<p>Se încălzesc într-un pahar Berzelius <b>' + N(mwg, 0) + ' g</b> de apă, de la temperatura de <b>' + tt1 + ' °C</b> la temperatura de <b>' + tt2 + ' °C</b>, prin arderea ' + fg.n + ' (la arderea unui mol de ' + Cn(fg.f) + ' se eliberează o cantitate de căldură de <b>' + N(fg.Hc, 1) + ' kJ</b>). <b>' + lossg + '%</b> din căldura eliberată se pierde.</p>' +
        qp('a', 'Calculați cantitatea de căldură utilă primită de apă ($c_{H_2O} = 4,18 J/(g·K)$).') + qp('b', 'Calculați volumul de ' + Cn(fg.f) + ' (c.n.) care trebuie ars.') + qp('c', 'Calculați volumul de ' + C('CO2(g)') + ' (c.n.) care se degajă la ardere, știind că din 1 mol de ' + Cn(fg.f) + ' rezultă ' + fg.co2 + ' mol de ' + C('CO2') + '.'),
      data: ['$V_m = 22,4 L/mol$ (c.n.)'], method: 'a) $Q = m·c·ΔT$. b) Doar (100 − p)% din căldura degajată ajunge la apă, deci $Q_{total} = Q_{utilă} / ((100 − p)/100)$; apoi $ν = Q_{total}/Q_{ardere}$ și $V = ν·22,4$. c) Din raportul molar al arderii.',
      parts: [
        { id: 'a', ask: 'Căldura utilă', a: Qwg, unit: 'kJ', dec: 1, steps: ['$m = ' + N(mwg, 0) + ' g$; $ΔT = ' + dTg + ' K$.', '$Q = ' + N(mwg, 0) + ' · 4,18 · ' + dTg + ' = ' + N(Qwg * 1000, 0) + ' J = <b>' + N(Qwg, 1) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Volumul de ' + C(fg.f) + ' (c.n.)', a: Vg, unit: 'L', dec: 1, steps: ['$Q_{total} = (' + N(Qwg, 1) + ')//(' + N(etag, 2) + ') = ' + N(Qtg, 1) + ' kJ$.', '$ν = (' + N(Qtg, 1) + ')//(' + N(fg.Hc, 1) + ') = ' + N(ng2, 3) + ' mol$.', '$V = ν · 22,4 = ' + N(ng2, 3) + ' · 22,4 = <b>' + N(Vg, 1) + ' L</b>$.'] },
        { id: 'c', ask: 'Volumul de ' + C('CO2(g)') + ' (c.n.)', a: Vco2, unit: 'L', dec: 1, steps: ['Raport molar: $1 mol$ ' + C(fg.f) + ' ⟹ $' + fg.co2 + ' mol$ ' + C('CO2') + '.', '$V_{CO_2} = ' + fg.co2 + ' · V_{combustibil} = ' + fg.co2 + ' · ' + N(Vg, 1) + ' = <b>' + N(Vco2, 1) + ' L</b>$.'] }
      ]
    };
  }

  reg({
    id: 'apa-etanol', short: 'Apă + ardere (pierderi)', title: 'Încălzirea apei prin ardere, cu pierderi de căldură',
    blurb: 'Q = m·c·ΔT, pierderile de căldură (procente) și masa de combustibil necesară.',
    skill: '$Q = m·c·ΔT$ · procente · moli de combustibil',
    intro: T.callout('tip', '<b>Cum gândești:</b> (1) căldura pe care o primește apa: $Q = m·c·ΔT$; (2) dacă se pierd $p%$ din căldură, la apă ajunge $(100 − p)%$ din căldura degajată: $(100 − p)/100 · Q_{total} = Q_{apă}$; (3) din $Q_{total}$ afli moli de combustibil, apoi masa.'),
    original: apaOriginal, make: apaMake
  });

  /* =====================================================
     5. Încălzire + topire: Q = m·c·ΔT + ν·λ  (sodiu)
     ===================================================== */
  /* d = forma articulată (sodiul); w = reacționează cu apa, degajând căldură */
  var METALS = [
    { f: 'Na', n: 'sodiu', d: 'sodiul', w: true, qw: 7.868, M: 23, c: 1.23, tm: 98, lam: 2.6, cl: 1.38 },
    { f: 'K', n: 'potasiu', d: 'potasiul', w: true, qw: 5, M: 39, c: 0.76, tm: 64, lam: 2.33, cl: 0.82 },
    { f: 'Li', n: 'litiu', d: 'litiul', w: true, qw: 31.7, M: 7, c: 3.58, tm: 181, lam: 3.0, cl: 4.2 },
    { f: 'Sn', n: 'staniu', d: 'staniul', M: 119, c: 0.23, tm: 232, lam: 7.03, cl: 0.24 },
    { f: 'Pb', n: 'plumb', d: 'plumbul', M: 207, c: 0.13, tm: 327, lam: 4.77, cl: 0.14 },
    { f: 'Zn', n: 'zinc', d: 'zincul', M: 65, c: 0.39, tm: 420, lam: 7.32, cl: 0.48 },
    { f: 'Al', n: 'aluminiu', d: 'aluminiul', M: 27, c: 0.9, tm: 660, lam: 10.7, cl: 1.18 },
    { f: 'Cu', n: 'cupru', d: 'cuprul', M: 64, c: 0.385, tm: 1085, lam: 13.3, cl: 0.49 }
  ];
  /** datele unui metal, în formularea din manual (căldura latentă pe mol, căldura specifică în J/g·K) */
  function metalChips(me, liquid) {
    return ['căldura latentă de topire $λ = ' + N(me.lam, 2) + ' kJ/mol$', 'căldura specifică a metalului solid $c = ' + N(me.c, 2) + ' J/g·K$'].concat(liquid ? ['căldura specifică a metalului lichid $c = ' + N(me.cl, 2) + ' J/g·K$'] : [],
      ['temperatura de topire p.t. = +' + me.tm + ' °C', 'M(' + me.f + ') = ' + me.M + ' g/mol']);
  }
  T.metalChips = metalChips;
  T.METALS = METALS;

  function sodiuOriginal() {
    var m = 10, c = 1.23, dT = 98 - 20, lam = 2.6, M = 23, Qh = m * c * dT, Qm = m / M * lam * 1000, Qp = Qh + Qm, x = Qp / 1000 / 78.68 * 100;
    return {
      statement: '<p>Din reacția a <b>10 g</b> de sodiu cu apa, se degajă o cantitate de căldură de <b>78,68 kJ</b>. Calculați procentul din căldura de reacție care este consumat pentru a aduce bucata de sodiu în stare topită. Se cunosc: căldura latentă de topire a sodiului $λ = 2,6 kJ/mol$, căldura specifică a sodiului solid $c = 1,23 J/g·K$, temperatura de topire a sodiului p.t. = +98 °C și se consideră că sodiul solid și apa au inițial temperatura de <b>20 °C</b>.</p>',
      data: ['M(Na) = 23 g/mol'],
      tool: { name: 'heatingCurve' },
      method: 'Două etape: (1) încălzirea sodiului solid de la 20 °C la 98 °C: $Q_1 = m·c·ΔT$; (2) topirea la 98 °C: $Q_2 = ν·λ$. Apoi procentul: $x = Q_{necesar}/Q_{degajat} · 100$.',
      parts: [
        { id: 'a', ask: 'Pasul 1 — căldura consumată pentru încălzirea și topirea bucății de sodiu', a: Qp / 1000, unit: 'kJ', dec: 2, steps: ['Încălzire: $ΔT = 98 − 20 = 78 K$; $Q_1 = m·c·ΔT = 10 · 1,23 · 78 = 959,4 J$.', 'Topire: $ν = (10)//(23) = 0,4348 mol$; $Q_2 = ν·λ = 0,4348 · 2600 = 1130,43 J$ (λ = 2,6 kJ = 2600 J/mol).', '$Q = Q_1 + Q_2 = 959,4 + 1130,43 = 2089,83 J ≈ <b>2,09 kJ</b>$.'] },
        { id: 'b', ask: 'Răspunsul — procentul din căldura de reacție consumat pentru a aduce bucata de sodiu în stare topită', a: x, unit: '%', dec: 2, steps: ['$(x)//(100) · Q_{degajat} = Q_{necesar}$ ⟹ $(x)//(100) · 78,68 = 2,09$.', '$x = (2,09 · 100)//(78,68) ≈ <b>2,66%</b>$.'] }
      ]
    };
  }

  function sodiuMake(seed, level) {
    var R = T.rng(seed), me = R.pick(METALS), ti = R.pick([20, 25]), dT = me.tm - ti;
    var m = R.pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 50]);
    var nu = m / me.M, Q1 = m * me.c * dT, Q2 = nu * me.lam * 1000, Qp = Q1 + Q2;
    var data = metalChips(me, false);
    var step1 = ['Încălzire: $ΔT = ' + me.tm + ' − ' + ti + ' = ' + dT + ' K$; $Q_1 = m·c·ΔT = ' + m + ' · ' + N(me.c, 2) + ' · ' + dT + ' = ' + N(Q1, 1) + ' J$.',
      'Topire: $ν = (' + m + ')//(' + me.M + ') = ' + N(nu, 4) + ' mol$; $Q_2 = ν·λ = ' + N(nu, 4) + ' · ' + N(me.lam * 1000, 0) + ' = ' + N(Q2, 1) + ' J$.'];
    if (level === 1) {
      var pct = R.pick([1.5, 2, 2.5, 3, 4, 5, 8, 10, 12.5, 15, 20]), Qdeg = me.w ? T.round(m * me.qw, 2) : T.round(Qp / 1000 / pct * 100, 2), x = Qp / 1000 / Qdeg * 100;
      return {
        statement: (me.w
          ? '<p>Din reacția a <b>' + m + ' g</b> de ' + me.n + ' cu apa, se degajă o cantitate de căldură de <b>' + N(Qdeg, 2) + ' kJ</b>. Se consideră că ' + me.d + ' solid și apa au inițial temperatura de <b>' + ti + ' °C</b>.</p>'
          : '<p>Într-o reacție chimică se degajă o cantitate de căldură de <b>' + N(Qdeg, 2) + ' kJ</b>. O bucată de <b>' + m + ' g</b> de ' + me.n + ', aflată inițial la temperatura de <b>' + ti + ' °C</b>, este adusă în stare topită.</p>') +
          qp('a', 'Calculați cantitatea de căldură necesară pentru a încălzi și topi bucata de ' + me.n + '.') + qp('b', 'Calculați procentul din căldura de reacție care este consumat pentru a aduce bucata de ' + me.n + ' în stare topită.'), data: data,
        method: 'Încălzire până la topire ($m·c·ΔT$) + topire ($ν·λ$), apoi raportezi la căldura degajată.',
        parts: [
          { id: 'a', ask: 'Căldura necesară (kJ)', a: Qp / 1000, unit: 'kJ', dec: 3, steps: step1.concat(['$Q = Q_1 + Q_2 = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' = ' + N(Qp, 1) + ' J = <b>' + N(Qp / 1000, 3) + ' kJ</b>$.']) },
          { id: 'b', ask: 'Procentul din căldura degajată', a: x, unit: '%', dec: 2, steps: ['$x = (Q_{necesar})//(Q_{degajat}) · 100 = (' + N(Qp / 1000, 3) + ')//(' + N(Qdeg, 2) + ') · 100 = <b>' + N(x, 2) + '%</b>$.'] }
        ]
      };
    }
    if (level === 2) {
      var variant = R.pick(['masa', 'doarT', 'fracT']);
      if (variant === 'masa') {
        var pc = R.pick([5, 10, 15, 20, 25]), Qd = R.pick([20, 30, 40, 50, 60, 80]), Qav = pc / 100 * Qd * 1000, perG = me.c * dT + me.lam * 1000 / me.M, mm = Qav / perG;
        return {
          statement: '<p>Într-o reacție chimică se degajă o cantitate de căldură de <b>' + Qd + ' kJ</b>, din care numai <b>' + pc + '%</b> este utilizată pentru încălzirea și topirea unei bucăți de ' + me.n + ', aflată inițial la temperatura de <b>' + ti + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea de căldură utilizată (în J).') + qp('b', 'Calculați masa de ' + me.n + ' ce poate fi adusă în stare topită.'), data: data,
          method: 'Căldura necesară pentru 1 g: $q = c·ΔT + λ/M$ (în J/g). Apoi $m = Q_{utilă}/q$.',
          parts: [
            { id: 'a', ask: 'Căldura utilă (J)', a: Qav, unit: 'J', dec: 0, steps: ['$Q_{utilă} = (' + pc + ')//(100) · ' + Qd + ' kJ = ' + N(Qav / 1000, 2) + ' kJ = <b>' + N(Qav, 0) + ' J</b>$.'] },
            { id: 'b', ask: 'Masa de ' + me.n, a: mm, unit: 'g', dec: 2, steps: ['Pentru 1 g: încălzire $c·ΔT = ' + N(me.c, 2) + ' · ' + dT + ' = ' + N(me.c * dT, 2) + ' J$; topire $λ/M = ' + N(me.lam * 1000, 0) + '/' + me.M + ' = ' + N(me.lam * 1000 / me.M, 2) + ' J$.', '$q = ' + N(perG, 2) + ' J/g$ ⟹ $m = (' + N(Qav, 0) + ')//(' + N(perG, 2) + ') = <b>' + N(mm, 2) + ' g</b>$.'] }
          ]
        };
      }
      if (variant === 'doarT') {
        return {
          statement: '<p>Se încălzesc <b>' + m + ' g</b> de ' + me.n + ', de la temperatura de <b>' + ti + ' °C</b> până la temperatura de topire (fără ca metalul să se topească încă).</p>' + qp('a', 'Calculați cantitatea de căldură necesară încălzirii.') + qp('b', 'Calculați cantitatea de căldură necesară, în plus, pentru topirea completă a metalului.'), data: data,
          method: 'Încălzirea și topirea sunt etape separate: $Q_1 = m·c·ΔT$ și $Q_2 = ν·λ$.',
          parts: [
            { id: 'a', ask: 'Căldura de încălzire', a: Q1, unit: 'J', dec: 1, steps: step1.slice(0, 1).concat(['$Q_1 = <b>' + N(Q1, 1) + ' J</b>$.']) },
            { id: 'b', ask: 'Căldura de topire', a: Q2, unit: 'J', dec: 1, steps: [step1[1], '$Q_2 = <b>' + N(Q2, 1) + ' J</b>$ (la temperatură constantă, ' + me.tm + ' °C).'] }
          ]
        };
      }
      var fr = Q2 / Qp * 100;
      return {
        statement: '<p>Se încălzesc și se topesc <b>' + m + ' g</b> de ' + me.n + ' aflat inițial la temperatura de <b>' + ti + ' °C</b>.</p>' + qp('a', 'Calculați cantitatea totală de căldură necesară (în kJ).') + qp('b', 'Calculați procentul din această căldură care este consumat doar pentru <b>topire</b>.'), data: data,
        method: 'Calculezi $Q_1$ și $Q_2$, apoi $Q_2 / (Q_1 + Q_2) · 100$.',
        parts: [
          { id: 'a', ask: 'Căldura totală', a: Qp / 1000, unit: 'kJ', dec: 3, steps: step1.concat(['$Q = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' = <b>' + N(Qp / 1000, 3) + ' kJ</b>$.']) },
          { id: 'b', ask: 'Procentul consumat la topire', a: fr, unit: '%', dec: 1, steps: ['$(Q_2)//(Q) · 100 = (' + N(Q2, 1) + ')//(' + N(Qp, 1) + ') · 100 = <b>' + N(fr, 1) + '%</b>$.'] }
        ]
      };
    }
    // nivel 3: încălzire solid + topire + încălzire lichid
    var tf = me.tm + R.pick([20, 30, 40, 50]), Q3 = m * me.cl * (tf - me.tm), Qtot = Qp + Q3;
    return {
      statement: '<p>Se încălzesc <b>' + m + ' g</b> de ' + me.n + ', de la temperatura de <b>' + ti + ' °C</b> până la temperatura de <b>' + tf + ' °C</b>, trecând prin topire.</p>' + qp('a', 'Calculați cantitatea de căldură necesară încălzirii metalului solid până la topire.') + qp('b', 'Calculați cantitatea de căldură necesară topirii.') + qp('c', 'Calculați cantitatea totală de căldură necesară (în kJ).'),
      data: metalChips(me, true),
      method: 'Trei etape: solid ($m·c·ΔT$), topire ($ν·λ$), lichid ($m·c_{lichid}·ΔT$). Le aduni.',
      parts: [
        { id: 'a', ask: 'Căldura de încălzire a solidului', a: Q1, unit: 'J', dec: 1, steps: [step1[0]] },
        { id: 'b', ask: 'Căldura de topire', a: Q2, unit: 'J', dec: 1, steps: [step1[1]] },
        { id: 'c', ask: 'Căldura totală (kJ)', a: Qtot / 1000, unit: 'kJ', dec: 3, steps: ['Lichid: $ΔT = ' + tf + ' − ' + me.tm + ' = ' + (tf - me.tm) + ' K$; $Q_3 = ' + m + ' · ' + N(me.cl, 2) + ' · ' + (tf - me.tm) + ' = ' + N(Q3, 1) + ' J$.', '$Q = Q_1 + Q_2 + Q_3 = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' + ' + N(Q3, 1) + ' = ' + N(Qtot, 1) + ' J = <b>' + N(Qtot / 1000, 3) + ' kJ</b>$.'] }
      ]
    };
  }

  reg({
    id: 'sodiu', short: 'Încălzire + topire', title: 'Încălzire și topire: $Q = m·c·ΔT + ν·λ$',
    blurb: 'Căldura necesară pentru a încălzi un metal până la topire și a-l topi; ce procent din căldura unei reacții e folosit.',
    skill: '$Q = m·c·ΔT + ν·λ$ · procente',
    intro: T.callout('warn', '<b>Două etape, două formule:</b> cât timp temperatura crește, $Q_1 = m·c·ΔT$; cât timp substanța se topește (temperatura constantă), $Q_2 = ν·λ$ sau $m·λ$. Verifică dacă $λ$ e dat în <b>kJ/mol</b> (⟹ moli) sau în <b>J/g</b> (⟹ masă) și transformă kJ în J.'),
    original: sodiuOriginal, make: sodiuMake
  });
})(typeof window !== 'undefined' ? window : globalThis);
