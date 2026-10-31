/* Corso Octave · editor degli script e Command Window nel browser.
   Esecuzione nel Web Worker (oct-worker.js) con timeout, esercizi con verifiche automatiche,
   suggerimenti, workspace, grafici con Plotly e salvataggio locale del codice. */
"use strict";
window.OctRunner = (() => {
  const TIMEOUT_MS = 6000;
  let worker = null, ready = null, seq = 0;
  const pending = new Map();

  function start() {
    if (ready) return ready;
    worker = new Worker('./oct-worker.js?v=1');
    ready = new Promise((resolve, reject) => {
      worker.onmessage = e => {
        const m = e.data;
        if (m.type === 'ready') resolve();
        else if (m.type === 'result' && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); p(m); }
      };
      worker.onerror = () => { reset(); reject(new Error('Impossibile avviare il simulatore Octave: ricarica la pagina.')); };
    });
    return ready;
  }
  function reset() {
    if (worker) worker.terminate();
    worker = null; ready = null;
    pending.forEach(p => p({ interrotto: true })); pending.clear();
    document.dispatchEvent(new CustomEvent('oct-reset'));
  }
  async function run(code, opts) {
    await start();
    return new Promise(resolve => {
      const id = ++seq;
      const timer = setTimeout(() => { pending.delete(id); reset(); resolve({ timeout: true }); }, TIMEOUT_MS);
      pending.set(id, r => { clearTimeout(timer); resolve(r); });
      worker.postMessage(Object.assign({ id, code }, opts || {}));
    });
  }

  /* Spiegazioni in italiano dei messaggi di errore di Octave */
  const RULES = [
    [/^'(\w+)' undefined/, 'Octave non conosce «$1»: non è una variabile già creata né una funzione. Controlla come è scritto (maiuscole e minuscole contano: Area e area sono due nomi diversi) e che sia assegnata prima della riga che la usa.'],
    [/^value on right hand side of assignment: '(\w+)' undefined/, 'La funzione termina senza assegnare un valore all’uscita «$1». Dentro la funzione deve esserci una riga $1 = …'],
    [/^(\w+)\(([\d.e+-]+)(?:,_)?\): subscripts must be/, 'Tra parentesi tonde dopo un nome di variabile Octave si aspetta un indice intero positivo. Se «$1» doveva essere una funzione, forse hai creato una variabile con lo stesso nome che la nasconde: cancellala con clear $1.'],
    [/subscripts must be either integers/, 'Gli indici devono essere numeri interi positivi (1, 2, 3, …) oppure valori logici.'],
    [/^index \((-?\d+)[,_\d]*\): out of bound; value (-?\d+)/, 'In Octave gli indici partono da 1 (non da 0 come in Python): il primo elemento è v(1), l’ultimo v(end).'],
    [/^(\w+)\((.+)\): out of bound (\d+) \(dimensions are (\d+x\d+)\)/, 'Chiedi un elemento che non esiste: «$1» ha dimensioni $4. Usa size($1) per controllarle; per l’ultimo elemento puoi scrivere end.'],
    [/operator \*: nonconformant arguments \(op1 is (\d+)x(\d+), op2 is (\d+)x(\d+)\)/, 'Prodotto riga per colonna impossibile: le colonne del primo fattore ($2) devono essere quante le righe del secondo ($3). Se volevi moltiplicare elemento per elemento usa .* (con il punto).'],
    [/operator (\S+): nonconformant arguments \(op1 is (\d+x\d+), op2 is (\d+x\d+)\)/, 'Le due matrici hanno dimensioni incompatibili ($2 e $3): per le operazioni elemento per elemento servono le stesse dimensioni (oppure uno scalare).'],
    [/vertical dimensions mismatch/, 'Tra parentesi quadre ogni riga (separata da ;) deve avere lo stesso numero di elementi.'],
    [/horizontal dimensions mismatch/, 'Stai affiancando (con lo spazio o la virgola) blocchi con un numero di righe diverso.'],
    [/^parse error: stringa non terminata/, 'Ogni testo va chiuso con lo stesso apice con cui si apre: \'ciao\'.'],
    [/^parse error: '=' inatteso: per confrontare/, 'Dentro if e while si confronta con == (due uguali); = da solo serve ad assegnare un valore.'],
    [/^parse error: .*forse manca un operatore/, 'Octave non sottintende la moltiplicazione: 2x si scrive 2*x.'],
    [/^parse error: espressione incompleta/, 'Manca un valore: un operatore a fine riga (es. x = 3 +) oppure una condizione vuota dopo if o while.'],
    [/^parse error: manca 'end'/, 'Ogni if, for, while, switch e function va chiuso con end.'],
    [/^parse error/, 'Errore di sintassi: controlla parentesi e apici (aperti = chiusi), gli operatori tra i valori e che ogni blocco sia chiuso da end.'],
    [/called with too many inputs/, 'Hai passato alla funzione più argomenti di quanti ne dichiari tra parentesi nella riga function.'],
    [/called with too many outputs/, 'Chiedi alla funzione più risultati di quanti ne restituisce (quelli elencati a sinistra di = nella riga function).'],
    [/for x\^y, only square matrix/, 'L’operatore ^ è la potenza di matrice (A^2 = A*A) e vale solo per matrici quadrate. Per elevare ogni elemento usa .^ (con il punto).'],
    [/^input: la lettura/, ''],
    [/A must be a square matrix|argument must be a square matrix/, 'Determinante e inversa esistono solo per matrici quadrate (stesso numero di righe e colonne).'],
  ];
  function explain(msg) {
    for (const [re, txt] of RULES) { const m = msg.match(re); if (m) return txt.replace(/\$(\d)/g, (_, i) => m[i]); }
    return '';
  }

  /* ---------- utilità DOM ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  function writeOut(pre, text) {
    text.split(/(?<=\n)/).forEach(line => {
      if (/^warning:/.test(line)) pre.append(el('span', 'warn', line)); else pre.append(document.createTextNode(line));
    });
  }
  function showError(pre, r) {
    const where = r.errore.riga ? ' (riga ' + r.errore.riga + ')' : '';
    const prev = pre.textContent;
    pre.append(el('span', 'err', (prev && !prev.endsWith('\n') ? '\n' : '') + 'error: ' + r.errore.msg + where));
    const tip = explain(r.errore.msg); if (tip) pre.append(el('span', 'info', '\n→ ' + tip));
  }

  /* ---------- workspace ---------- */
  function renderWorkspace(box, list) {
    box.innerHTML = '';
    if (!list || !list.length) { box.append(el('p', 'ws-empty', 'Workspace vuoto: nessuna variabile.')); return; }
    const t = el('table', 'ws-table'), h = el('tr');
    ['Nome', 'Classe', 'Dimensione', 'Valore'].forEach(s => h.append(el('th', '', s)));
    const th = el('thead'); th.append(h); t.append(th);
    const tb = el('tbody');
    list.forEach(v => { const tr = el('tr'); tr.append(el('td', 'ws-name', v.name), el('td', '', v.cls), el('td', '', v.size), el('td', 'ws-val', v.val)); tb.append(tr); });
    t.append(tb); box.append(t);
  }

  /* ---------- grafici (Plotly, caricato al primo uso) ---------- */
  let plotlyP = null;
  function loadPlotly() {
    if (window.Plotly) return Promise.resolve();
    if (!plotlyP) plotlyP = new Promise((res, rej) => { const s = document.createElement('script'); s.src = '../plotly-2.35.2.min.js'; s.onload = res; s.onerror = () => { plotlyP = null; rej(new Error('Impossibile caricare la libreria dei grafici')); }; document.head.append(s); });
    return plotlyP;
  }
  const SYM = { o: 'circle-open', '+': 'cross-thin-open', '*': 'asterisk-open', '.': 'circle', x: 'x-thin-open', s: 'square-open', d: 'diamond-open', '^': 'triangle-up-open', v: 'triangle-down-open', '>': 'triangle-right-open', '<': 'triangle-left-open', p: 'star-open', h: 'hexagram-open' };
  function buildFigure(f) {
    const data = [], layout = { margin: { l: 58, r: 18, t: 34, b: 48 }, paper_bgcolor: '#fff', plot_bgcolor: '#fff', annotations: [], font: { family: 'system-ui, sans-serif', size: 12, color: '#262626' }, showlegend: false, hovermode: 'closest' };
    let maxRows = 1;
    f.axes.forEach((a, idx) => {
      const k = idx ? String(idx + 1) : '', xr = 'x' + k, yr = 'y' + k;
      const [m, n, ps] = a.pos; maxRows = Math.max(maxRows, m);
      const rows = ps.map(p => Math.floor((p - 1) / n)), cols = ps.map(p => (p - 1) % n);
      const r0 = Math.min(...rows), r1 = Math.max(...rows), c0 = Math.min(...cols), c1 = Math.max(...cols);
      const gx = n > 1 ? 0.09 : 0, gy = m > 1 ? 0.16 : 0;
      const dx = [c0 / n + (c0 ? gx / 2 : 0), (c1 + 1) / n - (c1 < n - 1 ? gx / 2 : 0)];
      const dy = [1 - (r1 + 1) / m + (r1 < m - 1 ? gy / 2 : 0), 1 - r0 / m - (r0 ? gy / 2 : 0)];
      const axis = (lab, lim, dom, anchor) => ({ domain: dom, anchor, title: { text: lab || '', standoff: 6 }, showgrid: !!a.grid, gridcolor: '#dadada', zeroline: false, showline: true, mirror: true, linecolor: '#262626', ticks: 'outside', tickcolor: '#262626', range: lim || undefined, autorange: lim ? false : true, visible: !a.off, minor: a.minor ? { showgrid: true, gridcolor: '#f0f0f0' } : undefined });
      layout['xaxis' + k] = axis(a.xlabel, a.xlim, dx, yr);
      layout['yaxis' + k] = axis(a.ylabel, a.ylim, dy, xr);
      if (a.equal) { layout['yaxis' + k].scaleanchor = xr; layout['yaxis' + k].scaleratio = 1; }
      if (a.title) layout.annotations.push({ text: '<b>' + esc(a.title).replace(/\n/g, '<br>') + '</b>', xref: 'paper', yref: 'paper', x: (dx[0] + dx[1]) / 2, y: dy[1], xanchor: 'center', yanchor: 'bottom', yshift: 4, showarrow: false, font: { size: 13 } });
      (a.texts || []).forEach(t => layout.annotations.push({ text: esc(t.s), x: t.x, y: t.y, xref: xr, yref: yr, showarrow: false, xanchor: 'left' }));
      const lg = 'legend' + k;
      a.traces.forEach((t, i) => {
        const mode = t.dash && t.marker ? 'lines+markers' : t.marker ? 'markers' : 'lines';
        const sym = t.marker ? (t.filled || t.mfc ? SYM[t.marker].replace('-open', '') : SYM[t.marker]) : undefined;
        const name = (a.legend && a.legend[i] !== undefined) ? a.legend[i] : (t.name || 'data' + (i + 1));
        data.push({ type: 'scatter', mode, x: t.x, y: t.y, xaxis: xr, yaxis: yr, name: name, legend: lg,
          showlegend: !!a.legendOn && (!a.legend || i < a.legend.length || !!t.name),
          line: { color: t.color, dash: t.dash || 'solid', width: Math.max(0.5, t.width * 1.4) },
          marker: t.marker ? { symbol: sym, size: t.marker === '.' ? 5 : t.msize + 1, color: t.mfc || t.color, line: { color: t.color, width: 1.3 } } : undefined,
          hovertemplate: '(%{x:.4g}, %{y:.4g})<extra>' + esc(name) + '</extra>' });
      });
      if (a.legendOn) { layout.showlegend = true; layout[lg] = { x: dx[1] - 0.01, y: dy[1] - 0.01, xanchor: 'right', yanchor: 'top', bgcolor: 'rgba(255,255,255,.9)', bordercolor: '#262626', borderwidth: 1, font: { size: 11 } }; }
    });
    layout.height = 330 + (maxRows - 1) * 230;
    const prune = o => { if (o && typeof o === 'object' && !Array.isArray(o)) Object.keys(o).forEach(k => { if (o[k] === undefined) delete o[k]; else prune(o[k]); }); return o; };
    data.forEach(prune); prune(layout);
    return { data, layout };
  }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  async function renderFigures(box, figs, out) {
    const sig = JSON.stringify(figs || []);
    if (box.dataset.sig === sig) return; box.dataset.sig = sig;
    box.querySelectorAll('.oc-fig-plot').forEach(d => { try { window.Plotly && window.Plotly.purge(d); } catch {} });
    box.innerHTML = '';
    if (!figs || !figs.length) { box.hidden = true; return; }
    box.hidden = false;
    try { await loadPlotly(); } catch (e) { box.append(el('p', 'err', e.message)); return; }
    for (const f of figs) {
      const wrap = el('figure', 'oc-fig'), cap = el('figcaption', '', 'Figure ' + f.n), div = el('div', 'oc-fig-plot');
      wrap.append(cap, div); box.append(wrap);
      const { data, layout } = buildFigure(f);
      window.Plotly.newPlot(div, data, layout, { responsive: true, displaylogo: false, modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d', 'toggleSpikelines'], toImageButtonOptions: { filename: 'figura-' + f.n } });
    }
  }

  /* ---------- editor degli script ---------- */
  const OPENERS = /^\s*(if|for|while|function|else|elseif|switch|case|otherwise|try|catch|do)\b/;
  function setupEditor(box) {
    const id = box.dataset.oc, exId = box.dataset.ex, ex = exId ? (window.OCT_EXERCISES || {})[exId] : null;
    const srcEl = box.querySelector('textarea.oc-src');
    const starter = srcEl.value.replace(/^\n/, '').replace(/\s+$/, '') + '\n';
    const key = 'octCode-' + id;
    const fileName = box.dataset.file || (ex ? exId.replace(/-/g, '_') + '.m' : 'script.m');
    const head = el('div', 'oc-head'), title = el('span', 'oc-title');
    title.append(el('span', 'oc-file', fileName), document.createTextNode(' ' + (box.dataset.title || (ex ? 'Il tuo script' : 'Esempio eseguibile'))));
    const tools = el('div', 'oc-tools');
    const btn = (txt, cls, tip) => { const b = el('button', cls || '', txt); b.type = 'button'; if (tip) b.title = tip; return b; };
    const btnRun = btn('▶ Esegui', 'run', 'Esegui lo script (Ctrl+Invio)');
    const btnWs = btn('Workspace', '', 'Mostra le variabili create dallo script'); btnWs.setAttribute('aria-pressed', 'false');
    const btnReset = btn('↺ Ripristina', '', 'Torna al codice iniziale');
    tools.append(btnRun);
    let btnCheck, btnHint, btnSol;
    if (ex) {
      btnCheck = btn('✓ Verifica', 'verify', 'Esegui le prove automatiche (Ctrl+Maiusc+Invio)');
      btnHint = btn('💡 Suggerimento');
      btnSol = btn('Soluzione', '', 'Disponibile dopo 3 verifiche o a esercizio completato'); btnSol.disabled = true;
      tools.append(btnCheck, btnHint);
    }
    tools.append(btnWs, btnReset); if (btnSol) tools.append(btnSol);
    head.append(title, tools);
    const wrap = el('div', 'oc-editor'), gutter = el('pre', 'oc-gutter'), code = el('textarea', 'oc-code');
    code.spellcheck = false; ['autocapitalize', 'autocomplete', 'autocorrect'].forEach(a => code.setAttribute(a, 'off'));
    code.setAttribute('aria-label', (box.dataset.title || 'Editor Octave') + ': codice modificabile');
    code.value = store.get(key) ?? starter;
    wrap.append(gutter, code);
    const hint = el('div', 'oc-hint'); hint.hidden = true; hint.setAttribute('role', 'status');
    const checks = el('ul', 'oc-checks'); checks.hidden = true; checks.setAttribute('aria-live', 'polite');
    const out = el('pre', 'oc-out'); out.setAttribute('aria-live', 'polite');
    const figs = el('div', 'oc-figs'); figs.hidden = true;
    const ws = el('div', 'oc-ws'); ws.hidden = true;
    srcEl.replaceWith(head, wrap, hint, checks, out, figs, ws);

    let badLine = null, lastWs = [];
    function refresh() {
      const n = code.value.split('\n').length; gutter.innerHTML = '';
      for (let i = 1; i <= n; i++) gutter.append(el('span', i === badLine ? 'bad' : '', String(i)), '\n');
      code.style.height = 'auto'; code.style.height = code.scrollHeight + 'px';
    }
    refresh(); requestAnimationFrame(refresh);
    code.addEventListener('input', () => { badLine = null; refresh(); if (code.value === starter) store.del(key); else store.set(key, code.value); });
    code.addEventListener('focus', () => start().catch(() => {}), { once: true });
    code.addEventListener('keydown', e => keys(e, code, () => (btnCheck && e.shiftKey ? btnCheck : btnRun).click()));

    let busy = false;
    async function exec(withChecks) {
      if (busy) return null; busy = true;
      [btnRun, btnCheck].forEach(b => b && (b.disabled = true));
      out.innerHTML = ''; out.append(el('span', 'info', 'Esecuzione…'));
      let r;
      try { r = await run(code.value, { checks: withChecks ? ex.checks.map(c => c.c) : null }); }
      catch (err) { r = { fatal: err.message }; }
      busy = false; [btnRun, btnCheck].forEach(b => b && (b.disabled = false));
      out.innerHTML = '';
      if (r.fatal) { out.append(el('span', 'err', r.fatal)); return null; }
      if (r.timeout) { out.append(el('span', 'err', 'Lo script non è terminato entro ' + TIMEOUT_MS / 1000 + ' secondi ed è stato fermato. C’è un ciclo while la cui condizione resta sempre vera?')); return null; }
      if (r.interrotto) { out.append(el('span', 'err', 'Esecuzione interrotta. Riprova.')); return null; }
      if (r.out) writeOut(out, r.out);
      if (r.errore) { badLine = r.errore.riga; refresh(); showError(out, r); }
      else if (!r.out && !withChecks) out.append(el('span', 'info', (r.figures && r.figures.length ? 'Script eseguito: il grafico è qui sotto.' : 'Script eseguito senza errori. Nessun output: tutte le righe terminano con ; (premi Workspace per vedere le variabili).')));
      renderFigures(figs, r.figures);
      lastWs = r.workspace || []; if (!ws.hidden) renderWorkspace(ws, lastWs);
      return r;
    }
    btnRun.onclick = () => exec(false);
    btnWs.onclick = () => { ws.hidden = !ws.hidden; btnWs.setAttribute('aria-pressed', String(!ws.hidden)); if (!ws.hidden) renderWorkspace(ws, lastWs); };
    btnReset.onclick = () => { if (code.value !== starter && !confirm('Vuoi tornare al codice iniziale? Le tue modifiche andranno perse.')) return; code.value = starter; store.del(key); badLine = null; refresh(); out.innerHTML = ''; checks.hidden = true; renderFigures(figs, []); lastWs = []; if (!ws.hidden) renderWorkspace(ws, lastWs); };

    if (ex) {
      const doneKey = 'octEx-' + exId, triesKey = 'octTries-' + exId;
      let tries = Number(store.get(triesKey)) || 0, hintIdx = 0;
      const art = box.closest('.exercise');
      const markDone = () => { if (art) { art.classList.add('done'); const b = art.querySelector('.ex-badge'); if (b) b.textContent = '✓ Completato'; } btnSol.disabled = false; };
      if (store.get(doneKey)) markDone();
      if (tries >= 3) btnSol.disabled = false;
      btnCheck.onclick = async () => {
        const r = await exec(true); if (!r) return;
        tries++; store.set(triesKey, String(tries)); if (tries >= 3) btnSol.disabled = false;
        checks.innerHTML = ''; checks.hidden = false;
        const res = r.verifiche || [], okN = res.filter(x => x.ok).length;
        ex.checks.forEach((c, i) => {
          const v = res[i] || { ok: false }, li = el('li', v.ok ? 'ok' : 'ko', c.t);
          if (!v.ok) { const why = [v.msg && !/^assert \(cond\) failed$/.test(v.msg) ? v.msg : '', c.h].filter(Boolean).join(' → '); if (why) li.append(el('span', 'why', why)); }
          checks.append(li);
        });
        const all = okN === ex.checks.length;
        checks.prepend(el('li', 'summary', all ? '🎉 Tutte le verifiche superate (' + okN + '/' + ex.checks.length + '). Esercizio completato!' : 'Verifiche superate: ' + okN + ' su ' + ex.checks.length + '. Correggi e riprova.'));
        if (all) { store.set(doneKey, '1'); markDone(); document.dispatchEvent(new CustomEvent('oct-exercise-done', { detail: exId })); }
      };
      btnHint.onclick = () => { const hs = ex.hints || []; if (!hs.length) return; hint.hidden = false; hint.textContent = '💡 Suggerimento ' + (hintIdx + 1) + ' di ' + hs.length + ': ' + hs[hintIdx]; hintIdx = (hintIdx + 1) % hs.length; };
      btnSol.onclick = () => {
        if (!confirm('Vuoi vedere la soluzione? Il tuo codice verrà sostituito (puoi tornare all’inizio con Ripristina).')) return;
        code.value = ex.solution.replace(/^\n/, ''); store.set(key, code.value); badLine = null; refresh();
      };
    }
  }
  function keys(e, code, runFn) {
    const v = code.value, s = code.selectionStart, en = code.selectionEnd;
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); runFn(); return; }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ls = v.lastIndexOf('\n', s - 1) + 1;
      if (s === en && !e.shiftKey) code.setRangeText('  ', s, en, 'end');
      else { const block = v.slice(ls, en); code.setRangeText(e.shiftKey ? block.replace(/^ {1,2}/gm, '') : block.replace(/^/gm, '  '), ls, en, 'select'); }
      code.dispatchEvent(new Event('input')); return;
    }
    if (e.key === 'Enter' && !e.isComposing && !e.ctrlKey && !e.metaKey) {
      const ls = v.lastIndexOf('\n', s - 1) + 1, line = v.slice(ls, s);
      let ind = line.match(/^ */)[0];
      if (OPENERS.test(line) && !/\bend\s*;?\s*(%.*)?$/.test(line)) ind += '  ';
      e.preventDefault(); code.setRangeText('\n' + ind, s, en, 'end'); code.dispatchEvent(new Event('input'));
    }
  }

  /* ---------- Command Window ---------- */
  function setupCmd(box) {
    const id = box.dataset.cmd, session = 'cmd-' + id + '-' + Math.random().toString(36).slice(2);
    const head = el('div', 'oc-head'); head.append(el('span', 'oc-title', box.dataset.title || 'Command Window'));
    const tools = el('div', 'oc-tools'); const bWs = el('button', '', 'Workspace'); bWs.type = 'button'; bWs.setAttribute('aria-pressed', 'true');
    const bNew = el('button', '', '↺ Nuova sessione'); bNew.type = 'button'; bNew.title = 'Cancella variabili e cronologia';
    tools.append(bWs, bNew); head.append(tools);
    const body = el('div', 'oc-cmd-body');
    const term = el('div', 'oc-term'); term.setAttribute('role', 'log'); term.setAttribute('aria-live', 'polite');
    const hist = el('pre', 'oc-term-out');
    hist.append(el('span', 'info', 'GNU Octave · simulatore didattico\nScrivi un comando dopo >> e premi Invio.\n\n'));
    const line = el('div', 'oc-prompt'), pr = el('span', 'oc-pr', '>>'), inp = el('input', 'oc-in');
    inp.type = 'text'; inp.spellcheck = false; ['autocapitalize', 'autocomplete', 'autocorrect'].forEach(a => inp.setAttribute(a, 'off')); inp.setAttribute('aria-label', 'Comando Octave');
    line.append(pr, inp); term.append(hist, line);
    const side = el('aside', 'oc-side'); side.append(el('h4', '', 'Workspace')); const ws = el('div', 'oc-ws'); side.append(ws);
    side.append(el('h4', '', 'Cronologia dei comandi')); const ch = el('ol', 'oc-history'); side.append(ch);
    body.append(term, side);
    const figs = el('div', 'oc-figs'); figs.hidden = true;
    const chips = el('div', 'oc-chips');
    (box.dataset.try || '').split('|').filter(Boolean).forEach(c => { const b = el('button', 'chip', c); b.type = 'button'; b.title = 'Inserisci il comando'; b.onclick = () => { inp.value = c; inp.focus(); }; chips.append(b); });
    box.innerHTML = ''; box.append(head); if (chips.childNodes.length) { const lab = el('div', 'oc-chips-lab', 'Prova questi comandi (clic per inserirli, poi Invio):'); box.append(lab, chips); }
    box.append(body, figs);
    renderWorkspace(ws, []);
    const history = []; let hp = 0, busy = false;
    term.addEventListener('click', e => { if (!window.getSelection().toString()) inp.focus(); });
    inp.addEventListener('focus', () => start().catch(() => {}), { once: true });
    inp.addEventListener('keydown', async e => {
      if (e.key === 'ArrowUp') { if (hp > 0) { hp--; inp.value = history[hp]; } e.preventDefault(); return; }
      if (e.key === 'ArrowDown') { if (hp < history.length) { hp++; inp.value = history[hp] || ''; } e.preventDefault(); return; }
      if (e.key !== 'Enter' || busy) return;
      e.preventDefault();
      const cmd = inp.value; inp.value = '';
      hist.append(el('span', 'oc-echo', '>> ' + cmd + '\n'));
      if (cmd.trim()) { history.push(cmd); const li = el('li', '', cmd); ch.append(li); ch.scrollTop = ch.scrollHeight; }
      hp = history.length;
      if (!cmd.trim()) { term.scrollTop = term.scrollHeight; return; }
      busy = true; inp.disabled = true;
      let r; try { r = await run(cmd, { session }); } catch (err) { r = { fatal: err.message }; }
      busy = false; inp.disabled = false; inp.focus();
      if (r.fatal) hist.append(el('span', 'err', r.fatal + '\n'));
      else if (r.timeout) hist.append(el('span', 'err', 'Il comando non è terminato entro ' + TIMEOUT_MS / 1000 + ' secondi ed è stato fermato: le variabili della sessione sono state cancellate.\n'));
      else if (r.interrotto) hist.append(el('span', 'err', 'Esecuzione interrotta.\n'));
      else {
        if (r.clc) { hist.innerHTML = ''; }
        if (r.out) { const tmp = el('span'); writeOut(tmp, r.out); hist.append(tmp); }
        if (r.errore) { const tmp = el('span'); showError(tmp, { errore: { msg: r.errore.msg, riga: null } }); tmp.append('\n'); hist.append(tmp); }
        renderWorkspace(ws, r.workspace); renderFigures(figs, r.figures);
      }
      term.scrollTop = term.scrollHeight;
    });
    bWs.onclick = () => { side.hidden = !side.hidden; bWs.setAttribute('aria-pressed', String(!side.hidden)); body.classList.toggle('no-side', side.hidden); };
    bNew.onclick = async () => { hist.innerHTML = ''; hist.append(el('span', 'info', 'Nuova sessione: workspace vuoto.\n\n')); ch.innerHTML = ''; history.length = 0; hp = 0; renderWorkspace(ws, []); renderFigures(figs, []); try { await run('', { session, reset: true }); } catch {} inp.focus(); };
    document.addEventListener('oct-reset', () => { renderWorkspace(ws, []); });
  }

  function exercisesDone(prefix) {
    const ids = Object.keys(window.OCT_EXERCISES || {}).filter(k => k.startsWith(prefix));
    return { done: ids.filter(k => store.get('octEx-' + k)).length, total: ids.length };
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.oc-box[data-oc]').forEach(setupEditor);
    document.querySelectorAll('.oc-cmd[data-cmd]').forEach(setupCmd);
  });
  return { run, start, exercisesDone, explain };
})();
