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
     Sistem și mediu exterior
     --------------------------------------------------------- */
  T.widget('systemEnv', function (el) {
    var body = T.shell(el, {
      title: 'Sistem și mediu exterior',
      help: 'Alege tipul reacției din pahar și urmărește cum trece căldura peste „granița” sistemului. Apoi clasifică elementele de mai jos.'
    });
    var kind = 'exo', id = T.uid('se');
    var holder = T.h('div', { class: 'wd-svg' });
    var cap = T.h('div', { class: 'wd-out exo' });

    function draw() {
      var c = kind;
      var s = '<svg viewBox="0 0 440 330" role="img" aria-label="Pahar cu o reacție chimică, încadrat ca sistem, în mijlocul mediului exterior">' + T.svgs.defs(id);
      s += '<rect class="se-env" x="8" y="8" width="424" height="314" rx="18"/>';
      s += '<text class="se-lbl" x="26" y="36">MEDIUL EXTERIOR</text>';
      s += '<text class="se-sm" x="28" y="160">aerul din</text><text class="se-sm" x="28" y="177">laborator</text>';
      s += '<rect class="se-table" x="40" y="286" width="360" height="14" rx="4"/><text class="se-sm" x="220" y="316" text-anchor="middle">masa de laborator</text>';
      s += '<rect class="se-sys" x="140" y="92" width="160" height="190" rx="22"/>';
      s += '<text class="se-lbl sys" x="220" y="114" text-anchor="middle">SISTEM</text>';
      s += '<path class="se-liq ' + c + '" d="M173 190 L267 190 L267 250 Q267 269 248 269 L192 269 Q173 269 173 250 Z"/>';
      s += '<path class="se-beaker" d="M172 130 L172 250 Q172 270 192 270 L248 270 Q268 270 268 250 L268 130" fill="none"/>';
      s += '<text class="se-liqt" x="220" y="234" text-anchor="middle">reactanți → produși</text>';
      if (c === 'exo') {
        s += arrow(138, 190, 80, 190, 'exo', id, 5) + arrow(302, 190, 360, 190, 'exo', id, 5) + arrow(220, 90, 220, 50, 'exo', id, 5);
        s += '<text class="se-q exo" x="109" y="174" text-anchor="middle">Q</text><text class="se-q exo" x="331" y="174" text-anchor="middle">Q</text><text class="se-q exo" x="238" y="74">Q</text>';
      } else {
        s += arrow(80, 190, 136, 190, 'endo', id, 5) + arrow(360, 190, 304, 190, 'endo', id, 5) + arrow(220, 50, 220, 88, 'endo', id, 5);
        s += '<text class="se-q endo" x="108" y="174" text-anchor="middle">Q</text><text class="se-q endo" x="332" y="174" text-anchor="middle">Q</text><text class="se-q endo" x="238" y="74">Q</text>';
      }
      holder.innerHTML = s + '</svg>';
      cap.className = 'wd-out ' + c;
      cap.innerHTML = T.rich(c === 'exo'
        ? '<b class="tag-exo">Exotermă:</b> reacția <b>degajă</b> căldură, care trece din sistem în mediul exterior. Pentru sistem, $Q < 0$.'
        : '<b class="tag-endo">Endotermă:</b> reacția <b>absoarbe</b> căldură din mediul exterior. Pentru sistem, $Q > 0$.');
    }
    var seg = T.seg([{ v: 'exo', label: 'Reacție exotermă', cls: 'exo' }, { v: 'endo', label: 'Reacție endotermă', cls: 'endo' }], kind, function (v) { kind = v; draw(); }, 'Tipul reacției');
    body.append(T.h('div', { class: 'wd-row' }, seg), holder, cap);
    draw();

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
      return { row: row, why: why, sg: sg };
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
     Semnul căldurii + efectele ei + convertor cal ↔ J
     --------------------------------------------------------- */
  T.widget('heatSign', function (el) {
    var body = T.shell(el, {
      title: 'Căldura Q: încotro merge și ce semn are',
      help: 'Mută cursorul pentru a schimba căldura schimbată de sistem. Alege și ce efect are ea asupra sistemului.'
    });
    var Q = 40, effect = 'temp', id = T.uid('hs');
    var holder = T.h('div', { class: 'wd-svg' }), out = T.h('div', { class: 'wd-out' });

    function inner() {
      var lvl = T.clamp(0.5 + Q / 230, 0.06, 0.97);
      if (effect === 'temp') {
        var col = lvl >= 0.5 ? 'var(--exo)' : 'var(--endo)', top = 96, bot = 160, y = bot - (bot - top) * lvl;
        return '<rect x="212" y="86" width="16" height="80" rx="8" class="th-g"/><rect x="216" y="' + y + '" width="8" height="' + (bot - y + 8) + '" rx="4" fill="' + col + '"/><circle cx="220" cy="172" r="13" fill="' + col + '"/>';
      }
      if (effect === 'work') {
        var yp = T.clamp(128 - Q * 0.5, 90, 168);
        return '<rect x="190" y="78" width="60" height="100" rx="4" class="cyl"/><rect x="191" y="' + yp + '" width="58" class="gas" style="height:' + (178 - yp) + 'px"/>' +
          '<rect x="188" y="' + (yp - 8) + '" width="64" height="8" rx="2" class="piston"/><line x1="220" y1="' + (yp - 8) + '" x2="220" y2="' + (yp - 24) + '" class="piston-rod"/>';
      }
      var f = T.clamp((Q + 100) / 200, 0, 1), wh = 56 * f, ih = 56 * (1 - f);
      return '<rect x="190" y="' + (176 - wh) + '" width="60" height="' + wh + '" class="water"/><rect x="198" y="' + (176 - wh - ih) + '" width="44" height="' + ih + '" rx="5" class="ice"/>';
    }
    function effectText() {
      if (Q <= 0) return Q < 0 ? 'Sistemul cedează căldură. Efectele din caiet (↑ t°, lucru mecanic, schimbarea stării de agregare) sunt pentru căldura <b>primită</b>, $Q > 0$.' : 'Nu se schimbă căldură cu mediul.';
      if (effect === 'temp') return 'Căldura primită poate produce <b>creșterea temperaturii</b> ($↑ t°$).';
      if (effect === 'work') return 'Căldura primită poate produce <b>efectul unui lucru mecanic</b>: gazul împinge pistonul.';
      return 'Căldura primită poate produce <b>schimbarea stării de agregare</b> (gheața se topește).';
    }
    function draw() {
      var col = Q > 0 ? 'endo' : Q < 0 ? 'exo' : 'ink', w = 3 + Math.abs(Q) / 12;
      var s = '<svg viewBox="0 0 440 250" role="img" aria-label="Sistemul și căldura schimbată cu mediul">' + T.svgs.defs(id);
      s += '<rect class="se-env" x="8" y="8" width="424" height="234" rx="18"/><text class="se-lbl" x="26" y="34">MEDIUL EXTERIOR</text>';
      s += '<rect class="se-sys" x="150" y="52" width="140" height="156" rx="20"/><text class="se-lbl sys" x="220" y="72" text-anchor="middle">SISTEM</text>';
      if (Q > 4) s += arrow(40, 130, 144, 130, col, id, w) + arrow(400, 130, 296, 130, col, id, w);
      if (Q < -4) s += arrow(144, 130, 40, 130, col, id, w) + arrow(296, 130, 400, 130, col, id, w);
      s += inner();
      s += '<text class="se-q ' + col + '" x="220" y="232" text-anchor="middle">Q = ' + (Q > 0 ? '+' : Q < 0 ? '−' : '') + Math.abs(Q) + ' kJ</text>';
      holder.innerHTML = s + '</svg>';
      out.className = 'wd-out ' + (Q > 0 ? 'endo' : Q < 0 ? 'exo' : '');
      out.innerHTML = T.rich((Q > 0 ? '<b>$Q > 0$</b> ⟹ sistemul <b>primește (absoarbe)</b> căldură.'
        : Q < 0 ? '<b>$Q < 0$</b> ⟹ sistemul <b>cedează</b> căldură mediului.'
        : '<b>$Q = 0$</b> ⟹ nu se schimbă căldură cu mediul.') + '<br>' + effectText());
    }
    var sl = T.slider({ label: 'Căldura schimbată de sistem', min: -100, max: 100, step: 5, value: Q, unit: 'kJ', fmt: function (v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v); }, onInput: function (v) { Q = v; draw(); } });
    var seg = T.seg([{ v: 'temp', label: 'creșterea temperaturii' }, { v: 'work', label: 'lucru mecanic' }, { v: 'state', label: 'schimbare de stare' }], effect, function (v) { effect = v; draw(); }, 'Efectul căldurii');
    body.append(T.h('div', { class: 'wd-ctrl' }, sl, T.h('div', { class: 'wd-row' }, T.h('label', { text: 'Efectul căldurii primite:' }), seg)), holder, out);
    draw();
  });

  T.widget('calConv', function (el) {
    var body = T.shell(el, { title: 'Convertor de unități pentru căldură', help: 'Scrie o valoare, alege unitatea și vezi echivalentul în celelalte. Poți alege valoarea calorie–joule: 4,186 (teorie) sau 4,18 (exercițiul 4/14).' });
    var cal = 4.186;
    var F = function () { return { J: 1, kJ: 1000, cal: cal, kcal: cal * 1000 }; };
    var inp = T.h('input', { class: 'inp', type: 'text', inputmode: 'decimal', value: '256,57', 'aria-label': 'Valoare' });
    var sel = T.h('select', { class: 'inp', 'aria-label': 'Unitate' }, ['J', 'kJ', 'cal', 'kcal'].map(function (k) { return T.h('option', { value: k, text: k, selected: k === 'kcal' ? true : null }); }));
    var cs = T.h('select', { class: 'inp sm', 'aria-label': 'Valoarea unei calorii' }, [['4.186', '1 cal = 4,186 J'], ['4.18', '1 cal = 4,18 J']].map(function (o) { return T.h('option', { value: o[0], text: o[1] }); }));
    var out = T.h('div', { class: 'wd-out' });
    function upd() {
      var v = T.parseNum(inp.value)[0];
      if (v == null) { out.textContent = 'Scrie un număr.'; return; }
      cal = +cs.value;
      var f = F(), J = v * f[sel.value];
      out.innerHTML = T.rich(Object.keys(f).map(function (k) { return '<span class="chip' + (k === sel.value ? ' ok' : '') + '">' + T.fmt(J / f[k], 4) + ' ' + k + '</span>'; }).join(' '));
    }
    inp.addEventListener('input', upd); sel.addEventListener('change', upd); cs.addEventListener('change', upd);
    body.append(T.h('div', { class: 'wd-row' }, inp, sel, cs), out);
    upd();
  });

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
