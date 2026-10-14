# Prompt kit — Vibe Coding per docenti

## 1. Prompt iniziale: definire il progetto
Agisci come progettista di applicazioni web didattiche. Aiutami a trasformare questa esigenza in un prototipo semplice.

- Disciplina e classe: [inserire]
- Obiettivo di apprendimento osservabile: [inserire]
- Problema che voglio affrontare: [inserire]
- Utenti: [studenti/docente/gruppi]
- Funzioni indispensabili: [elenco]
- Vincoli: browser, accessibilità, nessun dato personale non necessario, nessuna chiave API esposta.

Prima di scrivere codice, restituisci una specifica breve con schermate, flusso d'uso e criteri per capire se funziona. Evidenzia le informazioni mancanti e non aggiungere funzioni non richieste.

## 2. Prompt di sviluppo
Implementa la specifica concordata in una pagina web responsive. Mantieni HTML, CSS e JavaScript semplici e leggibili. Non usare librerie esterne se non sono indispensabili. Spiega come avviare e provare il progetto. Non dichiarare di aver eseguito test che non hai realmente eseguito.

## 3. Prompt di debugging
Il comportamento atteso è: [descrivere]. Il comportamento osservato è: [descrivere]. Per riprodurlo eseguo: [passaggi]. Correggi la causa più probabile senza riscrivere parti non coinvolte. Spiega la modifica e proponi test di regressione.

## 4. Prompt per verificare i contenuti
Esamina il contenuto disciplinare dell'applicazione. Separa le affermazioni certe da quelle che richiedono verifica. Evidenzia ambiguità, errori potenziali e semplificazioni che potrebbero fuorviare gli studenti. Non inventare fonti o riferimenti.

## 5. Prompt per accessibilità e privacy
Controlla la pagina per navigazione da tastiera, struttura dei titoli, etichette dei controlli, contrasto, leggibilità su dispositivi mobili e messaggi di stato. Verifica che non raccolga dati personali non necessari e che non esponga credenziali o chiavi. Elenca problemi concreti e correzioni prioritarie.

## 6. Checklist di collaudo
- [ ] Le funzioni principali corrispondono alla specifica.
- [ ] I campi vuoti e gli input non validi sono gestiti.
- [ ] I valori limite non causano errori.
- [ ] Feedback e messaggi sono comprensibili.
- [ ] L'applicazione è usabile da schermi piccoli.
- [ ] I controlli sono raggiungibili da tastiera.
- [ ] I contenuti disciplinari sono stati verificati dal docente.
- [ ] Non sono presenti dati personali reali, token o chiavi API.
- [ ] La pagina non dichiara risultati di test non effettuati.
- [ ] È disponibile una breve istruzione d'uso per gli studenti.

## Regola di lavoro
Procedere per iterazioni piccole: una modifica per volta, poi test. Salvare versioni significative e mantenere il docente nel ruolo di responsabile del contenuto e del risultato.
