# Guida per insegnare il Vibe Coding usando il Generatore di esercizi

## Idea didattica

Il generatore non va presentato come un'app da usare e basta. È il caso studio che il gruppo impara a progettare, costruire, testare e migliorare con l'aiuto dell'IA. Il docente resta responsabile delle scelte didattiche e della verifica dei risultati.

**Risultato atteso:** ogni corsista sa trasformare un bisogno della propria disciplina in una specifica, ottenere un primo prototipo da un assistente IA, individuare difetti e chiedere modifiche mirate.

## Laboratorio guidato: 90–120 minuti

### Fase 1 — Partire dal problema (10 min)
Chiedere ai docenti: «Quale attività ripetitiva vorreste rendere più interattiva?». Esempi: esercizi graduati di matematica, allenamento lessicale, quiz di letteratura, domande di scienze con spiegazione.

Non mostrare subito il codice. Far definire destinatari, obiettivo di apprendimento e criterio di successo.

### Fase 2 — Scrivere una specifica (15 min)
Il gruppo compila questa mini-scheda:
- Destinatari e disciplina:
- Obiettivo di apprendimento:
- Tipi di esercizio:
- Come risponde lo studente:
- Che feedback riceve:
- Come si controlla la correttezza:
- Dati che l'app non deve raccogliere:

### Fase 3 — Costruire con il prompt (20–30 min)
Copiare questo prompt in un assistente IA:

> Agisci come sviluppatore web e progettista didattico. Voglio costruire un'applicazione web semplice per [disciplina e classe]. L'obiettivo è [obiettivo osservabile]. Deve consentire di [tre funzionalità essenziali]. Crea una prima versione in un unico file HTML con CSS e JavaScript incorporati, senza librerie esterne, backend, account o raccolta di dati personali. Prima di scrivere il codice, riassumi i requisiti e segnala le ambiguità. Poi genera il file completo. Includi feedback per lo studente e un modo per verificare le risposte. Infine proponi test per risposte corrette, errate, vuote e casi limite. Non dichiarare che i test sono superati senza averli effettivamente eseguiti.

Il corsista deve leggere e discutere la specifica prima di chiedere il codice: non accettare automaticamente la prima generazione.

### Fase 4 — Confrontare con il prototipo (10 min)
Aprire il generatore di esempio e osservare:
- separazione tra impostazioni, esercizi, risposte e feedback;
- differenza tra esercizi generati da regole e domande prese da un repertorio fisso;
- come l'utente riceve il risultato della correzione;
- limiti dell'app: contenuti circoscritti, livello non sempre graduato per tutte le discipline, necessità di verifica umana.

Chiedere: «Quali decisioni didattiche sono codificate nell'app? Quali sono ancora da decidere?».

### Fase 5 — Iterare con richieste mirate (25–35 min)
Non chiedere genericamente «migliora l'app». Dare una richiesta alla volta, per poter capire l'effetto della modifica.

**Sfida A — Personalizzazione**
> Aggiungi un campo per scegliere l'argomento e fai in modo che gli esercizi siano coerenti con quell'argomento. Se non puoi produrre esercizi affidabili per un argomento, dichiaralo e non inventare contenuti.

**Sfida B — Feedback formativo**
> Dopo una risposta errata, mostra un suggerimento graduato prima della soluzione completa. Spiega come il suggerimento aiuta l'apprendimento senza rivelare subito la risposta.

**Sfida C — Accessibilità**
> Verifica l'uso da tastiera, le etichette dei campi, la leggibilità dei feedback e il comportamento su uno schermo piccolo. Correggi i problemi individuati e descrivi come testarli.

**Sfida D — Debugging**
> Esamina il codice e cerca almeno tre possibili difetti logici o casi limite. Per ogni difetto indica un test riproducibile, poi correggi solo i problemi confermati.

**Sfida E — Trasferimento disciplinare**
> Adatta l'app a una disciplina diversa mantenendo il ciclo generazione → risposta → feedback → verifica. Elenca le parti riutilizzabili e quelle che devono cambiare.

### Fase 6 — Collaudo tra pari (15 min)
Ogni coppia prova l'applicazione di un altro gruppo con una mini-matrice:
1. risposta corretta;
2. risposta errata;
3. risposta vuota;
4. input inatteso o valore limite;
5. uso solo da tastiera;
6. correttezza del contenuto disciplinare.

Registrare esito, difetto e correzione richiesta. Un codice prodotto dall'IA non è verificato solo perché si apre nel browser.

### Fase 7 — Riflessione finale (5 min)
Ogni docente completa:
- Una decisione didattica che ho preso io:
- Una cosa che l'IA ha generato bene:
- Un errore o limite che ho individuato:
- Un test che ho eseguito:
- La prossima modifica che farei:

## Collegamento con le sei lezioni del corso

- **Lezione 1:** usare la specifica e il prompt per ottenere la prima versione.
- **Lezione 2:** aggiungere funzionalità e progettare le interazioni.
- **Lezione 3:** lavorare su logica, variabili, feedback e generazione di esercizi.
- **Lezione 4:** debugging, accessibilità, privacy e pubblicazione.
- **Lezione 5:** project work autonomo su una disciplina scelta.
- **Lezione 6:** test tra pari, revisione, documentazione e piano di sperimentazione in classe.

## Valutazione del laboratorio

| Criterio | Evidenza |
|---|---|
| Specifica | Obiettivo didattico e requisiti espliciti |
| Prompting | Richieste chiare e revisioni progressive |
| Comprensione | Il docente sa spiegare almeno le parti principali del comportamento dell'app |
| Test | Casi corretti, errati e limite documentati |
| Giudizio professionale | Contenuti verificati e limiti riconosciuti |
| Autonomia | Sa proporre il passo successivo senza affidarsi ciecamente all'IA |

## Nota sulla sicurezza e sulla qualità

Usare dati fittizi. Non inserire dati personali degli studenti, password o chiavi API nei prompt o nel codice. Prima di usare l'app con una classe, il docente deve controllare accuratezza disciplinare, accessibilità, privacy e adeguatezza al gruppo. Il prototipo è uno strumento dimostrativo, non un sistema di valutazione certificato.
