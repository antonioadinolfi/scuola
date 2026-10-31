# Python a oggetti · corso per le classi quarte

Sei lezioni guidate da un'ora sulla programmazione a oggetti in Python, con diagrammi UML, codice eseguibile nel browser, esercizi a correzione automatica e test di fine lezione.

URL (non linkato dal sito, `noindex`): `https://antonioadinolfiscuola.it/corso-python-oop/`

## Programma
| Lezione | Contenuti | Stato |
|---|---|---|
| 1 · Dal mondo reale alle classi | classe e oggetto, `__init__`, `self`, UML: i tre riquadri | pronta |
| 2 · Attributi e metodi | attributi di istanza e di classe, metodi, `__str__`/`__repr__`, UML con i tipi | da fare |
| 3 · Incapsulamento | `_` e `__`, `@property`, setter con validazione, visibilità UML | da fare |
| 4 · Ereditarietà | sottoclassi, `super()`, override, generalizzazione UML | da fare |
| 5 · Polimorfismo e metodi speciali | duck typing, `__eq__`, `__lt__`, `__add__`, `abc` | da fare |
| 6 · Relazioni e progettazione | associazione, aggregazione, composizione, progetto, test finale | da fare |

## File
- `index.html`: guida al corso, prova dell'editor, mappa delle lezioni, avanzamento, glossario.
- `lezione-N.html`: lezioni. Ogni lezione ha obiettivi, problema, concetti, UML, sintassi, errori tipici, esercizi, sintesi e test.
- `oop-data.js`: metadati delle lezioni, domande dei test (`available: true` pubblica la lezione) ed esercizi con le verifiche.
- `oop-runner.js` + `oop-worker.js`: editor e Python (Pyodide 0.28 da jsDelivr) in un Web Worker, con un timeout di 6 secondi contro i cicli infiniti. Gli errori sono spiegati in italiano.
- `oop-progress.js`: soglia del 70%, sblocco progressivo, esportazione/importazione dell'avanzamento.
- `oop-lesson.js`: test, esito e consegna al docente.
- `oop-uml.js`: diagrammi UML con Mermaid (`classDiagram`).
- `apps-script/`: web app per ricevere le consegne in PDF su Drive (vedi il suo README) e `oop-config.js` per l'URL.

## Aggiungere un esercizio
In HTML:
```html
<div class="py-box" data-py="l2-e1" data-ex="l2-e1"><textarea class="py-src">codice iniziale</textarea></div>
```
In `oop-data.js`, `OOP_EXERCISES['l2-e1'] = { checks: [{ t, c, h }], hints: [...], solution }`. Ogni verifica `c` è codice Python eseguito dopo quello dello studente. Supera se non solleva eccezioni; `_OUTPUT` contiene ciò che lo studente ha stampato.

## Modalità docente
Aprendo una pagina del corso con `#docente=<codice>` tutte le lezioni si sbloccano su quel browser. Con `#docente-off` la modalità si disattiva.
