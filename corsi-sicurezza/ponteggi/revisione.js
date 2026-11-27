/* ============================================================
   REVISIONE "AULA": percorso snello per lavoratori edili (anche stranieri)
   su cantieri di Roma. Ogni slide ha:
   - key  = il messaggio da portare a casa (una frase, sempre visibile)
   - nota = traccia e riferimenti per il docente (visibili solo in "modalità docente")
   La normativa di dettaglio va nell'appendice per il docente.
   ============================================================ */
const PM = 'Esempio di PiMUS e tavola grafica forniti dal docente';
CRED.push({ f: 'pimus', title: 'Relazione PiMUS e Tavola grafica (esempio)', creator: 'materiale del docente', lic: '', ver: '', url: '#' });

/* ---------- slide riscritte ---------- */
S.cover = () => `<div class="cover pc" style="background-image:linear-gradient(120deg,rgba(13,35,58,.93) 0%,rgba(13,35,58,.78) 55%,rgba(13,35,58,.35) 100%),url(img/facciata.jpg)">
  <div class="ctag">Corso addetti ponteggi · 2 ore</div>
  <h2>Ponteggi: montare, usare, smontare.<br>E tornare a casa.</h2>
  <div class="sub">Per chi lavora sui ponteggi nei cantieri di Roma</div>
  <div class="stripe"></div>
  <ul><li>Poche regole, spiegate con disegni, foto e prove pratiche</li><li>Un PiMUS vero da leggere insieme</li><li>Parole chiave in 5 lingue</li></ul></div>`;

S.agenda = () => `<div class="kick">Come funziona</div><h2>Oggi: 10 tappe, una domanda per ognuna</h2>
  <div class="steps10">${[['⚖️', 'Chi decide le regole?'], ['⬇️', 'Perché si cade, e cosa succede dopo?'], ['📗', 'Come si legge un PiMUS?'], ['🔩', 'Come si chiamano i pezzi?'], ['🏗️', 'In che ordine si monta?'],
    ['🦺', 'Il mio DPI mi ferma in tempo?'], ['🌦️', 'Oggi si sale o no?'], ['🚑', 'Se un collega resta appeso?'], ['🔍', 'Trovi gli errori?'], ['📝', 'Test finale']].map((x, i) => `<div><span>${x[0]}</span><b>${i + 1}</b><p>${x[1]}</p></div>`).join('')}</div>
  ${easy('Se una parola non è chiara, alza la mano. Le domande fanno parte del corso.')}`;

S.patto = () => `<div class="kick">Patto d'aula</div><h2>Parliamo la stessa lingua</h2>
  <div class="cols3">
   <div class="card big1"><span>🗣️</span><b>Frasi corte</b><p>Una regola, una frase. Se non capisci, <b>chiedi</b>.</p></div>
   <div class="card big1"><span>👀</span><b>Prima l'immagine</b><p>Guarda il disegno o la foto, poi leggi.</p></div>
   <div class="card big1"><span>✋</span><b>Il gesto STOP</b><p>Mano aperta: vale in tutte le lingue e chiunque può usarlo.</p></div></div>`;

S.regole3 = () => `<div class="kick">Le regole, in breve</div><h2>Tre "libri" comandano sul ponteggio</h2>
  <div class="three">
   <div class="tb"><div class="e">⚖️</div><b>La legge</b><p>Vale per tutti i cantieri d'Italia (e viene da una direttiva europea).</p><small>D.Lgs. 81/2008</small></div><div class="arr">➜</div>
   <div class="tb"><div class="e">📘</div><b>Il libretto</b><p>Le istruzioni del fabbricante: come si monta <b>quel</b> ponteggio.</p><small>autorizzazione del Ministero</small></div><div class="arr">➜</div>
   <div class="tb hl"><div class="e">📗</div><b>Il PiMUS</b><p>Il piano del <b>tuo</b> cantiere: chi monta, in che ordine, con quali DPI.</p><small>scritto per questo cantiere</small></div></div>
  <div class="bigrule">Se i tre dicono cose diverse, vale la regola <b>più sicura</b>. Se hai un dubbio, ti fermi e chiedi al <b>preposto</b>.</div>`;

S.novita = () => `<div class="kick">Cosa è cambiato</div><h2>Quattro novità che ti riguardano</h2>
  <div class="nov4">
   <div><span>🪪</span><b>Patente a crediti</b><p>L'impresa nel cantiere deve averla. Incidenti e violazioni tolgono punti.</p></div>
   <div><span>🏷️</span><b>Badge di cantiere</b><p>Oltre al tesserino: serve a sapere chi è in cantiere e chi non dovrebbe esserci.</p></div>
   <div><span>🌡️</span><b>Caldo nel Lazio</b><p>Nei giorni a rischio alto: niente lavoro al sole dalle <b>12:30 alle 16:00</b>.</p></div>
   <div><span>🌍</span><b>La lingua</b><p>Prima del corso si verifica che tu capisca l'italiano. Se serve, c'è un mediatore.</p></div></div>`;

S.caldo = () => `<div class="kick">Il caldo di Roma</div><h2>Ponteggio + sole + metallo = forno</h2>
  <div class="cols"><div>
   <div class="nov4" style="grid-template-columns:1fr 1fr"><div><span>⏰</span><b>12:30 – 16:00</b><p>Nei giorni a rischio <b>alto</b> della mappa Worklimate, nel Lazio è vietato il lavoro prolungato al sole.</p></div>
   <div><span>💧</span><b>Acqua e ombra</b><p>Bevi spesso, anche senza sete. Pause all'ombra.</p></div>
   <div><span>👥</span><b>Mai da solo</b><p>Controllatevi a vicenda: chi ha caldo non se ne accorge.</p></div>
   <div><span>🚨</span><b>Segnali</b><p>Mal di testa, nausea, confusione: subito all'ombra e <b>112</b>.</p></div></div></div>
   <div class="heat">${'<svg viewBox="0 0 400 320">' + '<g transform="translate(0,60)">' + sky('#fff3e0') + ground() + sun(330, 0) + scaf(40, 220, { nb: 2, nl: 2, bw: 100 }) + worker(150, 92, { mood: 'worried', s: .8 }) + thermo(300, 200, '38°') + `<g class="drip"><circle cx="160" cy="-10" r="4" fill="#4fc3f7"/></g>` + '</g></svg>'}</div></div>`;

/* ---------- PiMUS vero ---------- */
const PMSPOTS = [
  { x: 108, y: 985, n: 'Basette', d: '14 basette su elementi di ripartizione (tavole di 4–5 cm o piastre). Prima di montare, il preposto controlla il piano di appoggio.' },
  { x: 850, y: 868, n: 'Impalcato 1 a 2 m', d: '7 impalcati, uno ogni 2 m. Il primo è il più delicato: il PiMUS dice di montarlo con il retrattile agganciato a un traverso.' },
  { x: 925, y: 660, n: 'Mantovana parasassi', d: 'All\'impalcato 2, su tutte le 6 campate: protegge chi passa sotto (a Roma: passanti, turisti, negozi).' },
  { x: 590, y: 512, n: 'Trave carraia', d: 'All\'impalcato 4, campate 4–6: sotto resta libero un varco (ingresso, passo, vetrina). Si monta solo come da libretto.' },
  { x: 915, y: 380, n: 'Piazzola di carico', d: 'All\'impalcato 5, campata 2: l\'unico posto dove si appoggiano i materiali portati su con la gru o l\'argano.' },
  { x: 812, y: 500, n: 'Ancoraggi', d: '24 ancoraggi ad anello (in azzurro). Si montano man mano che si sale; non si tolgono finché non si smonta quel piano.' },
  { x: 110, y: 30, n: 'Montanti in sommità', d: 'Ultimo impalcato a 14 m, ponteggio alto 16 m: i montanti superano l\'ultimo piano per fare da parapetto.' },
  { x: 852, y: 1045, n: 'Larghezza e distanza dal muro', d: 'Larghezza 1,05 m, distanza dalla facciata 0,20 m: oltre 20 cm serve una protezione verso il muro.' },
  { x: 430, y: 1060, n: 'Campate', d: '6 campate da 1,80 m = 10,80 m di facciata.' }
];
const PMFASI = {
  qb: { t: '1° impalcato (quote basse)', m: 'Metodo: DPI retrattile agganciato a un traverso + "passamano"', f: [
    ['pm_qb1', 'Si crea un punto di ancoraggio su un traverso e si collega il retrattile. Poi si montano telai, telai-parapetto e correnti.'],
    ['pm_qb2', 'Da terra si montano tavole, diagonali, ancoraggi e la scala per salire.'],
    ['pm_qb3', 'Il lavoratore, sulla scala, aggancia il retrattile all\'imbracatura e solo dopo sale sull\'impalcato.'],
    ['pm_qb4', '"Passamano": i colleghi da sotto passano i pezzi a chi è in quota.'],
    ['pm_qb5', 'In quota si monta in quest\'ordine: telai, spine, telaio-parapetto, parapetto di testata, fermapiede.'],
    ['pm_qb6', 'Si sposta il retrattile più in alto e si completano tavole, diagonali, ancoraggi e scala del piano superiore.']] },
  qa: { t: 'Dal 2° impalcato (quote alte)', m: 'Metodo: DPI retrattile sul montante + argano al piano sotto', f: [
    ['pm_qa1', 'Dal piano sotto si monta un argano su un montante esterno.'],
    ['pm_qa2', 'Sempre dal piano sotto si crea l\'ancoraggio sul montante interno, vicino alla scala, e si collega il retrattile.'],
    ['pm_qa3', 'Sulla scala si aggancia il retrattile, poi si sale.'],
    ['pm_qa4', 'L\'argano porta su i pezzi, i colleghi li passano a chi è in quota.'],
    ['pm_qa5', 'Stesso ordine: telai, spine, telaio-parapetto, parapetto di testata, fermapiede.'],
    ['pm_qa6', 'Si completano correnti, tavole, diagonali, ancoraggi e scala. Poi si ripete per il piano dopo.']] }
};
const PMCHECK = [
  ['Preposto e squadra di montaggio', 'Nel PiMUS i nomi sono <b>vuoti</b>.', 2, 'Devono esserci i nomi di preposto e montatori formati: senza, non si sa chi può montare.'],
  ['Autorizzazione del ponteggio', 'Marca, modello, numero e data sono <b>vuoti</b>.', 2, 'Senza questi dati non si sa quale libretto usare. Vanno completati prima di montare.'],
  ['Classe di carico', 'Tutti gli impalcati sono in <b>classe 1</b> (0,75 kN/m²) per un rifacimento di facciata.', 1, 'La classe 1 è pensata per lavori leggeri. Prima di appoggiare sacchi e materiali sugli impalcati, chiedi qual è il carico ammesso.'],
  ['Sequenza di montaggio', 'Fasi descritte piano per piano, con retrattile e passamano.', 0, 'Va bene: è la parte più utile per la squadra. Si segue così.'],
  ['Regole d\'uso', 'Botole chiuse, vietato salire dai montanti, niente accumuli di materiale.', 0, 'Va bene: sono le regole che valgono ogni giorno.'],
  ['Il cantiere', 'È un cantiere di <b>Salerno</b> (via Roma 56). Noi lavoriamo a Roma.', 2, 'Il PiMUS vale solo per quel cantiere. Per un cantiere di Roma serve un PiMUS nuovo, con i suoi dati.']
];
const PMLAB = ['✔ va bene', '⚠ da chiedere', '✘ manca / non va'];

S.pimusVero = () => `<div class="kick">Un PiMUS vero</div><h2>Leggiamo insieme un PiMUS: cosa c'è dentro</h2>
  <div class="cols" style="grid-template-columns:1.1fr 1fr"><div>${fig('pimus_asso', 'Il ponteggio del PiMUS: facciata di 10,80 m, alto 16 m, 7 impalcati', PM)}</div>
  <div><div class="pmcard">
   <div><span>📍</span><b>Cantiere</b><p>Rifacimento di facciata di un condominio</p></div>
   <div><span>🏗️</span><b>Ponteggio</b><p>Telai prefabbricati, 6 campate, 7 impalcati, alto 16 m</p></div>
   <div><span>👷</span><b>Chi</b><p>Redattore, impresa, preposto, squadra</p></div>
   <div><span>🔢</span><b>Fasi</b><p>Montaggio e smontaggio, piano per piano, con foto</p></div>
   <div><span>🦺</span><b>DPI e attrezzi</b><p>Imbracatura, retrattile, cordini, chiavi, livella</p></div>
   <div><span>📏</span><b>Tavola grafica</b><p>Disegno con prospetti, pianta e materiali</p></div></div>
   ${easy('Sono 86 pagine, ma a te servono soprattutto tre cose: il <b>disegno</b>, le <b>fasi</b> e le <b>regole d\'uso</b>.')}</div></div>`;

S.pimusTav = () => `<div class="kick">Un PiMUS vero · la tavola</div><h2>Leggi il disegno: tocca i punti</h2>
  <div class="anat"><div class="pmtav"><img src="img/pimus_schema.jpg" alt="Prospetto frontale e laterale del ponteggio">${PMSPOTS.map((p, i) => `<button class="pmhs" style="left:${p.x / 982 * 100}%;top:${p.y / 1080 * 100}%" data-i="${i}">${i + 1}</button>`).join('')}</div>
  <div id="pmInfo" class="ainfo"><b>Tocca un numero</b><p>A sinistra il prospetto <b>frontale</b> (la facciata), a destra quello <b>laterale</b> (di fianco). Ogni riga orizzontale è un piano, ogni 2 m.</p></div></div>`;

S.pimusFasi = () => `<div class="kick">Un PiMUS vero · le fasi</div><h2>Come si monta, passo per passo</h2>
  <div class="pmtabs"><button class="chip on" data-k="qb">${PMFASI.qb.t}</button><button class="chip" data-k="qa">${PMFASI.qa.t}</button></div>
  <div class="pmfasi"><div class="pmimg"><img id="pmImg" alt=""><div class="pmnum" id="pmNum"></div></div>
   <div><p class="pmm" id="pmM"></p><p class="pmc" id="pmC"></p><div class="qbar" style="position:static"><button class="btn sec" id="pmP">← fase prima</button><button class="btn" id="pmN">fase dopo →</button></div>
   <div class="pmdots" id="pmDots"></div><p class="small">Immagini dal PiMUS di esempio.</p></div></div>`;

S.pimusCheck = () => `<div class="kick">Un PiMUS vero · controllo</div><h2>Il preposto lo legge così: va bene, da chiedere, manca</h2>
  <div class="pmck" id="pmCk">${PMCHECK.map((c, i) => `<div class="pmcr" id="pc${i}"><div><b>${c[0]}</b><p>${c[1]}</p></div><div class="pmb">${PMLAB.map((l, j) => `<button data-j="${j}">${l}</button>`).join('')}</div><p class="pmx">${c[3]}</p></div>`).join('')}</div>
  <div id="pmScore" class="score"></div>`;

Object.assign(HOOKS, {
  pimusTav() {
    document.querySelectorAll('.pmhs').forEach(b => b.onclick = () => { const p = PMSPOTS[+b.dataset.i]; document.querySelectorAll('.pmhs').forEach(x => x.classList.remove('on')); b.classList.add('on', 'seen');
      $('pmInfo').innerHTML = `<b>${+b.dataset.i + 1}. ${p.n}</b><p>${p.d}</p><p class="small">Visti: ${document.querySelectorAll('.pmhs.seen').length} / ${PMSPOTS.length}</p>`; });
  },
  pimusFasi() {
    let k = 'qb', i = 0;
    const show = () => { const F = PMFASI[k]; $('pmImg').src = `img/${F.f[i][0]}.jpg`; $('pmNum').textContent = `Fase ${i + 1} / ${F.f.length}`; $('pmM').textContent = F.m; $('pmC').textContent = F.f[i][1];
      $('pmDots').innerHTML = F.f.map((x, j) => `<i class="${j === i ? 'on' : ''}" data-j="${j}"></i>`).join(''); document.querySelectorAll('#pmDots i').forEach(d => d.onclick = () => { i = +d.dataset.j; show(); });
      $('pmP').disabled = i === 0; $('pmN').disabled = i === F.f.length - 1; };
    document.querySelectorAll('.pmtabs .chip').forEach(b => b.onclick = () => { k = b.dataset.k; i = 0; document.querySelectorAll('.pmtabs .chip').forEach(x => x.classList.toggle('on', x === b)); show(); });
    $('pmP').onclick = () => { if (i > 0) { i--; show(); } }; $('pmN').onclick = () => { if (i < PMFASI[k].f.length - 1) { i++; show(); } };
    show();
  },
  pimusCheck() {
    let n = 0, g = 0;
    PMCHECK.forEach((c, i) => document.querySelectorAll(`#pc${i} button`).forEach(b => b.onclick = () => { const el = $('pc' + i); if (el.classList.contains('done')) return;
      const ok = +b.dataset.j === c[2]; el.classList.add('done', ok ? 'right' : 'wrong'); b.classList.add(ok ? 'sel-ok' : 'sel-ko'); el.querySelector(`button[data-j="${c[2]}"]`).classList.add('sel-ok');
      n++; if (ok) g++; $('pmScore').textContent = `Giuste: ${g} / ${n}` + (n === PMCHECK.length ? (g >= 5 ? ' – occhio da preposto!' : ' – rivediamolo insieme.') : ''); }));
  }
});

/* semplifica il simulatore del tirante: i cursori stanno in "Cambia i valori" */
(() => { const orig = TA.sim; TA.sim = () => orig().replace('<label>Dispositivo', '<details class="adv"><summary>⚙️ Cambia i valori (per il docente)</summary><label>Dispositivo').replace('<p class="small">C = 1,50 m', '</details><p class="small">C = 1,50 m'); })();

/* ---------- note per il docente e messaggi chiave ---------- */
const K = (fn, key, nota, extra = {}) => Object.assign({ fn, key, nota }, extra);
const N = (...li) => '<ul>' + li.map(x => `<li>${x}</li>`).join('') + '</ul>';

const NEWMOD = [
  { t: 'Benvenuto', s: [
    K(S.cover, null, N('Presentazione del docente e giro di nomi: chiedere a ciascuno <b>da quanto lavora sui ponteggi</b> e in che lingua pensa.', 'Tasto <b>P</b> per la presentazione, <b>L</b> per il laser, <b>D</b> per mostrare/nascondere queste note.')),
    K(S.agenda, 'Dieci domande semplici: alla fine di ogni tappa saprai rispondere.', N('Tempi: benvenuto 6\', regole 10\', caduta 12\', PiMUS 16\', pezzi 10\', montaggio 18\', DPI 18\', meteo 12\', emergenza 5\', errori 5\', test 8\' = 120\'.', 'Il corso abilitante è di 28 h (All. XXI): queste 2 ore valgono come ripasso o modulo teorico dell\'aggiornamento (4 h, di cui 3 tecnico-pratiche).')),
    K(S.patto, 'Se non capisci, chiedi: in cantiere una parola sbagliata può costare cara.', N('Con lavoratori stranieri la formazione deve essere comprensibile (art. 36 c.4, art. 37 c.13 D.Lgs. 81/08); l\'ASR 17/04/2025 chiede la verifica preventiva della comprensione della lingua.', 'Proporre il gesto STOP e farlo fare a tutti.')),
    K(S.gloss, 'Queste 14 parole devono capirle tutti, in ogni lingua.', N('Far scrivere a ognuno la parola nella propria lingua nell\'ultima colonna.', 'Le traduzioni sono di servizio: farle controllare a un madrelingua.'), { after: 'gloss' }),
    { fn: COMICS.zio, comic: true, nota: N('Domanda all\'aula: "Chi ha imparato da un parente?" L\'esperienza conta, ma serve l\'attestato All. XXI.') }] },
  { t: 'Le regole, in breve', s: [
    K(S.regole3, 'Legge, libretto e PiMUS: se c\'è un dubbio, vale la regola più sicura.', N('D.Lgs. 81/08 Titolo IV Capo II (artt. 105–138), All. XVIII, XIX, XXI, XXII.', 'Origine europea: Dir. 2009/104/CE All. II p. 4 (ex 2001/45/CE). Dettagli nell\'appendice.', 'Libretto e autorizzazione: artt. 131, 134. PiMUS: art. 136 e All. XXII.')),
    K(S.ruoli, 'Il preposto può fermare il lavoro: se vedi un pericolo, diglielo.', N('Preposto: art. 19 (lett. a, f-bis dopo L. 215/2021), art. 136 c.6 sorveglianza diretta, art. 137 verifiche.', 'Lavoratore: art. 20 (segnalare, non rimuovere protezioni).', 'Il preposto deve avere anche lui la formazione da addetto ponteggi (Interpello 16/2015).')),
    K(S.formazione, 'Per montare serve il corso da 28 ore e l\'aggiornamento ogni 4 anni.', N('All. XXI: 4 h giuridico + 10 h tecnico + 14 h pratico; verifica intermedia 70%; prova pratica finale; presenza ≥ 90%.', 'Aggiornamento quadriennale ≥ 4 h di cui 3 tecnico-pratiche. Il corso ponteggi NON è riordinato dall\'ASR 2025.')),
    K(S.novita, 'Patente a crediti, badge, caldo e lingua: quattro cose nuove da sapere.', N('Patente a crediti: art. 27 D.Lgs. 81/08, dal 1/10/2024.', 'Badge di cantiere: D.L. 159/2025.', 'Caldo: ordinanza Regione Lazio n. Z00001 di maggio 2026 (come quelle 2025); mappa Worklimate; Protocollo quadro 2/7/2025.', 'Lingua: ASR 17/04/2025 e FAQ ministeriali.'))] },
  { t: 'La caduta e la sospensione', s: [
    K(S.perche, 'Sopra i 2 metri si è in quota: prima i parapetti, poi i DPI.', N('Art. 107 (definizione lavoro in quota), art. 111 (priorità alle protezioni collettive).', 'Momenti critici: primi due impalcati, smontaggio, modifiche "al volo".')),
    K(() => FALL_HTML(), 'Da 2 metri tocchi terra in 0,64 secondi: non fai in tempo a reagire.', N('Usare prima il tempo reale (far contare "uno" ad alta voce), poi il rallentatore.', 'Confrontare 2 m e 10 m: l\'energia cresce come l\'altezza, la velocità come la sua radice.'), { after: 'fall' }),
    K(S.cadute, 'Meglio non cadere (trattenuta) che essere fermati (arresto).', N('Forza di arresto con assorbitore ≤ 6 kN (EN 355); il corpo tollera circa 12 kN.')),
    K(S.sospA, 'Se resti appeso e fermo, il pericolo continua anche dopo la caduta.', N('Materiale del corso slide 38–39. Spiegare il disegno partendo dai cosciali.')),
    K(S.sospB, 'Chi resta appeso va liberato in pochi minuti: il piano di recupero si prepara prima.', N('HSE (RR708, 2009): dopo il recupero primo soccorso normale, persona in posizione orizzontale; niente più "posizione seduta".', 'Il piano di emergenza (POS/PiMUS) indica chi recupera, con quale kit, chi chiama il 112.'), { after: 'sosp' }),
    { fn: COMICS.sosp, comic: true, nota: N('Chiedere: "Nel vostro cantiere dov\'è il kit di recupero?"') },
    { fn: COMICS.attimo, comic: true, nota: N('Chi toglie un parapetto lo rimette e avvisa il preposto.') }] },
  { t: 'Il PiMUS: leggiamone uno vero', s: [
    K(S.documenti, 'Se manca un documento, il ponteggio non si monta.', N('Art. 131 (autorizzazione), 133 (progetto > 20 m o non conforme), 134 (documenti in cantiere), 136 e All. XXII (PiMUS), All. XIX (verifiche).')),
    K(S.pimusVero, 'Del PiMUS a te servono tre cose: il disegno, le fasi, le regole d\'uso.', N('Esempio fornito dal docente: PiMUS di un ponteggio a telai prefabbricati, 7 impalcati, 16 m (cantiere di Salerno, 2024). Mostrarlo come modello: per i cantieri di Roma lo schema è lo stesso.', 'Sotto i 20 m: non serve il progetto se il montaggio segue gli schemi tipo; mantovana, trave carraia e piazzola devono essere previste dal libretto o dal progetto.')),
    K(S.pimusTav, 'Il disegno ti dice dove sono mantovana, ancoraggi e piazzola di carico.', N('Tavola grafica in scala 1:100: prospetto frontale, laterale, pianta, assonometria e distinta materiali.', 'Mantovana: art. 129 c.3. Distanza dal muro ≤ 20 cm: art. 138.'), { after: 'pimusTav' }),
    K(S.pimusFasi, 'Si sale solo dopo aver agganciato il retrattile, stando sulla scala.', N('PiMUS, "Istruzioni per il montaggio e smontaggio", pagg. 26–35: quote basse (retrattile su traverso + passamano) e quote alte (retrattile su montante + argano).', 'Nello smontaggio: ordine inverso, il retrattile si sgancia solo stando sulla scala del piano sotto.'), { after: 'pimusFasi' }),
    K(S.pimusCheck, 'Un PiMUS con i nomi vuoti o di un altro cantiere non va bene.', N('All. XXII: identificazione della squadra e del preposto, dati del ponteggio e dell\'autorizzazione.', 'Classe di carico: la classe 1 (EN 12811-1) è per carichi leggeri; le circolari MLPS indicano 1,5 kN/m² per manutenzione e 3,0 per costruzione: chiarire con il redattore.'), { after: 'pimusCheck' }),
    { fn: COMICS.pimus, comic: true, nota: N('Collegare al PiMUS appena visto: "è di Salerno, non vale per via Garibaldi a Roma".') }] },
  { t: 'Il ponteggio pezzo per pezzo', s: [
    K(S.tipi, 'Ogni ponteggio ha il suo libretto: i pezzi di marche diverse non si mescolano.', N('PTG, PTP, PMTP. Ponteggi misti solo se previsti (progetto).')),
    K(S.anat, 'Impara il nome dei pezzi: in squadra serve parlarsi chiaro.', N('Far ripetere i nomi in coro; collegare al glossario.'), { after: 'anat' }),
    K(S.numeri, 'Dieci numeri da ricordare: 95, 15, 60, 20…', N('Parapetto ≥ 95 cm (art. 138; le norme EN chiedono 1 m), fermapiede ≥ 15 cm, luci ≤ 60 cm (All. XVIII), distanza dal muro ≤ 20 cm, sottoponte ≤ 2,50 m (art. 128), ancoraggi art. 125 c.6, parasassi art. 129 c.3.')),
    K(S.foto, 'Le protezioni proteggono anche chi passa sotto.', N('A Roma: marciapiedi stretti, turisti, negozi: passaggi protetti e mantovane sono essenziali.'))] },
  { t: 'Montaggio e smontaggio', s: [
    K(S.prima, 'Si parte solo se tutti i controlli sono verdi.', N('Verifiche preliminari: PiMUS, piano di appoggio, delimitazione, linee elettriche (art. 117), meteo (art. 111 c.7).'), { after: 'pre' }),
    K(S.seq, 'Prima la base, poi i piani: gli ancoraggi si fanno mentre si sale.', N('Sequenza generale; quella del cantiere è nel PiMUS (vedi le fasi).'), { after: 'seq' }),
    K(S.appoggi, 'Il ponteggio è sicuro quanto il terreno su cui poggia.', N('Ripartitori 4–5 cm come nel PiMUS di esempio; mai mattoni o detriti.'), { after: 'gs' }),
    K(S.impalcati, 'I primi due piani sono i più pericolosi: retrattile in alto o parapetto di montaggio.', N('Il PiMUS di esempio usa il retrattile su traverso al 1° impalcato e sul montante dal 2°.', 'Circ. MLPS 29/2010.')),
    K(S.ancoraggi, 'Ancoraggi solo come dice il libretto: niente fil di ferro, niente ringhiere.', N('Il PiMUS di esempio prevede ancoraggi a cravatta, a tassello, a vitone, ad anello (24 ad anello). Art. 125 c.6.')),
    { fn: COMICS.filo, comic: true },
    K(S.smontaggio, 'Si smonta dall\'alto, un piano alla volta; i pezzi si calano, non si lanciano.', N('Art. 138: divieto di gettare elementi. PiMUS: ordine di smontaggio scala → diagonali → tavole → correnti → fermapiede → telaio-parapetto → ancoraggi → spine → telai.')),
    { fn: COMICS.lancio, comic: true }, { fn: COMICS.ragno, comic: true }] },
  { t: 'DPI e tirante d\'aria', s: [
    K(S.dpi, 'Il DPI salva la vita solo se è quello giusto e sai usarlo.', N('DPI III categoria: addestramento obbligatorio (art. 77 c.5). Reg. (UE) 2016/425.')),
    K(S.controllo, 'Prima di usarlo, lo controlli tu: se un DPI ha già fermato una caduta, si butta.', N('EN 365: ispezione periodica almeno ogni 12 mesi da persona competente.'), { after: 'dpick' }),
    K(TA.concetto, 'Tirante d\'aria = lo spazio libero che serve sotto di te per essere fermato in tempo.', N('Formula TA = A + B + C + D (+F). Fattore di caduta max 2.')),
    K(TA.sim, 'Vicino a terra il cordino lungo non ti salva: tocchi terra prima.', N('Usare i 5 casi pronti; i cursori sono nel riquadro "Cambia i valori".', 'Caso 1 = 1° impalcato a 2 m: è proprio il motivo per cui il PiMUS usa il retrattile.'), { after: 'tasim' }),
    K(TA.casi, 'Nei primi piani servono retrattile, cordini corti o parapetti di montaggio.', N('Valori indicativi: fanno fede il manuale del DPI e il PiMUS.')),
    K(TA.errcasi, 'Otto errori veri: impara a riconoscerli.', N('Far votare l\'aula con le mani prima di cliccare.'), { after: 'taeg' }),
    { fn: COMICS.aggancio, comic: true }] },
  { t: 'Uso, verifiche, meteo', s: [
    K(S.uso, 'Chi usa il ponteggio non lo modifica: per ogni modifica chiama la squadra.', N('Art. 124 (carichi), art. 113 (scale). Regole d\'uso del PiMUS di esempio: botole chiuse, no salire dai montanti, niente accumuli.')),
    K(S.verifiche, 'Dopo vento forte o una lunga pausa, il preposto controlla prima che qualcuno salga.', N('All. XIX; art. 137 c.1.')),
    K(S.meteo, 'Vento oltre il limite del PiMUS, temporale o ghiaccio: non si sale.', N('Art. 111 c.7. I limiti del vento li fissa PiMUS/libretto (Beaufort 6 è un riferimento).'), { after: 'meteo' }),
    { fn: COMICS.vento, comic: true },
    K(S.caldo, 'Nei giorni di caldo alto, dalle 12:30 alle 16:00 non si lavora al sole.', N('Ordinanza Regione Lazio Z00001 (maggio 2026), come le ordinanze Z00001/Z00002 del 2025; mappa del rischio Worklimate.', 'Protocollo quadro emergenze climatiche 2/7/2025.')),
    K(S.elettrico, 'Linea elettrica vicina: almeno 3 metri, o si chiama il gestore.', N('Art. 117 e All. IX tab. 1. Art. 84 per i fulmini.'))] },
  { t: 'Emergenza', s: [K(S.emergenza, 'Allarme, sicurezza, recupero, primo soccorso: in quest\'ordine.', N('Simulare la chiamata al 112: indirizzo esatto del cantiere (a Roma: via, civico, municipio, punto di accesso).'))] },
  { t: 'Caccia all\'errore', s: [K(S.caccia, 'Ora tocca a te: trova gli 8 errori.', N('Lavoro a coppie: un minuto, poi correzione insieme.'), { after: 'caccia' })] },
  { t: 'Verifica finale', s: [{ quiz: true, nota: N('Soglia 70%.') }] },
  { t: 'Appendice per il docente', s: [
    { fn: S.leggi, nota: N('Mappa completa delle fonti.') }, { fn: EU.direttive, nota: N('Recepimento della Dir. 2009/104/CE.') }, { fn: EU.norme }, { fn: EU.classi, after: 'classi' },
    { fn: TA.norme }, { fn: TA.errcalc, after: 'taec' }, { fn: S.progetto, after: 'prj' }, { fn: S.pimusdet, after: 'tf' }, { fn: S.docente }, { fn: S.crediti }] }
];
MODULES.length = 0; NEWMOD.forEach(m => MODULES.push(m));

AGENDA.length = 0;
[['0', 'Benvenuto', 6], ['1', 'Le regole, in breve', 10], ['2', 'La caduta e la sospensione', 12], ['3', 'Il PiMUS: leggiamone uno vero', 16], ['4', 'Il ponteggio pezzo per pezzo', 10], ['5', 'Montaggio e smontaggio', 18],
 ['6', 'DPI e tirante d\'aria', 18], ['7', 'Uso, verifiche, meteo', 12], ['8', 'Emergenza', 5], ['9', 'Caccia all\'errore', 5], ['10', 'Verifica finale', 8]].forEach(a => AGENDA.push(a));

for (let i = QUIZ.length - 1; i >= 0; i--) if (/direttiva europea|EN 13374/.test(QUIZ[i].q + QUIZ[i].e)) QUIZ.splice(i, 1);
QUIZ.push(
  { q: 'Nel PiMUS di esempio la piazzola di carico è all\'impalcato 5. Cosa vuol dire?', o: ['Che i materiali portati su si appoggiano solo lì', 'Che su tutti gli impalcati si può caricare quanto si vuole', 'Che l\'impalcato 5 non ha parapetti'], a: 0, e: 'La piazzola è progettata per carichi maggiori: altrove si tiene solo il materiale che serve, nei limiti del PiMUS.' },
  { q: 'Secondo il PiMUS di esempio, quando agganci il retrattile per salire sull\'impalcato da montare?', o: ['Quando sei già sull\'impalcato', 'Stando sulla scala, prima di salire', 'Non serve: il parapetto c\'è già'], a: 1, e: 'Fase 3 del montaggio: ci si aggancia sulla scala d\'accesso e solo dopo si sale sull\'impalcato senza protezioni.' });
