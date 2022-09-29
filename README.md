# Quick intro into WebAssembly and Emscripten

## Run

* `yarn start`
* Open: `http://localhost:8080/index.html`

## Setup Emscripten

Option 1: [Download and install Emscripten](https://emscripten.org/docs/getting_started/downloads.html)

Option 2: [Docker image](https://hub.docker.com/r/trzeci/emscripten/)

* `docker pull trzeci/emscripten`
* `docker run --rm -v ${pwd}:/src trzeci/emscripten emcc <emcc options here>`
    * `${pwd}` works on Windows PowerShell
    * `$(pwd)` works on Linux

Settings: [](https://github.com/emscripten-core/emscripten/blob/main/src/settings.js)

## Demo

Clean compiled files:

```shell
yarn clean
```

## Fibonacci

### Compile WebAssembly

```shell
emcc -O3 -s EXPORTED_RUNTIME_METHODS=["cwrap"] --minify 0 wasm/fib.c -o wasm/fib.wasm.js
```

or

```shell
docker run --rm -v ${pwd}/wasm:/src trzeci/emscripten emcc -O3 -s EXPORTED_RUNTIME_METHODS=["cwrap"] --minify 0 fib.c -o fib.wasm.js
```

* `-O3`: Optimize aggressively
* `-s EXPORTED_RUNTIME_METHODS=["cwrap"]`: leave the [cwrap()](https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html#interacting-with-code-ccall-cwrap) function available in the JavaScript file
* `--minify 0`: disable generated JS code minification for demo
* `fib.c` file to compile

### Outputs:

* fib.wasm.wasm - WebAssembly binary
* [](wasm/fib.wasm.js) - JavaScript file that calls the WebAssembly binary

### Notable files:

* [](js/fib.js) - JS implementation
* [](wasm/fib.c) - C implementation
* [](index.html) - Import wasm/fib.wasm.js
* [](js/fibWasm.js) - Extract binding for wasm function
* [](wasm/worker.js) - Worker that loads wasm/fib.wasm.js
* [](js/fibWasmWorker.js) - Using the worker

## LKH example

LKH is an effective implementation of the Lin-Kernighan heuristic for solving the traveling salesman problem.

[More info](http://webhotel4.ruc.dk/~keld/research/LKH-3/)

LKH is CLI-based. Input/output is controlled via file system files, and it is run using main function. This adds some complexity to using it in Emscripten.

Setup (already done):

* Download [LKH-3.0.7.tgz](http://webhotel4.ruc.dk/~keld/research/LKH-3/LKH-3.0.7.tgz)
* Extract dot `lkh/src`
* [](lkh/src/SRC/GetTime.c): comment in line 3: `#undef HAVE_GETRUSAGE`
* Add following flags to `LKH` command in [](lkh/src/SRC/Makefile):
  `-o ../../lkh.js -s MODULARIZE=1 -s EXPORTED_RUNTIME_METHODS='["FS", "callMain"]'`
  * `-o ../../lkh.js`: output file
  * `-s MODULARIZE=1`: use modules instead of automatically running main function. Re-running `main` function is problematic, so for each call we initiate module again
  * `-s EXPORTED_RUNTIME_METHODS='["FS", "callMain"]'`
    * FS - add file system support
    * callMain - allow calling main function

### Compile WebAssembly

```shell
emmake make
```

or

```shell
docker run --rm -v ${pwd}/lkh:/src trzeci/emscripten /bin/bash -c "cd src; emmake make"
```

### Outputs:

* lkh.wasm - WebAssembly binary
* [](lkh/lkh.js) - JavaScript file that calls the WebAssembly binary

### Notable files:

* [](lkh/worker.js) - Worker that runs lkh wasm
* [](js/lkh.js) - Using the worker

## Node

Run LKH with 50 nodes in synchronous mode and in worker thread.

```shell
yarn lkh
```

### Notable files

* [](node/index.js) - Node.js script that runs LKH
* [](node/lkh.js) - LKH wrapper for synchronous mode
* [](node/lkh-node-worker.js) - LKH wrapper for worker mode

