/* Corso Intelligenza artificiale · Lezione 2 · simulazioni:
   scala dei byte, le 5 V, flusso di dati (velocità), autocompletamento da log di ricerca,
   correlazione e variabile nascosta. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const fmt = (x, d = 0) => x.toLocaleString('it-IT', { maximumFractionDigits: d });
  const big = x => {
    if (x < 1e6) return fmt(x, x < 10 ? 1 : 0);
    const u = [[1e18, 'miliardi di miliardi'], [1e15, 'milioni di miliardi'], [1e12, 'mila miliardi'], [1e9, 'miliardi'], [1e6, 'milioni']];
    for (const [v, n] of u) if (x >= v) return fmt(x / v, 1) + ' ' + n;
  };

  /* ---------- 1. Scala dei byte ---------- */
  const UNITS = [['kB', 'kilobyte', 3], ['MB', 'megabyte', 6], ['GB', 'gigabyte', 9], ['TB', 'terabyte', 12], ['PB', 'petabyte', 15], ['EB', 'exabyte', 18], ['ZB', 'zettabyte', 21]];
  const ITEMS = [['📄', 'pagine di solo testo', 2e3], ['📷', 'foto da smartphone', 3e6], ['🎵', 'canzoni MP3', 4e6], ['🎬', 'ore di video in alta definizione', 3e9], ['💽', 'DVD da 4,7 GB', 4.7e9], ['💾', 'dischi da 1 TB', 1e12]];
  const bs = $('#bytes');
  if (bs) {
    const qty = $('#bQty'), unit = $('#bUnit'), scale = $('.byte-scale', bs), out = $('.bytes-out', bs), sci = $('#bSci');
    UNITS.forEach(([s, n], i) => { const o = el('option', '', s + ' · ' + n); o.value = i; unit.append(o); scale.append(el('span', '', s)); });
    unit.value = 2;
    function upd() {
      const q = Math.max(0, Number(String(qty.value).replace(',', '.')) || 0), u = UNITS[unit.value], bytes = q * 10 ** u[2];
      scale.querySelectorAll('span').forEach((s, i) => s.classList.toggle('on', i <= +unit.value));
      sci.textContent = fmt(q, 3) + ' ' + u[0] + ' = ' + fmt(q, 3) + ' × 10' + String(u[2]).replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]) + ' byte';
      out.innerHTML = '';
      ITEMS.forEach(([ic, n, size]) => {
        const k = bytes / size; const d = el('div', 'stat');
        d.append(el('span', '', ic + ' ' + n), el('b', '', k < 0.01 ? '< 0,01' : big(k)));
        out.append(d);
      });
    }
    qty.addEventListener('input', upd); unit.addEventListener('change', upd); upd();
  }

  /* ---------- 2. Le 5 V ---------- */
  const V = {
    volume: ['Volume', 'La quantità enorme di dati, che si misura in terabyte, petabyte, exabyte. Non sta in un solo computer: va distribuita su migliaia di server.', 'Tutte le foto caricate ogni giorno su un social network.'],
    varieta: ['Varietà', 'Dati di formati diversi: tabelle ordinate (dati strutturati) ma soprattutto testi, immagini, audio, video, posizioni GPS (dati non strutturati), che un DBMS relazionale non sa trattare bene.', 'Un’app di consegne che combina ordini, recensioni scritte, foto dei piatti e posizione dei rider.'],
    velocita: ['Velocità', 'I dati arrivano di continuo e spesso vanno elaborati in tempo reale, mentre arrivano (streaming).', 'I sensori di un’auto a guida autonoma, che deve decidere in frazioni di secondo.'],
    veridicita: ['Veridicità', 'Quanto i dati sono affidabili: possono essere imprecisi, incompleti, duplicati o falsi. Prima di analizzarli bisogna pulirli e valutarli.', 'Recensioni false di un ristorante; un sensore guasto che segna −40 °C ad agosto.'],
    valore: ['Valore', 'I dati servono solo se se ne estraggono informazioni utili per decidere: è lo scopo della data analytics.', 'Un supermercato che scopre quali prodotti si comprano insieme e riorganizza gli scaffali.']
  };
  const fv = $('#fiveV');
  if (fv) {
    const det = $('.tl-detail', fv), btns = fv.querySelectorAll('.v-card');
    const show = k => { btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k))); const d = V[k]; det.innerHTML = '<span class="cat">Una delle 5 V</span><h4></h4><p></p><p><strong>Esempio:</strong> <span></span></p>'; det.querySelector('h4').textContent = d[0]; det.querySelector('p').textContent = d[1]; det.querySelector('p span').textContent = d[2]; };
    btns.forEach(b => b.onclick = () => show(b.dataset.k)); show('volume');
  }

  /* ---------- 3. Flusso di dati: velocità ---------- */
  const st = $('#stream');
  if (st) {
    const cv = $('canvas', st), ctx = cv.getContext('2d'), rin = $('#sIn'), rcap = $('#sCap'), qEl = $('#sQueue'), lostEl = $('#sLost'), doneEl = $('#sDone'), msg = $('.sim-note.live', st);
    const W = cv.width, H = cv.height, MAXQ = 400;
    let queue = 0, lost = 0, done = 0, acc = 0, accP = 0, dots = [], last = performance.now(), running = false, hist = [];
    const show = () => { $('#sInV').textContent = rin.value; $('#sCapV').textContent = rcap.value; };
    rin.oninput = rcap.oninput = show; show();
    function frame(t) {
      if (!running) return;
      const dt = Math.min(0.1, (t - last) / 1000); last = t;
      acc += +rin.value * dt; accP += +rcap.value * dt;
      while (acc >= 1) { acc--; dots.push({ x: 0, y: 20 + Math.random() * (H - 40) }); if (queue < MAXQ) queue++; else lost++; }
      while (accP >= 1 && queue > 0) { accP--; queue--; done++; }
      if (queue === 0) accP = Math.min(accP, 1);
      dots.forEach(d => d.x += 260 * dt); dots = dots.filter(d => d.x < W * 0.55).slice(-300);
      hist.push(queue); if (hist.length > 240) hist.shift();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#176b87'; dots.forEach(d => { ctx.beginPath(); ctx.arc(d.x, d.y, 3, 0, 7); ctx.fill(); });
      const bx = W * 0.56, bw = W * 0.12; ctx.strokeStyle = '#102a43'; ctx.lineWidth = 2; ctx.strokeRect(bx, 10, bw, H - 20);
      const fill = (H - 24) * queue / MAXQ; ctx.fillStyle = queue >= MAXQ ? '#d9822b' : '#f4b942'; ctx.fillRect(bx + 2, H - 12 - fill, bw - 4, fill);
      ctx.fillStyle = '#102a43'; ctx.font = '700 13px system-ui'; ctx.textAlign = 'center'; ctx.fillText('coda', bx + bw / 2, H - 0);
      const gx = W * 0.72, gw = W * 0.26; ctx.strokeStyle = '#a9bfce'; ctx.lineWidth = 1; ctx.strokeRect(gx, 10, gw, H - 20);
      ctx.strokeStyle = '#d9822b'; ctx.lineWidth = 2; ctx.beginPath();
      hist.forEach((q, i) => { const x = gx + gw * i / 240, y = H - 10 - (H - 20) * q / MAXQ; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
      ctx.fillStyle = '#52657a'; ctx.font = '12px system-ui'; ctx.fillText('lunghezza della coda nel tempo', gx + gw / 2, H - 0);
      qEl.textContent = fmt(queue); lostEl.textContent = fmt(lost); doneEl.textContent = fmt(done);
      msg.textContent = lost > 0 ? 'La coda è piena: i dati in arrivo vengono persi. Serve più capacità di elaborazione (più server, elaborazione in parallelo).' : +rin.value > +rcap.value ? 'Arrivano più dati di quanti ne elabori: la coda cresce…' : 'Il sistema regge: i dati vengono elaborati alla stessa velocità con cui arrivano.';
      requestAnimationFrame(frame);
    }
    const go = $('#sGo');
    go.onclick = () => { running = !running; go.textContent = running ? '⏸ Pausa' : '▶ Avvia'; if (running) { last = performance.now(); requestAnimationFrame(frame); } };
    $('#sReset').onclick = () => { queue = lost = done = 0; hist = []; dots = []; qEl.textContent = lostEl.textContent = doneEl.textContent = '0'; ctx.clearRect(0, 0, W, H); };
  }

  /* ---------- 4. Motore di ricerca: autocompletamento ---------- */
  const LOG = {
    'verifica di matematica': 420, 'verifica di informatica': 260, 'verbi irregolari inglese': 380, 'versione di latino': 510, 'verona cosa vedere': 190,
    'meteo maddaloni': 640, 'meteo napoli': 900, 'meteo domani': 1200, 'metro napoli orari': 330,
    'intelligenza artificiale': 870, 'intelligenza artificiale esempi': 300, 'interrogazione storia': 210,
    'python for': 280, 'python liste': 350, 'python installare': 410, 'promessi sposi riassunto': 760, 'pitagora teorema': 520,
    'reti neurali': 240, 'regola di ruffini': 450, 'reggia di caserta orari': 380
  };
  const TREND = ['meteo neve maddaloni', 'verifica di informatica soluzioni', 'reti neurali spiegazione semplice', 'intelligenza artificiale a scuola', 'reggia di caserta mercatini'];
  const se = $('#search');
  if (se) {
    const log = { ...LOG }, inp = $('input', se), ul = $('.suggest', se), tot = $('#qTot'), msg = $('#qMsg');
    const total = () => Object.values(log).reduce((a, b) => a + b, 0);
    function render() {
      const p = inp.value.trim().toLowerCase();
      const list = Object.entries(log).filter(([q]) => p && q.startsWith(p)).sort((a, b) => b[1] - a[1]).slice(0, 5);
      ul.innerHTML = '';
      if (!p) ul.append(el('li', '', 'Inizia a scrivere: ad esempio «ve», «me», «in», «re»…'));
      else if (!list.length) ul.append(el('li', '', 'Nessuna ricerca passata comincia così: premi Invio per farla tu.'));
      const max = list.length ? list[0][1] : 1;
      list.forEach(([q, n]) => { const li = el('li'); const a = el('span', '', q); const bar = el('i', 'bar'); bar.style.width = Math.max(4, 80 * n / max) + 'px'; a.append(bar); li.append(a, el('small', '', fmt(n) + ' ricerche')); ul.append(li); });
      tot.textContent = fmt(total());
    }
    inp.addEventListener('input', render);
    se.querySelector('form').onsubmit = e => { e.preventDefault(); const q = inp.value.trim().toLowerCase(); if (!q) return; log[q] = (log[q] || 0) + 1; msg.textContent = 'Hai aggiunto la ricerca «' + q + '» al registro: ora vale ' + fmt(log[q]) + '.'; render(); };
    $('#qSim').onclick = () => {
      const t = TREND[Math.floor(Math.random() * TREND.length)], keys = Object.keys(log);
      let nt = 0;
      for (let i = 0; i < 1000; i++) { if (Math.random() < 0.6) { log[t] = (log[t] || 0) + 1; nt++; } else { const k = keys[Math.floor(Math.random() * keys.length)]; log[k]++; } }
      msg.textContent = 'Mille utenti hanno cercato: ' + nt + ' di loro «' + t + '». È un argomento di tendenza: prova a scriverne l’inizio.';
      render();
    };
    $('#qReset').onclick = () => { Object.keys(log).forEach(k => delete log[k]); Object.assign(log, LOG); msg.textContent = 'Registro ripristinato.'; render(); };
    render();
  }

  /* ---------- 5. Correlazione e variabile nascosta ---------- */
  const co = $('#corr');
  if (co) {
    const cv = $('canvas', co), ctx = cv.getContext('2d'), W = cv.width, H = cv.height, P = 44;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const gauss = () => { let s = 0; for (let i = 0; i < 6; i++) s += rnd(); return s - 3; };
    const data = [...Array(80)].map(() => { const t = 8 + rnd() * 26; return { t, g: Math.max(5, 12 + t * 7.5 + gauss() * 28), s: Math.max(0, -16 + t * 1.6 + gauss() * 6.5) }; });
    const colorT = $('#cColor'), band = $('#cBand'), rEl = $('#cR'), nEl = $('#cN'), msg = $('#cMsg');
    const pearson = pts => { const n = pts.length; if (n < 3) return NaN; const mx = pts.reduce((a, p) => a + p.g, 0) / n, my = pts.reduce((a, p) => a + p.s, 0) / n; let sxy = 0, sxx = 0, syy = 0; pts.forEach(p => { sxy += (p.g - mx) * (p.s - my); sxx += (p.g - mx) ** 2; syy += (p.s - my) ** 2; }); return sxy / Math.sqrt(sxx * syy); };
    const tCol = t => { const k = (t - 8) / 26; return 'rgb(' + Math.round(42 + k * 205) + ',' + Math.round(157 - k * 60) + ',' + Math.round(143 - k * 110) + ')'; };
    const gx = v => P + (W - P - 12) * (v - 0) / 300, sy = v => H - P - (H - P - 12) * v / 45;
    function draw() {
      const b = band.checked, sel = b ? data.filter(p => p.t >= 24 && p.t <= 28) : data;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = '#52657a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(P, 10); ctx.lineTo(P, H - P); ctx.lineTo(W - 10, H - P); ctx.stroke();
      ctx.fillStyle = '#52657a'; ctx.font = '13px system-ui'; ctx.textAlign = 'center';
      ctx.fillText('gelati venduti in un giorno', (W + P) / 2, H - 10);
      for (let v = 0; v <= 300; v += 50) { ctx.fillText(v, gx(v), H - P + 18); }
      ctx.save(); ctx.translate(14, (H - P) / 2); ctx.rotate(-Math.PI / 2); ctx.fillText('persone con scottature', 0, 0); ctx.restore();
      ctx.textAlign = 'right'; for (let v = 0; v <= 40; v += 10) ctx.fillText(v, P - 6, sy(v) + 4);
      data.forEach(p => { const on = sel.includes(p); ctx.globalAlpha = on ? 1 : 0.12; ctx.fillStyle = colorT.checked ? tCol(p.t) : '#176b87'; ctx.beginPath(); ctx.arc(gx(p.g), sy(p.s), 5, 0, 7); ctx.fill(); });
      ctx.globalAlpha = 1;
      const r = pearson(sel); rEl.textContent = Number.isFinite(r) ? r.toLocaleString('it-IT', { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : '—'; nEl.textContent = sel.length;
      msg.textContent = b ? 'Confrontando solo giorni con temperatura simile (24-28 °C) la correlazione quasi sparisce: era la temperatura a far salire entrambe le grandezze.' : colorT.checked ? 'I punti a destra e in alto sono tutti rossi: i giorni più caldi. La temperatura è la variabile nascosta (o confondente).' : 'Più gelati, più scottature: la correlazione è forte. Ma i gelati causano le scottature?';
    }
    colorT.onchange = band.onchange = draw; draw();
  }
})();
