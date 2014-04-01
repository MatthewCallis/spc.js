# SPC.js

A decoder/demuxer for [Aurora.js](https://github.com/audiocogs/aurora.js) to play Super Nintendo (SNES) SPC-700 files, using the APU emulator and S-DSP emulators in [snes_spc](http://www.slack.net/~ant/libs/audio.html#snes_spc) by [Shay Green](http://www.slack.net/~ant/) aka [blargg](http://www.slack.net/~ant/libs/).

## Building

Fetch the [Aurora.js](https://github.com/audiocogs/aurora.js) dependency:

```
git submodule init
git submodule update
```

Install [importer](https://npmjs.org/package/importer) with [npm](https://www.npmjs.org/):

```
npm install importer -g
```

Build the JavaScript code with [importer](https://npmjs.org/package/importer) and [Emscripten](https://github.com/kripken/emscripten/wiki).

```
./build_spc.sh
```

## TODO

* Impliment ID666 Extended Tags.
* Clean up any memory leaks the come up.
