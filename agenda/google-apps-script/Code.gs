const SHEET_ID = "INSERIRE_ID_GOOGLE_SHEET";
const SHEET_NAME = "Agenda";
const SCRIPT_VERSION = "2.0";

function doGet(e) {
  const action = e && e.parameter ? e.parameter.action : "";
  if (action === "list") {
    const result = {ok:true, events:listEvents(), version:SCRIPT_VERSION};
    const callback = e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + "(" + JSON.stringify(result) + ")")
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return json(result);
  }
  return json({ok:true, service:"Agenda Adinolfi", version:SCRIPT_VERSION});
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");

    if (body.action === "upsert" && body.event) {
      upsertEvent(body.event);
      return json({ok:true, action:"upsert"});
    }

    if (body.action === "delete" && body.id) {
      deleteEvent(String(body.id));
      return json({ok:true, action:"delete"});
    }

    if (body.action === "list") {
      return json({ok:true, events:listEvents(), version:SCRIPT_VERSION});
    }

    return json({ok:false,error:"Azione non riconosciuta"});
  } catch (err) {
    return json({ok:false,error:String(err.message || err)});
  }
}

function sheet_() {
  const ss=SpreadsheetApp.openById(SHEET_ID);
  let sh=ss.getSheetByName(SHEET_NAME);
  if (!sh) sh=ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow()===0) {
    sh.appendRow(["id","date","time","category","title","desc","priority","status","reminder","updatedAt"]);
  }
  return sh;
}

function upsertEvent(e) {
  const sh=sheet_();
  const values=sh.getDataRange().getValues();
  const row=values.findIndex((r,i)=>i>0 && String(r[0])===String(e.id));
  const data=[
    String(e.id || ""),
    e.date || "",
    e.time || "",
    e.category || "",
    e.title || "",
    e.desc || "",
    e.priority || "Media",
    e.status || "Da fare",
    e.reminder || "Nessuno",
    new Date()
  ];
  if(row===-1) sh.appendRow(data);
  else sh.getRange(row+1,1,1,data.length).setValues([data]);
}

function deleteEvent(id) {
  const sh=sheet_();
  const values=sh.getDataRange().getValues();
  const row=values.findIndex((r,i)=>i>0 && String(r[0])===String(id));
  if(row!==-1) sh.deleteRow(row+1);
}

function listEvents() {
  const sh=sheet_();
  const tz=sh.getParent().getSpreadsheetTimeZone() || Session.getScriptTimeZone() || "Europe/Rome";
  const values=sh.getDataRange().getValues();

  return values.slice(1).filter(r=>r[0]).map(r=>({
    id:String(r[0]),
    date:formatDate_(r[1],tz),
    time:formatTime_(r[2],tz),
    category:String(r[3] || ""),
    title:String(r[4] || ""),
    desc:String(r[5] || ""),
    priority:String(r[6] || "Media"),
    status:String(r[7] || "Da fare"),
    reminder:String(r[8] || "Nessuno")
  }));
}

function formatDate_(value,tz) {
  if (value instanceof Date) return Utilities.formatDate(value,tz,"yyyy-MM-dd");
  return String(value || "").slice(0,10);
}

function formatTime_(value,tz) {
  if (value instanceof Date) return Utilities.formatDate(value,tz,"HH:mm");
  return String(value || "").slice(0,5);
}

function json(obj){
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
