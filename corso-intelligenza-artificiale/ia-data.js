/* Corso Intelligenza artificiale · dati delle lezioni e dei test di fine lezione.
   Per ogni domanda `correct` è l'indice (da 0) dell'opzione esatta; le opzioni vengono mescolate a video.
   `available: true` pubblica la lezione. */
"use strict";
window.IA_LESSONS = [
  {
    n: 1, available: true, minutes: 60,
    title: 'Breve storia dell’IA prima di Internet',
    short: 'IA forte, generale e debole; cibernetica, Turing, Dartmouth, ELIZA, sistemi esperti, robotica, game AI e gli «inverni» dell’IA.',
    quiz: [
      {
        case: 'Un software traduce testi dall’inglese all’italiano meglio di molte persone, ma non sa fare nient’altro. In quale categoria rientra?',
        options: ['IA debole', 'IA forte', 'IA generale', 'Cibernetica'],
        correct: 0,
        feedback: 'Tratta in modo intelligente un problema specifico: è IA debole, come tutti i sistemi che usiamo oggi.',
        hint: 'Rileggi le tre definizioni: quale riguarda i sistemi capaci di trattare problemi specifici?'
      },
      {
        case: 'Che cosa distingue l’IA forte dall’IA generale?',
        options: [
          'L’IA forte sarebbe cosciente di pensare; l’IA generale saprebbe eseguire qualsiasi compito intellettuale, senza che si parli di coscienza.',
          'L’IA forte è più veloce dell’IA generale.',
          'L’IA generale esiste già, l’IA forte no.',
          'Sono sinonimi.'
        ],
        correct: 0,
        feedback: 'La parola chiave dell’IA forte è coscienza; quella dell’IA generale è «qualsiasi compito».',
        hint: 'Nell’infografica dello spettro, confronta le righe «che cosa sa fare» e «è cosciente?».'
      },
      {
        case: 'Di che cosa si occupa la cibernetica, avviata da Norbert Wiener attorno agli anni Quaranta?',
        options: [
          'Dei meccanismi di autoregolazione e di controllo negli organismi viventi e nelle macchine.',
          'Della costruzione dei primi computer elettronici.',
          'Della traduzione automatica tra lingue.',
          'Dei videogiochi.'
        ],
        correct: 0,
        feedback: 'Controllo e retroazione (feedback): un termostato è il classico esempio cibernetico.',
        hint: 'Pensa all’esempio del termostato nella linea del tempo.'
      },
      {
        case: 'Che cos’è l’«imitation game» proposto da Alan Turing nel 1950?',
        options: [
          'Un test in cui un giudice, conversando per iscritto, deve capire se l’interlocutore è un umano o una macchina.',
          'Un programma che imita le mosse degli scacchisti.',
          'Una macchina astratta che legge e scrive simboli su un nastro.',
          'Il primo robot umanoide.'
        ],
        correct: 0,
        feedback: 'Oggi lo chiamiamo test di Turing: se il giudice non distingue la macchina dall’umano, la macchina «supera» il test.',
        hint: 'La macchina astratta con il nastro è del 1936: qui si parla del 1950 e di una conversazione.'
      },
      {
        case: 'Quale evento del 1956 è considerato l’atto di nascita dell’IA moderna?',
        options: ['Il seminario al Dartmouth College organizzato da John McCarthy', 'La vittoria di Deep Blue', 'La costruzione di WABOT-1', 'La pubblicazione di ELIZA'],
        correct: 0,
        feedback: 'Nella proposta del seminario compare per la prima volta l’espressione «artificial intelligence».',
        hint: 'Cerca il 1956 nella linea del tempo.'
      },
      {
        case: 'Hai provato il chatbot in stile ELIZA. Perché la sua conversazione sembra sensata?',
        options: [
          'Riconosce parole chiave e riformula la frase dell’utente con regole predefinite, senza comprenderne il significato.',
          'Ha imparato l’italiano leggendo milioni di testi.',
          'Usa una rete neurale profonda.',
          'Un operatore umano risponde al posto suo.'
        ],
        correct: 0,
        feedback: 'Attivando «mostra le regole» si vede quale schema è scattato: è solo confronto di modelli (pattern matching).',
        hint: 'Riprova la chat attivando «mostra le regole»: da dove viene ogni risposta?'
      },
      {
        case: 'Quali sono i due sottosistemi di un sistema esperto?',
        options: [
          'Una base di conoscenza (fatti e regole SE…ALLORA) e un motore inferenziale che le applica.',
          'Una tastiera e uno schermo.',
          'Un insieme di dati di addestramento e una rete neurale.',
          'Un compilatore e un interprete.'
        ],
        correct: 0,
        feedback: 'La conoscenza dell’esperto è scritta nelle regole; il motore inferenziale le applica ai fatti per arrivare a una conclusione.',
        hint: 'Ripensa al simulatore della diga: dove stavano le regole e chi le «faceva scattare»?'
      },
      {
        case: 'Nella simulazione del sistema esperto, la regola R3 dice: SE spostamento > 15 mm E livello > 90% ALLORA allarme. Con spostamento 18 mm e livello 70% che cosa succede?',
        options: ['R3 non scatta, perché la condizione sul livello è falsa', 'R3 scatta e segnala allarme', 'Il sistema va in errore', 'R3 scatta solo a metà'],
        correct: 0,
        feedback: 'Con E (AND) devono essere vere entrambe le condizioni.',
        hint: 'Una condizione con E è vera solo se lo sono tutte le sue parti.'
      },
      {
        case: 'Come giocava a scacchi Deep Blue, che nel 1997 batté Garri Kasparov?',
        options: [
          'Esplorando l’albero delle mosse possibili con un’enorme potenza di calcolo e un database di partite.',
          'Imparando da solo giocando contro sé stesso, come AlphaZero.',
          'Imitando lo stile di Kasparov.',
          'Scegliendo le mosse a caso.'
        ],
        correct: 0,
        feedback: 'Forza bruta più conoscenza scritta a mano; AlphaZero (2017-2018) invece ha imparato con il machine learning.',
        hint: 'Nel tris contro il computer hai visto il contatore delle posizioni esplorate: Deep Blue faceva la stessa cosa, molto più in grande.'
      },
      {
        case: 'Che cosa sono stati gli «inverni» dell’IA e che cosa ha favorito la ripresa?',
        options: [
          'Periodi di crisi e di finanziamenti prosciugati dopo previsioni troppo ottimistiche; la ripresa è legata alle GPU e ai big data.',
          'Periodi in cui i computer si guastavano per il freddo.',
          'Anni in cui l’IA è stata vietata per legge.',
          'Periodi di crescita rapida dovuti ai sistemi esperti.'
        ],
        correct: 0,
        feedback: 'Aspettative gonfiate, risultati lenti, fondi tagliati; poi calcolo parallelo economico (GPU) e montagne di dati.',
        hint: 'Rivedi la curva dell’entusiasmo e la simulazione del calcolo parallelo.'
      }
    ]
  },
  {
    n: 2, available: true, minutes: 60,
    title: 'La nuova epoca dei big data',
    short: 'Dai dati analogici ai big data: le unità di misura, le 5 V, la data analytics, i motori di ricerca, la visione artificiale e le correlazioni nascoste.',
    quiz: [
      {
        case: 'Che cosa si intende con «big data»?',
        options: [
          'Insiemi di dati così grandi, veloci e vari da non poter essere gestiti con i software tradizionali come i DBMS relazionali.',
          'Un database relazionale con più di mille righe.',
          'I file più grandi presenti su un computer.',
          'Un linguaggio di programmazione per l’IA.'
        ],
        correct: 0,
        feedback: 'Non è solo questione di dimensione: contano anche velocità e varietà, cioè le prime tre V.',
        hint: 'Ripensa alle 5 V e al motivo per cui i DBMS tradizionali non bastano.'
      },
      {
        case: 'Quanti gigabyte ci sono in 3 terabyte (prefissi del Sistema Internazionale)?',
        options: ['3000', '300', '3 000 000', '30'],
        correct: 0,
        feedback: 'Ogni gradino della scala moltiplica per 1000: 3 TB = 3 × 1000 GB.',
        hint: 'Sulla scala dei byte, quanti gradini separano GB e TB? Ognuno vale ×1000.'
      },
      {
        case: 'Una telecamera di sorveglianza invia immagini 25 volte al secondo, giorno e notte. Quale V descrive meglio questa caratteristica?',
        options: ['Velocità', 'Varietà', 'Veridicità', 'Valore'],
        correct: 0,
        feedback: 'La velocità riguarda la rapidità con cui i dati arrivano e devono essere elaborati.',
        hint: 'Il punto non è quanti dati né di che tipo, ma con quale ritmo arrivano.'
      },
      {
        case: 'Un’app raccoglie insieme testi, foto, posizioni GPS e registrazioni vocali. Quale V è più evidente?',
        options: ['Varietà', 'Volume', 'Velocità', 'Veridicità'],
        correct: 0,
        feedback: 'Dati di formati diversi, strutturati e non strutturati: varietà.',
        hint: 'Conta quanti formati diversi compaiono.'
      },
      {
        case: 'Che cosa riguarda la V di «veridicità»?',
        options: [
          'L’affidabilità dei dati: possono essere imprecisi, incompleti o falsi.',
          'La velocità di trasmissione.',
          'Lo spazio occupato su disco.',
          'Il prezzo dei dati sul mercato.'
        ],
        correct: 0,
        feedback: 'Recensioni false, sensori guasti, errori di battitura: prima di analizzare bisogna valutare quanto ci si può fidare.',
        hint: 'Veridicità viene da «vero».'
      },
      {
        case: 'Che cos’è la data analytics?',
        options: [
          'L’analisi dei dati per estrarne informazioni utili, scoprire correlazioni e fare previsioni.',
          'La raccolta di dati senza elaborarli.',
          'La cancellazione dei dati inutili.',
          'Un tipo di memoria di massa.'
        ],
        correct: 0,
        feedback: 'Dai dati grezzi alle informazioni: è il passaggio che dà valore ai big data.',
        hint: 'È il processo che trasforma i dati in informazioni.'
      },
      {
        case: 'Nella simulazione del motore di ricerca, perché i suggerimenti cambiano dopo «simula 1000 utenti»?',
        options: [
          'Perché i suggerimenti sono ordinati in base a quante volte ogni ricerca è stata fatta: più dati cambiano le frequenze.',
          'Perché il programma sceglie i suggerimenti a caso.',
          'Perché un programmatore li riscrive a mano.',
          'Perché il motore di ricerca capisce il significato delle parole.'
        ],
        correct: 0,
        feedback: 'È analisi automatica di big data: le ricerche passate di milioni di utenti guidano le risposte.',
        hint: 'Guarda il numero accanto a ogni suggerimento.'
      },
      {
        case: 'In una città, nei mesi in cui si vendono più gelati ci sono anche più scottature solari. Che cosa si può concludere?',
        options: [
          'Le due grandezze sono correlate, probabilmente per una causa comune (il caldo estivo), ma i gelati non causano le scottature.',
          'I gelati causano le scottature.',
          'Le scottature fanno venire voglia di gelato.',
          'I dati sono sicuramente sbagliati.'
        ],
        correct: 0,
        feedback: 'Correlazione non significa causalità: spesso c’è una terza variabile nascosta.',
        hint: 'Rivedi la simulazione delle correlazioni e la variabile nascosta.'
      },
      {
        case: 'Su che cosa si basa il riconoscimento automatico di oggetti e persone in foto e video?',
        options: [
          'Su software «addestrati» con enormi quantità di immagini già etichettate.',
          'Su regole scritte a mano per ogni possibile oggetto.',
          'Sul confronto pixel per pixel con una sola foto di riferimento.',
          'Sulla posizione GPS dello scatto.'
        ],
        correct: 0,
        feedback: 'È il ponte tra questa lezione e la prossima: i big data servono ad addestrare gli algoritmi di machine learning.',
        hint: 'Pensa alla parola «addestramento».'
      },
      {
        case: 'Perché l’esplosione dei big data ha dato nuovo impulso alla ricerca sull’IA?',
        options: [
          'Perché servono programmi capaci di analizzare in modo autonomo quantità di dati che nessun umano potrebbe esaminare.',
          'Perché i big data hanno reso inutili i computer.',
          'Perché i big data si possono analizzare solo a mano.',
          'Perché l’IA serve soltanto a comprimere i file.'
        ],
        correct: 0,
        feedback: 'Più dati che persone per guardarli: da qui il bisogno di algoritmi che apprendono.',
        hint: 'Chi può leggere zettabyte di dati?'
      }
    ]
  },
  {
    n: 3, available: true, minutes: 60,
    title: 'Estrarre informazioni dai dati: il machine learning',
    short: 'Apprendimento con e senza supervisione, training e test, classificazione e regressione, clustering, KNN, naive Bayes e alberi di decisione.',
    quiz: [
      {
        case: 'Che cosa caratterizza l’apprendimento con supervisione?',
        options: [
          'L’algoritmo viene addestrato con esempi di input di cui è nota la risposta corretta (output, o etichetta).',
          'L’algoritmo cerca da solo gruppi nei dati senza etichette.',
          'Un insegnante corregge il programma riga per riga.',
          'L’algoritmo non ha bisogno di dati.'
        ],
        correct: 0,
        feedback: 'Coppie (problema, soluzione): da queste l’algoritmo impara la funzione Y = f(X).',
        hint: 'Nella simulazione del classificatore, ogni punto di training aveva già il suo colore?'
      },
      {
        case: 'Un negozio online vuole dividere i clienti in gruppi con abitudini simili, senza sapere in anticipo quali gruppi esistano. Che tecnica usa?',
        options: ['Clustering (apprendimento senza supervisione)', 'Classificazione', 'Regressione', 'Sistema esperto'],
        correct: 0,
        feedback: 'Nessuna etichetta, gruppi da scoprire: è il compito del k-means che hai visto in azione.',
        hint: 'I gruppi sono noti prima oppure vanno scoperti?'
      },
      {
        case: 'Prevedere il prezzo di una casa (un numero) a partire da superficie e zona è un problema di…',
        options: ['regressione', 'classificazione', 'clustering', 'pattern matching'],
        correct: 0,
        feedback: 'La classificazione sceglie una categoria; la regressione stima un valore numerico.',
        hint: 'L’uscita è una categoria o un numero?'
      },
      {
        case: 'Perché, dopo il training, si valuta l’algoritmo su dati «mai visti prima»?',
        options: [
          'Per verificare che abbia imparato una regola generale e non abbia solo memorizzato gli esempi.',
          'Perché i dati di training vengono cancellati.',
          'Per renderlo più veloce.',
          'Non serve: basta l’accuratezza sui dati di training.'
        ],
        correct: 0,
        feedback: 'Un algoritmo che va benissimo sui dati di training e male su quelli nuovi ha «imparato a memoria» (overfitting).',
        hint: 'Nella simulazione, confronta l’accuratezza sul training e sul test.'
      },
      {
        case: 'Con l’algoritmo KNN e k = 3, i tre vicini più prossimi di un nuovo punto sono: gatto, cane, gatto. Come viene classificato?',
        options: ['Gatto', 'Cane', 'Non si può decidere', 'Dipende dal colore'],
        correct: 0,
        feedback: 'Vince la classe più frequente tra i k vicini: 2 gatti contro 1 cane.',
        hint: 'KNN fa votare i vicini.'
      },
      {
        case: 'Qual è uno svantaggio dell’algoritmo KNN citato nella lezione?',
        options: [
          'Usa come modello l’intero insieme di dati di training, quindi richiede molta memoria.',
          'Funziona solo con due esempi.',
          'Non può classificare punti nuovi.',
          'Richiede una rete neurale.'
        ],
        correct: 0,
        feedback: 'Per classificare un punto deve confrontarlo con tutti i punti memorizzati.',
        hint: 'Che cosa deve tenere in memoria KNN per calcolare le distanze?'
      },
      {
        case: 'Nel filtro antispam naive Bayes della simulazione, perché la parola «gratis» fa salire la probabilità di spam?',
        options: [
          'Perché negli esempi di training compare molto più spesso nei messaggi di spam che in quelli normali.',
          'Perché il programmatore ha scritto una regola su «gratis».',
          'Perché è una parola lunga.',
          'Perché compare all’inizio del messaggio.'
        ],
        correct: 0,
        feedback: 'Naive Bayes stima da quanto spesso ogni parola compare in ciascuna classe.',
        hint: 'Guarda la tabella delle frequenze delle parole.'
      },
      {
        case: 'Perché l’algoritmo naive Bayes si chiama «ingenuo» (naive)?',
        options: [
          'Perché assume che le caratteristiche (ad esempio le parole) siano indipendenti l’una dall’altra.',
          'Perché è stato scritto da principianti.',
          'Perché sbaglia sempre.',
          'Perché non usa probabilità.'
        ],
        correct: 0,
        feedback: 'Un’ipotesi semplificatrice spesso falsa, eppure il metodo funziona bene in molti casi reali.',
        hint: 'La moltiplicazione delle probabilità parola per parola presuppone qualcosa sulle parole: che cosa?'
      },
      {
        case: 'Nell’albero di decisione della lezione: è inverno, il cielo è nuvoloso e la temperatura è sotto 0 °C. Qual è la previsione?',
        options: ['Nevica', 'Non nevica', 'Piove', 'L’albero non può rispondere'],
        correct: 0,
        feedback: 'Si segue il percorso dalla radice: sì, sì, sì → foglia «nevica».',
        hint: 'Percorri l’albero rispondendo sì a tutte e tre le domande.'
      },
      {
        case: 'Perché gli algoritmi che costruiscono gli alberi di decisione sono detti «greedy» (avidi)?',
        options: [
          'Perché a ogni diramazione scelgono l’opzione migliore in quel momento, senza riconsiderare le scelte già fatte.',
          'Perché usano molta memoria.',
          'Perché sono molto lenti.',
          'Perché richiedono molti dati di test.'
        ],
        correct: 0,
        feedback: 'Una scelta locale ottima a ogni passo: veloce, ma non garantisce l’albero migliore in assoluto.',
        hint: 'Avido = prende subito ciò che sembra migliore.'
      }
    ]
  },
  {
    n: 4, available: true, minutes: 60,
    title: 'Le reti neurali: i concetti di base',
    short: 'Il neurone artificiale, pesi e bias, le funzioni di attivazione (gradino, sigmoide, ReLU), le reti multistrato, la backpropagation e la discesa del gradiente.',
    quiz: [
      {
        case: 'Un neurone ha input x₁ = 1, x₂ = 2, pesi w₁ = 0,5, w₂ = −1 e bias b = 1. Quanto vale la somma pesata z = w₁x₁ + w₂x₂ + b?',
        options: ['−0,5', '2,5', '0,5', '−1,5'],
        correct: 0,
        feedback: '0,5·1 + (−1)·2 + 1 = 0,5 − 2 + 1 = −0,5.',
        hint: 'Moltiplica ogni input per il suo peso, somma e aggiungi il bias.'
      },
      {
        case: 'Con la stessa somma pesata z = −0,5, quanto vale l’uscita di un neurone ReLU?',
        options: ['0', '−0,5', '0,5', '1'],
        correct: 0,
        feedback: 'ReLU(z) = max(0, z): per z negativo l’uscita è 0.',
        hint: 'Applica max(0, z).'
      },
      {
        case: 'Che cosa rappresenta il peso associato a un input del neurone?',
        options: ['L’importanza di quell’input nel determinare l’attivazione', 'Il numero di neuroni della rete', 'La velocità di apprendimento', 'L’uscita finale della rete'],
        correct: 0,
        feedback: 'Pesi grandi in valore assoluto rendono l’input influente; pesi negativi lo rendono «inibitorio».',
        hint: 'Nel simulatore del neurone, che cosa succede all’uscita se metti un peso a 0?'
      },
      {
        case: 'Quale funzione di attivazione usava il percettrone originale?',
        options: ['La funzione gradino: uscita 1 se z ≥ 0, altrimenti 0', 'La ReLU', 'La sigmoide', 'Nessuna funzione'],
        correct: 0,
        feedback: 'Il percettrone di Rosenblatt dava un’uscita tutto-o-niente.',
        hint: 'Nel grafico delle funzioni, quale è «a scalino»?'
      },
      {
        case: 'Perché un singolo percettrone non riesce a imparare la funzione XOR?',
        options: [
          'Perché separa i casi con una sola retta, e i casi di XOR non sono separabili da una retta.',
          'Perché ha troppi pesi.',
          'Perché XOR non ha input.',
          'Perché il bias è sempre zero.'
        ],
        correct: 0,
        feedback: 'Servono più neuroni organizzati in strati: è l’idea delle reti multistrato.',
        hint: 'Nella simulazione del percettrone, osserva la retta mentre provi XOR.'
      },
      {
        case: 'Che cosa si intende per deep learning?',
        options: [
          'Apprendimento con reti neurali con molti strati nascosti tra input e output.',
          'Apprendimento che richiede computer sottomarini.',
          'Un sistema esperto con molte regole.',
          'Apprendimento senza dati.'
        ],
        correct: 0,
        feedback: '«Profondo» si riferisce al numero di strati della rete.',
        hint: 'Rivedi la rete con strato di input, strato nascosto e strato di output.'
      },
      {
        case: 'Qual è il compito della backpropagation durante il training?',
        options: [
          'Aggiustare progressivamente i pesi delle connessioni per ridurre l’errore complessivo della rete.',
          'Aggiungere nuovi neuroni alla rete.',
          'Cancellare i dati di training sbagliati.',
          'Calcolare l’output partendo dagli input.'
        ],
        correct: 0,
        feedback: 'L’errore viene propagato all’indietro, dall’uscita verso l’ingresso, per capire come correggere ogni peso.',
        hint: 'Il calcolo in avanti è la propagazione; all’indietro va…?'
      },
      {
        case: 'Nella simulazione della discesa del gradiente, che cosa succede con un learning rate troppo grande?',
        options: [
          'I passi sono così ampi che la pallina scavalca il minimo, oscilla o si allontana.',
          'La pallina si ferma subito nel minimo.',
          'L’errore diventa sempre zero.',
          'Non cambia nulla.'
        ],
        correct: 0,
        feedback: 'Troppo piccolo: lentissimo. Troppo grande: instabile. Va scelto con cura.',
        hint: 'Riprova la simulazione con il learning rate al massimo.'
      },
      {
        case: 'Perché l’addestramento di una rete neurale è un problema di ottimizzazione?',
        options: [
          'Perché si cercano i valori dei pesi che rendono minima una funzione di errore.',
          'Perché si vuole rendere il codice più corto.',
          'Perché si cerca il computer più veloce.',
          'Perché si vuole massimizzare il numero di neuroni.'
        ],
        correct: 0,
        feedback: 'Minimizzare l’errore = trovare il fondo della «valle» della funzione di errore.',
        hint: 'Ricorda il grafico a forma di valle della funzione di errore.'
      },
      {
        case: 'Perché oggi nelle reti profonde si usa spesso la ReLU, f(z) = max(0, z)?',
        options: [
          'Perché è semplicissima da calcolare e, per z positivo, non «satura» come la sigmoide: l’addestramento procede bene.',
          'Perché la sua uscita è sempre compresa tra 0 e 1.',
          'Perché è l’unica funzione derivabile.',
          'Perché fa a meno dei pesi.'
        ],
        correct: 0,
        feedback: 'La sigmoide si appiattisce per z grandi e rallenta l’apprendimento; la ReLU no.',
        hint: 'Confronta le due curve per z grande: quale diventa piatta?'
      }
    ]
  }
];
