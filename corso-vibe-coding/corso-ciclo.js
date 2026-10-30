"use strict";
/* Guida al corso · «Segui un giro del ciclo» e interruttore «IA collegata in classe». */
(()=>{
 const fig=document.getElementById('cicloFig'),panel=document.getElementById('walkPanel');
 if(!fig||!panel)return;
 const $=id=>document.getElementById(id);
 const prev=$('walkPrev'),next=$('walkNext'),reset=$('walkReset'),sw=$('aiSwitch'),cap=$('cicloCaption');
 const CAP_DEF=cap.textContent;
 const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const table=(rows)=>'<div class="walk-table"><table><thead><tr><th scope="col">Test</th><th scope="col">Atteso</th><th scope="col">Osservato</th><th scope="col">Esito</th></tr></thead><tbody>'+
  rows.map(r=>'<tr'+(r[3]==='✘'?' class="ko"':'')+'><th scope="row">'+esc(r[0])+'</th><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td><td class="esito">'+(r[3]==='✘'?'<span aria-label="non superato">✘</span>':'<span aria-label="superato">✔</span>')+'</td></tr>').join('')+'</tbody></table></div>';
 const code=(t,hl)=>'<pre class="walk-code">'+esc(t).split('\n').map(l=>hl&&l.includes(hl)?'<mark class="key">'+l+'</mark>':l).join('\n')+'</pre>';
 const CODE='let punti = 0;\nfunction rispondi(scelta, corretta) {\n  if (scelta === corretta) punti = punti + 1;\n  aggiornaPunteggio();\n}\nfunction riavvia() {\n  domanda = 0;\n  mostraDomanda();\n}';
 const FIX='function riavvia() {\n  domanda = 0;\n  punti = 0;            // aggiunto\n  aggiornaPunteggio();  // aggiunto\n  mostraDomanda();\n}';
 const T1=[['Risposta corretta','Punteggio +1','Punteggio +1','✔'],['Risposta errata','Punteggio invariato','Invariato, spiegazione visibile','✔'],['Invio senza scelta','Messaggio «scegli una risposta»','Messaggio visibile','✔'],['Punteggio finale','2 con 2 risposte corrette su 3','2','✔'],['Riavvio','Punteggio 0, prima domanda','Punteggio 2, prima domanda','✘']];
 const T2=T1.map(r=>r[0]==='Riavvio'?['Riavvio','Punteggio 0, prima domanda','Punteggio 0, prima domanda','✔']:r);

 const STEPS=[
  {g:'Giro 1',on:['docente','e-prompt'],t:'Tu, docente: il prompt',
   h:'<p>Parti dall’obiettivo e da funzioni che puoi contare. Il prompt è una specifica: ogni promessa corrisponde a un comportamento che potrai controllare.</p><pre class="walk-prompt">Crea un quiz per studenti di seconda liceo sull’obiettivo «distinguere fonti storiche primarie e secondarie». Deve avere tre domande, quattro opzioni e una sola risposta corretta per domanda, spiegazione dopo la risposta, punteggio e riavvio. Prima descrivi il comportamento e i criteri di verifica. Non aggiungere login o raccolta dati.</pre>'},
  {g:'Giro 1',on:['modello','e-mc'],t:'Il modello risponde',
   h:'<p>Il modello genera il testo più probabile dopo il tuo prompt: descrizione, codice e, spesso, frasi rassicuranti.</p><blockquote class="walk-ai"><span class="walk-tag">Esempio illustrativo</span>Ecco il quiz completo in un unico file HTML. Ho testato il quiz e funziona correttamente su tutti i dispositivi: puoi usarlo subito in classe.</blockquote><p class="walk-note">«Ho testato» è testo generato, non una prova eseguita: il modello non ha aperto il quiz in nessun browser.</p>'},
  {g:'Giro 1',on:['codice','e-cb'],t:'Il codice',
   h:'<p>Non serve leggerlo riga per riga. Ma sapere dove sta che cosa aiuta: qui JavaScript gestisce punteggio e riavvio.</p>'+code(CODE)+'<p class="walk-note">Il difetto è già qui, ma a colpo d’occhio non si vede: lo farà emergere una prova.</p>'},
  {g:'Giro 1',on:['browser','e-bp'],t:'Il browser lo esegue',
   h:'<p>Salvi il file come <code>quiz.html</code> e lo apri con un doppio clic. Il quiz compare e sembra funzionare.</p><div class="mock-quiz" aria-label="Anteprima illustrativa del quiz"><div class="mock-top"><span>Domanda 1 di 3</span><span>Punteggio: 0</span></div><p>Una lettera scritta nel 1916 da un soldato al fronte, per studiare la vita in trincea, è una fonte…</p><div class="mock-opts"><span>primaria</span><span>secondaria</span><span>storiografica</span><span>iconografica</span></div></div><p class="walk-note">Una pagina che si apre non è ancora un quiz verificato.</p>'},
  {g:'Giro 1',on:['prova'],t:'Tu provi e confronti',
   h:'<p>Esegui i cinque test decisi prima e annoti atteso e osservato. Quattro passano; il quinto no.</p>'+table(T1)+'<p class="walk-note">Dopo il riavvio il punteggio riparte da 2: uno studente vedrebbe un risultato falso.</p>'},
  {g:'Giro 1',on:['prova','e-new','docente'],t:'Un nuovo prompt, circoscritto',
   h:'<p>Descrivi il difetto in modo riproducibile e chiedi una modifica minima, dicendo che cosa non deve cambiare.</p><pre class="walk-prompt">Dopo il riavvio il punteggio resta 2 invece di tornare a 0. Passi: rispondo correttamente a due domande, premo Riavvia, guardo il punteggio. Atteso: 0. Osservato: 2. Correggi solo la funzione riavvia(), senza cambiare domande, feedback o grafica, e indicami quali test devo ripetere.</pre>'},
  {g:'Giro 2',on:['docente','e-prompt','modello','e-mc','codice'],t:'La correzione',
   h:'<p>Il modello modifica una sola funzione. Le righe aggiunte sono riconoscibili e puoi confrontarle con la versione precedente, che hai conservato.</p>'+code(FIX,'aggiunto')},
  {g:'Giro 2',on:['codice','e-cb','browser','e-bp','prova'],t:'Riprovi tutto, non solo il riavvio',
   h:'<p>Ripeti anche i quattro test che già passavano: è il <strong>test di regressione</strong>. Una correzione può rompere ciò che prima funzionava.</p>'+table(T2)+'<p class="walk-note">Controlli anche il contenuto: la spiegazione sulla lettera del 1916 è corretta? Questa verifica disciplinare spetta solo a te.</p>'},
  {g:'Uso in classe',on:['e-file','nessunaia','e-up','studenti'],t:'Solo ora il file entra in aula',
   h:'<p>Al Momento 2 arriva una versione che hai provato e di cui conosci i limiti. Il quiz è autonomo: in classe non interroga l’IA e le risposte degli studenti restano nel browser.</p><p class="walk-note">Conserva prompt, versioni e registro dei test: permettono a un collega di ripetere le tue prove.</p>'}
 ];
 let i=-1;
 const nodes=[...fig.querySelectorAll('[data-node]')];
 function render(){
  fig.classList.toggle('walking',i>=0);
  nodes.forEach(n=>n.classList.toggle('is-on',i>=0&&STEPS[i].on.includes(n.dataset.node)));
  if(i<0){panel.hidden=true;prev.disabled=true;next.textContent='Inizia il racconto →';reset.hidden=true;return}
  const s=STEPS[i];
  panel.hidden=false;
  panel.innerHTML='<div class="kicker">'+s.g+' · passaggio '+(i+1)+' di '+STEPS.length+'</div><h4>'+s.t+'</h4>'+s.h;
  prev.disabled=i===0;reset.hidden=false;
  next.textContent=i===STEPS.length-1?'Fine del giro':'Avanti →';next.disabled=i===STEPS.length-1;
 }
 function go(n){if(sw.getAttribute('aria-checked')==='true')setAI(false);i=Math.max(0,Math.min(STEPS.length-1,n));render()}
 next.addEventListener('click',()=>go(i+1));
 prev.addEventListener('click',()=>go(i-1));
 reset.addEventListener('click',()=>{i=-1;next.disabled=false;render();next.focus()});

 function setAI(on){
  sw.setAttribute('aria-checked',String(on));
  fig.classList.toggle('ai-live',on);
  if(on&&i>=0){i=-1;next.disabled=false;render()}
  document.querySelector('#aiInfo .ai-off').hidden=on;
  document.querySelector('#aiInfo .ai-on').hidden=!on;
  cap.textContent=on?'Con l’IA collegata in classe, la freccia arancio collega gli studenti al modello: ciò che scrivono esce dal browser e le risposte cambiano a ogni uso.':CAP_DEF;
 }
 sw.addEventListener('click',()=>setAI(sw.getAttribute('aria-checked')!=='true'));
 render();
})();
