"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/routes/research-routes.ts
var research_routes_exports = {};
__export(research_routes_exports, {
  researchRoutes: () => researchRoutes
});
module.exports = __toCommonJS(research_routes_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/routes/research-routes.ts
async function researchRoutes(app) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });
  app.post("/pesquisa", async (request, reply) => {
    const bodySchema = import_zod.z.object({
      uf: import_zod.z.string(),
      usuarioId: import_zod.z.string().uuid(),
      tipoDaPesquisa: import_zod.z.string(),
      dataVisita: import_zod.z.string(),
      cliente: import_zod.z.string(),
      labPisoDeVendas: import_zod.z.string().nullish(),
      conPisoDeVendas: import_zod.z.string().nullish(),
      treinamento: import_zod.z.string().nullish(),
      vendaPremiada: import_zod.z.string(),
      pagamentoVendaPremiada: import_zod.z.string().nullish(),
      merchandising: import_zod.z.string(),
      reposicao: import_zod.z.string().nullish(),
      prazoEntregaCon: import_zod.z.string(),
      campanhaDeVendaCon: import_zod.z.string().nullish(),
      produtoChave: import_zod.z.string().nullish(),
      linhasDeCredito: import_zod.z.string(),
      observacao: import_zod.z.string().nullish()
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
  app.delete("/pesquisa/:researchId", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      researchId: import_zod.z.coerce.number()
    });
    const { researchId } = paramsSchema.parse(request.params);
    try {
      await prisma.pesquisa.delete({
        where: {
          id: researchId
        }
      });
      return reply.status(204).send({ message: "Deletado com sucesso!" });
    } catch (err) {
      return reply.status(400).send({ message: "Algo deu errado" });
    }
  });
  app.get("/pesquisas", async (request, reply) => {
    const querySchema = import_zod.z.object({
      take: import_zod.z.coerce.number().positive().int().nullish(),
      endDate: import_zod.z.string().nullish(),
      startDate: import_zod.z.string().nullish()
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
          ...take ? {
            take
          } : {},
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
  app.get("/pesquisa/:researchId", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      researchId: import_zod.z.coerce.number().int()
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
  app.put("/pesquisa/:researchId", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      researchId: import_zod.z.coerce.number().int()
    });
    const bodySchema = import_zod.z.object({
      observacao: import_zod.z.string().nullish(),
      treinamento: import_zod.z.string().nullish(),
      pagamentoVendaPremiada: import_zod.z.string().nullish()
    });
    try {
      const { researchId } = paramsSchema.parse(request.params);
      const { observacao, treinamento, pagamentoVendaPremiada } = bodySchema.parse(request.body);
      const research = await prisma.pesquisa.update({
        where: {
          id: researchId
        },
        data: {
          observacao,
          treinamento,
          pagamentoVendaPremiada
        }
      });
      return reply.status(200).send({ research });
    } catch (error) {
      console.error(error);
      return reply.status(500).send({ error: "Ocorreu um erro ao atualizar a pesquisa." });
    }
  });
  app.get("/pesquisas/:userId", async (request, reply) => {
    const paramsSchema = import_zod.z.object({
      userId: import_zod.z.string().uuid()
    });
    const querySchema = import_zod.z.object({
      take: import_zod.z.coerce.number().positive().int().nullish(),
      endDate: import_zod.z.string().nullish(),
      startDate: import_zod.z.string().nullish()
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
        ...take ? {
          take
        } : {},
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
  app.get("/produto-chave", async (request, reply) => {
    const productsKey = await prisma.produtoChave.findMany({
      select: {
        nome: true,
        preco: true
      }
    });
    return reply.status(200).send({ productsKey });
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  researchRoutes
});
