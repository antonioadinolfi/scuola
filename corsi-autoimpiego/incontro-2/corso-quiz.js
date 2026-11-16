"use strict";
/* Test a risposta multipla: opzioni in ordine casuale, correzione con spiegazione, esportazione del risultato.
   Uso: SicQuiz.mount({root, questions, threshold, title, fileName, onSave(answers,name)}) */
window.SicQuiz=(()=>{
 function shuffle(n){const a=[...Array(n).keys()];for(let k=n-1;k>0;k--){const r=Math.floor(Math.random()*(k+1));[a[k],a[r]]=[a[r],a[k]]}return a}
 function mount(o){
  const root=o.root,qs=o.questions,T=o.threshold;const form=root.querySelector('form');const list=form.querySelector('.quiz-questions');
  const submit=form.querySelector('.quiz-submit'),countEl=form.querySelector('.quiz-count'),result=root.querySelector('.quiz-result'),msg=root.querySelector('.quiz-message'),nameIn=root.querySelector('.quiz-name');
  let last=null;
  qs.forEach((q,i)=>{const fs=document.createElement('fieldset');fs.className='quiz-case';const lg=document.createElement('legend');lg.textContent=(i+1)+'. '+q.q;fs.append(lg);
   shuffle(q.o.length).forEach((j,pos)=>{const lab=document.createElement('label');lab.className='quiz-option';const inp=document.createElement('input');inp.type='radio';inp.name='q'+i;inp.value=String(j);lab.append(inp,document.createTextNode(' '+String.fromCharCode(65+pos)+'. '+q.o[j]));fs.append(lab)});
   const fb=document.createElement('p');fb.className='feedback';fb.hidden=true;fs.append(fb);
   const key=document.createElement('p');key.className='muted trainer-only answer-key';key.textContent='Chiave: '+q.o[q.c];fs.append(key);
   list.append(fs)});
  const answers=()=>qs.map((_,i)=>{const x=form.querySelector('input[name=q'+i+']:checked');return x?+x.value:null});
  function progress(){const n=answers().filter(v=>v!==null).length;countEl.textContent=n+' di '+qs.length+' risposte';submit.disabled=n!==qs.length}
  form.addEventListener('change',progress);progress();
  form.addEventListener('submit',e=>{e.preventDefault();const a=answers();if(a.some(v=>v===null)){msg.textContent='Rispondi a tutte le domande prima di inviare.';return}
   const name=nameIn?nameIn.value.trim():'';if(nameIn&&!name){msg.textContent='Scrivi nome e cognome prima di inviare.';nameIn.focus();return}
   const score=qs.reduce((s,q,i)=>s+(q.c===a[i]?1:0),0);last={a,score,name,at:new Date()};
   try{o.onSave&&o.onSave(a,name)}catch(err){msg.textContent=err.message;return}
   qs.forEach((q,i)=>{const fb=list.children[i].querySelector('.feedback');fb.hidden=false;const ok=a[i]===q.c;fb.classList.toggle('wrong',!ok);fb.textContent=ok?'Risposta esatta. '+q.f:'Da rivedere. Risposta corretta: «'+q.o[q.c]+'». '+q.f});
   form.querySelectorAll('input').forEach(x=>x.disabled=true);submit.hidden=true;result.hidden=false;
   const pass=score>=T;result.querySelector('.quiz-score').textContent='Risultato: '+score+'/'+qs.length+' · '+Math.round(score/qs.length*100)+'%';
   msg.textContent=pass?(o.passText||'Test superato.'):'Soglia non raggiunta: servono almeno '+T+'/'+qs.length+'. Rileggi le spiegazioni e riprova.';
   result.classList.toggle('ok',pass);result.focus()});
  root.querySelector('.quiz-retry')?.addEventListener('click',()=>{form.reset();form.querySelectorAll('input').forEach(x=>x.disabled=false);list.querySelectorAll('.feedback').forEach(x=>x.hidden=true);submit.hidden=false;result.hidden=true;msg.textContent='Nuovo tentativo.';progress();form.querySelector('input[type=radio]').focus()});
  root.querySelector('.quiz-download')?.addEventListener('click',()=>{if(!last)return;const txt=(o.title||'TEST')+'\nPartecipante: '+(last.name||'—')+'\nData: '+last.at.toLocaleString('it-IT')+'\nPunteggio: '+last.score+'/'+qs.length+' (soglia '+T+')\nEsito: '+(last.score>=T?'SUPERATO':'NON SUPERATO')+'\n\n'+qs.map((q,i)=>(i+1)+'. '+q.q+'\nRisposta data: '+q.o[last.a[i]]+(last.a[i]===q.c?'  [corretta]':'  [errata — corretta: '+q.o[q.c]+']')).join('\n\n');
   const url=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));const l=document.createElement('a');l.href=url;l.download=(o.fileName||'test')+(last.name?'-'+last.name.replace(/\s+/g,'_'):'')+'.txt';l.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 }
 return {mount};
})();
