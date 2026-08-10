const database = {

Prime:[
{q:"La RAM è:",a:["memoria permanente","memoria volatile","memoria cloud","memoria esterna"],c:1},
{q:"Il sistema operativo serve per:",a:["gestire hardware e programmi","aumentare velocità internet","scrivere codice","creare siti"],c:0}
],

Terze:[
{
  q: "Quale metodo dei dizionari è più indicato per recuperare il valore di una chiave senza rischiare un 'KeyError' se la chiave non esiste?",
  a: [".values()", ".pop()", ".fetch()", ".get()"],
  c: 3
},
{
  q: "Hai una lista ['mela', 'mela']. Quale codice crea un dizionario di frequenza corretto?",
  a: ["d = {p: 1 for p in lista}", "d = {}; for p in lista: d[p] = d.get(p, 0) + 1", "d = dict(lista)", "d = {}; for p in lista: d[p] += 1"],
  c: 1
},
{
  q: "Cosa restituisce la funzione len() applicata a {'a': 1, 'b': 2, 'a': 3}?",
  a: ["3", "1", "2", "Errore"],
  c: 2
},
{
  q: "Come si ottiene una lista contenente solo i valori (non le chiavi) di un dizionario 'd'?",
  a: ["list(d.values())", "list(d.keys())", "d.to_list()", "list(d.items())"],
  c: 0
},
{
  q: "Per svuotare completamente un dizionario senza eliminarne la variabile si usa:",
  a: ["del d", "d.remove()", "d.empty()", "d.clear()"],
  c: 3
}
],

Quarte:[
{q:"HTTP 404 indica:",a:["pagina trovata","errore server","pagina non trovata","redirect"],c:2}
]

}


