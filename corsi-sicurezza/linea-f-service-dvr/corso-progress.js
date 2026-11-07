"use strict";
/* Avanzamento del corso: test di fine modulo (10 domande, soglia 7/10) che sbloccano il modulo successivo.
   I dati restano solo nel browser (localStorage). Modalità formatore: sblocca tutti i moduli. */
window.SicCourse=(()=>{
 const lessons=window.SIC_LESSONS||[],prefix='sicLFS-quiz-v1-',threshold=7,TRAINER='sicLFS-trainer';
 const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v);return true}catch{return false}},del(k){try{localStorage.removeItem(k)}catch{}}};
 const valid=(n,a)=>Array.isArray(a)&&a.length===lessons[n-1].quiz.length&&a.every(v=>Number.isInteger(v)&&v>=0&&v<4);
 function score(n,a){if(!valid(n,a))return 0;return lessons[n-1].quiz.reduce((s,q,i)=>s+(q.c===a[i]?1:0),0)}
 function read(n){try{const r=JSON.parse(store.get(prefix+n)||'null');return r&&r.last&&valid(n,r.last.answers)?r:null}catch{return null}}
 function passed(n){const r=read(n);return !!(r&&r.best&&score(n,r.best.answers)>=threshold)}
 const trainer=()=>store.get(TRAINER)==='1';
 function setTrainer(on){on?store.set(TRAINER,'1'):store.del(TRAINER);document.documentElement.classList.toggle('trainer-on',on);refreshNavigation()}
 function missing(n){if(trainer())return null;for(let i=1;i<n;i++)if(!passed(i))return i;return null}
 function save(n,answers,name){if(!valid(n,answers))throw Error('Rispondi a tutte le domande.');const old=read(n);const attempt={answers:[...answers],at:new Date().toISOString(),name:name||''};let best=old?.best||null;if(score(n,answers)>=threshold&&(!best||score(n,answers)>=score(n,best.answers)))best=attempt;const r={last:attempt,best,attempts:(old?.attempts||0)+1};if(!store.set(prefix+n,JSON.stringify(r)))throw Error('Il browser non consente di salvare il risultato: abilita i dati del sito.');return r}
 function refreshNavigation(){document.querySelectorAll('[data-lesson-link]').forEach(a=>{const n=+a.dataset.lessonLink,blocked=missing(n);a.classList.toggle('locked-link',!!blocked);a.title=blocked?'Richiede almeno 7/10 nel test del Modulo '+blocked:'Apri il Modulo '+n;const s=a.querySelector('.nav-state');if(s)s.textContent=passed(n)?' · ✓':blocked?' · bloccato':''});document.querySelectorAll('[data-path-item]').forEach(li=>{const n=+li.dataset.pathItem;li.classList.toggle('done',passed(n));li.classList.toggle('locked',!!missing(n));const m=li.querySelector('.path-state');if(m)m.textContent=passed(n)?'Test superato ✓':missing(n)?'Bloccato: supera prima il test del Modulo '+missing(n):'Disponibile'})}
 function gate(){const n=+document.documentElement.dataset.lesson;document.documentElement.classList.toggle('trainer-on',trainer());if(!n){document.documentElement.classList.remove('course-pending');refreshNavigation();return}
  const blocked=missing(n);document.documentElement.classList.remove('course-pending');document.documentElement.classList.toggle('course-locked',!!blocked);
  if(blocked){let box=document.getElementById('courseGate');if(!box){box=document.createElement('section');box.id='courseGate';box.className='panel gate';box.innerHTML='<h1>Completa prima il modulo precedente</h1><p>Per aprire il Modulo '+n+' serve almeno 7/10 nel test del Modulo '+blocked+'.</p><div class="actions"><a class="button primary" href="./modulo-'+blocked+'.html#test-finale">Vai al test del Modulo '+blocked+' →</a><button class="button" type="button" id="gateTrainer">Sono il formatore: sblocca tutti i moduli</button></div><p class="muted">La modalità formatore resta attiva solo in questo browser e si può disattivare dalla guida al corso.</p>';document.body.prepend(box)}box.querySelector('#gateTrainer').onclick=()=>{setTrainer(true);location.reload()}}
  refreshNavigation()}
 return {score,read,passed,save,missing,refreshNavigation,gate,trainer,setTrainer,threshold,lessons};
})();
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>SicCourse.gate()):SicCourse.gate();
