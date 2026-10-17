/* =========================================================
   widgets-energy.js — diagrama de entalpie (interactivă),
   întrebări pe diagrame
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;

  /* ---------------------------------------------------------
     Diagrama de entalpie + bila care trece peste bariera de activare
     --------------------------------------------------------- */
  T.widget('energyDiagram', function (el, o) {
    var body = T.shell(el, {
      title: 'Diagrama de entalpie: mișc-o și citește-o',
      help: 'Modifică nivelurile $H_R$, $H_P$ și energia de activare $E_a$. Observă când reacția e exotermă sau endotermă. Jos poți „ciocni” moleculele cu o anumită energie și vezi dacă trec peste barieră.'
    });
    var S = { HR: 22, HP: 58, EA: 48, labels: true, ek: 0.7 };
    if (o && o.preset === 'exo') { S.HR = 62; S.HP = 22; S.EA = 26; }
    var id = T.uid('ed'), anim = null;
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' }), status = T.h('div', { class: 'wd-out', hidden: true });
    var slR, slP, slA, slK;

    function bounds() {
      var min = Math.max(0, S.HP - S.HR) + 6, max = 96 - S.HR;
      return { min: min, max: Math.max(min, max) };
    }
    function sync() {
      var b = bounds(); S.EA = T.clamp(S.EA, b.min, b.max);
      slA.input.min = b.min; slA.input.max = b.max; slA.set(S.EA);
    }
    function draw() {
      stop();
      var HCA = S.HR + S.EA, d = S.HP - S.HR;
      holder.innerHTML = T.svgs.energy({ HR: S.HR, HP: S.HP, HCA: HCA, labels: S.labels, ball: true, id: id });
      var type = Math.abs(d) < 0.5 ? 'zero' : d > 0 ? 'endo' : 'exo';
      out.className = 'wd-out ' + (type === 'zero' ? '' : type);
      out.innerHTML = T.rich(
        '$H_R = ' + S.HR + '$, &nbsp;$H_P = ' + S.HP + '$, &nbsp;$H_{CA}^* = ' + HCA + '$<br>' +
        '<b>$ΔH = H_P − H_R = ' + S.HP + ' − ' + S.HR + ' = ' + (d > 0 ? '+' : '') + T.fmt(d, 0).replace('-', '−') + '$</b> ⟹ ' +
        (type === 'endo' ? '$ΔH > 0$ ⟹ <b class="tag-endo">reacție endotermă</b> (produșii au entalpie mai mare)' : type === 'exo' ? '$ΔH < 0$ ⟹ <b class="tag-exo">reacție exotermă</b> (produșii au entalpie mai mică)' : '$ΔH ≈ 0$ ($H_P ≈ H_R$)') + '<br>' +
        '<b>$E_a = H_{CA}^* − H_R = ' + HCA + ' − ' + S.HR + ' = ' + S.EA + '$</b> (de la $H_R$ până la vârful $CA^*$).');
      status.hidden = true;
      var ek = S.ek * S.EA;
      slK.querySelector('.sl-l').innerHTML = T.rich('Energia ciocnirii: <b>' + T.fmt(ek, 1) + '</b> (' + Math.round(S.ek * 100) + '% din $E_a$)');
    }
    function stop() { if (anim) { cancelAnimationFrame(anim); anim = null; } }

    function launch() {
      stop();
      var path = T.$('.ed-curve', holder), ball = T.$('.ed-ball', holder);
      if (!path || !ball) return;
      var N = 300, L = path.getTotalLength(), ds = L / N, P = [], H = [];
      for (var i = 0; i <= N; i++) { var pt = path.getPointAtLength(L * i / N); P.push(pt); H.push((T.svgs.EG.oy - pt.y) / T.svgs.EG.sc); }
      var Ek = S.ek * S.EA, idx = 0, dir = 1, last = null, turned = false;
      function put(i) { var p = P[Math.max(0, Math.min(N, Math.round(i)))]; ball.setAttribute('cx', p.x); ball.setAttribute('cy', p.y - 10); }
      function finish(ok) {
        status.hidden = false; status.className = 'wd-out ' + (ok ? 'ok' : 'bad');
        status.innerHTML = T.rich(ok ? '<b>Ciocnire eficientă:</b> energia ciocnirii ($' + T.fmt(Ek, 1) + '$) ≥ $E_a$ ($' + S.EA + '$). Condiția energetică este <b>îndeplinită</b>.'
          : '<b>Ciocnire ineficientă:</b> energia ciocnirii ($' + T.fmt(Ek, 1) + '$) &lt; $E_a$ ($' + S.EA + '$). Condiția energetică <b>nu este îndeplinită</b>.');
      }
      status.hidden = true;
      function step(ts) {
        if (last == null) last = ts;
        var dt = Math.min(0.05, (ts - last) / 1000); last = ts;
        var KE = Ek - (H[Math.round(idx)] - H[0]);
        var speed = Math.max(26, 64 * Math.sqrt(Math.max(KE, 0)));
        var ni = idx + dir * speed * dt / ds;
        var nKE = Ek - (H[Math.max(0, Math.min(N, Math.round(ni)))] - H[0]);
        if (nKE < 0) { dir = -dir; turned = true; } else idx = ni;
        put(idx);
        if (idx >= N) { put(N); finish(true); anim = null; return; }
        if (idx <= 0 && dir < 0) { put(0); finish(false); anim = null; return; }
        anim = requestAnimationFrame(step);
      }
      anim = requestAnimationFrame(step);
    }

    slR = T.slider({ label: '$H_R$ (reactanți)', min: 10, max: 70, step: 1, value: S.HR, dec: 0, onInput: function (v) { S.HR = v; sync(); draw(); } });
    slP = T.slider({ label: '$H_P$ (produși)', min: 10, max: 70, step: 1, value: S.HP, dec: 0, onInput: function (v) { S.HP = v; sync(); draw(); } });
    slA = T.slider({ label: '$E_a$ (energia de activare)', min: 6, max: 80, step: 1, value: S.EA, dec: 0, onInput: function (v) { S.EA = v; draw(); } });
    slK = T.slider({ label: 'Energia ciocnirii', min: 20, max: 200, step: 5, value: S.ek * 100, unit: '%', onInput: function (v) { S.ek = v / 100; draw(); } });
    var presets = T.h('div', { class: 'wd-row' },
      T.btn('Reacție endotermă', function () { S.HR = 22; S.HP = 58; S.EA = 48; slR.set(S.HR); slP.set(S.HP); sync(); draw(); }, 'small endo'),
      T.btn('Reacție exotermă', function () { S.HR = 62; S.HP = 22; S.EA = 26; slR.set(S.HR); slP.set(S.HP); sync(); draw(); }, 'small exo'),
      T.h('label', { style: { display: 'flex', gap: '6px', alignItems: 'center', fontWeight: 600, fontSize: '.9rem' } },
        T.h('input', { type: 'checkbox', checked: true, onchange: function (e) { S.labels = e.target.checked; draw(); }, style: { accentColor: 'var(--accent)' } }), 'arată etichetele'));
    var ctrl = T.h('div', { class: 'wd-ctrl' }, presets, slR, slP, slA);
    var coll = T.h('div', { class: 'wd-ctrl' }, slK, T.h('div', { class: 'wd-row' }, T.btn('▶ Ciocnește moleculele', launch, 'primary'),
      T.h('span', { class: 'muted', text: 'Bila = molecule care se ciocnesc. Poate trece peste „deal” doar dacă are destulă energie.' })));
    body.append(ctrl, holder, out, coll, status);
    sync(); draw();
  });

  /* ---------------------------------------------------------
     Întrebări pe diagrame (generate)
     --------------------------------------------------------- */
  function genLevels(R) {
    var HR, HP, HCA, k = R.pick([3, 4]);
    do {
      HR = R.step(10, 60, 5); HP = R.step(10, 60, 5);
    } while (Math.abs(HP - HR) < 10);
    HCA = Math.max(HR, HP) + R.step(15, 30, 5);
    return { HR: HR, HP: HP, HCA: HCA, k: k };
  }
  function fmtV(x) { return String(Math.round(x)); }

  /** o întrebare pe diagramă; kind ∈ 'class' | 'segment' | 'dH' | 'Ea' */
  T.energyQuestion = function (R, kind) {
    var L = genLevels(R), dH = L.HP - L.HR, exo = dH < 0, k = L.k;
    if (kind === 'class') {
      return {
        t: 'mc', q: 'Ce fel de reacție descrie diagrama de entalpie de mai jos?',
        fig: T.svgs.energy({ HR: L.HR, HP: L.HP, HCA: L.HCA, neutral: true, caption: false, dh: false, ea: false }),
        opts: ['Exotermă ($ΔH < 0$)', 'Endotermă ($ΔH > 0$)', 'Nu se poate stabili din diagramă', 'Are $ΔH = 0$'], noShuffle: true, a: exo ? 0 : 1,
        why: exo ? 'Nivelul produșilor ($H_P$) este <b>mai jos</b> decât cel al reactanților ($H_R$): $ΔH = H_P − H_R < 0$ ⟹ exotermă.' : 'Nivelul produșilor ($H_P$) este <b>mai sus</b> decât cel al reactanților ($H_R$): $ΔH = H_P − H_R > 0$ ⟹ endotermă.'
      };
    }
    if (kind === 'segment') {
      var letters = R.shuffle(['A', 'B', 'C']);
      var segs = { Ea: [L.HR, L.HCA], dH: [L.HR, L.HP], top: [0, L.HCA] };
      var keys = ['Ea', 'dH', 'top'], xs = { Ea: 56, dH: 484, top: 424 };
      var marks = keys.map(function (kx, i) { return { a: segs[kx][0], b: segs[kx][1], x: xs[kx], label: letters[i] }; });
      var corr = letters[0];
      return {
        t: 'mc', q: 'Care dintre segmentele marcate reprezintă <b>energia de activare</b> $E_a$ a reacției?',
        fig: T.svgs.energy({ HR: L.HR, HP: L.HP, HCA: L.HCA, neutral: true, caption: false, dh: false, ea: false, labels: false, ca: false, marks: marks, plateauNames: false }),
        opts: ['A', 'B', 'C'], noShuffle: true, a: ['A', 'B', 'C'].indexOf(corr),
        why: '$E_a = H_{CA}^* − H_R$: de la nivelul <b>reactanților</b> până în vârful „dealului” (complexul activat). Segmentul dintre $H_R$ și $H_P$ este $ΔH$.'
      };
    }
    var vals = { HR: fmtV(L.HR * k), HP: fmtV(L.HP * k), HCA: fmtV(L.HCA * k) };
    var fig = T.svgs.energy({ HR: L.HR, HP: L.HP, HCA: L.HCA, neutral: true, caption: false, dh: false, ea: false, vals: vals, plateauNames: true });
    if (kind === 'dH') return { t: 'num', q: 'Pentru reacția din diagramă, calculează $ΔH$ (în kJ/mol).', fig: fig, a: dH * k, unit: 'kJ/mol', tol: 0.001, dec: 0, why: '$ΔH = H_P − H_R = ' + vals.HP + ' − ' + vals.HR + ' = ' + T.fmt(dH * k, 0) + '$ kJ/mol ⟹ ' + (exo ? 'exotermă ($ΔH < 0$).' : 'endotermă ($ΔH > 0$).') };
    if (kind === 'Ea') return { t: 'num', q: 'Calculează energia de activare $E_a$ (în kJ/mol).', fig: fig, a: (L.HCA - L.HR) * k, unit: 'kJ/mol', tol: 0.001, dec: 0, why: '$E_a = H_{CA}^* − H_R = ' + vals.HCA + ' − ' + vals.HR + ' = ' + ((L.HCA - L.HR) * k) + '$ kJ/mol.' };
    return null;
  };

  T.widget('diagramQuiz', function (el) {
    var body = T.shell(el, { title: 'Citește diagrama (întrebări generate)', badge: 'Exersează', help: 'De fiecare dată altă diagramă. Apasă „Altă diagramă” după ce răspunzi.' });
    var kinds = ['class', 'segment', 'dH', 'Ea'], n = 0, holder = T.h('div');
    function next() {
      var R = T.rng((Math.random() * 1e9) | 0), kind = kinds[n % kinds.length]; n++;
      var q = T.energyQuestion(R, kind), api = T.Q.create(q, { num: n });
      holder.replaceChildren(api.el);
    }
    body.append(holder, T.h('div', { class: 'wd-row' }, T.btn('Altă diagramă ↻', next, 'primary')));
    next();
  });
})(window);
