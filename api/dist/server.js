"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/server.ts
var import_fastify = __toESM(require("fastify"));

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/server.ts
var import_cors = require("@fastify/cors");

// src/routes/client-routes.ts
var import_zod = require("zod");
async function clientRoutes(app2) {
  app2.get("/clientes", async (request, reply) => {
    const bodySchema = import_zod.z.object({
      query: import_zod.z.string()
    });
    const { query } = bodySchema.parse(request.query);
    try {
      const clientes = await prisma.pessoa.findMany({
        where: {
          nome: {
            contains: query
          }
        },
        select: {
          nome: true
        },
        take: 20
      });
      return reply.status(200).send(clientes);
    } catch (err) {
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}

// src/routes/country-routes.ts
async function countryRoutes(app2) {
  app2.get("/municipios", async (request, reply) => {
    try {
      const municipios = await prisma.municipio.findMany({
        distinct: "UF",
        select: {
          UF: true
        }
      });
      return reply.status(200).send({ municipios });
    } catch (err) {
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}

// src/routes/product-routes.ts
async function productRoutes(app2) {
  app2.get("/produtos", async (request, reply) => {
    try {
      const produtos = await prisma.produto.findMany({
        select: {
          descricao: true
        }
      });
      return reply.status(200).send({ produtos });
    } catch (err) {
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}

// src/routes/research-routes.ts
var import_zod2 = require("zod");
async function researchRoutes(app2) {
  app2.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });
  app2.post("/pesquisa", async (request, reply) => {
    const bodySchema = import_zod2.z.object({
      uf: import_zod2.z.string(),
      usuarioId: import_zod2.z.string().uuid(),
      tipoDaPesquisa: import_zod2.z.string(),
      dataVisita: import_zod2.z.string(),
      cliente: import_zod2.z.string(),
      labPisoDeVendas: import_zod2.z.string().nullish(),
      conPisoDeVendas: import_zod2.z.string().nullish(),
      treinamento: import_zod2.z.string().nullish(),
      vendaPremiada: import_zod2.z.string(),
      pagamentoVendaPremiada: import_zod2.z.string().nullish(),
      merchandising: import_zod2.z.string(),
      reposicao: import_zod2.z.string().nullish(),
      prazoEntregaCon: import_zod2.z.string(),
      campanhaDeVendaCon: import_zod2.z.string().nullish(),
      produtoChave: import_zod2.z.string().nullish(),
      linhasDeCredito: import_zod2.z.string(),
      observacao: import_zod2.z.string().nullish()
    });
    const data = bodySchema.parse(request.body);
    try {
      const research = await prisma.pesquisa.create({
        data
      });
      if (data.produtoChave) {
        const productKey = JSON.parse(data.produtoChave);
        productKey.forEach(async (product) => await prisma.produtoChave.create({
          data: {
            nome: product.name,
            preco: product.price
          }
        }));
      }
      return reply.status(201).send({ id: research.id });
    } catch (err) {
      return reply.status(400).send({ message: "Algo deu errado" });
    }
  });
  app2.get("/pesquisas", async (request, reply) => {
    const querySchema = import_zod2.z.object({
      take: import_zod2.z.coerce.number().positive().int().nullish(),
      endDate: import_zod2.z.string().nullish(),
      startDate: import_zod2.z.string().nullish()
    });
    try {
      const { take, endDate, startDate } = querySchema.parse(request.query);
      const [researchs, totalResearchs] = await Promise.all([
        prisma.pesquisa.findMany({
          where: {
            dataVisita: {
              lte: endDate ? new Date(endDate).toISOString() : void 0,
              gte: startDate ? new Date(startDate).toISOString() : void 0
            }
          },
          include: {
            usuario: {
              select: {
                nome: true,
                email: true
              }
            }
          },
          take: take ? take : 20,
          orderBy: {
            dataVisita: "desc"
          }
        }),
        prisma.pesquisa.count()
        // Contagem total de pesquisas
      ]);
      return reply.status(200).send({ researchs, totalResearchs });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Ocorreu um erro ao buscar as pesquisas." });
    }
  });
  app2.get("/pesquisa/:researchId", async (request, reply) => {
    const paramsSchema = import_zod2.z.object({
      researchId: import_zod2.z.coerce.number().int()
    });
    try {
      const { researchId } = paramsSchema.parse(request.params);
      const research = await prisma.pesquisa.findUnique({
        where: {
          id: researchId
        },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true
            }
          }
        }
      });
      return reply.status(200).send({ research });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Ocorreu um erro ao buscar as pesquisas." });
    }
  });
  app2.get("/pesquisas/:userId", async (request, reply) => {
    const paramsSchema = import_zod2.z.object({
      userId: import_zod2.z.string().uuid()
    });
    const querySchema = import_zod2.z.object({
      take: import_zod2.z.coerce.number().positive().int().nullish(),
      endDate: import_zod2.z.string().nullish(),
      startDate: import_zod2.z.string().nullish()
    });
    try {
      const { userId } = paramsSchema.parse(request.params);
      const { take, endDate, startDate } = querySchema.parse(request.query);
      const researchs = await prisma.pesquisa.findMany({
        where: {
          usuarioId: userId,
          dataVisita: {
            lte: endDate ? new Date(endDate).toISOString() : void 0,
            gte: startDate ? new Date(startDate).toISOString() : void 0
          }
        },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true
            }
          }
        },
        take: take ? take : 20,
        orderBy: {
          dataVisita: "desc"
        }
      });
      return reply.status(200).send({ researchs });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Ocorreu um erro ao buscar as pesquisas." });
    }
  });
  app2.get("/produto-chave", async (request, reply) => {
    const querySchema = import_zod2.z.object({
      query: import_zod2.z.coerce.number().nullish()
    });
    const { query } = querySchema.parse(request.query);
    const productsKey = await prisma.produtoChave.findMany({
      select: {
        nome: true,
        preco: true
      },
      take: query ? query : 20
    });
    return reply.status(200).send({ productsKey });
  });
}

// src/routes/auth-routes.ts
var import_zod3 = require("zod");
var import_bcrypt = __toESM(require("bcrypt"));
async function authRoutes(app2) {
  app2.post("/register", async (request, reply) => {
    const bodySchema = import_zod3.z.object({
      nome: import_zod3.z.string(),
      email: import_zod3.z.string(),
      senha: import_zod3.z.string(),
      tipo: import_zod3.z.string()
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
  app2.post("/login", async (request, reply) => {
    const bodySchema = import_zod3.z.object({
      email: import_zod3.z.string().email("@laboremus.com.br"),
      password: import_zod3.z.string().min(4)
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
        const token = app2.jwt.sign(
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
  app2.get("/user/:userId", async (request, reply) => {
    const paramsSchema = import_zod3.z.object({
      userId: import_zod3.z.string().uuid()
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

// src/server.ts
var import_jwt = __toESM(require("@fastify/jwt"));
var app = (0, import_fastify.default)();
app.register(import_cors.fastifyCors, {
  origin: "*"
});
app.register(import_jwt.default, {
  secret: `${process.env.SECRET_JWT}`
});
app.register(authRoutes);
app.register(clientRoutes);
app.register(countryRoutes);
app.register(productRoutes);
app.register(researchRoutes);
var start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 3333
    });
    console.log("HTTP Server Running");
  } catch (err) {
    console.log("Algo deu errado: " + err);
    process.exit(1);
  }
};
start();
process.on("SIGIN", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
