const { workerData, parentPort } = require("worker_threads");
const lkh = require("./lkh");

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
lkh(workerData.circles).then(path => {
  parentPort.postMessage({
    id: workerData.id,
    path,
  });
});
