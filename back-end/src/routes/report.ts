import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { parentPort } from 'worker_threads';
import * as db from '../db';



export default function(fastify: FastifyInstance, _: any, done: any) {
  fastify.get('/', async (req: FastifyRequest, res: FastifyReply) => {
    let reports = await db.getReports();
    
    if (!reports) {
      res.code(500).send('Internal DB error :(');
      return;
    }

    res.code(200).send(JSON.stringify(reports));
  });

  interface PostFormat extends db.ReportBase {}
  fastify.post('/', async (req: FastifyRequest, res: FastifyReply) => {
    
    const request = req.body as PostFormat;
    
    let report: db.Report = {
      category: request.category,
      location: request.location,
      seriousness: request.seriousness,
      memo: request.memo,
      created_time: new Date(Date.now())
    };
    
    let result = await db.registerReport(report);

    if (result)
      parentPort?.postMessage(report);
    
    res
      .code(result ? 200 : 500)
      .send();  
  });

  done();
};