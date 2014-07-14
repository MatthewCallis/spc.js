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
    if not @readStart and @stream.available(66048)
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

    # Check for ID666 Tag
    if @stream.list.availableBytes > (66048 + 4) && @stream.peekString(66048, 4) is 'xid6'
      # ID666 Avaliable
      id666_length = @stream.peekUInt32(66052, true)
      if @stream.list.availableBytes >= (66048 + 4 + id666_length)
        offset = 66056
        align  = 4
        # Read Sub-Chunks
        while offset < @stream.list.availableBytes
          sub_chunk_id   = @stream.peekUInt8(offset)
          sub_chunk_type = @stream.peekUInt8(offset + 1)
          if sub_chunk_type is 1
            sub_chunk_length = @stream.peekUInt16(offset + 2, true)
            sub_chunk_data   = @stream.peekString offset + 3, sub_chunk_length
            offset += (4 + sub_chunk_length - 1)
          else if sub_chunk_type is 0
            sub_chunk_data = @stream.peekUInt16(offset + 2, true)
            list = new AV.BufferList;
            list.append @stream.peekSingleBuffer(offset + 2, 2)
            sub_chunk_raw  = new AV.Stream list
            offset += 4
          else if sub_chunk_type is 4
            sub_chunk_data = @stream.peekUInt32(offset + 4, true)
            offset += 8

          offset = (offset + align - 1) & ~(align - 1) # Align on 32bit boundries

          switch sub_chunk_id
            when  1 then @metedata['songName']     = sub_chunk_data
            when  2 then @metedata['gameName']     = sub_chunk_data
            when  3 then @metedata['artistName']   = sub_chunk_data
            when  4 then @metedata['dumperName']   = sub_chunk_data
            when  5 then @metedata['dateDumped']   = sub_chunk_data
            when  6
              if sub_chunk_data is 0
                @metedata['emulatorUsed'] = 'ZSNES'
              else if sub_chunk_data is 1
                @metedata['emulatorUsed'] = 'ZSNES'
              else
                @metedata['emulatorUsed'] = "Unknown Emulator (#{sub_chunk_data})"
            when  7 then @metedata['comments']     = sub_chunk_data
            when 16 then @metedata['ost']          = sub_chunk_data # Official Soundtrack Title
            when 17 then @metedata['ostDisc']      = sub_chunk_data
            when 18
              # Upper byte is the number 0-99, lower byte is an optional ASCII character.
              @metedata['ostTrack'] = sub_chunk_raw.peekUInt8(1) + String.fromCharCode(sub_chunk_raw.peekUInt8(0))
            when 19 then @metedata['publisherName'] = sub_chunk_data
            when 20 then @metedata['copyrightYear'] = sub_chunk_data
            # Lengths are stored in ticks. A tick is 1/64000th of a second.
            # The maximum length is 383999999 ticks.The End can contain a negative value.
            when 48 then @metedata['introLength']    = sub_chunk_data # Introduction length
            when 49 then @metedata['loopLength']     = sub_chunk_data
            when 50 then @metedata['endLength']      = sub_chunk_data
            when 51 then @metedata['fadeLength']     = sub_chunk_data
            # A bit is set for each channel that's muted.
            when 52 then @metedata['mutedChannels']  = sub_chunk_data
            # Number of times to loop the loop section of the song
            when 53 then @metedata['loopCount']      = sub_chunk_data
            # Amplification value to apply to output (65536 = Normal SNES)
            when 54 then @metedata['amplification']  = sub_chunk_data
            else
              console.log 'Unknown Field:',sub_chunk_id,':',sub_chunk_type,':',sub_chunk_data


    @emit 'metadata', @metedata

    # Duration
    duration = parseInt(@stream.peekString(169, 3)) * 1000 # A9h, seconds
    fadeOut  = parseInt(@stream.peekString(172, 3))        # ACh, ms
    @seconds = parseInt duration + fadeOut
    @emit 'duration', @seconds

    # Send Data to Demuxer
    while @stream.available(1)
      buf = @stream.readSingleBuffer @stream.remainingBytes()
      @emit "data", buf

    return
