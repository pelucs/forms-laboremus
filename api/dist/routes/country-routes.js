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

// src/routes/country-routes.ts
var country_routes_exports = {};
__export(country_routes_exports, {
  countryRoutes: () => countryRoutes
});
module.exports = __toCommonJS(country_routes_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient({
  log: ["query", "error"]
});

// src/routes/country-routes.ts
async function countryRoutes(app) {
  app.get("/municipios", async (request, reply) => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  countryRoutes
});
