(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js
  var require_bcmodsdk = __commonJS({
    "node_modules/bondage-club-mod-sdk/dist/bcmodsdk.js"(exports) {
      var bcModSdk = (function() {
        "use strict";
        const o = "1.2.0";
        function e(o2) {
          alert("Mod ERROR:\n" + o2);
          const e2 = new Error(o2);
          throw console.error(e2), e2;
        }
        const t = new TextEncoder();
        function n(o2) {
          return !!o2 && "object" == typeof o2 && !Array.isArray(o2);
        }
        function r(o2) {
          const e2 = /* @__PURE__ */ new Set();
          return o2.filter(((o3) => !e2.has(o3) && e2.add(o3)));
        }
        const i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
        function c(o2) {
          a.has(o2) || (a.add(o2), console.warn(o2));
        }
        function s(o2) {
          const e2 = [], t2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set();
          for (const r3 of f.values()) {
            const i3 = r3.patching.get(o2.name);
            if (i3) {
              e2.push(...i3.hooks);
              for (const [e3, a2] of i3.patches.entries()) t2.has(e3) && t2.get(e3) !== a2 && c(`ModSDK: Mod '${r3.name}' is patching function ${o2.name} with same pattern that is already applied by different mod, but with different pattern:
Pattern:
${e3}
Patch1:
${t2.get(e3) || ""}
Patch2:
${a2}`), t2.set(e3, a2), n2.add(r3.name);
            }
          }
          e2.sort(((o3, e3) => e3.priority - o3.priority));
          const r2 = (function(o3, e3) {
            if (0 === e3.size) return o3;
            let t3 = o3.toString().replaceAll("\r\n", "\n");
            for (const [n3, r3] of e3.entries()) t3.includes(n3) || c(`ModSDK: Patching ${o3.name}: Patch ${n3} not applied`), t3 = t3.replaceAll(n3, r3);
            return (0, eval)(`(${t3})`);
          })(o2.original, t2);
          let i2 = function(e3) {
            var t3, i3;
            const a2 = null === (i3 = (t3 = m.errorReporterHooks).hookChainExit) || void 0 === i3 ? void 0 : i3.call(t3, o2.name, n2), c2 = r2.apply(this, e3);
            return null == a2 || a2(), c2;
          };
          for (let t3 = e2.length - 1; t3 >= 0; t3--) {
            const n3 = e2[t3], r3 = i2;
            i2 = function(e3) {
              var t4, i3;
              const a2 = null === (i3 = (t4 = m.errorReporterHooks).hookEnter) || void 0 === i3 ? void 0 : i3.call(t4, o2.name, n3.mod), c2 = n3.hook.apply(this, [e3, (o3) => {
                if (1 !== arguments.length || !Array.isArray(e3)) throw new Error(`Mod ${n3.mod} failed to call next hook: Expected args to be array, got ${typeof o3}`);
                return r3.call(this, o3);
              }]);
              return null == a2 || a2(), c2;
            };
          }
          return { hooks: e2, patches: t2, patchesSources: n2, enter: i2, final: r2 };
        }
        function l(o2, e2 = false) {
          let r2 = i.get(o2);
          if (r2) e2 && (r2.precomputed = s(r2));
          else {
            let e3 = window;
            const a2 = o2.split(".");
            for (let t2 = 0; t2 < a2.length - 1; t2++) if (e3 = e3[a2[t2]], !n(e3)) throw new Error(`ModSDK: Function ${o2} to be patched not found; ${a2.slice(0, t2 + 1).join(".")} is not object`);
            const c2 = e3[a2[a2.length - 1]];
            if ("function" != typeof c2) throw new Error(`ModSDK: Function ${o2} to be patched not found`);
            const l2 = (function(o3) {
              let e4 = -1;
              for (const n2 of t.encode(o3)) {
                let o4 = 255 & (e4 ^ n2);
                for (let e5 = 0; e5 < 8; e5++) o4 = 1 & o4 ? -306674912 ^ o4 >>> 1 : o4 >>> 1;
                e4 = e4 >>> 8 ^ o4;
              }
              return ((-1 ^ e4) >>> 0).toString(16).padStart(8, "0").toUpperCase();
            })(c2.toString().replaceAll("\r\n", "\n")), d2 = { name: o2, original: c2, originalHash: l2 };
            r2 = Object.assign(Object.assign({}, d2), { precomputed: s(d2), router: () => {
            }, context: e3, contextProperty: a2[a2.length - 1] }), r2.router = /* @__PURE__ */ (function(o3) {
              return function(...e4) {
                return o3.precomputed.enter.apply(this, [e4]);
              };
            })(r2), i.set(o2, r2), e3[r2.contextProperty] = r2.router;
          }
          return r2;
        }
        function d() {
          for (const o2 of i.values()) o2.precomputed = s(o2);
        }
        function p() {
          const o2 = /* @__PURE__ */ new Map();
          for (const [e2, t2] of i) o2.set(e2, { name: e2, original: t2.original, originalHash: t2.originalHash, sdkEntrypoint: t2.router, currentEntrypoint: t2.context[t2.contextProperty], hookedByMods: r(t2.precomputed.hooks.map(((o3) => o3.mod))), patchedByMods: Array.from(t2.precomputed.patchesSources) });
          return o2;
        }
        const f = /* @__PURE__ */ new Map();
        function u(o2) {
          f.get(o2.name) !== o2 && e(`Failed to unload mod '${o2.name}': Not registered`), f.delete(o2.name), o2.loaded = false, d();
        }
        function g(o2, t2) {
          o2 && "object" == typeof o2 || e("Failed to register mod: Expected info object, got " + typeof o2), "string" == typeof o2.name && o2.name || e("Failed to register mod: Expected name to be non-empty string, got " + typeof o2.name);
          let r2 = `'${o2.name}'`;
          "string" == typeof o2.fullName && o2.fullName || e(`Failed to register mod ${r2}: Expected fullName to be non-empty string, got ${typeof o2.fullName}`), r2 = `'${o2.fullName} (${o2.name})'`, "string" != typeof o2.version && e(`Failed to register mod ${r2}: Expected version to be string, got ${typeof o2.version}`), o2.repository || (o2.repository = void 0), void 0 !== o2.repository && "string" != typeof o2.repository && e(`Failed to register mod ${r2}: Expected repository to be undefined or string, got ${typeof o2.version}`), null == t2 && (t2 = {}), t2 && "object" == typeof t2 || e(`Failed to register mod ${r2}: Expected options to be undefined or object, got ${typeof t2}`);
          const i2 = true === t2.allowReplace, a2 = f.get(o2.name);
          a2 && (a2.allowReplace && i2 || e(`Refusing to load mod ${r2}: it is already loaded and doesn't allow being replaced.
Was the mod loaded multiple times?`), u(a2));
          const c2 = (o3) => {
            let e2 = g2.patching.get(o3.name);
            return e2 || (e2 = { hooks: [], patches: /* @__PURE__ */ new Map() }, g2.patching.set(o3.name, e2)), e2;
          }, s2 = (o3, t3) => (...n2) => {
            var i3, a3;
            const c3 = null === (a3 = (i3 = m.errorReporterHooks).apiEndpointEnter) || void 0 === a3 ? void 0 : a3.call(i3, o3, g2.name);
            g2.loaded || e(`Mod ${r2} attempted to call SDK function after being unloaded`);
            const s3 = t3(...n2);
            return null == c3 || c3(), s3;
          }, p2 = { unload: s2("unload", (() => u(g2))), hookFunction: s2("hookFunction", ((o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            "number" != typeof t3 && e(`Mod ${r2} failed to hook function '${o3}': Expected priority number, got ${typeof t3}`), "function" != typeof n2 && e(`Mod ${r2} failed to hook function '${o3}': Expected hook function, got ${typeof n2}`);
            const s3 = { mod: g2.name, priority: t3, hook: n2 };
            return a3.hooks.push(s3), d(), () => {
              const o4 = a3.hooks.indexOf(s3);
              o4 >= 0 && (a3.hooks.splice(o4, 1), d());
            };
          })), patchFunction: s2("patchFunction", ((o3, t3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3), a3 = c2(i3);
            n(t3) || e(`Mod ${r2} failed to patch function '${o3}': Expected patches object, got ${typeof t3}`);
            for (const [n2, i4] of Object.entries(t3)) "string" == typeof i4 ? a3.patches.set(n2, i4) : null === i4 ? a3.patches.delete(n2) : e(`Mod ${r2} failed to patch function '${o3}': Invalid format of patch '${n2}'`);
            d();
          })), removePatches: s2("removePatches", ((o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to patch a function: Expected function name string, got ${typeof o3}`);
            const t3 = l(o3);
            c2(t3).patches.clear(), d();
          })), callOriginal: s2("callOriginal", ((o3, t3, n2) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to call a function: Expected function name string, got ${typeof o3}`);
            const i3 = l(o3);
            return Array.isArray(t3) || e(`Mod ${r2} failed to call a function: Expected args array, got ${typeof t3}`), i3.original.apply(null != n2 ? n2 : globalThis, t3);
          })), getOriginalHash: s2("getOriginalHash", ((o3) => {
            "string" == typeof o3 && o3 || e(`Mod ${r2} failed to get hash: Expected function name string, got ${typeof o3}`);
            return l(o3).originalHash;
          })) }, g2 = { name: o2.name, fullName: o2.fullName, version: o2.version, repository: o2.repository, allowReplace: i2, api: p2, loaded: true, patching: /* @__PURE__ */ new Map() };
          return f.set(o2.name, g2), Object.freeze(p2);
        }
        function h() {
          const o2 = [];
          for (const e2 of f.values()) o2.push({ name: e2.name, fullName: e2.fullName, version: e2.version, repository: e2.repository });
          return o2;
        }
        let m;
        const y = void 0 === window.bcModSdk ? window.bcModSdk = (function() {
          const e2 = { version: o, apiVersion: 1, registerMod: g, getModsInfo: h, getPatchingInfo: p, errorReporterHooks: Object.seal({ apiEndpointEnter: null, hookEnter: null, hookChainExit: null }) };
          return m = e2, Object.freeze(e2);
        })() : (n(window.bcModSdk) || e("Failed to init Mod SDK: Name already in use"), 1 !== window.bcModSdk.apiVersion && e(`Failed to init Mod SDK: Different version already loaded ('1.2.0' vs '${window.bcModSdk.version}')`), window.bcModSdk.version !== o && alert(`Mod SDK warning: Loading different but compatible versions ('1.2.0' vs '${window.bcModSdk.version}')
One of mods you are using is using an old version of SDK. It will work for now but please inform author to update`), window.bcModSdk);
        return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", { value: true }), exports.default = y), y;
      })();
    }
  });

  // node_modules/lz-string/libs/lz-string.js
  var require_lz_string = __commonJS({
    "node_modules/lz-string/libs/lz-string.js"(exports, module) {
      var LZString2 = (function() {
        var f = String.fromCharCode;
        var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
        var baseReverseDic = {};
        function getBaseValue(alphabet, character) {
          if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (var i = 0; i < alphabet.length; i++) {
              baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
          }
          return baseReverseDic[alphabet][character];
        }
        var LZString3 = {
          compressToBase64: function(input) {
            if (input == null) return "";
            var res = LZString3._compress(input, 6, function(a) {
              return keyStrBase64.charAt(a);
            });
            switch (res.length % 4) {
              // To produce valid Base64
              default:
              // When could this happen ?
              case 0:
                return res;
              case 1:
                return res + "===";
              case 2:
                return res + "==";
              case 3:
                return res + "=";
            }
          },
          decompressFromBase64: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            return LZString3._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrBase64, input.charAt(index));
            });
          },
          compressToUTF16: function(input) {
            if (input == null) return "";
            return LZString3._compress(input, 15, function(a) {
              return f(a + 32);
            }) + " ";
          },
          decompressFromUTF16: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString3._decompress(compressed.length, 16384, function(index) {
              return compressed.charCodeAt(index) - 32;
            });
          },
          //compress into uint8array (UCS-2 big endian format)
          compressToUint8Array: function(uncompressed) {
            var compressed = LZString3.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2);
            for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
              var current_value = compressed.charCodeAt(i);
              buf[i * 2] = current_value >>> 8;
              buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
          },
          //decompress from uint8array (UCS-2 big endian format)
          decompressFromUint8Array: function(compressed) {
            if (compressed === null || compressed === void 0) {
              return LZString3.decompress(compressed);
            } else {
              var buf = new Array(compressed.length / 2);
              for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
              }
              var result = [];
              buf.forEach(function(c) {
                result.push(f(c));
              });
              return LZString3.decompress(result.join(""));
            }
          },
          //compress into a string that is already URI encoded
          compressToEncodedURIComponent: function(input) {
            if (input == null) return "";
            return LZString3._compress(input, 6, function(a) {
              return keyStrUriSafe.charAt(a);
            });
          },
          //decompress from an output of compressToEncodedURIComponent
          decompressFromEncodedURIComponent: function(input) {
            if (input == null) return "";
            if (input == "") return null;
            input = input.replace(/ /g, "+");
            return LZString3._decompress(input.length, 32, function(index) {
              return getBaseValue(keyStrUriSafe, input.charAt(index));
            });
          },
          compress: function(uncompressed) {
            return LZString3._compress(uncompressed, 16, function(a) {
              return f(a);
            });
          },
          _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null) return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
              context_c = uncompressed.charAt(ii);
              if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                context_dictionary[context_c] = context_dictSize++;
                context_dictionaryToCreate[context_c] = true;
              }
              context_wc = context_w + context_c;
              if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                context_w = context_wc;
              } else {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                  if (context_w.charCodeAt(0) < 256) {
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 8; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  } else {
                    value = 1;
                    for (i = 0; i < context_numBits; i++) {
                      context_data_val = context_data_val << 1 | value;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = 0;
                    }
                    value = context_w.charCodeAt(0);
                    for (i = 0; i < 16; i++) {
                      context_data_val = context_data_val << 1 | value & 1;
                      if (context_data_position == bitsPerChar - 1) {
                        context_data_position = 0;
                        context_data.push(getCharFromInt(context_data_val));
                        context_data_val = 0;
                      } else {
                        context_data_position++;
                      }
                      value = value >> 1;
                    }
                  }
                  context_enlargeIn--;
                  if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                  }
                  delete context_dictionaryToCreate[context_w];
                } else {
                  value = context_dictionary[context_w];
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                context_dictionary[context_wc] = context_dictSize++;
                context_w = String(context_c);
              }
            }
            if (context_w !== "") {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
            }
            value = 2;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1 | value & 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
            while (true) {
              context_data_val = context_data_val << 1;
              if (context_data_position == bitsPerChar - 1) {
                context_data.push(getCharFromInt(context_data_val));
                break;
              } else context_data_position++;
            }
            return context_data.join("");
          },
          decompress: function(compressed) {
            if (compressed == null) return "";
            if (compressed == "") return null;
            return LZString3._decompress(compressed.length, 32768, function(index) {
              return compressed.charCodeAt(index);
            });
          },
          _decompress: function(length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
              dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (next = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                c = f(bits);
                break;
              case 2:
                return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
              if (data.index > length) {
                return "";
              }
              bits = 0;
              maxpower = Math.pow(2, numBits);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              switch (c = bits) {
                case 0:
                  bits = 0;
                  maxpower = Math.pow(2, 8);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 1:
                  bits = 0;
                  maxpower = Math.pow(2, 16);
                  power = 1;
                  while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                      data.position = resetValue;
                      data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                  }
                  dictionary[dictSize++] = f(bits);
                  c = dictSize - 1;
                  enlargeIn--;
                  break;
                case 2:
                  return result.join("");
              }
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
              if (dictionary[c]) {
                entry = dictionary[c];
              } else {
                if (c === dictSize) {
                  entry = w + w.charAt(0);
                } else {
                  return null;
                }
              }
              result.push(entry);
              dictionary[dictSize++] = w + entry.charAt(0);
              enlargeIn--;
              w = entry;
              if (enlargeIn == 0) {
                enlargeIn = Math.pow(2, numBits);
                numBits++;
              }
            }
          }
        };
        return LZString3;
      })();
      if (typeof define === "function" && define.amd) {
        define(function() {
          return LZString2;
        });
      } else if (typeof module !== "undefined" && module != null) {
        module.exports = LZString2;
      } else if (typeof angular !== "undefined" && angular != null) {
        angular.module("LZString", []).factory("LZString", function() {
          return LZString2;
        });
      }
    }
  });

  // Translation/starters.js
  var starters_default;
  var init_starters = __esm({
    "Translation/starters.js"() {
      starters_default = {
        TW: [
          "\u9810\u8A2D",
          ["\u6EAB\u67D4\u64AB\u6478", "\u75BC\u75DB", "\u6414\u7662", "\u4F4E\u8208\u596E\u53CD\u61C9", "\u9AD8\u8208\u596E\u53CD\u61C9", "\u9AD8\u6F6E", "\u6B61\u8FCE\u8A2A\u5BA2"],
          [
            ["\u55EF\u2026\u2026", "\u597D\u8212\u670D\u3002", "\u55EF\uFF0C\u7E7C\u7E8C\u3002"],
            ["\u597D\u75DB\uFF01", "\u554A\uFF01", "\u5514\u2026\u2026"],
            ["\u54C8\u54C8\uFF01", "\u4E0D\u3001\u4E0D\u8981\uFF0C\u597D\u7662\uFF01", "\u554A\u54C8\u54C8\u2026\u2026"],
            ["\u55EF\u2026\u2026", "\u554A\u2026\u2026"],
            ["\u55EF\u2665", "\u54C8\u554A\u2026\u2026\u2665", "\u5514\u2026\u2026\u554A\u2665"],
            ["\u554A\u554A\u2026\u2026\uFF01", "\u55EF\u55EF\u2026\u2026\uFF01", "\u54C8\u554A\u554A\u554A\uFF01"],
            ["\u6B61\u8FCE\uFF0C{Other}\u3002"]
          ]
        ],
        CN: [
          "\u9ED8\u8BA4",
          ["\u6E29\u67D4\u629A\u6478", "\u75BC\u75DB", "\u6320\u75D2", "\u4F4E\u5174\u594B\u53CD\u5E94", "\u9AD8\u5174\u594B\u53CD\u5E94", "\u9AD8\u6F6E", "\u6B22\u8FCE\u8BBF\u5BA2"],
          [
            ["\u55EF\u2026\u2026", "\u597D\u8212\u670D\u3002", "\u55EF\uFF0C\u7EE7\u7EED\u3002"],
            ["\u597D\u75DB\uFF01", "\u554A\uFF01", "\u5514\u2026\u2026"],
            ["\u54C8\u54C8\uFF01", "\u4E0D\u3001\u4E0D\u8981\uFF0C\u597D\u75D2\uFF01", "\u554A\u54C8\u54C8\u2026\u2026"],
            ["\u55EF\u2026\u2026", "\u554A\u2026\u2026"],
            ["\u55EF\u2665", "\u54C8\u554A\u2026\u2026\u2665", "\u5514\u2026\u2026\u554A\u2665"],
            ["\u554A\u554A\u2026\u2026\uFF01", "\u55EF\u55EF\u2026\u2026\uFF01", "\u54C8\u554A\u554A\u554A\uFF01"],
            ["\u6B22\u8FCE\uFF0C{Other}\u3002"]
          ]
        ],
        DE: [
          "Standard",
          [
            "Sanfte Ber\xFChrung",
            "Schmerz",
            "Kitzeln",
            "Geringe Erregung",
            "Hohe Erregung",
            "Orgasmus",
            "Besucher begr\xFC\xDFen"
          ],
          [
            ["Mmm...", "Das f\xFChlt sich gut an.", "Mm, mach weiter."],
            ["Aua!", "Ah!", "Nnh..."],
            ["Haha!", "N-nein, das kitzelt!", "Ahaha..."],
            ["Mm...", "Ah..."],
            ["Mmh\u2665", "Haa...\u2665", "Nnh... ah\u2665"],
            ["Aah...!", "Mmmh...!", "HaaAAaah!"],
            ["Willkommen, {Other}."]
          ]
        ],
        FR: [
          "Par d\xE9faut",
          [
            "Douce caresse",
            "Douleur",
            "Chatouilles",
            "Faible excitation",
            "Forte excitation",
            "Orgasme",
            "Accueillir les visiteurs"
          ],
          [
            ["Mmm...", "\xC7a fait du bien.", "Mm, continue."],
            ["A\xEFe !", "Ah !", "Nnh..."],
            ["Haha !", "N-non, \xE7a chatouille !", "Ahaha..."],
            ["Mm...", "Ah..."],
            ["Mmh\u2665", "Haa...\u2665", "Nnh... ah\u2665"],
            ["Aah... !", "Mmmh... !", "HaaAAaah !"],
            ["Bienvenue, {Other}."]
          ]
        ],
        RU: [
          "\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E",
          [
            "\u041D\u0435\u0436\u043D\u043E\u0435 \u043F\u0440\u0438\u043A\u043E\u0441\u043D\u043E\u0432\u0435\u043D\u0438\u0435",
            "\u0411\u043E\u043B\u044C",
            "\u0429\u0435\u043A\u043E\u0442\u043A\u0430",
            "\u0421\u043B\u0430\u0431\u043E\u0435 \u0432\u043E\u0437\u0431\u0443\u0436\u0434\u0435\u043D\u0438\u0435",
            "\u0421\u0438\u043B\u044C\u043D\u043E\u0435 \u0432\u043E\u0437\u0431\u0443\u0436\u0434\u0435\u043D\u0438\u0435",
            "\u041E\u0440\u0433\u0430\u0437\u043C",
            "\u041F\u0440\u0438\u0432\u0435\u0442\u0441\u0442\u0432\u0438\u0435 \u0433\u043E\u0441\u0442\u0435\u0439"
          ],
          [
            ["\u041C\u043C\u043C...", "\u041A\u0430\u043A \u043F\u0440\u0438\u044F\u0442\u043D\u043E.", "\u041C\u043C, \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0430\u0439."],
            ["\u041E\u0439!", "\u0410\u0445!", "\u041C\u043C..."],
            ["\u0425\u0430\u0445\u0430!", "\u041D-\u043D\u0435\u0442, \u0449\u0435\u043A\u043E\u0442\u043D\u043E!", "\u0410\u0445\u0430\u0445\u0430..."],
            ["\u041C\u043C...", "\u0410\u0445..."],
            ["\u041C\u043C\u2665", "\u0410\u0430\u0445...\u2665", "\u041C\u043C... \u0430\u0445\u2665"],
            ["\u0410\u0430\u0445...!", "\u041C\u043C\u043C...!", "\u0410\u0430\u0430\u0430\u0445!"],
            ["\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C, {Other}."]
          ]
        ],
        UA: [
          "\u0417\u0430 \u0437\u0430\u043C\u043E\u0432\u0447\u0443\u0432\u0430\u043D\u043D\u044F\u043C",
          [
            "\u041D\u0456\u0436\u043D\u0438\u0439 \u0434\u043E\u0442\u0438\u043A",
            "\u0411\u0456\u043B\u044C",
            "\u041B\u043E\u0441\u043A\u043E\u0442\u0430\u043D\u043D\u044F",
            "\u0421\u043B\u0430\u0431\u043A\u0435 \u0437\u0431\u0443\u0434\u0436\u0435\u043D\u043D\u044F",
            "\u0421\u0438\u043B\u044C\u043D\u0435 \u0437\u0431\u0443\u0434\u0436\u0435\u043D\u043D\u044F",
            "\u041E\u0440\u0433\u0430\u0437\u043C",
            "\u041F\u0440\u0438\u0432\u0456\u0442\u0430\u043D\u043D\u044F \u0433\u043E\u0441\u0442\u0435\u0439"
          ],
          [
            ["\u041C\u043C\u043C...", "\u042F\u043A \u043F\u0440\u0438\u0454\u043C\u043D\u043E.", "\u041C\u043C, \u043F\u0440\u043E\u0434\u043E\u0432\u0436\u0443\u0439."],
            ["\u041E\u0439!", "\u0410\u0445!", "\u041C\u043C..."],
            ["\u0425\u0430\u0445\u0430!", "\u041D-\u043D\u0456, \u043B\u043E\u0441\u043A\u043E\u0442\u043D\u043E!", "\u0410\u0445\u0430\u0445\u0430..."],
            ["\u041C\u043C...", "\u0410\u0445..."],
            ["\u041C\u043C\u2665", "\u0410\u0430\u0445...\u2665", "\u041C\u043C... \u0430\u0445\u2665"],
            ["\u0410\u0430\u0445...!", "\u041C\u043C\u043C...!", "\u0410\u0430\u0430\u0430\u0445!"],
            ["\u041B\u0430\u0441\u043A\u0430\u0432\u043E \u043F\u0440\u043E\u0441\u0438\u043C\u043E, {Other}."]
          ]
        ]
      };
    }
  });

  // package.json
  var package_default;
  var init_package = __esm({
    "package.json"() {
      package_default = {
        name: "responsive-liko",
        version: "0.1.4",
        private: true,
        type: "module",
        repository: {
          type: "git",
          url: "https://github.com/awdrrawd/BC-Responsive.git"
        },
        scripts: {
          build: "node scripts/build.mjs",
          test: "node --test tests/*.test.js",
          serve: "node scripts/serve.mjs",
          dev: "npm run build && npm run serve",
          format: "prettier --write src Translation tests scripts dev integrations *.user.js",
          "format:check": "prettier --check src Translation tests scripts dev integrations *.user.js"
        },
        devDependencies: {
          esbuild: "0.25.9",
          prettier: "^3.9.6"
        },
        dependencies: {
          "bondage-club-mod-sdk": "1.2.0",
          "lz-string": "1.5.0"
        }
      };
    }
  });

  // src/core/model.js
  function persona(name = "Default", selfMember) {
    return {
      id: uid(),
      name,
      listMode: "blacklist",
      whiteList: [],
      blackList: Number.isSafeInteger(selfMember) ? [selfMember] : [],
      rules: []
    };
  }
  function starterPersona(name, selfMember, language = "EN") {
    const localized = starters_default[language];
    const p = persona(name ?? localized?.[0] ?? "Default", selfMember);
    p.rules = [
      starterRule(
        "Gentle touch",
        {
          kind: "activity",
          activities: ["Pet", "Caress"],
          groups: ["ItemHead", "ItemNose", "ItemEars"],
          members: [],
          self: false
        },
        ["Mmm...", "That feels nice.", "Mm, keep going."]
      ),
      starterRule(
        "Pain",
        {
          kind: "activity",
          activities: ["Slap", "Bite", "Spank", "Kick", "Pinch", "SpankItem", "ShockItem"],
          groups: [],
          members: [],
          self: false
        },
        ["Ouch!", "Ah!", "Nnh..."]
      ),
      starterRule(
        "Tickle",
        { kind: "activity", activities: ["Tickle", "TickleItem"], groups: [], members: [], self: false },
        ["Haha!", "N-no, that tickles!", "Ahaha..."]
      ),
      starterRule("Low arousal flavour", { kind: "spicer", min: 0, max: 49, members: [] }, ["Mm...", "Ah..."]),
      starterRule("High arousal flavour", { kind: "spicer", min: 50, max: 100, members: [] }, [
        "Mmh\u2665",
        "Haa...\u2665",
        "Nnh... ah\u2665"
      ]),
      starterRule("Climax", { kind: "orgasm", outcome: "Any", members: [] }, [
        "Aah...!",
        "Mmmh...!",
        "HaaAAaah!"
      ]),
      starterRule(
        "Welcome visitor",
        { kind: "event", event: "visitor", roomMode: "any", roomNames: [], members: [] },
        ["Welcome, {Other}."]
      )
    ];
    if (localized)
      p.rules.forEach((r, i) => {
        r.name = localized[1][i];
        r.choices.forEach((c, j) => {
          c.steps[0].text = localized[2][i][j];
        });
      });
    return p;
  }
  function defaults(selfMember, language = "EN") {
    const p = starterPersona(void 0, selfMember, language);
    return {
      schemaVersion: 1,
      starterVersion: 1,
      settings: { ...DEFAULT_SETTINGS },
      activePersona: p.id,
      personas: [p]
    };
  }
  function rule() {
    return {
      id: uid(),
      name: "New rule",
      enabled: true,
      trigger: { kind: "activity", activities: [], groups: [], members: [], self: false },
      dedupeMs: 3e3,
      delayMs: 0,
      choices: [{ id: uid(), steps: [{ type: "chat", text: "" }] }]
    };
  }
  function assert(ok, message) {
    if (!ok) throw new Error(message);
  }
  function strings(v) {
    return Array.isArray(v) && v.every((x) => typeof x === "string");
  }
  function members(v) {
    return Array.isArray(v) && v.every((x) => Number.isSafeInteger(x) && x >= 0);
  }
  function validatePersona(input) {
    assert(object(input), "Invalid persona");
    const p = clone(input);
    assert(typeof p.name === "string" && p.name.trim() && p.name.length <= 100, "Invalid persona name");
    p.id ||= uid();
    assert(typeof p.id === "string", "Invalid persona ID");
    p.blackList ??= [];
    p.whiteList ??= [];
    p.listMode ??= p.whiteList.length ? "whitelist" : "blacklist";
    assert(["whitelist", "blacklist"].includes(p.listMode), "Invalid list mode");
    assert(members(p.whiteList), "Invalid whitelist");
    assert(members(p.blackList), "Invalid blacklist");
    assert(Array.isArray(p.rules) && p.rules.length <= 500, "Invalid rules (maximum 500)");
    const ids = /* @__PURE__ */ new Set();
    for (const r of p.rules) {
      assert(object(r) && object(r.trigger), "Invalid rule");
      r.id ||= uid();
      assert(typeof r.id === "string" && !ids.has(r.id), "Duplicate rule ID");
      ids.add(r.id);
      assert(typeof r.name === "string" && typeof r.enabled === "boolean", "Invalid rule name/enabled");
      const t = r.trigger;
      assert(kinds.includes(t.kind), "Unknown trigger");
      if (!supportsRuleMembers(t)) delete t.members;
      if (t.kind === "speech") {
        delete t.members;
        t.channel ??= "all";
        t.chance ??= 100;
        t.severity ??= "weak";
        assert(["all", "chat", "whisper"].includes(t.channel), "Invalid speech channel");
        assert(["weak", "medium", "strong", "addicted"].includes(t.severity), "Invalid speech severity");
        assert(Number.isFinite(t.chance) && t.chance >= 0 && t.chance <= 100, "Invalid speech chance");
      }
      for (const key of ["activities", "groups"])
        if (t[key] !== void 0) assert(strings(t[key]), `Invalid ${key}`);
      if (t.members !== void 0) assert(members(t.members), "Invalid members");
      if (t.self !== void 0) assert(typeof t.self === "boolean", "Invalid self condition");
      if (t.matchNone !== void 0) assert(typeof t.matchNone === "boolean", "Invalid empty filter");
      if (t.kind === "event") {
        assert(["join", "leave", "slowLeave", "visitor"].includes(t.event), "Invalid room event");
        t.roomMode ??= "any";
        t.roomNames ??= [];
        assert(["any", "named"].includes(t.roomMode) && strings(t.roomNames), "Invalid room filter");
      }
      if (t.kind === "orgasm")
        assert(["Any", "Orgasmed", "Ruined", "Resisted"].includes(t.outcome), "Invalid outcome");
      for (const key of ["min", "max"])
        if (t[key] !== void 0)
          assert(Number.isFinite(t[key]) && t[key] >= 0 && t[key] <= 100, `Invalid ${key}`);
      if (t.min !== void 0 && t.max !== void 0) assert(t.min <= t.max, "Minimum exceeds maximum");
      if (t.kind === "spicer") delete t.arousalSource;
      r.dedupeMs ??= 3e3;
      r.delayMs ??= 0;
      for (const key of ["dedupeMs", "delayMs"])
        assert(Number.isFinite(r[key]) && r[key] >= 0 && r[key] <= 6e5, `Invalid ${key}`);
      assert(Array.isArray(r.choices) && r.choices.length <= 1e3, "Invalid choices");
      assert(r.choices.filter((c) => c.always).length <= 1, "Only one guaranteed response per rule");
      for (const c of r.choices) {
        assert(object(c), "Invalid choice");
        c.id ||= uid();
        if (c.always !== void 0) assert(typeof c.always === "boolean", "Invalid guaranteed response");
        assert(
          Array.isArray(c.steps) && c.steps.length > 0 && c.steps.length <= 10,
          "A choice needs 1\u201310 steps"
        );
        for (const s of c.steps) {
          assert(object(s) && types.includes(s.type), "Unknown response type");
          if (t.kind === "speech") assert(s.type === "chat", "Speech habits accept text phrases only");
          if (["chat", "emote", "action"].includes(s.type))
            assert(typeof s.text === "string" && s.text.length <= 4e3, "Invalid message");
          if (s.type === "activity")
            assert(
              typeof s.activity === "string" && !!s.activity && typeof s.group === "string" && !!s.group,
              "Activity and group required"
            );
          if (s.type === "expression")
            assert(
              typeof s.group === "string" && (s.value === null || typeof s.value === "string") && Number.isFinite(s.durationMs) && s.durationMs >= 100 && s.durationMs <= 6e4,
              "Invalid expression"
            );
          if (s.type === "animation") {
            const tracks = s.tracks ?? [
              { group: s.group, stateA: { asset: s.assetA }, stateB: { asset: s.assetB } }
            ];
            assert(
              Array.isArray(tracks) && tracks.length >= 1 && tracks.length <= 3,
              "Choose 1\u20133 animation groups"
            );
            assert(new Set(tracks.map((x) => x.group)).size === tracks.length, "Duplicate animation group");
            for (const track of tracks) {
              assert(
                ["HairAccessory2", "TailStraps", "Wings"].includes(track.group),
                "Invalid animation group"
              );
              for (const state of [track.stateA, track.stateB]) {
                assert(
                  object(state) && typeof state.asset === "string" && !!state.asset,
                  "Animation assets required"
                );
                if (state.color !== void 0)
                  assert(typeof state.color === "string" || strings(state.color), "Invalid animation color");
                if (state.property != null) assert(object(state.property), "Invalid animation property");
                if (state.craft != null) assert(object(state.craft), "Invalid animation craft");
                if (state.sameAsset !== void 0)
                  assert(typeof state.sameAsset === "boolean", "Invalid same clothing flag");
              }
            }
            assert(Number.isSafeInteger(s.count) && s.count >= 1 && s.count <= 100, "Invalid animation count");
            if (s.intervalMs === void 0 && Number.isFinite(s.durationMs))
              s.intervalMs = s.durationMs / s.count;
            assert(
              Number.isFinite(s.intervalMs) && s.intervalMs >= 1 && s.intervalMs <= 12e4,
              "Invalid animation interval"
            );
            delete s.durationMs;
            assert(
              ["chat", "emote", "action"].includes(s.messageType) && typeof s.text === "string" && s.text.length <= 4e3,
              "Invalid animation message"
            );
          }
        }
      }
    }
    return p;
  }
  function validateData(v) {
    assert(object(v) && v.schemaVersion === 1 && object(v.settings), "Unknown settings version");
    const result = clone(v);
    result.starterVersion ??= 0;
    assert(
      Number.isSafeInteger(result.starterVersion) && result.starterVersion >= 0,
      "Invalid starter version"
    );
    for (const k of Object.keys(DEFAULT_SETTINGS))
      assert(typeof result.settings[k] === "boolean", `Invalid setting: ${k}`);
    assert(
      Array.isArray(result.personas) && result.personas.length > 0 && result.personas.length <= 100,
      "Invalid personas"
    );
    result.personas = result.personas.map(validatePersona);
    assert(new Set(result.personas.map((p) => p.id)).size === result.personas.length, "Duplicate persona ID");
    assert(
      result.personas.some((p) => p.id === result.activePersona),
      "Active persona missing"
    );
    return result;
  }
  var VERSION, ID, clone, uid, object, DEFAULT_SETTINGS, choice, starterRule, supportsRuleMembers, kinds, types;
  var init_model = __esm({
    "src/core/model.js"() {
      init_starters();
      init_package();
      VERSION = package_default.version;
      ID = "Responsive_Liko";
      clone = (value) => JSON.parse(JSON.stringify(value));
      uid = () => globalThis.crypto?.randomUUID?.() ?? `rl-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      object = (v) => !!v && typeof v === "object" && !Array.isArray(v);
      DEFAULT_SETTINGS = Object.freeze({
        enabled: true,
        reactions: true,
        mouth: false,
        interruption: false,
        bcx: true
      });
      choice = (type, text) => ({ id: uid(), steps: [{ type, text }] });
      starterRule = (name, trigger, texts, type = "chat") => ({
        id: uid(),
        name,
        enabled: true,
        trigger,
        dedupeMs: 0,
        delayMs: 0,
        choices: texts.map((text) => choice(type, text))
      });
      supportsRuleMembers = (t) => ["activity", "spicer"].includes(t.kind) || t.kind === "event" && t.event === "visitor";
      kinds = ["activity", "orgasm", "spicer", "event", "speech"];
      types = ["chat", "emote", "action", "activity", "expression", "animation"];
    }
  });

  // src/core/language.js
  function gameLanguage(host = globalThis) {
    let saved;
    try {
      saved = host.localStorage?.getItem("BondageClubLanguage");
    } catch {
    }
    const value = String(saved || host.TranslationLanguage || host.navigator?.language || "EN").toUpperCase();
    if (/^(TW|ZH(?:-TW|-HANT)?$)/.test(value) || value.startsWith("ZH-HANT")) return "TW";
    if (value === "CN" || value.startsWith("ZH")) return "CN";
    return value.split("-")[0].replace(/^UK$/, "UA");
  }
  var init_language = __esm({
    "src/core/language.js"() {
    }
  });

  // src/core/store.js
  function createStore(host = globalThis) {
    let data = defaults(host.Player?.MemberNumber, gameLanguage(host));
    let loaded = false;
    const listeners = /* @__PURE__ */ new Set();
    const notify = () => listeners.forEach((fn) => fn(data));
    return {
      get data() {
        return data;
      },
      get loaded() {
        return loaded;
      },
      subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
      load() {
        const raw = host.Player?.ExtensionSettings?.[ID];
        if (raw) {
          const decoded = host.LZString.decompressFromBase64(raw);
          data = validateData(JSON.parse(decoded));
          if (data.starterVersion < 1) {
            if (data.personas.length === 1 && data.personas[0].rules.length === 0) {
              data.personas[0].rules = starterPersona(
                data.personas[0].name,
                host.Player?.MemberNumber,
                gameLanguage(host)
              ).rules;
              if (Number.isSafeInteger(host.Player?.MemberNumber) && !data.personas[0].blackList.includes(host.Player.MemberNumber))
                data.personas[0].blackList.push(host.Player.MemberNumber);
            }
            data.starterVersion = 1;
            host.Player.ExtensionSettings[ID] = host.LZString.compressToBase64(JSON.stringify(data));
            host.ServerPlayerExtensionSettingsSync(ID);
          }
        } else data = defaults(host.Player?.MemberNumber, gameLanguage(host));
        loaded = true;
        notify();
      },
      update(change) {
        if (!loaded) throw new Error("Settings not loaded");
        const draft = clone(data);
        change(draft);
        const next = validateData(draft);
        const encoded = host.LZString.compressToBase64(JSON.stringify(next));
        if (encoded.length > 6e4) throw new Error("Settings too large (60 KB compressed limit)");
        if (!host.Player?.ExtensionSettings) throw new Error("Player settings unavailable");
        const old = host.Player.ExtensionSettings[ID];
        host.Player.ExtensionSettings[ID] = encoded;
        try {
          host.ServerPlayerExtensionSettingsSync(ID);
        } catch (error) {
          host.Player.ExtensionSettings[ID] = old;
          throw error;
        }
        data = next;
        notify();
      },
      get active() {
        return data.personas.find((p) => p.id === data.activePersona);
      }
    };
  }
  var init_store = __esm({
    "src/core/store.js"() {
      init_language();
      init_model();
    }
  });

  // src/core/api.js
  function createAPI(namespace, store, host = globalThis) {
    const listeners = /* @__PURE__ */ new Set();
    const consumers = /* @__PURE__ */ new Map();
    let ready = false;
    let lastPublished = "";
    let capabilities = { mouth: false, expressions: false };
    let desired = { ...capabilities };
    const getState = () => ({
      apiVersion: 1,
      version: VERSION,
      ready,
      enabled: ready && store.data.settings.enabled,
      activePersona: store.data.activePersona,
      capabilities: clone(capabilities),
      desired: clone(desired),
      scope: { mouth: "room-local", expressions: "player" }
    });
    function publish() {
      const signature = JSON.stringify(getState());
      if (signature === lastPublished) return;
      lastPublished = signature;
      for (const listener of listeners)
        try {
          listener(getState());
        } catch (e) {
          console.warn(ID, e);
        }
      host.dispatchEvent?.(new CustomEvent(`${ID}:state`, { detail: getState() }));
    }
    Object.assign(namespace, {
      apiVersion: 1,
      version: VERSION,
      getState,
      isActive: (capability) => ready && store.data.settings.enabled && capabilities[capability] === true,
      subscribe(listener) {
        if (typeof listener !== "function") throw new TypeError("Listener required");
        listeners.add(listener);
        listener(getState());
        return () => listeners.delete(listener);
      },
      // Consumers synchronously stop their writers before returning true. Registration works in either load order.
      registerConsumer(name, handler) {
        if (typeof name !== "string" || typeof handler !== "function") throw new TypeError("Invalid consumer");
        consumers.set(name, handler);
        namespace.refresh();
        return () => {
          if (consumers.get(name) !== handler) return;
          consumers.delete(name);
          namespace.refresh();
        };
      }
    });
    return {
      setReady(value) {
        ready = value;
      },
      owns: (key) => capabilities[key] === true,
      refresh() {
        const settings = store.data.settings;
        desired = {
          mouth: ready && settings.enabled && settings.mouth,
          expressions: ready && settings.enabled && settings.reactions && !!store.active?.rules.some(
            (r) => r.enabled && r.choices.some((c) => c.steps.some((s) => s.type === "expression"))
          )
        };
        const next = { ...desired };
        if (host.Liko?.LCE && !consumers.has("LCE")) {
          if (host.Liko.LCE.getFeature?.("autoMouthOnTalk")) next.mouth = false;
          if (host.Liko.LCE.getFeature?.("animationEngine")) next.expressions = false;
        }
        for (const handler of consumers.values()) {
          try {
            const accepted = handler(clone(desired));
            if (accepted !== true) {
              next.mouth = false;
              next.expressions = false;
            }
          } catch {
            next.mouth = false;
            next.expressions = false;
          }
        }
        capabilities = next;
        publish();
      }
    };
  }
  var init_api = __esm({
    "src/core/api.js"() {
      init_model();
    }
  });

  // src/core/engine.js
  function matches(rule2, event) {
    const t = rule2.trigger;
    if (!rule2.enabled || t.matchNone || t.kind !== event.kind) return false;
    if (supportsRuleMembers(t) && t.members?.length && !t.members.includes(event.actor)) return false;
    if (t.kind === "activity") {
      if (t.activities?.length && !t.activities.includes(event.activity)) return false;
      if (t.groups?.length && !t.groups.includes(event.group)) return false;
    }
    if (t.kind === "event" && (t.event !== event.event || t.roomMode === "named" && !t.roomNames.some(
      (name) => name.toLocaleLowerCase() === String(event.roomName ?? "").toLocaleLowerCase()
    )))
      return false;
    if (t.kind === "orgasm" && t.outcome !== "Any" && t.outcome !== event.outcome) return false;
    const arousal = event.selfArousal;
    if (t.min !== void 0 && (arousal ?? 0) < t.min) return false;
    if (t.max !== void 0 && (arousal ?? 0) > t.max) return false;
    return true;
  }
  function selectResponse(persona2, event, random = Math.random) {
    const ownRoomEvent = event.kind === "event" && event.actor === event.self && ["join", "leave", "slowLeave"].includes(event.event);
    if (!persona2 || !ownRoomEvent && (persona2.listMode === "whitelist" ? !persona2.whiteList.includes(event.actor) : persona2.blackList.includes(event.actor)))
      return null;
    const pool = persona2.rules.filter((r) => matches(r, event)).flatMap((r) => r.choices.filter((c) => c.steps.length).map((choice2) => ({ rule: r, choice: choice2 })));
    if (!pool.length) return null;
    const ordinary = pool.filter((x) => !x.choice.always);
    const draw = ordinary.length ? ordinary : pool;
    const selected = draw[Math.min(draw.length - 1, Math.floor(random() * draw.length))];
    const guaranteed = selected.rule.choices.find((c) => c.always && c !== selected.choice);
    const steps = selected.choice.steps.map((s) => ({ ...s }));
    if (event.kind === "activity") {
      const prefixes = persona2.rules.filter((r) => matches(r, { ...event, kind: "spicer" })).flatMap((r) => r.choices.flatMap((c) => c.steps.filter((s) => s.type === "chat")));
      if (prefixes.length) {
        const chat = steps.find((s) => s.type === "chat");
        if (chat) chat.text = prefixes[Math.floor(random() * prefixes.length)].text + " " + chat.text;
      }
    }
    return { ...selected, steps, guaranteedSteps: guaranteed?.steps.map((s) => ({ ...s })) ?? [] };
  }
  function createScheduler({
    active,
    execute,
    valid,
    now = Date.now,
    random = Math.random,
    setTimer = setTimeout,
    clearTimer = clearTimeout,
    report = console.warn
  }) {
    const timers = /* @__PURE__ */ new Set();
    const seen = /* @__PURE__ */ new Map();
    let generation = 0;
    const keyFor = (r, e) => `${e.room}|${e.actor}|${r.id}`;
    return {
      cancel() {
        generation++;
        timers.forEach(clearTimer);
        timers.clear();
        seen.clear();
      },
      submit(event) {
        const p = active();
        if (!p || !valid(event)) return false;
        const time = now();
        for (const [key2, expires] of seen) if (expires <= time) seen.delete(key2);
        const eligible = { ...p, rules: p.rules.filter((r) => !seen.has(keyFor(r, event))) };
        const selected = selectResponse(eligible, event, random);
        if (!selected) return false;
        const leaving = event.kind === "event" && event.event === "leave";
        const key = keyFor(selected.rule, event);
        seen.set(key, time + selected.rule.delayMs + selected.rule.dedupeMs);
        const token = generation;
        const run = () => {
          if (token !== generation || !valid(event)) return;
          const executeSteps = (steps) => {
            for (const step2 of steps) {
              if (token !== generation || !valid(event)) break;
              try {
                execute(step2, event);
              } catch (error) {
                report(error);
              }
            }
          };
          if (selected.guaranteedSteps.length) {
            executeSteps(selected.guaranteedSteps);
            if (leaving) {
              executeSteps(selected.steps);
              return;
            }
            const timer = setTimer(() => {
              timers.delete(timer);
              executeSteps(selected.steps);
            }, 50);
            timers.add(timer);
          } else executeSteps(selected.steps);
        };
        if (selected.rule.delayMs && !leaving) {
          const timer = setTimer(() => {
            timers.delete(timer);
            run();
          }, selected.rule.delayMs);
          timers.add(timer);
        } else run();
        return true;
      }
    };
  }
  var init_engine = __esm({
    "src/core/engine.js"() {
      init_model();
    }
  });

  // Translation/en.js
  var en_default;
  var init_en = __esm({
    "Translation/en.js"() {
      en_default = {
        copyText: "Copy",
        pasteText: "Paste",
        copiedText: "Copied",
        pastedText: "Pasted",
        clipboardUnavailable: "Clipboard unavailable. Use Ctrl+C / Ctrl+V.",
        clearText: "Clear text",
        loadingActivities: "Loading activities\u2026",
        mainResponse: "Main response",
        sameClothing: "Same clothing as A",
        newSpeech: "Add speech phrase",
        editSpeech: "Edit speech phrase",
        speech: "Speech habit",
        speechList: "Speech habit phrases",
        speechChannel: "Apply to",
        speech_all: "All",
        speech_chat: "Chat only",
        speech_whisper: "Whispers only",
        chance: "Chance",
        severity: "Severity",
        weak: "Weak",
        medium: "Medium",
        strong: "Strong",
        addicted: "Addicted",
        speechHint: "Weak: sentence ending. Medium: ending plus random insertion. Strong: up to three insertions. Addicted: also replaces 1\u20132 characters. Short messages receive fewer changes.",
        alwaysHint: "Guaranteed response (one per rule). Runs before a random response, 50 ms apart; no pause when leaving.",
        editAppearance: "Wardrobe",
        animationSeconds: "A/B switch interval (seconds)",
        chooseAnimationGroup: "Select at least one group and both states.",
        invalidAnimation: "Count must be 1\u2013100 and switch interval 0.001\u2013120 seconds.",
        HairAccessory2: "Ears",
        TailStraps: "Tail",
        Wings: "Wings",
        title: "Responsive_Liko",
        home: "Settings",
        enabled: "Enable module",
        reactions: "Automatic expressions during actions",
        mouth: "Automatic mouth movement while speaking",
        interruption: "Interrupt chat draft",
        bcx: "BCX preflight",
        on: "ON",
        off: "OFF",
        persona: "Persona",
        addPersona: "New persona",
        rename: "Rename",
        import: "Import",
        export: "Export",
        rules: "Reaction rules",
        addRule: "Add rule",
        edit: "Edit",
        delete: "Delete",
        save: "Save",
        cancel: "Cancel",
        back: "Back",
        prev: "Previous",
        next: "Next",
        name: "Name",
        whiteList: "Whitelist member numbers",
        blackList: "Blacklist member numbers",
        activity: "Interaction",
        orgasm: "Climax event",
        spicer: "Flavour",
        event: "Room event",
        join: "Enter room",
        leave: "Departure",
        Any: "Any outcome",
        Orgasmed: "Completed",
        Ruined: "Interrupted",
        Resisted: "Resisted",
        trigger: "Trigger",
        activities: "Activity IDs (comma separated; blank = all)",
        groups: "Group IDs (comma separated; blank = all)",
        members: "Member numbers (comma separated; blank = all)",
        self: "Include own activities",
        delay: "Delay (ms)",
        dedupe: "Same person + rule interval (ms)",
        min: "Minimum state (0\u2013100)",
        max: "Maximum state (0\u2013100)",
        actor: "Actor state",
        player: "My state",
        responses: "Responses",
        choicesHint: "One line = one random choice. Multiple steps: use advanced JSON.",
        chat: "Chat",
        emote: "Emote",
        action: "Action",
        advanced: "Advanced JSON",
        simple: "Text editor",
        catalog: "Activity catalog",
        search: "Search name / group / ID",
        choose: "Select",
        empty: "No rules yet. Add a rule or import an existing persona.",
        importHint: "Paste a legacy Base64 export or Responsive_Liko JSON. Imported personas are added, not overwritten.",
        inspect: "Inspect",
        confirmImport: "Add imported personas",
        imported: "Imported",
        preview: "Preview (no messages sent)",
        warning: "Notes",
        saved: "Saved",
        error: "Error",
        disabled: "Module is off. Saved options are retained.",
        running: "Module is enabled",
        exportHint: "Copy this JSON to back up or share this persona.",
        editorHint: "Variables: {me}, {other}. Grouped steps are supported in advanced JSON.",
        legacyBlacklist: "Legacy export has no blacklist; an empty list is used.",
        legacyFavorite: "Legacy apply_favorite flag is retained as metadata; it was not implemented in the original engine.",
        legacyUnusedExtras: "Unused extra response categories were preserved but disabled; set their ranges before enabling.",
        legacyGlobal: "Legacy global options do not replace your module settings.",
        groupHelp: "Advanced: choices[].steps[] supports chat, emote, action, activity, expression and animation. See README for examples.",
        masterHint: "Disabling stops in-game reactions while settings remain editable",
        moduleHint: "Toggle response modules",
        personaProgressHint: "Review total and enabled rules",
        activePersona: "Active",
        sparePersona: "Alternate persona",
        enabledRuleCount: "{enabled} enabled \xB7 {disabled} disabled",
        ruleCount: "rules",
        personaResponses: "Persona responses",
        finish: "Done",
        responseCount: "responses",
        type: "Type",
        allGroups: "All body areas",
        allActivities: "All activities",
        openActionPicker: "Open body activity picker",
        activityStep: "Activity",
        textStep: "Text",
        selectRuleHint: "Select or add a rule",
        listSettings: "Lists",
        searchRules: "Search rules",
        all: "All",
        chooseActivity: "Choose activities",
        searchActivities: "Search display or internal name",
        noAvailableActivities: "No available activities for this area",
        availableForGroup: "Activities for {group}",
        selectedActivityCount: "{count} activities selected",
        confirmAdd: "Add selected",
        renamePrompt: "Enter a new persona name",
        removePersonaConfirm: "Delete this persona?",
        newPersonaPrompt: "Enter a persona name",
        newPersonaDefault: "New persona",
        newRule: "New rule",
        renameRule: "Rename rule",
        confirmDelete: "Confirm deletion",
        newTextResponse: "Add text response",
        editTextResponse: "Edit text response",
        other: "Other",
        outcome: "Outcome",
        source: "State source",
        roomEvent: "Room event",
        roomScope: "Room scope",
        anyRoom: "Any room",
        namedRooms: "Named rooms",
        roomNamesPlaceholder: "Separate room names with commas",
        slowLeave: "Slow leave",
        visitor: "Visitor arrives",
        insertSelfName: "Insert my name",
        insertOtherName: "Insert their name",
        searchButton: "Search",
        clearSearch: "Clear search",
        selectAll: "Select all",
        clearAll: "Clear all",
        unsavedTitle: "Unsaved changes",
        unsavedMessage: "This rule has changes that have not been saved.",
        discardExit: "Exit without saving",
        saveExit: "Save and exit",
        groupPresets: "Body presets",
        groupPreset_head: "Head",
        groupPreset_upper: "Upper body",
        groupPreset_lower: "Lower body",
        groupPreset_intimate: "Intimate",
        currentArea: "Current area",
        allAreas: "All areas",
        allAreaActivities: "Available activities for all areas",
        interactionTargets: "Persona interaction targets",
        onlyWhitelist: "Whitelist only",
        onlyBlacklist: "Blacklist only",
        whiteListHint: "Only listed members can trigger responses",
        blackListHint: "Listed members cannot trigger responses",
        memberNumbersPlaceholder: "Member numbers, separated by commas",
        ruleWhitelist: "Rule whitelist",
        ruleWhitelistHint: "Leave blank to use persona targets; otherwise only these members can trigger this rule",
        relation_owner: "Owner",
        relation_lover: "Lovers",
        relation_submissive: "Submissives",
        relation_bcWhitelist: "BC whitelist",
        relation_friend: "Friends",
        animationStep: "Special action",
        newAnimationResponse: "Add special action",
        editAnimationResponse: "Edit special action",
        animationGroup: "Appearance slot",
        animationStateA: "State A",
        animationStateB: "State B",
        animationCount: "Changes",
        animationDuration: "A/B switch interval (ms)",
        animationMessageHint: "Optionally choose a message type and enter text. Leave it blank to play only the animation.",
        mouthState: "Mouth owner",
        faceState: "Expression owner",
        waiting: "Inactive / waiting",
        owns: "Responsive_Liko",
        removeConfirm: "Delete this rule?",
        importReady: "personas ready to import"
      };
    }
  });

  // Translation/tw.js
  var tw_default;
  var init_tw = __esm({
    "Translation/tw.js"() {
      tw_default = {
        copyText: "\u8907\u88FD",
        pasteText: "\u8CBC\u4E0A",
        copiedText: "\u5DF2\u8907\u88FD",
        pastedText: "\u5DF2\u8CBC\u4E0A",
        clipboardUnavailable: "\u7121\u6CD5\u5B58\u53D6\u526A\u8CBC\u7C3F\uFF0C\u8ACB\u4F7F\u7528 Ctrl+C\uFF0FCtrl+V\u3002",
        clearText: "\u6E05\u9664\u6587\u5B57",
        loadingActivities: "\u6B63\u5728\u8F09\u5165\u52D5\u4F5C\u2026\u2026",
        mainResponse: "\u4E3B\u56DE\u61C9",
        sameClothing: "\u540C\u670D\u88DD\uFF08\u8207 A \u76F8\u540C\uFF09",
        newSpeech: "\u65B0\u589E\u8A9E\u7656",
        editSpeech: "\u7DE8\u8F2F\u8A9E\u7656",
        speech: "\u8A9E\u7656",
        speechList: "\u8A9E\u7656\u5217\u8868",
        speechChannel: "\u5957\u7528\u7BC4\u570D",
        speech_all: "\u5168\u90E8",
        speech_chat: "\u50C5\u804A\u5929",
        speech_whisper: "\u50C5\u6084\u6084\u8A71",
        chance: "\u89F8\u767C\u6A5F\u7387",
        severity: "\u8A9E\u7656\u56B4\u91CD\u5EA6",
        weak: "\u5F31",
        medium: "\u4E2D",
        strong: "\u5F37",
        addicted: "\u4E2D\u6BD2",
        speechHint: "\u5F31\uFF1A\u50C5\u53E5\u5C3E\u3002\u4E2D\uFF1A\u53E5\u5C3E\u5FC5\u5B9A\u52A0\u5165\uFF0C\u53E5\u4E2D\u96A8\u6A5F\u63D2\u5165\u3002\u5F37\uFF1A\u96A8\u6A5F\u63D2\u5165\u4E09\u689D\u3002\u4E2D\u6BD2\uFF1A\u53E6\u66FF\u63DB 1\uFF5E2 \u500B\u5B57\u3002\u77ED\u53E5\u6703\u6E1B\u5C11\u63D2\u5165\u91CF\uFF0C\u4E00\u5B57\u77ED\u53E5\u4E2D\u6BD2\u6642\u53EF\u76F4\u63A5\u66FF\u63DB\u3002",
        alwaysHint: "\u4FDD\u8B49\u89F8\u767C\u7684\u4E3B\u56DE\u61C9\uFF08\u6BCF\u689D\u898F\u5247\u4E00\u500B\uFF09\uFF0C\u5148\u65BC\u96A8\u6A5F\u56DE\u61C9\u57F7\u884C\uFF0C\u9593\u9694 50 \u6BEB\u79D2\uFF1B\u96E2\u623F\u6642\u4E0D\u7B49\u5F85\u3002",
        editAppearance: "\u66F4\u8863\u5BA4\u8A2D\u5B9A",
        animationSeconds: "A\uFF0FB \u5207\u63DB\u9593\u9694\uFF08\u79D2\uFF09",
        chooseAnimationGroup: "\u8ACB\u9078\u64C7\u81F3\u5C11\u4E00\u500B\u90E8\u4F4D\u4E26\u8A2D\u5B9A A\uFF0FB\u3002",
        invalidAnimation: "\u8B8A\u5316\u6B21\u6578\u9808\u70BA 1\u2013100\uFF0C\u5207\u63DB\u9593\u9694\u9808\u70BA 0.001\u2013120 \u79D2\u3002",
        HairAccessory2: "\u8033\u6735",
        TailStraps: "\u5C3E\u5DF4",
        Wings: "\u7FC5\u8180",
        title: "Responsive_Liko",
        home: "\u4E3B\u8A2D\u5B9A",
        enabled: "\u555F\u7528\u6A21\u7D44",
        reactions: "\u52D5\u4F5C\u81EA\u52D5\u8868\u60C5",
        mouth: "\u8AAA\u8A71\u6642\u81EA\u52D5\u52D5\u5634",
        interruption: "\u4E2D\u65B7\u804A\u5929\u8349\u7A3F",
        bcx: "BCX \u898F\u5247\u9810\u5148\u6AA2\u67E5",
        on: "\u958B\u555F",
        off: "\u95DC\u9589",
        persona: "\u4EBA\u683C",
        addPersona: "\u65B0\u589E\u4EBA\u683C",
        rename: "\u91CD\u65B0\u547D\u540D",
        import: "\u532F\u5165",
        export: "\u532F\u51FA",
        rules: "\u53CD\u61C9\u898F\u5247",
        addRule: "\u65B0\u589E\u898F\u5247",
        edit: "\u7DE8\u8F2F",
        delete: "\u522A\u9664",
        save: "\u5132\u5B58",
        cancel: "\u53D6\u6D88",
        back: "\u8FD4\u56DE",
        prev: "\u4E0A\u4E00\u9801",
        next: "\u4E0B\u4E00\u9801",
        name: "\u540D\u7A31",
        whiteList: "\u767D\u540D\u55AE\u6703\u54E1\u7DE8\u865F",
        blackList: "\u9ED1\u540D\u55AE\u6703\u54E1\u7DE8\u865F",
        activity: "\u4E92\u52D5",
        orgasm: "\u9AD8\u6F6E",
        spicer: "\u8DA3\u5473",
        event: "\u4E8B\u4EF6",
        join: "\u9032\u623F",
        leave: "\u96E2\u958B",
        Any: "\u6240\u6709\u7D50\u679C",
        Orgasmed: "\u5B8C\u6210",
        Ruined: "\u62D2\u7D55",
        Resisted: "\u5FCD\u8010",
        trigger: "\u89F8\u767C\u689D\u4EF6",
        activities: "\u52D5\u4F5C ID\uFF08\u9017\u865F\u5206\u9694\uFF0C\u7A7A\u767D\u70BA\u5168\u90E8\uFF09",
        groups: "\u90E8\u4F4D ID\uFF08\u9017\u865F\u5206\u9694\uFF0C\u7A7A\u767D\u70BA\u5168\u90E8\uFF09",
        members: "\u6703\u54E1\u7DE8\u865F\uFF08\u9017\u865F\u5206\u9694\uFF0C\u7A7A\u767D\u70BA\u5168\u90E8\uFF09",
        self: "\u5305\u542B\u81EA\u5DF1\u5C0D\u81EA\u5DF1\u7684\u4E92\u52D5",
        delay: "\u5EF6\u9072\uFF08\u6BEB\u79D2\uFF09",
        dedupe: "\u540C\u4EBA\u540C\u898F\u5247\u9593\u9694\uFF08\u6BEB\u79D2\uFF09",
        min: "\u72C0\u614B\u4E0B\u9650\uFF080\u2013100\uFF09",
        max: "\u72C0\u614B\u4E0A\u9650\uFF080\u2013100\uFF09",
        actor: "\u5C0D\u65B9\u7684\u72C0\u614B",
        player: "\u81EA\u5DF1\u7684\u72C0\u614B",
        responses: "\u56DE\u61C9\u5167\u5BB9",
        choicesHint: "\u6BCF\u884C\u96A8\u6A5F\u62BD\u4E00\u689D\uFF1B\u4E00\u7D44\u591A\u6B65\u9A5F\u8ACB\u4F7F\u7528\u9032\u968E JSON\u3002",
        chat: "\u804A\u5929",
        emote: "\u52D5\u4F5C",
        action: "\u4E92\u52D5",
        advanced: "\u9032\u968E JSON",
        simple: "\u6587\u5B57\u7DE8\u8F2F",
        catalog: "\u52D5\u4F5C\u76EE\u9304",
        search: "\u641C\u5C0B\u540D\u7A31\uFF0F\u90E8\u4F4D\uFF0FID",
        choose: "\u9078\u53D6",
        empty: "\u5C1A\u7121\u898F\u5247\u3002\u53EF\u65B0\u589E\u898F\u5247\u6216\u532F\u5165\u539F\u6709\u7684\u4EBA\u683C\u3002",
        importHint: "\u8CBC\u4E0A\u539F\u7248 Base64 \u532F\u51FA\u78BC\u6216\u65B0\u7248 JSON\u3002\u532F\u5165\u6703\u65B0\u589E\u4EBA\u683C\uFF0C\u4E0D\u8986\u84CB\u73FE\u6709\u8CC7\u6599\u3002",
        inspect: "\u89E3\u6790\u9810\u89BD",
        confirmImport: "\u65B0\u589E\u532F\u5165\u4EBA\u683C",
        imported: "\u5DF2\u532F\u5165",
        preview: "\u9810\u89BD\uFF08\u4E0D\u767C\u9001\u8A0A\u606F\uFF09",
        warning: "\u8F49\u63DB\u8AAA\u660E",
        saved: "\u5DF2\u5132\u5B58",
        error: "\u932F\u8AA4",
        disabled: "\u6A21\u7D44\u5DF2\u505C\u7528\uFF0C\u6240\u6709\u9078\u9805\u4FDD\u7559\u539F\u503C\u3002",
        running: "\u6A21\u7D44\u5DF2\u555F\u7528",
        exportHint: "\u8907\u88FD\u4EE5\u4E0B JSON\uFF0C\u4EE5\u5099\u4EFD\u6216\u5206\u4EAB\u6B64\u4EBA\u683C\u3002",
        editorHint: "\u540D\u7A31\u8B8A\u6578\uFF1A{me}\u3001{other}\u3002\u9032\u968E JSON \u652F\u63F4\u4E00\u7D44\u591A\u6B65\u9A5F\u3002",
        legacyBlacklist: "\u539F\u7248\u532F\u51FA\u672A\u5305\u542B\u9ED1\u540D\u55AE\uFF0C\u4F7F\u7528\u7A7A\u767D\u540D\u55AE\u3002",
        legacyFavorite: "\u539F\u7248\u672A\u5BE6\u4F5C\u7684\u300C\u61C9\u7528\u559C\u597D\u300D\u4FDD\u7559\u70BA\u9644\u52A0\u8CC7\u6599\uFF0C\u4E0D\u5F71\u97FF\u56DE\u61C9\u3002",
        legacyUnusedExtras: "\u539F\u7248\u672A\u4F7F\u7528\u7684\u9644\u52A0\u53E5\u5EAB\u5DF2\u4FDD\u7559\u4E26\u505C\u7528\uFF1B\u53EF\u8A2D\u5B9A\u7BC4\u570D\u5F8C\u555F\u7528\u3002",
        legacyGlobal: "\u539F\u7248\u5168\u57DF\u8A2D\u5B9A\u4E0D\u6703\u8986\u84CB\u76EE\u524D\u6A21\u7D44\u8A2D\u5B9A\u3002",
        groupHelp: "\u9032\u968E\uFF1Achoices[].steps[] \u53EF\u4F7F\u7528 chat\u3001emote\u3001action\u3001activity\u3001expression\u3001animation\uFF1B\u7BC4\u4F8B\u898B README\u3002",
        masterHint: "\u95DC\u9589\u53EA\u505C\u6B62\u904A\u6232\u5167\u53CD\u61C9\uFF0C\u8A2D\u5B9A\u4ECD\u53EF\u7DE8\u8F2F",
        moduleHint: "\u958B\u95DC\u5404\u9805\u56DE\u61C9\u6A21\u7D44",
        personaProgressHint: "\u67E5\u770B\u7E3D\u898F\u5247\u6578\u8207\u555F\u7528\u6BD4\u4F8B",
        activePersona: "\u76EE\u524D\u9078\u5B9A",
        sparePersona: "\u5099\u7528\u4EBA\u683C",
        enabledRuleCount: "{enabled} \u689D\u555F\u7528 \xB7 {disabled} \u689D\u95DC\u9589",
        ruleCount: "\u689D\u898F\u5247",
        personaResponses: "\u4EBA\u683C\u53CD\u61C9",
        finish: "\u5B8C\u6210",
        responseCount: "\u500B\u56DE\u61C9",
        type: "\u985E\u578B",
        allGroups: "\u6240\u6709\u90E8\u4F4D",
        allActivities: "\u6240\u6709\u52D5\u4F5C",
        openActionPicker: "\u958B\u555F\u4EBA\u9AD4\u52D5\u4F5C\u9762\u677F",
        activityStep: "\u52D5\u4F5C",
        textStep: "\u6587\u5B57",
        selectRuleHint: "\u8ACB\u9078\u64C7\u6216\u65B0\u589E\u4E00\u689D\u898F\u5247",
        listSettings: "\u540D\u55AE",
        searchRules: "\u641C\u5C0B\u898F\u5247",
        all: "\u5168\u90E8",
        chooseActivity: "\u9078\u64C7\u52D5\u4F5C",
        searchActivities: "\u641C\u5C0B\u986F\u793A\u540D\u7A31\u6216\u5167\u90E8\u540D\u7A31",
        noAvailableActivities: "\u6B64\u90E8\u4F4D\u76EE\u524D\u6C92\u6709\u53EF\u7528\u52D5\u4F5C",
        availableForGroup: "{group} \u53EF\u7528\u52D5\u4F5C",
        selectedActivityCount: "\u5DF2\u9078 {count} \u500B\u52D5\u4F5C",
        confirmAdd: "\u78BA\u8A8D\u52A0\u5165",
        renamePrompt: "\u8F38\u5165\u65B0\u7684\u4EBA\u683C\u540D\u7A31",
        removePersonaConfirm: "\u522A\u9664\u6B64\u4EBA\u683C\uFF1F",
        newPersonaPrompt: "\u8F38\u5165\u4EBA\u683C\u540D\u7A31",
        newPersonaDefault: "\u65B0\u4EBA\u683C",
        newRule: "\u65B0\u589E\u898F\u5247",
        renameRule: "\u91CD\u65B0\u547D\u540D\u898F\u5247",
        confirmDelete: "\u78BA\u8A8D\u522A\u9664",
        newTextResponse: "\u65B0\u589E\u6587\u5B57\u56DE\u61C9",
        editTextResponse: "\u7DE8\u8F2F\u6587\u5B57\u56DE\u61C9",
        other: "\u4ED6\u4EBA",
        outcome: "\u7D50\u679C",
        source: "\u72C0\u614B\u4F86\u6E90",
        roomEvent: "\u623F\u9593\u4E8B\u4EF6",
        roomScope: "\u623F\u9593\u7BC4\u570D",
        anyRoom: "\u4EFB\u4F55\u623F\u9593",
        namedRooms: "\u6307\u5B9A\u623F\u540D",
        roomNamesPlaceholder: "\u4EE5\u9017\u865F\u5206\u9694\u591A\u500B\u623F\u540D",
        slowLeave: "\u7DE9\u6162\u96E2\u958B",
        visitor: "\u6709\u8A2A\u5BA2",
        insertSelfName: "\u63D2\u5165\u81EA\u5DF1\u7684\u540D\u7A31",
        insertOtherName: "\u63D2\u5165\u4ED6\u4EBA\u7684\u540D\u7A31",
        searchButton: "\u641C\u5C0B",
        clearSearch: "\u6E05\u9664\u641C\u5C0B",
        selectAll: "\u5168\u9078",
        clearAll: "\u5168\u90E8\u6E05\u9664",
        unsavedTitle: "\u5C1A\u672A\u5132\u5B58",
        unsavedMessage: "\u76EE\u524D\u898F\u5247\u6709\u5C1A\u672A\u5132\u5B58\u7684\u8B8A\u66F4\u3002",
        discardExit: "\u76F4\u63A5\u9000\u51FA",
        saveExit: "\u5132\u5B58\u4E26\u9000\u51FA",
        groupPresets: "\u90E8\u4F4D\u5FEB\u9078",
        groupPreset_head: "\u982D\u90E8",
        groupPreset_upper: "\u4E0A\u534A\u8EAB",
        groupPreset_lower: "\u4E0B\u534A\u8EAB",
        groupPreset_intimate: "\u79C1\u5BC6\u90E8\u4F4D",
        currentArea: "\u7576\u524D\u90E8\u4F4D",
        allAreas: "\u5168\u90E8\u90E8\u4F4D",
        allAreaActivities: "\u5168\u90E8\u90E8\u4F4D\u7684\u53EF\u7528\u52D5\u4F5C",
        interactionTargets: "\u4EBA\u683C\u4E92\u52D5\u5C0D\u8C61",
        onlyWhitelist: "\u50C5\u767D\u540D\u55AE",
        onlyBlacklist: "\u50C5\u9ED1\u540D\u55AE",
        whiteListHint: "\u53EA\u6709\u6E05\u55AE\u5167\u7684\u6703\u54E1\u80FD\u89F8\u767C\u56DE\u61C9",
        blackListHint: "\u6E05\u55AE\u5167\u7684\u6703\u54E1\u4E0D\u6703\u89F8\u767C\u56DE\u61C9",
        memberNumbersPlaceholder: "\u6703\u54E1\u7DE8\u865F\uFF0C\u4EE5\u9017\u865F\u5206\u9694",
        ruleWhitelist: "\u898F\u5247\u767D\u540D\u55AE",
        ruleWhitelistHint: "\u7559\u7A7A\u4EE3\u8868\u6CBF\u7528\u4EBA\u683C\u5C0D\u8C61\uFF1B\u586B\u5BEB\u5F8C\u53EA\u6709\u9019\u4E9B\u6703\u54E1\u80FD\u89F8\u767C\u6B64\u898F\u5247",
        relation_owner: "\u4E3B\u4EBA",
        relation_lover: "\u6200\u4EBA",
        relation_submissive: "\u5974\u96B8",
        relation_bcWhitelist: "BC \u767D\u540D\u55AE",
        relation_friend: "\u670B\u53CB",
        animationStep: "\u7279\u6B8A\u52D5\u4F5C",
        newAnimationResponse: "\u65B0\u589E\u7279\u6B8A\u52D5\u4F5C",
        editAnimationResponse: "\u7DE8\u8F2F\u7279\u6B8A\u52D5\u4F5C",
        animationGroup: "\u88DD\u5099\u90E8\u4F4D",
        animationStateA: "\u72C0\u614B A",
        animationStateB: "\u72C0\u614B B",
        animationCount: "\u8B8A\u5316\u6B21\u6578",
        animationDuration: "A\uFF0FB \u5207\u63DB\u9593\u9694\uFF08\u6BEB\u79D2\uFF09",
        animationMessageHint: "\u53EF\u9078\u64C7\u8A0A\u606F\u985E\u578B\u4E26\u8F38\u5165\u5167\u5BB9\uFF1B\u7559\u7A7A\u6642\u53EA\u64AD\u653E\u52D5\u756B\u3002",
        mouthState: "\u53E3\u578B\u63A5\u7BA1",
        faceState: "\u8868\u60C5\u63A5\u7BA1",
        waiting: "\u672A\u555F\u7528\uFF0F\u7B49\u5F85\u5354\u8ABF",
        owns: "Responsive_Liko",
        removeConfirm: "\u522A\u9664\u6B64\u898F\u5247\uFF1F",
        importReady: "\u500B\u4EBA\u683C\u53EF\u532F\u5165"
      };
    }
  });

  // Translation/cn.js
  var cn_default;
  var init_cn = __esm({
    "Translation/cn.js"() {
      cn_default = {
        copyText: "\u590D\u5236",
        pasteText: "\u7C98\u8D34",
        copiedText: "\u5DF2\u590D\u5236",
        pastedText: "\u5DF2\u7C98\u8D34",
        clipboardUnavailable: "\u65E0\u6CD5\u8BBF\u95EE\u526A\u8D34\u677F\uFF0C\u8BF7\u4F7F\u7528 Ctrl+C\uFF0FCtrl+V\u3002",
        clearText: "\u6E05\u9664\u6587\u5B57",
        loadingActivities: "\u6B63\u5728\u52A0\u8F7D\u52A8\u4F5C\u2026\u2026",
        mainResponse: "\u4E3B\u56DE\u5E94",
        sameClothing: "\u540C\u670D\u88C5\uFF08\u4E0E A \u76F8\u540C\uFF09",
        newSpeech: "\u65B0\u589E\u8BED\u7656",
        editSpeech: "\u7F16\u8F91\u8BED\u7656",
        speech: "\u8BED\u7656",
        speechList: "\u8BED\u7656\u5217\u8868",
        speechChannel: "\u5957\u7528\u8303\u56F4",
        speech_all: "\u5168\u90E8",
        speech_chat: "\u4EC5\u804A\u5929",
        speech_whisper: "\u4EC5\u6084\u6084\u8BDD",
        chance: "\u89E6\u53D1\u6982\u7387",
        severity: "\u8BED\u7656\u4E25\u91CD\u5EA6",
        weak: "\u5F31",
        medium: "\u4E2D",
        strong: "\u5F3A",
        addicted: "\u4E2D\u6BD2",
        speechHint: "\u5F31\uFF1A\u50C5\u53E5\u5C3E\u3002\u4E2D\uFF1A\u53E5\u5C3E\u5FC5\u5B9A\u52A0\u5165\uFF0C\u53E5\u4E2D\u96A8\u6A5F\u63D2\u5165\u3002\u5F37\uFF1A\u96A8\u6A5F\u63D2\u5165\u4E09\u689D\u3002\u4E2D\u6BD2\uFF1A\u53E6\u66FF\u63DB 1\uFF5E2 \u500B\u5B57\u3002\u77ED\u53E5\u6703\u6E1B\u5C11\u63D2\u5165\u91CF\uFF0C\u4E00\u5B57\u77ED\u53E5\u4E2D\u6BD2\u6642\u53EF\u76F4\u63A5\u66FF\u63DB\u3002",
        alwaysHint: "\u4FDD\u8BC1\u89E6\u53D1\u7684\u4E3B\u56DE\u5E94\uFF08\u6BCF\u6761\u89C4\u5219\u4E00\u4E2A\uFF09\uFF0C\u5148\u4E8E\u968F\u673A\u56DE\u5E94\u6267\u884C\uFF0C\u95F4\u9694 50 \u6BEB\u79D2\uFF1B\u79BB\u623F\u65F6\u4E0D\u7B49\u5F85\u3002",
        editAppearance: "\u66F4\u8863\u5BA4\u8BBE\u7F6E",
        animationSeconds: "A\uFF0FB \u5207\u6362\u95F4\u9694\uFF08\u79D2\uFF09",
        chooseAnimationGroup: "\u8ACB\u9078\u64C7\u81F3\u5C11\u4E00\u500B\u90E8\u4F4D\u4E26\u8A2D\u5B9A A\uFF0FB\u3002",
        invalidAnimation: "\u53D8\u5316\u6B21\u6570\u987B\u4E3A 1\u2013100\uFF0C\u5207\u6362\u95F4\u9694\u987B\u4E3A 0.001\u2013120 \u79D2\u3002",
        HairAccessory2: "\u8033\u6735",
        TailStraps: "\u5C3E\u5DF4",
        Wings: "\u7FC5\u8180",
        title: "Responsive_Liko",
        home: "\u4E3B\u8BBE\u7F6E",
        enabled: "\u542F\u7528\u6A21\u5757",
        reactions: "\u52A8\u4F5C\u81EA\u52A8\u8868\u60C5",
        mouth: "\u8BF4\u8BDD\u65F6\u81EA\u52A8\u52A8\u5634",
        interruption: "\u4E2D\u65AD\u804A\u5929\u8349\u7A3F",
        bcx: "BCX \u89C4\u5219\u9884\u5148\u68C0\u67E5",
        on: "\u5F00\u542F",
        off: "\u5173\u95ED",
        persona: "\u4EBA\u683C",
        addPersona: "\u65B0\u589E\u4EBA\u683C",
        rename: "\u91CD\u547D\u540D",
        import: "\u5BFC\u5165",
        export: "\u5BFC\u51FA",
        rules: "\u53CD\u5E94\u89C4\u5219",
        addRule: "\u65B0\u589E\u89C4\u5219",
        edit: "\u7F16\u8F91",
        delete: "\u5220\u9664",
        save: "\u4FDD\u5B58",
        cancel: "\u53D6\u6D88",
        back: "\u8FD4\u56DE",
        prev: "\u4E0A\u4E00\u9875",
        next: "\u4E0B\u4E00\u9875",
        name: "\u540D\u79F0",
        whiteList: "\u767D\u540D\u5355\u4F1A\u5458\u7F16\u53F7",
        blackList: "\u9ED1\u540D\u5355\u4F1A\u5458\u7F16\u53F7",
        activity: "\u4E92\u52A8",
        orgasm: "\u9AD8\u6F6E",
        spicer: "\u8DA3\u5473",
        event: "\u4E8B\u4EF6",
        join: "\u8FDB\u623F",
        leave: "\u79BB\u5F00",
        Any: "\u6240\u6709\u7ED3\u679C",
        Orgasmed: "\u5B8C\u6210",
        Ruined: "\u62D2\u7EDD",
        Resisted: "\u5FCD\u8010",
        trigger: "\u89E6\u53D1\u6761\u4EF6",
        activities: "\u52A8\u4F5C ID\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u7A7A\u767D\u4E3A\u5168\u90E8\uFF09",
        groups: "\u90E8\u4F4D ID\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u7A7A\u767D\u4E3A\u5168\u90E8\uFF09",
        members: "\u4F1A\u5458\u7F16\u53F7\uFF08\u9017\u53F7\u5206\u9694\uFF0C\u7A7A\u767D\u4E3A\u5168\u90E8\uFF09",
        self: "\u5305\u542B\u81EA\u5DF1\u5BF9\u81EA\u5DF1\u7684\u4E92\u52A8",
        delay: "\u5EF6\u8FDF\uFF08\u6BEB\u79D2\uFF09",
        dedupe: "\u540C\u4EBA\u540C\u89C4\u5219\u95F4\u9694\uFF08\u6BEB\u79D2\uFF09",
        min: "\u72B6\u6001\u4E0B\u9650\uFF080\u2013100\uFF09",
        max: "\u72B6\u6001\u4E0A\u9650\uFF080\u2013100\uFF09",
        actor: "\u5BF9\u65B9\u7684\u72B6\u6001",
        player: "\u81EA\u5DF1\u7684\u72B6\u6001",
        responses: "\u56DE\u5E94\u5185\u5BB9",
        choicesHint: "\u6BCF\u884C\u968F\u673A\u62BD\u4E00\u6761\uFF1B\u4E00\u7EC4\u591A\u6B65\u9AA4\u8BF7\u4F7F\u7528\u8FDB\u9636 JSON\u3002",
        chat: "\u804A\u5929",
        emote: "\u52A8\u4F5C",
        action: "\u4E92\u52A8",
        advanced: "\u8FDB\u9636 JSON",
        simple: "\u6587\u5B57\u7F16\u8F91",
        catalog: "\u52A8\u4F5C\u76EE\u5F55",
        search: "\u641C\u7D22\u540D\u79F0\uFF0F\u90E8\u4F4D\uFF0FID",
        choose: "\u9009\u53D6",
        empty: "\u5C1A\u65E0\u89C4\u5219\u3002\u53EF\u65B0\u589E\u89C4\u5219\u6216\u5BFC\u5165\u539F\u6709\u7684\u4EBA\u683C\u3002",
        importHint: "\u7C98\u8D34\u539F\u7248 Base64 \u5BFC\u51FA\u7801\u6216\u65B0\u7248 JSON\u3002\u5BFC\u5165\u4F1A\u65B0\u589E\u4EBA\u683C\uFF0C\u4E0D\u8986\u76D6\u73B0\u6709\u6570\u636E\u3002",
        inspect: "\u89E3\u6790\u9884\u89C8",
        confirmImport: "\u65B0\u589E\u5BFC\u5165\u4EBA\u683C",
        imported: "\u5DF2\u5BFC\u5165",
        preview: "\u9884\u89C8\uFF08\u4E0D\u53D1\u9001\u4FE1\u606F\uFF09",
        warning: "\u8F6C\u6362\u8BF4\u660E",
        saved: "\u5DF2\u4FDD\u5B58",
        error: "\u9519\u8BEF",
        disabled: "\u6A21\u5757\u5DF2\u505C\u7528\uFF0C\u6240\u6709\u9009\u9879\u4FDD\u7559\u539F\u503C\u3002",
        running: "\u6A21\u5757\u5DF2\u542F\u7528",
        exportHint: "\u590D\u5236\u4EE5\u4E0B JSON\uFF0C\u4EE5\u5907\u4EFD\u6216\u5206\u4EAB\u6B64\u4EBA\u683C\u3002",
        editorHint: "\u540D\u79F0\u53D8\u91CF\uFF1A{me}\u3001{other}\u3002\u8FDB\u9636 JSON \u652F\u6301\u4E00\u7EC4\u591A\u6B65\u9AA4\u3002",
        legacyBlacklist: "\u539F\u7248\u5BFC\u51FA\u672A\u5305\u542B\u9ED1\u540D\u5355\uFF0C\u4F7F\u7528\u7A7A\u767D\u540D\u5355\u3002",
        legacyFavorite: "\u539F\u7248\u672A\u5B9E\u73B0\u7684\u300C\u5E94\u7528\u559C\u597D\u300D\u4FDD\u7559\u4E3A\u9644\u52A0\u6570\u636E\uFF0C\u4E0D\u5F71\u54CD\u56DE\u5E94\u3002",
        legacyUnusedExtras: "\u539F\u7248\u672A\u4F7F\u7528\u7684\u9644\u52A0\u53E5\u5E93\u5DF2\u4FDD\u7559\u5E76\u505C\u7528\uFF1B\u53EF\u8BBE\u7F6E\u8303\u56F4\u540E\u542F\u7528\u3002",
        legacyGlobal: "\u539F\u7248\u5168\u5C40\u8BBE\u7F6E\u4E0D\u4F1A\u8986\u76D6\u76EE\u524D\u6A21\u5757\u8BBE\u7F6E\u3002",
        groupHelp: "\u8FDB\u9636\uFF1Achoices[].steps[] \u53EF\u4F7F\u7528 chat\u3001emote\u3001action\u3001activity\u3001expression\u3001animation\uFF1B\u793A\u4F8B\u89C1 README\u3002",
        masterHint: "\u5173\u95ED\u53EA\u505C\u6B62\u6E38\u620F\u5185\u53CD\u5E94\uFF0C\u8BBE\u7F6E\u4ECD\u53EF\u7F16\u8F91",
        moduleHint: "\u5F00\u5173\u5404\u9879\u56DE\u5E94\u6A21\u5757",
        personaProgressHint: "\u67E5\u770B\u603B\u89C4\u5219\u6570\u4E0E\u542F\u7528\u6BD4\u4F8B",
        activePersona: "\u76EE\u524D\u9009\u5B9A",
        sparePersona: "\u5907\u7528\u4EBA\u683C",
        enabledRuleCount: "{enabled} \u6761\u542F\u7528 \xB7 {disabled} \u6761\u5173\u95ED",
        ruleCount: "\u6761\u89C4\u5219",
        personaResponses: "\u4EBA\u683C\u53CD\u5E94",
        finish: "\u5B8C\u6210",
        responseCount: "\u4E2A\u56DE\u5E94",
        type: "\u7C7B\u578B",
        allGroups: "\u6240\u6709\u90E8\u4F4D",
        allActivities: "\u6240\u6709\u52A8\u4F5C",
        openActionPicker: "\u6253\u5F00\u4EBA\u4F53\u52A8\u4F5C\u9762\u677F",
        activityStep: "\u52A8\u4F5C",
        textStep: "\u6587\u5B57",
        selectRuleHint: "\u8BF7\u9009\u62E9\u6216\u65B0\u589E\u4E00\u6761\u89C4\u5219",
        listSettings: "\u540D\u5355",
        searchRules: "\u641C\u7D22\u89C4\u5219",
        all: "\u5168\u90E8",
        chooseActivity: "\u9009\u62E9\u52A8\u4F5C",
        searchActivities: "\u641C\u7D22\u663E\u793A\u540D\u79F0\u6216\u5185\u90E8\u540D\u79F0",
        noAvailableActivities: "\u6B64\u90E8\u4F4D\u76EE\u524D\u6CA1\u6709\u53EF\u7528\u52A8\u4F5C",
        availableForGroup: "{group} \u53EF\u7528\u52A8\u4F5C",
        selectedActivityCount: "\u5DF2\u9009 {count} \u4E2A\u52A8\u4F5C",
        confirmAdd: "\u786E\u8BA4\u52A0\u5165",
        renamePrompt: "\u8F93\u5165\u65B0\u7684\u4EBA\u683C\u540D\u79F0",
        removePersonaConfirm: "\u5220\u9664\u6B64\u4EBA\u683C\uFF1F",
        newPersonaPrompt: "\u8F93\u5165\u4EBA\u683C\u540D\u79F0",
        newPersonaDefault: "\u65B0\u4EBA\u683C",
        newRule: "\u65B0\u589E\u89C4\u5219",
        renameRule: "\u91CD\u547D\u540D\u89C4\u5219",
        confirmDelete: "\u786E\u8BA4\u5220\u9664",
        newTextResponse: "\u65B0\u589E\u6587\u5B57\u56DE\u5E94",
        editTextResponse: "\u7F16\u8F91\u6587\u5B57\u56DE\u5E94",
        other: "\u4ED6\u4EBA",
        outcome: "\u7ED3\u679C",
        source: "\u72B6\u6001\u6765\u6E90",
        roomEvent: "\u623F\u95F4\u4E8B\u4EF6",
        roomScope: "\u623F\u95F4\u8303\u56F4",
        anyRoom: "\u4EFB\u4F55\u623F\u95F4",
        namedRooms: "\u6307\u5B9A\u623F\u540D",
        roomNamesPlaceholder: "\u4EE5\u9017\u53F7\u5206\u9694\u591A\u4E2A\u623F\u540D",
        slowLeave: "\u7F13\u6162\u79BB\u5F00",
        visitor: "\u6709\u8BBF\u5BA2",
        insertSelfName: "\u63D2\u5165\u81EA\u5DF1\u7684\u540D\u79F0",
        insertOtherName: "\u63D2\u5165\u4ED6\u4EBA\u7684\u540D\u79F0",
        searchButton: "\u641C\u7D22",
        clearSearch: "\u6E05\u9664\u641C\u7D22",
        selectAll: "\u5168\u9009",
        clearAll: "\u5168\u90E8\u6E05\u9664",
        unsavedTitle: "\u5C1A\u672A\u4FDD\u5B58",
        unsavedMessage: "\u5F53\u524D\u89C4\u5219\u6709\u5C1A\u672A\u4FDD\u5B58\u7684\u66F4\u6539\u3002",
        discardExit: "\u76F4\u63A5\u9000\u51FA",
        saveExit: "\u4FDD\u5B58\u5E76\u9000\u51FA",
        groupPresets: "\u90E8\u4F4D\u5FEB\u9009",
        groupPreset_head: "\u5934\u90E8",
        groupPreset_upper: "\u4E0A\u534A\u8EAB",
        groupPreset_lower: "\u4E0B\u534A\u8EAB",
        groupPreset_intimate: "\u79C1\u5BC6\u90E8\u4F4D",
        currentArea: "\u5F53\u524D\u90E8\u4F4D",
        allAreas: "\u5168\u90E8\u90E8\u4F4D",
        allAreaActivities: "\u5168\u90E8\u90E8\u4F4D\u7684\u53EF\u7528\u52A8\u4F5C",
        interactionTargets: "\u4EBA\u683C\u4E92\u52A8\u5BF9\u8C61",
        onlyWhitelist: "\u4EC5\u767D\u540D\u5355",
        onlyBlacklist: "\u4EC5\u9ED1\u540D\u5355",
        whiteListHint: "\u53EA\u6709\u540D\u5355\u5185\u7684\u4F1A\u5458\u80FD\u89E6\u53D1\u56DE\u5E94",
        blackListHint: "\u540D\u5355\u5185\u7684\u4F1A\u5458\u4E0D\u4F1A\u89E6\u53D1\u56DE\u5E94",
        memberNumbersPlaceholder: "\u4F1A\u5458\u7F16\u53F7\uFF0C\u4EE5\u9017\u53F7\u5206\u9694",
        ruleWhitelist: "\u89C4\u5219\u767D\u540D\u5355",
        ruleWhitelistHint: "\u7559\u7A7A\u4EE3\u8868\u6CBF\u7528\u4EBA\u683C\u5BF9\u8C61\uFF1B\u586B\u5199\u540E\u53EA\u6709\u8FD9\u4E9B\u4F1A\u5458\u80FD\u89E6\u53D1\u6B64\u89C4\u5219",
        relation_owner: "\u4E3B\u4EBA",
        relation_lover: "\u604B\u4EBA",
        relation_submissive: "\u5974\u96B6",
        relation_bcWhitelist: "BC \u767D\u540D\u5355",
        relation_friend: "\u670B\u53CB",
        animationStep: "\u7279\u6B8A\u52A8\u4F5C",
        newAnimationResponse: "\u65B0\u589E\u7279\u6B8A\u52A8\u4F5C",
        editAnimationResponse: "\u7F16\u8F91\u7279\u6B8A\u52A8\u4F5C",
        animationGroup: "\u88C5\u5907\u90E8\u4F4D",
        animationStateA: "\u72B6\u6001 A",
        animationStateB: "\u72B6\u6001 B",
        animationCount: "\u53D8\u5316\u6B21\u6570",
        animationDuration: "A\uFF0FB \u5207\u6362\u95F4\u9694\uFF08\u6BEB\u79D2\uFF09",
        animationMessageHint: "\u53EF\u9009\u62E9\u4FE1\u606F\u7C7B\u578B\u5E76\u8F93\u5165\u5185\u5BB9\uFF1B\u7559\u7A7A\u65F6\u53EA\u64AD\u653E\u52A8\u753B\u3002",
        mouthState: "\u53E3\u578B\u63A5\u7BA1",
        faceState: "\u8868\u60C5\u63A5\u7BA1",
        waiting: "\u672A\u542F\u7528\uFF0F\u7B49\u5F85\u534F\u8C03",
        owns: "Responsive_Liko",
        removeConfirm: "\u5220\u9664\u6B64\u89C4\u5219\uFF1F",
        importReady: "\u4E2A\u4EBA\u683C\u53EF\u5BFC\u5165"
      };
    }
  });

  // Translation/de.js
  var de_default;
  var init_de = __esm({
    "Translation/de.js"() {
      de_default = {
        copyText: "Kopieren",
        pasteText: "Einf\xFCgen",
        copiedText: "Kopiert",
        pastedText: "Eingef\xFCgt",
        clipboardUnavailable: "Zwischenablage nicht verf\xFCgbar. Strg+C / Strg+V verwenden.",
        clearText: "Text l\xF6schen",
        loadingActivities: "Aktivit\xE4ten werden geladen\u2026",
        title: "Responsive_Liko",
        home: "Einstellungen",
        enabled: "Modul aktivieren",
        reactions: "Automatische Mimik bei Interaktionen",
        mouth: "Automatische Mundbewegung beim Sprechen",
        interruption: "Chatentwurf unterbrechen",
        bcx: "BCX-Vorabpr\xFCfung",
        on: "AN",
        off: "AUS",
        persona: "Pers\xF6nlichkeit",
        addPersona: "Neue Pers\xF6nlichkeit",
        rename: "Umbenennen",
        import: "Importieren",
        export: "Exportieren",
        rules: "Reaktionsregeln",
        addRule: "Regel hinzuf\xFCgen",
        edit: "Bearbeiten",
        delete: "L\xF6schen",
        save: "Speichern",
        cancel: "Abbrechen",
        back: "Zur\xFCck",
        prev: "Zur\xFCck",
        next: "Weiter",
        name: "Name",
        whiteList: "Mitgliedsnummern der Freigabeliste",
        blackList: "Mitgliedsnummern der Sperrliste",
        activity: "Interaktion",
        orgasm: "Orgasmus",
        spicer: "Spa\xDF",
        event: "Raumereignis",
        join: "Raum betreten",
        leave: "Verlassen",
        Any: "Beliebiger Ausgang",
        Orgasmed: "Vollendet",
        Ruined: "Unterbrochen",
        Resisted: "Widerstanden",
        trigger: "Ausl\xF6ser",
        activities: "Aktivit\xE4ts-IDs (kommagetrennt; leer = alle)",
        groups: "Gruppen-IDs (kommagetrennt; leer = alle)",
        members: "Mitgliedsnummern (kommagetrennt; leer = alle)",
        self: "Eigene Interaktionen einbeziehen",
        delay: "Verz\xF6gerung (ms)",
        dedupe: "Intervall je Person und Regel (ms)",
        min: "Mindestwert (0\u2013100)",
        max: "H\xF6chstwert (0\u2013100)",
        actor: "Zustand der handelnden Person",
        player: "Mein Zustand",
        responses: "Antworten",
        choicesHint: "Eine Zeile = eine zuf\xE4llige Auswahl. F\xFCr mehrere Schritte den erweiterten JSON-Editor verwenden.",
        chat: "Chatnachricht",
        emote: "Emote",
        action: "Aktion",
        advanced: "Erweiterter JSON-Editor",
        simple: "Texteditor",
        catalog: "Aktivit\xE4tskatalog",
        search: "Name / Gruppe / ID suchen",
        choose: "Ausw\xE4hlen",
        empty: "Noch keine Regeln. Eine Regel hinzuf\xFCgen oder eine Pers\xF6nlichkeit importieren.",
        importHint: "Alten Base64-Export oder Responsive_Liko-JSON einf\xFCgen. Importierte Pers\xF6nlichkeiten werden hinzugef\xFCgt, vorhandene nicht \xFCberschrieben.",
        inspect: "Pr\xFCfen",
        confirmImport: "Importierte Pers\xF6nlichkeiten hinzuf\xFCgen",
        imported: "Importiert",
        preview: "Vorschau (ohne Nachrichtenversand)",
        warning: "Hinweise",
        saved: "Gespeichert",
        error: "Fehler",
        disabled: "Modul deaktiviert. Gespeicherte Einstellungen bleiben erhalten.",
        running: "Modul aktiviert",
        exportHint: "Diesen JSON-Text kopieren, um die Pers\xF6nlichkeit zu sichern oder zu teilen.",
        editorHint: "Variablen: {me}, {other}. Gruppierte Schritte werden im erweiterten JSON unterst\xFCtzt.",
        legacyBlacklist: "Der alte Export enth\xE4lt keine Sperrliste; es wird eine leere Liste verwendet.",
        legacyFavorite: "Das alte Kennzeichen apply_favorite bleibt als Metadatum erhalten; die urspr\xFCngliche Engine hat es nicht umgesetzt.",
        legacyUnusedExtras: "Ungenutzte zus\xE4tzliche Antwortkategorien wurden beibehalten, aber deaktiviert. Vor dem Aktivieren ihre Bereiche festlegen.",
        legacyGlobal: "Alte globale Optionen ersetzen die aktuellen Moduleinstellungen nicht.",
        groupHelp: "Erweitert: choices[].steps[] unterst\xFCtzt chat, emote, action, activity, expression und animation. Beispiele stehen in der README.",
        masterHint: "Deaktivieren stoppt Reaktionen im Spiel; Einstellungen bleiben bearbeitbar.",
        moduleHint: "Antwortmodule ein- oder ausschalten",
        personaProgressHint: "Gesamtzahl und aktive Regeln ansehen",
        activePersona: "Aktiv",
        sparePersona: "Alternative Pers\xF6nlichkeit",
        enabledRuleCount: "{enabled} aktiv \xB7 {disabled} inaktiv",
        ruleCount: "Regeln",
        personaResponses: "Antworten der Pers\xF6nlichkeit",
        finish: "Fertig",
        responseCount: "Antworten",
        type: "Typ",
        allGroups: "Alle K\xF6rperbereiche",
        allActivities: "Alle Aktivit\xE4ten",
        openActionPicker: "K\xF6rperaktivit\xE4ten ausw\xE4hlen",
        activityStep: "Aktivit\xE4t",
        textStep: "Text",
        selectRuleHint: "Eine Regel ausw\xE4hlen oder hinzuf\xFCgen",
        listSettings: "Listen",
        searchRules: "Regeln suchen",
        all: "Alle",
        chooseActivity: "Aktivit\xE4ten ausw\xE4hlen",
        searchActivities: "Anzeigenamen oder internen Namen suchen",
        noAvailableActivities: "Keine verf\xFCgbaren Aktivit\xE4ten f\xFCr diesen Bereich",
        availableForGroup: "Aktivit\xE4ten f\xFCr {group}",
        selectedActivityCount: "{count} Aktivit\xE4ten ausgew\xE4hlt",
        confirmAdd: "Auswahl hinzuf\xFCgen",
        renamePrompt: "Neuen Namen der Pers\xF6nlichkeit eingeben",
        removePersonaConfirm: "Diese Pers\xF6nlichkeit l\xF6schen?",
        newPersonaPrompt: "Namen der Pers\xF6nlichkeit eingeben",
        newPersonaDefault: "Neue Pers\xF6nlichkeit",
        newRule: "Neue Regel",
        renameRule: "Regel umbenennen",
        confirmDelete: "L\xF6schen best\xE4tigen",
        newTextResponse: "Textantwort hinzuf\xFCgen",
        editTextResponse: "Textantwort bearbeiten",
        other: "Andere",
        outcome: "Ergebnis",
        source: "Zustandsquelle",
        roomEvent: "Raumereignis",
        roomScope: "Geltungsbereich",
        anyRoom: "Beliebiger Raum",
        namedRooms: "Bestimmte R\xE4ume",
        roomNamesPlaceholder: "Raumnamen durch Kommas trennen",
        slowLeave: "Langsames Verlassen",
        visitor: "Besuch trifft ein",
        insertSelfName: "Meinen Namen einf\xFCgen",
        insertOtherName: "Namen des Gegen\xFCbers einf\xFCgen",
        searchButton: "Suchen",
        clearSearch: "Suche leeren",
        selectAll: "Alle ausw\xE4hlen",
        clearAll: "Auswahl l\xF6schen",
        unsavedTitle: "Ungespeicherte \xC4nderungen",
        unsavedMessage: "Diese Regel enth\xE4lt ungespeicherte \xC4nderungen.",
        discardExit: "Ohne Speichern verlassen",
        saveExit: "Speichern und verlassen",
        groupPresets: "K\xF6rperbereich-Vorlagen",
        groupPreset_head: "Kopf",
        groupPreset_upper: "Oberk\xF6rper",
        groupPreset_lower: "Unterk\xF6rper",
        groupPreset_intimate: "Intimbereich",
        currentArea: "Aktueller Bereich",
        allAreas: "Alle Bereiche",
        allAreaActivities: "Verf\xFCgbare Aktivit\xE4ten aller Bereiche",
        interactionTargets: "Interaktionspartner der Pers\xF6nlichkeit",
        onlyWhitelist: "Nur Freigabeliste",
        onlyBlacklist: "Nur Sperrliste",
        whiteListHint: "Nur aufgef\xFChrte Mitglieder k\xF6nnen Antworten ausl\xF6sen.",
        blackListHint: "Aufgef\xFChrte Mitglieder k\xF6nnen keine Antworten ausl\xF6sen.",
        memberNumbersPlaceholder: "Mitgliedsnummern, durch Kommas getrennt",
        ruleWhitelist: "Freigabeliste der Regel",
        ruleWhitelistHint: "Leer lassen, um die Partner der Pers\xF6nlichkeit zu verwenden; sonst k\xF6nnen nur diese Mitglieder die Regel ausl\xF6sen.",
        relation_owner: "Besitzer",
        relation_lover: "Geliebte",
        relation_submissive: "Unterw\xFCrfige",
        relation_bcWhitelist: "BC-Freigabeliste",
        relation_friend: "Freunde",
        animationStep: "Spezialaktion",
        newAnimationResponse: "Spezialaktion hinzuf\xFCgen",
        editAnimationResponse: "Spezialaktion bearbeiten",
        animationGroup: "Aussehensslot",
        animationStateA: "Zustand A",
        animationStateB: "Zustand B",
        animationCount: "Wechselanzahl",
        animationDuration: "A/B-Wechselintervall (ms)",
        animationMessageHint: "Optional Nachrichtentyp w\xE4hlen und Text eingeben. Leer lassen, um nur die Animation abzuspielen.",
        mouthState: "Steuerung der Mundbewegung",
        faceState: "Steuerung der Mimik",
        waiting: "Inaktiv / wartend",
        owns: "Responsive_Liko",
        removeConfirm: "Diese Regel l\xF6schen?",
        importReady: "Pers\xF6nlichkeiten zum Import bereit",
        mainResponse: "Hauptantwort",
        sameClothing: "Gleiche Kleidung wie A",
        newSpeech: "Sprachphrase hinzuf\xFCgen",
        editSpeech: "Sprachphrase bearbeiten",
        speech: "Sprachgewohnheit",
        speechList: "Sprachphrasen",
        speechChannel: "Anwenden auf",
        speech_all: "Alle",
        speech_chat: "Nur Chat",
        speech_whisper: "Nur Fl\xFCstern",
        chance: "Wahrscheinlichkeit",
        severity: "St\xE4rke",
        weak: "Schwach",
        medium: "Mittel",
        strong: "Stark",
        addicted: "Abh\xE4ngig",
        speechHint: "Schwach: Satzende. Mittel: Satzende und zuf\xE4llige Einf\xFCgung. Stark: bis zu drei Einf\xFCgungen. Abh\xE4ngig: ersetzt zus\xE4tzlich 1\u20132 Zeichen. Kurze Nachrichten werden weniger ver\xE4ndert.",
        alwaysHint: "Garantierte Antwort (eine pro Regel). Wird 50 ms vor einer zuf\xE4lligen Antwort ausgef\xFChrt; beim Verlassen ohne Pause.",
        editAppearance: "Garderobe",
        animationSeconds: "A/B-Wechselintervall (Sekunden)",
        chooseAnimationGroup: "Mindestens eine Gruppe und beide Zust\xE4nde ausw\xE4hlen.",
        invalidAnimation: "Anzahl: 1\u2013100; Wechselintervall: 0,001\u2013120 Sekunden.",
        HairAccessory2: "Ohren",
        TailStraps: "Schwanz",
        Wings: "Fl\xFCgel"
      };
    }
  });

  // Translation/fr.js
  var fr_default;
  var init_fr = __esm({
    "Translation/fr.js"() {
      fr_default = {
        copyText: "Copier",
        pasteText: "Coller",
        copiedText: "Copi\xE9",
        pastedText: "Coll\xE9",
        clipboardUnavailable: "Presse-papiers indisponible. Utilisez Ctrl+C / Ctrl+V.",
        clearText: "Effacer le texte",
        loadingActivities: "Chargement des activit\xE9s\u2026",
        title: "Responsive_Liko",
        home: "Param\xE8tres",
        enabled: "Activer le module",
        reactions: "Expressions automatiques lors des actions",
        mouth: "Mouvement automatique de la bouche en parlant",
        interruption: "Interrompre le brouillon du chat",
        bcx: "V\xE9rification pr\xE9alable BCX",
        on: "ACTIV\xC9",
        off: "D\xC9SACTIV\xC9",
        persona: "Personnalit\xE9",
        addPersona: "Nouvelle personnalit\xE9",
        rename: "Renommer",
        import: "Importer",
        export: "Exporter",
        rules: "R\xE8gles de r\xE9action",
        addRule: "Ajouter une r\xE8gle",
        edit: "Modifier",
        delete: "Supprimer",
        save: "Enregistrer",
        cancel: "Annuler",
        back: "Retour",
        prev: "Pr\xE9c\xE9dent",
        next: "Suivant",
        name: "Nom",
        whiteList: "Num\xE9ros des membres autoris\xE9s",
        blackList: "Num\xE9ros des membres bloqu\xE9s",
        activity: "Interaction",
        orgasm: "Orgasme",
        spicer: "Amusement",
        event: "\xC9v\xE9nement de salon",
        join: "Entr\xE9e dans le salon",
        leave: "D\xE9part",
        Any: "Tous les r\xE9sultats",
        Orgasmed: "Orgasme atteint",
        Ruined: "Interrompu",
        Resisted: "R\xE9sist\xE9",
        trigger: "D\xE9clencheur",
        activities: "Identifiants des activit\xE9s (s\xE9par\xE9s par des virgules ; vide = toutes)",
        groups: "Identifiants des groupes (s\xE9par\xE9s par des virgules ; vide = tous)",
        members: "Num\xE9ros des membres (s\xE9par\xE9s par des virgules ; vide = tous)",
        self: "Inclure les interactions avec soi-m\xEAme",
        delay: "D\xE9lai (ms)",
        dedupe: "Intervalle par personne et r\xE8gle (ms)",
        min: "\xC9tat minimum (0\u2013100)",
        max: "\xC9tat maximum (0\u2013100)",
        actor: "\xC9tat de la personne \xE0 l\u2019origine de l\u2019action",
        player: "Mon \xE9tat",
        responses: "R\xE9ponses",
        choicesHint: "Une ligne = un choix al\xE9atoire. Pour plusieurs \xE9tapes, utilisez l\u2019\xE9diteur JSON avanc\xE9.",
        chat: "Message de chat",
        emote: "\xC9mote",
        action: "Action",
        advanced: "JSON avanc\xE9",
        simple: "\xC9diteur de texte",
        catalog: "Catalogue des activit\xE9s",
        search: "Rechercher un nom / groupe / identifiant",
        choose: "S\xE9lectionner",
        empty: "Aucune r\xE8gle. Ajoutez une r\xE8gle ou importez une personnalit\xE9.",
        importHint: "Collez un ancien export Base64 ou un JSON Responsive_Liko. Les personnalit\xE9s import\xE9es sont ajout\xE9es sans \xE9craser les existantes.",
        inspect: "Examiner",
        confirmImport: "Ajouter les personnalit\xE9s import\xE9es",
        imported: "Import\xE9",
        preview: "Aper\xE7u (aucun message envoy\xE9)",
        warning: "Remarques",
        saved: "Enregistr\xE9",
        error: "Erreur",
        disabled: "Module d\xE9sactiv\xE9. Les r\xE9glages enregistr\xE9s sont conserv\xE9s.",
        running: "Module activ\xE9",
        exportHint: "Copiez ce JSON pour sauvegarder ou partager cette personnalit\xE9.",
        editorHint: "Variables : {me}, {other}. Le JSON avanc\xE9 prend en charge les \xE9tapes group\xE9es.",
        legacyBlacklist: "L\u2019ancien export ne contient aucune liste de blocage ; une liste vide est utilis\xE9e.",
        legacyFavorite: "L\u2019ancien indicateur apply_favorite est conserv\xE9 comme m\xE9tadonn\xE9e ; il n\u2019\xE9tait pas impl\xE9ment\xE9 dans le moteur d\u2019origine.",
        legacyUnusedExtras: "Les cat\xE9gories suppl\xE9mentaires inutilis\xE9es ont \xE9t\xE9 conserv\xE9es mais d\xE9sactiv\xE9es. D\xE9finissez leurs plages avant de les activer.",
        legacyGlobal: "Les anciennes options globales ne remplacent pas les r\xE9glages du module.",
        groupHelp: "Avanc\xE9 : choices[].steps[] accepte chat, emote, action, activity, expression et animation. Consultez le README pour des exemples.",
        masterHint: "La d\xE9sactivation arr\xEAte les r\xE9actions en jeu ; les r\xE9glages restent modifiables.",
        moduleHint: "Activer ou d\xE9sactiver les modules de r\xE9ponse",
        personaProgressHint: "Consulter le nombre total de r\xE8gles et les r\xE8gles actives",
        activePersona: "Active",
        sparePersona: "Personnalit\xE9 secondaire",
        enabledRuleCount: "{enabled} actives \xB7 {disabled} d\xE9sactiv\xE9es",
        ruleCount: "r\xE8gles",
        personaResponses: "R\xE9ponses de la personnalit\xE9",
        finish: "Termin\xE9",
        responseCount: "r\xE9ponses",
        type: "Type",
        allGroups: "Toutes les zones du corps",
        allActivities: "Toutes les activit\xE9s",
        openActionPicker: "Choisir les activit\xE9s par zone du corps",
        activityStep: "Activit\xE9",
        textStep: "Texte",
        selectRuleHint: "S\xE9lectionnez ou ajoutez une r\xE8gle",
        listSettings: "Listes",
        searchRules: "Rechercher des r\xE8gles",
        all: "Tout",
        chooseActivity: "Choisir les activit\xE9s",
        searchActivities: "Rechercher le nom affich\xE9 ou interne",
        noAvailableActivities: "Aucune activit\xE9 disponible pour cette zone",
        availableForGroup: "Activit\xE9s pour {group}",
        selectedActivityCount: "{count} activit\xE9s s\xE9lectionn\xE9es",
        confirmAdd: "Ajouter la s\xE9lection",
        renamePrompt: "Entrez un nouveau nom de personnalit\xE9",
        removePersonaConfirm: "Supprimer cette personnalit\xE9 ?",
        newPersonaPrompt: "Entrez un nom de personnalit\xE9",
        newPersonaDefault: "Nouvelle personnalit\xE9",
        newRule: "Nouvelle r\xE8gle",
        renameRule: "Renommer la r\xE8gle",
        confirmDelete: "Confirmer la suppression",
        newTextResponse: "Ajouter une r\xE9ponse textuelle",
        editTextResponse: "Modifier la r\xE9ponse textuelle",
        other: "Autre",
        outcome: "R\xE9sultat",
        source: "Source de l\u2019\xE9tat",
        roomEvent: "\xC9v\xE9nement du salon",
        roomScope: "Salons concern\xE9s",
        anyRoom: "Tous les salons",
        namedRooms: "Salons nomm\xE9s",
        roomNamesPlaceholder: "S\xE9parez les noms des salons par des virgules",
        slowLeave: "D\xE9part lent",
        visitor: "Arriv\xE9e d\u2019un visiteur",
        insertSelfName: "Ins\xE9rer mon nom",
        insertOtherName: "Ins\xE9rer son nom",
        searchButton: "Rechercher",
        clearSearch: "Effacer la recherche",
        selectAll: "Tout s\xE9lectionner",
        clearAll: "Tout d\xE9s\xE9lectionner",
        unsavedTitle: "Modifications non enregistr\xE9es",
        unsavedMessage: "Cette r\xE8gle contient des modifications non enregistr\xE9es.",
        discardExit: "Quitter sans enregistrer",
        saveExit: "Enregistrer et quitter",
        groupPresets: "Pr\xE9r\xE9glages corporels",
        groupPreset_head: "T\xEAte",
        groupPreset_upper: "Haut du corps",
        groupPreset_lower: "Bas du corps",
        groupPreset_intimate: "Zones intimes",
        currentArea: "Zone actuelle",
        allAreas: "Toutes les zones",
        allAreaActivities: "Activit\xE9s disponibles pour toutes les zones",
        interactionTargets: "Cibles d\u2019interaction de la personnalit\xE9",
        onlyWhitelist: "Liste d\u2019autorisation uniquement",
        onlyBlacklist: "Liste de blocage uniquement",
        whiteListHint: "Seuls les membres de la liste peuvent d\xE9clencher des r\xE9ponses.",
        blackListHint: "Les membres de la liste ne peuvent pas d\xE9clencher de r\xE9ponses.",
        memberNumbersPlaceholder: "Num\xE9ros des membres, s\xE9par\xE9s par des virgules",
        ruleWhitelist: "Liste d\u2019autorisation de la r\xE8gle",
        ruleWhitelistHint: "Laissez vide pour utiliser les cibles de la personnalit\xE9 ; sinon, seuls ces membres peuvent d\xE9clencher la r\xE8gle.",
        relation_owner: "Propri\xE9taire",
        relation_lover: "Partenaires amoureux",
        relation_submissive: "Personnes soumises",
        relation_bcWhitelist: "Liste d\u2019autorisation BC",
        relation_friend: "Amis",
        animationStep: "Action sp\xE9ciale",
        newAnimationResponse: "Ajouter une action sp\xE9ciale",
        editAnimationResponse: "Modifier l\u2019action sp\xE9ciale",
        animationGroup: "Emplacement d\u2019apparence",
        animationStateA: "\xC9tat A",
        animationStateB: "\xC9tat B",
        animationCount: "Nombre de changements",
        animationDuration: "Intervalle A/B (ms)",
        animationMessageHint: "Choisissez \xE9ventuellement un type de message et saisissez un texte. Laissez vide pour jouer uniquement l\u2019animation.",
        mouthState: "Contr\xF4le de la bouche",
        faceState: "Contr\xF4le des expressions",
        waiting: "Inactif / en attente",
        owns: "Responsive_Liko",
        removeConfirm: "Supprimer cette r\xE8gle ?",
        importReady: "personnalit\xE9s pr\xEAtes \xE0 importer",
        mainResponse: "R\xE9ponse principale",
        sameClothing: "M\xEAme tenue que A",
        newSpeech: "Ajouter une phrase",
        editSpeech: "Modifier la phrase",
        speech: "Habitude de langage",
        speechList: "Phrases habituelles",
        speechChannel: "Appliquer \xE0",
        speech_all: "Tout",
        speech_chat: "Chat uniquement",
        speech_whisper: "Chuchotements uniquement",
        chance: "Probabilit\xE9",
        severity: "Intensit\xE9",
        weak: "Faible",
        medium: "Moyenne",
        strong: "Forte",
        addicted: "D\xE9pendance",
        speechHint: "Faible : fin de phrase. Moyenne : fin et insertion al\xE9atoire. Forte : jusqu\u2019\xE0 trois insertions. D\xE9pendance : remplace aussi 1 \xE0 2 caract\xE8res. Les messages courts sont moins modifi\xE9s.",
        alwaysHint: "R\xE9ponse garantie (une par r\xE8gle), ex\xE9cut\xE9e 50 ms avant une r\xE9ponse al\xE9atoire ; sans pause lors du d\xE9part.",
        editAppearance: "Garde-robe",
        animationSeconds: "Intervalle A/B (secondes)",
        chooseAnimationGroup: "S\xE9lectionnez au moins un groupe et les deux \xE9tats.",
        invalidAnimation: "Nombre : 1\u2013100 ; intervalle : 0,001\u2013120 secondes.",
        HairAccessory2: "Oreilles",
        TailStraps: "Queue",
        Wings: "Ailes"
      };
    }
  });

  // Translation/ru.js
  var ru_default;
  var init_ru = __esm({
    "Translation/ru.js"() {
      ru_default = {
        copyText: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
        pasteText: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C",
        copiedText: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        pastedText: "\u0412\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E",
        clipboardUnavailable: "\u0411\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 Ctrl+C / Ctrl+V.",
        clearText: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442",
        loadingActivities: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439\u2026",
        title: "Responsive_Liko",
        home: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
        enabled: "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u043C\u043E\u0434\u0443\u043B\u044C",
        reactions: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043C\u0438\u043C\u0438\u043A\u0430 \u043F\u0440\u0438 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F\u0445",
        mouth: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435 \u0440\u0442\u0430 \u043F\u0440\u0438 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440\u0435",
        interruption: "\u041F\u0440\u0435\u0440\u044B\u0432\u0430\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0447\u0430\u0442\u0430",
        bcx: "\u041F\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 BCX",
        on: "\u0412\u041A\u041B",
        off: "\u0412\u042B\u041A\u041B",
        persona: "\u041B\u0438\u0447\u043D\u043E\u0441\u0442\u044C",
        addPersona: "\u041D\u043E\u0432\u0430\u044F \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C",
        rename: "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u0442\u044C",
        import: "\u0418\u043C\u043F\u043E\u0440\u0442",
        export: "\u042D\u043A\u0441\u043F\u043E\u0440\u0442",
        rules: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0440\u0435\u0430\u043A\u0446\u0438\u0439",
        addRule: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        edit: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C",
        delete: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
        save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
        cancel: "\u041E\u0442\u043C\u0435\u043D\u0430",
        back: "\u041D\u0430\u0437\u0430\u0434",
        prev: "\u041D\u0430\u0437\u0430\u0434",
        next: "\u0414\u0430\u043B\u0435\u0435",
        name: "\u0418\u043C\u044F",
        whiteList: "\u041D\u043E\u043C\u0435\u0440\u0430 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0431\u0435\u043B\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430",
        blackList: "\u041D\u043E\u043C\u0435\u0440\u0430 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430",
        activity: "\u0412\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        orgasm: "\u041E\u0440\u0433\u0430\u0437\u043C",
        spicer: "\u0420\u0430\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u0435",
        event: "\u0421\u043E\u0431\u044B\u0442\u0438\u0435 \u043A\u043E\u043C\u043D\u0430\u0442\u044B",
        join: "\u0412\u0445\u043E\u0434 \u0432 \u043A\u043E\u043C\u043D\u0430\u0442\u0443",
        leave: "\u0412\u044B\u0445\u043E\u0434",
        Any: "\u041B\u044E\u0431\u043E\u0439 \u0438\u0441\u0445\u043E\u0434",
        Orgasmed: "\u041E\u0440\u0433\u0430\u0437\u043C \u0434\u043E\u0441\u0442\u0438\u0433\u043D\u0443\u0442",
        Ruined: "\u041F\u0440\u0435\u0440\u0432\u0430\u043D",
        Resisted: "\u0421\u0434\u0435\u0440\u0436\u0430\u043D",
        trigger: "\u0423\u0441\u043B\u043E\u0432\u0438\u0435 \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u043D\u0438\u044F",
        activities: "ID \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E; \u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435)",
        groups: "ID \u0433\u0440\u0443\u043F\u043F (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E; \u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435)",
        members: "\u041D\u043E\u043C\u0435\u0440\u0430 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E; \u043F\u0443\u0441\u0442\u043E = \u0432\u0441\u0435)",
        self: "\u0423\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043D\u0430\u0434 \u0441\u043E\u0431\u043E\u0439",
        delay: "\u0417\u0430\u0434\u0435\u0440\u0436\u043A\u0430 (\u043C\u0441)",
        dedupe: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0434\u043B\u044F \u043E\u0434\u043D\u043E\u0433\u043E \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430 \u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 (\u043C\u0441)",
        min: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 (0\u2013100)",
        max: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 (0\u2013100)",
        actor: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u0438\u043D\u0438\u0446\u0438\u0430\u0442\u043E\u0440\u0430",
        player: "\u041C\u043E\u0451 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435",
        responses: "\u041E\u0442\u0432\u0435\u0442\u044B",
        choicesHint: "\u041E\u0434\u043D\u0430 \u0441\u0442\u0440\u043E\u043A\u0430 \u2014 \u043E\u0434\u0438\u043D \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442. \u0414\u043B\u044F \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u0448\u0430\u0433\u043E\u0432 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 JSON.",
        chat: "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u0432 \u0447\u0430\u0442",
        emote: "\u042D\u043C\u043E\u0446\u0438\u044F",
        action: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        advanced: "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 JSON",
        simple: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440",
        catalog: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439",
        search: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u0438\u043C\u0435\u043D\u0438 / \u0433\u0440\u0443\u043F\u043F\u0435 / ID",
        choose: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C",
        empty: "\u041F\u0440\u0430\u0432\u0438\u043B \u043F\u043E\u043A\u0430 \u043D\u0435\u0442. \u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0438\u043B\u0438 \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u0443\u0439\u0442\u0435 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C.",
        importHint: "\u0412\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0441\u0442\u0430\u0440\u044B\u0439 \u044D\u043A\u0441\u043F\u043E\u0440\u0442 Base64 \u0438\u043B\u0438 JSON Responsive_Liko. \u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F, \u0430 \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u044E\u0442 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0435.",
        inspect: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C",
        confirmImport: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438",
        imported: "\u0418\u043C\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E",
        preview: "\u041F\u0440\u0435\u0434\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 (\u0431\u0435\u0437 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439)",
        warning: "\u041F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F",
        saved: "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E",
        error: "\u041E\u0448\u0438\u0431\u043A\u0430",
        disabled: "\u041C\u043E\u0434\u0443\u043B\u044C \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D. \u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F.",
        running: "\u041C\u043E\u0434\u0443\u043B\u044C \u0432\u043A\u043B\u044E\u0447\u0451\u043D",
        exportHint: "\u0421\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u044D\u0442\u043E\u0442 JSON \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0434\u0430\u0447\u0438 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438.",
        editorHint: "\u041F\u0435\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0435: {me}, {other}. \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439 JSON \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0433\u0440\u0443\u043F\u043F\u044B \u0448\u0430\u0433\u043E\u0432.",
        legacyBlacklist: "\u0412 \u0441\u0442\u0430\u0440\u043E\u043C \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0435 \u043D\u0435\u0442 \u0447\u0451\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430; \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F \u043F\u0443\u0441\u0442\u043E\u0439 \u0441\u043F\u0438\u0441\u043E\u043A.",
        legacyFavorite: "\u0421\u0442\u0430\u0440\u044B\u0439 \u0444\u043B\u0430\u0433 apply_favorite \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D \u0432 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u043D\u044B\u0445; \u0438\u0441\u0445\u043E\u0434\u043D\u044B\u0439 \u0434\u0432\u0438\u0436\u043E\u043A \u0435\u0433\u043E \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043B.",
        legacyUnusedExtras: "\u041D\u0435\u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0435 \u0434\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 \u043E\u0442\u0432\u0435\u0442\u043E\u0432 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u044B, \u043D\u043E \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u044B. \u041F\u0435\u0440\u0435\u0434 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435\u043C \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u0438\u0445 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u044B.",
        legacyGlobal: "\u0421\u0442\u0430\u0440\u044B\u0435 \u043E\u0431\u0449\u0438\u0435 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B \u043D\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u044E\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043C\u043E\u0434\u0443\u043B\u044F.",
        groupHelp: "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438: choices[].steps[] \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 chat, emote, action, activity, expression \u0438 animation. \u041F\u0440\u0438\u043C\u0435\u0440\u044B \u0441\u043C. \u0432 README.",
        masterHint: "\u0412\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442 \u0440\u0435\u0430\u043A\u0446\u0438\u0438 \u0432 \u0438\u0433\u0440\u0435; \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043C\u043E\u0436\u043D\u043E \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C.",
        moduleHint: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043C\u043E\u0434\u0443\u043B\u0435\u0439 \u043E\u0442\u0432\u0435\u0442\u043E\u0432",
        personaProgressHint: "\u041E\u0431\u0449\u0435\u0435 \u0447\u0438\u0441\u043B\u043E \u043F\u0440\u0430\u0432\u0438\u043B \u0438 \u0432\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
        activePersona: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430\u044F",
        sparePersona: "\u0417\u0430\u043F\u0430\u0441\u043D\u0430\u044F \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C",
        enabledRuleCount: "\u0412\u043A\u043B\u044E\u0447\u0435\u043D\u043E: {enabled} \xB7 \u0432\u044B\u043A\u043B\u044E\u0447\u0435\u043D\u043E: {disabled}",
        ruleCount: "\u043F\u0440\u0430\u0432\u0438\u043B",
        personaResponses: "\u041E\u0442\u0432\u0435\u0442\u044B \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438",
        finish: "\u0413\u043E\u0442\u043E\u0432\u043E",
        responseCount: "\u043E\u0442\u0432\u0435\u0442\u043E\u0432",
        type: "\u0422\u0438\u043F",
        allGroups: "\u0412\u0441\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u0438 \u0442\u0435\u043B\u0430",
        allActivities: "\u0412\u0441\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
        openActionPicker: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u043F\u043E \u043E\u0431\u043B\u0430\u0441\u0442\u0438 \u0442\u0435\u043B\u0430",
        activityStep: "\u0412\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        textStep: "\u0422\u0435\u043A\u0441\u0442",
        selectRuleHint: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u043B\u0438 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        listSettings: "\u0421\u043F\u0438\u0441\u043A\u0438",
        searchRules: "\u041F\u043E\u0438\u0441\u043A \u043F\u0440\u0430\u0432\u0438\u043B",
        all: "\u0412\u0441\u0435",
        chooseActivity: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
        searchActivities: "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u043C\u043E\u043C\u0443 \u0438\u043B\u0438 \u0432\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u0435\u043C\u0443 \u0438\u043C\u0435\u043D\u0438",
        noAvailableActivities: "\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u0434\u043B\u044F \u044D\u0442\u043E\u0439 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",
        availableForGroup: "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0434\u043B\u044F {group}",
        selectedActivityCount: "\u0412\u044B\u0431\u0440\u0430\u043D\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439: {count}",
        confirmAdd: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0435",
        renamePrompt: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u043E\u0432\u043E\u0435 \u0438\u043C\u044F \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438",
        removePersonaConfirm: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C?",
        newPersonaPrompt: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438",
        newPersonaDefault: "\u041D\u043E\u0432\u0430\u044F \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u044C",
        newRule: "\u041D\u043E\u0432\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        renameRule: "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        confirmDelete: "\u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435",
        newTextResponse: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u043E\u0442\u0432\u0435\u0442",
        editTextResponse: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0439 \u043E\u0442\u0432\u0435\u0442",
        other: "\u0414\u0440\u0443\u0433\u043E\u0435",
        outcome: "\u0418\u0441\u0445\u043E\u0434",
        source: "\u0418\u0441\u0442\u043E\u0447\u043D\u0438\u043A \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F",
        roomEvent: "\u0421\u043E\u0431\u044B\u0442\u0438\u0435 \u043A\u043E\u043C\u043D\u0430\u0442\u044B",
        roomScope: "\u041E\u0431\u043B\u0430\u0441\u0442\u044C \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
        anyRoom: "\u041B\u044E\u0431\u0430\u044F \u043A\u043E\u043C\u043D\u0430\u0442\u0430",
        namedRooms: "\u0423\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0435 \u043A\u043E\u043C\u043D\u0430\u0442\u044B",
        roomNamesPlaceholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u044F \u043A\u043E\u043C\u043D\u0430\u0442 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",
        slowLeave: "\u041C\u0435\u0434\u043B\u0435\u043D\u043D\u044B\u0439 \u0432\u044B\u0445\u043E\u0434",
        visitor: "\u041F\u0440\u0438\u0445\u043E\u0434 \u043F\u043E\u0441\u0435\u0442\u0438\u0442\u0435\u043B\u044F",
        insertSelfName: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u043C\u043E\u0451 \u0438\u043C\u044F",
        insertOtherName: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0438\u043C\u044F \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430",
        searchButton: "\u041F\u043E\u0438\u0441\u043A",
        clearSearch: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A",
        selectAll: "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0432\u0441\u0451",
        clearAll: "\u0421\u043D\u044F\u0442\u044C \u0432\u044B\u0431\u043E\u0440",
        unsavedTitle: "\u041D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
        unsavedMessage: "\u0412 \u044D\u0442\u043E\u043C \u043F\u0440\u0430\u0432\u0438\u043B\u0435 \u0435\u0441\u0442\u044C \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F.",
        discardExit: "\u0412\u044B\u0439\u0442\u0438 \u0431\u0435\u0437 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F",
        saveExit: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0438 \u0432\u044B\u0439\u0442\u0438",
        groupPresets: "\u041D\u0430\u0431\u043E\u0440\u044B \u043E\u0431\u043B\u0430\u0441\u0442\u0435\u0439 \u0442\u0435\u043B\u0430",
        groupPreset_head: "\u0413\u043E\u043B\u043E\u0432\u0430",
        groupPreset_upper: "\u0412\u0435\u0440\u0445\u043D\u044F\u044F \u0447\u0430\u0441\u0442\u044C \u0442\u0435\u043B\u0430",
        groupPreset_lower: "\u041D\u0438\u0436\u043D\u044F\u044F \u0447\u0430\u0441\u0442\u044C \u0442\u0435\u043B\u0430",
        groupPreset_intimate: "\u0418\u043D\u0442\u0438\u043C\u043D\u044B\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",
        currentArea: "\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C",
        allAreas: "\u0412\u0441\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u0438",
        allAreaActivities: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043E\u0431\u043B\u0430\u0441\u0442\u0435\u0439",
        interactionTargets: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0432\u0437\u0430\u0438\u043C\u043E\u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0439 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438",
        onlyWhitelist: "\u0422\u043E\u043B\u044C\u043A\u043E \u0431\u0435\u043B\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
        onlyBlacklist: "\u0422\u043E\u043B\u044C\u043A\u043E \u0447\u0451\u0440\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
        whiteListHint: "\u0422\u043E\u043B\u044C\u043A\u043E \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u043C\u043E\u0433\u0443\u0442 \u0432\u044B\u0437\u044B\u0432\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u044B.",
        blackListHint: "\u0423\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0438 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u043D\u0435 \u043C\u043E\u0433\u0443\u0442 \u0432\u044B\u0437\u044B\u0432\u0430\u0442\u044C \u043E\u0442\u0432\u0435\u0442\u044B.",
        memberNumbersPlaceholder: "\u041D\u043E\u043C\u0435\u0440\u0430 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432 \u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E",
        ruleWhitelist: "\u0411\u0435\u043B\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
        ruleWhitelistHint: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C \u0434\u043B\u044F \u0441\u043F\u0438\u0441\u043A\u0430 \u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0438; \u0438\u043D\u0430\u0447\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0441\u0440\u0430\u0431\u0430\u0442\u044B\u0432\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0443\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0445 \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u043E\u0432.",
        relation_owner: "\u0425\u043E\u0437\u044F\u0438\u043D",
        relation_lover: "\u0412\u043E\u0437\u043B\u044E\u0431\u043B\u0435\u043D\u043D\u044B\u0435",
        relation_submissive: "\u041F\u043E\u0434\u0447\u0438\u043D\u0451\u043D\u043D\u044B\u0435",
        relation_bcWhitelist: "\u0411\u0435\u043B\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A BC",
        relation_friend: "\u0414\u0440\u0443\u0437\u044C\u044F",
        animationStep: "\u041E\u0441\u043E\u0431\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        newAnimationResponse: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0441\u043E\u0431\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        editAnimationResponse: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043E\u0441\u043E\u0431\u043E\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435",
        animationGroup: "\u0421\u043B\u043E\u0442 \u0432\u043D\u0435\u0448\u043D\u043E\u0441\u0442\u0438",
        animationStateA: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 A",
        animationStateB: "\u0421\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 B",
        animationCount: "\u0427\u0438\u0441\u043B\u043E \u0441\u043C\u0435\u043D",
        animationDuration: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B A/B (\u043C\u0441)",
        animationMessageHint: "\u041F\u0440\u0438 \u0436\u0435\u043B\u0430\u043D\u0438\u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0442\u0438\u043F \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0438 \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u0442\u0435\u043A\u0441\u0442. \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043F\u0443\u0441\u0442\u044B\u043C, \u0447\u0442\u043E\u0431\u044B \u0432\u043E\u0441\u043F\u0440\u043E\u0438\u0437\u0432\u0435\u0441\u0442\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0430\u043D\u0438\u043C\u0430\u0446\u0438\u044E.",
        mouthState: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435\u043C \u0440\u0442\u0430",
        faceState: "\u0423\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0438\u043C\u0438\u043A\u043E\u0439",
        waiting: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E / \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0435",
        owns: "Responsive_Liko",
        removeConfirm: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E \u043F\u0440\u0430\u0432\u0438\u043B\u043E?",
        importReady: "\u043B\u0438\u0447\u043D\u043E\u0441\u0442\u0435\u0439 \u0433\u043E\u0442\u043E\u0432\u043E \u043A \u0438\u043C\u043F\u043E\u0440\u0442\u0443",
        mainResponse: "\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043E\u0442\u0432\u0435\u0442",
        sameClothing: "\u0422\u0430 \u0436\u0435 \u043E\u0434\u0435\u0436\u0434\u0430, \u0447\u0442\u043E \u0432 A",
        newSpeech: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0444\u0440\u0430\u0437\u0443",
        editSpeech: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0444\u0440\u0430\u0437\u0443",
        speech: "\u0420\u0435\u0447\u0435\u0432\u0430\u044F \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0430",
        speechList: "\u041F\u0440\u0438\u0432\u044B\u0447\u043D\u044B\u0435 \u0444\u0440\u0430\u0437\u044B",
        speechChannel: "\u041F\u0440\u0438\u043C\u0435\u043D\u044F\u0442\u044C \u043A",
        speech_all: "\u0412\u0441\u0435",
        speech_chat: "\u0422\u043E\u043B\u044C\u043A\u043E \u0447\u0430\u0442",
        speech_whisper: "\u0422\u043E\u043B\u044C\u043A\u043E \u0448\u0451\u043F\u043E\u0442",
        chance: "\u0412\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044C",
        severity: "\u0418\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u043E\u0441\u0442\u044C",
        weak: "\u0421\u043B\u0430\u0431\u0430\u044F",
        medium: "\u0421\u0440\u0435\u0434\u043D\u044F\u044F",
        strong: "\u0421\u0438\u043B\u044C\u043D\u0430\u044F",
        addicted: "\u0417\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u044C",
        speechHint: "\u0421\u043B\u0430\u0431\u0430\u044F: \u043A\u043E\u043D\u0435\u0446 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F. \u0421\u0440\u0435\u0434\u043D\u044F\u044F: \u043A\u043E\u043D\u0435\u0446 \u0438 \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u0430\u044F \u0432\u0441\u0442\u0430\u0432\u043A\u0430. \u0421\u0438\u043B\u044C\u043D\u0430\u044F: \u0434\u043E \u0442\u0440\u0451\u0445 \u0432\u0441\u0442\u0430\u0432\u043E\u043A. \u0417\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u044C: \u0442\u0430\u043A\u0436\u0435 \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442 1\u20132 \u0441\u0438\u043C\u0432\u043E\u043B\u0430. \u041A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0438\u0437\u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u043C\u0435\u043D\u044C\u0448\u0435.",
        alwaysHint: "\u0413\u0430\u0440\u0430\u043D\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 (\u043E\u0434\u0438\u043D \u043D\u0430 \u043F\u0440\u0430\u0432\u0438\u043B\u043E) \u0437\u0430 50 \u043C\u0441 \u0434\u043E \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0433\u043E \u043E\u0442\u0432\u0435\u0442\u0430; \u043F\u0440\u0438 \u0432\u044B\u0445\u043E\u0434\u0435 \u0431\u0435\u0437 \u043F\u0430\u0443\u0437\u044B.",
        editAppearance: "\u0413\u0430\u0440\u0434\u0435\u0440\u043E\u0431",
        animationSeconds: "\u0418\u043D\u0442\u0435\u0440\u0432\u0430\u043B A/B (\u0441\u0435\u043A\u0443\u043D\u0434\u044B)",
        chooseAnimationGroup: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u0433\u0440\u0443\u043F\u043F\u0443 \u0438 \u043E\u0431\u0430 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F.",
        invalidAnimation: "\u041A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E: 1\u2013100; \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B: 0,001\u2013120 \u0441\u0435\u043A\u0443\u043D\u0434.",
        HairAccessory2: "\u0423\u0448\u0438",
        TailStraps: "\u0425\u0432\u043E\u0441\u0442",
        Wings: "\u041A\u0440\u044B\u043B\u044C\u044F"
      };
    }
  });

  // Translation/ua.js
  var ua_default;
  var init_ua = __esm({
    "Translation/ua.js"() {
      ua_default = {
        copyText: "\u041A\u043E\u043F\u0456\u044E\u0432\u0430\u0442\u0438",
        pasteText: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438",
        copiedText: "\u0421\u043A\u043E\u043F\u0456\u0439\u043E\u0432\u0430\u043D\u043E",
        pastedText: "\u0412\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E",
        clipboardUnavailable: "\u0411\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0456\u043D\u0443 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439. \u0412\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u0439\u0442\u0435 Ctrl+C / Ctrl+V.",
        clearText: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u0442\u0435\u043A\u0441\u0442",
        loadingActivities: "\u0417\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0434\u0456\u0439\u2026",
        title: "Responsive_Liko",
        home: "\u041D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F",
        enabled: "\u0423\u0432\u0456\u043C\u043A\u043D\u0443\u0442\u0438 \u043C\u043E\u0434\u0443\u043B\u044C",
        reactions: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0430 \u043C\u0456\u043C\u0456\u043A\u0430 \u043F\u0456\u0434 \u0447\u0430\u0441 \u0434\u0456\u0439",
        mouth: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u043D\u0438\u0439 \u0440\u0443\u0445 \u0440\u043E\u0442\u0430 \u043F\u0456\u0434 \u0447\u0430\u0441 \u0440\u043E\u0437\u043C\u043E\u0432\u0438",
        interruption: "\u041F\u0435\u0440\u0435\u0440\u0438\u0432\u0430\u0442\u0438 \u0447\u0435\u0440\u043D\u0435\u0442\u043A\u0443 \u0447\u0430\u0442\u0443",
        bcx: "\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044F \u043F\u0435\u0440\u0435\u0432\u0456\u0440\u043A\u0430 BCX",
        on: "\u0423\u0412\u0406\u041C\u041A",
        off: "\u0412\u0418\u041C\u041A",
        persona: "\u041E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C",
        addPersona: "\u041D\u043E\u0432\u0430 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C",
        rename: "\u041F\u0435\u0440\u0435\u0439\u043C\u0435\u043D\u0443\u0432\u0430\u0442\u0438",
        import: "\u0406\u043C\u043F\u043E\u0440\u0442",
        export: "\u0415\u043A\u0441\u043F\u043E\u0440\u0442",
        rules: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0440\u0435\u0430\u043A\u0446\u0456\u0439",
        addRule: "\u0414\u043E\u0434\u0430\u0442\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        edit: "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438",
        delete: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438",
        save: "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438",
        cancel: "\u0421\u043A\u0430\u0441\u0443\u0432\u0430\u0442\u0438",
        back: "\u041D\u0430\u0437\u0430\u0434",
        prev: "\u041D\u0430\u0437\u0430\u0434",
        next: "\u0414\u0430\u043B\u0456",
        name: "\u0406\u043C\u2019\u044F",
        whiteList: "\u041D\u043E\u043C\u0435\u0440\u0438 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 \u0431\u0456\u043B\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0443",
        blackList: "\u041D\u043E\u043C\u0435\u0440\u0438 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 \u0447\u043E\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0443",
        activity: "\u0412\u0437\u0430\u0454\u043C\u043E\u0434\u0456\u044F",
        orgasm: "\u041E\u0440\u0433\u0430\u0437\u043C",
        spicer: "\u0420\u043E\u0437\u0432\u0430\u0433\u0430",
        event: "\u041F\u043E\u0434\u0456\u044F \u043A\u0456\u043C\u043D\u0430\u0442\u0438",
        join: "\u0412\u0445\u0456\u0434 \u0434\u043E \u043A\u0456\u043C\u043D\u0430\u0442\u0438",
        leave: "\u0412\u0438\u0445\u0456\u0434",
        Any: "\u0411\u0443\u0434\u044C-\u044F\u043A\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442",
        Orgasmed: "\u041E\u0440\u0433\u0430\u0437\u043C \u0434\u043E\u0441\u044F\u0433\u043D\u0443\u0442\u043E",
        Ruined: "\u041F\u0435\u0440\u0435\u0440\u0432\u0430\u043D\u043E",
        Resisted: "\u0421\u0442\u0440\u0438\u043C\u0430\u043D\u043E",
        trigger: "\u0423\u043C\u043E\u0432\u0430 \u0441\u043F\u0440\u0430\u0446\u044E\u0432\u0430\u043D\u043D\u044F",
        activities: "ID \u0434\u0456\u0439 (\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443; \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0443\u0441\u0456)",
        groups: "ID \u0433\u0440\u0443\u043F (\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443; \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0443\u0441\u0456)",
        members: "\u041D\u043E\u043C\u0435\u0440\u0438 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 (\u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443; \u043F\u043E\u0440\u043E\u0436\u043D\u044C\u043E = \u0443\u0441\u0456)",
        self: "\u0412\u0440\u0430\u0445\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0434\u0456\u0457 \u043D\u0430\u0434 \u0441\u043E\u0431\u043E\u044E",
        delay: "\u0417\u0430\u0442\u0440\u0438\u043C\u043A\u0430 (\u043C\u0441)",
        dedupe: "\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B \u0434\u043B\u044F \u043E\u0434\u043D\u043E\u0433\u043E \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0430 \u0439 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 (\u043C\u0441)",
        min: "\u041C\u0456\u043D\u0456\u043C\u0430\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F (0\u2013100)",
        max: "\u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F (0\u2013100)",
        actor: "\u0421\u0442\u0430\u043D \u0456\u043D\u0456\u0446\u0456\u0430\u0442\u043E\u0440\u0430",
        player: "\u041C\u0456\u0439 \u0441\u0442\u0430\u043D",
        responses: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456",
        choicesHint: "\u041E\u0434\u0438\u043D \u0440\u044F\u0434\u043E\u043A \u2014 \u043E\u0434\u0438\u043D \u0432\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0438\u0439 \u0432\u0430\u0440\u0456\u0430\u043D\u0442. \u0414\u043B\u044F \u043A\u0456\u043B\u044C\u043A\u043E\u0445 \u043A\u0440\u043E\u043A\u0456\u0432 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0439\u0442\u0435 \u0440\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0438\u0439 JSON.",
        chat: "\u041F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0432 \u0447\u0430\u0442",
        emote: "\u0415\u043C\u043E\u0446\u0456\u044F",
        action: "\u0414\u0456\u044F",
        advanced: "\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0438\u0439 JSON",
        simple: "\u0422\u0435\u043A\u0441\u0442\u043E\u0432\u0438\u0439 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440",
        catalog: "\u041A\u0430\u0442\u0430\u043B\u043E\u0433 \u0434\u0456\u0439",
        search: "\u041F\u043E\u0448\u0443\u043A \u0437\u0430 \u043D\u0430\u0437\u0432\u043E\u044E / \u0433\u0440\u0443\u043F\u043E\u044E / ID",
        choose: "\u0412\u0438\u0431\u0440\u0430\u0442\u0438",
        empty: "\u041F\u0440\u0430\u0432\u0438\u043B \u0449\u0435 \u043D\u0435\u043C\u0430\u0454. \u0414\u043E\u0434\u0430\u0439\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0430\u0431\u043E \u0456\u043C\u043F\u043E\u0440\u0442\u0443\u0439\u0442\u0435 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C.",
        importHint: "\u0412\u0441\u0442\u0430\u0432\u0442\u0435 \u0441\u0442\u0430\u0440\u0438\u0439 \u0435\u043A\u0441\u043F\u043E\u0440\u0442 Base64 \u0430\u0431\u043E JSON Responsive_Liko. \u0406\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u0456 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456 \u0434\u043E\u0434\u0430\u044E\u0442\u044C\u0441\u044F, \u0430 \u043D\u0435 \u0437\u0430\u043C\u0456\u043D\u044E\u044E\u0442\u044C \u043D\u0430\u044F\u0432\u043D\u0456.",
        inspect: "\u041F\u0435\u0440\u0435\u0432\u0456\u0440\u0438\u0442\u0438",
        confirmImport: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0456\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u0456 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456",
        imported: "\u0406\u043C\u043F\u043E\u0440\u0442\u043E\u0432\u0430\u043D\u043E",
        preview: "\u041F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439 \u043F\u0435\u0440\u0435\u0433\u043B\u044F\u0434 (\u0431\u0435\u0437 \u043D\u0430\u0434\u0441\u0438\u043B\u0430\u043D\u043D\u044F \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u044C)",
        warning: "\u041F\u0440\u0438\u043C\u0456\u0442\u043A\u0438",
        saved: "\u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E",
        error: "\u041F\u043E\u043C\u0438\u043B\u043A\u0430",
        disabled: "\u041C\u043E\u0434\u0443\u043B\u044C \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E. \u0417\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u0437\u0430\u043B\u0438\u0448\u0430\u044E\u0442\u044C\u0441\u044F.",
        running: "\u041C\u043E\u0434\u0443\u043B\u044C \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E",
        exportHint: "\u0421\u043A\u043E\u043F\u0456\u044E\u0439\u0442\u0435 \u0446\u0435\u0439 JSON \u0434\u043B\u044F \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F \u0430\u0431\u043E \u043F\u043E\u0448\u0438\u0440\u0435\u043D\u043D\u044F \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456.",
        editorHint: "\u0417\u043C\u0456\u043D\u043D\u0456: {me}, {other}. \u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0438\u0439 JSON \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454 \u0433\u0440\u0443\u043F\u0438 \u043A\u0440\u043E\u043A\u0456\u0432.",
        legacyBlacklist: "\u0423 \u0441\u0442\u0430\u0440\u043E\u043C\u0443 \u0435\u043A\u0441\u043F\u043E\u0440\u0442\u0456 \u043D\u0435\u043C\u0430\u0454 \u0447\u043E\u0440\u043D\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0443; \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0454\u0442\u044C\u0441\u044F \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u0439 \u0441\u043F\u0438\u0441\u043E\u043A.",
        legacyFavorite: "\u0421\u0442\u0430\u0440\u0438\u0439 \u043F\u0440\u0430\u043F\u043E\u0440\u0435\u0446\u044C apply_favorite \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E \u0432 \u043C\u0435\u0442\u0430\u0434\u0430\u043D\u0438\u0445; \u043F\u043E\u0447\u0430\u0442\u043A\u043E\u0432\u0438\u0439 \u0440\u0443\u0448\u0456\u0439 \u0439\u043E\u0433\u043E \u043D\u0435 \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u043E\u0432\u0443\u0432\u0430\u0432.",
        legacyUnusedExtras: "\u041D\u0435\u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u043D\u0456 \u0434\u043E\u0434\u0430\u0442\u043A\u043E\u0432\u0456 \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0456\u0457 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0435\u0439 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E, \u0430\u043B\u0435 \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E. \u041F\u0435\u0440\u0435\u0434 \u0443\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043D\u044F\u043C \u0437\u0430\u0434\u0430\u0439\u0442\u0435 \u0457\u0445\u043D\u0456 \u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D\u0438.",
        legacyGlobal: "\u0421\u0442\u0430\u0440\u0456 \u0437\u0430\u0433\u0430\u043B\u044C\u043D\u0456 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u0438 \u043D\u0435 \u0437\u0430\u043C\u0456\u043D\u044E\u044E\u0442\u044C \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043C\u043E\u0434\u0443\u043B\u044F.",
        groupHelp: "\u0420\u043E\u0437\u0448\u0438\u0440\u0435\u043D\u0456 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F: choices[].steps[] \u043F\u0456\u0434\u0442\u0440\u0438\u043C\u0443\u0454 chat, emote, action, activity, expression \u0442\u0430 animation. \u041F\u0440\u0438\u043A\u043B\u0430\u0434\u0438 \u0434\u0438\u0432. \u0443 README.",
        masterHint: "\u0412\u0438\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u0437\u0443\u043F\u0438\u043D\u044F\u0454 \u0440\u0435\u0430\u043A\u0446\u0456\u0457 \u0432 \u0433\u0440\u0456; \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043C\u043E\u0436\u043D\u0430 \u0440\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438.",
        moduleHint: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043D\u044F \u043C\u043E\u0434\u0443\u043B\u0456\u0432 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0435\u0439",
        personaProgressHint: "\u0417\u0430\u0433\u0430\u043B\u044C\u043D\u0430 \u043A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B \u0442\u0430 \u0432\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u0456 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
        activePersona: "\u0410\u043A\u0442\u0438\u0432\u043D\u0430",
        sparePersona: "\u0417\u0430\u043F\u0430\u0441\u043D\u0430 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C",
        enabledRuleCount: "\u0423\u0432\u0456\u043C\u043A\u043D\u0435\u043D\u043E: {enabled} \xB7 \u0432\u0438\u043C\u043A\u043D\u0435\u043D\u043E: {disabled}",
        ruleCount: "\u043F\u0440\u0430\u0432\u0438\u043B",
        personaResponses: "\u0412\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456",
        finish: "\u0413\u043E\u0442\u043E\u0432\u043E",
        responseCount: "\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0435\u0439",
        type: "\u0422\u0438\u043F",
        allGroups: "\u0423\u0441\u0456 \u0434\u0456\u043B\u044F\u043D\u043A\u0438 \u0442\u0456\u043B\u0430",
        allActivities: "\u0423\u0441\u0456 \u0434\u0456\u0457",
        openActionPicker: "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u0434\u0456\u0457 \u0437\u0430 \u0434\u0456\u043B\u044F\u043D\u043A\u043E\u044E \u0442\u0456\u043B\u0430",
        activityStep: "\u0412\u0437\u0430\u0454\u043C\u043E\u0434\u0456\u044F",
        textStep: "\u0422\u0435\u043A\u0441\u0442",
        selectRuleHint: "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0430\u0431\u043E \u0434\u043E\u0434\u0430\u0439\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        listSettings: "\u0421\u043F\u0438\u0441\u043A\u0438",
        searchRules: "\u041F\u043E\u0448\u0443\u043A \u043F\u0440\u0430\u0432\u0438\u043B",
        all: "\u0423\u0441\u0456",
        chooseActivity: "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u0434\u0456\u0457",
        searchActivities: "\u041F\u043E\u0448\u0443\u043A \u0437\u0430 \u0432\u0456\u0434\u043E\u0431\u0440\u0430\u0436\u0443\u0432\u0430\u043D\u043E\u044E \u0430\u0431\u043E \u0432\u043D\u0443\u0442\u0440\u0456\u0448\u043D\u044C\u043E\u044E \u043D\u0430\u0437\u0432\u043E\u044E",
        noAvailableActivities: "\u041D\u0435\u043C\u0430\u0454 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0445 \u0434\u0456\u0439 \u0434\u043B\u044F \u0446\u0456\u0454\u0457 \u0434\u0456\u043B\u044F\u043D\u043A\u0438",
        availableForGroup: "\u0414\u0456\u0457 \u0434\u043B\u044F {group}",
        selectedActivityCount: "\u0412\u0438\u0431\u0440\u0430\u043D\u043E \u0434\u0456\u0439: {count}",
        confirmAdd: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0432\u0438\u0431\u0440\u0430\u043D\u0435",
        renamePrompt: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u043D\u043E\u0432\u0435 \u0456\u043C\u2019\u044F \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456",
        removePersonaConfirm: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u044E \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C?",
        newPersonaPrompt: "\u0412\u0432\u0435\u0434\u0456\u0442\u044C \u0456\u043C\u2019\u044F \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456",
        newPersonaDefault: "\u041D\u043E\u0432\u0430 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u0456\u0441\u0442\u044C",
        newRule: "\u041D\u043E\u0432\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        renameRule: "\u041F\u0435\u0440\u0435\u0439\u043C\u0435\u043D\u0443\u0432\u0430\u0442\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
        confirmDelete: "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u0438 \u0432\u0438\u0434\u0430\u043B\u0435\u043D\u043D\u044F",
        newTextResponse: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C",
        editTextResponse: "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u0443 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C",
        other: "\u0406\u043D\u0448\u0435",
        outcome: "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442",
        source: "\u0414\u0436\u0435\u0440\u0435\u043B\u043E \u0441\u0442\u0430\u043D\u0443",
        roomEvent: "\u041F\u043E\u0434\u0456\u044F \u043A\u0456\u043C\u043D\u0430\u0442\u0438",
        roomScope: "\u041E\u0431\u043B\u0430\u0441\u0442\u044C \u0434\u0456\u0457",
        anyRoom: "\u0411\u0443\u0434\u044C-\u044F\u043A\u0430 \u043A\u0456\u043C\u043D\u0430\u0442\u0430",
        namedRooms: "\u0412\u043A\u0430\u0437\u0430\u043D\u0456 \u043A\u0456\u043C\u043D\u0430\u0442\u0438",
        roomNamesPlaceholder: "\u041D\u0430\u0437\u0432\u0438 \u043A\u0456\u043C\u043D\u0430\u0442 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
        slowLeave: "\u041F\u043E\u0432\u0456\u043B\u044C\u043D\u0438\u0439 \u0432\u0438\u0445\u0456\u0434",
        visitor: "\u041F\u0440\u0438\u0445\u0456\u0434 \u0432\u0456\u0434\u0432\u0456\u0434\u0443\u0432\u0430\u0447\u0430",
        insertSelfName: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u043C\u043E\u0454 \u0456\u043C\u2019\u044F",
        insertOtherName: "\u0412\u0441\u0442\u0430\u0432\u0438\u0442\u0438 \u0456\u043C\u2019\u044F \u0456\u043D\u0448\u043E\u0433\u043E \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0430",
        searchButton: "\u041F\u043E\u0448\u0443\u043A",
        clearSearch: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u0438 \u043F\u043E\u0448\u0443\u043A",
        selectAll: "\u0412\u0438\u0431\u0440\u0430\u0442\u0438 \u0432\u0441\u0435",
        clearAll: "\u0417\u043D\u044F\u0442\u0438 \u0432\u0438\u0431\u0456\u0440",
        unsavedTitle: "\u041D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u0437\u043C\u0456\u043D\u0438",
        unsavedMessage: "\u0423 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0430\u0432\u0438\u043B\u0456 \u0454 \u043D\u0435\u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u0456 \u0437\u043C\u0456\u043D\u0438.",
        discardExit: "\u0412\u0438\u0439\u0442\u0438 \u0431\u0435\u0437 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043D\u044F",
        saveExit: "\u0417\u0431\u0435\u0440\u0435\u0433\u0442\u0438 \u0439 \u0432\u0438\u0439\u0442\u0438",
        groupPresets: "\u041D\u0430\u0431\u043E\u0440\u0438 \u0434\u0456\u043B\u044F\u043D\u043E\u043A \u0442\u0456\u043B\u0430",
        groupPreset_head: "\u0413\u043E\u043B\u043E\u0432\u0430",
        groupPreset_upper: "\u0412\u0435\u0440\u0445\u043D\u044F \u0447\u0430\u0441\u0442\u0438\u043D\u0430 \u0442\u0456\u043B\u0430",
        groupPreset_lower: "\u041D\u0438\u0436\u043D\u044F \u0447\u0430\u0441\u0442\u0438\u043D\u0430 \u0442\u0456\u043B\u0430",
        groupPreset_intimate: "\u0406\u043D\u0442\u0438\u043C\u043D\u0456 \u0434\u0456\u043B\u044F\u043D\u043A\u0438",
        currentArea: "\u041F\u043E\u0442\u043E\u0447\u043D\u0430 \u0434\u0456\u043B\u044F\u043D\u043A\u0430",
        allAreas: "\u0423\u0441\u0456 \u0434\u0456\u043B\u044F\u043D\u043A\u0438",
        allAreaActivities: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u0434\u0456\u0457 \u0434\u043B\u044F \u0432\u0441\u0456\u0445 \u0434\u0456\u043B\u044F\u043D\u043E\u043A",
        interactionTargets: "\u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0438 \u0432\u0437\u0430\u0454\u043C\u043E\u0434\u0456\u0439 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456",
        onlyWhitelist: "\u041B\u0438\u0448\u0435 \u0431\u0456\u043B\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
        onlyBlacklist: "\u041B\u0438\u0448\u0435 \u0447\u043E\u0440\u043D\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A",
        whiteListHint: "\u041B\u0438\u0448\u0435 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0438 \u0437\u0456 \u0441\u043F\u0438\u0441\u043A\u0443 \u043C\u043E\u0436\u0443\u0442\u044C \u0432\u0438\u043A\u043B\u0438\u043A\u0430\u0442\u0438 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456.",
        blackListHint: "\u0423\u0447\u0430\u0441\u043D\u0438\u043A\u0438 \u0437\u0456 \u0441\u043F\u0438\u0441\u043A\u0443 \u043D\u0435 \u043C\u043E\u0436\u0443\u0442\u044C \u0432\u0438\u043A\u043B\u0438\u043A\u0430\u0442\u0438 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456.",
        memberNumbersPlaceholder: "\u041D\u043E\u043C\u0435\u0440\u0438 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432 \u0447\u0435\u0440\u0435\u0437 \u043A\u043E\u043C\u0443",
        ruleWhitelist: "\u0411\u0456\u043B\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
        ruleWhitelistHint: "\u0417\u0430\u043B\u0438\u0448\u0442\u0435 \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u043C \u0434\u043B\u044F \u0441\u043F\u0438\u0441\u043A\u0443 \u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0456; \u0456\u043D\u0430\u043A\u0448\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E \u0441\u043F\u0440\u0430\u0446\u044C\u043E\u0432\u0443\u0454 \u043B\u0438\u0448\u0435 \u0434\u043B\u044F \u0432\u043A\u0430\u0437\u0430\u043D\u0438\u0445 \u0443\u0447\u0430\u0441\u043D\u0438\u043A\u0456\u0432.",
        relation_owner: "\u0413\u043E\u0441\u043F\u043E\u0434\u0430\u0440",
        relation_lover: "\u041A\u043E\u0445\u0430\u043D\u0456",
        relation_submissive: "\u041F\u0456\u0434\u043B\u0435\u0433\u043B\u0456",
        relation_bcWhitelist: "\u0411\u0456\u043B\u0438\u0439 \u0441\u043F\u0438\u0441\u043E\u043A BC",
        relation_friend: "\u0414\u0440\u0443\u0437\u0456",
        animationStep: "\u041E\u0441\u043E\u0431\u043B\u0438\u0432\u0430 \u0434\u0456\u044F",
        newAnimationResponse: "\u0414\u043E\u0434\u0430\u0442\u0438 \u043E\u0441\u043E\u0431\u043B\u0438\u0432\u0443 \u0434\u0456\u044E",
        editAnimationResponse: "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u043E\u0441\u043E\u0431\u043B\u0438\u0432\u0443 \u0434\u0456\u044E",
        animationGroup: "\u0421\u043B\u043E\u0442 \u0437\u043E\u0432\u043D\u0456\u0448\u043D\u043E\u0441\u0442\u0456",
        animationStateA: "\u0421\u0442\u0430\u043D A",
        animationStateB: "\u0421\u0442\u0430\u043D B",
        animationCount: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C \u0437\u043C\u0456\u043D",
        animationDuration: "\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B A/B (\u043C\u0441)",
        animationMessageHint: "\u0417\u0430 \u0431\u0430\u0436\u0430\u043D\u043D\u044F\u043C \u0432\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u0442\u0438\u043F \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0439 \u0432\u0432\u0435\u0434\u0456\u0442\u044C \u0442\u0435\u043A\u0441\u0442. \u0417\u0430\u043B\u0438\u0448\u0442\u0435 \u043F\u043E\u0440\u043E\u0436\u043D\u0456\u043C, \u0449\u043E\u0431 \u0432\u0456\u0434\u0442\u0432\u043E\u0440\u0438\u0442\u0438 \u043B\u0438\u0448\u0435 \u0430\u043D\u0456\u043C\u0430\u0446\u0456\u044E.",
        mouthState: "\u041A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u0440\u0443\u0445\u043E\u043C \u0440\u043E\u0442\u0430",
        faceState: "\u041A\u0435\u0440\u0443\u0432\u0430\u043D\u043D\u044F \u043C\u0456\u043C\u0456\u043A\u043E\u044E",
        waiting: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u043E / \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u044F",
        owns: "Responsive_Liko",
        removeConfirm: "\u0412\u0438\u0434\u0430\u043B\u0438\u0442\u0438 \u0446\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E?",
        importReady: "\u043E\u0441\u043E\u0431\u0438\u0441\u0442\u043E\u0441\u0442\u0435\u0439 \u0433\u043E\u0442\u043E\u0432\u043E \u0434\u043E \u0456\u043C\u043F\u043E\u0440\u0442\u0443",
        mainResponse: "\u041E\u0441\u043D\u043E\u0432\u043D\u0430 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C",
        sameClothing: "\u0422\u043E\u0439 \u0441\u0430\u043C\u0438\u0439 \u043E\u0434\u044F\u0433, \u0449\u043E \u0432 A",
        newSpeech: "\u0414\u043E\u0434\u0430\u0442\u0438 \u0444\u0440\u0430\u0437\u0443",
        editSpeech: "\u0420\u0435\u0434\u0430\u0433\u0443\u0432\u0430\u0442\u0438 \u0444\u0440\u0430\u0437\u0443",
        speech: "\u041C\u043E\u0432\u043D\u0430 \u0437\u0432\u0438\u0447\u043A\u0430",
        speechList: "\u0417\u0432\u0438\u0447\u043D\u0456 \u0444\u0440\u0430\u0437\u0438",
        speechChannel: "\u0417\u0430\u0441\u0442\u043E\u0441\u043E\u0432\u0443\u0432\u0430\u0442\u0438 \u0434\u043E",
        speech_all: "\u0423\u0441\u0456",
        speech_chat: "\u041B\u0438\u0448\u0435 \u0447\u0430\u0442",
        speech_whisper: "\u041B\u0438\u0448\u0435 \u0448\u0435\u043F\u0456\u0442",
        chance: "\u0406\u043C\u043E\u0432\u0456\u0440\u043D\u0456\u0441\u0442\u044C",
        severity: "\u0406\u043D\u0442\u0435\u043D\u0441\u0438\u0432\u043D\u0456\u0441\u0442\u044C",
        weak: "\u0421\u043B\u0430\u0431\u043A\u0430",
        medium: "\u0421\u0435\u0440\u0435\u0434\u043D\u044F",
        strong: "\u0421\u0438\u043B\u044C\u043D\u0430",
        addicted: "\u0417\u0430\u043B\u0435\u0436\u043D\u0456\u0441\u0442\u044C",
        speechHint: "\u0421\u043B\u0430\u0431\u043A\u0430: \u043A\u0456\u043D\u0435\u0446\u044C \u0440\u0435\u0447\u0435\u043D\u043D\u044F. \u0421\u0435\u0440\u0435\u0434\u043D\u044F: \u043A\u0456\u043D\u0435\u0446\u044C \u0456 \u0432\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u0430 \u0432\u0441\u0442\u0430\u0432\u043A\u0430. \u0421\u0438\u043B\u044C\u043D\u0430: \u0434\u043E \u0442\u0440\u044C\u043E\u0445 \u0432\u0441\u0442\u0430\u0432\u043E\u043A. \u0417\u0430\u043B\u0435\u0436\u043D\u0456\u0441\u0442\u044C: \u0442\u0430\u043A\u043E\u0436 \u0437\u0430\u043C\u0456\u043D\u044E\u0454 1\u20132 \u0441\u0438\u043C\u0432\u043E\u043B\u0438. \u041A\u043E\u0440\u043E\u0442\u043A\u0456 \u043F\u043E\u0432\u0456\u0434\u043E\u043C\u043B\u0435\u043D\u043D\u044F \u0437\u043C\u0456\u043D\u044E\u044E\u0442\u044C\u0441\u044F \u043C\u0435\u043D\u0448\u0435.",
        alwaysHint: "\u0413\u0430\u0440\u0430\u043D\u0442\u043E\u0432\u0430\u043D\u0430 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u044C (\u043E\u0434\u043D\u0430 \u043D\u0430 \u043F\u0440\u0430\u0432\u0438\u043B\u043E) \u0437\u0430 50 \u043C\u0441 \u0434\u043E \u0432\u0438\u043F\u0430\u0434\u043A\u043E\u0432\u043E\u0457 \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0456; \u043F\u0456\u0434 \u0447\u0430\u0441 \u0432\u0438\u0445\u043E\u0434\u0443 \u0431\u0435\u0437 \u043F\u0430\u0443\u0437\u0438.",
        editAppearance: "\u0413\u0430\u0440\u0434\u0435\u0440\u043E\u0431",
        animationSeconds: "\u0406\u043D\u0442\u0435\u0440\u0432\u0430\u043B A/B (\u0441\u0435\u043A\u0443\u043D\u0434\u0438)",
        chooseAnimationGroup: "\u0412\u0438\u0431\u0435\u0440\u0456\u0442\u044C \u043F\u0440\u0438\u043D\u0430\u0439\u043C\u043D\u0456 \u043E\u0434\u043D\u0443 \u0433\u0440\u0443\u043F\u0443 \u0442\u0430 \u043E\u0431\u0438\u0434\u0432\u0430 \u0441\u0442\u0430\u043D\u0438.",
        invalidAnimation: "\u041A\u0456\u043B\u044C\u043A\u0456\u0441\u0442\u044C: 1\u2013100; \u0456\u043D\u0442\u0435\u0440\u0432\u0430\u043B: 0,001\u2013120 \u0441\u0435\u043A\u0443\u043D\u0434.",
        HairAccessory2: "\u0412\u0443\u0445\u0430",
        TailStraps: "\u0425\u0432\u0456\u0441\u0442",
        Wings: "\u041A\u0440\u0438\u043B\u0430"
      };
    }
  });

  // src/core/i18n.js
  function initI18n(host = globalThis) {
    host.Liko ??= {};
    if (!host.Liko.I18N) {
      const registry = /* @__PURE__ */ new Map();
      const callbacks = /* @__PURE__ */ new Set();
      const detect = () => normalize(host.TranslationLanguage || "EN");
      let current = detect();
      host.Liko.I18N = Object.freeze({
        version: 1,
        normalize,
        language: () => current,
        register: (namespace, table) => registry.set(namespace, table),
        t: (namespace, key) => registry.get(namespace)?.[current]?.[key] ?? registry.get(namespace)?.EN?.[key] ?? key,
        onChange(fn) {
          callbacks.add(fn);
          return () => callbacks.delete(fn);
        }
      });
      setInterval(() => {
        const next = detect();
        if (next !== current) {
          current = next;
          callbacks.forEach((fn) => {
            try {
              fn(next);
            } catch {
            }
          });
        }
      }, 2e3);
    }
    const shared = host.Liko.I18N;
    if (shared.version === 1 && typeof shared.register === "function") {
      shared.register(ID, tables);
      return (key) => shared.t(ID, key);
    }
    return (key) => tables[normalize(host.TranslationLanguage)]?.[key] ?? en_default[key] ?? key;
  }
  var tables, normalize;
  var init_i18n = __esm({
    "src/core/i18n.js"() {
      init_en();
      init_tw();
      init_cn();
      init_de();
      init_fr();
      init_ru();
      init_ua();
      init_model();
      tables = { EN: en_default, DE: de_default, FR: fr_default, RU: ru_default, CN: cn_default, TW: tw_default, UA: ua_default };
      normalize = (value) => ({ "ZH-TW": "TW", "ZH-HANT": "TW", "ZH-CN": "CN", "ZH-HANS": "CN", ZH: "CN", UK: "UA" })[String(value).toUpperCase()] ?? String(value || "EN").toUpperCase();
    }
  });

  // src/integrations/catalog.js
  function activityLabelKeys(name, group, character) {
    const sexGroup = character?.HasPenis?.() ? { ItemVulva: "ItemPenis", ItemVulvaPiercings: "ItemGlans" }[group] ?? group : group;
    const groups = [...new Set([sexGroup, group, LABEL_GROUP[group]].filter(Boolean))];
    return groups.flatMap(
      (candidate) => ["ChatOther", "ChatSelf"].map((direction) => `Label-${direction}-${candidate}-${name}`)
    );
  }
  function activityLabel(name, group, host = globalThis, character = host.Player) {
    for (const key of activityLabelKeys(name, group, character)) {
      let value;
      try {
        value = host.ActivityDictionaryText?.(key);
      } catch {
      }
      if (!missing(value)) return value;
      const row = host.ActivityDictionary?.find?.((r) => Array.isArray(r) && r[0] === key && !missing(r[1]));
      if (row) return row[1];
    }
    if (name.startsWith("XSAct_")) return name.slice(6);
    return name.replace(/^[A-Za-z]{2,12}_/, "");
  }
  function gameOriginalLabels(host) {
    const path = host.ScreenFileGetPath?.("ActivityDictionary.csv", "Character", "Preference") ?? "Screens/Character/Preference/ActivityDictionary.csv";
    const source = host.CommonCSVCache?.[path];
    if (!Array.isArray(source)) return /* @__PURE__ */ new Map();
    let cached = originalLabels.get(source);
    if (!cached || cached.length !== source.length) {
      cached = {
        length: source.length,
        labels: new Map(
          source.filter((row) => Array.isArray(row) && !missing(row[1])).map((row) => [row[0], row[1]])
        )
      };
      originalLabels.set(source, cached);
    }
    return cached.labels;
  }
  function activitySearchLabels(name, group, host = globalThis, character = host.Player, lookup) {
    const english = gameOriginalLabels(host), labels = /* @__PURE__ */ new Set();
    for (const key of activityLabelKeys(name, group, character)) {
      let translated;
      try {
        translated = lookup ? lookup(key) : host.ActivityDictionaryText?.(key);
      } catch {
      }
      if (!missing(translated)) labels.add(translated);
      if (!lookup) {
        for (const row of host.ActivityDictionary ?? [])
          if (Array.isArray(row) && row[0] === key && !missing(row[1])) labels.add(row[1]);
      }
      if (english.has(key)) labels.add(english.get(key));
    }
    return [...labels];
  }
  function* catalogRows(host = globalThis, selectedGroup = null) {
    let activities;
    try {
      activities = host.AssetAllActivities?.(host.Player?.AssetFamily ?? "Female3DCG");
    } catch {
    }
    activities ??= host.ActivityFemale3DCG ?? [];
    const result = /* @__PURE__ */ new Map();
    const legacy = new Map(
      (host.ActivityDictionary ?? []).filter((row) => Array.isArray(row) && !missing(row[1])).map((row) => [row[0], row[1]])
    );
    const resolved = /* @__PURE__ */ new Map();
    const lookup = (key) => {
      if (!resolved.has(key)) {
        let value;
        try {
          value = host.ActivityDictionaryText?.(key);
        } catch {
        }
        resolved.set(key, missing(value) ? legacy.get(key) : value);
      }
      return resolved.get(key);
    };
    for (const a of activities) {
      const groups = [a.Target, a.TargetSelf === true ? a.Target : a.TargetSelf].flat().filter((g) => typeof g === "string");
      for (const group of groups)
        if ((!selectedGroup || canonicalGroup(group) === canonicalGroup(selectedGroup)) && typeof a.Name === "string" && !result.has(`${group}|${a.Name}`)) {
          const label = activityLabelKeys(a.Name, group, host.Player).map(lookup).find((value) => !missing(value)) ?? a.Name.replace(/^[A-Za-z]{2,12}_/, "");
          const row = {
            name: a.Name,
            group,
            label,
            searchLabels: activitySearchLabels(a.Name, group, host, host.Player, lookup)
          };
          result.set(`${group}|${a.Name}`, row);
          yield row;
        }
    }
  }
  async function activityOptionsAsync(host = globalThis, cancelled = () => false, group = null) {
    const rows = [];
    await new Promise((resolve) => setTimeout(resolve, 16));
    if (cancelled()) return null;
    let deadline = performance.now() + 4;
    for (const row of catalogRows(host, group)) {
      if (cancelled()) return null;
      rows.push(row);
      if (performance.now() >= deadline) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        deadline = performance.now() + 4;
      }
    }
    return rows.sort((a, b) => a.label.localeCompare(b.label));
  }
  function allowedActivity(target, name, group, host = globalThis) {
    const old = target.FocusGroup;
    try {
      target.FocusGroup = host.AssetGroupGet?.(target.AssetFamily, group) ?? { Name: group };
      return host.ActivityAllowedForGroup(target, group)?.find((a) => a.Activity?.Name === name);
    } finally {
      target.FocusGroup = old;
    }
  }
  function bodyZones(character, host = globalThis) {
    const family = character?.AssetFamily ?? host.Player?.AssetFamily ?? "Female3DCG";
    const zones = [];
    for (const physical of BODY_GROUPS) {
      let group;
      try {
        group = host.AssetGroupGet?.(family, physical) ?? host.AssetGroup?.find?.((g) => g?.Family === family && g.Name === physical);
      } catch {
      }
      if (!Array.isArray(group?.Zone)) continue;
      for (const zone of group.Zone)
        if (Array.isArray(zone) && zone.length >= 4)
          zones.push({ group: canonicalGroup(physical), physical, zone: zone.slice(0, 4) });
    }
    return zones;
  }
  var missing, LABEL_GROUP, originalLabels, BODY_GROUPS, GROUP_ALIAS, canonicalGroup;
  var init_catalog = __esm({
    "src/integrations/catalog.js"() {
      missing = (s) => typeof s !== "string" || !s || /MISSING (?:TEXT|ACTIVITY)|STRING_RETRIEVAL_FAILED/.test(s);
      LABEL_GROUP = {
        ItemMouth2: "ItemMouth",
        ItemMouth3: "ItemMouth",
        ItemNeckAccessories: "ItemNeck",
        ItemNeckRestraints: "ItemNeck",
        ItemNipplesPiercings: "ItemNipples",
        ItemTorso2: "ItemTorso",
        ItemHandheld: "ItemHands"
      };
      originalLabels = /* @__PURE__ */ new WeakMap();
      BODY_GROUPS = [
        "ItemHead",
        "ItemNose",
        "ItemEars",
        "ItemHood",
        "ItemMouth",
        "ItemMouth2",
        "ItemMouth3",
        "ItemNeck",
        "ItemNeckAccessories",
        "ItemNeckRestraints",
        "ItemNipples",
        "ItemNipplesPiercings",
        "ItemBreast",
        "ItemTorso",
        "ItemTorso2",
        "ItemArms",
        "ItemHands",
        "ItemHandheld",
        "ItemPelvis",
        "ItemVulva",
        "ItemVulvaPiercings",
        "ItemButt",
        "ItemLegs",
        "ItemFeet",
        "ItemBoots"
      ];
      GROUP_ALIAS = {
        ItemMouth2: "ItemMouth",
        ItemMouth3: "ItemMouth",
        ItemNeckAccessories: "ItemNeck",
        ItemNeckRestraints: "ItemNeck",
        ItemNipplesPiercings: "ItemNipples",
        ItemTorso2: "ItemTorso",
        ItemHandheld: "ItemHands"
      };
      canonicalGroup = (group) => GROUP_ALIAS[group] ?? group;
    }
  });

  // src/integrations/bcx.js
  function checkBCX(step2, enabled, host = globalThis) {
    if (!enabled || !host.bcx) return { allowed: true };
    try {
      const api = host.bcx.getModApi?.(ID);
      if (!api?.getRuleState) return { allowed: false, reason: "BCX API unavailable" };
      const names = step2.type === "chat" ? [
        "speech_forbid_open_talking",
        "speech_limit_open_talking",
        "speech_specific_sound",
        "speech_mandatory_words",
        "greet_room_order"
      ] : step2.type === "emote" || step2.type === "action" ? ["speech_forbid_emotes", "greet_room_order"] : step2.type === "expression" && step2.group === "Emoticon" ? ["block_changing_emoticon"] : [];
      for (const name of names) {
        const state = api.getRuleState(name);
        if (state?.inEffect && state.isEnforced) return { allowed: false, reason: `BCX: ${name}` };
      }
      return { allowed: true };
    } catch {
      return { allowed: false, reason: "BCX preflight failed" };
    }
  }
  var init_bcx = __esm({
    "src/integrations/bcx.js"() {
      init_model();
    }
  });

  // src/features/appearance.js
  function animationState(track, state) {
    return state === "B" && track.stateB.sameAsset ? { ...track.stateB, asset: track.stateA.asset } : track["state" + state];
  }
  function snapshotItem(item) {
    return item ? {
      asset: item.Asset.Name,
      color: clone(item.Color ?? "Default"),
      property: clone(item.Property ?? {}),
      craft: clone(item.Craft ?? null)
    } : null;
  }
  function wearState(host, group, state) {
    if (!state) {
      host.InventoryRemove?.(host.Player, group, false);
      return;
    }
    const worn = host.InventoryWear(
      host.Player,
      state.asset,
      group,
      state.color ?? "Default",
      void 0,
      void 0,
      void 0,
      false
    );
    const item = worn ?? host.InventoryGet(host.Player, group);
    if (item) {
      if (state.property !== void 0) item.Property = clone(state.property ?? {});
      if (state.craft) item.Craft = clone(state.craft);
      else delete item.Craft;
    }
  }
  async function editAppearanceState(host, group, state, done) {
    if (typeof host.CharacterAppearanceLoadCharacter !== "function") throw Error("Wardrobe unavailable");
    const screen = host.CommonGetScreen();
    const preview = host.CharacterLoadSimple("Responsive_Liko_StatePreview");
    preview.Name = host.Player.Name;
    preview.AssetFamily = host.Player.AssetFamily;
    preview.Appearance = host.Player.Appearance.map((item) => ({
      ...item,
      Color: clone(item.Color ?? "Default"),
      Property: clone(item.Property ?? {}),
      ...item.Craft ? { Craft: clone(item.Craft) } : {}
    }));
    const previewHost = Object.create(host);
    previewHost.Player = preview;
    const restore = () => {
      preview.FocusGroup = null;
    };
    try {
      wearState(previewHost, group, state);
      host.CharacterRefresh(preview, false);
      await host.CharacterAppearanceLoadCharacter(preview, async (accepted) => {
        const saved = accepted ? snapshotItem(host.InventoryGet(preview, group)) : null;
        restore();
        await host.CommonSetScreen(...screen);
        await host.PreferenceSubscreenExtensionsOpen?.(ID);
        done(saved);
      });
    } catch (error) {
      restore();
      await host.CommonSetScreen(...screen);
      await host.PreferenceSubscreenExtensionsOpen?.(ID);
      throw error;
    }
  }
  var ANIMATION_GROUPS;
  var init_appearance = __esm({
    "src/features/appearance.js"() {
      init_model();
      ANIMATION_GROUPS = ["HairAccessory2", "TailStraps", "Wings"];
    }
  });

  // src/features/output.js
  function renderText(text, event, host = globalThis) {
    const me = host.Player;
    const other = host.ChatRoomCharacter?.find((c) => c.MemberNumber === event.actor) ?? event.actorCharacter;
    const nickname = (c) => c ? host.CharacterNickname(c) : "?";
    const pronoun = (c) => {
      const p = c && host.CharacterPronounDescription?.(c);
      return p === "She/Her" ? ["she", "her", "her", "herself"] : p === "He/Him" ? ["he", "his", "him", "himself"] : ["they", "their", "them", "themself"];
    };
    const mp = pronoun(me), op = pronoun(other);
    const values = {
      "{me}": nickname(me),
      "{self}": nickname(me),
      "{Self}": nickname(me),
      "{other}": nickname(other),
      "{Other}": nickname(other),
      "%TARGET%": nickname(me),
      "%SOURCE%": nickname(other),
      "%name%": nickname(other),
      "%TARGET_PRONOUN%": mp[0],
      "%TARGET_POSSESIVE%": mp[1],
      "%TARGET_INTENSIVE%": mp[2],
      "%SOURCE_PRONOUN%": op[0],
      "%SOURCE_POSSESIVE%": op[1],
      "%SOURCE_INTENSIVE%": other?.MemberNumber === me?.MemberNumber ? op[3] : op[2]
    };
    return text.replace(
      /\{(?:me|self|Self|other|Other)\}|%[A-Z_]+%|%name%/g,
      (token) => values[token] ?? token
    );
  }
  function createOutput({ store, host = globalThis, owns, report }) {
    const restores = /* @__PURE__ */ new Set();
    const activitySeen = /* @__PURE__ */ new Map();
    const animations = /* @__PURE__ */ new Map();
    function textMessage(step2, event) {
      const text = renderText(step2.text, event, host).trim();
      if (!text) return;
      if (step2.type === "action") {
        host.ServerSend("ChatRoomChat", {
          Type: "Action",
          Content: `${ID}_Action`,
          Dictionary: [{ Tag: `MISSING TEXT IN "Interface.csv": ${ID}_Action`, Text: text }]
        });
        return;
      }
      if (step2.type === "chat" && /^[\/!*(@.]/.test(text)) {
        report("Command-like chat skipped; use Emote/Action for narration.");
        return;
      }
      if (event.kind === "event" && event.event === "leave") {
        if (step2.type === "chat" && typeof host.ChatRoomSendChatMessage === "function")
          return host.ChatRoomSendChatMessage(text);
        if (step2.type === "emote" && typeof host.ChatRoomSendEmote === "function")
          return host.ChatRoomSendEmote("*" + text);
      }
      const draft = host.ElementValue("InputChat");
      const target = host.ChatRoomTargetMemberNumber;
      const canInterrupt = step2.type === "chat" && store.data.settings.interruption && target < 0 && draft.trim() && !/^[\/!*(@.]|^https?:/i.test(draft.trimStart());
      host.ChatRoomSetTarget(-1);
      try {
        host.ElementValue(
          "InputChat",
          step2.type === "emote" ? "*" + text : canInterrupt ? draft + "... " + text : text
        );
        host.ChatRoomSendChat();
        if (!canInterrupt || host.ElementValue("InputChat").trim()) host.ElementValue("InputChat", draft);
      } catch (error) {
        host.ElementValue("InputChat", draft);
        throw error;
      } finally {
        host.ChatRoomSetTarget(target);
      }
    }
    function expression(step2) {
      if (!owns("expressions")) {
        report("Expression ownership unavailable");
        return;
      }
      const item = host.InventoryGet(host.Player, step2.group);
      if (!item || step2.value && !item.Asset.Group.AllowExpression?.includes(step2.value)) return;
      const previous = item.Property?.Expression ?? null;
      const paired = step2.group === "Eyes" ? host.InventoryGet(host.Player, "Eyes2") : null;
      const pairedPrevious = paired?.Property?.Expression ?? null;
      host.CharacterSetFacialExpression(host.Player, step2.group, step2.value);
      let timer;
      const restore = () => {
        clearTimeout(timer);
        restores.delete(restore);
        const current = host.InventoryGet(host.Player, step2.group);
        if (current === item && (current.Property?.Expression ?? null) === step2.value)
          host.CharacterSetFacialExpression(
            host.Player,
            step2.group === "Eyes" ? "Eyes1" : step2.group,
            previous
          );
        if (paired && host.InventoryGet(host.Player, "Eyes2") === paired && (paired.Property?.Expression ?? null) === step2.value)
          host.CharacterSetFacialExpression(host.Player, "Eyes2", pairedPrevious);
      };
      timer = setTimeout(restore, step2.durationMs);
      restores.add(restore);
    }
    function animation(step2, event) {
      const groups = step2.tracks?.map((track) => track.group) ?? [step2.group];
      for (const group of groups) animations.get(group)?.();
      const originals = groups.map((group) => snapshotItem(host.InventoryGet(host.Player, group)));
      const tracks = step2.tracks ?? [
        {
          group: step2.group,
          stateA: { ...originals[0], asset: step2.assetA },
          stateB: { ...originals[0], asset: step2.assetB }
        }
      ];
      const timers = [], later = host.setTimeout ?? setTimeout;
      let finished = false;
      function cleanup() {
        finished = true;
        timers.forEach((timer) => (host.clearTimeout ?? clearTimeout)(timer));
        restores.delete(restore);
        for (const group of groups) if (animations.get(group) === restore) animations.delete(group);
      }
      function apply(states) {
        tracks.forEach((track, i) => wearState(host, track.group, states[i]));
        host.CharacterRefresh(host.Player, false);
        tracks.forEach((track) => host.ChatRoomCharacterItemUpdate(host.Player, track.group));
      }
      function restore() {
        if (finished) return;
        cleanup();
        tracks.forEach((track, i) => {
          try {
            wearState(host, track.group, originals[i]);
          } catch (error) {
            report(error);
          }
        });
        host.CharacterRefresh(host.Player, false);
        tracks.forEach((track) => host.ChatRoomCharacterItemUpdate(host.Player, track.group));
      }
      function frame(states, last = false) {
        if (finished) return;
        try {
          apply(states);
          if (last) cleanup();
        } catch (error) {
          report(error);
          restore();
        }
      }
      restores.add(restore);
      groups.forEach((group) => animations.set(group, restore));
      for (let i = 0; i < step2.count; i++)
        timers.push(
          later(
            () => frame(tracks.map((track) => animationState(track, i % 2 ? "A" : "B"))),
            Math.round(i * (step2.intervalMs ?? step2.durationMs / step2.count))
          )
        );
      timers.push(
        later(
          () => frame(
            tracks.map((track) => track.stateA),
            true
          ),
          Math.round(step2.count * (step2.intervalMs ?? step2.durationMs / step2.count))
        )
      );
      if (step2.text.trim()) {
        const message = { type: step2.messageType, text: step2.text };
        const check = checkBCX(message, store.data.settings.bcx, host);
        if (check.allowed) textMessage(message, event);
        else report(check.reason);
      }
    }
    return {
      clear() {
        for (const restore of [...restores]) {
          try {
            restore();
          } catch (error) {
            report(error);
          }
        }
        activitySeen.clear();
      },
      execute(step2, event) {
        const check = checkBCX(step2, store.data.settings.bcx, host);
        if (!check.allowed) {
          report(check.reason);
          return;
        }
        if (["chat", "emote", "action"].includes(step2.type)) return textMessage(step2, event);
        if (step2.type === "expression") return expression(step2);
        if (step2.type === "animation") return animation(step2, event);
        if (step2.type === "activity") {
          const target = host.ChatRoomCharacter.find((c) => c.MemberNumber === event.actor);
          if (!target || event.event === "leave") return;
          const key = `${event.room}|${event.actor}|${step2.group}|${step2.activity}`;
          const time = Date.now();
          for (const [k, expires] of activitySeen) if (expires <= time) activitySeen.delete(k);
          if (activitySeen.has(key)) return;
          const activity = allowedActivity(target, step2.activity, step2.group, host);
          if (!activity) {
            report(`Unavailable activity: ${step2.activity}`);
            return;
          }
          activitySeen.set(key, time + 5e3);
          host.ActivityRun(
            host.Player,
            target,
            host.ActivityGetGroupOrMirror(host.Player.AssetFamily, step2.group),
            activity
          );
        }
      }
    };
  }
  var init_output = __esm({
    "src/features/output.js"() {
      init_model();
      init_catalog();
      init_bcx();
      init_appearance();
    }
  });

  // src/features/mouth.js
  function createMouth({ sdk, owns, host = globalThis }) {
    const animations = /* @__PURE__ */ new Map();
    const refresh = (c) => host.CharacterRefresh(c, false);
    function clear() {
      for (const { timer } of animations.values()) clearTimeout(timer);
      const chars = [...animations.values()].map((v) => v.character);
      animations.clear();
      chars.forEach(refresh);
    }
    sdk.hookFunction("CommonDrawAppearanceBuild", 0, (args, next) => {
      if (!owns("mouth")) return next(args);
      const state = animations.get(args[0]?.MemberNumber);
      if (!state) return next(args);
      const item = host.InventoryGet(args[0], "Mouth");
      if (!item) return next(args);
      const property = item.Property;
      const hadExpression = property && Object.hasOwn(property, "Expression");
      const previous = property?.Expression;
      item.Property ??= {};
      item.Property.Expression = state.value;
      try {
        return next(args);
      } finally {
        if (!property) delete item.Property;
        else if (!hadExpression) delete item.Property.Expression;
        else item.Property.Expression = previous;
      }
    });
    return {
      clear,
      receive(data, sender, message) {
        if (!owns("mouth") || data.Type !== "Chat" || data.Target != null || !sender || !message?.trim() || /^[\/!*(@.]|^https?:/i.test(message.trimStart()))
          return;
        const existing = animations.get(sender.MemberNumber);
        if (existing) clearTimeout(existing.timer);
        const frames = Array.from(message).slice(0, 40);
        let index = 0;
        const state = { character: sender, value: null, timer: null };
        animations.set(sender.MemberNumber, state);
        const run = () => {
          if (!owns("mouth") || host.CurrentScreen !== "ChatRoom" || !host.ChatRoomCharacter.includes(sender) || index >= frames.length) {
            animations.delete(sender.MemberNumber);
            refresh(sender);
            return;
          }
          const char = frames[index++];
          const value = /[\s,.!?，。！？]/.test(char) ? null : index % 2 ? "Open" : "HalfOpen";
          const item = host.InventoryGet(sender, "Mouth");
          state.value = !value || item?.Asset.Group.AllowExpression?.includes(value) ? value : null;
          refresh(sender);
          state.timer = setTimeout(run, value ? 160 : 280);
        };
        run();
      }
    };
  }
  var init_mouth = __esm({
    "src/features/mouth.js"() {
    }
  });

  // src/features/speech.js
  function petSpeech(text, phrases, severity, random = Math.random) {
    phrases = phrases.map((x) => x.trim()).filter(Boolean);
    if (!phrases.length || !text.trim() || /^[\/!*(@.]/.test(text.trimStart()) || /https?:\/\//i.test(text))
      return text;
    const chars = [...text], letters = chars.map((c, i) => /[\p{L}\p{N}]/u.test(c) ? i : -1).filter((i) => i >= 0);
    if (!letters.length) return text;
    const pick = () => phrases[Math.min(phrases.length - 1, Math.floor(random() * phrases.length))];
    const budget = Math.min(3, Math.max(1, Math.ceil(letters.length / 6)));
    const edits = /* @__PURE__ */ new Map();
    if (severity === "addicted") {
      const candidates = [...letters];
      const count2 = Math.min(letters.length, letters.length < 6 ? 1 : 1 + Math.floor(random() * 2));
      for (let i = 0; i < count2; i++) {
        const [at] = candidates.splice(Math.floor(random() * candidates.length), 1);
        chars[at] = pick();
      }
      if (letters.length < 6) return chars.join("");
    }
    const end = letters.at(-1) + 1;
    if (severity === "weak" || severity === "medium") edits.set(end, pick());
    const count = severity === "weak" ? 0 : severity === "medium" ? budget > 1 && random() < 0.5 ? 1 : 0 : budget;
    const positions = letters.slice(0, -1).map((i) => i + 1);
    if (!positions.length && !edits.size) edits.set(end, pick());
    for (let i = 0; i < count && positions.length; i++) {
      const [at] = positions.splice(Math.floor(random() * positions.length), 1);
      edits.set(at, pick());
    }
    return chars.map((c, i) => c + (edits.get(i + 1) ?? "")).join("");
  }
  function installSpeech({ sdk, store, enabled, host = globalThis, random = Math.random }) {
    sdk.hookFunction("ChatRoomSendChat", 9, (args, next) => {
      if (!enabled() || host.CurrentScreen !== "ChatRoom") return next(args);
      const original = host.ElementValue("InputChat");
      const channel = host.ChatRoomTargetMemberNumber >= 0 ? "whisper" : "chat";
      const rules = store.active.rules.filter(
        (r) => r.enabled && r.trigger.kind === "speech" && !r.trigger.matchNone && (r.trigger.channel === "all" || r.trigger.channel === channel)
      );
      const rule2 = rules[Math.floor(random() * rules.length)];
      if (!rule2 || random() * 100 >= rule2.trigger.chance) return next(args);
      const changed = petSpeech(
        original,
        rule2.choices.flatMap((c) => c.steps.filter((s) => s.type === "chat").map((s) => s.text)),
        rule2.trigger.severity,
        random
      );
      host.ElementValue("InputChat", changed);
      try {
        return next(args);
      } finally {
        if (host.ElementValue("InputChat") === changed) host.ElementValue("InputChat", original);
      }
    });
  }
  var init_speech = __esm({
    "src/features/speech.js"() {
    }
  });

  // src/integrations/events.js
  function installEvents({ sdk, submit, mouth, reset, host = globalThis }) {
    let syncing = 0, roomEpoch = 0;
    let leavingEvent;
    let sendingLeave = false;
    let lastRoomName = host.ChatRoomData?.Name ?? "";
    const roomName = () => host.ChatRoomData?.Name ?? lastRoomName;
    const roomKey = () => sendingLeave ? leavingEvent.room : `${roomName()}:${roomEpoch}`;
    const event = (kind, actorCharacter, fields = {}) => ({
      kind,
      room: roomKey(),
      roomName: roomName(),
      self: host.Player.MemberNumber,
      actor: actorCharacter?.MemberNumber,
      actorCharacter,
      actorArousal: actorCharacter?.ArousalSettings?.Progress ?? 0,
      selfArousal: host.Player.ArousalSettings?.Progress ?? 0,
      ...fields
    });
    const handler = {
      Description: "Responsive_Liko: reactions and speech",
      Priority: 320,
      Callback(data, sender, message, metadata) {
        try {
          mouth.receive(data, sender, message);
          if (host.CurrentScreen !== "ChatRoom" || host.Player.GhostList?.includes(sender?.MemberNumber))
            return false;
          if (data.Type === "Activity" && sender?.MemberNumber === host.Player.MemberNumber) {
            const key = data.Content;
            const outcome = /^Orgasm\d+$/.test(key) ? "Orgasmed" : /^OrgasmFailResist\d+$/.test(key) ? "Resisted" : /^OrgasmFail(?:Timeout|Surrender)\d+$/.test(key) ? "Ruined" : null;
            if (outcome) submit(event("orgasm", host.Player, { outcome }));
          }
          if (data.Type === "Activity" && metadata?.TargetCharacter?.MemberNumber === host.Player.MemberNumber && metadata.ActivityName && metadata.GroupName && sender) {
            submit(event("activity", sender, { activity: metadata.ActivityName, group: metadata.GroupName }));
          }
        } catch (e) {
          console.warn("Responsive_Liko event", e);
        }
        return false;
      }
    };
    host.ChatRoomRegisterMessageHandler(handler);
    sdk.hookFunction("ChatRoomSync", 0, (args, next) => {
      lastRoomName = args[0]?.Name ?? host.ChatRoomData?.Name ?? "";
      syncing++;
      roomEpoch++;
      reset();
      try {
        const result = next(args);
        const joined = () => {
          syncing--;
          if (host.CurrentScreen === "ChatRoom") submit(event("event", host.Player, { event: "join" }));
        };
        if (result?.then)
          return result.then(
            (value) => {
              joined();
              return value;
            },
            (error) => {
              syncing--;
              throw error;
            }
          );
        joined();
        return result;
      } catch (e) {
        syncing--;
        throw e;
      }
    });
    sdk.hookFunction("ChatRoomAddCharacterToChatRoom", 0, (args, next) => {
      const existed = host.ChatRoomCharacter.some((c2) => c2.MemberNumber === args[0]?.MemberNumber);
      const result = next(args);
      const c = host.ChatRoomCharacter.find((c2) => c2.MemberNumber === args[0]?.MemberNumber);
      if (!syncing && !existed && c && c.MemberNumber !== host.Player.MemberNumber && host.CurrentScreen === "ChatRoom")
        submit(event("event", c, { event: "visitor" }));
      return result;
    });
    if (typeof host.ChatRoomAttemptLeave === "function")
      sdk.hookFunction("ChatRoomAttemptLeave", 0, (args, next) => {
        if (host.CurrentScreen === "ChatRoom" && host.Player?.IsSlow?.() && !host.ChatRoomSlowtimer)
          submit(event("event", host.Player, { event: "slowLeave" }));
        return next(args);
      });
    if (typeof host.ChatRoomLeave === "function")
      sdk.hookFunction("ChatRoomLeave", 0, (args, next) => {
        if (host.CurrentScreen === "ChatRoom" && host.Player) {
          leavingEvent = event("event", host.Player, { event: "leave" });
        }
        try {
          return next(args);
        } finally {
          leavingEvent = void 0;
        }
      });
    if (typeof host.ServerSend === "function")
      sdk.hookFunction("ServerSend", 1, (args, next) => {
        if (args[0] === "ChatRoomLeave" && !sendingLeave) {
          const captured = leavingEvent;
          leavingEvent ??= host.CurrentScreen === "ChatRoom" && host.Player ? event("event", host.Player, { event: "leave" }) : void 0;
          if (leavingEvent) {
            sendingLeave = true;
            try {
              submit(leavingEvent);
            } catch (error) {
              console.warn("Responsive_Liko leave event", error);
            } finally {
              sendingLeave = false;
              leavingEvent = captured;
            }
          }
        }
        return next(args);
      });
    return { roomKey };
  }
  var init_events = __esm({
    "src/integrations/events.js"() {
    }
  });

  // src/ui/input-controls.js
  function bindClearableInputs(root, host, label) {
    root.querySelectorAll("input.rl-search, input.rl-input").forEach((input) => {
      if (input.readOnly || input.disabled || input.closest(".rl-clearable")) return;
      const wrapper = host.document.createElement("div");
      wrapper.className = `rl-clearable${input.classList.contains("rl-number") ? " rl-clearable-number" : ""}`;
      input.before(wrapper);
      wrapper.appendChild(input);
      const button = host.document.createElement("button");
      button.type = "button";
      button.className = "rl-input-clear";
      button.textContent = "\xD7";
      button.title = label;
      button.setAttribute("aria-label", label);
      button.onpointerdown = (event) => event.preventDefault();
      button.onclick = () => {
        input.value = "";
        input.focus();
        input.dispatchEvent(new host.Event("input", { bubbles: true }));
        input.dispatchEvent(new host.Event("change", { bubbles: true }));
      };
      wrapper.appendChild(button);
    });
  }
  var init_input_controls = __esm({
    "src/ui/input-controls.js"() {
    }
  });

  // src/ui/settings.css
  var settings_default;
  var init_settings = __esm({
    "src/ui/settings.css"() {
      settings_default = ".rl-chance-bar {\n  width: 100%;\n  height: 30px;\n  accent-color: #b23a56;\n  cursor: pointer;\n}\n.rl-response {\n  position: relative;\n  margin: 12px 0;\n  padding: 12px;\n  border: 2px solid transparent !important;\n  border-top-color: #f2e0e4 !important;\n  border-radius: 14px;\n}\n.rl-response.rl-primary-response {\n  border-color: #c08a3e !important;\n  background: #fff8e9;\n}\n.rl-response.rl-primary-pick {\n  cursor: pointer;\n  border-style: dashed !important;\n}\n.rl-primary-pick:hover {\n  border-color: #b23a56 !important;\n}\n.rl-crown {\n  position: absolute;\n  left: -13px;\n  top: -17px;\n  transform: rotate(-45deg);\n  color: #c08a3e;\n  pointer-events: none;\n  background: #fff8e9;\n  border-radius: 50%;\n  padding: 3px;\n}\n.rl-crown svg {\n  width: 28px !important;\n  height: 28px !important;\n}\n\n.rl-root * {\n  user-select: none;\n  -webkit-user-select: none;\n}\n.rl-root input,\n.rl-root textarea {\n  user-select: text;\n  -webkit-user-select: text;\n}\n.rl-exit img {\n  width: 72px;\n  height: 72px;\n  pointer-events: none;\n}\n.rl-box,\n.rl-rule-list {\n  cursor: grab;\n}\n.rl-box.rl-dragging,\n.rl-rule-list.rl-dragging {\n  cursor: grabbing;\n}\n.rl-root {\n  position: fixed;\n  width: 2000px;\n  height: 1000px;\n  transform-origin: top left;\n  z-index: 50;\n  font-family: Arial, 'Microsoft JhengHei', sans-serif;\n  color: #3a2430;\n  overflow: hidden;\n  --soft: #8a6b74;\n  --line: #e9cdd4;\n  --card: #fffafb;\n  --paper: #fdf3f5;\n  --rose: #b23a56;\n  --deep: #8c2540;\n  --light: #f7dee4;\n  --lighter: #fcf0f3;\n  --gold: #c08a3e;\n  --danger: #c0392b;\n}\n.rl-root * {\n  box-sizing: border-box;\n}\n.rl-root button,\n.rl-root input,\n.rl-root select,\n.rl-root textarea {\n  font: inherit;\n  color: inherit;\n}\n.rl-root button {\n  border: 2px solid var(--line);\n  background: var(--card);\n  height: 54px;\n  padding: 0 20px;\n  border-radius: 28px;\n  cursor: pointer;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  font-size: 21px;\n}\n.rl-root button:hover {\n  border-color: var(--rose);\n  color: var(--deep);\n}\n.rl-root button.primary {\n  color: white;\n  border-color: transparent;\n  background: linear-gradient(135deg, var(--rose), var(--deep));\n}\n.rl-root button.danger {\n  color: var(--danger);\n  border-color: #e4aaa4;\n  background: #f6dcd9;\n}\n.rl-root svg {\n  width: 26px;\n  height: 26px;\n}\n.rl-screen {\n  width: 100%;\n  height: 100%;\n  background:\n    radial-gradient(1100px 480px at 92% -10%, #fceef1 0, transparent 62%),\n    linear-gradient(160deg, #fdf2f5, #f3dee6);\n  border: 2px solid var(--line);\n}\n.rl-top {\n  height: 120px;\n  display: flex;\n  align-items: center;\n  padding: 0 180px;\n  border-bottom: 2px solid #f2e0e4;\n}\n.rl-top-rules {\n  padding-left: 65px;\n}\n.rl-brand {\n  display: flex;\n  align-items: center;\n  gap: 20px;\n  font:\n    italic 600 42px Georgia,\n    serif;\n}\n\n.rl-icon {\n  width: 43px !important;\n  height: 43px !important;\n  padding: 7px !important;\n  border: 0 !important;\n  background: transparent !important;\n}\n.rl-exit {\n  position: absolute !important;\n  left: 1815px;\n  top: 75px;\n  width: 90px !important;\n  height: 90px !important;\n  padding: 0 !important;\n  border-radius: 12px !important;\n  transform: translateY(-50%);\n  background: white !important;\n}\n.rl-main {\n  height: 880px;\n  padding: 20px 180px 38px;\n  display: grid;\n  grid-template-columns: 520px 1fr;\n  gap: 28px;\n}\n.rl-work {\n  height: 880px;\n  padding: 18px 65px 35px;\n  display: grid;\n  grid-template-columns: 470px 1fr;\n  gap: 24px;\n}\n.rl-panel {\n  background: var(--paper);\n  border: 2px solid var(--line);\n  border-radius: 23px;\n  padding: 26px;\n  overflow: auto;\n}\n.rl-head {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin-bottom: 16px;\n}\n.rl-head h2 {\n  font-size: 31px;\n  margin: 0;\n}\n.rl-grow {\n  flex: 1;\n  min-width: 0;\n}\n.rl-muted {\n  font-size: 18px;\n  color: var(--soft);\n}\n.rl-setting {\n  height: 100px;\n  display: flex;\n  align-items: center;\n  border-bottom: 2px solid #f2e0e4;\n  font-size: 25px;\n}\n.rl-switch {\n  width: 86px !important;\n  height: 46px !important;\n  padding: 5px !important;\n  border: 0 !important;\n  background: #cbbdc1 !important;\n  justify-content: flex-start !important;\n}\n.rl-switch:before {\n  content: '';\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  background: white;\n  box-shadow: 0 2px 5px #0004;\n}\n.rl-switch.on {\n  background: linear-gradient(135deg, var(--rose), var(--deep)) !important;\n  justify-content: flex-end !important;\n}\n.rl-small-switch {\n  width: 58px !important;\n  height: 31px !important;\n  padding: 4px !important;\n}\n.rl-small-switch:before {\n  width: 23px;\n  height: 23px;\n}\n.rl-tools {\n  display: flex;\n  gap: 9px;\n  flex-wrap: wrap;\n}\n.rl-tools button {\n  height: 46px;\n  font-size: 18px;\n  padding: 0 15px;\n}\n.rl-personas {\n  display: flex;\n  flex-direction: column;\n  gap: 14px;\n}\n.rl-card-wrap {\n  position: relative;\n  padding-right: 87px;\n}\n.rl-card {\n  position: relative;\n  height: 140px;\n  background: white;\n  border: 2px solid var(--line);\n  border-radius: 21px;\n  padding: 18px 23px;\n  display: flex;\n  align-items: center;\n  gap: 20px;\n}\n.rl-card,\n.rl-rule,\n.rl-response {\n  --hover-glow: #b23a5640;\n  transition: box-shadow 160ms ease;\n}\n.rl-card.active,\n.rl-response.rl-primary-response {\n  --hover-glow: #c08a3e66;\n}\n.rl-card-wrap:hover > .rl-card,\n.rl-rule:hover,\n.rl-response:hover {\n  box-shadow:\n    inset 0 0 16px var(--hover-glow),\n    0 0 9px var(--hover-glow);\n}\n@media (prefers-reduced-motion: reduce) {\n  .rl-card,\n  .rl-rule,\n  .rl-response {\n    transition: none;\n  }\n}\n.rl-transfer-field {\n  position: relative;\n}\n.rl-transfer-field .rl-textarea {\n  padding-bottom: 65px;\n}\n.rl-transfer-tools {\n  position: absolute;\n  right: 12px;\n  bottom: 12px;\n  align-items: center;\n  flex-direction: row-reverse;\n}\n.rl-card.active {\n  border-color: var(--gold);\n  background: linear-gradient(90deg, var(--lighter), white 60%);\n}\n.rl-card.delete {\n  margin-left: 20px;\n}\n.rl-card-name {\n  width: 220px;\n}\n\n.rl-meter {\n  flex: 1;\n}\n.rl-track {\n  height: 10px;\n  border-radius: 8px;\n  background: #f2e0e4;\n  overflow: hidden;\n  margin-bottom: 9px;\n}\n.rl-fill {\n  height: 100%;\n  background: linear-gradient(90deg, var(--rose), var(--gold));\n}\n.rl-count {\n  font-size: 21px;\n}\n.rl-count b {\n  font-size: 29px;\n  color: var(--deep);\n}\n.rl-card-side {\n  position: absolute;\n  right: 3px;\n  top: 35px;\n  width: 70px !important;\n  height: 70px !important;\n  padding: 0 !important;\n}\n.rl-browser {\n  padding: 24px;\n}\n.rl-search,\n.rl-input,\n.rl-select,\n.rl-textarea {\n  width: 100%;\n  border: 2px solid var(--line);\n  border-radius: 12px;\n  background: white;\n  padding: 0 15px;\n  font-size: 20px;\n}\n.rl-search,\n.rl-input,\n.rl-select {\n  height: 52px;\n}\n.rl-textarea {\n  height: 220px;\n  padding: 14px;\n  resize: none;\n}\n.rl-cats {\n  display: flex;\n  gap: 7px;\n  margin: 13px 0;\n}\n.rl-cats button {\n  height: 41px;\n  flex: 1;\n  padding: 0;\n  font-size: 17px;\n}\n.rl-cats .on,\n.rl-rule.active {\n  background: var(--lighter);\n  border-color: var(--rose);\n}\n.rl-rule {\n  height: 81px;\n  border: 2px solid var(--line);\n  border-radius: 13px;\n  margin-bottom: 9px;\n  display: flex;\n  align-items: center;\n  padding: 8px 9px 8px 14px;\n  background: white;\n}\n.rl-rule-main {\n  height: 61px !important;\n  border: 0 !important;\n  background: transparent !important;\n  border-radius: 8px !important;\n  justify-content: flex-start !important;\n  text-align: left;\n  padding: 0 !important;\n}\n.rl-rule-main b {\n  font-size: 20px;\n}\n.rl-rule-main small {\n  display: block;\n  color: var(--soft);\n  margin-top: 4px;\n}\n.rl-editor {\n  padding: 23px;\n}\n.rl-editor-grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 19px;\n}\n.rl-box {\n  background: white;\n  border: 2px solid var(--line);\n  border-radius: 17px;\n  padding: 22px;\n  height: 650px;\n  overflow: auto;\n}\n.rl-box h3 {\n  font-size: 24px;\n  color: var(--deep);\n  margin: 0 0 18px;\n}\n.rl-field {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  margin: 15px 0;\n  font-size: 20px;\n}\n.rl-field > span {\n  min-width: 80px;\n}\n.rl-summary {\n  border: 2px dashed var(--line);\n  border-radius: 13px;\n  padding: 18px;\n  margin-top: 18px;\n  color: var(--soft);\n  font-size: 19px;\n}\n.rl-response-head {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n}\n.rl-response-head button {\n  height: 41px;\n  font-size: 17px;\n  padding: 0 13px;\n}\n.rl-response {\n  min-height: 80px;\n  display: grid;\n  grid-template-columns: 100px 1fr 92px;\n  gap: 9px;\n  align-items: center;\n  border-top: 2px solid #f2e0e4;\n  font-size: 19px;\n}\n.rl-response b {\n  color: var(--deep);\n}\n.rl-response button {\n  height: 40px;\n  font-size: 17px;\n  padding: 0 12px;\n}\n.rl-overlay {\n  position: absolute;\n  inset: 0;\n  background: #46203299;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 52px 105px;\n  backdrop-filter: blur(2px);\n  z-index: 9;\n}\n.rl-dialog {\n  width: 100%;\n  height: 100%;\n  background: var(--card);\n  border: 2px solid var(--line);\n  border-radius: 25px;\n  padding: 27px;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 20px 60px #40152655;\n}\n.rl-dialog.compact {\n  width: 900px;\n  height: auto;\n  min-height: 420px;\n}\n.rl-dialog-head {\n  height: 68px;\n  display: flex;\n  align-items: center;\n  gap: 16px;\n}\n.rl-dialog-head h2 {\n  font-size: 30px;\n  margin: 0;\n}\n.rl-dialog-body {\n  flex: 1;\n  min-height: 0;\n}\n.rl-dialog-foot {\n  height: 75px;\n  display: flex;\n  align-items: flex-end;\n  gap: 11px;\n}\n.rl-picker-body {\n  display: grid;\n  grid-template-columns: 400px 1fr;\n  gap: 22px;\n}\n.rl-body-map {\n  position: relative;\n  background: var(--lighter);\n  border: 2px solid var(--line);\n  border-radius: 17px;\n  overflow: hidden;\n}\n.rl-zone {\n  position: absolute;\n  border: 2px solid #b23a5688;\n  background: #bdeeee88;\n  padding: 0 !important;\n  border-radius: 7px !important;\n  min-width: 4px !important;\n  min-height: 4px !important;\n  height: auto;\n}\n.rl-zone.selected {\n  background: #f4e4c4aa !important;\n  border-color: var(--gold) !important;\n}\n.rl-actions-wrap {\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n.rl-actions-title {\n  font-size: 23px;\n  margin: 4px 0 13px;\n}\n.rl-actions {\n  min-height: 0;\n  overflow-y: auto;\n  display: grid;\n  grid-template-columns: repeat(4, minmax(0, 1fr));\n  gap: 12px;\n  align-content: start;\n  padding: 3px 11px 3px 3px;\n  scrollbar-color: var(--rose) #f2e0e4;\n}\n.rl-root .rl-action {\n  height: 80px !important;\n  border-radius: 14px !important;\n  display: block;\n  text-align: left;\n  padding: 11px 14px !important;\n  overflow: hidden;\n}\n.rl-action strong,\n.rl-action small {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.rl-action strong {\n  font-size: 19px;\n}\n.rl-action small {\n  color: var(--soft);\n  font-size: 14px;\n  margin-top: 4px;\n}\n.rl-action.on {\n  background: var(--light);\n  border-color: var(--rose);\n}\n.rl-choice-row {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.rl-choice-row button.on {\n  background: var(--light);\n  border-color: var(--rose);\n}\n.rl-segments {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 12px 0;\n}\n.rl-segments button {\n  height: 45px;\n  font-size: 18px;\n  padding: 0 17px;\n}\n.rl-segments button.on {\n  background: var(--light);\n  border-color: var(--rose);\n  color: var(--deep);\n}\n\n.rl-root .rl-search,\n.rl-root .rl-input,\n.rl-root .rl-select,\n.rl-root .rl-textarea {\n  appearance: none !important;\n  -webkit-appearance: none !important;\n  background: #fff !important;\n  background-color: #fff !important;\n  color: #3a2430 !important;\n  -webkit-text-fill-color: #3a2430 !important;\n  border: 2px solid var(--line) !important;\n  box-shadow: none !important;\n  filter: none !important;\n  opacity: 1 !important;\n}\n.rl-root .rl-search::placeholder,\n.rl-root .rl-input::placeholder,\n.rl-root .rl-textarea::placeholder {\n  color: #a58b93 !important;\n  -webkit-text-fill-color: #a58b93 !important;\n  opacity: 1 !important;\n}\n.rl-box {\n  height: 700px;\n}\n.rl-number {\n  width: 100px !important;\n  flex: none !important;\n}\n.rl-cats,\n.rl-segments {\n  border-bottom: 1px solid var(--line);\n  gap: 5px;\n  padding: 0 8px 7px;\n}\n.rl-cats button,\n.rl-segments button {\n  position: relative;\n  border-color: transparent !important;\n  border-radius: 0 !important;\n  background: transparent !important;\n  box-shadow: none !important;\n  color: var(--soft);\n  transition:\n    color 0.18s,\n    transform 0.18s;\n}\n.rl-cats button:after,\n.rl-segments button:after {\n  content: '';\n  position: absolute;\n  left: 50%;\n  right: 50%;\n  bottom: -1px;\n  height: 3px;\n  background: var(--rose);\n  transition:\n    left 0.22s,\n    right 0.22s,\n    box-shadow 0.22s;\n}\n.rl-cats button:hover,\n.rl-segments button:hover {\n  color: var(--rose);\n  transform: translateY(-1px);\n}\n.rl-cats button.on,\n.rl-segments button.on {\n  color: var(--rose) !important;\n}\n.rl-cats button.on:after,\n.rl-segments button.on:after {\n  left: 8px;\n  right: 8px;\n  box-shadow: 0 0 8px var(--rose);\n}\n.rl-picker-head {\n  display: grid;\n  grid-template-columns: 400px 1fr;\n  gap: 22px;\n  height: 72px;\n  align-items: center;\n}\n.rl-picker-head h2 {\n  text-align: center;\n  font-size: 30px;\n  margin: 0;\n}\n.rl-picker-controls {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n}\n.rl-action-search {\n  position: relative;\n  width: 500px;\n  flex: none;\n}\n.rl-action-search .rl-input {\n  width: 500px !important;\n  padding-right: 48px !important;\n}\n\n.rl-picker-controls > button {\n  height: 48px;\n  font-size: 18px;\n  padding: 0 14px;\n}\n.rl-notice {\n  position: absolute;\n  left: 50%;\n  bottom: 28px;\n  transform: translateX(-50%);\n  padding: 13px 28px;\n  border-radius: 24px;\n  background: #3a2430;\n  color: #fff;\n  font-size: 20px;\n  z-index: 12;\n  box-shadow: 0 8px 24px #0004;\n}\n.rl-browser {\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n}\n.rl-rule-list {\n  flex: 1;\n  min-height: 0;\n  overflow-y: auto;\n  padding-right: 8px;\n}\n.rl-root * {\n  scrollbar-width: thin;\n  scrollbar-color: var(--rose) var(--light);\n}\n.rl-root *::-webkit-scrollbar {\n  width: 12px;\n  height: 12px;\n}\n.rl-root *::-webkit-scrollbar-track {\n  background: var(--light);\n  border-radius: 8px;\n}\n.rl-root *::-webkit-scrollbar-thumb {\n  background: var(--rose);\n  border: 3px solid var(--light);\n  border-radius: 8px;\n}\n.rl-root *::-webkit-scrollbar-thumb:hover {\n  background: var(--deep);\n}\n.rl-picker-scope {\n  width: 180px !important;\n  flex: none;\n}\n.rl-dialog.compact,\n.srl-dialog.compact {\n  width: 980px;\n  min-height: 470px;\n  font-size: 22px;\n}\n.rl-dialog.compact .rl-dialog-head h2,\n.srl-dialog.compact .rl-dialog-head h2 {\n  font-size: 34px;\n}\n.rl-dialog.compact p,\n.srl-dialog.compact p {\n  font-size: 22px;\n  line-height: 1.6;\n}\n.rl-settings-group {\n  background: #fff;\n  border: 2px solid var(--line);\n  border-radius: 15px;\n  padding: 18px;\n  margin: 14px 0;\n}\n.rl-settings-group h3 {\n  font-size: 23px;\n  margin: 0 0 8px;\n}\n.rl-relation-buttons {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  margin: 10px 0;\n}\n.rl-relation-buttons button {\n  height: 39px;\n  padding: 0 14px;\n  font-size: 17px;\n}\n.rl-list-entry {\n  display: flex;\n  gap: 8px;\n}\n.rl-list-entry .rl-input {\n  flex: 1;\n}\n.rl-list-entry button {\n  width: 55px;\n  height: 52px;\n  padding: 0;\n}\n.rl-rule-trash {\n  width: 48px !important;\n  height: 48px !important;\n  padding: 9px !important;\n  margin-right: 8px;\n}\n.rl-rule.delete-active {\n  padding-left: 5px;\n}\n.rl-animation-grid {\n  display: grid;\n  grid-template-columns: 180px 1fr;\n  gap: 12px 15px;\n  align-items: center;\n}\n.rl-animation-grid .rl-number {\n  width: 160px !important;\n}\n.rl-animation-message {\n  margin-top: 16px;\n}\n.rl-animation-tracks {\n  max-height: 350px;\n  overflow: auto;\n}\n.rl-dialog.compact {\n  max-height: 95%;\n  overflow: auto;\n}\n.rl-response-head {\n  flex-wrap: wrap;\n}\n.rl-response-head h3 {\n  flex-basis: 100%;\n}\n.rl-response > b > button {\n  padding: 0 4px;\n  font-size: 23px;\n}\n.rl-response > b {\n  font-size: 16px;\n}\n.rl-dialog.compact .rl-dialog-body {\n  overflow-y: auto;\n  flex: 1 1 auto;\n  padding-right: 8px;\n}\n.rl-dialog.compact .rl-dialog-head,\n.rl-dialog.compact .rl-dialog-foot {\n  flex-shrink: 0;\n}\n.rl-dialog.compact .rl-dialog-foot {\n  height: 65px;\n}\n.rl-animation-tracks .rl-field > button {\n  white-space: nowrap;\n  flex-shrink: 0;\n}\n.rl-animation-tracks .rl-field > span {\n  min-width: 90px;\n}\n.rl-dialog.compact.rl-animation-dialog {\n  width: 1500px;\n}\n.rl-animation-dialog .rl-animation-tracks {\n  display: flex;\n  flex-direction: row;\n  gap: 18px;\n  overflow: auto;\n  max-height: 380px;\n  cursor: grab;\n  padding: 4px 3px 12px;\n  touch-action: none;\n}\n.rl-animation-dialog .rl-animation-track {\n  flex: 0 0 450px;\n  min-width: 450px;\n}\n.rl-animation-track .rl-field {\n  flex-wrap: wrap;\n}\n.rl-animation-track .rl-field > span {\n  flex-basis: 100%;\n}\n.rl-animation-track .rl-field > .rl-select {\n  width: 240px;\n  flex: 1;\n}\n.rl-animation-dialog .rl-dialog-body {\n  cursor: grab;\n}\n.rl-animation-dialog .rl-dragging {\n  cursor: grabbing;\n}\n.rl-animation-dialog .rl-animation-tracks {\n  justify-content: space-between;\n}\n.rl-animation-dialog .rl-animation-track:only-child {\n  margin-left: auto;\n  margin-right: auto;\n}\n.rl-response-gap {\n  width: 22px;\n  flex: none;\n}\n.rl-response-head .rl-response-delete {\n  margin-left: auto;\n}\n\n.rl-root .rl-action[hidden] {\n  display: none;\n}\n\n.rl-editable-name {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  min-width: 0;\n  max-width: 620px;\n  color: rgb(58, 36, 48);\n  font-family: Arial, 'Microsoft JhengHei', sans-serif;\n  font-style: normal;\n  font-weight: 600;\n  line-height: 1.3;\n}\n.rl-inline-title {\n  font-size: 31px;\n}\n.rl-context {\n  font-size: 42px;\n}\n.rl-context::before {\n  content: '\u2726';\n  flex: none;\n  margin-right: 8px;\n}\n.rl-name-row {\n  font-size: 24px;\n}\n.rl-brand-icon {\n  width: 58px;\n  height: 58px;\n  flex: none;\n  object-fit: contain;\n}\n.rl-name-text {\n  min-width: 0;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n.rl-editable-name > .rl-icon {\n  flex: none;\n}\n.rl-root .rl-inline-input {\n  box-sizing: border-box;\n  width: auto;\n  min-width: 0;\n  max-width: 100%;\n  height: 48px;\n  padding: 0 10px;\n  border: 2px solid var(--rose);\n  border-radius: 10px;\n  background: white;\n  color: inherit;\n  font: inherit;\n}\n.rl-clearable {\n  position: relative;\n  width: 100%;\n  min-width: 0;\n}\n.rl-clearable-number {\n  width: 100px;\n}\n.rl-root .rl-clearable > input {\n  padding-right: 40px;\n}\n.rl-root .rl-clearable > .rl-input-clear {\n  position: absolute;\n  right: 4px;\n  top: 50%;\n  transform: translateY(-50%);\n  width: 32px;\n  height: 36px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  border-radius: 8px;\n  font-size: 24px;\n}\n.rl-list-entry > .rl-clearable {\n  flex: 1;\n}\n";
    }
  });

  // src/integrations/action-variants.json
  var action_variants_default;
  var init_action_variants = __esm({
    "src/integrations/action-variants.json"() {
      action_variants_default = {
        \u5167: "\u5185",
        \u52D5: "\u52A8",
        \u5674: "\u55B7",
        \u58D3: "\u538B",
        \u5C07: "\u5C06",
        \u5E36: "\u5E26",
        \u5E79: "\u5E72",
        \u5F37: "\u5F3A",
        \u5F48: "\u5F39",
        \u6493: "\u6320",
        \u64A5: "\u62E8",
        \u64AB: "\u629A",
        \u64CA: "\u51FB",
        \u64D4: "\u62C5",
        \u69CD: "\u67AA",
        \u6E96: "\u51C6",
        \u6EFE: "\u6EDA",
        \u6F51: "\u6CFC",
        \u7051: "\u6D12",
        \u71B1: "\u70ED",
        \u727D: "\u7275",
        \u74B0: "\u73AF",
        \u756B: "\u753B",
        \u7662: "\u75D2",
        \u7D81: "\u7ED1",
        \u7DB2: "\u7F51",
        \u7DCA: "\u7D27",
        \u7DE9: "\u7F13",
        \u7E5E: "\u7ED5",
        \u7E69: "\u7EF3",
        \u7E8F: "\u7F20",
        \u805E: "\u95FB",
        \u8123: "\u5507",
        \u812B: "\u8131",
        \u8166: "\u8111",
        \u8173: "\u811A",
        \u81C9: "\u8138",
        \u8396: "\u830E",
        \u8457: "\u7740",
        \u84CB: "\u76D6",
        \u8655: "\u5904",
        \u8932: "\u88E4",
        \u8960: "\u88C6",
        \u896A: "\u889C",
        \u89AA: "\u4EB2",
        \u89F8: "\u89E6",
        \u8A9E: "\u8BED",
        \u8B77: "\u62A4",
        \u8C93: "\u732B",
        \u8C9E: "\u8D1E",
        \u8E2B: "\u78B0",
        \u8EC0: "\u8EAF",
        \u8F15: "\u8F7B",
        \u9032: "\u8FDB",
        \u908A: "\u8FB9",
        \u9234: "\u94C3",
        \u943A: "\u94DB",
        \u958B: "\u5F00",
        \u9593: "\u95F4",
        \u9670: "\u9634",
        \u96FB: "\u7535",
        \u9805: "\u9879",
        \u9806: "\u987A",
        \u982D: "\u5934",
        \u9830: "\u988A",
        \u9838: "\u9888",
        \u984D: "\u989D",
        \u98A8: "\u98CE",
        \u9AD4: "\u4F53",
        \u9AEE: "\u53D1",
        \u9B06: "\u677E",
        \u9B5A: "\u9C7C",
        \u9BCA: "\u9CA8",
        \u9EDE: "\u70B9"
      };
    }
  });

  // src/integrations/search.js
  function matchNormalized(text, query) {
    if (!query || text.includes(query)) return true;
    let cursor = 0;
    for (const char of text) if (char === query[cursor]) cursor++;
    return cursor === query.length;
  }
  async function createActivitySearchAsync(rows, cancelled = () => false) {
    const indexed = [];
    let deadline = performance.now() + 4;
    for (const row of rows) {
      if (cancelled()) return null;
      indexed.push({
        row,
        texts: [...new Set([row.label, row.name, ...row.searchLabels ?? []].map(normalizeSearch))]
      });
      if (performance.now() >= deadline) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        deadline = performance.now() + 4;
      }
    }
    return searchIndex(rows, indexed);
  }
  function searchIndex(rows, indexed) {
    return (query) => {
      const normalized = normalizeSearch(query);
      return normalized ? indexed.filter((entry) => entry.texts.some((text) => matchNormalized(text, normalized))).map((entry) => entry.row) : rows;
    };
  }
  var fold, normalizeSearch;
  var init_search = __esm({
    "src/integrations/search.js"() {
      init_action_variants();
      fold = new Map(Object.entries(action_variants_default));
      normalizeSearch = (text) => [...String(text).normalize("NFKC").toLocaleLowerCase()].map((c) => fold.get(c) ?? c).join("").replace(/[\s_:：·'"()（）-]|\[|\]/g, "");
    }
  });

  // src/ui/activity-picker.js
  function createActivityPicker({
    host,
    load = activityOptionsAsync,
    index = createActivitySearchAsync
  }) {
    let generation = 0;
    let session, language, scope, search;
    const cache = /* @__PURE__ */ new Map();
    function reset() {
      generation++;
      session = language = scope = search = void 0;
      cache.clear();
    }
    function select(nextSession, nextScope, changed, failed) {
      if (session !== nextSession || language !== host.TranslationLanguage) {
        reset();
        session = nextSession;
        language = host.TranslationLanguage;
      }
      if (scope === nextScope) return;
      scope = nextScope;
      const token = ++generation;
      search = cache.get(scope);
      if (search) return;
      const cancelled = () => token !== generation;
      load(host, cancelled, scope === "all" ? null : scope).then(async (rows) => {
        if (!rows || cancelled()) return;
        const prepared = await index(rows, cancelled);
        if (!prepared || cancelled()) return;
        cache.set(nextScope, prepared);
        search = prepared;
        changed();
      }).catch((error) => {
        if (!cancelled()) failed(error);
      });
    }
    return {
      select,
      reset,
      get search() {
        return search;
      }
    };
  }
  var init_activity_picker = __esm({
    "src/ui/activity-picker.js"() {
      init_catalog();
      init_search();
    }
  });

  // src/core/import.js
  function decode(text, lz) {
    if (typeof text !== "string" || !text.trim() || text.length > 1e6)
      throw new Error("Invalid import size");
    try {
      return JSON.parse(text);
    } catch {
    }
    const decoded = lz?.decompressFromBase64(text.trim());
    if (!decoded || decoded.length > 4e6) throw new Error("Invalid import data");
    return JSON.parse(decoded);
  }
  function step(message) {
    if (!object(message) || !["message", "action"].includes(message.type) || typeof message.content !== "string")
      throw new Error("Invalid legacy message");
    return { type: message.type === "action" ? "action" : "chat", text: message.content };
  }
  function importPersonas(text, lz = globalThis.LZString) {
    const raw = decode(text, lz);
    const warnings = [];
    let format;
    let list;
    if (raw?.format === "Responsive_Liko" && raw.schemaVersion === 1) {
      list = raw.personas;
      format = "Responsive_Liko";
    } else if (object(raw) && Array.isArray(raw.rules)) {
      list = [raw];
      format = "Responsive_Liko";
    } else if (object(raw) && (Array.isArray(raw.responses) || Array.isArray(raw.personalities))) {
      format = "BCResponsive";
      list = (raw.personalities ?? [raw]).filter(Boolean).map((old) => {
        const p = persona(old.name);
        p.blackList = old.blackList ?? [];
        if (!old.blackList) warnings.push("legacyBlacklist");
        p.rules = old.responses.map((item) => {
          if (!object(item) || !object(item.trigger) || !Array.isArray(item.messages))
            throw new Error("Invalid legacy rule");
          const t = item.trigger;
          const r = rule();
          r.name = item.name;
          r.enabled = item.enabled ?? true;
          r.trigger = { kind: t.mode, members: t.allow_ids ?? [] };
          if (t.mode === "activity")
            Object.assign(r.trigger, {
              activities: t.allow_activities ?? [],
              groups: t.allow_bodyparts ?? [],
              self: true,
              matchNone: t.allow_activities?.length === 0 || t.allow_bodyparts?.length === 0
            });
          if (t.mode === "orgasm") r.trigger.outcome = t.type ?? "Orgasmed";
          if (t.mode === "event") {
            r.trigger.event = t.event?.toLowerCase();
            r.delayMs = t.event === "Join" ? 5e3 : 0;
          }
          if (t.mode === "spicer") {
            Object.assign(r.trigger, { min: t.min_arousal, max: t.max_arousal });
            if (t.apply_favorite) {
              r.legacy = { apply_favorite: true };
              warnings.push("legacyFavorite");
            }
          }
          r.choices = item.messages.map((m) => ({ id: uid(), steps: [step(m)] }));
          return r;
        });
        return p;
      });
    } else if (object(raw) && (raw.ResponsesModule || raw.data?.ResponsesModule || Array.isArray(raw.mainResponses))) {
      format = "Responsive-main";
      const data = raw.data ?? raw;
      const source = data.ResponsesModule ?? data;
      const p = persona(raw.name || "Responsive");
      const makeSteps = (text2) => {
        if (typeof text2 !== "string") throw new Error("Invalid response");
        const trimmed = text2.trim();
        if (trimmed.startsWith("@@")) return [{ type: "action", text: "{me} " + trimmed.slice(2) }];
        if (trimmed.startsWith("@")) return [{ type: "action", text: trimmed.slice(1) }];
        if (trimmed.startsWith("*")) return [{ type: "emote", text: trimmed.replace(/^\*{1,2}/, "") }];
        return [{ type: "chat", text: text2 }];
      };
      p.rules = (source.mainResponses ?? []).map((old) => {
        const r = rule();
        r.name = old.actName;
        r.trigger = {
          kind: "activity",
          activities: [old.actName],
          groups: old.groupName,
          members: [],
          self: old.selfTrigger ?? false
        };
        r.choices = old.responses.map((s) => ({ id: uid(), steps: makeSteps(s) }));
        return r;
      });
      for (const [key, messages] of Object.entries(source.extraResponses ?? {})) {
        const r = rule();
        r.name = key;
        r.trigger = key === "orgasm" ? { kind: "orgasm", outcome: "Orgasmed" } : { kind: "spicer" };
        if (key !== "orgasm") {
          r.enabled = false;
          warnings.push("legacyUnusedExtras");
        }
        r.choices = messages.map((s) => ({ id: uid(), steps: makeSteps(s) }));
        p.rules.push(r);
      }
      if (data.GlobalModule) warnings.push("legacyGlobal");
      list = [p];
    } else throw new Error("Unknown import format");
    if (!Array.isArray(list) || !list.length) throw new Error("No personas in import");
    const personas = list.map((p) => {
      const copy = validatePersona(p);
      copy.id = uid();
      copy.rules.forEach((r) => {
        r.id = uid();
      });
      return copy;
    });
    return { format, personas, warnings: [...new Set(warnings)] };
  }
  function exportPersona(p, lz = globalThis.LZString) {
    if (!lz?.compressToBase64) throw new Error("Base64 compressor unavailable");
    return lz.compressToBase64(
      JSON.stringify({ format: "Responsive_Liko", schemaVersion: 1, personas: [clone(p)] })
    );
  }
  var init_import = __esm({
    "src/core/import.js"() {
      init_model();
    }
  });

  // assets/preference-icon.svg
  var preference_icon_default;
  var init_preference_icon = __esm({
    "assets/preference-icon.svg"() {
      preference_icon_default = 'data:image/svg+xml,<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100" height="100">%0A%09<style>%0A%09%09.s0 { opacity: .96;fill: %23000000 } %0A%09</style>%0A%09<path id="Path 0" fill-rule="evenodd" class="s0" d="m238.5 13.28c-2.75 1.29-6.99 4.12-9.41 6.28-2.43 2.17-5.87 6.19-7.64 8.94-1.77 2.75-6.08 8.12-9.58 11.93l-6.37 6.92v13.5c-6.59 4.77-9.42 7.61-10.55 9.4-1.44 2.28-1.95 4.45-1.69 7.25 0.21 2.26 1.54 5.63 3.05 7.75 2.25 3.14 2.49 4.03 1.44 5.44-1.07 1.44-1 1.59 0.5 1 1.19-0.47 1.75-0.21 1.75 0.81 0 0.83-1.24 2.88-2.75 4.56-1.51 1.69-4.21 3.49-6 4-1.79 0.52-3.7 1.84-4.25 2.94-0.55 1.1-1 2.67-1 3.5 0 0.83-1.35 2.85-3 4.5-2.61 2.61-3 3.72-3 8.5 0 4.95 0.35 5.85 3.5 9 2.98 2.98 3.35 3.84 2.5 5.75-0.56 1.24-2.13 2.81-3.5 3.5-1.38 0.69-3.18 1.25-4 1.25-0.82 0-1.66-0.56-1.86-1.25-0.2-0.69-0.65-0.91-1-0.5-0.35 0.41-0.08 1.33 0.61 2.03 0.69 0.7 1.93 1.54 2.75 1.86 1.24 0.49 1.12 1-0.73 2.97-1.47 1.58-2.24 3.66-2.25 6.14-0.01 2.06 0.43 4.65 0.98 5.75 0.55 1.1 1.9 2 3 2 1.59 0 2 0.67 2.01 3.25 0 1.79-0.79 4.32-1.75 5.63-1.28 1.73-2.5 2.27-4.5 2-1.53-0.21-2.6 0.06-2.42 0.62 0.17 0.55 1.18 1.13 2.24 1.29 1.61 0.24 1.89 1.03 1.73 5-0.11 2.59 0.03 3.81 0.3 2.71 0.28-1.1 1.04-3.26 1.7-4.79 0.65-1.53 1.53-2.77 1.94-2.75 0.41 0.02 0.97 1.05 1.24 2.29 0.26 1.24 0.49 4.72 0.5 7.75 0.01 3.03-0.68 14.72-1.54 26-0.85 11.28-2.21 24.44-3 29.25-0.8 4.81-1.45 10.66-1.44 13 0.01 2.48 1.09 6.55 2.6 9.75 1.43 3.02 5.24 8.2 8.47 11.5 3.22 3.3 5.87 6.45 5.89 7 0.01 0.55-1.07 2.35-2.4 4-1.59 1.97-2.75 2.66-3.38 2-0.52-0.55-5.77-6.62-11.65-13.5-5.89-6.87-14.61-16.5-19.37-21.39-4.77-4.89-11.37-10.87-14.67-13.28-3.87-2.83-7.77-4.75-11-5.4-3.4-0.69-6.44-0.68-9.5 0.02-2.47 0.57-5.51 1.71-6.75 2.54-1.24 0.83-3.49 3.21-5 5.28-1.51 2.07-3.49 6.24-4.39 9.25-0.91 3.01-3.71 14.25-6.23 24.98-2.52 10.73-5.47 25.13-6.56 32-1.09 6.88-2.7 20.6-3.58 30.5-0.88 9.9-2.49 25.65-3.58 35-1.08 9.35-2.63 19.93-3.44 23.5-0.82 3.57-2.36 10.55-3.43 15.5-1.07 4.95-2.45 10.35-3.07 12-0.62 1.65-2.67 8.74-4.55 15.75-1.88 7.01-4.49 14.89-5.8 17.5-1.31 2.61-4.01 6.66-6 9-2.1 2.47-3.89 5.82-4.26 8-0.35 2.06-0.23 5.25 0.25 7.08 0.52 1.96 1.92 3.87 3.39 4.63 1.38 0.72 4.52 1.79 7 2.38 2.47 0.59 6.26 0.75 8.42 0.36 2.45-0.44 5.29-2.01 7.59-4.2 2.02-1.93 5.09-4.29 6.83-5.25 1.74-0.96 3.83-3.1 4.66-4.75 0.83-1.65 1.89-6.94 2.38-11.75 0.48-4.81 1.38-9.76 2-11 0.61-1.24 3.59-3.82 6.62-5.75 3.03-1.93 6.29-4.72 7.25-6.21 1.18-1.82 1.72-4.52 1.64-8.25q-0.1-5.54-2.75-11.29c-2.02-4.39-2.64-7.34-2.66-12.5-0.01-4.49 0.95-10.1 2.86-16.75 1.58-5.5 4.91-14.95 7.39-21 2.48-6.05 6.75-15.5 9.47-21 2.73-5.5 6.01-12.93 7.29-16.5 1.28-3.57 2.59-6.84 2.92-7.26 0.32-0.41 3.21 4.99 6.41 12 3.21 7.02 7.93 16.36 10.5 20.76 2.85 4.85 7.82 11.14 12.68 16.03 6 6.03 9.87 8.94 15.5 11.68 4.13 2.01 10.43 4.2 14 4.87 4.06 0.77 10.26 1.01 16.5 0.64 8.86-0.52 10.8-1 17-4.16 4.07-2.07 8.47-3.57 10.5-3.57 2.4 0 4.6 0.91 7 2.91 1.93 1.6 5.75 3.87 8.5 5.05 2.75 1.18 8.15 2.63 12 3.22 3.89 0.6 11.1 0.8 16.25 0.46 5.09-0.35 12.06-1.57 15.5-2.72 3.44-1.15 8.95-3.73 12.25-5.73 3.3-2.01 8.66-6.35 11.91-9.66 3.25-3.31 7.41-8.38 9.25-11.27l3.34-5.25c3.49 6.57 6.07 9.51 8 10.77 2.45 1.6 5 2.29 8.5 2.3 2.75 0.01 6.8 0.67 9 1.46 2.2 0.79 5.69 1.45 7.75 1.45 2.78 0.02 4.14-0.56 5.26-2.23 1.22-1.82 1.85-2.04 3.25-1.15 1.02 0.65 2.86 4.98 4.45 10.5 1.5 5.17 3.25 12.77 3.9 16.9 0.65 4.13 0.92 9.52 0.61 12-0.32 2.48-1.96 7.99-3.65 12.25-1.69 4.26-3.07 8.88-3.07 10.25 0 1.37 0.79 4.13 1.75 6.12 1.2 2.48 3.56 4.69 7.5 7 4.75 2.79 5.92 4.04 6.74 7.13 0.55 2.06 1.04 6.68 1.08 10.25 0.05 3.57 0.64 8.07 1.32 10 0.83 2.36 2.74 4.48 5.87 6.5 2.55 1.65 4.89 3.79 5.19 4.75 0.3 0.96 2.01 2.65 3.8 3.75 2.05 1.25 5.01 1.99 8 2 2.61 0 4.98-0.45 5.25-1 0.27-0.55 1.79-1 3.36-1 1.82 0 3.84-1.01 5.53-2.75 1.58-1.64 2.89-4.37 3.24-6.75 0.33-2.2 0.24-5.13-0.18-6.5-0.42-1.38-2.63-5.2-4.9-8.5-2.26-3.3-5.08-8.7-6.26-12-1.18-3.3-4.2-12.64-6.72-20.75-2.51-8.11-4.58-15.99-4.59-17.5-0.02-1.51-0.92-6.13-2.02-10.25-1.09-4.13-2.63-14.02-3.42-22-0.79-7.98-1.71-20.13-2.04-27-0.33-6.88-1.06-18.13-1.62-25-0.55-6.88-1.89-18.35-2.97-25.5-1.07-7.15-3.25-18.4-4.84-25-1.58-6.6-3.42-14.7-4.08-18-0.67-3.3-1.9-8.03-2.74-10.5-0.84-2.47-2.48-5.77-3.64-7.33-1.16-1.55-3.46-3.64-5.11-4.64-1.65-1-4.8-2.1-7-2.45-2.46-0.39-6.3-0.02-10 0.96-3.31 0.88-8.91 3.55-12.5 5.95-3.57 2.39-7.85 5.75-9.5 7.45-1.65 1.71-3.45 3.09-4 3.08-0.55-0.02-2.57-5.54-4.5-12.27l-3.5-12.25v-53.39c5.93-5.92 6.64-7.45 6.68-10.61 0.02-2.2-0.46-5.01-1.07-6.25-0.61-1.24-1.11-2.47-1.11-2.75 0-0.28 1.65-0.61 3.67-0.75 2.02-0.14 3.82-0.7 3.99-1.25 0.17-0.55-0.92-0.88-2.42-0.74-1.51 0.15-3.67-0.52-4.81-1.5-1.14-0.97-2.6-2.77-3.25-4.01-0.98-1.86-0.84-2.81 0.82-5.5 1.09-1.79 2-4.82 2.01-6.75 0.01-1.93-0.64-4.4-1.46-5.5-0.82-1.1-1.5-2.79-1.52-3.75-0.02-1.04-0.54-1.51-1.28-1.17-0.69 0.32-2.71-0.13-4.5-1-1.79-0.87-3.7-2.71-4.25-4.08-0.79-1.97-0.58-3.19 1-5.75 1.09-1.79 1.99-4.38 1.99-5.75 0-1.38-0.9-3.96-1.99-5.75-1.25-2.02-4.12-4.29-7.62-6-3.09-1.51-5.9-3.31-6.25-4-0.35-0.69 0.15-2.04 1.09-3 1.14-1.15 1.74-3.37 1.75-6.5 0.03-3.93-0.46-5.23-2.82-7.5-2.22-2.15-2.93-3.87-3.25-7.86-0.38-4.86-0.75-5.45-7.65-12-3.99-3.79-7.23-7.56-7.21-8.39 0.02-0.95 0.94-0.4 2.49 1.5 2.14 2.61 2.46 2.74 2.49 1 0.02-1.1-1.14-3.13-2.57-4.5-1.43-1.38-3.9-5.2-5.5-8.5-1.8-3.74-5.74-8.92-10.42-13.75-4.14-4.26-9.22-8.45-11.28-9.3-2.06-0.86-6.45-1.54-9.75-1.52-3.3 0.03-8.25-0.19-11-0.48-3.92-0.4-6.08-0.01-10 1.83zm3.07 3.22c0.87-0.82 2.67-1.5 4-1.5 1.44 0 3.85 1.42 5.93 3.5 2.46 2.46 3.46 4.32 3.35 6.25-0.14 2.63-0.16 2.64-0.48 0.25-0.19-1.38-1.1-3.18-2.02-4-1.26-1.13-1.76-1.19-2.01-0.25-0.2 0.75-2.05 1.26-4.59 1.26-2.34 0.01-6.16 0.91-8.5 2-2.34 1.1-4.7 2.89-5.25 3.99-0.55 1.1-0.66 2.01-0.25 2.03 0.41 0.02 1.65-0.89 2.75-2.03 1.1-1.14 2.45-2.07 3-2.08 0.55 0 0.32 0.78-0.5 1.74-1.42 1.66-1.37 1.66 1 0.03 1.37-0.94 3.29-1.7 4.25-1.7 0.96 0.01 1.75-0.44 1.75-0.99 0-0.6 1.01-0.5 2.53 0.25 1.39 0.69 2.51 1.59 2.5 2-0.02 0.41-0.48 0.98-1.03 1.25-0.55 0.27-0.78 0.95-0.5 1.5 0.28 0.56-0.93 1.01-2.75 1.03-1.79 0.02-4.99 1.03-7.11 2.25-2.12 1.22-4.65 3.8-5.63 5.72-0.97 1.92-2.05 4.85-2.39 6.5-0.34 1.65-0.17 3.67 0.37 4.5 0.76 1.16 0.99 0.82 1.02-1.5 0.02-1.65 0.92-4.91 2.01-7.25 1.34-2.88 3.35-5.05 6.23-6.73 2.34-1.36 4.93-2.51 5.75-2.54 0.82-0.04 2.53 0.74 6.09 3.52l-3.8-0.37c-2.08-0.2-4.8 0.13-6.04 0.75-1.24 0.62-3.15 2.92-4.25 5.12-1.1 2.2-2.16 6.36-2.35 9.25-0.19 2.89-1.21 7.27-2.25 9.74-1.05 2.46-2.83 6.29-3.97 8.5-1.33 2.57-4.91 6.17-10 10.05-4.57 3.48-8.67 7.5-9.68 9.5-1.45 2.88-1.75 3.08-1.75 1.21 0-1.24 0.68-3.6 1.5-5.25 0.82-1.65 3.97-4.8 7-7 3.03-2.2 5.5-4.45 5.5-5 0-0.55-1.91 0.37-4.25 2.05-2.34 1.68-5.71 4.38-7.5 6-2.65 2.41-3.26 2.63-3.28 1.2-0.02-0.96 1.22-4.11 2.75-6.99 1.53-2.89 5.51-8.06 8.85-11.5 3.34-3.44 6.34-6.93 6.66-7.76 0.32-0.83 1.3-3.19 2.18-5.25 0.89-2.11 1.15-3.75 0.59-3.75-0.55 0-1.85 1.46-2.88 3.25-1.04 1.8-3.82 4.24-6.25 5.47-2.4 1.22-4.48 2-4.62 1.75-0.14-0.26 1.35-2.67 3.31-5.35 1.96-2.69 3.55-5.5 3.54-6.25-0.01-1.1-0.32-1.08-1.6 0.13-0.87 0.83-1.58 1.27-1.56 1 0.01-0.27 0.56-2.08 1.22-4 0.65-1.92 1.94-4.63 2.86-6 0.92-1.38 2.98-4.49 4.57-6.92 1.6-2.43 4.11-5.63 5.58-7.11 1.47-1.48 4.06-2.98 5.75-3.33 1.7-0.35 3.79-1.32 4.65-2.14zm18.71 0.75c0.57-1.32 1.85-2.25 3.1-2.25 1.16 0.01 3.58 0.91 5.37 2 1.79 1.1 5.95 4.7 9.25 8 3.3 3.3 5.76 6.56 5.46 7.25-0.3 0.69 0.62 2.6 2.04 4.25 1.41 1.65 3.47 5.02 4.56 7.5 1.09 2.48 1.98 5.06 1.96 5.75-0.01 0.91-0.76 0.81-2.77-0.37-1.51-0.89-4.44-3.37-6.5-5.5-2.06-2.13-3.98-3.88-4.25-3.88-0.27 0-0.5 0.23-0.5 0.5 0 0.27 2.14 2.79 4.75 5.59 2.61 2.8 6.32 5.96 8.25 7.02 1.93 1.06 4.36 3.38 5.42 5.16 1.06 1.78 2.29 4.47 2.75 5.98 0.46 1.51 0.49 2.73 0.08 2.72-0.41-0.02-3.43-1.94-6.7-4.25-3.27-2.32-7.46-6.24-9.32-8.72-1.86-2.48-4.36-7.16-5.56-10.4-1.31-3.57-3.45-7.03-5.42-8.75-1.79-1.57-4.38-2.85-5.75-2.85-1.38 0-3.64-0.56-5.03-1.25-1.39-0.69-2.51-1.81-2.5-2.5 0.02-0.69 1.17-1.81 2.55-2.5 2.15-1.06 3.08-0.96 6.25 0.72 2.05 1.09 4.07 2.1 4.48 2.25 0.41 0.16 0.53-0.28 0.27-0.97-0.27-0.69-2.4-2.25-4.75-3.48-2.35-1.22-5.06-2.23-6.02-2.25-0.96-0.01-1.91-0.58-2.1-1.27-0.19-0.69 0.09-2.26 0.63-3.5zm2.6 17.02c1.3-0.55 3.1-0.77 4-0.49 0.89 0.29 2.69 1.46 4.01 2.62 1.31 1.15 3.38 4.35 4.61 7.1 1.23 2.75 3.6 7.25 5.26 10 1.67 2.75 6.27 7.7 10.22 11 4.87 4.06 8 7.62 9.69 11 2 4 2.36 5.8 1.8 9-0.68 3.84-0.75 3.9-1.69 1.5-0.54-1.37-1.57-3.62-2.29-5-0.72-1.37-3.58-3.85-6.35-5.5-2.77-1.65-4.84-3.34-4.59-3.75 0.25-0.41-1.72-2.89-4.36-5.5-3.53-3.48-5.13-6.02-6-9.5-0.66-2.61-1.64-4.75-2.19-4.75-0.55 0-1-1.12-1-2.5 0-1.37-0.61-3.96-1.36-5.75-0.75-1.79-2.21-4.05-3.25-5.02-1.04-0.98-3.46-2.15-5.39-2.61-3.41-0.82-3.44-0.87-1.12-1.85zm-14.13 5.84c2.61-0.49 6.78-0.65 9.25-0.36 2.7 0.33 5.82 1.59 7.8 3.15 1.81 1.43 3.95 4.29 4.75 6.35 0.8 2.06 1.45 5.33 1.45 7.25 0 3.28-0.27 3.57-4.25 4.62-2.34 0.62-5.28 1.63-6.53 2.25-1.25 0.62-2.26 1.69-2.25 2.38 0.02 0.69 0.48 1.25 1.03 1.25 0.55 0 0.83 0.79 0.61 1.75-0.21 0.96-0.77 2.63-1.25 3.71-0.75 1.71-0.56 1.87 1.64 1.33 1.37-0.34 3.85-0.21 5.5 0.29 2.47 0.75 3.61 0.48 6.5-1.55 3.43-2.41 3.52-2.42 4.75-0.49 1.02 1.61 0.88 3.63-0.78 11.21-1.12 5.09-3.14 11.16-4.5 13.5-1.36 2.34-5.06 6.31-8.22 8.83-3.16 2.51-6.88 4.81-8.25 5.11-1.38 0.29-3.4 0.26-4.5-0.06-1.1-0.32-4.21-2.29-6.91-4.36-2.7-2.07-6.19-5.35-7.76-7.27-1.79-2.21-3.75-6.81-7.79-21.5l2.23-2.22c1.69-1.68 2.66-1.98 3.98-1.25 0.96 0.53 4.22 0.75 7.25 0.47 3.03-0.28 5.5-0.72 5.5-1 0-0.28-0.68-1.62-1.5-3-1.33-2.22-1.33-2.56 0-3 1.22-0.41 1.27-0.79 0.25-2.07-0.69-0.87-2.91-2.1-4.93-2.75-3.56-1.14-3.69-1.35-4.11-6.68-0.24-3.02-0.03-6.63 0.48-8 0.51-1.38 2.02-3.51 3.37-4.75 1.34-1.24 4.58-2.65 7.19-3.14zm-36.74 3.14c1.31-1.24 2.46-2.25 2.55-2.25 0.09 0-0.49 2.36-1.29 5.25-0.81 2.89-2.4 6.83-3.55 8.75-2.01 3.38-2.11 3.43-2.9 1.25-0.55-1.51-0.23-3.64 0.99-6.5 1-2.34 2.89-5.26 4.2-6.5zm3.5 17.07c3.65-3.48 6.8-6.32 7-6.32 0.19 0-0.02 0.79-0.47 1.75-0.46 0.96-3.58 4.11-6.94 7-3.35 2.89-6.13 4.94-6.17 4.57-0.04-0.37 2.92-3.52 6.58-7zm85.47 0.68q-0.01-1.49 3.02 1.5c1.67 1.65 3.03 3.79 3.02 4.75-0.01 0.96-0.47 1.75-1.02 1.75-0.55 0-1.9-1.46-3-3.25-1.09-1.79-2-3.92-2.02-4.75zm-32.7 3.77c0.67-0.41 2.23-0.75 3.47-0.75 1.24-0.01 2.59 0.66 3 1.49 0.41 0.83 0.41 1.73 0 2-0.41 0.27-2.31-0.07-4.22-0.76-2.23-0.8-3.04-1.51-2.25-1.98zm-67.67 2.51c1.59-1.22 3.05-2.23 3.24-2.25 0.2-0.02-1.49 2-3.75 4.47-2.25 2.47-4.09 5.06-4.07 5.75 0.01 0.69-0.21 0.91-0.5 0.5-0.29-0.41 0.08-1.99 0.83-3.5 0.75-1.51 2.66-3.75 4.25-4.97zm-0.16 6.67c0.88-1.62 2.03-2.95 2.57-2.95 0.54 0 0.99 0.79 1 1.75 0.01 0.96-0.41 3.1-0.92 4.75-0.51 1.65-1.22 4.35-1.58 6-0.51 2.36-0.84 2.68-1.57 1.5-0.5-0.83-0.96-2.98-1-4.8-0.05-1.81 0.63-4.63 1.5-6.25zm107.63 2.55l2.9 3.5c1.66 2.01 2.64 4.14 2.3 5-0.32 0.83-1.08 2.1-1.69 2.84-0.89 1.1-1.32 1.01-2.36-0.5-0.69-1.01-1.24-3.87-1.21-6.34zm-25.83 8.53c1.24-1.08 2.4-1.98 2.58-2 0.18-0.02 0.56 0.76 0.85 1.72 0.4 1.33 0.14 1.57-1.07 1-1.29-0.6-1.62-0.11-1.68 2.5-0.05 1.79-0.26 4.15-0.48 5.25-0.21 1.1-1.08 2.34-1.92 2.75-0.84 0.41-2.23 2.21-3.08 4-1.13 2.35-1.38 2.56-0.92 0.75 0.35-1.37 0.87-3.62 1.17-5 0.29-1.37 1.09-2.95 1.77-3.5 0.68-0.55 1.61-2.12 2.07-3.5 0.61-1.83 0.52-2.3-0.35-1.75-0.65 0.41-1.19 0.53-1.19 0.25 0-0.28 1.01-1.39 2.25-2.47zm11.43 2.72c0.32-2.61 0.97-4.75 1.45-4.75 0.48 0 1.55 1.13 2.37 2.5 0.85 1.42 1.24 3.47 0.89 4.75-0.34 1.24-2.14 4.61-4 7.5-1.86 2.89-3.61 6.15-3.89 7.25-0.27 1.1 0.18 3.35 1 5 0.83 1.65 2.31 3.56 3.3 4.25 0.99 0.69 2.57 2.38 3.51 3.75 0.94 1.38 1.7 3.51 1.7 4.75-0.01 2.12-0.37 2-6.22-2-4.86-3.33-6.4-5.01-7.09-7.75-0.75-2.97-0.33-4.79 2.77-12 2-4.67 3.9-10.64 4.21-13.25zm11.42-3.25c0.03-1.11 0.58-0.32 1.23 1.77 0.64 2.08 2.41 5.34 3.92 7.25 1.51 1.91 4.55 4.38 6.75 5.48 2.2 1.1 4.45 2.9 5 4 0.55 1.1 0.78 2.34 0.51 2.75-0.27 0.41-1.29 0.07-2.25-0.76-0.97-0.83-3.5-2.4-5.63-3.5-2.13-1.09-4.64-3.11-5.57-4.49-0.93-1.37-2.22-4.3-2.86-6.5-0.64-2.2-1.14-4.9-1.1-6zm-17.93 3.75c0.12-1.79 0.48-3.26 0.78-3.28 0.3-0.01 1.11 1.11 1.8 2.5 1.02 2.06 0.99 3.13-0.16 5.78-0.78 1.79-3.12 5.5-5.21 8.25-2.09 2.75-4.11 6.58-4.48 8.5-0.66 3.44-0.67 3.45-0.8 0.5-0.08-1.72 1.56-6.41 3.85-11 2.19-4.4 4.09-9.46 4.22-11.25zm-64.8 0c0.32-0.69 0.82-1.25 1.11-1.25 0.29 0 1.59 2.14 2.9 4.75 1.31 2.61 2.67 6.33 3.68 11.75l-1.53-3.25c-0.84-1.79-2.01-3.14-2.6-3-0.59 0.14-1.77-1.55-2.61-3.75-0.84-2.2-1.27-4.56-0.95-5.25zm-11.85 2.75c0.84-1.65 1.96-3 2.5-3 0.54 0 0.97 1.69 0.95 3.75-0.01 2.42 0.86 4.99 2.46 7.25 1.36 1.92 3.63 5.41 5.03 7.75 2.09 3.5 2.37 4.74 1.56 7-0.54 1.51-2 3.72-3.25 4.91-1.25 1.19-3.39 2.31-4.77 2.5-1.37 0.19-3.04 1.24-3.71 2.34-0.67 1.1-1.23 3.46-1.25 5.25-0.02 1.79-0.38 3.26-0.79 3.27-0.41 0.01-1.28-0.56-1.93-1.25-0.66-0.7-0.95-1.95-0.66-2.77 0.47-1.33 0.42-1.33-0.51 0-0.57 0.82-1.4 1.16-1.84 0.74-0.45-0.42-0.25-1.88 0.44-3.25 0.69-1.37 3.39-4.01 6-5.86 2.61-1.85 5.09-4.1 5.5-5 0.41-0.9 0.77-3.32 0.79-5.38 0.02-2.72-0.83-4.85-3.1-7.75-1.72-2.2-3.53-4.79-4.03-5.75q-0.91-1.75 0.61-4.75zm8.07-1.5c0.32-0.83 0.99-1.5 1.5-1.5 0.5 0 0.91 1.46 0.9 3.25-0.01 2.08 1.6 5.94 4.47 10.75 2.46 4.13 4.72 8.74 5.01 10.25 0.31 1.58-0.17 4.13-1.12 6-1.49 2.93-1.72 3.05-2.34 1.25-0.6-1.72-0.86-1.51-1.83 1.5-0.62 1.92-2.73 5.08-4.67 7-1.95 1.93-3.52 3.05-3.48 2.5 0.03-0.55-0.65-0.32-1.53 0.5-1.42 1.34-1.58 1.31-1.54-0.25 0.02-0.96 2.29-4.22 5.04-7.25 2.75-3.03 5-5.95 5-6.5 0-0.55 0.68-0.78 1.5-0.5 1.1 0.36 1.5-0.24 1.48-2.25-0.01-1.51-0.84-4.55-1.84-6.75-1-2.2-2.62-4.67-3.6-5.5-0.98-0.83-2.63-3.19-3.66-5.25-1.03-2.06-1.88-4.42-1.88-5.25 0-0.83 0.45-1.28 1-1 0.55 0.28 1.27-0.17 1.59-1zm83.03 5.07c0.8-1.75 1.06-1.62 2.96 1.5 1.14 1.89 3.82 4.55 5.94 5.93 2.13 1.38 4.68 3.85 5.67 5.5 0.99 1.65 1.82 4.13 1.83 5.5 0.02 2.49 0 2.48-3.25-0.87-1.8-1.85-4.62-4.04-6.27-4.87-1.65-0.82-3.8-2.23-4.78-3.13-0.98-0.9-2.05-2.98-2.38-4.63-0.33-1.65-0.2-3.87 0.28-4.93zm-98.7 2.18c0.58-1.51 1.28-2.75 1.56-2.75 0.29 0 0.97 1.12 1.52 2.5 0.72 1.79 0.63 3.42-0.33 5.75-0.73 1.79-2.76 4.49-4.5 6-1.74 1.51-3.84 2.75-4.67 2.75-0.82 0-2.4 1.46-3.49 3.25-1.1 1.79-2 4.71-2 6.5-0.01 1.79 0.67 4.6 1.49 6.25 0.97 1.94 1.24 3.93 0.75 5.65-0.41 1.46-1.65 3.28-2.75 4.03-1.9 1.31-2.04 1.11-2.81-4.4-0.45-3.18-0.9-7.74-1-10.14-0.17-3.96 0.21-4.73 4.06-8.25 3.13-2.86 3.86-4.02 2.75-4.39-0.82-0.28-2.19 0.06-3.04 0.75-0.86 0.7-1.54 0.81-1.54 0.25 0-0.55 1.26-1.56 2.79-2.24 1.54-0.69 4.45-2.94 6.48-5 2.03-2.07 4.16-5 4.73-6.51zm92.11 3.12c0.66-1.09 1.71-1.81 2.34-1.59 0.62 0.23 1.69 2.62 2.37 5.31 0.69 2.7 2.51 6.26 4.06 7.91 1.54 1.65 3.46 3.85 4.25 4.88 1.16 1.51 0.45 1.34-3.55-0.83-2.75-1.49-6.24-4.14-7.76-5.88-1.52-1.74-2.8-4.21-2.84-5.49-0.04-1.27 0.47-3.21 1.13-4.31zm-103.77 2.8c0.68-0.28 2.14-0.55 3.24-0.61 1.56-0.07 1.23 0.47-1.5 2.44-1.92 1.39-3.84 2.53-4.25 2.52-0.41-0.01-0.29-0.88 0.26-1.93 0.56-1.05 1.57-2.14 2.25-2.42zm17.54 3.08c0.9-1.51 1.88-2.76 2.17-2.77 0.29-0.01 1.1 0.56 1.8 1.25 0.7 0.7 1.26 2.51 1.25 4.02-0.01 1.59-1.18 4.01-2.77 5.74-1.51 1.64-4.44 3.66-6.5 4.5-2.06 0.83-3.74 1.17-3.73 0.76 0.01-0.41 1.39-3 3.07-5.75 1.69-2.75 3.8-6.24 4.71-7.75zm26.51-2.25l0.7 4c0.38 2.2 0.43 5.31 0.1 6.91-0.34 1.6-1.17 3.07-1.86 3.25-0.87 0.24-1.22-1-1.15-4.09 0.06-2.44 0.58-5.71 1.16-7.25zm88.95 0l0.98 2c0.54 1.1 0.64 3.12-0.53 7l-0.67-2.5c-0.38-1.38-0.48-3.4-0.23-4.5zm-54.92 1.39l0.75 6.3c0.62 5.26 1.22 6.67 3.58 8.52 1.55 1.22 4.74 3.02 7.08 4 2.42 1.01 4.51 2.65 4.83 3.79 0.31 1.1 0.2 2.3-0.26 2.68-0.45 0.37-4.2 1.57-8.32 2.66-4.13 1.08-6.38 2.01-5 2.05 1.37 0.04 5.2-0.62 8.5-1.46 3.3-0.83 6.3-1.16 6.67-0.73 0.38 0.44 1.88 5.07 3.36 10.3 1.47 5.22 2.9 11.97 3.18 15 0.44 4.72 0.21 5.78-1.63 7.5-1.18 1.1-2.13 2.78-2.12 3.75 0.02 0.96-1.25 2.98-2.83 4.5-1.58 1.51-3.15 3.98-3.5 5.5-0.35 1.51-1.42 2.96-2.38 3.23-0.97 0.26-2.88 2.58-4.25 5.15-1.38 2.57-3.52 5.73-4.75 7.02-1.24 1.29-2.24 2.91-2.22 3.6 0.02 0.68-0.88 2.03-2 3-1.97 1.69-2.09 1.64-3.94-1.5-1.06-1.79-2.63-5.73-3.51-8.75-1.43-4.95-1.44-6.08-0.09-11.25 0.83-3.17 1.49-6.32 1.46-7-0.02-0.69-0.9 0.32-1.95 2.25-1.31 2.38-1.94 5.57-1.98 10-0.04 3.57 0.65 8.52 1.53 11 0.87 2.47 2.46 5.73 3.52 7.25 1.46 2.08 1.63 2.92 0.68 3.45-0.69 0.39-4.11 0.73-7.6 0.75-3.48 0.03-6.52-0.29-6.75-0.7-0.22-0.42 0.97-3.34 2.66-6.5 2.13-4 2.97-6.82 2.43-12.75l-1.75 5c-0.96 2.75-2.65 6.46-5.74 11.5l-2.46-2.25c-1.36-1.24-2.48-3.04-2.5-4-0.03-0.97-0.92-2.32-2-3-1.07-0.69-2.92-3.05-4.1-5.25-1.18-2.2-3.46-5.24-5.05-6.75-1.59-1.52-2.89-3.65-2.89-4.75 0-1.1-0.68-2.23-1.5-2.5-0.83-0.28-2.18-2.08-3-4-0.83-1.93-1.95-3.73-2.5-4-0.55-0.28-1-2.3-1-4.5 0-2.2 1.01-7.18 2.25-11.06 1.51-4.73 2.66-6.87 3.5-6.5 0.92 0.41 1.18-0.7 0.75-8.94l9 0.35c4.98 0.2 10.23 0.98 11.75 1.75 1.51 0.77 2.97 1.4 3.25 1.4 0.27 0 0.51-0.34 0.54-0.75 0.02-0.42-1.22-1.28-2.75-1.93-1.54-0.64-6.39-1.42-10.79-1.72-4.4-0.31-8.38-0.91-8.85-1.33-0.46-0.43-0.46-1.52 0-2.43 0.47-0.92 3.1-3.21 10.85-8.53l0.25-8.16c0.13-4.49 0.58-8.17 1-8.2 0.41-0.02 1.42 0.71 2.25 1.62 0.82 0.92 2.73 2.29 4.25 3.05 1.51 0.75 4.55 1.38 6.75 1.38 2.2 0 5.01-0.52 6.25-1.16 1.23-0.63 3.79-2.46 5.67-4.05zm34.26 4.18c-0.3-1.45 0.01-1.77 1.25-1.31 0.91 0.34 3.17 1.55 5.04 2.68 1.86 1.13 4 3.29 4.75 4.81 0.75 1.51 1.36 3.42 1.36 4.25 0 0.82-0.9 1.95-2 2.5-1.77 0.88-2.06 0.61-2.47-2.25-0.25-1.79-1.38-4.49-2.5-6-1.12-1.52-2.71-2.75-3.53-2.75-0.83 0-1.68-0.87-1.9-1.93zm15.58-2.57l1.96 2.5c1.2 1.52 1.67 3.08 1.22 4-0.41 0.82-0.67 3.3-0.59 5.5 0.13 3.33-0.04 3.73-1.06 2.4-0.67-0.88-1.28-4.48-1.37-8zm-119.68 6.31c1.65-0.99 3.07-1.81 3.16-1.81 0.1 0-0.63 1.69-1.61 3.75-0.98 2.06-2.29 5.44-2.92 7.5-0.62 2.06-1.58 3.75-2.13 3.75-0.55 0-1.27-1.24-1.6-2.75-0.33-1.51 0.01-4.08 0.75-5.69 0.74-1.62 2.7-3.76 4.35-4.75zm82.25 2.69l2.12 2.25c1.17 1.24 3.36 2.75 4.88 3.37 1.51 0.61 2.18 1.29 1.5 1.5-0.69 0.21-2.38-0.3-3.75-1.12-1.38-0.83-3.01-2.51-3.63-3.75zm-81.28 8.58c1.48-1.7 2.89-3.08 3.13-3.08 0.24 0-0.25 1.12-1.08 2.5-0.84 1.37-1.29 3.62-1.02 5 0.28 1.37 0 2.84-0.61 3.25-0.61 0.41-1.51 0.07-1.99-0.75-0.48-0.83-0.93-2.03-1-2.67-0.07-0.65 1.08-2.56 2.57-4.25zm108.78 2.95c1.7-1.48 3.1-1.82 5.75-1.36 1.93 0.33 4.74 1.21 6.25 1.96 1.51 0.75 3.67 2.61 4.79 4.12 1.12 1.51 2.81 5 3.75 7.75 1.53 4.47 1.67 9.25 1.33 45.5-0.28 29.65-0.05 41.97 0.85 46 0.67 3.02 2.31 8.99 3.63 13.25 1.32 4.26 2.4 8.87 2.4 10.25 0 1.8-2.64 5.24-18.81 22l-1.64-4c-0.91-2.2-2.79-7.83-4.17-12.5-1.81-6.1-2.77-12.46-3.39-22.5-0.47-7.7-1.17-17.15-1.55-21-0.65-6.49-0.5-7.29 1.95-11 1.45-2.2 3.08-6.14 3.62-8.75 0.55-2.61 1-7.34 1-10.5 0.01-3.16-0.59-7.78-1.34-10.25q-1.36-4.5-0.46-7c0.49-1.38 0.75-4.08 0.25-9.5l-1.48 4.19c-0.81 2.31-1.82 4-2.23 3.75-0.41-0.24-0.76 0.35-0.77 1.31-0.01 0.96 0.67 3.77 1.52 6.25 0.85 2.47 1.53 4.72 1.53 5-0.01 0.27-2.49-3.55-5.52-8.5-3.02-4.95-5.49-9.68-5.49-10.5 0.01-0.83-0.41-1.95-0.93-2.5-0.52-0.55-2.11-5.61-3.52-11.25-1.41-5.64-2.57-10.93-2.57-11.75 0-0.93 0.86-1.46 2.25-1.38 1.85 0.1 2.3 0.77 2.51 3.75 0.15 2 1.05 4.43 2 5.41 0.96 0.98 2.98 1.77 4.49 1.75 1.51-0.02 3.09-0.58 3.5-1.26 0.54-0.89 0.2-1.02-1.25-0.49-1.34 0.5-2.58 0.16-3.78-1.02-0.98-0.97-1.74-2.62-1.69-3.67 0.05-1.05 1.22-3.38 2.6-5.18 1.37-1.8 2.47-3.53 2.43-3.84-0.03-0.32 0.95-1.46 2.19-2.54zm-7.2-0.37c0.8-0.28 1.79-0.54 2.2-0.58 0.41-0.05 0.77 0.48 0.79 1.17 0.03 0.69-0.86 2.37-3.97 6.25l-0.24-3.17c-0.15-2.03 0.29-3.35 1.22-3.67zm26.54 4.09c-1.47-2.22-1.99-3.76-1.29-3.78 0.66-0.01 2.1 1 3.2 2.25 1.1 1.25 2.49 3.18 3.09 4.28 0.6 1.1 0.94 2.56 0.75 3.25-0.19 0.69-0.79 1.25-1.34 1.25-0.55 0-1.21-0.79-1.46-1.75-0.25-0.96-1.58-3.44-2.95-5.5zm-36.04-0.75c0.3-0.55 1.43-1 2.5-1 1.45 0 1.82 0.51 1.45 2-0.27 1.1-1.17 2-2 2-0.82 0-1.72-0.45-2-1-0.27-0.55-0.25-1.45 0.05-2zm-95.74 7.03c2.03-1.07 5.15-1.96 6.94-1.99 2.32-0.03 4.11 0.82 6.25 2.96 1.65 1.65 3.01 3.79 3.03 4.75 0.01 0.96-1 2.67-2.25 3.81-1.26 1.13-3.52 2.59-5.03 3.25-1.51 0.65-2.74 1.98-2.73 2.94q0.01 1.75 0.75 0.55c0.4-0.65 2.76-1.92 5.23-2.81 2.48-0.88 5.08-2.15 5.79-2.8 0.72-0.66 1.28-1.98 1.25-2.94-0.02-0.96 0.41-1.75 0.96-1.75 0.55 0 1.32 0.44 1.7 0.99 0.39 0.55-0.13 3.81-1.15 7.25-1.02 3.44-2.41 7.38-3.09 8.76-0.69 1.37-1.99 4.3-2.9 6.5-0.91 2.2-2.56 5.12-3.67 6.5q-1.98 2.44-0.98 0.5c0.57-1.1 0.71-2.32 0.31-2.7-0.39-0.39-1.28-0.5-1.97-0.25-0.77 0.28-1.5-0.8-1.89-2.8-0.55-2.76-0.75-2.95-1.35-1.25-0.38 1.1-0.36 3.35 0.05 5 0.46 1.86 0.16 5.09-0.79 8.5-1 3.59-1.4 8.3-1.15 13.58 0.33 7.04 0.81 8.76 7.06 18.92l-5.68 29.64-2.5-1.96c-1.37-1.09-4.3-2.26-10.5-3.27l4 2.04c2.2 1.12 5.25 3.5 6.79 5.29 1.53 1.79 3.66 6.07 4.75 9.51 1.08 3.44 1.74 6.7 1.46 7.25-0.27 0.55 3.21 5.1 7.75 10.12 4.54 5.02 9.87 11.21 11.86 13.75 1.98 2.55 4.82 7.55 6.31 11.13 1.49 3.57 3.13 7.74 3.65 9.25 0.51 1.51 0.59 2.76 0.18 2.78-0.41 0.02-1.49-0.77-2.39-1.75-0.91-0.98-2.26-4.42-3-7.65-0.75-3.22-1.7-6.03-2.11-6.25-0.41-0.21-0.99-0.27-1.28-0.13-0.29 0.14 1.17 7.59 3.25 16.56 2.08 8.97 3.44 16.51 3.03 16.75-0.41 0.24-0.9 0.33-1.08 0.19-0.18-0.14-2.09-4.92-4.25-10.63-2.16-5.71-4.26-10.55-4.67-10.75-0.41-0.21-0.94-0.26-1.17-0.12-0.23 0.14 0.26 3.17 1.09 6.75 0.83 3.57 2.31 8.07 3.29 10 0.98 1.92 2.07 4.51 2.41 5.75 0.35 1.24 0.29 2.27-0.12 2.29-0.41 0.02-2.38-2.57-4.37-5.75-1.99-3.19-4.35-8.15-5.25-11.04-0.9-2.89-2.08-5.48-2.63-5.75-0.55-0.28-1.21-0.39-1.46-0.25-0.25 0.14 0.69 3.62 2.11 7.75 1.41 4.12 3.03 8.17 3.59 9 0.57 0.82-0.6-0.19-2.6-2.25-2.22-2.29-4.32-5.91-5.39-9.27-0.96-3.03-2.31-5.51-3-5.5-0.76 0.01-1.01 0.71-0.63 1.77 0.34 0.96 1.24 3.66 2 6 0.76 2.34 1.04 4.26 0.63 4.28-0.41 0.01-1.28-1-1.93-2.25-0.65-1.26-2.1-5.21-3.22-8.78-1.13-3.58-2.53-9.88-3.11-14-0.59-4.13-2.29-10.09-3.78-13.25-1.49-3.16-3.16-5.74-3.71-5.74-0.55 0.01-3.07-2.13-5.6-4.75-2.52-2.62-5.52-6.11-6.66-7.76-1.14-1.65-2.54-5.03-3.11-7.5-0.77-3.34-0.68-6.82 0.36-13.5 0.77-4.95 1.91-14.63 2.53-21.5 0.61-6.88 1.49-24.2 1.94-38.5 0.55-17.39 1.29-27.49 2.23-30.5 0.77-2.48 2.42-5.97 3.66-7.77 1.25-1.8 3.92-4.14 5.96-5.2zm-13.81 9.17c0.77-0.66 1.7-1.2 2.06-1.2 0.36 0 0.52 0.79 0.35 1.75-0.18 0.96-0.56 2.99-0.86 4.5-0.3 1.51-1 2.52-1.55 2.25-0.55-0.28-1.09-1.76-1.2-3.3-0.11-1.54 0.43-3.34 1.2-4zm152 18.8c0-2.75 0.23-5 0.5-5 0.28 0 1.19 1.01 2.03 2.25 1.28 1.89 1.32 2.7 0.25 5.03-0.7 1.53-1.62 2.76-2.03 2.75-0.41-0.02-0.75-2.28-0.75-5.03zm-38.01 7.19c1.09-0.94 1.55-0.93 2.11 0.05 0.39 0.69 1.22 3.96 1.84 7.26 0.62 3.3 1.35 6.22 1.62 6.5 0.27 0.27 0.46-2.2 0.42-5.5-0.05-4.83 0.18-5.78 1.23-4.87 0.71 0.62 2.59 3.99 4.18 7.5 1.74 3.82 2.92 8.17 2.96 10.87 0.05 3.15-0.74 5.92-2.64 9.25-1.49 2.61-3.95 5.61-5.46 6.65-1.51 1.05-3.99 2.18-5.5 2.5-1.51 0.33-2.77 0.26-2.79-0.15-0.03-0.41 0.53-1.26 1.25-1.87 0.71-0.62 2.3-3.43 3.54-6.25 1.24-2.82 2.48-7.94 2.77-11.38 0.49-5.89 0.44-6.08-0.85-3.25-0.75 1.65-2.22 5.68-3.27 8.96-1.04 3.28-3.14 7.66-4.65 9.75-1.51 2.08-3.54 4.08-4.5 4.44-0.96 0.36-4.11 0.13-7-0.5-2.89-0.63-5.92-1.83-6.75-2.65-0.82-0.83-1.27-2.29-0.99-3.25 0.28-0.96 1.79-3.1 3.35-4.75 1.56-1.65 3.58-4.58 4.49-6.5 0.91-1.93 2.66-4.66 3.9-6.07 1.24-1.41 3.04-2.88 4-3.25 0.98-0.38 1.53-1.34 1.25-2.18-0.27-0.83 0.29-2.86 1.25-4.51 0.96-1.66 2.09-3.01 2.5-3 0.41 0 0.66-0.58 0.55-1.29-0.11-0.72 0.43-1.84 1.19-2.51zm-82.22 1.65c0.18-0.46 0.61-0.84 0.95-0.84 0.35 0 1.9 2.47 3.46 5.5 1.8 3.5 2.56 6.13 2.09 7.25-0.44 1.07-0.35 1.48 0.25 1.05 0.54-0.38 1.97 0.52 3.19 2 1.21 1.49 4.65 5.85 7.63 9.7 2.98 3.85 5.59 8.09 5.79 9.42 0.32 2.12-0.27 2.65-4.63 4.21-2.75 0.98-5.9 1.82-7 1.86-1.1 0.05-3.31-1.17-4.9-2.7-1.6-1.54-4.19-5.6-5.75-9.04-1.57-3.44-3.24-8.84-4.61-17.75l-0.12 7.75c-0.08 5.01 0.43 9.07 1.44 11.5 0.86 2.06 2.66 5.21 4 7 2.13 2.83 2.22 3.25 0.69 3.24-0.96 0-3.21-0.9-5-2-1.79-1.09-4.61-4.13-6.26-6.74-2.15-3.38-3.01-5.97-3-9 0-2.34 0.92-6.61 2.02-9.5 1.11-2.89 2.9-6.38 5.95-10.25l0.02 3.25c0.01 1.79 0.36 3.26 0.77 3.27 0.41 0.01 1.19-1.86 1.72-4.16 0.53-2.29 1.12-4.55 1.3-5.02zm22.23 42.2c4.68-1.64 9.14-2.89 9.92-2.76 0.78 0.12 1.57 0.67 1.76 1.22 0.18 0.55-4.17 4.49-9.67 8.75-5.51 4.26-10.46 7.75-11.01 7.75-0.55 0-3.14-1.07-5.75-2.37-2.61-1.3-5.54-3.1-6.5-4-0.96-0.9-1.75-2.53-1.75-3.63 0-1.82 0.66-2 7.25-1.99 5.51 0.01 9.29-0.7 15.75-2.97zm29.19-2.28c0.72-0.4 1.76-0.74 2.31-0.74 0.55-0.01 4.15 1.1 8 2.46 4.94 1.75 9.13 2.48 14.25 2.5 3.99 0.01 8.49-0.47 10-1.08 2.74-1.08 2.75-1.07 2.01 2.25-0.43 1.92-2.13 4.51-4 6.09-1.79 1.5-5.28 3.48-7.76 4.38-3.46 1.27-4.9 1.39-6.25 0.51-0.96-0.62-5.83-4.39-10.81-8.38-6.21-4.97-8.65-7.48-7.75-7.99zm-57.43 3.24c0.52-2.33 0.61-2.36 1.32-0.5 0.41 1.1 2.18 8.07 3.93 15.5 2.22 9.44 2.96 14.55 2.48 17-0.38 1.92-2.11 5.42-3.84 7.78-1.73 2.35-3.49 4.26-3.9 4.25-0.41-0.02-0.99-1.72-1.29-3.78-0.3-2.06-1.27-5.78-2.15-8.25-1.52-4.25-1.48-5.21 0.64-17 1.23-6.88 2.49-13.63 2.81-15zm36.74 7.08c5.5-4.39 10.79-8 11.75-8.03 0.96-0.03 6.36 3.6 12 8.06 5.64 4.46 10.7 8.46 11.25 8.9 0.56 0.45-4.28 2.83-11 5.41-6.6 2.53-12.45 4.61-13 4.6-0.55 0-5.84-2.14-11.75-4.76-5.92-2.62-10.42-5.08-10-5.48 0.41-0.39 5.25-4.31 10.75-8.7zm58.62 0.08c1.16-4.51 1.49-4.98 2.07-3 0.37 1.29 1.12 9.31 1.66 17.84 0.89 13.95 1.38 16.7 8.95 39.5l-6.05 7c-3.33 3.85-6.32 7.12-6.65 7.27-0.33 0.16-1.57-1.64-2.75-4-1.18-2.35-2.47-5.4-2.87-6.77-0.39-1.38-1.84-5.2-3.21-8.5-1.65-3.96-2.49-7.87-2.47-11.5 0.01-4.08 1.3-9 4.98-19 2.73-7.43 5.58-15.9 6.34-18.84zm-9.7 8.99c2.16-1.09 4.08-1.68 4.28-1.32 0.19 0.37-0.33 2.36-1.17 4.42-0.84 2.06-1.64 3.76-1.78 3.77-0.14 0.02-1.37-1.08-5.25-4.89zm-76.9 1.49c-0.59-2.64-0.46-2.8 1.67-2.13 1.27 0.4 2.91 1.01 3.64 1.36 0.97 0.45 0.62 1.11-1.25 2.38-1.42 0.96-2.77 1.64-3 1.5-0.23-0.14-0.7-1.54-1.06-3.11zm-98.49 0.11c1.91-0.96 5.05-1.76 6.97-1.77 1.93-0.01 5.08 0.52 7 1.16 1.93 0.65 5.08 2.25 7 3.54 1.93 1.3 6.84 5.62 10.92 9.59 4.09 3.98 13.33 13.98 20.54 22.23 7.21 8.25 17.44 20.17 22.74 26.5 7.3 8.71 9.96 12.68 10.97 16.37 0.86 3.16 2.47 5.88 4.58 7.75 1.79 1.58 4.36 4.57 5.71 6.63 1.35 2.06 4.66 8.92 7.35 15.25 2.7 6.32 5.67 14.87 6.6 19 0.94 4.12 2.41 9.97 3.28 13 1.49 5.23 1.48 5.56-0.31 6.78-1.03 0.7-4.35 2.21-7.38 3.35-3.02 1.13-8.87 2.3-13 2.6-5.76 0.4-9.47 0.03-16-1.64-4.67-1.19-10.97-3.61-13.98-5.38-3.02-1.77-7.92-5.46-10.9-8.21-2.97-2.75-7.29-7.7-9.6-11-2.31-3.3-5.8-8.93-7.77-12.5-1.97-3.58-6.1-12.13-9.18-19-5.54-12.36-5.59-12.56-4.57-18 0.57-3.03 0.99-13.15 0.94-22.5-0.07-13.1-0.36-16.7-1.26-15.7-0.8 0.88-1.21 7.1-1.29 19.5-0.09 15.34-0.45 19.45-2.28 26.2-1.2 4.4-4.24 12.5-6.77 18-2.53 5.5-6.94 15.17-9.81 21.5-2.87 6.32-6.84 16.45-8.81 22.5-1.98 6.05-4.07 13.59-4.66 16.75-0.58 3.16-1.51 5.97-2.06 6.25-0.55 0.27-1 2.07-1 4 0 1.92-0.45 4.4-1 5.5-0.55 1.1-0.73 2.34-0.39 2.75 0.33 0.41 1.35-0.3 2.25-1.59 1.63-2.31 1.67-2.25 4.89 6.25 2.78 7.34 3.1 9.1 2.25 12.09-0.59 2.07-2.53 4.73-4.75 6.51-2.06 1.65-5.21 3.68-7 4.5-2.82 1.29-3.38 2.19-4.2 6.74-0.53 2.89-1.43 8.4-2.01 12.25-0.57 3.85-1.64 7.9-2.37 9-0.73 1.1-2.87 2.75-4.75 3.67-1.88 0.92-4.66 3.05-6.17 4.75-1.51 1.69-3.76 3.34-5 3.65-1.24 0.32-3.34 0.43-4.67 0.25-1.33-0.18-2.66-1-2.94-1.82-0.41-1.18 0-1.35 1.92-0.79 1.34 0.39 3.12 0.31 3.94-0.18 1.21-0.72 1.28-1.35 0.35-3.21-0.94-1.91-0.81-2.77 0.73-4.82 1.03-1.38 1.89-3.06 1.9-3.75 0.01-0.69-0.2-1.25-0.48-1.25-0.27 0-2.71 2.36-5.4 5.25-2.7 2.89-5.29 4.92-5.75 4.51-0.47-0.4 0.39-2.54 1.9-4.75 1.51-2.2 2.77-4.57 2.78-5.26 0.02-0.75-0.81-0.45-2.08 0.75-1.34 1.28-1.88 1.46-1.47 0.5 0.35-0.83-0.07-2.06-0.92-2.75-1.38-1.11-1.18-1.95 1.85-7.5 1.87-3.44 4.17-8.95 5.1-12.25 0.93-3.3 3.2-10.95 5.04-17 1.85-6.05 3.77-13.48 4.27-16.5 0.5-3.03 1.86-9.1 3-13.5 1.15-4.4 2.99-15.43 4.08-24.5 1.09-9.08 2.48-22.35 3.08-29.5 0.6-7.15 1.77-18.85 2.6-26 0.82-7.15 2.19-16.6 3.03-21 0.84-4.4 3.09-14.3 5-22 1.91-7.7 4.1-15.8 4.87-18 0.77-2.2 1.65-6.14 1.96-8.75 0.38-3.25 1.6-6.09 3.84-9 1.8-2.34 4.84-5.04 6.75-6zm104.08 5.81c2.41-1.4 5.52-2.56 6.89-2.58 1.38-0.02 6.1 1.57 10.5 3.53 4.82 2.14 7.6 3.9 7 4.42-0.55 0.47-4.26 1.58-8.25 2.46-3.99 0.89-9.5 1.61-12.25 1.61-2.75 0-5.67-0.23-6.5-0.5-0.83-0.28-1.56-1.82-1.64-3.44-0.12-2.49 0.54-3.34 4.25-5.5zm140.39 0.29c4.12-1.96 7.57-2.85 11-2.85 3.24 0 6.14 0.71 8.25 2 1.79 1.1 4.6 4.36 6.24 7.25 1.65 2.89 3 6.71 3 8.5 0.01 1.79 0.41 4.26 0.9 5.5 0.49 1.24 2.56 9.22 4.59 17.75 2.04 8.52 4.55 21.35 5.58 28.5 1.03 7.15 2.8 27.17 3.93 44.5 1.12 17.32 2.49 34.76 3.03 38.75 0.54 3.99 1.88 10.74 2.99 15 1.1 4.26 2 8.76 2 10-0.01 1.24 1.52 7.09 3.39 13 1.87 5.91 4.38 14.12 5.58 18.25 1.2 4.12 3.69 10.2 5.52 13.5 2.46 4.42 3.1 6.46 2.42 7.75-0.51 0.96-1.37 1.52-1.92 1.25-0.55-0.28-1.02 0.06-1.03 0.75-0.02 0.69 0.88 2.49 2 4 1.11 1.51 1.92 3.23 1.78 3.81-0.14 0.58-1.6-0.76-3.25-2.98-1.65-2.22-3.34-4.04-3.75-4.06-0.41-0.01-0.75 0.43-0.75 0.98 0 0.55 1.13 2.57 2.5 4.5 1.38 1.92 2.2 4.06 1.82 4.75q-0.68 1.24-5.99-4.75c-2.93-3.3-5.33-5.44-5.33-4.75 0 0.69 0.68 2.6 1.5 4.25 1.05 2.09 1.2 3.45 0.5 4.5-0.55 0.82-0.77 2.17-0.5 3 0.33 0.99 1.78 1.48 4.25 1.45 3.39-0.04 3.61 0.11 2.25 1.55-0.82 0.87-2.51 1.57-3.75 1.54-1.24-0.02-3.6-0.72-5.25-1.54-1.65-0.83-3.67-2.85-4.5-4.5-0.82-1.65-2.17-3-3-3-0.82 0-2.86-1.24-4.53-2.75-2.37-2.16-3.23-4.04-3.99-8.75-0.53-3.3-0.96-7.8-0.95-10 0.01-2.2-0.67-5.69-1.5-7.75-1.07-2.61-2.66-4.28-5.23-5.5-2.04-0.96-4.97-2.99-6.5-4.5-2.09-2.05-2.8-3.71-2.79-6.5 0.01-2.06 1.19-6.68 2.62-10.25 1.43-3.58 2.76-6.73 2.96-7 0.2-0.28 0.94 0.02 1.64 0.66 1.02 0.93 1.21-0.06 0.95-5-0.17-3.39-0.7-7.29-1.18-8.66-0.47-1.38-1.84-7.23-3.04-13-1.2-5.78-3.75-15-5.67-20.5-1.91-5.5-6.79-16.98-10.83-25.5-4.04-8.53-8.05-18.2-8.91-21.5-0.86-3.3-2.01-9.6-2.56-14-0.54-4.4-0.99-12.84-0.99-18.75 0-6.17-0.43-10.96-1-11.25-0.65-0.33-0.93 5.52-0.6 34l-10.12 20.5c-5.57 11.27-12.06 23.42-14.43 27-2.36 3.57-7.25 9.42-10.86 13-3.88 3.84-9.41 8-13.52 10.16-3.84 2.01-9.67 4.45-12.97 5.43-3.95 1.16-9.41 1.77-16 1.78-7.43 0.01-11.8-0.54-17-2.14-3.85-1.18-8.53-3.41-13.79-7.73l2.08-7c1.15-3.85 3.82-10.6 5.93-15 2.12-4.4 5.52-10.59 7.56-13.75 2.05-3.16 3.95-5.75 4.22-5.75 0.28 0 0.28 0.67 0 1.5-0.27 0.82-0.16 1.49 0.25 1.48 0.41-0.02 4.2-5.3 8.41-11.75 4.86-7.44 13.41-18.14 23.37-29.23 8.64-9.63 22.74-24.66 31.34-33.4 8.6-8.75 17.88-17.7 20.63-19.9 2.75-2.2 7.7-5.28 11-6.85zm-91 1.35c5.5-2.27 10.9-4.15 12-4.16 1.1-0.01 3.72 1.66 5.83 3.72 2.1 2.05 3.62 4.19 3.37 4.74-0.25 0.55-1.07 2.92-1.83 5.27-0.75 2.35-1.93 4.26-2.62 4.25-0.69-0.01-5.41-1.41-10.5-3.1-5.09-1.7-10.82-3.88-16.25-6.59zm-19.58 7.23c0.23-0.24 1.13-0.44 2-0.45 0.87-0.01 4.96 1.52 9.08 3.41 4.13 1.89 10.31 4.37 13.75 5.52 3.44 1.15 7.49 2.09 9 2.08 2.52-0.01 2.81 0.38 3.42 4.75 0.37 2.62 2.05 8.25 3.75 12.51 1.69 4.26 2.86 8.65 2.58 9.75-0.27 1.1-3.54 4.71-7.25 8.02-4.07 3.64-8.24 6.41-10.5 7-2.06 0.54-3.73 1.54-3.71 2.23 0.02 0.69-5.72 4.28-12.75 7.97-7.03 3.7-13.8 6.73-15.04 6.75-1.24 0.02-3.82-1.32-5.75-2.97-3.03-2.6-3.3-3.17-1.99-4.25 1.32-1.09 1.01-2.25-2.47-9.25-2.2-4.4-4-8.67-4.01-9.5-0.01-0.82-1.6-3.86-3.53-6.75-1.92-2.89-5.19-6.94-7.26-9-2.07-2.06-5.44-5.89-11.24-13.25l6.8-9.5 8.85-0.15c5.36-0.08 12.2-1 17.35-2.32 4.68-1.2 8.69-2.37 8.92-2.6zm-61.37 37.57c0.3-0.55 0.86-0.98 1.25-0.96 0.38 0.02 1.25 0.81 1.93 1.75 0.68 0.94 2.4 3.29 3.83 5.21 1.43 1.93 2.45 4.12 2.27 4.88-0.19 0.81-2.27-0.93-5.08-4.25-2.61-3.1-4.5-6.08-4.2-6.63zm102.84 9.08c4.68-4.79 4.95-4.92 6.25-3.04 1.22 1.76 0.97 2.44-2.39 6.53-2.06 2.52-6.45 6.36-9.75 8.54-3.3 2.18-6.34 3.95-6.75 3.93-0.41-0.02-0.75-0.49-0.75-1.04 0-0.55 0.47-2.01 1.04-3.25 0.57-1.24 2.49-3.24 4.25-4.46 1.77-1.21 5.41-4.46 8.1-7.21zm-19.94 14.82c0.52-0.49 1.31-0.9 1.75-0.9 0.44 0 1.03 0.9 1.3 2 0.28 1.1-0.14 3.01-0.93 4.25-0.84 1.32-3.64 2.96-6.75 3.95-2.93 0.94-7.79 2.01-10.82 2.38-3.79 0.46-5.19 0.35-4.5-0.37 0.55-0.57 5.05-3.15 10-5.73 4.95-2.57 9.43-5.09 9.95-5.58zm-39.41 8.08c0.04-1.9 0.2-1.93 2.5-0.5 1.35 0.84 2.24 1.97 1.96 2.52-0.27 0.55-1.4 0.78-2.5 0.5-1.2-0.3-1.98-1.31-1.96-2.52zm118.55 7.27c2.06-4.54 4.17-8.25 4.69-8.25 0.52 0 1.6 2.81 2.39 6.25 0.8 3.44 4.35 12.33 7.89 19.75 3.53 7.43 6.43 13.84 6.43 14.25 0.01 0.41-3.03-0.2-6.74-1.36-3.71-1.17-8.44-2.97-10.5-4-3.05-1.53-4.02-2.78-5.18-6.64-0.79-2.61-1.72-6.32-2.07-8.25-0.52-2.78 0.11-5.18 3.09-11.75zm-92.09-0.54c2.75-0.19 5.56-0.43 6.25-0.53 0.69-0.1 1.26-0.07 1.28 0.07 0.02 0.14-0.56 1.38-1.28 2.75-0.72 1.38-1.97 3.52-2.78 4.76-0.81 1.23-1.92 2.25-2.47 2.26-0.55 0.01-2.8-1.78-5-3.98-2.99-2.99-3.62-4.11-2.5-4.48 0.83-0.28 3.75-0.66 6.5-0.85zm-23 4.85c1.65-1.4 3.56-2.56 4.25-2.56 0.69 0 1.48 0.68 1.75 1.5 0.28 0.83 0.28 2.18 0 3-0.27 0.83-0.05 1.73 0.5 2 0.55 0.28 0.98-0.29 0.96-1.25-0.03-0.96 0.65-2.31 1.5-3 1.26-1.02 2.05-0.9 4.29 0.65 1.51 1.04 3.99 3.29 8.25 8.1l-3.89 7.75c-2.15 4.26-5.52 11.91-7.5 17-1.99 5.09-3.61 10.6-3.61 12.25 0 2.67-0.33 3-3 3-1.65 0-3.3-0.56-3.66-1.25-0.37-0.69-1.72-6.54-3-13-1.29-6.46-3.24-14.34-4.35-17.5-1.1-3.16-2.04-6.35-2.09-7.08-0.05-0.74 1.41-2.62 3.25-4.19 1.84-1.57 4.7-4.01 6.35-5.42zm104.99 16.65c2.01-4.01 3.96-7.1 4.34-6.87 0.37 0.23 1.05 2.16 1.52 4.29 0.46 2.13 1.42 5 2.11 6.37 0.76 1.5 3.44 3.46 6.66 4.88 2.96 1.31 6.51 3.25 7.88 4.3 1.38 1.06 4.3 2.23 6.5 2.59 2.2 0.37 4.65 1.36 5.44 2.2 1.27 1.36 1.04 1.57-2 1.87-2.09 0.21-5.99-0.69-9.94-2.28-3.57-1.45-6.72-2.73-7-2.84-0.27-0.12-0.72 0.23-1 0.78-0.27 0.55 1.82 2.13 4.66 3.5 2.83 1.38 5.42 2.84 5.75 3.25 0.32 0.41 0.37 1.2 0.09 1.75-0.31 0.63-1.89 0.43-4.25-0.52-2.06-0.84-5.66-1.52-8-1.5-2.34 0.01-5.94-0.7-8-1.58-2.06-0.88-4.51-2.56-5.44-3.75-0.93-1.18-1.98-3.72-2.34-5.65-0.52-2.83 0.05-4.89 3.02-10.79zm-114.85-290.71c-0.43 2.2-1.88 5.91-3.22 8.25-1.33 2.34-1.97 4.25-1.42 4.25 0.55 0 1.92-1.24 3.04-2.75 1.12-1.51 2.28-4.1 2.58-5.75 0.3-1.65 0.38-4.12 0.18-5.5-0.3-2.05-0.51-1.77-1.16 1.5zm18.6 37.91c-1.8 0.6-3.11 1.54-2.92 2.09 0.19 0.55 3.24 1.05 6.76 1.1 3.53 0.05 6.53 0.5 6.66 1 0.13 0.5-2.01 0.9-4.75 0.9-2.89 0-4.85 0.42-4.66 1 0.18 0.55 1.42 1.4 2.75 1.89 1.33 0.49 3.66 0.6 5.17 0.25 1.51-0.35 3.09-1.56 3.5-2.68 0.41-1.13 1.54-2.25 2.5-2.5 0.96-0.25 1.75-0.8 1.76-1.21 0-0.41-1.91-1.26-4.25-1.89-2.34-0.63-5.38-1.12-6.76-1.09-1.37 0.02-3.97 0.54-5.76 1.14zm14.23 42.42c-1.01 1.01-1.75 2.13-1.65 2.5 0.1 0.37 1.14 0.11 2.3-0.58 1.17-0.69 3.08-1.8 4.25-2.48 2.09-1.21 2.08-1.24-0.47-1.25-1.43-0.01-3.43 0.8-4.43 1.81zm-11.98 141.35c-0.4 1.28-0.42 3.22-0.04 4.32l0.69 2c2.28-3.1 2.81-4.86 2.65-5.92-0.16-1.06-0.8-2.1-1.42-2.32-0.63-0.22-1.47 0.64-1.88 1.92z"/>%0A</svg>';
    }
  });

  // assets/exit-icon.svg
  var exit_icon_default;
  var init_exit_icon = __esm({
    "assets/exit-icon.svg"() {
      exit_icon_default = 'data:image/svg+xml,<svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">%0A%09<style>%0A%09%09.s0 { opacity: .86;fill: %23000000 } %0A%09</style>%0A%09<path id="Path 0" class="s0" d="m38 5.62c-3.02 0.82-7.52 2.59-10 3.93-2.48 1.34-7.09 5.03-10.26 8.19-3.16 3.17-6.85 7.78-8.19 10.26-1.33 2.48-3.13 7.2-3.99 10.5-0.86 3.3-1.57 8.48-1.57 11.5 0 3.02 0.7 8.2 1.57 11.5 0.86 3.3 2.85 8.25 4.43 11 1.58 2.75 5.26 7.36 8.19 10.25 2.93 2.89 8.02 6.63 11.32 8.31 3.86 1.96 8.86 3.46 14 4.19 6.04 0.87 9.59 0.86 14.5-0.02 3.58-0.64 9.2-2.51 12.5-4.14 3.3-1.64 8.37-5.37 11.27-8.29 2.91-2.91 5.27-6.09 5.25-7.05-0.01-0.96-0.48-1.75-1.04-1.75-0.56 0-3.38 2.37-6.25 5.28-2.88 2.9-7.7 6.51-10.73 8.02-3.03 1.51-8.42 3.28-12 3.93-4.99 0.9-8.12 0.9-13.5 0-3.85-0.65-9.48-2.41-12.5-3.9-3.02-1.49-7.78-4.99-10.56-7.77-2.78-2.78-6.28-7.53-7.77-10.56-1.49-3.03-3.25-8.65-3.9-12.5-0.9-5.38-0.9-8.51 0-13.5 0.65-3.58 2.41-8.98 3.9-12 1.49-3.03 4.99-7.78 7.77-10.56 2.78-2.78 7.54-6.28 10.56-7.77 3.02-1.49 8.42-3.25 12-3.9 4.99-0.9 8.12-0.9 13.5 0 3.85 0.65 9.47 2.4 12.5 3.89 3.03 1.49 7.86 5.1 10.75 8.03 2.89 2.92 5.7 5.31 6.25 5.31 0.55 0 1.01-0.79 1.02-1.75 0.02-0.96-2.34-4.11-5.25-7-2.9-2.89-7.3-6.35-9.77-7.69-2.47-1.34-7.2-3.14-10.5-4-3.3-0.86-8.7-1.54-12-1.5-3.3 0.04-8.48 0.74-11.5 1.56zm38.43 27.63c-0.4 0.76 2.02 3.89 6.2 8l6.87 6.74c-41.72 0.47-45 0.73-45 2.01 0 1.28 3.26 1.54 22.22 1.77l22.22 0.27c-12.15 12.59-13.2 14.18-12.17 15.2 1.03 1.02 3.06-0.53 10.5-7.98l9.23-9.25c-13.95-13.97-18.32-18.02-18.7-18.02-0.39 0.01-1 0.57-1.37 1.26z"/>%0A</svg>';
    }
  });

  // src/ui/canvas.js
  function drawingContext(host = globalThis) {
    const main = host === globalThis && typeof MainCanvas !== "undefined" ? MainCanvas : host.MainCanvas;
    const context = typeof main?.save === "function" ? main : main?.getContext?.("2d");
    if (!context?.canvas || typeof context.save !== "function") {
      throw new Error("Responsive_Liko: BC drawing context is unavailable");
    }
    return context;
  }
  var init_canvas = __esm({
    "src/ui/canvas.js"() {
    }
  });

  // src/ui/dom-settings.js
  function installSettings({ store, t, host = globalThis }) {
    let root, page = "home", deleteMode = false, ruleDeleteMode = false, editingPersonaId = null, selectedRuleId = null, draft = null, sessionBaseline = null, pickerGroup = "ItemHead", pickerScope = "current", pickerSelected = /* @__PURE__ */ new Set(), pickerQuery = "", pickerInput = "", pickerMode = "trigger", responseDelete = false, primaryMode = false, modal = null, filter = "all", ruleQuery = "", inlineEdit = null, notice = "", ruleScrollTop = 0;
    const esc = (v) => String(v ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
    );
    const fmt = (key, vars = {}) => Object.entries(vars).reduce((s, [k, v]) => s.replaceAll(`{${k}}`, String(v)), t(key));
    const sw = (on, small = false) => `<button class="rl-switch ${small ? "rl-small-switch" : ""} ${on ? "on" : ""}" aria-label="${esc(t(on ? "on" : "off"))}"></button>`;
    const relationButtons = (scope) => `<div class="rl-relation-buttons">${["owner", "lover", "submissive", "bcWhitelist", "friend"].map((key) => `<button data-relation="${key}" data-relation-scope="${scope}">${esc(t(`relation_${key}`))}</button>`).join("")}</div>`;
    function relationMembers(kind) {
      const p = host.Player ?? {}, numbers = [];
      if (kind === "owner") numbers.push(p.Ownership?.MemberNumber);
      if (kind === "lover") numbers.push(...(p.Lovership ?? []).map((x) => x?.MemberNumber));
      if (kind === "submissive")
        numbers.push(...[...p.SubmissivesList ?? []].map((x) => x?.MemberNumber ?? x));
      if (kind === "bcWhitelist") numbers.push(...p.WhiteList ?? []);
      if (kind === "friend") {
        numbers.push(...p.FriendList ?? []);
        if (p.FriendNames?.keys) numbers.push(...p.FriendNames.keys());
      }
      return [...new Set(numbers.map(Number).filter(Number.isSafeInteger))];
    }
    function animationGroups() {
      return ANIMATION_GROUPS.filter((group) => animationAssets(group).length);
    }
    function groupLabel(group) {
      return host.AssetGroupGet?.(host.Player?.AssetFamily, group)?.Description ?? host.AssetGroup?.find((g) => g.Name === group)?.Description ?? t(group);
    }
    let wardrobePending = false;
    function trackFor(group) {
      const current = snapshotItem(host.InventoryGet?.(host.Player, group));
      const assets = animationAssets(group);
      const state = current ?? { asset: assets[0]?.name, color: "Default" };
      return { group, stateA: clone(state), stateB: { ...clone(state), sameAsset: true } };
    }
    function animationAssets(group) {
      const found = /* @__PURE__ */ new Map();
      for (const a of host.Asset ?? [])
        if (a?.Group?.Name === group && a.Name)
          found.set(a.Name, { name: a.Name, label: a.Description || a.Name });
      return [...found.values()].sort((a, b) => a.label.localeCompare(b.label));
    }
    const active = () => store.data.personas.find((p) => p.id === editingPersonaId) ?? store.active;
    const activeRule = () => draft?.id === selectedRuleId ? draft : active().rules.find((r) => r.id === selectedRuleId);
    function editableName(name, editing, className, action) {
      return `<div class="rl-editable-name ${className}">${editing ? `<input class="rl-inline-input" data-inline-edit maxlength="100" aria-label="${esc(t("rename"))}" size="${Math.max(6, name.length + 1)}" value="${esc(name)}">` : `<span class="rl-name-text" title="${esc(name)}">${esc(name)}</span><button class="rl-icon" data-act="${action}" aria-label="${esc(t("rename"))}" title="${esc(t("rename"))}">${ICON.edit}</button>`} </div>`;
    }
    function titleBar(name = "") {
      const editing = name && inlineEdit?.type === "persona" && inlineEdit.id === active().id;
      const context = name ? editableName(name, editing, "rl-context", "editPersonaInline") : "";
      return `<header class="rl-top ${page === "rules" ? "rl-top-rules" : ""}"><div class="rl-brand"><img class="rl-brand-icon" src="${esc(preference_icon_default)}" alt="">Responsive_Liko${context}</div></header><button class="rl-exit" data-act="exit"><img src="${esc(exit_icon_default)}" alt="${esc(t("back"))}"></button>`;
    }
    function shell(body, name = "") {
      return `<style>${settings_default}</style><section class="rl-screen">${titleBar(name)}${body}${modalHtml()}${notice ? `<div class="rl-notice">${esc(notice)}</div>` : ""}</section>`;
    }
    function homeHtml() {
      const s = store.data.settings;
      const settings = ["enabled", "reactions", "mouth", "interruption", "bcx"].map(
        (k) => `<div class="rl-setting"><div class="rl-grow"><b>${esc(t(k))}</b>${k === "enabled" ? `<div class="rl-muted">${esc(t("masterHint"))}</div>` : ""}</div><span data-setting="${k}">${sw(s[k])}</span></div>`
      ).join("");
      const cards = [...store.data.personas].sort((a, b) => Number(b.id === store.data.activePersona) - Number(a.id === store.data.activePersona)).map((p) => {
        const on = p.rules.filter((r) => r.enabled).length, activeP = p.id === store.data.activePersona, rate = p.rules.length ? 100 * on / p.rules.length : 0, editing = inlineEdit?.type === "persona" && inlineEdit.id === p.id;
        return `<div class="rl-card-wrap" data-id="${esc(p.id)}"><article class="rl-card ${activeP ? "active" : ""} ${deleteMode ? "delete" : ""}">${activeP ? `<span class="rl-crown" aria-label="${esc(t("activePersona"))}">${ICON.crown}</span>` : ""}<div class="rl-card-name">${editableName(p.name, editing, "rl-name-row", "editCardInline")}<div class="rl-muted">${esc(t(activeP ? "activePersona" : "sparePersona"))}</div></div><div class="rl-meter"><div class="rl-track"><div class="rl-fill" style="width:${rate}%"></div></div><div class="rl-muted">${fmt("enabledRuleCount", { enabled: on, disabled: p.rules.length - on })}</div></div><div class="rl-count"><b>${p.rules.length}</b> ${esc(t("ruleCount"))}</div><button class="primary" data-act="openPersona">${esc(t("personaResponses"))}</button></article><button class="rl-card-side ${deleteMode ? "danger" : ""}" data-act="${deleteMode ? "deletePersona" : "selectPersona"}">${deleteMode ? ICON.trash : activeP ? "\u2713" : ""}</button></div>`;
      }).join("");
      return `<main class="rl-main"><section class="rl-panel"><div class="rl-head"><h2>${esc(t("home"))}</h2></div>${settings}</section><section class="rl-panel"><div class="rl-head"><div class="rl-grow"><h2>${esc(t("persona"))}</h2><div class="rl-muted">${esc(t("personaProgressHint"))}</div></div><div class="rl-tools"><button data-act="newPersona">${esc(t("addPersona"))}</button><button data-act="import">${esc(t("import"))}</button><button data-act="export">${esc(t("export"))}</button><button data-act="deleteMode">${esc(t(deleteMode ? "finish" : "delete"))}</button></div></div><div class="rl-personas">${cards}</div></section></main>`;
    }
    function ensureDraft() {
      if (!selectedRuleId || !active().rules.some((r) => r.id === selectedRuleId))
        selectedRuleId = active().rules[0]?.id ?? null;
      if (selectedRuleId && draft?.id !== selectedRuleId)
        draft = clone(active().rules.find((r) => r.id === selectedRuleId));
    }
    function triggerHtml(r) {
      if (r.trigger.kind === "speech")
        return `<div class="rl-field">${esc(t("speechChannel"))}</div><div class="rl-segments">${["all", "chat", "whisper"].map((v) => `<button data-trigger-value="channel" data-value="${v}" class="${r.trigger.channel === v ? "on" : ""}">${esc(t("speech_" + v))}</button>`).join("")}</div><div class="rl-field"><span>${esc(t("chance"))}</span><output data-chance-value>${r.trigger.chance ?? 100}%</output></div><input class="rl-chance-bar" type="range" min="0" max="100" step="1" aria-label="${esc(t("chance"))}" data-chance value="${r.trigger.chance ?? 100}"><div class="rl-field">${esc(t("severity"))}</div><div class="rl-segments">${["weak", "medium", "strong", "addicted"].map((v) => `<button data-trigger-value="severity" data-value="${v}" class="${r.trigger.severity === v ? "on" : ""}">${esc(t(v))}</button>`).join("")}</div><p class="rl-muted">${esc(t("speechHint"))}</p>`;
      if (r.trigger.kind === "activity")
        return `<div class="rl-summary"><b>${esc(r.trigger.groups?.join(", ") || t("allGroups"))}</b><br>${esc(r.trigger.activities?.map((a) => activityLabel(a, r.trigger.groups?.[0] || "", host)).join(", ") || t("allActivities"))}</div><button class="primary" style="margin-top:18px" data-act="picker" data-mode="trigger">${esc(t("openActionPicker"))}</button>`;
      if (r.trigger.kind === "orgasm")
        return `<div class="rl-field"><span>${esc(t("outcome"))}</span></div><div class="rl-segments">${["Any", "Orgasmed", "Ruined", "Resisted"].map((x) => `<button class="${r.trigger.outcome === x ? "on" : ""}" data-trigger-value="outcome" data-value="${x}">${esc(t(x))}</button>`).join("")}</div>`;
      if (r.trigger.kind === "spicer")
        return `<div class="rl-field"><span>${esc(t("min"))}</span><input class="rl-input rl-number" type="number" min="0" max="100" data-field="min" value="${r.trigger.min ?? 0}"></div><div class="rl-field"><span>${esc(t("max"))}</span><input class="rl-input rl-number" type="number" min="0" max="100" data-field="max" value="${r.trigger.max ?? 100}"></div>`;
      return `<div class="rl-field"><span>${esc(t("roomEvent"))}</span></div><div class="rl-segments">${["join", "leave", "slowLeave", "visitor"].map((x) => `<button class="${r.trigger.event === x ? "on" : ""}" data-trigger-value="event" data-value="${x}">${esc(t(x))}</button>`).join("")}</div><div class="rl-field"><span>${esc(t("roomScope"))}</span></div><div class="rl-segments"><button class="${r.trigger.roomMode !== "named" ? "on" : ""}" data-trigger-value="roomMode" data-value="any">${esc(t("anyRoom"))}</button><button class="${r.trigger.roomMode === "named" ? "on" : ""}" data-trigger-value="roomMode" data-value="named">${esc(t("namedRooms"))}</button></div>${r.trigger.roomMode === "named" ? `<input class="rl-input" data-field="roomNames" value="${esc(r.trigger.roomNames?.join(", ") || "")}" placeholder="${esc(t("roomNamesPlaceholder"))}">` : ""}`;
    }
    function rulesHtml() {
      ensureDraft();
      const p = active();
      const shown = p.rules.filter(
        (r2) => (filter === "all" || r2.trigger.kind === filter) && r2.name.toLowerCase().includes(ruleQuery.toLowerCase())
      );
      const list = shown.map(
        (r2) => `<div class="rl-rule ${r2.id === selectedRuleId ? "active" : ""} ${ruleDeleteMode ? "delete-active" : ""}" data-id="${esc(r2.id)}">${ruleDeleteMode ? `<button class="danger rl-rule-trash" data-act="deleteRuleRow">${ICON.trash}</button>` : ""}<button class="rl-rule-main rl-grow" data-act="selectRule"><span><b>${esc(r2.name)}</b><small>${esc(t(r2.trigger.kind))} \xB7 ${r2.choices.length} ${esc(t("responseCount"))}</small></span></button><span data-act="toggleRule">${sw(r2.enabled, true)}</span></div>`
      ).join("") || `<div class="rl-muted">${esc(t("empty"))}</div>`;
      const r = activeRule(), editingRule = r && inlineEdit?.type === "rule" && inlineEdit.id === r.id;
      let editor = `<div class="rl-muted">${esc(t("selectRuleHint"))}</div>`;
      if (r) {
        const responses = r.choices.map((c, i) => ({ c, i })).sort((a, b) => Number(!!b.c.always) - Number(!!a.c.always)).map(({ c, i }) => {
          const s = c.steps[0];
          return `<div class="rl-response ${c.always ? "rl-primary-response" : ""} ${primaryMode ? "rl-primary-pick" : ""}" ${primaryMode && r.trigger.kind !== "speech" ? `data-primary-choice="${i}" role="button" tabindex="0" aria-label="${esc(t("mainResponse"))}"` : ""}>${c.always && r.trigger.kind !== "speech" ? `<span class="rl-crown" aria-label="${esc(t("mainResponse"))}">${ICON.crown}</span>` : ""}<b>${esc(t(r.trigger.kind === "speech" ? "speech" : s.type === "activity" ? "activityStep" : s.type === "animation" ? "animationStep" : s.type))}</b><span>${esc(s.type === "activity" ? `${activityLabel(s.activity, s.group, host)} \xB7 ${s.group}` : s.type === "animation" ? `${(s.tracks ?? [{ group: s.group }]).map((x) => groupLabel(x.group)).join(" + ")} \xB7 ${s.count}\xD7 \xB7 ${s.intervalMs / 1e3}s` : s.text)}</span><button class="${responseDelete ? "danger" : ""}" data-act="${responseDelete ? "deleteResponse" : "editResponse"}" data-index="${i}">${esc(t(responseDelete ? "delete" : "edit"))}</button></div>`;
        }).join("");
        editor = `<div class="rl-head">${editableName(r.name, editingRule, "rl-inline-title", "editRuleInline")}<span class="rl-grow"></span>${ruleDeleteMode ? `<button data-act="finishRuleDelete">${esc(t("finish"))}</button>` : `<span data-act="toggleRule" data-id="${esc(r.id)}">${sw(r.enabled)}</span><button data-act="deleteRule">${esc(t("delete"))}</button>`}<button class="primary" data-act="saveRule">${esc(t("save"))}</button></div><div class="rl-editor-grid"><div class="rl-box"><h3>${esc(t("trigger"))}</h3><div class="rl-field"><span>${esc(t("type"))}</span></div><div class="rl-segments">${["activity", "orgasm", "spicer", "event", "speech"].map((x) => `<button class="${r.trigger.kind === x ? "on" : ""}" data-trigger-kind="${x}">${esc(t(x))}</button>`).join("")}</div>${triggerHtml(r)}${!supportsRuleMembers(r.trigger) ? "" : `<div class="rl-settings-group"><h3>${esc(t("ruleWhitelist"))}</h3><div class="rl-muted">${esc(t("ruleWhitelistHint"))}</div>${relationButtons("rule")}<input class="rl-input" data-field="members" value="${esc(r.trigger.members?.join(", ") || "")}" placeholder="${esc(t("memberNumbersPlaceholder"))}"></div>`}</div><div class="rl-box"><div class="rl-response-head"><h3 class="rl-grow">${esc(t(r.trigger.kind === "speech" ? "speechList" : "responses"))}</h3>${r.trigger.kind === "speech" ? "" : `<button data-act="primaryMode" class="${primaryMode ? "primary" : ""}">${esc(t(primaryMode ? "finish" : "mainResponse"))}</button><span class="rl-response-gap"></span>`}<button data-act="newText">\uFF0B ${esc(t(r.trigger.kind === "speech" ? "speech" : "textStep"))}</button>${r.trigger.kind === "speech" ? "" : `<button data-act="picker" data-mode="response">\uFF0B ${esc(t("activityStep"))}</button><button data-act="newAnimation">\uFF0B ${esc(t("animationStep"))}</button>`}<button class="rl-response-delete" data-act="responseDelete">${esc(t(responseDelete ? "finish" : "delete"))}</button></div>${responses}</div></div>`;
      }
      return `<main class="rl-work"><aside class="rl-panel rl-browser"><div class="rl-head"><button class="primary rl-grow" data-act="newRule">\uFF0B ${esc(t("addRule"))}</button><button data-act="lists">${esc(t("listSettings"))}</button></div><input class="rl-search" data-rule-search value="${esc(ruleQuery)}" placeholder="${esc(t("searchRules"))}"><div class="rl-cats">${[
        ["all", "all"],
        ["activity", "activity"],
        ["orgasm", "orgasm"],
        ["spicer", "spicer"],
        ["event", "event"],
        ["speech", "speech"]
      ].map(([v, k]) => `<button class="${filter === v ? "on" : ""}" data-filter="${v}">${esc(t(k))}</button>`).join(
        ""
      )}</div><div class="rl-rule-list">${list}</div></aside><section class="rl-panel rl-editor">${editor}</section></main>`;
    }
    const picker = createActivityPicker({ host });
    let pickerSearch;
    function pickerRows() {
      const scope = pickerScope === "all" ? "all" : canonicalGroup(pickerGroup);
      picker.select(
        modal,
        scope,
        () => {
          pickerSearch = picker.search;
          updatePickerResults();
          root?.querySelectorAll('[data-act="selectAll"],[data-act="confirmPicker"]').forEach((b) => b.disabled = false);
        },
        (error) => {
          const el = root?.querySelector(".rl-actions");
          if (el) el.textContent = String(error.message || error);
        }
      );
      pickerSearch = picker.search;
      return pickerSearch ? pickerSearch(pickerQuery) : [];
    }
    function pickerActions(rows) {
      if (!pickerSearch) return `<div class="rl-muted" role="status">${esc(t("loadingActivities"))}</div>`;
      return rows.map((a) => {
        const key = `${a.group}|${a.name}`;
        return `<button class="rl-action ${pickerSelected.has(key) ? "on" : ""}" data-action="${esc(key)}"><strong>${esc(a.label)}</strong><small>${esc(a.name)}</small></button>`;
      }).join("") || `<div class="rl-muted">${esc(t("noAvailableActivities"))}</div>`;
    }
    function updatePickerResults() {
      const rows = pickerRows(), container = root?.querySelector(".rl-actions");
      if (!container || !pickerSearch) return;
      if (container._pickerSearch !== pickerSearch) {
        const all = pickerSearch("");
        container.innerHTML = (all.length ? pickerActions(all) : "") + '<div class="rl-muted" data-picker-empty>' + esc(t("noAvailableActivities")) + "</div>";
        container._pickerSearch = pickerSearch;
        container._pickerCards = [...container.querySelectorAll("[data-action]")];
        container.onclick = (event) => {
          const b = event.target.closest("[data-action]");
          if (!b || !container.contains(b)) return;
          pickerSelected.has(b.dataset.action) ? pickerSelected.delete(b.dataset.action) : pickerSelected.add(b.dataset.action);
          b.classList.toggle("on", pickerSelected.has(b.dataset.action));
          const count = root.querySelector("[data-picker-count]");
          if (count) count.textContent = fmt("selectedActivityCount", { count: pickerSelected.size });
        };
      }
      const visible = new Set(rows.map((a) => a.group + "|" + a.name));
      for (const b of container._pickerCards) b.hidden = !visible.has(b.dataset.action);
      container.querySelector("[data-picker-empty]").style.display = rows.length ? "none" : "";
      container.scrollTop = 0;
    }
    function animationModalBody() {
      return `<div class="rl-segments">${animationGroups().map(
        (g) => `<button data-animation-group="${g}" class="${modal.tracks.some((x) => x.group === g) ? "on" : ""}">${esc(groupLabel(g))}</button>`
      ).join("")}</div><div class="rl-animation-tracks">${modal.tracks.map(
        (track, i) => `<div class="rl-settings-group rl-animation-track"><h3>${esc(groupLabel(track.group))}</h3>${[
          "A",
          "B"
        ].map(
          (state) => `<div class="rl-field"><span>${esc(t("animationState" + state))}</span><select class="rl-select" data-track="${i}" data-state="${state}">${state === "B" ? `<option value="__same__" ${track.stateB.sameAsset ? "selected" : ""}>${esc(t("sameClothing"))}</option>` : ""}${animationAssets(
            track.group
          ).map(
            (a) => `<option value="${esc(a.name)}" ${!(state === "B" && track.stateB.sameAsset) && a.name === track["state" + state].asset ? "selected" : ""}>${esc(a.label)}</option>`
          ).join(
            ""
          )}</select><button data-wardrobe="${i}" data-state="${state}">${esc(t("editAppearance"))}</button></div>`
        ).join("")}</div>`
      ).join(
        ""
      )}</div><div class="rl-animation-grid"><span>${esc(t("animationCount"))}</span><input class="rl-input rl-number" type="number" min="1" max="100" data-animation-field="count" value="${modal.count}"><span>${esc(t("animationSeconds"))}</span><input class="rl-input rl-number" type="number" min="0.001" max="120" step="0.001" data-animation-seconds value="${modal.intervalMs / 1e3}"></div><div class="rl-animation-message"><div class="rl-muted">${esc(t("animationMessageHint"))}</div><div class="rl-choice-row">${["chat", "emote", "action"].map((x) => `<button class="${modal.messageType === x ? "on" : ""}" data-animation-message-type="${x}">${esc(t(x))}</button>`).join("")}</div><textarea class="rl-textarea" style="height:90px" data-animation-field="text">${esc(modal.text)}</textarea><div class="rl-tools"><button data-animation-token="{Self}">${esc(t("insertSelfName"))}</button><button data-animation-token="{Other}">${esc(t("insertOtherName"))}</button></div></div>`;
    }
    function pickerHtml() {
      const zones = bodyZones(host.Player, host), rows = pickerRows();
      const zoneHtml = zones.map(({ group, zone }) => {
        const [x, y, w, h] = zone;
        return `<button class="rl-zone ${group === pickerGroup ? "selected" : ""}" data-group="${group}" aria-label="${esc(groupLabel(group))}" title="${esc(groupLabel(group))}" style="left:${x / 5}%;top:${y / 10}%;width:${w / 5}%;height:${h / 10}%"></button>`;
      }).join("");
      const actions = pickerSearch ? "" : pickerActions(rows);
      return `<div class="rl-overlay"><section class="rl-dialog"><div class="rl-picker-head"><h2>${esc(t("chooseActivity"))}</h2><div class="rl-picker-controls"><select class="rl-select rl-picker-scope" data-picker-scope><option value="current" ${pickerScope === "current" ? "selected" : ""}>${esc(t("currentArea"))}</option><option value="all" ${pickerScope === "all" ? "selected" : ""}>${esc(t("allAreas"))}</option></select><div class="rl-action-search"><input class="rl-input" data-action-search value="${esc(pickerInput)}" placeholder="${esc(t("searchActivities"))}"></div><button data-act="searchActivities">${esc(t("searchButton"))}</button><span class="rl-grow"></span><button data-act="selectAll" ${!pickerSearch ? "disabled" : ""}>${esc(t("selectAll"))}</button><button data-act="clearAll">${esc(t("clearAll"))}</button></div></div><div class="rl-dialog-body rl-picker-body"><div class="rl-body-map">${zoneHtml}</div><div class="rl-actions-wrap"><div class="rl-actions-title">${pickerScope === "all" ? esc(t("allAreaActivities")) : fmt("availableForGroup", { group: esc(groupLabel(pickerGroup)) })}</div><div class="rl-actions">${actions}</div></div></div><div class="rl-dialog-foot"><span class="rl-grow rl-muted" data-picker-count>${fmt("selectedActivityCount", { count: pickerSelected.size })}</span><button class="primary" data-act="confirmPicker" ${!pickerSearch ? "disabled" : ""}>${esc(t("confirmAdd"))}</button><button data-act="closeModal">${esc(t("cancel"))}</button></div></section></div>`;
    }
    function modalHtml() {
      if (!modal) return "";
      if (modal.type === "picker") return pickerHtml();
      if (modal.type === "unsaved")
        return `<div class="rl-overlay"><section class="rl-dialog compact"><div class="rl-dialog-head"><h2>${esc(t("unsavedTitle"))}</h2></div><div class="rl-dialog-body"><p>${esc(t("unsavedMessage"))}</p></div><div class="rl-dialog-foot"><span class="rl-grow"></span><button class="primary" data-act="saveExit">${esc(t("saveExit"))}</button><button data-act="discardExit">${esc(t("discardExit"))}</button><button data-act="closeModal">${esc(t("cancel"))}</button></div></section></div>`;
      const titles = {
        name: modal.mode === "new" ? t("addPersona") : modal.mode === "rule" ? t("renameRule") : t("rename"),
        confirm: t("confirmDelete"),
        transfer: t(modal.mode),
        text: t(modal.index == null ? "newTextResponse" : "editTextResponse"),
        animation: t(modal.index == null ? "newAnimationResponse" : "editAnimationResponse"),
        lists: t("listSettings")
      };
      let body = "";
      if (modal.type === "name") body = `<input class="rl-input" data-modal-value value="${esc(modal.value)}">`;
      if (modal.type === "confirm") body = `<p>${esc(modal.message)}</p>`;
      if (modal.type === "transfer")
        body = `<div class="rl-transfer-field"><textarea class="rl-textarea" data-modal-value ${modal.mode === "export" ? "readonly" : ""}>${esc(modal.value)}</textarea><div class="rl-tools rl-transfer-tools"><button data-clipboard="${modal.mode}">${ICON[modal.mode === "export" ? "copy" : "paste"]}${esc(t(modal.mode === "export" ? "copyText" : "pasteText"))}</button><span class="rl-muted" data-clipboard-status role="status"></span></div></div>`;
      if (modal.type === "text")
        body = `<div class="rl-choice-row">${(draft?.trigger.kind === "speech" ? ["chat"] : ["chat", "emote", "action"]).map((x) => `<button class="${modal.responseType === x ? "on" : ""}" data-response-type="${x}">${esc(t(x))}</button>`).join("")}</div><textarea class="rl-textarea" style="margin-top:18px" data-modal-value>${esc(modal.value)}</textarea><div class="rl-tools" style="margin-top:12px"><button data-token="{Self}">${esc(t("insertSelfName"))}</button><button data-token="{Other}">${esc(t("insertOtherName"))}</button></div>`;
      if (modal.type === "text" && draft?.trigger.kind === "speech") {
        titles.text = t(modal.index == null ? "newSpeech" : "editSpeech");
        body = `<textarea class="rl-textarea" data-modal-value>${esc(modal.value)}</textarea>`;
      }
      if (modal.type === "animation") body = animationModalBody();
      if (modal.type === "lists") {
        const key = modal.listMode === "whitelist" ? "white" : "black", value = key === "white" ? modal.white : modal.black;
        body = `<div class="rl-settings-group"><h3>${esc(t("interactionTargets"))}</h3><div class="rl-segments"><button class="${modal.listMode === "whitelist" ? "on" : ""}" data-list-mode="whitelist">${esc(t("onlyWhitelist"))}</button><button class="${modal.listMode === "blacklist" ? "on" : ""}" data-list-mode="blacklist">${esc(t("onlyBlacklist"))}</button></div></div><div class="rl-settings-group"><h3>${esc(t(key === "white" ? "whiteList" : "blackList"))}</h3><div class="rl-muted">${esc(t(key === "white" ? "whiteListHint" : "blackListHint"))}</div>${relationButtons("persona")}<div class="rl-list-entry"><input class="rl-input" data-list="${key}" value="${esc(value)}" placeholder="${esc(t("memberNumbersPlaceholder"))}"><button data-act="normalizeList">\uFF0B</button></div></div>`;
      }
      return `<div class="rl-overlay"><section class="rl-dialog compact ${modal.type === "animation" ? "rl-animation-dialog" : ""}"><div class="rl-dialog-head"><h2 class="rl-grow">${esc(titles[modal.type])}</h2><button data-act="closeModal">${ICON.close}</button></div><div class="rl-dialog-body">${modal.error ? `<p role="alert">${esc(modal.error)}</p>` : ""}${body}</div><div class="rl-dialog-foot"><span class="rl-grow"></span>${modal.mode === "export" ? "" : `<button class="primary" data-act="confirmModal">${esc(t("save"))}</button>`}<button data-act="closeModal">${esc(t("cancel"))}</button></div></section></div>`;
    }
    function render() {
      if (!root) return;
      if (modal?.type !== "picker") picker.reset();
      const oldRuleList = root.querySelector(".rl-rule-list");
      if (oldRuleList) ruleScrollTop = oldRuleList.scrollTop;
      root.innerHTML = shell(page === "home" ? homeHtml() : rulesHtml(), page === "rules" ? active().name : "");
      const newRuleList = root.querySelector(".rl-rule-list");
      if (newRuleList) newRuleList.scrollTop = ruleScrollTop;
      bind();
      if (modal?.type === "picker") updatePickerResults();
      position();
      const inline = root.querySelector("[data-inline-edit]");
      if (inline) {
        inline.focus();
        inline.select();
      }
    }
    function bindDragScroll(element) {
      let pointer = null, startX = 0, startY = 0, left = 0, top = 0, dragging = false;
      element.onpointerdown = (e) => {
        if (e.button !== 0 || e.target.closest("input,textarea,select")) return;
        const tracks = e.target.closest(".rl-animation-tracks"), trackScroll = tracks && (tracks.scrollWidth > tracks.clientWidth || tracks.scrollHeight > tracks.clientHeight);
        if (tracks && (element !== tracks && trackScroll || element === tracks && !trackScroll)) return;
        pointer = e.pointerId;
        startX = e.clientX;
        startY = e.clientY;
        left = element.scrollLeft;
        top = element.scrollTop;
        dragging = false;
      };
      element.onpointermove = (e) => {
        if (e.pointerId !== pointer) return;
        const dx = e.clientX - startX, dy = e.clientY - startY;
        if (!dragging && Math.hypot(dx, dy) > 12) {
          dragging = true;
          element.classList.add("rl-dragging");
          element.setPointerCapture?.(pointer);
        }
        if (dragging) {
          element.scrollLeft = left - dx;
          element.scrollTop = top - dy;
          e.preventDefault();
        }
      };
      const finish = (e) => {
        if (e.pointerId !== pointer) return;
        const wasDragging = dragging;
        if (wasDragging) element.releasePointerCapture?.(pointer);
        pointer = null;
        dragging = false;
        element.classList.remove("rl-dragging");
        if (wasDragging)
          element.addEventListener(
            "click",
            (event) => {
              event.preventDefault();
              event.stopImmediatePropagation();
            },
            { capture: true, once: true }
          );
      };
      element.onpointerup = finish;
      element.onpointercancel = finish;
      element.onpointerleave = () => {
        if (!dragging) pointer = null;
      };
    }
    function contentOf(p, overlay = draft) {
      const rules = p.rules.map((r) => overlay?.id === r.id ? overlay : r);
      return {
        name: p.name,
        rules: rules.map((r) => ({
          id: r.id,
          name: r.name,
          enabled: r.enabled,
          trigger: r.trigger,
          dedupeMs: r.dedupeMs,
          delayMs: r.delayMs,
          choices: r.choices
        }))
      };
    }
    function dirty() {
      return !!sessionBaseline && JSON.stringify(contentOf(active())) !== JSON.stringify(sessionBaseline);
    }
    function commitDraft() {
      if (!draft) return;
      store.update((d) => {
        const p = d.personas.find((x) => x.id === active().id), i = p.rules.findIndex((x) => x.id === draft.id);
        p.rules[i] = clone(draft);
      });
      draft = clone(active().rules.find((r) => r.id === selectedRuleId));
    }
    let noticeTimer;
    function flash(key) {
      clearTimeout(noticeTimer);
      notice = t(key);
      render();
      noticeTimer = setTimeout(() => {
        notice = "";
        render();
      }, 1600);
    }
    function parseMembers(value) {
      return [
        ...new Set(
          value.split(",").map((x) => x.trim()).filter(Boolean).map(Number).filter((x) => Number.isSafeInteger(x) && x >= 0)
        )
      ];
    }
    function bind() {
      bindResponseControls();
      bindPersonaControls();
      bindRuleControls();
      bindPickerControls();
      bindResponseEditors();
      bindDialogControls();
      bindClearableInputs(root, host, t("clearText"));
    }
    function bindResponseControls() {
      root.querySelectorAll("[data-animation-field]").forEach(
        (el) => el.oninput = () => {
          modal[el.dataset.animationField] = el.dataset.animationField === "count" ? Number(el.value) : el.value;
        }
      );
      root.querySelectorAll('[data-act="primaryMode"]').forEach(
        (b) => b.onclick = () => {
          primaryMode = !primaryMode;
          responseDelete = false;
          render();
        }
      );
      root.querySelectorAll("[data-primary-choice]").forEach((b) => {
        const choose = () => {
          const choice2 = draft.choices[Number(b.dataset.primaryChoice)], value = !choice2.always;
          draft.choices.forEach((c) => delete c.always);
          if (value) choice2.always = true;
          primaryMode = false;
          render();
        };
        b.onclick = (e) => {
          if (!e.target.closest("button")) choose();
        };
        b.onkeydown = (e) => {
          if (e.target === b && ["Enter", " "].includes(e.key)) {
            e.preventDefault();
            choose();
          }
        };
      });
      const chance = root.querySelector("[data-chance]");
      if (chance)
        chance.oninput = () => {
          draft.trigger.chance = Number(chance.value);
          root.querySelector("[data-chance-value]").textContent = chance.value + "%";
        };
      root.querySelectorAll("[data-animation-group]").forEach(
        (b) => b.onclick = () => {
          const g = b.dataset.animationGroup, i = modal.tracks.findIndex((x) => x.group === g);
          if (i < 0) modal.tracks.push(trackFor(g));
          else modal.tracks.splice(i, 1);
          render();
        }
      );
      root.querySelectorAll("[data-track]").forEach(
        (el) => el.onchange = () => {
          const track = modal.tracks[Number(el.dataset.track)], state = el.dataset.state;
          if (state === "B" && el.value === "__same__")
            track.stateB = { ...track.stateB, asset: track.stateA.asset, sameAsset: true };
          else {
            track["state" + state] = { asset: el.value, color: "Default" };
            if (state === "A" && track.stateB.sameAsset) track.stateB.asset = el.value;
          }
          render();
        }
      );
      const seconds = root.querySelector("[data-animation-seconds]");
      if (seconds)
        seconds.oninput = seconds.onchange = () => {
          modal.intervalMs = Number(seconds.value) * 1e3;
        };
      root.querySelectorAll("[data-wardrobe]").forEach(
        (b) => b.onclick = async () => {
          const track = modal.tracks[Number(b.dataset.wardrobe)], state = "state" + b.dataset.state;
          wardrobePending = true;
          root.style.display = "none";
          try {
            await editAppearanceState(host, track.group, animationState(track, b.dataset.state), (saved) => {
              if (saved) {
                const same = state === "stateB" && track.stateB.sameAsset && saved.asset === track.stateA.asset;
                track[state] = { ...saved, ...same ? { sameAsset: true } : {} };
                if (state === "stateA" && track.stateB.sameAsset) track.stateB.asset = saved.asset;
              }
              wardrobePending = false;
              if (!root) {
                root = host.document.createElement("div");
                root.className = "rl-root";
                host.document.body.appendChild(root);
              }
              root.style.display = "";
              render();
            });
          } catch (error) {
            wardrobePending = false;
            if (root) root.style.display = "";
            modal.error = String(error.message);
            render();
          }
        }
      );
    }
    function bindPersonaControls() {
      root.querySelectorAll(".rl-box,.rl-rule-list,.rl-animation-tracks,.rl-animation-dialog .rl-dialog-body").forEach(bindDragScroll);
      root.querySelectorAll('[data-act="exit"]').forEach(
        (b) => b.onclick = () => {
          if (page === "home") host.PreferenceSubscreenExtensionsClear?.();
          else if (dirty()) {
            modal = { type: "unsaved" };
            render();
          } else {
            page = "home";
            draft = null;
            sessionBaseline = null;
            render();
          }
        }
      );
      root.querySelectorAll("[data-setting]").forEach(
        (w) => w.onclick = () => {
          store.update((d) => d.settings[w.dataset.setting] = !d.settings[w.dataset.setting]);
          render();
        }
      );
      root.querySelectorAll('[data-act="deleteMode"]').forEach(
        (b) => b.onclick = () => {
          deleteMode = !deleteMode;
          render();
        }
      );
      root.querySelectorAll('[data-act="selectPersona"]').forEach(
        (b) => b.onclick = () => {
          const id = b.closest(".rl-card-wrap").dataset.id;
          store.update((d) => d.activePersona = id);
          render();
        }
      );
      root.querySelectorAll('[data-act="openPersona"]').forEach(
        (b) => b.onclick = () => {
          const id = b.closest(".rl-card-wrap").dataset.id;
          editingPersonaId = id;
          selectedRuleId = null;
          draft = null;
          sessionBaseline = clone(contentOf(active(), null));
          page = "rules";
          render();
        }
      );
      root.querySelectorAll('[data-act="editCardInline"]').forEach(
        (b) => b.onclick = () => {
          inlineEdit = { type: "persona", id: b.closest(".rl-card-wrap").dataset.id };
          render();
        }
      );
      root.querySelectorAll('[data-act="editPersonaInline"]').forEach(
        (b) => b.onclick = () => {
          inlineEdit = { type: "persona", id: active().id };
          render();
        }
      );
      root.querySelectorAll('[data-act="editRuleInline"]').forEach(
        (b) => b.onclick = () => {
          inlineEdit = { type: "rule", id: selectedRuleId };
          render();
        }
      );
      const inline = root.querySelector("[data-inline-edit]");
      if (inline) {
        let handled = false;
        const finish = (save) => {
          if (handled) return;
          handled = true;
          const value = inline.value.trim();
          if (save && value) {
            if (inlineEdit.type === "rule") draft.name = value;
            else store.update((d) => d.personas.find((p) => p.id === inlineEdit.id).name = value);
          }
          inlineEdit = null;
          render();
        };
        inline.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            finish(true);
          } else if (e.key === "Escape") {
            e.preventDefault();
            finish(false);
          }
        };
        inline.onblur = () => finish(true);
      }
      root.querySelectorAll('[data-act="renameCard"]').forEach((b) => {
        b.onclick = () => {
          const id = b.closest(".rl-card-wrap").dataset.id, p = store.data.personas.find((x) => x.id === id);
          modal = { type: "name", mode: "persona", id, value: p.name };
          render();
        };
      });
      root.querySelectorAll('[data-act="renamePersona"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "name", mode: "persona", id: active().id, value: active().name };
          render();
        }
      );
      root.querySelectorAll('[data-act="newPersona"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "name", mode: "new", value: t("newPersonaDefault") };
          render();
        }
      );
      root.querySelectorAll('[data-act="deletePersona"]').forEach((b) => {
        b.onclick = () => {
          if (store.data.personas.length <= 1) return;
          modal = {
            type: "confirm",
            mode: "persona",
            id: b.closest(".rl-card-wrap").dataset.id,
            message: t("removePersonaConfirm")
          };
          render();
        };
      });
      root.querySelectorAll('[data-act="import"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "transfer", mode: "import", value: "" };
          render();
        }
      );
      root.querySelectorAll('[data-act="export"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "transfer", mode: "export", value: exportPersona(active(), host.LZString) };
          render();
        }
      );
    }
    function bindRuleControls() {
      root.querySelectorAll("[data-filter]").forEach(
        (b) => b.onclick = () => {
          filter = b.dataset.filter;
          render();
        }
      );
      const rs = root.querySelector("[data-rule-search]");
      if (rs)
        rs.oninput = () => {
          ruleQuery = rs.value;
          render();
        };
      root.querySelectorAll('[data-act="selectRule"]').forEach(
        (b) => b.onclick = () => {
          if (dirty()) commitDraft();
          primaryMode = false;
          selectedRuleId = b.closest(".rl-rule").dataset.id;
          draft = null;
          render();
        }
      );
      root.querySelectorAll('[data-act="toggleRule"]').forEach(
        (w) => w.onclick = (e) => {
          e.stopPropagation();
          const id = w.dataset.id || w.closest(".rl-rule").dataset.id;
          if (draft?.id === id) draft.enabled = !draft.enabled;
          store.update((d) => {
            const r = d.personas.find((p) => p.id === active().id).rules.find((x) => x.id === id);
            r.enabled = !r.enabled;
          });
          draft = null;
          render();
        }
      );
      root.querySelectorAll('[data-act="newRule"]').forEach(
        (b) => b.onclick = () => {
          if (dirty()) commitDraft();
          const r = rule();
          r.name = t("newRule");
          store.update((d) => d.personas.find((p) => p.id === active().id).rules.push(r));
          selectedRuleId = r.id;
          draft = null;
          render();
        }
      );
      root.querySelectorAll('[data-act="deleteRule"]').forEach(
        (b) => b.onclick = () => {
          ruleDeleteMode = true;
          render();
        }
      );
      root.querySelectorAll('[data-act="finishRuleDelete"]').forEach(
        (b) => b.onclick = () => {
          ruleDeleteMode = false;
          render();
        }
      );
      root.querySelectorAll('[data-act="deleteRuleRow"]').forEach(
        (b) => b.onclick = (e) => {
          e.stopPropagation();
          modal = {
            type: "confirm",
            mode: "rule",
            id: b.closest(".rl-rule").dataset.id,
            message: t("removeConfirm")
          };
          render();
        }
      );
      root.querySelectorAll('[data-act="renameRule"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "name", mode: "rule", id: selectedRuleId, value: draft.name };
          render();
        }
      );
      root.querySelectorAll('[data-act="saveRule"]').forEach(
        (b) => b.onclick = () => {
          commitDraft();
          sessionBaseline = clone(contentOf(active(), null));
          flash("saved");
        }
      );
      root.querySelectorAll("[data-trigger-kind]").forEach(
        (b) => b.onclick = () => {
          const v = b.dataset.triggerKind;
          primaryMode = false;
          if (v === "speech")
            draft.choices = draft.choices.map((c) => ({
              id: c.id,
              steps: c.steps.filter((s) => ["chat", "emote", "action"].includes(s.type)).map((s) => ({ type: "chat", text: s.text }))
            })).filter((c) => c.steps.length);
          draft.trigger = {
            kind: v,
            members: [],
            ...v === "activity" ? { activities: [], groups: [], self: false } : v === "orgasm" ? { outcome: "Any" } : v === "spicer" ? { min: 0, max: 100 } : v === "speech" ? { channel: "all", chance: 100, severity: "weak" } : { event: "join", roomMode: "any", roomNames: [] }
          };
          render();
        }
      );
      root.querySelectorAll("[data-trigger-value]").forEach(
        (b) => b.onclick = () => {
          draft.trigger[b.dataset.triggerValue] = b.dataset.value;
          render();
        }
      );
      root.querySelectorAll("[data-field]").forEach(
        (el) => el.onchange = () => {
          const k = el.dataset.field, v = el.value;
          if (k === "kind") {
            draft.trigger = {
              kind: v,
              members: [],
              ...v === "activity" ? { activities: [], groups: [], self: false } : v === "orgasm" ? { outcome: "Any" } : v === "spicer" ? { min: 0, max: 100 } : v === "speech" ? { channel: "all", chance: 100, severity: "weak" } : { event: "join", roomMode: "any", roomNames: [] }
            };
          } else if (["min", "max", "chance"].includes(k)) {
            draft.trigger[k] = Math.max(0, Math.min(100, Number(v) || 0));
            el.value = draft.trigger[k];
            return;
          } else if (k === "members") draft.trigger.members = parseMembers(v);
          else if (k === "roomNames")
            draft.trigger.roomNames = v.split(",").map((x) => x.trim()).filter(Boolean);
          else draft.trigger[k] = v;
          render();
        }
      );
    }
    function bindPickerControls() {
      root.querySelectorAll('[data-act="picker"]').forEach(
        (b) => b.onclick = () => {
          pickerMode = b.dataset.mode;
          pickerScope = "current";
          pickerSelected = /* @__PURE__ */ new Set();
          pickerQuery = "";
          pickerInput = "";
          modal = { type: "picker" };
          render();
        }
      );
      const ps = root.querySelector("[data-picker-scope]");
      if (ps)
        ps.onchange = () => {
          pickerScope = ps.value;
          pickerQuery = pickerInput;
          render();
        };
      root.querySelectorAll("[data-group]").forEach(
        (b) => b.onclick = () => {
          pickerGroup = b.dataset.group;
          pickerScope = "current";
          pickerQuery = pickerInput;
          render();
        }
      );
      const as = root.querySelector("[data-action-search]");
      if (as) {
        as.oninput = (e) => {
          pickerInput = as.value;
          if (e.isComposing) return;
          pickerQuery = pickerInput;
          updatePickerResults();
        };
        as.oncompositionend = () => {
          pickerInput = as.value;
          pickerQuery = pickerInput;
          updatePickerResults();
        };
        as.onkeydown = (e) => {
          if (e.key === "Enter" && !e.isComposing) {
            pickerInput = as.value;
            pickerQuery = pickerInput;
            updatePickerResults();
          }
        };
      }
      root.querySelectorAll('[data-act="searchActivities"]').forEach(
        (b) => b.onclick = () => {
          pickerInput = as?.value ?? pickerInput;
          pickerQuery = pickerInput;
          updatePickerResults();
        }
      );
      root.querySelectorAll('[data-act="selectAll"]').forEach(
        (b) => b.onclick = () => {
          pickerRows().forEach((a) => pickerSelected.add(`${a.group}|${a.name}`));
          render();
        }
      );
      root.querySelectorAll('[data-act="clearAll"]').forEach(
        (b) => b.onclick = () => {
          pickerSelected.clear();
          render();
        }
      );
      root.querySelectorAll('[data-act="confirmPicker"]').forEach(
        (b) => b.onclick = () => {
          const picked = [...pickerSelected].map((k) => {
            const i = k.indexOf("|");
            return { group: k.slice(0, i), activity: k.slice(i + 1) };
          });
          if (pickerMode === "trigger") {
            draft.trigger.groups = [...new Set(picked.map((x) => x.group))];
            draft.trigger.activities = [...new Set(picked.map((x) => x.activity))];
          } else if (pickerMode === "responseEdit" && modal.responseIndex != null && picked[0]) {
            const old = draft.choices[modal.responseIndex];
            draft.choices[modal.responseIndex] = {
              id: old.id,
              always: old.always ?? false,
              steps: [{ type: "activity", ...picked[0] }]
            };
          } else
            picked.forEach((x) => draft.choices.push({ id: uid(), steps: [{ type: "activity", ...x }] }));
          modal = null;
          render();
        }
      );
    }
    function bindResponseEditors() {
      root.querySelectorAll('[data-act="newText"]').forEach(
        (b) => b.onclick = () => {
          modal = { type: "text", index: null, responseType: "chat", value: "" };
          render();
        }
      );
      root.querySelectorAll('[data-act="newAnimation"]').forEach(
        (b) => b.onclick = () => {
          const group = animationGroups()[0];
          if (!group) return;
          modal = {
            type: "animation",
            index: null,
            tracks: [trackFor(group)],
            count: 6,
            intervalMs: 200,
            messageType: "emote",
            text: ""
          };
          render();
        }
      );
      root.querySelectorAll('[data-act="editResponse"]').forEach(
        (b) => b.onclick = () => {
          const i = Number(b.dataset.index), s = draft.choices[i].steps[0];
          if (s.type === "activity") {
            pickerMode = "responseEdit";
            pickerSelected = /* @__PURE__ */ new Set([`${s.group}|${s.activity}`]);
            modal = { type: "picker", responseIndex: i };
            render();
          } else if (s.type === "animation") {
            modal = { type: "animation", index: i, ...clone(s) };
            modal.tracks ??= [
              {
                group: s.group,
                stateA: {
                  asset: s.assetA,
                  color: snapshotItem(host.InventoryGet?.(host.Player, s.group))?.color ?? "Default"
                },
                stateB: {
                  asset: s.assetB,
                  color: snapshotItem(host.InventoryGet?.(host.Player, s.group))?.color ?? "Default"
                }
              }
            ];
            render();
          } else {
            modal = { type: "text", index: i, responseType: s.type, value: s.text };
            render();
          }
        }
      );
      root.querySelectorAll('[data-act="responseDelete"]').forEach(
        (b) => b.onclick = () => {
          responseDelete = !responseDelete;
          primaryMode = false;
          render();
        }
      );
      root.querySelectorAll('[data-act="deleteResponse"]').forEach((b) => {
        b.onclick = () => {
          draft.choices.splice(Number(b.dataset.index), 1);
          render();
        };
      });
      root.querySelectorAll('[data-act="lists"]').forEach(
        (b) => b.onclick = () => {
          modal = {
            type: "lists",
            listMode: active().listMode ?? "blacklist",
            white: active().whiteList.join(", "),
            black: active().blackList.join(", ")
          };
          render();
        }
      );
      root.querySelectorAll("[data-list-mode]").forEach(
        (b) => b.onclick = () => {
          const input = root.querySelector("[data-list]");
          if (input) modal[input.dataset.list] = input.value;
          modal.listMode = b.dataset.listMode;
          render();
        }
      );
      root.querySelectorAll("[data-relation]").forEach(
        (b) => b.onclick = () => {
          const ids = relationMembers(b.dataset.relation);
          if (b.dataset.relationScope === "rule") {
            draft.trigger.members = [.../* @__PURE__ */ new Set([...draft.trigger.members ?? [], ...ids])];
          } else {
            const input = root.querySelector("[data-list]"), key = input?.dataset.list ?? (modal.listMode === "whitelist" ? "white" : "black");
            modal[key] = [.../* @__PURE__ */ new Set([...parseMembers(input?.value ?? modal[key]), ...ids])].join(", ");
          }
          render();
        }
      );
      root.querySelectorAll('[data-act="normalizeList"]').forEach(
        (b) => b.onclick = () => {
          const input = root.querySelector("[data-list]");
          if (input) {
            modal[input.dataset.list] = parseMembers(input.value).join(", ");
            render();
          }
        }
      );
      const captureAnimation = () => root.querySelectorAll("[data-animation-field]").forEach((el) => {
        modal[el.dataset.animationField] = ["count", "intervalMs"].includes(el.dataset.animationField) ? Number(el.value) : el.value;
      });
      root.querySelectorAll("[data-animation-field]").forEach(
        (el) => el.onchange = () => {
          captureAnimation();
        }
      );
      root.querySelectorAll("[data-animation-message-type]").forEach(
        (b) => b.onclick = () => {
          captureAnimation();
          modal.messageType = b.dataset.animationMessageType;
          render();
        }
      );
      root.querySelectorAll("[data-animation-token]").forEach(
        (b) => b.onclick = () => {
          const el = root.querySelector('[data-animation-field="text"]');
          el.value += b.dataset.animationToken;
          modal.text = el.value;
        }
      );
      root.querySelectorAll("[data-response-type]").forEach(
        (b) => b.onclick = () => {
          modal.responseType = b.dataset.responseType;
          modal.value = root.querySelector("[data-modal-value]").value;
          render();
        }
      );
      root.querySelectorAll("[data-token]").forEach(
        (b) => b.onclick = () => {
          const el = root.querySelector("[data-modal-value]");
          el.value += b.dataset.token;
        }
      );
    }
    function bindDialogControls() {
      root.querySelectorAll("[data-clipboard]").forEach((button) => {
        button.onclick = async () => {
          const current = modal, field = root.querySelector("[data-modal-value]");
          const status = root.querySelector("[data-clipboard-status]");
          button.disabled = true;
          try {
            if (button.dataset.clipboard === "export") await host.navigator.clipboard.writeText(field.value);
            else {
              const text = await host.navigator.clipboard.readText();
              if (modal !== current || !field.isConnected) return;
              field.value = text;
              current.value = text;
              field.focus();
            }
            if (status.isConnected)
              status.textContent = t(button.dataset.clipboard === "export" ? "copiedText" : "pastedText");
          } catch {
            if (status.isConnected) status.textContent = t("clipboardUnavailable");
          } finally {
            button.disabled = false;
          }
        };
      });
      root.querySelectorAll('[data-act="closeModal"]').forEach(
        (b) => b.onclick = () => {
          modal = null;
          render();
        }
      );
      root.querySelectorAll('[data-act="confirmModal"]').forEach((b) => b.onclick = confirmModal);
      root.querySelectorAll('[data-act="discardExit"]').forEach(
        (b) => b.onclick = () => {
          const restore = sessionBaseline;
          modal = null;
          draft = null;
          if (restore)
            store.update((d) => {
              const p = d.personas.find((x) => x.id === active().id);
              p.name = restore.name;
              p.rules = clone(restore.rules);
            });
          sessionBaseline = null;
          page = "home";
          render();
        }
      );
      root.querySelectorAll('[data-act="saveExit"]').forEach(
        (b) => b.onclick = () => {
          commitDraft();
          modal = null;
          draft = null;
          sessionBaseline = null;
          page = "home";
          flash("saved");
        }
      );
    }
    function confirmModal() {
      const m = modal, value = root.querySelector("[data-modal-value]")?.value?.trim() ?? "";
      try {
        if (m.type === "name") {
          if (!value) return;
          if (m.mode === "new") store.update((d) => d.personas.push(persona(value, host.Player?.MemberNumber)));
          else if (m.mode === "rule") draft.name = value;
          else store.update((d) => d.personas.find((p) => p.id === m.id).name = value);
        } else if (m.type === "confirm" && m.mode === "rule") {
          if (draft?.id === m.id) draft = null;
          store.update((d) => {
            const p = d.personas.find((x) => x.id === active().id);
            p.rules = p.rules.filter((r) => r.id !== m.id);
          });
          if (selectedRuleId === m.id) selectedRuleId = active().rules[0]?.id ?? null;
          if (!active().rules.length) ruleDeleteMode = false;
        } else if (m.type === "confirm") {
          store.update((d) => {
            d.personas = d.personas.filter((p) => p.id !== m.id);
            if (d.activePersona === m.id) d.activePersona = d.personas[0].id;
          });
        } else if (m.type === "transfer") {
          const parsed = importPersonas(value);
          store.update((d) => d.personas.push(...parsed.personas));
        } else if (m.type === "text") {
          const choice2 = {
            id: m.index == null ? uid() : draft.choices[m.index].id,
            steps: [{ type: m.responseType, text: value }]
          };
          if (m.index == null) draft.choices.push(choice2);
          else draft.choices[m.index] = { ...choice2, always: draft.choices[m.index].always ?? false };
        } else if (m.type === "animation") {
          const seconds = root.querySelector("[data-animation-seconds]");
          if (seconds) m.intervalMs = Number(seconds.value) * 1e3;
          for (const el of root.querySelectorAll("[data-animation-field]"))
            m[el.dataset.animationField] = ["count", "intervalMs"].includes(el.dataset.animationField) ? Number(el.value) : el.value;
          for (const track of m.tracks) if (track.stateB.sameAsset) track.stateB.asset = track.stateA.asset;
          if (!m.tracks.length || m.tracks.some((x) => !x.stateA.asset || !x.stateB.asset))
            throw Error(t("chooseAnimationGroup"));
          if (!Number.isInteger(m.count) || m.count < 1 || m.count > 100 || !Number.isFinite(m.intervalMs) || m.intervalMs < 1 || m.intervalMs > 12e4)
            throw Error(t("invalidAnimation"));
          const choice2 = {
            id: m.index == null ? uid() : draft.choices[m.index].id,
            steps: [
              {
                type: "animation",
                tracks: clone(m.tracks),
                count: m.count,
                intervalMs: m.intervalMs,
                messageType: m.messageType,
                text: m.text
              }
            ]
          };
          if (m.index == null) draft.choices.push(choice2);
          else draft.choices[m.index] = { ...choice2, always: draft.choices[m.index].always ?? false };
        } else if (m.type === "lists") {
          const input = root.querySelector("[data-list]");
          if (input) m[input.dataset.list] = input.value;
          store.update((d) => {
            const p = d.personas.find((x) => x.id === active().id);
            p.listMode = m.listMode;
            p.whiteList = parseMembers(m.white);
            p.blackList = parseMembers(m.black);
          });
        }
        modal = null;
        render();
      } catch (error) {
        modal.error = String(error.message);
        render();
      }
    }
    function position() {
      if (!root) return;
      const b = drawingContext(host).canvas.getBoundingClientRect();
      Object.assign(root.style, {
        left: `${b.left}px`,
        top: `${b.top}px`,
        transform: `scale(${b.width / 2e3},${b.height / 1e3})`
      });
    }
    function resetView() {
      page = "home";
      editingPersonaId = null;
      selectedRuleId = null;
      draft = null;
      sessionBaseline = null;
      modal = null;
      inlineEdit = null;
      deleteMode = false;
      ruleDeleteMode = false;
      responseDelete = false;
      primaryMode = false;
      filter = "all";
      ruleQuery = "";
      ruleScrollTop = 0;
      pickerGroup = "ItemHead";
      pickerScope = "current";
      pickerSelected = /* @__PURE__ */ new Set();
      pickerQuery = "";
      pickerInput = "";
      pickerMode = "trigger";
      notice = "";
    }
    function load() {
      root?.remove();
      root = host.document.createElement("div");
      root.className = "rl-root";
      host.document.body.appendChild(root);
      if (!wardrobePending) resetView();
      render();
    }
    function unload() {
      clearTimeout(noticeTimer);
      notice = "";
      if (!wardrobePending) resetView();
      picker.reset();
      root?.remove();
      root = null;
    }
    host.PreferenceRegisterExtensionSetting({
      Identifier: ID,
      ButtonText: () => ID,
      Image: preference_icon_default,
      load,
      run: position,
      click() {
      },
      exit() {
        if (page === "home") unload();
        else if (dirty()) {
          modal = { type: "unsaved" };
          render();
        } else {
          page = "home";
          draft = null;
          sessionBaseline = null;
          render();
        }
      },
      unload
    });
    return { close: unload };
  }
  var svg, ICON;
  var init_dom_settings = __esm({
    "src/ui/dom-settings.js"() {
      init_input_controls();
      init_settings();
      init_activity_picker();
      init_model();
      init_import();
      init_preference_icon();
      init_exit_icon();
      init_catalog();
      init_canvas();
      init_appearance();
      svg = (path) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="${path}"/></svg>`;
      ICON = {
        crown: svg("M3 6l4 4 5-7 5 7 4-4-2 13H5L3 6Zm2 10h14"),
        edit: svg("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"),
        trash: svg("M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6"),
        copy: svg("M8 8h12v13H8zM16 8V3H3v13h5"),
        paste: svg("M9 4H5v17h14V4h-4M9 2h6v5H9z"),
        close: svg("M18 6 6 18M6 6l12 12")
      };
    }
  });

  // src/app.js
  var app_exports = {};
  __export(app_exports, {
    start: () => start
  });
  function start(namespace, host = globalThis) {
    host.LZString ??= import_lz_string.default;
    const sdk = host.bcModSdk.registerMod({
      name: ID,
      fullName: ID,
      version: VERSION,
      repository: "https://github.com/awdrrawd/BC-Responsive"
    });
    const store = createStore(host);
    const coordination = createAPI(namespace, store, host);
    const t = initI18n(host);
    namespace.refresh = () => coordination.refresh();
    let output, scheduler, mouth, events, ui, initializeTimer, monitorTimer, unsubscribe;
    let stopped = false;
    let account;
    let lastScreen;
    const report = (message) => {
      namespace.lastDiagnostic = String(message);
      console.warn(ID, message);
    };
    function reset() {
      scheduler?.cancel();
      mouth?.clear();
      output?.clear();
    }
    namespace.stop = () => {
      stopped = true;
      clearTimeout(initializeTimer);
      clearInterval(monitorTimer);
      unsubscribe?.();
      reset();
      coordination.setReady(false);
      coordination.refresh();
      ui?.close();
    };
    const ready = () => host.Player?.MemberNumber !== void 0 && host.Player.ExtensionSettings && [
      "PreferenceRegisterExtensionSetting",
      "ChatRoomRegisterMessageHandler",
      "CommonDrawAppearanceBuild",
      "ChatRoomSync",
      "ChatRoomAddCharacterToChatRoom"
    ].every((k) => typeof host[k] === "function");
    function initialize() {
      if (stopped) return;
      if (!ready()) {
        initializeTimer = setTimeout(initialize, 500);
        return;
      }
      try {
        store.load();
        account = host.Player.MemberNumber;
        installSpeech({
          sdk,
          store,
          host,
          enabled: () => !stopped && store.loaded && store.data.settings.enabled && host.Player.MemberNumber === account
        });
        output = createOutput({ store, host, owns: coordination.owns, report });
        mouth = createMouth({ sdk, owns: coordination.owns, host });
        const valid = (event) => !stopped && store.loaded && store.data.settings.enabled && store.data.settings.reactions && host.CurrentScreen === "ChatRoom" && host.Player.MemberNumber === account && event.room === events.roomKey() && !host.Player.GhostList?.includes(event.actor) && (event.event === "leave" || host.ChatRoomCharacter.some((c) => c.MemberNumber === event.actor));
        scheduler = createScheduler({ active: () => store.active, valid, execute: output.execute, report });
        events = installEvents({
          sdk,
          submit: (e) => {
            if (e.kind === "event" && e.event === "join") lastScreen = host.CurrentScreen;
            return scheduler.submit(e);
          },
          mouth,
          reset,
          host
        });
        ui = installSettings({ store, t, host });
        lastScreen = host.CurrentScreen;
        unsubscribe = store.subscribe(() => {
          reset();
          coordination.refresh();
        });
        coordination.setReady(true);
        coordination.refresh();
        monitorTimer = setInterval(() => {
          if (stopped) return;
          try {
            if (lastScreen !== host.CurrentScreen) {
              reset();
              lastScreen = host.CurrentScreen;
            }
            if (account !== host.Player?.MemberNumber) {
              reset();
              coordination.setReady(false);
              coordination.refresh();
              if (ready()) {
                store.load();
                account = host.Player.MemberNumber;
                coordination.setReady(true);
              }
            }
            const before = namespace.getState().capabilities;
            coordination.refresh();
            if (before.mouth && !coordination.owns("mouth")) mouth.clear();
            if (before.expressions && !coordination.owns("expressions")) output.clear();
          } catch (error) {
            report(error);
          }
        }, 500);
        console.info(`${ID} ${VERSION} ready`);
      } catch (error) {
        reset();
        coordination.setReady(false);
        coordination.refresh();
        report(error);
      }
    }
    initialize();
  }
  var import_bondage_club_mod_sdk, import_lz_string;
  var init_app = __esm({
    "src/app.js"() {
      import_bondage_club_mod_sdk = __toESM(require_bcmodsdk(), 1);
      import_lz_string = __toESM(require_lz_string(), 1);
      init_model();
      init_store();
      init_api();
      init_engine();
      init_i18n();
      init_output();
      init_mouth();
      init_speech();
      init_events();
      init_dom_settings();
    }
  });

  // src/main.js
  globalThis.Liko ??= {};
  if (globalThis.Liko.Responsive_Liko) {
    console.info("Responsive_Liko already loaded");
  } else {
    const namespace = globalThis.Liko.Responsive_Liko = {};
    Promise.resolve().then(() => (init_app(), app_exports)).then(({ start: start2 }) => start2(namespace)).catch((error) => {
      namespace.error = String(error);
      console.error("Responsive_Liko initialization failed", error);
    });
  }
})();
//# sourceMappingURL=main.js.map
