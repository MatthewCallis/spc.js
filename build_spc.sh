#!/bin/bash
# http://kripken.github.io/emscripten-site/docs/getting_started/FAQ.html
# http://kripken.github.io/emscripten-site/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
# http://kripken.github.io/emscripten-site/docs/porting/Debugging.html#debugging
# http://kripken.github.io/emscripten-site/docs/building_from_source/LLVM-Backend.html
# http://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html
# Old flags for testing:
# EMCC_FAST_COMPILER=0
# -s ASSERTIONS=1 \
# -O2 --closure 1\
mkdir -p dist;

# TODO: Test these
# -s ALLOW_MEMORY_GROWTH=1 \
# -s AGGRESSIVE_VARIABLE_ELIMINATION=1 \
# --profiling \
# -s ERROR_ON_UNDEFINED_SYMBOLS=1 \

# Build spc.js
emcc -v

# Try this out
emcc --clear-cache

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
