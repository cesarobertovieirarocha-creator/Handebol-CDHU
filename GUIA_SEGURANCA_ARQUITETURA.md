# 🛡️ Guia Oficial de Arquitetura, Segurança e Boas Práticas — ADESP/CDHU

Este documento reúne todas as diretrizes, políticas de proteção de dados, regras de banco de dados (Supabase/Firebase) e checklist de segurança para a plataforma oficial do **ADESP/CDHU Uberlândia**.

---

## 1. 🔑 Gerenciamento de Credenciais e Chaves de API
* **Regra de Ouro:** NUNCA faça commit de senhas, tokens ou chaves secretas no Git.
* **Arquivo `.env` Protegido:** O arquivo `.env` já está explicitamente bloqueado no [.gitignore](.gitignore).
* **Separação de Chaves (Front-end vs. Back-end):**
  * `anon_key` (Pública): Pode ser exposta no navegador, mas com **Row Level Security (RLS)** ativo no banco.
  * `service_role_key` (Privada/Master): NUNCA pode chegar ao front-end. Utilizada apenas em Cloud Functions ou servidor seguro.

---

## 2. 🗄️ Banco Travado & Row Level Security (RLS) — Supabase / PostgreSQL

> *"Não confia no ID da tela. Cada um só vê o seu."*

No Supabase/PostgreSQL, o banco de dados deve ter **RLS habilitado em todas as tabelas**. Nunca confie apenas no `user_id` enviado pelo JavaScript do navegador; valide sempre pelo token JWT da sessão (`auth.uid()`).

### Exemplo de Políticas RLS para Atletas e Administradores:

```sql
-- 1. Habilitar RLS na tabela de inscrições/atletas
ALTER TABLE atletas ENABLE ROW LEVEL SECURITY;

-- 2. Cada atleta só pode visualizar e editar seu próprio perfil
CREATE POLICY "Atleta visualiza apenas seu perfil"
ON atletas FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Atleta edita apenas seus proprios dados"
ON atletas FOR UPDATE
USING (auth.uid() = user_id);

-- 3. Inserção pública permitida (com validação)
CREATE POLICY "Permitir inscricao publica"
ON atletas FOR INSERT
WITH CHECK (true);

-- 4. Administradores da ADESP (comissão técnica) têm acesso total
CREATE POLICY "Admin tem acesso irrestrito"
ON atletas FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM usuarios_admin
    WHERE usuarios_admin.user_id = auth.uid()
    AND usuarios_admin.role = 'comissao_tecnica'
  )
);
```

---

## 3. 📦 Regras de Armazenamento Seguro (Storage: Firebase / Supabase)

Para upload de comprovantes, fichas médicas e fotos:
* **Validação de MIME Type:** Permitir estritamente `image/jpeg`, `image/png`, `image/webp` e `application/pdf`.
* **Limite de Tamanho:** Máximo de 5MB por arquivo.
* **Isolamento de Pastas:** Cada atleta só pode fazer upload em `storage/atletas/{auth.uid()}/*`.

```javascript
// Exemplo de Security Rules no Firebase Storage:
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /atletas/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId
                         && request.resource.size < 5 * 1024 * 1024
                         && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 4. 🌐 Headers de Segurança e Política de CORS
As configurações estão sincronizadas em [_headers](_headers) (para Netlify/Cloudflare Pages) e [vercel.json](vercel.json) (para Vercel):
* **Content-Security-Policy (CSP):** Restringe origens de scripts, fontes e conexões estritamente a domínios autorizados (Google Fonts, jsDelivr, Cloudflare CDN, Google Analytics).
* **X-Frame-Options: SAMEORIGIN:** Impede ataques de *Clickjacking* (proíbe carregar o site dentro de iframes maliciosos).
* **X-Content-Type-Options: nosniff:** Previne *MIME-sniffing*.
* **Strict-Transport-Security (HSTS):** Força o tráfego 100% criptografado em HTTPS.
* **CORS (Cross-Origin Resource Sharing):** No backend, restrinja `Access-Control-Allow-Origin` apenas para `https://adespcdhu.com`.

---

## 5. 🛡️ Prevenção Contra Injeção de SQL e XSS
1. **Sanitização de Dados:** Nunca concatenar strings de entrada diretamente em queries SQL. Sempre utilize **Prepared Statements** ou ORMs como Prisma/Supabase Client.
2. **Escape de HTML no Frontend:** Sempre usar sanitização (ex.: `escapeHtml` em `auth-guard.js`) ou `element.textContent` ao invés de `element.innerHTML` ao exibir dados dinâmicos enviados por usuários, prevenindo ataques de Cross-Site Scripting (XSS).

---

## 6. 🛑 Rate Limiting e Proteção Contra Ataques de Força Bruta
* **Limite de Tentativas de Login:** Bloquear temporariamente após 5 tentativas incorretas em 15 minutos.
* **Formulário com Anti-Spam (Honeypot):** Campo oculto para robôs ou validação Cloudflare Turnstile / reCAPTCHA v3.
* **Debug Desligado:** Em produção, manter flags de debug desativadas e responder apenas com mensagens de erro genéricas, sem expor stack traces ou detalhes do banco.

---

## 7. 🔐 Arquitetura de Acesso CDHU 3.0: Front-end Simulado (Fase 1) vs. Back-end Real (Fase 2)

> **Transparência de Engenharia:** Na **Fase 1**, a plataforma opera estritamente no Front-end (HTML/CSS/JS). A camada de autenticação atual e a separação de abas (RBAC) são **comportamentais no navegador** para viabilizar testes de usabilidade pela comissão técnica e aprovação de fluxos.

1. **Portão de Entrada Unificado (`dev-auth.html`):**
   - **Aba "Entrar":** Valida credenciais nominais e perfil (RBAC) com verificação estrita de senha.
   - **Aba "Solicitar Acesso":** O cadastro é fechado. Interessados enviam solicitação que é persistida localmente (`storage.js`).
2. **Guarda de Rotas em Tempo de Execução (`js/auth-guard.js`):**
   - Executa no topo do `<head>` antes da renderização de `performance.html` e `tatica.html`.
   - Limpa todas as chaves de sessão (`cdhu_auth_session` e `adesp_auth_session`) em caso de logout ou expiração.
   - Sanitiza dados de exibição do usuário contra XSS.
3. **Migração Obrigatória para Fase 2 (Proteção Real de Dados e LGPD):**
   - **Banco Travado com RLS:** Migrar `data/players.js` e `data/mock-medical.js` para tabelas PostgreSQL com Row Level Security.
   - **Proteção dos Dados de Saúde:** Prontuários e fichas clínicas individuais nunca serão distribuídos em bundles estáticos de JavaScript para o navegador do público.
   - **Tokens JWT Assinados:** Autenticação via Supabase Auth com refresh tokens seguros em cookies HttpOnly.

---

## 8. 🧪 Checklist "Testar como um Estranho" (Auditoria Rápida)
- [x] O arquivo `.env` está fora do repositório Git? **Sim, no .gitignore**.
- [x] Existem credenciais ou senhas gravadas no código? **Não**.
- [x] Área Dev protegida por guarda de rotas (`auth-guard.js`) e gateway (`dev-auth.html`)? **Sim**.
- [x] Versão de bibliotecas externas fixadas (ex.: Chart.js 4.4.1)? **Sim**.
- [x] Todas as páginas possuem Favicon e títulos otimizados para SEO? **Sim**.
- [x] Existe página 404 personalizada temática do handebol? **Sim, 404.html**.
- [x] As páginas de Política de Privacidade e Termos de Uso estão ativas? **Sim**.
- [x] O banner de cookies (LGPD) grava o consentimento no navegador? **Sim**.
- [x] O formulário valida formato de e-mail e telefone antes de enviar? **Sim**.
- [x] As rotas de compartilhamento social (Open Graph) estão com imagem oficial? **Sim**.

