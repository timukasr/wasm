let fib = () => {};

self.Module = {
  onRuntimeInitialized() {
    fib = Module.cwrap('fib', 'number', ['number']);
    self.postMessage({
      type: 'ready'
    });
  }
};

self.importScripts("a.out.js");

self.onmessage = function(messageEvent) {
  if (messageEvent.data.type === 'fib') {
    self.postMessage({
      type: 'result',
      result: fib(messageEvent.data.n)
    });
  }
}
