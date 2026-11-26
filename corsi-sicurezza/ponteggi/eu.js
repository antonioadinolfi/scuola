/* ============================================================
   QUADRO EUROPEO: direttive, norme EN, confronto Italia-EN,
   simulatore classi EN 13374
   ============================================================ */
const EU = {
  direttive: () => `<div class="kick">Le regole del gioco · Europa</div><h2>Dall'Europa all'Italia: da dove vengono le nostre regole</h2>
   <div class="eumap">
    <div class="eu-col"><div class="eu-h">🇪🇺 Direttive europee</div>
     <div class="eu-b"><b>89/391/CEE</b> direttiva quadro: valutare i rischi, prevenire, formare</div>
     <div class="eu-b hl"><b>2009/104/CE · Allegato II p. 4</b> attrezzature per lavori temporanei in quota, <b>ponteggi</b> compresi (ex 2001/45/CE)</div>
     <div class="eu-b"><b>92/57/CEE</b> cantieri temporanei o mobili</div>
     <div class="eu-b"><b>89/656/CEE</b> uso dei DPI · <b>Reg. (UE) 2016/425</b> requisiti dei DPI</div>
     <div class="eu-b"><b>92/58/CEE</b> segnaletica di sicurezza</div></div>
    <div class="eu-arr">➜<small>recepite in</small></div>
    <div class="eu-col"><div class="eu-h">🇮🇹 D.Lgs. 81/2008</div>
     <div class="eu-b">Titolo I · principi, artt. 15, 28, 36, 37</div>
     <div class="eu-b hl">Titolo IV Capo II · artt. 105–138 e Allegati XVIII, XIX, XXI, XXII</div>
     <div class="eu-b">Titolo IV Capo I · PSC, POS, coordinatori</div>
     <div class="eu-b">Titolo III Capo II · artt. 74–79 DPI</div>
     <div class="eu-b">Titolo V · segnaletica</div></div></div>
   <h3 style="margin-top:14px">Cosa chiede la direttiva per i ponteggi, e come l'ha tradotto l'Italia</h3>
   <table class="eutab"><tr><th>Direttiva 2009/104/CE, All. II p. 4.3</th><th>In Italia</th></tr>
    <tr><td>Calcolo di resistenza e stabilità, salvo configurazioni tipo riconosciute</td><td><b>Schemi tipo</b> del libretto o <b>progetto</b> firmato (art. 133)</td></tr>
    <tr><td>Piano di montaggio, uso e smontaggio redatto da persona competente</td><td><b>PiMUS</b> (art. 136, All. XXII)</td></tr>
    <tr><td>Montaggio sotto la direzione di persona competente, da lavoratori con formazione specifica</td><td>Sorveglianza del <b>preposto</b> (art. 136 c.6) e corso <b>All. XXI</b> (28 h)</td></tr>
    <tr><td>Formazione su: piano, sicurezza nel montaggio, cadute di persone e oggetti, meteo, carichi ammessi, altri rischi</td><td>Moduli giuridico, tecnico e pratico dell'<b>All. XXI</b></td></tr>
    <tr><td>Ispezioni da persona competente dopo il montaggio, periodiche e dopo eventi eccezionali</td><td>Verifiche <b>All. XIX</b> e <b>art. 137</b></td></tr></table>
   ${easy('Le regole italiane sui ponteggi non sono "un\'invenzione italiana": vengono da una direttiva europea valida in tutti i Paesi UE. Chi ha lavorato in Romania, Francia o Germania ha regole con la stessa base.')}`,

  norme: () => `<div class="kick">Norme tecniche europee</div><h2>Le norme EN dei ponteggi (situazione 2026)</h2>
   <div class="cols" style="grid-template-columns:.85fr 1.35fr"><div><table class="eutab"><tr><th>Norma</th><th>Di cosa parla</th><th>Edizione</th></tr>
    <tr><td><b>EN 12810-1/-2</b></td><td>Ponteggi di facciata prefabbricati: prodotto e calcolo</td><td>2003 (UNI 2004)</td></tr>
    <tr><td><b>EN 12811-1</b></td><td>Requisiti prestazionali e progettazione: classi di carico, larghezze, protezioni laterali</td><td>2003<br><small>confermata 2024</small></td></tr>
    <tr><td><b>EN 12811-2/-3</b></td><td>Materiali · prove di carico</td><td>2004 · 2002</td></tr>
    <tr><td><b>EN 74-1/-2/-3</b></td><td>Giunti, spinotti, basette</td><td>74-1:2022<br>+A1:2025</td></tr>
    <tr><td><b>EN 13374</b></td><td>Parapetti provvisori, classi A, B, C</td><td>2025</td></tr>
    <tr><td><b>EN 1004-1</b></td><td>Trabattelli (non sono ponteggi fissi)</td><td>2021</td></tr></table>
    <p class="small">${ref('Le norme EN 12810/12811 sono il riferimento tecnico per l\'autorizzazione ministeriale (art. 131 c.3).')}</p></div>
    <div><h3>Italia e norme EN: dove sono diverse</h3>
     <table class="eutab cmp"><tr><th>Aspetto</th><th class="it">Legge italiana</th><th class="en">Norme tecniche EN</th><th>In cantiere</th></tr>
      <tr><td><b>Altezza del parapetto</b></td><td class="it"><b>almeno 95 cm</b><br><small>art. 138 (ponteggi metallici)</small></td><td class="en"><b>almeno 1 m</b><br><small>EN 13374, EN 12811-1</small></td><td>quella del <b>libretto</b>, mai sotto 95 cm</td></tr>
      <tr><td><b>Carico sugli impalcati</b></td><td class="it"><b>2 valori</b><br><small>1,5 kN/m² manutenzione · 3,0 kN/m² costruzione (circolari MLPS)</small></td><td class="en"><b>6 classi</b><br><small>dalla classe 1 (0,75 kN/m²) alla classe 6</small></td><td>il carico ammesso scritto nel <b>libretto/PiMUS</b></td></tr>
      <tr><td><b>Chi approva il ponteggio</b></td><td class="it"><b>Ministero del Lavoro</b><br><small>autorizzazione, art. 131, rinnovo ogni 10 anni</small></td><td class="en"><b>nessuna marcatura CE</b><br><small>ogni Paese ha il proprio sistema</small></td><td>copia dell'<b>autorizzazione</b> in cantiere</td></tr>
      <tr><td><b>Tavola fermapiede</b></td><td class="it"><b>almeno 15 cm</b><br><small>Allegato XVIII</small></td><td class="en"><b>almeno 15 cm</b><br><small>EN 13374</small></td><td>uguale: <b>15 cm</b></td></tr></table>
     <div class="warn" style="margin-top:8px">In cantiere vale la regola <b>più severa</b> tra legge e libretto: un ponteggio autorizzato con parapetto da 1 m va montato a 1 m.</div></div></div>`,

  classi: () => `<div class="kick">Simulazione · EN 13374</div><h2>Quale parapetto provvisorio serve? Classi A, B e C</h2>
   <div class="cols"><div class="ctrl">
    <label>Inclinazione della superficie di lavoro (tetto, falda): <b id="cIv"></b><input type="range" id="cI" min="0" max="75" step="1" value="20"></label>
    <label>Altezza di caduta lungo la falda fino al parapetto: <b id="cHv"></b><input type="range" id="cH" min="0.5" max="10" step="0.5" value="3"></label>
    <div id="cOut" class="lres"></div>
    <table class="eutab"><tr><th>Classe</th><th>Resiste a</th><th>Si usa fino a</th></tr>
     <tr><td><b>A</b></td><td>carichi statici (ci si appoggia)</td><td>10°</td></tr>
     <tr><td><b>B</b></td><td>statici e basse forze dinamiche</td><td>30° · oppure 60° se la caduta ≤ 2 m</td></tr>
     <tr><td><b>C</b></td><td>elevate forze dinamiche (scivolamento lungo la falda)</td><td>45° · oppure 60° se la caduta ≤ 5 m</td></tr></table></div>
    <div><svg viewBox="0 0 460 340" id="cSvg" class="csvg"></svg>
     <p class="small">${ref('UNI EN 13374, classi per l\'uso a diverse inclinazioni e altezze di caduta. Oltre 60°, o oltre 45° con caduta > 5 m, i parapetti non bastano: servono altre misure (ponteggio, reti, sistemi anticaduta).')}</p></div></div>`
};

HOOKS.classi = () => {
  const cls = (a, h) => a <= 10 ? 'A' : a <= 30 ? 'B' : (a <= 60 && h <= 2) ? 'B' : a <= 45 ? 'C' : (a <= 60 && h <= 5) ? 'C' : null;
  const col = { A: '#43a047', B: '#fb8c00', C: '#e53935' };
  const upd = () => { const a = +$('cI').value, h = +$('cH').value, c = cls(a, h);
    $('cIv').textContent = a + '°'; $('cHv').textContent = String(h).replace('.', ',') + ' m';
    $('cOut').className = 'lres ' + (c ? 'go' : 'nogo');
    $('cOut').innerHTML = c ? `Serve almeno un parapetto di <b style="color:${col[c]}">classe ${c}</b>${c !== 'A' ? ' (una classe superiore va sempre bene)' : ''}.` : '<b style="color:var(--ko)">Nessun parapetto provvisorio è adeguato.</b> Serve un\'altra protezione: ponteggio perimetrale, reti, sistemi di arresto caduta.';
    const r = a * Math.PI / 180, L = 230, x0 = 60, y0 = 300, x1 = x0 + L * Math.cos(r), y1 = y0 - L * Math.sin(r);
    let g = `<rect width="460" height="340" fill="#eaf4fb" rx="8"/><rect x="0" y="300" width="460" height="40" fill="#cdb48c"/>
      <polygon points="${x0},${y0} ${x1},${y1} ${x1},${y0}" fill="#bf6f4b" stroke="#8d4b30" stroke-width="2"/>
      <path d="M${x0 + 40},${y0} A40,40 0 0 0 ${x0 + 40 * Math.cos(r)},${y0 - 40 * Math.sin(r)}" fill="none" stroke="#263238" stroke-width="2"/><text x="${x0 + 48}" y="${y0 - 8}" font-size="16" font-weight="700">${a}°</text>`;
    // parapetto in gronda (a valle)
    g += `<g stroke="${c ? col[c] : '#9e9e9e'}" stroke-width="5"><line x1="${x0 - 6}" y1="${y0}" x2="${x0 - 6}" y2="${y0 - 60}"/><line x1="${x0 - 6}" y1="${y0 - 58}" x2="${x0 + 30}" y2="${y0 - 58}"/><line x1="${x0 - 6}" y1="${y0 - 30}" x2="${x0 + 30}" y2="${y0 - 30}"/></g>`;
    if (c) g += `<circle cx="${x0 - 6}" cy="${y0 - 82}" r="18" fill="${col[c]}"/><text x="${x0 - 6}" y="${y0 - 76}" font-size="18" font-weight="700" fill="#fff" text-anchor="middle">${c}</text>`;
    else g += `<text x="${x0 - 10}" y="${y0 - 76}" font-size="28" fill="#c62828" font-weight="700">✘</text>`;
    // lavoratore sulla falda
    const t = .7, wx = x0 + L * t * Math.cos(r), wy = y0 - L * t * Math.sin(r);
    g += `<g transform="translate(${wx},${wy})">${worker(0, 0, { s: .5, mood: a > 45 ? 'shock' : 'worried', arm: a > 30 ? 'both' : 'down' })}</g>`;
    g += `<path d="M${wx - 20},${wy + 6} L${x0 + 20},${y0 - 20}" stroke="#c62828" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar)"/><defs><marker id="ar" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8z" fill="#c62828"/></marker></defs>
      <text x="300" y="30" font-size="14" fill="#37474f">caduta lungo la falda: ${String(h).replace('.', ',')} m</text>`;
    $('cSvg').innerHTML = g; };
  $('cI').oninput = upd; $('cH').oninput = upd; upd();
};

/* integrazione: modulo 1 (regole) e modulo 4 (pezzo per pezzo) */
(() => {
  const m1 = MODULES[1]; m1.s.splice(m1.s.findIndex(x => x.fn === S.leggi) + 1, 0, { fn: EU.direttive });
  const m4 = MODULES[4]; m4.s.splice(m4.s.findIndex(x => x.fn === S.numeri) + 1, 0, { fn: EU.norme }, { fn: EU.classi, after: 'classi' });
  [[1, 12], [4, 14], [7, 12], [9, 4], [10, 8]].forEach(([i, mnt]) => AGENDA[i][2] = mnt);
  QUIZ.push(
    { q: 'Da dove derivano il PiMUS e la formazione specifica degli addetti ai ponteggi?', o: ['Sono un\'invenzione solo italiana', 'Dalla direttiva europea sulle attrezzature di lavoro (2009/104/CE, ex 2001/45/CE), recepita nel D.Lgs. 81/2008', 'Dal regolamento europeo sui DPI'], a: 1, e: 'La direttiva chiede piano di montaggio, persona competente, formazione specifica e ispezioni: in Italia sono PiMUS, preposto, Allegato XXI e Allegato XIX.' },
    { q: 'Devi proteggere il bordo di un tetto inclinato di 35° con caduta lungo la falda di 4 m. Quale parapetto provvisorio EN 13374?', o: ['Classe A', 'Classe B', 'Classe C'], a: 2, e: 'Classe C: fino a 45° senza limiti di altezza di caduta. La B arriva a 30° (o a 60° solo con caduta fino a 2 m).' });
})();
