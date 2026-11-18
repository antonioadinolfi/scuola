/* Corso Introduzione a Python · dati delle lezioni, test di fine lezione ed esercizi di codice.
   Test: `correct` è l'indice (da 0) dell'opzione esatta; le opzioni vengono mescolate a video.
   Esercizi di codice: ogni verifica `c` è codice Python eseguito dopo il programma dello studente.
   Nelle verifiche sono disponibili: _OUTPUT (output con l'input della casella), _SRC (codice dello studente),
   _run(['valore1', 'valore2']) che riesegue il programma con quegli input e restituisce l'output. */
"use strict";
window.PYB_LESSONS = [
  {
    n: 1, available: true, minutes: 60,
    title: 'Python, un linguaggio per tutti',
    short: 'Che cos’è Python: interpretato, di alto livello, multipiattaforma, open source. Shell ed editor di IDLE, la funzione print().',
    quiz: [
      { case: 'Che cosa significa che Python è un linguaggio interpretato?', options: ['Un programma, l’interprete, legge ed esegue il codice istruzione per istruzione, senza produrre prima un file eseguibile.', 'Il codice viene tradotto tutto in linguaggio macchina prima di essere eseguito.', 'Il codice può essere letto solo da un interprete umano.', 'Python funziona solo con una connessione Internet.'], correct: 0, feedback: 'Per questo un errore alla riga 3 compare solo quando l’esecuzione arriva alla riga 3.', hint: 'Ripensa all’animazione «compilatore o interprete».' },
      { case: 'Python è un linguaggio «di alto livello». Che cosa vuol dire?', options: ['È vicino al modo di ragionare umano e nasconde i dettagli dell’hardware.', 'Si usa solo per programmi molto difficili.', 'È più veloce del linguaggio macchina.', 'Funziona solo sui computer più potenti.'], correct: 0, feedback: 'Scrivi print("Ciao") e non devi sapere nulla di registri o indirizzi di memoria.', hint: 'Alto livello = lontano dalla macchina, vicino alle persone.' },
      { case: 'Python è multipiattaforma. Che cosa significa?', options: ['Lo stesso programma funziona su Windows, macOS, Linux e altri sistemi.', 'Si può programmare in più persone insieme.', 'Permette di usare più paradigmi di programmazione.', 'Funziona sia su smartphone sia su televisori, ma non sui computer.'], correct: 0, feedback: 'Basta installare l’interprete adatto al proprio sistema operativo.', hint: 'Piattaforma = sistema operativo.' },
      { case: 'Python è multi-paradigma. Che cosa significa?', options: ['Permette di programmare in stili diversi, ad esempio procedurale e a oggetti.', 'Funziona su sistemi operativi diversi.', 'Ha molte versioni diverse.', 'Si può scrivere in più lingue, come l’italiano.'], correct: 0, feedback: 'In quarta userai la programmazione a oggetti, sempre in Python.', hint: 'Paradigma = modo di impostare un programma.' },
      { case: 'Chi ha scritto il primo interprete di Python, e quando?', options: ['Guido van Rossum, a partire dal 1989', 'Alan Turing, nel 1950', 'Bill Gates, nel 1975', 'Linus Torvalds, nel 1991'], correct: 0, feedback: 'Lo ha cominciato a fine 1989; la prima versione pubblica è del 1991.', hint: 'Guarda la carta d’identità di Python.' },
      { case: 'Che cosa significa che Python è open source?', options: ['Il codice sorgente dell’interprete è pubblico e si può usare, studiare e modificare liberamente.', 'Python funziona solo su Internet.', 'Chiunque può modificare i tuoi programmi.', 'Si paga solo per uso commerciale.'], correct: 0, feedback: 'Python è gratuito e sviluppato da una grande comunità.', hint: 'Source = codice sorgente; open = aperto.' },
      { case: 'In IDLE, qual è la differenza tra la Shell e l’editor?', options: ['Nella Shell (>>>) si esegue un comando alla volta e si vede subito il risultato; nell’editor si scrive un programma completo, si salva in un file .py e si esegue tutto insieme.', 'Sono la stessa cosa con colori diversi.', 'La Shell serve solo a salvare i file.', 'Nell’editor non si possono scrivere più righe.'], correct: 0, feedback: 'Shell per provare al volo; editor per i programmi veri.', hint: 'Ripensa alla shell >>> che hai usato nella lezione.' },
      { case: 'Che cosa visualizza print("5 * 7")?', options: ['5 * 7', '35', '"5 * 7"', 'Un errore'], correct: 0, feedback: 'Tra virgolette c’è un testo (stringa): print lo mostra così com’è, senza calcolare.', hint: 'Le virgolette trasformano tutto in testo.' },
      { case: 'Che cosa visualizza print("Ciao", "mondo", 2026)?', options: ['Ciao mondo 2026', 'Ciaomondo2026', 'Ciao, mondo, 2026', '"Ciao" "mondo" 2026'], correct: 0, feedback: 'Gli argomenti separati da virgole vengono stampati separati da uno spazio.', hint: 'La virgola tra gli argomenti di print diventa uno spazio.' },
      { case: 'Con quale programma si può scrivere il codice Python?', options: ['Con un editor di testo non formattato oppure con un ambiente di sviluppo come IDLE.', 'Solo con Microsoft Word.', 'Solo con un programma a pagamento.', 'Solo con il prompt dei comandi di Windows.'], correct: 0, feedback: 'Word aggiunge formattazione e virgolette «curve» che Python non capisce: serve testo semplice.', hint: 'Il codice deve essere testo semplice.' }
    ]
  },
  {
    n: 2, available: true, minutes: 60,
    title: 'Variabili, tipi di dato e input',
    short: 'Variabili e assegnazione, i tipi int, float, str e bool, type(), tipizzazione dinamica, case-sensitive, input() e conversione dei dati.',
    quiz: [
      { case: 'Di che tipo è il valore 17.0?', options: ['float', 'int', 'str', 'bool'], correct: 0, feedback: 'Il punto decimale lo rende un numero decimale (float), anche se la parte decimale è zero.', hint: 'Guarda il punto.' },
      { case: 'Di che tipo è il valore "17"?', options: ['str', 'int', 'float', 'bool'], correct: 0, feedback: 'Le virgolette lo rendono una stringa: è il testo formato dai caratteri 1 e 7.', hint: 'Guarda le virgolette.' },
      { case: 'Dopo le istruzioni x = 10 e poi x = "dieci", che cosa succede?', options: ['x ora contiene la stringa "dieci": in Python una variabile può cambiare tipo durante l’esecuzione.', 'Errore: x era un int e non può diventare una stringa.', 'x contiene sia 10 sia "dieci".', 'x vale 10, perché la prima assegnazione vince.'], correct: 0, feedback: 'Il tipo appartiene al valore, non alla variabile: lo si vede nel visualizzatore passo passo.', hint: 'Ripensa all’esempio nel visualizzatore passo passo.' },
      { case: 'Python è case-sensitive. Quale conseguenza ha?', options: ['nome, Nome e NOME sono tre variabili diverse.', 'Le variabili non possono contenere lettere maiuscole.', 'print e Print sono la stessa funzione.', 'Si possono usare solo lettere minuscole nelle stringhe.'], correct: 0, feedback: 'Anche Print("ciao") dà errore: la funzione si chiama print.', hint: 'Case = maiuscolo/minuscolo.' },
      { case: 'Di che tipo è sempre il valore restituito da input()?', options: ['str', 'int', 'float', 'dipende da che cosa scrive l’utente'], correct: 0, feedback: 'Anche se l’utente digita 42, input() restituisce la stringa "42".', hint: 'Ricorda la regola d’oro di input().' },
      { case: 'Il programma esegue a = input() e b = input(); l’utente scrive 4 e poi 5. Che cosa stampa print(a + b)?', options: ['45', '9', '4 5', 'Un errore'], correct: 0, feedback: 'Sono due stringhe: + le concatena. Per sommarle bisogna convertirle con int().', hint: 'Di che tipo sono a e b?' },
      { case: 'Quale istruzione legge un numero decimale come 4.7 da tastiera in modo da poterlo usare nei calcoli?', options: ['base = float(input("base: "))', 'base = input(float("base: "))', 'base = int(input("base: "))', 'base = input("base: ")'], correct: 0, feedback: 'Prima input() legge il testo, poi float() lo converte. int("4.7") darebbe errore.', hint: 'La conversione avvolge input().' },
      { case: 'Che cosa succede con int("4.7")?', options: ['Errore ValueError: la stringa non rappresenta un numero intero.', 'Restituisce 4', 'Restituisce 5', 'Restituisce 4.7'], correct: 0, feedback: 'int() su una stringa accetta solo cifre intere. Attenzione: int(4.7), con un float, invece funziona e dà 4.', hint: 'Prova nel laboratorio delle conversioni.' },
      { case: 'Che cosa restituisce type(False)?', options: ["<class 'bool'>", "<class 'str'>", "<class 'int'>", 'False'], correct: 0, feedback: 'True e False, senza virgolette, sono i due valori del tipo bool.', hint: 'False senza virgolette non è un testo.' },
      { case: 'Quando l’interprete di Python stabilisce il tipo di un dato?', options: ['A runtime, cioè durante l’esecuzione, guardando il valore', 'Quando si salva il file', 'Quando il programmatore lo dichiara con una parola chiave', 'Mai: Python non ha tipi'], correct: 0, feedback: 'In Python non si dichiarano i tipi: l’interprete li riconosce mentre esegue.', hint: 'Runtime = durante l’esecuzione.' }
    ]
  },
  {
    n: 3, available: true, minutes: 60,
    title: 'Operatori e output formattato',
    short: 'Operatori aritmetici (/, //, %, **), precedenza, concatenamento e ripetizione di stringhe, tripli apici, sep ed end, caratteri di escape, format() e f-string.',
    quiz: [
      { case: 'Quanto vale 17 // 5?', options: ['3', '3.4', '2', '4'], correct: 0, feedback: '// è la divisione intera: quante volte il 5 sta tutto intero nel 17.', hint: 'Ricorda le caramelle divise tra gli amici.' },
      { case: 'Quanto vale 17 % 5?', options: ['2', '3', '3.4', '0.4'], correct: 0, feedback: '% è il modulo, cioè il resto della divisione intera: 17 = 5·3 + 2.', hint: 'Quante caramelle avanzano?' },
      { case: 'Quanto vale 6 / 3 in Python 3?', options: ['2.0', '2', '3', '0.5'], correct: 0, feedback: 'L’operatore / restituisce sempre un float, anche tra interi e anche quando la divisione è esatta.', hint: 'Guarda il tipo del risultato nella calcolatrice degli operatori.' },
      { case: 'Quanto vale 2 ** 3?', options: ['8', '6', '9', '5'], correct: 0, feedback: '** è l’elevamento a potenza: 2³ = 8.', hint: 'Due asterischi = potenza.' },
      { case: 'Quanto vale 2 + 3 * 4?', options: ['14', '20', '24', '9'], correct: 0, feedback: 'La moltiplicazione ha la precedenza sull’addizione, come in matematica.', hint: 'Usa il simulatore della precedenza.' },
      { case: 'Che cosa produce "meta" + "linguaggio"?', options: ['metalinguaggio', 'meta linguaggio', 'Un errore', '"meta" "linguaggio"'], correct: 0, feedback: 'Con le stringhe + è l’operatore di concatenamento: unisce senza aggiungere spazi.', hint: 'Concatenare = attaccare.' },
      { case: 'Che cosa produce "ab" * 3?', options: ['ababab', 'ab3', 'Un errore', 'ab ab ab'], correct: 0, feedback: 'Con una stringa e un intero, * è l’operatore di ripetizione.', hint: 'Ripetizione.' },
      { case: 'Che cosa stampa print(19, 5, 2021, sep="/")?', options: ['19/5/2021', '19 5 2021', '19/ 5/ 2021', '/19/5/2021/'], correct: 0, feedback: 'sep sostituisce lo spazio che print mette tra un argomento e l’altro.', hint: 'Prova nel costruttore di print.' },
      { case: 'Che cosa fa il carattere di escape \\n dentro una stringa?', options: ['Va a capo', 'Inserisce una tabulazione', 'Stampa la lettera n', 'Termina il programma'], correct: 0, feedback: '\\n = new line, a capo; \\t = tabulazione.', hint: 'n come new line.' },
      { case: 'Che cosa restituisce format(3.14159, ".2f")?', options: ["'3.14'", "'3.15'", "'3.14159'", "'  3.14'"], correct: 0, feedback: '.2f significa: numero decimale con 2 cifre dopo la virgola, arrotondato.', hint: 'f = fixed, .2 = due decimali.' }
    ]
  },
  {
    n: 4, available: true, minutes: 60,
    title: 'Le strutture condizionali',
    short: 'if…else e indentazione, operatori relazionali (==, !=, <, >, <=, >=) e logici (and, or, not), condizioni annidate ed elif.',
    quiz: [
      { case: 'Come riconosce Python quali istruzioni fanno parte del blocco di un if?', options: ['Dall’indentazione: le istruzioni del blocco sono rientrate tutte dello stesso numero di spazi.', 'Dalle parentesi graffe { }', 'Dalla parola end alla fine del blocco', 'Dal punto e virgola'], correct: 0, feedback: 'In Python il rientro non è estetica: fa parte della sintassi.', hint: 'Ricorda i blocchi colorati del diagramma.' },
      { case: 'Quale riga è scritta correttamente?', options: ['if x == 5:', 'if x = 5:', 'if x == 5', 'if (x == 5) then:'], correct: 0, feedback: 'Il confronto usa == (doppio uguale) e la riga termina con i due punti.', hint: 'Due dettagli: il confronto e la fine della riga.' },
      { case: 'Che cosa significa l’operatore !=?', options: ['diverso da', 'uguale a', 'non maggiore di', 'assegnazione negata'], correct: 0, feedback: 'divisore != 0 è vera quando il divisore non vale zero.', hint: '! = non.' },
      { case: 'Con x = 7, quanto vale x > 5 and x < 10?', options: ['True', 'False', '7', 'Errore'], correct: 0, feedback: 'and è vera solo se entrambe le condizioni sono vere: 7 > 5 sì, 7 < 10 sì.', hint: 'Controlla le due condizioni separatamente.' },
      { case: 'Con x = 7, quanto vale x < 0 or x > 100?', options: ['False', 'True', '7', 'Errore'], correct: 0, feedback: 'or è vera se almeno una condizione è vera: qui nessuna lo è.', hint: 'Basta che una sia vera… è così?' },
      { case: 'Quanto vale not (3 == 3)?', options: ['False', 'True', '3', 'Errore'], correct: 0, feedback: '3 == 3 è True; not la rovescia in False.', hint: 'not inverte.' },
      { case: 'Quando si può usare elif al posto di if annidati?', options: ['Quando le condizioni sono mutuamente esclusive: al massimo una può essere vera.', 'Mai: elif non esiste in Python.', 'Solo quando ci sono esattamente due casi.', 'Solo dentro un ciclo.'], correct: 0, feedback: 'Python controlla le condizioni in ordine ed esegue solo il primo blocco con condizione vera.', hint: 'Ripensa al menu della calcolatrice della slide.' },
      { case: 'voto = 9. Quale giudizio stampa questo codice?\nif voto >= 6: print("sufficiente")\nelif voto >= 9: print("ottimo")', options: ['sufficiente', 'ottimo', 'sufficiente e ottimo', 'nulla'], correct: 0, feedback: 'La prima condizione vera vince e le altre non vengono controllate: l’ordine delle condizioni conta. Il caso più restrittivo va messo prima.', hint: 'elif viene controllato solo se le condizioni precedenti sono false.' },
      { case: 'Che cosa succede se else non è allineato con il suo if?', options: ['Errore di sintassi o di indentazione', 'Funziona lo stesso', 'Viene eseguito sempre', 'Viene ignorato'], correct: 0, feedback: 'if ed else devono avere lo stesso allineamento.', hint: 'Prova nell’esercizio «trova l’errore».' },
      { case: 'Nel programma della slide 9, perché si controlla divisore != 0 prima di dividere?', options: ['Per evitare l’errore di divisione per zero, che interromperebbe il programma.', 'Perché Python non sa dividere per i numeri negativi.', 'Per rendere il programma più veloce.', 'Perché è obbligatorio dopo ogni input().'], correct: 0, feedback: 'È un uso tipico di if: controllare i dati prima di usarli.', hint: 'Che cosa succede dividendo per zero?' }
    ]
  }
];

const NUMS = String.raw`import re
def _nums(o):
    return [float(x) for x in re.findall(r'-?\d+(?:\.\d+)?', o)]
def _ultima(o):
    righe = [r.strip() for r in o.strip().split('\n') if r.strip()]
    return righe[-1].lower() if righe else ''
`;

window.PYB_EXERCISES = {
  'l1-e2': {
    checks: [
      { t: 'La prima riga è esattamente «Ciao, mondo!»', c: `righe = _OUTPUT.split(chr(10))\nassert righe[0] == 'Ciao, mondo!', 'la prima riga è ' + repr(righe[0])`, h: 'Controlla la virgola, lo spazio e il punto esclamativo: print("Ciao, mondo!")' },
      { t: 'La seconda riga è «Sto imparando Python.»', c: `righe = _OUTPUT.split(chr(10))\nassert len(righe) > 1 and righe[1] == 'Sto imparando Python.', 'la seconda riga è ' + repr(righe[1] if len(righe) > 1 else '(mancante)')`, h: 'Serve un secondo print, con P maiuscola e il punto finale.' },
      { t: 'La terza riga è «5 * 7 = 35»', c: `righe = _OUTPUT.split(chr(10))\nassert len(righe) > 2 and righe[2] == '5 * 7 = 35', 'la terza riga è ' + repr(righe[2] if len(righe) > 2 else '(mancante)')`, h: 'Usa due argomenti separati da una virgola: il testo "5 * 7 =" e il calcolo 5 * 7.' },
      { t: 'Il 35 è calcolato da Python, non scritto a mano', c: `assert '35' not in _SRC, 'nel codice compare il numero 35: fallo calcolare a Python con 5 * 7'`, h: 'print("5 * 7 =", 5 * 7): il secondo argomento non ha virgolette, quindi viene calcolato.' }
    ],
    hints: ['Ogni print() stampa una riga. Ti servono tre print().', 'Per la terza riga: print("5 * 7 =", 5 * 7). Il testo tra virgolette resta com’è, l’espressione senza virgolette viene calcolata.', 'La virgola tra gli argomenti di print diventa uno spazio nell’output.'],
    solution: `print("Ciao, mondo!")
print("Sto imparando Python.")
print("5 * 7 =", 5 * 7)
`
  },
  'l1-e3': {
    checks: [
      { t: 'Stampa i secondi in un giorno (86400)', c: NUMS + `assert 86400 in _nums(_OUTPUT), 'nell’output non trovo 86400'`, h: 'Un giorno = 24 ore, un’ora = 60 minuti, un minuto = 60 secondi.' },
      { t: 'Stampa i secondi in una settimana (604800)', c: NUMS + `assert 604800 in _nums(_OUTPUT), 'nell’output non trovo 604800'`, h: 'Una settimana sono 7 giorni: moltiplica anche per 7.' },
      { t: 'I risultati sono calcolati da Python', c: `assert '86400' not in _SRC and '604800' not in _SRC, 'hai scritto i risultati a mano: scrivi le moltiplicazioni'`, h: 'Scrivi le moltiplicazioni (24 * 60 * 60) e lascia che sia Python a calcolare.' }
    ],
    hints: ['print("Secondi in un giorno:", 24 * 60 * 60)', 'Per la settimana moltiplica ancora per 7.'],
    solution: `print("Secondi in un giorno:", 24 * 60 * 60)
print("Secondi in una settimana:", 7 * 24 * 60 * 60)
`
  },
  'l2-e2': {
    checks: [
      { t: 'Legge il nome e lo usa nel saluto', c: `o = _run(['Anna', '2010'])\nassert 'Anna' in o, "con il nome Anna l'output è " + repr(o)`, h: 'Salva il nome in una variabile: nome = input("Come ti chiami? ")' },
      { t: 'Con nascita 2010 calcola 16 anni', c: NUMS + `o = _run(['Anna', '2010'])\nassert 16 in _nums(o), "con 2010 l'output è " + repr(o)`, h: 'L’età è 2026 meno l’anno di nascita: ricordati di convertire l’anno con int().' },
      { t: 'Funziona anche con altri dati (Luca, 2011 → 15)', c: NUMS + `o = _run(['Luca', '2011'])\nassert 'Luca' in o and 15 in _nums(o), "con Luca e 2011 l'output è " + repr(o)`, h: 'Il calcolo deve usare la variabile, non un numero scritto a mano.' },
      { t: 'Usa int() per convertire l’anno', c: `assert 'int(' in _SRC, 'non trovo int( nel codice'`, h: 'anno = int(input("In che anno sei nato? "))' }
    ],
    hints: ['Ti servono due input(): uno per il nome, uno per l’anno di nascita.', 'input() restituisce sempre una stringa: per fare la sottrazione converti l’anno con int().', 'print("Ciao", nome + ", nel 2026 compi", 2026 - anno, "anni")'],
    solution: `nome = input("Come ti chiami? ")
anno = int(input("In che anno sei nato? "))
eta = 2026 - anno
print("Ciao", nome + ", nel 2026 compi", eta, "anni")
`
  },
  'l2-e3': {
    checks: [
      { t: 'Con base 3 e altezza 4.5 stampa area 13.5', c: NUMS + `o = _run(['3', '4.5'])\nassert any(abs(x - 13.5) < 1e-6 for x in _nums(o)), "con 3 e 4.5 l'output è " + repr(o)`, h: 'L’area è base * altezza. I valori vanno convertiti con float().' },
      { t: 'Con base 3 e altezza 4.5 stampa perimetro 15', c: NUMS + `o = _run(['3', '4.5'])\nassert any(abs(x - 15) < 1e-6 for x in _nums(o)), "con 3 e 4.5 l'output è " + repr(o)`, h: 'Il perimetro è 2 * (base + altezza): attenzione alle parentesi.' },
      { t: 'Accetta numeri decimali (4.7 e 5.2)', c: NUMS + `o = _run(['4.7', '5.2'])\nassert any(abs(x - 24.44) < 0.01 for x in _nums(o)), "con 4.7 e 5.2 l'output è " + repr(o)`, h: 'int("4.7") dà errore: per i decimali usa float().' }
    ],
    hints: ['base = float(input("Base: "))', 'Senza parentesi, 2 * base + altezza raddoppia solo la base.', 'print("Area:", base * altezza)'],
    solution: `base = float(input("Base: "))
altezza = float(input("Altezza: "))
print("Area:", base * altezza)
print("Perimetro:", 2 * (base + altezza))
`
  },
  'l3-e2': {
    checks: [
      { t: '3725 secondi → 1 ora, 2 minuti, 5 secondi', c: NUMS + `o = _run(['3725'])\nassert _nums(o)[-3:] == [1, 2, 5], "con 3725 l'output è " + repr(o)`, h: 'Ore = secondi // 3600. I secondi che avanzano sono secondi % 3600.' },
      { t: '86399 secondi → 23, 59, 59', c: NUMS + `o = _run(['86399'])\nassert _nums(o)[-3:] == [23, 59, 59], "con 86399 l'output è " + repr(o)`, h: 'Minuti = resto // 60; secondi = resto % 60.' },
      { t: '59 secondi → 0, 0, 59', c: NUMS + `o = _run(['59'])\nassert _nums(o)[-3:] == [0, 0, 59], "con 59 l'output è " + repr(o)`, h: 'Stampa ore, minuti e secondi in quest’ordine, come ultimi tre numeri dell’output.' },
      { t: 'Usa gli operatori // e %', c: `assert '//' in _SRC and '%' in _SRC, 'usa la divisione intera // e il modulo %'`, h: 'Niente / : il risultato deve essere intero.' }
    ],
    hints: ['totale = int(input("Secondi: "))', 'ore = totale // 3600 e resto = totale % 3600', 'minuti = resto // 60 e secondi = resto % 60'],
    solution: `totale = int(input("Secondi: "))
ore = totale // 3600
resto = totale % 3600
minuti = resto // 60
secondi = resto % 60
print(ore, "ore,", minuti, "minuti,", secondi, "secondi")
`
  },
  'l3-e3': {
    checks: [
      { t: 'Prezzo 2.5 × 5 → «12.50» (due decimali)', c: `o = _run(['2.5', '5'])\nassert '12.50' in o, "con 2.5 e 5 l'output è " + repr(o)`, h: 'Formatta il totale con format(totale, ".2f") oppure con f"{totale:.2f}".' },
      { t: 'Prezzo 0.1 × 3 → «0.30», senza code strane', c: `o = _run(['0.1', '3'])\nassert '0.30' in o and '0.30000' not in o, "con 0.1 e 3 l'output è " + repr(o)`, h: '0.1 * 3 in Python vale 0.30000000000000004: la formattazione .2f lo arrotonda.' },
      { t: 'Compare il simbolo dell’euro', c: `o = _run(['2.5', '5'])\nassert '€' in o, "nell'output manca il simbolo €"`, h: 'Aggiungi "€" nella stampa.' }
    ],
    hints: ['prezzo = float(input(...)) e quantita = int(input(...))', 'totale = prezzo * quantita', 'print("Totale:", format(totale, ".2f"), "€")'],
    solution: `prezzo = float(input("Prezzo unitario: "))
quantita = int(input("Quantità: "))
totale = prezzo * quantita
print("Totale:", format(totale, ".2f"), "€")
`
  },
  'l4-e2': {
    checks: [
      { t: '4 → pari', c: NUMS + `o = _run(['4'])\nassert _ultima(o).endswith('pari') and 'dispari' not in _ultima(o), "con 4 l'ultima riga è " + repr(_ultima(o))`, h: 'Un numero è pari se il resto della divisione per 2 è zero: n % 2 == 0.' },
      { t: '7 → dispari', c: NUMS + `o = _run(['7'])\nassert 'dispari' in _ultima(o), "con 7 l'ultima riga è " + repr(_ultima(o))`, h: 'Nel ramo else stampa "dispari".' },
      { t: '0 → pari', c: NUMS + `o = _run(['0'])\nassert _ultima(o).endswith('pari') and 'dispari' not in _ultima(o), "con 0 l'ultima riga è " + repr(_ultima(o))`, h: 'Zero è pari: 0 % 2 vale 0.' },
      { t: '−3 → dispari', c: NUMS + `o = _run(['-3'])\nassert 'dispari' in _ultima(o), "con -3 l'ultima riga è " + repr(_ultima(o))`, h: 'Con int() i numeri negativi funzionano come gli altri.' }
    ],
    hints: ['n = int(input("Numero: "))', 'if n % 2 == 0: … else: …', 'Ricorda i due punti e il rientro di 4 spazi.'],
    solution: `n = int(input("Numero: "))
if n % 2 == 0:
    print(n, "è pari")
else:
    print(n, "è dispari")
`
  },
  'l4-e3': {
    checks: [
      { t: '4 → insufficiente', c: NUMS + `o = _run(['4'])\nassert _ultima(o).endswith('insufficiente'), "con 4 l'ultima riga è " + repr(_ultima(o))`, h: 'Primo caso: voto < 6.' },
      { t: '6 → sufficiente', c: NUMS + `o = _run(['6'])\nassert _ultima(o).endswith('sufficiente') and 'insufficiente' not in _ultima(o), "con 6 l'ultima riga è " + repr(_ultima(o))`, h: 'Il 6 è sufficiente: attenzione a < e <=.' },
      { t: '7 e 8 → buono', c: NUMS + `for v in ['7', '8']:\n    o = _run([v])\n    assert _ultima(o).endswith('buono'), 'con ' + v + " l'ultima riga è " + repr(_ultima(o))`, h: 'Buono vale per 7 e 8.' },
      { t: '9 e 10 → ottimo', c: NUMS + `for v in ['9', '10']:\n    o = _run([v])\n    assert _ultima(o).endswith('ottimo'), 'con ' + v + " l'ultima riga è " + repr(_ultima(o))`, h: 'Ottimo vale per 9 e 10.' },
      { t: '0 e 11 → voto non valido', c: NUMS + `for v in ['0', '11']:\n    o = _run([v])\n    assert _ultima(o).endswith('voto non valido'), 'con ' + v + " l'ultima riga è " + repr(_ultima(o))`, h: 'Controlla per primo che il voto sia tra 1 e 10: if voto < 1 or voto > 10.' },
      { t: 'Usa elif', c: `assert 'elif' in _SRC, 'non trovo elif nel codice'`, h: 'Le condizioni sono mutuamente esclusive: usa if … elif … elif … else.' }
    ],
    hints: ['Il primo controllo è sul voto non valido: if voto < 1 or voto > 10:', 'Poi elif voto < 6, elif voto == 6, elif voto <= 8, else.', 'L’ultima riga stampata deve finire esattamente con il giudizio, ad esempio print("Giudizio: buono").'],
    solution: `voto = int(input("Voto (1-10): "))
if voto < 1 or voto > 10:
    print("voto non valido")
elif voto < 6:
    print("insufficiente")
elif voto == 6:
    print("sufficiente")
elif voto <= 8:
    print("buono")
else:
    print("ottimo")
`
  },
  'l4-e4': {
    checks: [
      { t: '2024 → bisestile', c: NUMS + `o = _run(['2024'])\nassert _ultima(o).endswith('bisestile') and 'non' not in _ultima(o), "con 2024 l'ultima riga è " + repr(_ultima(o))`, h: 'Divisibile per 4 e non per 100: bisestile.' },
      { t: '2023 → non bisestile', c: NUMS + `o = _run(['2023'])\nassert _ultima(o).endswith('non bisestile'), "con 2023 l'ultima riga è " + repr(_ultima(o))`, h: '2023 non è divisibile per 4.' },
      { t: '1900 → non bisestile', c: NUMS + `o = _run(['1900'])\nassert _ultima(o).endswith('non bisestile'), "con 1900 l'ultima riga è " + repr(_ultima(o))`, h: '1900 è divisibile per 100 ma non per 400: non è bisestile.' },
      { t: '2000 → bisestile', c: NUMS + `o = _run(['2000'])\nassert _ultima(o).endswith('bisestile') and 'non' not in _ultima(o), "con 2000 l'ultima riga è " + repr(_ultima(o))`, h: '2000 è divisibile per 400: è bisestile.' },
      { t: 'Usa gli operatori logici', c: `assert ' and ' in _SRC or ' or ' in _SRC, 'usa and / or per combinare le condizioni'`, h: 'Una sola condizione: (anno % 4 == 0 and anno % 100 != 0) or anno % 400 == 0' }
    ],
    hints: ['Un anno è bisestile se è divisibile per 4 ma non per 100, oppure se è divisibile per 400.', '«Divisibile per 4» in Python: anno % 4 == 0.', 'if (anno % 4 == 0 and anno % 100 != 0) or anno % 400 == 0:'],
    solution: `anno = int(input("Anno: "))
if (anno % 4 == 0 and anno % 100 != 0) or anno % 400 == 0:
    print("bisestile")
else:
    print("non bisestile")
`
  }
};
