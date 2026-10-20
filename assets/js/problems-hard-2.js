/* =========================================================
   problems-hard-2.js — nivelul 4, „Foarte greu”, pentru tipurile 4–5
   (încălzirea apei prin ardere, încălzire + topire)
   Doar noțiunile din caiet: Q = m·c·ΔT, Q = ν·λ, pierderi de căldură în procente, căldura de ardere pe mol;
   dificultatea vine din etape multiple, amestecuri (două necunoscute) și mărimi cerute „invers”.
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, H = T.hard;
  var N = H.N, C = H.C, Cn = H.Cn, gen = H.gen, eqBlock = H.eqBlock, mchips = H.mchips, qline = H.qline, near = H.near, reg = H.reg, VM = H.VM;

  /* =====================================================
     4. Apa + ardere (Tema 7)
     ===================================================== */
  /* 4a. gheață → apă caldă, cu pierderi */
  function apaIce(R) {
    var mi = R.pick([50, 100, 150, 200, 250]), t0 = R.pick([5, 10, 15, 20, 25]), tf = R.pick([20, 40, 50, 60, 80]), p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100;
    var fu = R.pick(T.FUELS), cg = 2.09, lam = 334, cw = R.pick([4.18, 4.184]);
    var Q1 = mi * cg * t0, Q2 = mi * lam, Q3 = mi * cw * tf, Qu = Q1 + Q2 + Q3, Qt = Qu / eta, n = Qt / 1000 / fu.Hc, mf = n * fu.M, pm = Q2 / Qu * 100;
    return {
      statement: '<p>Se încălzesc într-un pahar Berzelius <b>' + mi + ' g</b> de gheață, aflată la temperatura de <b>−' + t0 + ' °C</b>, până când se transformă în apă lichidă la temperatura de <b>' + tf + ' °C</b>. Căldura se obține prin arderea ' + fu.n + ' (la arderea unui mol de ' + Cn(fu.f) + ' se eliberează o cantitate de căldură de <b>' + N(fu.Hc, 1) + ' kJ</b>); <b>' + p + '%</b> din căldura eliberată se pierde în mediu.</p>' +
        qline('a', 'Calculați cantitatea de căldură (în kJ) necesară încălzirii gheții până la 0 °C.') + qline('b', 'Calculați cantitatea de căldură (în kJ) necesară topirii gheții.') + qline('c', 'Calculați cantitatea de căldură (în kJ) necesară încălzirii apei de la 0 °C la ' + tf + ' °C.') +
        qline('d', 'Calculați masa de ' + Cn(fu.f) + ' care trebuie arsă.') + qline('e', 'Calculați ce procent din căldura utilă se consumă pentru topire.'),
      data: ['căldura specifică a gheții $c = 2,09 J/g·K$', 'căldura latentă de topire a gheții $λ = 334 J/g$', 'căldura specifică a apei $c = ' + N(cw, 3) + ' J/g·K$', 'M(' + C(fu.f) + ') = ' + N(fu.M, 1) + ' g/mol'],
      method: 'Trei etape, fiecare cu formula ei: gheață ($m·c·ΔT$), topire ($m·λ$, la 0 °C), apă ($m·c·ΔT$). Le aduni, apoi corectezi cu pierderile și treci la moli de combustibil.',
      check: function () { return near(Qu * 1, Q1 + Q2 + Q3) && near(Qt * eta, Qu); },
      parts: [
        { id: 'a', ask: 'Căldura de încălzire a gheții', a: Q1 / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: ['$ΔT = 0 − (−' + t0 + ') = ' + t0 + ' K$.', '$Q_1 = m·c·ΔT = ' + mi + ' · 2,09 · ' + t0 + ' = ' + N(Q1, 1) + ' J = <b>' + N(Q1 / 1000, 3) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Căldura de topire', a: Q2 / 1000, unit: 'kJ', dec: 2, tol: 0.02, steps: ['$Q_2 = m·λ = ' + mi + ' · 334 = ' + N(Q2, 0) + ' J = <b>' + N(Q2 / 1000, 2) + ' kJ</b>$ (temperatura rămâne 0 °C).'] },
        { id: 'c', ask: 'Căldura de încălzire a apei', a: Q3 / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: ['$ΔT = ' + tf + ' − 0 = ' + tf + ' K$.', '$Q_3 = ' + mi + ' · ' + N(cw, 3) + ' · ' + tf + ' = ' + N(Q3, 1) + ' J = <b>' + N(Q3 / 1000, 3) + ' kJ</b>$.'] },
        {
          id: 'd', ask: 'Masa de ' + C(fu.f), a: mf, unit: 'g', dec: 2, tol: 0.02, steps: [
            'Căldura utilă: $Q_u = Q_1 + Q_2 + Q_3 = ' + N(Q1 / 1000, 3) + ' + ' + N(Q2 / 1000, 2) + ' + ' + N(Q3 / 1000, 3) + ' = ' + N(Qu / 1000, 3) + ' kJ$.',
            'Se pierde ' + p + '% ⟹ la apă ajunge ' + (100 - p) + '%: $Q_{total} = (' + N(Qu / 1000, 3) + ')//(' + N(eta, 2) + ') = ' + N(Qt / 1000, 3) + ' kJ$.',
            '$ν = (' + N(Qt / 1000, 3) + ')//(' + N(fu.Hc, 1) + ') = ' + N(n, 5) + ' mol$ ⟹ $m = ν · M = ' + N(n, 5) + ' · ' + N(fu.M, 1) + ' = <b>' + N(mf, 2) + ' g</b>$.']
        },
        { id: 'e', ask: 'Procentul din căldura utilă folosit la topire', a: pm, unit: '%', dec: 1, tol: 0.02, steps: ['$p = (Q_2)//(Q_u) · 100 = (' + N(Q2 / 1000, 2) + ')//(' + N(Qu / 1000, 3) + ') · 100 = <b>' + N(pm, 1) + '%</b>$.'] }
      ]
    };
  }

  /* 4b. amestec de doi combustibili care încălzește apă */
  function apaMix(R) {
    for (var tries = 0; tries < 30; tries++) {
      var pair = R.shuffle(T.FUELS).slice(0, 2), A = pair[0], B = pair[1], a = R.pick([0.1, 0.2, 0.25, 0.4, 0.5]), b = R.pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      if (!!A.gas !== !!B.gas || (A.f === 'C(s)') !== (B.f === 'C(s)')) continue;   // amestec de substanțe în aceeași stare de agregare
      var p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100, c = 4.18, t1 = R.pick([15, 20, 25]), dT = R.pick([40, 50, 60, 70]), t2 = t1 + dT;
      var m = a * A.M + b * B.M, Qt0 = a * A.Hc + b * B.Hc, Qu0 = eta * Qt0, mw = Math.round(Qu0 * 1000 / (c * dT));
      var Qu = mw * c * dT / 1000, Qt = Qu / eta, hA = A.Hc / A.M, hB = B.Hc / B.M, x = (Qt - hB * m) / (hA - hB), y = m - x;
      if (!(x > 0.05 * m && y > 0.05 * m) || mw < 100) continue;
      var nA = x / A.M, nB = y / B.M;
      return {
        statement: '<p>Un amestec de ' + Cn(A.f) + ' și ' + Cn(B.f) + ', cu masa totală de <b>' + N(m, 2) + ' g</b>, este ars complet. Căldura eliberată încălzește într-un pahar Berzelius <b>' + N(mw, 0) + ' g</b> de apă, de la temperatura de <b>' + t1 + ' °C</b> la temperatura de <b>' + t2 + ' °C</b>; <b>' + p + '%</b> din căldura eliberată se pierde în mediu. La arderea unui mol de ' + Cn(A.f) + ' se eliberează <b>' + N(A.Hc, 1) + ' kJ</b>, iar la arderea unui mol de ' + Cn(B.f) + ' se eliberează <b>' + N(B.Hc, 1) + ' kJ</b>.</p>' +
          qline('a', 'Calculați cantitatea de căldură utilă primită de apă.') + qline('b', 'Calculați cantitatea totală de căldură eliberată prin ardere.') + qline('c', 'Calculați masa de ' + Cn(A.f) + ' din amestec.') + qline('d', 'Calculați masa de ' + Cn(B.f) + ' din amestec.'),
        data: ['căldura specifică a apei $c = 4,18 J/g·K$'].concat(mchips([A.f, B.f])),
        method: 'Din căldura de ardere pe mol afli căldura pe gram pentru fiecare combustibil. Apoi scrii un sistem cu necunoscutele $x$, $y$ (mase): una pentru masă și una pentru căldura totală.',
        check: function () { return near(hA * x + hB * y, Qt) && near(x + y, m) && x > 0 && y > 0; },
        parts: [
          { id: 'a', ask: 'Căldura utilă primită de apă', a: Qu, unit: 'kJ', dec: 2, tol: 0.02, steps: ['$ΔT = ' + t2 + ' − ' + t1 + ' = ' + dT + ' K$.', '$Q_u = m·c·ΔT = ' + N(mw, 0) + ' · 4,18 · ' + dT + ' = ' + N(mw * c * dT, 0) + ' J = <b>' + N(Qu, 2) + ' kJ</b>$.'] },
          { id: 'b', ask: 'Căldura totală degajată', a: Qt, unit: 'kJ', dec: 2, tol: 0.02, steps: ['Se pierde ' + p + '% ⟹ la apă ajunge ' + (100 - p) + '%: $' + N(eta, 2) + ' · Q_{total} = ' + N(Qu, 2) + ' kJ$.', '$Q_{total} = (' + N(Qu, 2) + ')//(' + N(eta, 2) + ') = <b>' + N(Qt, 2) + ' kJ</b>$.'] },
          {
            id: 'c', ask: 'Masa de ' + C(A.f), a: x, unit: 'g', dec: 2, tol: 0.03, steps: [
              'Căldura pe gram: $h_A = (' + N(A.Hc, 1) + ')//(' + N(A.M, 1) + ') = ' + N(hA, 4) + ' kJ/g$; $h_B = (' + N(B.Hc, 1) + ')//(' + N(B.M, 1) + ') = ' + N(hB, 4) + ' kJ/g$.',
              'Notez $x$ = masa lui ' + C(A.f) + ', $y$ = masa lui ' + C(B.f) + ': &nbsp; $x + y = ' + N(m, 2) + '$ &nbsp; și &nbsp; $h_A·x + h_B·y = ' + N(Qt, 2) + '$.',
              '$y = ' + N(m, 2) + ' − x$ ⟹ $x = (' + N(Qt, 2) + ' − h_B · ' + N(m, 2) + ')//(h_A − h_B) = (' + N(Qt, 2) + ' − ' + N(hB, 4) + ' · ' + N(m, 2) + ')//(' + N(hA, 4) + ' − ' + N(hB, 4) + ') = <b>' + N(x, 2) + ' g</b>$.']
          },
          { id: 'd', ask: 'Masa de ' + C(B.f), a: y, unit: 'g', dec: 2, tol: 0.03, steps: ['$y = ' + N(m, 2) + ' − ' + N(x, 2) + ' = <b>' + N(y, 2) + ' g</b>$.', 'Verificare: $' + N(hA, 4) + ' · ' + N(x, 2) + ' + ' + N(hB, 4) + ' · ' + N(y, 2) + ' = ' + N(hA * x + hB * y, 2) + ' kJ$ ✓'] }
        ]
      };
    }
    return apaIce(R);
  }

  /* 4c. căldura de ardere necunoscută, aflată din experiment */
  function apaUnknown(R) {
    var fu = R.pick(T.FUELS), n = R.pick([0.05, 0.1, 0.15, 0.2]), mfu = n * fu.M, p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100, c = 4.18, t1 = R.pick([15, 18, 20, 22, 25]), dT = R.pick([40, 50, 55, 60, 70]), t2 = t1 + dT;
    var mw = Math.round(eta * n * fu.Hc * 1000 / (c * dT)), Qu = mw * c * dT / 1000, Qt = Qu / eta, Hx = Qt / n, VCO2 = n * fu.co2 * VM;
    return {
      statement: '<p>Prin arderea completă a <b>' + N(mfu, 2) + ' g</b> de ' + Cn(fu.f) + ' se încălzesc într-un pahar Berzelius <b>' + N(mw, 0) + ' g</b> de apă, de la temperatura de <b>' + t1 + ' °C</b> la temperatura de <b>' + t2 + ' °C</b>. <b>' + p + '%</b> din căldura eliberată se pierde în mediu. Din 1 mol de ' + Cn(fu.f) + ' rezultă ' + N(fu.co2, 0) + ' mol de ' + C('CO2') + '.</p>' +
        qline('a', 'Calculați cantitatea de căldură primită de apă.') + qline('b', 'Calculați cantitatea totală de căldură eliberată la ardere.') + qline('c', 'Calculați căldura de ardere a ' + fu.n + ', exprimată în kJ/mol.') + qline('d', 'Calculați volumul de ' + C('CO2') + ' (c.n.) care se degajă.'),
      data: ['căldura specifică a apei $c = 4,18 J/g·K$'].concat(mchips([fu.f]), ['$V_m = 22,4 L/mol$ (c.n.)']),
      method: 'a) $Q = m·c·ΔT$. b) Doar $(100 − p)%$ din căldura degajată ajunge la apă. c) Căldura de ardere = căldura degajată / numărul de moli arși. d) Din raportul molar al arderii.',
      check: function () { return near(Qt * eta, Qu) && near(Hx * n, Qt); },
      parts: [
        { id: 'a', ask: 'Căldura primită de apă', a: Qu, unit: 'kJ', dec: 2, tol: 0.02, steps: ['$ΔT = ' + t2 + ' − ' + t1 + ' = ' + dT + ' K$.', '$Q = m·c·ΔT = ' + N(mw, 0) + ' · 4,18 · ' + dT + ' = ' + N(mw * c * dT, 0) + ' J = <b>' + N(Qu, 2) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Căldura totală degajată', a: Qt, unit: 'kJ', dec: 2, tol: 0.02, steps: ['La apă ajunge ' + (100 - p) + '% din căldura degajată: $Q_{total} = (' + N(Qu, 2) + ')//(' + N(eta, 2) + ') = <b>' + N(Qt, 2) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Căldura de ardere', a: Hx, unit: 'kJ/mol', dec: 1, tol: 0.02, steps: ['$ν = (' + N(mfu, 2) + ')//(' + N(fu.M, 1) + ') = ' + N(n, 3) + ' mol$ ' + C(fu.f) + '.', 'Căldura degajată de 1 mol: $(' + N(Qt, 2) + ')//(' + N(n, 3) + ') = <b>' + N(Hx, 1) + ' kJ/mol</b>$.'] },
        { id: 'd', ask: 'Volumul de ' + C('CO2') + ' (c.n.)', a: VCO2, unit: 'L', dec: 2, tol: 0.02, steps: ['$ν(CO_2) = ' + N(fu.co2, 0) + ' · ' + N(n, 3) + ' = ' + N(fu.co2 * n, 3) + ' mol$.', '$V = ' + N(fu.co2 * n, 3) + ' · 22,4 = <b>' + N(VCO2, 2) + ' L</b>$.'] }
      ]
    };
  }

  reg('apa-etanol', [apaIce, apaMix, apaUnknown]);

  /* =====================================================
     5. Încălzire + topire (Tema 8)
     ===================================================== */
  var FUEL_S = ['carbon', 'metan', 'metanol'];
  function fuelOf(key) { var r = T.RXN[key], l = r.L[0]; return { r: r, f: l[1], nu: l[0], M: T.massOf(l[1]), qm: r.Q / l[0], co2: r.R.filter(function (p) { return p[1] === 'CO2(g)'; })[0][0] / l[0] }; }
  function metalData(me) { return T.metalChips(me, true); }

  /* 5a. metal încălzit, topit și încălzit lichid, cu căldura unei arderi (cu pierderi) */
  function sodiuFuel(R) {
    var me = R.pick(T.METALS), ti = R.pick([20, 25]), m = R.pick([10, 20, 25, 40, 50, 100]), tf = me.tm + R.pick([20, 30, 50, 80, 100]), fu = fuelOf(R.pick(FUEL_S)), p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100;
    var d1 = me.tm - ti, d2 = tf - me.tm, nu = m / me.M, Q1 = m * me.c * d1, Q2 = nu * me.lam * 1000, Q3 = m * me.cl * d2, Qn = Q1 + Q2 + Q3, Qd = Qn / 1000 / eta, nf = Qd / fu.qm, mf = nf * fu.M, pm = Q2 / Qn * 100;
    return {
      statement: '<p>Se încălzesc <b>' + m + ' g</b> de ' + me.n + ', de la temperatura de <b>' + ti + ' °C</b> până la temperatura de <b>' + tf + ' °C</b>, trecând prin topire. Căldura provine din arderea ' + gen(fu.f) + ', conform ecuației termochimice:</p>' + eqBlock(fu.r) + '<p><b>' + p + '%</b> din căldura eliberată se pierde în mediu.</p>' +
        qline('a', 'Calculați cantitatea de căldură (în kJ) consumată pentru încălzirea metalului solid.') + qline('b', 'Calculați cantitatea de căldură (în kJ) consumată pentru topire.') + qline('c', 'Calculați cantitatea de căldură (în kJ) consumată pentru încălzirea metalului lichid.') +
        qline('d', 'Calculați masa de ' + Cn(fu.f) + ' care trebuie arsă.') + qline('e', 'Calculați ce procent din căldura necesară metalului se consumă pentru topire.'),
      data: metalData(me).concat(mchips([fu.f])),
      method: 'Trei etape pentru metal: solid ($m·c·ΔT$), topire ($ν·λ$), lichid ($m·c_{lichid}·ΔT$). Apoi, ținând cont de pierderi, afli căldura care trebuie degajată și, din ecuația arderii, masa de combustibil.',
      check: function () { return near(Qd * eta * 1000, Qn) && near(nf * fu.qm, Qd); },
      parts: [
        { id: 'a', ask: 'Căldura de încălzire a solidului', a: Q1 / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: ['$ΔT = ' + me.tm + ' − ' + ti + ' = ' + d1 + ' K$.', '$Q_1 = m·c·ΔT = ' + m + ' · ' + N(me.c, 2) + ' · ' + d1 + ' = ' + N(Q1, 1) + ' J = <b>' + N(Q1 / 1000, 3) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Căldura de topire', a: Q2 / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: ['$ν = (' + m + ')//(' + me.M + ') = ' + N(nu, 4) + ' mol$.', '$Q_2 = ν·λ = ' + N(nu, 4) + ' · ' + N(me.lam * 1000, 0) + ' J = ' + N(Q2, 1) + ' J = <b>' + N(Q2 / 1000, 3) + ' kJ</b>$.'] },
        { id: 'c', ask: 'Căldura de încălzire a lichidului', a: Q3 / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: ['$ΔT = ' + tf + ' − ' + me.tm + ' = ' + d2 + ' K$.', '$Q_3 = ' + m + ' · ' + N(me.cl, 2) + ' · ' + d2 + ' = ' + N(Q3, 1) + ' J = <b>' + N(Q3 / 1000, 3) + ' kJ</b>$.'] },
        {
          id: 'd', ask: 'Masa de ' + C(fu.f), a: mf, unit: 'g', dec: 3, tol: 0.02, steps: [
            '$Q_{necesar} = ' + N(Q1 / 1000, 3) + ' + ' + N(Q2 / 1000, 3) + ' + ' + N(Q3 / 1000, 3) + ' = ' + N(Qn / 1000, 3) + ' kJ$.',
            'Se pierde ' + p + '% ⟹ $Q_{degajată} = (' + N(Qn / 1000, 3) + ')//(' + N(eta, 2) + ') = ' + N(Qd, 3) + ' kJ$.',
            'Pe ecuație: $' + N(fu.nu, 1) + ' mol$ ' + C(fu.f) + ' ↔ $' + N(fu.r.Q, 1) + ' kJ$ ⟹ $ν = ' + N(nf, 5) + ' mol$ ⟹ $m = ' + N(nf, 5) + ' · ' + N(fu.M, 1) + ' = <b>' + N(mf, 3) + ' g</b>$.']
        },
        { id: 'e', ask: 'Procentul consumat pentru topire', a: pm, unit: '%', dec: 1, tol: 0.02, steps: ['$p = (Q_2)//(Q_{necesar}) · 100 = (' + N(Q2 / 1000, 3) + ')//(' + N(Qn / 1000, 3) + ') · 100 = <b>' + N(pm, 1) + '%</b>$.'] }
      ]
    };
  }

  /* 5b. mărime cerută invers: ce masă de metal poate fi încălzită și topită */
  function sodiuInverse(R) {
    var me = R.pick(T.METALS), ti = R.pick([20, 25]), tf = me.tm + R.pick([20, 30, 50, 80]), fu = fuelOf(R.pick(FUEL_S)), p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100;
    var d1 = me.tm - ti, d2 = tf - me.tm, q = me.c * d1 + me.lam * 1000 / me.M + me.cl * d2, m0 = R.pick([20, 40, 50, 80, 100, 200]);
    var mfuel = T.round(m0 * q / 1000 / eta / fu.qm * fu.M, 1), Qd = mfuel / fu.M * fu.qm, Qu = eta * Qd, mm = Qu * 1000 / q;
    return {
      statement: '<p>Se ard <b>' + N(mfuel, 1) + ' g</b> de ' + Cn(fu.f) + ', conform ecuației termochimice:</p>' + eqBlock(fu.r) + '<p><b>' + p + '%</b> din căldura eliberată se pierde în mediu; restul încălzește o bucată de ' + me.n + ', de la temperatura de <b>' + ti + ' °C</b> până la temperatura de <b>' + tf + ' °C</b>, trecând prin topire.</p>' +
        qline('a', 'Calculați cantitatea de căldură (în kJ) eliberată prin ardere.') + qline('b', 'Calculați cantitatea de căldură (în kJ) folosită pentru încălzirea și topirea metalului.') + qline('c', 'Calculați cantitatea de căldură (în J) necesară pentru <b>1 g</b> de ' + me.n + ' (încălzire + topire + încălzirea lichidului).') + qline('d', 'Calculați masa de ' + me.n + ' care poate fi încălzită și topită.'),
      data: metalData(me).concat(mchips([fu.f])),
      method: 'Calculează întâi căldura pentru <b>1 g</b> de metal: $c·ΔT_1 + λ/M + c_{lichid}·ΔT_2$. Apoi masa de metal = căldura utilă / căldura pe gram.',
      check: function () { return near(mm * q / 1000, Qu); },
      parts: [
        { id: 'a', ask: 'Căldura degajată la ardere', a: Qd, unit: 'kJ', dec: 2, tol: 0.02, steps: ['$ν = (' + N(mfuel, 1) + ')//(' + N(fu.M, 1) + ') = ' + N(mfuel / fu.M, 4) + ' mol$.', 'Pe ecuație $' + N(fu.nu, 1) + ' mol ↔ ' + N(fu.r.Q, 1) + ' kJ$ ⟹ $Q = ' + N(mfuel / fu.M, 4) + ' · ' + N(fu.qm, 1) + ' = <b>' + N(Qd, 2) + ' kJ</b>$.'] },
        { id: 'b', ask: 'Căldura folosită pentru metal', a: Qu, unit: 'kJ', dec: 2, tol: 0.02, steps: ['La metal ajunge ' + (100 - p) + '%: $Q_u = ' + N(eta, 2) + ' · ' + N(Qd, 2) + ' = <b>' + N(Qu, 2) + ' kJ</b>$.'] },
        {
          id: 'c', ask: 'Căldura pentru 1 g de ' + me.n, a: q, unit: 'J/g', dec: 1, tol: 0.02, steps: [
            'Încălzire solid: $c·ΔT_1 = ' + N(me.c, 2) + ' · ' + d1 + ' = ' + N(me.c * d1, 2) + ' J/g$.',
            'Topire: $λ/M = ' + N(me.lam * 1000, 0) + ' / ' + me.M + ' = ' + N(me.lam * 1000 / me.M, 2) + ' J/g$.',
            'Încălzire lichid: $c_{lichid}·ΔT_2 = ' + N(me.cl, 2) + ' · ' + d2 + ' = ' + N(me.cl * d2, 2) + ' J/g$.',
            '$q = ' + N(me.c * d1, 2) + ' + ' + N(me.lam * 1000 / me.M, 2) + ' + ' + N(me.cl * d2, 2) + ' = <b>' + N(q, 1) + ' J/g</b>$.']
        },
        { id: 'd', ask: 'Masa de ' + me.n, a: mm, unit: 'g', dec: 2, tol: 0.02, steps: ['$m = (Q_u)//(q) = (' + N(Qu * 1000, 0) + ')//(' + N(q, 1) + ') = <b>' + N(mm, 2) + ' g</b>$.'] }
      ]
    };
  }

  /* 5c. două metale încălzite și topite împreună */
  function sodiuTwo(R) {
    var pair = R.shuffle(T.METALS.filter(function (x) { return x.tm < 500; })).slice(0, 2), A = pair[0], B = pair[1], ti = R.pick([20, 25]), tf = Math.max(A.tm, B.tm) + R.pick([20, 30, 50]);
    var mA = R.pick([10, 20, 25, 40, 50]), mB = R.pick([10, 20, 25, 40, 50]), fu = fuelOf(R.pick(FUEL_S)), p = R.pick([20, 25, 30, 40]), eta = (100 - p) / 100;
    function tot(me, m) { var d1 = me.tm - ti, d2 = tf - me.tm; return { Q1: m * me.c * d1, Q2: m / me.M * me.lam * 1000, Q3: m * me.cl * d2, d1: d1, d2: d2 }; }
    var a = tot(A, mA), b = tot(B, mB), QA = a.Q1 + a.Q2 + a.Q3, QB = b.Q1 + b.Q2 + b.Q3, Qn = QA + QB, Qd = Qn / 1000 / eta, nf = Qd / fu.qm, mf = nf * fu.M, pA = QA / Qn * 100;
    function lines(me, m, t, id) {
      return ['<b>' + me.n + '</b>: încălzire solid $' + m + ' · ' + N(me.c, 2) + ' · ' + t.d1 + ' = ' + N(t.Q1, 1) + ' J$; topire $ν·λ = (' + m + ')//(' + me.M + ') · ' + N(me.lam * 1000, 0) + ' = ' + N(t.Q2, 1) + ' J$; încălzire lichid $' + m + ' · ' + N(me.cl, 2) + ' · ' + t.d2 + ' = ' + N(t.Q3, 1) + ' J$.',
        '$Q_{' + id + '} = ' + N(t.Q1, 1) + ' + ' + N(t.Q2, 1) + ' + ' + N(t.Q3, 1) + ' = ' + N(t.Q1 + t.Q2 + t.Q3, 1) + ' J = <b>' + N((t.Q1 + t.Q2 + t.Q3) / 1000, 3) + ' kJ</b>$.'];
    }
    return {
      statement: '<p>Se încălzesc împreună <b>' + mA + ' g</b> de ' + A.n + ' și <b>' + mB + ' g</b> de ' + B.n + ', de la temperatura de <b>' + ti + ' °C</b> până la temperatura de <b>' + tf + ' °C</b>; ambele metale se topesc pe parcurs. Căldura provine din arderea ' + gen(fu.f) + ', conform ecuației termochimice:</p>' + eqBlock(fu.r) + '<p><b>' + p + '%</b> din căldura eliberată se pierde în mediu.</p>' +
        qline('a', 'Calculați cantitatea de căldură (în kJ) necesară pentru ' + A.n + '.') + qline('b', 'Calculați cantitatea de căldură (în kJ) necesară pentru ' + B.n + '.') + qline('c', 'Calculați ce procent din căldura totală necesară metalelor revine ' + T.GEN[A.n] + '.') + qline('d', 'Calculați masa de ' + Cn(fu.f) + ' care trebuie arsă.'),
      data: ['<b>' + A.n + '</b>:'].concat(metalData(A), ['<b>' + B.n + '</b>:'], metalData(B), mchips([fu.f])),
      method: 'Pentru fiecare metal: încălzire solid + topire + încălzire lichid (fiecare etapă are formula ei). Apoi procentul, iar căldura degajată se află ținând cont de pierderi.',
      check: function () { return near(QA + QB, Qn) && near(nf * fu.qm, Qd); },
      parts: [
        { id: 'a', ask: 'Căldura pentru ' + A.n, a: QA / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: lines(A, mA, a, 'A') },
        { id: 'b', ask: 'Căldura pentru ' + B.n, a: QB / 1000, unit: 'kJ', dec: 3, tol: 0.02, steps: lines(B, mB, b, 'B') },
        { id: 'c', ask: 'Procentul revenit lui ' + A.n, a: pA, unit: '%', dec: 1, tol: 0.02, steps: ['$Q_{total} = ' + N(QA / 1000, 3) + ' + ' + N(QB / 1000, 3) + ' = ' + N(Qn / 1000, 3) + ' kJ$.', '$p = (' + N(QA / 1000, 3) + ')//(' + N(Qn / 1000, 3) + ') · 100 = <b>' + N(pA, 1) + '%</b>$.'] },
        { id: 'd', ask: 'Masa de ' + C(fu.f), a: mf, unit: 'g', dec: 3, tol: 0.02, steps: ['Se pierde ' + p + '% ⟹ $Q_{degajată} = (' + N(Qn / 1000, 3) + ')//(' + N(eta, 2) + ') = ' + N(Qd, 3) + ' kJ$.', 'Pe ecuație: $' + N(fu.nu, 1) + ' mol$ ' + C(fu.f) + ' ↔ $' + N(fu.r.Q, 1) + ' kJ$ ⟹ $ν = ' + N(nf, 5) + ' mol$ ⟹ $m = ν · M = ' + N(nf, 5) + ' · ' + N(fu.M, 1) + ' = <b>' + N(mf, 3) + ' g</b>$.'] }
      ]
    };
  }

  reg('sodiu', [sodiuFuel, sodiuInverse, sodiuTwo]);
})(typeof window !== 'undefined' ? window : globalThis);
