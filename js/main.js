function getN() {
  return document.getElementById("n").value;
}

async function runTest(fn, name) {
  const n = getN();
  console.time(name);
  const res = await fn(n);
  console.log(`Fibonacci of ${n} is ${res} using ${name}`);
  console.timeEnd(name);
}

function runJs() {
  runTest(fib, "fib.js")
}

function runWasm() {
  runTest(fibWasm, "fib.wasm")
}

function runWasmWorker() {
  runTest(fibWasmWorker, "wasm-web-worker")
}