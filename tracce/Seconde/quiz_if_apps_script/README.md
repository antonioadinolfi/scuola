# Quiz Python classe seconda (variabili e if / elif / else): correzione e consegna

Funziona come il quiz di quarta (`tracce/Quarte/quiz_oop_apps_script/`) ma con un **progetto Apps Script separato**, con il suo URL e le sue cartelle Drive.

La pagina `tracce/Seconde/quiz_if_python.html` non contiene le soluzioni. Alla consegna invia le risposte a questa web app, che:

1. verifica l'identità dello studente con il token di accesso Google (solo account `@lscortese.com`);
2. corregge in automatico le domande a scelta multipla e quelle in cui lo studente scrive il valore stampato;
3. lascia al docente le domande in cui lo studente scrive codice;
4. crea un PDF con dati dello studente, esito, dettaglio delle risposte e, in fondo, le risposte in codice affiancate alla soluzione di riferimento, con lo spazio per la valutazione;
5. salva il PDF nella cartella Drive **Consegne Quiz Python Seconda**, divisa per classe, e aggiunge una riga al foglio **Registro Quiz Python Seconda**.

## Le domande

15 esercizi in ordine di difficoltà (base 1-5, intermedio 6-10, avanzato 11-15):

| Tipo | Quante | Correzione |
|---|---|---|
| Scelta multipla | 10 | automatica |
| Valore da scrivere | 3 | automatica: tollera spazi in più, virgolette esterne e maiuscole, ma il valore deve essere esatto (`70.0` non vale `70`) |
| Codice da scrivere | 2 | del docente, nel PDF |

Lo studente vede il punteggio delle 13 domande corrette in automatico e un **esito provvisorio** (superato con almeno 10 su 13, cioè il 70%). Il PDF segnala le 2 risposte da valutare.

## Attivazione (circa 5 minuti, con l'account @lscortese.com)

1. Apri <https://script.google.com> e crea un **Nuovo progetto**, chiamato per esempio `Quiz Python seconda – consegne`.
2. Incolla il contenuto di `Code.gs` nel file `Code.gs` del progetto.
3. Crea un secondo file con **+ → Script**, chiamalo `Chiave`, e incolla il contenuto di `Chiave.gs`. Questo file ti è stato consegnato a parte e **non** si trova nel repository, perché contiene le risposte esatte.
4. Seleziona la funzione `autorizza` ed eseguila. Concedi le autorizzazioni richieste.
5. Facoltativo: esegui `provaConsegna`. Nella sottocartella `PROVE` compare un PDF di prova.
6. Scegli **Distribuisci → Nuova distribuzione → App web**, con *Esegui come: Me* e *Chi ha accesso: Chiunque*. Copia l'URL che termina con `/exec`.
7. Inserisci l'URL in `tracce/Seconde/quiz_if_python.html` (cerca `appsScriptUrl: ""`), poi fai commit e push.

Se in seguito modifichi lo script, usa **Gestisci distribuzioni → Modifica → Nuova versione**: l'URL resta lo stesso.

## Protezioni, tempo e limiti

Come nel quiz di quarta: timer di 45 minuti con consegna automatica, protezione delle domande (copia, stampa, uscite dalla pagina, filigrana) e registrazione dei comportamenti nel PDF. Nei campi di risposta lo studente può scrivere e selezionare il proprio testo, ma non può incollare: i tentativi di incollare vengono registrati.

I limiti sono gli stessi del quiz di quarta: vedi `tracce/Quarte/quiz_oop_apps_script/README.md`.

## Cambiare le domande

Se modifichi i casi, aggiorna sia la pagina sia `Chiave.gs` e cambia `QUIZ_ID` in entrambi.
