import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export async function countryRoutes(app: FastifyInstance) {
  app.get("/municipios", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const municipios = await prisma.municipio.findMany({
        distinct: "UF",
        select: {
          UF: true,
        }
      });

      return reply.status(200).send({ municipios });
    } catch(err){
      return reply.status(400).send({
        message: "Algo de errado aconteceu"
      });
    }
  });
}