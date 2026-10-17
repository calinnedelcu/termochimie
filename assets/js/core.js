/* =========================================================
   core.js — utilitare comune (DOM, numere, notații, stocare)
   ========================================================= */
(function (g) {
  'use strict';
  var T = g.T = g.T || {};

  // registre completate de celelalte fișiere
  T.widgets = {};
  T.chapters = [];
  T.quizData = {};
  T.cards = [];
  T.problems = {};
  T.problemOrder = [];

  /* ---------- DOM ---------- */
  T.$ = function (s, r) { return (r || document).querySelector(s); };
  T.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  T.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };

  T.h = function (tag, props) {
    var e = document.createElement(tag);
    var kids = Array.prototype.slice.call(arguments, 2);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v == null || v === false) return;
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = T.rich(v);
        else if (k === 'text') e.textContent = v;
        else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
        else if (k === 'dataset') Object.assign(e.dataset, v);
        else if (k.slice(0, 2) === 'on' && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
        else e.setAttribute(k, v === true ? '' : v);
      });
    }
    flat(kids).forEach(function (c) {
      if (c == null || c === false) return;
      e.append(c.nodeType ? c : document.createTextNode(c));
    });
    return e;
  };
  function flat(a) { return a.reduce(function (r, x) { return r.concat(Array.isArray(x) ? flat(x) : [x]); }, []); }

  var SVGNS = 'http://www.w3.org/2000/svg';
  T.svgEl = function (tag, attrs) {
    var e = document.createElementNS(SVGNS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    flat(Array.prototype.slice.call(arguments, 2)).forEach(function (c) {
      if (c == null) return;
      e.append(c.nodeType ? c : document.createTextNode(c));
    });
    return e;
  };

  /* ---------- numere ---------- */
  // formatează cu virgulă zecimală și minus tipografic; elimină zerourile finale
  T.fmt = function (x, d) {
    if (x == null || !isFinite(x)) return '–';
    if (d == null) d = 2;
    var s = Number(x).toFixed(d);
    if (s.indexOf('.') >= 0) s = s.replace(/0+$/, '').replace(/\.$/, '');
    if (s === '-0') s = '0';
    return s.replace('.', ',').replace('-', '−');
  };
  // păstrează zerourile finale
  T.fix = function (x, d) {
    if (x == null || !isFinite(x)) return '–';
    var s = Number(x).toFixed(d);
    if (s.replace(/[-0.]/g, '') === '') s = s.replace('-', '');
    return s.replace('.', ',').replace('-', '−');
  };
  T.sig = function (x, n) { return Number(Number(x).toPrecision(n)); };
  T.round = function (x, d) { var p = Math.pow(10, d || 0); return Math.round(x * p) / p; };
  T.sign = function (x, d) { return (x > 0 ? '+' : x < 0 ? '−' : '') + T.fmt(Math.abs(x), d); };
  T.clamp = function (x, a, b) { return Math.min(b, Math.max(a, x)); };

  // interpretează ce scrie elevul: acceptă virgulă sau punct, minus tipografic, unități în coadă
  // returnează o listă de valori candidate (ex.: "2.700" poate fi 2,7 sau 2700)
  T.parseNum = function (str) {
    if (typeof str === 'number') return [str];
    var s = String(str).trim().replace(/\s+/g, '').replace(/[−–—]/g, '-');
    var m = s.match(/[-+]?\d+(?:[.,]\d+)*(?:[eE][-+]?\d+)?/);
    if (!m) return [];
    var t = m[0], out = [];
    if (/^[-+]?\d{1,3}(\.\d{3})+$/.test(t)) out.push(parseFloat(t.replace(/\./g, '')));        // 2.700 -> 2700
    if (/^[-+]?\d{1,3}(,\d{3})+$/.test(t)) out.push(parseFloat(t.replace(/,/g, '')));         // 2,700 -> 2700
    var d = t.replace(/\./g, '#').replace(',', '.').replace(/#/g, '');
    if ((t.match(/[.,]/g) || []).length === 1) d = t.replace(',', '.');
    var v = parseFloat(d);
    if (isFinite(v)) out.push(v);
    return out;
  };

  T.near = function (x, a, tol, abs) {
    var t = Math.max(abs || 0, (tol == null ? 0.01 : tol) * Math.abs(a));
    return Math.abs(x - a) <= t + 1e-12;
  };

  /* ---------- aleatoriu cu sămânță ---------- */
  T.rng = function (seed) {
    var a = (seed >>> 0) || 1;
    function next() {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    var R = {
      next: next,
      int: function (lo, hi) { return lo + Math.floor(next() * (hi - lo + 1)); },
      step: function (lo, hi, s) { var n = Math.round((hi - lo) / s); return T.round(lo + s * Math.floor(next() * (n + 1)), 6); },
      pick: function (arr) { return arr[Math.floor(next() * arr.length)]; },
      chance: function (p) { return next() < p; },
      shuffle: function (arr) {
        var r = arr.slice();
        for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(next() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; }
        return r;
      }
    };
    return R;
  };

  /* ---------- notații: [[chimie]] și $matematică$ ---------- */
  T.ch = function (s) {
    return String(s)
      .replace(/<->|<=>/g, '⇄')
      .replace(/->/g, '→')
      .replace(/<-/g, '←')
      .replace(/\((s|l|g|aq)\)/g, '<i class="st">($1)</i>')
      .replace(/([A-Za-z)\]])(\d+)/g, '$1<sub>$2</sub>')
      .replace(/\^\{([^}]*)\}/g, '<sup>$1</sup>');
  };

  function matchBack(s, end) {            // s[end] === ')' → indexul lui '(' pereche
    var d = 0;
    for (var i = end; i >= 0; i--) {
      if (s[i] === ')') d++;
      else if (s[i] === '(') { d--; if (d === 0) return i; }
    }
    return -1;
  }
  function matchFwd(s, start) {           // s[start] === '(' → indexul lui ')' pereche
    var d = 0;
    for (var i = start; i < s.length; i++) {
      if (s[i] === '(') d++;
      else if (s[i] === ')') { d--; if (d === 0) return i; }
    }
    return -1;
  }
  function fracs(s) {                     // (a)//(b) → fracție
    var guard = 0, idx;
    while ((idx = s.indexOf(')//(')) >= 0 && guard++ < 40) {
      var a = matchBack(s, idx);
      var b = matchFwd(s, idx + 3);
      if (a < 0 || b < 0) break;
      var num = s.slice(a + 1, idx), den = s.slice(idx + 4, b);
      s = s.slice(0, a) + '<span class="frac"><span class="n">' + num + '</span><span class="d">' + den + '</span></span>' + s.slice(b + 1);
    }
    return s;
  }
  T.mt = function (s) {
    s = fracs(String(s));
    return s
      .replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>')
      .replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>')
      .replace(/_([A-Za-z0-9ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω′*]+)/g, '<sub>$1</sub>')
      .replace(/\^([A-Za-z0-9*+°−-]+)/g, '<sup>$1</sup>')
      .replace(/<->/g, '⇄')
      .replace(/=>/g, '⟹')
      .replace(/->/g, '→')
      .replace(/~=/g, '≈');
  };
  T.rich = function (h) {
    return String(h)
      .replace(/\[\[([\s\S]+?)\]\]/g, function (m, s) { return '<span class="ch">' + T.ch(s) + '</span>'; })
      .replace(/\$([^$]+?)\$/g, function (m, s) { return '<span class="mt">' + T.mt(s) + '</span>'; });
  };
  // scurtături pentru șabloane în JS
  T.C = function (s) { return '[[' + s + ']]'; };

  // indici Unicode pentru contexte fără HTML (ex.: <option>)
  T.uni = function (f) {
    var sub = '₀₁₂₃₄₅₆₇₈₉';
    return String(f).replace(/([A-Za-z)\]])(\d+)/g, function (m, a, d) { return a + d.replace(/\d/g, function (x) { return sub[+x]; }); });
  };

  /* ---------- masă molară ---------- */
  var AM = { H: 1, Li: 7, C: 12, N: 14, O: 16, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, K: 39, Ca: 40, Fe: 56, Cu: 64, Zn: 65, Br: 80, Ag: 108, Ba: 137, Pb: 207 };
  T.atomicMasses = AM;
  T.molarMass = function (f) {
    f = String(f).replace(/\((s|l|g|aq)\)\s*$/, '');
    var i = 0;
    function num() { var m = /^\d+/.exec(f.slice(i)); if (m) { i += m[0].length; return parseInt(m[0], 10); } return 1; }
    function parse() {
      var total = 0;
      while (i < f.length) {
        var c = f[i];
        if (c === '(') { i++; var sub = parse(); total += sub * num(); }
        else if (c === ')') { i++; return total; }
        else if (/[A-Z]/.test(c)) {
          var sym = c; i++;
          while (i < f.length && /[a-z]/.test(f[i])) { sym += f[i]; i++; }
          if (!(sym in AM)) throw new Error('Element necunoscut: ' + sym);
          total += AM[sym] * num();
        } else i++;
      }
      return total;
    }
    return parse();
  };

  /* ---------- stocare (rezistă dacă localStorage nu e disponibil) ---------- */
  T.store = (function () {
    var KEY = 'termochimie.v1', mem = {}, ok = true;
    try { var s = localStorage.getItem(KEY); if (s) mem = JSON.parse(s) || {}; } catch (e) { ok = false; }
    function save() { if (!ok) return; try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) { ok = false; } }
    function walk(path, create) {
      var parts = path.split('.'), o = mem;
      for (var i = 0; i < parts.length - 1; i++) {
        if (typeof o[parts[i]] !== 'object' || o[parts[i]] === null) { if (!create) return [null, null]; o[parts[i]] = {}; }
        o = o[parts[i]];
      }
      return [o, parts[parts.length - 1]];
    }
    return {
      get: function (path, def) { var w = walk(path, false); if (!w[0]) return def; var v = w[0][w[1]]; return v === undefined ? def : v; },
      set: function (path, val) { var w = walk(path, true); w[0][w[1]] = val; save(); T.bus.emit('store', path); },
      update: function (path, fn, def) { this.set(path, fn(this.get(path, def))); },
      reset: function () { mem = {}; save(); T.bus.emit('store', '*'); }
    };
  })();

  /* ---------- evenimente simple ---------- */
  T.bus = {
    _h: {},
    on: function (e, f) { (this._h[e] = this._h[e] || []).push(f); },
    emit: function (e, d) { (this._h[e] || []).forEach(function (f) { try { f(d); } catch (err) { console.error(err); } }); }
  };

  /* ---------- diverse ---------- */
  T.uid = (function () { var n = 0; return function (p) { return (p || 'u') + (++n); }; })();
  T.debounce = function (f, ms) { var t; return function () { var a = arguments, c = this; clearTimeout(t); t = setTimeout(function () { f.apply(c, a); }, ms); }; };
  T.sum = function (a) { return a.reduce(function (s, x) { return s + x; }, 0); };

  // fracții frumoase pentru coeficienți: 0.5 → ½, 1.5 → 3/2
  T.coef = function (c) {
    var a = Math.abs(c);
    if (Math.abs(a - 1) < 1e-9) return '';
    if (Math.abs(a - 0.5) < 1e-9) return '½';
    if (Math.abs(a - 1.5) < 1e-9) return '3/2';
    if (Math.abs(a - 2.5) < 1e-9) return '5/2';
    if (Math.abs(a - 3.5) < 1e-9) return '7/2';
    return T.fmt(a, 3);
  };

  // export pentru testare în Node
  if (typeof module !== 'undefined' && module.exports) module.exports = T;
})(typeof window !== 'undefined' ? window : globalThis);
