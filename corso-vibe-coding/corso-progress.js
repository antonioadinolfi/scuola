"use strict";
window.VibeCourse=(()=>{
 const lessons=window.VIBE_LESSONS, prefix='vibeCourseQuizV3-',threshold=7;
 function validAnswers(a){return Array.isArray(a)&&a.length===10&&a.every(v=>Number.isInteger(v)&&v>=0&&v<4)}
 function score(n,a){if(!validAnswers(a))return 0;return lessons[n-1].quiz.reduce((s,q,i)=>s+(q.correct===a[i]?1:0),0)}
 function validAttempt(a){return a&&validAnswers(a.answers)&&typeof a.at==='string'&&Number.isFinite(Date.parse(a.at))}
 function read(n){const candidates=[];for(const name of ['localStorage','sessionStorage']){try{const r=JSON.parse(window[name].getItem(prefix+n)||'null');if(r&&r.version===3&&validAttempt(r.last)){if(!validAttempt(r.best)||score(n,r.best.answers)<threshold)r.best=null;candidates.push(r)}}catch{}}if(!candidates.length)return null;const result=candidates.sort((a,b)=>Date.parse(b.last.at)-Date.parse(a.last.at))[0];const best=candidates.map(r=>r.best).filter(Boolean).sort((a,b)=>score(n,b.answers)-score(n,a.answers))[0];return {...result,best:best||null}}
 function passed(n){const r=read(n);return !!(r&&r.best&&score(n,r.best.answers)>=threshold)}
 function missing(n){for(let i=1;i<n;i++)if(!passed(i))return i;return null}
 function save(n,answers){if(!validAnswers(answers))throw Error('Rispondi a tutte le dieci domande.');if(missing(n))throw Error('Completa prima i test delle lezioni precedenti.');const old=read(n);const attempt={answers:[...answers],at:new Date().toISOString()};let best=old?.best||null;if(score(n,answers)>=threshold&&(!best||score(n,answers)>=score(n,best.answers)))best=attempt;const r={version:3,last:attempt,best,attempts:(Number.isInteger(old?.attempts)?old.attempts:0)+1};for(const name of ['localStorage','sessionStorage']){try{window[name].setItem(prefix+n,JSON.stringify(r));return r}catch{}}throw Error('Il browser non consente di memorizzare il risultato. Abilita i dati del sito e invia di nuovo il test.')}
 function refreshNavigation(){document.querySelectorAll('[data-lesson-link]').forEach(a=>{const n=Number(a.dataset.lessonLink),blocked=missing(n);a.classList.toggle('locked-link',!!blocked);a.title=blocked?'Richiede almeno 7/10 nel test della Lezione '+blocked:'Apri la Lezione '+n;const status=a.querySelector('.nav-state');if(status)status.textContent=passed(n)?' · ✓':blocked?' · bloccata':''})}
 function gate(){const n=Number(document.documentElement.dataset.lesson),blocked=missing(n);document.documentElement.classList.remove('course-pending');document.documentElement.classList.toggle('course-locked',!!blocked);let box=document.getElementById('courseGate');if(blocked){if(!box){box=document.createElement('section');box.id='courseGate';box.className='panel gate';box.innerHTML='<h1>Completa prima il percorso precedente</h1><p id="gateText"></p><a class="button primary" id="gateLink">Vai al test richiesto →</a><div class="gate-transfer"><p><strong>Hai già svolto i test su un altro computer?</strong> Carica il file di avanzamento che hai scaricato.</p><label class="button file-button">Carica il mio avanzamento<input type="file" id="gateImport" accept="application/json,.json"></label><p id="gateStatus" role="status" aria-live="polite"></p></div>';box.querySelector('#gateImport').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const st=box.querySelector('#gateStatus');try{const r=await window.VibeCourse.transfer.load(f);st.textContent=r.msg;if(!missing(Number(document.documentElement.dataset.lesson))){st.textContent=r.msg+' Lezione sbloccata: aggiornamento della pagina…';setTimeout(()=>location.reload(),900)}}catch(err){st.textContent='Caricamento non riuscito: '+err.message}finally{e.target.value=''}});document.body.prepend(box)}box.querySelector('#gateText').textContent='Per accedere alla Lezione '+n+' devi ottenere almeno 7 risposte corrette su 10 nel test della Lezione '+blocked+'.';box.querySelector('#gateLink').href='./lezione-'+blocked+'.html#test-finale'}else if(box)box.remove();refreshNavigation()}
 document.addEventListener('DOMContentLoaded',()=>{gate();document.querySelectorAll('[data-lesson-link]').forEach(a=>a.addEventListener('click',e=>{const blocked=missing(Number(a.dataset.lessonLink));if(blocked){e.preventDefault();location.href='./lezione-'+blocked+'.html#test-finale'}}))});
 for(const event of ['pageshow','storage'])window.addEventListener(event,()=>{if(document.readyState!=='loading')gate()});
 return {read,save,score,passed,missing,gate,refreshNavigation,threshold};
})();
/* Trasferimento dell'avanzamento tra computer: risultati dei test e schede di sperimentazione. */
window.VibeCourse.transfer=(()=>{
 const course=window.VibeCourse,lessons=window.VIBE_LESSONS,QP='vibeCourseQuizV3-',PP='vibeClassPlanV1-';
 const get=k=>{for(const s of ['localStorage','sessionStorage']){try{const v=window[s].getItem(k);if(v)return JSON.parse(v)}catch{}}return null};
 const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{try{sessionStorage.setItem(k,JSON.stringify(v));return true}catch{return false}}};
 const hasPlan=p=>p&&['classContext','classEvidence','classAlternative'].some(f=>typeof p[f]==='string'&&p[f].trim());
 function collect(){const data={course:'vibe-coding-docenti',format:2,exported:new Date().toISOString(),results:{},plans:{}};
  lessons.forEach((_,i)=>{const r=get(QP+(i+1));if(r)data.results[i+1]=r;const p=get(PP+(i+1));if(hasPlan(p))data.plans[i+1]=p});return data}
 function download(){const data=collect(),nr=Object.keys(data.results).length,np=Object.keys(data.plans).length;
  if(!nr&&!np)return {ok:false,msg:'Non ci sono ancora test svolti o schede salvate in questo browser.'};
  const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,1)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='avanzamento-vibe-coding.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  return {ok:true,msg:'File scaricato: '+nr+' test e '+np+' sched'+(np===1?'a':'e')+' di sperimentazione. Caricalo dalla guida o da una lezione sull’altro computer.'}}
 async function load(file){const data=JSON.parse(await file.text());
  if(data.course!=='vibe-coding-docenti'||typeof data.results!=='object')throw Error('il file non è un avanzamento di questo corso.');
  let tests=0,plans=0,kept=0,old=0;
  for(const [k,r] of Object.entries(data.results||{})){const n=Number(k);if(!(n>=1&&n<=lessons.length)||!r||!r.last||!Array.isArray(r.last.answers))continue;
   if(r.version!==3){old++;continue}
   const cur=get(QP+n),score=x=>course.score(n,((x.best||x.last)||{}).answers);
   if(!cur||score(r)>=score(cur)){if(set(QP+n,r))tests++}else kept++}
  for(const [k,p] of Object.entries(data.plans||{})){const n=Number(k);if(!(n>=1&&n<=lessons.length)||!hasPlan(p))continue;
   const cur=get(PP+n),newer=!hasPlan(cur)||(p.savedAt&&(!cur.savedAt||Date.parse(p.savedAt)>Date.parse(cur.savedAt)));
   if(newer){const clean={};['classContext','classEvidence','classAlternative','savedAt'].forEach(f=>{if(typeof p[f]==='string')clean[f]=p[f].slice(0,2000)});if(set(PP+n,clean))plans++}else kept++}
  const parts=[];if(tests)parts.push(tests+' test');if(plans)parts.push(plans+' sched'+(plans===1?'a':'e')+' di sperimentazione');
  let msg=parts.length?'Avanzamento caricato: '+parts.join(' e ')+'.':'Nessun dato nuovo da caricare.';
  if(kept)msg+=' Conservati '+kept+' elementi più recenti o migliori già presenti.';
  if(old)msg+=' Ignorati '+old+' risultati dei test precedenti al rinnovo del 29 ottobre 2026.';
  return {tests,plans,msg}}
 return {collect,download,load};
})();
