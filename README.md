# 🎓 SGD - Sistema de Gestão de Defesas

![Capa do Projeto](public/logo_sgd.webp) O **SGD** é uma plataforma completa desenvolvida para facilitar a gestão acadêmica e administrativa. O sistema permite o controle de alunos, professores, secretários, agendamentos de defesas, emissão de documentos e solicitações, centralizando tudo em um painel administrativo intuitivo e de alta performance.

## 🚀 Funcionalidades Principais

* **Autenticação e Autorização:** Sistema de login seguro com controle de acesso para diferentes níveis de usuários (Administradores, Professores, Alunos e Secretários).
* **Painel Administrativo (Dashboard):** Visualização rápida de métricas e status de solicitações através de gráficos interativos.
* **Gestão de Usuários:** Módulos dedicados para o cadastro e gerenciamento de Alunos, Professores e Secretários.
* **Agendamentos e Defesas:** Controle de datas, horários e formação de bancas avaliadoras para defesas de TCC/Projetos.
* **Gestão de Documentos:** Geração, tramitação e armazenamento de documentos acadêmicos e solicitações.
* **Configurações e Perfil:** Customização de preferências do sistema e edição de histórico de atividades.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as melhores práticas do ecossistema moderno de desenvolvimento web:

* **[Next.js](https://nextjs.org/) (App Router):** Framework React para renderização híbrida (SSR/SSG) e roteamento avançado.
* **[React](https://reactjs.org/):** Biblioteca para construção de interfaces de usuário componentizadas.
* **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática para garantir maior segurança e escalabilidade do código.
* **[Tailwind CSS](https://tailwindcss.com/):** Framework de utilitários CSS para estilização rápida e responsiva.
* **[Supabase](https://supabase.com/):** Backend-as-a-Service (BaaS) utilizado para banco de dados PostgreSQL e autenticação.

## 📁 Estrutura do Projeto

A arquitetura do projeto foi pensada para manter o código limpo, escalável e de fácil manutenção:

```bash
📦 sgd-react
 ┣ 📂 app
 ┃ ┣ 📂 (admin)       # Rotas protegidas do painel (dashboard, alunos, professores, etc.)
 ┃ ┣ 📂 (auth)        # Rotas de autenticação (login, cadastro)
 ┃ ┣ 📂 assets        # Animações e arquivos estáticos (ex: erro-404.json)
 ┃ ┣ 📂 components    # Componentes modulares (UI, formulários, modais, gráficos)
 ┃ ┣ 📂 services      # Regras de negócio e comunicação com o backend (Supabase)
 ┃ ┗ 📂 type          # Definições de interfaces e tipos TypeScript
 ┣ 📂 lib
 ┃ ┗ 📂 supabase      # Configuração do cliente Supabase
 ┣ 📂 public          # Imagens, SVGs e ícones públicos
 ┗ 📜 middleware.ts   # Middleware de proteção de rotas e verificação de sessão
```

⚙️ Como Executar o Projeto Localmente
Siga os passos abaixo para rodar a aplicação no seu ambiente de desenvolvimento.

Pré-requisitos
Node.js (Versão 18 ou superior)

Gerenciador de pacotes (NPM, Yarn ou PNPM)

Conta no Supabase configurada com o banco de dados do projeto.

#Passo a passo
#Clone o repositório:
git clone [https://github.com/SEU_USUARIO/sgd-react.git](https://github.com/SEU_USUARIO/sgd-react.git)
cd sgd-react

# Instale as dependências:
npm install
ou
yarn install

# Configure as Variáveis de Ambiente:
Crie um arquivo .env.local na raiz do projeto e adicione as credenciais do seu Supabase:
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Inicie o servidor de desenvolvimento:
npm run dev
ou
yarn dev

# Acesse a aplicação:
Abra http://localhost:3000 no seu navegador para visualizar o sistema.

