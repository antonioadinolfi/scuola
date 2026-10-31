/* Corso Octave · valutatore: esecuzione degli script, funzioni predefinite, workspace e grafici.
   Richiede oct-interp.js (OctCore). */
(function (root) {
"use strict";
const C = root.OctCore;
const { OctError, M, num, cnum, bool, str, empty, isM, isStr, isFn, isCell, toM, numel, dims, dimStr, narrow, clone, scalar, truthy, textOf,
  elementwise, epow, matmul, transpose, eye, det, inv, mldivide, mpower, rref, lup, realOnly, requireSquare, EPS, display, dispText, fnText,
  formatPrintf, num2str, mat2str, isInt, err, cmul, cdiv, trimG } = C;

const OUT_LIMIT = 200000, MAX_DEPTH = 256;
const BRK = 1, CONT = 2, RET = 3;

/* ---------- utilità ---------- */
const flat = m => Array.from(toM(m).re);
function rowOf(arr, lg) { const m = M(arr.length ? 1 : 1, arr.length); m.re.set(arr); m.lg = !!lg; if (!arr.length) { m.r = 1; m.c = 0; } return m; }
function colOf(arr) { const m = M(arr.length, 1); m.re.set(arr); if (!arr.length) { m.r = 0; m.c = 1; } return m; }
function shapeLike(v, arr) { const m = toM(v); return m.r === 1 ? rowOf(arr) : colOf(arr); }
const isVec = m => m.r === 1 || m.c === 1;
function intArg(v, what) { const x = scalar(v, what); if (!Number.isFinite(x) || x < 0 || !isInt(x)) err(what + ': le dimensioni devono essere interi non negativi'); return x; }
function sizeArgs(args, name) {
  const a = args.filter(x => !isStr(x));
  if (!a.length) return [1, 1];
  if (a.length === 1) { const m = toM(a[0]); if (m.r * m.c === 1) { const n = intArg(m, name); return [n, n]; } if (m.r * m.c >= 2) return [m.re[0], m.re[1]].map(x => Math.max(0, Math.floor(x))); }
  return [intArg(a[0], name), intArg(a[1], name)];
}
function fill(r, c, f) { const m = M(r, c); for (let k = 0; k < r * c; k++) m.re[k] = f(k); return m; }
function need(name, args, min, max) { if (args.length < min || (max !== undefined && args.length > max)) err('Invalid call to ' + name); }
function mapReal(v, f, name) {
  const m = toM(v, name); if (m.im) err(name + ': l\'argomento deve essere reale (nel simulatore)');
  const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) o.re[k] = f(m.re[k]); return o;
}
function mapC(v, fr, fc, needC) {
  const m = toM(v);
  let cx = !!m.im; if (!cx && needC) for (let k = 0; k < m.re.length; k++) if (needC(m.re[k])) { cx = true; break; }
  const o = M(m.r, m.c);
  if (!cx) { for (let k = 0; k < m.re.length; k++) o.re[k] = fr(m.re[k]); return o; }
  o.im = new Float64Array(m.re.length);
  for (let k = 0; k < m.re.length; k++) { const z = fc(m.re[k], m.im ? m.im[k] : 0); o.re[k] = z[0]; o.im[k] = z[1]; }
  return narrow(o);
}
const csqrt = (a, b) => { const r = Math.hypot(a, b); const x = Math.sqrt((r + a) / 2), y = Math.sqrt((r - a) / 2); return [x, b < 0 || (b === 0 && Object.is(b, -0)) ? -y : y]; };
const clog = (a, b) => [Math.log(Math.hypot(a, b)), Math.atan2(b, a)];
const cexp = (a, b) => { const e = Math.exp(a); return [e * Math.cos(b), e * Math.sin(b)]; };
function casin(a, b) { // -i * log(iz + sqrt(1 - z^2))
  const z2 = cmul(a, b, a, b), s = csqrt(1 - z2[0], -z2[1]), l = clog(-b + s[0], a + s[1]); return [l[1], -l[0]];
}
const roundHalf = x => Math.sign(x) * Math.round(Math.abs(x));
/* riduzione lungo una dimensione */
function reduceDim(v, dimArg, f, name) {
  const m = toM(v, name);
  let dim = dimArg !== undefined ? scalar(dimArg) : (m.r === 1 && m.c !== 1 ? 2 : 1);
  if (m.r * m.c === 0 && dimArg === undefined) dim = 1;
  if (dim === 1) { const o = M(1, m.c); for (let j = 0; j < m.c; j++) { const col = []; for (let i = 0; i < m.r; i++) col.push(i + j * m.r); o.re[j] = f(col.map(k => m.re[k]), col, m); } if (m.r * m.c === 0 && m.c === 0) { o.c = 1; o.re = Float64Array.of(f([], [], m)); } return o; }
  const o = M(m.r, 1); for (let i = 0; i < m.r; i++) { const row = []; for (let j = 0; j < m.c; j++) row.push(i + j * m.r); o.re[i] = f(row.map(k => m.re[k]), row, m); } return o;
}
function reduceC(v, dimArg, name, fr, fc) { // con supporto complesso per sum/prod/mean
  const m = toM(v, name); if (!m.im) return reduceDim(m, dimArg, fr, name);
  const re = reduceDim(M(m.r, m.c, m.re), dimArg, (_, idx) => fc(idx, m)[0], name), im = reduceDim(M(m.r, m.c, m.re), dimArg, (_, idx) => fc(idx, m)[1], name);
  re.im = im.re; return narrow(re);
}
function cumDim(v, dimArg, f) {
  const m = clone(toM(v)); m.lg = false; let dim = dimArg !== undefined ? scalar(dimArg) : (m.r === 1 ? 2 : 1);
  if (dim === 1) for (let j = 0; j < m.c; j++) { let acc = null; for (let i = 0; i < m.r; i++) { const k = i + j * m.r; acc = acc === null ? m.re[k] : f(acc, m.re[k]); m.re[k] = acc; } }
  else for (let i = 0; i < m.r; i++) { let acc = null; for (let j = 0; j < m.c; j++) { const k = i + j * m.r; acc = acc === null ? m.re[k] : f(acc, m.re[k]); m.re[k] = acc; } }
  return m;
}
function minmax(args, nargout, isMax, name) {
  need(name, args, 1, 3);
  const better = isMax ? (a, b) => a > b : (a, b) => a < b;
  if (args.length >= 2 && !(isM(args[1]) && args[1].r * args[1].c === 0)) {
    return elementwise(args[0], args[1], name, (a, b) => Number.isNaN(a) ? b : Number.isNaN(b) ? a : (better(a, b) ? a : b));
  }
  const m = toM(args[0], name); if (m.r * m.c === 0) return [empty(), empty()];
  const key = m.im ? k => Math.hypot(m.re[k], m.im[k]) : k => m.re[k];
  const idx = reduceDim(m, args[2], (vals, ks) => { let best = -1; ks.forEach((k, p) => { if (Number.isNaN(key(k))) return; if (best < 0 || better(key(k), key(ks[best]))) best = p; }); return best < 0 ? 0 : best; }, name);
  const dim = args[2] !== undefined ? scalar(args[2]) : (m.r === 1 ? 2 : 1);
  const val = M(idx.r, idx.c, null, m.im ? new Float64Array(idx.re.length) : null);
  for (let q = 0; q < idx.re.length; q++) {
    const p = idx.re[q], k = dim === 1 ? p + q * m.r : q + p * m.r;
    val.re[q] = m.re[k]; if (m.im) val.im[q] = m.im[k];
    const allNaN = dim === 1 ? Array.from({ length: m.r }, (_, i) => m.re[i + q * m.r]).every(Number.isNaN) : Array.from({ length: m.c }, (_, j) => m.re[q + j * m.r]).every(Number.isNaN);
    if (allNaN) val.re[q] = NaN;
    idx.re[q] = p + 1;
  }
  return [m.im ? narrow(val) : val, idx];
}
function isequal(a, b) {
  if (isStr(a) && isStr(b)) return a.s === b.s;
  if (isCell(a) || isCell(b)) { if (!isCell(a) || !isCell(b) || a.r !== b.r || a.c !== b.c) return false; return a.items.every((x, k) => isequal(x, b.items[k])); }
  if (isFn(a) || isFn(b)) return a === b;
  const x = toM(a), y = toM(b); if (x.r !== y.r || x.c !== y.c) return false;
  for (let k = 0; k < x.re.length; k++) { if (x.re[k] !== y.re[k]) return false; if ((x.im ? x.im[k] : 0) !== (y.im ? y.im[k] : 0)) return false; }
  return true;
}
const className = v => isStr(v) ? 'char' : isFn(v) ? 'function_handle' : isCell(v) ? 'cell' : v.lg ? 'logical' : 'double';
function normInf(m) { let best = 0; for (let i = 0; i < m.r; i++) { let s = 0; for (let j = 0; j < m.c; j++) s += Math.hypot(m.re[i + j * m.r], m.im ? m.im[i + j * m.r] : 0); best = Math.max(best, s); } return best; }
function norm2mat(m) { // massimo valore singolare con iterazione di potenza su A'A
  realOnly(m, 'norm'); const ata = matmul(transpose(m, false), m); let v = M(ata.r, 1); v.re.fill(1); let lam = 0;
  for (let it = 0; it < 500; it++) { const w = matmul(ata, v); let nrm = 0; for (const x of w.re) nrm += x * x; nrm = Math.sqrt(nrm); if (nrm === 0) return 0; for (let k = 0; k < w.re.length; k++) w.re[k] /= nrm; if (Math.abs(nrm - lam) < 1e-15 * nrm) { lam = nrm; break; } lam = nrm; v = w; }
  return Math.sqrt(lam);
}
function rankOf(m) { realOnly(m, 'rank'); const r = rref(m); let k = 0; for (let i = 0; i < r.r; i++) { let nz = false; for (let j = 0; j < r.c; j++) if (Math.abs(r.re[i + j * r.r]) > 1e-10) nz = true; if (nz) k++; } return k; }

/* ---------- formato delle linee dei grafici ---------- */
const COLORS = { r: '#FF0000', g: '#00B000', b: '#0000FF', c: '#00BFBF', m: '#BF00BF', y: '#E6C700', k: '#000000', w: '#FFFFFF' };
const ORDER = ['#0072BD', '#D95319', '#EDB120', '#7E2F8E', '#77AC30', '#4DBEEE', '#A2142F'];
const MARKERS = { o: 'circle-open', '+': 'cross-thin-open', '*': 'asterisk-open', '.': 'circle', x: 'x-thin-open', s: 'square-open', d: 'diamond-open', '^': 'triangle-up-open', v: 'triangle-down-open', '>': 'triangle-right-open', '<': 'triangle-left-open', p: 'star-open', h: 'hexagram-open' };
const COLOR_NAMES = { red: 'r', green: 'g', blue: 'b', cyan: 'c', magenta: 'm', yellow: 'y', black: 'k', white: 'w' };
function parseFmt(s) {
  const o = { color: null, dash: null, marker: null }; let rest = s;
  for (const [tok, d] of [['--', 'dash'], ['-.', 'dashdot'], [':', 'dot'], ['-', 'solid']]) if (rest.includes(tok)) { o.dash = d; rest = rest.replace(tok, ''); break; }
  for (const ch of rest) {
    if (COLORS[ch]) o.color = COLORS[ch];
    else if (MARKERS[ch]) o.marker = ch;
    else if (ch !== ' ') err("plot: formato di linea non valido '" + s + "' (es. 'r--o': colore, tipo di linea, marcatore)");
  }
  return o;
}
function colorArg(v) {
  if (isStr(v)) { const k = COLOR_NAMES[v.s.toLowerCase()] || v.s; if (COLORS[k]) return COLORS[k]; if (/^#[0-9a-f]{6}$/i.test(v.s)) return v.s; err("colore non valido '" + v.s + "'"); }
  const m = toM(v); if (m.re.length !== 3) err('il colore va indicato come lettera (es. \'r\') o come [R G B] con valori tra 0 e 1');
  return 'rgb(' + Array.from(m.re).map(x => Math.round(Math.min(1, Math.max(0, x)) * 255)).join(',') + ')';
}

const HELP = {
  sqrt: ['sqrt (X)', 'Radice quadrata di ogni elemento di X. Se X è negativo il risultato è un numero complesso.'],
  abs: ['abs (Z)', 'Valore assoluto; per un numero complesso è il modulo.'],
  exp: ['exp (X)', 'Esponenziale e^X di ogni elemento.'], log: ['log (X)', 'Logaritmo naturale (in base e). Per il logaritmo in base 10 usa log10.'],
  log10: ['log10 (X)', 'Logaritmo in base 10.'], sin: ['sin (X)', 'Seno di X, con X in radianti. Per i gradi usa sind.'], cos: ['cos (X)', 'Coseno di X, con X in radianti.'], tan: ['tan (X)', 'Tangente di X, con X in radianti.'],
  round: ['round (X)', 'Arrotonda all\'intero più vicino.'], floor: ['floor (X)', 'Arrotonda per difetto.'], ceil: ['ceil (X)', 'Arrotonda per eccesso.'], mod: ['mod (X, Y)', 'Resto della divisione X/Y (con il segno di Y).'],
  disp: ['disp (X)', 'Mostra il valore di X senza il nome della variabile.'], fprintf: ['fprintf (TEMPLATE, ...)', 'Stampa testo formattato: %d intero, %f decimale, %g compatto, %s testo, \\n a capo.'],
  printf: ['printf (TEMPLATE, ...)', 'Come fprintf (solo Octave).'], num2str: ['num2str (X)', 'Converte un numero in testo.'],
  linspace: ['linspace (A, B, N)', 'Vettore riga di N valori equidistanti da A a B (N = 100 se omesso).'], zeros: ['zeros (N, M)', 'Matrice N×M di zeri.'], ones: ['ones (N, M)', 'Matrice N×M di uni.'], eye: ['eye (N)', 'Matrice identità N×N.'],
  size: ['size (A)', 'Dimensioni di A: [righe colonne].'], length: ['length (A)', 'La dimensione più grande di A.'], numel: ['numel (A)', 'Numero totale di elementi.'],
  det: ['det (A)', 'Determinante della matrice quadrata A.'], inv: ['inv (A)', 'Inversa della matrice quadrata A.'], sum: ['sum (X)', 'Somma degli elementi (per colonne se X è una matrice).'], mean: ['mean (X)', 'Media aritmetica.'],
  max: ['max (X)', 'Valore massimo; [m, i] = max (X) restituisce anche la posizione.'], min: ['min (X)', 'Valore minimo; [m, i] = min (X) restituisce anche la posizione.'],
  plot: ['plot (X, Y, FMT)', 'Grafico 2D dei punti (X, Y); FMT è il formato, es. \'r--o\'.'],
  clc: ['clc', 'Pulisce la Command Window (le variabili restano).'], clear: ['clear X', 'Cancella la variabile X dal workspace; clear da solo le cancella tutte.'],
  who: ['who', 'Elenca le variabili del workspace.'], whos: ['whos', 'Elenca le variabili con dimensioni, memoria occupata e tipo.'], format: ['format long | format short', 'Cambia il numero di cifre mostrate.'],
  help: ['help NOME', 'Mostra la guida della funzione NOME.'], pi: ['pi', 'La costante π = 3.14159…'], i: ['i', 'L\'unità immaginaria (anche j).'], exist: ['exist (NOME)', '1 se NOME è una variabile, 2 o 5 se è una funzione, 0 se non esiste.']
};

/* ======================= INTERPRETE ======================= */
class Interp {
  constructor() {
    this.base = { vars: new Map(), name: null };
    this.format = 'short'; this.out = []; this.outLen = 0; this.funcs = new Map(); this.depth = 0;
    this.figs = []; this.curFig = null; this.endStack = []; this.frame = this.base; this.t0 = Date.now();
  }
  print(s) { this.outLen += s.length; if (this.outLen > OUT_LIMIT) err('output troppo lungo: il programma stampa troppo (ciclo infinito?)'); this.out.push(s); }
  warn(msg) { this.print('warning: ' + msg + '\n'); }
  takeOutput() { const s = this.out.join(''); this.out = []; this.outLen = 0; return s; }

  run(src) {
    const prog = C.parse(src);
    prog.funcs.forEach((f, k) => this.funcs.set(k, f));
    this.frame = this.base;
    const r = this.block(prog.body, this.base);
    return r;
  }
  bind(frame, name, v) {
    if ((isM(v) || isCell(v)) && v._own) v = clone(v);
    if (isM(v) || isCell(v)) Object.defineProperty(v, '_own', { value: frame, writable: true, configurable: true, enumerable: false });
    frame.vars.set(name, v);
  }
  block(list, fr) {
    for (const s of list) { const r = this.stmt(s, fr); if (r) return r; }
    return 0;
  }
  stmt(s, fr) {
    try { return this.stmtInner(s, fr); }
    catch (e) { if (e instanceof OctError && !e.line) e.line = s.line; throw e; }
  }
  stmtInner(s, fr) {
    switch (s.type) {
      case 'expr': {
        const e = s.e;
        if (e.type === 'id' && fr.vars.has(e.name)) { if (!s.quiet) this.print(display(e.name, fr.vars.get(e.name), this)); return 0; }
        const vals = this.multi(e, fr, 0);
        if (vals.length && vals[0] !== undefined) { this.bind(fr, 'ans', vals[0]); if (!s.quiet) this.print(display('ans', fr.vars.get('ans'), this)); }
        return 0;
      }
      case 'assign': {
        const isDel = s.rhs.type === 'matrix' && !s.rhs.rows.length;
        const v = this.expr(s.rhs, fr);
        if (s.lhs.type === 'id') { this.bind(fr, s.lhs.name, v); if (!s.quiet) this.print(display(s.lhs.name, fr.vars.get(s.lhs.name), this)); }
        else { this.assignIndex(s.lhs, v, fr, isDel); if (!s.quiet) this.print(display(s.lhs.obj.name, fr.vars.get(s.lhs.obj.name), this)); }
        return 0;
      }
      case 'massign': {
        const vals = this.multi(s.rhs, fr, s.lhs.length);
        s.lhs.forEach((l, k) => {
          if (!l) return;
          if (vals[k] === undefined) err('element number ' + (k + 1) + ' undefined in return list');
          if (l.type === 'id') this.bind(fr, l.name, vals[k]); else this.assignIndex(l, vals[k], fr, false);
        });
        if (!s.quiet) s.lhs.forEach(l => { if (l) { const n = l.type === 'id' ? l.name : l.obj.name; this.print(display(n, fr.vars.get(n), this)); } });
        return 0;
      }
      case 'if': {
        for (const c of s.clauses) if (truthy(this.expr(c.cond, fr))) return this.block(c.body, fr);
        if (s.els) return this.block(s.els, fr);
        return 0;
      }
      case 'for': {
        const v = this.expr(s.e, fr);
        let n, get;
        if (isCell(v)) { n = v.c; get = j => ({ t: 'c', r: v.r, c: 1, items: v.items.slice(j * v.r, (j + 1) * v.r) }); }
        else if (isStr(v)) { n = v.s.length; get = j => str(v.s[j]); }
        else if (isFn(v)) { n = 1; get = () => v; }
        else { const m = v; n = m.r * m.c === 0 ? 0 : m.c; get = j => { if (m.r === 1) return m.im ? cnum(m.re[j], m.im[j]) : num(m.re[j]); const o = M(m.r, 1, m.re.slice(j * m.r, (j + 1) * m.r), m.im ? m.im.slice(j * m.r, (j + 1) * m.r) : null, m.lg); return o; }; }
        for (let j = 0; j < n; j++) {
          this.bind(fr, s.v, get(j));
          const r = this.block(s.body, fr);
          if (r === BRK) break; if (r === RET) return RET;
        }
        return 0;
      }
      case 'while': {
        while (truthy(this.expr(s.cond, fr))) { const r = this.block(s.body, fr); if (r === BRK) break; if (r === RET) return RET; }
        return 0;
      }
      case 'do': {
        do { const r = this.block(s.body, fr); if (r === BRK) break; if (r === RET) return RET; } while (!truthy(this.expr(s.cond, fr)));
        return 0;
      }
      case 'switch': {
        const v = this.expr(s.e, fr);
        const match = c => { if (isCell(c)) return c.items.some(match); if (isStr(v) || isStr(c)) return isStr(v) && isStr(c) && v.s === c.s; const a = toM(v), b = toM(c); return a.r * a.c > 0 && b.r * b.c > 0 && a.re[0] === b.re[0]; };
        for (const c of s.cases) if (match(this.expr(c.v, fr))) return this.block(c.body, fr);
        if (s.other) return this.block(s.other, fr);
        return 0;
      }
      case 'try': {
        try { return this.block(s.body, fr); }
        catch (e) { if (!(e instanceof OctError)) throw e; if (s.id) this.bind(fr, s.id, str(e.message)); this.lasterr = e.message; return this.block(s.cbody, fr); }
      }
      case 'break': return BRK; case 'continue': return CONT; case 'return': return RET;
      case 'global': return 0;
    }
    err('istruzione non supportata');
  }

  /* ----- espressioni ----- */
  expr(e, fr) {
    const v = this.multi(e, fr, 1);
    if (!v.length || v[0] === undefined) err(e.type === 'index' || e.type === 'id' ? 'value on right hand side of assignment is undefined (' + (e.name || (e.obj && e.obj.name) || 'la funzione') + ' non restituisce un valore)' : 'valore indefinito');
    return v[0];
  }
  multi(e, fr, nargout) {
    switch (e.type) {
      case 'num': return [e.im ? cnum(0, e.v) : num(e.v)];
      case 'str': return [str(e.v)];
      case 'paren': return [this.expr(e.e, fr)];
      case 'id': {
        if (fr.vars.has(e.name)) return [fr.vars.get(e.name)];
        return this.call(e.name, [], nargout, fr);
      }
      case 'end': {
        const top = this.endStack[this.endStack.length - 1]; if (!top) err("'end': non ammesso fuori dagli indici");
        const d = dims(top.v); return [num(top.n === 1 ? d[0] * d[1] : top.k === 0 ? d[0] : top.k === 1 ? d[1] : 1)];
      }
      case 'colon': return [str(':')];
      case 'bin': return [this.binop(e.op, this.expr(e.a, fr), this.expr(e.b, fr))];
      case 'sc': {
        const a = this.expr(e.a, fr), ta = this.logicalScalar(a, e.op);
        if (e.op === '||' ? ta : !ta) return [bool(ta)];
        return [bool(this.logicalScalar(this.expr(e.b, fr), e.op))];
      }
      case 'un': {
        const v = this.expr(e.v, fr);
        if (e.op === '-') { const m = toM(v); const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) o.re[k] = -m.re[k]; if (m.im) o.im = m.im.map(x => -x); return [o]; }
        if (e.op === '+') { const m = toM(v); return [M(m.r, m.c, m.re.slice(), m.im ? m.im.slice() : null)]; }
        const m = toM(v); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) { if (Number.isNaN(m.re[k])) err('logical: NaN can\'t be converted to logical value'); o.re[k] = (m.re[k] === 0 && !(m.im && m.im[k])) ? 1 : 0; } return [o];
      }
      case 'post': return [transpose(this.expr(e.v, fr), e.op === "'")];
      case 'range': return [this.range(e, fr)];
      case 'matrix': return [this.concat(e.rows.map(r => r.map(x => this.expr(x, fr))))];
      case 'cell': {
        const rows = e.rows.map(r => r.map(x => this.expr(x, fr)));
        if (!rows.length) return [{ t: 'c', r: 0, c: 0, items: [] }];
        const nc = rows[0].length; if (rows.some(r => r.length !== nc)) err('vertical dimensions mismatch (cell)');
        const o = { t: 'c', r: rows.length, c: nc, items: [] };
        rows.forEach((r, i) => r.forEach((v, j) => { o.items[i + j * rows.length] = v; }));
        return [o];
      }
      case 'anon': {
        const cap = new Map(); this.captureVars(e.body, fr, cap, new Set(e.params));
        return [{ t: 'f', params: e.params, body: e.body, text: e.text, cap }];
      }
      case 'handle': {
        if (!this.funcs.has(e.name) && !BI[e.name]) err("@" + e.name + ": la funzione '" + e.name + "' non esiste");
        return [{ t: 'f', name: e.name }];
      }
      case 'index': return this.index(e, fr, nargout);
    }
    err('espressione non supportata: ' + e.type);
  }
  captureVars(node, fr, cap, params) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'id' && !params.has(node.name) && fr.vars.has(node.name)) cap.set(node.name, fr.vars.get(node.name));
    if (node.type === 'anon') { const p2 = new Set([...params, ...node.params]); this.captureVars(node.body, fr, cap, p2); return; }
    for (const k of Object.keys(node)) { const x = node[k]; if (Array.isArray(x)) x.forEach(y => Array.isArray(y) ? y.forEach(z => this.captureVars(z, fr, cap, params)) : this.captureVars(y, fr, cap, params)); else if (x && typeof x === 'object' && x.type) this.captureVars(x, fr, cap, params); }
  }
  logicalScalar(v, op) {
    const m = toM(v); if (m.r * m.c === 0) err("invalid conversion from empty value to real scalar");
    for (let k = 0; k < m.re.length; k++) { if (Number.isNaN(m.re[k])) err('logical: NaN can\'t be converted to logical value'); if (m.re[k] === 0 && !(m.im && m.im[k])) return false; }
    return true;
  }
  range(e, fr) {
    const sc = (x, w) => { const m = toM(this.expr(x, fr)); if (m.r * m.c === 0) return NaN; return m.re[0]; };
    const a = sc(e.a), b = sc(e.b), s = e.s ? sc(e.s) : 1;
    if ([a, b, s].some(Number.isNaN)) return M(1, 0);
    if (s === 0 || (s > 0 && a > b) || (s < 0 && a < b)) return M(1, 0);
    const n = Math.floor((b - a) / s * (1 + EPS) + 1e-10) + 1;
    if (n > 5e7) err('out of memory or dimension too large for Octave\'s index type');
    const m = M(1, n); for (let k = 0; k < n; k++) m.re[k] = a + k * s;
    return m;
  }
  concat(rows) {
    const hrow = items => {
      items = items.filter(v => !(isM(v) && v.r * v.c === 0) || false);
      if (!items.length) return empty();
      if (items.some(isCell)) { const cs = items.map(v => isCell(v) ? v : { t: 'c', r: 1, c: 1, items: [v] }); const r = cs[0].r; if (cs.some(c => c.r !== r)) err('horizontal dimensions mismatch (cell)'); return { t: 'c', r, c: cs.reduce((s, c) => s + c.c, 0), items: cs.flatMap(c => c.items) }; }
      if (items.some(isFn)) err('concatenazione di function handle non consentita');
      if (items.some(isStr)) {
        if (items.some(v => isM(v) && v.r > 1)) err('vertical dimensions mismatch (char)');
        return str(items.map(v => isStr(v) ? v.s : String.fromCharCode(...toM(v).re.map(Math.round))).join(''));
      }
      const r = items[0].r;
      items.forEach(v => { if (v.r !== r) err('horizontal dimensions mismatch (' + dimStr(items[0]) + ' vs ' + dimStr(v) + ')'); });
      const c = items.reduce((s, v) => s + v.c, 0), cx = items.some(v => v.im);
      const o = M(r, c, null, cx ? new Float64Array(r * c) : null, items.every(v => v.lg)); let off = 0;
      for (const v of items) { o.re.set(v.re, off); if (cx && v.im) o.im.set(v.im, off); off += v.re.length; }
      return o;
    };
    const rs = rows.map(hrow).filter(v => !(isM(v) && v.r * v.c === 0));
    if (!rs.length) return empty();
    if (rs.length === 1) return rs[0];
    if (rs.some(isCell)) { const cs = rs.map(v => isCell(v) ? v : { t: 'c', r: 1, c: 1, items: [v] }); const c = cs[0].c; if (cs.some(x => x.c !== c)) err('vertical dimensions mismatch (cell)'); const r = cs.reduce((s, x) => s + x.r, 0); const o = { t: 'c', r, c, items: [] }; let off = 0; cs.forEach(x => { for (let i = 0; i < x.r; i++) for (let j = 0; j < c; j++) o.items[off + i + j * r] = x.items[i + j * x.r]; off += x.r; }); return o; }
    if (rs.some(isStr)) { if (rs.every(isStr) && rs.every(x => x.s.length === rs[0].s.length)) err('le matrici di caratteri (più righe di testo) non sono supportate dal simulatore: usa una cella {…}'); err('vertical dimensions mismatch (' + dimStr(rs[0]) + ' vs ' + dimStr(rs[1]) + ')'); }
    const c = rs[0].c;
    rs.forEach(v => { if (v.c !== c) err('vertical dimensions mismatch (' + dimStr(rs[0]) + ' vs ' + dimStr(v) + ')'); });
    const r = rs.reduce((s, v) => s + v.r, 0), cx = rs.some(v => v.im);
    const o = M(r, c, null, cx ? new Float64Array(r * c) : null, rs.every(v => v.lg)); let off = 0;
    for (const v of rs) { for (let i = 0; i < v.r; i++) for (let j = 0; j < c; j++) { o.re[off + i + j * r] = v.re[i + j * v.r]; if (cx && v.im) o.im[off + i + j * r] = v.im[i + j * v.r]; } off += v.r; }
    return o;
  }
  binop(op, a, b) {
    if ((isCell(a) || isCell(b))) err("binary operator '" + op + "' not implemented for 'cell' by 'double' operations");
    if (isFn(a) || isFn(b)) err("binary operator '" + op + "' not implemented for 'function handle' operations");
    switch (op) {
      case '+': return elementwise(a, b, '+', (x, y) => x + y, (p, q, r, s) => [p + r, q + s]);
      case '-': return elementwise(a, b, '-', (x, y) => x - y, (p, q, r, s) => [p - r, q - s]);
      case '.*': return elementwise(a, b, '.*', (x, y) => x * y, cmul);
      case './': return elementwise(a, b, './', (x, y) => x / y, cdiv);
      case '.\\': return elementwise(b, a, '.\\', (x, y) => x / y, cdiv);
      case '*': return matmul(a, b);
      case '/': { const B = toM(b); if (B.r * B.c === 1) return elementwise(a, B, '/', (x, y) => x / y, cdiv); const A = toM(a); if (A.c !== B.c) err('operator /: nonconformant arguments (op1 is ' + dimStr(A) + ', op2 is ' + dimStr(B) + ')'); return transpose(mldivide(transpose(B, false), transpose(A, false), this), false); }
      case '\\': return mldivide(a, b, this);
      case '^': return mpower(a, b, this);
      case '.^': return epow(a, b);
      case '==': return elementwise(a, b, '==', (x, y) => x === y ? 1 : 0, (p, q, r, s) => [p === r && q === s ? 1 : 0, 0], true);
      case '~=': return elementwise(a, b, '!=', (x, y) => x !== y ? 1 : 0, (p, q, r, s) => [p !== r || q !== s ? 1 : 0, 0], true);
      case '<': return elementwise(a, b, '<', (x, y) => x < y ? 1 : 0, (p, q, r) => [p < r ? 1 : 0, 0], true);
      case '<=': return elementwise(a, b, '<=', (x, y) => x <= y ? 1 : 0, (p, q, r) => [p <= r ? 1 : 0, 0], true);
      case '>': return elementwise(a, b, '>', (x, y) => x > y ? 1 : 0, (p, q, r) => [p > r ? 1 : 0, 0], true);
      case '>=': return elementwise(a, b, '>=', (x, y) => x >= y ? 1 : 0, (p, q, r) => [p >= r ? 1 : 0, 0], true);
      case '&': return elementwise(a, b, '&', (x, y) => { if (Number.isNaN(x) || Number.isNaN(y)) err('logical: NaN can\'t be converted to logical value'); return x && y ? 1 : 0; }, null, true);
      case '|': return elementwise(a, b, '|', (x, y) => { if (Number.isNaN(x) || Number.isNaN(y)) err('logical: NaN can\'t be converted to logical value'); return x || y ? 1 : 0; }, null, true);
    }
    err('operatore non supportato ' + op);
  }

  /* ----- indicizzazione ----- */
  idxValues(args, fr, v) {
    const out = [];
    args.forEach((a, k) => {
      if (a.type === 'colon') { out.push(':'); return; }
      this.endStack.push({ v, k, n: args.length });
      try { out.push(this.expr(a, fr)); } finally { this.endStack.pop(); }
    });
    return out;
  }
  toIndex(x, name, pos, n, extent) {
    // x: valore indice -> array di indici base 0
    if (x === ':') { const a = []; for (let k = 0; k < extent; k++) a.push(k); return a; }
    if (isStr(x) && x.s === ':') { const a = []; for (let k = 0; k < extent; k++) a.push(k); return a; }
    const m = toM(x);
    if (m.lg) { const a = []; for (let k = 0; k < m.re.length; k++) if (m.re[k]) a.push(k); if (m.re.length > extent) { let last = -1; for (let k = 0; k < m.re.length; k++) if (m.re[k]) last = k; if (last >= extent) this.oob(name, pos, n, last + 1, extent, null); } return a; }
    const a = new Array(m.re.length);
    for (let k = 0; k < m.re.length; k++) {
      const v = m.re[k];
      if (!isInt(v)) err(this.sub(name, pos, n, num2str(num(v))) + ': subscripts must be either integers 1 to (2^63)-1 or logicals');
      if (v < 1) err('index (' + this.sub0(pos, n, v) + '): out of bound; value ' + v + ' out of bound ' + extent);
      a[k] = v - 1;
    }
    return a;
  }
  sub(name, pos, n, s) { const parts = []; for (let k = 0; k < n; k++) parts.push(k === pos ? s : '_'); return (name || 'index ') + '(' + parts.join(',') + ')'; }
  sub0(pos, n, v) { const parts = []; for (let k = 0; k < n; k++) parts.push(k === pos ? String(v) : '_'); return parts.join(','); }
  oob(name, pos, n, v, extent, d) { err(this.sub(name, pos, n, String(v)) + ': out of bound ' + extent + (d ? ' (dimensions are ' + d + ')' : '')); }
  index(e, fr, nargout) {
    const obj = e.obj;
    if (obj.type === 'id' && !fr.vars.has(obj.name)) {
      if (e.br === '{') err("'" + obj.name + "' undefined");
      const args = [];
      for (const a of e.args) { if (a.type === 'colon') args.push(str(':')); else if (a.type === 'index' && a.br === '{' && a.args.some(x => x.type === 'colon')) { const c = this.expr(a.obj, fr); if (isCell(c)) args.push(...c.items); else args.push(this.expr(a, fr)); } else args.push(this.expr(a, fr)); }
      return this.call(obj.name, args, nargout, fr);
    }
    const v = obj.type === 'id' ? fr.vars.get(obj.name) : this.expr(obj, fr);
    const name = obj.type === 'id' ? obj.name : 'index ';
    if (isFn(v) && e.br === '(') { const args = e.args.map(a => this.expr(a, fr)); return this.callHandle(v, args, nargout); }
    const idx = this.idxValues(e.args, fr, v);
    if (e.br === '{') {
      if (!isCell(v)) err("'{' undefined for arguments of type '" + className(v) + "' (matrix cannot be indexed with {)");
      const sub = this.subsref(v, idx, name);
      return sub.items.length ? sub.items : [undefined];
    }
    return [this.subsref(v, idx, name)];
  }
  subsref(v, idx, name) {
    const wasStr = isStr(v), cell = isCell(v);
    const d = dims(v), tot = d[0] * d[1];
    const getItem = cell ? k => v.items[k] : null;
    const m = cell ? null : toM(v);
    let rr, cc, list;
    if (idx.length === 0) return v;
    if (idx.length === 1) {
      list = this.toIndex(idx[0], name, 0, 1, tot);
      for (const k of list) if (k >= tot) err((name === 'index ' ? 'index (' + (k + 1) + ')' : name + '(' + (k + 1) + ')') + ': out of bound ' + tot + ' (dimensions are ' + d.join('x') + ')');
      const ix = idx[0];
      const im = (ix === ':' || (isStr(ix) && ix.s === ':')) ? null : toM(ix);
      if (!im) { rr = list.length; cc = 1; }
      else if (d[0] !== 1 && d[1] !== 1 || im.lg && !(d[0] === 1 || d[1] === 1)) { if (im.lg) { rr = list.length; cc = 1; } else { rr = im.r; cc = im.c; } }
      else if (im.r !== 1 && im.c !== 1) { rr = im.r; cc = im.c; }
      else if (d[0] === 1) { rr = 1; cc = list.length; } else { rr = list.length; cc = 1; }
      if (im && im.lg && d[0] === 1) { rr = 1; cc = list.length; }
    } else {
      for (let k = 2; k < idx.length; k++) { const z = this.toIndex(idx[k], name, k, idx.length, 1); if (z.some(q => q !== 0)) this.oob(name, k, idx.length, z.find(q => q !== 0) + 1, 1, d.join('x')); }
      const ri = this.toIndex(idx[0], name, 0, idx.length, d[0]), ci = this.toIndex(idx[1], name, 1, idx.length, d[1]);
      for (const q of ri) if (q >= d[0]) this.oob(name, 0, 2, q + 1, d[0], d.join('x'));
      for (const q of ci) if (q >= d[1]) this.oob(name, 1, 2, q + 1, d[1], d.join('x'));
      rr = ri.length; cc = ci.length; list = [];
      for (const j of ci) for (const i of ri) list.push(i + j * d[0]);
    }
    if (cell) return { t: 'c', r: rr, c: cc, items: list.map(getItem) };
    const o = M(rr, cc, null, m.im ? new Float64Array(rr * cc) : null, m.lg);
    list.forEach((k, q) => { o.re[q] = m.re[k]; if (m.im) o.im[q] = m.im[k]; });
    if (wasStr) { if (rr > 1 && cc > 1) err('le matrici di caratteri non sono supportate'); return str(String.fromCharCode(...o.re)); }
    return m.im ? narrow(o) : o;
  }
  assignIndex(lhs, rhs, fr, isDel) {
    const name = lhs.obj.name;
    let cur = fr.vars.get(name);
    if (isFn(cur)) err('impossibile indicizzare un function handle in assegnazione');
    const cellMode = lhs.br === '{';
    if (cur === undefined) cur = cellMode ? { t: 'c', r: 0, c: 0, items: [] } : (isCell(rhs) ? { t: 'c', r: 0, c: 0, items: [] } : empty());
    if (cellMode && !isCell(cur)) { if (isM(cur) && cur.r * cur.c === 0) cur = { t: 'c', r: 0, c: 0, items: [] }; else err('matrix cannot be indexed with {'); }
    const wasStr = isStr(cur);
    let m = isCell(cur) ? cur : (wasStr ? toM(cur) : cur);
    if (m._own !== fr || wasStr) m = clone(m);
    const idx = this.idxValues(lhs.args, fr, cur);
    const cell = isCell(m);
    if (isDel && !cellMode) {
      this.deleteElems(m, idx, name, cell);
      this.bind(fr, name, wasStr ? str(String.fromCharCode(...m.re)) : m); return;
    }
    // valori da assegnare
    let vals, vim = null, nv;
    if (cell) {
      if (cellMode) { vals = [rhs]; nv = 1; }
      else if (isCell(rhs)) { vals = rhs.items; nv = vals.length; }
      else err('conversion to cell array from ' + className(rhs) + ' not possible: usa le graffe { }');
    } else {
      if (isCell(rhs)) err('operator = undefined for \'matrix\' by \'cell\' operations');
      if (isFn(rhs)) err('operator = undefined for \'matrix\' by \'function handle\' operations');
      const R = toM(rhs); vals = R.re; vim = R.im; nv = R.r * R.c;
      if (vim && !m.im) m.im = new Float64Array(m.re.length);
      if (!R.lg) m.lg = false;
    }
    const set = (k, q) => { if (cell) m.items[k] = vals[nv === 1 ? 0 : q]; else { m.re[k] = vals[nv === 1 ? 0 : q]; if (m.im) m.im[k] = vim ? vim[nv === 1 ? 0 : q] : 0; } };
    if (idx.length === 1) {
      const tot = m.r * m.c, list = this.toIndex(idx[0], name, 0, 1, tot);
      if (nv !== 1 && nv !== list.length) err('=: nonconformant arguments (op1 is 1x' + list.length + ', op2 is ' + (cell ? '1x' + nv : dimStr(toM(rhs))) + ')');
      const mx = list.length ? Math.max(...list) + 1 : 0;
      if (mx > tot) {
        if (m.r * m.c === 0) this.resize(m, 1, mx, cell);
        else if (m.r === 1) this.resize(m, 1, mx, cell);
        else if (m.c === 1) this.resize(m, mx, 1, cell);
        else err("Octave:index-out-of-bounds: " + name + '(' + mx + '): impossibile ridimensionare una matrice ' + dimStr(m) + ' con un indice lineare: usa ' + name + '(riga, colonna)');
      }
      list.forEach((k, q) => set(k, q));
    } else {
      for (let k = 2; k < idx.length; k++) { const z = this.toIndex(idx[k], name, k, idx.length, 1); if (z.some(q => q !== 0)) err('il simulatore supporta solo matrici a due dimensioni'); }
      const R = cell ? null : toM(rhs);
      let ri = idx[0] === ':' && m.r * m.c === 0 ? [...Array(cell ? (isCell(rhs) ? rhs.r : 1) : R.r).keys()] : this.toIndex(idx[0], name, 0, 2, m.r);
      let ci = idx[1] === ':' && m.r * m.c === 0 ? [...Array(cell ? (isCell(rhs) ? rhs.c : 1) : R.c).keys()] : this.toIndex(idx[1], name, 1, 2, m.c);
      if (idx[0] === ':' && m.r === 0 && idx[1] !== ':') ri = [...Array(cell ? 1 : (nv === 1 ? 1 : R.r)).keys()];
      if (idx[1] === ':' && m.c === 0 && idx[0] !== ':') ci = [...Array(cell ? 1 : (nv === 1 ? 1 : R.c)).keys()];
      const cnt = ri.length * ci.length;
      if (nv !== 1 && nv !== cnt) err('=: nonconformant arguments (op1 is ' + ri.length + 'x' + ci.length + ', op2 is ' + (cell ? rhs.r + 'x' + rhs.c : dimStr(R)) + ')');
      const nr = Math.max(m.r, ri.length ? Math.max(...ri) + 1 : 0), nc = Math.max(m.c, ci.length ? Math.max(...ci) + 1 : 0);
      if (nr > m.r || nc > m.c) this.resize(m, nr, nc, cell);
      let q = 0; for (const j of ci) for (const i of ri) set(i + j * m.r, q++);
    }
    if (!cell && m.im) narrow(m);
    this.bind(fr, name, wasStr ? str(String.fromCharCode(...m.re)) : m);
    m._own = fr;
  }
  resize(m, r, c, cell) {
    if (cell) { const it = []; for (let j = 0; j < c; j++) for (let i = 0; i < r; i++) it[i + j * r] = (i < m.r && j < m.c) ? m.items[i + j * m.r] : empty(); m.items = it; m.r = r; m.c = c; return; }
    const re = new Float64Array(r * c), im = m.im ? new Float64Array(r * c) : null;
    for (let j = 0; j < m.c; j++) for (let i = 0; i < m.r; i++) { re[i + j * r] = m.re[i + j * m.r]; if (im) im[i + j * r] = m.im[i + j * m.r]; }
    m.re = re; m.im = im; m.r = r; m.c = c;
  }
  deleteElems(m, idx, name, cell) {
    const get = k => cell ? m.items[k] : [m.re[k], m.im ? m.im[k] : 0];
    const put = (arr, r, c) => { m.r = r; m.c = c; if (cell) m.items = arr; else { m.re = Float64Array.from(arr.map(x => x[0])); m.im = m.im ? Float64Array.from(arr.map(x => x[1])) : null; } };
    if (idx.length === 1) {
      const del = new Set(this.toIndex(idx[0], name, 0, 1, m.r * m.c)); const keep = [];
      for (let k = 0; k < m.r * m.c; k++) if (!del.has(k)) keep.push(get(k));
      if (idx[0] === ':' || (isStr(idx[0]) && idx[0].s === ':')) { put([], 0, 0); return; }
      if (m.c === 1 && m.r > 1) put(keep, keep.length, 1); else put(keep, 1, keep.length);
      return;
    }
    const all = (x, n) => { if (x === ':') return true; const s = new Set(this.toIndex(x, name, 0, 2, n)); return s.size === n; };
    if (all(idx[0], m.r)) { const del = new Set(this.toIndex(idx[1], name, 1, 2, m.c)); const keep = []; let nc = 0; for (let j = 0; j < m.c; j++) if (!del.has(j)) { nc++; for (let i = 0; i < m.r; i++) keep.push(get(i + j * m.r)); } put(keep, m.r, nc); return; }
    if (all(idx[1], m.c)) { const del = new Set(this.toIndex(idx[0], name, 0, 2, m.r)); const rows = []; for (let i = 0; i < m.r; i++) if (!del.has(i)) rows.push(i); const keep = []; for (let j = 0; j < m.c; j++) for (const i of rows) keep.push(get(i + j * m.r)); put(keep, rows.length, m.c); return; }
    err('a null assignment can only have one non-colon index');
  }

  /* ----- chiamate ----- */
  call(name, args, nargout, fr) {
    if (this.funcs.has(name)) return this.callUser(this.funcs.get(name), args, nargout);
    const b = BI[name];
    if (b) { this.frame = fr; const r = b.call(this, args, nargout, fr); return r === undefined ? [] : Array.isArray(r) ? r : [r]; }
    err("'" + name + "' undefined");
  }
  callHandle(f, args, nargout) {
    if (f.name && !f.params) return this.call(f.name, args, nargout, this.frame);
    if (args.length > f.params.length) err('@<anonymous>: function called with too many inputs');
    const fr = { vars: new Map(f.cap), name: '@<anonymous>' };
    f.params.forEach((p, k) => { if (k < args.length) this.bind(fr, p, args[k]); });
    if (++this.depth > MAX_DEPTH) { this.depth = 0; err('max_recursion_depth exceeded'); }
    try { return this.multi(f.body, fr, nargout); } finally { this.depth--; }
  }
  callUser(f, args, nargout) {
    const varargin = f.params[f.params.length - 1] === 'varargin';
    const fixed = varargin ? f.params.length - 1 : f.params.length;
    if (!varargin && args.length > f.params.length) err(f.name + ': function called with too many inputs');
    if (nargout > Math.max(1, f.outs.length)) err(f.name + ': function called with too many outputs');
    const fr = { vars: new Map(), name: f.name, nargin: args.length, nargout };
    for (let k = 0; k < fixed && k < args.length; k++) this.bind(fr, f.params[k], args[k]);
    if (varargin) fr.vars.set('varargin', { t: 'c', r: 1, c: Math.max(0, args.length - fixed), items: args.slice(fixed) });
    if (++this.depth > MAX_DEPTH) { this.depth = 0; err('max_recursion_depth exceeded'); }
    const saved = this.frame; this.frame = fr;
    try { this.block(f.body, fr); } finally { this.depth--; this.frame = saved; }
    const res = [];
    const n = Math.max(nargout, f.outs.length ? 1 : 0);
    for (let k = 0; k < n && k < f.outs.length; k++) {
      const o = f.outs[k];
      if (!fr.vars.has(o)) { if (nargout === 0 && k === 0) return []; err("value on right hand side of assignment: '" + o + "' undefined (" + f.name + " non assegna un valore all'uscita " + o + ')'); }
      res.push(fr.vars.get(o));
    }
    return res;
  }
  callValue(f, args) { // per arrayfun/fplot: f può essere handle o nome
    if (isFn(f)) { const r = this.callHandle(f, args, 1); if (!r.length || r[0] === undefined) err('la funzione non restituisce un valore'); return r[0]; }
    if (isStr(f)) { const r = this.call(f.s, args, 1, this.frame); return r[0]; }
    err('atteso un function handle (es. @(x) x.^2)');
  }

  /* ----- grafici ----- */
  fig() { if (!this.curFig) { this.curFig = { n: this.figs.length + 1, axes: [], cur: null }; this.figs.push(this.curFig); } return this.curFig; }
  ax() { const f = this.fig(); if (!f.cur) { f.cur = this.newAxes([1, 1, [1]]); f.axes.push(f.cur); } return f.cur; }
  newAxes(pos) { return { pos, traces: [], title: '', xlabel: '', ylabel: '', legend: null, legendOn: false, grid: false, minor: false, xlim: null, ylim: null, equal: false, square: false, off: false, hold: false, ci: 0, texts: [] }; }
  resetAxes(a) { const hold = a.hold, pos = a.pos; Object.assign(a, this.newAxes(pos)); a.hold = hold; }
  addTraces(list) {
    const a = this.ax(); if (!a.hold) this.resetAxes(a);
    for (const t of list) { if (!t.color) { t.color = ORDER[a.ci % ORDER.length]; a.ci++; } a.traces.push(t); }
  }
  plotArgs(args, name) {
    const groups = []; let k = 0;
    const props = {};
    while (k < args.length) {
      const a = args[k];
      if (isStr(a)) {
        const key = a.s.toLowerCase();
        if (['linewidth', 'color', 'markersize', 'displayname', 'linestyle', 'marker', 'markerfacecolor', 'markeredgecolor'].includes(key)) { if (k + 1 >= args.length) err(name + ': manca il valore della proprietà ' + a.s); props[key] = args[k + 1]; k += 2; continue; }
        err(name + ": argomento non valido '" + a.s + "'");
      }
      const x = toM(a, name); let y = null, fmt = null;
      if (k + 1 < args.length && !isStr(args[k + 1])) { y = toM(args[k + 1], name); k += 2; } else k += 1;
      if (k < args.length && isStr(args[k]) && !['linewidth', 'color', 'markersize', 'displayname', 'linestyle', 'marker', 'markerfacecolor', 'markeredgecolor'].includes(args[k].s.toLowerCase())) { fmt = parseFmt(args[k].s); k++; }
      groups.push({ x, y, fmt });
    }
    const traces = [];
    for (const g of groups) {
      let X = g.x, Y = g.y;
      if (!Y) { if (X.im) { Y = M(X.r, X.c, X.im.slice()); X = M(X.r, X.c, X.re.slice()); } else { Y = X; X = isVec(Y) ? rowOf(Array.from({ length: numel(Y) }, (_, i) => i + 1)) : rowOf(Array.from({ length: Y.r }, (_, i) => i + 1)); } }
      if (Y.im) { this.warn(name + ': la parte immaginaria di Y viene ignorata'); }
      const series = [];
      if (isVec(X) && isVec(Y)) { if (numel(X) !== numel(Y)) err(name + ': vector lengths must match (x ha ' + numel(X) + ' elementi, y ne ha ' + numel(Y) + ')'); series.push([Array.from(X.re), Array.from(Y.re)]); }
      else if (isVec(X)) { const n = numel(X); if (Y.r === n) for (let j = 0; j < Y.c; j++) series.push([Array.from(X.re), Array.from(Y.re.slice(j * Y.r, (j + 1) * Y.r))]); else if (Y.c === n) for (let i = 0; i < Y.r; i++) series.push([Array.from(X.re), Array.from({ length: n }, (_, j) => Y.re[i + j * Y.r])]); else err(name + ': dimensioni di x e y incompatibili'); }
      else if (X.r === Y.r && X.c === Y.c) for (let j = 0; j < Y.c; j++) series.push([Array.from(X.re.slice(j * X.r, (j + 1) * X.r)), Array.from(Y.re.slice(j * Y.r, (j + 1) * Y.r))]);
      else err(name + ': dimensioni di x e y incompatibili');
      for (const [xs, ys] of series) {
        const f = g.fmt || { color: null, dash: null, marker: null };
        traces.push({ x: xs, y: ys, color: f.color, dash: f.dash || (f.marker ? null : 'solid'), marker: f.marker, width: 1, msize: 6, name: null });
      }
    }
    for (const t of traces) {
      if (props.linewidth) t.width = scalar(props.linewidth);
      if (props.color) t.color = colorArg(props.color);
      if (props.markersize) t.msize = scalar(props.markersize);
      if (props.displayname) t.name = textOf(props.displayname);
      if (props.linestyle) { const s = textOf(props.linestyle); t.dash = { '-': 'solid', '--': 'dash', ':': 'dot', '-.': 'dashdot', none: null }[s]; }
      if (props.marker) { const s = textOf(props.marker); t.marker = s === 'none' ? null : (MARKERS[s] ? s : 'o'); }
      if (props.markerfacecolor) t.mfc = colorArg(props.markerfacecolor);
    }
    return traces;
  }
  figuresOut() {
    return this.figs.filter(f => f.axes.some(a => a.traces.length || a.title || a.xlabel || a.ylabel)).map(f => ({ n: f.n, axes: f.axes.map(a => Object.assign({}, a)) }));
  }

  /* ----- workspace ----- */
  workspace(fr) {
    const list = [];
    [...(fr || this.base).vars.keys()].sort((a, b) => a.localeCompare(b)).forEach(k => {
      if (k.startsWith('_')) return;
      const v = fr ? fr.vars.get(k) : this.base.vars.get(k);
      let val;
      if (isStr(v)) val = "'" + (v.s.length > 40 ? v.s.slice(0, 40) + '…' : v.s) + "'";
      else if (isFn(v)) val = fnText(v);
      else if (isCell(v)) val = '{' + dimStr(v) + ' cell}';
      else if (v.r * v.c === 0) val = '[]';
      else if (v.r * v.c === 1) val = C.display('', v, this).replace(/^ = /, '').trim();
      else if (v.r * v.c <= 12) val = mat2str(v, 5);
      else val = '<' + dimStr(v) + ' ' + className(v) + '>';
      list.push({ name: k, size: dimStr(v), cls: (isM(v) && v.im ? 'complex ' : '') + className(v), val });
    });
    return list;
  }
}

/* ======================= FUNZIONI PREDEFINITE ======================= */
const BI = Object.create(null);
const constFn = (f) => function (args) { const v = f(); if (!args.length) return v; const [r, c] = sizeArgs(args, 'const'); const m = M(r, c); if (v.im) { m.im = new Float64Array(r * c).fill(v.im[0]); } m.re.fill(v.re[0]); m.lg = v.lg; return m; };
BI.pi = constFn(() => num(Math.PI)); BI.e = constFn(() => num(Math.E));
BI.Inf = BI.inf = constFn(() => num(Infinity)); BI.NaN = BI.nan = BI.NA = constFn(() => num(NaN));
BI.eps = function (args) { if (args.length === 1 && isM(args[0]) && args[0].r * args[0].c === 1 && !isStr(args[0])) { const x = Math.abs(args[0].re[0]); if (x === 0) return num(4.9406564584124654e-324); const e = Math.floor(Math.log2(x)); return num(Math.pow(2, e - 52)); } return constFn(() => num(EPS))(args); };
BI.i = BI.j = BI.I = BI.J = constFn(() => cnum(0, 1));
BI.true = constFn(() => bool(true)); BI.false = constFn(() => bool(false));
BI.realmax = () => num(Number.MAX_VALUE); BI.realmin = () => num(2.2250738585072014e-308); BI.intmax = () => num(2147483647); BI.flintmax = () => num(9007199254740992);

// elementari
const U = (name, fr, fc, needC) => function (args) { need(name, args, 1, 1); return fc || needC ? mapC(args[0], fr, fc || ((a) => { err(name + ': argomento complesso non supportato dal simulatore'); }), needC) : mapReal(args[0], fr, name); };
BI.sqrt = U('sqrt', Math.sqrt, csqrt, x => x < 0);
BI.exp = U('exp', Math.exp, cexp);
BI.log = U('log', Math.log, clog, x => x < 0);
BI.log10 = U('log10', Math.log10, (a, b) => { const l = clog(a, b); return [l[0] / Math.LN10, l[1] / Math.LN10]; }, x => x < 0);
BI.log2 = U('log2', Math.log2, (a, b) => { const l = clog(a, b); return [l[0] / Math.LN2, l[1] / Math.LN2]; }, x => x < 0);
BI.log1p = U('log1p', Math.log1p); BI.expm1 = U('expm1', Math.expm1);
BI.sin = U('sin', Math.sin, (a, b) => [Math.sin(a) * Math.cosh(b), Math.cos(a) * Math.sinh(b)]);
BI.cos = U('cos', Math.cos, (a, b) => [Math.cos(a) * Math.cosh(b), -Math.sin(a) * Math.sinh(b)]);
BI.tan = U('tan', Math.tan); BI.atan = U('atan', Math.atan);
BI.asin = U('asin', Math.asin, casin, x => Math.abs(x) > 1);
BI.acos = U('acos', Math.acos, (a, b) => { const s = casin(a, b); return [Math.PI / 2 - s[0], -s[1]]; }, x => Math.abs(x) > 1);
BI.sinh = U('sinh', Math.sinh); BI.cosh = U('cosh', Math.cosh); BI.tanh = U('tanh', Math.tanh);
BI.sind = U('sind', x => { const r = x % 180 === 0 ? 0 : Math.sin(x * Math.PI / 180); return r; }); BI.cosd = U('cosd', x => (x - 90) % 180 === 0 ? 0 : Math.cos(x * Math.PI / 180)); BI.tand = U('tand', x => x % 180 === 0 ? 0 : Math.tan(x * Math.PI / 180));
BI.deg2rad = U('deg2rad', x => x * Math.PI / 180); BI.rad2deg = U('rad2deg', x => x * 180 / Math.PI);
BI.gamma = U('gamma', x => { if (isInt(x) && x > 0 && x < 171) { let f = 1; for (let k = 2; k < x; k++) f *= k; return f; } const g = 7, p = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]; const G = z => { if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * G(1 - z)); z -= 1; let a = p[0]; const t = z + g + 0.5; for (let k = 1; k < 9; k++) a += p[k] / (z + k); return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * a; }; return G(x); });
BI.factorial = function (args) { need('factorial', args, 1, 1); return mapReal(args[0], x => { if (x < 0 || !isInt(x)) err('factorial: all N must be real non-negative integers'); let f = 1; for (let k = 2; k <= x; k++) f *= k; return f; }, 'factorial'); };
BI.abs = function (args) { need('abs', args, 1, 1); const m = toM(args[0]); const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) o.re[k] = m.im ? Math.hypot(m.re[k], m.im[k]) : Math.abs(m.re[k]); return o; };
BI.real = function (args) { const m = toM(args[0]); return M(m.r, m.c, m.re.slice()); };
BI.imag = function (args) { const m = toM(args[0]); return M(m.r, m.c, m.im ? m.im.slice() : null); };
BI.conj = function (args) { const m = toM(args[0]); return M(m.r, m.c, m.re.slice(), m.im ? m.im.map(x => -x) : null); };
BI.angle = BI.arg = function (args) { const m = toM(args[0]); const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) o.re[k] = Math.atan2(m.im ? m.im[k] : 0, m.re[k]); return o; };
BI.complex = function (args) { need('complex', args, 1, 2); const a = toM(args[0]), b = args[1] ? toM(args[1]) : M(a.r, a.c); const o = elementwise(a, b, 'complex', x => x); o.im = elementwise(a, b, 'complex', (x, y) => y).re; return o; };
BI.isreal = a => bool(isM(a[0]) ? !a[0].im : isStr(a[0])); BI.iscomplex = a => bool(isM(a[0]) && !!a[0].im);
const rnd = f => function (args) { need('round', args, 1, 1); const m = toM(args[0]); const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) o.re[k] = f(m.re[k]); if (m.im) o.im = m.im.map(f); return narrow(o); };
BI.round = rnd(roundHalf); BI.floor = rnd(Math.floor); BI.ceil = rnd(Math.ceil); BI.fix = rnd(Math.trunc);
BI.sign = U('sign', x => Math.sign(x));
const B2 = (name, f) => function (args) { need(name, args, 2, 2); return elementwise(args[0], args[1], name, f); };
BI.mod = B2('mod', (x, y) => y === 0 ? x : x - Math.floor(x / y) * y);
BI.rem = B2('rem', (x, y) => y === 0 ? x : x - Math.trunc(x / y) * y);
BI.atan2 = B2('atan2', Math.atan2); BI.hypot = B2('hypot', Math.hypot);
BI.power = a => epow(a[0], a[1]); BI.times = a => elementwise(a[0], a[1], '.*', (x, y) => x * y, cmul); BI.plus = a => elementwise(a[0], a[1], '+', (x, y) => x + y, (p, q, r, s) => [p + r, q + s]); BI.minus = a => elementwise(a[0], a[1], '-', (x, y) => x - y, (p, q, r, s) => [p - r, q - s]);
BI.rdivide = a => elementwise(a[0], a[1], './', (x, y) => x / y, cdiv); BI.mtimes = a => matmul(a[0], a[1]); BI.mldivide = function (a) { return mldivide(a[0], a[1], this); }; BI.mpower = function (a) { return mpower(a[0], a[1], this); };
const gcd2 = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
BI.gcd = B2('gcd', gcd2); BI.lcm = B2('lcm', (a, b) => a && b ? Math.abs(a * b) / gcd2(a, b) : 0);
BI.nchoosek = function (args) { need('nchoosek', args, 2, 2); const n = scalar(args[0]), k = scalar(args[1]); let r = 1; for (let q = 1; q <= k; q++) r = r * (n - k + q) / q; return num(Math.round(r)); };
BI.isprime = function (args) { const m = toM(args[0]); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) { const x = m.re[k]; let p = x >= 2 && isInt(x); for (let d = 2; p && d * d <= x; d++) if (x % d === 0) p = false; o.re[k] = p ? 1 : 0; } return o; };
BI.primes = function (args) { const n = scalar(args[0]); const out = []; for (let x = 2; x <= n; x++) { let p = true; for (let d = 2; d * d <= x; d++) if (x % d === 0) { p = false; break; } if (p) out.push(x); } return rowOf(out); };
BI.isnan = a => { const m = toM(a[0]); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) o.re[k] = Number.isNaN(m.re[k]) || (m.im && Number.isNaN(m.im[k])) ? 1 : 0; return o; };
BI.isinf = a => { const m = toM(a[0]); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) o.re[k] = (m.re[k] === Infinity || m.re[k] === -Infinity) ? 1 : 0; return o; };
BI.isfinite = a => { const m = toM(a[0]); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) o.re[k] = Number.isFinite(m.re[k]) ? 1 : 0; return o; };

// riduzioni
BI.sum = function (args) { need('sum', args, 1, 2); return reduceC(args[0], args[1], 'sum', v => v.reduce((s, x) => s + x, 0), (idx, m) => [idx.reduce((s, k) => s + m.re[k], 0), idx.reduce((s, k) => s + m.im[k], 0)]); };
BI.prod = function (args) { need('prod', args, 1, 2); return reduceC(args[0], args[1], 'prod', v => v.reduce((s, x) => s * x, 1), (idx, m) => idx.reduce((z, k) => cmul(z[0], z[1], m.re[k], m.im[k]), [1, 0])); };
BI.mean = function (args) { need('mean', args, 1, 2); const m = toM(args[0]); if (m.r * m.c === 0) return num(NaN); return reduceC(m, args[1], 'mean', v => v.reduce((s, x) => s + x, 0) / v.length, (idx, mm) => [idx.reduce((s, k) => s + mm.re[k], 0) / idx.length, idx.reduce((s, k) => s + mm.im[k], 0) / idx.length]); };
BI.median = function (args) { return reduceDim(args[0], args[1], v => { if (!v.length) return NaN; const s = [...v].sort((a, b) => a - b), h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; }, 'median'); };
const variance = v => { if (v.length < 2) return 0; const mu = v.reduce((s, x) => s + x, 0) / v.length; return v.reduce((s, x) => s + (x - mu) ** 2, 0) / (v.length - 1); };
BI.var = function (args) { return reduceDim(args[0], args[2], variance, 'var'); };
BI.std = function (args) { return reduceDim(args[0], args[2], v => Math.sqrt(variance(v)), 'std'); };
BI.max = function (args, n) { return minmax(args, n, true, 'max'); };
BI.min = function (args, n) { return minmax(args, n, false, 'min'); };
BI.cumsum = a => cumDim(a[0], a[1], (x, y) => x + y); BI.cumprod = a => cumDim(a[0], a[1], (x, y) => x * y);
BI.any = function (args) { const m = toM(args[0]); if (isVec(m) && args[1] === undefined) return bool(Array.from(m.re).some(x => x !== 0)); const o = reduceDim(m, args[1], v => v.some(x => x !== 0) ? 1 : 0, 'any'); o.lg = true; return o; };
BI.all = function (args) { const m = toM(args[0]); if (isVec(m) && args[1] === undefined) return bool(Array.from(m.re).every(x => x !== 0)); const o = reduceDim(m, args[1], v => v.every(x => x !== 0) ? 1 : 0, 'all'); o.lg = true; return o; };
BI.nnz = a => num(Array.from(toM(a[0]).re).filter(x => x !== 0).length);
BI.diff = function (args) { const m = toM(args[0]); if (isVec(m)) { const v = Array.from(m.re), d = []; for (let k = 1; k < v.length; k++) d.push(v[k] - v[k - 1]); return m.r === 1 ? rowOf(d) : colOf(d); } const o = M(m.r - 1, m.c); for (let j = 0; j < m.c; j++) for (let i = 0; i < m.r - 1; i++) o.re[i + j * (m.r - 1)] = m.re[i + 1 + j * m.r] - m.re[i + j * m.r]; return o; };
BI.sort = function (args, n) {
  const m = toM(args[0]); const desc = args.some(a => isStr(a) && a.s.toLowerCase() === 'descend');
  const cmp = (a, b) => Number.isNaN(a[0]) ? 1 : Number.isNaN(b[0]) ? -1 : desc ? b[0] - a[0] || a[1] - b[1] : a[0] - b[0] || a[1] - b[1];
  const s = M(m.r, m.c), idx = M(m.r, m.c);
  const doSeg = ks => { const pairs = ks.map((k, p) => [m.re[k], p]); pairs.sort(cmp); ks.forEach((k, p) => { s.re[k] = pairs[p][0]; idx.re[k] = pairs[p][1] + 1; }); };
  if (m.r === 1) doSeg([...Array(m.c).keys()]); else for (let j = 0; j < m.c; j++) doSeg([...Array(m.r).keys()].map(i => i + j * m.r));
  return [s, idx];
};
BI.find = function (args, n) {
  const m = toM(args[0]); const lim = args[1] ? scalar(args[1]) : Infinity; const ks = [];
  for (let k = 0; k < m.re.length && ks.length < lim; k++) if (m.re[k] !== 0 || (m.im && m.im[k])) ks.push(k);
  if (n >= 2) { const r = ks.map(k => k % m.r + 1), c = ks.map(k => Math.floor(k / m.r) + 1); return m.r === 1 ? [rowOf(r), rowOf(c)] : [colOf(r), colOf(c)]; }
  const v = ks.map(k => k + 1); return m.r === 1 && m.c !== 1 ? rowOf(v) : (m.r * m.c === 0 ? M(0, 0) : colOf(v));
};
BI.dot = function (args) { need('dot', args, 2, 2); const a = toM(args[0]), b = toM(args[1]); if (numel(a) !== numel(b)) err('dot: sizes of X and Y must match'); let s = 0; for (let k = 0; k < a.re.length; k++) s += a.re[k] * b.re[k]; return num(s); };
BI.cross = function (args) { const a = toM(args[0]), b = toM(args[1]); if (numel(a) !== 3 || numel(b) !== 3) err('cross: both X and Y must have 3 elements'); const [x1, y1, z1] = a.re, [x2, y2, z2] = b.re; const v = [y1 * z2 - z1 * y2, z1 * x2 - x1 * z2, x1 * y2 - y1 * x2]; return a.r === 1 ? rowOf(v) : colOf(v); };

// dimensioni e tipi
BI.size = function (args, n) {
  need('size', args, 1, 2); const d = dims(args[0]);
  if (args[1]) { const k = scalar(args[1]); return num(k === 1 ? d[0] : k === 2 ? d[1] : 1); }
  if (n <= 1) return rowOf(d);
  const out = [num(d[0]), num(d[1])]; for (let k = 2; k < n; k++) out.push(num(1)); return out;
};
BI.numel = a => num(numel(a[0])); BI.length = a => { const d = dims(a[0]); return num(d[0] * d[1] === 0 ? 0 : Math.max(...d)); };
BI.ndims = () => num(2); BI.rows = a => num(dims(a[0])[0]); BI.columns = a => num(dims(a[0])[1]);
BI.isempty = a => bool(numel(a[0]) === 0); BI.isscalar = a => bool(numel(a[0]) === 1);
BI.isvector = a => { const d = dims(a[0]); return bool((d[0] === 1 || d[1] === 1) && d[0] * d[1] >= 1); };
BI.isrow = a => bool(dims(a[0])[0] === 1); BI.iscolumn = a => bool(dims(a[0])[1] === 1); BI.ismatrix = () => bool(true);
BI.issquare = a => { const d = dims(a[0]); return bool(d[0] === d[1]); };
BI.isnumeric = a => bool(isM(a[0]) && !a[0].lg); BI.ischar = a => bool(isStr(a[0])); BI.islogical = BI.isbool = a => bool(isM(a[0]) && a[0].lg);
BI.iscell = a => bool(isCell(a[0])); BI.is_function_handle = a => bool(isFn(a[0])); BI.isfloat = a => bool(isM(a[0]) && !a[0].lg);
BI.isa = a => { const c = className(a[0]), w = textOf(a[1]); return bool(c === w || (w === 'numeric' && c === 'double') || (w === 'float' && c === 'double')); };
BI.class = a => str(className(a[0]));
BI.isequal = function (args) { need('isequal', args, 2); for (let k = 1; k < args.length; k++) if (!isequal(args[0], args[k])) return bool(false); return bool(true); };
BI.double = a => { const m = toM(a[0]); return M(m.r, m.c, m.re.slice(), m.im ? m.im.slice() : null); };
BI.logical = a => { const m = toM(a[0]); const o = M(m.r, m.c, null, null, true); for (let k = 0; k < m.re.length; k++) { if (Number.isNaN(m.re[k])) err('logical: NaN can\'t be converted to logical value'); o.re[k] = m.re[k] ? 1 : 0; } return o; };

// costruzione di matrici
BI.zeros = a => { const [r, c] = sizeArgs(a, 'zeros'); return M(r, c); };
BI.ones = a => { const [r, c] = sizeArgs(a, 'ones'); return fill(r, c, () => 1); };
BI.eye = a => { const [r, c] = sizeArgs(a, 'eye'); const m = M(r, c); for (let k = 0; k < Math.min(r, c); k++) m.re[k + k * r] = 1; return m; };
BI.rand = a => { const [r, c] = sizeArgs(a, 'rand'); return fill(r, c, () => Math.random()); };
BI.randn = a => { const [r, c] = sizeArgs(a, 'randn'); return fill(r, c, () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }); };
BI.randi = function (args) { need('randi', args, 1); const lim = toM(args[0]); const lo = lim.re.length > 1 ? lim.re[0] : 1, hi = lim.re.length > 1 ? lim.re[1] : lim.re[0]; const [r, c] = sizeArgs(args.slice(1), 'randi'); return fill(r, c, () => lo + Math.floor(Math.random() * (hi - lo + 1))); };
BI.magic = function (args) {
  const n = intArg(args[0], 'magic'); const m = M(n, n); const set = (i, j, v) => { m.re[i + j * n] = v; };
  if (n < 1) return M(0, 0); if (n === 1) { m.re[0] = 1; return m; } if (n === 2) { m.re.set([4, 3, 1, 2]); return m; }
  if (n % 2 === 1) { // metodo siamese: magic(3) = [8 1 6;3 5 7;4 9 2]
    const q = M(n, n); let i = 0, j = (n - 1) / 2; for (let k = 1; k <= n * n; k++) { q.re[i + j * n] = k; const ni = (i - 1 + n) % n, nj = (j + 1) % n; if (q.re[ni + nj * n]) i = (i + 1) % n; else { i = ni; j = nj; } } return q; }
  if (n % 4 === 0) { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = i * n + j + 1; const keep = ((i % 4 === 0 || i % 4 === 3) && (j % 4 === 0 || j % 4 === 3)) || ((i % 4 === 1 || i % 4 === 2) && (j % 4 === 1 || j % 4 === 2)); set(i, j, keep ? n * n + 1 - v : v); } return m; }
  const h = n / 2, sub = BI.magic([num(h)]), k = (n - 2) / 4; const add = [0, 2, 3, 1].map(x => x * h * h);
  for (let i = 0; i < h; i++) for (let j = 0; j < h; j++) { const v = sub.re[i + j * h]; set(i, j, v + add[0]); set(i + h, j + h, v + add[3]); set(i, j + h, v + add[1]); set(i + h, j, v + add[2]); }
  for (let i = 0; i < h; i++) { const cols = []; for (let j = 0; j < k; j++) cols.push(j); for (let j = n - k + 1; j < n; j++) cols.push(j); if (i === (h - 1) / 2 || i === Math.floor(h / 2)) { if (i === Math.floor(h / 2)) { cols.splice(0, cols.length); for (let j = 1; j <= k; j++) cols.push(j); for (let j = n - k + 1; j < n; j++) cols.push(j); } } for (const j of cols) { const a = i + j * n, b = i + h + j * n; [m.re[a], m.re[b]] = [m.re[b], m.re[a]]; } }
  return m;
};
BI.linspace = function (args) { need('linspace', args, 2, 3); const a = scalar(args[0], 'linspace'), b = scalar(args[1], 'linspace'); let n = args[2] ? Math.floor(scalar(args[2])) : 100; if (n < 1) n = 1; const m = M(1, n); for (let k = 0; k < n; k++) m.re[k] = n === 1 ? b : a + (b - a) * k / (n - 1); if (n > 1) m.re[n - 1] = b; return m; };
BI.logspace = function (args) { const v = BI.linspace(args); for (let k = 0; k < v.re.length; k++) v.re[k] = Math.pow(10, v.re[k]); return v; };
BI.colon = function (args) { const a = scalar(args[0]), b = scalar(args[args.length - 1]), s = args.length === 3 ? scalar(args[1]) : 1; if (s === 0 || (s > 0 && a > b) || (s < 0 && a < b)) return M(1, 0); const n = Math.floor((b - a) / s + 1e-10) + 1; return fill(1, n, k => a + k * s); };
BI.repmat = function (args) { need('repmat', args, 2, 3); const v = args[0]; let [p, q] = args.length === 3 ? [scalar(args[1]), scalar(args[2])] : (numel(args[1]) === 1 ? [scalar(args[1]), scalar(args[1])] : [toM(args[1]).re[0], toM(args[1]).re[1]]); if (isStr(v)) { if (p !== 1) err('repmat: matrici di caratteri non supportate'); return str(v.s.repeat(q)); } const m = toM(v); const o = M(m.r * p, m.c * q, null, m.im ? new Float64Array(m.r * p * m.c * q) : null, m.lg); for (let J = 0; J < o.c; J++) for (let I = 0; I < o.r; I++) { const k = (I % m.r) + (J % m.c) * m.r; o.re[I + J * o.r] = m.re[k]; if (m.im) o.im[I + J * o.r] = m.im[k]; } return o; };
BI.reshape = function (args) { const m = toM(args[0]); let r, c; if (args.length === 2) { const d = toM(args[1]); r = d.re[0]; c = d.re[1]; } else { r = isM(args[1]) && args[1].r * args[1].c === 0 ? null : scalar(args[1]); c = isM(args[2]) && args[2].r * args[2].c === 0 ? null : scalar(args[2]); if (r === null) r = numel(m) / c; if (c === null) c = numel(m) / r; } if (r * c !== numel(m)) err("reshape: can't reshape " + dimStr(m) + ' array to ' + r + 'x' + c + ' array'); return M(r, c, m.re.slice(), m.im ? m.im.slice() : null, m.lg); };
BI.diag = function (args) { const m = toM(args[0]); const k = args[1] ? scalar(args[1]) : 0; if (isVec(m)) { const n = numel(m) + Math.abs(k); const o = M(n, n); for (let q = 0; q < numel(m); q++) { const i = k >= 0 ? q : q - k, j = k >= 0 ? q + k : q; o.re[i + j * n] = m.re[q]; } return o; } const v = []; for (let q = 0; ; q++) { const i = k >= 0 ? q : q - k, j = k >= 0 ? q + k : q; if (i >= m.r || j >= m.c) break; v.push(m.re[i + j * m.r]); } return colOf(v); };
BI.triu = function (args) { const m = clone(toM(args[0])); const k = args[1] ? scalar(args[1]) : 0; for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) if (j - i < k) m.re[i + j * m.r] = 0; return m; };
BI.tril = function (args) { const m = clone(toM(args[0])); const k = args[1] ? scalar(args[1]) : 0; for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) if (j - i > k) m.re[i + j * m.r] = 0; return m; };
BI.fliplr = function (args) { if (isStr(args[0])) return str([...args[0].s].reverse().join('')); const m = toM(args[0]), o = M(m.r, m.c, null, m.im ? new Float64Array(m.re.length) : null); for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) { o.re[i + (m.c - 1 - j) * m.r] = m.re[i + j * m.r]; if (m.im) o.im[i + (m.c - 1 - j) * m.r] = m.im[i + j * m.r]; } return o; };
BI.flipud = function (args) { const m = toM(args[0]), o = M(m.r, m.c, null, m.im ? new Float64Array(m.re.length) : null); for (let i = 0; i < m.r; i++) for (let j = 0; j < m.c; j++) { o.re[m.r - 1 - i + j * m.r] = m.re[i + j * m.r]; if (m.im) o.im[m.r - 1 - i + j * m.r] = m.im[i + j * m.r]; } return o; };
BI.horzcat = function (args) { return this.concat([args]); }; BI.vertcat = function (args) { return this.concat(args.map(a => [a])); };
BI.cat = function (args) { const d = scalar(args[0]); return d === 1 ? this.concat(args.slice(1).map(a => [a])) : this.concat([args.slice(1)]); };
BI.transpose = a => transpose(a[0], false); BI.ctranspose = a => transpose(a[0], true);

// algebra lineare
BI.det = function (args) { need('det', args, 1, 1); return num(det(args[0])); };
BI.inv = BI.inverse = function (args) { need('inv', args, 1, 1); return inv(args[0], this); };
BI.trace = function (args) { need('trace', args, 1, 1); const m = toM(args[0]); if (m.r !== m.c) err('trace: only valid on square matrix'); let s = 0; for (let k = 0; k < m.r; k++) s += m.re[k + k * m.r]; return num(s); };
BI.rank = a => num(rankOf(toM(a[0])));
BI.rref = a => rref(a[0]);
BI.norm = function (args) {
  const m = toM(args[0]); const p = args[1] === undefined ? 2 : isStr(args[1]) ? args[1].s : scalar(args[1]);
  const absv = k => Math.hypot(m.re[k], m.im ? m.im[k] : 0);
  if (isVec(m)) { const a = Array.from({ length: m.re.length }, (_, k) => absv(k)); if (p === Infinity || p === 'inf' || p === 'Inf') return num(Math.max(...a, 0)); if (p === -Infinity) return num(Math.min(...a)); if (p === 'fro') return num(Math.sqrt(a.reduce((s, x) => s + x * x, 0))); if (p === 1) return num(a.reduce((s, x) => s + x, 0)); return num(Math.pow(a.reduce((s, x) => s + Math.pow(x, p), 0), 1 / p)); }
  if (p === 1) return num(C.norm1(m)); if (p === Infinity || p === 'inf' || p === 'Inf') return num(normInf(m)); if (p === 'fro') { let s = 0; for (let k = 0; k < m.re.length; k++) s += absv(k) ** 2; return num(Math.sqrt(s)); }
  if (p === 2) return num(norm2mat(m)); err('norm: nel simulatore per le matrici sono disponibili le norme 1, 2, Inf e \'fro\'');
};
BI.cond = function (args) { const m = toM(args[0]); requireSquare(m, 'cond'); const L = lup(m); if (L.singular) return num(Infinity); const Ai = C.luSolve(L, eye(m.r)); return num(norm2mat(m) * norm2mat(Ai)); };
BI.lu = function (args, n) {
  const a = toM(args[0]); realOnly(a, 'lu'); requireSquare(a, 'lu'); const L0 = lup(a), N = a.r;
  const L = eye(N), U = M(N, N), P = M(N, N);
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) { if (j < i) L.re[i + j * N] = L0.a[i + j * N]; else U.re[i + j * N] = L0.a[i + j * N]; }
  L0.perm.forEach((p, i) => { P.re[i + p * N] = 1; });
  if (n <= 2) { return [matmul(transpose(P, false), L), U]; }
  return [L, U, P];
};
BI.pinv = function (args) { const a = toM(args[0]); const at = transpose(a, false); return a.r >= a.c ? matmul(inv(matmul(at, a), this), at) : matmul(at, inv(matmul(a, at), this)); };
BI.kron = function (args) { const a = toM(args[0]), b = toM(args[1]); const o = M(a.r * b.r, a.c * b.c); for (let i = 0; i < a.r; i++) for (let j = 0; j < a.c; j++) for (let p = 0; p < b.r; p++) for (let q = 0; q < b.c; q++) o.re[i * b.r + p + (j * b.c + q) * o.r] = a.re[i + j * a.r] * b.re[p + q * b.r]; return o; };

// testo e output
BI.disp = function (args) { need('disp', args, 1, 1); this.print(dispText(args[0], this)); };
BI.display = function (args) { this.print(display('', args[0], this).replace(/^ = /, '')); };
BI.fprintf = BI.printf = function (args, n) {
  if (!args.length) err('Invalid call to fprintf');
  let a = args; if (isM(a[0]) && !isStr(a[0]) && numel(a[0]) === 1 && (a[0].re[0] === 1 || a[0].re[0] === 2) && a.length > 1) a = a.slice(1);
  if (!isStr(a[0])) { this.print(formatPrintf('%g\n', a, this)); return; }
  const s = formatPrintf(a[0].s, a.slice(1), this); this.print(s); if (n > 0) return num(s.length);
};
BI.sprintf = function (args) { need('sprintf', args, 1); return str(formatPrintf(textOf(args[0]), args.slice(1), this)); };
BI.num2str = function (args) { need('num2str', args, 1, 2); return str(num2str(args[0], args[1] === undefined ? undefined : isStr(args[1]) ? args[1].s : scalar(args[1]))); };
BI.int2str = a => str(num2str(BI.round([a[0]])));
BI.mat2str = a => str(mat2str(a[0], a[1] ? scalar(a[1]) : undefined));
BI.str2num = BI.str2double = function (args) { const s = textOf(args[0]).trim(); const v = Number(s); if (s !== '' && !Number.isNaN(v)) return num(v); try { const ip = new Interp(); ip.run('__v__ = [' + s + '];'); return ip.base.vars.get('__v__'); } catch { return num(NaN); } };
BI.strcat = a => str(a.map(x => isStr(x) ? x.s.replace(/\s+$/, '') : textOf(x)).join(''));
BI.upper = BI.toupper = a => str(textOf(a[0]).toUpperCase()); BI.lower = BI.tolower = a => str(textOf(a[0]).toLowerCase());
BI.strtrim = a => str(textOf(a[0]).trim()); BI.blanks = a => str(' '.repeat(scalar(a[0])));
BI.strcmp = a => bool(isStr(a[0]) && isStr(a[1]) && a[0].s === a[1].s); BI.strcmpi = a => bool(isStr(a[0]) && isStr(a[1]) && a[0].s.toLowerCase() === a[1].s.toLowerCase());
BI.strrep = a => str(textOf(a[0]).split(textOf(a[1])).join(textOf(a[2])));
BI.strfind = a => { const s = textOf(a[0]), p = textOf(a[1]), out = []; if (p) for (let k = s.indexOf(p); k >= 0; k = s.indexOf(p, k + 1)) out.push(k + 1); return out.length ? rowOf(out) : M(1, 0); };
BI.contains = a => bool(textOf(a[0]).includes(textOf(a[1])));
BI.strsplit = a => { const parts = textOf(a[0]).split(a[1] ? textOf(a[1]) : ' '); return { t: 'c', r: 1, c: parts.length, items: parts.map(str) }; };
BI.strjoin = a => { if (!isCell(a[0])) err('strjoin: CSTR must be a cell array of strings'); return str(a[0].items.map(textOf).join(a[1] ? textOf(a[1]) : ' ')); };
BI.regexp = function (args) { const s = textOf(args[0]); let re; try { re = new RegExp(textOf(args[1]), 'g'); } catch { err('regexp: espressione regolare non valida'); } const once = args.some(x => isStr(x) && x.s === 'once'); const ms = [...s.matchAll(re)]; if (args.some(x => isStr(x) && x.s === 'match')) { if (once) return ms.length ? str(ms[0][0]) : str(''); return { t: 'c', r: 1, c: ms.length, items: ms.map(m => str(m[0])) }; } const st = ms.map(m => m.index + 1); return once ? (st.length ? num(st[0]) : empty()) : (st.length ? rowOf(st) : M(1, 0)); };
BI.char = a => { if (isStr(a[0])) return a[0]; return str(String.fromCharCode(...toM(a[0]).re)); };
BI.func2str = a => { if (!isFn(a[0])) err('func2str: FCN_HANDLE argument must be a valid function handle'); return str(fnText(a[0])); };
BI.str2func = function (a) { const s = textOf(a[0]); if (/^\s*@/.test(s)) { const ip = this; const prog = C.parse('__f__ = ' + s + ';'); ip.block(prog.body, ip.frame); const f = ip.frame.vars.get('__f__'); ip.frame.vars.delete('__f__'); return f; } return { t: 'f', name: s }; };
BI.feval = function (args, n) { const f = args[0]; if (isStr(f)) return this.call(f.s, args.slice(1), n, this.frame); if (isFn(f)) return this.callHandle(f, args.slice(1), n); err('feval: FUNC must be a string or function handle'); };
BI.arrayfun = function (args) { const f = args[0], m = toM(args[1]); const o = M(m.r, m.c); for (let k = 0; k < m.re.length; k++) { const r = toM(this.callValue(f, [num(m.re[k])])); if (r.re.length !== 1) err('arrayfun: all values must be scalars when UniformOutput = true'); o.re[k] = r.re[0]; } return o; };
BI.cell = a => { const [r, c] = sizeArgs(a, 'cell'); return { t: 'c', r, c, items: Array.from({ length: r * c }, () => empty()) }; };
BI.iscellstr = a => bool(isCell(a[0]) && a[0].items.every(isStr));
BI.error = function (args) {
  if (!args.length) err('Invalid call to error');
  let a = args; if (a.length > 1 && isStr(a[0]) && /^[A-Za-z][\w-]*(:[\w-]+)+$/.test(a[0].s) && isStr(a[1])) a = a.slice(1);
  const msg = a.length > 1 ? formatPrintf(textOf(a[0]), a.slice(1), this) : textOf(a[0]);
  err(msg);
};
BI.warning = function (args) { if (!args.length) return; const s0 = textOf(args[0]); if (['on', 'off', 'query', 'error'].includes(s0)) return; let a = args; if (a.length > 1 && /^[A-Za-z][\w-]*(:[\w-]+)+$/.test(s0)) a = a.slice(1); this.warn(a.length > 1 ? formatPrintf(textOf(a[0]), a.slice(1), this) : textOf(a[0])); };
BI.assert = function (args) {
  need('assert', args, 1);
  if (args.length === 1 || isStr(args[1])) {
    const c = args[0]; let ok = true; const m = toM(c); if (m.r * m.c === 0) ok = false; for (const x of m.re) if (!x) ok = false;
    if (!ok) err(args.length > 1 ? formatPrintf(args[1].s, args.slice(2), this) : 'assert (cond) failed');
    return;
  }
  const obs = args[0], exp = args[1], tol = args[2] ? scalar(args[2]) : 0;
  if (isStr(obs) || isStr(exp) || isCell(obs) || isCell(exp)) { if (!isequal(obs, exp)) err('ASSERT errors: valore osservato diverso da quello atteso'); return; }
  const a = toM(obs), b = toM(exp);
  if (b.r * b.c !== 1 && (a.r !== b.r || a.c !== b.c)) err('ASSERT errors: Dimensions don\'t match (osservato ' + dimStr(a) + ', atteso ' + dimStr(b) + ')');
  for (let k = 0; k < a.re.length; k++) {
    const x = a.re[k], y = b.re[b.re.length === 1 ? 0 : k];
    if (Number.isNaN(x) && Number.isNaN(y)) continue;
    const d = Math.abs(x - y), lim = tol < 0 ? Math.abs(tol * y) : tol;
    if (!(d <= lim) && !(x === y)) err('ASSERT errors: valore osservato ' + C.fmtScalarReal(x) + ', atteso ' + C.fmtScalarReal(y) + (tol ? ' (tolleranza ' + Math.abs(tol) + ')' : ''));
  }
};
BI.exist = function (args) { const n = textOf(args[0]); if (this.frame.vars.has(n)) return num(1); if (this.funcs.has(n)) return num(103); if (BI[n]) return num(['pi', 'e', 'i', 'j', 'Inf', 'NaN', 'eps'].includes(n) ? 5 : 2); return num(0); };
BI.isvarname = a => bool(isStr(a[0]) && /^[A-Za-z]\w*$/.test(a[0].s) && !/^(if|for|end|while|function|else|elseif|switch|case|otherwise|break|continue|return|do|until|try|catch|global|persistent)$/.test(a[0].s));
BI.nargin = function (args) { if (args.length) { const f = this.funcs.get(textOf(args[0])); return num(f ? f.params.length : -1); } if (this.frame.nargin === undefined) err("'nargin' undefined"); return num(this.frame.nargin); };
BI.nargout = function () { if (this.frame.nargout === undefined) err("'nargout' undefined"); return num(this.frame.nargout); };
BI.tic = function (a, n) { this.t0 = Date.now(); if (n > 0) return num(this.t0); };
BI.toc = function (a, n) { const s = (Date.now() - this.t0) / 1000; if (n > 0) return num(s); this.print('Elapsed time is ' + s.toFixed(4) + ' seconds.\n'); };
BI.input = BI.keyboard = function () { err("input: la lettura da tastiera non è disponibile nel simulatore: assegna i valori direttamente alle variabili (es. r = 5;)"); };
BI.pause = BI.beep = BI.drawnow = BI.more = BI.doc = BI.commandwindow = function () { };
BI.pkg = function (args) { if (args[0] && textOf(args[0]) === 'load') this.print('(pkg load: nel simulatore i pacchetti non sono necessari)\n'); };
BI.version = BI.OCTAVE_VERSION = () => str('11.3.0 (simulatore didattico)');
BI.ver = function () { this.print('----------------------------------------------------------------------\nGNU Octave Version: 11.3.0 · simulatore didattico nel browser\n----------------------------------------------------------------------\n'); };
BI.format = function (args) { const s = args.length ? textOf(args[0]).toLowerCase() : 'short'; if (s === 'long' || s === 'short') this.format = s; else if (s !== 'compact' && s !== 'loose') err('format: formato non disponibile nel simulatore (usa format short o format long)'); };
BI.clc = function () { this.out = []; this.outLen = 0; this.print('\f'); };
BI.clear = BI.clearvars = function (args) {
  const names = args.map(textOf).filter(s => !s.startsWith('-'));
  if (!names.length || names.includes('all') || names.includes('variables')) { this.frame.vars.clear(); return; }
  for (const n of names) { if (n.includes('*')) { const re = new RegExp('^' + n.replace(/\*/g, '.*') + '$'); [...this.frame.vars.keys()].forEach(k => { if (re.test(k)) this.frame.vars.delete(k); }); } else this.frame.vars.delete(n); }
};
BI.who = function () { const ks = [...this.frame.vars.keys()].filter(k => !k.startsWith('_')).sort(); if (!ks.length) return; this.print('Variables visible from the current scope:\n\n' + ks.join('  ') + '\n\n'); };
BI.whos = function () {
  const ks = [...this.frame.vars.keys()].filter(k => !k.startsWith('_')).sort(); if (!ks.length) return;
  const rows = ks.map(k => { const v = this.frame.vars.get(k); const n = numel(v); const bytes = isStr(v) ? n : isFn(v) ? 0 : isCell(v) ? 0 : n * (v.lg ? 1 : 8) * (v.im ? 2 : 1); return { attr: isM(v) && v.im ? 'c' : '', k, size: dimStr(v), bytes, cls: className(v), n }; });
  const wN = Math.max(4, ...rows.map(r => r.k.length));
  let s = 'Variables visible from the current scope:\n\nvariables in scope: top scope\n\n  Attr   ' + 'Name'.padEnd(wN) + '        Size                     Bytes  Class\n  ====   ' + '===='.padEnd(wN) + '        ====                     =====  =====\n';
  rows.forEach(r => { s += '    ' + r.attr.padEnd(3) + '  ' + r.k.padEnd(wN) + '        ' + r.size.padEnd(20) + String(r.bytes).padStart(10) + '  ' + r.cls + '\n'; });
  const te = rows.reduce((a, r) => a + r.n, 0), tb = rows.reduce((a, r) => a + r.bytes, 0);
  s += '\nTotal is ' + te + ' element' + (te === 1 ? '' : 's') + ' using ' + tb + ' byte' + (tb === 1 ? '' : 's') + '\n\n';
  this.print(s);
};
BI.help = function (args) {
  if (!args.length) { this.print("Per la guida di una funzione scrivi: help nome  (es. help sqrt)\nNel simulatore la guida è ridotta; in GNU Octave «help nome» e «doc nome» mostrano la documentazione completa.\n"); return; }
  const n = textOf(args[0]), h = HELP[n];
  if (this.funcs.has(n)) { this.print("'" + n + "' è una funzione definita nel tuo script\n\n -- " + (this.funcs.get(n).outs.length ? '[' + this.funcs.get(n).outs.join(', ') + '] = ' : '') + n + ' (' + this.funcs.get(n).params.join(', ') + ')\n\n'); return; }
  if (!h && !BI[n]) err("help: '" + n + "' not found");
  if (!h) { this.print("'" + n + "' è una funzione predefinita\n\n(Nel simulatore la guida di questa funzione non è disponibile: in GNU Octave scrivi help " + n + ".)\n"); return; }
  this.print("'" + n + "' è una funzione predefinita\n\n -- " + h[0] + '\n     ' + h[1] + '\n\n(Guida ridotta del simulatore: in GNU Octave «help ' + n + '» mostra la documentazione completa.)\n');
};

// grafici
BI.figure = function (args) {
  if (args.length && !isStr(args[0])) { const n = scalar(args[0]); let f = this.figs.find(x => x.n === n); if (!f) { f = { n, axes: [], cur: null }; this.figs.push(f); } this.curFig = f; return; }
  const n = this.figs.reduce((m, f) => Math.max(m, f.n), 0) + 1; this.curFig = { n, axes: [], cur: null }; this.figs.push(this.curFig);
};
BI.subplot = function (args) {
  need('subplot', args, 1, 3); let m, n, p;
  if (args.length === 1) { const d = String(scalar(args[0])); if (d.length !== 3) err('subplot: usa subplot(righe, colonne, posizione)'); [m, n, p] = [...d].map(Number); p = [p]; }
  else { m = scalar(args[0]); n = scalar(args[1]); p = Array.from(toM(args[2]).re); }
  if (!(m >= 1 && n >= 1) || p.some(x => !(x >= 1 && x <= m * n && isInt(x)))) err('subplot: INDEX value must be >= 1 and <= ROWS*COLS (qui ' + m + '*' + n + ' = ' + m * n + ')');
  const f = this.fig(), key = m + ',' + n + ',' + p.join(' ');
  let a = f.axes.find(x => x.pos[0] + ',' + x.pos[1] + ',' + x.pos[2].join(' ') === key);
  if (!a) { f.axes = f.axes.filter(x => !(x.pos[0] === 1 && x.pos[1] === 1 && !x.traces.length)); a = this.newAxes([m, n, p]); f.axes.push(a); }
  f.cur = a;
};
BI.plot = function (args) { need('plot', args, 1); this.addTraces(this.plotArgs(args, 'plot')); };
BI.scatter = function (args) {
  need('scatter', args, 2); const x = toM(args[0]), y = toM(args[1]); if (numel(x) !== numel(y)) err('scatter: X and Y must be vectors of the same length');
  const t = { x: Array.from(x.re), y: Array.from(y.re), color: null, dash: null, marker: 'o', width: 1, msize: 6, name: null };
  args.slice(2).forEach(a => { if (isStr(a)) { if (a.s === 'filled') t.filled = true; else if (COLORS[a.s] || COLOR_NAMES[a.s]) t.color = colorArg(a); } else if (numel(a) === 1) t.msize = Math.sqrt(scalar(a)); else if (numel(a) === 3) t.color = colorArg(a); });
  this.addTraces([t]);
};
BI.fplot = function (args) {
  need('fplot', args, 1); const f = args[0]; let lim = [-5, 5], fmt = null;
  args.slice(1).forEach(a => { if (isStr(a)) fmt = parseFmt(a.s); else { const m = toM(a); lim = [m.re[0], m.re[1]]; } });
  const N = 400, xs = [], ys = [];
  for (let k = 0; k < N; k++) xs.push(lim[0] + (lim[1] - lim[0]) * k / (N - 1));
  const out = toM(this.callValue(f, [rowOf(xs)]));
  if (numel(out) === N) for (let k = 0; k < N; k++) ys.push(out.re[k]);
  else { for (let k = 0; k < N; k++) ys.push(toM(this.callValue(f, [num(xs[k])])).re[0]); }
  const t = { x: xs, y: ys, color: fmt && fmt.color, dash: (fmt && fmt.dash) || (fmt && fmt.marker ? null : 'solid'), marker: fmt && fmt.marker, width: 1, msize: 6, name: null };
  this.addTraces([t]);
};
const labelFn = key => function (args) { need(key, args, 1); this.ax()[key] = isStr(args[0]) ? args[0].s : isCell(args[0]) ? args[0].items.map(textOf).join('\n') : num2str(args[0]); };
BI.title = labelFn('title'); BI.xlabel = labelFn('xlabel'); BI.ylabel = labelFn('ylabel');
BI.legend = function (args) {
  const a = this.ax();
  if (args.length === 1 && isStr(args[0]) && ['off', 'hide'].includes(args[0].s.toLowerCase())) { a.legendOn = false; return; }
  if (args.length === 1 && isStr(args[0]) && ['show', 'on', 'toggle', 'boxon', 'boxoff'].includes(args[0].s.toLowerCase())) { a.legendOn = args[0].s !== 'toggle' ? true : !a.legendOn; return; }
  let names = [];
  for (let k = 0; k < args.length; k++) {
    const x = args[k];
    if (isStr(x) && ['location', 'orientation', 'fontsize', 'textcolor', 'box', 'numcolumns'].includes(x.s.toLowerCase())) { if (x.s.toLowerCase() === 'location' && args[k + 1]) a.legendLoc = textOf(args[k + 1]).toLowerCase(); k++; continue; }
    if (isCell(x)) names.push(...x.items.map(textOf)); else names.push(textOf(x));
  }
  a.legend = names; a.legendOn = true;
};
BI.grid = function (args) { const a = this.ax(); const s = args.length ? textOf(args[0]).toLowerCase() : null; if (s === 'on') a.grid = true; else if (s === 'off') { a.grid = false; a.minor = false; } else if (s === 'minor') { a.grid = true; a.minor = !a.minor; } else if (!s) a.grid = !a.grid; else err("grid: argomento non valido '" + s + "' (usa grid on oppure grid off)"); };
BI.box = function () { };
BI.hold = function (args) { const a = this.ax(); const s = args.length ? textOf(args[0]).toLowerCase() : null; if (s === 'on' || s === 'all') a.hold = true; else if (s === 'off') a.hold = false; else if (!s) a.hold = !a.hold; else err("hold: argomento non valido '" + s + "'"); };
BI.ishold = function () { return bool(this.ax().hold); };
BI.axis = function (args) {
  const a = this.ax();
  for (const x of args) {
    if (isStr(x)) { const s = x.s.toLowerCase(); if (s === 'equal' || s === 'image') a.equal = true; else if (s === 'square') a.square = true; else if (s === 'tight') a.tight = true; else if (s === 'off') a.off = true; else if (s === 'on') a.off = false; else if (s === 'auto' || s === 'normal') { a.xlim = a.ylim = null; a.equal = a.square = a.tight = false; } else if (s === 'xy' || s === 'ij' || s === 'manual') { } else err("axis: opzione non valida '" + x.s + "'"); }
    else { const m = toM(x); if (m.re.length < 4) err('axis: LIMITS must be a 4-element vector [xmin xmax ymin ymax]'); a.xlim = [m.re[0], m.re[1]]; a.ylim = [m.re[2], m.re[3]]; if (!(m.re[0] < m.re[1] && m.re[2] < m.re[3])) err('axis: i limiti devono essere crescenti [xmin xmax ymin ymax]'); }
  }
};
BI.xlim = function (args) { const m = toM(args[0]); this.ax().xlim = [m.re[0], m.re[1]]; };
BI.ylim = function (args) { const m = toM(args[0]); this.ax().ylim = [m.re[0], m.re[1]]; };
BI.text = function (args) { need('text', args, 3); this.ax().texts.push({ x: scalar(args[0]), y: scalar(args[1]), s: textOf(args[2]) }); };
BI.close = function () { this.figs = []; this.curFig = null; };
BI.clf = function () { const f = this.fig(); f.axes = []; f.cur = null; };
BI.cla = function () { this.resetAxes(this.ax()); };
BI.gcf = function () { return num(this.fig().n); };

/* ======================= ESECUZIONE CON VERIFICHE ======================= */
function runProgram(code, checks, session) {
  const ip = session || new Interp();
  const res = { out: '', errore: null, verifiche: null, figures: [], workspace: [] };
  try { ip.run(code); }
  catch (e) {
    if (e instanceof OctError) res.errore = { msg: e.message, riga: e.line };
    else if (e instanceof RangeError) res.errore = { msg: 'max_recursion_depth exceeded (ricorsione troppo profonda)', riga: null };
    else res.errore = { msg: 'errore interno del simulatore: ' + (e && e.message), riga: null, interno: true };
  }
  let out = ip.takeOutput(); const cl = out.lastIndexOf('\f'); if (cl >= 0) { out = out.slice(cl + 1); res.clc = true; }
  res.out = out;
  res.figures = ip.figuresOut();
  res.workspace = ip.workspace();
  if (checks) {
    const nPlots = ip.figs.reduce((s, f) => s + f.axes.reduce((t, a) => t + a.traces.length, 0), 0);
    res.verifiche = checks.map(c => {
      if (res.errore) return { ok: false, msg: 'Il programma si interrompe con un errore: correggilo prima.' };
      const fr = { vars: new Map(ip.base.vars), name: null };
      fr.vars.set('_OUTPUT', str(res.out)); fr.vars.set('_CODE', str(code)); fr.vars.set('_NTRACCE', num(nPlots));
      const saved = ip.base; const savedFigs = ip.figs;
      try { ip.frame = fr; const prog = C.parse(c); prog.funcs.forEach((f, k) => ip.funcs.set(k, f)); ip.block(prog.body, fr); ip.takeOutput(); return { ok: true }; }
      catch (e) { ip.takeOutput(); return { ok: false, msg: e instanceof OctError ? e.message : String(e && e.message) }; }
      finally { ip.base = saved; ip.frame = saved; ip.figs = savedFigs; }
    });
  }
  return res;
}

root.OctEval = { Interp, runProgram, BI };
if (typeof module !== 'undefined' && module.exports) module.exports = { Interp, runProgram, BI, OctCore: C };
})(typeof self !== 'undefined' ? self : globalThis);
