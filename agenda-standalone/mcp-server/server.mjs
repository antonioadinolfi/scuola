import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import * as z from "zod";

const AGENDA_API_URL = process.env.AGENDA_API_URL;
const AGENDA_BEARER_TOKEN = process.env.AGENDA_BEARER_TOKEN;

function authorized(requestInfo) {
  const header = requestInfo?.request?.headers?.get("authorization") || "";
  return Boolean(AGENDA_BEARER_TOKEN && header === "Bearer " + AGENDA_BEARER_TOKEN);
}

async function callApi(path, options = {}) {
  if (!AGENDA_API_URL || !AGENDA_BEARER_TOKEN) throw new Error("Agenda API non configurata.");
  const response = await fetch(new URL(path, AGENDA_API_URL), {
    ...options,
    headers: {
      "content-type": "application/json",
      "authorization": "Bearer " + AGENDA_BEARER_TOKEN,
      ...(options.headers || {})
    }
  });
  if (!response.ok) throw new Error("Agenda API HTTP " + response.status);
  return response.json();
}

const handler = createMcpHandler(({ requestInfo }) => {
  const server = new McpServer({ name: "agenda-adinolfi", version: "0.1.0" });

  server.registerTool("agenda_today", {
    description: "Legge gli impegni di oggi.",
    inputSchema: z.object({})
  }, async () => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/today")) }] };
  });

  server.registerTool("agenda_week", {
    description: "Legge gli impegni della settimana corrente.",
    inputSchema: z.object({})
  }, async () => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/week")) }] };
  });

  server.registerTool("agenda_search", {
    description: "Cerca eventi nell'agenda.",
    inputSchema: z.object({ query: z.string().min(1) })
  }, async ({ query }) => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/search?q=" + encodeURIComponent(query))) }] };
  });

  server.registerTool("agenda_create", {
    description: "Crea un evento nell'agenda.",
    inputSchema: z.object({
      date: z.string(),
      time: z.string().optional(),
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.string().optional(),
      priority: z.string().optional(),
      reminder: z.string().optional()
    })
  }, async event => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/events", {method:"POST",body:JSON.stringify(event)})) }] };
  });

  server.registerTool("agenda_update", {
    description: "Modifica un evento.",
    inputSchema: z.object({ id: z.string(), patch: z.record(z.string(), z.any()) })
  }, async ({ id, patch }) => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/events/" + encodeURIComponent(id), {method:"PATCH",body:JSON.stringify(patch)})) }] };
  });

  server.registerTool("agenda_delete", {
    description: "Elimina un evento.",
    inputSchema: z.object({ id: z.string() })
  }, async ({ id }) => {
    if (!authorized(requestInfo)) throw new Error("Non autorizzato.");
    return { content: [{ type: "text", text: JSON.stringify(await callApi("/events/" + encodeURIComponent(id), {method:"DELETE"})) }] };
  });

  return server;
});

export default { fetch: handler.fetch };