/**
 * Fibonacci Wasm Module.
 * Depends on Emscripten out.js file (wasm/a.out.js)
 */

/**
 * Placeholder function
 */
let fibWasm = () => {
  throw new Error("Not implemented");
}

/**
 * Module is global Emscripten object. Allows to control execution of the wasm module.
 * https://emscripten.org/docs/api_reference/module.html
 */

// Module.onRuntimeInitialized function is called when the runtime is fully initialized
Module.onRuntimeInitialized = () => {
  fibWasm = Module.cwrap('fib', 'number', ['number']);

  document.getElementById("wasm").removeAttribute("disabled");
};