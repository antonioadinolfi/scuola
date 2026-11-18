/* Corso Introduzione a Python · Lezione 1 · simulazioni:
   carta d'identità di Python, compilatore e interprete a confronto, comandi rapidi per la shell. */
"use strict";
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Carta d'identità di Python ---------- */
  const ID = {
    scripting: ['Linguaggio di scripting', 'Si scrivono programmi brevi e veloci da modificare (script) che automatizzano compiti: rinominare mille file, analizzare un foglio di dati, controllare un robot. Ma con Python si costruiscono anche applicazioni grandi.', 'Uno script di dieci righe che calcola la media dei voti di un file.'],
    interpretato: ['Interpretato', 'Un programma chiamato interprete legge il codice ed esegue le istruzioni una dopo l’altra. Non serve produrre prima un file eseguibile: si scrive, si preme Esegui e si vede subito il risultato.', 'Lo vedi nell’animazione «compilatore o interprete» più sotto.'],
    alto: ['Di alto livello', 'Le istruzioni assomigliano al linguaggio umano e alla matematica; i dettagli della macchina (memoria, registri del processore) sono nascosti.', 'print("Ciao") invece di decine di istruzioni in linguaggio macchina.'],
    multipiatt: ['Multipiattaforma', 'Lo stesso programma funziona su Windows, macOS, Linux, Raspberry Pi… basta installare l’interprete adatto al sistema operativo.', 'In questo corso Python funziona addirittura dentro il browser, anche su Chromebook e smartphone.'],
    multipar: ['Multi-paradigma', 'Permette di programmare in stili diversi: procedurale (sequenze di istruzioni e funzioni), a oggetti, funzionale.', 'In quarta userai la programmazione a oggetti, sempre in Python.'],
    open: ['Open source e gratuito', 'Il codice dell’interprete è pubblico: chiunque può usarlo, studiarlo e migliorarlo. È gestito dalla Python Software Foundation e da una grande comunità.', 'Si scarica gratis da python.org, insieme all’ambiente IDLE.']
  };
  const card = $('#identity');
  if (card) {
    const det = $('.tl-detail', card), btns = card.querySelectorAll('.v-card');
    const show = k => { btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.k === k))); const d = ID[k]; det.innerHTML = '<span class="cat">Python è…</span><h4></h4><p></p><p><strong>Esempio:</strong> <span></span></p>'; det.querySelector('h4').textContent = d[0]; det.querySelector('p').textContent = d[1]; det.querySelector('p span').textContent = d[2]; };
    btns.forEach(b => b.onclick = () => show(b.dataset.k)); show('interpretato');
  }

  /* ---------- 2. Compilatore e interprete ---------- */
  const ci = $('#compint');
  if (ci) {
    const PROG = ['print("Inizio")', 'lati = 4', 'print("Il quadrato ha", lati, "lati")', 'print(perimetro)', 'print("Fine")'];
    const list = $('.ci-code', ci), out = $('.code-inline-out', ci), msg = $('.ci-msg', ci), bC = $('#ciComp'), bI = $('#ciInt');
    const rows = PROG.map((t, i) => { const li = el('li', '', t); li.dataset.n = i + 1; list.append(li); return li; });
    let timer = null;
    const clear = () => { clearTimeout(timer); rows.forEach(r => r.className = ''); out.textContent = ''; msg.textContent = ''; };
    const wait = ms => new Promise(r => { timer = setTimeout(r, reduce ? 0 : ms); });
    bC.onclick = async () => {
      clear(); bC.disabled = bI.disabled = true;
      msg.textContent = 'Il compilatore legge e traduce TUTTO il programma prima di eseguirlo…';
      for (const r of rows) { r.className = 'scan'; await wait(380); r.className = r.dataset.n === '4' ? 'bad' : 'ok'; }
      await wait(300);
      msg.textContent = 'Errore trovato alla riga 4 (perimetro non esiste) durante la traduzione: non viene creato il programma eseguibile e non viene eseguita nessuna riga. L’output resta vuoto.';
      bC.disabled = bI.disabled = false;
    };
    bI.onclick = async () => {
      clear(); bC.disabled = bI.disabled = true;
      msg.textContent = 'L’interprete esegue una riga alla volta…';
      const outs = ['Inizio', null, 'Il quadrato ha 4 lati'];
      for (let i = 0; i < rows.length; i++) {
        rows[i].className = 'run'; await wait(650);
        if (i === 3) { rows[i].className = 'bad'; out.textContent += 'NameError: name \'perimetro\' is not defined\n'; msg.textContent = 'Le righe 1, 2 e 3 sono state eseguite e hanno prodotto output; l’errore emerge solo quando l’esecuzione arriva alla riga 4. La riga 5 non viene mai eseguita.'; break; }
        rows[i].className = 'ok'; if (outs[i]) out.textContent += outs[i] + '\n';
      }
      bC.disabled = bI.disabled = false;
    };
  }

})();
