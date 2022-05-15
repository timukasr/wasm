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

### Run

* `yarn start`
* Open: `http://localhost:8080/index.html`

## LKH example

LKH is an effective implementation of the Lin-Kernighan heuristic for solving the traveling salesman problem.

[More info](http://webhotel4.ruc.dk/~keld/research/LKH-3/)

LKH is CLI-based. Input/output is controlled via file system files, and it is run using main function. This adds some complexity to using it in Emscripten.

Setup (already done):

* Download [LKH-3.0.7.tgz](http://webhotel4.ruc.dk/~keld/research/LKH-3/LKH-3.0.7.tgz)
* Extract dot `lkh/src`
* `lkh/src/SRC/GetTime.c`: comment in line 3: `#undef HAVE_GETRUSAGE`
* Add following flags to `LKH` command in `lkh/src/SRC/Makefile`:
  `-o ../../lkh.js -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORTED_RUNTIME_METHODS='["FS", "callMain"]'`
  * `-o ../../lkh.js`: output file
  * `-s WASM=1`: Use Wasm instead of asm.js
  * `-s MODULARIZE=1`: use modules instead of automatically running main function. Re-running `main` function is problematic, so for each call we initiate module again.
  * `-s EXPORT_ES6=1`: export ES6 modules
  * `-s EXPORTED_RUNTIME_METHODS='["FS", "callMain"]'`
    * FS - add file system support
    * callMain - allow calling main function

### Compile WebAssembly

`docker run --rm -v ${pwd}/lkh:/src trzeci/emscripten /bin/bash -c "cd src; emmake make"`

### Outputs:

* lkh.wasm - WebAssembly binary
* lkh.js - JavaScript file that calls the WebAssembly binary

### Run

* `yarn start`
* Open: `http://localhost:8080/lkh.html`

# General

Settings: https://github.com/emscripten-core/emscripten/blob/main/src/settings.js