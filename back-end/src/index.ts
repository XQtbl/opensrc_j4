import { exit } from "process";
import { Worker } from "worker_threads";


const restWorker = new Worker('./dist/rest-server.js');
const sockWorker = new Worker('./dist/sock-server.js');


restWorker.on('message', msg => {
  sockWorker.postMessage(msg);
});

sockWorker.on('message', msg => {
  restWorker.postMessage(msg);
});


const restServerP = new Promise((res, rej) => {
  restWorker.on('error', rej);
  restWorker.on('exit', code => {
    res(code);
  });
});

const sockServerP = new Promise((res, rej) => {
  sockWorker.on('error', rej);
  sockWorker.on('exit', code => {
    res(code);
  });
});


(async () => {
  const restExitCode = await restServerP;
  const sockExitCode = await sockServerP;

  if (restExitCode !== 0)
    throw new Error(`REST API Server worker stopped with exit code ${restExitCode}`);

  if (sockExitCode !== 0)
    throw new Error(`WebSocket Server worker stopped with exit code ${sockExitCode}`);
})().catch(err => {
  console.error(err);
  exit(1);
});