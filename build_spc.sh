#!/bin/bash
# https://github.com/kripken/emscripten/wiki/LLVM-Backend
# https://github.com/kripken/emscripten/wiki/Optimizing-Code
# Old flags for testing:
# EMCC_FAST_COMPILER=0
# -s ASSERTIONS=1 \
# -O2 --closure 1\
mkdir -p dist;

# Build spc.js
emcc \
  -O3 \
  -s ASM_JS=1 \
  -s WARN_ON_UNDEFINED_SYMBOLS=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s EXPORTED_FUNCTIONS="['_SpcJsInit', '_SpcJsDestroy', '_SpcJsDecodeAudio']" \
  -Iinclude \
  include/snes_spc/*.cpp \
  src/spc-libs.c \
  -o src/spc-libs.js

importer spc.imports.js spc.js && cp spc.js dist/spc.js;
importer spc.aurora.js spc-aurora.js && cp spc-aurora.js dist/spc-aurora.js;
