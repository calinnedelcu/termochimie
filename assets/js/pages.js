/* =========================================================
   pages.js — paginile site-ului: start, lecții, probleme,
   cartonașe, test, formule
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T;
  T.pages = {};

  /* ---------- statistici ---------- */
  function stats() {
    var read = T.chapters.filter(function (c) { return T.store.get('read.' + c.id, false); }).length;
    var pOk = 0, pTot = 0;
    T.problemOrder.forEach(function (id) { pOk += T.store.get('prob.' + id + '.ok', 0); pTot += T.store.get('prob.' + id + '.tot', 0); });
    var known = T.cards.filter(function (c) { return T.store.get('cards.' + c.id, 0) >= 2; }).length;
    var qs = T.chapters.map(function (c) { return T.store.get('quiz.' + c.id + '.best', null); }).filter(function (x) { return x != null; });
    var avg = qs.length ? Math.round(T.sum(qs) / qs.length) : null;
    return { read: read, pOk: pOk, pTot: pTot, known: known, avg: avg, quizzes: qs.length };
  }

  /* ---------- pagina de start ---------- */
  function heroArt() {
    return '<svg viewBox="0 0 420 300" role="img" aria-label="Două curbe de entalpie: una exotermă și una endotermă" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><marker id="ha" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="mk-ink"/></marker></defs>' +
      '<line class="ed-ax" x1="40" y1="266" x2="40" y2="18" marker-end="url(#ha)"/><line class="ed-ax" x1="40" y1="266" x2="404" y2="266" marker-end="url(#ha)"/>' +
      '<text class="ed-t b" x="30" y="26" text-anchor="end">H</text><text class="ed-t m" x="396" y="286" text-anchor="end">R → P</text>' +
      '<line class="ed-guide" x1="40" y1="150" x2="380" y2="150"/>' +
      '<path class="ed-curve exo" fill="none" d="M52 150 L112 150 C150 150 160 66 204 66 C250 66 258 224 300 224 L372 224"/>' +
      '<path class="ed-curve endo" fill="none" d="M52 150 L112 150 C150 150 150 34 206 34 C262 34 262 92 304 92 L372 92"/>' +
      '<text class="ed-t exo" x="372" y="246" text-anchor="end">exotermă · ΔH &lt; 0</text>' +
      '<text class="ed-t endo" x="372" y="82" text-anchor="end">endotermă · ΔH &gt; 0</text>' +
      '<text class="ed-t m" x="58" y="142">reactanți</text></svg>';
  }

  function home() {
    var st = stats();
    var first = T.chapters.find(function (c) { return !T.store.get('read.' + c.id, false); }) || T.chapters[0];
    var h = '<div class="page">';
    h += '<section class="hero"><div><div class="kicker">Material interactiv de studiu</div>' +
      '<h1>Termochimie: reacții <span class="tag-exo">exoterme</span> și <span class="tag-endo">endoterme</span></h1>' +
      '<p class="lead">Lecții cu grafice pe care le poți mișca, probleme rezolvate pas cu pas și <b>variații fără sfârșit</b> — exact genul de exerciții din teste.</p>' +
      '<div class="btn-row"><a class="btn primary" href="#/lectia/' + first.id + '">' + (st.read ? 'Continuă: ' : 'Începe: ') + first.title + '</a>' +
      '<a class="btn" href="#/probleme">Probleme și variații</a></div></div>' +
      '<div class="hero-art">' + heroArt() + '</div></section>';

    h += '<div class="steps3">' +
      '<div class="s"><b>Învață</b>12 lecții scurte, cu simulări și grafice interactive. La final, întrebări grele pe capitol.</div>' +
      '<div class="s"><b>Exersează</b>Problemele din caiet, rezolvate pas cu pas, plus variații cu numere noi de fiecare dată.</div>' +
      '<div class="s"><b>Verifică-te</b>Cartonașe pentru definiții, teste generate aleatoriu și fișa de formule.</div></div>';

    h += '<div class="stat-row">' +
      '<div class="stat"><b>' + st.read + '/' + T.chapters.length + '</b><span>lecții parcurse</span></div>' +
      '<div class="stat"><b>' + (st.avg == null ? '—' : st.avg + '%') + '</b><span>media la quiz-uri' + (st.quizzes ? ' (' + st.quizzes + ')' : '') + '</span></div>' +
      '<div class="stat"><b>' + st.pOk + '</b><span>probleme rezolvate corect' + (st.pTot ? ' din ' + st.pTot : '') + '</span></div>' +
      '<div class="stat"><b>' + st.known + '/' + T.cards.length + '</b><span>cartonașe știute</span></div></div>';

    h += '<h2>Lecțiile</h2><div class="cardgrid">';
    T.chapters.forEach(function (c, i) {
      var done = T.store.get('read.' + c.id, false), best = T.store.get('quiz.' + c.id + '.best', null);
      h += '<a class="lcard ' + (done ? 'done ' : '') + (c.tone === 'exo' ? 'exo-c' : c.tone === 'endo' ? 'endo-c' : '') + '" href="#/lectia/' + c.id + '">' +
        '<span class="ln">Lecția ' + (i + 1) + '</span><b>' + c.title + '</b><span class="sub">' + c.short + '</span>' +
        '<span class="st">' + (done ? '✓ parcursă' : (best != null ? 'quiz ' + best + '%' : '')) + '</span></a>';
    });
    h += '</div>';

    h += '<h2>Probleme, pe tipuri</h2><div class="cardgrid">';
    T.problemOrder.forEach(function (id, i) {
      var p = T.problems[id], ok = T.store.get('prob.' + id + '.ok', 0), tot = T.store.get('prob.' + id + '.tot', 0);
      h += '<a class="lcard" href="#/probleme/' + id + '"><span class="ln">Tip ' + (i + 1) + '</span><b>' + p.title + '</b><span class="sub">' + p.blurb + '</span>' +
        '<span class="st">' + (tot ? ok + '/' + tot + ' corecte' : '') + '</span></a>';
    });
    h += '</div>';

    h += '<h2>Instrumente</h2><div class="cardgrid">' +
      '<a class="lcard" href="#/cartonase"><span class="ln">Memorare</span><b>Cartonașe</b><span class="sub">Definiții, formule și reguli — cu repetiție inteligentă.</span></a>' +
      '<a class="lcard" href="#/test"><span class="ln">Autoevaluare</span><b>Test generat aleatoriu</b><span class="sub">Întrebări grele + probleme cu numere noi, cu cronometru opțional.</span></a>' +
      '<a class="lcard" href="#/formule"><span class="ln">Referință</span><b>Formule și reguli</b><span class="sub">Tot ce trebuie să știi pe o singură pagină.</span></a></div>';
    h += '<hr><p class="muted" style="font-size:.88rem">Progresul (lecții parcurse, scoruri, cartonașe) este salvat doar în acest browser. <button class="btn small ghost" type="button" id="resetProg">Șterge progresul</button></p>';
    return {
      title: '', html: h + '</div>', nav: 'home',
      after: function (root) {
        var b = T.$('#resetProg', root);
        if (b) b.addEventListener('click', function () { if (confirm('Sigur ștergi tot progresul salvat în acest browser?')) { T.store.reset(); location.reload(); } });
      }
    };
  }

  /* ---------- lecție ---------- */
  function lesson(id) {
    var idx = T.chapters.findIndex(function (c) { return c.id === id; });
    if (idx < 0) return { title: 'Lecție inexistentă', html: '<div class="page"><h1>Lecție inexistentă</h1><p><a href="#/">Înapoi acasă</a></p></div>' };
    var ch = T.chapters[idx], prev = T.chapters[idx - 1], next = T.chapters[idx + 1];
    var read = T.store.get('read.' + ch.id, false);
    var h = '<div class="page lesson"><header><div class="kicker">Lecția ' + (idx + 1) + ' din ' + T.chapters.length + '</div><h1>' + ch.title + '</h1><p class="lead">' + ch.lead + '</p>';
    h += '<div class="lesson-toc">';
    ch.sections.forEach(function (s, i) { h += '<a href="#/lectia/' + ch.id + '" data-jump="' + ch.id + '-' + s.id + '">' + (i + 1) + '. ' + s.h + '</a>'; });
    h += '<a href="#/lectia/' + ch.id + '" data-jump="' + ch.id + '-quiz">Verifică-te</a></div></header>';
    ch.sections.forEach(function (s, i) {
      h += '<section id="' + ch.id + '-' + s.id + '"><h2><span class="sn">' + (idx + 1) + '.' + (i + 1) + '</span>' + s.h + '</h2>' + (typeof s.html === 'function' ? s.html() : s.html) + '</section>';
    });
    h += '<section id="' + ch.id + '-quiz"><h2>Verifică-te</h2><p>Întrebări de nivel „test greu”. Citește explicația la fiecare, chiar dacă ai nimerit răspunsul.</p>' + T.QZ(ch.id) + '</section>';
    h += '<div class="nav-foot">' + (prev ? '<a class="btn" href="#/lectia/' + prev.id + '">← ' + prev.title + '</a>' : '<a class="btn" href="#/">← Acasă</a>') +
      '<button class="btn ' + (read ? '' : 'primary') + ' mid" type="button" id="markRead">' + (read ? '✓ Lecție parcursă (apasă ca s-o debifezi)' : 'Am parcurs lecția ✓') + '</button>' +
      (next ? '<a class="btn" href="#/lectia/' + next.id + '">' + next.title + ' →</a>' : '<a class="btn" href="#/probleme">Treci la probleme →</a>') + '</div></div>';
    return {
      title: ch.title, html: h, nav: 'lectia/' + ch.id,
      after: function (root) {
        var b = T.$('#markRead', root);
        if (b) b.addEventListener('click', function () {
          var v = !T.store.get('read.' + ch.id, false);
          T.store.set('read.' + ch.id, v);
          b.className = 'btn mid' + (v ? '' : ' primary');
          b.textContent = v ? '✓ Lecție parcursă (apasă ca s-o debifezi)' : 'Am parcurs lecția ✓';
        });
      }
    };
  }

  /* ---------- probleme ---------- */
  function problemsHub() {
    var h = '<div class="page"><div class="kicker">Exersare</div><h1>Probleme și variații</h1>' +
      '<p class="lead">Din astea se dau teste. Fiecare tip are <b>problema din caiet</b>, rezolvată pas cu pas, și apoi <b>variații cu numere noi</b> la trei niveluri: ca în caiet, variație și dificil.</p>' +
      T.callout('tip', 'Metoda sigură: scrie datele, scrie ecuația, alege <b>proporția</b> sau formula potrivită, abia apoi calculează. Verifică mereu <b>unitățile</b> (J ↔ kJ, cal ↔ kcal, g ↔ kg) și <b>semnul</b>.') +
      '<div class="plist">';
    T.problemOrder.forEach(function (id, i) {
      var p = T.problems[id], ok = T.store.get('prob.' + id + '.ok', 0), tot = T.store.get('prob.' + id + '.tot', 0);
      h += '<a class="pcard" href="#/probleme/' + id + '"><div class="pn">' + (i + 1) + '</div><div><b>' + p.title + '</b><span class="sub">' + p.blurb + '</span>' +
        '<div class="meta">' + p.skill + (tot ? ' · răspunsuri corecte: ' + ok + '/' + tot : '') + '</div></div></a>';
    });
    return { title: 'Probleme', html: h + '</div></div>', nav: 'probleme' };
  }

  function problemPage(id) {
    var p = T.problems[id];
    if (!p) return problemsHub();
    var i = T.problemOrder.indexOf(id), prev = T.problems[T.problemOrder[i - 1]], next = T.problems[T.problemOrder[i + 1]];
    var h = '<div class="page"><div class="kicker">Problema tip ' + (i + 1) + ' din ' + T.problemOrder.length + '</div><h1>' + p.title + '</h1><p class="lead">' + p.blurb + '</p>' +
      (p.intro ? p.intro : '') + T.PR(id) +
      '<div class="nav-foot">' + (prev ? '<a class="btn" href="#/probleme/' + prev.id + '">← ' + prev.short + '</a>' : '<a class="btn" href="#/probleme">← Toate problemele</a>') +
      (next ? '<a class="btn" href="#/probleme/' + next.id + '">' + next.short + ' →</a>' : '<a class="btn primary" href="#/test">Fă un test →</a>') + '</div></div>';
    return { title: p.short, html: h, nav: 'probleme/' + id };
  }

  /* ---------- cartonașe ---------- */
  function cardsPage() {
    var h = '<div class="page"><div class="kicker">Memorare</div><h1>Cartonașe</h1>' +
      '<p class="lead">Citește întrebarea, răspunde în minte, apoi întoarce cartonașul. Cele pe care nu le știi revin mai des.</p>' +
      '<div class="deck-bar"><label>Capitol: <select class="inp" id="deckSel"><option value="*">Toate</option>' +
      T.chapters.map(function (c, i) { return '<option value="' + c.id + '">' + (i + 1) + '. ' + c.title + '</option>'; }).join('') +
      '</select></label><label style="display:flex;gap:6px;align-items:center"><input type="checkbox" id="onlyNew" style="accent-color:var(--accent)"> doar cele nestăpânite</label>' +
      '<span class="muted" id="deckInfo"></span></div><div id="flashArea"></div></div>';
    return {
      title: 'Cartonașe', html: h, nav: 'cartonase',
      after: function (root) {
        var area = T.$('#flashArea', root), sel = T.$('#deckSel', root), only = T.$('#onlyNew', root), info = T.$('#deckInfo', root);
        var cur = null, last = null;
        function deck() {
          return T.cards.filter(function (c) {
            if (sel.value !== '*' && c.ch !== sel.value) return false;
            if (only.checked && T.store.get('cards.' + c.id, 0) >= 2) return false;
            return true;
          });
        }
        function pick() {
          var d = deck();
          info.textContent = d.length + ' cartonașe în pachet · știute: ' + T.cards.filter(function (c) { return (sel.value === '*' || c.ch === sel.value) && T.store.get('cards.' + c.id, 0) >= 2; }).length;
          if (!d.length) { cur = null; return; }
          var pool = d.length > 1 ? d.filter(function (c) { return c !== last; }) : d;
          var w = pool.map(function (c) { return [4, 2, 1, .3][T.store.get('cards.' + c.id, 0)] || 1; });
          var tot = T.sum(w), r = Math.random() * tot, i = 0;
          while (i < pool.length - 1 && r > w[i]) { r -= w[i]; i++; }
          cur = pool[i];
        }
        function draw() {
          pick();
          if (!cur) { area.innerHTML = '<div class="callout key"><div class="cb">Bravo — nu mai ai cartonașe nestăpânite în acest pachet. Debifează „doar cele nestăpânite” ca să repeți tot.</div></div>'; return; }
          var box = T.store.get('cards.' + cur.id, 0), ci = T.chapters.findIndex(function (c) { return c.id === cur.ch; });
          area.innerHTML = '<div class="flash" id="flash"><div class="flash-in" id="flashIn">' +
            '<div class="face front"><div class="fk">Lecția ' + (ci + 1) + ' · întrebare</div><div class="fq">' + T.rich(cur.q) + '</div><div class="tap">atinge pentru răspuns</div></div>' +
            '<div class="face back"><div class="fk">răspuns</div><div class="fa">' + T.rich(cur.a) + '</div></div></div></div>' +
            '<div class="leit" title="Cât de bine îl știi"><i class="' + (box >= 1 ? 'on' : '') + '"></i><i class="' + (box >= 2 ? 'on' : '') + '"></i><i class="' + (box >= 3 ? 'on' : '') + '"></i></div>' +
            '<div class="flash-ctrl"><button class="btn" id="fFlip" type="button">Întoarce</button>' +
            '<button class="btn exo" id="fNo" type="button">Nu știu</button><button class="btn" id="fMid" type="button">Cam știu</button><button class="btn endo" id="fYes" type="button">Știu</button></div>';
          var fl = T.$('#flash', area);
          function flip() { fl.classList.toggle('flip'); }
          T.$('#flashIn', area).addEventListener('click', flip);
          T.$('#fFlip', area).addEventListener('click', flip);
          function rate(v) { last = cur; T.store.set('cards.' + cur.id, v); draw(); }
          T.$('#fNo', area).addEventListener('click', function () { rate(0); });
          T.$('#fMid', area).addEventListener('click', function () { rate(Math.max(1, Math.min(box, 1))); });
          T.$('#fYes', area).addEventListener('click', function () { rate(Math.min(3, box + 1 + (box === 0 ? 1 : 0))); });
        }
        sel.addEventListener('change', draw); only.addEventListener('change', draw);
        draw();
      }
    };
  }

  /* ---------- test ---------- */
  function testPage() {
    var qCount = [5, 10, 15, 20];
    var h = '<div class="page"><div class="kicker">Autoevaluare</div><h1>Test</h1>' +
      '<p class="lead">De fiecare dată altceva: întrebări grele din lecții și probleme cu numere noi. Răspunzi la toate, apoi predai și vezi rezolvările.</p>' +
      '<form class="test-setup" id="testForm"><fieldset><legend>Capitole pentru întrebările teoretice</legend><div class="check-grid">' +
      T.chapters.map(function (c, i) { return '<label><input type="checkbox" name="ch" value="' + c.id + '" checked> ' + (i + 1) + '. ' + c.title + '</label>'; }).join('') +
      '</div><div class="btn-row"><button type="button" class="btn small ghost" data-sel="all">Toate</button><button type="button" class="btn small ghost" data-sel="none">Niciunul</button></div></fieldset>' +
      '<fieldset><legend>Întrebări teoretice</legend><select class="inp" name="nq">' + qCount.map(function (n) { return '<option value="' + n + '"' + (n === 10 ? ' selected' : '') + '>' + n + ' întrebări</option>'; }).join('') + '<option value="0">fără</option></select></fieldset>' +
      '<fieldset><legend>Probleme</legend><div class="check-grid">' +
      T.problemOrder.map(function (id) { return '<label><input type="checkbox" name="pr" value="' + id + '" checked> ' + T.problems[id].short + '</label>'; }).join('') +
      '</div><p style="margin:8px 0 0"><label>Câte probleme: <select class="inp" name="np"><option value="0">niciuna</option><option value="1">1</option><option value="2">2</option><option value="3" selected>3</option><option value="4">4</option><option value="5">5</option></select></label></p></fieldset>' +
      '<fieldset><legend>Timp</legend><select class="inp" name="time"><option value="0">fără limită</option><option value="15">15 minute</option><option value="30">30 de minute</option><option value="45">45 de minute</option></select></fieldset>' +
      '<button class="btn primary" type="submit">Începe testul</button></form>' +
      '<div id="testRun"></div><div id="testHist"></div></div>';
    return {
      title: 'Test', html: h, nav: 'test',
      after: function (root) {
        var form = T.$('#testForm', root), run = T.$('#testRun', root), hist = T.$('#testHist', root);
        var timer = null;
        function showHist() {
          var hs = T.store.get('tests', []);
          hist.innerHTML = hs.length ? '<h2>Ultimele teste</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Când</th><th class="c">Scor</th><th class="c">Întrebări</th><th class="c">Probleme</th></tr></thead><tbody>' +
            hs.slice(-6).reverse().map(function (x) {
              var d = new Date(x.t);
              return '<tr><td>' + d.toLocaleDateString('ro-RO') + ' ' + d.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }) + '</td><td class="c"><b>' + x.pct + '%</b></td><td class="c">' + x.q + '</td><td class="c">' + x.p + '</td></tr>';
            }).join('') + '</tbody></table></div>' : '';
        }
        showHist();
        T.$$('[data-sel]', form).forEach(function (b) {
          b.addEventListener('click', function () { T.$$('input[name=ch]', form).forEach(function (i) { i.checked = b.dataset.sel === 'all'; }); });
        });
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          var fd = new FormData(form);
          var chs = fd.getAll('ch'), prs = fd.getAll('pr'), nq = +fd.get('nq'), np = +fd.get('np'), mins = +fd.get('time');
          var rnd = T.rng((Math.random() * 1e9) | 0);
          var pool = [];
          chs.forEach(function (cid) { (T.quizData[cid] || []).forEach(function (q) { pool.push({ q: q, ch: cid }); }); });
          var qs = rnd.shuffle(pool).slice(0, nq);
          var probs = [];
          for (var i = 0; i < np && prs.length; i++) probs.push(prs[i % prs.length]);
          probs = rnd.shuffle(probs);
          if (!qs.length && !probs.length) { run.innerHTML = '<div class="callout warn"><div class="cb">Alege cel puțin o întrebare sau o problemă.</div></div>'; return; }
          form.hidden = true; hist.innerHTML = '';
          startTest(qs, probs, mins, rnd);
        });

        function startTest(qs, probs, mins, rnd) {
          run.innerHTML = '';
          var bar = T.h('div', { class: 'test-bar' }, T.h('b', { text: 'Test în desfășurare' }), T.h('span', { class: 'sp' }), T.h('span', { class: 't', text: mins ? mins + ':00' : '∞' }));
          var submit = T.h('button', { type: 'button', class: 'btn primary', text: 'Predă testul' });
          bar.append(submit);
          run.append(bar);
          var items = [], n = 0;
          qs.forEach(function (it) {
            n++;
            var api = T.Q.create(it.q, { mode: 'deferred', num: n, shuffle: true });
            var ci = T.chapters.findIndex(function (c) { return c.id === it.ch; });
            var box = T.h('div', { class: 'test-item' }, T.h('div', { class: 'tag', text: 'Întrebare · lecția ' + (ci + 1) }), api.el);
            run.append(box); items.push({ kind: 'q', api: api, box: box });
          });
          probs.forEach(function (pid) {
            n++;
            var P = T.problems[pid], level = rnd.pick([1, 2, 2, 3]);
            var inst = P.make((rnd.next() * 1e9) | 0, level);
            var view = T.renderProblem(inst, { mode: 'deferred', label: n + '.' });
            var box = T.h('div', { class: 'test-item' }, T.h('div', { class: 'tag', text: 'Problemă · ' + P.short }), view.el);
            run.append(box); items.push({ kind: 'p', view: view, box: box, pid: pid });
          });
          var left = mins * 60, tick = null;
          function fmtT(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }
          if (mins) {
            tick = setInterval(function () {
              left--; T.$('.t', bar).textContent = fmtT(Math.max(0, left));
              if (left <= 0) { clearInterval(tick); finish(); }
            }, 1000);
          }
          var finished = false;
          function finish() {
            if (finished) return; finished = true;
            if (tick) clearInterval(tick);
            var qGood = 0, qTot = 0, pGood = 0, pTot = 0;
            items.forEach(function (it) {
              if (it.kind === 'q') {
                var r = it.api.check(); it.api.lock(); qTot++; qGood += r.score || 0;
                it.box.classList.add(r.correct ? 'is-ok' : 'is-bad');
              } else {
                var rr = it.view.finish(); pTot += rr.total; pGood += rr.good;
                it.box.classList.add(rr.good === rr.total ? 'is-ok' : 'is-bad');
                T.store.update('prob.' + it.pid + '.ok', function (v) { return (v || 0) + rr.good; }, 0);
                T.store.update('prob.' + it.pid + '.tot', function (v) { return (v || 0) + rr.total; }, 0);
              }
            });
            var tot = qTot + pTot, good = qGood + pGood, pct = tot ? Math.round(100 * good / tot) : 0;
            bar.remove();
            var cls = pct >= 80 ? 'good' : pct >= 50 ? 'mid' : 'low';
            var res = T.h('div', { class: 'result-big ' + cls },
              T.h('div', { class: 'pct', text: pct + '%' }),
              T.h('p', { html: '<b>' + T.fmt(good, 1) + ' din ' + tot + ' puncte</b> · întrebări: ' + T.fmt(qGood, 1) + '/' + qTot + ' · probleme: ' + pGood + '/' + pTot }),
              T.h('p', { class: 'muted', text: pct >= 80 ? 'Foarte bine! Mai verifică întrebările greșite de mai jos.' : pct >= 50 ? 'E un început bun. Citește rezolvările și reia lecțiile pentru greșeli.' : 'Mai ai de recapitulat — folosește rezolvările de mai jos și lecțiile.' }),
              T.h('div', { class: 'btn-row', style: { justifyContent: 'center' } },
                T.h('button', { class: 'btn primary', type: 'button', text: 'Alt test', onclick: function () { route(); } }),
                T.h('a', { class: 'btn', href: '#/probleme', text: 'Exersează probleme' })));
            run.insertBefore(res, run.firstChild);
            T.store.update('tests', function (a) { a = a.concat([{ t: Date.now(), pct: pct, q: qTot ? T.fmt(qGood, 1) + '/' + qTot : '—', p: pTot ? pGood + '/' + pTot : '—' }]); return a.slice(-20); }, []);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          submit.addEventListener('click', function () {
            var pending = items.filter(function (it) { return it.kind === 'q' ? !it.api.answered() : false; }).length;
            if (pending && !confirm('Ai ' + pending + ' întrebări fără răspuns. Predai oricum?')) return;
            finish();
          });
        }
        function route() { location.hash = '#/test'; g.dispatchEvent(new HashChangeEvent('hashchange')); }
      }
    };
  }

  /* ---------- formule ---------- */
  function formulas() {
    function row(l, r, u) { return '<div class="frow"><div class="fl">' + l + '</div><div class="fr">' + r + '</div>' + (u ? '<div class="fu">' + u + '</div>' : '') + '</div>'; }
    function card(t, rows) { return '<div class="fcard"><h3>' + t + '</h3>' + rows.join('') + '</div>'; }
    var h = '<div class="page"><div class="kicker">Referință</div><h1>Formule și reguli</h1><p class="lead">Tot ce ai nevoie la test, pe o singură pagină.</p><p><button class="btn small" type="button" id="printF">Printează sau salvează ca PDF</button></p>';
    h += card('Căldura', [
      row('Sistemul primește / absoarbe căldură', '$Q > 0$'),
      row('Sistemul cedează căldură mediului', '$Q < 0$'),
      row('Conversii', '$1 cal ≈ 4,186 J$ &nbsp; (în probleme: 4,18 sau 4,184 — ia valoarea din enunț)'),
      row('Multipli', '$1 kJ = 10^3 J$, &nbsp; $1 kcal = 10^3 cal$')
    ]);
    h += card('Mărimi calorimetrice', [
      row('Capacitate calorică', '$C = (Q)//(ΔT)$', 'J/K'),
      row('Variația de temperatură', '$ΔT = T_f − T_i$', 'K sau °C (aceeași valoare)'),
      row('Căldură specifică', '$c = (Q)//(m·ΔT)$ &nbsp;⟹&nbsp; $Q = m·c·ΔT$', 'J/(g·K)'),
      row('Căldură specifică molară', '$C_m = (Q)//(ν·ΔT)$', 'J/(mol·K)'),
      row('Căldură latentă specifică', '$λ = (Q)//(m)$ &nbsp; sau, pe mol: $Q = ν·λ$', 'J/g &nbsp;sau&nbsp; kJ/mol'),
      row('Legături utile (derivate)', '$C = m·c$ &nbsp;·&nbsp; $C_m = M·c$ &nbsp;·&nbsp; $Q = C·ΔT$')
    ]);
    h += card('Principiile calorimetriei', [
      row('Echilibru termic', 'corpuri în contact, într-un sistem izolat ⟹ aceeași temperatură finală'),
      row('Egalitatea schimburilor de căldură', '$Q_{cedată} = Q_{primită}$ &nbsp;(în modul) &nbsp;sau&nbsp; $Q_1 + Q_2 = 0$ &nbsp;(cu semn)'),
      row('Temperatura de echilibru', '$T_f = (m_1 c_1 T_1 + m_2 c_2 T_2)//(m_1 c_1 + m_2 c_2)$'),
      row('Procese inverse', '$|Q|$ absorbit într-o transformare = $|Q|$ degajat în transformarea inversă (topire ↔ solidificare)')
    ]);
    h += card('Termodinamică', [
      row('Primul principiu', '$Q = ΔU + L$'),
      row('La $V = ct.$', '$Q_V = ΔU$'),
      row('La $p = ct.$', '$Q_P = ΔU + pΔV = ΔH$'),
      row('Entalpia', '$H = U + pV$ &nbsp;·&nbsp; căldura de reacție la $p = ct.$ = $ΔH$')
    ]);
    h += card('Reacții exoterme și endoterme', [
      row('Exotermă', '$R -> P + Q$ &nbsp;·&nbsp; $ΔH < 0$ &nbsp;·&nbsp; $H_P < H_R$ &nbsp;·&nbsp; mediul se încălzește'),
      row('Endotermă', '$R + Q -> P$ &nbsp;·&nbsp; $ΔH > 0$ &nbsp;·&nbsp; $H_P > H_R$ &nbsp;·&nbsp; absoarbe căldură'),
      row('Diagrama de entalpie', '$ΔH = H_P − H_R$ &nbsp;·&nbsp; $E_a = H_{CA}^* − H_R$'),
      row('Stări de agregare', '(s) solid · (l) lichid · (g) gaz · (aq) soluție apoasă'),
      row('Legături chimice', 'ruperea absoarbe energie · formarea degajă energie'),
      row('Schimbări de stare', '<b class="tag-endo">endoterme:</b> topire, vaporizare, sublimare · <b class="tag-exo">exoterme:</b> solidificare, condensare, desublimare')
    ]);
    h += card('Calcule pe ecuația termochimică', [
      row('Cantitatea de substanță', '$ν = (m)//(M)$ &nbsp;·&nbsp; gaz la c.n.: $ν = (V)//(22,4)$'),
      row('Proporția', 'coeficient (mol) ↔ căldura din ecuație &nbsp;=&nbsp; cantitatea dată ↔ $x$'),
      row('Condiții standard (pentru $ΔH°$)', '$T = 298 K = 25 °C$, &nbsp; $p = 1 atm$'),
      row('Condiții normale (pentru volume)', '$T = 273 K = 0 °C$, $p = 1 atm$, $V_m = 22,4 L/mol$'),
      row('Temperatura absolută', '$T(K) = t(°C) + 273$')
    ]);
    h += card('Căldura de formare și legea lui Hess', [
      row('Căldura de formare', '$ΔH_f$ pentru 1 mol de substanță din elemente în stare standard', 'kJ/mol'),
      row('Elementele în stare standard', '$ΔH_f = 0$ &nbsp;(O<sub>2</sub>, H<sub>2</sub>, C grafit, Fe, …)'),
      row('Stabilitate', 'cu cât $ΔH_f$ e mai mică (mai negativă), cu atât substanța e mai stabilă'),
      row('Căldura de reacție din $ΔH_f$', '$ΔH_R = Σ ν_P·ΔH_f(produși) − Σ ν_R·ΔH_f(reactanți)$'),
      row('Legea lui Hess', '$ΔH = ΔH_1 + ΔH_2 + ΔH_3$ — depinde doar de starea inițială și finală'),
      row('Manipularea ecuațiilor', 'inversezi ecuația ⟹ schimbi semnul lui $ΔH$ · înmulțești cu $k$ ⟹ înmulțești $ΔH$ cu $k$ · apoi aduni'),
      row('Căldura pentru $n$ mol', '$|Q| = n·|ΔH|$ (la $ΔH$ dat pe mol de reacție)')
    ]);
    return {
      title: 'Formule', html: h + '</div>', nav: 'formule',
      after: function (root) { var b = T.$('#printF', root); if (b) b.addEventListener('click', function () { window.print(); }); }
    };
  }

  /* ---------- rutare ---------- */
  T.pages.render = function (parts) {
    var a = parts[0], b = parts[1];
    if (!a) return home();
    if (a === 'lectia') return lesson(b);
    if (a === 'probleme') return b ? problemPage(b) : problemsHub();
    if (a === 'cartonase') return cardsPage();
    if (a === 'test') return testPage();
    if (a === 'formule') return formulas();
    return home();
  };
})(window);
