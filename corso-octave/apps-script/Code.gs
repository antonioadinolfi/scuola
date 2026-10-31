/**
 * Corso Calcolo numerico con Octave · ricezione delle consegne dei test.
 * Riceve via POST l'esito di un test dal sito, crea un PDF nella cartella Drive del docente
 * (sottocartelle per classe e lezione) e aggiunge una riga al foglio "Registro consegne".
 *
 * Distribuzione: Distribuisci → Nuova distribuzione → App web
 *   Esegui come: Me · Chi ha accesso: Chiunque
 * Copia l'URL /exec in corso-octave/oct-config.js (appsScriptUrl).
 */

// ID della cartella Drive che raccoglie le consegne (la parte finale dell'URL della cartella).
const FOLDER_ID = 'INSERISCI_QUI_ID_CARTELLA';
const REGISTRO = 'Registro consegne Octave';
const MAX_BYTES = 60000;

function doGet() {
  return json_({ ok: true, servizio: 'Consegne corso Octave' });
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '';
    if (!raw || raw.length > MAX_BYTES) return json_({ ok: false, error: 'richiesta non valida' });
    const d = JSON.parse(raw);
    const v = validate_(d);
    if (v) return json_({ ok: false, error: v });

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      const root = DriveApp.getFolderById(FOLDER_ID);
      const folder = sub_(sub_(root, d.classe), 'Lezione ' + d.lezione);
      const when = new Date(d.data);
      const stamp = Utilities.formatDate(new Date(), 'Europe/Rome', 'yyyy-MM-dd_HHmm');
      const name = 'L' + d.lezione + '_' + d.classe + '_' + d.studente + '_' + stamp + '_' + d.punteggio + 'su' + d.totale + '.pdf';
      const pdf = Utilities.newBlob(html_(d, when), 'text/html', 'esito.html').getAs('application/pdf').setName(name);
      const file = folder.createFile(pdf);
      registro_(root).appendRow([new Date(), d.classe, d.studente, d.lezione, d.titolo, d.punteggio, d.totale,
        d.superato ? 'sì' : 'no', d.tentativi, d.esercizi, when, file.getUrl()]);
      return json_({ ok: true, file: name });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message || err) });
  }
}

function validate_(d) {
  if (!d || typeof d !== 'object') return 'dati mancanti';
  d.studente = clean_(d.studente, 80);
  d.classe = clean_(d.classe, 6).toUpperCase();
  d.titolo = clean_(d.titolo, 120);
  if (d.studente.length < 3) return 'nome mancante';
  if (!/^[1-5][A-Z]{1,3}$/.test(d.classe)) return 'classe non valida (es. 5A)';
  ['lezione', 'punteggio', 'totale', 'tentativi'].forEach(k => d[k] = Number(d[k]));
  if (!(d.lezione >= 1 && d.lezione <= 9)) return 'lezione non valida';
  if (!(d.totale >= 1 && d.totale <= 50 && d.punteggio >= 0 && d.punteggio <= d.totale)) return 'punteggio non valido';
  if (!Array.isArray(d.risposte) || d.risposte.length !== d.totale) return 'risposte non valide';
  if (isNaN(Date.parse(d.data))) d.data = new Date().toISOString();
  d.esercizi = clean_(d.esercizi, 10);
  return null;
}

function clean_(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001f\/\\:*?"<>|]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

function esc_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function html_(d, when) {
  const rows = d.risposte.map((r, i) =>
    '<div class="q"><p><b>' + (i + 1) + '. ' + esc_(r.domanda) + '</b></p>' +
    (r.codice ? '<pre>' + esc_(r.codice) + '</pre>' : '') +
    '<p>Risposta: ' + esc_(r.scelta) + ' — <span class="' + (r.corretta ? 'ok">esatta' : 'ko">errata') + '</span></p>' +
    (r.corretta ? '' : '<p class="muted">Risposta esatta: ' + esc_(r.esatta) + '</p>') + '</div>').join('');
  return '<html><head><meta charset="utf-8"><style>' +
    'body{font-family:Arial,sans-serif;font-size:11pt;color:#102a43}h1{font-size:16pt;margin:0}' +
    '.box{border:1px solid #176b87;border-radius:6px;padding:8px 12px;margin:10px 0}' +
    'pre{background:#eef6f9;padding:6px;font-size:9pt}.ok{color:#1f8a70;font-weight:bold}.ko{color:#c0562b;font-weight:bold}' +
    '.muted{color:#52657a}.q{border-bottom:1px solid #dce4ec;padding:4px 0}</style></head><body>' +
    '<h1>Calcolo numerico con Octave · Lezione ' + d.lezione + ' – ' + esc_(d.titolo) + '</h1>' +
    '<div class="box"><b>' + esc_(d.studente) + '</b> · classe ' + esc_(d.classe) + '<br>' +
    'Svolto il ' + Utilities.formatDate(when, 'Europe/Rome', 'dd/MM/yyyy HH:mm') + ' · tentativo n. ' + d.tentativi + '<br>' +
    'Punteggio: <b>' + d.punteggio + '/' + d.totale + '</b> (soglia ' + esc_(d.soglia) + ') · ' + (d.superato ? 'superato' : 'non superato') +
    ' · esercizi completati: ' + esc_(d.esercizi) + '</div>' + rows + '</body></html>';
}

function sub_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}

function registro_(root) {
  const it = root.getFilesByName(REGISTRO);
  if (it.hasNext()) return SpreadsheetApp.open(it.next()).getSheets()[0];
  const ss = SpreadsheetApp.create(REGISTRO);
  DriveApp.getFileById(ss.getId()).moveTo(root);
  const sh = ss.getSheets()[0];
  sh.appendRow(['Ricevuto', 'Classe', 'Studente', 'Lezione', 'Titolo', 'Punteggio', 'Totale', 'Superato', 'Tentativo', 'Esercizi', 'Svolto il', 'PDF']);
  sh.setFrozenRows(1);
  return sh;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Da eseguire una volta dall'editor per autorizzare Drive e Fogli e verificare la cartella. */
function prova() {
  Logger.log(DriveApp.getFolderById(FOLDER_ID).getName());
}
