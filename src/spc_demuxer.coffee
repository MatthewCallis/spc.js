# http://wiki.superfamicom.org/snes/show/SPC+and+RSN+File+Format
class SPCDemuxer extends AV.Demuxer
  AV.Demuxer.register(SPCDemuxer)

  @probe: (buffer) ->
    return buffer.peekString(0, 33) is 'SNES-SPC700 Sound File Data v0.30'

  init: ->
    buffer = @stream.list.first
    length = buffer.length
    console.log buffer
    console.log length
    fileBuffer = Module._malloc(length)
    Module.HEAPU8.set buffer.data, fileBuffer
    Module.ccall "SpcJsInit", "void", [
      "number"
      "number"
    ], [
      fileBuffer
      length
    ]

  readChunk: ->
    if not @readStart and @stream.available(33)
      if @stream.peekString(0, 33) isnt 'SNES-SPC700 Sound File Data v0.30'
        return @emit 'error', 'Invalid SPC file.'

      @readStart = true

    # Format
    @format =
      formatID: 'spc7'
      sampleRate: 32000
      channelsPerFrame: 2
      bitsPerChannel: 16

    @emit 'format', @format

    # Meta Data
    @metedata =
      songTitle: @stream.peekString( 46, 32) # 2Eh
      gameTitle: @stream.peekString( 78, 32) # 4Eh
      dumper:    @stream.peekString(110, 16) # 6Eh
      comments:  @stream.peekString(126, 32) # 7Eh
      dumpDate:  @stream.peekString(158, 11) # 9Eh
      artist:    @stream.peekString(177, 32) # B1h

    # TODO: Extended ID666
    console.log @metedata
    @emit 'metedata', @metedata

    # Duration
    duration = parseInt(@stream.peekString(169, 3)) * 1000 # A9h, seconds
    fadeOut  = parseInt(@stream.peekString(172, 3)) # , ms
    console.log duration, fadeOut
    @emit 'duration', duration + fadeout

    # Data
    while stream.available(1)
      buf = stream.readSingleBuffer(stream.remainingBytes())
      @emit "data", buf

    return
