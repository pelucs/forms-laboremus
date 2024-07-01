import fastify from 'fastify';

import { prisma } from './lib/prisma';
import { fastifyCors } from "@fastify/cors"
import { clientRoutes } from './routes/client-routes';
import { countryRoutes } from './routes/country-routes';
import { productRoutes } from './routes/product-routes';
import { researchRoutes } from './routes/research-routes';
import { authRoutes } from './routes/auth-routes';
import jwt from "@fastify/jwt";

const app = fastify();

app.register(fastifyCors, {
  origin: "*"
});

app.register(jwt, {
  secret: `${process.env.SECRET_JWT}`
})

app.register(authRoutes);
app.register(clientRoutes);
app.register(countryRoutes);
app.register(productRoutes);
app.register(researchRoutes);

const start = async () => {
  try {
    await app.listen({ 
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 3333 
    });
    console.log('HTTP Server Running');
  } catch (err) {
    console.log('Algo deu errado: ' + err);
    process.exit(1);
  }
};

start();

// Fechando a conexão com o Prisma ao finalizar o processo
process.on('SIGIN', async () => {
  await prisma.$disconnect();
  process.exit(0);
});