/* =========================================================
   svgs.js — desene SVG reutilizabile (diagrame de entalpie etc.)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  T.svgs = {};

  // marcaje de săgeată (culori din CSS)
  T.svgs.defs = function (id) {
    var h = '<defs>';
    ['ink', 'exo', 'endo', 'ea', 'ok'].forEach(function (k) {
      h += '<marker id="' + id + '-' + k + '" viewBox="0 0 10 10" refX="8.500" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk-' + k + '"/></marker>';
    });
    return h + '</defs>';
  };

  var S = function (base, sub, sup, after) {       // text SVG cu indice / exponent (+ text după, pe linia de bază)
    var s = base, dy = 0;
    if (sub) { s += '<tspan class="sb" dy="4.500">' + sub + '</tspan>'; dy += 4.5; }
    if (sup) { var d = sub ? -10 : -6; s += '<tspan class="sp" dy="' + d + '">' + sup + '</tspan>'; dy += d; }
    if (after) s += '<tspan dy="' + (-dy) + '">' + after + '</tspan>';
    return s;
  };
  T.svgs.sub = S;
  T.svgs.EG = { oy: 348, sc: 2.98 };   // geometrie: H (0..100) → y

  /**
   * Diagrama entalpiei în funcție de coordonata de reacție.
   * o: {HR, HP, HCA (0..100), neutral, labels, ea, dh, caption, marks, vals:{HR,HP,HCA} (text), ylabel}
   */
  T.svgs.energy = function (opt) {
    var o = Object.assign({ HR: 25, HP: 55, HCA: 80, labels: true, ea: true, dh: true, caption: true, neutral: false, marks: null, ca: true, plateauNames: true, cls: '', vals: null, ball: false }, opt || {});
    var id = o.id || T.uid('ed');
    var HCA = Math.max(o.HCA, Math.max(o.HR, o.HP) + 6);
    var ox = o.vals ? 132 : 78, W = ox + 562, H = 400, oy = T.svgs.EG.oy, sc = T.svgs.EG.sc;
    var Y = function (h) { return +(oy - h * sc).toFixed(1); };
    var yR = Y(o.HR), yP = Y(o.HP), yC = Y(HCA);
    var x0 = ox + 16, xr = ox + 137, xp = ox + 262, xps = ox + 387, xe = ox + 507, xea = ox + 64, xdh = ox + 457;
    var dH = o.HP - o.HR;
    var type = Math.abs(dH) < 0.5 ? 'zero' : (dH > 0 ? 'endo' : 'exo');
    var tcls = o.neutral ? 'ink' : (type === 'zero' ? 'ink' : type);

    var d = 'M' + x0 + ' ' + yR + ' L' + xr + ' ' + yR +
      ' C' + (xr + 62) + ' ' + yR + ' ' + (xp - 52) + ' ' + yC + ' ' + xp + ' ' + yC +
      ' C' + (xp + 52) + ' ' + yC + ' ' + (xps - 62) + ' ' + yP + ' ' + xps + ' ' + yP +
      ' L' + xe + ' ' + yP;

    var s = '<svg class="ed ' + o.cls + '" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Diagramă de entalpie în funcție de coordonata de reacție" xmlns="http://www.w3.org/2000/svg">';
    s += T.svgs.defs(id);

    // axe
    s += '<line class="ed-ax" x1="' + ox + '" y1="' + oy + '" x2="' + ox + '" y2="22" marker-end="url(#' + id + '-ink)"/>';
    s += '<line class="ed-ax" x1="' + ox + '" y1="' + oy + '" x2="' + (W - 20) + '" y2="' + oy + '" marker-end="url(#' + id + '-ink)"/>';
    s += '<text class="ed-t b" x="' + (ox - 12) + '" y="30" text-anchor="end">H' + (o.vals ? ' (kJ/mol)' : '') + '</text>';
    s += '<text class="ed-t m" x="' + ((ox + W - 20) / 2) + '" y="' + (oy + 36) + '" text-anchor="middle">coordonata de reacție</text>';
    s += '<text class="ed-t m" x="' + (W - 28) + '" y="' + (oy + 18) + '" text-anchor="end">R → P</text>';

    // ghidaje punctate
    s += '<line class="ed-guide" x1="' + ox + '" y1="' + yR + '" x2="' + (xdh + 16) + '" y2="' + yR + '"/>';
    s += '<line class="ed-guide" x1="' + ox + '" y1="' + yP + '" x2="' + xps + '" y2="' + yP + '"/>';
    s += '<line class="ed-guide" x1="' + ox + '" y1="' + yC + '" x2="' + xp + '" y2="' + yC + '"/>';

    // curba
    s += '<path class="ed-curve ' + tcls + '" d="' + d + '" fill="none"/>';
    if (o.ca) s += '<circle class="ed-peak ' + tcls + '" cx="' + xp + '" cy="' + yC + '" r="5"/>';

    // etichete pe axa H (cu evitarea suprapunerilor)
    if (o.labels) {
      var v = o.vals || {};
      var lv = [{ y: yC, t: S('H', 'CA', '*', v.HCA != null ? ' = ' + v.HCA : '') }, { y: yR, t: S('H', 'R', null, v.HR != null ? ' = ' + v.HR : '') }, { y: yP, t: S('H', 'P', null, v.HP != null ? ' = ' + v.HP : '') }]
        .sort(function (a, b) { return a.y - b.y; });
      lv.forEach(function (l, i) { l.ly = l.y + 5; if (i && l.ly - lv[i - 1].ly < 17) l.ly = lv[i - 1].ly + 17; });
      lv.forEach(function (l) {
        s += '<line class="ed-tick" x1="' + (ox - 6) + '" y1="' + l.y + '" x2="' + ox + '" y2="' + l.y + '"/>';
        s += '<text class="ed-t" x="' + (ox - 12) + '" y="' + l.ly + '" text-anchor="end">' + l.t + '</text>';
      });
      if (o.ca) s += '<text class="ed-t b" x="' + xp + '" y="' + (yC - 14) + '" text-anchor="middle">CA<tspan class="sp" dy="-6">*</tspan></text>';
      if (o.plateauNames) {
        s += '<text class="ed-t m" x="' + ((x0 + xr) / 2 + 26) + '" y="' + (yR + (type === 'exo' ? -10 : 19)) + '" text-anchor="middle">reactanți</text>';
        s += '<text class="ed-t m" x="' + ((xps + xe) / 2 - 22) + '" y="' + (yP + (type === 'exo' ? 19 : -10)) + '" text-anchor="middle">produși</text>';
      }
    }

    // E_a
    if (o.ea) {
      s += '<line class="ed-ea" x1="' + xea + '" y1="' + yR + '" x2="' + xea + '" y2="' + yC + '" marker-start="url(#' + id + '-ea)" marker-end="url(#' + id + '-ea)"/>';
      if (o.labels) s += '<text class="ed-t ea" x="' + (xea + 9) + '" y="' + ((yR + yC) / 2 + 5) + '">' + S('E', 'a') + '</text>';
    }
    // ΔH
    if (o.dh && Math.abs(yP - yR) >= 9) {
      s += '<line class="ed-dh ' + tcls + '" x1="' + xdh + '" y1="' + yR + '" x2="' + xdh + '" y2="' + yP + '" marker-end="url(#' + id + '-' + tcls + ')"/>';
      if (o.labels) s += '<text class="ed-t dh ' + tcls + '" x="' + (xdh + 10) + '" y="' + ((yR + yP) / 2 + 5) + '">ΔH</text>';
    } else if (o.dh && o.labels) {
      s += '<text class="ed-t dh ink" x="' + (xdh - 10) + '" y="' + (yP - 12) + '" text-anchor="end">ΔH ≈ 0</text>';
    }

    // marcaje pentru întrebări (litere pe segmente)
    if (o.marks) {
      o.marks.forEach(function (m) {
        var ya = Y(m.a), yb = Y(m.b), ym = (ya + yb) / 2, mx = ox + m.x;
        s += '<line class="ed-mark" x1="' + mx + '" y1="' + ya + '" x2="' + mx + '" y2="' + yb + '" marker-start="url(#' + id + '-ink)" marker-end="url(#' + id + '-ink)"/>';
        s += '<circle class="ed-mark-c" cx="' + mx + '" cy="' + ym + '" r="12"/><text class="ed-t b" x="' + mx + '" y="' + (ym + 5) + '" text-anchor="middle">' + m.label + '</text>';
      });
    }

    if (o.caption) {
      var cap = o.caption === true
        ? (type === 'endo' ? 'reacție endotermă · ΔH > 0' : type === 'exo' ? 'reacție exotermă · ΔH < 0' : 'ΔH ≈ 0')
        : o.caption;
      s += '<text class="ed-t cap ' + tcls + '" x="' + (ox + 18) + '" y="34">' + cap + '</text>';
    }
    if (o.ball) s += '<circle class="ed-ball" cx="' + x0 + '" cy="' + (yR - 10) + '" r="9"/>';
    return s + '</svg>';
  };

  /** termometru mic (0..1) — pentru ilustrații */
  T.svgs.thermo = function (level, color) {
    var l = T.clamp(level, 0, 1), top = 8, bot = 64, y = bot - (bot - top) * l;
    return '<svg class="thermo" viewBox="0 0 28 86" width="28" height="86" aria-hidden="true"><rect x="9" y="4" width="10" height="64" rx="5" class="th-g"/>' +
      '<rect x="11.500" y="' + y + '" width="5" height="' + (bot - y + 6) + '" rx="2.500" fill="' + color + '"/><circle cx="14" cy="72" r="9" fill="' + color + '"/></svg>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
