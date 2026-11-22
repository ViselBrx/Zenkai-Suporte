import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

function corsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = allowedOrigins.length === 0
    ? "*"
    : origin && allowedOrigins.includes(origin)
    ? origin
    : "";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string>,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (origin && allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
    return jsonResponse({ success: false, error: "Origem não autorizada pelo CORS." }, 403, headers);
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (request.method !== "POST") {
    return jsonResponse({ success: false, error: "Método não permitido." }, 405, headers);
  }

  let body: { categoria?: unknown; mensagem?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ success: false, error: "Corpo da requisição inválido." }, 400, headers);
  }

  const categoria = String(body?.categoria ?? "").trim().toLowerCase();
  const mensagem = String(body?.mensagem ?? "").trim();

  if (!categoria || !mensagem) {
    return jsonResponse({
      success: false,
      error: "Os campos 'categoria' e 'mensagem' são obrigatórios.",
    }, 400, headers);
  }

  if (mensagem.length < 5) {
    return jsonResponse({
      success: false,
      error: "A mensagem é muito curta. Explique melhor o seu feedback.",
    }, 400, headers);
  }

  if (mensagem.length > 1500) {
    return jsonResponse({
      success: false,
      error: "A mensagem deve ter no máximo 1500 caracteres.",
    }, 400, headers);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    console.error("SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas.");
    return jsonResponse({
      success: false,
      error: "Não foi possível salvar sua mensagem agora. Tente novamente mais tarde.",
    }, 500, headers);
  }

  const tableName = Deno.env.get("SUPPORT_TABLE_NAME") || "support-messagens";
  const categoryColumn = Deno.env.get("SUPPORT_CATEGORY_COLUMN") || "categoria";
  const messageColumn = Deno.env.get("SUPPORT_MESSAGE_COLUMN") || "mensagem";
  const createdAtColumn = Deno.env.get("SUPPORT_CREATED_AT_COLUMN") === undefined
    ? "created_at"
    : Deno.env.get("SUPPORT_CREATED_AT_COLUMN");

  const record: Record<string, string> = {
    [categoryColumn]: categoria,
    [messageColumn]: mensagem,
  };
  if (createdAtColumn) record[createdAtColumn] = new Date().toISOString();

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { error } = await supabase.from(tableName).insert(record);
    if (error) throw error;
  } catch (error) {
    console.error("Erro ao salvar mensagem no Supabase:", error);
    return jsonResponse({
      success: false,
      error: "Não foi possível salvar sua mensagem agora. Tente novamente mais tarde.",
    }, 500, headers);
  }

  return jsonResponse({
    success: true,
    message: "Sua mensagem foi enviada com sucesso para a equipe da Zenkai!",
  }, 200, headers);
});
