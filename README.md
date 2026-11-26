# Plataforma de Entregáveis TCC

Aplicação web full-stack para gestão de turmas, controle de acesso de estudantes e acompanhamento de entregas semanais de projetos (TCC).

> **Status:** MVP funcional em evolução ativa.

---

## Funcionalidades

### Painel do Professor
- Cadastro e autenticação via e-mail e senha.
- Criação e visualização de turmas com nome e sala/local.
- Cadastro de alunos com geração automática de login (`nome.id`) e senha temporária para primeiro acesso.
- Acompanhamento das entregas enviadas por cada aluno e download dos anexos.
- Redefinição de senha temporária e arquivamento/restauração de alunos (*soft delete*, preservando o histórico de entregas).

### Portal do Aluno
- Login simplificado com usuário gerado pelo professor.
- Fluxo obrigatório de redefinição de senha no primeiro acesso.
- Submissão de atividades com título, descrição e múltiplos anexos (`.pdf`, `.doc`, `.docx`, `.txt`, `.md`, `.jpg`, `.png`).
- Histórico cronológico das entregas realizadas.

---

## Stack e Arquitetura

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions e Middleware de proteção de rotas)
- **Interface:** React 19, TypeScript 5 e Tailwind CSS 4
- **Banco de Dados & ORM:** PostgreSQL com Drizzle ORM (`postgres.js` configurado com `prepare: false` para compatibilidade com PgBouncer)
- **Autenticação & Storage:** Supabase Auth (`@supabase/ssr`) e Supabase Storage (bucket `tcc-arquivos`)

### Estrutura Principal

```text
src/
├── app/
│   ├── actions/          # Server Actions (auth, turmas, alunos, atividades)
│   ├── cadastro/         # Cadastro de professores
│   ├── dashboard/        # Áreas protegidas (aluno, troca de senha e professores)
│   └── login/            # Fluxos de login separados por perfil
├── components/           # Componentes de interface e formulários interativos
├── db/
│   ├── index.ts          # Conexão PostgreSQL + instância do Drizzle
│   └── schemas/          # Schemas relacionais (professores, turmas, alunos, atividades)
└── lib/                  # Helpers de sessão e clientes Supabase
```

### Modelo de Dados

- `professores` (1:N) → `turmas` (1:N) → `alunos` (1:N) → `atividades`
- Os anexos de cada entrega são armazenados no Supabase Storage e referenciados como metadados (`nome` e `url`) em coluna `jsonb` na tabela `atividades`.

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js 20+
- Uma instância PostgreSQL e um projeto no [Supabase](https://supabase.com) com um bucket de Storage chamado **`tcc-arquivos`**

### Passo a passo

1. Clone o repositório e instale as dependências:
   ```bash
   git clone [https://github.com/vieirajjoao/Plataforma-Entregaveis-TCC.git](https://github.com/vieirajjoao/Plataforma-Entregaveis-TCC.git)
   cd Plataforma-Entregaveis-TCC
   npm ci
   ```

2. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   Preencha o `.env` com as credenciais do seu projeto Supabase e a URL do banco PostgreSQL.

3. Aplique o schema no banco de dados com o Drizzle Kit:
   ```bash
   npx drizzle-kit push
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   A aplicação ficará disponível em `http://localhost:3000`.

---

## Roadmap

- [ ] Feedback e status de revisão do professor em cada entrega
- [ ] Definição de prazos e entregas obrigatórias por turma
- [ ] Download de anexos via URLs assinadas (*signed URLs*) em bucket privado
- [ ] Testes automatizados das Server Actions e cobertura de CI