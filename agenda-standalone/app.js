const KEY="adinolfi_agenda_v1";
const pad=n=>String(n).padStart(2,"0");
const iso=d=>d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const today=iso(new Date());
let events=JSON.parse(localStorage.getItem(KEY)||"[]");
let filter="all"; let deferredInstall=null;
const $=id=>document.getElementById(id);
function esc(s){return String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function saveLocal(){localStorage.setItem(KEY,JSON.stringify(events))}
function normalizeCloudEvent(e){
  const x={...e};
  // Google Apps Script may serialize a Sheets date as an ISO timestamp in UTC.
  // Convert it back to the browser's local calendar date before rendering.
  if(typeof x.date==="string" && x.date.includes("T")){
    const d=new Date(x.date);
    if(!Number.isNaN(d.getTime())) x.date=iso(d);
  }else if(x.date instanceof Date){
    x.date=iso(x.date);
  }
  return x;
}
function weekBounds(){const d=new Date();const day=(d.getDay()+6)%7;const a=new Date(d);a.setHours(0,0,0,0);a.setDate(d.getDate()-day);const b=new Date(a);b.setDate(a.getDate()+6);b.setHours(23,59,59,999);return[a,b]}
function inWeek(e){if(!e.date)return false;const [a,b]=weekBounds(),d=new Date(e.date+"T12:00:00");return d>=a&&d<=b}
function matches(e){const q=$("search").value.trim().toLowerCase(),cat=$("cat").value;if(cat!=="all"&&e.category!==cat)return false;if(q&&!(e.title+" "+e.desc+" "+e.category).toLowerCase().includes(q))return false;if(filter==="today"&&e.date!==today)return false;if(filter==="week"&&!inWeek(e))return false;if(filter==="todo"&&e.status==="Completato")return false;if(filter==="high"&&e.priority!=="Alta")return false;return true}
function render(){const list=$("list");const arr=[...events].sort((a,b)=>(a.date||"9999").localeCompare(b.date||"9999")||(a.time||"99").localeCompare(b.time||"99"));const v=arr.filter(matches);list.innerHTML="";if(!v.length){list.innerHTML='<div class="empty">Nessun impegno trovato.</div>'}else v.forEach(e=>{const d=e.date?new Date(e.date+"T12:00:00").toLocaleDateString("it-IT",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"}):"Data da definire";const x=document.createElement("div");x.className="event "+e.priority.toLowerCase();x.innerHTML='<div class="bar"></div><div><h3>'+esc(e.title)+'</h3><div class="meta">'+d+(e.time?" · "+esc(e.time):"")+'</div><div><span class="badge">'+esc(e.category)+'</span><span class="badge">'+esc(e.priority)+'</span><span class="badge">'+esc(e.status)+'</span></div><div class="meta">'+esc(e.desc)+'</div></div><div class="actions"><button data-edit="'+e.id+'">Modifica</button><button data-done="'+e.id+'">'+(e.status==="Completato"?"Riapri":"Completa")+'</button></div>';list.appendChild(x)});$("sToday").textContent=events.filter(e=>e.date===today).length;$("sWeek").textContent=events.filter(inWeek).length;$("sTodo").textContent=events.filter(e=>e.status!=="Completato").length;$("sHigh").textContent=events.filter(e=>e.priority==="Alta"&&e.status!=="Completato").length}
function reset(){ $("id").value=""; $("date").value=today; $("time").value=""; $("title").value=""; $("desc").value=""; $("priority").value="Media"; $("reminder").value="Nessuno" }
let calendarCursor=new Date();
calendarCursor.setDate(1);

function pad2(n){return String(n).padStart(2,"0")}
function monthKey(d){return d.getFullYear()+"-"+pad2(d.getMonth()+1)}
function renderCalendar(){
  const grid=$("calendarGrid"), title=$("monthTitle");
  if(!grid||!title)return;
  const y=calendarCursor.getFullYear(), m=calendarCursor.getMonth();
  title.textContent=calendarCursor.toLocaleDateString("it-IT",{month:"long",year:"numeric"});
  const names=["Lun","Mar","Mer","Gio","Ven","Sab","Dom"];
  grid.innerHTML=names.map(n=>'<div class="cal-dayname">'+n+'</div>').join("");
  const first=new Date(y,m,1);
  const start=(first.getDay()+6)%7;
  const days=new Date(y,m+1,0).getDate();
  const prevDays=new Date(y,m,0).getDate();
  const total=Math.ceil((start+days)/7)*7;
  for(let i=0;i<total;i++){
    const cell=document.createElement("div");
    cell.className="cal-cell";
    let day=i-start+1, yy=y, mm=m;
    if(day<1){day=prevDays+day;mm=m-1;if(mm<0){mm=11;yy--}cell.classList.add("muted")}
    else if(day>days){day=day-days;mm=m+1;if(mm>11){mm=0;yy++}cell.classList.add("muted")}
    const date=yy+"-"+pad2(mm+1)+"-"+pad2(day);
    if(date===today)cell.classList.add("today");
    cell.innerHTML='<div class="cal-num">'+day+'</div>';
    const dayEvents=events.filter(e=>e.date===date).sort((a,b)=>(a.time||"99").localeCompare(b.time||"99"));
    dayEvents.slice(0,3).forEach(e=>{
      const ev=document.createElement("div");
      ev.className="cal-event"+(e.status==="Completato"?" done":"");
      ev.textContent=(e.time?e.time+" ":"")+e.title;
      ev.title=e.title+(e.time?" · "+e.time:"");
      ev.dataset.edit=e.id;
      cell.appendChild(ev);
    });
    if(dayEvents.length>3){
      const more=document.createElement("div");
      more.className="cal-more";
      more.textContent="+"+(dayEvents.length-3)+" altri";
      cell.appendChild(more);
    }
    cell.dataset.date=date;
    grid.appendChild(cell);
  }
}
function openDate(date){
  $("date").value=date;
  document.querySelectorAll("[data-filter]").forEach(x=>x.classList.remove("active"));
  filter="all";
  render();
  $("listView").click();
  $("formPanel").scrollIntoView({behavior:"smooth",block:"start"});
}
function icsEscape(v){
  return String(v||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n");
}
function icsDate(e,end){
  if(!e.time)return e.date.replace(/-/g,"");
  const parts=e.time.split(":").map(Number);
  const d=new Date(e.date+"T"+pad2(parts[0])+":"+pad2(parts[1])+":00");
  if(end)d.setHours(d.getHours()+1);
  return d.getFullYear()+pad2(d.getMonth()+1)+pad2(d.getDate())+"T"+pad2(d.getHours())+pad2(d.getMinutes())+"00";
}
function exportICS(){
  const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Antonio Adinolfi//Agenda//IT","CALSCALE:GREGORIAN"];
  events.forEach(e=>{
    if(!e.date||!e.title)return;
    const allDay=!e.time;
    lines.push("BEGIN:VEVENT","UID:"+icsEscape(e.id)+"@antonioadinolfiscuola.it");
    if(allDay){
      lines.push("DTSTART;VALUE=DATE:"+icsDate(e,false));
      const end=new Date(e.date+"T12:00:00");end.setDate(end.getDate()+1);
      lines.push("DTEND;VALUE=DATE:"+end.getFullYear()+pad2(end.getMonth()+1)+pad2(end.getDate()));
    }else{
      lines.push("DTSTART:"+icsDate(e,false),"DTEND:"+icsDate(e,true));
    }
    lines.push("SUMMARY:"+icsEscape(e.title),"DESCRIPTION:"+icsEscape(e.desc||""));
    if(e.category)lines.push("CATEGORIES:"+icsEscape(e.category));
    lines.push("END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  const blob=new Blob([lines.join("\r\n")],"text/calendar;charset=utf-8");
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="Agenda_Prof_Adinolfi.ics";a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
async function enableNotifications(){
  if(!("Notification"in window)){alert("Il browser non supporta le notifiche.");return}
  const p=await Notification.requestPermission();
  if(p==="granted"){
    $("notifyBtn").textContent="🔔 Promemoria attivi";
    scheduleReminders();
  }else{
    $("notifyBtn").textContent="🔕 Notifiche bloccate";
  }
}
function scheduleReminders(){
  if(!("Notification"in window)||Notification.permission!=="granted")return;
  events.forEach(e=>{
    if(!e.time||e.reminder==="Nessuno"||e.status==="Completato")return;
    const mins={"30 minuti prima":30,"2 ore prima":120,"1 giorno prima":1440}[e.reminder];
    if(!mins)return;
    const target=new Date(e.date+"T"+e.time+":00");
    target.setMinutes(target.getMinutes()-mins);
    const delay=target.getTime()-Date.now();
    if(delay>0&&delay<2147483647){
      setTimeout(()=>{
        if(Notification.permission==="granted")new Notification("Agenda — Promemoria",{body:e.title+" · "+e.date+" "+e.time,tag:"agenda-"+e.id});
      },delay);
    }
  });
}

$("form").addEventListener("submit",async ev=>{ev.preventDefault();const id=$("id").value||(crypto.randomUUID?crypto.randomUUID():String(Date.now())+"-"+Math.random().toString(36).slice(2,8));const item={id,date:$("date").value,time:$("time").value,category:$("category").value,title:$("title").value.trim(),desc:$("desc").value.trim(),priority:$("priority").value,reminder:$("reminder").value,status:"Da fare"};const i=events.findIndex(x=>x.id===id);if(i>=0){item.status=events[i].status;events[i]=item}else events.push(item);saveLocal();render();reset()});

$("listView").onclick=()=>{
  $("listView").classList.add("active");$("calendarView").classList.remove("active");
  $("listPanel").hidden=false;$("calendarPanel").hidden=true;
};
$("calendarView").onclick=()=>{
  $("calendarView").classList.add("active");$("listView").classList.remove("active");
  $("listPanel").hidden=true;$("calendarPanel").hidden=false;renderCalendar();
};
$("prevMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()-1);renderCalendar()};
$("nextMonth").onclick=()=>{calendarCursor.setMonth(calendarCursor.getMonth()+1);renderCalendar()};
$("todayMonth").onclick=()=>{calendarCursor=new Date();calendarCursor.setDate(1);renderCalendar()};
$("calendarGrid").addEventListener("click",ev=>{
  const item=ev.target.closest("[data-edit]");
  if(item){
    const e=events.find(x=>x.id===item.dataset.edit);
    if(e){$("listView").click();$("id").value=e.id;$("date").value=e.date;$("time").value=e.time||"";$("category").value=e.category;$("title").value=e.title;$("desc").value=e.desc||"";$("priority").value=e.priority;$("reminder").value=e.reminder||"Nessuno";$("formPanel").scrollIntoView({behavior:"smooth",block:"start"});}
    return;
  }
  const cell=ev.target.closest(".cal-cell");
  if(cell&&cell.dataset.date)openDate(cell.dataset.date);
});
$("icsBtn").onclick=exportICS;
$("notifyBtn").onclick=enableNotifications;
$("cancel").onclick=reset;$("newBtn").onclick=()=>{reset();$("title").focus()};$("search").oninput=render;$("cat").onchange=render;
document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));render()});
$("list").addEventListener("click",async ev=>{const edit=ev.target.closest("[data-edit]"),done=ev.target.closest("[data-done]");const id=(edit||done)?.dataset?.[edit?"edit":"done"];if(!id)return;const e=events.find(x=>x.id===id);if(!e)return;if(edit){Object.entries({id:e.id,date:e.date,time:e.time,category:e.category,title:e.title,desc:e.desc,priority:e.priority,reminder:e.reminder}).forEach(([k,v])=>$(k).value=v);$("formPanel").scrollIntoView({behavior:"smooth",block:"start"})}else{e.status=e.status==="Completato"?"Da fare":"Completato";saveLocal();render();}});
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstall=e;$("install").hidden=false});$("install").onclick=async()=>{if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;$("install").hidden=true}};
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
reset();render();renderCalendar();