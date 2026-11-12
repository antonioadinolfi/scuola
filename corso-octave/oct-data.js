/* Corso Octave · dati del corso: lezioni (available: true pubblica la lezione), test ed esercizi.
   Le verifiche degli esercizi sono codice Octave eseguito dopo lo script dello studente, nello stesso workspace:
   superano se non generano errori. _OUTPUT contiene il testo mostrato nella Command Window, _CODE lo script. */
window.OCT_LESSONS = [
  {
    n: 1, available: true, minutes: 60,
    title: 'L’ambiente di lavoro: MATLAB e GNU Octave',
    short: 'Che cos’è il calcolo numerico. Software proprietario e software libero. Command Window, workspace, script .m e funzioni.',
    topics: ['calcolo numerico', 'MATLAB e Octave', 'Command Window', 'workspace', 'script e funzioni'],
    quiz: [
      {
        case: 'Che cosa si intende per calcolo numerico?',
        options: [
          'L’insieme dei metodi (algoritmi) che calcolano con il computer soluzioni approssimate, usando un numero finito di cifre.',
          'Il calcolo che si fa a mano con carta e penna, senza approssimazioni.',
          'Il calcolo simbolico, che manipola le formule e fornisce risultati esatti come √2.',
          'Il calcolo che usa solo numeri interi.'
        ],
        correct: 0,
        feedback: 'Il calcolo numerico rinuncia al risultato esatto in cambio di algoritmi veloci con un errore controllato.',
        hint: 'Pensa a che cosa mostra Octave per sqrt(2): un simbolo o un numero con un certo numero di cifre?'
      },
      {
        case: 'Che cosa mostra Octave e perché?',
        code: '0.1 + 0.2 == 0.3',
        options: [
          'ans = 0: 0.1 e 0.2 sono memorizzati in binario in modo approssimato e la somma differisce da 0.3 per circa 10⁻¹⁷.',
          'ans = 1: la somma è esattamente 0.3.',
          'ans = 0.3000.',
          'Un errore: == non si può usare con i numeri decimali.'
        ],
        correct: 0,
        feedback: 'In doppia precisione 0.1 non è rappresentabile esattamente: per confrontare numeri reali si usa una tolleranza, ad esempio abs(a - b) < 1e-12.',
        hint: 'Ricorda l’esempio di inizio lezione: anche sqrt(2)^2 - 2 non dava 0.'
      },
      {
        case: 'Qual è la differenza principale tra MATLAB e GNU Octave?',
        options: [
          'MATLAB è software proprietario con licenza a pagamento; Octave è software libero (licenza GNU GPL) e gratuito. Il linguaggio è in gran parte lo stesso.',
          'Octave usa un linguaggio completamente diverso da MATLAB.',
          'MATLAB lavora solo con numeri interi, Octave anche con le matrici.',
          'Octave funziona solo online, MATLAB solo installato sul computer.'
        ],
        correct: 0,
        feedback: 'La gran parte degli script scritti per MATLAB funziona anche in Octave: la differenza principale è la licenza.',
        hint: 'Rileggi la tabella di confronto: guarda le righe «Licenza» e «Linguaggio».'
      },
      {
        case: 'Che cosa garantisce una licenza di software libero come la GNU GPL?',
        options: [
          'La libertà di usare il programma, studiarne il codice sorgente, modificarlo e ridistribuirlo.',
          'Soltanto che il programma è gratuito.',
          'Che il programma non contiene errori.',
          'Che il programma può essere usato solo a scuola.'
        ],
        correct: 0,
        feedback: '«Libero» si riferisce alla libertà, non (solo) al prezzo: chiunque può leggere e migliorare il codice di Octave.',
        hint: 'Il software libero è definito da quattro libertà: quali?'
      },
      {
        case: 'Si esegue questo script. Che cosa compare nella Command Window?',
        code: 'a = 5;\nb = a * 2',
        options: ['Solo b = 10', 'a = 5 e poi b = 10', 'Niente', 'ans = 10'],
        correct: 0,
        feedback: 'Il punto e virgola finale esegue l’istruzione senza mostrarne il risultato; la seconda riga non lo ha.',
        hint: 'Quale delle due righe termina con il punto e virgola?'
      },
      {
        case: 'Dopo questi comandi, in quale variabile si trova il risultato 7?',
        code: 'x = 3;\ny = x + 1;\nx + y',
        options: ['ans', 'x', 'y', 'In nessuna: il risultato viene solo mostrato'],
        correct: 0,
        feedback: 'Quando un’espressione non viene assegnata a una variabile, Octave mette il risultato in ans (answer).',
        hint: 'L’ultima riga non contiene il segno =: dove finisce il risultato?'
      },
      {
        case: 'Quale di questi è un nome di variabile valido in Octave?',
        options: ['media_voti', '2voti', 'media voti', 'media-voti'],
        correct: 0,
        feedback: 'Un nome comincia con una lettera e contiene solo lettere, cifre e il trattino basso _.',
        hint: 'Gli spazi e il segno meno non sono ammessi, e il nome non può iniziare con una cifra.'
      },
      {
        case: 'Che cosa succede eseguendo questo script?',
        code: 'Raggio = 4;\narea = pi * raggio^2',
        options: [
          'Errore: \'raggio\' undefined, perché Octave distingue maiuscole e minuscole.',
          'Mostra area = 50.265.',
          'Mostra area = 0, perché raggio non ha valore.',
          'Errore di sintassi nella prima riga.'
        ],
        correct: 0,
        feedback: 'Raggio e raggio sono due nomi diversi: la variabile creata è Raggio, quella usata è raggio.',
        hint: 'Confronta lettera per lettera il nome nella prima e nella seconda riga.'
      },
      {
        case: 'Quale comando cancella tutte le variabili dal workspace?',
        options: ['clear', 'clc', 'who', 'close all'],
        correct: 0,
        feedback: 'clear cancella le variabili; clc pulisce solo la Command Window, who le elenca, close all chiude le finestre dei grafici.',
        hint: 'Uno dei comandi pulisce lo schermo ma lascia le variabili: non è quello giusto.'
      },
      {
        case: 'Dopo aver eseguito questo script, quali variabili ci sono nel workspace?',
        code: 'h = ipotenusa(3, 4);\n\nfunction c = ipotenusa(a, b)\n  c = sqrt(a^2 + b^2);\nend',
        options: ['Solo h', 'h, a, b e c', 'a, b e c', 'h e c'],
        correct: 0,
        feedback: 'Le variabili di una funzione (parametri e uscite) sono locali: esistono solo mentre la funzione è in esecuzione. Il risultato arriva nello script tramite h.',
        hint: 'Le variabili create dentro una funzione restano visibili dopo che la funzione è terminata?'
      }
    ]
  },
  {
    n: 2, available: true, minutes: 60,
    title: 'Sistemi lineari e operatore backslash',
    short: 'Matrici e vettori colonna in Octave, forma matriciale Ax = b, risoluzione con \\, verifica con il residuo, determinante e rango: sistemi determinati, impossibili e indeterminati.',
    topics: ['matrici e vettori colonna', 'forma matriciale Ax = b', 'operatore \\', 'residuo', 'det e rank'],
    quiz: [
      {
        case: 'Qual è la forma matriciale A x = b di questo sistema?',
        code: 'x + 2y = 5\n3x - y = 1',
        options: [
          'A = [1 2; 3 -1]   b = [5; 1]',
          'A = [1 3; 2 -1]   b = [5; 1]',
          'A = [1 2; 3 -1]   b = [5 1]',
          'A = [1 2 5; 3 -1 1]   b = [0; 0]'
        ],
        correct: 0,
        feedback: 'Ogni riga di A contiene i coefficienti di un’equazione, nell’ordine delle incognite; b è la colonna dei termini noti.',
        hint: 'La prima riga di A corrisponde alla prima equazione. E b deve essere una colonna o una riga?'
      },
      {
        case: 'Che cosa costruisce questa istruzione?',
        code: 'b = [5; 1; 7]',
        options: [
          'Un vettore colonna 3×1: il punto e virgola separa le righe.',
          'Un vettore riga 1×3.',
          'Tre variabili diverse.',
          'Un errore: dentro le parentesi quadre non si può usare il punto e virgola.'
        ],
        correct: 0,
        feedback: 'Nelle parentesi quadre lo spazio (o la virgola) separa gli elementi della stessa riga, il punto e virgola va a capo.',
        hint: 'Dentro [ ] il punto e virgola ha un significato diverso da quello che ha alla fine di una riga.'
      },
      {
        case: 'Che cosa contiene x?',
        code: 'A = [1 2; 3 -1];\nb = [5; 1];\nx = A \\ b',
        options: ['x = [1; 2]', 'x = [2; 1]', 'x = [5; 1]', 'Un errore: \\ non è un operatore'],
        correct: 0,
        feedback: 'x = 1, y = 2: infatti 1 + 2·2 = 5 e 3·1 − 2 = 1.',
        hint: 'Sostituisci le opzioni nelle due equazioni x + 2y = 5 e 3x − y = 1.'
      },
      {
        case: 'Perché per risolvere A x = b si preferisce x = A \\ b a x = inv(A) * b?',
        options: [
          'Perché \\ risolve il sistema senza calcolare l’inversa: è più veloce e in genere più preciso.',
          'Perché inv non esiste in Octave.',
          'Perché inv(A) * b dà sempre un risultato sbagliato.',
          'Non c’è nessuna differenza, nemmeno nel modo in cui vengono calcolati.'
        ],
        correct: 0,
        feedback: 'Il risultato è (quasi) lo stesso, ma \\ usa direttamente l’eliminazione di Gauss: meno operazioni e meno errori di arrotondamento.',
        hint: 'Pensa a quante operazioni servono per calcolare un’intera matrice inversa.'
      },
      {
        case: 'Dopo x = A \\ b si calcola il residuo. Che cosa significa il risultato?',
        code: 'r = A*x - b;\nnorm(r)\nans = 8.8818e-16',
        options: [
          'La soluzione è corretta: il residuo è dell’ordine degli errori di arrotondamento.',
          'La soluzione è sbagliata, perché il residuo non è esattamente 0.',
          'Il sistema è impossibile.',
          'La matrice A è singolare.'
        ],
        correct: 0,
        feedback: '10⁻¹⁶ è la precisione dei numeri in doppia precisione: un residuo così piccolo vuol dire che A·x coincide con b.',
        hint: 'Ricorda la Lezione 1: anche sqrt(2)^2 - 2 non dava esattamente 0.'
      },
      {
        case: 'Se det(A) = 0, che cosa si può dire del sistema A x = b (A quadrata)?',
        options: [
          'Non ha una e una sola soluzione: è impossibile oppure indeterminato.',
          'Ha sempre infinite soluzioni.',
          'Ha la soluzione x = 0.',
          'È impossibile in ogni caso.'
        ],
        correct: 0,
        feedback: 'Con det(A) = 0 la matrice è singolare: per distinguere impossibile e indeterminato si confrontano i ranghi (Rouché-Capelli).',
        hint: 'Una matrice con determinante nullo è invertibile?'
      },
      {
        case: 'Un sistema in 3 incognite ha rank(A) = 2 e rank([A b]) = 3. Com’è il sistema?',
        options: ['Impossibile', 'Determinato', 'Indeterminato', 'Non si può dire senza risolverlo'],
        correct: 0,
        feedback: 'Per il teorema di Rouché-Capelli il sistema ha soluzioni solo se i due ranghi sono uguali.',
        hint: 'Teorema di Rouché-Capelli: quando un sistema ammette soluzioni?'
      },
      {
        case: 'Octave risponde con questo errore. Qual è la causa più probabile?',
        code: 'x = A \\ b\nerror: operator \\: nonconformant arguments (op1 is 3x3, op2 is 1x3)',
        options: [
          'b è stato scritto come vettore riga: serve una colonna, [5; 1; 7] oppure b\'.',
          'A non è quadrata.',
          'Il sistema è impossibile.',
          'Bisogna usare / al posto di \\.'
        ],
        correct: 0,
        feedback: 'A ha 3 righe, quindi b deve averne 3: 3×1. Un vettore 1×3 non è compatibile.',
        hint: 'Leggi le dimensioni nel messaggio: op2 è b.'
      },
      {
        case: 'Il sistema ha incognite x, y, z. Quale riga di A corrisponde all’equazione 3x + 2y = 7?',
        options: ['[3 2 0]', '[3 2]', '[3 2 7]', '[0 3 2]'],
        correct: 0,
        feedback: 'Ogni riga deve avere un coefficiente per ogni incognita: z non compare, quindi il suo coefficiente è 0.',
        hint: 'Quante colonne ha A in un sistema in tre incognite?'
      },
      {
        case: 'Con una matrice singolare Octave stampa un avviso ma mostra comunque un vettore. Come va interpretato?',
        code: 'x = A \\ b\nwarning: matrix singular to machine precision\nx =\n   0.2000\n   0.4000',
        options: [
          'Non è «la» soluzione del sistema, che è impossibile o indeterminato: va letto l’avviso e controllato il residuo.',
          'È la soluzione unica del sistema: l’avviso si può ignorare.',
          'È un errore del programma: bisogna reinstallare Octave.',
          'Significa che il sistema ha esattamente due soluzioni.'
        ],
        correct: 0,
        feedback: 'Octave restituisce la soluzione «di minima norma» (MATLAB invece dà Inf o NaN): utile in casi particolari, ma non risponde alla domanda «qual è la soluzione?».',
        hint: 'Un sistema con matrice singolare può avere una sola soluzione?'
      }
    ]
  },
  { n: 3, available: false, minutes: 60, title: 'Operazioni matriciali e puntuali', short: 'Prodotto riga per colonna e operazioni elemento per elemento (.*, ./, .^). Trasposta, determinante, traccia e inversa; verifica di A·A⁻¹ = I.', topics: ['* e .*', './ e .^', 'trasposta', 'det, trace, inv'], quiz: [] },
  { n: 4, available: false, minutes: 60, title: 'Il metodo di Gauss', short: 'Eliminazione in avanti, pivot, sostituzione all’indietro. Righe e colonne di una matrice con A(i,:) e A(:,j), implementazione con i cicli for e confronto con \\.', topics: ['eliminazione', 'pivoting', 'sostituzione all’indietro', 'righe A(i,:)', 'algoritmo'], quiz: [] },
  { n: 5, available: false, minutes: 60, title: 'Il metodo di Gauss-Jordan', short: 'Riduzione completa a scala, confronto con Gauss, rref, calcolo dell’inversa con la matrice [A | I].', topics: ['riduzione completa', 'rref', 'inversa con [A|I]', 'confronto tra metodi'], quiz: [] },
  { n: 6, available: false, minutes: 60, title: 'Tipi di dato e operazioni', short: 'Scalari, vettori e matrici come tipi nativi. Precedenza degli operatori, numeri reali e complessi, funzioni matematiche predefinite.', topics: ['scalari, vettori, matrici', 'precedenza', 'numeri complessi', 'funzioni predefinite'], quiz: [] },
  { n: 7, available: false, minutes: 60, title: 'Creare e indicizzare vettori e matrici', short: 'Operatore due punti e linspace. Matrici speciali: eye, zeros, ones. Indici, end, righe, colonne e sottomatrici.', topics: ['colon operator', 'linspace', 'eye, zeros, ones', 'indicizzazione', 'sottomatrici'], quiz: [] },
  { n: 8, available: false, minutes: 60, title: 'Grafici 2D', short: 'La funzione plot, colori e tipi di linea, etichette degli assi, titolo, legenda e griglia.', topics: ['plot', 'stili di linea', 'xlabel, ylabel, title', 'legend, grid'], quiz: [] },
  { n: 9, available: false, minutes: 60, title: 'Più grafici e progetto finale', short: 'figure e hold on, sottografici con subplot. Progetto conclusivo e test finale del corso.', topics: ['figure', 'hold on', 'subplot', 'progetto', 'test finale'], quiz: [] }
];

window.OCT_EXERCISES = {
  'l1-e1': {
    checks: [
      { t: 'Le variabili g e t hanno i valori dati', c: "assert(exist('g', 'var') && exist('t', 'var'), 'mancano le variabili g e t');\nassert(g == 9.81 && t == 3, 'g vale %g e t vale %g', g, t);", h: 'Non modificare le prime due assegnazioni: cambia solo come terminano.' },
      { t: 'h contiene lo spazio percorso ½·g·t²', c: "assert(exist('h', 'var') == 1, 'manca la variabile h');\nassert(abs(h - 0.5 * 9.81 * 3^2) < 1e-9, 'h vale %g', h);", h: 'Togli il % davanti alla riga di h: il simbolo % trasforma la riga in un commento.' },
      { t: 'v contiene la velocità g·t', c: "assert(exist('v', 'var') == 1, 'manca la variabile v');\nassert(abs(v - 9.81 * 3) < 1e-9, 'v vale %g', v);", h: 'Togli il % davanti alla riga di v.' },
      { t: 'Nella Command Window compaiono solo h e v', c: "assert(~isempty(strfind(_OUTPUT, 'h =')) && ~isempty(strfind(_OUTPUT, 'v =')), 'h e v devono comparire: non terminare le loro righe con ;');\nassert(isempty(strfind(_OUTPUT, 'g =')) && isempty(strfind(_OUTPUT, 't =')), 'g e t compaiono ancora: termina le loro righe con ;');", h: 'Il punto e virgola alla fine di una riga esegue l’istruzione senza mostrarne il risultato.' }
    ],
    hints: [
      'Il simbolo % inizia un commento: Octave ignora tutto ciò che lo segue sulla riga. Per «attivare» una riga togli il %.',
      'Metti il punto e virgola alla fine delle righe di g e t; lascia senza punto e virgola quelle di h e v.',
      'Le formule: h = 1/2 * g * t^2 e v = g * t. L’elevamento a potenza si scrive con ^.'
    ],
    solution: `% Caduta libera: un sasso cade da fermo per t secondi.
% Mostra nella Command Window SOLO l'altezza h e la velocità v.
g = 9.81;     % accelerazione di gravità (m/s^2)
t = 3;        % tempo (s)

h = 1/2 * g * t^2

v = g * t
`
  },
  'l1-e2': {
    checks: [
      { t: 'Lo script viene eseguito senza errori', c: "assert(true);", h: 'Esegui lo script: il messaggio di errore indica la riga del primo problema.' },
      { t: 'ipotenusa vale 10', c: "assert(exist('ipotenusa', 'var') == 1, 'manca la variabile ipotenusa (tutta minuscola)');\nassert(abs(ipotenusa - 10) < 1e-12, 'ipotenusa vale %g', ipotenusa);", h: 'Ogni parentesi aperta va chiusa: sqrt( … ).' },
      { t: 'area vale 24', c: "assert(exist('area', 'var') == 1, 'manca la variabile area');\nassert(abs(area - 24) < 1e-12, 'area vale %g', area);", h: 'Octave non sottintende la moltiplicazione: tra due valori serve *.' },
      { t: 'perimetro vale 24', c: "assert(exist('perimetro', 'var') == 1, 'manca la variabile perimetro');\nassert(abs(perimetro - 24) < 1e-12, 'perimetro vale %g', perimetro);", h: 'Il nome della variabile deve essere scritto esattamente come quando l’hai creata, maiuscole comprese.' }
    ],
    hints: [
      'Primo errore (riga 5): conta le parentesi aperte e quelle chiuse.',
      'Secondo errore (riga 6): in matematica scrivi «a b» per il prodotto, in Octave serve a * b.',
      'Terzo errore (riga 7): la variabile si chiama ipotenusa, con la i minuscola.'
    ],
    solution: `% Triangolo rettangolo: cateti di 6 cm e 8 cm.
% Lo script contiene TRE errori: correggili uno alla volta.
cateto1 = 6;
cateto2 = 8;
ipotenusa = sqrt(cateto1^2 + cateto2^2);
area = cateto1 * cateto2 / 2
perimetro = cateto1 + cateto2 + ipotenusa
`
  },
  'l1-e3': {
    checks: [
      { t: 'Esiste la funzione volume_cilindro', c: "assert(exist('volume_cilindro') > 0, 'la funzione volume_cilindro non esiste');", h: 'La funzione è già dichiarata in fondo allo script: non cambiarne il nome.' },
      { t: 'volume_cilindro(1, 1) restituisce π', c: "w = volume_cilindro(1, 1);\nassert(abs(w - pi) < 1e-9, 'volume_cilindro(1, 1) restituisce %g invece di 3.1416', w);", h: 'Dentro la funzione assegna il risultato all’uscita v: v = pi * r^2 * h;' },
      { t: 'Funziona con altri valori: volume_cilindro(2, 5) = 20π', c: "w = volume_cilindro(2, 5);\nassert(abs(w - 20*pi) < 1e-9, 'volume_cilindro(2, 5) restituisce %g invece di 62.832', w);", h: 'Usa i parametri r e h nella formula, non i numeri della lattina.' },
      { t: 'lattina contiene il volume della lattina', c: "assert(exist('lattina', 'var') == 1, 'manca la variabile lattina');\nassert(abs(lattina - pi * 3.3^2 * 11.5) < 1e-6, 'lattina vale %g', lattina);", h: 'La prima riga dello script chiama già la funzione con 3.3 e 11.5: basta completare la funzione.' }
    ],
    hints: [
      'Il volume del cilindro è area di base per altezza: π r² h. In Octave π si scrive pi.',
      'Una funzione restituisce il valore che si trova nella variabile di uscita, qui v. Scrivi v = … dentro la funzione.',
      'Metti il punto e virgola alla riga dentro la funzione, altrimenti ogni chiamata mostra anche v = …'
    ],
    solution: `% Completa la funzione in fondo allo script, poi usala.
% Una lattina ha raggio 3.3 cm e altezza 11.5 cm.
lattina = volume_cilindro(3.3, 11.5)

function v = volume_cilindro(r, h)
  % calcola il volume del cilindro: area di base per altezza
  v = pi * r^2 * h;
end
`
  },
  'l1-e4': {
    checks: [
      { t: 'x approssima la radice di 10', c: "assert(exist('x', 'var') == 1, 'manca la variabile x');\nassert(abs(x^2 - 10) < 1e-10, 'x^2 vale %.15g, non abbastanza vicino a 10', x^2);", h: 'Ripeti l’aggiornamento x = (x + 10/x) / 2 finché la condizione del while è vera.' },
      { t: 'passi conta le iterazioni eseguite', c: "y = 1; n = 0;\nwhile abs(y^2 - 10) >= 1e-12\n  y = (y + 10/y) / 2;\n  n = n + 1;\nend\nassert(exist('passi', 'var') == 1, 'manca la variabile passi');\nassert(passi == n, 'passi vale %d, ma le iterazioni necessarie sono %d', passi, n);", h: 'Dentro il ciclo, a ogni giro, aumenta passi di 1: passi = passi + 1;' },
      { t: 'Usi un ciclo while e non la funzione sqrt', c: "assert(~isempty(strfind(_CODE, 'while')), 'usa un ciclo while');\nassert(isempty(regexp(_CODE, 'sqrt\\s*\\(', 'once')), 'non usare sqrt: lo scopo è calcolare la radice con un algoritmo');", h: 'Lo scopo dell’esercizio è ottenere la radice con l’algoritmo di Erone, senza la funzione predefinita.' }
    ],
    hints: [
      'La condizione del while dice quando continuare: finché l’errore è grande, cioè abs(x^2 - 10) >= 1e-12.',
      'Nel corpo del ciclo servono due istruzioni: x = (x + 10/x) / 2; e passi = passi + 1;',
      'Il ciclo while si chiude con end, come if e for.'
    ],
    solution: `% Radice quadrata di 10 con il metodo di Erone, senza usare sqrt.
% Ripeti x = (x + 10/x) / 2 finché |x^2 - 10| >= 1e-12
% e conta i passi nella variabile passi.
x = 1;
passi = 0;
while abs(x^2 - 10) >= 1e-12
  x = (x + 10/x) / 2;
  passi = passi + 1;
end
fprintf('radice di 10 = %.12f dopo %d passi\\n', x, passi);
`
  },
  'l2-e1': {
    checks: [
      { t: 'A è la matrice dei coefficienti (3×3)', c: "assert(exist('A', 'var') == 1, 'manca la variabile A');\nassert(isequal(size(A), [3 3]), 'A deve essere 3x3, invece è %dx%d', size(A, 1), size(A, 2));\nassert(isequal(A, [2 3 1; 1 1 2; 3 0 2]), 'controlla i coefficienti, nell''ordine cavi, adattatori, caricatori');", h: 'Una riga per equazione, una colonna per incognita. Nella terza equazione gli adattatori non compaiono: coefficiente 0.' },
      { t: 'b è il vettore colonna dei termini noti', c: "assert(exist('b', 'var') == 1, 'manca la variabile b');\nassert(isequal(size(b), [3 1]), 'b deve essere una colonna 3x1, invece è %dx%d', size(b, 1), size(b, 2));\nassert(isequal(b, [61; 53; 60]), 'controlla i termini noti');", h: 'Separa i termini noti con il punto e virgola: [61; 53; 60].' },
      { t: 'x contiene i tre prezzi', c: "assert(exist('x', 'var') == 1, 'manca la variabile x');\nassert(isequal(size(x), [3 1]) && norm(x - [8; 9; 18]) < 1e-9, 'x non è la soluzione del sistema');", h: 'Risolvi con x = A \\ b.' },
      { t: 'Hai usato l’operatore \\', c: "assert(~isempty(strfind(_CODE, '\\')), 'risolvi il sistema con l''operatore \\');", h: 'Il calcolo va fatto da Octave, non a mano.' }
    ],
    hints: [
      'Scrivi le equazioni con tutte e tre le incognite nello stesso ordine: 3c + 0a + 2k = 60.',
      'Prima riga di A: [2 3 1]. Seconda: [1 1 2]. La terza contiene uno 0.',
      'Poi b = [61; 53; 60] e x = A \\ b.'
    ],
    solution: `% Negozio di elettronica: c = cavo, a = adattatore, k = caricatore
%   2c + 3a +  k = 61
%    c +  a + 2k = 53
%   3c      + 2k = 60
A = [2 3 1; 1 1 2; 3 0 2];
b = [61; 53; 60];
x = A \\ b
`
  },
  'l2-e2': {
    checks: [
      { t: 'r è il residuo della proposta del compagno', c: "assert(exist('r', 'var') == 1, 'manca la variabile r');\nassert(isequal(size(r), [3 1]) && norm(r - (A*proposta - b)) < 1e-12, 'r deve valere A*proposta - b');", h: 'Il residuo è ciò che resta portando tutto a sinistra: r = A*proposta - b.' },
      { t: 'corretta dice se la proposta è giusta', c: "assert(exist('corretta', 'var') == 1, 'manca la variabile corretta');\nassert(islogical(corretta) && corretta == false, 'corretta deve essere il risultato del confronto norm(r) < 1e-10');", h: 'corretta = norm(r) < 1e-10 produce 1 (vero) o 0 (falso).' },
      { t: 'x è la soluzione calcolata con \\', c: "assert(exist('x', 'var') == 1, 'manca la variabile x');\nassert(isequal(size(x), [3 1]) && norm(A*x - b) < 1e-12, 'x non risolve il sistema');", h: 'x = A \\ b.' },
      { t: 'errore è la norma del residuo di x', c: "assert(exist('errore', 'var') == 1, 'manca la variabile errore');\nassert(abs(errore - norm(A*x - b)) < 1e-15 && errore < 1e-12, 'errore deve valere norm(A*x - b)');", h: 'Stessa formula del residuo, con x al posto della proposta, poi norm(…).' }
    ],
    hints: [
      'Il residuo di un vettore v è A*v - b: se v è la soluzione, è (quasi) il vettore nullo.',
      'norm(r) riassume il residuo in un solo numero, la sua lunghezza. Per decidere usa una tolleranza: norm(r) < 1e-10.',
      'Ordine: r, corretta, poi x = A \\ b ed errore = norm(A*x - b).'
    ],
    solution: `% Un compagno dice che la soluzione del sistema è [1; 2; 3]. Verifica!
A = [4 -1 0; -1 4 -1; 0 -1 4];
b = [2; 4; 11];
proposta = [1; 2; 3];

r = A*proposta - b
corretta = norm(r) < 1e-10

x = A \\ b
errore = norm(A*x - b)
`
  },
  'l2-e3': {
    checks: [
      { t: 'Lo script viene eseguito senza errori', c: "assert(true);", h: 'Esegui: il messaggio indica la riga del primo problema.' },
      { t: 'A è 3×3 con lo zero al posto giusto', c: "assert(isequal(A, [1 1 1; 2 -1 0; 0 3 1]), 'A non è corretta: nella seconda equazione z non compare');", h: 'Nella seconda equazione z non compare: il suo coefficiente è 0.' },
      { t: 'b è una colonna', c: "assert(isequal(b, [6; 0; 9]), 'b deve essere la colonna [6; 0; 9]');", h: 'Separa i termini noti con il punto e virgola.' },
      { t: 'x = [1; 2; 3]', c: "assert(exist('x', 'var') == 1 && isequal(size(x), [3 1]) && norm(x - [1; 2; 3]) < 1e-12, 'x non è la soluzione');", h: 'Per A x = b si usa la divisione a sinistra: \\.' }
    ],
    hints: [
      'Primo errore (riga 6): ogni riga di A deve avere tre numeri, uno per incognita.',
      'Secondo errore (riga 7): i termini noti formano una colonna.',
      'Terzo errore (riga 8): A / b non risolve A x = b; serve A \\ b.'
    ],
    solution: `% Sistema:
%    x +  y + z = 6
%   2x -  y     = 0
%        3y + z = 9
% Lo script contiene TRE errori: correggili uno alla volta.
A = [1 1 1; 2 -1 0; 0 3 1];
b = [6; 0; 9];
x = A \\ b
`
  },
  'l2-e4': {
    checks: [
      { t: 'Esiste la funzione classifica', c: "assert(exist('classifica') > 0, 'la funzione classifica non esiste');", h: 'La funzione è dichiarata in fondo allo script.' },
      { t: 'Riconosce un sistema determinato', c: "t = classifica([2 1; 1 3], [3; 5]);\nassert(ischar(t) && strcmp(t, 'determinato'), 'per A = [2 1; 1 3] la risposta deve essere determinato');", h: 'Determinato: rank(A) = rank([A b]) = numero di incognite, cioè size(A, 2).' },
      { t: 'Riconosce un sistema impossibile', c: "t = classifica([1 2; 2 4], [1; 3]);\nassert(ischar(t) && strcmp(t, 'impossibile'), 'per A = [1 2; 2 4] e b = [1; 3] la risposta deve essere impossibile');", h: 'Impossibile: rank(A) < rank([A b]).' },
      { t: 'Riconosce un sistema indeterminato', c: "t = classifica([1 2; 2 4], [1; 2]);\nassert(ischar(t) && strcmp(t, 'indeterminato'), 'per A = [1 2; 2 4] e b = [1; 2] la risposta deve essere indeterminato');", h: 'Indeterminato: i ranghi sono uguali ma minori del numero di incognite.' },
      { t: 'Classifica i tre sistemi dell’esercitazione Excel', c: "assert(exist('t1', 'var') && exist('t2', 'var') && exist('t3', 'var'), 'mancano t1, t2, t3');\nassert(strcmp(t1, 'determinato') && strcmp(t2, 'indeterminato') && strcmp(t3, 'impossibile'), 't1, t2, t3 non sono corretti: hai completato la funzione?');", h: 'Le righe all’inizio dello script chiamano già la funzione: basta completarla.' },
      { t: 'Usi rank', c: "assert(~isempty(strfind(_CODE, 'rank')), 'usa rank per confrontare i ranghi');", h: 'Il determinante dice solo se la soluzione è unica, non distingue impossibile e indeterminato.' }
    ],
    hints: [
      'Calcola tre numeri: rA = rank(A), rAb = rank([A b]) e n = size(A, 2), il numero di incognite.',
      'Se rA < rAb il sistema è impossibile; altrimenti, se rA == n è determinato, se no è indeterminato.',
      'Restituisci un testo tra apici, ad esempio tipo = \'impossibile\';'
    ],
    solution: `% Classifica un sistema con il teorema di Rouché-Capelli
A = [2 1 -1 3; 1 -2 3 -1; 3 1 2 -2; -1 3 1 2];   % sistema dell'esercitazione Excel
S = [2 1 -1 3; 1 -2 3 -1; 3 1 2 -2; 3 -1 2 2];    % riga 4 = riga 1 + riga 2
t1 = classifica(A, [3; 12; 9; 0])
t2 = classifica(S, [3; 12; 9; 15])
t3 = classifica(S, [3; 12; 9; 10])

function tipo = classifica(A, b)
  rA = rank(A);
  rAb = rank([A b]);
  n = size(A, 2);        % numero di incognite
  if rA < rAb
    tipo = 'impossibile';
  elseif rA == n
    tipo = 'determinato';
  else
    tipo = 'indeterminato';
  end
end
`
  }
};
