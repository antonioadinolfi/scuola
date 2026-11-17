/* Corso Intelligenza artificiale · visore delle slide del capitolo 8 (A. Tibone, Progettare e programmare vol. 3, Zanichelli).
   Uso: <div class="slide-viewer" data-from="2" data-to="10"></div>
   Frecce ← →, miniature, schermo intero, link «vai alla parte della lezione». */
"use strict";
(() => {
  const T = {
    1: ['Capitolo 8 · Introduzione all’intelligenza artificiale', ''],
    2: ['Si possono definire diverse categorie di intelligenza artificiale', '#che-cosa'],
    3: ['La cibernetica è stata un primo passo verso macchine con comportamenti intelligenti', '#storia'],
    4: ['Alan Turing ha dato contributi cruciali all’informatica e anche all’IA', '#storia'],
    5: ['Nel 1956 un seminario al Dartmouth College diede il via all’IA moderna', '#storia'],
    6: ['Un obiettivo dell’IA è la comprensione del linguaggio naturale', '#turing-eliza'],
    7: ['I sistemi esperti imitano la capacità decisionale di un esperto umano', '#sistemi-esperti'],
    8: ['Intorno al 1970 si è assistito a grandi progressi della robotica', '#robot-giochi'],
    9: ['La game AI è utile per misurare i progressi dell’intelligenza artificiale', '#robot-giochi'],
    10: ['La ricerca sull’intelligenza artificiale ha avuto pesanti battute di arresto', '#inverni'],
    11: ['L’enorme quantità di dati che accumuliamo ha fatto nascere la data science', '#data-science'],
    12: ['La crescita dei dati memorizzati: dall’analogico al digitale', '#esplosione'],
    13: ['I big data si possono categorizzare con le proprietà note come le 5 V', '#cinque-v'],
    14: ['Applicazioni dei big data: i motori di ricerca', '#applicazioni'],
    15: ['Applicazioni dei big data: l’analisi automatica delle immagini', '#applicazioni'],
    16: ['Applicazioni dei big data: i veicoli a guida autonoma', '#applicazioni'],
    17: ['Il machine learning: apprendimento con e senza supervisione', '#idea'],
    18: ['Il riconoscimento automatico delle immagini: la fase di training', '#training'],
    19: ['Il riconoscimento automatico delle immagini: dati mai visti prima', '#training'],
    20: ['Algoritmi per il machine learning: KNN e naive Bayes', '#algoritmi'],
    21: ['Algoritmi per il machine learning: gli alberi di decisione', '#albero'],
    22: ['Le reti neurali: il neurone artificiale', '#neurone'],
    23: ['Il deep learning si basa su reti multistrato di neuroni artificiali', '#multistrato'],
    24: ['La funzione di attivazione calcola l’output di un neurone', '#attivazione'],
    25: ['Le reti neurali imparano grazie alla backpropagation', '#apprendimento'],
    26: ['Giocare con una rete neurale: playground.tensorflow.org', '#playground']
  };
  const pad = n => String(n).padStart(2, '0');
  document.querySelectorAll('.slide-viewer').forEach(box => {
    const from = +box.dataset.from, to = +box.dataset.to, pages = [];
    for (let p = from; p <= to; p++) pages.push(p);
    let i = 0;
    box.setAttribute('role', 'region'); box.setAttribute('aria-roledescription', 'presentazione'); box.setAttribute('aria-label', 'Slide del libro di testo');
    box.innerHTML =
      '<div class="sv-stage"><button type="button" class="sv-nav sv-prev" aria-label="Slide precedente">‹</button>' +
      '<img class="sv-img" alt="" decoding="async"><button type="button" class="sv-nav sv-next" aria-label="Slide successiva">›</button></div>' +
      '<div class="sv-bar"><span class="sv-count" aria-live="polite"></span><span class="sv-title"></span>' +
      '<span class="sv-tools"><a class="sb sv-go" href="#">Vai all’argomento ↓</a><button type="button" class="sb sv-full">⛶ Schermo intero</button></span></div>' +
      '<div class="sv-thumbs" role="tablist" aria-label="Miniature"></div>';
    const img = box.querySelector('.sv-img'), count = box.querySelector('.sv-count'), title = box.querySelector('.sv-title'), go = box.querySelector('.sv-go'), thumbs = box.querySelector('.sv-thumbs');
    const tb = pages.map((p, k) => {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', 'Slide ' + p);
      const t = document.createElement('img'); t.src = './slide/thumb-' + pad(p) + '.webp'; t.alt = ''; t.loading = 'lazy'; b.append(t);
      b.onclick = () => show(k); thumbs.append(b); return b;
    });
    function show(k) {
      i = (k + pages.length) % pages.length; const p = pages[i], t = T[p] || ['', ''];
      img.src = './slide/slide-' + pad(p) + '.webp'; img.alt = 'Slide ' + p + ': ' + t[0];
      count.textContent = (i + 1) + ' / ' + pages.length; title.textContent = t[0];
      go.hidden = !t[1]; go.href = t[1] || '#';
      tb.forEach((b, j) => { b.setAttribute('aria-selected', String(j === i)); });
      tb[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
      const nx = pages[(i + 1) % pages.length]; new Image().src = './slide/slide-' + pad(nx) + '.webp';
    }
    box.querySelector('.sv-prev').onclick = () => show(i - 1);
    box.querySelector('.sv-next').onclick = () => show(i + 1);
    box.tabIndex = 0;
    box.addEventListener('keydown', e => {
      if (e.target.closest('input,select,textarea')) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); show(i + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show(i - 1); }
    });
    go.addEventListener('click', () => { if (document.fullscreenElement) document.exitFullscreen(); });
    const full = box.querySelector('.sv-full');
    full.onclick = () => { if (document.fullscreenElement) document.exitFullscreen(); else if (box.requestFullscreen) box.requestFullscreen().catch(() => box.classList.toggle('sv-fake-full')); else box.classList.toggle('sv-fake-full'); };
    document.addEventListener('fullscreenchange', () => { full.textContent = document.fullscreenElement === box ? '✕ Esci' : '⛶ Schermo intero'; if (document.fullscreenElement === box) box.focus(); });
    let x0 = null;
    img.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    img.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) show(i + (dx < 0 ? 1 : -1)); x0 = null; });
    show(0);
  });
})();
