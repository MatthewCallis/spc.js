# http://wiki.superfamicom.org/snes/show/SPC+and+RSN+File+Format
class SPCDecoder extends AV.Decoder
  AV.Decoder.register('spc7', SPCDecoder)

  readChunk: ->
    
