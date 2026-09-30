# API de suporte da Zenkai

Recebe `POST /api/support` com o JSON abaixo e registra a mensagem no Supabase:

```json
{
  "categoria": "sugestao",
  "mensagem": "Gostaria de sugerir uma nova funcionalidade."
}
```

## Configuração local

1. Copie `.env.example` para `.env` e preencha os valores.
2. Rode `npm install` e `npm start`.
3. Verifique `http://localhost:3000/api/status`.

## Variáveis da Vercel

Cadastre todas no projeto da API, para **Production**, **Preview** e **Development**:

| Variável | Valor |
| --- | --- |
| `SUPABASE_URL` | URL do seu projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | chave `service_role` secreta do Supabase |
| `SUPPORT_TABLE_NAME` | `support-messagens` (ou o nome exato da sua tabela) |
| `SUPPORT_CATEGORY_COLUMN` | `categoria` |
| `SUPPORT_MESSAGE_COLUMN` | `mensagem` |
| `SUPPORT_CREATED_AT_COLUMN` | `created_at` — deixe vazio se a coluna não existir |
| `ALLOWED_ORIGINS` | domínio(s) do frontend, separados por vírgula |

Se a tabela usa `category` e `message`, altere as duas variáveis de coluna; não é necessário mudar o código.

## Deploy pela CLI

No terminal, dentro desta pasta:

```powershell
npm install
npx vercel login
npx vercel
npx vercel env add SUPABASE_URL production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production
npx vercel env add SUPPORT_TABLE_NAME production
npx vercel env add SUPPORT_CATEGORY_COLUMN production
npx vercel env add SUPPORT_MESSAGE_COLUMN production
npx vercel env add SUPPORT_CREATED_AT_COLUMN production
npx vercel env add ALLOWED_ORIGINS production
npx vercel --prod
```

No primeiro `npx vercel`, crie um projeto novo e mantenha esta pasta como diretório raiz. O último comando responde com a URL final, por exemplo `https://zenkai-suporte.vercel.app`.

Depois, no projeto principal da Zenkai na Vercel, defina `SUPPORT_API_URL` com a URL final mais `/api/support`, por exemplo:

```text
https://zenkai-suporte.vercel.app/api/support
```

Faça um novo deploy do projeto principal para que o formulário passe a usar essa URL.

## Teste em produção

```powershell
Invoke-RestMethod -Method Post -Uri "https://SEU-PROJETO.vercel.app/api/support" -ContentType "application/json" -Body '{"categoria":"sugestao","mensagem":"Teste de envio da API de suporte."}'
```
