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

// src/routes/product-routes.ts
var product_routes_exports = {};
__export(product_routes_exports, {
  productRoutes: () => productRoutes
});
module.exports = __toCommonJS(product_routes_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/routes/product-routes.ts
async function productRoutes(app) {
  app.get("/produtos", async (request, reply) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  productRoutes
});
