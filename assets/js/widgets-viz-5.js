/* =========================================================
   widgets-viz-5.js — ecuația ca „rețetă” (lecția 7) și ilustrațiile de lecție
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;

  /* ---------------------------------------------------------
     Lecția 7 — ecuația termochimică se citește ca o rețetă, iar regula de trei înseamnă „același factor”
     --------------------------------------------------------- */
  var CALC = ['termita', 'carbon', 'metan', 'glucoza', 'etan'];
  T.widget('moleScale', function (el, o) {
    var body = T.shell(el, {
      title: 'Ecuația ca o rețetă: același factor pentru tot',
      help: 'Ecuația spune ce se întâmplă pentru cantitățile din ecuație („pe ecuație”). Pentru alte cantități, <b>totul se înmulțește cu același factor $k$</b>: moli, grame și căldură. Asta este regula de trei din caiet.'
    });
    var S = { r: (o && o.rxn) || 'termita', k: 2 };
    var host = T.h('div');
    function species(r) { return r.L.map(function (q) { return { nu: q[0], f: q[1], side: 'L' }; }).concat(r.R.map(function (q) { return { nu: q[0], f: q[1], side: 'R' }; })); }
    function nm(f) { return f.replace(/\((s|l|g|aq)\)$/, ''); }
    function render() {
      var r = T.RXN[S.r], k = S.k, rows = species(r), exo = r.type === 'exo';
      var h = '<div class="ms"><div class="ms-h"><span></span><span>pe ecuație</span><span>pe date &nbsp;(× ' + T.fmt(k, 2) + ')</span></div>';
      function row(label, tone, eqTxt, dtTxt) {
        var w = Math.min(100, 20 * k);
        return '<div class="ms-row"><span class="ms-f">' + label + '</span>' +
          '<span class="ms-c"><i class="eq ' + tone + '" style="width:20%"></i><small>' + eqTxt + '</small></span>' +
          '<span class="ms-c"><i class="dt ' + tone + '" style="width:' + w + '%"></i>' + (20 * k > 100 ? '<em>›</em>' : '') + '<small>' + dtTxt + '</small></span></div>';
      }
      rows.forEach(function (x) {
        var M = T.massOf(x.f), gas = T.isGas(x.f);
        var eqT = T.fmt(x.nu, 2) + ' mol · ' + T.fmt(x.nu * M, 1) + ' g', dtT = T.fmt(x.nu * k, 2) + ' mol · ' + T.fmt(x.nu * M * k, 1) + ' g';
        if (gas) { eqT += ' · ' + T.fmt(x.nu * 22.4, 1) + ' L'; dtT += ' · ' + T.fmt(x.nu * k * 22.4, 1) + ' L'; }
        h += row(T.rich('[[' + nm(x.f) + ']]') + '<sub class="ms-sd">' + (x.side === 'L' ? 'reactant' : 'produs') + '</sub>', x.side === 'L' ? 'l' : 'r', eqT, dtT);
      });
      var qeq = r.Q == null ? null : r.Q;
      if (qeq != null) h += row('<b class="tag-' + r.type + '">Q</b><sub class="ms-sd">' + (exo ? 'degajată' : 'absorbită') + '</sub>', 'q', T.fmt(qeq, 1) + ' kJ', T.fmt(qeq * k, 1) + ' kJ');
      h += '</div>';
      host.innerHTML = '<div class="eqn ' + r.type + '">' + T.rich(T.eqStr(r)) + '</div>' + h +
        '<div class="wd-out ' + r.type + '">' + T.rich('Cantitățile din a doua coloană sunt cele din prima, înmulțite cu <b>$k = ' + T.fmt(k, 2) + '$</b>. De aceea: $x = (dat · Q_{ec})//(pe ecuație)$ — raportul dat/ecuație este chiar $k$.') + '</div>';
    }
    var keys = CALC.indexOf(S.r) < 0 ? [S.r].concat(CALC) : CALC;
    var sel = T.h('select', { class: 'inp', 'aria-label': 'Reacția' }, keys.map(function (k) { return T.h('option', { value: k, text: T.uni(T.RXN[k].name), selected: k === S.r ? true : null }); }));
    sel.addEventListener('change', function () { S.r = sel.value; render(); });
    var sl = T.slider({ label: 'Factorul $k$ (de câte ori mai mult / mai puțin decât în ecuație)', min: .25, max: 5, step: .25, value: S.k, dec: 2, onInput: function (v) { S.k = v; render(); } });
    body.append(T.h('div', { class: 'wd-row' }, sel), T.h('div', { class: 'wd-ctrl' }, sl), host);
    render();
  });
})(window);
