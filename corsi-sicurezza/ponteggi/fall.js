/* ============================================================
   SIMULAZIONE CADUTA LIBERA – cosa deve far capire:
   1) il tempo: si tocca terra prima di poter reagire (0,7 s ≈ 2,4 m);
   2) l'accelerazione: la velocità cresce durante la caduta (immagini stroboscopiche);
   3) le grandezze: velocità ∝ √h, energia ∝ h (confronto tra più lanci).
   ============================================================ */
const FG = 9.81, FM = 90, TREACT = 0.7;
const f1 = (v, d = 1) => v.toFixed(d).replace('.', ',');
const fallPhys = h => { const t = Math.sqrt(2 * h / FG), v = FG * t; return { t, v, kmh: v * 3.6, E: FM * FG * h / 1000, piani: h / 3 }; };

FALL_HTML = function () {
  return `<div class="kick">Simulazione</div><h2>Da quanto in alto? La fisica non perdona</h2>
   <div class="cols fallcols"><div>
    <div class="ctrl"><label>Altezza dell'impalcato da cui si cade: <b id="fHv"></b><input type="range" id="fH" min="0.5" max="20" step="0.5" value="2"></label>
     <div class="fpre">${[1, 2, 4, 6, 10, 20].map(h => `<button class="chip" data-h="${h}">${h} m</button>`).join('')}</div>
     <label>Velocità di riproduzione <select id="fSpd"><option value="1">tempo reale</option><option value="4" selected>rallentatore ×4</option><option value="10">rallentatore ×10</option></select></label></div>
    <div class="fstats"><div><span id="fT"></span><small>secondi di caduta</small></div><div><span id="fV"></span><small>velocità all'impatto</small></div><div><span id="fE"></span><small>energia all'impatto (90 kg)</small></div></div>
    <div id="fMsg" class="lres"></div>
    <div class="qbar" style="position:static"><button class="btn" id="fGo">⬇ Fai cadere il manichino</button><button class="btn sec" id="fClr">Azzera il confronto</button></div>
    <table class="ftab" id="fTab"><tr><th>Altezza</th><th>Tempo</th><th>Velocità</th><th>Energia</th><th>Come…</th></tr></table>
   </div>
   <div class="fallbox"><svg viewBox="0 0 560 640" id="fSvg"></svg>
    <div class="flegend"><span><i class="ld"></i> un pallino ogni <b>0,1 s</b>: più si scende, più sono distanti → stai <b>accelerando</b></span>
    <span><i class="ll"></i> dove sei dopo <b>0,7 s</b>, il tempo di reazione: fino a qui non riesci nemmeno a reagire</span>
    <span>⏱ il tachimetro mostra la velocità che cresce durante la caduta</span></div></div></div>`;
};

HOOKS.fall = () => {
  const W = 560, H = 640, top = 28, bot = 590, xS = 250, runs = [];
  let raf = null, h = 2;
  const scaleMax = hh => hh <= 4.5 ? 6 : hh <= 10 ? 12 : 22;
  const geo = () => { const M = scaleMax(h), k = (bot - top) / M; return { M, k, y: m => bot - m * k }; };
  const sc = k => 1.8 * k / 117;

  function scene(state) {   // state: {s: metri caduti, tt: tempo reale, ghosts:[...], done}
    const { M, k, y } = geo(), P = fallPhys(h), s = state ? state.s : 0;
    let g = `<rect width="${W}" height="${H}" fill="#eaf4fb"/><rect x="${xS + 70}" y="0" width="${W - xS - 70}" height="${bot}" fill="#efe3d0"/>`;
    // finestre ogni 3 m (un piano)
    for (let p = 0; p * 3 < M; p++) g += `<rect x="${xS + 110}" y="${y(p * 3 + 2.4)}" width="40" height="${1.4 * k}" fill="#9cc3d9" stroke="#8c7b62"/><text x="${xS + 160}" y="${y(p * 3 + 1.2)}" font-size="14" fill="#8d6e63">${p === 0 ? 'piano terra' : p + '° piano'}</text>`;
    // ponteggio fino all'altezza scelta
    const lev = []; for (let m = 2; m <= h + 0.01; m += 2) lev.push(m); if (!lev.length || Math.abs(lev[lev.length - 1] - h) > .01) lev.push(h);
    g += `<line x1="${xS}" y1="${bot}" x2="${xS}" y2="${y(h + 1)}" stroke="${STEEL}" stroke-width="5"/><line x1="${xS + 60}" y1="${bot}" x2="${xS + 60}" y2="${y(h + 1)}" stroke="${STEEL}" stroke-width="5"/>`;
    lev.forEach(m => { g += `<rect x="${xS - 4}" y="${y(m)}" width="68" height="6" fill="${PLANK}" stroke="${STEEL2}"/>`;
      if (m < h - .01) g += `<line x1="${xS}" y1="${y(m + .95)}" x2="${xS + 60}" y2="${y(m + .95)}" stroke="${STEEL}" stroke-width="3"/>`; });
    g += `<text x="${xS + 30}" y="${y(h) - 1.0 * k - 10}" font-size="15" text-anchor="middle" fill="#c62828" font-weight="700">parapetto mancante</text>`;
    // suolo e righello
    g += `<rect x="0" y="${bot}" width="${W}" height="${H - bot}" fill="#cdb48c"/><rect x="0" y="${bot}" width="${W}" height="3" fill="#6d4c41"/>`;
    const step = M <= 6 ? 1 : 2;
    for (let m = 0; m <= M; m += step) g += `<line x1="40" y1="${y(m)}" x2="52" y2="${y(m)}" stroke="#78909c"/><text x="36" y="${y(m) + 4}" font-size="15" text-anchor="end" fill="#546e7a">${m} m</text>`;
    g += `<line x1="46" y1="${y(M)}" x2="46" y2="${bot}" stroke="#78909c"/>`;
    // linea del tempo di reazione
    const dR = .5 * FG * TREACT * TREACT;
    if (h > dR) g += `<line x1="60" y1="${y(h - dR)}" x2="${xS - 10}" y2="${y(h - dR)}" stroke="#7b1fa2" stroke-width="2" stroke-dasharray="6 4"/><text x="${xS - 14}" y="${y(h - dR) + 5}" font-size="18" fill="#7b1fa2" font-weight="700">◀</text>`;
    // immagini stroboscopiche ogni 0,1 s
    const xf = xS - 34;
    if (state) { let lastY = -99; g += `<line x1="${xf - 20}" y1="${y(h)}" x2="${xf - 20}" y2="${y(Math.max(0, h - s))}" stroke="#b0bec5" stroke-width="2"/>`;
      state.ghosts.forEach(gh => { const yy = y(h - gh.s); g += `<circle cx="${xf - 20}" cy="${yy}" r="5" fill="#e53935"/>`;
        if (Math.abs(yy - lastY) > 21) { g += `<text x="${xf - 30}" y="${yy + 4}" font-size="15" fill="#37474f" text-anchor="end">${f1(gh.t)} s · ${Math.round(gh.v * 3.6)} km/h</text>`; lastY = yy; } }); }
    // lavoratore
    const xw = state ? xf : xS + 30, yw = y(h - s), impact = state && state.done;
    g += impact ? `<g transform="translate(${xf + 30},${bot - 4}) rotate(-90)">${worker(0, 0, { s: sc(k), mood: 'shock', arm: 'both' })}</g>` + burst(xf + 10, bot - 26, 26, 'BAM!')
      : worker(xw, yw, { s: sc(k), mood: state ? 'shock' : 'happy', arm: state ? 'both' : 'down' });
    // tachimetro
    const vNow = state ? FG * state.tt : 0, kmh = vNow * 3.6, ang = -90 + Math.min(80, kmh) / 80 * 180, cx = 470, cy = 110;
    g += `<g><path d="M${cx - 62},${cy} A62,62 0 0 1 ${cx + 62},${cy}" fill="#fff" stroke="#263238" stroke-width="3"/>`;
    for (let v = 0; v <= 80; v += 20) { const a = (-180 + v / 80 * 180) * Math.PI / 180; g += `<line x1="${cx + Math.cos(a) * 50}" y1="${cy + Math.sin(a) * 50}" x2="${cx + Math.cos(a) * 60}" y2="${cy + Math.sin(a) * 60}" stroke="#263238" stroke-width="2"/><text x="${cx + Math.cos(a) * 38}" y="${cy + Math.sin(a) * 38 + 4}" font-size="10" text-anchor="middle">${v}</text>`; }
    g += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 54}" stroke="#c62828" stroke-width="4" stroke-linecap="round" transform="rotate(${ang} ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="6" fill="#263238"/>
      <text x="${cx}" y="${cy + 26}" font-size="24" font-weight="700" text-anchor="middle" fill="#0d233a">${Math.round(kmh)} km/h</text><text x="${cx}" y="${cy + 44}" font-size="16" text-anchor="middle" fill="#455a64">t = ${f1(state ? state.tt : 0, 2)} s</text></g>`;
    $('fSvg').innerHTML = g;
  }

  function info() {
    const P = fallPhys(h), dR = .5 * FG * TREACT * TREACT;
    $('fHv').textContent = f1(h) + ' m'; $('fT').textContent = f1(P.t, 2) + ' s'; $('fV').textContent = Math.round(P.kmh) + ' km/h'; $('fE').textContent = f1(P.E) + ' kJ';
    $('fMsg').innerHTML = (h <= dR ? `La caduta dura <b>${f1(P.t, 2)} s</b>: meno del tempo di reazione (0,7 s). <b>Non fai in tempo a reagire.</b> ` : `Dopo 0,7 s (tempo di reazione) sei già sceso di <b>${f1(dR)} m</b> e vai a ${Math.round(FG * TREACT * 3.6)} km/h: aggrapparsi è impossibile. `) +
      `Arrivi a terra a <b>${Math.round(P.kmh)} km/h</b>, come un'auto contro un muro a quella velocità.`;
    document.querySelectorAll('.fpre .chip').forEach(b => b.classList.toggle('on', +b.dataset.h === h));
  }
  function table() {
    const rows = runs.map((r, i) => { const P = fallPhys(r), base = runs[0], Pb = fallPhys(base);
      const cmp = i === 0 ? '—' : `velocità ×${f1(P.v / Pb.v, 2)} · energia ×${f1(P.E / Pb.E, 1)}`;
      return `<tr><td>${f1(r)} m</td><td>${f1(P.t, 2)} s</td><td>${Math.round(P.kmh)} km/h</td><td>${f1(P.E)} kJ</td><td>${r >= 3 ? 'dal ' + Math.floor(r / 3) + '° piano · ' : ''}${cmp}</td></tr>`; }).join('');
    $('fTab').innerHTML = `<tr><th>Altezza</th><th>Tempo</th><th>Velocità</th><th>Energia</th><th>Rispetto al 1° lancio</th></tr>` + (rows || '<tr><td colspan="5" class="small">Fai cadere il manichino da altezze diverse e confronta: raddoppiando l\'altezza l\'energia raddoppia, la velocità cresce solo di 1,4 volte. Ma già 2 m bastano per farsi molto male.</td></tr>');
  }
  const setH = v => { h = v; $('fH').value = v; cancelAnimationFrame(raf); info(); scene(null); };
  $('fH').oninput = () => setH(+$('fH').value);
  document.querySelectorAll('.fpre .chip').forEach(b => b.onclick = () => setH(+b.dataset.h));
  $('fClr').onclick = () => { runs.length = 0; table(); };
  $('fGo').onclick = () => {
    cancelAnimationFrame(raf); const P = fallPhys(h), slow = +$('fSpd').value, t0 = performance.now(), ghosts = []; let nextG = 0.1;
    const step = now => { if (!document.getElementById('fSvg')) return;
      const tt = Math.min(P.t, (now - t0) / 1000 / slow), s = .5 * FG * tt * tt;
      while (nextG < tt) { ghosts.push({ t: nextG, s: .5 * FG * nextG * nextG, v: FG * nextG }); nextG += 0.1; }
      const done = tt >= P.t; scene({ s, tt, ghosts, done });
      if (!done) raf = requestAnimationFrame(step); else { if (!runs.includes(h)) runs.push(h); table(); } };
    raf = requestAnimationFrame(step);
  };
  setH(2); table();
};
