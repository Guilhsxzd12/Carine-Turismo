# Painel administrativo preservado

Nao apagar nem substituir estes componentes durante a reconstrucao do site publico:

- `admin/index.html` — tela de login
- `admin/painel.html` — painel administrativo
- `admin/admin-login.js`
- `admin/admin.js`
- `admin/admin.css`
- `api/_utils.js`
- `api/catalog.js`
- `api/site-admin.js`
- `api/site-data.js`
- `api/login.js` / rotas de autenticacao existentes
- `supabase.sql`
- configuracoes e dados do Supabase
- variaveis de ambiente do Vercel ja existentes para ADMIN e SUPABASE

Fluxo que deve ser mantido:

1. `/admin/` mostra apenas o login.
2. Login valido redireciona para `/admin/painel.html`.
3. Acesso direto ao painel sem sessao deve voltar para `/admin/`.
4. Logout encerra a sessao e retorna para `/admin/`.
5. O painel continua gerenciando conteudos, categorias e banners via APIs/Supabase.

Importante: este arquivo nao contem senhas, chaves ou segredos. As credenciais continuam nas variaveis de ambiente do Vercel.
