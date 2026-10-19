/* =========================================================
   problems-hard-1.js — nivelul 4, „Foarte greu”, pentru tipurile 1–3
   (ecuația termochimică, gaze la c.n., moli / mmol / kg)
   Doar noțiunile din caiet: regula de trei pe ecuație, cal ↔ J, c.n., procente de pierderi;
   dificultatea vine din lanțuri de pași, amestecuri (două necunoscute) și reacții cuplate.
   Fiecare instanță are `check()` — o verificare independentă a coerenței, rulată de tools/verifica-probleme.js.
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  var N = function (x, d) { return T.fmt(x, d == null ? 2 : d); };
  var nm = function (f) { return f.replace(/\((s|l|g|aq)\)$/, ''); };
  var C = function (f) { return '[[' + nm(f) + ']]'; };
  var CAL = 4.18, VM = 22.4;
  function eqBlock(r, o) { return '<div class="eqn ' + r.type + '">' + T.eqStr(r, o) + '</div>'; }
  function mchips(list) { return list.map(function (f) { return 'M(' + C(f) + ') = ' + N(T.massOf(f), 1) + ' g/mol'; }); }
  function qline(id, txt) { return '<p><b>' + id + ')</b> ' + txt + '</p>'; }
  function near(a, b) { return Math.abs(a - b) <= 1e-6 * Math.max(1, Math.abs(b)); }
  /** înlocuiește generatorul de nivel 4 al unui tip de problemă; nivelurile 1–3 rămân neschimbate */
  function reg(id, gens) {
    var P = T.problems[id], base = P.make;
    P.make = function (seed, level) { if (level !== 4) return base(seed, level); var R = T.rng(seed), fn = R.pick(gens), inst = fn(R); inst.tpl = gens.indexOf(fn); return inst; };
    P.maxLevel = 4;
  }
  T.hard = { N: N, nm: nm, C: C, CAL: CAL, VM: VM, eqBlock: eqBlock, mchips: mchips, qline: qline, near: near, reg: reg };

  /* arderea unei substanțe simple: din ecuația din T.RXN */
  function burnInfo(key) {
    var r = T.RXN[key], l = r.L.filter(function (p) { return p[1] !== 'O2(g)'; })[0], o2 = r.L.filter(function (p) { return p[1] === 'O2(g)'; })[0];
    return { key: key, r: r, f: l[1], nu: l[0], M: T.massOf(l[1]), qm: r.Q / l[0], o2: o2[0] / l[0] };
  }
  /* combustibili pentru ardere cuplată (ecuația arderii, cu CO2 printre produși) */
  var FUEL_EQ = {
    carbon: T.RXN.carbon, metan: T.RXN.metan, metanol: T.RXN.metanol,
    propan: { type: 'exo', Q: 2220, L: [[1, 'C3H8(g)'], [5, 'O2(g)']], R: [[3, 'CO2(g)'], [4, 'H2O(l)']] },
    butan: { type: 'exo', Q: 2877, L: [[1, 'C4H10(g)'], [6.5, 'O2(g)']], R: [[4, 'CO2(g)'], [5, 'H2O(l)']] }
  };
  function fuelInfo(key) {
    var r = FUEL_EQ[key], l = r.L[0], co2 = r.R.filter(function (p) { return p[1] === 'CO2(g)'; })[0];
    return { key: key, r: r, f: l[1], nu: l[0], M: T.massOf(l[1]), qm: r.Q / l[0], co2: co2[0] / l[0] };
  }
  /* o mărime „observabilă” a unei reacții endoterme: un gaz (volum la c.n.) sau reactantul solid (masă) */
  function observable(R, r, solidOk) {
    var all = r.L.map(function (p) { return { nu: p[0], f: p[1], side: 'L' }; }).concat(r.R.map(function (p) { return { nu: p[0], f: p[1], side: 'R' }; }));
    var opts = all.filter(function (x) { return T.isGas(x.f); }).map(function (x) { return { kind: 'vol', nu: x.nu, f: x.f, side: x.side, M: T.massOf(x.f) }; });
    if (solidOk) all.filter(function (x) { return /\(s\)$/.test(x.f) && x.side === 'L' && x.f !== 'C(s)'; }).forEach(function (x) { opts.push({ kind: 'mass', nu: x.nu, f: x.f, side: 'L', M: T.massOf(x.f) }); });
    return R.pick(opts);
  }

  /* =====================================================
     1. Ecuația termochimică (termita)
     ===================================================== */
  /* 1a. amestec de două substanțe care ard complet: sistem cu două necunoscute */
  var BURN = ['carbon', 'sulf', 'magneziu', 'hidrogen'];
  function termitaMix(R) {
    var pair = R.shuffle(BURN).slice(0, 2).map(burnInfo), A = pair[0], B = pair[1];
    var amt = function (x) { return x.f === 'C(s)' ? R.pick([1, 2, 3, 4]) : R.pick([0.5, 1, 1.5, 2, 2.5, 3]); };
    var a = amt(A), b = amt(B), m = a * A.M + b * B.M, Q = T.round(a * A.qm + b * B.qm, 1);
    var hA = A.qm / A.M, hB = B.qm / B.M, x = (Q - hB * m) / (hA - hB), y = m - x;
    var nA = x / A.M, nB = y / B.M, VO2 = (nA * A.o2 + nB * B.o2) * VM, pct = nA * A.qm / Q * 100;
    var ok = x > 0 && y > 0;
    return {
      statement: '<p>Un amestec de ' + C(A.f) + ' și ' + C(B.f) + ', cu masa totală de <b>' + N(m, 1) + ' g</b>, arde complet în oxigen, conform ecuațiilor termochimice:</p>' + eqBlock(A.r) + eqBlock(B.r) +
        '<p>În total se degajă <b>' + N(Q, 1) + ' kJ</b>.</p>' + qline('a', 'Ce masă de ' + C(A.f) + ' conține amestecul?') + qline('b', 'Ce masă de ' + C(B.f) + ' conține amestecul?') +
        qline('c', 'Ce volum de ' + C('O2') + ' (c.n.) se consumă la ardere?') + qline('d', 'Ce procent din căldura totală provine din arderea lui ' + C(A.f) + '?'),
      data: mchips([A.f, B.f]).concat(['$V_m = 22,4 L/mol$ (c.n.)']),
      method: 'Din fiecare ecuație afli căldura pe <b>gram</b> de substanță. Apoi scrii două ecuații cu necunoscutele $x$ și $y$ (masele): una pentru masă și una pentru căldură.',
      check: function () { return ok && near(hA * x + hB * y, Q) && near(x + y, m); },
      parts: [
        {
          id: 'a', ask: 'Masa de ' + C(A.f), a: x, unit: 'g', dec: 2, tol: 0.02, steps: [
            'Căldura pe mol din ecuații: ' + C(A.f) + ' ⟹ $' + N(A.r.Q, 1) + ' / ' + N(A.nu, 1) + ' = ' + N(A.qm, 2) + ' kJ/mol$; ' + C(B.f) + ' ⟹ $' + N(B.r.Q, 1) + ' / ' + N(B.nu, 1) + ' = ' + N(B.qm, 2) + ' kJ/mol$.',
            'Pe gram: $h_A = (' + N(A.qm, 2) + ')//(' + N(A.M, 1) + ') = ' + N(hA, 4) + ' kJ/g$ și $h_B = (' + N(B.qm, 2) + ')//(' + N(B.M, 1) + ') = ' + N(hB, 4) + ' kJ/g$.',
            'Notez cu $x$ masa lui ' + C(A.f) + ' și cu $y$ masa lui ' + C(B.f) + ': &nbsp; $x + y = ' + N(m, 1) + '$ &nbsp; și &nbsp; $h_A·x + h_B·y = ' + N(Q, 1) + '$.',
            'Din prima, $y = ' + N(m, 1) + ' − x$. În a doua: $h_A·x + h_B·(' + N(m, 1) + ' − x) = ' + N(Q, 1) + '$ ⟹ $x = (' + N(Q, 1) + ' − h_B · ' + N(m, 1) + ')//(h_A − h_B)$.',
            '$x = (' + N(Q, 1) + ' − ' + N(hB, 4) + ' · ' + N(m, 1) + ')//(' + N(hA, 4) + ' − ' + N(hB, 4) + ') = <b>' + N(x, 2) + ' g</b>$ ' + C(A.f) + '.']
        },
        { id: 'b', ask: 'Masa de ' + C(B.f), a: y, unit: 'g', dec: 2, tol: 0.02, steps: ['$y = ' + N(m, 1) + ' − x = ' + N(m, 1) + ' − ' + N(x, 2) + ' = <b>' + N(y, 2) + ' g</b>$ ' + C(B.f) + '.', 'Verificare: $' + N(hA, 4) + ' · ' + N(x, 2) + ' + ' + N(hB, 4) + ' · ' + N(y, 2) + ' ≈ ' + N(hA * x + hB * y, 1) + ' kJ$ ✓'] },
        {
          id: 'c', ask: 'Volumul de ' + C('O2') + ' (c.n.)', a: VO2, unit: 'L', dec: 1, tol: 0.02, steps: [
            'Moli: $ν_A = ' + N(x, 2) + ' / ' + N(A.M, 1) + ' = ' + N(nA, 3) + ' mol$ ' + C(A.f) + '; $ν_B = ' + N(y, 2) + ' / ' + N(B.M, 1) + ' = ' + N(nB, 3) + ' mol$ ' + C(B.f) + '.',
            'Din ecuații, la 1 mol de ' + C(A.f) + ' se consumă $' + N(A.o2, 2) + ' mol$ ' + C('O2') + ', iar la 1 mol de ' + C(B.f) + ' se consumă $' + N(B.o2, 2) + ' mol$ ' + C('O2') + '.',
            '$ν(O_2) = ' + N(A.o2, 2) + ' · ' + N(nA, 3) + ' + ' + N(B.o2, 2) + ' · ' + N(nB, 3) + ' = ' + N(VO2 / VM, 3) + ' mol$ ⟹ $V = ' + N(VO2 / VM, 3) + ' · 22,4 = <b>' + N(VO2, 1) + ' L</b>$.']
        },
        { id: 'd', ask: 'Procentul din căldură provenit din ' + C(A.f), a: pct, unit: '%', dec: 1, tol: 0.02, steps: ['Căldura din ' + C(A.f) + ': $' + N(nA, 3) + ' · ' + N(A.qm, 2) + ' = ' + N(nA * A.qm, 1) + ' kJ$.', '$p = (' + N(nA * A.qm, 1) + ')//(' + N(Q, 1) + ') · 100 = <b>' + N(pct, 1) + '%</b>$.'] }
      ]
    };
  }

  /* 1b. reacție endotermă „alimentată” de arderea unui combustibil, cu pierderi */
  function couple(R, endoKeys, fuelKeys, mode) {
    var er = T.RXN[R.pick(endoKeys)], fu = fuelInfo(R.pick(fuelKeys)), p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100;
    var ob = observable(R, er, mode === 'mass'), k = mode === 'mass' ? R.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]) : R.pick([2, 3, 4, 5, 8, 10]);
    var qty = k * ob.nu * (ob.kind === 'vol' ? VM : ob.M), unitQ = ob.kind === 'vol' ? 'L' : 'g';
    var Qe = k * er.Q, Qtot = Qe / eta, nf = Qtot / fu.qm, mf = nf * fu.M, Vf = nf * VM, Vco2 = nf * fu.co2 * VM;
    var verb = ob.side === 'L' ? 'reacționează' : 'se formează';
    var first = mode === 'mass'
      ? qline('a', 'Ce căldură (în <b>kcal</b>) absoarbe reacția endotermă? <span class="muted">(1 cal ≈ 4,18 J)</span>')
      : qline('a', 'Ce căldură (în <b>kJ</b>) absoarbe reacția endotermă?');
    var aAns = mode === 'mass' ? Qe * 1000 / CAL / 1000 : Qe;
    var fuelAsk = mode === 'mass' ? qline('c', 'Ce masă de ' + C(fu.f) + ' trebuie arsă?') : qline('c', 'Ce volum de ' + C(fu.f) + ' (c.n.) trebuie ars?');
    var fuelAns = mode === 'mass' ? mf : Vf, fuelUnit = mode === 'mass' ? 'g' : 'L';
    return {
      statement: '<p>O reacție endotermă are loc după ecuația:</p>' + eqBlock(er) + '<p>Căldura necesară provine din arderea ' + C(fu.f) + ', după ecuația:</p>' + eqBlock(fu.r) +
        '<p><b>' + p + '%</b> din căldura degajată prin ardere se pierde în mediu. În reacția endotermă ' + verb + ' <b>' + N(qty, 1) + ' ' + unitQ + '</b> de ' + C(ob.f) + (ob.kind === 'vol' ? ' (c.n.)' : '') + '.</p>' +
        first + qline('b', 'Ce căldură (în kJ) trebuie degajată prin arderea combustibilului?') + fuelAsk + qline('d', 'Ce volum de ' + C('CO2') + ' (c.n.) se degajă la ardere?'),
      data: mchips(ob.kind === 'mass' ? [ob.f, fu.f] : [fu.f]).concat(['$V_m = 22,4 L/mol$ (c.n.)']),
      method: 'a) Câte „ecuații” se petrec: cantitatea dată / cantitatea de pe ecuație; apoi $Q = k · Q_{ecuație}$. b) La reacția endotermă ajunge doar $(100 − p)%$ din căldura degajată prin ardere. c), d) Proporții pe ecuația de ardere.',
      check: function () { return near(Qtot * eta, Qe) && near(nf * fu.qm, Qtot); },
      parts: [
        {
          id: 'a', ask: mode === 'mass' ? 'Căldura absorbită, în kcal' : 'Căldura absorbită', a: aAns, unit: mode === 'mass' ? 'kcal' : 'kJ', dec: 2, tol: 0.02, steps: [
            'Pe ecuație: $' + N(ob.nu, 1) + ' mol$ ' + C(ob.f) + ' $= ' + N(ob.nu * (ob.kind === 'vol' ? VM : ob.M), 1) + ' ' + unitQ + '$ ↔ $' + N(er.Q, 1) + ' kJ$.',
            'Avem $' + N(qty, 1) + ' ' + unitQ + '$ ⟹ $' + N(k, 2) + '$ × cantitatea de pe ecuație ⟹ $Q = ' + N(k, 2) + ' · ' + N(er.Q, 1) + ' = ' + N(Qe, 1) + ' kJ$.'].concat(mode === 'mass'
            ? ['$' + N(Qe, 1) + ' kJ = ' + N(Qe * 1000, 0) + ' J ⟹ ' + N(Qe * 1000, 0) + ' / 4,18 = ' + N(Qe * 1000 / CAL, 0) + ' cal = <b>' + N(aAns, 2) + ' kcal</b>$.'] : ['$Q = <b>' + N(Qe, 1) + ' kJ</b>$.'])
        },
        { id: 'b', ask: 'Căldura care trebuie degajată prin ardere', a: Qtot, unit: 'kJ', dec: 1, tol: 0.02, steps: ['Se pierde ' + p + '% ⟹ la reacție ajunge ' + (100 - p) + '%: $' + N(eta, 2) + ' · Q_{degajată} = ' + N(Qe, 1) + ' kJ$.', '$Q_{degajată} = (' + N(Qe, 1) + ')//(' + N(eta, 2) + ') = <b>' + N(Qtot, 1) + ' kJ</b>$.'] },
        {
          id: 'c', ask: mode === 'mass' ? 'Masa de ' + C(fu.f) : 'Volumul de ' + C(fu.f) + ' (c.n.)', a: fuelAns, unit: fuelUnit, dec: 1, tol: 0.02, steps: [
            'Pe ecuația arderii: $' + N(fu.nu, 1) + ' mol$ ' + C(fu.f) + ' ↔ $' + N(fu.r.Q, 1) + ' kJ$ ⟹ $ν = (' + N(Qtot, 1) + ' · ' + N(fu.nu, 1) + ')//(' + N(fu.r.Q, 1) + ') = ' + N(nf, 4) + ' mol$.',
            mode === 'mass' ? '$m = ν · M = ' + N(nf, 4) + ' · ' + N(fu.M, 1) + ' = <b>' + N(mf, 1) + ' g</b>$.' : '$V = ν · 22,4 = ' + N(nf, 4) + ' · 22,4 = <b>' + N(Vf, 1) + ' L</b>$.']
        },
        { id: 'd', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: Vco2, unit: 'L', dec: 1, tol: 0.02, steps: ['Din ecuație: $1 mol$ ' + C(fu.f) + ' ⟹ $' + N(fu.co2, 2) + ' mol$ ' + C('CO2') + '.', '$ν(CO_2) = ' + N(fu.co2, 2) + ' · ' + N(nf, 4) + ' = ' + N(fu.co2 * nf, 4) + ' mol$ ⟹ $V = ' + N(fu.co2 * nf, 4) + ' · 22,4 = <b>' + N(Vco2, 1) + ' L</b>$.'] }
      ]
    };
  }
  function termitaCouple(R) { return couple(R, ['gazapa', 'calcar', 'boudouard', 'amoniac-desc'], ['carbon', 'metanol', 'metan'], 'mass'); }

  reg('termita', [termitaMix, termitaCouple]);

  /* =====================================================
     2. Gaze la c.n. și căldura de reacție (etan)
     ===================================================== */
  /* 2a. descompunere parțială: câtă căldură, ce amestec de gaze rămâne */
  function etanPartial(R) {
    var r = T.RXN[R.pick(['etan', 'amoniac-desc'])], main = r.L[0], V1 = R.pick([44.8, 67.2, 89.6, 112, 134.4, 224, 448]), x = R.pick([40, 50, 60, 75, 80, 90]) / 100;
    var n0 = V1 / VM, nd = x * n0, k = nd / main[0], Q = k * r.Q;
    var gases = r.R.filter(function (p) { return T.isGas(p[1]); }), nprod = gases.reduce(function (s, p) { return s + p[0]; }, 0) * k, Vprod = nprod * VM, Vrest = V1 - nd * VM, Vtot = Vrest + Vprod;
    var prodNames = gases.map(function (p) { return C(p[1]); }).join(' și ');
    return {
      statement: '<p>Se dă ecuația termochimică a descompunerii:</p>' + eqBlock(r) + '<p>Se încălzește o probă de <b>' + N(V1, 1) + ' L</b> de ' + C(main[1]) + ' (c.n.), dar doar <b>' + N(x * 100, 0) + '%</b> din cantitatea de ' + C(main[1]) + ' se descompune.</p>' +
        qline('a', 'Ce căldură se absoarbe?') + qline('b', 'Ce volum total de produși gazoși (' + prodNames + ') se formează, la c.n.?') + qline('c', 'Ce volum de ' + C(main[1]) + ' rămâne nedescompus (c.n.)?') + qline('d', 'Ce volum are amestecul final de gaze (c.n.)?'),
      data: ['$V_m = 22,4 L/mol$ (c.n.)'],
      method: 'Mai întâi afli câți moli se descompun: $x%$ din numărul total de moli. Apoi raportezi la ecuație: căldura, produșii și reactantul rămas.',
      check: function () { return near(Vrest + nd * VM, V1) && near(k * r.Q, Q); },
      parts: [
        { id: 'a', ask: 'Căldura absorbită', a: Q, unit: 'kJ', dec: 1, tol: 0.02, steps: ['$ν = (' + N(V1, 1) + ')//(22,4) = ' + N(n0, 3) + ' mol$ ' + C(main[1]) + '; se descompun $' + N(x * 100, 0) + '%$ ⟹ $' + N(nd, 3) + ' mol$.', 'Pe ecuație: $' + N(main[0], 1) + ' mol$ ' + C(main[1]) + ' ↔ $' + N(r.Q, 1) + ' kJ$ ⟹ $Q = (' + N(nd, 3) + ' · ' + N(r.Q, 1) + ')//(' + N(main[0], 1) + ') = <b>' + N(Q, 1) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Volumul de produși gazoși (c.n.)', a: Vprod, unit: 'L', dec: 1, tol: 0.02, steps: ['Pe ecuație, la $' + N(main[0], 1) + ' mol$ ' + C(main[1]) + ' descompuși se formează $' + N(gases.reduce(function (s, p) { return s + p[0]; }, 0), 1) + ' mol$ de gaze (' + prodNames + ').', '$ν_{produși} = ' + N(gases.reduce(function (s, p) { return s + p[0]; }, 0), 1) + ' · (' + N(nd, 3) + ')//(' + N(main[0], 1) + ') = ' + N(nprod, 3) + ' mol$ ⟹ $V = ' + N(nprod, 3) + ' · 22,4 = <b>' + N(Vprod, 1) + ' L</b>$.'] },
        { id: 'c', ask: 'Volumul de ' + C(main[1]) + ' rămas', a: Vrest, unit: 'L', dec: 1, tol: 0.02, steps: ['Au rămas $' + N(100 - x * 100, 0) + '%$ din cantitate: $V = ' + N(1 - x, 2) + ' · ' + N(V1, 1) + ' = <b>' + N(Vrest, 1) + ' L</b>$.'] },
        { id: 'd', ask: 'Volumul amestecului final (c.n.)', a: Vtot, unit: 'L', dec: 1, tol: 0.02, steps: ['Amestecul final conține reactantul rămas și produșii gazoși:', '$V = ' + N(Vrest, 1) + ' + ' + N(Vprod, 1) + ' = <b>' + N(Vtot, 1) + ' L</b>$.'] }
      ]
    };
  }

  /* 2b. două reacții endoterme succesive: CaCO3 → CaO + CO2, apoi C + CO2 → 2CO */
  function etanTwoStep(R) {
    var r1 = T.RXN.calcar, r2 = T.RXN.boudouard, m = R.pick([50, 100, 150, 200, 250, 400, 500]), f = R.pick([40, 50, 60, 75, 80]) / 100;
    var n1 = m / 100, Q1 = n1 * r1.Q, VCO2 = n1 * VM, nr = f * n1, Q2 = nr * r2.Q, VCO = 2 * nr * VM, mC = nr * 12, Qt = Q1 + Q2, Vend = n1 * (1 + f) * VM;
    return {
      statement: '<p>Carbonatul de calciu se descompune termic, iar dioxidul de carbon format trece peste cărbune incandescent. Ecuațiile celor două procese:</p>' + eqBlock(r1) + eqBlock(r2) +
        '<p>Se descompun <b>' + N(m, 0) + ' g</b> de ' + C('CaCO3') + '. Din dioxidul de carbon obținut, doar <b>' + N(f * 100, 0) + '%</b> reacționează cu cărbunele (restul rămâne).</p>' +
        qline('a', 'Ce căldură absoarbe descompunerea carbonatului?') + qline('b', 'Ce căldură absoarbe reacția cu cărbunele?') + qline('c', 'Care este căldura totală absorbită, în <b>kcal</b>? <span class="muted">(1 cal ≈ 4,18 J)</span>') +
        qline('d', 'Ce masă de cărbune se consumă?') + qline('e', 'Ce volum de ' + C('CO') + ' (c.n.) se formează?') + qline('f', 'Ce volum au gazele rămase la sfârșit (c.n.): ' + C('CO2') + ' nereacționat și ' + C('CO') + '?'),
      data: mchips(['CaCO3(s)', 'C(s)']).concat(['$V_m = 22,4 L/mol$ (c.n.)']),
      method: 'Lucrezi pe rând: prima ecuație dă $ν(CO_2)$; doar o fracțiune din el intră în a doua ecuație. Apoi aduni căldurile și numeri gazele de la sfârșit.',
      check: function () { return near(Qt, Q1 + Q2) && near(Vend, (n1 - nr) * VM + VCO); },
      parts: [
        { id: 'a', ask: 'Căldura absorbită la descompunere', a: Q1, unit: 'kJ', dec: 1, tol: 0.02, steps: ['$ν(CaCO_3) = (' + N(m, 0) + ')//(100) = ' + N(n1, 3) + ' mol$.', 'Pe ecuație $1 mol ↔ ' + N(r1.Q, 1) + ' kJ$ ⟹ $Q_1 = ' + N(n1, 3) + ' · ' + N(r1.Q, 1) + ' = <b>' + N(Q1, 1) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Căldura absorbită la reacția cu cărbunele', a: Q2, unit: 'kJ', dec: 1, tol: 0.02, steps: ['Se formează $' + N(n1, 3) + ' mol$ ' + C('CO2') + '; reacționează $' + N(f * 100, 0) + '%$ ⟹ $' + N(nr, 3) + ' mol$.', 'Pe ecuație $1 mol$ ' + C('CO2') + ' ↔ $' + N(r2.Q, 1) + ' kJ$ ⟹ $Q_2 = ' + N(nr, 3) + ' · ' + N(r2.Q, 1) + ' = <b>' + N(Q2, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Căldura totală, în kcal', a: Qt / CAL, unit: 'kcal', dec: 2, tol: 0.02, steps: ['$Q = Q_1 + Q_2 = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' = ' + N(Qt, 1) + ' kJ = ' + N(Qt * 1000, 0) + ' J$.', '$' + N(Qt * 1000, 0) + ' / 4,18 = ' + N(Qt * 1000 / CAL, 0) + ' cal = <b>' + N(Qt / CAL, 2) + ' kcal</b>$.'] },
        { id: 'd', ask: 'Masa de cărbune consumată', a: mC, unit: 'g', dec: 2, tol: 0.02, steps: ['Pe ecuația a doua: $1 mol$ ' + C('CO2') + ' consumă $1 mol$ ' + C('C') + ' ⟹ $ν(C) = ' + N(nr, 3) + ' mol$.', '$m = ν · M = ' + N(nr, 3) + ' · 12 = <b>' + N(mC, 2) + ' g</b>$.'] },
        { id: 'e', ask: 'Volumul de ' + C('CO') + ' (c.n.)', a: VCO, unit: 'L', dec: 1, tol: 0.02, steps: ['Pe ecuație $1 mol$ ' + C('CO2') + ' ⟹ $2 mol$ ' + C('CO') + ' ⟹ $ν(CO) = 2 · ' + N(nr, 3) + ' = ' + N(2 * nr, 3) + ' mol$.', '$V = ' + N(2 * nr, 3) + ' · 22,4 = <b>' + N(VCO, 1) + ' L</b>$.'] },
        { id: 'f', ask: 'Volumul gazelor rămase (c.n.)', a: Vend, unit: 'L', dec: 1, tol: 0.02, steps: [C('CO2') + ' nereacționat: $' + N(n1, 3) + ' − ' + N(nr, 3) + ' = ' + N(n1 - nr, 3) + ' mol$; ' + C('CO') + ': $' + N(2 * nr, 3) + ' mol$.', '$V = (' + N(n1 - nr, 3) + ' + ' + N(2 * nr, 3) + ') · 22,4 = <b>' + N(Vend, 1) + ' L</b>$.'] }
      ]
    };
  }

  /* 2c. reacție endotermă cu gaze, alimentată de arderea unui combustibil gazos (volume la c.n.) */
  function etanCouple(R) { return couple(R, ['etan', 'reformare', 'boudouard', 'amoniac-desc'], ['propan', 'butan'], 'vol'); }

  reg('etan', [etanPartial, etanTwoStep, etanCouple]);

  /* =====================================================
     3. Moli, milimoli, kilograme (glucoza)
     ===================================================== */
  var GLUC2 = { type: 'exo', Q: 2803, L: [[1, 'C6H12O6(s)'], [6, 'O2(g)']], R: [[6, 'CO2(g)'], [6, 'H2O(l)']] };
  /* 3a. glucoza se oxidează în două moduri; direct (se dă procentul) sau invers (se dă căldura) */
  function glucozaTwoWays(R) {
    var r1 = T.RXN.glucoza, r2 = GLUC2, mk = R.pick([0.18, 0.36, 0.45, 0.9, 1.8, 2.7]), n = mk * 1000 / 180, direct = R.pick([true, false]);
    var p = R.pick([20, 25, 40, 50, 60, 75]) / 100;
    var Qtot = T.round(n * (p * r1.Q + (1 - p) * r2.Q), 1);
    var Pc, n1, n2, Q1, Q2, Qt, VCO2;
    if (direct) { Pc = p; } else { Pc = (r2.Q * n - Qtot) / ((r2.Q - r1.Q) * n); }
    n1 = Pc * n; n2 = (1 - Pc) * n; Q1 = n1 * r1.Q; Q2 = n2 * r2.Q; Qt = Q1 + Q2; VCO2 = 6 * n2 * VM;
    var head = '<p>Glucoza se poate oxida în două moduri. Ecuațiile termochimice:</p>' + eqBlock(r1) + eqBlock(r2) + '<p>Se oxidează <b>' + N(mk, 2) + ' kg</b> de glucoză';
    var stmt, parts;
    var mm = n * 1000;
    if (direct) {
      stmt = head + ', din care <b>' + N(p * 100, 0) + '%</b> (din numărul de moli) după prima ecuație, iar restul după a doua.</p>' + qline('a', 'Câți <b>mmol</b> de glucoză se oxidează în total?') + qline('b', 'Ce căldură se degajă prin prima reacție?') + qline('c', 'Ce căldură se degajă prin a doua reacție?') +
        qline('d', 'Care este căldura totală, în <b>kcal</b>? <span class="muted">(1 cal ≈ 4,18 J)</span>') + qline('e', 'Ce volum de ' + C('CO2') + ' (c.n.) se degajă?');
      parts = [
        { id: 'a', ask: 'Cantitatea totală de glucoză', a: mm, unit: 'mmol', dec: 0, tol: 0.02, steps: ['$m = ' + N(mk, 2) + ' kg = ' + N(mk * 1000, 0) + ' g$ ⟹ $ν = (' + N(mk * 1000, 0) + ')//(180) = ' + N(n, 3) + ' mol$.', '$' + N(n, 3) + ' mol = <b>' + N(mm, 0) + ' mmol</b>$.'] },
        { id: 'b', ask: 'Căldura din prima reacție', a: Q1, unit: 'kJ', dec: 1, tol: 0.02, steps: ['Prima reacție: $' + N(p * 100, 0) + '%$ din ' + N(n, 3) + ' mol $= ' + N(n1, 3) + ' mol$.', 'Pe ecuație $1 mol ↔ ' + N(r1.Q, 0) + ' kJ$ ⟹ $Q_1 = ' + N(n1, 3) + ' · ' + N(r1.Q, 0) + ' = <b>' + N(Q1, 1) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Căldura din a doua reacție', a: Q2, unit: 'kJ', dec: 1, tol: 0.02, steps: ['A doua reacție: $' + N((1 - p) * 100, 0) + '%$ ⟹ $' + N(n2, 3) + ' mol$.', 'Pe ecuație $1 mol ↔ ' + N(r2.Q, 0) + ' kJ$ ⟹ $Q_2 = ' + N(n2, 3) + ' · ' + N(r2.Q, 0) + ' = <b>' + N(Q2, 1) + ' kJ</b>$.'] },
        { id: 'd', ask: 'Căldura totală, în kcal', a: Qt / CAL, unit: 'kcal', dec: 2, tol: 0.02, steps: ['$Q = Q_1 + Q_2 = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' = ' + N(Qt, 1) + ' kJ = ' + N(Qt * 1000, 0) + ' J$.', '$' + N(Qt * 1000, 0) + ' / 4,18 = ' + N(Qt * 1000 / CAL, 0) + ' cal = <b>' + N(Qt / CAL, 2) + ' kcal</b>$.'] },
        { id: 'e', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: VCO2, unit: 'L', dec: 1, tol: 0.02, steps: ['Doar a doua reacție dă ' + C('CO2') + ': $1 mol$ glucoză ⟹ $6 mol$ ' + C('CO2') + '.', '$ν(CO_2) = 6 · ' + N(n2, 3) + ' = ' + N(6 * n2, 3) + ' mol$ ⟹ $V = ' + N(6 * n2, 3) + ' · 22,4 = <b>' + N(VCO2, 1) + ' L</b>$.'] }
      ];
    } else {
      stmt = head + '. În total se degajă <b>' + N(Qtot, 1) + ' kJ</b>.</p>' + qline('a', 'Câți <b>mmol</b> de glucoză se oxidează în total?') + qline('b', 'Ce procent din glucoză (din numărul de moli) se oxidează după prima ecuație?') + qline('c', 'Câți mmol de glucoză se oxidează după fiecare ecuație?') + qline('d', 'Ce volum de ' + C('CO2') + ' (c.n.) se degajă?');
      var nGap = n1 * 1000;
      parts = [
        { id: 'a', ask: 'Cantitatea totală de glucoză', a: mm, unit: 'mmol', dec: 0, tol: 0.02, steps: ['$m = ' + N(mk, 2) + ' kg = ' + N(mk * 1000, 0) + ' g$ ⟹ $ν = (' + N(mk * 1000, 0) + ')//(180) = ' + N(n, 3) + ' mol = <b>' + N(mm, 0) + ' mmol</b>$.'] },
        {
          id: 'b', ask: 'Procentul oxidat după prima ecuație', a: Pc * 100, unit: '%', dec: 1, tol: 0.02, steps: [
            'Notez cu $a$ numărul de moli oxidați după prima ecuație; după a doua se oxidează $' + N(n, 3) + ' − a$.',
            'Căldura: $' + N(r1.Q, 0) + ' · a + ' + N(r2.Q, 0) + ' · (' + N(n, 3) + ' − a) = ' + N(Qtot, 1) + '$.',
            '$' + N(r2.Q * n, 1) + ' − ' + N(r2.Q - r1.Q, 0) + ' · a = ' + N(Qtot, 1) + '$ ⟹ $a = (' + N(r2.Q * n, 1) + ' − ' + N(Qtot, 1) + ')//(' + N(r2.Q - r1.Q, 0) + ') = ' + N(n1, 3) + ' mol$.',
            '$p = (' + N(n1, 3) + ')//(' + N(n, 3) + ') · 100 = <b>' + N(Pc * 100, 1) + '%</b>$.']
        },
        { id: 'c', ask: 'mmol oxidați după prima ecuație', a: nGap, unit: 'mmol', dec: 0, tol: 0.02, steps: ['Prima: $' + N(n1, 3) + ' mol = <b>' + N(nGap, 0) + ' mmol</b>$; a doua: $' + N(n, 3) + ' − ' + N(n1, 3) + ' = ' + N(n2, 3) + ' mol = ' + N(n2 * 1000, 0) + ' mmol$.'] },
        { id: 'd', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: VCO2, unit: 'L', dec: 1, tol: 0.02, steps: ['Doar a doua reacție dă ' + C('CO2') + ' ($6 mol$ la $1 mol$ glucoză): $ν = 6 · ' + N(n2, 3) + ' = ' + N(6 * n2, 3) + ' mol$.', '$V = ' + N(6 * n2, 3) + ' · 22,4 = <b>' + N(VCO2, 1) + ' L</b>$.'] }
      ];
    }
    return {
      statement: stmt, data: ['M(glucoză) = 180 g/mol', '1 mmol = 10⁻³ mol', '$V_m = 22,4 L/mol$ (c.n.)'],
      method: direct ? 'Împarte numărul total de moli între cele două reacții, calculează fiecare căldură pe ecuația ei și adună-le.' : 'Notează cu $a$ moli după prima ecuație și $n − a$ după a doua; scrie că suma căldurilor este cea dată și rezolvă ecuația.',
      check: function () { return near(Q1 + Q2, Qt) && (direct || near(Qt, Qtot)) && Pc > 0 && Pc < 1; },
      parts: parts
    };
  }

  /* 3b. carbonul arde incomplet (la CO) și complet (la CO2) */
  function glucozaCarbon(R) {
    var rC = { type: 'exo', Q: 110.5, L: [[1, 'C(s)'], [0.5, 'O2(g)']], R: [[1, 'CO(g)']] }, rF = T.RXN.carbon;
    var m = R.pick([12, 24, 36, 48, 60, 120]), n = m / 12, direct = R.pick([true, false]), p = R.pick([20, 25, 40, 50, 60, 75]) / 100;
    var Qtot = T.round(n * (p * rC.Q + (1 - p) * rF.Q), 1), Pc = direct ? p : (rF.Q * n - Qtot) / ((rF.Q - rC.Q) * n);
    var n1 = Pc * n, n2 = (1 - Pc) * n, Q1 = n1 * rC.Q, Q2 = n2 * rF.Q, Qt = Q1 + Q2, VCO = n1 * VM, VCO2 = n2 * VM, mO2 = (0.5 * n1 + n2) * 32;
    var stmt = '<p>Carbonul poate arde incomplet (la monoxid de carbon) sau complet (la dioxid de carbon). Ecuațiile termochimice:</p>' + eqBlock(rC) + eqBlock(rF) + '<p>Ard <b>' + N(m, 0) + ' g</b> de carbon' +
      (direct ? ', <b>' + N(p * 100, 0) + '%</b> din cantitate (din numărul de moli) după prima ecuație, iar restul după a doua.</p>' : '. În total se degajă <b>' + N(Qtot, 1) + ' kJ</b>.</p>') +
      (direct ? qline('a', 'Ce căldură totală se degajă?') : qline('a', 'Ce procent din carbon arde incomplet?')) + qline('b', 'Ce volum de ' + C('CO') + ' (c.n.) se formează?') + qline('c', 'Ce volum de ' + C('CO2') + ' (c.n.) se formează?') + qline('d', 'Ce masă de ' + C('O2') + ' se consumă?');
    var firstPart = direct
      ? { id: 'a', ask: 'Căldura totală', a: Qt, unit: 'kJ', dec: 1, tol: 0.02, steps: ['$ν(C) = (' + N(m, 0) + ')//(12) = ' + N(n, 2) + ' mol$; incomplet: $' + N(p * 100, 0) + '%$ ⟹ $' + N(n1, 3) + ' mol$; complet: $' + N(n2, 3) + ' mol$.', 'Pe ecuații: $1 mol$ ' + C('C') + ' ⟹ $' + N(rC.Q, 1) + ' kJ$ (incomplet), respectiv $' + N(rF.Q, 1) + ' kJ$ (complet).', '$Q = ' + N(n1, 3) + ' · ' + N(rC.Q, 1) + ' + ' + N(n2, 3) + ' · ' + N(rF.Q, 1) + ' = ' + N(Q1, 1) + ' + ' + N(Q2, 1) + ' = <b>' + N(Qt, 1) + ' kJ</b>$.'] }
      : {
        id: 'a', ask: 'Procentul care arde incomplet', a: Pc * 100, unit: '%', dec: 1, tol: 0.02, steps: [
          '$ν(C) = (' + N(m, 0) + ')//(12) = ' + N(n, 2) + ' mol$. Notez cu $a$ moli arși incomplet și $' + N(n, 2) + ' − a$ moli arși complet.',
          'Căldura: $' + N(rC.Q, 1) + ' · a + ' + N(rF.Q, 1) + ' · (' + N(n, 2) + ' − a) = ' + N(Qtot, 1) + '$ ⟹ $' + N(rF.Q * n, 1) + ' − ' + N(rF.Q - rC.Q, 1) + ' · a = ' + N(Qtot, 1) + '$.',
          '$a = (' + N(rF.Q * n, 1) + ' − ' + N(Qtot, 1) + ')//(' + N(rF.Q - rC.Q, 1) + ') = ' + N(n1, 3) + ' mol$ ⟹ $p = (' + N(n1, 3) + ')//(' + N(n, 2) + ') · 100 = <b>' + N(Pc * 100, 1) + '%</b>$.']
      };
    return {
      statement: stmt, data: mchips(['C(s)', 'O2(g)']).concat(['$V_m = 22,4 L/mol$ (c.n.)']),
      method: direct ? 'Împarte moli de carbon între cele două ecuații; fiecare se ia pe ecuația lui. Oxigenul: $½$ mol la arderea incompletă, $1$ mol la cea completă (pentru 1 mol de C).' : 'Notează cu $a$ moli arși incomplet; scrie căldura totală ca sumă a celor două și rezolvă.',
      check: function () { return near(Q1 + Q2, Qt) && (direct || near(Qt, Qtot)) && Pc > 0 && Pc < 1; },
      parts: [firstPart,
        { id: 'b', ask: 'Volumul de ' + C('CO') + ' (c.n.)', a: VCO, unit: 'L', dec: 1, tol: 0.02, steps: ['Incomplet: $1 mol$ ' + C('C') + ' ⟹ $1 mol$ ' + C('CO') + ' ⟹ $ν(CO) = ' + N(n1, 3) + ' mol$.', '$V = ' + N(n1, 3) + ' · 22,4 = <b>' + N(VCO, 1) + ' L</b>$.'] },
        { id: 'c', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: VCO2, unit: 'L', dec: 1, tol: 0.02, steps: ['Complet: $1 mol$ ' + C('C') + ' ⟹ $1 mol$ ' + C('CO2') + ' ⟹ $ν(CO_2) = ' + N(n2, 3) + ' mol$.', '$V = ' + N(n2, 3) + ' · 22,4 = <b>' + N(VCO2, 1) + ' L</b>$.'] },
        { id: 'd', ask: 'Masa de ' + C('O2') + ' consumată', a: mO2, unit: 'g', dec: 1, tol: 0.02, steps: ['Din ecuații: $0,5 mol$ ' + C('O2') + ' la fiecare mol ars incomplet, $1 mol$ la fiecare mol ars complet.', '$ν(O_2) = 0,5 · ' + N(n1, 3) + ' + ' + N(n2, 3) + ' = ' + N(0.5 * n1 + n2, 3) + ' mol$ ⟹ $m = ' + N(0.5 * n1 + n2, 3) + ' · 32 = <b>' + N(mO2, 1) + ' g</b>$.'] }
      ]
    };
  }

  /* 3c. lanț de unități: kcal → mmol → grame → litri → kg */
  function glucozaChain(R) {
    var r = T.RXN[R.pick(['amoniac', 'metanol', 'magneziu', 'sulf', 'termita'])];
    var main = r.L.filter(function (p) { return p[1] !== 'O2(g)'; })[0], pr = r.R.filter(function (p) { return p[1] !== 'H2O(l)'; })[0], mn = T.massOf(main[1]), mp = T.massOf(pr[1]);
    var k = R.pick([0.05, 0.1, 0.2, 0.25, 0.5, 2.5]), Qkj = k * r.Q, kcal = T.round(Qkj / CAL, 2);
    var Qkj2 = kcal * CAL, kk = Qkj2 / r.Q, nMain = kk * main[0], mmolMain = nMain * 1000, nP = kk * pr[0], mP = nP * mp;
    var y = R.pick([0.5, 1, 2, 5]), nY = y * 1000 / mp, QY = nY / pr[0] * r.Q, gasP = T.isGas(pr[1]);
    var parts = [
      { id: 'a', ask: 'Căldura în kJ', a: Qkj2, unit: 'kJ', dec: 2, tol: 0.02, steps: ['$' + N(kcal, 2) + ' kcal = ' + N(kcal * 1000, 2) + ' cal$ ⟹ $Q = ' + N(kcal * 1000, 2) + ' · 4,18 J = ' + N(Qkj2 * 1000, 0) + ' J = <b>' + N(Qkj2, 2) + ' kJ</b>$.'] },
      { id: 'b', ask: 'Cantitatea de ' + C(main[1]) + ' consumată', a: mmolMain, unit: 'mmol', dec: 1, tol: 0.02, steps: ['Pe ecuație: $' + N(main[0], 1) + ' mol$ ' + C(main[1]) + ' ↔ $' + N(r.Q, 1) + ' kJ$ ⟹ $ν = (' + N(Qkj2, 2) + ' · ' + N(main[0], 1) + ')//(' + N(r.Q, 1) + ') = ' + N(nMain, 4) + ' mol$.', '$' + N(nMain, 4) + ' mol = <b>' + N(mmolMain, 1) + ' mmol</b>$.'] },
      { id: 'c', ask: 'Masa de ' + C(pr[1]) + ' formată', a: mP, unit: 'g', dec: 2, tol: 0.02, steps: ['Din ecuație: $' + N(main[0], 1) + ' mol$ ' + C(main[1]) + ' ⟹ $' + N(pr[0], 1) + ' mol$ ' + C(pr[1]) + ' ⟹ $ν = ' + N(nMain, 4) + ' · (' + N(pr[0], 1) + ')//(' + N(main[0], 1) + ') = ' + N(nP, 4) + ' mol$.', '$m = ν · M = ' + N(nP, 4) + ' · ' + N(mp, 1) + ' = <b>' + N(mP, 2) + ' g</b>$.'] }
    ];
    if (gasP) parts.push({ id: 'd', ask: 'Volumul de ' + C(pr[1]) + ' (c.n.)', a: nP * VM, unit: 'L', dec: 2, tol: 0.02, steps: ['$V = ν · 22,4 = ' + N(nP, 4) + ' · 22,4 = <b>' + N(nP * VM, 2) + ' L</b>$.'] });
    parts.push({ id: gasP ? 'e' : 'd', ask: 'Căldura la formarea a ' + N(y, 1) + ' kg de ' + C(pr[1]), a: QY, unit: 'kJ', dec: 1, tol: 0.02, steps: ['$' + N(y, 1) + ' kg = ' + N(y * 1000, 0) + ' g$ ⟹ $ν = (' + N(y * 1000, 0) + ')//(' + N(mp, 1) + ') = ' + N(nY, 3) + ' mol$.', 'Pe ecuație: $' + N(pr[0], 1) + ' mol$ ' + C(pr[1]) + ' ↔ $' + N(r.Q, 1) + ' kJ$ ⟹ $Q = (' + N(nY, 3) + ' · ' + N(r.Q, 1) + ')//(' + N(pr[0], 1) + ') = <b>' + N(QY, 1) + ' kJ</b>$.'] });
    return {
      statement: '<p>Se dă ecuația termochimică:</p>' + eqBlock(r) + '<p>La reacție se degajă <b>' + N(kcal, 2) + ' kcal</b> <span class="muted">(1 cal ≈ 4,18 J)</span>.</p>' + qline('a', 'Câți kJ s-au degajat?') + qline('b', 'Câți <b>mmol</b> de ' + C(main[1]) + ' au reacționat?') + qline('c', 'Ce masă de ' + C(pr[1]) + ' s-a format?') +
        (gasP ? qline('d', 'Ce volum de ' + C(pr[1]) + ' (c.n.) s-a format?') : '') + qline(gasP ? 'e' : 'd', 'Ce căldură (kJ) se degajă la formarea a <b>' + N(y, 1) + ' kg</b> de ' + C(pr[1]) + '?'),
      data: mchips([main[1], pr[1]]).concat(['1 mmol = 10⁻³ mol'], gasP ? ['$V_m = 22,4 L/mol$ (c.n.)'] : []),
      method: 'Lanț de conversii: kcal → J → kJ; kJ → moli (regula de trei pe ecuație); moli → mmol, grame, litri. La final, invers: kg → moli → kJ.',
      check: function () { return near(nMain * r.Q / main[0], Qkj2) && near(QY, nY / pr[0] * r.Q); },
      parts: parts
    };
  }

  reg('glucoza', [glucozaTwoWays, glucozaCarbon, glucozaChain]);
})(typeof window !== 'undefined' ? window : globalThis);
