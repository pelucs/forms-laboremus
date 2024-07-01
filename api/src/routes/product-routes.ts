import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export async function productRoutes(app: FastifyInstance) {
  app.get("/produtos", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const produtos = await prisma.produto.findMany({
        select: {
          descricao: true,
        }
      });

      return reply.status(200).send({ produtos });
    } catch(err){
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}