/* Corso Introduzione a Python · Lezione 4 · simulazioni:
   diagramma di flusso di if…else (slide 9), condizioni sulla retta dei numeri, tabella di verità di and/or/not. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const fmt = x => Number.isInteger(x) ? x.toFixed(1) : String(x);

  /* ---------- 1. Diagramma di flusso dell'if…else ---------- */
  const fc = $('#flow');
  if (fc) {
    const dv = $('#fcDiv'), ds = $('#fcDis'), out = $('.code-inline-out', fc), lines = fc.querySelectorAll('.flow-code li');
    function upd() {
      const a = Number(dv.value.replace(',', '.')), b = Number(ds.value.replace(',', '.'));
      if (!dv.value.trim() || !ds.value.trim() || Number.isNaN(a) || Number.isNaN(b)) { out.textContent = 'Scrivi due numeri.'; return; }
      const vero = b !== 0;
      fc.querySelectorAll('[data-path]').forEach(p => p.classList.toggle('on', p.dataset.path === 'both' || p.dataset.path === (vero ? 'si' : 'no')));
      fc.querySelector('.flow-cond-val').textContent = 'divisore != 0  →  ' + fmt(b) + ' != 0  →  ' + (vero ? 'True' : 'False');
      lines.forEach(li => li.classList.toggle('on', li.dataset.b === 'both' || li.dataset.b === (vero ? 'si' : 'no')));
      lines.forEach(li => li.classList.toggle('off', li.dataset.b !== 'both' && li.dataset.b !== (vero ? 'si' : 'no')));
      out.textContent = 'inserisci il dividendo: ' + dv.value + '\ninserisci il divisore: ' + ds.value + '\n' + (vero ? 'il quoziente è ' + fmt(a / b) : "errore! il divisore non può essere 0\ncambia il valore del divisore e riprova") + '\n[fine del programma]';
    }
    dv.oninput = ds.oninput = upd; upd();
  }

  /* ---------- 2. Condizioni sulla retta dei numeri ---------- */
  const COND = {
    'x > 0': { f: x => x > 0, parts: x => [['x > 0', x > 0]] },
    'x >= 18': { f: x => x >= 18, parts: x => [['x >= 18', x >= 18]] },
    'x != 0': { f: x => x !== 0, parts: x => [['x != 0', x !== 0]] },
    'x % 2 == 0': { f: x => ((x % 2) + 2) % 2 === 0, parts: x => [['x % 2 → ' + (((x % 2) + 2) % 2), true], ['x % 2 == 0', ((x % 2) + 2) % 2 === 0]] },
    'x > 0 and x < 10': { f: x => x > 0 && x < 10, op: 'and', parts: x => [['x > 0', x > 0], ['x < 10', x < 10]] },
    'x >= 6 and x <= 8': { f: x => x >= 6 && x <= 8, op: 'and', parts: x => [['x >= 6', x >= 6], ['x <= 8', x <= 8]] },
    'x < 0 or x > 10': { f: x => x < 0 || x > 10, op: 'or', parts: x => [['x < 0', x < 0], ['x > 10', x > 10]] },
    'not x == 5': { f: x => !(x === 5), op: 'not', parts: x => [['x == 5', x === 5]] },
    'not (x > 0 and x < 10)': { f: x => !(x > 0 && x < 10), op: 'not', parts: x => [['x > 0 and x < 10', x > 0 && x < 10]] }
  };
  const nl = $('#numline');
  if (nl) {
    const sel = $('#nlCond'), xs = $('#nlX'), svg = $('svg', nl), res = $('#nlRes');
    Object.keys(COND).forEach(k => { const o = el('option', '', k); o.value = k; sel.append(o); });
    const MIN = -12, MAX = 22, W = 720, X = v => 20 + (W - 40) * (v - MIN) / (MAX - MIN);
    function draw() {
      const c = COND[sel.value], x = +xs.value; $('#nlXV').textContent = x;
      const NS = 'http://www.w3.org/2000/svg', mk = (t, a, txt) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (txt != null) e.textContent = txt; return e; };
      svg.innerHTML = '';
      svg.append(mk('line', { x1: 10, y1: 60, x2: W - 10, y2: 60, stroke: '#52657a', 'stroke-width': 2 }));
      for (let v = MIN; v <= MAX; v++) {
        const ok = c.f(v);
        svg.append(mk('circle', { cx: X(v), cy: 60, r: v === x ? 10 : 6, fill: ok ? '#2a9d8f' : '#fff', stroke: v === x ? '#102a43' : ok ? '#2a9d8f' : '#c0562b', 'stroke-width': v === x ? 3 : 1.5 }));
        if (v % 2 === 0) svg.append(mk('text', { x: X(v), y: 92, 'text-anchor': 'middle', class: 'ig-s' }, String(v)));
      }
      svg.append(mk('text', { x: X(x), y: 32, 'text-anchor': 'middle', style: 'font:800 14px system-ui;fill:#102a43' }, 'x = ' + x));
      res.innerHTML = '';
      const ps = c.parts(x);
      ps.forEach(([t, v]) => { if (!t.includes('→')) { const d = el('div', 'stat'); d.append(el('span', '', t), el('b', '', v ? 'True' : 'False')); d.style.background = v ? '#e9f7f2' : '#fde4d4'; res.append(d); } else { const d = el('div', 'stat'); d.append(el('span', '', 'calcolo'), el('b', '', t)); res.append(d); } });
      const tot = el('div', 'stat'); tot.append(el('span', '', (c.op ? c.op + ' → ' : '') + 'condizione'), el('b', '', c.f(x) ? 'True' : 'False')); tot.style.background = c.f(x) ? '#2a9d8f' : '#c0562b'; tot.style.color = '#fff'; tot.querySelector('b').style.color = '#fff'; tot.querySelector('span').style.color = '#fff'; res.append(tot);
    }
    sel.onchange = xs.oninput = draw; draw();
  }

  /* ---------- 3. Tabella di verità ---------- */
  const tt = $('#truth');
  if (tt) {
    const A = $('#ttA'), B = $('#ttB'), tb = $('tbody', tt);
    const rows = [];
    [[true, true], [true, false], [false, true], [false, false]].forEach(([a, b]) => {
      const r = el('tr'); [a, b, a && b, a || b, !a].forEach(v => r.append(el('td', v ? 'tv' : 'fv', v ? 'True' : 'False'))); r.dataset.k = a + '-' + b; tb.append(r); rows.push(r);
    });
    function upd() {
      const a = A.getAttribute('aria-pressed') === 'true', b = B.getAttribute('aria-pressed') === 'true';
      A.textContent = 'A = ' + (a ? 'True' : 'False'); B.textContent = 'B = ' + (b ? 'True' : 'False');
      rows.forEach(r => r.classList.toggle('hit', r.dataset.k === a + '-' + b));
    }
    [A, B].forEach(btn => btn.onclick = () => { btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true')); upd(); });
    upd();
  }
})();
