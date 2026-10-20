"use strict";
const express=require("express");
const cors=require("cors");
const helmet=require("helmet");
const rateLimit=require("express-rate-limit");
const {OAuth2Client}=require("google-auth-library");
const {google}=require("googleapis");
const app=express();
app.disable("x-powered-by");
app.use(helmet());
const origins=(process.env.PORTAL_ORIGINS||"").split(",").map(x=>x.trim()).filter(Boolean);
app.use(cors({origin(origin,cb){if(!origin||origins.includes(origin))return cb(null,true);return cb(new Error("Origin non autorizzata"));},methods:["GET","PUT","OPTIONS"],allowedHeaders:["Authorization","Content-Type"],maxAge:600}));
app.use(express.json({limit:"32kb"}));
app.use(rateLimit({windowMs:60000,limit:120,standardHeaders:"draft-7",legacyHeaders:false}));
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const domain=(process.env.GOOGLE_WORKSPACE_DOMAIN||"").toLowerCase();
const teachers=new Set((process.env.TEACHER_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
const students=new Set((process.env.STUDENT_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).filter(Boolean));
const auth=new google.auth.GoogleAuth({scopes:["https://www.googleapis.com/auth/drive"]});
const drive=google.drive({version:"v3",auth});
const allowedMimeTypes=new Set(["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-powerpoint","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]);
function fail(status,message){const e=new Error(message);e.status=status;return e;}
function roleFor(email){if(teachers.has(email))return "teacher";if(students.has(email))return "student";return null;}
function authenticate(req,res,next){(async()=>{const match=/^Bearer\s+(.+)$/i.exec(req.get("authorization")||"");if(!match)throw fail(401,"Autenticazione richiesta.");const ticket=await client.verifyIdToken({idToken:match[1],audience:process.env.GOOGLE_CLIENT_ID});const p=ticket.getPayload();if(!p||!p.email||p.email_verified!==true)throw fail(401,"Identità Google non verificata.");const email=String(p.email).trim().toLowerCase();if(!domain||p.hd!==domain||!email.endsWith("@"+domain))throw fail(403,"Usa l'account Google Workspace autorizzato.");const role=roleFor(email);if(!role)throw fail(403,"Account non presente nell'elenco degli utenti autorizzati.");req.user={email,name:p.name||"",role};})().then(()=>next()).catch(e=>next(e.status?e:fail(401,"Token Google non valido o scaduto.")));}
function requireTeacher(req,res,next){if(req.user?.role!=="teacher")return next(fail(403,"Operazione riservata al docente."));next();}
async function currentLesson(){const r=await drive.files.get({fileId:process.env.DRIVE_PORTAL_CONFIG_FILE_ID,alt:"media"},{responseType:"json"});const d=r.data;const n=Number(d&&d.currentLesson);if(!Number.isInteger(n)||n<1||n>6)throw fail(503,"Il docente non ha configurato una lezione valida.");return{currentLesson:n,title:String(d.title||""),description:String(d.description||""),publishedAt:d.publishedAt||null};}
function meta(file){const d=file.description||"",m=d.match(/lezione\s*[:=]\s*([1-6])/i),c=d.match(/categoria\s*[:=]\s*([^;|\n]+)/i),s=d.match(/descrizione\s*[:=]\s*([^;|\n]+)/i);return{lessonNumber:Number(file.appProperties?.lessonNumber||(m&&m[1])||0)||null,category:file.appProperties?.category||(c&&c[1].trim())||"",description:file.appProperties?.summary||(s&&s[1].trim())||d.replace(/lezione\s*[:=]\s*[1-6]/ig,"").trim()};}
async function materials(){const folder=process.env.DRIVE_MATERIALS_FOLDER_ID;if(!folder)throw fail(503,"Archivio Drive non configurato.");const r=await drive.files.list({q:"'"+folder.replace(/'/g,"\\'")+"' in parents and trashed = false",pageSize:1000,orderBy:"name",fields:"files(id,name,mimeType,description,modifiedTime,size,appProperties)",supportsAllDrives:true,includeItemsFromAllDrives:true});return(r.data.files||[]).filter(f=>allowedMimeTypes.has(f.mimeType)).map(f=>Object.assign({id:f.id,name:f.name,mimeType:f.mimeType,modifiedTime:f.modifiedTime||null,size:f.size||null},meta(f)));}
app.get("/health",(req,res)=>res.json({ok:true,service:"vibe-coding-portal-api"}));
app.get("/api/me",authenticate,(req,res)=>res.json({user:req.user}));
app.get("/api/current-lesson",authenticate,async(req,res,next)=>{try{res.json({lesson:await currentLesson()});}catch(e){next(e);}});
app.get("/api/materials",authenticate,async(req,res,next)=>{try{const lesson=await currentLesson();let list=await materials();if(req.user.role!=="teacher")list=list.filter(f=>f.lessonNumber===lesson.currentLesson);res.set("Cache-Control","private, no-store");res.json({materials:list});}catch(e){next(e);}});
app.get("/api/materials/:id/download",authenticate,async(req,res,next)=>{try{const lesson=await currentLesson();const file=(await materials()).find(f=>f.id===req.params.id);if(!file)throw fail(404,"Materiale non trovato o formato non consentito.");if(req.user.role!=="teacher"&&file.lessonNumber!==lesson.currentLesson)throw fail(403,"Materiale non appartenente alla lezione pubblicata.");const r=await drive.files.get({fileId:file.id,alt:"media",supportsAllDrives:true},{responseType:"stream"});res.set("Content-Type",file.mimeType);res.set("Content-Disposition","attachment; filename*=UTF-8''"+encodeURIComponent(file.name.replace(/[\r\n"]/g,"_")));res.set("Cache-Control","private, no-store");r.data.on("error",next);r.data.pipe(res);}catch(e){next(e);}});
app.put("/api/admin/current-lesson",authenticate,requireTeacher,async(req,res,next)=>{try{const n=Number(req.body?.currentLesson);if(!Number.isInteger(n)||n<1||n>6)throw fail(400,"La lezione deve essere un numero da 1 a 6.");const d={currentLesson:n,title:String(req.body.title||"").slice(0,180),description:String(req.body.description||"").slice(0,1000),publishedAt:new Date().toISOString(),publishedBy:req.user.email};await drive.files.update({fileId:process.env.DRIVE_PORTAL_CONFIG_FILE_ID,requestBody:{mimeType:"application/json"},media:{mimeType:"application/json",body:JSON.stringify(d)},supportsAllDrives:true,fields:"id,name,mimeType"});res.json({ok:true,lesson:{currentLesson:n,title:d.title,description:d.description,publishedAt:d.publishedAt}});}catch(e){next(e);}});
app.use((err,req,res,next)=>{if(res.headersSent)return next(err);const status=Number(err.status)||500;if(status>=500)console.error("API error:",err.message);res.status(status).json({error:status>=500?"Servizio non disponibile: verificare configurazione e permessi Drive.":err.message});});
const port=Number(process.env.PORT||8080);app.listen(port,()=>console.log("Vibe Coding Portal API sulla porta "+port));