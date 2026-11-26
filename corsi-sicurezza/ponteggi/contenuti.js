/* ============================================================
   CORSO PONTEGGI – MONTAGGIO, USO, SMONTAGGIO (sintesi 2 ore)
   ============================================================ */
const fig = (src, cap, cr) => `<figure class="ph"><img src="img/${src}.jpg" alt="${cap.replace(/<[^>]+>/g, '')}" loading="lazy"><figcaption>${cap}${cr ? `<span class="cr">${cr}</span>` : ''}</figcaption></figure>`;
const CRF = 'Foto di cantiere: materiale del corso';
const CC = (a) => `Foto ${a} · CC BY 2.0 (vedi crediti)`;
const ref = t => `<span class="ref">${t}</span>`;
const easy = t => `<div class="easy"><span>In parole semplici</span>${t}</div>`;
const W0 = { vest: '#ff8c1a' }, W1 = { vest: '#1e88e5' }, BOSS = { vest: '#2e7d32', helmet: '#ffffff' };

/* ---------------- VIGNETTE ---------------- */
const COMICS = {
  zio: () => strip({
    title: "L'attestato dello zio",
    panels: [
      panel(sky() + ground() + facade(0, 220, 400, 200) + scaf(60, 220, { nb: 3, nl: 2, bw: 90 }) + worker(110, 220, { mood: 'smug', arm: 'point' }) + worker(300, 220, Object.assign({ flip: true }, BOSS)),
        [{ x: 2, y: 3, w: 56, txt: 'Mio zio monta ponteggi da 30 anni. Ho imparato tutto da lui!', t: 'br' }]),
      panel(sky() + ground() + worker(150, 220, { mood: 'happy', arm: 'phone' }) + worker(300, 220, Object.assign({ flip: true, mood: 'worried' }, BOSS)) + doc(30, 60, 'ATTESTATO'),
        [{ x: 46, y: 3, w: 52, txt: 'Bene. E il tuo attestato del corso?', t: 'bl' }, { x: 2, y: 44, w: 40, txt: "Ce l'ha lo zio...", t: 'br' }]),
      panel(sky('#fde8e6') + ground() + worker(200, 220, Object.assign({ mood: 'angry', arm: 'stop' }, BOSS)) + burst(80, 60, 30, 'NO!'),
        [{ x: 40, y: 3, w: 58, txt: "L'esperienza dello zio non si eredita. Oggi guardi da terra!", t: 'bl' }])
    ],
    moral: 'Per <b>montare, trasformare e smontare</b> un ponteggio serve il <b>corso specifico (Allegato XXI)</b>: 28 ore con prova pratica finale e <b>aggiornamento ogni 4 anni</b>. L\'esperienza aiuta, ma non sostituisce l\'attestato.'
  }),
  attimo: () => strip({
    title: 'Solo un attimo...',
    panels: [
      panel(sky() + ground() + facade(0, 220, 400, 230) + scaf(40, 220, { nb: 3, nl: 2, bw: 100, miss: ['rail2', 'mid2'] }) + worker(170, 92, { mood: 'smug', s: .8 }) + `<rect x="300" y="150" width="34" height="22" fill="#90a4ae"/>`,
        [{ x: 2, y: 3, w: 58, txt: 'Il parapetto lo rimetto dopo, devo solo prendere quel secchio...', t: 'br' }]),
      panel(sky('#fde8e6') + ground() + facade(0, 220, 400, 230) + scaf(40, 220, { nb: 3, nl: 2, bw: 100, miss: ['rail2', 'mid2'] }) + `<g class="tumble">${worker(250, 110, { mood: 'shock', arm: 'both', s: .8 })}</g>` + burst(330, 20, 30, 'AAAH!'),
        []),
      panel(sky() + ground() + `<rect x="60" y="150" width="190" height="40" rx="8" fill="#eceff1" stroke="#90a4ae"/><text x="155" y="176" text-anchor="middle" font-size="16" font-weight="700" fill="#c62828">+ 112</text>` + worker(310, 220, Object.assign({ flip: true, mood: 'worried' }, BOSS)),
        [{ x: 44, y: 3, w: 54, txt: '"Un attimo" dura 0,64 secondi: il tempo di cadere da 2 metri.', t: 'bl' }])
    ],
    moral: 'Il parapetto si toglie <b>solo se serve al lavoro</b>, con un sistema alternativo (DPI agganciato) e si <b>rimette subito</b>. Chi lo toglie lo rimette, e lo dice al preposto.'
  }),
  pimus: () => strip({
    title: 'Il PiMUS "universale"',
    panels: [
      panel(sky() + ground() + worker(100, 220, Object.assign({ mood: 'smug', arm: 'point' }, BOSS)) + doc(220, 70, 'PiMUS') + `<text x="252" y="170" text-anchor="middle" font-size="10" fill="#4e342e">Via Roma 12</text>`,
        [{ x: 2, y: 3, w: 54, txt: 'Ecco il PiMUS! Quello del cantiere di Via Roma: tanto i ponteggi sono tutti uguali.', t: 'br' }]),
      panel(sky() + ground() + facade(150, 220, 250, 200, '#d7ccc8') + `<text x="275" y="40" text-anchor="middle" font-size="14" font-weight="700" fill="#5d4037">VIA GARIBALDI</text><path d="M150,90 h-60 v130" stroke="#5d4037" stroke-width="5" fill="none"/>` + worker(70, 220, { mood: 'shock' }),
        [{ x: 2, y: 3, w: 50, txt: 'Ma qui c\'è un balcone, una tettoia e 25 metri di altezza...', t: 'br' }]),
      panel(sky() + ground() + worker(300, 220, { flip: true, mood: 'happy', arm: 'point' }) + doc(60, 60, 'PiMUS', '#e8f5e9') + `<text x="92" y="160" text-anchor="middle" font-size="10" fill="#2e7d32">questo cantiere</text>`,
        [{ x: 36, y: 3, w: 62, txt: 'Il PiMUS si scrive per QUESTO ponteggio, in QUESTO cantiere, e si aggiorna se cambia qualcosa.', t: 'bl' }])
    ],
    moral: 'Il <b>PiMUS</b> (art. 136, All. XXII) è redatto da <b>persona competente</b> per il cantiere specifico e descrive montaggio, uso, trasformazione e smontaggio. Sopra i 20 m o con schemi diversi dal libretto serve anche il <b>progetto</b> (art. 133).'
  }),
  lancio: () => strip({
    title: 'Olimpiadi del lancio del tubo',
    panels: [
      panel(sky() + ground() + scaf(150, 220, { nb: 2, nl: 3, bw: 90, lh: 58 }) + worker(250, 46, { mood: 'smug', arm: 'up', s: .7 }) + tube(300, -20, 70, -30) + `<g fill="#555" font-family="Bangers,Impact" font-size="20"><text x="20" y="-25">FINALE OLIMPICA</text></g>`,
        [{ x: 2, y: 20, w: 40, txt: 'Così si fa prima che con la carrucola!', t: 'br' }]),
      panel(sky() + ground() + tube(240, 200, 80, 20) + burst(240, 160, 34, 'SDENG!') + worker(90, 220, { vest: '#7e57c2', helmet: false, mood: 'shock', arm: 'both' }),
        [{ x: 2, y: 3, w: 46, txt: 'Ehi! Stavo passando io!', t: 'br' }]),
      panel(sky() + ground() + podium(200, 220) + worker(200, 180, { mood: 'worried', s: .8 }) + medal(200, 120, '€') + doc(300, 60, 'VERBALE', '#ffebee'),
        [{ x: 2, y: 3, w: 54, txt: 'Medaglia d\'oro... in sanzioni. E per poco non in omicidio colposo.', t: 'br' }])
    ],
    moral: 'È <b>vietato gettare dall\'alto</b> gli elementi del ponteggio (art. 138): si calano con <b>argano/carrucola</b> o a mano, piano per piano, dentro un\'area <b>delimitata</b>.'
  }),
  ragno: () => strip({
    title: 'Il Super-Arrampicatore',
    panels: [
      panel(sky() + ground() + scaf(110, 220, { nb: 2, nl: 3, bw: 90, lh: 58 }) + `<g transform="translate(112,150) rotate(-6)">${worker(0, 0, { mood: 'smug', arm: 'both', s: .7 })}</g>`,
        [{ x: 44, y: 3, w: 54, txt: 'Le scale interne? Troppo lente! Io salgo dal montante: due secondi!', t: 'bl' }]),
      panel(sky('#fde8e6') + ground() + scaf(110, 220, { nb: 2, nl: 3, bw: 90, lh: 58 }) + `<g class="tumble">${worker(140, 40, { mood: 'shock', arm: 'both', s: .7 })}</g>` + burst(300, 40, 30, 'CRAC!'),
        [{ x: 50, y: 50, w: 46, txt: 'Mi è scivolato il piede sul giunto bagnato...', t: 'bl' }]),
      panel(sky() + ground() + scaf(110, 220, { nb: 2, nl: 3, bw: 90, lh: 58 }) + `<g stroke="#455a64" stroke-width="3"><line x1="160" y1="220" x2="190" y2="162"/><line x1="176" y1="220" x2="206" y2="162"/></g>` + worker(330, 220, { mood: 'happy', arm: 'point', flip: true }),
        [{ x: 2, y: 3, w: 56, txt: 'Si sale solo dalle scale interne, con la botola che poi si chiude.', t: 'br' }])
    ],
    moral: 'È <b>vietato salire e scendere lungo i montanti</b> (art. 138). Si usano le <b>scale interne</b> del ponteggio, sfalsate e mai una in prosecuzione dell\'altra (art. 113), richiudendo sempre la <b>botola</b>.'
  }),
  filo: () => strip({
    title: "L'ancoraggio creativo",
    panels: [
      panel(sky() + ground() + facade(0, 220, 400, 240) + railing(200, 120, 120) + scaf(40, 220, { nb: 1, nl: 2, bw: 110 }) + worker(110, 92, { mood: 'smug', arm: 'point', s: .8 }) + `<path d="M150,90 Q180,70 212,82" stroke="#9e9e9e" stroke-width="2" fill="none"/>`,
        [{ x: 36, y: 50, w: 60, txt: 'Tasselli finiti? Filo di ferro alla ringhiera del balcone, e via!', t: 'bl' }]),
      panel(sky('#e3f2fd') + ground() + windLines(10, 20, 4) + facade(0, 220, 400, 240) + `<g class="sway">${scaf(40, 220, { nb: 1, nl: 2, bw: 110 })}</g>` + railing(240, 120, 120) + burst(300, 0, 30, 'TWANG!'),
        []),
      panel(sky() + ground() + facade(0, 220, 400, 240) + scaf(40, 220, { nb: 1, nl: 2, bw: 110 }) + `<rect x="148" y="84" width="54" height="8" fill="#455a64"/><circle cx="202" cy="88" r="6" fill="#455a64"/>` + worker(320, 220, Object.assign({ flip: true, arm: 'point' }, BOSS)),
        [{ x: 30, y: 3, w: 66, txt: 'Ancoraggi solo come da libretto o progetto: tassello provato, a cravatta, ad anello. Niente fai-da-te!', t: 'bl' }])
    ],
    moral: 'Gli <b>ancoraggi</b> tengono in piedi il ponteggio contro il vento. Vietati quelli "di fortuna" a <b>ringhiere, inferriate, pluviali</b> e il <b>filo di ferro</b>. Numero e tipo li decidono il <b>libretto</b> o il <b>progetto</b>.'
  }),
  vento: () => strip({
    title: 'Ma è solo una brezza!',
    panels: [
      panel(sky('#cfd8dc') + ground() + windLines(0, -10, 5) + `<g class="sway">${scaf(150, 220, { nb: 2, nl: 3, bw: 80, lh: 58 })}<rect x="150" y="40" width="160" height="134" fill="#4caf50" opacity=".55"/></g>` + worker(70, 220, Object.assign({ arm: 'phone' }, BOSS)),
        [{ x: 2, y: 3, w: 46, txt: 'Meteo: raffiche a 70 km/h. Pazienza, montiamo i teli!', t: 'br' }]),
      panel(sky('#b0bec5') + ground() + windLines(0, 20, 5) + `<g class="sway2">${worker(200, 160, { mood: 'shock', arm: 'both', s: .8 })}<rect x="120" y="20" width="160" height="70" fill="#4caf50" opacity=".7" transform="rotate(-12 200 50)"/></g>`,
        [{ x: 2, y: 3, w: 40, txt: 'Questo telo... è una VELA!', t: 'br', shout: true }]),
      panel(sky() + ground() + scaf(150, 220, { nb: 2, nl: 3, bw: 80, lh: 58 }) + worker(70, 220, Object.assign({ arm: 'stop' }, BOSS)) + doc(310, 70, 'PiMUS'),
        [{ x: 2, y: 3, w: 56, txt: 'Vento oltre il limite del PiMUS: si scende. Teli e cartelloni solo se previsti dal progetto.', t: 'br' }])
    ],
    moral: 'Con <b>vento forte, temporale, neve o ghiaccio</b> si sospende (art. 111 c.7). Teli e cartelloni aumentano la spinta del vento: servono <b>progetto</b> e ancoraggi aggiuntivi. Dopo la tempesta il preposto <b>verifica</b> prima di riprendere (art. 137).'
  }),
  aggancio: () => strip({
    title: 'Agganciato... a cosa?',
    panels: [
      panel(sky() + ground() + scaf(100, 220, { nb: 2, nl: 2, bw: 100 }) + worker(170, 92, { mood: 'smug', s: .8 }) + harness(170, 92, .8) + lanyard(170, 30, 182, 60),
        [{ x: 40, y: 3, w: 58, txt: 'Sono agganciato! Al mio stesso anello, ma conta lo stesso, no?', t: 'bl' }]),
      panel(sky() + ground() + scaf(100, 220, { nb: 2, nl: 2, bw: 100 }) + worker(170, 92, { mood: 'worried', s: .8 }) + harness(170, 92, .8) + lanyard(170, 30, 120, 100),
        [{ x: 40, y: 3, w: 58, txt: 'Allora mi aggancio al corrente del parapetto, ai miei piedi, con il cordino da 2 metri...', t: 'bl' }]),
      panel(sky() + ground() + scaf(100, 220, { nb: 2, nl: 2, bw: 100 }) + worker(170, 92, { mood: 'happy', s: .8 }) + harness(170, 92, .8) + `<rect x="196" y="-40" width="8" height="30" fill="#455a64"/>` + lanyard(170, 30, 200, -12, '#2e7d32') + worker(330, 220, Object.assign({ flip: true, arm: 'point' }, BOSS)),
        [{ x: 2, y: 3, w: 52, txt: 'Punto previsto dal PiMUS, sopra la testa, e tirante d\'aria calcolato.', t: 'br' }])
    ],
    moral: 'Il punto di ancoraggio deve essere <b>resistente, previsto dal PiMUS</b> e il più possibile <b>in alto</b>: agganciarsi in basso raddoppia la caduta libera. Controlla sempre il <b>tirante d\'aria</b>: lo spazio libero sotto di te.'
  })
};

/* ---------------- INFOGRAFICHE E SLIDE ---------------- */
const AGENDA = [['0', 'Benvenuto, glossario', 8], ['1', 'Regole e ruoli', 12], ['2', 'La caduta: fisica e sospensione', 12], ['3', 'Documenti: libretto, progetto, PiMUS', 10],
['4', 'Il ponteggio pezzo per pezzo', 12], ['5', 'Montaggio, ancoraggi, smontaggio', 18], ['6', 'DPI e tirante d\'aria', 14], ['7', 'Uso, verifiche, meteo, caldo', 14],
['8', 'Emergenza e recupero', 6], ['9', 'Caccia all\'errore', 6], ['10', 'Verifica finale', 8]];

const GLOSS = [
  ['🏗️', 'ponteggio', 'scaffold', 'échafaudage', 'schelă', 'سقالة'],
  ['🟫', 'impalcato (piano di lavoro)', 'working platform', 'plancher de travail', 'platformă de lucru', 'منصة العمل'],
  ['🚧', 'parapetto', 'guardrail', 'garde-corps', 'balustradă', 'درابزين حماية'],
  ['📏', 'montante', 'upright / standard', 'montant', 'montant (stâlp)', 'قائم عمودي'],
  ['🔩', 'ancoraggio', 'wall tie / anchor', 'ancrage', 'ancorare', 'تثبيت بالجدار'],
  ['🦺', 'imbracatura', 'full body harness', 'harnais antichute', 'ham de siguranță', 'حزام أمان كامل'],
  ['🪢', 'cordino', 'lanyard', 'longe', 'lonjă', 'حبل الربط'],
  ['⛑️', 'casco', 'helmet', 'casque', 'cască', 'خوذة'],
  ['⚠️', 'pericolo', 'danger', 'danger', 'pericol', 'خطر'],
  ['✋', 'fermati! / STOP', 'stop!', 'arrête !', 'oprește-te!', 'توقف!'],
  ['💨', 'vento', 'wind', 'vent', 'vânt', 'رياح'],
  ['⬇️', 'caduta', 'fall', 'chute', 'cădere', 'سقوط'],
  ['👷', 'preposto (capo squadra)', 'supervisor', "chef d'équipe", 'șef de echipă', 'المشرف'],
  ['🚑', 'soccorso · 112', 'rescue · 112', 'secours · 112', 'salvare · 112', 'إسعاف · 112']
];

const S = {
  cover: () => `<div class="cover pc" style="background-image:linear-gradient(120deg,rgba(13,35,58,.93) 0%,rgba(13,35,58,.78) 55%,rgba(13,35,58,.35) 100%),url(img/facciata.jpg)">
    <div class="ctag">Corso addetti ponteggi · sintesi 2 ore</div>
    <h2>Ponteggi: montare, usare, smontare.<br>E tornare a casa.</h2>
    <div class="sub">Lavoratori e preposti addetti al montaggio, alla trasformazione e allo smontaggio di ponteggi fissi</div>
    <div class="stripe"></div>
    <ul><li>D.Lgs. 81/2008, Titolo IV, artt. 122–138 e Allegati XVIII, XIX, XXI, XXII · aggiornato a novembre 2026</li>
    <li>Vignette, simulazioni, foto di cantiere, glossario in 5 lingue</li>
    <li>Tasto <b>P</b>: presentazione a tutto schermo con puntatore laser</li></ul></div>`,

  agenda: () => `<div class="kick">Come funziona</div><h2>Due ore, un corso intero (in sintesi)</h2>
   <div class="cols"><div><table class="ag"><tr><th>#</th><th>Modulo</th><th>min</th></tr>${AGENDA.map(a => `<tr><td>${a[0]}</td><td>${a[1]}</td><td>${a[2]}'</td></tr>`).join('')}
   <tr><th></th><th>Totale</th><th>${AGENDA.reduce((s, a) => s + a[2], 0)}'</th></tr></table></div>
   <div><div class="card"><b>🎯 Obiettivo</b><p>Ripassare in modo concentrato tutto il programma del corso da 28 ore (Allegato XXI): leggi, rischi, documenti, montaggio, DPI, verifiche, emergenza.</p></div>
   <div class="stop"><b>Attenzione, docente:</b> queste 2 ore <b>non sostituiscono</b> il corso abilitante (28 h con prove pratiche) né l'aggiornamento quadriennale (minimo 4 h, di cui 3 tecnico-pratiche). Si possono usare come modulo teorico dell'aggiornamento, come ripasso o come informazione per chi usa il ponteggio senza montarlo.</div>
   ${easy('Oggi impariamo le regole più importanti. Ogni modulo ha un disegno, un gioco o una prova. Alla fine c\'è un test.')}</div></div>`,

  patto: () => `<div class="kick">Patto d'aula</div><h2>Parliamo la stessa lingua</h2>
   <p>In aula ci sono colleghi di tanti Paesi. Le parole della sicurezza devono essere <b>chiare per tutti</b>: in cantiere un "fermati!" capito male può costare caro.</p>
   <div class="cols3">
    <div class="card"><b>🗣️ Frasi corte</b><p>Una regola, una frase. Se non capisci, <b>chiedi</b>: non è una vergogna, è sicurezza.</p></div>
    <div class="card"><b>👀 Immagini</b><p>Ogni regola ha un disegno o una foto. Guarda prima l'immagine, poi leggi.</p></div>
    <div class="card"><b>✋ Gesti</b><p>Il gesto <b>STOP</b> (mano aperta) vale in tutte le lingue: chiunque può usarlo.</p></div></div>
   <div class="warn"><b>Per il datore di lavoro:</b> con lavoratori stranieri la formazione deve essere comprensibile; l'Accordo Stato-Regioni 2025 chiede di <b>verificare prima</b> la comprensione della lingua del corso e, se serve, di usare un mediatore o materiale tradotto. ${ref('D.Lgs. 81/08 art. 36 c.4 e art. 37 c.13 · ASR 17/04/2025')}</div>`,

  gloss: () => `<div class="kick">Glossario visivo</div><h2>Le 14 parole che salvano la vita</h2>
   <p class="small">Clicca su una riga per evidenziarla. Nell'ultima colonna ognuno può scrivere la parola <b>nella propria lingua</b> (resta solo su questo schermo).</p>
   <div class="gtab"><table id="gloss"><tr><th></th><th>Italiano</th><th>English</th><th>Français</th><th>Română</th><th dir="rtl">العربية</th><th>La mia lingua ✍️</th></tr>
   ${GLOSS.map((g, i) => `<tr data-i="${i}"><td class="ge">${g[0]}</td><td><b>${g[1]}</b></td><td>${g[2]}</td><td>${g[3]}</td><td>${g[4]}</td><td dir="rtl">${g[5]}</td><td><input aria-label="traduzione" placeholder="…"></td></tr>`).join('')}</table></div>
   <p class="pnote">Traduzioni di servizio: fatele controllare da un collega madrelingua o dal mediatore prima di stamparle.</p>`,

  leggi: () => `<div class="kick">Le regole del gioco</div><h2>Le leggi dei ponteggi in una pagina</h2>
   <div class="lawmap">
    <div class="lm root">D.Lgs. 81/2008<small>Testo Unico sicurezza</small></div>
    <div class="lmrow">
     <div class="lm">Titolo IV · Capo II<small>lavori in quota, artt. 105–138</small><ul><li>art. 111 scelta attrezzature, meteo</li><li>art. 115 sistemi anticaduta</li><li>artt. 122–130 ponteggi in generale</li><li><b>artt. 131–138 ponteggi fissi</b></li></ul></div>
     <div class="lm">Allegati<small>i dettagli tecnici</small><ul><li><b>XVIII</b> viabilità, ponteggi, parapetti</li><li><b>XIX</b> verifiche dei ponteggi</li><li><b>XXI</b> formazione addetti</li><li><b>XXII</b> contenuti del PiMUS</li></ul></div>
     <div class="lm">Norme tecniche<small>come si costruisce e si prova</small><ul><li>UNI EN 12810 / 12811 ponteggi</li><li>UNI EN 74 giunti</li><li>UNI EN 13374 parapetti provvisori</li><li>EN 361, 354, 355, 360, 362, 795 anticaduta</li></ul></div>
     <div class="lm">Documenti del fabbricante<small>valgono come legge in cantiere</small><ul><li>autorizzazione ministeriale (art. 131)</li><li>libretto con schemi tipo</li><li>istruzioni di montaggio</li></ul></div>
    </div></div>
   ${easy('C\'è una legge (81/2008), ci sono allegati con i numeri, e c\'è il <b>libretto</b> del ponteggio: se il libretto dice di fare così, si fa così.')}`,

  ruoli: () => `<div class="kick">Chi fa cosa</div><h2>Cinque persone, un ponteggio</h2>
   <div class="roles">
    <div class="role"><div class="e">🏢</div><b>Datore di lavoro</b><p>Sceglie il ponteggio, fa redigere il PiMUS, forma la squadra, dà DPI e attrezzi. ${ref('artt. 111, 136')}</p></div>
    <div class="role"><div class="e">📐</div><b>Persona competente / progettista</b><p>Redige il PiMUS; l'ingegnere o architetto firma il progetto se serve. ${ref('artt. 133, 136')}</p></div>
    <div class="role hl"><div class="e">🦺</div><b>Preposto</b><p>Sorveglia <b>direttamente</b> montaggio e smontaggio, ferma i lavori se c'è pericolo, verifica dopo il maltempo. ${ref('artt. 19, 136 c.6, 137')}</p></div>
    <div class="role"><div class="e">👷</div><b>Lavoratore addetto</b><p>Segue PiMUS e istruzioni, usa i DPI, segnala difetti e quasi-incidenti. ${ref('art. 20')}</p></div>
    <div class="role"><div class="e">🧑‍⚕️</div><b>Medico competente</b><p>Valuta l'idoneità al lavoro in quota (vertigini, farmaci, alcol). ${ref('art. 41')}</p></div>
   </div>
   <div class="warn"><b>Il preposto può interrompere i lavori</b> se vede una situazione pericolosa e deve segnalare le non conformità (art. 19, lett. a e f-bis, dopo la L. 215/2021). Deve avere anche lui la formazione da addetto ai ponteggi (Interpello 16/2015).</div>`,

  formazione: () => `<div class="kick">La formazione obbligatoria</div><h2>Il percorso dell'addetto ai ponteggi</h2>
   <div class="flow">
    <div class="fb"><div class="ic">⚖️</div><b>Modulo giuridico</b><span class="big">4 h</span><p>leggi, rischi, responsabilità</p></div><div class="arr">➜</div>
    <div class="fb"><div class="ic">🛠️</div><b>Modulo tecnico</b><span class="big">10 h</span><p>PiMUS, ancoraggi, DPI, verifiche</p></div><div class="arr">➜</div>
    <div class="fb"><div class="ic">📝</div><b>Verifica intermedia</b><span class="big">70%</span><p>test a risposte multiple</p></div><div class="arr">➜</div>
    <div class="fb"><div class="ic">🏗️</div><b>Modulo pratico</b><span class="big">14 h</span><p>montaggio, smontaggio, trasformazione di PTG, PTP, PMTP</p></div><div class="arr">➜</div>
    <div class="fb hl"><div class="ic">🎓</div><b>Prova pratica e attestato</b><span class="big">≥ 90%</span><p>di presenza</p></div></div>
   <div class="cols" style="margin-top:16px"><div class="card"><b>🔁 Aggiornamento</b><p>Ogni <b>4 anni</b>, minimo <b>4 ore</b>, di cui <b>3 tecnico-pratiche</b>.</p></div>
   <div class="card"><b>👥 Aula</b><p>Massimo 30 partecipanti; nella pratica 1 docente ogni 5 allievi.</p></div></div>
   <p class="small">${ref('D.Lgs. 81/08 art. 136 c.6–8 e Allegato XXI. Il nuovo Accordo Stato-Regioni del 17/04/2025 riordina gli altri corsi, ma il corso ponteggi resta regolato dall\'Allegato XXI.')}</p>`,

  novita: () => `<div class="kick">Cosa è cambiato di recente</div><h2>Novità 2024 – 2026 da sapere</h2>
   <div class="tl">
    <div class="tli new"><div class="y">2024</div><b>Patente a crediti</b><p>Dal 1° ottobre 2024 imprese e autonomi nei cantieri devono avere la patente a crediti (art. 27): incidenti gravi e violazioni tolgono punti.</p></div>
    <div class="tli new"><div class="y">2025</div><b>Accordo Stato-Regioni</b><p>17 aprile 2025: nuove regole per i corsi, verifica della comprensione della lingua, formazione in presenza per le parti pratiche.</p></div>
    <div class="tli new"><div class="y">2025</div><b>Protocollo caldo</b><p>2 luglio 2025: protocollo quadro per le emergenze climatiche; molte Regioni vietano il lavoro al sole nelle ore più calde (di solito 12:30–16:00) nei giorni di rischio alto.</p></div>
    <div class="tli next"><div class="y">2025</div><b>Badge di cantiere</b><p>Il D.L. 159/2025 introduce il badge di cantiere con codice univoco per chi lavora nei cantieri, accanto alla tessera di riconoscimento (art. 26 c.8).</p></div>
    <div class="tli old"><div class="y">sempre</div><b>Libretti rinnovati</b><p>L'autorizzazione ministeriale si rinnova ogni 10 anni (obbligo del fabbricante); l'impresa può continuare a usare il ponteggio acquistato.</p></div>
    <div class="tli old"><div class="y">sempre</div><b>Allegato XXI</b><p>Il corso ponteggi resta di 28 ore con aggiornamento ogni 4 anni.</p></div></div>
   <div class="legend"><span class="lg new"></span> in vigore <span class="lg next"></span> in attuazione <span class="lg old"></span> conferme</div>`,

  perche: () => `<div class="kick">Il nemico numero uno</div><h2>Perché siamo qui: la caduta dall'alto</h2>
   <div class="cols"><div>${fig('trave', 'Cosa manca in questa foto? (risposta: tutto, tranne il coraggio)', CC('billjacobus1'))}</div>
   <div><p>Le <b>cadute dall'alto</b> sono da anni la prima causa di infortunio mortale nelle costruzioni in Italia (dati INAIL). Nei ponteggi i momenti più pericolosi sono:</p>
    <ul><li>il <b>montaggio dei primi due impalcati</b>, quando non c'è ancora protezione e l'altezza è poca per il DPI;</li>
    <li>lo <b>smontaggio</b>, quando si tolgono parapetti e ancoraggi;</li>
    <li>le "<b>modifiche al volo</b>": parapetto tolto "per un attimo", tavola spostata, botola aperta.</li></ul>
    <div class="stop">Sopra i <b>2 metri</b> si è "in quota" (art. 107): servono protezioni collettive prima, DPI dopo (art. 111).</div></div></div>`,

  cadute: () => `<div class="kick">Le cadute non sono tutte uguali</div><h2>Trattenuta, limitata, arrestata</h2>
   <div class="cols3">
    <div class="card"><b>🟢 Trattenuta</b><p>Il cordino è corto: <b>non arrivi al bordo</b>. Non cadi proprio. È la soluzione migliore.</p></div>
    <div class="card"><b>🟡 Caduta limitata</b><p>Caduta libera <b>sotto i 60 cm</b>: il sistema ferma subito, forze basse.</p></div>
    <div class="card"><b>🔴 Caduta arrestata</b><p>Caduta libera <b>oltre 60 cm</b>: l'assorbitore si apre e ti ferma. Serve <b>tirante d'aria</b>.</p></div></div>
   <div class="cols" style="margin-top:14px"><div class="meterbox"><b>Forza sul corpo all'arresto</b>
    <div class="fbar"><span style="width:46%;background:#43a047">con assorbitore ≤ 6 kN (EN 355)</span></div>
    <div class="fbar"><span style="width:92%;background:#e53935">senza, caduta da 1 m ≈ 13 kN</span></div>
    <div class="fbar"><span style="width:100%;background:#b71c1c">senza, caduta da 2 m ≈ 17 kN</span></div>
    <p class="small">Il corpo umano tollera circa 12 kN: oltre ci sono lesioni gravi alla colonna e agli organi.</p></div>
    <div>${easy('Più il cordino è lungo e più l\'aggancio è in basso, più cadi. Più cadi, più forte è lo strappo. L\'<b>assorbitore</b> è il "freno" che salva la schiena.')}</div></div>`,

  sosp: () => `<div class="kick">Il pericolo dopo la caduta</div><h2>Sindrome da sospensione: il tempo è vita</h2>
   <div class="cols"><div><p>Una persona appesa all'imbracatura, <b>immobile</b> (svenuta o ferita), ha le cinghie che stringono le gambe: il sangue non torna al cuore. Dopo <b>pochi minuti</b> può perdere coscienza; se il soccorso tarda, il rischio è la morte.</p>
    <ul><li>Il <b>piano di emergenza</b> deve prevedere un recupero in <b>pochi minuti</b>, con persone e mezzi già pronti in cantiere.</li>
    <li>Non si lavora mai da soli con l'imbracatura.</li>
    <li>Se sei appeso e cosciente: muovi le gambe, usa le fettucce anti-trauma se presenti.</li></ul></div>
    <div class="clockbox"><div class="clock" id="sclock"><div class="hand" id="shand"></div><div class="cc" id="scount">0:00</div></div>
     <div class="sbar"><span id="sfill"></span></div><div id="smsg" class="smsg">Premi ▶ per vedere quanto passa in fretta il tempo</div>
     <button class="btn" id="sgo">▶ Avvia (velocità ×10)</button></div></div>`,

  documenti: () => `<div class="kick">La cartella del ponteggio</div><h2>Sei documenti che devono essere in cantiere</h2>
   <div class="docs">
    <div class="dc"><div class="e">📕</div><b>Autorizzazione ministeriale</b><p>copia, per ogni tipo di ponteggio (art. 131). Si rinnova ogni 10 anni (fabbricante).</p></div>
    <div class="dc"><div class="e">📘</div><b>Libretto</b><p>istruzioni, schemi tipo, carichi, ancoraggi, verifiche (art. 134).</p></div>
    <div class="dc"><div class="e">📐</div><b>Disegno esecutivo</b><p>com'è montato QUESTO ponteggio, conforme agli schemi tipo.</p></div>
    <div class="dc hl"><div class="e">🖋️</div><b>Progetto</b><p>firmato da ingegnere o architetto se &gt; 20 m o non conforme agli schemi tipo (art. 133).</p></div>
    <div class="dc hl"><div class="e">📗</div><b>PiMUS</b><p>Piano di Montaggio, Uso e Smontaggio (art. 136, All. XXII).</p></div>
    <div class="dc"><div class="e">✅</div><b>Verifiche e attestati</b><p>check-list All. XIX, attestati di formazione, idoneità sanitaria.</p></div></div>
   ${easy('Se manca un documento, il ponteggio <b>non si monta</b>. Se l\'ispettore chiede i documenti, devono essere lì, in cantiere.')}`,

  pimusdet: () => `<div class="kick">Il PiMUS</div><h2>Cosa c'è dentro il PiMUS (Allegato XXII)</h2>
   <div class="cols"><div><ol class="steps">
    <li>Dati del cantiere, dell'impresa e della <b>squadra</b> con il preposto</li>
    <li>Identificazione del ponteggio e <b>disegno esecutivo</b></li>
    <li>Progetto, se previsto</li>
    <li>Verifiche prima del montaggio (piano di appoggio, elementi, linee elettriche)</li>
    <li><b>Sequenza di montaggio, trasformazione e smontaggio</b>, con DPI e ancoraggi</li>
    <li>Regole per l'<b>uso</b> e verifiche durante l'uso</li>
    <li>Misure per la <b>sicurezza</b> della squadra e di chi passa sotto</li></ol></div>
    <div><div class="tf" id="tf"></div></div></div>`,

  progetto: () => `<div class="kick">Simulazione</div><h2>Serve il progetto firmato?</h2>
   <p>Spunta le caratteristiche del ponteggio del tuo cantiere.</p>
   <div class="cols"><div class="ctrl ck2" id="prj">
    <label><input type="checkbox" value="h"> Altezza oltre <b>20 m</b> dal piano di appoggio</label>
    <label><input type="checkbox" value="s"> Schema <b>diverso</b> dagli schemi tipo del libretto (sbalzi, campate speciali, ponti su mensole non previsti)</label>
    <label><input type="checkbox" value="t"> <b>Teli, reti o cartelloni</b> pubblicitari sulla facciata</label>
    <label><input type="checkbox" value="c"> Carichi non previsti: <b>argano/elevatore</b> fissato al ponteggio, depositi di materiale</label>
    <label><input type="checkbox" value="r"> Il ponteggio serve da <b>protezione per i lavori sul tetto</b></label>
    <label><input type="checkbox" value="m"> Si usano <b>elementi di marche diverse</b> insieme</label></div>
    <div id="prjOut" class="lres"></div></div>`,

  tipi: () => `<div class="kick">Il ponteggio pezzo per pezzo</div><h2>Tre famiglie di ponteggi fissi</h2>
   <div class="cols3">
    <div>${fig('giunto', '<b>PTG – tubi e giunti</b>: tubi uniti con giunti a vite. Molto flessibile, ma ogni giunto va serrato bene.', CC('Elsie esq.'))}</div>
    <div>${fig('facciata', '<b>PTP – telai prefabbricati</b>: telai ad "H" o a portale, veloci da montare. I più usati in facciata.', CC('ell brown'))}</div>
    <div>${fig('multidirezionale', '<b>PMTP – multidirezionale</b>: montanti con rosette, correnti a cuneo. Si adatta a forme complesse.', CRF)}</div></div>
   <div class="warn">Ogni sistema ha il <b>suo libretto</b>. <b>Non si mescolano</b> elementi di marche o tipi diversi se il libretto o un progetto non lo consentono (ponteggi "misti").</div>`,

  anat: () => `<div class="kick">Anatomia interattiva</div><h2>Tocca i numeri: come si chiama ogni pezzo?</h2>
   <div class="anat"><div id="anatSvg"></div><div id="anatInfo" class="ainfo"><b>Clicca su un numero</b><p>Scopri il nome del pezzo, a cosa serve e la regola che lo riguarda.</p></div></div>`,

  numeri: () => `<div class="kick">I numeri da ricordare</div><h2>Dieci misure, dieci regole</h2>
   <div class="nums">
    ${[['95 cm', 'altezza minima del parapetto nei ponteggi metallici', 'art. 138'], ['15 cm', 'altezza minima della tavola fermapiede', 'All. XVIII'], ['60 cm', 'luce massima tra correnti e tra fermapiede e corrente', 'All. XVIII'],
    ['20 cm', 'distanza massima tra impalcato e muro (misurata dalla tavola)', 'art. 138'], ['1 m', 'i montanti superano l\'ultimo impalcato (ponteggi metallici)', 'art. 138 / 125'], ['2,50 m', 'distanza massima del sottoponte di sicurezza', 'art. 128'],
    ['2 × 2', 'ancoraggi almeno ogni 2 piani e 2 montanti, a rombo (il libretto chiede spesso di più)', 'art. 125 c.6'], ['20 m', 'oltre questa altezza serve il progetto', 'art. 133'], ['12 m', 'mantovana parasassi al primo solaio e poi ogni 12 m', 'art. 129 c.3'], ['2 m', 'sopra questa altezza si è "in quota"', 'art. 107']]
      .map((n, i) => `<div class="num" style="animation-delay:${i * .07}s"><div class="v">${n[0]}</div><p>${n[1]}</p>${ref(n[2])}</div>`).join('')}</div>`,

  foto: () => `<div class="kick">Dal cantiere</div><h2>Le protezioni che si vedono</h2>
   <div class="cols3">
    <div>${fig('basette', 'Basette regolabili su <b>piano solido</b> e livellato', CRF)}</div>
    <div>${fig('parasassi', 'Mantovana <b>parasassi</b>: protegge chi passa sotto', CRF)}</div>
    <div>${fig('passaggio_pedonale', 'Passaggio pedonale protetto e segnalato', CRF)}</div>
    <div>${fig('scale_interne', 'Scale <b>interne</b> sfalsate per salire di piano', CRF)}</div>
    <div>${fig('recinzione', 'Area di cantiere <b>recintata</b> attorno al ponteggio', CRF)}</div>
    <div>${fig('cartello_carichi', 'Cartello "carichi sospesi" dove si sollevano materiali', CRF)}</div></div>`,

  prima: () => `<div class="kick">Prima di salire</div><h2>Check-list della squadra: si parte solo se è tutto verde</h2>
   <div class="ck" id="pre">${[['📗', 'PiMUS e disegno', 'in cantiere, aggiornati a questa fase'], ['🧱', 'Piano di appoggio', 'solido, livellato, nessun tombino o scavo sotto'], ['🚧', 'Area delimitata', 'nessuno passa sotto durante il montaggio'],
    ['⚡', 'Linee elettriche', 'distanze rispettate o linea messa fuori tensione'], ['🌬️', 'Meteo', 'vento entro il limite del PiMUS, niente temporali'], ['🦺', 'DPI controllati', 'imbracatura, cordino, casco con sottogola'],
    ['🔧', 'Attrezzi legati', 'chiavi e martelli con cordino: niente cade'], ['👷', 'Preposto presente', 'sorveglianza diretta, squadra formata']].map(c => `<label class="cki"><input type="checkbox"><span class="e">${c[0]}</span><span><b>${c[1]}</b><p>${c[2]}</p></span></label>`).join('')}</div>
   <div id="preOut" class="lres">0 / 8 controlli fatti: <b>non si sale</b>.</div>`,

  seq: () => `<div class="kick">Gioco: la sequenza di montaggio</div><h2>Metti in ordine le fasi</h2>
   <p>Clicca le fasi <b>nell'ordine giusto</b>. Poi premi <b>Controlla</b>.</p>
   <div class="seqgame"><div><h3>Fasi da ordinare</h3><div id="sqPool" class="pool"></div></div><div><h3>La tua sequenza</h3><ol id="sqAns" class="ans"></ol></div></div>
   <div class="qbar"><button class="btn" id="sqChk">Controlla</button><button class="btn sec" id="sqRst">Ricomincia</button><span id="sqRes" class="score" style="margin:0"></span></div>`,

  appoggi: () => `<div class="kick">Giusto o sbagliato?</div><h2>Gioco fotografico: tu lo faresti salire?</h2>
   <p>Per ogni foto scegli ✔ (giusto) o ✘ (sbagliato). Poi leggi la spiegazione.</p>
   <div class="gs" id="gsBox"></div><div id="gsScore" class="score"></div>`,

  impalcati: () => `<div class="kick">Il momento più pericoloso</div><h2>Montare il 1° e il 2° impalcato</h2>
   <div class="cols"><div class="card"><b>1° impalcato</b>
    <ul><li>Sotto i 2 m: si monta da terra o dal basso, con parapetto montato prima di salire.</li>
    <li>Sopra i 2 m, tre strade: <b>caduta trattenuta o limitata</b>; <b>parapetti provvisori (DPC)</b> montati dal basso; metodo del <b>"secondo telaio"</b> per avere più altezza libera.</li></ul></div>
    <div class="card"><b>2° impalcato</b>
    <ul><li><b>Linea vita</b> sui montanti all'altezza del piano di calpestio o a 1,5 m;</li>
    <li><b>Dispositivo retrattile</b> (EN 360) agganciato al montante sopra di te;</li>
    <li>oppure <b>parapetto di montaggio</b> anticipato dal piano sotto: la soluzione migliore.</li></ul></div></div>
   <div class="warn">Prima le <b>protezioni collettive</b> (parapetti che si montano dal piano inferiore), poi i DPI. Una caduta su DPI sollecita il ponteggio in modo non previsto dal calcolo: il PiMUS deve dire <b>dove</b> agganciarsi. ${ref('art. 111, 115 · Circ. MLPS 29/2010')}</div>`,

  ancoraggi: () => `<div class="kick">Gli ancoraggi</div><h2>Ciò che tiene il ponteggio attaccato al muro</h2>
   <div class="cols"><div><div class="cols" style="gap:12px">
    <div class="card"><b>✔ Ammessi (se nel libretto)</b><ul><li>a <b>tassello</b> con golfare, provato</li><li>a <b>cravatta</b> attorno a pilastri</li><li>ad <b>anello</b> / a "V" per forze maggiori</li><li>a <b>puntone</b> contro la facciata</li></ul></div>
    <div class="card" style="border-left-color:var(--ko)"><b>✘ Vietati</b><ul><li>ringhiere, inferriate, grondaie, pluviali</li><li><b>filo di ferro</b></li><li>tasselli non provati o su muro friabile</li></ul></div></div>
    <p>Gli ancoraggi si montano <b>man mano</b> che si sale e si tolgono <b>solo</b> quando si smonta il piano corrispondente. I tasselli si verificano con <b>prova di estrazione</b> secondo il libretto o il progetto.</p></div>
    <div>${fig('filo_ferro', 'Il filo di ferro serve per legare i tondini, <b>non</b> per ancorare un ponteggio', CRF)}</div></div>`,

  smontaggio: () => `<div class="kick">Lo smontaggio</div><h2>Smontare non è "montare al contrario e di corsa"</h2>
   <div class="cols"><div><ol class="steps">
    <li>Si segue il <b>PiMUS</b> anche nello smontaggio: stessa squadra formata, stesso preposto.</li>
    <li>Si lavora <b>dall'alto verso il basso</b>, un piano alla volta.</li>
    <li>Gli <b>ancoraggi</b> si tolgono solo quando si smonta quel piano: mai sganciare più piani prima.</li>
    <li>Gli elementi si <b>calano</b> con carrucola o argano o si passano a mano: <b>vietato gettarli</b>.</li>
    <li>L'area sotto resta <b>delimitata</b> fino alla fine.</li></ol></div>
    <div>${fig('groviglio', 'Un ponteggio senza ancoraggi o colpito dal vento diventa un groviglio di tubi', CC('wonderferret'))}</div></div>`,

  dpi: () => `<div class="kick">Il kit anticaduta</div><h2>DPI di III categoria: salvavita, se li sai usare</h2>
   <div class="dpi">${[['🦺', 'Imbracatura', 'EN 361 · attacco dorsale o sternale (A)'], ['🪢', 'Cordino + assorbitore', 'EN 354 + EN 355 · max 2 m'], ['🔄', 'Retrattile', 'EN 360 · si accorcia da solo'], ['🔗', 'Connettori', 'EN 362 · ghiera chiusa!'],
    ['📍', 'Punto di ancoraggio', 'EN 795 o previsto dal PiMUS'], ['⛑️', 'Casco con sottogola', 'EN 397 / EN 12492'], ['🧤', 'Guanti e scarpe', 'EN 388 · EN ISO 20345'], ['🧰', 'Kit di recupero', 'per il soccorso rapido']].map(d => `<div class="di"><div class="e">${d[0]}</div><b>${d[1]}</b><p>${d[2]}</p></div>`).join('')}</div>
   <div class="warn">Per i DPI di III categoria l'<b>addestramento è obbligatorio</b> (art. 77 c.5). L'imbracatura va <b>regolata</b>: deve entrare una mano piatta sotto i cosciali, non un pugno.</div>`,

  controllo: () => `<div class="kick">Controllo prima dell'uso</div><h2>Il mio DPI è a posto? Controlla tu</h2>
   <div class="cols"><div class="ck" id="dpick" style="grid-template-columns:1fr">${[['Fettucce', 'nessun taglio, bruciatura, sfilacciatura, macchia di vernice o acido'], ['Cuciture', 'integre, nessun filo tirato'], ['Fibbie e regolazioni', 'scorrono e bloccano bene'],
    ['Indicatore di caduta', 'NON aperto (se aperto: il DPI ha già lavorato, va eliminato)'], ['Connettori', 'ghiera che si chiude da sola e si blocca'], ['Etichetta', 'leggibile, data di fabbricazione e ultima ispezione periodica (almeno ogni 12 mesi, EN 365)']].map(c => `<label class="cki"><input type="checkbox"><span><b>${c[0]}</b><p>${c[1]}</p></span></label>`).join('')}</div>
    <div><div id="dpiOut" class="lres">Spunta i controlli fatti.</div>${easy('Un DPI che ha fermato una caduta <b>si butta</b>, anche se sembra nuovo. Un DPI che non sai controllare <b>non lo usi</b>: chiedi al preposto.')}</div></div>`,

  tirante: () => `<div class="kick">Simulazione</div><h2>Calcola il tirante d'aria</h2>
   <div class="cols"><div class="ctrl">
    <label>Altezza del punto di ancoraggio rispetto ai piedi: <b id="tHa"></b><input type="range" id="tA0" min="-0.5" max="1.8" step="0.1" value="0"></label>
    <label>A · lunghezza del cordino con assorbitore: <b id="tAv"></b><input type="range" id="tA" min="0.5" max="2" step="0.1" value="2"></label>
    <label>B · allungamento dell'assorbitore (dal manuale): <b id="tBv"></b><input type="range" id="tB" min="0" max="1.75" step="0.05" value="1.75"></label>
    <label>C · distanza tra attacco dell'imbracatura e piedi: <b>1,50 m</b></label>
    <label>D · spazio libero di sicurezza: <b>1,00 m</b></label>
    <label>Spazio libero disponibile sotto l'impalcato (fino al suolo o al primo ostacolo): <b id="tHv"></b><input type="range" id="tH" min="1" max="12" step="0.5" value="4"></label>
    <div id="tOut" class="lres"></div></div>
    <div id="tSvg" class="tsvg"></div></div>
   <p class="small">${ref('Formula del materiale del corso: TA = A + B + C + D, misurata dal punto di ancoraggio. Usa sempre i valori del manuale del tuo DPI.')}</p>`,

  uso: () => `<div class="kick">Durante l'uso</div><h2>Le regole di tutti i giorni</h2>
   <div class="cols"><div class="do"><h3>✔ Si fa</h3><ul>
    <li>Si sale dalle <b>scale interne</b> e si richiude la botola</li><li>Materiale sull'impalcato <b>solo quello che serve</b> e nei limiti di carico (art. 124)</li>
    <li>Si segnala subito una tavola rotta, un giunto lento, un parapetto mancante</li><li>Si lavora con casco con sottogola e attrezzi legati</li></ul></div>
    <div class="dont"><h3>✘ Non si fa</h3><ul><li>Togliere parapetti, tavole o ancoraggi "perché danno fastidio"</li><li>Salire sui parapetti o su scale e cavalletti sopra l'impalcato</li>
    <li>Saltare da un impalcato all'altro o correre</li><li>Montare teli, argani o cartelloni senza progetto</li></ul></div></div>
   <div class="warn">Chi <b>usa</b> il ponteggio (es. muratore, imbianchino) non è obbligato al corso da montatore, ma <b>non può modificarlo</b>: per ogni modifica serve la squadra formata.</div>`,

  verifiche: () => `<div class="kick">Le verifiche (Allegato XIX e art. 137)</div><h2>Il giro di controllo del preposto</h2>
   <div class="cyc">
    <div class="cs"><div class="n">1</div><div class="e">📦</div><b>Prima del montaggio</b><p>elementi integri, marchio del fabbricante (art. 135), niente ruggine profonda o tubi deformati</p></div>
    <div class="cs"><div class="n">2</div><div class="e">🏗️</div><b>Fine montaggio</b><p>conforme al disegno, parapetti completi, ancoraggi, basette, verbale prima dell'uso</p></div>
    <div class="cs"><div class="n">3</div><div class="e">🔁</div><b>Durante l'uso</b><p>ad intervalli periodici: verticalità, giunti serrati, ancoraggi, controventi</p></div>
    <div class="cs"><div class="n">4</div><div class="e">⛈️</div><b>Dopo eventi</b><p>vento forte, neve, urti, lunga pausa: verifica <b>prima</b> di far risalire qualcuno</p></div></div>
   <div class="cols" style="margin-top:14px"><div>${fig('morsetto_ruggine', 'Giunto arrugginito: va scartato, non "ancora per questa volta"', CC('Elsie esq.'))}</div>
   <div><p>L'art. 137 c.1: il preposto, <b>ad intervalli periodici o dopo violente perturbazioni atmosferiche o prolungata interruzione</b>, verifica verticalità dei montanti, serraggio dei giunti, efficienza di ancoraggi e controventi, e fa sostituire o rinforzare gli elementi inefficienti.</p></div></div>`,

  meteo: () => `<div class="kick">Simulazione</div><h2>Si sale o non si sale? Il semaforo del meteo</h2>
   <div class="cols"><div class="ctrl" id="met">
    <label>Vento (raffiche): <b id="mWv"></b><input type="range" id="mW" min="0" max="100" step="5" value="25"></label>
    <label>Limite del vento scritto nel PiMUS (esempio): <b id="mLv"></b><input type="range" id="mL" min="30" max="70" step="5" value="50"></label>
    <label>Pioggia <select id="mR"><option value="0">no</option><option value="1">leggera</option><option value="2">forte</option></select></label>
    <label><input type="checkbox" id="mT"> Temporale o fulmini in zona</label>
    <label><input type="checkbox" id="mI"> Ghiaccio o neve sugli impalcati</label>
    <label><input type="checkbox" id="mN"> Nebbia fitta / poca visibilità</label>
    <label>Ora: <b id="mHv"></b><input type="range" id="mH" min="6" max="20" step="0.5" value="10"></label>
    <label><input type="checkbox" id="mC"> Giornata di rischio caldo <b>alto</b> (bollettino regionale)</label>
    <label><input type="checkbox" id="mE"> C'è appena stata una tempesta</label></div>
    <div><div class="sem"><i id="sR"></i><i id="sY"></i><i id="sG"></i></div><div id="mOut" class="lres"></div></div></div>
   <p class="small">${ref('Art. 111 c.7: i lavori in quota si fanno solo se il meteo non mette in pericolo i lavoratori. I limiti numerici del vento non sono nella legge: li fissano il PiMUS e il libretto (Beaufort 6, circa 40–50 km/h, è un riferimento diffuso).')}</p>`,

  caldo: () => `<div class="kick">Il nuovo nemico: il caldo</div><h2>Ponteggio + sole + metallo = forno</h2>
   <div class="cols"><div><p>Sul ponteggio il sole picchia, i tubi scottano, l'imbracatura fa sudare. Il <b>colpo di calore</b> fa girare la testa: e sul ponteggio un capogiro è una caduta.</p>
    <ul><li><b>Protocollo quadro emergenze climatiche</b> del 2 luglio 2025: pause, acqua, zone d'ombra, turni anticipati.</li>
    <li>Molte <b>ordinanze regionali</b> vietano il lavoro al sole <b>dalle 12:30 alle 16:00</b> nei giorni di rischio alto.</li>
    <li>Acqua fresca sempre, pausa all'ombra, controllo a vicenda: <b>mai da soli</b>.</li>
    <li>Segni d'allarme: mal di testa, nausea, confusione, pelle calda e secca → all'ombra e <b>112</b>.</li></ul></div>
    <div class="heat">${'<svg viewBox="0 0 400 320">' + '<g transform="translate(0,60)">' + sky('#fff3e0') + ground() + sun(330, 0) + scaf(40, 220, { nb: 2, nl: 2, bw: 100 }) + worker(150, 92, { mood: 'worried', s: .8 }) + thermo(300, 200, '38°') + `<g class="drip"><circle cx="160" cy="-10" r="4" fill="#4fc3f7"/></g>` + '</g></svg>'}</div></div>`,

  elettrico: () => `<div class="kick">Elettricità e fulmini</div><h2>Linee elettriche e messa a terra</h2>
   <div class="cols"><div><h3>Distanze minime dalle linee aeree nude</h3>
    <table><tr><th>Tensione della linea</th><th>Distanza minima</th></tr><tr><td>fino a 1 kV (bassa tensione)</td><td><b>3 m</b></td></tr><tr><td>da 1 a 30 kV</td><td><b>3,5 m</b></td></tr><tr><td>da 30 a 132 kV</td><td><b>5 m</b></td></tr><tr><td>oltre 132 kV</td><td><b>7 m</b></td></tr></table>
    <p class="small">${ref('art. 117 e Allegato IX, tab. 1 · se non si rispettano: linea fuori tensione o barriere, d\'accordo con il gestore')}</p></div>
    <div><h3>Messa a terra</h3><p>Il ponteggio è una grande massa di metallo all'aperto. La messa a terra <b>non è automatica</b>: il datore di lavoro valuta se serve per i <b>fulmini</b> (art. 84) e per i <b>contatti indiretti</b> se ci sono apparecchi elettrici fissati al ponteggio.</p>
    <div class="stop">⚡ Temporale in arrivo: <b>si scende subito</b>, anche se il ponteggio è messo a terra.</div></div></div>`,

  emergenza: () => `<div class="kick">Emergenza</div><h2>Qualcuno è appeso all'imbracatura: cosa fai?</h2>
   <div class="sf">
    <div class="sfi"><div class="e">📣</div><b>1. Allarme</b><p>Grida, chiama il preposto. Una persona chiama il <b>112</b> e dà l'indirizzo esatto del cantiere.</p></div>
    <div class="sfi"><div class="e">🛡️</div><b>2. Sicurezza</b><p>Chi soccorre si protegge: si aggancia e non diventa la seconda vittima.</p></div>
    <div class="sfi"><div class="e">⬇️</div><b>3. Recupero</b><p>Con il <b>kit di recupero</b> previsto dal piano: si porta la persona sull'impalcato o a terra in <b>pochi minuti</b>.</p></div>
    <div class="sfi"><div class="e">❤️</div><b>4. Primo soccorso</b><p>Gli addetti formati intervengono; si seguono le istruzioni del 112.</p></div></div>
   <div class="cols" style="margin-top:14px"><div class="call"><div class="ch">Chi? Con cosa? Chi chiama?</div><p>Il piano di emergenza (DVR/POS) deve dire <b>chi</b> recupera, con <b>quale attrezzatura</b> e <b>chi</b> chiama i soccorsi. Le prove di recupero si fanno <b>prima</b> che serva.</p></div>
   <div>${easy('Non aspettare i Vigili del Fuoco senza fare niente: i minuti contano. Ma non salire senza protezione: due feriti sono peggio di uno.')}</div></div>`,

  caccia: () => `<div class="kick">Gioco finale</div><h2>Caccia all'errore: trova gli 8 sbagli</h2>
   <p>Clicca sui punti del disegno dove vedi un errore. Trovati: <b id="spN">0</b> / 8 <button class="btn sec" id="spShow" style="margin-left:10px;padding:4px 10px">Mostra soluzioni</button></p>
   <div class="spot"><div id="spSvg"></div><ol id="spList" class="splist"></ol></div>`,

  docente: () => `<div class="kick">Per il docente</div><h2>Note sul test fornito: correzioni fatte</h2>
   <p class="small">Il test di verifica di questo corso riprende le 10 domande del file "Test aggiornamento ponteggi" con alcune correzioni normative:</p>
   <table class="small"><tr><th>Domanda</th><th>Nel test originale</th><th>Correzione</th></tr>
   <tr><td>intestazione, D5</td><td>aggiornamento "quinquennale" secondo ASR 2025</td><td>aggiornamento <b>ogni 4 anni</b>, minimo 4 h (3 tecnico-pratiche), All. XXI; l'ASR 2025 non disciplina il corso ponteggi</td></tr>
   <tr><td>D6</td><td>parapetto ≥ 1 m; resistenza 1,5 kN/m</td><td>ponteggi metallici: corrente superiore ≥ <b>95 cm</b> (art. 138), luci ≤ 60 cm, fermapiede ≥ 15 cm; le resistenze sono quelle del libretto/UNI EN 12811, non un valore fisso di 1,5 kN/m</td></tr>
   <tr><td>D7, D8</td><td>art. 136 c.5</td><td>verifiche dopo eventi e periodiche: <b>art. 137 c.1</b> (preposto)</td></tr>
   <tr><td>D3, D9</td><td>"libretto INAIL (ora INAIL)"</td><td>l'autorizzazione è del <b>Ministero del Lavoro</b> (art. 131), rinnovo decennale</td></tr>
   <tr><td>D9</td><td>"filo doppio ritorto" come ancoraggio ammesso</td><td>solo ancoraggi del <b>libretto o del progetto</b>; il filo di ferro non è un ancoraggio (anche il materiale del corso lo indica come vietato)</td></tr>
   <tr><td>D2</td><td>Forza 6 Beaufort come obbligo</td><td>valore <b>indicativo</b>: il limite lo fissano PiMUS e libretto (art. 111 c.7)</td></tr>
   <tr><td>D1</td><td>All. XVIII p. 2.2.6</td><td>divieto di salire dai montanti: <b>art. 138</b>; scale non in prosecuzione: art. 113</td></tr>
   <tr><td>D10</td><td>mantovana "nella parte bassa"</td><td>parasassi: <b>art. 129 c.3</b>, al primo solaio e poi ogni 12 m</td></tr></table>`,

  crediti: () => `<div class="kick">Crediti e fonti</div><h2>Immagini e riferimenti</h2>
   <div class="cols"><div><h3>Foto con licenza Creative Commons</h3><ul class="small">${CRED.map(c => `<li><a href="${c.url}" target="_blank" rel="noopener">"${c.title}"</a> di ${c.creator} – CC ${c.lic.toUpperCase()} ${c.ver}</li>`).join('')}</ul>
    <p class="small">Altre foto: materiale fotografico del corso ponteggi. Vignette, infografiche e simulazioni: disegni originali in SVG.</p></div>
    <div><h3>Fonti normative</h3><ul class="small"><li>D.Lgs. 81/2008 e s.m.i., artt. 19, 20, 26, 27, 36, 37, 77, 84, 107–138, Allegati IX, XVIII, XIX, XXI, XXII</li>
    <li>Accordo Stato-Regioni 17/04/2025 (Rep. 59/CSR) e FAQ ministeriali</li><li>Circolari MLPS 85/1978, 44/1990, 132/1991, 46/2000, 25/2006, 29/2010; Interpello 16/2015</li>
    <li>Protocollo quadro emergenze climatiche, 2 luglio 2025</li><li>D.L. 159/2025 (badge di cantiere)</li><li>Regione Piemonte – schede ponteggi fissi e ancoraggi; Regione Emilia-Romagna – Ponteggi di facciata (2021)</li>
    <li>UNI EN 12810, 12811, 74, 13374; EN 361, 354, 355, 360, 362, 365, 795</li></ul></div></div>`
};

/* ---------------- DATI DEI GIOCHI ---------------- */
const SEQ = ['Controllo PiMUS, libretto e disegno esecutivo', 'Delimito l\'area e verifico il piano di appoggio', 'Posiziono ripartitori e basette regolabili', 'Monto i primi telai e li metto in bolla',
  'Monto correnti e diagonali', 'Posiziono impalcato, fermapiede e parapetti del 1° piano', 'Realizzo gli ancoraggi man mano che salgo', 'Salgo al piano successivo protetto (DPC o DPI)', 'Verifica finale e consegna prima dell\'uso'];
const GS = [
  ['appoggio_lastre', 0, 'Ponteggio appoggiato su una copertura in lastre ondulate: non ha capacità portante (e magari è cemento-amianto). Sbagliato.'],
  ['basette', 1, 'Basette regolabili su un piano solido: corretto. Su terreno serve una tavola ripartitrice (almeno 5 cm) sotto più montanti.'],
  ['appoggio_detriti', 0, 'Montanti su detriti e terra smossa: il piano di posa può cedere. Va livellato, compattato e ripartito.'],
  ['parasassi', 1, 'Mantovana parasassi: protegge chi passa sotto dalla caduta di oggetti. Corretto (art. 129 c.3).'],
  ['morsetto_ruggine', 0, 'Giunto molto arrugginito e tubo corroso: elemento da scartare (All. XIX, verifiche prima del montaggio).'],
  ['passaggio_pedonale', 1, 'Passaggio pedonale protetto e segnalato sotto il ponteggio: corretto.'],
  ['trave', 0, 'Lavoratore su una trave in quota senza alcuna protezione contro la caduta. In Italia: vietato (artt. 111, 115).'],
  ['scale_interne', 1, 'Scale interne sfalsate tra un piano e l\'altro: è il modo giusto per salire.']
];
const SPOTS = [
  { x: 205, y: 408, t: 'Basetta appoggiata su un <b>mattone forato</b>', r: 'Si usano basette e ripartitori previsti dal libretto, su piano solido (All. XVIII).' },
  { x: 380, y: 268, t: 'Manca la <b>tavola fermapiede</b> al 2° piano', r: 'Fermapiede alto almeno 15 cm su tutti i lati verso il vuoto.' },
  { x: 470, y: 142, t: 'Manca il <b>parapetto</b> all\'ultimo piano', r: 'Parapetto ≥ 95 cm con corrente intermedio (art. 126, 138).' },
  { x: 598, y: 250, t: 'Lavoratore che <b>sale dal montante</b>', r: 'Vietato salire o scendere lungo i montanti (art. 138): si usano le scale interne.' },
  { x: 140, y: 205, t: 'Ancoraggio con <b>filo di ferro</b> al pluviale', r: 'Ancoraggi solo del tipo previsto da libretto o progetto; vietati pluviali e filo di ferro.' },
  { x: 300, y: 330, t: '<b>Materiale accumulato</b> sull\'impalcato', r: 'Sugli impalcati solo il materiale necessario e nei limiti di carico (art. 124).' },
  { x: 420, y: 70, t: 'Tubo <b>gettato</b> dall\'alto', r: 'Vietato gettare elementi del ponteggio (art. 138): si calano con carrucola o a mano.' },
  { x: 700, y: 400, t: 'Passante <b>sotto il ponteggio</b>, area non delimitata', r: 'Durante montaggio e smontaggio l\'area sotto va delimitata; in uso servono parasassi e passaggi protetti.' }
];
const ANAT = [
  { x: 95, y: 452, n: 'Ripartitore (tavola)', d: 'Distribuisce il carico sul terreno. Tavola di legno di almeno 5 cm o elemento previsto dal libretto (Circ. 29/2010).' },
  { x: 128, y: 432, n: 'Basetta regolabile', d: 'Piede del montante, regolabile per mettere in bolla. Mai su mattoni o detriti.' },
  { x: 128, y: 300, n: 'Montante', d: 'L\'elemento verticale. Supera di almeno 1 m l\'ultimo impalcato. Vietato arrampicarsi.' },
  { x: 230, y: 236, n: 'Diagonale (controvento)', d: 'Rende rigida la facciata del ponteggio. Non si toglie mai "per passare".' },
  { x: 330, y: 254, n: 'Impalcato', d: 'Il piano di lavoro: tavole metalliche bloccate o di legno ben fissate, senza spazi; distanza dal muro ≤ 20 cm.' },
  { x: 430, y: 236, n: 'Tavola fermapiede', d: 'Alta almeno 15 cm: impedisce a piedi, attrezzi e materiali di scivolare giù.' },
  { x: 260, y: 186, n: 'Corrente intermedio', d: 'A metà altezza del parapetto: la luce libera tra gli elementi non supera 60 cm.' },
  { x: 360, y: 154, n: 'Corrente superiore (parapetto)', d: 'Alto almeno 95 cm dal piano dell\'impalcato nei ponteggi metallici.' },
  { x: 548, y: 205, n: 'Ancoraggio', d: 'Collega il ponteggio all\'edificio: almeno ogni 2 piani e 2 montanti, a rombo; il libretto può chiederne di più.' },
  { x: 470, y: 300, n: 'Scala interna e botola', d: 'Per salire tra i piani. Scale sfalsate, botola sempre richiusa.' },
  { x: 60, y: 254, n: 'Mantovana parasassi', d: 'Tettoia inclinata verso l\'esterno: protegge dalla caduta di oggetti chi passa sotto.' },
  { x: 330, y: 352, n: 'Sottoponte di sicurezza', d: 'Piano sotto quello di lavoro, a non più di 2,50 m, per fermare una caduta (art. 128).' }
];
const TF = [['Il PiMUS si può copiare da un altro cantiere se il ponteggio è della stessa marca.', 0], ['Il PiMUS deve descrivere anche lo smontaggio.', 1], ['Il PiMUS lo redige una persona competente scelta dal datore di lavoro.', 1], ['Il PiMUS serve solo sopra i 20 metri.', 0]];

/* ---------------- LOGICA DEI GIOCHI ---------------- */
const HOOKS = {
  gloss() { document.querySelectorAll('#gloss tr[data-i]').forEach(r => r.onclick = e => { if (e.target.tagName !== 'INPUT') r.classList.toggle('hl'); }); },
  sosp() {
    let t0 = null, raf = null; const span = 20 * 60;
    const tick = now => { if (!t0) t0 = now; const s = Math.min(span, (now - t0) / 1000 * 10); const m = Math.floor(s / 60), ss = Math.floor(s % 60);
      $('scount').textContent = `${m}:${String(ss).padStart(2, '0')}`; $('shand').style.transform = `rotate(${s / 60 * 360}deg)`; $('sfill').style.width = (s / span * 100) + '%';
      $('sfill').style.background = s < 180 ? '#43a047' : s < 600 ? '#fb8c00' : '#c62828';
      $('smsg').innerHTML = s < 60 ? 'Appeso e cosciente: chiama aiuto, muovi le gambe.' : s < 180 ? 'Pochi minuti: il recupero deve partire <b>adesso</b>.' : s < 600 ? 'Le gambe trattengono il sangue: rischio di <b>perdita di coscienza</b>.' : 'Troppo tardi per un recupero improvvisato: <b>serviva un piano</b>.';
      if (s < span && document.getElementById('scount')) raf = requestAnimationFrame(tick); };
    $('sgo').onclick = () => { t0 = null; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick); };
  },
  tf() {
    $('tf').innerHTML = '<h3>Vero o falso?</h3>' + TF.map((q, i) => `<div class="tfq" id="tf${i}"><p>${q[0]}</p><button class="btn sec" data-v="1">Vero</button> <button class="btn sec" data-v="0">Falso</button><span class="r"></span></div>`).join('');
    TF.forEach((q, i) => document.querySelectorAll(`#tf${i} button`).forEach(b => b.onclick = () => { const ok = +b.dataset.v === q[1]; const el = $('tf' + i); el.className = 'tfq ' + (ok ? 'ok' : 'ko'); el.querySelector('.r').textContent = ok ? ' ✔ giusto' : ' ✘ no: ' + (q[1] ? 'è vero' : 'è falso'); }));
  },
  prj() {
    const upd = () => { const v = [...document.querySelectorAll('#prj input:checked')].map(i => i.value);
      const need = v.filter(x => 'hstcr'.includes(x)), mix = v.includes('m');
      let h = need.length ? `<b style="color:var(--ko)">Serve il PROGETTO</b> firmato da ingegnere o architetto abilitato (art. 133), con calcolo e disegno esecutivo, da tenere in cantiere (art. 134).<ul>${need.map(x => '<li>' + { h: 'altezza oltre 20 m', s: 'schema diverso dagli schemi tipo', t: 'teli e cartelloni aumentano la spinta del vento', c: 'carichi e apparecchi di sollevamento non previsti (montanti rinforzati, All. XVIII 3.3)', r: 'protezione per lavori in copertura non prevista dallo schema tipo' }[x] + '</li>').join('')}</ul>`
        : '<b style="color:var(--ok)">Basta il disegno esecutivo</b> conforme agli schemi tipo del libretto, insieme al PiMUS e alla copia dell\'autorizzazione.';
      if (mix) h += '<div class="stop" style="margin-top:8px">Ponteggio misto: elementi di tipi diversi si usano insieme solo se previsto e verificato (in genere con progetto).</div>';
      $('prjOut').innerHTML = h; };
    document.querySelectorAll('#prj input').forEach(i => i.onchange = upd); upd();
  },
  anat() {
    const svg = `<svg viewBox="0 0 700 480">${facade(560, 470, 140, 420)}<rect x="0" y="466" width="700" height="14" fill="#c8b08a"/>` +
      `<g transform="translate(0,0)">${scaf(128, 470, { nb: 4, nl: 3, bw: 100, lh: 116, top: 60 })}</g>` +
      `<path d="M128,290 L40,250 M40,250 L40,258 M128,300 L46,262" stroke="${STEEL2}" stroke-width="4"/><rect x="34" y="244" width="100" height="6" fill="${PLANK}" transform="rotate(24 128 290)"/>` +
      `<rect x="96" y="462" width="440" height="8" fill="#8d6e63"/>` +
      `<g stroke="#455a64" stroke-width="4"><line x1="452" y1="354" x2="490" y2="238"/><line x1="470" y1="354" x2="508" y2="238"/></g><rect x="452" y="236" width="56" height="6" fill="#ffca28"/>` +
      `<line x1="528" y1="205" x2="560" y2="205" stroke="#37474f" stroke-width="6"/><circle cx="560" cy="205" r="7" fill="#37474f"/>` +
      ANAT.map((a, i) => `<g class="hs2" data-i="${i}"><circle cx="${a.x}" cy="${a.y}" r="15"/><text x="${a.x}" y="${a.y + 5}" text-anchor="middle">${i + 1}</text></g>`).join('') + '</svg>';
    $('anatSvg').innerHTML = svg;
    document.querySelectorAll('.hs2').forEach(g => g.onclick = () => { const a = ANAT[+g.dataset.i]; document.querySelectorAll('.hs2').forEach(x => x.classList.remove('on')); g.classList.add('on'); g.classList.add('seen');
      $('anatInfo').innerHTML = `<b>${+g.dataset.i + 1}. ${a.n}</b><p>${a.d}</p><p class="small">Visti: ${document.querySelectorAll('.hs2.seen').length} / ${ANAT.length}</p>`; });
  },
  pre() { const upd = () => { const n = document.querySelectorAll('#pre input:checked').length; $('preOut').innerHTML = n === 8 ? '8 / 8: <b style="color:var(--ok)">si può iniziare</b>, sotto la sorveglianza del preposto.' : `${n} / 8 controlli fatti: <b style="color:var(--ko)">non si sale</b>.`; $('preOut').className = 'lres ' + (n === 8 ? 'go' : ''); };
    document.querySelectorAll('#pre input').forEach(i => i.onchange = upd); },
  seq() {
    let ans = []; const order = SEQ.map((s, i) => i).sort(() => Math.random() - .5);
    const draw = () => { $('sqPool').innerHTML = order.filter(i => !ans.includes(i)).map(i => `<button class="chip" data-i="${i}">${SEQ[i]}</button>`).join('') || '<p class="small">Tutte le fasi sono in sequenza. Premi Controlla.</p>';
      $('sqAns').innerHTML = ans.map(i => `<li data-i="${i}" title="clicca per togliere">${SEQ[i]}</li>`).join('');
      document.querySelectorAll('#sqPool .chip').forEach(b => b.onclick = () => { ans.push(+b.dataset.i); draw(); });
      document.querySelectorAll('#sqAns li').forEach(l => l.onclick = () => { ans = ans.filter(x => x !== +l.dataset.i); draw(); }); $('sqRes').textContent = ''; };
    $('sqChk').onclick = () => { let ok = 0; document.querySelectorAll('#sqAns li').forEach((l, k) => { const g = +l.dataset.i === k; if (g) ok++; l.className = g ? 'ok' : 'ko'; });
      $('sqRes').innerHTML = ans.length < SEQ.length ? 'Completa prima tutta la sequenza.' : ok === SEQ.length ? '<span style="color:var(--ok)">Perfetto! 9 su 9 🏆</span>' : `${ok} / ${SEQ.length} al posto giusto. Quelle in rosso vanno spostate.`; };
    $('sqRst').onclick = () => { ans = []; draw(); }; draw();
  },
  gs() {
    let done = 0, good = 0;
    $('gsBox').innerHTML = GS.map((g, i) => `<div class="gsc" id="gs${i}"><img src="img/${g[0]}.jpg" alt=""><div class="gb"><button class="btn ok" data-v="1">✔ giusto</button><button class="btn ko" data-v="0">✘ sbagliato</button></div><p class="gx">${g[2]}</p></div>`).join('');
    GS.forEach((g, i) => document.querySelectorAll(`#gs${i} button`).forEach(b => b.onclick = () => { const el = $('gs' + i); if (el.classList.contains('done')) return; const ok = +b.dataset.v === g[1];
      el.classList.add('done', ok ? 'right' : 'wrong'); done++; if (ok) good++; $('gsScore').textContent = `Risposte giuste: ${good} / ${done}` + (done === GS.length ? (good >= 7 ? ' – occhio da preposto! 👀' : ' – ripassiamo insieme le foto.') : ''); }));
  },
  dpick() { const upd = () => { const n = document.querySelectorAll('#dpick input:checked').length; $('dpiOut').innerHTML = n === 6 ? '<b style="color:var(--ok)">DPI controllato: puoi usarlo.</b>' : `${n} / 6 controlli: <b>non ancora</b>.`; }; document.querySelectorAll('#dpick input').forEach(i => i.onchange = upd); },
  tirante() {
    const f = v => v.toFixed(2).replace('.', ',') + ' m';
    const upd = () => { const ha = +$('tA0').value, A = +$('tA').value, B = +$('tB').value, C = 1.5, D = 1, H = +$('tH').value;
      $('tHa').textContent = (ha >= 0 ? '+' : '') + f(ha); $('tAv').textContent = f(A); $('tBv').textContent = f(B); $('tHv').textContent = f(H);
      const TA = A + B + C + D, avail = H + ha, ok = avail >= TA;
      $('tOut').className = 'lres ' + (ok ? 'go' : 'nogo');
      $('tOut').innerHTML = `Tirante d'aria necessario: <b>${f(TA)}</b> sotto il punto di ancoraggio.<br>Spazio disponibile sotto l'ancoraggio: <b>${f(avail)}</b>.<br>` +
        (ok ? '<b style="color:var(--ok)">✔ OK: il sistema ti ferma prima di toccare terra.</b>' : `<b style="color:var(--ko)">✘ Toccheresti terra (o l'ostacolo) prima dell'arresto!</b> Mancano ${f(TA - avail)}: usa un retrattile, un ancoraggio più alto o un cordino più corto (trattenuta).`) +
        (ha < 0.5 ? '<br><span class="small">Ancoraggio in basso: la caduta libera è lunga e lo strappo più forte. Meglio agganciarsi sopra la testa.</span>' : '');
      const sc = 22, top = 30, ax = 150, ay = top + 20, gy = ay + avail * sc;
      const bar = (y0, h, c, t) => `<rect x="${ax + 60}" y="${y0}" width="26" height="${h * sc}" fill="${c}"/><text x="${ax + 92}" y="${y0 + h * sc / 2 + 4}" font-size="12">${t}</text>`;
      let y = ay; const segs = [[A, '#ef5350', 'A cordino'], [B, '#ffa726', 'B assorbitore'], [C, '#42a5f5', 'C corpo'], [D, '#66bb6a', 'D sicurezza']];
      let bars = ''; segs.forEach(s => { bars += bar(y, s[0], s[1], s[2] + ' ' + f(s[0])); y += s[0] * sc; });
      const H2 = Math.max(gy, y) + 30;
      $('tSvg').innerHTML = `<svg viewBox="0 0 380 ${H2}" style="max-height:440px"><rect x="0" y="${gy}" width="380" height="${H2 - gy}" fill="#c8b08a" opacity=".55"/><rect x="0" y="${gy}" width="380" height="3" fill="#6d4c41"/><text x="4" y="${gy + 16}" font-size="12" fill="#3e2723">suolo / ostacolo</text><rect x="0" y="${ay + ha * sc}" width="120" height="8" fill="${PLANK}" stroke="${STEEL2}"/><text x="4" y="${ay + ha * sc - 6}" font-size="12">impalcato</text>` +
        `<line x1="${ax}" y1="0" x2="${ax}" y2="${H2}" stroke="#90a4ae" stroke-dasharray="4 4"/><circle cx="${ax}" cy="${ay}" r="7" fill="#37474f"/><text x="${ax - 8}" y="${ay - 10}" font-size="12" text-anchor="end">ancoraggio</text>` + bars + (ok ? '' : `<text x="${ax - 8}" y="${gy - 6}" font-size="14" font-weight="700" fill="#c62828" text-anchor="end">💥 impatto</text>`) + '</svg>'; };
    ['tA0', 'tA', 'tB', 'tH'].forEach(id => $(id).oninput = upd); upd();
  },
  meteo() {
    const upd = () => { const w = +$('mW').value, L = +$('mL').value, r = +$('mR').value, h = +$('mH').value; $('mWv').textContent = w + ' km/h'; $('mLv').textContent = L + ' km/h';
      $('mHv').textContent = `${Math.floor(h)}:${h % 1 ? '30' : '00'}`;
      const red = [], yel = [];
      if ($('mT').checked) red.push('⚡ Temporale: si scende <b>subito</b> dal ponteggio.');
      if (w > L) red.push(`💨 Vento ${w} km/h oltre il limite del PiMUS (${L} km/h): stop a montaggio, smontaggio e lavori in quota.`); else if (w > L * .8) yel.push('💨 Vento vicino al limite: niente teli, attenzione agli elementi lunghi, il preposto controlla spesso.');
      if ($('mI').checked) red.push('🧊 Ghiaccio o neve: prima si puliscono gli impalcati, poi si sale.');
      if (r === 2) red.push('🌧️ Pioggia forte: superfici scivolose, visibilità bassa: stop.'); else if (r === 1) yel.push('🌦️ Pioggia leggera: impalcati scivolosi, scarpe adatte, niente attrezzi elettrici esposti.');
      if ($('mN').checked) yel.push('🌫️ Nebbia: il gruista e la squadra non si vedono: segnali e comunicazioni via radio, o stop.');
      if ($('mC').checked && h >= 12.5 && h < 16) red.push('🌡️ Rischio caldo alto tra le 12:30 e le 16:00: stop al lavoro al sole (ordinanze regionali).'); else if ($('mC').checked) yel.push('🌡️ Caldo: acqua, pause all\'ombra, controllo reciproco; anticipare il turno.');
      if ($('mE').checked) red.push('🔍 Dopo la tempesta: il preposto <b>verifica</b> montanti, giunti, ancoraggi e controventi prima di far salire (art. 137).');
      const st = red.length ? 'R' : yel.length ? 'Y' : 'G';
      ['R', 'Y', 'G'].forEach(k => $('s' + k).classList.toggle('on', k === st));
      $('mOut').className = 'lres ' + (st === 'G' ? 'go' : st === 'R' ? 'nogo' : '');
      $('mOut').innerHTML = (st === 'G' ? '<b style="color:var(--ok)">VERDE: si lavora</b>, sempre con il controllo del preposto.' : st === 'Y' ? '<b style="color:#e65100">GIALLO: si lavora con cautela</b>' : '<b style="color:var(--ko)">ROSSO: non si sale</b>') +
        (red.length || yel.length ? '<ul>' + red.concat(yel).map(x => '<li>' + x + '</li>').join('') + '</ul>' : ''); };
    document.querySelectorAll('#met input,#met select').forEach(i => { i.oninput = upd; i.onchange = upd; }); upd();
  },
  caccia() {
    const found = new Set();
    const svg = `<svg viewBox="0 0 800 460"><rect width="800" height="460" fill="#e8f4fb"/>${cloud(80, 40)}${cloud(560, 30)}` +
      `<rect x="80" y="20" width="560" height="420" fill="#e9d9c3" stroke="#c9b79e"/>` + [0, 1, 2].map(j => [0, 1, 2, 3, 4, 5, 6].map(i => `<rect x="${110 + i * 76}" y="${340 - j * 120}" width="34" height="50" fill="#9cc3d9" stroke="#8c7b62"/>`).join('')).join('') +
      `<rect x="120" y="20" width="10" height="420" fill="#90a4ae"/>` +
      `<rect x="0" y="420" width="800" height="40" fill="#c8b08a"/><rect x="0" y="420" width="800" height="4" fill="#6d6d6d"/>` +
      `<g>${scaf(205, 420, { nb: 3, nl: 3, bw: 130, lh: 118, top: 50, miss: ['base0', 'toe2', 'rail3', 'mid3'] })}</g>` +
      `<path d="M140,205 Q170,196 205,205" stroke="#9e9e9e" stroke-width="2.5" fill="none"/><path d="M140,210 Q172,214 205,210" stroke="#9e9e9e" stroke-width="2" fill="none"/>` +
      `<g>${[0, 1, 2].map(i => `<rect x="${270 + i * 26}" y="${282 - i * 4}" width="24" height="20" fill="#bcaaa4" stroke="#8d6e63"/>`).join('')}<rect x="276" y="262" width="60" height="16" fill="#e0e0e0" stroke="#9e9e9e"/><rect x="284" y="246" width="44" height="16" fill="#e0e0e0" stroke="#9e9e9e"/></g>` +
      worker(440, 66, { s: .9, mood: 'smug', arm: 'up' }) + `<g class="fly">${tube(470, 40, 80, -40)}</g>` +
      `<g transform="translate(600,300) rotate(-4)">${worker(0, 0, { s: .9, mood: 'smug', arm: 'both' })}</g>` +
      worker(700, 420, { vest: '#7e57c2', helmet: false, mood: 'happy', s: .9 }) +
      SPOTS.map((s, i) => `<g class="hs" data-i="${i}"><circle cx="${s.x}" cy="${s.y}" r="30"/></g>`).join('') + '</svg>';
    $('spSvg').innerHTML = svg;
    const list = () => { $('spList').innerHTML = SPOTS.map((s, i) => found.has(i) ? `<li class="f">${s.t}<br><span class="small">${s.r}</span></li>` : '<li class="q">?</li>').join(''); $('spN').textContent = found.size; };
    document.querySelectorAll('.hs').forEach(g => g.onclick = () => { found.add(+g.dataset.i); g.classList.add('found'); list(); if (found.size === SPOTS.length) toast('Tutti trovati! Occhio da preposto 👀'); });
    $('spShow').onclick = () => { SPOTS.forEach((s, i) => found.add(i)); document.querySelectorAll('.hs').forEach(g => g.classList.add('found')); list(); };
    list();
  }
};

/* ---------------- VERIFICA FINALE ---------------- */
const QUIZ = [
  { q: 'Come si sale in sicurezza da un piano all\'altro del ponteggio?', o: ['Con scale a pioli esterne appoggiate alla facciata del ponteggio', 'Arrampicandosi sui montanti: è il modo più veloce', 'Con le scale interne del ponteggio, sfalsate, richiudendo la botola; è vietato salire lungo i montanti'], a: 2, e: 'Art. 138 (divieto di salire e scendere lungo i montanti) e art. 113 (scale non in prosecuzione una dell\'altra).' },
  { q: 'Quando si devono sospendere montaggio, smontaggio e trasformazione del ponteggio?', o: ['Quando vento, temporali, pioggia forte, neve, ghiaccio o poca visibilità mettono a rischio la sicurezza; i limiti del vento sono scritti nel PiMUS e nel libretto', 'Mai: decide il caposquadra se c\'è da finire', 'Solo se cadono fulmini nel cantiere'], a: 0, e: 'Art. 111 c.7. Forza 6 Beaufort (circa 40–50 km/h) è un riferimento indicativo; il limite operativo lo fissano PiMUS e libretto. Con temporale si scende subito.' },
  { q: 'Cos\'è l\'autorizzazione ministeriale del ponteggio?', o: ['Non esiste più: basta la marcatura CE', 'Serve solo sopra i 30 metri', 'L\'autorizzazione del Ministero del Lavoro per ogni tipo di ponteggio metallico fisso (rinnovo ogni 10 anni); in cantiere va tenuta la copia con il libretto e gli schemi tipo'], a: 2, e: 'Artt. 131 e 134. L\'autorizzazione la rilascia il Ministero del Lavoro (non l\'INAIL) e il rinnovo decennale è un obbligo del fabbricante.' },
  { q: 'Il caposquadra ti chiede di smontare un tratto senza il PiMUS aggiornato: "ormai sai come si fa". Cosa fai?', o: ['Non inizi: lo smontaggio segue il PiMUS (sequenza, ancoraggi, DPI) e va fatto sotto la sorveglianza del preposto', 'Procedi: è il montaggio al contrario', 'Inizi e leggi il PiMUS solo se trovi problemi'], a: 0, e: 'Art. 136 c.1 e c.6: PiMUS per montaggio, uso, trasformazione e smontaggio, sotto la diretta sorveglianza del preposto.' },
  { q: 'Chi può montare, trasformare e smontare un ponteggio?', o: ['Chiunque abbia almeno 3 anni di esperienza in edilizia', 'Solo chi ha fatto il corso dell\'Allegato XXI (28 ore con prova pratica) e l\'aggiornamento ogni 4 anni', 'Solo chi ha il patentino della Cassa Edile'], a: 1, e: 'Art. 136 c.6–8 e Allegato XXI: aggiornamento quadriennale di almeno 4 ore, di cui 3 tecnico-pratiche.' },
  { q: 'Com\'è fatto il parapetto di un ponteggio metallico?', o: ['Basta il corrente superiore a 1 m', 'Corrente superiore ad almeno 95 cm, corrente intermedio (luci non oltre 60 cm) e tavola fermapiede di almeno 15 cm', 'È sufficiente un corrente a 80 cm'], a: 1, e: 'Art. 126, art. 138 e Allegato XVIII. La resistenza dei parapetti è definita dal libretto e dalle norme UNI EN.' },
  { q: 'Una tavola dell\'impalcato è incrinata per 40 cm. Il collega dice che "tiene". Cosa fai?', o: ['Metti un\'altra tavola sopra per rinforzarla', 'Non ci cammini, segnali subito al preposto e si sostituisce prima di riusare l\'impalcato', 'Passi veloce distribuendo il peso'], a: 1, e: 'Art. 20 (segnalare), art. 137 (sostituzione degli elementi inefficienti) e Allegato XIX.' },
  { q: 'Dopo un vento fortissimo, cosa si fa prima di risalire sul ponteggio?', o: ['Il preposto verifica verticalità dei montanti, serraggio dei giunti, efficienza di ancoraggi e controventi e fa sostituire gli elementi danneggiati', 'Niente, se a occhio sembra a posto', 'Serve solo se la Protezione Civile ha dichiarato calamità'], a: 0, e: 'Art. 137 c.1: verifiche periodiche e dopo violente perturbazioni atmosferiche o prolungata interruzione del lavoro.' },
  { q: 'Durante il montaggio i tasselli sono finiti. Il collega propone il filo di ferro e il caposquadra approva. Cosa fai?', o: ['Rifiuti e segnali: si usano solo gli ancoraggi previsti dal libretto o dal progetto; si aspettano i materiali', 'Accetti: decide il caposquadra', 'Lo usi solo negli ultimi piani dove il carico è minore'], a: 0, e: 'Artt. 125 c.6 e 134, libretto del ponteggio. Il filo di ferro e gli ancoraggi "di fortuna" a ringhiere e pluviali non sono ammessi.' },
  { q: 'Un bullone cade dal piano di sopra e ti sfiora la testa. Cosa fai?', o: ['Niente: non è successo niente', 'Ne parli solo con il collega', 'Lo segnali al preposto come quasi-infortunio e controlli casco, fermapiede, reti e parasassi'], a: 2, e: 'Art. 20 c.2: segnalare le situazioni di pericolo. I near miss sono il campanello d\'allarme. Parasassi: art. 129 c.3.' },
  { q: 'Cordino 2 m, allungamento assorbitore 1,75 m, attacco-piedi 1,5 m, spazio di sicurezza 1 m: qual è il tirante d\'aria?', o: ['3,50 m', '6,25 m', '2,00 m'], a: 1, e: 'TA = A + B + C + D = 2 + 1,75 + 1,5 + 1 = 6,25 m sotto il punto di ancoraggio.' },
  { q: 'Un collega resta appeso immobile all\'imbracatura. Quanto tempo c\'è?', o: ['Pochi minuti: il recupero deve partire subito, secondo il piano di emergenza', 'Si possono aspettare i soccorsi con calma: l\'imbracatura lo tiene', 'Il pericolo c\'è solo se è ferito'], a: 0, e: 'Sindrome da sospensione inerte: peggiora in pochi minuti. Il piano di emergenza deve prevedere chi recupera, con quali mezzi e chi chiama il 112.' },
  { q: 'A che distanza minima si deve stare da una linea elettrica aerea in bassa tensione (fino a 1 kV)?', o: ['1 metro', '3 metri', '30 centimetri'], a: 1, e: 'Art. 117 e Allegato IX, tabella 1: 3 m fino a 1 kV; 3,5 m fino a 30 kV; 5 m fino a 132 kV; 7 m oltre.' },
  { q: 'Puoi appoggiare una basetta su un mattone forato per mettere in bolla il ponteggio?', o: ['Sì, se il mattone è nuovo', 'No: si usano basette regolabili e ripartitori previsti dal libretto, su un piano solido', 'Sì, ma solo al piano terra'], a: 1, e: 'Allegato XVIII e libretto: il piede dei montanti poggia su elementi di ripartizione adeguati al piano di posa (Circ. 29/2010).' }
];

/* ---------------- MODULI ---------------- */
const MODULES = [
  { t: 'Benvenuto', s: [{ fn: S.cover }, { fn: S.agenda }, { fn: S.patto }, { fn: S.gloss, after: 'gloss' }, { fn: COMICS.zio, comic: true }] },
  { t: 'Regole e ruoli', s: [{ fn: S.leggi }, { fn: S.ruoli }, { fn: S.formazione }, { fn: S.novita }] },
  { t: 'La caduta dall\'alto', s: [{ fn: S.perche }, { fn: () => FALL_HTML(), after: 'fall' }, { fn: S.cadute }, { fn: S.sosp, after: 'sosp' }, { fn: COMICS.attimo, comic: true }] },
  { t: 'Documenti e PiMUS', s: [{ fn: S.documenti }, { fn: S.pimusdet, after: 'tf' }, { fn: S.progetto, after: 'prj' }, { fn: COMICS.pimus, comic: true }] },
  { t: 'Il ponteggio pezzo per pezzo', s: [{ fn: S.tipi }, { fn: S.anat, after: 'anat' }, { fn: S.numeri }, { fn: S.foto }] },
  { t: 'Montaggio e smontaggio', s: [{ fn: S.prima, after: 'pre' }, { fn: S.seq, after: 'seq' }, { fn: S.appoggi, after: 'gs' }, { fn: S.impalcati }, { fn: S.ancoraggi }, { fn: COMICS.filo, comic: true }, { fn: S.smontaggio }, { fn: COMICS.lancio, comic: true }, { fn: COMICS.ragno, comic: true }] },
  { t: 'DPI e tirante d\'aria', s: [{ fn: S.dpi }, { fn: S.controllo, after: 'dpick' }, { fn: S.tirante, after: 'tirante' }, { fn: COMICS.aggancio, comic: true }] },
  { t: 'Uso, verifiche, meteo', s: [{ fn: S.uso }, { fn: S.verifiche }, { fn: S.meteo, after: 'meteo' }, { fn: COMICS.vento, comic: true }, { fn: S.caldo }, { fn: S.elettrico }] },
  { t: 'Emergenza', s: [{ fn: S.emergenza }] },
  { t: 'Caccia all\'errore', s: [{ fn: S.caccia, after: 'caccia' }] },
  { t: 'Verifica finale', s: [{ quiz: true }] },
  { t: 'Docente e crediti', s: [{ fn: S.docente }, { fn: S.crediti }] }
];

/* simulazione caduta */
function FALL_HTML() {
  return `<div class="kick">Simulazione</div><h2>Da quanto in alto? La fisica non perdona</h2>
   <div class="cols"><div class="ctrl"><label>Altezza di caduta: <b id="fHv"></b><input type="range" id="fH" min="0.5" max="20" step="0.5" value="2"></label>
    <div class="fstats"><div><span id="fT"></span><small>secondi per arrivare a terra</small></div><div><span id="fV"></span><small>velocità all'impatto</small></div><div><span id="fE"></span><small>energia (lavoratore + attrezzi 90 kg)</small></div></div>
    <div id="fMsg" class="lres"></div><button class="btn" id="fGo">⬇ Fai cadere il manichino</button></div>
    <div class="fallbox"><svg viewBox="0 0 260 420" id="fSvg"><rect width="260" height="420" fill="#e8f4fb"/><rect x="0" y="396" width="260" height="24" fill="#c8b08a"/><g id="fScale"></g><g id="fMan">${worker(0, 0, { s: .55, mood: 'shock', arm: 'both' })}</g></svg></div></div>`;
}
HOOKS.fall = () => {
  const top = 20, bot = 396, px = (bot - top) / 20;
  $('fScale').innerHTML = Array.from({ length: 11 }, (_, i) => `<line x1="20" y1="${bot - i * 2 * px}" x2="40" y2="${bot - i * 2 * px}" stroke="#90a4ae"/><text x="44" y="${bot - i * 2 * px + 4}" font-size="11" fill="#607d8b">${i * 2} m</text>`).join('') + `<line x1="30" y1="${top}" x2="30" y2="${bot}" stroke="#90a4ae"/>`;
  const man = $('fMan'); const place = h => { man.style.transition = 'none'; man.style.transform = `translate(160px,${bot - h * px}px)`; };
  const upd = () => { const h = +$('fH').value, t = Math.sqrt(2 * h / 9.81), v = Math.sqrt(2 * 9.81 * h), kmh = v * 3.6, E = 90 * 9.81 * h / 1000;
    $('fHv').textContent = h.toString().replace('.', ',') + ' m'; $('fT').textContent = t.toFixed(2).replace('.', ','); $('fV').textContent = Math.round(kmh) + ' km/h'; $('fE').textContent = E.toFixed(1).replace('.', ',') + ' kJ';
    $('fMsg').innerHTML = `Il tempo di reazione di una persona è circa <b>0,7 s</b>. ${t < 0.75 ? 'Tocchi terra <b>prima ancora di accorgerti</b> che stai cadendo.' : 'Hai appena il tempo di capire cosa succede.'} L'impatto è come essere investiti da un'auto a <b>${Math.round(kmh)} km/h</b>.`;
    place(h); };
  $('fH').oninput = upd; upd();
  $('fGo').onclick = () => { const h = +$('fH').value, t = Math.sqrt(2 * h / 9.81); place(h); man.getBoundingClientRect();
    requestAnimationFrame(() => { man.style.transition = `transform ${t}s cubic-bezier(.33,0,.67,.33)`; man.style.transform = `translate(160px,${bot}px)`; });
    setTimeout(() => { if ($('fH')) { toast('💥 ' + (t).toFixed(2).replace('.', ',') + ' s'); } }, t * 1000); };
};

const CRED = [{"f": "facciata", "title": "Lightwoods House - Lightwoods Park, Bearwood", "creator": "ell brown", "lic": "by", "ver": "2.0", "url": "https://www.flickr.com/photos/39415781@N06/5562667256"}, {"f": "morsetto_ruggine", "title": "Clamped!", "creator": "Elsie esq.", "lic": "by", "ver": "2.0", "url": "https://www.flickr.com/photos/61132483@N00/130898288"}, {"f": "giunto", "title": "Scaffold", "creator": "Elsie esq.", "lic": "by", "ver": "2.0", "url": "https://www.flickr.com/photos/61132483@N00/2966732108"}, {"f": "trave", "title": "Steel Worker Houston Texas 1", "creator": "billjacobus1", "lic": "by", "ver": "2.0", "url": "https://www.flickr.com/photos/67513462@N00/122497423"}, {"f": "groviglio", "title": "Storm damage", "creator": "wonderferret", "lic": "by", "ver": "2.0", "url": "https://www.flickr.com/photos/65555826@N00/767360429"}];
const COURSES = { pont: { name: 'Corso ponteggi', full: 'Addetti ponteggi · sintesi 2 h', modules: MODULES, quiz: QUIZ } };
const NOTES = {};
