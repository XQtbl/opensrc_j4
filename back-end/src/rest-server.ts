import './apply-dotenv.js';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { createTbl } from './db';

createTbl();

const fastify = Fastify({logger: true});


import applyMiddleware from './apply-middleware';
applyMiddleware(fastify);


fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
  return "SSU Open-Source project REST-API Server Working :)";
});

import report from './routes/report';
fastify.register(report, {prefix: '/report'});

const app = async () => {
  try {
    let ret_string: string = await fastify.listen({port: parseInt(process.env["PORT"] ?? "8000")});
    console.log(`Fastify started with string: ${ret_string}`);
  }
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

app();