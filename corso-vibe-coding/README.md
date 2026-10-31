# Vibe Coding per docenti liceali

Sito didattico e progetto formativo per un corso di 24 ore articolato in sei lezioni da quattro ore, rivolto a docenti di discipline diverse.

## Contenuti
- `index.html` + `corso-home.js`: guida al corso. Che cos'è il vibe coding (origine, spettro puro/verificato/assistito), come funziona (diagramma costruzione vs uso, autoverifica), strumenti per famiglie, tre modalità d'uso in classe (A/B/C), quadro normativo (AI Act art. 4, D.M. 166/2025, L. 132/2025), mappa delle lezioni con stato, esportazione/importazione dell'avanzamento, glossario e fonti.
- `lezione-1…6.html`: lezioni con test al 70%. Dalla v5: tempi specifici per lezione, attività in classe legata a una modalità, scelta dell'assistente (Gemini, ChatGPT, Claude, altro), opzioni dei test in ordine casuale.
- `corso-data.js`: contenuti delle lezioni (campi `schedule` e `classroom` aggiunti in v5).
- `programma.md`: programma formativo completo in formato Markdown.
- `prompt-kit.md`: modelli di prompt e checklist per i laboratori.

## Pubblicazione
Il progetto è statico e non richiede backend, database, chiavi API o dipendenze esterne. Se il repository pubblica già il sito tramite GitHub Pages dalla branch `main` e dalla cartella root, la pagina può essere raggiunta all'indirizzo:

`https://antonioadinolfiscuola.it/corso-vibe-coding/`

L'URL funzionerà solo se il dominio e GitHub Pages sono configurati per servire la cartella del repository; dopo il commit, verificare le impostazioni Pages e aprire il collegamento. Non sono state modificate le impostazioni di pubblicazione del repository.

## Principi
- Nessuna raccolta di dati personali.
- Nessun servizio esterno necessario per il funzionamento della pagina.
- I collegamenti esterni sono solo risorse informative.
- Le applicazioni create dai corsisti vanno collaudate prima dell'uso con gli studenti.

## Manutenzione
Modificare i file nella cartella `corso-vibe-coding/`. Il sito è autonomo e può essere aggiornato con normali commit su GitHub.


## Area riservata Docente / Corsista

- Portale frontend: `portale/index.html`
- Configurazione client: `portale/config.js`
- API protetta e accesso Drive: `backend/`
- Specifica ruoli e requisiti: [ACCESSO-E-RUOLI.md](./ACCESSO-E-RUOLI.md)

Il portale usa Google Workspace e un elenco esplicito di account autorizzati. Il corsista vede solo la lezione pubblicata; il docente può consultare tutte le lezioni e i materiali. Il backend deve essere distribuito in HTTPS e collegato a Google Drive prima dell'uso reale. GitHub Pages da solo non protegge i file.

## Licenza
© 2026 Prof. Antonio Adinolfi. Contenuti distribuiti con licenza Creative Commons BY-NC-SA 4.0: vedi `LICENSE.md`.
