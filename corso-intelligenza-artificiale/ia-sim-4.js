/* Corso Intelligenza artificiale · Lezione 4 · simulazioni:
   neurone artificiale e funzioni di attivazione, neurone AND/OR progettato a mano, percettrone che impara
   (e fallisce con XOR), rete multistrato per XOR, discesa del gradiente, mini playground con backpropagation. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const nf = (x, d = 2) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString('it-IT', { minimumFractionDigits: d, maximumFractionDigits: d });
  const SVGNS = 'http://www.w3.org/2000/svg';
  const sv = (tag, attrs, txt) => { const e = document.createElementNS(SVGNS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; return e; };
  const ACT = {
    gradino: { n: 'gradino (percettrone)', f: z => z >= 0 ? 1 : 0, lo: -0.2, hi: 1.2, tex: 'f(z) = 1 se z ≥ 0, altrimenti 0' },
    sigmoide: { n: 'sigmoide', f: z => 1 / (1 + Math.exp(-z)), lo: -0.2, hi: 1.2, tex: 'f(z) = 1 / (1 + e⁻ᶻ)' },
    tanh: { n: 'tangente iperbolica', f: z => Math.tanh(z), lo: -1.2, hi: 1.2, tex: 'f(z) = tanh(z)' },
    softplus: { n: 'softplus', f: z => Math.log(1 + Math.exp(z)), lo: -0.5, hi: 5, tex: 'f(z) = ln(1 + eᶻ)' },
    relu: { n: 'ReLU (rettificatore)', f: z => Math.max(0, z), lo: -0.5, hi: 5, tex: 'f(z) = max(0, z)' }
  };
  function plotAct(cv, key, z) {
    const ctx = cv.getContext('2d'), W = cv.width, H = cv.height, a = ACT[key], P = 30, zr = 5;
    const X = v => P + (W - P - 10) * (v + zr) / (2 * zr), Y = v => H - P - (H - P - 10) * (v - a.lo) / (a.hi - a.lo);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = '#dce4ec'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(X(0), 8); ctx.lineTo(X(0), H - P); ctx.moveTo(P, Y(0)); ctx.lineTo(W - 8, Y(0)); ctx.stroke();
    ctx.fillStyle = '#52657a'; ctx.font = '12px system-ui'; ctx.textAlign = 'center';
    for (let v = -4; v <= 4; v += 2) ctx.fillText(v, X(v), H - P + 16); ctx.fillText('z', W - 14, Y(0) - 6);
    ctx.textAlign = 'right'; [a.lo < 0 && a.lo > -1 ? 0 : a.lo, a.hi > 2 ? 4 : 1].forEach(v => ctx.fillText(nf(v, 0), P - 4, Y(v) + 4));
    ctx.strokeStyle = '#176b87'; ctx.lineWidth = 3; ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const v = -zr + 2 * zr * i / 300, y = Math.min(a.hi, a.f(v)); i ? ctx.lineTo(X(v), Y(y)) : ctx.moveTo(X(v), Y(y)); }
    ctx.stroke();
    if (z != null) { const zz = Math.max(-zr, Math.min(zr, z)), y = Math.min(a.hi, a.f(zz)); ctx.setLineDash([4, 4]); ctx.strokeStyle = '#d9a227'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(zz), Y(0)); ctx.lineTo(X(zz), Y(y)); ctx.lineTo(P, Y(y)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#f4b942'; ctx.strokeStyle = '#102a43'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(zz), Y(y), 7, 0, 7); ctx.fill(); ctx.stroke(); }
  }

  /* ---------- 1. Il neurone artificiale ---------- */
  const ne = $('#neuron');
  if (ne) {
    const svg = $('svg', ne), sel = $('#nAct'), cv = $('canvas', ne);
    Object.entries(ACT).forEach(([k, a]) => { const o = el('option', '', a.n); o.value = k; sel.append(o); }); sel.value = 'relu';
    const ids = ['x1', 'x2', 'x3', 'w1', 'w2', 'w3', 'b'], inp = Object.fromEntries(ids.map(k => [k, $('#n_' + k)]));
    function draw() {
      const v = Object.fromEntries(ids.map(k => [k, +inp[k].value]));
      ids.forEach(k => { $('#n_' + k + 'V').textContent = nf(v[k], 1); });
      const z = v.w1 * v.x1 + v.w2 * v.x2 + v.w3 * v.x3 + v.b, y = ACT[sel.value].f(z);
      svg.innerHTML = '';
      const defs = sv('defs'); defs.append(sv('marker', { id: 'arN', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto' })); defs.firstChild.append(sv('path', { d: 'M0 0L10 5L0 10z', fill: '#102a43' })); svg.append(defs);
      [70, 150, 230].forEach((yy, i) => {
        const x = v['x' + (i + 1)], w = v['w' + (i + 1)];
        svg.append(sv('line', { x1: 70, y1: yy, x2: 262, y2: 150, stroke: w >= 0 ? '#176b87' : '#d9822b', 'stroke-width': 1 + Math.abs(w) * 3, 'stroke-opacity': Math.abs(w) < 0.05 ? 0.15 : 0.9 }));
        svg.append(sv('circle', { cx: 45, cy: yy, r: 24, fill: '#e5f2f7', stroke: '#176b87', 'stroke-width': 2 }));
        svg.append(sv('text', { x: 45, y: yy + 5, 'text-anchor': 'middle', class: 'ig-t' }, nf(x, 1)));
        svg.append(sv('text', { x: 45, y: yy - 30, 'text-anchor': 'middle', class: 'ig-s' }, 'x' + (i + 1)));
        svg.append(sv('text', { x: 150, y: yy + (150 - yy) * 0.45 - 8, 'text-anchor': 'middle', class: 'ig-s', style: 'font-weight:700;fill:' + (w >= 0 ? '#176b87' : '#c0562b') }, 'w' + (i + 1) + ' = ' + nf(w, 1)));
      });
      svg.append(sv('circle', { cx: 300, cy: 150, r: 46, fill: '#102a43' }));
      svg.append(sv('text', { x: 300, y: 143, 'text-anchor': 'middle', style: 'font:700 22px system-ui;fill:#fff' }, 'Σ'));
      svg.append(sv('text', { x: 300, y: 168, 'text-anchor': 'middle', style: 'font:700 13px system-ui;fill:#f4b942' }, 'z = ' + nf(z)));
      svg.append(sv('text', { x: 300, y: 222, 'text-anchor': 'middle', class: 'ig-s' }, 'bias b = ' + nf(v.b, 1)));
      svg.append(sv('rect', { x: 372, y: 124, width: 92, height: 52, rx: 12, fill: '#fff9e9', stroke: '#d9a227', 'stroke-width': 2 }));
      svg.append(sv('text', { x: 418, y: 156, 'text-anchor': 'middle', class: 'ig-t' }, 'f(z)'));
      svg.append(sv('line', { x1: 346, y1: 150, x2: 368, y2: 150, stroke: '#102a43', 'stroke-width': 2, 'marker-end': 'url(#arN)' }));
      svg.append(sv('line', { x1: 464, y1: 150, x2: 500, y2: 150, stroke: '#102a43', 'stroke-width': 2, 'marker-end': 'url(#arN)' }));
      const t = Math.max(0, Math.min(1, y / (sel.value === 'relu' || sel.value === 'softplus' ? 4 : 1)));
      svg.append(sv('circle', { cx: 535, cy: 150, r: 30, fill: 'rgb(' + Math.round(244 - 30 * t) + ',' + Math.round(244 - 59 * t) + ',' + Math.round(244 - 178 * t) + ')', stroke: '#102a43', 'stroke-width': 2 }));
      svg.append(sv('text', { x: 535, y: 155, 'text-anchor': 'middle', class: 'ig-t' }, nf(y)));
      svg.append(sv('text', { x: 535, y: 200, 'text-anchor': 'middle', class: 'ig-s' }, 'output'));
      $('#nCalc').textContent = 'z = ' + nf(v.w1, 1) + '·' + nf(v.x1, 1) + ' + ' + nf(v.w2, 1) + '·' + nf(v.x2, 1) + ' + ' + nf(v.w3, 1) + '·' + nf(v.x3, 1) + ' + ' + nf(v.b, 1) + ' = ' + nf(z) + '\n' + ACT[sel.value].tex + '  →  output = ' + nf(y, 3);
      plotAct(cv, sel.value, z);
    }
    ids.forEach(k => inp[k].addEventListener('input', draw)); sel.addEventListener('change', draw); draw();
  }

  /* ---------- 2. Neurone progettato a mano: AND e OR ---------- */
  const gd = $('#gate');
  if (gd) {
    const w1 = $('#g_w1'), w2 = $('#g_w2'), b = $('#g_b'), tgt = $('#gTarget'), body = $('#gTable tbody'), st = $('#gStatus');
    const GOAL = { and: (a, c) => a & c, or: (a, c) => a | c, nand: (a, c) => 1 - (a & c) };
    const solved = new Set(JSON.parse((() => { try { return localStorage.getItem('iaSim-gate') || '[]'; } catch { return '[]'; } })()));
    function run() {
      $('#g_w1V').textContent = nf(+w1.value, 1); $('#g_w2V').textContent = nf(+w2.value, 1); $('#g_bV').textContent = nf(+b.value, 1);
      body.innerHTML = ''; let ok = 0;
      [[0, 0], [0, 1], [1, 0], [1, 1]].forEach(([x1, x2]) => {
        const z = +w1.value * x1 + +w2.value * x2 + +b.value, y = z >= 0 ? 1 : 0, want = GOAL[tgt.value](x1, x2), r = el('tr');
        [x1, x2, nf(z, 1), y, want].forEach(t => r.append(el('td', '', String(t))));
        r.append(el('td', '', y === want ? '✓' : '✗')); if (y === want) ok++; else r.className = 'hit';
        body.append(r);
      });
      if (ok === 4) {
        solved.add(tgt.value); try { localStorage.setItem('iaSim-gate', JSON.stringify([...solved])); } catch {}
        st.textContent = '✓ Il neurone realizza ' + tgt.value.toUpperCase() + '!';
      } else st.textContent = ok + ' casi su 4 corretti.';
      $('#gSolved').textContent = ['and', 'or', 'nand'].map(k => k.toUpperCase() + (solved.has(k) ? ' ✓' : ' ·')).join('   ');
      if (solved.has('and') && solved.has('or')) window.IaEx && IaEx.complete('l4-e3');
    }
    [w1, w2, b].forEach(x => x.addEventListener('input', run)); tgt.addEventListener('change', run); run();
  }

  /* ---------- 3. Il percettrone impara (AND, OR… e XOR) ---------- */
  const pc = $('#perc');
  if (pc) {
    const cv = $('canvas', pc), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, sel = $('#pFun'), log = $('#pLog');
    const F = { and: [0, 0, 0, 1], or: [0, 1, 1, 1], xor: [0, 1, 1, 0] }, X = [[0, 0], [0, 1], [1, 0], [1, 1]];
    let w, ep;
    const out = p => w[0] * p[0] + w[1] * p[1] + w[2] >= 0 ? 1 : 0;
    const map = v => 60 + v * (W - 120);
    function reset() { w = [0.2, -0.4, 0.1]; ep = 0; log.textContent = 'Pesi iniziali: w₁ = 0,2  w₂ = −0,4  b = 0,1'; draw(); }
    function epoch() {
      let errs = 0; ep++;
      X.forEach((p, i) => { const e = F[sel.value][i] - out(p); if (e) { errs++; w[0] += 0.2 * e * p[0]; w[1] += 0.2 * e * p[1]; w[2] += 0.2 * e; } });
      log.textContent = 'Epoca ' + ep + ': ' + errs + ' errori.  w₁ = ' + nf(w[0]) + '  w₂ = ' + nf(w[1]) + '  b = ' + nf(w[2]) + (errs ? '' : '\nNessun errore: il percettrone ha imparato ' + sel.value.toUpperCase() + '!') + (sel.value === 'xor' && ep >= 12 ? '\nDopo ' + ep + ' epoche ci sono ancora errori: nessuna retta separa gli 1 dagli 0 di XOR.' : '');
      draw(); return errs;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let gx = 0; gx < W; gx += 8) for (let gy = 0; gy < H; gy += 8) { const p = [(gx + 4 - 60) / (W - 120), (H - (gy + 4) - 60) / (H - 120)]; ctx.fillStyle = out(p) ? 'rgba(23,107,135,.12)' : 'rgba(217,130,43,.10)'; ctx.fillRect(gx, gy, 8, 8); }
      X.forEach((p, i) => { const y = F[sel.value][i], cx = map(p[0]); ctx.fillStyle = y ? '#176b87' : '#d9822b'; ctx.beginPath(); ctx.arc(cx, H - (60 + p[1] * (H - 120)), 16, 0, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '800 15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(y, cx, H - (60 + p[1] * (H - 120)) + 5); ctx.fillStyle = '#52657a'; ctx.font = '12px system-ui'; ctx.fillText('(' + p[0] + ',' + p[1] + ')', cx, H - (60 + p[1] * (H - 120)) + 34); });
      $('#pEp').textContent = ep;
    }
    $('#pStep').onclick = epoch;
    $('#pRun').onclick = () => { for (let k = 0; k < 30; k++) if (!epoch()) break; };
    $('#pReset').onclick = reset; sel.onchange = reset; reset();
  }

  /* ---------- 4. Rete multistrato che risolve XOR ---------- */
  const mx = $('#mlpxor');
  if (mx) {
    const svg = $('svg', mx); let x = [0, 1];
    const step = z => z >= 0 ? 1 : 0;
    function draw() {
      const h1 = step(x[0] + x[1] - 0.5), h2 = step(x[0] + x[1] - 1.5), y = step(h1 - h2 - 0.5);
      svg.innerHTML = '';
      const N = { x1: [60, 70], x2: [60, 210], h1: [260, 70], h2: [260, 210], y: [450, 140] }, val = { x1: x[0], x2: x[1], h1, h2, y };
      const E = [['x1', 'h1', 1], ['x2', 'h1', 1], ['x1', 'h2', 1], ['x2', 'h2', 1], ['h1', 'y', 1], ['h2', 'y', -1]];
      E.forEach(([a, b2, w]) => { const on = val[a] === 1; svg.append(sv('line', { x1: N[a][0], y1: N[a][1], x2: N[b2][0], y2: N[b2][1], stroke: on ? (w > 0 ? '#176b87' : '#d9822b') : '#dce4ec', 'stroke-width': on ? 4 : 2 })); const mxp = (N[a][0] + N[b2][0]) / 2, myp = (N[a][1] + N[b2][1]) / 2; svg.append(sv('text', { x: mxp + (a === 'x1' && b2 === 'h2' ? -18 : a === 'x2' && b2 === 'h1' ? -18 : 0), y: myp - 6, class: 'ig-s', 'text-anchor': 'middle', style: 'font-weight:700' }, 'w = ' + w)); });
      Object.entries(N).forEach(([k, [cx, cy]]) => {
        const on = val[k] === 1, isIn = k[0] === 'x';
        const g = sv('g', isIn ? { class: 'ig-node', tabindex: 0, role: 'button', 'aria-label': 'Cambia ' + k } : {});
        g.append(sv('circle', { cx, cy, r: 30, fill: on ? '#f4b942' : '#fff', stroke: '#102a43', 'stroke-width': 2.5 }));
        g.append(sv('text', { x: cx, y: cy + 6, 'text-anchor': 'middle', style: 'font:800 18px system-ui;fill:#102a43' }, String(val[k])));
        g.append(sv('text', { x: cx, y: cy - 38, 'text-anchor': 'middle', class: 'ig-s', style: 'font-weight:700' }, { x1: 'x₁ (clic)', x2: 'x₂ (clic)', h1: 'h₁ · b = −0,5', h2: 'h₂ · b = −1,5', y: 'uscita · b = −0,5' }[k]));
        if (isIn) { const t = () => { x[k === 'x1' ? 0 : 1] ^= 1; draw(); }; g.addEventListener('click', t); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } }); }
        svg.append(g);
      });
      svg.append(sv('text', { x: 60, y: 275, 'text-anchor': 'middle', class: 'ig-k' }, 'INPUT'));
      svg.append(sv('text', { x: 260, y: 275, 'text-anchor': 'middle', class: 'ig-k' }, 'STRATO NASCOSTO'));
      svg.append(sv('text', { x: 450, y: 275, 'text-anchor': 'middle', class: 'ig-k' }, 'OUTPUT'));
      $('#xorRes').textContent = 'x₁ = ' + x[0] + ', x₂ = ' + x[1] + '  →  h₁ (OR) = ' + h1 + ', h₂ (AND) = ' + h2 + '  →  uscita = ' + y + '   (XOR atteso: ' + (x[0] ^ x[1]) + ')';
    }
    draw();
  }

  /* ---------- 5. Discesa del gradiente ---------- */
  const gdn = $('#descent');
  if (gdn) {
    const cv = $('canvas', gdn), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, lr = $('#dLr'), fsel = $('#dFun'), log = $('#dLog');
    const FUN = { valle: { f: w => (w - 1) ** 2 + 0.5, lo: -4, hi: 5, ymax: 17 }, buche: { f: w => 0.08 * w ** 4 - 0.9 * w ** 2 + 0.6 * w + 4, lo: -4, hi: 4, ymax: 9 } };
    let w, hist, timer;
    const F = () => FUN[fsel.value], d = w0 => (F().f(w0 + 1e-4) - F().f(w0 - 1e-4)) / 2e-4;
    const X = v => 40 + (W - 60) * (v - F().lo) / (F().hi - F().lo), Y = v => H - 30 - (H - 50) * Math.min(v, F().ymax) / F().ymax;
    function reset(w0) { clearInterval(timer); w = w0 != null ? w0 : F().lo + 0.3; hist = [w]; log.textContent = 'Fai clic sulla curva per scegliere il peso iniziale, poi avvia.'; draw(); }
    function step() {
      const g = d(w); w -= +lr.value * g; hist.push(w);
      const out = w < F().lo - 2 || w > F().hi + 2 || !Number.isFinite(w);
      log.textContent = 'Passo ' + (hist.length - 1) + ': pendenza = ' + nf(g) + '  →  w = w − ' + nf(+lr.value) + ' · pendenza = ' + nf(w) + '   errore E = ' + (Number.isFinite(F().f(w)) ? nf(F().f(w)) : '∞') + (out ? '\nLa pallina è schizzata via: il learning rate è troppo grande.' : '');
      draw(); return !out && Math.abs(g) > 1e-3;
    }
    function draw() {
      $('#dLrV').textContent = nf(+lr.value);
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = '#52657a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(40, 10); ctx.lineTo(40, H - 30); ctx.lineTo(W - 10, H - 30); ctx.stroke();
      ctx.fillStyle = '#52657a'; ctx.font = '13px system-ui'; ctx.textAlign = 'center'; ctx.fillText('peso w', W - 40, H - 10); ctx.fillText('errore E(w)', 70, 18);
      ctx.strokeStyle = '#176b87'; ctx.lineWidth = 3; ctx.beginPath();
      for (let i = 0; i <= 300; i++) { const v = F().lo + (F().hi - F().lo) * i / 300; i ? ctx.lineTo(X(v), Y(F().f(v))) : ctx.moveTo(X(v), Y(F().f(v))); } ctx.stroke();
      ctx.strokeStyle = 'rgba(217,130,43,.7)'; ctx.lineWidth = 1.5; ctx.beginPath();
      hist.forEach((v, i) => { const vv = Math.max(F().lo, Math.min(F().hi, v)); i ? ctx.lineTo(X(vv), Y(F().f(vv))) : ctx.moveTo(X(vv), Y(F().f(vv))); }); ctx.stroke();
      hist.slice(0, -1).forEach(v => { if (v < F().lo || v > F().hi) return; ctx.fillStyle = 'rgba(217,130,43,.5)'; ctx.beginPath(); ctx.arc(X(v), Y(F().f(v)), 4, 0, 7); ctx.fill(); });
      const v = Math.max(F().lo, Math.min(F().hi, w)); ctx.fillStyle = '#f4b942'; ctx.strokeStyle = '#102a43'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(v), Y(F().f(v)) - 9, 9, 0, 7); ctx.fill(); ctx.stroke();
      $('#dSteps').textContent = hist.length - 1; $('#dErr').textContent = Number.isFinite(F().f(w)) && Math.abs(w) < 50 ? nf(F().f(w)) : '∞';
    }
    cv.addEventListener('click', e => { const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * W / r.width; reset(F().lo + (px - 40) / (W - 60) * (F().hi - F().lo)); });
    $('#dStep').onclick = () => { clearInterval(timer); step(); };
    $('#dRun').onclick = () => { clearInterval(timer); let n = 0; timer = setInterval(() => { if (!step() || ++n > 60) clearInterval(timer); }, 160); };
    $('#dReset').onclick = () => reset(); fsel.onchange = () => reset(); lr.oninput = draw;
    reset();
  }

  /* ---------- 6. Mini playground: rete neurale addestrata con backpropagation ---------- */
  const pg = $('#playground');
  if (pg) {
    const cv = $('#pgCanvas'), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, lc = $('#pgLoss'), lctx = lc.getContext('2d');
    const ui = { data: $('#pgData'), h: $('#pgH'), layers: $('#pgL'), act: $('#pgAct'), lr: $('#pgLr'), go: $('#pgGo'), reset: $('#pgReset') };
    let s = 3; const r = () => (s = (s * 16807) % 2147483647) / 2147483647, g = () => { let t = 0; for (let i = 0; i < 6; i++) t += r(); return (t - 3) * 1.41; };
    const DATA = {
      cerchio: () => [...Array(240)].map(() => { const a = r() * 6.283, inside = r() < 0.5, rad = inside ? r() * 0.45 : 0.62 + r() * 0.33; return { x: rad * Math.cos(a), y: rad * Math.sin(a), c: inside ? 1 : 0 }; }),
      xor: () => [...Array(240)].map(() => { const x = r() * 2 - 1, y = r() * 2 - 1, xx = x + (x > 0 ? 0.06 : -0.06), yy = y + (y > 0 ? 0.06 : -0.06); return { x: Math.max(-1, Math.min(1, xx)), y: Math.max(-1, Math.min(1, yy)), c: x * y > 0 ? 1 : 0 }; }),
      nuvole: () => [...Array(240)].map((_, i) => { const c = i % 2; return { x: (c ? 0.45 : -0.45) + g() * 0.22, y: (c ? 0.4 : -0.4) + g() * 0.22, c }; }),
      spirale: () => [...Array(240)].map((_, i) => { const c = i % 2, t = (i >> 1) / 120 * 3.6 + 0.3, a = t * 1.75 + c * Math.PI; return { x: t / 4.2 * Math.cos(a) + g() * 0.025, y: t / 4.2 * Math.sin(a) + g() * 0.025, c }; })
    };
    const AF = {
      tanh: [z => Math.tanh(z), (z, a) => 1 - a * a],
      relu: [z => z > 0 ? z : 0, z => z > 0 ? 1 : 0],
      sigmoide: [z => 1 / (1 + Math.exp(-z)), (z, a) => a * (1 - a)]
    };
    const sig = z => 1 / (1 + Math.exp(-z));
    let pts, net, epoch, losses, running = false;
    function build() {
      s = 3; pts = DATA[ui.data.value]();
      const H1 = +ui.h.value, sizes = [2, ...Array(+ui.layers.value).fill(H1), 1];
      let w = 99; const wr = () => (w = (w * 16807) % 2147483647) / 2147483647;
      net = sizes.slice(1).map((n, l) => ({ W: [...Array(n)].map(() => [...Array(sizes[l])].map(() => (wr() * 2 - 1) * Math.sqrt(3 / sizes[l]))), b: Array(n).fill(0.1 * (ui.act.value === 'relu' ? 1 : 0)) }));
      epoch = 0; losses = []; $('#pgHV').textContent = H1; $('#pgLrV').textContent = nf(+ui.lr.value, 2); render();
    }
    function forward(x) {
      const acts = [x], zs = []; let a = x; const f = AF[ui.act.value][0];
      net.forEach((L, li) => { const z = L.W.map((row, j) => row.reduce((s2, wij, i) => s2 + wij * a[i], L.b[j])); zs.push(z); a = li === net.length - 1 ? z.map(sig) : z.map(f); acts.push(a); });
      return { acts, zs };
    }
    function trainEpoch() {
      const grads = net.map(L => ({ W: L.W.map(r2 => r2.map(() => 0)), b: L.b.map(() => 0) })), df = AF[ui.act.value][1];
      let loss = 0;
      pts.forEach(p => {
        const { acts, zs } = forward([p.x, p.y]), yh = acts[acts.length - 1][0];
        loss += -(p.c * Math.log(yh + 1e-9) + (1 - p.c) * Math.log(1 - yh + 1e-9));
        let delta = [yh - p.c];                                      // entropia incrociata + sigmoide: δ = ŷ − y
        for (let l = net.length - 1; l >= 0; l--) {
          const aPrev = acts[l];
          delta.forEach((dj, j) => { grads[l].b[j] += dj; aPrev.forEach((ai, i) => { grads[l].W[j][i] += dj * ai; }); });
          if (l > 0) delta = aPrev.map((ai, i) => net[l].W.reduce((s2, row, j) => s2 + row[i] * delta[j], 0) * df(zs[l - 1][i], ai));
        }
      });
      const n = pts.length, lr = +ui.lr.value;
      net.forEach((L, l) => { L.W.forEach((row, j) => row.forEach((_, i) => { row[i] -= lr * grads[l].W[j][i] / n; })); L.b.forEach((_, j) => { L.b[j] -= lr * grads[l].b[j] / n; }); });
      epoch++; return loss / n;
    }
    const accuracy = () => pts.filter(p => (forward([p.x, p.y]).acts.at(-1)[0] >= 0.5 ? 1 : 0) === p.c).length / pts.length;
    function render() {
      const R = 6; ctx.clearRect(0, 0, W, H);
      for (let x = 0; x < W; x += R) for (let y = 0; y < H; y += R) {
        const o = forward([(x + R / 2) / W * 2 - 1, 1 - (y + R / 2) / H * 2]).acts.at(-1)[0];
        ctx.fillStyle = o >= 0.5 ? 'rgba(23,107,135,' + (0.08 + (o - 0.5) * 0.7) + ')' : 'rgba(217,130,43,' + (0.08 + (0.5 - o) * 0.7) + ')'; ctx.fillRect(x, y, R, R);
      }
      pts.forEach(p => { ctx.fillStyle = p.c ? '#176b87' : '#d9822b'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc((p.x + 1) / 2 * W, (1 - p.y) / 2 * H, 4.2, 0, 7); ctx.fill(); ctx.stroke(); });
      const acc = accuracy();
      $('#pgEp').textContent = epoch; $('#pgLossV').textContent = losses.length ? nf(losses.at(-1), 3) : '—'; $('#pgAcc').textContent = Math.round(acc * 100) + '%';
      const nW = net.reduce((a, L) => a + L.W.length * L.W[0].length + L.b.length, 0); $('#pgParams').textContent = nW;
      lctx.clearRect(0, 0, lc.width, lc.height);
      if (losses.length > 1) { const m = Math.max(...losses); lctx.strokeStyle = '#d9822b'; lctx.lineWidth = 2; lctx.beginPath(); losses.forEach((v, i) => { const x = i / (losses.length - 1) * (lc.width - 4) + 2, y = lc.height - 4 - (lc.height - 8) * v / m; i ? lctx.lineTo(x, y) : lctx.moveTo(x, y); }); lctx.stroke(); }
      if (ui.data.value === 'cerchio' && acc >= 0.95 && epoch > 0) window.IaEx && IaEx.complete('l4-e4');
    }
    function loop() {
      if (!running) return;
      for (let k = 0; k < 8; k++) losses.push(trainEpoch());
      if (losses.length > 600) losses = losses.filter((_, i) => i % 2 === 0);
      render(); if (epoch >= 4000) { stop(); $('#pgMsg').textContent = 'Raggiunte 4000 epoche: premi Ricomincia per ripartire.'; return; }
      requestAnimationFrame(loop);
    }
    const stop = () => { running = false; ui.go.textContent = '▶ Addestra'; };
    ui.go.onclick = () => { if (running) return stop(); running = true; ui.go.textContent = '⏸ Pausa'; $('#pgMsg').textContent = ''; requestAnimationFrame(loop); };
    ui.reset.onclick = () => { stop(); build(); };
    [ui.data, ui.h, ui.layers, ui.act].forEach(x => x.addEventListener('change', () => { stop(); build(); }));
    ui.h.addEventListener('input', () => { stop(); build(); });
    ui.lr.addEventListener('input', () => { $('#pgLrV').textContent = nf(+ui.lr.value, 2); });
    build();
  }
})();
