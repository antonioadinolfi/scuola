"use strict";
/* Laboratorio decisionale: casi aziendali del modulo, quattro sezioni da compilare,
   salvataggio nel browser, scheda stampabile e traccia di soluzione per il formatore. */
(()=>{
 const root=document.getElementById('labRoot');if(!root)return;
 const n=+document.documentElement.dataset.lesson,cases=(window.SIC_CASES||[])[n-1]||[];if(!cases.length)return;
 const KEY='sicPUL-lab-v1';
 const FIELDS=[['pericoli','1. Rischi e persone coinvolte'],['azioni','2. Misure immediate e preventive'],['responsabili','3. Chi decide, con quali risorse e comunicazioni'],['verifica','4. Evidenze, tempi e verifica di efficacia']];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let data={};try{data=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}};
 const id=k=>'m'+n+'c'+k;
 let cur=0;
 function render(){
  const c=cases[cur],d=data[id(cur)]||{};
  root.innerHTML='<div class="lab-cases" role="group" aria-label="Casi del modulo">'+cases.map((x,k)=>'<button type="button" data-k="'+k+'" aria-pressed="'+(k===cur)+'">Caso '+n+'.'+(k+1)+' · '+esc(x.title)+'</button>').join('')+'</div>'
  +'<div class="lab-scenario"><b>Situazione.</b> '+esc(c.case)+'</div><p class="task"><b>Consegna.</b> '+esc(c.task)+'</p>'
  +'<p class="muted">L’obiettivo non è indovinare: è motivare decisioni verificabili. Le risposte restano solo in questo browser.</p>'
  +'<div class="lab-fields">'+FIELDS.map(([k,l])=>'<label>'+l+'<textarea data-f="'+k+'" placeholder="Scrivere decisioni concrete…">'+esc(d[k]||'')+'</textarea></label>').join('')+'</div>'
  +'<div class="actions" style="margin-top:16px"><button class="button" type="button" id="labPrint">Stampa la scheda del caso</button><button class="button" type="button" id="labClear">Svuota le risposte</button><button class="button primary trainer-only" type="button" id="labSol" style="display:none">Mostra la traccia di soluzione</button></div>'
  +'<div class="lab-solution" id="labSolBox" hidden><h3 style="margin-top:0">Traccia ragionata per il formatore</h3><ul>'+c.output.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul><p><b>Attenzione didattica.</b> '+esc(c.teacher)+'</p><p class="muted">È un esempio di ragionamento organizzativo, non una prescrizione: va adattato al DVR, al contratto, al luogo e alle istruzioni effettive.</p></div>';
  root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{cur=+b.dataset.k;render()});
  root.querySelectorAll('[data-f]').forEach(t=>t.oninput=()=>{(data[id(cur)]??={})[t.dataset.f]=t.value;save()});
  if(window.SicCourse&&SicCourse.trainer())root.querySelector('#labSol').style.display='';
  root.querySelector('#labSol').onclick=e=>{const b=root.querySelector('#labSolBox');b.hidden=!b.hidden;e.target.textContent=b.hidden?'Mostra la traccia di soluzione':'Nascondi la traccia di soluzione'};
  root.querySelector('#labClear').onclick=e=>{const b=e.currentTarget;if(!b.dataset.arm){b.dataset.arm='1';b.textContent='Confermi? Clicca di nuovo';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent='Svuota le risposte'}},4000);return}delete data[id(cur)];save();render()};
  root.querySelector('#labPrint').onclick=()=>{
   let p=document.querySelector('.lab-print');if(!p){p=document.createElement('section');p.className='lab-print';document.body.append(p)}
   const d2=data[id(cur)]||{};
   p.innerHTML='<h1>Laboratorio decisionale · Caso '+n+'.'+(cur+1)+' — '+esc(c.title)+'</h1><p style="font-size:10.5pt">Partecipante / gruppo: ______________________ &nbsp; Data: ____/____/______</p><div class="box"><b>Situazione</b>'+esc(c.case)+'</div><div class="box"><b>Consegna</b>'+esc(c.task)+'</div>'+FIELDS.map(([k,l])=>'<div class="box"><b>'+l+'</b>'+esc(d2[k]||'')+'</div>').join('');
   document.documentElement.classList.add('print-lab');const done=()=>{document.documentElement.classList.remove('print-lab');removeEventListener('afterprint',done)};addEventListener('afterprint',done);setTimeout(()=>print(),60)};
 }
 render();
})();
