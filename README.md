# Quick intro into WebAssembly and Emscripten

## Setup Emscripten

Option 1: [Download and install Emscripten](https://emscripten.org/docs/getting_started/downloads.html)

Option 2: [Docker image](https://hub.docker.com/r/trzeci/emscripten/)

* `docker pull trzeci/emscripten`
* `docker run --rm -v ${pwd}:/src trzeci/emscripten emcc <emcc options here>`
    * `${pwd}` works on Windows PowerShell
    * `$(pwd)` works on Linux

## Fibonacci

### Compile WebAssembly

`emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap"] -s BUILD_AS_WORKER=1 fib.c`

or

`docker run --rm -v ${pwd}/wasm:/src trzeci/emscripten emcc -O3 -s WASM=1 -s EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap"] fib.c`

()

* `-O3`: Optimize aggressively
* `-s WASM=1`: Use Wasm instead of asm.js
* `-s EXTRA_EXPORTED_RUNTIME_METHODS=["cwrap"]`: leave the [cwrap()](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-ccall-cwrap) function available in the JavaScript file
* `fib.c` file to compile

### Outputs:

* a.out.wasm - WebAssembly binary
* a.out.js - JavaScript file that calls the WebAssembly binary

