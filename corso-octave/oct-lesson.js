/* Corso Octave · pagina di lezione: test finale con soglia 70% e registrazione dei tempi,
   esito in PDF da consegnare su Classroom (oct-pdf.js), consegna online facoltativa (Apps Script).
   Nome, cognome e classe si inseriscono prima dell'inizio e restano legati al tentativo.
   Vengono registrati: inizio e fine (orologio del dispositivo e ora del sito), durata misurata dal browser,
   tempo di ogni risposta e modifiche, uscite dalla pagina, ricaricamenti. */
"use strict";
(() => {
  const n = Number(document.documentElement.dataset.lesson), lesson = window.OCT_LESSONS[n - 1], course = window.OctCourse;
  const cfg = window.OCT_CONFIG || {};
  const $ = id => document.getElementById(id);
  const form = $('finalQuiz'), submit = $('submitQuiz'), total = lesson.quiz.length, need = course.threshold(n);
  const RUN = 'octInCorso-' + n, WHO = 'octStudente', DEV = 'octDevice', FIRST = 'octPrimaApertura-' + n;
  const ls = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const rnd = b => [...crypto.getRandomValues(new Uint8Array(b))].map(x => x.toString(16).padStart(2, '0')).join('');
  const pageOpen = new Date().toISOString();
  if (!ls.get(FIRST)) ls.set(FIRST, pageOpen);
  let device = ls.get(DEV); if (!device) { device = rnd(6); ls.set(DEV, device); }
  let current = null, run = null, segStart = 0, ticker = null;

  const proj = $('projection');
  if (proj) proj.onclick = function () { const on = document.body.classList.toggle('projection'); this.setAttribute('aria-pressed', String(on)); this.textContent = on ? 'Testo normale' : 'Testo ingrandito'; };

  function exStatus() { const s = window.OctRunner.exercisesDone('l' + n + '-'), e = $('exProgress'); if (e) e.textContent = 'Esercizi completati: ' + s.done + ' su ' + s.total; return s; }
  document.addEventListener('oct-exercise-done', exStatus); exStatus();

  async function serverTime() {
    try {
      const ac = new AbortController(), t = setTimeout(() => ac.abort(), 3000);
      const res = await fetch('./oct-data.js?t=' + Date.now(), { method: 'HEAD', cache: 'no-store', signal: ac.signal }); clearTimeout(t);
      const d = res.headers.get('Date'); return d && !isNaN(Date.parse(d)) ? new Date(d).toISOString() : null;
    } catch { return null; }
  }
  function uaShort() {
    const u = navigator.userAgent;
    const b = /Edg\/(\d+)/.exec(u) ? 'Edge ' + RegExp.$1 : /OPR\/(\d+)/.exec(u) ? 'Opera ' + RegExp.$1 : /Firefox\/(\d+)/.exec(u) ? 'Firefox ' + RegExp.$1 : /Chrome\/(\d+)/.exec(u) ? 'Chrome ' + RegExp.$1 : /Version\/(\d+).*Safari/.exec(u) ? 'Safari ' + RegExp.$1 : 'Browser';
    const o = /Windows/.test(u) ? 'Windows' : /CrOS/.test(u) ? 'ChromeOS' : /Android/.test(u) ? 'Android' : /iPhone|iPad/.test(u) ? 'iOS' : /Mac OS X/.test(u) ? 'macOS' : /Linux/.test(u) ? 'Linux' : 'altro';
    return b + ' · ' + o;
  }
  const env = () => ({ device, ua: uaShort(), scr: screen.width + 'x' + screen.height, tz: new Date().getTimezoneOffset(), lang: navigator.language || '' });
  const persist = () => { if (run) { run.perfMs = run.perfAcc + (performance.now() - segStart); ls.set(RUN, run); } };

  /* ---------- uscite dalla pagina ---------- */
  let outAt = null;
  function goOut() { if (!run || outAt !== null) return; outAt = performance.now(); run.outClock = Date.now(); persist(); }
  function comeBack() {
    if (!run || outAt === null) return;
    const ms = performance.now() - outAt; outAt = null;
    if (ms > 400) { run.away.n++; run.away.ms += ms; if (run.away.events.length < 30) run.away.events.push({ t: run.outClock - Date.parse(run.start), ms: Math.round(ms) }); }
    delete run.outClock; persist();
  }
  document.addEventListener('visibilitychange', () => document.hidden ? goOut() : comeBack());
  window.addEventListener('blur', goOut); window.addEventListener('focus', comeBack);
  window.addEventListener('pagehide', () => { if (run) { if (outAt === null) { run.outClock = Date.now(); } persist(); } });

  /* ---------- domande ---------- */
  function shuffled(len) { const o = [...Array(len).keys()]; for (let k = o.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [o[k], o[r]] = [o[r], o[k]]; } return o; }
  function renderQuestions(order) {
    const box = $('quizQuestions'); box.innerHTML = '';
    lesson.quiz.forEach((q, i) => {
      const field = document.createElement('fieldset'); field.className = 'quiz-case';
      const legend = document.createElement('legend'); legend.textContent = (i + 1) + '. ' + q.case; field.append(legend);
      if (q.code) { const pre = document.createElement('pre'); pre.className = 'quiz-code'; pre.textContent = q.code; field.append(pre); }
      (order && order[i] || q.options.map((_, j) => j)).forEach((j, pos) => {
        const label = document.createElement('label'); label.className = 'quiz-option';
        const input = document.createElement('input'); input.type = 'radio'; input.name = 'q' + i; input.value = String(j); input.required = true;
        label.append(input, document.createTextNode(' ' + String.fromCharCode(65 + pos) + '. ' + q.options[j])); field.append(label);
      });
      const p = document.createElement('p'); p.className = 'feedback'; p.id = 'feedback-' + i; p.hidden = true; field.append(p);
      box.append(field);
    });
  }
  const answers = () => lesson.quiz.map((_, i) => { const x = form.querySelector('input[name=q' + i + ']:checked'); return x ? Number(x.value) : null; });
  const mmss = ms => { const s = Math.max(0, Math.round(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); };
  function progress() {
    const c = answers().filter(v => v !== null).length;
    $('quizCount').textContent = c + ' di ' + total + ' risposte' + (run ? ' · tempo ' + mmss(Date.now() - Date.parse(run.start)) : '');
    submit.disabled = c !== total || !run;
  }
  form.addEventListener('change', e => {
    if (!run || !e.target.name) return;
    const i = Number(e.target.name.slice(1)), t = Date.now() - Date.parse(run.start), q = run.q[i];
    if (q.first == null) q.first = t; q.last = t; q.changes++;
    run.answers[i] = Number(e.target.value); persist(); progress();
  });

  /* ---------- inizio del test ---------- */
  const who = ls.get(WHO); if (who) { $('stNome').value = who.nome || ''; $('stCognome').value = who.cognome || ''; $('stClasse').value = who.classe || ''; }
  const cleanName = s => s.trim().replace(/\s+/g, ' ');
  function beginTracking() { segStart = performance.now(); clearInterval(ticker); ticker = setInterval(progress, 1000); $('startBox').hidden = true; $('quizLive').hidden = false; form.hidden = false; $('quizIdentity').textContent = run.who.cognome + ' ' + run.who.nome + ' · ' + run.who.classe; progress(); }
  $('startQuiz').onclick = () => {
    const nome = cleanName($('stNome').value), cognome = cleanName($('stCognome').value), classe = $('stClasse').value.trim().toUpperCase().replace(/\s+/g, '');
    const msg = $('startMsg');
    if (nome.length < 2) { msg.textContent = 'Scrivi il tuo nome.'; $('stNome').focus(); return; }
    if (cognome.length < 2) { msg.textContent = 'Scrivi il tuo cognome.'; $('stCognome').focus(); return; }
    if (!/^[1-5][A-Z]{1,4}$/.test(classe)) { msg.textContent = 'Scrivi la classe nel formato 5A (anno e sezione).'; $('stClasse').focus(); return; }
    msg.textContent = '';
    ls.set(WHO, { nome, cognome, classe });
    const order = lesson.quiz.map(q => shuffled(q.options.length));
    run = { id: rnd(8), who: { nome, cognome, classe }, start: new Date().toISOString(), srvStart: null, order, answers: lesson.quiz.map(() => null), q: lesson.quiz.map(() => ({ first: null, last: null, changes: 0 })), away: { n: 0, ms: 0, events: [] }, reloads: 0, perfAcc: 0, perfMs: 0 };
    renderQuestions(order); form.reset(); persist(); beginTracking();
    serverTime().then(t => { if (run && !run.srvStart) { run.srvStart = t || 'n.d.'; persist(); } });
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  function resume(saved) {
    run = saved; run.reloads = (run.reloads || 0) + 1;
    if (run.outClock) { const ms = Date.now() - run.outClock; run.away.n++; run.away.ms += ms; if (run.away.events.length < 30) run.away.events.push({ t: run.outClock - Date.parse(run.start), ms }); delete run.outClock; }
    run.perfAcc = run.perfMs || 0;
    renderQuestions(run.order);
    run.answers.forEach((a, i) => { if (a != null) { const x = form.querySelector('input[name=q' + i + '][value="' + a + '"]'); if (x) x.checked = true; } });
    persist(); beginTracking();
    $('quizMessage').textContent = 'Test ripreso dopo un ricaricamento o una chiusura della pagina: l’evento è registrato nel PDF.';
  }

  /* ---------- consegna ---------- */
  function showResult(r) {
    current = r;
    const sc = course.score(n, r.last.answers), ok = sc >= need;
    const order = r.last.meta && r.last.meta.order; renderQuestions(order);
    lesson.quiz.forEach((q, i) => {
      const inp = form.querySelector('input[name=q' + i + '][value="' + r.last.answers[i] + '"]'); if (inp) inp.checked = true;
      const p = $('feedback-' + i), right = r.last.answers[i] === q.correct;
      p.hidden = false; p.classList.toggle('wrong', !right);
      p.textContent = right ? 'Risposta esatta. ' + q.feedback : 'Risposta da rivedere. Suggerimento: ' + q.hint;
    });
    form.hidden = false; form.querySelectorAll('input').forEach(x => x.disabled = true); submit.hidden = true;
    $('startBox').hidden = true; $('quizLive').hidden = true;
    $('quizScore').textContent = 'Punteggio: ' + sc + '/' + total + ' · ' + (ok ? 'Test superato ✓' : 'Servono almeno ' + need + ' risposte esatte');
    const m = r.last.meta;
    $('attemptCount').textContent = (m ? m.who.cognome + ' ' + m.who.nome + ' · ' + m.who.classe + ' · ' : '') + 'Tentativi: ' + r.attempts + (course.passed(n) ? ' · lezione completata' : '') + (m ? ' · durata ' + mmss(m.durMs) : '');
    $('quizResult').hidden = false;
    $('pdfQuiz').disabled = !m; $('pdfStatus').textContent = m ? '' : 'Questo tentativo è stato svolto prima dell’introduzione del PDF: ripeti il test per poterlo consegnare.';
    const cont = $('continueLink');
    if (cont) cont.hidden = !course.passed(n);
    if (cont && !course.available(n + 1)) { cont.textContent = 'La Lezione ' + (n + 1) + ' sarà presto disponibile'; cont.classList.add('nav-disabled'); }
    $('consegnaBox').hidden = !cfg.appsScriptUrl;
    course.refreshNavigation();
  }
  const metaCore = m => { const c = Object.assign({}, m); delete c.sig; return c; };
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!run) return;
    const a = answers(); if (a.some(x => x === null)) { $('quizMessage').textContent = 'Rispondi a tutte le domande.'; return; }
    submit.disabled = true; $('quizMessage').textContent = 'Consegna in corso…';
    comeBack(); clearInterval(ticker);
    const durMs = Math.round(run.perfAcc + (performance.now() - segStart));
    const end = new Date().toISOString(), srvEnd = await serverTime();
    const meta = { id: run.id, who: run.who, start: run.start, end, durMs, srvStart: run.srvStart === 'n.d.' ? null : run.srvStart, srvEnd, order: run.order, q: run.q, away: { n: run.away.n, ms: Math.round(run.away.ms), events: run.away.events }, reloads: run.reloads, env: env() };
    try {
      meta.sig = await window.OctPdf.sign({ lesson: n, answers: a, meta: metaCore(meta) });
      const r = course.save(n, a, meta); run = null; ls.del(RUN);
      showResult(r); $('quizMessage').textContent = ''; $('quizResult').focus();
    } catch (err) { $('quizMessage').textContent = err.message; submit.disabled = false; }
  });
  $('retryQuiz').onclick = () => {
    form.reset(); form.hidden = true; submit.hidden = false;
    $('quizResult').hidden = true; $('consegnaBox').hidden = true; $('startBox').hidden = false; $('quizMessage').textContent = '';
    $('startBox').scrollIntoView({ behavior: 'smooth' });
  };

  /* ---------- PDF per Classroom ---------- */
  function flagsOf(p) {
    const f = [], a = p.att;
    if (!a.localOk) f.push('I dati del tentativo sono stati modificati nel browser dopo la consegna.');
    if (a.imported) f.push('Il tentativo è stato importato da un altro dispositivo (' + new Date(a.imported).toLocaleString('it-IT') + ').');
    if (a.away.n >= 3 || a.away.ms >= 60000) f.push('Uscite dalla pagina durante il test: ' + a.away.n + ', per ' + Math.round(a.away.ms / 1000) + ' s in tutto.');
    if (a.reloads) f.push('Pagina ricaricata o chiusa ' + a.reloads + ' volt' + (a.reloads === 1 ? 'a' : 'e') + ' durante il test.');
    if (a.durMs / a.total < 5000) f.push('Tempo medio per domanda inferiore a 5 secondi.');
    [['srvStart', 'start', 'all’inizio'], ['srvEnd', 'end', 'alla consegna']].forEach(([s, c, w]) => { if (a[s]) { const d = Math.abs(Date.parse(a[c]) - Date.parse(a[s])); if (d > 120000) f.push('L’orologio del dispositivo differiva dall’ora del sito di ' + Math.round(d / 60000) + ' minuti ' + w + '.'); } });
    if (Math.abs((Date.parse(a.end) - Date.parse(a.start)) - a.durMs) > 120000) f.push('La durata secondo l’orologio del dispositivo non coincide con quella misurata dal browser.');
    if (!a.srvStart && !a.srvEnd) f.push('Ora del sito non disponibile: dispositivo non connesso durante il test.');
    return f;
  }
  $('pdfQuiz').onclick = async () => {
    const r = current, m = r && r.last.meta, st = $('pdfStatus'); if (!m) return;
    const btn = $('pdfQuiz'); btn.disabled = true; st.textContent = 'Preparazione del PDF…';
    try {
      const localOk = (await window.OctPdf.sign({ lesson: n, answers: r.last.answers, meta: metaCore(m) })) === m.sig;
      const ex = window.OctRunner.exercisesDone('l' + n + '-');
      const att = { id: m.id, attemptNo: r.attempts, start: m.start, end: m.end, durMs: m.durMs, srvStart: m.srvStart, srvEnd: m.srvEnd, away: m.away, reloads: m.reloads, q: m.q, order: m.order, answers: r.last.answers, score: course.score(n, r.last.answers), total, need, localSig: m.sig, localOk, imported: r.imported || null };
      const payload = { v: 1, course: 'octave-quinte', lesson: n, title: lesson.title, who: m.who, att, history: r.history || [], ex: { done: ex.done, total: ex.total, items: ex.items }, env: Object.assign({}, m.env, { device: m.env.device }), genEnv: env(), firstOpen: ls.get(FIRST), pageOpen, gen: new Date().toISOString(), srvGen: await serverTime() };
      payload.flags = flagsOf(payload);
      const name = await window.OctPdf.build({ payload, lesson, flags: payload.flags });
      st.textContent = 'Scaricato «' + name + '». Caricalo su Classroom così com’è, senza modificarlo né stamparlo.';
    } catch (err) { st.textContent = 'PDF non creato: ' + err.message; }
    finally { btn.disabled = false; }
  };

  /* ---------- consegna online facoltativa (Apps Script) ---------- */
  function report(r) {
    const m = r.last.meta, sc = course.score(n, r.last.answers), ex = exStatus();
    return {
      corso: 'Calcolo numerico con Octave · classi quinte', lezione: n, titolo: lesson.title,
      studente: m ? m.who.cognome + ' ' + m.who.nome : '', classe: m ? m.who.classe : '',
      punteggio: sc, totale: total, soglia: need, superato: sc >= need, tentativi: r.attempts,
      data: r.last.at, esercizi: ex.done + '/' + ex.total,
      risposte: lesson.quiz.map((q, i) => ({ domanda: q.case, codice: q.code || '', scelta: q.options[r.last.answers[i]], esatta: q.options[q.correct], corretta: r.last.answers[i] === q.correct }))
    };
  }
  const sentKey = 'octConsegna-' + n;
  $('consegnaBtn').onclick = async () => {
    const st = $('consegnaStatus'), btn = $('consegnaBtn');
    if (!current || !current.last.meta) { st.textContent = 'Svolgi prima il test.'; return; }
    btn.disabled = true; st.textContent = 'Invio in corso…';
    const payload = report(current);
    try {
      const res = await fetch(cfg.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const data = await res.json(); if (!data.ok) throw Error(data.error || 'risposta non valida');
      ls.set(sentKey, { at: new Date().toISOString(), punteggio: payload.punteggio });
      st.textContent = '✓ Consegnato al docente (' + payload.punteggio + '/' + total + ').';
    } catch (err) { st.textContent = 'Invio non confermato (' + err.message + '). Riprova o consegna il PDF su Classroom.'; }
    finally { btn.disabled = false; }
  };

  /* ---------- avvio ---------- */
  const inProgress = ls.get(RUN), saved = course.read(n);
  if (inProgress && inProgress.id && inProgress.order) resume(inProgress);
  else if (saved) showResult(saved);
  else { renderQuestions(null); form.hidden = true; }
})();
