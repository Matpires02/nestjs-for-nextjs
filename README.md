# 🚀 NestJS API

API desenvolvida utilizando **NestJS**, com foco em boas práticas de segurança,
organização e escalabilidade.

A aplicação possui autenticação, validação de dados, proteção contra ataques
comuns, controle de acesso utilizando Guards, tratamento global de exceções e
persistência utilizando TypeORM.

---

## 🛠️ Tecnologias utilizadas

- NestJS
- Node.js
- TypeScript
- TypeORM
- bcrypt para criptografia de senhas
- ThrottlerModule para Rate Limit
- Helmet para headers de segurança
- CORS configurado
- Pipes para validação e transformação de dados
- Exception Filters para tratamento de erros
- Guards para controle de autenticação/autorização

---

## ⚙️ Configuração do ambiente

Crie um arquivo `.env` baseado no:

```
.env.example
```

Exemplo:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=database

JWT_SECRET=secret_key

THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

---

## ▶️ Instalação

```bash
npm install
```

Configure o arquivo `.env`

Execute:

```bash
npm run start:dev
```

API disponível:

```
http://localhost:3001
```

---

# 🔐 Segurança

## Helmet

Adiciona headers HTTP seguros:

```ts
app.use(helmet());
```

## CORS

Permite comunicação segura entre aplicações:

```ts
app.enableCors();
```

## Rate Limit

Implementado com ThrottlerModule para limitar requisições:

```ts
ThrottlerModule.forRoot({
  ttl: 60000,
  limit: 10,
});
```

---

# 🔑 Autenticação

O sistema utiliza Guards para proteger rotas.

Fluxo:

1. Usuário realiza login
2. Senha validada usando bcrypt
3. Token gerado
4. Guard valida acesso às rotas protegidas

---

# 🔒 Senhas

Senhas são armazenadas utilizando hash:

```ts
bcrypt.hash(password, 10);
```

Comparação:

```ts
bcrypt.compare(password, hashedPassword);
```

---

# 🛡️ Guards

Exemplo:

```ts
@UseGuards(AuthGuard)
@Get()
findAll() {}
```

Responsáveis por autenticação e autorização.

---

# ⚠️ Exception Filters

Tratamento centralizado de erros:

```ts
@Catch(HttpException)
export class HttpExceptionFilter {}
```

Padroniza respostas da API.

---

# 📋 Pipes

Utilizados para validação e transformação:

```ts
ValidationPipe({
  whitelist: true,
  transform: true,
});
```

---

# 🗄️ TypeORM

A aplicação utiliza TypeORM para persistência:

- Entidades
- Repositórios
- Migrations
- Comunicação com banco

Configuração via `.env`.

---

# 📚 Documentação das rotas

As rotas disponíveis estão documentadas em:

```
./rest-client/request.http
```

Compatível com:

- VS Code REST Client
- JetBrains HTTP Client

Exemplo:

```http
### Login

POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "password"
}
```

---

# 🧪 Testes

Executar:

```bash
npm run test
```

Cobertura:

```bash
npm run test:cov
```

---

# 📦 Scripts

```bash
npm run start
```

Executa a aplicação.

```bash
npm run start:dev
```

Modo desenvolvimento.

```bash
npm run build
```

Build de produção.

```bash
npm run start:prod
```

Executa versão compilada.

---

# 📌 Observações

- Não envie o `.env` para o repositório.
- Utilize o `.env.example`.
- Mantenha credenciais protegidas.
- Rotas protegidas precisam de autenticação.

---

## Autor

Projeto desenvolvido utilizando NestJS seguindo boas práticas de arquitetura e
segurança.
