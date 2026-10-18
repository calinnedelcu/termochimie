/* =========================================================
   widgets-viz-4.js — scene ilustrate pentru lecțiile 9–10
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T, V = T.viz;
  var oldFirstLaw = T.widgets.firstLaw;

  /* ---------------------------------------------------------
     Lecția 9 — Q_V (volum constant) și Q_P (presiune constantă)
     --------------------------------------------------------- */
  T.widget('firstLaw', function (el, o) {
    if (!(o && o.mode === 'compare')) return oldFirstLaw(el, o);
    var body = T.shell(el, {
      title: 'Aceeași transformare, două moduri de a măsura căldura',
      help: 'Aceeași variație a energiei interne $ΔU$. La <b>volum constant</b> pistonul e blocat: $pΔV = 0$, deci $Q_V = ΔU$. La <b>presiune constantă</b> pistonul se poate ridica: $Q_P = ΔU + pΔV = ΔH$.'
    });
    var p = V.uid('qv'), W = 520, H = 372, dU = 50, pdV = 20;
    var L = V.cylinder({ p: p, x: 54, y: 84, w: 112, h: 146, id: p + 'L', n: 12, stops: true });
    var R = V.cylinder({ p: p, x: 354, y: 84, w: 112, h: 146, id: p + 'R', n: 12 });
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });
    function scene() {
      var s = V.defs(p) + V.panel(p, W, H);
      s += V.table(30, 262, 160, 12) + V.table(330, 262, 160, 12);
      s += L.svg + R.svg;
      [110, 410].forEach(function (cx, i) {
        s += '<rect x="' + (cx - 24) + '" y="246" width="48" height="16" rx="6" fill="url(#' + p + '-metal)" stroke="var(--il-edge)" stroke-width="1.8"/>';
        s += V.flame({ p: p, x: cx, y: 246, s: .5, on: true });
      });
      s += V.pill(110, 40, 'V = ct. · piston blocat', { tone: 'ink', w: 190, lower: true, h: 28 }) + V.pill(410, 40, 'p = ct. · piston liber', { tone: 'ink', w: 190, lower: true, h: 28 });
      s += '<g id="' + p + '-bars"></g>';
      return V.frame([W, H], s, 'Două cilindre încălzite: unul cu piston blocat (volum constant), altul cu piston liber (presiune constantă)');
    }
    holder.innerHTML = scene();
    var svg = holder.querySelector('svg');
    function render() {
      var k = 1.3, QP = dU + pdV;
      L.set(svg, 0, dU / 100); R.set(svg, pdV / 40, dU / 100);
      svg.querySelector('#' + p + '-bars').innerHTML =
        '<rect x="40" y="286" width="' + V.f(dU * k) + '" height="24" rx="6" fill="var(--exo)"/><text class="t-b" x="48" y="303" style="fill:#fff">ΔU</text>' +
        '<text class="t-b t-exo" x="40" y="334">Q<tspan class="sb" dy="3">V</tspan><tspan dy="-3"> = ΔU = ' + T.fmt(dU, 0) + ' kJ</tspan></text><text class="t-s t-m" x="40" y="354">(pΔV = 0: pistonul nu se mișcă)</text>' +
        '<rect x="320" y="286" width="' + V.f(dU * k) + '" height="24" rx="6" fill="var(--exo)"/><text class="t-b" x="328" y="303" style="fill:#fff">ΔU</text>' +
        (pdV > 0 ? '<rect x="' + V.f(320 + dU * k) + '" y="286" width="' + V.f(pdV * k) + '" height="24" rx="6" fill="#d9a400"/>' + (pdV >= 8 ? '<text class="t-b" x="' + V.f(320 + dU * k + 6) + '" y="303" style="fill:#3a2f00">pΔV</text>' : '') : '') +
        '<text class="t-b t-gold" x="320" y="334">Q<tspan class="sb" dy="3">P</tspan><tspan dy="-3"> = ΔU + pΔV</tspan></text><text class="t-b t-gold" x="320" y="354">= ' + T.fmt(dU, 0) + ' + ' + T.fmt(pdV, 0) + ' = ' + T.fmt(QP, 0) + ' kJ  (= ΔH)</text>';
      out.className = 'wd-out';
      out.innerHTML = T.rich('<b>La $V = ct.$:</b> $pΔV = 0$ ⟹ $Q_V = ΔU = ' + T.fmt(dU, 0) + '$ kJ.<br><b>La $p = ct.$:</b> $Q_P = ΔU + pΔV = ' + T.fmt(dU, 0) + ' + ' + T.fmt(pdV, 0) + ' = ' + T.fmt(QP, 0) + '$ kJ $= ΔH$.' +
        (pdV === 0 ? '<br>Fără lucru mecanic ($pΔV = 0$), $Q_P = Q_V$.' : '<br>La presiune constantă, o parte din căldură se duce în lucrul mecanic $pΔV$ ⟹ $Q_P > Q_V$.'));
    }
    var s1 = T.slider({ label: '$ΔU$ (variația energiei interne)', min: 10, max: 100, step: 5, value: dU, unit: 'kJ', dec: 0, onInput: function (v) { dU = v; render(); } });
    var s2 = T.slider({ label: '$pΔV$ (lucrul mecanic)', min: 0, max: 40, step: 2, value: pdV, unit: 'kJ', dec: 0, onInput: function (v) { pdV = v; render(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, s1, s2), holder, out);
    render();
  });

  /* ---------------------------------------------------------
     Lecția 10 — drumul reacției: diagrama de entalpie + molecule
     --------------------------------------------------------- */
  T.widget('reactionPath', function (el) {
    var body = T.shell(el, {
      title: 'Drumul reacției: ciocnire și complex activat',
      help: 'Moleculele se ciocnesc. Dacă energia ciocnirii este <b>cel puțin egală cu $E_a$</b>, urcă „dealul” până la complexul activat ($CA^*$): legăturile vechi se rup și se formează legături noi. Dacă nu, rămân neschimbate. Alege tipul reacției, energia ciocnirii și apasă „Ciocnește”.'
    });
    var p = V.uid('rp'), W = 560, H = 472, kind = 'exo', ek = 130, prog = 0, anim = null, msg = '';
    var holder = T.h('div'), out = T.h('div', { class: 'wd-out' });
    var KEYS = ['A', 'B', 'X', 'Y'], NAMES = ['A', 'B', 'C', 'D'];
    function lv() { return kind === 'exo' ? { HR: 60, HP: 22, HCA: 88 } : { HR: 22, HP: 60, HCA: 90 }; }
    function Hof(pp, L) {
      var u = T.clamp((pp - .36) / .28, 0, 1), sm = u * u * (3 - 2 * u), base = L.HR + (L.HP - L.HR) * sm, A = L.HCA - (L.HR + (L.HP - L.HR) / 2);
      return base + A * Math.exp(-Math.pow((pp - .5) / .15, 2));
    }
    var X0 = 96, X1 = 496, Y0 = 214;
    function X(pp) { return X0 + (X1 - X0) * pp; }
    function Y(h) { return Y0 - h * 1.8; }
    var SC = 1.3;
    function sc2(a) { return a.map(function (q) { return [q[0] * SC, q[1] * SC]; }); }
    var P0 = sc2([[-24, -46], [24, -46], [-24, 46], [24, 46]]), PC = sc2([[-24, -24], [24, -24], [-24, 24], [24, 24]]), P2 = sc2([[-78, -24], [78, -24], [-78, 24], [78, 24]]);
    function lerp(a, b, t) { return a + (b - a) * t; }

    function staticScene() {
      var L = lv(), tcls = kind, col = kind === 'exo' ? 'var(--exo)' : 'var(--endo)';
      var s = V.defs(p) + V.atomDefs(p, KEYS) + V.panel(p, W, H, 'var(--paper-2)');
      s += '<line class="ed-ax" x1="' + X0 + '" y1="' + Y0 + '" x2="' + X0 + '" y2="30"/><line class="ed-ax" x1="' + X0 + '" y1="' + Y0 + '" x2="530" y2="' + Y0 + '"/>';
      s += '<path d="M' + X0 + ' 30 l-5 12 h10z" fill="var(--ink-2)"/><path d="M530 ' + Y0 + ' l-12 -5 v10z" fill="var(--ink-2)"/>';
      s += '<text class="t-b t-l" x="' + (X0 - 12) + '" y="38" text-anchor="end">H</text><text class="t-s t-m" x="' + ((X0 + X1) / 2) + '" y="236" text-anchor="middle">coordonata de reacție</text><text class="t-s t-m" x="528" y="236" text-anchor="end">R → P</text>';
      ['HR', 'HP', 'HCA'].forEach(function (k) {
        s += '<line class="ed-guide" x1="' + X0 + '" y1="' + Y(L[k]) + '" x2="' + (k === 'HCA' ? X(.5) : 520) + '" y2="' + Y(L[k]) + '"/>';
      });
      var pts = [], i;
      for (i = 0; i <= 80; i++) { var q = i / 80; pts.push((i ? 'L' : 'M') + V.f(X(q)) + ' ' + V.f(Y(Hof(q, L)))); }
      s += '<path d="M' + (X0 + 4) + ' ' + V.f(Y(L.HR)) + ' ' + pts.join(' ') + ' L520 ' + V.f(Y(L.HP)) + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
      s += '<circle cx="' + V.f(X(.5)) + '" cy="' + V.f(Y(L.HCA)) + '" r="6" fill="var(--paper)" stroke="' + col + '" stroke-width="3"/><text class="t-b" x="' + V.f(X(.5)) + '" y="' + (Y(L.HCA) - 30) + '" text-anchor="middle">CA<tspan class="sp" dy="-6">*</tspan></text>';
      // etichete pe axă
      var lab = [['HR', 'R', L.HR], ['HP', 'P', L.HP], ['HCA', 'CA*', L.HCA]].sort(function (a, b) { return Y(a[2]) - Y(b[2]); }), last = -99;
      lab.forEach(function (l) {
        var yy = Y(l[2]) + 5; if (yy - last < 18) yy = last + 18; last = yy;
        s += '<text class="t-s" x="' + (X0 - 10) + '" y="' + V.f(yy) + '" text-anchor="end">H<tspan class="sb" dy="3">' + l[1] + '</tspan></text>';
      });
      // Ea și ΔH
      s += '<line x1="' + (X0 + 22) + '" y1="' + V.f(Y(L.HR)) + '" x2="' + (X0 + 22) + '" y2="' + V.f(Y(L.HCA)) + '" stroke="#b07d00" stroke-width="2.6"/>' +
        '<path d="M' + (X0 + 22) + ' ' + V.f(Y(L.HCA)) + ' l-5 9 h10z M' + (X0 + 22) + ' ' + V.f(Y(L.HR)) + ' l-5 -9 h10z" fill="#b07d00"/>' +
        '<text class="t-b t-gold" x="' + (X0 + 32) + '" y="' + V.f((Y(L.HR) + Y(L.HCA)) / 2 + 5) + '">E<tspan class="sb" dy="3">a</tspan></text>';
      s += '<line x1="496" y1="' + V.f(Y(L.HR)) + '" x2="496" y2="' + V.f(Y(L.HP)) + '" stroke="' + col + '" stroke-width="2.6" stroke-dasharray="5 4"/>' +
        '<path d="M496 ' + V.f(Y(L.HP)) + ' l-5 ' + (kind === 'exo' ? -9 : 9) + ' h10z" fill="' + col + '"/><text class="t-b ' + (kind === 'exo' ? 't-exo' : 't-endo') + '" x="508" y="' + V.f((Y(L.HR) + Y(L.HP)) / 2 + 5) + '">ΔH</text>';
      s += '<circle id="' + p + '-ball" r="9" cx="' + X(0) + '" cy="' + (Y(L.HR) - 10) + '" fill="var(--accent)" stroke="var(--paper)" stroke-width="2.5"/>';
      // zona moleculelor
      s += '<rect x="96" y="256" width="400" height="200" rx="18" fill="var(--paper)" stroke="var(--line-2)" stroke-width="2"/>';
      s += '<g transform="translate(296 348)" id="' + p + '-mol"></g>';
      s += '<g id="' + p + '-stg"></g>';
      return V.frame([W, H], s, 'Diagrama de entalpie a unei reacții și, dedesubt, moleculele care se ciocnesc și reacționează');
    }
    holder.innerHTML = staticScene();
    var svg = holder.querySelector('svg');

    function draw(pp, bounced) {
      var L = lv();
      var ball = svg.querySelector('#' + p + '-ball');
      ball.setAttribute('cx', V.f(X(pp))); ball.setAttribute('cy', V.f(Y(Hof(pp, L)) - 11));
      var pos, b1, b2, bc;
      if (pp <= .5) { var t = pp / .5; pos = P0.map(function (a, i) { return [lerp(a[0], PC[i][0], t), lerp(a[1], PC[i][1], t)]; }); b1 = 1 - .5 * t; b2 = 0; }
      else { var t2 = (pp - .5) / .5; pos = PC.map(function (a, i) { return [lerp(a[0], P2[i][0], t2), lerp(a[1], P2[i][1], t2)]; }); b1 = .5 * (1 - t2); b2 = .5 + .5 * t2; }
      var s = '';
      function bond(i, j, op, dash) { return op > .03 ? V.bond(pos[i][0], pos[i][1], pos[j][0], pos[j][1], { w: 7, color: 'var(--ink-3)', dash: dash ? '2 9' : null, style: 'opacity:' + V.f(Math.min(1, op * (dash ? 2 : 1))) }) : ''; }
      var atCA = pp > .42 && pp < .58;
      s += bond(0, 1, b1, atCA) + bond(2, 3, b1, atCA) + bond(0, 2, b2, atCA) + bond(1, 3, b2, atCA);
      pos.forEach(function (q, i) { s += V.atom({ p: p, x: q[0], y: q[1], r: 21, k: KEYS[i], text: NAMES[i] }); });
      svg.querySelector('#' + p + '-mol').innerHTML = s;
      var txt = pp < .06 ? 'reactanți' : pp < .42 ? 'moleculele se apropie' : pp <= .58 ? 'complex activat (CA*): legături vechi pe cale să se rupă, legături noi începând să se formeze' : pp < .94 ? 'se formează produșii' : 'produși';
      if (bounced) txt = 'energie insuficientă: moleculele nu ajung la CA* și rămân neschimbate';
      svg.querySelector('#' + p + '-stg').innerHTML = V.pill(296, 440, pp > .42 && pp <= .58 ? 'complex activat CA*' : txt.length > 40 ? 'energie insuficientă' : txt, { tone: atCA ? 'warn' : bounced ? 'exo' : 'soft', w: 264, lower: true, h: 28 });
    }
    function reset() { if (anim) { anim.stop(); anim = null; } prog = 0; draw(0); sl.set(0); }
    function shot() {
      reset();
      var L = lv(), Ea = L.HCA - L.HR, Ek = Ea * ek / 100, eff = ek >= 100, pstar = .5;
      if (!eff) { var lo = 0, hi = .5, m; for (var i = 0; i < 30; i++) { m = (lo + hi) / 2; if (Hof(m, L) < L.HR + Ek) lo = m; else hi = m; } pstar = lo; }
      var t = 0, dur = eff ? 3.4 : 3.0;
      msg = '';
      anim = V.loop(svg, function (dt) {
        t += dt; var u = Math.min(1, t / dur);
        var pp = eff ? u * u * (3 - 2 * u) : pstar * Math.sin(Math.PI * u);
        sl.set(Math.round(pp * 100)); draw(pp, !eff && u > .5);
        if (u >= 1) { anim.stop(); anim = null; msg = eff ? 'ok' : 'bad'; note(); }
      });
      note();
    }
    function note() {
      var L = lv(), Ea = L.HCA - L.HR;
      out.className = 'wd-out ' + (msg === 'ok' ? 'ok' : msg === 'bad' ? 'bad' : '');
      out.innerHTML = T.rich('Energia ciocnirii: <b>' + T.fmt(ek, 0) + '%</b> din $E_a$ ' + (ek >= 100 ? '(≥ $E_a$: condiția energetică este îndeplinită)' : '(< $E_a$: condiția energetică <b>nu</b> este îndeplinită)') + '.' +
        (msg === 'ok' ? '<br><b>Ciocnire eficientă:</b> moleculele au trecut prin complexul activat; au apărut produși.' : msg === 'bad' ? '<br><b>Ciocnire ineficientă:</b> nu s-a atins complexul activat; moleculele s-au întors neschimbate.' : '<br>Reacția este ' + (kind === 'exo' ? '<b class="tag-exo">exotermă</b> ($ΔH < 0$)' : '<b class="tag-endo">endotermă</b> ($ΔH > 0$)') + '; $E_a = H_{CA}^* − H_R$ este „înălțimea dealului” de la reactanți.'));
    }
    var seg = T.seg([{ v: 'exo', label: 'Reacție exotermă', cls: 'exo' }, { v: 'endo', label: 'Reacție endotermă', cls: 'endo' }], kind, function (v) { kind = v; msg = ''; holder.innerHTML = staticScene(); svg = holder.querySelector('svg'); draw(0); note(); }, 'Tipul reacției');
    var sk = T.slider({ label: 'Energia ciocnirii (% din $E_a$)', min: 20, max: 180, step: 5, value: ek, unit: '%', dec: 0, onInput: function (v) { ek = v; msg = ''; note(); } });
    var sl = T.slider({ label: 'Progresul reacției', min: 0, max: 100, step: 1, value: 0, unit: '%', dec: 0, onInput: function (v) { if (anim) { anim.stop(); anim = null; } msg = ''; prog = v / 100; draw(prog); note(); } });
    body.append(T.h('div', { class: 'wd-ctrl' }, T.h('div', { class: 'wd-row' }, seg), sk, sl, T.h('div', { class: 'wd-row' }, T.btn('▶ Ciocnește moleculele', shot, 'primary'), T.btn('↺ De la capăt', reset, 'ghost'))), holder, out);
    draw(0); note();
  });
})(window);
