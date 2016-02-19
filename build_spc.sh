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
# --profiling \
# -s ERROR_ON_UNDEFINED_SYMBOLS=1 \
# -s ALLOW_MEMORY_GROWTH=1 \
# -s NO_FILESYSTEM=1 \
# -s NO_BROWSER=1 \

# NOTE: http://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html#miscellaneous-code-size-tips
# This currently results in: "spc-aurora.js:2481 Uncaught ReferenceError: Module is not defined"
# --closure 1 \

# NOTE: http://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html#aggressive-variable-elimination
# This increased the size by 5KB. I don't believe the core has large enough functions for this to be useful to SPC.js.
# -s AGGRESSIVE_VARIABLE_ELIMINATION=1 \

# NOTE: http://kripken.github.io/emscripten-site/docs/optimizing/Optimizing-Code.html#memory-initialization
# This embeds the .mem files, so we do not need to include the .mem file seperately.
# --memory-init-file 0

# Build spc.js
emcc -v

# Try this out
emcc --clear-cache

emcc \
  -O3 \
  -s ASM_JS=1 \
  -s WARN_ON_UNDEFINED_SYMBOLS=1 \
  -s NO_EXIT_RUNTIME=1 \
  -s NO_FILESYSTEM=1 \
  -s EXPORTED_FUNCTIONS="['_SpcJsInit', '_SpcJsDestroy', '_SpcJsDecodeAudio']" \
  --memory-init-file 0 \
  -Iinclude \
  include/snes_spc/*.cpp \
  src/spc-libs.c \
  -o src/spc-libs.js

importer spc.imports.js spc.js && cp spc.js dist/spc.js;
importer spc.aurora.js spc-aurora.js && cp spc-aurora.js dist/spc-aurora.js;
