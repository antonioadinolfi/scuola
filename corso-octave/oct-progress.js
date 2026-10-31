/* Corso Octave · avanzamento: test con soglia del 70%, sblocco progressivo delle lezioni,
   modalità docente, esportazione/importazione dell'avanzamento tra dispositivi. */
"use strict";
window.OctCourse = (() => {
  const lessons = window.OCT_LESSONS, PREFIX = 'octQuizV1-', VERSION = 1;
  const quizOf = n => (lessons[n - 1] && lessons[n - 1].quiz) || [];
  const threshold = n => Math.ceil(quizOf(n).length * 0.7);
  const ls = {
    get(k) { for (const s of ['localStorage', 'sessionStorage']) { try { const v = window[s].getItem(k); if (v) return JSON.parse(v); } catch {} } return null; },
    set(k, v) { for (const s of ['localStorage', 'sessionStorage']) { try { window[s].setItem(k, JSON.stringify(v)); return true; } catch {} } return false; }
  };
  function validAnswers(n, a) { const q = quizOf(n); return Array.isArray(a) && a.length === q.length && a.every((v, i) => Number.isInteger(v) && v >= 0 && v < q[i].options.length); }
  function score(n, a) { if (!validAnswers(n, a)) return 0; return quizOf(n).reduce((s, q, i) => s + (q.correct === a[i] ? 1 : 0), 0); }
  function read(n) { const r = ls.get(PREFIX + n); return r && r.version === VERSION && r.last && validAnswers(n, r.last.answers) ? r : null; }
  function passed(n) { const r = read(n); return !!(r && r.best && score(n, r.best.answers) >= threshold(n)); }
  const TEACHER = 'octDocenteV1';
  function teacher() { try { return localStorage.getItem(TEACHER) === '1'; } catch { return false; } }
  function available(n) { return !!(lessons[n - 1] && lessons[n - 1].available); }
  function missing(n) { if (teacher()) return null; for (let i = 1; i < n; i++) if (!passed(i)) return i; return null; }
  function save(n, answers) {
    if (!validAnswers(n, answers)) throw Error('Rispondi a tutte le domande.');
    const old = read(n), attempt = { answers: [...answers], at: new Date().toISOString() };
    let best = old && old.best || null;
    if (score(n, answers) >= threshold(n) && (!best || score(n, answers) >= score(n, best.answers))) best = attempt;
    const r = { version: VERSION, last: attempt, best, attempts: (old && old.attempts || 0) + 1 };
    if (!ls.set(PREFIX + n, r)) throw Error('Il browser non consente di salvare il risultato: abilita i dati del sito.');
    return r;
  }
  function refreshNavigation() {
    document.querySelectorAll('[data-lesson-link]').forEach(a => {
      const n = Number(a.dataset.lessonLink), blocked = missing(n), st = a.querySelector('.nav-state');
      if (!available(n)) { a.classList.add('nav-disabled'); a.title = 'Lezione in preparazione'; if (st) st.textContent = ' · presto'; return; }
      a.classList.toggle('locked-link', !!blocked);
      a.title = blocked ? 'Richiede almeno il 70% nel test della Lezione ' + blocked : 'Apri la Lezione ' + n;
      if (st) st.textContent = passed(n) ? ' · ✓' : blocked ? ' · bloccata' : '';
    });
  }
  function gate() {
    const n = Number(document.documentElement.dataset.lesson);
    document.documentElement.classList.remove('course-pending');
    if (n) {
      const blocked = missing(n);
      document.documentElement.classList.toggle('course-locked', !!blocked);
      let box = document.getElementById('courseGate');
      if (blocked) {
        if (!box) {
          box = document.createElement('section'); box.id = 'courseGate'; box.className = 'panel gate';
          box.innerHTML = '<h1>Completa prima la lezione precedente</h1><p id="gateText"></p><a class="button primary" id="gateLink">Vai al test richiesto →</a><div><p><strong>Hai svolto i test su un altro dispositivo?</strong> Carica il file di avanzamento che hai scaricato.</p><label class="button file-button">Carica il mio avanzamento<input type="file" id="gateImport" accept="application/json,.json"></label><p id="gateStatus" role="status" aria-live="polite"></p></div>';
          box.querySelector('#gateImport').addEventListener('change', async e => {
            const f = e.target.files[0], st = box.querySelector('#gateStatus'); if (!f) return;
            try { const r = await transfer.load(f); st.textContent = r.msg; if (!missing(n)) setTimeout(() => location.reload(), 800); }
            catch (err) { st.textContent = 'Caricamento non riuscito: ' + err.message; } finally { e.target.value = ''; }
          });
          document.body.prepend(box);
        }
        box.querySelector('#gateText').textContent = 'Per accedere alla Lezione ' + n + ' serve almeno il 70% nel test della Lezione ' + blocked + '.';
        box.querySelector('#gateLink').href = './lezione-' + blocked + '.html#test-finale';
      } else if (box) box.remove();
    }
    refreshNavigation(); teacherBadge();
  }
  function teacherBadge() {
    let b = document.getElementById('teacherBadge');
    if (!teacher()) { if (b) b.remove(); return; }
    if (b || !document.body) return;
    b = document.createElement('div'); b.id = 'teacherBadge'; b.className = 'trainer-badge'; b.setAttribute('role', 'status');
    b.innerHTML = '<span><strong>Modalità docente</strong> · lezioni sbloccate su questo browser</span> <button type="button">Disattiva</button>';
    b.querySelector('button').onclick = () => { try { localStorage.removeItem(TEACHER); } catch {} location.reload(); };
    document.body.append(b);
  }
  async function teacherLink() {
    const h = location.hash;
    if (h === '#docente-off') { try { localStorage.removeItem(TEACHER); } catch {} history.replaceState(null, '', location.pathname + location.search); gate(); return; }
    if (!h.startsWith('#docente=')) return;
    const token = decodeURIComponent(h.slice(9)); history.replaceState(null, '', location.pathname + location.search);
    try {
      const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
      const hex = [...new Uint8Array(d)].map(x => x.toString(16).padStart(2, '0')).join('');
      if (hex === 'ecc804b918257dafe93c95276fba19d91669bcdb32893975cbb9b74018f19933') { localStorage.setItem(TEACHER, '1'); location.reload(); }
    } catch {}
  }

  const transfer = {
    download() {
      const data = { course: 'octave-quinte', format: 1, exported: new Date().toISOString(), results: {}, code: {}, exercises: {} };
      lessons.forEach((_, i) => { const r = read(i + 1); if (r) data.results[i + 1] = r; });
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k.startsWith('octCode-')) data.code[k] = localStorage.getItem(k).slice(0, 20000);
          if (k.startsWith('octEx-')) data.exercises[k] = '1';
        }
      } catch {}
      const nr = Object.keys(data.results).length, ne = Object.keys(data.exercises).length;
      if (!nr && !ne && !Object.keys(data.code).length) return { ok: false, msg: 'Non ci sono ancora test, esercizi o codice salvati in questo browser.' };
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' }));
      const a = document.createElement('a'); a.href = url; a.download = 'avanzamento-octave.json'; document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { ok: true, msg: 'File scaricato: ' + nr + ' test e ' + ne + ' esercizi completati, più il tuo codice. Caricalo sull’altro dispositivo.' };
    },
    async load(file) {
      const data = JSON.parse(await file.text());
      if (data.course !== 'octave-quinte') throw Error('il file non è un avanzamento di questo corso.');
      let tests = 0, ex = 0;
      for (const [k, r] of Object.entries(data.results || {})) {
        const n = Number(k); if (!(n >= 1 && n <= lessons.length) || !r || r.version !== VERSION || !r.last || !validAnswers(n, r.last.answers)) continue;
        const cur = read(n), sc = x => score(n, ((x.best || x.last) || {}).answers);
        if (!cur || sc(r) >= sc(cur)) { if (ls.set(PREFIX + n, r)) tests++; }
      }
      try {
        for (const [k, v] of Object.entries(data.code || {})) if (/^octCode-[\w-]+$/.test(k) && typeof v === 'string' && !localStorage.getItem(k)) localStorage.setItem(k, v.slice(0, 20000));
        for (const k of Object.keys(data.exercises || {})) if (/^octEx-[\w-]+$/.test(k)) { if (!localStorage.getItem(k)) ex++; localStorage.setItem(k, '1'); }
      } catch {}
      return { tests, msg: 'Avanzamento caricato: ' + tests + ' test e ' + ex + ' esercizi.' };
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    teacherLink(); gate();
    document.querySelectorAll('[data-lesson-link]').forEach(a => a.addEventListener('click', e => {
      const n = Number(a.dataset.lessonLink); if (!available(n)) { e.preventDefault(); return; }
      const blocked = missing(n); if (blocked) { e.preventDefault(); location.href = './lezione-' + blocked + '.html#test-finale'; }
    }));
  });
  for (const ev of ['pageshow', 'storage']) window.addEventListener(ev, () => { if (document.readyState !== 'loading') gate(); });
  return { read, save, score, passed, missing, threshold, available, teacher, gate, refreshNavigation, transfer };
})();
