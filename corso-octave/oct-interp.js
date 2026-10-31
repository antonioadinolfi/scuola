/* Corso Octave · interprete didattico di un sottoinsieme di GNU Octave / MATLAB.
   Matrici reali e complesse (memorizzate per colonne), intervalli, indicizzazione con end e logica,
   operatori matriciali e puntuali, controllo di flusso, funzioni nello script, funzioni anonime,
   visualizzazione dei risultati nello stile di Octave e comandi di grafica 2D (plot, subplot, …).
   Usato dal Web Worker del corso; esportato anche per Node (collaudo). */
(function (root) {
"use strict";

class OctError extends Error { constructor(msg, line) { super(msg); this.oct = true; this.line = line || null; } }
const err = m => { throw new OctError(m); };

/* ======================= VALORI ======================= */
function M(r, c, re, im, lg) { return { t: 'm', r, c, re: re || new Float64Array(r * c), im: im || null, lg: !!lg }; }
const num = x => M(1, 1, Float64Array.of(x));
const cnum = (a, b) => b === 0 ? num(a) : M(1, 1, Float64Array.of(a), Float64Array.of(b));
const bool = b => M(1, 1, Float64Array.of(b ? 1 : 0), null, true);
const str = s => ({ t: 's', s: String(s) });
const empty = () => M(0, 0);
const isM = v => v && v.t === 'm';
const isStr = v => v && v.t === 's';
const isFn = v => v && v.t === 'f';
const isCell = v => v && v.t === 'c';
function toM(v, what) {
  if (isM(v)) return v;
  if (isStr(v)) { const m = M(v.s.length ? 1 : 0, v.s.length); for (let i = 0; i < v.s.length; i++) m.re[i] = v.s.charCodeAt(i); return m; }
  if (isFn(v)) err((what || 'operator') + ': function handle non utilizzabile come numero');
  if (isCell(v)) err((what || 'operator') + ': binary operator not implemented for \'cell\' operations');
  err('valore non valido');
}
const numel = v => isStr(v) ? v.s.length : isCell(v) ? v.items.length : isM(v) ? v.r * v.c : 1;
const dims = v => isStr(v) ? [v.s.length ? 1 : 0, v.s.length] : isCell(v) ? [v.r, v.c] : isM(v) ? [v.r, v.c] : [1, 1];
const dimStr = v => dims(v).join('x');
function narrow(m) { if (m.im) { let z = true; for (let i = 0; i < m.im.length; i++) if (m.im[i] !== 0) { z = false; break; } if (z) m.im = null; } return m; }
function clone(v) {
  if (isM(v)) return M(v.r, v.c, v.re.slice(), v.im ? v.im.slice() : null, v.lg);
  if (isCell(v)) return { t: 'c', r: v.r, c: v.c, items: v.items.map(clone) };
  if (isStr(v)) return str(v.s);
  return v;
}
function scalar(v, what) {
  const m = toM(v, what);
  if (m.r * m.c < 1) err((what || 'valore') + ': atteso uno scalare, ricevuto un valore vuoto');
  return m.re[0];
}
const truthy = v => { const m = toM(v); if (m.r * m.c === 0) return false; for (let i = 0; i < m.re.length; i++) { if (Number.isNaN(m.re[i])) err('if: conversion of NaN to logical value'); if (m.re[i] === 0 && !(m.im && m.im[i] !== 0)) return false; } return true; };
const textOf = v => isStr(v) ? v.s : isM(v) ? String.fromCharCode(...v.re) : err('atteso un testo');

/* ======================= LEXER ======================= */
const KW = new Set(['if', 'elseif', 'else', 'end', 'endif', 'for', 'endfor', 'while', 'endwhile', 'do', 'until', 'break', 'continue', 'function', 'endfunction', 'return', 'switch', 'case', 'otherwise', 'endswitch', 'try', 'catch', 'end_try_catch', 'global', 'persistent']);
const CMDS = new Set(['hold', 'grid', 'format', 'clear', 'close', 'clc', 'axis', 'box', 'more', 'pkg', 'clf', 'who', 'whos', 'figure', 'clearvars', 'warning', 'help', 'doc', 'legend']);
const OPS = ['...', '.^', ".'", '.*', './', '.\\', '==', '~=', '!=', '<=', '>=', '&&', '||', '+', '-', '*', '/', '\\', '^', '<', '>', '&', '|', '~', '!', '=', '(', ')', '[', ']', '{', '}', ',', ';', ':', '@', '.'];

function lex(src) {
  const toks = [], stack = [];
  let i = 0, line = 1, spaced = false;
  const n = src.length;
  const last = () => toks[toks.length - 1];
  const push = (k, v, start, extra) => { const t = Object.assign({ k, v, line, pos: start, end: i, sp: spaced }, extra || {}); toks.push(t); spaced = false; return t; };
  const inMat = () => stack.length && (stack[stack.length - 1] === '[' || stack[stack.length - 1] === '{');
  const valueEnd = t => t && (t.k === 'num' || t.k === 'str' || t.k === 'id' || (t.k === 'kw' && t.v === 'end' && stack.length) || (t.k === 'op' && (t.v === ')' || t.v === ']' || t.v === '}' || t.v === "'" || t.v === ".'")));
  const stmtStart = () => { const t = last(); return !t || t.k === 'nl' || (t.k === 'op' && (t.v === ';' || t.v === ',') && !stack.length); };
  while (i < n) {
    const ch = src[i];
    // commenti a blocco %{ ... %}
    if ((ch === '%' || ch === '#') && src[i + 1] === '{' && /^[ \t]*$/.test(src.slice(src.lastIndexOf('\n', i - 1) + 1, i)) && /^[%#]\{[ \t]*(\r?\n|$)/.test(src.slice(i))) {
      let depth = 0, j = i;
      while (j < n) {
        const le = src.indexOf('\n', j), l = src.slice(j, le < 0 ? n : le).trim();
        if (l === '%{' || l === '#{') depth++; else if (l === '%}' || l === '#}') depth--;
        if (le < 0) { j = n; break; }
        j = le + 1; line++;
        if (depth === 0) break;
      }
      i = j; if (!inMat()) push('nl', '\n', i); continue;
    }
    if (ch === '%' || ch === '#') { while (i < n && src[i] !== '\n') i++; continue; }
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      while (i < n && (src[i] === ' ' || src[i] === '\t' || src[i] === '\r')) i++;
      spaced = true;
      if (inMat() && valueEnd(last())) {
        const c = src[i], c2 = src[i + 1];
        const startsValue = /[A-Za-z0-9_"'@\[({]/.test(c || '') || (c === '.' && /\d/.test(c2 || '')) ||
          ((c === '~' || c === '!') && c2 !== '=') ||
          ((c === '+' || c === '-') && c2 && !/[ \t\r\n=]/.test(c2) && !(c2 === c));
        if (startsValue) { const t = push('op', ',', i); t.auto = true; spaced = true; }
      }
      continue;
    }
    if (src.startsWith('...', i)) { while (i < n && src[i] !== '\n') i++; if (i < n) { i++; line++; } spaced = true; continue; }
    if (ch === '\n') {
      i++;
      if (inMat()) { const t = last(); if (!(t && t.k === 'op' && (t.v === ';' || t.v === '[' || t.v === '{' || (t.v === ',' && !t.auto)))) { if (t && t.auto) toks.pop(); push('op', ';', i - 1); } }
      else if (!stack.length) push('nl', '\n', i - 1);
      line++; spaced = true; continue;
    }
    // sintassi a comando: hold on, grid on, format long, clear x y
    if (/[A-Za-z]/.test(ch) && stmtStart() && !stack.length) {
      const m = /^([A-Za-z]\w*)([ \t]+)([A-Za-z0-9\-][^;,\n%#]*)/.exec(src.slice(i));
      if (m && CMDS.has(m[1]) && !/^[=(]/.test(m[3]) && !/^\w+\s*=[^=]/.test(m[3]) && !/^[-+*/^]\s/.test(m[3])) {
        const start = i;
        i += m[1].length; push('id', m[1], start);
        push('op', '(', i);
        const words = m[3].trim().split(/[ \t]+/);
        words.forEach((w, k) => { if (k) push('op', ',', i); push('str', w, i); });
        i = start + m[0].length;
        push('op', ')', i);
        continue;
      }
    }
    if (/[A-Za-z_]/.test(ch)) {
      const start = i; while (i < n && /\w/.test(src[i])) i++;
      const w = src.slice(start, i);
      if (KW.has(w)) push('kw', w, start); else push('id', w, start);
      continue;
    }
    if (/\d/.test(ch) || (ch === '.' && /\d/.test(src[i + 1] || ''))) {
      const start = i;
      const m = /^(\d+\.?\d*|\.\d+)([eEdD][+-]?\d+)?/.exec(src.slice(i));
      i += m[0].length;
      let v = Number(m[0].replace(/[dD]/, 'e'));
      let im = false;
      if (/[ijIJ]/.test(src[i] || '') && !/\w/.test(src[i + 1] || '')) { im = true; i++; }
      push('num', v, start, { im });
      continue;
    }
    if (ch === "'" || ch === '"') {
      if (ch === "'" && valueEnd(last()) && !spaced) { i++; push('op', "'", i - 1); continue; }
      if (ch === "'" && valueEnd(last()) && spaced && !inMat()) { i++; push('op', "'", i - 1); continue; }
      const start = i, q = ch; i++;
      let s = '';
      while (true) {
        if (i >= n || src[i] === '\n') throw new OctError('parse error: stringa non terminata (manca ' + q + ')', line);
        const c = src[i];
        if (c === q) { if (src[i + 1] === q) { s += q; i += 2; continue; } i++; break; }
        if (q === '"' && c === '\\') {
          const e = src[i + 1]; const map = { n: '\n', t: '\t', '\\': '\\', '"': '"', "'": "'", r: '\r', a: '\x07' };
          s += map[e] !== undefined ? map[e] : '\\' + e; i += 2; continue;
        }
        s += c; i++;
      }
      push('str', s, start, { dq: q === '"' });
      continue;
    }
    const op = OPS.find(o => src.startsWith(o, i));
    if (!op) throw new OctError("parse error: carattere non valido '" + ch + "'", line);
    const start = i; i += op.length;
    if (op === '(' || op === '[' || op === '{') stack.push(op);
    if (op === ')' || op === ']' || op === '}') {
      const t = last(); if ((op === ']' || op === '}') && t && t.auto) toks.pop();
      stack.pop();
    }
    push('op', op, start);
  }
  push('nl', '\n', i); push('eof', null, i);
  return toks;
}

/* ======================= PARSER ======================= */
const END_WORDS = { if: ['end', 'endif'], for: ['end', 'endfor'], while: ['end', 'endwhile'], switch: ['end', 'endswitch'], function: ['end', 'endfunction'], try: ['end', 'end_try_catch'] };

function parse(src) {
  const toks = lex(src);
  let p = 0, idxDepth = 0, matDepth = 0;
  const funcs = new Map();
  const peek = (o = 0) => toks[p + o];
  const next = () => toks[p++];
  const isOp = (v, t = peek()) => t.k === 'op' && t.v === v;
  const isKw = (v, t = peek()) => t.k === 'kw' && (Array.isArray(v) ? v.includes(t.v) : t.v === v);
  const fail = (msg, t = peek()) => { const ln = (t.k === 'eof' || t.k === 'nl') && p > 0 ? toks[Math.max(0, p - 1)].line : t.line; throw new OctError('parse error: ' + msg, ln); };
  const expectOp = (v, what) => { if (!isOp(v)) fail(what || ("atteso '" + v + "'" + describe(peek()))); return next(); };
  function describe(t) { if (t.k === 'eof' || t.k === 'nl') return ' a fine riga'; return " vicino a '" + (t.k === 'str' ? "'" + t.v + "'" : t.v) + "'"; }
  const skipSep = () => { while (peek().k === 'nl' || isOp(';') || isOp(',')) next(); };

  function program() {
    const body = block([]);
    if (peek().k !== 'eof') fail("'" + peek().v + "' inatteso");
    return { body, funcs };
  }
  function block(terms) {
    const out = [];
    while (true) {
      skipSep();
      const t = peek();
      if (t.k === 'eof') { if (terms.length && !terms.includes('<eof>')) fail("manca '" + terms[0] + "' per chiudere un blocco aperto", t); return out; }
      if (t.k === 'kw' && terms.includes(t.v)) return out;
      if (t.k === 'kw' && ['end', 'endif', 'endfor', 'endwhile', 'endfunction', 'endswitch', 'else', 'elseif', 'case', 'otherwise', 'catch', 'until', 'end_try_catch'].includes(t.v)) fail("'" + t.v + "' senza un blocco aperto (if/for/while/function)", t);
      const s = statement(); if (s) out.push(s);
    }
  }
  function endStmt(s) {
    if (isOp(';')) { next(); s.quiet = true; if (isOp(',')) next(); return s; }
    if (isOp(',') || peek().k === 'nl') { next(); return s; }
    if (peek().k === 'eof' || peek().k === 'kw') return s;
    if (isOp('=')) fail("'=' inatteso: per confrontare due valori usa == (doppio uguale)");
    fail("'" + peek().v + "' inatteso" + (peek().k === 'id' || peek().k === 'num' ? ': forse manca un operatore (es. *) o una virgola?' : ''));
  }
  function closeBlock(kind) {
    const t = peek();
    if (!isKw(END_WORDS[kind])) fail("manca '" + END_WORDS[kind][0] + "' per chiudere '" + kind + "'", t);
    next();
  }
  function statement() {
    const t = peek(), line = t.line;
    if (t.k === 'kw') {
      next();
      switch (t.v) {
        case 'if': {
          const clauses = []; let cond = expr(); let body = block(['elseif', 'else', 'end', 'endif']);
          clauses.push({ cond, body });
          let els = null;
          while (true) {
            if (isKw('elseif')) { next(); skipSep(); cond = expr(); body = block(['elseif', 'else', 'end', 'endif']); clauses.push({ cond, body }); }
            else if (isKw('else')) { next(); els = block(['end', 'endif']); }
            else break;
          }
          closeBlock('if');
          return endStmt({ type: 'if', clauses, els, line });
        }
        case 'for': {
          let paren = false; if (isOp('(')) { paren = true; next(); }
          if (peek().k !== 'id') fail('dopo for serve il nome della variabile del ciclo');
          const v = next().v; expectOp('=', "nel ciclo for serve '=' (es. for k = 1:10)");
          const e = expr(); if (paren) expectOp(')');
          const body = block(['end', 'endfor']); closeBlock('for');
          return endStmt({ type: 'for', v, e, body, line });
        }
        case 'while': { const cond = expr(); const body = block(['end', 'endwhile']); closeBlock('while'); return endStmt({ type: 'while', cond, body, line }); }
        case 'do': { const body = block(['until']); next(); const cond = expr(); return endStmt({ type: 'do', cond, body, line }); }
        case 'switch': {
          const e = expr(); skipSep(); const cases = []; let other = null;
          while (isKw('case')) { next(); const v = expr(); const body = block(['case', 'otherwise', 'end', 'endswitch']); cases.push({ v, body }); }
          if (isKw('otherwise')) { next(); other = block(['end', 'endswitch']); }
          closeBlock('switch');
          return endStmt({ type: 'switch', e, cases, other, line });
        }
        case 'try': {
          const body = block(['catch', 'end', 'end_try_catch']); let id = null, cbody = [];
          if (isKw('catch')) { next(); if (peek().k === 'id' && toks[p + 1].k === 'nl') id = next().v; cbody = block(['end', 'end_try_catch']); }
          closeBlock('try');
          return endStmt({ type: 'try', body, id, cbody, line });
        }
        case 'break': case 'continue': case 'return': return endStmt({ type: t.v, line });
        case 'global': case 'persistent': { const names = []; while (peek().k === 'id') names.push(next().v); return endStmt({ type: 'global', names, line }); }
        case 'function': { funcDef(t); return null; }
        default: fail("'" + t.v + "' inatteso", t);
      }
    }
    // assegnazione multipla [a, b] = f(...)
    if (isOp('[')) {
      let q = p, depth = 0;
      for (; q < toks.length; q++) { const x = toks[q]; if (x.k === 'op' && (x.v === '[' || x.v === '(' || x.v === '{')) depth++; else if (x.k === 'op' && (x.v === ']' || x.v === ')' || x.v === '}')) { depth--; if (depth === 0) break; } else if (x.k === 'nl' || x.k === 'eof') break; }
      if (toks[q + 1] && toks[q + 1].k === 'op' && toks[q + 1].v === '=') {
        next(); const lhs = [];
        while (!isOp(']')) {
          if (isOp(',')) { next(); continue; }
          if (isOp('~') || isOp('!')) { next(); lhs.push(null); continue; }
          lhs.push(lvalue(postfix()));
        }
        next(); expectOp('=');
        const rhs = expr();
        return endStmt({ type: 'massign', lhs, rhs, line });
      }
    }
    const e = expr();
    if (isOp('=')) {
      next();
      const lhs = lvalue(e);
      const rhs = expr();
      return endStmt({ type: 'assign', lhs, rhs, line });
    }
    if (isOp('+=') || isOp('-=')) fail('operatore non supportato');
    return endStmt({ type: 'expr', e, line });
  }
  function lvalue(e) {
    if (e.type === 'id') return e;
    if (e.type === 'index' && e.obj.type === 'id') return e;
    throw new OctError("parse error: a sinistra di '=' serve il nome di una variabile" + (e.type === 'bin' && e.op === '==' ? '' : ' (per confrontare due valori usa ==)'), e.line);
  }
  function funcDef(t) {
    let outs = [], name;
    // function [a,b] = nome(x)   |  function a = nome(x)  |  function nome(x)
    if (isOp('[')) { next(); while (!isOp(']')) { if (isOp(',')) { next(); continue; } if (peek().k !== 'id') fail('nome di uscita non valido'); outs.push(next().v); } next(); expectOp('='); name = next().v; }
    else {
      if (peek().k !== 'id') fail('dopo function serve il nome della funzione');
      const a = next().v;
      if (isOp('=')) { next(); outs = [a]; if (peek().k !== 'id') fail('dopo = serve il nome della funzione'); name = next().v; } else name = a;
    }
    const params = [];
    if (isOp('(')) { next(); while (!isOp(')')) { if (isOp(',')) { next(); continue; } if (peek().k === 'id' || isOp('~')) params.push(next().v); else fail('parametro non valido'); } next(); }
    const body = block(['end', 'endfunction', 'function', '<eof>']);
    if (isKw(['end', 'endfunction'])) next();
    if (funcs.has(name)) throw new OctError("la funzione '" + name + "' è definita due volte", t.line);
    funcs.set(name, { name, outs, params, body, line: t.line });
  }

  /* ----- espressioni ----- */
  function expr() { return oror(); }
  function bin(op, a, b, line) { return { type: 'bin', op, a, b, line }; }
  function oror() { let a = andand(); while (isOp('||')) { const t = next(); a = { type: 'sc', op: '||', a, b: andand(), line: t.line }; } return a; }
  function andand() { let a = orx(); while (isOp('&&')) { const t = next(); a = { type: 'sc', op: '&&', a, b: orx(), line: t.line }; } return a; }
  function orx() { let a = andx(); while (isOp('|')) { const t = next(); a = bin('|', a, andx(), t.line); } return a; }
  function andx() { let a = cmp(); while (isOp('&')) { const t = next(); a = bin('&', a, cmp(), t.line); } return a; }
  function cmp() { let a = range(); while (['==', '~=', '!=', '<', '<=', '>', '>='].some(o => isOp(o))) { const t = next(); a = bin(t.v === '!=' ? '~=' : t.v, a, range(), t.line); } return a; }
  function range() {
    if (idxDepth && isOp(':') && (isOp(',', peek(1)) || isOp(')', peek(1)))) { next(); return { type: 'colon' }; }
    let a = add();
    if (isOp(':') && !(isOp(')', peek(1)) || isOp(',', peek(1)))) {
      const t = next(); const b = add();
      if (isOp(':')) { next(); const c = add(); return { type: 'range', a, s: b, b: c, line: t.line }; }
      return { type: 'range', a, s: null, b, line: t.line };
    }
    return a;
  }
  function add() { let a = mul(); while ((isOp('+') || isOp('-')) && !(matDepth && peek().auto)) { const t = next(); a = bin(t.v, a, mul(), t.line); } return a; }
  function mul() { let a = unary(); while (['*', '/', '\\', '.*', './', '.\\'].some(o => isOp(o))) { const t = next(); a = bin(t.v, a, unary(), t.line); } return a; }
  function unary() {
    if (isOp('-') || isOp('+') || isOp('~') || isOp('!')) { const t = next(); const v = unary(); return { type: 'un', op: t.v === '!' ? '~' : t.v, v, line: t.line }; }
    return power();
  }
  function power() {
    let a = postfix();
    while (isOp('^') || isOp('.^')) {
      const t = next();
      let b;
      if (isOp('-') || isOp('+') || isOp('~') || isOp('!')) { const u = next(); b = { type: 'un', op: u.v === '!' ? '~' : u.v, v: postfix(), line: u.line }; }
      else b = postfix();
      a = bin(t.v, a, b, t.line);
    }
    return a;
  }
  function args(close) {
    const list = []; idxDepth++; const saveMat = matDepth; matDepth = 0;
    while (!isOp(close)) {
      if (peek().k === 'eof' || peek().k === 'nl') { idxDepth--; fail("manca '" + close + "' di chiusura"); }
      list.push(expr());
      if (isOp(',')) next(); else if (!isOp(close)) { idxDepth--; fail("atteso ',' o '" + close + "'" + describe(peek())); }
    }
    next(); idxDepth--; matDepth = saveMat;
    return list;
  }
  function postfix() {
    let a = primary();
    while (true) {
      const t = peek();
      if (isOp('(') && !(matDepth && t.sp)) { next(); a = { type: 'index', obj: a, args: args(')'), br: '(', line: t.line }; }
      else if (isOp('{') && !(matDepth && t.sp)) { next(); a = { type: 'index', obj: a, args: args('}'), br: '{', line: t.line }; }
      else if (isOp("'") || isOp(".'")) { next(); a = { type: 'post', op: t.v, v: a, line: t.line }; }
      else if (isOp('.') && peek(1).k === 'id') { fail('le strutture (campo.nome) non sono disponibili nel simulatore'); }
      else break;
    }
    return a;
  }
  function primary() {
    const t = peek();
    if (t.k === 'num') { next(); return { type: 'num', v: t.v, im: t.im, line: t.line }; }
    if (t.k === 'str') { next(); return { type: 'str', v: t.v, dq: t.dq, line: t.line }; }
    if (t.k === 'id') { next(); return { type: 'id', name: t.v, line: t.line }; }
    if (t.k === 'kw' && t.v === 'end' && idxDepth) { next(); return { type: 'end', line: t.line }; }
    if (isOp('(')) {
      next(); const sI = idxDepth, sM = matDepth; idxDepth = 0; matDepth = 0;
      const e = expr(); idxDepth = sI; matDepth = sM;
      expectOp(')', "manca ')' di chiusura" + describe(peek()));
      return { type: 'paren', e, line: t.line };
    }
    if (isOp('[') || isOp('{')) {
      const open = next().v, close = open === '[' ? ']' : '}';
      const rows = [[]]; const sI = idxDepth; idxDepth = 0; matDepth++;
      while (!isOp(close)) {
        if (peek().k === 'eof') fail("manca '" + close + "' di chiusura", t);
        if (isOp(';')) { next(); rows.push([]); continue; }
        if (isOp(',')) { next(); continue; }
        rows[rows.length - 1].push(expr());
      }
      next(); matDepth--; idxDepth = sI;
      const r = rows.filter(x => x.length);
      return { type: open === '[' ? 'matrix' : 'cell', rows: r, line: t.line };
    }
    if (isOp('@')) {
      next();
      if (isOp('(')) {
        next(); const params = [];
        while (!isOp(')')) { if (isOp(',')) { next(); continue; } if (peek().k !== 'id') fail('parametro non valido nella funzione anonima'); params.push(next().v); }
        next();
        const startTok = peek(); const sI = idxDepth, sM = matDepth; idxDepth = 0;
        const body = expr(); idxDepth = sI; matDepth = sM;
        const endTok = toks[p - 1];
        return { type: 'anon', params, body, text: src.slice(startTok.pos, endTok.end).trim(), line: t.line };
      }
      if (peek().k === 'id') return { type: 'handle', name: next().v, line: t.line };
      fail("dopo '@' serve (parametri) oppure il nome di una funzione");
    }
    if (t.k === 'nl' || t.k === 'eof') fail('espressione incompleta: manca un valore a fine riga', t);
    if (t.k === 'kw') fail("'" + t.v + "' inatteso" + (t.v === 'end' ? '' : ''), t);
    fail("'" + t.v + "' inatteso", t);
  }
  return program();
}

/* ======================= ARITMETICA ======================= */
const cmul = (a, b, c, d) => [a * c - b * d, a * d + b * c];
function cdiv(a, b, c, d) {
  if (d === 0) return [a / c, b / c];
  const den = c * c + d * d; return [(a * c + b * d) / den, (b * c - a * d) / den];
}
function cpow(a, b, c, d) {
  if (b === 0 && d === 0 && (a >= 0 || Number.isInteger(c))) return [Math.pow(a, c), 0];
  if (a === 0 && b === 0) return c === 0 && d === 0 ? [1, 0] : [0, 0];
  const lr = Math.log(Math.hypot(a, b)), th = Math.atan2(b, a);
  const er = c * lr - d * th, ei = d * lr + c * th, m = Math.exp(er);
  return [m * Math.cos(ei), m * Math.sin(ei)];
}
function broadcast(A, B, opname) {
  const a = toM(A, opname), b = toM(B, opname);
  const r = a.r === b.r ? a.r : a.r === 1 ? b.r : b.r === 1 ? a.r : -1;
  const c = a.c === b.c ? a.c : a.c === 1 ? b.c : b.c === 1 ? a.c : -1;
  if (r < 0 || c < 0) err('operator ' + opname + ': nonconformant arguments (op1 is ' + a.r + 'x' + a.c + ', op2 is ' + b.r + 'x' + b.c + ')');
  return { a, b, r, c };
}
function elementwise(A, B, opname, fr, fc, logical) {
  const { a, b, r, c } = broadcast(A, B, opname);
  const out = M(r, c, null, null, logical);
  const cx = (a.im || b.im) && fc;
  if (cx) out.im = new Float64Array(r * c);
  const as = a.r * a.c === 1, bs = b.r * b.c === 1;
  for (let j = 0; j < c; j++) for (let i = 0; i < r; i++) {
    const k = i + j * r;
    const ka = as ? 0 : (a.r === 1 ? 0 : i) + (a.c === 1 ? 0 : j) * a.r;
    const kb = bs ? 0 : (b.r === 1 ? 0 : i) + (b.c === 1 ? 0 : j) * b.r;
    if (cx) { const z = fc(a.re[ka], a.im ? a.im[ka] : 0, b.re[kb], b.im ? b.im[kb] : 0); out.re[k] = z[0]; out.im[k] = z[1]; }
    else out.re[k] = fr(a.re[ka], b.re[kb]);
  }
  return cx ? narrow(out) : out;
}
function realPowNeedsComplex(a, b) { const x = toM(a), y = toM(b); if (x.im || y.im) return true; for (let i = 0; i < x.re.length; i++) if (x.re[i] < 0) { for (let k = 0; k < y.re.length; k++) if (!Number.isInteger(y.re[k])) return true; } return false; }
function epow(A, B) {
  if (realPowNeedsComplex(A, B)) {
    const a = clone(toM(A)), b = toM(B); if (!a.im) a.im = new Float64Array(a.re.length);
    return elementwise(a, b, '.^', null, cpow);
  }
  return elementwise(A, B, '.^', Math.pow, cpow);
}
function matmul(A, B) {
  const a = toM(A, '*'), b = toM(B, '*');
  if (a.r * a.c === 1 || b.r * b.c === 1) return elementwise(a, b, '*', (x, y) => x * y, (p, q, r, s) => cmul(p, q, r, s));
  if (a.c !== b.r) err('operator *: nonconformant arguments (op1 is ' + a.r + 'x' + a.c + ', op2 is ' + b.r + 'x' + b.c + ')');
  const out = M(a.r, b.c); const cx = a.im || b.im; if (cx) out.im = new Float64Array(a.r * b.c);
  for (let i = 0; i < a.r; i++) for (let j = 0; j < b.c; j++) {
    let sr = 0, si = 0;
    for (let k = 0; k < a.c; k++) {
      const ar = a.re[i + k * a.r], br = b.re[k + j * b.r];
      if (cx) { const ai = a.im ? a.im[i + k * a.r] : 0, bi = b.im ? b.im[k + j * b.r] : 0; sr += ar * br - ai * bi; si += ar * bi + ai * br; }
      else sr += ar * br;
    }
    out.re[i + j * a.r] = sr; if (cx) out.im[i + j * a.r] = si;
  }
  return cx ? narrow(out) : out;
}
function transpose(V, conj) {
  if (isStr(V)) { const m = toM(V); return transpose(m, false); }
  if (isCell(V)) { const o = { t: 'c', r: V.c, c: V.r, items: [] }; for (let i = 0; i < V.r; i++) for (let j = 0; j < V.c; j++) o.items[j + i * V.c] = V.items[i + j * V.r]; return o; }
  const a = toM(V), o = M(a.c, a.r, null, a.im ? new Float64Array(a.re.length) : null, a.lg);
  for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) { o.re[j + i * a.c] = a.re[i + j * a.r]; if (a.im) o.im[j + i * a.c] = conj ? -a.im[i + j * a.r] : a.im[i + j * a.r]; }
  return o;
}
const eye = n => { const m = M(n, n); for (let i = 0; i < n; i++) m.re[i + i * n] = 1; return m; };
function realOnly(m, fn) { if (m.im) err(fn + ': le matrici complesse non sono supportate dal simulatore'); }
function requireSquare(m, fn) { if (m.r !== m.c) err(fn + ': A must be a square matrix'); }
const EPS = 2.220446049250313e-16;
function lup(A) {
  const n = A.r, a = A.re.slice(), perm = [...Array(n).keys()]; let sign = 1, singular = false;
  const g = (i, j) => a[i + j * n], s = (i, j, v) => { a[i + j * n] = v; };
  let maxAbs = 0; for (const v of a) maxAbs = Math.max(maxAbs, Math.abs(v));
  for (let k = 0; k < n; k++) {
    let piv = k, best = Math.abs(g(k, k));
    for (let i = k + 1; i < n; i++) if (Math.abs(g(i, k)) > best) { best = Math.abs(g(i, k)); piv = i; }
    if (best <= maxAbs * n * EPS) { singular = true; continue; }
    if (piv !== k) { for (let j = 0; j < n; j++) { const t = g(k, j); s(k, j, g(piv, j)); s(piv, j, t); } [perm[k], perm[piv]] = [perm[piv], perm[k]]; sign = -sign; }
    for (let i = k + 1; i < n; i++) { const f = g(i, k) / g(k, k); s(i, k, f); for (let j = k + 1; j < n; j++) s(i, j, g(i, j) - f * g(k, j)); }
  }
  return { n, a, perm, sign, singular };
}
function luSolve(L, b) {
  const { n, a, perm } = L, m = b.c, x = M(n, m);
  for (let col = 0; col < m; col++) {
    const y = new Float64Array(n);
    for (let i = 0; i < n; i++) { let s = b.re[perm[i] + col * n]; for (let k = 0; k < i; k++) s -= a[i + k * n] * y[k]; y[i] = s; }
    for (let i = n - 1; i >= 0; i--) { let s = y[i]; for (let k = i + 1; k < n; k++) s -= a[i + k * n] * x.re[k + col * n]; x.re[i + col * n] = s / a[i + i * n]; }
  }
  return x;
}
function det(A) {
  const a = toM(A); realOnly(a, 'det'); requireSquare(a, 'det');
  if (a.r === 0) return 1;
  const L = lup(a); let d = L.sign; for (let i = 0; i < L.n; i++) d *= L.a[i + i * L.n];
  return L.singular ? (Number.isFinite(d) ? 0 * d : d) : d;
}
function inv(A, interp) {
  const a = toM(A); realOnly(a, 'inverse'); if (a.r !== a.c) err('inverse: argument must be a square matrix');
  const L = lup(a);
  if (L.singular) { interp.warn('matrix singular to machine precision'); const o = M(a.r, a.c); o.re.fill(Infinity); return o; }
  const x = luSolve(L, eye(a.r));
  const rc = rcondEst(a, x); if (rc < EPS) interp.warn('matrix singular to machine precision, rcond = ' + rc.toExponential(5));
  return x;
}
function norm1(m) { let best = 0; for (let j = 0; j < m.c; j++) { let s = 0; for (let i = 0; i < m.r; i++) s += Math.hypot(m.re[i + j * m.r], m.im ? m.im[i + j * m.r] : 0); best = Math.max(best, s); } return best; }
function rcondEst(a, ainv) { const v = 1 / (norm1(a) * norm1(ainv)); return Number.isFinite(v) ? v : 0; }
function mldivide(A, B, interp) {
  const a = toM(A, '\\'), b = toM(B, '\\');
  if (a.r * a.c === 1) return elementwise(b, a, '\\', (x, y) => x / y, (p, q, r, s) => cdiv(p, q, r, s));
  if (a.r !== b.r) err('operator \\: nonconformant arguments (op1 is ' + a.r + 'x' + a.c + ', op2 is ' + b.r + 'x' + b.c + ')');
  realOnly(a, 'mldivide'); realOnly(b, 'mldivide');
  if (a.r === a.c) {
    const L = lup(a);
    if (L.singular) { interp.warn('matrix singular to machine precision'); const o = M(a.c, b.c); for (let i = 0; i < o.re.length; i++) o.re[i] = Infinity; return o; }
    const x = luSolve(L, b);
    if (a.r > 1) { const rc = rcondEst(a, luSolve(L, eye(a.r))); if (rc < EPS) interp.warn('matrix singular to machine precision, rcond = ' + rc.toExponential(5)); }
    return x;
  }
  // minimi quadrati (equazioni normali): A'A x = A'b
  const at = transpose(a, false);
  return mldivide(matmul(at, a), matmul(at, b), interp);
}
function mpower(A, B, interp) {
  const a = toM(A, '^'), b = toM(B, '^');
  if (a.r * a.c === 1 && b.r * b.c === 1) return epow(a, b);
  if (b.r * b.c !== 1) err('operator ^: per matrice^matrice usa .^ (elemento per elemento)');
  if (a.r !== a.c) err('for x^y, only square matrix arguments are permitted and one argument must be scalar.  Use .^ for elementwise power.');
  let k = b.re[0];
  if (!Number.isInteger(k)) err('operator ^: il simulatore supporta solo potenze intere di matrici');
  let base = k < 0 ? inv(a, interp) : a; k = Math.abs(k);
  let res = eye(a.r);
  while (k > 0) { if (k & 1) res = matmul(res, base); base = matmul(base, base); k >>= 1; }
  return res;
}
function rref(A) {
  const a = clone(toM(A)); realOnly(a, 'rref'); const r = a.r, c = a.c, g = (i, j) => a.re[i + j * r], s = (i, j, v) => { a.re[i + j * r] = v; };
  let maxAbs = 0; for (const v of a.re) maxAbs = Math.max(maxAbs, Math.abs(v));
  const tol = EPS * Math.max(r, c) * maxAbs; let row = 0;
  for (let col = 0; col < c && row < r; col++) {
    let piv = row; for (let i = row + 1; i < r; i++) if (Math.abs(g(i, col)) > Math.abs(g(piv, col))) piv = i;
    if (Math.abs(g(piv, col)) <= tol) { for (let i = row; i < r; i++) s(i, col, 0); continue; }
    for (let j = 0; j < c; j++) { const t = g(row, j); s(row, j, g(piv, j)); s(piv, j, t); }
    const d = g(row, col); for (let j = 0; j < c; j++) s(row, j, g(row, j) / d);
    for (let i = 0; i < r; i++) if (i !== row) { const f = g(i, col); if (f) for (let j = 0; j < c; j++) s(i, j, g(i, j) - f * g(row, j)); }
    row++;
  }
  return a;
}

/* ======================= FORMATTAZIONE ======================= */
function intDigits(x) { x = Math.abs(x); return x < 1 ? 1 : Math.floor(Math.log10(x)) + 1; }
const isInt = x => Number.isFinite(x) && Math.round(x) === x;
function special(x) { return Number.isNaN(x) ? 'NaN' : x > 0 ? 'Inf' : '-Inf'; }
function fmtScalarReal(x, long) {
  if (!Number.isFinite(x)) return special(x);
  if (isInt(x) && Math.abs(x) < 1e10) return String(x === 0 ? 0 : x);
  const prec = long ? 16 : 5, a = Math.abs(x);
  if (a >= 1e5 || a < 1e-5) return x.toExponential(prec - 1).replace(/e([+-])(\d)$/, 'e$10$2');
  if (a >= 1) { const ld = intDigits(a), rd = prec - ld; if (rd <= 0) return x.toExponential(prec - 1).replace(/e([+-])(\d)$/, 'e$10$2'); return x.toFixed(long ? 16 - ld : rd); }
  const lz = -Math.floor(Math.log10(a)) - 1;
  if (a < 0.001) return x.toExponential(prec - 1).replace(/e([+-])(\d)$/, 'e$10$2');
  return x.toFixed((long ? 15 : 4) + lz);
}
function matFormat(vals, long) {
  // restituisce una funzione che formatta un numero con larghezza comune
  const fin = vals.filter(Number.isFinite);
  const allInt = fin.every(isInt);
  const hasSpecial = fin.length !== vals.length;
  const maxAbs = fin.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const neg = vals.some(v => v < 0 || Object.is(v, -0) && false);
  if (allInt && maxAbs < 1e10) {
    const w = Math.max(fin.length ? intDigits(maxAbs) : 1, hasSpecial ? 3 : 1) + 1;
    return { w, f: v => Number.isFinite(v) ? String(v === 0 ? 0 : v) : special(v), int: true };
  }
  const minAbs = fin.filter(v => v !== 0).reduce((m, v) => Math.min(m, Math.abs(v)), Infinity);
  if (maxAbs >= 1e5 || (minAbs < 1e-5 && maxAbs < 1e-5) || (Number.isFinite(minAbs) && maxAbs / minAbs >= 1e5)) {
    const d = long ? 15 : 4;
    return { w: d + 7, f: v => v === 0 ? '0' : Number.isFinite(v) ? v.toExponential(d).replace(/e([+-])(\d)$/, 'e$10$2') : special(v), e: true };
  }
  const ld = intDigits(maxAbs), rd = long ? Math.max(15 - ld + 1, 1) : 4;
  return { w: ld + rd + 2, f: v => v === 0 ? '0' : Number.isFinite(v) ? v.toFixed(rd) : special(v) };
}
function fmtComplexParts(re, im, long) {
  const F = matFormat(Array.from(re).concat(Array.from(im).map(Math.abs)), long);
  const wr = F.w, wi = F.w - 1;
  return (k, pad) => {
    const a = F.f(re[k]), b = F.f(Math.abs(im[k])), sgn = (im[k] < 0 || Object.is(im[k], -0)) ? '-' : '+';
    return (pad ? a.padStart(wr) : a) + ' ' + sgn + ' ' + (pad ? b.padStart(wi) : b) + 'i';
  };
}
function scalarText(m, long) {
  if (m.im) { const f = fmtComplexParts(m.re, m.im, long); return f(0, false); }
  return fmtScalarReal(m.re[0], long);
}
function matrixRows(m, long, width) {
  // righe di testo di una matrice nello stile di Octave, con suddivisione in colonne se troppo larga
  if (m.im) {
    const f = fmtComplexParts(m.re, m.im, long);
    const cells = []; let w = 0;
    for (let k = 0; k < m.re.length; k++) { const s = f(k, true); cells.push(s); w = Math.max(w, s.length); }
    return chunk(m, k => cells[k].padStart(w), w + 2, '  ', width);
  }
  if (m.lg) return chunk(m, k => String(m.re[k]), 3, '  ', width);
  const F = matFormat(Array.from(m.re), long);
  return chunk(m, k => F.f(m.re[k]).padStart(F.w), F.w + 2, '  ', width);
}
function chunk(m, cell, colW, sep, width) {
  const per = Math.max(1, Math.floor((width - 2) / colW));
  const blocks = [];
  for (let c0 = 0; c0 < m.c; c0 += per) {
    const c1 = Math.min(m.c, c0 + per), lines = [];
    for (let i = 0; i < m.r; i++) { let s = ''; for (let j = c0; j < c1; j++) s += sep + cell(i + j * m.r); lines.push(s); }
    blocks.push({ c0, c1, lines });
  }
  return blocks;
}
function display(name, v, interp) {
  const long = interp.format === 'long', W = 80;
  if (isStr(v)) return name + ' = ' + v.s + '\n';
  if (isFn(v)) return name + ' =\n\n' + fnText(v) + '\n\n';
  if (isCell(v)) {
    if (!v.items.length) return name + ' = {}(' + v.r + 'x' + v.c + ')\n';
    let s = name + ' =\n{\n';
    for (let j = 0; j < v.c; j++) for (let i = 0; i < v.r; i++) { const it = v.items[i + j * v.r]; s += '  [' + (i + 1) + ',' + (j + 1) + '] = ' + (isStr(it) ? it.s : isM(it) && it.r * it.c === 1 ? scalarText(it, long) : '<' + dimStr(it) + '>') + '\n'; }
    return s + '}\n\n';
  }
  const m = v;
  if (m.r * m.c === 0) return name + ' = [](' + m.r + 'x' + m.c + ')\n';
  if (m.r * m.c === 1) return name + ' = ' + scalarText(m, long) + '\n';
  return name + ' =\n\n' + blocksText(m, long, W) + '\n';
}
function blocksText(m, long, W) {
  const blocks = matrixRows(m, long, W);
  if (blocks.length === 1) return blocks[0].lines.join('\n') + '\n';
  return blocks.map((b, i) => {
    const h = b.c1 - b.c0 === 1 ? ' Column ' + (b.c0 + 1) + ':' : (i === blocks.length - 1 && b.c1 - b.c0 === 2 ? ' Columns ' + (b.c0 + 1) + ' and ' + b.c1 + ':' : ' Columns ' + (b.c0 + 1) + ' through ' + b.c1 + ':');
    return h + '\n\n' + b.lines.join('\n') + '\n';
  }).join('\n');
}
function dispText(v, interp) {
  const long = interp.format === 'long';
  if (isStr(v)) return v.s + '\n';
  if (isFn(v)) return fnText(v) + '\n';
  if (isCell(v)) return display('', v, interp).replace(/^ =\n/, '');
  if (v.r * v.c === 0) return '';
  if (v.r * v.c === 1) return scalarText(v, long) + '\n';
  return blocksText(v, long, 80);
}
const fnText = f => f.name && !f.params ? '@' + f.name : '@(' + f.params.join(', ') + ') ' + f.text;

/* printf / sprintf */
function formatPrintf(fmt, args, interp) {
  const flat = [];
  for (const a of args) { if (isStr(a)) flat.push(a.s); else if (isM(a)) for (let k = 0; k < a.re.length; k++) flat.push(a.im && a.im[k] ? a.re[k] : a.re[k]); else if (isCell(a)) err('printf: wrong type argument \'cell array\''); else flat.push(fnText(a)); }
  fmt = fmt.replace(/\\(n|t|\\|r|a|")/g, (_, c) => ({ n: '\n', t: '\t', '\\': '\\', r: '\r', a: '\x07', '"': '"' })[c]);
  const re = /%(%|[-+ 0#]*(\*|\d+)?(?:\.(\*|\d+))?([diouxXfFeEgGcs]))/g;
  const specs = []; let m; while ((m = re.exec(fmt))) if (m[1] !== '%') specs.push(m);
  let out = '', k = 0;
  const one = () => fmt.replace(re, (all, body, w, pr, conv) => {
    if (body === '%') return '%';
    const flags = (/^[-+ 0#]*/.exec(body) || [''])[0];
    if (w === '*') w = flat[k++]; if (pr === '*') pr = flat[k++];
    if (k >= flat.length && flat.length > 0 && conv !== '%') { k++; return ''; }
    let v = flat[k++];
    let s;
    if (v === undefined) s = '';
    else if (conv === 's') s = typeof v === 'string' ? v : fmtNumG(v, pr);
    else if (conv === 'c') s = typeof v === 'string' ? v : String.fromCharCode(v);
    else {
      if (typeof v === 'string') { if (v.length === 1 || conv === 'd') v = v.length ? v.charCodeAt(0) : 0; else { s = v; } }
      if (s === undefined) {
        if ((conv === 'd' || conv === 'i' || conv === 'u') && !isInt(v)) { conv = Number.isFinite(v) ? 'f' : 'f'; if (pr === undefined && Number.isFinite(v)) { s = fmtNumG(v, 5); } }
        if (s === undefined) s = cfmt(v, conv, pr, flags);
      }
    }
    if (w !== undefined) { w = Number(w); if (s.length < w) s = flags.includes('-') ? s.padEnd(w) : (flags.includes('0') && !/[sc]/.test(conv) ? (s[0] === '-' ? '-' + s.slice(1).padStart(w - 1, '0') : s.padStart(w, '0')) : s.padStart(w)); }
    return s;
  });
  if (!specs.length) return fmt;
  if (!flat.length) return one();
  while (k < flat.length) { const before = k; out += one(); if (k === before) break; }
  return out;
}
function fmtNumG(v, pr) { if (!Number.isFinite(v)) return special(v); if (isInt(v)) return String(v); const p = pr !== undefined ? Number(pr) : 5; return trimG(v.toPrecision(Math.max(1, p + (Math.abs(v) >= 1 ? 0 : 0)))); }
function trimG(s) { if (/e/.test(s)) { let [a, b] = s.split('e'); if (a.includes('.')) a = a.replace(/0+$/, '').replace(/\.$/, ''); const sg = b[0] === '-' ? '-' : '+'; b = b.replace(/^[+-]/, '').padStart(2, '0'); return a + 'e' + sg + b; } return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s; }
function cfmt(v, conv, pr, flags) {
  if (!Number.isFinite(v)) return special(v);
  const p = pr === undefined ? 6 : Number(pr);
  let s;
  switch (conv) {
    case 'd': case 'i': case 'u': s = String(Math.trunc(v)); break;
    case 'f': case 'F': s = v.toFixed(p); break;
    case 'e': case 'E': s = v.toExponential(p).replace(/e([+-])(\d)$/, 'e$10$2'); if (conv === 'E') s = s.toUpperCase(); break;
    case 'g': case 'G': {
      const P = p === 0 ? 1 : p; const ex = v === 0 ? 0 : Math.floor(Math.log10(Math.abs(v)));
      s = (ex < -4 || ex >= P) ? trimG(v.toExponential(P - 1)) : trimG(v.toFixed(Math.max(0, P - 1 - ex)));
      if (conv === 'G') s = s.toUpperCase(); break;
    }
    case 'x': s = Math.trunc(v).toString(16); break; case 'X': s = Math.trunc(v).toString(16).toUpperCase(); break; case 'o': s = Math.trunc(v).toString(8); break;
    default: s = String(v);
  }
  if (flags.includes('+') && v >= 0) s = '+' + s; else if (flags.includes(' ') && v >= 0) s = ' ' + s;
  return s;
}
function num2str(v, fmt) {
  if (isStr(v)) return v.s;
  const m = toM(v);
  if (fmt !== undefined) { if (typeof fmt === 'string') return formatPrintf(fmt, [m]); }
  const one = x => { if (!Number.isFinite(x)) return special(x); if (isInt(x)) return String(x); const p = fmt !== undefined ? fmt : Math.max(Math.floor(Math.log10(Math.abs(x) || 1)) + 5, 5); return trimG(x.toPrecision(Math.min(Math.max(p, 1), 16))); };
  const oneC = k => { const a = one(m.re[k]), b = one(Math.abs(m.im[k])); return a + (m.im[k] < 0 ? '-' : '+') + b + 'i'; };
  if (m.r * m.c === 1) return m.im ? oneC(0) : one(m.re[0]);
  const cells = []; for (let k = 0; k < m.re.length; k++) cells.push(m.im ? oneC(k) : one(m.re[k]));
  const w = Math.max(...cells.map(s => s.length));
  const rows = []; for (let i = 0; i < m.r; i++) { const r = []; for (let j = 0; j < m.c; j++) r.push(cells[i + j * m.r].padStart(w)); rows.push(r.join('  ')); }
  return rows.join('\n');
}
function mat2str(v, prec) {
  if (isStr(v)) return '"' + v.s + '"';
  const m = toM(v), p = prec || 15;
  const one = k => { const f = x => !Number.isFinite(x) ? special(x) : isInt(x) ? String(x) : trimG(x.toPrecision(p)); if (m.lg) return m.re[k] ? 'true' : 'false'; if (m.im) return f(m.re[k]) + (m.im[k] < 0 ? '-' : '+') + f(Math.abs(m.im[k])) + 'i'; return f(m.re[k]); };
  if (m.r * m.c === 1) return one(0);
  const rows = []; for (let i = 0; i < m.r; i++) { const r = []; for (let j = 0; j < m.c; j++) r.push(one(i + j * m.r)); rows.push(r.join(' ')); }
  return '[' + rows.join(';') + ']';
}

root.OctCore = { OctError, M, num, cnum, bool, str, empty, isM, isStr, isFn, isCell, toM, numel, dims, dimStr, narrow, clone, scalar, truthy, textOf, lex, parse,
  cmul, cdiv, cpow, elementwise, epow, matmul, transpose, eye, lup, luSolve, det, inv, mldivide, mpower, rref, norm1, realOnly, requireSquare, EPS,
  display, dispText, fnText, formatPrintf, num2str, mat2str, fmtScalarReal, isInt, trimG, err };
})(typeof self !== 'undefined' ? self : globalThis);
