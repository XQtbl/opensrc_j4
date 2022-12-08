import { parentPort } from "worker_threads";



parentPort?.on('message', msg => {
  console.log(`[WebSocket] Got message: ${JSON.stringify(msg)}`);
});