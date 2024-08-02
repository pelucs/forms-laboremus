import { z } from "zod"
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function researchRoutes(app: FastifyInstance) {

  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  });

  // Criando nova pesquisa
  app.post("/pesquisa", async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      uf: z.string(),
      usuarioId: z.string().uuid(),
      tipoDaPesquisa: z.string(),
      dataVisita: z.string(),
      cliente: z.string(),
      labPisoDeVendas: z.string().nullish(),
      conPisoDeVendas: z.string().nullish(),
      treinamento: z.string().nullish(),
      vendaPremiada: z.string(),
      pagamentoVendaPremiada: z.string().nullish(),
      merchandising: z.string(),
      reposicao: z.string().nullish(),
      prazoEntregaCon: z.string(),
      campanhaDeVendaCon: z.string().nullish(),
      produtoChave: z.string().nullish(),
      linhasDeCredito: z.string(),
      observacao: z.string().nullish(),
    });

    const data = bodySchema.parse(request.body);

    try {
      const research = await prisma.pesquisa.create({
        data,
      });

      if(data.produtoChave){
        const productKey: { name: string, price: number }[] = JSON.parse(data.produtoChave);

        productKey.forEach(async product => (
          await prisma.produtoChave.create({
            data: {
              nome: product.name,
              preco: product.price
            }
          })
        ))
      }

      return reply.status(201).send({ id: research.id });
    } catch(err){
      return reply.status(400).send({ message: "Algo deu errado" })
    }
  });

  // Buscando todas as pesquisas
  app.get("/pesquisas", async (request: FastifyRequest, reply: FastifyReply) => {

    const querySchema = z.object({
      take: z.coerce.number().positive().int().nullish(),
      endDate: z.string().nullish(),
      startDate: z.string().nullish(),
    });
  
    try {
      const { take, endDate, startDate } = querySchema.parse(request.query);
  
      // Consulta das pesquisas
      const [researchs, totalResearchs] = await Promise.all([
        prisma.pesquisa.findMany({
          where: {
            dataVisita: {
              lte: endDate ? new Date(endDate).toISOString() : undefined,
              gte: startDate ? new Date(startDate).toISOString() : undefined,
            }
          },
          include: {
            usuario: {
              select: {
                nome: true,
                email: true,
              }
            }
          },
          ...(take ? { 
            take, 
          } : {}),
          orderBy: {
            dataVisita: "desc"
          }
        }),
        prisma.pesquisa.count() // Contagem total de pesquisas
      ]);
  
      // Resposta de sucesso
      return reply.status(200).send({ researchs, totalResearchs });
    } catch (error) {
      console.error(error);
  
      // Tratamento de erro
      return reply.status(500).send({ error: 'Ocorreu um erro ao buscar as pesquisas.' });
    }
  });

  // Buscando uma pesquisa
  app.get("/pesquisa/:researchId", async (request: FastifyRequest, reply: FastifyReply) => {

    const paramsSchema = z.object({
      researchId: z.coerce.number().int()
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
              email: true,
            }
          }
        }
      });
  
      return reply.status(200).send({ research });
    } catch (error) {
      console.error(error);
  
      // Tratamento de erro
      return reply.status(500).send({ error: 'Ocorreu um erro ao buscar as pesquisas.' });
    }
  });

  // Atualizando uma pesquisa
  app.put("/pesquisa/:researchId", async (request: FastifyRequest, reply: FastifyReply) => {

    const paramsSchema = z.object({
      researchId: z.coerce.number().int()
    });

    const bodySchema = z.object({
      observacao: z.string().nullish(),
      pagamentoVendaPremiada: z.string().nullish(),
    });
  
    try {
      const { researchId } = paramsSchema.parse(request.params);
      const { observacao, pagamentoVendaPremiada } = bodySchema.parse(request.body);

      const research = await prisma.pesquisa.update({
        where: {
          id: researchId
        },
        data: {
          observacao,
          pagamentoVendaPremiada,
        }
      });
  
      return reply.status(200).send({ research });
    } catch (error) {
      console.error(error);
  
      // Tratamento de erro
      return reply.status(500).send({ error: 'Ocorreu um erro ao atualizar a pesquisa.' });
    }
  });

  // Buscando as pesquisas por usuário
  app.get("/pesquisas/:userId", async (request: FastifyRequest, reply: FastifyReply) => {

    const paramsSchema = z.object({
      userId: z.string().uuid()
    });

    const querySchema = z.object({
      take: z.coerce.number().positive().int().nullish(),
      endDate: z.string().nullish(),
      startDate: z.string().nullish(),
    });
  
    try {
      const { userId } = paramsSchema.parse(request.params);
      const { take, endDate, startDate } = querySchema.parse(request.query);
  
      // Consulta das pesquisas
      const researchs = await prisma.pesquisa.findMany({
        where: {
          usuarioId: userId,
          dataVisita: {
            lte: endDate ? new Date(endDate).toISOString() : undefined,
            gte: startDate ? new Date(startDate).toISOString() : undefined,
          }
        },
        include: {
          usuario: {
            select: {
              nome: true,
              email: true,
            }
          }
        },
        ...(take ? { 
          take, 
        } : {}),
        orderBy: {
          dataVisita: "desc"
        }
      })
  
      // Resposta de sucesso
      return reply.status(200).send({ researchs });
    } catch (error) {
      console.error(error);
  
      // Tratamento de erro
      return reply.status(500).send({ error: 'Ocorreu um erro ao buscar as pesquisas.' });
    }
  });

  // Buscando todos os produtos chaves
  app.get("/produto-chave", async (request: FastifyRequest, reply: FastifyReply) => {

    const querySchema = z.object({
      query: z.coerce.number().nullish(),
    });

    const { query } = querySchema.parse(request.query);

    const productsKey = await prisma.produtoChave.findMany({
      select: {
        nome: true,
        preco: true,
      },
      take: query ? query : 20
    });

    return reply.status(200).send({ productsKey });
  });
}