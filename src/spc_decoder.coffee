class SPCDecoder extends AV.Decoder
  AV.Decoder.register('spc7', SPCDecoder)

  init: =>
    @sample_count = 0
    # Get data byte size, allocate memory on Emscripten heap, and get pointer.
    @length = 2048 # / 4
    window.__spcAudioBuffer = Module._malloc(@length)  unless window.__spcAudioBuffer

    # Copy data to Emscripten heap (directly accessed from Module.HEAPU8).
    @data_heap = new Int16Array(Module.HEAPU8.buffer, window.__spcAudioBuffer, @length)
    Module._free(window.__spcAudioBuffer.byteOffset)  if window.__spcAudioBuffer

    return

  readChunk: =>
    unless @stream.available(66000)
      return null

    while @sample_count < ((@demuxer.seconds / 1000) * 32000 * 2)
      # Call function and get result
      @sample_count = Module.ccall "SpcJsDecodeAudio", "void", ["number", "number"], [@data_heap.byteOffset, @length]
      result = new Int16Array(@data_heap.buffer, @data_heap.byteOffset, @data_heap.length)

      return result
