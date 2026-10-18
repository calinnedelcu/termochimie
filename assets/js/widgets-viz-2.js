/* =========================================================
   widgets-viz-2.js — scene ilustrate pentru lecțiile 3–4
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;

  /* ---------------------------------------------------------
     Lecția 3 — cele patru mărimi calorimetrice, ilustrate
     --------------------------------------------------------- */
  T.widget('marimiCards', function (el) {
    var body = T.shell(el, {
      title: 'Cele patru mărimi, pe scurt',
      badge: 'Pe scurt',
      help: 'Fiecare mărime răspunde la aceeași întrebare — „cât $Q$ trebuie dat?” — dar pentru altceva: un corp întreg, un gram, un mol sau o schimbare de stare.'
    });
    function thermo(p, id, flat) {
      var s = V.thermo({ x: 200, y: 20, h: 76, level: .55, color: 'var(--exo)', id: id });
      if (flat) return s + '<line x1="176" y1="62" x2="236" y2="62" stroke="var(--il-gold)" stroke-width="2.6" stroke-dasharray="5 4"/>';
      return s + '<path d="M219 50 h6 v24 h-6" fill="none" stroke="#b07d00" stroke-width="2.4" stroke-linecap="round"/><text class="t-s t-b t-gold" x="229" y="66">1 K</text>';
    }
    function token(p) { return V.flow({ x1: 6, y1: 74, x2: 42, y2: 74, tone: 'gold', w: 6 }) + V.token({ p: p, path: 'M10 74 L40 74', dur: 2.2, r: 9 }); }
    function svgC() {
      var p = V.uid('m1');
      return V.frame([260, 140], V.defs(p) + token(p) +
        '<rect x="48" y="34" width="106" height="78" rx="14" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="2.4"/><text class="t-b" x="101" y="78" text-anchor="middle">un corp</text>' +
        thermo(p, p + 't') + '<text class="t-s t-m" x="104" y="132" text-anchor="middle">Q pentru +1 K</text>', 'Un corp întreg primește căldură: temperatura crește cu un grad');
    }
    function svgc() {
      var p = V.uid('m2');
      return V.frame([260, 140], V.defs(p) + token(p) +
        '<rect x="76" y="52" width="54" height="54" rx="10" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="2.4"/><text class="t-b t-l" x="103" y="86" text-anchor="middle">1 g</text>' +
        thermo(p, p + 't') + '<text class="t-s t-m" x="104" y="132" text-anchor="middle">Q pentru 1 g și +1 K</text>', 'Un gram de substanță primește căldură: temperatura crește cu un grad');
    }
    function svgcm() {
      var p = V.uid('m3'), s = V.defs(p) + V.atomDefs(p, ['A', 'B']);
      var cx = 100, cy = 74, r = 12, pts = [[0, 0], [-24, 0], [24, 0], [-12, -21], [12, -21], [-12, 21], [12, 21]];
      s += token(p);
      pts.forEach(function (q, i) { s += V.atom({ p: p, x: cx + q[0], y: cy + q[1], r: r, k: i % 2 ? 'A' : 'B', label: false, cls: 'v-jig', style: 'animation-delay:-' + (i * .13) + 's' }); });
      s += '<text class="t-b" x="' + cx + '" y="' + (cy + 46) + '" text-anchor="middle">1 mol</text>';
      return V.frame([260, 140], s + thermo(p, p + 't') + '<text class="t-s t-m" x="104" y="134" text-anchor="middle">Q pentru 1 mol și +1 K</text>', 'Un mol de substanță primește căldură: temperatura crește cu un grad');
    }
    function svgl() {
      var p = V.uid('m4'), s = V.defs(p);
      s += V.flow({ x1: 44, y1: 4, x2: 44, y2: 36, tone: 'gold', w: 6 }) + V.token({ p: p, path: 'M44 6 L44 34', dur: 2.2, r: 9 });
      s += V.ice({ p: p, x: 26, y: 50, s: 40 });
      s += '<path d="M84 78 H112" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round"/><path d="M106 70 L118 78 L106 86" fill="none" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<path d="M150 56 C158 70 170 78 170 92 C170 104 161 112 150 112 C139 112 130 104 130 92 C130 78 142 70 150 56Z" style="fill:' + V.mix('var(--endo)', 52) + '" stroke="var(--endo)" stroke-width="2.4"/><path d="M142 90 q0 10 8 14" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>';
      s += thermo(p, p + 't', true) + '<text class="t-s t-m" x="104" y="134" text-anchor="middle">Q pentru 1 g, t° rămâne constantă</text>';
      return V.frame([260, 140], s, 'Căldura latentă: un gram își schimbă starea, fără ca temperatura să se modifice');
    }
    var cards = [
      { tone: 'ink', svg: svgC(), title: 'Capacitatea calorică', sym: '$C$', def: 'Căldura necesară pentru a crește cu un grad temperatura unui <b>corp</b>.', f: '$C = (Q)//(ΔT)$', u: '$J/K$' },
      { tone: 'exo', svg: svgc(), title: 'Căldura specifică', sym: '$c$', def: 'Căldura necesară pentru a crește cu un grad temperatura <b>unității de masă</b> dintr-o substanță.', f: '$c = (Q)//(m·ΔT)$ &nbsp;⟹&nbsp; $Q = m·c·ΔT$', u: '$J/(g·K)$' },
      { tone: 'endo', svg: svgcm(), title: 'Căldura specifică molară', sym: '$c_m$', def: 'Căldura necesară pentru a crește cu un grad temperatura unui <b>mol</b> de substanță.', f: '$c_m = (Q)//(ν·ΔT)$', u: '$J/(mol·K)$' },
      { tone: 'gold', svg: svgl(), title: 'Căldura latentă specifică', sym: '$λ$', def: 'Căldura necesară <b>transformării de stare</b> a unității de masă, <b>fără modificarea temperaturii</b>.', f: '$λ = (Q)//(m)$', u: '$J/g$ &nbsp;(topire, vaporizare, sublimare)' }
    ];
    body.append(T.h('div', { class: 'mcards', html: cards.map(function (c) {
      return '<div class="mcard ' + c.tone + '"><div class="mc-fig">' + c.svg + '</div><div class="mc-b"><h4>' + c.title + ' <span class="mc-sym">' + c.sym + '</span></h4><p>' + c.def + '</p><div class="mc-f">' + c.f + '</div><div class="mc-u"><span>unitate</span> ' + c.u + '</div></div></div>';
    }).join('') }));
  });

  /* ---------------------------------------------------------
     Lecția 4 — echilibrul termic într-un sistem izolat
     --------------------------------------------------------- */
  T.widget('equilibrium', function (el) {
    var body = T.shell(el, {
      title: 'Echilibru termic: două corpuri într-un sistem izolat',
      help: 'Două corpuri cu temperaturi diferite, puse în contact într-un <b>sistem izolat</b>, ajung după un timp la <b>aceeași temperatură</b>. Căldura cedată de unul este primită de celălalt: $Q_1 + Q_2 = 0$. (Aici ambele corpuri sunt apă, $c = 4,184 J/(g·K)$.)'
    });
    var p = V.uid('eq'), W = 520, H = 372, C = 4.184;
    var S = { m1: 200, t1: 80, m2: 300, t2: 20, s: 0 }, anim = null;
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });

    function res() { var Tf = (S.m1 * S.t1 + S.m2 * S.t2) / (S.m1 + S.m2); return { Tf: Tf, Q1: S.m1 * C * (Tf - S.t1), Q2: S.m2 * C * (Tf - S.t2) }; }
    function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function hOf(m) { return 52 + m / 500 * 84; }
    var geo = {};
    function bodies() {
      var s = '', R = T.rng(5);
      geo.hA = hOf(S.m1); geo.hB = hOf(S.m2);
      [['A', 130, geo.hA, S.m1, 1], ['B', 250, geo.hB, S.m2, 2]].forEach(function (b) {
        var y = 236 - b[2];
        s += '<g><rect id="' + p + '-b' + b[0] + '" x="' + b[1] + '" y="' + V.f(y) + '" width="120" height="' + V.f(b[2]) + '" rx="14" style="stroke:var(--il-edge);stroke-width:2.6;transition:fill .3s"/>';
        for (var i = 0; i < 9; i++) s += '<circle class="v-jig" id="' + p + '-p' + b[0] + i + '" cx="' + V.f(b[1] + 14 + R.next() * 92) + '" cy="' + V.f(y + 14 + R.next() * (b[2] - 34)) + '" r="3.4" style="fill:var(--ink-2);opacity:.6;animation-delay:-' + V.f(R.next() * .4) + 's"/>';
        s += '<text class="t-s t-m" x="' + (b[1] + 60) + '" y="230" text-anchor="middle">m<tspan class="sb" dy="3">' + b[4] + '</tspan><tspan dy="-3"> = ' + b[3] + ' g</tspan></text>';
        s += '<text class="t-l t-b" id="' + p + '-t' + b[0] + '" x="' + (b[1] + 60) + '" y="' + V.f(y - 10) + '" text-anchor="middle"></text></g>';
      });
      return s;
    }
    function scene() {
      var s = V.defs(p) + '<defs><pattern id="' + p + '-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="var(--paper-2)"/><line x1="0" y1="0" x2="0" y2="10" stroke="var(--line-2)" stroke-width="4"/></pattern></defs>';
      s += V.panel(p, W, H, 'var(--paper-2)');
      s += '<rect x="36" y="34" width="448" height="220" rx="24" fill="url(#' + p + '-hatch)" stroke="var(--il-edge)" stroke-width="2.4"/>';
      s += '<rect x="52" y="50" width="416" height="188" rx="14" fill="var(--paper)" stroke="var(--il-edge)" stroke-width="2"/>';
      s += V.pill(260, 34, 'SISTEM IZOLAT', { tone: 'ink', w: 136, cw: 8.6 });
      s += '<g id="' + p + '-bodies"></g><g id="' + p + '-flow"></g>';
      s += '<text class="t-s t-m" x="40" y="286">Q cedată</text><text class="t-s t-m" x="40" y="320">Q primită</text>';
      s += '<rect x="112" y="272" width="360" height="20" rx="10" fill="var(--line)"/><rect x="112" y="306" width="360" height="20" rx="10" fill="var(--line)"/>';
      s += '<rect id="' + p + '-q1" x="112" y="272" width="0" height="20" rx="10" fill="var(--exo)"/><rect id="' + p + '-q2" x="112" y="306" width="0" height="20" rx="10" fill="var(--endo)"/>';
      s += '<text class="t-b" id="' + p + '-v1" x="118" y="287" style="fill:#fff"></text><text class="t-b" id="' + p + '-v2" x="118" y="321" style="fill:#fff"></text>';
      s += '<text class="t-b t-l" id="' + p + '-sum" x="260" y="358" text-anchor="middle"></text>';
      return V.frame([W, H], s, 'Două corpuri în contact, într-un sistem izolat, își egalizează temperaturile; căldura cedată este egală cu cea primită');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function build() { svg.querySelector('#' + p + '-bodies').innerHTML = bodies(); frame(); }
    function frame() {
      var R = res(), e = ease(S.s);
      var ta = S.t1 + (R.Tf - S.t1) * e, tb = S.t2 + (R.Tf - S.t2) * e;
      var ca = V.tempColor(ta, 10, 95), cb = V.tempColor(tb, 10, 95);
      var ra = svg.querySelector('#' + p + '-bA'), rb = svg.querySelector('#' + p + '-bB');
      ra.style.fill = V.mix(ca, 34); rb.style.fill = V.mix(cb, 34);
      var ca2 = ta > 60 ? 'v-jig hot' : ta < 35 ? 'v-jig cold' : 'v-jig', cb2 = tb > 60 ? 'v-jig hot' : tb < 35 ? 'v-jig cold' : 'v-jig';
      for (var i = 0; i < 9; i++) { svg.querySelector('#' + p + '-pA' + i).setAttribute('class', ca2); svg.querySelector('#' + p + '-pB' + i).setAttribute('class', cb2); }
      var tA = svg.querySelector('#' + p + '-tA'), tB = svg.querySelector('#' + p + '-tB');
      tA.textContent = T.fmt(ta, 1) + ' °C'; tB.textContent = T.fmt(tb, 1) + ' °C'; tA.style.fill = ca; tB.style.fill = cb;
      var diff = Math.abs(ta - tb), hot = ta >= tb ? 'A' : 'B';
      var wd = 4 + diff / 8, fl = svg.querySelector('#' + p + '-flow');
      if (diff > 1.5) {
        var x1 = hot === 'A' ? 196 : 324, x2 = hot === 'A' ? 324 : 196, path = 'M' + x1 + ' 86 L' + x2 + ' 86';
        fl.innerHTML = V.flow({ x1: x1, y1: 86, x2: x2, y2: 86, tone: 'exo', w: wd }) + [0, 1, 2].map(function (k) { return V.token({ p: p, path: path, dur: 2.2, begin: -k * .73, r: 10 }); }).join('');
      } else fl.innerHTML = V.pill(260, 86, 'echilibru termic', { tone: 'ok', w: 160, lower: true });
      var full = 360;
      var q1 = svg.querySelector('#' + p + '-q1'), q2 = svg.querySelector('#' + p + '-q2');
      q1.setAttribute('width', V.f(Math.max(0, full * e))); q2.setAttribute('width', V.f(Math.max(0, full * e)));
      svg.querySelector('#' + p + '-v1').textContent = e > .1 ? '−' + T.fmt(Math.abs(R.Q1) * e / 1000, 2) + ' kJ' : '';
      svg.querySelector('#' + p + '-v2').textContent = e > .1 ? '+' + T.fmt(Math.abs(R.Q2) * e / 1000, 2) + ' kJ' : '';
      var sum = svg.querySelector('#' + p + '-sum');
      sum.textContent = e > .98 ? 'Q₁ + Q₂ = ' + T.fmt((R.Q1 + R.Q2) / 1000, 0) + '   (Q cedată = Q primită)' : '';
      sum.style.fill = 'var(--ok)';
      out.className = 'wd-out' + (e > .98 ? ' ok' : '');
      out.innerHTML = T.rich(e > .98
        ? '<b>Echilibru:</b> ambele corpuri au ' + T.fmt(R.Tf, 1) + ' °C. Căldura cedată de corpul cald ($' + T.fmt(Math.abs(R.Q1) / 1000, 2) + '$ kJ) este egală cu cea primită de corpul rece: $Q_1 + Q_2 = 0$.'
        : 'Apasă „Pornește” sau mută cursorul „timpul”: corpul cald <b>cedează</b> căldură ($Q_1 < 0$), cel rece o <b>primește</b> ($Q_2 > 0$), până ajung la aceeași temperatură.');
    }
    var tsl;
    function play() {
      if (anim) { anim.stop(); anim = null; return; }
      if (S.s >= 1) { S.s = 0; }
      var last = null;
      anim = V.loop(svg, function (dt) {
        S.s = Math.min(1, S.s + dt / 4); tsl.set(Math.round(S.s * 100)); frame();
        if (S.s >= 1) { anim.stop(); anim = null; }
      });
    }
    function reset() { if (anim) { anim.stop(); anim = null; } S.s = 0; tsl.set(0); frame(); }
    var sls = [
      T.slider({ label: 'm₁ (corpul cald)', min: 50, max: 500, step: 10, value: S.m1, unit: 'g', dec: 0, onInput: function (v) { S.m1 = v; reset(); build(); } }),
      T.slider({ label: 't₁ inițial', min: 40, max: 95, step: 1, value: S.t1, unit: '°C', dec: 0, onInput: function (v) { S.t1 = v; reset(); } }),
      T.slider({ label: 'm₂ (corpul rece)', min: 50, max: 500, step: 10, value: S.m2, unit: 'g', dec: 0, onInput: function (v) { S.m2 = v; reset(); build(); } }),
      T.slider({ label: 't₂ inițial', min: 5, max: 35, step: 1, value: S.t2, unit: '°C', dec: 0, onInput: function (v) { S.t2 = v; reset(); } })
    ];
    tsl = T.slider({ label: 'Timpul', min: 0, max: 100, step: 1, value: 0, unit: '%', dec: 0, onInput: function (v) { if (anim) { anim.stop(); anim = null; } S.s = v / 100; frame(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, sls, tsl, T.h('div', { class: 'wd-row' }, T.btn('▶ Pornește / oprește', play, 'primary'), T.btn('↺ De la capăt', reset, 'ghost'))), holder, out);
    build();
  });

  /* ---------------------------------------------------------
     Lecția 4 — procese inverse: topire ↔ solidificare
     --------------------------------------------------------- */
  T.widget('inverseProc', function (el) {
    var body = T.shell(el, {
      title: 'Procese inverse: topire ↔ solidificare',
      help: 'Căldura <b>absorbită</b> într-o transformare este egală, ca valoare, cu cea <b>degajată</b> în transformarea inversă. Alege cantitatea de căldură și urmărește cele două sensuri.'
    });
    var p = V.uid('ip'), W = 520, H = 300, q = 3300;
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });
    function render() {
      var wd = 5 + q / 700, s = V.defs(p) + V.panel(p, W, H, 'var(--paper-2)');
      // gheață și apă
      s += V.pill(110, 30, 'GHEAȚĂ', { tone: 'soft', w: 100, cw: 8.2 }) + V.pill(410, 30, 'APĂ', { tone: 'soft', w: 80 });
      s += V.ice({ p: p, x: 80, y: 120, s: 62 });
      s += '<path d="M410 112 C428 138 450 150 450 178 C450 204 433 220 410 220 C387 220 370 204 370 178 C370 150 392 138 410 112Z" style="fill:' + V.mix('var(--endo)', 52) + '" stroke="var(--endo)" stroke-width="3"/><path d="M394 168 q0 22 18 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>';
      // topire (sus) și solidificare (jos)
      s += V.flow({ x1: 170, y1: 100, x2: 350, y2: 100, tone: 'endo', w: wd });
      s += V.token({ p: p, path: 'M170 100 L350 100', dur: 2.6, r: 11 }) + V.token({ p: p, path: 'M170 100 L350 100', dur: 2.6, begin: -1.3, r: 11 });
      s += V.flow({ x1: 350, y1: 200, x2: 170, y2: 200, tone: 'exo', w: wd });
      s += V.token({ p: p, path: 'M350 200 L170 200', dur: 2.6, r: 11 }) + V.token({ p: p, path: 'M350 200 L170 200', dur: 2.6, begin: -1.3, r: 11 });
      s += V.pill(260, 70, 'TOPIRE · absoarbe ' + T.fmt(q, 0) + ' J', { tone: 'endo', w: 240, lower: true, h: 28 });
      s += V.pill(260, 236, 'SOLIDIFICARE · degajă ' + T.fmt(q, 0) + ' J', { tone: 'exo', w: 260, lower: true, h: 28 });
      s += '<text class="t-xl" x="260" y="156" text-anchor="middle">=</text>';
      s += '<text class="t-s t-m" x="260" y="276" text-anchor="middle">aceeași valoare a căldurii, în sensuri opuse</text>';
      holder.innerHTML = V.frame([W, H], s, 'Topirea absoarbe aceeași căldură pe care solidificarea o degajă');
      out.className = 'wd-out';
      out.innerHTML = T.rich('$|Q_{topire}| = |Q_{solidificare}| = ' + T.fmt(q, 0) + '$ J. Pentru sistem: la topire $Q > 0$ (absoarbe), la solidificare $Q < 0$ (degajă).');
    }
    var sl = T.slider({ label: 'Căldura schimbată', min: 500, max: 6000, step: 100, value: q, unit: 'J', dec: 0, onInput: function (v) { q = v; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, sl), holder, out);
    render();
  });
})(window);
