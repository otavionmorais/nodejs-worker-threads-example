import { Worker } from "node:worker_threads";
import express from "express";
import { randomUUID } from "node:crypto";

const app = express();

app.get("/test", (_req, res) => {
  res.send("OK");
});

app.get("/", (_req, res) => {
  const requestId = randomUUID();
  console.time("worker_" + requestId);

  // As outras requisições não são afetadas, pois o código é executado em uma thread separada
  const worker = new Worker("./task.js", {
    workerData: {
      requestId,
      data: {
        name: "Otávio",
      },
    },
  });

  worker.on("exit", () => {
    console.log("Worker thread exited");
    worker.terminate();
  });

  worker.on("message", (message) => {
    if (message.requestId === requestId) {
      res.send(message);
      console.timeEnd("worker_" + requestId);
    }
  });

  // Timeout de 2 minutos
  setTimeout(() => {
    worker.terminate();
    res.status(408).send("Timeout");
  }, 2 * 60 * 1000);
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
