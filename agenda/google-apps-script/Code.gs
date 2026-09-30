const SHEET_ID = "INSERIRE_ID_GOOGLE_SHEET";
const SHEET_NAME = "Agenda";

function doGet() {
  return json({ok:true, service:"Agenda Adinolfi", version:"1.0"});
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  if (body.action === "upsert" && body.event) {
    upsertEvent(body.event);
    return json({ok:true});
  }
  if (body.action === "list") return json({ok:true, events:listEvents()});
  return json({ok:false,error:"Azione non riconosciuta"});
}

function sheet_() {
  const ss=SpreadsheetApp.openById(SHEET_ID);
  let sh=ss.getSheetByName(SHEET_NAME);
  if (!sh) sh=ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow()===0) sh.appendRow(["id","date","time","category","title","desc","priority","status","reminder","updatedAt"]);
  return sh;
}

function upsertEvent(e) {
  const sh=sheet_(), values=sh.getDataRange().getValues();
  const row=values.findIndex((r,i)=>i>0 && String(r[0])===String(e.id));
  const data=[e.id,e.date,e.time,e.category,e.title,e.desc,e.priority,e.status,e.reminder,new Date()];
  if(row===-1) sh.appendRow(data); else sh.getRange(row+1,1,1,data.length).setValues([data]);
}

function listEvents() {
  const values=sheet_().getDataRange().getValues();
  return values.slice(1).filter(r=>r[0]).map(r=>({id:String(r[0]),date:r[1],time:r[2],category:r[3],title:r[4],desc:r[5],priority:r[6],status:r[7],reminder:r[8]}));
}

function json(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}
