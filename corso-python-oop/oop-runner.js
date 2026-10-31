/* Corso Python OOP · editor Python nel browser con esecuzione Pyodide in worker,
   esercizi con verifiche automatiche, suggerimenti e salvataggio locale del codice. */
"use strict";
window.PyRunner = (() => {
  const TIMEOUT_MS = 6000;
  let worker = null, readyPromise = null, seq = 0;
  const pending = new Map();
  const listeners = new Set();
  const status = s => listeners.forEach(f => f(s));

  function start() {
    if (readyPromise) return readyPromise;
    status('loading');
    worker = new Worker('./oop-worker.js');
    readyPromise = new Promise((resolve, reject) => {
      worker.onmessage = e => {
        const m = e.data;
        if (m.type === 'ready') { status('ready'); resolve(); }
        else if (m.type === 'fatal') { status('error'); reset(); reject(new Error(m.message)); }
        else if (m.type === 'result' && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); p(m); }
      };
      worker.onerror = () => { status('error'); reset(); reject(new Error('Impossibile avviare Python: controlla la connessione e ricarica la pagina.')); };
    });
    return readyPromise;
  }
  function reset() {
    if (worker) worker.terminate();
    worker = null; readyPromise = null;
    pending.forEach(p => p({ interrotto: true })); pending.clear();
  }
  async function run(code, checks) {
    await start();
    return new Promise(resolve => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reset(); resolve({ timeout: true }); }, TIMEOUT_MS);
      pending.set(id, r => { clearTimeout(timer); resolve(r); });
      worker.postMessage({ id, code, checks: checks || null });
    });
  }

  /* Spiegazioni in italiano degli errori più frequenti nella programmazione a oggetti */
  const RULES = [
    [/takes (\d+) positional arguments? but (\d+) (?:were|was) given/, 'Il metodo ha ricevuto più argomenti di quanti ne dichiara. Hai dimenticato self come primo parametro? Ricorda: Python passa l’oggetto come primo argomento in automatico.'],
    [/missing (\d+) required positional arguments?: (.+)$/, 'Nella chiamata manca qualche valore ($2). Confronta i parametri di __init__ (o del metodo) con gli argomenti che passi tra parentesi.'],
    [/'(\w+)' object has no attribute '(\w+)'/, 'Gli oggetti di tipo $1 non hanno l’attributo «$2». L’hai creato con self.$2 = … dentro __init__? È scritto in modo identico (maiuscole comprese)?'],
    [/type object '(\w+)' has no attribute '(\w+)'/, 'La classe $1 non ha «$2». Forse volevi usarlo su un oggetto (istanza) e non sulla classe?'],
    [/name '(\w+)' is not defined/, 'Il nome «$1» non esiste in quel punto. Controlla come è scritto. Se è un attributo e sei dentro un metodo, scrivi self.$1.'],
    [/'(\w+)' object is not callable/, 'Stai usando un valore di tipo $1 come se fosse una funzione (con le parentesi). Forse un attributo ha lo stesso nome di un metodo?'],
    [/unsupported operand type/, 'Operazione tra tipi incompatibili (ad esempio numero + testo). Controlla i tipi dei valori: puoi usare str() o int() per convertirli.'],
    [/division by zero/, 'Divisione per zero: controlla il valore del divisore prima di dividere.'],
  ];
  function explain(err) {
    if (!err) return '';
    if (err.tipo === 'IndentationError' || err.tipo === 'TabError') return 'Rientro (indentazione) sbagliato: il corpo di class, def, if, for va spostato a destra di 4 spazi, sempre uguali.';
    if (err.tipo === 'SyntaxError') return 'Errore di sintassi: controlla i due punti «:» dopo class/def/if, le parentesi e le virgolette chiuse.';
    for (const [re, txt] of RULES) { const m = err.msg.match(re); if (m) return txt.replace(/\$(\d)/g, (_, i) => m[i]); }
    return '';
  }

  /* ---------- Editor ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  function setupEditor(box) {
    const id = box.dataset.py, exId = box.dataset.ex, ex = exId ? (window.OOP_EXERCISES || {})[exId] : null;
    const srcEl = box.querySelector('textarea.py-src');
    const starter = srcEl.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
    const key = 'pyOopCode-' + id;
    const head = el('div', 'py-head'), title = el('span', 'py-title', box.dataset.title || (ex ? 'Il tuo codice' : 'Esempio eseguibile'));
    const tools = el('div', 'py-tools');
    const btnRun = el('button', 'run', '▶ Esegui'); btnRun.type = 'button';
    const btnReset = el('button', '', '↺ Ripristina'); btnReset.type = 'button'; btnReset.title = 'Torna al codice iniziale';
    tools.append(btnRun);
    let btnCheck, btnHint, btnSol;
    if (ex) {
      btnCheck = el('button', 'verify', '✓ Verifica'); btnCheck.type = 'button';
      btnHint = el('button', '', '💡 Suggerimento'); btnHint.type = 'button';
      btnSol = el('button', '', 'Soluzione'); btnSol.type = 'button'; btnSol.disabled = true; btnSol.title = 'Disponibile dopo 3 verifiche o a esercizio completato';
      tools.append(btnCheck, btnHint);
    }
    tools.append(btnReset); if (btnSol) tools.append(btnSol);
    head.append(title, tools);
    const wrap = el('div', 'py-editor'), gutter = el('pre', 'py-gutter'), code = el('textarea', 'py-code');
    code.spellcheck = false; code.setAttribute('autocapitalize', 'off'); code.setAttribute('autocomplete', 'off'); code.setAttribute('autocorrect', 'off');
    code.setAttribute('aria-label', (box.dataset.title || 'Editor Python') + ': codice modificabile');
    code.value = store.get(key) ?? starter;
    wrap.append(gutter, code);
    const hint = el('div', 'py-hint'); hint.hidden = true; hint.setAttribute('role', 'status');
    const checks = el('ul', 'py-checks'); checks.hidden = true; checks.setAttribute('aria-live', 'polite');
    const out = el('pre', 'py-out'); out.setAttribute('aria-live', 'polite');
    srcEl.replaceWith(head, wrap, hint, checks, out);

    let badLine = null;
    function refresh() {
      const n = code.value.split('\n').length;
      gutter.innerHTML = '';
      for (let i = 1; i <= n; i++) { const s = el('span', i === badLine ? 'bad' : '', String(i)); gutter.append(s, '\n'); }
      code.style.height = 'auto'; code.style.height = code.scrollHeight + 'px';
    }
    refresh();
    requestAnimationFrame(refresh);
    code.addEventListener('input', () => { badLine = null; refresh(); if (code.value === starter) store.del(key); else store.set(key, code.value); });
    code.addEventListener('focus', () => start().catch(() => {}), { once: true });
    code.addEventListener('keydown', e => {
      const v = code.value, s = code.selectionStart, en = code.selectionEnd;
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); (btnCheck && e.shiftKey ? btnCheck : btnRun).click(); return; }
      if (e.key === 'Tab') {
        e.preventDefault();
        const ls = v.lastIndexOf('\n', s - 1) + 1;
        if (s === en && !e.shiftKey) { code.setRangeText('    ', s, en, 'end'); }
        else {
          const block = v.slice(ls, en);
          const changed = e.shiftKey ? block.replace(/^ {1,4}/gm, '') : block.replace(/^/gm, '    ');
          code.setRangeText(changed, ls, en, 'select');
        }
        code.dispatchEvent(new Event('input')); return;
      }
      if (e.key === 'Enter' && !e.isComposing) {
        const ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
        let ind = line.match(/^ */)[0];
        if (/:\s*(#.*)?$/.test(line)) ind += '    ';
        e.preventDefault(); code.setRangeText('\n' + ind, s, en, 'end'); code.dispatchEvent(new Event('input'));
      }
    });

    let busy = false;
    async function exec(withChecks) {
      if (busy) return; busy = true;
      [btnRun, btnCheck].forEach(b => b && (b.disabled = true));
      out.innerHTML = ''; out.append(el('span', 'info', readyPromise ? 'Esecuzione…' : 'Avvio di Python nel browser… (la prima volta richiede alcuni secondi)'));
      let r;
      try { r = await run(code.value, withChecks ? ex.checks.map(c => c.c) : null); }
      catch (err) { r = { fatal: err.message }; }
      busy = false; [btnRun, btnCheck].forEach(b => b && (b.disabled = false));
      out.innerHTML = '';
      if (r.fatal) { out.append(el('span', 'err', r.fatal)); return null; }
      if (r.timeout) { out.append(el('span', 'err', 'Il programma non è terminato entro ' + TIMEOUT_MS / 1000 + ' secondi ed è stato fermato. C’è un ciclo infinito (while sempre vero)?')); return null; }
      if (r.interrotto) { out.append(el('span', 'err', 'Esecuzione interrotta. Riprova.')); return null; }
      if (r.out) out.append(document.createTextNode(r.out));
      if (r.errore) {
        badLine = r.errore.riga; refresh();
        const where = r.errore.riga ? ' (riga ' + r.errore.riga + ')' : '';
        out.append(el('span', 'err', (r.out && !r.out.endsWith('\n') ? '\n' : '') + r.errore.tipo + where + ': ' + r.errore.msg));
        const tip = explain(r.errore); if (tip) out.append(el('span', 'info', '\n→ ' + tip));
      } else if (!r.out && !withChecks) out.append(el('span', 'info', 'Programma eseguito senza errori e senza output (nessun print).'));
      return r;
    }
    btnRun.onclick = () => exec(false);
    btnReset.onclick = () => { if (code.value !== starter && !confirm('Vuoi tornare al codice iniziale? Le tue modifiche andranno perse.')) return; code.value = starter; store.del(key); badLine = null; refresh(); out.innerHTML = ''; checks.hidden = true; };

    if (ex) {
      const doneKey = 'pyOopEx-' + exId, triesKey = 'pyOopTries-' + exId;
      let tries = Number(store.get(triesKey)) || 0, hintIdx = 0;
      const markDone = () => { box.closest('.exercise')?.classList.add('done'); const b = box.closest('.exercise')?.querySelector('.ex-badge'); if (b) b.textContent = '✓ Completato'; btnSol.disabled = false; };
      if (store.get(doneKey)) markDone();
      if (tries >= 3) btnSol.disabled = false;
      btnCheck.onclick = async () => {
        const r = await exec(true); if (!r) return;
        tries++; store.set(triesKey, String(tries)); if (tries >= 3) btnSol.disabled = false;
        checks.innerHTML = ''; checks.hidden = false;
        const res = r.verifiche || [], okN = res.filter(x => x.ok).length;
        ex.checks.forEach((c, i) => {
          const v = res[i] || { ok: false }, li = el('li', v.ok ? 'ok' : 'ko', c.t);
          if (!v.ok) { const why = [v.msg, c.h].filter(Boolean).join(' → '); if (why) li.append(el('span', 'why', why)); }
          checks.append(li);
        });
        const all = okN === ex.checks.length;
        checks.prepend(el('li', 'summary', all ? '🎉 Tutte le verifiche superate (' + okN + '/' + ex.checks.length + '). Esercizio completato!' : 'Verifiche superate: ' + okN + ' su ' + ex.checks.length + '. Correggi e riprova.'));
        if (all) { store.set(doneKey, '1'); markDone(); document.dispatchEvent(new CustomEvent('oop-exercise-done', { detail: exId })); }
      };
      btnHint.onclick = () => {
        const hs = ex.hints || []; if (!hs.length) return;
        hint.hidden = false; hint.textContent = '💡 Suggerimento ' + (hintIdx + 1) + ' di ' + hs.length + ': ' + hs[hintIdx];
        hintIdx = (hintIdx + 1) % hs.length;
      };
      btnSol.onclick = () => {
        if (!confirm('Vuoi vedere la soluzione? Il tuo codice verrà sostituito (puoi tornare all’inizio con Ripristina).')) return;
        code.value = ex.solution.replace(/^\n/, ''); store.set(key, code.value); badLine = null; refresh();
      };
    }
  }

  function exercisesDone(prefix) {
    const ids = Object.keys(window.OOP_EXERCISES || {}).filter(k => k.startsWith(prefix));
    return { done: ids.filter(k => store.get('pyOopEx-' + k)).length, total: ids.length };
  }

  document.addEventListener('DOMContentLoaded', () => document.querySelectorAll('.py-box[data-py]').forEach(setupEditor));
  return { run, start, onStatus: f => listeners.add(f), exercisesDone, explain };
})();
