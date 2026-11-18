/* Corso Introduzione a Python · Lezione 3 · simulazioni:
   calcolatrice degli operatori con le regole di Python, caramelle (// e %), precedenza passo passo,
   costruttore di print() con sep ed end, esploratore di format() (eseguito con Python vero). */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  /* ---------- Aritmetica con le regole di Python: int esatti (BigInt), float, /, //, %, ** ---------- */
  class PyErr extends Error {}
  const num = s => {
    const t = String(s).trim();
    if (/^[+-]?\d+$/.test(t)) return { v: BigInt(t), f: false };
    if (/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(t)) return { v: Number(t), f: true };
    throw new PyErr('valore non valido: ' + t);
  };
  const fl = x => Number(x.v);
  const repr = x => {
    if (!x.f) return String(x.v);
    const n = x.v;
    if (Number.isNaN(n)) return 'nan';
    if (!Number.isFinite(n)) return n > 0 ? 'inf' : '-inf';
    if (Number.isInteger(n) && Math.abs(n) < 1e16) return n.toFixed(1);
    return String(n).replace(/e([+-])(\d)$/, 'e$10$2');
  };
  const floorDivBig = (a, b) => { const q = a / b; return (a % b !== 0n && ((a < 0n) !== (b < 0n))) ? q - 1n : q; };
  function op(o, a, b) {
    const both = !a.f && !b.f;
    const zero = x => (x.f ? x.v === 0 : x.v === 0n);
    switch (o) {
      case '+': return both ? { v: a.v + b.v, f: false } : { v: fl(a) + fl(b), f: true };
      case '-': return both ? { v: a.v - b.v, f: false } : { v: fl(a) - fl(b), f: true };
      case '*': return both ? { v: a.v * b.v, f: false } : { v: fl(a) * fl(b), f: true };
      case '/': if (zero(b)) throw new PyErr('ZeroDivisionError: division by zero'); return { v: fl(a) / fl(b), f: true };
      case '//': if (zero(b)) throw new PyErr('ZeroDivisionError: integer division or modulo by zero');
        return both ? { v: floorDivBig(a.v, b.v), f: false } : { v: Math.floor(fl(a) / fl(b)), f: true };
      case '%': if (zero(b)) throw new PyErr('ZeroDivisionError: integer modulo by zero');
        if (both) { const r = a.v % b.v; return { v: (r !== 0n && ((r < 0n) !== (b.v < 0n))) ? r + b.v : r, f: false }; }
        { const r = fl(a) - fl(b) * Math.floor(fl(a) / fl(b)); return { v: r, f: true }; }
      case '**':
        if (both && b.v >= 0n) { if (b.v > 2000n) throw new PyErr('risultato troppo grande per questa calcolatrice'); return { v: a.v ** b.v, f: false }; }
        if (zero(a) && fl(b) < 0) throw new PyErr('ZeroDivisionError: 0.0 cannot be raised to a negative power');
        { const r = Math.pow(fl(a), fl(b)); if (Number.isNaN(r)) throw new PyErr('il risultato sarebbe un numero complesso'); return { v: r, f: true }; }
    }
  }
  const neg = a => a.f ? { v: -a.v, f: true } : { v: -a.v, f: false };

  /* ---------- 1. Calcolatrice degli operatori ---------- */
  const calc = $('#opCalc');
  if (calc) {
    const A = $('#opA'), B = $('#opB'), tb = $('tbody', calc);
    const OPS = [['+', 'addizione'], ['-', 'sottrazione'], ['*', 'moltiplicazione'], ['/', 'divisione'], ['//', 'divisione intera'], ['%', 'modulo (resto)'], ['**', 'elevamento a potenza']];
    function upd() {
      tb.innerHTML = '';
      let a, b;
      try { a = num(A.value); b = num(B.value); } catch (e) { const r = el('tr'), td = el('td', 'err', 'Scrivi due numeri (i decimali con il punto).'); td.colSpan = 4; r.append(td); tb.append(r); return; }
      OPS.forEach(([o, n]) => {
        const par = v => /^-/.test(v.trim()) ? '(' + v.trim() + ')' : v.trim();
        const r = el('tr'); const c0 = el('td'); c0.append(el('code', '', par(A.value) + ' ' + o + ' ' + par(B.value))); r.append(c0, el('td', '', n));
        try { const x = op(o, a, b), s = repr(x); r.append(el('td', 'res', s.length > 60 ? s.slice(0, 57) + '…' : s)); const t = el('td'); t.append(el('span', 'tpill t-' + (x.f ? 'float' : 'int'), x.f ? 'float' : 'int')); r.append(t); }
        catch (e) { const td = el('td', 'err', e.message); td.colSpan = 2; r.append(td); }
        tb.append(r);
      });
    }
    A.addEventListener('input', upd); B.addEventListener('input', upd);
    calc.querySelectorAll('[data-a]').forEach(x => x.onclick = () => { A.value = x.dataset.a; B.value = x.dataset.b; upd(); });
    upd();
  }

  /* ---------- 2. Caramelle: divisione intera e modulo ---------- */
  const cd = $('#candy');
  if (cd) {
    const N = $('#cdN'), K = $('#cdK'), box = $('.candy-box', cd), res = $('.candy-res', cd);
    const COL = ['#d9822b', '#176b87', '#2a9d8f', '#8e5bc7', '#c0562b', '#3a7d44', '#b5838d', '#5b7fc7'];
    function upd() {
      const n = +N.value, k = +K.value, q = Math.floor(n / k), r = n % k;
      $('#cdNV').textContent = n; $('#cdKV').textContent = k;
      box.innerHTML = '';
      for (let i = 0; i < k; i++) {
        const g = el('div', 'candy-friend'); g.append(el('span', 'who', 'amico ' + (i + 1)));
        const c = el('div', 'candies'); for (let j = 0; j < q; j++) { const d = el('i'); d.style.background = COL[i % COL.length]; c.append(d); }
        g.append(c); box.append(g);
      }
      const rest = el('div', 'candy-friend rest'); rest.append(el('span', 'who', 'avanzano'));
      const c = el('div', 'candies'); for (let j = 0; j < r; j++) c.append(el('i')); rest.append(c); box.append(rest);
      res.innerHTML = '';
      [[n + ' // ' + k + ' = ' + q, 'caramelle a testa'], [n + ' % ' + k + ' = ' + r, 'caramelle che avanzano'], [n + ' / ' + k + ' = ' + repr({ v: n / k, f: true }), 'divisione «normale»: sempre float']].forEach(([a, b]) => { const s = el('div', 'stat'); s.append(el('span', '', b), el('b', '', a)); res.append(s); });
      $('#cdCheck').textContent = 'Controllo: ' + k + ' × ' + q + ' + ' + r + ' = ' + (k * q + r);
    }
    N.oninput = K.oninput = upd; upd();
  }

  /* ---------- 3. Precedenza degli operatori, passo passo ---------- */
  const pr = $('#prec');
  if (pr) {
    const inp = $('#prIn'), out = $('.prec-steps', pr), msg = $('#prMsg');
    const PREC = { '+': 1, '-': 1, '*': 2, '/': 2, '//': 2, '%': 2, '**': 4 };
    function tokenize(s) {
      const t = [], re = /\s*(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+|\*\*|\/\/|[-+*/%()])/y;
      let m, i = 0; s = s.trim();
      while (i < s.length) { re.lastIndex = i; m = re.exec(s); if (!m) throw new PyErr('carattere non valido vicino a «' + s.slice(i, i + 5) + '»'); t.push(m[1]); i = re.lastIndex; while (s[i] === ' ') i++; }
      return t;
    }
    function parse(s) {
      const t = tokenize(s); let p = 0;
      const peek = () => t[p], next = () => t[p++];
      function primary() {
        const k = next();
        if (k === undefined) throw new PyErr('espressione incompleta');
        if (k === '(') { const e = expr(0); if (next() !== ')') throw new PyErr('manca una parentesi chiusa'); return e; }
        if (k === '-' || k === '+') { const e = unary(); return k === '-' ? { u: '-', e } : e; }
        if (/^[\d.]/.test(k)) return { n: num(k) };
        throw new PyErr('simbolo inatteso «' + k + '»');
      }
      function power() { const b = primary(); if (peek() === '**') { next(); return { o: '**', l: b, r: unary() }; } return b; }   // ** è associativo a destra e lega più del meno unario a sinistra
      function unary() { if (peek() === '-' || peek() === '+') { const k = next(); const e = unary(); return k === '-' ? { u: '-', e } : e; } return power(); }
      function expr(min) {
        let l = unary();
        while (peek() && PREC[peek()] && PREC[peek()] < 4 && PREC[peek()] >= Math.max(min, 1)) {
          const o = next(); const r = expr(PREC[o] + 1); l = { o, l, r };
        }
        return l;
      }
      const e = expr(1); if (p < t.length) throw new PyErr('simbolo in più: «' + t[p] + '»'); return e;
    }
    const prec = n => n.n ? 9 : n.u ? 3 : PREC[n.o];
    function show(n, parentP, right) {
      if (n.n) { const s = repr(n.n); return n.n.v < 0 && parentP > 0 ? '(' + s + ')' : s; }
      if (n.u) { const s = '-' + show(n.e, 3); return parentP > 3 ? '(' + s + ')' : s; }
      const p = PREC[n.o], s = show(n.l, n.o === '**' ? 5 : p, false) + ' ' + n.o + ' ' + show(n.r, n.o === '**' ? 4 : p + 0.5, true);
      return (p < parentP) ? '(' + s + ')' : s;
    }
    function step(n) {   // riduce la prima operazione pronta, nell'ordine in cui la eseguirebbe Python
      if (n.n) return null;
      if (n.u) { if (n.e.n) return { node: { n: neg(n.e.n) }, did: '-' + repr(n.e.n) }; const s = step(n.e); return s && { node: { u: '-', e: s.node }, did: s.did }; }
      if (n.l.n && n.r.n) return { node: { n: op(n.o, n.l.n, n.r.n) }, did: repr(n.l.n) + ' ' + n.o + ' ' + repr(n.r.n), o: n.o };
      const sl = step(n.l); if (sl) return { node: { o: n.o, l: sl.node, r: n.r }, did: sl.did, o: sl.o };
      const sr = step(n.r); return sr && { node: { o: n.o, l: n.l, r: sr.node }, did: sr.did, o: sr.o };
    }
    function run() {
      out.innerHTML = ''; msg.textContent = '';
      let n; try { n = parse(inp.value); } catch (e) { msg.textContent = e.message; return; }
      const li0 = el('li'); li0.append(el('code', '', show(n, 0))); out.append(li0);
      let guard = 0;
      try {
        for (let s = step(n); s && guard < 30; s = step(n), guard++) {
          const prev = show(n, 0); n = s.node; if (show(n, 0) === prev) continue;
          const li = el('li'); li.append(el('code', '', show(n, 0)), el('span', 'did', '← ' + s.did)); out.append(li);
        }
        msg.textContent = 'Risultato: ' + repr(n.n) + ' (tipo ' + (n.n.f ? 'float' : 'int') + ')';
      } catch (e) { msg.textContent = e.message; }
    }
    $('#prGo').onclick = run; inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); run(); } });
    pr.querySelectorAll('[data-expr]').forEach(b => b.onclick = () => { inp.value = b.dataset.expr; run(); });
    run();
  }

  /* ---------- 4. Costruttore di print() con sep ed end ---------- */
  const pb = $('#printBuilder');
  if (pb) {
    const a = $('#pbA'), b = $('#pbB'), c = $('#pbC'), sep = $('#pbSep'), end = $('#pbEnd'), vis = $('#pbVis'), code = $('#pbCode'), out = $('#pbOut');
    const lit = v => /^-?\d+(\.\d+)?$/.test(v.trim()) ? v.trim() : JSON.stringify(v).replace(/^"|"$/g, '"');
    const escShow = s => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    function upd() {
      const S = sep.value.replace(/\\n/g, '\n').replace(/\\t/g, '\t'), E = end.value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
      const args = [a.value, b.value, c.value].map(lit).join(', ');
      const kw = (sep.value !== ' ' ? ', sep="' + escShow(S) + '"' : '') + (end.value !== '\\n' ? ', end="' + escShow(E) + '"' : '');
      code.textContent = 'print(' + args + kw + ')\nprint("riga successiva")';
      const vals = [a.value, b.value, c.value].map(v => /^-?\d+(\.\d+)?$/.test(v.trim()) ? v.trim() : v);
      const text = vals.join(S) + E + 'riga successiva\n';
      out.innerHTML = '';
      if (!vis.checked) { out.textContent = text; return; }
      for (const ch of text) {
        if (ch === ' ') out.append(el('span', 'vis-ws', '·'));
        else if (ch === '\t') out.append(el('span', 'vis-ws', '→   '));
        else if (ch === '\n') { out.append(el('span', 'vis-ws', '↵')); out.append('\n'); }
        else out.append(ch);
      }
    }
    [a, b, c, sep, end].forEach(x => x.addEventListener('input', upd)); vis.onchange = upd; upd();
  }

  /* ---------- 5. Esploratore di format() ---------- */
  const fx = $('#fmtExp');
  if (fx) {
    const v = $('#fxV'), sp = $('#fxS'), out = $('#fxOut'), note = $('#fxNote');
    const NOTE = { '.2f': 'f = numero decimale «fisso»; .2 = due cifre dopo il punto, con arrotondamento.', '8.2f': '8 = larghezza minima di 8 caratteri (spazi a sinistra): utile per incolonnare.', '08.2f': 'Come sopra, ma riempie con zeri invece che con spazi.', ',.2f': 'La virgola inserisce il separatore delle migliaia (all’inglese: virgola per le migliaia, punto per i decimali).', '.1%': 'Moltiplica per 100 e aggiunge il simbolo %.', '.3e': 'Notazione esponenziale (scientifica) con 3 decimali.', '>10': 'Allinea a destra in 10 caratteri.', '<10': 'Allinea a sinistra in 10 caratteri.', '^10': 'Centra in 10 caratteri.', 'd': 'Intero in base 10: funziona solo con numeri int.', 'b': 'Intero scritto in binario!' };
    async function go() {
      const val = v.value.trim(), spec = sp.value;
      if (!/^-?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(val)) { out.textContent = 'Scrivi un numero (decimali con il punto).'; return; }
      out.textContent = 'Chiedo a Python…';
      const pyCode = 'x = ' + val + '\nprint(repr(format(x, ' + JSON.stringify(spec) + ')))\nprint(repr(f"{x:' + spec + '}"))';
      let r; try { r = await PyRunner.run(pyCode); } catch (e) { r = { fatal: e.message }; }
      if (r.fatal || r.timeout) { out.textContent = r.fatal || 'Tempo scaduto.'; return; }
      if (r.errore) { out.textContent = 'format(' + val + ', "' + spec + '")  →  ' + r.errore.tipo + ': ' + r.errore.msg; note.textContent = spec === 'd' || spec === 'b' ? 'Questo formato vuole un numero intero: togli il punto decimale.' : ''; return; }
      const [res] = r.out.trim().split('\n');
      out.textContent = 'format(' + val + ', "' + spec + '")  →  ' + res + '\nf"{x:' + spec + '}"        →  ' + res + '   (stesso risultato con una f-string)';
      note.textContent = NOTE[spec] || '';
    }
    $('#fxGo').onclick = go; sp.onchange = go;
    v.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
  }
})();
