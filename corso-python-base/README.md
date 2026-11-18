# Introduzione a Python · corso per le classi seconde

Quattro lezioni guidate da un'ora sulle slide 1–11 del capitolo 1 di A. Tibone, *Progettare e programmare* (Zanichelli 2020), con codice Python eseguibile nel browser (Pyodide), simulazioni, infografiche, esercizi a correzione automatica e test di fine lezione.

URL: `https://antonioadinolfiscuola.it/corso-python-base/` (pagine `noindex`). Collegato da **Materiali → Seconda → Laboratorio Interattivo** (`materiali_catalogo.json`).

## Programma
| Lezione | Slide | Contenuti | Simulazioni ed esercizi |
|---|---|---|---|
| 1 · Python, un linguaggio per tutti (1.1) | 1–2 | caratteristiche di Python, interprete e compilatore, shell ed editor di IDLE, `print()` | carta d'identità, compilatore vs interprete, shell `>>>` vera; 2 esercizi di codice |
| 2 · Variabili, tipi di dato e input (1.2) | 3–5 | variabili, `int float str bool`, `type()`, tipizzazione dinamica, case-sensitive, `input()`, `int()`, `float()` | visualizzatore passo passo delle variabili, «indovina il tipo», laboratorio delle conversioni; 2 esercizi di codice con input |
| 3 · Operatori e output formattato (1.2) | 6–8 | `+ - * / // % **`, tipo del risultato, precedenza, concatenamento e ripetizione, tripli apici, `sep`/`end`, escape, `format()` e f-string | calcolatrice con le regole di Python, caramelle (`//` e `%`), precedenza passo passo, costruttore di `print()`, esploratore di `format()`; 2 esercizi di codice |
| 4 · Le strutture condizionali (1.3) | 9–11 | `if…else`, indentazione, operatori relazionali e logici, annidamento ed `elif` | diagramma di flusso animato, condizioni sulla retta dei numeri, tabella di verità, calcolatrice della slide 11 passo passo; 3 esercizi di codice |

Due precisazioni rispetto alle slide, segnalate nelle lezioni: la slide 6 dice che un'operazione tra interi dà sempre un intero, ma in Python 3 `/` restituisce sempre `float` (`6 / 3 == 2.0`); la «tipizzazione debole» del libro è chiamata più spesso *tipizzazione dinamica* (Python è comunque fortemente tipizzato: `"4" + 5` dà errore).

## File
- `index.html` guida al corso; `lezione-N.html` lezioni.
- `pyb-runner.js` + `pyb-worker.js`: Python nel browser (Pyodide 0.28.3 da jsDelivr, in un Web Worker con timeout di 6 s). Componenti:
  - `<div class="py-box" data-py="id" [data-ex="l2-e2"] [data-stdin="riga1\nriga2"]>` editor; se il codice contiene `input()` compare la casella «Input da tastiera»;
  - `<div class="py-trace" data-stdin="…">` visualizzatore passo passo (riga corrente, variabili e tipi, output);
  - `<div class="py-shell" id="…">` shell interattiva; pulsanti con `data-shell-cmd` dentro un contenitore `data-shell="id"`.
- `pyb-data.js`: lezioni, test (10 domande ciascuno) ed esercizi di codice. Nelle verifiche: `_OUTPUT`, `_SRC` e `_run(['input1', 'input2'])`, che riesegue il programma con altri input e ne restituisce l'output.
- `pyb-ex.js`: esercizi a scelta, numerici, testuali (`data-text`) e di ordinamento.
- `pyb-sim-N.js`: simulazioni della lezione N. `pyb-slides.js` + `slide/`: visore delle slide.
- `pyb-progress.js`, `pyb-lesson.js`, `pyb-tools.js`, `pyb.css`: stesso impianto dei corsi Python OOP e Intelligenza artificiale (soglia 70%, sblocco progressivo, consegna al docente, evidenziatore).
- `apps-script/`: ricezione delle consegne in PDF su Drive (vedi il suo README) e `pyb-config.js` per l'URL.

## Modalità docente
Aprendo una pagina con `#docente=<codice>` (lo stesso degli altri corsi) tutte le lezioni si sbloccano su quel browser; `#docente-off` la disattiva.

## Licenza
© 2026 Prof. Antonio Adinolfi, CC BY-NC-SA 4.0. Le slide sono © Zanichelli ed escluse dalla licenza: vedi `LICENSE.md`.
