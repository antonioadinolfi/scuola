/* Corso Python OOP · pagina di lezione: test finale con soglia 70%, esito, consegna al docente. */
"use strict";
(() => {
  const n = Number(document.documentElement.dataset.lesson), lesson = window.OOP_LESSONS[n - 1], course = window.OopCourse;
  const cfg = window.OOP_CONFIG || {};
  const $ = id => document.getElementById(id);
  const form = $('finalQuiz'), submit = $('submitQuiz'), total = lesson.quiz.length, need = course.threshold(n);
  let current = null;

  const proj = $('projection');
  if (proj) proj.onclick = function () { const on = document.body.classList.toggle('projection'); this.setAttribute('aria-pressed', String(on)); this.textContent = on ? 'Testo normale' : 'Testo ingrandito'; };

  /* Esercizi completati nella lezione */
  function exStatus() { const s = window.PyRunner.exercisesDone('l' + n + '-'), e = $('exProgress'); if (e) e.textContent = 'Esercizi completati: ' + s.done + ' su ' + s.total; return s; }
  document.addEventListener('oop-exercise-done', exStatus); exStatus();

  /* Test */
  lesson.quiz.forEach((q, i) => {
    const field = document.createElement('fieldset'); field.className = 'quiz-case';
    const legend = document.createElement('legend'); legend.textContent = (i + 1) + '. ' + q.case; field.append(legend);
    if (q.code) { const pre = document.createElement('pre'); pre.className = 'quiz-code'; pre.textContent = q.code; field.append(pre); }
    const order = q.options.map((_, j) => j);
    for (let k = order.length - 1; k > 0; k--) { const r = Math.floor(Math.random() * (k + 1)); [order[k], order[r]] = [order[r], order[k]]; }
    order.forEach((j, pos) => {
      const label = document.createElement('label'); label.className = 'quiz-option';
      const input = document.createElement('input'); input.type = 'radio'; input.name = 'q' + i; input.value = String(j); input.required = true;
      label.append(input, document.createTextNode(' ' + String.fromCharCode(65 + pos) + '. ' + q.options[j])); field.append(label);
    });
    const p = document.createElement('p'); p.className = 'feedback'; p.id = 'feedback-' + i; p.hidden = true; field.append(p);
    $('quizQuestions').append(field);
  });
  const answers = () => lesson.quiz.map((_, i) => { const x = form.querySelector('input[name=q' + i + ']:checked'); return x ? Number(x.value) : null; });
  function progress() { const c = answers().filter(v => v !== null).length; $('quizCount').textContent = c + ' di ' + total + ' risposte'; submit.disabled = c !== total; }
  form.addEventListener('change', progress); progress();

  function showResult(r) {
    current = r;
    const sc = course.score(n, r.last.answers), ok = sc >= need;
    lesson.quiz.forEach((q, i) => {
      const inp = form.querySelector('input[name=q' + i + '][value="' + r.last.answers[i] + '"]'); if (inp) inp.checked = true;
      const p = $('feedback-' + i), right = r.last.answers[i] === q.correct;
      p.hidden = false; p.classList.toggle('wrong', !right);
      p.textContent = right ? 'Risposta esatta. ' + q.feedback : 'Risposta da rivedere. Suggerimento: ' + q.hint;
    });
    form.querySelectorAll('input').forEach(x => x.disabled = true); submit.hidden = true;
    $('quizScore').textContent = 'Punteggio: ' + sc + '/' + total + ' · ' + (ok ? 'Test superato ✓' : 'Servono almeno ' + need + ' risposte esatte');
    $('attemptCount').textContent = 'Tentativi: ' + r.attempts + (course.passed(n) ? ' · lezione completata' : '');
    $('quizResult').hidden = false;
    const cont = $('continueLink');
    if (cont) cont.hidden = !course.passed(n);
    if (cont && !course.available(n + 1)) { cont.textContent = 'La Lezione ' + (n + 1) + ' sarà presto disponibile'; cont.classList.add('nav-disabled'); }
    $('consegnaBox').hidden = false;
    course.refreshNavigation();
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    try { const r = course.save(n, answers()); showResult(r); $('quizMessage').textContent = ''; $('quizResult').focus(); }
    catch (err) { $('quizMessage').textContent = err.message; }
  });
  $('retryQuiz').onclick = () => {
    form.reset(); form.querySelectorAll('input').forEach(x => x.disabled = false); submit.hidden = false;
    lesson.quiz.forEach((_, i) => { $('feedback-' + i).hidden = true; });
    $('quizResult').hidden = true; $('consegnaBox').hidden = true; progress();
    form.scrollIntoView({ behavior: 'smooth' });
  };
  const saved = course.read(n); if (saved) showResult(saved);

  function report(r, who) {
    const sc = course.score(n, r.last.answers), ex = exStatus();
    return {
      corso: 'Python a oggetti · classi quarte', lezione: n, titolo: lesson.title,
      studente: who ? who.nome : '', classe: who ? who.classe : '',
      punteggio: sc, totale: total, soglia: need, superato: sc >= need, tentativi: r.attempts,
      data: r.last.at, esercizi: ex.done + '/' + ex.total,
      risposte: lesson.quiz.map((q, i) => ({ domanda: q.case, codice: q.code || '', scelta: q.options[r.last.answers[i]], esatta: q.options[q.correct], corretta: r.last.answers[i] === q.correct }))
    };
  }
  $('downloadQuiz').onclick = () => {
    if (!current) return;
    const d = report(current, readWho()), lines = ['Corso Python a oggetti · Lezione ' + n + ' – ' + lesson.title, (d.studente ? d.studente + ' · ' + d.classe + '\n' : '') + 'Data: ' + new Date(d.data).toLocaleString('it-IT'), 'Punteggio: ' + d.punteggio + '/' + d.totale + (d.superato ? ' (superato)' : ' (non superato)'), 'Esercizi completati: ' + d.esercizi, ''];
    lesson.quiz.forEach((q, i) => lines.push((i + 1) + '. ' + q.case, '   Risposta: ' + d.risposte[i].scelta, '   ' + (d.risposte[i].corretta ? 'Esatta' : 'Da rivedere · ' + q.hint), ''));
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = 'esito-lezione-' + n + '.txt'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* Consegna al docente (Google Apps Script → PDF su Drive) */
  const WHO = 'pyOopStudente';
  function readWho() { try { return JSON.parse(localStorage.getItem(WHO) || 'null'); } catch { return null; } }
  const who = readWho(); if (who) { $('stNome').value = who.nome || ''; $('stClasse').value = who.classe || ''; }
  const sentKey = 'pyOopConsegna-' + n;
  function sentInfo() { try { const s = JSON.parse(localStorage.getItem(sentKey) || 'null'); if (s) $('consegnaStatus').textContent = 'Ultima consegna: ' + new Date(s.at).toLocaleString('it-IT') + ' · punteggio ' + s.punteggio + '/' + total + '.'; } catch {} }
  sentInfo();
  $('consegnaForm').addEventListener('submit', async e => {
    e.preventDefault();
    const st = $('consegnaStatus'), btn = $('consegnaBtn');
    const nome = $('stNome').value.trim().replace(/\s+/g, ' '), classe = $('stClasse').value.trim().toUpperCase();
    if (nome.length < 3 || !/\s/.test(nome)) { st.textContent = 'Scrivi nome e cognome.'; return; }
    if (!classe) { st.textContent = 'Indica la classe (es. 4B).'; return; }
    if (!current) { st.textContent = 'Svolgi prima il test.'; return; }
    try { localStorage.setItem(WHO, JSON.stringify({ nome, classe })); } catch {}
    if (!cfg.appsScriptUrl) { st.textContent = 'La consegna online non è ancora attiva: scarica l’esito e consegnalo come indicato dal docente.'; return; }
    btn.disabled = true; st.textContent = 'Invio in corso…';
    const payload = report(current, { nome, classe });
    try {
      const res = await fetch(cfg.appsScriptUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!data.ok) throw Error(data.error || 'risposta non valida');
      try { localStorage.setItem(sentKey, JSON.stringify({ at: new Date().toISOString(), punteggio: payload.punteggio })); } catch {}
      st.textContent = '✓ Consegnato al docente (' + payload.punteggio + '/' + total + '). Puoi chiudere la pagina.';
    } catch (err) {
      st.textContent = 'Invio non confermato (' + err.message + '). Controlla la connessione e riprova, oppure scarica l’esito.';
    } finally { btn.disabled = false; }
  });
})();
