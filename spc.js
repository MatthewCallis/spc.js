function f(a){throw a;}var i=void 0,l=!0,m=null,n=!1;function q(){return function(){}}var r;r||(r=eval("(function() { try { return Module || {} } catch(e) { return {} } })()"));var aa={},s;for(s in r)r.hasOwnProperty(s)&&(aa[s]=r[s]);var u="object"===typeof process&&"function"===typeof require,ba="object"===typeof window,ca="function"===typeof importScripts,da=!ba&&!u&&!ca;
if(u){r.print||(r.print=function(a){process.stdout.write(a+"\n")});r.printErr||(r.printErr=function(a){process.stderr.write(a+"\n")});var ea=require("fs"),fa=require("path");r.read=function(a,b){var a=fa.normalize(a),c=ea.readFileSync(a);!c&&a!=fa.resolve(a)&&(a=path.join(__dirname,"..","src",a),c=ea.readFileSync(a));c&&!b&&(c=c.toString());return c};r.readBinary=function(a){return r.read(a,l)};r.load=function(a){ga(read(a))};r.arguments=process.argv.slice(2);module.exports=r}else da?(r.print||(r.print=
print),"undefined"!=typeof printErr&&(r.printErr=printErr),r.read="undefined"!=typeof read?read:function(){f("no read() available (jsc?)")},r.readBinary=function(a){return read(a,"binary")},"undefined"!=typeof scriptArgs?r.arguments=scriptArgs:"undefined"!=typeof arguments&&(r.arguments=arguments),this.Module=r,eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined")):ba||ca?(r.read=function(a){var b=new XMLHttpRequest;b.open("GET",a,n);b.send(m);return b.responseText},
"undefined"!=typeof arguments&&(r.arguments=arguments),"undefined"!==typeof console?(r.print||(r.print=function(a){console.log(a)}),r.printErr||(r.printErr=function(a){console.log(a)})):r.print||(r.print=q()),ba?this.Module=r:r.load=importScripts):f("Unknown runtime environment. Where are we?");function ga(a){eval.call(m,a)}"undefined"==!r.load&&r.read&&(r.load=function(a){ga(r.read(a))});r.print||(r.print=q());r.printErr||(r.printErr=r.print);r.arguments||(r.arguments=[]);r.print=r.print;r.V=r.printErr;
r.preRun=[];r.postRun=[];for(s in aa)aa.hasOwnProperty(s)&&(r[s]=aa[s]);
var z={Wa:function(){return x},Va:function(a){x=a},De:function(a,b){b=b||4;return 1==b?a:isNumber(a)&&isNumber(b)?Math.ceil(a/b)*b:isNumber(b)&&isPowerOfTwo(b)?"((("+a+")+"+(b-1)+")&"+-b+")":"Math.ceil(("+a+")/"+b+")*"+b},fc:function(a){return a in z.Ob||a in z.Mb},gc:function(a){return"*"==a[a.length-1]},hc:function(a){return isPointerType(a)?n:isArrayType(a)||/<?\{ ?[^}]* ?\}>?/.test(a)?l:"%"==a[0]},Ob:{i1:0,i8:0,i16:0,i32:0,i64:0},Mb:{"float":0,"double":0},Ue:function(a,b){return(a|0|b|0)+4294967296*
(Math.round(a/4294967296)|Math.round(b/4294967296))},ve:function(a,b){return((a|0)&(b|0))+4294967296*(Math.round(a/4294967296)&Math.round(b/4294967296))},$e:function(a,b){return((a|0)^(b|0))+4294967296*(Math.round(a/4294967296)^Math.round(b/4294967296))},La:function(a){switch(a){case "i1":case "i8":return 1;case "i16":return 2;case "i32":return 4;case "i64":return 8;case "float":return 4;case "double":return 8;default:return"*"===a[a.length-1]?z.P:"i"===a[0]?(a=parseInt(a.substr(1)),B(0===a%8),a/
8):0}},ob:function(a){return Math.max(z.La(a),z.P)},Xb:function(a,b){var c={};return b?a.filter(function(a){return c[a[b]]?n:c[a[b]]=l}):a.filter(function(a){return c[a]?n:c[a]=l})},set:function(){for(var a="object"===typeof arguments[0]?arguments[0]:arguments,b={},c=0;c<a.length;c++)b[a[c]]=0;return b},le:8,Ka:function(a,b,c){return!c&&("i64"==a||"double"==a)?8:!a?Math.min(b,8):Math.min(b||(a?z.ob(a):0),z.P)},Tb:function(a){a.D=0;a.T=0;var b=[],c=-1,d=0;a.mb=a.Ha.map(function(e){d++;var g,h;z.fc(e)||
z.gc(e)?(g=z.La(e),h=z.Ka(e,g)):z.hc(e)?"0"===e[1]?(g=0,h=Types.types[e]?z.Ka(m,Types.types[e].T):a.T||QUANTUM_SIZE):(g=Types.types[e].D,h=z.Ka(m,Types.types[e].T)):"b"==e[0]?(g=e.substr(1)|0,h=1):"<"===e[0]?g=h=Types.types[e].D:"i"===e[0]?(g=h=parseInt(e.substr(1))/8,B(0===g%1,"cannot handle non-byte-size field "+e)):B(n,"invalid type for calculateStructAlignment");a.Ve&&(h=1);a.T=Math.max(a.T,h);e=z.S(a.D,h);a.D=e+g;0<=c&&b.push(e-c);return c=e});a.ub&&"["===a.ub[0]&&(a.D=parseInt(a.ub.substr(1))*
a.D/2);a.D=z.S(a.D,a.T);0==b.length?a.lb=a.D:1==z.Xb(b).length&&(a.lb=b[0]);a.Qe=1!=a.lb;return a.mb},Zb:function(a,b,c){var d,e;if(b){c=c||0;d=("undefined"===typeof Types?z.Ze:Types.types)[b];if(!d)return m;if(d.Ha.length!=a.length)return printErr("Number of named fields must match the type for "+b+": possibly duplicate struct names. Cannot return structInfo"),m;e=d.mb}else d={Ha:a.map(function(a){return a[0]})},e=z.Tb(d);var g={ne:d.D};b?a.forEach(function(a,b){if("string"===typeof a)g[a]=e[b]+
c;else{var k,w;for(w in a)k=w;g[k]=z.Zb(a[k],d.Ha[b],e[b])}}):a.forEach(function(a,b){g[a[1]]=e[b]});return g},Fa:function(a,b,c){return c&&c.length?(c.splice||(c=Array.prototype.slice.call(c)),c.splice(0,0,b),r["dynCall_"+a].apply(m,c)):r["dynCall_"+a].call(m,b)},na:[],oe:function(a){for(var b=0;b<z.na.length;b++)if(!z.na[b])return z.na[b]=a,2*(1+b);f("Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.")},Xe:function(a){z.na[(a-2)/2]=m},Ee:function(a,b){z.Ea||
(z.Ea={});var c=z.Ea[a];if(c)return c;for(var c=[],d=0;d<b;d++)c.push(String.fromCharCode(36)+d);a=D(a);'"'===a[0]&&(a.indexOf('"',1)===a.length-1?a=a.substr(1,a.length-2):F("invalid EM_ASM input |"+a+"|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)"));return z.Ea[a]=eval("(function("+c.join(",")+"){ "+a+" })")},da:function(a){z.da.Ta||(z.da.Ta={});z.da.Ta[a]||(z.da.Ta[a]=1,r.V(a))},Ja:{},Ge:function(a,b){B(b);z.Ja[a]||(z.Ja[a]=function(){return z.Fa(b,
a,arguments)});return z.Ja[a]},Ca:function(){var a=[],b=0;this.Pa=function(c){c&=255;if(0==a.length){if(0==(c&128))return String.fromCharCode(c);a.push(c);b=192==(c&224)?1:224==(c&240)?2:3;return""}if(b&&(a.push(c),b--,0<b))return"";var c=a[0],d=a[1],e=a[2],g=a[3];2==a.length?c=String.fromCharCode((c&31)<<6|d&63):3==a.length?c=String.fromCharCode((c&15)<<12|(d&63)<<6|e&63):(c=(c&7)<<18|(d&63)<<12|(e&63)<<6|g&63,c=String.fromCharCode(Math.floor((c-65536)/1024)+55296,(c-65536)%1024+56320));a.length=
0;return c};this.nc=function(a){for(var a=unescape(encodeURIComponent(a)),b=[],e=0;e<a.length;e++)b.push(a.charCodeAt(e));return b}},Fe:function(){f("You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work")},Ua:function(a){var b=x;x=x+a|0;x=x+7&-8;return b},Ab:function(a){var b=H;H=H+a|0;H=H+7&-8;return b},ma:function(a){var b=J;J=J+a|0;J=J+7&-8;J>=ha&&F("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value "+
ha+", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.");return b},S:function(a,b){return Math.ceil(a/(b?b:8))*(b?b:8)},jc:function(a,b,c){return c?+(a>>>0)+4294967296*+(b>>>0):+(a>>>0)+4294967296*+(b|0)},Nb:8,P:4,me:0};r.Runtime=z;var ia=n,ja,ka;function B(a,b){a||F("Assertion failed: "+b)}r.ccall=function(a,b,c,d){return la(ma(a),b,c,d)};
function ma(a){try{var b=r["_"+a];b||(b=eval("_"+a))}catch(c){}B(b,"Cannot call unknown function "+a+" (perhaps LLVM optimizations or closure removed it?)");return b}function la(a,b,c,d){function e(a,b){if("string"==b){if(a===m||a===i||0===a)return 0;a=K(a);b="array"}if("array"==b){g||(g=z.Wa());var c=z.Ua(a.length);na(a,c);return c}return a}var g=0,h=0,d=d?d.map(function(a){return e(a,c[h++])}):[];a=a.apply(m,d);"string"==b?b=D(a):(B("array"!=b),b=a);g&&z.Va(g);return b}
r.cwrap=function(a,b,c){var d=ma(a);return function(){return la(d,b,c,Array.prototype.slice.call(arguments))}};
function oa(a,b,c){c=c||"i8";"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":L[a]=b;break;case "i8":L[a]=b;break;case "i16":pa[a>>1]=b;break;case "i32":N[a>>2]=b;break;case "i64":ka=[b>>>0,(ja=b,1<=+qa(ja)?0<ja?(ra(+ta(ja/4294967296),4294967295)|0)>>>0:~~+ua((ja-+(~~ja>>>0))/4294967296)>>>0:0)];N[a>>2]=ka[0];N[a+4>>2]=ka[1];break;case "float":va[a>>2]=b;break;case "double":wa[a>>3]=b;break;default:F("invalid type for setValue: "+c)}}r.setValue=oa;
r.getValue=function(a,b){b=b||"i8";"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":return L[a];case "i8":return L[a];case "i16":return pa[a>>1];case "i32":return N[a>>2];case "i64":return N[a>>2];case "float":return va[a>>2];case "double":return wa[a>>3];default:F("invalid type for setValue: "+b)}return m};var xa=1,ya=2,za=4;r.ALLOC_NORMAL=0;r.ALLOC_STACK=xa;r.ALLOC_STATIC=ya;r.ALLOC_DYNAMIC=3;r.ALLOC_NONE=za;
function O(a,b,c,d){var e,g;"number"===typeof a?(e=l,g=a):(e=n,g=a.length);var h="string"===typeof b?b:m,c=c==za?d:[Aa,z.Ua,z.Ab,z.ma][c===i?ya:c](Math.max(g,h?1:b.length));if(e){d=c;B(0==(c&3));for(a=c+(g&-4);d<a;d+=4)N[d>>2]=0;for(a=c+g;d<a;)L[d++|0]=0;return c}if("i8"===h)return a.subarray||a.slice?P.set(a,c):P.set(new Uint8Array(a),c),c;for(var d=0,j,k;d<g;){var w=a[d];"function"===typeof w&&(w=z.He(w));e=h||b[d];0===e?d++:("i64"==e&&(e="i32"),oa(c+d,w,e),k!==e&&(j=z.La(e),k=e),d+=j)}return c}
r.allocate=O;function D(a,b){for(var c=n,d,e=0;;){d=P[a+e|0];if(128<=d)c=l;else if(0==d&&!b)break;e++;if(b&&e==b)break}b||(b=e);var g="";if(!c){for(;0<b;)d=String.fromCharCode.apply(String,P.subarray(a,a+Math.min(b,1024))),g=g?g+d:d,a+=1024,b-=1024;return g}c=new z.Ca;for(e=0;e<b;e++)d=P[a+e|0],g+=c.Pa(d);return g}r.Pointer_stringify=D;r.UTF16ToString=function(a){for(var b=0,c="";;){var d=pa[a+2*b>>1];if(0==d)return c;++b;c+=String.fromCharCode(d)}};
r.stringToUTF16=function(a,b){for(var c=0;c<a.length;++c)pa[b+2*c>>1]=a.charCodeAt(c);pa[b+2*a.length>>1]=0};r.UTF32ToString=function(a){for(var b=0,c="";;){var d=N[a+4*b>>2];if(0==d)return c;++b;65536<=d?(d-=65536,c+=String.fromCharCode(55296|d>>10,56320|d&1023)):c+=String.fromCharCode(d)}};r.stringToUTF32=function(a,b){for(var c=0,d=0;d<a.length;++d){var e=a.charCodeAt(d);if(55296<=e&&57343>=e)var g=a.charCodeAt(++d),e=65536+((e&1023)<<10)|g&1023;N[b+4*c>>2]=e;++c}N[b+4*c>>2]=0};
function Ba(a){function b(h,k,w){var k=k||Infinity,E="",v=[],t;if("N"===a[c]){c++;"K"===a[c]&&c++;for(t=[];"E"!==a[c];)if("S"===a[c]){c++;var C=a.indexOf("_",c);t.push(e[a.substring(c,C)||0]||"?");c=C+1}else if("C"===a[c])t.push(t[t.length-1]),c+=2;else{var C=parseInt(a.substr(c)),G=C.toString().length;if(!C||!G){c--;break}var I=a.substr(c+G,C);t.push(I);e.push(I);c+=G+C}c++;t=t.join("::");k--;if(0===k)return h?[t]:t}else if(("K"===a[c]||g&&"L"===a[c])&&c++,C=parseInt(a.substr(c)))G=C.toString().length,
t=a.substr(c+G,C),c+=G+C;g=n;"I"===a[c]?(c++,C=b(l),G=b(l,1,l),E+=G[0]+" "+t+"<"+C.join(", ")+">"):E=t;a:for(;c<a.length&&0<k--;)if(t=a[c++],t in d)v.push(d[t]);else switch(t){case "P":v.push(b(l,1,l)[0]+"*");break;case "R":v.push(b(l,1,l)[0]+"&");break;case "L":c++;C=a.indexOf("E",c)-c;v.push(a.substr(c,C));c+=C+2;break;case "A":C=parseInt(a.substr(c));c+=C.toString().length;"_"!==a[c]&&f("?");c++;v.push(b(l,1,l)[0]+" ["+C+"]");break;case "E":break a;default:E+="?"+t;break a}!w&&(1===v.length&&"void"===
v[0])&&(v=[]);return h?v:E+("("+v.join(", ")+")")}var c=3,d={v:"void",b:"bool",c:"char",s:"short",i:"int",l:"long",f:"float",d:"double",w:"wchar_t",a:"signed char",h:"unsigned char",t:"unsigned short",j:"unsigned int",m:"unsigned long",x:"long long",y:"unsigned long long",z:"..."},e=[],g=l;try{if("Object._main"==a||"_main"==a)return"main()";"number"===typeof a&&(a=D(a));if("_"!==a[0]||"_"!==a[1]||"Z"!==a[2])return a;switch(a[3]){case "n":return"operator new()";case "d":return"operator delete()"}return b()}catch(h){return a}}
function Ca(){var a=Error().stack;return a?a.replace(/__Z[\w\d_]+/g,function(a){var c=Ba(a);return a===c?a:a+" ["+c+"]"}):"(no stack trace available)"}for(var L,P,pa,Da,N,Ea,va,wa,Fa=0,H=0,Ga=0,x=0,Ha=0,Ia=0,J=0,Ja=r.TOTAL_STACK||5242880,ha=r.TOTAL_MEMORY||16777216,Q=4096;Q<ha||Q<2*Ja;)Q=16777216>Q?2*Q:Q+16777216;Q!==ha&&(r.V("increasing TOTAL_MEMORY to "+Q+" to be more reasonable"),ha=Q);
B("undefined"!==typeof Int32Array&&"undefined"!==typeof Float64Array&&!!(new Int32Array(1)).subarray&&!!(new Int32Array(1)).set,"JS engine does not provide full typed array support");var R=new ArrayBuffer(ha);L=new Int8Array(R);pa=new Int16Array(R);N=new Int32Array(R);P=new Uint8Array(R);Da=new Uint16Array(R);Ea=new Uint32Array(R);va=new Float32Array(R);wa=new Float64Array(R);N[0]=255;B(255===P[0]&&0===P[3],"Typed arrays 2 must be run on a little-endian system");r.HEAP=i;r.HEAP8=L;r.HEAP16=pa;
r.HEAP32=N;r.HEAPU8=P;r.HEAPU16=Da;r.HEAPU32=Ea;r.HEAPF32=va;r.HEAPF64=wa;function Ka(a){for(;0<a.length;){var b=a.shift();if("function"==typeof b)b();else{var c=b.U;"number"===typeof c?b.Da===i?z.Fa("v",c):z.Fa("vi",c,[b.Da]):c(b.Da===i?m:b.Da)}}}var La=[],Ma=[],Na=[],Oa=[],Pa=[],Qa=n;function Ra(a){La.unshift(a)}r.addOnPreRun=r.te=Ra;r.addOnInit=r.qe=function(a){Ma.unshift(a)};r.addOnPreMain=r.se=function(a){Na.unshift(a)};r.addOnExit=r.pe=function(a){Oa.unshift(a)};
function Sa(a){Pa.unshift(a)}r.addOnPostRun=r.re=Sa;function K(a,b,c){a=(new z.Ca).nc(a);c&&(a.length=c);b||a.push(0);return a}r.intArrayFromString=K;r.intArrayToString=function(a){for(var b=[],c=0;c<a.length;c++){var d=a[c];255<d&&(d&=255);b.push(String.fromCharCode(d))}return b.join("")};r.writeStringToMemory=function(a,b,c){a=K(a,c);for(c=0;c<a.length;)L[b+c|0]=a[c],c+=1};function na(a,b){for(var c=0;c<a.length;c++)L[b+c|0]=a[c]}r.writeArrayToMemory=na;
r.writeAsciiToMemory=function(a,b,c){for(var d=0;d<a.length;d++)L[b+d|0]=a.charCodeAt(d);c||(L[b+a.length|0]=0)};function Ta(a,b){return 0<=a?a:32>=b?2*Math.abs(1<<b-1)+a:Math.pow(2,b)+a}function Ua(a,b){if(0>=a)return a;var c=32>=b?Math.abs(1<<b-1):Math.pow(2,b-1);if(a>=c&&(32>=b||a>c))a=-2*c+a;return a}if(!Math.imul||-5!==Math.imul(4294967295,5))Math.imul=function(a,b){var c=a&65535,d=b&65535;return c*d+((a>>>16)*d+c*(b>>>16)<<16)|0};Math.Ke=Math.imul;
var qa=Math.abs,ua=Math.ceil,ta=Math.floor,ra=Math.min,S=0,Va=m,Wa=m;function Xa(){S++;r.monitorRunDependencies&&r.monitorRunDependencies(S)}r.addRunDependency=Xa;function Ya(){S--;r.monitorRunDependencies&&r.monitorRunDependencies(S);if(0==S&&(Va!==m&&(clearInterval(Va),Va=m),Wa)){var a=Wa;Wa=m;a()}}r.removeRunDependency=Ya;r.preloadedImages={};r.preloadedAudios={};Fa=8;H=Fa+z.S(3003);Ma.push();
O([99,111,117,110,116,32,62,32,48,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,78,69,83,95,83,80,67,46,99,112,112,0,0,0,100,115,112,95,114,101,97,100,0,0,0,0,0,0,0,0,114,101,103,32,43,32,40,114,95,116,48,111,117,116,32,43,32,48,120,70,48,32,45,32,48,120,49,48,48,48,48,41,32,60,32,48,120,49,48,48,0,0,0,0,0,0,0,0,99,112,117,95,114,101,97,100,0,0,0,0,0,0,0,0,45,99,112,117,95,108,97,103,95,109,97,120,32,60,61,32,109,46,115,112,99,95,116,105,109,101,32,38,38,32,109,46,
115,112,99,95,116,105,109,101,32,60,61,32,48,0,0,0,101,110,100,95,102,114,97,109,101,0,0,0,0,0,0,0,114,101,108,95,116,105,109,101,32,60,61,32,48,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,67,80,85,46,104,0,0,0,0,0,0,114,117,110,95,117,110,116,105,108,95,0,0,0,0,0,0,83,80,67,32,101,109,117,108,97,116,105,111,110,32,101,114,114,111,114,0,0,0,0,0,48,0,0,0,0,0,0,0,109,46,115,112,99,95,116,105,109,101,32,60,61,32,101,110,100,95,116,105,109,101,0,0,100,115,112,95,119,
114,105,116,101,0,0,0,0,0,0,0,40,71,52,54,38,84,84,104,72,71,69,86,85,101,34,70,40,71,52,54,38,84,84,116,72,71,69,86,85,101,34,56,40,71,52,54,38,68,84,102,72,71,69,86,85,69,34,67,40,71,52,54,38,68,84,117,72,71,69,86,85,85,34,54,40,71,52,54,38,84,82,69,72,71,69,86,85,85,34,197,56,71,52,54,38,68,82,68,72,71,69,86,85,85,34,52,56,71,69,71,37,100,82,73,72,71,86,103,69,85,34,131,40,71,52,54,36,83,67,64,72,71,69,86,52,84,34,96,83,78,69,83,45,83,80,67,55,48,48,32,83,111,117,110,100,32,70,105,108,101,32,68,
97,116,97,32,118,48,46,51,48,26,26,0,0,0,0,0,78,111,116,32,97,110,32,83,80,67,32,102,105,108,101,0,67,111,114,114,117,112,116,32,83,80,67,32,102,105,108,101,0,0,0,0,0,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,78,69,83,95,83,80,67,95,109,105,115,99,46,99,112,112,0,0,0,0,0,0,115,101,116,95,111,117,116,112,117,116,0,0,0,0,0,0,111,117,116,32,60,61,32,111,117,116,95,101,110,100,0,0,111,117,116,32,60,61,32,38,109,46,101,120,
116,114,97,95,98,117,102,32,91,101,120,116,114,97,95,115,105,122,101,93,0,0,0,0,0,0,0,0,115,97,118,101,95,101,120,116,114,97,0,0,0,0,0,0,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,112,108,97,121,0,0,0,0,40,115,105,122,101,32,38,32,49,41,32,61,61,32,48,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,68,83,80,46,99,112,112,0,0,0,0,115,101,116,95,111,117,116,112,117,116,0,0,0,0,0,0,118,45,62,98,114,114,95,111,102,102,115,101,116,32,61,61,32,98,114,
114,95,98,108,111,99,107,95,115,105,122,101,0,118,111,105,99,101,95,86,52,0,0,0,0,0,0,0,0,99,108,111,99,107,115,95,114,101,109,97,105,110,32,62,32,48,0,0,0,0,0,0,0,114,117,110,0,0,0,0,0,109,46,114,97,109,0,0,0,115,111,102,116,95,114,101,115,101,116,95,99,111,109,109,111,110,0,0,0,0,0,0,0,69,139,90,154,228,130,27,120,0,0,170,150,137,14,224,128,42,73,61,186,20,160,172,197,0,0,81,187,156,78,123,255,244,253,87,50,55,217,66,34,0,0,91,60,159,27,135,154,111,39,175,123,229,104,10,217,0,0,154,197,156,78,123,
255,234,33,120,79,221,237,36,20,0,0,119,177,209,54,193,103,82,87,70,61,89,244,135,164,0,0,126,68,156,78,123,255,117,245,6,151,16,195,36,187,0,0,123,122,224,96,18,15,247,116,28,229,57,61,115,193,0,0,122,179,255,78,123,255,42,40,118,111,108,97,116,105,108,101,32,99,104,97,114,42,41,32,38,105,32,33,61,32,48,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,98,108,97,114,103,103,95,101,110,100,105,97,110,46,104,0,0,0,0,0,0,0,0,98,108,97,114,103,103,95,118,101,114,105,102,121,
95,98,121,116,101,95,111,114,100,101,114,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,24,2,0,0,0,0,0,0,16,4,0,0,0,0,0,0,0,0,0,0,1,120,0,0,0,8,0,0,0,6,0,0,0,5,0,0,0,4,0,0,0,3,0,0,128,2,0,0,0,2,0,0,128,1,0,0,64,1,0,0,0,1,0,0,192,0,0,0,160,0,0,0,128,0,0,0,96,0,0,0,80,0,0,0,64,0,0,0,48,0,0,0,40,0,0,0,
32,0,0,0,24,0,0,0,20,0,0,0,16,0,0,0,12,0,0,0,10,0,0,0,8,0,0,0,6,0,0,0,5,0,0,0,4,0,0,0,3,0,0,0,2,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,3,0,3,0,3,0,3,0,3,0,4,0,4,0,4,0,4,0,4,0,5,0,5,0,5,0,5,0,6,0,6,0,6,0,6,0,7,0,7,0,7,0,8,0,8,0,8,0,9,0,9,0,9,0,10,0,10,0,10,0,11,0,11,0,11,0,12,0,12,0,13,0,13,0,14,0,14,0,15,0,15,0,15,0,16,0,16,0,17,0,17,0,18,0,19,0,19,0,20,0,20,0,21,0,21,0,22,0,23,0,23,0,24,
0,24,0,25,0,26,0,27,0,27,0,28,0,29,0,29,0,30,0,31,0,32,0,32,0,33,0,34,0,35,0,36,0,36,0,37,0,38,0,39,0,40,0,41,0,42,0,43,0,44,0,45,0,46,0,47,0,48,0,49,0,50,0,51,0,52,0,53,0,54,0,55,0,56,0,58,0,59,0,60,0,61,0,62,0,64,0,65,0,66,0,67,0,69,0,70,0,71,0,73,0,74,0,76,0,77,0,78,0,80,0,81,0,83,0,84,0,86,0,87,0,89,0,90,0,92,0,94,0,95,0,97,0,99,0,100,0,102,0,104,0,106,0,107,0,109,0,111,0,113,0,115,0,117,0,118,0,120,0,122,0,124,0,126,0,128,0,130,0,132,0,134,0,137,0,139,0,141,0,143,0,145,0,147,0,150,0,152,0,154,
0,156,0,159,0,161,0,163,0,166,0,168,0,171,0,173,0,175,0,178,0,180,0,183,0,186,0,188,0,191,0,193,0,196,0,199,0,201,0,204,0,207,0,210,0,212,0,215,0,218,0,221,0,224,0,227,0,230,0,233,0,236,0,239,0,242,0,245,0,248,0,251,0,254,0,1,1,4,1,7,1,11,1,14,1,17,1,20,1,24,1,27,1,30,1,34,1,37,1,41,1,44,1,48,1,51,1,55,1,58,1,62,1,65,1,69,1,72,1,76,1,80,1,83,1,87,1,91,1,95,1,98,1,102,1,106,1,110,1,114,1,118,1,122,1,125,1,129,1,133,1,137,1,141,1,145,1,149,1,154,1,158,1,162,1,166,1,170,1,174,1,178,1,183,1,187,1,191,
1,195,1,200,1,204,1,208,1,213,1,217,1,221,1,226,1,230,1,235,1,239,1,243,1,248,1,252,1,1,2,5,2,10,2,15,2,19,2,24,2,28,2,33,2,38,2,42,2,47,2,51,2,56,2,61,2,65,2,70,2,75,2,80,2,84,2,89,2,94,2,99,2,103,2,108,2,113,2,118,2,123,2,128,2,132,2,137,2,142,2,147,2,152,2,157,2,162,2,166,2,171,2,176,2,181,2,186,2,191,2,196,2,201,2,206,2,211,2,216,2,220,2,225,2,230,2,235,2,240,2,245,2,250,2,255,2,4,3,9,3,14,3,19,3,24,3,29,3,34,3,38,3,43,3,48,3,53,3,58,3,63,3,68,3,73,3,78,3,83,3,87,3,92,3,97,3,102,3,107,3,112,3,
116,3,121,3,126,3,131,3,136,3,140,3,145,3,150,3,155,3,159,3,164,3,169,3,173,3,178,3,183,3,187,3,192,3,197,3,201,3,206,3,210,3,215,3,220,3,224,3,229,3,233,3,237,3,242,3,246,3,251,3,255,3,3,4,8,4,12,4,16,4,21,4,25,4,29,4,33,4,37,4,42,4,46,4,50,4,54,4,58,4,62,4,66,4,70,4,74,4,78,4,82,4,85,4,89,4,93,4,97,4,101,4,104,4,108,4,112,4,115,4,119,4,122,4,126,4,129,4,133,4,136,4,140,4,143,4,146,4,150,4,153,4,156,4,159,4,162,4,166,4,169,4,172,4,175,4,178,4,181,4,183,4,186,4,189,4,192,4,195,4,197,4,200,4,203,4,
205,4,208,4,210,4,213,4,215,4,217,4,220,4,222,4,224,4,227,4,229,4,231,4,233,4,235,4,237,4,239,4,241,4,243,4,245,4,246,4,248,4,250,4,251,4,253,4,255,4,0,5,2,5,3,5,4,5,6,5,7,5,8,5,10,5,11,5,12,5,13,5,14,5,15,5,16,5,17,5,17,5,18,5,19,5,20,5,20,5,21,5,22,5,22,5,23,5,23,5,23,5,24,5,24,5,24,5,24,5,24,5,25,5,25,5,40,99,111,117,110,116,32,38,32,49,41,32,61,61,32,48,0,0,0,0,0,0,0,0,105,110,99,108,117,100,101,47,115,110,101,115,95,115,112,99,47,83,80,67,95,70,105,108,116,101,114,46,99,112,112,0,114,117,110,
0,0,0,0,0,69,114,114,111,114,58,32,37,115,10,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],"i8",za,z.Nb);var Za=z.S(O(12,"i8",ya),8);B(0==Za%8);var $a=0;function ab(a){return N[$a>>2]=a}
var T={aa:1,ga:2,Zd:3,Xc:4,O:5,bb:6,uc:7,ud:8,fa:9,Hc:10,$:11,ie:11,Kb:12,Db:13,Sc:14,Gd:15,Ya:16,Za:17,je:18,$a:19,Lb:20,ya:21,u:22,pd:23,Jb:24,Kd:25,fe:26,Tc:27,Cd:28,Ba:29,Wd:30,hd:31,Pd:32,Pc:33,Td:34,yd:42,Vc:43,Ic:44,Zc:45,$c:46,ad:47,gd:48,ge:49,sd:50,Yc:51,Nc:35,vd:37,zc:52,Cc:53,ke:54,qd:55,Dc:56,Ec:57,Oc:35,Fc:59,Ed:60,td:61,ce:62,Dd:63,zd:64,Ad:65,Vd:66,wd:67,xc:68,$d:69,Jc:70,Qd:71,kd:72,Qc:73,Bc:74,Ld:76,Ac:77,Ud:78,bd:79,cd:80,fd:81,ed:82,dd:83,Fd:38,ab:39,ld:36,za:40,Aa:95,Od:96,Mc:104,
rd:105,yc:97,Sd:91,Id:88,Bd:92,Xd:108,Lc:111,vc:98,Kc:103,od:101,md:100,de:110,Uc:112,Gb:113,Hb:115,Eb:114,Fb:89,jd:90,Rd:93,Yd:94,wc:99,nd:102,Ib:106,ha:107,ee:109,he:87,Rc:122,ae:116,Jd:95,xd:123,Wc:84,Md:75,Gc:125,Hd:131,Nd:130,be:86};r._memset=bb;
var cb={"0":"Success",1:"Not super-user",2:"No such file or directory",3:"No such process",4:"Interrupted system call",5:"I/O error",6:"No such device or address",7:"Arg list too long",8:"Exec format error",9:"Bad file number",10:"No children",11:"No more processes",12:"Not enough core",13:"Permission denied",14:"Bad address",15:"Block device required",16:"Mount device busy",17:"File exists",18:"Cross-device link",19:"No such device",20:"Not a directory",21:"Is a directory",22:"Invalid argument",
23:"Too many open files in system",24:"Too many open files",25:"Not a typewriter",26:"Text file busy",27:"File too large",28:"No space left on device",29:"Illegal seek",30:"Read only file system",31:"Too many links",32:"Broken pipe",33:"Math arg out of domain of func",34:"Math result not representable",35:"File locking deadlock error",36:"File or path name too long",37:"No record locks available",38:"Function not implemented",39:"Directory not empty",40:"Too many symbolic links",42:"No message of desired type",
43:"Identifier removed",44:"Channel number out of range",45:"Level 2 not synchronized",46:"Level 3 halted",47:"Level 3 reset",48:"Link number out of range",49:"Protocol driver not attached",50:"No CSI structure available",51:"Level 2 halted",52:"Invalid exchange",53:"Invalid request descriptor",54:"Exchange full",55:"No anode",56:"Invalid request code",57:"Invalid slot",59:"Bad font file fmt",60:"Device not a stream",61:"No data (for no delay io)",62:"Timer expired",63:"Out of streams resources",
64:"Machine is not on the network",65:"Package not installed",66:"The object is remote",67:"The link has been severed",68:"Advertise error",69:"Srmount error",70:"Communication error on send",71:"Protocol error",72:"Multihop attempted",73:"Cross mount point (not really error)",74:"Trying to read unreadable message",75:"Value too large for defined data type",76:"Given log. name not unique",77:"f.d. invalid for this operation",78:"Remote address changed",79:"Can   access a needed shared lib",80:"Accessing a corrupted shared lib",
81:".lib section in a.out corrupted",82:"Attempting to link in too many libs",83:"Attempting to exec a shared library",84:"Illegal byte sequence",86:"Streams pipe error",87:"Too many users",88:"Socket operation on non-socket",89:"Destination address required",90:"Message too long",91:"Protocol wrong type for socket",92:"Protocol not available",93:"Unknown protocol",94:"Socket type not supported",95:"Not supported",96:"Protocol family not supported",97:"Address family not supported by protocol family",
98:"Address already in use",99:"Address not available",100:"Network interface is not configured",101:"Network is unreachable",102:"Connection reset by network",103:"Connection aborted",104:"Connection reset by peer",105:"No buffer space available",106:"Socket is already connected",107:"Socket is not connected",108:"Can't send after socket shutdown",109:"Too many references",110:"Connection timed out",111:"Connection refused",112:"Host is down",113:"Host is unreachable",114:"Socket already connected",
115:"Connection already in progress",116:"Stale file handle",122:"Quota exceeded",123:"No medium (in tape drive)",125:"Operation canceled",130:"Previous owner died",131:"State not recoverable"};function db(a,b){for(var c=0,d=a.length-1;0<=d;d--){var e=a[d];"."===e?a.splice(d,1):".."===e?(a.splice(d,1),c++):c&&(a.splice(d,1),c--)}if(b)for(;c--;c)a.unshift("..");return a}
function U(a){var b="/"===a.charAt(0),c="/"===a.substr(-1),a=db(a.split("/").filter(function(a){return!!a}),!b).join("/");!a&&!b&&(a=".");a&&c&&(a+="/");return(b?"/":"")+a}function eb(a){if("/"===a)return"/";var b=a.lastIndexOf("/");return-1===b?a:a.substr(b+1)}
function fb(){for(var a="",b=n,c=arguments.length-1;-1<=c&&!b;c--){var d=0<=c?arguments[c]:"/";"string"!==typeof d&&f(new TypeError("Arguments to path.resolve must be strings"));d&&(a=d+"/"+a,b="/"===d.charAt(0))}a=db(a.split("/").filter(function(a){return!!a}),!b).join("/");return(b?"/":"")+a||"."}var gb=[];function hb(a,b){gb[a]={input:[],R:[],ba:b};ib[a]={k:jb}}
var jb={open:function(a){var b=gb[a.e.ta];b||f(new V(T.$a));a.C=b;a.seekable=n},close:function(a){a.C.R.length&&a.C.ba.sa(a.C,10)},N:function(a,b,c,d){(!a.C||!a.C.ba.qb)&&f(new V(T.bb));for(var e=0,g=0;g<d;g++){var h;try{h=a.C.ba.qb(a.C)}catch(j){f(new V(T.O))}h===i&&0===e&&f(new V(T.$));if(h===m||h===i)break;e++;b[c+g]=h}e&&(a.e.timestamp=Date.now());return e},write:function(a,b,c,d){(!a.C||!a.C.ba.sa)&&f(new V(T.bb));for(var e=0;e<d;e++)try{a.C.ba.sa(a.C,b[c+e])}catch(g){f(new V(T.O))}d&&(a.e.timestamp=
Date.now());return e}},W={F:m,Cb:1,wa:2,Xa:3,M:function(){return W.createNode(m,"/",16895,0)},createNode:function(a,b,c,d){(24576===(c&61440)||4096===(c&61440))&&f(new V(T.aa));W.F||(W.F={dir:{e:{L:W.n.L,A:W.n.A,Na:W.n.Na,pa:W.n.pa,rename:W.n.rename,Bb:W.n.Bb,zb:W.n.zb,xb:W.n.xb,va:W.n.va},G:{Q:W.k.Q}},file:{e:{L:W.n.L,A:W.n.A},G:{Q:W.k.Q,N:W.k.N,write:W.k.write,eb:W.k.eb,tb:W.k.tb}},link:{e:{L:W.n.L,A:W.n.A,ua:W.n.ua},G:{}},hb:{e:{L:W.n.L,A:W.n.A},G:kb}});c=lb(a,b,c,d);16384===(c.mode&61440)?(c.n=
W.F.dir.e,c.k=W.F.dir.G,c.o={}):32768===(c.mode&61440)?(c.n=W.F.file.e,c.k=W.F.file.G,c.o=[],c.ja=W.wa):40960===(c.mode&61440)?(c.n=W.F.link.e,c.k=W.F.link.G):8192===(c.mode&61440)&&(c.n=W.F.hb.e,c.k=W.F.hb.G);c.timestamp=Date.now();a&&(a.o[b]=c);return c},Ga:function(a){a.ja!==W.wa&&(a.o=Array.prototype.slice.call(a.o),a.ja=W.wa)},n:{L:function(a){var b={};b.Be=8192===(a.mode&61440)?a.id:1;b.Le=a.id;b.mode=a.mode;b.Re=1;b.uid=0;b.Je=0;b.ta=a.ta;b.size=16384===(a.mode&61440)?4096:32768===(a.mode&
61440)?a.o.length:40960===(a.mode&61440)?a.link.length:0;b.we=new Date(a.timestamp);b.Pe=new Date(a.timestamp);b.Ae=new Date(a.timestamp);b.Sb=4096;b.xe=Math.ceil(b.size/b.Sb);return b},A:function(a,b){b.mode!==i&&(a.mode=b.mode);b.timestamp!==i&&(a.timestamp=b.timestamp);if(b.size!==i){W.Ga(a);var c=a.o;if(b.size<c.length)c.length=b.size;else for(;b.size>c.length;)c.push(0)}},Na:function(){f(mb[T.ga])},pa:function(a,b,c,d){return W.createNode(a,b,c,d)},rename:function(a,b,c){if(16384===(a.mode&61440)){var d;
try{d=nb(b,c)}catch(e){}if(d)for(var g in d.o)f(new V(T.ab))}delete a.parent.o[a.name];a.name=c;b.o[c]=a;a.parent=b},Bb:function(a,b){delete a.o[b]},zb:function(a,b){var c=nb(a,b),d;for(d in c.o)f(new V(T.ab));delete a.o[b]},xb:function(a){var b=[".",".."],c;for(c in a.o)a.o.hasOwnProperty(c)&&b.push(c);return b},va:function(a,b,c){a=W.createNode(a,b,41471,0);a.link=c;return a},ua:function(a){40960!==(a.mode&61440)&&f(new V(T.u));return a.link}},k:{N:function(a,b,c,d,e){a=a.e.o;if(e>=a.length)return 0;
d=Math.min(a.length-e,d);B(0<=d);if(8<d&&a.subarray)b.set(a.subarray(e,e+d),c);else for(var g=0;g<d;g++)b[c+g]=a[e+g];return d},write:function(a,b,c,d,e,g){var h=a.e;h.timestamp=Date.now();a=h.o;if(d&&0===a.length&&0===e&&b.subarray)return g&&0===c?(h.o=b,h.ja=b.buffer===L.buffer?W.Cb:W.Xa):(h.o=new Uint8Array(b.subarray(c,c+d)),h.ja=W.Xa),d;W.Ga(h);for(a=h.o;a.length<e;)a.push(0);for(g=0;g<d;g++)a[e+g]=b[c+g];return d},Q:function(a,b,c){1===c?b+=a.position:2===c&&32768===(a.e.mode&61440)&&(b+=a.e.o.length);
0>b&&f(new V(T.u));a.sc=[];return a.position=b},eb:function(a,b,c){W.Ga(a.e);a=a.e.o;for(b+=c;b>a.length;)a.push(0)},tb:function(a,b,c,d,e,g,h){32768!==(a.e.mode&61440)&&f(new V(T.$a));a=a.e.o;if(!(h&2)&&(a.buffer===b||a.buffer===b.buffer))e=n,d=a.byteOffset;else{if(0<e||e+d<a.length)a=a.subarray?a.subarray(e,e+d):Array.prototype.slice.call(a,e,e+d);e=l;(d=Aa(d))||f(new V(T.Kb));b.set(a,d)}return{We:d,ue:e}}}},ob=O(1,"i32*",ya),qb=O(1,"i32*",ya),rb=O(1,"i32*",ya),sb=m,ib=[m],X=[],tb=1,ub=m,vb=l,V=
m,mb={};function wb(a){a instanceof V||f(a+" : "+Ca());ab(a.jb)}
function Y(a,b){var a=fb("/",a),b=b||{},c={nb:l,Qa:0},d;for(d in c)b[d]===i&&(b[d]=c[d]);8<b.Qa&&f(new V(T.za));var c=db(a.split("/").filter(function(a){return!!a}),n),e=sb,g="/";for(d=0;d<c.length;d++){var h=d===c.length-1;if(h&&b.parent)break;e=nb(e,c[d]);g=U(g+"/"+c[d]);if(e.qa&&(!h||h&&b.nb))e=e.qa.root;if(!h||b.Ia)for(h=0;40960===(e.mode&61440);){e=Y(g).e;e.n.ua||f(new V(T.u));var e=e.n.ua(e),j=fb;var k=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(g).slice(1),g=k[0],k=
k[1];!g&&!k?g=".":(k&&(k=k.substr(0,k.length-1)),g+=k);g=j(g,e);e=Y(g,{Qa:b.Qa}).e;40<h++&&f(new V(T.za))}}return{path:g,e:e}}function xb(a){for(var b;;){if(a===a.parent)return a=a.M.kc,!b?a:"/"!==a[a.length-1]?a+"/"+b:a+b;b=b?a.name+"/"+b:a.name;a=a.parent}}function yb(a,b){for(var c=0,d=0;d<b.length;d++)c=(c<<5)-c+b.charCodeAt(d)|0;return(a+c>>>0)%ub.length}
function nb(a,b){var c=zb(a,"x");c&&f(new V(c));for(c=ub[yb(a.id,b)];c;c=c.mc){var d=c.name;if(c.parent.id===a.id&&d===b)return c}return a.n.Na(a,b)}
function lb(a,b,c,d){Ab||(Ab=function(a,b,c,d){a||(a=this);this.parent=a;this.M=a.M;this.qa=m;this.id=tb++;this.name=b;this.mode=c;this.n={};this.k={};this.ta=d},Ab.prototype={},Object.defineProperties(Ab.prototype,{N:{get:function(){return 365===(this.mode&365)},set:function(a){a?this.mode|=365:this.mode&=-366}},write:{get:function(){return 146===(this.mode&146)},set:function(a){a?this.mode|=146:this.mode&=-147}},ec:{get:function(){return 16384===(this.mode&61440)}},dc:{get:function(){return 8192===
(this.mode&61440)}}}));a=new Ab(a,b,c,d);b=yb(a.parent.id,a.name);a.mc=ub[b];return ub[b]=a}var Bb={r:0,rs:1052672,"r+":2,w:577,wx:705,xw:705,"w+":578,"wx+":706,"xw+":706,a:1089,ax:1217,xa:1217,"a+":1090,"ax+":1218,"xa+":1218};function Cb(a){var b=Bb[a];"undefined"===typeof b&&f(Error("Unknown file open mode: "+a));return b}function zb(a,b){return vb?0:-1!==b.indexOf("r")&&!(a.mode&292)||-1!==b.indexOf("w")&&!(a.mode&146)||-1!==b.indexOf("x")&&!(a.mode&73)?T.Db:0}
function Db(a,b){try{return nb(a,b),T.Za}catch(c){}return zb(a,"wx")}
function Eb(a,b,c){Fb||(Fb=q(),Fb.prototype={},Object.defineProperties(Fb.prototype,{object:{get:function(){return this.e},set:function(a){this.e=a}},Ne:{get:function(){return 1!==(this.K&2097155)}},Oe:{get:function(){return 0!==(this.K&2097155)}},Me:{get:function(){return this.K&1024}}}));if(a.__proto__)a.__proto__=Fb.prototype;else{var d=new Fb,e;for(e in a)d[e]=a[e];a=d}var g;a:{b=b||0;for(c=c||4096;b<=c;b++)if(!X[b]){g=b;break a}f(new V(T.Jb))}a.B=g;return X[g]=a}
var kb={open:function(a){a.k=ib[a.e.ta].k;a.k.open&&a.k.open(a)},Q:function(){f(new V(T.Ba))}};function Gb(a,b){var c="/"===b,d=!b,e;c&&sb&&f(new V(T.Ya));!c&&!d&&(e=Y(b,{nb:n}),b=e.path,e=e.e,e.qa&&f(new V(T.Ya)),16384!==(e.mode&61440)&&f(new V(T.Lb)));var d={type:a,Te:{},kc:b,lc:[]},g=a.M(d);g.M=d;d.root=g;c?sb=g:e&&(e.qa=d,e.M&&e.M.lc.push(d));return g}function Hb(a,b,c){var d=Y(a,{parent:l}).e,a=eb(a),e=Db(d,a);e&&f(new V(e));d.n.pa||f(new V(T.aa));return d.n.pa(d,a,b,c)}
function Ib(a,b){b=(b!==i?b:438)&4095;b|=32768;return Hb(a,b,0)}function Jb(a,b){b=(b!==i?b:511)&1023;b|=16384;return Hb(a,b,0)}function Kb(a,b,c){"undefined"===typeof c&&(c=b,b=438);return Hb(a,b|8192,c)}function Lb(a,b){var c=Y(b,{parent:l}).e,d=eb(b),e=Db(c,d);e&&f(new V(e));c.n.va||f(new V(T.aa));return c.n.va(c,d,a)}function Mb(a,b){var c;c="string"===typeof a?Y(a,{Ia:l}).e:a;c.n.A||f(new V(T.aa));c.n.A(c,{mode:b&4095|c.mode&-4096,timestamp:Date.now()})}
function Nb(a,b){var c,b="string"===typeof b?Cb(b):b;c=b&64?("undefined"===typeof c?438:c)&4095|32768:0;var d;if("object"===typeof a)d=a;else{a=U(a);try{d=Y(a,{Ia:!(b&131072)}).e}catch(e){}}b&64&&(d?b&128&&f(new V(T.Za)):d=Hb(a,c,0));d||f(new V(T.ga));8192===(d.mode&61440)&&(b&=-513);d?40960===(d.mode&61440)?c=T.za:16384===(d.mode&61440)&&(0!==(b&2097155)||b&512)?c=T.ya:(c=["r","w","rw"][b&2097155],b&512&&(c+="w"),c=zb(d,c)):c=T.ga;c&&f(new V(c));if(b&512){c=d;c="string"===typeof c?Y(c,{Ia:l}).e:
c;c.n.A||f(new V(T.aa));16384===(c.mode&61440)&&f(new V(T.ya));32768!==(c.mode&61440)&&f(new V(T.u));var g=zb(c,"w");g&&f(new V(g));c.n.A(c,{size:0,timestamp:Date.now()})}b&=-641;d=Eb({e:d,path:xb(d),K:b,seekable:l,position:0,k:d.k,sc:[],error:n},i,i);d.k.open&&d.k.open(d);r.logReadFiles&&!(b&1)&&(Ob||(Ob={}),a in Ob||(Ob[a]=1,r.printErr("read file: "+a)));return d}function Pb(a){try{a.k.close&&a.k.close(a)}catch(b){f(b)}finally{X[a.B]=m}}
function Qb(a,b,c,d,e,g){(0>d||0>e)&&f(new V(T.u));0===(a.K&2097155)&&f(new V(T.fa));16384===(a.e.mode&61440)&&f(new V(T.ya));a.k.write||f(new V(T.u));var h=l;"undefined"===typeof e?(e=a.position,h=n):a.seekable||f(new V(T.Ba));a.K&1024&&((!a.seekable||!a.k.Q)&&f(new V(T.Ba)),a.k.Q(a,0,2));b=a.k.write(a,b,c,d,e,g);h||(a.position+=b);return b}
function Rb(){V||(V=function(a){this.jb=a;for(var b in T)if(T[b]===a){this.code=b;break}this.message=cb[a]},V.prototype=Error(),[T.ga].forEach(function(a){mb[a]=new V(a);mb[a].stack="<generic error, no stack>"}))}var Sb;function Tb(a,b){var c=0;a&&(c|=365);b&&(c|=146);return c}
function Ub(a,b,c,d,e,g){a=b?U(("string"===typeof a?a:xb(a))+"/"+b):a;d=Tb(d,e);e=Ib(a,d);if(c){if("string"===typeof c){for(var a=Array(c.length),b=0,h=c.length;b<h;++b)a[b]=c.charCodeAt(b);c=a}Mb(e,d|146);a=Nb(e,"w");Qb(a,c,0,c.length,0,g);Pb(a);Mb(e,d)}return e}
function Vb(a,b,c,d){a=U(("string"===typeof a?a:xb(a))+"/"+b);b=Tb(!!c,!!d);Vb.sb||(Vb.sb=64);var e;e=Vb.sb++<<8|0;ib[e]={k:{open:function(a){a.seekable=n},close:function(){d&&(d.buffer&&d.buffer.length)&&d(10)},N:function(a,b,d,e){for(var w=0,E=0;E<e;E++){var v;try{v=c()}catch(t){f(new V(T.O))}v===i&&0===w&&f(new V(T.$));if(v===m||v===i)break;w++;b[d+E]=v}w&&(a.e.timestamp=Date.now());return w},write:function(a,b,c,e){for(var w=0;w<e;w++)try{d(b[c+w])}catch(E){f(new V(T.O))}e&&(a.e.timestamp=Date.now());
return w}}};return Kb(a,b,e)}function Wb(a){if(a.dc||a.ec||a.link||a.o)return l;var b=l;"undefined"!==typeof XMLHttpRequest&&f(Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."));if(r.read)try{a.o=K(r.read(a.url),l)}catch(c){b=n}else f(Error("Cannot load without read() or XMLHttpRequest."));b||ab(T.O);return b}var Ab,Fb,Ob;function Xb(){f("TODO")}
var Z={M:function(){return lb(m,"/",16895,0)},Wb:function(a,b,c){c&&B(1==b==(6==c));a={Yb:a,type:b,protocol:c,p:m,ca:{},Oa:[],W:[],Y:Z.q};b=Z.ra();c=lb(Z.root,b,49152,0);c.X=a;b=Eb({path:b,e:c,K:Cb("r+"),seekable:n,k:Z.k});a.G=b;return a},$b:function(a){a=X[a];return!a||49152!==(a.e.mode&49152)?m:a.e.X},k:{wb:function(a){a=a.e.X;return a.Y.wb(a)},rb:function(a,b,c){a=a.e.X;return a.Y.rb(a,b,c)},N:function(a,b,c,d){a=a.e.X;d=a.Y.oc(a,d);if(!d)return 0;b.set(d.buffer,c);return d.buffer.length},write:function(a,
b,c,d){a=a.e.X;return a.Y.qc(a,b,c,d)},close:function(a){a=a.e.X;a.Y.close(a)}},ra:function(){Z.ra.ib||(Z.ra.ib=0);return"socket["+Z.ra.ib++ +"]"},q:{ka:function(a,b,c){var d;"object"===typeof b&&(d=b,c=b=m);if(d)d._socket?(b=d._socket.remoteAddress,c=d._socket.remotePort):((c=/ws[s]?:\/\/([^:]+):(\d+)/.exec(d.url))||f(Error("WebSocket URL must be in the format ws(s)://address:port")),b=c[1],c=parseInt(c[2],10));else try{var e=u?{headers:{"websocket-protocol":["binary"]}}:["binary"];d=new (u?require("ws"):
window.WebSocket)("ws://"+b+":"+c,e);d.binaryType="arraybuffer"}catch(g){f(new V(T.Gb))}b={H:b,port:c,g:d,la:[]};Z.q.cb(a,b);Z.q.bc(a,b);2===a.type&&"undefined"!==typeof a.Z&&b.la.push(new Uint8Array([255,255,255,255,112,111,114,116,(a.Z&65280)>>8,a.Z&255]));return b},oa:function(a,b,c){return a.ca[b+":"+c]},cb:function(a,b){a.ca[b.H+":"+b.port]=b},yb:function(a,b){delete a.ca[b.H+":"+b.port]},bc:function(a,b){function c(){try{for(var a=b.la.shift();a;)b.g.send(a),a=b.la.shift()}catch(c){b.g.close()}}
function d(c){B("string"!==typeof c&&c.byteLength!==i);var c=new Uint8Array(c),d=e;e=n;d&&10===c.length&&255===c[0]&&255===c[1]&&255===c[2]&&255===c[3]&&112===c[4]&&111===c[5]&&114===c[6]&&116===c[7]?(c=c[8]<<8|c[9],Z.q.yb(a,b),b.port=c,Z.q.cb(a,b)):a.W.push({H:b.H,port:b.port,data:c})}var e=l;u?(b.g.on("open",c),b.g.on("message",function(a,b){b.binary&&d((new Uint8Array(a)).buffer)}),b.g.on("error",q())):(b.g.onopen=c,b.g.onmessage=function(a){d(a.data)})},wb:function(a){if(1===a.type&&a.p)return a.Oa.length?
65:0;var b=0,c=1===a.type?Z.q.oa(a,a.I,a.J):m;if(a.W.length||!c||c&&c.g.readyState===c.g.ea||c&&c.g.readyState===c.g.CLOSED)b|=65;if(!c||c&&c.g.readyState===c.g.OPEN)b|=4;if(c&&c.g.readyState===c.g.ea||c&&c.g.readyState===c.g.CLOSED)b|=16;return b},rb:function(a,b,c){switch(b){case 21531:return b=0,a.W.length&&(b=a.W[0].data.length),N[c>>2]=b,0;default:return T.u}},close:function(a){if(a.p){try{a.p.close()}catch(b){}a.p=m}for(var c=Object.keys(a.ca),d=0;d<c.length;d++){var e=a.ca[c[d]];try{e.g.close()}catch(g){}Z.q.yb(a,
e)}return 0},bind:function(a,b,c){("undefined"!==typeof a.Sa||"undefined"!==typeof a.Z)&&f(new V(T.u));a.Sa=b;a.Z=c||Xb();if(2===a.type){a.p&&(a.p.close(),a.p=m);try{a.Y.ic(a,0)}catch(d){d instanceof V||f(d),d.jb!==T.Aa&&f(d)}}},ze:function(a,b,c){a.p&&f(new V(ERRNO_CODS.Aa));if("undefined"!==typeof a.I&&"undefined"!==typeof a.J){var d=Z.q.oa(a,a.I,a.J);d&&(d.g.readyState===d.g.CONNECTING&&f(new V(T.Eb)),f(new V(T.Ib)))}b=Z.q.ka(a,b,c);a.I=b.H;a.J=b.port;f(new V(T.Hb))},ic:function(a){u||f(new V(T.Aa));
a.p&&f(new V(T.u));var b=require("ws").Server;a.p=new b({host:a.Sa,port:a.Z});a.p.on("connection",function(b){if(1===a.type){var d=Z.Wb(a.Yb,a.type,a.protocol),b=Z.q.ka(d,b);d.I=b.H;d.J=b.port;a.Oa.push(d)}else Z.q.ka(a,b)});a.p.on("closed",function(){a.p=m});a.p.on("error",q())},accept:function(a){a.p||f(new V(T.u));var b=a.Oa.shift();b.G.K=a.G.K;return b},Ie:function(a,b){var c,d;b?((a.I===i||a.J===i)&&f(new V(T.ha)),c=a.I,d=a.J):(c=a.Sa||0,d=a.Z||0);return{H:c,port:d}},qc:function(a,b,c,d,e,g){if(2===
a.type){if(e===i||g===i)e=a.I,g=a.J;(e===i||g===i)&&f(new V(T.Fb))}else e=a.I,g=a.J;var h=Z.q.oa(a,e,g);1===a.type&&((!h||h.g.readyState===h.g.ea||h.g.readyState===h.g.CLOSED)&&f(new V(T.ha)),h.g.readyState===h.g.CONNECTING&&f(new V(T.$)));b=b instanceof Array||b instanceof ArrayBuffer?b.slice(c,c+d):b.buffer.slice(b.byteOffset+c,b.byteOffset+c+d);if(2===a.type&&(!h||h.g.readyState!==h.g.OPEN)){if(!h||h.g.readyState===h.g.ea||h.g.readyState===h.g.CLOSED)h=Z.q.ka(a,e,g);h.la.push(b);return d}try{return h.g.send(b),
d}catch(j){f(new V(T.u))}},oc:function(a,b){1===a.type&&a.p&&f(new V(T.ha));var c=a.W.shift();if(!c){if(1===a.type){var d=Z.q.oa(a,a.I,a.J);if(d){if(d.g.readyState===d.g.ea||d.g.readyState===d.g.CLOSED)return m;f(new V(T.$))}f(new V(T.ha))}f(new V(T.$))}var d=c.data.byteLength||c.data.length,e=c.data.byteOffset||0,g=c.data.buffer||c.data,h=Math.min(b,d),j={buffer:new Uint8Array(g,e,h),H:c.H,port:c.port};1===a.type&&h<d&&(c.data=new Uint8Array(g,e+h,d-h),a.W.unshift(c));return j}}};
function Yb(a,b,c){a=X[a];if(!a)return ab(T.fa),-1;try{return Qb(a,L,b,c)}catch(d){return wb(d),-1}}function Zb(a){a=X[a-1];return!a?-1:a.B}function $b(a,b,c,d){c*=b;if(0==c)return 0;a=Yb(Zb(d),a,c);if(-1==a){if(b=X[d-1])b.error=l;return 0}return Math.floor(a/b)}r._strlen=ac;function bc(a){return 0>a||0===a&&-Infinity===1/a}
function cc(a,b){function c(a){var c;"double"===a?c=(N[Za>>2]=N[b+e>>2],N[Za+4>>2]=N[b+(e+4)>>2],+wa[Za>>3]):"i64"==a?c=[N[b+e>>2],N[b+(e+4)>>2]]:(a="i32",c=N[b+e>>2]);e+=z.ob(a);return c}for(var d=a,e=0,g=[],h,j;;){var k=d;h=L[d];if(0===h)break;j=L[d+1|0];if(37==h){var w=n,E=n,v=n,t=n,C=n;a:for(;;){switch(j){case 43:w=l;break;case 45:E=l;break;case 35:v=l;break;case 48:if(t)break a;else{t=l;break}case 32:C=l;break;default:break a}d++;j=L[d+1|0]}var G=0;if(42==j)G=c("i32"),d++,j=L[d+1|0];else for(;48<=
j&&57>=j;)G=10*G+(j-48),d++,j=L[d+1|0];var I=n,A=-1;if(46==j){A=0;I=l;d++;j=L[d+1|0];if(42==j)A=c("i32"),d++;else for(;;){j=L[d+1|0];if(48>j||57<j)break;A=10*A+(j-48);d++}j=L[d+1|0]}0>A&&(A=6,I=n);var y;switch(String.fromCharCode(j)){case "h":j=L[d+2|0];104==j?(d++,y=1):y=2;break;case "l":j=L[d+2|0];108==j?(d++,y=8):y=4;break;case "L":case "q":case "j":y=8;break;case "z":case "t":case "I":y=4;break;default:y=m}y&&d++;j=L[d+1|0];switch(String.fromCharCode(j)){case "d":case "i":case "u":case "o":case "x":case "X":case "p":k=
100==j||105==j;y=y||4;var M=h=c("i"+8*y),p;8==y&&(h=z.jc(h[0],h[1],117==j));4>=y&&(h=(k?Ua:Ta)(h&Math.pow(256,y)-1,8*y));var sa=Math.abs(h),k="";if(100==j||105==j)p=8==y&&dc?dc.stringify(M[0],M[1],m):Ua(h,8*y).toString(10);else if(117==j)p=8==y&&dc?dc.stringify(M[0],M[1],l):Ta(h,8*y).toString(10),h=Math.abs(h);else if(111==j)p=(v?"0":"")+sa.toString(8);else if(120==j||88==j){k=v&&0!=h?"0x":"";if(8==y&&dc)if(M[1]){p=(M[1]>>>0).toString(16);for(v=(M[0]>>>0).toString(16);8>v.length;)v="0"+v;p+=v}else p=
(M[0]>>>0).toString(16);else if(0>h){h=-h;p=(sa-1).toString(16);M=[];for(v=0;v<p.length;v++)M.push((15-parseInt(p[v],16)).toString(16));for(p=M.join("");p.length<2*y;)p="f"+p}else p=sa.toString(16);88==j&&(k=k.toUpperCase(),p=p.toUpperCase())}else 112==j&&(0===sa?p="(nil)":(k="0x",p=sa.toString(16)));if(I)for(;p.length<A;)p="0"+p;0<=h&&(w?k="+"+k:C&&(k=" "+k));"-"==p.charAt(0)&&(k="-"+k,p=p.substr(1));for(;k.length+p.length<G;)E?p+=" ":t?p="0"+p:k=" "+k;p=k+p;p.split("").forEach(function(a){g.push(a.charCodeAt(0))});
break;case "f":case "F":case "e":case "E":case "g":case "G":h=c("double");if(isNaN(h))p="nan",t=n;else if(isFinite(h)){I=n;y=Math.min(A,20);if(103==j||71==j)I=l,A=A||1,y=parseInt(h.toExponential(y).split("e")[1],10),A>y&&-4<=y?(j=(103==j?"f":"F").charCodeAt(0),A-=y+1):(j=(103==j?"e":"E").charCodeAt(0),A--),y=Math.min(A,20);if(101==j||69==j)p=h.toExponential(y),/[eE][-+]\d$/.test(p)&&(p=p.slice(0,-1)+"0"+p.slice(-1));else if(102==j||70==j)p=h.toFixed(y),0===h&&bc(h)&&(p="-"+p);k=p.split("e");if(I&&
!v)for(;1<k[0].length&&-1!=k[0].indexOf(".")&&("0"==k[0].slice(-1)||"."==k[0].slice(-1));)k[0]=k[0].slice(0,-1);else for(v&&-1==p.indexOf(".")&&(k[0]+=".");A>y++;)k[0]+="0";p=k[0]+(1<k.length?"e"+k[1]:"");69==j&&(p=p.toUpperCase());0<=h&&(w?p="+"+p:C&&(p=" "+p))}else p=(0>h?"-":"")+"inf",t=n;for(;p.length<G;)p=E?p+" ":t&&("-"==p[0]||"+"==p[0])?p[0]+"0"+p.slice(1):(t?"0":" ")+p;97>j&&(p=p.toUpperCase());p.split("").forEach(function(a){g.push(a.charCodeAt(0))});break;case "s":t=(w=c("i8*"))?ac(w):6;
I&&(t=Math.min(t,A));if(!E)for(;t<G--;)g.push(32);if(w)for(v=0;v<t;v++)g.push(P[w++|0]);else g=g.concat(K("(null)".substr(0,t),l));if(E)for(;t<G--;)g.push(32);break;case "c":for(E&&g.push(c("i8"));0<--G;)g.push(32);E||g.push(c("i8"));break;case "n":E=c("i32*");N[E>>2]=g.length;break;case "%":g.push(h);break;default:for(v=k;v<d+2;v++)g.push(L[v])}d+=2}else g.push(h),d+=1}return g}function ec(a,b,c){c=cc(b,c);b=z.Wa();a=$b(O(c,"i8",xa),1,c.length,a);z.Va(b);return a}r._memcpy=fc;
function gc(a){gc.Ub||(J=J+4095&-4096,gc.Ub=l,B(z.ma),gc.Rb=z.ma,z.ma=function(){F("cannot dynamically allocate, sbrk now has control")});var b=J;0!=a&&gc.Rb(a);return b}var hc=n,ic=n,jc=n,kc=n,lc=i,mc=i;function nc(a){return{jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",bmp:"image/bmp",ogg:"audio/ogg",wav:"audio/wav",mp3:"audio/mpeg"}[a.substr(a.lastIndexOf(".")+1)]}var oc=[];function pc(){var a=r.canvas;oc.forEach(function(b){b(a.width,a.height)})}
function qc(a,b,c){b&&c?(a.tc=b,a.cc=c):(b=a.tc,c=a.cc);var d=b,e=c;r.forcedAspectRatio&&0<r.forcedAspectRatio&&(d/e<r.forcedAspectRatio?d=Math.round(e*r.forcedAspectRatio):e=Math.round(d/r.forcedAspectRatio));if((document.webkitFullScreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.mozFullscreenElement||document.fullScreenElement||document.fullscreenElement||document.msFullScreenElement||document.msFullscreenElement||document.webkitCurrentFullScreenElement)===
a.parentNode&&"undefined"!=typeof screen)var g=Math.min(screen.width/d,screen.height/e),d=Math.round(d*g),e=Math.round(e*g);mc?(a.width!=d&&(a.width=d),a.height!=e&&(a.height=e),"undefined"!=typeof a.style&&(a.style.removeProperty("width"),a.style.removeProperty("height"))):(a.width!=b&&(a.width=b),a.height!=c&&(a.height=c),"undefined"!=typeof a.style&&(d!=b||e!=c?(a.style.setProperty("width",d+"px","important"),a.style.setProperty("height",e+"px","important")):(a.style.removeProperty("width"),a.style.removeProperty("height"))))}
var rc,sc,tc,uc,$a=z.Ab(4);N[$a>>2]=0;Rb();ub=Array(4096);Gb(W,"/");Jb("/tmp");Jb("/dev");ib[259]={k:{N:function(){return 0},write:function(){return 0}}};Kb("/dev/null",259);
hb(1280,{qb:function(a){if(!a.input.length){var b=m;if(u){if(b=process.stdin.read(),!b){if(process.stdin._readableState&&process.stdin._readableState.ended)return m;return}}else"undefined"!=typeof window&&"function"==typeof window.prompt?(b=window.prompt("Input: "),b!==m&&(b+="\n")):"function"==typeof readline&&(b=readline(),b!==m&&(b+="\n"));if(!b)return m;a.input=K(b,l)}return a.input.shift()},sa:function(a,b){b===m||10===b?(r.print(a.R.join("")),a.R=[]):a.R.push(vc.Pa(b))}});
hb(1536,{sa:function(a,b){b===m||10===b?(r.printErr(a.R.join("")),a.R=[]):a.R.push(vc.Pa(b))}});Kb("/dev/tty",1280);Kb("/dev/tty1",1536);Jb("/dev/shm");Jb("/dev/shm/tmp");
Ma.unshift({U:function(){if(!r.noFSInit&&!Sb){B(!Sb,"FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");Sb=l;Rb();r.stdin=r.stdin;r.stdout=r.stdout;r.stderr=r.stderr;r.stdin?Vb("/dev","stdin",r.stdin):Lb("/dev/tty","/dev/stdin");r.stdout?Vb("/dev","stdout",m,r.stdout):Lb("/dev/tty","/dev/stdout");r.stderr?Vb("/dev","stderr",m,r.stderr):Lb("/dev/tty1","/dev/stderr");var a=Nb("/dev/stdin",
"r");N[ob>>2]=a?a.B+1:0;B(0===a.B,"invalid handle for stdin ("+a.B+")");a=Nb("/dev/stdout","w");N[qb>>2]=a?a.B+1:0;B(1===a.B,"invalid handle for stdout ("+a.B+")");a=Nb("/dev/stderr","w");N[rb>>2]=a?a.B+1:0;B(2===a.B,"invalid handle for stderr ("+a.B+")")}}});Na.push({U:function(){vb=n}});Oa.push({U:function(){Sb=n;for(var a=0;a<X.length;a++){var b=X[a];b&&Pb(b)}}});r.FS_createFolder=function(a,b,c,d){a=U(("string"===typeof a?a:xb(a))+"/"+b);return Jb(a,Tb(c,d))};
r.FS_createPath=function(a,b){for(var a="string"===typeof a?a:xb(a),c=b.split("/").reverse();c.length;){var d=c.pop();if(d){var e=U(a+"/"+d);try{Jb(e)}catch(g){}a=e}}return e};r.FS_createDataFile=Ub;
r.FS_createPreloadedFile=function(a,b,c,d,e,g,h,j,k){function w(){jc=document.pointerLockElement===t||document.mozPointerLockElement===t||document.webkitPointerLockElement===t||document.msPointerLockElement===t}function E(c){function t(c){j||Ub(a,b,c,d,e,k);g&&g();Ya()}var p=n;r.preloadPlugins.forEach(function(a){!p&&a.canHandle(C)&&(a.handle(c,C,t,function(){h&&h();Ya()}),p=l)});p||t(c)}r.preloadPlugins||(r.preloadPlugins=[]);if(!rc&&!ca){rc=l;try{new Blob,sc=l}catch(v){sc=n,console.log("warning: no blob constructor, cannot create blobs with mimetypes")}tc=
"undefined"!=typeof MozBlobBuilder?MozBlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:!sc?console.log("warning: no BlobBuilder"):m;uc="undefined"!=typeof window?window.URL?window.URL:window.webkitURL:i;!r.vb&&"undefined"===typeof uc&&(console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."),r.vb=l);r.preloadPlugins.push({canHandle:function(a){return!r.vb&&/\.(jpg|jpeg|png|bmp)$/i.test(a)},handle:function(a,b,
c,d){var e=m;if(sc)try{e=new Blob([a],{type:nc(b)}),e.size!==a.length&&(e=new Blob([(new Uint8Array(a)).buffer],{type:nc(b)}))}catch(g){z.da("Blob constructor present but fails: "+g+"; falling back to blob builder")}e||(e=new tc,e.append((new Uint8Array(a)).buffer),e=e.getBlob());var h=uc.createObjectURL(e),j=new Image;j.onload=function(){B(j.complete,"Image "+b+" could not be decoded");var d=document.createElement("canvas");d.width=j.width;d.height=j.height;d.getContext("2d").drawImage(j,0,0);r.preloadedImages[b]=
d;uc.revokeObjectURL(h);c&&c(a)};j.onerror=function(){console.log("Image "+h+" could not be decoded");d&&d()};j.src=h}});r.preloadPlugins.push({canHandle:function(a){return!r.Se&&a.substr(-4)in{".ogg":1,".wav":1,".mp3":1}},handle:function(a,b,c,d){function e(d){h||(h=l,r.preloadedAudios[b]=d,c&&c(a))}function g(){h||(h=l,r.preloadedAudios[b]=new Audio,d&&d())}var h=n;if(sc){try{var j=new Blob([a],{type:nc(b)})}catch(t){return g()}var j=uc.createObjectURL(j),k=new Audio;k.addEventListener("canplaythrough",
function(){e(k)},n);k.onerror=function(){if(!h){console.log("warning: browser could not fully decode audio "+b+", trying slower base64 approach");for(var c="",d=0,g=0,j=0;j<a.length;j++){d=d<<8|a[j];for(g+=8;6<=g;)var t=d>>g-6&63,g=g-6,c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[t]}2==g?(c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d&3)<<4],c+="=="):4==g&&(c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d&15)<<2],c+="=");
k.src="data:audio/x-"+b.substr(-3)+";base64,"+c;e(k)}};k.src=j;setTimeout(function(){ia||e(k)},1E4)}else return g()}});var t=r.canvas;t.Ra=t.requestPointerLock||t.mozRequestPointerLock||t.webkitRequestPointerLock||t.msRequestPointerLock||q();t.kb=document.exitPointerLock||document.mozExitPointerLock||document.webkitExitPointerLock||document.msExitPointerLock||q();t.kb=t.kb.bind(document);document.addEventListener("pointerlockchange",w,n);document.addEventListener("mozpointerlockchange",w,n);document.addEventListener("webkitpointerlockchange",
w,n);document.addEventListener("mspointerlockchange",w,n);r.elementPointerLock&&t.addEventListener("click",function(a){!jc&&t.Ra&&(t.Ra(),a.preventDefault())},n)}var C=b?fb(U(a+"/"+b)):a;Xa();if("string"==typeof c){var G=h,I=function(){G?G():f('Loading data file "'+c+'" failed.')},A=new XMLHttpRequest;A.open("GET",c,l);A.responseType="arraybuffer";A.onload=function(){if(200==A.status||0==A.status&&A.response){var a=A.response;B(a,'Loading data file "'+c+'" failed (no arrayBuffer).');a=new Uint8Array(a);
E(a);Ya()}else I()};A.onerror=I;A.send(m);Xa()}else E(c)};
r.FS_createLazyFile=function(a,b,c,d,e){var g,h;"undefined"!==typeof XMLHttpRequest?(ca||f("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"),g=function(){this.Ma=n;this.ia=[]},g.prototype.get=function(a){if(!(a>this.length-1||0>a)){var b=a%this.Vb;return this.ac(Math.floor(a/this.Vb))[b]}},g.prototype.rc=function(a){this.ac=a},g.prototype.fb=function(){var a=new XMLHttpRequest;a.open("HEAD",c,n);a.send(m);200<=a.status&&300>a.status||
304===a.status||f(Error("Couldn't load "+c+". Status: "+a.status));var b=Number(a.getResponseHeader("Content-length")),d,e=1048576;if(!((d=a.getResponseHeader("Accept-Ranges"))&&"bytes"===d))e=b;var g=this;g.rc(function(a){var d=a*e,h=(a+1)*e-1,h=Math.min(h,b-1);if("undefined"===typeof g.ia[a]){var j=g.ia;d>h&&f(Error("invalid range ("+d+", "+h+") or no bytes requested!"));h>b-1&&f(Error("only "+b+" bytes available! programmer error!"));var k=new XMLHttpRequest;k.open("GET",c,n);b!==e&&k.setRequestHeader("Range",
"bytes="+d+"-"+h);"undefined"!=typeof Uint8Array&&(k.responseType="arraybuffer");k.overrideMimeType&&k.overrideMimeType("text/plain; charset=x-user-defined");k.send(m);200<=k.status&&300>k.status||304===k.status||f(Error("Couldn't load "+c+". Status: "+k.status));d=k.response!==i?new Uint8Array(k.response||[]):K(k.responseText||"",l);j[a]=d}"undefined"===typeof g.ia[a]&&f(Error("doXHR failed!"));return g.ia[a]});this.Qb=b;this.Pb=e;this.Ma=l},g=new g,Object.defineProperty(g,"length",{get:function(){this.Ma||
this.fb();return this.Qb}}),Object.defineProperty(g,"chunkSize",{get:function(){this.Ma||this.fb();return this.Pb}}),h=i):(h=c,g=i);var j,a=U(("string"===typeof a?a:xb(a))+"/"+b);j=Ib(a,Tb(d,e));g?j.o=g:h&&(j.o=m,j.url=h);var k={};Object.keys(j.k).forEach(function(a){var b=j.k[a];k[a]=function(){Wb(j)||f(new V(T.O));return b.apply(m,arguments)}});k.N=function(a,b,c,d,e){Wb(j)||f(new V(T.O));a=a.e.o;if(e>=a.length)return 0;d=Math.min(a.length-e,d);B(0<=d);if(a.slice)for(var g=0;g<d;g++)b[c+g]=a[e+
g];else for(g=0;g<d;g++)b[c+g]=a.get(e+g);return d};j.k=k;return j};r.FS_createLink=function(a,b,c){a=U(("string"===typeof a?a:xb(a))+"/"+b);return Lb(c,a)};r.FS_createDevice=Vb;Ma.unshift({U:q()});Oa.push({U:q()});var vc=new z.Ca;u&&(require("fs"),process.platform.match(/^win/));Ma.push({U:function(){Z.root=Gb(Z,m)}});
r.requestFullScreen=function(a,b){function c(){ic=n;if((document.webkitFullScreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||document.mozFullscreenElement||document.fullScreenElement||document.fullscreenElement||document.msFullScreenElement||document.msFullscreenElement||document.webkitCurrentFullScreenElement)===a)d.gb=document.cancelFullScreen||document.mozCancelFullScreen||document.webkitCancelFullScreen||document.msExitFullscreen||document.exitFullscreen||q(),d.gb=
d.gb.bind(document),lc&&d.Ra(),ic=l,mc&&("undefined"!=typeof SDL&&(a=Ea[SDL.screen+0*z.P>>2],N[SDL.screen+0*z.P>>2]=a|8388608),pc());else{var a=d.parentNode;a.parentNode.insertBefore(d,a);a.parentNode.removeChild(a);mc&&("undefined"!=typeof SDL&&(a=Ea[SDL.screen+0*z.P>>2],N[SDL.screen+0*z.P>>2]=a&-8388609),pc())}if(r.onFullScreen)r.onFullScreen(ic);qc(d)}lc=a;mc=b;"undefined"===typeof lc&&(lc=l);"undefined"===typeof mc&&(mc=n);var d=r.canvas,e=d.parentNode;kc||(kc=l,document.addEventListener("fullscreenchange",
c,n),document.addEventListener("mozfullscreenchange",c,n),document.addEventListener("webkitfullscreenchange",c,n),document.addEventListener("MSFullscreenChange",c,n));e=document.createElement("div");d.parentNode.insertBefore(e,d);e.appendChild(d);e.pc=e.requestFullScreen||e.mozRequestFullScreen||e.msRequestFullscreen||(e.webkitRequestFullScreen?function(){e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)}:m);e.pc()};
r.requestAnimationFrame=function(a){"undefined"===typeof window?setTimeout(a,1E3/60):(window.requestAnimationFrame||(window.requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||window.setTimeout),window.requestAnimationFrame(a))};r.setCanvasSize=function(a,b,c){qc(r.canvas,a,b);c||pc()};r.pauseMainLoop=q();r.resumeMainLoop=function(){hc&&(hc=n,m())};
r.getUserMedia=function(){window.pb||(window.pb=navigator.getUserMedia||navigator.mozGetUserMedia);window.pb(i)};Ga=x=z.S(H);Ha=Ga+5242880;Ia=J=z.S(Ha);B(Ia<ha,"TOTAL_MEMORY not big enough for stack");ra=Math.min;
var $=(function(global,env,buffer) {
// EMSCRIPTEN_START_ASM
"use asm";var a=new global.Int8Array(buffer);var b=new global.Int16Array(buffer);var c=new global.Int32Array(buffer);var d=new global.Uint8Array(buffer);var e=new global.Uint16Array(buffer);var f=new global.Uint32Array(buffer);var g=new global.Float32Array(buffer);var h=new global.Float64Array(buffer);var i=env.STACKTOP|0;var j=env.STACK_MAX|0;var k=env.tempDoublePtr|0;var l=env.ABORT|0;var m=0;var n=0;var o=0;var p=0;var q=+env.NaN,r=+env.Infinity;var s=0,t=0,u=0,v=0,w=0.0,x=0,y=0,z=0,A=0.0;var B=0;var C=0;var D=0;var E=0;var F=0;var G=0;var H=0;var I=0;var J=0;var K=0;var L=global.Math.floor;var M=global.Math.abs;var N=global.Math.sqrt;var O=global.Math.pow;var P=global.Math.cos;var Q=global.Math.sin;var R=global.Math.tan;var S=global.Math.acos;var T=global.Math.asin;var U=global.Math.atan;var V=global.Math.atan2;var W=global.Math.exp;var X=global.Math.log;var Y=global.Math.ceil;var Z=global.Math.imul;var _=env.abort;var $=env.assert;var aa=env.asmPrintInt;var ba=env.asmPrintFloat;var ca=env.min;var da=env._sysconf;var ea=env._llvm_lifetime_start;var fa=env._fflush;var ga=env.__formatString;var ha=env._mkport;var ia=env._send;var ja=env._pwrite;var ka=env._abort;var la=env.__reallyNegative;var ma=env._fwrite;var na=env._sbrk;var oa=env._printf;var pa=env._fprintf;var qa=env.___setErrNo;var ra=env._llvm_lifetime_end;var sa=env._fileno;var ta=env._write;var ua=env._emscripten_memcpy_big;var va=env.___assert_fail;var wa=env.___errno_location;var xa=env._time;var ya=0.0;
// EMSCRIPTEN_START_FUNCS
function za(a){a=a|0;var b=0;b=i;i=i+a|0;i=i+7&-8;return b|0}function Aa(){return i|0}function Ba(a){a=a|0;i=a}function Ca(a,b){a=a|0;b=b|0;if((m|0)==0){m=a;n=b}}function Da(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0]}function Ea(b){b=b|0;a[k]=a[b];a[k+1|0]=a[b+1|0];a[k+2|0]=a[b+2|0];a[k+3|0]=a[b+3|0];a[k+4|0]=a[b+4|0];a[k+5|0]=a[b+5|0];a[k+6|0]=a[b+6|0];a[k+7|0]=a[b+7|0]}function Fa(a){a=a|0;B=a}function Ga(a){a=a|0;C=a}function Ha(a){a=a|0;D=a}function Ia(a){a=a|0;E=a}function Ja(a){a=a|0;F=a}function Ka(a){a=a|0;G=a}function La(a){a=a|0;H=a}function Ma(a){a=a|0;I=a}function Na(a){a=a|0;J=a}function Oa(a){a=a|0;K=a}function Pa(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;f=b+1768|0;if((c[f>>2]|0)==(d|0)){i=e;return}c[f>>2]=d;f=(d|0)!=0;if(f){d=b+67884|0;g=b+1836|0;h=d+0|0;j=g+64|0;do{a[g]=a[h]|0;g=g+1|0;h=h+1|0}while((g|0)<(j|0));k=d}else{k=b+67884|0}g=k+0|0;h=(f?b+1772|0:b+1836|0)+0|0;j=g+64|0;do{a[g]=a[h]|0;g=g+1|0;h=h+1|0}while((g|0)<(j|0));i=e;return}function Qa(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0;g=i;switch(f|0){case 12:case 11:case 10:{h=f+ -10|0;j=(d+255&255)+1|0;k=b+(h*24|0)+1572|0;l=c[k>>2]|0;if((l|0)==(j|0)){i=g;return}m=b+(h*24|0)+1564|0;n=c[m>>2]|0;do{if((n|0)<=(e|0)){o=c[b+(h*24|0)+1568>>2]|0;p=(e-n|0)/(o|0)|0;q=p+1|0;c[m>>2]=(Z(q,o)|0)+n;if((c[b+(h*24|0)+1580>>2]|0)==0){break}o=b+(h*24|0)+1576|0;r=c[o>>2]|0;s=p-(l+255-r&255)|0;if((s|0)>-1){p=(s|0)/(l|0)|0;t=b+(h*24|0)+1584|0;c[t>>2]=p+1+(c[t>>2]|0)&15;u=s-(Z(p,l)|0)|0}else{u=r+q|0}c[o>>2]=u&255}}while(0);c[k>>2]=j;i=g;return};case 15:case 14:case 13:{if((d|0)>=4096){i=g;return}j=f+ -13|0;k=e+ -1|0;u=b+(j*24|0)+1564|0;l=c[u>>2]|0;do{if((l|0)<=(k|0)){h=c[b+(j*24|0)+1568>>2]|0;n=(k-l|0)/(h|0)|0;m=n+1|0;c[u>>2]=(Z(m,h)|0)+l;if((c[b+(j*24|0)+1580>>2]|0)==0){break}h=c[b+(j*24|0)+1572>>2]|0;o=b+(j*24|0)+1576|0;q=c[o>>2]|0;r=n-(h+255-q&255)|0;if((r|0)>-1){n=(r|0)/(h|0)|0;p=b+(j*24|0)+1584|0;c[p>>2]=n+1+(c[p>>2]|0)&15;v=r-(Z(n,h)|0)|0}else{v=q+m|0}c[o>>2]=v&255}}while(0);c[b+(j*24|0)+1584>>2]=0;i=g;return};case 9:case 8:{a[b+f+1652|0]=d;i=g;return};case 1:{if((d&16|0)!=0){a[b+1656|0]=0;a[b+1657|0]=0}if((d&32|0)==0){w=0}else{a[b+1658|0]=0;a[b+1659|0]=0;w=0}do{f=d>>>w&1;j=b+(w*24|0)+1580|0;v=c[j>>2]|0;do{if((v|0)!=(f|0)){l=b+(w*24|0)+1564|0;u=c[l>>2]|0;do{if((u|0)<=(e|0)){k=c[b+(w*24|0)+1568>>2]|0;o=(e-u|0)/(k|0)|0;m=o+1|0;c[l>>2]=(Z(m,k)|0)+u;if((v|0)==0){break}k=c[b+(w*24|0)+1572>>2]|0;q=b+(w*24|0)+1576|0;h=c[q>>2]|0;n=o-(k+255-h&255)|0;if((n|0)>-1){o=(n|0)/(k|0)|0;r=b+(w*24|0)+1584|0;c[r>>2]=o+1+(c[r>>2]|0)&15;x=n-(Z(o,k)|0)|0}else{x=h+m|0}c[q>>2]=x&255}}while(0);c[j>>2]=f;if((f|0)==0){break}c[b+(w*24|0)+1576>>2]=0;c[b+(w*24|0)+1584>>2]=0}}while(0);w=w+1|0;}while((w|0)!=3);w=d&128;d=b+1768|0;if((c[d>>2]|0)==(w|0)){i=g;return}c[d>>2]=w;d=(w|0)!=0;if(d){w=b+67884|0;y=b+1836|0;z=w+0|0;A=y+64|0;do{a[y]=a[z]|0;y=y+1|0;z=z+1|0}while((y|0)<(A|0));B=w}else{B=b+67884|0}y=B+0|0;z=(d?b+1772|0:b+1836|0)+0|0;A=y+64|0;do{a[y]=a[z]|0;y=y+1|0;z=z+1|0}while((y|0)<(A|0));i=g;return};default:{i=g;return}}}function Ra(b,d,e,f){b=b|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0;g=i;h=d&255;j=b+e+2412|0;a[j]=h;k=e+ -240|0;a:do{if((k|0)>-1){l=k;m=j;n=e;while(1){if((l|0)<16){break}o=n+ -65472|0;if(!((o|0)>-1)){break a}if((o|0)<64){p=17;break}a[m]=-1;q=n+ -65536|0;r=b+q+2412|0;a[r]=h;s=n+ -65776|0;if((s|0)>-1){l=s;m=r;n=q}else{break a}}if((p|0)==17){a[b+o+1836|0]=h;if((c[b+1768>>2]|0)==0){break}a[m]=a[b+o+1772|0]|0;break}a[b+l+1636|0]=h;if((-788594688<<l|0)>=0){break}if((l|0)!=3){Qa(b,d,f,l);break}n=b+1692|0;q=f-(c[n>>2]|0)|0;if((q|0)<=0){va(8,24,156,320)}c[n>>2]=f;gb(b,q);q=a[b+1638|0]|0;if(!(q<<24>>24>-1)){break}n=q&255;a[b+n|0]=h;q=n&15;if((q|0)==9){a[b+298|0]=h;break}else if((q|0)==12){if((n|0)==76){c[b+292>>2]=d&255;break}else if((n|0)==124){a[b+296|0]=0;a[b+124|0]=0;break}else{break}}else if((q|0)==8){a[b+297|0]=h;break}else{break}}}while(0);i=g;return}function Sa(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0;g=i;h=e;while(1){j=h+ -240|0;if(!((j|0)>-1&(h+ -256|0)>>>0>65279)){k=18;break}l=h+ -253|0;if(l>>>0<3){k=4;break}if((l|0)<0){k=11;break}e=h+ -65536|0;if((e|0)<256){h=e}else{k=17;break}}if((k|0)==4){e=b+(l*24|0)+1564|0;m=c[e>>2]|0;do{if((m|0)<=(f|0)){n=c[b+(l*24|0)+1568>>2]|0;o=(f-m|0)/(n|0)|0;p=o+1|0;c[e>>2]=(Z(p,n)|0)+m;if((c[b+(l*24|0)+1580>>2]|0)==0){break}n=c[b+(l*24|0)+1572>>2]|0;q=b+(l*24|0)+1576|0;r=c[q>>2]|0;s=o-(n+255-r&255)|0;if((s|0)>-1){o=(s|0)/(n|0)|0;t=b+(l*24|0)+1584|0;c[t>>2]=o+1+(c[t>>2]|0)&15;u=s-(Z(o,n)|0)|0}else{u=r+p|0}c[q>>2]=u&255}}while(0);u=b+(l*24|0)+1584|0;l=c[u>>2]|0;c[u>>2]=0;v=l;i=g;return v|0}else if((k|0)==11){l=h+ -242|0;if(!(l>>>0<2)){v=d[b+j+1652|0]|0;i=g;return v|0}j=b+1638|0;if((l|0)!=1){v=d[j]|0;i=g;return v|0}l=b+1692|0;u=f-(c[l>>2]|0)|0;if((u|0)<=0){va(8,24,143,56)}c[l>>2]=f;gb(b,u);v=d[b+(a[j]&127)|0]|0;i=g;return v|0}else if((k|0)==17){va(72,24,497,120)}else if((k|0)==18){v=d[b+h+2412|0]|0;i=g;return v|0}return 0}function Ta(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=i;e=a+1696|0;f=c[e>>2]|0;if((f|0)<(b|0)){Ua(a,b)|0;g=c[e>>2]|0}else{g=f}f=g-b|0;c[e>>2]=f;e=a+1720|0;c[e>>2]=(c[e>>2]|0)+b;if(!((f+11|0)>>>0<12)){va(136,24,546,184)}f=a+1564|0;b=c[f>>2]|0;do{if((b|0)<=0){e=c[a+1568>>2]|0;g=(0-b|0)/(e|0)|0;h=g+1|0;c[f>>2]=(Z(h,e)|0)+b;if((c[a+1580>>2]|0)==0){break}e=c[a+1572>>2]|0;j=a+1576|0;k=c[j>>2]|0;l=g-(e+255-k&255)|0;if((l|0)>-1){g=(l|0)/(e|0)|0;m=a+1584|0;c[m>>2]=g+1+(c[m>>2]|0)&15;n=l-(Z(g,e)|0)|0}else{n=k+h|0}c[j>>2]=n&255}}while(0);n=a+1588|0;b=c[n>>2]|0;do{if((b|0)<=0){f=c[a+1592>>2]|0;j=(0-b|0)/(f|0)|0;h=j+1|0;c[n>>2]=(Z(h,f)|0)+b;if((c[a+1604>>2]|0)==0){break}f=c[a+1596>>2]|0;k=a+1600|0;e=c[k>>2]|0;g=j-(f+255-e&255)|0;if((g|0)>-1){j=(g|0)/(f|0)|0;l=a+1608|0;c[l>>2]=j+1+(c[l>>2]|0)&15;o=g-(Z(j,f)|0)|0}else{o=e+h|0}c[k>>2]=o&255}}while(0);o=a+1612|0;b=c[o>>2]|0;do{if((b|0)<=0){n=c[a+1616>>2]|0;k=(0-b|0)/(n|0)|0;h=k+1|0;c[o>>2]=(Z(h,n)|0)+b;if((c[a+1628>>2]|0)==0){break}n=c[a+1620>>2]|0;e=a+1624|0;f=c[e>>2]|0;j=k-(n+255-f&255)|0;if((j|0)>-1){k=(j|0)/(n|0)|0;g=a+1632|0;c[g>>2]=k+1+(c[g>>2]|0)&15;p=j-(Z(k,n)|0)|0}else{p=f+h|0}c[e>>2]=p&255}}while(0);p=a+1692|0;b=c[p>>2]|0;if((b|0)<0){c[p>>2]=0;gb(a,0-b|0)}if((c[a+1724>>2]|0)==0){i=d;return}_a(a);i=d;return}function Ua(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0,bb=0,cb=0,db=0,eb=0,fb=0,hb=0,ib=0,jb=0,kb=0,lb=0,mb=0,nb=0,ob=0,pb=0,qb=0,rb=0,sb=0,tb=0,ub=0,vb=0,wb=0,xb=0,yb=0,zb=0,Ab=0,Bb=0,Cb=0,Db=0,Eb=0,Fb=0,Gb=0,Hb=0,Ib=0,Jb=0,Kb=0,Lb=0,Mb=0,Nb=0,Ob=0,Pb=0,Qb=0,Rb=0,Sb=0,Tb=0,Ub=0,Vb=0,Wb=0,Xb=0,Yb=0,Zb=0,_b=0,$b=0,ac=0,bc=0,cc=0,dc=0,ec=0,fc=0,gc=0,hc=0,ic=0,jc=0,kc=0,lc=0,mc=0,nc=0,oc=0,pc=0,qc=0,rc=0,sc=0,tc=0,uc=0,vc=0,wc=0,xc=0,yc=0,zc=0,Ac=0,Bc=0,Cc=0,Dc=0,Ec=0,Fc=0,Gc=0,Hc=0,Ic=0,Jc=0,Kc=0,Lc=0,Mc=0,Nc=0,Oc=0,Pc=0,Qc=0,Rc=0,Sc=0,Tc=0,Uc=0,Vc=0,Wc=0,Xc=0,Yc=0,Zc=0,_c=0,$c=0,ad=0,bd=0,cd=0,dd=0,ed=0;f=i;g=b+1696|0;h=(c[g>>2]|0)-e|0;if((h|0)>=1){va(200,216,163,248)}c[g>>2]=e;j=b+1692|0;c[j>>2]=(c[j>>2]|0)+h;k=b+1564|0;c[k>>2]=(c[k>>2]|0)+h;l=b+1588|0;c[l>>2]=(c[l>>2]|0)+h;m=b+1612|0;c[m>>2]=(c[m>>2]|0)+h;n=b+1672|0;o=c[n>>2]|0;p=b+1676|0;q=c[p>>2]|0;r=b+1680|0;s=c[r>>2]|0;t=b+1668|0;u=b+(c[t>>2]|0)+2412|0;v=b+1688|0;w=b+((c[v>>2]|0)+257)+2412|0;x=b+1684|0;y=c[x>>2]|0;z=y<<8;A=y<<3&256;B=(y<<4&2048|y&2)^2;C=a[u]|0;D=C&255;E=(d[b+D+1900|0]|0)+h|0;F=b+2412|0;a:do{if((E|0)>0){G=o;H=z;I=A;J=B;K=u;L=y;M=h;N=w;O=q;P=s}else{Q=b+1638|0;R=b;S=b+297|0;T=b+298|0;U=b+292|0;V=b+296|0;W=b+124|0;X=b+67914|0;Y=b+67915|0;_=E;$=D;aa=C;ba=o;ca=z;da=A;ea=B;fa=u;ga=y;ha=w;ia=q;ja=s;b:while(1){ka=fa+1|0;la=a[ka]|0;ma=la&255;c:do{switch($|0){case 232:{na=ma;oa=ca;pa=ma;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 0:{xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 240:{if((ea&255)<<24>>24==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}break};case 208:{if((ea&255)<<24>>24==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}break};case 63:{Ha=ka-F+2|0;Ia=b+(d[fa+2|0]<<8|ma)+2412|0;Ja=ha+ -2|0;Ka=Ja-F|0;if((Ka|0)>256){a[ha+ -1|0]=Ha>>>8;a[Ja]=Ha;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ia;Ca=ga;Da=_;Ea=Ja;Fa=ia;Ga=ja;break c}else{a[b+(Ka&255|256)+2412|0]=Ha;a[ha+ -1|0]=Ha>>>8;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ia;Ca=ga;Da=_;Ea=ha+254|0;Fa=ia;Ga=ja;break c}break};case 111:{Ia=ha-F|0;if((Ia|0)<511){xa=ba;ya=ca;za=da;Aa=ea;Ba=b+(d[ha+1|0]<<8|d[ha])+2412|0;Ca=ga;Da=_;Ea=ha+2|0;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=b+(d[ha+ -255|0]<<8|d[b+(Ia&255|256)+2412|0])+2412|0;Ca=ga;Da=_;Ea=ha+ -254|0;Fa=ia;Ga=ja;break c}break};case 228:{Ia=fa+2|0;Ha=ma|da;Ka=Ha+ -253|0;if(!(Ka>>>0<3)){Ja=d[b+Ha+2412|0]|0;La=Ha+ -240|0;if(!(La>>>0<16)){xa=Ja;ya=ca;za=da;Aa=Ja;Ba=Ia;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ja=d[b+La+1652|0]|0;La=Ha+ -242|0;if(!(La>>>0<2)){xa=Ja;ya=ca;za=da;Aa=Ja;Ba=Ia;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ja=d[Q]|0;if((La|0)!=1){xa=Ja;ya=ca;za=da;Aa=Ja;Ba=Ia;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ja=_-(c[j>>2]|0)|0;if((Ja|0)<=0){wa=32;break b}c[j>>2]=_;gb(R,Ja);Ja=d[b+(a[Q]&127)|0]|0;xa=Ja;ya=ca;za=da;Aa=Ja;Ba=Ia;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ja=b+(Ka*24|0)+1564|0;La=c[Ja>>2]|0;do{if((_|0)>=(La|0)){Ha=c[b+(Ka*24|0)+1568>>2]|0;Ma=(_-La|0)/(Ha|0)|0;Na=Ma+1|0;c[Ja>>2]=(Z(Na,Ha)|0)+La;if((c[b+(Ka*24|0)+1580>>2]|0)==0){break}Ha=c[b+(Ka*24|0)+1572>>2]|0;Oa=b+(Ka*24|0)+1576|0;Pa=c[Oa>>2]|0;Ta=Ma-(Ha+255-Pa&255)|0;if((Ta|0)>-1){Ma=(Ta|0)/(Ha|0)|0;Ua=b+(Ka*24|0)+1584|0;c[Ua>>2]=Ma+1+(c[Ua>>2]|0)&15;Va=Ta-(Z(Ma,Ha)|0)|0}else{Va=Pa+Na|0}c[Oa>>2]=Va&255}}while(0);La=b+(Ka*24|0)+1584|0;Ja=c[La>>2]|0;c[La>>2]=0;xa=Ja;ya=ca;za=da;Aa=Ja;Ba=Ia;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 250:{Ja=_+ -2|0;La=ma|da;Oa=La+ -253|0;do{if(Oa>>>0<3){Na=b+(Oa*24|0)+1564|0;Pa=c[Na>>2]|0;do{if((Ja|0)>=(Pa|0)){Ha=c[b+(Oa*24|0)+1568>>2]|0;Ma=(Ja-Pa|0)/(Ha|0)|0;Ta=Ma+1|0;c[Na>>2]=(Z(Ta,Ha)|0)+Pa;if((c[b+(Oa*24|0)+1580>>2]|0)==0){break}Ha=c[b+(Oa*24|0)+1572>>2]|0;Ua=b+(Oa*24|0)+1576|0;Wa=c[Ua>>2]|0;Xa=Ma-(Ha+255-Wa&255)|0;if((Xa|0)>-1){Ma=(Xa|0)/(Ha|0)|0;Ya=b+(Oa*24|0)+1584|0;c[Ya>>2]=Ma+1+(c[Ya>>2]|0)&15;Za=Xa-(Z(Ma,Ha)|0)|0}else{Za=Wa+Ta|0}c[Ua>>2]=Za&255}}while(0);Pa=b+(Oa*24|0)+1584|0;Na=c[Pa>>2]|0;c[Pa>>2]=0;_a=Na}else{Na=La+ -240|0;if(!(Na>>>0<16)){_a=d[b+La+2412|0]|0;break}Pa=La+ -242|0;if(!(Pa>>>0<2)){_a=d[b+Na+1652|0]|0;break}if((Pa|0)!=1){_a=d[Q]|0;break}Pa=Ja-(c[j>>2]|0)|0;if((Pa|0)<=0){wa=45;break b}c[j>>2]=Ja;gb(R,Pa);_a=d[b+(a[Q]&127)|0]|0}}while(0);$a=_a+8192|0;wa=48;break};case 143:{$a=ma;wa=48;break};case 196:{Ja=fa+2|0;La=ma|da;Oa=ba&255;a[b+La+2412|0]=Oa;Ia=La+ -240|0;if(!(Ia>>>0<16)){xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ka=La+ -242|0;a[b+Ia+1636|0]=Oa;if((Ka|0)!=1){if(!(Ka>>>0>1)){xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Qa(b,ba,_,Ia);xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ia=_-(c[j>>2]|0)|0;if((Ia|0)<=0){wa=64;break b}c[j>>2]=_;gb(R,Ia);Ia=a[Q]|0;if(!(Ia<<24>>24>-1)){xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}Ka=Ia&255;a[b+Ka|0]=Oa;Ia=Ka&15;if((Ia|0)==8){a[S]=Oa;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else if((Ia|0)==9){a[T]=Oa;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else if((Ia|0)==12){if((Ka|0)==76){c[U>>2]=ba&255;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else if((Ka|0)==124){a[V]=0;a[W]=0;xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=Ja;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}break};case 230:{ab=ia+da|0;bb=fa;wa=81;break};case 247:{Ja=ma|da;ab=(d[b+(Ja+1)+2412|0]<<8|d[b+Ja+2412|0])+ja|0;bb=ka;wa=81;break};case 231:{Ja=ma+ia&255|da;ab=d[b+(Ja+1)+2412|0]<<8|d[b+Ja+2412|0];bb=ka;wa=81;break};case 246:{cb=ma+ja|0;wa=79;break};case 245:{cb=ma+ia|0;wa=79;break};case 229:{cb=ma;wa=79;break};case 244:{ab=ma+ia&255|da;bb=ka;wa=81;break};case 191:{Ja=Sa(b,ia+da|0,_+ -1|0)|0;xa=Ja;ya=ca;za=da;Aa=Ja;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia+1&255;Ga=ja;break};case 249:{db=ma+ja&255;wa=84;break};case 248:{db=ma;wa=84;break};case 233:{Ja=fa+2|0;eb=Sa(b,d[Ja]<<8|ma,_)|0;fb=Ja;wa=98;break};case 205:{eb=ma;fb=ka;wa=98;break};case 251:{hb=ma+ia&255;wa=100;break};case 235:{hb=ma;wa=100;break};case 236:{Ja=d[fa+2|0]<<8|ma;Ka=fa+3|0;Ia=Ja+ -253|0;if(!(Ia>>>0<3)){Oa=d[b+Ja+2412|0]|0;La=Ja+ -240|0;if(!(La>>>0<16)){xa=ba;ya=ca;za=da;Aa=Oa;Ba=Ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Oa;break c}Oa=d[b+La+1652|0]|0;La=Ja+ -242|0;if(!(La>>>0<2)){xa=ba;ya=ca;za=da;Aa=Oa;Ba=Ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Oa;break c}Oa=d[Q]|0;if((La|0)!=1){xa=ba;ya=ca;za=da;Aa=Oa;Ba=Ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Oa;break c}Oa=_-(c[j>>2]|0)|0;if((Oa|0)<=0){wa=124;break b}c[j>>2]=_;gb(R,Oa);Oa=d[b+(a[Q]&127)|0]|0;xa=ba;ya=ca;za=da;Aa=Oa;Ba=Ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Oa;break c}Oa=b+(Ia*24|0)+1564|0;La=c[Oa>>2]|0;do{if((_|0)>=(La|0)){Ja=c[b+(Ia*24|0)+1568>>2]|0;Pa=(_-La|0)/(Ja|0)|0;Na=Pa+1|0;c[Oa>>2]=(Z(Na,Ja)|0)+La;if((c[b+(Ia*24|0)+1580>>2]|0)==0){break}Ja=c[b+(Ia*24|0)+1572>>2]|0;Ua=b+(Ia*24|0)+1576|0;Ta=c[Ua>>2]|0;Wa=Pa-(Ja+255-Ta&255)|0;if((Wa|0)>-1){Pa=(Wa|0)/(Ja|0)|0;Ha=b+(Ia*24|0)+1584|0;c[Ha>>2]=Pa+1+(c[Ha>>2]|0)&15;ib=Wa-(Z(Pa,Ja)|0)|0}else{ib=Ta+Na|0}c[Ua>>2]=ib&255}}while(0);La=b+(Ia*24|0)+1584|0;Oa=c[La>>2]|0;c[La>>2]=0;xa=ba;ya=ca;za=da;Aa=Oa;Ba=Ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Oa;break};case 141:{na=ba;oa=ca;pa=ma;qa=ka;ra=ga;sa=_;ta=ia;ua=ma;wa=6;break};case 198:{jb=ia+da|0;kb=fa;wa=134;break};case 215:{Oa=ma|da;jb=(d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0])+ja|0;kb=ka;wa=134;break};case 199:{Oa=ma+ia&255|da;jb=d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0];kb=ka;wa=134;break};case 214:{lb=ma+ja|0;wa=132;break};case 213:{lb=ma+ia|0;wa=132;break};case 197:{lb=ma;wa=132;break};case 212:{jb=ma+ia&255|da;kb=ka;wa=134;break};case 201:{mb=ia;wa=136;break};case 204:{mb=ja;wa=136;break};case 217:{nb=ma+ja&255;wa=138;break};case 216:{nb=ma;wa=138;break};case 219:{ob=ma+ia&255;wa=140;break};case 203:{ob=ma;wa=140;break};case 125:{xa=ia;ya=ca;za=da;Aa=ia;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 221:{xa=ja;ya=ca;za=da;Aa=ja;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 93:{xa=ba;ya=ca;za=da;Aa=ba;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ba;Ga=ja;break};case 253:{xa=ba;ya=ca;za=da;Aa=ba;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ba;break};case 157:{Oa=ha+ -257-F|0;xa=ba;ya=ca;za=da;Aa=Oa;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=Oa;Ga=ja;break};case 189:{xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=b+(ia+257)+2412|0;Fa=ia;Ga=ja;break};case 175:{Ra(b,ba+8192|0,ia+da|0,_);xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia+1|0;Ga=ja;break};case 38:{pb=ia+da|0;qb=fa;wa=156;break};case 55:{Oa=ma|da;pb=(d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0])+ja|0;qb=ka;wa=156;break};case 39:{Oa=ma+ia&255|da;pb=d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0];qb=ka;wa=156;break};case 54:{rb=ma+ja|0;wa=153;break};case 53:{rb=ma+ia|0;wa=153;break};case 37:{rb=ma;wa=153;break};case 52:{sb=ma+ia&255;wa=155;break};case 36:{sb=ma;wa=155;break};case 40:{tb=ma;ub=ka;wa=157;break};case 57:{vb=ia+da|0;wb=Sa(b,ja+da|0,_+ -2|0)|0;xb=ka;wa=161;break};case 41:{yb=Sa(b,ma|da,_+ -3|0)|0;wa=160;break};case 56:{yb=ma;wa=160;break};case 6:{zb=ia+da|0;Ab=fa;wa=170;break};case 23:{Oa=ma|da;zb=(d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0])+ja|0;Ab=ka;wa=170;break};case 7:{Oa=ma+ia&255|da;zb=d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0];Ab=ka;wa=170;break};case 22:{Bb=ma+ja|0;wa=167;break};case 21:{Bb=ma+ia|0;wa=167;break};case 5:{Bb=ma;wa=167;break};case 20:{Cb=ma+ia&255;wa=169;break};case 4:{Cb=ma;wa=169;break};case 8:{Db=ma;Eb=ka;wa=171;break};case 25:{Fb=ia+da|0;Gb=Sa(b,ja+da|0,_+ -2|0)|0;Hb=ka;wa=175;break};case 9:{Ib=Sa(b,ma|da,_+ -3|0)|0;wa=174;break};case 24:{Ib=ma;wa=174;break};case 70:{Jb=ia+da|0;Kb=fa;wa=184;break};case 87:{Oa=ma|da;Jb=(d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0])+ja|0;Kb=ka;wa=184;break};case 71:{Oa=ma+ia&255|da;Jb=d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0];Kb=ka;wa=184;break};case 86:{Lb=ma+ja|0;wa=181;break};case 85:{Lb=ma+ia|0;wa=181;break};case 69:{Lb=ma;wa=181;break};case 84:{Mb=ma+ia&255;wa=183;break};case 68:{Mb=ma;wa=183;break};case 72:{Nb=ma;Ob=ka;wa=185;break};case 89:{Pb=ia+da|0;Qb=Sa(b,ja+da|0,_+ -2|0)|0;Rb=ka;wa=189;break};case 73:{Sb=Sa(b,ma|da,_+ -3|0)|0;wa=188;break};case 88:{Sb=ma;wa=188;break};case 102:{Tb=ia+da|0;Ub=fa;wa=198;break};case 119:{Oa=ma|da;Tb=(d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0])+ja|0;Ub=ka;wa=198;break};case 103:{Oa=ma+ia&255|da;Tb=d[b+(Oa+1)+2412|0]<<8|d[b+Oa+2412|0];Ub=ka;wa=198;break};case 118:{Vb=ma+ja|0;wa=195;break};case 117:{Vb=ma+ia|0;wa=195;break};case 101:{Vb=ma;wa=195;break};case 116:{Wb=ma+ia&255;wa=197;break};case 100:{Wb=ma;wa=197;break};case 104:{Xb=ma;Yb=ka;wa=199;break};case 121:{Oa=Sa(b,ja+da|0,_+ -2|0)|0;La=(Sa(b,ia+da|0,_+ -1|0)|0)-Oa|0;xa=ba;ya=~La;za=da;Aa=La&255;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 105:{Zb=Sa(b,ma|da,_+ -3|0)|0;wa=202;break};case 62:{_b=ma|da;$b=ka;wa=205;break};case 120:{Zb=ma;wa=202;break};case 30:{La=fa+2|0;_b=d[La]<<8|ma;$b=La;wa=205;break};case 200:{ac=ma;bc=ka;wa=206;break};case 126:{cc=ma|da;dc=ka;wa=209;break};case 94:{La=fa+2|0;cc=d[La]<<8|ma;dc=La;wa=209;break};case 173:{ec=ma;fc=ka;wa=210;break};case 153:case 185:{gc=ia+da|0;hc=Sa(b,ja+da|0,_+ -2|0)|0;ic=fa;wa=214;break};case 137:case 169:{jc=Sa(b,ma|da,_+ -3|0)|0;wa=213;break};case 152:case 184:{jc=ma;wa=213;break};case 166:case 134:{kc=ia+da|0;lc=fa;wa=223;break};case 183:case 151:{La=ma|da;kc=(d[b+(La+1)+2412|0]<<8|d[b+La+2412|0])+ja|0;lc=ka;wa=223;break};case 167:case 135:{La=ma+ia&255|da;kc=d[b+(La+1)+2412|0]<<8|d[b+La+2412|0];lc=ka;wa=223;break};case 182:case 150:{mc=ma+ja|0;wa=220;break};case 181:case 149:{mc=ma+ia|0;wa=220;break};case 165:case 133:{mc=ma;wa=220;break};case 180:case 148:{nc=ma+ia&255;wa=222;break};case 164:case 132:{nc=ma;wa=222;break};case 136:case 168:{oc=-1;pc=ma;qc=ba;rc=ka;wa=224;break};case 188:{La=ba+1|0;xa=La&255;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 61:{La=ia+1|0;xa=ba;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=La&255;Ga=ja;break};case 252:{La=ja+1|0;xa=ba;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=La&255;break};case 156:{La=ba+ -1|0;xa=La&255;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 29:{La=ia+ -1|0;xa=ba;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=La&255;Ga=ja;break};case 220:{La=ja+ -1|0;xa=ba;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=La&255;break};case 187:case 155:{sc=ma+ia&255;wa=234;break};case 171:case 139:{sc=ma;wa=234;break};case 172:case 140:{La=fa+2|0;tc=d[La]<<8|ma;uc=La;wa=236;break};case 92:{vc=0;wa=238;break};case 124:{vc=ca;wa=238;break};case 28:{wc=0;wa=240;break};case 60:{wc=ca;wa=240;break};case 11:{xc=0;yc=ma|da;zc=ka;wa=247;break};case 27:{Ac=0;wa=243;break};case 59:{Ac=ca;wa=243;break};case 43:{Bc=ca;Cc=ma;wa=244;break};case 12:{Dc=0;wa=246;break};case 44:{Dc=ca;wa=246;break};case 75:{Ec=0;Fc=ma|da;Gc=ka;wa=254;break};case 91:{Hc=0;wa=250;break};case 123:{Hc=ca;wa=250;break};case 107:{Ic=ca;Jc=ma;wa=251;break};case 76:{Kc=0;wa=253;break};case 108:{Kc=ca;wa=253;break};case 159:{La=ba<<4&240|ba>>4;xa=La;ya=ca;za=da;Aa=La;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 186:{La=Sa(b,ma|da,_+ -2|0)|0;Oa=Sa(b,ma+1&255|da,_)|0;na=La;oa=ca;pa=La&127|La>>1|Oa;qa=ka;ra=ga;sa=_;ta=ia;ua=Oa;wa=6;break};case 218:{Ra(b,ba,ma|da,_+ -1|0);Ra(b,ja+8192|0,ma+1&255|da,_);na=ba;oa=ca;pa=ea;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 26:case 58:{Oa=ma|da;La=($>>>4&2)+ -1+(Sa(b,Oa,_+ -3|0)|0)|0;Ra(b,La,Oa,_+ -2|0);Oa=ma+1&255|da;Ua=(La>>>8)+(Sa(b,Oa,_+ -1|0)|0)&255;Ra(b,Ua,Oa,_);na=ba;oa=ca;pa=(La>>>1|La)&127|Ua;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 154:case 122:{Ua=Sa(b,ma|da,_+ -2|0)|0;La=Sa(b,ma+1&255|da,_)|0;if(aa<<24>>24==-102){Lc=La^255;Mc=(Ua^255)+1|0}else{Lc=La;Mc=Ua}Ua=Mc+ba|0;La=Lc+ja+(Ua>>8)|0;Oa=Lc^ja^La;Na=La&255;na=Ua&255;oa=La;pa=(Ua>>>1|Ua)&127|Na;qa=ka;ra=Oa>>>1&8|ga&-73|(Oa+128|0)>>>2&64;sa=_;ta=ia;ua=Na;wa=6;break};case 90:{Na=ba-(Sa(b,ma|da,_+ -1|0)|0)|0;Oa=ja-(Sa(b,ma+1&255|da,_)|0)+(Na>>8)|0;na=ba;oa=~Oa;pa=(Na>>>1|Na)&127|Oa&255;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 207:{Oa=Z(ba,ja)|0;Na=Oa>>>8;xa=Oa&255;ya=ca;za=da;Aa=(Oa>>>1|Oa)&127|Na;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Na;break};case 158:{Na=ba+(ja<<8)|0;Oa=ga&-73;Ua=(ja|0)<(ia|0)?Oa:Oa|64;if((ja|0)<(ia<<1|0)){Oa=(Na>>>0)/(ia>>>0)|0;Nc=Oa;Oc=Na-(Z(Oa,ia)|0)|0}else{Oa=Na-(ia<<9)|0;Na=256-ia|0;Nc=255-((Oa>>>0)/(Na>>>0)|0)|0;Oc=((Oa>>>0)%(Na>>>0)|0)+ia|0}Na=Nc&255;xa=Na;ya=ca;za=da;Aa=Na;Ba=ka;Ca=(ja&15)>>>0<(ia&15)>>>0?Ua:Ua|8;Da=_;Ea=ha;Fa=ia;Ga=Oc;break};case 223:{if((ba|0)>153){wa=270}else{if((ca&256|0)==0){Pc=ba;Qc=ca}else{wa=270}}if((wa|0)==270){wa=0;Pc=ba+96|0;Qc=256}if((Pc&14)>>>0>9){wa=273}else{if((ga&8|0)==0){Rc=Pc}else{wa=273}}if((wa|0)==273){wa=0;Rc=Pc+6|0}xa=Rc&255;ya=Qc;za=da;Aa=Rc;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 190:{if((ba|0)>153){wa=277}else{if((ca&256|0)==0){wa=277}else{Sc=ba;Tc=ca}}if((wa|0)==277){wa=0;Sc=ba+ -96|0;Tc=0}if((Sc&14)>>>0>9){wa=280}else{if((ga&8|0)==0){wa=280}else{Uc=Sc}}if((wa|0)==280){wa=0;Uc=Sc+ -6|0}xa=Uc&255;ya=Tc;za=da;Aa=Uc;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 47:{na=ba;oa=ca;pa=ea;qa=fa+((la<<24>>24)+1)|0;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 48:{if((ea&2176|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}break};case 16:{if((ea&2176|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}break};case 176:{if((ca&256|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}break};case 144:{if((ca&256|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}break};case 112:{if((ga&64|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}break};case 80:{if((ga&64|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=ja;break c}break};case 227:case 195:case 163:case 131:case 99:case 67:case 35:case 3:{Ua=fa+2|0;if(((Sa(b,ma|da,_+ -4|0)|0)&1<<($>>>5)|0)!=0){Vc=Ua;wa=5;break c}na=ba;oa=ca;pa=ea;qa=Ua;ra=ga;sa=_+ -2|0;ta=ia;ua=ja;wa=6;break};case 243:case 211:case 179:case 147:case 115:case 83:case 51:case 19:{Ua=fa+2|0;if(((Sa(b,ma|da,_+ -4|0)|0)&1<<($>>>5)|0)==0){Vc=Ua;wa=5;break c}na=ba;oa=ca;pa=ea;qa=Ua;ra=ga;sa=_+ -2|0;ta=ia;ua=ja;wa=6;break};case 222:{Wc=ma+ia&255;wa=306;break};case 46:{Wc=ma;wa=306;break};case 110:{Ua=ma|da;Na=Sa(b,Ua,_+ -4|0)|0;Ra(b,Na+8191|0,Ua,_+ -3|0);Ua=fa+2|0;if((Na|0)!=1){Vc=Ua;wa=5;break c}na=ba;oa=ca;pa=ea;qa=Ua;ra=ga;sa=_+ -2|0;ta=ia;ua=ja;wa=6;break};case 254:{Ua=ja+255&255;if((Ua|0)==0){xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+2|0;Ca=ga;Da=_+ -2|0;Ea=ha;Fa=ia;Ga=0;break c}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+((la<<24>>24)+2)|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ua;break c}break};case 31:{Ua=b+((d[fa+2|0]<<8|ma)+ia)+2412|0;Xc=a[Ua]|0;Yc=Ua;wa=327;break};case 95:{Xc=la;Yc=ka;wa=327;break};case 15:{Ua=ka-F|0;Na=b+(d[Y]<<8|d[X])+2412|0;Oa=ha+ -2|0;La=Oa-F|0;if((La|0)>256){a[ha+ -1|0]=Ua>>>8;a[Oa]=Ua;Zc=Oa}else{a[b+(La&255|256)+2412|0]=Ua;a[ha+ -1|0]=Ua>>>8;Zc=ha+254|0}Ua=ca>>>8&1|da>>>3|ga&-164|(ea>>>4|ea)&128;La=Zc+ -1|0;a[La]=(ea&255)<<24>>24==0?Ua|2:Ua;xa=ba;ya=ca;za=da;Aa=ea;Ba=Na;Ca=ga&-21|16;Da=_;Ea=(La-F|0)==256?Zc+255|0:La;Fa=ia;Ga=ja;break};case 79:{La=ka-F+1|0;Na=b+(ma|65280)+2412|0;Ua=ha+ -2|0;Oa=Ua-F|0;if((Oa|0)>256){a[ha+ -1|0]=La>>>8;a[Ua]=La;xa=ba;ya=ca;za=da;Aa=ea;Ba=Na;Ca=ga;Da=_;Ea=Ua;Fa=ia;Ga=ja;break c}else{a[b+(Oa&255|256)+2412|0]=La;a[ha+ -1|0]=La>>>8;xa=ba;ya=ca;za=da;Aa=ea;Ba=Na;Ca=ga;Da=_;Ea=ha+254|0;Fa=ia;Ga=ja;break c}break};case 241:case 225:case 209:case 193:case 177:case 161:case 145:case 129:case 113:case 97:case 81:case 65:case 49:case 33:case 17:case 1:{Na=ka-F|0;La=65502-($>>>3)|0;Oa=b+(d[b+(La+1)+2412|0]<<8|d[b+La+2412|0])+2412|0;La=ha+ -2|0;Ua=La-F|0;if((Ua|0)>256){a[ha+ -1|0]=Na>>>8;a[La]=Na;xa=ba;ya=ca;za=da;Aa=ea;Ba=Oa;Ca=ga;Da=_;Ea=La;Fa=ia;Ga=ja;break c}else{a[b+(Ua&255|256)+2412|0]=Na;a[ha+ -1|0]=Na>>>8;xa=ba;ya=ca;za=da;Aa=ea;Ba=Oa;Ca=ga;Da=_;Ea=ha+254|0;Fa=ia;Ga=ja;break c}break};case 127:{_c=b+(d[ha+2|0]<<8|d[ha+1|0])+2412|0;$c=ha+3|0;ad=d[ha]|0;wa=341;break};case 142:{Oa=ha+1|0;if((Oa-F|0)!=513){_c=ka;$c=Oa;ad=d[ha]|0;wa=341;break c}_c=ka;$c=ha+ -255|0;ad=d[ha+ -256|0]|0;wa=341;break};case 13:{Oa=ca>>>8&1|da>>>3|ga&-164|(ea>>>4|ea)&128;Na=ha+ -1|0;a[Na]=(ea&255)<<24>>24==0?Oa|2:Oa;xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=(Na-F|0)==256?ha+255|0:Na;Fa=ia;Ga=ja;break};case 45:{Na=ha+ -1|0;a[Na]=ba;xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=(Na-F|0)==256?ha+255|0:Na;Fa=ia;Ga=ja;break};case 77:{Na=ha+ -1|0;a[Na]=ia;xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=(Na-F|0)==256?ha+255|0:Na;Fa=ia;Ga=ja;break};case 109:{Na=ha+ -1|0;a[Na]=ja;xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=(Na-F|0)==256?ha+255|0:Na;Fa=ia;Ga=ja;break};case 174:{Na=ha+1|0;if((Na-F|0)!=513){xa=d[ha]|0;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=Na;Fa=ia;Ga=ja;break c}xa=d[ha+ -256|0]|0;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha+ -255|0;Fa=ia;Ga=ja;break};case 206:{Na=ha+1|0;if((Na-F|0)!=513){xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=Na;Fa=d[ha]|0;Ga=ja;break c}xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha+ -255|0;Fa=d[ha+ -256|0]|0;Ga=ja;break};case 238:{Na=ha+1|0;if((Na-F|0)!=513){xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=Na;Fa=ia;Ga=d[ha]|0;break c}xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha+ -255|0;Fa=ia;Ga=d[ha+ -256|0]|0;break};case 242:case 210:case 178:case 146:case 114:case 82:case 50:case 18:case 226:case 194:case 162:case 130:case 98:case 66:case 34:case 2:{Na=1<<($>>>5);Oa=ma|da;Ra(b,(Sa(b,Oa,_+ -1|0)|0)&~Na|(($&16|0)==0?Na:0),Oa,_);na=ba;oa=ca;pa=ea;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6;break};case 78:case 14:{Oa=d[fa+2|0]<<8|ma;Na=Sa(b,Oa,_+ -2|0)|0;Ra(b,Na&~ba|(aa<<24>>24==14?ba:0),Oa,_);xa=ba;ya=ca;za=da;Aa=ba-Na&255;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 74:{Na=d[fa+2|0]|0;xa=ba;ya=ca&256&(Sa(b,Na<<8&7936|ma,_)|0)>>>(Na>>>5)<<8;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 106:{Na=d[fa+2|0]|0;xa=ba;ya=(((Sa(b,Na<<8&7936|ma,_)|0)>>>(Na>>>5)<<8|-257)^256)&ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 10:{Na=d[fa+2|0]|0;xa=ba;ya=(Sa(b,Na<<8&7936|ma,_+ -1|0)|0)>>>(Na>>>5)<<8&256|ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 42:{Na=d[fa+2|0]|0;xa=ba;ya=((Sa(b,Na<<8&7936|ma,_+ -1|0)|0)>>>(Na>>>5)<<8|-257)^256|ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 138:{Na=d[fa+2|0]|0;xa=ba;ya=(Sa(b,Na<<8&7936|ma,_+ -1|0)|0)>>>(Na>>>5)<<8&256^ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 234:{Na=d[fa+2|0]|0;Oa=Na<<8&7936|ma;Ra(b,1<<(Na>>>5)^(Sa(b,Oa,_+ -1|0)|0),Oa,_);xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 202:{Oa=d[fa+2|0]|0;Na=Oa<<8&7936|ma;Ua=Oa>>>5;Ra(b,((Sa(b,Na,_+ -2|0)|0)&~(1<<Ua)|(ca>>>8&1)<<Ua)+8192|0,Na,_);xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 96:{xa=ba;ya=0;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 170:{Na=d[fa+2|0]|0;xa=ba;ya=(Sa(b,Na<<8&7936|ma,_)|0)>>>(Na>>>5)<<8&256;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 128:{xa=ba;ya=-1;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 237:{xa=ba;ya=ca^256;za=da;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 224:{xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga&-73;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 32:{xa=ba;ya=ca;za=0;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 64:{xa=ba;ya=ca;za=256;Aa=ea;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 160:{xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga|4;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 192:{xa=ba;ya=ca;za=da;Aa=ea;Ba=ka;Ca=ga&-5;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 255:{Na=ka-F+ -1|0;if(!(Na>>>0>65535)){wa=372;break b}xa=ba;ya=ca;za=da;Aa=ea;Ba=b+(Na&65535)+2412|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break};case 239:{wa=372;break b;break};default:{wa=373;break b}}}while(0);do{if((wa|0)==48){wa=0;la=fa+3|0;Na=d[fa+2|0]|da;Ua=$a&255;a[b+Na+2412|0]=Ua;Oa=Na+ -240|0;if(!(Oa>>>0<16)){xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}a[b+Oa+1636|0]=Ua;if((-788594688<<Oa|0)>=0){xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}if((Oa|0)!=3){Qa(b,$a,_,Oa);xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}Oa=_-(c[j>>2]|0)|0;if((Oa|0)<=0){wa=52;break b}c[j>>2]=_;gb(R,Oa);Oa=a[Q]|0;if(!(Oa<<24>>24>-1)){xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}Na=Oa&255;a[b+Na|0]=Ua;Oa=Na&15;if((Oa|0)==8){a[S]=Ua;xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}else if((Oa|0)==9){a[T]=Ua;xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}else if((Oa|0)==12){if((Na|0)==76){c[U>>2]=$a&255;xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}else if((Na|0)==124){a[V]=0;a[W]=0;xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}}else{xa=ba;ya=ca;za=da;Aa=ea;Ba=la;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja;break}}else if((wa|0)==79){wa=0;la=fa+2|0;ab=(d[la]<<8)+cb|0;bb=la;wa=81}else if((wa|0)==84){wa=0;la=db|da;Na=la+ -253|0;if(!(Na>>>0<3)){Oa=d[b+la+2412|0]|0;Ua=la+ -240|0;if(!(Ua>>>0<16)){na=ba;oa=ca;pa=Oa;qa=ka;ra=ga;sa=_;ta=Oa;ua=ja;wa=6;break}Oa=d[b+Ua+1652|0]|0;Ua=la+ -242|0;if(!(Ua>>>0<2)){na=ba;oa=ca;pa=Oa;qa=ka;ra=ga;sa=_;ta=Oa;ua=ja;wa=6;break}Oa=d[Q]|0;if((Ua|0)!=1){na=ba;oa=ca;pa=Oa;qa=ka;ra=ga;sa=_;ta=Oa;ua=ja;wa=6;break}Oa=_-(c[j>>2]|0)|0;if((Oa|0)<=0){wa=95;break b}c[j>>2]=_;gb(R,Oa);Oa=d[b+(a[Q]&127)|0]|0;na=ba;oa=ca;pa=Oa;qa=ka;ra=ga;sa=_;ta=Oa;ua=ja;wa=6;break}Oa=b+(Na*24|0)+1564|0;Ua=c[Oa>>2]|0;do{if((_|0)>=(Ua|0)){la=c[b+(Na*24|0)+1568>>2]|0;La=(_-Ua|0)/(la|0)|0;Ta=La+1|0;c[Oa>>2]=(Z(Ta,la)|0)+Ua;if((c[b+(Na*24|0)+1580>>2]|0)==0){break}la=c[b+(Na*24|0)+1572>>2]|0;Ja=b+(Na*24|0)+1576|0;Pa=c[Ja>>2]|0;Wa=La-(la+255-Pa&255)|0;if((Wa|0)>-1){La=(Wa|0)/(la|0)|0;Ha=b+(Na*24|0)+1584|0;c[Ha>>2]=La+1+(c[Ha>>2]|0)&15;bd=Wa-(Z(La,la)|0)|0}else{bd=Pa+Ta|0}c[Ja>>2]=bd&255}}while(0);Ua=b+(Na*24|0)+1584|0;Oa=c[Ua>>2]|0;c[Ua>>2]=0;na=ba;oa=ca;pa=Oa;qa=ka;ra=ga;sa=_;ta=Oa;ua=ja;wa=6}else if((wa|0)==98){wa=0;na=ba;oa=ca;pa=eb;qa=fb;ra=ga;sa=_;ta=eb;ua=ja;wa=6}else if((wa|0)==100){wa=0;Oa=fa+2|0;Ua=hb|da;Ka=Ua+ -253|0;if(!(Ka>>>0<3)){Ia=d[b+Ua+2412|0]|0;Ja=Ua+ -240|0;if(!(Ja>>>0<16)){xa=ba;ya=ca;za=da;Aa=Ia;Ba=Oa;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ia;break}Ia=d[b+Ja+1652|0]|0;Ja=Ua+ -242|0;if(!(Ja>>>0<2)){xa=ba;ya=ca;za=da;Aa=Ia;Ba=Oa;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ia;break}Ia=d[Q]|0;if((Ja|0)!=1){xa=ba;ya=ca;za=da;Aa=Ia;Ba=Oa;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ia;break}Ia=_-(c[j>>2]|0)|0;if((Ia|0)<=0){wa=111;break b}c[j>>2]=_;gb(R,Ia);Ia=d[b+(a[Q]&127)|0]|0;xa=ba;ya=ca;za=da;Aa=Ia;Ba=Oa;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ia;break}Ia=b+(Ka*24|0)+1564|0;Ja=c[Ia>>2]|0;do{if((_|0)>=(Ja|0)){Ua=c[b+(Ka*24|0)+1568>>2]|0;Ta=(_-Ja|0)/(Ua|0)|0;Pa=Ta+1|0;c[Ia>>2]=(Z(Pa,Ua)|0)+Ja;if((c[b+(Ka*24|0)+1580>>2]|0)==0){break}Ua=c[b+(Ka*24|0)+1572>>2]|0;la=b+(Ka*24|0)+1576|0;La=c[la>>2]|0;Wa=Ta-(Ua+255-La&255)|0;if((Wa|0)>-1){Ta=(Wa|0)/(Ua|0)|0;Ha=b+(Ka*24|0)+1584|0;c[Ha>>2]=Ta+1+(c[Ha>>2]|0)&15;cd=Wa-(Z(Ta,Ua)|0)|0}else{cd=La+Pa|0}c[la>>2]=cd&255}}while(0);Ja=b+(Ka*24|0)+1584|0;Ia=c[Ja>>2]|0;c[Ja>>2]=0;xa=ba;ya=ca;za=da;Aa=Ia;Ba=Oa;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=Ia}else if((wa|0)==132){wa=0;Ia=fa+2|0;jb=(d[Ia]<<8)+lb|0;kb=Ia;wa=134}else if((wa|0)==136){wa=0;Ra(b,mb,d[fa+2|0]<<8|ma,_);xa=ba;ya=ca;za=da;Aa=ea;Ba=fa+3|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==138){wa=0;Ra(b,ia,nb|da,_);na=ba;oa=ca;pa=ea;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==140){wa=0;Ra(b,ja,ob|da,_);na=ba;oa=ca;pa=ea;qa=ka;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==153){wa=0;Ia=fa+2|0;pb=(d[Ia]<<8)+rb|0;qb=Ia;wa=156}else if((wa|0)==155){wa=0;pb=sb|da;qb=ka;wa=156}else if((wa|0)==160){wa=0;vb=d[fa+2|0]|da;wb=yb;xb=fa+3|0;wa=161}else if((wa|0)==167){wa=0;Ia=fa+2|0;zb=(d[Ia]<<8)+Bb|0;Ab=Ia;wa=170}else if((wa|0)==169){wa=0;zb=Cb|da;Ab=ka;wa=170}else if((wa|0)==174){wa=0;Fb=d[fa+2|0]|da;Gb=Ib;Hb=fa+3|0;wa=175}else if((wa|0)==181){wa=0;Ia=fa+2|0;Jb=(d[Ia]<<8)+Lb|0;Kb=Ia;wa=184}else if((wa|0)==183){wa=0;Jb=Mb|da;Kb=ka;wa=184}else if((wa|0)==188){wa=0;Pb=d[fa+2|0]|da;Qb=Sb;Rb=fa+3|0;wa=189}else if((wa|0)==195){wa=0;Ia=fa+2|0;Tb=(d[Ia]<<8)+Vb|0;Ub=Ia;wa=198}else if((wa|0)==197){wa=0;Tb=Wb|da;Ub=ka;wa=198}else if((wa|0)==202){wa=0;Ia=fa+2|0;Ja=(Sa(b,d[Ia]|da,_+ -1|0)|0)-Zb|0;na=ba;oa=~Ja;pa=Ja&255;qa=Ia;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==205){wa=0;ac=Sa(b,_b,_)|0;bc=$b;wa=206}else if((wa|0)==209){wa=0;ec=Sa(b,cc,_)|0;fc=dc;wa=210}else if((wa|0)==213){wa=0;Ia=fa+2|0;gc=d[Ia]|da;hc=jc;ic=Ia;wa=214}else if((wa|0)==220){wa=0;Ia=fa+2|0;kc=(d[Ia]<<8)+mc|0;lc=Ia;wa=223}else if((wa|0)==222){wa=0;kc=nc|da;lc=ka;wa=223}else if((wa|0)==234){wa=0;tc=sc|da;uc=ka;wa=236}else if((wa|0)==238){wa=0;Ia=vc>>>1&128|ba>>1;xa=Ia;ya=ba<<8;za=da;Aa=Ia;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==240){wa=0;Ia=ba<<1;Ja=wc>>>8&1|Ia;xa=Ja&255;ya=Ia;za=da;Aa=Ja;Ba=ka;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==243){wa=0;Bc=Ac;Cc=ma+ia&255;wa=244}else if((wa|0)==246){wa=0;Ja=fa+2|0;xc=Dc;yc=d[Ja]<<8|ma;zc=Ja;wa=247}else if((wa|0)==250){wa=0;Ic=Hc;Jc=ma+ia&255;wa=251}else if((wa|0)==253){wa=0;Ja=fa+2|0;Ec=Kc;Fc=d[Ja]<<8|ma;Gc=Ja;wa=254}else if((wa|0)==306){wa=0;Ja=_+ -4|0;Ia=Wc|da;Na=Ia+ -253|0;do{if(Na>>>0<3){la=b+(Na*24|0)+1564|0;Pa=c[la>>2]|0;do{if((Ja|0)>=(Pa|0)){La=c[b+(Na*24|0)+1568>>2]|0;Ua=(Ja-Pa|0)/(La|0)|0;Ta=Ua+1|0;c[la>>2]=(Z(Ta,La)|0)+Pa;if((c[b+(Na*24|0)+1580>>2]|0)==0){break}La=c[b+(Na*24|0)+1572>>2]|0;Wa=b+(Na*24|0)+1576|0;Ha=c[Wa>>2]|0;Ma=Ua-(La+255-Ha&255)|0;if((Ma|0)>-1){Ua=(Ma|0)/(La|0)|0;Xa=b+(Na*24|0)+1584|0;c[Xa>>2]=Ua+1+(c[Xa>>2]|0)&15;dd=Ma-(Z(Ua,La)|0)|0}else{dd=Ha+Ta|0}c[Wa>>2]=dd&255}}while(0);Pa=b+(Na*24|0)+1584|0;la=c[Pa>>2]|0;c[Pa>>2]=0;ed=la}else{la=Ia+ -240|0;if(!(la>>>0<16)){ed=d[b+Ia+2412|0]|0;break}Pa=Ia+ -242|0;if(!(Pa>>>0<2)){ed=d[b+la+1652|0]|0;break}if((Pa|0)!=1){ed=d[Q]|0;break}Pa=Ja-(c[j>>2]|0)|0;if((Pa|0)<=0){wa=317;break b}c[j>>2]=Ja;gb(R,Pa);ed=d[b+(a[Q]&127)|0]|0}}while(0);Ja=fa+2|0;if((ed|0)!=(ba|0)){Vc=Ja;wa=5;break}na=ba;oa=ca;pa=ea;qa=Ja;ra=ga;sa=_+ -2|0;ta=ia;ua=ja;wa=6}else if((wa|0)==327){wa=0;xa=ba;ya=ca;za=da;Aa=ea;Ba=b+(d[Yc+1|0]<<8|Xc&255)+2412|0;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==341){wa=0;xa=ba;ya=ad<<8;za=ad<<3&256;Aa=(ad<<4&2048|ad&2)^2;Ba=_c;Ca=ad;Da=_;Ea=$c;Fa=ia;Ga=ja}}while(0);if((wa|0)==5){wa=0;na=ba;oa=ca;pa=ea;qa=Vc+(a[Vc]|0)|0;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==81){wa=0;ma=Sa(b,ab,_)|0;na=ma;oa=ca;pa=ma;qa=bb;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==134){wa=0;Ra(b,ba,jb,_);na=ba;oa=ca;pa=ea;qa=kb;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==156){wa=0;tb=Sa(b,pb,_)|0;ub=qb;wa=157}else if((wa|0)==161){wa=0;ma=(Sa(b,vb,_+ -1|0)|0)&wb;Ra(b,ma,vb,_);xa=ba;ya=ca;za=da;Aa=ma;Ba=xb;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==170){wa=0;Db=Sa(b,zb,_)|0;Eb=Ab;wa=171}else if((wa|0)==175){wa=0;ma=Sa(b,Fb,_+ -1|0)|0|Gb;Ra(b,ma,Fb,_);xa=ba;ya=ca;za=da;Aa=ma;Ba=Hb;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==184){wa=0;Nb=Sa(b,Jb,_)|0;Ob=Kb;wa=185}else if((wa|0)==189){wa=0;ma=(Sa(b,Pb,_+ -1|0)|0)^Qb;Ra(b,ma,Pb,_);xa=ba;ya=ca;za=da;Aa=ma;Ba=Rb;Ca=ga;Da=_;Ea=ha;Fa=ia;Ga=ja}else if((wa|0)==198){wa=0;Xb=Sa(b,Tb,_)|0;Yb=Ub;wa=199}else if((wa|0)==206){wa=0;ma=ia-ac|0;na=ba;oa=~ma;pa=ma&255;qa=bc;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==210){wa=0;ma=ja-ec|0;na=ba;oa=~ma;pa=ma&255;qa=fc;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==214){wa=0;oc=gc;pc=hc;qc=Sa(b,gc,_+ -1|0)|0;rc=ic;wa=224}else if((wa|0)==223){wa=0;oc=-1;pc=Sa(b,kc,_)|0;qc=ba;rc=lc;wa=224}else if((wa|0)==236){wa=0;ma=($>>>4&2)+ -1+(Sa(b,tc,_+ -1|0)|0)|0;Ra(b,ma,tc,_);na=ba;oa=ca;pa=ma;qa=uc;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==244){wa=0;xc=Bc;yc=Cc|da;zc=ka;wa=247}else if((wa|0)==251){wa=0;Ec=Ic;Fc=Jc|da;Gc=ka;wa=254}do{if((wa|0)==157){wa=0;ma=tb&ba;na=ma;oa=ca;pa=ma;qa=ub;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==171){wa=0;ma=Db|ba;na=ma;oa=ca;pa=ma;qa=Eb;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==185){wa=0;ma=Nb^ba;na=ma;oa=ca;pa=ma;qa=Ob;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==199){wa=0;ma=ba-Xb|0;na=ba;oa=~ma;pa=ma&255;qa=Yb;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==224){wa=0;ma=(aa&255)>159?pc^255:pc;Ja=qc+(ca>>>8&1)+ma|0;Ia=ma^qc^Ja;ma=Ia>>>1&8|ga&-73|(Ia+128|0)>>>2&64;if((oc|0)<0){na=Ja&255;oa=Ja;pa=Ja;qa=rc;ra=ma;sa=_;ta=ia;ua=ja;wa=6;break}else{Ra(b,Ja,oc,_);na=ba;oa=Ja;pa=Ja;qa=rc;ra=ma;sa=_;ta=ia;ua=ja;wa=6;break}}else if((wa|0)==247){wa=0;ma=(Sa(b,yc,_+ -1|0)|0)<<1;Ja=ma|xc>>>8&1;Ra(b,Ja,yc,_);na=ba;oa=ma;pa=Ja;qa=zc;ra=ga;sa=_;ta=ia;ua=ja;wa=6}else if((wa|0)==254){wa=0;Ja=Sa(b,Fc,_+ -1|0)|0;ma=Ja>>1|Ec>>>1&128;Ra(b,ma,Fc,_);na=ba;oa=Ja<<8;pa=ma;qa=Gc;ra=ga;sa=_;ta=ia;ua=ja;wa=6}}while(0);if((wa|0)==6){wa=0;xa=na;ya=oa;za=da;Aa=pa;Ba=qa+1|0;Ca=ra;Da=sa;Ea=ha;Fa=ta;Ga=ua}ka=a[Ba]|0;ma=ka&255;Ja=(d[b+ma+1900|0]|0)+Da|0;if((Ja|0)>0){G=xa;H=ya;I=za;J=Aa;K=Ba;L=Ca;M=Da;N=Ea;O=Fa;P=Ga;break a}else{_=Ja;$=ma;aa=ka;ba=xa;ca=ya;da=za;ea=Aa;fa=Ba;ga=Ca;ha=Ea;ia=Fa;ja=Ga}}if((wa|0)==32){va(8,24,143,56)}else if((wa|0)==45){va(8,24,143,56)}else if((wa|0)==52){va(8,24,156,320)}else if((wa|0)==64){va(8,24,156,320)}else if((wa|0)==95){va(8,24,143,56)}else if((wa|0)==111){va(8,24,143,56)}else if((wa|0)==124){va(8,24,143,56)}else if((wa|0)==317){va(8,24,143,56)}else if((wa|0)==372){c[b+1716>>2]=264;G=ba;H=ca;I=da;J=ea;K=fa;L=ga;M=0;N=ha;O=ia;P=ja;break}else if((wa|0)==373){va(288,216,1200,248)}}}while(0);c[t>>2]=K-F&65535;c[v>>2]=N+ -257-F&255;c[n>>2]=G&255;c[p>>2]=O&255;c[r>>2]=P&255;P=H>>>8&1|I>>>3|L&-164|(J>>>4|J)&128;c[x>>2]=((J&255)<<24>>24==0?P|2:P)&255;P=(c[g>>2]|0)+M|0;c[g>>2]=P;c[j>>2]=(c[j>>2]|0)-M;c[k>>2]=(c[k>>2]|0)-M;c[l>>2]=(c[l>>2]|0)-M;c[m>>2]=(c[m>>2]|0)-M;if((P|0)>(e|0)){va(296,216,1220,248)}else{i=f;return b+1640|0}return 0}function Va(b){b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;d=i;Db(b+1564|0,0,66640)|0;e=b;f=b+2412|0;hb(e,f);c[b+1704>>2]=256;a[b+1834|0]=-1;a[b+1835|0]=-64;g=0;do{h=a[336+g|0]|0;j=g<<1;a[b+j+1900|0]=(h&255)>>>4;a[b+(j|1)+1900|0]=h&15;g=g+1|0;}while((g|0)!=128);Db(f|0,-1,65536)|0;c[b+1768>>2]=0;f=b+2156|0;g=b+2652|0;h=b+1636|0;j=h+0|0;k=g+0|0;l=j+16|0;do{a[j]=a[k]|0;j=j+1|0;k=k+1|0}while((j|0)<(l|0));m=b+1652|0;j=m+0|0;k=g+0|0;l=j+12|0;do{a[j]=a[k]|0;j=j+1|0;k=k+1|0}while((j|0)<(l|0));a[m]=0;a[b+1653|0]=0;a[b+1662|0]=0;a[b+1663|0]=0;a[b+1664|0]=0;Db(f|0,-1,256)|0;Db(b+67948|0,-1,256)|0;f=b+1665|0;a[f+0|0]=15;a[f+1|0]=15;a[f+2|0]=15;f=b+1668|0;m=f;c[m+0>>2]=0;c[m+4>>2]=0;c[m+8>>2]=0;c[m+12>>2]=0;c[m+16>>2]=0;c[m+20>>2]=0;c[f>>2]=65472;a[h]=10;a[b+1637|0]=-80;h=b+1656|0;a[h]=0;a[h+1|0]=0;a[h+2|0]=0;a[h+3|0]=0;Wa(b);ib(e);i=d;return 0}function Wa(e){e=e|0;var f=0,g=0,h=0,j=0;f=i;c[e+1716>>2]=0;a[e+1700|0]=0;c[e+1696>>2]=0;c[e+1692>>2]=0;c[e+1564>>2]=1;c[e+1576>>2]=0;c[e+1588>>2]=1;c[e+1600>>2]=0;c[e+1612>>2]=1;c[e+1624>>2]=0;g=e+1637|0;Pa(e,a[g]&128);c[e+1572>>2]=((d[e+1646|0]|0)+255&255)+1;h=d[g]|0;c[e+1580>>2]=h&1;c[e+1584>>2]=a[e+1665|0]&15;c[e+1596>>2]=((d[e+1647|0]|0)+255&255)+1;c[e+1604>>2]=h>>>1&1;c[e+1608>>2]=a[e+1666|0]&15;c[e+1620>>2]=((d[e+1648|0]|0)+255&255)+1;c[e+1628>>2]=h>>>2&1;c[e+1632>>2]=a[e+1667|0]&15;h=c[e+1704>>2]|0;g=(h|0)==0?1:h;h=((g>>1)+4096|0)/(g|0)|0;g=(h|0)<4?4:h;c[e+1616>>2]=g;h=g<<3;c[e+1592>>2]=h;c[e+1568>>2]=h;c[e+1720>>2]=0;h=e+1752|0;g=e+1736|0;while(1){j=g+2|0;b[g>>1]=0;if(j>>>0<h>>>0){g=j}else{break}}c[e+1732>>2]=j;c[e+1724>>2]=0;ab(e,0,0);i=f;return}function Xa(b,e,f){b=b|0;e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0;g=i;if((f|0)<35){h=504;i=g;return h|0}if((Bb(e,464,27)|0)!=0){h=504;i=g;return h|0}if((f|0)<65920){h=520;i=g;return h|0}c[b+1668>>2]=(d[e+38|0]|0)<<8|(d[e+37|0]|0);c[b+1672>>2]=d[e+39|0]|0;c[b+1676>>2]=d[e+40|0]|0;c[b+1680>>2]=d[e+41|0]|0;c[b+1684>>2]=d[e+42|0]|0;c[b+1688>>2]=d[e+43|0]|0;Fb(b+2412|0,e+256|0,65536)|0;c[b+1768>>2]=0;f=b+2156|0;j=b+2652|0;k=b+1636|0;l=j+0|0;m=k+16|0;do{a[k]=a[l]|0;k=k+1|0;l=l+1|0}while((k|0)<(m|0));n=b+1652|0;k=n+0|0;l=j+0|0;m=k+16|0;do{a[k]=a[l]|0;k=k+1|0;l=l+1|0}while((k|0)<(m|0));a[n]=0;a[b+1653|0]=0;a[b+1662|0]=0;a[b+1663|0]=0;a[b+1664|0]=0;Db(f|0,-1,256)|0;Db(b+67948|0,-1,256)|0;jb(b,e+65792|0);Wa(b);h=0;i=g;return h|0}function Ya(b){b=b|0;var c=0,e=0,f=0;c=i;if(!((a[b+108|0]&32)==0)){i=c;return}e=(d[b+109|0]|0)<<8;f=((d[b+125|0]|0)<<11&30720)+e|0;Db(b+e+2412|0,-1,((f|0)>65536?65536:f)-e|0)|0;i=c;return}function Za(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;f=i;if((e&1|0)!=0){va(544,560,279,600)}g=a+1720|0;c[g>>2]=c[g>>2]&31;if((d|0)==0){g=a+1752|0;h=a+1736|0;while(1){j=h+2|0;b[h>>1]=0;if(j>>>0<g>>>0){h=j}else{break}}c[a+1732>>2]=j;c[a+1724>>2]=0;ab(a,0,0);i=f;return}j=d+(e<<1)|0;c[a+1724>>2]=d;c[a+1728>>2]=j;h=a+1736|0;g=c[a+1732>>2]|0;k=(e|0)>0;if(h>>>0<g>>>0&k){e=d;l=h;while(1){m=l+2|0;n=e+2|0;b[e>>1]=b[l>>1]|0;o=n>>>0<j>>>0;if(m>>>0<g>>>0&o){l=m;e=n}else{p=n;q=o;r=m;break}}}else{p=d;q=k;r=h}do{if(q){s=p;t=j}else{h=a+1532|0;k=a+1564|0;if(r>>>0<g>>>0){u=h;v=r}else{s=h;t=k;break}while(1){h=v+2|0;w=u+2|0;b[u>>1]=b[v>>1]|0;if(h>>>0<g>>>0){v=h;u=w}else{break}}if(!(w>>>0>k>>>0)){s=w;t=k;break}va(616,560,303,600)}}while(0);ab(a,s,t-s>>1);i=f;return}function _a(a){a=a|0;var d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0;d=i;e=c[a+1728>>2]|0;f=c[a+1520>>2]|0;g=c[a+1724>>2]|0;h=g>>>0>f>>>0|f>>>0>e>>>0;j=a+1532|0;k=h?e:f;e=h?f:j;f=a+1736|0;h=g+(c[a+1720>>2]>>5<<1<<1)|0;if(h>>>0<k>>>0){g=h;h=f;while(1){l=h+2|0;b[h>>1]=b[g>>1]|0;m=g+2|0;if(m>>>0<k>>>0){h=l;g=m}else{n=l;break}}}else{n=f}if(j>>>0<e>>>0){f=j;j=n;while(1){g=j+2|0;b[j>>1]=b[f>>1]|0;h=f+2|0;if(h>>>0<e>>>0){j=g;f=h}else{o=g;break}}}else{o=n}c[a+1732>>2]=o;if(o>>>0>(a+1768|0)>>>0){va(632,560,334,672)}else{i=d;return}}function $a(a,b,d){a=a|0;b=b|0;d=d|0;var e=0;e=i;if((b&1|0)!=0){va(688,560,338,712)}if((b|0)!=0){Za(a,d,b);Ta(a,b<<4)}b=a+1716|0;a=c[b>>2]|0;c[b>>2]=0;i=e;return a|0}function ab(a,b,d){a=a|0;b=b|0;d=d|0;var e=0,f=0;if((d&1|0)==0){e=(b|0)==0;f=e?a+1532|0:b;c[a+1528>>2]=f;c[a+1520>>2]=f;c[a+1524>>2]=f+((e?16:d)<<1);i=i;return}else{va(720,736,77,768)}}function bb(d,e){d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0;f=i;g=e+116|0;if((c[g>>2]&c[d+300>>2]|0)!=0){h=d+352|0;j=c[h>>2]|0;c[h>>2]=((Z(c[d+356>>2]>>5,j)|0)>>10)+j}j=e+120|0;h=c[j>>2]|0;if((h|0)==0){k=e+100|0}else if((h|0)==5){c[e+104>>2]=c[d+320>>2];c[e+108>>2]=1;c[e+96>>2]=0;c[d+328>>2]=0;a[d+288|0]=1;l=c[j>>2]|0;m=6}else{l=h;m=6}if((m|0)==6){c[e+128>>2]=0;c[e+132>>2]=0;h=e+100|0;c[h>>2]=0;n=l+ -1|0;c[j>>2]=n;if((n&3|0)!=0){c[h>>2]=16384}c[d+352>>2]=0;k=h}h=c[k>>2]|0;k=h>>>4&255;n=k^255;l=(h>>12)+(c[e+96>>2]|0)|0;h=(Z(b[1384+(n<<1)>>1]|0,c[e+(l<<2)>>2]|0)|0)>>>11;o=((Z(b[1384+((n|256)<<1)>>1]|0,c[e+(l+1<<2)>>2]|0)|0)>>>11)+h|0;h=o+((Z(b[1384+((k|256)<<1)>>1]|0,c[e+(l+2<<2)>>2]|0)|0)>>>11)<<16>>16;o=h+((Z(b[1384+(k<<1)>>1]|0,c[e+(l+3<<2)>>2]|0)|0)>>11)|0;if((o<<16>>16|0)==(o|0)){p=o}else{p=o>>31^32767}if((c[g>>2]&c[d+304>>2]|0)==0){q=p&-2}else{q=c[d+268>>2]<<17>>16}p=e+128|0;c[d+356>>2]=(Z(c[p>>2]|0,q)|0)>>11&-2;a[e+136|0]=(c[p>>2]|0)>>>4;if((a[d+108|0]|0)<0){m=15}else{if((c[d+328>>2]&3|0)==1){m=15}}if((m|0)==15){c[e+124>>2]=0;c[p>>2]=0}do{if((c[d+260>>2]|0)!=0){p=c[g>>2]|0;if((p&c[d+316>>2]|0)!=0){c[e+124>>2]=0}if((p&c[d+264>>2]|0)==0){break}c[j>>2]=5;c[e+124>>2]=1}}while(0);if((c[j>>2]|0)!=0){i=f;return}cb(d,e);i=f;return}function cb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0;f=i;g=e+128|0;h=c[g>>2]|0;j=e+124|0;k=c[j>>2]|0;if((k|0)==0){l=h+ -8|0;c[g>>2]=(l|0)<0?0:l;i=f;return}l=c[e+112>>2]|0;m=d[l+6|0]|0;n=c[b+324>>2]|0;do{if((n&128|0)==0){o=a[l+7|0]|0;p=o&255;q=p>>>5;if(o<<24>>24>-1){r=p<<4;s=p;t=31;break}u=p&31;if((q|0)==4){r=h+ -32|0;s=p;t=u;break}if((o&255)<192){o=h+ -1|0;r=o-(o>>8)|0;s=p;t=u;break}o=h+32|0;if((q|0)!=7){r=o;s=p;t=u;break}r=(c[e+132>>2]|0)>>>0>1535?h+8|0:o;s=p;t=u}else{if((k|0)<=1){u=n<<1&30|1;r=((u|0)!=31?32:1024)+h|0;s=m;t=u;break}u=h+ -1|0;p=u-(u>>8)|0;if((k|0)!=2){r=p;s=m;t=m&31;break}r=p;s=m;t=n>>>3&14|16}}while(0);if((r>>8|0)==(s>>>5|0)&(k|0)==2){c[j>>2]=3;v=3}else{v=k}c[e+132>>2]=r;do{if(r>>>0>2047){e=(r>>31&-2047)+2047|0;if((v|0)!=1){w=e;break}c[j>>2]=2;w=e}else{w=r}}while(0);if(((((c[1128+(t<<2)>>2]|0)+(c[b+272>>2]|0)|0)>>>0)%((c[1256+(t<<2)>>2]|0)>>>0)|0|0)!=0){i=f;return}c[g>>2]=w;i=f;return}function db(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;f=b+360|0;c[f>>2]=0;g=d+100|0;do{if((c[g>>2]|0)>16383){eb(b,d);h=d+108|0;j=(c[h>>2]|0)+2|0;c[h>>2]=j;if((j|0)<=8){break}if((j|0)!=9){va(784,736,512,816)}j=d+104|0;c[j>>2]=(c[j>>2]|0)+9&65535;if((c[b+328>>2]&1|0)!=0){c[j>>2]=c[b+320>>2];c[f>>2]=c[d+116>>2]}c[h>>2]=1}}while(0);f=(c[g>>2]&16383)+(c[b+352>>2]|0)|0;c[g>>2]=(f|0)>32767?32767:f;f=(Z(a[c[d+112>>2]|0]|0,c[b+356>>2]|0)|0)>>7;g=b+368|0;h=f+(c[g>>2]|0)|0;if((h<<16>>16|0)==(h|0)){k=h}else{k=h>>31^32767}c[g>>2]=k;if((c[d+116>>2]&c[b+308>>2]|0)==0){i=e;return}d=b+376|0;b=(c[d>>2]|0)+f|0;c[d>>2]=b;if((b<<16>>16|0)==(b|0)){i=e;return}c[d>>2]=b>>31^32767;i=e;return}function eb(a,b){a=a|0;b=b|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;e=i;f=d[(c[a+1512>>2]|0)+((c[b+104>>2]|0)+1+(c[b+108>>2]|0)&65535)|0]|0|c[a+332>>2]<<8;g=c[a+328>>2]|0;a=b+96|0;h=c[a>>2]|0;j=b+(h<<2)|0;k=h+4|0;c[a>>2]=(k|0)>11?0:k;a=b+(k<<2)|0;if((h|0)>=2147483644){i=e;return}h=g>>4;k=g&12;g=k>>>0>7;b=(k|0)==8;l=(k|0)==0;if((h|0)>12){k=f;m=j;while(1){n=k<<16>>28<<h>>26<<11;o=c[m+44>>2]|0;p=c[m+40>>2]|0;q=p>>1;do{if(g){r=o+n-q|0;if(b){s=((Z(o,-3)|0)>>6)+(p>>5)+r|0;break}else{s=r+((Z(o,-13)|0)>>7)+(q*3>>4)|0;break}}else{if(l){s=n;break}s=(o>>1)+n+(0-o>>5)|0}}while(0);if((s<<16>>16|0)==(s|0)){t=s}else{t=s>>31^32767}o=t<<17>>16;c[m>>2]=o;c[m+48>>2]=o;o=m+4|0;if(o>>>0<a>>>0){k=k<<4;m=o}else{break}}i=e;return}if(g){u=f;v=j}else{g=f;f=j;while(1){j=g<<16>>28<<h>>1;m=c[f+44>>2]|0;if(l){w=j}else{w=(m>>1)+j+(0-m>>5)|0}if((w<<16>>16|0)==(w|0)){x=w}else{x=w>>31^32767}m=x<<17>>16;c[f>>2]=m;c[f+48>>2]=m;m=f+4|0;if(m>>>0<a>>>0){g=g<<4;f=m}else{break}}i=e;return}while(1){f=c[v+44>>2]|0;g=c[v+40>>2]|0;x=g>>1;w=f+(u<<16>>28<<h>>1)-x|0;if(b){y=((Z(f,-3)|0)>>6)+(g>>5)+w|0}else{y=w+((Z(f,-13)|0)>>7)+(x*3>>4)|0}if((y<<16>>16|0)==(y|0)){z=y}else{z=y>>31^32767}x=z<<17>>16;c[v>>2]=x;c[v+48>>2]=x;x=v+4|0;if(x>>>0<a>>>0){u=u<<4;v=x}else{break}}i=e;return}function fb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0;f=i;a[(c[e+112>>2]|0)+9|0]=a[b+298|0]|0;g=(Z(a[(c[e+252>>2]|0)+1|0]|0,c[b+356>>2]|0)|0)>>7;h=b+372|0;j=g+(c[h>>2]|0)|0;if((j<<16>>16|0)==(j|0)){k=j}else{k=j>>31^32767}c[h>>2]=k;k=e+256|0;do{if((c[k>>2]&c[b+308>>2]|0)!=0){h=b+380|0;j=(c[h>>2]|0)+g|0;c[h>>2]=j;if((j<<16>>16|0)==(j|0)){break}c[h>>2]=j>>31^32767}}while(0);g=d[b+124|0]|c[b+360>>2];if((c[e+260>>2]|0)==5){l=g&~c[k>>2]}else{l=g}a[b+296|0]=l;l=c[b+348>>2]|0;g=c[b+1512>>2]|0;k=(c[e+400>>2]|0)==0?l+2|0:l;c[b+320>>2]=d[g+(k+1)|0]<<8|d[g+k|0];k=c[e+392>>2]|0;c[b+324>>2]=d[k+5|0]|0;c[b+352>>2]=d[k+2|0]|0;i=f;return}function gb(e,f){e=e|0;f=f|0;var g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,_=0,$=0,aa=0,ba=0,ca=0,da=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,ka=0,la=0,ma=0,na=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,wa=0,xa=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0,Ta=0,Ua=0,Va=0,Wa=0,Xa=0,Ya=0,Za=0,_a=0,$a=0,ab=0;g=i;if((f|0)<=0){va(832,736,788,856)}h=e+284|0;j=c[h>>2]|0;c[h>>2]=j+f&31;switch(j|0){case 2:{k=f;l=e+532|0;m=30;break};case 11:{n=f;o=e+297|0;p=e+952|0;m=39;break};case 14:{q=f;r=e+297|0;s=e+1092|0;m=42;break};case 17:{t=f;u=e+1232|0;v=e+297|0;m=45;break};case 20:{w=f;x=e+297|0;y=e+1372|0;m=48;break};case 24:{z=f;A=e+384|0;B=e+388|0;m=59;break};case 25:{C=f;D=e+1484|0;E=e+384|0;F=e+256|0;G=e+388|0;m=60;break};case 28:{H=f;I=e+108|0;m=77;break};case 30:{J=f;K=e+260|0;m=87;break};case 31:{L=f;M=e+392|0;m=95;break};case 1:{N=f;O=c[e+1512>>2]|0;P=c[e+352>>2]|0;Q=c[e+644>>2]|0;R=c[e+356>>2]|0;m=29;break};case 22:{S=f;T=e+356|0;U=e+298|0;V=e+1512|0;W=e+1344|0;X=c[e+352>>2]|0;Y=c[e+504>>2]|0;m=57;break};case 23:{_=f;$=e+297|0;aa=e+364|0;ba=c[e+1512>>2]|0;ca=c[e+388>>2]|0;da=c[e+384>>2]|0;ea=c[e+256>>2]|0;m=58;break};case 26:{fa=f;ga=c[e+384>>2]|0;m=65;break};case 27:{ha=f;ia=c[e+388>>2]|0;ja=c[e+368>>2]|0;m=72;break};case 0:{ka=f;m=21;break};case 3:{la=f;m=31;break};case 4:{ma=f;m=32;break};case 6:{na=f;m=34;break};case 7:{oa=f;m=35;break};case 9:{pa=f;m=37;break};case 10:{qa=f;m=38;break};case 12:{ra=f;m=40;break};case 13:{sa=f;m=41;break};case 15:{ta=f;m=43;break};case 16:{ua=f;m=44;break};case 18:{wa=f;m=46;break};case 19:{xa=f;m=47;break};case 21:{ya=f;m=49;break};case 29:{za=f;m=78;break};case 8:{Aa=f;Ba=e+297|0;Ca=e+812|0;m=36;break};case 5:{Da=f;Ea=e+297|0;Fa=e+672|0;m=33;break};default:{i=g;return}}while(1){if((m|0)==21){m=0;f=c[e+356>>2]|0;j=(Z(a[(c[e+504>>2]|0)+1|0]|0,f)|0)>>7;h=e+372|0;Ga=j+(c[h>>2]|0)|0;if((Ga<<16>>16|0)==(Ga|0)){Ha=Ga}else{Ha=Ga>>31^32767}c[h>>2]=Ha;h=c[e+508>>2]|0;do{if((h&c[e+308>>2]|0)!=0){Ga=e+380|0;Ia=(c[Ga>>2]|0)+j|0;c[Ga>>2]=Ia;if((Ia<<16>>16|0)==(Ia|0)){break}c[Ga>>2]=Ia>>31^32767}}while(0);j=d[e+124|0]|c[e+360>>2];if((c[e+512>>2]|0)==5){Ja=j&~h}else{Ja=j}a[e+296|0]=Ja;j=c[e+348>>2]|0;Ia=c[e+1512>>2]|0;Ga=(c[e+652>>2]|0)==0?j+2|0:j;c[e+320>>2]=d[Ia+(Ga+1)|0]<<8|d[Ia+Ga|0];Ga=c[e+644>>2]|0;c[e+324>>2]=d[Ga+5|0]|0;j=d[Ga+2|0]|0;c[e+352>>2]=j;Ka=ka+ -1|0;if((Ka|0)==0){m=96;break}else{N=Ka;O=Ia;P=j;Q=Ga;R=f;m=29;continue}}else if((m|0)==29){m=0;a[e+298|0]=R>>>8;Ga=e+532|0;c[e+352>>2]=(d[Q+3|0]<<8&16128)+P;j=c[e+636>>2]|0;c[e+332>>2]=d[O+((c[e+640>>2]|0)+j&65535)|0]|0;c[e+328>>2]=d[O+j|0]|0;bb(e,Ga);j=N+ -1|0;if((j|0)==0){m=96;break}else{k=j;l=Ga;m=30;continue}}else if((m|0)==30){m=0;a[e+124|0]=a[e+296|0]|0;a[e+297|0]=a[e+528|0]|0;Ga=e+336|0;c[e+348>>2]=(c[Ga>>2]<<2)+(c[e+312>>2]<<8);c[Ga>>2]=d[(c[e+924>>2]|0)+4|0]|0;db(e,l);Ga=k+ -1|0;if((Ga|0)==0){m=96;break}else{la=Ga;m=31;continue}}else if((m|0)==31){m=0;fb(e,e+392|0);Ga=la+ -1|0;if((Ga|0)==0){m=96;break}else{ma=Ga;m=32;continue}}else if((m|0)==32){m=0;Ga=e+297|0;a[(c[e+504>>2]|0)+8|0]=a[Ga]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;j=e+672|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+784>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+776>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+780>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,j);Ia=ma+ -1|0;if((Ia|0)==0){m=96;break}else{Da=Ia;Ea=Ga;Fa=j;m=33;continue}}else if((m|0)==33){m=0;a[e+124|0]=a[e+296|0]|0;a[Ea]=a[e+668|0]|0;j=e+336|0;c[e+348>>2]=(c[j>>2]<<2)+(c[e+312>>2]<<8);c[j>>2]=d[(c[e+1064>>2]|0)+4|0]|0;db(e,Fa);j=Da+ -1|0;if((j|0)==0){m=96;break}else{na=j;m=34;continue}}else if((m|0)==34){m=0;fb(e,e+532|0);j=na+ -1|0;if((j|0)==0){m=96;break}else{oa=j;m=35;continue}}else if((m|0)==35){m=0;j=e+297|0;a[(c[e+644>>2]|0)+8|0]=a[j]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;Ga=e+812|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+924>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+916>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+920>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,Ga);Ia=oa+ -1|0;if((Ia|0)==0){m=96;break}else{Aa=Ia;Ba=j;Ca=Ga;m=36;continue}}else if((m|0)==36){m=0;a[e+124|0]=a[e+296|0]|0;a[Ba]=a[e+808|0]|0;Ga=e+336|0;c[e+348>>2]=(c[Ga>>2]<<2)+(c[e+312>>2]<<8);c[Ga>>2]=d[(c[e+1204>>2]|0)+4|0]|0;db(e,Ca);Ga=Aa+ -1|0;if((Ga|0)==0){m=96;break}else{pa=Ga;m=37;continue}}else if((m|0)==37){m=0;fb(e,e+672|0);Ga=pa+ -1|0;if((Ga|0)==0){m=96;break}else{qa=Ga;m=38;continue}}else if((m|0)==38){m=0;Ga=e+297|0;a[(c[e+784>>2]|0)+8|0]=a[Ga]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;j=e+952|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+1064>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+1056>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+1060>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,j);Ia=qa+ -1|0;if((Ia|0)==0){m=96;break}else{n=Ia;o=Ga;p=j;m=39;continue}}else if((m|0)==39){m=0;a[e+124|0]=a[e+296|0]|0;a[o]=a[e+948|0]|0;j=e+336|0;c[e+348>>2]=(c[j>>2]<<2)+(c[e+312>>2]<<8);c[j>>2]=d[(c[e+1344>>2]|0)+4|0]|0;db(e,p);j=n+ -1|0;if((j|0)==0){m=96;break}else{ra=j;m=40;continue}}else if((m|0)==40){m=0;fb(e,e+812|0);j=ra+ -1|0;if((j|0)==0){m=96;break}else{sa=j;m=41;continue}}else if((m|0)==41){m=0;j=e+297|0;a[(c[e+924>>2]|0)+8|0]=a[j]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;Ga=e+1092|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+1204>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+1196>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+1200>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,Ga);Ia=sa+ -1|0;if((Ia|0)==0){m=96;break}else{q=Ia;r=j;s=Ga;m=42;continue}}else if((m|0)==42){m=0;a[e+124|0]=a[e+296|0]|0;a[r]=a[e+1088|0]|0;Ga=e+336|0;c[e+348>>2]=(c[Ga>>2]<<2)+(c[e+312>>2]<<8);c[Ga>>2]=d[(c[e+1484>>2]|0)+4|0]|0;db(e,s);Ga=q+ -1|0;if((Ga|0)==0){m=96;break}else{ta=Ga;m=43;continue}}else if((m|0)==43){m=0;fb(e,e+952|0);Ga=ta+ -1|0;if((Ga|0)==0){m=96;break}else{ua=Ga;m=44;continue}}else if((m|0)==44){m=0;Ga=e+297|0;a[(c[e+1064>>2]|0)+8|0]=a[Ga]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;j=e+1232|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+1344>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+1336>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+1340>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,j);Ia=ua+ -1|0;if((Ia|0)==0){m=96;break}else{t=Ia;u=j;v=Ga;m=45;continue}}else if((m|0)==45){m=0;Ga=e+336|0;c[e+348>>2]=(c[Ga>>2]<<2)+(c[e+312>>2]<<8);c[Ga>>2]=d[(c[e+504>>2]|0)+4|0]|0;a[e+124|0]=a[e+296|0]|0;a[v]=a[e+1228|0]|0;db(e,u);Ga=t+ -1|0;if((Ga|0)==0){m=96;break}else{wa=Ga;m=46;continue}}else if((m|0)==46){m=0;fb(e,e+1092|0);Ga=wa+ -1|0;if((Ga|0)==0){m=96;break}else{xa=Ga;m=47;continue}}else if((m|0)==47){m=0;Ga=e+297|0;a[(c[e+1204>>2]|0)+8|0]=a[Ga]|0;a[e+298|0]=(c[e+356>>2]|0)>>>8;j=e+1372|0;Ia=e+352|0;c[Ia>>2]=(d[(c[e+1484>>2]|0)+3|0]<<8&16128)+(c[Ia>>2]|0);Ia=c[e+1476>>2]|0;Ka=c[e+1512>>2]|0;c[e+332>>2]=d[Ka+((c[e+1480>>2]|0)+Ia&65535)|0]|0;c[e+328>>2]=d[Ka+Ia|0]|0;bb(e,j);Ia=xa+ -1|0;if((Ia|0)==0){m=96;break}else{w=Ia;x=Ga;y=j;m=48;continue}}else if((m|0)==48){m=0;j=e+336|0;c[e+348>>2]=(c[j>>2]<<2)+(c[e+312>>2]<<8);c[j>>2]=d[(c[e+644>>2]|0)+4|0]|0;a[e+124|0]=a[e+296|0]|0;a[x]=a[e+1368|0]|0;db(e,y);j=w+ -1|0;if((j|0)==0){m=96;break}else{ya=j;m=49;continue}}else if((m|0)==49){m=0;j=e+298|0;Ga=e+1344|0;a[(c[Ga>>2]|0)+9|0]=a[j]|0;Ia=e+356|0;Ka=(Z(a[(c[e+1484>>2]|0)+1|0]|0,c[Ia>>2]|0)|0)>>7;La=e+372|0;Ma=Ka+(c[La>>2]|0)|0;if((Ma<<16>>16|0)==(Ma|0)){Na=Ma}else{Na=Ma>>31^32767}c[La>>2]=Na;La=c[e+1488>>2]|0;do{if((La&c[e+308>>2]|0)!=0){Ma=e+380|0;Oa=(c[Ma>>2]|0)+Ka|0;c[Ma>>2]=Oa;if((Oa<<16>>16|0)==(Oa|0)){break}c[Ma>>2]=Oa>>31^32767}}while(0);Ka=d[e+124|0]|c[e+360>>2];if((c[e+1492>>2]|0)==5){Pa=Ka&~La}else{Pa=Ka}a[e+296|0]=Pa;Ka=c[e+348>>2]|0;f=e+1512|0;h=c[f>>2]|0;Oa=(c[e+512>>2]|0)==0?Ka+2|0:Ka;c[e+320>>2]=d[h+(Oa+1)|0]<<8|d[h+Oa|0];Oa=c[e+504>>2]|0;c[e+324>>2]=d[Oa+5|0]|0;h=d[Oa+2|0]|0;c[e+352>>2]=h;Ka=ya+ -1|0;if((Ka|0)==0){m=96;break}else{S=Ka;T=Ia;U=j;V=f;W=Ga;X=h;Y=Oa;m=57;continue}}else if((m|0)==57){m=0;c[e+352>>2]=(d[Y+3|0]<<8&16128)+X;Oa=e+297|0;a[(c[W>>2]|0)+8|0]=a[Oa]|0;a[U]=(c[T>>2]|0)>>>8;h=e+256|0;f=(c[h>>2]|0)+8|0;Ka=f>>>0<(e+192|0)>>>0?f:e+128|0;c[h>>2]=Ka;h=(c[e+340>>2]<<8)+(c[e+276>>2]|0)&65535;f=e+364|0;c[f>>2]=h;Ma=c[V>>2]|0;Qa=(d[Ma+(h+1)|0]<<8|d[Ma+h|0])<<16>>17;c[Ka+64>>2]=Qa;c[Ka>>2]=Qa;Qa=a[e+15|0]|0;h=(Z(Qa,c[Ka+8>>2]|0)|0)>>6;Ra=(Z(c[Ka+12>>2]|0,Qa)|0)>>6;c[e+384>>2]=h;c[e+388>>2]=Ra;Qa=S+ -1|0;if((Qa|0)==0){m=96;break}else{_=Qa;$=Oa;aa=f;ba=Ma;ca=Ra;da=h;ea=Ka;m=58;continue}}else if((m|0)==58){m=0;a[e+124|0]=a[e+296|0]|0;a[$]=a[e+1508|0]|0;Ka=a[e+31|0]|0;h=(Z(Ka,c[ea+16>>2]|0)|0)>>6;Ra=a[e+47|0]|0;Ma=((Z(Ra,c[ea+24>>2]|0)|0)>>6)+h|0;h=(Z(c[ea+20>>2]|0,Ka)|0)>>6;Ka=((Z(c[ea+28>>2]|0,Ra)|0)>>6)+h|0;h=e+384|0;c[h>>2]=Ma+da;Ma=e+388|0;c[Ma>>2]=Ka+ca;Ka=c[aa>>2]|0;Ra=(d[ba+(Ka+3)|0]<<8|d[ba+(Ka+2)|0])<<16>>17;c[ea+68>>2]=Ra;c[ea+4>>2]=Ra;Ra=_+ -1|0;if((Ra|0)==0){m=96;break}else{z=Ra;A=h;B=Ma;m=59;continue}}else if((m|0)==59){m=0;Ma=e+256|0;h=e+1484|0;a[(c[h>>2]|0)+9|0]=a[e+298|0]|0;Ra=c[Ma>>2]|0;Ka=a[e+63|0]|0;f=(Z(Ka,c[Ra+32>>2]|0)|0)>>6;Oa=a[e+79|0]|0;Qa=((Z(Oa,c[Ra+40>>2]|0)|0)>>6)+f|0;f=a[e+95|0]|0;Sa=Qa+((Z(f,c[Ra+48>>2]|0)|0)>>6)|0;Qa=(Z(c[Ra+36>>2]|0,Ka)|0)>>6;Ka=((Z(c[Ra+44>>2]|0,Oa)|0)>>6)+Qa|0;Qa=Ka+((Z(c[Ra+52>>2]|0,f)|0)>>6)|0;c[A>>2]=Sa+(c[A>>2]|0);c[B>>2]=Qa+(c[B>>2]|0);Qa=z+ -1|0;if((Qa|0)==0){m=96;break}else{C=Qa;D=h;E=A;F=Ma;G=B;m=60;continue}}else if((m|0)==60){m=0;Ma=c[e+496>>2]|0;h=c[e+1512>>2]|0;c[e+332>>2]=d[h+((c[e+500>>2]|0)+Ma&65535)|0]|0;c[e+328>>2]=d[h+Ma|0]|0;a[(c[D>>2]|0)+8|0]=a[e+297|0]|0;Ma=c[F>>2]|0;h=a[e+111|0]|0;Qa=((Z(h,c[Ma+56>>2]|0)|0)>>>6)+(c[E>>2]|0)|0;Sa=((Z(c[Ma+60>>2]|0,h)|0)>>>6)+(c[G>>2]|0)<<16>>16;h=a[e+127|0]|0;f=((Z(c[Ma+64>>2]<<10,h)|0)>>16)+(Qa<<16>>16)|0;Qa=((Z(h<<10,c[Ma+68>>2]|0)|0)>>16)+Sa|0;if((f<<16>>16|0)==(f|0)){Ta=f}else{Ta=f>>31^32767}if((Qa<<16>>16|0)==(Qa|0)){Ua=Qa}else{Ua=Qa>>31^32767}Qa=Ta&-2;c[E>>2]=Qa;c[G>>2]=Ua&-2;f=C+ -1|0;if((f|0)==0){m=96;break}else{fa=f;ga=Qa;m=65;continue}}else if((m|0)==65){m=0;Qa=e+368|0;f=(Z(c[Qa>>2]<<9,a[e+12|0]|0)|0)>>16;Sa=ga<<9;Ma=((Z(a[e+44|0]|0,Sa)|0)>>16)+f|0;if((Ma<<16>>16|0)==(Ma|0)){Va=Ma}else{Va=Ma>>31^32767}c[Qa>>2]=Va;Qa=e+376|0;Ma=a[e+13|0]|0;f=((Z(Ma,Sa)|0)>>16)+(c[Qa>>2]|0)|0;Sa=e+380|0;h=c[e+388>>2]|0;Ra=((Z(Ma<<9,h)|0)>>16)+(c[Sa>>2]|0)|0;if((f<<16>>16|0)==(f|0)){Wa=f}else{Wa=f>>31^32767}if((Ra<<16>>16|0)==(Ra|0)){Xa=Ra}else{Xa=Ra>>31^32767}c[Qa>>2]=Wa&-2;c[Sa>>2]=Xa&-2;Sa=fa+ -1|0;if((Sa|0)==0){m=96;break}else{ha=Sa;ia=h;ja=Va;m=72;continue}}else if((m|0)==72){m=0;c[e+300>>2]=a[e+45|0]&254;h=e+372|0;Sa=(Z(c[h>>2]<<9,a[e+28|0]|0)|0)>>16;Qa=((Z(ia<<9,a[e+60|0]|0)|0)>>16)+Sa|0;if((Qa<<16>>16|0)==(Qa|0)){Ya=Qa}else{Ya=Qa>>31^32767}c[e+368>>2]=0;c[h>>2]=0;h=e+108|0;Qa=(a[h]&64)==0;Sa=e+1520|0;Ra=c[Sa>>2]|0;b[Ra>>1]=Qa?ja&65535:0;b[Ra+2>>1]=Qa?Ya&65535:0;Qa=Ra+4|0;Ra=e+1524|0;if(Qa>>>0<(c[Ra>>2]|0)>>>0){Za=Qa}else{c[Ra>>2]=e+1564;Za=e+1532|0}c[Sa>>2]=Za;Sa=ha+ -1|0;if((Sa|0)==0){m=96;break}else{H=Sa;I=h;m=77;continue}}else if((m|0)==77){m=0;c[e+304>>2]=d[e+61|0]|0;c[e+308>>2]=d[e+77|0]|0;c[e+312>>2]=d[e+93|0]|0;c[e+344>>2]=d[I]|0;h=H+ -1|0;if((h|0)==0){m=96;break}else{za=h;m=78;continue}}else if((m|0)==78){m=0;h=e+260|0;Sa=c[h>>2]|0;c[h>>2]=Sa^1;if((Sa|0)!=1){Sa=e+292|0;c[Sa>>2]=c[Sa>>2]&~c[e+264>>2]}c[e+340>>2]=d[e+109|0]|0;Sa=e+276|0;Ra=c[Sa>>2]|0;if((Ra|0)==0){Qa=d[e+125|0]<<11&30720;c[e+280>>2]=Qa;_a=Qa}else{_a=c[e+280>>2]|0}Qa=Ra+4|0;c[Sa>>2]=(Qa|0)<(_a|0)?Qa:0;Qa=e+344|0;if((c[Qa>>2]&32|0)==0){Sa=c[e+364>>2]|0;Ra=c[e+1512>>2]|0;f=e+376|0;Ma=c[f>>2]|0;a[Ra+(Sa+1)|0]=Ma>>>8;a[Ra+Sa|0]=Ma;$a=f}else{$a=e+376|0}c[$a>>2]=0;c[Qa>>2]=d[e+108|0]|0;Qa=za+ -1|0;if((Qa|0)==0){m=96;break}else{J=Qa;K=h;m=87;continue}}else if((m|0)==87){m=0;if((c[K>>2]|0)!=0){c[e+264>>2]=c[e+292>>2];c[e+316>>2]=d[e+92|0]|c[e+1516>>2]}h=e+272|0;Qa=c[h>>2]|0;f=(Qa|0)<1?30719:Qa+ -1|0;c[h>>2]=f;h=a[e+108|0]&31;if(((((c[1128+(h<<2)>>2]|0)+f|0)>>>0)%((c[1256+(h<<2)>>2]|0)>>>0)|0|0)==0){h=e+268|0;f=c[h>>2]|0;c[h>>2]=(f<<13^f<<14)&16384^f>>1}f=e+392|0;bb(e,f);if((c[e+344>>2]&32|0)==0){h=c[e+364>>2]|0;Qa=c[e+1512>>2]|0;Ma=e+380|0;Sa=c[Ma>>2]|0;a[Qa+(h+3)|0]=Sa>>>8;a[Qa+(h+2)|0]=Sa;ab=Ma}else{ab=e+380|0}c[ab>>2]=0;Ma=J+ -1|0;if((Ma|0)==0){m=96;break}else{L=Ma;M=f;m=95;continue}}else if((m|0)==95){m=0;db(e,M);f=e+336|0;c[e+348>>2]=(c[f>>2]<<2)+(c[e+312>>2]<<8);c[f>>2]=d[(c[e+784>>2]|0)+4|0]|0;f=L+ -1|0;if((f|0)==0){m=96;break}else{ka=f;m=21;continue}}}if((m|0)==96){i=g;return}}function hb(b,d){b=b|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0;e=i;i=i+8|0;f=e;c[b+1512>>2]=d;c[b+1516>>2]=0;g=b+1532|0;c[b+1528>>2]=g;c[b+1520>>2]=g;c[b+1524>>2]=b+1564;g=b;h=g+0|0;j=896|0;k=h+128|0;do{a[h]=a[j]|0;h=h+1|0;j=j+1|0}while((h|0)<(k|0));Db(b+128|0,0,1384)|0;c[b+1480>>2]=1;c[b+1488>>2]=128;c[b+1484>>2]=b+112;c[b+1340>>2]=1;c[b+1348>>2]=64;c[b+1344>>2]=b+96;c[b+1200>>2]=1;c[b+1208>>2]=32;c[b+1204>>2]=b+80;c[b+1060>>2]=1;c[b+1068>>2]=16;c[b+1064>>2]=b+64;c[b+920>>2]=1;c[b+928>>2]=8;c[b+924>>2]=b+48;c[b+780>>2]=1;c[b+788>>2]=4;c[b+784>>2]=b+32;c[b+640>>2]=1;c[b+648>>2]=2;c[b+644>>2]=b+16;c[b+500>>2]=1;c[b+508>>2]=1;c[b+504>>2]=g;c[b+292>>2]=209;c[b+312>>2]=78;c[b+340>>2]=96;if((d|0)==0){va(864,736,836,872)}c[b+268>>2]=16384;c[b+256>>2]=b+128;c[b+260>>2]=1;c[b+276>>2]=0;c[b+284>>2]=0;c[b+272>>2]=0;c[f>>2]=1;if((a[f]|0)==0){va(1024,1056,63,1096)}else{i=e;return}}function ib(b){b=b|0;var d=0,e=0,f=0,g=0,h=0;d=i;e=b;f=e+0|0;g=896|0;h=f+128|0;do{a[f]=a[g]|0;f=f+1|0;g=g+1|0}while((f|0)<(h|0));Db(b+128|0,0,1384)|0;c[b+1480>>2]=1;c[b+1488>>2]=128;c[b+1484>>2]=b+112;c[b+1340>>2]=1;c[b+1348>>2]=64;c[b+1344>>2]=b+96;c[b+1200>>2]=1;c[b+1208>>2]=32;c[b+1204>>2]=b+80;c[b+1060>>2]=1;c[b+1068>>2]=16;c[b+1064>>2]=b+64;c[b+920>>2]=1;c[b+928>>2]=8;c[b+924>>2]=b+48;c[b+780>>2]=1;c[b+788>>2]=4;c[b+784>>2]=b+32;c[b+640>>2]=1;c[b+648>>2]=2;c[b+644>>2]=b+16;c[b+500>>2]=1;c[b+508>>2]=1;c[b+504>>2]=e;c[b+292>>2]=209;c[b+312>>2]=78;c[b+340>>2]=96;if((c[b+1512>>2]|0)==0){va(864,736,836,872)}else{c[b+268>>2]=16384;c[b+256>>2]=b+128;c[b+260>>2]=1;c[b+276>>2]=0;c[b+284>>2]=0;c[b+272>>2]=0;i=d;return}}function jb(b,e){b=b|0;e=e|0;var f=0,g=0,h=0,j=0;f=i;g=b;h=g+0|0;j=e+0|0;e=h+128|0;do{a[h]=a[j]|0;h=h+1|0;j=j+1|0}while((h|0)<(e|0));Db(b+128|0,0,1384)|0;c[b+1480>>2]=1;c[b+1488>>2]=128;c[b+1484>>2]=b+112;c[b+1340>>2]=1;c[b+1348>>2]=64;c[b+1344>>2]=b+96;c[b+1200>>2]=1;c[b+1208>>2]=32;c[b+1204>>2]=b+80;c[b+1060>>2]=1;c[b+1068>>2]=16;c[b+1064>>2]=b+64;c[b+920>>2]=1;c[b+928>>2]=8;c[b+924>>2]=b+48;c[b+780>>2]=1;c[b+788>>2]=4;c[b+784>>2]=b+32;c[b+640>>2]=1;c[b+648>>2]=2;c[b+644>>2]=b+16;c[b+500>>2]=1;c[b+508>>2]=1;c[b+504>>2]=g;c[b+292>>2]=d[b+76|0]|0;c[b+312>>2]=d[b+93|0]|0;c[b+340>>2]=d[b+109|0]|0;if((c[b+1512>>2]|0)==0){va(864,736,836,872)}else{c[b+268>>2]=16384;c[b+256>>2]=b+128;c[b+260>>2]=1;c[b+276>>2]=0;c[b+284>>2]=0;c[b+272>>2]=0;i=f;return}}function kb(a){a=a|0;var b=0,d=0;b=i;d=a+8|0;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=0;i=b;return}function lb(a){a=a|0;var b=0,d=0;b=i;c[a>>2]=256;c[a+4>>2]=8;d=a+8|0;c[d+0>>2]=0;c[d+4>>2]=0;c[d+8>>2]=0;c[d+12>>2]=0;c[d+16>>2]=0;c[d+20>>2]=0;i=b;return}function mb(a,d,e){a=a|0;d=d|0;e=e|0;var f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;f=i;if((e&1|0)!=0){va(2408,2432,31,2464)}g=c[a>>2]|0;h=c[a+4>>2]|0;if((e|0)<=0){i=f;return}j=a+28|0;k=a+24|0;l=a+20|0;m=0;n=c[l>>2]|0;o=c[k>>2]|0;p=c[j>>2]|0;while(1){q=d+(m<<1)|0;r=b[q>>1]|0;s=r+n|0;t=r*3|0;r=p>>10;u=p-(p>>h)+(Z(s-o|0,g)|0)|0;if((r<<16>>16|0)==(r|0)){v=r}else{v=p>>31^32767}b[q>>1]=v;q=m+2|0;if((q|0)<(e|0)){m=q;p=u;o=s;n=t}else{break}}c[l>>2]=t;c[k>>2]=s;c[j>>2]=u;u=a+16|0;j=a+12|0;s=a+8|0;a=0;k=c[s>>2]|0;t=c[j>>2]|0;l=c[u>>2]|0;while(1){n=d+((a|1)<<1)|0;o=b[n>>1]|0;w=o+k|0;x=o*3|0;o=l>>10;y=l-(l>>h)+(Z(w-t|0,g)|0)|0;if((o<<16>>16|0)==(o|0)){z=o}else{z=l>>31^32767}b[n>>1]=z;n=a+2|0;if((n|0)<(e|0)){a=n;l=y;t=w;k=x}else{break}}c[s>>2]=x;c[j>>2]=w;c[u>>2]=y;i=f;return}function nb(){var a=0,b=0,c=0,d=0;a=i;b=zb(68204)|0;do{if((b|0)==0){c=0}else{d=b;if((Va(d)|0)==0){c=d;break}Ab(b);c=0}}while(0);i=a;return c|0}function ob(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ab(a)}i=b;return}function pb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=i;e=Xa(a,b,c)|0;i=d;return e|0}function qb(a){a=a|0;var b=0;b=i;Ya(a);i=b;return}function rb(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;d=i;e=$a(a,b,c)|0;i=d;return e|0}function sb(){var a=0,b=0,c=0,d=0;a=i;b=zb(32)|0;if((b|0)==0){c=0}else{d=b;lb(d);c=d}i=a;return c|0}function tb(a){a=a|0;var b=0;b=i;if((a|0)!=0){Ab(a)}i=b;return}function ub(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;d=i;mb(a,b,c);i=d;return}function vb(a){a=a|0;var b=0;b=i;kb(a);i=b;return}function wb(){var a=0,b=0;a=i;b=c[622]|0;if((b|0)!=0){tb(b)}b=c[624]|0;if((b|0)==0){i=a;return}ob(b);i=a;return}function xb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0,g=0,h=0,j=0;d=i;i=i+8|0;e=d;f=c[624]|0;if((f|0)==0){g=nb()|0;c[624]=g;h=g}else{h=f}if((c[622]|0)==0){c[622]=sb()|0;j=c[624]|0}else{j=h}h=pb(j,a,b)|0;if((h|0)!=0){c[e>>2]=h;oa(2472,e|0)|0}Ab(a);qb(c[624]|0);vb(c[622]|0);c[626]=0;i=d;return}function yb(a,b){a=a|0;b=b|0;var d=0,e=0,f=0;d=i;i=i+8|0;e=d;f=rb(c[624]|0,b,a)|0;if((f|0)!=0){c[e>>2]=f;oa(2472,e|0)|0}ub(c[622]|0,a,b);a=(c[626]|0)+b|0;c[626]=a;i=d;return a|0}function zb(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=0,U=0,V=0,W=0,X=0,Y=0,Z=0,_=0,$=0,aa=0,ba=0,ca=0,ea=0,fa=0,ga=0,ha=0,ia=0,ja=0,la=0,ma=0,oa=0,pa=0,qa=0,ra=0,sa=0,ta=0,ua=0,va=0,ya=0,za=0,Aa=0,Ba=0,Ca=0,Da=0,Ea=0,Fa=0,Ga=0,Ha=0,Ia=0,Ja=0,Ka=0,La=0,Ma=0,Na=0,Oa=0,Pa=0,Qa=0,Ra=0,Sa=0;b=i;do{if(a>>>0<245){if(a>>>0<11){d=16}else{d=a+11&-8}e=d>>>3;f=c[628]|0;g=f>>>e;if((g&3|0)!=0){h=(g&1^1)+e|0;j=h<<1;k=2552+(j<<2)|0;l=2552+(j+2<<2)|0;j=c[l>>2]|0;m=j+8|0;n=c[m>>2]|0;do{if((k|0)==(n|0)){c[628]=f&~(1<<h)}else{if(n>>>0<(c[2528>>2]|0)>>>0){ka()}o=n+12|0;if((c[o>>2]|0)==(j|0)){c[o>>2]=k;c[l>>2]=n;break}else{ka()}}}while(0);n=h<<3;c[j+4>>2]=n|3;l=j+(n|4)|0;c[l>>2]=c[l>>2]|1;p=m;i=b;return p|0}if(!(d>>>0>(c[2520>>2]|0)>>>0)){q=d;break}if((g|0)!=0){l=2<<e;n=g<<e&(l|0-l);l=(n&0-n)+ -1|0;n=l>>>12&16;k=l>>>n;l=k>>>5&8;o=k>>>l;k=o>>>2&4;r=o>>>k;o=r>>>1&2;s=r>>>o;r=s>>>1&1;t=(l|n|k|o|r)+(s>>>r)|0;r=t<<1;s=2552+(r<<2)|0;o=2552+(r+2<<2)|0;r=c[o>>2]|0;k=r+8|0;n=c[k>>2]|0;do{if((s|0)==(n|0)){c[628]=f&~(1<<t)}else{if(n>>>0<(c[2528>>2]|0)>>>0){ka()}l=n+12|0;if((c[l>>2]|0)==(r|0)){c[l>>2]=s;c[o>>2]=n;break}else{ka()}}}while(0);n=t<<3;o=n-d|0;c[r+4>>2]=d|3;s=r;f=s+d|0;c[s+(d|4)>>2]=o|1;c[s+n>>2]=o;n=c[2520>>2]|0;if((n|0)!=0){s=c[2532>>2]|0;e=n>>>3;n=e<<1;g=2552+(n<<2)|0;m=c[628]|0;j=1<<e;do{if((m&j|0)==0){c[628]=m|j;u=2552+(n+2<<2)|0;v=g}else{e=2552+(n+2<<2)|0;h=c[e>>2]|0;if(!(h>>>0<(c[2528>>2]|0)>>>0)){u=e;v=h;break}ka()}}while(0);c[u>>2]=s;c[v+12>>2]=s;c[s+8>>2]=v;c[s+12>>2]=g}c[2520>>2]=o;c[2532>>2]=f;p=k;i=b;return p|0}n=c[2516>>2]|0;if((n|0)==0){q=d;break}j=(n&0-n)+ -1|0;n=j>>>12&16;m=j>>>n;j=m>>>5&8;r=m>>>j;m=r>>>2&4;t=r>>>m;r=t>>>1&2;h=t>>>r;t=h>>>1&1;e=c[2816+((j|n|m|r|t)+(h>>>t)<<2)>>2]|0;t=(c[e+4>>2]&-8)-d|0;h=e;r=e;while(1){e=c[h+16>>2]|0;if((e|0)==0){m=c[h+20>>2]|0;if((m|0)==0){break}else{w=m}}else{w=e}e=(c[w+4>>2]&-8)-d|0;m=e>>>0<t>>>0;t=m?e:t;h=w;r=m?w:r}h=r;k=c[2528>>2]|0;if(h>>>0<k>>>0){ka()}f=h+d|0;o=f;if(!(h>>>0<f>>>0)){ka()}f=c[r+24>>2]|0;g=c[r+12>>2]|0;do{if((g|0)==(r|0)){s=r+20|0;m=c[s>>2]|0;if((m|0)==0){e=r+16|0;n=c[e>>2]|0;if((n|0)==0){x=0;break}else{y=n;z=e}}else{y=m;z=s}while(1){s=y+20|0;m=c[s>>2]|0;if((m|0)!=0){z=s;y=m;continue}m=y+16|0;s=c[m>>2]|0;if((s|0)==0){break}else{y=s;z=m}}if(z>>>0<k>>>0){ka()}else{c[z>>2]=0;x=y;break}}else{m=c[r+8>>2]|0;if(m>>>0<k>>>0){ka()}s=m+12|0;if((c[s>>2]|0)!=(r|0)){ka()}e=g+8|0;if((c[e>>2]|0)==(r|0)){c[s>>2]=g;c[e>>2]=m;x=g;break}else{ka()}}}while(0);a:do{if((f|0)!=0){g=c[r+28>>2]|0;k=2816+(g<<2)|0;do{if((r|0)==(c[k>>2]|0)){c[k>>2]=x;if((x|0)!=0){break}c[2516>>2]=c[2516>>2]&~(1<<g);break a}else{if(f>>>0<(c[2528>>2]|0)>>>0){ka()}m=f+16|0;if((c[m>>2]|0)==(r|0)){c[m>>2]=x}else{c[f+20>>2]=x}if((x|0)==0){break a}}}while(0);if(x>>>0<(c[2528>>2]|0)>>>0){ka()}c[x+24>>2]=f;g=c[r+16>>2]|0;do{if((g|0)!=0){if(g>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[x+16>>2]=g;c[g+24>>2]=x;break}}}while(0);g=c[r+20>>2]|0;if((g|0)==0){break}if(g>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[x+20>>2]=g;c[g+24>>2]=x;break}}}while(0);if(t>>>0<16){f=t+d|0;c[r+4>>2]=f|3;g=h+(f+4)|0;c[g>>2]=c[g>>2]|1}else{c[r+4>>2]=d|3;c[h+(d|4)>>2]=t|1;c[h+(t+d)>>2]=t;g=c[2520>>2]|0;if((g|0)!=0){f=c[2532>>2]|0;k=g>>>3;g=k<<1;m=2552+(g<<2)|0;e=c[628]|0;s=1<<k;do{if((e&s|0)==0){c[628]=e|s;A=2552+(g+2<<2)|0;B=m}else{k=2552+(g+2<<2)|0;n=c[k>>2]|0;if(!(n>>>0<(c[2528>>2]|0)>>>0)){A=k;B=n;break}ka()}}while(0);c[A>>2]=f;c[B+12>>2]=f;c[f+8>>2]=B;c[f+12>>2]=m}c[2520>>2]=t;c[2532>>2]=o}p=r+8|0;i=b;return p|0}else{if(a>>>0>4294967231){q=-1;break}g=a+11|0;s=g&-8;e=c[2516>>2]|0;if((e|0)==0){q=s;break}h=0-s|0;n=g>>>8;do{if((n|0)==0){C=0}else{if(s>>>0>16777215){C=31;break}g=(n+1048320|0)>>>16&8;k=n<<g;j=(k+520192|0)>>>16&4;l=k<<j;k=(l+245760|0)>>>16&2;D=14-(j|g|k)+(l<<k>>>15)|0;C=s>>>(D+7|0)&1|D<<1}}while(0);n=c[2816+(C<<2)>>2]|0;b:do{if((n|0)==0){E=h;F=0;G=0}else{if((C|0)==31){H=0}else{H=25-(C>>>1)|0}r=h;o=0;t=s<<H;m=n;f=0;while(1){D=c[m+4>>2]&-8;k=D-s|0;if(k>>>0<r>>>0){if((D|0)==(s|0)){E=k;F=m;G=m;break b}else{I=k;J=m}}else{I=r;J=f}k=c[m+20>>2]|0;D=c[m+(t>>>31<<2)+16>>2]|0;l=(k|0)==0|(k|0)==(D|0)?o:k;if((D|0)==0){E=I;F=l;G=J;break}else{r=I;o=l;t=t<<1;m=D;f=J}}}}while(0);if((F|0)==0&(G|0)==0){n=2<<C;h=e&(n|0-n);if((h|0)==0){q=s;break}n=(h&0-h)+ -1|0;h=n>>>12&16;f=n>>>h;n=f>>>5&8;m=f>>>n;f=m>>>2&4;t=m>>>f;m=t>>>1&2;o=t>>>m;t=o>>>1&1;K=c[2816+((n|h|f|m|t)+(o>>>t)<<2)>>2]|0}else{K=F}if((K|0)==0){L=E;M=G}else{t=E;o=K;m=G;while(1){f=(c[o+4>>2]&-8)-s|0;h=f>>>0<t>>>0;n=h?f:t;f=h?o:m;h=c[o+16>>2]|0;if((h|0)!=0){N=f;O=n;m=N;o=h;t=O;continue}h=c[o+20>>2]|0;if((h|0)==0){L=n;M=f;break}else{N=f;O=n;o=h;m=N;t=O}}}if((M|0)==0){q=s;break}if(!(L>>>0<((c[2520>>2]|0)-s|0)>>>0)){q=s;break}t=M;m=c[2528>>2]|0;if(t>>>0<m>>>0){ka()}o=t+s|0;e=o;if(!(t>>>0<o>>>0)){ka()}h=c[M+24>>2]|0;n=c[M+12>>2]|0;do{if((n|0)==(M|0)){f=M+20|0;r=c[f>>2]|0;if((r|0)==0){D=M+16|0;l=c[D>>2]|0;if((l|0)==0){P=0;break}else{Q=l;R=D}}else{Q=r;R=f}while(1){f=Q+20|0;r=c[f>>2]|0;if((r|0)!=0){R=f;Q=r;continue}r=Q+16|0;f=c[r>>2]|0;if((f|0)==0){break}else{Q=f;R=r}}if(R>>>0<m>>>0){ka()}else{c[R>>2]=0;P=Q;break}}else{r=c[M+8>>2]|0;if(r>>>0<m>>>0){ka()}f=r+12|0;if((c[f>>2]|0)!=(M|0)){ka()}D=n+8|0;if((c[D>>2]|0)==(M|0)){c[f>>2]=n;c[D>>2]=r;P=n;break}else{ka()}}}while(0);c:do{if((h|0)!=0){n=c[M+28>>2]|0;m=2816+(n<<2)|0;do{if((M|0)==(c[m>>2]|0)){c[m>>2]=P;if((P|0)!=0){break}c[2516>>2]=c[2516>>2]&~(1<<n);break c}else{if(h>>>0<(c[2528>>2]|0)>>>0){ka()}r=h+16|0;if((c[r>>2]|0)==(M|0)){c[r>>2]=P}else{c[h+20>>2]=P}if((P|0)==0){break c}}}while(0);if(P>>>0<(c[2528>>2]|0)>>>0){ka()}c[P+24>>2]=h;n=c[M+16>>2]|0;do{if((n|0)!=0){if(n>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[P+16>>2]=n;c[n+24>>2]=P;break}}}while(0);n=c[M+20>>2]|0;if((n|0)==0){break}if(n>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[P+20>>2]=n;c[n+24>>2]=P;break}}}while(0);d:do{if(L>>>0<16){h=L+s|0;c[M+4>>2]=h|3;n=t+(h+4)|0;c[n>>2]=c[n>>2]|1}else{c[M+4>>2]=s|3;c[t+(s|4)>>2]=L|1;c[t+(L+s)>>2]=L;n=L>>>3;if(L>>>0<256){h=n<<1;m=2552+(h<<2)|0;r=c[628]|0;D=1<<n;do{if((r&D|0)==0){c[628]=r|D;S=2552+(h+2<<2)|0;T=m}else{n=2552+(h+2<<2)|0;f=c[n>>2]|0;if(!(f>>>0<(c[2528>>2]|0)>>>0)){S=n;T=f;break}ka()}}while(0);c[S>>2]=e;c[T+12>>2]=e;c[t+(s+8)>>2]=T;c[t+(s+12)>>2]=m;break}h=o;D=L>>>8;do{if((D|0)==0){U=0}else{if(L>>>0>16777215){U=31;break}r=(D+1048320|0)>>>16&8;f=D<<r;n=(f+520192|0)>>>16&4;l=f<<n;f=(l+245760|0)>>>16&2;k=14-(n|r|f)+(l<<f>>>15)|0;U=L>>>(k+7|0)&1|k<<1}}while(0);D=2816+(U<<2)|0;c[t+(s+28)>>2]=U;c[t+(s+20)>>2]=0;c[t+(s+16)>>2]=0;m=c[2516>>2]|0;k=1<<U;if((m&k|0)==0){c[2516>>2]=m|k;c[D>>2]=h;c[t+(s+24)>>2]=D;c[t+(s+12)>>2]=h;c[t+(s+8)>>2]=h;break}k=c[D>>2]|0;if((U|0)==31){V=0}else{V=25-(U>>>1)|0}e:do{if((c[k+4>>2]&-8|0)==(L|0)){W=k}else{D=L<<V;m=k;while(1){X=m+(D>>>31<<2)+16|0;f=c[X>>2]|0;if((f|0)==0){break}if((c[f+4>>2]&-8|0)==(L|0)){W=f;break e}else{D=D<<1;m=f}}if(X>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[X>>2]=h;c[t+(s+24)>>2]=m;c[t+(s+12)>>2]=h;c[t+(s+8)>>2]=h;break d}}}while(0);k=W+8|0;D=c[k>>2]|0;f=c[2528>>2]|0;if(W>>>0<f>>>0){ka()}if(D>>>0<f>>>0){ka()}else{c[D+12>>2]=h;c[k>>2]=h;c[t+(s+8)>>2]=D;c[t+(s+12)>>2]=W;c[t+(s+24)>>2]=0;break}}}while(0);p=M+8|0;i=b;return p|0}}while(0);M=c[2520>>2]|0;if(!(q>>>0>M>>>0)){W=M-q|0;X=c[2532>>2]|0;if(W>>>0>15){L=X;c[2532>>2]=L+q;c[2520>>2]=W;c[L+(q+4)>>2]=W|1;c[L+M>>2]=W;c[X+4>>2]=q|3}else{c[2520>>2]=0;c[2532>>2]=0;c[X+4>>2]=M|3;W=X+(M+4)|0;c[W>>2]=c[W>>2]|1}p=X+8|0;i=b;return p|0}X=c[2524>>2]|0;if(q>>>0<X>>>0){W=X-q|0;c[2524>>2]=W;X=c[2536>>2]|0;M=X;c[2536>>2]=M+q;c[M+(q+4)>>2]=W|1;c[X+4>>2]=q|3;p=X+8|0;i=b;return p|0}do{if((c[746]|0)==0){X=da(30)|0;if((X+ -1&X|0)==0){c[2992>>2]=X;c[2988>>2]=X;c[2996>>2]=-1;c[3e3>>2]=-1;c[3004>>2]=0;c[2956>>2]=0;c[746]=(xa(0)|0)&-16^1431655768;break}else{ka()}}}while(0);X=q+48|0;W=c[2992>>2]|0;M=q+47|0;L=W+M|0;V=0-W|0;W=L&V;if(!(W>>>0>q>>>0)){p=0;i=b;return p|0}U=c[2952>>2]|0;do{if((U|0)!=0){T=c[2944>>2]|0;S=T+W|0;if(S>>>0<=T>>>0|S>>>0>U>>>0){p=0}else{break}i=b;return p|0}}while(0);f:do{if((c[2956>>2]&4|0)==0){U=c[2536>>2]|0;g:do{if((U|0)==0){Y=182}else{S=U;T=2960|0;while(1){Z=T;P=c[Z>>2]|0;if(!(P>>>0>S>>>0)){_=T+4|0;if((P+(c[_>>2]|0)|0)>>>0>S>>>0){break}}P=c[T+8>>2]|0;if((P|0)==0){Y=182;break g}else{T=P}}if((T|0)==0){Y=182;break}S=L-(c[2524>>2]|0)&V;if(!(S>>>0<2147483647)){$=0;break}h=na(S|0)|0;P=(h|0)==((c[Z>>2]|0)+(c[_>>2]|0)|0);aa=h;ba=S;ca=P?h:-1;ea=P?S:0;Y=191}}while(0);do{if((Y|0)==182){U=na(0)|0;if((U|0)==(-1|0)){$=0;break}S=U;P=c[2988>>2]|0;h=P+ -1|0;if((h&S|0)==0){fa=W}else{fa=W-S+(h+S&0-P)|0}P=c[2944>>2]|0;S=P+fa|0;if(!(fa>>>0>q>>>0&fa>>>0<2147483647)){$=0;break}h=c[2952>>2]|0;if((h|0)!=0){if(S>>>0<=P>>>0|S>>>0>h>>>0){$=0;break}}h=na(fa|0)|0;S=(h|0)==(U|0);aa=h;ba=fa;ca=S?U:-1;ea=S?fa:0;Y=191}}while(0);h:do{if((Y|0)==191){S=0-ba|0;if((ca|0)!=(-1|0)){ga=ca;ha=ea;Y=202;break f}do{if((aa|0)!=(-1|0)&ba>>>0<2147483647&ba>>>0<X>>>0){U=c[2992>>2]|0;h=M-ba+U&0-U;if(!(h>>>0<2147483647)){ia=ba;break}if((na(h|0)|0)==(-1|0)){na(S|0)|0;$=ea;break h}else{ia=h+ba|0;break}}else{ia=ba}}while(0);if((aa|0)==(-1|0)){$=ea}else{ga=aa;ha=ia;Y=202;break f}}}while(0);c[2956>>2]=c[2956>>2]|4;ja=$;Y=199}else{ja=0;Y=199}}while(0);do{if((Y|0)==199){if(!(W>>>0<2147483647)){break}$=na(W|0)|0;ia=na(0)|0;if(!((ia|0)!=(-1|0)&($|0)!=(-1|0)&$>>>0<ia>>>0)){break}aa=ia-$|0;ia=aa>>>0>(q+40|0)>>>0;if(ia){ga=$;ha=ia?aa:ja;Y=202}}}while(0);do{if((Y|0)==202){ja=(c[2944>>2]|0)+ha|0;c[2944>>2]=ja;if(ja>>>0>(c[2948>>2]|0)>>>0){c[2948>>2]=ja}ja=c[2536>>2]|0;i:do{if((ja|0)==0){W=c[2528>>2]|0;if((W|0)==0|ga>>>0<W>>>0){c[2528>>2]=ga}c[2960>>2]=ga;c[2964>>2]=ha;c[2972>>2]=0;c[2548>>2]=c[746];c[2544>>2]=-1;W=0;do{aa=W<<1;ia=2552+(aa<<2)|0;c[2552+(aa+3<<2)>>2]=ia;c[2552+(aa+2<<2)>>2]=ia;W=W+1|0;}while((W|0)!=32);W=ga+8|0;if((W&7|0)==0){la=0}else{la=0-W&7}W=ha+ -40-la|0;c[2536>>2]=ga+la;c[2524>>2]=W;c[ga+(la+4)>>2]=W|1;c[ga+(ha+ -36)>>2]=40;c[2540>>2]=c[3e3>>2]}else{W=2960|0;while(1){ma=c[W>>2]|0;oa=W+4|0;pa=c[oa>>2]|0;if((ga|0)==(ma+pa|0)){Y=214;break}ia=c[W+8>>2]|0;if((ia|0)==0){break}else{W=ia}}do{if((Y|0)==214){if((c[W+12>>2]&8|0)!=0){break}ia=ja;if(!(ia>>>0>=ma>>>0&ia>>>0<ga>>>0)){break}c[oa>>2]=pa+ha;aa=(c[2524>>2]|0)+ha|0;$=ja+8|0;if(($&7|0)==0){qa=0}else{qa=0-$&7}$=aa-qa|0;c[2536>>2]=ia+qa;c[2524>>2]=$;c[ia+(qa+4)>>2]=$|1;c[ia+(aa+4)>>2]=40;c[2540>>2]=c[3e3>>2];break i}}while(0);if(ga>>>0<(c[2528>>2]|0)>>>0){c[2528>>2]=ga}W=ga+ha|0;aa=2960|0;while(1){ra=aa;if((c[ra>>2]|0)==(W|0)){Y=224;break}ia=c[aa+8>>2]|0;if((ia|0)==0){break}else{aa=ia}}do{if((Y|0)==224){if((c[aa+12>>2]&8|0)!=0){break}c[ra>>2]=ga;W=aa+4|0;c[W>>2]=(c[W>>2]|0)+ha;W=ga+8|0;if((W&7|0)==0){sa=0}else{sa=0-W&7}W=ga+(ha+8)|0;if((W&7|0)==0){ta=0}else{ta=0-W&7}W=ga+(ta+ha)|0;ia=W;$=sa+q|0;ea=ga+$|0;ba=ea;M=W-(ga+sa)-q|0;c[ga+(sa+4)>>2]=q|3;j:do{if((ia|0)==(c[2536>>2]|0)){X=(c[2524>>2]|0)+M|0;c[2524>>2]=X;c[2536>>2]=ba;c[ga+($+4)>>2]=X|1}else{if((ia|0)==(c[2532>>2]|0)){X=(c[2520>>2]|0)+M|0;c[2520>>2]=X;c[2532>>2]=ba;c[ga+($+4)>>2]=X|1;c[ga+(X+$)>>2]=X;break}X=ha+4|0;ca=c[ga+(X+ta)>>2]|0;if((ca&3|0)==1){fa=ca&-8;_=ca>>>3;k:do{if(ca>>>0<256){Z=c[ga+((ta|8)+ha)>>2]|0;V=c[ga+(ha+12+ta)>>2]|0;L=2552+(_<<1<<2)|0;do{if((Z|0)!=(L|0)){if(Z>>>0<(c[2528>>2]|0)>>>0){ka()}if((c[Z+12>>2]|0)==(ia|0)){break}ka()}}while(0);if((V|0)==(Z|0)){c[628]=c[628]&~(1<<_);break}do{if((V|0)==(L|0)){ua=V+8|0}else{if(V>>>0<(c[2528>>2]|0)>>>0){ka()}S=V+8|0;if((c[S>>2]|0)==(ia|0)){ua=S;break}ka()}}while(0);c[Z+12>>2]=V;c[ua>>2]=Z}else{L=W;S=c[ga+((ta|24)+ha)>>2]|0;T=c[ga+(ha+12+ta)>>2]|0;do{if((T|0)==(L|0)){h=ta|16;U=ga+(X+h)|0;P=c[U>>2]|0;if((P|0)==0){Q=ga+(h+ha)|0;h=c[Q>>2]|0;if((h|0)==0){va=0;break}else{ya=h;za=Q}}else{ya=P;za=U}while(1){U=ya+20|0;P=c[U>>2]|0;if((P|0)!=0){za=U;ya=P;continue}P=ya+16|0;U=c[P>>2]|0;if((U|0)==0){break}else{ya=U;za=P}}if(za>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[za>>2]=0;va=ya;break}}else{P=c[ga+((ta|8)+ha)>>2]|0;if(P>>>0<(c[2528>>2]|0)>>>0){ka()}U=P+12|0;if((c[U>>2]|0)!=(L|0)){ka()}Q=T+8|0;if((c[Q>>2]|0)==(L|0)){c[U>>2]=T;c[Q>>2]=P;va=T;break}else{ka()}}}while(0);if((S|0)==0){break}T=c[ga+(ha+28+ta)>>2]|0;Z=2816+(T<<2)|0;do{if((L|0)==(c[Z>>2]|0)){c[Z>>2]=va;if((va|0)!=0){break}c[2516>>2]=c[2516>>2]&~(1<<T);break k}else{if(S>>>0<(c[2528>>2]|0)>>>0){ka()}V=S+16|0;if((c[V>>2]|0)==(L|0)){c[V>>2]=va}else{c[S+20>>2]=va}if((va|0)==0){break k}}}while(0);if(va>>>0<(c[2528>>2]|0)>>>0){ka()}c[va+24>>2]=S;L=ta|16;T=c[ga+(L+ha)>>2]|0;do{if((T|0)!=0){if(T>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[va+16>>2]=T;c[T+24>>2]=va;break}}}while(0);T=c[ga+(X+L)>>2]|0;if((T|0)==0){break}if(T>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[va+20>>2]=T;c[T+24>>2]=va;break}}}while(0);Aa=ga+((fa|ta)+ha)|0;Ba=fa+M|0}else{Aa=ia;Ba=M}X=Aa+4|0;c[X>>2]=c[X>>2]&-2;c[ga+($+4)>>2]=Ba|1;c[ga+(Ba+$)>>2]=Ba;X=Ba>>>3;if(Ba>>>0<256){_=X<<1;ca=2552+(_<<2)|0;T=c[628]|0;S=1<<X;do{if((T&S|0)==0){c[628]=T|S;Ca=2552+(_+2<<2)|0;Da=ca}else{X=2552+(_+2<<2)|0;Z=c[X>>2]|0;if(!(Z>>>0<(c[2528>>2]|0)>>>0)){Ca=X;Da=Z;break}ka()}}while(0);c[Ca>>2]=ba;c[Da+12>>2]=ba;c[ga+($+8)>>2]=Da;c[ga+($+12)>>2]=ca;break}_=ea;S=Ba>>>8;do{if((S|0)==0){Ea=0}else{if(Ba>>>0>16777215){Ea=31;break}T=(S+1048320|0)>>>16&8;fa=S<<T;Z=(fa+520192|0)>>>16&4;X=fa<<Z;fa=(X+245760|0)>>>16&2;V=14-(Z|T|fa)+(X<<fa>>>15)|0;Ea=Ba>>>(V+7|0)&1|V<<1}}while(0);S=2816+(Ea<<2)|0;c[ga+($+28)>>2]=Ea;c[ga+($+20)>>2]=0;c[ga+($+16)>>2]=0;ca=c[2516>>2]|0;V=1<<Ea;if((ca&V|0)==0){c[2516>>2]=ca|V;c[S>>2]=_;c[ga+($+24)>>2]=S;c[ga+($+12)>>2]=_;c[ga+($+8)>>2]=_;break}V=c[S>>2]|0;if((Ea|0)==31){Fa=0}else{Fa=25-(Ea>>>1)|0}l:do{if((c[V+4>>2]&-8|0)==(Ba|0)){Ga=V}else{S=Ba<<Fa;ca=V;while(1){Ha=ca+(S>>>31<<2)+16|0;fa=c[Ha>>2]|0;if((fa|0)==0){break}if((c[fa+4>>2]&-8|0)==(Ba|0)){Ga=fa;break l}else{S=S<<1;ca=fa}}if(Ha>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[Ha>>2]=_;c[ga+($+24)>>2]=ca;c[ga+($+12)>>2]=_;c[ga+($+8)>>2]=_;break j}}}while(0);V=Ga+8|0;S=c[V>>2]|0;L=c[2528>>2]|0;if(Ga>>>0<L>>>0){ka()}if(S>>>0<L>>>0){ka()}else{c[S+12>>2]=_;c[V>>2]=_;c[ga+($+8)>>2]=S;c[ga+($+12)>>2]=Ga;c[ga+($+24)>>2]=0;break}}}while(0);p=ga+(sa|8)|0;i=b;return p|0}}while(0);aa=ja;$=2960|0;while(1){Ia=c[$>>2]|0;if(!(Ia>>>0>aa>>>0)){Ja=c[$+4>>2]|0;Ka=Ia+Ja|0;if(Ka>>>0>aa>>>0){break}}$=c[$+8>>2]|0}$=Ia+(Ja+ -39)|0;if(($&7|0)==0){La=0}else{La=0-$&7}$=Ia+(Ja+ -47+La)|0;ea=$>>>0<(ja+16|0)>>>0?aa:$;$=ea+8|0;ba=$;M=ga+8|0;if((M&7|0)==0){Ma=0}else{Ma=0-M&7}M=ha+ -40-Ma|0;c[2536>>2]=ga+Ma;c[2524>>2]=M;c[ga+(Ma+4)>>2]=M|1;c[ga+(ha+ -36)>>2]=40;c[2540>>2]=c[3e3>>2];c[ea+4>>2]=27;c[$+0>>2]=c[2960>>2];c[$+4>>2]=c[2964>>2];c[$+8>>2]=c[2968>>2];c[$+12>>2]=c[2972>>2];c[2960>>2]=ga;c[2964>>2]=ha;c[2972>>2]=0;c[2968>>2]=ba;ba=ea+28|0;c[ba>>2]=7;if((ea+32|0)>>>0<Ka>>>0){$=ba;while(1){ba=$+4|0;c[ba>>2]=7;if(($+8|0)>>>0<Ka>>>0){$=ba}else{break}}}if((ea|0)==(aa|0)){break}$=ea-ja|0;ba=aa+($+4)|0;c[ba>>2]=c[ba>>2]&-2;c[ja+4>>2]=$|1;c[aa+$>>2]=$;ba=$>>>3;if($>>>0<256){M=ba<<1;ia=2552+(M<<2)|0;W=c[628]|0;m=1<<ba;do{if((W&m|0)==0){c[628]=W|m;Na=2552+(M+2<<2)|0;Oa=ia}else{ba=2552+(M+2<<2)|0;S=c[ba>>2]|0;if(!(S>>>0<(c[2528>>2]|0)>>>0)){Na=ba;Oa=S;break}ka()}}while(0);c[Na>>2]=ja;c[Oa+12>>2]=ja;c[ja+8>>2]=Oa;c[ja+12>>2]=ia;break}M=ja;m=$>>>8;do{if((m|0)==0){Pa=0}else{if($>>>0>16777215){Pa=31;break}W=(m+1048320|0)>>>16&8;aa=m<<W;ea=(aa+520192|0)>>>16&4;S=aa<<ea;aa=(S+245760|0)>>>16&2;ba=14-(ea|W|aa)+(S<<aa>>>15)|0;Pa=$>>>(ba+7|0)&1|ba<<1}}while(0);m=2816+(Pa<<2)|0;c[ja+28>>2]=Pa;c[ja+20>>2]=0;c[ja+16>>2]=0;ia=c[2516>>2]|0;ba=1<<Pa;if((ia&ba|0)==0){c[2516>>2]=ia|ba;c[m>>2]=M;c[ja+24>>2]=m;c[ja+12>>2]=ja;c[ja+8>>2]=ja;break}ba=c[m>>2]|0;if((Pa|0)==31){Qa=0}else{Qa=25-(Pa>>>1)|0}m:do{if((c[ba+4>>2]&-8|0)==($|0)){Ra=ba}else{m=$<<Qa;ia=ba;while(1){Sa=ia+(m>>>31<<2)+16|0;aa=c[Sa>>2]|0;if((aa|0)==0){break}if((c[aa+4>>2]&-8|0)==($|0)){Ra=aa;break m}else{m=m<<1;ia=aa}}if(Sa>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[Sa>>2]=M;c[ja+24>>2]=ia;c[ja+12>>2]=ja;c[ja+8>>2]=ja;break i}}}while(0);$=Ra+8|0;ba=c[$>>2]|0;m=c[2528>>2]|0;if(Ra>>>0<m>>>0){ka()}if(ba>>>0<m>>>0){ka()}else{c[ba+12>>2]=M;c[$>>2]=M;c[ja+8>>2]=ba;c[ja+12>>2]=Ra;c[ja+24>>2]=0;break}}}while(0);ja=c[2524>>2]|0;if(!(ja>>>0>q>>>0)){break}ba=ja-q|0;c[2524>>2]=ba;ja=c[2536>>2]|0;$=ja;c[2536>>2]=$+q;c[$+(q+4)>>2]=ba|1;c[ja+4>>2]=q|3;p=ja+8|0;i=b;return p|0}}while(0);c[(wa()|0)>>2]=12;p=0;i=b;return p|0}function Ab(a){a=a|0;var b=0,d=0,e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0;b=i;if((a|0)==0){i=b;return}d=a+ -8|0;e=d;f=c[2528>>2]|0;if(d>>>0<f>>>0){ka()}g=c[a+ -4>>2]|0;h=g&3;if((h|0)==1){ka()}j=g&-8;k=a+(j+ -8)|0;l=k;a:do{if((g&1|0)==0){m=c[d>>2]|0;if((h|0)==0){i=b;return}n=-8-m|0;o=a+n|0;p=o;q=m+j|0;if(o>>>0<f>>>0){ka()}if((p|0)==(c[2532>>2]|0)){r=a+(j+ -4)|0;if((c[r>>2]&3|0)!=3){s=p;t=q;break}c[2520>>2]=q;c[r>>2]=c[r>>2]&-2;c[a+(n+4)>>2]=q|1;c[k>>2]=q;i=b;return}r=m>>>3;if(m>>>0<256){m=c[a+(n+8)>>2]|0;u=c[a+(n+12)>>2]|0;v=2552+(r<<1<<2)|0;do{if((m|0)!=(v|0)){if(m>>>0<f>>>0){ka()}if((c[m+12>>2]|0)==(p|0)){break}ka()}}while(0);if((u|0)==(m|0)){c[628]=c[628]&~(1<<r);s=p;t=q;break}do{if((u|0)==(v|0)){w=u+8|0}else{if(u>>>0<f>>>0){ka()}x=u+8|0;if((c[x>>2]|0)==(p|0)){w=x;break}ka()}}while(0);c[m+12>>2]=u;c[w>>2]=m;s=p;t=q;break}v=o;r=c[a+(n+24)>>2]|0;x=c[a+(n+12)>>2]|0;do{if((x|0)==(v|0)){y=a+(n+20)|0;z=c[y>>2]|0;if((z|0)==0){A=a+(n+16)|0;B=c[A>>2]|0;if((B|0)==0){C=0;break}else{D=B;E=A}}else{D=z;E=y}while(1){y=D+20|0;z=c[y>>2]|0;if((z|0)!=0){E=y;D=z;continue}z=D+16|0;y=c[z>>2]|0;if((y|0)==0){break}else{D=y;E=z}}if(E>>>0<f>>>0){ka()}else{c[E>>2]=0;C=D;break}}else{z=c[a+(n+8)>>2]|0;if(z>>>0<f>>>0){ka()}y=z+12|0;if((c[y>>2]|0)!=(v|0)){ka()}A=x+8|0;if((c[A>>2]|0)==(v|0)){c[y>>2]=x;c[A>>2]=z;C=x;break}else{ka()}}}while(0);if((r|0)==0){s=p;t=q;break}x=c[a+(n+28)>>2]|0;o=2816+(x<<2)|0;do{if((v|0)==(c[o>>2]|0)){c[o>>2]=C;if((C|0)!=0){break}c[2516>>2]=c[2516>>2]&~(1<<x);s=p;t=q;break a}else{if(r>>>0<(c[2528>>2]|0)>>>0){ka()}m=r+16|0;if((c[m>>2]|0)==(v|0)){c[m>>2]=C}else{c[r+20>>2]=C}if((C|0)==0){s=p;t=q;break a}}}while(0);if(C>>>0<(c[2528>>2]|0)>>>0){ka()}c[C+24>>2]=r;v=c[a+(n+16)>>2]|0;do{if((v|0)!=0){if(v>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[C+16>>2]=v;c[v+24>>2]=C;break}}}while(0);v=c[a+(n+20)>>2]|0;if((v|0)==0){s=p;t=q;break}if(v>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[C+20>>2]=v;c[v+24>>2]=C;s=p;t=q;break}}else{s=e;t=j}}while(0);e=s;if(!(e>>>0<k>>>0)){ka()}C=a+(j+ -4)|0;f=c[C>>2]|0;if((f&1|0)==0){ka()}do{if((f&2|0)==0){if((l|0)==(c[2536>>2]|0)){D=(c[2524>>2]|0)+t|0;c[2524>>2]=D;c[2536>>2]=s;c[s+4>>2]=D|1;if((s|0)!=(c[2532>>2]|0)){i=b;return}c[2532>>2]=0;c[2520>>2]=0;i=b;return}if((l|0)==(c[2532>>2]|0)){D=(c[2520>>2]|0)+t|0;c[2520>>2]=D;c[2532>>2]=s;c[s+4>>2]=D|1;c[e+D>>2]=D;i=b;return}D=(f&-8)+t|0;E=f>>>3;b:do{if(f>>>0<256){w=c[a+j>>2]|0;h=c[a+(j|4)>>2]|0;d=2552+(E<<1<<2)|0;do{if((w|0)!=(d|0)){if(w>>>0<(c[2528>>2]|0)>>>0){ka()}if((c[w+12>>2]|0)==(l|0)){break}ka()}}while(0);if((h|0)==(w|0)){c[628]=c[628]&~(1<<E);break}do{if((h|0)==(d|0)){F=h+8|0}else{if(h>>>0<(c[2528>>2]|0)>>>0){ka()}g=h+8|0;if((c[g>>2]|0)==(l|0)){F=g;break}ka()}}while(0);c[w+12>>2]=h;c[F>>2]=w}else{d=k;g=c[a+(j+16)>>2]|0;v=c[a+(j|4)>>2]|0;do{if((v|0)==(d|0)){r=a+(j+12)|0;x=c[r>>2]|0;if((x|0)==0){o=a+(j+8)|0;m=c[o>>2]|0;if((m|0)==0){G=0;break}else{H=m;I=o}}else{H=x;I=r}while(1){r=H+20|0;x=c[r>>2]|0;if((x|0)!=0){I=r;H=x;continue}x=H+16|0;r=c[x>>2]|0;if((r|0)==0){break}else{H=r;I=x}}if(I>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[I>>2]=0;G=H;break}}else{x=c[a+j>>2]|0;if(x>>>0<(c[2528>>2]|0)>>>0){ka()}r=x+12|0;if((c[r>>2]|0)!=(d|0)){ka()}o=v+8|0;if((c[o>>2]|0)==(d|0)){c[r>>2]=v;c[o>>2]=x;G=v;break}else{ka()}}}while(0);if((g|0)==0){break}v=c[a+(j+20)>>2]|0;w=2816+(v<<2)|0;do{if((d|0)==(c[w>>2]|0)){c[w>>2]=G;if((G|0)!=0){break}c[2516>>2]=c[2516>>2]&~(1<<v);break b}else{if(g>>>0<(c[2528>>2]|0)>>>0){ka()}h=g+16|0;if((c[h>>2]|0)==(d|0)){c[h>>2]=G}else{c[g+20>>2]=G}if((G|0)==0){break b}}}while(0);if(G>>>0<(c[2528>>2]|0)>>>0){ka()}c[G+24>>2]=g;d=c[a+(j+8)>>2]|0;do{if((d|0)!=0){if(d>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[G+16>>2]=d;c[d+24>>2]=G;break}}}while(0);d=c[a+(j+12)>>2]|0;if((d|0)==0){break}if(d>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[G+20>>2]=d;c[d+24>>2]=G;break}}}while(0);c[s+4>>2]=D|1;c[e+D>>2]=D;if((s|0)!=(c[2532>>2]|0)){J=D;break}c[2520>>2]=D;i=b;return}else{c[C>>2]=f&-2;c[s+4>>2]=t|1;c[e+t>>2]=t;J=t}}while(0);t=J>>>3;if(J>>>0<256){e=t<<1;f=2552+(e<<2)|0;C=c[628]|0;G=1<<t;do{if((C&G|0)==0){c[628]=C|G;K=2552+(e+2<<2)|0;L=f}else{t=2552+(e+2<<2)|0;j=c[t>>2]|0;if(!(j>>>0<(c[2528>>2]|0)>>>0)){K=t;L=j;break}ka()}}while(0);c[K>>2]=s;c[L+12>>2]=s;c[s+8>>2]=L;c[s+12>>2]=f;i=b;return}f=s;L=J>>>8;do{if((L|0)==0){M=0}else{if(J>>>0>16777215){M=31;break}K=(L+1048320|0)>>>16&8;e=L<<K;G=(e+520192|0)>>>16&4;C=e<<G;e=(C+245760|0)>>>16&2;j=14-(G|K|e)+(C<<e>>>15)|0;M=J>>>(j+7|0)&1|j<<1}}while(0);L=2816+(M<<2)|0;c[s+28>>2]=M;c[s+20>>2]=0;c[s+16>>2]=0;j=c[2516>>2]|0;e=1<<M;c:do{if((j&e|0)==0){c[2516>>2]=j|e;c[L>>2]=f;c[s+24>>2]=L;c[s+12>>2]=s;c[s+8>>2]=s}else{C=c[L>>2]|0;if((M|0)==31){N=0}else{N=25-(M>>>1)|0}d:do{if((c[C+4>>2]&-8|0)==(J|0)){O=C}else{K=J<<N;G=C;while(1){P=G+(K>>>31<<2)+16|0;t=c[P>>2]|0;if((t|0)==0){break}if((c[t+4>>2]&-8|0)==(J|0)){O=t;break d}else{K=K<<1;G=t}}if(P>>>0<(c[2528>>2]|0)>>>0){ka()}else{c[P>>2]=f;c[s+24>>2]=G;c[s+12>>2]=s;c[s+8>>2]=s;break c}}}while(0);C=O+8|0;D=c[C>>2]|0;K=c[2528>>2]|0;if(O>>>0<K>>>0){ka()}if(D>>>0<K>>>0){ka()}else{c[D+12>>2]=f;c[C>>2]=f;c[s+8>>2]=D;c[s+12>>2]=O;c[s+24>>2]=0;break}}}while(0);s=(c[2544>>2]|0)+ -1|0;c[2544>>2]=s;if((s|0)==0){Q=2968|0}else{i=b;return}while(1){s=c[Q>>2]|0;if((s|0)==0){break}else{Q=s+8|0}}c[2544>>2]=-1;i=b;return}function Bb(b,c,d){b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0,h=0,j=0,k=0,l=0,m=0;e=i;a:do{if((d|0)==0){f=0}else{g=d;h=b;j=c;while(1){k=a[h]|0;l=a[j]|0;if(!(k<<24>>24==l<<24>>24)){break}m=g+ -1|0;if((m|0)==0){f=0;break a}else{g=m;h=h+1|0;j=j+1|0}}f=(k&255)-(l&255)|0}}while(0);i=e;return f|0}function Cb(){}function Db(b,d,e){b=b|0;d=d|0;e=e|0;var f=0,g=0,h=0,i=0;f=b+e|0;if((e|0)>=20){d=d&255;g=b&3;h=d|d<<8|d<<16|d<<24;i=f&~3;if(g){g=b+4-g|0;while((b|0)<(g|0)){a[b]=d;b=b+1|0}}while((b|0)<(i|0)){c[b>>2]=h;b=b+4|0}}while((b|0)<(f|0)){a[b]=d;b=b+1|0}return b-e|0}function Eb(b){b=b|0;var c=0;c=b;while(a[c]|0){c=c+1|0}return c-b|0}function Fb(b,d,e){b=b|0;d=d|0;e=e|0;var f=0;if((e|0)>=4096)return ua(b|0,d|0,e|0)|0;f=b|0;if((b&3)==(d&3)){while(b&3){if((e|0)==0)return f|0;a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}while((e|0)>=4){c[b>>2]=c[d>>2];b=b+4|0;d=d+4|0;e=e-4|0}}while((e|0)>0){a[b]=a[d]|0;b=b+1|0;d=d+1|0;e=e-1|0}return f|0}




// EMSCRIPTEN_END_FUNCS
return{_malloc:zb,_strlen:Eb,_free:Ab,_SpcJsDestroy:wb,_memset:Db,_SpcJsInit:xb,_SpcJsDecodeAudio:yb,_memcpy:Fb,runPostSets:Cb,stackAlloc:za,stackSave:Aa,stackRestore:Ba,setThrew:Ca,setTempRet0:Fa,setTempRet1:Ga,setTempRet2:Ha,setTempRet3:Ia,setTempRet4:Ja,setTempRet5:Ka,setTempRet6:La,setTempRet7:Ma,setTempRet8:Na,setTempRet9:Oa}
// EMSCRIPTEN_END_ASM

})({Math:Math,Int8Array:Int8Array,Int16Array:Int16Array,Int32Array:Int32Array,Uint8Array:Uint8Array,Uint16Array:Uint16Array,Uint32Array:Uint32Array,Float32Array:Float32Array,Float64Array:Float64Array},{abort:F,assert:B,asmPrintInt:function(a,b){r.print("int "+a+","+b)},asmPrintFloat:function(a,b){r.print("float "+a+","+b)},min:ra,_sysconf:function(a){switch(a){case 30:return 4096;case 132:case 133:case 12:case 137:case 138:case 15:case 235:case 16:case 17:case 18:case 19:case 20:case 149:case 13:case 10:case 236:case 153:case 9:case 21:case 22:case 159:case 154:case 14:case 77:case 78:case 139:case 80:case 81:case 79:case 82:case 68:case 67:case 164:case 11:case 29:case 47:case 48:case 95:case 52:case 51:case 46:return 200809;
case 27:case 246:case 127:case 128:case 23:case 24:case 160:case 161:case 181:case 182:case 242:case 183:case 184:case 243:case 244:case 245:case 165:case 178:case 179:case 49:case 50:case 168:case 169:case 175:case 170:case 171:case 172:case 97:case 76:case 32:case 173:case 35:return-1;case 176:case 177:case 7:case 155:case 8:case 157:case 125:case 126:case 92:case 93:case 129:case 130:case 131:case 94:case 91:return 1;case 74:case 60:case 69:case 70:case 4:return 1024;case 31:case 42:case 72:return 32;
case 87:case 26:case 33:return 2147483647;case 34:case 1:return 47839;case 38:case 36:return 99;case 43:case 37:return 2048;case 0:return 2097152;case 3:return 65536;case 28:return 32768;case 44:return 32767;case 75:return 16384;case 39:return 1E3;case 89:return 700;case 71:return 256;case 40:return 255;case 2:return 100;case 180:return 64;case 25:return 20;case 5:return 16;case 6:return 6;case 73:return 4;case 84:return 1}ab(T.u);return-1},_llvm_lifetime_start:q(),_fflush:q(),__formatString:cc,_mkport:Xb,
_send:function(a,b,c){return!Z.$b(a)?(ab(T.fa),-1):Yb(a,b,c)},_pwrite:function(a,b,c,d){a=X[a];if(!a)return ab(T.fa),-1;try{return Qb(a,L,b,c,d)}catch(e){return wb(e),-1}},_abort:function(){r.abort()},__reallyNegative:bc,_fwrite:$b,_sbrk:gc,_printf:function(a,b){return ec(N[qb>>2],a,b)},_fprintf:ec,___setErrNo:ab,_llvm_lifetime_end:q(),_fileno:Zb,_write:Yb,_emscripten_memcpy_big:function(a,b,c){P.set(P.subarray(b,b+c),a);return a},___assert_fail:function(a,b,c,d){ia=l;f("Assertion failed: "+D(a)+
", at: "+[b?D(b):"unknown filename",c,d?D(d):"unknown function"]+" at "+Ca())},___errno_location:function(){return $a},_time:function(a){var b=Math.floor(Date.now()/1E3);a&&(N[a>>2]=b);return b},STACKTOP:x,STACK_MAX:Ha,tempDoublePtr:Za,ABORT:ia,NaN:NaN,Infinity:Infinity},R),Aa=r._malloc=$._malloc,ac=r._strlen=$._strlen;r._free=$._free;r._SpcJsDestroy=$._SpcJsDestroy;var bb=r._memset=$._memset;r._SpcJsInit=$._SpcJsInit;r._SpcJsDecodeAudio=$._SpcJsDecodeAudio;var fc=r._memcpy=$._memcpy;
r.runPostSets=$.runPostSets;z.Ua=function(a){return $.stackAlloc(a)};z.Wa=function(){return $.stackSave()};z.Va=function(a){$.stackRestore(a)};var dc=m;function wc(a){this.name="ExitStatus";this.message="Program terminated with exit("+a+")";this.status=a}wc.prototype=Error();var xc,yc=m,Wa=function zc(){!r.calledRun&&Ac&&Bc();r.calledRun||(Wa=zc)};
r.callMain=r.ye=function(a){function b(){for(var a=0;3>a;a++)d.push(0)}B(0==S,"cannot call main when async dependencies remain! (listen on __ATMAIN__)");B(0==La.length,"cannot call main when preRun functions remain to be called");a=a||[];ba&&yc!==m&&r.V("preload time: "+(Date.now()-yc)+" ms");Qa||(Qa=l,Ka(Ma));var c=a.length+1,d=[O(K("/bin/this.program"),"i8",0)];b();for(var e=0;e<c-1;e+=1)d.push(O(K(a[e]),"i8",0)),b();d.push(0);d=O(d,"i32",0);xc=x;try{var g=r._main(c,d,0);r.noExitRuntime||Cc(g)}catch(h){h instanceof
wc||("SimulateInfiniteLoop"==h?r.noExitRuntime=l:(h&&("object"===typeof h&&h.stack)&&r.V("exception thrown: "+[h,h.stack]),f(h)))}finally{}};
function Bc(a){function b(){if(!r.calledRun){r.calledRun=l;Qa||(Qa=l,Ka(Ma));Ka(Na);r._main&&Ac&&r.callMain(a);if(r.postRun)for("function"==typeof r.postRun&&(r.postRun=[r.postRun]);r.postRun.length;)Sa(r.postRun.shift());Ka(Pa)}}a=a||r.arguments;yc===m&&(yc=Date.now());if(0<S)r.V("run() called, but dependencies remain, so not running");else{if(r.preRun)for("function"==typeof r.preRun&&(r.preRun=[r.preRun]);r.preRun.length;)Ra(r.preRun.shift());Ka(La);!(0<S)&&!r.calledRun&&(r.setStatus?(r.setStatus("Running..."),
setTimeout(function(){setTimeout(function(){r.setStatus("")},1);ia||b()},1)):b())}}r.run=r.Ye=Bc;function Cc(a){ia=l;x=xc;Ka(Oa);f(new wc(a))}r.exit=r.Ce=Cc;function F(a){a&&(r.print(a),r.V(a));ia=l;f("abort() at "+Ca()+"\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.")}r.abort=r.abort=F;if(r.preInit)for("function"==typeof r.preInit&&(r.preInit=[r.preInit]);0<r.preInit.length;)r.preInit.pop()();var Ac=l;r.noInitialRun&&(Ac=n);Bc();

(function() {
  var global;
  global = this;
  var AV;

AV = {};

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AV.Base = (function() {
  var fnTest;

  function Base() {}

  fnTest = /\b_super\b/;

  Base.extend = function(prop) {
    var Class, fn, key, keys, _ref, _super;
    Class = (function(_super) {
      __extends(Class, _super);

      function Class() {
        return Class.__super__.constructor.apply(this, arguments);
      }

      return Class;

    })(this);
    if (typeof prop === 'function') {
      keys = Object.keys(Class.prototype);
      prop.call(Class, Class);
      prop = {};
      _ref = Class.prototype;
      for (key in _ref) {
        fn = _ref[key];
        if (__indexOf.call(keys, key) < 0) {
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
    var _ref;
    if (input instanceof Uint8Array) {
      this.data = input;
    } else if (input instanceof ArrayBuffer || Array.isArray(input) || typeof input === 'number' || AV.isNode && ((_ref = global.Buffer) != null ? _ref.isBuffer(input) : void 0)) {
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
    var _ref;
    buffer.prev = this.last;
    if ((_ref = this.last) != null) {
      _ref.next = buffer;
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
    var _ref;
    if (this.first && !this.first.prev) {
      return false;
    }
    this.first = ((_ref = this.first) != null ? _ref.prev : void 0) || this.last;
    if (this.first) {
      this.availableBytes += this.first.length;
      this.availableBuffers++;
    }
    return this.first != null;
  };

  BufferList.prototype.reset = function() {
    var _results;
    _results = [];
    while (this.rewind()) {
      continue;
    }
    return _results;
  };

  return BufferList;

})();

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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

  AV.UnderflowError = (function(_super) {
    __extends(UnderflowError, _super);

    function UnderflowError() {
      this.name = 'AV.UnderflowError';
    }

    return UnderflowError;

  })(Error);

  function Stream(list) {
    this.list = list;
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
    var i, _i, _j, _ref;
    if (littleEndian == null) {
      littleEndian = false;
    }
    if (littleEndian === nativeEndian) {
      for (i = _i = 0; _i < bytes; i = _i += 1) {
        uint8[i] = this.readUInt8();
      }
    } else {
      for (i = _j = _ref = bytes - 1; _j >= 0; i = _j += -1) {
        uint8[i] = this.readUInt8();
      }
    }
  };

  Stream.prototype.peek = function(bytes, offset, littleEndian) {
    var i, _i, _j;
    if (littleEndian == null) {
      littleEndian = false;
    }
    if (littleEndian === nativeEndian) {
      for (i = _i = 0; _i < bytes; i = _i += 1) {
        uint8[i] = this.peekUInt8(offset + i);
      }
    } else {
      for (i = _j = 0; _j < bytes; i = _j += 1) {
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
    var i, result, to, _i;
    result = AV.Buffer.allocate(length);
    to = result.data;
    for (i = _i = 0; _i < length; i = _i += 1) {
      to[i] = this.readUInt8();
    }
    return result;
  };

  Stream.prototype.peekBuffer = function(offset, length) {
    var i, result, to, _i;
    if (offset == null) {
      offset = 0;
    }
    result = AV.Buffer.allocate(length);
    to = result.data;
    for (i = _i = 0; _i < length; i = _i += 1) {
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __slice = [].slice;

AV.EventEmitter = (function(_super) {
  __extends(EventEmitter, _super);

  function EventEmitter() {
    return EventEmitter.__super__.constructor.apply(this, arguments);
  }

  EventEmitter.prototype.on = function(event, fn) {
    var _base;
    if (this.events == null) {
      this.events = {};
    }
    if ((_base = this.events)[event] == null) {
      _base[event] = [];
    }
    return this.events[event].push(fn);
  };

  EventEmitter.prototype.off = function(event, fn) {
    var index, _ref;
    if (!((_ref = this.events) != null ? _ref[event] : void 0)) {
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
    var args, event, fn, _i, _len, _ref, _ref1;
    event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    if (!((_ref = this.events) != null ? _ref[event] : void 0)) {
      return;
    }
    _ref1 = this.events[event].slice();
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      fn = _ref1[_i];
      fn.apply(this, args);
    }
  };

  return EventEmitter;

})(AV.Base);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.BufferSource = (function(_super) {
  var clearImmediate, setImmediate;

  __extends(BufferSource, _super);

  function BufferSource(input) {
    this.loop = __bind(this.loop, this);
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.Demuxer = (function(_super) {
  var formats;

  __extends(Demuxer, _super);

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
    var format, stream, _i, _len;
    stream = AV.Stream.fromBuffer(buffer);
    for (_i = 0, _len = formats.length; _i < _len; _i++) {
      format = formats[_i];
      if (format.probe(stream)) {
        return format;
      }
    }
    return null;
  };

  return Demuxer;

})(AV.EventEmitter);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.Decoder = (function(_super) {
  var codecs;

  __extends(Decoder, _super);

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

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.Queue = (function(_super) {
  __extends(Queue, _super);

  function Queue(asset) {
    this.asset = asset;
    this.write = __bind(this.write, this);
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

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.AudioDevice = (function(_super) {
  var devices;

  __extends(AudioDevice, _super);

  function AudioDevice(sampleRate, channels) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.updateTime = __bind(this.updateTime, this);
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
    this.stop();
    return this.device.destroy();
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
    var device, _i, _len;
    for (_i = 0, _len = devices.length; _i < _len; _i++) {
      device = devices[_i];
      if (device.supported) {
        return new device(sampleRate, channels);
      }
    }
    return null;
  };

  return AudioDevice;

})(AV.EventEmitter);

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.Asset = (function(_super) {
  __extends(Asset, _super);

  function Asset(source) {
    this.source = source;
    this._decode = __bind(this._decode, this);
    this.findDecoder = __bind(this.findDecoder, this);
    this.probe = __bind(this.probe, this);
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
      var buf, chunk, offset, _i, _len;
      buf = new Float32Array(length);
      offset = 0;
      for (_i = 0, _len = chunks.length; _i < _len; _i++) {
        chunk = chunks[_i];
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
          var buf, i, sample, _i, _len;
          buf = new Float32Array(buffer.length);
          for (i = _i = 0, _len = buffer.length; _i < _len; i = ++_i) {
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

var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.Player = (function(_super) {
  __extends(Player, _super);

  function Player(asset) {
    this.asset = asset;
    this.startPlaying = __bind(this.startPlaying, this);
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
    var _ref;
    if (this.playing) {
      return;
    }
    if (!this.startedPreloading) {
      this.preload();
    }
    this.playing = true;
    return (_ref = this.device) != null ? _ref.start() : void 0;
  };

  Player.prototype.pause = function() {
    var _ref;
    if (!this.playing) {
      return;
    }
    this.playing = false;
    return (_ref = this.device) != null ? _ref.stop() : void 0;
  };

  Player.prototype.togglePlayback = function() {
    if (this.playing) {
      return this.pause();
    } else {
      return this.play();
    }
  };

  Player.prototype.stop = function() {
    var _ref;
    this.pause();
    this.asset.stop();
    return (_ref = this.device) != null ? _ref.destroy() : void 0;
  };

  Player.prototype.seek = function(timestamp) {
    var _ref;
    if ((_ref = this.device) != null) {
      _ref.stop();
    }
    this.queue.once('ready', (function(_this) {
      return function() {
        var _ref1, _ref2;
        if ((_ref1 = _this.device) != null) {
          _ref1.seek(_this.currentTime);
        }
        if (_this.playing) {
          return (_ref2 = _this.device) != null ? _ref2.start() : void 0;
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
        var bufferOffset, filter, i, max, _i, _j, _len, _ref;
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
          for (i = _i = 0; _i < max; i = _i += 1) {
            buffer[bufferOffset++] = frame[frameOffset++];
          }
          if (frameOffset === frame.length) {
            frame = _this.queue.read();
            frameOffset = 0;
          }
        }
        _ref = _this.filters;
        for (_j = 0, _len = _ref.length; _j < _len; _j++) {
          filter = _ref[_j];
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

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.VolumeFilter = (function(_super) {
  __extends(VolumeFilter, _super);

  function VolumeFilter() {
    return VolumeFilter.__super__.constructor.apply(this, arguments);
  }

  VolumeFilter.prototype.process = function(buffer) {
    var i, vol, _i, _ref;
    if (this.value >= 100) {
      return;
    }
    vol = Math.max(0, Math.min(100, this.value)) / 100;
    for (i = _i = 0, _ref = buffer.length; _i < _ref; i = _i += 1) {
      buffer[i] *= vol;
    }
  };

  return VolumeFilter;

})(AV.Filter);

var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.BalanceFilter = (function(_super) {
  __extends(BalanceFilter, _super);

  function BalanceFilter() {
    return BalanceFilter.__super__.constructor.apply(this, arguments);
  }

  BalanceFilter.prototype.process = function(buffer) {
    var i, pan, _i, _ref;
    if (this.value === 0) {
      return;
    }
    pan = Math.max(-50, Math.min(50, this.value));
    for (i = _i = 0, _ref = buffer.length; _i < _ref; i = _i += 2) {
      buffer[i] *= Math.min(1, (50 - pan) / 50);
      buffer[i + 1] *= Math.min(1, (50 + pan) / 50);
    }
  };

  return BalanceFilter;

})(AV.Filter);
  var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.HTTPSource = (function(_super) {
  __extends(HTTPSource, _super);

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
        var buf, buffer, i, txt, _i, _ref;
        if (_this.xhr.response) {
          buf = new Uint8Array(_this.xhr.response);
        } else {
          txt = _this.xhr.responseText;
          buf = new Uint8Array(txt.length);
          for (i = _i = 0, _ref = txt.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
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
    var _ref;
    this.inflight = false;
    return (_ref = this.xhr) != null ? _ref.abort() : void 0;
  };

  HTTPSource.prototype.reset = function() {
    this.pause();
    return this.offset = 0;
  };

  return HTTPSource;

})(AV.EventEmitter);
  var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AV.FileSource = (function(_super) {
  __extends(FileSource, _super);

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
    var _ref;
    this.active = false;
    return (_ref = this.reader) != null ? _ref.abort() : void 0;
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

WebAudioDevice = (function(_super) {
  var AudioContext, createProcessor, sharedContext;

  __extends(WebAudioDevice, _super);

  AV.AudioDevice.register(WebAudioDevice);

  AudioContext = global.AudioContext || global.webkitAudioContext;

  WebAudioDevice.supported = AudioContext && (typeof AudioContext.prototype[createProcessor = 'createScriptProcessor'] === 'function' || typeof AudioContext.prototype[createProcessor = 'createJavaScriptNode'] === 'function');

  sharedContext = null;

  function WebAudioDevice(sampleRate, channels) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.refill = __bind(this.refill, this);
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
    var channelCount, channels, data, i, n, outputBuffer, _i, _j, _k, _ref;
    outputBuffer = event.outputBuffer;
    channelCount = outputBuffer.numberOfChannels;
    channels = new Array(channelCount);
    for (i = _i = 0; _i < channelCount; i = _i += 1) {
      channels[i] = outputBuffer.getChannelData(i);
    }
    data = new Float32Array(this.bufferSize);
    this.emit('refill', data);
    if (this.resampler) {
      data = this.resampler.resampler(data);
    }
    for (i = _j = 0, _ref = outputBuffer.length; _j < _ref; i = _j += 1) {
      for (n = _k = 0; _k < channelCount; n = _k += 1) {
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
  var MozillaAudioDevice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

MozillaAudioDevice = (function(_super) {
  var createTimer, destroyTimer;

  __extends(MozillaAudioDevice, _super);

  AV.AudioDevice.register(MozillaAudioDevice);

  MozillaAudioDevice.supported = (typeof Audio !== "undefined" && Audio !== null) && 'mozWriteAudio' in new Audio;

  function MozillaAudioDevice(sampleRate, channels) {
    this.sampleRate = sampleRate;
    this.channels = channels;
    this.refill = __bind(this.refill, this);
    this.audio = new Audio;
    this.audio.mozSetup(this.channels, this.sampleRate);
    this.writePosition = 0;
    this.prebufferSize = this.sampleRate / 2;
    this.tail = null;
    this.timer = createTimer(this.refill, 100);
  }

  MozillaAudioDevice.prototype.refill = function() {
    var available, buffer, currentPosition, written;
    if (this.tail) {
      written = this.audio.mozWriteAudio(this.tail);
      this.writePosition += written;
      if (this.writePosition < this.tail.length) {
        this.tail = this.tail.subarray(written);
      } else {
        this.tail = null;
      }
    }
    currentPosition = this.audio.mozCurrentSampleOffset();
    available = currentPosition + this.prebufferSize - this.writePosition;
    if (available > 0) {
      buffer = new Float32Array(available);
      this.emit('refill', buffer);
      written = this.audio.mozWriteAudio(buffer);
      if (written < buffer.length) {
        this.tail = buffer.subarray(written);
      }
      this.writePosition += written;
    }
  };

  MozillaAudioDevice.prototype.destroy = function() {
    return destroyTimer(this.timer);
  };

  MozillaAudioDevice.prototype.getDeviceTime = function() {
    return this.audio.mozCurrentSampleOffset() / this.channels;
  };

  createTimer = function(fn, interval) {
    var url, worker;
    url = AV.Buffer.makeBlobURL("setInterval(function() { postMessage('ping'); }, " + interval + ");");
    if (url == null) {
      return setInterval(fn, interval);
    }
    worker = new Worker(url);
    worker.onmessage = fn;
    worker.url = url;
    return worker;
  };

  destroyTimer = function(timer) {
    if (timer.terminate) {
      timer.terminate();
      return URL.revokeObjectURL(timer.url);
    } else {
      return clearInterval(timer);
    }
  };

  return MozillaAudioDevice;

})(AV.EventEmitter);
  return global.AV = AV;
})();
var SPCDemuxer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPCDemuxer = (function(_super) {
  __extends(SPCDemuxer, _super);

  function SPCDemuxer() {
    this.readChunk = __bind(this.readChunk, this);
    return SPCDemuxer.__super__.constructor.apply(this, arguments);
  }

  AV.Demuxer.register(SPCDemuxer);

  SPCDemuxer.probe = function(buffer) {
    return buffer.peekString(0, 33) === 'SNES-SPC700 Sound File Data v0.30';
  };

  SPCDemuxer.prototype.init = function() {
    var buffer, fileBuffer, length;
    if (this.stream.available(8)) {
      buffer = this.stream.list.first;
      length = buffer.length;
      fileBuffer = Module._malloc(length);
      Module.HEAPU8.set(buffer.data, fileBuffer);
      return Module.ccall("SpcJsInit", "void", ["number", "number"], [fileBuffer, length]);
    }
  };

  SPCDemuxer.prototype.readChunk = function() {
    var align, buf, duration, fadeOut, id666_length, list, offset, sub_chunk_data, sub_chunk_id, sub_chunk_length, sub_chunk_raw, sub_chunk_type;
    if (!this.readStart && this.stream.available(33)) {
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
    this.metedata = {
      songTitle: this.stream.peekString(46, 32),
      gameTitle: this.stream.peekString(78, 32),
      dumper: this.stream.peekString(110, 16),
      comments: this.stream.peekString(126, 32),
      dumpDate: this.stream.peekString(158, 11),
      artist: this.stream.peekString(177, 32)
    };
    if (this.stream.list.availableBytes > (66048 + 4) && this.stream.peekString(66048, 4) === 'xid6') {
      id666_length = this.stream.peekUInt32(66052, true);
      if (this.stream.list.availableBytes >= (66048 + 4 + id666_length)) {
        offset = 66056;
        align = 4;
        while (offset < this.stream.list.availableBytes) {
          sub_chunk_id = this.stream.peekUInt8(offset);
          sub_chunk_type = this.stream.peekUInt8(offset + 1);
          if (sub_chunk_type === 1) {
            sub_chunk_length = this.stream.peekUInt16(offset + 2, true);
            sub_chunk_data = this.stream.peekString(offset + 3, sub_chunk_length);
            offset += 4 + sub_chunk_length - 1;
          } else if (sub_chunk_type === 0) {
            sub_chunk_data = this.stream.peekUInt16(offset + 2, true);
            list = new AV.BufferList;
            list.append(this.stream.peekSingleBuffer(offset + 2, 2));
            sub_chunk_raw = new AV.Stream(list);
            offset += 4;
          } else if (sub_chunk_type === 4) {
            sub_chunk_data = this.stream.peekUInt32(offset + 4, true);
            offset += 8;
          }
          offset = (offset + align - 1) & ~(align - 1);
          switch (sub_chunk_id) {
            case 1:
              this.metedata['songName'] = sub_chunk_data;
              break;
            case 2:
              this.metedata['gameName'] = sub_chunk_data;
              break;
            case 3:
              this.metedata['artistName'] = sub_chunk_data;
              break;
            case 4:
              this.metedata['dumperName'] = sub_chunk_data;
              break;
            case 5:
              this.metedata['dateDumped'] = sub_chunk_data;
              break;
            case 6:
              if (sub_chunk_data === 0) {
                this.metedata['emulatorUsed'] = 'ZSNES';
              } else if (sub_chunk_data === 1) {
                this.metedata['emulatorUsed'] = 'ZSNES';
              } else {
                this.metedata['emulatorUsed'] = "Unknown Emulator (" + sub_chunk_data + ")";
              }
              break;
            case 7:
              this.metedata['comments'] = sub_chunk_data;
              break;
            case 16:
              this.metedata['ost'] = sub_chunk_data;
              break;
            case 17:
              this.metedata['ostDisc'] = sub_chunk_data;
              break;
            case 18:
              this.metedata['ostTrack'] = sub_chunk_raw.peekUInt8(1) + String.fromCharCode(sub_chunk_raw.peekUInt8(0));
              break;
            case 19:
              this.metedata['publisherName'] = sub_chunk_data;
              break;
            case 20:
              this.metedata['copyrightYear'] = sub_chunk_data;
              break;
            case 48:
              this.metedata['introLength'] = sub_chunk_data;
              break;
            case 49:
              this.metedata['loopLength'] = sub_chunk_data;
              break;
            case 50:
              this.metedata['endLength'] = sub_chunk_data;
              break;
            case 51:
              this.metedata['fadeLength'] = sub_chunk_data;
              break;
            case 52:
              this.metedata['mutedChannels'] = sub_chunk_data;
              break;
            case 53:
              this.metedata['loopCount'] = sub_chunk_data;
              break;
            case 54:
              this.metedata['amplification'] = sub_chunk_data;
              break;
            default:
              console.log('Unknown Field:', sub_chunk_id, ':', sub_chunk_type, ':', sub_chunk_data);
          }
        }
      }
    }
    this.emit('metadata', this.metedata);
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
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

SPCDecoder = (function(_super) {
  __extends(SPCDecoder, _super);

  function SPCDecoder() {
    this.readChunk = __bind(this.readChunk, this);
    this.init = __bind(this.init, this);
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
    if (!this.stream.available(66000)) {
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
