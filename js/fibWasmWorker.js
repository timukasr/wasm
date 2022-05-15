/**
 * Wrapper for loading WASM module using Web Worker
 */

const worker = new Worker('../wasm/worker.js');

worker.addEventListener('message', (e) => {
  if (e.data.type === "ready") {
    document.getElementById("wasm-worker").removeAttribute("disabled");
  }
});

function fibWasmWorker(n) {
  // not safe, but good enough for this example
  return new Promise((resolve) => {
    worker.addEventListener('message', (e) => {
      if (e.data.type === "result") {
        resolve(e.data.result);
      }
    }, {once: true});

    worker.postMessage({
      type: "fib",
      n
    });
  });
}