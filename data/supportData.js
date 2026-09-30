const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use a Service Role Key apenas nesta API. Ela nunca deve ser exposta no frontend.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const tableName = process.env.SUPPORT_TABLE_NAME || 'support-messagens';
const categoryColumn = process.env.SUPPORT_CATEGORY_COLUMN || 'categoria';
const messageColumn = process.env.SUPPORT_MESSAGE_COLUMN || 'mensagem';
const createdAtColumn = Object.prototype.hasOwnProperty.call(process.env, 'SUPPORT_CREATED_AT_COLUMN')
  ? process.env.SUPPORT_CREATED_AT_COLUMN
  : 'created_at';

let supabase;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar configuradas.');
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });
  }

  return supabase;
}

async function saveSupportMessage(category, message) {
  const record = {
    [categoryColumn]: category,
    [messageColumn]: message
  };

  // Deixe a variável vazia se a tabela já tiver DEFAULT para created_at.
  if (createdAtColumn) record[createdAtColumn] = new Date().toISOString();

  const { error } = await getSupabaseClient()
    .from(tableName)
    .insert(record);

  if (error) {
    console.error('Erro ao salvar mensagem no Supabase:', error);
    throw error;
  }
}

module.exports = { saveSupportMessage };
