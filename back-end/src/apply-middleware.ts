import { FastifyInstance } from "fastify";
import * as fastify_middle from '@fastify/express';
import * as cors from 'cors';
import helmet from 'helmet';

export default (fastify: FastifyInstance) => {
  (async () => {
    await fastify.register(fastify_middle);
  
    fastify.use(cors);
    fastify.use(helmet());
  })();
}