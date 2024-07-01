import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import bcrypt from "bcrypt";

export async function authRoutes(app: FastifyInstance) {
  // Cadastrando usuário
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      nome: z.string(),
      email: z.string(),
      senha: z.string(),
      tipo: z.string(),
    })

    const { nome, email, tipo, senha } = bodySchema.parse(request.body);

    const user = await prisma.usuarios.findUnique({
      where: {
        email,
      }
    });

    if(user){
      throw new Error("Email já cadastrado!")
    }

    const hash = await bcrypt.hash(senha, 10);

    await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hash,
        tipo,
      }
    })

    return reply.status(201).send("Conta criada com sucesso!")
  });

  // Efetuando login
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const bodySchema = z.object({
      email: z.string().email("@laboremus.com.br"),
      password: z.string().min(4)
    }); 
  
    try {
      const { email, password } = bodySchema.parse(request.body);
  
      const user = await prisma.usuarios.findUnique({
        where: {
          email,
        }
      });

      
      if(!user) {
        return reply.status(404).send("Usuário não encontrado com esse email!")
      }
        
      const comparePassword = await bcrypt.compare(password, user.senha);
      
      if(comparePassword) {
        const token = app.jwt.sign(
          { name: user.nome, typeAccount: user.tipo }, 
          { sub: user.id, expiresIn: '30 days' }
        );
          
        reply.status(200).send({ token });
      } else {
        reply.status(401).send("Senha incorreta!");
      }
    } catch (error) {
      reply.status(500).send("Erro durante o login!");
    }
  });

  app.get('/user/:userId', async (request: FastifyRequest, reply: FastifyReply) => {
    const paramsSchema = z.object({
      userId: z.string().uuid()
    }); 
  
    try {
      const { userId } = paramsSchema.parse(request.params);
  
      const user = await prisma.usuarios.findUnique({
        where: {
          id: userId,
        }
      });

      if(!user) {
        return reply.status(404).send("Usuário não encontrado com esse id!");
      }
        
      reply.status(200).send({ user: user.id });
    } catch (error) {
      reply.status(500).send("Erro ao buscar o usuário");
    }
  });
} 