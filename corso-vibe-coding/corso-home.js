"use strict";
(()=>{
 const $=id=>document.getElementById(id),lessons=window.VIBE_LESSONS||[],course=window.VibeCourse;

 // Spettro del vibe coding
 const SPEC=[
  {title:'Vibe coding puro',do:'Descrivi ciò che vuoi, accetti le modifiche senza leggerle, incolli gli errori finché qualcosa funziona.',check:'Solo se il risultato «sembra andare».',school:'Esplorare un’idea in pochi minuti, da soli e senza studenti coinvolti. Non per materiali da usare in classe.'},
  {title:'Prototipazione verificata',do:'Scrivi una specifica, generi una versione minima, la provi con test decisi prima, chiedi modifiche circoscritte.',check:'Contenuti disciplinari, comportamento, casi limite, accessibilità, assenza di dati personali.',school:'Quiz, simulazioni, percorsi e piccoli siti da usare con le classi. È il livello a cui porta il corso.'},
  {title:'Sviluppo assistito dall’IA',do:'Leggi e comprendi il codice, lo organizzi in file e versioni, l’IA accelera un lavoro che sapresti valutare.',check:'Anche struttura del codice, sicurezza, manutenzione nel tempo.',school:'Informatica e indirizzi tecnici; progetti che gestiscono dati o account.'}
 ];
 const btns=[...document.querySelectorAll('.spec-btn')];
 function showSpec(i){const s=SPEC[i];btns.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));$('specTitle').textContent=s.title;$('specDo').textContent=s.do;$('specCheck').textContent=s.check;$('specSchool').textContent=s.school;$('specMarker').style.left=(i*50)+'%'}
 btns.forEach(b=>b.addEventListener('click',()=>showSpec(Number(b.dataset.spec))));
 if(btns.length)showSpec(1);

 // Vero o falso
 const TF=[
  ['Se l’IA dice di aver controllato il codice, posso considerarlo testato.',false,'Falso: il modello genera testo plausibile, anche quando descrive test. Contano solo le prove che esegui tu.'],
  ['Un quiz HTML autonomo generato con l’IA, quando gli studenti lo usano, non invia le risposte al modello.',true,'Vero, se il codice non prevede invii o servizi esterni: l’IA ha lavorato solo durante la costruzione. Va comunque verificato.'],
  ['Aprendo una nuova chat, l’IA ricorda l’app costruita ieri.',false,'Falso: il modello lavora sul contesto della conversazione. In una nuova chat devi fornire specifica e codice attuali.'],
  ['Per usare il vibe coding in classe gli studenti devono per forza avere un account IA.',false,'Falso: nelle modalità A e B gli studenti usano o collaudano un’app già verificata, senza account.']
 ];
 const list=$('tfList');
 if(list)TF.forEach(([text,answer,expl],i)=>{const li=document.createElement('li');const p=document.createElement('p');p.textContent=text;const row=document.createElement('div');row.className='actions';const out=document.createElement('p');out.className='feedback';out.hidden=true;out.setAttribute('aria-live','polite');
  [['Vero',true],['Falso',false]].forEach(([label,val])=>{const b=document.createElement('button');b.type='button';b.className='button tf';b.textContent=label;b.onclick=()=>{out.hidden=false;out.textContent=(val===answer?'Esatto. ':'Non proprio. ')+expl;out.classList.toggle('wrong',val!==answer)};row.append(b)});
  li.append(p,row,out);list.append(li)});

 // Checklist
 const boxes=[...document.querySelectorAll('.checklist input')];
 const upd=()=>{$('checkStatus').textContent=boxes.filter(b=>b.checked).length+' di '+boxes.length+' controlli spuntati.'};
 boxes.forEach(b=>b.addEventListener('change',upd));

 // Mappa del percorso con stato
 const MODES=['A','A+B','B','C guidata','C','B'];
 function renderPath(){const ol=$('pathList');if(!ol)return;ol.textContent='';lessons.forEach((l,i)=>{const n=i+1,li=document.createElement('li');li.className='path-item';const blocked=course?course.missing(n):null,done=course?course.passed(n):false;
  li.classList.toggle('done',done);li.classList.toggle('locked',!!blocked);
  const a=document.createElement('a');a.href='./lezione-'+n+'.html';a.dataset.lessonLink=String(n);a.innerHTML='<span class="path-n"></span><span class="path-body"><strong class="path-title"></strong><span class="path-product"></span><span class="path-meta"></span></span>';
  a.querySelector('.path-n').textContent=done?'✓':String(n);a.querySelector('.path-title').textContent='Lezione '+n+' · '+l.title;a.querySelector('.path-product').textContent=l.product;
  a.querySelector('.path-meta').textContent='4 ore · in classe: modalità '+(l.classroom?.mode||MODES[i])+' · '+(done?'test superato':blocked?'richiede il test della Lezione '+blocked:'disponibile');
  if(blocked)a.addEventListener('click',e=>{e.preventDefault();location.href='./lezione-'+blocked+'.html#test-finale'});
  li.append(a);ol.append(li)})}
 renderPath();
 window.addEventListener('storage',renderPath);window.addEventListener('pageshow',renderPath);

 // Esporta / importa avanzamento
 const PREFIX='vibeCourseQuizV2-',status=$('progressStatus');
 function readRaw(n){for(const s of ['localStorage','sessionStorage']){try{const v=window[s].getItem(PREFIX+n);if(v)return JSON.parse(v)}catch{}}return null}
 $('exportProgress')?.addEventListener('click',()=>{const data={course:'vibe-coding-docenti',format:1,exported:new Date().toISOString(),results:{}};lessons.forEach((_,i)=>{const r=readRaw(i+1);if(r)data.results[i+1]=r});
  if(!Object.keys(data.results).length){status.textContent='Non ci sono ancora test svolti in questo browser.';return}
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='avanzamento-vibe-coding.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status.textContent='File scaricato: contiene solo le risposte ai test, nessun dato personale.'});
 $('importProgress')?.addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(data.course!=='vibe-coding-docenti'||!data.results)throw Error('Il file non è un avanzamento di questo corso.');let ok=0;
   for(const [k,r] of Object.entries(data.results)){const n=Number(k);if(!(n>=1&&n<=lessons.length)||!r||r.version!==2||!r.last||!Array.isArray(r.last.answers))continue;
    const cur=readRaw(n),better=!cur||!course||course.score(n,(r.best||r.last).answers)>=course.score(n,(cur.best||cur.last).answers);
    if(better){localStorage.setItem(PREFIX+n,JSON.stringify(r));ok++}}
   status.textContent=ok?'Avanzamento caricato per '+ok+' lezion'+(ok===1?'e':'i')+'. I risultati migliori già presenti sono stati conservati.':'Nessun risultato migliore da caricare.';renderPath()}
  catch(err){status.textContent='Caricamento non riuscito: '+err.message}finally{e.target.value=''}});
})();
