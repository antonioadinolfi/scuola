/**
 * Quiz OOP Python (classe quarta) · correzione e consegna.
 *
 * Riceve dal sito le risposte di uno studente, verifica la sua identità con il token
 * Google (solo account @lscortese.com), corregge il test con la chiave contenuta in
 * Chiave.gs, crea il PDF dell'esito, lo salva su Drive e aggiunge una riga al foglio
 * di registro. L'invio per email è disattivato (INVIA_EMAIL = false).
 *
 * Il progetto Apps Script contiene DUE file:
 *   - Code.gs   (questo file, pubblico)
 *   - Chiave.gs (QUIZ_ID e CHIAVE con le risposte esatte: riservato, non va su GitHub)
 *
 * Distribuzione: Distribuisci → Nuova distribuzione → App web
 *   Esegui come: Me · Chi ha accesso: Chiunque
 * Istruzioni complete in README.md.
 */

const DOCENTE = 'antonioadinolfi@lscortese.com';      // destinatario fisso delle email
const INVIA_EMAIL = false;                            // true = invia anche il PDF per email al docente
const CLIENT_ID = '1011752872320-713mjtge9ofhtnclhjfvdoc2h2q2uelv.apps.googleusercontent.com';
const DOMINIO = 'lscortese.com';
const NOME_CARTELLA = 'Consegne Quiz OOP Python';       // creata nel Drive del docente se manca
const REGISTRO = 'Registro Quiz OOP Python';
const TITOLO_QUIZ = 'Quiz OOP in Python – Classe quarta';
const SOGLIA = 0.7;                                     // superato con almeno il 70%
const TEMPO_MINUTI = 45;                                // tempo a disposizione (riportato nel PDF)
const MAX_BYTES = 20000;
const FUSO = 'Europe/Rome';

const COLONNE = ['Ricevuto', 'ID consegna', 'Email', 'Cognome', 'Nome', 'Classe', 'Tentativo',
  'Punteggio', 'Totale', 'Percentuale', 'Esito', 'Inizio (browser)', 'Fine (browser)', 'Durata',
  'Risposte', 'Email inviata', 'PDF', 'Modalità consegna'];

function doGet() {
  return json_({ ok: true, servizio: 'Quiz OOP Python – consegne', quiz: QUIZ_ID });
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (!raw || raw.length > MAX_BYTES) return errore_('Richiesta non valida.');
    let d;
    try { d = JSON.parse(raw); } catch (x) { return errore_('Richiesta non valida.'); }
    if (!d || typeof d !== 'object') return errore_('Richiesta non valida.');
    if (d.quizId !== QUIZ_ID) return errore_('Versione del quiz non aggiornata: ricarica la pagina e riprova.');

    const id = verificaToken_(d.idToken);
    if (!id) return errore_('Accesso Google non valido o scaduto.', 'token');

    const v = valida_(d);
    if (v) return errore_(v);

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const cartella = cartella_();
      const reg = registro_(cartella);
      const righe = reg.getLastRow() > 1 ? reg.getRange(2, 1, reg.getLastRow() - 1, COLONNE.length).getValues() : [];

      // Stessa consegna ricevuta due volte (es. rete lenta e nuovo tentativo): restituisce l'esito già registrato.
      const gia = righe.find(r => r[1] === d.consegnaId);
      if (gia) {
        if (String(gia[2]).toLowerCase() !== id.email) return errore_('Consegna non valida.');
        return json_(esitoJson_(Number(gia[7]), Number(gia[8]), Number(gia[6])));
      }

      const tentativo = righe.filter(r => String(r[2]).toLowerCase() === id.email).length + 1;
      const c = correggi_(d.scelte);
      const ricevuto = new Date();
      const inizio = new Date(d.inizio), fine = new Date(d.fine);
      const info = {
        email: id.email, nome: id.nome, cognome: id.cognome, classe: d.classe, tentativo: tentativo,
        consegnaId: d.consegnaId, ricevuto: ricevuto, inizio: inizio, fine: fine,
        durata: durata_(inizio, fine), browser: d.browser,
        modalita: d.scaduto ? 'automatica (tempo scaduto)' : 'manuale'
      };

      const stamp = Utilities.formatDate(ricevuto, FUSO, 'yyyy-MM-dd_HHmm');
      const nomeFile = d.classe + '_' + pulisci_(id.cognome || id.email, 40) + '_' + pulisci_(id.nome, 40) + '_' +
        stamp + '_' + c.punteggio + 'su' + c.totale + (c.superato ? '_SUPERATO' : '_NON-SUPERATO') + '.pdf';
      const pdf = Utilities.newBlob(htmlPdf_(info, c), 'text/html', 'esito.html').getAs('application/pdf').setName(nomeFile);
      const file = sottocartella_(cartella, d.classe).createFile(pdf);

      let inviata = 'no (invio email disattivato)';
      if (INVIA_EMAIL) try {
        inviata = 'sì';
        MailApp.sendEmail({
          to: DOCENTE,
          replyTo: id.email,
          name: 'Quiz OOP Python',
          subject: '[Quiz OOP] ' + d.classe + ' – ' + (id.cognome + ' ' + id.nome).trim() + ' – ' +
            c.punteggio + '/' + c.totale + ' ' + (c.superato ? 'SUPERATO' : 'NON SUPERATO'),
          htmlBody: htmlEmail_(info, c, file.getUrl()),
          attachments: [pdf]
        });
      } catch (err) {
        inviata = 'no: ' + String(err && err.message || err).slice(0, 120);
      }

      reg.appendRow([ricevuto, d.consegnaId, id.email, id.cognome, id.nome, d.classe, tentativo,
        c.punteggio, c.totale, c.percentuale + '%', c.superato ? 'SUPERATO' : 'NON SUPERATO',
        isData_(inizio) ? inizio : '', isData_(fine) ? fine : '', info.durata,
        d.scelte.map(x => x === null ? '-' : x + 1).join(' '), inviata, file.getUrl(), info.modalita]);

      return json_(esitoJson_(c.punteggio, c.totale, tentativo));
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return errore_('Errore del server: ' + String(err && err.message || err));
  }
}

/** Verifica il token Google con l'endpoint ufficiale tokeninfo. Restituisce l'identità o null. */
function verificaToken_(tok) {
  if (typeof tok !== 'string' || tok.length < 20 || tok.length > 4096) return null;
  const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(tok),
    { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return null;
  const p = JSON.parse(res.getContentText());
  const email = String(p.email || '').toLowerCase();
  if (p.aud !== CLIENT_ID) return null;
  if (p.iss !== 'accounts.google.com' && p.iss !== 'https://accounts.google.com') return null;
  if (String(p.email_verified) !== 'true') return null;
  if (p.hd !== DOMINIO || !email.endsWith('@' + DOMINIO)) return null;
  if (!(Number(p.exp) * 1000 > Date.now())) return null;
  return {
    email: email,
    nome: pulisci_(p.given_name || '', 60),
    cognome: pulisci_(p.family_name || '', 60) || pulisci_(p.name || email, 60)
  };
}

function valida_(d) {
  d.classe = String(d.classe || '').toUpperCase().replace(/\s+/g, '');
  if (!/^[1-5][A-Z]{1,2}$/.test(d.classe)) return 'Classe non valida (esempio: 4B).';
  if (typeof d.consegnaId !== 'string' || !/^[A-Za-z0-9-]{8,64}$/.test(d.consegnaId)) return 'Identificativo di consegna non valido.';
  if (!Array.isArray(d.scelte) || d.scelte.length !== CHIAVE.length) return 'Risposte non valide.';
  for (let i = 0; i < d.scelte.length; i++) {
    const s = d.scelte[i];
    if (s === null) continue;
    if (!Number.isInteger(s) || s < 0 || s >= CHIAVE[i].opzioni.length) return 'Risposte non valide.';
  }
  d.browser = String(d.browser || '').slice(0, 200);
  d.scaduto = d.scaduto === true;
  return null;
}

function correggi_(scelte) {
  const dettaglio = CHIAVE.map((k, i) => ({
    n: i + 1, titolo: k.titolo, tema: k.tema,
    data: scelte[i] === null ? null : k.opzioni[scelte[i]],
    numeroData: scelte[i] === null ? null : scelte[i] + 1,
    esatta: k.opzioni[k.corretta], numeroEsatta: k.corretta + 1,
    giusta: scelte[i] === k.corretta
  }));
  const punteggio = dettaglio.filter(x => x.giusta).length;
  const totale = CHIAVE.length;
  const temi = {};
  dettaglio.forEach(x => {
    temi[x.tema] = temi[x.tema] || { ok: 0, tot: 0 };
    temi[x.tema].tot++; if (x.giusta) temi[x.tema].ok++;
  });
  return {
    punteggio: punteggio, totale: totale, minimo: Math.ceil(SOGLIA * totale),
    percentuale: Math.round(punteggio / totale * 100),
    superato: punteggio >= Math.ceil(SOGLIA * totale), dettaglio: dettaglio, temi: temi
  };
}

function esitoJson_(punteggio, totale, tentativo) {
  const minimo = Math.ceil(SOGLIA * totale);
  return { ok: true, punteggio: punteggio, totale: totale, minimo: minimo, soglia: SOGLIA,
    superato: punteggio >= minimo, tentativo: tentativo };
}

// ---------- PDF ed email ----------
function htmlPdf_(i, c) {
  const f = d => isData_(d) ? Utilities.formatDate(d, FUSO, 'dd/MM/yyyy HH:mm:ss') : 'non disponibile';
  const righe = c.dettaglio.map(x =>
    '<tr><td>' + x.n + '</td><td>' + esc_(x.titolo) + '<br><span class="muted">' + esc_(x.tema) + '</span></td>' +
    '<td>' + (x.data === null ? '<i>nessuna</i>' : '(' + x.numeroData + ') <pre>' + esc_(x.data) + '</pre>') + '</td>' +
    '<td>(' + x.numeroEsatta + ') <pre>' + esc_(x.esatta) + '</pre></td>' +
    '<td class="' + (x.giusta ? 'ok">Esatta' : 'ko">' + (x.data === null ? 'Non data' : 'Errata')) + '</td></tr>').join('');
  const temi = Object.keys(c.temi).map(t => '<tr><td>' + esc_(t) + '</td><td>' + c.temi[t].ok + ' / ' + c.temi[t].tot + '</td></tr>').join('');
  return '<html><head><meta charset="utf-8"><style>' +
    'body{font-family:Arial,sans-serif;font-size:10pt;color:#1d2330}h1{font-size:15pt;margin:0 0 6px}h2{font-size:12pt;margin:14px 0 6px}' +
    'table{border-collapse:collapse;width:100%}td,th{border:1px solid #c9ced8;padding:4px 6px;text-align:left;vertical-align:top}' +
    'th{background:#eef1f6}.id td:first-child{width:32%;background:#f6f7f9;font-weight:bold}' +
    'pre{margin:2px 0 0;font-family:Courier New,monospace;font-size:9pt;white-space:pre-wrap}' +
    '.ok{color:#1d7a46;font-weight:bold}.ko{color:#b3261e;font-weight:bold}.muted{color:#5b6475;font-size:9pt}' +
    '.esito{font-size:14pt;font-weight:bold;padding:6px 10px;border:2px solid;display:inline-block}</style></head><body>' +
    '<h1>' + esc_(TITOLO_QUIZ) + '</h1>' +
    '<h2>Autore del test</h2><table class="id">' +
    '<tr><td>Cognome</td><td>' + esc_(i.cognome) + '</td></tr>' +
    '<tr><td>Nome</td><td>' + esc_(i.nome) + '</td></tr>' +
    '<tr><td>Email istituzionale</td><td>' + esc_(i.email) + ' (verificata con l\'accesso Google)</td></tr>' +
    '<tr><td>Classe</td><td>' + esc_(i.classe) + ' (indicata dallo studente)</td></tr>' +
    '<tr><td>Tentativo</td><td>n. ' + i.tentativo + '</td></tr>' +
    '<tr><td>Consegna ricevuta il</td><td>' + f(i.ricevuto) + ' (ora del server)</td></tr>' +
    '<tr><td>Inizio / fine sul dispositivo</td><td>' + f(i.inizio) + ' / ' + f(i.fine) + ' · durata ' + esc_(i.durata) +
    ' (tempo a disposizione: ' + TEMPO_MINUTI + ' min)</td></tr>' +
    '<tr><td>Modalità di consegna</td><td>' + esc_(i.modalita) + '</td></tr>' +
    '<tr><td>ID consegna</td><td>' + esc_(i.consegnaId) + '</td></tr>' +
    '<tr><td>Browser</td><td class="muted">' + esc_(i.browser) + '</td></tr></table>' +
    '<h2>Esito</h2><p>Punteggio: <b>' + c.punteggio + ' / ' + c.totale + '</b> (' + c.percentuale + '%) · soglia: almeno ' +
    c.minimo + ' risposte esatte (' + Math.round(SOGLIA * 100) + '%)</p>' +
    '<p class="esito ' + (c.superato ? 'ok">SUPERATO' : 'ko">NON SUPERATO') + '</p>' +
    '<h2>Risultato per tema</h2><table><tr><th>Tema</th><th>Esatte</th></tr>' + temi + '</table>' +
    '<h2>Dettaglio delle risposte</h2><table><tr><th>#</th><th>Caso</th><th>Risposta data</th><th>Risposta esatta</th><th>Esito</th></tr>' +
    righe + '</table></body></html>';
}

function htmlEmail_(i, c, url) {
  return '<p>Nuova consegna del <b>' + esc_(TITOLO_QUIZ) + '</b>.</p>' +
    '<p><b>' + esc_((i.cognome + ' ' + i.nome).trim()) + '</b> · ' + esc_(i.email) + ' · classe ' + esc_(i.classe) +
    ' · tentativo n. ' + i.tentativo + '</p>' +
    '<p>Punteggio: <b>' + c.punteggio + '/' + c.totale + '</b> (' + c.percentuale + '%) – <b>' +
    (c.superato ? 'SUPERATO' : 'NON SUPERATO') + '</b></p>' +
    '<p>Il PDF è allegato e salvato su Drive: <a href="' + esc_(url) + '">apri il file</a>.</p>';
}

// ---------- Drive e Fogli ----------
function cartella_() {
  const it = DriveApp.getFoldersByName(NOME_CARTELLA);
  return it.hasNext() ? it.next() : DriveApp.createFolder(NOME_CARTELLA);
}

function sottocartella_(padre, nome) {
  const it = padre.getFoldersByName(nome);
  return it.hasNext() ? it.next() : padre.createFolder(nome);
}

function registro_(cartella) {
  const it = cartella.getFilesByName(REGISTRO);
  if (it.hasNext()) {
    const esistente = SpreadsheetApp.open(it.next()).getSheets()[0];
    // registro creato da una versione precedente: aggiunge le intestazioni nuove
    if (esistente.getRange(1, COLONNE.length).getValue() === '') esistente.getRange(1, 1, 1, COLONNE.length).setValues([COLONNE]);
    return esistente;
  }
  const ss = SpreadsheetApp.create(REGISTRO);
  DriveApp.getFileById(ss.getId()).moveTo(cartella);
  const sh = ss.getSheets()[0];
  sh.appendRow(COLONNE);
  sh.setFrozenRows(1);
  return sh;
}

// ---------- utilità ----------
function isData_(d) { return d instanceof Date && !isNaN(d.getTime()); }

function durata_(a, b) {
  if (!isData_(a) || !isData_(b) || b < a) return 'non disponibile';
  const s = Math.round((b - a) / 1000);
  return Math.floor(s / 60) + ' min ' + (s % 60) + ' s';
}

function pulisci_(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\/\\:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function errore_(msg, codice) {
  return json_({ ok: false, error: msg, codice: codice || '' });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- funzioni da eseguire dall'editor ----------

/** Esegui una volta per concedere le autorizzazioni (Drive, Fogli, Gmail, connessioni esterne). */
function autorizza() {
  Logger.log('Cartella: ' + cartella_().getName());
  if (INVIA_EMAIL) Logger.log('Email ancora inviabili oggi: ' + MailApp.getRemainingDailyQuota());
  Logger.log('Chiave caricata: ' + QUIZ_ID + ', ' + CHIAVE.length + ' domande');
  UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo', { muteHttpExceptions: true });
}

/** Prova completa senza studente: crea un PDF di esempio e lo salva su Drive (e lo invia per email solo se INVIA_EMAIL è true). */
function provaConsegna() {
  const scelte = CHIAVE.map((k, i) => i < 7 ? k.corretta : null);
  const c = correggi_(scelte);
  const ora = new Date();
  const info = { email: 'studente.prova@' + DOMINIO, nome: 'Mario', cognome: 'Rossi (PROVA)', classe: '4X',
    tentativo: 1, consegnaId: 'prova-' + ora.getTime(), ricevuto: ora,
    inizio: new Date(ora.getTime() - 9 * 60000), fine: ora, durata: '9 min 0 s', browser: 'prova dall\'editor',
    modalita: 'manuale' };
  const pdf = Utilities.newBlob(htmlPdf_(info, c), 'text/html', 'esito.html').getAs('application/pdf')
    .setName('PROVA_esito_quiz_oop.pdf');
  const file = sottocartella_(cartella_(), 'PROVE').createFile(pdf);
  if (INVIA_EMAIL) MailApp.sendEmail({ to: DOCENTE, subject: '[Quiz OOP] PROVA – ' + c.punteggio + '/' + c.totale,
    htmlBody: htmlEmail_(info, c, file.getUrl()), attachments: [pdf] });
  Logger.log('PDF di prova: ' + file.getUrl());
}
