/* Corso Intelligenza artificiale · Lezione 3 · simulazioni:
   classificatore lineare addestrato (gatti e cani), KNN, filtro antispam naive Bayes,
   albero di decisione, clustering k-means. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const pct = x => Math.round(x * 100) + '%';
  const C = { a: '#d9822b', b: '#176b87', grid: '#dce4ec', text: '#52657a', gold: '#f4b942', navy: '#102a43' };
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += rnd(); return (s - 3) * 1.41; };
  const pointer = (cv, e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
  function shape(ctx, cls, x, y, r, stroke) {
    ctx.fillStyle = cls ? C.b : C.a; ctx.beginPath();
    if (cls) ctx.rect(x - r, y - r, 2 * r, 2 * r); else { ctx.moveTo(x, y - r * 1.2); ctx.lineTo(x + r * 1.1, y + r * .9); ctx.lineTo(x - r * 1.1, y + r * .9); ctx.closePath(); }
    ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2.5; ctx.stroke(); }
  }

  /* ---------- 1. Classificatore lineare addestrato: gatti (0) e cani (1) ---------- */
  const tr = $('#train');
  if (tr) {
    const cv = $('canvas', tr), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, P = 46;
    // caratteristiche: peso (kg, 0-40) e altezza al garrese (cm, 10-80)
    const mk = (n, cls) => [...Array(n)].map(() => cls
      ? { x: Math.min(38, Math.max(4, 16 + gauss() * 8)), y: Math.min(78, Math.max(22, 48 + gauss() * 12)), c: 1 }
      : { x: Math.min(9, Math.max(2.2, 4.5 + gauss() * 1.2)), y: Math.min(32, Math.max(18, 25 + gauss() * 2.5)), c: 0 });
    let train, test, w, i, ep, newPts;
    const sx = v => P + (W - P - 12) * v / 40, sy = v => H - P - (H - P - 12) * (v - 10) / 70;
    const ix = px => (px - P) / (W - P - 12) * 40, iy = py => 10 + (H - P - py) / (H - P - 12) * 70;
    const norm = p => [p.x / 40, (p.y - 10) / 70, 1];
    const predict = p => { const f = norm(p); return w[0] * f[0] + w[1] * f[1] + w[2] * f[2] >= 0 ? 1 : 0; };
    const acc = set => set.filter(p => predict(p) === p.c).length / set.length;
    function reset() { seed = 11; train = [...mk(18, 0), ...mk(18, 1)].sort(() => rnd() - .5); test = [...mk(10, 0), ...mk(10, 1)]; w = [-0.6, 0.3, 0.15]; i = 0; ep = 0; newPts = []; $('#trLog').textContent = 'Pesi iniziali scelti a caso: la retta divide male gatti e cani.'; draw(); }
    function step() {
      const p = train[i], f = norm(p), y = predict(p), err = p.c - y;
      if (err) for (let k = 0; k < 3; k++) w[k] += 0.5 * err * f[k];
      $('#trLog').textContent = 'Esempio ' + (i + 1) + ': ' + (p.c ? 'cane' : 'gatto') + ' di ' + p.x.toFixed(1) + ' kg e ' + p.y.toFixed(0) + ' cm → previsto ' + (y ? 'cane' : 'gatto') + (err ? '. Sbagliato: i parametri si correggono e la retta si sposta.' : '. Giusto: i parametri restano uguali.');
      i = (i + 1) % train.length; if (!i) ep++;
      draw(p);
    }
    function draw(hl) {
      const showTest = $('#trTest').checked;
      ctx.clearRect(0, 0, W, H);
      // regioni
      for (let gx = P; gx < W - 12; gx += 8) for (let gy = 12; gy < H - P; gy += 8) { ctx.fillStyle = predict({ x: ix(gx + 4), y: iy(gy + 4) }) ? 'rgba(23,107,135,.10)' : 'rgba(217,130,43,.10)'; ctx.fillRect(gx, gy, 8, 8); }
      ctx.strokeStyle = C.text; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P, 10); ctx.lineTo(P, H - P); ctx.lineTo(W - 10, H - P); ctx.stroke();
      ctx.fillStyle = C.text; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
      for (let v = 0; v <= 40; v += 10) ctx.fillText(v, sx(v), H - P + 18); ctx.fillText('peso (kg)', (W + P) / 2, H - 8);
      ctx.textAlign = 'right'; for (let v = 10; v <= 80; v += 10) ctx.fillText(v, P - 6, sy(v) + 4);
      ctx.save(); ctx.translate(14, (H - P) / 2); ctx.rotate(-Math.PI / 2); ctx.textAlign = 'center'; ctx.fillText('altezza (cm)', 0, 0); ctx.restore();
      // retta di separazione w0*x' + w1*y' + w2 = 0
      if (Math.abs(w[1]) > 1e-6) { ctx.strokeStyle = C.navy; ctx.lineWidth = 3; ctx.beginPath(); for (const xv of [0, 40]) { const yn = -(w[0] * xv / 40 + w[2]) / w[1], yv = 10 + yn * 70; xv ? ctx.lineTo(sx(xv), sy(yv)) : ctx.moveTo(sx(xv), sy(yv)); } ctx.save(); ctx.beginPath(); ctx.rect(P, 10, W - P - 12, H - P - 10); ctx.clip(); ctx.beginPath(); for (const xv of [0, 40]) { const yn = -(w[0] * xv / 40 + w[2]) / w[1], yv = 10 + yn * 70; xv ? ctx.lineTo(sx(xv), sy(yv)) : ctx.moveTo(sx(xv), sy(yv)); } ctx.stroke(); ctx.restore(); }
      train.forEach(p => shape(ctx, p.c, sx(p.x), sy(p.y), 5, p === hl ? C.gold : null));
      if (showTest) test.forEach(p => { ctx.globalAlpha = 1; ctx.strokeStyle = predict(p) === p.c ? '#1f8a70' : '#c0562b'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(sx(p.x), sy(p.y), 8, 0, 7); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fill(); ctx.fillStyle = p.c ? C.b : C.a; ctx.font = '700 11px system-ui'; ctx.textAlign = 'center'; ctx.fillText('?', sx(p.x), sy(p.y) + 4); });
      newPts.forEach(p => { const c = predict(p); ctx.fillStyle = C.navy; ctx.font = '700 12px system-ui'; ctx.textAlign = 'left'; shape(ctx, c, sx(p.x), sy(p.y), 7, C.navy); ctx.fillText('f(X) = ' + (c ? 'cane' : 'gatto'), sx(p.x) + 10, sy(p.y) - 8); });
      $('#trEp').textContent = ep; $('#trAcc').textContent = pct(acc(train)); $('#trTestAcc').textContent = showTest ? pct(acc(test)) : '—';
      $('#trW').textContent = 'w = (' + w.map(v => v.toFixed(2).replace('.', ',')).join('; ') + ')';
    }
    $('#trStep').onclick = () => step();
    $('#trEpoch').onclick = () => { for (let k = 0; k < train.length; k++) step(); };
    $('#trReset').onclick = reset; $('#trTest').onchange = () => draw();
    cv.addEventListener('click', e => { const p = pointer(cv, e), x = ix(p.x), y = iy(p.y); if (x < 0 || x > 40 || y < 10 || y > 80) return; newPts.push({ x, y }); if (newPts.length > 5) newPts.shift(); $('#trLog').textContent = 'Nuovo animale di ' + x.toFixed(1) + ' kg e ' + y.toFixed(0) + ' cm: il modello prevede «' + (predict({ x, y }) ? 'cane' : 'gatto') + '».'; draw(); });
    reset();
  }

  /* ---------- 2. KNN ---------- */
  const kn = $('#knn');
  if (kn) {
    const cv = $('canvas', kn), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, kS = $('#knnK'), reg = $('#knnReg');
    seed = 5;
    const pts = [];
    [[170, 130, 0], [420, 250, 1], [250, 300, 0], [470, 110, 1]].forEach(([cx, cy, c]) => { for (let j = 0; j < 14; j++) pts.push({ x: cx + gauss() * 55, y: cy + gauss() * 50, c }); });
    let q = { x: 330, y: 200 };
    const near = (p, k) => pts.map(o => ({ o, d: Math.hypot(o.x - p.x, o.y - p.y) })).sort((a, b) => a.d - b.d).slice(0, k);
    const vote = nb => { const n1 = nb.filter(v => v.o.c).length; return { n1, n0: nb.length - n1, c: n1 > nb.length - n1 ? 1 : 0 }; };
    function draw() {
      const k = +kS.value; $('#knnKV').textContent = k;
      ctx.clearRect(0, 0, W, H);
      if (reg.checked) for (let x = 0; x < W; x += 10) for (let y = 0; y < H; y += 10) { ctx.fillStyle = vote(near({ x: x + 5, y: y + 5 }, k)).c ? 'rgba(23,107,135,.13)' : 'rgba(217,130,43,.13)'; ctx.fillRect(x, y, 10, 10); }
      const nb = near(q, k), r = nb[nb.length - 1].d, v = vote(nb);
      ctx.setLineDash([6, 5]); ctx.strokeStyle = C.navy; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(q.x, q.y, r + 6, 0, 7); ctx.stroke(); ctx.setLineDash([]);
      nb.forEach(({ o }) => { ctx.strokeStyle = o.c ? C.b : C.a; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(q.x, q.y); ctx.lineTo(o.x, o.y); ctx.stroke(); });
      pts.forEach(o => shape(ctx, o.c, o.x, o.y, 6, nb.some(n => n.o === o) ? C.navy : null));
      ctx.fillStyle = C.gold; ctx.strokeStyle = C.navy; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(q.x, q.y, 9, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.navy; ctx.font = '800 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText('?', q.x, q.y + 4);
      $('#knnVote').textContent = v.n0 + ' ▲ contro ' + v.n1 + ' ■';
      $('#knnRes').textContent = v.c ? '■ quadrato' : '▲ triangolo';
      $('#knnRes').style.color = v.c ? C.b : C.a;
    }
    let drag = false;
    const move = e => { q = pointer(cv, e); draw(); };
    cv.addEventListener('pointerdown', e => { drag = true; cv.setPointerCapture(e.pointerId); move(e); });
    cv.addEventListener('pointermove', e => { if (drag) move(e); });
    cv.addEventListener('pointerup', () => { drag = false; });
    kS.oninput = draw; reg.onchange = draw; draw();
  }

  /* ---------- 3. Naive Bayes antispam ---------- */
  const TRAIN = [
    ['spam', 'hai vinto un premio gratis clicca subito'], ['spam', 'offerta gratis solo oggi clicca qui'], ['spam', 'guadagna soldi subito da casa'],
    ['spam', 'premio in denaro per te clicca il link'], ['spam', 'soldi facili offerta imperdibile gratis'],
    ['normale', 'domani verifica di informatica in aula'], ['normale', 'ciao ci vediamo oggi a scuola'], ['normale', 'ti mando gli appunti di storia'],
    ['normale', 'la riunione di classe è domani'], ['normale', 'hai finito i compiti di matematica'], ['normale', 'oggi pranzo dalla nonna ci vieni']
  ];
  const by = $('#bayes');
  if (by) {
    const tok = s => s.toLowerCase().normalize('NFC').match(/[a-zàèéìòù]+/g) || [];
    const cnt = { spam: {}, normale: {} }, tot = { spam: 0, normale: 0 }, docs = { spam: 0, normale: 0 }, vocab = new Set();
    TRAIN.forEach(([c, t]) => { docs[c]++; tok(t).forEach(w => { cnt[c][w] = (cnt[c][w] || 0) + 1; tot[c]++; vocab.add(w); }); });
    const tb = $('#bayesTrain tbody');
    TRAIN.forEach(([c, t]) => { const r = el('tr'); r.append(el('td', '', c === 'spam' ? '🚫 spam' : '✉️ normale'), el('td', '', t)); tb.append(r); });
    const inp = $('#bayesIn'), chips = $('.word-chips', by), bar = $('.prob-bar i', by), lbl = $('.prob-bar b', by), out = $('.sim-out', by);
    const V = vocab.size;
    const pw = (w, c) => ((cnt[c][w] || 0) + 1) / (tot[c] + V);   // stima con correzione di Laplace (+1)
    function run() {
      const words = tok(inp.value);
      let ls = Math.log(docs.spam / TRAIN.length), ln = Math.log(docs.normale / TRAIN.length);
      chips.innerHTML = ''; const lines = ['P(spam) = ' + docs.spam + '/' + TRAIN.length + '   P(normale) = ' + docs.normale + '/' + TRAIN.length];
      words.forEach(w => {
        const known = vocab.has(w), a = pw(w, 'spam'), b = pw(w, 'normale');
        if (known) { ls += Math.log(a); ln += Math.log(b); }
        chips.append(el('span', !known ? 'nu' : a > b ? 'sp' : 'hm', w));
        if (known) lines.push(w.padEnd(12) + ' P(w|spam)=' + a.toFixed(3) + '  P(w|normale)=' + b.toFixed(3) + '  → ' + (a > b ? 'indizio di spam ×' + (a / b).toFixed(1) : 'indizio normale ×' + (b / a).toFixed(1)));
        else lines.push(w.padEnd(12) + ' parola mai vista nel training: ignorata');
      });
      const m = Math.max(ls, ln), ps = Math.exp(ls - m) / (Math.exp(ls - m) + Math.exp(ln - m));
      bar.style.width = (ps * 100).toFixed(1) + '%'; lbl.textContent = 'P(spam | messaggio) = ' + (ps * 100).toFixed(1).replace('.', ',') + '%  →  ' + (ps > 0.5 ? 'SPAM' : 'NORMALE');
      out.textContent = lines.join('\n');
    }
    inp.addEventListener('input', run);
    by.querySelectorAll('[data-msg]').forEach(b => b.onclick = () => { inp.value = b.dataset.msg; run(); });
    run();
  }

  /* ---------- 4. Albero di decisione ---------- */
  const dt = $('#dtree');
  if (dt) {
    const ask = $('.dt-ask', dt), q = $('.dt-q', dt), yes = $('#dtYes'), no = $('#dtNo'), restart = $('#dtRestart');
    const T = { root: { q: 'È inverno?', y: 'nuv', n: 'l1' }, nuv: { q: 'Il cielo è nuvoloso?', y: 'temp', n: 'l2' }, temp: { q: 'La temperatura è sotto 0 °C?', y: 'l4', n: 'l3' }, l1: { leaf: 'non nevica' }, l2: { leaf: 'non nevica' }, l3: { leaf: 'non nevica' }, l4: { leaf: 'nevica ❄' } };
    let cur, path;
    function paint() {
      dt.querySelectorAll('.tree-node').forEach(n => n.classList.toggle('on', path.includes(n.dataset.id)));
      dt.querySelectorAll('.tree-edge').forEach(e => e.classList.toggle('on', path.includes(e.dataset.from) && path.includes(e.dataset.to)));
      const node = T[cur];
      if (node.leaf) { q.textContent = 'Previsione: ' + node.leaf + ' (foglia raggiunta in ' + (path.length - 1) + ' domande)'; yes.hidden = no.hidden = true; }
      else { q.textContent = node.q; yes.hidden = no.hidden = false; }
    }
    const go = a => { const nx = T[cur][a]; path.push(nx); cur = nx; paint(); };
    yes.onclick = () => go('y'); no.onclick = () => go('n');
    restart.onclick = () => { cur = 'root'; path = ['root']; paint(); };
    restart.onclick();
  }

  /* ---------- 5. K-means ---------- */
  const km = $('#kmeans');
  if (km) {
    const cv = $('canvas', km), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, kS = $('#kmK'), info = $('#kmInfo');
    const COL = ['#d9822b', '#176b87', '#2a9d8f', '#8e5bc7', '#c0562b'];
    seed = 23; const pts = [];
    [[150, 120], [430, 110], [300, 280], [520, 300]].forEach(([cx, cy]) => { for (let j = 0; j < 22; j++) pts.push({ x: cx + gauss() * 38, y: cy + gauss() * 34, c: -1 }); });
    let cen = [], phase = 0, it = 0, timer = null;
    function init() { const k = +kS.value; $('#kmKV').textContent = k; cen = [...Array(k)].map(() => ({ x: 60 + Math.random() * (W - 120), y: 50 + Math.random() * (H - 100) })); pts.forEach(p => p.c = -1); phase = 0; it = 0; info.textContent = 'Centri messi a caso. I punti non hanno etichetta: sono tutti grigi.'; draw(); }
    function assign() { let ch = 0; pts.forEach(p => { let b = 0, bd = Infinity; cen.forEach((c, j) => { const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2; if (d < bd) { bd = d; b = j; } }); if (p.c !== b) ch++; p.c = b; }); return ch; }
    function update() { cen.forEach((c, j) => { const m = pts.filter(p => p.c === j); if (m.length) { c.x = m.reduce((a, p) => a + p.x, 0) / m.length; c.y = m.reduce((a, p) => a + p.y, 0) / m.length; } }); }
    function step() {
      if (phase === 0) { const ch = assign(); it++; info.textContent = 'Passo ' + it + ' · assegnazione: ogni punto va al centro più vicino (' + ch + ' punti hanno cambiato gruppo).'; phase = 1; draw(); return ch; }
      update(); info.textContent = 'Passo ' + it + ' · aggiornamento: ogni centro si sposta nella media dei suoi punti.'; phase = 0; draw(); return 1;
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      pts.forEach(p => { ctx.fillStyle = p.c < 0 ? '#a9bfce' : COL[p.c]; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); });
      cen.forEach((c, j) => { ctx.fillStyle = COL[j]; ctx.strokeStyle = C.navy; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c.x - 11, c.y - 11); ctx.lineTo(c.x + 11, c.y + 11); ctx.moveTo(c.x + 11, c.y - 11); ctx.lineTo(c.x - 11, c.y + 11); ctx.stroke(); ctx.beginPath(); ctx.arc(c.x, c.y, 6, 0, 7); ctx.fill(); });
    }
    $('#kmStep').onclick = () => { clearInterval(timer); step(); };
    $('#kmAuto').onclick = () => { clearInterval(timer); let still = 0; timer = setInterval(() => { const ch = step(); if (phase === 1 && ch === 0) still++; if (still) { clearInterval(timer); info.textContent = 'Convergenza dopo ' + it + ' passi: nessun punto cambia più gruppo. Il k-means ha trovato ' + cen.length + ' gruppi senza alcuna etichetta.'; } }, 450); };
    $('#kmInit').onclick = () => { clearInterval(timer); init(); };
    kS.oninput = () => { clearInterval(timer); init(); };
    init();
  }
})();
