const { Worker } = require("worker_threads");
const { setTimeout } = require("timers/promises");
const path = require("path");
const lkh = require("./lkh.js");
require("../js/blockDetector.js");

const circles = [];

for (let i = 0; i < 50; i++) {
  circles.push({ x: Math.random() * 500, y: Math.random() * 500 });
}

const count = 10;

async function runner(lkh, name) {
  console.log("Starting", name);
  const start = Date.now();

  for (let i = 0; i < count; i++) {
    await lkh(circles);
  }
  // const result = await lkh(circles);
  const duration = Date.now() - start;
  console.log(`Path for ${circles.length} nodes X ${count} found in ${duration}ms using ${name}`);
}

const promises = new Map();

const worker = new Worker(path.join(__dirname, "./lkh-node-worker.js"));

worker.on("message", data => {
  const resolve = promises.get(data.id);

  if (resolve) {
    resolve(data.path);
    promises.delete(data.id);
  }
});
worker.on("error", err => console.error(`Worker returned error ${err}`));
worker.on("exit", code => {
  console.error(`Worker stopped with exit code ${code}`);
});

function runService(circles) {
  return new Promise((resolve, _reject) => {
    const id = Math.random();
    promises.set(id, resolve);
    worker.postMessage({ id, circles });
  });
}

async function run() {
  await runner(lkh, "blocking");

  await setTimeout(100);

  await runner(runService, "worker");

  await setTimeout(100);
}

run()
  .catch(err => console.error(err))
  .finally(() => process.exit());
