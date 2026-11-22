# API de suporte da Zenkai

Recebe `POST /functions/v1/support` e registra a mensagem no Supabase:

```json
{
  "categoria": "sugestao",
  "mensagem": "Gostaria de sugerir uma nova funcionalidade."
}
```

## Deploy no Supabase

Instale a [Supabase CLI](https://supabase.com/docs/guides/cli) e, no terminal dentro desta pasta, vincule o projeto:

```powershell
supabase login
supabase link --project-ref SEU_PROJECT_REF
```

As variáveis `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` são fornecidas pelo ambiente do Supabase. Configure as variáveis opcionais da tabela e os domínios permitidos:

```powershell
supabase secrets set SUPPORT_TABLE_NAME=support-messagens SUPPORT_CATEGORY_COLUMN=categoria SUPPORT_MESSAGE_COLUMN=mensagem SUPPORT_CREATED_AT_COLUMN=created_at ALLOWED_ORIGINS=https://SEU-SITE.com
```

Se a tabela usar `category` e `message`, altere `SUPPORT_CATEGORY_COLUMN` e `SUPPORT_MESSAGE_COLUMN`. Se ela preencher `created_at` automaticamente, configure `SUPPORT_CREATED_AT_COLUMN` como vazio. `ALLOWED_ORIGINS` aceita vários domínios separados por vírgula; sem essa variável, a função aceita qualquer origem.

Faça o deploy da função:

```powershell
supabase functions deploy support
```

O endpoint ficará em:

```text
https://SEU_PROJECT_REF.supabase.co/functions/v1/support
```

Configure o frontend para enviar o formulário diretamente a esse endereço.

## Teste

```powershell
Invoke-RestMethod -Method Post -Uri "https://SEU_PROJECT_REF.supabase.co/functions/v1/support" -ContentType "application/json" -Body '{"categoria":"sugestao","mensagem":"Teste de envio da API de suporte."}'
```
