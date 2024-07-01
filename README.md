# Projeto Fullstack - Formulário Laboremus
## Stack utilizada

*Front-end:* React, Typescript, TailwindCSS, ShadcnUI

*Back-end:* NodeJS, Typescript, Fastify, Prisma, MySQL
## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/pelucs/forms-laboremus.git
```

Entre nos diretórios do projeto

```bash
  cd web
```

```bash
  cd api
```

Instale as dependências

```bash
  npm install
```

Declare as variáveis de ambiente

```bash
  *Back-end*

  SECRET_JWT="chave secreta"
  DATABASE_URL="url do banco de dados"

  *Front-end*
  API_KEY="url do back-end"
```

Em ambos os diretórios, Web e Api, rode no terminal:

```bash
  npm run dev
```

Depois das alterações, em ambos os diretórios, rode no terminal:

```bash
  npm run build
```

