/* Corso Octave · esito del test in PDF da consegnare su Google Classroom.
   Il PDF riporta identità, punteggio, tempi del tentativo, uscite dalla pagina, storico dei tentativi
   ed esercizi; contiene i dati completi firmati (HMAC-SHA-256) nei metadati del file, che la pagina
   verifica.html legge per controllare autenticità, coerenza e possibili copie.
   Richiede vendor/jspdf.umd.min.js e vendor/qrcode.js (caricati al primo uso). */
"use strict";
window.OctPdf = (() => {
  const K = ['oct', 'Cortese', 'Maddaloni', '5ASA', 'calcolo-numerico', 'v1'];
  let keyP = null;
  function key() {
    if (!keyP) keyP = crypto.subtle.importKey('raw', new TextEncoder().encode(K.join('·') + '#' + K.length * 7919), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return keyP;
  }
  const canon = v => Array.isArray(v) ? '[' + v.map(canon).join(',') + ']' : v && typeof v === 'object' ? '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}' : JSON.stringify(v === undefined ? null : v);
  async function sign(obj) {
    const sig = await crypto.subtle.sign('HMAC', await key(), new TextEncoder().encode(canon(obj)));
    return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const b64u = s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const unb64u = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))));
  async function pack(payload) { const sig = await sign(payload); return { code: 'OCTV1.' + b64u(JSON.stringify(payload)) + '.' + sig, sig }; }
  async function unpack(code) {
    const m = /^OCTV1\.([A-Za-z0-9_-]+)\.([0-9a-f]{64})$/.exec(code.trim()); if (!m) throw Error('codice non riconosciuto');
    const payload = JSON.parse(unb64u(m[1]));
    return { payload, sig: m[2], valid: (await sign(payload)) === m[2] };
  }
  function findCode(text) { const m = /OCTV1\.[A-Za-z0-9_-]{40,}\.[0-9a-f]{64}/.exec(text); return m ? m[0] : null; }

  /* ---------- caricamento delle librerie ---------- */
  const loaded = {};
  const load = src => loaded[src] || (loaded[src] = new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => { delete loaded[src]; rej(Error('impossibile caricare ' + src + ': controlla la connessione')); }; document.head.append(s); }));
  const ready = () => Promise.all([load('./vendor/jspdf.umd.min.js?v=1'), load('./vendor/qrcode.js?v=1')]);

  /* ---------- testo compatibile con i font standard del PDF (WinAnsi) ---------- */
  const MAP = { '√': 'radice di ', '≥': '>=', '≤': '<=', '≠': '~=', 'π': 'pi', '→': '->', '←': '<-', '⁻': '^-', '¹': '1', '⁰': '0', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '−': '-', '✓': '', '✗': '', '★': '*', '·': '·', ' ': ' ', ' ': ' ', ' ': ' ' };
  const WIN = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ');
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const pdfText = s => String(s == null ? '' : s)
    .replace(/⁻?[⁰¹²³⁴⁵⁶⁷⁸⁹]{2,}|⁻[⁰¹²³⁴⁵⁶⁷⁸⁹]+|[⁴⁵⁶⁷⁸⁹⁰]/g, m => '^' + [...m].map(c => c === '⁻' ? '-' : SUP.indexOf(c)).join(''))
    .replace(/[^\n\t\x20-\x7e\xa0-\xff]/g, c => MAP[c] !== undefined ? MAP[c] : WIN.has(c) ? c : '?');

  const fmtDT = iso => { if (!iso) return 'n.d.'; const d = new Date(iso); return isNaN(d) ? 'n.d.' : d.toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }); };
  const fmtDur = ms => { if (ms == null || !isFinite(ms)) return 'n.d.'; const s = Math.round(ms / 1000), m = Math.floor(s / 60); return (m ? m + ' min ' : '') + (s % 60) + ' s'; };
  const mmss = ms => { if (ms == null) return '-'; const s = Math.round(ms / 1000); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };

  /* ---------- PDF ---------- */
  async function build(data) {
    await ready();
    const { jsPDF } = window.jspdf;
    const { payload, lesson, flags } = data;
    const { code, sig } = await pack(payload);
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const W = 210, M = 16, CW = W - 2 * M; let y = 0;
    const who = payload.who, att = payload.att;
    const navy = [16, 42, 67], teal = [23, 107, 135], grey = [82, 101, 122], ok = [31, 138, 112], ko = [192, 86, 43];
    const color = c => doc.setTextColor(...c);
    const page = () => { doc.addPage(); y = 18; };
    const need = h => { if (y + h > 280) page(); };
    const txt = (s, x, size, style, c, opts) => { doc.setFont('helvetica', style || 'normal'); doc.setFontSize(size); color(c || navy); const lines = doc.splitTextToSize(pdfText(s), (opts && opts.w) || CW - (x - M)); need(lines.length * size * 0.42 + 1); doc.text(lines, x, y); y += lines.length * size * 0.42 + ((opts && opts.after) || 1.5); };
    const kv = (rows, x0, wk) => { rows.forEach(([k, v, c]) => { doc.setFontSize(9.5); const lines = doc.splitTextToSize(pdfText(v), CW - wk - (x0 - M)); need(lines.length * 4.2 + 1); doc.setFont('helvetica', 'normal'); color(grey); doc.text(pdfText(k), x0, y); doc.setFont('helvetica', 'bold'); color(c || navy); doc.text(lines, x0 + wk, y); y += lines.length * 4.2 + 0.8; }); };
    const section = t => { need(14); y += 3; doc.setFillColor(229, 237, 243); doc.rect(M, y - 4.6, CW, 6.6, 'F'); txt(t, M + 2, 10.5, 'bold', navy, { after: 3.2 }); };

    // intestazione
    doc.setFillColor(...navy); doc.rect(0, 0, W, 30, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(15);
    doc.text(pdfText('Calcolo numerico con Octave · Esito del test'), M, 12);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(pdfText('Lezione ' + payload.lesson + ' – ' + payload.title), M, 19);
    doc.text(pdfText('Liceo Scientifico «N. Cortese» · Maddaloni'), M, 25);
    y = 40;
    txt(who.cognome.toUpperCase() + ' ' + who.nome, M, 17, 'bold', navy, { after: 1 });
    txt('Classe ' + who.classe, M, 12, 'normal', teal, { after: 4 });

    // esito
    const passed = att.score >= att.need;
    doc.setDrawColor(...(passed ? ok : ko)); doc.setLineWidth(0.6); doc.roundedRect(M, y - 4, CW, 17, 2, 2, 'S');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); color(passed ? ok : ko); doc.text(att.score + '/' + att.total, M + 5, y + 6.5);
    doc.setFontSize(11); doc.text(pdfText(passed ? 'Test superato' : 'Test non superato'), M + 30, y + 2.5);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); color(grey);
    doc.text(pdfText('Soglia: ' + att.need + ' risposte esatte (70%) · Tentativo n. ' + att.attemptNo + ' · Esercizi completati: ' + payload.ex.done + '/' + payload.ex.total), M + 30, y + 8);
    y += 19;

    // segnalazioni
    if (flags.length) {
      section('Segnalazioni automatiche');
      flags.forEach(f => txt('• ' + f, M + 2, 9.5, 'normal', ko, { after: 0.8 }));
    }

    section('Tempi del tentativo');
    kv([
      ['Prima apertura della lezione', fmtDT(payload.firstOpen)],
      ['Pagina aperta (questa sessione)', fmtDT(payload.pageOpen)],
      ['Inizio del test', fmtDT(att.start) + (att.srvStart ? '  (ora del sito: ' + fmtDT(att.srvStart) + ')' : '')],
      ['Consegna del test', fmtDT(att.end) + (att.srvEnd ? '  (ora del sito: ' + fmtDT(att.srvEnd) + ')' : '')],
      ['Durata (orologio del dispositivo)', fmtDur(Date.parse(att.end) - Date.parse(att.start))],
      ['Durata misurata dal browser', fmtDur(att.durMs) + ' · media ' + fmtDur(att.durMs / att.total) + ' per domanda'],
      ['Uscite dalla pagina durante il test', att.away.n + (att.away.n ? ' (in tutto ' + fmtDur(att.away.ms) + ')' : ''), att.away.n ? ko : null],
      ['Ricaricamenti della pagina', String(att.reloads || 0), att.reloads ? ko : null],
      ['Risposte modificate', String(att.q.reduce((s, q) => s + Math.max(0, (q.changes || 1) - 1), 0))],
      ['PDF generato', fmtDT(payload.gen) + (payload.srvGen ? '  (ora del sito: ' + fmtDT(payload.srvGen) + ')' : '')]
    ], M + 2, 64);
    if (att.away.events && att.away.events.length) txt('Dettaglio uscite (minuto dall’inizio, durata): ' + att.away.events.map(e => mmss(e.t) + ' per ' + fmtDur(e.ms)).join(' · '), M + 2, 8.5, 'normal', grey, { after: 1 });

    section('Risposte');
    lesson.quiz.forEach((q, i) => {
      const a = att.answers[i], right = a === q.correct, qt = att.q[i] || {};
      txt((i + 1) + '. ' + q.case, M + 2, 9.5, 'bold', navy, { after: 0.6 });
      if (q.code) { doc.setFont('courier', 'normal'); doc.setFontSize(8.5); color(grey); const ls = pdfText(q.code).split('\n'); need(ls.length * 3.6 + 1); doc.text(ls, M + 6, y); y += ls.length * 3.6 + 0.8; }
      txt('Risposta: ' + (a == null ? '(nessuna)' : q.options[a]), M + 6, 9, 'normal', navy, { after: 0.4 });
      txt((right ? 'Esatta' : 'Da rivedere') + ' · risposta data a ' + mmss(qt.first) + (qt.changes > 1 ? ', modificata ' + (qt.changes - 1) + ' volt' + (qt.changes === 2 ? 'a' : 'e') + ' (ultima a ' + mmss(qt.last) + ')' : ''), M + 6, 8.5, 'bold', right ? ok : ko, { after: 2.2 });
    });

    if (payload.history.length > 1) {
      section('Storico dei tentativi');
      payload.history.forEach((h, k) => txt((k + 1) + '. ' + fmtDT(h.at) + ' · punteggio ' + h.score + '/' + att.total + ' · durata ' + fmtDur(h.durMs) + (h.id === att.id ? '  ← questo PDF' : ''), M + 2, 9, 'normal', navy, { after: 0.6 }));
    }
    if (payload.ex.items.length) {
      section('Esercizi completati');
      txt(payload.ex.items.map(e => 'Esercizio ' + e.id.replace(/^l\d+-e/, '') + (e.at ? ' (' + fmtDT(e.at) + ')' : '')).join(' · '), M + 2, 9, 'normal', navy);
    }

    section('Identificativi e verifica');
    kv([
      ['ID del tentativo', att.id], ['ID del dispositivo', payload.env.device],
      ['Browser e sistema', payload.env.ua], ['Schermo · fuso orario', payload.env.scr + ' · UTC' + (payload.env.tz <= 0 ? '+' : '-') + Math.abs(payload.env.tz / 60)],
      ['Codice di verifica', sig.slice(0, 24).replace(/(.{4})/g, '$1 ').trim()]
    ], M + 2, 46);
    need(42);
    const qr = window.qrcode(0, 'M'); qr.addData('OCT1|' + payload.lesson + '|' + att.id + '|' + sig.slice(0, 24)); qr.make();
    const n = qr.getModuleCount(), size = 34, cell = size / n, qx = W - M - size, qy = y;
    doc.setFillColor(0, 0, 0);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) doc.rect(qx + c * cell, qy + r * cell, cell + 0.02, cell + 0.02, 'F');
    txt('Il file contiene, firmati digitalmente, tutti i dati di questa pagina. Il docente lo controlla con la pagina di verifica del corso: qualsiasi modifica al contenuto, il cambio di nome o una copia consegnata da un altro studente vengono segnalati. Non modificare, stampare o rigenerare il file: caricalo su Classroom così com’è.', M + 2, 8.5, 'normal', grey, { w: CW - size - 8, after: 2 });
    y = Math.max(y, qy + size + 4);

    const pages = doc.getNumberOfPages();
    for (let p = 1; p <= pages; p++) {
      doc.setPage(p); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...grey);
      doc.text(pdfText(who.cognome + ' ' + who.nome + ' · ' + who.classe + ' · Lezione ' + payload.lesson + ' · tentativo ' + att.id), M, 290);
      doc.text(p + '/' + pages, W - M, 290, { align: 'right' });
    }
    doc.setProperties({ title: 'Esito Lezione ' + payload.lesson + ' - ' + who.cognome + ' ' + who.nome + ' ' + who.classe, author: who.cognome + ' ' + who.nome, subject: 'Calcolo numerico con Octave', creator: 'antonioadinolfiscuola.it/corso-octave', keywords: code });
    const stamp = new Date(payload.gen); const z = x => String(x).padStart(2, '0');
    const clean = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
    const name = 'L' + payload.lesson + '_' + clean(who.classe) + '_' + clean(who.cognome) + '_' + clean(who.nome) + '_' + stamp.getFullYear() + z(stamp.getMonth() + 1) + z(stamp.getDate()) + '-' + z(stamp.getHours()) + z(stamp.getMinutes()) + '.pdf';
    doc.save(name);
    return name;
  }

  return { sign, pack, unpack, findCode, build, canon };
})();
