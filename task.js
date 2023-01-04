import { workerData, parentPort } from "node:worker_threads";

console.log("Worker thread is processing data:", workerData.data);
// Simulação de task pesada
for (let i = 0; i < 10_000_000_000; i++) {}

// Envia mensagem pra thread principal
parentPort.postMessage(workerData);
process.exit();
