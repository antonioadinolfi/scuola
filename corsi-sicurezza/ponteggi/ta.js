/* ============================================================
   TIRANTE D'ARIA – approfondimento: concetti, norme, simulatore,
   casi studio, "trova l'errore nel calcolo", casi di errore
   ============================================================ */
const fm = (v, d = 2) => v.toFixed(d).replace('.', ',') + ' m';
const fn2 = (v, d = 2) => v.toFixed(d).replace('.', ',');
const G = 9.81, CC_ = 1.5, DD_ = 1.0;   // C = attacco dorsale-piedi, D = margine di sicurezza

/* ---------- modello di calcolo ----------
   p: { dev:'cord'|'retr', Hp: spazio libero sotto i piedi (m), ha: ancoraggio rispetto ai piedi (m),
        A: cordino (m), B: allungamento assorbitore (m), Hr: distanza di arresto retrattile (m), F: freccia linea vita (m) } */
function taCalc(p) {
  const r = { C: CC_, D: DD_ };
  if (p.dev === 'retr') {
    const low = Math.max(0, CC_ - p.ha);                 // ancoraggio sotto l'attacco dorsale
    r.FF = 2 * low + 0.2;                                 // caduta prima del bloccaggio (stima prudente)
    r.drop = p.Hr + 2 * low + p.F;                        // abbassamento dei piedi
    r.Fc = null; r.low = low > 0;
  } else {
    r.FF = Math.max(0, p.A + CC_ - p.ha) ;                // caduta libera dell'attacco dorsale
    r.drop = p.A + p.B + p.F + CC_ - p.ha;                // abbassamento dei piedi all'arresto
    r.Fc = r.FF / p.A;
    r.retention = r.FF <= 0.05;
  }
  r.TA = p.dev === 'retr' ? (p.ha + r.drop + DD_) : (p.F + p.A + p.B + CC_ + DD_);  // misurato dal punto di ancoraggio
  r.need = r.drop + DD_;                                  // spazio necessario sotto i piedi
  r.ok = p.Hp >= r.need;
  r.gap = r.need - p.Hp;
  r.v = Math.sqrt(2 * G * Math.max(0, r.FF)) * 3.6;
  return r;
}

/* ---------- disegno della scena (in scala) ---------- */
function taScene(p, t = 1, o = {}) {
  const r = taCalc(p), W = 640, H = 560, top = 34, bot = 520;
  const anchorM = p.Hp + p.ha, feet0 = p.Hp;
  const maxY = Math.max(p.Hp + 2.3, anchorM + 0.6), minY = Math.min(-0.4, p.Hp - r.need - 0.4);
  const k = (bot - top) / (maxY - minY), y = m => top + (maxY - m) * k;
  const xEdge = 170, xM = 186, xFall = 140, xCol = 400, xPlat2 = 320;
  // stato animato
  const finalFeet = Math.max(0, feet0 - r.drop), impact = feet0 - r.drop < 0;
  let feet = feet0, xw = 255, absorb = 0, phase = 'stand';
  if (t > 0) {
    const FF = Math.min(r.FF, r.drop), tF = Math.sqrt(2 * FF / G), vF = G * tF, bd = Math.max(0, r.drop - FF), tB = bd > 0 ? 2 * bd / Math.max(vF, 1) : 0, T = tF + tB;
    if (t < .12) { xw = 255 - (255 - xFall) * (t / .12); phase = 'step'; }
    else { xw = xFall; const tau = (t - .12) / .88 * T; let s;
      if (tau < tF) { s = .5 * G * tau * tau; phase = 'free'; } else { const t2 = Math.min(tau - tF, tB), a = tB ? vF / tB : 0; s = FF + vF * t2 - .5 * a * t2 * t2; phase = 'brake'; absorb = p.B ? Math.min(1, (s - FF) / Math.max(bd, .01)) : 0; }
      if (s >= feet0) { s = feet0; phase = 'impact'; } else if (t >= 1) phase = 'stop';
      feet = feet0 - s; }
  }
  const sc = 1.8 * k / 117, ringY = y(feet + CC_), ax = xM, ay = y(anchorM);
  let svg = `<svg viewBox="0 0 ${W} ${H}" class="tascene">
   <defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#ffcdd2"/><line x1="0" y1="0" x2="0" y2="8" stroke="#e57373" stroke-width="3"/></pattern></defs>
   <rect width="${W}" height="${H}" fill="#eaf4fb"/>`;
  // facciata
  svg += `<rect x="${xPlat2 + 10}" y="0" width="${W - xPlat2 - 10}" height="${y(0)}" fill="#efe3d0"/>`;
  // suolo / ostacolo
  svg += `<rect x="0" y="${y(0)}" width="${W}" height="${H - y(0)}" fill="#cdb48c"/><rect x="0" y="${y(0)}" width="${W}" height="4" fill="#6d4c41"/>
   <text x="8" y="${y(0) + 20}" font-size="13" fill="#3e2723" font-weight="700">suolo o primo ostacolo (quota 0)</text>`;
  // righello
  for (let m = Math.ceil(minY); m <= Math.floor(maxY); m++) svg += `<line x1="34" y1="${y(m)}" x2="${m % 2 ? 40 : 46}" y2="${y(m)}" stroke="#78909c"/>${m % 2 ? '' : `<text x="30" y="${y(m) + 4}" font-size="11" text-anchor="end" fill="#546e7a">${m}</text>`}`;
  svg += `<line x1="34" y1="${y(maxY)}" x2="34" y2="${y(Math.max(minY, 0))}" stroke="#78909c"/><text x="6" y="${top - 12}" font-size="11" fill="#546e7a">metri</text>`;
  // montante e impalcato (bordo verso il vuoto a sinistra)
  svg += `<line x1="${xM}" y1="${y(0)}" x2="${xM}" y2="${y(Math.max(anchorM, feet0) + 0.7)}" stroke="${STEEL}" stroke-width="7"/>
   <line x1="${xEdge}" y1="${y(0)}" x2="${xEdge}" y2="${y(feet0 - 0.05)}" stroke="${STEEL}" stroke-width="5" opacity=".55"/>
   <line x1="${xPlat2}" y1="${y(0)}" x2="${xPlat2}" y2="${y(feet0 + 1.1)}" stroke="${STEEL}" stroke-width="5"/><rect x="${xEdge}" y="${y(feet0)}" width="${xPlat2 - xEdge + 4}" height="8" fill="${PLANK}" stroke="${STEEL2}"/>
   <text x="${xEdge + 30}" y="${y(feet0) + 22}" font-size="12" fill="#37474f">impalcato · bordo aperto a sinistra</text>`;
  // linea vita (freccia)
  if (p.F > 0) svg += `<path d="M${xM - 60},${ay} Q${xM - 30},${ay + p.F * k * (t > 0 && phase !== 'stand' && phase !== 'step' ? 1 : .15)} ${xM},${ay}" stroke="#ffb300" stroke-width="3" fill="none"/><text x="${xM - 64}" y="${ay - 6}" font-size="11" text-anchor="end">linea vita</text>`;
  // ancoraggio
  svg += `<circle cx="${ax}" cy="${ay}" r="7" fill="#263238"/><text x="${ax - 12}" y="${ay - 8}" font-size="13" font-weight="700" fill="#263238" text-anchor="end">ancoraggio</text>`;
  // cordino / retrattile
  const rx = xw - 9 * sc * 1, ry = ringY;
  if (p.dev === 'retr') svg += `<rect x="${ax - 9}" y="${ay}" width="18" height="22" rx="4" fill="#1565c0"/><line x1="${ax}" y1="${ay + 22}" x2="${rx}" y2="${ry}" stroke="#90caf9" stroke-width="2.5"/>`;
  else {
    const slack = phase === 'stand' || phase === 'step' || (phase === 'free');
    const ab = p.B * absorb * k;
    const ex = rx + (ax - rx) * .25, ey = ry + (ay - ry) * .25;
    if (slack) svg += `<path d="M${ax},${ay} Q${(ax + rx) / 2},${Math.max(ay, ry) + 40} ${rx},${ry}" stroke="#d32f2f" stroke-width="3" fill="none"/>`;
    else svg += `<line x1="${ax}" y1="${ay}" x2="${rx}" y2="${ry}" stroke="#d32f2f" stroke-width="3"/>` + (ab > 2 ? `<line x1="${rx}" y1="${ry}" x2="${rx + (ax - rx) * (ab / Math.hypot(ax - rx, ay - ry))}" y2="${ry + (ay - ry) * (ab / Math.hypot(ax - rx, ay - ry))}" stroke="#ff9800" stroke-width="8" stroke-dasharray="4 3"/>` : '');
  }
  // lavoratore
  svg += `<g>${worker(xw, y(feet), { s: sc, mood: phase === 'stand' ? 'happy' : (phase === 'stop' ? 'worried' : 'shock'), arm: phase === 'stand' ? 'down' : 'both' })}${harness(xw, y(feet), sc)}</g>`;
  if (phase === 'impact') svg += burst(xw + 40, y(0) - 30, 30, 'IMPATTO!');
  if (phase === 'stop') svg += `<text x="${xw - 10}" y="${y(feet) + 18}" font-size="13" font-weight="700" fill="#2e7d32" text-anchor="middle">arrestato</text>`;
  // colonna quote dal punto di ancoraggio
  const segs = p.dev === 'retr' ? [[p.ha, '#b0bec5', 'ancoraggio → piedi'], [r.drop, '#ffa726', 'distanza di arresto (manuale)'], [DD_, '#66bb6a', 'D margine 1 m']]
    : [[p.F, '#ffd54f', 'F freccia linea vita'], [p.A, '#ef5350', 'A cordino + assorbitore'], [p.B, '#ffa726', 'B apertura assorbitore'], [CC_, '#42a5f5', 'C attacco → piedi'], [DD_, '#66bb6a', 'D margine']];
  let cur = anchorM;
  if (!o.noCol) {
    segs.forEach(s => { if (s[0] <= 0.001) return; const y1 = y(cur), y2 = y(cur - s[0]);
      svg += `<rect x="${xCol}" y="${y1}" width="22" height="${y2 - y1}" fill="${s[1]}" stroke="#fff"/><text x="${xCol + 28}" y="${(y1 + y2) / 2 + 5}" font-size="14">${s[2]}: <tspan font-weight="700">${fn2(s[0])}</tspan></text>`; cur -= s[0]; });
    svg += `<line x1="${ax}" y1="${ay}" x2="${xCol + 22}" y2="${ay}" stroke="#263238" stroke-dasharray="3 3"/><text x="${xCol + 11}" y="${ay - 8}" font-size="13" font-weight="700" text-anchor="middle" fill="#0d233a">TA = ${fm(r.TA)}</text>`;
    if (cur < 0) svg += `<rect x="${xCol - 6}" y="${y(0)}" width="34" height="${y(cur) - y(0)}" fill="url(#hatch)" stroke="#c62828"/><text x="${xCol - 10}" y="${(y(0) + y(cur)) / 2 + 4}" font-size="13" font-weight="700" fill="#c62828" text-anchor="end">mancano ${fm(-cur)}</text><text x="${xCol - 10}" y="${(y(0) + y(cur)) / 2 + 20}" font-size="11" fill="#c62828" text-anchor="end">(sotto il suolo = impatto)</text>`;
  }
  // quote sotto i piedi
  svg += `<g font-size="12"><line x1="70" y1="${y(feet0)}" x2="70" y2="${y(0)}" stroke="#1565c0" stroke-width="2"/><line x1="64" y1="${y(feet0)}" x2="76" y2="${y(feet0)}" stroke="#1565c0" stroke-width="2"/><line x1="64" y1="${y(0)}" x2="76" y2="${y(0)}" stroke="#1565c0" stroke-width="2"/>
   <text transform="translate(62,${(y(feet0) + y(0)) / 2}) rotate(-90)" text-anchor="middle" fill="#1565c0" font-weight="700">disponibile ${fm(p.Hp)}</text>
   <line x1="98" y1="${y(feet0)}" x2="98" y2="${y(feet0 - r.need)}" stroke="${r.ok ? '#2e7d32' : '#c62828'}" stroke-width="2" stroke-dasharray="5 3"/><line x1="92" y1="${y(feet0 - r.need)}" x2="104" y2="${y(feet0 - r.need)}" stroke="${r.ok ? '#2e7d32' : '#c62828'}" stroke-width="2"/>
   <text transform="translate(112,${(y(feet0) + y(feet0 - r.need)) / 2}) rotate(-90)" text-anchor="middle" fill="${r.ok ? '#2e7d32' : '#c62828'}" font-weight="700">necessario ${fm(r.need)}</text></g>`;
  return svg + '</svg>';
}

/* ---------- casi pronti per il simulatore ---------- */
const TA_PRESET = [
  { n: '1° impalcato a 2 m, aggancio ai piedi', p: { dev: 'cord', Hp: 2, ha: 0, A: 2, B: 1.75, Hr: .8, F: 0 } },
  { n: '2° impalcato a 4 m, linea vita al piano', p: { dev: 'cord', Hp: 4, ha: 0, A: 2, B: 1.75, Hr: .8, F: .5 } },
  { n: '4 m, ancoraggio a 1,5 m, cordino 1,4 m + assorbitore 0,7 m', p: { dev: 'cord', Hp: 4, ha: 1.5, A: 1.4, B: .7, Hr: .8, F: 0 } },
  { n: '4 m, retrattile sul montante sopra la testa', p: { dev: 'retr', Hp: 4, ha: 2, A: 2, B: 1.75, Hr: .8, F: 0 } },
  { n: 'Gronda a 9 m, cordino 2 m sopra la testa', p: { dev: 'cord', Hp: 9, ha: 2, A: 2, B: 1.75, Hr: .8, F: 0 } }
];

const TA = {
  concetto: () => `<div class="kick">Tirante d'aria · 1</div><h2>Che cos'è il tirante d'aria (in una figura)</h2>
   <div class="cols ta2"><div class="tascene-wrap">${taScene({ dev: 'cord', Hp: 7, ha: 1.8, A: 2, B: 1.75, Hr: .8, F: 0 }, 1)}</div>
   <div><div class="defs">
    <div><b>Tirante d'aria (TA)</b><p>Lo spazio libero che serve <b>sotto il punto di ancoraggio</b> perché il sistema ti fermi <b>prima</b> di toccare il suolo o un ostacolo.</p></div>
    <div><b>Caduta libera</b><p>Il tratto in cui cadi prima che il cordino si tenda. Più è lunga, più forte è lo strappo.</p></div>
    <div><b>Distanza di arresto</b><p>Quanto scendi dall'inizio della caduta alla posizione finale da fermo: caduta libera + apertura dell'assorbitore (+ freccia della linea vita).</p></div>
    <div><b>Fattore di caduta Fc = H / L</b><p>Altezza di caduta libera diviso lunghezza del cordino. Il massimo ammesso per i sistemi di arresto è <b>2</b>: caduta libera pari al doppio del cordino.</p></div></div>
    <div class="formula">TA = <span style="background:#ef5350">A</span> + <span style="background:#ffa726">B</span> + <span style="background:#42a5f5">C</span> + <span style="background:#66bb6a">D</span> <small>(+ F se c'è una linea vita flessibile)</small></div>
    <p class="small">A cordino con assorbitore e connettori (max 2 m) · B allungamento dell'assorbitore (fino a 1,75 m) · C attacco dorsale–piedi (1,5 m) · D margine di sicurezza (1 m) · F freccia della linea vita (dal manuale).</p></div></div>`,

  norme: () => `<div class="kick">Tirante d'aria · 2</div><h2>Cosa dicono la legge e le norme tecniche</h2>
   <div class="cols"><div><h3>Legge (D.Lgs. 81/2008)</h3><table class="nt">
    <tr><td><b>art. 111</b></td><td>Prima le <b>protezioni collettive</b> (parapetti, DPC); i DPI solo se queste non bastano. I lavori in quota si fanno solo con meteo sicuro.</td></tr>
    <tr><td><b>art. 115 c.1</b></td><td>Sistemi di protezione "idonei per l'uso specifico": assorbitori, connettori, dispositivi di ancoraggio, cordini, retrattili, linee vita, imbracature.</td></tr>
    <tr><td><b>art. 115 c.2</b></td><td>Il sistema va assicurato, direttamente o con linea vita, a <b>parti stabili</b> delle opere fisse o provvisionali.</td></tr>
    <tr><td><b>art. 77 c.4–5</b></td><td>Il datore fornisce DPI adatti, ne cura l'efficienza; per i DPI di <b>III categoria</b> è obbligatorio l'<b>addestramento</b>.</td></tr>
    <tr><td><b>art. 136 + All. XXII</b></td><td>Il <b>PiMUS</b> indica i DPI da usare nel montaggio/smontaggio e i punti di ancoraggio: il tirante d'aria si verifica lì.</td></tr></table></div>
    <div><h3>Norme tecniche (i numeri)</h3><table class="nt">
    <tr><td><b>EN 363</b></td><td>Come si compongono i sistemi: trattenuta, posizionamento, <b>arresto caduta</b>.</td></tr>
    <tr><td><b>EN 354 / 355</b></td><td>Cordino con assorbitore: lunghezza totale <b>max 2 m</b>; forza di arresto <b>≤ 6 kN</b>; allungamento <b>≤ 1,75 m</b>; prova con caduta pari a <b>2 volte</b> la lunghezza.</td></tr>
    <tr><td><b>EN 360</b></td><td>Retrattili: la <b>distanza di arresto</b> e lo spazio minimo li dà il manuale.</td></tr>
    <tr><td><b>EN 361 · 362 · 795</b></td><td>Imbracatura (attacco "A") · connettori · dispositivi di ancoraggio.</td></tr>
    <tr><td><b>EN 365 · UNI 11158</b></td><td>Istruzioni, ispezione periodica e scheda di controllo · guida italiana alla <b>scelta e all'uso</b> dei sistemi anticaduta.</td></tr></table></div></div>
   <div class="warn"><b>Massa:</b> l'EN 355 prova l'assorbitore con 100 kg. Lavoratore + attrezzi oltre il peso certificato → l'assorbitore si allunga di più e il tirante cresce; molto sotto i 50–60 kg → l'assorbitore può non aprirsi e lo strappo è più duro. Usa DPI certificati per la tua massa (molti oggi fino a 140 kg).</div>`,

  sim: () => `<div class="kick">Tirante d'aria · 3 · simulatore</div><h2>Simula la caduta e verifica lo spazio</h2>
   <div class="presets">${TA_PRESET.map((c, i) => `<button class="chip" data-p="${i}">Caso ${i + 1}: ${c.n}</button>`).join('')}</div>
   <div class="cols ta2"><div class="ctrl tactl">
    <label>Dispositivo <select id="tDev"><option value="cord">cordino con assorbitore (EN 354/355)</option><option value="retr">dispositivo retrattile (EN 360)</option></select></label>
    <label>Spazio libero <b>sotto i piedi</b> (fino al suolo o al primo ostacolo): <b id="vHp"></b><input type="range" id="tHp" min="1" max="12" step="0.25"></label>
    <label>Ancoraggio rispetto ai piedi: <b id="vHa"></b> <span id="vHaT" class="small"></span><input type="range" id="tHa" min="-0.5" max="2.2" step="0.1"></label>
    <label class="cOnly">A · cordino + assorbitore + connettori: <b id="vA"></b><input type="range" id="tA2" min="0.5" max="2" step="0.1"></label>
    <label class="cOnly">B · allungamento massimo dell'assorbitore (manuale): <b id="vB"></b><input type="range" id="tB2" min="0" max="1.75" step="0.05"></label>
    <label class="rOnly">Distanza di arresto del retrattile (manuale): <b id="vHr"></b><input type="range" id="tHr" min="0.3" max="2" step="0.1"></label>
    <label>F · freccia della linea vita (0 = punto fisso): <b id="vF"></b><input type="range" id="tF" min="0" max="1.5" step="0.1"></label>
    <p class="small">C = 1,50 m (attacco dorsale → piedi) · D = 1,00 m (margine) sono fissi.</p>
    <div class="qbar" style="position:static"><button class="btn" id="tPlay">▶ Simula la caduta</button><button class="btn sec" id="tReset">↺ Rimetti in piedi</button></div>
   </div><div class="tascene-wrap" id="tScene"></div></div>
   <div class="tares" id="tRes"></div>`,

  casi: () => `<div class="kick">Tirante d'aria · 4</div><h2>Durante il montaggio: perché il cordino da 2 m spesso non basta</h2>
   <p>Esempio: montaggio del 2° impalcato, piedi a <b>4 m</b> dal suolo. Spazio necessario sotto i piedi = TA − altezza dell'ancoraggio sopra i piedi.</p>
   <table class="cases"><tr><th>Soluzione</th><th>Ancoraggio</th><th>A</th><th>B</th><th>F</th><th>Serve sotto i piedi</th><th>Esito a 4 m</th></tr>
   ${[['Cordino 2 m su linea vita al piano', 0, 2, 1.75, .5], ['Cordino 2 m su linea vita a 1,5 m', 1.5, 2, 1.75, .5], ['Cordino 1,4 m + assorbitore 0,7 m, linea vita al piano', 0, 1.4, .7, .5], ['Cordino 1,4 m + assorbitore 0,7 m, punto a 1,5 m', 1.5, 1.4, .7, 0]].map(c => {
    const r = taCalc({ dev: 'cord', Hp: 4, ha: c[1], A: c[2], B: c[3], F: c[4] }); return `<tr><td>${c[0]}</td><td>+${fn2(c[1], 1)} m</td><td>${fn2(c[2], 1)}</td><td>${fn2(c[3])}</td><td>${fn2(c[4], 1)}</td><td><b>${fm(r.need)}</b></td><td class="${r.ok ? 'okc' : 'koc'}">${r.ok ? '✔ OK' : '✘ impatto'}</td></tr>`; }).join('')}
   ${(() => { const r = taCalc({ dev: 'retr', Hp: 4, ha: 2, Hr: .8, F: 0 }); return `<tr><td>Retrattile sul montante sopra la testa (arresto 0,8 m)</td><td>+2,0 m</td><td colspan="3">—</td><td><b>${fm(r.need)}</b></td><td class="okc">✔ OK</td></tr>`; })()}
   <tr><td>Parapetto di montaggio / DPC montato dal piano sotto</td><td colspan="5">nessuna caduta: protezione collettiva</td><td class="okc">✔ la migliore</td></tr></table>
   <div class="cols" style="margin-top:12px"><div class="warn">Nei primi impalcati lo spazio sotto è poco: servono <b>ancoraggi alti</b>, <b>cordini corti</b> con assorbitore a bassa apertura, <b>retrattili</b> o, meglio, <b>parapetti di montaggio</b>. Valori indicativi: fanno fede il manuale del DPI e il PiMUS.</div>
   ${easy('Il cordino lungo serve dove c\'è <b>tanto spazio sotto</b>. Vicino a terra uccide lo stesso: tocchi terra prima che ti fermi.')}</div>`,

  errcalc: () => `<div class="kick">Tirante d'aria · 5 · trova l'errore</div><h2>Trova l'errore nella scheda di calcolo</h2>
   <p>Ogni scheda contiene <b>un errore</b>. Clicca la riga sbagliata.</p>
   <div class="ectabs" id="ecTabs"></div><div id="ecBox"></div><div id="ecScore" class="score"></div>`,

  errcasi: () => `<div class="kick">Tirante d'aria · 6 · casi di errore</div><h2>Cosa c'è di sbagliato? Otto errori veri di cantiere</h2>
   <div class="eg" id="egBox"></div><div id="egScore" class="score"></div>`
};

/* ---------- schede di calcolo con un errore ---------- */
const EC = [
  { t: 'Scheda 1 · 1° impalcato', ctx: 'Montaggio del 1° impalcato. Piedi a 2,00 m dal suolo. Cordino agganciato al montante all\'altezza dei piedi.',
    rows: ['A cordino con assorbitore = 2,00 m', 'B allungamento assorbitore = 1,75 m', 'C attacco–piedi = 1,50 m', 'D margine = 1,00 m', 'TA = 6,25 m sotto l\'ancoraggio', 'Spazio disponibile sotto l\'ancoraggio = 2,00 m', 'ESITO: idoneo ✔'],
    bad: 6, why: 'L\'esito è sbagliato: servono 6,25 m e ce ne sono 2,00. Il lavoratore tocca terra prima dell\'arresto. Soluzione: parapetto di montaggio o protezione collettiva; in alternativa ancoraggio alto e retrattile.' },
  { t: 'Scheda 2 · cordino "corto"', ctx: 'Facciata, piedi a 6,00 m. Ancoraggio sopra la testa (+1,80 m). Cordino di 1,50 m con assorbitore e due moschettoni.',
    rows: ['A = 1,50 m (solo la fettuccia, senza assorbitore e connettori)', 'B = 1,75 m', 'C = 1,50 m', 'D = 1,00 m', 'TA = 5,75 m', 'Spazio sotto l\'ancoraggio = 7,80 m', 'ESITO: idoneo'],
    bad: 0, why: 'A è la lunghezza <b>totale</b> del sottosistema: cordino + assorbitore chiuso + connettori (max 2 m). Misurare solo la fettuccia sottostima il tirante.' },
  { t: 'Scheda 3 · assorbitore', ctx: 'Copertura, piedi a 5,00 m. Ancoraggio a +1,00 m. Cordino 2,00 m con assorbitore EN 355.',
    rows: ['A = 2,00 m', 'B = 0,00 m ("l\'assorbitore si apre solo se cado male")', 'C = 1,50 m', 'D = 1,00 m', 'TA = 4,50 m', 'Spazio sotto l\'ancoraggio = 6,00 m', 'ESITO: idoneo'],
    bad: 1, why: 'B è l\'apertura <b>massima</b> dell\'assorbitore indicata dal fabbricante (fino a 1,75 m per EN 355). Con B corretto TA = 6,25 m > 6,00 m: <b>non idoneo</b>.' },
  { t: 'Scheda 4 · linea vita', ctx: 'Linea vita flessibile tra due montanti distanti 6 m, a +1,50 m dai piedi. Piedi a 7,00 m. Il manuale indica freccia 1,20 m.',
    rows: ['F freccia della linea vita = non considerata', 'A = 2,00 m', 'B = 1,75 m', 'C = 1,50 m', 'D = 1,00 m', 'TA = 6,25 m · spazio sotto l\'ancoraggio = 8,50 m', 'ESITO: idoneo'],
    bad: 0, why: 'Con una linea vita flessibile la <b>freccia</b> si somma al tirante (TA = 7,45 m). Qui resta idoneo, ma con piedi a 5 m non lo sarebbe più. La freccia la dà il fabbricante della linea.' },
  { t: 'Scheda 5 · l\'ostacolo', ctx: 'Piedi a 8,00 m da terra. Sotto, a 3,00 m dal suolo, c\'è la mantovana parasassi. Ancoraggio a +1,50 m.',
    rows: ['A = 2,00 m', 'B = 1,75 m', 'C = 1,50 m', 'D = 1,00 m', 'TA = 6,25 m', 'Spazio sotto l\'ancoraggio = 9,50 m (misurato fino al suolo)', 'ESITO: idoneo'],
    bad: 5, why: 'Lo spazio si misura fino al <b>primo ostacolo</b>: la mantovana è a 5,00 m sotto i piedi, quindi 6,50 m sotto l\'ancoraggio. TA 6,25 m: idoneo per soli 25 cm, senza margine reale se la massa supera 100 kg. Va ricontrollato.' }
];

/* ---------- casi di errore illustrati ---------- */
function miniScene(id) {
  const base = (extra) => `<svg viewBox="0 0 300 210"><rect width="300" height="210" fill="#eaf4fb"/><rect x="0" y="186" width="300" height="24" fill="#cdb48c"/>${extra}</svg>`;
  const plat = (y, x1 = 120, x2 = 260) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="6" fill="${PLANK}" stroke="${STEEL2}"/><line x1="${x2 - 10}" y1="186" x2="${x2 - 10}" y2="${y - 70}" stroke="${STEEL}" stroke-width="5"/>`;
  const w = (x, y, o = {}) => worker(x, y, Object.assign({ s: .55 }, o)) + harness(x, y, .55);
  switch (id) {
    case 'piedi': return base(plat(120) + `<circle cx="250" cy="118" r="4" fill="#263238"/>` + lanyard(250, 118, 180, 80) + w(180, 120) + `<text x="10" y="150" font-size="12" font-weight="700" fill="#c62828">2 m</text><line x1="40" y1="120" x2="40" y2="186" stroke="#c62828" stroke-width="2"/>`);
    case 'serie': return base(plat(80) + `<circle cx="250" cy="20" r="4" fill="#263238"/>` + `<path d="M250,20 Q200,40 190,52" stroke="#d32f2f" stroke-width="3" fill="none"/><circle cx="190" cy="52" r="5" fill="none" stroke="#555" stroke-width="2.5"/><path d="M190,52 Q150,40 110,30" stroke="#7b1fa2" stroke-width="3" fill="none"/>` + w(110, 80) + `<text x="120" y="70" font-size="11" fill="#7b1fa2" font-weight="700">2 cordini uniti</text>`);
    case 'spigolo': return base(`<rect x="0" y="80" width="190" height="106" fill="#bdbdbd"/>` + `<circle cx="40" cy="70" r="4" fill="#263238"/>` + `<path d="M40,70 L188,80 L200,140" stroke="#d32f2f" stroke-width="3" fill="none"/>` + `<g transform="translate(200,140)">${w(0, 50, { mood: 'shock', arm: 'both' })}</g>` + `<circle cx="188" cy="80" r="10" fill="none" stroke="#c62828" stroke-width="3"/>`);
    case 'pendolo': return base(plat(70, 20, 290) + `<circle cx="270" cy="20" r="4" fill="#263238"/>` + `<path d="M270,20 L60,120" stroke="#d32f2f" stroke-width="3" stroke-dasharray="6 4"/>` + w(60, 70) + `<path d="M60,140 Q150,190 240,150" stroke="#c62828" stroke-width="2" fill="none" marker-end="url(#a)"/><line x1="240" y1="186" x2="240" y2="80" stroke="${STEEL}" stroke-width="6"/>` + burst(240, 150, 16, '!'));
    case 'traverso': return base(plat(120) + `<line x1="120" y1="88" x2="260" y2="88" stroke="${STEEL}" stroke-width="5"/>` + w(170, 120) + `<g transform="translate(222,88) rotate(90)"><rect x="-12" y="-7" width="24" height="14" rx="7" fill="none" stroke="#555" stroke-width="3"/></g>` + `<path d="M170,62 Q200,70 222,88" stroke="#d32f2f" stroke-width="3" fill="none"/><circle cx="222" cy="88" r="16" fill="none" stroke="#c62828" stroke-width="3"/>`);
    case 'nodo': return base(plat(120) + `<circle cx="250" cy="40" r="4" fill="#263238"/>` + `<path d="M250,40 Q210,50 200,58" stroke="#d32f2f" stroke-width="3" fill="none"/><circle cx="196" cy="60" r="8" fill="#d32f2f"/><path d="M196,60 L180,70" stroke="#d32f2f" stroke-width="3"/>` + w(175, 120) + `<circle cx="196" cy="60" r="16" fill="none" stroke="#c62828" stroke-width="3"/>`);
    case 'laterale': return base(plat(120) + w(170, 120) + `<circle cx="180" cy="96" r="5" fill="#ffca28" stroke="#333"/>` + `<path d="M182,96 Q215,90 248,80" stroke="#d32f2f" stroke-width="3" fill="none"/><circle cx="250" cy="80" r="4" fill="#263238"/><circle cx="180" cy="96" r="12" fill="none" stroke="#c62828" stroke-width="3"/><text x="40" y="60" font-size="11" font-weight="700">anello laterale</text><line x1="90" y1="64" x2="168" y2="94" stroke="#333"/>`);
    case 'massa': return base(plat(120) + `<circle cx="250" cy="70" r="4" fill="#263238"/>` + lanyard(250, 70, 175, 66) + worker(175, 120, { s: .62, mood: 'smug', vest: '#ff8c1a' }) + `<rect x="190" y="98" width="26" height="22" fill="#6d4c41"/><text x="20" y="40" font-size="14" font-weight="700" fill="#c62828">95 kg + 25 kg di attrezzi</text>`);
  }
}
const EG = [
  { id: 'piedi', q: '1° impalcato a 2 m, cordino 2 m agganciato al montante all\'altezza dei piedi.', o: ['Va bene: è agganciato', 'Tirante d\'aria insufficiente: servono circa 6,25 m, ce ne sono 2', 'Basta stringere di più l\'imbracatura'], a: 1, e: 'Caduta libera 3,5 m (Fc 1,75) e 6,25 m di spazio necessario: tocca terra prima dell\'arresto. Serve protezione collettiva o ancoraggio alto con retrattile (art. 111).' },
  { id: 'serie', q: 'Per arrivare più lontano, collega due cordini con un moschettone.', o: ['È vietato: si supera la lunghezza massima di 2 m e il sistema non è certificato così', 'Va bene se i moschettoni sono a ghiera', 'Va bene se uno dei due ha l\'assorbitore'], a: 0, e: 'EN 354/355: lunghezza totale massima 2 m, solo combinazioni previste dal fabbricante. Caduta libera e tirante raddoppiano.' },
  { id: 'spigolo', q: 'In caduta, il cordino lavora su uno spigolo vivo (bordo di lamiera o trave).', o: ['Nessun problema: la fettuccia è robusta', 'Rischio di taglio del cordino: servono DPI certificati per spigolo e protezioni del bordo', 'Basta un cordino più lungo'], a: 1, e: 'Le istruzioni EN 355/360 escludono l\'uso su spigoli se il prodotto non è provato per il bordo. Si usano protettori di spigolo o dispositivi certificati.' },
  { id: 'pendolo', q: 'Il lavoratore si sposta lontano lateralmente dal punto di ancoraggio.', o: ['Effetto pendolo: dopo l\'arresto oscilla e urta il montante o la facciata', 'Nessun rischio se il cordino è teso', 'Il pendolo riduce la forza di arresto, quindi è meglio'], a: 0, e: 'Il materiale del corso lo chiama "effetto pendolo": l\'oscillazione porta a urti contro ostacoli. Lavorare il più possibile in verticale sotto l\'ancoraggio; casco con sottogola.' },
  { id: 'traverso', q: 'Il connettore è agganciato al corrente del parapetto e lavora di traverso.', o: ['Va bene, il corrente è robusto', 'Il connettore regge solo lungo l\'asse maggiore e il corrente non è un punto di ancoraggio previsto dal PiMUS', 'Va bene se il moschettone è d\'acciaio'], a: 1, e: 'EN 362: la resistenza dichiarata vale sull\'asse maggiore, a leva chiusa. Gli ancoraggi sono quelli previsti dal PiMUS/libretto (art. 115 c.2: parti stabili).' },
  { id: 'nodo', q: 'Il cordino è troppo lungo: lo accorcia facendoci un nodo.', o: ['È un trucco furbo e sicuro', 'Il nodo riduce molto la resistenza e può interferire con l\'assorbitore: si usa un cordino della lunghezza giusta o regolabile', 'Va bene se il nodo è stretto'], a: 1, e: 'Le istruzioni dei fabbricanti vietano nodi sui cordini: riducono il carico di rottura. Scegli un cordino più corto o regolabile certificato.' },
  { id: 'laterale', q: 'Il cordino anticaduta è agganciato all\'anello laterale della cintura.', o: ['Va bene: è più comodo', 'Gli anelli laterali servono al posizionamento, non all\'arresto caduta: si usa l\'attacco "A" dorsale o sternale', 'Va bene solo per cadute brevi'], a: 1, e: 'Il cordino si collega solo agli attacchi previsti per l\'arresto caduta (marcati "A", EN 361), come ricorda il materiale del corso.' },
  { id: 'massa', q: 'Lavoratore di 95 kg con 25 kg di attrezzi, assorbitore provato a 100 kg.', o: ['Nessun problema: conta solo il peso del corpo', 'Massa totale 120 kg oltre quella certificata: più allungamento, più tirante; serve un DPI certificato per 120–140 kg', 'Basta togliere il casco'], a: 1, e: 'L\'EN 355 prova con 100 kg. Oltre, l\'assorbitore si apre di più. Si conta la massa totale: persona, vestiti, attrezzi.' }
];

/* ---------- logica ---------- */
Object.assign(HOOKS, {
  tasim() {
    let p = Object.assign({}, TA_PRESET[0].p), raf = null;
    const ids = { Hp: 'tHp', ha: 'tHa', A: 'tA2', B: 'tB2', Hr: 'tHr', F: 'tF' };
    const haTxt = h => h <= -0.2 ? '(sotto i piedi!)' : h < 0.3 ? '(ai piedi)' : h < 1.2 ? '(alla cintura)' : h < 1.7 ? '(alle spalle)' : '(sopra la testa)';
    const setUI = () => { $('tDev').value = p.dev; Object.entries(ids).forEach(([k, id]) => $(id).value = p[k]); };
    const draw = (t = 0) => { $('tScene').innerHTML = taScene(p, t); };
    const res = () => {
      const r = taCalc(p);
      document.querySelectorAll('.cOnly').forEach(e => e.style.display = p.dev === 'cord' ? '' : 'none'); document.querySelectorAll('.rOnly').forEach(e => e.style.display = p.dev === 'retr' ? '' : 'none');
      $('vHp').textContent = fm(p.Hp); $('vHa').textContent = (p.ha >= 0 ? '+' : '') + fm(p.ha); $('vHaT').textContent = haTxt(p.ha); $('vA').textContent = fm(p.A); $('vB').textContent = fm(p.B); $('vHr').textContent = fm(p.Hr, 1); $('vF').textContent = fm(p.F, 1);
      const fcCls = r.Fc === null ? '' : r.Fc <= 1 ? 'g' : r.Fc <= 2 ? 'y' : 'r';
      const tips = [];
      if (!r.ok) tips.push(`Mancano <b>${fm(r.gap)}</b>: alza l'ancoraggio, accorcia il cordino, usa un assorbitore a bassa apertura o un retrattile; meglio ancora una <b>protezione collettiva</b>.`);
      if (r.Fc !== null && r.Fc > 2) tips.push('Fattore di caduta oltre 2: <b>fuori dai limiti</b> del sistema. Mai agganciarsi sotto i piedi con un cordino.');
      else if (r.Fc !== null && r.Fc > 1) tips.push('Fattore di caduta alto: strappo forte. Aggancia <b>più in alto</b> (sopra la testa → Fc vicino a 0).');
      if (p.dev === 'cord' && r.retention) tips.push('Il cordino è già teso: se non arrivi al bordo sei in <b>trattenuta</b>, la soluzione migliore.');
      if (p.dev === 'retr' && r.low) tips.push('Retrattile ancorato sotto l\'attacco dorsale: ammesso solo se il manuale lo consente (uso orizzontale/bordo) e con il tirante indicato dal fabbricante.');
      if (p.F > 0) tips.push('Linea vita flessibile: la freccia (dal manuale) si somma al tirante e cresce con la distanza tra gli appoggi.');
      $('tRes').innerHTML = `<div class="tcards">
        <div class="tc ${r.ok ? 'g' : 'r'}"><span>${fm(r.need)}</span><small>spazio necessario sotto i piedi</small></div>
        <div class="tc"><span>${fm(p.Hp)}</span><small>spazio disponibile</small></div>
        <div class="tc"><span>${fm(r.TA)}</span><small>tirante d'aria sotto l'ancoraggio</small></div>
        <div class="tc"><span>${fm(r.FF)}</span><small>caduta libera${p.dev === 'retr' ? ' (stima)' : ''}</small></div>
        <div class="tc ${fcCls}"><span>${r.Fc === null ? '—' : fn2(r.Fc)}</span><small>fattore di caduta (max 2)</small></div>
        <div class="tc"><span>${Math.round(r.v)} km/h</span><small>velocità a fine caduta libera</small></div></div>
        <div class="lres ${r.ok ? 'go' : 'nogo'}"><b>${r.ok ? '✔ IDONEO: il sistema ti ferma prima del suolo/ostacolo' : '✘ NON IDONEO: tocchi il suolo o l\'ostacolo prima dell\'arresto'}</b>${tips.length ? '<ul>' + tips.map(x => '<li>' + x + '</li>').join('') + '</ul>' : ''}</div>`;
      cancelAnimationFrame(raf); draw(0);
    };
    $('tDev').onchange = () => { p.dev = $('tDev').value; res(); };
    Object.entries(ids).forEach(([k, id]) => $(id).oninput = () => { p[k] = +$(id).value; res(); });
    document.querySelectorAll('.presets .chip').forEach(b => b.onclick = () => { p = Object.assign({}, TA_PRESET[+b.dataset.p].p); document.querySelectorAll('.presets .chip').forEach(x => x.classList.toggle('on', x === b)); setUI(); res(); });
    $('tPlay').onclick = () => { cancelAnimationFrame(raf); const r = taCalc(p); const dur = 900 + Math.min(4000, Math.sqrt(2 * Math.max(.3, r.drop) / G) * 3000); const t0 = performance.now();
      const step = now => { const t = Math.min(1, (now - t0) / dur); if (!document.getElementById('tScene')) return; draw(t); if (t < 1) raf = requestAnimationFrame(step); else toast(r.ok ? '✔ Arrestato prima del suolo' : '💥 Impatto prima dell\'arresto'); }; raf = requestAnimationFrame(step); };
    $('tReset').onclick = () => { cancelAnimationFrame(raf); draw(0); };
    document.querySelector('.presets .chip').classList.add('on'); setUI(); res();
  },
  taec() {
    let cur = 0; const done = {};
    const tabs = () => { $('ecTabs').innerHTML = EC.map((e, i) => `<button class="chip ${i === cur ? 'on' : ''} ${done[i] ? (done[i] === 'ok' ? 'dok' : 'dko') : ''}" data-i="${i}">${e.t}</button>`).join('');
      document.querySelectorAll('#ecTabs .chip').forEach(b => b.onclick = () => { cur = +b.dataset.i; show(); }); };
    const show = () => { const e = EC[cur]; tabs();
      $('ecBox').innerHTML = `<div class="sheet"><div class="sh-h">SCHEDA DI VERIFICA DEL TIRANTE D'ARIA · allegata al PiMUS</div><p class="sh-c">${e.ctx}</p><ol>${e.rows.map((r, i) => `<li data-i="${i}">${r}</li>`).join('')}</ol><div class="sh-x" id="ecX"></div></div>`;
      document.querySelectorAll('.sheet li').forEach(li => li.onclick = () => { if (done[cur] === 'ok') return; const i = +li.dataset.i;
        if (i === e.bad) { li.className = 'bad'; $('ecX').innerHTML = `<b style="color:var(--ok)">✔ Trovato!</b> ${e.why}`; if (!done[cur]) done[cur] = 'ok'; else done[cur] = 'ok'; }
        else { li.className = 'fine'; $('ecX').innerHTML = '✘ Questa riga è corretta. Cerca ancora.'; if (!done[cur]) done[cur] = 'ko'; }
        tabs(); const ok = Object.values(done).filter(v => v === 'ok').length; $('ecScore').textContent = `Schede risolte: ${ok} / ${EC.length}`; }); };
    show();
  },
  taeg() {
    let n = 0, g = 0;
    $('egBox').innerHTML = EG.map((c, i) => `<div class="egc" id="eg${i}">${miniScene(c.id)}<p class="eq">${c.q}</p>${c.o.map((o, j) => [o, j]).sort(() => Math.random() - .5).map(([o, j]) => `<button class="eo" data-j="${j}">${o}</button>`).join('')}<p class="ex2">${c.e}</p></div>`).join('');
    EG.forEach((c, i) => document.querySelectorAll(`#eg${i} .eo`).forEach(b => b.onclick = () => { const el = $('eg' + i); if (el.classList.contains('done')) return;
      const ok = +b.dataset.j === c.a; el.classList.add('done', ok ? 'right' : 'wrong'); b.classList.add(ok ? 'sel-ok' : 'sel-ko'); el.querySelector(`.eo[data-j="${c.a}"]`).classList.add('sel-ok');
      n++; if (ok) g++; $('egScore').textContent = `Risposte giuste: ${g} / ${n}` + (n === EG.length ? (g >= 6 ? ' – ottimo!' : ' – rivediamo insieme i casi.') : ''); }));
  }
});

/* ---------- integrazione nel corso ---------- */
MODULES[6].t = 'DPI e tirante d\'aria';
MODULES[6].s = [{ fn: S.dpi }, { fn: S.controllo, after: 'dpick' }, { fn: TA.concetto }, { fn: TA.norme }, { fn: TA.sim, after: 'tasim' }, { fn: TA.casi },
  { fn: TA.errcalc, after: 'taec' }, { fn: TA.errcasi, after: 'taeg' }, { fn: COMICS.aggancio, comic: true }];
// scaletta: il modulo DPI passa a 22 minuti, il totale resta 120
[[0, 6], [1, 10], [3, 8], [4, 10], [5, 16], [6, 22], [10, 10]].forEach(([i, m]) => AGENDA[i][2] = m);
QUIZ.splice(11, 0,
  { q: 'Cosa indica il fattore di caduta Fc?', o: ['Il peso del lavoratore diviso 100', 'Il rapporto tra altezza di caduta libera e lunghezza del cordino: il massimo ammesso è 2', 'Il numero di cadute che un cordino può sopportare'], a: 1, e: 'Fc = H / L. Con ancoraggio ai piedi e cordino 2 m si cade liberi per circa 3,5 m (Fc ≈ 1,75); con ancoraggio sopra la testa Fc si avvicina a 0.' },
  { q: 'Lo spazio disponibile per il tirante d\'aria si misura...', o: ['sempre fino al suolo', 'fino al primo ostacolo sotto di te: impalcato inferiore, mantovana, balcone, mezzo parcheggiato', 'dal casco al cordino'], a: 1, e: 'Lo spazio libero di caduta è la distanza dal punto di caduta al punto dove si può urtare: il primo ostacolo, non per forza il suolo.' });
