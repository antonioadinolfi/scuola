"use strict";
/* UD12 · Lezione 3 — simulazioni interattive delle slide di approfondimento.
   Ogni simulazione si monta su un elemento [data-sim="nome"]. Nessun dato lascia il browser. */
(()=>{
const $=(r,s)=>r.querySelector(s),$$=(r,s)=>[...r.querySelectorAll(s)];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(n,d=0)=>Number(n).toLocaleString('it-IT',{minimumFractionDigits:d,maximumFractionDigits:d});
const now=()=>new Date().toLocaleTimeString('it-IT');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const S={};

/* 1. Online / offline e sincronizzazione */
S.sync=el=>{
 el.innerHTML=`<div class="row" style="justify-content:space-between"><h3>Preventivo_Rossi.docx</h3><div class="row"><span>Connessione:</span><button class="btn" data-a="net" aria-pressed="true">📶 Online</button></div></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px">
  <div><b>Sul tuo computer</b><div class="mini-doc" contenteditable="true" spellcheck="false">Gentile Sig. Rossi,
le inviamo il preventivo per la fornitura di 20 magliette personalizzate.</div></div>
  <div><b>Nel cloud</b> <span class="tag ok" data-o="st">Sincronizzato</span><div class="mini-doc" data-o="cloud" style="background:#f3f7fb"></div></div>
 </div><p class="out" data-o="msg" style="margin-top:8px">Scrivi nel documento a sinistra, poi prova a togliere la connessione.</p>`;
 const doc=$(el,'.mini-doc'),cloud=$(el,'[data-o=cloud]'),st=$(el,'[data-o=st]'),msg=$(el,'[data-o=msg]'),b=$(el,'[data-a=net]');
 let online=true,queue=0,t;cloud.textContent=doc.textContent;
 const push=()=>{cloud.textContent=doc.textContent;st.className='tag ok';st.textContent='Sincronizzato';msg.textContent='Salvato nel cloud alle '+now()+'.'};
 doc.addEventListener('input',()=>{if(online){st.className='tag wait';st.textContent='Salvataggio…';clearTimeout(t);t=setTimeout(push,700)}else{queue++;st.className='tag ko';st.textContent='Non sincronizzato';msg.textContent=queue+' modifiche in attesa: restano solo su questo computer.'}});
 b.onclick=()=>{online=!online;b.setAttribute('aria-pressed',online);b.textContent=online?'📶 Online':'✈️ Offline';
  if(online){if(queue){st.className='tag wait';st.textContent='Sincronizzazione…';msg.textContent='Connessione tornata: invio '+queue+' modifiche…';setTimeout(()=>{push();msg.textContent='Sincronizzate '+queue+' modifiche alle '+now()+'.';queue=0},1200)}else msg.textContent='Di nuovo online.'}
  else msg.textContent='Offline: con un programma installato continui a lavorare; un’app solo web smetterebbe di funzionare.'};
};

/* 2. Mini foglio di calcolo con formule */
S.foglio=el=>{
 const init=[['Voce','€ al mese'],['Ricavi','4500'],['Affitto','700'],['Materiali','1200'],['Utenze e telefono','250'],['Costi totali','=SOMMA(B3:B5)'],['Utile','=B2-B6'],['Margine %','=B7/B2*100']];
 const R=init.length,C=2,cols='AB';const data=init.map(r=>[...r]);
 el.innerHTML=`<div class="fx"><b data-o="ref">B2</b><span>ƒx</span><span data-o="raw"></span></div><table class="sheet"><thead><tr><th></th><th>A</th><th>B</th></tr></thead><tbody></tbody></table><p class="small muted" style="margin:8px 0 0">Prova: cambia i Ricavi in B2, oppure scrivi in B6 <code>=B3+B4+B5</code>. Le celle verdi sono calcolate da formule.</p>`;
 const tb=$(el,'tbody');
 for(let r=0;r<R;r++){const tr=document.createElement('tr');tr.innerHTML='<th>'+(r+1)+'</th>'+[0,1].map(c=>'<td><input data-r="'+r+'" data-c="'+c+'" aria-label="Cella '+cols[c]+(r+1)+'"></td>').join('');tb.append(tr)}
 const val=(r,c,seen=new Set())=>{const raw=data[r]?.[c]??'';if(!String(raw).startsWith('='))return parseFloat(String(raw).replace(',','.'))||0;const k=r+','+c;if(seen.has(k))throw Error('ciclo');seen.add(k);
  let e=raw.slice(1).toUpperCase().replace(/(SOMMA|MEDIA)\(([AB])(\d+):([AB])(\d+)\)/g,(m,f,c1,r1,c2,r2)=>{const v=[];for(let rr=+r1;rr<=+r2;rr++)for(let cc=cols.indexOf(c1);cc<=cols.indexOf(c2);cc++)v.push(val(rr-1,cc,new Set(seen)));const s=v.reduce((a,b)=>a+b,0);return '('+(f==='SOMMA'?s:s/v.length)+')'});
  e=e.replace(/([AB])(\d+)/g,(m,cc,rr)=>'('+val(+rr-1,cols.indexOf(cc),new Set(seen))+')').replace(/,/g,'.');
  if(!/^[0-9+\-*/().\s]*$/.test(e))throw Error('formula');const v=Function('return '+e)();if(!isFinite(v))throw Error('div0');return v};
 const show=()=>$$(tb,'input').forEach(i=>{const r=+i.dataset.r,c=+i.dataset.c,raw=data[r][c];const td=i.parentElement;td.classList.toggle('calc',String(raw).startsWith('='));td.classList.remove('err');
  if(document.activeElement===i){i.value=raw;return}
  if(String(raw).startsWith('=')){try{const v=val(r,c);i.value=fmt(v,r===7?1:0)+(r===7?' %':'')}catch(e){i.value='#ERRORE';td.classList.add('err')}}else i.value=c===1&&r>0&&raw!==''&&!isNaN(parseFloat(raw))?fmt(parseFloat(raw)):raw});
 tb.addEventListener('focusin',e=>{const i=e.target;if(!i.dataset)return;$(el,'[data-o=ref]').textContent=cols[i.dataset.c]+(+i.dataset.r+1);$(el,'[data-o=raw]').textContent=data[i.dataset.r][i.dataset.c];i.value=data[i.dataset.r][i.dataset.c]});
 tb.addEventListener('input',e=>{const i=e.target;data[i.dataset.r][i.dataset.c]=i.value;$(el,'[data-o=raw]').textContent=i.value});
 tb.addEventListener('focusout',()=>setTimeout(show,0));
 tb.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();const i=e.target,n=$(tb,'input[data-r="'+(+i.dataset.r+1)+'"][data-c="'+i.dataset.c+'"]');(n||i).focus();if(!n)i.blur()}});
 show();
};

/* 3. Stili e indice automatico */
S.stili=el=>{
 const P=[['Titolo 1','Piano di impresa'],['Titolo 2','L’idea'],['Corpo','Stampa digitale su abbigliamento per scuole e società sportive.'],['Titolo 2','Il mercato'],['Corpo','Nel comune ci sono 9 scuole e 14 associazioni sportive.'],['Titolo 2','Le spese'],['Corpo','Plotter, pressa termica, PC e software.']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:16px"><div><h3>Assegna gli stili</h3><div data-o="list"></div><div class="row" style="margin-top:8px"><button class="btn gold" data-a="font">Cambia l’aspetto di tutti i «Titolo 2»</button></div></div><div><h3>Anteprima del documento</h3><div class="mini-doc" data-o="prev" style="min-height:300px;white-space:normal"></div></div></div>`;
 const list=$(el,'[data-o=list]'),prev=$(el,'[data-o=prev]');let alt=false;
 P.forEach((p,k)=>{const d=document.createElement('div');d.className='row';d.style.margin='0 0 5px';d.innerHTML='<select data-k="'+k+'"><option>Titolo 1</option><option>Titolo 2</option><option>Corpo</option></select><span style="font-size:16px">'+esc(p[1])+'</span>';$(d,'select').value=p[0];list.append(d)});
 const draw=()=>{const toc=P.filter(p=>p[0]!=='Corpo');prev.innerHTML='<div style="border:1px dashed #a9bfce;border-radius:8px;padding:6px 10px;margin-bottom:10px;font-size:15px"><b>Indice (generato automaticamente)</b>'+toc.map(p=>'<div style="padding-left:'+(p[0]==='Titolo 2'?18:0)+'px">'+esc(p[1])+'</div>').join('')+'</div>'+P.map(p=>p[0]==='Titolo 1'?'<div style="font-size:26px;font-weight:800;color:#102a43">'+esc(p[1])+'</div>':p[0]==='Titolo 2'?'<div style="font-size:20px;font-weight:800;margin-top:6px;color:'+(alt?'#d9822b':'#176b87')+';'+(alt?'text-transform:uppercase;letter-spacing:.06em':'')+'">'+esc(p[1])+'</div>':'<div style="font-size:16px">'+esc(p[1])+'</div>').join('')};
 list.addEventListener('change',e=>{P[e.target.dataset.k][0]=e.target.value;draw()});
 $(el,'[data-a=font]').onclick=()=>{alt=!alt;draw()};draw();
};

/* 4. Collaborazione in tempo reale e cronologia delle versioni */
S.collab=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.4fr 1fr;gap:16px"><div><div class="row" style="justify-content:space-between"><h3>Volantino_inaugurazione</h3><div class="row"><span class="tag" style="background:#d8eefb">Anna</span><span class="tag" style="background:#fde4d4">Marco</span></div></div><div class="mini-doc" data-o="doc" style="min-height:190px;white-space:normal"></div><div class="row" style="margin-top:8px"><button class="btn gold" data-a="play">▶ Avvia la simulazione</button><button class="btn ghost" data-a="reset">Ricomincia</button></div></div>
 <div><h3>Cronologia delle versioni</h3><ol data-o="hist" style="font-size:16px;padding-left:22px"></ol><p class="small muted" style="font-size:15px">Clicca una versione per ripristinarla.</p></div></div>`;
 const doc=$(el,'[data-o=doc]'),hist=$(el,'[data-o=hist]');let versions=[],timers=[];
 const base='<p><b>Inaugurazione del laboratorio</b></p><p>Sabato vi aspettiamo per l’apertura.</p>';
 const steps=[[600,'Anna','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p>','Anna aggiunge data e ora'],
  [1800,'Marco','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p><p style="background:#fde4d4">Gadget personalizzato in omaggio ai primi 30 visitatori!</p>','Marco aggiunge l’omaggio'],
  [3000,'Anna','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato <span style="background:#d8eefb">14 marzo, ore 17</span> vi aspettiamo per l’apertura.</p><p style="background:#fde4d4">Gadget personalizzato in omaggio ai primi 30 visitatori!</p><p style="font-size:14px;border-left:4px solid #f4b942;padding-left:8px">💬 Anna: «30 o 50? Verifichiamo le scorte.»</p>','Anna inserisce un commento'],
  [4300,'Marco','<p><b>Inaugurazione del laboratorio</b></p><p>Sabato vi aspettiamo per l’apertura.</p>','Marco cancella per errore due paragrafi']];
 const addV=(who,html,what)=>{versions.push({who,html,what,t:now()});const li=document.createElement('li');li.innerHTML='<button class="chip" style="font-size:14px">'+esc(versions.at(-1).t)+' · '+esc(what)+'</button>';const k=versions.length-1;li.firstChild.onclick=()=>{doc.innerHTML=versions[k].html;addV('Tu',versions[k].html,'Ripristinata la versione '+(k+1))};hist.append(li)};
 const reset=()=>{timers.forEach(clearTimeout);timers=[];versions=[];hist.innerHTML='';doc.innerHTML=base;addV('Anna',base,'Versione iniziale')};
 $(el,'[data-a=play]').onclick=()=>{reset();steps.forEach(([ms,who,html,what])=>timers.push(setTimeout(()=>{doc.innerHTML=html;addV(who,html,what)},reduced?ms/4:ms)))};
 $(el,'[data-a=reset]').onclick=reset;reset();
};

/* 5. Matrice di scelta del software con pesi */
S.scelta=el=>{
 const crit=[['Compatibilità con i file Office',[3,3,5]],['Collaborazione in tempo reale',[1,5,4]],['Lavoro senza connessione',[5,2,4]],['Costo contenuto',[5,4,2]],['Controllo dei dati (dove sono salvati)',[5,2,3]],['Facilità d’uso',[3,5,4]],['Supporto e assistenza',[3,3,4]]];
 const sw=[['LibreOffice','#2a9d8f'],['Google Documenti/Fogli','#176b87'],['Microsoft 365 / Office','#d9822b']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.25fr 1fr;gap:20px"><div><h3>Quanto conta per te? (peso 0–5)</h3><div data-o="w"></div></div><div><h3>Punteggio pesato</h3><div data-o="bars"></div><p class="small muted" style="font-size:15px;margin-top:8px">Punteggi da 1 a 5 indicativi, da discutere in aula: cambiano con la versione e il piano scelto.</p></div></div>`;
 const w=$(el,'[data-o=w]'),bars=$(el,'[data-o=bars]');
 crit.forEach((c,k)=>{const l=document.createElement('label');l.className='sl';l.innerHTML='<span>'+esc(c[0])+'</span><input type="range" min="0" max="5" value="3" data-k="'+k+'"><b>3</b>';w.append(l)});
 const draw=()=>{const ws=$$(w,'input').map(i=>+i.value);$$(w,'label b').forEach((b,k)=>b.textContent=ws[k]);const max=ws.reduce((a,b)=>a+b,0)*5||1;
  const tot=sw.map((s,j)=>crit.reduce((a,c,k)=>a+c[1][j]*ws[k],0));const best=Math.max(...tot);
  bars.innerHTML=sw.map((s,j)=>'<div style="margin:0 0 12px"><div class="row" style="justify-content:space-between"><b>'+s[0]+'</b><span>'+tot[j]+' / '+max+(tot[j]===best?' ★':'')+'</span></div><div class="meter" style="height:22px"><span style="width:'+(tot[j]/max*100)+'%;background:'+s[1]+'"></span></div></div>').join('')};
 w.addEventListener('input',draw);draw();
};

/* 6. Da CSV a grafico, con controllo dei metadati */
S.csv=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:.9fr 1.3fr;gap:18px"><div><h3>Dati (CSV, separatore ;)</h3><textarea data-o="t" rows="6" style="width:100%;font-family:ui-monospace,Consolas,monospace;font-size:16px">anno;nuove imprese
2021;118
2022;131
2023;127
2024;142
2025;150</textarea><p class="small muted" style="font-size:14px;margin:4px 0">Dati di esempio, non reali: sostituiscili con un dataset vero scaricato in aula.</p>
 <h3 style="margin-top:6px">Metadati presenti?</h3><div class="chips" data-o="m"><button class="chip" data-m>Ente che pubblica</button><button class="chip" data-m>Licenza (es. CC BY 4.0)</button><button class="chip" data-m>Data di aggiornamento</button><button class="chip" data-m>Unità di misura</button><button class="chip" data-m>Territorio di riferimento</button></div></div>
 <div><svg class="ig" data-o="g" viewBox="0 0 560 300" role="img" aria-label="Grafico a barre dei dati"></svg><p class="out" data-o="v"></p></div></div>`;
 const t=$(el,'[data-o=t]'),g=$(el,'[data-o=g]'),v=$(el,'[data-o=v]');
 const draw=()=>{const rows=t.value.trim().split(/\n/).map(r=>r.split(/[;,\t]/));const head=rows.shift()||[];const pts=rows.filter(r=>r.length>1&&!isNaN(parseFloat(r[1]))).map(r=>[r[0],parseFloat(r[1])]);
  if(!pts.length){g.innerHTML='<text x="20" y="40" font-size="18" fill="#8a3d06">Nessun dato numerico valido nella seconda colonna.</text>';return}
  const max=Math.max(...pts.map(p=>p[1]))*1.15,bw=440/pts.length;
  g.innerHTML='<line x1="60" y1="250" x2="540" y2="250" stroke="#9aa9b8"/><text x="60" y="22" font-size="16" font-weight="700" fill="#102a43">'+esc(head[1]||'valore')+' per '+esc(head[0]||'categoria')+'</text>'+pts.map((p,k)=>{const h=p[1]/max*210,x=70+k*bw;return '<rect x="'+(x+6)+'" y="'+(250-h)+'" width="'+(bw-12)+'" height="'+h+'" rx="5" fill="#176b87"><animate attributeName="height" from="0" to="'+h+'" dur=".5s"/><animate attributeName="y" from="250" to="'+(250-h)+'" dur=".5s"/></rect><text x="'+(x+bw/2)+'" y="'+(244-h)+'" text-anchor="middle" font-size="15" font-weight="700" fill="#102a43">'+fmt(p[1])+'</text><text x="'+(x+bw/2)+'" y="272" text-anchor="middle" font-size="15" fill="#52657a">'+esc(p[0])+'</text>'}).join('')};
 const meta=()=>{const on=$$(el,'[data-m].sel').length;v.textContent=on===5?'✓ Dataset documentato: si può citare e riutilizzare secondo la licenza.':on>=3?'Quasi: mancano '+(5-on)+' metadati. Senza licenza o fonte il riuso è a rischio.':'Dati poco affidabili: senza metadati non sai chi li ha prodotti, quando, con quale licenza.'};
 $(el,'[data-o=m]').addEventListener('click',e=>{const c=e.target.closest('[data-m]');if(c){c.classList.toggle('sel');meta()}});
 t.addEventListener('input',draw);draw();meta();
};

/* 7. Le 5 stelle degli open data */
S.stelle=el=>{
 const L=[['Sul web con licenza aperta','Un PDF con la tabella dei prezzi, pubblicato con licenza CC BY.','Lo leggi, ma per analizzarlo devi ricopiare i numeri a mano.'],['Dati strutturati','Un file Excel (.xlsx).','Puoi fare calcoli, ma serve un programma specifico.'],['Formato aperto','Un CSV, leggibile da qualsiasi programma.','Il formato più comune nei portali open data.'],['Identificatori web (URI)','Ogni dato ha un indirizzo web proprio (es. RDF).','Altri possono puntare al singolo dato.'],['Dati collegati (Linked Data)','I dati rimandano ad altri dataset (es. Comune → ISTAT).','Il livello più alto: i dati si combinano tra loro.']];
 el.innerHTML='<div class="stars">'+L.map((l,k)=>'<button class="star" data-k="'+k+'"><b>'+'★'.repeat(k+1)+'</b>'+esc(l[0])+'</button>').join('')+'</div><div class="s-box blue" data-o="d" style="margin-top:14px;font-size:20px">Tocca una stella.</div>';
 el.addEventListener('click',e=>{const b=e.target.closest('.star');if(!b)return;const k=+b.dataset.k;$$(el,'.star').forEach((s,j)=>s.classList.toggle('on',j<=k));$(el,'[data-o=d]').innerHTML='<b>'+(k+1)+' '+(k?'stelle':'stella')+' · '+esc(L[k][0])+'</b><br>Esempio: '+esc(L[k][1])+'<br>'+esc(L[k][2])});
};

/* 8. Classificazione a clic: scegli una scheda, poi il contenitore */
S.classifica=el=>{
 const cfg=JSON.parse(el.dataset.cfg);
 el.innerHTML='<p class="small" style="margin:0 0 8px;font-size:17px">Tocca una scheda, poi il contenitore giusto. Alla fine premi «Controlla».</p><div class="chips" data-o="pool"></div><div class="bins" style="grid-template-columns:repeat('+cfg.bins.length+',1fr);margin-top:12px">'+cfg.bins.map((b,k)=>'<div class="bin" tabindex="0" data-b="'+k+'"><h4>'+esc(b)+'</h4><div class="chips"></div></div>').join('')+'</div><div class="row" style="margin-top:10px"><button class="btn gold" data-a="chk">Controlla</button><button class="btn ghost" data-a="rst">Ricomincia</button><span class="out" data-o="o"></span></div>';
 const pool=$(el,'[data-o=pool]');let sel=null;
 const reset=()=>{pool.innerHTML='';$$(el,'.bin .chips').forEach(c=>c.innerHTML='');cfg.items.forEach(([t,b])=>{const c=document.createElement('button');c.className='chip';c.textContent=t;c.dataset.ok=b;pool.append(c)});$(el,'[data-o=o]').textContent=''};
 el.addEventListener('click',e=>{const c=e.target.closest('.chip'),bin=e.target.closest('.bin');
  if(bin&&sel&&c!==sel){bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null;return}
  if(c&&el.contains(c)&&c.dataset.ok!==undefined){$$(el,'.chip.sel').forEach(x=>x.classList.remove('sel'));sel=c;c.classList.add('sel');c.classList.remove('ok','ko');return}
  if(bin&&sel){bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null}});
 el.addEventListener('keydown',e=>{const bin=e.target.closest('.bin');if(bin&&(e.key==='Enter'||e.key===' ')&&sel){e.preventDefault();bin.querySelector('.chips').append(sel);sel.classList.remove('sel');sel=null}});
 $(el,'[data-a=chk]').onclick=()=>{let ok=0,n=0;$$(el,'.bin').forEach(b=>$$(b,'.chip').forEach(c=>{n++;const g=c.dataset.ok===b.dataset.b;c.classList.toggle('ok',g);c.classList.toggle('ko',!g);if(g)ok++}));const left=$$(pool,'.chip').length;$(el,'[data-o=o]').textContent=ok+' su '+cfg.items.length+' corrette'+(left?' · '+left+' ancora da collocare':ok===cfg.items.length?' — ottimo!':' — riguardiamo le arancioni.')};
 $(el,'[data-a=rst]').onclick=reset;reset();
};

/* 9. Antivirus: firme e analisi del comportamento */
S.antivirus=el=>{
 const F=[['foto_vetrina.jpg','pulito','Nessuna corrispondenza con le firme note.'],['fattura_marzo.pdf.exe','comportamento','Doppia estensione: si finge un PDF ma è un programma eseguibile.'],['listino_2026.xlsx','pulito','Nessuna macro, nessuna firma nota.'],['ordine_cliente.docm','comportamento','Contiene una macro che scarica file da Internet all’apertura.'],['aggiornamento_flash.exe','firma','L’impronta del file coincide con un malware già catalogato.']];
 el.innerHTML='<div class="row" style="justify-content:space-between"><h3>Cartella «Download»</h3><div class="row"><button class="btn gold" data-a="scan">🔍 Avvia la scansione</button><button class="btn ghost" data-a="rst">Ricomincia</button></div></div><div class="meter" style="margin:10px 0"><span data-o="p" style="background:#176b87"></span></div><table class="rules"><thead><tr><th>File</th><th>Esito</th><th>Perché</th></tr></thead><tbody>'+F.map(f=>'<tr><td><code>'+esc(f[0])+'</code></td><td class="r">—</td><td class="w" style="font-size:15px">—</td></tr>').join('')+'</tbody></table><p class="out" data-o="o" style="margin-top:8px"></p>';
 let t=[];const rows=$$(el,'tbody tr');
 const rst=()=>{t.forEach(clearTimeout);t=[];$(el,'[data-o=p]').style.width='0';rows.forEach(r=>{r.querySelector('.r').textContent='—';r.querySelector('.w').textContent='—'});$(el,'[data-o=o]').textContent=''};
 $(el,'[data-a=scan]').onclick=()=>{rst();F.forEach((f,k)=>t.push(setTimeout(()=>{$(el,'[data-o=p]').style.width=((k+1)/F.length*100)+'%';const r=rows[k];r.querySelector('.r').innerHTML=f[1]==='pulito'?'<span class="tag ok">Pulito</span>':f[1]==='firma'?'<span class="tag ko">Malware (firma)</span>':'<span class="tag wait">Sospetto → quarantena</span>';r.querySelector('.w').textContent=f[2];if(k===F.length-1)$(el,'[data-o=o]').textContent='Trovate 3 minacce su 5 file: 1 per firma, 2 per comportamento sospetto. Nessun antivirus garantisce il 100%.'},(k+1)*(reduced?150:700))))};
 $(el,'[data-a=rst]').onclick=rst;
};

/* 10. Firewall: regole e pacchetti */
S.firewall=el=>{
 const R=[['Uscita','Navigazione web HTTPS (porta 443)','Consenti'],['Uscita','Risoluzione nomi DNS (porta 53)','Consenti'],['Entrata','Desktop remoto da Internet (porta 3389)','Blocca'],['Entrata','Condivisione file da Internet (porta 445)','Blocca'],['Entrata','Risposta a una pagina che hai richiesto','Consenti']];
 const P=[[0,'→ HTTPS 443','Uscita'],[4,'← risposta del sito','Entrata'],[2,'← RDP 3389 da IP sconosciuto','Entrata'],[1,'→ DNS 53','Uscita'],[3,'← SMB 445 da Internet','Entrata']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1.05fr;gap:16px"><div><h3>Regole del firewall</h3><table class="rules"><thead><tr><th>Dir.</th><th>Traffico</th><th>Azione</th></tr></thead><tbody>${R.map((r,k)=>'<tr><td>'+r[0]+'</td><td style="font-size:15px">'+r[1]+'</td><td><select data-k="'+k+'"><option>Consenti</option><option>Blocca</option></select></td></tr>').join('')}</tbody></table><p class="small muted" style="font-size:15px;margin-top:6px">Tutto ciò che non è previsto viene bloccato (regola predefinita).</p></div>
 <div><div class="net" data-o="net"><div class="node" style="left:8px"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="26" fill="#e9f3f8" stroke="#176b87" stroke-width="3"/><path d="M6 32h52M32 6c10 10 10 42 0 52M32 6c-10 10-10 42 0 52" stroke="#176b87" stroke-width="3" fill="none"/></svg>Internet</div><div class="wall" title="Firewall"></div><div class="node" style="right:8px"><svg viewBox="0 0 64 64"><rect x="8" y="12" width="48" height="32" rx="4" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><path d="M20 54h24M32 44v10" stroke="#102a43" stroke-width="3"/></svg>Il tuo PC</div></div>
 <div class="row" style="margin:8px 0"><button class="btn gold" data-a="go">▶ Invia il traffico</button></div><div class="log" data-o="log" aria-live="polite"></div></div></div>`;
 $$(el,'select').forEach((s,k)=>s.value=R[k][2]);
 const net=$(el,'[data-o=net]'),log=$(el,'[data-o=log]');let busy=false;
 $(el,'[data-a=go]').onclick=()=>{if(busy)return;busy=true;log.textContent='';const W=net.clientWidth;
  P.forEach(([k,lab,dir],n)=>setTimeout(()=>{const allow=$$(el,'select')[k].value==='Consenti';const p=document.createElement('div');p.className='pkt';p.textContent=lab;net.append(p);const pw=p.offsetWidth;const inbound=dir==='Entrata';
   const start=inbound?120:W-120-pw,wall=inbound?W/2-pw-14:W/2+14,end=inbound?W-120-pw:120;p.style.left=start+'px';p.style.top=(30+n*42)+'px';p.style.marginTop='0';
   requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.left=(allow?end:wall)+'px'}));
   setTimeout(()=>{p.classList.add(allow?'ok':'blocked');log.textContent+=new Date().toLocaleTimeString('it-IT')+'  '+(allow?'CONSENTITO':'BLOCCATO ')+'  '+dir.toUpperCase()+'  '+R[k][1]+'\n';log.scrollTop=1e4},reduced?100:1650);
   setTimeout(()=>{p.style.opacity='0';setTimeout(()=>p.remove(),400)},reduced?900:3200);if(n===P.length-1)setTimeout(()=>busy=false,reduced?1000:3400)},n*(reduced?120:700)))};
};

/* 11. VPN: chi vede che cosa */
S.vpn=el=>{
 el.innerHTML=`<div class="row" style="justify-content:space-between"><h3>Sei al bar, sul Wi-Fi gratuito, e apri il sito della banca</h3><button class="btn" data-a="v" aria-pressed="false">🔒 VPN: spenta</button></div>
 <div class="net" data-o="net" style="height:330px;margin-top:8px"><div class="tunnel"></div>
  <div class="node" style="left:8px;top:32%"><svg viewBox="0 0 64 64"><rect x="16" y="6" width="32" height="52" rx="6" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><circle cx="32" cy="50" r="3" fill="#102a43"/></svg>Il tuo telefono</div>
  <div class="node" style="left:34%;top:32%"><svg viewBox="0 0 64 64"><path d="M10 26a32 32 0 0 1 44 0M18 34a20 20 0 0 1 28 0M26 42a8 8 0 0 1 12 0" stroke="#d9822b" stroke-width="4" fill="none"/><circle cx="32" cy="50" r="4" fill="#d9822b"/></svg>Wi-Fi del bar</div>
  <div class="node" style="left:58%;top:32%" data-o="vnode"><svg viewBox="0 0 64 64"><rect x="10" y="14" width="44" height="36" rx="6" fill="#f3e9f8" stroke="#7a3e9d" stroke-width="3"/><text x="32" y="38" text-anchor="middle" font-size="13" font-weight="800" fill="#7a3e9d">VPN</text></svg>Server VPN</div>
  <div class="node" style="right:8px;top:32%"><svg viewBox="0 0 64 64"><path d="M8 26 32 10l24 16v4H8z" fill="#e9f3f8" stroke="#102a43" stroke-width="3"/><path d="M14 32v18M26 32v18M38 32v18M50 32v18M8 54h48" stroke="#102a43" stroke-width="3"/></svg>Sito della banca</div>
  <div class="eye" style="left:10px" data-o="e1"></div><div class="eye" style="left:calc(50% - 125px)" data-o="e2"></div><div class="eye" style="right:10px" data-o="e3"></div></div>
 <p class="out" data-o="o" style="margin-top:8px"></p>`;
 const net=$(el,'[data-o=net]'),b=$(el,'[data-a=v]');let on=false;
 const draw=()=>{net.classList.toggle('vpn-on',on);$(el,'[data-o=vnode]').style.opacity=on?1:.25;b.setAttribute('aria-pressed',on);b.textContent=on?'🔒 VPN: accesa':'🔓 VPN: spenta';
  $(el,'[data-o=e1]').innerHTML='<b>Gestore del Wi-Fi vede</b><br>'+(on?'solo che parli con un server VPN; il contenuto è cifrato.':'il nome del sito (banca.it) e quando ti colleghi. Il contenuto è comunque cifrato da HTTPS.');
  $(el,'[data-o=e2]').innerHTML='<b>Il provider VPN vede</b><br>'+(on?'i siti che visiti: devi fidarti di lui.':'— (non coinvolto)');
  $(el,'[data-o=e3]').innerHTML='<b>La banca vede</b><br>'+(on?'l’indirizzo IP della VPN, ma tu fai il login: sa chi sei.':'il tuo indirizzo IP e, dopo il login, chi sei.');
  $(el,'[data-o=o]').textContent=on?'La VPN sposta la fiducia dal Wi-Fi al provider VPN. Non ti rende anonimo e non ferma phishing o malware.':'Senza VPN: HTTPS protegge password e dati, ma la rete vede quali siti visiti.'};
 b.onclick=()=>{on=!on;draw()};draw();
};

/* 12. Robustezza della password (calcolo solo locale) */
S.password=el=>{
 const common=['password','123456','12345678','qwerty','admin','ciao','amore','napoli','juventus','inter','milan','roma','password1','111111','iloveyou','forzanapoli','123456789','abc123','qwerty123','ciao123'];
 const W=['mela','treno','vetrina','sabbia','nuvola','faro','pesce','matita','limone','cortile','zaino','lampada','giardino','tamburo','ferro','vela','fragola','ponte','gatto','tazza','bosco','cometa','scala','orologio','pepe','ruota','fiume','biscotto','quadro','sedia','vulcano','marmo'];
 el.innerHTML=`<label for="pw-${Math.random().toString(36).slice(2)}" class="small" style="font-size:17px">Scrivi una password di prova (non usarne una vera: il calcolo avviene solo su questo computer)</label><input class="pw-in" type="text" autocomplete="off" spellcheck="false" placeholder="es. Napoli2026!"><div class="meter" style="height:20px;margin:10px 0"><span data-o="m"></span></div><div class="row" style="justify-content:space-between"><span class="out" data-o="o">—</span><span data-o="t" class="tag">—</span></div><ul class="checks" data-o="c"></ul><div class="row"><button class="btn gold" data-a="gen">🎲 Genera come un password manager</button><span class="small muted" style="font-size:16px">Stima indicativa basata su lunghezza, tipi di caratteri e parole note.</span></div>`;
 const inp=$(el,'.pw-in'),lab=el.querySelector('label');lab.htmlFor=inp.id='pw-'+Math.random().toString(36).slice(2);
 const calc=()=>{const p=inp.value;const low=/[a-z]/.test(p),up=/[A-Z]/.test(p),dig=/\d/.test(p),sym=/[^A-Za-z0-9]/.test(p);const pool=(low?26:0)+(up?26:0)+(dig?10:0)+(sym?33:0);let bits=p.length*Math.log2(pool||1);
  const lc=p.toLowerCase();const isCommon=common.includes(lc.replace(/[^a-z0-9]/g,''))||common.some(c=>c.length>4&&lc.includes(c));const seq=/(0123|1234|2345|3456|4567|5678|6789|abcd|qwer|asdf)/i.test(p);const words=p.split(/[\s\-_.]+/).filter(x=>W.includes(x.toLowerCase())).length;
  if(isCommon)bits=Math.min(bits,common.includes(lc.replace(/[^a-z0-9]/g,''))?10:28);if(words>=2)bits=Math.min(bits,words*Math.log2(W.length)+12);if(seq)bits-=10;if(/(.)\1\1/.test(p))bits-=6;bits=Math.max(0,bits);
  const secs=Math.pow(2,bits)/2/1e10;const t=secs<1?'meno di un secondo':secs<3600?Math.round(secs/60)+' minuti':secs<86400*2?Math.round(secs/3600)+' ore':secs<86400*365*2?Math.round(secs/86400)+' giorni':secs<3.15e7*1e6?fmt(secs/3.15e7)+' anni':'più di un milione di anni';
  const lv=bits<35?['Molto debole','#c0392b',15]:bits<50?['Debole','#d9822b',35]:bits<65?['Discreta','#c9a227',60]:bits<80?['Forte','#2a9d8f',82]:['Molto forte','#145d53',100];
  const m=$(el,'[data-o=m]');m.style.width=(p?lv[2]:0)+'%';m.style.background=lv[1];$(el,'[data-o=o]').textContent=p?lv[0]+' · circa '+Math.round(bits)+' bit':'—';$(el,'[data-o=t]').textContent=p?'Tempo stimato per indovinarla: '+t:'—';
  $(el,'[data-o=c]').innerHTML=[[p.length>=12,'Almeno 12 caratteri'],[low&&up,'Maiuscole e minuscole'],[dig,'Numeri'],[sym,'Simboli o spazi'],[!isCommon,'Non è tra le più usate'],[!seq,'Nessuna sequenza (1234, qwer)']].map(([o,t])=>'<li class="'+(o?'ok':'')+'">'+t+'</li>').join('')};
 inp.addEventListener('input',calc);$(el,'[data-a=gen]').onclick=()=>{const cs='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!#$%&*+-=?@';const a=new Uint32Array(16);crypto.getRandomValues(a);inp.value=[...a].map(x=>cs[x%cs.length]).join('');calc()};calc();
};

/* 13. Cifrario di Cesare e attacco a forza bruta */
S.cesare=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><label class="small" style="font-size:17px">Messaggio in chiaro<input data-o="m" value="ORDINE DI 20 MAGLIETTE" style="width:100%;font-family:ui-monospace,Consolas,monospace;font-size:20px;padding:6px 10px;margin-top:4px"></label>
 <label class="sl" style="grid-template-columns:110px 1fr 40px;margin-top:10px"><span>Chiave</span><input type="range" min="1" max="25" value="3" data-o="k"><b data-o="kv">3</b></label>
 <p style="margin:8px 0 4px"><b>Messaggio cifrato</b></p><div class="mini-doc" data-o="c" style="min-height:0;font-family:ui-monospace,Consolas,monospace;font-size:22px;letter-spacing:.06em"></div>
 <p class="small" style="font-size:16px;margin-top:8px">Il cifrario di Cesare ha solo 25 chiavi: un computer le prova tutte in un istante. Gli algoritmi moderni (es. AES-256) hanno 2<sup>256</sup> chiavi possibili.</p></div>
 <div><div class="row" style="justify-content:space-between"><b>Attacco a forza bruta</b><button class="btn gold" data-a="bf">Prova tutte le chiavi</button></div><div class="log" data-o="bf" style="height:330px;margin-top:6px;white-space:pre"></div></div></div>`;
 const enc=(s,k)=>s.toUpperCase().replace(/[A-Z]/g,c=>String.fromCharCode((c.charCodeAt(0)-65+k)%26+65));
 const draw=()=>{const k=+$(el,'[data-o=k]').value;$(el,'[data-o=kv]').textContent=k;$(el,'[data-o=c]').textContent=enc($(el,'[data-o=m]').value,k)};
 $(el,'[data-o=k]').oninput=draw;$(el,'[data-o=m]').oninput=draw;
 $(el,'[data-a=bf]').onclick=()=>{const c=$(el,'[data-o=c]').textContent;const k0=+$(el,'[data-o=k]').value;$(el,'[data-o=bf]').textContent=Array.from({length:25},(_,j)=>{const k=j+1;return 'chiave '+String(k).padStart(2,' ')+': '+enc(c,26-k)+(k===k0?'   ← trovato!':'')}).join('\n')};draw();
};

/* 14. Backup: che cosa si salva in caso di incidente */
S.backup=el=>{
 const ST=[['sync','Cartella sincronizzata nel cloud (senza versioni)'],['usb','Chiavetta USB sempre collegata al PC'],['ext','Disco esterno, collegato solo durante il backup e tenuto in un altro luogo'],['ver','Backup in cloud con versioni (conserva 90 giorni)']];
 const EV=[['ransom','Ransomware cifra i file del PC',{sync:0,usb:0,ext:1,ver:1},'La sincronizzazione copia nel cloud anche i file cifrati; la chiavetta collegata viene cifrata con il PC.'],['furto','Furto del portatile con la chiavetta in borsa',{sync:1,usb:0,ext:1,ver:1},'Quello che è fisicamente con il PC si perde con il PC.'],['del','Cancelli per errore una cartella e te ne accorgi dopo 2 mesi',{sync:0,usb:0,ext:1,ver:1},'La sincronizzazione propaga la cancellazione; il backup a versioni conserva le copie precedenti (il disco esterno solo se non l’hai sovrascritto).'],['guasto','Si rompe il disco del PC',{sync:1,usb:1,ext:1,ver:1},'Qualsiasi copia fuori dal disco guasto salva i dati.'],['incendio','Allagamento o incendio del laboratorio',{sync:1,usb:0,ext:1,ver:1},'Serve una copia fuori sede.']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><h3>1 · Le tue protezioni</h3>${ST.map(s=>'<label style="display:flex;gap:8px;font-size:17px;margin:0 0 6px"><input type="checkbox" value="'+s[0]+'">'+s[1]+'</label>').join('')}
 <h3 style="margin-top:10px">2 · Che cosa succede?</h3><select data-o="e" style="width:100%">${EV.map((e,k)=>'<option value="'+k+'">'+e[1]+'</option>').join('')}</select></div>
 <div><h3>Esito</h3><div data-o="r" style="font-size:18px"></div></div></div>`;
 const draw=()=>{const on=$$(el,'input:checked').map(i=>i.value);const e=EV[+$(el,'[data-o=e]').value];const saved=on.filter(s=>e[2][s]);
  $(el,'[data-o=r]').innerHTML=(on.length?ST.filter(s=>on.includes(s[0])).map(s=>'<div style="margin:0 0 6px">'+(e[2][s[0]]?'<span class="tag ok">Salva i dati</span> ':'<span class="tag ko">Perduto</span> ')+esc(s[1])+'</div>').join(''):'<p><span class="tag ko">Nessuna copia</span></p>')+'<p class="s-box '+(saved.length?'teal':'orange')+'" style="font-size:18px;margin-top:10px">'+(saved.length?'<b>Dati recuperati.</b> ':'<b>Dati persi.</b> ')+esc(e[3])+'</p>'};
 el.addEventListener('change',draw);draw();
};

/* 15. Navigazione: chi vede che cosa */
S.incognito=el=>{
 const M=[['Normale',0,0],['In incognito',1,0],['Con VPN',0,1],['Incognito + VPN',1,1]];
 const O=[['Chi usa dopo di te lo stesso PC (cronologia, cookie)',(i,v)=>!i],['I siti, se fai il login',()=>true],['I siti, tramite il tuo indirizzo IP',(i,v)=>!v],['Il gestore della rete (Wi-Fi, ufficio, provider)',(i,v)=>!v],['Il fornitore della VPN',(i,v)=>v],['File scaricati e preferiti salvati',()=>true]];
 el.innerHTML='<div class="row" data-o="m">'+M.map((m,k)=>'<button class="btn ghost" data-k="'+k+'" aria-pressed="'+(k===1)+'">'+m[0]+'</button>').join('')+'</div><table class="rules" style="margin-top:12px;font-size:18px"><thead><tr><th>Chi o che cosa</th><th>Vede o resta traccia?</th></tr></thead><tbody data-o="b"></tbody></table><p class="out" data-o="o" style="margin-top:8px"></p>';
 let cur=1;const draw=()=>{const [,i,v]=M[cur];$$(el,'[data-k]').forEach((b,k)=>b.setAttribute('aria-pressed',k===cur));$(el,'[data-o=b]').innerHTML=O.map(o=>'<tr><td>'+o[0]+'</td><td>'+(o[1](i,v)?'<span class="tag ko">Sì</span>':'<span class="tag ok">No</span>')+'</td></tr>').join('');$(el,'[data-o=o]').textContent=cur===1?'L’incognito protegge solo da chi usa il tuo stesso dispositivo dopo di te.':cur===3?'Anche insieme non rendono anonimi: il login e il provider VPN restano.':''};
 $(el,'[data-o=m]').onclick=e=>{const b=e.target.closest('[data-k]');if(b){cur=+b.dataset.k;draw()}};draw();
};

/* 16. Banner dei cookie */
S.cookie=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:18px"><div style="position:relative;height:330px;border:1px solid var(--line);border-radius:12px;background:#f3f7fb;overflow:hidden"><div style="padding:14px 18px;font-size:16px"><b style="font-size:20px">Stampa&Co — negozio online</b><p>Magliette, tazze e gadget personalizzati.</p></div>
 <div data-o="ban" style="position:absolute;left:12px;right:12px;bottom:12px;background:#fff;border-radius:12px;box-shadow:0 6px 24px #0003;padding:12px 14px;font-size:15px"><button data-a="x" class="btn ghost" style="position:absolute;right:8px;top:6px;padding:2px 8px" aria-label="Chiudi">✕</button><b>Questo sito usa cookie</b><p style="margin:4px 0 8px">Tecnici, necessari al carrello; e, con il tuo consenso, di statistica e di profilazione pubblicitaria.</p><div class="row"><button class="btn" data-a="all">Accetta tutti</button><button class="btn" data-a="none">Rifiuta</button><button class="btn ghost" data-a="cust">Personalizza</button></div><div data-o="cust" hidden style="margin-top:8px"><label><input type="checkbox" checked disabled> Tecnici (sempre attivi)</label><br><label><input type="checkbox" data-c="stat"> Statistica</label><br><label><input type="checkbox" data-c="prof"> Profilazione pubblicitaria</label><br><button class="btn gold" data-a="save" style="margin-top:6px">Salva le scelte</button></div></div></div>
 <div><h3>Cookie installati</h3><div data-o="r" style="font-size:18px"></div><p class="small muted" style="font-size:15px;margin-top:10px">Regola utile (Garante privacy, linee guida 2021): rifiutare deve essere facile come accettare; chiudere il banner con la X equivale a rifiutare i cookie non tecnici.</p><button class="btn ghost" data-a="rst">Ricomincia</button></div></div>`;
 const r=$(el,'[data-o=r]'),ban=$(el,'[data-o=ban]');
 const set=(s,p,how)=>{ban.hidden=true;r.innerHTML='<div><span class="tag ok">Sì</span> Tecnici (carrello, lingua)</div><div style="margin-top:6px">'+(s?'<span class="tag wait">Sì</span>':'<span class="tag ok">No</span>')+' Statistica</div><div style="margin-top:6px">'+(p?'<span class="tag ko">Sì</span>':'<span class="tag ok">No</span>')+' Profilazione pubblicitaria</div><p style="margin-top:10px"><b>'+how+'</b></p>'};
 el.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;
  if(a==='all')set(1,1,'Hai accettato tutto: il sito e i partner possono profilarti.');if(a==='none')set(0,0,'Hai rifiutato: restano solo i cookie tecnici.');if(a==='x')set(0,0,'Chiudere con la X equivale a rifiutare.');
  if(a==='cust')$(el,'[data-o=cust]').hidden=false;if(a==='save')set($(el,'[data-c=stat]').checked,$(el,'[data-c=prof]').checked,'Scelte salvate: puoi cambiarle in ogni momento dal link «Preferenze cookie».');
  if(a==='rst'){ban.hidden=false;$(el,'[data-o=cust]').hidden=true;r.innerHTML='<p class="muted">Nessuna scelta ancora.</p>'}});
 r.innerHTML='<p class="muted">Nessuna scelta ancora.</p>';
};

/* 17. Imbuto di conversione */
S.funnel=el=>{
 const F=[['vis','Visitatori al mese',200,10000,3000,100,''],['cr','Tasso di conversione',0.2,6,1.5,0.1,' %'],['aov','Scontrino medio',5,150,35,1,' €'],['ads','Spesa pubblicitaria al mese',0,2000,300,10,' €']];
 el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:20px"><div>'+F.map(f=>'<label class="sl" style="grid-template-columns:190px 1fr 86px"><span>'+f[1]+'</span><input type="range" data-f="'+f[0]+'" min="'+f[2]+'" max="'+f[3]+'" value="'+f[4]+'" step="'+f[5]+'"><b></b></label>').join('')+'<p class="small muted" style="font-size:15px;margin-top:8px">Tasso di conversione = ordini ÷ visitatori × 100. Va sempre detto su quale base è calcolato. Il carrello è stimato come 4 volte gli ordini (ipotesi didattica).</p></div><div data-o="f"></div></div>';
 const draw=()=>{const v={};$$(el,'[data-f]').forEach((i,k)=>{v[i.dataset.f]=+i.value;i.parentElement.querySelector('b').textContent=fmt(+i.value,F[k][0]==='cr'?1:0)+F[k][6]});
  const carts=v.vis*Math.min(1,v.cr*4/100),orders=v.vis*v.cr/100,rev=orders*v.aov,cpa=orders?v.ads/orders:0,roas=v.ads?rev/v.ads:0;
  const bar=(lab,n,w,c)=>'<div class="funnel-bar" style="width:'+w+'%;background:'+c+'">'+lab+': '+fmt(n)+'</div>';
  $(el,'[data-o=f]').innerHTML=bar('Visitatori',v.vis,100,'#102a43')+bar('Carrello (stima)',carts,Math.max(62,carts/v.vis*100),'#176b87')+bar('Ordini',orders,Math.max(40,orders/v.vis*100),'#2a9d8f')+'<div class="s-grid c3" style="margin-top:12px"><div class="s-card gold" style="padding:10px 12px;font-size:17px"><b>Ricavi</b><br><span style="font-size:26px;font-weight:800">'+fmt(rev)+' €</span></div><div class="s-card orange" style="padding:10px 12px;font-size:17px"><b>Costo per ordine</b><br><span style="font-size:26px;font-weight:800">'+(orders?fmt(cpa,2)+' €':'—')+'</span></div><div class="s-card blue" style="padding:10px 12px;font-size:17px"><b>Ricavi ÷ pubblicità</b><br><span style="font-size:26px;font-weight:800">'+(v.ads?fmt(roas,1):'—')+'</span></div></div>'};
 el.addEventListener('input',draw);draw();
};

/* 18. Tasso di coinvolgimento di un post */
S.engagement=el=>{
 const F=[['like','Mi piace',120],['com','Commenti',14],['sha','Condivisioni',9],['sav','Salvataggi',22],['reach','Persone raggiunte (copertura)',2400]];
 el.innerHTML='<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:center"><div>'+F.map(f=>'<label class="sl" style="grid-template-columns:230px 1fr"><span>'+f[1]+'</span><input type="number" min="0" value="'+f[2]+'" data-f="'+f[0]+'" style="padding:4px 8px"></label>').join('')+'</div><div style="text-align:center"><div style="font-size:18px">Tasso di coinvolgimento</div><div data-o="er" style="font-size:64px;font-weight:800;color:#102a43">—</div><div class="small muted" style="font-size:15px">(mi piace + commenti + condivisioni + salvataggi) ÷ copertura × 100</div><p class="out" data-o="o" style="margin-top:8px"></p></div></div>';
 const draw=()=>{const v={};$$(el,'[data-f]').forEach(i=>v[i.dataset.f]=Math.max(0,+i.value||0));const inter=v.like+v.com+v.sha+v.sav;const er=v.reach?inter/v.reach*100:0;$(el,'[data-o=er]').textContent=v.reach?fmt(er,1)+' %':'—';$(el,'[data-o=o]').textContent=v.reach?(v.com+v.sha>v.like/4?'Molti commenti e condivisioni: il contenuto genera conversazione.':'Interazioni soprattutto passive: prova una domanda o una call to action.'):'Inserisci la copertura.'};
 el.addEventListener('input',draw);draw();
};


/* 19. Costruisci una ricerca con gli operatori */
S.ricerca=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div>
 <label class="sl" style="grid-template-columns:170px 1fr"><span>Parole chiave</span><input data-f="k" value="imprese attive"></label>
 <label class="sl" style="grid-template-columns:170px 1fr"><span>Frase esatta</span><input data-f="e" value="Maddaloni"></label>
 <label class="sl" style="grid-template-columns:170px 1fr"><span>Escludi parola</span><input data-f="x" value="vendita"></label>
 <label class="sl" style="grid-template-columns:170px 1fr"><span>Solo dal sito</span><select data-f="s"><option value="">qualsiasi</option><option>istat.it</option><option>gov.it</option><option>camcom.it</option><option>agenziaentrate.gov.it</option><option>dati.gov.it</option></select></label>
 <label class="sl" style="grid-template-columns:170px 1fr"><span>Tipo di file</span><select data-f="t"><option value="">qualsiasi</option><option>pdf</option><option>xlsx</option><option>csv</option></select></label></div>
 <div><b>La ricerca che verrà eseguita</b><div class="mini-doc" data-o="q" style="min-height:0;font-family:ui-monospace,Consolas,monospace;font-size:20px;margin:6px 0 10px"></div>
 <ul class="small" data-o="sp" style="font-size:17px;margin:0 0 10px"></ul><a class="btn gold" data-o="go" target="_blank" rel="noopener">Apri la ricerca su Google ↗</a></div></div>`;
 const v=k=>$(el,'[data-f='+k+']').value.trim();
 const draw=()=>{const parts=[],sp=[];if(v('k')){parts.push(v('k'));sp.push('<b>'+esc(v('k'))+'</b>: tutte queste parole, in qualsiasi ordine')}if(v('e')){parts.push('"'+v('e')+'"');sp.push('<b>"…"</b>: esattamente questa frase')}if(v('x')){parts.push('-'+v('x').split(/\s+/).join(' -'));sp.push('<b>-parola</b>: esclude i risultati che la contengono')}if(v('s')){parts.push('site:'+v('s'));sp.push('<b>site:</b> solo pagine di quel dominio')}if(v('t')){parts.push('filetype:'+v('t'));sp.push('<b>filetype:</b> solo file di quel formato')}
  const q=parts.join(' ');$(el,'[data-o=q]').textContent=q||'—';$(el,'[data-o=sp]').innerHTML=sp.map(x=>'<li>'+x+'</li>').join('');$(el,'[data-o=go]').href='https://www.google.com/search?q='+encodeURIComponent(q)};
 el.addEventListener('input',draw);el.addEventListener('change',draw);draw();
};

/* 20. Analizzare le vendite: media, mediana, valori anomali */
S.analisi=el=>{
 const D=[['lun',180],['mar',150],['mer',165],['gio',170],['ven',210],['sab',260],['dom',0],['lun',175],['mar',160],['mer',940],['gio',185],['ven',225],['sab',290],['dom',0]];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1.45fr 1fr;gap:18px"><div><svg class="ig" data-o="g" viewBox="0 0 640 300" role="img" aria-label="Vendite giornaliere di due settimane"></svg><div class="row" style="margin-top:6px"><label style="font-size:17px"><input type="checkbox" data-o="x"> Escludi il mercoledì della fiera (valore anomalo)</label><label style="font-size:17px"><input type="checkbox" data-o="d" checked> Escludi le domeniche (chiuso)</label></div></div>
 <div data-o="st" style="font-size:19px"></div></div>`;
 const g=$(el,'[data-o=g]');
 const draw=()=>{const xo=$(el,'[data-o=x]').checked,dd=$(el,'[data-o=d]').checked;const use=D.map((d,k)=>!(xo&&k===9)&&!(dd&&d[0]==='dom'));const vals=D.filter((d,k)=>use[k]).map(d=>d[1]);
  const sum=vals.reduce((a,b)=>a+b,0),mean=sum/vals.length,so=[...vals].sort((a,b)=>a-b),med=so.length%2?so[(so.length-1)/2]:(so[so.length/2-1]+so[so.length/2])/2;
  const w1=D.slice(0,7).filter((d,k)=>use[k]).reduce((a,d)=>a+d[1],0),w2=D.slice(7).filter((d,k)=>use[k+7]).reduce((a,d)=>a+d[1],0);
  const max=1000,bw=600/D.length;
  g.innerHTML='<line x1="20" y1="260" x2="630" y2="260" stroke="#9aa9b8"/>'+D.map((d,k)=>{const h=d[1]/max*230,x=24+k*bw;return '<rect x="'+(x+4)+'" y="'+(260-h)+'" width="'+(bw-8)+'" height="'+h+'" rx="4" fill="'+(use[k]?(k===9?'#d9822b':'#176b87'):'#cfd8e0')+'"/><text x="'+(x+bw/2)+'" y="278" text-anchor="middle" font-size="13" fill="#52657a">'+d[0]+'</text>'+(d[1]?'<text x="'+(x+bw/2)+'" y="'+(254-h)+'" text-anchor="middle" font-size="12" fill="#102a43">'+d[1]+'</text>':'')}).join('')+'<line x1="20" x2="630" y1="'+(260-mean/max*230)+'" y2="'+(260-mean/max*230)+'" stroke="#c0392b" stroke-dasharray="6 5" stroke-width="2"/><text x="628" y="'+(254-mean/max*230)+'" text-anchor="end" font-size="14" fill="#c0392b">media '+fmt(mean)+' €</text>';
  $(el,'[data-o=st]').innerHTML='<div class="s-grid c2" style="gap:10px"><div class="s-card" style="padding:10px"><b>Media</b><br><span style="font-size:30px;font-weight:800">'+fmt(mean)+' €</span></div><div class="s-card gold" style="padding:10px"><b>Mediana</b><br><span style="font-size:30px;font-weight:800">'+fmt(med)+' €</span></div><div class="s-card blue" style="padding:10px"><b>Totale</b><br><span style="font-size:24px;font-weight:800">'+fmt(sum)+' €</span></div><div class="s-card orange" style="padding:10px"><b>2ª sett. vs 1ª</b><br><span style="font-size:24px;font-weight:800">'+(w1?(w2>=w1?'+':'')+fmt((w2-w1)/w1*100,1)+' %':'—')+'</span></div></div><p style="font-size:17px;margin-top:10px">'+(xo?'Senza la fiera, media e mediana sono vicine: descrivono bene un giorno normale.':'Il giorno della fiera alza la media; la mediana resiste ai valori anomali.')+'</p>'};
 el.addEventListener('change',draw);draw();
};

/* 21. Condividere in modo sicuro */
S.condividi=el=>{
 const SC=[['Inviare il preventivo al signor Rossi','persone','lettura',0,'Al cliente basta leggere; con il link aperto a chiunque il preventivo può circolare.'],['Bozza del piano d’impresa da rivedere con il socio','persone','modifica',0,'Il socio deve poter scrivere, ma solo lui: persone specifiche con modifica.'],['Listino prezzi da pubblicare sul sito','link','lettura',0,'Il listino è pubblico per scelta: link aperto, ma in sola lettura.'],['Carta d’identità per il commercialista','persone','lettura',1,'Documento con dati personali: solo il destinatario, sola lettura, e togliete l’accesso dopo l’uso.']];
 el.innerHTML=`<label class="sl" style="grid-template-columns:120px 1fr"><span>Situazione</span><select data-o="sc">${SC.map((s,k)=>'<option value="'+k+'">'+s[0]+'</option>').join('')}</select></label>
 <div class="s-grid c3" style="margin-top:10px;gap:12px"><div class="s-card" style="padding:10px 12px"><b>Chi può accedere</b><br><label><input type="radio" name="cw" value="persone" checked> Solo persone indicate</label><br><label><input type="radio" name="cw" value="link"> Chiunque abbia il link</label></div>
 <div class="s-card gold" style="padding:10px 12px"><b>Che cosa può fare</b><br><label><input type="radio" name="pm" value="lettura" checked> Leggere</label><br><label><input type="radio" name="pm" value="commento"> Commentare</label><br><label><input type="radio" name="pm" value="modifica"> Modificare</label></div>
 <div class="s-card blue" style="padding:10px 12px"><b>Scadenza</b><br><label><input type="checkbox" data-o="exp"> Togli l’accesso dopo 7 giorni</label></div></div>
 <div class="row" style="margin-top:10px"><button class="btn gold" data-a="chk">Verifica la scelta</button><span class="out" data-o="o"></span></div>`;
 const nm='n'+Math.random().toString(36).slice(2);$$(el,'input[name=cw]').forEach(i=>i.name='cw'+nm);$$(el,'input[name=pm]').forEach(i=>i.name='pm'+nm);
 $(el,'[data-a=chk]').onclick=()=>{const s=SC[+$(el,'[data-o=sc]').value];const cw=$(el,'input[name=cw'+nm+']:checked').value,pm=$(el,'input[name=pm'+nm+']:checked').value,ex=$(el,'[data-o=exp]').checked;
  const ok=cw===s[1]&&pm===s[2]&&(!s[3]||ex);$(el,'[data-o=o]').innerHTML=(ok?'<span class="tag ok">Corretto</span> ':'<span class="tag ko">Da rivedere</span> ')+esc(s[4])};
 $(el,'[data-o=sc]').onchange=()=>$(el,'[data-o=o]').textContent='';
};

/* 22. Nomi dei file e ordinamento */
S.nomi=el=>{
 const F=[['2025-11-03','preventivo','Rossi'],['2026-01-15','fattura','Bianchi'],['2025-12-20','preventivo','Esposito'],['2026-02-02','contratto','Fornitore'],['2025-10-08','listino','Generale']];
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div><h3>Data scritta «gg-mm-aaaa»</h3><ol data-o="a" style="font-family:ui-monospace,Consolas,monospace;font-size:17px;padding-left:24px"></ol></div><div><h3>Data scritta «aaaa-mm-gg»</h3><ol data-o="b" style="font-family:ui-monospace,Consolas,monospace;font-size:17px;padding-left:24px"></ol></div></div>
 <p style="font-size:18px;margin:4px 0 10px">I computer ordinano i nomi lettera per lettera: solo con <b>anno-mese-giorno</b> l’ordine alfabetico coincide con quello cronologico.</p>
 <div class="s-box teal" style="font-size:18px"><b>Costruisci il tuo nome:</b> <input data-f="c" value="Descrizione-iniziativa" style="width:220px"> autore <input data-f="a" value="Ferrante" style="width:130px"> versione <input data-f="v" type="number" min="1" value="1" style="width:60px"><br><code data-o="n" style="font-size:20px"></code></div>`;
 const it=d=>d.split('-').reverse().join('-');
 const a=F.map(f=>it(f[0])+'_'+f[1]+'_'+f[2]+'.pdf').sort(),b=F.map(f=>f[0]+'_'+f[1]+'_'+f[2]+'.pdf').sort();
 $(el,'[data-o=a]').innerHTML=a.map(x=>'<li>'+x+'</li>').join('');$(el,'[data-o=b]').innerHTML=b.map(x=>'<li>'+x+'</li>').join('');
 const draw=()=>{const d=new Date().toISOString().slice(0,10);const c=x=>$(el,'[data-f='+x+']').value.trim().replace(/[^\w\-àèéìòù]+/gi,'-');$(el,'[data-o=n]').textContent=d+'_'+c('c')+'_'+c('a')+'_v'+String(Math.max(1,+$(el,'[data-f=v]').value||1)).padStart(2,'0')+'.docx'};
 el.addEventListener('input',draw);draw();
};

/* 23. Bacheca Kanban */
S.kanban=el=>{
 const T0=JSON.parse(el.dataset.cfg||'[]');let T=T0.map(t=>({...t}));
 const C=['Da fare','In corso','Fatto'];
 el.innerHTML='<div class="row" style="justify-content:space-between"><span style="font-size:17px">Tocca una scheda per spostarla avanti; tieni premuto Maiusc (o tocca ↶) per riportarla indietro.</span><button class="btn ghost" data-a="r">Ricomincia</button></div><div class="meter" style="margin:8px 0"><span data-o="p" style="background:#2a9d8f"></span></div><div class="s-grid c3" data-o="b" style="gap:12px"></div>';
 const draw=()=>{$(el,'[data-o=b]').innerHTML=C.map((c,k)=>'<div class="bin" style="cursor:default;min-height:0;padding:6px 8px"><h4>'+c+' ('+T.filter(t=>t.s===k).length+')</h4><div style="display:grid;gap:4px">'+T.map((t,j)=>t.s===k?'<div class="row" style="gap:4px"><button class="chip" data-j="'+j+'" style="flex:1;text-align:left;border-radius:10px;font-size:15px;padding:4px 10px;'+(k===2?'background:#d8f1e6':k===1?'background:#fff1b8':'')+'">'+esc(t.t)+(t.d?' <small style="font-weight:400">· '+esc(t.d)+'</small>':'')+'</button>'+(k?'<button class="chip" data-back="'+j+'" aria-label="Indietro">↶</button>':'')+'</div>':'').join('')+'</div></div>').join('');
  $(el,'[data-o=p]').style.width=(T.filter(t=>t.s===2).length/T.length*100)+'%'};
 el.addEventListener('click',e=>{const b=e.target.closest('[data-j],[data-back],[data-a]');if(!b)return;if(b.dataset.a){T=T0.map(t=>({...t}));draw();return}
  if(b.dataset.back!==undefined){const t=T[+b.dataset.back];t.s=Math.max(0,t.s-1)}else{const t=T[+b.dataset.j];t.s=e.shiftKey?Math.max(0,t.s-1):Math.min(2,t.s+1)}draw()});
 draw();
};

/* 24. Autovalutazione DigComp con grafico radar */
S.digcomp=el=>{
 const A=[['Informazioni e dati','Cercare, valutare, organizzare dati e contenuti'],['Comunicazione e collaborazione','Interagire, condividere, PEC, identità digitale'],['Creazione di contenuti','Documenti, fogli, presentazioni, licenze'],['Sicurezza','Dispositivi, dati personali, salute, ambiente'],['Risolvere problemi','Problemi tecnici, scelta degli strumenti, aggiornarsi']];
 const L=['','Base','Intermedio','Avanzato','Altamente specializzato'];
 el.innerHTML='<div style="display:grid;grid-template-columns:1.1fr 1fr;gap:18px;align-items:center"><div>'+A.map((a,k)=>'<label class="sl" style="grid-template-columns:230px 1fr 150px;margin:2px 0" title="'+a[1]+'"><span><b>'+(k+1)+'. '+a[0]+'</b></span><input type="range" min="1" max="4" value="2" data-k="'+k+'"><b style="font-size:16px"></b></label>').join('')+'</div><div><svg class="ig" data-o="g" viewBox="0 0 420 380" style="height:330px" role="img" aria-label="Grafico radar dell’autovalutazione"></svg><p class="out" data-o="o" style="text-align:center"></p></div></div>';
 const g=$(el,'[data-o=g]'),cx=210,cy=195,R=140;const pt=(k,r)=>{const a=-Math.PI/2+k*2*Math.PI/5;return [cx+r*Math.cos(a),cy+r*Math.sin(a)]};
 const draw=()=>{const v=$$(el,'input').map(i=>+i.value);$$(el,'label.sl > b').forEach((b,k)=>b.textContent=L[v[k]]);
  let s='';for(let lv=1;lv<=4;lv++)s+='<polygon points="'+[0,1,2,3,4].map(k=>pt(k,R*lv/4).join(',')).join(' ')+'" fill="none" stroke="#dce4ec"/>';
  s+=[0,1,2,3,4].map(k=>{const [x,y]=pt(k,R),[tx,ty]=pt(k,R+26);return '<line x1="'+cx+'" y1="'+cy+'" x2="'+x+'" y2="'+y+'" stroke="#dce4ec"/><text x="'+tx+'" y="'+(ty+5)+'" text-anchor="middle" font-size="15" font-weight="800" fill="#102a43">'+(k+1)+'</text>'}).join('');
  s+='<polygon points="'+v.map((x,k)=>pt(k,R*x/4).join(',')).join(' ')+'" fill="#2a9d8f55" stroke="#2a9d8f" stroke-width="3"/>';g.innerHTML=s;
  const mi=Math.min(...v),ma=Math.max(...v);const w=v.map((x,k)=>x===mi?A[k][0]:null).filter(Boolean);$(el,'[data-o=o]').textContent=mi===ma?'Profilo uniforme: spostate i cursori secondo il vostro livello reale.':'Da rafforzare: '+w.join(', ')};
 el.addEventListener('input',draw);draw();
};


/* 25. PEC: invio, ricevute e valore legale */
S.pec=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1.25fr;gap:18px"><div>
 <label class="sl" style="grid-template-columns:110px 1fr"><span>Da</span><input value="laboratorio.ferrante@pec.it" disabled></label>
 <label class="sl" style="grid-template-columns:110px 1fr"><span>A</span><select data-o="to"><option value="pec">fornitore.srl@legalmail.it (PEC)</option><option value="mail">fornitore.srl@gmail.com (email ordinaria)</option></select></label>
 <label class="sl" style="grid-template-columns:110px 1fr"><span>Oggetto</span><input value="Disdetta contratto di fornitura" disabled></label>
 <label class="sl" style="grid-template-columns:110px 1fr"><span>Allegato</span><input value="2026-11-11_Disdetta_firmata.pdf.p7m" disabled></label>
 <div class="row" style="margin-top:8px"><button class="btn gold" data-a="send">📨 Invia</button><button class="btn ghost" data-a="r">Ricomincia</button></div></div>
 <div><b>Che cosa succede</b><ol data-o="log" style="font-size:18px;padding-left:24px;margin:6px 0"></ol><div data-o="v"></div></div></div>`;
 let t=[];const log=$(el,'[data-o=log]'),v=$(el,'[data-o=v]');
 const rst=()=>{t.forEach(clearTimeout);t=[];log.innerHTML='';v.innerHTML=''};
 $(el,'[data-a=send]').onclick=()=>{rst();const pec=$(el,'[data-o=to]').value==='pec';
  const steps=[['Il tuo gestore PEC riceve il messaggio e ti invia la <b>ricevuta di accettazione</b>','ok'],['Il messaggio viaggia tra i gestori in una «busta di trasporto» firmata','ok'],
   pec?['Il gestore del destinatario lo consegna e ti invia la <b>ricevuta di avvenuta consegna</b>, con data e ora','ok']:['La casella ordinaria lo riceve, ma <b>non emette la ricevuta di consegna</b>','ko']];
  steps.forEach((st,k)=>t.push(setTimeout(()=>{const li=document.createElement('li');li.innerHTML=st[0]+' '+(st[1]==='ok'?'<span class="tag ok">✓ '+new Date().toLocaleTimeString('it-IT')+'</span>':'<span class="tag ko">nessuna ricevuta</span>');log.append(li);
   if(k===2)v.innerHTML='<p class="s-box '+(pec?'teal':'orange')+'" style="font-size:18px;margin-top:8px">'+(pec?'<b>Valore legale pieno</b>: la ricevuta di consegna equivale alla ricevuta di ritorno di una raccomandata. Conservatela.':'<b>Nessun valore di raccomandata</b>: si sa che è partito, ma non si può dimostrare la consegna. Serve una PEC anche dal lato del destinatario.')+'</p>'},(k+1)*(reduced?150:900))))};
 $(el,'[data-a=r]').onclick=rst;$(el,'[data-o=to]').onchange=rst;
};

/* 26. Firma digitale: impronta, chiave privata, verifica (crittografia reale nel browser) */
S.firma=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div>
 <b>Documento</b><textarea data-o="d" rows="5" style="width:100%;font-size:17px;margin-top:4px">Il sottoscritto dichiara di voler acquistare 1 plotter al prezzo di 14.000 € IVA esclusa.</textarea>
 <div class="row" style="margin-top:8px"><button class="btn gold" data-a="sign">✍️ Firma con la chiave privata</button><button class="btn" data-a="ver">🔎 Verifica la firma</button></div>
 <p class="small muted" style="font-size:15px;margin-top:8px">Dopo aver firmato, provate a cambiare una sola cifra del documento e verificate di nuovo.</p></div>
 <div style="font-size:17px"><div><b>1 · Impronta (hash SHA-256) del documento</b><div class="log" data-o="h" style="height:auto;min-height:0;white-space:normal;word-break:break-all"></div></div>
 <div style="margin-top:8px"><b>2 · Firma (impronta cifrata con la chiave privata)</b><div class="log" data-o="s" style="height:auto;min-height:0;white-space:normal;word-break:break-all">—</div></div>
 <div style="margin-top:8px"><b>3 · Verifica con la chiave pubblica</b><div data-o="r">—</div></div></div></div>`;
 const C=globalThis.crypto&&crypto.subtle;let keys=null,sig=null;const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');const enc=()=>new TextEncoder().encode($(el,'[data-o=d]').value);
 const hash=async()=>{if(!C){$(el,'[data-o=h]').textContent='Il browser non consente la crittografia in questa pagina.';return}$(el,'[data-o=h]').textContent=hex(await C.digest('SHA-256',enc()))};
 $(el,'[data-o=d]').addEventListener('input',hash);hash();
 $(el,'[data-a=sign]').onclick=async()=>{if(!C)return;keys=keys||await C.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);sig=await C.sign({name:'ECDSA',hash:'SHA-256'},keys.privateKey,enc());$(el,'[data-o=s]').textContent=hex(sig).slice(0,96)+'…';$(el,'[data-o=r]').innerHTML='<span class="tag wait">Firmato: ora verificate</span>'};
 $(el,'[data-a=ver]').onclick=async()=>{if(!C||!sig){$(el,'[data-o=r]').innerHTML='<span class="tag wait">Prima firmate il documento</span>';return}const ok=await C.verify({name:'ECDSA',hash:'SHA-256'},keys.publicKey,sig,enc());
  $(el,'[data-o=r]').innerHTML=ok?'<span class="tag ok">Firma valida</span> Il documento è integro e firmato dal titolare della chiave.':'<span class="tag ko">Firma non valida</span> Il documento è stato modificato dopo la firma.'};
};

/* 27. Accesso con identità digitale (portale didattico simulato) */
S.spid=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px"><div style="border:1px solid var(--line);border-radius:12px;padding:12px 14px;background:#f3f7fb;min-height:330px" data-o="scr"></div><div><b>Che cosa sta succedendo</b><ol data-o="exp" style="font-size:18px;padding-left:24px"></ol><button class="btn ghost" data-a="r">Ricomincia</button></div></div>`;
 const scr=$(el,'[data-o=scr]'),exp=$(el,'[data-o=exp]');
 const S0=()=>{exp.innerHTML='';scr.innerHTML='<div class="tag" style="margin-bottom:8px">Portale didattico · ambiente simulato</div><h3>Area riservata del servizio</h3><p style="font-size:17px">Scegli come accedere:</p><div class="row"><button class="btn" data-g="spid">Entra con SPID</button><button class="btn" data-g="cie">Entra con CIE</button></div>'};
 const add=t=>{const li=document.createElement('li');li.innerHTML=t;exp.append(li)};
 scr.addEventListener('click',e=>{const g=e.target.closest('[data-g]')?.dataset.g;if(!g)return;
  if(g==='spid'){add('Il portale non conosce la tua password: ti manda dal tuo <b>gestore di identità</b>.');scr.innerHTML='<div class="tag">Gestore di identità (esempio)</div><h3>Livello 2</h3><label class="sl" style="grid-template-columns:110px 1fr"><span>Utente</span><input value="mario.rossi"></label><label class="sl" style="grid-template-columns:110px 1fr"><span>Password</span><input type="password" value="esempio"></label><button class="btn gold" data-g="otp">Prosegui</button>'}
  if(g==='cie'){add('Con la CIE di livello 3 si appoggia la carta al telefono (NFC) e si digita il PIN.');scr.innerHTML='<div class="tag">App CieID (esempio)</div><h3>Livello 3</h3><p style="font-size:17px">Appoggia la carta al retro del telefono e inserisci il PIN.</p><button class="btn gold" data-g="ok">📶 Carta letta · PIN corretto</button>'}
  if(g==='otp'){add('<b>Secondo fattore</b>: una notifica sull’app o un codice OTP.');scr.innerHTML='<h3>Conferma sull’app</h3><p style="font-size:17px">Hai ricevuto una richiesta di accesso al «Portale didattico». Sei stato tu?</p><div class="row"><button class="btn gold" data-g="ok">Sì, autorizzo</button><button class="btn ghost" data-g="no">No, non sono io</button></div>'}
  if(g==='no'){add('<b>Hai negato</b>: se non stavi accedendo tu, qualcuno conosce la tua password. Cambiala subito.');scr.innerHTML='<h3 style="color:#8a3d06">Accesso negato</h3>'}
  if(g==='ok'){add('Il gestore conferma al portale <b>chi sei</b> (nome, codice fiscale): il portale ti fa entrare.');scr.innerHTML='<h3 style="color:#145d53">✓ Benvenuto, Mario Rossi</h3><p style="font-size:17px">Codice fiscale verificato dal gestore di identità. Ambiente simulato: nessun dato reale.</p>'}});
 $(el,'[data-a=r]').onclick=S0;S0();
};

/* 28. Il mio kit digitale: checklist personale */
S.kit=el=>{
 const I=[['SPID o CIE con credenziali attive','Serve per accedere a Invitalia, Agenzia delle Entrate, INPS, Camera di Commercio.'],['App del gestore SPID o CieID sul telefono','Per il secondo fattore e il livello 3.'],['Casella PEC attiva','Per il domicilio digitale e le comunicazioni con valore legale.'],['Kit di firma digitale (smart card, token o firma remota)','Per firmare il format di domanda e gli allegati.'],['Programma per firmare e verificare i file','Per produrre .p7m o PDF firmati e controllare le firme ricevute.'],['Accesso al cassetto fiscale provato','Per controllare dati, versamenti e fatture.']];
 el.innerHTML='<p style="font-size:17px;margin:0 0 8px">Spuntate ciò che avete già. Il risultato resta solo su questo schermo.</p>'+I.map((x,k)=>'<label style="display:flex;gap:10px;align-items:flex-start;font-size:18px;margin:0 0 8px"><input type="checkbox" data-k="'+k+'" style="margin-top:6px"><span><b>'+x[0]+'</b><br><small style="color:#52657a">'+x[1]+'</small></span></label>').join('')+'<div class="meter" style="height:18px"><span data-o="m" style="background:#2a9d8f"></span></div><p class="out" data-o="o" style="margin-top:6px"></p>';
 const draw=()=>{const n=$$(el,'input:checked').length;$(el,'[data-o=m]').style.width=n/I.length*100+'%';$(el,'[data-o=o]').textContent=n===I.length?'Kit completo: siete pronti per presentare la domanda online.':'Mancano '+(I.length-n)+' strumenti: segnateli nella bacheca del progetto.'};
 el.addEventListener('change',draw);draw();
};

/* 29. Cassetto fiscale simulato */
S.cassetto=el=>{
 const TAB={Anagrafica:'<table class="rules"><tr><th>Codice fiscale</th><td>FRRGLI99A41B963X (fittizio)</td></tr><tr><th>Domicilio fiscale</th><td>Via Roma 10, 81024 Maddaloni (CE)</td></tr><tr><th>Partita IVA</th><td>Attiva dal 01/10/2026 · ATECO 18.12.00</td></tr></table>',
  Versamenti:'<table class="rules"><thead><tr><th>Data</th><th>Modello</th><th>Tributo</th><th>Importo</th></tr></thead><tbody><tr><td>16/09/2026</td><td>F24</td><td>Diritto camerale</td><td>53,00 €</td></tr><tr><td>16/10/2026</td><td>F24</td><td>IVA mensile</td><td>412,50 €</td></tr><tr><td>16/11/2026</td><td>F24</td><td>Contributi INPS</td><td>1.127,00 €</td></tr></tbody></table>',
  Dichiarazioni:'<table class="rules"><thead><tr><th>Anno</th><th>Modello</th><th>Esito</th></tr></thead><tbody><tr><td>2025</td><td>Redditi PF</td><td>Presentata · nessun debito</td></tr><tr><td>2024</td><td>730</td><td>Rimborso 214,00 €</td></tr></tbody></table>',
  Fatture:'<table class="rules"><thead><tr><th>N.</th><th>Data</th><th>Cliente/fornitore</th><th>Totale</th><th>Stato SdI</th></tr></thead><tbody><tr><td>1/2026</td><td>05/10/2026</td><td>Scuola Don Milani</td><td>610,00 €</td><td><span class="tag ok">Consegnata</span></td></tr><tr><td>2/2026</td><td>20/10/2026</td><td>ASD Atletico</td><td>366,00 €</td><td><span class="tag wait">Disponibile nell’area riservata</span></td></tr><tr><td>F-882</td><td>02/10/2026</td><td>Tessuti Sud Srl (ricevuta)</td><td>1.708,00 €</td><td><span class="tag ok">Ricevuta</span></td></tr></tbody></table>'};
 const Q=[['Quanto è stato versato con l’F24 di ottobre?','412,50'],['Da quando è attiva la partita IVA?','01/10/2026'],['Quale fattura emessa non è stata recapitata al cliente?','2/2026']];
 el.innerHTML='<div class="row" style="justify-content:space-between"><span class="tag">Ambiente simulato · dati fittizi</span><span style="font-size:16px">Area riservata › Cassetto fiscale</span></div><div class="row" data-o="tabs" style="margin:8px 0">'+Object.keys(TAB).map((k,j)=>'<button class="btn ghost" data-t="'+k+'" aria-pressed="'+(j===0)+'">'+k+'</button>').join('')+'</div><div data-o="c" style="font-size:17px;min-height:150px"></div><div class="s-box blue" style="font-size:17px;margin-top:8px"><b>Caccia al dato:</b> '+Q.map((q,k)=>'<div class="row" style="margin-top:4px"><span style="flex:1">'+q[0]+'</span><input data-q="'+k+'" style="width:140px"><span data-a="'+k+'"></span></div>').join('')+'</div>';
 const show=k=>{$(el,'[data-o=c]').innerHTML=TAB[k];$$(el,'[data-t]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.t===k))};
 $(el,'[data-o=tabs]').onclick=e=>{const b=e.target.closest('[data-t]');if(b)show(b.dataset.t)};
 el.addEventListener('input',e=>{const i=e.target.closest('[data-q]');if(!i)return;const ok=i.value.replace(/\s|€/g,'').toLowerCase()===Q[i.dataset.q][1].toLowerCase();$(el,'[data-a="'+i.dataset.q+'"]').innerHTML=ok?'<span class="tag ok">✓</span>':''});
 show('Anagrafica');
};

/* 30. Fattura elettronica: compila, invia allo SdI, leggi l'esito */
S.fattura=el=>{
 el.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px"><div style="font-size:17px">
 <label class="sl" style="grid-template-columns:200px 1fr"><span>Regime</span><select data-f="reg"><option value="ord">Ordinario (IVA 22%)</option><option value="forf">Forfettario (senza IVA)</option></select></label>
 <label class="sl" style="grid-template-columns:200px 1fr"><span>Cliente</span><select data-f="tipo"><option value="b2b">Impresa con partita IVA</option><option value="b2c">Privato consumatore</option></select></label>
 <label class="sl" style="grid-template-columns:200px 1fr"><span data-o="idl">P.IVA cliente</span><input data-f="id" value="01234567890"></label>
 <label class="sl" style="grid-template-columns:200px 1fr"><span>Codice destinatario</span><input data-f="cd" value="M5UXCR1" maxlength="7"></label>
 <label class="sl" style="grid-template-columns:200px 1fr"><span>Descrizione</span><input data-f="ds" value="20 magliette personalizzate"></label>
 <label class="sl" style="grid-template-columns:200px 1fr"><span>Imponibile €</span><input data-f="imp" type="number" value="300" min="0"></label>
 <div class="row" style="margin-top:6px"><button class="btn gold" data-a="send">Invia al Sistema di Interscambio</button></div><div data-o="tot" style="margin-top:6px"></div></div>
 <div><b>Anteprima del file XML (semplificata)</b><div class="log" data-o="x" style="height:170px;font-size:13px"></div><div data-o="e" style="margin-top:8px;font-size:17px"></div></div></div>`;
 const v=k=>$(el,'[data-f='+k+']').value.trim();
 const draw=()=>{const forf=v('reg')==='forf',b2c=v('tipo')==='b2c';$(el,'[data-o=idl]').textContent=b2c?'Codice fiscale cliente':'P.IVA cliente';const imp=Math.max(0,+v('imp')||0),iva=forf?0:imp*0.22,bollo=forf&&imp>77.47?2:0,tot=imp+iva+bollo;
  $(el,'[data-o=tot]').innerHTML='Imponibile <b>'+fmt(imp,2)+' €</b> · IVA <b>'+fmt(iva,2)+' €</b>'+(bollo?' · bollo virtuale <b>2,00 €</b>':'')+' · Totale <b>'+fmt(tot,2)+' €</b>';
  $(el,'[data-o=x]').textContent='<FatturaElettronica versione="FPR12">\n <CessionarioCommittente>\n  <'+(b2c?'CodiceFiscale':'IdCodice')+'>'+v('id')+'</'+(b2c?'CodiceFiscale':'IdCodice')+'>\n </CessionarioCommittente>\n <CodiceDestinatario>'+v('cd')+'</CodiceDestinatario>\n <DettaglioLinee>\n  <Descrizione>'+v('ds')+'</Descrizione>\n  <PrezzoTotale>'+imp.toFixed(2)+'</PrezzoTotale>\n  <AliquotaIVA>'+(forf?'0.00':'22.00')+'</AliquotaIVA>'+(forf?'\n  <Natura>N2.2</Natura>':'')+'\n </DettaglioLinee>\n <ImportoTotaleDocumento>'+tot.toFixed(2)+'</ImportoTotaleDocumento>\n</FatturaElettronica>'};
 $(el,'[data-a=send]').onclick=()=>{const b2c=v('tipo')==='b2c',id=v('id'),cd=v('cd').toUpperCase();const err=[];
  if(b2c&&!/^[A-Z0-9]{16}$/i.test(id))err.push('codice fiscale del cliente non valido (16 caratteri)');if(!b2c&&!/^\d{11}$/.test(id))err.push('partita IVA del cliente non valida (11 cifre)');
  if(!/^[A-Z0-9]{7}$/.test(cd))err.push('codice destinatario di 7 caratteri mancante o errato');if(!v('ds'))err.push('descrizione mancante');if(!(+v('imp')>0))err.push('importo mancante');
  const e=$(el,'[data-o=e]');if(err.length){e.innerHTML='<span class="tag ko">Notifica di scarto</span><ul style="margin:6px 0 0">'+err.map(x=>'<li>'+x+'</li>').join('')+'</ul><p class="small" style="font-size:15px">La fattura scartata si considera non emessa: correggete e reinviate.</p>';return}
  e.innerHTML=cd==='0000000'?'<span class="tag wait">Ricevuta di consegna nell’area riservata</span><p class="small" style="font-size:15px;margin-top:6px">Con 0000000 lo SdI mette la fattura a disposizione del cliente nella sua area riservata (Fatture e Corrispettivi). Ai privati consegnate anche una copia (PDF o carta).</p>':'<span class="tag ok">Ricevuta di consegna</span><p class="small" style="font-size:15px;margin-top:6px">Lo SdI ha controllato il file e lo ha recapitato al canale del codice destinatario. Una copia è nel vostro cassetto e va conservata (servizio gratuito dell’Agenzia delle Entrate).</p>'};
 el.addEventListener('input',draw);el.addEventListener('change',e=>{if(e.target.dataset.f==='tipo'){const b2c=v('tipo')==='b2c';$(el,'[data-f=id]').value=b2c?'RSSMRA80A01F839W':'01234567890';$(el,'[data-f=cd]').value=b2c?'0000000':'M5UXCR1'}draw()});draw();
};


/* 31. Scegli il canale: WhatsApp, email, PEC, firma */
S.canale=el=>{
 const SC=[['Confermare al cliente che la maglietta è pronta per il ritiro','wa','Nessun valore legale richiesto: va bene il canale più veloce.'],
  ['Disdire l’abbonamento al software gestionale prima del rinnovo automatico','pec','Serve la prova di invio e di consegna con data certa: PEC verso la PEC del fornitore (la trovate su INI-PEC).'],
  ['Mandare al commercialista le foto degli scontrini del mese','mail','Documenti di lavoro senza effetti legali: email o cartella condivisa; meglio evitare WhatsApp per i documenti.'],
  ['Rispondere al Comune che ha chiesto un’integrazione alla vostra pratica SUAP','pec','La PA comunica tramite domicilio digitale: si risponde dalla PEC, così resta traccia.'],
  ['Accettare il preventivo di 14.000 € del fornitore del plotter','firma','Un impegno economico: documento firmato digitalmente, poi inviato (anche via PEC).'],
  ['Contestare una fattura sbagliata ricevuta dal fornitore','pec','Contestazione formale con data certa: PEC.'],
  ['Chiedere a un amico un consiglio sul logo','wa','Conversazione informale.'],
  ['Inviare a Invitalia il format di domanda','firma','Il format va firmato digitalmente e caricato sulla piattaforma: né email né PEC bastano da sole.']];
 const K={wa:['💬','WhatsApp'],mail:['✉️','Email'],pec:['📨','PEC'],firma:['✍️','Firma digitale + invio']};
 let i=0,ok=0;
 el.innerHTML='<div class="row" style="justify-content:space-between"><span class="tag" data-o="n"></span><span class="out" data-o="sc"></span></div><h3 data-o="q" style="margin:10px 0;min-height:56px"></h3><div class="row" data-o="b">'+Object.entries(K).map(([k,v])=>'<button class="btn ghost" data-k="'+k+'" style="font-size:19px">'+v[0]+' '+v[1]+'</button>').join('')+'</div><p class="out" data-o="r" style="margin-top:12px;min-height:60px;font-weight:400"></p><div class="row"><button class="btn gold" data-a="next" hidden>Prossima situazione →</button><button class="btn ghost" data-a="rst" hidden>Ricomincia</button></div>';
 const show=()=>{if(i>=SC.length){$(el,'[data-o=q]').textContent='Fine: '+ok+' risposte corrette su '+SC.length+'.';$(el,'[data-o=b]').hidden=true;$(el,'[data-a=next]').hidden=true;$(el,'[data-a=rst]').hidden=false;$(el,'[data-o=r]').textContent='Regola: più la comunicazione ha effetti legali o economici, più serve uno strumento che lasci una prova.';return}
  $(el,'[data-o=n]').textContent='Situazione '+(i+1)+' di '+SC.length;$(el,'[data-o=sc]').textContent=ok+' corrette';$(el,'[data-o=q]').textContent=SC[i][0];$(el,'[data-o=r]').innerHTML='';$(el,'[data-a=next]').hidden=true;$$(el,'[data-k]').forEach(b=>{b.disabled=false;b.style.opacity=1})};
 $(el,'[data-o=b]').onclick=e=>{const b=e.target.closest('[data-k]');if(!b||b.disabled)return;const g=b.dataset.k===SC[i][1];if(g)ok++;$$(el,'[data-k]').forEach(x=>{x.disabled=true;x.style.opacity=x.dataset.k===SC[i][1]?1:.4});
  $(el,'[data-o=r]').innerHTML=(g?'<span class="tag ok">Giusto</span> ':'<span class="tag ko">Meglio: '+K[SC[i][1]][1]+'</span> ')+esc(SC[i][2]);$(el,'[data-a=next]').hidden=false};
 $(el,'[data-a=next]').onclick=()=>{i++;show()};$(el,'[data-a=rst]').onclick=()=>{i=0;ok=0;$(el,'[data-o=b]').hidden=false;$(el,'[data-a=rst]').hidden=true;show()};show();
};

/* 32. Riconosci la PEC truffa */
S.pecfalsa=el=>{
 const M=[{from:'Agenzia delle Entrate <noreply@agenzia-entrate-rimborsi.com>',sub:'Rimborso IRPEF di 486,20 € in attesa di conferma',body:'Gentile contribuente, per ricevere il rimborso inserisca entro 24 ore i dati della sua carta al link: http://agenziaentrate.verifica-rimborso.info',truffa:true,why:['Il mittente non è una PEC dell’Agenzia (il dominio ufficiale è agenziaentrate.gov.it e le PEC sono su pec.agenziaentrate.it).','L’Agenzia non chiede mai dati di carte: i rimborsi arrivano sull’IBAN comunicato.','Urgenza di 24 ore e link esterno: segnali classici.']},
  {from:'Comune di Maddaloni <protocollo@pec.comune.maddaloni.ce.it>',sub:'Richiesta integrazione documentale pratica SUAP n. 2026/0417',body:'Si chiede di trasmettere entro 10 giorni la planimetria del locale firmata digitalmente, rispondendo a questa PEC. Il responsabile del procedimento è indicato in calce.',truffa:false,why:['Mittente PEC istituzionale, riferimento a una pratica specifica, richiesta coerente con l’attività.','Nessun link esterno né richiesta di pagamenti: si risponde dalla propria PEC.','In caso di dubbio: telefonare all’ufficio con il numero del sito del Comune, non quello scritto nel messaggio.']},
  {from:'Gestore PEC <assistenza@legalmail-rinnovi.net>',sub:'La tua casella PEC scade oggi: rinnova con la password',body:'Per evitare la sospensione, accedi qui e conferma la password della casella.',truffa:true,why:['Il dominio del mittente imita il gestore ma non è il suo.','Nessun gestore chiede la password via messaggio.','Il rinnovo si fa sempre dall’area clienti del gestore, raggiunta digitando l’indirizzo nel browser.']},
  {from:'Tessuti Sud Srl <amministrazione@pec.tessutisud.it>',sub:'Sollecito pagamento fattura F-882 del 02/10/2026',body:'Risulta non pagata la fattura F-882 di 1.708,00 €. Vi preghiamo di provvedere entro 15 giorni al nuovo IBAN IT60 X054 2811 1010 0000 0123 456, cambiato per motivi organizzativi.',truffa:true,why:['Mittente e fattura sembrano veri, ma il cambio di IBAN «per motivi organizzativi» è la truffa più diffusa contro le piccole imprese.','Verificare SEMPRE un nuovo IBAN telefonando al fornitore a un numero già noto.','Anche una PEC autentica può provenire da una casella violata.']}];
 let i=0;
 el.innerHTML='<div class="row" style="justify-content:space-between"><span class="tag" data-o="n"></span><div class="row"><button class="btn" data-a="ok">✅ È autentica</button><button class="btn" data-a="ko" style="background:#8a3d06">🚩 È una truffa</button></div></div><div class="mini-doc" data-o="m" style="margin-top:10px;white-space:normal;font-size:17px"></div><div data-o="r" style="margin-top:10px;font-size:17px"></div><div class="row" style="margin-top:8px"><button class="btn gold" data-a="next" hidden>Prossimo messaggio →</button><button class="btn ghost" data-a="rst" hidden>Ricomincia</button></div>';
 const show=()=>{const m=M[i];$(el,'[data-o=n]').textContent='Messaggio '+(i+1)+' di '+M.length;$(el,'[data-o=m]').innerHTML='<div><b>Da:</b> '+esc(m.from)+'</div><div><b>Oggetto:</b> '+esc(m.sub)+'</div><hr style="border:0;border-top:1px solid #c9d6e2;margin:6px 0"><div>'+esc(m.body)+'</div>';$(el,'[data-o=r]').innerHTML='';$(el,'[data-a=next]').hidden=true;$$(el,'[data-a=ok],[data-a=ko]').forEach(b=>b.disabled=false)};
 el.addEventListener('click',e=>{const a=e.target.closest('[data-a]')?.dataset.a;if(!a)return;
  if(a==='ok'||a==='ko'){const m=M[i];const g=(a==='ko')===m.truffa;$$(el,'[data-a=ok],[data-a=ko]').forEach(b=>b.disabled=true);$(el,'[data-o=r]').innerHTML=(g?'<span class="tag ok">Esatto</span>':'<span class="tag ko">Attenzione</span>')+' <b>'+(m.truffa?'È una truffa.':'È autentica.')+'</b><ul style="margin:6px 0 0">'+m.why.map(w=>'<li>'+esc(w)+'</li>').join('')+'</ul>';if(i<M.length-1)$(el,'[data-a=next]').hidden=false;else $(el,'[data-a=rst]').hidden=false}
  if(a==='next'){i++;show()}if(a==='rst'){i=0;$(el,'[data-a=rst]').hidden=true;show()}});
 show();
};

/* 33. Quanto costa il kit digitale (stime indicative, da verificare) */
S.costi=el=>{
 const I=[['SPID',[['CIE (gratuita, serve la carta e l’app CieID)',0],['SPID gratuito (alcuni gestori, livello 2)',0],['SPID con canone (es. Poste dal 2026)',6]]],
  ['PEC',[['Casella base (1 GB)',6],['Casella con archivio e notifiche',12],['Casella per società con più utenti',25]]],
  ['Firma digitale',[['Firma remota (1 anno)',15],['Token USB (3 anni, costo diviso per anno)',25],['Smart card + lettore (3 anni, per anno)',20]]],
  ['Fatturazione elettronica',[['Servizio gratuito dell’Agenzia delle Entrate',0],['Software base',60],['Software con gestionale',200]]]];
 el.innerHTML='<div style="display:grid;grid-template-columns:1.3fr 1fr;gap:18px"><div>'+I.map((g,k)=>'<label class="sl" style="grid-template-columns:170px 1fr"><span><b>'+g[0]+'</b></span><select data-k="'+k+'">'+g[1].map((o,j)=>'<option value="'+o[1]+'">'+o[0]+(o[1]?' · ~'+o[1]+' €/anno':' · gratis')+'</option>').join('')+'</select></label>').join('')+'<p class="small muted" style="font-size:15px;margin-top:8px">Importi indicativi al netto di IVA, da verificare sui siti dei gestori: cambiano spesso.</p></div><div style="text-align:center"><div style="font-size:18px">Costo stimato del kit</div><div data-o="t" style="font-size:60px;font-weight:800;color:#102a43"></div><div style="font-size:18px">all’anno, cioè <b data-o="m"></b> al mese</div><p class="out" data-o="o" style="margin-top:10px;font-weight:400"></p></div></div>';
 const draw=()=>{const t=$$(el,'select').reduce((a,s)=>a+ +s.value,0);$(el,'[data-o=t]').textContent=fmt(t)+' €';$(el,'[data-o=m]').textContent=fmt(t/12,2)+' €';$(el,'[data-o=o]').textContent=t===0?'Si può partire a costo zero: CIE, SPID gratuito e servizio dell’Agenzia. Resta da pagare solo la PEC.':t<60?'Meno di una raccomandata al mese: con una sola disdetta via PEC il kit si è ripagato.':'Scelta più comoda: valutate se le funzioni in più vi servono davvero.'};
 el.addEventListener('change',draw);draw();
};

/* montaggio */
function mount(){document.querySelectorAll('[data-sim]').forEach(el=>{if(el.dataset.ready)return;el.classList.add('sim');const f=S[el.dataset.sim];if(f){try{f(el);el.dataset.ready='1'}catch(e){el.textContent='Simulazione non disponibile: '+e.message;console.error(e)}}})}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',mount):mount();
window.UD12Sim=S;
})();

/* protezione slide ufficiali (deterrente lato client) */
(function(){
 var T=function(){return document.documentElement.classList.contains('trainer-on')};
 document.addEventListener('contextmenu',function(e){if(!T()&&e.target.closest('.slide.orig, .slide img'))e.preventDefault()},true);
 document.addEventListener('dragstart',function(e){if(!T()&&e.target.closest('.slide'))e.preventDefault()},true);
 document.addEventListener('copy',function(e){if(!T()&&e.target.closest&&e.target.closest('.slide.orig'))e.preventDefault()},true);
 document.addEventListener('keydown',function(e){if(T())return;var k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='p'||k==='s')){e.preventDefault();e.stopPropagation()}},true);
 window.addEventListener('beforeprint',function(){if(!T())document.documentElement.classList.add('no-print-orig')});
 window.addEventListener('afterprint',function(){document.documentElement.classList.remove('no-print-orig')});
})();
