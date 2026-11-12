# Calcolo numerico con Octave · corso per le classi quinte

Nove lezioni guidate da un'ora per il liceo scientifico delle scienze applicate: ambiente MATLAB/GNU Octave, vettori e matrici, operazioni matriciali e puntuali, sistemi lineari (backslash, Gauss, Gauss-Jordan), grafici 2D e sottografici. Codice eseguibile nel browser con un simulatore di Octave, esercizi a correzione automatica e test di fine lezione. Struttura uguale a quella di `corso-python-oop/`.

URL (non linkato dal sito, `noindex`): `https://antonioadinolfiscuola.it/corso-octave/`

## Programma
| Lezione | Contenuti | Stato |
|---|---|---|
| 1 · L'ambiente di lavoro | calcolo numerico, MATLAB vs Octave (proprietario/libero), Command Window, workspace, script `.m`, funzioni | pronta |
| 2 · Sistemi lineari e backslash | matrici e vettori colonna, forma `Ax = b`, `\`, residuo, `det`, `rank`, Rouché-Capelli; ponte con l'esercitazione Excel 4×4 | pronta |
| 3 · Operazioni matriciali e puntuali | `*` vs `.*`, `./`, `.^`, trasposta, `det`, `trace`, `inv`, verifica `A*inv(A)` | da fare |
| 4 · Il metodo di Gauss | eliminazione, pivot, sostituzione all'indietro; righe `A(i,:)` quanto basta; implementazione e confronto con `\` | da fare |
| 5 · Il metodo di Gauss-Jordan | riduzione completa, `rref`, inversa con `[A I]` | da fare |
| 6 · Tipi di dato e operazioni | scalari/vettori/matrici nativi, precedenza, reali e complessi, funzioni predefinite | da fare |
| 7 · Creare e indicizzare vettori e matrici | `:` e `linspace`, `eye`/`zeros`/`ones`, indici, `end`, sottomatrici | da fare |
| 8 · Grafici 2D | `plot`, stili, `xlabel`/`ylabel`/`title`/`legend`/`grid` | da fare |
| 9 · Più grafici e progetto finale | `figure`, `hold on`, `subplot`, progetto, test finale | da fare |

Ordine rivisto il 12/11/2026: tutta l'algebra lineare (Lezioni 2-5) nella prima metà del corso. La Lezione 2 introduce matrici e vettori «quanto basta», la 4 l'indicizzazione di righe necessaria a Gauss; le Lezioni 6-7 riprendono tipi e indicizzazione in modo sistematico.

## File
- `index.html`: guida al corso, prova dell'editor (con grafico), mappa delle lezioni, avanzamento, glossario.
- `lezione-N.html`: lezioni con obiettivi, problema, concetti, sintassi, errori tipici, esercizi, sintesi e test.
- `oct-data.js`: metadati delle lezioni, domande dei test (`available: true` pubblica la lezione), esercizi con le verifiche.
- `oct-interp.js` (lexer, parser, aritmetica, formattazione) + `oct-eval.js` (esecuzione, funzioni predefinite, grafici, workspace): il simulatore di Octave. Gira in `oct-worker.js` con un timeout di 6 secondi.
- `oct-runner.js`: editor degli script, Command Window con workspace e cronologia, grafici con Plotly (`../plotly-2.35.2.min.js`, caricato al primo grafico), spiegazione in italiano degli errori di Octave.
- `oct-progress.js`, `oct-lesson.js`: soglia del 70%, sblocco progressivo, modalità docente, esportazione dell'avanzamento, test e consegna.
- `oct-pdf.js` + `vendor/` (jsPDF 4.2.1 e qrcode-generator 1.4.4, licenza MIT): PDF dell'esito da consegnare su Classroom, con dati firmati.
- `verifica.html`: pagina del docente (non linkata, `noindex`) che controlla i PDF scaricati da Classroom.
- `apps-script/` + `oct-config.js`: invio online facoltativo dell'esito su Drive (vedi `apps-script/README.md`); il pannello compare solo se `appsScriptUrl` è impostato.

## Consegna su Classroom e controllo anti-copia
1. Prima del test lo studente inserisce **nome, cognome e classe**: restano legati al tentativo e non si cambiano dopo l'inizio.
2. Da «Inizia il test» vengono registrati: inizio e consegna (orologio del dispositivo e ora del sito, letta dall'intestazione `Date` del server), durata misurata con `performance.now()`, tempo della prima risposta e numero di modifiche per ogni domanda, uscite dalla pagina (cambio di scheda o di app: numero, istanti, durata), ricaricamenti (il test riprende dove era, ma l'evento è registrato), ordine casuale delle opzioni, ID casuale del tentativo e del dispositivo, browser e schermo.
3. Alla consegna i dati vengono firmati (HMAC-SHA-256); il pulsante **Scarica il PDF per Classroom** crea `L1_5A_Cognome_Nome_AAAAMMGG-hhmm.pdf` con esito, tempi, risposte (senza la soluzione), storico dei tentativi, esercizi, segnalazioni automatiche, codice di verifica e QR. I dati completi firmati sono nei metadati del PDF.
4. Il docente scarica da Classroom i PDF del compito e li trascina in `verifica.html` (anche link «Verifica dei PDF» nel riquadro della modalità docente). La pagina, senza inviare nulla in rete, segnala: firma non valida o punteggio alterato, file senza dati (stampato o rigenerato), stesso tentativo consegnato da due studenti, stesso dispositivo usato per studenti diversi, risposte identiche con errori uguali, tempi troppo brevi, uscite e ricaricamenti, orologio del dispositivo spostato, tentativi importati da un altro dispositivo. Esporta un CSV.

Limite: la chiave della firma è nel codice del sito, quindi la firma rende evidenti le modifiche al file e lo scambio dei PDF ma non resiste a chi analizza il JavaScript. Per una prova sommativa conviene il test in classe sotto sorveglianza; le segnalazioni sono indizi da valutare.

## Il simulatore
Riproduce il sottoinsieme di Octave usato nel corso, con i messaggi di errore e la visualizzazione dei risultati di Octave (`x = 5`, matrici in colonna, `Columns 1 through 8`, `format long`).
- Con una matrice singolare `\\` stampa l'avviso e restituisce la soluzione di minima norma, come Octave (MATLAB darebbe `Inf`/`NaN`); i sistemi non quadrati sono risolti ai minimi quadrati (SVD).
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
