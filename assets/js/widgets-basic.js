/* =========================================================
   widgets-basic.js — sistem/mediu, semnul căldurii, conversii,
   primul principiu al termodinamicii
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  function arrow(x1, y1, x2, y2, cls, id, w) {
    return '<line class="wa ' + cls + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" style="stroke-width:' + (w || 4) + 'px" marker-end="url(#' + id + '-' + cls + ')"/>';
  }

  /* ---------------------------------------------------------
     Primul principiu: Q = ΔU + L  (și Q_V = ΔU, Q_P = ΔH)
     --------------------------------------------------------- */
  function cyl(x, yTop, yBot, pistonY, gasCls, pins) {
    var s = '<rect class="cyl" x="' + x + '" y="' + yTop + '" width="84" height="' + (yBot - yTop) + '" rx="4"/>';
    s += '<rect class="gas ' + (gasCls || '') + '" x="' + (x + 1.500) + '" y="' + pistonY + '" width="81" height="' + Math.max(2, yBot - pistonY - 1.500) + '"/>';
    s += '<rect class="piston" x="' + (x - 3) + '" y="' + (pistonY - 8) + '" width="90" height="8" rx="2"/><line class="piston-rod" x1="' + (x + 42) + '" y1="' + (pistonY - 8) + '" x2="' + (x + 42) + '" y2="' + (pistonY - 30) + '"/>';
    if (pins) s += '<rect class="pin" x="' + (x - 6) + '" y="' + (pistonY - 14) + '" width="14" height="20" rx="3"/><rect class="pin" x="' + (x + 76) + '" y="' + (pistonY - 14) + '" width="14" height="20" rx="3"/>';
    return s;
  }
  function hbar(x0, y, a, b, sc, cls) {
    var xa = x0 + a * sc, xb = x0 + b * sc;
    return '<rect class="hb ' + cls + '" x="' + Math.min(xa, xb) + '" y="' + y + '" width="' + Math.max(1, Math.abs(xb - xa)) + '" height="26" rx="4"/>';
  }

  T.widget('firstLaw', function (el, o) {
    var mode = (o && o.mode) || 'general';
    if (mode === 'compare') return compare(el);
    var body = T.shell(el, {
      title: 'Primul principiu: Q = ΔU + L',
      help: 'Căldura primită de sistem (Q) se împarte între variația energiei interne (ΔU) și lucrul mecanic efectuat (L). Mută cursoarele.'
    });
    var Q = 60, L = 20, id = T.uid('fl');
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    function draw() {
      var dU = Q - L;
      var piston = T.clamp(120 - L * 0.9, 56, 190);
      var hot = T.clamp(0.5 + dU / 240, 0, 1);
      var s = '<svg viewBox="0 0 450 290" role="img" aria-label="Cilindru cu piston și bare pentru Q, L și ΔU">' + T.svgs.defs(id);
      s += cyl(24, 40, 232, piston, hot > .55 ? 'hot' : hot < .45 ? 'cold' : '');
      if (Q > 3) s += arrow(66, 264, 66, 240, 'exo', id, 3 + Q / 25);
      else if (Q < -3) s += arrow(66, 240, 66, 264, 'endo', id, 3 + Math.abs(Q) / 25);
      s += '<text class="se-sm" x="66" y="284" text-anchor="middle">gazul din cilindru</text>';
      if (L > 3) s += arrow(128, piston - 6, 128, piston - 38, 'ea', id, 3 + L / 20) + '<text class="se-sm" x="138" y="' + (piston - 22) + '">L</text>';
      var x0 = 232, sc = 0.7, rows = [['Q (căldura primită)', Q, 'bq', 70], ['L (lucrul mecanic efectuat)', L, 'bl', 135], ['ΔU (variația energiei interne)', dU, 'bu', 200]];
      s += '<line class="ed-ax" x1="' + x0 + '" y1="50" x2="' + x0 + '" y2="236"/>';
      rows.forEach(function (r) {
        s += '<text class="se-sm" x="' + (x0 + 8) + '" y="' + (r[3] - 8) + '">' + r[0] + '</text>' + hbar(x0, r[3], 0, r[1], sc, r[2]);
        s += '<text class="se-val" x="' + (r[1] >= 0 ? x0 + r[1] * sc + 6 : x0 + r[1] * sc - 6) + '" y="' + (r[3] + 19) + '" text-anchor="' + (r[1] >= 0 ? 'start' : 'end') + '">' + (r[1] > 0 ? '+' : r[1] < 0 ? '−' : '') + Math.abs(r[1]) + '</text>';
      });
      holder.innerHTML = s + '</svg>';
      out.className = 'wd-out';
      out.innerHTML = T.rich('<b>$Q = ΔU + L$</b> &nbsp;⟹&nbsp; <b>' + T.fmt(Q, 0) + ' = ' + T.fmt(dU, 0) + ' + ' + T.fmt(L, 0) + '</b> kJ.<br>' +
        (dU > 0 ? '$ΔU > 0$: energia internă crește. ' : dU < 0 ? '$ΔU < 0$: energia internă scade. ' : '$ΔU = 0$: energia internă nu se schimbă. ') +
        (L > 0 ? 'Sistemul efectuează lucru mecanic ($L > 0$).' : 'Nu se efectuează lucru mecanic ($L = 0$).'));
    }
    var s1 = T.slider({ label: 'Q (căldura primită)', min: 0, max: 100, step: 5, value: Q, unit: 'kJ', onInput: function (v) { Q = v; draw(); } });
    var s2 = T.slider({ label: 'L (lucrul mecanic efectuat)', min: 0, max: 100, step: 5, value: L, unit: 'kJ', onInput: function (v) { L = v; draw(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, s1, s2), holder, out);
    draw();
  });

  function compare(el) {
    var body = T.shell(el, {
      title: 'Aceeași transformare, două moduri de a măsura căldura',
      help: 'Presupunem aceeași variație a energiei interne ΔU. La V = ct.: pΔV = 0 și Q_V = ΔU. La p = ct.: Q_P = ΔU + pΔV = ΔH.'
    });
    var dU = 50, pdV = 10, id = T.uid('fc');
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });
    function draw() {
      var QP = dU + pdV;
      var s = '<svg viewBox="0 0 520 300" role="img" aria-label="Comparație între căldura la volum constant și la presiune constantă">' + T.svgs.defs(id);
      var pv = T.clamp(112 - pdV * 1.6, 70, 150);
      s += '<text class="se-lbl sys" x="130" y="26" text-anchor="middle">V = ct. (piston blocat)</text><text class="se-lbl sys" x="390" y="26" text-anchor="middle">p = ct. (piston liber)</text>';
      s += cyl(88, 56, 168, 112, '', true) + cyl(348, 56, 168, pv, '');
      var sc = 1.1, y1 = 200, y2 = 200;
      var x0a = 130, x0b = 390;
      s += '<line class="ed-ax" x1="' + x0a + '" y1="190" x2="' + x0a + '" y2="262"/><line class="ed-ax" x1="' + x0b + '" y1="190" x2="' + x0b + '" y2="262"/>';
      s += hbar(x0a, 200, 0, dU, sc * 0.8, 'bu');
      s += hbar(x0b, 200, 0, dU, sc * 0.8, 'bu') + hbar(x0b, 200, dU, dU + pdV, sc * 0.8, 'bl');
      s += '<text class="se-sm" x="' + x0a + '" y="238" text-anchor="middle">ΔU = ' + T.fmt(dU, 0) + ' kJ</text>';
      s += '<text class="se-sm" x="' + x0b + '" y="238" text-anchor="middle">ΔU ' + (pdV >= 0 ? '+ ' : '− ') + 'pΔV = ' + T.fmt(dU, 0) + (pdV >= 0 ? ' + ' : ' − ') + T.fmt(Math.abs(pdV), 0) + '</text>';
      s += '<text class="se-val" x="' + x0a + '" y="274" text-anchor="middle">' + T.svgs.sub('Q', 'V') + '<tspan dy="-4.500"> = ΔU = ' + T.fmt(dU, 0) + ' kJ</tspan></text>';
      s += '<text class="se-val" x="' + x0b + '" y="274" text-anchor="middle">' + T.svgs.sub('Q', 'P') + '<tspan dy="-4.500"> = ΔH = ' + T.fmt(QP, 0) + ' kJ</tspan></text>';
      holder.innerHTML = s + '</svg>';
      out.innerHTML = T.rich('<b>La $V = ct.$:</b> $pΔV = 0$ ⟹ $Q_V = ΔU = ' + T.fmt(dU, 0) + '$ kJ.<br><b>La $p = ct.$:</b> $Q_P = ΔU + pΔV = ' + T.fmt(dU, 0) + (pdV >= 0 ? ' + ' : ' − ') + T.fmt(Math.abs(pdV), 0) + ' = ' + T.fmt(QP, 0) + '$ kJ $= ΔH$.<br>' +
        (Math.abs(pdV) < 0.5 ? 'Cu $pΔV = 0$: $Q_P = Q_V$.' : 'Cu $pΔV > 0$: $Q_P = ΔU + pΔV > Q_V = ΔU$.'));
    }
    var s1 = T.slider({ label: 'ΔU (variația energiei interne)', min: -100, max: 100, step: 5, value: dU, unit: 'kJ', onInput: function (v) { dU = v; draw(); } });
    var s2 = T.slider({ label: 'pΔV (lucrul mecanic)', min: 0, max: 30, step: 2, value: pdV, unit: 'kJ', onInput: function (v) { pdV = v; draw(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, s1, s2), holder, out);
    draw();
  }
})(window);
