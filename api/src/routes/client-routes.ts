import { z } from "zod";
import { prisma } from "../lib/prisma";
import { 
  FastifyReply, 
  FastifyInstance, 
  FastifyRequest 
} from "fastify";

export async function clientRoutes(app: FastifyInstance) {
  app.get("/clientes", async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      query: z.string()
    });

    const { query } = bodySchema.parse(request.query);

    try {
      const clientes = await prisma.pessoa.findMany({
        where: {
          nome: {
            contains: query,
          },
        },
        select: {
          nome: true,
        },
        take: 20,
      });

      return reply.status(200).send(clientes);
    } catch(err){
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}