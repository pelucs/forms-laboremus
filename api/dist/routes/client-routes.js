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

// src/routes/client-routes.ts
var client_routes_exports = {};
__export(client_routes_exports, {
  clientRoutes: () => clientRoutes
});
module.exports = __toCommonJS(client_routes_exports);
var import_zod = require("zod");

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/routes/client-routes.ts
async function clientRoutes(app) {
  app.get("/clientes", async (request, reply) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  clientRoutes
});
