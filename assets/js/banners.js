/* =========================================================
   banners.js — câte o ilustrație pentru fiecare lecție
   (pentru antetul lecției și pentru cardurile de pe pagina de start)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;
  T.banners = {};

  function wrap(p, inner) {
    return '<svg class="vz bn" viewBox="0 0 160 110" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">' + V.defs(p) + V.atomDefs(p, ['A', 'B', 'X', 'Y']) +
      '<defs><pattern id="' + p + '-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="var(--paper-2)"/><line x1="0" y1="0" x2="0" y2="8" stroke="var(--line-2)" stroke-width="3.4"/></pattern></defs>' +
      '<rect x="1" y="1" width="158" height="108" rx="14" fill="var(--il-env)" stroke="var(--il-env-line)" stroke-width="2"/><rect x="1" y="1" width="158" height="108" rx="14" fill="url(#' + p + '-grid)"/>' + inner + '</svg>';
  }
  function box(x, y, w, h, tone) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="9" style="fill:' + V.mix(tone === 'exo' ? 'var(--exo)' : 'var(--endo)', 38) + '" stroke="var(--il-edge)" stroke-width="2.2"/>'; }
  function lbl(x, y, t, cls) { return '<text class="t-s ' + (cls || 't-m') + '" x="' + x + '" y="' + y + '" text-anchor="middle" style="font-size:10px;font-weight:700">' + t + '</text>'; }

  var B = {
    intro: function (p) {
      var bk = V.beaker({ p: p, x: 54, y: 32, w: 52, h: 56, r: 8, level: .6, tone: 'exo', bubbles: true, nBub: 5, id: p + 'b' });
      return '<rect class="v-sys" x="34" y="12" width="92" height="86" rx="16"/>' + bk.svg + V.flow({ x1: 34, y1: 56, x2: 6, y2: 56, tone: 'exo', w: 5 }) + V.flow({ x1: 126, y1: 56, x2: 154, y2: 56, tone: 'exo', w: 5 });
    },
    caldura: function (p) {
      return V.flame({ p: p, x: 48, y: 98, s: .72, on: true }) + V.thermo({ x: 116, y: 12, h: 62, level: .85, color: 'var(--exo)', id: p + 't' }) +
        V.token({ p: p, x: 84, y: 36, r: 12 }) + '<path d="M72 50 q-2 14 -12 20" fill="none" stroke="var(--il-gold)" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/>';
    },
    marimi: function (p) {
      return V.flow({ x1: 4, y1: 56, x2: 22, y2: 56, tone: 'gold', w: 4 }) + '<rect x="22" y="32" width="54" height="46" rx="10" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="2.4"/>' +
        '<text class="t-b" x="49" y="60" text-anchor="middle" style="font-size:13px">C, c</text>' + V.thermo({ x: 108, y: 12, h: 64, level: .6, color: 'var(--exo)', id: p + 't' }) +
        '<path d="M127 40 h7 v22 h-7" fill="none" stroke="#b07d00" stroke-width="2.6" stroke-linecap="round"/><text class="t-b t-gold" x="146" y="55" text-anchor="middle" style="font-size:11px">1 K</text>';
    },
    principii: function (p) {
      return '<rect x="8" y="10" width="144" height="90" rx="14" fill="url(#' + p + '-hatch)" stroke="var(--il-edge)" stroke-width="2"/><rect x="17" y="19" width="126" height="72" rx="8" fill="var(--paper)"/>' +
        box(26, 36, 40, 44, 'exo') + box(94, 36, 40, 44, 'endo') + V.flow({ x1: 68, y1: 58, x2: 92, y2: 58, tone: 'exo', w: 5 }) + lbl(46, 31, 'Q₁ < 0', 't-exo') + lbl(114, 31, 'Q₂ > 0', 't-endo');
    },
    principiul1: function (p) {
      var cy = V.cylinder({ p: p, x: 16, y: 18, w: 52, h: 60, id: p + 'cy', n: 8, load: false });
      return cy.svg + V.flame({ p: p, x: 42, y: 100, s: .46, on: true }) +
        '<path d="M76 46 h12 v20 h-12z" fill="url(#' + p + '-gold)" stroke="#b07d00" stroke-width="1.6"/>' +
        '<path d="M88 46 C108 46 114 30 148 30 L148 42 C114 42 108 56 88 56Z" style="fill:' + V.mix('var(--endo)', 82, 'transparent') + '" stroke="var(--endo)" stroke-width="1.4"/>' +
        '<path d="M88 56 C108 56 114 78 148 78 L148 92 C114 92 108 66 88 66Z" style="fill:' + V.mix('var(--exo)', 82, 'transparent') + '" stroke="var(--exo)" stroke-width="1.4"/>' +
        lbl(120, 24, 'L', 't-endo') + lbl(120, 106, 'ΔU', 't-exo') + lbl(82, 38, 'Q', 't-gold');
    },
    'exo-endo': function (p) {
      var a = V.beaker({ p: p, x: 20, y: 44, w: 44, h: 48, r: 8, level: .62, tone: 'exo', bubbles: true, nBub: 4, id: p + 'a' });
      var b = V.beaker({ p: p, x: 96, y: 44, w: 44, h: 48, r: 8, level: .62, tone: 'endo', id: p + 'b' });
      return a.svg + b.svg + V.flow({ x1: 42, y1: 38, x2: 42, y2: 10, tone: 'exo', w: 5 }) + V.flow({ x1: 118, y1: 10, x2: 118, y2: 38, tone: 'endo', w: 5 });
    },
    'ec-termo': function (p) {
      return V.atom({ p: p, x: 22, y: 62, r: 14, k: 'A', text: 'A' }) + V.atom({ p: p, x: 52, y: 62, r: 14, k: 'B', text: 'B' }) +
        '<path d="M70 62 H88" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round"/><path d="M82 55 L92 62 L82 69" fill="none" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
        V.bond(112, 62, 138, 62, { w: 7 }) + V.atom({ p: p, x: 112, y: 62, r: 14, k: 'A', text: 'A' }) + V.atom({ p: p, x: 138, y: 62, r: 14, k: 'B', text: 'B' }) +
        V.token({ p: p, x: 125, y: 26, r: 12 });
    },
    'legaturi-stari': function (p) {
      return V.atom({ p: p, x: 28, y: 30, r: 13, k: 'A', text: 'A' }) + V.atom({ p: p, x: 80, y: 30, r: 13, k: 'B', text: 'B' }) + V.bond(41, 30, 67, 30, { w: 5, dash: '2 8' }) +
        V.token({ p: p, x: 54, y: 30, r: 9 }) + '<text class="t-s t-m" x="104" y="34" style="font-size:10px;font-weight:700">rupere</text>' +
        V.ice({ p: p, x: 22, y: 62, s: 26 }) + '<path d="M60 80 H80" stroke="var(--ink-2)" stroke-width="3.4" stroke-linecap="round"/><path d="M75 74 L83 80 L75 86" fill="none" stroke="var(--ink-2)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M110 64 C116 74 124 78 124 88 C124 96 118 100 110 100 C102 100 96 96 96 88 C96 78 104 74 110 64Z" style="fill:' + V.mix('var(--endo)', 52) + '" stroke="var(--endo)" stroke-width="2.4"/>';
    },
    entalpie: function (p) {
      var a = V.cylinder({ p: p, x: 14, y: 20, w: 46, h: 58, id: p + 'a', n: 6, load: false, stops: true });
      var b = V.cylinder({ p: p, x: 98, y: 20, w: 46, h: 58, id: p + 'b', n: 6, load: false });
      return { svg: a.svg + b.svg + V.flame({ p: p, x: 37, y: 100, s: .42, on: true }) + V.flame({ p: p, x: 121, y: 100, s: .42, on: true }) + lbl(37, 14, 'V = ct.', 't-b') + lbl(121, 14, 'p = ct.', 't-b'),
        post: function (root) { a.set(root, 0, .5); b.set(root, .8, .5); } };
    },
    diagrame: function (p) {
      return '<line x1="20" y1="94" x2="20" y2="12" stroke="var(--ink-2)" stroke-width="2.4"/><line x1="20" y1="94" x2="150" y2="94" stroke="var(--ink-2)" stroke-width="2.4"/>' +
        '<line x1="20" y1="32" x2="86" y2="32" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="20" y1="58" x2="150" y2="58" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 4"/><line x1="20" y1="84" x2="150" y2="84" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 4"/>' +
        '<path d="M24 58 H48 C62 58 66 32 86 32 C106 32 110 84 126 84 H148" fill="none" stroke="var(--exo)" stroke-width="4.4" stroke-linecap="round"/>' +
        '<circle cx="86" cy="22" r="8" fill="var(--accent)" stroke="var(--paper)" stroke-width="2"/>' +
        '<line x1="34" y1="58" x2="34" y2="32" stroke="#b07d00" stroke-width="2.4"/><path d="M34 32 l-4 7 h8z" fill="#b07d00"/><text class="t-b t-gold" x="44" y="50" style="font-size:11px">Ea</text>' +
        '<line x1="138" y1="58" x2="138" y2="84" stroke="var(--exo)" stroke-width="2.4" stroke-dasharray="3 3"/><path d="M138 84 l-4 -7 h8z" fill="var(--exo)"/>';
    },
    formare: function (p) {
      var s = '<line x1="12" y1="24" x2="148" y2="24" stroke="var(--ink-2)" stroke-width="2.4" stroke-dasharray="6 4"/>' + lbl(80, 16, 'elemente: ΔHf = 0', 't-b');
      [[28, 28, 'var(--endo)'], [62, 52, 'var(--ok)'], [96, 74, '#8b5cf6'], [130, 46, '#d9a400']].forEach(function (b) {
        s += '<rect x="' + (b[0] - 11) + '" y="24" width="22" height="' + b[1] + '" rx="4" style="fill:' + V.mix(b[2], 72, 'transparent') + '" stroke="' + b[2] + '" stroke-width="2"/>';
      });
      return s + '<path d="M62 104 l-5 -9 h10z" fill="var(--ok)"/><text class="t-s t-m" x="72" y="104" style="font-size:10px;font-weight:700">mai stabilă</text>';
    },
    hess: function (p) {
      var s = '<path d="M16 24 H44 V46 H72 V68 H100 V90 H146" fill="none" stroke="var(--ink)" stroke-width="4.2" stroke-linejoin="round" stroke-linecap="round"/>';
      s += '<path d="M24 20 L138 84" stroke="var(--exo)" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round" fill="none"/><path d="M138 84 l-11 -3 l5 -9z" fill="var(--exo)"/>';
      return s + lbl(34, 16, 'A+B', 't-b') + lbl(132, 104, 'C+D', 't-b') + '<circle cx="44" cy="46" r="4.6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4"/><circle cx="72" cy="68" r="4.6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4"/><circle cx="100" cy="90" r="4.6" fill="var(--paper)" stroke="var(--ink)" stroke-width="2.4"/>';
    }
  };


  /* ilustrația mare de pe pagina de start */
  T.heroArt = function () {
    var p = V.uid('hr');
    var bk = V.beaker({ p: p, x: 44, y: 118, w: 146, h: 150, r: 14, level: .62, tone: 'exo', bubbles: true, nBub: 11, id: p + 'bk', seed: 21 });
    var s = '<svg class="vz hero-svg" viewBox="0 0 440 320" role="img" aria-label="Un pahar în care are loc o reacție exotermă, curbele de entalpie și o bucată de gheață care se topește" xmlns="http://www.w3.org/2000/svg">' + V.defs(p) + V.atomDefs(p, ['A', 'B']);
    s += V.panel(p, 440, 320);
    s += '<ellipse cx="118" cy="196" rx="120" ry="104" fill="url(#' + p + '-gx)"/>';
    s += V.table(20, 270, 200, 14);
    s += bk.svg + V.thermo({ x: 168, y: 112, h: 90, level: .85, color: 'var(--exo)', id: p + 't', ticks: false });
    s += V.flow({ x1: 118, y1: 112, x2: 118, y2: 56, tone: 'exo', w: 8 }) + V.token({ p: p, path: 'M118 112 L118 56', dur: 2.4, r: 11 });
    s += V.flow({ x1: 40, y1: 196, x2: 8, y2: 196, tone: 'exo', w: 6 });
    s += V.pill(118, 36, 'Q', { tone: 'gold', w: 40, h: 28, lower: true });
    // curbele de entalpie
    s += '<rect x="236" y="26" width="182" height="148" rx="16" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/>';
    s += '<line x1="256" y1="148" x2="256" y2="42" stroke="var(--ink-2)" stroke-width="2.2"/><line x1="256" y1="148" x2="406" y2="148" stroke="var(--ink-2)" stroke-width="2.2"/>';
    s += '<text class="t-b" x="248" y="52" text-anchor="end">H</text><text class="t-s t-m" x="404" y="164" text-anchor="end">R → P</text>';
    s += '<line x1="256" y1="96" x2="404" y2="96" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 4"/>';
    s += '<path d="M262 96 H292 C318 96 322 56 338 56 C354 56 356 130 380 130 H402" fill="none" stroke="var(--exo)" stroke-width="4" stroke-linecap="round"/>';
    s += '<path d="M262 96 H292 C312 96 320 46 338 46 C356 46 358 68 380 68 H402" fill="none" stroke="var(--endo)" stroke-width="4" stroke-linecap="round"/>';
    s += '<text class="t-s t-b t-exo" x="402" y="146" text-anchor="end" style="font-size:11px">exotermă · ΔH &lt; 0</text><text class="t-s t-b t-endo" x="402" y="60" text-anchor="end" style="font-size:11px">endotermă · ΔH &gt; 0</text>';
    // gheață → apă
    s += V.ice({ p: p, x: 252, y: 214, s: 46 });
    s += '<path d="M312 244 H340" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round"/><path d="M334 236 L344 244 L334 252" fill="none" stroke="var(--ink-2)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<path d="M382 214 C392 230 404 238 404 254 C404 268 394 276 382 276 C370 276 360 268 360 254 C360 238 372 230 382 214Z" style="fill:' + V.mix('var(--endo)', 52) + '" stroke="var(--endo)" stroke-width="3"/><path d="M372 250 q0 12 10 18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"/>';
    s += V.flame({ p: p, x: 330, y: 300, s: .0001, on: false });
    return s + '</svg>';
  };

  T.banner = function (id) {
    var fn = B[id];
    if (!fn) return '';
    var p = V.uid('bn'), r = fn(p), inner = typeof r === 'string' ? r : r.svg;
    var holder = document.createElement('div');
    holder.innerHTML = wrap(p, inner);
    if (r && r.post) r.post(holder);
    return holder.innerHTML;
  };
})(window);
