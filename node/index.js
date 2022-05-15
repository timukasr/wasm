const { Worker } = require("worker_threads");
const { setTimeout } = require("timers/promises");
const path = require("path");
const lkh = require("./lkh.js");
require("../js/blockDetector.js");

const circles = [];

for (let i = 0; i < 50; i++) {
  circles.push({ x: Math.random() * 500, y: Math.random() * 500 });
}

async function runner(lkh, name) {
  const start = Date.now();
  const result = await lkh(circles);
  const duration = Date.now() - start;
  console.log(`Path for ${circles.length} nodes found in ${duration}ms using ${name}`, result);
}

function runService(circles) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.join(__dirname, "./lkh-node-worker.js"), {
      workerData: { circles, id: Math.random() },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", code => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

async function run() {
  await runner(lkh, "blocking");

  await setTimeout(100);

  await runner(runService, "blocking");

  await setTimeout(100);
}

run()
  .catch(err => console.error(err))
  .finally(() => process.exit());
