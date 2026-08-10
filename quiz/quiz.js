const param=new URLSearchParams(window.location.search)

const classe=param.get("classe")

let quiz=[...database[classe]]

quiz=quiz.sort(()=>Math.random()-0.5)

let index=0
let risposte=[]

document.getElementById("titolo").innerText="Quiz classe "+classe

function carica(){

let q=quiz[index]

document.getElementById("domanda").innerText=
"Domanda "+(index+1)+": "+q.q

let html=""

q.a.forEach((a,i)=>{

html+=`
<label>
<input type="radio" name="ans" value="${i}">
${a}
</label>
`

})

document.getElementById("risposte").innerHTML=html

}

function salva(){

let r=document.querySelector("input[name='ans']:checked")

if(r) risposte[index]=parseInt(r.value)

}

function avanti(){

salva()

if(index<quiz.length-1){

index++

carica()

}

}

function indietro(){

salva()

if(index>0){

index--

carica()

}

}

function consegna(){

salva()

let punteggio=0

quiz.forEach((q,i)=>{

if(risposte[i]==q.c) punteggio++

})

let risultato={

classe:classe,

risposte:risposte,

punteggio:punteggio,

totale:quiz.length,

data:new Date()

}

let blob=new Blob([JSON.stringify(risultato)],{type:"application/json"})

let a=document.createElement("a")

a.href=URL.createObjectURL(blob)

a.download="consegna_quiz.json"

a.click()

}

carica()

// TIMER

let tempo=900

setInterval(()=>{

tempo--

let m=Math.floor(tempo/60)

let s=tempo%60

document.getElementById("timer").innerText=
"Tempo "+m+":"+s

if(tempo<=0) consegna()

},1000)
