/* =========================================================
   widgets-react.js — reacții exoterme/endoterme, ecuația termochimică,
   energia legăturilor, schimbări de stare
   + biblioteca de reacții (T.RXN), folosită și la probleme
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  /* ---------- biblioteca de reacții ----------
     L, R: [[coeficient, formulă cu stare]]; Q = căldura (kJ) pe ecuație, valoare pozitivă; type: 'exo' | 'endo' */
  T.RXN = {
    termita: { name: 'Reacția din exercițiul 4/14', type: 'exo', Q: 852, L: [[2, 'Al(s)'], [1, 'Fe2O3(s)']], R: [[2, 'Fe(s)'], [1, 'Al2O3(s)']] },
    carbon: { name: 'Arderea carbonului', type: 'exo', Q: 393.5, L: [[1, 'C(s)'], [1, 'O2(g)']], R: [[1, 'CO2(g)']] },
    metan: { name: 'Arderea metanului', type: 'exo', Q: 802.3, L: [[1, 'CH4(g)'], [2, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(g)']] },
    hidrogen: { name: 'Arderea hidrogenului', type: 'exo', Q: 571.6, L: [[2, 'H2(g)'], [1, 'O2(g)']], R: [[2, 'H2O(l)']] },
    neutr: { name: 'Neutralizarea (NaOH + H2SO4)', type: 'exo', Q: 114.6, L: [[2, 'NaOH(aq)'], [1, 'H2SO4(aq)']], R: [[1, 'Na2SO4(aq)'], [2, 'H2O(l)']] },
    glucoza: { name: 'Glucoză → acid piruvic', type: 'exo', Q: 483, L: [[1, 'C6H12O6'], [1, 'O2']], R: [[2, 'CH3-CO-COOH'], [2, 'H2O']] },
    amoniac: { name: 'Sinteza amoniacului', type: 'exo', Q: 92.2, L: [[1, 'N2(g)'], [3, 'H2(g)']], R: [[2, 'NH3(g)']] },
    magneziu: { name: 'Arderea magneziului', type: 'exo', Q: 1203.6, L: [[2, 'Mg(s)'], [1, 'O2(g)']], R: [[2, 'MgO(s)']] },
    sulf: { name: 'Arderea sulfului', type: 'exo', Q: 296.8, L: [[1, 'S(s)'], [1, 'O2(g)']], R: [[1, 'SO2(g)']] },
    metanol: { name: 'Arderea metanolului', type: 'exo', Q: 726.5, L: [[1, 'CH3OH(l)'], [1.5, 'O2(g)']], R: [[1, 'CO2(g)'], [2, 'H2O(l)']] },
    etan: { name: 'Descompunerea etanului (Tema 5)', type: 'endo', Q: 137, L: [[1, 'C2H6(g)']], R: [[1, 'C2H4(g)'], [1, 'H2(g)']] },
    calcar: { name: 'Descompunerea carbonatului de calciu', type: 'endo', Q: 178.3, L: [[1, 'CaCO3(s)']], R: [[1, 'CaO(s)'], [1, 'CO2(g)']] },
    azot: { name: 'Formarea oxidului de azot', type: 'endo', Q: 180.6, L: [[1, 'N2(g)'], [1, 'O2(g)']], R: [[2, 'NO(g)']] },
    gazapa: { name: 'Cărbune + vapori de apă', type: 'endo', Q: 131.3, L: [[1, 'C(s)'], [1, 'H2O(g)']], R: [[1, 'CO(g)'], [1, 'H2(g)']] },
    klorat: { name: 'Descompunerea clorat de potasiu', type: 'endo', Q: null, L: [[2, 'KClO3(s)']], R: [[2, 'KCl(s)'], [3, 'O2(g)']] }
  };

  function coefS(c) {
    if (c === 1) return '';
    if (Math.abs(c - Math.round(c)) < 1e-9) return String(Math.round(c));
    if (Math.abs(c * 2 - Math.round(c * 2)) < 1e-9) return Math.round(c * 2) + '/2 ';
    return T.fmt(c, 2);
  }
  function side(arr) { return arr.map(function (p) { return coefS(p[0]) + p[1]; }).join(' + '); }
  /** ecuația termochimică în notația [[…]] */
  T.eqStr = function (r, o) {
    o = o || {};
    var Q = o.Q === undefined ? r.Q : o.Q;
    var qs = Q == null ? 'Q' : T.fmt(Q, 2) + ' kJ';
    if (o.noQ) return '[[' + side(r.L) + ' -> ' + side(r.R) + ']]';
    return '[[' + (r.type === 'exo' ? side(r.L) + ' -> ' + side(r.R) + ' + ' + qs : side(r.L) + ' + ' + qs + ' -> ' + side(r.R)) + ']]';
  };
  T.isGas = function (f) { return /\(g\)$/.test(f); };
  T.massOf = function (f) {
    var map = { 'CH3-CO-COOH': 88 };
    return map[f.replace(/\((s|l|g|aq)\)$/, '')] || T.molarMass(f);
  };

  /* ---------------------------------------------------------
     Laboratorul exo / endo
     --------------------------------------------------------- */
  var LAB = ['neutr', 'klorat', 'metan', 'carbon', 'termita', 'glucoza', 'etan'];
  var SYMQ = { neutr: 1, klorat: 1, metan: 1 };   // în caiet, Q este scris simbolic

  T.widget('exoEndoLab', function (el) {
    var body = T.shell(el, {
      title: 'Exotermă sau endotermă? Alege o reacție',
      help: 'Vezi unde se scrie $Q$ în ecuația termochimică, ce semn au $Q$ și $ΔH$ și cum arată diagrama de entalpie.'
    });
    var cur = 'neutr', id = T.uid('ee');
    var eqBox = T.h('div', { class: 'eqn' }), facts = T.h('div', { class: 'tbl-wrap' }), pic = T.h('div', { class: 'wd-svg' });
    var two = T.h('div', { class: 'wd-two' }, T.h('div', null, eqBox, facts), pic);
    var seg = T.seg(LAB.map(function (k) { return { v: k, label: T.RXN[k].name.replace(' (NaOH + H2SO4)', ''), cls: T.RXN[k].type }; }), cur, function (v) { cur = v; draw(); }, 'Reacția');

    function draw() {
      var r = T.RXN[cur], exo = r.type === 'exo';
      eqBox.className = 'eqn ' + r.type;
      eqBox.innerHTML = T.rich(T.eqStr(r, SYMQ[cur] ? { Q: null } : {}));
            var rows = [
        ['Tipul reacției', exo ? '<b class="tag-exo">exotermă</b>' : '<b class="tag-endo">endotermă</b>'],
        ['Căldura în ecuație', exo ? 'se <b>degajă</b> ($Q$ apare în dreapta, la produși)' : 'se <b>absoarbe</b> ($Q$ apare în stânga, la reactanți)'],
        ['$Q$ pentru sistem', exo ? '$Q < 0$ (sistemul cedează)' : '$Q > 0$ (sistemul primește)'],
        ['$ΔH$', exo ? '$ΔH < 0$' : '$ΔH > 0$'],
        ['Entalpii', exo ? '$H_P < H_R$' : '$H_P > H_R$'],
        ['Mediul exterior', exo ? 'primește căldura degajată' : 'cedează căldura absorbită de reacție']
      ];
      facts.innerHTML = T.rich('<table class="tbl"><tbody>' + rows.map(function (x) { return '<tr><th style="width:38%">' + x[0] + '</th><td>' + x[1] + '</td></tr>'; }).join('') + '</tbody></table>');
      pic.innerHTML = T.svgs.energy(exo ? { HR: 62, HP: 24, HCA: 86, id: id } : { HR: 24, HP: 62, HCA: 90, id: id });
    }
    body.append(seg, two);
    draw();
    body.append(T.h('p', { class: 'muted', html: 'Notă: în ecuația termochimică, $Q$ scris lângă săgeată este o <b>cantitate</b> de căldură (valoare pozitivă, în kJ). Semnul „−” sau „+” apare la $ΔH$ și la $Q$ față de sistem.' }));
  });

  /* ---------------------------------------------------------
     Joc: exo sau endo?
     --------------------------------------------------------- */
  var SORT = [
    ['topirea', 'endo', 'Topirea face parte din procesele care necesită <b>absorbție de căldură</b> (endoterme).'],
    ['solidificarea', 'exo', 'Solidificarea <b>degajă</b> căldură (exotermă); este procesul invers topirii.'],
    ['vaporizarea', 'endo', 'Vaporizarea <b>necesită absorbție de căldură</b> (endotermă).'],
    ['condensarea', 'exo', 'Condensarea <b>degajă</b> căldură (exotermă); este procesul invers vaporizării.'],
    ['sublimarea', 'endo', 'Sublimarea <b>necesită absorbție de căldură</b> (endotermă).'],
    ['desublimarea', 'exo', 'Desublimarea <b>degajă</b> căldură (exotermă); este procesul invers sublimării.'],
    ['arderea metanului', 'exo', 'În ecuația din caiet, $Q$ apare în dreapta, la produși: $CH_4 + 2O_2 → CO_2 + 2H_2O + Q$ ⟹ <b>exotermă</b>.'],
    ['neutralizarea NaOH + H₂SO₄', 'exo', 'La amestecarea soluțiilor $T_f > T_i$ ⟹ <b>exotermă</b> (exemplul din caiet).'],
    ['descompunerea cloratului de potasiu (ca în caiet)', 'endo', 'În caiet este exemplul de reacție <b>endotermă</b>: $2KClO_3 + Q → 2KCl + 3O_2$.'],
    ['descompunerea etanului în etenă și hidrogen (Tema 5)', 'endo', 'În ecuație se absorb 137 kJ pentru fiecare mol de etan ⟹ <b>endotermă</b>.'],
    ['glucoză → acid piruvic (Tema 6)', 'exo', 'În ecuație se degajă 483 kJ ⟹ <b>exotermă</b>.'],
    ['reacția din exercițiul 4/14', 'exo', 'În ecuație se degajă 852 kJ ⟹ <b>exotermă</b>.'],
    ['ruperea legăturilor chimice', 'endo', 'Ruperea unei legături = <b>absorbție</b> de energie.'],
    ['formarea legăturilor chimice', 'exo', 'Formarea unei legături = <b>degajare</b> de energie.']
  ];
  T.widget('sortExoEndo', function (el) {
    var body = T.shell(el, { title: 'Sortează procesele: exoterme sau endoterme?', help: 'Pentru fiecare proces alege tipul, apoi apasă „Verifică”.' });
    var items = T.rng((Math.random() * 1e9) | 0).shuffle(SORT).slice(0, 10), ans = items.map(function () { return null; });
    var list = T.h('div', { class: 'cls-list' }), res = T.h('div', { class: 'wd-out', hidden: true });
    var rows = items.map(function (it, i) {
      var why = T.h('div', { class: 'cls-why', hidden: true, html: it[2] });
      var sg = T.seg([{ v: 'exo', label: 'Exotermă', cls: 'exo' }, { v: 'endo', label: 'Endotermă', cls: 'endo' }], null, function (v) { ans[i] = v; row.classList.remove('ok', 'bad'); why.hidden = true; res.hidden = true; });
      var row = T.h('div', { class: 'cls-row' }, T.h('span', { class: 'cls-t', text: it[0] }), sg, why);
      list.append(row); return { row: row, why: why };
    });
    function check() {
      var good = 0, empty = 0;
      rows.forEach(function (r, i) {
        if (ans[i] == null) { empty++; return; }
        var ok = ans[i] === items[i][1]; if (ok) good++;
        r.row.classList.toggle('ok', ok); r.row.classList.toggle('bad', !ok); r.why.hidden = false;
      });
      res.hidden = false; res.className = 'wd-out ' + (good === items.length ? 'ok' : 'bad');
      res.innerHTML = T.rich('<b>' + good + ' din ' + items.length + ' corecte.</b>' + (empty ? ' Ai ' + empty + ' fără răspuns.' : good === items.length ? ' Excelent!' : ' Citește explicațiile.'));
    }
    body.append(list, T.h('div', { class: 'wd-row' }, T.btn('Verifică', check, 'primary'), T.btn('Alte procese', function () { el.replaceChildren(); el.removeAttribute('data-mounted'); T.mountWidgets(el.parentNode); }, 'ghost')), res);
  });

  /* ---------------------------------------------------------
     Calcule pe ecuația termochimică
     --------------------------------------------------------- */
  var CALC = ['termita', 'carbon', 'metan', 'glucoza', 'etan'];

  T.widget('thermoEq', function (el) {
    var body = T.shell(el, {
      title: 'Calcule pe ecuația termochimică (regula de trei)',
      help: 'Coeficienții arată câți moli reacționează; căldura din ecuație corespunde exact acelor cantități. Pentru altă cantitate, scrii proporția.'
    });
    var S = { r: 'termita', sp: 0, mode: 'Q', unit: 'g', val: '67,97', hu: 'kJ', hv: '1072,5' };
    var host = T.h('div'), out = T.h('div', { class: 'wd-out' });

    function species(r) { return r.L.concat(r.R).map(function (p, i) { return { c: p[0], f: p[1], i: i }; }); }
    function build() {
      var r = T.RXN[S.r], sps = species(r), sp = sps[S.sp] || sps[0];
      host.replaceChildren();
      var rSel = T.h('select', { class: 'inp', 'aria-label': 'Reacția' }, CALC.map(function (k) { return T.h('option', { value: k, text: T.uni(T.RXN[k].name) + (T.RXN[k].type === 'exo' ? ' (exo)' : ' (endo)'), selected: k === S.r ? true : null }); }));
      rSel.addEventListener('change', function () { S.r = rSel.value; S.sp = 0; S.unit = 'mol'; S.val = '1'; build(); });
      var eq = T.h('div', { class: 'eqn ' + r.type, html: T.eqStr(r) });
      // tabel cu ν și M
      var rows = sps.map(function (p) {
        var M = T.massOf(p.f);
        return '<tr><td>[[' + p.f + ']]</td><td class="c">' + T.fmt(p.c, 2) + '</td><td class="c">' + T.fmt(M, 1) + '</td><td class="c">' + T.fmt(p.c * M, 1) + '</td><td class="c">' + (T.isGas(p.f) ? T.fmt(p.c * 22.4, 1) : '—') + '</td></tr>';
      }).join('');
      var tbl = T.h('div', { class: 'tbl-wrap', html: '<table class="tbl"><thead><tr><th>Substanța</th><th class="c">ν (mol)</th><th class="c">M (g/mol)</th><th class="c">masa pentru ν (g)</th><th class="c">V la c.n. (L)</th></tr></thead><tbody>' + rows + '</tbody></table>' });
      var spSel = T.h('select', { class: 'inp', 'aria-label': 'Substanța' }, sps.map(function (p, i) { return T.h('option', { value: i, text: T.uni(p.f.replace(/\([a-z]+\)$/, '')), selected: i === S.sp ? true : null }); }));
      spSel.addEventListener('change', function () { S.sp = +spSel.value; var q = species(T.RXN[S.r])[S.sp]; if (S.unit === 'L' && !T.isGas(q.f)) S.unit = 'g'; build(); });
      var modeSeg = T.seg([{ v: 'Q', label: 'Știu cantitatea → caut căldura' }, { v: 'A', label: 'Știu căldura → caut cantitatea' }], S.mode, function (v) { S.mode = v; build(); }, 'Ce cunoști');
      var units = ['mol', 'g'].concat(T.isGas(sp.f) ? ['L (c.n.)'] : []);
      var u1 = T.h('select', { class: 'inp sm', 'aria-label': 'Unitatea cantității' }, units.map(function (u) { return T.h('option', { value: u, text: u, selected: u === S.unit || (u === 'L (c.n.)' && S.unit === 'L') ? true : null }); }));
      var a1 = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: S.val, 'aria-label': 'Cantitatea' });
      var h1 = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: S.hv, 'aria-label': 'Căldura' });
      var hu = T.h('select', { class: 'inp sm', 'aria-label': 'Unitatea căldurii' }, ['kJ', 'J', 'kcal'].map(function (u) { return T.h('option', { value: u, text: u, selected: u === S.hu ? true : null }); }));
      u1.addEventListener('change', function () { S.unit = u1.value === 'L (c.n.)' ? 'L' : u1.value; calc(); });
      hu.addEventListener('change', function () { S.hu = hu.value; calc(); });
      a1.addEventListener('input', function () { S.val = a1.value; calc(); });
      h1.addEventListener('input', function () { S.hv = h1.value; calc(); });
      var inRow = S.mode === 'Q'
        ? T.h('div', { class: 'wd-row' }, T.h('label', { text: 'Cantitatea de ' }), spSel, T.h('label', { text: '=' }), a1, u1)
        : T.h('div', { class: 'wd-row' }, T.h('label', { text: 'Căldura ' + (r.type === 'exo' ? 'degajată' : 'absorbită') + ' =' }), h1, hu, T.h('label', { text: '· caut cantitatea de' }), spSel, T.h('label', { text: 'în' }), u1);
      host.append(T.h('div', { class: 'wd-row' }, rSel), eq, tbl, T.h('div', { class: 'wd-ctrl' }, T.h('div', { class: 'wd-row' }, modeSeg), inRow));
      calc();
    }

    function calc() {
      var r = T.RXN[S.r], sps = species(r), sp = sps[S.sp] || sps[0], M = T.massOf(sp.f), Qeq = r.Q, verb = r.type === 'exo' ? 'degajată' : 'absorbită';
      var unitName = S.unit === 'L' ? 'L' : S.unit;
      var toMol = function (v) { return S.unit === 'mol' ? v : S.unit === 'g' ? v / M : v / 22.4; };
      var fromMol = function (n) { return S.unit === 'mol' ? n : S.unit === 'g' ? n * M : n * 22.4; };
      var eqAmt = S.unit === 'mol' ? sp.c : S.unit === 'g' ? sp.c * M : sp.c * 22.4;
      var amtEq = T.fmt(eqAmt, 2) + ' ' + unitName;
      var html;
      if (S.mode === 'Q') {
        var v = T.parseNum(S.val)[0];
        if (v == null) { out.className = 'wd-out'; out.textContent = 'Scrie cantitatea ca număr.'; return; }
        var n = toMol(v), Q = n / sp.c * Qeq;
        html = '<div><b>Pe ecuație:</b> $' + amtEq + '$ de [[' + sp.f.replace(/\([a-z]+\)$/, '') + ']] &nbsp;↔&nbsp; $' + T.fmt(Qeq, 2) + ' kJ$</div>' +
          '<div><b>Pe date:</b> $' + T.fmt(v, 4) + ' ' + unitName + '$ &nbsp;↔&nbsp; $x$</div>' +
          '<div style="margin-top:6px">$x = (' + T.fmt(v, 4) + ' · ' + T.fmt(Qeq, 2) + ')//(' + T.fmt(eqAmt, 2) + ') = ' + T.fmt(Q, 3) + ' kJ$</div>' +
          '<div style="margin-top:6px">Căldura ' + verb + ': <b class="big">' + T.fmt(Q, 3) + ' kJ</b> = ' + T.fmt(Q * 1000, 1) + ' J = ' + T.fmt(Q / 4.186, 3) + ' kcal (cu 4,186 J/cal)</div>';
      } else {
        var h = T.parseNum(S.hv)[0];
        if (h == null) { out.className = 'wd-out'; out.textContent = 'Scrie căldura ca număr.'; return; }
        var kj = S.hu === 'kJ' ? h : S.hu === 'J' ? h / 1000 : h * 4.186;
        var nn = kj / Qeq * sp.c, A = fromMol(nn);
        html = '<div><b>Pe ecuație:</b> $' + amtEq + '$ de [[' + sp.f.replace(/\([a-z]+\)$/, '') + ']] &nbsp;↔&nbsp; $' + T.fmt(Qeq, 2) + ' kJ$</div>' +
          '<div><b>Pe date:</b> $x$ &nbsp;↔&nbsp; $' + T.fmt(kj, 4) + ' kJ$' + (S.hu !== 'kJ' ? ' (convertit din ' + T.fmt(h, 4) + ' ' + S.hu + ')' : '') + '</div>' +
          '<div style="margin-top:6px">$x = (' + T.fmt(eqAmt, 2) + ' · ' + T.fmt(kj, 4) + ')//(' + T.fmt(Qeq, 2) + ') = ' + T.fmt(A, 3) + ' ' + unitName + '$</div>' +
          '<div style="margin-top:6px">Cantitatea de [[' + sp.f.replace(/\([a-z]+\)$/, '') + ']]: <b class="big">' + T.fmt(A, 3) + ' ' + unitName + '</b> (adică ' + T.fmt(nn, 4) + ' mol)</div>';
      }
      out.className = 'wd-out ' + r.type;
      out.innerHTML = T.rich(html);
    }
    body.append(host, out);
    build();
  });

  /* ---------------------------------------------------------
     Schimbări de stare + condiții standard
     --------------------------------------------------------- */
  var CH = {
    topire: { n: 'Topire', t: 'endo', f: 'solid → lichid' },
    solidificare: { n: 'Solidificare', t: 'exo', f: 'lichid → solid' },
    vaporizare: { n: 'Vaporizare', t: 'endo', f: 'lichid → gaz' },
    condensare: { n: 'Condensare', t: 'exo', f: 'gaz → lichid' },
    sublimare: { n: 'Sublimare', t: 'endo', f: 'solid → gaz' },
    desublimare: { n: 'Desublimare', t: 'exo', f: 'gaz → solid' }
  };
  T.widget('stateWheel', function (el) {
    var body = T.shell(el, {
      title: 'Schimbările de stare de agregare și căldura lor',
      help: 'Apasă pe o săgeată sau pe numele unui proces. Albastru = endoterm (absoarbe căldură), roșu = exoterm (degajă căldură).'
    });
    var id = T.uid('sw'), cur = 'topire';
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    function A(k, d, lx, ly) {
      var c = CH[k], on = k === cur;
      return '<g class="sw-a ' + c.t + (on ? ' on' : '') + '" data-k="' + k + '" tabindex="0" role="button" aria-label="' + c.n + '"><path d="' + d + '" fill="none" marker-end="url(#' + id + '-' + c.t + ')"/><path d="' + d + '" class="hit"/><text x="' + lx + '" y="' + ly + '" text-anchor="middle">' + c.n.toLowerCase() + '</text></g>';
    }
    function drawAll() {
      var s = '<svg viewBox="0 0 560 320" role="img" aria-label="Schimbările de stare de agregare">' + T.svgs.defs(id);
      [['SOLID', 90], ['LICHID', 280], ['GAZ', 470]].forEach(function (p) {
        s += '<circle class="sw-n" cx="' + p[1] + '" cy="160" r="46"/><text class="sw-nt" x="' + p[1] + '" y="165" text-anchor="middle">' + p[0] + '</text>';
      });
      s += A('topire', 'M140 138 L230 138', 185, 126) + A('solidificare', 'M230 184 L140 184', 185, 208);
      s += A('vaporizare', 'M330 138 L420 138', 375, 126) + A('condensare', 'M420 184 L330 184', 375, 208);
      s += A('sublimare', 'M96 112 Q280 -20 464 112', 280, 78) + A('desublimare', 'M464 208 Q280 340 96 208', 280, 290);
      holder.innerHTML = s + '</svg>';
      var c = CH[cur];
      out.className = 'wd-out ' + c.t;
      out.innerHTML = T.rich('<b class="tag-' + c.t + '">' + c.n + '</b> (' + c.f + '): ' + (c.t === 'endo' ? 'procesul <b>absoarbe</b> căldură ⟹ <b>endoterm</b>, $Q > 0$.' : 'procesul <b>degajă</b> căldură ⟹ <b>exoterm</b>, $Q < 0$.') + '<br>Procesul invers: <b>' + CH[inv(cur)].n.toLowerCase() + '</b> (aceeași căldură, ca valoare).');
    }
    function inv(k) { return { topire: 'solidificare', solidificare: 'topire', vaporizare: 'condensare', condensare: 'vaporizare', sublimare: 'desublimare', desublimare: 'sublimare' }[k]; }
    holder.addEventListener('click', function (e) { var g2 = e.target.closest('[data-k]'); if (g2) { cur = g2.dataset.k; drawAll(); } });
    holder.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var g2 = e.target.closest('[data-k]'); if (g2) { e.preventDefault(); cur = g2.dataset.k; drawAll(); } } });
    // condiții standard + convertor
    var cK = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: '298', 'aria-label': 'Kelvin' });
    var cC = T.h('input', { class: 'inp sm', type: 'text', inputmode: 'decimal', value: '25', 'aria-label': 'Grade Celsius' });
    cK.addEventListener('input', function () { var v = T.parseNum(cK.value)[0]; if (v != null) cC.value = T.fmt(v - 273, 2); });
    cC.addEventListener('input', function () { var v = T.parseNum(cC.value)[0]; if (v != null) cK.value = T.fmt(v + 273, 2); });
    var std = T.h('div', { class: 'callout imp', html: '<div class="ct"><span class="ct-i">✓</span>Marcat în caiet · condiții standard</div><div class="cb">$T = 298 K = 25 °C$ &nbsp;·&nbsp; $p = 1 atm$<div class="wd-row" style="margin-top:8px"><label>$T$ în K:</label>' + '<span class="k"></span><label>= $t$ în °C:</label><span class="c"></span><span class="muted">$T(K) = t(°C) + 273$</span></div></div>' });
    body.append(holder, out, std);
    T.$('.k', std).replaceWith(cK); T.$('.c', std).replaceWith(cC);
    drawAll();
  });
})(window);
