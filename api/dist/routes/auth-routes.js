"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/auth-routes.ts
var auth_routes_exports = {};
__export(auth_routes_exports, {
  authRoutes: () => authRoutes
});
module.exports = __toCommonJS(auth_routes_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/routes/auth-routes.ts
var import_bcrypt = __toESM(require("bcrypt"));
async function authRoutes(app) {
  app.post("/register", async (request, reply) => {
    const bodySchema = import_zod.z.object({
      nome: import_zod.z.string(),
      email: import_zod.z.string(),
      senha: import_zod.z.string(),
      tipo: import_zod.z.string()
    });
    const { nome, email, tipo, senha } = bodySchema.parse(request.body);
    const user = await prisma.usuarios.findUnique({
      where: {
        email
      }
    });
    if (user) {
      throw new Error("Email j\xE1 cadastrado!");
    }
    const hash = await import_bcrypt.default.hash(senha, 10);
    await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hash,
        tipo
      }
    });
    return reply.status(201).send("Conta criada com sucesso!");
  });
  app.post("/login", async (request, reply) => {
    const bodySchema = import_zod.z.object({
      email: import_zod.z.string().email("@laboremus.com.br"),
      password: import_zod.z.string().min(4)
    });
    try {
      const { email, password } = bodySchema.parse(request.body);
      const user = await prisma.usuarios.findUnique({
        where: {
          email
        }
      });
      if (!user) {
        return reply.status(404).send("Usu\xE1rio n\xE3o encontrado com esse email!");
      }
      const comparePassword = await import_bcrypt.default.compare(password, user.senha);
      if (comparePassword) {
        const token = app.jwt.sign(
          { name: user.nome, typeAccount: user.tipo },
          { sub: user.id, expiresIn: "30 days" }
        );
        reply.status(200).send({ token });
      } else {
        reply.status(401).send("Senha incorreta!");
      }
    } catch (error) {
      reply.status(500).send("Erro durante o login!");
    }
  });
  app.get("/user/:userId", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      userId: import_zod.z.string().uuid()
    });
    try {
      const { userId } = paramsSchema.parse(request.params);
      const user = await prisma.usuarios.findUnique({
        where: {
          id: userId
        }
      });
      if (!user) {
        return reply.status(404).send("Usu\xE1rio n\xE3o encontrado com esse id!");
      }
      reply.status(200).send({ user: user.id });
    } catch (error) {
      reply.status(500).send("Erro ao buscar o usu\xE1rio");
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authRoutes
});
