# Quiz Python classe seconda (variabili e if / elif / else): correzione e consegna

Funziona come il quiz di quarta (`tracce/Quarte/quiz_oop_apps_script/`) ma con un **progetto Apps Script separato**, con il suo URL e le sue cartelle Drive.

La pagina `tracce/Seconde/quiz_if_python.html` non contiene le soluzioni. Alla consegna invia le risposte a questa web app, che:

1. verifica l'identità dello studente con il token di accesso Google (solo account `@lscortese.com`);
2. corregge in automatico le domande a scelta multipla e quelle in cui lo studente scrive il valore stampato;
3. lascia al docente le domande in cui lo studente scrive codice;
4. crea un PDF con dati dello studente, esito, dettaglio delle risposte e, in fondo, le risposte in codice affiancate alla soluzione di riferimento, con lo spazio per la valutazione;
5. salva il PDF nella cartella Drive **Consegne Quiz Python Seconda**, divisa per classe, e aggiunge una riga al foglio **Registro Quiz Python Seconda**.

## Le domande

20 esercizi in ordine di difficoltà (base 1-7, intermedio 8-14, avanzato 15-20):

| Tipo | Quante | Correzione |
|---|---|---|
| Scelta multipla | 13 | automatica |
| Valore da scrivere | 4 | automatica: tollera spazi in più, virgolette esterne e maiuscole, ma il valore deve essere esatto (`70.0` non vale `70`) |
| Codice da scrivere | 3 | del docente, nel PDF |

Lo studente vede il punteggio delle 17 domande corrette in automatico e un **esito provvisorio** (superato con almeno 12 su 17, cioè il 70%). Il PDF segnala le 3 risposte da valutare.

## Orario di apertura e chiusura

In cima a `Code.gs`, nell'editor di Apps Script:

```javascript
const APERTURA = '2026-11-12 09:00';   // ora italiana, formato AAAA-MM-GG HH:MM
const CHIUSURA = '2026-11-12 10:00';   // facoltativa
```

- **Prima di APERTURA** la pagina mostra il giorno e l'ora di apertura con il conto alla rovescia, il pulsante «Inizia il quiz» è disattivato e lo script rifiuta le consegne. All'ora indicata il pulsante si sblocca da solo, senza ricaricare la pagina.
- **Dopo CHIUSURA** non si può più iniziare. Chi ha già iniziato può consegnare per altri 45 minuti più 5 di margine (`MARGINE_MINUTI`); la consegna automatica allo scadere del timer rientra sempre in questo tempo.
- **Campi vuoti** (`''`): il test è sempre aperto.
- Conta l'**ora del server**, non quella del computer dello studente.
- Un orario scritto male (formato sbagliato, data inesistente, chiusura prima dell'apertura) **blocca** il test con un messaggio, invece di lasciarlo aperto. Per controllare gli orari esegui la funzione `controllaOrario` e guarda il registro di esecuzione.
- Dopo ogni modifica: **Distribuisci → Gestisci distribuzioni → Modifica → Nuova versione**. Senza nuova versione la web app continua a usare gli orari precedenti.

**Limite.** Le domande sono già nella pagina, codificate, anche prima dell'apertura: uno studente molto esperto potrebbe decodificarle in anticipo. Per escluderlo del tutto le domande dovrebbero essere inviate dallo script solo dopo l'apertura.

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
