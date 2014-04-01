// The Module object: Our interface to the outside world. We import
// and export values on it, and do the work to get that through
// closure compiler if necessary. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(Module) { ..generated code.. }
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to do an eval in order to handle the closure compiler
// case, where this code here is minified but Module was defined
// elsewhere (e.g. case 4 above). We also need to check if Module
// already exists (e.g. case 3 above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module;
if (!Module) Module = eval('(function() { try { return Module || {} } catch(e) { return {} } })()');

// Sometimes an existing Module object exists with properties
// meant to overwrite the default module functionality. Here
// we collect those properties and reapply _after_ we configure
// the current environment's defaults to avoid having to be so
// defensive during initialization.
var moduleOverrides = {};
for (var key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}

// The environment setup code below is customized to use Module.
// *** Environment setup code ***
var ENVIRONMENT_IS_NODE = typeof process === 'object' && typeof require === 'function';
var ENVIRONMENT_IS_WEB = typeof window === 'object';
var ENVIRONMENT_IS_WORKER = typeof importScripts === 'function';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // Expose functionality in the same simple way that the shells work
  // Note that we pollute the global namespace here, otherwise we break in node
  if (!Module['print']) Module['print'] = function print(x) {
    process['stdout'].write(x + '\n');
  };
  if (!Module['printErr']) Module['printErr'] = function printErr(x) {
    process['stderr'].write(x + '\n');
  };

  var nodeFS = require('fs');
  var nodePath = require('path');

  Module['read'] = function read(filename, binary) {
    filename = nodePath['normalize'](filename);
    var ret = nodeFS['readFileSync'](filename);
    // The path is absolute if the normalized version is the same as the resolved.
    if (!ret && filename != nodePath['resolve'](filename)) {
      filename = path.join(__dirname, '..', 'src', filename);
      ret = nodeFS['readFileSync'](filename);
    }
    if (ret && !binary) ret = ret.toString();
    return ret;
  };

  Module['readBinary'] = function readBinary(filename) { return Module['read'](filename, true) };

  Module['load'] = function load(f) {
    globalEval(read(f));
  };

  Module['arguments'] = process['argv'].slice(2);

  module['exports'] = Module;
}
else if (ENVIRONMENT_IS_SHELL) {
  if (!Module['print']) Module['print'] = print;
  if (typeof printErr != 'undefined') Module['printErr'] = printErr; // not present in v8 or older sm

  if (typeof read != 'undefined') {
    Module['read'] = read;
  } else {
    Module['read'] = function read() { throw 'no read() available (jsc?)' };
  }

  Module['readBinary'] = function readBinary(f) {
    return read(f, 'binary');
  };

  if (typeof scriptArgs != 'undefined') {
    Module['arguments'] = scriptArgs;
  } else if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  this['Module'] = Module;

  eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined"); // wipe out the SpiderMonkey shell 'gc' function, which can confuse closure (uses it as a minified name, and it is then initted to a non-falsey value unexpectedly)
}
else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  Module['read'] = function read(url) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    return xhr.responseText;
  };

  if (typeof arguments != 'undefined') {
    Module['arguments'] = arguments;
  }

  if (typeof console !== 'undefined') {
    if (!Module['print']) Module['print'] = function print(x) {
      console.log(x);
    };
    if (!Module['printErr']) Module['printErr'] = function printErr(x) {
      console.log(x);
    };
  } else {
    // Probably a worker, and without console.log. We can do very little here...
    var TRY_USE_DUMP = false;
    if (!Module['print']) Module['print'] = (TRY_USE_DUMP && (typeof(dump) !== "undefined") ? (function(x) {
      dump(x);
    }) : (function(x) {
      // self.postMessage(x); // enable this if you want stdout to be sent as messages
    }));
  }

  if (ENVIRONMENT_IS_WEB) {
    this['Module'] = Module;
  } else {
    Module['load'] = importScripts;
  }
}
else {
  // Unreachable because SHELL is dependant on the others
  throw 'Unknown runtime environment. Where are we?';
}

function globalEval(x) {
  eval.call(null, x);
}
if (!Module['load'] == 'undefined' && Module['read']) {
  Module['load'] = function load(f) {
    globalEval(Module['read'](f));
  };
}
if (!Module['print']) {
  Module['print'] = function(){};
}
if (!Module['printErr']) {
  Module['printErr'] = Module['print'];
}
if (!Module['arguments']) {
  Module['arguments'] = [];
}
// *** Environment setup code ***

// Closure helpers
Module.print = Module['print'];
Module.printErr = Module['printErr'];

// Callbacks
Module['preRun'] = [];
Module['postRun'] = [];

// Merge back in the overrides
for (var key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}



// === Auto-generated preamble library stuff ===

//========================================
// Runtime code shared with compiler
//========================================

var Runtime = {
  stackSave: function () {
    return STACKTOP;
  },
  stackRestore: function (stackTop) {
    STACKTOP = stackTop;
  },
  forceAlign: function (target, quantum) {
    quantum = quantum || 4;
    if (quantum == 1) return target;
    if (isNumber(target) && isNumber(quantum)) {
      return Math.ceil(target/quantum)*quantum;
    } else if (isNumber(quantum) && isPowerOfTwo(quantum)) {
      return '(((' +target + ')+' + (quantum-1) + ')&' + -quantum + ')';
    }
    return 'Math.ceil((' + target + ')/' + quantum + ')*' + quantum;
  },
  isNumberType: function (type) {
    return type in Runtime.INT_TYPES || type in Runtime.FLOAT_TYPES;
  },
  isPointerType: function isPointerType(type) {
  return type[type.length-1] == '*';
},
  isStructType: function isStructType(type) {
  if (isPointerType(type)) return false;
  if (isArrayType(type)) return true;
  if (/<?\{ ?[^}]* ?\}>?/.test(type)) return true; // { i32, i8 } etc. - anonymous struct types
  // See comment in isStructPointerType()
  return type[0] == '%';
},
  INT_TYPES: {"i1":0,"i8":0,"i16":0,"i32":0,"i64":0},
  FLOAT_TYPES: {"float":0,"double":0},
  or64: function (x, y) {
    var l = (x | 0) | (y | 0);
    var h = (Math.round(x / 4294967296) | Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  and64: function (x, y) {
    var l = (x | 0) & (y | 0);
    var h = (Math.round(x / 4294967296) & Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  xor64: function (x, y) {
    var l = (x | 0) ^ (y | 0);
    var h = (Math.round(x / 4294967296) ^ Math.round(y / 4294967296)) * 4294967296;
    return l + h;
  },
  getNativeTypeSize: function (type) {
    switch (type) {
      case 'i1': case 'i8': return 1;
      case 'i16': return 2;
      case 'i32': return 4;
      case 'i64': return 8;
      case 'float': return 4;
      case 'double': return 8;
      default: {
        if (type[type.length-1] === '*') {
          return Runtime.QUANTUM_SIZE; // A pointer
        } else if (type[0] === 'i') {
          var bits = parseInt(type.substr(1));
          assert(bits % 8 === 0);
          return bits/8;
        } else {
          return 0;
        }
      }
    }
  },
  getNativeFieldSize: function (type) {
    return Math.max(Runtime.getNativeTypeSize(type), Runtime.QUANTUM_SIZE);
  },
  dedup: function dedup(items, ident) {
  var seen = {};
  if (ident) {
    return items.filter(function(item) {
      if (seen[item[ident]]) return false;
      seen[item[ident]] = true;
      return true;
    });
  } else {
    return items.filter(function(item) {
      if (seen[item]) return false;
      seen[item] = true;
      return true;
    });
  }
},
  set: function set() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  var ret = {};
  for (var i = 0; i < args.length; i++) {
    ret[args[i]] = 0;
  }
  return ret;
},
  STACK_ALIGN: 8,
  getAlignSize: function (type, size, vararg) {
    // we align i64s and doubles on 64-bit boundaries, unlike x86
    if (!vararg && (type == 'i64' || type == 'double')) return 8;
    if (!type) return Math.min(size, 8); // align structures internally to 64 bits
    return Math.min(size || (type ? Runtime.getNativeFieldSize(type) : 0), Runtime.QUANTUM_SIZE);
  },
  calculateStructAlignment: function calculateStructAlignment(type) {
    type.flatSize = 0;
    type.alignSize = 0;
    var diffs = [];
    var prev = -1;
    var index = 0;
    type.flatIndexes = type.fields.map(function(field) {
      index++;
      var size, alignSize;
      if (Runtime.isNumberType(field) || Runtime.isPointerType(field)) {
        size = Runtime.getNativeTypeSize(field); // pack char; char; in structs, also char[X]s.
        alignSize = Runtime.getAlignSize(field, size);
      } else if (Runtime.isStructType(field)) {
        if (field[1] === '0') {
          // this is [0 x something]. When inside another structure like here, it must be at the end,
          // and it adds no size
          // XXX this happens in java-nbody for example... assert(index === type.fields.length, 'zero-length in the middle!');
          size = 0;
          if (Types.types[field]) {
            alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
          } else {
            alignSize = type.alignSize || QUANTUM_SIZE;
          }
        } else {
          size = Types.types[field].flatSize;
          alignSize = Runtime.getAlignSize(null, Types.types[field].alignSize);
        }
      } else if (field[0] == 'b') {
        // bN, large number field, like a [N x i8]
        size = field.substr(1)|0;
        alignSize = 1;
      } else if (field[0] === '<') {
        // vector type
        size = alignSize = Types.types[field].flatSize; // fully aligned
      } else if (field[0] === 'i') {
        // illegal integer field, that could not be legalized because it is an internal structure field
        // it is ok to have such fields, if we just use them as markers of field size and nothing more complex
        size = alignSize = parseInt(field.substr(1))/8;
        assert(size % 1 === 0, 'cannot handle non-byte-size field ' + field);
      } else {
        assert(false, 'invalid type for calculateStructAlignment');
      }
      if (type.packed) alignSize = 1;
      type.alignSize = Math.max(type.alignSize, alignSize);
      var curr = Runtime.alignMemory(type.flatSize, alignSize); // if necessary, place this on aligned memory
      type.flatSize = curr + size;
      if (prev >= 0) {
        diffs.push(curr-prev);
      }
      prev = curr;
      return curr;
    });
    if (type.name_ && type.name_[0] === '[') {
      // arrays have 2 elements, so we get the proper difference. then we scale here. that way we avoid
      // allocating a potentially huge array for [999999 x i8] etc.
      type.flatSize = parseInt(type.name_.substr(1))*type.flatSize/2;
    }
    type.flatSize = Runtime.alignMemory(type.flatSize, type.alignSize);
    if (diffs.length == 0) {
      type.flatFactor = type.flatSize;
    } else if (Runtime.dedup(diffs).length == 1) {
      type.flatFactor = diffs[0];
    }
    type.needsFlattening = (type.flatFactor != 1);
    return type.flatIndexes;
  },
  generateStructInfo: function (struct, typeName, offset) {
    var type, alignment;
    if (typeName) {
      offset = offset || 0;
      type = (typeof Types === 'undefined' ? Runtime.typeInfo : Types.types)[typeName];
      if (!type) return null;
      if (type.fields.length != struct.length) {
        printErr('Number of named fields must match the type for ' + typeName + ': possibly duplicate struct names. Cannot return structInfo');
        return null;
      }
      alignment = type.flatIndexes;
    } else {
      var type = { fields: struct.map(function(item) { return item[0] }) };
      alignment = Runtime.calculateStructAlignment(type);
    }
    var ret = {
      __size__: type.flatSize
    };
    if (typeName) {
      struct.forEach(function(item, i) {
        if (typeof item === 'string') {
          ret[item] = alignment[i] + offset;
        } else {
          // embedded struct
          var key;
          for (var k in item) key = k;
          ret[key] = Runtime.generateStructInfo(item[key], type.fields[i], alignment[i]);
        }
      });
    } else {
      struct.forEach(function(item, i) {
        ret[item[1]] = alignment[i];
      });
    }
    return ret;
  },
  dynCall: function (sig, ptr, args) {
    if (args && args.length) {
      if (!args.splice) args = Array.prototype.slice.call(args);
      args.splice(0, 0, ptr);
      return Module['dynCall_' + sig].apply(null, args);
    } else {
      return Module['dynCall_' + sig].call(null, ptr);
    }
  },
  functionPointers: [],
  addFunction: function (func) {
    for (var i = 0; i < Runtime.functionPointers.length; i++) {
      if (!Runtime.functionPointers[i]) {
        Runtime.functionPointers[i] = func;
        return 2*(1 + i);
      }
    }
    throw 'Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.';
  },
  removeFunction: function (index) {
    Runtime.functionPointers[(index-2)/2] = null;
  },
  getAsmConst: function (code, numArgs) {
    // code is a constant string on the heap, so we can cache these
    if (!Runtime.asmConstCache) Runtime.asmConstCache = {};
    var func = Runtime.asmConstCache[code];
    if (func) return func;
    var args = [];
    for (var i = 0; i < numArgs; i++) {
      args.push(String.fromCharCode(36) + i); // $0, $1 etc
    }
    code = Pointer_stringify(code);
    if (code[0] === '"') {
      // tolerate EM_ASM("..code..") even though EM_ASM(..code..) is correct
      if (code.indexOf('"', 1) === code.length-1) {
        code = code.substr(1, code.length-2);
      } else {
        // something invalid happened, e.g. EM_ASM("..code($0)..", input)
        abort('invalid EM_ASM input |' + code + '|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)');
      }
    }
    return Runtime.asmConstCache[code] = eval('(function(' + args.join(',') + '){ ' + code + ' })'); // new Function does not allow upvars in node
  },
  warnOnce: function (text) {
    if (!Runtime.warnOnce.shown) Runtime.warnOnce.shown = {};
    if (!Runtime.warnOnce.shown[text]) {
      Runtime.warnOnce.shown[text] = 1;
      Module.printErr(text);
    }
  },
  funcWrappers: {},
  getFuncWrapper: function (func, sig) {
    assert(sig);
    if (!Runtime.funcWrappers[func]) {
      Runtime.funcWrappers[func] = function dynCall_wrapper() {
        return Runtime.dynCall(sig, func, arguments);
      };
    }
    return Runtime.funcWrappers[func];
  },
  UTF8Processor: function () {
    var buffer = [];
    var needed = 0;
    this.processCChar = function (code) {
      code = code & 0xFF;

      if (buffer.length == 0) {
        if ((code & 0x80) == 0x00) {        // 0xxxxxxx
          return String.fromCharCode(code);
        }
        buffer.push(code);
        if ((code & 0xE0) == 0xC0) {        // 110xxxxx
          needed = 1;
        } else if ((code & 0xF0) == 0xE0) { // 1110xxxx
          needed = 2;
        } else {                            // 11110xxx
          needed = 3;
        }
        return '';
      }

      if (needed) {
        buffer.push(code);
        needed--;
        if (needed > 0) return '';
      }

      var c1 = buffer[0];
      var c2 = buffer[1];
      var c3 = buffer[2];
      var c4 = buffer[3];
      var ret;
      if (buffer.length == 2) {
        ret = String.fromCharCode(((c1 & 0x1F) << 6)  | (c2 & 0x3F));
      } else if (buffer.length == 3) {
        ret = String.fromCharCode(((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6)  | (c3 & 0x3F));
      } else {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var codePoint = ((c1 & 0x07) << 18) | ((c2 & 0x3F) << 12) |
                        ((c3 & 0x3F) << 6)  | (c4 & 0x3F);
        ret = String.fromCharCode(
          Math.floor((codePoint - 0x10000) / 0x400) + 0xD800,
          (codePoint - 0x10000) % 0x400 + 0xDC00);
      }
      buffer.length = 0;
      return ret;
    }
    this.processJSString = function processJSString(string) {
      string = unescape(encodeURIComponent(string));
      var ret = [];
      for (var i = 0; i < string.length; i++) {
        ret.push(string.charCodeAt(i));
      }
      return ret;
    }
  },
  getCompilerSetting: function (name) {
    throw 'You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work';
  },
  stackAlloc: function (size) { var ret = STACKTOP;STACKTOP = (STACKTOP + size)|0;STACKTOP = (((STACKTOP)+7)&-8); return ret; },
  staticAlloc: function (size) { var ret = STATICTOP;STATICTOP = (STATICTOP + size)|0;STATICTOP = (((STATICTOP)+7)&-8); return ret; },
  dynamicAlloc: function (size) { var ret = DYNAMICTOP;DYNAMICTOP = (DYNAMICTOP + size)|0;DYNAMICTOP = (((DYNAMICTOP)+7)&-8); if (DYNAMICTOP >= TOTAL_MEMORY) enlargeMemory();; return ret; },
  alignMemory: function (size,quantum) { var ret = size = Math.ceil((size)/(quantum ? quantum : 8))*(quantum ? quantum : 8); return ret; },
  makeBigInt: function (low,high,unsigned) { var ret = (unsigned ? ((+((low>>>0)))+((+((high>>>0)))*4294967296.0)) : ((+((low>>>0)))+((+((high|0)))*4294967296.0))); return ret; },
  GLOBAL_BASE: 8,
  QUANTUM_SIZE: 4,
  __dummy__: 0
}


Module['Runtime'] = Runtime;









//========================================
// Runtime essentials
//========================================

var __THREW__ = 0; // Used in checking for thrown exceptions.

var ABORT = false; // whether we are quitting the application. no code should run after this. set in exit() and abort()
var EXITSTATUS = 0;

var undef = 0;
// tempInt is used for 32-bit signed values or smaller. tempBigInt is used
// for 32-bit unsigned values or more than 32 bits. TODO: audit all uses of tempInt
var tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat;
var tempI64, tempI64b;
var tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9;

function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed: ' + text);
  }
}

var globalScope = this;

// C calling interface. A convenient way to call C functions (in C files, or
// defined with extern "C").
//
// Note: LLVM optimizations can inline and remove functions, after which you will not be
//       able to call them. Closure can also do so. To avoid that, add your function to
//       the exports using something like
//
//         -s EXPORTED_FUNCTIONS='["_main", "_myfunc"]'
//
// @param ident      The name of the C function (note that C++ functions will be name-mangled - use extern "C")
// @param returnType The return type of the function, one of the JS types 'number', 'string' or 'array' (use 'number' for any C pointer, and
//                   'array' for JavaScript arrays and typed arrays; note that arrays are 8-bit).
// @param argTypes   An array of the types of arguments for the function (if there are no arguments, this can be ommitted). Types are as in returnType,
//                   except that 'array' is not possible (there is no way for us to know the length of the array)
// @param args       An array of the arguments to the function, as native JS values (as in returnType)
//                   Note that string arguments will be stored on the stack (the JS string will become a C string on the stack).
// @return           The return value, as a native JS value (as in returnType)
function ccall(ident, returnType, argTypes, args) {
  return ccallFunc(getCFunc(ident), returnType, argTypes, args);
}
Module["ccall"] = ccall;

// Returns the C function with a specified identifier (for C++, you need to do manual name mangling)
function getCFunc(ident) {
  try {
    var func = Module['_' + ident]; // closure exported function
    if (!func) func = eval('_' + ident); // explicit lookup
  } catch(e) {
  }
  assert(func, 'Cannot call unknown function ' + ident + ' (perhaps LLVM optimizations or closure removed it?)');
  return func;
}

// Internal function that does a C call using a function, not an identifier
function ccallFunc(func, returnType, argTypes, args) {
  var stack = 0;
  function toC(value, type) {
    if (type == 'string') {
      if (value === null || value === undefined || value === 0) return 0; // null string
      value = intArrayFromString(value);
      type = 'array';
    }
    if (type == 'array') {
      if (!stack) stack = Runtime.stackSave();
      var ret = Runtime.stackAlloc(value.length);
      writeArrayToMemory(value, ret);
      return ret;
    }
    return value;
  }
  function fromC(value, type) {
    if (type == 'string') {
      return Pointer_stringify(value);
    }
    assert(type != 'array');
    return value;
  }
  var i = 0;
  var cArgs = args ? args.map(function(arg) {
    return toC(arg, argTypes[i++]);
  }) : [];
  var ret = fromC(func.apply(null, cArgs), returnType);
  if (stack) Runtime.stackRestore(stack);
  return ret;
}

// Returns a native JS wrapper for a C function. This is similar to ccall, but
// returns a function you can call repeatedly in a normal way. For example:
//
//   var my_function = cwrap('my_c_function', 'number', ['number', 'number']);
//   alert(my_function(5, 22));
//   alert(my_function(99, 12));
//
function cwrap(ident, returnType, argTypes) {
  var func = getCFunc(ident);
  return function() {
    return ccallFunc(func, returnType, argTypes, Array.prototype.slice.call(arguments));
  }
}
Module["cwrap"] = cwrap;

// Sets a value in memory in a dynamic way at run-time. Uses the
// type data. This is the same as makeSetValue, except that
// makeSetValue is done at compile-time and generates the needed
// code then, whereas this function picks the right code at
// run-time.
// Note that setValue and getValue only do *aligned* writes and reads!
// Note that ccall uses JS types as for defining types, while setValue and
// getValue need LLVM types ('i8', 'i32') - this is a lower-level operation
function setValue(ptr, value, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': HEAP8[(ptr)]=value; break;
      case 'i8': HEAP8[(ptr)]=value; break;
      case 'i16': HEAP16[((ptr)>>1)]=value; break;
      case 'i32': HEAP32[((ptr)>>2)]=value; break;
      case 'i64': (tempI64 = [value>>>0,(tempDouble=value,(+(Math_abs(tempDouble))) >= 1.0 ? (tempDouble > 0.0 ? ((Math_min((+(Math_floor((tempDouble)/4294967296.0))), 4294967295.0))|0)>>>0 : (~~((+(Math_ceil((tempDouble - +(((~~(tempDouble)))>>>0))/4294967296.0)))))>>>0) : 0)],HEAP32[((ptr)>>2)]=tempI64[0],HEAP32[(((ptr)+(4))>>2)]=tempI64[1]); break;
      case 'float': HEAPF32[((ptr)>>2)]=value; break;
      case 'double': HEAPF64[((ptr)>>3)]=value; break;
      default: abort('invalid type for setValue: ' + type);
    }
}
Module['setValue'] = setValue;

// Parallel to setValue.
function getValue(ptr, type, noSafe) {
  type = type || 'i8';
  if (type.charAt(type.length-1) === '*') type = 'i32'; // pointers are 32-bit
    switch(type) {
      case 'i1': return HEAP8[(ptr)];
      case 'i8': return HEAP8[(ptr)];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP32[((ptr)>>2)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      default: abort('invalid type for setValue: ' + type);
    }
  return null;
}
Module['getValue'] = getValue;

var ALLOC_NORMAL = 0; // Tries to use _malloc()
var ALLOC_STACK = 1; // Lives for the duration of the current function call
var ALLOC_STATIC = 2; // Cannot be freed
var ALLOC_DYNAMIC = 3; // Cannot be freed except through sbrk
var ALLOC_NONE = 4; // Do not allocate
Module['ALLOC_NORMAL'] = ALLOC_NORMAL;
Module['ALLOC_STACK'] = ALLOC_STACK;
Module['ALLOC_STATIC'] = ALLOC_STATIC;
Module['ALLOC_DYNAMIC'] = ALLOC_DYNAMIC;
Module['ALLOC_NONE'] = ALLOC_NONE;

// allocate(): This is for internal use. You can use it yourself as well, but the interface
//             is a little tricky (see docs right below). The reason is that it is optimized
//             for multiple syntaxes to save space in generated code. So you should
//             normally not use allocate(), and instead allocate memory using _malloc(),
//             initialize it with setValue(), and so forth.
// @slab: An array of data, or a number. If a number, then the size of the block to allocate,
//        in *bytes* (note that this is sometimes confusing: the next parameter does not
//        affect this!)
// @types: Either an array of types, one for each byte (or 0 if no type at that position),
//         or a single type which is used for the entire block. This only matters if there
//         is initial data - if @slab is a number, then this does not matter at all and is
//         ignored.
// @allocator: How to allocate memory, see ALLOC_*
function allocate(slab, types, allocator, ptr) {
  var zeroinit, size;
  if (typeof slab === 'number') {
    zeroinit = true;
    size = slab;
  } else {
    zeroinit = false;
    size = slab.length;
  }

  var singleType = typeof types === 'string' ? types : null;

  var ret;
  if (allocator == ALLOC_NONE) {
    ret = ptr;
  } else {
    ret = [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][allocator === undefined ? ALLOC_STATIC : allocator](Math.max(size, singleType ? 1 : types.length));
  }

  if (zeroinit) {
    var ptr = ret, stop;
    assert((ret & 3) == 0);
    stop = ret + (size & ~3);
    for (; ptr < stop; ptr += 4) {
      HEAP32[((ptr)>>2)]=0;
    }
    stop = ret + size;
    while (ptr < stop) {
      HEAP8[((ptr++)|0)]=0;
    }
    return ret;
  }

  if (singleType === 'i8') {
    if (slab.subarray || slab.slice) {
      HEAPU8.set(slab, ret);
    } else {
      HEAPU8.set(new Uint8Array(slab), ret);
    }
    return ret;
  }

  var i = 0, type, typeSize, previousType;
  while (i < size) {
    var curr = slab[i];

    if (typeof curr === 'function') {
      curr = Runtime.getFunctionIndex(curr);
    }

    type = singleType || types[i];
    if (type === 0) {
      i++;
      continue;
    }

    if (type == 'i64') type = 'i32'; // special case: we have one i32 here, and one i32 later

    setValue(ret+i, curr, type);

    // no need to look up size unless type changes, so cache it
    if (previousType !== type) {
      typeSize = Runtime.getNativeTypeSize(type);
      previousType = type;
    }
    i += typeSize;
  }

  return ret;
}
Module['allocate'] = allocate;

function Pointer_stringify(ptr, /* optional */ length) {
  // TODO: use TextDecoder
  // Find the length, and check for UTF while doing so
  var hasUtf = false;
  var t;
  var i = 0;
  while (1) {
    t = HEAPU8[(((ptr)+(i))|0)];
    if (t >= 128) hasUtf = true;
    else if (t == 0 && !length) break;
    i++;
    if (length && i == length) break;
  }
  if (!length) length = i;

  var ret = '';

  if (!hasUtf) {
    var MAX_CHUNK = 1024; // split up into chunks, because .apply on a huge string can overflow the stack
    var curr;
    while (length > 0) {
      curr = String.fromCharCode.apply(String, HEAPU8.subarray(ptr, ptr + Math.min(length, MAX_CHUNK)));
      ret = ret ? ret + curr : curr;
      ptr += MAX_CHUNK;
      length -= MAX_CHUNK;
    }
    return ret;
  }

  var utf8 = new Runtime.UTF8Processor();
  for (i = 0; i < length; i++) {
    t = HEAPU8[(((ptr)+(i))|0)];
    ret += utf8.processCChar(t);
  }
  return ret;
}
Module['Pointer_stringify'] = Pointer_stringify;

// Given a pointer 'ptr' to a null-terminated UTF16LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF16ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var codeUnit = HEAP16[(((ptr)+(i*2))>>1)];
    if (codeUnit == 0)
      return str;
    ++i;
    // fromCharCode constructs a character from a UTF-16 code unit, so we can pass the UTF16 string right through.
    str += String.fromCharCode(codeUnit);
  }
}
Module['UTF16ToString'] = UTF16ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF16LE form. The copy will require at most (str.length*2+1)*2 bytes of space in the HEAP.
function stringToUTF16(str, outPtr) {
  for(var i = 0; i < str.length; ++i) {
    // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
    var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
    HEAP16[(((outPtr)+(i*2))>>1)]=codeUnit;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP16[(((outPtr)+(str.length*2))>>1)]=0;
}
Module['stringToUTF16'] = stringToUTF16;

// Given a pointer 'ptr' to a null-terminated UTF32LE-encoded string in the emscripten HEAP, returns
// a copy of that string as a Javascript String object.
function UTF32ToString(ptr) {
  var i = 0;

  var str = '';
  while (1) {
    var utf32 = HEAP32[(((ptr)+(i*4))>>2)];
    if (utf32 == 0)
      return str;
    ++i;
    // Gotcha: fromCharCode constructs a character from a UTF-16 encoded code (pair), not from a Unicode code point! So encode the code point to UTF-16 for constructing.
    if (utf32 >= 0x10000) {
      var ch = utf32 - 0x10000;
      str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
    } else {
      str += String.fromCharCode(utf32);
    }
  }
}
Module['UTF32ToString'] = UTF32ToString;

// Copies the given Javascript String object 'str' to the emscripten HEAP at address 'outPtr',
// null-terminated and encoded in UTF32LE form. The copy will require at most (str.length+1)*4 bytes of space in the HEAP,
// but can use less, since str.length does not return the number of characters in the string, but the number of UTF-16 code units in the string.
function stringToUTF32(str, outPtr) {
  var iChar = 0;
  for(var iCodeUnit = 0; iCodeUnit < str.length; ++iCodeUnit) {
    // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit, not a Unicode code point of the character! We must decode the string to UTF-32 to the heap.
    var codeUnit = str.charCodeAt(iCodeUnit); // possibly a lead surrogate
    if (codeUnit >= 0xD800 && codeUnit <= 0xDFFF) {
      var trailSurrogate = str.charCodeAt(++iCodeUnit);
      codeUnit = 0x10000 + ((codeUnit & 0x3FF) << 10) | (trailSurrogate & 0x3FF);
    }
    HEAP32[(((outPtr)+(iChar*4))>>2)]=codeUnit;
    ++iChar;
  }
  // Null-terminate the pointer to the HEAP.
  HEAP32[(((outPtr)+(iChar*4))>>2)]=0;
}
Module['stringToUTF32'] = stringToUTF32;

function demangle(func) {
  var i = 3;
  // params, etc.
  var basicTypes = {
    'v': 'void',
    'b': 'bool',
    'c': 'char',
    's': 'short',
    'i': 'int',
    'l': 'long',
    'f': 'float',
    'd': 'double',
    'w': 'wchar_t',
    'a': 'signed char',
    'h': 'unsigned char',
    't': 'unsigned short',
    'j': 'unsigned int',
    'm': 'unsigned long',
    'x': 'long long',
    'y': 'unsigned long long',
    'z': '...'
  };
  var subs = [];
  var first = true;
  function dump(x) {
    //return;
    if (x) Module.print(x);
    Module.print(func);
    var pre = '';
    for (var a = 0; a < i; a++) pre += ' ';
    Module.print (pre + '^');
  }
  function parseNested() {
    i++;
    if (func[i] === 'K') i++; // ignore const
    var parts = [];
    while (func[i] !== 'E') {
      if (func[i] === 'S') { // substitution
        i++;
        var next = func.indexOf('_', i);
        var num = func.substring(i, next) || 0;
        parts.push(subs[num] || '?');
        i = next+1;
        continue;
      }
      if (func[i] === 'C') { // constructor
        parts.push(parts[parts.length-1]);
        i += 2;
        continue;
      }
      var size = parseInt(func.substr(i));
      var pre = size.toString().length;
      if (!size || !pre) { i--; break; } // counter i++ below us
      var curr = func.substr(i + pre, size);
      parts.push(curr);
      subs.push(curr);
      i += pre + size;
    }
    i++; // skip E
    return parts;
  }
  function parse(rawList, limit, allowVoid) { // main parser
    limit = limit || Infinity;
    var ret = '', list = [];
    function flushList() {
      return '(' + list.join(', ') + ')';
    }
    var name;
    if (func[i] === 'N') {
      // namespaced N-E
      name = parseNested().join('::');
      limit--;
      if (limit === 0) return rawList ? [name] : name;
    } else {
      // not namespaced
      if (func[i] === 'K' || (first && func[i] === 'L')) i++; // ignore const and first 'L'
      var size = parseInt(func.substr(i));
      if (size) {
        var pre = size.toString().length;
        name = func.substr(i + pre, size);
        i += pre + size;
      }
    }
    first = false;
    if (func[i] === 'I') {
      i++;
      var iList = parse(true);
      var iRet = parse(true, 1, true);
      ret += iRet[0] + ' ' + name + '<' + iList.join(', ') + '>';
    } else {
      ret = name;
    }
    paramLoop: while (i < func.length && limit-- > 0) {
      //dump('paramLoop');
      var c = func[i++];
      if (c in basicTypes) {
        list.push(basicTypes[c]);
      } else {
        switch (c) {
          case 'P': list.push(parse(true, 1, true)[0] + '*'); break; // pointer
          case 'R': list.push(parse(true, 1, true)[0] + '&'); break; // reference
          case 'L': { // literal
            i++; // skip basic type
            var end = func.indexOf('E', i);
            var size = end - i;
            list.push(func.substr(i, size));
            i += size + 2; // size + 'EE'
            break;
          }
          case 'A': { // array
            var size = parseInt(func.substr(i));
            i += size.toString().length;
            if (func[i] !== '_') throw '?';
            i++; // skip _
            list.push(parse(true, 1, true)[0] + ' [' + size + ']');
            break;
          }
          case 'E': break paramLoop;
          default: ret += '?' + c; break paramLoop;
        }
      }
    }
    if (!allowVoid && list.length === 1 && list[0] === 'void') list = []; // avoid (void)
    return rawList ? list : ret + flushList();
  }
  try {
    // Special-case the entry point, since its name differs from other name mangling.
    if (func == 'Object._main' || func == '_main') {
      return 'main()';
    }
    if (typeof func === 'number') func = Pointer_stringify(func);
    if (func[0] !== '_') return func;
    if (func[1] !== '_') return func; // C function
    if (func[2] !== 'Z') return func;
    switch (func[3]) {
      case 'n': return 'operator new()';
      case 'd': return 'operator delete()';
    }
    return parse();
  } catch(e) {
    return func;
  }
}

function demangleAll(text) {
  return text.replace(/__Z[\w\d_]+/g, function(x) { var y = demangle(x); return x === y ? x : (x + ' [' + y + ']') });
}

function stackTrace() {
  var stack = new Error().stack;
  return stack ? demangleAll(stack) : '(no stack trace available)'; // Stack trace is not available at least on IE10 and Safari 6.
}

// Memory management

var PAGE_SIZE = 4096;
function alignMemoryPage(x) {
  return (x+4095)&-4096;
}

var HEAP;
var HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;

var STATIC_BASE = 0, STATICTOP = 0, staticSealed = false; // static area
var STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0; // stack area
var DYNAMIC_BASE = 0, DYNAMICTOP = 0; // dynamic area handled by sbrk

function enlargeMemory() {
  abort('Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value ' + TOTAL_MEMORY + ', (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.');
}

var TOTAL_STACK = Module['TOTAL_STACK'] || 5242880;
var TOTAL_MEMORY = Module['TOTAL_MEMORY'] || 16777216;
var FAST_MEMORY = Module['FAST_MEMORY'] || 2097152;

var totalMemory = 4096;
while (totalMemory < TOTAL_MEMORY || totalMemory < 2*TOTAL_STACK) {
  if (totalMemory < 16*1024*1024) {
    totalMemory *= 2;
  } else {
    totalMemory += 16*1024*1024
  }
}
if (totalMemory !== TOTAL_MEMORY) {
  Module.printErr('increasing TOTAL_MEMORY to ' + totalMemory + ' to be more reasonable');
  TOTAL_MEMORY = totalMemory;
}

// Initialize the runtime's memory
// check for full engine support (use string 'subarray' to avoid closure compiler confusion)
assert(typeof Int32Array !== 'undefined' && typeof Float64Array !== 'undefined' && !!(new Int32Array(1)['subarray']) && !!(new Int32Array(1)['set']),
       'JS engine does not provide full typed array support');

var buffer = new ArrayBuffer(TOTAL_MEMORY);
HEAP8 = new Int8Array(buffer);
HEAP16 = new Int16Array(buffer);
HEAP32 = new Int32Array(buffer);
HEAPU8 = new Uint8Array(buffer);
HEAPU16 = new Uint16Array(buffer);
HEAPU32 = new Uint32Array(buffer);
HEAPF32 = new Float32Array(buffer);
HEAPF64 = new Float64Array(buffer);

// Endianness check (note: assumes compiler arch was little-endian)
HEAP32[0] = 255;
assert(HEAPU8[0] === 255 && HEAPU8[3] === 0, 'Typed arrays 2 must be run on a little-endian system');

Module['HEAP'] = HEAP;
Module['HEAP8'] = HEAP8;
Module['HEAP16'] = HEAP16;
Module['HEAP32'] = HEAP32;
Module['HEAPU8'] = HEAPU8;
Module['HEAPU16'] = HEAPU16;
Module['HEAPU32'] = HEAPU32;
Module['HEAPF32'] = HEAPF32;
Module['HEAPF64'] = HEAPF64;

function callRuntimeCallbacks(callbacks) {
  while(callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback();
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        Runtime.dynCall('v', func);
      } else {
        Runtime.dynCall('vi', func, [callback.arg]);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}

var __ATPRERUN__  = []; // functions called before the runtime is initialized
var __ATINIT__    = []; // functions called during startup
var __ATMAIN__    = []; // functions called when main() is to be run
var __ATEXIT__    = []; // functions called during shutdown
var __ATPOSTRUN__ = []; // functions called after the runtime has exited

var runtimeInitialized = false;

function preRun() {
  // compatibility - merge in anything from Module['preRun'] at this time
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}

function ensureInitRuntime() {
  if (runtimeInitialized) return;
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}

function preMain() {
  callRuntimeCallbacks(__ATMAIN__);
}

function exitRuntime() {
  callRuntimeCallbacks(__ATEXIT__);
}

function postRun() {
  // compatibility - merge in anything from Module['postRun'] at this time
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}

function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
Module['addOnPreRun'] = Module.addOnPreRun = addOnPreRun;

function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
Module['addOnInit'] = Module.addOnInit = addOnInit;

function addOnPreMain(cb) {
  __ATMAIN__.unshift(cb);
}
Module['addOnPreMain'] = Module.addOnPreMain = addOnPreMain;

function addOnExit(cb) {
  __ATEXIT__.unshift(cb);
}
Module['addOnExit'] = Module.addOnExit = addOnExit;

function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
Module['addOnPostRun'] = Module.addOnPostRun = addOnPostRun;

// Tools

// This processes a JS string into a C-line array of numbers, 0-terminated.
// For LLVM-originating strings, see parser.js:parseLLVMString function
function intArrayFromString(stringy, dontAddNull, length /* optional */) {
  var ret = (new Runtime.UTF8Processor()).processJSString(stringy);
  if (length) {
    ret.length = length;
  }
  if (!dontAddNull) {
    ret.push(0);
  }
  return ret;
}
Module['intArrayFromString'] = intArrayFromString;

function intArrayToString(array) {
  var ret = [];
  for (var i = 0; i < array.length; i++) {
    var chr = array[i];
    if (chr > 0xFF) {
      chr &= 0xFF;
    }
    ret.push(String.fromCharCode(chr));
  }
  return ret.join('');
}
Module['intArrayToString'] = intArrayToString;

// Write a Javascript array to somewhere in the heap
function writeStringToMemory(string, buffer, dontAddNull) {
  var array = intArrayFromString(string, dontAddNull);
  var i = 0;
  while (i < array.length) {
    var chr = array[i];
    HEAP8[(((buffer)+(i))|0)]=chr;
    i = i + 1;
  }
}
Module['writeStringToMemory'] = writeStringToMemory;

function writeArrayToMemory(array, buffer) {
  for (var i = 0; i < array.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=array[i];
  }
}
Module['writeArrayToMemory'] = writeArrayToMemory;

function writeAsciiToMemory(str, buffer, dontAddNull) {
  for (var i = 0; i < str.length; i++) {
    HEAP8[(((buffer)+(i))|0)]=str.charCodeAt(i);
  }
  if (!dontAddNull) HEAP8[(((buffer)+(str.length))|0)]=0;
}
Module['writeAsciiToMemory'] = writeAsciiToMemory;

function unSign(value, bits, ignore) {
  if (value >= 0) {
    return value;
  }
  return bits <= 32 ? 2*Math.abs(1 << (bits-1)) + value // Need some trickery, since if bits == 32, we are right at the limit of the bits JS uses in bitshifts
                    : Math.pow(2, bits)         + value;
}
function reSign(value, bits, ignore) {
  if (value <= 0) {
    return value;
  }
  var half = bits <= 32 ? Math.abs(1 << (bits-1)) // abs is needed if bits == 32
                        : Math.pow(2, bits-1);
  if (value >= half && (bits <= 32 || value > half)) { // for huge values, we can hit the precision limit and always get true here. so don't do that
                                                       // but, in general there is no perfect solution here. With 64-bit ints, we get rounding and errors
                                                       // TODO: In i64 mode 1, resign the two parts separately and safely
    value = -2*half + value; // Cannot bitshift half, as it may be at the limit of the bits JS uses in bitshifts
  }
  return value;
}

// check for imul support, and also for correctness ( https://bugs.webkit.org/show_bug.cgi?id=126345 )
if (!Math['imul'] || Math['imul'](0xffffffff, 5) !== -5) Math['imul'] = function imul(a, b) {
  var ah  = a >>> 16;
  var al = a & 0xffff;
  var bh  = b >>> 16;
  var bl = b & 0xffff;
  return (al*bl + ((ah*bl + al*bh) << 16))|0;
};
Math.imul = Math['imul'];


var Math_abs = Math.abs;
var Math_cos = Math.cos;
var Math_sin = Math.sin;
var Math_tan = Math.tan;
var Math_acos = Math.acos;
var Math_asin = Math.asin;
var Math_atan = Math.atan;
var Math_atan2 = Math.atan2;
var Math_exp = Math.exp;
var Math_log = Math.log;
var Math_sqrt = Math.sqrt;
var Math_ceil = Math.ceil;
var Math_floor = Math.floor;
var Math_pow = Math.pow;
var Math_imul = Math.imul;
var Math_fround = Math.fround;
var Math_min = Math.min;

// A counter of dependencies for calling run(). If we need to
// do asynchronous work before running, increment this and
// decrement it. Incrementing must happen in a place like
// PRE_RUN_ADDITIONS (used by emcc to add file preloading).
// Note that you can add dependencies in preRun, even though
// it happens right before run - run will be postponed until
// the dependencies are met.
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null; // overridden to take different actions when all run dependencies are fulfilled

function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
Module['addRunDependency'] = addRunDependency;
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback(); // can add another dependenciesFulfilled
    }
  }
}
Module['removeRunDependency'] = removeRunDependency;

Module["preloadedImages"] = {}; // maps url to image data
Module["preloadedAudios"] = {}; // maps url to audio data


var memoryInitializer = null;

// === Body ===





STATIC_BASE = 8;

STATICTOP = STATIC_BASE + Runtime.alignMemory(3147);
/* global initializers */ __ATINIT__.push();


/* memory initializer */ allocate([99,111,117,110,116,32,62,32,48,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,78,69,83,95,83,80,67,46,99,112,112,0,0,0,100,115,112,95,114,101,97,100,0,0,0,0,0,0,0,0,82,65,77,32,91,105,32,43,32,114,111,109,95,97,100,100,114,93,32,61,61,32,40,117,105,110,116,56,95,116,41,32,100,97,116,97,0,0,0,0,99,112,117,95,119,114,105,116,101,95,104,105,103,104,0,0,114,101,103,32,43,32,40,114,95,116,48,111,117,116,32,43,32,48,120,70,48,32,45,32,48,120,49,48,48,48,48,41,32,60,32,48,120,49,48,48,0,0,0,0,0,0,0,0,99,112,117,95,114,101,97,100,0,0,0,0,0,0,0,0,45,99,112,117,95,108,97,103,95,109,97,120,32,60,61,32,109,46,115,112,99,95,116,105,109,101,32,38,38,32,109,46,115,112,99,95,116,105,109,101,32,60,61,32,48,0,0,0,101,110,100,95,102,114,97,109,101,0,0,0,0,0,0,0,114,101,108,95,116,105,109,101,32,60,61,32,48,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,67,80,85,46,104,0,0,0,0,0,0,114,117,110,95,117,110,116,105,108,95,0,0,0,0,0,0,83,80,67,32,101,109,117,108,97,116,105,111,110,32,101,114,114,111,114,0,0,0,0,0,48,0,0,0,0,0,0,0,109,46,115,112,99,95,116,105,109,101,32,60,61,32,101,110,100,95,116,105,109,101,0,0,100,115,112,95,119,114,105,116,101,0,0,0,0,0,0,0,40,117,110,115,105,103,110,101,100,41,32,97,100,100,114,32,60,32,114,101,103,105,115,116,101,114,95,99,111,117,110,116,0,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,68,83,80,46,104,0,0,0,0,0,0,119,114,105,116,101,0,0,0,114,101,97,100,0,0,0,0,40,71,52,54,38,84,84,104,72,71,69,86,85,101,34,70,40,71,52,54,38,84,84,116,72,71,69,86,85,101,34,56,40,71,52,54,38,68,84,102,72,71,69,86,85,69,34,67,40,71,52,54,38,68,84,117,72,71,69,86,85,85,34,54,40,71,52,54,38,84,82,69,72,71,69,86,85,85,34,197,56,71,52,54,38,68,82,68,72,71,69,86,85,85,34,52,56,71,69,71,37,100,82,73,72,71,86,103,69,85,34,131,40,71,52,54,36,83,67,64,72,71,69,86,52,84,34,96,83,78,69,83,45,83,80,67,55,48,48,32,83,111,117,110,100,32,70,105,108,101,32,68,97,116,97,32,118,48,46,51,48,26,26,0,0,0,0,0,78,111,116,32,97,110,32,83,80,67,32,102,105,108,101,0,67,111,114,114,117,112,116,32,83,80,67,32,102,105,108,101,0,0,0,0,0,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,78,69,83,95,83,80,67,95,109,105,115,99,46,99,112,112,0,0,0,0,0,0,115,101,116,95,111,117,116,112,117,116,0,0,0,0,0,0,111,117,116,32,60,61,32,111,117,116,95,101,110,100,0,0,111,117,116,32,60,61,32,38,109,46,101,120,116,114,97,95,98,117,102,32,91,101,120,116,114,97,95,115,105,122,101,93,0,0,0,0,0,0,0,0,115,97,118,101,95,101,120,116,114,97,0,0,0,0,0,0,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,112,108,97,121,0,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,68,83,80,46,99,112,112,0,0,0,0,115,101,116,95,111,117,116,112,117,116,0,0,0,0,0,0,118,45,62,98,114,114,95,111,102,102,115,101,116,32,61,61,32,98,114,114,95,98,108,111,99,107,95,115,105,122,101,0,118,111,105,99,101,95,86,52,0,0,0,0,0,0,0,0,99,108,111,99,107,115,95,114,101,109,97,105,110,32,62,32,48,0,0,0,0,0,0,0,114,117,110,0,0,0,0,0,109,46,114,97,109,0,0,0,115,111,102,116,95,114,101,115,101,116,95,99,111,109,109,111,110,0,0,0,0,0,0,0,69,139,90,154,228,130,27,120,0,0,170,150,137,14,224,128,42,73,61,186,20,160,172,197,0,0,81,187,156,78,123,255,244,253,87,50,55,217,66,34,0,0,91,60,159,27,135,154,111,39,175,123,229,104,10,217,0,0,154,197,156,78,123,255,234,33,120,79,221,237,36,20,0,0,119,177,209,54,193,103,82,87,70,61,89,244,135,164,0,0,126,68,156,78,123,255,117,245,6,151,16,195,36,187,0,0,123,122,224,96,18,15,247,116,28,229,57,61,115,193,0,0,122,179,255,78,123,255,42,40,118,111,108,97,116,105,108,101,32,99,104,97,114,42,41,32,38,105,32,33,61,32,48,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,98,108,97,114,103,103,95,101,110,100,105,97,110,46,104,0,0,0,0,0,0,0,0,98,108,97,114,103,103,95,118,101,114,105,102,121,95,98,121,116,101,95,111,114,100,101,114,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,0,0,0,0,0,0,0,0,1,120,0,0,0,8,0,0,0,6,0,0,0,5,0,0,0,4,0,0,0,3,0,0,128,2,0,0,0,2,0,0,128,1,0,0,64,1,0,0,0,1,0,0,192,0,0,0,160,0,0,0,128,0,0,0,96,0,0,0,80,0,0,0,64,0,0,0,48,0,0,0,40,0,0,0,32,0,0,0,24,0,0,0,20,0,0,0,16,0,0,0,12,0,0,0,10,0,0,0,8,0,0,0,6,0,0,0,5,0,0,0,4,0,0,0,3,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,3,0,3,0,3,0,3,0,3,0,4,0,4,0,4,0,4,0,4,0,5,0,5,0,5,0,5,0,6,0,6,0,6,0,6,0,7,0,7,0,7,0,8,0,8,0,8,0,9,0,9,0,9,0,10,0,10,0,10,0,11,0,11,0,11,0,12,0,12,0,13,0,13,0,14,0,14,0,15,0,15,0,15,0,16,0,16,0,17,0,17,0,18,0,19,0,19,0,20,0,20,0,21,0,21,0,22,0,23,0,23,0,24,0,24,0,25,0,26,0,27,0,27,0,28,0,29,0,29,0,30,0,31,0,32,0,32,0,33,0,34,0,35,0,36,0,36,0,37,0,38,0,39,0,40,0,41,0,42,0,43,0,44,0,45,0,46,0,47,0,48,0,49,0,50,0,51,0,52,0,53,0,54,0,55,0,56,0,58,0,59,0,60,0,61,0,62,0,64,0,65,0,66,0,67,0,69,0,70,0,71,0,73,0,74,0,76,0,77,0,78,0,80,0,81,0,83,0,84,0,86,0,87,0,89,0,90,0,92,0,94,0,95,0,97,0,99,0,100,0,102,0,104,0,106,0,107,0,109,0,111,0,113,0,115,0,117,0,118,0,120,0,122,0,124,0,126,0,128,0,130,0,132,0,134,0,137,0,139,0,141,0,143,0,145,0,147,0,150,0,152,0,154,0,156,0,159,0,161,0,163,0,166,0,168,0,171,0,173,0,175,0,178,0,180,0,183,0,186,0,188,0,191,0,193,0,196,0,199,0,201,0,204,0,207,0,210,0,212,0,215,0,218,0,221,0,224,0,227,0,230,0,233,0,236,0,239,0,242,0,245,0,248,0,251,0,254,0,1,1,4,1,7,1,11,1,14,1,17,1,20,1,24,1,27,1,30,1,34,1,37,1,41,1,44,1,48,1,51,1,55,1,58,1,62,1,65,1,69,1,72,1,76,1,80,1,83,1,87,1,91,1,95,1,98,1,102,1,106,1,110,1,114,1,118,1,122,1,125,1,129,1,133,1,137,1,141,1,145,1,149,1,154,1,158,1,162,1,166,1,170,1,174,1,178,1,183,1,187,1,191,1,195,1,200,1,204,1,208,1,213,1,217,1,221,1,226,1,230,1,235,1,239,1,243,1,248,1,252,1,1,2,5,2,10,2,15,2,19,2,24,2,28,2,33,2,38,2,42,2,47,2,51,2,56,2,61,2,65,2,70,2,75,2,80,2,84,2,89,2,94,2,99,2,103,2,108,2,113,2,118,2,123,2,128,2,132,2,137,2,142,2,147,2,152,2,157,2,162,2,166,2,171,2,176,2,181,2,186,2,191,2,196,2,201,2,206,2,211,2,216,2,220,2,225,2,230,2,235,2,240,2,245,2,250,2,255,2,4,3,9,3,14,3,19,3,24,3,29,3,34,3,38,3,43,3,48,3,53,3,58,3,63,3,68,3,73,3,78,3,83,3,87,3,92,3,97,3,102,3,107,3,112,3,116,3,121,3,126,3,131,3,136,3,140,3,145,3,150,3,155,3,159,3,164,3,169,3,173,3,178,3,183,3,187,3,192,3,197,3,201,3,206,3,210,3,215,3,220,3,224,3,229,3,233,3,237,3,242,3,246,3,251,3,255,3,3,4,8,4,12,4,16,4,21,4,25,4,29,4,33,4,37,4,42,4,46,4,50,4,54,4,58,4,62,4,66,4,70,4,74,4,78,4,82,4,85,4,89,4,93,4,97,4,101,4,104,4,108,4,112,4,115,4,119,4,122,4,126,4,129,4,133,4,136,4,140,4,143,4,146,4,150,4,153,4,156,4,159,4,162,4,166,4,169,4,172,4,175,4,178,4,181,4,183,4,186,4,189,4,192,4,195,4,197,4,200,4,203,4,205,4,208,4,210,4,213,4,215,4,217,4,220,4,222,4,224,4,227,4,229,4,231,4,233,4,235,4,237,4,239,4,241,4,243,4,245,4,246,4,248,4,250,4,251,4,253,4,255,4,0,5,2,5,3,5,4,5,6,5,7,5,8,5,10,5,11,5,12,5,13,5,14,5,15,5,16,5,17,5,17,5,18,5,19,5,20,5,20,5,21,5,22,5,22,5,23,5,23,5,23,5,24,5,24,5,24,5,24,5,24,5,25,5,25,5,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,70,105,108,116,101,114,46,99,112,112,0,114,117,110,0,0,0,0,0,69,114,114,111,114,58,32,37,115,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);




var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);

assert(tempDoublePtr % 8 == 0);

function copyTempFloat(ptr) { // functions, because inlining this code increases code size too much

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

}

function copyTempDouble(ptr) {

  HEAP8[tempDoublePtr] = HEAP8[ptr];

  HEAP8[tempDoublePtr+1] = HEAP8[ptr+1];

  HEAP8[tempDoublePtr+2] = HEAP8[ptr+2];

  HEAP8[tempDoublePtr+3] = HEAP8[ptr+3];

  HEAP8[tempDoublePtr+4] = HEAP8[ptr+4];

  HEAP8[tempDoublePtr+5] = HEAP8[ptr+5];

  HEAP8[tempDoublePtr+6] = HEAP8[ptr+6];

  HEAP8[tempDoublePtr+7] = HEAP8[ptr+7];

}


  function _llvm_lifetime_end() {}

   
  Module["_memset"] = _memset;

  
  
  var ___errno_state=0;function ___setErrNo(value) {
      // For convenient setting and returning of errno.
      HEAP32[((___errno_state)>>2)]=value;
      return value;
    }
  
  var ERRNO_CODES={EPERM:1,ENOENT:2,ESRCH:3,EINTR:4,EIO:5,ENXIO:6,E2BIG:7,ENOEXEC:8,EBADF:9,ECHILD:10,EAGAIN:11,EWOULDBLOCK:11,ENOMEM:12,EACCES:13,EFAULT:14,ENOTBLK:15,EBUSY:16,EEXIST:17,EXDEV:18,ENODEV:19,ENOTDIR:20,EISDIR:21,EINVAL:22,ENFILE:23,EMFILE:24,ENOTTY:25,ETXTBSY:26,EFBIG:27,ENOSPC:28,ESPIPE:29,EROFS:30,EMLINK:31,EPIPE:32,EDOM:33,ERANGE:34,ENOMSG:42,EIDRM:43,ECHRNG:44,EL2NSYNC:45,EL3HLT:46,EL3RST:47,ELNRNG:48,EUNATCH:49,ENOCSI:50,EL2HLT:51,EDEADLK:35,ENOLCK:37,EBADE:52,EBADR:53,EXFULL:54,ENOANO:55,EBADRQC:56,EBADSLT:57,EDEADLOCK:35,EBFONT:59,ENOSTR:60,ENODATA:61,ETIME:62,ENOSR:63,ENONET:64,ENOPKG:65,EREMOTE:66,ENOLINK:67,EADV:68,ESRMNT:69,ECOMM:70,EPROTO:71,EMULTIHOP:72,EDOTDOT:73,EBADMSG:74,ENOTUNIQ:76,EBADFD:77,EREMCHG:78,ELIBACC:79,ELIBBAD:80,ELIBSCN:81,ELIBMAX:82,ELIBEXEC:83,ENOSYS:38,ENOTEMPTY:39,ENAMETOOLONG:36,ELOOP:40,EOPNOTSUPP:95,EPFNOSUPPORT:96,ECONNRESET:104,ENOBUFS:105,EAFNOSUPPORT:97,EPROTOTYPE:91,ENOTSOCK:88,ENOPROTOOPT:92,ESHUTDOWN:108,ECONNREFUSED:111,EADDRINUSE:98,ECONNABORTED:103,ENETUNREACH:101,ENETDOWN:100,ETIMEDOUT:110,EHOSTDOWN:112,EHOSTUNREACH:113,EINPROGRESS:115,EALREADY:114,EDESTADDRREQ:89,EMSGSIZE:90,EPROTONOSUPPORT:93,ESOCKTNOSUPPORT:94,EADDRNOTAVAIL:99,ENETRESET:102,EISCONN:106,ENOTCONN:107,ETOOMANYREFS:109,EUSERS:87,EDQUOT:122,ESTALE:116,ENOTSUP:95,ENOMEDIUM:123,EILSEQ:84,EOVERFLOW:75,ECANCELED:125,ENOTRECOVERABLE:131,EOWNERDEAD:130,ESTRPIPE:86};function _sysconf(name) {
      // long sysconf(int name);
      // http://pubs.opengroup.org/onlinepubs/009695399/functions/sysconf.html
      switch(name) {
        case 30: return PAGE_SIZE;
        case 132:
        case 133:
        case 12:
        case 137:
        case 138:
        case 15:
        case 235:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        case 149:
        case 13:
        case 10:
        case 236:
        case 153:
        case 9:
        case 21:
        case 22:
        case 159:
        case 154:
        case 14:
        case 77:
        case 78:
        case 139:
        case 80:
        case 81:
        case 79:
        case 82:
        case 68:
        case 67:
        case 164:
        case 11:
        case 29:
        case 47:
        case 48:
        case 95:
        case 52:
        case 51:
        case 46:
          return 200809;
        case 27:
        case 246:
        case 127:
        case 128:
        case 23:
        case 24:
        case 160:
        case 161:
        case 181:
        case 182:
        case 242:
        case 183:
        case 184:
        case 243:
        case 244:
        case 245:
        case 165:
        case 178:
        case 179:
        case 49:
        case 50:
        case 168:
        case 169:
        case 175:
        case 170:
        case 171:
        case 172:
        case 97:
        case 76:
        case 32:
        case 173:
        case 35:
          return -1;
        case 176:
        case 177:
        case 7:
        case 155:
        case 8:
        case 157:
        case 125:
        case 126:
        case 92:
        case 93:
        case 129:
        case 130:
        case 131:
        case 94:
        case 91:
          return 1;
        case 74:
        case 60:
        case 69:
        case 70:
        case 4:
          return 1024;
        case 31:
        case 42:
        case 72:
          return 32;
        case 87:
        case 26:
        case 33:
          return 2147483647;
        case 34:
        case 1:
          return 47839;
        case 38:
        case 36:
          return 99;
        case 43:
        case 37:
          return 2048;
        case 0: return 2097152;
        case 3: return 65536;
        case 28: return 32768;
        case 44: return 32767;
        case 75: return 16384;
        case 39: return 1000;
        case 89: return 700;
        case 71: return 256;
        case 40: return 255;
        case 2: return 100;
        case 180: return 64;
        case 25: return 20;
        case 5: return 16;
        case 6: return 6;
        case 73: return 4;
        case 84: return 1;
      }
      ___setErrNo(ERRNO_CODES.EINVAL);
      return -1;
    }

  
  
  
  function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src+num), dest);
      return dest;
    } 
  Module["_memcpy"] = _memcpy; 
  Module["_memmove"] = _memmove;var _llvm_memmove_p0i8_p0i8_i32=_memmove;

  var _llvm_memset_p0i8_i32=_memset;

  function _abort() {
      Module['abort']();
    }

  
  
  
  
  var ERRNO_MESSAGES={0:"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};
  
  var PATH={splitPath:function (filename) {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },normalizeArray:function (parts, allowAboveRoot) {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up--; up) {
            parts.unshift('..');
          }
        }
        return parts;
      },normalize:function (path) {
        var isAbsolute = path.charAt(0) === '/',
            trailingSlash = path.substr(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },dirname:function (path) {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.substr(0, dir.length - 1);
        }
        return root + dir;
      },basename:function (path) {
        // EMSCRIPTEN return '/'' for '/', not an empty string
        if (path === '/') return '/';
        var lastSlash = path.lastIndexOf('/');
        if (lastSlash === -1) return path;
        return path.substr(lastSlash+1);
      },extname:function (path) {
        return PATH.splitPath(path)[3];
      },join:function () {
        var paths = Array.prototype.slice.call(arguments, 0);
        return PATH.normalize(paths.join('/'));
      },join2:function (l, r) {
        return PATH.normalize(l + '/' + r);
      },resolve:function () {
        var resolvedPath = '',
          resolvedAbsolute = false;
        for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
          var path = (i >= 0) ? arguments[i] : FS.cwd();
          // Skip empty and invalid entries
          if (typeof path !== 'string') {
            throw new TypeError('Arguments to path.resolve must be strings');
          } else if (!path) {
            continue;
          }
          resolvedPath = path + '/' + resolvedPath;
          resolvedAbsolute = path.charAt(0) === '/';
        }
        // At this point the path should be resolved to a full absolute path, but
        // handle relative paths to be safe (might happen when process.cwd() fails)
        resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter(function(p) {
          return !!p;
        }), !resolvedAbsolute).join('/');
        return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
      },relative:function (from, to) {
        from = PATH.resolve(from).substr(1);
        to = PATH.resolve(to).substr(1);
        function trim(arr) {
          var start = 0;
          for (; start < arr.length; start++) {
            if (arr[start] !== '') break;
          }
          var end = arr.length - 1;
          for (; end >= 0; end--) {
            if (arr[end] !== '') break;
          }
          if (start > end) return [];
          return arr.slice(start, end - start + 1);
        }
        var fromParts = trim(from.split('/'));
        var toParts = trim(to.split('/'));
        var length = Math.min(fromParts.length, toParts.length);
        var samePartsLength = length;
        for (var i = 0; i < length; i++) {
          if (fromParts[i] !== toParts[i]) {
            samePartsLength = i;
            break;
          }
        }
        var outputParts = [];
        for (var i = samePartsLength; i < fromParts.length; i++) {
          outputParts.push('..');
        }
        outputParts = outputParts.concat(toParts.slice(samePartsLength));
        return outputParts.join('/');
      }};
  
  var TTY={ttys:[],init:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process['stdin']['setEncoding']('utf8');
        // }
      },shutdown:function () {
        // https://github.com/kripken/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process['stdin']['pause']();
        // }
      },register:function (dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },stream_ops:{open:function (stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          stream.tty = tty;
          stream.seekable = false;
        },close:function (stream) {
          // flush any pending line data
          if (stream.tty.output.length) {
            stream.tty.ops.put_char(stream.tty, 10);
          }
        },read:function (stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.timestamp = Date.now();
          }
          return bytesRead;
        },write:function (stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
          }
          for (var i = 0; i < length; i++) {
            try {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
          }
          if (length) {
            stream.node.timestamp = Date.now();
          }
          return i;
        }},default_tty_ops:{get_char:function (tty) {
          if (!tty.input.length) {
            var result = null;
            if (ENVIRONMENT_IS_NODE) {
              result = process['stdin']['read']();
              if (!result) {
                if (process['stdin']['_readableState'] && process['stdin']['_readableState']['ended']) {
                  return null;  // EOF
                }
                return undefined;  // no data available
              }
            } else if (typeof window != 'undefined' &&
              typeof window.prompt == 'function') {
              // Browser.
              result = window.prompt('Input: ');  // returns null on cancel
              if (result !== null) {
                result += '\n';
              }
            } else if (typeof readline == 'function') {
              // Command line.
              result = readline();
              if (result !== null) {
                result += '\n';
              }
            }
            if (!result) {
              return null;
            }
            tty.input = intArrayFromString(result, true);
          }
          return tty.input.shift();
        },put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['print'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }},default_tty1_ops:{put_char:function (tty, val) {
          if (val === null || val === 10) {
            Module['printErr'](tty.output.join(''));
            tty.output = [];
          } else {
            tty.output.push(TTY.utf8.processCChar(val));
          }
        }}};
  
  var MEMFS={ops_table:null,CONTENT_OWNING:1,CONTENT_FLEXIBLE:2,CONTENT_FIXED:3,mount:function (mount) {
        return MEMFS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createNode:function (parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // no supported
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (!MEMFS.ops_table) {
          MEMFS.ops_table = {
            dir: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                lookup: MEMFS.node_ops.lookup,
                mknod: MEMFS.node_ops.mknod,
                rename: MEMFS.node_ops.rename,
                unlink: MEMFS.node_ops.unlink,
                rmdir: MEMFS.node_ops.rmdir,
                readdir: MEMFS.node_ops.readdir,
                symlink: MEMFS.node_ops.symlink
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek
              }
            },
            file: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: {
                llseek: MEMFS.stream_ops.llseek,
                read: MEMFS.stream_ops.read,
                write: MEMFS.stream_ops.write,
                allocate: MEMFS.stream_ops.allocate,
                mmap: MEMFS.stream_ops.mmap
              }
            },
            link: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr,
                readlink: MEMFS.node_ops.readlink
              },
              stream: {}
            },
            chrdev: {
              node: {
                getattr: MEMFS.node_ops.getattr,
                setattr: MEMFS.node_ops.setattr
              },
              stream: FS.chrdev_stream_ops
            },
          };
        }
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.contents = [];
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.timestamp = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
        }
        return node;
      },ensureFlexible:function (node) {
        if (node.contentMode !== MEMFS.CONTENT_FLEXIBLE) {
          var contents = node.contents;
          node.contents = Array.prototype.slice.call(contents);
          node.contentMode = MEMFS.CONTENT_FLEXIBLE;
        }
      },node_ops:{getattr:function (node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.contents.length;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.timestamp);
          attr.mtime = new Date(node.timestamp);
          attr.ctime = new Date(node.timestamp);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },setattr:function (node, attr) {
          if (attr.mode !== undefined) {
            node.mode = attr.mode;
          }
          if (attr.timestamp !== undefined) {
            node.timestamp = attr.timestamp;
          }
          if (attr.size !== undefined) {
            MEMFS.ensureFlexible(node);
            var contents = node.contents;
            if (attr.size < contents.length) contents.length = attr.size;
            else while (attr.size > contents.length) contents.push(0);
          }
        },lookup:function (parent, name) {
          throw FS.genericErrors[ERRNO_CODES.ENOENT];
        },mknod:function (parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },rename:function (old_node, new_dir, new_name) {
          // if we're overwriting a directory at new_name, make sure it's empty.
          if (FS.isDir(old_node.mode)) {
            var new_node;
            try {
              new_node = FS.lookupNode(new_dir, new_name);
            } catch (e) {
            }
            if (new_node) {
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
              }
            }
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          old_node.name = new_name;
          new_dir.contents[new_name] = old_node;
          old_node.parent = new_dir;
        },unlink:function (parent, name) {
          delete parent.contents[name];
        },rmdir:function (parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
          }
          delete parent.contents[name];
        },readdir:function (node) {
          var entries = ['.', '..']
          for (var key in node.contents) {
            if (!node.contents.hasOwnProperty(key)) {
              continue;
            }
            entries.push(key);
          }
          return entries;
        },symlink:function (parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 511 /* 0777 */ | 40960, 0);
          node.link = oldpath;
          return node;
        },readlink:function (node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          return node.link;
        }},stream_ops:{read:function (stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else
          {
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          }
          return size;
        },write:function (stream, buffer, offset, length, position, canOwn) {
          var node = stream.node;
          node.timestamp = Date.now();
          var contents = node.contents;
          if (length && contents.length === 0 && position === 0 && buffer.subarray) {
            // just replace it with the new data
            if (canOwn && offset === 0) {
              node.contents = buffer; // this could be a subarray of Emscripten HEAP, or allocated from some other source.
              node.contentMode = (buffer.buffer === HEAP8.buffer) ? MEMFS.CONTENT_OWNING : MEMFS.CONTENT_FIXED;
            } else {
              node.contents = new Uint8Array(buffer.subarray(offset, offset+length));
              node.contentMode = MEMFS.CONTENT_FIXED;
            }
            return length;
          }
          MEMFS.ensureFlexible(node);
          var contents = node.contents;
          while (contents.length < position) contents.push(0);
          for (var i = 0; i < length; i++) {
            contents[position + i] = buffer[offset + i];
          }
          return length;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.contents.length;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          stream.ungotten = [];
          stream.position = position;
          return position;
        },allocate:function (stream, offset, length) {
          MEMFS.ensureFlexible(stream.node);
          var contents = stream.node.contents;
          var limit = offset + length;
          while (limit > contents.length) contents.push(0);
        },mmap:function (stream, buffer, offset, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if ( !(flags & 2) &&
                (contents.buffer === buffer || contents.buffer === buffer.buffer) ) {
            // We can't emulate MAP_SHARED when the file is not backed by the buffer
            // we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            // Try to avoid unnecessary slices.
            if (position > 0 || position + length < contents.length) {
              if (contents.subarray) {
                contents = contents.subarray(position, position + length);
              } else {
                contents = Array.prototype.slice.call(contents, position, position + length);
              }
            }
            allocated = true;
            ptr = _malloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
            }
            buffer.set(contents, ptr);
          }
          return { ptr: ptr, allocated: allocated };
        }}};
  
  var IDBFS={dbs:{},indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function (mount) {
        // reuse all of the core MEMFS functionality
        return MEMFS.mount.apply(null, arguments);
      },syncfs:function (mount, populate, callback) {
        IDBFS.getLocalSet(mount, function(err, local) {
          if (err) return callback(err);
  
          IDBFS.getRemoteSet(mount, function(err, remote) {
            if (err) return callback(err);
  
            var src = populate ? remote : local;
            var dst = populate ? local : remote;
  
            IDBFS.reconcile(src, dst, callback);
          });
        });
      },getDB:function (name, callback) {
        // check the cache first
        var db = IDBFS.dbs[name];
        if (db) {
          return callback(null, db);
        }
  
        var req;
        try {
          req = IDBFS.indexedDB().open(name, IDBFS.DB_VERSION);
        } catch (e) {
          return callback(e);
        }
        req.onupgradeneeded = function(e) {
          var db = e.target.result;
          var transaction = e.target.transaction;
  
          var fileStore;
  
          if (db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)) {
            fileStore = transaction.objectStore(IDBFS.DB_STORE_NAME);
          } else {
            fileStore = db.createObjectStore(IDBFS.DB_STORE_NAME);
          }
  
          fileStore.createIndex('timestamp', 'timestamp', { unique: false });
        };
        req.onsuccess = function() {
          db = req.result;
  
          // add to the cache
          IDBFS.dbs[name] = db;
          callback(null, db);
        };
        req.onerror = function() {
          callback(this.error);
        };
      },getLocalSet:function (mount, callback) {
        var entries = {};
  
        function isRealDir(p) {
          return p !== '.' && p !== '..';
        };
        function toAbsolute(root) {
          return function(p) {
            return PATH.join2(root, p);
          }
        };
  
        var check = FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));
  
        while (check.length) {
          var path = check.pop();
          var stat;
  
          try {
            stat = FS.stat(path);
          } catch (e) {
            return callback(e);
          }
  
          if (FS.isDir(stat.mode)) {
            check.push.apply(check, FS.readdir(path).filter(isRealDir).map(toAbsolute(path)));
          }
  
          entries[path] = { timestamp: stat.mtime };
        }
  
        return callback(null, { type: 'local', entries: entries });
      },getRemoteSet:function (mount, callback) {
        var entries = {};
  
        IDBFS.getDB(mount.mountpoint, function(err, db) {
          if (err) return callback(err);
  
          var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readonly');
          transaction.onerror = function() { callback(this.error); };
  
          var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
          var index = store.index('timestamp');
  
          index.openKeyCursor().onsuccess = function(event) {
            var cursor = event.target.result;
  
            if (!cursor) {
              return callback(null, { type: 'remote', db: db, entries: entries });
            }
  
            entries[cursor.primaryKey] = { timestamp: cursor.key };
  
            cursor.continue();
          };
        });
      },loadLocalEntry:function (path, callback) {
        var stat, node;
  
        try {
          var lookup = FS.lookupPath(path);
          node = lookup.node;
          stat = FS.stat(path);
        } catch (e) {
          return callback(e);
        }
  
        if (FS.isDir(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode });
        } else if (FS.isFile(stat.mode)) {
          return callback(null, { timestamp: stat.mtime, mode: stat.mode, contents: node.contents });
        } else {
          return callback(new Error('node type not supported'));
        }
      },storeLocalEntry:function (path, entry, callback) {
        try {
          if (FS.isDir(entry.mode)) {
            FS.mkdir(path, entry.mode);
          } else if (FS.isFile(entry.mode)) {
            FS.writeFile(path, entry.contents, { encoding: 'binary', canOwn: true });
          } else {
            return callback(new Error('node type not supported'));
          }
  
          FS.utime(path, entry.timestamp, entry.timestamp);
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },removeLocalEntry:function (path, callback) {
        try {
          var lookup = FS.lookupPath(path);
          var stat = FS.stat(path);
  
          if (FS.isDir(stat.mode)) {
            FS.rmdir(path);
          } else if (FS.isFile(stat.mode)) {
            FS.unlink(path);
          }
        } catch (e) {
          return callback(e);
        }
  
        callback(null);
      },loadRemoteEntry:function (store, path, callback) {
        var req = store.get(path);
        req.onsuccess = function(event) { callback(null, event.target.result); };
        req.onerror = function() { callback(this.error); };
      },storeRemoteEntry:function (store, path, entry, callback) {
        var req = store.put(entry, path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },removeRemoteEntry:function (store, path, callback) {
        var req = store.delete(path);
        req.onsuccess = function() { callback(null); };
        req.onerror = function() { callback(this.error); };
      },reconcile:function (src, dst, callback) {
        var total = 0;
  
        var create = [];
        Object.keys(src.entries).forEach(function (key) {
          var e = src.entries[key];
          var e2 = dst.entries[key];
          if (!e2 || e.timestamp > e2.timestamp) {
            create.push(key);
            total++;
          }
        });
  
        var remove = [];
        Object.keys(dst.entries).forEach(function (key) {
          var e = dst.entries[key];
          var e2 = src.entries[key];
          if (!e2) {
            remove.push(key);
            total++;
          }
        });
  
        if (!total) {
          return callback(null);
        }
  
        var errored = false;
        var completed = 0;
        var db = src.type === 'remote' ? src.db : dst.db;
        var transaction = db.transaction([IDBFS.DB_STORE_NAME], 'readwrite');
        var store = transaction.objectStore(IDBFS.DB_STORE_NAME);
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= total) {
            return callback(null);
          }
        };
  
        transaction.onerror = function() { done(this.error); };
  
        // sort paths in ascending order so directory entries are created
        // before the files inside them
        create.sort().forEach(function (path) {
          if (dst.type === 'local') {
            IDBFS.loadRemoteEntry(store, path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeLocalEntry(path, entry, done);
            });
          } else {
            IDBFS.loadLocalEntry(path, function (err, entry) {
              if (err) return done(err);
              IDBFS.storeRemoteEntry(store, path, entry, done);
            });
          }
        });
  
        // sort paths in descending order so files are deleted before their
        // parent directories
        remove.sort().reverse().forEach(function(path) {
          if (dst.type === 'local') {
            IDBFS.removeLocalEntry(path, done);
          } else {
            IDBFS.removeRemoteEntry(store, path, done);
          }
        });
      }};
  
  var NODEFS={isWindows:false,staticInit:function () {
        NODEFS.isWindows = !!process.platform.match(/^win/);
      },mount:function (mount) {
        assert(ENVIRONMENT_IS_NODE);
        return NODEFS.createNode(null, '/', NODEFS.getMode(mount.opts.root), 0);
      },createNode:function (parent, name, mode, dev) {
        if (!FS.isDir(mode) && !FS.isFile(mode) && !FS.isLink(mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node = FS.createNode(parent, name, mode);
        node.node_ops = NODEFS.node_ops;
        node.stream_ops = NODEFS.stream_ops;
        return node;
      },getMode:function (path) {
        var stat;
        try {
          stat = fs.lstatSync(path);
          if (NODEFS.isWindows) {
            // On Windows, directories return permission bits 'rw-rw-rw-', even though they have 'rwxrwxrwx', so 
            // propagate write bits to execute bits.
            stat.mode = stat.mode | ((stat.mode & 146) >> 1);
          }
        } catch (e) {
          if (!e.code) throw e;
          throw new FS.ErrnoError(ERRNO_CODES[e.code]);
        }
        return stat.mode;
      },realPath:function (node) {
        var parts = [];
        while (node.parent !== node) {
          parts.push(node.name);
          node = node.parent;
        }
        parts.push(node.mount.opts.root);
        parts.reverse();
        return PATH.join.apply(null, parts);
      },flagsToPermissionStringMap:{0:"r",1:"r+",2:"r+",64:"r",65:"r+",66:"r+",129:"rx+",193:"rx+",514:"w+",577:"w",578:"w+",705:"wx",706:"wx+",1024:"a",1025:"a",1026:"a+",1089:"a",1090:"a+",1153:"ax",1154:"ax+",1217:"ax",1218:"ax+",4096:"rs",4098:"rs+"},flagsToPermissionString:function (flags) {
        if (flags in NODEFS.flagsToPermissionStringMap) {
          return NODEFS.flagsToPermissionStringMap[flags];
        } else {
          return flags;
        }
      },node_ops:{getattr:function (node) {
          var path = NODEFS.realPath(node);
          var stat;
          try {
            stat = fs.lstatSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          // node.js v0.10.20 doesn't report blksize and blocks on Windows. Fake them with default blksize of 4096.
          // See http://support.microsoft.com/kb/140365
          if (NODEFS.isWindows && !stat.blksize) {
            stat.blksize = 4096;
          }
          if (NODEFS.isWindows && !stat.blocks) {
            stat.blocks = (stat.size+stat.blksize-1)/stat.blksize|0;
          }
          return {
            dev: stat.dev,
            ino: stat.ino,
            mode: stat.mode,
            nlink: stat.nlink,
            uid: stat.uid,
            gid: stat.gid,
            rdev: stat.rdev,
            size: stat.size,
            atime: stat.atime,
            mtime: stat.mtime,
            ctime: stat.ctime,
            blksize: stat.blksize,
            blocks: stat.blocks
          };
        },setattr:function (node, attr) {
          var path = NODEFS.realPath(node);
          try {
            if (attr.mode !== undefined) {
              fs.chmodSync(path, attr.mode);
              // update the common node structure mode as well
              node.mode = attr.mode;
            }
            if (attr.timestamp !== undefined) {
              var date = new Date(attr.timestamp);
              fs.utimesSync(path, date, date);
            }
            if (attr.size !== undefined) {
              fs.truncateSync(path, attr.size);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },lookup:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          var mode = NODEFS.getMode(path);
          return NODEFS.createNode(parent, name, mode);
        },mknod:function (parent, name, mode, dev) {
          var node = NODEFS.createNode(parent, name, mode, dev);
          // create the backing node for this in the fs root as well
          var path = NODEFS.realPath(node);
          try {
            if (FS.isDir(node.mode)) {
              fs.mkdirSync(path, node.mode);
            } else {
              fs.writeFileSync(path, '', { mode: node.mode });
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return node;
        },rename:function (oldNode, newDir, newName) {
          var oldPath = NODEFS.realPath(oldNode);
          var newPath = PATH.join2(NODEFS.realPath(newDir), newName);
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },unlink:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.unlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },rmdir:function (parent, name) {
          var path = PATH.join2(NODEFS.realPath(parent), name);
          try {
            fs.rmdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readdir:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readdirSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },symlink:function (parent, newName, oldPath) {
          var newPath = PATH.join2(NODEFS.realPath(parent), newName);
          try {
            fs.symlinkSync(oldPath, newPath);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },readlink:function (node) {
          var path = NODEFS.realPath(node);
          try {
            return fs.readlinkSync(path);
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        }},stream_ops:{open:function (stream) {
          var path = NODEFS.realPath(stream.node);
          try {
            if (FS.isFile(stream.node.mode)) {
              stream.nfd = fs.openSync(path, NODEFS.flagsToPermissionString(stream.flags));
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },close:function (stream) {
          try {
            if (FS.isFile(stream.node.mode) && stream.nfd) {
              fs.closeSync(stream.nfd);
            }
          } catch (e) {
            if (!e.code) throw e;
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
        },read:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(length);
          var res;
          try {
            res = fs.readSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          if (res > 0) {
            for (var i = 0; i < res; i++) {
              buffer[offset + i] = nbuffer[i];
            }
          }
          return res;
        },write:function (stream, buffer, offset, length, position) {
          // FIXME this is terrible.
          var nbuffer = new Buffer(buffer.subarray(offset, offset + length));
          var res;
          try {
            res = fs.writeSync(stream.nfd, nbuffer, 0, length, position);
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES[e.code]);
          }
          return res;
        },llseek:function (stream, offset, whence) {
          var position = offset;
          if (whence === 1) {  // SEEK_CUR.
            position += stream.position;
          } else if (whence === 2) {  // SEEK_END.
            if (FS.isFile(stream.node.mode)) {
              try {
                var stat = fs.fstatSync(stream.nfd);
                position += stat.size;
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES[e.code]);
              }
            }
          }
  
          if (position < 0) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
  
          stream.position = position;
          return position;
        }}};
  
  var _stdin=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stdout=allocate(1, "i32*", ALLOC_STATIC);
  
  var _stderr=allocate(1, "i32*", ALLOC_STATIC);
  
  function _fflush(stream) {
      // int fflush(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fflush.html
      // we don't currently perform any user-space buffering of data
    }var FS={root:null,mounts:[],devices:[null],streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,ErrnoError:null,genericErrors:{},handleFSError:function (e) {
        if (!(e instanceof FS.ErrnoError)) throw e + ' : ' + stackTrace();
        return ___setErrNo(e.errno);
      },lookupPath:function (path, opts) {
        path = PATH.resolve(FS.cwd(), path);
        opts = opts || {};
  
        var defaults = {
          follow_mount: true,
          recurse_count: 0
        };
        for (var key in defaults) {
          if (opts[key] === undefined) {
            opts[key] = defaults[key];
          }
        }
  
        if (opts.recurse_count > 8) {  // max recursive lookup of 8
          throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
        }
  
        // split the path
        var parts = PATH.normalizeArray(path.split('/').filter(function(p) {
          return !!p;
        }), false);
  
        // start at the root
        var current = FS.root;
        var current_path = '/';
  
        for (var i = 0; i < parts.length; i++) {
          var islast = (i === parts.length-1);
          if (islast && opts.parent) {
            // stop resolving
            break;
          }
  
          current = FS.lookupNode(current, parts[i]);
          current_path = PATH.join2(current_path, parts[i]);
  
          // jump to the mount's root node if this is a mountpoint
          if (FS.isMountpoint(current)) {
            if (!islast || (islast && opts.follow_mount)) {
              current = current.mounted.root;
            }
          }
  
          // by default, lookupPath will not follow a symlink if it is the final path component.
          // setting opts.follow = true will override this behavior.
          if (!islast || opts.follow) {
            var count = 0;
            while (FS.isLink(current.mode)) {
              var link = FS.readlink(current_path);
              current_path = PATH.resolve(PATH.dirname(current_path), link);
              
              var lookup = FS.lookupPath(current_path, { recurse_count: opts.recurse_count });
              current = lookup.node;
  
              if (count++ > 40) {  // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
                throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
              }
            }
          }
        }
  
        return { path: current_path, node: current };
      },getPath:function (node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? mount + '/' + path : mount + path;
          }
          path = path ? node.name + '/' + path : node.name;
          node = node.parent;
        }
      },hashName:function (parentid, name) {
        var hash = 0;
  
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },hashAddNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },hashRemoveNode:function (node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },lookupNode:function (parent, name) {
        var err = FS.mayLookup(parent);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },createNode:function (parent, name, mode, rdev) {
        if (!FS.FSNode) {
          FS.FSNode = function(parent, name, mode, rdev) {
            if (!parent) {
              parent = this;  // root node sets parent to itself
            }
            this.parent = parent;
            this.mount = parent.mount;
            this.mounted = null;
            this.id = FS.nextInode++;
            this.name = name;
            this.mode = mode;
            this.node_ops = {};
            this.stream_ops = {};
            this.rdev = rdev;
          };
  
          FS.FSNode.prototype = {};
  
          // compatibility
          var readMode = 292 | 73;
          var writeMode = 146;
  
          // NOTE we must use Object.defineProperties instead of individual calls to
          // Object.defineProperty in order to make closure compiler happy
          Object.defineProperties(FS.FSNode.prototype, {
            read: {
              get: function() { return (this.mode & readMode) === readMode; },
              set: function(val) { val ? this.mode |= readMode : this.mode &= ~readMode; }
            },
            write: {
              get: function() { return (this.mode & writeMode) === writeMode; },
              set: function(val) { val ? this.mode |= writeMode : this.mode &= ~writeMode; }
            },
            isFolder: {
              get: function() { return FS.isDir(this.mode); },
            },
            isDevice: {
              get: function() { return FS.isChrdev(this.mode); },
            },
          });
        }
  
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },destroyNode:function (node) {
        FS.hashRemoveNode(node);
      },isRoot:function (node) {
        return node === node.parent;
      },isMountpoint:function (node) {
        return !!node.mounted;
      },isFile:function (mode) {
        return (mode & 61440) === 32768;
      },isDir:function (mode) {
        return (mode & 61440) === 16384;
      },isLink:function (mode) {
        return (mode & 61440) === 40960;
      },isChrdev:function (mode) {
        return (mode & 61440) === 8192;
      },isBlkdev:function (mode) {
        return (mode & 61440) === 24576;
      },isFIFO:function (mode) {
        return (mode & 61440) === 4096;
      },isSocket:function (mode) {
        return (mode & 49152) === 49152;
      },flagModes:{"r":0,"rs":1052672,"r+":2,"w":577,"wx":705,"xw":705,"w+":578,"wx+":706,"xw+":706,"a":1089,"ax":1217,"xa":1217,"a+":1090,"ax+":1218,"xa+":1218},modeStringToFlags:function (str) {
        var flags = FS.flagModes[str];
        if (typeof flags === 'undefined') {
          throw new Error('Unknown file open mode: ' + str);
        }
        return flags;
      },flagsToPermissionString:function (flag) {
        var accmode = flag & 2097155;
        var perms = ['r', 'w', 'rw'][accmode];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },nodePermissions:function (node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.indexOf('r') !== -1 && !(node.mode & 292)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('w') !== -1 && !(node.mode & 146)) {
          return ERRNO_CODES.EACCES;
        } else if (perms.indexOf('x') !== -1 && !(node.mode & 73)) {
          return ERRNO_CODES.EACCES;
        }
        return 0;
      },mayLookup:function (dir) {
        return FS.nodePermissions(dir, 'x');
      },mayCreate:function (dir, name) {
        try {
          var node = FS.lookupNode(dir, name);
          return ERRNO_CODES.EEXIST;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },mayDelete:function (dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var err = FS.nodePermissions(dir, 'wx');
        if (err) {
          return err;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return ERRNO_CODES.ENOTDIR;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return ERRNO_CODES.EBUSY;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return 0;
      },mayOpen:function (node, flags) {
        if (!node) {
          return ERRNO_CODES.ENOENT;
        }
        if (FS.isLink(node.mode)) {
          return ERRNO_CODES.ELOOP;
        } else if (FS.isDir(node.mode)) {
          if ((flags & 2097155) !== 0 ||  // opening for write
              (flags & 512)) {
            return ERRNO_CODES.EISDIR;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },MAX_OPEN_FDS:4096,nextfd:function (fd_start, fd_end) {
        fd_start = fd_start || 0;
        fd_end = fd_end || FS.MAX_OPEN_FDS;
        for (var fd = fd_start; fd <= fd_end; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(ERRNO_CODES.EMFILE);
      },getStream:function (fd) {
        return FS.streams[fd];
      },createStream:function (stream, fd_start, fd_end) {
        if (!FS.FSStream) {
          FS.FSStream = function(){};
          FS.FSStream.prototype = {};
          // compatibility
          Object.defineProperties(FS.FSStream.prototype, {
            object: {
              get: function() { return this.node; },
              set: function(val) { this.node = val; }
            },
            isRead: {
              get: function() { return (this.flags & 2097155) !== 1; }
            },
            isWrite: {
              get: function() { return (this.flags & 2097155) !== 0; }
            },
            isAppend: {
              get: function() { return (this.flags & 1024); }
            }
          });
        }
        if (stream.__proto__) {
          // reuse the object
          stream.__proto__ = FS.FSStream.prototype;
        } else {
          var newStream = new FS.FSStream();
          for (var p in stream) {
            newStream[p] = stream[p];
          }
          stream = newStream;
        }
        var fd = FS.nextfd(fd_start, fd_end);
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },closeStream:function (fd) {
        FS.streams[fd] = null;
      },getStreamFromPtr:function (ptr) {
        return FS.streams[ptr - 1];
      },getPtrForStream:function (stream) {
        return stream ? stream.fd + 1 : 0;
      },chrdev_stream_ops:{open:function (stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          if (stream.stream_ops.open) {
            stream.stream_ops.open(stream);
          }
        },llseek:function () {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }},major:function (dev) {
        return ((dev) >> 8);
      },minor:function (dev) {
        return ((dev) & 0xff);
      },makedev:function (ma, mi) {
        return ((ma) << 8 | (mi));
      },registerDevice:function (dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },getDevice:function (dev) {
        return FS.devices[dev];
      },getMounts:function (mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push.apply(check, m.mounts);
        }
  
        return mounts;
      },syncfs:function (populate, callback) {
        if (typeof(populate) === 'function') {
          callback = populate;
          populate = false;
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function done(err) {
          if (err) {
            if (!done.errored) {
              done.errored = true;
              return callback(err);
            }
            return;
          }
          if (++completed >= mounts.length) {
            callback(null);
          }
        };
  
        // sync all mounts
        mounts.forEach(function (mount) {
          if (!mount.type.syncfs) {
            return done(null);
          }
          mount.type.syncfs(mount, populate, done);
        });
      },mount:function (type, opts, mountpoint) {
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
          }
        }
  
        var mount = {
          type: type,
          opts: opts,
          mountpoint: mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },unmount:function (mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        Object.keys(FS.nameTable).forEach(function (hash) {
          var current = FS.nameTable[hash];
  
          while (current) {
            var next = current.name_next;
  
            if (mounts.indexOf(current.mount) !== -1) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        });
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },lookup:function (parent, name) {
        return parent.node_ops.lookup(parent, name);
      },mknod:function (path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var err = FS.mayCreate(parent, name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },create:function (path, mode) {
        mode = mode !== undefined ? mode : 438 /* 0666 */;
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },mkdir:function (path, mode) {
        mode = mode !== undefined ? mode : 511 /* 0777 */;
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },mkdev:function (path, mode, dev) {
        if (typeof(dev) === 'undefined') {
          dev = mode;
          mode = 438 /* 0666 */;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },symlink:function (oldpath, newpath) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        var newname = PATH.basename(newpath);
        var err = FS.mayCreate(parent, newname);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },rename:function (old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
        try {
          lookup = FS.lookupPath(old_path, { parent: true });
          old_dir = lookup.node;
          lookup = FS.lookupPath(new_path, { parent: true });
          new_dir = lookup.node;
        } catch (e) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        // new path should not be an ancestor of the old path
        relative = PATH.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var err = FS.mayDelete(old_dir, old_name, isdir);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        err = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          err = FS.nodePermissions(old_dir, 'w');
          if (err) {
            throw new FS.ErrnoError(err);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },rmdir:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, true);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },readdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        if (!node.node_ops.readdir) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        return node.node_ops.readdir(node);
      },unlink:function (path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var err = FS.mayDelete(parent, name, false);
        if (err) {
          // POSIX says unlink should set EPERM, not EISDIR
          if (err === ERRNO_CODES.EISDIR) err = ERRNO_CODES.EPERM;
          throw new FS.ErrnoError(err);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },readlink:function (path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        return link.node_ops.readlink(link);
      },stat:function (path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        if (!node.node_ops.getattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        return node.node_ops.getattr(node);
      },lstat:function (path) {
        return FS.stat(path, true);
      },chmod:function (path, mode, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          timestamp: Date.now()
        });
      },lchmod:function (path, mode) {
        FS.chmod(path, mode, true);
      },fchmod:function (fd, mode) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chmod(stream.node, mode);
      },chown:function (path, uid, gid, dontFollow) {
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        node.node_ops.setattr(node, {
          timestamp: Date.now()
          // we ignore the uid / gid for now
        });
      },lchown:function (path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },fchown:function (fd, uid, gid) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        FS.chown(stream.node, uid, gid);
      },truncate:function (path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var node;
        if (typeof path === 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        if (!node.node_ops.setattr) {
          throw new FS.ErrnoError(ERRNO_CODES.EPERM);
        }
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var err = FS.nodePermissions(node, 'w');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        node.node_ops.setattr(node, {
          size: len,
          timestamp: Date.now()
        });
      },ftruncate:function (fd, len) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        FS.truncate(stream.node, len);
      },utime:function (path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        node.node_ops.setattr(node, {
          timestamp: Math.max(atime, mtime)
        });
      },open:function (path, flags, mode, fd_start, fd_end) {
        flags = typeof flags === 'string' ? FS.modeStringToFlags(flags) : flags;
        mode = typeof mode === 'undefined' ? 438 /* 0666 */ : mode;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        if (typeof path === 'object') {
          node = path;
        } else {
          path = PATH.normalize(path);
          try {
            var lookup = FS.lookupPath(path, {
              follow: !(flags & 131072)
            });
            node = lookup.node;
          } catch (e) {
            // ignore
          }
        }
        // perhaps we need to create the node
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(ERRNO_CODES.EEXIST);
            }
          } else {
            // node doesn't exist, try to create it
            node = FS.mknod(path, mode, 0);
          }
        }
        if (!node) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // check permissions
        var err = FS.mayOpen(node, flags);
        if (err) {
          throw new FS.ErrnoError(err);
        }
        // do truncation if necessary
        if ((flags & 512)) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node: node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags: flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        }, fd_start, fd_end);
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!FS.readFiles) FS.readFiles = {};
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
            Module['printErr']('read file: ' + path);
          }
        }
        return stream;
      },close:function (stream) {
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
      },llseek:function (stream, offset, whence) {
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        return stream.stream_ops.llseek(stream, offset, whence);
      },read:function (stream, buffer, offset, length, position) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },write:function (stream, buffer, offset, length, position, canOwn) {
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        var seeking = true;
        if (typeof position === 'undefined') {
          position = stream.position;
          seeking = false;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
        }
        if (stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },allocate:function (stream, offset, length) {
        if (offset < 0 || length <= 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(ERRNO_CODES.EBADF);
        }
        if (!FS.isFile(stream.node.mode) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        if (!stream.stream_ops.allocate) {
          throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
        }
        stream.stream_ops.allocate(stream, offset, length);
      },mmap:function (stream, buffer, offset, length, position, prot, flags) {
        // TODO if PROT is PROT_WRITE, make sure we have write access
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(ERRNO_CODES.EACCES);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
        }
        return stream.stream_ops.mmap(stream, buffer, offset, length, position, prot, flags);
      },ioctl:function (stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },readFile:function (path, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'r';
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var ret;
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          ret = '';
          var utf8 = new Runtime.UTF8Processor();
          for (var i = 0; i < length; i++) {
            ret += utf8.processCChar(buf[i]);
          }
        } else if (opts.encoding === 'binary') {
          ret = buf;
        }
        FS.close(stream);
        return ret;
      },writeFile:function (path, data, opts) {
        opts = opts || {};
        opts.flags = opts.flags || 'w';
        opts.encoding = opts.encoding || 'utf8';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          throw new Error('Invalid encoding type "' + opts.encoding + '"');
        }
        var stream = FS.open(path, opts.flags, opts.mode);
        if (opts.encoding === 'utf8') {
          var utf8 = new Runtime.UTF8Processor();
          var buf = new Uint8Array(utf8.processJSString(data));
          FS.write(stream, buf, 0, buf.length, 0, opts.canOwn);
        } else if (opts.encoding === 'binary') {
          FS.write(stream, data, 0, data.length, 0, opts.canOwn);
        }
        FS.close(stream);
      },cwd:function () {
        return FS.currentPath;
      },chdir:function (path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
        }
        var err = FS.nodePermissions(lookup.node, 'x');
        if (err) {
          throw new FS.ErrnoError(err);
        }
        FS.currentPath = lookup.path;
      },createDefaultDirectories:function () {
        FS.mkdir('/tmp');
      },createDefaultDevices:function () {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: function() { return 0; },
          write: function() { return 0; }
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using Module['printErr']
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },createStandardStreams:function () {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (Module['stdin']) {
          FS.createDevice('/dev', 'stdin', Module['stdin']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (Module['stdout']) {
          FS.createDevice('/dev', 'stdout', null, Module['stdout']);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (Module['stderr']) {
          FS.createDevice('/dev', 'stderr', null, Module['stderr']);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 'r');
        HEAP32[((_stdin)>>2)]=FS.getPtrForStream(stdin);
        assert(stdin.fd === 0, 'invalid handle for stdin (' + stdin.fd + ')');
  
        var stdout = FS.open('/dev/stdout', 'w');
        HEAP32[((_stdout)>>2)]=FS.getPtrForStream(stdout);
        assert(stdout.fd === 1, 'invalid handle for stdout (' + stdout.fd + ')');
  
        var stderr = FS.open('/dev/stderr', 'w');
        HEAP32[((_stderr)>>2)]=FS.getPtrForStream(stderr);
        assert(stderr.fd === 2, 'invalid handle for stderr (' + stderr.fd + ')');
      },ensureErrnoError:function () {
        if (FS.ErrnoError) return;
        FS.ErrnoError = function ErrnoError(errno) {
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
          this.message = ERRNO_MESSAGES[errno];
        };
        FS.ErrnoError.prototype = new Error();
        FS.ErrnoError.prototype.constructor = FS.ErrnoError;
        // Some errors may happen quite a bit, to avoid overhead we reuse them (and suffer a lack of stack info)
        [ERRNO_CODES.ENOENT].forEach(function(code) {
          FS.genericErrors[code] = new FS.ErrnoError(code);
          FS.genericErrors[code].stack = '<generic error, no stack>';
        });
      },staticInit:function () {
        FS.ensureErrnoError();
  
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
      },init:function (input, output, error) {
        assert(!FS.init.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.init.initialized = true;
  
        FS.ensureErrnoError();
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        Module['stdin'] = input || Module['stdin'];
        Module['stdout'] = output || Module['stdout'];
        Module['stderr'] = error || Module['stderr'];
  
        FS.createStandardStreams();
      },quit:function () {
        FS.init.initialized = false;
        for (var i = 0; i < FS.streams.length; i++) {
          var stream = FS.streams[i];
          if (!stream) {
            continue;
          }
          FS.close(stream);
        }
      },getMode:function (canRead, canWrite) {
        var mode = 0;
        if (canRead) mode |= 292 | 73;
        if (canWrite) mode |= 146;
        return mode;
      },joinPath:function (parts, forceRelative) {
        var path = PATH.join.apply(null, parts);
        if (forceRelative && path[0] == '/') path = path.substr(1);
        return path;
      },absolutePath:function (relative, base) {
        return PATH.resolve(base, relative);
      },standardizePath:function (path) {
        return PATH.normalize(path);
      },findObject:function (path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (ret.exists) {
          return ret.object;
        } else {
          ___setErrNo(ret.error);
          return null;
        }
      },analyzePath:function (path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },createFolder:function (parent, name, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.mkdir(path, mode);
      },createPath:function (parent, path, canRead, canWrite) {
        parent = typeof parent === 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            // ignore EEXIST
          }
          parent = current;
        }
        return current;
      },createFile:function (parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(canRead, canWrite);
        return FS.create(path, mode);
      },createDataFile:function (parent, name, data, canRead, canWrite, canOwn) {
        var path = name ? PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name) : parent;
        var mode = FS.getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data === 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 'w');
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
        return node;
      },createDevice:function (parent, name, input, output) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        var mode = FS.getMode(!!input, !!output);
        if (!FS.createDevice.major) FS.createDevice.major = 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open: function(stream) {
            stream.seekable = false;
          },
          close: function(stream) {
            // flush any pending line data
            if (output && output.buffer && output.buffer.length) {
              output(10);
            }
          },
          read: function(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.timestamp = Date.now();
            }
            return bytesRead;
          },
          write: function(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(ERRNO_CODES.EIO);
              }
            }
            if (length) {
              stream.node.timestamp = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },createLink:function (parent, name, target, canRead, canWrite) {
        var path = PATH.join2(typeof parent === 'string' ? parent : FS.getPath(parent), name);
        return FS.symlink(target, path);
      },forceLoadFile:function (obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        var success = true;
        if (typeof XMLHttpRequest !== 'undefined') {
          throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else if (Module['read']) {
          // Command-line.
          try {
            // WARNING: Can't read binary files in V8's d8 or tracemonkey's js, as
            //          read() will try to parse UTF8.
            obj.contents = intArrayFromString(Module['read'](obj.url), true);
          } catch (e) {
            success = false;
          }
        } else {
          throw new Error('Cannot load without read() or XMLHttpRequest.');
        }
        if (!success) ___setErrNo(ERRNO_CODES.EIO);
        return success;
      },createLazyFile:function (parent, name, url, canRead, canWrite) {
        if (typeof XMLHttpRequest !== 'undefined') {
          if (!ENVIRONMENT_IS_WORKER) throw 'Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc';
          // Lazy chunked Uint8Array (implements get and length from Uint8Array). Actual getting is abstracted away for eventual reuse.
          function LazyUint8Array() {
            this.lengthKnown = false;
            this.chunks = []; // Loaded chunks. Index is the chunk number
          }
          LazyUint8Array.prototype.get = function LazyUint8Array_get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = Math.floor(idx / this.chunkSize);
            return this.getter(chunkNum)[chunkOffset];
          }
          LazyUint8Array.prototype.setDataGetter = function LazyUint8Array_setDataGetter(getter) {
            this.getter = getter;
          }
          LazyUint8Array.prototype.cacheLength = function LazyUint8Array_cacheLength() {
              // Find length
              var xhr = new XMLHttpRequest();
              xhr.open('HEAD', url, false);
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
              var datalength = Number(xhr.getResponseHeader("Content-length"));
              var header;
              var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
              var chunkSize = 1024*1024; // Chunk size in bytes
  
              if (!hasByteServing) chunkSize = datalength;
  
              // Function to get a range from the remote URL.
              var doXHR = (function(from, to) {
                if (from > to) throw new Error("invalid range (" + from + ", " + to + ") or no bytes requested!");
                if (to > datalength-1) throw new Error("only " + datalength + " bytes available! programmer error!");
  
                // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, false);
                if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
                // Some hints to the browser that we want binary data.
                if (typeof Uint8Array != 'undefined') xhr.responseType = 'arraybuffer';
                if (xhr.overrideMimeType) {
                  xhr.overrideMimeType('text/plain; charset=x-user-defined');
                }
  
                xhr.send(null);
                if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) throw new Error("Couldn't load " + url + ". Status: " + xhr.status);
                if (xhr.response !== undefined) {
                  return new Uint8Array(xhr.response || []);
                } else {
                  return intArrayFromString(xhr.responseText || '', true);
                }
              });
              var lazyArray = this;
              lazyArray.setDataGetter(function(chunkNum) {
                var start = chunkNum * chunkSize;
                var end = (chunkNum+1) * chunkSize - 1; // including this byte
                end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") {
                  lazyArray.chunks[chunkNum] = doXHR(start, end);
                }
                if (typeof(lazyArray.chunks[chunkNum]) === "undefined") throw new Error("doXHR failed!");
                return lazyArray.chunks[chunkNum];
              });
  
              this._length = datalength;
              this._chunkSize = chunkSize;
              this.lengthKnown = true;
          }
  
          var lazyArray = new LazyUint8Array();
          Object.defineProperty(lazyArray, "length", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._length;
              }
          });
          Object.defineProperty(lazyArray, "chunkSize", {
              get: function() {
                  if(!this.lengthKnown) {
                      this.cacheLength();
                  }
                  return this._chunkSize;
              }
          });
  
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        var keys = Object.keys(node.stream_ops);
        keys.forEach(function(key) {
          var fn = node.stream_ops[key];
          stream_ops[key] = function forceLoadLazyFile() {
            if (!FS.forceLoadFile(node)) {
              throw new FS.ErrnoError(ERRNO_CODES.EIO);
            }
            return fn.apply(null, arguments);
          };
        });
        // use a custom read function
        stream_ops.read = function stream_ops_read(stream, buffer, offset, length, position) {
          if (!FS.forceLoadFile(node)) {
            throw new FS.ErrnoError(ERRNO_CODES.EIO);
          }
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        };
        node.stream_ops = stream_ops;
        return node;
      },createPreloadedFile:function (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn) {
        Browser.init();
        // TODO we should allow people to just pass in a complete filename instead
        // of parent and name being that we just join them anyways
        var fullname = name ? PATH.resolve(PATH.join2(parent, name)) : parent;
        function processData(byteArray) {
          function finish(byteArray) {
            if (!dontCreateFile) {
              FS.createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
            }
            if (onload) onload();
            removeRunDependency('cp ' + fullname);
          }
          var handled = false;
          Module['preloadPlugins'].forEach(function(plugin) {
            if (handled) return;
            if (plugin['canHandle'](fullname)) {
              plugin['handle'](byteArray, fullname, finish, function() {
                if (onerror) onerror();
                removeRunDependency('cp ' + fullname);
              });
              handled = true;
            }
          });
          if (!handled) finish(byteArray);
        }
        addRunDependency('cp ' + fullname);
        if (typeof url == 'string') {
          Browser.asyncLoad(url, function(byteArray) {
            processData(byteArray);
          }, onerror);
        } else {
          processData(url);
        }
      },indexedDB:function () {
        return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
      },DB_NAME:function () {
        return 'EM_FS_' + window.location.pathname;
      },DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = function openRequest_onupgradeneeded() {
          console.log('creating db');
          var db = openRequest.result;
          db.createObjectStore(FS.DB_STORE_NAME);
        };
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          var transaction = db.transaction([FS.DB_STORE_NAME], 'readwrite');
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var putRequest = files.put(FS.analyzePath(path).object.contents, path);
            putRequest.onsuccess = function putRequest_onsuccess() { ok++; if (ok + fail == total) finish() };
            putRequest.onerror = function putRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      },loadFilesFromDB:function (paths, onload, onerror) {
        onload = onload || function(){};
        onerror = onerror || function(){};
        var indexedDB = FS.indexedDB();
        try {
          var openRequest = indexedDB.open(FS.DB_NAME(), FS.DB_VERSION);
        } catch (e) {
          return onerror(e);
        }
        openRequest.onupgradeneeded = onerror; // no database to load from
        openRequest.onsuccess = function openRequest_onsuccess() {
          var db = openRequest.result;
          try {
            var transaction = db.transaction([FS.DB_STORE_NAME], 'readonly');
          } catch(e) {
            onerror(e);
            return;
          }
          var files = transaction.objectStore(FS.DB_STORE_NAME);
          var ok = 0, fail = 0, total = paths.length;
          function finish() {
            if (fail == 0) onload(); else onerror();
          }
          paths.forEach(function(path) {
            var getRequest = files.get(path);
            getRequest.onsuccess = function getRequest_onsuccess() {
              if (FS.analyzePath(path).exists) {
                FS.unlink(path);
              }
              FS.createDataFile(PATH.dirname(path), PATH.basename(path), getRequest.result, true, true, true);
              ok++;
              if (ok + fail == total) finish();
            };
            getRequest.onerror = function getRequest_onerror() { fail++; if (ok + fail == total) finish() };
          });
          transaction.onerror = onerror;
        };
        openRequest.onerror = onerror;
      }};
  
  
  
  
  function _mkport() { throw 'TODO' }var SOCKFS={mount:function (mount) {
        return FS.createNode(null, '/', 16384 | 511 /* 0777 */, 0);
      },createSocket:function (family, type, protocol) {
        var streaming = type == 1;
        if (protocol) {
          assert(streaming == (protocol == 6)); // if SOCK_STREAM, must be tcp
        }
  
        // create our internal socket structure
        var sock = {
          family: family,
          type: type,
          protocol: protocol,
          server: null,
          peers: {},
          pending: [],
          recv_queue: [],
          sock_ops: SOCKFS.websocket_sock_ops
        };
  
        // create the filesystem node to store the socket structure
        var name = SOCKFS.nextname();
        var node = FS.createNode(SOCKFS.root, name, 49152, 0);
        node.sock = sock;
  
        // and the wrapping stream that enables library functions such
        // as read and write to indirectly interact with the socket
        var stream = FS.createStream({
          path: name,
          node: node,
          flags: FS.modeStringToFlags('r+'),
          seekable: false,
          stream_ops: SOCKFS.stream_ops
        });
  
        // map the new stream to the socket structure (sockets have a 1:1
        // relationship with a stream)
        sock.stream = stream;
  
        return sock;
      },getSocket:function (fd) {
        var stream = FS.getStream(fd);
        if (!stream || !FS.isSocket(stream.node.mode)) {
          return null;
        }
        return stream.node.sock;
      },stream_ops:{poll:function (stream) {
          var sock = stream.node.sock;
          return sock.sock_ops.poll(sock);
        },ioctl:function (stream, request, varargs) {
          var sock = stream.node.sock;
          return sock.sock_ops.ioctl(sock, request, varargs);
        },read:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          var msg = sock.sock_ops.recvmsg(sock, length);
          if (!msg) {
            // socket is closed
            return 0;
          }
          buffer.set(msg.buffer, offset);
          return msg.buffer.length;
        },write:function (stream, buffer, offset, length, position /* ignored */) {
          var sock = stream.node.sock;
          return sock.sock_ops.sendmsg(sock, buffer, offset, length);
        },close:function (stream) {
          var sock = stream.node.sock;
          sock.sock_ops.close(sock);
        }},nextname:function () {
        if (!SOCKFS.nextname.current) {
          SOCKFS.nextname.current = 0;
        }
        return 'socket[' + (SOCKFS.nextname.current++) + ']';
      },websocket_sock_ops:{createPeer:function (sock, addr, port) {
          var ws;
  
          if (typeof addr === 'object') {
            ws = addr;
            addr = null;
            port = null;
          }
  
          if (ws) {
            // for sockets that've already connected (e.g. we're the server)
            // we can inspect the _socket property for the address
            if (ws._socket) {
              addr = ws._socket.remoteAddress;
              port = ws._socket.remotePort;
            }
            // if we're just now initializing a connection to the remote,
            // inspect the url property
            else {
              var result = /ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);
              if (!result) {
                throw new Error('WebSocket URL must be in the format ws(s)://address:port');
              }
              addr = result[1];
              port = parseInt(result[2], 10);
            }
          } else {
            // create the actual websocket object and connect
            try {
              var url = 'ws://' + addr + ':' + port;
              // the node ws library API is slightly different than the browser's
              var opts = ENVIRONMENT_IS_NODE ? {headers: {'websocket-protocol': ['binary']}} : ['binary'];
              // If node we use the ws library.
              var WebSocket = ENVIRONMENT_IS_NODE ? require('ws') : window['WebSocket'];
              ws = new WebSocket(url, opts);
              ws.binaryType = 'arraybuffer';
            } catch (e) {
              throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH);
            }
          }
  
  
          var peer = {
            addr: addr,
            port: port,
            socket: ws,
            dgram_send_queue: []
          };
  
          SOCKFS.websocket_sock_ops.addPeer(sock, peer);
          SOCKFS.websocket_sock_ops.handlePeerEvents(sock, peer);
  
          // if this is a bound dgram socket, send the port number first to allow
          // us to override the ephemeral port reported to us by remotePort on the
          // remote end.
          if (sock.type === 2 && typeof sock.sport !== 'undefined') {
            peer.dgram_send_queue.push(new Uint8Array([
                255, 255, 255, 255,
                'p'.charCodeAt(0), 'o'.charCodeAt(0), 'r'.charCodeAt(0), 't'.charCodeAt(0),
                ((sock.sport & 0xff00) >> 8) , (sock.sport & 0xff)
            ]));
          }
  
          return peer;
        },getPeer:function (sock, addr, port) {
          return sock.peers[addr + ':' + port];
        },addPeer:function (sock, peer) {
          sock.peers[peer.addr + ':' + peer.port] = peer;
        },removePeer:function (sock, peer) {
          delete sock.peers[peer.addr + ':' + peer.port];
        },handlePeerEvents:function (sock, peer) {
          var first = true;
  
          var handleOpen = function () {
            try {
              var queued = peer.dgram_send_queue.shift();
              while (queued) {
                peer.socket.send(queued);
                queued = peer.dgram_send_queue.shift();
              }
            } catch (e) {
              // not much we can do here in the way of proper error handling as we've already
              // lied and said this data was sent. shut it down.
              peer.socket.close();
            }
          };
  
          function handleMessage(data) {
            assert(typeof data !== 'string' && data.byteLength !== undefined);  // must receive an ArrayBuffer
            data = new Uint8Array(data);  // make a typed array view on the array buffer
  
  
            // if this is the port message, override the peer's port with it
            var wasfirst = first;
            first = false;
            if (wasfirst &&
                data.length === 10 &&
                data[0] === 255 && data[1] === 255 && data[2] === 255 && data[3] === 255 &&
                data[4] === 'p'.charCodeAt(0) && data[5] === 'o'.charCodeAt(0) && data[6] === 'r'.charCodeAt(0) && data[7] === 't'.charCodeAt(0)) {
              // update the peer's port and it's key in the peer map
              var newport = ((data[8] << 8) | data[9]);
              SOCKFS.websocket_sock_ops.removePeer(sock, peer);
              peer.port = newport;
              SOCKFS.websocket_sock_ops.addPeer(sock, peer);
              return;
            }
  
            sock.recv_queue.push({ addr: peer.addr, port: peer.port, data: data });
          };
  
          if (ENVIRONMENT_IS_NODE) {
            peer.socket.on('open', handleOpen);
            peer.socket.on('message', function(data, flags) {
              if (!flags.binary) {
                return;
              }
              handleMessage((new Uint8Array(data)).buffer);  // copy from node Buffer -> ArrayBuffer
            });
            peer.socket.on('error', function() {
              // don't throw
            });
          } else {
            peer.socket.onopen = handleOpen;
            peer.socket.onmessage = function peer_socket_onmessage(event) {
              handleMessage(event.data);
            };
          }
        },poll:function (sock) {
          if (sock.type === 1 && sock.server) {
            // listen sockets should only say they're available for reading
            // if there are pending clients.
            return sock.pending.length ? (64 | 1) : 0;
          }
  
          var mask = 0;
          var dest = sock.type === 1 ?  // we only care about the socket state for connection-based sockets
            SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport) :
            null;
  
          if (sock.recv_queue.length ||
              !dest ||  // connection-less sockets are always ready to read
              (dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {  // let recv return 0 once closed
            mask |= (64 | 1);
          }
  
          if (!dest ||  // connection-less sockets are always ready to write
              (dest && dest.socket.readyState === dest.socket.OPEN)) {
            mask |= 4;
          }
  
          if ((dest && dest.socket.readyState === dest.socket.CLOSING) ||
              (dest && dest.socket.readyState === dest.socket.CLOSED)) {
            mask |= 16;
          }
  
          return mask;
        },ioctl:function (sock, request, arg) {
          switch (request) {
            case 21531:
              var bytes = 0;
              if (sock.recv_queue.length) {
                bytes = sock.recv_queue[0].data.length;
              }
              HEAP32[((arg)>>2)]=bytes;
              return 0;
            default:
              return ERRNO_CODES.EINVAL;
          }
        },close:function (sock) {
          // if we've spawned a listen server, close it
          if (sock.server) {
            try {
              sock.server.close();
            } catch (e) {
            }
            sock.server = null;
          }
          // close any peer connections
          var peers = Object.keys(sock.peers);
          for (var i = 0; i < peers.length; i++) {
            var peer = sock.peers[peers[i]];
            try {
              peer.socket.close();
            } catch (e) {
            }
            SOCKFS.websocket_sock_ops.removePeer(sock, peer);
          }
          return 0;
        },bind:function (sock, addr, port) {
          if (typeof sock.saddr !== 'undefined' || typeof sock.sport !== 'undefined') {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already bound
          }
          sock.saddr = addr;
          sock.sport = port || _mkport();
          // in order to emulate dgram sockets, we need to launch a listen server when
          // binding on a connection-less socket
          // note: this is only required on the server side
          if (sock.type === 2) {
            // close the existing server if it exists
            if (sock.server) {
              sock.server.close();
              sock.server = null;
            }
            // swallow error operation not supported error that occurs when binding in the
            // browser where this isn't supported
            try {
              sock.sock_ops.listen(sock, 0);
            } catch (e) {
              if (!(e instanceof FS.ErrnoError)) throw e;
              if (e.errno !== ERRNO_CODES.EOPNOTSUPP) throw e;
            }
          }
        },connect:function (sock, addr, port) {
          if (sock.server) {
            throw new FS.ErrnoError(ERRNO_CODS.EOPNOTSUPP);
          }
  
          // TODO autobind
          // if (!sock.addr && sock.type == 2) {
          // }
  
          // early out if we're already connected / in the middle of connecting
          if (typeof sock.daddr !== 'undefined' && typeof sock.dport !== 'undefined') {
            var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
            if (dest) {
              if (dest.socket.readyState === dest.socket.CONNECTING) {
                throw new FS.ErrnoError(ERRNO_CODES.EALREADY);
              } else {
                throw new FS.ErrnoError(ERRNO_CODES.EISCONN);
              }
            }
          }
  
          // add the socket to our peer list and set our
          // destination address / port to match
          var peer = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
          sock.daddr = peer.addr;
          sock.dport = peer.port;
  
          // always "fail" in non-blocking mode
          throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS);
        },listen:function (sock, backlog) {
          if (!ENVIRONMENT_IS_NODE) {
            throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
          }
          if (sock.server) {
             throw new FS.ErrnoError(ERRNO_CODES.EINVAL);  // already listening
          }
          var WebSocketServer = require('ws').Server;
          var host = sock.saddr;
          sock.server = new WebSocketServer({
            host: host,
            port: sock.sport
            // TODO support backlog
          });
  
          sock.server.on('connection', function(ws) {
            if (sock.type === 1) {
              var newsock = SOCKFS.createSocket(sock.family, sock.type, sock.protocol);
  
              // create a peer on the new socket
              var peer = SOCKFS.websocket_sock_ops.createPeer(newsock, ws);
              newsock.daddr = peer.addr;
              newsock.dport = peer.port;
  
              // push to queue for accept to pick up
              sock.pending.push(newsock);
            } else {
              // create a peer on the listen socket so calling sendto
              // with the listen socket and an address will resolve
              // to the correct client
              SOCKFS.websocket_sock_ops.createPeer(sock, ws);
            }
          });
          sock.server.on('closed', function() {
            sock.server = null;
          });
          sock.server.on('error', function() {
            // don't throw
          });
        },accept:function (listensock) {
          if (!listensock.server) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
          var newsock = listensock.pending.shift();
          newsock.stream.flags = listensock.stream.flags;
          return newsock;
        },getname:function (sock, peer) {
          var addr, port;
          if (peer) {
            if (sock.daddr === undefined || sock.dport === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            }
            addr = sock.daddr;
            port = sock.dport;
          } else {
            // TODO saddr and sport will be set for bind()'d UDP sockets, but what
            // should we be returning for TCP sockets that've been connect()'d?
            addr = sock.saddr || 0;
            port = sock.sport || 0;
          }
          return { addr: addr, port: port };
        },sendmsg:function (sock, buffer, offset, length, addr, port) {
          if (sock.type === 2) {
            // connection-less sockets will honor the message address,
            // and otherwise fall back to the bound destination address
            if (addr === undefined || port === undefined) {
              addr = sock.daddr;
              port = sock.dport;
            }
            // if there was no address to fall back to, error out
            if (addr === undefined || port === undefined) {
              throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ);
            }
          } else {
            // connection-based sockets will only use the bound
            addr = sock.daddr;
            port = sock.dport;
          }
  
          // find the peer for the destination address
          var dest = SOCKFS.websocket_sock_ops.getPeer(sock, addr, port);
  
          // early out if not connected with a connection-based socket
          if (sock.type === 1) {
            if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
              throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
            } else if (dest.socket.readyState === dest.socket.CONNECTING) {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // create a copy of the incoming data to send, as the WebSocket API
          // doesn't work entirely with an ArrayBufferView, it'll just send
          // the entire underlying buffer
          var data;
          if (buffer instanceof Array || buffer instanceof ArrayBuffer) {
            data = buffer.slice(offset, offset + length);
          } else {  // ArrayBufferView
            data = buffer.buffer.slice(buffer.byteOffset + offset, buffer.byteOffset + offset + length);
          }
  
          // if we're emulating a connection-less dgram socket and don't have
          // a cached connection, queue the buffer to send upon connect and
          // lie, saying the data was sent now.
          if (sock.type === 2) {
            if (!dest || dest.socket.readyState !== dest.socket.OPEN) {
              // if we're not connected, open a new connection
              if (!dest || dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                dest = SOCKFS.websocket_sock_ops.createPeer(sock, addr, port);
              }
              dest.dgram_send_queue.push(data);
              return length;
            }
          }
  
          try {
            // send the actual data
            dest.socket.send(data);
            return length;
          } catch (e) {
            throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
          }
        },recvmsg:function (sock, length) {
          // http://pubs.opengroup.org/onlinepubs/7908799/xns/recvmsg.html
          if (sock.type === 1 && sock.server) {
            // tcp servers should not be recv()'ing on the listen socket
            throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
          }
  
          var queued = sock.recv_queue.shift();
          if (!queued) {
            if (sock.type === 1) {
              var dest = SOCKFS.websocket_sock_ops.getPeer(sock, sock.daddr, sock.dport);
  
              if (!dest) {
                // if we have a destination address but are not connected, error out
                throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN);
              }
              else if (dest.socket.readyState === dest.socket.CLOSING || dest.socket.readyState === dest.socket.CLOSED) {
                // return null if the socket has closed
                return null;
              }
              else {
                // else, our socket is in a valid state but truly has nothing available
                throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
              }
            } else {
              throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
            }
          }
  
          // queued.data will be an ArrayBuffer if it's unadulterated, but if it's
          // requeued TCP data it'll be an ArrayBufferView
          var queuedLength = queued.data.byteLength || queued.data.length;
          var queuedOffset = queued.data.byteOffset || 0;
          var queuedBuffer = queued.data.buffer || queued.data;
          var bytesRead = Math.min(length, queuedLength);
          var res = {
            buffer: new Uint8Array(queuedBuffer, queuedOffset, bytesRead),
            addr: queued.addr,
            port: queued.port
          };
  
  
          // push back any unread data for TCP connections
          if (sock.type === 1 && bytesRead < queuedLength) {
            var bytesRemaining = queuedLength - bytesRead;
            queued.data = new Uint8Array(queuedBuffer, queuedOffset + bytesRead, bytesRemaining);
            sock.recv_queue.unshift(queued);
          }
  
          return res;
        }}};function _send(fd, buf, len, flags) {
      var sock = SOCKFS.getSocket(fd);
      if (!sock) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      // TODO honor flags
      return _write(fd, buf, len);
    }
  
  function _pwrite(fildes, buf, nbyte, offset) {
      // ssize_t pwrite(int fildes, const void *buf, size_t nbyte, off_t offset);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte, offset);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }function _write(fildes, buf, nbyte) {
      // ssize_t write(int fildes, const void *buf, size_t nbyte);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/write.html
      var stream = FS.getStream(fildes);
      if (!stream) {
        ___setErrNo(ERRNO_CODES.EBADF);
        return -1;
      }
  
  
      try {
        var slab = HEAP8;
        return FS.write(stream, slab, buf, nbyte);
      } catch (e) {
        FS.handleFSError(e);
        return -1;
      }
    }
  
  function _fileno(stream) {
      // int fileno(FILE *stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fileno.html
      stream = FS.getStreamFromPtr(stream);
      if (!stream) return -1;
      return stream.fd;
    }function _fwrite(ptr, size, nitems, stream) {
      // size_t fwrite(const void *restrict ptr, size_t size, size_t nitems, FILE *restrict stream);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/fwrite.html
      var bytesToWrite = nitems * size;
      if (bytesToWrite == 0) return 0;
      var fd = _fileno(stream);
      var bytesWritten = _write(fd, ptr, bytesToWrite);
      if (bytesWritten == -1) {
        var streamObj = FS.getStreamFromPtr(stream);
        if (streamObj) streamObj.error = true;
        return 0;
      } else {
        return Math.floor(bytesWritten / size);
      }
    }
  
  
   
  Module["_strlen"] = _strlen;
  
  function __reallyNegative(x) {
      return x < 0 || (x === 0 && (1/x) === -Infinity);
    }function __formatString(format, varargs) {
      var textIndex = format;
      var argIndex = 0;
      function getNextArg(type) {
        // NOTE: Explicitly ignoring type safety. Otherwise this fails:
        //       int x = 4; printf("%c\n", (char)x);
        var ret;
        if (type === 'double') {
          ret = (HEAP32[((tempDoublePtr)>>2)]=HEAP32[(((varargs)+(argIndex))>>2)],HEAP32[(((tempDoublePtr)+(4))>>2)]=HEAP32[(((varargs)+((argIndex)+(4)))>>2)],(+(HEAPF64[(tempDoublePtr)>>3])));
        } else if (type == 'i64') {
          ret = [HEAP32[(((varargs)+(argIndex))>>2)],
                 HEAP32[(((varargs)+(argIndex+4))>>2)]];
  
        } else {
          type = 'i32'; // varargs are always i32, i64, or double
          ret = HEAP32[(((varargs)+(argIndex))>>2)];
        }
        argIndex += Runtime.getNativeFieldSize(type);
        return ret;
      }
  
      var ret = [];
      var curr, next, currArg;
      while(1) {
        var startTextIndex = textIndex;
        curr = HEAP8[(textIndex)];
        if (curr === 0) break;
        next = HEAP8[((textIndex+1)|0)];
        if (curr == 37) {
          // Handle flags.
          var flagAlwaysSigned = false;
          var flagLeftAlign = false;
          var flagAlternative = false;
          var flagZeroPad = false;
          var flagPadSign = false;
          flagsLoop: while (1) {
            switch (next) {
              case 43:
                flagAlwaysSigned = true;
                break;
              case 45:
                flagLeftAlign = true;
                break;
              case 35:
                flagAlternative = true;
                break;
              case 48:
                if (flagZeroPad) {
                  break flagsLoop;
                } else {
                  flagZeroPad = true;
                  break;
                }
              case 32:
                flagPadSign = true;
                break;
              default:
                break flagsLoop;
            }
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          }
  
          // Handle width.
          var width = 0;
          if (next == 42) {
            width = getNextArg('i32');
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
          } else {
            while (next >= 48 && next <= 57) {
              width = width * 10 + (next - 48);
              textIndex++;
              next = HEAP8[((textIndex+1)|0)];
            }
          }
  
          // Handle precision.
          var precisionSet = false, precision = -1;
          if (next == 46) {
            precision = 0;
            precisionSet = true;
            textIndex++;
            next = HEAP8[((textIndex+1)|0)];
            if (next == 42) {
              precision = getNextArg('i32');
              textIndex++;
            } else {
              while(1) {
                var precisionChr = HEAP8[((textIndex+1)|0)];
                if (precisionChr < 48 ||
                    precisionChr > 57) break;
                precision = precision * 10 + (precisionChr - 48);
                textIndex++;
              }
            }
            next = HEAP8[((textIndex+1)|0)];
          }
          if (precision < 0) {
            precision = 6; // Standard default.
            precisionSet = false;
          }
  
          // Handle integer sizes. WARNING: These assume a 32-bit architecture!
          var argSize;
          switch (String.fromCharCode(next)) {
            case 'h':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 104) {
                textIndex++;
                argSize = 1; // char (actually i32 in varargs)
              } else {
                argSize = 2; // short (actually i32 in varargs)
              }
              break;
            case 'l':
              var nextNext = HEAP8[((textIndex+2)|0)];
              if (nextNext == 108) {
                textIndex++;
                argSize = 8; // long long
              } else {
                argSize = 4; // long
              }
              break;
            case 'L': // long long
            case 'q': // int64_t
            case 'j': // intmax_t
              argSize = 8;
              break;
            case 'z': // size_t
            case 't': // ptrdiff_t
            case 'I': // signed ptrdiff_t or unsigned size_t
              argSize = 4;
              break;
            default:
              argSize = null;
          }
          if (argSize) textIndex++;
          next = HEAP8[((textIndex+1)|0)];
  
          // Handle type specifier.
          switch (String.fromCharCode(next)) {
            case 'd': case 'i': case 'u': case 'o': case 'x': case 'X': case 'p': {
              // Integer.
              var signed = next == 100 || next == 105;
              argSize = argSize || 4;
              var currArg = getNextArg('i' + (argSize * 8));
              var origArg = currArg;
              var argText;
              // Flatten i64-1 [low, high] into a (slightly rounded) double
              if (argSize == 8) {
                currArg = Runtime.makeBigInt(currArg[0], currArg[1], next == 117);
              }
              // Truncate to requested size.
              if (argSize <= 4) {
                var limit = Math.pow(256, argSize) - 1;
                currArg = (signed ? reSign : unSign)(currArg & limit, argSize * 8);
              }
              // Format the number.
              var currAbsArg = Math.abs(currArg);
              var prefix = '';
              if (next == 100 || next == 105) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], null); else
                argText = reSign(currArg, 8 * argSize, 1).toString(10);
              } else if (next == 117) {
                if (argSize == 8 && i64Math) argText = i64Math.stringify(origArg[0], origArg[1], true); else
                argText = unSign(currArg, 8 * argSize, 1).toString(10);
                currArg = Math.abs(currArg);
              } else if (next == 111) {
                argText = (flagAlternative ? '0' : '') + currAbsArg.toString(8);
              } else if (next == 120 || next == 88) {
                prefix = (flagAlternative && currArg != 0) ? '0x' : '';
                if (argSize == 8 && i64Math) {
                  if (origArg[1]) {
                    argText = (origArg[1]>>>0).toString(16);
                    var lower = (origArg[0]>>>0).toString(16);
                    while (lower.length < 8) lower = '0' + lower;
                    argText += lower;
                  } else {
                    argText = (origArg[0]>>>0).toString(16);
                  }
                } else
                if (currArg < 0) {
                  // Represent negative numbers in hex as 2's complement.
                  currArg = -currArg;
                  argText = (currAbsArg - 1).toString(16);
                  var buffer = [];
                  for (var i = 0; i < argText.length; i++) {
                    buffer.push((0xF - parseInt(argText[i], 16)).toString(16));
                  }
                  argText = buffer.join('');
                  while (argText.length < argSize * 2) argText = 'f' + argText;
                } else {
                  argText = currAbsArg.toString(16);
                }
                if (next == 88) {
                  prefix = prefix.toUpperCase();
                  argText = argText.toUpperCase();
                }
              } else if (next == 112) {
                if (currAbsArg === 0) {
                  argText = '(nil)';
                } else {
                  prefix = '0x';
                  argText = currAbsArg.toString(16);
                }
              }
              if (precisionSet) {
                while (argText.length < precision) {
                  argText = '0' + argText;
                }
              }
  
              // Add sign if needed
              if (currArg >= 0) {
                if (flagAlwaysSigned) {
                  prefix = '+' + prefix;
                } else if (flagPadSign) {
                  prefix = ' ' + prefix;
                }
              }
  
              // Move sign to prefix so we zero-pad after the sign
              if (argText.charAt(0) == '-') {
                prefix = '-' + prefix;
                argText = argText.substr(1);
              }
  
              // Add padding.
              while (prefix.length + argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad) {
                    argText = '0' + argText;
                  } else {
                    prefix = ' ' + prefix;
                  }
                }
              }
  
              // Insert the result into the buffer.
              argText = prefix + argText;
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 'f': case 'F': case 'e': case 'E': case 'g': case 'G': {
              // Float.
              var currArg = getNextArg('double');
              var argText;
              if (isNaN(currArg)) {
                argText = 'nan';
                flagZeroPad = false;
              } else if (!isFinite(currArg)) {
                argText = (currArg < 0 ? '-' : '') + 'inf';
                flagZeroPad = false;
              } else {
                var isGeneral = false;
                var effectivePrecision = Math.min(precision, 20);
  
                // Convert g/G to f/F or e/E, as per:
                // http://pubs.opengroup.org/onlinepubs/9699919799/functions/printf.html
                if (next == 103 || next == 71) {
                  isGeneral = true;
                  precision = precision || 1;
                  var exponent = parseInt(currArg.toExponential(effectivePrecision).split('e')[1], 10);
                  if (precision > exponent && exponent >= -4) {
                    next = ((next == 103) ? 'f' : 'F').charCodeAt(0);
                    precision -= exponent + 1;
                  } else {
                    next = ((next == 103) ? 'e' : 'E').charCodeAt(0);
                    precision--;
                  }
                  effectivePrecision = Math.min(precision, 20);
                }
  
                if (next == 101 || next == 69) {
                  argText = currArg.toExponential(effectivePrecision);
                  // Make sure the exponent has at least 2 digits.
                  if (/[eE][-+]\d$/.test(argText)) {
                    argText = argText.slice(0, -1) + '0' + argText.slice(-1);
                  }
                } else if (next == 102 || next == 70) {
                  argText = currArg.toFixed(effectivePrecision);
                  if (currArg === 0 && __reallyNegative(currArg)) {
                    argText = '-' + argText;
                  }
                }
  
                var parts = argText.split('e');
                if (isGeneral && !flagAlternative) {
                  // Discard trailing zeros and periods.
                  while (parts[0].length > 1 && parts[0].indexOf('.') != -1 &&
                         (parts[0].slice(-1) == '0' || parts[0].slice(-1) == '.')) {
                    parts[0] = parts[0].slice(0, -1);
                  }
                } else {
                  // Make sure we have a period in alternative mode.
                  if (flagAlternative && argText.indexOf('.') == -1) parts[0] += '.';
                  // Zero pad until required precision.
                  while (precision > effectivePrecision++) parts[0] += '0';
                }
                argText = parts[0] + (parts.length > 1 ? 'e' + parts[1] : '');
  
                // Capitalize 'E' if needed.
                if (next == 69) argText = argText.toUpperCase();
  
                // Add sign.
                if (currArg >= 0) {
                  if (flagAlwaysSigned) {
                    argText = '+' + argText;
                  } else if (flagPadSign) {
                    argText = ' ' + argText;
                  }
                }
              }
  
              // Add padding.
              while (argText.length < width) {
                if (flagLeftAlign) {
                  argText += ' ';
                } else {
                  if (flagZeroPad && (argText[0] == '-' || argText[0] == '+')) {
                    argText = argText[0] + '0' + argText.slice(1);
                  } else {
                    argText = (flagZeroPad ? '0' : ' ') + argText;
                  }
                }
              }
  
              // Adjust case.
              if (next < 97) argText = argText.toUpperCase();
  
              // Insert the result into the buffer.
              argText.split('').forEach(function(chr) {
                ret.push(chr.charCodeAt(0));
              });
              break;
            }
            case 's': {
              // String.
              var arg = getNextArg('i8*');
              var argLength = arg ? _strlen(arg) : '(null)'.length;
              if (precisionSet) argLength = Math.min(argLength, precision);
              if (!flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              if (arg) {
                for (var i = 0; i < argLength; i++) {
                  ret.push(HEAPU8[((arg++)|0)]);
                }
              } else {
                ret = ret.concat(intArrayFromString('(null)'.substr(0, argLength), true));
              }
              if (flagLeftAlign) {
                while (argLength < width--) {
                  ret.push(32);
                }
              }
              break;
            }
            case 'c': {
              // Character.
              if (flagLeftAlign) ret.push(getNextArg('i8'));
              while (--width > 0) {
                ret.push(32);
              }
              if (!flagLeftAlign) ret.push(getNextArg('i8'));
              break;
            }
            case 'n': {
              // Write the length written so far to the next parameter.
              var ptr = getNextArg('i32*');
              HEAP32[((ptr)>>2)]=ret.length;
              break;
            }
            case '%': {
              // Literal percent sign.
              ret.push(curr);
              break;
            }
            default: {
              // Unknown specifiers remain untouched.
              for (var i = startTextIndex; i < textIndex + 2; i++) {
                ret.push(HEAP8[(i)]);
              }
            }
          }
          textIndex += 2;
          // TODO: Support a/A (hex float) and m (last error) specifiers.
          // TODO: Support %1${specifier} for arg selection.
        } else {
          ret.push(curr);
          textIndex += 1;
        }
      }
      return ret;
    }function _fprintf(stream, format, varargs) {
      // int fprintf(FILE *restrict stream, const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var result = __formatString(format, varargs);
      var stack = Runtime.stackSave();
      var ret = _fwrite(allocate(result, 'i8', ALLOC_STACK), 1, result.length, stream);
      Runtime.stackRestore(stack);
      return ret;
    }function _printf(format, varargs) {
      // int printf(const char *restrict format, ...);
      // http://pubs.opengroup.org/onlinepubs/000095399/functions/printf.html
      var stdout = HEAP32[((_stdout)>>2)];
      return _fprintf(stdout, format, varargs);
    }



  function ___assert_fail(condition, filename, line, func) {
      ABORT = true;
      throw 'Assertion failed: ' + Pointer_stringify(condition) + ', at: ' + [filename ? Pointer_stringify(filename) : 'unknown filename', line, func ? Pointer_stringify(func) : 'unknown function'] + ' at ' + stackTrace();
    }

  function _sbrk(bytes) {
      // Implement a Linux-like 'memory area' for our 'process'.
      // Changes the size of the memory area by |bytes|; returns the
      // address of the previous top ('break') of the memory area
      // We control the "dynamic" memory - DYNAMIC_BASE to DYNAMICTOP
      var self = _sbrk;
      if (!self.called) {
        DYNAMICTOP = alignMemoryPage(DYNAMICTOP); // make sure we start out aligned
        self.called = true;
        assert(Runtime.dynamicAlloc);
        self.alloc = Runtime.dynamicAlloc;
        Runtime.dynamicAlloc = function() { abort('cannot dynamically allocate, sbrk now has control') };
      }
      var ret = DYNAMICTOP;
      if (bytes != 0) self.alloc(bytes);
      return ret;  // Previous break location.
    }


  function ___errno_location() {
      return ___errno_state;
    }

  function _llvm_lifetime_start() {}

  var _llvm_memcpy_p0i8_p0i8_i32=_memcpy;

  var Browser={mainLoop:{scheduler:null,method:"",shouldPause:false,paused:false,queue:[],pause:function () {
          Browser.mainLoop.shouldPause = true;
        },resume:function () {
          if (Browser.mainLoop.paused) {
            Browser.mainLoop.paused = false;
            Browser.mainLoop.scheduler();
          }
          Browser.mainLoop.shouldPause = false;
        },updateStatus:function () {
          if (Module['setStatus']) {
            var message = Module['statusMessage'] || 'Please wait...';
            var remaining = Browser.mainLoop.remainingBlockers;
            var expected = Browser.mainLoop.expectedBlockers;
            if (remaining) {
              if (remaining < expected) {
                Module['setStatus'](message + ' (' + (expected - remaining) + '/' + expected + ')');
              } else {
                Module['setStatus'](message);
              }
            } else {
              Module['setStatus']('');
            }
          }
        }},isFullScreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function () {
        if (!Module["preloadPlugins"]) Module["preloadPlugins"] = []; // needs to exist even in workers
  
        if (Browser.initted || ENVIRONMENT_IS_WORKER) return;
        Browser.initted = true;
  
        try {
          new Blob();
          Browser.hasBlobConstructor = true;
        } catch(e) {
          Browser.hasBlobConstructor = false;
          console.log("warning: no blob constructor, cannot create blobs with mimetypes");
        }
        Browser.BlobBuilder = typeof MozBlobBuilder != "undefined" ? MozBlobBuilder : (typeof WebKitBlobBuilder != "undefined" ? WebKitBlobBuilder : (!Browser.hasBlobConstructor ? console.log("warning: no BlobBuilder") : null));
        Browser.URLObject = typeof window != "undefined" ? (window.URL ? window.URL : window.webkitURL) : undefined;
        if (!Module.noImageDecoding && typeof Browser.URLObject === 'undefined') {
          console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");
          Module.noImageDecoding = true;
        }
  
        // Support for plugins that can process preloaded files. You can add more of these to
        // your app by creating and appending to Module.preloadPlugins.
        //
        // Each plugin is asked if it can handle a file based on the file's name. If it can,
        // it is given the file's raw data. When it is done, it calls a callback with the file's
        // (possibly modified) data. For example, a plugin might decompress a file, or it
        // might create some side data structure for use later (like an Image element, etc.).
  
        var imagePlugin = {};
        imagePlugin['canHandle'] = function imagePlugin_canHandle(name) {
          return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(name);
        };
        imagePlugin['handle'] = function imagePlugin_handle(byteArray, name, onload, onerror) {
          var b = null;
          if (Browser.hasBlobConstructor) {
            try {
              b = new Blob([byteArray], { type: Browser.getMimetype(name) });
              if (b.size !== byteArray.length) { // Safari bug #118630
                // Safari's Blob can only take an ArrayBuffer
                b = new Blob([(new Uint8Array(byteArray)).buffer], { type: Browser.getMimetype(name) });
              }
            } catch(e) {
              Runtime.warnOnce('Blob constructor present but fails: ' + e + '; falling back to blob builder');
            }
          }
          if (!b) {
            var bb = new Browser.BlobBuilder();
            bb.append((new Uint8Array(byteArray)).buffer); // we need to pass a buffer, and must copy the array to get the right data range
            b = bb.getBlob();
          }
          var url = Browser.URLObject.createObjectURL(b);
          var img = new Image();
          img.onload = function img_onload() {
            assert(img.complete, 'Image ' + name + ' could not be decoded');
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            Module["preloadedImages"][name] = canvas;
            Browser.URLObject.revokeObjectURL(url);
            if (onload) onload(byteArray);
          };
          img.onerror = function img_onerror(event) {
            console.log('Image ' + url + ' could not be decoded');
            if (onerror) onerror();
          };
          img.src = url;
        };
        Module['preloadPlugins'].push(imagePlugin);
  
        var audioPlugin = {};
        audioPlugin['canHandle'] = function audioPlugin_canHandle(name) {
          return !Module.noAudioDecoding && name.substr(-4) in { '.ogg': 1, '.wav': 1, '.mp3': 1 };
        };
        audioPlugin['handle'] = function audioPlugin_handle(byteArray, name, onload, onerror) {
          var done = false;
          function finish(audio) {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = audio;
            if (onload) onload(byteArray);
          }
          function fail() {
            if (done) return;
            done = true;
            Module["preloadedAudios"][name] = new Audio(); // empty shim
            if (onerror) onerror();
          }
          if (Browser.hasBlobConstructor) {
            try {
              var b = new Blob([byteArray], { type: Browser.getMimetype(name) });
            } catch(e) {
              return fail();
            }
            var url = Browser.URLObject.createObjectURL(b); // XXX we never revoke this!
            var audio = new Audio();
            audio.addEventListener('canplaythrough', function() { finish(audio) }, false); // use addEventListener due to chromium bug 124926
            audio.onerror = function audio_onerror(event) {
              if (done) return;
              console.log('warning: browser could not fully decode audio ' + name + ', trying slower base64 approach');
              function encode64(data) {
                var BASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
                var PAD = '=';
                var ret = '';
                var leftchar = 0;
                var leftbits = 0;
                for (var i = 0; i < data.length; i++) {
                  leftchar = (leftchar << 8) | data[i];
                  leftbits += 8;
                  while (leftbits >= 6) {
                    var curr = (leftchar >> (leftbits-6)) & 0x3f;
                    leftbits -= 6;
                    ret += BASE[curr];
                  }
                }
                if (leftbits == 2) {
                  ret += BASE[(leftchar&3) << 4];
                  ret += PAD + PAD;
                } else if (leftbits == 4) {
                  ret += BASE[(leftchar&0xf) << 2];
                  ret += PAD;
                }
                return ret;
              }
              audio.src = 'data:audio/x-' + name.substr(-3) + ';base64,' + encode64(byteArray);
              finish(audio); // we don't wait for confirmation this worked - but it's worth trying
            };
            audio.src = url;
            // workaround for chrome bug 124926 - we do not always get oncanplaythrough or onerror
            Browser.safeSetTimeout(function() {
              finish(audio); // try to use it even though it is not necessarily ready to play
            }, 10000);
          } else {
            return fail();
          }
        };
        Module['preloadPlugins'].push(audioPlugin);
  
        // Canvas event setup
  
        var canvas = Module['canvas'];
        
        // forced aspect ratio can be enabled by defining 'forcedAspectRatio' on Module
        // Module['forcedAspectRatio'] = 4 / 3;
        
        canvas.requestPointerLock = canvas['requestPointerLock'] ||
                                    canvas['mozRequestPointerLock'] ||
                                    canvas['webkitRequestPointerLock'] ||
                                    canvas['msRequestPointerLock'] ||
                                    function(){};
        canvas.exitPointerLock = document['exitPointerLock'] ||
                                 document['mozExitPointerLock'] ||
                                 document['webkitExitPointerLock'] ||
                                 document['msExitPointerLock'] ||
                                 function(){}; // no-op if function does not exist
        canvas.exitPointerLock = canvas.exitPointerLock.bind(document);
  
        function pointerLockChange() {
          Browser.pointerLock = document['pointerLockElement'] === canvas ||
                                document['mozPointerLockElement'] === canvas ||
                                document['webkitPointerLockElement'] === canvas ||
                                document['msPointerLockElement'] === canvas;
        }
  
        document.addEventListener('pointerlockchange', pointerLockChange, false);
        document.addEventListener('mozpointerlockchange', pointerLockChange, false);
        document.addEventListener('webkitpointerlockchange', pointerLockChange, false);
        document.addEventListener('mspointerlockchange', pointerLockChange, false);
  
        if (Module['elementPointerLock']) {
          canvas.addEventListener("click", function(ev) {
            if (!Browser.pointerLock && canvas.requestPointerLock) {
              canvas.requestPointerLock();
              ev.preventDefault();
            }
          }, false);
        }
      },createContext:function (canvas, useWebGL, setInModule, webGLContextAttributes) {
        var ctx;
        var errorInfo = '?';
        function onContextCreationError(event) {
          errorInfo = event.statusMessage || errorInfo;
        }
        try {
          if (useWebGL) {
            var contextAttributes = {
              antialias: false,
              alpha: false
            };
  
            if (webGLContextAttributes) {
              for (var attribute in webGLContextAttributes) {
                contextAttributes[attribute] = webGLContextAttributes[attribute];
              }
            }
  
  
            canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
            try {
              ['experimental-webgl', 'webgl'].some(function(webglId) {
                return ctx = canvas.getContext(webglId, contextAttributes);
              });
            } finally {
              canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            }
          } else {
            ctx = canvas.getContext('2d');
          }
          if (!ctx) throw ':(';
        } catch (e) {
          Module.print('Could not create canvas: ' + [errorInfo, e]);
          return null;
        }
        if (useWebGL) {
          // Set the background of the WebGL canvas to black
          canvas.style.backgroundColor = "black";
  
          // Warn on context loss
          canvas.addEventListener('webglcontextlost', function(event) {
            alert('WebGL context lost. You will need to reload the page.');
          }, false);
        }
        if (setInModule) {
          GLctx = Module.ctx = ctx;
          Module.useWebGL = useWebGL;
          Browser.moduleContextCreatedCallbacks.forEach(function(callback) { callback() });
          Browser.init();
        }
        return ctx;
      },destroyContext:function (canvas, useWebGL, setInModule) {},fullScreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullScreen:function (lockPointer, resizeCanvas) {
        Browser.lockPointer = lockPointer;
        Browser.resizeCanvas = resizeCanvas;
        if (typeof Browser.lockPointer === 'undefined') Browser.lockPointer = true;
        if (typeof Browser.resizeCanvas === 'undefined') Browser.resizeCanvas = false;
  
        var canvas = Module['canvas'];
        var canvasContainer = canvas.parentNode;
        function fullScreenChange() {
          Browser.isFullScreen = false;
          if ((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
               document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
               document['fullScreenElement'] || document['fullscreenElement'] ||
               document['msFullScreenElement'] || document['msFullscreenElement'] ||
               document['webkitCurrentFullScreenElement']) === canvasContainer) {
            canvas.cancelFullScreen = document['cancelFullScreen'] ||
                                      document['mozCancelFullScreen'] ||
                                      document['webkitCancelFullScreen'] ||
                                      document['msExitFullscreen'] ||
                                      document['exitFullscreen'] ||
                                      function() {};
            canvas.cancelFullScreen = canvas.cancelFullScreen.bind(document);
            if (Browser.lockPointer) canvas.requestPointerLock();
            Browser.isFullScreen = true;
            if (Browser.resizeCanvas) Browser.setFullScreenCanvasSize();
          } else {
            
            // remove the full screen specific parent of the canvas again to restore the HTML structure from before going full screen
            var canvasContainer = canvas.parentNode;
            canvasContainer.parentNode.insertBefore(canvas, canvasContainer);
            canvasContainer.parentNode.removeChild(canvasContainer);
            
            if (Browser.resizeCanvas) Browser.setWindowedCanvasSize();
          }
          if (Module['onFullScreen']) Module['onFullScreen'](Browser.isFullScreen);
          Browser.updateCanvasDimensions(canvas);
        }
  
        if (!Browser.fullScreenHandlersInstalled) {
          Browser.fullScreenHandlersInstalled = true;
          document.addEventListener('fullscreenchange', fullScreenChange, false);
          document.addEventListener('mozfullscreenchange', fullScreenChange, false);
          document.addEventListener('webkitfullscreenchange', fullScreenChange, false);
          document.addEventListener('MSFullscreenChange', fullScreenChange, false);
        }
  
        // create a new parent to ensure the canvas has no siblings. this allows browsers to optimize full screen performance when its parent is the full screen root
        var canvasContainer = document.createElement("div");
        canvas.parentNode.insertBefore(canvasContainer, canvas);
        canvasContainer.appendChild(canvas);
        
        // use parent of canvas as full screen root to allow aspect ratio correction (Firefox stretches the root to screen size)
        canvasContainer.requestFullScreen = canvasContainer['requestFullScreen'] ||
                                            canvasContainer['mozRequestFullScreen'] ||
                                            canvasContainer['msRequestFullscreen'] ||
                                           (canvasContainer['webkitRequestFullScreen'] ? function() { canvasContainer['webkitRequestFullScreen'](Element['ALLOW_KEYBOARD_INPUT']) } : null);
        canvasContainer.requestFullScreen();
      },requestAnimationFrame:function requestAnimationFrame(func) {
        if (typeof window === 'undefined') { // Provide fallback to setTimeout if window is undefined (e.g. in Node.js)
          setTimeout(func, 1000/60);
        } else {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = window['requestAnimationFrame'] ||
                                           window['mozRequestAnimationFrame'] ||
                                           window['webkitRequestAnimationFrame'] ||
                                           window['msRequestAnimationFrame'] ||
                                           window['oRequestAnimationFrame'] ||
                                           window['setTimeout'];
          }
          window.requestAnimationFrame(func);
        }
      },safeCallback:function (func) {
        return function() {
          if (!ABORT) return func.apply(null, arguments);
        };
      },safeRequestAnimationFrame:function (func) {
        return Browser.requestAnimationFrame(function() {
          if (!ABORT) func();
        });
      },safeSetTimeout:function (func, timeout) {
        return setTimeout(function() {
          if (!ABORT) func();
        }, timeout);
      },safeSetInterval:function (func, timeout) {
        return setInterval(function() {
          if (!ABORT) func();
        }, timeout);
      },getMimetype:function (name) {
        return {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'bmp': 'image/bmp',
          'ogg': 'audio/ogg',
          'wav': 'audio/wav',
          'mp3': 'audio/mpeg'
        }[name.substr(name.lastIndexOf('.')+1)];
      },getUserMedia:function (func) {
        if(!window.getUserMedia) {
          window.getUserMedia = navigator['getUserMedia'] ||
                                navigator['mozGetUserMedia'];
        }
        window.getUserMedia(func);
      },getMovementX:function (event) {
        return event['movementX'] ||
               event['mozMovementX'] ||
               event['webkitMovementX'] ||
               0;
      },getMovementY:function (event) {
        return event['movementY'] ||
               event['mozMovementY'] ||
               event['webkitMovementY'] ||
               0;
      },getMouseWheelDelta:function (event) {
        return Math.max(-1, Math.min(1, event.type === 'DOMMouseScroll' ? event.detail : -event.wheelDelta));
      },mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,calculateMouseEvent:function (event) { // event should be mousemove, mousedown or mouseup
        if (Browser.pointerLock) {
          // When the pointer is locked, calculate the coordinates
          // based on the movement of the mouse.
          // Workaround for Firefox bug 764498
          if (event.type != 'mousemove' &&
              ('mozMovementX' in event)) {
            Browser.mouseMovementX = Browser.mouseMovementY = 0;
          } else {
            Browser.mouseMovementX = Browser.getMovementX(event);
            Browser.mouseMovementY = Browser.getMovementY(event);
          }
          
          // check if SDL is available
          if (typeof SDL != "undefined") {
          	Browser.mouseX = SDL.mouseX + Browser.mouseMovementX;
          	Browser.mouseY = SDL.mouseY + Browser.mouseMovementY;
          } else {
          	// just add the mouse delta to the current absolut mouse position
          	// FIXME: ideally this should be clamped against the canvas size and zero
          	Browser.mouseX += Browser.mouseMovementX;
          	Browser.mouseY += Browser.mouseMovementY;
          }        
        } else {
          // Otherwise, calculate the movement based on the changes
          // in the coordinates.
          var rect = Module["canvas"].getBoundingClientRect();
          var x, y;
          
          // Neither .scrollX or .pageXOffset are defined in a spec, but
          // we prefer .scrollX because it is currently in a spec draft.
          // (see: http://www.w3.org/TR/2013/WD-cssom-view-20131217/)
          var scrollX = ((typeof window.scrollX !== 'undefined') ? window.scrollX : window.pageXOffset);
          var scrollY = ((typeof window.scrollY !== 'undefined') ? window.scrollY : window.pageYOffset);
          if (event.type == 'touchstart' ||
              event.type == 'touchend' ||
              event.type == 'touchmove') {
            var t = event.touches.item(0);
            if (t) {
              x = t.pageX - (scrollX + rect.left);
              y = t.pageY - (scrollY + rect.top);
            } else {
              return;
            }
          } else {
            x = event.pageX - (scrollX + rect.left);
            y = event.pageY - (scrollY + rect.top);
          }
  
          // the canvas might be CSS-scaled compared to its backbuffer;
          // SDL-using content will want mouse coordinates in terms
          // of backbuffer units.
          var cw = Module["canvas"].width;
          var ch = Module["canvas"].height;
          x = x * (cw / rect.width);
          y = y * (ch / rect.height);
  
          Browser.mouseMovementX = x - Browser.mouseX;
          Browser.mouseMovementY = y - Browser.mouseY;
          Browser.mouseX = x;
          Browser.mouseY = y;
        }
      },xhrLoad:function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function xhr_onload() {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            onload(xhr.response);
          } else {
            onerror();
          }
        };
        xhr.onerror = onerror;
        xhr.send(null);
      },asyncLoad:function (url, onload, onerror, noRunDep) {
        Browser.xhrLoad(url, function(arrayBuffer) {
          assert(arrayBuffer, 'Loading data file "' + url + '" failed (no arrayBuffer).');
          onload(new Uint8Array(arrayBuffer));
          if (!noRunDep) removeRunDependency('al ' + url);
        }, function(event) {
          if (onerror) {
            onerror();
          } else {
            throw 'Loading data file "' + url + '" failed.';
          }
        });
        if (!noRunDep) addRunDependency('al ' + url);
      },resizeListeners:[],updateResizeListeners:function () {
        var canvas = Module['canvas'];
        Browser.resizeListeners.forEach(function(listener) {
          listener(canvas.width, canvas.height);
        });
      },setCanvasSize:function (width, height, noUpdates) {
        var canvas = Module['canvas'];
        Browser.updateCanvasDimensions(canvas, width, height);
        if (!noUpdates) Browser.updateResizeListeners();
      },windowedWidth:0,windowedHeight:0,setFullScreenCanvasSize:function () {
        // check if SDL is available   
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags | 0x00800000; // set SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },setWindowedCanvasSize:function () {
        // check if SDL is available       
        if (typeof SDL != "undefined") {
        	var flags = HEAPU32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)];
        	flags = flags & ~0x00800000; // clear SDL_FULLSCREEN flag
        	HEAP32[((SDL.screen+Runtime.QUANTUM_SIZE*0)>>2)]=flags
        }
        Browser.updateResizeListeners();
      },updateCanvasDimensions:function (canvas, wNative, hNative) {
        if (wNative && hNative) {
          canvas.widthNative = wNative;
          canvas.heightNative = hNative;
        } else {
          wNative = canvas.widthNative;
          hNative = canvas.heightNative;
        }
        var w = wNative;
        var h = hNative;
        if (Module['forcedAspectRatio'] && Module['forcedAspectRatio'] > 0) {
          if (w/h < Module['forcedAspectRatio']) {
            w = Math.round(h * Module['forcedAspectRatio']);
          } else {
            h = Math.round(w / Module['forcedAspectRatio']);
          }
        }
        if (((document['webkitFullScreenElement'] || document['webkitFullscreenElement'] ||
             document['mozFullScreenElement'] || document['mozFullscreenElement'] ||
             document['fullScreenElement'] || document['fullscreenElement'] ||
             document['msFullScreenElement'] || document['msFullscreenElement'] ||
             document['webkitCurrentFullScreenElement']) === canvas.parentNode) && (typeof screen != 'undefined')) {
           var factor = Math.min(screen.width / w, screen.height / h);
           w = Math.round(w * factor);
           h = Math.round(h * factor);
        }
        if (Browser.resizeCanvas) {
          if (canvas.width  != w) canvas.width  = w;
          if (canvas.height != h) canvas.height = h;
          if (typeof canvas.style != 'undefined') {
            canvas.style.removeProperty( "width");
            canvas.style.removeProperty("height");
          }
        } else {
          if (canvas.width  != wNative) canvas.width  = wNative;
          if (canvas.height != hNative) canvas.height = hNative;
          if (typeof canvas.style != 'undefined') {
            if (w != wNative || h != hNative) {
              canvas.style.setProperty( "width", w + "px", "important");
              canvas.style.setProperty("height", h + "px", "important");
            } else {
              canvas.style.removeProperty( "width");
              canvas.style.removeProperty("height");
            }
          }
        }
      }};

  function _time(ptr) {
      var ret = Math.floor(Date.now()/1000);
      if (ptr) {
        HEAP32[((ptr)>>2)]=ret;
      }
      return ret;
    }
___errno_state = Runtime.staticAlloc(4); HEAP32[((___errno_state)>>2)]=0;
FS.staticInit();__ATINIT__.unshift({ func: function() { if (!Module["noFSInit"] && !FS.init.initialized) FS.init() } });__ATMAIN__.push({ func: function() { FS.ignorePermissions = false } });__ATEXIT__.push({ func: function() { FS.quit() } });Module["FS_createFolder"] = FS.createFolder;Module["FS_createPath"] = FS.createPath;Module["FS_createDataFile"] = FS.createDataFile;Module["FS_createPreloadedFile"] = FS.createPreloadedFile;Module["FS_createLazyFile"] = FS.createLazyFile;Module["FS_createLink"] = FS.createLink;Module["FS_createDevice"] = FS.createDevice;
__ATINIT__.unshift({ func: function() { TTY.init() } });__ATEXIT__.push({ func: function() { TTY.shutdown() } });TTY.utf8 = new Runtime.UTF8Processor();
if (ENVIRONMENT_IS_NODE) { var fs = require("fs"); NODEFS.staticInit(); }
__ATINIT__.push({ func: function() { SOCKFS.root = FS.mount(SOCKFS, {}, null); } });
Module["requestFullScreen"] = function Module_requestFullScreen(lockPointer, resizeCanvas) { Browser.requestFullScreen(lockPointer, resizeCanvas) };
  Module["requestAnimationFrame"] = function Module_requestAnimationFrame(func) { Browser.requestAnimationFrame(func) };
  Module["setCanvasSize"] = function Module_setCanvasSize(width, height, noUpdates) { Browser.setCanvasSize(width, height, noUpdates) };
  Module["pauseMainLoop"] = function Module_pauseMainLoop() { Browser.mainLoop.pause() };
  Module["resumeMainLoop"] = function Module_resumeMainLoop() { Browser.mainLoop.resume() };
  Module["getUserMedia"] = function Module_getUserMedia() { Browser.getUserMedia() }
STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP);

staticSealed = true; // seal the static portion of memory

STACK_MAX = STACK_BASE + 5242880;

DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX);

assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");


var Math_min = Math.min;
function asmPrintInt(x, y) {
  Module.print('int ' + x + ',' + y);// + ' ' + new Error().stack);
}
function asmPrintFloat(x, y) {
  Module.print('float ' + x + ',' + y);// + ' ' + new Error().stack);
}
// EMSCRIPTEN_START_ASM
var asm = (function(global, env, buffer) {
  'use asm';
  var HEAP8 = new global.Int8Array(buffer);
  var HEAP16 = new global.Int16Array(buffer);
  var HEAP32 = new global.Int32Array(buffer);
  var HEAPU8 = new global.Uint8Array(buffer);
  var HEAPU16 = new global.Uint16Array(buffer);
  var HEAPU32 = new global.Uint32Array(buffer);
  var HEAPF32 = new global.Float32Array(buffer);
  var HEAPF64 = new global.Float64Array(buffer);

  var STACKTOP=env.STACKTOP|0;
  var STACK_MAX=env.STACK_MAX|0;
  var tempDoublePtr=env.tempDoublePtr|0;
  var ABORT=env.ABORT|0;

  var __THREW__ = 0;
  var threwValue = 0;
  var setjmpId = 0;
  var undef = 0;
  var nan = +env.NaN, inf = +env.Infinity;
  var tempInt = 0, tempBigInt = 0, tempBigIntP = 0, tempBigIntS = 0, tempBigIntR = 0.0, tempBigIntI = 0, tempBigIntD = 0, tempValue = 0, tempDouble = 0.0;

  var tempRet0 = 0;
  var tempRet1 = 0;
  var tempRet2 = 0;
  var tempRet3 = 0;
  var tempRet4 = 0;
  var tempRet5 = 0;
  var tempRet6 = 0;
  var tempRet7 = 0;
  var tempRet8 = 0;
  var tempRet9 = 0;
  var Math_floor=global.Math.floor;
  var Math_abs=global.Math.abs;
  var Math_sqrt=global.Math.sqrt;
  var Math_pow=global.Math.pow;
  var Math_cos=global.Math.cos;
  var Math_sin=global.Math.sin;
  var Math_tan=global.Math.tan;
  var Math_acos=global.Math.acos;
  var Math_asin=global.Math.asin;
  var Math_atan=global.Math.atan;
  var Math_atan2=global.Math.atan2;
  var Math_exp=global.Math.exp;
  var Math_log=global.Math.log;
  var Math_ceil=global.Math.ceil;
  var Math_imul=global.Math.imul;
  var abort=env.abort;
  var assert=env.assert;
  var asmPrintInt=env.asmPrintInt;
  var asmPrintFloat=env.asmPrintFloat;
  var Math_min=env.min;
  var _sysconf=env._sysconf;
  var _llvm_lifetime_start=env._llvm_lifetime_start;
  var _fflush=env._fflush;
  var __formatString=env.__formatString;
  var _mkport=env._mkport;
  var _send=env._send;
  var _pwrite=env._pwrite;
  var _abort=env._abort;
  var __reallyNegative=env.__reallyNegative;
  var _fwrite=env._fwrite;
  var _sbrk=env._sbrk;
  var _printf=env._printf;
  var _fprintf=env._fprintf;
  var ___setErrNo=env.___setErrNo;
  var _llvm_lifetime_end=env._llvm_lifetime_end;
  var _fileno=env._fileno;
  var _write=env._write;
  var _emscripten_memcpy_big=env._emscripten_memcpy_big;
  var ___assert_fail=env.___assert_fail;
  var ___errno_location=env.___errno_location;
  var _time=env._time;
  var tempFloat = 0.0;

// EMSCRIPTEN_START_FUNCS
function stackAlloc(size) {
  size = size|0;
  var ret = 0;
  ret = STACKTOP;
  STACKTOP = (STACKTOP + size)|0;
STACKTOP = (STACKTOP + 7)&-8;
  return ret|0;
}
function stackSave() {
  return STACKTOP|0;
}
function stackRestore(top) {
  top = top|0;
  STACKTOP = top;
}
function setThrew(threw, value) {
  threw = threw|0;
  value = value|0;
  if ((__THREW__|0) == 0) {
    __THREW__ = threw;
    threwValue = value;
  }
}
function copyTempFloat(ptr) {
  ptr = ptr|0;
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1|0] = HEAP8[ptr+1|0];
  HEAP8[tempDoublePtr+2|0] = HEAP8[ptr+2|0];
  HEAP8[tempDoublePtr+3|0] = HEAP8[ptr+3|0];
}
function copyTempDouble(ptr) {
  ptr = ptr|0;
  HEAP8[tempDoublePtr] = HEAP8[ptr];
  HEAP8[tempDoublePtr+1|0] = HEAP8[ptr+1|0];
  HEAP8[tempDoublePtr+2|0] = HEAP8[ptr+2|0];
  HEAP8[tempDoublePtr+3|0] = HEAP8[ptr+3|0];
  HEAP8[tempDoublePtr+4|0] = HEAP8[ptr+4|0];
  HEAP8[tempDoublePtr+5|0] = HEAP8[ptr+5|0];
  HEAP8[tempDoublePtr+6|0] = HEAP8[ptr+6|0];
  HEAP8[tempDoublePtr+7|0] = HEAP8[ptr+7|0];
}

function setTempRet0(value) {
  value = value|0;
  tempRet0 = value;
}

function setTempRet1(value) {
  value = value|0;
  tempRet1 = value;
}

function setTempRet2(value) {
  value = value|0;
  tempRet2 = value;
}

function setTempRet3(value) {
  value = value|0;
  tempRet3 = value;
}

function setTempRet4(value) {
  value = value|0;
  tempRet4 = value;
}

function setTempRet5(value) {
  value = value|0;
  tempRet5 = value;
}

function setTempRet6(value) {
  value = value|0;
  tempRet6 = value;
}

function setTempRet7(value) {
  value = value|0;
  tempRet7 = value;
}

function setTempRet8(value) {
  value = value|0;
  tempRet8 = value;
}

function setTempRet9(value) {
  value = value|0;
  tempRet9 = value;
}

function __ZN8SNES_SPC10run_timer_EPNS_5TimerEi($this,$t,$time) {
 $this = $this|0;
 $t = $t|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $divider$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($t);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($time) - ($2))|0;
 $4 = (($t) + 4|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = (($3|0) / ($5|0))&-1;
 $7 = (($6) + 1)|0;
 $8 = Math_imul($7, $5)|0;
 $9 = (($8) + ($2))|0;
 HEAP32[$1>>2] = $9;
 $10 = (($t) + 16|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = ($11|0)==(0);
 if ($12) {
  STACKTOP = sp;return ($t|0);
 }
 $13 = (($t) + 8|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = (($t) + 12|0);
 $16 = HEAP32[$15>>2]|0;
 $17 = (($14) + 255)|0;
 $18 = (($17) - ($16))|0;
 $19 = $18 & 255;
 $20 = (($16) + ($7))|0;
 $21 = (($6) - ($19))|0;
 $22 = ($21|0)>(-1);
 if ($22) {
  $23 = (($21|0) / ($14|0))&-1;
  $24 = (($t) + 20|0);
  $25 = HEAP32[$24>>2]|0;
  $26 = (($23) + 1)|0;
  $27 = (($26) + ($25))|0;
  $28 = $27 & 15;
  HEAP32[$24>>2] = $28;
  $29 = HEAP32[$13>>2]|0;
  $30 = Math_imul($29, $23)|0;
  $31 = (($21) - ($30))|0;
  $divider$0 = $31;
 } else {
  $divider$0 = $20;
 }
 $32 = $divider$0 & 255;
 HEAP32[$15>>2] = $32;
 STACKTOP = sp;return ($t|0);
}
function __ZN8SNES_SPC10enable_romEi($this,$enable) {
 $this = $this|0;
 $enable = $enable|0;
 var $1 = 0, $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 $1 = (($this) + 1768|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)==($enable|0);
 if ($3) {
  STACKTOP = sp;return;
 }
 HEAP32[$1>>2] = $enable;
 $4 = ($enable|0)!=(0);
 if ($4) {
  $5 = (($this) + 1836|0);
  $6 = (($this) + 67884|0);
  dest=$5+0|0; src=$6+0|0; stop=dest+64|0; do { HEAP8[dest]=HEAP8[src]|0; dest=dest+1|0; src=src+1|0; } while ((dest|0) < (stop|0));;
 }
 $7 = (($this) + 67884|0);
 $8 = (($this) + 1772|0);
 $9 = (($this) + 1836|0);
 $10 = $4 ? $8 : $9;
 $11 = ($10);
 dest=$7+0|0; src=$11+0|0; stop=dest+64|0; do { HEAP8[dest]=HEAP8[src]|0; dest=dest+1|0; src=src+1|0; } while ((dest|0) < (stop|0));;
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC8dsp_readEi($this,$time) {
 $this = $this|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1692|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($time) - ($2))|0;
 $4 = ($3|0)>(0);
 if ($4) {
  HEAP32[$1>>2] = $time;
  $5 = ($this);
  __ZN7SPC_DSP3runEi($5,$3);
  $6 = (($this) + 1638|0);
  $7 = HEAP8[$6]|0;
  $8 = $7&255;
  $9 = $8 & 127;
  $10 = (__ZNK7SPC_DSP4readEi($5,$9)|0);
  STACKTOP = sp;return ($10|0);
 } else {
  ___assert_fail(((8)|0),((24)|0),143,((56)|0));
  // unreachable;
 }
 return 0|0;
}
function __ZNK7SPC_DSP4readEi($this,$addr) {
 $this = $this|0;
 $addr = $addr|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($addr>>>0)<(128);
 if ($1) {
  $2 = (($this) + ($addr)|0);
  $3 = HEAP8[$2]|0;
  $4 = $3&255;
  STACKTOP = sp;return ($4|0);
 } else {
  ___assert_fail(((392)|0),((432)|0),242,((472)|0));
  // unreachable;
 }
 return 0|0;
}
function __ZN8SNES_SPC18cpu_write_smp_reg_Eiii($this,$data,$time,$addr) {
 $this = $this|0;
 $data = $data|0;
 $time = $time|0;
 $addr = $addr|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 switch ($addr|0) {
 case 12: case 11: case 10:  {
  $1 = (($addr) + -10)|0;
  $2 = (($data) + 255)|0;
  $3 = $2 & 255;
  $4 = (($3) + 1)|0;
  $5 = ((($this) + (($1*24)|0)|0) + 1572|0);
  $6 = HEAP32[$5>>2]|0;
  $7 = ($6|0)==($4|0);
  if ($7) {
   STACKTOP = sp;return;
  }
  $8 = ((($this) + (($1*24)|0)|0) + 1564|0);
  $9 = (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$8,$time)|0);
  $10 = (($9) + 8|0);
  HEAP32[$10>>2] = $4;
  STACKTOP = sp;return;
  break;
 }
 case 15: case 14: case 13:  {
  $11 = ($data|0)<(4096);
  if (!($11)) {
   STACKTOP = sp;return;
  }
  $12 = (($addr) + -13)|0;
  $13 = ((($this) + (($12*24)|0)|0) + 1564|0);
  $14 = (($time) + -1)|0;
  $15 = (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$13,$14)|0);
  $16 = (($15) + 20|0);
  HEAP32[$16>>2] = 0;
  STACKTOP = sp;return;
  break;
 }
 case 9: case 8:  {
  $17 = $data&255;
  $18 = ((($this) + ($addr)|0) + 1652|0);
  HEAP8[$18] = $17;
  STACKTOP = sp;return;
  break;
 }
 case 1:  {
  $19 = $data & 16;
  $20 = ($19|0)==(0);
  if (!($20)) {
   $21 = (($this) + 1656|0);
   HEAP8[$21] = 0;
   $22 = (($this) + 1657|0);
   HEAP8[$22] = 0;
  }
  $23 = $data & 32;
  $24 = ($23|0)==(0);
  if (!($24)) {
   $25 = (($this) + 1658|0);
   HEAP8[$25] = 0;
   $26 = (($this) + 1659|0);
   HEAP8[$26] = 0;
  }
  $27 = $data & 1;
  $28 = (($this) + 1580|0);
  $29 = HEAP32[$28>>2]|0;
  $30 = ($29|0)==($27|0);
  do {
   if (!($30)) {
    $31 = (($this) + 1564|0);
    $32 = (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$31,$time)|0);
    $33 = (($32) + 16|0);
    HEAP32[$33>>2] = $27;
    $34 = ($27|0)==(0);
    if ($34) {
     break;
    }
    $35 = (($32) + 12|0);
    HEAP32[$35>>2] = 0;
    $36 = (($32) + 20|0);
    HEAP32[$36>>2] = 0;
   }
  } while(0);
  $37 = $data >>> 1;
  $38 = $37 & 1;
  $39 = (($this) + 1604|0);
  $40 = HEAP32[$39>>2]|0;
  $41 = ($40|0)==($38|0);
  do {
   if (!($41)) {
    $42 = (($this) + 1588|0);
    $43 = (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$42,$time)|0);
    $44 = (($43) + 16|0);
    HEAP32[$44>>2] = $38;
    $45 = ($38|0)==(0);
    if ($45) {
     break;
    }
    $46 = (($43) + 12|0);
    HEAP32[$46>>2] = 0;
    $47 = (($43) + 20|0);
    HEAP32[$47>>2] = 0;
   }
  } while(0);
  $48 = $data >>> 2;
  $49 = $48 & 1;
  $50 = (($this) + 1628|0);
  $51 = HEAP32[$50>>2]|0;
  $52 = ($51|0)==($49|0);
  do {
   if (!($52)) {
    $53 = (($this) + 1612|0);
    $54 = (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$53,$time)|0);
    $55 = (($54) + 16|0);
    HEAP32[$55>>2] = $49;
    $56 = ($49|0)==(0);
    if ($56) {
     break;
    }
    $57 = (($54) + 12|0);
    HEAP32[$57>>2] = 0;
    $58 = (($54) + 20|0);
    HEAP32[$58>>2] = 0;
   }
  } while(0);
  $59 = $data & 128;
  __ZN8SNES_SPC10enable_romEi($this,$59);
  STACKTOP = sp;return;
  break;
 }
 default: {
  STACKTOP = sp;return;
 }
 }
}
function __ZN8SNES_SPC9run_timerEPNS_5TimerEi($this,$t,$time) {
 $this = $this|0;
 $t = $t|0;
 $time = $time|0;
 var $$0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($t);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)>($time|0);
 if ($3) {
  $$0 = $t;
 } else {
  $4 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$t,$time)|0);
  $$0 = $4;
 }
 STACKTOP = sp;return ($$0|0);
}
function __ZN8SNES_SPC17cpu_write_smp_regEiii($this,$data,$time,$addr) {
 $this = $this|0;
 $data = $data|0;
 $time = $time|0;
 $addr = $addr|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($addr|0)==(3);
 if ($1) {
  __ZN8SNES_SPC9dsp_writeEii($this,$data,$time);
  STACKTOP = sp;return;
 } else {
  __ZN8SNES_SPC18cpu_write_smp_reg_Eiii($this,$data,$time,$addr);
  STACKTOP = sp;return;
 }
}
function __ZN8SNES_SPC9dsp_writeEii($this,$data,$time) {
 $this = $this|0;
 $data = $data|0;
 $time = $time|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1692|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($time) - ($2))|0;
 $4 = ($3|0)>(0);
 if (!($4)) {
  ___assert_fail(((8)|0),((24)|0),156,((376)|0));
  // unreachable;
 }
 HEAP32[$1>>2] = $time;
 $5 = ($this);
 __ZN7SPC_DSP3runEi($5,$3);
 $6 = (($this) + 1638|0);
 $7 = HEAP8[$6]|0;
 $8 = ($7<<24>>24)>(-1);
 if (!($8)) {
  STACKTOP = sp;return;
 }
 $9 = $7&255;
 __ZN7SPC_DSP5writeEii($5,$9,$data);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC14cpu_write_highEiii($this,$data,$i,$time) {
 $this = $this|0;
 $data = $data|0;
 $i = $i|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($i|0)<(64);
 if ($1) {
  $2 = $data&255;
  $3 = ((($this) + ($i)|0) + 1836|0);
  HEAP8[$3] = $2;
  $4 = (($this) + 1768|0);
  $5 = HEAP32[$4>>2]|0;
  $6 = ($5|0)==(0);
  if ($6) {
   STACKTOP = sp;return;
  }
  $7 = ((($this) + ($i)|0) + 1772|0);
  $8 = HEAP8[$7]|0;
  $9 = (($i) + 65472)|0;
  $10 = ((($this) + ($9)|0) + 2412|0);
  HEAP8[$10] = $8;
  STACKTOP = sp;return;
 } else {
  $11 = (($i) + 65472)|0;
  $12 = ((($this) + ($11)|0) + 2412|0);
  $13 = HEAP8[$12]|0;
  $14 = $data&255;
  $15 = ($13<<24>>24)==($14<<24>>24);
  if (!($15)) {
   ___assert_fail(((72)|0),((24)|0),405,((112)|0));
   // unreachable;
  }
  HEAP8[$12] = -1;
  $16 = (($i) + -64)|0;
  __ZN8SNES_SPC9cpu_writeEiii($this,$data,$16,$time);
  STACKTOP = sp;return;
 }
}
function __ZN8SNES_SPC9cpu_writeEiii($this,$data,$addr,$time) {
 $this = $this|0;
 $data = $data|0;
 $addr = $addr|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $data&255;
 $2 = ((($this) + ($addr)|0) + 2412|0);
 HEAP8[$2] = $1;
 $3 = (($addr) + -240)|0;
 $4 = ($3|0)>(-1);
 do {
  if ($4) {
   $5 = ($3|0)<(16);
   if ($5) {
    $6 = ((($this) + ($3)|0) + 1636|0);
    HEAP8[$6] = $1;
    $7 = -788594688 << $3;
    $8 = ($7|0)<(0);
    if (!($8)) {
     break;
    }
    __ZN8SNES_SPC17cpu_write_smp_regEiii($this,$data,$time,$3);
    break;
   } else {
    $9 = (($addr) + -65472)|0;
    $10 = ($9|0)>(-1);
    if (!($10)) {
     break;
    }
    __ZN8SNES_SPC14cpu_write_highEiii($this,$data,$9,$time);
    break;
   }
  }
 } while(0);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC8cpu_readEii($this,$addr,$time) {
 $this = $this|0;
 $addr = $addr|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0;
 var $addr$tr = 0, $or$cond = 0, $result$0 = 0, $t$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $addr$tr = $addr;
 while(1) {
  $1 = (($addr$tr) + -240)|0;
  $2 = ($1|0)>(-1);
  $3 = (($addr$tr) + -256)|0;
  $4 = ($3>>>0)>(65279);
  $or$cond = $2 & $4;
  if (!($or$cond)) {
   label = 11;
   break;
  }
  $5 = (($addr$tr) + -253)|0;
  $6 = ($5>>>0)<(3);
  if ($6) {
   label = 4;
   break;
  }
  $14 = ($5|0)<(0);
  if ($14) {
   label = 8;
   break;
  }
  $16 = (($addr$tr) + -65536)|0;
  $17 = ($16|0)<(256);
  if ($17) {
   $addr$tr = $16;
  } else {
   label = 10;
   break;
  }
 }
 if ((label|0) == 4) {
  $7 = ((($this) + (($5*24)|0)|0) + 1564|0);
  $8 = ($7);
  $9 = HEAP32[$8>>2]|0;
  $10 = ($9|0)>($time|0);
  if ($10) {
   $t$0 = $7;
  } else {
   $11 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$7,$time)|0);
   $t$0 = $11;
  }
  $12 = (($t$0) + 20|0);
  $13 = HEAP32[$12>>2]|0;
  HEAP32[$12>>2] = 0;
  $result$0 = $13;
  STACKTOP = sp;return ($result$0|0);
 }
 else if ((label|0) == 8) {
  $15 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$1,$time)|0);
  $result$0 = $15;
  STACKTOP = sp;return ($result$0|0);
 }
 else if ((label|0) == 10) {
  ___assert_fail(((128)|0),((24)|0),497,((176)|0));
  // unreachable;
 }
 else if ((label|0) == 11) {
  $18 = ((($this) + ($addr$tr)|0) + 2412|0);
  $19 = HEAP8[$18]|0;
  $20 = $19&255;
  $result$0 = $20;
  STACKTOP = sp;return ($result$0|0);
 }
 return 0|0;
}
function __ZN8SNES_SPC16cpu_read_smp_regEii($this,$reg,$time) {
 $this = $this|0;
 $reg = $reg|0;
 $time = $time|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $result$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($this) + ($reg)|0) + 1652|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = (($reg) + -2)|0;
 $5 = ($4>>>0)<(2);
 do {
  if ($5) {
   $6 = (($this) + 1638|0);
   $7 = HEAP8[$6]|0;
   $8 = $7&255;
   $9 = ($4|0)==(1);
   if (!($9)) {
    $result$0 = $8;
    break;
   }
   $10 = (__ZN8SNES_SPC8dsp_readEi($this,$time)|0);
   $result$0 = $10;
  } else {
   $result$0 = $3;
  }
 } while(0);
 STACKTOP = sp;return ($result$0|0);
}
function __ZN8SNES_SPC9end_frameEi($this,$end_time) {
 $this = $this|0;
 $end_time = $end_time|0;
 var $$off = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1696|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)<($end_time|0);
 if ($3) {
  (__ZN8SNES_SPC10run_until_Ei($this,$end_time)|0);
 }
 $4 = HEAP32[$1>>2]|0;
 $5 = (($4) - ($end_time))|0;
 HEAP32[$1>>2] = $5;
 $6 = (($this) + 1720|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (($7) + ($end_time))|0;
 HEAP32[$6>>2] = $8;
 $9 = HEAP32[$1>>2]|0;
 $$off = (($9) + 11)|0;
 $10 = ($$off>>>0)<(12);
 if (!($10)) {
  ___assert_fail(((192)|0),((24)|0),546,((240)|0));
  // unreachable;
 }
 $11 = (($this) + 1564|0);
 (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$11,0)|0);
 $12 = (($this) + 1588|0);
 (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$12,0)|0);
 $13 = (($this) + 1612|0);
 (__ZN8SNES_SPC9run_timerEPNS_5TimerEi(0,$13,0)|0);
 $14 = (($this) + 1692|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = ($15|0)<(0);
 if ($16) {
  $17 = (0 - ($15))|0;
  HEAP32[$14>>2] = 0;
  $18 = ($this);
  __ZN7SPC_DSP3runEi($18,$17);
 }
 $19 = (($this) + 1724|0);
 $20 = HEAP32[$19>>2]|0;
 $21 = ($20|0)==(0|0);
 if ($21) {
  STACKTOP = sp;return;
 }
 __ZN8SNES_SPC10save_extraEv($this);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC10run_until_Ei($this,$end_time) {
 $this = $this|0;
 $end_time = $end_time|0;
 var $$ = 0, $$21 = 0, $$22 = 0, $$23 = 0, $$24 = 0, $$25 = 0, $$26 = 0, $$27 = 0, $$28 = 0, $$29 = 0, $$30 = 0, $$data$43 = 0, $$masked = 0, $$sum = 0, $$sum1 = 0, $$sum11 = 0, $$sum13 = 0, $$sum15 = 0, $$sum16 = 0, $$sum17 = 0;
 var $$sum19 = 0, $$sum3 = 0, $$sum5 = 0, $$sum7 = 0, $$sum9 = 0, $1 = 0, $10 = 0, $100 = 0, $1000 = 0, $1001 = 0, $1002 = 0, $1003 = 0, $1004 = 0, $1005 = 0, $1006 = 0, $1007 = 0, $1008 = 0, $1009 = 0, $101 = 0, $1010 = 0;
 var $1011 = 0, $1012 = 0, $1013 = 0, $1014 = 0, $1015 = 0, $1016 = 0, $1017 = 0, $1018 = 0, $1019 = 0, $102 = 0, $1020 = 0, $1021 = 0, $1022 = 0, $1023 = 0, $1024 = 0, $1025 = 0, $1026 = 0, $1027 = 0, $1028 = 0, $1029 = 0;
 var $103 = 0, $1030 = 0, $1031 = 0, $1032 = 0, $1033 = 0, $1034 = 0, $1035 = 0, $1036 = 0, $1037 = 0, $1038 = 0, $1039 = 0, $104 = 0, $1040 = 0, $1041 = 0, $1042 = 0, $1043 = 0, $1044 = 0, $1045 = 0, $1046 = 0, $1047 = 0;
 var $1048 = 0, $1049 = 0, $105 = 0, $1050 = 0, $1051 = 0, $1052 = 0, $1053 = 0, $1054 = 0, $1055 = 0, $1056 = 0, $1057 = 0, $1058 = 0, $1059 = 0, $106 = 0, $1060 = 0, $1061 = 0, $1062 = 0, $1063 = 0, $1064 = 0, $1065 = 0;
 var $1066 = 0, $1067 = 0, $1068 = 0, $1069 = 0, $107 = 0, $1070 = 0, $1071 = 0, $1072 = 0, $1073 = 0, $1074 = 0, $1075 = 0, $1076 = 0, $1077 = 0, $1078 = 0, $1079 = 0, $108 = 0, $1080 = 0, $1081 = 0, $1082 = 0, $1083 = 0;
 var $1084 = 0, $1085 = 0, $1086 = 0, $1087 = 0, $1088 = 0, $1089 = 0, $109 = 0, $1090 = 0, $1091 = 0, $1092 = 0, $1093 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0;
 var $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0, $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0;
 var $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0;
 var $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0;
 var $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0;
 var $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0;
 var $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0;
 var $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0;
 var $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0;
 var $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0;
 var $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0;
 var $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0;
 var $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0;
 var $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0;
 var $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0;
 var $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0;
 var $389 = 0, $39 = 0, $390 = 0, $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0;
 var $406 = 0, $407 = 0, $408 = 0, $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0;
 var $424 = 0, $425 = 0, $426 = 0, $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0;
 var $442 = 0, $443 = 0, $444 = 0, $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0;
 var $460 = 0, $461 = 0, $462 = 0, $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0;
 var $479 = 0, $48 = 0, $480 = 0, $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0;
 var $497 = 0, $498 = 0, $499 = 0, $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0;
 var $514 = 0, $515 = 0, $516 = 0, $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0;
 var $532 = 0, $533 = 0, $534 = 0, $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0;
 var $550 = 0, $551 = 0, $552 = 0, $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0;
 var $569 = 0, $57 = 0, $570 = 0, $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0;
 var $587 = 0, $588 = 0, $589 = 0, $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0;
 var $604 = 0, $605 = 0, $606 = 0, $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0;
 var $622 = 0, $623 = 0, $624 = 0, $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0;
 var $640 = 0, $641 = 0, $642 = 0, $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0;
 var $659 = 0, $66 = 0, $660 = 0, $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0, $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0;
 var $677 = 0, $678 = 0, $679 = 0, $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0;
 var $695 = 0, $696 = 0, $697 = 0, $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0;
 var $712 = 0, $713 = 0, $714 = 0, $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0, $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0, $727 = 0, $728 = 0, $729 = 0, $73 = 0;
 var $730 = 0, $731 = 0, $732 = 0, $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0;
 var $749 = 0, $75 = 0, $750 = 0, $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0, $766 = 0;
 var $767 = 0, $768 = 0, $769 = 0, $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0;
 var $785 = 0, $786 = 0, $787 = 0, $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0, $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0;
 var $802 = 0, $803 = 0, $804 = 0, $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0;
 var $820 = 0, $821 = 0, $822 = 0, $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0, $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0, $838 = 0;
 var $839 = 0, $84 = 0, $840 = 0, $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0, $856 = 0;
 var $857 = 0, $858 = 0, $859 = 0, $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0, $864 = 0, $865 = 0, $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0, $874 = 0;
 var $875 = 0, $876 = 0, $877 = 0, $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0, $882 = 0, $883 = 0, $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0, $892 = 0;
 var $893 = 0, $894 = 0, $895 = 0, $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0, $90 = 0, $900 = 0, $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0, $91 = 0;
 var $910 = 0, $911 = 0, $912 = 0, $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0, $918 = 0, $919 = 0, $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0, $928 = 0;
 var $929 = 0, $93 = 0, $930 = 0, $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0, $936 = 0, $937 = 0, $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0, $946 = 0;
 var $947 = 0, $948 = 0, $949 = 0, $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0, $954 = 0, $955 = 0, $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0, $964 = 0;
 var $965 = 0, $966 = 0, $967 = 0, $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0, $972 = 0, $973 = 0, $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $980 = 0, $981 = 0, $982 = 0;
 var $983 = 0, $984 = 0, $985 = 0, $986 = 0, $987 = 0, $988 = 0, $989 = 0, $99 = 0, $990 = 0, $991 = 0, $992 = 0, $993 = 0, $994 = 0, $995 = 0, $996 = 0, $997 = 0, $998 = 0, $999 = 0, $a$0 = 0, $a$1$be = 0;
 var $a$157 = 0, $a$188 = 0, $a$2 = 0, $a$3 = 0, $a$4 = 0, $a$5 = 0, $a$6 = 0, $addr28$0 = 0, $addr29$0 = 0, $addr31$0 = 0, $addr33$0 = 0, $addr33$1 = 0, $c$0 = 0, $c$1$be = 0, $c$10 = 0, $c$11 = 0, $c$12 = 0, $c$13 = 0, $c$139 = 0, $c$163 = 0;
 var $c$2 = 0, $c$3 = 0, $c$4 = 0, $c$5 = 0, $c$6 = 0, $c$7 = 0, $c$8 = 0, $c$9 = 0, $data$0 = 0, $data$1 = 0, $data$10 = 0, $data$11 = 0, $data$12 = 0, $data$13 = 0, $data$14 = 0, $data$15 = 0, $data$16 = 0, $data$17 = 0, $data$18 = 0, $data$19 = 0;
 var $data$2 = 0, $data$20 = 0, $data$21 = 0, $data$22 = 0, $data$23 = 0, $data$24 = 0, $data$25 = 0, $data$26 = 0, $data$27 = 0, $data$28 = 0, $data$29 = 0, $data$3 = 0, $data$30 = 0, $data$31 = 0, $data$32 = 0, $data$33 = 0, $data$34 = 0, $data$35 = 0, $data$36 = 0, $data$37 = 0;
 var $data$38 = 0, $data$39 = 0, $data$4 = 0, $data$40 = 0, $data$41 = 0, $data$43 = 0, $data$45 = 0, $data$46 = 0, $data$47 = 0, $data$48 = 0, $data$49 = 0, $data$5 = 0, $data$50 = 0, $data$51 = 0, $data$6 = 0, $data$7 = 0, $data$8 = 0, $data$9 = 0, $dp$0$be = 0, $dp$033 = 0;
 var $dp$060 = 0, $hi$0 = 0, $lo$0 = 0, $nz$0 = 0, $nz$1$be = 0, $nz$136 = 0, $nz$161 = 0, $nz$2 = 0, $pc$0 = 0, $pc$1 = 0, $pc$10 = 0, $pc$11 = 0, $pc$12 = 0, $pc$13 = 0, $pc$14 = 0, $pc$15 = 0, $pc$16 = 0, $pc$17 = 0, $pc$18 = 0, $pc$19 = 0;
 var $pc$2$be = 0, $pc$20 = 0, $pc$21 = 0, $pc$22 = 0, $pc$24 = 0, $pc$248 = 0, $pc$25 = 0, $pc$26 = 0, $pc$268 = 0, $pc$27 = 0, $pc$28 = 0, $pc$29 = 0, $pc$3 = 0, $pc$4 = 0, $pc$5 = 0, $pc$6 = 0, $pc$7 = 0, $pc$8 = 0, $pc$9 = 0, $psw$0 = 0;
 var $psw$1$be = 0, $psw$142 = 0, $psw$165 = 0, $psw$3 = 0, $rel_time$0 = 0, $rel_time$1$be = 0, $rel_time$2 = 0, $sp$0$be = 0, $sp$045 = 0, $sp$067 = 0, $sp$1 = 0, $sp$2 = 0, $t$0 = 0, $t14$0 = 0, $t19$0 = 0, $t25$0 = 0, $t44$0 = 0, $t5$0 = 0, $temp$0 = 0, $temp27$0 = 0;
 var $temp40$0 = 0, $temp53$0 = 0, $x$0 = 0, $x$1$be = 0, $x$154 = 0, $x$175 = 0, $y$0 = 0, $y$1$be = 0, $y$151 = 0, $y$169 = 0, $y$2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1696|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) - ($end_time))|0;
 $4 = ($3|0)<(1);
 if (!($4)) {
  ___assert_fail(((256)|0),((272)|0),163,((304)|0));
  // unreachable;
 }
 HEAP32[$1>>2] = $end_time;
 $5 = (($this) + 1692|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($6) + ($3))|0;
 HEAP32[$5>>2] = $7;
 $8 = (($this) + 1564|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (($9) + ($3))|0;
 HEAP32[$8>>2] = $10;
 $11 = (($this) + 1588|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = (($12) + ($3))|0;
 HEAP32[$11>>2] = $13;
 $14 = (($this) + 1612|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (($15) + ($3))|0;
 HEAP32[$14>>2] = $16;
 $17 = (($this) + 2412|0);
 $18 = (($this) + 1672|0);
 $19 = HEAP32[$18>>2]|0;
 $20 = (($this) + 1676|0);
 $21 = HEAP32[$20>>2]|0;
 $22 = (($this) + 1680|0);
 $23 = HEAP32[$22>>2]|0;
 $24 = (($this) + 1668|0);
 $25 = HEAP32[$24>>2]|0;
 $26 = ((($this) + ($25)|0) + 2412|0);
 $27 = (($this) + 1688|0);
 $28 = HEAP32[$27>>2]|0;
 $$sum = (($28) + 257)|0;
 $29 = ((($this) + ($$sum)|0) + 2412|0);
 $30 = (($this) + 1684|0);
 $31 = HEAP32[$30>>2]|0;
 $32 = $31 << 8;
 $33 = $31 << 3;
 $34 = $33 & 256;
 $35 = $31 << 4;
 $36 = $35 & 2048;
 $37 = $31 & 2;
 $38 = $36 | $37;
 $39 = $38 ^ 2;
 $40 = HEAP8[$26]|0;
 $41 = $40&255;
 $42 = ((($this) + ($41)|0) + 1900|0);
 $43 = HEAP8[$42]|0;
 $44 = $43&255;
 $45 = (($44) + ($3))|0;
 $46 = ($45|0)>(0);
 L4: do {
  if ($46) {
   $a$157 = $19;$c$139 = $32;$dp$033 = $34;$nz$136 = $39;$pc$248 = $26;$psw$142 = $31;$rel_time$2 = $3;$sp$045 = $29;$x$154 = $21;$y$151 = $23;
  } else {
   $47 = $17;
   $48 = $17;
   $49 = $17;
   $50 = $17;
   $51 = (($this) + 67914|0);
   $52 = $17;
   $53 = $17;
   $54 = $17;
   $55 = $17;
   $56 = $17;
   $57 = $17;
   $58 = $17;
   $59 = $17;
   $60 = $17;
   $61 = $17;
   $62 = $17;
   $74 = $45;$75 = $41;$76 = $40;$a$188 = $19;$c$163 = $32;$dp$060 = $34;$nz$161 = $39;$pc$268 = $26;$psw$165 = $31;$sp$067 = $29;$x$175 = $21;$y$169 = $23;
   L6: while(1) {
    $77 = (($pc$268) + 1|0);
    $78 = HEAP8[$77]|0;
    $79 = $78&255;
    L8: do {
     switch ($75|0) {
     case 232:  {
      $a$0 = $79;$c$0 = $c$163;$nz$0 = $79;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 0:  {
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 240:  {
      $80 = $78 << 24 >> 24;
      $$sum19 = (($80) + 2)|0;
      $81 = (($pc$268) + ($$sum19)|0);
      $82 = $nz$161&255;
      $83 = ($82<<24>>24)==(0);
      if ($83) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $81;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $84 = (($pc$268) + 2|0);
      $85 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $84;$psw$1$be = $psw$165;$rel_time$1$be = $85;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 208:  {
      $86 = $78 << 24 >> 24;
      $$sum17 = (($86) + 2)|0;
      $87 = (($pc$268) + ($$sum17)|0);
      $88 = $nz$161&255;
      $89 = ($88<<24>>24)==(0);
      if (!($89)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $87;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $90 = (($pc$268) + 2|0);
      $91 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $90;$psw$1$be = $psw$165;$rel_time$1$be = $91;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 63:  {
      $92 = $77;
      $93 = (($92) - ($47))|0;
      $94 = (($93) + 2)|0;
      $95 = (__Z8get_le16PKv($77)|0);
      $96 = ((($this) + ($95)|0) + 2412|0);
      $97 = (($sp$067) + -2|0);
      $98 = $97;
      $99 = (($98) - ($47))|0;
      $100 = ($99|0)>(256);
      if ($100) {
       __Z8set_le16Pvj($97,$94);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $96;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $97;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      } else {
       $101 = $94&255;
       $102 = $99 & 255;
       $103 = $102 | 256;
       $104 = ((($this) + ($103)|0) + 2412|0);
       HEAP8[$104] = $101;
       $105 = $94 >>> 8;
       $106 = $105&255;
       $107 = (($sp$067) + -1|0);
       HEAP8[$107] = $106;
       $108 = (($sp$067) + 254|0);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $96;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $108;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      break;
     }
     case 111:  {
      $109 = $sp$067;
      $110 = (($109) - ($48))|0;
      $111 = (__Z8get_le16PKv($sp$067)|0);
      $112 = ((($this) + ($111)|0) + 2412|0);
      $113 = (($sp$067) + 2|0);
      $114 = ($110|0)<(511);
      if ($114) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $112;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $113;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $115 = (($sp$067) + -255|0);
      $116 = HEAP8[$115]|0;
      $117 = $116&255;
      $118 = $117 << 8;
      $119 = $110 & 255;
      $120 = $119 | 256;
      $121 = ((($this) + ($120)|0) + 2412|0);
      $122 = HEAP8[$121]|0;
      $123 = $122&255;
      $124 = $118 | $123;
      $125 = ((($this) + ($124)|0) + 2412|0);
      $126 = (($sp$067) + -254|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $125;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $126;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 228:  {
      $127 = (($pc$268) + 2|0);
      $128 = $79 | $dp$060;
      $129 = (($128) + -253)|0;
      $130 = ($129>>>0)<(3);
      if (!($130)) {
       $138 = ((($this) + ($128)|0) + 2412|0);
       $139 = HEAP8[$138]|0;
       $140 = $139&255;
       $141 = (($128) + -240)|0;
       $142 = ($141>>>0)<(16);
       if (!($142)) {
        $a$1$be = $140;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $140;$pc$2$be = $127;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
        break L8;
       }
       $143 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$141,$74)|0);
       $a$1$be = $143;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $143;$pc$2$be = $127;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $131 = ((($this) + (($129*24)|0)|0) + 1564|0);
      $132 = ($131);
      $133 = HEAP32[$132>>2]|0;
      $134 = ($74|0)<($133|0);
      if ($134) {
       $t$0 = $131;
      } else {
       $135 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$131,$74)|0);
       $t$0 = $135;
      }
      $136 = (($t$0) + 20|0);
      $137 = HEAP32[$136>>2]|0;
      HEAP32[$136>>2] = 0;
      $a$1$be = $137;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $137;$pc$2$be = $127;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 250:  {
      $144 = (($74) + -2)|0;
      $145 = $79 | $dp$060;
      $146 = (($145) + -253)|0;
      $147 = ($146>>>0)<(3);
      do {
       if ($147) {
        $148 = ((($this) + (($146*24)|0)|0) + 1564|0);
        $149 = ($148);
        $150 = HEAP32[$149>>2]|0;
        $151 = ($144|0)<($150|0);
        if ($151) {
         $t5$0 = $148;
        } else {
         $152 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$148,$144)|0);
         $t5$0 = $152;
        }
        $153 = (($t5$0) + 20|0);
        $154 = HEAP32[$153>>2]|0;
        HEAP32[$153>>2] = 0;
        $temp$0 = $154;
       } else {
        $155 = ((($this) + ($145)|0) + 2412|0);
        $156 = HEAP8[$155]|0;
        $157 = $156&255;
        $158 = (($145) + -240)|0;
        $159 = ($158>>>0)<(16);
        if (!($159)) {
         $temp$0 = $157;
         break;
        }
        $160 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$158,$144)|0);
        $temp$0 = $160;
       }
      } while(0);
      $161 = (($temp$0) + 8192)|0;
      $data$0 = $161;
      label = 31;
      break;
     }
     case 143:  {
      $data$0 = $79;
      label = 31;
      break;
     }
     case 196:  {
      $174 = (($pc$268) + 2|0);
      $175 = $79 | $dp$060;
      $176 = $a$188&255;
      $177 = ((($this) + ($175)|0) + 2412|0);
      HEAP8[$177] = $176;
      $178 = (($175) + -240)|0;
      $179 = ($178>>>0)<(16);
      if (!($179)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $174;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $180 = (($175) + -242)|0;
      $181 = ((($this) + ($178)|0) + 1636|0);
      HEAP8[$181] = $176;
      $182 = ($180|0)==(1);
      if ($182) {
       __ZN8SNES_SPC9dsp_writeEii($this,$a$188,$74);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $174;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $183 = ($180>>>0)>(1);
      if (!($183)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $174;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      __ZN8SNES_SPC18cpu_write_smp_reg_Eiii($this,$a$188,$74,$178);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $174;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 230:  {
      $184 = (($x$175) + ($dp$060))|0;
      $data$2 = $184;$pc$3 = $pc$268;
      label = 46;
      break;
     }
     case 247:  {
      $185 = $79 | $dp$060;
      $186 = ((($this) + ($185)|0) + 2412|0);
      $187 = (__Z8get_le16PKv($186)|0);
      $188 = (($187) + ($y$169))|0;
      $data$2 = $188;$pc$3 = $77;
      label = 46;
      break;
     }
     case 231:  {
      $189 = (($79) + ($x$175))|0;
      $190 = $189 & 255;
      $191 = $190 | $dp$060;
      $192 = ((($this) + ($191)|0) + 2412|0);
      $193 = (__Z8get_le16PKv($192)|0);
      $data$2 = $193;$pc$3 = $77;
      label = 46;
      break;
     }
     case 246:  {
      $194 = (($79) + ($y$169))|0;
      $data$1 = $194;
      label = 44;
      break;
     }
     case 245:  {
      $195 = (($79) + ($x$175))|0;
      $data$1 = $195;
      label = 44;
      break;
     }
     case 229:  {
      $data$1 = $79;
      label = 44;
      break;
     }
     case 244:  {
      $201 = (($79) + ($x$175))|0;
      $202 = $201 & 255;
      $203 = $202 | $dp$060;
      $data$2 = $203;$pc$3 = $77;
      label = 46;
      break;
     }
     case 191:  {
      $205 = (($x$175) + ($dp$060))|0;
      $206 = (($x$175) + 1)|0;
      $207 = $206 & 255;
      $208 = (($74) + -1)|0;
      $209 = (__ZN8SNES_SPC8cpu_readEii($this,$205,$208)|0);
      $a$1$be = $209;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $209;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $207;$y$1$be = $y$169;
      break;
     }
     case 249:  {
      $210 = (($79) + ($y$169))|0;
      $211 = $210 & 255;
      $data$3 = $211;
      label = 49;
      break;
     }
     case 248:  {
      $data$3 = $79;
      label = 49;
      break;
     }
     case 233:  {
      $228 = (__Z8get_le16PKv($77)|0);
      $229 = (($pc$268) + 2|0);
      $230 = (__ZN8SNES_SPC8cpu_readEii($this,$228,$74)|0);
      $data$4 = $230;$pc$4 = $229;
      label = 56;
      break;
     }
     case 205:  {
      $data$4 = $79;$pc$4 = $77;
      label = 56;
      break;
     }
     case 251:  {
      $231 = (($79) + ($x$175))|0;
      $232 = $231 & 255;
      $data$5 = $232;
      label = 58;
      break;
     }
     case 235:  {
      $data$5 = $79;
      label = 58;
      break;
     }
     case 236:  {
      $250 = (__Z8get_le16PKv($77)|0);
      $251 = (($pc$268) + 3|0);
      $252 = (($250) + -253)|0;
      $253 = ($252>>>0)<(3);
      if (!($253)) {
       $261 = ((($this) + ($250)|0) + 2412|0);
       $262 = HEAP8[$261]|0;
       $263 = $262&255;
       $264 = (($250) + -240)|0;
       $265 = ($264>>>0)<(16);
       if (!($265)) {
        $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $263;$pc$2$be = $251;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $263;
        break L8;
       }
       $266 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$264,$74)|0);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $266;$pc$2$be = $251;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $266;
       break L8;
      }
      $254 = ((($this) + (($252*24)|0)|0) + 1564|0);
      $255 = ($254);
      $256 = HEAP32[$255>>2]|0;
      $257 = ($74|0)<($256|0);
      if ($257) {
       $t25$0 = $254;
      } else {
       $258 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$254,$74)|0);
       $t25$0 = $258;
      }
      $259 = (($t25$0) + 20|0);
      $260 = HEAP32[$259>>2]|0;
      HEAP32[$259>>2] = 0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $260;$pc$2$be = $251;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $260;
      break;
     }
     case 141:  {
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $79;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $79;
      label = 6;
      break;
     }
     case 198:  {
      $267 = (($x$175) + ($dp$060))|0;
      $data$7 = $267;$pc$5 = $pc$268;
      label = 78;
      break;
     }
     case 215:  {
      $268 = $79 | $dp$060;
      $269 = ((($this) + ($268)|0) + 2412|0);
      $270 = (__Z8get_le16PKv($269)|0);
      $271 = (($270) + ($y$169))|0;
      $data$7 = $271;$pc$5 = $77;
      label = 78;
      break;
     }
     case 199:  {
      $272 = (($79) + ($x$175))|0;
      $273 = $272 & 255;
      $274 = $273 | $dp$060;
      $275 = ((($this) + ($274)|0) + 2412|0);
      $276 = (__Z8get_le16PKv($275)|0);
      $data$7 = $276;$pc$5 = $77;
      label = 78;
      break;
     }
     case 214:  {
      $277 = (($79) + ($y$169))|0;
      $data$6 = $277;
      label = 76;
      break;
     }
     case 213:  {
      $278 = (($79) + ($x$175))|0;
      $data$6 = $278;
      label = 76;
      break;
     }
     case 197:  {
      $data$6 = $79;
      label = 76;
      break;
     }
     case 212:  {
      $284 = (($79) + ($x$175))|0;
      $285 = $284 & 255;
      $286 = $285 | $dp$060;
      $data$7 = $286;$pc$5 = $77;
      label = 78;
      break;
     }
     case 201:  {
      $temp27$0 = $x$175;
      label = 80;
      break;
     }
     case 204:  {
      $temp27$0 = $y$169;
      label = 80;
      break;
     }
     case 217:  {
      $289 = (($79) + ($y$169))|0;
      $290 = $289 & 255;
      $data$8 = $290;
      label = 82;
      break;
     }
     case 216:  {
      $data$8 = $79;
      label = 82;
      break;
     }
     case 219:  {
      $292 = (($79) + ($x$175))|0;
      $293 = $292 & 255;
      $data$9 = $293;
      label = 84;
      break;
     }
     case 203:  {
      $data$9 = $79;
      label = 84;
      break;
     }
     case 125:  {
      $a$1$be = $x$175;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $x$175;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 221:  {
      $a$1$be = $y$169;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $y$169;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 93:  {
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $a$188;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $a$188;$y$1$be = $y$169;
      break;
     }
     case 253:  {
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $a$188;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $a$188;
      break;
     }
     case 157:  {
      $295 = (($sp$067) + -257|0);
      $296 = $295;
      $297 = (($296) - ($49))|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $297;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $297;$y$1$be = $y$169;
      break;
     }
     case 189:  {
      $$sum16 = (($x$175) + 257)|0;
      $298 = ((($this) + ($$sum16)|0) + 2412|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $298;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 175:  {
      $299 = (($a$188) + 8192)|0;
      $300 = (($x$175) + ($dp$060))|0;
      __ZN8SNES_SPC9cpu_writeEiii($this,$299,$300,$74);
      $301 = (($x$175) + 1)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $301;$y$1$be = $y$169;
      break;
     }
     case 38:  {
      $302 = (($x$175) + ($dp$060))|0;
      $data$12 = $302;$pc$6 = $pc$268;
      label = 100;
      break;
     }
     case 55:  {
      $303 = $79 | $dp$060;
      $304 = ((($this) + ($303)|0) + 2412|0);
      $305 = (__Z8get_le16PKv($304)|0);
      $306 = (($305) + ($y$169))|0;
      $data$12 = $306;$pc$6 = $77;
      label = 100;
      break;
     }
     case 39:  {
      $307 = (($79) + ($x$175))|0;
      $308 = $307 & 255;
      $309 = $308 | $dp$060;
      $310 = ((($this) + ($309)|0) + 2412|0);
      $311 = (__Z8get_le16PKv($310)|0);
      $data$12 = $311;$pc$6 = $77;
      label = 100;
      break;
     }
     case 54:  {
      $312 = (($79) + ($y$169))|0;
      $data$10 = $312;
      label = 97;
      break;
     }
     case 53:  {
      $313 = (($79) + ($x$175))|0;
      $data$10 = $313;
      label = 97;
      break;
     }
     case 37:  {
      $data$10 = $79;
      label = 97;
      break;
     }
     case 52:  {
      $319 = (($79) + ($x$175))|0;
      $320 = $319 & 255;
      $data$11 = $320;
      label = 99;
      break;
     }
     case 36:  {
      $data$11 = $79;
      label = 99;
      break;
     }
     case 40:  {
      $data$13 = $79;$pc$7 = $77;
      label = 101;
      break;
     }
     case 57:  {
      $324 = (($y$169) + ($dp$060))|0;
      $325 = (($74) + -2)|0;
      $326 = (__ZN8SNES_SPC8cpu_readEii($this,$324,$325)|0);
      $327 = (($x$175) + ($dp$060))|0;
      $addr28$0 = $327;$data$15 = $326;$pc$8 = $77;
      label = 105;
      break;
     }
     case 41:  {
      $328 = $79 | $dp$060;
      $329 = (($74) + -3)|0;
      $330 = (__ZN8SNES_SPC8cpu_readEii($this,$328,$329)|0);
      $data$14 = $330;
      label = 104;
      break;
     }
     case 56:  {
      $data$14 = $79;
      label = 104;
      break;
     }
     case 6:  {
      $339 = (($x$175) + ($dp$060))|0;
      $data$18 = $339;$pc$9 = $pc$268;
      label = 114;
      break;
     }
     case 23:  {
      $340 = $79 | $dp$060;
      $341 = ((($this) + ($340)|0) + 2412|0);
      $342 = (__Z8get_le16PKv($341)|0);
      $343 = (($342) + ($y$169))|0;
      $data$18 = $343;$pc$9 = $77;
      label = 114;
      break;
     }
     case 7:  {
      $344 = (($79) + ($x$175))|0;
      $345 = $344 & 255;
      $346 = $345 | $dp$060;
      $347 = ((($this) + ($346)|0) + 2412|0);
      $348 = (__Z8get_le16PKv($347)|0);
      $data$18 = $348;$pc$9 = $77;
      label = 114;
      break;
     }
     case 22:  {
      $349 = (($79) + ($y$169))|0;
      $data$16 = $349;
      label = 111;
      break;
     }
     case 21:  {
      $350 = (($79) + ($x$175))|0;
      $data$16 = $350;
      label = 111;
      break;
     }
     case 5:  {
      $data$16 = $79;
      label = 111;
      break;
     }
     case 20:  {
      $356 = (($79) + ($x$175))|0;
      $357 = $356 & 255;
      $data$17 = $357;
      label = 113;
      break;
     }
     case 4:  {
      $data$17 = $79;
      label = 113;
      break;
     }
     case 8:  {
      $data$19 = $79;$pc$10 = $77;
      label = 115;
      break;
     }
     case 25:  {
      $361 = (($y$169) + ($dp$060))|0;
      $362 = (($74) + -2)|0;
      $363 = (__ZN8SNES_SPC8cpu_readEii($this,$361,$362)|0);
      $364 = (($x$175) + ($dp$060))|0;
      $addr29$0 = $364;$data$21 = $363;$pc$11 = $77;
      label = 119;
      break;
     }
     case 9:  {
      $365 = $79 | $dp$060;
      $366 = (($74) + -3)|0;
      $367 = (__ZN8SNES_SPC8cpu_readEii($this,$365,$366)|0);
      $data$20 = $367;
      label = 118;
      break;
     }
     case 24:  {
      $data$20 = $79;
      label = 118;
      break;
     }
     case 70:  {
      $376 = (($x$175) + ($dp$060))|0;
      $data$24 = $376;$pc$12 = $pc$268;
      label = 128;
      break;
     }
     case 87:  {
      $377 = $79 | $dp$060;
      $378 = ((($this) + ($377)|0) + 2412|0);
      $379 = (__Z8get_le16PKv($378)|0);
      $380 = (($379) + ($y$169))|0;
      $data$24 = $380;$pc$12 = $77;
      label = 128;
      break;
     }
     case 71:  {
      $381 = (($79) + ($x$175))|0;
      $382 = $381 & 255;
      $383 = $382 | $dp$060;
      $384 = ((($this) + ($383)|0) + 2412|0);
      $385 = (__Z8get_le16PKv($384)|0);
      $data$24 = $385;$pc$12 = $77;
      label = 128;
      break;
     }
     case 86:  {
      $386 = (($79) + ($y$169))|0;
      $data$22 = $386;
      label = 125;
      break;
     }
     case 85:  {
      $387 = (($79) + ($x$175))|0;
      $data$22 = $387;
      label = 125;
      break;
     }
     case 69:  {
      $data$22 = $79;
      label = 125;
      break;
     }
     case 84:  {
      $393 = (($79) + ($x$175))|0;
      $394 = $393 & 255;
      $data$23 = $394;
      label = 127;
      break;
     }
     case 68:  {
      $data$23 = $79;
      label = 127;
      break;
     }
     case 72:  {
      $data$25 = $79;$pc$13 = $77;
      label = 129;
      break;
     }
     case 89:  {
      $398 = (($y$169) + ($dp$060))|0;
      $399 = (($74) + -2)|0;
      $400 = (__ZN8SNES_SPC8cpu_readEii($this,$398,$399)|0);
      $401 = (($x$175) + ($dp$060))|0;
      $addr31$0 = $401;$data$27 = $400;$pc$14 = $77;
      label = 133;
      break;
     }
     case 73:  {
      $402 = $79 | $dp$060;
      $403 = (($74) + -3)|0;
      $404 = (__ZN8SNES_SPC8cpu_readEii($this,$402,$403)|0);
      $data$26 = $404;
      label = 132;
      break;
     }
     case 88:  {
      $data$26 = $79;
      label = 132;
      break;
     }
     case 102:  {
      $413 = (($x$175) + ($dp$060))|0;
      $data$30 = $413;$pc$15 = $pc$268;
      label = 142;
      break;
     }
     case 119:  {
      $414 = $79 | $dp$060;
      $415 = ((($this) + ($414)|0) + 2412|0);
      $416 = (__Z8get_le16PKv($415)|0);
      $417 = (($416) + ($y$169))|0;
      $data$30 = $417;$pc$15 = $77;
      label = 142;
      break;
     }
     case 103:  {
      $418 = (($79) + ($x$175))|0;
      $419 = $418 & 255;
      $420 = $419 | $dp$060;
      $421 = ((($this) + ($420)|0) + 2412|0);
      $422 = (__Z8get_le16PKv($421)|0);
      $data$30 = $422;$pc$15 = $77;
      label = 142;
      break;
     }
     case 118:  {
      $423 = (($79) + ($y$169))|0;
      $data$28 = $423;
      label = 139;
      break;
     }
     case 117:  {
      $424 = (($79) + ($x$175))|0;
      $data$28 = $424;
      label = 139;
      break;
     }
     case 101:  {
      $data$28 = $79;
      label = 139;
      break;
     }
     case 116:  {
      $430 = (($79) + ($x$175))|0;
      $431 = $430 & 255;
      $data$29 = $431;
      label = 141;
      break;
     }
     case 100:  {
      $data$29 = $79;
      label = 141;
      break;
     }
     case 104:  {
      $data$31 = $79;$pc$16 = $77;
      label = 143;
      break;
     }
     case 121:  {
      $437 = (($y$169) + ($dp$060))|0;
      $438 = (($74) + -2)|0;
      $439 = (__ZN8SNES_SPC8cpu_readEii($this,$437,$438)|0);
      $440 = (($x$175) + ($dp$060))|0;
      $441 = (($74) + -1)|0;
      $442 = (__ZN8SNES_SPC8cpu_readEii($this,$440,$441)|0);
      $443 = (($442) - ($439))|0;
      $444 = $443 ^ -1;
      $445 = $443 & 255;
      $a$1$be = $a$188;$c$1$be = $444;$dp$0$be = $dp$060;$nz$1$be = $445;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 105:  {
      $446 = $79 | $dp$060;
      $447 = (($74) + -3)|0;
      $448 = (__ZN8SNES_SPC8cpu_readEii($this,$446,$447)|0);
      $data$32 = $448;
      label = 146;
      break;
     }
     case 62:  {
      $458 = $79 | $dp$060;
      $data$33 = $458;$pc$17 = $77;
      label = 149;
      break;
     }
     case 120:  {
      $data$32 = $79;
      label = 146;
      break;
     }
     case 30:  {
      $459 = (__Z8get_le16PKv($77)|0);
      $460 = (($pc$268) + 2|0);
      $data$33 = $459;$pc$17 = $460;
      label = 149;
      break;
     }
     case 200:  {
      $data$34 = $79;$pc$18 = $77;
      label = 150;
      break;
     }
     case 126:  {
      $465 = $79 | $dp$060;
      $data$35 = $465;$pc$19 = $77;
      label = 153;
      break;
     }
     case 94:  {
      $466 = (__Z8get_le16PKv($77)|0);
      $467 = (($pc$268) + 2|0);
      $data$35 = $466;$pc$19 = $467;
      label = 153;
      break;
     }
     case 173:  {
      $data$36 = $79;$pc$20 = $77;
      label = 154;
      break;
     }
     case 153: case 185:  {
      $472 = (($y$169) + ($dp$060))|0;
      $473 = (($74) + -2)|0;
      $474 = (__ZN8SNES_SPC8cpu_readEii($this,$472,$473)|0);
      $475 = (($x$175) + ($dp$060))|0;
      $addr33$0 = $475;$data$38 = $474;$pc$21 = $pc$268;
      label = 158;
      break;
     }
     case 137: case 169:  {
      $476 = $79 | $dp$060;
      $477 = (($74) + -3)|0;
      $478 = (__ZN8SNES_SPC8cpu_readEii($this,$476,$477)|0);
      $data$37 = $478;
      label = 157;
      break;
     }
     case 152: case 184:  {
      $data$37 = $79;
      label = 157;
      break;
     }
     case 166: case 134:  {
      $485 = (($x$175) + ($dp$060))|0;
      $data$41 = $485;$pc$22 = $pc$268;
      label = 167;
      break;
     }
     case 183: case 151:  {
      $486 = $79 | $dp$060;
      $487 = ((($this) + ($486)|0) + 2412|0);
      $488 = (__Z8get_le16PKv($487)|0);
      $489 = (($488) + ($y$169))|0;
      $data$41 = $489;$pc$22 = $77;
      label = 167;
      break;
     }
     case 167: case 135:  {
      $490 = (($79) + ($x$175))|0;
      $491 = $490 & 255;
      $492 = $491 | $dp$060;
      $493 = ((($this) + ($492)|0) + 2412|0);
      $494 = (__Z8get_le16PKv($493)|0);
      $data$41 = $494;$pc$22 = $77;
      label = 167;
      break;
     }
     case 182: case 150:  {
      $495 = (($79) + ($y$169))|0;
      $data$39 = $495;
      label = 164;
      break;
     }
     case 181: case 149:  {
      $496 = (($79) + ($x$175))|0;
      $data$39 = $496;
      label = 164;
      break;
     }
     case 165: case 133:  {
      $data$39 = $79;
      label = 164;
      break;
     }
     case 180: case 148:  {
      $502 = (($79) + ($x$175))|0;
      $503 = $502 & 255;
      $data$40 = $503;
      label = 166;
      break;
     }
     case 164: case 132:  {
      $data$40 = $79;
      label = 166;
      break;
     }
     case 136: case 168:  {
      $addr33$1 = -1;$data$43 = $79;$nz$2 = $a$188;$pc$24 = $77;
      label = 168;
      break;
     }
     case 188:  {
      $524 = (($a$188) + 1)|0;
      $525 = $524 & 255;
      $a$1$be = $525;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $524;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 61:  {
      $526 = (($x$175) + 1)|0;
      $527 = $526 & 255;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $526;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $527;$y$1$be = $y$169;
      break;
     }
     case 252:  {
      $528 = (($y$169) + 1)|0;
      $529 = $528 & 255;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $528;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $529;
      break;
     }
     case 156:  {
      $530 = (($a$188) + -1)|0;
      $531 = $530 & 255;
      $a$1$be = $531;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $530;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 29:  {
      $532 = (($x$175) + -1)|0;
      $533 = $532 & 255;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $532;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $533;$y$1$be = $y$169;
      break;
     }
     case 220:  {
      $534 = (($y$169) + -1)|0;
      $535 = $534 & 255;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $534;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $535;
      break;
     }
     case 187: case 155:  {
      $536 = (($79) + ($x$175))|0;
      $537 = $536 & 255;
      $data$45 = $537;
      label = 178;
      break;
     }
     case 171: case 139:  {
      $data$45 = $79;
      label = 178;
      break;
     }
     case 172: case 140:  {
      $539 = (__Z8get_le16PKv($77)|0);
      $540 = (($pc$268) + 2|0);
      $data$46 = $539;$pc$25 = $540;
      label = 180;
      break;
     }
     case 92:  {
      $c$2 = 0;
      label = 182;
      break;
     }
     case 124:  {
      $c$2 = $c$163;
      label = 182;
      break;
     }
     case 28:  {
      $c$3 = 0;
      label = 184;
      break;
     }
     case 60:  {
      $c$3 = $c$163;
      label = 184;
      break;
     }
     case 11:  {
      $557 = $79 | $dp$060;
      $c$7 = 0;$data$48 = $557;$pc$26 = $77;
      label = 191;
      break;
     }
     case 27:  {
      $c$4 = 0;
      label = 187;
      break;
     }
     case 59:  {
      $c$4 = $c$163;
      label = 187;
      break;
     }
     case 43:  {
      $c$5 = $c$163;$data$47 = $79;
      label = 188;
      break;
     }
     case 12:  {
      $c$6 = 0;
      label = 190;
      break;
     }
     case 44:  {
      $c$6 = $c$163;
      label = 190;
      break;
     }
     case 75:  {
      $569 = $79 | $dp$060;
      $c$11 = 0;$data$50 = $569;$pc$27 = $77;
      label = 198;
      break;
     }
     case 91:  {
      $c$8 = 0;
      label = 194;
      break;
     }
     case 123:  {
      $c$8 = $c$163;
      label = 194;
      break;
     }
     case 107:  {
      $c$9 = $c$163;$data$49 = $79;
      label = 195;
      break;
     }
     case 76:  {
      $c$10 = 0;
      label = 197;
      break;
     }
     case 108:  {
      $c$10 = $c$163;
      label = 197;
      break;
     }
     case 159:  {
      $582 = $a$188 >> 4;
      $583 = $a$188 << 4;
      $584 = $583 & 240;
      $585 = $584 | $582;
      $a$1$be = $585;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $585;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 186:  {
      $586 = $79 | $dp$060;
      $587 = (($74) + -2)|0;
      $588 = (__ZN8SNES_SPC8cpu_readEii($this,$586,$587)|0);
      $589 = $588 & 127;
      $590 = $588 >> 1;
      $591 = $589 | $590;
      $592 = (($79) + 1)|0;
      $593 = $592 & 255;
      $594 = $593 | $dp$060;
      $595 = (__ZN8SNES_SPC8cpu_readEii($this,$594,$74)|0);
      $596 = $591 | $595;
      $a$0 = $588;$c$0 = $c$163;$nz$0 = $596;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $595;
      label = 6;
      break;
     }
     case 218:  {
      $597 = $79 | $dp$060;
      $598 = (($74) + -1)|0;
      __ZN8SNES_SPC9cpu_writeEiii($this,$a$188,$597,$598);
      $599 = (($y$169) + 8192)|0;
      $600 = (($79) + 1)|0;
      $601 = $600 & 255;
      $602 = $601 | $dp$060;
      __ZN8SNES_SPC9cpu_writeEiii($this,$599,$602,$74);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 26: case 58:  {
      $603 = $79 | $dp$060;
      $604 = (($74) + -3)|0;
      $605 = (__ZN8SNES_SPC8cpu_readEii($this,$603,$604)|0);
      $606 = $75 >>> 4;
      $607 = $606 & 2;
      $608 = (($607) + -1)|0;
      $609 = (($608) + ($605))|0;
      $610 = $609 >>> 1;
      $611 = $610 | $609;
      $612 = $611 & 127;
      $613 = (($74) + -2)|0;
      __ZN8SNES_SPC9cpu_writeEiii($this,$609,$603,$613);
      $614 = (($79) + 1)|0;
      $615 = $614 & 255;
      $616 = $615 | $dp$060;
      $617 = $609 >>> 8;
      $618 = (($74) + -1)|0;
      $619 = (__ZN8SNES_SPC8cpu_readEii($this,$616,$618)|0);
      $620 = (($617) + ($619))|0;
      $621 = $620 & 255;
      $622 = $612 | $621;
      __ZN8SNES_SPC9cpu_writeEiii($this,$621,$616,$74);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $622;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 154: case 122:  {
      $623 = $79 | $dp$060;
      $624 = (($74) + -2)|0;
      $625 = (__ZN8SNES_SPC8cpu_readEii($this,$623,$624)|0);
      $626 = (($79) + 1)|0;
      $627 = $626 & 255;
      $628 = $627 | $dp$060;
      $629 = (__ZN8SNES_SPC8cpu_readEii($this,$628,$74)|0);
      $630 = ($76<<24>>24)==(-102);
      if ($630) {
       $631 = $625 ^ 255;
       $632 = (($631) + 1)|0;
       $633 = $629 ^ 255;
       $hi$0 = $633;$lo$0 = $632;
      } else {
       $hi$0 = $629;$lo$0 = $625;
      }
      $634 = (($lo$0) + ($a$188))|0;
      $635 = (($hi$0) + ($y$169))|0;
      $636 = $634 >> 8;
      $637 = (($635) + ($636))|0;
      $638 = $hi$0 ^ $y$169;
      $639 = $638 ^ $637;
      $640 = $psw$165 & -73;
      $641 = $639 >>> 1;
      $642 = $641 & 8;
      $643 = $642 | $640;
      $644 = (($639) + 128)|0;
      $645 = $644 >>> 2;
      $646 = $645 & 64;
      $647 = $643 | $646;
      $648 = $634 & 255;
      $649 = $637 & 255;
      $650 = $634 >>> 1;
      $651 = $650 | $634;
      $652 = $651 & 127;
      $653 = $652 | $649;
      $a$0 = $648;$c$0 = $637;$nz$0 = $653;$pc$1 = $77;$psw$0 = $647;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $649;
      label = 6;
      break;
     }
     case 90:  {
      $654 = $79 | $dp$060;
      $655 = (($74) + -1)|0;
      $656 = (__ZN8SNES_SPC8cpu_readEii($this,$654,$655)|0);
      $657 = (($a$188) - ($656))|0;
      $658 = $657 >>> 1;
      $659 = $658 | $657;
      $660 = $659 & 127;
      $661 = $657 >> 8;
      $662 = (($79) + 1)|0;
      $663 = $662 & 255;
      $664 = $663 | $dp$060;
      $665 = (__ZN8SNES_SPC8cpu_readEii($this,$664,$74)|0);
      $666 = (($y$169) - ($665))|0;
      $667 = (($666) + ($661))|0;
      $668 = $667 ^ -1;
      $$masked = $667 & 255;
      $669 = $660 | $$masked;
      $a$0 = $a$188;$c$0 = $668;$nz$0 = $669;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 207:  {
      $670 = Math_imul($a$188, $y$169)|0;
      $671 = $670 & 255;
      $672 = $670 >>> 1;
      $673 = $672 | $670;
      $674 = $673 & 127;
      $675 = $670 >>> 8;
      $676 = $674 | $675;
      $a$1$be = $671;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $676;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $675;
      break;
     }
     case 158:  {
      $677 = $y$169 << 8;
      $678 = (($a$188) + ($677))|0;
      $679 = $psw$165 & -73;
      $680 = ($y$169|0)<($x$175|0);
      $681 = $679 | 64;
      $$ = $680 ? $679 : $681;
      $682 = $y$169 & 15;
      $683 = $x$175 & 15;
      $684 = ($682>>>0)<($683>>>0);
      $685 = $$ | 8;
      $psw$3 = $684 ? $$ : $685;
      $686 = $x$175 << 1;
      $687 = ($y$169|0)<($686|0);
      if ($687) {
       $688 = (($678>>>0) / ($x$175>>>0))&-1;
       $689 = Math_imul($688, $x$175)|0;
       $690 = (($678) - ($689))|0;
       $a$2 = $688;$y$2 = $690;
      } else {
       $691 = $x$175 << 9;
       $692 = (($678) - ($691))|0;
       $693 = (256 - ($x$175))|0;
       $694 = (($692>>>0) / ($693>>>0))&-1;
       $695 = (255 - ($694))|0;
       $696 = (($692>>>0) % ($693>>>0))&-1;
       $697 = (($696) + ($x$175))|0;
       $a$2 = $695;$y$2 = $697;
      }
      $698 = $a$2 & 255;
      $a$1$be = $698;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $698;$pc$2$be = $77;$psw$1$be = $psw$3;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$2;
      break;
     }
     case 223:  {
      $699 = ($a$188|0)>(153);
      if ($699) {
       label = 214;
      } else {
       $700 = $c$163 & 256;
       $701 = ($700|0)==(0);
       if ($701) {
        $a$3 = $a$188;$c$12 = $c$163;
       } else {
        label = 214;
       }
      }
      if ((label|0) == 214) {
       label = 0;
       $702 = (($a$188) + 96)|0;
       $a$3 = $702;$c$12 = 256;
      }
      $703 = $a$3 & 14;
      $704 = ($703>>>0)>(9);
      if ($704) {
       label = 217;
      } else {
       $705 = $psw$165 & 8;
       $706 = ($705|0)==(0);
       if ($706) {
        $a$4 = $a$3;
       } else {
        label = 217;
       }
      }
      if ((label|0) == 217) {
       label = 0;
       $707 = (($a$3) + 6)|0;
       $a$4 = $707;
      }
      $708 = $a$4 & 255;
      $a$1$be = $708;$c$1$be = $c$12;$dp$0$be = $dp$060;$nz$1$be = $a$4;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 190:  {
      $709 = ($a$188|0)>(153);
      if ($709) {
       label = 221;
      } else {
       $710 = $c$163 & 256;
       $711 = ($710|0)==(0);
       if ($711) {
        label = 221;
       } else {
        $a$5 = $a$188;$c$13 = $c$163;
       }
      }
      if ((label|0) == 221) {
       label = 0;
       $712 = (($a$188) + -96)|0;
       $a$5 = $712;$c$13 = 0;
      }
      $713 = $a$5 & 14;
      $714 = ($713>>>0)>(9);
      if ($714) {
       label = 224;
      } else {
       $715 = $psw$165 & 8;
       $716 = ($715|0)==(0);
       if ($716) {
        label = 224;
       } else {
        $a$6 = $a$5;
       }
      }
      if ((label|0) == 224) {
       label = 0;
       $717 = (($a$5) + -6)|0;
       $a$6 = $717;
      }
      $718 = $a$6 & 255;
      $a$1$be = $718;$c$1$be = $c$13;$dp$0$be = $dp$060;$nz$1$be = $a$6;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 47:  {
      $719 = $78 << 24 >> 24;
      $$sum15 = (($719) + 1)|0;
      $720 = (($pc$268) + ($$sum15)|0);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $720;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 48:  {
      $721 = $78 << 24 >> 24;
      $$sum13 = (($721) + 2)|0;
      $722 = (($pc$268) + ($$sum13)|0);
      $723 = $nz$161 & 2176;
      $724 = ($723|0)==(0);
      if (!($724)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $722;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $725 = (($pc$268) + 2|0);
      $726 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $725;$psw$1$be = $psw$165;$rel_time$1$be = $726;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 16:  {
      $727 = $78 << 24 >> 24;
      $$sum11 = (($727) + 2)|0;
      $728 = (($pc$268) + ($$sum11)|0);
      $729 = $nz$161 & 2176;
      $730 = ($729|0)==(0);
      if ($730) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $728;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $731 = (($pc$268) + 2|0);
      $732 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $731;$psw$1$be = $psw$165;$rel_time$1$be = $732;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 176:  {
      $733 = $78 << 24 >> 24;
      $$sum9 = (($733) + 2)|0;
      $734 = (($pc$268) + ($$sum9)|0);
      $735 = $c$163 & 256;
      $736 = ($735|0)==(0);
      if (!($736)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $734;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $737 = (($pc$268) + 2|0);
      $738 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $737;$psw$1$be = $psw$165;$rel_time$1$be = $738;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 144:  {
      $739 = $78 << 24 >> 24;
      $$sum7 = (($739) + 2)|0;
      $740 = (($pc$268) + ($$sum7)|0);
      $741 = $c$163 & 256;
      $742 = ($741|0)==(0);
      if ($742) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $740;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $743 = (($pc$268) + 2|0);
      $744 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $743;$psw$1$be = $psw$165;$rel_time$1$be = $744;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 112:  {
      $745 = $78 << 24 >> 24;
      $$sum5 = (($745) + 2)|0;
      $746 = (($pc$268) + ($$sum5)|0);
      $747 = $psw$165 & 64;
      $748 = ($747|0)==(0);
      if (!($748)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $746;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $749 = (($pc$268) + 2|0);
      $750 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $749;$psw$1$be = $psw$165;$rel_time$1$be = $750;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 80:  {
      $751 = $78 << 24 >> 24;
      $$sum3 = (($751) + 2)|0;
      $752 = (($pc$268) + ($$sum3)|0);
      $753 = $psw$165 & 64;
      $754 = ($753|0)==(0);
      if ($754) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $752;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $755 = (($pc$268) + 2|0);
      $756 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $755;$psw$1$be = $psw$165;$rel_time$1$be = $756;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 227: case 195: case 163: case 131: case 99: case 67: case 35: case 3:  {
      $757 = (($pc$268) + 2|0);
      $758 = $79 | $dp$060;
      $759 = (($74) + -4)|0;
      $760 = (__ZN8SNES_SPC8cpu_readEii($this,$758,$759)|0);
      $761 = $75 >>> 5;
      $762 = 1 << $761;
      $763 = $760 & $762;
      $764 = ($763|0)==(0);
      if (!($764)) {
       $pc$0 = $757;
       label = 5;
       break L8;
      }
      $765 = (($74) + -2)|0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $757;$psw$0 = $psw$165;$rel_time$0 = $765;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 243: case 211: case 179: case 147: case 115: case 83: case 51: case 19:  {
      $766 = (($pc$268) + 2|0);
      $767 = $79 | $dp$060;
      $768 = (($74) + -4)|0;
      $769 = (__ZN8SNES_SPC8cpu_readEii($this,$767,$768)|0);
      $770 = $75 >>> 5;
      $771 = 1 << $770;
      $772 = $769 & $771;
      $773 = ($772|0)==(0);
      if ($773) {
       $pc$0 = $766;
       label = 5;
       break L8;
      }
      $774 = (($74) + -2)|0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $766;$psw$0 = $psw$165;$rel_time$0 = $774;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 222:  {
      $775 = (($79) + ($x$175))|0;
      $776 = $775 & 255;
      $data$51 = $776;
      label = 244;
      break;
     }
     case 46:  {
      $data$51 = $79;
      label = 244;
      break;
     }
     case 110:  {
      $797 = $79 | $dp$060;
      $798 = (($74) + -4)|0;
      $799 = (__ZN8SNES_SPC8cpu_readEii($this,$797,$798)|0);
      $800 = (($799) + 8191)|0;
      $801 = (($74) + -3)|0;
      __ZN8SNES_SPC9cpu_writeEiii($this,$800,$797,$801);
      $802 = (($pc$268) + 2|0);
      $803 = ($799|0)==(1);
      if (!($803)) {
       $pc$0 = $802;
       label = 5;
       break L8;
      }
      $804 = (($74) + -2)|0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $802;$psw$0 = $psw$165;$rel_time$0 = $804;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 254:  {
      $805 = (($y$169) + 255)|0;
      $806 = $805 & 255;
      $807 = $78 << 24 >> 24;
      $$sum1 = (($807) + 2)|0;
      $808 = (($pc$268) + ($$sum1)|0);
      $809 = ($806|0)==(0);
      if (!($809)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $808;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $806;
       break L8;
      }
      $810 = (($pc$268) + 2|0);
      $811 = (($74) + -2)|0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $810;$psw$1$be = $psw$165;$rel_time$1$be = $811;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = 0;
      break;
     }
     case 31:  {
      $812 = (__Z8get_le16PKv($77)|0);
      $813 = (($812) + ($x$175))|0;
      $814 = ((($this) + ($813)|0) + 2412|0);
      $pc$28 = $814;
      label = 257;
      break;
     }
     case 95:  {
      $pc$28 = $77;
      label = 257;
      break;
     }
     case 15:  {
      $817 = $77;
      $818 = (($817) - ($50))|0;
      $819 = (__Z8get_le16PKv($51)|0);
      $820 = ((($this) + ($819)|0) + 2412|0);
      $821 = (($sp$067) + -2|0);
      $822 = $821;
      $823 = (($822) - ($50))|0;
      $824 = ($823|0)>(256);
      if ($824) {
       __Z8set_le16Pvj($821,$818);
       $sp$1 = $821;
      } else {
       $825 = $818&255;
       $826 = $823 & 255;
       $827 = $826 | 256;
       $828 = ((($this) + ($827)|0) + 2412|0);
       HEAP8[$828] = $825;
       $829 = $818 >>> 8;
       $830 = $829&255;
       $831 = (($sp$067) + -1|0);
       HEAP8[$831] = $830;
       $832 = (($sp$067) + 254|0);
       $sp$1 = $832;
      }
      $833 = $psw$165 & -164;
      $834 = $c$163 >>> 8;
      $835 = $834 & 1;
      $836 = $dp$060 >>> 3;
      $837 = $nz$161 >>> 4;
      $838 = $837 | $nz$161;
      $839 = $838 & 128;
      $840 = $835 | $836;
      $841 = $840 | $833;
      $842 = $841 | $839;
      $843 = $nz$161&255;
      $844 = ($843<<24>>24)==(0);
      $845 = $842 | 2;
      $$21 = $844 ? $845 : $842;
      $846 = $psw$165 & -21;
      $847 = $846 | 16;
      $848 = $$21&255;
      $849 = (($sp$1) + -1|0);
      HEAP8[$849] = $848;
      $850 = $849;
      $851 = (($850) - ($50))|0;
      $852 = ($851|0)==(256);
      $853 = (($sp$1) + 255|0);
      $$29 = $852 ? $853 : $849;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $820;$psw$1$be = $847;$rel_time$1$be = $74;$sp$0$be = $$29;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 79:  {
      $854 = $77;
      $855 = (($854) - ($52))|0;
      $856 = (($855) + 1)|0;
      $857 = $79 | 65280;
      $858 = ((($this) + ($857)|0) + 2412|0);
      $859 = (($sp$067) + -2|0);
      $860 = $859;
      $861 = (($860) - ($52))|0;
      $862 = ($861|0)>(256);
      if ($862) {
       __Z8set_le16Pvj($859,$856);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $858;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $859;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      } else {
       $863 = $856&255;
       $864 = $861 & 255;
       $865 = $864 | 256;
       $866 = ((($this) + ($865)|0) + 2412|0);
       HEAP8[$866] = $863;
       $867 = $856 >>> 8;
       $868 = $867&255;
       $869 = (($sp$067) + -1|0);
       HEAP8[$869] = $868;
       $870 = (($sp$067) + 254|0);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $858;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $870;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      break;
     }
     case 241: case 225: case 209: case 193: case 177: case 161: case 145: case 129: case 113: case 97: case 81: case 65: case 49: case 33: case 17: case 1:  {
      $871 = $77;
      $872 = (($871) - ($53))|0;
      $873 = $75 >>> 3;
      $874 = (65502 - ($873))|0;
      $875 = ((($this) + ($874)|0) + 2412|0);
      $876 = (__Z8get_le16PKv($875)|0);
      $877 = ((($this) + ($876)|0) + 2412|0);
      $878 = (($sp$067) + -2|0);
      $879 = $878;
      $880 = (($879) - ($53))|0;
      $881 = ($880|0)>(256);
      if ($881) {
       __Z8set_le16Pvj($878,$872);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $877;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $878;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      } else {
       $882 = $872&255;
       $883 = $880 & 255;
       $884 = $883 | 256;
       $885 = ((($this) + ($884)|0) + 2412|0);
       HEAP8[$885] = $882;
       $886 = $872 >>> 8;
       $887 = $886&255;
       $888 = (($sp$067) + -1|0);
       HEAP8[$888] = $887;
       $889 = (($sp$067) + 254|0);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $877;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $889;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      break;
     }
     case 127:  {
      $890 = HEAP8[$sp$067]|0;
      $891 = $890&255;
      $892 = (($sp$067) + 1|0);
      $893 = (__Z8get_le16PKv($892)|0);
      $894 = ((($this) + ($893)|0) + 2412|0);
      $895 = (($sp$067) + 3|0);
      $pc$29 = $894;$sp$2 = $895;$temp53$0 = $891;
      label = 271;
      break;
     }
     case 142:  {
      $896 = (($sp$067) + 1|0);
      $897 = HEAP8[$sp$067]|0;
      $898 = $897&255;
      $899 = $896;
      $900 = (($899) - ($54))|0;
      $901 = ($900|0)==(513);
      if (!($901)) {
       $pc$29 = $77;$sp$2 = $896;$temp53$0 = $898;
       label = 271;
       break L8;
      }
      $902 = (($sp$067) + -256|0);
      $903 = HEAP8[$902]|0;
      $904 = $903&255;
      $905 = (($sp$067) + -255|0);
      $pc$29 = $77;$sp$2 = $905;$temp53$0 = $904;
      label = 271;
      break;
     }
     case 13:  {
      $914 = $psw$165 & -164;
      $915 = $c$163 >>> 8;
      $916 = $915 & 1;
      $917 = $dp$060 >>> 3;
      $918 = $nz$161 >>> 4;
      $919 = $918 | $nz$161;
      $920 = $919 & 128;
      $921 = $916 | $917;
      $922 = $921 | $914;
      $923 = $922 | $920;
      $924 = $nz$161&255;
      $925 = ($924<<24>>24)==(0);
      $926 = $923 | 2;
      $$22 = $925 ? $926 : $923;
      $927 = $$22&255;
      $928 = (($sp$067) + -1|0);
      HEAP8[$928] = $927;
      $929 = $928;
      $930 = (($929) - ($55))|0;
      $931 = ($930|0)==(256);
      $932 = (($sp$067) + 255|0);
      $$30 = $931 ? $932 : $928;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $$30;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 45:  {
      $933 = $a$188&255;
      $934 = (($sp$067) + -1|0);
      HEAP8[$934] = $933;
      $935 = $934;
      $936 = (($935) - ($56))|0;
      $937 = ($936|0)==(256);
      $938 = (($sp$067) + 255|0);
      $$23 = $937 ? $938 : $934;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $$23;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 77:  {
      $939 = $x$175&255;
      $940 = (($sp$067) + -1|0);
      HEAP8[$940] = $939;
      $941 = $940;
      $942 = (($941) - ($57))|0;
      $943 = ($942|0)==(256);
      $944 = (($sp$067) + 255|0);
      $$24 = $943 ? $944 : $940;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $$24;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 109:  {
      $945 = $y$169&255;
      $946 = (($sp$067) + -1|0);
      HEAP8[$946] = $945;
      $947 = $946;
      $948 = (($947) - ($58))|0;
      $949 = ($948|0)==(256);
      $950 = (($sp$067) + 255|0);
      $$25 = $949 ? $950 : $946;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $$25;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 174:  {
      $951 = (($sp$067) + 1|0);
      $952 = HEAP8[$sp$067]|0;
      $953 = $952&255;
      $954 = $951;
      $955 = (($954) - ($59))|0;
      $956 = ($955|0)==(513);
      if (!($956)) {
       $a$1$be = $953;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $951;$x$1$be = $x$175;$y$1$be = $y$169;
       break L8;
      }
      $957 = (($sp$067) + -256|0);
      $958 = HEAP8[$957]|0;
      $959 = $958&255;
      $960 = (($sp$067) + -255|0);
      $a$1$be = $959;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $960;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 206:  {
      $961 = (($sp$067) + 1|0);
      $962 = HEAP8[$sp$067]|0;
      $963 = $962&255;
      $964 = $961;
      $965 = (($964) - ($60))|0;
      $966 = ($965|0)==(513);
      if (!($966)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $961;$x$1$be = $963;$y$1$be = $y$169;
       break L8;
      }
      $967 = (($sp$067) + -256|0);
      $968 = HEAP8[$967]|0;
      $969 = $968&255;
      $970 = (($sp$067) + -255|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $970;$x$1$be = $969;$y$1$be = $y$169;
      break;
     }
     case 238:  {
      $971 = (($sp$067) + 1|0);
      $972 = HEAP8[$sp$067]|0;
      $973 = $972&255;
      $974 = $971;
      $975 = (($974) - ($61))|0;
      $976 = ($975|0)==(513);
      if (!($976)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $971;$x$1$be = $x$175;$y$1$be = $973;
       break L8;
      }
      $977 = (($sp$067) + -256|0);
      $978 = HEAP8[$977]|0;
      $979 = $978&255;
      $980 = (($sp$067) + -255|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $980;$x$1$be = $x$175;$y$1$be = $979;
      break;
     }
     case 242: case 210: case 178: case 146: case 114: case 82: case 50: case 18: case 226: case 194: case 162: case 130: case 98: case 66: case 34: case 2:  {
      $981 = $75 >>> 5;
      $982 = 1 << $981;
      $983 = $982 ^ -1;
      $984 = $75 & 16;
      $985 = ($984|0)==(0);
      $$26 = $985 ? $982 : 0;
      $986 = $79 | $dp$060;
      $987 = (($74) + -1)|0;
      $988 = (__ZN8SNES_SPC8cpu_readEii($this,$986,$987)|0);
      $989 = $988 & $983;
      $990 = $989 | $$26;
      __ZN8SNES_SPC9cpu_writeEiii($this,$990,$986,$74);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
      break;
     }
     case 78: case 14:  {
      $991 = (__Z8get_le16PKv($77)|0);
      $992 = (($pc$268) + 3|0);
      $993 = (($74) + -2)|0;
      $994 = (__ZN8SNES_SPC8cpu_readEii($this,$991,$993)|0);
      $995 = (($a$188) - ($994))|0;
      $996 = $995 & 255;
      $997 = $a$188 ^ -1;
      $998 = $994 & $997;
      $999 = ($76<<24>>24)==(14);
      $1000 = $999 ? $a$188 : 0;
      $$27 = $998 | $1000;
      __ZN8SNES_SPC9cpu_writeEiii($this,$$27,$991,$74);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $996;$pc$2$be = $992;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 74:  {
      $1001 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$74)|0);
      $1002 = $1001 & $c$163;
      $1003 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1002;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1003;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 106:  {
      $1004 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$74)|0);
      $1005 = $1004 ^ -1;
      $1006 = $c$163 & $1005;
      $1007 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1006;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1007;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 10:  {
      $1008 = (($74) + -1)|0;
      $1009 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$1008)|0);
      $1010 = $1009 | $c$163;
      $1011 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1010;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1011;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 42:  {
      $1012 = (($74) + -1)|0;
      $1013 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$1012)|0);
      $1014 = $1013 ^ -1;
      $1015 = $c$163 | $1014;
      $1016 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1015;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1016;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 138:  {
      $1017 = (($74) + -1)|0;
      $1018 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$1017)|0);
      $1019 = $1018 ^ $c$163;
      $1020 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1019;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1020;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 234:  {
      $1021 = (__Z8get_le16PKv($77)|0);
      $1022 = (($pc$268) + 3|0);
      $1023 = $1021 & 8191;
      $1024 = (($74) + -1)|0;
      $1025 = (__ZN8SNES_SPC8cpu_readEii($this,$1023,$1024)|0);
      $1026 = $1021 >>> 13;
      $1027 = 1 << $1026;
      $1028 = $1027 ^ $1025;
      __ZN8SNES_SPC9cpu_writeEiii($this,$1028,$1023,$74);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1022;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 202:  {
      $1029 = (__Z8get_le16PKv($77)|0);
      $1030 = (($pc$268) + 3|0);
      $1031 = $1029 & 8191;
      $1032 = (($74) + -2)|0;
      $1033 = (__ZN8SNES_SPC8cpu_readEii($this,$1031,$1032)|0);
      $1034 = $1029 >>> 13;
      $1035 = 1 << $1034;
      $1036 = $1035 ^ -1;
      $1037 = $1033 & $1036;
      $1038 = $c$163 >>> 8;
      $1039 = $1038 & 1;
      $1040 = $1039 << $1034;
      $1041 = $1037 | $1040;
      $1042 = (($1041) + 8192)|0;
      __ZN8SNES_SPC9cpu_writeEiii($this,$1042,$1031,$74);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1030;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 170:  {
      $1043 = (__ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$77,$74)|0);
      $1044 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $1043;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1044;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 96:  {
      $a$1$be = $a$188;$c$1$be = 0;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 128:  {
      $a$1$be = $a$188;$c$1$be = -1;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 237:  {
      $1045 = $c$163 ^ 256;
      $a$1$be = $a$188;$c$1$be = $1045;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 224:  {
      $1046 = $psw$165 & -73;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $1046;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 32:  {
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = 0;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 64:  {
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = 256;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 160:  {
      $1047 = $psw$165 | 4;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $1047;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 192:  {
      $1048 = $psw$165 & -5;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $77;$psw$1$be = $1048;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 255:  {
      $1049 = $77;
      $1050 = (($1049) - ($62))|0;
      $1051 = (($1050) + -1)|0;
      $1052 = ($1051>>>0)>(65535);
      if (!($1052)) {
       label = 302;
       break L6;
      }
      $1053 = $1051 & 65535;
      $1054 = ((($this) + ($1053)|0) + 2412|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $1054;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
      break;
     }
     case 239:  {
      label = 302;
      break L6;
      break;
     }
     default: {
      label = 303;
      break L6;
     }
     }
    } while(0);
    do {
     if ((label|0) == 31) {
      label = 0;
      $162 = (($pc$268) + 2|0);
      $163 = HEAP8[$162]|0;
      $164 = $163&255;
      $165 = (($pc$268) + 3|0);
      $166 = $164 | $dp$060;
      $167 = $data$0&255;
      $168 = ((($this) + ($166)|0) + 2412|0);
      HEAP8[$168] = $167;
      $169 = (($166) + -240)|0;
      $170 = ($169>>>0)<(16);
      if (!($170)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $165;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break;
      }
      $171 = ((($this) + ($169)|0) + 1636|0);
      HEAP8[$171] = $167;
      $172 = -788594688 << $169;
      $173 = ($172|0)<(0);
      if (!($173)) {
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $165;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
       break;
      }
      __ZN8SNES_SPC17cpu_write_smp_regEiii($this,$data$0,$74,$169);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $165;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
     }
     else if ((label|0) == 44) {
      label = 0;
      $196 = (($pc$268) + 2|0);
      $197 = HEAP8[$196]|0;
      $198 = $197&255;
      $199 = $198 << 8;
      $200 = (($199) + ($data$1))|0;
      $data$2 = $200;$pc$3 = $196;
      label = 46;
     }
     else if ((label|0) == 49) {
      label = 0;
      $212 = $data$3 | $dp$060;
      $213 = (($212) + -253)|0;
      $214 = ($213>>>0)<(3);
      if (!($214)) {
       $222 = ((($this) + ($212)|0) + 2412|0);
       $223 = HEAP8[$222]|0;
       $224 = $223&255;
       $225 = (($212) + -240)|0;
       $226 = ($225>>>0)<(16);
       if (!($226)) {
        $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $224;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $224;$y$0 = $y$169;
        label = 6;
        break;
       }
       $227 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$225,$74)|0);
       $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $227;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $227;$y$0 = $y$169;
       label = 6;
       break;
      }
      $215 = ((($this) + (($213*24)|0)|0) + 1564|0);
      $216 = ($215);
      $217 = HEAP32[$216>>2]|0;
      $218 = ($74|0)<($217|0);
      if ($218) {
       $t14$0 = $215;
      } else {
       $219 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$215,$74)|0);
       $t14$0 = $219;
      }
      $220 = (($t14$0) + 20|0);
      $221 = HEAP32[$220>>2]|0;
      HEAP32[$220>>2] = 0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $221;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $221;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 56) {
      label = 0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $data$4;$pc$1 = $pc$4;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $data$4;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 58) {
      label = 0;
      $233 = (($pc$268) + 2|0);
      $234 = $data$5 | $dp$060;
      $235 = (($234) + -253)|0;
      $236 = ($235>>>0)<(3);
      if (!($236)) {
       $244 = ((($this) + ($234)|0) + 2412|0);
       $245 = HEAP8[$244]|0;
       $246 = $245&255;
       $247 = (($234) + -240)|0;
       $248 = ($247>>>0)<(16);
       if (!($248)) {
        $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $246;$pc$2$be = $233;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $246;
        break;
       }
       $249 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$247,$74)|0);
       $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $249;$pc$2$be = $233;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $249;
       break;
      }
      $237 = ((($this) + (($235*24)|0)|0) + 1564|0);
      $238 = ($237);
      $239 = HEAP32[$238>>2]|0;
      $240 = ($74|0)<($239|0);
      if ($240) {
       $t19$0 = $237;
      } else {
       $241 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$237,$74)|0);
       $t19$0 = $241;
      }
      $242 = (($t19$0) + 20|0);
      $243 = HEAP32[$242>>2]|0;
      HEAP32[$242>>2] = 0;
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $243;$pc$2$be = $233;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $243;
     }
     else if ((label|0) == 76) {
      label = 0;
      $279 = (($pc$268) + 2|0);
      $280 = HEAP8[$279]|0;
      $281 = $280&255;
      $282 = $281 << 8;
      $283 = (($282) + ($data$6))|0;
      $data$7 = $283;$pc$5 = $279;
      label = 78;
     }
     else if ((label|0) == 80) {
      label = 0;
      $287 = (__Z8get_le16PKv($77)|0);
      __ZN8SNES_SPC9cpu_writeEiii($this,$temp27$0,$287,$74);
      $288 = (($pc$268) + 3|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $288;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
     }
     else if ((label|0) == 82) {
      label = 0;
      $291 = $data$8 | $dp$060;
      __ZN8SNES_SPC9cpu_writeEiii($this,$x$175,$291,$74);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 84) {
      label = 0;
      $294 = $data$9 | $dp$060;
      __ZN8SNES_SPC9cpu_writeEiii($this,$y$169,$294,$74);
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $77;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 97) {
      label = 0;
      $314 = (($pc$268) + 2|0);
      $315 = HEAP8[$314]|0;
      $316 = $315&255;
      $317 = $316 << 8;
      $318 = (($317) + ($data$10))|0;
      $data$12 = $318;$pc$6 = $314;
      label = 100;
     }
     else if ((label|0) == 99) {
      label = 0;
      $321 = $data$11 | $dp$060;
      $data$12 = $321;$pc$6 = $77;
      label = 100;
     }
     else if ((label|0) == 104) {
      label = 0;
      $331 = (($pc$268) + 2|0);
      $332 = (($pc$268) + 3|0);
      $333 = HEAP8[$331]|0;
      $334 = $333&255;
      $335 = $334 | $dp$060;
      $addr28$0 = $335;$data$15 = $data$14;$pc$8 = $332;
      label = 105;
     }
     else if ((label|0) == 111) {
      label = 0;
      $351 = (($pc$268) + 2|0);
      $352 = HEAP8[$351]|0;
      $353 = $352&255;
      $354 = $353 << 8;
      $355 = (($354) + ($data$16))|0;
      $data$18 = $355;$pc$9 = $351;
      label = 114;
     }
     else if ((label|0) == 113) {
      label = 0;
      $358 = $data$17 | $dp$060;
      $data$18 = $358;$pc$9 = $77;
      label = 114;
     }
     else if ((label|0) == 118) {
      label = 0;
      $368 = (($pc$268) + 2|0);
      $369 = (($pc$268) + 3|0);
      $370 = HEAP8[$368]|0;
      $371 = $370&255;
      $372 = $371 | $dp$060;
      $addr29$0 = $372;$data$21 = $data$20;$pc$11 = $369;
      label = 119;
     }
     else if ((label|0) == 125) {
      label = 0;
      $388 = (($pc$268) + 2|0);
      $389 = HEAP8[$388]|0;
      $390 = $389&255;
      $391 = $390 << 8;
      $392 = (($391) + ($data$22))|0;
      $data$24 = $392;$pc$12 = $388;
      label = 128;
     }
     else if ((label|0) == 127) {
      label = 0;
      $395 = $data$23 | $dp$060;
      $data$24 = $395;$pc$12 = $77;
      label = 128;
     }
     else if ((label|0) == 132) {
      label = 0;
      $405 = (($pc$268) + 2|0);
      $406 = (($pc$268) + 3|0);
      $407 = HEAP8[$405]|0;
      $408 = $407&255;
      $409 = $408 | $dp$060;
      $addr31$0 = $409;$data$27 = $data$26;$pc$14 = $406;
      label = 133;
     }
     else if ((label|0) == 139) {
      label = 0;
      $425 = (($pc$268) + 2|0);
      $426 = HEAP8[$425]|0;
      $427 = $426&255;
      $428 = $427 << 8;
      $429 = (($428) + ($data$28))|0;
      $data$30 = $429;$pc$15 = $425;
      label = 142;
     }
     else if ((label|0) == 141) {
      label = 0;
      $432 = $data$29 | $dp$060;
      $data$30 = $432;$pc$15 = $77;
      label = 142;
     }
     else if ((label|0) == 146) {
      label = 0;
      $449 = (($pc$268) + 2|0);
      $450 = HEAP8[$449]|0;
      $451 = $450&255;
      $452 = $451 | $dp$060;
      $453 = (($74) + -1)|0;
      $454 = (__ZN8SNES_SPC8cpu_readEii($this,$452,$453)|0);
      $455 = (($454) - ($data$32))|0;
      $456 = $455 ^ -1;
      $457 = $455 & 255;
      $a$0 = $a$188;$c$0 = $456;$nz$0 = $457;$pc$1 = $449;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 149) {
      label = 0;
      $461 = (__ZN8SNES_SPC8cpu_readEii($this,$data$33,$74)|0);
      $data$34 = $461;$pc$18 = $pc$17;
      label = 150;
     }
     else if ((label|0) == 153) {
      label = 0;
      $468 = (__ZN8SNES_SPC8cpu_readEii($this,$data$35,$74)|0);
      $data$36 = $468;$pc$20 = $pc$19;
      label = 154;
     }
     else if ((label|0) == 157) {
      label = 0;
      $479 = (($pc$268) + 2|0);
      $480 = HEAP8[$479]|0;
      $481 = $480&255;
      $482 = $481 | $dp$060;
      $addr33$0 = $482;$data$38 = $data$37;$pc$21 = $479;
      label = 158;
     }
     else if ((label|0) == 164) {
      label = 0;
      $497 = (($pc$268) + 2|0);
      $498 = HEAP8[$497]|0;
      $499 = $498&255;
      $500 = $499 << 8;
      $501 = (($500) + ($data$39))|0;
      $data$41 = $501;$pc$22 = $497;
      label = 167;
     }
     else if ((label|0) == 166) {
      label = 0;
      $504 = $data$40 | $dp$060;
      $data$41 = $504;$pc$22 = $77;
      label = 167;
     }
     else if ((label|0) == 178) {
      label = 0;
      $538 = $data$45 | $dp$060;
      $data$46 = $538;$pc$25 = $77;
      label = 180;
     }
     else if ((label|0) == 182) {
      label = 0;
      $547 = $c$2 >>> 1;
      $548 = $547 & 128;
      $549 = $a$188 >> 1;
      $550 = $548 | $549;
      $551 = $a$188 << 8;
      $a$1$be = $550;$c$1$be = $551;$dp$0$be = $dp$060;$nz$1$be = $550;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
     }
     else if ((label|0) == 184) {
      label = 0;
      $552 = $c$3 >>> 8;
      $553 = $552 & 1;
      $554 = $a$188 << 1;
      $555 = $553 | $554;
      $556 = $555 & 255;
      $a$1$be = $556;$c$1$be = $554;$dp$0$be = $dp$060;$nz$1$be = $555;$pc$2$be = $77;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
     }
     else if ((label|0) == 187) {
      label = 0;
      $558 = (($79) + ($x$175))|0;
      $559 = $558 & 255;
      $c$5 = $c$4;$data$47 = $559;
      label = 188;
     }
     else if ((label|0) == 190) {
      label = 0;
      $561 = (__Z8get_le16PKv($77)|0);
      $562 = (($pc$268) + 2|0);
      $c$7 = $c$6;$data$48 = $561;$pc$26 = $562;
      label = 191;
     }
     else if ((label|0) == 194) {
      label = 0;
      $570 = (($79) + ($x$175))|0;
      $571 = $570 & 255;
      $c$9 = $c$8;$data$49 = $571;
      label = 195;
     }
     else if ((label|0) == 197) {
      label = 0;
      $573 = (__Z8get_le16PKv($77)|0);
      $574 = (($pc$268) + 2|0);
      $c$11 = $c$10;$data$50 = $573;$pc$27 = $574;
      label = 198;
     }
     else if ((label|0) == 244) {
      label = 0;
      $777 = (($74) + -4)|0;
      $778 = $data$51 | $dp$060;
      $779 = (($778) + -253)|0;
      $780 = ($779>>>0)<(3);
      do {
       if ($780) {
        $781 = ((($this) + (($779*24)|0)|0) + 1564|0);
        $782 = ($781);
        $783 = HEAP32[$782>>2]|0;
        $784 = ($777|0)<($783|0);
        if ($784) {
         $t44$0 = $781;
        } else {
         $785 = (__ZN8SNES_SPC10run_timer_EPNS_5TimerEi(0,$781,$777)|0);
         $t44$0 = $785;
        }
        $786 = (($t44$0) + 20|0);
        $787 = HEAP32[$786>>2]|0;
        HEAP32[$786>>2] = 0;
        $temp40$0 = $787;
       } else {
        $788 = ((($this) + ($778)|0) + 2412|0);
        $789 = HEAP8[$788]|0;
        $790 = $789&255;
        $791 = (($778) + -240)|0;
        $792 = ($791>>>0)<(16);
        if (!($792)) {
         $temp40$0 = $790;
         break;
        }
        $793 = (__ZN8SNES_SPC16cpu_read_smp_regEii($this,$791,$777)|0);
        $temp40$0 = $793;
       }
      } while(0);
      $794 = (($pc$268) + 2|0);
      $795 = ($temp40$0|0)==($a$188|0);
      if (!($795)) {
       $pc$0 = $794;
       label = 5;
       break;
      }
      $796 = (($74) + -2)|0;
      $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $794;$psw$0 = $psw$165;$rel_time$0 = $796;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 257) {
      label = 0;
      $815 = (__Z8get_le16PKv($pc$28)|0);
      $816 = ((($this) + ($815)|0) + 2412|0);
      $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $nz$161;$pc$2$be = $816;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
     }
     else if ((label|0) == 271) {
      label = 0;
      $906 = $temp53$0 << 8;
      $907 = $temp53$0 << 3;
      $908 = $907 & 256;
      $909 = $temp53$0 << 4;
      $910 = $909 & 2048;
      $911 = $temp53$0 & 2;
      $912 = $910 | $911;
      $913 = $912 ^ 2;
      $a$1$be = $a$188;$c$1$be = $906;$dp$0$be = $908;$nz$1$be = $913;$pc$2$be = $pc$29;$psw$1$be = $temp53$0;$rel_time$1$be = $74;$sp$0$be = $sp$2;$x$1$be = $x$175;$y$1$be = $y$169;
     }
    } while(0);
    if ((label|0) == 5) {
     label = 0;
     $63 = HEAP8[$pc$0]|0;
     $64 = $63 << 24 >> 24;
     $65 = (($pc$0) + ($64)|0);
     $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $65;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 46) {
     label = 0;
     $204 = (__ZN8SNES_SPC8cpu_readEii($this,$data$2,$74)|0);
     $a$0 = $204;$c$0 = $c$163;$nz$0 = $204;$pc$1 = $pc$3;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 78) {
     label = 0;
     __ZN8SNES_SPC9cpu_writeEiii($this,$a$188,$data$7,$74);
     $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $nz$161;$pc$1 = $pc$5;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 100) {
     label = 0;
     $322 = (__ZN8SNES_SPC8cpu_readEii($this,$data$12,$74)|0);
     $data$13 = $322;$pc$7 = $pc$6;
     label = 101;
    }
    else if ((label|0) == 105) {
     label = 0;
     $336 = (($74) + -1)|0;
     $337 = (__ZN8SNES_SPC8cpu_readEii($this,$addr28$0,$336)|0);
     $338 = $337 & $data$15;
     __ZN8SNES_SPC9cpu_writeEiii($this,$338,$addr28$0,$74);
     $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $338;$pc$2$be = $pc$8;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
    }
    else if ((label|0) == 114) {
     label = 0;
     $359 = (__ZN8SNES_SPC8cpu_readEii($this,$data$18,$74)|0);
     $data$19 = $359;$pc$10 = $pc$9;
     label = 115;
    }
    else if ((label|0) == 119) {
     label = 0;
     $373 = (($74) + -1)|0;
     $374 = (__ZN8SNES_SPC8cpu_readEii($this,$addr29$0,$373)|0);
     $375 = $374 | $data$21;
     __ZN8SNES_SPC9cpu_writeEiii($this,$375,$addr29$0,$74);
     $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $375;$pc$2$be = $pc$11;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
    }
    else if ((label|0) == 128) {
     label = 0;
     $396 = (__ZN8SNES_SPC8cpu_readEii($this,$data$24,$74)|0);
     $data$25 = $396;$pc$13 = $pc$12;
     label = 129;
    }
    else if ((label|0) == 133) {
     label = 0;
     $410 = (($74) + -1)|0;
     $411 = (__ZN8SNES_SPC8cpu_readEii($this,$addr31$0,$410)|0);
     $412 = $411 ^ $data$27;
     __ZN8SNES_SPC9cpu_writeEiii($this,$412,$addr31$0,$74);
     $a$1$be = $a$188;$c$1$be = $c$163;$dp$0$be = $dp$060;$nz$1$be = $412;$pc$2$be = $pc$14;$psw$1$be = $psw$165;$rel_time$1$be = $74;$sp$0$be = $sp$067;$x$1$be = $x$175;$y$1$be = $y$169;
    }
    else if ((label|0) == 142) {
     label = 0;
     $433 = (__ZN8SNES_SPC8cpu_readEii($this,$data$30,$74)|0);
     $data$31 = $433;$pc$16 = $pc$15;
     label = 143;
    }
    else if ((label|0) == 150) {
     label = 0;
     $462 = (($x$175) - ($data$34))|0;
     $463 = $462 ^ -1;
     $464 = $462 & 255;
     $a$0 = $a$188;$c$0 = $463;$nz$0 = $464;$pc$1 = $pc$18;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 154) {
     label = 0;
     $469 = (($y$169) - ($data$36))|0;
     $470 = $469 ^ -1;
     $471 = $469 & 255;
     $a$0 = $a$188;$c$0 = $470;$nz$0 = $471;$pc$1 = $pc$20;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 158) {
     label = 0;
     $483 = (($74) + -1)|0;
     $484 = (__ZN8SNES_SPC8cpu_readEii($this,$addr33$0,$483)|0);
     $addr33$1 = $addr33$0;$data$43 = $data$38;$nz$2 = $484;$pc$24 = $pc$21;
     label = 168;
    }
    else if ((label|0) == 167) {
     label = 0;
     $505 = (__ZN8SNES_SPC8cpu_readEii($this,$data$41,$74)|0);
     $addr33$1 = -1;$data$43 = $505;$nz$2 = $a$188;$pc$24 = $pc$22;
     label = 168;
    }
    else if ((label|0) == 180) {
     label = 0;
     $541 = $75 >>> 4;
     $542 = $541 & 2;
     $543 = (($542) + -1)|0;
     $544 = (($74) + -1)|0;
     $545 = (__ZN8SNES_SPC8cpu_readEii($this,$data$46,$544)|0);
     $546 = (($543) + ($545))|0;
     __ZN8SNES_SPC9cpu_writeEiii($this,$546,$data$46,$74);
     $a$0 = $a$188;$c$0 = $c$163;$nz$0 = $546;$pc$1 = $pc$25;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
     label = 6;
    }
    else if ((label|0) == 188) {
     label = 0;
     $560 = $data$47 | $dp$060;
     $c$7 = $c$5;$data$48 = $560;$pc$26 = $77;
     label = 191;
    }
    else if ((label|0) == 195) {
     label = 0;
     $572 = $data$49 | $dp$060;
     $c$11 = $c$9;$data$50 = $572;$pc$27 = $77;
     label = 198;
    }
    do {
     if ((label|0) == 101) {
      label = 0;
      $323 = $data$13 & $a$188;
      $a$0 = $323;$c$0 = $c$163;$nz$0 = $323;$pc$1 = $pc$7;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 115) {
      label = 0;
      $360 = $data$19 | $a$188;
      $a$0 = $360;$c$0 = $c$163;$nz$0 = $360;$pc$1 = $pc$10;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 129) {
      label = 0;
      $397 = $data$25 ^ $a$188;
      $a$0 = $397;$c$0 = $c$163;$nz$0 = $397;$pc$1 = $pc$13;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 143) {
      label = 0;
      $434 = (($a$188) - ($data$31))|0;
      $435 = $434 ^ -1;
      $436 = $434 & 255;
      $a$0 = $a$188;$c$0 = $435;$nz$0 = $436;$pc$1 = $pc$16;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 168) {
      label = 0;
      $506 = ($76&255)>(159);
      $507 = $data$43 ^ 255;
      $$data$43 = $506 ? $507 : $data$43;
      $508 = $$data$43 ^ $nz$2;
      $509 = $c$163 >>> 8;
      $510 = $509 & 1;
      $511 = (($nz$2) + ($510))|0;
      $512 = (($511) + ($$data$43))|0;
      $513 = $508 ^ $512;
      $514 = $psw$165 & -73;
      $515 = $513 >>> 1;
      $516 = $515 & 8;
      $517 = $516 | $514;
      $518 = (($513) + 128)|0;
      $519 = $518 >>> 2;
      $520 = $519 & 64;
      $521 = $517 | $520;
      $522 = ($addr33$1|0)<(0);
      if ($522) {
       $523 = $512 & 255;
       $a$0 = $523;$c$0 = $512;$nz$0 = $512;$pc$1 = $pc$24;$psw$0 = $521;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
       label = 6;
       break;
      } else {
       __ZN8SNES_SPC9cpu_writeEiii($this,$512,$addr33$1,$74);
       $a$0 = $a$188;$c$0 = $512;$nz$0 = $512;$pc$1 = $pc$24;$psw$0 = $521;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
       label = 6;
       break;
      }
     }
     else if ((label|0) == 191) {
      label = 0;
      $563 = $c$7 >>> 8;
      $564 = $563 & 1;
      $565 = (($74) + -1)|0;
      $566 = (__ZN8SNES_SPC8cpu_readEii($this,$data$48,$565)|0);
      $567 = $566 << 1;
      $568 = $567 | $564;
      __ZN8SNES_SPC9cpu_writeEiii($this,$568,$data$48,$74);
      $a$0 = $a$188;$c$0 = $567;$nz$0 = $568;$pc$1 = $pc$26;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
     else if ((label|0) == 198) {
      label = 0;
      $575 = (($74) + -1)|0;
      $576 = (__ZN8SNES_SPC8cpu_readEii($this,$data$50,$575)|0);
      $577 = $c$11 >>> 1;
      $578 = $577 & 128;
      $579 = $576 >> 1;
      $580 = $579 | $578;
      $581 = $576 << 8;
      __ZN8SNES_SPC9cpu_writeEiii($this,$580,$data$50,$74);
      $a$0 = $a$188;$c$0 = $581;$nz$0 = $580;$pc$1 = $pc$27;$psw$0 = $psw$165;$rel_time$0 = $74;$x$0 = $x$175;$y$0 = $y$169;
      label = 6;
     }
    } while(0);
    if ((label|0) == 6) {
     label = 0;
     $66 = (($pc$1) + 1|0);
     $a$1$be = $a$0;$c$1$be = $c$0;$dp$0$be = $dp$060;$nz$1$be = $nz$0;$pc$2$be = $66;$psw$1$be = $psw$0;$rel_time$1$be = $rel_time$0;$sp$0$be = $sp$067;$x$1$be = $x$0;$y$1$be = $y$0;
    }
    $67 = HEAP8[$pc$2$be]|0;
    $68 = $67&255;
    $69 = ((($this) + ($68)|0) + 1900|0);
    $70 = HEAP8[$69]|0;
    $71 = $70&255;
    $72 = (($71) + ($rel_time$1$be))|0;
    $73 = ($72|0)>(0);
    if ($73) {
     $a$157 = $a$1$be;$c$139 = $c$1$be;$dp$033 = $dp$0$be;$nz$136 = $nz$1$be;$pc$248 = $pc$2$be;$psw$142 = $psw$1$be;$rel_time$2 = $rel_time$1$be;$sp$045 = $sp$0$be;$x$154 = $x$1$be;$y$151 = $y$1$be;
     break L4;
    } else {
     $74 = $72;$75 = $68;$76 = $67;$a$188 = $a$1$be;$c$163 = $c$1$be;$dp$060 = $dp$0$be;$nz$161 = $nz$1$be;$pc$268 = $pc$2$be;$psw$165 = $psw$1$be;$sp$067 = $sp$0$be;$x$175 = $x$1$be;$y$169 = $y$1$be;
    }
   }
   if ((label|0) == 302) {
    $1055 = (($this) + 1716|0);
    HEAP32[$1055>>2] = (320);
    $a$157 = $a$188;$c$139 = $c$163;$dp$033 = $dp$060;$nz$136 = $nz$161;$pc$248 = $pc$268;$psw$142 = $psw$165;$rel_time$2 = 0;$sp$045 = $sp$067;$x$154 = $x$175;$y$151 = $y$169;
    break;
   }
   else if ((label|0) == 303) {
    ___assert_fail(((344)|0),((272)|0),1200,((304)|0));
    // unreachable;
   }
  }
 } while(0);
 $1056 = $pc$248;
 $1057 = $17;
 $1058 = (($1056) - ($1057))|0;
 $1059 = $1058 & 65535;
 HEAP32[$24>>2] = $1059;
 $1060 = (($sp$045) + -257|0);
 $1061 = $1060;
 $1062 = (($1061) - ($1057))|0;
 $1063 = $1062 & 255;
 HEAP32[$27>>2] = $1063;
 $1064 = $a$157 & 255;
 HEAP32[$18>>2] = $1064;
 $1065 = $x$154 & 255;
 HEAP32[$20>>2] = $1065;
 $1066 = $y$151 & 255;
 HEAP32[$22>>2] = $1066;
 $1067 = $psw$142 & -164;
 $1068 = $c$139 >>> 8;
 $1069 = $1068 & 1;
 $1070 = $dp$033 >>> 3;
 $1071 = $nz$136 >>> 4;
 $1072 = $1071 | $nz$136;
 $1073 = $1072 & 128;
 $1074 = $1069 | $1070;
 $1075 = $1074 | $1067;
 $1076 = $1075 | $1073;
 $1077 = $nz$136&255;
 $1078 = ($1077<<24>>24)==(0);
 $1079 = $1076 | 2;
 $$28 = $1078 ? $1079 : $1076;
 $1080 = $$28 & 255;
 HEAP32[$30>>2] = $1080;
 $1081 = HEAP32[$1>>2]|0;
 $1082 = (($1081) + ($rel_time$2))|0;
 HEAP32[$1>>2] = $1082;
 $1083 = HEAP32[$5>>2]|0;
 $1084 = (($1083) - ($rel_time$2))|0;
 HEAP32[$5>>2] = $1084;
 $1085 = HEAP32[$8>>2]|0;
 $1086 = (($1085) - ($rel_time$2))|0;
 HEAP32[$8>>2] = $1086;
 $1087 = HEAP32[$11>>2]|0;
 $1088 = (($1087) - ($rel_time$2))|0;
 HEAP32[$11>>2] = $1088;
 $1089 = HEAP32[$14>>2]|0;
 $1090 = (($1089) - ($rel_time$2))|0;
 HEAP32[$14>>2] = $1090;
 $1091 = HEAP32[$1>>2]|0;
 $1092 = ($1091|0)>($end_time|0);
 if ($1092) {
  ___assert_fail(((352)|0),((272)|0),1220,((304)|0));
  // unreachable;
 } else {
  $1093 = (($this) + 1640|0);
  STACKTOP = sp;return ($1093|0);
 }
 return 0|0;
}
function __ZN8SNES_SPC11CPU_mem_bitEPKhi($this,$pc,$rel_time) {
 $this = $this|0;
 $pc = $pc|0;
 $rel_time = $rel_time|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__Z8get_le16PKv($pc)|0);
 $2 = $1 & 8191;
 $3 = (__ZN8SNES_SPC8cpu_readEii($this,$2,$rel_time)|0);
 $4 = $1 >>> 13;
 $5 = $3 >>> $4;
 $6 = $5 << 8;
 $7 = $6 & 256;
 STACKTOP = sp;return ($7|0);
}
function __Z8get_le16PKv($p) {
 $p = $p|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($p) + 1|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = $3 << 8;
 $5 = HEAP8[$p]|0;
 $6 = $5&255;
 $7 = $4 | $6;
 STACKTOP = sp;return ($7|0);
}
function __Z8set_le16Pvj($p,$n) {
 $p = $p|0;
 $n = $n|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $n >>> 8;
 $2 = $1&255;
 $3 = (($p) + 1|0);
 HEAP8[$3] = $2;
 $4 = $n&255;
 HEAP8[$p] = $4;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP5writeEii($this,$addr,$data) {
 $this = $this|0;
 $addr = $addr|0;
 $data = $data|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($addr>>>0)<(128);
 if (!($1)) {
  ___assert_fail(((392)|0),((432)|0),248,((464)|0));
  // unreachable;
 }
 $2 = $data&255;
 $3 = (($this) + ($addr)|0);
 HEAP8[$3] = $2;
 $4 = $addr & 15;
 do {
  if ((($4|0) == 8)) {
   $5 = (($this) + 297|0);
   HEAP8[$5] = $2;
  } else if ((($4|0) == 9)) {
   $6 = (($this) + 298|0);
   HEAP8[$6] = $2;
  } else if ((($4|0) == 12)) {
   if ((($addr|0) == 76)) {
    $7 = $data & 255;
    $8 = (($this) + 292|0);
    HEAP32[$8>>2] = $7;
    break;
   } else if ((($addr|0) == 124)) {
    $9 = (($this) + 296|0);
    HEAP8[$9] = 0;
    $10 = (($this) + 124|0);
    HEAP8[$10] = 0;
    break;
   } else {
    break;
   }
  }
 } while(0);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC4initEv($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $exitcond = 0, $i$01 = 0;
 var $i$01$phi = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1564|0);
 $2 = $1;
 _memset(($2|0),0,66640)|0;
 $3 = ($this);
 $4 = (($this) + 2412|0);
 __ZN7SPC_DSP4initEPv($3,$4);
 $5 = (($this) + 1704|0);
 HEAP32[$5>>2] = 256;
 $6 = (($this) + 1834|0);
 HEAP8[$6] = -1;
 $7 = (($this) + 1835|0);
 HEAP8[$7] = -64;
 $i$01 = 0;
 while(1) {
  $8 = (480 + ($i$01)|0);
  $9 = HEAP8[$8]|0;
  $10 = $9&255;
  $11 = ($9&255) >>> 4;
  $12 = $i$01 << 1;
  $13 = ((($this) + ($12)|0) + 1900|0);
  HEAP8[$13] = $11;
  $14 = $10 & 15;
  $15 = $14&255;
  $16 = $12 | 1;
  $17 = ((($this) + ($16)|0) + 1900|0);
  HEAP8[$17] = $15;
  $18 = (($i$01) + 1)|0;
  $exitcond = ($18|0)==(128);
  if ($exitcond) {
   break;
  } else {
   $i$01$phi = $18;$i$01 = $i$01$phi;
  }
 }
 __ZN8SNES_SPC5resetEv($this);
 STACKTOP = sp;return (0|0);
}
function __ZN8SNES_SPC5resetEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 2412|0);
 _memset(($1|0),-1,65536)|0;
 __ZN8SNES_SPC10ram_loadedEv($this);
 __ZN8SNES_SPC12reset_commonEi($this,15);
 $2 = ($this);
 __ZN7SPC_DSP5resetEv($2);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC9set_tempoEi($this,$t) {
 $this = $this|0;
 $t = $t|0;
 var $$ = 0, $$t = 0, $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1704|0);
 HEAP32[$1>>2] = $t;
 $2 = ($t|0)==(0);
 $$t = $2 ? 1 : $t;
 $3 = $$t >> 1;
 $4 = (($3) + 4096)|0;
 $5 = (($4|0) / ($$t|0))&-1;
 $6 = ($5|0)<(4);
 $$ = $6 ? 4 : $5;
 $7 = (($this) + 1616|0);
 HEAP32[$7>>2] = $$;
 $8 = $$ << 3;
 $9 = (($this) + 1592|0);
 HEAP32[$9>>2] = $8;
 $10 = (($this) + 1568|0);
 HEAP32[$10>>2] = $8;
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC13timers_loadedEv($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1637|0);
 $2 = (($this) + 1646|0);
 $3 = HEAP8[$2]|0;
 $4 = $3&255;
 $5 = (($4) + 255)|0;
 $6 = $5 & 255;
 $7 = (($6) + 1)|0;
 $8 = (($this) + 1572|0);
 HEAP32[$8>>2] = $7;
 $9 = HEAP8[$1]|0;
 $10 = $9&255;
 $11 = $10 & 1;
 $12 = (($this) + 1580|0);
 HEAP32[$12>>2] = $11;
 $13 = (($this) + 1665|0);
 $14 = HEAP8[$13]|0;
 $15 = $14&255;
 $16 = $15 & 15;
 $17 = (($this) + 1584|0);
 HEAP32[$17>>2] = $16;
 $18 = (($this) + 1647|0);
 $19 = HEAP8[$18]|0;
 $20 = $19&255;
 $21 = (($20) + 255)|0;
 $22 = $21 & 255;
 $23 = (($22) + 1)|0;
 $24 = (($this) + 1596|0);
 HEAP32[$24>>2] = $23;
 $25 = HEAP8[$1]|0;
 $26 = $25&255;
 $27 = $26 >>> 1;
 $28 = $27 & 1;
 $29 = (($this) + 1604|0);
 HEAP32[$29>>2] = $28;
 $30 = (($this) + 1666|0);
 $31 = HEAP8[$30]|0;
 $32 = $31&255;
 $33 = $32 & 15;
 $34 = (($this) + 1608|0);
 HEAP32[$34>>2] = $33;
 $35 = (($this) + 1648|0);
 $36 = HEAP8[$35]|0;
 $37 = $36&255;
 $38 = (($37) + 255)|0;
 $39 = $38 & 255;
 $40 = (($39) + 1)|0;
 $41 = (($this) + 1620|0);
 HEAP32[$41>>2] = $40;
 $42 = HEAP8[$1]|0;
 $43 = $42&255;
 $44 = $43 >>> 2;
 $45 = $44 & 1;
 $46 = (($this) + 1628|0);
 HEAP32[$46>>2] = $45;
 $47 = (($this) + 1667|0);
 $48 = HEAP8[$47]|0;
 $49 = $48&255;
 $50 = $49 & 15;
 $51 = (($this) + 1632|0);
 HEAP32[$51>>2] = $50;
 $52 = (($this) + 1704|0);
 $53 = HEAP32[$52>>2]|0;
 __ZN8SNES_SPC9set_tempoEi($this,$53);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC9load_regsEPKh($this,$in) {
 $this = $this|0;
 $in = $in|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 $1 = (($this) + 1636|0);
 dest=$1+0|0; src=$in+0|0; stop=dest+16|0; do { HEAP8[dest]=HEAP8[src]|0; dest=dest+1|0; src=src+1|0; } while ((dest|0) < (stop|0));;
 $2 = (($this) + 1652|0);
 _memmove(($2|0),($in|0),16)|0;
 HEAP8[$2] = 0;
 $3 = (($this) + 1653|0);
 HEAP8[$3] = 0;
 $4 = (($this) + 1662|0);
 HEAP8[$4] = 0;
 $5 = (($this) + 1663|0);
 HEAP8[$5] = 0;
 $6 = (($this) + 1664|0);
 HEAP8[$6] = 0;
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC10ram_loadedEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1768|0);
 HEAP32[$1>>2] = 0;
 $2 = (($this) + 2156|0);
 $3 = (($this) + 2652|0);
 __ZN8SNES_SPC9load_regsEPKh($this,$3);
 $4 = $2;
 _memset(($4|0),-1,256)|0;
 $5 = (($this) + 67948|0);
 _memset(($5|0),-1,256)|0;
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC11regs_loadedEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1637|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = $3 & 128;
 __ZN8SNES_SPC10enable_romEi($this,$4);
 __ZN8SNES_SPC13timers_loadedEv($this);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC15reset_time_regsEv($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1716|0);
 HEAP32[$1>>2] = 0;
 $2 = (($this) + 1700|0);
 HEAP8[$2] = 0;
 $3 = (($this) + 1696|0);
 HEAP32[$3>>2] = 0;
 $4 = (($this) + 1692|0);
 HEAP32[$4>>2] = 0;
 $5 = (($this) + 1564|0);
 HEAP32[$5>>2] = 1;
 $6 = (($this) + 1576|0);
 HEAP32[$6>>2] = 0;
 $7 = (($this) + 1588|0);
 HEAP32[$7>>2] = 1;
 $8 = (($this) + 1600|0);
 HEAP32[$8>>2] = 0;
 $9 = (($this) + 1612|0);
 HEAP32[$9>>2] = 1;
 $10 = (($this) + 1624|0);
 HEAP32[$10>>2] = 0;
 __ZN8SNES_SPC11regs_loadedEv($this);
 $11 = (($this) + 1720|0);
 HEAP32[$11>>2] = 0;
 __ZN8SNES_SPC9reset_bufEv($this);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC9reset_bufEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $out$01 = 0, $out$01$phi = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1736|0);
 $2 = (($this) + 1752|0);
 $out$01 = $1;
 while(1) {
  $3 = (($out$01) + 2|0);
  HEAP16[$out$01>>1] = 0;
  $4 = ($3>>>0)<($2>>>0);
  if ($4) {
   $out$01$phi = $3;$out$01 = $out$01$phi;
  } else {
   break;
  }
 }
 $5 = (($this) + 1732|0);
 HEAP32[$5>>2] = $3;
 $6 = (($this) + 1724|0);
 HEAP32[$6>>2] = 0;
 $7 = ($this);
 __ZN7SPC_DSP10set_outputEPsi($7,0,0);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC12reset_commonEi($this,$timer_counter_init) {
 $this = $this|0;
 $timer_counter_init = $timer_counter_init|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $scevgep = 0, $scevgep3 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $timer_counter_init&255;
 $scevgep3 = (($this) + 1665|0);
 _memset(($scevgep3|0),($1|0),3)|0;
 $2 = (($this) + 1668|0);
 $3 = $2;
 ;HEAP32[$3+0>>2]=0|0;HEAP32[$3+4>>2]=0|0;HEAP32[$3+8>>2]=0|0;HEAP32[$3+12>>2]=0|0;HEAP32[$3+16>>2]=0|0;HEAP32[$3+20>>2]=0|0;
 $4 = ($2);
 HEAP32[$4>>2] = 65472;
 $5 = (($this) + 1636|0);
 HEAP8[$5] = 10;
 $6 = (($this) + 1637|0);
 HEAP8[$6] = -80;
 $scevgep = (($this) + 1656|0);
 $7 = $scevgep;
 HEAP8[$7]=0&255;HEAP8[$7+1|0]=(0>>8)&255;HEAP8[$7+2|0]=(0>>16)&255;HEAP8[$7+3|0]=0>>24;
 __ZN8SNES_SPC15reset_time_regsEv($this);
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC8load_spcEPKvl($this,$data,$size) {
 $this = $this|0;
 $data = $data|0;
 $size = $size|0;
 var $$0 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($size|0)<(35);
 if ($1) {
  $$0 = (648);
  STACKTOP = sp;return ($$0|0);
 }
 $2 = (_memcmp($data,(608),27)|0);
 $3 = ($2|0)==(0);
 if (!($3)) {
  $$0 = (648);
  STACKTOP = sp;return ($$0|0);
 }
 $4 = ($size|0)<(65920);
 if ($4) {
  $$0 = (664);
  STACKTOP = sp;return ($$0|0);
 }
 $5 = (($data) + 38|0);
 $6 = HEAP8[$5]|0;
 $7 = $6&255;
 $8 = $7 << 8;
 $9 = (($data) + 37|0);
 $10 = HEAP8[$9]|0;
 $11 = $10&255;
 $12 = $8 | $11;
 $13 = (($this) + 1668|0);
 HEAP32[$13>>2] = $12;
 $14 = (($data) + 39|0);
 $15 = HEAP8[$14]|0;
 $16 = $15&255;
 $17 = (($this) + 1672|0);
 HEAP32[$17>>2] = $16;
 $18 = (($data) + 40|0);
 $19 = HEAP8[$18]|0;
 $20 = $19&255;
 $21 = (($this) + 1676|0);
 HEAP32[$21>>2] = $20;
 $22 = (($data) + 41|0);
 $23 = HEAP8[$22]|0;
 $24 = $23&255;
 $25 = (($this) + 1680|0);
 HEAP32[$25>>2] = $24;
 $26 = (($data) + 42|0);
 $27 = HEAP8[$26]|0;
 $28 = $27&255;
 $29 = (($this) + 1684|0);
 HEAP32[$29>>2] = $28;
 $30 = (($data) + 43|0);
 $31 = HEAP8[$30]|0;
 $32 = $31&255;
 $33 = (($this) + 1688|0);
 HEAP32[$33>>2] = $32;
 $34 = (($this) + 2412|0);
 $35 = (($data) + 256|0);
 _memcpy(($34|0),($35|0),65536)|0;
 __ZN8SNES_SPC10ram_loadedEv($this);
 $36 = ($this);
 $37 = (($data) + 65792|0);
 __ZN7SPC_DSP4loadEPKh($36,$37);
 __ZN8SNES_SPC15reset_time_regsEv($this);
 $$0 = 0;
 STACKTOP = sp;return ($$0|0);
}
function __ZN8SNES_SPC10clear_echoEv($this) {
 $this = $this|0;
 var $$ = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($this);
 $2 = (__ZNK7SPC_DSP4readEi($1,108)|0);
 $3 = $2 & 32;
 $4 = ($3|0)==(0);
 if (!($4)) {
  STACKTOP = sp;return;
 }
 $5 = (__ZNK7SPC_DSP4readEi($1,109)|0);
 $6 = $5 << 8;
 $7 = (__ZNK7SPC_DSP4readEi($1,125)|0);
 $8 = $7 << 11;
 $9 = $8 & 30720;
 $10 = (($9) + ($6))|0;
 $11 = ($10|0)>(65536);
 $$ = $11 ? 65536 : $10;
 $12 = ((($this) + ($6)|0) + 2412|0);
 $13 = (($$) - ($6))|0;
 _memset(($12|0),-1,($13|0))|0;
 STACKTOP = sp;return;
}
function __ZN8SNES_SPC10set_outputEPsi($this,$out,$size) {
 $this = $this|0;
 $out = $out|0;
 $size = $size|0;
 var $$0$lcssa = 0, $$05 = 0, $$05$phi = 0, $$11 = 0, $$11$phi = 0, $$2 = 0, $$lcssa3 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0;
 var $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $4 = 0, $5 = 0, $6 = 0;
 var $7 = 0, $8 = 0, $9 = 0, $in$0$lcssa = 0, $in$06 = 0, $in$06$phi = 0, $in$12 = 0, $in$12$phi = 0, $or$cond = 0, $or$cond4 = 0, $out_end$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $size & 1;
 $2 = ($1|0)==(0);
 if (!($2)) {
  ___assert_fail(((688)|0),((704)|0),279,((744)|0));
  // unreachable;
 }
 $3 = (($this) + 1720|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = $4 & 31;
 HEAP32[$3>>2] = $5;
 $6 = ($out|0)==(0|0);
 if ($6) {
  __ZN8SNES_SPC9reset_bufEv($this);
  STACKTOP = sp;return;
 }
 $7 = (($out) + ($size<<1)|0);
 $8 = (($this) + 1724|0);
 HEAP32[$8>>2] = $out;
 $9 = (($this) + 1728|0);
 HEAP32[$9>>2] = $7;
 $10 = (($this) + 1736|0);
 $11 = (($this) + 1732|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = ($10>>>0)<($12>>>0);
 $14 = ($size|0)>(0);
 $or$cond4 = $13 & $14;
 if ($or$cond4) {
  $15 = HEAP32[$11>>2]|0;
  $$05 = $out;$in$06 = $10;
  while(1) {
   $16 = (($in$06) + 2|0);
   $17 = HEAP16[$in$06>>1]|0;
   $18 = (($$05) + 2|0);
   HEAP16[$$05>>1] = $17;
   $19 = ($16>>>0)<($15>>>0);
   $20 = ($18>>>0)<($7>>>0);
   $or$cond = $19 & $20;
   if ($or$cond) {
    $in$06$phi = $16;$$05$phi = $18;$in$06 = $in$06$phi;$$05 = $$05$phi;
   } else {
    $$0$lcssa = $18;$$lcssa3 = $20;$in$0$lcssa = $16;
    break;
   }
  }
 } else {
  $$0$lcssa = $out;$$lcssa3 = $14;$in$0$lcssa = $10;
 }
 do {
  if ($$lcssa3) {
   $$2 = $$0$lcssa;$out_end$0 = $7;
  } else {
   $21 = ($this);
   $22 = (__ZN7SPC_DSP5extraEv($21)|0);
   $23 = (($22) + 32|0);
   $24 = HEAP32[$11>>2]|0;
   $25 = ($in$0$lcssa>>>0)<($24>>>0);
   if (!($25)) {
    $$2 = $22;$out_end$0 = $23;
    break;
   }
   $26 = HEAP32[$11>>2]|0;
   $$11 = $22;$in$12 = $in$0$lcssa;
   while(1) {
    $27 = (($in$12) + 2|0);
    $28 = HEAP16[$in$12>>1]|0;
    $29 = (($$11) + 2|0);
    HEAP16[$$11>>1] = $28;
    $30 = ($27>>>0)<($26>>>0);
    if ($30) {
     $in$12$phi = $27;$$11$phi = $29;$in$12 = $in$12$phi;$$11 = $$11$phi;
    } else {
     break;
    }
   }
   $31 = ($29>>>0)>($23>>>0);
   if (!($31)) {
    $$2 = $29;$out_end$0 = $23;
    break;
   }
   ___assert_fail(((760)|0),((704)|0),303,((744)|0));
   // unreachable;
  }
 } while(0);
 $32 = ($this);
 $33 = $out_end$0;
 $34 = $$2;
 $35 = (($33) - ($34))|0;
 $36 = $35 >> 1;
 __ZN7SPC_DSP10set_outputEPsi($32,$$2,$36);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP5extraEv($this) {
 $this = $this|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1532|0);
 STACKTOP = sp;return ($1|0);
}
function __ZN8SNES_SPC10save_extraEv($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $dsp_end$0 = 0, $in$04 = 0, $in$04$phi = 0, $in$12 = 0, $in$12$phi = 0, $main_end$0 = 0, $or$cond = 0, $out$0$lcssa = 0, $out$03 = 0, $out$03$phi = 0, $out$1$lcssa = 0, $out$11 = 0, $out$11$phi = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1728|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($this);
 $4 = (__ZNK7SPC_DSP7out_posEv($3)|0);
 $5 = (($this) + 1724|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($6>>>0)>($4>>>0);
 $8 = ($4>>>0)>($2>>>0);
 $or$cond = $7 | $8;
 if ($or$cond) {
  $dsp_end$0 = $4;$main_end$0 = $2;
 } else {
  $9 = (__ZN7SPC_DSP5extraEv($3)|0);
  $dsp_end$0 = $9;$main_end$0 = $4;
 }
 $10 = (($this) + 1736|0);
 $11 = HEAP32[$5>>2]|0;
 $12 = (__ZNK8SNES_SPC12sample_countEv($this)|0);
 $13 = (($11) + ($12<<1)|0);
 $14 = ($13>>>0)<($main_end$0>>>0);
 if ($14) {
  $in$04 = $13;$out$03 = $10;
  while(1) {
   $15 = HEAP16[$in$04>>1]|0;
   $16 = (($out$03) + 2|0);
   HEAP16[$out$03>>1] = $15;
   $17 = (($in$04) + 2|0);
   $18 = ($17>>>0)<($main_end$0>>>0);
   if ($18) {
    $out$03$phi = $16;$in$04$phi = $17;$out$03 = $out$03$phi;$in$04 = $in$04$phi;
   } else {
    $out$0$lcssa = $16;
    break;
   }
  }
 } else {
  $out$0$lcssa = $10;
 }
 $19 = (__ZN7SPC_DSP5extraEv($3)|0);
 $20 = ($19>>>0)<($dsp_end$0>>>0);
 if ($20) {
  $in$12 = $19;$out$11 = $out$0$lcssa;
  while(1) {
   $21 = HEAP16[$in$12>>1]|0;
   $22 = (($out$11) + 2|0);
   HEAP16[$out$11>>1] = $21;
   $23 = (($in$12) + 2|0);
   $24 = ($23>>>0)<($dsp_end$0>>>0);
   if ($24) {
    $out$11$phi = $22;$in$12$phi = $23;$out$11 = $out$11$phi;$in$12 = $in$12$phi;
   } else {
    $out$1$lcssa = $22;
    break;
   }
  }
 } else {
  $out$1$lcssa = $out$0$lcssa;
 }
 $25 = (($this) + 1732|0);
 HEAP32[$25>>2] = $out$1$lcssa;
 $26 = (($this) + 1768|0);
 $27 = ($out$1$lcssa>>>0)>($26>>>0);
 if ($27) {
  ___assert_fail(((776)|0),((704)|0),334,((816)|0));
  // unreachable;
 } else {
  STACKTOP = sp;return;
 }
}
function __ZNK7SPC_DSP7out_posEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1520|0);
 $2 = HEAP32[$1>>2]|0;
 STACKTOP = sp;return ($2|0);
}
function __ZNK8SNES_SPC12sample_countEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1720|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 >> 5;
 $4 = $3 << 1;
 STACKTOP = sp;return ($4|0);
}
function __ZN8SNES_SPC4playEiPs($this,$count,$out) {
 $this = $this|0;
 $count = $count|0;
 $out = $out|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $count & 1;
 $2 = ($1|0)==(0);
 if (!($2)) {
  ___assert_fail(((832)|0),((704)|0),338,((856)|0));
  // unreachable;
 }
 $3 = ($count|0)==(0);
 if (!($3)) {
  __ZN8SNES_SPC10set_outputEPsi($this,$out,$count);
  $4 = $count << 4;
  __ZN8SNES_SPC9end_frameEi($this,$4);
 }
 $5 = (($this) + 1716|0);
 $6 = HEAP32[$5>>2]|0;
 HEAP32[$5>>2] = 0;
 STACKTOP = sp;return ($6|0);
}
function __ZN7SPC_DSP10set_outputEPsi($this,$out,$size) {
 $this = $this|0;
 $out = $out|0;
 $size = $size|0;
 var $$out = 0, $$size = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $size & 1;
 $2 = ($1|0)==(0);
 if ($2) {
  $3 = ($out|0)==(0|0);
  $4 = (($this) + 1532|0);
  $$out = $3 ? $4 : $out;
  $$size = $3 ? 16 : $size;
  $5 = (($this) + 1528|0);
  HEAP32[$5>>2] = $$out;
  $6 = (($this) + 1520|0);
  HEAP32[$6>>2] = $$out;
  $7 = (($$out) + ($$size<<1)|0);
  $8 = (($this) + 1524|0);
  HEAP32[$8>>2] = $7;
  STACKTOP = sp;return;
 } else {
  ___assert_fail(((864)|0),((880)|0),77,((912)|0));
  // unreachable;
 }
}
function __ZN7SPC_DSP9voice_V3cEPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $8 = 0, $9 = 0, $output$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 300|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($v) + 116|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = $4 & $2;
 $6 = ($5|0)==(0);
 if (!($6)) {
  $7 = (($this) + 356|0);
  $8 = HEAP32[$7>>2]|0;
  $9 = $8 >> 5;
  $10 = (($this) + 352|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = Math_imul($9, $11)|0;
  $13 = $12 >> 10;
  $14 = (($13) + ($11))|0;
  HEAP32[$10>>2] = $14;
 }
 $15 = (($v) + 120|0);
 $16 = HEAP32[$15>>2]|0;
 if ((($16|0) == 5)) {
  $17 = (($this) + 320|0);
  $18 = HEAP32[$17>>2]|0;
  $19 = (($v) + 104|0);
  HEAP32[$19>>2] = $18;
  $20 = (($v) + 108|0);
  HEAP32[$20>>2] = 1;
  $21 = (($v) + 96|0);
  HEAP32[$21>>2] = 0;
  $22 = (($this) + 328|0);
  HEAP32[$22>>2] = 0;
  $23 = (($this) + 288|0);
  HEAP8[$23] = 1;
  label = 5;
 } else if (!((($16|0) == 0))) {
  label = 5;
 }
 if ((label|0) == 5) {
  $24 = (($v) + 128|0);
  HEAP32[$24>>2] = 0;
  $25 = (($v) + 132|0);
  HEAP32[$25>>2] = 0;
  $26 = (($v) + 100|0);
  HEAP32[$26>>2] = 0;
  $27 = HEAP32[$15>>2]|0;
  $28 = (($27) + -1)|0;
  HEAP32[$15>>2] = $28;
  $29 = $28 & 3;
  $30 = ($29|0)==(0);
  if (!($30)) {
   HEAP32[$26>>2] = 16384;
  }
  $31 = (($this) + 352|0);
  HEAP32[$31>>2] = 0;
 }
 $32 = (__ZN7SPC_DSP11interpolateEPKNS_7voice_tE(0,$v)|0);
 $33 = (($this) + 304|0);
 $34 = HEAP32[$33>>2]|0;
 $35 = HEAP32[$3>>2]|0;
 $36 = $35 & $34;
 $37 = ($36|0)==(0);
 if ($37) {
  $output$0 = $32;
 } else {
  $38 = (($this) + 268|0);
  $39 = HEAP32[$38>>2]|0;
  $40 = $39 << 17;
  $41 = $40 >> 16;
  $output$0 = $41;
 }
 $42 = (($v) + 128|0);
 $43 = HEAP32[$42>>2]|0;
 $44 = Math_imul($43, $output$0)|0;
 $45 = $44 >> 11;
 $46 = $45 & -2;
 $47 = (($this) + 356|0);
 HEAP32[$47>>2] = $46;
 $48 = HEAP32[$42>>2]|0;
 $49 = $48 >>> 4;
 $50 = $49&255;
 $51 = (($v) + 136|0);
 HEAP8[$51] = $50;
 $52 = (($this) + 108|0);
 $53 = HEAP8[$52]|0;
 $54 = ($53<<24>>24)<(0);
 if ($54) {
  label = 12;
 } else {
  $55 = (($this) + 328|0);
  $56 = HEAP32[$55>>2]|0;
  $57 = $56 & 3;
  $58 = ($57|0)==(1);
  if ($58) {
   label = 12;
  }
 }
 if ((label|0) == 12) {
  $59 = (($v) + 124|0);
  HEAP32[$59>>2] = 0;
  HEAP32[$42>>2] = 0;
 }
 $60 = (($this) + 260|0);
 $61 = HEAP32[$60>>2]|0;
 $62 = ($61|0)==(0);
 do {
  if (!($62)) {
   $63 = (($this) + 316|0);
   $64 = HEAP32[$63>>2]|0;
   $65 = HEAP32[$3>>2]|0;
   $66 = $65 & $64;
   $67 = ($66|0)==(0);
   if (!($67)) {
    $68 = (($v) + 124|0);
    HEAP32[$68>>2] = 0;
   }
   $69 = (($this) + 264|0);
   $70 = HEAP32[$69>>2]|0;
   $71 = HEAP32[$3>>2]|0;
   $72 = $71 & $70;
   $73 = ($72|0)==(0);
   if ($73) {
    break;
   }
   HEAP32[$15>>2] = 5;
   $74 = (($v) + 124|0);
   HEAP32[$74>>2] = 1;
  }
 } while(0);
 $75 = HEAP32[$15>>2]|0;
 $76 = ($75|0)==(0);
 if (!($76)) {
  STACKTOP = sp;return;
 }
 __ZN7SPC_DSP12run_envelopeEPNS_7voice_tE($this,$v);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP11interpolateEPKNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $$sum = 0, $$sum1 = 0, $$sum23 = 0, $$sum4 = 0, $$sum5 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0;
 var $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0;
 var $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $out$0 = 0, $sext = 0, $sext6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($v) + 100|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 >>> 4;
 $4 = $3 & 255;
 $5 = $4 ^ 255;
 $6 = ((1528) + ($5<<1)|0);
 $7 = ((1528) + ($4<<1)|0);
 $8 = $2 >> 12;
 $9 = (($v) + 96|0);
 $10 = HEAP32[$9>>2]|0;
 $11 = (($8) + ($10))|0;
 $12 = (($v) + ($11<<2)|0);
 $13 = HEAP16[$6>>1]|0;
 $14 = $13 << 16 >> 16;
 $15 = HEAP32[$12>>2]|0;
 $16 = Math_imul($14, $15)|0;
 $17 = $16 >>> 11;
 $$sum1 = $5 | 256;
 $18 = ((1528) + ($$sum1<<1)|0);
 $19 = HEAP16[$18>>1]|0;
 $20 = $19 << 16 >> 16;
 $$sum = (($11) + 1)|0;
 $21 = (($v) + ($$sum<<2)|0);
 $22 = HEAP32[$21>>2]|0;
 $23 = Math_imul($20, $22)|0;
 $24 = $23 >>> 11;
 $25 = (($24) + ($17))|0;
 $$sum23 = $4 | 256;
 $26 = ((1528) + ($$sum23<<1)|0);
 $27 = HEAP16[$26>>1]|0;
 $28 = $27 << 16 >> 16;
 $$sum4 = (($11) + 2)|0;
 $29 = (($v) + ($$sum4<<2)|0);
 $30 = HEAP32[$29>>2]|0;
 $31 = Math_imul($28, $30)|0;
 $32 = $31 >>> 11;
 $33 = (($25) + ($32))|0;
 $sext = $33 << 16;
 $34 = $sext >> 16;
 $35 = HEAP16[$7>>1]|0;
 $36 = $35 << 16 >> 16;
 $$sum5 = (($11) + 3)|0;
 $37 = (($v) + ($$sum5<<2)|0);
 $38 = HEAP32[$37>>2]|0;
 $39 = Math_imul($36, $38)|0;
 $40 = $39 >> 11;
 $41 = (($34) + ($40))|0;
 $sext6 = $41 << 16;
 $42 = $sext6 >> 16;
 $43 = ($42|0)==($41|0);
 if ($43) {
  $out$0 = $41;
  $46 = $out$0 & -2;
  STACKTOP = sp;return ($46|0);
 }
 $44 = $41 >> 31;
 $45 = $44 ^ 32767;
 $out$0 = $45;
 $46 = $out$0 & -2;
 STACKTOP = sp;return ($46|0);
}
function __ZN7SPC_DSP12run_envelopeEPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $$ = 0, $$1 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0;
 var $62 = 0, $63 = 0, $64 = 0, $7 = 0, $8 = 0, $9 = 0, $env$0 = 0, $env$1 = 0, $env_data$0 = 0, $rate$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($v) + 128|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($v) + 124|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = ($4|0)==(0);
 if ($5) {
  $6 = (($2) + -8)|0;
  $7 = ($6|0)<(0);
  $$ = $7 ? 0 : $6;
  HEAP32[$1>>2] = $$;
  STACKTOP = sp;return;
 }
 $8 = (($v) + 112|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (($9) + 6|0);
 $11 = HEAP8[$10]|0;
 $12 = $11&255;
 $13 = (($this) + 324|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = $14 & 128;
 $16 = ($15|0)==(0);
 do {
  if ($16) {
   $32 = (($9) + 7|0);
   $33 = HEAP8[$32]|0;
   $34 = $33&255;
   $35 = $34 >>> 5;
   $36 = ($33<<24>>24)>(-1);
   if ($36) {
    $37 = $34 << 4;
    $env$0 = $37;$env_data$0 = $34;$rate$0 = 31;
    break;
   }
   $38 = $34 & 31;
   $39 = ($35|0)==(4);
   if ($39) {
    $40 = (($2) + -32)|0;
    $env$0 = $40;$env_data$0 = $34;$rate$0 = $38;
    break;
   }
   $41 = ($33&255)<(192);
   if ($41) {
    $42 = (($2) + -1)|0;
    $43 = $42 >> 8;
    $44 = (($42) - ($43))|0;
    $env$0 = $44;$env_data$0 = $34;$rate$0 = $38;
    break;
   }
   $45 = (($2) + 32)|0;
   $46 = ($35|0)==(7);
   if (!($46)) {
    $env$0 = $45;$env_data$0 = $34;$rate$0 = $38;
    break;
   }
   $47 = (($v) + 132|0);
   $48 = HEAP32[$47>>2]|0;
   $49 = ($48>>>0)>(1535);
   $50 = (($2) + 8)|0;
   $$1 = $49 ? $50 : $45;
   $env$0 = $$1;$env_data$0 = $34;$rate$0 = $38;
  } else {
   $17 = ($4|0)>(1);
   if (!($17)) {
    $26 = $14 << 1;
    $27 = $26 & 30;
    $28 = $27 | 1;
    $29 = ($28|0)!=(31);
    $30 = $29 ? 32 : 1024;
    $31 = (($30) + ($2))|0;
    $env$0 = $31;$env_data$0 = $12;$rate$0 = $28;
    break;
   }
   $18 = (($2) + -1)|0;
   $19 = $18 >> 8;
   $20 = (($18) - ($19))|0;
   $21 = $12 & 31;
   $22 = ($4|0)==(2);
   if (!($22)) {
    $env$0 = $20;$env_data$0 = $12;$rate$0 = $21;
    break;
   }
   $23 = $14 >>> 3;
   $24 = $23 & 14;
   $25 = $24 | 16;
   $env$0 = $20;$env_data$0 = $12;$rate$0 = $25;
  }
 } while(0);
 $51 = $env$0 >> 8;
 $52 = $env_data$0 >>> 5;
 $53 = ($51|0)==($52|0);
 do {
  if ($53) {
   $54 = HEAP32[$3>>2]|0;
   $55 = ($54|0)==(2);
   if (!($55)) {
    break;
   }
   HEAP32[$3>>2] = 3;
  }
 } while(0);
 $56 = (($v) + 132|0);
 HEAP32[$56>>2] = $env$0;
 $57 = ($env$0>>>0)>(2047);
 do {
  if ($57) {
   $58 = $env$0 >> 31;
   $59 = $58 & -2047;
   $60 = (($59) + 2047)|0;
   $61 = HEAP32[$3>>2]|0;
   $62 = ($61|0)==(1);
   if (!($62)) {
    $env$1 = $60;
    break;
   }
   HEAP32[$3>>2] = 2;
   $env$1 = $60;
  } else {
   $env$1 = $env$0;
  }
 } while(0);
 $63 = (__ZN7SPC_DSP12read_counterEi($this,$rate$0)|0);
 $64 = ($63|0)==(0);
 if (!($64)) {
  STACKTOP = sp;return;
 }
 HEAP32[$1>>2] = $env$1;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V4EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $$ = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 360|0);
 HEAP32[$1>>2] = 0;
 $2 = (($v) + 100|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = ($3|0)>(16383);
 do {
  if ($4) {
   __ZN7SPC_DSP10decode_brrEPNS_7voice_tE($this,$v);
   $5 = (($v) + 108|0);
   $6 = HEAP32[$5>>2]|0;
   $7 = (($6) + 2)|0;
   HEAP32[$5>>2] = $7;
   $8 = ($7|0)>(8);
   if (!($8)) {
    break;
   }
   $9 = ($7|0)==(9);
   if (!($9)) {
    ___assert_fail(((928)|0),((880)|0),512,((960)|0));
    // unreachable;
   }
   $10 = (($v) + 104|0);
   $11 = HEAP32[$10>>2]|0;
   $12 = (($11) + 9)|0;
   $13 = $12 & 65535;
   HEAP32[$10>>2] = $13;
   $14 = (($this) + 328|0);
   $15 = HEAP32[$14>>2]|0;
   $16 = $15 & 1;
   $17 = ($16|0)==(0);
   if (!($17)) {
    $18 = (($this) + 320|0);
    $19 = HEAP32[$18>>2]|0;
    HEAP32[$10>>2] = $19;
    $20 = (($v) + 116|0);
    $21 = HEAP32[$20>>2]|0;
    HEAP32[$1>>2] = $21;
   }
   HEAP32[$5>>2] = 1;
  }
 } while(0);
 $22 = HEAP32[$2>>2]|0;
 $23 = $22 & 16383;
 $24 = (($this) + 352|0);
 $25 = HEAP32[$24>>2]|0;
 $26 = (($23) + ($25))|0;
 $27 = ($26|0)>(32767);
 $$ = $27 ? 32767 : $26;
 HEAP32[$2>>2] = $$;
 __ZN7SPC_DSP12voice_outputEPKNS_7voice_tEi($this,$v,0);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP10decode_brrEPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $$ = 0, $$sum = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0;
 var $26 = 0, $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
 var $44 = 0, $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0;
 var $62 = 0, $63 = 0, $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $8 = 0, $9 = 0, $nybbles$04 = 0, $pos$03 = 0, $s$0 = 0, $s$1 = 0, $s$2 = 0, $sext = 0, $sext1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 332|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($v) + 104|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($v) + 108|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($4) + 1)|0;
 $8 = (($7) + ($6))|0;
 $9 = $8 & 65535;
 $10 = (($this) + 1512|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($11) + ($9)|0);
 $13 = HEAP8[$12]|0;
 $14 = (($this) + 328|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (($v) + 96|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = (($17) + 4)|0;
 $19 = ($18|0)>(11);
 $$ = $19 ? 0 : $18;
 HEAP32[$16>>2] = $$;
 $$sum = (($17) + 4)|0;
 $20 = (($v) + ($$sum<<2)|0);
 $21 = ($17|0)<(2147483644);
 if (!($21)) {
  STACKTOP = sp;return;
 }
 $22 = $13&255;
 $23 = $2 << 8;
 $24 = (($v) + ($17<<2)|0);
 $25 = $22 | $23;
 $26 = $15 >> 4;
 $27 = ($26|0)>(12);
 $28 = $15 & 12;
 $29 = ($28>>>0)>(7);
 $30 = ($28|0)==(8);
 $31 = ($28|0)==(0);
 $nybbles$04 = $25;$pos$03 = $24;
 while(1) {
  $sext = $nybbles$04 << 16;
  $32 = $sext >> 28;
  $33 = $32 << $26;
  $34 = $33 >> 1;
  if ($27) {
   $35 = $33 >> 26;
   $36 = $35 << 11;
   $s$0 = $36;
  } else {
   $s$0 = $34;
  }
  $37 = (($pos$03) + 44|0);
  $38 = HEAP32[$37>>2]|0;
  $39 = (($pos$03) + 40|0);
  $40 = HEAP32[$39>>2]|0;
  $41 = $40 >> 1;
  do {
   if ($29) {
    $42 = (($38) + ($s$0))|0;
    $43 = (($42) - ($41))|0;
    if ($30) {
     $44 = $40 >> 5;
     $45 = Math_imul($38, -3)|0;
     $46 = $45 >> 6;
     $47 = (($46) + ($44))|0;
     $48 = (($47) + ($43))|0;
     $s$1 = $48;
     break;
    } else {
     $49 = Math_imul($38, -13)|0;
     $50 = $49 >> 7;
     $51 = (($43) + ($50))|0;
     $52 = ($41*3)|0;
     $53 = $52 >> 4;
     $54 = (($51) + ($53))|0;
     $s$1 = $54;
     break;
    }
   } else {
    if ($31) {
     $s$1 = $s$0;
     break;
    }
    $55 = $38 >> 1;
    $56 = (($55) + ($s$0))|0;
    $57 = (0 - ($38))|0;
    $58 = $57 >> 5;
    $59 = (($56) + ($58))|0;
    $s$1 = $59;
   }
  } while(0);
  $sext1 = $s$1 << 16;
  $60 = $sext1 >> 16;
  $61 = ($60|0)==($s$1|0);
  if ($61) {
   $s$2 = $s$1;
  } else {
   $62 = $s$1 >> 31;
   $63 = $62 ^ 32767;
   $s$2 = $63;
  }
  $64 = $s$2 << 17;
  $65 = $64 >> 16;
  HEAP32[$pos$03>>2] = $65;
  $66 = (($pos$03) + 48|0);
  HEAP32[$66>>2] = $65;
  $67 = (($pos$03) + 4|0);
  $68 = $nybbles$04 << 4;
  $69 = ($67>>>0)<($20>>>0);
  if ($69) {
   $nybbles$04 = $68;$pos$03 = $67;
  } else {
   break;
  }
 }
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP12voice_outputEPKNS_7voice_tEi($this,$v,$ch) {
 $this = $this|0;
 $v = $v|0;
 $ch = $ch|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $sext = 0, $sext1 = 0, $storemerge = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 356|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($v) + 112|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + ($ch)|0);
 $6 = HEAP8[$5]|0;
 $7 = $6 << 24 >> 24;
 $8 = Math_imul($7, $2)|0;
 $9 = $8 >> 7;
 $10 = ((($this) + ($ch<<2)|0) + 368|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($9) + ($11))|0;
 $sext = $12 << 16;
 $13 = $sext >> 16;
 $14 = ($13|0)==($12|0);
 if ($14) {
  $storemerge = $12;
 } else {
  $15 = $12 >> 31;
  $16 = $15 ^ 32767;
  $storemerge = $16;
 }
 HEAP32[$10>>2] = $storemerge;
 $17 = (($this) + 308|0);
 $18 = HEAP32[$17>>2]|0;
 $19 = (($v) + 116|0);
 $20 = HEAP32[$19>>2]|0;
 $21 = $20 & $18;
 $22 = ($21|0)==(0);
 if ($22) {
  STACKTOP = sp;return;
 }
 $23 = ((($this) + ($ch<<2)|0) + 376|0);
 $24 = HEAP32[$23>>2]|0;
 $25 = (($24) + ($9))|0;
 HEAP32[$23>>2] = $25;
 $sext1 = $25 << 16;
 $26 = $sext1 >> 16;
 $27 = ($26|0)==($25|0);
 if ($27) {
  STACKTOP = sp;return;
 }
 $28 = $25 >> 31;
 $29 = $28 ^ 32767;
 HEAP32[$23>>2] = $29;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP8voice_V7EPNS_7voice_tE($this,$v);
 $1 = (($v) + 420|0);
 __ZN7SPC_DSP8voice_V1EPNS_7voice_tE($this,$1);
 $2 = (($v) + 140|0);
 __ZN7SPC_DSP8voice_V4EPNS_7voice_tE($this,$2);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V7EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 296|0);
 $2 = HEAP8[$1]|0;
 $3 = (($this) + 124|0);
 HEAP8[$3] = $2;
 $4 = (($v) + 136|0);
 $5 = HEAP8[$4]|0;
 $6 = (($this) + 297|0);
 HEAP8[$6] = $5;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V1EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 312|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 << 8;
 $4 = (($this) + 336|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $5 << 2;
 $7 = (($6) + ($3))|0;
 $8 = (($this) + 348|0);
 HEAP32[$8>>2] = $7;
 $9 = (($v) + 112|0);
 $10 = HEAP32[$9>>2]|0;
 $11 = (($10) + 4|0);
 $12 = HEAP8[$11]|0;
 $13 = $12&255;
 HEAP32[$4>>2] = $13;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP8voice_V8EPNS_7voice_tE($this,$v);
 $1 = (($v) + 140|0);
 __ZN7SPC_DSP8voice_V5EPNS_7voice_tE($this,$1);
 $2 = (($v) + 280|0);
 __ZN7SPC_DSP8voice_V2EPNS_7voice_tE($this,$2);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V8EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 298|0);
 $2 = HEAP8[$1]|0;
 $3 = (($v) + 112|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + 9|0);
 HEAP8[$5] = $2;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V5EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $endx_buf$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP12voice_outputEPKNS_7voice_tEi($this,$v,1);
 $1 = (($this) + 124|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = (($this) + 360|0);
 $5 = HEAP32[$4>>2]|0;
 $6 = $3 | $5;
 $7 = (($v) + 120|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = ($8|0)==(5);
 if ($9) {
  $10 = (($v) + 116|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = $11 ^ -1;
  $13 = $6 & $12;
  $endx_buf$0 = $13;
 } else {
  $endx_buf$0 = $6;
 }
 $14 = $endx_buf$0&255;
 $15 = (($this) + 296|0);
 HEAP8[$15] = $14;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V2EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $$sum = 0, $$sum$ = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0;
 var $8 = 0, $9 = 0, $entry$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 348|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($this) + 1512|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($v) + 120|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($6|0)==(0);
 $$sum = (($2) + 2)|0;
 $$sum$ = $7 ? $$sum : $2;
 $entry$0 = (($4) + ($$sum$)|0);
 $8 = (__Z8get_le16PKv($entry$0)|0);
 $9 = (($this) + 320|0);
 HEAP32[$9>>2] = $8;
 $10 = (($v) + 112|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($11) + 5|0);
 $13 = HEAP8[$12]|0;
 $14 = $13&255;
 $15 = (($this) + 324|0);
 HEAP32[$15>>2] = $14;
 $16 = HEAP32[$10>>2]|0;
 $17 = (($16) + 2|0);
 $18 = HEAP8[$17]|0;
 $19 = $18&255;
 $20 = (($this) + 352|0);
 HEAP32[$20>>2] = $19;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP8voice_V9EPNS_7voice_tE($this,$v);
 __ZN7SPC_DSP8voice_V6EPNS_7voice_tE($this,0);
 $1 = (($v) + 280|0);
 __ZN7SPC_DSP8voice_V3EPNS_7voice_tE($this,$1);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V9EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 297|0);
 $2 = HEAP8[$1]|0;
 $3 = (($v) + 112|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + 8|0);
 HEAP8[$5] = $2;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V6EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 356|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 >>> 8;
 $4 = $3&255;
 $5 = (($this) + 298|0);
 HEAP8[$5] = $4;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP8voice_V3EPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP9voice_V3aEPNS_7voice_tE($this,$v);
 __ZN7SPC_DSP9voice_V3bEPNS_7voice_tE($this,$v);
 __ZN7SPC_DSP9voice_V3cEPNS_7voice_tE($this,$v);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP3runEi($this,$clocks_remain) {
 $this = $this|0;
 $clocks_remain = $clocks_remain|0;
 var $$0 = 0, $$1 = 0, $$10 = 0, $$11 = 0, $$12 = 0, $$13 = 0, $$14 = 0, $$15 = 0, $$16 = 0, $$17 = 0, $$18 = 0, $$19 = 0, $$2 = 0, $$20 = 0, $$21 = 0, $$22 = 0, $$23 = 0, $$24 = 0, $$25 = 0, $$26 = 0;
 var $$27 = 0, $$28 = 0, $$29 = 0, $$3 = 0, $$30 = 0, $$31 = 0, $$4 = 0, $$5 = 0, $$6 = 0, $$7 = 0, $$8 = 0, $$9 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0, $105 = 0;
 var $106 = 0, $107 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0;
 var $64 = 0, $65 = 0, $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0;
 var $82 = 0, $83 = 0, $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, label = 0;
 var sp = 0;
 sp = STACKTOP;
 $1 = ($clocks_remain|0)>(0);
 if (!($1)) {
  ___assert_fail(((976)|0),((880)|0),788,((1000)|0));
  // unreachable;
 }
 $2 = (($this) + 284|0);
 $3 = HEAP32[$2>>2]|0;
 $4 = (($3) + ($clocks_remain))|0;
 $5 = $4 & 31;
 HEAP32[$2>>2] = $5;
 switch ($3|0) {
 case 0:  {
  $$0 = $clocks_remain;
  label = 4;
  break;
 }
 case 1:  {
  $$1 = $clocks_remain;
  label = 5;
  break;
 }
 case 2:  {
  $$2 = $clocks_remain;
  label = 6;
  break;
 }
 case 3:  {
  $$3 = $clocks_remain;
  label = 7;
  break;
 }
 case 4:  {
  $$4 = $clocks_remain;
  label = 8;
  break;
 }
 case 5:  {
  $$5 = $clocks_remain;
  label = 9;
  break;
 }
 case 6:  {
  $$6 = $clocks_remain;
  label = 10;
  break;
 }
 case 7:  {
  $$7 = $clocks_remain;
  label = 11;
  break;
 }
 case 15:  {
  $$15 = $clocks_remain;
  label = 19;
  break;
 }
 case 16:  {
  $$16 = $clocks_remain;
  label = 20;
  break;
 }
 case 14:  {
  $$14 = $clocks_remain;
  label = 18;
  break;
 }
 case 17:  {
  $$17 = $clocks_remain;
  label = 21;
  break;
 }
 case 18:  {
  $$18 = $clocks_remain;
  label = 22;
  break;
 }
 case 8:  {
  $$8 = $clocks_remain;
  label = 12;
  break;
 }
 case 9:  {
  $$9 = $clocks_remain;
  label = 13;
  break;
 }
 case 10:  {
  $$10 = $clocks_remain;
  label = 14;
  break;
 }
 case 11:  {
  $$11 = $clocks_remain;
  label = 15;
  break;
 }
 case 12:  {
  $$12 = $clocks_remain;
  label = 16;
  break;
 }
 case 13:  {
  $$13 = $clocks_remain;
  label = 17;
  break;
 }
 case 19:  {
  $$19 = $clocks_remain;
  label = 23;
  break;
 }
 case 20:  {
  $$20 = $clocks_remain;
  label = 24;
  break;
 }
 case 21:  {
  $$21 = $clocks_remain;
  label = 25;
  break;
 }
 case 22:  {
  $$22 = $clocks_remain;
  label = 26;
  break;
 }
 case 23:  {
  $$23 = $clocks_remain;
  label = 27;
  break;
 }
 case 24:  {
  $$24 = $clocks_remain;
  label = 28;
  break;
 }
 case 25:  {
  $$25 = $clocks_remain;
  label = 29;
  break;
 }
 case 26:  {
  $$26 = $clocks_remain;
  label = 30;
  break;
 }
 case 27:  {
  $$27 = $clocks_remain;
  label = 31;
  break;
 }
 case 28:  {
  $$28 = $clocks_remain;
  label = 32;
  break;
 }
 case 29:  {
  $$29 = $clocks_remain;
  label = 33;
  break;
 }
 case 30:  {
  $$30 = $clocks_remain;
  label = 34;
  break;
 }
 case 31:  {
  $$31 = $clocks_remain;
  label = 35;
  break;
 }
 default: {
  STACKTOP = sp;return;
 }
 }
 while(1) {
  if ((label|0) == 4) {
   label = 0;
   $6 = (($this) + 392|0);
   __ZN7SPC_DSP8voice_V5EPNS_7voice_tE($this,$6);
   $7 = (($this) + 532|0);
   __ZN7SPC_DSP8voice_V2EPNS_7voice_tE($this,$7);
   $8 = (($$0) + -1)|0;
   $9 = ($8|0)==(0);
   if ($9) {
    label = 36;
    break;
   } else {
    $$1 = $8;
    label = 5;
    continue;
   }
  }
  else if ((label|0) == 5) {
   label = 0;
   __ZN7SPC_DSP8voice_V6EPNS_7voice_tE($this,0);
   $10 = (($this) + 532|0);
   __ZN7SPC_DSP8voice_V3EPNS_7voice_tE($this,$10);
   $11 = (($$1) + -1)|0;
   $12 = ($11|0)==(0);
   if ($12) {
    label = 36;
    break;
   } else {
    $$2 = $11;
    label = 6;
    continue;
   }
  }
  else if ((label|0) == 6) {
   label = 0;
   $13 = (($this) + 392|0);
   __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$13);
   $14 = (($$2) + -1)|0;
   $15 = ($14|0)==(0);
   if ($15) {
    label = 36;
    break;
   } else {
    $$3 = $14;
    label = 7;
    continue;
   }
  }
  else if ((label|0) == 7) {
   label = 0;
   $16 = (($this) + 392|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$16);
   $17 = (($$3) + -1)|0;
   $18 = ($17|0)==(0);
   if ($18) {
    label = 36;
    break;
   } else {
    $$4 = $17;
    label = 8;
    continue;
   }
  }
  else if ((label|0) == 8) {
   label = 0;
   $19 = (($this) + 392|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$19);
   $20 = (($$4) + -1)|0;
   $21 = ($20|0)==(0);
   if ($21) {
    label = 36;
    break;
   } else {
    $$5 = $20;
    label = 9;
    continue;
   }
  }
  else if ((label|0) == 9) {
   label = 0;
   $22 = (($this) + 532|0);
   __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$22);
   $23 = (($$5) + -1)|0;
   $24 = ($23|0)==(0);
   if ($24) {
    label = 36;
    break;
   } else {
    $$6 = $23;
    label = 10;
    continue;
   }
  }
  else if ((label|0) == 10) {
   label = 0;
   $25 = (($this) + 532|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$25);
   $26 = (($$6) + -1)|0;
   $27 = ($26|0)==(0);
   if ($27) {
    label = 36;
    break;
   } else {
    $$7 = $26;
    label = 11;
    continue;
   }
  }
  else if ((label|0) == 11) {
   label = 0;
   $28 = (($this) + 532|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$28);
   $29 = (($$7) + -1)|0;
   $30 = ($29|0)==(0);
   if ($30) {
    label = 36;
    break;
   } else {
    $$8 = $29;
    label = 12;
    continue;
   }
  }
  else if ((label|0) == 12) {
   label = 0;
   $31 = (($this) + 672|0);
   __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$31);
   $32 = (($$8) + -1)|0;
   $33 = ($32|0)==(0);
   if ($33) {
    label = 36;
    break;
   } else {
    $$9 = $32;
    label = 13;
    continue;
   }
  }
  else if ((label|0) == 13) {
   label = 0;
   $34 = (($this) + 672|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$34);
   $35 = (($$9) + -1)|0;
   $36 = ($35|0)==(0);
   if ($36) {
    label = 36;
    break;
   } else {
    $$10 = $35;
    label = 14;
    continue;
   }
  }
  else if ((label|0) == 14) {
   label = 0;
   $37 = (($this) + 672|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$37);
   $38 = (($$10) + -1)|0;
   $39 = ($38|0)==(0);
   if ($39) {
    label = 36;
    break;
   } else {
    $$11 = $38;
    label = 15;
    continue;
   }
  }
  else if ((label|0) == 15) {
   label = 0;
   $40 = (($this) + 812|0);
   __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$40);
   $41 = (($$11) + -1)|0;
   $42 = ($41|0)==(0);
   if ($42) {
    label = 36;
    break;
   } else {
    $$12 = $41;
    label = 16;
    continue;
   }
  }
  else if ((label|0) == 16) {
   label = 0;
   $43 = (($this) + 812|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$43);
   $44 = (($$12) + -1)|0;
   $45 = ($44|0)==(0);
   if ($45) {
    label = 36;
    break;
   } else {
    $$13 = $44;
    label = 17;
    continue;
   }
  }
  else if ((label|0) == 17) {
   label = 0;
   $46 = (($this) + 812|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$46);
   $47 = (($$13) + -1)|0;
   $48 = ($47|0)==(0);
   if ($48) {
    label = 36;
    break;
   } else {
    $$14 = $47;
    label = 18;
    continue;
   }
  }
  else if ((label|0) == 18) {
   label = 0;
   $49 = (($this) + 952|0);
   __ZN7SPC_DSP14voice_V7_V4_V1EPNS_7voice_tE($this,$49);
   $50 = (($$14) + -1)|0;
   $51 = ($50|0)==(0);
   if ($51) {
    label = 36;
    break;
   } else {
    $$15 = $50;
    label = 19;
    continue;
   }
  }
  else if ((label|0) == 19) {
   label = 0;
   $52 = (($this) + 952|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$52);
   $53 = (($$15) + -1)|0;
   $54 = ($53|0)==(0);
   if ($54) {
    label = 36;
    break;
   } else {
    $$16 = $53;
    label = 20;
    continue;
   }
  }
  else if ((label|0) == 20) {
   label = 0;
   $55 = (($this) + 952|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$55);
   $56 = (($$16) + -1)|0;
   $57 = ($56|0)==(0);
   if ($57) {
    label = 36;
    break;
   } else {
    $$17 = $56;
    label = 21;
    continue;
   }
  }
  else if ((label|0) == 21) {
   label = 0;
   $58 = (($this) + 392|0);
   __ZN7SPC_DSP8voice_V1EPNS_7voice_tE($this,$58);
   $59 = (($this) + 1092|0);
   __ZN7SPC_DSP8voice_V7EPNS_7voice_tE($this,$59);
   $60 = (($this) + 1232|0);
   __ZN7SPC_DSP8voice_V4EPNS_7voice_tE($this,$60);
   $61 = (($$17) + -1)|0;
   $62 = ($61|0)==(0);
   if ($62) {
    label = 36;
    break;
   } else {
    $$18 = $61;
    label = 22;
    continue;
   }
  }
  else if ((label|0) == 22) {
   label = 0;
   $63 = (($this) + 1092|0);
   __ZN7SPC_DSP14voice_V8_V5_V2EPNS_7voice_tE($this,$63);
   $64 = (($$18) + -1)|0;
   $65 = ($64|0)==(0);
   if ($65) {
    label = 36;
    break;
   } else {
    $$19 = $64;
    label = 23;
    continue;
   }
  }
  else if ((label|0) == 23) {
   label = 0;
   $66 = (($this) + 1092|0);
   __ZN7SPC_DSP14voice_V9_V6_V3EPNS_7voice_tE($this,$66);
   $67 = (($$19) + -1)|0;
   $68 = ($67|0)==(0);
   if ($68) {
    label = 36;
    break;
   } else {
    $$20 = $67;
    label = 24;
    continue;
   }
  }
  else if ((label|0) == 24) {
   label = 0;
   $69 = (($this) + 532|0);
   __ZN7SPC_DSP8voice_V1EPNS_7voice_tE($this,$69);
   $70 = (($this) + 1232|0);
   __ZN7SPC_DSP8voice_V7EPNS_7voice_tE($this,$70);
   $71 = (($this) + 1372|0);
   __ZN7SPC_DSP8voice_V4EPNS_7voice_tE($this,$71);
   $72 = (($$20) + -1)|0;
   $73 = ($72|0)==(0);
   if ($73) {
    label = 36;
    break;
   } else {
    $$21 = $72;
    label = 25;
    continue;
   }
  }
  else if ((label|0) == 25) {
   label = 0;
   $74 = (($this) + 1232|0);
   __ZN7SPC_DSP8voice_V8EPNS_7voice_tE($this,$74);
   $75 = (($this) + 1372|0);
   __ZN7SPC_DSP8voice_V5EPNS_7voice_tE($this,$75);
   $76 = (($this) + 392|0);
   __ZN7SPC_DSP8voice_V2EPNS_7voice_tE($this,$76);
   $77 = (($$21) + -1)|0;
   $78 = ($77|0)==(0);
   if ($78) {
    label = 36;
    break;
   } else {
    $$22 = $77;
    label = 26;
    continue;
   }
  }
  else if ((label|0) == 26) {
   label = 0;
   $79 = (($this) + 392|0);
   __ZN7SPC_DSP9voice_V3aEPNS_7voice_tE($this,$79);
   $80 = (($this) + 1232|0);
   __ZN7SPC_DSP8voice_V9EPNS_7voice_tE($this,$80);
   __ZN7SPC_DSP8voice_V6EPNS_7voice_tE($this,0);
   __ZN7SPC_DSP7echo_22Ev($this);
   $81 = (($$22) + -1)|0;
   $82 = ($81|0)==(0);
   if ($82) {
    label = 36;
    break;
   } else {
    $$23 = $81;
    label = 27;
    continue;
   }
  }
  else if ((label|0) == 27) {
   label = 0;
   $83 = (($this) + 1372|0);
   __ZN7SPC_DSP8voice_V7EPNS_7voice_tE($this,$83);
   __ZN7SPC_DSP7echo_23Ev($this);
   $84 = (($$23) + -1)|0;
   $85 = ($84|0)==(0);
   if ($85) {
    label = 36;
    break;
   } else {
    $$24 = $84;
    label = 28;
    continue;
   }
  }
  else if ((label|0) == 28) {
   label = 0;
   $86 = (($this) + 1372|0);
   __ZN7SPC_DSP8voice_V8EPNS_7voice_tE($this,$86);
   __ZN7SPC_DSP7echo_24Ev($this);
   $87 = (($$24) + -1)|0;
   $88 = ($87|0)==(0);
   if ($88) {
    label = 36;
    break;
   } else {
    $$25 = $87;
    label = 29;
    continue;
   }
  }
  else if ((label|0) == 29) {
   label = 0;
   $89 = (($this) + 392|0);
   __ZN7SPC_DSP9voice_V3bEPNS_7voice_tE($this,$89);
   $90 = (($this) + 1372|0);
   __ZN7SPC_DSP8voice_V9EPNS_7voice_tE($this,$90);
   __ZN7SPC_DSP7echo_25Ev($this);
   $91 = (($$25) + -1)|0;
   $92 = ($91|0)==(0);
   if ($92) {
    label = 36;
    break;
   } else {
    $$26 = $91;
    label = 30;
    continue;
   }
  }
  else if ((label|0) == 30) {
   label = 0;
   __ZN7SPC_DSP7echo_26Ev($this);
   $93 = (($$26) + -1)|0;
   $94 = ($93|0)==(0);
   if ($94) {
    label = 36;
    break;
   } else {
    $$27 = $93;
    label = 31;
    continue;
   }
  }
  else if ((label|0) == 31) {
   label = 0;
   __ZN7SPC_DSP7misc_27Ev($this);
   __ZN7SPC_DSP7echo_27Ev($this);
   $95 = (($$27) + -1)|0;
   $96 = ($95|0)==(0);
   if ($96) {
    label = 36;
    break;
   } else {
    $$28 = $95;
    label = 32;
    continue;
   }
  }
  else if ((label|0) == 32) {
   label = 0;
   __ZN7SPC_DSP7misc_28Ev($this);
   __ZN7SPC_DSP7echo_28Ev($this);
   $97 = (($$28) + -1)|0;
   $98 = ($97|0)==(0);
   if ($98) {
    label = 36;
    break;
   } else {
    $$29 = $97;
    label = 33;
    continue;
   }
  }
  else if ((label|0) == 33) {
   label = 0;
   __ZN7SPC_DSP7misc_29Ev($this);
   __ZN7SPC_DSP7echo_29Ev($this);
   $99 = (($$29) + -1)|0;
   $100 = ($99|0)==(0);
   if ($100) {
    label = 36;
    break;
   } else {
    $$30 = $99;
    label = 34;
    continue;
   }
  }
  else if ((label|0) == 34) {
   label = 0;
   __ZN7SPC_DSP7misc_30Ev($this);
   $101 = (($this) + 392|0);
   __ZN7SPC_DSP9voice_V3cEPNS_7voice_tE($this,$101);
   __ZN7SPC_DSP7echo_30Ev($this);
   $102 = (($$30) + -1)|0;
   $103 = ($102|0)==(0);
   if ($103) {
    label = 36;
    break;
   } else {
    $$31 = $102;
    label = 35;
    continue;
   }
  }
  else if ((label|0) == 35) {
   label = 0;
   $104 = (($this) + 392|0);
   __ZN7SPC_DSP8voice_V4EPNS_7voice_tE($this,$104);
   $105 = (($this) + 672|0);
   __ZN7SPC_DSP8voice_V1EPNS_7voice_tE($this,$105);
   $106 = (($$31) + -1)|0;
   $107 = ($106|0)==(0);
   if ($107) {
    label = 36;
    break;
   } else {
    $$0 = $106;
    label = 4;
    continue;
   }
  }
 }
 if ((label|0) == 36) {
  STACKTOP = sp;return;
 }
}
function __ZN7SPC_DSP9voice_V3aEPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($v) + 112|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) + 3|0);
 $4 = HEAP8[$3]|0;
 $5 = $4&255;
 $6 = $5 << 8;
 $7 = $6 & 16128;
 $8 = (($this) + 352|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (($7) + ($9))|0;
 HEAP32[$8>>2] = $10;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_22Ev($this) {
 $this = $this|0;
 var $$ = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 256|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) + 8|0);
 $4 = (($this) + 192|0);
 $5 = ($3>>>0)<($4>>>0);
 $6 = (($this) + 128|0);
 $$ = $5 ? $3 : $6;
 HEAP32[$1>>2] = $$;
 $7 = (($this) + 340|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = $8 << 8;
 $10 = (($this) + 276|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($9) + ($11))|0;
 $13 = $12 & 65535;
 $14 = (($this) + 364|0);
 HEAP32[$14>>2] = $13;
 __ZN7SPC_DSP9echo_readEi($this,0);
 $15 = HEAP32[$1>>2]|0;
 $16 = (($15) + 8|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = (($this) + 15|0);
 $19 = HEAP8[$18]|0;
 $20 = $19 << 24 >> 24;
 $21 = Math_imul($20, $17)|0;
 $22 = $21 >> 6;
 $23 = (($15) + 12|0);
 $24 = HEAP32[$23>>2]|0;
 $25 = Math_imul($24, $20)|0;
 $26 = $25 >> 6;
 $27 = (($this) + 384|0);
 HEAP32[$27>>2] = $22;
 $28 = (($this) + 388|0);
 HEAP32[$28>>2] = $26;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_23Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 256|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) + 16|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($this) + 31|0);
 $6 = HEAP8[$5]|0;
 $7 = $6 << 24 >> 24;
 $8 = Math_imul($7, $4)|0;
 $9 = $8 >> 6;
 $10 = (($2) + 24|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($this) + 47|0);
 $13 = HEAP8[$12]|0;
 $14 = $13 << 24 >> 24;
 $15 = Math_imul($14, $11)|0;
 $16 = $15 >> 6;
 $17 = (($16) + ($9))|0;
 $18 = (($2) + 20|0);
 $19 = HEAP32[$18>>2]|0;
 $20 = Math_imul($19, $7)|0;
 $21 = $20 >> 6;
 $22 = (($2) + 28|0);
 $23 = HEAP32[$22>>2]|0;
 $24 = Math_imul($23, $14)|0;
 $25 = $24 >> 6;
 $26 = (($25) + ($21))|0;
 $27 = (($this) + 384|0);
 $28 = HEAP32[$27>>2]|0;
 $29 = (($17) + ($28))|0;
 HEAP32[$27>>2] = $29;
 $30 = (($this) + 388|0);
 $31 = HEAP32[$30>>2]|0;
 $32 = (($26) + ($31))|0;
 HEAP32[$30>>2] = $32;
 __ZN7SPC_DSP9echo_readEi($this,1);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_24Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 256|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) + 32|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($this) + 63|0);
 $6 = HEAP8[$5]|0;
 $7 = $6 << 24 >> 24;
 $8 = Math_imul($7, $4)|0;
 $9 = $8 >> 6;
 $10 = (($2) + 40|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($this) + 79|0);
 $13 = HEAP8[$12]|0;
 $14 = $13 << 24 >> 24;
 $15 = Math_imul($14, $11)|0;
 $16 = $15 >> 6;
 $17 = (($16) + ($9))|0;
 $18 = (($2) + 48|0);
 $19 = HEAP32[$18>>2]|0;
 $20 = (($this) + 95|0);
 $21 = HEAP8[$20]|0;
 $22 = $21 << 24 >> 24;
 $23 = Math_imul($22, $19)|0;
 $24 = $23 >> 6;
 $25 = (($17) + ($24))|0;
 $26 = (($2) + 36|0);
 $27 = HEAP32[$26>>2]|0;
 $28 = Math_imul($27, $7)|0;
 $29 = $28 >> 6;
 $30 = (($2) + 44|0);
 $31 = HEAP32[$30>>2]|0;
 $32 = Math_imul($31, $14)|0;
 $33 = $32 >> 6;
 $34 = (($33) + ($29))|0;
 $35 = (($2) + 52|0);
 $36 = HEAP32[$35>>2]|0;
 $37 = Math_imul($36, $22)|0;
 $38 = $37 >> 6;
 $39 = (($34) + ($38))|0;
 $40 = (($this) + 384|0);
 $41 = HEAP32[$40>>2]|0;
 $42 = (($25) + ($41))|0;
 HEAP32[$40>>2] = $42;
 $43 = (($this) + 388|0);
 $44 = HEAP32[$43>>2]|0;
 $45 = (($39) + ($44))|0;
 HEAP32[$43>>2] = $45;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP9voice_V3bEPNS_7voice_tE($this,$v) {
 $this = $this|0;
 $v = $v|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($v) + 104|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($v) + 108|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + ($2))|0;
 $6 = $5 & 65535;
 $7 = (($this) + 1512|0);
 $8 = HEAP32[$7>>2]|0;
 $9 = (($8) + ($6)|0);
 $10 = HEAP8[$9]|0;
 $11 = $10&255;
 $12 = (($this) + 332|0);
 HEAP32[$12>>2] = $11;
 $13 = HEAP32[$1>>2]|0;
 $14 = HEAP32[$7>>2]|0;
 $15 = (($14) + ($13)|0);
 $16 = HEAP8[$15]|0;
 $17 = $16&255;
 $18 = (($this) + 328|0);
 HEAP32[$18>>2] = $17;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_25Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $l$0 = 0, $r$0 = 0, $sext = 0, $sext1 = 0, $sext4 = 0, $sext5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 384|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($this) + 256|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + 56|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($this) + 111|0);
 $8 = HEAP8[$7]|0;
 $9 = $8 << 24 >> 24;
 $10 = Math_imul($9, $6)|0;
 $11 = $10 >>> 6;
 $12 = (($11) + ($2))|0;
 $13 = (($this) + 388|0);
 $14 = HEAP32[$13>>2]|0;
 $15 = (($4) + 60|0);
 $16 = HEAP32[$15>>2]|0;
 $17 = Math_imul($16, $9)|0;
 $18 = $17 >>> 6;
 $19 = (($18) + ($14))|0;
 $sext = $12 << 16;
 $20 = $sext >> 16;
 $sext1 = $19 << 16;
 $21 = $sext1 >> 16;
 $22 = (($4) + 64|0);
 $23 = HEAP32[$22>>2]|0;
 $24 = (($this) + 127|0);
 $25 = HEAP8[$24]|0;
 $26 = $25 << 24 >> 24;
 $27 = $23 << 10;
 $28 = Math_imul($27, $26)|0;
 $29 = $28 >> 16;
 $30 = (($29) + ($20))|0;
 $31 = (($4) + 68|0);
 $32 = HEAP32[$31>>2]|0;
 $33 = $26 << 10;
 $34 = Math_imul($33, $32)|0;
 $35 = $34 >> 16;
 $36 = (($35) + ($21))|0;
 $sext4 = $30 << 16;
 $37 = $sext4 >> 16;
 $38 = ($37|0)==($30|0);
 if ($38) {
  $l$0 = $30;
 } else {
  $39 = $30 >> 31;
  $40 = $39 ^ 32767;
  $l$0 = $40;
 }
 $sext5 = $36 << 16;
 $41 = $sext5 >> 16;
 $42 = ($41|0)==($36|0);
 if ($42) {
  $r$0 = $36;
  $45 = $l$0 & -2;
  HEAP32[$1>>2] = $45;
  $46 = $r$0 & -2;
  HEAP32[$13>>2] = $46;
  STACKTOP = sp;return;
 }
 $43 = $36 >> 31;
 $44 = $43 ^ 32767;
 $r$0 = $44;
 $45 = $l$0 & -2;
 HEAP32[$1>>2] = $45;
 $46 = $r$0 & -2;
 HEAP32[$13>>2] = $46;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_26Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $l$0 = 0, $r$0 = 0, $sext = 0, $sext1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZN7SPC_DSP11echo_outputEi($this,0)|0);
 $2 = (($this) + 368|0);
 HEAP32[$2>>2] = $1;
 $3 = (($this) + 376|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($this) + 384|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($this) + 13|0);
 $8 = HEAP8[$7]|0;
 $9 = $8 << 24 >> 24;
 $10 = $6 << 9;
 $11 = Math_imul($10, $9)|0;
 $12 = $11 >> 16;
 $13 = (($12) + ($4))|0;
 $14 = (($this) + 380|0);
 $15 = HEAP32[$14>>2]|0;
 $16 = (($this) + 388|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = $9 << 9;
 $19 = Math_imul($18, $17)|0;
 $20 = $19 >> 16;
 $21 = (($20) + ($15))|0;
 $sext = $13 << 16;
 $22 = $sext >> 16;
 $23 = ($22|0)==($13|0);
 if ($23) {
  $l$0 = $13;
 } else {
  $24 = $13 >> 31;
  $25 = $24 ^ 32767;
  $l$0 = $25;
 }
 $sext1 = $21 << 16;
 $26 = $sext1 >> 16;
 $27 = ($26|0)==($21|0);
 if ($27) {
  $r$0 = $21;
  $30 = $l$0 & -2;
  HEAP32[$3>>2] = $30;
  $31 = $r$0 & -2;
  HEAP32[$14>>2] = $31;
  STACKTOP = sp;return;
 }
 $28 = $21 >> 31;
 $29 = $28 ^ 32767;
 $r$0 = $29;
 $30 = $l$0 & -2;
 HEAP32[$3>>2] = $30;
 $31 = $r$0 & -2;
 HEAP32[$14>>2] = $31;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7misc_27Ev($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 45|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = $3 & 254;
 $5 = (($this) + 300|0);
 HEAP32[$5>>2] = $4;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_27Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0;
 var $9 = 0, $out$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 368|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (__ZN7SPC_DSP11echo_outputEi($this,1)|0);
 HEAP32[$1>>2] = 0;
 $4 = (($this) + 372|0);
 HEAP32[$4>>2] = 0;
 $5 = (($this) + 108|0);
 $6 = HEAP8[$5]|0;
 $7 = $6 & 64;
 $8 = ($7<<24>>24)==(0);
 $9 = (($this) + 1520|0);
 $10 = HEAP32[$9>>2]|0;
 $11 = $2&65535;
 $12 = $8 ? $11 : 0;
 HEAP16[$10>>1] = $12;
 $13 = $3&65535;
 $14 = $8 ? $13 : 0;
 $15 = (($10) + 2|0);
 HEAP16[$15>>1] = $14;
 $16 = (($10) + 4|0);
 $17 = (($this) + 1524|0);
 $18 = HEAP32[$17>>2]|0;
 $19 = ($16>>>0)<($18>>>0);
 if ($19) {
  $out$0 = $16;
  HEAP32[$9>>2] = $out$0;
  STACKTOP = sp;return;
 }
 $20 = (($this) + 1532|0);
 $21 = (($this) + 1564|0);
 HEAP32[$17>>2] = $21;
 $out$0 = $20;
 HEAP32[$9>>2] = $out$0;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7misc_28Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 61|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = (($this) + 304|0);
 HEAP32[$4>>2] = $3;
 $5 = (($this) + 77|0);
 $6 = HEAP8[$5]|0;
 $7 = $6&255;
 $8 = (($this) + 308|0);
 HEAP32[$8>>2] = $7;
 $9 = (($this) + 93|0);
 $10 = HEAP8[$9]|0;
 $11 = $10&255;
 $12 = (($this) + 312|0);
 HEAP32[$12>>2] = $11;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_28Ev($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 108|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = (($this) + 344|0);
 HEAP32[$4>>2] = $3;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7misc_29Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 260|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 ^ 1;
 HEAP32[$1>>2] = $3;
 $4 = ($2|0)==(1);
 if ($4) {
  STACKTOP = sp;return;
 }
 $5 = (($this) + 264|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = $6 ^ -1;
 $8 = (($this) + 292|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = $9 & $7;
 HEAP32[$8>>2] = $10;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_29Ev($this) {
 $this = $this|0;
 var $$ = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0;
 var $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 109|0);
 $2 = HEAP8[$1]|0;
 $3 = $2&255;
 $4 = (($this) + 340|0);
 HEAP32[$4>>2] = $3;
 $5 = (($this) + 276|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($6|0)==(0);
 if ($7) {
  $8 = (($this) + 125|0);
  $9 = HEAP8[$8]|0;
  $10 = $9&255;
  $11 = $10 << 11;
  $12 = $11 & 30720;
  $13 = (($this) + 280|0);
  HEAP32[$13>>2] = $12;
 }
 $14 = HEAP32[$5>>2]|0;
 $15 = (($14) + 4)|0;
 $16 = (($this) + 280|0);
 $17 = HEAP32[$16>>2]|0;
 $18 = ($15|0)<($17|0);
 $$ = $18 ? $15 : 0;
 HEAP32[$5>>2] = $$;
 __ZN7SPC_DSP10echo_writeEi($this,0);
 $19 = (($this) + 108|0);
 $20 = HEAP8[$19]|0;
 $21 = $20&255;
 $22 = (($this) + 344|0);
 HEAP32[$22>>2] = $21;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7misc_30Ev($this) {
 $this = $this|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 260|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)==(0);
 if (!($3)) {
  $4 = (($this) + 292|0);
  $5 = HEAP32[$4>>2]|0;
  $6 = (($this) + 264|0);
  HEAP32[$6>>2] = $5;
  $7 = (($this) + 92|0);
  $8 = HEAP8[$7]|0;
  $9 = $8&255;
  $10 = (($this) + 1516|0);
  $11 = HEAP32[$10>>2]|0;
  $12 = $9 | $11;
  $13 = (($this) + 316|0);
  HEAP32[$13>>2] = $12;
 }
 __ZN7SPC_DSP12run_countersEv($this);
 $14 = (($this) + 108|0);
 $15 = HEAP8[$14]|0;
 $16 = $15&255;
 $17 = $16 & 31;
 $18 = (__ZN7SPC_DSP12read_counterEi($this,$17)|0);
 $19 = ($18|0)==(0);
 if (!($19)) {
  STACKTOP = sp;return;
 }
 $20 = (($this) + 268|0);
 $21 = HEAP32[$20>>2]|0;
 $22 = $21 << 13;
 $23 = $21 << 14;
 $24 = $22 ^ $23;
 $25 = $24 & 16384;
 $26 = $21 >> 1;
 $27 = $25 ^ $26;
 HEAP32[$20>>2] = $27;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP7echo_30Ev($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP10echo_writeEi($this,1);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP4initEPv($this,$ram_64k) {
 $this = $this|0;
 $ram_64k = $ram_64k|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1512|0);
 HEAP32[$1>>2] = $ram_64k;
 __ZN7SPC_DSP11mute_voicesEi($this,0);
 __ZN7SPC_DSP10set_outputEPsi($this,0,0);
 __ZN7SPC_DSP5resetEv($this);
 __Z24blargg_verify_byte_orderv();
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP11mute_voicesEi($this,$mask) {
 $this = $this|0;
 $mask = $mask|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1516|0);
 HEAP32[$1>>2] = $mask;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP5resetEv($this) {
 $this = $this|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN7SPC_DSP4loadEPKh($this,(1040));
 STACKTOP = sp;return;
}
function __Z24blargg_verify_byte_orderv() {
 var $1 = 0, $2 = 0, $3 = 0, $i = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 8|0;
 $i = sp;
 HEAP32[$i>>2] = 1;
 $1 = $i;
 $2 = HEAP8[$1]|0;
 $3 = ($2<<24>>24)==(0);
 if ($3) {
  ___assert_fail(((1168)|0),((1200)|0),63,((1240)|0));
  // unreachable;
 } else {
  STACKTOP = sp;return;
 }
}
function __ZN7SPC_DSP17soft_reset_commonEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 1512|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ($2|0)==(0|0);
 if ($3) {
  ___assert_fail(((1008)|0),((880)|0),836,((1016)|0));
  // unreachable;
 } else {
  $4 = (($this) + 268|0);
  HEAP32[$4>>2] = 16384;
  $5 = (($this) + 128|0);
  $6 = (($this) + 256|0);
  HEAP32[$6>>2] = $5;
  $7 = (($this) + 260|0);
  HEAP32[$7>>2] = 1;
  $8 = (($this) + 276|0);
  HEAP32[$8>>2] = 0;
  $9 = (($this) + 284|0);
  HEAP32[$9>>2] = 0;
  __ZN7SPC_DSP12init_counterEv($this);
  STACKTOP = sp;return;
 }
}
function __ZN7SPC_DSP12init_counterEv($this) {
 $this = $this|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 272|0);
 HEAP32[$1>>2] = 0;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP4loadEPKh($this,$regs) {
 $this = $this|0;
 $regs = $regs|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0;
 var $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0;
 var $46 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, dest = 0, label = 0, sp = 0, src = 0, stop = 0;
 sp = STACKTOP;
 $1 = ($this);
 dest=$1+0|0; src=$regs+0|0; stop=dest+128|0; do { HEAP8[dest]=HEAP8[src]|0; dest=dest+1|0; src=src+1|0; } while ((dest|0) < (stop|0));;
 $2 = (($this) + 128|0);
 _memset(($2|0),0,1384)|0;
 $3 = (($this) + 1480|0);
 HEAP32[$3>>2] = 1;
 $4 = (($this) + 1488|0);
 HEAP32[$4>>2] = 128;
 $5 = (($this) + 112|0);
 $6 = (($this) + 1484|0);
 HEAP32[$6>>2] = $5;
 $7 = (($this) + 1340|0);
 HEAP32[$7>>2] = 1;
 $8 = (($this) + 1348|0);
 HEAP32[$8>>2] = 64;
 $9 = (($this) + 96|0);
 $10 = (($this) + 1344|0);
 HEAP32[$10>>2] = $9;
 $11 = (($this) + 1200|0);
 HEAP32[$11>>2] = 1;
 $12 = (($this) + 1208|0);
 HEAP32[$12>>2] = 32;
 $13 = (($this) + 80|0);
 $14 = (($this) + 1204|0);
 HEAP32[$14>>2] = $13;
 $15 = (($this) + 1060|0);
 HEAP32[$15>>2] = 1;
 $16 = (($this) + 1068|0);
 HEAP32[$16>>2] = 16;
 $17 = (($this) + 64|0);
 $18 = (($this) + 1064|0);
 HEAP32[$18>>2] = $17;
 $19 = (($this) + 920|0);
 HEAP32[$19>>2] = 1;
 $20 = (($this) + 928|0);
 HEAP32[$20>>2] = 8;
 $21 = (($this) + 48|0);
 $22 = (($this) + 924|0);
 HEAP32[$22>>2] = $21;
 $23 = (($this) + 780|0);
 HEAP32[$23>>2] = 1;
 $24 = (($this) + 788|0);
 HEAP32[$24>>2] = 4;
 $25 = (($this) + 32|0);
 $26 = (($this) + 784|0);
 HEAP32[$26>>2] = $25;
 $27 = (($this) + 640|0);
 HEAP32[$27>>2] = 1;
 $28 = (($this) + 648|0);
 HEAP32[$28>>2] = 2;
 $29 = (($this) + 16|0);
 $30 = (($this) + 644|0);
 HEAP32[$30>>2] = $29;
 $31 = (($this) + 500|0);
 HEAP32[$31>>2] = 1;
 $32 = (($this) + 508|0);
 HEAP32[$32>>2] = 1;
 $33 = ($this);
 $34 = (($this) + 504|0);
 HEAP32[$34>>2] = $33;
 $35 = (($this) + 76|0);
 $36 = HEAP8[$35]|0;
 $37 = $36&255;
 $38 = (($this) + 292|0);
 HEAP32[$38>>2] = $37;
 $39 = (($this) + 93|0);
 $40 = HEAP8[$39]|0;
 $41 = $40&255;
 $42 = (($this) + 312|0);
 HEAP32[$42>>2] = $41;
 $43 = (($this) + 109|0);
 $44 = HEAP8[$43]|0;
 $45 = $44&255;
 $46 = (($this) + 340|0);
 HEAP32[$46>>2] = $45;
 __ZN7SPC_DSP17soft_reset_commonEv($this);
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP10echo_writeEi($this,$ch) {
 $this = $this|0;
 $ch = $ch|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 344|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $2 & 32;
 $4 = ($3|0)==(0);
 if ($4) {
  $5 = (($this) + 364|0);
  $6 = HEAP32[$5>>2]|0;
  $7 = $ch << 1;
  $8 = (($6) + ($7))|0;
  $9 = (($this) + 1512|0);
  $10 = HEAP32[$9>>2]|0;
  $11 = (($10) + ($8)|0);
  $12 = ((($this) + ($ch<<2)|0) + 376|0);
  $13 = HEAP32[$12>>2]|0;
  __Z8set_le16Pvj($11,$13);
 }
 $14 = ((($this) + ($ch<<2)|0) + 376|0);
 HEAP32[$14>>2] = 0;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP12run_countersEv($this) {
 $this = $this|0;
 var $$ = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 272|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = (($2) + -1)|0;
 $4 = ($2|0)<(1);
 $$ = $4 ? 30719 : $3;
 HEAP32[$1>>2] = $$;
 STACKTOP = sp;return;
}
function __ZN7SPC_DSP12read_counterEi($this,$rate) {
 $this = $this|0;
 $rate = $rate|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 272|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = ((1272) + ($rate<<2)|0);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($4) + ($2))|0;
 $6 = ((1400) + ($rate<<2)|0);
 $7 = HEAP32[$6>>2]|0;
 $8 = (($5>>>0) % ($7>>>0))&-1;
 STACKTOP = sp;return ($8|0);
}
function __ZN7SPC_DSP11echo_outputEi($this,$ch) {
 $this = $this|0;
 $ch = $ch|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $3 = 0, $4 = 0, $5 = 0;
 var $6 = 0, $7 = 0, $8 = 0, $9 = 0, $out$0 = 0, $sext = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ((($this) + ($ch<<2)|0) + 368|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $ch << 4;
 $4 = $3 | 12;
 $5 = (($this) + ($4)|0);
 $6 = HEAP8[$5]|0;
 $7 = $6 << 24 >> 24;
 $8 = $2 << 9;
 $9 = Math_imul($8, $7)|0;
 $10 = $9 >> 16;
 $11 = ((($this) + ($ch<<2)|0) + 384|0);
 $12 = HEAP32[$11>>2]|0;
 $13 = (($3) + 44)|0;
 $14 = (($this) + ($13)|0);
 $15 = HEAP8[$14]|0;
 $16 = $15 << 24 >> 24;
 $17 = $12 << 9;
 $18 = Math_imul($17, $16)|0;
 $19 = $18 >> 16;
 $20 = (($19) + ($10))|0;
 $sext = $20 << 16;
 $21 = $sext >> 16;
 $22 = ($21|0)==($20|0);
 if ($22) {
  $out$0 = $20;
  STACKTOP = sp;return ($out$0|0);
 }
 $23 = $20 >> 31;
 $24 = $23 ^ 32767;
 $out$0 = $24;
 STACKTOP = sp;return ($out$0|0);
}
function __ZN7SPC_DSP9echo_readEi($this,$ch) {
 $this = $this|0;
 $ch = $ch|0;
 var $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $sext = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 364|0);
 $2 = HEAP32[$1>>2]|0;
 $3 = $ch << 1;
 $4 = (($2) + ($3))|0;
 $5 = (($this) + 1512|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = (($6) + ($4)|0);
 $8 = (__Z8get_le16PKv($7)|0);
 $sext = $8 << 16;
 $9 = $sext >> 17;
 $10 = (($this) + 256|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = ((($11) + ($ch<<2)|0) + 64|0);
 HEAP32[$12>>2] = $9;
 $13 = HEAP32[$10>>2]|0;
 $14 = (($13) + ($ch<<2)|0);
 HEAP32[$14>>2] = $9;
 STACKTOP = sp;return;
}
function __ZN10SPC_Filter5clearEv($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (($this) + 8|0);
 $2 = $1;
 ;HEAP32[$2+0>>2]=0|0;HEAP32[$2+4>>2]=0|0;HEAP32[$2+8>>2]=0|0;HEAP32[$2+12>>2]=0|0;HEAP32[$2+16>>2]=0|0;HEAP32[$2+20>>2]=0|0;
 STACKTOP = sp;return;
}
function __ZN10SPC_FilterC2Ev($this) {
 $this = $this|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($this);
 HEAP32[$1>>2] = 256;
 $2 = (($this) + 4|0);
 HEAP32[$2>>2] = 8;
 __ZN10SPC_Filter5clearEv($this);
 STACKTOP = sp;return;
}
function __ZN10SPC_Filter3runEPsi($this,$io,$count) {
 $this = $this|0;
 $io = $io|0;
 $count = $count|0;
 var $$sum9 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $2 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0;
 var $27 = 0, $28 = 0, $29 = 0, $3 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0;
 var $45 = 0, $46 = 0, $47 = 0, $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $i$04 = 0, $i$04$1 = 0, $p1$0$lcssa = 0, $p1$0$lcssa$1 = 0;
 var $p1$03 = 0, $p1$03$1 = 0, $p1$03$1$phi = 0, $p1$03$phi = 0, $pp1$0$lcssa = 0, $pp1$0$lcssa$1 = 0, $pp1$02 = 0, $pp1$02$1 = 0, $pp1$02$1$phi = 0, $pp1$02$phi = 0, $s$0 = 0, $s$0$1 = 0, $sext = 0, $sext$1 = 0, $sum$0$lcssa = 0, $sum$0$lcssa$1 = 0, $sum$01 = 0, $sum$01$1 = 0, $sum$01$1$phi = 0, $sum$01$phi = 0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 $1 = $count & 1;
 $2 = ($1|0)==(0);
 if (!($2)) {
  ___assert_fail(((2552)|0),((2576)|0),31,((2608)|0));
  // unreachable;
 }
 $3 = ($this);
 $4 = HEAP32[$3>>2]|0;
 $5 = (($this) + 4|0);
 $6 = HEAP32[$5>>2]|0;
 $7 = ($count|0)>(0);
 $8 = (($this) + 28|0);
 $9 = HEAP32[$8>>2]|0;
 $10 = (($this) + 24|0);
 $11 = HEAP32[$10>>2]|0;
 $12 = (($this) + 20|0);
 $13 = HEAP32[$12>>2]|0;
 if ($7) {
  $i$04 = 0;$p1$03 = $13;$pp1$02 = $11;$sum$01 = $9;
  while(1) {
   $14 = (($io) + ($i$04<<1)|0);
   $15 = HEAP16[$14>>1]|0;
   $16 = $15 << 16 >> 16;
   $17 = (($16) + ($p1$03))|0;
   $18 = ($16*3)|0;
   $19 = (($17) - ($pp1$02))|0;
   $20 = $sum$01 >> 10;
   $21 = Math_imul($19, $4)|0;
   $22 = $sum$01 >> $6;
   $23 = (($sum$01) - ($22))|0;
   $24 = (($23) + ($21))|0;
   $sext = $20 << 16;
   $25 = $sext >> 16;
   $26 = ($25|0)==($20|0);
   if ($26) {
    $s$0 = $20;
   } else {
    $27 = $sum$01 >> 31;
    $28 = $27 ^ 32767;
    $s$0 = $28;
   }
   $29 = $s$0&65535;
   HEAP16[$14>>1] = $29;
   $30 = (($i$04) + 2)|0;
   $31 = ($30|0)<($count|0);
   if ($31) {
    $sum$01$phi = $24;$pp1$02$phi = $17;$p1$03$phi = $18;$i$04 = $30;$sum$01 = $sum$01$phi;$pp1$02 = $pp1$02$phi;$p1$03 = $p1$03$phi;
   } else {
    $p1$0$lcssa = $18;$pp1$0$lcssa = $17;$sum$0$lcssa = $24;
    break;
   }
  }
 } else {
  $p1$0$lcssa = $13;$pp1$0$lcssa = $11;$sum$0$lcssa = $9;
 }
 HEAP32[$12>>2] = $p1$0$lcssa;
 HEAP32[$10>>2] = $pp1$0$lcssa;
 HEAP32[$8>>2] = $sum$0$lcssa;
 $32 = (($this) + 16|0);
 $33 = HEAP32[$32>>2]|0;
 $34 = (($this) + 12|0);
 $35 = HEAP32[$34>>2]|0;
 $36 = (($this) + 8|0);
 $37 = HEAP32[$36>>2]|0;
 if ($7) {
  $i$04$1 = 0;$p1$03$1 = $37;$pp1$02$1 = $35;$sum$01$1 = $33;
 } else {
  $p1$0$lcssa$1 = $37;$pp1$0$lcssa$1 = $35;$sum$0$lcssa$1 = $33;
  HEAP32[$36>>2] = $p1$0$lcssa$1;
  HEAP32[$34>>2] = $pp1$0$lcssa$1;
  HEAP32[$32>>2] = $sum$0$lcssa$1;
  STACKTOP = sp;return;
 }
 while(1) {
  $$sum9 = $i$04$1 | 1;
  $38 = (($io) + ($$sum9<<1)|0);
  $39 = HEAP16[$38>>1]|0;
  $40 = $39 << 16 >> 16;
  $41 = (($40) + ($p1$03$1))|0;
  $42 = ($40*3)|0;
  $43 = (($41) - ($pp1$02$1))|0;
  $44 = $sum$01$1 >> 10;
  $45 = Math_imul($43, $4)|0;
  $46 = $sum$01$1 >> $6;
  $47 = (($sum$01$1) - ($46))|0;
  $48 = (($47) + ($45))|0;
  $sext$1 = $44 << 16;
  $49 = $sext$1 >> 16;
  $50 = ($49|0)==($44|0);
  if ($50) {
   $s$0$1 = $44;
  } else {
   $51 = $sum$01$1 >> 31;
   $52 = $51 ^ 32767;
   $s$0$1 = $52;
  }
  $53 = $s$0$1&65535;
  HEAP16[$38>>1] = $53;
  $54 = (($i$04$1) + 2)|0;
  $55 = ($54|0)<($count|0);
  if ($55) {
   $sum$01$1$phi = $48;$pp1$02$1$phi = $41;$p1$03$1$phi = $42;$i$04$1 = $54;$sum$01$1 = $sum$01$1$phi;$pp1$02$1 = $pp1$02$1$phi;$p1$03$1 = $p1$03$1$phi;
  } else {
   $p1$0$lcssa$1 = $42;$pp1$0$lcssa$1 = $41;$sum$0$lcssa$1 = $48;
   break;
  }
 }
 HEAP32[$36>>2] = $p1$0$lcssa$1;
 HEAP32[$34>>2] = $pp1$0$lcssa$1;
 HEAP32[$32>>2] = $sum$0$lcssa$1;
 STACKTOP = sp;return;
}
function _spc_new() {
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $s$0 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZN8SNES_SPCnwEj(68204)|0);
 $2 = ($1|0)==(0|0);
 do {
  if ($2) {
   $s$0 = 0;
  } else {
   $3 = $1;
   $4 = (__ZN8SNES_SPC4initEv($3)|0);
   $5 = ($4|0)==(0|0);
   if ($5) {
    $s$0 = $3;
    break;
   }
   __ZN8SNES_SPCdlEPv($1);
   $s$0 = 0;
  }
 } while(0);
 STACKTOP = sp;return ($s$0|0);
}
function __ZN8SNES_SPCnwEj($s) {
 $s = $s|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (_malloc($s)|0);
 STACKTOP = sp;return ($1|0);
}
function __ZN8SNES_SPCdlEPv($p) {
 $p = $p|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _free($p);
 STACKTOP = sp;return;
}
function _spc_delete($s) {
 $s = $s|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($s|0)==(0|0);
 if (!($1)) {
  $2 = ($s);
  __ZN8SNES_SPCdlEPv($2);
 }
 STACKTOP = sp;return;
}
function _spc_load_spc($s,$p,$n) {
 $s = $s|0;
 $p = $p|0;
 $n = $n|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZN8SNES_SPC8load_spcEPKvl($s,$p,$n)|0);
 STACKTOP = sp;return ($1|0);
}
function _spc_clear_echo($s) {
 $s = $s|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN8SNES_SPC10clear_echoEv($s);
 STACKTOP = sp;return;
}
function _spc_play($s,$count,$out) {
 $s = $s|0;
 $count = $count|0;
 $out = $out|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZN8SNES_SPC4playEiPs($s,$count,$out)|0);
 STACKTOP = sp;return ($1|0);
}
function _spc_filter_new() {
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (__ZN10SPC_FilternwEj(32)|0);
 $2 = ($1|0)==(0|0);
 if ($2) {
  $4 = 0;
 } else {
  $3 = $1;
  __ZN10SPC_FilterC2Ev($3);
  $4 = $3;
 }
 STACKTOP = sp;return ($4|0);
}
function __ZN10SPC_FilternwEj($s) {
 $s = $s|0;
 var $1 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = (_malloc($s)|0);
 STACKTOP = sp;return ($1|0);
}
function __ZN10SPC_FilterdlEPv($p) {
 $p = $p|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 _free($p);
 STACKTOP = sp;return;
}
function _spc_filter_delete($f) {
 $f = $f|0;
 var $1 = 0, $2 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($f|0)==(0|0);
 if (!($1)) {
  $2 = $f;
  __ZN10SPC_FilterdlEPv($2);
 }
 STACKTOP = sp;return;
}
function _spc_filter_run($f,$p,$s) {
 $f = $f|0;
 $p = $p|0;
 $s = $s|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10SPC_Filter3runEPsi($f,$p,$s);
 STACKTOP = sp;return;
}
function _spc_filter_clear($f) {
 $f = $f|0;
 var label = 0, sp = 0;
 sp = STACKTOP;
 __ZN10SPC_Filter5clearEv($f);
 STACKTOP = sp;return;
}
function _error($str) {
 $str = $str|0;
 var $1 = 0, $vararg_buffer = 0, $vararg_lifetime_bitcast = 0, $vararg_ptr = 0, label = 0, sp = 0;
 sp = STACKTOP;
 STACKTOP = STACKTOP + 8|0;
 $vararg_buffer = sp;
 $vararg_lifetime_bitcast = $vararg_buffer;
 $1 = ($str|0)==(0|0);
 if ($1) {
  STACKTOP = sp;return;
 }
 $vararg_ptr = ($vararg_buffer);
 HEAP32[$vararg_ptr>>2] = $str;
 (_printf(((2616)|0),($vararg_buffer|0))|0);
 STACKTOP = sp;return;
}
function _SpcJsDestroy() {
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[(2632)>>2]|0;
 $2 = ($1|0)==(0|0);
 if (!($2)) {
  _spc_filter_delete($1);
 }
 $3 = HEAP32[(2640)>>2]|0;
 $4 = ($3|0)==(0|0);
 if ($4) {
  STACKTOP = sp;return;
 }
 _spc_delete($3);
 STACKTOP = sp;return;
}
function _SpcJsInit($spc,$spc_size) {
 $spc = $spc|0;
 $spc_size = $spc_size|0;
 var $1 = 0, $10 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[(2640)>>2]|0;
 $2 = ($1|0)==(0|0);
 if ($2) {
  $3 = (_spc_new()|0);
  HEAP32[(2640)>>2] = $3;
 }
 $4 = HEAP32[(2632)>>2]|0;
 $5 = ($4|0)==(0|0);
 if ($5) {
  $6 = (_spc_filter_new()|0);
  HEAP32[(2632)>>2] = $6;
 }
 $7 = HEAP32[(2640)>>2]|0;
 $8 = (_spc_load_spc($7,$spc,$spc_size)|0);
 _error($8);
 _free($spc);
 $9 = HEAP32[(2640)>>2]|0;
 _spc_clear_echo($9);
 $10 = HEAP32[(2632)>>2]|0;
 _spc_filter_clear($10);
 HEAP32[(2648)>>2] = 0;
 STACKTOP = sp;return;
}
function _SpcJsDecodeAudio($outbuf,$buf_size) {
 $outbuf = $outbuf|0;
 $buf_size = $buf_size|0;
 var $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = HEAP32[(2640)>>2]|0;
 $2 = (_spc_play($1,$buf_size,$outbuf)|0);
 _error($2);
 $3 = HEAP32[(2632)>>2]|0;
 _spc_filter_run($3,$outbuf,$buf_size);
 $4 = HEAP32[(2648)>>2]|0;
 $5 = (($4) + ($buf_size))|0;
 HEAP32[(2648)>>2] = $5;
 STACKTOP = sp;return ($5|0);
}
function _malloc($bytes) {
 $bytes = $bytes|0;
 var $$$i = 0, $$3$i = 0, $$4$i = 0, $$c$i$i = 0, $$c6$i$i = 0, $$pre = 0, $$pre$i = 0, $$pre$i$i = 0, $$pre$i25 = 0, $$pre$i25$i = 0, $$pre$phi$i$iZ2D = 0, $$pre$phi$i26$iZ2D = 0, $$pre$phi$i26Z2D = 0, $$pre$phi$iZ2D = 0, $$pre$phi58$i$iZ2D = 0, $$pre$phiZ2D = 0, $$pre57$i$i = 0, $$rsize$0$i = 0, $$rsize$3$i = 0, $$sum = 0;
 var $$sum$i$i = 0, $$sum$i$i$i = 0, $$sum$i14$i = 0, $$sum$i15$i = 0, $$sum$i18$i = 0, $$sum$i21$i = 0, $$sum$i2334 = 0, $$sum$i32 = 0, $$sum$i35 = 0, $$sum1 = 0, $$sum1$i = 0, $$sum1$i$i = 0, $$sum1$i16$i = 0, $$sum1$i22$i = 0, $$sum1$i24 = 0, $$sum10 = 0, $$sum10$i = 0, $$sum10$i$i = 0, $$sum10$pre$i$i = 0, $$sum107$i = 0;
 var $$sum108$i = 0, $$sum109$i = 0, $$sum11$i = 0, $$sum11$i$i = 0, $$sum11$i24$i = 0, $$sum110$i = 0, $$sum111$i = 0, $$sum1112 = 0, $$sum112$i = 0, $$sum113$i = 0, $$sum114$i = 0, $$sum115$i = 0, $$sum116$i = 0, $$sum117$i = 0, $$sum118$i = 0, $$sum119$i = 0, $$sum12$i = 0, $$sum12$i$i = 0, $$sum120$i = 0, $$sum13$i = 0;
 var $$sum13$i$i = 0, $$sum14$i$i = 0, $$sum14$pre$i = 0, $$sum15$i = 0, $$sum15$i$i = 0, $$sum16$i = 0, $$sum16$i$i = 0, $$sum17$i = 0, $$sum17$i$i = 0, $$sum18$i = 0, $$sum1819$i$i = 0, $$sum2 = 0, $$sum2$i = 0, $$sum2$i$i = 0, $$sum2$i$i$i = 0, $$sum2$i17$i = 0, $$sum2$i19$i = 0, $$sum2$i23$i = 0, $$sum2$pre$i = 0, $$sum20$i$i = 0;
 var $$sum21$i$i = 0, $$sum22$i$i = 0, $$sum23$i$i = 0, $$sum24$i$i = 0, $$sum25$i$i = 0, $$sum26$pre$i$i = 0, $$sum27$i$i = 0, $$sum28$i$i = 0, $$sum29$i$i = 0, $$sum3$i = 0, $$sum3$i$i = 0, $$sum3$i27 = 0, $$sum30$i$i = 0, $$sum3132$i$i = 0, $$sum34$i$i = 0, $$sum3536$i$i = 0, $$sum3738$i$i = 0, $$sum39$i$i = 0, $$sum4 = 0, $$sum4$i = 0;
 var $$sum4$i28 = 0, $$sum40$i$i = 0, $$sum41$i$i = 0, $$sum42$i$i = 0, $$sum5$i = 0, $$sum5$i$i = 0, $$sum56 = 0, $$sum6$i = 0, $$sum67$i$i = 0, $$sum7$i = 0, $$sum8$i = 0, $$sum8$pre = 0, $$sum9 = 0, $$sum9$i = 0, $$sum9$i$i = 0, $$tsize$1$i = 0, $$v$0$i = 0, $1 = 0, $10 = 0, $100 = 0;
 var $1000 = 0, $1001 = 0, $1002 = 0, $1003 = 0, $1004 = 0, $1005 = 0, $1006 = 0, $1007 = 0, $1008 = 0, $1009 = 0, $101 = 0, $1010 = 0, $1011 = 0, $1012 = 0, $1013 = 0, $1014 = 0, $1015 = 0, $1016 = 0, $1017 = 0, $1018 = 0;
 var $1019 = 0, $102 = 0, $1020 = 0, $1021 = 0, $1022 = 0, $1023 = 0, $1024 = 0, $1025 = 0, $1026 = 0, $1027 = 0, $1028 = 0, $1029 = 0, $103 = 0, $1030 = 0, $1031 = 0, $1032 = 0, $1033 = 0, $1034 = 0, $1035 = 0, $1036 = 0;
 var $1037 = 0, $1038 = 0, $1039 = 0, $104 = 0, $1040 = 0, $1041 = 0, $1042 = 0, $1043 = 0, $1044 = 0, $1045 = 0, $1046 = 0, $1047 = 0, $1048 = 0, $1049 = 0, $105 = 0, $1050 = 0, $1051 = 0, $1052 = 0, $1053 = 0, $1054 = 0;
 var $1055 = 0, $1056 = 0, $1057 = 0, $1058 = 0, $1059 = 0, $106 = 0, $1060 = 0, $1061 = 0, $1062 = 0, $1063 = 0, $1064 = 0, $1065 = 0, $1066 = 0, $1067 = 0, $1068 = 0, $1069 = 0, $107 = 0, $1070 = 0, $1071 = 0, $1072 = 0;
 var $1073 = 0, $1074 = 0, $1075 = 0, $1076 = 0, $1077 = 0, $1078 = 0, $1079 = 0, $108 = 0, $1080 = 0, $1081 = 0, $1082 = 0, $1083 = 0, $1084 = 0, $1085 = 0, $1086 = 0, $1087 = 0, $1088 = 0, $1089 = 0, $109 = 0, $1090 = 0;
 var $1091 = 0, $1092 = 0, $1093 = 0, $1094 = 0, $1095 = 0, $1096 = 0, $1097 = 0, $1098 = 0, $1099 = 0, $11 = 0, $110 = 0, $1100 = 0, $1101 = 0, $1102 = 0, $1103 = 0, $1104 = 0, $1105 = 0, $1106 = 0, $1107 = 0, $1108 = 0;
 var $1109 = 0, $111 = 0, $1110 = 0, $1111 = 0, $1112 = 0, $1113 = 0, $1114 = 0, $1114$phi = 0, $1115 = 0, $1116 = 0, $1117 = 0, $1118 = 0, $1119 = 0, $112 = 0, $1120 = 0, $1121 = 0, $1122 = 0, $1123 = 0, $1124 = 0, $1125 = 0;
 var $1126 = 0, $1127 = 0, $1128 = 0, $1129 = 0, $113 = 0, $1130 = 0, $1131 = 0, $1132 = 0, $1133 = 0, $1134 = 0, $1135 = 0, $1136 = 0, $1137 = 0, $1138 = 0, $1139 = 0, $114 = 0, $1140 = 0, $1141 = 0, $1142 = 0, $1143 = 0;
 var $1144 = 0, $1145 = 0, $1146 = 0, $1147 = 0, $1148 = 0, $1149 = 0, $115 = 0, $1150 = 0, $1151 = 0, $1152 = 0, $1153 = 0, $1154 = 0, $1155 = 0, $1156 = 0, $1157 = 0, $1158 = 0, $1159 = 0, $116 = 0, $1160 = 0, $1161 = 0;
 var $1162 = 0, $1163 = 0, $1164 = 0, $1165 = 0, $1166 = 0, $1167 = 0, $1168 = 0, $1169 = 0, $117 = 0, $1170 = 0, $1171 = 0, $1172 = 0, $1173 = 0, $1174 = 0, $1175 = 0, $1176 = 0, $1177 = 0, $1178 = 0, $1179 = 0, $118 = 0;
 var $1180 = 0, $1181 = 0, $1182 = 0, $1183 = 0, $1184 = 0, $1185 = 0, $1186 = 0, $1187 = 0, $1188 = 0, $1189 = 0, $119 = 0, $1190 = 0, $1191 = 0, $1192 = 0, $1193 = 0, $1194 = 0, $1195 = 0, $1196 = 0, $1197 = 0, $1198 = 0;
 var $1199 = 0, $12 = 0, $120 = 0, $1200 = 0, $1201 = 0, $1202 = 0, $1203 = 0, $1204 = 0, $1205 = 0, $1206 = 0, $1207 = 0, $1208 = 0, $1209 = 0, $121 = 0, $1210 = 0, $1211 = 0, $1212 = 0, $1213 = 0, $1214 = 0, $1215 = 0;
 var $1216 = 0, $1217 = 0, $1218 = 0, $1219 = 0, $122 = 0, $1220 = 0, $1221 = 0, $1222 = 0, $1223 = 0, $1224 = 0, $1225 = 0, $1226 = 0, $1227 = 0, $1228 = 0, $1229 = 0, $123 = 0, $1230 = 0, $1231 = 0, $1232 = 0, $1233 = 0;
 var $1234 = 0, $1235 = 0, $1236 = 0, $1237 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0;
 var $139 = 0, $14 = 0, $140 = 0, $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0;
 var $157 = 0, $158 = 0, $159 = 0, $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0;
 var $175 = 0, $176 = 0, $177 = 0, $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0;
 var $193 = 0, $194 = 0, $195 = 0, $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0;
 var $210 = 0, $211 = 0, $212 = 0, $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0;
 var $229 = 0, $23 = 0, $230 = 0, $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0;
 var $247 = 0, $248 = 0, $249 = 0, $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0;
 var $265 = 0, $266 = 0, $267 = 0, $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0;
 var $283 = 0, $284 = 0, $285 = 0, $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0;
 var $300 = 0, $301 = 0, $302 = 0, $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0;
 var $319 = 0, $32 = 0, $320 = 0, $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0;
 var $337 = 0, $338 = 0, $339 = 0, $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0;
 var $355 = 0, $356 = 0, $357 = 0, $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0;
 var $373 = 0, $374 = 0, $375 = 0, $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $385 = 0, $386 = 0, $387 = 0, $388 = 0, $389 = 0, $39 = 0, $390 = 0;
 var $391 = 0, $392 = 0, $393 = 0, $394 = 0, $395 = 0, $396 = 0, $397 = 0, $398 = 0, $399 = 0, $4 = 0, $40 = 0, $400 = 0, $401 = 0, $402 = 0, $403 = 0, $404 = 0, $405 = 0, $406 = 0, $407 = 0, $408 = 0;
 var $409 = 0, $41 = 0, $410 = 0, $411 = 0, $412 = 0, $413 = 0, $414 = 0, $415 = 0, $416 = 0, $417 = 0, $418 = 0, $419 = 0, $42 = 0, $420 = 0, $421 = 0, $422 = 0, $423 = 0, $424 = 0, $425 = 0, $426 = 0;
 var $427 = 0, $428 = 0, $429 = 0, $43 = 0, $430 = 0, $431 = 0, $432 = 0, $433 = 0, $434 = 0, $435 = 0, $436 = 0, $437 = 0, $438 = 0, $439 = 0, $44 = 0, $440 = 0, $441 = 0, $442 = 0, $443 = 0, $444 = 0;
 var $445 = 0, $446 = 0, $447 = 0, $448 = 0, $449 = 0, $45 = 0, $450 = 0, $451 = 0, $452 = 0, $453 = 0, $454 = 0, $455 = 0, $456 = 0, $457 = 0, $458 = 0, $459 = 0, $46 = 0, $460 = 0, $461 = 0, $462 = 0;
 var $463 = 0, $464 = 0, $465 = 0, $466 = 0, $467 = 0, $468 = 0, $469 = 0, $47 = 0, $470 = 0, $471 = 0, $472 = 0, $473 = 0, $474 = 0, $475 = 0, $476 = 0, $477 = 0, $478 = 0, $479 = 0, $48 = 0, $480 = 0;
 var $481 = 0, $482 = 0, $483 = 0, $484 = 0, $485 = 0, $486 = 0, $487 = 0, $488 = 0, $489 = 0, $49 = 0, $490 = 0, $491 = 0, $492 = 0, $493 = 0, $494 = 0, $495 = 0, $496 = 0, $497 = 0, $498 = 0, $499 = 0;
 var $5 = 0, $50 = 0, $500 = 0, $501 = 0, $502 = 0, $503 = 0, $504 = 0, $505 = 0, $506 = 0, $507 = 0, $508 = 0, $509 = 0, $51 = 0, $510 = 0, $511 = 0, $512 = 0, $513 = 0, $514 = 0, $515 = 0, $516 = 0;
 var $517 = 0, $518 = 0, $519 = 0, $52 = 0, $520 = 0, $521 = 0, $522 = 0, $523 = 0, $524 = 0, $525 = 0, $526 = 0, $527 = 0, $528 = 0, $529 = 0, $53 = 0, $530 = 0, $531 = 0, $532 = 0, $533 = 0, $534 = 0;
 var $535 = 0, $536 = 0, $537 = 0, $538 = 0, $539 = 0, $54 = 0, $540 = 0, $541 = 0, $542 = 0, $543 = 0, $544 = 0, $545 = 0, $546 = 0, $547 = 0, $548 = 0, $549 = 0, $55 = 0, $550 = 0, $551 = 0, $552 = 0;
 var $553 = 0, $554 = 0, $555 = 0, $556 = 0, $557 = 0, $558 = 0, $559 = 0, $56 = 0, $560 = 0, $561 = 0, $562 = 0, $563 = 0, $564 = 0, $565 = 0, $566 = 0, $567 = 0, $568 = 0, $569 = 0, $57 = 0, $570 = 0;
 var $571 = 0, $572 = 0, $573 = 0, $574 = 0, $575 = 0, $576 = 0, $577 = 0, $578 = 0, $579 = 0, $58 = 0, $580 = 0, $581 = 0, $582 = 0, $583 = 0, $584 = 0, $585 = 0, $586 = 0, $587 = 0, $588 = 0, $589 = 0;
 var $59 = 0, $590 = 0, $591 = 0, $592 = 0, $593 = 0, $594 = 0, $595 = 0, $596 = 0, $597 = 0, $598 = 0, $599 = 0, $6 = 0, $60 = 0, $600 = 0, $601 = 0, $602 = 0, $603 = 0, $604 = 0, $605 = 0, $606 = 0;
 var $607 = 0, $608 = 0, $609 = 0, $61 = 0, $610 = 0, $611 = 0, $612 = 0, $613 = 0, $614 = 0, $615 = 0, $616 = 0, $617 = 0, $618 = 0, $619 = 0, $62 = 0, $620 = 0, $621 = 0, $622 = 0, $623 = 0, $624 = 0;
 var $625 = 0, $626 = 0, $627 = 0, $628 = 0, $629 = 0, $63 = 0, $630 = 0, $631 = 0, $632 = 0, $633 = 0, $634 = 0, $635 = 0, $636 = 0, $637 = 0, $638 = 0, $639 = 0, $64 = 0, $640 = 0, $641 = 0, $642 = 0;
 var $643 = 0, $644 = 0, $645 = 0, $646 = 0, $647 = 0, $648 = 0, $649 = 0, $65 = 0, $650 = 0, $651 = 0, $652 = 0, $653 = 0, $654 = 0, $655 = 0, $656 = 0, $657 = 0, $658 = 0, $659 = 0, $66 = 0, $660 = 0;
 var $661 = 0, $662 = 0, $663 = 0, $664 = 0, $665 = 0, $666 = 0, $667 = 0, $668 = 0, $669 = 0, $67 = 0, $670 = 0, $671 = 0, $672 = 0, $673 = 0, $674 = 0, $675 = 0, $676 = 0, $677 = 0, $678 = 0, $679 = 0;
 var $68 = 0, $680 = 0, $681 = 0, $682 = 0, $683 = 0, $684 = 0, $685 = 0, $686 = 0, $687 = 0, $688 = 0, $689 = 0, $69 = 0, $690 = 0, $691 = 0, $692 = 0, $693 = 0, $694 = 0, $695 = 0, $696 = 0, $697 = 0;
 var $698 = 0, $699 = 0, $7 = 0, $70 = 0, $700 = 0, $701 = 0, $702 = 0, $703 = 0, $704 = 0, $705 = 0, $706 = 0, $707 = 0, $708 = 0, $709 = 0, $71 = 0, $710 = 0, $711 = 0, $712 = 0, $713 = 0, $714 = 0;
 var $715 = 0, $716 = 0, $717 = 0, $718 = 0, $719 = 0, $72 = 0, $720 = 0, $721 = 0, $722 = 0, $723 = 0, $724 = 0, $725 = 0, $726 = 0, $727 = 0, $728 = 0, $729 = 0, $73 = 0, $730 = 0, $731 = 0, $732 = 0;
 var $733 = 0, $734 = 0, $735 = 0, $736 = 0, $737 = 0, $738 = 0, $739 = 0, $74 = 0, $740 = 0, $741 = 0, $742 = 0, $743 = 0, $744 = 0, $745 = 0, $746 = 0, $747 = 0, $748 = 0, $749 = 0, $75 = 0, $750 = 0;
 var $751 = 0, $752 = 0, $753 = 0, $754 = 0, $755 = 0, $756 = 0, $757 = 0, $758 = 0, $759 = 0, $76 = 0, $760 = 0, $761 = 0, $762 = 0, $763 = 0, $764 = 0, $765 = 0, $766 = 0, $767 = 0, $768 = 0, $769 = 0;
 var $77 = 0, $770 = 0, $771 = 0, $772 = 0, $773 = 0, $774 = 0, $775 = 0, $776 = 0, $777 = 0, $778 = 0, $779 = 0, $78 = 0, $780 = 0, $781 = 0, $782 = 0, $783 = 0, $784 = 0, $785 = 0, $786 = 0, $787 = 0;
 var $788 = 0, $789 = 0, $79 = 0, $790 = 0, $791 = 0, $792 = 0, $793 = 0, $794 = 0, $795 = 0, $796 = 0, $797 = 0, $798 = 0, $799 = 0, $8 = 0, $80 = 0, $800 = 0, $801 = 0, $802 = 0, $803 = 0, $804 = 0;
 var $805 = 0, $806 = 0, $807 = 0, $808 = 0, $809 = 0, $81 = 0, $810 = 0, $811 = 0, $812 = 0, $813 = 0, $814 = 0, $815 = 0, $816 = 0, $817 = 0, $818 = 0, $819 = 0, $82 = 0, $820 = 0, $821 = 0, $822 = 0;
 var $823 = 0, $824 = 0, $825 = 0, $826 = 0, $827 = 0, $828 = 0, $829 = 0, $83 = 0, $830 = 0, $831 = 0, $832 = 0, $833 = 0, $834 = 0, $835 = 0, $836 = 0, $837 = 0, $838 = 0, $839 = 0, $84 = 0, $840 = 0;
 var $841 = 0, $842 = 0, $843 = 0, $844 = 0, $845 = 0, $846 = 0, $847 = 0, $848 = 0, $849 = 0, $85 = 0, $850 = 0, $851 = 0, $852 = 0, $853 = 0, $854 = 0, $855 = 0, $856 = 0, $857 = 0, $858 = 0, $859 = 0;
 var $86 = 0, $860 = 0, $861 = 0, $862 = 0, $863 = 0, $864 = 0, $865 = 0, $866 = 0, $867 = 0, $868 = 0, $869 = 0, $87 = 0, $870 = 0, $871 = 0, $872 = 0, $873 = 0, $874 = 0, $875 = 0, $876 = 0, $877 = 0;
 var $878 = 0, $879 = 0, $88 = 0, $880 = 0, $881 = 0, $882 = 0, $883 = 0, $884 = 0, $885 = 0, $886 = 0, $887 = 0, $888 = 0, $889 = 0, $89 = 0, $890 = 0, $891 = 0, $892 = 0, $893 = 0, $894 = 0, $895 = 0;
 var $896 = 0, $897 = 0, $898 = 0, $899 = 0, $9 = 0, $90 = 0, $900 = 0, $901 = 0, $902 = 0, $903 = 0, $904 = 0, $905 = 0, $906 = 0, $907 = 0, $908 = 0, $909 = 0, $91 = 0, $910 = 0, $911 = 0, $912 = 0;
 var $913 = 0, $914 = 0, $915 = 0, $916 = 0, $917 = 0, $918 = 0, $919 = 0, $92 = 0, $920 = 0, $921 = 0, $922 = 0, $923 = 0, $924 = 0, $925 = 0, $926 = 0, $927 = 0, $928 = 0, $929 = 0, $93 = 0, $930 = 0;
 var $931 = 0, $932 = 0, $933 = 0, $934 = 0, $935 = 0, $936 = 0, $937 = 0, $938 = 0, $939 = 0, $94 = 0, $940 = 0, $941 = 0, $942 = 0, $943 = 0, $944 = 0, $945 = 0, $946 = 0, $947 = 0, $948 = 0, $949 = 0;
 var $95 = 0, $950 = 0, $951 = 0, $952 = 0, $953 = 0, $954 = 0, $955 = 0, $956 = 0, $957 = 0, $958 = 0, $959 = 0, $96 = 0, $960 = 0, $961 = 0, $962 = 0, $963 = 0, $964 = 0, $965 = 0, $966 = 0, $967 = 0;
 var $968 = 0, $969 = 0, $97 = 0, $970 = 0, $971 = 0, $972 = 0, $973 = 0, $974 = 0, $975 = 0, $976 = 0, $977 = 0, $978 = 0, $979 = 0, $98 = 0, $980 = 0, $981 = 0, $982 = 0, $983 = 0, $984 = 0, $985 = 0;
 var $986 = 0, $987 = 0, $988 = 0, $989 = 0, $99 = 0, $990 = 0, $991 = 0, $992 = 0, $993 = 0, $994 = 0, $995 = 0, $996 = 0, $997 = 0, $998 = 0, $999 = 0, $F$0$i$i = 0, $F1$0$i = 0, $F4$0 = 0, $F4$0$i$i = 0, $F5$0$i = 0;
 var $I1$0$c$i$i = 0, $I1$0$i$i = 0, $I7$0$i = 0, $I7$0$i$i = 0, $K12$025$i = 0, $K2$014$i$i = 0, $K8$052$i$i = 0, $R$0$i = 0, $R$0$i$i = 0, $R$0$i$i$phi = 0, $R$0$i$phi = 0, $R$0$i18 = 0, $R$0$i18$phi = 0, $R$1$i = 0, $R$1$i$i = 0, $R$1$i20 = 0, $RP$0$i = 0, $RP$0$i$i = 0, $RP$0$i$i$phi = 0, $RP$0$i$phi = 0;
 var $RP$0$i17 = 0, $RP$0$i17$phi = 0, $T$0$c$i$i = 0, $T$0$c7$i$i = 0, $T$0$lcssa$i = 0, $T$0$lcssa$i$i = 0, $T$0$lcssa$i28$i = 0, $T$013$i$i = 0, $T$013$i$i$phi = 0, $T$024$i = 0, $T$024$i$phi = 0, $T$051$i$i = 0, $T$051$i$i$phi = 0, $br$0$i = 0, $cond$i = 0, $cond$i$i = 0, $cond$i21 = 0, $exitcond$i$i = 0, $i$02$i$i = 0, $i$02$i$i$phi = 0;
 var $idx$0$i = 0, $mem$0 = 0, $nb$0 = 0, $notlhs$i = 0, $notrhs$i = 0, $oldfirst$0$i$i = 0, $or$cond$i = 0, $or$cond$i29 = 0, $or$cond1$i = 0, $or$cond10$i = 0, $or$cond19$i = 0, $or$cond2$i = 0, $or$cond49$i = 0, $or$cond5$i = 0, $or$cond6$i = 0, $or$cond8$not$i = 0, $or$cond9$i = 0, $qsize$0$i$i = 0, $rsize$0$i = 0, $rsize$0$i15 = 0;
 var $rsize$1$i = 0, $rsize$2$i = 0, $rsize$3$lcssa$i = 0, $rsize$329$i = 0, $rsize$329$i$phi = 0, $rst$0$i = 0, $rst$1$i = 0, $sizebits$0$i = 0, $sp$0$i$i = 0, $sp$0$i$i$i = 0, $sp$075$i = 0, $sp$168$i = 0, $ssize$0$$i = 0, $ssize$0$i = 0, $ssize$1$i = 0, $ssize$2$i = 0, $t$0$i = 0, $t$0$i14 = 0, $t$1$i = 0, $t$2$ph$i = 0;
 var $t$2$v$3$i = 0, $t$228$i = 0, $t$228$i$phi = 0, $tbase$0$i = 0, $tbase$247$i = 0, $tsize$0$i = 0, $tsize$0323841$i = 0, $tsize$1$i = 0, $tsize$246$i = 0, $v$0$i = 0, $v$0$i16 = 0, $v$1$i = 0, $v$2$i = 0, $v$3$lcssa$i = 0, $v$330$i = 0, $v$330$i$phi = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($bytes>>>0)<(245);
 do {
  if ($1) {
   $2 = ($bytes>>>0)<(11);
   if ($2) {
    $5 = 16;
   } else {
    $3 = (($bytes) + 11)|0;
    $4 = $3 & -8;
    $5 = $4;
   }
   $6 = $5 >>> 3;
   $7 = HEAP32[((2656))>>2]|0;
   $8 = $7 >>> $6;
   $9 = $8 & 3;
   $10 = ($9|0)==(0);
   if (!($10)) {
    $11 = $8 & 1;
    $12 = $11 ^ 1;
    $13 = (($12) + ($6))|0;
    $14 = $13 << 1;
    $15 = (((2656) + ($14<<2)|0) + 40|0);
    $16 = $15;
    $$sum10 = (($14) + 2)|0;
    $17 = (((2656) + ($$sum10<<2)|0) + 40|0);
    $18 = HEAP32[$17>>2]|0;
    $19 = (($18) + 8|0);
    $20 = HEAP32[$19>>2]|0;
    $21 = ($16|0)==($20|0);
    do {
     if ($21) {
      $22 = 1 << $13;
      $23 = $22 ^ -1;
      $24 = $7 & $23;
      HEAP32[((2656))>>2] = $24;
     } else {
      $25 = $20;
      $26 = HEAP32[(((2656) + 16|0))>>2]|0;
      $27 = ($25>>>0)<($26>>>0);
      if ($27) {
       _abort();
       // unreachable;
      }
      $28 = (($20) + 12|0);
      $29 = HEAP32[$28>>2]|0;
      $30 = ($29|0)==($18|0);
      if ($30) {
       HEAP32[$28>>2] = $16;
       HEAP32[$17>>2] = $20;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $31 = $13 << 3;
    $32 = $31 | 3;
    $33 = (($18) + 4|0);
    HEAP32[$33>>2] = $32;
    $34 = $18;
    $$sum1112 = $31 | 4;
    $35 = (($34) + ($$sum1112)|0);
    $36 = $35;
    $37 = HEAP32[$36>>2]|0;
    $38 = $37 | 1;
    HEAP32[$36>>2] = $38;
    $39 = $19;
    $mem$0 = $39;
    STACKTOP = sp;return ($mem$0|0);
   }
   $40 = HEAP32[(((2656) + 8|0))>>2]|0;
   $41 = ($5>>>0)>($40>>>0);
   if (!($41)) {
    $nb$0 = $5;
    break;
   }
   $42 = ($8|0)==(0);
   if (!($42)) {
    $43 = $8 << $6;
    $44 = 2 << $6;
    $45 = (0 - ($44))|0;
    $46 = $44 | $45;
    $47 = $43 & $46;
    $48 = (0 - ($47))|0;
    $49 = $47 & $48;
    $50 = (($49) + -1)|0;
    $51 = $50 >>> 12;
    $52 = $51 & 16;
    $53 = $50 >>> $52;
    $54 = $53 >>> 5;
    $55 = $54 & 8;
    $56 = $55 | $52;
    $57 = $53 >>> $55;
    $58 = $57 >>> 2;
    $59 = $58 & 4;
    $60 = $56 | $59;
    $61 = $57 >>> $59;
    $62 = $61 >>> 1;
    $63 = $62 & 2;
    $64 = $60 | $63;
    $65 = $61 >>> $63;
    $66 = $65 >>> 1;
    $67 = $66 & 1;
    $68 = $64 | $67;
    $69 = $65 >>> $67;
    $70 = (($68) + ($69))|0;
    $71 = $70 << 1;
    $72 = (((2656) + ($71<<2)|0) + 40|0);
    $73 = $72;
    $$sum4 = (($71) + 2)|0;
    $74 = (((2656) + ($$sum4<<2)|0) + 40|0);
    $75 = HEAP32[$74>>2]|0;
    $76 = (($75) + 8|0);
    $77 = HEAP32[$76>>2]|0;
    $78 = ($73|0)==($77|0);
    do {
     if ($78) {
      $79 = 1 << $70;
      $80 = $79 ^ -1;
      $81 = $7 & $80;
      HEAP32[((2656))>>2] = $81;
     } else {
      $82 = $77;
      $83 = HEAP32[(((2656) + 16|0))>>2]|0;
      $84 = ($82>>>0)<($83>>>0);
      if ($84) {
       _abort();
       // unreachable;
      }
      $85 = (($77) + 12|0);
      $86 = HEAP32[$85>>2]|0;
      $87 = ($86|0)==($75|0);
      if ($87) {
       HEAP32[$85>>2] = $73;
       HEAP32[$74>>2] = $77;
       break;
      } else {
       _abort();
       // unreachable;
      }
     }
    } while(0);
    $88 = $70 << 3;
    $89 = (($88) - ($5))|0;
    $90 = $5 | 3;
    $91 = (($75) + 4|0);
    HEAP32[$91>>2] = $90;
    $92 = $75;
    $93 = (($92) + ($5)|0);
    $94 = $93;
    $95 = $89 | 1;
    $$sum56 = $5 | 4;
    $96 = (($92) + ($$sum56)|0);
    $97 = $96;
    HEAP32[$97>>2] = $95;
    $98 = (($92) + ($88)|0);
    $99 = $98;
    HEAP32[$99>>2] = $89;
    $100 = HEAP32[(((2656) + 8|0))>>2]|0;
    $101 = ($100|0)==(0);
    if (!($101)) {
     $102 = HEAP32[(((2656) + 20|0))>>2]|0;
     $103 = $100 >>> 3;
     $104 = $103 << 1;
     $105 = (((2656) + ($104<<2)|0) + 40|0);
     $106 = $105;
     $107 = HEAP32[((2656))>>2]|0;
     $108 = 1 << $103;
     $109 = $107 & $108;
     $110 = ($109|0)==(0);
     do {
      if ($110) {
       $111 = $107 | $108;
       HEAP32[((2656))>>2] = $111;
       $$sum8$pre = (($104) + 2)|0;
       $$pre = (((2656) + ($$sum8$pre<<2)|0) + 40|0);
       $$pre$phiZ2D = $$pre;$F4$0 = $106;
      } else {
       $$sum9 = (($104) + 2)|0;
       $112 = (((2656) + ($$sum9<<2)|0) + 40|0);
       $113 = HEAP32[$112>>2]|0;
       $114 = $113;
       $115 = HEAP32[(((2656) + 16|0))>>2]|0;
       $116 = ($114>>>0)<($115>>>0);
       if (!($116)) {
        $$pre$phiZ2D = $112;$F4$0 = $113;
        break;
       }
       _abort();
       // unreachable;
      }
     } while(0);
     HEAP32[$$pre$phiZ2D>>2] = $102;
     $117 = (($F4$0) + 12|0);
     HEAP32[$117>>2] = $102;
     $118 = (($102) + 8|0);
     HEAP32[$118>>2] = $F4$0;
     $119 = (($102) + 12|0);
     HEAP32[$119>>2] = $106;
    }
    HEAP32[(((2656) + 8|0))>>2] = $89;
    HEAP32[(((2656) + 20|0))>>2] = $94;
    $120 = $76;
    $mem$0 = $120;
    STACKTOP = sp;return ($mem$0|0);
   }
   $121 = HEAP32[(((2656) + 4|0))>>2]|0;
   $122 = ($121|0)==(0);
   if ($122) {
    $nb$0 = $5;
    break;
   }
   $123 = (0 - ($121))|0;
   $124 = $121 & $123;
   $125 = (($124) + -1)|0;
   $126 = $125 >>> 12;
   $127 = $126 & 16;
   $128 = $125 >>> $127;
   $129 = $128 >>> 5;
   $130 = $129 & 8;
   $131 = $130 | $127;
   $132 = $128 >>> $130;
   $133 = $132 >>> 2;
   $134 = $133 & 4;
   $135 = $131 | $134;
   $136 = $132 >>> $134;
   $137 = $136 >>> 1;
   $138 = $137 & 2;
   $139 = $135 | $138;
   $140 = $136 >>> $138;
   $141 = $140 >>> 1;
   $142 = $141 & 1;
   $143 = $139 | $142;
   $144 = $140 >>> $142;
   $145 = (($143) + ($144))|0;
   $146 = (((2656) + ($145<<2)|0) + 304|0);
   $147 = HEAP32[$146>>2]|0;
   $148 = (($147) + 4|0);
   $149 = HEAP32[$148>>2]|0;
   $150 = $149 & -8;
   $151 = (($150) - ($5))|0;
   $rsize$0$i = $151;$t$0$i = $147;$v$0$i = $147;
   while(1) {
    $152 = (($t$0$i) + 16|0);
    $153 = HEAP32[$152>>2]|0;
    $154 = ($153|0)==(0|0);
    if ($154) {
     $155 = (($t$0$i) + 20|0);
     $156 = HEAP32[$155>>2]|0;
     $157 = ($156|0)==(0|0);
     if ($157) {
      break;
     } else {
      $158 = $156;
     }
    } else {
     $158 = $153;
    }
    $159 = (($158) + 4|0);
    $160 = HEAP32[$159>>2]|0;
    $161 = $160 & -8;
    $162 = (($161) - ($5))|0;
    $163 = ($162>>>0)<($rsize$0$i>>>0);
    $$rsize$0$i = $163 ? $162 : $rsize$0$i;
    $$v$0$i = $163 ? $158 : $v$0$i;
    $rsize$0$i = $$rsize$0$i;$t$0$i = $158;$v$0$i = $$v$0$i;
   }
   $164 = $v$0$i;
   $165 = HEAP32[(((2656) + 16|0))>>2]|0;
   $166 = ($164>>>0)<($165>>>0);
   if ($166) {
    _abort();
    // unreachable;
   }
   $167 = (($164) + ($5)|0);
   $168 = $167;
   $169 = ($164>>>0)<($167>>>0);
   if (!($169)) {
    _abort();
    // unreachable;
   }
   $170 = (($v$0$i) + 24|0);
   $171 = HEAP32[$170>>2]|0;
   $172 = (($v$0$i) + 12|0);
   $173 = HEAP32[$172>>2]|0;
   $174 = ($173|0)==($v$0$i|0);
   do {
    if ($174) {
     $185 = (($v$0$i) + 20|0);
     $186 = HEAP32[$185>>2]|0;
     $187 = ($186|0)==(0|0);
     if ($187) {
      $188 = (($v$0$i) + 16|0);
      $189 = HEAP32[$188>>2]|0;
      $190 = ($189|0)==(0|0);
      if ($190) {
       $R$1$i = 0;
       break;
      } else {
       $R$0$i = $189;$RP$0$i = $188;
      }
     } else {
      $R$0$i = $186;$RP$0$i = $185;
     }
     while(1) {
      $191 = (($R$0$i) + 20|0);
      $192 = HEAP32[$191>>2]|0;
      $193 = ($192|0)==(0|0);
      if (!($193)) {
       $RP$0$i$phi = $191;$R$0$i$phi = $192;$RP$0$i = $RP$0$i$phi;$R$0$i = $R$0$i$phi;
       continue;
      }
      $194 = (($R$0$i) + 16|0);
      $195 = HEAP32[$194>>2]|0;
      $196 = ($195|0)==(0|0);
      if ($196) {
       break;
      } else {
       $R$0$i = $195;$RP$0$i = $194;
      }
     }
     $197 = $RP$0$i;
     $198 = ($197>>>0)<($165>>>0);
     if ($198) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0$i>>2] = 0;
      $R$1$i = $R$0$i;
      break;
     }
    } else {
     $175 = (($v$0$i) + 8|0);
     $176 = HEAP32[$175>>2]|0;
     $177 = $176;
     $178 = ($177>>>0)<($165>>>0);
     if ($178) {
      _abort();
      // unreachable;
     }
     $179 = (($176) + 12|0);
     $180 = HEAP32[$179>>2]|0;
     $181 = ($180|0)==($v$0$i|0);
     if (!($181)) {
      _abort();
      // unreachable;
     }
     $182 = (($173) + 8|0);
     $183 = HEAP32[$182>>2]|0;
     $184 = ($183|0)==($v$0$i|0);
     if ($184) {
      HEAP32[$179>>2] = $173;
      HEAP32[$182>>2] = $176;
      $R$1$i = $173;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $199 = ($171|0)==(0|0);
   L78: do {
    if (!($199)) {
     $200 = (($v$0$i) + 28|0);
     $201 = HEAP32[$200>>2]|0;
     $202 = (((2656) + ($201<<2)|0) + 304|0);
     $203 = HEAP32[$202>>2]|0;
     $204 = ($v$0$i|0)==($203|0);
     do {
      if ($204) {
       HEAP32[$202>>2] = $R$1$i;
       $cond$i = ($R$1$i|0)==(0|0);
       if (!($cond$i)) {
        break;
       }
       $205 = 1 << $201;
       $206 = $205 ^ -1;
       $207 = HEAP32[(((2656) + 4|0))>>2]|0;
       $208 = $207 & $206;
       HEAP32[(((2656) + 4|0))>>2] = $208;
       break L78;
      } else {
       $209 = $171;
       $210 = HEAP32[(((2656) + 16|0))>>2]|0;
       $211 = ($209>>>0)<($210>>>0);
       if ($211) {
        _abort();
        // unreachable;
       }
       $212 = (($171) + 16|0);
       $213 = HEAP32[$212>>2]|0;
       $214 = ($213|0)==($v$0$i|0);
       if ($214) {
        HEAP32[$212>>2] = $R$1$i;
       } else {
        $215 = (($171) + 20|0);
        HEAP32[$215>>2] = $R$1$i;
       }
       $216 = ($R$1$i|0)==(0|0);
       if ($216) {
        break L78;
       }
      }
     } while(0);
     $217 = $R$1$i;
     $218 = HEAP32[(((2656) + 16|0))>>2]|0;
     $219 = ($217>>>0)<($218>>>0);
     if ($219) {
      _abort();
      // unreachable;
     }
     $220 = (($R$1$i) + 24|0);
     HEAP32[$220>>2] = $171;
     $221 = (($v$0$i) + 16|0);
     $222 = HEAP32[$221>>2]|0;
     $223 = ($222|0)==(0|0);
     do {
      if (!($223)) {
       $224 = $222;
       $225 = HEAP32[(((2656) + 16|0))>>2]|0;
       $226 = ($224>>>0)<($225>>>0);
       if ($226) {
        _abort();
        // unreachable;
       } else {
        $227 = (($R$1$i) + 16|0);
        HEAP32[$227>>2] = $222;
        $228 = (($222) + 24|0);
        HEAP32[$228>>2] = $R$1$i;
        break;
       }
      }
     } while(0);
     $229 = (($v$0$i) + 20|0);
     $230 = HEAP32[$229>>2]|0;
     $231 = ($230|0)==(0|0);
     if ($231) {
      break;
     }
     $232 = $230;
     $233 = HEAP32[(((2656) + 16|0))>>2]|0;
     $234 = ($232>>>0)<($233>>>0);
     if ($234) {
      _abort();
      // unreachable;
     } else {
      $235 = (($R$1$i) + 20|0);
      HEAP32[$235>>2] = $230;
      $236 = (($230) + 24|0);
      HEAP32[$236>>2] = $R$1$i;
      break;
     }
    }
   } while(0);
   $237 = ($rsize$0$i>>>0)<(16);
   if ($237) {
    $238 = (($rsize$0$i) + ($5))|0;
    $239 = $238 | 3;
    $240 = (($v$0$i) + 4|0);
    HEAP32[$240>>2] = $239;
    $$sum4$i = (($238) + 4)|0;
    $241 = (($164) + ($$sum4$i)|0);
    $242 = $241;
    $243 = HEAP32[$242>>2]|0;
    $244 = $243 | 1;
    HEAP32[$242>>2] = $244;
   } else {
    $245 = $5 | 3;
    $246 = (($v$0$i) + 4|0);
    HEAP32[$246>>2] = $245;
    $247 = $rsize$0$i | 1;
    $$sum$i35 = $5 | 4;
    $248 = (($164) + ($$sum$i35)|0);
    $249 = $248;
    HEAP32[$249>>2] = $247;
    $$sum1$i = (($rsize$0$i) + ($5))|0;
    $250 = (($164) + ($$sum1$i)|0);
    $251 = $250;
    HEAP32[$251>>2] = $rsize$0$i;
    $252 = HEAP32[(((2656) + 8|0))>>2]|0;
    $253 = ($252|0)==(0);
    if (!($253)) {
     $254 = HEAP32[(((2656) + 20|0))>>2]|0;
     $255 = $252 >>> 3;
     $256 = $255 << 1;
     $257 = (((2656) + ($256<<2)|0) + 40|0);
     $258 = $257;
     $259 = HEAP32[((2656))>>2]|0;
     $260 = 1 << $255;
     $261 = $259 & $260;
     $262 = ($261|0)==(0);
     do {
      if ($262) {
       $263 = $259 | $260;
       HEAP32[((2656))>>2] = $263;
       $$sum2$pre$i = (($256) + 2)|0;
       $$pre$i = (((2656) + ($$sum2$pre$i<<2)|0) + 40|0);
       $$pre$phi$iZ2D = $$pre$i;$F1$0$i = $258;
      } else {
       $$sum3$i = (($256) + 2)|0;
       $264 = (((2656) + ($$sum3$i<<2)|0) + 40|0);
       $265 = HEAP32[$264>>2]|0;
       $266 = $265;
       $267 = HEAP32[(((2656) + 16|0))>>2]|0;
       $268 = ($266>>>0)<($267>>>0);
       if (!($268)) {
        $$pre$phi$iZ2D = $264;$F1$0$i = $265;
        break;
       }
       _abort();
       // unreachable;
      }
     } while(0);
     HEAP32[$$pre$phi$iZ2D>>2] = $254;
     $269 = (($F1$0$i) + 12|0);
     HEAP32[$269>>2] = $254;
     $270 = (($254) + 8|0);
     HEAP32[$270>>2] = $F1$0$i;
     $271 = (($254) + 12|0);
     HEAP32[$271>>2] = $258;
    }
    HEAP32[(((2656) + 8|0))>>2] = $rsize$0$i;
    HEAP32[(((2656) + 20|0))>>2] = $168;
   }
   $272 = (($v$0$i) + 8|0);
   $273 = $272;
   $mem$0 = $273;
   STACKTOP = sp;return ($mem$0|0);
  } else {
   $274 = ($bytes>>>0)>(4294967231);
   if ($274) {
    $nb$0 = -1;
    break;
   }
   $275 = (($bytes) + 11)|0;
   $276 = $275 & -8;
   $277 = HEAP32[(((2656) + 4|0))>>2]|0;
   $278 = ($277|0)==(0);
   if ($278) {
    $nb$0 = $276;
    break;
   }
   $279 = (0 - ($276))|0;
   $280 = $275 >>> 8;
   $281 = ($280|0)==(0);
   do {
    if ($281) {
     $idx$0$i = 0;
    } else {
     $282 = ($276>>>0)>(16777215);
     if ($282) {
      $idx$0$i = 31;
      break;
     }
     $283 = (($280) + 1048320)|0;
     $284 = $283 >>> 16;
     $285 = $284 & 8;
     $286 = $280 << $285;
     $287 = (($286) + 520192)|0;
     $288 = $287 >>> 16;
     $289 = $288 & 4;
     $290 = $289 | $285;
     $291 = $286 << $289;
     $292 = (($291) + 245760)|0;
     $293 = $292 >>> 16;
     $294 = $293 & 2;
     $295 = $290 | $294;
     $296 = (14 - ($295))|0;
     $297 = $291 << $294;
     $298 = $297 >>> 15;
     $299 = (($296) + ($298))|0;
     $300 = $299 << 1;
     $301 = (($299) + 7)|0;
     $302 = $276 >>> $301;
     $303 = $302 & 1;
     $304 = $303 | $300;
     $idx$0$i = $304;
    }
   } while(0);
   $305 = (((2656) + ($idx$0$i<<2)|0) + 304|0);
   $306 = HEAP32[$305>>2]|0;
   $307 = ($306|0)==(0|0);
   L126: do {
    if ($307) {
     $rsize$2$i = $279;$t$1$i = 0;$v$2$i = 0;
    } else {
     $308 = ($idx$0$i|0)==(31);
     if ($308) {
      $311 = 0;
     } else {
      $309 = $idx$0$i >>> 1;
      $310 = (25 - ($309))|0;
      $311 = $310;
     }
     $312 = $276 << $311;
     $rsize$0$i15 = $279;$rst$0$i = 0;$sizebits$0$i = $312;$t$0$i14 = $306;$v$0$i16 = 0;
     while(1) {
      $313 = (($t$0$i14) + 4|0);
      $314 = HEAP32[$313>>2]|0;
      $315 = $314 & -8;
      $316 = (($315) - ($276))|0;
      $317 = ($316>>>0)<($rsize$0$i15>>>0);
      if ($317) {
       $318 = ($315|0)==($276|0);
       if ($318) {
        $rsize$2$i = $316;$t$1$i = $t$0$i14;$v$2$i = $t$0$i14;
        break L126;
       } else {
        $rsize$1$i = $316;$v$1$i = $t$0$i14;
       }
      } else {
       $rsize$1$i = $rsize$0$i15;$v$1$i = $v$0$i16;
      }
      $319 = (($t$0$i14) + 20|0);
      $320 = HEAP32[$319>>2]|0;
      $321 = $sizebits$0$i >>> 31;
      $322 = ((($t$0$i14) + ($321<<2)|0) + 16|0);
      $323 = HEAP32[$322>>2]|0;
      $324 = ($320|0)==(0|0);
      $325 = ($320|0)==($323|0);
      $or$cond$i = $324 | $325;
      $rst$1$i = $or$cond$i ? $rst$0$i : $320;
      $326 = ($323|0)==(0|0);
      $327 = $sizebits$0$i << 1;
      if ($326) {
       $rsize$2$i = $rsize$1$i;$t$1$i = $rst$1$i;$v$2$i = $v$1$i;
       break;
      } else {
       $rsize$0$i15 = $rsize$1$i;$rst$0$i = $rst$1$i;$sizebits$0$i = $327;$t$0$i14 = $323;$v$0$i16 = $v$1$i;
      }
     }
    }
   } while(0);
   $328 = ($t$1$i|0)==(0|0);
   $329 = ($v$2$i|0)==(0|0);
   $or$cond19$i = $328 & $329;
   if ($or$cond19$i) {
    $330 = 2 << $idx$0$i;
    $331 = (0 - ($330))|0;
    $332 = $330 | $331;
    $333 = $277 & $332;
    $334 = ($333|0)==(0);
    if ($334) {
     $nb$0 = $276;
     break;
    }
    $335 = (0 - ($333))|0;
    $336 = $333 & $335;
    $337 = (($336) + -1)|0;
    $338 = $337 >>> 12;
    $339 = $338 & 16;
    $340 = $337 >>> $339;
    $341 = $340 >>> 5;
    $342 = $341 & 8;
    $343 = $342 | $339;
    $344 = $340 >>> $342;
    $345 = $344 >>> 2;
    $346 = $345 & 4;
    $347 = $343 | $346;
    $348 = $344 >>> $346;
    $349 = $348 >>> 1;
    $350 = $349 & 2;
    $351 = $347 | $350;
    $352 = $348 >>> $350;
    $353 = $352 >>> 1;
    $354 = $353 & 1;
    $355 = $351 | $354;
    $356 = $352 >>> $354;
    $357 = (($355) + ($356))|0;
    $358 = (((2656) + ($357<<2)|0) + 304|0);
    $359 = HEAP32[$358>>2]|0;
    $t$2$ph$i = $359;
   } else {
    $t$2$ph$i = $t$1$i;
   }
   $360 = ($t$2$ph$i|0)==(0|0);
   if ($360) {
    $rsize$3$lcssa$i = $rsize$2$i;$v$3$lcssa$i = $v$2$i;
   } else {
    $rsize$329$i = $rsize$2$i;$t$228$i = $t$2$ph$i;$v$330$i = $v$2$i;
    while(1) {
     $361 = (($t$228$i) + 4|0);
     $362 = HEAP32[$361>>2]|0;
     $363 = $362 & -8;
     $364 = (($363) - ($276))|0;
     $365 = ($364>>>0)<($rsize$329$i>>>0);
     $$rsize$3$i = $365 ? $364 : $rsize$329$i;
     $t$2$v$3$i = $365 ? $t$228$i : $v$330$i;
     $366 = (($t$228$i) + 16|0);
     $367 = HEAP32[$366>>2]|0;
     $368 = ($367|0)==(0|0);
     if (!($368)) {
      $v$330$i$phi = $t$2$v$3$i;$t$228$i$phi = $367;$rsize$329$i$phi = $$rsize$3$i;$v$330$i = $v$330$i$phi;$t$228$i = $t$228$i$phi;$rsize$329$i = $rsize$329$i$phi;
      continue;
     }
     $369 = (($t$228$i) + 20|0);
     $370 = HEAP32[$369>>2]|0;
     $371 = ($370|0)==(0|0);
     if ($371) {
      $rsize$3$lcssa$i = $$rsize$3$i;$v$3$lcssa$i = $t$2$v$3$i;
      break;
     } else {
      $v$330$i$phi = $t$2$v$3$i;$rsize$329$i$phi = $$rsize$3$i;$t$228$i = $370;$v$330$i = $v$330$i$phi;$rsize$329$i = $rsize$329$i$phi;
     }
    }
   }
   $372 = ($v$3$lcssa$i|0)==(0|0);
   if ($372) {
    $nb$0 = $276;
    break;
   }
   $373 = HEAP32[(((2656) + 8|0))>>2]|0;
   $374 = (($373) - ($276))|0;
   $375 = ($rsize$3$lcssa$i>>>0)<($374>>>0);
   if (!($375)) {
    $nb$0 = $276;
    break;
   }
   $376 = $v$3$lcssa$i;
   $377 = HEAP32[(((2656) + 16|0))>>2]|0;
   $378 = ($376>>>0)<($377>>>0);
   if ($378) {
    _abort();
    // unreachable;
   }
   $379 = (($376) + ($276)|0);
   $380 = $379;
   $381 = ($376>>>0)<($379>>>0);
   if (!($381)) {
    _abort();
    // unreachable;
   }
   $382 = (($v$3$lcssa$i) + 24|0);
   $383 = HEAP32[$382>>2]|0;
   $384 = (($v$3$lcssa$i) + 12|0);
   $385 = HEAP32[$384>>2]|0;
   $386 = ($385|0)==($v$3$lcssa$i|0);
   do {
    if ($386) {
     $397 = (($v$3$lcssa$i) + 20|0);
     $398 = HEAP32[$397>>2]|0;
     $399 = ($398|0)==(0|0);
     if ($399) {
      $400 = (($v$3$lcssa$i) + 16|0);
      $401 = HEAP32[$400>>2]|0;
      $402 = ($401|0)==(0|0);
      if ($402) {
       $R$1$i20 = 0;
       break;
      } else {
       $R$0$i18 = $401;$RP$0$i17 = $400;
      }
     } else {
      $R$0$i18 = $398;$RP$0$i17 = $397;
     }
     while(1) {
      $403 = (($R$0$i18) + 20|0);
      $404 = HEAP32[$403>>2]|0;
      $405 = ($404|0)==(0|0);
      if (!($405)) {
       $RP$0$i17$phi = $403;$R$0$i18$phi = $404;$RP$0$i17 = $RP$0$i17$phi;$R$0$i18 = $R$0$i18$phi;
       continue;
      }
      $406 = (($R$0$i18) + 16|0);
      $407 = HEAP32[$406>>2]|0;
      $408 = ($407|0)==(0|0);
      if ($408) {
       break;
      } else {
       $R$0$i18 = $407;$RP$0$i17 = $406;
      }
     }
     $409 = $RP$0$i17;
     $410 = ($409>>>0)<($377>>>0);
     if ($410) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0$i17>>2] = 0;
      $R$1$i20 = $R$0$i18;
      break;
     }
    } else {
     $387 = (($v$3$lcssa$i) + 8|0);
     $388 = HEAP32[$387>>2]|0;
     $389 = $388;
     $390 = ($389>>>0)<($377>>>0);
     if ($390) {
      _abort();
      // unreachable;
     }
     $391 = (($388) + 12|0);
     $392 = HEAP32[$391>>2]|0;
     $393 = ($392|0)==($v$3$lcssa$i|0);
     if (!($393)) {
      _abort();
      // unreachable;
     }
     $394 = (($385) + 8|0);
     $395 = HEAP32[$394>>2]|0;
     $396 = ($395|0)==($v$3$lcssa$i|0);
     if ($396) {
      HEAP32[$391>>2] = $385;
      HEAP32[$394>>2] = $388;
      $R$1$i20 = $385;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $411 = ($383|0)==(0|0);
   L176: do {
    if (!($411)) {
     $412 = (($v$3$lcssa$i) + 28|0);
     $413 = HEAP32[$412>>2]|0;
     $414 = (((2656) + ($413<<2)|0) + 304|0);
     $415 = HEAP32[$414>>2]|0;
     $416 = ($v$3$lcssa$i|0)==($415|0);
     do {
      if ($416) {
       HEAP32[$414>>2] = $R$1$i20;
       $cond$i21 = ($R$1$i20|0)==(0|0);
       if (!($cond$i21)) {
        break;
       }
       $417 = 1 << $413;
       $418 = $417 ^ -1;
       $419 = HEAP32[(((2656) + 4|0))>>2]|0;
       $420 = $419 & $418;
       HEAP32[(((2656) + 4|0))>>2] = $420;
       break L176;
      } else {
       $421 = $383;
       $422 = HEAP32[(((2656) + 16|0))>>2]|0;
       $423 = ($421>>>0)<($422>>>0);
       if ($423) {
        _abort();
        // unreachable;
       }
       $424 = (($383) + 16|0);
       $425 = HEAP32[$424>>2]|0;
       $426 = ($425|0)==($v$3$lcssa$i|0);
       if ($426) {
        HEAP32[$424>>2] = $R$1$i20;
       } else {
        $427 = (($383) + 20|0);
        HEAP32[$427>>2] = $R$1$i20;
       }
       $428 = ($R$1$i20|0)==(0|0);
       if ($428) {
        break L176;
       }
      }
     } while(0);
     $429 = $R$1$i20;
     $430 = HEAP32[(((2656) + 16|0))>>2]|0;
     $431 = ($429>>>0)<($430>>>0);
     if ($431) {
      _abort();
      // unreachable;
     }
     $432 = (($R$1$i20) + 24|0);
     HEAP32[$432>>2] = $383;
     $433 = (($v$3$lcssa$i) + 16|0);
     $434 = HEAP32[$433>>2]|0;
     $435 = ($434|0)==(0|0);
     do {
      if (!($435)) {
       $436 = $434;
       $437 = HEAP32[(((2656) + 16|0))>>2]|0;
       $438 = ($436>>>0)<($437>>>0);
       if ($438) {
        _abort();
        // unreachable;
       } else {
        $439 = (($R$1$i20) + 16|0);
        HEAP32[$439>>2] = $434;
        $440 = (($434) + 24|0);
        HEAP32[$440>>2] = $R$1$i20;
        break;
       }
      }
     } while(0);
     $441 = (($v$3$lcssa$i) + 20|0);
     $442 = HEAP32[$441>>2]|0;
     $443 = ($442|0)==(0|0);
     if ($443) {
      break;
     }
     $444 = $442;
     $445 = HEAP32[(((2656) + 16|0))>>2]|0;
     $446 = ($444>>>0)<($445>>>0);
     if ($446) {
      _abort();
      // unreachable;
     } else {
      $447 = (($R$1$i20) + 20|0);
      HEAP32[$447>>2] = $442;
      $448 = (($442) + 24|0);
      HEAP32[$448>>2] = $R$1$i20;
      break;
     }
    }
   } while(0);
   $449 = ($rsize$3$lcssa$i>>>0)<(16);
   L204: do {
    if ($449) {
     $450 = (($rsize$3$lcssa$i) + ($276))|0;
     $451 = $450 | 3;
     $452 = (($v$3$lcssa$i) + 4|0);
     HEAP32[$452>>2] = $451;
     $$sum18$i = (($450) + 4)|0;
     $453 = (($376) + ($$sum18$i)|0);
     $454 = $453;
     $455 = HEAP32[$454>>2]|0;
     $456 = $455 | 1;
     HEAP32[$454>>2] = $456;
    } else {
     $457 = $276 | 3;
     $458 = (($v$3$lcssa$i) + 4|0);
     HEAP32[$458>>2] = $457;
     $459 = $rsize$3$lcssa$i | 1;
     $$sum$i2334 = $276 | 4;
     $460 = (($376) + ($$sum$i2334)|0);
     $461 = $460;
     HEAP32[$461>>2] = $459;
     $$sum1$i24 = (($rsize$3$lcssa$i) + ($276))|0;
     $462 = (($376) + ($$sum1$i24)|0);
     $463 = $462;
     HEAP32[$463>>2] = $rsize$3$lcssa$i;
     $464 = $rsize$3$lcssa$i >>> 3;
     $465 = ($rsize$3$lcssa$i>>>0)<(256);
     if ($465) {
      $466 = $464 << 1;
      $467 = (((2656) + ($466<<2)|0) + 40|0);
      $468 = $467;
      $469 = HEAP32[((2656))>>2]|0;
      $470 = 1 << $464;
      $471 = $469 & $470;
      $472 = ($471|0)==(0);
      do {
       if ($472) {
        $473 = $469 | $470;
        HEAP32[((2656))>>2] = $473;
        $$sum14$pre$i = (($466) + 2)|0;
        $$pre$i25 = (((2656) + ($$sum14$pre$i<<2)|0) + 40|0);
        $$pre$phi$i26Z2D = $$pre$i25;$F5$0$i = $468;
       } else {
        $$sum17$i = (($466) + 2)|0;
        $474 = (((2656) + ($$sum17$i<<2)|0) + 40|0);
        $475 = HEAP32[$474>>2]|0;
        $476 = $475;
        $477 = HEAP32[(((2656) + 16|0))>>2]|0;
        $478 = ($476>>>0)<($477>>>0);
        if (!($478)) {
         $$pre$phi$i26Z2D = $474;$F5$0$i = $475;
         break;
        }
        _abort();
        // unreachable;
       }
      } while(0);
      HEAP32[$$pre$phi$i26Z2D>>2] = $380;
      $479 = (($F5$0$i) + 12|0);
      HEAP32[$479>>2] = $380;
      $$sum15$i = (($276) + 8)|0;
      $480 = (($376) + ($$sum15$i)|0);
      $481 = $480;
      HEAP32[$481>>2] = $F5$0$i;
      $$sum16$i = (($276) + 12)|0;
      $482 = (($376) + ($$sum16$i)|0);
      $483 = $482;
      HEAP32[$483>>2] = $468;
      break;
     }
     $484 = $379;
     $485 = $rsize$3$lcssa$i >>> 8;
     $486 = ($485|0)==(0);
     do {
      if ($486) {
       $I7$0$i = 0;
      } else {
       $487 = ($rsize$3$lcssa$i>>>0)>(16777215);
       if ($487) {
        $I7$0$i = 31;
        break;
       }
       $488 = (($485) + 1048320)|0;
       $489 = $488 >>> 16;
       $490 = $489 & 8;
       $491 = $485 << $490;
       $492 = (($491) + 520192)|0;
       $493 = $492 >>> 16;
       $494 = $493 & 4;
       $495 = $494 | $490;
       $496 = $491 << $494;
       $497 = (($496) + 245760)|0;
       $498 = $497 >>> 16;
       $499 = $498 & 2;
       $500 = $495 | $499;
       $501 = (14 - ($500))|0;
       $502 = $496 << $499;
       $503 = $502 >>> 15;
       $504 = (($501) + ($503))|0;
       $505 = $504 << 1;
       $506 = (($504) + 7)|0;
       $507 = $rsize$3$lcssa$i >>> $506;
       $508 = $507 & 1;
       $509 = $508 | $505;
       $I7$0$i = $509;
      }
     } while(0);
     $510 = (((2656) + ($I7$0$i<<2)|0) + 304|0);
     $$sum2$i = (($276) + 28)|0;
     $511 = (($376) + ($$sum2$i)|0);
     $512 = $511;
     HEAP32[$512>>2] = $I7$0$i;
     $$sum3$i27 = (($276) + 16)|0;
     $513 = (($376) + ($$sum3$i27)|0);
     $$sum4$i28 = (($276) + 20)|0;
     $514 = (($376) + ($$sum4$i28)|0);
     $515 = $514;
     HEAP32[$515>>2] = 0;
     $516 = $513;
     HEAP32[$516>>2] = 0;
     $517 = HEAP32[(((2656) + 4|0))>>2]|0;
     $518 = 1 << $I7$0$i;
     $519 = $517 & $518;
     $520 = ($519|0)==(0);
     if ($520) {
      $521 = $517 | $518;
      HEAP32[(((2656) + 4|0))>>2] = $521;
      HEAP32[$510>>2] = $484;
      $522 = $510;
      $$sum5$i = (($276) + 24)|0;
      $523 = (($376) + ($$sum5$i)|0);
      $524 = $523;
      HEAP32[$524>>2] = $522;
      $$sum6$i = (($276) + 12)|0;
      $525 = (($376) + ($$sum6$i)|0);
      $526 = $525;
      HEAP32[$526>>2] = $484;
      $$sum7$i = (($276) + 8)|0;
      $527 = (($376) + ($$sum7$i)|0);
      $528 = $527;
      HEAP32[$528>>2] = $484;
      break;
     }
     $529 = HEAP32[$510>>2]|0;
     $530 = ($I7$0$i|0)==(31);
     if ($530) {
      $533 = 0;
     } else {
      $531 = $I7$0$i >>> 1;
      $532 = (25 - ($531))|0;
      $533 = $532;
     }
     $534 = (($529) + 4|0);
     $535 = HEAP32[$534>>2]|0;
     $536 = $535 & -8;
     $537 = ($536|0)==($rsize$3$lcssa$i|0);
     L225: do {
      if ($537) {
       $T$0$lcssa$i = $529;
      } else {
       $538 = $rsize$3$lcssa$i << $533;
       $K12$025$i = $538;$T$024$i = $529;
       while(1) {
        $544 = $K12$025$i >>> 31;
        $545 = ((($T$024$i) + ($544<<2)|0) + 16|0);
        $546 = HEAP32[$545>>2]|0;
        $547 = ($546|0)==(0|0);
        if ($547) {
         break;
        }
        $539 = $K12$025$i << 1;
        $540 = (($546) + 4|0);
        $541 = HEAP32[$540>>2]|0;
        $542 = $541 & -8;
        $543 = ($542|0)==($rsize$3$lcssa$i|0);
        if ($543) {
         $T$0$lcssa$i = $546;
         break L225;
        } else {
         $T$024$i$phi = $546;$K12$025$i = $539;$T$024$i = $T$024$i$phi;
        }
       }
       $548 = $545;
       $549 = HEAP32[(((2656) + 16|0))>>2]|0;
       $550 = ($548>>>0)<($549>>>0);
       if ($550) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$545>>2] = $484;
        $$sum11$i = (($276) + 24)|0;
        $551 = (($376) + ($$sum11$i)|0);
        $552 = $551;
        HEAP32[$552>>2] = $T$024$i;
        $$sum12$i = (($276) + 12)|0;
        $553 = (($376) + ($$sum12$i)|0);
        $554 = $553;
        HEAP32[$554>>2] = $484;
        $$sum13$i = (($276) + 8)|0;
        $555 = (($376) + ($$sum13$i)|0);
        $556 = $555;
        HEAP32[$556>>2] = $484;
        break L204;
       }
      }
     } while(0);
     $557 = (($T$0$lcssa$i) + 8|0);
     $558 = HEAP32[$557>>2]|0;
     $559 = $T$0$lcssa$i;
     $560 = HEAP32[(((2656) + 16|0))>>2]|0;
     $561 = ($559>>>0)<($560>>>0);
     if ($561) {
      _abort();
      // unreachable;
     }
     $562 = $558;
     $563 = ($562>>>0)<($560>>>0);
     if ($563) {
      _abort();
      // unreachable;
     } else {
      $564 = (($558) + 12|0);
      HEAP32[$564>>2] = $484;
      HEAP32[$557>>2] = $484;
      $$sum8$i = (($276) + 8)|0;
      $565 = (($376) + ($$sum8$i)|0);
      $566 = $565;
      HEAP32[$566>>2] = $558;
      $$sum9$i = (($276) + 12)|0;
      $567 = (($376) + ($$sum9$i)|0);
      $568 = $567;
      HEAP32[$568>>2] = $T$0$lcssa$i;
      $$sum10$i = (($276) + 24)|0;
      $569 = (($376) + ($$sum10$i)|0);
      $570 = $569;
      HEAP32[$570>>2] = 0;
      break;
     }
    }
   } while(0);
   $571 = (($v$3$lcssa$i) + 8|0);
   $572 = $571;
   $mem$0 = $572;
   STACKTOP = sp;return ($mem$0|0);
  }
 } while(0);
 $573 = HEAP32[(((2656) + 8|0))>>2]|0;
 $574 = ($nb$0>>>0)>($573>>>0);
 if (!($574)) {
  $575 = (($573) - ($nb$0))|0;
  $576 = HEAP32[(((2656) + 20|0))>>2]|0;
  $577 = ($575>>>0)>(15);
  if ($577) {
   $578 = $576;
   $579 = (($578) + ($nb$0)|0);
   $580 = $579;
   HEAP32[(((2656) + 20|0))>>2] = $580;
   HEAP32[(((2656) + 8|0))>>2] = $575;
   $581 = $575 | 1;
   $$sum2 = (($nb$0) + 4)|0;
   $582 = (($578) + ($$sum2)|0);
   $583 = $582;
   HEAP32[$583>>2] = $581;
   $584 = (($578) + ($573)|0);
   $585 = $584;
   HEAP32[$585>>2] = $575;
   $586 = $nb$0 | 3;
   $587 = (($576) + 4|0);
   HEAP32[$587>>2] = $586;
  } else {
   HEAP32[(((2656) + 8|0))>>2] = 0;
   HEAP32[(((2656) + 20|0))>>2] = 0;
   $588 = $573 | 3;
   $589 = (($576) + 4|0);
   HEAP32[$589>>2] = $588;
   $590 = $576;
   $$sum1 = (($573) + 4)|0;
   $591 = (($590) + ($$sum1)|0);
   $592 = $591;
   $593 = HEAP32[$592>>2]|0;
   $594 = $593 | 1;
   HEAP32[$592>>2] = $594;
  }
  $595 = (($576) + 8|0);
  $596 = $595;
  $mem$0 = $596;
  STACKTOP = sp;return ($mem$0|0);
 }
 $597 = HEAP32[(((2656) + 12|0))>>2]|0;
 $598 = ($nb$0>>>0)<($597>>>0);
 if ($598) {
  $599 = (($597) - ($nb$0))|0;
  HEAP32[(((2656) + 12|0))>>2] = $599;
  $600 = HEAP32[(((2656) + 24|0))>>2]|0;
  $601 = $600;
  $602 = (($601) + ($nb$0)|0);
  $603 = $602;
  HEAP32[(((2656) + 24|0))>>2] = $603;
  $604 = $599 | 1;
  $$sum = (($nb$0) + 4)|0;
  $605 = (($601) + ($$sum)|0);
  $606 = $605;
  HEAP32[$606>>2] = $604;
  $607 = $nb$0 | 3;
  $608 = (($600) + 4|0);
  HEAP32[$608>>2] = $607;
  $609 = (($600) + 8|0);
  $610 = $609;
  $mem$0 = $610;
  STACKTOP = sp;return ($mem$0|0);
 }
 $611 = HEAP32[((3128))>>2]|0;
 $612 = ($611|0)==(0);
 do {
  if ($612) {
   $613 = (_sysconf(30)|0);
   $614 = (($613) + -1)|0;
   $615 = $614 & $613;
   $616 = ($615|0)==(0);
   if ($616) {
    HEAP32[(((3128) + 8|0))>>2] = $613;
    HEAP32[(((3128) + 4|0))>>2] = $613;
    HEAP32[(((3128) + 12|0))>>2] = -1;
    HEAP32[(((3128) + 16|0))>>2] = -1;
    HEAP32[(((3128) + 20|0))>>2] = 0;
    HEAP32[(((2656) + 444|0))>>2] = 0;
    $617 = (_time((0|0))|0);
    $618 = $617 & -16;
    $619 = $618 ^ 1431655768;
    HEAP32[((3128))>>2] = $619;
    break;
   } else {
    _abort();
    // unreachable;
   }
  }
 } while(0);
 $620 = (($nb$0) + 48)|0;
 $621 = HEAP32[(((3128) + 8|0))>>2]|0;
 $622 = (($nb$0) + 47)|0;
 $623 = (($621) + ($622))|0;
 $624 = (0 - ($621))|0;
 $625 = $623 & $624;
 $626 = ($625>>>0)>($nb$0>>>0);
 if (!($626)) {
  $mem$0 = 0;
  STACKTOP = sp;return ($mem$0|0);
 }
 $627 = HEAP32[(((2656) + 440|0))>>2]|0;
 $628 = ($627|0)==(0);
 do {
  if (!($628)) {
   $629 = HEAP32[(((2656) + 432|0))>>2]|0;
   $630 = (($629) + ($625))|0;
   $631 = ($630>>>0)<=($629>>>0);
   $632 = ($630>>>0)>($627>>>0);
   $or$cond1$i = $631 | $632;
   if ($or$cond1$i) {
    $mem$0 = 0;
   } else {
    break;
   }
   STACKTOP = sp;return ($mem$0|0);
  }
 } while(0);
 $633 = HEAP32[(((2656) + 444|0))>>2]|0;
 $634 = $633 & 4;
 $635 = ($634|0)==(0);
 L269: do {
  if ($635) {
   $636 = HEAP32[(((2656) + 24|0))>>2]|0;
   $637 = ($636|0)==(0|0);
   L271: do {
    if ($637) {
     label = 182;
    } else {
     $638 = $636;
     $sp$0$i$i = (((2656) + 448|0));
     while(1) {
      $639 = ($sp$0$i$i);
      $640 = HEAP32[$639>>2]|0;
      $641 = ($640>>>0)>($638>>>0);
      if (!($641)) {
       $642 = (($sp$0$i$i) + 4|0);
       $643 = HEAP32[$642>>2]|0;
       $644 = (($640) + ($643)|0);
       $645 = ($644>>>0)>($638>>>0);
       if ($645) {
        break;
       }
      }
      $646 = (($sp$0$i$i) + 8|0);
      $647 = HEAP32[$646>>2]|0;
      $648 = ($647|0)==(0|0);
      if ($648) {
       label = 182;
       break L271;
      } else {
       $sp$0$i$i = $647;
      }
     }
     $649 = ($sp$0$i$i|0)==(0|0);
     if ($649) {
      label = 182;
      break;
     }
     $672 = HEAP32[(((2656) + 12|0))>>2]|0;
     $673 = (($623) - ($672))|0;
     $674 = $673 & $624;
     $675 = ($674>>>0)<(2147483647);
     if (!($675)) {
      $tsize$0323841$i = 0;
      break;
     }
     $676 = (_sbrk(($674|0))|0);
     $677 = HEAP32[$639>>2]|0;
     $678 = HEAP32[$642>>2]|0;
     $679 = (($677) + ($678)|0);
     $680 = ($676|0)==($679|0);
     $$3$i = $680 ? $674 : 0;
     $$4$i = $680 ? $676 : (-1);
     $br$0$i = $676;$ssize$1$i = $674;$tbase$0$i = $$4$i;$tsize$0$i = $$3$i;
     label = 191;
    }
   } while(0);
   do {
    if ((label|0) == 182) {
     $650 = (_sbrk(0)|0);
     $651 = ($650|0)==((-1)|0);
     if ($651) {
      $tsize$0323841$i = 0;
      break;
     }
     $652 = $650;
     $653 = HEAP32[(((3128) + 4|0))>>2]|0;
     $654 = (($653) + -1)|0;
     $655 = $654 & $652;
     $656 = ($655|0)==(0);
     if ($656) {
      $ssize$0$i = $625;
     } else {
      $657 = (($654) + ($652))|0;
      $658 = (0 - ($653))|0;
      $659 = $657 & $658;
      $660 = (($625) - ($652))|0;
      $661 = (($660) + ($659))|0;
      $ssize$0$i = $661;
     }
     $662 = HEAP32[(((2656) + 432|0))>>2]|0;
     $663 = (($662) + ($ssize$0$i))|0;
     $664 = ($ssize$0$i>>>0)>($nb$0>>>0);
     $665 = ($ssize$0$i>>>0)<(2147483647);
     $or$cond$i29 = $664 & $665;
     if (!($or$cond$i29)) {
      $tsize$0323841$i = 0;
      break;
     }
     $666 = HEAP32[(((2656) + 440|0))>>2]|0;
     $667 = ($666|0)==(0);
     if (!($667)) {
      $668 = ($663>>>0)<=($662>>>0);
      $669 = ($663>>>0)>($666>>>0);
      $or$cond2$i = $668 | $669;
      if ($or$cond2$i) {
       $tsize$0323841$i = 0;
       break;
      }
     }
     $670 = (_sbrk(($ssize$0$i|0))|0);
     $671 = ($670|0)==($650|0);
     $ssize$0$$i = $671 ? $ssize$0$i : 0;
     $$$i = $671 ? $650 : (-1);
     $br$0$i = $670;$ssize$1$i = $ssize$0$i;$tbase$0$i = $$$i;$tsize$0$i = $ssize$0$$i;
     label = 191;
    }
   } while(0);
   L291: do {
    if ((label|0) == 191) {
     $681 = (0 - ($ssize$1$i))|0;
     $682 = ($tbase$0$i|0)==((-1)|0);
     if (!($682)) {
      $tbase$247$i = $tbase$0$i;$tsize$246$i = $tsize$0$i;
      label = 202;
      break L269;
     }
     $683 = ($br$0$i|0)!=((-1)|0);
     $684 = ($ssize$1$i>>>0)<(2147483647);
     $or$cond5$i = $683 & $684;
     $685 = ($ssize$1$i>>>0)<($620>>>0);
     $or$cond6$i = $or$cond5$i & $685;
     do {
      if ($or$cond6$i) {
       $686 = HEAP32[(((3128) + 8|0))>>2]|0;
       $687 = (($622) - ($ssize$1$i))|0;
       $688 = (($687) + ($686))|0;
       $689 = (0 - ($686))|0;
       $690 = $688 & $689;
       $691 = ($690>>>0)<(2147483647);
       if (!($691)) {
        $ssize$2$i = $ssize$1$i;
        break;
       }
       $692 = (_sbrk(($690|0))|0);
       $693 = ($692|0)==((-1)|0);
       if ($693) {
        (_sbrk(($681|0))|0);
        $tsize$0323841$i = $tsize$0$i;
        break L291;
       } else {
        $694 = (($690) + ($ssize$1$i))|0;
        $ssize$2$i = $694;
        break;
       }
      } else {
       $ssize$2$i = $ssize$1$i;
      }
     } while(0);
     $695 = ($br$0$i|0)==((-1)|0);
     if ($695) {
      $tsize$0323841$i = $tsize$0$i;
     } else {
      $tbase$247$i = $br$0$i;$tsize$246$i = $ssize$2$i;
      label = 202;
      break L269;
     }
    }
   } while(0);
   $696 = HEAP32[(((2656) + 444|0))>>2]|0;
   $697 = $696 | 4;
   HEAP32[(((2656) + 444|0))>>2] = $697;
   $tsize$1$i = $tsize$0323841$i;
   label = 199;
  } else {
   $tsize$1$i = 0;
   label = 199;
  }
 } while(0);
 do {
  if ((label|0) == 199) {
   $698 = ($625>>>0)<(2147483647);
   if (!($698)) {
    break;
   }
   $699 = (_sbrk(($625|0))|0);
   $700 = (_sbrk(0)|0);
   $notlhs$i = ($699|0)!=((-1)|0);
   $notrhs$i = ($700|0)!=((-1)|0);
   $or$cond8$not$i = $notrhs$i & $notlhs$i;
   $701 = ($699>>>0)<($700>>>0);
   $or$cond9$i = $or$cond8$not$i & $701;
   if (!($or$cond9$i)) {
    break;
   }
   $702 = $700;
   $703 = $699;
   $704 = (($702) - ($703))|0;
   $705 = (($nb$0) + 40)|0;
   $706 = ($704>>>0)>($705>>>0);
   $$tsize$1$i = $706 ? $704 : $tsize$1$i;
   if ($706) {
    $tbase$247$i = $699;$tsize$246$i = $$tsize$1$i;
    label = 202;
   }
  }
 } while(0);
 do {
  if ((label|0) == 202) {
   $707 = HEAP32[(((2656) + 432|0))>>2]|0;
   $708 = (($707) + ($tsize$246$i))|0;
   HEAP32[(((2656) + 432|0))>>2] = $708;
   $709 = HEAP32[(((2656) + 436|0))>>2]|0;
   $710 = ($708>>>0)>($709>>>0);
   if ($710) {
    HEAP32[(((2656) + 436|0))>>2] = $708;
   }
   $711 = HEAP32[(((2656) + 24|0))>>2]|0;
   $712 = ($711|0)==(0|0);
   L311: do {
    if ($712) {
     $713 = HEAP32[(((2656) + 16|0))>>2]|0;
     $714 = ($713|0)==(0|0);
     $715 = ($tbase$247$i>>>0)<($713>>>0);
     $or$cond10$i = $714 | $715;
     if ($or$cond10$i) {
      HEAP32[(((2656) + 16|0))>>2] = $tbase$247$i;
     }
     HEAP32[(((2656) + 448|0))>>2] = $tbase$247$i;
     HEAP32[(((2656) + 452|0))>>2] = $tsize$246$i;
     HEAP32[(((2656) + 460|0))>>2] = 0;
     $716 = HEAP32[((3128))>>2]|0;
     HEAP32[(((2656) + 36|0))>>2] = $716;
     HEAP32[(((2656) + 32|0))>>2] = -1;
     $i$02$i$i = 0;
     while(1) {
      $717 = $i$02$i$i << 1;
      $718 = (((2656) + ($717<<2)|0) + 40|0);
      $719 = $718;
      $$sum$i$i = (($717) + 3)|0;
      $720 = (((2656) + ($$sum$i$i<<2)|0) + 40|0);
      HEAP32[$720>>2] = $719;
      $$sum1$i$i = (($717) + 2)|0;
      $721 = (((2656) + ($$sum1$i$i<<2)|0) + 40|0);
      HEAP32[$721>>2] = $719;
      $722 = (($i$02$i$i) + 1)|0;
      $exitcond$i$i = ($722|0)==(32);
      if ($exitcond$i$i) {
       break;
      } else {
       $i$02$i$i$phi = $722;$i$02$i$i = $i$02$i$i$phi;
      }
     }
     $723 = (($tsize$246$i) + -40)|0;
     $724 = (($tbase$247$i) + 8|0);
     $725 = $724;
     $726 = $725 & 7;
     $727 = ($726|0)==(0);
     if ($727) {
      $730 = 0;
     } else {
      $728 = (0 - ($725))|0;
      $729 = $728 & 7;
      $730 = $729;
     }
     $731 = (($tbase$247$i) + ($730)|0);
     $732 = $731;
     $733 = (($723) - ($730))|0;
     HEAP32[(((2656) + 24|0))>>2] = $732;
     HEAP32[(((2656) + 12|0))>>2] = $733;
     $734 = $733 | 1;
     $$sum$i14$i = (($730) + 4)|0;
     $735 = (($tbase$247$i) + ($$sum$i14$i)|0);
     $736 = $735;
     HEAP32[$736>>2] = $734;
     $$sum2$i$i = (($tsize$246$i) + -36)|0;
     $737 = (($tbase$247$i) + ($$sum2$i$i)|0);
     $738 = $737;
     HEAP32[$738>>2] = 40;
     $739 = HEAP32[(((3128) + 16|0))>>2]|0;
     HEAP32[(((2656) + 28|0))>>2] = $739;
    } else {
     $sp$075$i = (((2656) + 448|0));
     while(1) {
      $740 = ($sp$075$i);
      $741 = HEAP32[$740>>2]|0;
      $742 = (($sp$075$i) + 4|0);
      $743 = HEAP32[$742>>2]|0;
      $744 = (($741) + ($743)|0);
      $745 = ($tbase$247$i|0)==($744|0);
      if ($745) {
       label = 214;
       break;
      }
      $746 = (($sp$075$i) + 8|0);
      $747 = HEAP32[$746>>2]|0;
      $748 = ($747|0)==(0|0);
      if ($748) {
       break;
      } else {
       $sp$075$i = $747;
      }
     }
     do {
      if ((label|0) == 214) {
       $749 = (($sp$075$i) + 12|0);
       $750 = HEAP32[$749>>2]|0;
       $751 = $750 & 8;
       $752 = ($751|0)==(0);
       if (!($752)) {
        break;
       }
       $753 = $711;
       $754 = ($753>>>0)>=($741>>>0);
       $755 = ($753>>>0)<($tbase$247$i>>>0);
       $or$cond49$i = $754 & $755;
       if (!($or$cond49$i)) {
        break;
       }
       $756 = (($743) + ($tsize$246$i))|0;
       HEAP32[$742>>2] = $756;
       $757 = HEAP32[(((2656) + 12|0))>>2]|0;
       $758 = (($757) + ($tsize$246$i))|0;
       $759 = (($711) + 8|0);
       $760 = $759;
       $761 = $760 & 7;
       $762 = ($761|0)==(0);
       if ($762) {
        $765 = 0;
       } else {
        $763 = (0 - ($760))|0;
        $764 = $763 & 7;
        $765 = $764;
       }
       $766 = (($753) + ($765)|0);
       $767 = $766;
       $768 = (($758) - ($765))|0;
       HEAP32[(((2656) + 24|0))>>2] = $767;
       HEAP32[(((2656) + 12|0))>>2] = $768;
       $769 = $768 | 1;
       $$sum$i18$i = (($765) + 4)|0;
       $770 = (($753) + ($$sum$i18$i)|0);
       $771 = $770;
       HEAP32[$771>>2] = $769;
       $$sum2$i19$i = (($758) + 4)|0;
       $772 = (($753) + ($$sum2$i19$i)|0);
       $773 = $772;
       HEAP32[$773>>2] = 40;
       $774 = HEAP32[(((3128) + 16|0))>>2]|0;
       HEAP32[(((2656) + 28|0))>>2] = $774;
       break L311;
      }
     } while(0);
     $775 = HEAP32[(((2656) + 16|0))>>2]|0;
     $776 = ($tbase$247$i>>>0)<($775>>>0);
     if ($776) {
      HEAP32[(((2656) + 16|0))>>2] = $tbase$247$i;
     }
     $777 = (($tbase$247$i) + ($tsize$246$i)|0);
     $sp$168$i = (((2656) + 448|0));
     while(1) {
      $778 = ($sp$168$i);
      $779 = HEAP32[$778>>2]|0;
      $780 = ($779|0)==($777|0);
      if ($780) {
       label = 224;
       break;
      }
      $781 = (($sp$168$i) + 8|0);
      $782 = HEAP32[$781>>2]|0;
      $783 = ($782|0)==(0|0);
      if ($783) {
       break;
      } else {
       $sp$168$i = $782;
      }
     }
     do {
      if ((label|0) == 224) {
       $784 = (($sp$168$i) + 12|0);
       $785 = HEAP32[$784>>2]|0;
       $786 = $785 & 8;
       $787 = ($786|0)==(0);
       if (!($787)) {
        break;
       }
       HEAP32[$778>>2] = $tbase$247$i;
       $788 = (($sp$168$i) + 4|0);
       $789 = HEAP32[$788>>2]|0;
       $790 = (($789) + ($tsize$246$i))|0;
       HEAP32[$788>>2] = $790;
       $791 = (($tbase$247$i) + 8|0);
       $792 = $791;
       $793 = $792 & 7;
       $794 = ($793|0)==(0);
       if ($794) {
        $797 = 0;
       } else {
        $795 = (0 - ($792))|0;
        $796 = $795 & 7;
        $797 = $796;
       }
       $798 = (($tbase$247$i) + ($797)|0);
       $$sum107$i = (($tsize$246$i) + 8)|0;
       $799 = (($tbase$247$i) + ($$sum107$i)|0);
       $800 = $799;
       $801 = $800 & 7;
       $802 = ($801|0)==(0);
       if ($802) {
        $805 = 0;
       } else {
        $803 = (0 - ($800))|0;
        $804 = $803 & 7;
        $805 = $804;
       }
       $$sum108$i = (($805) + ($tsize$246$i))|0;
       $806 = (($tbase$247$i) + ($$sum108$i)|0);
       $807 = $806;
       $808 = $806;
       $809 = $798;
       $810 = (($808) - ($809))|0;
       $$sum$i21$i = (($797) + ($nb$0))|0;
       $811 = (($tbase$247$i) + ($$sum$i21$i)|0);
       $812 = $811;
       $813 = (($810) - ($nb$0))|0;
       $814 = $nb$0 | 3;
       $$sum1$i22$i = (($797) + 4)|0;
       $815 = (($tbase$247$i) + ($$sum1$i22$i)|0);
       $816 = $815;
       HEAP32[$816>>2] = $814;
       $817 = HEAP32[(((2656) + 24|0))>>2]|0;
       $818 = ($807|0)==($817|0);
       L348: do {
        if ($818) {
         $819 = HEAP32[(((2656) + 12|0))>>2]|0;
         $820 = (($819) + ($813))|0;
         HEAP32[(((2656) + 12|0))>>2] = $820;
         HEAP32[(((2656) + 24|0))>>2] = $812;
         $821 = $820 | 1;
         $$sum42$i$i = (($$sum$i21$i) + 4)|0;
         $822 = (($tbase$247$i) + ($$sum42$i$i)|0);
         $823 = $822;
         HEAP32[$823>>2] = $821;
        } else {
         $824 = HEAP32[(((2656) + 20|0))>>2]|0;
         $825 = ($807|0)==($824|0);
         if ($825) {
          $826 = HEAP32[(((2656) + 8|0))>>2]|0;
          $827 = (($826) + ($813))|0;
          HEAP32[(((2656) + 8|0))>>2] = $827;
          HEAP32[(((2656) + 20|0))>>2] = $812;
          $828 = $827 | 1;
          $$sum40$i$i = (($$sum$i21$i) + 4)|0;
          $829 = (($tbase$247$i) + ($$sum40$i$i)|0);
          $830 = $829;
          HEAP32[$830>>2] = $828;
          $$sum41$i$i = (($827) + ($$sum$i21$i))|0;
          $831 = (($tbase$247$i) + ($$sum41$i$i)|0);
          $832 = $831;
          HEAP32[$832>>2] = $827;
          break;
         }
         $$sum2$i23$i = (($tsize$246$i) + 4)|0;
         $$sum109$i = (($$sum2$i23$i) + ($805))|0;
         $833 = (($tbase$247$i) + ($$sum109$i)|0);
         $834 = $833;
         $835 = HEAP32[$834>>2]|0;
         $836 = $835 & 3;
         $837 = ($836|0)==(1);
         if ($837) {
          $838 = $835 & -8;
          $839 = $835 >>> 3;
          $840 = ($835>>>0)<(256);
          L356: do {
           if ($840) {
            $$sum3738$i$i = $805 | 8;
            $$sum119$i = (($$sum3738$i$i) + ($tsize$246$i))|0;
            $841 = (($tbase$247$i) + ($$sum119$i)|0);
            $842 = $841;
            $843 = HEAP32[$842>>2]|0;
            $$sum39$i$i = (($tsize$246$i) + 12)|0;
            $$sum120$i = (($$sum39$i$i) + ($805))|0;
            $844 = (($tbase$247$i) + ($$sum120$i)|0);
            $845 = $844;
            $846 = HEAP32[$845>>2]|0;
            $847 = $839 << 1;
            $848 = (((2656) + ($847<<2)|0) + 40|0);
            $849 = $848;
            $850 = ($843|0)==($849|0);
            do {
             if (!($850)) {
              $851 = $843;
              $852 = HEAP32[(((2656) + 16|0))>>2]|0;
              $853 = ($851>>>0)<($852>>>0);
              if ($853) {
               _abort();
               // unreachable;
              }
              $854 = (($843) + 12|0);
              $855 = HEAP32[$854>>2]|0;
              $856 = ($855|0)==($807|0);
              if ($856) {
               break;
              }
              _abort();
              // unreachable;
             }
            } while(0);
            $857 = ($846|0)==($843|0);
            if ($857) {
             $858 = 1 << $839;
             $859 = $858 ^ -1;
             $860 = HEAP32[((2656))>>2]|0;
             $861 = $860 & $859;
             HEAP32[((2656))>>2] = $861;
             break;
            }
            $862 = ($846|0)==($849|0);
            do {
             if ($862) {
              $$pre57$i$i = (($846) + 8|0);
              $$pre$phi58$i$iZ2D = $$pre57$i$i;
             } else {
              $863 = $846;
              $864 = HEAP32[(((2656) + 16|0))>>2]|0;
              $865 = ($863>>>0)<($864>>>0);
              if ($865) {
               _abort();
               // unreachable;
              }
              $866 = (($846) + 8|0);
              $867 = HEAP32[$866>>2]|0;
              $868 = ($867|0)==($807|0);
              if ($868) {
               $$pre$phi58$i$iZ2D = $866;
               break;
              }
              _abort();
              // unreachable;
             }
            } while(0);
            $869 = (($843) + 12|0);
            HEAP32[$869>>2] = $846;
            HEAP32[$$pre$phi58$i$iZ2D>>2] = $843;
           } else {
            $870 = $806;
            $$sum34$i$i = $805 | 24;
            $$sum110$i = (($$sum34$i$i) + ($tsize$246$i))|0;
            $871 = (($tbase$247$i) + ($$sum110$i)|0);
            $872 = $871;
            $873 = HEAP32[$872>>2]|0;
            $$sum5$i$i = (($tsize$246$i) + 12)|0;
            $$sum111$i = (($$sum5$i$i) + ($805))|0;
            $874 = (($tbase$247$i) + ($$sum111$i)|0);
            $875 = $874;
            $876 = HEAP32[$875>>2]|0;
            $877 = ($876|0)==($870|0);
            do {
             if ($877) {
              $$sum67$i$i = $805 | 16;
              $$sum117$i = (($$sum2$i23$i) + ($$sum67$i$i))|0;
              $890 = (($tbase$247$i) + ($$sum117$i)|0);
              $891 = $890;
              $892 = HEAP32[$891>>2]|0;
              $893 = ($892|0)==(0|0);
              if ($893) {
               $$sum118$i = (($$sum67$i$i) + ($tsize$246$i))|0;
               $894 = (($tbase$247$i) + ($$sum118$i)|0);
               $895 = $894;
               $896 = HEAP32[$895>>2]|0;
               $897 = ($896|0)==(0|0);
               if ($897) {
                $R$1$i$i = 0;
                break;
               } else {
                $R$0$i$i = $896;$RP$0$i$i = $895;
               }
              } else {
               $R$0$i$i = $892;$RP$0$i$i = $891;
              }
              while(1) {
               $898 = (($R$0$i$i) + 20|0);
               $899 = HEAP32[$898>>2]|0;
               $900 = ($899|0)==(0|0);
               if (!($900)) {
                $RP$0$i$i$phi = $898;$R$0$i$i$phi = $899;$RP$0$i$i = $RP$0$i$i$phi;$R$0$i$i = $R$0$i$i$phi;
                continue;
               }
               $901 = (($R$0$i$i) + 16|0);
               $902 = HEAP32[$901>>2]|0;
               $903 = ($902|0)==(0|0);
               if ($903) {
                break;
               } else {
                $R$0$i$i = $902;$RP$0$i$i = $901;
               }
              }
              $904 = $RP$0$i$i;
              $905 = HEAP32[(((2656) + 16|0))>>2]|0;
              $906 = ($904>>>0)<($905>>>0);
              if ($906) {
               _abort();
               // unreachable;
              } else {
               HEAP32[$RP$0$i$i>>2] = 0;
               $R$1$i$i = $R$0$i$i;
               break;
              }
             } else {
              $$sum3536$i$i = $805 | 8;
              $$sum112$i = (($$sum3536$i$i) + ($tsize$246$i))|0;
              $878 = (($tbase$247$i) + ($$sum112$i)|0);
              $879 = $878;
              $880 = HEAP32[$879>>2]|0;
              $881 = $880;
              $882 = HEAP32[(((2656) + 16|0))>>2]|0;
              $883 = ($881>>>0)<($882>>>0);
              if ($883) {
               _abort();
               // unreachable;
              }
              $884 = (($880) + 12|0);
              $885 = HEAP32[$884>>2]|0;
              $886 = ($885|0)==($870|0);
              if (!($886)) {
               _abort();
               // unreachable;
              }
              $887 = (($876) + 8|0);
              $888 = HEAP32[$887>>2]|0;
              $889 = ($888|0)==($870|0);
              if ($889) {
               HEAP32[$884>>2] = $876;
               HEAP32[$887>>2] = $880;
               $R$1$i$i = $876;
               break;
              } else {
               _abort();
               // unreachable;
              }
             }
            } while(0);
            $907 = ($873|0)==(0|0);
            if ($907) {
             break;
            }
            $$sum30$i$i = (($tsize$246$i) + 28)|0;
            $$sum113$i = (($$sum30$i$i) + ($805))|0;
            $908 = (($tbase$247$i) + ($$sum113$i)|0);
            $909 = $908;
            $910 = HEAP32[$909>>2]|0;
            $911 = (((2656) + ($910<<2)|0) + 304|0);
            $912 = HEAP32[$911>>2]|0;
            $913 = ($870|0)==($912|0);
            do {
             if ($913) {
              HEAP32[$911>>2] = $R$1$i$i;
              $cond$i$i = ($R$1$i$i|0)==(0|0);
              if (!($cond$i$i)) {
               break;
              }
              $914 = 1 << $910;
              $915 = $914 ^ -1;
              $916 = HEAP32[(((2656) + 4|0))>>2]|0;
              $917 = $916 & $915;
              HEAP32[(((2656) + 4|0))>>2] = $917;
              break L356;
             } else {
              $918 = $873;
              $919 = HEAP32[(((2656) + 16|0))>>2]|0;
              $920 = ($918>>>0)<($919>>>0);
              if ($920) {
               _abort();
               // unreachable;
              }
              $921 = (($873) + 16|0);
              $922 = HEAP32[$921>>2]|0;
              $923 = ($922|0)==($870|0);
              if ($923) {
               HEAP32[$921>>2] = $R$1$i$i;
              } else {
               $924 = (($873) + 20|0);
               HEAP32[$924>>2] = $R$1$i$i;
              }
              $925 = ($R$1$i$i|0)==(0|0);
              if ($925) {
               break L356;
              }
             }
            } while(0);
            $926 = $R$1$i$i;
            $927 = HEAP32[(((2656) + 16|0))>>2]|0;
            $928 = ($926>>>0)<($927>>>0);
            if ($928) {
             _abort();
             // unreachable;
            }
            $929 = (($R$1$i$i) + 24|0);
            HEAP32[$929>>2] = $873;
            $$sum3132$i$i = $805 | 16;
            $$sum114$i = (($$sum3132$i$i) + ($tsize$246$i))|0;
            $930 = (($tbase$247$i) + ($$sum114$i)|0);
            $931 = $930;
            $932 = HEAP32[$931>>2]|0;
            $933 = ($932|0)==(0|0);
            do {
             if (!($933)) {
              $934 = $932;
              $935 = HEAP32[(((2656) + 16|0))>>2]|0;
              $936 = ($934>>>0)<($935>>>0);
              if ($936) {
               _abort();
               // unreachable;
              } else {
               $937 = (($R$1$i$i) + 16|0);
               HEAP32[$937>>2] = $932;
               $938 = (($932) + 24|0);
               HEAP32[$938>>2] = $R$1$i$i;
               break;
              }
             }
            } while(0);
            $$sum115$i = (($$sum2$i23$i) + ($$sum3132$i$i))|0;
            $939 = (($tbase$247$i) + ($$sum115$i)|0);
            $940 = $939;
            $941 = HEAP32[$940>>2]|0;
            $942 = ($941|0)==(0|0);
            if ($942) {
             break;
            }
            $943 = $941;
            $944 = HEAP32[(((2656) + 16|0))>>2]|0;
            $945 = ($943>>>0)<($944>>>0);
            if ($945) {
             _abort();
             // unreachable;
            } else {
             $946 = (($R$1$i$i) + 20|0);
             HEAP32[$946>>2] = $941;
             $947 = (($941) + 24|0);
             HEAP32[$947>>2] = $R$1$i$i;
             break;
            }
           }
          } while(0);
          $$sum9$i$i = $838 | $805;
          $$sum116$i = (($$sum9$i$i) + ($tsize$246$i))|0;
          $948 = (($tbase$247$i) + ($$sum116$i)|0);
          $949 = $948;
          $950 = (($838) + ($813))|0;
          $oldfirst$0$i$i = $949;$qsize$0$i$i = $950;
         } else {
          $oldfirst$0$i$i = $807;$qsize$0$i$i = $813;
         }
         $951 = (($oldfirst$0$i$i) + 4|0);
         $952 = HEAP32[$951>>2]|0;
         $953 = $952 & -2;
         HEAP32[$951>>2] = $953;
         $954 = $qsize$0$i$i | 1;
         $$sum10$i$i = (($$sum$i21$i) + 4)|0;
         $955 = (($tbase$247$i) + ($$sum10$i$i)|0);
         $956 = $955;
         HEAP32[$956>>2] = $954;
         $$sum11$i24$i = (($qsize$0$i$i) + ($$sum$i21$i))|0;
         $957 = (($tbase$247$i) + ($$sum11$i24$i)|0);
         $958 = $957;
         HEAP32[$958>>2] = $qsize$0$i$i;
         $959 = $qsize$0$i$i >>> 3;
         $960 = ($qsize$0$i$i>>>0)<(256);
         if ($960) {
          $961 = $959 << 1;
          $962 = (((2656) + ($961<<2)|0) + 40|0);
          $963 = $962;
          $964 = HEAP32[((2656))>>2]|0;
          $965 = 1 << $959;
          $966 = $964 & $965;
          $967 = ($966|0)==(0);
          do {
           if ($967) {
            $968 = $964 | $965;
            HEAP32[((2656))>>2] = $968;
            $$sum26$pre$i$i = (($961) + 2)|0;
            $$pre$i25$i = (((2656) + ($$sum26$pre$i$i<<2)|0) + 40|0);
            $$pre$phi$i26$iZ2D = $$pre$i25$i;$F4$0$i$i = $963;
           } else {
            $$sum29$i$i = (($961) + 2)|0;
            $969 = (((2656) + ($$sum29$i$i<<2)|0) + 40|0);
            $970 = HEAP32[$969>>2]|0;
            $971 = $970;
            $972 = HEAP32[(((2656) + 16|0))>>2]|0;
            $973 = ($971>>>0)<($972>>>0);
            if (!($973)) {
             $$pre$phi$i26$iZ2D = $969;$F4$0$i$i = $970;
             break;
            }
            _abort();
            // unreachable;
           }
          } while(0);
          HEAP32[$$pre$phi$i26$iZ2D>>2] = $812;
          $974 = (($F4$0$i$i) + 12|0);
          HEAP32[$974>>2] = $812;
          $$sum27$i$i = (($$sum$i21$i) + 8)|0;
          $975 = (($tbase$247$i) + ($$sum27$i$i)|0);
          $976 = $975;
          HEAP32[$976>>2] = $F4$0$i$i;
          $$sum28$i$i = (($$sum$i21$i) + 12)|0;
          $977 = (($tbase$247$i) + ($$sum28$i$i)|0);
          $978 = $977;
          HEAP32[$978>>2] = $963;
          break;
         }
         $979 = $811;
         $980 = $qsize$0$i$i >>> 8;
         $981 = ($980|0)==(0);
         do {
          if ($981) {
           $I7$0$i$i = 0;
          } else {
           $982 = ($qsize$0$i$i>>>0)>(16777215);
           if ($982) {
            $I7$0$i$i = 31;
            break;
           }
           $983 = (($980) + 1048320)|0;
           $984 = $983 >>> 16;
           $985 = $984 & 8;
           $986 = $980 << $985;
           $987 = (($986) + 520192)|0;
           $988 = $987 >>> 16;
           $989 = $988 & 4;
           $990 = $989 | $985;
           $991 = $986 << $989;
           $992 = (($991) + 245760)|0;
           $993 = $992 >>> 16;
           $994 = $993 & 2;
           $995 = $990 | $994;
           $996 = (14 - ($995))|0;
           $997 = $991 << $994;
           $998 = $997 >>> 15;
           $999 = (($996) + ($998))|0;
           $1000 = $999 << 1;
           $1001 = (($999) + 7)|0;
           $1002 = $qsize$0$i$i >>> $1001;
           $1003 = $1002 & 1;
           $1004 = $1003 | $1000;
           $I7$0$i$i = $1004;
          }
         } while(0);
         $1005 = (((2656) + ($I7$0$i$i<<2)|0) + 304|0);
         $$sum12$i$i = (($$sum$i21$i) + 28)|0;
         $1006 = (($tbase$247$i) + ($$sum12$i$i)|0);
         $1007 = $1006;
         HEAP32[$1007>>2] = $I7$0$i$i;
         $$sum13$i$i = (($$sum$i21$i) + 16)|0;
         $1008 = (($tbase$247$i) + ($$sum13$i$i)|0);
         $$sum14$i$i = (($$sum$i21$i) + 20)|0;
         $1009 = (($tbase$247$i) + ($$sum14$i$i)|0);
         $1010 = $1009;
         HEAP32[$1010>>2] = 0;
         $1011 = $1008;
         HEAP32[$1011>>2] = 0;
         $1012 = HEAP32[(((2656) + 4|0))>>2]|0;
         $1013 = 1 << $I7$0$i$i;
         $1014 = $1012 & $1013;
         $1015 = ($1014|0)==(0);
         if ($1015) {
          $1016 = $1012 | $1013;
          HEAP32[(((2656) + 4|0))>>2] = $1016;
          HEAP32[$1005>>2] = $979;
          $1017 = $1005;
          $$sum15$i$i = (($$sum$i21$i) + 24)|0;
          $1018 = (($tbase$247$i) + ($$sum15$i$i)|0);
          $1019 = $1018;
          HEAP32[$1019>>2] = $1017;
          $$sum16$i$i = (($$sum$i21$i) + 12)|0;
          $1020 = (($tbase$247$i) + ($$sum16$i$i)|0);
          $1021 = $1020;
          HEAP32[$1021>>2] = $979;
          $$sum17$i$i = (($$sum$i21$i) + 8)|0;
          $1022 = (($tbase$247$i) + ($$sum17$i$i)|0);
          $1023 = $1022;
          HEAP32[$1023>>2] = $979;
          break;
         }
         $1024 = HEAP32[$1005>>2]|0;
         $1025 = ($I7$0$i$i|0)==(31);
         if ($1025) {
          $1028 = 0;
         } else {
          $1026 = $I7$0$i$i >>> 1;
          $1027 = (25 - ($1026))|0;
          $1028 = $1027;
         }
         $1029 = (($1024) + 4|0);
         $1030 = HEAP32[$1029>>2]|0;
         $1031 = $1030 & -8;
         $1032 = ($1031|0)==($qsize$0$i$i|0);
         L445: do {
          if ($1032) {
           $T$0$lcssa$i28$i = $1024;
          } else {
           $1033 = $qsize$0$i$i << $1028;
           $K8$052$i$i = $1033;$T$051$i$i = $1024;
           while(1) {
            $1039 = $K8$052$i$i >>> 31;
            $1040 = ((($T$051$i$i) + ($1039<<2)|0) + 16|0);
            $1041 = HEAP32[$1040>>2]|0;
            $1042 = ($1041|0)==(0|0);
            if ($1042) {
             break;
            }
            $1034 = $K8$052$i$i << 1;
            $1035 = (($1041) + 4|0);
            $1036 = HEAP32[$1035>>2]|0;
            $1037 = $1036 & -8;
            $1038 = ($1037|0)==($qsize$0$i$i|0);
            if ($1038) {
             $T$0$lcssa$i28$i = $1041;
             break L445;
            } else {
             $T$051$i$i$phi = $1041;$K8$052$i$i = $1034;$T$051$i$i = $T$051$i$i$phi;
            }
           }
           $1043 = $1040;
           $1044 = HEAP32[(((2656) + 16|0))>>2]|0;
           $1045 = ($1043>>>0)<($1044>>>0);
           if ($1045) {
            _abort();
            // unreachable;
           } else {
            HEAP32[$1040>>2] = $979;
            $$sum23$i$i = (($$sum$i21$i) + 24)|0;
            $1046 = (($tbase$247$i) + ($$sum23$i$i)|0);
            $1047 = $1046;
            HEAP32[$1047>>2] = $T$051$i$i;
            $$sum24$i$i = (($$sum$i21$i) + 12)|0;
            $1048 = (($tbase$247$i) + ($$sum24$i$i)|0);
            $1049 = $1048;
            HEAP32[$1049>>2] = $979;
            $$sum25$i$i = (($$sum$i21$i) + 8)|0;
            $1050 = (($tbase$247$i) + ($$sum25$i$i)|0);
            $1051 = $1050;
            HEAP32[$1051>>2] = $979;
            break L348;
           }
          }
         } while(0);
         $1052 = (($T$0$lcssa$i28$i) + 8|0);
         $1053 = HEAP32[$1052>>2]|0;
         $1054 = $T$0$lcssa$i28$i;
         $1055 = HEAP32[(((2656) + 16|0))>>2]|0;
         $1056 = ($1054>>>0)<($1055>>>0);
         if ($1056) {
          _abort();
          // unreachable;
         }
         $1057 = $1053;
         $1058 = ($1057>>>0)<($1055>>>0);
         if ($1058) {
          _abort();
          // unreachable;
         } else {
          $1059 = (($1053) + 12|0);
          HEAP32[$1059>>2] = $979;
          HEAP32[$1052>>2] = $979;
          $$sum20$i$i = (($$sum$i21$i) + 8)|0;
          $1060 = (($tbase$247$i) + ($$sum20$i$i)|0);
          $1061 = $1060;
          HEAP32[$1061>>2] = $1053;
          $$sum21$i$i = (($$sum$i21$i) + 12)|0;
          $1062 = (($tbase$247$i) + ($$sum21$i$i)|0);
          $1063 = $1062;
          HEAP32[$1063>>2] = $T$0$lcssa$i28$i;
          $$sum22$i$i = (($$sum$i21$i) + 24)|0;
          $1064 = (($tbase$247$i) + ($$sum22$i$i)|0);
          $1065 = $1064;
          HEAP32[$1065>>2] = 0;
          break;
         }
        }
       } while(0);
       $$sum1819$i$i = $797 | 8;
       $1066 = (($tbase$247$i) + ($$sum1819$i$i)|0);
       $mem$0 = $1066;
       STACKTOP = sp;return ($mem$0|0);
      }
     } while(0);
     $1067 = $711;
     $sp$0$i$i$i = (((2656) + 448|0));
     while(1) {
      $1068 = ($sp$0$i$i$i);
      $1069 = HEAP32[$1068>>2]|0;
      $1070 = ($1069>>>0)>($1067>>>0);
      if (!($1070)) {
       $1071 = (($sp$0$i$i$i) + 4|0);
       $1072 = HEAP32[$1071>>2]|0;
       $1073 = (($1069) + ($1072)|0);
       $1074 = ($1073>>>0)>($1067>>>0);
       if ($1074) {
        break;
       }
      }
      $1075 = (($sp$0$i$i$i) + 8|0);
      $1076 = HEAP32[$1075>>2]|0;
      $sp$0$i$i$i = $1076;
     }
     $$sum$i15$i = (($1072) + -47)|0;
     $$sum1$i16$i = (($1072) + -39)|0;
     $1077 = (($1069) + ($$sum1$i16$i)|0);
     $1078 = $1077;
     $1079 = $1078 & 7;
     $1080 = ($1079|0)==(0);
     if ($1080) {
      $1083 = 0;
     } else {
      $1081 = (0 - ($1078))|0;
      $1082 = $1081 & 7;
      $1083 = $1082;
     }
     $$sum2$i17$i = (($$sum$i15$i) + ($1083))|0;
     $1084 = (($1069) + ($$sum2$i17$i)|0);
     $1085 = (($711) + 16|0);
     $1086 = $1085;
     $1087 = ($1084>>>0)<($1086>>>0);
     $1088 = $1087 ? $1067 : $1084;
     $1089 = (($1088) + 8|0);
     $1090 = $1089;
     $1091 = (($tsize$246$i) + -40)|0;
     $1092 = (($tbase$247$i) + 8|0);
     $1093 = $1092;
     $1094 = $1093 & 7;
     $1095 = ($1094|0)==(0);
     if ($1095) {
      $1098 = 0;
     } else {
      $1096 = (0 - ($1093))|0;
      $1097 = $1096 & 7;
      $1098 = $1097;
     }
     $1099 = (($tbase$247$i) + ($1098)|0);
     $1100 = $1099;
     $1101 = (($1091) - ($1098))|0;
     HEAP32[(((2656) + 24|0))>>2] = $1100;
     HEAP32[(((2656) + 12|0))>>2] = $1101;
     $1102 = $1101 | 1;
     $$sum$i$i$i = (($1098) + 4)|0;
     $1103 = (($tbase$247$i) + ($$sum$i$i$i)|0);
     $1104 = $1103;
     HEAP32[$1104>>2] = $1102;
     $$sum2$i$i$i = (($tsize$246$i) + -36)|0;
     $1105 = (($tbase$247$i) + ($$sum2$i$i$i)|0);
     $1106 = $1105;
     HEAP32[$1106>>2] = 40;
     $1107 = HEAP32[(((3128) + 16|0))>>2]|0;
     HEAP32[(((2656) + 28|0))>>2] = $1107;
     $1108 = (($1088) + 4|0);
     $1109 = $1108;
     HEAP32[$1109>>2] = 27;
     ;HEAP32[$1089+0>>2]=HEAP32[((((2656) + 448|0)))+0>>2]|0;HEAP32[$1089+4>>2]=HEAP32[((((2656) + 448|0)))+4>>2]|0;HEAP32[$1089+8>>2]=HEAP32[((((2656) + 448|0)))+8>>2]|0;HEAP32[$1089+12>>2]=HEAP32[((((2656) + 448|0)))+12>>2]|0;
     HEAP32[(((2656) + 448|0))>>2] = $tbase$247$i;
     HEAP32[(((2656) + 452|0))>>2] = $tsize$246$i;
     HEAP32[(((2656) + 460|0))>>2] = 0;
     HEAP32[(((2656) + 456|0))>>2] = $1090;
     $1110 = (($1088) + 28|0);
     $1111 = $1110;
     HEAP32[$1111>>2] = 7;
     $1112 = (($1088) + 32|0);
     $1113 = ($1112>>>0)<($1073>>>0);
     if ($1113) {
      $1114 = $1111;
      while(1) {
       $1115 = (($1114) + 4|0);
       HEAP32[$1115>>2] = 7;
       $1116 = (($1114) + 8|0);
       $1117 = $1116;
       $1118 = ($1117>>>0)<($1073>>>0);
       if ($1118) {
        $1114$phi = $1115;$1114 = $1114$phi;
       } else {
        break;
       }
      }
     }
     $1119 = ($1088|0)==($1067|0);
     if ($1119) {
      break;
     }
     $1120 = $1088;
     $1121 = $711;
     $1122 = (($1120) - ($1121))|0;
     $1123 = (($1067) + ($1122)|0);
     $$sum3$i$i = (($1122) + 4)|0;
     $1124 = (($1067) + ($$sum3$i$i)|0);
     $1125 = $1124;
     $1126 = HEAP32[$1125>>2]|0;
     $1127 = $1126 & -2;
     HEAP32[$1125>>2] = $1127;
     $1128 = $1122 | 1;
     $1129 = (($711) + 4|0);
     HEAP32[$1129>>2] = $1128;
     $1130 = $1123;
     HEAP32[$1130>>2] = $1122;
     $1131 = $1122 >>> 3;
     $1132 = ($1122>>>0)<(256);
     if ($1132) {
      $1133 = $1131 << 1;
      $1134 = (((2656) + ($1133<<2)|0) + 40|0);
      $1135 = $1134;
      $1136 = HEAP32[((2656))>>2]|0;
      $1137 = 1 << $1131;
      $1138 = $1136 & $1137;
      $1139 = ($1138|0)==(0);
      do {
       if ($1139) {
        $1140 = $1136 | $1137;
        HEAP32[((2656))>>2] = $1140;
        $$sum10$pre$i$i = (($1133) + 2)|0;
        $$pre$i$i = (((2656) + ($$sum10$pre$i$i<<2)|0) + 40|0);
        $$pre$phi$i$iZ2D = $$pre$i$i;$F$0$i$i = $1135;
       } else {
        $$sum11$i$i = (($1133) + 2)|0;
        $1141 = (((2656) + ($$sum11$i$i<<2)|0) + 40|0);
        $1142 = HEAP32[$1141>>2]|0;
        $1143 = $1142;
        $1144 = HEAP32[(((2656) + 16|0))>>2]|0;
        $1145 = ($1143>>>0)<($1144>>>0);
        if (!($1145)) {
         $$pre$phi$i$iZ2D = $1141;$F$0$i$i = $1142;
         break;
        }
        _abort();
        // unreachable;
       }
      } while(0);
      HEAP32[$$pre$phi$i$iZ2D>>2] = $711;
      $1146 = (($F$0$i$i) + 12|0);
      HEAP32[$1146>>2] = $711;
      $1147 = (($711) + 8|0);
      HEAP32[$1147>>2] = $F$0$i$i;
      $1148 = (($711) + 12|0);
      HEAP32[$1148>>2] = $1135;
      break;
     }
     $1149 = $711;
     $1150 = $1122 >>> 8;
     $1151 = ($1150|0)==(0);
     do {
      if ($1151) {
       $I1$0$i$i = 0;
      } else {
       $1152 = ($1122>>>0)>(16777215);
       if ($1152) {
        $I1$0$i$i = 31;
        break;
       }
       $1153 = (($1150) + 1048320)|0;
       $1154 = $1153 >>> 16;
       $1155 = $1154 & 8;
       $1156 = $1150 << $1155;
       $1157 = (($1156) + 520192)|0;
       $1158 = $1157 >>> 16;
       $1159 = $1158 & 4;
       $1160 = $1159 | $1155;
       $1161 = $1156 << $1159;
       $1162 = (($1161) + 245760)|0;
       $1163 = $1162 >>> 16;
       $1164 = $1163 & 2;
       $1165 = $1160 | $1164;
       $1166 = (14 - ($1165))|0;
       $1167 = $1161 << $1164;
       $1168 = $1167 >>> 15;
       $1169 = (($1166) + ($1168))|0;
       $1170 = $1169 << 1;
       $1171 = (($1169) + 7)|0;
       $1172 = $1122 >>> $1171;
       $1173 = $1172 & 1;
       $1174 = $1173 | $1170;
       $I1$0$i$i = $1174;
      }
     } while(0);
     $1175 = (((2656) + ($I1$0$i$i<<2)|0) + 304|0);
     $1176 = (($711) + 28|0);
     $I1$0$c$i$i = $I1$0$i$i;
     HEAP32[$1176>>2] = $I1$0$c$i$i;
     $1177 = (($711) + 20|0);
     HEAP32[$1177>>2] = 0;
     $1178 = (($711) + 16|0);
     HEAP32[$1178>>2] = 0;
     $1179 = HEAP32[(((2656) + 4|0))>>2]|0;
     $1180 = 1 << $I1$0$i$i;
     $1181 = $1179 & $1180;
     $1182 = ($1181|0)==(0);
     if ($1182) {
      $1183 = $1179 | $1180;
      HEAP32[(((2656) + 4|0))>>2] = $1183;
      HEAP32[$1175>>2] = $1149;
      $1184 = (($711) + 24|0);
      $$c$i$i = $1175;
      HEAP32[$1184>>2] = $$c$i$i;
      $1185 = (($711) + 12|0);
      HEAP32[$1185>>2] = $711;
      $1186 = (($711) + 8|0);
      HEAP32[$1186>>2] = $711;
      break;
     }
     $1187 = HEAP32[$1175>>2]|0;
     $1188 = ($I1$0$i$i|0)==(31);
     if ($1188) {
      $1191 = 0;
     } else {
      $1189 = $I1$0$i$i >>> 1;
      $1190 = (25 - ($1189))|0;
      $1191 = $1190;
     }
     $1192 = (($1187) + 4|0);
     $1193 = HEAP32[$1192>>2]|0;
     $1194 = $1193 & -8;
     $1195 = ($1194|0)==($1122|0);
     L499: do {
      if ($1195) {
       $T$0$lcssa$i$i = $1187;
      } else {
       $1196 = $1122 << $1191;
       $K2$014$i$i = $1196;$T$013$i$i = $1187;
       while(1) {
        $1202 = $K2$014$i$i >>> 31;
        $1203 = ((($T$013$i$i) + ($1202<<2)|0) + 16|0);
        $1204 = HEAP32[$1203>>2]|0;
        $1205 = ($1204|0)==(0|0);
        if ($1205) {
         break;
        }
        $1197 = $K2$014$i$i << 1;
        $1198 = (($1204) + 4|0);
        $1199 = HEAP32[$1198>>2]|0;
        $1200 = $1199 & -8;
        $1201 = ($1200|0)==($1122|0);
        if ($1201) {
         $T$0$lcssa$i$i = $1204;
         break L499;
        } else {
         $T$013$i$i$phi = $1204;$K2$014$i$i = $1197;$T$013$i$i = $T$013$i$i$phi;
        }
       }
       $1206 = $1203;
       $1207 = HEAP32[(((2656) + 16|0))>>2]|0;
       $1208 = ($1206>>>0)<($1207>>>0);
       if ($1208) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$1203>>2] = $1149;
        $1209 = (($711) + 24|0);
        $T$0$c7$i$i = $T$013$i$i;
        HEAP32[$1209>>2] = $T$0$c7$i$i;
        $1210 = (($711) + 12|0);
        HEAP32[$1210>>2] = $711;
        $1211 = (($711) + 8|0);
        HEAP32[$1211>>2] = $711;
        break L311;
       }
      }
     } while(0);
     $1212 = (($T$0$lcssa$i$i) + 8|0);
     $1213 = HEAP32[$1212>>2]|0;
     $1214 = $T$0$lcssa$i$i;
     $1215 = HEAP32[(((2656) + 16|0))>>2]|0;
     $1216 = ($1214>>>0)<($1215>>>0);
     if ($1216) {
      _abort();
      // unreachable;
     }
     $1217 = $1213;
     $1218 = ($1217>>>0)<($1215>>>0);
     if ($1218) {
      _abort();
      // unreachable;
     } else {
      $1219 = (($1213) + 12|0);
      HEAP32[$1219>>2] = $1149;
      HEAP32[$1212>>2] = $1149;
      $1220 = (($711) + 8|0);
      $$c6$i$i = $1213;
      HEAP32[$1220>>2] = $$c6$i$i;
      $1221 = (($711) + 12|0);
      $T$0$c$i$i = $T$0$lcssa$i$i;
      HEAP32[$1221>>2] = $T$0$c$i$i;
      $1222 = (($711) + 24|0);
      HEAP32[$1222>>2] = 0;
      break;
     }
    }
   } while(0);
   $1223 = HEAP32[(((2656) + 12|0))>>2]|0;
   $1224 = ($1223>>>0)>($nb$0>>>0);
   if (!($1224)) {
    break;
   }
   $1225 = (($1223) - ($nb$0))|0;
   HEAP32[(((2656) + 12|0))>>2] = $1225;
   $1226 = HEAP32[(((2656) + 24|0))>>2]|0;
   $1227 = $1226;
   $1228 = (($1227) + ($nb$0)|0);
   $1229 = $1228;
   HEAP32[(((2656) + 24|0))>>2] = $1229;
   $1230 = $1225 | 1;
   $$sum$i32 = (($nb$0) + 4)|0;
   $1231 = (($1227) + ($$sum$i32)|0);
   $1232 = $1231;
   HEAP32[$1232>>2] = $1230;
   $1233 = $nb$0 | 3;
   $1234 = (($1226) + 4|0);
   HEAP32[$1234>>2] = $1233;
   $1235 = (($1226) + 8|0);
   $1236 = $1235;
   $mem$0 = $1236;
   STACKTOP = sp;return ($mem$0|0);
  }
 } while(0);
 $1237 = (___errno_location()|0);
 HEAP32[$1237>>2] = 12;
 $mem$0 = 0;
 STACKTOP = sp;return ($mem$0|0);
}
function _free($mem) {
 $mem = $mem|0;
 var $$c = 0, $$c12 = 0, $$pre = 0, $$pre$phi68Z2D = 0, $$pre$phi70Z2D = 0, $$pre$phiZ2D = 0, $$pre67 = 0, $$pre69 = 0, $$sum = 0, $$sum16$pre = 0, $$sum17 = 0, $$sum18 = 0, $$sum19 = 0, $$sum2 = 0, $$sum20 = 0, $$sum2324 = 0, $$sum25 = 0, $$sum26 = 0, $$sum28 = 0, $$sum29 = 0;
 var $$sum3 = 0, $$sum30 = 0, $$sum31 = 0, $$sum32 = 0, $$sum33 = 0, $$sum34 = 0, $$sum35 = 0, $$sum36 = 0, $$sum37 = 0, $$sum5 = 0, $$sum67 = 0, $$sum8 = 0, $$sum9 = 0, $1 = 0, $10 = 0, $100 = 0, $101 = 0, $102 = 0, $103 = 0, $104 = 0;
 var $105 = 0, $106 = 0, $107 = 0, $108 = 0, $109 = 0, $11 = 0, $110 = 0, $111 = 0, $112 = 0, $113 = 0, $114 = 0, $115 = 0, $116 = 0, $117 = 0, $118 = 0, $119 = 0, $12 = 0, $120 = 0, $121 = 0, $122 = 0;
 var $123 = 0, $124 = 0, $125 = 0, $126 = 0, $127 = 0, $128 = 0, $129 = 0, $13 = 0, $130 = 0, $131 = 0, $132 = 0, $133 = 0, $134 = 0, $135 = 0, $136 = 0, $137 = 0, $138 = 0, $139 = 0, $14 = 0, $140 = 0;
 var $141 = 0, $142 = 0, $143 = 0, $144 = 0, $145 = 0, $146 = 0, $147 = 0, $148 = 0, $149 = 0, $15 = 0, $150 = 0, $151 = 0, $152 = 0, $153 = 0, $154 = 0, $155 = 0, $156 = 0, $157 = 0, $158 = 0, $159 = 0;
 var $16 = 0, $160 = 0, $161 = 0, $162 = 0, $163 = 0, $164 = 0, $165 = 0, $166 = 0, $167 = 0, $168 = 0, $169 = 0, $17 = 0, $170 = 0, $171 = 0, $172 = 0, $173 = 0, $174 = 0, $175 = 0, $176 = 0, $177 = 0;
 var $178 = 0, $179 = 0, $18 = 0, $180 = 0, $181 = 0, $182 = 0, $183 = 0, $184 = 0, $185 = 0, $186 = 0, $187 = 0, $188 = 0, $189 = 0, $19 = 0, $190 = 0, $191 = 0, $192 = 0, $193 = 0, $194 = 0, $195 = 0;
 var $196 = 0, $197 = 0, $198 = 0, $199 = 0, $2 = 0, $20 = 0, $200 = 0, $201 = 0, $202 = 0, $203 = 0, $204 = 0, $205 = 0, $206 = 0, $207 = 0, $208 = 0, $209 = 0, $21 = 0, $210 = 0, $211 = 0, $212 = 0;
 var $213 = 0, $214 = 0, $215 = 0, $216 = 0, $217 = 0, $218 = 0, $219 = 0, $22 = 0, $220 = 0, $221 = 0, $222 = 0, $223 = 0, $224 = 0, $225 = 0, $226 = 0, $227 = 0, $228 = 0, $229 = 0, $23 = 0, $230 = 0;
 var $231 = 0, $232 = 0, $233 = 0, $234 = 0, $235 = 0, $236 = 0, $237 = 0, $238 = 0, $239 = 0, $24 = 0, $240 = 0, $241 = 0, $242 = 0, $243 = 0, $244 = 0, $245 = 0, $246 = 0, $247 = 0, $248 = 0, $249 = 0;
 var $25 = 0, $250 = 0, $251 = 0, $252 = 0, $253 = 0, $254 = 0, $255 = 0, $256 = 0, $257 = 0, $258 = 0, $259 = 0, $26 = 0, $260 = 0, $261 = 0, $262 = 0, $263 = 0, $264 = 0, $265 = 0, $266 = 0, $267 = 0;
 var $268 = 0, $269 = 0, $27 = 0, $270 = 0, $271 = 0, $272 = 0, $273 = 0, $274 = 0, $275 = 0, $276 = 0, $277 = 0, $278 = 0, $279 = 0, $28 = 0, $280 = 0, $281 = 0, $282 = 0, $283 = 0, $284 = 0, $285 = 0;
 var $286 = 0, $287 = 0, $288 = 0, $289 = 0, $29 = 0, $290 = 0, $291 = 0, $292 = 0, $293 = 0, $294 = 0, $295 = 0, $296 = 0, $297 = 0, $298 = 0, $299 = 0, $3 = 0, $30 = 0, $300 = 0, $301 = 0, $302 = 0;
 var $303 = 0, $304 = 0, $305 = 0, $306 = 0, $307 = 0, $308 = 0, $309 = 0, $31 = 0, $310 = 0, $311 = 0, $312 = 0, $313 = 0, $314 = 0, $315 = 0, $316 = 0, $317 = 0, $318 = 0, $319 = 0, $32 = 0, $320 = 0;
 var $321 = 0, $322 = 0, $323 = 0, $324 = 0, $325 = 0, $326 = 0, $327 = 0, $328 = 0, $329 = 0, $33 = 0, $330 = 0, $331 = 0, $332 = 0, $333 = 0, $334 = 0, $335 = 0, $336 = 0, $337 = 0, $338 = 0, $339 = 0;
 var $34 = 0, $340 = 0, $341 = 0, $342 = 0, $343 = 0, $344 = 0, $345 = 0, $346 = 0, $347 = 0, $348 = 0, $349 = 0, $35 = 0, $350 = 0, $351 = 0, $352 = 0, $353 = 0, $354 = 0, $355 = 0, $356 = 0, $357 = 0;
 var $358 = 0, $359 = 0, $36 = 0, $360 = 0, $361 = 0, $362 = 0, $363 = 0, $364 = 0, $365 = 0, $366 = 0, $367 = 0, $368 = 0, $369 = 0, $37 = 0, $370 = 0, $371 = 0, $372 = 0, $373 = 0, $374 = 0, $375 = 0;
 var $376 = 0, $377 = 0, $378 = 0, $379 = 0, $38 = 0, $380 = 0, $381 = 0, $382 = 0, $383 = 0, $384 = 0, $39 = 0, $4 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0, $44 = 0, $45 = 0, $46 = 0, $47 = 0;
 var $48 = 0, $49 = 0, $5 = 0, $50 = 0, $51 = 0, $52 = 0, $53 = 0, $54 = 0, $55 = 0, $56 = 0, $57 = 0, $58 = 0, $59 = 0, $6 = 0, $60 = 0, $61 = 0, $62 = 0, $63 = 0, $64 = 0, $65 = 0;
 var $66 = 0, $67 = 0, $68 = 0, $69 = 0, $7 = 0, $70 = 0, $71 = 0, $72 = 0, $73 = 0, $74 = 0, $75 = 0, $76 = 0, $77 = 0, $78 = 0, $79 = 0, $8 = 0, $80 = 0, $81 = 0, $82 = 0, $83 = 0;
 var $84 = 0, $85 = 0, $86 = 0, $87 = 0, $88 = 0, $89 = 0, $9 = 0, $90 = 0, $91 = 0, $92 = 0, $93 = 0, $94 = 0, $95 = 0, $96 = 0, $97 = 0, $98 = 0, $99 = 0, $F16$0 = 0, $I18$0 = 0, $I18$0$c = 0;
 var $K19$057 = 0, $R$0 = 0, $R$0$phi = 0, $R$1 = 0, $R7$0 = 0, $R7$0$phi = 0, $R7$1 = 0, $RP$0 = 0, $RP$0$phi = 0, $RP9$0 = 0, $RP9$0$phi = 0, $T$0$c = 0, $T$0$c13 = 0, $T$0$lcssa = 0, $T$056 = 0, $T$056$phi = 0, $cond = 0, $cond54 = 0, $p$0 = 0, $psize$0 = 0;
 var $psize$1 = 0, $sp$0$i = 0, $sp$0$in$i = 0, $sp$0$in$i$phi = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($mem|0)==(0|0);
 if ($1) {
  STACKTOP = sp;return;
 }
 $2 = (($mem) + -8|0);
 $3 = $2;
 $4 = HEAP32[(((2656) + 16|0))>>2]|0;
 $5 = ($2>>>0)<($4>>>0);
 if ($5) {
  _abort();
  // unreachable;
 }
 $6 = (($mem) + -4|0);
 $7 = $6;
 $8 = HEAP32[$7>>2]|0;
 $9 = $8 & 3;
 $10 = ($9|0)==(1);
 if ($10) {
  _abort();
  // unreachable;
 }
 $11 = $8 & -8;
 $$sum = (($11) + -8)|0;
 $12 = (($mem) + ($$sum)|0);
 $13 = $12;
 $14 = $8 & 1;
 $15 = ($14|0)==(0);
 L10: do {
  if ($15) {
   $16 = $2;
   $17 = HEAP32[$16>>2]|0;
   $18 = ($9|0)==(0);
   if ($18) {
    STACKTOP = sp;return;
   }
   $$sum2 = (-8 - ($17))|0;
   $19 = (($mem) + ($$sum2)|0);
   $20 = $19;
   $21 = (($17) + ($11))|0;
   $22 = ($19>>>0)<($4>>>0);
   if ($22) {
    _abort();
    // unreachable;
   }
   $23 = HEAP32[(((2656) + 20|0))>>2]|0;
   $24 = ($20|0)==($23|0);
   if ($24) {
    $$sum3 = (($11) + -4)|0;
    $130 = (($mem) + ($$sum3)|0);
    $131 = $130;
    $132 = HEAP32[$131>>2]|0;
    $133 = $132 & 3;
    $134 = ($133|0)==(3);
    if (!($134)) {
     $p$0 = $20;$psize$0 = $21;
     break;
    }
    HEAP32[(((2656) + 8|0))>>2] = $21;
    $135 = HEAP32[$131>>2]|0;
    $136 = $135 & -2;
    HEAP32[$131>>2] = $136;
    $137 = $21 | 1;
    $$sum26 = (($$sum2) + 4)|0;
    $138 = (($mem) + ($$sum26)|0);
    $139 = $138;
    HEAP32[$139>>2] = $137;
    $140 = $12;
    HEAP32[$140>>2] = $21;
    STACKTOP = sp;return;
   }
   $25 = $17 >>> 3;
   $26 = ($17>>>0)<(256);
   if ($26) {
    $$sum36 = (($$sum2) + 8)|0;
    $27 = (($mem) + ($$sum36)|0);
    $28 = $27;
    $29 = HEAP32[$28>>2]|0;
    $$sum37 = (($$sum2) + 12)|0;
    $30 = (($mem) + ($$sum37)|0);
    $31 = $30;
    $32 = HEAP32[$31>>2]|0;
    $33 = $25 << 1;
    $34 = (((2656) + ($33<<2)|0) + 40|0);
    $35 = $34;
    $36 = ($29|0)==($35|0);
    do {
     if (!($36)) {
      $37 = $29;
      $38 = ($37>>>0)<($4>>>0);
      if ($38) {
       _abort();
       // unreachable;
      }
      $39 = (($29) + 12|0);
      $40 = HEAP32[$39>>2]|0;
      $41 = ($40|0)==($20|0);
      if ($41) {
       break;
      }
      _abort();
      // unreachable;
     }
    } while(0);
    $42 = ($32|0)==($29|0);
    if ($42) {
     $43 = 1 << $25;
     $44 = $43 ^ -1;
     $45 = HEAP32[((2656))>>2]|0;
     $46 = $45 & $44;
     HEAP32[((2656))>>2] = $46;
     $p$0 = $20;$psize$0 = $21;
     break;
    }
    $47 = ($32|0)==($35|0);
    do {
     if ($47) {
      $$pre69 = (($32) + 8|0);
      $$pre$phi70Z2D = $$pre69;
     } else {
      $48 = $32;
      $49 = ($48>>>0)<($4>>>0);
      if ($49) {
       _abort();
       // unreachable;
      }
      $50 = (($32) + 8|0);
      $51 = HEAP32[$50>>2]|0;
      $52 = ($51|0)==($20|0);
      if ($52) {
       $$pre$phi70Z2D = $50;
       break;
      }
      _abort();
      // unreachable;
     }
    } while(0);
    $53 = (($29) + 12|0);
    HEAP32[$53>>2] = $32;
    HEAP32[$$pre$phi70Z2D>>2] = $29;
    $p$0 = $20;$psize$0 = $21;
    break;
   }
   $54 = $19;
   $$sum28 = (($$sum2) + 24)|0;
   $55 = (($mem) + ($$sum28)|0);
   $56 = $55;
   $57 = HEAP32[$56>>2]|0;
   $$sum29 = (($$sum2) + 12)|0;
   $58 = (($mem) + ($$sum29)|0);
   $59 = $58;
   $60 = HEAP32[$59>>2]|0;
   $61 = ($60|0)==($54|0);
   do {
    if ($61) {
     $$sum31 = (($$sum2) + 20)|0;
     $73 = (($mem) + ($$sum31)|0);
     $74 = $73;
     $75 = HEAP32[$74>>2]|0;
     $76 = ($75|0)==(0|0);
     if ($76) {
      $$sum30 = (($$sum2) + 16)|0;
      $77 = (($mem) + ($$sum30)|0);
      $78 = $77;
      $79 = HEAP32[$78>>2]|0;
      $80 = ($79|0)==(0|0);
      if ($80) {
       $R$1 = 0;
       break;
      } else {
       $R$0 = $79;$RP$0 = $78;
      }
     } else {
      $R$0 = $75;$RP$0 = $74;
     }
     while(1) {
      $81 = (($R$0) + 20|0);
      $82 = HEAP32[$81>>2]|0;
      $83 = ($82|0)==(0|0);
      if (!($83)) {
       $RP$0$phi = $81;$R$0$phi = $82;$RP$0 = $RP$0$phi;$R$0 = $R$0$phi;
       continue;
      }
      $84 = (($R$0) + 16|0);
      $85 = HEAP32[$84>>2]|0;
      $86 = ($85|0)==(0|0);
      if ($86) {
       break;
      } else {
       $R$0 = $85;$RP$0 = $84;
      }
     }
     $87 = $RP$0;
     $88 = ($87>>>0)<($4>>>0);
     if ($88) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$RP$0>>2] = 0;
      $R$1 = $R$0;
      break;
     }
    } else {
     $$sum35 = (($$sum2) + 8)|0;
     $62 = (($mem) + ($$sum35)|0);
     $63 = $62;
     $64 = HEAP32[$63>>2]|0;
     $65 = $64;
     $66 = ($65>>>0)<($4>>>0);
     if ($66) {
      _abort();
      // unreachable;
     }
     $67 = (($64) + 12|0);
     $68 = HEAP32[$67>>2]|0;
     $69 = ($68|0)==($54|0);
     if (!($69)) {
      _abort();
      // unreachable;
     }
     $70 = (($60) + 8|0);
     $71 = HEAP32[$70>>2]|0;
     $72 = ($71|0)==($54|0);
     if ($72) {
      HEAP32[$67>>2] = $60;
      HEAP32[$70>>2] = $64;
      $R$1 = $60;
      break;
     } else {
      _abort();
      // unreachable;
     }
    }
   } while(0);
   $89 = ($57|0)==(0|0);
   if ($89) {
    $p$0 = $20;$psize$0 = $21;
    break;
   }
   $$sum32 = (($$sum2) + 28)|0;
   $90 = (($mem) + ($$sum32)|0);
   $91 = $90;
   $92 = HEAP32[$91>>2]|0;
   $93 = (((2656) + ($92<<2)|0) + 304|0);
   $94 = HEAP32[$93>>2]|0;
   $95 = ($54|0)==($94|0);
   do {
    if ($95) {
     HEAP32[$93>>2] = $R$1;
     $cond = ($R$1|0)==(0|0);
     if (!($cond)) {
      break;
     }
     $96 = 1 << $92;
     $97 = $96 ^ -1;
     $98 = HEAP32[(((2656) + 4|0))>>2]|0;
     $99 = $98 & $97;
     HEAP32[(((2656) + 4|0))>>2] = $99;
     $p$0 = $20;$psize$0 = $21;
     break L10;
    } else {
     $100 = $57;
     $101 = HEAP32[(((2656) + 16|0))>>2]|0;
     $102 = ($100>>>0)<($101>>>0);
     if ($102) {
      _abort();
      // unreachable;
     }
     $103 = (($57) + 16|0);
     $104 = HEAP32[$103>>2]|0;
     $105 = ($104|0)==($54|0);
     if ($105) {
      HEAP32[$103>>2] = $R$1;
     } else {
      $106 = (($57) + 20|0);
      HEAP32[$106>>2] = $R$1;
     }
     $107 = ($R$1|0)==(0|0);
     if ($107) {
      $p$0 = $20;$psize$0 = $21;
      break L10;
     }
    }
   } while(0);
   $108 = $R$1;
   $109 = HEAP32[(((2656) + 16|0))>>2]|0;
   $110 = ($108>>>0)<($109>>>0);
   if ($110) {
    _abort();
    // unreachable;
   }
   $111 = (($R$1) + 24|0);
   HEAP32[$111>>2] = $57;
   $$sum33 = (($$sum2) + 16)|0;
   $112 = (($mem) + ($$sum33)|0);
   $113 = $112;
   $114 = HEAP32[$113>>2]|0;
   $115 = ($114|0)==(0|0);
   do {
    if (!($115)) {
     $116 = $114;
     $117 = HEAP32[(((2656) + 16|0))>>2]|0;
     $118 = ($116>>>0)<($117>>>0);
     if ($118) {
      _abort();
      // unreachable;
     } else {
      $119 = (($R$1) + 16|0);
      HEAP32[$119>>2] = $114;
      $120 = (($114) + 24|0);
      HEAP32[$120>>2] = $R$1;
      break;
     }
    }
   } while(0);
   $$sum34 = (($$sum2) + 20)|0;
   $121 = (($mem) + ($$sum34)|0);
   $122 = $121;
   $123 = HEAP32[$122>>2]|0;
   $124 = ($123|0)==(0|0);
   if ($124) {
    $p$0 = $20;$psize$0 = $21;
    break;
   }
   $125 = $123;
   $126 = HEAP32[(((2656) + 16|0))>>2]|0;
   $127 = ($125>>>0)<($126>>>0);
   if ($127) {
    _abort();
    // unreachable;
   } else {
    $128 = (($R$1) + 20|0);
    HEAP32[$128>>2] = $123;
    $129 = (($123) + 24|0);
    HEAP32[$129>>2] = $R$1;
    $p$0 = $20;$psize$0 = $21;
    break;
   }
  } else {
   $p$0 = $3;$psize$0 = $11;
  }
 } while(0);
 $141 = $p$0;
 $142 = ($141>>>0)<($12>>>0);
 if (!($142)) {
  _abort();
  // unreachable;
 }
 $$sum25 = (($11) + -4)|0;
 $143 = (($mem) + ($$sum25)|0);
 $144 = $143;
 $145 = HEAP32[$144>>2]|0;
 $146 = $145 & 1;
 $147 = ($146|0)==(0);
 if ($147) {
  _abort();
  // unreachable;
 }
 $148 = $145 & 2;
 $149 = ($148|0)==(0);
 do {
  if ($149) {
   $150 = HEAP32[(((2656) + 24|0))>>2]|0;
   $151 = ($13|0)==($150|0);
   if ($151) {
    $152 = HEAP32[(((2656) + 12|0))>>2]|0;
    $153 = (($152) + ($psize$0))|0;
    HEAP32[(((2656) + 12|0))>>2] = $153;
    HEAP32[(((2656) + 24|0))>>2] = $p$0;
    $154 = $153 | 1;
    $155 = (($p$0) + 4|0);
    HEAP32[$155>>2] = $154;
    $156 = HEAP32[(((2656) + 20|0))>>2]|0;
    $157 = ($p$0|0)==($156|0);
    if (!($157)) {
     STACKTOP = sp;return;
    }
    HEAP32[(((2656) + 20|0))>>2] = 0;
    HEAP32[(((2656) + 8|0))>>2] = 0;
    STACKTOP = sp;return;
   }
   $158 = HEAP32[(((2656) + 20|0))>>2]|0;
   $159 = ($13|0)==($158|0);
   if ($159) {
    $160 = HEAP32[(((2656) + 8|0))>>2]|0;
    $161 = (($160) + ($psize$0))|0;
    HEAP32[(((2656) + 8|0))>>2] = $161;
    HEAP32[(((2656) + 20|0))>>2] = $p$0;
    $162 = $161 | 1;
    $163 = (($p$0) + 4|0);
    HEAP32[$163>>2] = $162;
    $164 = (($141) + ($161)|0);
    $165 = $164;
    HEAP32[$165>>2] = $161;
    STACKTOP = sp;return;
   }
   $166 = $145 & -8;
   $167 = (($166) + ($psize$0))|0;
   $168 = $145 >>> 3;
   $169 = ($145>>>0)<(256);
   L112: do {
    if ($169) {
     $170 = (($mem) + ($11)|0);
     $171 = $170;
     $172 = HEAP32[$171>>2]|0;
     $$sum2324 = $11 | 4;
     $173 = (($mem) + ($$sum2324)|0);
     $174 = $173;
     $175 = HEAP32[$174>>2]|0;
     $176 = $168 << 1;
     $177 = (((2656) + ($176<<2)|0) + 40|0);
     $178 = $177;
     $179 = ($172|0)==($178|0);
     do {
      if (!($179)) {
       $180 = $172;
       $181 = HEAP32[(((2656) + 16|0))>>2]|0;
       $182 = ($180>>>0)<($181>>>0);
       if ($182) {
        _abort();
        // unreachable;
       }
       $183 = (($172) + 12|0);
       $184 = HEAP32[$183>>2]|0;
       $185 = ($184|0)==($13|0);
       if ($185) {
        break;
       }
       _abort();
       // unreachable;
      }
     } while(0);
     $186 = ($175|0)==($172|0);
     if ($186) {
      $187 = 1 << $168;
      $188 = $187 ^ -1;
      $189 = HEAP32[((2656))>>2]|0;
      $190 = $189 & $188;
      HEAP32[((2656))>>2] = $190;
      break;
     }
     $191 = ($175|0)==($178|0);
     do {
      if ($191) {
       $$pre67 = (($175) + 8|0);
       $$pre$phi68Z2D = $$pre67;
      } else {
       $192 = $175;
       $193 = HEAP32[(((2656) + 16|0))>>2]|0;
       $194 = ($192>>>0)<($193>>>0);
       if ($194) {
        _abort();
        // unreachable;
       }
       $195 = (($175) + 8|0);
       $196 = HEAP32[$195>>2]|0;
       $197 = ($196|0)==($13|0);
       if ($197) {
        $$pre$phi68Z2D = $195;
        break;
       }
       _abort();
       // unreachable;
      }
     } while(0);
     $198 = (($172) + 12|0);
     HEAP32[$198>>2] = $175;
     HEAP32[$$pre$phi68Z2D>>2] = $172;
    } else {
     $199 = $12;
     $$sum5 = (($11) + 16)|0;
     $200 = (($mem) + ($$sum5)|0);
     $201 = $200;
     $202 = HEAP32[$201>>2]|0;
     $$sum67 = $11 | 4;
     $203 = (($mem) + ($$sum67)|0);
     $204 = $203;
     $205 = HEAP32[$204>>2]|0;
     $206 = ($205|0)==($199|0);
     do {
      if ($206) {
       $$sum9 = (($11) + 12)|0;
       $219 = (($mem) + ($$sum9)|0);
       $220 = $219;
       $221 = HEAP32[$220>>2]|0;
       $222 = ($221|0)==(0|0);
       if ($222) {
        $$sum8 = (($11) + 8)|0;
        $223 = (($mem) + ($$sum8)|0);
        $224 = $223;
        $225 = HEAP32[$224>>2]|0;
        $226 = ($225|0)==(0|0);
        if ($226) {
         $R7$1 = 0;
         break;
        } else {
         $R7$0 = $225;$RP9$0 = $224;
        }
       } else {
        $R7$0 = $221;$RP9$0 = $220;
       }
       while(1) {
        $227 = (($R7$0) + 20|0);
        $228 = HEAP32[$227>>2]|0;
        $229 = ($228|0)==(0|0);
        if (!($229)) {
         $RP9$0$phi = $227;$R7$0$phi = $228;$RP9$0 = $RP9$0$phi;$R7$0 = $R7$0$phi;
         continue;
        }
        $230 = (($R7$0) + 16|0);
        $231 = HEAP32[$230>>2]|0;
        $232 = ($231|0)==(0|0);
        if ($232) {
         break;
        } else {
         $R7$0 = $231;$RP9$0 = $230;
        }
       }
       $233 = $RP9$0;
       $234 = HEAP32[(((2656) + 16|0))>>2]|0;
       $235 = ($233>>>0)<($234>>>0);
       if ($235) {
        _abort();
        // unreachable;
       } else {
        HEAP32[$RP9$0>>2] = 0;
        $R7$1 = $R7$0;
        break;
       }
      } else {
       $207 = (($mem) + ($11)|0);
       $208 = $207;
       $209 = HEAP32[$208>>2]|0;
       $210 = $209;
       $211 = HEAP32[(((2656) + 16|0))>>2]|0;
       $212 = ($210>>>0)<($211>>>0);
       if ($212) {
        _abort();
        // unreachable;
       }
       $213 = (($209) + 12|0);
       $214 = HEAP32[$213>>2]|0;
       $215 = ($214|0)==($199|0);
       if (!($215)) {
        _abort();
        // unreachable;
       }
       $216 = (($205) + 8|0);
       $217 = HEAP32[$216>>2]|0;
       $218 = ($217|0)==($199|0);
       if ($218) {
        HEAP32[$213>>2] = $205;
        HEAP32[$216>>2] = $209;
        $R7$1 = $205;
        break;
       } else {
        _abort();
        // unreachable;
       }
      }
     } while(0);
     $236 = ($202|0)==(0|0);
     if ($236) {
      break;
     }
     $$sum18 = (($11) + 20)|0;
     $237 = (($mem) + ($$sum18)|0);
     $238 = $237;
     $239 = HEAP32[$238>>2]|0;
     $240 = (((2656) + ($239<<2)|0) + 304|0);
     $241 = HEAP32[$240>>2]|0;
     $242 = ($199|0)==($241|0);
     do {
      if ($242) {
       HEAP32[$240>>2] = $R7$1;
       $cond54 = ($R7$1|0)==(0|0);
       if (!($cond54)) {
        break;
       }
       $243 = 1 << $239;
       $244 = $243 ^ -1;
       $245 = HEAP32[(((2656) + 4|0))>>2]|0;
       $246 = $245 & $244;
       HEAP32[(((2656) + 4|0))>>2] = $246;
       break L112;
      } else {
       $247 = $202;
       $248 = HEAP32[(((2656) + 16|0))>>2]|0;
       $249 = ($247>>>0)<($248>>>0);
       if ($249) {
        _abort();
        // unreachable;
       }
       $250 = (($202) + 16|0);
       $251 = HEAP32[$250>>2]|0;
       $252 = ($251|0)==($199|0);
       if ($252) {
        HEAP32[$250>>2] = $R7$1;
       } else {
        $253 = (($202) + 20|0);
        HEAP32[$253>>2] = $R7$1;
       }
       $254 = ($R7$1|0)==(0|0);
       if ($254) {
        break L112;
       }
      }
     } while(0);
     $255 = $R7$1;
     $256 = HEAP32[(((2656) + 16|0))>>2]|0;
     $257 = ($255>>>0)<($256>>>0);
     if ($257) {
      _abort();
      // unreachable;
     }
     $258 = (($R7$1) + 24|0);
     HEAP32[$258>>2] = $202;
     $$sum19 = (($11) + 8)|0;
     $259 = (($mem) + ($$sum19)|0);
     $260 = $259;
     $261 = HEAP32[$260>>2]|0;
     $262 = ($261|0)==(0|0);
     do {
      if (!($262)) {
       $263 = $261;
       $264 = HEAP32[(((2656) + 16|0))>>2]|0;
       $265 = ($263>>>0)<($264>>>0);
       if ($265) {
        _abort();
        // unreachable;
       } else {
        $266 = (($R7$1) + 16|0);
        HEAP32[$266>>2] = $261;
        $267 = (($261) + 24|0);
        HEAP32[$267>>2] = $R7$1;
        break;
       }
      }
     } while(0);
     $$sum20 = (($11) + 12)|0;
     $268 = (($mem) + ($$sum20)|0);
     $269 = $268;
     $270 = HEAP32[$269>>2]|0;
     $271 = ($270|0)==(0|0);
     if ($271) {
      break;
     }
     $272 = $270;
     $273 = HEAP32[(((2656) + 16|0))>>2]|0;
     $274 = ($272>>>0)<($273>>>0);
     if ($274) {
      _abort();
      // unreachable;
     } else {
      $275 = (($R7$1) + 20|0);
      HEAP32[$275>>2] = $270;
      $276 = (($270) + 24|0);
      HEAP32[$276>>2] = $R7$1;
      break;
     }
    }
   } while(0);
   $277 = $167 | 1;
   $278 = (($p$0) + 4|0);
   HEAP32[$278>>2] = $277;
   $279 = (($141) + ($167)|0);
   $280 = $279;
   HEAP32[$280>>2] = $167;
   $281 = HEAP32[(((2656) + 20|0))>>2]|0;
   $282 = ($p$0|0)==($281|0);
   if (!($282)) {
    $psize$1 = $167;
    break;
   }
   HEAP32[(((2656) + 8|0))>>2] = $167;
   STACKTOP = sp;return;
  } else {
   $283 = $145 & -2;
   HEAP32[$144>>2] = $283;
   $284 = $psize$0 | 1;
   $285 = (($p$0) + 4|0);
   HEAP32[$285>>2] = $284;
   $286 = (($141) + ($psize$0)|0);
   $287 = $286;
   HEAP32[$287>>2] = $psize$0;
   $psize$1 = $psize$0;
  }
 } while(0);
 $288 = $psize$1 >>> 3;
 $289 = ($psize$1>>>0)<(256);
 if ($289) {
  $290 = $288 << 1;
  $291 = (((2656) + ($290<<2)|0) + 40|0);
  $292 = $291;
  $293 = HEAP32[((2656))>>2]|0;
  $294 = 1 << $288;
  $295 = $293 & $294;
  $296 = ($295|0)==(0);
  do {
   if ($296) {
    $297 = $293 | $294;
    HEAP32[((2656))>>2] = $297;
    $$sum16$pre = (($290) + 2)|0;
    $$pre = (((2656) + ($$sum16$pre<<2)|0) + 40|0);
    $$pre$phiZ2D = $$pre;$F16$0 = $292;
   } else {
    $$sum17 = (($290) + 2)|0;
    $298 = (((2656) + ($$sum17<<2)|0) + 40|0);
    $299 = HEAP32[$298>>2]|0;
    $300 = $299;
    $301 = HEAP32[(((2656) + 16|0))>>2]|0;
    $302 = ($300>>>0)<($301>>>0);
    if (!($302)) {
     $$pre$phiZ2D = $298;$F16$0 = $299;
     break;
    }
    _abort();
    // unreachable;
   }
  } while(0);
  HEAP32[$$pre$phiZ2D>>2] = $p$0;
  $303 = (($F16$0) + 12|0);
  HEAP32[$303>>2] = $p$0;
  $304 = (($p$0) + 8|0);
  HEAP32[$304>>2] = $F16$0;
  $305 = (($p$0) + 12|0);
  HEAP32[$305>>2] = $292;
  STACKTOP = sp;return;
 }
 $306 = $p$0;
 $307 = $psize$1 >>> 8;
 $308 = ($307|0)==(0);
 do {
  if ($308) {
   $I18$0 = 0;
  } else {
   $309 = ($psize$1>>>0)>(16777215);
   if ($309) {
    $I18$0 = 31;
    break;
   }
   $310 = (($307) + 1048320)|0;
   $311 = $310 >>> 16;
   $312 = $311 & 8;
   $313 = $307 << $312;
   $314 = (($313) + 520192)|0;
   $315 = $314 >>> 16;
   $316 = $315 & 4;
   $317 = $316 | $312;
   $318 = $313 << $316;
   $319 = (($318) + 245760)|0;
   $320 = $319 >>> 16;
   $321 = $320 & 2;
   $322 = $317 | $321;
   $323 = (14 - ($322))|0;
   $324 = $318 << $321;
   $325 = $324 >>> 15;
   $326 = (($323) + ($325))|0;
   $327 = $326 << 1;
   $328 = (($326) + 7)|0;
   $329 = $psize$1 >>> $328;
   $330 = $329 & 1;
   $331 = $330 | $327;
   $I18$0 = $331;
  }
 } while(0);
 $332 = (((2656) + ($I18$0<<2)|0) + 304|0);
 $333 = (($p$0) + 28|0);
 $I18$0$c = $I18$0;
 HEAP32[$333>>2] = $I18$0$c;
 $334 = (($p$0) + 20|0);
 HEAP32[$334>>2] = 0;
 $335 = (($p$0) + 16|0);
 HEAP32[$335>>2] = 0;
 $336 = HEAP32[(((2656) + 4|0))>>2]|0;
 $337 = 1 << $I18$0;
 $338 = $336 & $337;
 $339 = ($338|0)==(0);
 L199: do {
  if ($339) {
   $340 = $336 | $337;
   HEAP32[(((2656) + 4|0))>>2] = $340;
   HEAP32[$332>>2] = $306;
   $341 = (($p$0) + 24|0);
   $$c = $332;
   HEAP32[$341>>2] = $$c;
   $342 = (($p$0) + 12|0);
   HEAP32[$342>>2] = $p$0;
   $343 = (($p$0) + 8|0);
   HEAP32[$343>>2] = $p$0;
  } else {
   $344 = HEAP32[$332>>2]|0;
   $345 = ($I18$0|0)==(31);
   if ($345) {
    $348 = 0;
   } else {
    $346 = $I18$0 >>> 1;
    $347 = (25 - ($346))|0;
    $348 = $347;
   }
   $349 = (($344) + 4|0);
   $350 = HEAP32[$349>>2]|0;
   $351 = $350 & -8;
   $352 = ($351|0)==($psize$1|0);
   L205: do {
    if ($352) {
     $T$0$lcssa = $344;
    } else {
     $353 = $psize$1 << $348;
     $K19$057 = $353;$T$056 = $344;
     while(1) {
      $359 = $K19$057 >>> 31;
      $360 = ((($T$056) + ($359<<2)|0) + 16|0);
      $361 = HEAP32[$360>>2]|0;
      $362 = ($361|0)==(0|0);
      if ($362) {
       break;
      }
      $354 = $K19$057 << 1;
      $355 = (($361) + 4|0);
      $356 = HEAP32[$355>>2]|0;
      $357 = $356 & -8;
      $358 = ($357|0)==($psize$1|0);
      if ($358) {
       $T$0$lcssa = $361;
       break L205;
      } else {
       $T$056$phi = $361;$K19$057 = $354;$T$056 = $T$056$phi;
      }
     }
     $363 = $360;
     $364 = HEAP32[(((2656) + 16|0))>>2]|0;
     $365 = ($363>>>0)<($364>>>0);
     if ($365) {
      _abort();
      // unreachable;
     } else {
      HEAP32[$360>>2] = $306;
      $366 = (($p$0) + 24|0);
      $T$0$c13 = $T$056;
      HEAP32[$366>>2] = $T$0$c13;
      $367 = (($p$0) + 12|0);
      HEAP32[$367>>2] = $p$0;
      $368 = (($p$0) + 8|0);
      HEAP32[$368>>2] = $p$0;
      break L199;
     }
    }
   } while(0);
   $369 = (($T$0$lcssa) + 8|0);
   $370 = HEAP32[$369>>2]|0;
   $371 = $T$0$lcssa;
   $372 = HEAP32[(((2656) + 16|0))>>2]|0;
   $373 = ($371>>>0)<($372>>>0);
   if ($373) {
    _abort();
    // unreachable;
   }
   $374 = $370;
   $375 = ($374>>>0)<($372>>>0);
   if ($375) {
    _abort();
    // unreachable;
   } else {
    $376 = (($370) + 12|0);
    HEAP32[$376>>2] = $306;
    HEAP32[$369>>2] = $306;
    $377 = (($p$0) + 8|0);
    $$c12 = $370;
    HEAP32[$377>>2] = $$c12;
    $378 = (($p$0) + 12|0);
    $T$0$c = $T$0$lcssa;
    HEAP32[$378>>2] = $T$0$c;
    $379 = (($p$0) + 24|0);
    HEAP32[$379>>2] = 0;
    break;
   }
  }
 } while(0);
 $380 = HEAP32[(((2656) + 32|0))>>2]|0;
 $381 = (($380) + -1)|0;
 HEAP32[(((2656) + 32|0))>>2] = $381;
 $382 = ($381|0)==(0);
 if ($382) {
  $sp$0$in$i = (((2656) + 456|0));
 } else {
  STACKTOP = sp;return;
 }
 while(1) {
  $sp$0$i = HEAP32[$sp$0$in$i>>2]|0;
  $383 = ($sp$0$i|0)==(0|0);
  $384 = (($sp$0$i) + 8|0);
  if ($383) {
   break;
  } else {
   $sp$0$in$i$phi = $384;$sp$0$in$i = $sp$0$in$i$phi;
  }
 }
 HEAP32[(((2656) + 32|0))>>2] = -1;
 STACKTOP = sp;return;
}
function _memcmp($vl,$vr,$n) {
 $vl = $vl|0;
 $vr = $vr|0;
 $n = $n|0;
 var $$03 = 0, $1 = 0, $10 = 0, $11 = 0, $12 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $l$04 = 0, $r$05 = 0, label = 0, sp = 0;
 sp = STACKTOP;
 $1 = ($n|0)==(0);
 L1: do {
  if ($1) {
   $12 = 0;
  } else {
   $$03 = $n;$l$04 = $vl;$r$05 = $vr;
   while(1) {
    $2 = HEAP8[$l$04]|0;
    $3 = HEAP8[$r$05]|0;
    $4 = ($2<<24>>24)==($3<<24>>24);
    if (!($4)) {
     break;
    }
    $5 = (($$03) + -1)|0;
    $6 = (($l$04) + 1|0);
    $7 = (($r$05) + 1|0);
    $8 = ($5|0)==(0);
    if ($8) {
     $12 = 0;
     break L1;
    } else {
     $$03 = $5;$l$04 = $6;$r$05 = $7;
    }
   }
   $9 = $2&255;
   $10 = $3&255;
   $11 = (($9) - ($10))|0;
   $12 = $11;
  }
 } while(0);
 STACKTOP = sp;return ($12|0);
}
function runPostSets() {
 
}
function _memset(ptr, value, num) {
    ptr = ptr|0; value = value|0; num = num|0;
    var stop = 0, value4 = 0, stop4 = 0, unaligned = 0;
    stop = (ptr + num)|0;
    if ((num|0) >= 20) {
      // This is unaligned, but quite large, so work hard to get to aligned settings
      value = value & 0xff;
      unaligned = ptr & 3;
      value4 = value | (value << 8) | (value << 16) | (value << 24);
      stop4 = stop & ~3;
      if (unaligned) {
        unaligned = (ptr + 4 - unaligned)|0;
        while ((ptr|0) < (unaligned|0)) { // no need to check for stop, since we have large num
          HEAP8[(ptr)]=value;
          ptr = (ptr+1)|0;
        }
      }
      while ((ptr|0) < (stop4|0)) {
        HEAP32[((ptr)>>2)]=value4;
        ptr = (ptr+4)|0;
      }
    }
    while ((ptr|0) < (stop|0)) {
      HEAP8[(ptr)]=value;
      ptr = (ptr+1)|0;
    }
    return (ptr-num)|0;
}
function _memcpy(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    if ((num|0) >= 4096) return _emscripten_memcpy_big(dest|0, src|0, num|0)|0;
    ret = dest|0;
    if ((dest&3) == (src&3)) {
      while (dest & 3) {
        if ((num|0) == 0) return ret|0;
        HEAP8[(dest)]=((HEAP8[(src)])|0);
        dest = (dest+1)|0;
        src = (src+1)|0;
        num = (num-1)|0;
      }
      while ((num|0) >= 4) {
        HEAP32[((dest)>>2)]=((HEAP32[((src)>>2)])|0);
        dest = (dest+4)|0;
        src = (src+4)|0;
        num = (num-4)|0;
      }
    }
    while ((num|0) > 0) {
      HEAP8[(dest)]=((HEAP8[(src)])|0);
      dest = (dest+1)|0;
      src = (src+1)|0;
      num = (num-1)|0;
    }
    return ret|0;
}
function _memmove(dest, src, num) {
    dest = dest|0; src = src|0; num = num|0;
    var ret = 0;
    if (((src|0) < (dest|0)) & ((dest|0) < ((src + num)|0))) {
      // Unlikely case: Copy backwards in a safe manner
      ret = dest;
      src = (src + num)|0;
      dest = (dest + num)|0;
      while ((num|0) > 0) {
        dest = (dest - 1)|0;
        src = (src - 1)|0;
        num = (num - 1)|0;
        HEAP8[(dest)]=((HEAP8[(src)])|0);
      }
      dest = ret;
    } else {
      _memcpy(dest, src, num) | 0;
    }
    return dest | 0;
}
function _strlen(ptr) {
    ptr = ptr|0;
    var curr = 0;
    curr = ptr;
    while (((HEAP8[(curr)])|0)) {
      curr = (curr + 1)|0;
    }
    return (curr - ptr)|0;
}

// EMSCRIPTEN_END_FUNCS

  

  // EMSCRIPTEN_END_FUNCS
  

  return { _malloc: _malloc, _strlen: _strlen, _free: _free, _SpcJsDestroy: _SpcJsDestroy, _memmove: _memmove, _memset: _memset, _SpcJsInit: _SpcJsInit, _SpcJsDecodeAudio: _SpcJsDecodeAudio, _memcpy: _memcpy, runPostSets: runPostSets, stackAlloc: stackAlloc, stackSave: stackSave, stackRestore: stackRestore, setThrew: setThrew, setTempRet0: setTempRet0, setTempRet1: setTempRet1, setTempRet2: setTempRet2, setTempRet3: setTempRet3, setTempRet4: setTempRet4, setTempRet5: setTempRet5, setTempRet6: setTempRet6, setTempRet7: setTempRet7, setTempRet8: setTempRet8, setTempRet9: setTempRet9 };
})
// EMSCRIPTEN_END_ASM
({ "Math": Math, "Int8Array": Int8Array, "Int16Array": Int16Array, "Int32Array": Int32Array, "Uint8Array": Uint8Array, "Uint16Array": Uint16Array, "Uint32Array": Uint32Array, "Float32Array": Float32Array, "Float64Array": Float64Array }, { "abort": abort, "assert": assert, "asmPrintInt": asmPrintInt, "asmPrintFloat": asmPrintFloat, "min": Math_min, "_sysconf": _sysconf, "_llvm_lifetime_start": _llvm_lifetime_start, "_fflush": _fflush, "__formatString": __formatString, "_mkport": _mkport, "_send": _send, "_pwrite": _pwrite, "_abort": _abort, "__reallyNegative": __reallyNegative, "_fwrite": _fwrite, "_sbrk": _sbrk, "_printf": _printf, "_fprintf": _fprintf, "___setErrNo": ___setErrNo, "_llvm_lifetime_end": _llvm_lifetime_end, "_fileno": _fileno, "_write": _write, "_emscripten_memcpy_big": _emscripten_memcpy_big, "___assert_fail": ___assert_fail, "___errno_location": ___errno_location, "_time": _time, "STACKTOP": STACKTOP, "STACK_MAX": STACK_MAX, "tempDoublePtr": tempDoublePtr, "ABORT": ABORT, "NaN": NaN, "Infinity": Infinity }, buffer);
var _malloc = Module["_malloc"] = asm["_malloc"];
var _strlen = Module["_strlen"] = asm["_strlen"];
var _free = Module["_free"] = asm["_free"];
var _SpcJsDestroy = Module["_SpcJsDestroy"] = asm["_SpcJsDestroy"];
var _memmove = Module["_memmove"] = asm["_memmove"];
var _memset = Module["_memset"] = asm["_memset"];
var _SpcJsInit = Module["_SpcJsInit"] = asm["_SpcJsInit"];
var _SpcJsDecodeAudio = Module["_SpcJsDecodeAudio"] = asm["_SpcJsDecodeAudio"];
var _memcpy = Module["_memcpy"] = asm["_memcpy"];
var runPostSets = Module["runPostSets"] = asm["runPostSets"];

Runtime.stackAlloc = function(size) { return asm['stackAlloc'](size) };
Runtime.stackSave = function() { return asm['stackSave']() };
Runtime.stackRestore = function(top) { asm['stackRestore'](top) };


// Warning: printing of i64 values may be slightly rounded! No deep i64 math used, so precise i64 code not included
var i64Math = null;

// === Auto-generated postamble setup entry stuff ===

if (memoryInitializer) {
  if (ENVIRONMENT_IS_NODE || ENVIRONMENT_IS_SHELL) {
    var data = Module['readBinary'](memoryInitializer);
    HEAPU8.set(data, STATIC_BASE);
  } else {
    addRunDependency('memory initializer');
    Browser.asyncLoad(memoryInitializer, function(data) {
      HEAPU8.set(data, STATIC_BASE);
      removeRunDependency('memory initializer');
    }, function(data) {
      throw 'could not load memory initializer ' + memoryInitializer;
    });
  }
}

function ExitStatus(status) {
  this.name = "ExitStatus";
  this.message = "Program terminated with exit(" + status + ")";
  this.status = status;
};
ExitStatus.prototype = new Error();
ExitStatus.prototype.constructor = ExitStatus;

var initialStackTop;
var preloadStartTime = null;
var calledMain = false;

dependenciesFulfilled = function runCaller() {
  // If run has never been called, and we should call run (INVOKE_RUN is true, and Module.noInitialRun is not false)
  if (!Module['calledRun'] && shouldRunNow) run();
  if (!Module['calledRun']) dependenciesFulfilled = runCaller; // try this again later, after new deps are fulfilled
}

Module['callMain'] = Module.callMain = function callMain(args) {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on __ATMAIN__)');
  assert(__ATPRERUN__.length == 0, 'cannot call main when preRun functions remain to be called');

  args = args || [];

  if (ENVIRONMENT_IS_WEB && preloadStartTime !== null) {
    Module.printErr('preload time: ' + (Date.now() - preloadStartTime) + ' ms');
  }

  ensureInitRuntime();

  var argc = args.length+1;
  function pad() {
    for (var i = 0; i < 4-1; i++) {
      argv.push(0);
    }
  }
  var argv = [allocate(intArrayFromString("/bin/this.program"), 'i8', ALLOC_NORMAL) ];
  pad();
  for (var i = 0; i < argc-1; i = i + 1) {
    argv.push(allocate(intArrayFromString(args[i]), 'i8', ALLOC_NORMAL));
    pad();
  }
  argv.push(0);
  argv = allocate(argv, 'i32', ALLOC_NORMAL);

  initialStackTop = STACKTOP;

  try {

    var ret = Module['_main'](argc, argv, 0);


    // if we're not running an evented main loop, it's time to exit
    if (!Module['noExitRuntime']) {
      exit(ret);
    }
  }
  catch(e) {
    if (e instanceof ExitStatus) {
      // exit() throws this once it's done to make sure execution
      // has been stopped completely
      return;
    } else if (e == 'SimulateInfiniteLoop') {
      // running an evented main loop, don't immediately exit
      Module['noExitRuntime'] = true;
      return;
    } else {
      if (e && typeof e === 'object' && e.stack) Module.printErr('exception thrown: ' + [e, e.stack]);
      throw e;
    }
  } finally {
    calledMain = true;
  }
}




function run(args) {
  args = args || Module['arguments'];

  if (preloadStartTime === null) preloadStartTime = Date.now();

  if (runDependencies > 0) {
    Module.printErr('run() called, but dependencies remain, so not running');
    return;
  }

  preRun();

  if (runDependencies > 0) return; // a preRun added a dependency, run will be called later
  if (Module['calledRun']) return; // run may have just been called through dependencies being fulfilled just in this very frame

  function doRun() {
    if (Module['calledRun']) return; // run may have just been called while the async setStatus time below was happening
    Module['calledRun'] = true;

    ensureInitRuntime();

    preMain();

    if (Module['_main'] && shouldRunNow) {
      Module['callMain'](args);
    }

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function() {
      setTimeout(function() {
        Module['setStatus']('');
      }, 1);
      if (!ABORT) doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = Module.run = run;

function exit(status) {
  ABORT = true;
  EXITSTATUS = status;
  STACKTOP = initialStackTop;

  // exit the runtime
  exitRuntime();

  // TODO We should handle this differently based on environment.
  // In the browser, the best we can do is throw an exception
  // to halt execution, but in node we could process.exit and
  // I'd imagine SM shell would have something equivalent.
  // This would let us set a proper exit status (which
  // would be great for checking test exit statuses).
  // https://github.com/kripken/emscripten/issues/1371

  // throw an exception to halt the current execution
  throw new ExitStatus(status);
}
Module['exit'] = Module.exit = exit;

function abort(text) {
  if (text) {
    Module.print(text);
    Module.printErr(text);
  }

  ABORT = true;
  EXITSTATUS = 1;

  var extra = '\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.';

  throw 'abort() at ' + stackTrace() + extra;
}
Module['abort'] = Module.abort = abort;

// {{PRE_RUN_ADDITIONS}}

if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}

// shouldRunNow refers to calling main(), not run().
var shouldRunNow = true;
if (Module['noInitialRun']) {
  shouldRunNow = false;
}


run();

// {{POST_RUN_ADDITIONS}}






// {{MODULE_ADDITIONS}}



