"use strict";
/* Slide interattive della lezione introduttiva: navigazione, percorso In aula / Completo,
   note, schermo intero, stampa e quattro simulazioni didattiche (nessuna IA, nessun dato inviato). */
(()=>{
 const deck=document.getElementById('deck');if(!deck)return;
 const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const store={get(k){try{return localStorage.getItem(k)}catch{return null}},set(k,v){try{localStorage.setItem(k,v)}catch{}}};
 const slides=$$(':scope > .slide',deck);
 const LV={essenziale:'Essenziale · in aula',approfondimento:'Approfondimento · studio personale'};

 /* ---------- etichette e intestazione delle slide ---------- */
 slides.forEach((s,i)=>{const row=document.createElement('div');row.className='slide-top';
  const b=document.createElement('span');b.className='lv-badge '+(s.dataset.level==='approfondimento'?'app':'ess');b.textContent=LV[s.dataset.level]||'';
  const n=document.createElement('span');n.className='slide-num';n.textContent='Slide '+(i+1)+' di '+slides.length;
  row.append(b,n);s.prepend(row)});

 /* ---------- percorso, navigazione ---------- */
 let mode=store.get('vibeLv2Mode')==='aula'?'aula':'completo';
 let cur=0;
 const shown=()=>slides.filter(s=>mode!=='aula'||s.dataset.level!=='approfondimento');
 const dots=$('#deckDots'),count=$('#slideCount'),prev=$('#prevSlide'),next=$('#nextSlide');
 function buildDots(){dots.textContent='';shown().forEach(s=>{const b=document.createElement('button');b.type='button';b.className=s.dataset.level==='approfondimento'?'app':'';
  const i=slides.indexOf(s);b.setAttribute('aria-label','Vai alla slide '+(i+1)+': '+(s.querySelector('h2')?.textContent||''));b.addEventListener('click',()=>go(i,true));dots.append(b)})}
 function go(i,focus){i=Math.max(0,Math.min(slides.length-1,i));if(!shown().includes(slides[i])){const v=shown();const after=v.find(s=>slides.indexOf(s)>=i);i=slides.indexOf(after||v[v.length-1])}
  cur=i;slides.forEach((s,j)=>{s.hidden=j!==i});
  const v=shown(),pos=v.indexOf(slides[i]);
  count.textContent='Slide '+(pos+1)+' di '+v.length+(mode==='aula'?' · in aula':'');
  $$('button',dots).forEach((b,j)=>b.setAttribute('aria-current',j===pos?'step':'false'));
  prev.disabled=pos===0;next.disabled=pos===v.length-1;
  try{history.replaceState(null,'','#'+slides[i].id)}catch{}
  if(focus){const h=slides[i].querySelector('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true})}
   const top=deck.getBoundingClientRect().top;if(top<0||top>innerHeight*.4)deck.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}
 const step=d=>{const v=shown();const p=v.indexOf(slides[cur]);const t=v[p+d];if(t)go(slides.indexOf(t),true)};
 prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
 function setMode(m){mode=m==='aula'?'aula':'completo';store.set('vibeLv2Mode',mode);$$('.deck-mode button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));buildDots();go(cur,false)}
 $$('.deck-mode button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
 document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target;if(t.closest&&t.closest('input,textarea,select,[contenteditable=true]'))return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();step(1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();step(-1)}
  else if(e.key==='Home'&&t===document.body){go(slides.indexOf(shown()[0]),true)}else if(e.key==='End'&&t===document.body){const v=shown();go(slides.indexOf(v[v.length-1]),true)}});
 let tx=0,ty=0;deck.addEventListener('touchstart',e=>{const p=e.changedTouches[0];tx=p.clientX;ty=p.clientY},{passive:true});
 deck.addEventListener('touchend',e=>{if(e.target.closest('input,textarea,.bars,.tok-out,.diagram-fig,.table-wrap'))return;const p=e.changedTouches[0],dx=p.clientX-tx,dy=p.clientY-ty;if(Math.abs(dx)>70&&Math.abs(dy)<50)step(dx<0?1:-1)},{passive:true});
 document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#s"]');if(!a)return;const s=document.getElementById(a.getAttribute('href').slice(1));if(s&&slides.includes(s)){e.preventDefault();if(mode==='aula'&&s.dataset.level==='approfondimento')setMode('completo');go(slides.indexOf(s),true)}});

 /* ---------- note, schermo intero, stampa ---------- */
 const notesBtn=$('#notesToggle');
 function setNotes(on){$$('details.notes',deck).forEach(d=>d.open=on);notesBtn.setAttribute('aria-pressed',String(on));notesBtn.textContent=on?'Nascondi le note':'Mostra le note';store.set('vibeSlidesNotes',on?'1':'')}
 notesBtn.addEventListener('click',()=>setNotes(notesBtn.getAttribute('aria-pressed')!=='true'));
 const full=$('#fullToggle'),area=document.getElementById('contenuti');
 if(!document.fullscreenEnabled||!area.requestFullscreen)full.hidden=true;
 full.addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen();else area.requestFullscreen().catch(()=>{})});
 document.addEventListener('fullscreenchange',()=>{full.textContent=document.fullscreenElement?'Esci dallo schermo intero':'⛶ Schermo intero'});
 let wasOpen=[];
 addEventListener('beforeprint',()=>{wasOpen=$$('details',deck).map(d=>d.open);$$('details',deck).forEach(d=>d.open=true)});
 addEventListener('afterprint',()=>{$$('details',deck).forEach((d,i)=>d.open=!!wasOpen[i])});

 /* ---------- grafico a barre riutilizzabile ---------- */
 function bars(el,items,hit){el.textContent='';const max=Math.max(...items.map(x=>x[1]));
  items.forEach(([lab,p])=>{const r=document.createElement('div');r.className='bar-row'+(p===max?' top':'')+(lab===hit?' hit':'');
   r.innerHTML='<span class="bl"></span><span class="bar-track"><span class="bar-fill" style="width:0"></span></span><span class="bar-pct"></span>';
   r.querySelector('.bl').textContent=lab;r.querySelector('.bar-pct').textContent=(p<1&&p>0?'<1':Math.round(p))+'%';el.append(r);
   requestAnimationFrame(()=>requestAnimationFrame(()=>{r.querySelector('.bar-fill').style.width=Math.max(p,.6)+'%'}))})}

 /* ---------- sondaggio ---------- */
 const poll=$('#poll');
 if(poll)poll.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',poll).forEach(x=>{x.setAttribute('aria-pressed',String(x===b));x.classList.toggle('right',x.dataset.k==='d')});poll.classList.add('done');$('#pollAnswer').hidden=false});

 /* ---------- 1. parola successiva e temperatura ---------- */
 const NW={'':[['letto',40],['studiato',30],['fatto',18],['visto',9],['cucinato',3]],
  letto:[['una poesia',45],['un racconto',30],['il giornale',15],['le istruzioni',7],['un menù',3]],
  studiato:[['la fotosintesi',35],['le frazioni',30],['il Rinascimento',25],['i verbi',7],['il meteo',3]],
  fatto:[['un esperimento',45],['una verifica',35],['merenda',12],['pace',5],['un pisolino',3]],
  visto:[['un documentario',55],['un film',30],['la neve',10],['un fantasma',5]],
  cucinato:[['una torta',60],['la pasta',30],['un vulcano',10]]};
 const simN=$('#simNext');
 if(simN){
  const out=$('#nwOut'),barsEl=$('#nwBars'),temp=$('#nwTemp'),tv=$('#nwTempV'),th=$('#nwTempH'),list=$('#nwList');
  let words=[];
  const T=()=>Number(temp.value);
  const adj=items=>{const t=T();if(t===0){const m=Math.max(...items.map(x=>x[1]));let done=false;return items.map(([l,p])=>{const on=p===m&&!done;if(on)done=true;return [l,on?100:0]})}
   const w=items.map(([l,p])=>[l,Math.pow(p,1/t)]);const s=w.reduce((a,x)=>a+x[1],0);return w.map(([l,x])=>[l,x/s*100])};
  const pick=items=>{let r=Math.random()*100;for(const [l,p] of items){r-=p;if(r<=0)return l}return items[items.length-1][0]};
  const dist=()=>words.length===0?NW['']:words.length===1?NW[words[0]]:null;
  function draw(hit){const d=dist();out.textContent=words.join(' ')+(words.length===2?'.':'');
   if(d){bars(barsEl,adj(d),hit)}else{barsEl.innerHTML='<p class="sim-done">Frase completa. Premi «Ricomincia» oppure genera più frasi per confrontarle.</p>'}
   $('#nwStep').disabled=!d}
  function label(){const t=T();tv.textContent=t.toFixed(1).replace('.',',');th.textContent=t===0?'· sceglie sempre la più probabile':t<.7?'· prudente':t<=1.1?'· equilibrata':'· creativa: escono scelte rare'}
  $('#nwStep').addEventListener('click',()=>{const d=dist();if(!d)return;const w=pick(adj(d));const hitList=adj(d);words.push(w);
   bars(barsEl,hitList,w);out.textContent=words.join(' ')+(words.length===2?'.':'');setTimeout(()=>draw(),words.length===2?50:900);$('#nwStep').disabled=true;if(words.length<2)setTimeout(()=>{$('#nwStep').disabled=false},900)});
  $('#nwReset').addEventListener('click',()=>{words=[];list.textContent='';draw()});
  $('#nwTen').addEventListener('click',()=>{list.textContent='';const seen=new Set();const rare=new Set(['cucinato','un menù','il meteo','pace','un pisolino','un fantasma','un vulcano','merenda']);
   for(let k=0;k<8;k++){const a=pick(adj(NW[''])),b=pick(adj(NW[a]));const s='Oggi in classe abbiamo '+a+' '+b+'.';seen.add(s);const li=document.createElement('li');li.textContent=s;if(rare.has(a)||rare.has(b))li.className='rare';list.append(li)}
   const p=document.createElement('li');p.className='sim-summary';p.style.listStyle='none';p.textContent=seen.size===1?'Una sola frase, ripetuta 8 volte.':seen.size+' frasi diverse su 8.';list.append(p)});
  temp.addEventListener('input',()=>{label();draw()});
  label();draw();
 }

 /* ---------- 2. token (simulazione semplificata) ---------- */
 const tokIn=$('#tokIn');
 if(tokIn){
  const COMMON=new Set('il lo la i gli le un uno una di a da in con su per tra fra e o ma se che non è sono ha hanno come più anche del della dei delle al alla nel nella questo questa quello essere avere fare oggi classe scuola anno'.split(' '));
  const SUF=['zione','zioni','mente','mento','menti','ità','ando','endo','are','ere','ire','ato','ata','ati','ate','ito','ita','oso','osa','ica','ico','ici','iche','ista','isti','ismo','ante','ente','anza','enza','ale','ali'];
  const splitWord=w=>{const low=w.toLowerCase();if(w.length<=4||COMMON.has(low))return [w];let suf='';for(const s of SUF){if(low.endsWith(s)&&w.length-s.length>=3){suf=w.slice(w.length-s.length);break}}
   let stem=suf?w.slice(0,w.length-suf.length):w;const parts=[];while(stem.length>5){parts.push(stem.slice(0,4));stem=stem.slice(4)}parts.push(stem);if(suf)parts.push(suf);return parts};
  const run=()=>{const txt=tokIn.value;const out=$('#tokOut');out.textContent='';let n=0,k=0;const words=(txt.match(/[\p{L}\d]+/gu)||[]).length;
   const re=/(\s*)([\p{L}]+[’']?|\d{1,3}|[^\s\p{L}\d])/gu;let m;
   while((m=re.exec(txt))){const pieces=/^[\p{L}]/u.test(m[2])?splitWord(m[2]):[m[2]];pieces.forEach((p,i)=>{const s=document.createElement('span');s.className='tok c'+(k%5)+(i===0&&m[1]?' sp':'');s.textContent=p;out.append(s);k++;n++})}
   $('#tokStats').textContent=txt.length+' caratteri · '+words+' parole · '+n+' token in questa simulazione';};
  tokIn.addEventListener('input',run);run();
 }

 /* ---------- 3. contesto ---------- */
 const CTX=[['Lezione di scienze sulla fotosintesi:',[['luce',40],['acqua',28],['anidride carbonica',20],['clorofilla',9],['attenzioni',3]]],
  ['Dal fioraio, una cliente chiede consigli:',[['acqua',34],['un vaso più grande',26],['sole',20],['concime',16],['luce',4]]],
  ['Ufficio del personale, si parla di organico:',[['nuovo personale',42],['essere aggiornata',30],['un’approvazione',20],['due insegnanti',6],['luce',2]]]];
 const ctx=$('#simCtx');
 if(ctx){const sel=i=>{$$('.ctx-pick button',ctx).forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.c)===i)));$('#ctxLabel').textContent=CTX[i][0];bars($('#ctxBars'),CTX[i][1])};
  $$('.ctx-pick button',ctx).forEach(b=>b.addEventListener('click',()=>sel(Number(b.dataset.c))));sel(0)}

 /* ---------- 4. finestra di contesto ---------- */
 const CAP=10;
 const MSG=[['you','Specifica: quiz di 3 domande, una sola risposta corretta per domanda, niente dati personali',3,'spec'],
  ['ai','Ecco il quiz: file HTML completo',3],
  ['you','Cambia i colori in blu',1],
  ['ai','Codice aggiornato',3],
  ['you','Aggiungi un timer di 60 secondi',1],
  ['ai','Codice aggiornato con il timer',3],
  ['you','Aggiungi una quarta domanda',1],
  ['ai','Ecco la domanda 4… con due risposte corrette',2,'bad']];
 const win=$('#simWin');
 if(win){let shownN=2;const list=$('#winList'),alert=$('#winAlert'),add=$('#winAdd');
  const head=document.createElement('div');head.className='win-head';win.insertBefore(head,win.firstChild);
  const draw=()=>{list.textContent='';let used=0;const inside=new Array(shownN).fill(false);for(let i=shownN-1;i>=0;i--){if(used+MSG[i][2]<=CAP){used+=MSG[i][2];inside[i]=true}else break}
   MSG.slice(0,shownN).forEach((m,i)=>{const li=document.createElement('li');li.className=m[0]+(m[3]?' '+m[3]:'')+(inside[i]?'':' out');
    li.innerHTML='<span class="win-who"></span><span class="wt"></span><span class="win-units"></span>';li.querySelector('.win-who').textContent=m[0]==='you'?'Tu':'IA';li.querySelector('.wt').textContent=m[1];
    if(!inside[i]){const t=document.createElement('span');t.className='win-tag';t.textContent='fuori dalla finestra';li.querySelector('.wt').append(t)}
    li.querySelector('.win-units').innerHTML='<i></i>'.repeat(m[2]);list.append(li)});
   head.innerHTML='<span>Capienza della finestra: '+CAP+' unità</span><span>Occupate: '+used+' <span class="win-meter">'+Array.from({length:CAP},(_,k)=>'<i class="'+(k<used?(used>=CAP-1?'full':'on'):'')+'"></i>').join('')+'</span></span>';
   const specOut=!inside[0];
   if(specOut){alert.hidden=false;alert.textContent=shownN===MSG.length?'La specifica iniziale è fuori dalla finestra: il modello non la «vede» più. Infatti la nuova domanda ha due risposte corrette, contro la specifica. Rimedio: riproponi la specifica o apri una nuova chat allegandola.':'Attenzione: la specifica iniziale è appena uscita dalla finestra di contesto.'}else alert.hidden=true;
   add.disabled=shownN>=MSG.length};
  add.addEventListener('click',()=>{if(shownN<MSG.length){shownN++;draw()}});
  $('#winReset').addEventListener('click',()=>{shownN=2;draw()});draw()}

 /* ---------- verifica formativa ---------- */
 const QZ=[
  {c:'Un collega: «Ho chiesto due volte lo stesso quiz e ho ottenuto due versioni diverse. L’IA è guasta?» Che cosa gli rispondi?',
   o:['È normale: a ogni passo il modello sceglie tra continuazioni probabili, quindi le versioni possono differire.','È un guasto: a parità di prompt un programma deve restituire sempre lo stesso identico risultato, come una calcolatrice.','Dipende dalla connessione: con una rete lenta il modello riceve il prompt incompleto.','Il modello ha imparato dalla prima richiesta e nella seconda ha corretto i propri errori.'],a:0,
   f:'La generazione è probabilistica: la variabilità è attesa. Per questo i test si decidono prima e valgono per qualunque versione.'},
  {c:'L’assistente ti propone un articolo scientifico con autori, rivista e anno da citare nella lezione. Che cosa fai?',
   o:['Lo citi: la presenza di rivista e anno indica che il riferimento è stato controllato.','Cerchi l’articolo nel catalogo o sul sito della rivista prima di citarlo.','Chiedi all’IA se è sicura e, se conferma, lo citi.','Lo citi aggiungendo la nota «fonte suggerita dall’IA», così chi legge sa da dove proviene.'],a:1,
   f:'Riferimenti completi e precisi possono essere inventati. Chiedere conferma all’IA produce altro testo, non una verifica.'},
  {c:'Dopo una lunga conversazione con molto codice, l’IA inizia a mettere due risposte corrette per domanda, contro la specifica iniziale. Che cosa è più probabile e come rimedi?',
   o:['L’IA si è «stancata»: conviene fare una pausa e riprendere tra qualche minuto.','Il modello ha imparato dalle tue correzioni e ha deciso di cambiare le regole del quiz.','La specifica pesa meno o è uscita dalla finestra: la riproponi o apri una nuova chat allegandola.','È un problema del browser: basta ricaricare la pagina della chat.'],a:2,
   f:'Il modello lavora su ciò che ha nella finestra di contesto: indicazioni lontane possono perdersi. La specifica va riproposta.'},
  {c:'Vuoi una spiegazione del ciclo dell’acqua per la tua classe. Quale aggiunta al prompt cambia di più, e in meglio, la risposta?',
   o:['«Rispondi in modo accurato, completo e senza errori.»','«Sei il miglior insegnante di scienze del mondo.»','«Per alunni di prima media con difficoltà di lettura: cinque frasi brevi e un esempio quotidiano.»','«È molto importante: ricontrolla tre volte prima di rispondere.»'],a:2,
   f:'Destinatari, formato e vincoli cambiano il contesto da cui il modello parte; le esortazioni generiche aggiungono poco.'},
  {c:'Chiedi chi ha vinto un premio assegnato il mese scorso. L’assistente non ha la ricerca web attiva e risponde con un nome, senza esitare. Come lo valuti?',
   o:['Affidabile: i modelli vengono aggiornati ogni giorno con le notizie, quindi conoscono anche i fatti più recenti.','Da verificare: l’evento è probabilmente dopo la data limite, e il nome può essere plausibile ma sbagliato.','Affidabile, perché il modello non ha mostrato alcuna esitazione nella risposta.','Affidabile se il nome corrisponde a una persona che esiste davvero.'],a:1,
   f:'Senza strumenti di ricerca il modello non conosce i fatti successivi all’addestramento; il tono sicuro non è un indizio di correttezza.'},
  {c:'Per personalizzare il quiz vorresti incollare nel prompt l’elenco della classe con i voti del primo trimestre. Perché non farlo?',
   o:['Perché l’IA non è in grado di leggere tabelle con nomi e numeri.','Perché il file del quiz diventerebbe troppo pesante da aprire.','Non ci sono problemi, purché tu cancelli la chat subito dopo aver ottenuto il quiz personalizzato.','Perché il prompt viene inviato al fornitore del servizio: sono dati personali che escono dalla scuola.'],a:3,
   f:'Ciò che scrivi nel prompt arriva ai server del fornitore. Nel prompt vanno solo contenuti dimostrativi, mai dati degli studenti.'}];
 const fq=$('#fquiz');
 if(fq){const answered=new Array(QZ.length).fill(null);
  QZ.forEach((q,qi)=>{const fs=document.createElement('fieldset');const lg=document.createElement('legend');lg.textContent=(qi+1)+'. '+q.c;fs.append(lg);
   const order=q.o.map((_,i)=>i).sort(()=>Math.random()-.5);
   order.forEach(oi=>{const l=document.createElement('label');l.className='opt';const r=document.createElement('input');r.type='radio';r.name='fq'+qi;r.value=String(oi);const sp=document.createElement('span');sp.textContent=q.o[oi];l.append(r,sp);fs.append(l)});
   const fb=document.createElement('p');fb.className='fb';fb.hidden=true;fb.setAttribute('role','status');fs.append(fb);
   fs.addEventListener('change',e=>{const v=Number(e.target.value);answered[qi]=v===q.a;
    $$('.opt',fs).forEach(l=>{const val=Number(l.querySelector('input').value);l.classList.toggle('ok',val===q.a);l.classList.toggle('ko',val===v&&v!==q.a)});
    fb.hidden=false;fb.className='fb '+(v===q.a?'ok':'ko');fb.textContent=(v===q.a?'Esatto. ':'Non proprio. ')+q.f;
    const done=answered.filter(x=>x!==null).length;$('#fquizScore').textContent=done===QZ.length?'Risultato: '+answered.filter(Boolean).length+' su '+QZ.length+'. Rileggi le slide collegate alle situazioni sbagliate.':'Situazioni svolte: '+done+' di '+QZ.length+'.'});
   fq.append(fs)})}

 /* ---------- avvio ---------- */
 $$('.deck-mode button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 buildDots();
 let start=0;const h=decodeURIComponent(location.hash.slice(1));const target=h&&document.getElementById(h);
 if(target){const s=target.closest('.slide');if(s){if(mode==='aula'&&s.dataset.level==='approfondimento')mode='completo';start=slides.indexOf(s)}}
 $$('.deck-mode button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));buildDots();
 go(start,false);
 addEventListener('hashchange',()=>{const el=document.getElementById(decodeURIComponent(location.hash.slice(1)));const s=el&&el.closest('.slide');if(s&&slides.indexOf(s)!==cur){if(mode==='aula'&&s.dataset.level==='approfondimento')setMode('completo');go(slides.indexOf(s),true)}});
 if(store.get('vibeSlidesNotes')==='1')setNotes(true);
})();
