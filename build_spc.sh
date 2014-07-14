#!/bin/bash
# Post 1.13.0 manual build: Manually set LLVM_ROOT to "/usr/local/opt/emscripten/libexec/llvm/bin"
# Warning: -O2 enables the emscripten relooper which, on current release version hangs
# on arm64 iOS devices in Vorbis decoding. Use with emscripten-fastcomp for iOS arm64!
# -s ASSERTIONS=1 \
# -O2 --closure 1\
# https://github.com/kripken/emscripten/wiki/LLVM-Backend
# https://github.com/kripken/emscripten/wiki/Optimizing-Code
# EMCC_FAST_COMPILER=0
mkdir -p demo;

# Build snes-spc
# EMCC_FAST_COMPILER=1 emcc \
#   -O2 --closure 1\
#   -s ASM_JS=1 \
#   -s WARN_ON_UNDEFINED_SYMBOLS=1 \
#   -s NO_EXIT_RUNTIME=1 \
#   -s EXPORTED_FUNCTIONS="['_SpcJsInit', '_SpcJsDestroy', '_SpcJsDecodeAudio']" \
#   -Iinclude \
#   --js-library src/spc-libs-mixin.js \
#   include/snes_spc/*.cpp \
#   src/spc-libs.c \
#   -o src/spc-libs.js

importer spc.imports.js spc.js && cp spc.js demo/spc.js;
