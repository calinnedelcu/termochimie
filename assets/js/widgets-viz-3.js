/* =========================================================
   widgets-viz-3.js — scene ilustrate pentru lecțiile 5–8
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;
  var oldFirstLaw = T.widgets.firstLaw;

  /* ---------------------------------------------------------
     Lecția 5 — primul principiu: Q se împarte în ΔU și L
     --------------------------------------------------------- */
  T.widget('firstLaw', function (el, o) {
    if (o && o.mode === 'compare') return oldFirstLaw(el, o);
    var body = T.shell(el, {
      title: 'Primul principiu: Q = ΔU + L',
      help: 'Căldura primită de sistem ($Q$) se împarte în două: o parte crește <b>energia internă</b> ($ΔU$), cealaltă este <b>lucrul mecanic efectuat</b> ($L$). Mută cursoarele și urmărește cum se împarte.'
    });
    var p = V.uid('fl'), W = 520, H = 330, Q = 60, pct = 35;
    var cy = V.cylinder({ p: p, x: 44, y: 84, w: 112, h: 146, id: p + 'cy', n: 14 });
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });
    function ribbon(x0, y0, x1, y1, w) {
      var xm = (x0 + x1) / 2;
      return 'M' + x0 + ' ' + V.f(y0) + ' C' + xm + ' ' + V.f(y0) + ' ' + xm + ' ' + V.f(y1) + ' ' + x1 + ' ' + V.f(y1) + ' L' + x1 + ' ' + V.f(y1 + w) + ' C' + xm + ' ' + V.f(y1 + w) + ' ' + xm + ' ' + V.f(y0 + w) + ' ' + x0 + ' ' + V.f(y0 + w) + ' Z';
    }
    function scene() {
      var s = V.defs(p) + V.panel(p, W, H);
      s += V.table(26, 262, 150, 14);
      s += '<rect x="76" y="246" width="50" height="16" rx="6" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.8"/>';
      s += cy.svg;
      s += V.flame({ p: p, x: 101, y: 246, s: .5, on: true, id: p + '-fl' });
      s += '<g id="' + p + '-sk"></g><g id="' + p + '-lab"></g>';
      return V.frame([W, H], s, 'Un gaz în cilindru primește căldură de la o flacără: o parte încălzește gazul, o parte ridică pistonul');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function render() {
      var L = Q * pct / 100, U = Q - L, k = .62;
      var wQ = Math.max(2, Q * k), wL = Math.max(0, L * k), wU = Math.max(0, U * k);
      var yc = 170, y0 = yc - wQ / 2;
      var yLo = 92 - wL / 2, yUo = 244 - wU / 2;
      var s = '<path d="M196 ' + V.f(y0) + ' L224 ' + V.f(y0) + ' L224 ' + V.f(y0 + wQ) + ' L196 ' + V.f(y0 + wQ) + 'Z" fill="url(#' + p + '-gold)" stroke="#b07d00" stroke-width="1.6"/>';
      if (wL > .5) s += '<path d="' + ribbon(224, y0, 330, yLo, wL) + '" style="fill:' + V.mix('var(--endo)', 82, 'transparent') + '" stroke="var(--endo)" stroke-width="1.4"/>';
      if (wU > .5) s += '<path d="' + ribbon(224, y0 + wL, 330, yUo, wU) + '" style="fill:' + V.mix('var(--exo)', 82, 'transparent') + '" stroke="var(--exo)" stroke-width="1.4"/>';
      if (wL > 4) s += V.token({ p: p, path: 'M224 ' + V.f(y0 + wL / 2) + ' C277 ' + V.f(y0 + wL / 2) + ' 277 ' + V.f(yLo + wL / 2) + ' 330 ' + V.f(yLo + wL / 2), dur: 2.4, r: Math.min(10, wL / 2 + 2) });
      if (wU > 4) s += V.token({ p: p, path: 'M224 ' + V.f(y0 + wL + wU / 2) + ' C277 ' + V.f(y0 + wL + wU / 2) + ' 277 ' + V.f(yUo + wU / 2) + ' 330 ' + V.f(yUo + wU / 2), dur: 2.4, begin: -1.2, r: Math.min(10, wU / 2 + 2) });
      svg.querySelector('#' + p + '-sk').innerHTML = s;
      svg.querySelector('#' + p + '-lab').innerHTML =
        V.pill(210, y0 - 16 < 30 ? 30 : y0 - 16, 'Q = ' + T.fmt(Q, 0) + ' kJ', { tone: 'gold', w: 112, lower: true }) +
        '<text class="t-l t-b t-endo" x="344" y="86">L = ' + T.fmt(L, 0) + ' kJ</text><text class="t-s t-m" x="344" y="106">lucrul mecanic</text><text class="t-s t-m" x="344" y="122">efectuat</text>' +
        '<text class="t-l t-b t-exo" x="344" y="238">ΔU = ' + T.fmt(U, 0) + ' kJ</text><text class="t-s t-m" x="344" y="258">variația energiei</text><text class="t-s t-m" x="344" y="274">interne</text>';
      cy.set(svg, L / 100, U / 100);
      var fl = svg.querySelector('#' + p + '-fl'); fl.setAttribute('transform', 'translate(101 246) scale(' + V.f(.2 + .5 * Q / 100) + ')'); fl.style.opacity = Q > 0 ? 1 : 0;
      out.className = 'wd-out';
      out.innerHTML = T.rich('<b>$Q = ΔU + L$</b> &nbsp;⟹&nbsp; <b>' + T.fmt(Q, 0) + ' = ' + T.fmt(U, 0) + ' + ' + T.fmt(L, 0) + '</b> kJ.<br>' +
        (L === 0 ? 'Toată căldura crește energia internă (nu se efectuează lucru mecanic).' : U === 0 ? 'Toată căldura primită se transformă în lucru mecanic.' : 'Căldura primită se <b>împarte</b>: o parte crește energia internă, cealaltă este lucrul mecanic efectuat.'));
    }
    var s1 = T.slider({ label: '$Q$ — căldura primită', min: 0, max: 100, step: 5, value: Q, unit: 'kJ', dec: 0, onInput: function (v) { Q = v; render(); } });
    var s2 = T.slider({ label: 'Cât din $Q$ devine lucru mecanic $L$', min: 0, max: 100, step: 5, value: pct, unit: '%', dec: 0, onInput: function (v) { pct = v; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, s1, s2), holder, out);
    render();
  });

  /* ---------------------------------------------------------
     Lecția 6 — laboratorul exo / endo
     --------------------------------------------------------- */
  var LAB = ['neutr', 'klorat', 'metan', 'carbon', 'termita', 'glucoza', 'etan'];
  var SYMQ = { neutr: 1, klorat: 1, metan: 1 };

  function eqHtml(r, sym) {
    var base = T.eqStr(r, { noQ: true }).replace(/^\[\[|\]\]$/g, '').split(' -> ');
    var q = (sym || r.Q == null) ? 'Q' : T.fmt(r.Q, 1) + ' kJ';
    var chip = '<span class="qchip">' + q + '</span>', Lh = T.rich('[[' + base[0] + ']]'), Rh = T.rich('[[' + base[1] + ']]');
    return r.type === 'exo' ? Lh + ' <span class="eq-ar">→</span> ' + Rh + ' <span class="eq-pl">+</span> ' + chip
      : Lh + ' <span class="eq-pl">+</span> ' + chip + ' <span class="eq-ar">→</span> ' + Rh;
  }

  T.widget('exoEndoLab', function (el) {
    var body = T.shell(el, {
      title: 'Exotermă sau endotermă? Alege o reacție',
      help: 'Vezi unde se scrie $Q$ în ecuația termochimică (evidențiat cu auriu), ce se întâmplă cu căldura, ce semn au $Q$ și $ΔH$ și cum arată diagrama de entalpie.'
    });
    var cur = 'neutr', id = T.uid('ee'), p = V.uid('lb');
    var eqBox = T.h('div', { class: 'eqn' }), facts = T.h('div', { class: 'tbl-wrap' }), pic = T.h('div', { class: 'wd-svg' }), sc = T.h('div');
    var two = T.h('div', { class: 'wd-two lab2' }, sc, pic);
    var seg = T.seg(LAB.map(function (k) { return { v: k, label: T.RXN[k].name.replace(' (NaOH + H2SO4)', ''), cls: T.RXN[k].type }; }), cur, function (v) { cur = v; draw(); }, 'Reacția');

    function scene(exo) {
      var A = exo ? [[78, 150, 18, 150], [222, 150, 282, 150], [150, 74, 150, 22]] : [[18, 150, 78, 150], [282, 150, 222, 150], [150, 22, 150, 72]];
      var bk = V.beaker({ p: p, x: 86, y: 84, w: 128, h: 124, level: .6, tone: exo ? 'exo' : 'endo', bubbles: exo, id: p + 'bk', seed: 8 });
      var s = V.defs(p) + V.panel(p, 300, 300);
      s += '<ellipse cx="150" cy="150" rx="150" ry="120" fill="url(#' + p + (exo ? '-gx' : '-gn') + ')"/>';
      s += V.pill(80, 24, 'MEDIU', { tone: 'soft', w: 74, cw: 8.4 });
      s += V.table(40, 238, 220, 12);
      if (!exo) s += '<rect x="112" y="224" width="76" height="14" rx="6" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.8"/>' + V.flame({ p: p, x: 150, y: 224, s: .5, on: true });
      s += bk.svg;
      s += V.thermo({ x: 196, y: 78, h: 80, level: exo ? .35 : .7, color: exo ? 'var(--exo)' : 'var(--endo)', id: p + 'th', ticks: false });
      A.forEach(function (a, i) {
        s += V.flow({ x1: a[0], y1: a[1], x2: a[2], y2: a[3], tone: exo ? 'exo' : 'endo', w: 8 });
        s += V.token({ p: p, path: 'M' + a[0] + ' ' + a[1] + ' L' + a[2] + ' ' + a[3], dur: 2.4, begin: -i * .8, r: 9 });
      });
      s += V.pill(150, 270, exo ? 'sistemul cedează căldură' : 'sistemul absoarbe căldură', { tone: exo ? 'exo' : 'endo', w: 232, lower: true, h: 28 });
      return { html: V.frame([300, 300], s, exo ? 'Reacție exotermă: căldura iese din sistem' : 'Reacție endotermă: căldura intră în sistem'), id: p + 'th', exo: exo };
    }
    function draw() {
      var r = T.RXN[cur], exo = r.type === 'exo';
      eqBox.className = 'eqn ' + r.type;
      eqBox.innerHTML = eqHtml(r, !!SYMQ[cur]);
      var S = scene(exo);
      sc.innerHTML = S.html;
      var svg = sc.querySelector('svg');
      setTimeout(function () { V.setThermo(svg, S.id, exo ? .85 : .25, exo ? 'var(--exo)' : 'var(--endo)'); }, 200);
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
    body.append(seg, eqBox, two, facts);
    draw();
  });

  /* ---------------------------------------------------------
     Lecția 8 — legăturile chimice: ruperea absoarbe, formarea degajă
     --------------------------------------------------------- */
  T.widget('bondsScene', function (el) {
    var body = T.shell(el, {
      title: 'Legături chimice: rupere și formare',
      help: 'Mută cursorul „reacția”. Mai întâi se <b>rup</b> legăturile din reactanți (se absoarbe energie), apoi se <b>formează</b> legăturile din produși (se degajă energie).'
    });
    var p = V.uid('bs'), W = 520, H = 300, pr = 0;
    var holder = T.h('div'), cap = T.h('div', { class: 'vz-cap' });
    var KEYS = ['A', 'B', 'X', 'Y'], NAMES = ['A', 'B', 'C', 'D'];
    // poziții: reactanți (AB sus, CD jos) → atomi liberi → produși (AC stânga, BD dreapta)
    var P0 = [[-24, -34], [24, -34], [-24, 34], [24, 34]], P1 = [[-84, -62], [84, -62], [-84, 62], [84, 62]], P2 = [[-42, -24], [42, -24], [-42, 24], [42, 24]];
    function lerp(a, b, t) { return a + (b - a) * t; }
    function scene() {
      var s = V.defs(p) + V.atomDefs(p, KEYS) + V.panel(p, W, H, 'var(--paper-2)');
      s += '<rect x="16" y="44" width="128" height="216" rx="16" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/><rect x="376" y="44" width="128" height="216" rx="16" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/>';
      s += V.pill(80, 44, 'absorbită', { tone: 'endo', w: 104, lower: true, h: 26 }) + V.pill(440, 44, 'degajată', { tone: 'exo', w: 104, lower: true, h: 26 });
      s += '<text class="t-s t-m" x="80" y="278" text-anchor="middle">energie</text><text class="t-s t-m" x="440" y="278" text-anchor="middle">energie</text>';
      s += '<g id="' + p + '-in"></g><g id="' + p + '-outg"></g>';
      s += '<g transform="translate(260 150)" id="' + p + '-mol"></g>';
      s += '<g id="' + p + '-st"></g>';
      return V.frame([W, H], s, 'Doi molecule își rup legăturile (energie absorbită) și formează legături noi (energie degajată)');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function render() {
      var br = T.clamp(pr / 50, 0, 1), fm = T.clamp((pr - 50) / 50, 0, 1);
      var pos = pr <= 50 ? P0.map(function (a, i) { return [lerp(a[0], P1[i][0], br), lerp(a[1], P1[i][1], br)]; }) : P1.map(function (a, i) { return [lerp(a[0], P2[i][0], fm), lerp(a[1], P2[i][1], fm)]; });
      var s = '';
      var b1 = pr <= 50 ? 1 - br : 0, b2 = pr > 50 ? fm : 0;
      function bond(i, j, op, col) { return op > .02 ? V.bond(pos[i][0], pos[i][1], pos[j][0], pos[j][1], { w: 7, color: col || 'var(--ink-3)', style: 'opacity:' + V.f(op) }) : ''; }
      s += bond(0, 1, b1) + bond(2, 3, b1) + bond(0, 2, b2) + bond(1, 3, b2);
      pos.forEach(function (q, i) { s += V.atom({ p: p, x: q[0], y: q[1], r: 17, k: KEYS[i], text: NAMES[i] }); });
      svg.querySelector('#' + p + '-mol').innerHTML = s;
      // jetoane de energie: intră în prima jumătate, ies în a doua
      var inn = '', outg = '', n, i;
      var nIn = pr > 0 && pr <= 50 ? Math.max(1, Math.round(br * 6)) : (pr > 50 ? 6 : 0), nOut = pr > 50 ? Math.max(1, Math.round(fm * 6)) : 0;
      for (i = 0; i < 6; i++) {
        inn += V.token({ p: p, x: 52 + (i % 2) * 56, y: 90 + Math.floor(i / 2) * 54, r: 15, style: 'opacity:' + (i < nIn ? 1 : .14) + ';transition:opacity .4s' });
        outg += V.token({ p: p, x: 412 + (i % 2) * 56, y: 90 + Math.floor(i / 2) * 54, r: 15, label: 'E', style: 'opacity:' + (i < nOut ? 1 : .14) + ';transition:opacity .4s' });
      }
      svg.querySelector('#' + p + '-in').innerHTML = inn; svg.querySelector('#' + p + '-outg').innerHTML = outg;
      var txt = pr === 0 ? 'reactanți: legăturile sunt formate' : pr < 50 ? 'se rup legăturile ⟹ se absoarbe energie' : pr === 50 ? 'toate legăturile vechi sunt rupte' : pr < 100 ? 'se formează legături noi ⟹ se degajă energie' : 'produși: legături noi formate';
      svg.querySelector('#' + p + '-st').innerHTML = V.pill(260, 276, txt, { tone: pr > 0 && pr < 50 ? 'endo' : pr > 50 ? 'exo' : 'soft', w: 308, lower: true, h: 28 });
      cap.innerHTML = T.rich('<b>Ruperea</b> unei legături = <b>absorbție</b> de energie. &nbsp;<b>Formarea</b> unei legături = <b>degajare</b> de energie.');
    }
    var sl = T.slider({ label: 'Reacția', min: 0, max: 100, step: 1, value: 0, unit: '%', dec: 0, onInput: function (v) { pr = v; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, cap);
    render();
  });
})(window);
