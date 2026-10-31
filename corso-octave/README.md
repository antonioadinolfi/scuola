# Calcolo numerico con Octave · corso per le classi quinte

Nove lezioni guidate da un'ora per il liceo scientifico delle scienze applicate: ambiente MATLAB/GNU Octave, vettori e matrici, operazioni matriciali e puntuali, sistemi lineari (backslash, Gauss, Gauss-Jordan), grafici 2D e sottografici. Codice eseguibile nel browser con un simulatore di Octave, esercizi a correzione automatica e test di fine lezione. Struttura uguale a quella di `corso-python-oop/`.

URL (non linkato dal sito, `noindex`): `https://antonioadinolfiscuola.it/corso-octave/`

## Programma
| Lezione | Contenuti | Stato |
|---|---|---|
| 1 · L'ambiente di lavoro | calcolo numerico, MATLAB vs Octave (proprietario/libero), Command Window, workspace, script `.m`, funzioni | pronta |
| 2 · Tipi di dato e operazioni | scalari/vettori/matrici nativi, precedenza, reali e complessi, funzioni predefinite | da fare |
| 3 · Creare e indicizzare vettori e matrici | riga/colonna, `:` e `linspace`, `eye`/`zeros`/`ones`, indici ed `end` | da fare |
| 4 · Operazioni matriciali e puntuali | `*` vs `.*`, `./`, `.^`, trasposta, `det`, `trace`, `inv` | da fare |
| 5 · Sistemi lineari e backslash | forma `Ax = b`, `\`, residuo, matrici singolari | da fare |
| 6 · Il metodo di Gauss | eliminazione, pivot, sostituzione all'indietro, implementazione | da fare |
| 7 · Il metodo di Gauss-Jordan | riduzione completa, `rref`, inversa con `[A I]` | da fare |
| 8 · Grafici 2D | `plot`, stili, `xlabel`/`ylabel`/`title`/`legend`/`grid` | da fare |
| 9 · Più grafici e progetto finale | `figure`, `hold on`, `subplot`, progetto, test finale | da fare |

## File
- `index.html`: guida al corso, prova dell'editor (con grafico), mappa delle lezioni, avanzamento, glossario.
- `lezione-N.html`: lezioni con obiettivi, problema, concetti, sintassi, errori tipici, esercizi, sintesi e test.
- `oct-data.js`: metadati delle lezioni, domande dei test (`available: true` pubblica la lezione), esercizi con le verifiche.
- `oct-interp.js` (lexer, parser, aritmetica, formattazione) + `oct-eval.js` (esecuzione, funzioni predefinite, grafici, workspace): il simulatore di Octave. Gira in `oct-worker.js` con un timeout di 6 secondi.
- `oct-runner.js`: editor degli script, Command Window con workspace e cronologia, grafici con Plotly (`../plotly-2.35.2.min.js`, caricato al primo grafico), spiegazione in italiano degli errori di Octave.
- `oct-progress.js`, `oct-lesson.js`: soglia del 70%, sblocco progressivo, modalità docente, esportazione dell'avanzamento, test e consegna.
- `apps-script/` + `oct-config.js`: consegna dei test in PDF su Drive (vedi `apps-script/README.md`).

## Il simulatore
Riproduce il sottoinsieme di Octave usato nel corso, con i messaggi di errore e la visualizzazione dei risultati di Octave (`x = 5`, matrici in colonna, `Columns 1 through 8`, `format long`).
- Matrici reali e complesse, intervalli `a:p:b`, indicizzazione con `end`, `:` e indici logici, crescita e cancellazione (`A(2,:) = []`).
- Operatori `+ - * / \ ^ .* ./ .^ ' .'`, confronti, `& | ~ && ||`; `if`/`elseif`, `for`, `while`, `switch`, `try`, `break`/`continue`.
- Funzioni definite nello script (anche più uscite e ricorsive) e funzioni anonime `@(x) …`.
- Funzioni predefinite: matematiche elementari (anche complesse), `sum`, `prod`, `max`, `min`, `sort`, `find`, `cumsum`, `linspace`, `zeros`, `ones`, `eye`, `rand`, `magic`, `diag`, `det`, `inv`, `trace`, `rank`, `rref`, `lu`, `norm`, `cond`, `disp`, `fprintf`, `sprintf`, `num2str`, `who`, `whos`, `clear`, `clc`, `format`, `help` (ridotto) e altre.
- Grafici: `plot` (formati come `'r--o'`, `'LineWidth'`, …), `fplot`, `scatter`, `figure`, `hold`, `subplot`, `title`, `xlabel`, `ylabel`, `legend`, `grid`, `axis`, `xlim`, `ylim`.
- Non disponibili: strutture, matrici di caratteri su più righe, `input`, file e pacchetti. `det`, `inv` e `\` lavorano su matrici reali.

Collaudo rapido da riga di comando: `node -e "require('./oct-interp.js'); const {runProgram}=require('./oct-eval.js'); console.log(runProgram('A=[2 1;1 3]\nA\\\\[1;2]').out)"`.

## Aggiungere un esercizio
In HTML:
```html
<div class="oc-box" data-oc="l2-e1" data-ex="l2-e1" data-file="nome.m"><textarea class="oc-src">codice iniziale</textarea></div>
```
In `oct-data.js`, `OCT_EXERCISES['l2-e1'] = { checks: [{ t, c, h }], hints: [...], solution }`. Ogni verifica `c` è codice Octave eseguito dopo lo script dello studente, nello stesso workspace: supera se non genera errori (usare `assert(condizione, 'messaggio %g', valore)`). Sono disponibili `_OUTPUT` (testo mostrato), `_CODE` (lo script) e `_NTRACCE` (numero di curve disegnate).

Una Command Window si inserisce con `<div class="oc-cmd" data-cmd="id" data-try="comando1|comando2"></div>`.

## Modalità docente
Aprendo una pagina del corso con `#docente=<codice>` (lo stesso codice del corso Python OOP) tutte le lezioni si sbloccano su quel browser. Con `#docente-off` la modalità si disattiva.
