import './apply-dotenv.js';

import { createTbl } from './db';

createTbl();


import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const fastify = Fastify({logger: true});


import applyMiddleware from './apply-middleware';
applyMiddleware(fastify);

// Handle base url('/')
fastify.register((fastify: FastifyInstance, _: any, done: any) => {
  fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    return "SSU Open-Source project REST-API Server Working :)";
  });

  done();
});


import routeReport from './routes/report';
fastify.register(routeReport, {prefix: 'report'});


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