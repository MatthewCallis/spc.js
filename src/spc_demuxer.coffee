class SPCDemuxer extends AV.Demuxer
  AV.Demuxer.register(SPCDemuxer)

  @probe: (buffer) ->
    return buffer.peekString(0, 33) is 'SNES-SPC700 Sound File Data v0.30'

  init: ->
    if @stream.available(8)
      buffer = @stream.list.first
      length = buffer.length
      # console.log 'SPC Size:',length,'(JS)'
      # console.log buffer
      # Confirmed Recieved Correctly
      # 83 78 69 83 45 83 80 67 ...
      # 53 4E 45 53 2D 53 50 43 ...
      fileBuffer = Module._malloc(length)
      Module.HEAPU8.set buffer.data, fileBuffer
      Module.ccall "SpcJsInit", "void", ["number", "number"], [fileBuffer, length]

  readChunk: =>
    # console.log 'SPCDemuxer.readChunk()'
    if not @readStart and @stream.available(33)
      if @stream.peekString(0, 33) isnt 'SNES-SPC700 Sound File Data v0.30'
        return @emit 'error', 'Invalid SPC file.'

      @readStart = true

    # Format
    @format =
      bitsPerChannel: 16
      bytesPerPacket: 4
      channelsPerFrame: 2
      floatingPoint: false
      formatID: 'spc7'
      framesPerPacket: 1
      littleEndian: false
      sampleRate: 32000

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
    @emit 'metadata', @metedata

    # Duration
    duration = parseInt(@stream.peekString(169, 3)) * 1000 # A9h, seconds
    fadeOut  = parseInt(@stream.peekString(172, 3))        # ACh, ms
    @seconds = parseInt duration + fadeOut
    @emit 'duration', @seconds

    # Send Data to Demuxer
    while @stream.available(1)
      buf = @stream.readSingleBuffer(@stream.remainingBytes())
      @emit "data", buf

    return
