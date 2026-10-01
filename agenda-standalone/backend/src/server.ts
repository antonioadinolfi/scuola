import Fastify from "fastify";
import cors from "@fastify/cors";
import { Pool } from "pg";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { z } from "zod";

const env = {
  port: Number(process.env.PORT ?? 8787),
  databaseUrl: process.env.DATABASE_URL ?? "",
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:4173"
};
if (!env.databaseUrl) throw new Error("DATABASE_URL is required");
if (!env.googleClientId) throw new Error("GOOGLE_CLIENT_ID is required");

const pool = new Pool({ connectionString: env.databaseUrl });
const googleKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
const app = Fastify({ logger: true });
await app.register(cors, { origin: env.corsOrigin, credentials: true });

const eventInput = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  timezone: z.string().default("Europe/Rome"),
  title: z.string().min(1).max(300),
  description: z.string().max(10000).optional().default(""),
  category: z.string().max(80).optional().default("Generale"),
  priority: z.enum(["bassa","media","alta"]).optional().default("media"),
  status: z.enum(["aperto","completato","annullato"]).optional().default("aperto"),
  reminder_minutes: z.number().int().min(0).max(10080).nullable().optional()
});
type User = { id:string; google_sub:string; email:string; name:string|null };

async function auth(req:any, reply:any): Promise<User|void> {
  const h=req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return reply.code(401).send({error:"missing_bearer_token"});
  try {
    const {payload}=await jwtVerify(h.slice(7),googleKeys,{issuer:["https://accounts.google.com","accounts.google.com"],audience:env.googleClientId});
    if(!payload.sub || typeof payload.email!=="string") throw new Error("invalid_identity");
    const r=await pool.query<User>(
      "INSERT INTO users (google_sub,email,name) VALUES ($1,$2,$3) ON CONFLICT (google_sub) DO UPDATE SET email=EXCLUDED.email,name=EXCLUDED.name RETURNING id,google_sub,email,name",
      [payload.sub,payload.email,typeof payload.name==="string"?payload.name:null]
    );
    return r.rows[0];
  } catch { return reply.code(401).send({error:"invalid_google_token"}); }
}

app.get("/health",async()=>({ok:true,service:"agenda-adinolfi-api"}));
app.get("/me",async(req,reply)=>{const u=await auth(req,reply);if(!u)return;return u;});
app.get("/today",async(req,reply)=>{const u=await auth(req,reply);if(!u)return;const r=await pool.query("SELECT * FROM events WHERE user_id=$1 AND event_date=CURRENT_DATE ORDER BY event_time NULLS LAST",[u.id]);return r.rows;});
app.get("/week",async(req,reply)=>{const u=await auth(req,reply);if(!u)return;const r=await pool.query("SELECT * FROM events WHERE user_id=$1 AND event_date BETWEEN CURRENT_DATE AND CURRENT_DATE+6 ORDER BY event_date,event_time NULLS LAST",[u.id]);return r.rows;});
app.get("/search",async(req:any,reply)=>{const u=await auth(req,reply);if(!u)return;const q=String(req.query?.q??"").trim();if(!q)return reply.code(400).send({error:"missing_q"});const r=await pool.query("SELECT * FROM events WHERE user_id=$1 AND (title ILIKE $2 OR description ILIKE $2 OR category ILIKE $2) ORDER BY event_date DESC,event_time DESC LIMIT 100",[u.id,"%"+q+"%"]);return r.rows;});
app.get("/events/:id",async(req:any,reply)=>{const u=await auth(req,reply);if(!u)return;const r=await pool.query("SELECT * FROM events WHERE id=$1 AND user_id=$2",[req.params.id,u.id]);if(!r.rowCount)return reply.code(404).send({error:"not_found"});return r.rows[0];});
app.post("/events",async(req,reply)=>{const u=await auth(req,reply);if(!u)return;const d=eventInput.parse(req.body);const r=await pool.query("INSERT INTO events(user_id,event_date,event_time,timezone,title,description,category,priority,status,reminder_minutes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *",[u.id,d.date,d.time??null,d.timezone,d.title,d.description,d.category,d.priority,d.status,d.reminder_minutes??null]);return reply.code(201).send(r.rows[0]);});
app.patch("/events/:id",async(req:any,reply)=>{const u=await auth(req,reply);if(!u)return;const d=eventInput.partial().parse(req.body);const keys=Object.keys(d);if(!keys.length)return reply.code(400).send({error:"empty_update"});const map:Record<string,string>={date:"event_date",time:"event_time",timezone:"timezone",title:"title",description:"description",category:"category",priority:"priority",status:"status",reminder_minutes:"reminder_minutes"};const sets=keys.map((k,i)=>map[k]+"=$"+(i+1));const vals=keys.map(k=>(d as any)[k]);vals.push(req.params.id,u.id);const r=await pool.query("UPDATE events SET "+sets.join(",")+",updated_at=now() WHERE id=$"+(vals.length-1)+" AND user_id=$"+vals.length+" RETURNING *",vals);if(!r.rowCount)return reply.code(404).send({error:"not_found"});return r.rows[0];});
app.delete("/events/:id",async(req:any,reply)=>{const u=await auth(req,reply);if(!u)return;const r=await pool.query("DELETE FROM events WHERE id=$1 AND user_id=$2 RETURNING id",[req.params.id,u.id]);if(!r.rowCount)return reply.code(404).send({error:"not_found"});return {deleted:true,id:req.params.id};});
app.setErrorHandler((err:any,_req,reply)=>{if(err instanceof z.ZodError)return reply.code(400).send({error:"validation_error",details:err.issues});app.log.error(err);return reply.code(500).send({error:"internal_error"});});

await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;"+
"CREATE TABLE IF NOT EXISTS users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),google_sub text UNIQUE NOT NULL,email text NOT NULL,name text,created_at timestamptz NOT NULL DEFAULT now());"+
"CREATE TABLE IF NOT EXISTS events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,event_date date NOT NULL,event_time time,timezone text NOT NULL DEFAULT 'Europe/Rome',title text NOT NULL,description text NOT NULL DEFAULT '',category text NOT NULL DEFAULT 'Generale',priority text NOT NULL DEFAULT 'media' CHECK(priority IN ('bassa','media','alta')),status text NOT NULL DEFAULT 'aperto' CHECK(status IN ('aperto','completato','annullato')),reminder_minutes integer,created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now());"+
"CREATE INDEX IF NOT EXISTS idx_events_user_date ON events(user_id,event_date,event_time);");
await app.listen({port:env.port,host:"0.0.0.0"});
