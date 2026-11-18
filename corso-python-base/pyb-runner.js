/* Corso Introduzione a Python · editor Python nel browser (Pyodide in un worker).
   Componenti:
   - <div class="py-box" data-py="id" [data-ex="l2-e2"] [data-stdin="riga1\nriga2"] data-title="…"><textarea class="py-src">codice</textarea></div>
     editor con ▶ Esegui; se il codice usa input() compare la casella «Input da tastiera».
     Con data-ex diventa un esercizio con verifiche automatiche (window.PYB_EXERCISES).
   - <div class="py-trace" data-stdin="…" data-title="…"><textarea class="py-src">…</textarea></div>
     visualizzatore passo passo: riga corrente, variabili con il loro tipo, output.
   - <div class="py-shell"></div>  shell interattiva >>> come quella di IDLE. */
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
    worker = new Worker('./pyb-worker.js');
    readyPromise = new Promise((resolve, reject) => {
      worker.onmessage = e => {
        const m = e.data;
        if (m.type === 'ready') { status('ready'); resolve(); }
        else if (m.type === 'fatal') { status('error'); reset(); reject(new Error('Impossibile avviare Python: controlla la connessione e ricarica la pagina.')); }
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
  async function call(msg) {
    await start();
    return new Promise(resolve => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reset(); resolve({ timeout: true }); }, TIMEOUT_MS);
      pending.set(id, r => { clearTimeout(timer); resolve(r); });
      worker.postMessage({ id, ...msg });
    });
  }
  const run = (code, checks, stdin) => call({ mode: 'run', code, checks: checks || null, stdin: stdin || '' });
  const trace = (code, stdin) => call({ mode: 'trace', code, stdin: stdin || '' });
  const repl = code => call({ mode: 'repl', code });

  /* Spiegazioni in italiano degli errori più frequenti per chi comincia */
  const RULES = [
    [/name '(\w+)' is not defined/, 'Il nome «$1» non esiste. Controlla come è scritto (Python distingue maiuscole e minuscole) e che la variabile abbia ricevuto un valore prima di essere usata. Se è un testo, mettilo tra virgolette.'],
    [/can only concatenate str \(not "(\w+)"\) to str/, 'Stai unendo con + un testo e un valore di tipo $1. Converti il numero in testo con str(), oppure separa i valori con la virgola dentro print().'],
    [/unsupported operand type\(s\) for ([^:]+): '(\w+)' and '(\w+)'/, 'L’operatore $1 non funziona tra $2 e $3. Se un valore arriva da input() è una stringa: convertilo con int() o float().'],
    [/can't multiply sequence by non-int of type '(\w+)'/, 'Una stringa si può moltiplicare solo per un intero (ripetizione). Probabilmente un valore letto con input() va convertito con int() o float().'],
    [/invalid literal for int\(\) with base 10: '(.*)'/, 'int() non riesce a convertire «$1» in un numero intero. Hai scritto lettere, spazi strani o un numero con la virgola? Per i decimali usa float() e il punto.'],
    [/could not convert string to float: '(.*)'/, 'float() non riesce a convertire «$1» in un numero. Ricorda: in Python i decimali si scrivono con il punto (4.7), non con la virgola.'],
    [/division by zero/, 'Divisione per zero: controlla il divisore con un if prima di dividere.'],
    [/'(\w+)' object is not callable/, 'Stai usando un valore di tipo $1 come se fosse una funzione. Hai dato a una variabile il nome di una funzione (print, input, int…)?'],
    [/expected ':'/, 'Manca il segno «:» alla fine della riga di if, elif o else.'],
    [/Maybe you meant '==' or ':=' instead of '='/, 'Nelle condizioni il confronto si scrive con == (due uguali). Un solo = serve ad assegnare un valore.'],
    [/unterminated string literal/, 'Una stringa non è chiusa: controlla che le virgolette di apertura e chiusura ci siano e siano dello stesso tipo.'],
    [/'\(' was never closed/, 'Una parentesi tonda aperta non viene mai chiusa.'],
    [/invalid syntax/, 'Errore di sintassi: controlla parentesi, virgolette, virgole tra gli argomenti e i due punti dopo if/elif/else.']
  ];
  function explain(err) {
    if (!err) return '';
    if (err.tipo === 'InputMancante') return '';
    if (err.tipo === 'IndentationError' || err.tipo === 'TabError') return 'Rientro (indentazione) sbagliato: le istruzioni dentro if/elif/else vanno spostate a destra di 4 spazi, tutte allo stesso modo; if, elif ed else devono stare allineati.';
    for (const [re, txt] of RULES) { const m = err.msg.match(re); if (m) return txt.replace(/\$(\d)/g, (_, i) => m[i]); }
    if (err.tipo === 'SyntaxError') return 'Errore di sintassi: controlla parentesi, virgolette e i due punti dopo if/elif/else.';
    return '';
  }

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const decode = s => (s || '').replace(/\\n/g, '\n');

  /* ---------- Editor con tastiera semplificata ---------- */
  function makeEditor(initial, label) {
    const wrap = el('div', 'py-editor'), gutter = el('pre', 'py-gutter'), code = el('textarea', 'py-code');
    code.spellcheck = false; code.setAttribute('autocapitalize', 'off'); code.setAttribute('autocomplete', 'off'); code.setAttribute('autocorrect', 'off');
    code.setAttribute('aria-label', label + ': codice modificabile');
    code.value = initial; wrap.append(gutter, code);
    let badLine = null, curLine = null;
    function refresh() {
      const n = code.value.split('\n').length;
      gutter.innerHTML = '';
      for (let i = 1; i <= n; i++) gutter.append(el('span', i === badLine ? 'bad' : i === curLine ? 'cur' : '', String(i)), '\n');
      code.style.height = 'auto'; code.style.height = code.scrollHeight + 'px';
    }
    code.addEventListener('keydown', e => {
      const v = code.value, s = code.selectionStart, en = code.selectionEnd;
      if (e.key === 'Tab') {
        e.preventDefault();
        const ls = v.lastIndexOf('\n', s - 1) + 1;
        if (s === en && !e.shiftKey) code.setRangeText('    ', s, en, 'end');
        else { const block = v.slice(ls, en); code.setRangeText(e.shiftKey ? block.replace(/^ {1,4}/gm, '') : block.replace(/^/gm, '    '), ls, en, 'select'); }
        code.dispatchEvent(new Event('input')); return;
      }
      if (e.key === 'Enter' && !e.isComposing && !(e.ctrlKey || e.metaKey)) {
        const ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
        let ind = line.match(/^ */)[0];
        if (/:\s*(#.*)?$/.test(line)) ind += '    ';
        e.preventDefault(); code.setRangeText('\n' + ind, s, en, 'end'); code.dispatchEvent(new Event('input'));
      }
    });
    code.addEventListener('input', () => { badLine = null; refresh(); });
    code.addEventListener('focus', () => start().catch(() => {}), { once: true });
    requestAnimationFrame(refresh);
    return { wrap, code, refresh, setBad: n => { badLine = n; refresh(); }, setCur: n => { curLine = n; refresh(); } };
  }

  function showResult(out, r, withChecks, ed) {
    out.innerHTML = '';
    if (r.fatal) { out.append(el('span', 'err', r.fatal)); return; }
    if (r.timeout) { out.append(el('span', 'err', 'Il programma non è terminato entro ' + TIMEOUT_MS / 1000 + ' secondi ed è stato fermato.')); return; }
    if (r.interrotto) { out.append(el('span', 'err', 'Esecuzione interrotta. Riprova.')); return; }
    if (r.out) out.append(document.createTextNode(r.out));
    if (r.errore) {
      if (ed) ed.setBad(r.errore.riga);
      const where = r.errore.riga ? ' (riga ' + r.errore.riga + ')' : '';
      const tipo = r.errore.tipo === 'InputMancante' ? 'Input mancante' : r.errore.tipo;
      out.append(el('span', 'err', (r.out && !r.out.endsWith('\n') ? '\n' : '') + tipo + where + ': ' + r.errore.msg));
      const tip = explain(r.errore); if (tip) out.append(el('span', 'info', '\n→ ' + tip));
    } else if (!r.out && !withChecks) out.append(el('span', 'info', 'Programma eseguito senza errori e senza output (nessun print).'));
  }

  function setupBox(box) {
    const id = box.dataset.py, exId = box.dataset.ex, ex = exId ? (window.PYB_EXERCISES || {})[exId] : null;
    const srcEl = box.querySelector('textarea.py-src');
    const starter = srcEl.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
    const key = 'pybCode-' + id, keyIn = 'pybStdin-' + id;
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
    const ed = makeEditor(store.get(key) ?? starter, box.dataset.title || 'Editor Python');
    const code = ed.code;
    const inWrap = el('div', 'py-stdin'), inLbl = el('label', '', '⌨ Input da tastiera — una riga per ogni input(), nell’ordine in cui il programma li chiede');
    const stdin = el('textarea'); stdin.rows = 2; stdin.spellcheck = false; stdin.value = store.get(keyIn) ?? decode(box.dataset.stdin);
    const inId = 'stdin-' + id; stdin.id = inId; inLbl.htmlFor = inId; inWrap.append(inLbl, stdin);
    const toggleIn = () => { inWrap.hidden = !/\binput\s*\(/.test(code.value); };
    stdin.addEventListener('input', () => store.set(keyIn, stdin.value));
    const hint = el('div', 'py-hint'); hint.hidden = true; hint.setAttribute('role', 'status');
    const checks = el('ul', 'py-checks'); checks.hidden = true; checks.setAttribute('aria-live', 'polite');
    const out = el('pre', 'py-out'); out.setAttribute('aria-live', 'polite');
    srcEl.replaceWith(head, ed.wrap, inWrap, hint, checks, out);
    toggleIn();
    code.addEventListener('input', () => { toggleIn(); if (code.value === starter) store.del(key); else store.set(key, code.value); });
    code.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); (btnCheck && e.shiftKey ? btnCheck : btnRun).click(); } });

    let busy = false;
    async function exec(withChecks) {
      if (busy) return null; busy = true;
      [btnRun, btnCheck].forEach(b => b && (b.disabled = true));
      out.innerHTML = ''; out.append(el('span', 'info', readyPromise ? 'Esecuzione…' : 'Avvio di Python nel browser… (la prima volta richiede alcuni secondi)'));
      let r;
      try { r = await run(code.value, withChecks ? ex.checks.map(c => c.c) : null, inWrap.hidden ? '' : stdin.value); }
      catch (err) { r = { fatal: err.message }; }
      busy = false; [btnRun, btnCheck].forEach(b => b && (b.disabled = false));
      showResult(out, r, withChecks, ed);
      return r.fatal || r.timeout || r.interrotto ? null : r;
    }
    btnRun.onclick = () => exec(false);
    btnReset.onclick = () => {
      if (code.value !== starter && !confirm('Vuoi tornare al codice iniziale? Le tue modifiche andranno perse.')) return;
      code.value = starter; store.del(key); stdin.value = decode(box.dataset.stdin); store.del(keyIn); ed.setBad(null); toggleIn(); out.innerHTML = ''; checks.hidden = true;
    };

    if (ex) {
      const doneKey = 'pybEx-' + exId, triesKey = 'pybTries-' + exId;
      let tries = Number(store.get(triesKey)) || 0, hintIdx = 0;
      const markDone = () => { box.closest('.exercise')?.classList.add('done'); const b = box.closest('.exercise')?.querySelector('.ex-badge'); if (b) b.textContent = '✓ completato'; btnSol.disabled = false; };
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
        if (all) { const was = store.get(doneKey); store.set(doneKey, '1'); markDone(); if (!was) document.dispatchEvent(new CustomEvent('pyb-exercise-done', { detail: exId })); }
      };
      btnHint.onclick = () => {
        const hs = ex.hints || []; if (!hs.length) return;
        hint.hidden = false; hint.textContent = '💡 Suggerimento ' + (hintIdx + 1) + ' di ' + hs.length + ': ' + hs[hintIdx];
        hintIdx = (hintIdx + 1) % hs.length;
      };
      btnSol.onclick = () => {
        if (!confirm('Vuoi vedere la soluzione? Il tuo codice verrà sostituito (puoi tornare all’inizio con Ripristina).')) return;
        code.value = ex.solution.replace(/^\n/, ''); store.set(key, code.value); ed.setBad(null); toggleIn();
      };
    }
  }

  /* ---------- Visualizzatore passo passo ---------- */
  function setupTrace(box) {
    const srcEl = box.querySelector('textarea.py-src');
    const starter = srcEl.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
    const head = el('div', 'py-head'); head.append(el('span', 'py-title', box.dataset.title || 'Esecuzione passo passo'));
    const tools = el('div', 'py-tools');
    const bGo = el('button', 'run', '▶ Esegui passo passo'), bFirst = el('button', '', '⏮'), bPrev = el('button', '', '◀ Indietro'), bNext = el('button', 'verify', 'Avanti ▶'), bLast = el('button', '', '⏭');
    [bGo, bFirst, bPrev, bNext, bLast].forEach(b => { b.type = 'button'; });
    bFirst.setAttribute('aria-label', 'Primo passo'); bLast.setAttribute('aria-label', 'Ultimo passo');
    tools.append(bGo, bFirst, bPrev, bNext, bLast); head.append(tools);
    const ed = makeEditor(starter, box.dataset.title || 'Visualizzatore');
    const inWrap = el('div', 'py-stdin'), inLbl = el('label', '', '⌨ Input da tastiera (una riga per ogni input())'), stdin = el('textarea');
    stdin.rows = 2; stdin.value = decode(box.dataset.stdin); stdin.id = 'tr-' + Math.random().toString(36).slice(2); inLbl.htmlFor = stdin.id; inWrap.append(inLbl, stdin);
    const toggleIn = () => { inWrap.hidden = !/\binput\s*\(/.test(ed.code.value); };
    const panel = el('div', 'trace-panel'), info = el('p', 'trace-info'), vt = el('table', 'trace-vars'), tout = el('pre', 'py-out');
    info.setAttribute('aria-live', 'polite');
    vt.innerHTML = '<caption>Variabili in memoria</caption><thead><tr><th>nome</th><th>valore</th><th>tipo</th></tr></thead><tbody></tbody>';
    const right = el('div'); right.append(vt);
    const left = el('div'); left.append(el('div', 'trace-cap', 'Output'), tout);
    panel.append(right, left);
    srcEl.replaceWith(head, ed.wrap, inWrap, info, panel);
    toggleIn(); ed.code.addEventListener('input', () => { toggleIn(); steps = null; ed.setCur(null); setNav(); });
    let steps = null, k = 0, prevVars = {};
    function setNav() { const has = !!steps; bFirst.disabled = bPrev.disabled = !has || k === 0; bNext.disabled = bLast.disabled = !has || k >= steps.length - 1; }
    function show() {
      const s = steps[k], before = k ? steps[k - 1].vars : {};
      ed.setCur(s.fine ? null : s.riga);
      if (s.fine && s.errore) ed.setBad(s.errore.riga);
      const line = s.riga ? ed.code.value.split('\n')[s.riga - 1].trim() : '';
      info.textContent = s.fine ? (s.errore ? 'Fine: errore alla riga ' + (s.errore.riga || '?') + ' — ' + s.errore.tipo + ': ' + s.errore.msg : 'Fine del programma: tutte le righe sono state eseguite.') : 'Passo ' + (k + 1) + ' di ' + (steps.length - 1) + ' · sta per essere eseguita la riga ' + s.riga + ':  ' + line;
      const tb = vt.querySelector('tbody'); tb.innerHTML = '';
      const names = Object.keys(s.vars);
      if (!names.length) { const r = el('tr'); const td = el('td', 'empty', 'nessuna variabile'); td.colSpan = 3; r.append(td); tb.append(r); }
      names.forEach(n => {
        const v = s.vars[n], r = el('tr'), changed = !before[n] || before[n].v !== v.v || before[n].t !== v.t;
        if (changed && k) r.className = 'changed';
        r.append(el('td', 'nm', n), el('td', 'val', v.v), el('td', '', '')); r.lastChild.append(el('span', 'tpill t-' + v.t, v.t)); tb.append(r);
      });
      tout.textContent = s.out || '';
      setNav();
    }
    bGo.onclick = async () => {
      bGo.disabled = true; info.textContent = readyPromise ? 'Analisi del programma…' : 'Avvio di Python nel browser… (la prima volta richiede alcuni secondi)';
      let r; try { r = await trace(ed.code.value, inWrap.hidden ? '' : stdin.value); } catch (e) { r = { fatal: e.message }; }
      bGo.disabled = false;
      if (r.fatal || r.timeout || r.interrotto || !r.steps) { info.textContent = r.fatal || 'Il programma non termina: il visualizzatore si è fermato.'; return; }
      ed.setBad(null); steps = r.steps; k = 0; show();
    };
    bFirst.onclick = () => { k = 0; show(); }; bPrev.onclick = () => { if (k) { k--; show(); } };
    bNext.onclick = () => { if (k < steps.length - 1) { k++; show(); } }; bLast.onclick = () => { k = steps.length - 1; show(); };
    setNav();
  }

  /* ---------- Shell interattiva ---------- */
  function setupShell(box) {
    box.innerHTML = '';
    const head = el('div', 'py-head'); head.append(el('span', 'py-title', 'Python Shell · prova un comando alla volta'));
    const tools = el('div', 'py-tools'), bClr = el('button', '', 'Pulisci'); bClr.type = 'button'; tools.append(bClr); head.append(tools);
    const scr = el('pre', 'py-out shell-screen'); scr.setAttribute('aria-live', 'polite');
    scr.append(el('span', 'info', 'Python 3 nel browser. Scrivi un’istruzione dopo >>> e premi Invio. Prova: 5*7, poi valoreA = 5, poi valoreA * 2\n'));
    const form = el('form', 'shell-form'), pr = el('span', 'shell-prompt', '>>>'), inp = el('input'); inp.type = 'text'; inp.setAttribute('aria-label', 'Comando Python'); inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('autocapitalize', 'off');
    form.append(pr, inp); box.append(head, scr, form);
    const hist = []; let hi = 0;
    inp.addEventListener('focus', () => start().catch(() => {}), { once: true });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' && hist.length) { e.preventDefault(); hi = Math.max(0, hi - 1); inp.value = hist[hi]; }
      if (e.key === 'ArrowDown' && hist.length) { e.preventDefault(); hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ''; }
    });
    form.onsubmit = async e => {
      e.preventDefault(); const c = inp.value; if (!c.trim()) return;
      hist.push(c); hi = hist.length; inp.value = '';
      scr.append(el('span', 'cmd', '>>> ' + c + '\n'));
      if (!readyPromise) scr.append(el('span', 'info', 'Avvio di Python…\n'));
      let r; try { r = await repl(c); } catch (err) { r = { fatal: err.message }; }
      if (r.fatal) scr.append(el('span', 'err', r.fatal + '\n'));
      else if (r.timeout) scr.append(el('span', 'err', 'Comando interrotto: impiegava troppo tempo.\n'));
      else {
        if (r.out) scr.append(document.createTextNode(r.out));
        if (r.errore) { scr.append(el('span', 'err', r.errore.tipo + ': ' + r.errore.msg + '\n')); const t = explain(r.errore); if (t) scr.append(el('span', 'info', '→ ' + t + '\n')); }
      }
      scr.scrollTop = scr.scrollHeight;
    };
    bClr.onclick = () => { scr.innerHTML = ''; };
  }

  const boot = () => {
    document.querySelectorAll('.py-box[data-py]').forEach(setupBox);
    document.querySelectorAll('.py-trace').forEach(setupTrace);
    document.querySelectorAll('.py-shell').forEach(setupShell);
    document.querySelectorAll('[data-shell-cmd]').forEach(b => b.addEventListener('click', () => {
      const sh = document.getElementById(b.closest('[data-shell]').dataset.shell), inp = sh && sh.querySelector('.shell-form input');
      if (!inp) return; inp.value = b.dataset.shellCmd; sh.querySelector('form').requestSubmit(); inp.focus();
    }));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  return { run, trace, repl, start, onStatus: f => listeners.add(f), explain };
})();
