# Carine Turismo

Site catálogo responsivo para Vercel, com painel administrativo protegido em `/admin/`.

## Publicar o painel no Vercel

1. Crie um projeto gratuito no Supabase e execute o arquivo `supabase.sql` no SQL Editor.
2. No Vercel, abra **Project > Settings > Environment Variables** e crie:
   - `CARINE_ADMIN_USER` = usuário do painel (definido pela proprietária)
   - `CARINE_ADMIN_PASSWORD` = senha do painel (definida pela proprietária)
   - `ADMIN_SESSION_SECRET` = uma sequência longa e aleatória (32+ caracteres)
   - `SUPABASE_URL` = Project URL do Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` = chave `service_role` do Supabase (NUNCA colocar em HTML/JS público)
3. Faça um novo deploy.
4. Acesse `https://SEU-DOMINIO/admin/`.

## Como funciona

- O catálogo público tenta carregar os dados de `/api/catalog`.
- Se o Supabase ainda não estiver configurado ou estiver vazio, o site usa `data/catalogo.js` como fallback, então o site não quebra.
- O painel permite criar, editar e excluir Passeios, Ingressos, Hotéis e Eventos.
- O login é validado no servidor e cria cookie HttpOnly por 12 horas; a senha não fica exposta no código do navegador.

## Primeiro uso

O banco começa vazio. Você pode manter o catálogo atual como fallback e cadastrar novos itens pelo painel. Se quiser migrar todos os itens atuais para o banco, cadastre-os pelo painel; depois eles passam a ser a fonte principal do site.

## Fotos

O painel aceita URL de imagem. Para produção, prefira imagens próprias/licenciadas hospedadas em um serviço estável (por exemplo, Supabase Storage) em vez de hotlinks de terceiros.


## Correção de implantação
- O painel `/admin/` agora leva CSS e JS embutidos para evitar falhas de caminho no Vercel.
- O login aceita `CARINE_ADMIN_USER`/`CARINE_ADMIN_PASSWORD` ou `ADMIN_USER`/`ADMIN_PASSWORD`.
- Antes de usar o painel, execute `supabase.sql` no SQL Editor do Supabase.
