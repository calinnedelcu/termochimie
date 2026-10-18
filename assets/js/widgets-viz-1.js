/* =========================================================
   widgets-viz-1.js — scene ilustrate pentru lecțiile 1–4
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;

  /* ---------------------------------------------------------
     Lecția 1 — Sistem și mediu exterior
     --------------------------------------------------------- */
  T.widget('systemEnv', function (el) {
    var body = T.shell(el, {
      title: 'Sistem și mediu exterior',
      help: 'Alege tipul reacției și urmărește cum trece căldura peste „granița” sistemului (linia punctată). Atinge o parte din desen ca să vezi dacă face parte din sistem sau din mediul exterior.'
    });
    var p = V.uid('se'), kind = 'exo', sel = null, W = 520, H = 340;
    var bk = V.beaker({ p: p, x: 200, y: 112, w: 120, h: 150, level: .62, tone: 'exo', bubbles: true, id: p + 'bk' });
    var holder = T.h('div'), cap = T.h('div', { class: 'vz-cap' }), out = T.h('div', { class: 'wd-out exo' });

    function arrows() {
      var A = [[140, 170, 58, 170], [380, 170, 462, 170], [336, 56, 336, 12]], ex = kind === 'exo', s = '', i;
      A.forEach(function (a) {
        s += ex ? V.flow({ x1: a[0], y1: a[1], x2: a[2], y2: a[3], tone: 'exo' }) : V.flow({ x1: a[2], y1: a[3], x2: a[0], y2: a[1], tone: 'endo' });
      });
      A.forEach(function (a, k) {
        var d = ex ? 'M' + a[0] + ' ' + a[1] + ' L' + a[2] + ' ' + a[3] : 'M' + a[2] + ' ' + a[3] + ' L' + a[0] + ' ' + a[1];
        s += V.token({ p: p, path: d, dur: 2.6, begin: -k * .8, r: 10 });
      });
      return '<g class="v-pop">' + s + '</g>';
    }
    function highlight() {
      var h = '';
      if (sel === 'sticla') h = '<rect x="193" y="105" width="134" height="164" rx="16" fill="none" stroke="var(--ok)" stroke-width="3.4" class="v-pulse"/>' + V.pill(260, 91, 'SISTEM', { tone: 'ok', w: 82 });
      if (sel === 'lichid') h = '<rect x="203" y="' + V.f(bk.top + 2) + '" width="114" height="' + V.f(262 - bk.top - 3) + '" rx="10" fill="none" stroke="var(--ok)" stroke-width="3.4" class="v-pulse"/>' + V.pill(260, 91, 'SISTEM', { tone: 'ok', w: 82 });
      if (sel === 'aer') h = '<rect x="8" y="8" width="504" height="324" rx="20" fill="none" stroke="var(--warn,#b07d00)" stroke-width="3.4" stroke-dasharray="2 9" stroke-linecap="round" class="v-pulse"/>' + V.pill(430, 306, 'MEDIU EXTERIOR', { tone: 'warn', w: 150 });
      if (sel === 'masa') h = '<rect x="66" y="270" width="388" height="26" rx="9" fill="none" stroke="var(--warn,#b07d00)" stroke-width="3.4" class="v-pulse"/>' + V.pill(430, 306, 'MEDIU EXTERIOR', { tone: 'warn', w: 150 });
      return h;
    }
    function scene() {
      var s = V.defs(p);
      s += V.panel(p, W, H);
      s += '<g id="' + p + '-air">' + V.air(30, 16, 16, 488, 300, 5) + '</g>';
      s += '<g id="' + p + '-glow"></g>';
      s += V.pill(104, 26, 'MEDIUL EXTERIOR', { tone: 'soft', w: 150, cw: 8.4 });
      s += V.table(66, 274, 388, 16);
      s += '<text class="t-s t-m" x="260" y="318" text-anchor="middle">masa de laborator</text>';
      s += '<rect class="v-sys" x="140" y="56" width="240" height="214" rx="30"/>';
      s += V.pill(260, 56, 'SISTEM', { tone: 'ink', w: 88 });
      s += '<text class="t-s t-m" id="' + p + '-sub" x="260" y="92" text-anchor="middle" style="transition:opacity .3s">substanțe + recipient</text>';
      s += bk.svg;
      s += '<g id="' + p + '-arrows"></g>';
      s += '<g id="' + p + '-hl"></g>';
      // zone atingibile (sticla se prinde peste lichid)
      s += '<g>';
      s += '<rect class="hit" data-k="aer" x="8" y="8" width="504" height="324" rx="20" fill="transparent" style="pointer-events:all"/>';
      s += '<rect class="hit" data-k="masa" x="66" y="274" width="388" height="16" rx="7" fill="transparent" tabindex="0" role="button" aria-label="Masa de laborator"/>';
      s += '<rect class="hit" data-k="sticla" x="196" y="108" width="128" height="158" rx="14" fill="transparent" tabindex="0" role="button" aria-label="Paharul"/>';
      s += '<rect class="hit" data-k="lichid" id="' + p + '-hl-liq" x="203" y="' + V.f(bk.top) + '" width="114" height="' + V.f(262 - bk.top) + '" rx="10" fill="transparent" tabindex="0" role="button" aria-label="Substanțele din pahar"/>';
      s += '</g>';
      return V.frame([W, H], s, 'Un pahar cu o reacție chimică, încadrat ca sistem, în mijlocul mediului exterior');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');

    var TXT = {
      sticla: '<b>Paharul</b> (recipientul) face parte din <b>sistem</b>: sistemul = substanțele participante la reacție <b>+ recipientul</b> în care are loc.',
      lichid: '<b>Substanțele</b> din pahar (reactanții și produșii) fac parte din <b>sistem</b>.',
      aer: '<b>Aerul din laborator</b> se află în afara sistemului ⟹ <b>mediu exterior</b>.',
      masa: '<b>Masa</b> nu participă la reacție și nu e recipientul ⟹ <b>mediu exterior</b>.'
    };
    function render() {
      svg.setAttribute('class', 'vz s-' + kind);
      var ex = kind === 'exo';
      V.setBeaker(svg, bk.id, { tone: ex ? 'exo' : 'endo', bubbles: ex });
      svg.querySelector('#' + p + '-arrows').innerHTML = arrows();
      svg.querySelector('#' + p + '-glow').innerHTML = '<ellipse cx="260" cy="170" rx="250" ry="156" fill="url(#' + p + (ex ? '-gx' : '-gn') + ')" class="v-fade"/>';
      svg.querySelector('#' + p + '-hl').innerHTML = highlight();
      svg.querySelector('#' + p + '-sub').style.opacity = (sel === 'sticla' || sel === 'lichid') ? 0 : 1;
      out.className = 'wd-out ' + kind;
      out.innerHTML = T.rich(ex
        ? '<b class="tag-exo">Exotermă:</b> reacția <b>degajă</b> căldură, care trece din sistem în mediul exterior. Pentru sistem, $Q < 0$.'
        : '<b class="tag-endo">Endotermă:</b> reacția <b>absoarbe</b> căldură din mediul exterior. Pentru sistem, $Q > 0$.');
      cap.innerHTML = T.rich(sel ? TXT[sel] : 'Atinge <b>paharul</b>, <b>substanțele</b>, <b>masa</b> sau <b>aerul</b> din desen: ce face parte din sistem și ce din mediul exterior?');
    }
    svg.addEventListener('click', function (e) { var h = e.target.closest('[data-k]'); if (h) { sel = h.dataset.k; render(); } });
    svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var h = e.target.closest('[data-k]'); if (h) { e.preventDefault(); sel = h.dataset.k; render(); } } });
    var seg = T.seg([{ v: 'exo', label: 'Reacție exotermă', cls: 'exo' }, { v: 'endo', label: 'Reacție endotermă', cls: 'endo' }], kind, function (v) { kind = v; render(); }, 'Tipul reacției');
    body.append(T.h('div', { class: 'wd-row' }, seg), holder, cap, out);
    render();

    // mini-joc: ce face parte din sistem?
    var items = [
      ['Substanțele care reacționează (reactanții)', 'S', 'Substanțele participante la reacție fac parte din sistem.'],
      ['Produșii de reacție', 'S', 'Și produșii sunt substanțe din reacție — fac parte din sistem.'],
      ['Paharul în care are loc reacția', 'S', 'La o reacție, sistemul include și <b>recipientul</b> în care are loc.'],
      ['Aerul din laborator', 'M', 'Tot ce se află în afara sistemului este mediul exterior.'],
      ['Masa pe care stă paharul', 'M', 'Nu participă la reacție și nu e recipientul ⟹ mediu exterior.'],
      ['Palma care ține paharul', 'M', 'Este în afara sistemului ⟹ mediu exterior.'],
      ['Plita pe care se încălzește paharul', 'M', 'Sursa de încălzire e în afara sistemului ⟹ mediu exterior.']
    ];
    var ans = items.map(function () { return null; });
    var list = T.h('div', { class: 'cls-list' });
    var rows = items.map(function (it, i) {
      var why = T.h('div', { class: 'cls-why', hidden: true, html: it[2] });
      var sg = T.seg([{ v: 'S', label: 'Sistem' }, { v: 'M', label: 'Mediu' }], null, function (v) { ans[i] = v; row.classList.remove('ok', 'bad'); why.hidden = true; res.hidden = true; });
      var row = T.h('div', { class: 'cls-row' }, T.h('span', { class: 'cls-t', html: it[0] }), sg, why);
      list.append(row);
      return { row: row, why: why };
    });
    var res = T.h('div', { class: 'wd-out', hidden: true });
    var chk = T.btn('Verifică clasificarea', function () {
      var good = 0, empty = 0;
      rows.forEach(function (r, i) {
        if (ans[i] == null) { empty++; return; }
        var ok = ans[i] === items[i][1];
        if (ok) good++;
        r.row.classList.toggle('ok', ok); r.row.classList.toggle('bad', !ok); r.why.hidden = false;
      });
      res.hidden = false;
      res.className = 'wd-out ' + (good === items.length ? 'ok' : 'bad');
      res.innerHTML = good === items.length ? '<b>Perfect!</b> Sistem = substanțele participante + recipientul; restul e mediu exterior.'
        : '<b>' + good + ' din ' + items.length + ' corecte.</b>' + (empty ? ' Mai ai ' + empty + ' fără răspuns.' : ' Citește explicațiile de sub fiecare element.');
    }, 'primary');
    body.append(T.h('h4', { text: 'Ce face parte din sistem?', style: { margin: '18px 0 6px' } }), list, T.h('div', { class: 'wd-row' }, chk), res);
  });

  /* ---------------------------------------------------------
     Lecția 1 — Starea termodinamică și procesul termodinamic
     --------------------------------------------------------- */
  T.widget('stateProc', function (el) {
    var body = T.shell(el, {
      title: 'Stare și proces termodinamic',
      help: 'Starea unui sistem este dată de parametrii lui de stare: temperatura, presiunea, volumul. Mărește căldura primită de la plită (mediul exterior) și urmărește cum se schimbă starea.'
    });
    var p = V.uid('sp'), W = 520, H = 330, pct = 0;
    var T0 = 20, T1 = 80;
    var bk = V.beaker({ p: p, x: 120, y: 78, w: 130, h: 150, level: .62, tone: 'w', id: p + 'bk' });
    var holder = T.h('div'), row = T.h('div', { class: 'st-row' }), note = T.h('div', { class: 'vz-cap' });

    function dial(cx, cy, r) {
      var s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--paper)" stroke="var(--il-edge)" stroke-width="2.6"/>';
      for (var i = 0; i <= 8; i++) { var a = (-210 + i * 30) * Math.PI / 180; s += '<line x1="' + V.f(cx + Math.cos(a) * (r - 7)) + '" y1="' + V.f(cy + Math.sin(a) * (r - 7)) + '" x2="' + V.f(cx + Math.cos(a) * (r - 2)) + '" y2="' + V.f(cy + Math.sin(a) * (r - 2)) + '" stroke="var(--il-edge)" stroke-width="1.6" stroke-linecap="round"/>'; }
      var na = (-210 + 3 * 30) * Math.PI / 180;
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + V.f(cx + Math.cos(na) * (r - 9)) + '" y2="' + V.f(cy + Math.sin(na) * (r - 9)) + '" stroke="var(--exo)" stroke-width="3" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="3.2" fill="var(--ink)"/>';
      return s;
    }
    function scene() {
      var s = V.defs(p) + V.panel(p, W, H);
      s += '<g id="' + p + '-glow"></g>';
      // mediul exterior: plita
      s += V.pill(80, 28, 'MEDIU EXTERIOR', { tone: 'soft', w: 150, cw: 8.4 });
      s += V.table(70, 262, 250, 14);
      s += '<rect x="136" y="246" width="98" height="16" rx="6" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.8"/>';
      s += '<text class="t-s t-m" x="185" y="296" text-anchor="middle">plita</text>';
      s += V.flame({ p: p, x: 185, y: 246, s: .62, on: false, id: p + '-fl' });
      s += bk.svg;
      s += V.thermo({ x: 228, y: 74, h: 96, level: .2, color: 'var(--endo)', id: p + 'th', ticks: false });
      s += '<g id="' + p + '-steam" style="opacity:0;transition:opacity .6s"><path class="v-heatw" d="" /></g>';
      // panoul parametrilor de stare
      s += '<rect x="316" y="48" width="188" height="238" rx="18" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/>';
      s += V.pill(410, 48, 'parametri de stare', { tone: 'ink', w: 162, lower: true, h: 28 });
      var rows = [['temperatura', 'vt'], ['presiunea', 'vp'], ['volumul', 'vv']];
      rows.forEach(function (r, i) {
        var y = 92 + i * 64;
        s += '<line x1="332" y1="' + (y + 40) + '" x2="488" y2="' + (y + 40) + '" stroke="var(--line)" stroke-width="1.5"' + (i === 2 ? ' opacity="0"' : '') + '/>';
        s += '<text class="t-s t-m" x="372" y="' + (y + 6) + '">' + r[0] + '</text>';
        s += '<text class="t-l t-b" id="' + p + '-' + r[1] + '" x="372" y="' + (y + 30) + '"></text>';
      });
      // pictograme
      s += V.thermo({ x: 346, y: 86, h: 22, level: .3, color: 'var(--endo)', id: p + 'ti', ticks: false });
      s += dial(346, 176, 17);
      // volum: pahar mic cu paranteză
      s += '<path d="M334 236 L334 262 Q334 268 340 268 L352 268 Q358 268 358 262 L358 236" fill="none" stroke="var(--il-edge)" stroke-width="2.4" stroke-linecap="round"/><rect x="336" y="246" width="20" height="20" rx="3" style="fill:' + V.mix('var(--endo)', 38) + '"/>';
      return V.frame([W, H], s, 'Un vas cu apă încălzit pe plită, cu termometru, manometru și volum — parametrii de stare');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');

    function card(title, t, cls, chg) {
      return '<div class="st-card ' + (cls || '') + '"><h5>' + title + '</h5>' +
        '<div class="ln' + (chg ? ' chg' : '') + '"><span>t</span><b>' + T.fmt(t, 0) + ' °C</b></div><div class="ln"><span>p</span><b>1 atm</b></div><div class="ln"><span>V</span><b>0,2 L</b></div></div>';
    }
    function arrowSvg() { return '<svg viewBox="0 0 70 30"><path d="M4 15 H56" stroke="var(--exo)" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M50 5 L66 15 L50 25 Z" fill="var(--exo)"/></svg>'; }
    function update() {
      var f = pct / 100, t = T0 + (T1 - T0) * f, col = V.tempColor(t, 10, 90);
      V.setBeaker(svg, bk.id, { opac: { w: 1 - f * .3, exo: f * .45 } });
      V.setThermo(svg, p + 'th', .14 + .78 * (t - 10) / 80, col);
      V.setThermo(svg, p + 'ti', .14 + .78 * (t - 10) / 80, col);
      var fl = svg.querySelector('#' + p + '-fl'); fl.style.opacity = f > 0.02 ? 1 : 0; fl.setAttribute('transform', 'translate(185 246) scale(' + V.f(.35 + f * .5) + ')');
      svg.querySelector('#' + p + '-glow').innerHTML = f > .02 ? '<ellipse cx="185" cy="170" rx="' + V.f(60 + f * 70) + '" ry="' + V.f(70 + f * 50) + '" fill="url(#' + p + '-gx)" opacity="' + V.f(.35 + f * .6) + '"/>' : '';
      svg.querySelector('#' + p + '-vt').textContent = T.fmt(t, 0) + ' °C';
      svg.querySelector('#' + p + '-vp').textContent = '1 atm';
      svg.querySelector('#' + p + '-vv').textContent = '0,2 L';
      var steam = svg.querySelector('#' + p + '-steam'); steam.style.opacity = t > 62 ? Math.min(1, (t - 62) / 14) : 0;
      steam.innerHTML = [0, 1, 2].map(function (i) { return '<path class="v-heatw" d="M' + (150 + i * 38) + ' 70 q-7 -10 0 -20 q7 -10 0 -20" stroke="var(--ink-3)" style="animation-delay:-' + (i * .7) + 's"/>'; }).join('');
      steam.setAttribute('class', 'v-heatw');
      var done = pct >= 100;
      row.innerHTML = card('Starea inițială', T0, '', false) + '<div class="st-arrow">' + arrowSvg() + '<span>proces termodinamic</span></div>' + card(done ? 'Starea finală' : 'Starea acum', t, done ? 'done' : (pct > 0 ? 'live' : ''), pct > 0);
      note.innerHTML = T.rich(done
        ? 'Starea s-a schimbat (temperatura a crescut de la 20 °C la 80 °C) <b>prin interacțiunea cu mediul exterior</b> — plita. Asta este un <b>proces termodinamic</b>.'
        : pct > 0 ? 'Sistemul primește căldură de la plită: starea lui se modifică. Continuă până la 100%.'
          : 'Starea inițială: 20 °C, 1 atm, 0,2 L. Mută cursorul ca să încălzești apa cu plita (mediul exterior).');
    }
    var sl = T.slider({ label: 'Căldura primită de la plită', min: 0, max: 100, step: 1, value: 0, unit: '%', dec: 0, onInput: function (v) { pct = v; update(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, row, note);
    update();
  });


  /* ---------------------------------------------------------
     Lecția 2 — căldura: încotro merge și ce semn are
     --------------------------------------------------------- */
  T.widget('heatSign', function (el) {
    var body = T.shell(el, {
      title: 'Căldura Q: încotro merge și ce semn are',
      help: 'Căldura trece dintr-un corp în altul, între corpuri aflate la temperaturi diferite. Alege care corp este <b>sistemul</b> și vezi ce semn are $Q$ pentru el.'
    });
    var p = V.uid('hf'), W = 520, H = 340, sys = 'A', q = 30;
    var A = V.beaker({ p: p, x: 80, y: 100, w: 112, h: 130, level: .66, tone: 'exo', id: p + 'A', seed: 4 });
    var B = V.beaker({ p: p, x: 328, y: 100, w: 112, h: 130, level: .66, tone: 'endo', id: p + 'B', seed: 9 });
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });
    function scene() {
      var s = V.defs(p) + V.panel(p, W, H);
      s += '<g id="' + p + '-sysb"></g>';
      s += A.svg + B.svg;
      s += V.thermo({ x: 168, y: 94, h: 84, level: .8, color: 'var(--exo)', id: p + 'tA', ticks: false });
      s += V.thermo({ x: 416, y: 94, h: 84, level: .2, color: 'var(--endo)', id: p + 'tB', ticks: false });
      s += '<rect x="142" y="152" width="236" height="12" rx="6" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.8"/>';
      s += '<g id="' + p + '-flow"></g>';
      s += '<g id="' + p + '-lab"></g>';
      return V.frame([W, H], s, 'Două corpuri la temperaturi diferite, unite printr-o bară metalică: căldura trece de la cel cald la cel rece');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function render() {
      var ta = 80 - .4 * q, tb = 20 + .4 * q;
      V.setThermo(svg, p + 'tA', .12 + .8 * (ta - 10) / 80, V.tempColor(ta, 10, 90));
      V.setThermo(svg, p + 'tB', .12 + .8 * (tb - 10) / 80, V.tempColor(tb, 10, 90));
      var sb = sys === 'A' ? [62, 82, 154, 178] : [310, 82, 154, 178];
      svg.querySelector('#' + p + '-sysb').innerHTML = '<g class="v-pop"><rect class="v-sys" x="' + sb[0] + '" y="' + sb[1] + '" width="' + sb[2] + '" height="' + sb[3] + '" rx="26"/>' + V.pill(sb[0] + sb[2] / 2, sb[1], 'SISTEM', { tone: 'ink', w: 88 }) + '</g>';
      var wd = 6 + q / 6, path = 'M198 132 L322 132';
      svg.querySelector('#' + p + '-flow').innerHTML = V.flow({ x1: 198, y1: 132, x2: 322, y2: 132, tone: 'exo', w: wd }) +
        [0, 1, 2].map(function (k) { return V.token({ p: p, path: path, dur: 2.4, begin: -k * .8, r: 10 }); }).join('');
      var neg = sys === 'A', val = (neg ? '−' : '+') + q + ' kJ';
      svg.querySelector('#' + p + '-lab').innerHTML =
        V.pill(136, 262, 'corpul A', { tone: 'soft', w: 104, lower: true }) + V.pill(384, 262, 'corpul B', { tone: 'soft', w: 104, lower: true }) +
        '<text class="t-l t-b t-exo" x="136" y="62" text-anchor="middle">' + T.fmt(ta, 0) + ' °C</text><text class="t-l t-b t-endo" x="384" y="62" text-anchor="middle">' + T.fmt(tb, 0) + ' °C</text>' +
        V.pill(260, 304, 'Q = ' + val + (neg ? '  ·  cedează căldură' : '  ·  primește căldură'), { tone: neg ? 'exo' : 'endo', w: 300, lower: true, h: 32 });
      out.className = 'wd-out ' + (neg ? 'exo' : 'endo');
      out.innerHTML = T.rich(neg
        ? 'Sistemul (corpul A) <b>cedează</b> căldură ⟹ <b>$Q < 0$</b>. Cel care cedează își scade temperatura: ' + T.fmt(ta, 0) + ' °C.'
        : 'Sistemul (corpul B) <b>primește / absoarbe</b> căldură ⟹ <b>$Q > 0$</b>. Cel care primește își crește temperatura: ' + T.fmt(tb, 0) + ' °C.');
    }
    var seg = T.seg([{ v: 'A', label: 'Sistemul = corpul A (cald)', cls: 'exo' }, { v: 'B', label: 'Sistemul = corpul B (rece)', cls: 'endo' }], sys, function (v) { sys = v; render(); }, 'Sistemul');
    var sl = T.slider({ label: 'Căldura transferată', min: 5, max: 60, step: 5, value: q, unit: 'kJ', dec: 0, onInput: function (v) { q = v; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, T.h('div', { class: 'wd-row' }, seg), sl), holder, out);
    render();
  });

  /* ---------------------------------------------------------
     Lecția 2 — cele trei efecte ale căldurii primite
     --------------------------------------------------------- */
  T.widget('heatEffects', function (el) {
    var body = T.shell(el, {
      title: 'Ce poate produce căldura primită',
      help: 'Dă aceeași căldură în trei situații diferite. Căldura primită de un corp poate produce <b>creșterea temperaturii</b>, <b>un lucru mecanic</b> sau <b>schimbarea stării de agregare</b>.'
    });
    var p = V.uid('he'), W = 520, H = 300, f = 0;
    var bk1 = V.beaker({ p: p, x: 48, y: 76, w: 84, h: 104, level: .6, tone: 'w', id: p + 'b1', seed: 2 });
    var cy = V.cylinder({ p: p, x: 218, y: 76, w: 84, h: 104, id: p + 'cy', n: 12 });
    var bk3 = V.beaker({ p: p, x: 388, y: 76, w: 84, h: 104, level: .4, tone: 'w', id: p + 'b3', seed: 5 });
    var holder = T.h('div'), note = T.h('div', { class: 'vz-cap' });
    function scene() {
      var s = V.defs(p) + V.panel(p, W, H, 'var(--paper-2)');
      [12, 182, 352].forEach(function (x) { s += '<rect x="' + x + '" y="18" width="156" height="266" rx="18" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/>'; });
      s += bk1.svg + cy.svg + bk3.svg;
      s += V.thermo({ x: 112, y: 70, h: 64, level: .2, color: 'var(--endo)', id: p + 't1', ticks: false });
      s += V.thermo({ x: 452, y: 70, h: 64, level: .2, color: 'var(--endo)', id: p + 't3', ticks: false });
      s += '<g id="' + p + '-ice" style="transform-box:fill-box;transform-origin:50% 100%;transition:transform .7s cubic-bezier(.3,.7,.3,1)">' + V.ice({ p: p, x: 408, y: 0, s: 34 }) + '</g>';
      [90, 260, 430].forEach(function (cx, i) {
        s += '<rect x="' + (cx - 24) + '" y="206" width="48" height="8" rx="4" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.6"/>';
        s += V.flame({ p: p, x: cx, y: 206, s: .3, on: false, id: p + '-fl' + i });
      });
      s += V.pill(90, 238, '↑ t°', { tone: 'endo', w: 74, lower: true }) + V.pill(260, 238, 'lucru mecanic', { tone: 'warn', w: 132, lower: true }) + V.pill(430, 238, 'schimbare de stare', { tone: 'ink', w: 142, lower: true, cw: 7.4 });
      s += '<text class="t-s t-m" x="90" y="268" text-anchor="middle">temperatura crește</text><text class="t-s t-m" x="260" y="268" text-anchor="middle">gazul împinge pistonul</text><text class="t-s t-m" x="430" y="268" text-anchor="middle">gheața se topește</text>';
      s += '<g id="' + p + '-vals"></g>';
      return V.frame([W, H], s, 'Trei situații în care un corp primește căldură: se încălzește, efectuează lucru mecanic sau își schimbă starea');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function render() {
      var t1 = 20 + 50 * f;
      V.setThermo(svg, p + 't1', .12 + .8 * (t1 - 10) / 80, V.tempColor(t1, 10, 90));
      V.setBeaker(svg, bk1.id, { opac: { w: 1 - f * .25, exo: f * .4 } });
      cy.set(svg, f, f);
      var lev = .4 + .3 * f, top = 76 + 104 * (1 - lev);
      V.setBeaker(svg, bk3.id, { top: top });
      V.setThermo(svg, p + 't3', .1, 'var(--endo)');
      var ic = svg.querySelector('#' + p + '-ice'); ic.style.transform = 'translateY(' + V.f(top - 28) + 'px) scale(' + V.f(1 - .85 * f) + ')';
      [0, 1, 2].forEach(function (i) {
        var fl = svg.querySelector('#' + p + '-fl' + i); fl.style.opacity = f > .02 ? 1 : 0; fl.setAttribute('transform', 'translate(' + [90, 260, 430][i] + ' 206) scale(' + V.f(.22 + .22 * f) + ')');
      });
      svg.querySelector('#' + p + '-vals').innerHTML =
        '<text class="t-b t-endo" x="90" y="52" text-anchor="middle">t = ' + T.fmt(t1, 0) + ' °C</text>' +
        '<text class="t-b t-gold" x="260" y="52" text-anchor="middle">V crește</text>' +
        '<text class="t-b t-endo" x="430" y="52" text-anchor="middle">t = 0 °C</text>';
      note.innerHTML = T.rich(f === 0 ? 'Mută cursorul: aceeași căldură $Q > 0$ produce efecte diferite.' :
        'În primul pahar <b>crește temperatura</b>; la cilindru gazul se dilată și efectuează <b>lucru mecanic</b>; la gheață <b>se schimbă starea</b> (se topește) și temperatura rămâne 0 °C.');
    }
    var sl = T.slider({ label: 'Căldura primită ($Q > 0$)', min: 0, max: 100, step: 1, value: 0, unit: '%', dec: 0, onInput: function (v) { f = v / 100; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, note);
    render();
  });

  /* ---------------------------------------------------------
     Lecția 2 — calorie ↔ joule
     --------------------------------------------------------- */
  T.widget('calConv', function (el) {
    var body = T.shell(el, { title: 'Convertor de unități pentru căldură', help: 'Scrie o valoare, alege unitatea și vezi echivalentul în celelalte. Poți alege valoarea calorie–joule: 4,186 (teorie) sau 4,18 (exercițiul 4/14).' });
    var cal = 4.186, p = V.uid('cc');
    var F = function () { return { J: 1, kJ: 1000, cal: cal, kcal: cal * 1000 }; };
    var inp = T.h('input', { class: 'inp', type: 'text', inputmode: 'decimal', value: '256,57', 'aria-label': 'Valoare' });
    var sel = T.h('select', { class: 'inp', 'aria-label': 'Unitate' }, ['J', 'kJ', 'cal', 'kcal'].map(function (k) { return T.h('option', { value: k, text: k, selected: k === 'kcal' ? true : null }); }));
    var cs = T.h('select', { class: 'inp sm', style: { minWidth: '160px' }, 'aria-label': 'Valoarea unei calorii' }, [['4.186', '1 cal = 4,186 J'], ['4.18', '1 cal = 4,18 J']].map(function (o) { return T.h('option', { value: o[0], text: o[1] }); }));
    var out = T.h('div', { class: 'wd-out' }), vis = T.h('div');
    function bar() {
      var u = 120 / cal, s = V.defs(p), x = 112, i;
      s += '<text class="t-b" x="10" y="26">1 cal</text><rect x="' + x + '" y="8" width="120" height="26" rx="8" fill="url(#' + p + '-gold)" stroke="#b07d00" stroke-width="2"/>';
      s += '<text class="t-b" x="10" y="72">= ' + T.fmt(cal, 3) + ' J</text>';
      for (i = 0; i < 4; i++) s += '<rect x="' + V.f(x + i * u) + '" y="54" width="' + V.f(u - 3) + '" height="26" rx="5" fill="var(--endo)" opacity=".85"/>';
      s += '<rect x="' + V.f(x + 4 * u) + '" y="54" width="' + V.f((cal - 4) * u - 3) + '" height="26" rx="5" fill="var(--endo)" opacity=".45"/>';
      s += '<text class="t-s t-m" x="' + (x + 128) + '" y="26">o calorie</text><text class="t-s t-m" x="' + (x + 128) + '" y="72">…este puțin mai mult de 4 jouli</text>';
      return V.frame([520, 92], s, 'O calorie este egală cu aproximativ 4,186 jouli');
    }
    function upd() {
      var v = T.parseNum(inp.value)[0];
      cal = +cs.value; vis.innerHTML = bar();
      if (v == null) { out.textContent = 'Scrie un număr.'; return; }
      var f = F(), J = v * f[sel.value];
      out.innerHTML = T.rich(Object.keys(f).map(function (k) { return '<span class="chip' + (k === sel.value ? ' ok' : '') + '">' + T.fmt(J / f[k], 4) + ' ' + k + '</span>'; }).join(' '));
    }
    inp.addEventListener('input', upd); sel.addEventListener('change', upd); cs.addEventListener('change', upd);
    body.append(vis, T.h('div', { class: 'wd-row' }, inp, sel, cs), out);
    upd();
  });

})(window);
