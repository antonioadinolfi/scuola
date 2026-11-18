/* Corso Introduzione a Python · visore delle slide del capitolo 1 (A. Tibone, Progettare e programmare, Zanichelli 2020).
   Uso: <div class="slide-viewer" data-from="2" data-to="10"></div>
   Frecce ← →, miniature, schermo intero, link «vai alla parte della lezione». */
"use strict";
(() => {
  const T = {
    1: ['Capitolo 1 – Introduzione a Python: indice', ''],
    2: ['Python è un linguaggio intuitivo, facile da imparare e open source', '#python'],
    3: ['Le variabili e i tipi di dato in Python', '#variabili'],
    4: ['L’interprete di Python riconosce il tipo di dato a runtime', '#tipi'],
    5: ['La funzione input() e la conversione dei dati', '#input'],
    6: ['Gli operatori aritmetici e gli operatori di concatenamento', '#operatori'],
    7: ['Formattare l’output: i tripli apici', '#output'],
    8: ['Formattare l’output: separatori, caratteri di escape e format()', '#output'],
    9: ['La struttura condizionale più usata è if...else', '#if-else'],
    10: ['Le condizioni: operatori relazionali e logici', '#condizioni'],
    11: ['Strutture condizionali annidate ed elif', '#elif']
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
