# iGNYX Lease

Plataforma SaaS da **Maff Franchising** para gestão da locação recorrente do
dispositivo **Khronner** via rede de franqueados.

## Stack

- **Next.js 15** (App Router, TypeScript strict, React 19)
- **Tailwind CSS** + **shadcn/ui** + Design System **Atmosphere+**
- **Drizzle ORM** + **Postgres** (via Supabase)
- **Supabase Auth** (email + senha) com RLS por tenant
- **Zod** para validação de inputs
- **Resend** para emails transacionais
- **Anthropic API** (Claude) para módulos IA-first
- Hospedagem: **Vercel**

## Arquitetura

Monolito Next.js organizado por **bounded contexts** de domínio dentro de
`src/services/`:

- `identity/` — usuários, perfis, sessões, RBAC
- `network/` — franqueados, representantes, técnicos
- `sales/` — funil, leads, propostas
- `contract/` — contratos de locação
- `operations/` — instalações, manutenção, logística
- `billing/` — boletos, recebíveis, comissionamento
- `sustainability/` — carbon (CO₂ evitado)
- `learning/` — academy (cursos, trilhas)

Multi-tenant ready: todas as tabelas sensíveis carregam `tenant_id` e são
protegidas por RLS. MVP roda com tenant único (`Maff`).

## Setup local

Requisitos: Node 20+, pnpm/npm, Postgres 15+ (ou projeto Supabase).

```bash
# 1. Instalar dependências
npm install

# 2. Copiar e preencher variáveis de ambiente
cp .env.example .env.local

# 3. Gerar e aplicar migrations
npm run db:generate
npm run db:migrate

# 4. Seed inicial (tenant Maff + superadmin)
npm run db:seed

# 5. Subir o dev server
npm run dev
```

App disponível em http://localhost:3000.

## Scripts

| Script              | Descrição                                |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Servidor Next.js em modo desenvolvimento |
| `npm run build`     | Build de produção                        |
| `npm run typecheck` | Verificação de tipos (tsc --noEmit)      |
| `npm run lint`      | ESLint                                   |
| `npm run format`    | Prettier --write                         |
| `npm run db:generate` | Gera SQL de migration a partir do schema |
| `npm run db:migrate`  | Aplica migrations no banco               |
| `npm run db:studio`   | Drizzle Studio (visual)                  |
| `npm run db:seed`     | Popula tenant Maff + superadmin          |

## Idioma / Localização

Brasil only no MVP: `pt-BR`, `BRL`, fuso `America/Sao_Paulo`.

## Licença

Proprietário — Maff Franchising.
