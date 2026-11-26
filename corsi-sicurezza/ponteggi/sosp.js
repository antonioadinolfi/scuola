/* ============================================================
   SINDROME DA SOSPENSIONE – infografica del corpo, segnali, cosa fare,
   cronometro, vignetta satirica e foto
   ============================================================ */
CRED.push(
  { f: 'imbracature_formazione', title: 'Harness training', creator: 'OregonDOT', lic: 'by', ver: '2.0', url: 'https://www.flickr.com/photos/oregondot/9311569930' },
  { f: 'recupero_barella', title: 'Rope Rescue Training 1', creator: 'Mount Rainier NPS', lic: 'by', ver: '2.0', url: 'https://www.flickr.com/photos/mountrainiernps/8225611442' }
);

/* corpo appeso con cosciali che comprimono e sangue che si accumula nelle gambe */
function bodySVG() {
  return `<svg viewBox="0 0 540 470" class="bodysvg">
  <defs><linearGradient id="legBlood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3c9a8"/><stop offset=".35" stop-color="#f3c9a8"><animate attributeName="offset" values=".9;.35;.35" dur="6s" repeatCount="indefinite"/></stop><stop offset=".6" stop-color="#7e57c2"><animate attributeName="offset" values="1;.6;.6" dur="6s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#4527a0"/></linearGradient>
  <radialGradient id="brainG"><stop offset="0" stop-color="#f48fb1"><animate attributeName="stop-color" values="#f48fb1;#f48fb1;#bdbdbd" dur="6s" repeatCount="indefinite"/></stop><stop offset="1" stop-color="#ec407a"><animate attributeName="stop-color" values="#ec407a;#ec407a;#9e9e9e" dur="6s" repeatCount="indefinite"/></stop></radialGradient></defs>
  <rect width="540" height="470" fill="#f5f8fb" rx="10"/><g transform="translate(40,0)">
  <circle cx="210" cy="16" r="7" fill="#263238"/><line x1="210" y1="22" x2="210" y2="74" stroke="#d32f2f" stroke-width="4"/>
  <g transform="rotate(6 210 200)">
   <circle cx="200" cy="112" r="32" fill="#f3c9a8"/><ellipse cx="200" cy="104" rx="17" ry="13" fill="url(#brainG)" opacity=".9"/>
   <path d="M186,121 q14,-6 28,0" stroke="#5d4037" stroke-width="2.5" fill="none"/>
   <rect x="160" y="148" width="84" height="120" rx="20" fill="#ff8c1a"/>
   <path d="M168,155 L236,262 M236,155 L168,262" stroke="#1565c0" stroke-width="7"/>
   <circle cx="210" cy="76" r="5" fill="#ffca28" stroke="#333" stroke-width="2"/>
   <path d="M210,80 L205,150" stroke="#1565c0" stroke-width="6"/>
   <g class="heart"><path d="M193,190 c-10,-14 -30,-2 -18,14 l18,18 l18,-18 c12,-16 -8,-28 -18,-14z" fill="#e53935"/></g>
   <rect x="166" y="268" width="32" height="160" rx="13" fill="url(#legBlood)"/>
   <rect x="206" y="268" width="32" height="160" rx="13" fill="url(#legBlood)"/>
   <rect x="160" y="282" width="44" height="12" rx="4" fill="#1565c0"/><rect x="200" y="282" width="44" height="12" rx="4" fill="#1565c0"/>
   <rect x="166" y="428" width="34" height="14" rx="5" fill="#37474f"/><rect x="206" y="428" width="34" height="14" rx="5" fill="#37474f"/>
   <path d="M150,120 q-14,60 4,110 M258,120 q14,60 -4,110" stroke="#ff8c1a" stroke-width="16" fill="none" stroke-linecap="round"/>
  </g></g>
  <g font-size="14" font-family="Source Sans 3,sans-serif" fill="#263238">
   <circle cx="30" cy="290" r="13" fill="#0d233a"/><text x="30" y="295" text-anchor="middle" fill="#fff" font-weight="700">1</text>
   <text x="50" y="286" font-weight="700">I cosciali</text><text x="50" y="303">stringono le vene</text><line x1="160" y1="292" x2="200" y2="290" stroke="#263238"/>
   <circle cx="30" cy="380" r="13" fill="#0d233a"/><text x="30" y="385" text-anchor="middle" fill="#fff" font-weight="700">2</text>
   <text x="50" y="376" font-weight="700">Il sangue resta</text><text x="50" y="393">nelle gambe ferme</text><line x1="170" y1="382" x2="206" y2="380" stroke="#263238"/>
   <circle cx="350" cy="212" r="13" fill="#0d233a"/><text x="350" y="217" text-anchor="middle" fill="#fff" font-weight="700">3</text>
   <text x="370" y="208" font-weight="700">Al cuore</text><text x="370" y="225">torna poco sangue</text><line x1="337" y1="212" x2="268" y2="208" stroke="#263238"/>
   <circle cx="350" cy="100" r="13" fill="#0d233a"/><text x="350" y="105" text-anchor="middle" fill="#fff" font-weight="700">4</text>
   <text x="370" y="96" font-weight="700">Il cervello</text><text x="370" y="113">resta senza ossigeno</text><line x1="337" y1="100" x2="258" y2="102" stroke="#263238"/>
   <text x="270" y="462" text-anchor="middle" font-size="13" fill="#5e35b1">animazione: il viola che sale = sangue che ristagna</text></g></svg>`;
}

S.sospA = () => `<div class="kick">Dopo la caduta · 1</div><h2>Sindrome da sospensione: il pericolo quando il DPI ha funzionato</h2>
 <div class="cols sospcols"><div>${bodySVG()}</div>
 <div><p>Il DPI ti ha fermato: bene. Ma se resti <b>appeso e immobile</b> (svenuto, ferito o bloccato), il corpo va in difficoltà in pochi minuti. Si chiama <b>sindrome da sospensione inerte</b> o "da imbraco".</p>
  <div class="sosptypes"><div><b>🟡 Sospensione cosciente</b><p>Sei sveglio ma appeso a lungo: le cinghie comprimono le vene delle gambe e il sangue torna male al cuore.</p></div>
  <div><b>🔴 Sospensione inerte</b><p>Hai perso conoscenza e non muovi le gambe: le funzioni vitali peggiorano rapidamente. È la situazione più grave.</p></div></div>
  ${fig('imbracature_formazione', 'Imbracatura della <b>taglia giusta</b> e ben regolata: si prova in formazione, non il giorno della caduta', CC('OregonDOT'))}
  <p class="small">${ref('Materiale del corso, slide 38–39 · INAIL, "Il primo soccorso nei luoghi di lavoro"')}</p></div></div>`;

S.sospB = () => `<div class="kick">Dopo la caduta · 2</div><h2>Riconoscere i segnali e agire: ogni minuto conta</h2>
 <div class="cols3 sosp3">
  <div class="card sg"><b>👀 I segnali d'allarme</b><ul><li>giramenti di testa, nausea</li><li>vampate di calore, sudore</li><li>formicolio o gambe intorpidite</li><li>vista che si annebbia, ansia</li><li>sensazione di svenire</li></ul></div>
  <div class="card sg"><b>🦵 Se sei tu appeso</b><ul><li><b>chiama</b> subito aiuto</li><li><b>muovi le gambe</b>, spingi con i piedi contro il ponteggio</li><li>usa le <b>fettucce anti-trauma</b> (se l'imbracatura le ha): ci appoggi i piedi come su un gradino</li><li>alza le ginocchia verso il petto</li></ul></div>
  <div class="card sg"><b>🛟 Se soccorri</b><ul><li>allarme e <b>112</b> con indirizzo esatto</li><li>ti proteggi prima tu (DPI, ancoraggio)</li><li>liberi la persona <b>il prima possibile</b> con il kit del piano di recupero</li><li>se non puoi subito: aiutala a <b>sollevare le gambe</b></li><li>a terra: <b>primo soccorso normale</b>, persona sdraiata</li></ul></div></div>
 <div class="cols" style="margin-top:12px"><div class="clockbox"><div class="clock" id="sclock"><div class="hand" id="shand"></div><div class="cc" id="scount">0:00</div></div>
   <div class="sbar"><span id="sfill"></span></div><div id="smsg" class="smsg">Premi ▶ per vedere quanto passa in fretta il tempo</div><button class="btn" id="sgo">▶ Avvia (velocità ×10)</button></div>
  <div>${fig('recupero_barella', 'Recupero in parete con barella: le tecniche si provano <b>prima</b> dell\'emergenza', CC('Mount Rainier NPS'))}
   <div class="warn" style="margin-top:8px"><b>Aggiornamento:</b> un tempo si diceva di tenere la persona seduta dopo il recupero. L'HSE britannico, dopo una revisione della letteratura (RR708, 2009), indica di seguire il <b>normale primo soccorso</b>: persona in posizione orizzontale e valutazione delle funzioni vitali.</div></div></div>`;

COMICS.sosp = () => strip({
  title: 'Il DPI ha funzionato. E adesso?',
  panels: [
    panel(sky() + ground() + scaf(40, 220, { nb: 3, nl: 3, bw: 90, lh: 58 }) + `<circle cx="310" cy="-16" r="5" fill="#263238"/><line x1="310" y1="-16" x2="352" y2="108" stroke="#d32f2f" stroke-width="3"/>` + `<g transform="translate(350,165) rotate(6)">${worker(0, 0, { s: .62, mood: 'happy', arm: 'up' })}${harness(0, 0, .62)}</g>`,
      [{ x: 2, y: 3, w: 52, txt: 'Fermato! Il cordino ha funzionato. Tiratemi su!', t: 'br' }]),
    panel(sky() + ground() + worker(90, 220, { mood: 'worried', arm: 'phone' }) + worker(250, 220, { flip: true, mood: 'shock', arm: 'both', vest: '#7e57c2' }) + `<g transform="translate(330,40)"><circle r="26" fill="#fff" stroke="#263238" stroke-width="3"/><line x1="0" y1="0" x2="0" y2="-18" stroke="#c62828" stroke-width="3" class="tick"/><text y="44" text-anchor="middle" font-size="14" font-weight="700" fill="#c62828">+12 min</text></g>`,
      [{ x: 2, y: 3, w: 46, txt: 'Il kit di recupero? È nel furgone di Gino...', t: 'br' }, { x: 40, y: 48, w: 44, txt: 'E Gino dov\'è?! Al bar!', t: 'bl', shout: true }]),
    panel(sky() + ground() + scaf(40, 220, { nb: 3, nl: 3, bw: 90, lh: 58 }) + `<circle cx="310" cy="-16" r="5" fill="#263238"/><line x1="310" y1="-16" x2="352" y2="108" stroke="#d32f2f" stroke-width="3"/>` + `<g transform="translate(350,165) rotate(10)" opacity=".85">${worker(0, 0, { s: .62, mood: 'worried', arm: 'down', vest: '#bdbdbd' })}${harness(0, 0, .62)}</g>` + `<text x="368" y="80" font-size="20" fill="#5e35b1" font-weight="700">z z</text>` + worker(110, 220, Object.assign({ arm: 'stop' }, BOSS)),
      [{ x: 2, y: 3, w: 56, txt: 'Il piano di recupero si prepara PRIMA. Non quando sei già appeso.', t: 'br' }])
  ],
  moral: 'Un DPI anticaduta senza <b>piano di recupero</b> salva dalla caduta ma non dalla sospensione. Il piano dice <b>chi</b> interviene, <b>con quale kit</b> (sempre in cantiere, non nel furgone) e <b>chi chiama il 112</b>. E si prova.'
});

/* sostituzione nel modulo 2 */
(() => { const m = MODULES[2]; const i = m.s.findIndex(x => x.fn === S.sosp);
  m.s.splice(i, 1, { fn: S.sospA }, { fn: S.sospB, after: 'sosp' }, { fn: COMICS.sosp, comic: true }); })();
