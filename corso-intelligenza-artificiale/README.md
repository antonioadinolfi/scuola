# Introduzione all'intelligenza artificiale · corso per le classi quinte

Quattro lezioni guidate da un'ora sul capitolo 8 di A. Tibone, *Progettare e programmare* vol. 3 (Zanichelli 2019), potenziate con simulazioni interattive, infografiche, esercizi a correzione automatica e test di fine lezione. Ogni lezione include le slide del capitolo; testi, infografiche e simulazioni sono originali.

URL: `https://antonioadinolfiscuola.it/corso-intelligenza-artificiale/` (pagine `noindex`). Collegato da **Materiali → Quinta → Laboratorio Interattivo** (`materiali_catalogo.json`).

## Programma
| Lezione | Contenuti | Simulazioni e infografiche |
|---|---|---|
| 1 · Breve storia dell'IA prima di Internet (8.1) | IA forte/generale/debole, cibernetica, Turing, Dartmouth, ELIZA, sistemi esperti, robotica, game AI, inverni dell'IA | spettro delle IA, linea del tempo filtrabile (18 tappe), chatbot ELIZA con regole visibili, sistema esperto di una diga (forward chaining), tris con minimax e alfa-beta, calcolo seriale/parallelo, curva degli inverni |
| 2 · La nuova epoca dei big data (8.2) | big data e DBMS, unità di misura, data science e data analytics, 5 V, motori di ricerca, visione artificiale, guida autonoma, correlazione e causalità | era digitale (Hilbert & López 2011), scala dei byte, 5 V, flusso dati e coda (velocità), autocompletamento da log di ricerca, correlazione con variabile nascosta |
| 3 · Il machine learning (8.3) | con/senza supervisione, classificazione, regressione, clustering, training e test, overfitting, KNN, naive Bayes, alberi di decisione (greedy), k-means | albero del ML, classificatore lineare addestrato passo passo (gatti/cani), KNN trascinabile con regioni, antispam naive Bayes, albero di decisione percorribile, k-means animato |
| 4 · Le reti neurali (8.4) | neurone artificiale, pesi e bias, funzioni di attivazione, percettrone e XOR, reti multistrato e deep learning, backpropagation, discesa del gradiente | neurone biologico/artificiale, simulatore del neurone con grafico dell'attivazione, neurone AND/OR da progettare, percettrone che impara, rete XOR, discesa del gradiente, mini playground con backpropagation |

## File
- `index.html`: guida al corso, mappa del capitolo, percorso, avanzamento, glossario.
- `lezione-N.html`: lezioni. Ogni lezione ha obiettivi, concetti, simulazioni, esercizi, sintesi, test e fonti.
- `ia-data.js`: metadati delle lezioni e domande dei test (`available: true` pubblica la lezione).
- `slide/` + `ia-slides.js`: le 25 slide del capitolo 8 (WebP, ~2 MB) e il visore inserito in ogni lezione (frecce, miniature, schermo intero, «Vai all'argomento»). Le slide sono © Zanichelli ed escluse dalla licenza CC.
- `ia-sim-N.js`: simulazioni della lezione N (JavaScript puro, nessuna libreria esterna).
- `ia-ex.js`: esercizi a correzione automatica (scelte, numeri, ordinamenti, sfide).
- `ia-progress.js`: soglia del 70%, sblocco progressivo, esportazione/importazione dell'avanzamento.
- `ia-lesson.js`: test, esito e consegna al docente. `ia-tools.js`: evidenziatore, riflettore e punti chiave.
- `ia.css`: stile (derivato da `corso-python-oop/oop.css`, più i componenti delle simulazioni).
- `apps-script/`: web app per ricevere le consegne in PDF su Drive (vedi il suo README) e `ia-config.js` per l'URL.

## Aggiungere un esercizio
```html
<div class="ia-ex" data-ex="l2-e5" data-hint="suggerimento">
  <select data-answer="b">…</select>                  <!-- scelta -->
  <input data-answer="0.75" data-tol="0.01">          <!-- numero -->
  <ol class="ex-order"><li data-pos="1">…</li></ol>   <!-- ordinamento -->
</div>
```
Una sfida è `<div class="ia-ex" data-ex="…" data-type="challenge"></div>`, completata da una simulazione con `IaEx.complete('…')`.

## Modalità docente
Aprendo una pagina del corso con `#docente=<codice>` tutte le lezioni si sbloccano su quel browser. Sono validi il codice del corso Python a oggetti e un codice specifico di questo corso (comunicato al docente, non scritto qui: nel codice c'è solo la sua impronta SHA-256). Con `#docente-off` la modalità si disattiva.

**Accesso con l'account della scuola.** Se nel browser è attiva la sessione del sito (accesso con Google, `auth-enterprise.js`, chiave `lsc_auth_session_v1`) con l'account `antonioadinolfi@lscortese.com`, tutte le lezioni sono sbloccate, senza codice. Nelle pagine bloccate c'è anche il pulsante «Accedi con Google» per il docente. La sessione dura 8 ore; «Esci» nella barra della modalità docente la chiude. È un controllo lato client, come il codice: serve a non bloccare il docente, non a proteggere i contenuti.

## Licenza
© 2026 Prof. Antonio Adinolfi. Contenuti distribuiti con licenza Creative Commons BY-NC-SA 4.0: vedi `LICENSE.md`.
