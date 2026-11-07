"use strict";
/* Dati aziendali da reperire presso il datore di lavoro (dalla checklist delle incongruenze del DVR rev. 01 del 05/10/2024).
   Nelle slide: <span data-f="chiave"></span>. Valore vuoto = segnaposto arancione «da completare».
   I valori si inseriscono nel Kit del formatore: restano in questo browser (localStorage) e si possono esportare/importare.
   Per renderli definitivi per tutti, incollare il file esportato al posto di DEFAULTS qui sotto. */
window.SicAzienda=(()=>{
 const KEY='sicLFS-azienda-v1';
 const FIELDS=[
  // sez = sezione della checklist · slide = dove compare nel corso
  {k:'ateco',sez:'A',label:'Codici ATECO 2025 risultanti dalla visura camerale',why:'Il DVR rev. 01 riporta 5 codici ATECO 2007 e non più il 29.32.09.',slide:'M1'},
  {k:'attivita',sez:'A',label:'Attività svolte davvero oggi e loro peso (giornate/anno)',why:'Il DVR aggiunge lavori forestali ed edili alla descrizione «assemblaggi».',slide:'M1'},
  {k:'luoghi',sez:'A',label:'Luoghi di lavoro oltre la sede di Via Fillak 1 (boschi, cantieri, aree verdi)',why:'Il DVR indica una sola sede ma descrive cantieri esterni.',slide:'M1, M3, M4'},
  {k:'medico',sez:'B',label:'Medico competente: nome e cognome',why:'Il nominativo è vuoto; serve per biologico, vibrazioni, rumore.',slide:'M1, M4'},
  {k:'rls_nomina',sez:'B',label:'RLS: data e modalità di elezione o designazione',why:'Data di nomina vuota nel Modulo 1.1.',slide:'M1'},
  {k:'preposto',sez:'B',label:'Chi sovrintende ai lavori nei cantieri esterni (preposto)',why:'Il DVR non individua preposti.',slide:'M1, M3'},
  {k:'prodotti',sez:'C',label:'Prodotti chimici in uso (colle, oli, carburante, olio catena, malte, cemento…)',why:'Agenti chimici segnati presenti; servono le schede di sicurezza.',slide:'M2'},
  {k:'macchine',sez:'D',label:'Macchine presenti in officina (presse, rivettatrici, saldatrici…)',why:'Modulo 2: «macchine fisse» presenti, ma non elencate.',slide:'M2'},
  {k:'compressore',sez:'D',label:'Compressore: capacità serbatoio (l), pressione (bar), verifiche',why:'Apparecchi in pressione segnati «non presenti».',slide:'M2'},
  {k:'transpallet',sez:'D',label:'Transpallet elettrico: a timone o con conducente a bordo; eventuali muletti',why:'Decide se serve l’abilitazione carrelli.',slide:'M2'},
  {k:'motosega',sez:'E',label:'Motoseghe: modello, rumore dB(A), vibrazioni m/s², ore d’uso al giorno',why:'Rumore «classe 1» e vibrazioni «media» senza dati.',slide:'M3'},
  {k:'trattore',sez:'E',label:'Trattori: modello, telaio di protezione (ROPS), chi li guida e abilitazione',why:'Abilitazione obbligatoria non citata.',slide:'M3'},
  {k:'ruspa',sez:'E',label:'Pala caricatrice / ruspa: chi la guida e abilitazione',why:'Abilitazione obbligatoria non citata.',slide:'M3'},
  {k:'dpi_forestali',sez:'E',label:'DPI forestali consegnati (pantaloni/gambali antitaglio, casco con visiera e cuffie…)',why:'«Antitaglio» non compare mai nel DVR.',slide:'M3'},
  {k:'isolato',sez:'E',label:'Come si chiama aiuto nel bosco (lavoro in coppia, copertura telefono, punto di incontro)',why:'Lavoro isolato e primo soccorso nei cantieri.',slide:'M3, M4'},
  {k:'vaccino',sez:'E',label:'Chi organizza la vaccinazione antitetanica e i richiami',why:'Rischio biologico R = 9 senza misure; vaccinazione obbligatoria (L. 292/1963).',slide:'M3'},
  {k:'cantieri',sez:'F',label:'Che tipo di cantieri edili si fanno e chi redige il POS',why:'Il DVR non nomina mai il POS.',slide:'M4'},
  {k:'quota',sez:'F',label:'Opere provvisionali usate (trabattello, ponte su cavalletti, ponteggi) e altezze massime',why:'Caduta dall’alto valutata solo a livello di attrezzo.',slide:'M4'},
  {k:'demolitori',sez:'F',label:'Martello pneumatico e demolitore: modello, dB(A), m/s², ore d’uso',why:'Rumore «trascurabile» e vibrazioni «basse» da verificare.',slide:'M4'},
  {k:'otoprotettori',sez:'G',label:'Otoprotettori consegnati (tipo, SNR)',why:'Rumore senza livelli in dB(A).',slide:'M2, M3, M4'},
  {k:'estintori',sez:'H',label:'Estintori in sede: numero, posizione, ultimo controllo',why:'Il DVR prevede il controllo semestrale.',slide:'M2, M4'},
  {k:'raccolta',sez:'H',label:'Punto di raccolta in caso di evacuazione della sede',why:'Non indicato nei documenti.',slide:'M4'},
  {k:'carburante',sez:'H',label:'Deposito di carburante e infiammabili: dove e quanti litri',why:'Motosega e trattore usano carburante.',slide:'M4'},
  {k:'medicazione',sez:'H',label:'Pacchetto di medicazione: in sede e su quali mezzi',why:'Gruppo C del DM 388/2003; cantieri isolati.',slide:'M4'}
 ];
 const DEFAULTS={}; // valori definitivi, da incollare dal file esportato
 const store={get(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}},set(v){try{localStorage.setItem(KEY,JSON.stringify(v));return true}catch{return false}}};
 const values=()=>Object.assign({},DEFAULTS,store.get());
 const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 function apply(root=document){const v=values();root.querySelectorAll('[data-f]').forEach(el=>{const f=FIELDS.find(x=>x.k===el.dataset.f);const val=(v[el.dataset.f]||'').trim();
  el.classList.add('fill');el.classList.toggle('ok',!!val);el.classList.toggle('todo',!val);
  el.innerHTML=val?esc(val).replace(/\n/g,'<br>'):'da completare: '+esc(f?f.label:el.dataset.f);
  el.title=val?'Dato aziendale':'Dato da reperire presso il datore di lavoro (Kit del formatore)'})}
 function missing(){const v=values();return FIELDS.filter(f=>!(v[f.k]||'').trim())}
 return {FIELDS,values,apply,missing,save:o=>store.set(o),KEY};
})();
