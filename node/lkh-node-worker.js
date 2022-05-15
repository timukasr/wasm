const { parentPort } = require("worker_threads");
const lkh = require("./lkh");

parentPort.on("message", msg => {
  lkh(msg.circles).then(path => {
    parentPort.postMessage({
      id: msg.id,
      path,
    });
  });
});
