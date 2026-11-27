/* ============================================================
   DPI IN PRATICA, CASI DI ERRORE LEGGIBILI, ADDESTRAMENTO PRATICO,
   CHIUSURA e NUOVO ORDINE DEI MODULI
   ============================================================ */
CRED.push(
  { f: 'dpi_indossare', title: 'Fall protection symposium, July 8-9, 2014', creator: 'Western Area Power Admin', lic: 'by', ver: '2.0', url: 'https://www.flickr.com/photos/86561000@N05/14769629885' },
  { f: 'dpi_regolare', title: 'Fall protection symposium, July 8-9, 2014', creator: 'Western Area Power Admin', lic: 'by', ver: '2.0', url: 'https://www.flickr.com/photos/86561000@N05/14582987269' },
  { f: 'dpi_retrattili', title: 'Fall arrest device EN360', creator: 'zastita.net', lic: 'by-sa', ver: '2.0', url: 'https://openverse.org/image/7f642b3d-0482-46a7-ad2f-4384fde01ccb' },
  { f: 'dpi_casco', title: 'Construction Helmet (Orange)', creator: 'SuperMopsek', lic: 'by', ver: '4.0', url: 'https://sketchfab.com/3d-models/2f9546f0aa9e4dbdade316e1b9d59f04' }
);
const CCa = (a, l = 'CC BY 2.0') => `Foto ${a} · ${l} (vedi crediti)`;

/* ---------- figura con imbracatura che si "costruisce" passo per passo ---------- */
function harnessFig(step, o = {}) {
  const loose = o.loose || 0, ring = o.ring ?? 0;          // loose 0..1, ring -1 basso, 0 giusto, 1 alto
  const show = n => step >= n ? 1 : 0.08, col = '#1565c0';
  const legY = 300 + loose * 26, ry = 140 + ring * 38;
  return `<svg viewBox="0 0 300 430" class="hfig"><rect width="300" height="430" rx="10" fill="#f5f8fb"/>
   <circle cx="150" cy="62" r="34" fill="#f3c9a8"/><path d="M118,52 q32,-40 64,0 z" fill="#ffca28"/><rect x="112" y="50" width="76" height="8" rx="4" fill="#f9a825"/>
   <circle cx="138" cy="66" r="3.5"/><circle cx="162" cy="66" r="3.5"/><path d="M140,82 q10,7 20,0" stroke="#5d4037" stroke-width="2.5" fill="none"/>
   <rect x="104" y="100" width="92" height="150" rx="22" fill="#ff8c1a"/><rect x="104" y="160" width="92" height="10" fill="#fff59d" opacity=".8"/>
   <path d="M104,110 q-24,70 -6,128 M196,110 q24,70 6,128" stroke="#ff8c1a" stroke-width="22" fill="none" stroke-linecap="round"/>
   <rect x="110" y="250" width="36" height="150" rx="14" fill="#37474f"/><rect x="154" y="250" width="36" height="150" rx="14" fill="#37474f"/>
   <rect x="106" y="398" width="42" height="18" rx="6" fill="#4e342e"/><rect x="152" y="398" width="42" height="18" rx="6" fill="#4e342e"/>
   <g opacity="${show(3)}"><path d="M126,104 L130,250 M174,104 L170,250" stroke="${col}" stroke-width="9" stroke-linecap="round"/></g>
   <g opacity="${show(4)}"><rect x="104" y="${legY}" width="46" height="12" rx="5" fill="${col}"/><rect x="150" y="${legY}" width="46" height="12" rx="5" fill="${col}"/><path d="M130,250 L128,${legY} M170,250 L172,${legY}" stroke="${col}" stroke-width="8"/></g>
   <g opacity="${show(5)}"><rect x="118" y="150" width="64" height="10" rx="4" fill="${col}"/><rect x="142" y="146" width="16" height="18" rx="3" fill="#90a4ae" stroke="#455a64"/></g>
   <g opacity="${show(2)}"><circle cx="150" cy="${ry}" r="9" fill="#ffca28" stroke="#333" stroke-width="2.5"/><text x="166" y="${ry + 4}" font-size="12" font-weight="700" fill="#333">A</text></g>
   ${step >= 6 ? `<g><rect x="${110}" y="${legY + 14}" width="30" height="${10 + loose * 26}" rx="4" fill="#fff" stroke="#2e7d32" stroke-width="2"/><text x="64" y="${legY + 30}" font-size="11" fill="#2e7d32" font-weight="700">mano</text></g>` : ''}
   ${step >= 1 && step < 3 ? `<g transform="translate(220,120)"><rect width="66" height="44" rx="4" fill="#fff" stroke="#455a64"/><text x="33" y="16" font-size="9" text-anchor="middle">EN 361</text><text x="33" y="28" font-size="8" text-anchor="middle">lotto · data</text><text x="33" y="39" font-size="8" text-anchor="middle">ispez. 2026</text></g>` : ''}
  </svg>`;
}
const HSTEP = [
  ['Controlla', 'Etichetta leggibile, data dell\'ultima ispezione, cinghie e cuciture integre, fibbie che funzionano.'],
  ['Prendila dall\'anello dorsale', 'Tienila per l\'anello "A" sulla schiena e scuotila: le cinghie cadono al loro posto, senza nodi o torsioni.'],
  ['Infila le spalline', 'Come un giubbotto. Le cinghie non devono essere attorcigliate.'],
  ['Chiudi i cosciali', 'Una cinghia per gamba, senza incrociarle. Prima le fibbie, poi la regolazione.'],
  ['Chiudi la cinghia sul petto', 'All\'altezza del petto, non sulla pancia e non sul collo.'],
  ['Regola e prova', 'Sotto i cosciali deve entrare una mano piatta, non un pugno. L\'anello dorsale sta tra le scapole. Le estremità delle cinghie vanno nei passanti.']
];
const SYS = [
  ['Sul tetto piano lavori a 3 m dal bordo con un cordino che non ti fa arrivare al bordo.', 0, 'Trattenuta: il cordino è corto e non arrivi al vuoto. È la soluzione migliore: non cadi proprio.'],
  ['Monti il 2° impalcato: sotto di te il parapetto non c\'è ancora.', 2, 'Arresto caduta: imbracatura + retrattile o cordino con assorbitore, punto di ancoraggio dal PiMUS, tirante d\'aria verificato.'],
  ['Lavori sull\'impalcato con parapetti, fermapiede e botola chiusa.', 3, 'Nessun DPI anticaduta: ti protegge già il parapetto (protezione collettiva). Casco e scarpe sì.'],
  ['Devi stare inclinato su un palo con le mani libere, appoggiato alla cintura.', 1, 'Posizionamento: cintura e cordino di posizionamento ti tengono in posizione, ma non fermano una caduta: serve anche un sistema di arresto.'],
  ['Togli un parapetto per far passare un pezzo lungo.', 2, 'Arresto caduta finché il parapetto non viene rimesso: ti agganci prima di toglierlo.']
];
const SYSL = ['Trattenuta', 'Posizionamento', 'Arresto caduta', 'Basta il parapetto'];

const D2 = {
  kit: () => `<div class="kick">I DPI dal vivo</div><h2>Vediamoli da vicino</h2>
   <div class="cols4">${[['dpi_indossare', 'Si prova l\'imbracatura con un collega che controlla', CCa('Western Area Power Admin')], ['dpi_regolare', 'Regolare spalline e cosciali: va fatto ogni volta', CCa('Western Area Power Admin')],
      ['dpi_retrattili', 'Dispositivi retrattili EN 360: si accorciano da soli e bloccano la caduta', CCa('zastita.net', 'CC BY-SA 2.0')], ['dpi_casco', 'Casco: in quota con il <b>sottogola</b> allacciato', CCa('SuperMopsek', 'CC BY 4.0')]].map(x => fig(x[0], x[1], x[2])).join('')}</div>`,

  indossa: () => `<div class="kick">Usare i DPI · 1</div><h2>Indossare l'imbracatura in 6 mosse</h2>
   <div class="cols" style="grid-template-columns:.8fr 1.2fr"><div id="hfWrap"></div>
   <div><div class="hsteps" id="hSteps">${HSTEP.map((s, i) => `<button class="hst" data-i="${i}"><b>${i + 1}</b><span>${s[0]}</span></button>`).join('')}</div>
    <div class="hdesc" id="hDesc"></div>
    <div class="qbar" style="position:static"><button class="btn sec" id="hP">← prima</button><button class="btn" id="hN">dopo →</button></div></div></div>`,

  regola: () => `<div class="kick">Usare i DPI · 2 · simulazione</div><h2>Regolata bene? Prova tu</h2>
   <div class="cols" style="grid-template-columns:.8fr 1.2fr"><div id="rgWrap"></div>
   <div class="ctrl"><label>Cosciali: <b id="rgLv"></b><input type="range" id="rgL" min="0" max="100" value="70"></label>
    <label>Anello dorsale: <b id="rgRv"></b><input type="range" id="rgR" min="-1" max="1" step="1" value="1"></label>
    <div id="rgOut" class="lres big"></div></div></div>`,

  sistema: () => `<div class="kick">Usare i DPI · 3</div><h2>Quale protezione serve? Scegli</h2>
   <div class="sysg" id="sysG">${SYS.map((s, i) => `<div class="sysc" id="sy${i}"><p class="sq">${s[0]}</p><div class="sb">${SYSL.map((l, j) => `<button data-j="${j}">${l}</button>`).join('')}</div><p class="sx">${s[2]}</p></div>`).join('')}</div>
   <div id="sysScore" class="score"></div>`,

  err: (from, tot) => () => `<div class="kick">Tirante d'aria · casi di errore (${from / 2 + 1}/4)</div><h2>Cosa c'è di sbagliato?</h2><div class="eg eg3" id="egBox" data-from="${from}" data-n="2"></div><div id="egScore" class="score"></div>`
};

COMICS.casco = () => strip({
  title: 'Il sottogola? Mi dà fastidio',
  panels: [
    panel(sky() + ground() + scaf(60, 220, { nb: 3, nl: 2, bw: 90 }) + worker(180, 92, { mood: 'smug', s: .8, arm: 'point' }),
      [{ x: 40, y: 3, w: 58, txt: 'Il sottogola mi stringe. Tanto il casco sta su da solo!', t: 'bl' }]),
    panel(sky('#fde8e6') + ground() + scaf(60, 220, { nb: 3, nl: 2, bw: 90 }) + `<g class="tumble">${worker(200, 100, { mood: 'shock', s: .8, arm: 'both', helmet: false })}</g>` + `<g class="fly"><path d="M250,40 q20,-26 40,0 z" fill="#ffca28" stroke="#c49000" stroke-width="2"/></g>` + burst(320, 40, 26, 'BONK!'),
      [{ x: 2, y: 3, w: 40, txt: 'Il casco... dov\'è?!', t: 'br', shout: true }]),
    panel(sky() + ground() + worker(120, 220, { mood: 'happy', arm: 'point' }) + `<circle cx="120" cy="-6" r="0"/><path d="M106,-24 q14,30 28,0" stroke="#5d4037" stroke-width="3" fill="none"/>` + worker(300, 220, Object.assign({ flip: true, arm: 'point' }, BOSS)),
      [{ x: 40, y: 3, w: 58, txt: 'In quota il casco si allaccia: se cadi, deve restare in testa quando sbatti.', t: 'bl' }])
  ],
  moral: 'Sul ponteggio il <b>sottogola</b> si allaccia sempre: in una caduta arrestata si sbatte contro montanti e tavole. Un casco che vola via non protegge nessuno.'
});

/* ---------- addestramento pratico ---------- */
const POST = [
  ['🦺', 'DPI: controllo e vestizione', 20, 'Controllare imbracatura, cordino, retrattile e connettori; indossare e regolare; controllo incrociato con il collega.', ['Controlla etichetta, cinghie, cuciture, indicatore di caduta', 'Indossa senza torsioni, cosciali non incrociati', 'Mano piatta sotto i cosciali, anello tra le scapole', 'Connettori con ghiera chiusa e bloccata']],
  ['📐', 'Tracciamento e prima campata', 25, 'Leggere il disegno del PiMUS, posare ripartitori e basette, montare i primi telai in bolla.', ['Ripartitori sotto ogni basetta', 'Telai a piombo e in bolla', 'Distanza dal muro ≤ 20 cm', 'Diagonali e correnti al loro posto']],
  ['🏗️', 'Montaggio fino al 2° impalcato', 40, 'Seguire le fasi del PiMUS: retrattile su traverso al 1° piano, sul montante dal 2°, passamano.', ['Si aggancia sulla scala, prima di salire', 'Ordine: telai, spine, telaio-parapetto, testata, fermapiede', 'Ancoraggi man mano che si sale', 'Botola chiusa dopo il passaggio']],
  ['🔩', 'Ancoraggi', 20, 'Realizzare ancoraggi ad anello e a cravatta come da libretto; riconoscere gli ancoraggi vietati.', ['Tipo e posizione come da libretto/PiMUS', 'Serraggio dei giunti con la chiave', 'Nessun ancoraggio a ringhiere o pluviali', 'Spiega quando si può togliere']],
  ['⬇️', 'Smontaggio e calo', 25, 'Smontare dall\'alto un piano alla volta e calare gli elementi con carrucola o passamano.', ['Ordine inverso del montaggio', 'Ancoraggi tolti solo al proprio piano', 'Nessun elemento lanciato', 'Area sotto delimitata']],
  ['🚑', 'Recupero di un collega appeso', 20, 'Simulare il recupero di un manichino in sospensione con il kit del piano di emergenza.', ['Allarme e chiamata al 112 simulata', 'Il soccorritore si aggancia prima di intervenire', 'Recupero entro il tempo del piano', 'Persona a terra sdraiata, primo soccorso']]
];
D2.pratica1 = () => `<div class="kick">Addestramento pratico · 1</div><h2>Dalla teoria al campo prova: 6 postazioni</h2>
  <div class="post6">${POST.map((p, i) => `<div><span>${p[0]}</span><b>${i + 1}. ${p[1]}</b><p>${p[3]}</p><em>${p[2]} min</em></div>`).join('')}</div>`;
D2.pratica2 = () => `<div class="kick">Addestramento pratico · 2</div><h2>Le regole del campo prova</h2>
  <div class="nov4" style="grid-template-columns:repeat(3,1fr)">
   <div><span>🚧</span><b>Area chiusa</b><p>Campo prova recintato, nessuno sotto chi lavora in quota.</p></div>
   <div><span>👥</span><b>1 docente ogni 5</b><p>Nella pratica un istruttore segue al massimo 5 allievi.</p></div>
   <div><span>📗</span><b>Ponteggio con PiMUS</b><p>Anche quello di prova ha libretto, PiMUS e verifiche.</p></div>
   <div><span>🦺</span><b>DPI controllati</b><p>Ognuno controlla il suo DPI e quello del collega.</p></div>
   <div><span>🧸</span><b>Recupero con manichino</b><p>La prova di soccorso si fa con un manichino o con doppia sicurezza.</p></div>
   <div><span>🌬️</span><b>Meteo</b><p>Con vento forte o pioggia la prova in quota si rinvia.</p></div></div>`;
D2.pratica3 = () => `<div class="kick">Addestramento pratico · 3</div><h2>Scheda di osservazione del docente</h2>
  <div class="cols" style="grid-template-columns:.9fr 1.6fr"><div class="ctrl"><label>Allievo <input id="obN" placeholder="nome e cognome" style="width:100%;font-size:16px;padding:6px"></label>
   <div class="obtabs" id="obT">${POST.map((p, i) => `<button class="chip ${i ? '' : 'on'}" data-i="${i}">${p[0]} ${i + 1}</button>`).join('')}</div>
   <div id="obSum" class="lres"></div><button class="btn sec" id="obPr">🖨️ Stampa la scheda</button></div>
   <div id="obBox"></div></div>`;
D2.pratica4 = () => `<div class="kick">Addestramento pratico · 4</div><h2>Prova di recupero: il cronometro</h2>
  <div class="cols"><div class="clockbox"><div class="swatch" id="swT">0:00</div><div class="sbar"><span id="swF"></span></div>
   <div class="qbar" style="position:static;justify-content:center"><button class="btn" id="swGo">▶ Via!</button><button class="btn sec" id="swSt">■ Stop</button><button class="btn sec" id="swRs">↺</button></div>
   <label class="small">Tempo obiettivo del piano di emergenza: <b id="swObv"></b> <input type="range" id="swOb" min="2" max="15" value="5"></label></div>
   <div><ol class="steps"><li><b>Allarme</b>: chi vede grida e chiama il preposto</li><li><b>112</b>: una persona chiama e dà l'indirizzo esatto</li><li><b>Kit</b>: si prende il kit di recupero (dove si trova?)</li><li><b>Protezione</b>: il soccorritore si aggancia</li><li><b>Recupero</b>: si porta il manichino sull'impalcato o a terra</li><li><b>A terra</b>: sdraiato, controllo del respiro, si aspettano i soccorsi</li></ol>
   <div id="swOut" class="lres">Premi "Via!" quando il manichino resta appeso.</div></div></div>`;
D2.chiusura = () => `<div class="kick">Chiusura</div><h2>Sei cose da portare in cantiere domani</h2>
  <div class="post6 close6">${[['📗', 'Prima di montare, leggi il PiMUS e il disegno'], ['🦺', 'Controlla e regola la tua imbracatura, ogni giorno'], ['🔗', 'Ti agganci sulla scala, prima di salire'], ['📏', 'Vicino a terra serve il retrattile: il tirante d\'aria conta'],
    ['🚫', 'Niente salite dai montanti, niente pezzi lanciati'], ['✋', 'Se qualcosa non va: STOP e chiama il preposto']].map(x => `<div><span>${x[0]}</span><b>${x[1]}</b></div>`).join('')}</div>
  <div class="bigrule" style="text-align:center">Grazie e buon lavoro. <b>Si torna a casa tutti.</b></div>`;

Object.assign(HOOKS, {
  indossa() {
    let i = 0;
    const show = () => { $('hfWrap').innerHTML = harnessFig(i + 1); $('hDesc').innerHTML = `<b>${i + 1}. ${HSTEP[i][0]}</b><p>${HSTEP[i][1]}</p>`;
      document.querySelectorAll('.hst').forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('done', j < i); }); $('hP').disabled = i === 0; $('hN').disabled = i === HSTEP.length - 1; };
    document.querySelectorAll('.hst').forEach(b => b.onclick = () => { i = +b.dataset.i; show(); }); $('hP').onclick = () => { if (i) { i--; show(); } }; $('hN').onclick = () => { if (i < 5) { i++; show(); } }; show();
  },
  regola() {
    const upd = () => { const L = +$('rgL').value, R = +$('rgR').value, loose = L / 100;
      $('rgLv').textContent = L < 25 ? 'troppo strette' : L < 55 ? 'giuste (mano piatta)' : 'troppo lente (ci passa un pugno)'; $('rgRv').textContent = R < 0 ? 'troppo in basso' : R > 0 ? 'troppo in alto (sul collo)' : 'tra le scapole';
      $('rgWrap').innerHTML = harnessFig(6, { loose: Math.max(0, (L - 25) / 75), ring: R });
      const pr = [];
      if (L >= 55) pr.push('Cosciali lenti: in caduta scivoli dentro l\'imbracatura, le cinghie salgono e fanno male proprio dove non devono. Rischi di sfilarti.');
      if (L < 25) pr.push('Cosciali troppo stretti: blocchi la circolazione e lavori male. Deve entrare una mano piatta.');
      if (R > 0) pr.push('Anello troppo in alto: in caduta la cinghia tira verso il collo e la testa.');
      if (R < 0) pr.push('Anello troppo in basso: in caduta ti ribalti a testa in giù.');
      $('rgOut').className = 'lres big ' + (pr.length ? 'nogo' : 'go');
      $('rgOut').innerHTML = pr.length ? '<b style="color:var(--ko)">✘ Da sistemare</b><ul>' + pr.map(x => '<li>' + x + '</li>').join('') + '</ul>' : '<b style="color:var(--ok)">✔ Regolata bene</b><p>Mano piatta sotto i cosciali, anello tra le scapole. Ora fatti controllare da un collega.</p>'; };
    $('rgL').oninput = upd; $('rgR').oninput = upd; upd();
  },
  sistema() {
    let n = 0, g = 0;
    SYS.forEach((s, i) => document.querySelectorAll(`#sy${i} button`).forEach(b => b.onclick = () => { const el = $('sy' + i); if (el.classList.contains('done')) return; const ok = +b.dataset.j === s[1];
      el.classList.add('done', ok ? 'right' : 'wrong'); b.classList.add(ok ? 'sel-ok' : 'sel-ko'); el.querySelector(`button[data-j="${s[1]}"]`).classList.add('sel-ok'); n++; if (ok) g++;
      $('sysScore').textContent = `Giuste: ${g} / ${n}`; }));
  },
  taeg2() {
    const from = +$('egBox').dataset.from, part = EG.slice(from, from + (+$('egBox').dataset.n || 4)); let n = 0, g = 0;
    $('egBox').innerHTML = part.map((c, k) => { const i = from + k; return `<div class="egc" id="eg${i}">${miniScene(c.id)}<div><p class="eq">${c.q}</p>${c.o.map((o, j) => [o, j]).sort(() => Math.random() - .5).map(([o, j]) => `<button class="eo" data-j="${j}">${o}</button>`).join('')}<p class="ex2">${c.e}</p></div></div>`; }).join('');
    part.forEach((c, k) => { const i = from + k; document.querySelectorAll(`#eg${i} .eo`).forEach(b => b.onclick = () => { const el = $('eg' + i); if (el.classList.contains('done')) return;
      const ok = +b.dataset.j === c.a; el.classList.add('done', ok ? 'right' : 'wrong'); b.classList.add(ok ? 'sel-ok' : 'sel-ko'); el.querySelector(`.eo[data-j="${c.a}"]`).classList.add('sel-ok'); el.querySelectorAll('.eo:not(.sel-ok):not(.sel-ko)').forEach(x => x.style.display = 'none'); n++; if (ok) g++;
      $('egScore').textContent = `Giuste: ${g} / ${n}`; }); });
  },
  pratica3() {
    let cur = 0;
    const M = POST.map(() => ({}));
    const box = () => { const p = POST[cur]; $('obBox').innerHTML = `<div class="obc"><h3>${p[0]} ${cur + 1}. ${p[1]}</h3><p class="small">${p[3]}</p>${POSTCRIT[cur].map((c, j) => `<div class="obr"><span>${c}</span><div>${['✔ fatto', '↻ da ripetere'].map((l, v) => `<button data-j="${j}" data-v="${v}" class="${M[cur][j] === v ? (v ? 'sel-ko' : 'sel-ok') : ''}">${l}</button>`).join('')}</div></div>`).join('')}</div>`;
      document.querySelectorAll('.obr button').forEach(b => b.onclick = () => { M[cur][+b.dataset.j] = +b.dataset.v; box(); sum(); }); };
    const sum = () => { let ok = 0, rep = 0, tot = 0; POSTCRIT.forEach((cr, i) => cr.forEach((c, j) => { tot++; if (M[i][j] === 0) ok++; if (M[i][j] === 1) rep++; }));
      $('obSum').innerHTML = `Fatti: <b>${ok}</b> · da ripetere: <b>${rep}</b> · da osservare: ${tot - ok - rep}` + (ok === tot ? '<br><b style="color:var(--ok)">Prova pratica superata</b>' : rep ? '<br><b style="color:#e65100">Ripetere le voci segnate</b>' : '');
      document.querySelectorAll('#obT .chip').forEach((b, i) => { const n = POSTCRIT[i].length, d = Object.values(M[i]).filter(v => v === 0).length; b.classList.toggle('dok', d === n); b.classList.toggle('dko', Object.values(M[i]).includes(1)); }); };
    document.querySelectorAll('#obT .chip').forEach(b => b.onclick = () => { cur = +b.dataset.i; document.querySelectorAll('#obT .chip').forEach(x => x.classList.toggle('on', x === b)); box(); });
    $('obPr').onclick = () => { const nm = $('obN').value || '________________'; const w = window.open('', '_blank'); if (!w) { toast('Consenti le finestre pop-up per stampare'); return; }
      w.document.write(`<html><head><title>Scheda osservazione</title><style>body{font-family:sans-serif;padding:20px}td,th{border:1px solid #999;padding:5px 8px;font-size:13px}table{border-collapse:collapse;width:100%;margin-bottom:12px}</style></head><body><h2>Scheda di osservazione – prova pratica ponteggi</h2><p>Allievo: <b>${nm}</b> · Data: ${new Date().toLocaleDateString('it-IT')}</p>` +
        POST.map((p, i) => `<h3>${i + 1}. ${p[1]}</h3><table><tr><th>Criterio</th><th>Esito</th></tr>${POSTCRIT[i].map((c, j) => `<tr><td>${c}</td><td>${M[i][j] === 0 ? 'fatto' : M[i][j] === 1 ? 'da ripetere' : ''}</td></tr>`).join('')}</table>`).join('') + '<p>Firma del docente: ____________________</p></body></html>'); w.document.close(); w.print(); };
    box(); sum();
  },
  pratica4() {
    let t0 = 0, run = false, raf = null, acc = 0;
    const ob = () => +$('swOb').value * 60;
    const draw = () => { const s = acc + (run ? (performance.now() - t0) / 1000 : 0); const m = Math.floor(s / 60), ss = Math.floor(s % 60);
      $('swT').textContent = `${m}:${String(ss).padStart(2, '0')}`; const p = Math.min(1, s / ob()); $('swF').style.width = p * 100 + '%'; $('swF').style.background = p < .7 ? '#43a047' : p < 1 ? '#fb8c00' : '#c62828';
      if (run && document.getElementById('swT')) raf = requestAnimationFrame(draw); return s; };
    $('swObv').textContent = $('swOb').value + ' min'; $('swOb').oninput = () => { $('swObv').textContent = $('swOb').value + ' min'; draw(); };
    $('swGo').onclick = () => { if (run) return; run = true; t0 = performance.now(); $('swOut').textContent = 'Recupero in corso...'; draw(); };
    $('swSt').onclick = () => { if (!run) return; acc += (performance.now() - t0) / 1000; run = false; cancelAnimationFrame(raf); const s = draw();
      $('swOut').className = 'lres ' + (s <= ob() ? 'go' : 'nogo'); $('swOut').innerHTML = s <= ob() ? `<b style="color:var(--ok)">✔ Recupero in ${Math.round(s)} s, dentro l'obiettivo.</b> Discutiamo cosa si può migliorare.` : `<b style="color:var(--ko)">✘ Troppo lento (${Math.round(s)} s).</b> Dove si è perso tempo? Kit lontano? Chi chiama il 112?`; };
    $('swRs').onclick = () => { run = false; acc = 0; cancelAnimationFrame(raf); $('swOut').className = 'lres'; $('swOut').textContent = 'Premi "Via!" quando il manichino resta appeso.'; draw(); };
    draw();
  }
});
const POSTCRIT = POST.map(p => p[4]);

const AGENDA2 = () => `<div class="kick">Come funziona</div><h2>Oggi: 2 ore di aula, poi il campo prova</h2>
  <div class="steps10">${[['⚖️', 'Chi decide le regole?'], ['⬇️', 'Perché si cade?'], ['🔩', 'Come si chiamano i pezzi?'], ['🦺', 'Come si usano i DPI?'], ['📏', 'Il DPI mi ferma in tempo?'],
    ['📗', 'Come si legge un PiMUS?'], ['🏗️', 'In che ordine si monta?'], ['🌦️', 'Oggi si sale o no?'], ['🚑', 'Se un collega resta appeso?'], ['📝', 'Test, poi prove pratiche']].map((x, i) => `<div><span>${x[0]}</span><b>${i + 1}</b><p>${x[1]}</p></div>`).join('')}</div>
  ${easy('Se una parola non è chiara, alza la mano. Le domande fanno parte del corso.')}`;

/* ---------- nuovo ordine dei moduli ---------- */
(() => {
  const find = fn => { for (const m of MODULES) for (const s of m.s) if (s.fn === fn || (fn === 'quiz' && s.quiz)) return s; return { fn }; };
  const fall = MODULES[2].s.find(s => s.after === 'fall');
  const K2 = (fn, key, nota, extra = {}) => Object.assign({ fn, key, nota }, extra);
  const MOD = [
    { t: 'Benvenuto', s: [find(S.cover), Object.assign(find(S.agenda), { fn: AGENDA2, key: 'Dieci domande in aula, poi le prove pratiche in campo prova.' }), find(S.patto), find(S.gloss), find(COMICS.zio)] },
    { t: 'Le regole, in breve', s: [find(S.regole3), find(S.ruoli), find(S.formazione), find(S.novita)] },
    { t: 'La caduta', s: [find(S.perche), fall, find(S.cadute), find(COMICS.attimo)] },
    { t: 'Il ponteggio pezzo per pezzo', s: [find(S.tipi), find(S.anat), find(S.numeri), find(S.foto)] },
    { t: 'DPI: sceglierli e usarli', s: [find(S.dpi), K2(D2.kit, 'Imbracatura, cordino, retrattile, casco con sottogola: ognuno ha il suo compito.', N('Foto CC da Flickr/Openverse e Sketchfab, vedi crediti.')),
      K2(D2.indossa, 'Mano piatta sotto i cosciali, anello tra le scapole.', N('Far indossare un\'imbracatura vera a un volontario mentre si scorrono le 6 mosse.', 'Istruzioni del fabbricante (EN 361) e addestramento obbligatorio per DPI di III categoria (art. 77 c.5).'), { after: 'indossa' }),
      K2(D2.regola, 'Un\'imbracatura lenta in caduta ti fa male o ti fa sfilare.', N('Muovere i due cursori e chiedere all\'aula cosa succede in caduta.'), { after: 'regola' }),
      find(S.controllo),
      K2(D2.sistema, 'Prima il parapetto; se non c\'è, trattenuta; se non basta, arresto caduta.', N('Sistemi EN 363: trattenuta, posizionamento (EN 358, non arresta la caduta), arresto caduta. Gerarchia art. 111.'), { after: 'sistema' }),
      { fn: COMICS.casco, comic: true, nota: N('Casco EN 397 con sottogola, o EN 12492 per lavori in quota.') }] },
    { t: 'Tirante d\'aria', s: [find(TA.concetto), find(TA.sim), find(TA.casi),
      K2(D2.err(0), 'Vicino a terra e con due cordini uniti non sei protetto.', N('Caso 1: Fc 1,75, servono 6,25 m. Caso 2: EN 354/355, max 2 m. Far votare l\'aula prima di cliccare.'), { after: 'taeg2' }),
      K2(D2.err(2), 'Spigoli vivi e spostamenti laterali sono pericolosi anche se sei agganciato.', N('Spigolo: istruzioni EN 355/360 (prodotti provati per il bordo). Pendolo: lavorare sotto l\'ancoraggio.'), { after: 'taeg2' }),
      K2(D2.err(4), 'Il connettore regge nel verso giusto e il cordino non si annoda.', N('EN 362: resistenza sull\'asse maggiore a leva chiusa. Nodi vietati dalle istruzioni dei fabbricanti.'), { after: 'taeg2' }),
      K2(D2.err(6), 'Aggancio all\'anello "A" e DPI certificato per il tuo peso con gli attrezzi.', N('EN 361 attacco "A"; EN 355 prova con 100 kg: oltre servono prodotti certificati per masse maggiori.'), { after: 'taeg2' }),
      find(COMICS.aggancio)] },
    { t: 'Il PiMUS: leggiamone uno vero', s: [find(S.documenti), find(S.pimusVero), find(S.pimusTav), find(S.pimusFasi), find(S.pimusCheck), find(COMICS.pimus)] },
    { t: 'Montaggio e smontaggio', s: [find(S.prima), find(S.seq), find(S.appoggi), find(S.impalcati), find(S.ancoraggi), find(COMICS.filo), find(S.smontaggio), find(COMICS.lancio), find(COMICS.ragno)] },
    { t: 'Uso, verifiche, meteo', s: [find(S.uso), find(S.verifiche), find(S.meteo), find(COMICS.vento), find(S.caldo), find(S.elettrico)] },
    { t: 'Dopo la caduta: emergenza', s: [find(S.sospA), find(S.sospB), find(COMICS.sosp), find(S.emergenza)] },
    { t: 'Caccia all\'errore', s: [find(S.caccia)] },
    { t: 'Verifica di apprendimento', s: [Object.assign(find('quiz'), { nota: N('È la verifica della parte teorica (come la verifica intermedia dell\'All. XXI): con almeno il 70% si passa alle prove pratiche.') })] },
    { t: 'Addestramento pratico', s: [
      K2(D2.pratica1, 'In campo prova si rifà con le mani quello che abbiamo visto in aula.', N('All. XXI: modulo pratico 14 h (montaggio, smontaggio, trasformazione di PTP, PTG, PMTP; ancoraggi; DPI; elementi di gestione dell\'emergenza). Aggiornamento: almeno 3 h tecnico-pratiche.', 'Le durate indicate (≈ 2,5 h) sono un esempio per l\'aggiornamento: adattarle.')),
      K2(D2.pratica2, 'Anche il campo prova è un cantiere: stesse regole.', N('Rapporto istruttore/allievi 1:5 nel modulo pratico (All. XXI). Prova di recupero con manichino.')),
      K2(D2.pratica3, 'Ogni allievo viene osservato su tutte le postazioni.', N('La prova pratica finale verifica montaggio, smontaggio, trasformazione e ancoraggi. La scheda si può stampare e allegare al registro.'), { after: 'pratica3' }),
      K2(D2.pratica4, 'Il recupero si prova prima: il cronometro dice se il piano funziona.', N('Fissare il tempo obiettivo con il piano di emergenza del cantiere; discutere i ritardi.'), { after: 'pratica4' })] },
    { t: 'Chiusura', s: [K2(D2.chiusura, 'Si torna a casa tutti.', N('Raccogliere domande e gradimento. Consegnare/registrare gli esiti del test e delle prove.'))] },
    MODULES[MODULES.length - 1]
  ];
  MODULES.length = 0; MOD.forEach(m => MODULES.push(m));
  AGENDA.length = 0;
  [['0', 'Benvenuto', 5], ['1', 'Le regole, in breve', 8], ['2', 'La caduta', 8], ['3', 'Il ponteggio pezzo per pezzo', 8], ['4', 'DPI: sceglierli e usarli', 14], ['5', 'Tirante d\'aria', 12], ['6', 'Il PiMUS', 14],
   ['7', 'Montaggio e smontaggio', 14], ['8', 'Uso, verifiche, meteo', 10], ['9', 'Dopo la caduta: emergenza', 10], ['10', 'Caccia all\'errore', 5], ['11', 'Verifica', 8], ['12', 'Chiusura', 4]].forEach(a => AGENDA.push(a));
})();

