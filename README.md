# Schedule Client

Interface web do Schedule — uma aplicação para organização de ministérios de louvor em igrejas. Permite o gerenciamento de escalas, repertório musical, membros e funções de forma prática e centralizada.

Este repositório contém o frontend da aplicação. O backend está disponível em [schedule-api](https://github.com/ghenriqf/schedule-api).

---

## Sobre o projeto

O Schedule é um projeto pessoal desenvolvido para fins de estudo. A aplicação permite que administradores de ministérios criem e gerenciem escalas de eventos, associem membros e músicas, controlem o repertório e organizem as funções de cada participante.

### Funcionalidades

- Autenticação e autorização de usuários via JWT
- Gestão completa de ministérios (criar, listar, detalhar)
- Entrada em ministérios por código de convite
- Gerenciamento de membros e funções por ministério
- Administração de repertório musical
- Criação e edição de escalas com associação de membros e músicas

---

## Stack

| Categoria | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilização | Tailwind CSS v4 |
| Requisições HTTP | Axios |
| Estado do servidor | TanStack Query v5 |
| Roteamento | React Router v6 |
| Notificações | React Toastify |
| Utilitários de data | date-fns |

---

## Arquitetura

O projeto segue os princípios do **Feature-Sliced Design (FSD)**, organizando o código em camadas com dependências unidirecionais. Camadas superiores podem importar de camadas inferiores, nunca o contrário.

```
src/
├── pages/                # Composição de features por rota
│   └── NomeDaPage/
│       ├── index.tsx     # Componente da page
│       ├── hooks/        # Lógica isolada em hooks
│       └── components/   # Componentes locais da page
├── features/             # Casos de uso completos
│   └── nome-feature/
│       ├── api/          # Chamadas HTTP
│       ├── model/        # Tipos e constantes
│       ├── ui/           # Componentes da feature
│       └── index.ts      # Barrel export
├── entities/             # Modelos de domínio compartilhados
│   └── nome-entidade/
│       └── model/
│           └── types.ts
└── shared/               # Código agnóstico de negócio
    ├── api/              # Instância do Axios e interceptors
    ├── ui/               # Componentes genéricos reutilizáveis
    ├── lib/              # Hooks e utilitários genéricos
    └── types/            # Tipos utilitários globais
```

### Regra de dependência

```
pages → features → entities → shared
```

Features não importam de outras features. Toda comunicação entre features ocorre através da page que as compõe.

### Features disponíveis

| Feature | Responsabilidade |
|---|---|
| `auth` | Autenticação, token e tipos de usuário |
| `ministry` | Ministérios, membros e funções |
| `scale` | Escalas e associação de membros e músicas |
| `repertoire` | Repertório musical do ministério |

---

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Backend da aplicação em execução — veja [schedule-api](https://github.com/ghenriqf/schedule-api)

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/ghenriqf/schedule-client.git
cd schedule-client
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_API_URL` | URL base da API backend | `http://localhost:8080/api/v1` |

---

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run preview` | Visualiza o build de produção localmente |
| `npm run lint` | Executa o ESLint |

---

## Endpoints consumidos

A tabela abaixo lista os principais endpoints da API utilizados pelo frontend. A documentação completa está disponível no repositório do backend.

### Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/signup` | Cadastro de novo usuário |
| POST | `/auth/login` | Autenticação de usuário |

### Ministérios

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/ministries` | Cria um novo ministério |
| GET | `/ministries` | Lista ministérios do usuário |
| GET | `/ministries/{id}` | Detalhes de um ministério |
| POST | `/ministries/{id}/invite-code` | Gera código de convite |
| POST | `/ministries/join/{inviteCode}` | Entra em ministério via código |
| GET | `/ministries/{id}/members` | Lista membros do ministério |

### Músicas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/ministries/{id}/musics` | Cadastra música no repertório |
| GET | `/ministries/{id}/musics` | Lista músicas do ministério |
| PUT | `/ministries/{id}/musics/{musicId}` | Atualiza dados da música |
| DELETE | `/ministries/{id}/musics/{musicId}` | Remove música do repertório |

### Escalas

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/ministries/{id}/scales` | Cria uma nova escala |
| GET | `/ministries/{id}/scales` | Lista escalas do ministério |
| GET | `/ministries/{id}/scales/{scaleId}` | Detalhes de uma escala |
| PATCH | `/ministries/{id}/scales/{scaleId}` | Atualiza dados da escala |
| POST | `/scales/{id}/members/{memberId}` | Adiciona membro à escala |
| DELETE | `/scales/{id}/members/{memberId}` | Remove membro da escala |
| POST | `/scales/{id}/musics/{musicId}` | Adiciona música à escala |
| DELETE | `/scales/{id}/musics/{musicId}` | Remove música da escala |

---

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feat/nome-da-feature`
3. Faça commit das alterações seguindo o padrão [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m "feat: descrição da feature"`
4. Envie para a branch: `git push origin feat/nome-da-feature`
5. Abra um Pull Request
