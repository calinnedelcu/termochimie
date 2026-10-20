// Verifică automat generatoarele de probleme, întrebările din quiz și diagramele.
// Rulare:  node tools/verifica-probleme.js
// Verifică: structură, numere finite, fără NaN/undefined/minus ASCII, valorile din caiet, coerența exercițiilor Hess
// și, la nivelul 4 („Foarte greu”), verificarea independentă `inst.check()` a fiecărei instanțe (substituire înapoi în sisteme, sume de căldură etc.).
global.window = global; global.document = { createElement: () => ({}) };
const base = require('path').join(__dirname, '..', 'assets', 'js') + '/';
['core','ui','svgs','widgets-basic','widgets-calor','widgets-react','widgets-energy','widgets-hess','data-quiz','data-cards','problems','problems2','problems-hard-1','problems-hard-2','problems-hard-3'].forEach(f => require(base + f + '.js'));
const T = global.T;
let errors = 0, checked = 0;
const bad = /NaN|undefined|Infinity|\[object|null/;
function fail(msg) { errors++; if (errors < 40) console.log('✗', msg); }
function checkStr(s, where) { if (typeof s !== 'string') return fail(where + ': nu e string'); if (bad.test(s)) fail(where + ': conține ' + s.match(bad)[0] + ' → ' + s.slice(0, 160)); try { T.rich(s); } catch (e) { fail(where + ': rich() a eșuat ' + e.message); } }
function checkInst(inst, id, tag) {
  checked++;
  checkStr(inst.statement, id + ' ' + tag + ' statement');
  (inst.data || []).forEach((d, i) => checkStr(d, id + ' ' + tag + ' data' + i));
  if (!inst.parts || !inst.parts.length) return fail(id + ' ' + tag + ': fără părți');
  inst.parts.forEach(p => {
    const w = id + ' ' + tag + ' ' + p.id;
    checkStr(p.ask, w + ' ask');
    if (p.type === 'mc') {
      if (!(p.correct >= 0 && p.correct < p.opts.length)) fail(w + ': index corect invalid');
      p.opts.forEach((o, i) => checkStr(o, w + ' opt' + i));
    } else {
      if (!Number.isFinite(p.a)) fail(w + ': răspuns nefinit ' + p.a);
      if (T.fmt(p.a, p.dec == null ? 2 : p.dec) === '–') fail(w + ': fmt răspuns');
    }
    if (!p.steps || !p.steps.length) fail(w + ': fără pași');
    (p.steps || []).forEach((s, i) => checkStr(s, w + ' pas' + (i + 1)));
  });
  // stilul manualului: imperative la persoana a II-a plural (Calculați, Determinați, Precizați…), fără întrebări informale
  if (/<b>[a-f]\)<\/b> (Ce|Cât|Câți|Câte|Care|Cum|Când|La ce)(?![a-zăâîșțA-Z])|\b(Calculează|Determină|Află|Alege|Scrie)(?![a-zăâîșțA-Z])|Se dă ecuația|Se dau ecuațiile/.test(inst.statement)) fail(id + ' ' + tag + ': enunț în stil informal → ' + inst.statement.replace(/<[^>]+>/g, '').slice(0, 140));
  // plauzibilitate: procente ≤ 100; temperatura finală a apei lichide sub 100 °C; variantele unui item cu răspunsuri multiple sunt diferite
  inst.parts.forEach(p => {
    if (p.type !== 'mc' && p.unit === '%' && !(p.a > 0 && p.a <= 100.0001)) fail(id + ' ' + tag + ' ' + p.id + ': procent în afara (0, 100] → ' + p.a);
    if (p.type !== 'mc' && p.unit === '°C' && /apei/.test(p.ask) && !(p.a < 100)) fail(id + ' ' + tag + ' ' + p.id + ': apa depășește 100 °C → ' + p.a);
    if (p.type === 'mc' && new Set(p.opts).size !== p.opts.length) fail(id + ' ' + tag + ' ' + p.id + ': variante de răspuns identice');
  });
  // o masă dată în enunț ("<b>150 g</b> de [[X]]") cere masa molară a lui X printre datele problemei
  (inst.statement.match(/<b>[^<]*\bk?g<\/b> de \[\[[^\]]+\]\]/g) || []).forEach(m => { const x = m.match(/\[\[([^\]]+)\]\]/)[1]; if (!(inst.data || []).some(d => d.indexOf('M([[' + x + ']])') === 0)) fail(id + ' ' + tag + ': în enunț e dată masa lui ' + x + ', dar M(' + x + ') lipsește din date'); });
  if (typeof inst.check === 'function') { let ok = false; try { ok = inst.check(); } catch (e) { fail(id + ' ' + tag + ': check() a aruncat ' + e.message); } if (!ok) fail(id + ' ' + tag + ': check() a eșuat (răspunsurile nu sunt coerente cu enunțul)'); }
  if (inst.tool && inst.tool.name === 'hessCombiner') {
    const o = inst.tool.opts, net = T.netOf(o.eqs, o.eqs.map(e => e.m)), tn = T.targetNet(o.target);
    if (!T.sameNet(net, tn)) fail(id + ' ' + tag + ': Hess — suma ecuațiilor ≠ ținta');
    const sum = o.eqs.reduce((s, e) => s + e.m * e.dH, 0);
    if (!inst.check && Math.abs(sum - inst.parts[0].a) > 1e-6) fail(id + ' ' + tag + ': Hess — ΔH din răspuns ≠ Σ m·ΔH');   // instanțele cu check() își verifică singure coerența
    o.eqs.forEach((e, i) => { if (!e.key) fail(id + ': ecuație fără cheie'); });
  }
}
function near(a, b, tol, what) { if (Math.abs(a - b) > tol * Math.max(1, Math.abs(b))) fail('valoare așteptată ' + what + ': ' + a + ' ≠ ' + b); }

// 1) originalele din caiet
const O = {}; T.problemOrder.forEach(id => { O[id] = T.problems[id].original(); checkInst(O[id], id, 'orig'); });
near(O.termita.parts[0].a, 67.97, 0.001, 'termita a'); near(O.termita.parts[1].a, 426, 1e-9, 'termita b');
near(O.etan.parts[1].a, 2740, 1e-9, 'etan b');
const mcRight = (p) => p.opts[p.correct];
if (mcRight(O.glucoza.parts[0]) !== 'exotermă' || mcRight(O.glucoza.parts[1]) !== '48,3 kJ' || mcRight(O.glucoza.parts[2]) !== '2,7 kg de glucoză') fail('glucoza: răspunsurile corecte din manual (C, A, B) nu sunt cele așteptate');
near(O['apa-etanol'].parts[0].a, 50.208, 1e-6, 'apa a'); near(O['apa-etanol'].parts[1].a, 2.672, 0.002, 'apa b');
near(O.sodiu.parts[0].a, 2.08983, 0.0005, 'sodiu a'); near(O.sodiu.parts[1].a, 2.656, 0.002, 'sodiu b');
near(O.hess.parts[0].a, -128.1, 1e-9, 'hess a'); near(O.hess.parts[1].a, 320, 1e-9, 'hess b');
near(O['entalpii-formare'].parts[0].a, -802.3, 1e-9, 'formare a'); near(O['entalpii-formare'].parts[1].a, 4011.5, 1e-9, 'formare b');

// 2) variații
T.problemOrder.forEach(id => {
  for (let level = 1; level <= (T.problems[id].maxLevel || 3); level++) for (let seed = 1; seed <= 400; seed++) {
    let inst; try { inst = T.problems[id].make(seed * 7919 + level, level); } catch (e) { fail(id + ' L' + level + ' seed ' + seed + ': excepție ' + e.stack.split('\n').slice(0, 2).join(' | ')); break; }
    checkInst(inst, id, 'L' + level + '#' + seed);
  }
});
// 3) întrebări pe diagrame
const R = T.rng(5); ['class', 'segment', 'dH', 'Ea'].forEach(k => { for (let i = 0; i < 50; i++) { const q = T.energyQuestion(R, k); if (!q.q || !q.fig || (q.t === 'num' && !Number.isFinite(q.a)) || (q.t === 'mc' && !(q.a >= 0 && q.a < q.opts.length))) fail('energyQuestion ' + k); } });
// 4) quiz
Object.keys(T.quizData).forEach(k => T.quizData[k].forEach((q, i) => { const w = 'quiz ' + k + '#' + (i + 1); checkStr(q.q, w); if (q.t === 'mc') { if (!(q.a >= 0 && q.a < q.opts.length)) fail(w + ' a'); } else if (q.t === 'multi') { q.a.forEach(x => { if (!(x >= 0 && x < q.opts.length)) fail(w + ' multi'); }); } else if (q.t === 'num') { if (!Number.isFinite(q.a)) fail(w + ' num'); } else if (q.t === 'match') { if (!q.pairs.length) fail(w + ' match'); } else fail(w + ' tip necunoscut'); (q.opts || []).forEach((o, j) => checkStr(o, w + ' opt' + j)); checkStr(q.why || '', w + ' why'); }));
console.log('instanțe verificate:', checked, '· erori:', errors);

// verificare suplimentară: minus ASCII înaintea unui număr (ar trebui să fie „−”)
(function () {
  const seen = new Set();
  const hy = /(^|[\s=(>])-\d/;
  T.problemOrder.forEach(id => { for (let level = 0; level <= (T.problems[id].maxLevel || 3); level++) for (let seed = 1; seed <= 150; seed++) {
    const inst = level === 0 ? T.problems[id].original() : T.problems[id].make(seed * 31 + level, level);
    const all = [inst.statement].concat((inst.data || []), inst.parts.reduce((a, p) => a.concat([p.ask], p.steps || [], p.opts || []), []));
    all.forEach(x => { const t = String(x).replace(/<[^>]+>/g, ''); const m = t.match(hy); if (m) { const sn = id + ' L' + level + ': …' + t.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' '); if (!seen.has(sn.slice(0, 40))) { seen.add(sn.slice(0, 40)); console.log('✗ minus ASCII', sn); errors++; } } });
    if (level === 0) break;
  } });
  console.log('verificare minus ASCII: ', seen.size, 'tipare');
})();
