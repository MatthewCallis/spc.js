(function() {
  var global;
  global = this;
  var AV;

AV = {};

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AV.Base = (function() {
  var fnTest;

  function Base() {}

  fnTest = /\b_super\b/;

  Base.extend = function(prop) {
    var Class, _super, fn, key, keys, ref;
    Class = (function(superClass) {
      extend(Class, superClass);

      function Class() {
        return Class.__super__.constructor.apply(this, arguments);
      }

      return Class;

    })(this);
    if (typeof prop === 'function') {
      keys = Object.keys(Class.prototype);
      prop.call(Class, Class);
      prop = {};
      ref = Class.prototype;
      for (key in ref) {
        fn = ref[key];
        if (indexOf.call(keys, key) < 0) {
          prop[key] = fn;
        }
      }
    }
    _super = Class.__super__;
    for (key in prop) {
      fn = prop[key];
      if (typeof fn === 'function' && fnTest.test(fn)) {
        (function(key, fn) {
          return Class.prototype[key] = function() {
            var ret, tmp;
            tmp = this._super;
            this._super = _super[key];
            ret = fn.apply(this, arguments);
            this._super = tmp;
            return ret;
          };
        })(key, fn);
      } else {
        Class.prototype[key] = fn;
      }
    }
    return Class;
  };

  return Base;

})();

AV.Buffer = (function() {
  var BlobBuilder, URL;

  function Buffer(input) {
    var ref;
    if (input instanceof Uint8Array) {
      this.data = input;
    } else if (input instanceof ArrayBuffer || Array.isArray(input) || typeof input === 'number' || AV.isNode && ((ref = global.Buffer) != null ? ref.isBuffer(input) : void 0)) {
      this.data = new Uint8Array(input);
    } else if (input.buffer instanceof ArrayBuffer) {
      this.data = new Uint8Array(input.buffer, input.byteOffset, input.length * input.BYTES_PER_ELEMENT);
    } else if (input instanceof AV.Buffer) {
      this.data = input.data;
    } else {
      throw new Error("Constructing buffer with unknown type.");
    }
    this.length = this.data.length;
    this.next = null;
    this.prev = null;
  }

  Buffer.allocate = function(size) {
    return new AV.Buffer(size);
  };

  Buffer.prototype.copy = function() {
    return new AV.Buffer(new Uint8Array(this.data));
  };

  Buffer.prototype.slice = function(position, length) {
    if (length == null) {
      length = this.length;
    }
    if (position === 0 && length >= this.length) {
      return new AV.Buffer(this.data);
    } else {
      return new AV.Buffer(this.data.subarray(position, position + length));
    }
  };

  BlobBuilder = global.BlobBuilder || global.MozBlobBuilder || global.WebKitBlobBuilder;

  URL = global.URL || global.webkitURL || global.mozURL;

  Buffer.makeBlob = function(data, type) {
    var bb;
    if (type == null) {
      type = 'application/octet-stream';
    }
    try {
      return new Blob([data], {
        type: type
      });
    } catch (_error) {}
    if (BlobBuilder != null) {
      bb = new BlobBuilder;
      bb.append(data);
      return bb.getBlob(type);
    }
    return null;
  };

  Buffer.makeBlobURL = function(data, type) {
    return URL != null ? URL.createObjectURL(this.makeBlob(data, type)) : void 0;
  };

  Buffer.revokeBlobURL = function(url) {
    return URL != null ? URL.revokeObjectURL(url) : void 0;
  };

  Buffer.prototype.toBlob = function() {
    return Buffer.makeBlob(this.data.buffer);
  };

  Buffer.prototype.toBlobURL = function() {
    return Buffer.makeBlobURL(this.data.buffer);
  };

  return Buffer;

})();

AV.BufferList = (function() {
  function BufferList() {
    this.first = null;
    this.last = null;
    this.numBuffers = 0;
    this.availableBytes = 0;
    this.availableBuffers = 0;
  }

  BufferList.prototype.copy = function() {
    var result;
    result = new AV.BufferList;
    result.first = this.first;
    result.last = this.last;
    result.numBuffers = this.numBuffers;
    result.availableBytes = this.availableBytes;
    result.availableBuffers = this.availableBuffers;
    return result;
  };

  BufferList.prototype.append = function(buffer) {
    var ref;
    buffer.prev = this.last;
    if ((ref = this.last) != null) {
      ref.next = buffer;
    }
    this.last = buffer;
    if (this.first == null) {
      this.first = buffer;
    }
    this.availableBytes += buffer.length;
    this.availableBuffers++;
    return this.numBuffers++;
  };

  BufferList.prototype.advance = function() {
    if (this.first) {
      this.availableBytes -= this.first.length;
      this.availableBuffers--;
      this.first = this.first.next;
      return this.first != null;
    }
    return false;
  };

  BufferList.prototype.rewind = function() {
    var ref;
    if (this.first && !this.first.prev) {
      return false;
    }
    this.first = ((ref = this.first) != null ? ref.prev : void 0) || this.last;
    if (this.first) {
      this.availableBytes += this.first.length;
      this.availableBuffers++;
    }
    return this.first != null;
  };

  BufferList.prototype.reset = function() {
    var results;
    results = [];
    while (this.rewind()) {
      continue;
    }
    return results;
  };

  return BufferList;

})();

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Stream = (function() {
  var buf, decodeString, float32, float64, float64Fallback, float80, int16, int32, int8, nativeEndian, uint16, uint32, uint8;

  buf = new ArrayBuffer(16);

  uint8 = new Uint8Array(buf);

  int8 = new Int8Array(buf);

  uint16 = new Uint16Array(buf);

  int16 = new Int16Array(buf);

  uint32 = new Uint32Array(buf);

  int32 = new Int32Array(buf);

  float32 = new Float32Array(buf);

  if (typeof Float64Array !== "undefined" && Float64Array !== null) {
    float64 = new Float64Array(buf);
  }

  nativeEndian = new Uint16Array(new Uint8Array([0x12, 0x34]).buffer)[0] === 0x3412;

  AV.UnderflowError = (function(superClass) {
    extend(UnderflowError, superClass);

    function UnderflowError() {
      this.name = 'AV.UnderflowError';
    }

    return UnderflowError;

  })(Error);

  function Stream(list1) {
    this.list = list1;
    this.localOffset = 0;
    this.offset = 0;
  }

  Stream.fromBuffer = function(buffer) {
    var list;
    list = new AV.BufferList;
    list.append(buffer);
    return new AV.Stream(list);
  };

  Stream.prototype.copy = function() {
    var result;
    result = new AV.Stream(this.list.copy());
    result.localOffset = this.localOffset;
    result.offset = this.offset;
    return result;
  };

  Stream.prototype.available = function(bytes) {
    return bytes <= this.list.availableBytes - this.localOffset;
  };

  Stream.prototype.remainingBytes = function() {
    return this.list.availableBytes - this.localOffset;
  };

  Stream.prototype.advance = function(bytes) {
    if (!this.available(bytes)) {
      throw new AV.UnderflowError();
    }
    this.localOffset += bytes;
    this.offset += bytes;
    while (this.list.first && this.localOffset >= this.list.first.length) {
      this.localOffset -= this.list.first.length;
      this.list.advance();
    }
    return this;
  };

  Stream.prototype.rewind = function(bytes) {
    if (bytes > this.offset) {
      throw new AV.UnderflowError();
    }
    if (!this.list.first) {
      this.list.rewind();
      this.localOffset = this.list.first.length;
    }
    this.localOffset -= bytes;
    this.offset -= bytes;
    while (this.list.first.prev && this.localOffset < 0) {
      this.list.rewind();
      this.localOffset += this.list.first.length;
    }
    return this;
  };

  Stream.prototype.seek = function(position) {
    if (position > this.offset) {
      return this.advance(position - this.offset);
    } else if (position < this.offset) {
      return this.rewind(this.offset - position);
    }
  };

  Stream.prototype.readUInt8 = function() {
    var a;
    if (!this.available(1)) {
      throw new AV.UnderflowError();
    }
    a = this.list.first.data[this.localOffset];
    this.localOffset += 1;
    this.offset += 1;
    if (this.localOffset === this.list.first.length) {
      this.localOffset = 0;
      this.list.advance();
    }
    return a;
  };

  Stream.prototype.peekUInt8 = function(offset) {
    var buffer;
    if (offset == null) {
      offset = 0;
    }
    if (!this.available(offset + 1)) {
      throw new AV.UnderflowError();
    }
    offset = this.localOffset + offset;
    buffer = this.list.first;
    while (buffer) {
      if (buffer.length > offset) {
        return buffer.data[offset];
      }
      offset -= buffer.length;
      buffer = buffer.next;
    }
    return 0;
  };

  Stream.prototype.read = function(bytes, littleEndian) {
    var i, j, k, ref, ref1;
    if (littleEndian == null) {
      littleEndian = false;
    }
    if (littleEndian === nativeEndian) {
      for (i = j = 0, ref = bytes; j < ref; i = j += 1) {
        uint8[i] = this.readUInt8();
      }
    } else {
      for (i = k = ref1 = bytes - 1; k >= 0; i = k += -1) {
        uint8[i] = this.readUInt8();
      }
    }
  };

  Stream.prototype.peek = function(bytes, offset, littleEndian) {
    var i, j, k, ref, ref1;
    if (littleEndian == null) {
      littleEndian = false;
    }
    if (littleEndian === nativeEndian) {
      for (i = j = 0, ref = bytes; j < ref; i = j += 1) {
        uint8[i] = this.peekUInt8(offset + i);
      }
    } else {
      for (i = k = 0, ref1 = bytes; k < ref1; i = k += 1) {
        uint8[bytes - i - 1] = this.peekUInt8(offset + i);
      }
    }
  };

  Stream.prototype.readInt8 = function() {
    this.read(1);
    return int8[0];
  };

  Stream.prototype.peekInt8 = function(offset) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(1, offset);
    return int8[0];
  };

  Stream.prototype.readUInt16 = function(littleEndian) {
    this.read(2, littleEndian);
    return uint16[0];
  };

  Stream.prototype.peekUInt16 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(2, offset, littleEndian);
    return uint16[0];
  };

  Stream.prototype.readInt16 = function(littleEndian) {
    this.read(2, littleEndian);
    return int16[0];
  };

  Stream.prototype.peekInt16 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(2, offset, littleEndian);
    return int16[0];
  };

  Stream.prototype.readUInt24 = function(littleEndian) {
    if (littleEndian) {
      return this.readUInt16(true) + (this.readUInt8() << 16);
    } else {
      return (this.readUInt16() << 8) + this.readUInt8();
    }
  };

  Stream.prototype.peekUInt24 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    if (littleEndian) {
      return this.peekUInt16(offset, true) + (this.peekUInt8(offset + 2) << 16);
    } else {
      return (this.peekUInt16(offset) << 8) + this.peekUInt8(offset + 2);
    }
  };

  Stream.prototype.readInt24 = function(littleEndian) {
    if (littleEndian) {
      return this.readUInt16(true) + (this.readInt8() << 16);
    } else {
      return (this.readInt16() << 8) + this.readUInt8();
    }
  };

  Stream.prototype.peekInt24 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    if (littleEndian) {
      return this.peekUInt16(offset, true) + (this.peekInt8(offset + 2) << 16);
    } else {
      return (this.peekInt16(offset) << 8) + this.peekUInt8(offset + 2);
    }
  };

  Stream.prototype.readUInt32 = function(littleEndian) {
    this.read(4, littleEndian);
    return uint32[0];
  };

  Stream.prototype.peekUInt32 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(4, offset, littleEndian);
    return uint32[0];
  };

  Stream.prototype.readInt32 = function(littleEndian) {
    this.read(4, littleEndian);
    return int32[0];
  };

  Stream.prototype.peekInt32 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(4, offset, littleEndian);
    return int32[0];
  };

  Stream.prototype.readFloat32 = function(littleEndian) {
    this.read(4, littleEndian);
    return float32[0];
  };

  Stream.prototype.peekFloat32 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(4, offset, littleEndian);
    return float32[0];
  };

  Stream.prototype.readFloat64 = function(littleEndian) {
    this.read(8, littleEndian);
    if (float64) {
      return float64[0];
    } else {
      return float64Fallback();
    }
  };

  float64Fallback = function() {
    var exp, frac, high, low, out, sign;
    low = uint32[0], high = uint32[1];
    if (!high || high === 0x80000000) {
      return 0.0;
    }
    sign = 1 - (high >>> 31) * 2;
    exp = (high >>> 20) & 0x7ff;
    frac = high & 0xfffff;
    if (exp === 0x7ff) {
      if (frac) {
        return NaN;
      }
      return sign * Infinity;
    }
    exp -= 1023;
    out = (frac | 0x100000) * Math.pow(2, exp - 20);
    out += low * Math.pow(2, exp - 52);
    return sign * out;
  };

  Stream.prototype.peekFloat64 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(8, offset, littleEndian);
    if (float64) {
      return float64[0];
    } else {
      return float64Fallback();
    }
  };

  Stream.prototype.readFloat80 = function(littleEndian) {
    this.read(10, littleEndian);
    return float80();
  };

  float80 = function() {
    var a0, a1, exp, high, low, out, sign;
    high = uint32[0], low = uint32[1];
    a0 = uint8[9];
    a1 = uint8[8];
    sign = 1 - (a0 >>> 7) * 2;
    exp = ((a0 & 0x7F) << 8) | a1;
    if (exp === 0 && low === 0 && high === 0) {
      return 0;
    }
    if (exp === 0x7fff) {
      if (low === 0 && high === 0) {
        return sign * Infinity;
      }
      return NaN;
    }
    exp -= 16383;
    out = low * Math.pow(2, exp - 31);
    out += high * Math.pow(2, exp - 63);
    return sign * out;
  };

  Stream.prototype.peekFloat80 = function(offset, littleEndian) {
    if (offset == null) {
      offset = 0;
    }
    this.peek(10, offset, littleEndian);
    return float80();
  };

  Stream.prototype.readBuffer = function(length) {
    var i, j, ref, result, to;
    result = AV.Buffer.allocate(length);
    to = result.data;
    for (i = j = 0, ref = length; j < ref; i = j += 1) {
      to[i] = this.readUInt8();
    }
    return result;
  };

  Stream.prototype.peekBuffer = function(offset, length) {
    var i, j, ref, result, to;
    if (offset == null) {
      offset = 0;
    }
    result = AV.Buffer.allocate(length);
    to = result.data;
    for (i = j = 0, ref = length; j < ref; i = j += 1) {
      to[i] = this.peekUInt8(offset + i);
    }
    return result;
  };

  Stream.prototype.readSingleBuffer = function(length) {
    var result;
    result = this.list.first.slice(this.localOffset, length);
    this.advance(result.length);
    return result;
  };

  Stream.prototype.peekSingleBuffer = function(offset, length) {
    var result;
    result = this.list.first.slice(this.localOffset + offset, length);
    return result;
  };

  Stream.prototype.readString = function(length, encoding) {
    if (encoding == null) {
      encoding = 'ascii';
    }
    return decodeString.call(this, 0, length, encoding, true);
  };

  Stream.prototype.peekString = function(offset, length, encoding) {
    if (offset == null) {
      offset = 0;
    }
    if (encoding == null) {
      encoding = 'ascii';
    }
    return decodeString.call(this, offset, length, encoding, false);
  };

  decodeString = function(offset, length, encoding, advance) {
    var b1, b2, b3, b4, bom, c, end, littleEndian, nullEnd, pt, result, w1, w2;
    encoding = encoding.toLowerCase();
    nullEnd = length === null ? 0 : -1;
    if (length == null) {
      length = Infinity;
    }
    end = offset + length;
    result = '';
    switch (encoding) {
      case 'ascii':
      case 'latin1':
        while (offset < end && (c = this.peekUInt8(offset++)) !== nullEnd) {
          result += String.fromCharCode(c);
        }
        break;
      case 'utf8':
      case 'utf-8':
        while (offset < end && (b1 = this.peekUInt8(offset++)) !== nullEnd) {
          if ((b1 & 0x80) === 0) {
            result += String.fromCharCode(b1);
          } else if ((b1 & 0xe0) === 0xc0) {
            b2 = this.peekUInt8(offset++) & 0x3f;
            result += String.fromCharCode(((b1 & 0x1f) << 6) | b2);
          } else if ((b1 & 0xf0) === 0xe0) {
            b2 = this.peekUInt8(offset++) & 0x3f;
            b3 = this.peekUInt8(offset++) & 0x3f;
            result += String.fromCharCode(((b1 & 0x0f) << 12) | (b2 << 6) | b3);
          } else if ((b1 & 0xf8) === 0xf0) {
            b2 = this.peekUInt8(offset++) & 0x3f;
            b3 = this.peekUInt8(offset++) & 0x3f;
            b4 = this.peekUInt8(offset++) & 0x3f;
            pt = (((b1 & 0x0f) << 18) | (b2 << 12) | (b3 << 6) | b4) - 0x10000;
            result += String.fromCharCode(0xd800 + (pt >> 10), 0xdc00 + (pt & 0x3ff));
          }
        }
        break;
      case 'utf16-be':
      case 'utf16be':
      case 'utf16le':
      case 'utf16-le':
      case 'utf16bom':
      case 'utf16-bom':
        switch (encoding) {
          case 'utf16be':
          case 'utf16-be':
            littleEndian = false;
            break;
          case 'utf16le':
          case 'utf16-le':
            littleEndian = true;
            break;
          case 'utf16bom':
          case 'utf16-bom':
            if (length < 2 || (bom = this.peekUInt16(offset)) === nullEnd) {
              if (advance) {
                this.advance(offset += 2);
              }
              return result;
            }
            littleEndian = bom === 0xfffe;
            offset += 2;
        }
        while (offset < end && (w1 = this.peekUInt16(offset, littleEndian)) !== nullEnd) {
          offset += 2;
          if (w1 < 0xd800 || w1 > 0xdfff) {
            result += String.fromCharCode(w1);
          } else {
            if (w1 > 0xdbff) {
              throw new Error("Invalid utf16 sequence.");
            }
            w2 = this.peekUInt16(offset, littleEndian);
            if (w2 < 0xdc00 || w2 > 0xdfff) {
              throw new Error("Invalid utf16 sequence.");
            }
            result += String.fromCharCode(w1, w2);
            offset += 2;
          }
        }
        if (w1 === nullEnd) {
          offset += 2;
        }
        break;
      default:
        throw new Error("Unknown encoding: " + encoding);
    }
    if (advance) {
      this.advance(offset);
    }
    return result;
  };

  return Stream;

})();

AV.Bitstream = (function() {
  function Bitstream(stream) {
    this.stream = stream;
    this.bitPosition = 0;
  }

  Bitstream.prototype.copy = function() {
    var result;
    result = new AV.Bitstream(this.stream.copy());
    result.bitPosition = this.bitPosition;
    return result;
  };

  Bitstream.prototype.offset = function() {
    return 8 * this.stream.offset + this.bitPosition;
  };

  Bitstream.prototype.available = function(bits) {
    return this.stream.available((bits + 8 - this.bitPosition) / 8);
  };

  Bitstream.prototype.advance = function(bits) {
    var pos;
    pos = this.bitPosition + bits;
    this.stream.advance(pos >> 3);
    return this.bitPosition = pos & 7;
  };

  Bitstream.prototype.rewind = function(bits) {
    var pos;
    pos = this.bitPosition - bits;
    this.stream.rewind(Math.abs(pos >> 3));
    return this.bitPosition = pos & 7;
  };

  Bitstream.prototype.seek = function(offset) {
    var curOffset;
    curOffset = this.offset();
    if (offset > curOffset) {
      return this.advance(offset - curOffset);
    } else if (offset < curOffset) {
      return this.rewind(curOffset - offset);
    }
  };

  Bitstream.prototype.align = function() {
    if (this.bitPosition !== 0) {
      this.bitPosition = 0;
      return this.stream.advance(1);
    }
  };

  Bitstream.prototype.read = function(bits, signed) {
    var a, a0, a1, a2, a3, a4, mBits;
    if (bits === 0) {
      return 0;
    }
    mBits = bits + this.bitPosition;
    if (mBits <= 8) {
      a = ((this.stream.peekUInt8() << this.bitPosition) & 0xff) >>> (8 - bits);
    } else if (mBits <= 16) {
      a = ((this.stream.peekUInt16() << this.bitPosition) & 0xffff) >>> (16 - bits);
    } else if (mBits <= 24) {
      a = ((this.stream.peekUInt24() << this.bitPosition) & 0xffffff) >>> (24 - bits);
    } else if (mBits <= 32) {
      a = (this.stream.peekUInt32() << this.bitPosition) >>> (32 - bits);
    } else if (mBits <= 40) {
      a0 = this.stream.peekUInt8(0) * 0x0100000000;
      a1 = this.stream.peekUInt8(1) << 24 >>> 0;
      a2 = this.stream.peekUInt8(2) << 16;
      a3 = this.stream.peekUInt8(3) << 8;
      a4 = this.stream.peekUInt8(4);
      a = a0 + a1 + a2 + a3 + a4;
      a %= Math.pow(2, 40 - this.bitPosition);
      a = Math.floor(a / Math.pow(2, 40 - this.bitPosition - bits));
    } else {
      throw new Error("Too many bits!");
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if (a / Math.pow(2, bits - 1) | 0) {
          a = (Math.pow(2, bits) - a) * -1;
        }
      }
    }
    this.advance(bits);
    return a;
  };

  Bitstream.prototype.peek = function(bits, signed) {
    var a, a0, a1, a2, a3, a4, mBits;
    if (bits === 0) {
      return 0;
    }
    mBits = bits + this.bitPosition;
    if (mBits <= 8) {
      a = ((this.stream.peekUInt8() << this.bitPosition) & 0xff) >>> (8 - bits);
    } else if (mBits <= 16) {
      a = ((this.stream.peekUInt16() << this.bitPosition) & 0xffff) >>> (16 - bits);
    } else if (mBits <= 24) {
      a = ((this.stream.peekUInt24() << this.bitPosition) & 0xffffff) >>> (24 - bits);
    } else if (mBits <= 32) {
      a = (this.stream.peekUInt32() << this.bitPosition) >>> (32 - bits);
    } else if (mBits <= 40) {
      a0 = this.stream.peekUInt8(0) * 0x0100000000;
      a1 = this.stream.peekUInt8(1) << 24 >>> 0;
      a2 = this.stream.peekUInt8(2) << 16;
      a3 = this.stream.peekUInt8(3) << 8;
      a4 = this.stream.peekUInt8(4);
      a = a0 + a1 + a2 + a3 + a4;
      a %= Math.pow(2, 40 - this.bitPosition);
      a = Math.floor(a / Math.pow(2, 40 - this.bitPosition - bits));
    } else {
      throw new Error("Too many bits!");
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if (a / Math.pow(2, bits - 1) | 0) {
          a = (Math.pow(2, bits) - a) * -1;
        }
      }
    }
    return a;
  };

  Bitstream.prototype.readLSB = function(bits, signed) {
    var a, mBits;
    if (bits === 0) {
      return 0;
    }
    if (bits > 40) {
      throw new Error("Too many bits!");
    }
    mBits = bits + this.bitPosition;
    a = (this.stream.peekUInt8(0)) >>> this.bitPosition;
    if (mBits > 8) {
      a |= (this.stream.peekUInt8(1)) << (8 - this.bitPosition);
    }
    if (mBits > 16) {
      a |= (this.stream.peekUInt8(2)) << (16 - this.bitPosition);
    }
    if (mBits > 24) {
      a += (this.stream.peekUInt8(3)) << (24 - this.bitPosition) >>> 0;
    }
    if (mBits > 32) {
      a += (this.stream.peekUInt8(4)) * Math.pow(2, 32 - this.bitPosition);
    }
    if (mBits >= 32) {
      a %= Math.pow(2, bits);
    } else {
      a &= (1 << bits) - 1;
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if (a / Math.pow(2, bits - 1) | 0) {
          a = (Math.pow(2, bits) - a) * -1;
        }
      }
    }
    this.advance(bits);
    return a;
  };

  Bitstream.prototype.peekLSB = function(bits, signed) {
    var a, mBits;
    if (bits === 0) {
      return 0;
    }
    if (bits > 40) {
      throw new Error("Too many bits!");
    }
    mBits = bits + this.bitPosition;
    a = (this.stream.peekUInt8(0)) >>> this.bitPosition;
    if (mBits > 8) {
      a |= (this.stream.peekUInt8(1)) << (8 - this.bitPosition);
    }
    if (mBits > 16) {
      a |= (this.stream.peekUInt8(2)) << (16 - this.bitPosition);
    }
    if (mBits > 24) {
      a += (this.stream.peekUInt8(3)) << (24 - this.bitPosition) >>> 0;
    }
    if (mBits > 32) {
      a += (this.stream.peekUInt8(4)) * Math.pow(2, 32 - this.bitPosition);
    }
    if (mBits >= 32) {
      a %= Math.pow(2, bits);
    } else {
      a &= (1 << bits) - 1;
    }
    if (signed) {
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = ((1 << bits >>> 0) - a) * -1;
        }
      } else {
        if (a / Math.pow(2, bits - 1) | 0) {
          a = (Math.pow(2, bits) - a) * -1;
        }
      }
    }
    return a;
  };

  return Bitstream;

})();

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty,
  slice = [].slice;

AV.EventEmitter = (function(superClass) {
  extend(EventEmitter, superClass);

  function EventEmitter() {
    return EventEmitter.__super__.constructor.apply(this, arguments);
  }

  EventEmitter.prototype.on = function(event, fn) {
    var base;
    if (this.events == null) {
      this.events = {};
    }
    if ((base = this.events)[event] == null) {
      base[event] = [];
    }
    return this.events[event].push(fn);
  };

  EventEmitter.prototype.off = function(event, fn) {
    var index, ref;
    if (!((ref = this.events) != null ? ref[event] : void 0)) {
      return;
    }
    index = this.events[event].indexOf(fn);
    if (~index) {
      return this.events[event].splice(index, 1);
    }
  };

  EventEmitter.prototype.once = function(event, fn) {
    var cb;
    return this.on(event, cb = function() {
      this.off(event, cb);
      return fn.apply(this, arguments);
    });
  };

  EventEmitter.prototype.emit = function() {
    var args, event, fn, i, len, ref, ref1;
    event = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    if (!((ref = this.events) != null ? ref[event] : void 0)) {
      return;
    }
    ref1 = this.events[event].slice();
    for (i = 0, len = ref1.length; i < len; i++) {
      fn = ref1[i];
      fn.apply(this, args);
    }
  };

  return EventEmitter;

})(AV.Base);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.BufferSource = (function(superClass) {
  var clearImmediate, setImmediate;

  extend(BufferSource, superClass);

  function BufferSource(input) {
    this.loop = bind(this.loop, this);
    if (input instanceof AV.BufferList) {
      this.list = input;
    } else {
      this.list = new AV.BufferList;
      this.list.append(new AV.Buffer(input));
    }
    this.paused = true;
  }

  setImmediate = global.setImmediate || function(fn) {
    return global.setTimeout(fn, 0);
  };

  clearImmediate = global.clearImmediate || function(timer) {
    return global.clearTimeout(timer);
  };

  BufferSource.prototype.start = function() {
    this.paused = false;
    return this._timer = setImmediate(this.loop);
  };

  BufferSource.prototype.loop = function() {
    this.emit('progress', (this.list.numBuffers - this.list.availableBuffers + 1) / this.list.numBuffers * 100 | 0);
    this.emit('data', this.list.first);
    if (this.list.advance()) {
      return setImmediate(this.loop);
    } else {
      return this.emit('end');
    }
  };

  BufferSource.prototype.pause = function() {
    clearImmediate(this._timer);
    return this.paused = true;
  };

  BufferSource.prototype.reset = function() {
    this.pause();
    return this.list.rewind();
  };

  return BufferSource;

})(AV.EventEmitter);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Demuxer = (function(superClass) {
  var formats;

  extend(Demuxer, superClass);

  Demuxer.probe = function(buffer) {
    return false;
  };

  function Demuxer(source, chunk) {
    var list, received;
    list = new AV.BufferList;
    list.append(chunk);
    this.stream = new AV.Stream(list);
    received = false;
    source.on('data', (function(_this) {
      return function(chunk) {
        received = true;
        list.append(chunk);
        return _this.readChunk(chunk);
      };
    })(this));
    source.on('error', (function(_this) {
      return function(err) {
        return _this.emit('error', err);
      };
    })(this));
    source.on('end', (function(_this) {
      return function() {
        if (!received) {
          _this.readChunk(chunk);
        }
        return _this.emit('end');
      };
    })(this));
    this.seekPoints = [];
    this.init();
  }

  Demuxer.prototype.init = function() {};

  Demuxer.prototype.readChunk = function(chunk) {};

  Demuxer.prototype.addSeekPoint = function(offset, timestamp) {
    var index;
    index = this.searchTimestamp(timestamp);
    return this.seekPoints.splice(index, 0, {
      offset: offset,
      timestamp: timestamp
    });
  };

  Demuxer.prototype.searchTimestamp = function(timestamp, backward) {
    var high, low, mid, time;
    low = 0;
    high = this.seekPoints.length;
    if (high > 0 && this.seekPoints[high - 1].timestamp < timestamp) {
      return high;
    }
    while (low < high) {
      mid = (low + high) >> 1;
      time = this.seekPoints[mid].timestamp;
      if (time < timestamp) {
        low = mid + 1;
      } else if (time >= timestamp) {
        high = mid;
      }
    }
    if (high > this.seekPoints.length) {
      high = this.seekPoints.length;
    }
    return high;
  };

  Demuxer.prototype.seek = function(timestamp) {
    var index, seekPoint;
    if (this.format && this.format.framesPerPacket > 0 && this.format.bytesPerPacket > 0) {
      seekPoint = {
        timestamp: timestamp,
        offset: this.format.bytesPerPacket * timestamp / this.format.framesPerPacket
      };
      return seekPoint;
    } else {
      index = this.searchTimestamp(timestamp);
      return this.seekPoints[index];
    }
  };

  formats = [];

  Demuxer.register = function(demuxer) {
    return formats.push(demuxer);
  };

  Demuxer.find = function(buffer) {
    var format, i, len, stream;
    stream = AV.Stream.fromBuffer(buffer);
    for (i = 0, len = formats.length; i < len; i++) {
      format = formats[i];
      if (format.probe(stream)) {
        return format;
      }
    }
    return null;
  };

  return Demuxer;

})(AV.EventEmitter);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Decoder = (function(superClass) {
  var codecs;

  extend(Decoder, superClass);

  function Decoder(demuxer, format) {
    var list;
    this.demuxer = demuxer;
    this.format = format;
    list = new AV.BufferList;
    this.stream = new AV.Stream(list);
    this.bitstream = new AV.Bitstream(this.stream);
    this.receivedFinalBuffer = false;
    this.waiting = false;
    this.demuxer.on('cookie', (function(_this) {
      return function(cookie) {
        var error;
        try {
          return _this.setCookie(cookie);
        } catch (_error) {
          error = _error;
          return _this.emit('error', error);
        }
      };
    })(this));
    this.demuxer.on('data', (function(_this) {
      return function(chunk) {
        list.append(chunk);
        if (_this.waiting) {
          return _this.decode();
        }
      };
    })(this));
    this.demuxer.on('end', (function(_this) {
      return function() {
        _this.receivedFinalBuffer = true;
        if (_this.waiting) {
          return _this.decode();
        }
      };
    })(this));
    this.init();
  }

  Decoder.prototype.init = function() {};

  Decoder.prototype.setCookie = function(cookie) {};

  Decoder.prototype.readChunk = function() {};

  Decoder.prototype.decode = function() {
    var error, offset, packet;
    this.waiting = false;
    offset = this.bitstream.offset();
    try {
      packet = this.readChunk();
    } catch (_error) {
      error = _error;
      if (!(error instanceof AV.UnderflowError)) {
        this.emit('error', error);
        return false;
      }
    }
    if (packet) {
      this.emit('data', packet);
      return true;
    } else if (!this.receivedFinalBuffer) {
      this.bitstream.seek(offset);
      this.waiting = true;
    } else {
      this.emit('end');
    }
    return false;
  };

  Decoder.prototype.seek = function(timestamp) {
    var seekPoint;
    seekPoint = this.demuxer.seek(timestamp);
    this.stream.seek(seekPoint.offset);
    return seekPoint.timestamp;
  };

  codecs = {};

  Decoder.register = function(id, decoder) {
    return codecs[id] = decoder;
  };

  Decoder.find = function(id) {
    return codecs[id] || null;
  };

  return Decoder;

})(AV.EventEmitter);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Queue = (function(superClass) {
  extend(Queue, superClass);

  function Queue(asset) {
    this.asset = asset;
    this.write = bind(this.write, this);
    this.readyMark = 64;
    this.finished = false;
    this.buffering = true;
    this.ended = false;
    this.buffers = [];
    this.asset.on('data', this.write);
    this.asset.on('end', (function(_this) {
      return function() {
        return _this.ended = true;
      };
    })(this));
    this.asset.decodePacket();
  }

  Queue.prototype.write = function(buffer) {
    if (buffer) {
      this.buffers.push(buffer);
    }
    if (this.buffering) {
      if (this.buffers.length >= this.readyMark || this.ended) {
        this.buffering = false;
        return this.emit('ready');
      } else {
        return this.asset.decodePacket();
      }
    }
  };

  Queue.prototype.read = function() {
    if (this.buffers.length === 0) {
      return null;
    }
    this.asset.decodePacket();
    return this.buffers.shift();
  };

  Queue.prototype.reset = function() {
    this.buffers.length = 0;
    this.buffering = true;
    return this.asset.decodePacket();
  };

  return Queue;

})(AV.EventEmitter);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.AudioDevice = (function(superClass) {
  var devices;

  extend(AudioDevice, superClass);

  function AudioDevice(sampleRate1, channels1) {
    this.sampleRate = sampleRate1;
    this.channels = channels1;
    this.updateTime = bind(this.updateTime, this);
    this.playing = false;
    this.currentTime = 0;
    this._lastTime = 0;
  }

  AudioDevice.prototype.start = function() {
    if (this.playing) {
      return;
    }
    this.playing = true;
    if (this.device == null) {
      this.device = AV.AudioDevice.create(this.sampleRate, this.channels);
    }
    if (!this.device) {
      throw new Error("No supported audio device found.");
    }
    this._lastTime = this.device.getDeviceTime();
    this._timer = setInterval(this.updateTime, 200);
    return this.device.on('refill', this.refill = (function(_this) {
      return function(buffer) {
        return _this.emit('refill', buffer);
      };
    })(this));
  };

  AudioDevice.prototype.stop = function() {
    if (!this.playing) {
      return;
    }
    this.playing = false;
    this.device.off('refill', this.refill);
    return clearInterval(this._timer);
  };

  AudioDevice.prototype.destroy = function() {
    var ref;
    this.stop();
    return (ref = this.device) != null ? ref.destroy() : void 0;
  };

  AudioDevice.prototype.seek = function(currentTime) {
    this.currentTime = currentTime;
    if (this.playing) {
      this._lastTime = this.device.getDeviceTime();
    }
    return this.emit('timeUpdate', this.currentTime);
  };

  AudioDevice.prototype.updateTime = function() {
    var time;
    time = this.device.getDeviceTime();
    this.currentTime += (time - this._lastTime) / this.device.sampleRate * 1000 | 0;
    this._lastTime = time;
    return this.emit('timeUpdate', this.currentTime);
  };

  devices = [];

  AudioDevice.register = function(device) {
    return devices.push(device);
  };

  AudioDevice.create = function(sampleRate, channels) {
    var device, i, len;
    for (i = 0, len = devices.length; i < len; i++) {
      device = devices[i];
      if (device.supported) {
        return new device(sampleRate, channels);
      }
    }
    return null;
  };

  return AudioDevice;

})(AV.EventEmitter);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Asset = (function(superClass) {
  extend(Asset, superClass);

  function Asset(source) {
    this.source = source;
    this._decode = bind(this._decode, this);
    this.findDecoder = bind(this.findDecoder, this);
    this.probe = bind(this.probe, this);
    this.buffered = 0;
    this.duration = null;
    this.format = null;
    this.metadata = null;
    this.active = false;
    this.demuxer = null;
    this.decoder = null;
    this.source.once('data', this.probe);
    this.source.on('error', (function(_this) {
      return function(err) {
        _this.emit('error', err);
        return _this.stop();
      };
    })(this));
    this.source.on('progress', (function(_this) {
      return function(buffered) {
        _this.buffered = buffered;
        return _this.emit('buffer', _this.buffered);
      };
    })(this));
  }

  Asset.fromURL = function(url) {
    return new AV.Asset(new AV.HTTPSource(url));
  };

  Asset.fromFile = function(file) {
    return new AV.Asset(new AV.FileSource(file));
  };

  Asset.fromBuffer = function(buffer) {
    return new AV.Asset(new AV.BufferSource(buffer));
  };

  Asset.prototype.start = function(decode) {
    if (this.active) {
      return;
    }
    if (decode != null) {
      this.shouldDecode = decode;
    }
    if (this.shouldDecode == null) {
      this.shouldDecode = true;
    }
    this.active = true;
    this.source.start();
    if (this.decoder && this.shouldDecode) {
      return this._decode();
    }
  };

  Asset.prototype.stop = function() {
    if (!this.active) {
      return;
    }
    this.active = false;
    return this.source.pause();
  };

  Asset.prototype.get = function(event, callback) {
    if (event !== 'format' && event !== 'duration' && event !== 'metadata') {
      return;
    }
    if (this[event] != null) {
      return callback(this[event]);
    } else {
      this.once(event, (function(_this) {
        return function(value) {
          _this.stop();
          return callback(value);
        };
      })(this));
      return this.start();
    }
  };

  Asset.prototype.decodePacket = function() {
    return this.decoder.decode();
  };

  Asset.prototype.decodeToBuffer = function(callback) {
    var chunks, dataHandler, length;
    length = 0;
    chunks = [];
    this.on('data', dataHandler = function(chunk) {
      length += chunk.length;
      return chunks.push(chunk);
    });
    this.once('end', function() {
      var buf, chunk, j, len, offset;
      buf = new Float32Array(length);
      offset = 0;
      for (j = 0, len = chunks.length; j < len; j++) {
        chunk = chunks[j];
        buf.set(chunk, offset);
        offset += chunk.length;
      }
      this.off('data', dataHandler);
      return callback(buf);
    });
    return this.start();
  };

  Asset.prototype.probe = function(chunk) {
    var demuxer;
    if (!this.active) {
      return;
    }
    demuxer = AV.Demuxer.find(chunk);
    if (!demuxer) {
      return this.emit('error', 'A demuxer for this container was not found.');
    }
    this.demuxer = new demuxer(this.source, chunk);
    this.demuxer.on('format', this.findDecoder);
    this.demuxer.on('duration', (function(_this) {
      return function(duration) {
        _this.duration = duration;
        return _this.emit('duration', _this.duration);
      };
    })(this));
    this.demuxer.on('metadata', (function(_this) {
      return function(metadata) {
        _this.metadata = metadata;
        return _this.emit('metadata', _this.metadata);
      };
    })(this));
    return this.demuxer.on('error', (function(_this) {
      return function(err) {
        _this.emit('error', err);
        return _this.stop();
      };
    })(this));
  };

  Asset.prototype.findDecoder = function(format) {
    var decoder, div;
    this.format = format;
    if (!this.active) {
      return;
    }
    this.emit('format', this.format);
    decoder = AV.Decoder.find(this.format.formatID);
    if (!decoder) {
      return this.emit('error', "A decoder for " + this.format.formatID + " was not found.");
    }
    this.decoder = new decoder(this.demuxer, this.format);
    if (this.format.floatingPoint) {
      this.decoder.on('data', (function(_this) {
        return function(buffer) {
          return _this.emit('data', buffer);
        };
      })(this));
    } else {
      div = Math.pow(2, this.format.bitsPerChannel - 1);
      this.decoder.on('data', (function(_this) {
        return function(buffer) {
          var buf, i, j, len, sample;
          buf = new Float32Array(buffer.length);
          for (i = j = 0, len = buffer.length; j < len; i = ++j) {
            sample = buffer[i];
            buf[i] = sample / div;
          }
          return _this.emit('data', buf);
        };
      })(this));
    }
    this.decoder.on('error', (function(_this) {
      return function(err) {
        _this.emit('error', err);
        return _this.stop();
      };
    })(this));
    this.decoder.on('end', (function(_this) {
      return function() {
        return _this.emit('end');
      };
    })(this));
    this.emit('decodeStart');
    if (this.shouldDecode) {
      return this._decode();
    }
  };

  Asset.prototype._decode = function() {
    while (this.decoder.decode() && this.active) {
      continue;
    }
    if (this.active) {
      return this.decoder.once('data', this._decode);
    }
  };

  return Asset;

})(AV.EventEmitter);

var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.Player = (function(superClass) {
  extend(Player, superClass);

  function Player(asset) {
    this.asset = asset;
    this.startPlaying = bind(this.startPlaying, this);
    this.playing = false;
    this.buffered = 0;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 100;
    this.pan = 0;
    this.metadata = {};
    this.filters = [new AV.VolumeFilter(this, 'volume'), new AV.BalanceFilter(this, 'pan')];
    this.asset.on('buffer', (function(_this) {
      return function(buffered) {
        _this.buffered = buffered;
        return _this.emit('buffer', _this.buffered);
      };
    })(this));
    this.asset.on('decodeStart', (function(_this) {
      return function() {
        _this.queue = new AV.Queue(_this.asset);
        return _this.queue.once('ready', _this.startPlaying);
      };
    })(this));
    this.asset.on('format', (function(_this) {
      return function(format) {
        _this.format = format;
        return _this.emit('format', _this.format);
      };
    })(this));
    this.asset.on('metadata', (function(_this) {
      return function(metadata) {
        _this.metadata = metadata;
        return _this.emit('metadata', _this.metadata);
      };
    })(this));
    this.asset.on('duration', (function(_this) {
      return function(duration) {
        _this.duration = duration;
        return _this.emit('duration', _this.duration);
      };
    })(this));
    this.asset.on('error', (function(_this) {
      return function(error) {
        return _this.emit('error', error);
      };
    })(this));
  }

  Player.fromURL = function(url) {
    return new AV.Player(AV.Asset.fromURL(url));
  };

  Player.fromFile = function(file) {
    return new AV.Player(AV.Asset.fromFile(file));
  };

  Player.fromBuffer = function(buffer) {
    return new AV.Player(AV.Asset.fromBuffer(buffer));
  };

  Player.prototype.preload = function() {
    if (!this.asset) {
      return;
    }
    this.startedPreloading = true;
    return this.asset.start(false);
  };

  Player.prototype.play = function() {
    var ref;
    if (this.playing) {
      return;
    }
    if (!this.startedPreloading) {
      this.preload();
    }
    this.playing = true;
    return (ref = this.device) != null ? ref.start() : void 0;
  };

  Player.prototype.pause = function() {
    var ref;
    if (!this.playing) {
      return;
    }
    this.playing = false;
    return (ref = this.device) != null ? ref.stop() : void 0;
  };

  Player.prototype.togglePlayback = function() {
    if (this.playing) {
      return this.pause();
    } else {
      return this.play();
    }
  };

  Player.prototype.stop = function() {
    var ref;
    this.pause();
    this.asset.stop();
    return (ref = this.device) != null ? ref.destroy() : void 0;
  };

  Player.prototype.seek = function(timestamp) {
    var ref;
    if ((ref = this.device) != null) {
      ref.stop();
    }
    this.queue.once('ready', (function(_this) {
      return function() {
        var ref1, ref2;
        if ((ref1 = _this.device) != null) {
          ref1.seek(_this.currentTime);
        }
        if (_this.playing) {
          return (ref2 = _this.device) != null ? ref2.start() : void 0;
        }
      };
    })(this));
    timestamp = (timestamp / 1000) * this.format.sampleRate;
    timestamp = this.asset.decoder.seek(timestamp);
    this.currentTime = timestamp / this.format.sampleRate * 1000 | 0;
    this.queue.reset();
    return this.currentTime;
  };

  Player.prototype.startPlaying = function() {
    var frame, frameOffset;
    frame = this.queue.read();
    frameOffset = 0;
    this.device = new AV.AudioDevice(this.format.sampleRate, this.format.channelsPerFrame);
    this.device.on('timeUpdate', (function(_this) {
      return function(currentTime) {
        _this.currentTime = currentTime;
        return _this.emit('progress', _this.currentTime);
      };
    })(this));
    this.refill = (function(_this) {
      return function(buffer) {
        var bufferOffset, filter, i, j, k, len, max, ref, ref1;
        if (!_this.playing) {
          return;
        }
        if (!frame) {
          frame = _this.queue.read();
          frameOffset = 0;
        }
        bufferOffset = 0;
        while (frame && bufferOffset < buffer.length) {
          max = Math.min(frame.length - frameOffset, buffer.length - bufferOffset);
          for (i = j = 0, ref = max; j < ref; i = j += 1) {
            buffer[bufferOffset++] = frame[frameOffset++];
          }
          if (frameOffset === frame.length) {
            frame = _this.queue.read();
            frameOffset = 0;
          }
        }
        ref1 = _this.filters;
        for (k = 0, len = ref1.length; k < len; k++) {
          filter = ref1[k];
          filter.process(buffer);
        }
        if (!frame) {
          if (_this.queue.ended) {
            _this.currentTime = _this.duration;
            _this.emit('progress', _this.currentTime);
            _this.emit('end');
            _this.stop();
          } else {
            _this.device.stop();
          }
        }
      };
    })(this);
    this.device.on('refill', this.refill);
    if (this.playing) {
      this.device.start();
    }
    return this.emit('ready');
  };

  return Player;

})(AV.EventEmitter);

AV.Filter = (function() {
  function Filter(context, key) {
    if (context && key) {
      Object.defineProperty(this, 'value', {
        get: function() {
          return context[key];
        }
      });
    }
  }

  Filter.prototype.process = function(buffer) {};

  return Filter;

})();

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.VolumeFilter = (function(superClass) {
  extend(VolumeFilter, superClass);

  function VolumeFilter() {
    return VolumeFilter.__super__.constructor.apply(this, arguments);
  }

  VolumeFilter.prototype.process = function(buffer) {
    var i, j, ref, vol;
    if (this.value >= 100) {
      return;
    }
    vol = Math.max(0, Math.min(100, this.value)) / 100;
    for (i = j = 0, ref = buffer.length; j < ref; i = j += 1) {
      buffer[i] *= vol;
    }
  };

  return VolumeFilter;

})(AV.Filter);

var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.BalanceFilter = (function(superClass) {
  extend(BalanceFilter, superClass);

  function BalanceFilter() {
    return BalanceFilter.__super__.constructor.apply(this, arguments);
  }

  BalanceFilter.prototype.process = function(buffer) {
    var i, j, pan, ref;
    if (this.value === 0) {
      return;
    }
    pan = Math.max(-50, Math.min(50, this.value));
    for (i = j = 0, ref = buffer.length; j < ref; i = j += 2) {
      buffer[i] *= Math.min(1, (50 - pan) / 50);
      buffer[i + 1] *= Math.min(1, (50 + pan) / 50);
    }
  };

  return BalanceFilter;

})(AV.Filter);
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.HTTPSource = (function(superClass) {
  extend(HTTPSource, superClass);

  function HTTPSource(url) {
    this.url = url;
    this.chunkSize = 1 << 20;
    this.inflight = false;
    this.reset();
  }

  HTTPSource.prototype.start = function() {
    if (this.length) {
      if (!this.inflight) {
        return this.loop();
      }
    }
    this.inflight = true;
    this.xhr = new XMLHttpRequest();
    this.xhr.onload = (function(_this) {
      return function(event) {
        _this.length = parseInt(_this.xhr.getResponseHeader("Content-Length"));
        _this.inflight = false;
        return _this.loop();
      };
    })(this);
    this.xhr.onerror = (function(_this) {
      return function(err) {
        _this.pause();
        return _this.emit('error', err);
      };
    })(this);
    this.xhr.onabort = (function(_this) {
      return function(event) {
        return _this.inflight = false;
      };
    })(this);
    this.xhr.open("HEAD", this.url, true);
    return this.xhr.send(null);
  };

  HTTPSource.prototype.loop = function() {
    var endPos;
    if (this.inflight || !this.length) {
      return this.emit('error', 'Something is wrong in HTTPSource.loop');
    }
    this.inflight = true;
    this.xhr = new XMLHttpRequest();
    this.xhr.onload = (function(_this) {
      return function(event) {
        var buf, buffer, i, j, ref, txt;
        if (_this.xhr.response) {
          buf = new Uint8Array(_this.xhr.response);
        } else {
          txt = _this.xhr.responseText;
          buf = new Uint8Array(txt.length);
          for (i = j = 0, ref = txt.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            buf[i] = txt.charCodeAt(i) & 0xff;
          }
        }
        buffer = new AV.Buffer(buf);
        _this.offset += buffer.length;
        _this.emit('data', buffer);
        if (_this.offset >= _this.length) {
          _this.emit('end');
        }
        _this.inflight = false;
        if (!(_this.offset >= _this.length)) {
          return _this.loop();
        }
      };
    })(this);
    this.xhr.onprogress = (function(_this) {
      return function(event) {
        return _this.emit('progress', (_this.offset + event.loaded) / _this.length * 100);
      };
    })(this);
    this.xhr.onerror = (function(_this) {
      return function(err) {
        _this.emit('error', err);
        return _this.pause();
      };
    })(this);
    this.xhr.onabort = (function(_this) {
      return function(event) {
        return _this.inflight = false;
      };
    })(this);
    this.xhr.open("GET", this.url, true);
    this.xhr.responseType = "arraybuffer";
    endPos = Math.min(this.offset + this.chunkSize, this.length);
    this.xhr.setRequestHeader("Range", "bytes=" + this.offset + "-" + endPos);
    this.xhr.overrideMimeType('text/plain; charset=x-user-defined');
    return this.xhr.send(null);
  };

  HTTPSource.prototype.pause = function() {
    var ref;
    this.inflight = false;
    return (ref = this.xhr) != null ? ref.abort() : void 0;
  };

  HTTPSource.prototype.reset = function() {
    this.pause();
    return this.offset = 0;
  };

  return HTTPSource;

})(AV.EventEmitter);
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AV.FileSource = (function(superClass) {
  extend(FileSource, superClass);

  function FileSource(file) {
    this.file = file;
    if (typeof FileReader === "undefined" || FileReader === null) {
      return this.emit('error', 'This browser does not have FileReader support.');
    }
    this.offset = 0;
    this.length = this.file.size;
    this.chunkSize = 1 << 20;
    this.file[this.slice = 'slice'] || this.file[this.slice = 'webkitSlice'] || this.file[this.slice = 'mozSlice'];
  }

  FileSource.prototype.start = function() {
    if (this.reader) {
      if (!this.active) {
        return this.loop();
      }
    }
    this.reader = new FileReader;
    this.active = true;
    this.reader.onload = (function(_this) {
      return function(e) {
        var buf;
        buf = new AV.Buffer(new Uint8Array(e.target.result));
        _this.offset += buf.length;
        _this.emit('data', buf);
        _this.active = false;
        if (_this.offset < _this.length) {
          return _this.loop();
        }
      };
    })(this);
    this.reader.onloadend = (function(_this) {
      return function() {
        if (_this.offset === _this.length) {
          _this.emit('end');
          return _this.reader = null;
        }
      };
    })(this);
    this.reader.onerror = (function(_this) {
      return function(e) {
        return _this.emit('error', e);
      };
    })(this);
    this.reader.onprogress = (function(_this) {
      return function(e) {
        return _this.emit('progress', (_this.offset + e.loaded) / _this.length * 100);
      };
    })(this);
    return this.loop();
  };

  FileSource.prototype.loop = function() {
    var blob, endPos;
    this.active = true;
    endPos = Math.min(this.offset + this.chunkSize, this.length);
    blob = this.file[this.slice](this.offset, endPos);
    return this.reader.readAsArrayBuffer(blob);
  };

  FileSource.prototype.pause = function() {
    var ref;
    this.active = false;
    return (ref = this.reader) != null ? ref.abort() : void 0;
  };

  FileSource.prototype.reset = function() {
    this.pause();
    return this.offset = 0;
  };

  return FileSource;

})(AV.EventEmitter);
  /*
 * This resampler is from XAudioJS: https://github.com/grantgalitz/XAudioJS
 * Planned to be replaced with src.js, eventually: https://github.com/jussi-kalliokoski/src.js
 */

//JavaScript Audio Resampler (c) 2011 - Grant Galitz
function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
	this.fromSampleRate = fromSampleRate;
	this.toSampleRate = toSampleRate;
	this.channels = channels | 0;
	this.outputBufferSize = outputBufferSize;
	this.noReturn = !!noReturn;
	this.initialize();
}

Resampler.prototype.initialize = function () {
	//Perform some checks:
	if (this.fromSampleRate > 0 && this.toSampleRate > 0 && this.channels > 0) {
		if (this.fromSampleRate == this.toSampleRate) {
			//Setup a resampler bypass:
			this.resampler = this.bypassResampler;		//Resampler just returns what was passed through.
			this.ratioWeight = 1;
		}
		else {
			if (this.fromSampleRate < this.toSampleRate) {
				/*
					Use generic linear interpolation if upsampling,
					as linear interpolation produces a gradient that we want
					and works fine with two input sample points per output in this case.
				*/
				this.compileLinearInterpolationFunction();
				this.lastWeight = 1;
			}
			else {
				/*
					Custom resampler I wrote that doesn't skip samples
					like standard linear interpolation in high downsampling.
					This is more accurate than linear interpolation on downsampling.
				*/
				this.compileMultiTapFunction();
				this.tailExists = false;
				this.lastWeight = 0;
			}
			this.ratioWeight = this.fromSampleRate / this.toSampleRate;
			this.initializeBuffers();
		}
	}
	else {
		throw(new Error("Invalid settings specified for the resampler."));
	}
};

Resampler.prototype.compileLinearInterpolationFunction = function () {
	var toCompile = "var bufferLength = buffer.length;\
	var outLength = this.outputBufferSize;\
	if ((bufferLength % " + this.channels + ") == 0) {\
		if (bufferLength > 0) {\
			var ratioWeight = this.ratioWeight;\
			var weight = this.lastWeight;\
			var firstWeight = 0;\
			var secondWeight = 0;\
			var sourceOffset = 0;\
			var outputOffset = 0;\
			var outputBuffer = this.outputBuffer;\
			for (; weight < 1; weight += ratioWeight) {\
				secondWeight = weight % 1;\
				firstWeight = 1 - secondWeight;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = (this.lastOutput[" + channel + "] * firstWeight) + (buffer[" + channel + "] * secondWeight);";
	}
	toCompile += "}\
			weight -= 1;\
			for (bufferLength -= " + this.channels + ", sourceOffset = Math.floor(weight) * " + this.channels + "; outputOffset < outLength && sourceOffset < bufferLength;) {\
				secondWeight = weight % 1;\
				firstWeight = 1 - secondWeight;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = (buffer[sourceOffset" + ((channel > 0) ? (" + " + channel) : "") + "] * firstWeight) + (buffer[sourceOffset + " + (this.channels + channel) + "] * secondWeight);";
	}
	toCompile += "weight += ratioWeight;\
				sourceOffset = Math.floor(weight) * " + this.channels + ";\
			}";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "this.lastOutput[" + channel + "] = buffer[sourceOffset++];";
	}
	toCompile += "this.lastWeight = weight % 1;\
			return this.bufferSlice(outputOffset);\
		}\
		else {\
			return (this.noReturn) ? 0 : [];\
		}\
	}\
	else {\
		throw(new Error(\"Buffer was of incorrect sample length.\"));\
	}";
	this.resampler = Function("buffer", toCompile);
};

Resampler.prototype.compileMultiTapFunction = function () {
	var toCompile = "var bufferLength = buffer.length;\
	var outLength = this.outputBufferSize;\
	if ((bufferLength % " + this.channels + ") == 0) {\
		if (bufferLength > 0) {\
			var ratioWeight = this.ratioWeight;\
			var weight = 0;";
	for (var channel = 0; channel < this.channels; ++channel) {
		toCompile += "var output" + channel + " = 0;"
	}
	toCompile += "var actualPosition = 0;\
			var amountToNext = 0;\
			var alreadyProcessedTail = !this.tailExists;\
			this.tailExists = false;\
			var outputBuffer = this.outputBuffer;\
			var outputOffset = 0;\
			var currentPosition = 0;\
			do {\
				if (alreadyProcessedTail) {\
					weight = ratioWeight;";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " = 0;"
	}
	toCompile += "}\
				else {\
					weight = this.lastWeight;";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " = this.lastOutput[" + channel + "];"
	}
	toCompile += "alreadyProcessedTail = true;\
				}\
				while (weight > 0 && actualPosition < bufferLength) {\
					amountToNext = 1 + actualPosition - currentPosition;\
					if (weight >= amountToNext) {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " += buffer[actualPosition++] * amountToNext;"
	}
	toCompile += "currentPosition = actualPosition;\
						weight -= amountToNext;\
					}\
					else {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "output" + channel + " += buffer[actualPosition" + ((channel > 0) ? (" + " + channel) : "") + "] * weight;"
	}
	toCompile += "currentPosition += weight;\
						weight = 0;\
						break;\
					}\
				}\
				if (weight == 0) {";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "outputBuffer[outputOffset++] = output" + channel + " / ratioWeight;"
	}
	toCompile += "}\
				else {\
					this.lastWeight = weight;";
	for (channel = 0; channel < this.channels; ++channel) {
		toCompile += "this.lastOutput[" + channel + "] = output" + channel + ";"
	}
	toCompile += "this.tailExists = true;\
					break;\
				}\
			} while (actualPosition < bufferLength && outputOffset < outLength);\
			return this.bufferSlice(outputOffset);\
		}\
		else {\
			return (this.noReturn) ? 0 : [];\
		}\
	}\
	else {\
		throw(new Error(\"Buffer was of incorrect sample length.\"));\
	}";
	this.resampler = Function("buffer", toCompile);
};

Resampler.prototype.bypassResampler = function (buffer) {
	if (this.noReturn) {
		//Set the buffer passed as our own, as we don't need to resample it:
		this.outputBuffer = buffer;
		return buffer.length;
	}
	else {
		//Just return the buffer passsed:
		return buffer;
	}
};

Resampler.prototype.bufferSlice = function (sliceAmount) {
	if (this.noReturn) {
		//If we're going to access the properties directly from this object:
		return sliceAmount;
	}
	else {
		//Typed array and normal array buffer section referencing:
		try {
			return this.outputBuffer.subarray(0, sliceAmount);
		}
		catch (error) {
			try {
				//Regular array pass:
				this.outputBuffer.length = sliceAmount;
				return this.outputBuffer;
			}
			catch (error) {
				//Nightly Firefox 4 used to have the subarray function named as slice:
				return this.outputBuffer.slice(0, sliceAmount);
			}
		}
	}
};

Resampler.prototype.initializeBuffers = function () {
	//Initialize the internal buffer:
	try {
		this.outputBuffer = new Float32Array(this.outputBufferSize);
		this.lastOutput = new Float32Array(this.channels);
	}
	catch (error) {
		this.outputBuffer = [];
		this.lastOutput = [];
	}
};var WebAudioDevice,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

WebAudioDevice = (function(superClass) {
  var AudioContext, createProcessor, sharedContext;

  extend(WebAudioDevice, superClass);

  AV.AudioDevice.register(WebAudioDevice);

  AudioContext = global.AudioContext || global.webkitAudioContext;

  WebAudioDevice.supported = AudioContext && (typeof AudioContext.prototype[createProcessor = 'createScriptProcessor'] === 'function' || typeof AudioContext.prototype[createProcessor = 'createJavaScriptNode'] === 'function');

  sharedContext = null;

  function WebAudioDevice(sampleRate, channels1) {
    this.sampleRate = sampleRate;
    this.channels = channels1;
    this.refill = bind(this.refill, this);
    this.context = sharedContext != null ? sharedContext : sharedContext = new AudioContext;
    this.deviceSampleRate = this.context.sampleRate;
    this.bufferSize = Math.ceil(4096 / (this.deviceSampleRate / this.sampleRate) * this.channels);
    this.bufferSize += this.bufferSize % this.channels;
    if (this.deviceSampleRate !== this.sampleRate) {
      this.resampler = new Resampler(this.sampleRate, this.deviceSampleRate, this.channels, 4096 * this.channels);
    }
    this.node = this.context[createProcessor](4096, this.channels, this.channels);
    this.node.onaudioprocess = this.refill;
    this.node.connect(this.context.destination);
  }

  WebAudioDevice.prototype.refill = function(event) {
    var channelCount, channels, data, i, j, k, l, n, outputBuffer, ref, ref1, ref2;
    outputBuffer = event.outputBuffer;
    channelCount = outputBuffer.numberOfChannels;
    channels = new Array(channelCount);
    for (i = j = 0, ref = channelCount; j < ref; i = j += 1) {
      channels[i] = outputBuffer.getChannelData(i);
    }
    data = new Float32Array(this.bufferSize);
    this.emit('refill', data);
    if (this.resampler) {
      data = this.resampler.resampler(data);
    }
    for (i = k = 0, ref1 = outputBuffer.length; k < ref1; i = k += 1) {
      for (n = l = 0, ref2 = channelCount; l < ref2; n = l += 1) {
        channels[n][i] = data[i * channelCount + n];
      }
    }
  };

  WebAudioDevice.prototype.destroy = function() {
    return this.node.disconnect(0);
  };

  WebAudioDevice.prototype.getDeviceTime = function() {
    return this.context.currentTime * this.sampleRate;
  };

  return WebAudioDevice;

})(AV.EventEmitter);
  return global.AV = AV;
})();
var SPCDemuxer,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SPCDemuxer = (function(superClass) {
  extend(SPCDemuxer, superClass);

  function SPCDemuxer() {
    this.readChunk = bind(this.readChunk, this);
    return SPCDemuxer.__super__.constructor.apply(this, arguments);
  }

  AV.Demuxer.register(SPCDemuxer);

  SPCDemuxer.probe = function(buffer) {
    if (buffer.peekString(0, 33) !== 'SNES-SPC700 Sound File Data v0.30') {
      console.error('Not an SPC file?', buffer.peekString(0, 33));
    }
    return buffer.peekString(0, 33) === 'SNES-SPC700 Sound File Data v0.30';
  };

  SPCDemuxer.prototype.init = function() {
    var buffer, fileBuffer, length;
    if (this.stream.available(8)) {
      buffer = this.stream.list.first;
      length = buffer.length;
      delete fileBuffer;
      fileBuffer = Module._malloc(length);
      Module.HEAPU8.set(buffer.data, fileBuffer);
      return Module.ccall("SpcJsInit", "void", ["number", "number"], [fileBuffer, length]);
    }
  };

  SPCDemuxer.prototype.cleanString = function(string) {
    if (!string) {
      return null;
    }
    return String(string).trim().replace(/\0/g, '');
  };

  SPCDemuxer.prototype.readChunk = function() {
    var align, buf, bytes_readin, duration, fadeOut, id666_length, list, offset, offset_old, sub_chunk_data, sub_chunk_id, sub_chunk_length, sub_chunk_raw, sub_chunk_type;
    if (!this.readStart && this.stream.available(66048)) {
      if (this.stream.peekString(0, 33) !== 'SNES-SPC700 Sound File Data v0.30') {
        return this.emit('error', 'Invalid SPC file.');
      }
      this.readStart = true;
    }
    this.format = {
      bitsPerChannel: 16,
      bytesPerPacket: 4,
      channelsPerFrame: 2,
      floatingPoint: false,
      formatID: 'spc7',
      framesPerPacket: 1,
      littleEndian: false,
      sampleRate: 32000
    };
    this.emit('format', this.format);
    this.metadata = {
      songTitle: this.cleanString(this.stream.peekString(46, 32)),
      gameTitle: this.cleanString(this.stream.peekString(78, 32)),
      dumper: this.cleanString(this.stream.peekString(110, 16)),
      comments: this.cleanString(this.stream.peekString(126, 32)),
      dumpDate: this.cleanString(this.stream.peekString(158, 11)),
      artist: this.cleanString(this.stream.peekString(177, 32))
    };
    if (this.stream.list.availableBytes > (66048 + 4) && this.stream.peekString(66048, 4) === 'xid6') {
      id666_length = this.stream.peekUInt32(66052, true);
      bytes_readin = 4;
      if (this.stream.list.availableBytes >= (66048 + 4 + id666_length) && (bytes_readin < id666_length)) {
        offset = 66056;
        align = 4;
        while (offset < this.stream.list.availableBytes && (bytes_readin < id666_length)) {
          sub_chunk_id = this.stream.peekUInt8(offset);
          sub_chunk_type = this.stream.peekUInt8(offset + 1);
          bytes_readin += 2;
          if (sub_chunk_type === 1) {
            sub_chunk_length = this.stream.peekUInt16(offset + 2, true);
            sub_chunk_data = this.stream.peekString(offset + 3, sub_chunk_length);
            offset += 4 + sub_chunk_length - 1;
            bytes_readin += 2 + sub_chunk_length;
          } else if (sub_chunk_type === 0) {
            sub_chunk_data = this.stream.peekUInt16(offset + 2, true);
            list = new AV.BufferList;
            list.append(this.stream.peekSingleBuffer(offset + 2, 2));
            sub_chunk_raw = new AV.Stream(list);
            offset += 4;
            bytes_readin += 2;
          } else if (sub_chunk_type === 4) {
            sub_chunk_data = this.stream.peekUInt32(offset + 4, true);
            offset += 8;
            bytes_readin += 6;
          }
          offset_old = offset;
          offset = (offset + align - 1) & ~(align - 1);
          bytes_readin += offset - offset_old;
          switch (sub_chunk_id) {
            case 1:
              this.metadata['songName'] = this.cleanString(sub_chunk_data);
              break;
            case 2:
              this.metadata['gameName'] = this.cleanString(sub_chunk_data);
              break;
            case 3:
              this.metadata['artistName'] = this.cleanString(sub_chunk_data);
              break;
            case 4:
              this.metadata['dumperName'] = this.cleanString(sub_chunk_data);
              break;
            case 5:
              this.metadata['dateDumped'] = this.cleanString(sub_chunk_data);
              break;
            case 6:
              if (sub_chunk_data === 0) {
                this.metadata['emulatorUsed'] = 'ZSNES';
              } else if (sub_chunk_data === 1) {
                this.metadata['emulatorUsed'] = 'ZSNES';
              } else {
                this.metadata['emulatorUsed'] = "Unknown Emulator (" + sub_chunk_data + ")";
              }
              break;
            case 7:
              this.metadata['comments'] = this.cleanString(sub_chunk_data);
              break;
            case 16:
              this.metadata['ost'] = this.cleanString(sub_chunk_data);
              break;
            case 17:
              this.metadata['ostDisc'] = this.cleanString(sub_chunk_data);
              break;
            case 18:
              this.metadata['ostTrack'] = sub_chunk_raw.peekUInt8(1) + String.fromCharCode(sub_chunk_raw.peekUInt8(0));
              break;
            case 19:
              this.metadata['publisherName'] = this.cleanString(sub_chunk_data);
              break;
            case 20:
              this.metadata['copyrightYear'] = this.cleanString(sub_chunk_data);
              break;
            case 48:
              this.metadata['introLength'] = sub_chunk_data;
              break;
            case 49:
              this.metadata['loopLength'] = sub_chunk_data;
              break;
            case 50:
              this.metadata['endLength'] = sub_chunk_data;
              break;
            case 51:
              this.metadata['fadeLength'] = sub_chunk_data;
              break;
            case 52:
              this.metadata['mutedChannels'] = sub_chunk_data;
              break;
            case 53:
              this.metadata['loopCount'] = sub_chunk_data;
              break;
            case 54:
              this.metadata['amplification'] = sub_chunk_data;
              break;
            default:
              this.metadata["unknown_" + sub_chunk_id + "_type_" + sub_chunk_type] = sub_chunk_data;
          }
        }
      }
    }
    this.emit('metadata', this.metadata);
    duration = parseInt(this.stream.peekString(169, 3)) * 1000;
    fadeOut = parseInt(this.stream.peekString(172, 3));
    this.seconds = parseInt(duration + fadeOut);
    this.emit('duration', this.seconds);
    while (this.stream.available(1)) {
      buf = this.stream.readSingleBuffer(this.stream.remainingBytes());
      this.emit("data", buf);
    }
  };

  return SPCDemuxer;

})(AV.Demuxer);
var SPCDecoder,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SPCDecoder = (function(superClass) {
  extend(SPCDecoder, superClass);

  function SPCDecoder() {
    this.readChunk = bind(this.readChunk, this);
    this.init = bind(this.init, this);
    return SPCDecoder.__super__.constructor.apply(this, arguments);
  }

  AV.Decoder.register('spc7', SPCDecoder);

  SPCDecoder.prototype.init = function() {
    this.sample_count = 0;
    this.length = 2048;
    if (!window.__spcAudioBuffer) {
      window.__spcAudioBuffer = Module._malloc(this.length);
    }
    this.data_heap = new Int16Array(Module.HEAPU8.buffer, window.__spcAudioBuffer, this.length);
    if (window.__spcAudioBuffer) {
      Module._free(window.__spcAudioBuffer.byteOffset);
    }
  };

  SPCDecoder.prototype.readChunk = function() {
    var result;
    if (!this.stream.available(66048)) {
      return null;
    }
    while (this.sample_count < ((this.demuxer.seconds / 1000) * 32000 * 2)) {
      this.sample_count = Module.ccall("SpcJsDecodeAudio", "void", ["number", "number"], [this.data_heap.byteOffset, this.length]);
      result = new Int16Array(this.data_heap.buffer, this.data_heap.byteOffset, this.data_heap.length);
      return result;
    }
  };

  return SPCDecoder;

})(AV.Decoder);
