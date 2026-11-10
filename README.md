# 🏆 ADESP / CDHU 3.0 — Plataforma Digital Esportiva & Performance

> Sistema de gestão técnica, scout avançado, prancheta tática interativa e portal institucional da **Associação Desportiva do Handebol de Uberlândia (ADESP/CDHU)**.

---

## 🎯 Visão Geral do Projeto (Fase 1 — Front-end)

O projeto **CDHU 3.0** transforma o portal institucional em uma plataforma esportiva completa, modular e responsiva para a comissão técnica, departamento médico e atletas.

Nesta etapa (**Fase 1**), todo o desenvolvimento é estritamente **Front-end (HTML5, CSS3, JavaScript Vanilla)** com dados locais estruturados e simulações controladas (zero dependência de backend nesta fase).

---

## 📁 Estrutura de Arquivos e Módulos

```text
CDHU/
├── index.html                  # Portal público institucional
├── dev-auth.html               # Gateway de login & solicitação de acesso à Área Dev
├── performance.html            # Central ADESP Performance & Monitoramento
├── tatica.html                 # Prancheta Tática Digital (Canvas 40x20m)
│
├── css/
│   ├── style.css               # Folha de estilos base
│   ├── components.css          # Design System compartilhado (cards, pills, botões, alertas)
│   ├── dev-auth.css            # Estilos da área de autenticação (Editorial Luxury)
│   ├── performance.css         # Central Performance & Scout (desacoplado)
│   ├── tatica.css              # Prancheta Tática Digital (desacoplado)
│   ├── base.css                # Variáveis CSS e reset
│   ├── navbar.css              # Barra de navegação
│   ├── hero.css                # Seção de destaque principal
│   ├── equipe.css              # Seção de elenco
│   ├── jogos.css               # Calendário e resultados
│   ├── modern-effects.css      # Tilt 3D, cursor e efeitos visuais
│   └── responsive.css          # Breakpoints e ajustes mobile
│
├── js/
│   ├── app.js                  # Ponto de entrada e orquestrador institucional
│   ├── modern-effects.js       # Efeitos de scroll, tilt 3D e validação do formulário
│   ├── dev-auth.js             # Lógica de autenticação e solicitação de convites
│   ├── auth-guard.js           # Guarda de rotas no <head> de performance e tatica
│   ├── config.js               # Constantes e configurações da aplicação
│   │
│   ├── modules/                # Módulos de regras de negócio (migração progressiva)
│   │   ├── navigation.js       # Controle de rotas e abas
│   │   ├── dashboard.js        # Indicadores gerais da equipe
│   │   ├── players.js          # Scout individual e perfil do atleta
│   │   ├── matches.js          # Match Center, sumula digital e momentum
│   │   ├── goalkeepers.js      # Análise de goleiros e mapa 3x3 de defesas
│   │   ├── medical.js          # Prontuário fictício, PSE Borg e fadiga (LGPD)
│   │   ├── comparison.js       # Comparativo posição a posição entre atletas
│   │   └── tactical-board.js   # Motor gráfico e sequências da prancheta
│   │
│   └── utils/                  # Utilitários compartilhados
│       ├── formatters.js       # Formatação de percentuais, xG, datas e badges
│       ├── charts.js           # Utilitários do Chart.js
│       └── storage.js          # Abstração de localStorage com expiração e prefixo
│
├── data/                       # Bases de dados locais estruturadas (Mock)
│   ├── players.js              # Estatísticas, biometria e scouts de 20 atletas
│   ├── matches.js              # Sumulas, eventos minuto a minuto e momentum
│   ├── mock-users.js           # Perfis e papéis (Admin, Técnica, Médica)
│   └── mock-medical.js         # Escala de Borg, fadiga e histórico simulado
│
├── Imagens/                    # Escudos, fotos do elenco e patrocinadores
├── 404.html                    # Página 404 temática de handebol
├── obrigado.html               # Página de agradecimento de inscrição
├── privacidade.html            # Política de Privacidade (Conformidade LGPD)
├── termos.html                 # Termos de Uso da Plataforma
├── sitemap.xml                 # Mapa do site para indexação pública
├── robots.txt                  # Diretivas de rastreamento (bloqueando Área Dev)
├── vercel.json                 # Cabeçalhos de segurança (HSTS, CSP, X-Frame)
└── GUIA_SEGURANCA_ARQUITETURA.md # Guia técnico oficial
```

---

## 👥 Perfis Simulados (RBAC)

Acesso via `dev-auth.html` com suporte imediato às contas de demonstração:

| Perfil | E-mail | Senha Padrão | Escopo de Acesso |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@adesp.com` | `adesp2026` | Acesso irrestrito a todos os módulos e solicitações |
| **Comissão Técnica** | `tecnico@adesp.com` | `adesp2026` | Performance, Scout, Match Center e Prancheta Tática (Dados médicos bloqueados conforme LGPD) |
| **Departamento Médico** | `medico@adesp.com` | `adesp2026` | Prontuários simulados, PSE de Borg, fadiga e recuperação física |

---

## 🎨 Design System — Paleta Oficial

* **Azul Institucional:** `#0A509E`
* **Verde Esportivo:** `#1F8A4D`
* **Dourado Troféu:** `#F4C542`
* **Grafite Dark:** `#071322` / `#0d213a`
* **Creme Nobre:** `#F6F3EB`
* **Tipografia:** `Poppins` (interface e dados) + `Fraunces` / `Playfair Display` (editorial nobre) + `Oswald` (títulos esportivos).

---

## 🚦 Status de Desenvolvimento — 3 Estados

* `[Concluído]`: Implementado, integrado e validado.
* `[Em desenvolvimento]`: Implementado parcialmente ou em fase de modularização.
* `[Pendente]`: Planejado para os próximos pacotes da Fase 1.


---

## 📚 Playbook de Seleções (novo)

* `data/plays.js` — base de jogadas: 13 equipes × (Masculino/Feminino) × categorias **Principal, Sub20 e Sub18** → 280 jogadas, geradas a partir de 12 modelos com coordenadas na quadra 40×20 m.
* `js/modules/playbook.js` — filtros (gênero, categoria, equipe, situação, busca, favoritas), detalhe (objetivo, variações, contra-medidas, confiança, fonte), carregamento na quadra como **quadros animáveis** e import/export em JSON.
* Aba **Playbook** em `tatica.html` (botão "Carregar na quadra" → use ← → ou Play).
* Níveis de confiança: `validada` (vídeo + link), `tendencia` (seleção principal), `hipotese` (base/feminino, a validar) e `modelo` (didática).
* Fatos verificados em 2026: EHF EURO masculino (Dinamarca 34–27 Alemanha) e M20 EHF EURO (Hungria campeã, Suécia vice). A geometria das jogadas é didática: valide em vídeo antes de usar em treino.
* Para adicionar uma jogada: crie um modelo em `TEMPLATES` e inclua o id em `pref` da equipe.
