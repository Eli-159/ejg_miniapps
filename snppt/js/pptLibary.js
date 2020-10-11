/* PptxGenJS 3.3.1 @ 2020-08-23T19:00:27.040Z */
!function(t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define([], t) : ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).JSZip = t()
}(function() {
    return function i(o, s, l) {
        function c(e, t) {
            if (!s[e]) {
                if (!o[e]) {
                    var r = "function" == typeof require && require;
                    if (!t && r)
                        return r(e, !0);
                    if (p)
                        return p(e, !0);
                    var n = new Error("Cannot find module '" + e + "'");
                    throw n.code = "MODULE_NOT_FOUND",
                    n
                }
                var a = s[e] = {
                    exports: {}
                };
                o[e][0].call(a.exports, function(t) {
                    return c(o[e][1][t] || t)
                }, a, a.exports, i, o, s, l)
            }
            return s[e].exports
        }
        for (var p = "function" == typeof require && require, t = 0; t < l.length; t++)
            c(l[t]);
        return c
    }({
        1: [function(t, e, r) {
            "use strict";
            var d = t("./utils")
              , f = t("./support")
              , h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            r.encode = function(t) {
                for (var e, r, n, a, i, o, s, l = [], c = 0, p = t.length, u = p, f = "string" !== d.getTypeOf(t); c < t.length; )
                    u = p - c,
                    n = f ? (e = t[c++],
                    r = c < p ? t[c++] : 0,
                    c < p ? t[c++] : 0) : (e = t.charCodeAt(c++),
                    r = c < p ? t.charCodeAt(c++) : 0,
                    c < p ? t.charCodeAt(c++) : 0),
                    a = e >> 2,
                    i = (3 & e) << 4 | r >> 4,
                    o = 1 < u ? (15 & r) << 2 | n >> 6 : 64,
                    s = 2 < u ? 63 & n : 64,
                    l.push(h.charAt(a) + h.charAt(i) + h.charAt(o) + h.charAt(s));
                return l.join("")
            }
            ,
            r.decode = function(t) {
                var e, r, n, a, i, o, s = 0, l = 0, c = "data:";
                if (t.substr(0, c.length) === c)
                    throw new Error("Invalid base64 input, it looks like a data url.");
                var p, u = 3 * (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, "")).length / 4;
                if (t.charAt(t.length - 1) === h.charAt(64) && u--,
                t.charAt(t.length - 2) === h.charAt(64) && u--,
                u % 1 != 0)
                    throw new Error("Invalid base64 input, bad content length.");
                for (p = f.uint8array ? new Uint8Array(0 | u) : new Array(0 | u); s < t.length; )
                    e = h.indexOf(t.charAt(s++)) << 2 | (a = h.indexOf(t.charAt(s++))) >> 4,
                    r = (15 & a) << 4 | (i = h.indexOf(t.charAt(s++))) >> 2,
                    n = (3 & i) << 6 | (o = h.indexOf(t.charAt(s++))),
                    p[l++] = e,
                    64 !== i && (p[l++] = r),
                    64 !== o && (p[l++] = n);
                return p
            }
        }
        , {
            "./support": 30,
            "./utils": 32
        }],
        2: [function(t, e, r) {
            "use strict";
            var n = t("./external")
              , a = t("./stream/DataWorker")
              , i = t("./stream/DataLengthProbe")
              , o = t("./stream/Crc32Probe");
            function s(t, e, r, n, a) {
                this.compressedSize = t,
                this.uncompressedSize = e,
                this.crc32 = r,
                this.compression = n,
                this.compressedContent = a
            }
            i = t("./stream/DataLengthProbe"),
            s.prototype = {
                getContentWorker: function() {
                    var t = new a(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new i("data_length"))
                      , e = this;
                    return t.on("end", function() {
                        if (this.streamInfo.data_length !== e.uncompressedSize)
                            throw new Error("Bug : uncompressed data size mismatch")
                    }),
                    t
                },
                getCompressedWorker: function() {
                    return new a(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression)
                }
            },
            s.createWorkerFrom = function(t, e, r) {
                return t.pipe(new o).pipe(new i("uncompressedSize")).pipe(e.compressWorker(r)).pipe(new i("compressedSize")).withStreamInfo("compression", e)
            }
            ,
            e.exports = s
        }
        , {
            "./external": 6,
            "./stream/Crc32Probe": 25,
            "./stream/DataLengthProbe": 26,
            "./stream/DataWorker": 27
        }],
        3: [function(t, e, r) {
            "use strict";
            var n = t("./stream/GenericWorker");
            r.STORE = {
                magic: "\0\0",
                compressWorker: function(t) {
                    return new n("STORE compression")
                },
                uncompressWorker: function() {
                    return new n("STORE decompression")
                }
            },
            r.DEFLATE = t("./flate")
        }
        , {
            "./flate": 7,
            "./stream/GenericWorker": 28
        }],
        4: [function(t, e, r) {
            "use strict";
            var n = t("./utils")
              , o = function() {
                for (var t, e = [], r = 0; r < 256; r++) {
                    t = r;
                    for (var n = 0; n < 8; n++)
                        t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                    e[r] = t
                }
                return e
            }();
            e.exports = function(t, e) {
                return void 0 !== t && t.length ? "string" !== n.getTypeOf(t) ? function(t, e, r) {
                    var n = o
                      , a = 0 + r;
                    t ^= -1;
                    for (var i = 0; i < a; i++)
                        t = t >>> 8 ^ n[255 & (t ^ e[i])];
                    return -1 ^ t
                }(0 | e, t, t.length) : function(t, e, r) {
                    var n = o
                      , a = 0 + r;
                    t ^= -1;
                    for (var i = 0; i < a; i++)
                        t = t >>> 8 ^ n[255 & (t ^ e.charCodeAt(i))];
                    return -1 ^ t
                }(0 | e, t, t.length) : 0
            }
        }
        , {
            "./utils": 32
        }],
        5: [function(t, e, r) {
            "use strict";
            r.base64 = !1,
            r.binary = !1,
            r.dir = !1,
            r.createFolders = !0,
            r.date = null,
            r.compression = null,
            r.compressionOptions = null,
            r.comment = null,
            r.unixPermissions = null,
            r.dosPermissions = null
        }
        , {}],
        6: [function(t, e, r) {
            "use strict";
            var n;
            n = "undefined" != typeof Promise ? Promise : t("lie"),
            e.exports = {
                Promise: n
            }
        }
        , {
            lie: 37
        }],
        7: [function(t, e, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array
              , a = t("pako")
              , i = t("./utils")
              , o = t("./stream/GenericWorker")
              , s = n ? "uint8array" : "array";
            function l(t, e) {
                o.call(this, "FlateWorker/" + t),
                this._pako = null,
                this._pakoAction = t,
                this._pakoOptions = e,
                this.meta = {}
            }
            r.magic = "\b\0",
            i.inherits(l, o),
            l.prototype.processChunk = function(t) {
                this.meta = t.meta,
                null === this._pako && this._createPako(),
                this._pako.push(i.transformTo(s, t.data), !1)
            }
            ,
            l.prototype.flush = function() {
                o.prototype.flush.call(this),
                null === this._pako && this._createPako(),
                this._pako.push([], !0)
            }
            ,
            l.prototype.cleanUp = function() {
                o.prototype.cleanUp.call(this),
                this._pako = null
            }
            ,
            l.prototype._createPako = function() {
                this._pako = new a[this._pakoAction]({
                    raw: !0,
                    level: this._pakoOptions.level || -1
                });
                var e = this;
                this._pako.onData = function(t) {
                    e.push({
                        data: t,
                        meta: e.meta
                    })
                }
            }
            ,
            r.compressWorker = function(t) {
                return new l("Deflate",t)
            }
            ,
            r.uncompressWorker = function() {
                return new l("Inflate",{})
            }
        }
        , {
            "./stream/GenericWorker": 28,
            "./utils": 32,
            pako: 38
        }],
        8: [function(t, e, r) {
            "use strict";
            function k(t, e) {
                var r, n = "";
                for (r = 0; r < e; r++)
                    n += String.fromCharCode(255 & t),
                    t >>>= 8;
                return n
            }
            function a(t, e, r, n, a, i) {
                var o, s, l = t.file, c = t.compression, p = i !== F.utf8encode, u = R.transformTo("string", i(l.name)), f = R.transformTo("string", F.utf8encode(l.name)), d = l.comment, h = R.transformTo("string", i(d)), m = R.transformTo("string", F.utf8encode(d)), g = f.length !== l.name.length, A = m.length !== d.length, v = "", y = "", b = "", x = l.dir, w = l.date, _ = {
                    crc32: 0,
                    compressedSize: 0,
                    uncompressedSize: 0
                };
                e && !r || (_.crc32 = t.crc32,
                _.compressedSize = t.compressedSize,
                _.uncompressedSize = t.uncompressedSize);
                var C = 0;
                e && (C |= 8),
                p || !g && !A || (C |= 2048);
                var S, P, E = 0, T = 0;
                x && (E |= 16),
                "UNIX" === a ? (T = 798,
                E |= (S = l.unixPermissions,
                (P = S) || (P = x ? 16893 : 33204),
                (65535 & P) << 16)) : (T = 20,
                E |= 63 & (l.dosPermissions || 0)),
                o = w.getUTCHours(),
                o <<= 6,
                o |= w.getUTCMinutes(),
                o <<= 5,
                o |= w.getUTCSeconds() / 2,
                s = w.getUTCFullYear() - 1980,
                s <<= 4,
                s |= w.getUTCMonth() + 1,
                s <<= 5,
                s |= w.getUTCDate(),
                g && (v += "up" + k((y = k(1, 1) + k(I(u), 4) + f).length, 2) + y),
                A && (v += "uc" + k((b = k(1, 1) + k(I(h), 4) + m).length, 2) + b);
                var L = "";
                return L += "\n\0",
                L += k(C, 2),
                L += c.magic,
                L += k(o, 2),
                L += k(s, 2),
                L += k(_.crc32, 4),
                L += k(_.compressedSize, 4),
                L += k(_.uncompressedSize, 4),
                L += k(u.length, 2),
                L += k(v.length, 2),
                {
                    fileRecord: O.LOCAL_FILE_HEADER + L + u + v,
                    dirRecord: O.CENTRAL_FILE_HEADER + k(T, 2) + L + k(h.length, 2) + "\0\0\0\0" + k(E, 4) + k(n, 4) + u + v + h
                }
            }
            var R = t("../utils")
              , i = t("../stream/GenericWorker")
              , F = t("../utf8")
              , I = t("../crc32")
              , O = t("../signature");
            function n(t, e, r, n) {
                i.call(this, "ZipFileWorker"),
                this.bytesWritten = 0,
                this.zipComment = e,
                this.zipPlatform = r,
                this.encodeFileName = n,
                this.streamFiles = t,
                this.accumulate = !1,
                this.contentBuffer = [],
                this.dirRecords = [],
                this.currentSourceOffset = 0,
                this.entriesCount = 0,
                this.currentFile = null,
                this._sources = []
            }
            R.inherits(n, i),
            n.prototype.push = function(t) {
                var e = t.meta.percent || 0
                  , r = this.entriesCount
                  , n = this._sources.length;
                this.accumulate ? this.contentBuffer.push(t) : (this.bytesWritten += t.data.length,
                i.prototype.push.call(this, {
                    data: t.data,
                    meta: {
                        currentFile: this.currentFile,
                        percent: r ? (e + 100 * (r - n - 1)) / r : 100
                    }
                }))
            }
            ,
            n.prototype.openedSource = function(t) {
                this.currentSourceOffset = this.bytesWritten,
                this.currentFile = t.file.name;
                var e = this.streamFiles && !t.file.dir;
                if (e) {
                    var r = a(t, e, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                    this.push({
                        data: r.fileRecord,
                        meta: {
                            percent: 0
                        }
                    })
                } else
                    this.accumulate = !0
            }
            ,
            n.prototype.closedSource = function(t) {
                this.accumulate = !1;
                var e, r = this.streamFiles && !t.file.dir, n = a(t, r, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
                if (this.dirRecords.push(n.dirRecord),
                r)
                    this.push({
                        data: (e = t,
                        O.DATA_DESCRIPTOR + k(e.crc32, 4) + k(e.compressedSize, 4) + k(e.uncompressedSize, 4)),
                        meta: {
                            percent: 100
                        }
                    });
                else
                    for (this.push({
                        data: n.fileRecord,
                        meta: {
                            percent: 0
                        }
                    }); this.contentBuffer.length; )
                        this.push(this.contentBuffer.shift());
                this.currentFile = null
            }
            ,
            n.prototype.flush = function() {
                for (var t = this.bytesWritten, e = 0; e < this.dirRecords.length; e++)
                    this.push({
                        data: this.dirRecords[e],
                        meta: {
                            percent: 100
                        }
                    });
                var r, n, a, i, o, s, l = this.bytesWritten - t, c = (r = this.dirRecords.length,
                n = l,
                a = t,
                i = this.zipComment,
                o = this.encodeFileName,
                s = R.transformTo("string", o(i)),
                O.CENTRAL_DIRECTORY_END + "\0\0\0\0" + k(r, 2) + k(r, 2) + k(n, 4) + k(a, 4) + k(s.length, 2) + s);
                this.push({
                    data: c,
                    meta: {
                        percent: 100
                    }
                })
            }
            ,
            n.prototype.prepareNextSource = function() {
                this.previous = this._sources.shift(),
                this.openedSource(this.previous.streamInfo),
                this.isPaused ? this.previous.pause() : this.previous.resume()
            }
            ,
            n.prototype.registerPrevious = function(t) {
                this._sources.push(t);
                var e = this;
                return t.on("data", function(t) {
                    e.processChunk(t)
                }),
                t.on("end", function() {
                    e.closedSource(e.previous.streamInfo),
                    e._sources.length ? e.prepareNextSource() : e.end()
                }),
                t.on("error", function(t) {
                    e.error(t)
                }),
                this
            }
            ,
            n.prototype.resume = function() {
                return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(),
                !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(),
                !0))
            }
            ,
            n.prototype.error = function(t) {
                var e = this._sources;
                if (!i.prototype.error.call(this, t))
                    return !1;
                for (var r = 0; r < e.length; r++)
                    try {
                        e[r].error(t)
                    } catch (t) {}
                return !0
            }
            ,
            n.prototype.lock = function() {
                i.prototype.lock.call(this);
                for (var t = this._sources, e = 0; e < t.length; e++)
                    t[e].lock()
            }
            ,
            e.exports = n
        }
        , {
            "../crc32": 4,
            "../signature": 23,
            "../stream/GenericWorker": 28,
            "../utf8": 31,
            "../utils": 32
        }],
        9: [function(t, e, r) {
            "use strict";
            var c = t("../compressions")
              , n = t("./ZipFileWorker");
            r.generateWorker = function(t, o, e) {
                var s = new n(o.streamFiles,e,o.platform,o.encodeFileName)
                  , l = 0;
                try {
                    t.forEach(function(t, e) {
                        l++;
                        var r = function(t, e) {
                            var r = t || e
                              , n = c[r];
                            if (!n)
                                throw new Error(r + " is not a valid compression method !");
                            return n
                        }(e.options.compression, o.compression)
                          , n = e.options.compressionOptions || o.compressionOptions || {}
                          , a = e.dir
                          , i = e.date;
                        e._compressWorker(r, n).withStreamInfo("file", {
                            name: t,
                            dir: a,
                            date: i,
                            comment: e.comment || "",
                            unixPermissions: e.unixPermissions,
                            dosPermissions: e.dosPermissions
                        }).pipe(s)
                    }),
                    s.entriesCount = l
                } catch (t) {
                    s.error(t)
                }
                return s
            }
        }
        , {
            "../compressions": 3,
            "./ZipFileWorker": 8
        }],
        10: [function(t, e, r) {
            "use strict";
            function n() {
                if (!(this instanceof n))
                    return new n;
                if (arguments.length)
                    throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
                this.files = {},
                this.comment = null,
                this.root = "",
                this.clone = function() {
                    var t = new n;
                    for (var e in this)
                        "function" != typeof this[e] && (t[e] = this[e]);
                    return t
                }
            }
            (n.prototype = t("./object")).loadAsync = t("./load"),
            n.support = t("./support"),
            n.defaults = t("./defaults"),
            n.version = "3.2.0",
            n.loadAsync = function(t, e) {
                return (new n).loadAsync(t, e)
            }
            ,
            n.external = t("./external"),
            e.exports = n
        }
        , {
            "./defaults": 5,
            "./external": 6,
            "./load": 11,
            "./object": 15,
            "./support": 30
        }],
        11: [function(t, e, r) {
            "use strict";
            var n = t("./utils")
              , a = t("./external")
              , s = t("./utf8")
              , l = (n = t("./utils"),
            t("./zipEntries"))
              , i = t("./stream/Crc32Probe")
              , c = t("./nodejsUtils");
            function p(n) {
                return new a.Promise(function(t, e) {
                    var r = n.decompressed.getContentWorker().pipe(new i);
                    r.on("error", function(t) {
                        e(t)
                    }).on("end", function() {
                        r.streamInfo.crc32 !== n.decompressed.crc32 ? e(new Error("Corrupted zip : CRC32 mismatch")) : t()
                    }).resume()
                }
                )
            }
            e.exports = function(t, i) {
                var o = this;
                return i = n.extend(i || {}, {
                    base64: !1,
                    checkCRC32: !1,
                    optimizedBinaryString: !1,
                    createFolders: !1,
                    decodeFileName: s.utf8decode
                }),
                c.isNode && c.isStream(t) ? a.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : n.prepareContent("the loaded zip file", t, !0, i.optimizedBinaryString, i.base64).then(function(t) {
                    var e = new l(i);
                    return e.load(t),
                    e
                }).then(function(t) {
                    var e = [a.Promise.resolve(t)]
                      , r = t.files;
                    if (i.checkCRC32)
                        for (var n = 0; n < r.length; n++)
                            e.push(p(r[n]));
                    return a.Promise.all(e)
                }).then(function(t) {
                    for (var e = t.shift(), r = e.files, n = 0; n < r.length; n++) {
                        var a = r[n];
                        o.file(a.fileNameStr, a.decompressed, {
                            binary: !0,
                            optimizedBinaryString: !0,
                            date: a.date,
                            dir: a.dir,
                            comment: a.fileCommentStr.length ? a.fileCommentStr : null,
                            unixPermissions: a.unixPermissions,
                            dosPermissions: a.dosPermissions,
                            createFolders: i.createFolders
                        })
                    }
                    return e.zipComment.length && (o.comment = e.zipComment),
                    o
                })
            }
        }
        , {
            "./external": 6,
            "./nodejsUtils": 14,
            "./stream/Crc32Probe": 25,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntries": 33
        }],
        12: [function(t, e, r) {
            "use strict";
            var n = t("../utils")
              , a = t("../stream/GenericWorker");
            function i(t, e) {
                a.call(this, "Nodejs stream input adapter for " + t),
                this._upstreamEnded = !1,
                this._bindStream(e)
            }
            n.inherits(i, a),
            i.prototype._bindStream = function(t) {
                var e = this;
                (this._stream = t).pause(),
                t.on("data", function(t) {
                    e.push({
                        data: t,
                        meta: {
                            percent: 0
                        }
                    })
                }).on("error", function(t) {
                    e.isPaused ? this.generatedError = t : e.error(t)
                }).on("end", function() {
                    e.isPaused ? e._upstreamEnded = !0 : e.end()
                })
            }
            ,
            i.prototype.pause = function() {
                return !!a.prototype.pause.call(this) && (this._stream.pause(),
                !0)
            }
            ,
            i.prototype.resume = function() {
                return !!a.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(),
                !0)
            }
            ,
            e.exports = i
        }
        , {
            "../stream/GenericWorker": 28,
            "../utils": 32
        }],
        13: [function(t, e, r) {
            "use strict";
            var a = t("readable-stream").Readable;
            function n(t, e, r) {
                a.call(this, e),
                this._helper = t;
                var n = this;
                t.on("data", function(t, e) {
                    n.push(t) || n._helper.pause(),
                    r && r(e)
                }).on("error", function(t) {
                    n.emit("error", t)
                }).on("end", function() {
                    n.push(null)
                })
            }
            t("../utils").inherits(n, a),
            n.prototype._read = function() {
                this._helper.resume()
            }
            ,
            e.exports = n
        }
        , {
            "../utils": 32,
            "readable-stream": 16
        }],
        14: [function(t, e, r) {
            "use strict";
            e.exports = {
                isNode: "undefined" != typeof Buffer,
                newBufferFrom: function(t, e) {
                    if (Buffer.from && Buffer.from !== Uint8Array.from)
                        return Buffer.from(t, e);
                    if ("number" == typeof t)
                        throw new Error('The "data" argument must not be a number');
                    return new Buffer(t,e)
                },
                allocBuffer: function(t) {
                    if (Buffer.alloc)
                        return Buffer.alloc(t);
                    var e = new Buffer(t);
                    return e.fill(0),
                    e
                },
                isBuffer: function(t) {
                    return Buffer.isBuffer(t)
                },
                isStream: function(t) {
                    return t && "function" == typeof t.on && "function" == typeof t.pause && "function" == typeof t.resume
                }
            }
        }
        , {}],
        15: [function(t, e, r) {
            "use strict";
            function i(t, e, r) {
                var n, a = p.getTypeOf(e), i = p.extend(r || {}, f);
                i.date = i.date || new Date,
                null !== i.compression && (i.compression = i.compression.toUpperCase()),
                "string" == typeof i.unixPermissions && (i.unixPermissions = parseInt(i.unixPermissions, 8)),
                i.unixPermissions && 16384 & i.unixPermissions && (i.dir = !0),
                i.dosPermissions && 16 & i.dosPermissions && (i.dir = !0),
                i.dir && (t = c(t)),
                i.createFolders && (n = function(t) {
                    "/" === t.slice(-1) && (t = t.substring(0, t.length - 1));
                    var e = t.lastIndexOf("/");
                    return 0 < e ? t.substring(0, e) : ""
                }(t)) && A.call(this, n, !0);
                var o = "string" === a && !1 === i.binary && !1 === i.base64;
                r && void 0 !== r.binary || (i.binary = !o),
                (e instanceof d && 0 === e.uncompressedSize || i.dir || !e || 0 === e.length) && (i.base64 = !1,
                i.binary = !0,
                e = "",
                i.compression = "STORE",
                a = "string");
                var s;
                s = e instanceof d || e instanceof u ? e : m.isNode && m.isStream(e) ? new g(t,e) : p.prepareContent(t, e, i.binary, i.optimizedBinaryString, i.base64);
                var l = new h(t,s,i);
                this.files[t] = l
            }
            function c(t) {
                return "/" !== t.slice(-1) && (t += "/"),
                t
            }
            var a = t("./utf8")
              , p = t("./utils")
              , u = t("./stream/GenericWorker")
              , o = t("./stream/StreamHelper")
              , f = t("./defaults")
              , d = t("./compressedObject")
              , h = t("./zipObject")
              , s = t("./generate")
              , m = t("./nodejsUtils")
              , g = t("./nodejs/NodejsStreamInputAdapter")
              , A = function(t, e) {
                return e = void 0 !== e ? e : f.createFolders,
                t = c(t),
                this.files[t] || i.call(this, t, null, {
                    dir: !0,
                    createFolders: e
                }),
                this.files[t]
            };
            function l(t) {
                return "[object RegExp]" === Object.prototype.toString.call(t)
            }
            var n = {
                load: function() {
                    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                },
                forEach: function(t) {
                    var e, r, n;
                    for (e in this.files)
                        this.files.hasOwnProperty(e) && (n = this.files[e],
                        (r = e.slice(this.root.length, e.length)) && e.slice(0, this.root.length) === this.root && t(r, n))
                },
                filter: function(r) {
                    var n = [];
                    return this.forEach(function(t, e) {
                        r(t, e) && n.push(e)
                    }),
                    n
                },
                file: function(t, e, r) {
                    if (1 !== arguments.length)
                        return t = this.root + t,
                        i.call(this, t, e, r),
                        this;
                    if (l(t)) {
                        var n = t;
                        return this.filter(function(t, e) {
                            return !e.dir && n.test(t)
                        })
                    }
                    var a = this.files[this.root + t];
                    return a && !a.dir ? a : null
                },
                folder: function(r) {
                    if (!r)
                        return this;
                    if (l(r))
                        return this.filter(function(t, e) {
                            return e.dir && r.test(t)
                        });
                    var t = this.root + r
                      , e = A.call(this, t)
                      , n = this.clone();
                    return n.root = e.name,
                    n
                },
                remove: function(r) {
                    r = this.root + r;
                    var t = this.files[r];
                    if (t || ("/" !== r.slice(-1) && (r += "/"),
                    t = this.files[r]),
                    t && !t.dir)
                        delete this.files[r];
                    else
                        for (var e = this.filter(function(t, e) {
                            return e.name.slice(0, r.length) === r
                        }), n = 0; n < e.length; n++)
                            delete this.files[e[n].name];
                    return this
                },
                generate: function(t) {
                    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
                },
                generateInternalStream: function(t) {
                    var e, r = {};
                    try {
                        if ((r = p.extend(t || {}, {
                            streamFiles: !1,
                            compression: "STORE",
                            compressionOptions: null,
                            type: "",
                            platform: "DOS",
                            comment: null,
                            mimeType: "application/zip",
                            encodeFileName: a.utf8encode
                        })).type = r.type.toLowerCase(),
                        r.compression = r.compression.toUpperCase(),
                        "binarystring" === r.type && (r.type = "string"),
                        !r.type)
                            throw new Error("No output type specified.");
                        p.checkSupport(r.type),
                        "darwin" !== r.platform && "freebsd" !== r.platform && "linux" !== r.platform && "sunos" !== r.platform || (r.platform = "UNIX"),
                        "win32" === r.platform && (r.platform = "DOS");
                        var n = r.comment || this.comment || "";
                        e = s.generateWorker(this, r, n)
                    } catch (t) {
                        (e = new u("error")).error(t)
                    }
                    return new o(e,r.type || "string",r.mimeType)
                },
                generateAsync: function(t, e) {
                    return this.generateInternalStream(t).accumulate(e)
                },
                generateNodeStream: function(t, e) {
                    return (t = t || {}).type || (t.type = "nodebuffer"),
                    this.generateInternalStream(t).toNodejsStream(e)
                }
            };
            e.exports = n
        }
        , {
            "./compressedObject": 2,
            "./defaults": 5,
            "./generate": 9,
            "./nodejs/NodejsStreamInputAdapter": 12,
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31,
            "./utils": 32,
            "./zipObject": 35
        }],
        16: [function(t, e, r) {
            e.exports = t("stream")
        }
        , {
            stream: void 0
        }],
        17: [function(t, e, r) {
            "use strict";
            var n = t("./DataReader");
            function a(t) {
                n.call(this, t);
                for (var e = 0; e < this.data.length; e++)
                    t[e] = 255 & t[e]
            }
            t("../utils").inherits(a, n),
            a.prototype.byteAt = function(t) {
                return this.data[this.zero + t]
            }
            ,
            a.prototype.lastIndexOfSignature = function(t) {
                for (var e = t.charCodeAt(0), r = t.charCodeAt(1), n = t.charCodeAt(2), a = t.charCodeAt(3), i = this.length - 4; 0 <= i; --i)
                    if (this.data[i] === e && this.data[i + 1] === r && this.data[i + 2] === n && this.data[i + 3] === a)
                        return i - this.zero;
                return -1
            }
            ,
            a.prototype.readAndCheckSignature = function(t) {
                var e = t.charCodeAt(0)
                  , r = t.charCodeAt(1)
                  , n = t.charCodeAt(2)
                  , a = t.charCodeAt(3)
                  , i = this.readData(4);
                return e === i[0] && r === i[1] && n === i[2] && a === i[3]
            }
            ,
            a.prototype.readData = function(t) {
                if (this.checkOffset(t),
                0 === t)
                    return [];
                var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                return this.index += t,
                e
            }
            ,
            e.exports = a
        }
        , {
            "../utils": 32,
            "./DataReader": 18
        }],
        18: [function(t, e, r) {
            "use strict";
            var n = t("../utils");
            function a(t) {
                this.data = t,
                this.length = t.length,
                this.index = 0,
                this.zero = 0
            }
            a.prototype = {
                checkOffset: function(t) {
                    this.checkIndex(this.index + t)
                },
                checkIndex: function(t) {
                    if (this.length < this.zero + t || t < 0)
                        throw new Error("End of data reached (data length = " + this.length + ", asked index = " + t + "). Corrupted zip ?")
                },
                setIndex: function(t) {
                    this.checkIndex(t),
                    this.index = t
                },
                skip: function(t) {
                    this.setIndex(this.index + t)
                },
                byteAt: function(t) {},
                readInt: function(t) {
                    var e, r = 0;
                    for (this.checkOffset(t),
                    e = this.index + t - 1; e >= this.index; e--)
                        r = (r << 8) + this.byteAt(e);
                    return this.index += t,
                    r
                },
                readString: function(t) {
                    return n.transformTo("string", this.readData(t))
                },
                readData: function(t) {},
                lastIndexOfSignature: function(t) {},
                readAndCheckSignature: function(t) {},
                readDate: function() {
                    var t = this.readInt(4);
                    return new Date(Date.UTC(1980 + (t >> 25 & 127), (t >> 21 & 15) - 1, t >> 16 & 31, t >> 11 & 31, t >> 5 & 63, (31 & t) << 1))
                }
            },
            e.exports = a
        }
        , {
            "../utils": 32
        }],
        19: [function(t, e, r) {
            "use strict";
            var n = t("./Uint8ArrayReader");
            function a(t) {
                n.call(this, t)
            }
            t("../utils").inherits(a, n),
            a.prototype.readData = function(t) {
                this.checkOffset(t);
                var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                return this.index += t,
                e
            }
            ,
            e.exports = a
        }
        , {
            "../utils": 32,
            "./Uint8ArrayReader": 21
        }],
        20: [function(t, e, r) {
            "use strict";
            var n = t("./DataReader");
            function a(t) {
                n.call(this, t)
            }
            t("../utils").inherits(a, n),
            a.prototype.byteAt = function(t) {
                return this.data.charCodeAt(this.zero + t)
            }
            ,
            a.prototype.lastIndexOfSignature = function(t) {
                return this.data.lastIndexOf(t) - this.zero
            }
            ,
            a.prototype.readAndCheckSignature = function(t) {
                return t === this.readData(4)
            }
            ,
            a.prototype.readData = function(t) {
                this.checkOffset(t);
                var e = this.data.slice(this.zero + this.index, this.zero + this.index + t);
                return this.index += t,
                e
            }
            ,
            e.exports = a
        }
        , {
            "../utils": 32,
            "./DataReader": 18
        }],
        21: [function(t, e, r) {
            "use strict";
            var n = t("./ArrayReader");
            function a(t) {
                n.call(this, t)
            }
            t("../utils").inherits(a, n),
            a.prototype.readData = function(t) {
                if (this.checkOffset(t),
                0 === t)
                    return new Uint8Array(0);
                var e = this.data.subarray(this.zero + this.index, this.zero + this.index + t);
                return this.index += t,
                e
            }
            ,
            e.exports = a
        }
        , {
            "../utils": 32,
            "./ArrayReader": 17
        }],
        22: [function(t, e, r) {
            "use strict";
            var n = t("../utils")
              , a = t("../support")
              , i = t("./ArrayReader")
              , o = t("./StringReader")
              , s = t("./NodeBufferReader")
              , l = t("./Uint8ArrayReader");
            e.exports = function(t) {
                var e = n.getTypeOf(t);
                return n.checkSupport(e),
                "string" !== e || a.uint8array ? "nodebuffer" === e ? new s(t) : a.uint8array ? new l(n.transformTo("uint8array", t)) : new i(n.transformTo("array", t)) : new o(t)
            }
        }
        , {
            "../support": 30,
            "../utils": 32,
            "./ArrayReader": 17,
            "./NodeBufferReader": 19,
            "./StringReader": 20,
            "./Uint8ArrayReader": 21
        }],
        23: [function(t, e, r) {
            "use strict";
            r.LOCAL_FILE_HEADER = "PK",
            r.CENTRAL_FILE_HEADER = "PK",
            r.CENTRAL_DIRECTORY_END = "PK",
            r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK",
            r.ZIP64_CENTRAL_DIRECTORY_END = "PK",
            r.DATA_DESCRIPTOR = "PK\b"
        }
        , {}],
        24: [function(t, e, r) {
            "use strict";
            var n = t("./GenericWorker")
              , a = t("../utils");
            function i(t) {
                n.call(this, "ConvertWorker to " + t),
                this.destType = t
            }
            a.inherits(i, n),
            i.prototype.processChunk = function(t) {
                this.push({
                    data: a.transformTo(this.destType, t.data),
                    meta: t.meta
                })
            }
            ,
            e.exports = i
        }
        , {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        25: [function(t, e, r) {
            "use strict";
            var n = t("./GenericWorker")
              , a = t("../crc32");
            function i() {
                n.call(this, "Crc32Probe"),
                this.withStreamInfo("crc32", 0)
            }
            t("../utils").inherits(i, n),
            i.prototype.processChunk = function(t) {
                this.streamInfo.crc32 = a(t.data, this.streamInfo.crc32 || 0),
                this.push(t)
            }
            ,
            e.exports = i
        }
        , {
            "../crc32": 4,
            "../utils": 32,
            "./GenericWorker": 28
        }],
        26: [function(t, e, r) {
            "use strict";
            var n = t("../utils")
              , a = t("./GenericWorker");
            function i(t) {
                a.call(this, "DataLengthProbe for " + t),
                this.propName = t,
                this.withStreamInfo(t, 0)
            }
            n.inherits(i, a),
            i.prototype.processChunk = function(t) {
                if (t) {
                    var e = this.streamInfo[this.propName] || 0;
                    this.streamInfo[this.propName] = e + t.data.length
                }
                a.prototype.processChunk.call(this, t)
            }
            ,
            e.exports = i
        }
        , {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        27: [function(t, e, r) {
            "use strict";
            var n = t("../utils")
              , a = t("./GenericWorker");
            function i(t) {
                a.call(this, "DataWorker");
                var e = this;
                this.dataIsReady = !1,
                this.index = 0,
                this.max = 0,
                this.data = null,
                this.type = "",
                this._tickScheduled = !1,
                t.then(function(t) {
                    e.dataIsReady = !0,
                    e.data = t,
                    e.max = t && t.length || 0,
                    e.type = n.getTypeOf(t),
                    e.isPaused || e._tickAndRepeat()
                }, function(t) {
                    e.error(t)
                })
            }
            n.inherits(i, a),
            i.prototype.cleanUp = function() {
                a.prototype.cleanUp.call(this),
                this.data = null
            }
            ,
            i.prototype.resume = function() {
                return !!a.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0,
                n.delay(this._tickAndRepeat, [], this)),
                !0)
            }
            ,
            i.prototype._tickAndRepeat = function() {
                this._tickScheduled = !1,
                this.isPaused || this.isFinished || (this._tick(),
                this.isFinished || (n.delay(this._tickAndRepeat, [], this),
                this._tickScheduled = !0))
            }
            ,
            i.prototype._tick = function() {
                if (this.isPaused || this.isFinished)
                    return !1;
                var t = null
                  , e = Math.min(this.max, this.index + 16384);
                if (this.index >= this.max)
                    return this.end();
                switch (this.type) {
                case "string":
                    t = this.data.substring(this.index, e);
                    break;
                case "uint8array":
                    t = this.data.subarray(this.index, e);
                    break;
                case "array":
                case "nodebuffer":
                    t = this.data.slice(this.index, e)
                }
                return this.index = e,
                this.push({
                    data: t,
                    meta: {
                        percent: this.max ? this.index / this.max * 100 : 0
                    }
                })
            }
            ,
            e.exports = i
        }
        , {
            "../utils": 32,
            "./GenericWorker": 28
        }],
        28: [function(t, e, r) {
            "use strict";
            function n(t) {
                this.name = t || "default",
                this.streamInfo = {},
                this.generatedError = null,
                this.extraStreamInfo = {},
                this.isPaused = !0,
                this.isFinished = !1,
                this.isLocked = !1,
                this._listeners = {
                    data: [],
                    end: [],
                    error: []
                },
                this.previous = null
            }
            n.prototype = {
                push: function(t) {
                    this.emit("data", t)
                },
                end: function() {
                    if (this.isFinished)
                        return !1;
                    this.flush();
                    try {
                        this.emit("end"),
                        this.cleanUp(),
                        this.isFinished = !0
                    } catch (t) {
                        this.emit("error", t)
                    }
                    return !0
                },
                error: function(t) {
                    return !this.isFinished && (this.isPaused ? this.generatedError = t : (this.isFinished = !0,
                    this.emit("error", t),
                    this.previous && this.previous.error(t),
                    this.cleanUp()),
                    !0)
                },
                on: function(t, e) {
                    return this._listeners[t].push(e),
                    this
                },
                cleanUp: function() {
                    this.streamInfo = this.generatedError = this.extraStreamInfo = null,
                    this._listeners = []
                },
                emit: function(t, e) {
                    if (this._listeners[t])
                        for (var r = 0; r < this._listeners[t].length; r++)
                            this._listeners[t][r].call(this, e)
                },
                pipe: function(t) {
                    return t.registerPrevious(this)
                },
                registerPrevious: function(t) {
                    if (this.isLocked)
                        throw new Error("The stream '" + this + "' has already been used.");
                    this.streamInfo = t.streamInfo,
                    this.mergeStreamInfo(),
                    this.previous = t;
                    var e = this;
                    return t.on("data", function(t) {
                        e.processChunk(t)
                    }),
                    t.on("end", function() {
                        e.end()
                    }),
                    t.on("error", function(t) {
                        e.error(t)
                    }),
                    this
                },
                pause: function() {
                    return !this.isPaused && !this.isFinished && (this.isPaused = !0,
                    this.previous && this.previous.pause(),
                    !0)
                },
                resume: function() {
                    if (!this.isPaused || this.isFinished)
                        return !1;
                    var t = this.isPaused = !1;
                    return this.generatedError && (this.error(this.generatedError),
                    t = !0),
                    this.previous && this.previous.resume(),
                    !t
                },
                flush: function() {},
                processChunk: function(t) {
                    this.push(t)
                },
                withStreamInfo: function(t, e) {
                    return this.extraStreamInfo[t] = e,
                    this.mergeStreamInfo(),
                    this
                },
                mergeStreamInfo: function() {
                    for (var t in this.extraStreamInfo)
                        this.extraStreamInfo.hasOwnProperty(t) && (this.streamInfo[t] = this.extraStreamInfo[t])
                },
                lock: function() {
                    if (this.isLocked)
                        throw new Error("The stream '" + this + "' has already been used.");
                    this.isLocked = !0,
                    this.previous && this.previous.lock()
                },
                toString: function() {
                    var t = "Worker " + this.name;
                    return this.previous ? this.previous + " -> " + t : t
                }
            },
            e.exports = n
        }
        , {}],
        29: [function(t, e, r) {
            "use strict";
            var l = t("../utils")
              , a = t("./ConvertWorker")
              , i = t("./GenericWorker")
              , c = t("../base64")
              , n = t("../support")
              , o = t("../external")
              , s = null;
            if (n.nodestream)
                try {
                    s = t("../nodejs/NodejsStreamOutputAdapter")
                } catch (t) {}
            function p(t, e, r) {
                var n = e;
                switch (e) {
                case "blob":
                case "arraybuffer":
                    n = "uint8array";
                    break;
                case "base64":
                    n = "string"
                }
                try {
                    this._internalType = n,
                    this._outputType = e,
                    this._mimeType = r,
                    l.checkSupport(n),
                    this._worker = t.pipe(new a(n)),
                    t.lock()
                } catch (t) {
                    this._worker = new i("error"),
                    this._worker.error(t)
                }
            }
            p.prototype = {
                accumulate: function(t) {
                    return function(t, s) {
                        return new o.Promise(function(e, r) {
                            var n = []
                              , a = t._internalType
                              , i = t._outputType
                              , o = t._mimeType;
                            t.on("data", function(t, e) {
                                n.push(t),
                                s && s(e)
                            }).on("error", function(t) {
                                n = [],
                                r(t)
                            }).on("end", function() {
                                try {
                                    var t = function(t, e, r) {
                                        switch (t) {
                                        case "blob":
                                            return l.newBlob(l.transformTo("arraybuffer", e), r);
                                        case "base64":
                                            return c.encode(e);
                                        default:
                                            return l.transformTo(t, e)
                                        }
                                    }(i, function(t, e) {
                                        var r, n = 0, a = null, i = 0;
                                        for (r = 0; r < e.length; r++)
                                            i += e[r].length;
                                        switch (t) {
                                        case "string":
                                            return e.join("");
                                        case "array":
                                            return Array.prototype.concat.apply([], e);
                                        case "uint8array":
                                            for (a = new Uint8Array(i),
                                            r = 0; r < e.length; r++)
                                                a.set(e[r], n),
                                                n += e[r].length;
                                            return a;
                                        case "nodebuffer":
                                            return Buffer.concat(e);
                                        default:
                                            throw new Error("concat : unsupported type '" + t + "'")
                                        }
                                    }(a, n), o);
                                    e(t)
                                } catch (t) {
                                    r(t)
                                }
                                n = []
                            }).resume()
                        }
                        )
                    }(this, t)
                },
                on: function(t, e) {
                    var r = this;
                    return "data" === t ? this._worker.on(t, function(t) {
                        e.call(r, t.data, t.meta)
                    }) : this._worker.on(t, function() {
                        l.delay(e, arguments, r)
                    }),
                    this
                },
                resume: function() {
                    return l.delay(this._worker.resume, [], this._worker),
                    this
                },
                pause: function() {
                    return this._worker.pause(),
                    this
                },
                toNodejsStream: function(t) {
                    if (l.checkSupport("nodestream"),
                    "nodebuffer" !== this._outputType)
                        throw new Error(this._outputType + " is not supported by this method");
                    return new s(this,{
                        objectMode: "nodebuffer" !== this._outputType
                    },t)
                }
            },
            e.exports = p
        }
        , {
            "../base64": 1,
            "../external": 6,
            "../nodejs/NodejsStreamOutputAdapter": 13,
            "../support": 30,
            "../utils": 32,
            "./ConvertWorker": 24,
            "./GenericWorker": 28
        }],
        30: [function(t, e, r) {
            "use strict";
            if (r.base64 = !0,
            r.array = !0,
            r.string = !0,
            r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array,
            r.nodebuffer = "undefined" != typeof Buffer,
            r.uint8array = "undefined" != typeof Uint8Array,
            "undefined" == typeof ArrayBuffer)
                r.blob = !1;
            else {
                var n = new ArrayBuffer(0);
                try {
                    r.blob = 0 === new Blob([n],{
                        type: "application/zip"
                    }).size
                } catch (t) {
                    try {
                        var a = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder);
                        a.append(n),
                        r.blob = 0 === a.getBlob("application/zip").size
                    } catch (t) {
                        r.blob = !1
                    }
                }
            }
            try {
                r.nodestream = !!t("readable-stream").Readable
            } catch (t) {
                r.nodestream = !1
            }
        }
        , {
            "readable-stream": 16
        }],
        31: [function(t, e, i) {
            "use strict";
            for (var s = t("./utils"), l = t("./support"), r = t("./nodejsUtils"), n = t("./stream/GenericWorker"), c = new Array(256), a = 0; a < 256; a++)
                c[a] = 252 <= a ? 6 : 248 <= a ? 5 : 240 <= a ? 4 : 224 <= a ? 3 : 192 <= a ? 2 : 1;
            function o() {
                n.call(this, "utf-8 decode"),
                this.leftOver = null
            }
            function p() {
                n.call(this, "utf-8 encode")
            }
            c[254] = c[254] = 1,
            i.utf8encode = function(t) {
                return l.nodebuffer ? r.newBufferFrom(t, "utf-8") : function(t) {
                    var e, r, n, a, i, o = t.length, s = 0;
                    for (a = 0; a < o; a++)
                        55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320),
                        a++),
                        s += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                    for (e = l.uint8array ? new Uint8Array(s) : new Array(s),
                    a = i = 0; i < s; a++)
                        55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320),
                        a++),
                        r < 128 ? e[i++] = r : (r < 2048 ? e[i++] = 192 | r >>> 6 : (r < 65536 ? e[i++] = 224 | r >>> 12 : (e[i++] = 240 | r >>> 18,
                        e[i++] = 128 | r >>> 12 & 63),
                        e[i++] = 128 | r >>> 6 & 63),
                        e[i++] = 128 | 63 & r);
                    return e
                }(t)
            }
            ,
            i.utf8decode = function(t) {
                return l.nodebuffer ? s.transformTo("nodebuffer", t).toString("utf-8") : function(t) {
                    var e, r, n, a, i = t.length, o = new Array(2 * i);
                    for (e = r = 0; e < i; )
                        if ((n = t[e++]) < 128)
                            o[r++] = n;
                        else if (4 < (a = c[n]))
                            o[r++] = 65533,
                            e += a - 1;
                        else {
                            for (n &= 2 === a ? 31 : 3 === a ? 15 : 7; 1 < a && e < i; )
                                n = n << 6 | 63 & t[e++],
                                a--;
                            1 < a ? o[r++] = 65533 : n < 65536 ? o[r++] = n : (n -= 65536,
                            o[r++] = 55296 | n >> 10 & 1023,
                            o[r++] = 56320 | 1023 & n)
                        }
                    return o.length !== r && (o.subarray ? o = o.subarray(0, r) : o.length = r),
                    s.applyFromCharCode(o)
                }(t = s.transformTo(l.uint8array ? "uint8array" : "array", t))
            }
            ,
            s.inherits(o, n),
            o.prototype.processChunk = function(t) {
                var e = s.transformTo(l.uint8array ? "uint8array" : "array", t.data);
                if (this.leftOver && this.leftOver.length) {
                    if (l.uint8array) {
                        var r = e;
                        (e = new Uint8Array(r.length + this.leftOver.length)).set(this.leftOver, 0),
                        e.set(r, this.leftOver.length)
                    } else
                        e = this.leftOver.concat(e);
                    this.leftOver = null
                }
                var n = function(t, e) {
                    var r;
                    for ((e = e || t.length) > t.length && (e = t.length),
                    r = e - 1; 0 <= r && 128 == (192 & t[r]); )
                        r--;
                    return r < 0 ? e : 0 === r ? e : r + c[t[r]] > e ? r : e
                }(e)
                  , a = e;
                n !== e.length && (l.uint8array ? (a = e.subarray(0, n),
                this.leftOver = e.subarray(n, e.length)) : (a = e.slice(0, n),
                this.leftOver = e.slice(n, e.length))),
                this.push({
                    data: i.utf8decode(a),
                    meta: t.meta
                })
            }
            ,
            o.prototype.flush = function() {
                this.leftOver && this.leftOver.length && (this.push({
                    data: i.utf8decode(this.leftOver),
                    meta: {}
                }),
                this.leftOver = null)
            }
            ,
            i.Utf8DecodeWorker = o,
            s.inherits(p, n),
            p.prototype.processChunk = function(t) {
                this.push({
                    data: i.utf8encode(t.data),
                    meta: t.meta
                })
            }
            ,
            i.Utf8EncodeWorker = p
        }
        , {
            "./nodejsUtils": 14,
            "./stream/GenericWorker": 28,
            "./support": 30,
            "./utils": 32
        }],
        32: [function(t, e, s) {
            "use strict";
            var l = t("./support")
              , c = t("./base64")
              , r = t("./nodejsUtils")
              , n = t("set-immediate-shim")
              , p = t("./external");
            function a(t) {
                return t
            }
            function u(t, e) {
                for (var r = 0; r < t.length; ++r)
                    e[r] = 255 & t.charCodeAt(r);
                return e
            }
            s.newBlob = function(e, r) {
                s.checkSupport("blob");
                try {
                    return new Blob([e],{
                        type: r
                    })
                } catch (t) {
                    try {
                        var n = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder);
                        return n.append(e),
                        n.getBlob(r)
                    } catch (t) {
                        throw new Error("Bug : can't construct the Blob.")
                    }
                }
            }
            ;
            var i = {
                stringifyByChunk: function(t, e, r) {
                    var n = []
                      , a = 0
                      , i = t.length;
                    if (i <= r)
                        return String.fromCharCode.apply(null, t);
                    for (; a < i; )
                        "array" === e || "nodebuffer" === e ? n.push(String.fromCharCode.apply(null, t.slice(a, Math.min(a + r, i)))) : n.push(String.fromCharCode.apply(null, t.subarray(a, Math.min(a + r, i)))),
                        a += r;
                    return n.join("")
                },
                stringifyByChar: function(t) {
                    for (var e = "", r = 0; r < t.length; r++)
                        e += String.fromCharCode(t[r]);
                    return e
                },
                applyCanBeUsed: {
                    uint8array: function() {
                        try {
                            return l.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length
                        } catch (t) {
                            return !1
                        }
                    }(),
                    nodebuffer: function() {
                        try {
                            return l.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length
                        } catch (t) {
                            return !1
                        }
                    }()
                }
            };
            function o(t) {
                var e = 65536
                  , r = s.getTypeOf(t)
                  , n = !0;
                if ("uint8array" === r ? n = i.applyCanBeUsed.uint8array : "nodebuffer" === r && (n = i.applyCanBeUsed.nodebuffer),
                n)
                    for (; 1 < e; )
                        try {
                            return i.stringifyByChunk(t, r, e)
                        } catch (t) {
                            e = Math.floor(e / 2)
                        }
                return i.stringifyByChar(t)
            }
            function f(t, e) {
                for (var r = 0; r < t.length; r++)
                    e[r] = t[r];
                return e
            }
            s.applyFromCharCode = o;
            var d = {};
            d.string = {
                string: a,
                array: function(t) {
                    return u(t, new Array(t.length))
                },
                arraybuffer: function(t) {
                    return d.string.uint8array(t).buffer
                },
                uint8array: function(t) {
                    return u(t, new Uint8Array(t.length))
                },
                nodebuffer: function(t) {
                    return u(t, r.allocBuffer(t.length))
                }
            },
            d.array = {
                string: o,
                array: a,
                arraybuffer: function(t) {
                    return new Uint8Array(t).buffer
                },
                uint8array: function(t) {
                    return new Uint8Array(t)
                },
                nodebuffer: function(t) {
                    return r.newBufferFrom(t)
                }
            },
            d.arraybuffer = {
                string: function(t) {
                    return o(new Uint8Array(t))
                },
                array: function(t) {
                    return f(new Uint8Array(t), new Array(t.byteLength))
                },
                arraybuffer: a,
                uint8array: function(t) {
                    return new Uint8Array(t)
                },
                nodebuffer: function(t) {
                    return r.newBufferFrom(new Uint8Array(t))
                }
            },
            d.uint8array = {
                string: o,
                array: function(t) {
                    return f(t, new Array(t.length))
                },
                arraybuffer: function(t) {
                    return t.buffer
                },
                uint8array: a,
                nodebuffer: function(t) {
                    return r.newBufferFrom(t)
                }
            },
            d.nodebuffer = {
                string: o,
                array: function(t) {
                    return f(t, new Array(t.length))
                },
                arraybuffer: function(t) {
                    return d.nodebuffer.uint8array(t).buffer
                },
                uint8array: function(t) {
                    return f(t, new Uint8Array(t.length))
                },
                nodebuffer: a
            },
            s.transformTo = function(t, e) {
                if (e = e || "",
                !t)
                    return e;
                s.checkSupport(t);
                var r = s.getTypeOf(e);
                return d[r][t](e)
            }
            ,
            s.getTypeOf = function(t) {
                return "string" == typeof t ? "string" : "[object Array]" === Object.prototype.toString.call(t) ? "array" : l.nodebuffer && r.isBuffer(t) ? "nodebuffer" : l.uint8array && t instanceof Uint8Array ? "uint8array" : l.arraybuffer && t instanceof ArrayBuffer ? "arraybuffer" : void 0
            }
            ,
            s.checkSupport = function(t) {
                if (!l[t.toLowerCase()])
                    throw new Error(t + " is not supported by this platform")
            }
            ,
            s.MAX_VALUE_16BITS = 65535,
            s.MAX_VALUE_32BITS = -1,
            s.pretty = function(t) {
                var e, r, n = "";
                for (r = 0; r < (t || "").length; r++)
                    n += "\\x" + ((e = t.charCodeAt(r)) < 16 ? "0" : "") + e.toString(16).toUpperCase();
                return n
            }
            ,
            s.delay = function(t, e, r) {
                n(function() {
                    t.apply(r || null, e || [])
                })
            }
            ,
            s.inherits = function(t, e) {
                function r() {}
                r.prototype = e.prototype,
                t.prototype = new r
            }
            ,
            s.extend = function() {
                var t, e, r = {};
                for (t = 0; t < arguments.length; t++)
                    for (e in arguments[t])
                        arguments[t].hasOwnProperty(e) && void 0 === r[e] && (r[e] = arguments[t][e]);
                return r
            }
            ,
            s.prepareContent = function(n, t, a, i, o) {
                return p.Promise.resolve(t).then(function(n) {
                    return l.blob && (n instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n))) && "undefined" != typeof FileReader ? new p.Promise(function(e, r) {
                        var t = new FileReader;
                        t.onload = function(t) {
                            e(t.target.result)
                        }
                        ,
                        t.onerror = function(t) {
                            r(t.target.error)
                        }
                        ,
                        t.readAsArrayBuffer(n)
                    }
                    ) : n
                }).then(function(t) {
                    var e, r = s.getTypeOf(t);
                    return r ? ("arraybuffer" === r ? t = s.transformTo("uint8array", t) : "string" === r && (o ? t = c.decode(t) : a && !0 !== i && (t = u(e = t, l.uint8array ? new Uint8Array(e.length) : new Array(e.length)))),
                    t) : p.Promise.reject(new Error("Can't read the data of '" + n + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))
                })
            }
        }
        , {
            "./base64": 1,
            "./external": 6,
            "./nodejsUtils": 14,
            "./support": 30,
            "set-immediate-shim": 54
        }],
        33: [function(t, e, r) {
            "use strict";
            var n = t("./reader/readerFor")
              , a = t("./utils")
              , i = t("./signature")
              , o = t("./zipEntry")
              , s = (t("./utf8"),
            t("./support"));
            function l(t) {
                this.files = [],
                this.loadOptions = t
            }
            l.prototype = {
                checkSignature: function(t) {
                    if (!this.reader.readAndCheckSignature(t)) {
                        this.reader.index -= 4;
                        var e = this.reader.readString(4);
                        throw new Error("Corrupted zip or bug: unexpected signature (" + a.pretty(e) + ", expected " + a.pretty(t) + ")")
                    }
                },
                isSignature: function(t, e) {
                    var r = this.reader.index;
                    this.reader.setIndex(t);
                    var n = this.reader.readString(4) === e;
                    return this.reader.setIndex(r),
                    n
                },
                readBlockEndOfCentral: function() {
                    this.diskNumber = this.reader.readInt(2),
                    this.diskWithCentralDirStart = this.reader.readInt(2),
                    this.centralDirRecordsOnThisDisk = this.reader.readInt(2),
                    this.centralDirRecords = this.reader.readInt(2),
                    this.centralDirSize = this.reader.readInt(4),
                    this.centralDirOffset = this.reader.readInt(4),
                    this.zipCommentLength = this.reader.readInt(2);
                    var t = this.reader.readData(this.zipCommentLength)
                      , e = s.uint8array ? "uint8array" : "array"
                      , r = a.transformTo(e, t);
                    this.zipComment = this.loadOptions.decodeFileName(r)
                },
                readBlockZip64EndOfCentral: function() {
                    this.zip64EndOfCentralSize = this.reader.readInt(8),
                    this.reader.skip(4),
                    this.diskNumber = this.reader.readInt(4),
                    this.diskWithCentralDirStart = this.reader.readInt(4),
                    this.centralDirRecordsOnThisDisk = this.reader.readInt(8),
                    this.centralDirRecords = this.reader.readInt(8),
                    this.centralDirSize = this.reader.readInt(8),
                    this.centralDirOffset = this.reader.readInt(8),
                    this.zip64ExtensibleData = {};
                    for (var t, e, r, n = this.zip64EndOfCentralSize - 44; 0 < n; )
                        t = this.reader.readInt(2),
                        e = this.reader.readInt(4),
                        r = this.reader.readData(e),
                        this.zip64ExtensibleData[t] = {
                            id: t,
                            length: e,
                            value: r
                        }
                },
                readBlockZip64EndOfCentralLocator: function() {
                    if (this.diskWithZip64CentralDirStart = this.reader.readInt(4),
                    this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8),
                    this.disksCount = this.reader.readInt(4),
                    1 < this.disksCount)
                        throw new Error("Multi-volumes zip are not supported")
                },
                readLocalFiles: function() {
                    var t, e;
                    for (t = 0; t < this.files.length; t++)
                        e = this.files[t],
                        this.reader.setIndex(e.localHeaderOffset),
                        this.checkSignature(i.LOCAL_FILE_HEADER),
                        e.readLocalPart(this.reader),
                        e.handleUTF8(),
                        e.processAttributes()
                },
                readCentralDir: function() {
                    var t;
                    for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(i.CENTRAL_FILE_HEADER); )
                        (t = new o({
                            zip64: this.zip64
                        },this.loadOptions)).readCentralPart(this.reader),
                        this.files.push(t);
                    if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length)
                        throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length)
                },
                readEndOfCentral: function() {
                    var t = this.reader.lastIndexOfSignature(i.CENTRAL_DIRECTORY_END);
                    if (t < 0)
                        throw this.isSignature(0, i.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
                    this.reader.setIndex(t);
                    var e = t;
                    if (this.checkSignature(i.CENTRAL_DIRECTORY_END),
                    this.readBlockEndOfCentral(),
                    this.diskNumber === a.MAX_VALUE_16BITS || this.diskWithCentralDirStart === a.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === a.MAX_VALUE_16BITS || this.centralDirRecords === a.MAX_VALUE_16BITS || this.centralDirSize === a.MAX_VALUE_32BITS || this.centralDirOffset === a.MAX_VALUE_32BITS) {
                        if (this.zip64 = !0,
                        (t = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
                            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
                        if (this.reader.setIndex(t),
                        this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR),
                        this.readBlockZip64EndOfCentralLocator(),
                        !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, i.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_END),
                        this.relativeOffsetEndOfZip64CentralDir < 0))
                            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
                        this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),
                        this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_END),
                        this.readBlockZip64EndOfCentral()
                    }
                    var r = this.centralDirOffset + this.centralDirSize;
                    this.zip64 && (r += 20,
                    r += 12 + this.zip64EndOfCentralSize);
                    var n = e - r;
                    if (0 < n)
                        this.isSignature(e, i.CENTRAL_FILE_HEADER) || (this.reader.zero = n);
                    else if (n < 0)
                        throw new Error("Corrupted zip: missing " + Math.abs(n) + " bytes.")
                },
                prepareReader: function(t) {
                    this.reader = n(t)
                },
                load: function(t) {
                    this.prepareReader(t),
                    this.readEndOfCentral(),
                    this.readCentralDir(),
                    this.readLocalFiles()
                }
            },
            e.exports = l
        }
        , {
            "./reader/readerFor": 22,
            "./signature": 23,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32,
            "./zipEntry": 34
        }],
        34: [function(t, e, r) {
            "use strict";
            var n = t("./reader/readerFor")
              , i = t("./utils")
              , a = t("./compressedObject")
              , o = t("./crc32")
              , s = t("./utf8")
              , l = t("./compressions")
              , c = t("./support");
            function p(t, e) {
                this.options = t,
                this.loadOptions = e
            }
            p.prototype = {
                isEncrypted: function() {
                    return 1 == (1 & this.bitFlag)
                },
                useUTF8: function() {
                    return 2048 == (2048 & this.bitFlag)
                },
                readLocalPart: function(t) {
                    var e, r;
                    if (t.skip(22),
                    this.fileNameLength = t.readInt(2),
                    r = t.readInt(2),
                    this.fileName = t.readData(this.fileNameLength),
                    t.skip(r),
                    -1 === this.compressedSize || -1 === this.uncompressedSize)
                        throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize === -1 || uncompressedSize === -1)");
                    if (null === (e = function(t) {
                        for (var e in l)
                            if (l.hasOwnProperty(e) && l[e].magic === t)
                                return l[e];
                        return null
                    }(this.compressionMethod)))
                        throw new Error("Corrupted zip : compression " + i.pretty(this.compressionMethod) + " unknown (inner file : " + i.transformTo("string", this.fileName) + ")");
                    this.decompressed = new a(this.compressedSize,this.uncompressedSize,this.crc32,e,t.readData(this.compressedSize))
                },
                readCentralPart: function(t) {
                    this.versionMadeBy = t.readInt(2),
                    t.skip(2),
                    this.bitFlag = t.readInt(2),
                    this.compressionMethod = t.readString(2),
                    this.date = t.readDate(),
                    this.crc32 = t.readInt(4),
                    this.compressedSize = t.readInt(4),
                    this.uncompressedSize = t.readInt(4);
                    var e = t.readInt(2);
                    if (this.extraFieldsLength = t.readInt(2),
                    this.fileCommentLength = t.readInt(2),
                    this.diskNumberStart = t.readInt(2),
                    this.internalFileAttributes = t.readInt(2),
                    this.externalFileAttributes = t.readInt(4),
                    this.localHeaderOffset = t.readInt(4),
                    this.isEncrypted())
                        throw new Error("Encrypted zip are not supported");
                    t.skip(e),
                    this.readExtraFields(t),
                    this.parseZIP64ExtraField(t),
                    this.fileComment = t.readData(this.fileCommentLength)
                },
                processAttributes: function() {
                    this.unixPermissions = null,
                    this.dosPermissions = null;
                    var t = this.versionMadeBy >> 8;
                    this.dir = !!(16 & this.externalFileAttributes),
                    0 == t && (this.dosPermissions = 63 & this.externalFileAttributes),
                    3 == t && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535),
                    this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0)
                },
                parseZIP64ExtraField: function(t) {
                    if (this.extraFields[1]) {
                        var e = n(this.extraFields[1].value);
                        this.uncompressedSize === i.MAX_VALUE_32BITS && (this.uncompressedSize = e.readInt(8)),
                        this.compressedSize === i.MAX_VALUE_32BITS && (this.compressedSize = e.readInt(8)),
                        this.localHeaderOffset === i.MAX_VALUE_32BITS && (this.localHeaderOffset = e.readInt(8)),
                        this.diskNumberStart === i.MAX_VALUE_32BITS && (this.diskNumberStart = e.readInt(4))
                    }
                },
                readExtraFields: function(t) {
                    var e, r, n, a = t.index + this.extraFieldsLength;
                    for (this.extraFields || (this.extraFields = {}); t.index < a; )
                        e = t.readInt(2),
                        r = t.readInt(2),
                        n = t.readData(r),
                        this.extraFields[e] = {
                            id: e,
                            length: r,
                            value: n
                        }
                },
                handleUTF8: function() {
                    var t = c.uint8array ? "uint8array" : "array";
                    if (this.useUTF8())
                        this.fileNameStr = s.utf8decode(this.fileName),
                        this.fileCommentStr = s.utf8decode(this.fileComment);
                    else {
                        var e = this.findExtraFieldUnicodePath();
                        if (null !== e)
                            this.fileNameStr = e;
                        else {
                            var r = i.transformTo(t, this.fileName);
                            this.fileNameStr = this.loadOptions.decodeFileName(r)
                        }
                        var n = this.findExtraFieldUnicodeComment();
                        if (null !== n)
                            this.fileCommentStr = n;
                        else {
                            var a = i.transformTo(t, this.fileComment);
                            this.fileCommentStr = this.loadOptions.decodeFileName(a)
                        }
                    }
                },
                findExtraFieldUnicodePath: function() {
                    var t = this.extraFields[28789];
                    if (t) {
                        var e = n(t.value);
                        return 1 !== e.readInt(1) ? null : o(this.fileName) !== e.readInt(4) ? null : s.utf8decode(e.readData(t.length - 5))
                    }
                    return null
                },
                findExtraFieldUnicodeComment: function() {
                    var t = this.extraFields[25461];
                    if (t) {
                        var e = n(t.value);
                        return 1 !== e.readInt(1) ? null : o(this.fileComment) !== e.readInt(4) ? null : s.utf8decode(e.readData(t.length - 5))
                    }
                    return null
                }
            },
            e.exports = p
        }
        , {
            "./compressedObject": 2,
            "./compressions": 3,
            "./crc32": 4,
            "./reader/readerFor": 22,
            "./support": 30,
            "./utf8": 31,
            "./utils": 32
        }],
        35: [function(t, e, r) {
            "use strict";
            function n(t, e, r) {
                this.name = t,
                this.dir = r.dir,
                this.date = r.date,
                this.comment = r.comment,
                this.unixPermissions = r.unixPermissions,
                this.dosPermissions = r.dosPermissions,
                this._data = e,
                this._dataBinary = r.binary,
                this.options = {
                    compression: r.compression,
                    compressionOptions: r.compressionOptions
                }
            }
            var i = t("./stream/StreamHelper")
              , a = t("./stream/DataWorker")
              , o = t("./utf8")
              , s = t("./compressedObject")
              , l = t("./stream/GenericWorker");
            n.prototype = {
                internalStream: function(t) {
                    var e = null
                      , r = "string";
                    try {
                        if (!t)
                            throw new Error("No output type specified.");
                        var n = "string" === (r = t.toLowerCase()) || "text" === r;
                        "binarystring" !== r && "text" !== r || (r = "string"),
                        e = this._decompressWorker();
                        var a = !this._dataBinary;
                        a && !n && (e = e.pipe(new o.Utf8EncodeWorker)),
                        !a && n && (e = e.pipe(new o.Utf8DecodeWorker))
                    } catch (t) {
                        (e = new l("error")).error(t)
                    }
                    return new i(e,r,"")
                },
                async: function(t, e) {
                    return this.internalStream(t).accumulate(e)
                },
                nodeStream: function(t, e) {
                    return this.internalStream(t || "nodebuffer").toNodejsStream(e)
                },
                _compressWorker: function(t, e) {
                    if (this._data instanceof s && this._data.compression.magic === t.magic)
                        return this._data.getCompressedWorker();
                    var r = this._decompressWorker();
                    return this._dataBinary || (r = r.pipe(new o.Utf8EncodeWorker)),
                    s.createWorkerFrom(r, t, e)
                },
                _decompressWorker: function() {
                    return this._data instanceof s ? this._data.getContentWorker() : this._data instanceof l ? this._data : new a(this._data)
                }
            };
            for (var c = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], p = function() {
                throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")
            }, u = 0; u < c.length; u++)
                n.prototype[c[u]] = p;
            e.exports = n
        }
        , {
            "./compressedObject": 2,
            "./stream/DataWorker": 27,
            "./stream/GenericWorker": 28,
            "./stream/StreamHelper": 29,
            "./utf8": 31
        }],
        36: [function(t, p, e) {
            (function(e) {
                "use strict";
                var r, n, t = e.MutationObserver || e.WebKitMutationObserver;
                if (t) {
                    var a = 0
                      , i = new t(c)
                      , o = e.document.createTextNode("");
                    i.observe(o, {
                        characterData: !0
                    }),
                    r = function() {
                        o.data = a = ++a % 2
                    }
                } else if (e.setImmediate || void 0 === e.MessageChannel)
                    r = "document"in e && "onreadystatechange"in e.document.createElement("script") ? function() {
                        var t = e.document.createElement("script");
                        t.onreadystatechange = function() {
                            c(),
                            t.onreadystatechange = null,
                            t.parentNode.removeChild(t),
                            t = null
                        }
                        ,
                        e.document.documentElement.appendChild(t)
                    }
                    : function() {
                        setTimeout(c, 0)
                    }
                    ;
                else {
                    var s = new e.MessageChannel;
                    s.port1.onmessage = c,
                    r = function() {
                        s.port2.postMessage(0)
                    }
                }
                var l = [];
                function c() {
                    var t, e;
                    n = !0;
                    for (var r = l.length; r; ) {
                        for (e = l,
                        l = [],
                        t = -1; ++t < r; )
                            e[t]();
                        r = l.length
                    }
                    n = !1
                }
                p.exports = function(t) {
                    1 !== l.push(t) || n || r()
                }
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        37: [function(t, e, r) {
            "use strict";
            var a = t("immediate");
            function c() {}
            var p = {}
              , i = ["REJECTED"]
              , o = ["FULFILLED"]
              , n = ["PENDING"];
            function s(t) {
                if ("function" != typeof t)
                    throw new TypeError("resolver must be a function");
                this.state = n,
                this.queue = [],
                this.outcome = void 0,
                t !== c && d(this, t)
            }
            function l(t, e, r) {
                this.promise = t,
                "function" == typeof e && (this.onFulfilled = e,
                this.callFulfilled = this.otherCallFulfilled),
                "function" == typeof r && (this.onRejected = r,
                this.callRejected = this.otherCallRejected)
            }
            function u(e, r, n) {
                a(function() {
                    var t;
                    try {
                        t = r(n)
                    } catch (t) {
                        return p.reject(e, t)
                    }
                    t === e ? p.reject(e, new TypeError("Cannot resolve promise with itself")) : p.resolve(e, t)
                })
            }
            function f(t) {
                var e = t && t.then;
                if (t && ("object" == typeof t || "function" == typeof t) && "function" == typeof e)
                    return function() {
                        e.apply(t, arguments)
                    }
            }
            function d(e, t) {
                var r = !1;
                function n(t) {
                    r || (r = !0,
                    p.reject(e, t))
                }
                function a(t) {
                    r || (r = !0,
                    p.resolve(e, t))
                }
                var i = h(function() {
                    t(a, n)
                });
                "error" === i.status && n(i.value)
            }
            function h(t, e) {
                var r = {};
                try {
                    r.value = t(e),
                    r.status = "success"
                } catch (t) {
                    r.status = "error",
                    r.value = t
                }
                return r
            }
            (e.exports = s).prototype.finally = function(e) {
                if ("function" != typeof e)
                    return this;
                var r = this.constructor;
                return this.then(function(t) {
                    return r.resolve(e()).then(function() {
                        return t
                    })
                }, function(t) {
                    return r.resolve(e()).then(function() {
                        throw t
                    })
                })
            }
            ,
            s.prototype.catch = function(t) {
                return this.then(null, t)
            }
            ,
            s.prototype.then = function(t, e) {
                if ("function" != typeof t && this.state === o || "function" != typeof e && this.state === i)
                    return this;
                var r = new this.constructor(c);
                return this.state !== n ? u(r, this.state === o ? t : e, this.outcome) : this.queue.push(new l(r,t,e)),
                r
            }
            ,
            l.prototype.callFulfilled = function(t) {
                p.resolve(this.promise, t)
            }
            ,
            l.prototype.otherCallFulfilled = function(t) {
                u(this.promise, this.onFulfilled, t)
            }
            ,
            l.prototype.callRejected = function(t) {
                p.reject(this.promise, t)
            }
            ,
            l.prototype.otherCallRejected = function(t) {
                u(this.promise, this.onRejected, t)
            }
            ,
            p.resolve = function(t, e) {
                var r = h(f, e);
                if ("error" === r.status)
                    return p.reject(t, r.value);
                var n = r.value;
                if (n)
                    d(t, n);
                else {
                    t.state = o,
                    t.outcome = e;
                    for (var a = -1, i = t.queue.length; ++a < i; )
                        t.queue[a].callFulfilled(e)
                }
                return t
            }
            ,
            p.reject = function(t, e) {
                t.state = i,
                t.outcome = e;
                for (var r = -1, n = t.queue.length; ++r < n; )
                    t.queue[r].callRejected(e);
                return t
            }
            ,
            s.resolve = function(t) {
                return t instanceof this ? t : p.resolve(new this(c), t)
            }
            ,
            s.reject = function(t) {
                var e = new this(c);
                return p.reject(e, t)
            }
            ,
            s.all = function(t) {
                var r = this;
                if ("[object Array]" !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError("must be an array"));
                var n = t.length
                  , a = !1;
                if (!n)
                    return this.resolve([]);
                for (var i = new Array(n), o = 0, e = -1, s = new this(c); ++e < n; )
                    l(t[e], e);
                return s;
                function l(t, e) {
                    r.resolve(t).then(function(t) {
                        i[e] = t,
                        ++o !== n || a || (a = !0,
                        p.resolve(s, i))
                    }, function(t) {
                        a || (a = !0,
                        p.reject(s, t))
                    })
                }
            }
            ,
            s.race = function(t) {
                if ("[object Array]" !== Object.prototype.toString.call(t))
                    return this.reject(new TypeError("must be an array"));
                var e = t.length
                  , r = !1;
                if (!e)
                    return this.resolve([]);
                for (var n, a = -1, i = new this(c); ++a < e; )
                    n = t[a],
                    this.resolve(n).then(function(t) {
                        r || (r = !0,
                        p.resolve(i, t))
                    }, function(t) {
                        r || (r = !0,
                        p.reject(i, t))
                    });
                return i
            }
        }
        , {
            immediate: 36
        }],
        38: [function(t, e, r) {
            "use strict";
            var n = {};
            (0,
            t("./lib/utils/common").assign)(n, t("./lib/deflate"), t("./lib/inflate"), t("./lib/zlib/constants")),
            e.exports = n
        }
        , {
            "./lib/deflate": 39,
            "./lib/inflate": 40,
            "./lib/utils/common": 41,
            "./lib/zlib/constants": 44
        }],
        39: [function(t, e, r) {
            "use strict";
            var o = t("./zlib/deflate")
              , s = t("./utils/common")
              , l = t("./utils/strings")
              , a = t("./zlib/messages")
              , i = t("./zlib/zstream")
              , c = Object.prototype.toString
              , p = 0
              , u = -1
              , f = 0
              , d = 8;
            function h(t) {
                if (!(this instanceof h))
                    return new h(t);
                this.options = s.assign({
                    level: u,
                    method: d,
                    chunkSize: 16384,
                    windowBits: 15,
                    memLevel: 8,
                    strategy: f,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && 0 < e.windowBits ? e.windowBits = -e.windowBits : e.gzip && 0 < e.windowBits && e.windowBits < 16 && (e.windowBits += 16),
                this.err = 0,
                this.msg = "",
                this.ended = !1,
                this.chunks = [],
                this.strm = new i,
                this.strm.avail_out = 0;
                var r = o.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);
                if (r !== p)
                    throw new Error(a[r]);
                if (e.header && o.deflateSetHeader(this.strm, e.header),
                e.dictionary) {
                    var n;
                    if (n = "string" == typeof e.dictionary ? l.string2buf(e.dictionary) : "[object ArrayBuffer]" === c.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary,
                    (r = o.deflateSetDictionary(this.strm, n)) !== p)
                        throw new Error(a[r]);
                    this._dict_set = !0
                }
            }
            function n(t, e) {
                var r = new h(e);
                if (r.push(t, !0),
                r.err)
                    throw r.msg || a[r.err];
                return r.result
            }
            h.prototype.push = function(t, e) {
                var r, n, a = this.strm, i = this.options.chunkSize;
                if (this.ended)
                    return !1;
                n = e === ~~e ? e : !0 === e ? 4 : 0,
                "string" == typeof t ? a.input = l.string2buf(t) : "[object ArrayBuffer]" === c.call(t) ? a.input = new Uint8Array(t) : a.input = t,
                a.next_in = 0,
                a.avail_in = a.input.length;
                do {
                    if (0 === a.avail_out && (a.output = new s.Buf8(i),
                    a.next_out = 0,
                    a.avail_out = i),
                    1 !== (r = o.deflate(a, n)) && r !== p)
                        return this.onEnd(r),
                        !(this.ended = !0);
                    0 !== a.avail_out && (0 !== a.avail_in || 4 !== n && 2 !== n) || ("string" === this.options.to ? this.onData(l.buf2binstring(s.shrinkBuf(a.output, a.next_out))) : this.onData(s.shrinkBuf(a.output, a.next_out)))
                } while ((0 < a.avail_in || 0 === a.avail_out) && 1 !== r);return 4 === n ? (r = o.deflateEnd(this.strm),
                this.onEnd(r),
                this.ended = !0,
                r === p) : 2 !== n || (this.onEnd(p),
                !(a.avail_out = 0))
            }
            ,
            h.prototype.onData = function(t) {
                this.chunks.push(t)
            }
            ,
            h.prototype.onEnd = function(t) {
                t === p && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = s.flattenChunks(this.chunks)),
                this.chunks = [],
                this.err = t,
                this.msg = this.strm.msg
            }
            ,
            r.Deflate = h,
            r.deflate = n,
            r.deflateRaw = function(t, e) {
                return (e = e || {}).raw = !0,
                n(t, e)
            }
            ,
            r.gzip = function(t, e) {
                return (e = e || {}).gzip = !0,
                n(t, e)
            }
        }
        , {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/deflate": 46,
            "./zlib/messages": 51,
            "./zlib/zstream": 53
        }],
        40: [function(t, e, r) {
            "use strict";
            var f = t("./zlib/inflate")
              , d = t("./utils/common")
              , h = t("./utils/strings")
              , m = t("./zlib/constants")
              , n = t("./zlib/messages")
              , a = t("./zlib/zstream")
              , i = t("./zlib/gzheader")
              , g = Object.prototype.toString;
            function o(t) {
                if (!(this instanceof o))
                    return new o(t);
                this.options = d.assign({
                    chunkSize: 16384,
                    windowBits: 0,
                    to: ""
                }, t || {});
                var e = this.options;
                e.raw && 0 <= e.windowBits && e.windowBits < 16 && (e.windowBits = -e.windowBits,
                0 === e.windowBits && (e.windowBits = -15)),
                !(0 <= e.windowBits && e.windowBits < 16) || t && t.windowBits || (e.windowBits += 32),
                15 < e.windowBits && e.windowBits < 48 && 0 == (15 & e.windowBits) && (e.windowBits |= 15),
                this.err = 0,
                this.msg = "",
                this.ended = !1,
                this.chunks = [],
                this.strm = new a,
                this.strm.avail_out = 0;
                var r = f.inflateInit2(this.strm, e.windowBits);
                if (r !== m.Z_OK)
                    throw new Error(n[r]);
                this.header = new i,
                f.inflateGetHeader(this.strm, this.header)
            }
            function s(t, e) {
                var r = new o(e);
                if (r.push(t, !0),
                r.err)
                    throw r.msg || n[r.err];
                return r.result
            }
            o.prototype.push = function(t, e) {
                var r, n, a, i, o, s, l = this.strm, c = this.options.chunkSize, p = this.options.dictionary, u = !1;
                if (this.ended)
                    return !1;
                n = e === ~~e ? e : !0 === e ? m.Z_FINISH : m.Z_NO_FLUSH,
                "string" == typeof t ? l.input = h.binstring2buf(t) : "[object ArrayBuffer]" === g.call(t) ? l.input = new Uint8Array(t) : l.input = t,
                l.next_in = 0,
                l.avail_in = l.input.length;
                do {
                    if (0 === l.avail_out && (l.output = new d.Buf8(c),
                    l.next_out = 0,
                    l.avail_out = c),
                    (r = f.inflate(l, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && p && (s = "string" == typeof p ? h.string2buf(p) : "[object ArrayBuffer]" === g.call(p) ? new Uint8Array(p) : p,
                    r = f.inflateSetDictionary(this.strm, s)),
                    r === m.Z_BUF_ERROR && !0 === u && (r = m.Z_OK,
                    u = !1),
                    r !== m.Z_STREAM_END && r !== m.Z_OK)
                        return this.onEnd(r),
                        !(this.ended = !0);
                    l.next_out && (0 !== l.avail_out && r !== m.Z_STREAM_END && (0 !== l.avail_in || n !== m.Z_FINISH && n !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (a = h.utf8border(l.output, l.next_out),
                    i = l.next_out - a,
                    o = h.buf2string(l.output, a),
                    l.next_out = i,
                    l.avail_out = c - i,
                    i && d.arraySet(l.output, l.output, a, i, 0),
                    this.onData(o)) : this.onData(d.shrinkBuf(l.output, l.next_out)))),
                    0 === l.avail_in && 0 === l.avail_out && (u = !0)
                } while ((0 < l.avail_in || 0 === l.avail_out) && r !== m.Z_STREAM_END);return r === m.Z_STREAM_END && (n = m.Z_FINISH),
                n === m.Z_FINISH ? (r = f.inflateEnd(this.strm),
                this.onEnd(r),
                this.ended = !0,
                r === m.Z_OK) : n !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK),
                !(l.avail_out = 0))
            }
            ,
            o.prototype.onData = function(t) {
                this.chunks.push(t)
            }
            ,
            o.prototype.onEnd = function(t) {
                t === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)),
                this.chunks = [],
                this.err = t,
                this.msg = this.strm.msg
            }
            ,
            r.Inflate = o,
            r.inflate = s,
            r.inflateRaw = function(t, e) {
                return (e = e || {}).raw = !0,
                s(t, e)
            }
            ,
            r.ungzip = s
        }
        , {
            "./utils/common": 41,
            "./utils/strings": 42,
            "./zlib/constants": 44,
            "./zlib/gzheader": 47,
            "./zlib/inflate": 49,
            "./zlib/messages": 51,
            "./zlib/zstream": 53
        }],
        41: [function(t, e, r) {
            "use strict";
            var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
            r.assign = function(t) {
                for (var e = Array.prototype.slice.call(arguments, 1); e.length; ) {
                    var r = e.shift();
                    if (r) {
                        if ("object" != typeof r)
                            throw new TypeError(r + "must be non-object");
                        for (var n in r)
                            r.hasOwnProperty(n) && (t[n] = r[n])
                    }
                }
                return t
            }
            ,
            r.shrinkBuf = function(t, e) {
                return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e,
                t)
            }
            ;
            var a = {
                arraySet: function(t, e, r, n, a) {
                    if (e.subarray && t.subarray)
                        t.set(e.subarray(r, r + n), a);
                    else
                        for (var i = 0; i < n; i++)
                            t[a + i] = e[r + i]
                },
                flattenChunks: function(t) {
                    var e, r, n, a, i, o;
                    for (e = n = 0,
                    r = t.length; e < r; e++)
                        n += t[e].length;
                    for (o = new Uint8Array(n),
                    e = a = 0,
                    r = t.length; e < r; e++)
                        i = t[e],
                        o.set(i, a),
                        a += i.length;
                    return o
                }
            }
              , i = {
                arraySet: function(t, e, r, n, a) {
                    for (var i = 0; i < n; i++)
                        t[a + i] = e[r + i]
                },
                flattenChunks: function(t) {
                    return [].concat.apply([], t)
                }
            };
            r.setTyped = function(t) {
                t ? (r.Buf8 = Uint8Array,
                r.Buf16 = Uint16Array,
                r.Buf32 = Int32Array,
                r.assign(r, a)) : (r.Buf8 = Array,
                r.Buf16 = Array,
                r.Buf32 = Array,
                r.assign(r, i))
            }
            ,
            r.setTyped(n)
        }
        , {}],
        42: [function(t, e, r) {
            "use strict";
            var l = t("./common")
              , a = !0
              , i = !0;
            try {
                String.fromCharCode.apply(null, [0])
            } catch (t) {
                a = !1
            }
            try {
                String.fromCharCode.apply(null, new Uint8Array(1))
            } catch (t) {
                i = !1
            }
            for (var c = new l.Buf8(256), n = 0; n < 256; n++)
                c[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
            function p(t, e) {
                if (e < 65537 && (t.subarray && i || !t.subarray && a))
                    return String.fromCharCode.apply(null, l.shrinkBuf(t, e));
                for (var r = "", n = 0; n < e; n++)
                    r += String.fromCharCode(t[n]);
                return r
            }
            c[254] = c[254] = 1,
            r.string2buf = function(t) {
                var e, r, n, a, i, o = t.length, s = 0;
                for (a = 0; a < o; a++)
                    55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320),
                    a++),
                    s += r < 128 ? 1 : r < 2048 ? 2 : r < 65536 ? 3 : 4;
                for (e = new l.Buf8(s),
                a = i = 0; i < s; a++)
                    55296 == (64512 & (r = t.charCodeAt(a))) && a + 1 < o && 56320 == (64512 & (n = t.charCodeAt(a + 1))) && (r = 65536 + (r - 55296 << 10) + (n - 56320),
                    a++),
                    r < 128 ? e[i++] = r : (r < 2048 ? e[i++] = 192 | r >>> 6 : (r < 65536 ? e[i++] = 224 | r >>> 12 : (e[i++] = 240 | r >>> 18,
                    e[i++] = 128 | r >>> 12 & 63),
                    e[i++] = 128 | r >>> 6 & 63),
                    e[i++] = 128 | 63 & r);
                return e
            }
            ,
            r.buf2binstring = function(t) {
                return p(t, t.length)
            }
            ,
            r.binstring2buf = function(t) {
                for (var e = new l.Buf8(t.length), r = 0, n = e.length; r < n; r++)
                    e[r] = t.charCodeAt(r);
                return e
            }
            ,
            r.buf2string = function(t, e) {
                var r, n, a, i, o = e || t.length, s = new Array(2 * o);
                for (r = n = 0; r < o; )
                    if ((a = t[r++]) < 128)
                        s[n++] = a;
                    else if (4 < (i = c[a]))
                        s[n++] = 65533,
                        r += i - 1;
                    else {
                        for (a &= 2 === i ? 31 : 3 === i ? 15 : 7; 1 < i && r < o; )
                            a = a << 6 | 63 & t[r++],
                            i--;
                        1 < i ? s[n++] = 65533 : a < 65536 ? s[n++] = a : (a -= 65536,
                        s[n++] = 55296 | a >> 10 & 1023,
                        s[n++] = 56320 | 1023 & a)
                    }
                return p(s, n)
            }
            ,
            r.utf8border = function(t, e) {
                var r;
                for ((e = e || t.length) > t.length && (e = t.length),
                r = e - 1; 0 <= r && 128 == (192 & t[r]); )
                    r--;
                return r < 0 ? e : 0 === r ? e : r + c[t[r]] > e ? r : e
            }
        }
        , {
            "./common": 41
        }],
        43: [function(t, e, r) {
            "use strict";
            e.exports = function(t, e, r, n) {
                for (var a = 65535 & t | 0, i = t >>> 16 & 65535 | 0, o = 0; 0 !== r; ) {
                    for (r -= o = 2e3 < r ? 2e3 : r; i = i + (a = a + e[n++] | 0) | 0,
                    --o; )
                        ;
                    a %= 65521,
                    i %= 65521
                }
                return a | i << 16 | 0
            }
        }
        , {}],
        44: [function(t, e, r) {
            "use strict";
            e.exports = {
                Z_NO_FLUSH: 0,
                Z_PARTIAL_FLUSH: 1,
                Z_SYNC_FLUSH: 2,
                Z_FULL_FLUSH: 3,
                Z_FINISH: 4,
                Z_BLOCK: 5,
                Z_TREES: 6,
                Z_OK: 0,
                Z_STREAM_END: 1,
                Z_NEED_DICT: 2,
                Z_ERRNO: -1,
                Z_STREAM_ERROR: -2,
                Z_DATA_ERROR: -3,
                Z_BUF_ERROR: -5,
                Z_NO_COMPRESSION: 0,
                Z_BEST_SPEED: 1,
                Z_BEST_COMPRESSION: 9,
                Z_DEFAULT_COMPRESSION: -1,
                Z_FILTERED: 1,
                Z_HUFFMAN_ONLY: 2,
                Z_RLE: 3,
                Z_FIXED: 4,
                Z_DEFAULT_STRATEGY: 0,
                Z_BINARY: 0,
                Z_TEXT: 1,
                Z_UNKNOWN: 2,
                Z_DEFLATED: 8
            }
        }
        , {}],
        45: [function(t, e, r) {
            "use strict";
            var s = function() {
                for (var t, e = [], r = 0; r < 256; r++) {
                    t = r;
                    for (var n = 0; n < 8; n++)
                        t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
                    e[r] = t
                }
                return e
            }();
            e.exports = function(t, e, r, n) {
                var a = s
                  , i = n + r;
                t ^= -1;
                for (var o = n; o < i; o++)
                    t = t >>> 8 ^ a[255 & (t ^ e[o])];
                return -1 ^ t
            }
        }
        , {}],
        46: [function(t, e, r) {
            "use strict";
            var l, f = t("../utils/common"), c = t("./trees"), d = t("./adler32"), h = t("./crc32"), n = t("./messages"), p = 0, u = 0, m = -2, a = 2, g = 8, i = 286, o = 30, s = 19, A = 2 * i + 1, v = 15, y = 3, b = 258, x = b + y + 1, w = 42, _ = 113;
            function C(t, e) {
                return t.msg = n[e],
                e
            }
            function S(t) {
                return (t << 1) - (4 < t ? 9 : 0)
            }
            function P(t) {
                for (var e = t.length; 0 <= --e; )
                    t[e] = 0
            }
            function E(t) {
                var e = t.state
                  , r = e.pending;
                r > t.avail_out && (r = t.avail_out),
                0 !== r && (f.arraySet(t.output, e.pending_buf, e.pending_out, r, t.next_out),
                t.next_out += r,
                e.pending_out += r,
                t.total_out += r,
                t.avail_out -= r,
                e.pending -= r,
                0 === e.pending && (e.pending_out = 0))
            }
            function T(t, e) {
                c._tr_flush_block(t, 0 <= t.block_start ? t.block_start : -1, t.strstart - t.block_start, e),
                t.block_start = t.strstart,
                E(t.strm)
            }
            function L(t, e) {
                t.pending_buf[t.pending++] = e
            }
            function k(t, e) {
                t.pending_buf[t.pending++] = e >>> 8 & 255,
                t.pending_buf[t.pending++] = 255 & e
            }
            function R(t, e) {
                var r, n, a = t.max_chain_length, i = t.strstart, o = t.prev_length, s = t.nice_match, l = t.strstart > t.w_size - x ? t.strstart - (t.w_size - x) : 0, c = t.window, p = t.w_mask, u = t.prev, f = t.strstart + b, d = c[i + o - 1], h = c[i + o];
                t.prev_length >= t.good_match && (a >>= 2),
                s > t.lookahead && (s = t.lookahead);
                do {
                    if (c[(r = e) + o] === h && c[r + o - 1] === d && c[r] === c[i] && c[++r] === c[i + 1]) {
                        i += 2,
                        r++;
                        do {} while (c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && c[++i] === c[++r] && i < f);if (n = b - (f - i),
                        i = f - b,
                        o < n) {
                            if (t.match_start = e,
                            s <= (o = n))
                                break;
                            d = c[i + o - 1],
                            h = c[i + o]
                        }
                    }
                } while ((e = u[e & p]) > l && 0 != --a);return o <= t.lookahead ? o : t.lookahead
            }
            function F(t) {
                var e, r, n, a, i, o, s, l, c, p, u = t.w_size;
                do {
                    if (a = t.window_size - t.lookahead - t.strstart,
                    t.strstart >= u + (u - x)) {
                        for (f.arraySet(t.window, t.window, u, u, 0),
                        t.match_start -= u,
                        t.strstart -= u,
                        t.block_start -= u,
                        e = r = t.hash_size; n = t.head[--e],
                        t.head[e] = u <= n ? n - u : 0,
                        --r; )
                            ;
                        for (e = r = u; n = t.prev[--e],
                        t.prev[e] = u <= n ? n - u : 0,
                        --r; )
                            ;
                        a += u
                    }
                    if (0 === t.strm.avail_in)
                        break;
                    if (o = t.strm,
                    s = t.window,
                    l = t.strstart + t.lookahead,
                    p = void 0,
                    (c = a) < (p = o.avail_in) && (p = c),
                    r = 0 === p ? 0 : (o.avail_in -= p,
                    f.arraySet(s, o.input, o.next_in, p, l),
                    1 === o.state.wrap ? o.adler = d(o.adler, s, p, l) : 2 === o.state.wrap && (o.adler = h(o.adler, s, p, l)),
                    o.next_in += p,
                    o.total_in += p,
                    p),
                    t.lookahead += r,
                    t.lookahead + t.insert >= y)
                        for (i = t.strstart - t.insert,
                        t.ins_h = t.window[i],
                        t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + y - 1]) & t.hash_mask,
                        t.prev[i & t.w_mask] = t.head[t.ins_h],
                        t.head[t.ins_h] = i,
                        i++,
                        t.insert--,
                        !(t.lookahead + t.insert < y)); )
                            ;
                } while (t.lookahead < x && 0 !== t.strm.avail_in)
            }
            function I(t, e) {
                for (var r, n; ; ) {
                    if (t.lookahead < x) {
                        if (F(t),
                        t.lookahead < x && e === p)
                            return 1;
                        if (0 === t.lookahead)
                            break
                    }
                    if (r = 0,
                    t.lookahead >= y && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + y - 1]) & t.hash_mask,
                    r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                    t.head[t.ins_h] = t.strstart),
                    0 !== r && t.strstart - r <= t.w_size - x && (t.match_length = R(t, r)),
                    t.match_length >= y)
                        if (n = c._tr_tally(t, t.strstart - t.match_start, t.match_length - y),
                        t.lookahead -= t.match_length,
                        t.match_length <= t.max_lazy_match && t.lookahead >= y) {
                            for (t.match_length--; t.strstart++,
                            t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + y - 1]) & t.hash_mask,
                            r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                            t.head[t.ins_h] = t.strstart,
                            0 != --t.match_length; )
                                ;
                            t.strstart++
                        } else
                            t.strstart += t.match_length,
                            t.match_length = 0,
                            t.ins_h = t.window[t.strstart],
                            t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
                    else
                        n = c._tr_tally(t, 0, t.window[t.strstart]),
                        t.lookahead--,
                        t.strstart++;
                    if (n && (T(t, !1),
                    0 === t.strm.avail_out))
                        return 1
                }
                return t.insert = t.strstart < y - 1 ? t.strstart : y - 1,
                4 === e ? (T(t, !0),
                0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1),
                0 === t.strm.avail_out) ? 1 : 2
            }
            function O(t, e) {
                for (var r, n, a; ; ) {
                    if (t.lookahead < x) {
                        if (F(t),
                        t.lookahead < x && e === p)
                            return 1;
                        if (0 === t.lookahead)
                            break
                    }
                    if (r = 0,
                    t.lookahead >= y && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + y - 1]) & t.hash_mask,
                    r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                    t.head[t.ins_h] = t.strstart),
                    t.prev_length = t.match_length,
                    t.prev_match = t.match_start,
                    t.match_length = y - 1,
                    0 !== r && t.prev_length < t.max_lazy_match && t.strstart - r <= t.w_size - x && (t.match_length = R(t, r),
                    t.match_length <= 5 && (1 === t.strategy || t.match_length === y && 4096 < t.strstart - t.match_start) && (t.match_length = y - 1)),
                    t.prev_length >= y && t.match_length <= t.prev_length) {
                        for (a = t.strstart + t.lookahead - y,
                        n = c._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - y),
                        t.lookahead -= t.prev_length - 1,
                        t.prev_length -= 2; ++t.strstart <= a && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + y - 1]) & t.hash_mask,
                        r = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h],
                        t.head[t.ins_h] = t.strstart),
                        0 != --t.prev_length; )
                            ;
                        if (t.match_available = 0,
                        t.match_length = y - 1,
                        t.strstart++,
                        n && (T(t, !1),
                        0 === t.strm.avail_out))
                            return 1
                    } else if (t.match_available) {
                        if ((n = c._tr_tally(t, 0, t.window[t.strstart - 1])) && T(t, !1),
                        t.strstart++,
                        t.lookahead--,
                        0 === t.strm.avail_out)
                            return 1
                    } else
                        t.match_available = 1,
                        t.strstart++,
                        t.lookahead--
                }
                return t.match_available && (n = c._tr_tally(t, 0, t.window[t.strstart - 1]),
                t.match_available = 0),
                t.insert = t.strstart < y - 1 ? t.strstart : y - 1,
                4 === e ? (T(t, !0),
                0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1),
                0 === t.strm.avail_out) ? 1 : 2
            }
            function B(t, e, r, n, a) {
                this.good_length = t,
                this.max_lazy = e,
                this.nice_length = r,
                this.max_chain = n,
                this.func = a
            }
            function N() {
                this.strm = null,
                this.status = 0,
                this.pending_buf = null,
                this.pending_buf_size = 0,
                this.pending_out = 0,
                this.pending = 0,
                this.wrap = 0,
                this.gzhead = null,
                this.gzindex = 0,
                this.method = g,
                this.last_flush = -1,
                this.w_size = 0,
                this.w_bits = 0,
                this.w_mask = 0,
                this.window = null,
                this.window_size = 0,
                this.prev = null,
                this.head = null,
                this.ins_h = 0,
                this.hash_size = 0,
                this.hash_bits = 0,
                this.hash_mask = 0,
                this.hash_shift = 0,
                this.block_start = 0,
                this.match_length = 0,
                this.prev_match = 0,
                this.match_available = 0,
                this.strstart = 0,
                this.match_start = 0,
                this.lookahead = 0,
                this.prev_length = 0,
                this.max_chain_length = 0,
                this.max_lazy_match = 0,
                this.level = 0,
                this.strategy = 0,
                this.good_match = 0,
                this.nice_match = 0,
                this.dyn_ltree = new f.Buf16(2 * A),
                this.dyn_dtree = new f.Buf16(2 * (2 * o + 1)),
                this.bl_tree = new f.Buf16(2 * (2 * s + 1)),
                P(this.dyn_ltree),
                P(this.dyn_dtree),
                P(this.bl_tree),
                this.l_desc = null,
                this.d_desc = null,
                this.bl_desc = null,
                this.bl_count = new f.Buf16(v + 1),
                this.heap = new f.Buf16(2 * i + 1),
                P(this.heap),
                this.heap_len = 0,
                this.heap_max = 0,
                this.depth = new f.Buf16(2 * i + 1),
                P(this.depth),
                this.l_buf = 0,
                this.lit_bufsize = 0,
                this.last_lit = 0,
                this.d_buf = 0,
                this.opt_len = 0,
                this.static_len = 0,
                this.matches = 0,
                this.insert = 0,
                this.bi_buf = 0,
                this.bi_valid = 0
            }
            function D(t) {
                var e;
                return t && t.state ? (t.total_in = t.total_out = 0,
                t.data_type = a,
                (e = t.state).pending = 0,
                e.pending_out = 0,
                e.wrap < 0 && (e.wrap = -e.wrap),
                e.status = e.wrap ? w : _,
                t.adler = 2 === e.wrap ? 0 : 1,
                e.last_flush = p,
                c._tr_init(e),
                u) : C(t, m)
            }
            function M(t) {
                var e, r = D(t);
                return r === u && ((e = t.state).window_size = 2 * e.w_size,
                P(e.head),
                e.max_lazy_match = l[e.level].max_lazy,
                e.good_match = l[e.level].good_length,
                e.nice_match = l[e.level].nice_length,
                e.max_chain_length = l[e.level].max_chain,
                e.strstart = 0,
                e.block_start = 0,
                e.lookahead = 0,
                e.insert = 0,
                e.match_length = e.prev_length = y - 1,
                e.match_available = 0,
                e.ins_h = 0),
                r
            }
            function z(t, e, r, n, a, i) {
                if (!t)
                    return m;
                var o = 1;
                if (-1 === e && (e = 6),
                n < 0 ? (o = 0,
                n = -n) : 15 < n && (o = 2,
                n -= 16),
                a < 1 || 9 < a || r !== g || n < 8 || 15 < n || e < 0 || 9 < e || i < 0 || 4 < i)
                    return C(t, m);
                8 === n && (n = 9);
                var s = new N;
                return (t.state = s).strm = t,
                s.wrap = o,
                s.gzhead = null,
                s.w_bits = n,
                s.w_size = 1 << s.w_bits,
                s.w_mask = s.w_size - 1,
                s.hash_bits = a + 7,
                s.hash_size = 1 << s.hash_bits,
                s.hash_mask = s.hash_size - 1,
                s.hash_shift = ~~((s.hash_bits + y - 1) / y),
                s.window = new f.Buf8(2 * s.w_size),
                s.head = new f.Buf16(s.hash_size),
                s.prev = new f.Buf16(s.w_size),
                s.lit_bufsize = 1 << a + 6,
                s.pending_buf_size = 4 * s.lit_bufsize,
                s.pending_buf = new f.Buf8(s.pending_buf_size),
                s.d_buf = 1 * s.lit_bufsize,
                s.l_buf = 3 * s.lit_bufsize,
                s.level = e,
                s.strategy = i,
                s.method = r,
                M(t)
            }
            l = [new B(0,0,0,0,function(t, e) {
                var r = 65535;
                for (r > t.pending_buf_size - 5 && (r = t.pending_buf_size - 5); ; ) {
                    if (t.lookahead <= 1) {
                        if (F(t),
                        0 === t.lookahead && e === p)
                            return 1;
                        if (0 === t.lookahead)
                            break
                    }
                    t.strstart += t.lookahead,
                    t.lookahead = 0;
                    var n = t.block_start + r;
                    if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n,
                    t.strstart = n,
                    T(t, !1),
                    0 === t.strm.avail_out))
                        return 1;
                    if (t.strstart - t.block_start >= t.w_size - x && (T(t, !1),
                    0 === t.strm.avail_out))
                        return 1
                }
                return t.insert = 0,
                4 === e ? (T(t, !0),
                0 === t.strm.avail_out ? 3 : 4) : (t.strstart > t.block_start && (T(t, !1),
                t.strm.avail_out),
                1)
            }
            ), new B(4,4,8,4,I), new B(4,5,16,8,I), new B(4,6,32,32,I), new B(4,4,16,16,O), new B(8,16,32,32,O), new B(8,16,128,128,O), new B(8,32,128,256,O), new B(32,128,258,1024,O), new B(32,258,258,4096,O)],
            r.deflateInit = function(t, e) {
                return z(t, e, g, 15, 8, 0)
            }
            ,
            r.deflateInit2 = z,
            r.deflateReset = M,
            r.deflateResetKeep = D,
            r.deflateSetHeader = function(t, e) {
                return t && t.state ? 2 !== t.state.wrap ? m : (t.state.gzhead = e,
                u) : m
            }
            ,
            r.deflate = function(t, e) {
                var r, n, a, i;
                if (!t || !t.state || 5 < e || e < 0)
                    return t ? C(t, m) : m;
                if (n = t.state,
                !t.output || !t.input && 0 !== t.avail_in || 666 === n.status && 4 !== e)
                    return C(t, 0 === t.avail_out ? -5 : m);
                if (n.strm = t,
                r = n.last_flush,
                n.last_flush = e,
                n.status === w)
                    if (2 === n.wrap)
                        t.adler = 0,
                        L(n, 31),
                        L(n, 139),
                        L(n, 8),
                        n.gzhead ? (L(n, (n.gzhead.text ? 1 : 0) + (n.gzhead.hcrc ? 2 : 0) + (n.gzhead.extra ? 4 : 0) + (n.gzhead.name ? 8 : 0) + (n.gzhead.comment ? 16 : 0)),
                        L(n, 255 & n.gzhead.time),
                        L(n, n.gzhead.time >> 8 & 255),
                        L(n, n.gzhead.time >> 16 & 255),
                        L(n, n.gzhead.time >> 24 & 255),
                        L(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0),
                        L(n, 255 & n.gzhead.os),
                        n.gzhead.extra && n.gzhead.extra.length && (L(n, 255 & n.gzhead.extra.length),
                        L(n, n.gzhead.extra.length >> 8 & 255)),
                        n.gzhead.hcrc && (t.adler = h(t.adler, n.pending_buf, n.pending, 0)),
                        n.gzindex = 0,
                        n.status = 69) : (L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 0),
                        L(n, 9 === n.level ? 2 : 2 <= n.strategy || n.level < 2 ? 4 : 0),
                        L(n, 3),
                        n.status = _);
                    else {
                        var o = g + (n.w_bits - 8 << 4) << 8;
                        o |= (2 <= n.strategy || n.level < 2 ? 0 : n.level < 6 ? 1 : 6 === n.level ? 2 : 3) << 6,
                        0 !== n.strstart && (o |= 32),
                        o += 31 - o % 31,
                        n.status = _,
                        k(n, o),
                        0 !== n.strstart && (k(n, t.adler >>> 16),
                        k(n, 65535 & t.adler)),
                        t.adler = 1
                    }
                if (69 === n.status)
                    if (n.gzhead.extra) {
                        for (a = n.pending; n.gzindex < (65535 & n.gzhead.extra.length) && (n.pending !== n.pending_buf_size || (n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                        E(t),
                        a = n.pending,
                        n.pending !== n.pending_buf_size)); )
                            L(n, 255 & n.gzhead.extra[n.gzindex]),
                            n.gzindex++;
                        n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                        n.gzindex === n.gzhead.extra.length && (n.gzindex = 0,
                        n.status = 73)
                    } else
                        n.status = 73;
                if (73 === n.status)
                    if (n.gzhead.name) {
                        a = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                            E(t),
                            a = n.pending,
                            n.pending === n.pending_buf_size)) {
                                i = 1;
                                break
                            }
                            i = n.gzindex < n.gzhead.name.length ? 255 & n.gzhead.name.charCodeAt(n.gzindex++) : 0,
                            L(n, i)
                        } while (0 !== i);n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                        0 === i && (n.gzindex = 0,
                        n.status = 91)
                    } else
                        n.status = 91;
                if (91 === n.status)
                    if (n.gzhead.comment) {
                        a = n.pending;
                        do {
                            if (n.pending === n.pending_buf_size && (n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                            E(t),
                            a = n.pending,
                            n.pending === n.pending_buf_size)) {
                                i = 1;
                                break
                            }
                            i = n.gzindex < n.gzhead.comment.length ? 255 & n.gzhead.comment.charCodeAt(n.gzindex++) : 0,
                            L(n, i)
                        } while (0 !== i);n.gzhead.hcrc && n.pending > a && (t.adler = h(t.adler, n.pending_buf, n.pending - a, a)),
                        0 === i && (n.status = 103)
                    } else
                        n.status = 103;
                if (103 === n.status && (n.gzhead.hcrc ? (n.pending + 2 > n.pending_buf_size && E(t),
                n.pending + 2 <= n.pending_buf_size && (L(n, 255 & t.adler),
                L(n, t.adler >> 8 & 255),
                t.adler = 0,
                n.status = _)) : n.status = _),
                0 !== n.pending) {
                    if (E(t),
                    0 === t.avail_out)
                        return n.last_flush = -1,
                        u
                } else if (0 === t.avail_in && S(e) <= S(r) && 4 !== e)
                    return C(t, -5);
                if (666 === n.status && 0 !== t.avail_in)
                    return C(t, -5);
                if (0 !== t.avail_in || 0 !== n.lookahead || e !== p && 666 !== n.status) {
                    var s = 2 === n.strategy ? function(t, e) {
                        for (var r; ; ) {
                            if (0 === t.lookahead && (F(t),
                            0 === t.lookahead)) {
                                if (e === p)
                                    return 1;
                                break
                            }
                            if (t.match_length = 0,
                            r = c._tr_tally(t, 0, t.window[t.strstart]),
                            t.lookahead--,
                            t.strstart++,
                            r && (T(t, !1),
                            0 === t.strm.avail_out))
                                return 1
                        }
                        return t.insert = 0,
                        4 === e ? (T(t, !0),
                        0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1),
                        0 === t.strm.avail_out) ? 1 : 2
                    }(n, e) : 3 === n.strategy ? function(t, e) {
                        for (var r, n, a, i, o = t.window; ; ) {
                            if (t.lookahead <= b) {
                                if (F(t),
                                t.lookahead <= b && e === p)
                                    return 1;
                                if (0 === t.lookahead)
                                    break
                            }
                            if (t.match_length = 0,
                            t.lookahead >= y && 0 < t.strstart && (n = o[a = t.strstart - 1]) === o[++a] && n === o[++a] && n === o[++a]) {
                                i = t.strstart + b;
                                do {} while (n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && n === o[++a] && a < i);t.match_length = b - (i - a),
                                t.match_length > t.lookahead && (t.match_length = t.lookahead)
                            }
                            if (t.match_length >= y ? (r = c._tr_tally(t, 1, t.match_length - y),
                            t.lookahead -= t.match_length,
                            t.strstart += t.match_length,
                            t.match_length = 0) : (r = c._tr_tally(t, 0, t.window[t.strstart]),
                            t.lookahead--,
                            t.strstart++),
                            r && (T(t, !1),
                            0 === t.strm.avail_out))
                                return 1
                        }
                        return t.insert = 0,
                        4 === e ? (T(t, !0),
                        0 === t.strm.avail_out ? 3 : 4) : t.last_lit && (T(t, !1),
                        0 === t.strm.avail_out) ? 1 : 2
                    }(n, e) : l[n.level].func(n, e);
                    if (3 !== s && 4 !== s || (n.status = 666),
                    1 === s || 3 === s)
                        return 0 === t.avail_out && (n.last_flush = -1),
                        u;
                    if (2 === s && (1 === e ? c._tr_align(n) : 5 !== e && (c._tr_stored_block(n, 0, 0, !1),
                    3 === e && (P(n.head),
                    0 === n.lookahead && (n.strstart = 0,
                    n.block_start = 0,
                    n.insert = 0))),
                    E(t),
                    0 === t.avail_out))
                        return n.last_flush = -1,
                        u
                }
                return 4 !== e ? u : n.wrap <= 0 ? 1 : (2 === n.wrap ? (L(n, 255 & t.adler),
                L(n, t.adler >> 8 & 255),
                L(n, t.adler >> 16 & 255),
                L(n, t.adler >> 24 & 255),
                L(n, 255 & t.total_in),
                L(n, t.total_in >> 8 & 255),
                L(n, t.total_in >> 16 & 255),
                L(n, t.total_in >> 24 & 255)) : (k(n, t.adler >>> 16),
                k(n, 65535 & t.adler)),
                E(t),
                0 < n.wrap && (n.wrap = -n.wrap),
                0 !== n.pending ? u : 1)
            }
            ,
            r.deflateEnd = function(t) {
                var e;
                return t && t.state ? (e = t.state.status) !== w && 69 !== e && 73 !== e && 91 !== e && 103 !== e && e !== _ && 666 !== e ? C(t, m) : (t.state = null,
                e === _ ? C(t, -3) : u) : m
            }
            ,
            r.deflateSetDictionary = function(t, e) {
                var r, n, a, i, o, s, l, c, p = e.length;
                if (!t || !t.state)
                    return m;
                if (2 === (i = (r = t.state).wrap) || 1 === i && r.status !== w || r.lookahead)
                    return m;
                for (1 === i && (t.adler = d(t.adler, e, p, 0)),
                r.wrap = 0,
                p >= r.w_size && (0 === i && (P(r.head),
                r.strstart = 0,
                r.block_start = 0,
                r.insert = 0),
                c = new f.Buf8(r.w_size),
                f.arraySet(c, e, p - r.w_size, r.w_size, 0),
                e = c,
                p = r.w_size),
                o = t.avail_in,
                s = t.next_in,
                l = t.input,
                t.avail_in = p,
                t.next_in = 0,
                t.input = e,
                F(r); r.lookahead >= y; ) {
                    for (n = r.strstart,
                    a = r.lookahead - (y - 1); r.ins_h = (r.ins_h << r.hash_shift ^ r.window[n + y - 1]) & r.hash_mask,
                    r.prev[n & r.w_mask] = r.head[r.ins_h],
                    r.head[r.ins_h] = n,
                    n++,
                    --a; )
                        ;
                    r.strstart = n,
                    r.lookahead = y - 1,
                    F(r)
                }
                return r.strstart += r.lookahead,
                r.block_start = r.strstart,
                r.insert = r.lookahead,
                r.lookahead = 0,
                r.match_length = r.prev_length = y - 1,
                r.match_available = 0,
                t.next_in = s,
                t.input = l,
                t.avail_in = o,
                r.wrap = i,
                u
            }
            ,
            r.deflateInfo = "pako deflate (from Nodeca project)"
        }
        , {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./messages": 51,
            "./trees": 52
        }],
        47: [function(t, e, r) {
            "use strict";
            e.exports = function() {
                this.text = 0,
                this.time = 0,
                this.xflags = 0,
                this.os = 0,
                this.extra = null,
                this.extra_len = 0,
                this.name = "",
                this.comment = "",
                this.hcrc = 0,
                this.done = !1
            }
        }
        , {}],
        48: [function(t, e, r) {
            "use strict";
            e.exports = function(t, e) {
                var r, n, a, i, o, s, l, c, p, u, f, d, h, m, g, A, v, y, b, x, w, _, C, S, P;
                r = t.state,
                n = t.next_in,
                S = t.input,
                a = n + (t.avail_in - 5),
                i = t.next_out,
                P = t.output,
                o = i - (e - t.avail_out),
                s = i + (t.avail_out - 257),
                l = r.dmax,
                c = r.wsize,
                p = r.whave,
                u = r.wnext,
                f = r.window,
                d = r.hold,
                h = r.bits,
                m = r.lencode,
                g = r.distcode,
                A = (1 << r.lenbits) - 1,
                v = (1 << r.distbits) - 1;
                t: do {
                    h < 15 && (d += S[n++] << h,
                    h += 8,
                    d += S[n++] << h,
                    h += 8),
                    y = m[d & A];
                    e: for (; ; ) {
                        if (d >>>= b = y >>> 24,
                        h -= b,
                        0 == (b = y >>> 16 & 255))
                            P[i++] = 65535 & y;
                        else {
                            if (!(16 & b)) {
                                if (0 == (64 & b)) {
                                    y = m[(65535 & y) + (d & (1 << b) - 1)];
                                    continue e
                                }
                                if (32 & b) {
                                    r.mode = 12;
                                    break t
                                }
                                t.msg = "invalid literal/length code",
                                r.mode = 30;
                                break t
                            }
                            x = 65535 & y,
                            (b &= 15) && (h < b && (d += S[n++] << h,
                            h += 8),
                            x += d & (1 << b) - 1,
                            d >>>= b,
                            h -= b),
                            h < 15 && (d += S[n++] << h,
                            h += 8,
                            d += S[n++] << h,
                            h += 8),
                            y = g[d & v];
                            r: for (; ; ) {
                                if (d >>>= b = y >>> 24,
                                h -= b,
                                !(16 & (b = y >>> 16 & 255))) {
                                    if (0 == (64 & b)) {
                                        y = g[(65535 & y) + (d & (1 << b) - 1)];
                                        continue r
                                    }
                                    t.msg = "invalid distance code",
                                    r.mode = 30;
                                    break t
                                }
                                if (w = 65535 & y,
                                h < (b &= 15) && (d += S[n++] << h,
                                (h += 8) < b && (d += S[n++] << h,
                                h += 8)),
                                l < (w += d & (1 << b) - 1)) {
                                    t.msg = "invalid distance too far back",
                                    r.mode = 30;
                                    break t
                                }
                                if (d >>>= b,
                                h -= b,
                                (b = i - o) < w) {
                                    if (p < (b = w - b) && r.sane) {
                                        t.msg = "invalid distance too far back",
                                        r.mode = 30;
                                        break t
                                    }
                                    if (C = f,
                                    (_ = 0) === u) {
                                        if (_ += c - b,
                                        b < x) {
                                            for (x -= b; P[i++] = f[_++],
                                            --b; )
                                                ;
                                            _ = i - w,
                                            C = P
                                        }
                                    } else if (u < b) {
                                        if (_ += c + u - b,
                                        (b -= u) < x) {
                                            for (x -= b; P[i++] = f[_++],
                                            --b; )
                                                ;
                                            if (_ = 0,
                                            u < x) {
                                                for (x -= b = u; P[i++] = f[_++],
                                                --b; )
                                                    ;
                                                _ = i - w,
                                                C = P
                                            }
                                        }
                                    } else if (_ += u - b,
                                    b < x) {
                                        for (x -= b; P[i++] = f[_++],
                                        --b; )
                                            ;
                                        _ = i - w,
                                        C = P
                                    }
                                    for (; 2 < x; )
                                        P[i++] = C[_++],
                                        P[i++] = C[_++],
                                        P[i++] = C[_++],
                                        x -= 3;
                                    x && (P[i++] = C[_++],
                                    1 < x && (P[i++] = C[_++]))
                                } else {
                                    for (_ = i - w; P[i++] = P[_++],
                                    P[i++] = P[_++],
                                    P[i++] = P[_++],
                                    2 < (x -= 3); )
                                        ;
                                    x && (P[i++] = P[_++],
                                    1 < x && (P[i++] = P[_++]))
                                }
                                break
                            }
                        }
                        break
                    }
                } while (n < a && i < s);n -= x = h >> 3,
                d &= (1 << (h -= x << 3)) - 1,
                t.next_in = n,
                t.next_out = i,
                t.avail_in = n < a ? a - n + 5 : 5 - (n - a),
                t.avail_out = i < s ? s - i + 257 : 257 - (i - s),
                r.hold = d,
                r.bits = h
            }
        }
        , {}],
        49: [function(t, e, r) {
            "use strict";
            var L = t("../utils/common")
              , k = t("./adler32")
              , R = t("./crc32")
              , F = t("./inffast")
              , I = t("./inftrees")
              , O = 1
              , B = 2
              , N = 0
              , D = -2
              , M = 1
              , n = 852
              , a = 592;
            function z(t) {
                return (t >>> 24 & 255) + (t >>> 8 & 65280) + ((65280 & t) << 8) + ((255 & t) << 24)
            }
            function i() {
                this.mode = 0,
                this.last = !1,
                this.wrap = 0,
                this.havedict = !1,
                this.flags = 0,
                this.dmax = 0,
                this.check = 0,
                this.total = 0,
                this.head = null,
                this.wbits = 0,
                this.wsize = 0,
                this.whave = 0,
                this.wnext = 0,
                this.window = null,
                this.hold = 0,
                this.bits = 0,
                this.length = 0,
                this.offset = 0,
                this.extra = 0,
                this.lencode = null,
                this.distcode = null,
                this.lenbits = 0,
                this.distbits = 0,
                this.ncode = 0,
                this.nlen = 0,
                this.ndist = 0,
                this.have = 0,
                this.next = null,
                this.lens = new L.Buf16(320),
                this.work = new L.Buf16(288),
                this.lendyn = null,
                this.distdyn = null,
                this.sane = 0,
                this.back = 0,
                this.was = 0
            }
            function o(t) {
                var e;
                return t && t.state ? (e = t.state,
                t.total_in = t.total_out = e.total = 0,
                t.msg = "",
                e.wrap && (t.adler = 1 & e.wrap),
                e.mode = M,
                e.last = 0,
                e.havedict = 0,
                e.dmax = 32768,
                e.head = null,
                e.hold = 0,
                e.bits = 0,
                e.lencode = e.lendyn = new L.Buf32(n),
                e.distcode = e.distdyn = new L.Buf32(a),
                e.sane = 1,
                e.back = -1,
                N) : D
            }
            function s(t) {
                var e;
                return t && t.state ? ((e = t.state).wsize = 0,
                e.whave = 0,
                e.wnext = 0,
                o(t)) : D
            }
            function l(t, e) {
                var r, n;
                return t && t.state ? (n = t.state,
                e < 0 ? (r = 0,
                e = -e) : (r = 1 + (e >> 4),
                e < 48 && (e &= 15)),
                e && (e < 8 || 15 < e) ? D : (null !== n.window && n.wbits !== e && (n.window = null),
                n.wrap = r,
                n.wbits = e,
                s(t))) : D
            }
            function c(t, e) {
                var r, n;
                return t ? (n = new i,
                (t.state = n).window = null,
                (r = l(t, e)) !== N && (t.state = null),
                r) : D
            }
            var p, u, f = !0;
            function U(t) {
                if (f) {
                    var e;
                    for (p = new L.Buf32(512),
                    u = new L.Buf32(32),
                    e = 0; e < 144; )
                        t.lens[e++] = 8;
                    for (; e < 256; )
                        t.lens[e++] = 9;
                    for (; e < 280; )
                        t.lens[e++] = 7;
                    for (; e < 288; )
                        t.lens[e++] = 8;
                    for (I(O, t.lens, 0, 288, p, 0, t.work, {
                        bits: 9
                    }),
                    e = 0; e < 32; )
                        t.lens[e++] = 5;
                    I(B, t.lens, 0, 32, u, 0, t.work, {
                        bits: 5
                    }),
                    f = !1
                }
                t.lencode = p,
                t.lenbits = 9,
                t.distcode = u,
                t.distbits = 5
            }
            function j(t, e, r, n) {
                var a, i = t.state;
                return null === i.window && (i.wsize = 1 << i.wbits,
                i.wnext = 0,
                i.whave = 0,
                i.window = new L.Buf8(i.wsize)),
                n >= i.wsize ? (L.arraySet(i.window, e, r - i.wsize, i.wsize, 0),
                i.wnext = 0,
                i.whave = i.wsize) : (n < (a = i.wsize - i.wnext) && (a = n),
                L.arraySet(i.window, e, r - n, a, i.wnext),
                (n -= a) ? (L.arraySet(i.window, e, r - n, n, 0),
                i.wnext = n,
                i.whave = i.wsize) : (i.wnext += a,
                i.wnext === i.wsize && (i.wnext = 0),
                i.whave < i.wsize && (i.whave += a))),
                0
            }
            r.inflateReset = s,
            r.inflateReset2 = l,
            r.inflateResetKeep = o,
            r.inflateInit = function(t) {
                return c(t, 15)
            }
            ,
            r.inflateInit2 = c,
            r.inflate = function(t, e) {
                var r, n, a, i, o, s, l, c, p, u, f, d, h, m, g, A, v, y, b, x, w, _, C, S, P = 0, E = new L.Buf8(4), T = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
                if (!t || !t.state || !t.output || !t.input && 0 !== t.avail_in)
                    return D;
                12 === (r = t.state).mode && (r.mode = 13),
                o = t.next_out,
                a = t.output,
                l = t.avail_out,
                i = t.next_in,
                n = t.input,
                s = t.avail_in,
                c = r.hold,
                p = r.bits,
                u = s,
                f = l,
                _ = N;
                t: for (; ; )
                    switch (r.mode) {
                    case M:
                        if (0 === r.wrap) {
                            r.mode = 13;
                            break
                        }
                        for (; p < 16; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if (2 & r.wrap && 35615 === c) {
                            E[r.check = 0] = 255 & c,
                            E[1] = c >>> 8 & 255,
                            r.check = R(r.check, E, 2, 0),
                            p = c = 0,
                            r.mode = 2;
                            break
                        }
                        if (r.flags = 0,
                        r.head && (r.head.done = !1),
                        !(1 & r.wrap) || (((255 & c) << 8) + (c >> 8)) % 31) {
                            t.msg = "incorrect header check",
                            r.mode = 30;
                            break
                        }
                        if (8 != (15 & c)) {
                            t.msg = "unknown compression method",
                            r.mode = 30;
                            break
                        }
                        if (p -= 4,
                        w = 8 + (15 & (c >>>= 4)),
                        0 === r.wbits)
                            r.wbits = w;
                        else if (w > r.wbits) {
                            t.msg = "invalid window size",
                            r.mode = 30;
                            break
                        }
                        r.dmax = 1 << w,
                        t.adler = r.check = 1,
                        r.mode = 512 & c ? 10 : 12,
                        p = c = 0;
                        break;
                    case 2:
                        for (; p < 16; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if (r.flags = c,
                        8 != (255 & r.flags)) {
                            t.msg = "unknown compression method",
                            r.mode = 30;
                            break
                        }
                        if (57344 & r.flags) {
                            t.msg = "unknown header flags set",
                            r.mode = 30;
                            break
                        }
                        r.head && (r.head.text = c >> 8 & 1),
                        512 & r.flags && (E[0] = 255 & c,
                        E[1] = c >>> 8 & 255,
                        r.check = R(r.check, E, 2, 0)),
                        p = c = 0,
                        r.mode = 3;
                    case 3:
                        for (; p < 32; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        r.head && (r.head.time = c),
                        512 & r.flags && (E[0] = 255 & c,
                        E[1] = c >>> 8 & 255,
                        E[2] = c >>> 16 & 255,
                        E[3] = c >>> 24 & 255,
                        r.check = R(r.check, E, 4, 0)),
                        p = c = 0,
                        r.mode = 4;
                    case 4:
                        for (; p < 16; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        r.head && (r.head.xflags = 255 & c,
                        r.head.os = c >> 8),
                        512 & r.flags && (E[0] = 255 & c,
                        E[1] = c >>> 8 & 255,
                        r.check = R(r.check, E, 2, 0)),
                        p = c = 0,
                        r.mode = 5;
                    case 5:
                        if (1024 & r.flags) {
                            for (; p < 16; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            r.length = c,
                            r.head && (r.head.extra_len = c),
                            512 & r.flags && (E[0] = 255 & c,
                            E[1] = c >>> 8 & 255,
                            r.check = R(r.check, E, 2, 0)),
                            p = c = 0
                        } else
                            r.head && (r.head.extra = null);
                        r.mode = 6;
                    case 6:
                        if (1024 & r.flags && (s < (d = r.length) && (d = s),
                        d && (r.head && (w = r.head.extra_len - r.length,
                        r.head.extra || (r.head.extra = new Array(r.head.extra_len)),
                        L.arraySet(r.head.extra, n, i, d, w)),
                        512 & r.flags && (r.check = R(r.check, n, d, i)),
                        s -= d,
                        i += d,
                        r.length -= d),
                        r.length))
                            break t;
                        r.length = 0,
                        r.mode = 7;
                    case 7:
                        if (2048 & r.flags) {
                            if (0 === s)
                                break t;
                            for (d = 0; w = n[i + d++],
                            r.head && w && r.length < 65536 && (r.head.name += String.fromCharCode(w)),
                            w && d < s; )
                                ;
                            if (512 & r.flags && (r.check = R(r.check, n, d, i)),
                            s -= d,
                            i += d,
                            w)
                                break t
                        } else
                            r.head && (r.head.name = null);
                        r.length = 0,
                        r.mode = 8;
                    case 8:
                        if (4096 & r.flags) {
                            if (0 === s)
                                break t;
                            for (d = 0; w = n[i + d++],
                            r.head && w && r.length < 65536 && (r.head.comment += String.fromCharCode(w)),
                            w && d < s; )
                                ;
                            if (512 & r.flags && (r.check = R(r.check, n, d, i)),
                            s -= d,
                            i += d,
                            w)
                                break t
                        } else
                            r.head && (r.head.comment = null);
                        r.mode = 9;
                    case 9:
                        if (512 & r.flags) {
                            for (; p < 16; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            if (c !== (65535 & r.check)) {
                                t.msg = "header crc mismatch",
                                r.mode = 30;
                                break
                            }
                            p = c = 0
                        }
                        r.head && (r.head.hcrc = r.flags >> 9 & 1,
                        r.head.done = !0),
                        t.adler = r.check = 0,
                        r.mode = 12;
                        break;
                    case 10:
                        for (; p < 32; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        t.adler = r.check = z(c),
                        p = c = 0,
                        r.mode = 11;
                    case 11:
                        if (0 === r.havedict)
                            return t.next_out = o,
                            t.avail_out = l,
                            t.next_in = i,
                            t.avail_in = s,
                            r.hold = c,
                            r.bits = p,
                            2;
                        t.adler = r.check = 1,
                        r.mode = 12;
                    case 12:
                        if (5 === e || 6 === e)
                            break t;
                    case 13:
                        if (r.last) {
                            c >>>= 7 & p,
                            p -= 7 & p,
                            r.mode = 27;
                            break
                        }
                        for (; p < 3; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        switch (r.last = 1 & c,
                        p -= 1,
                        3 & (c >>>= 1)) {
                        case 0:
                            r.mode = 14;
                            break;
                        case 1:
                            if (U(r),
                            r.mode = 20,
                            6 !== e)
                                break;
                            c >>>= 2,
                            p -= 2;
                            break t;
                        case 2:
                            r.mode = 17;
                            break;
                        case 3:
                            t.msg = "invalid block type",
                            r.mode = 30
                        }
                        c >>>= 2,
                        p -= 2;
                        break;
                    case 14:
                        for (c >>>= 7 & p,
                        p -= 7 & p; p < 32; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if ((65535 & c) != (c >>> 16 ^ 65535)) {
                            t.msg = "invalid stored block lengths",
                            r.mode = 30;
                            break
                        }
                        if (r.length = 65535 & c,
                        p = c = 0,
                        r.mode = 15,
                        6 === e)
                            break t;
                    case 15:
                        r.mode = 16;
                    case 16:
                        if (d = r.length) {
                            if (s < d && (d = s),
                            l < d && (d = l),
                            0 === d)
                                break t;
                            L.arraySet(a, n, i, d, o),
                            s -= d,
                            i += d,
                            l -= d,
                            o += d,
                            r.length -= d;
                            break
                        }
                        r.mode = 12;
                        break;
                    case 17:
                        for (; p < 14; ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if (r.nlen = 257 + (31 & c),
                        c >>>= 5,
                        p -= 5,
                        r.ndist = 1 + (31 & c),
                        c >>>= 5,
                        p -= 5,
                        r.ncode = 4 + (15 & c),
                        c >>>= 4,
                        p -= 4,
                        286 < r.nlen || 30 < r.ndist) {
                            t.msg = "too many length or distance symbols",
                            r.mode = 30;
                            break
                        }
                        r.have = 0,
                        r.mode = 18;
                    case 18:
                        for (; r.have < r.ncode; ) {
                            for (; p < 3; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            r.lens[T[r.have++]] = 7 & c,
                            c >>>= 3,
                            p -= 3
                        }
                        for (; r.have < 19; )
                            r.lens[T[r.have++]] = 0;
                        if (r.lencode = r.lendyn,
                        r.lenbits = 7,
                        C = {
                            bits: r.lenbits
                        },
                        _ = I(0, r.lens, 0, 19, r.lencode, 0, r.work, C),
                        r.lenbits = C.bits,
                        _) {
                            t.msg = "invalid code lengths set",
                            r.mode = 30;
                            break
                        }
                        r.have = 0,
                        r.mode = 19;
                    case 19:
                        for (; r.have < r.nlen + r.ndist; ) {
                            for (; A = (P = r.lencode[c & (1 << r.lenbits) - 1]) >>> 16 & 255,
                            v = 65535 & P,
                            !((g = P >>> 24) <= p); ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            if (v < 16)
                                c >>>= g,
                                p -= g,
                                r.lens[r.have++] = v;
                            else {
                                if (16 === v) {
                                    for (S = g + 2; p < S; ) {
                                        if (0 === s)
                                            break t;
                                        s--,
                                        c += n[i++] << p,
                                        p += 8
                                    }
                                    if (c >>>= g,
                                    p -= g,
                                    0 === r.have) {
                                        t.msg = "invalid bit length repeat",
                                        r.mode = 30;
                                        break
                                    }
                                    w = r.lens[r.have - 1],
                                    d = 3 + (3 & c),
                                    c >>>= 2,
                                    p -= 2
                                } else if (17 === v) {
                                    for (S = g + 3; p < S; ) {
                                        if (0 === s)
                                            break t;
                                        s--,
                                        c += n[i++] << p,
                                        p += 8
                                    }
                                    p -= g,
                                    w = 0,
                                    d = 3 + (7 & (c >>>= g)),
                                    c >>>= 3,
                                    p -= 3
                                } else {
                                    for (S = g + 7; p < S; ) {
                                        if (0 === s)
                                            break t;
                                        s--,
                                        c += n[i++] << p,
                                        p += 8
                                    }
                                    p -= g,
                                    w = 0,
                                    d = 11 + (127 & (c >>>= g)),
                                    c >>>= 7,
                                    p -= 7
                                }
                                if (r.have + d > r.nlen + r.ndist) {
                                    t.msg = "invalid bit length repeat",
                                    r.mode = 30;
                                    break
                                }
                                for (; d--; )
                                    r.lens[r.have++] = w
                            }
                        }
                        if (30 === r.mode)
                            break;
                        if (0 === r.lens[256]) {
                            t.msg = "invalid code -- missing end-of-block",
                            r.mode = 30;
                            break
                        }
                        if (r.lenbits = 9,
                        C = {
                            bits: r.lenbits
                        },
                        _ = I(O, r.lens, 0, r.nlen, r.lencode, 0, r.work, C),
                        r.lenbits = C.bits,
                        _) {
                            t.msg = "invalid literal/lengths set",
                            r.mode = 30;
                            break
                        }
                        if (r.distbits = 6,
                        r.distcode = r.distdyn,
                        C = {
                            bits: r.distbits
                        },
                        _ = I(B, r.lens, r.nlen, r.ndist, r.distcode, 0, r.work, C),
                        r.distbits = C.bits,
                        _) {
                            t.msg = "invalid distances set",
                            r.mode = 30;
                            break
                        }
                        if (r.mode = 20,
                        6 === e)
                            break t;
                    case 20:
                        r.mode = 21;
                    case 21:
                        if (6 <= s && 258 <= l) {
                            t.next_out = o,
                            t.avail_out = l,
                            t.next_in = i,
                            t.avail_in = s,
                            r.hold = c,
                            r.bits = p,
                            F(t, f),
                            o = t.next_out,
                            a = t.output,
                            l = t.avail_out,
                            i = t.next_in,
                            n = t.input,
                            s = t.avail_in,
                            c = r.hold,
                            p = r.bits,
                            12 === r.mode && (r.back = -1);
                            break
                        }
                        for (r.back = 0; A = (P = r.lencode[c & (1 << r.lenbits) - 1]) >>> 16 & 255,
                        v = 65535 & P,
                        !((g = P >>> 24) <= p); ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if (A && 0 == (240 & A)) {
                            for (y = g,
                            b = A,
                            x = v; A = (P = r.lencode[x + ((c & (1 << y + b) - 1) >> y)]) >>> 16 & 255,
                            v = 65535 & P,
                            !(y + (g = P >>> 24) <= p); ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            c >>>= y,
                            p -= y,
                            r.back += y
                        }
                        if (c >>>= g,
                        p -= g,
                        r.back += g,
                        r.length = v,
                        0 === A) {
                            r.mode = 26;
                            break
                        }
                        if (32 & A) {
                            r.back = -1,
                            r.mode = 12;
                            break
                        }
                        if (64 & A) {
                            t.msg = "invalid literal/length code",
                            r.mode = 30;
                            break
                        }
                        r.extra = 15 & A,
                        r.mode = 22;
                    case 22:
                        if (r.extra) {
                            for (S = r.extra; p < S; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            r.length += c & (1 << r.extra) - 1,
                            c >>>= r.extra,
                            p -= r.extra,
                            r.back += r.extra
                        }
                        r.was = r.length,
                        r.mode = 23;
                    case 23:
                        for (; A = (P = r.distcode[c & (1 << r.distbits) - 1]) >>> 16 & 255,
                        v = 65535 & P,
                        !((g = P >>> 24) <= p); ) {
                            if (0 === s)
                                break t;
                            s--,
                            c += n[i++] << p,
                            p += 8
                        }
                        if (0 == (240 & A)) {
                            for (y = g,
                            b = A,
                            x = v; A = (P = r.distcode[x + ((c & (1 << y + b) - 1) >> y)]) >>> 16 & 255,
                            v = 65535 & P,
                            !(y + (g = P >>> 24) <= p); ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            c >>>= y,
                            p -= y,
                            r.back += y
                        }
                        if (c >>>= g,
                        p -= g,
                        r.back += g,
                        64 & A) {
                            t.msg = "invalid distance code",
                            r.mode = 30;
                            break
                        }
                        r.offset = v,
                        r.extra = 15 & A,
                        r.mode = 24;
                    case 24:
                        if (r.extra) {
                            for (S = r.extra; p < S; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            r.offset += c & (1 << r.extra) - 1,
                            c >>>= r.extra,
                            p -= r.extra,
                            r.back += r.extra
                        }
                        if (r.offset > r.dmax) {
                            t.msg = "invalid distance too far back",
                            r.mode = 30;
                            break
                        }
                        r.mode = 25;
                    case 25:
                        if (0 === l)
                            break t;
                        if (d = f - l,
                        r.offset > d) {
                            if ((d = r.offset - d) > r.whave && r.sane) {
                                t.msg = "invalid distance too far back",
                                r.mode = 30;
                                break
                            }
                            h = d > r.wnext ? (d -= r.wnext,
                            r.wsize - d) : r.wnext - d,
                            d > r.length && (d = r.length),
                            m = r.window
                        } else
                            m = a,
                            h = o - r.offset,
                            d = r.length;
                        for (l < d && (d = l),
                        l -= d,
                        r.length -= d; a[o++] = m[h++],
                        --d; )
                            ;
                        0 === r.length && (r.mode = 21);
                        break;
                    case 26:
                        if (0 === l)
                            break t;
                        a[o++] = r.length,
                        l--,
                        r.mode = 21;
                        break;
                    case 27:
                        if (r.wrap) {
                            for (; p < 32; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c |= n[i++] << p,
                                p += 8
                            }
                            if (f -= l,
                            t.total_out += f,
                            r.total += f,
                            f && (t.adler = r.check = r.flags ? R(r.check, a, f, o - f) : k(r.check, a, f, o - f)),
                            f = l,
                            (r.flags ? c : z(c)) !== r.check) {
                                t.msg = "incorrect data check",
                                r.mode = 30;
                                break
                            }
                            p = c = 0
                        }
                        r.mode = 28;
                    case 28:
                        if (r.wrap && r.flags) {
                            for (; p < 32; ) {
                                if (0 === s)
                                    break t;
                                s--,
                                c += n[i++] << p,
                                p += 8
                            }
                            if (c !== (4294967295 & r.total)) {
                                t.msg = "incorrect length check",
                                r.mode = 30;
                                break
                            }
                            p = c = 0
                        }
                        r.mode = 29;
                    case 29:
                        _ = 1;
                        break t;
                    case 30:
                        _ = -3;
                        break t;
                    case 31:
                        return -4;
                    case 32:
                    default:
                        return D
                    }
                return t.next_out = o,
                t.avail_out = l,
                t.next_in = i,
                t.avail_in = s,
                r.hold = c,
                r.bits = p,
                (r.wsize || f !== t.avail_out && r.mode < 30 && (r.mode < 27 || 4 !== e)) && j(t, t.output, t.next_out, f - t.avail_out) ? (r.mode = 31,
                -4) : (u -= t.avail_in,
                f -= t.avail_out,
                t.total_in += u,
                t.total_out += f,
                r.total += f,
                r.wrap && f && (t.adler = r.check = r.flags ? R(r.check, a, f, t.next_out - f) : k(r.check, a, f, t.next_out - f)),
                t.data_type = r.bits + (r.last ? 64 : 0) + (12 === r.mode ? 128 : 0) + (20 === r.mode || 15 === r.mode ? 256 : 0),
                (0 == u && 0 === f || 4 === e) && _ === N && (_ = -5),
                _)
            }
            ,
            r.inflateEnd = function(t) {
                if (!t || !t.state)
                    return D;
                var e = t.state;
                return e.window && (e.window = null),
                t.state = null,
                N
            }
            ,
            r.inflateGetHeader = function(t, e) {
                var r;
                return t && t.state ? 0 == (2 & (r = t.state).wrap) ? D : ((r.head = e).done = !1,
                N) : D
            }
            ,
            r.inflateSetDictionary = function(t, e) {
                var r, n = e.length;
                return t && t.state ? 0 !== (r = t.state).wrap && 11 !== r.mode ? D : 11 === r.mode && k(1, e, n, 0) !== r.check ? -3 : j(t, e, n, n) ? (r.mode = 31,
                -4) : (r.havedict = 1,
                N) : D
            }
            ,
            r.inflateInfo = "pako inflate (from Nodeca project)"
        }
        , {
            "../utils/common": 41,
            "./adler32": 43,
            "./crc32": 45,
            "./inffast": 48,
            "./inftrees": 50
        }],
        50: [function(t, e, r) {
            "use strict";
            var O = t("../utils/common")
              , B = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0]
              , N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78]
              , D = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0]
              , M = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
            e.exports = function(t, e, r, n, a, i, o, s) {
                var l, c, p, u, f, d, h, m, g, A = s.bits, v = 0, y = 0, b = 0, x = 0, w = 0, _ = 0, C = 0, S = 0, P = 0, E = 0, T = null, L = 0, k = new O.Buf16(16), R = new O.Buf16(16), F = null, I = 0;
                for (v = 0; v <= 15; v++)
                    k[v] = 0;
                for (y = 0; y < n; y++)
                    k[e[r + y]]++;
                for (w = A,
                x = 15; 1 <= x && 0 === k[x]; x--)
                    ;
                if (x < w && (w = x),
                0 === x)
                    return a[i++] = 20971520,
                    a[i++] = 20971520,
                    s.bits = 1,
                    0;
                for (b = 1; b < x && 0 === k[b]; b++)
                    ;
                for (w < b && (w = b),
                v = S = 1; v <= 15; v++)
                    if (S <<= 1,
                    (S -= k[v]) < 0)
                        return -1;
                if (0 < S && (0 === t || 1 !== x))
                    return -1;
                for (R[1] = 0,
                v = 1; v < 15; v++)
                    R[v + 1] = R[v] + k[v];
                for (y = 0; y < n; y++)
                    0 !== e[r + y] && (o[R[e[r + y]]++] = y);
                if (d = 0 === t ? (T = F = o,
                19) : 1 === t ? (T = B,
                L -= 257,
                F = N,
                I -= 257,
                256) : (T = D,
                F = M,
                -1),
                v = b,
                f = i,
                C = y = E = 0,
                p = -1,
                u = (P = 1 << (_ = w)) - 1,
                1 === t && 852 < P || 2 === t && 592 < P)
                    return 1;
                for (; ; ) {
                    for (h = v - C,
                    g = o[y] < d ? (m = 0,
                    o[y]) : o[y] > d ? (m = F[I + o[y]],
                    T[L + o[y]]) : (m = 96,
                    0),
                    l = 1 << v - C,
                    b = c = 1 << _; a[f + (E >> C) + (c -= l)] = h << 24 | m << 16 | g | 0,
                    0 !== c; )
                        ;
                    for (l = 1 << v - 1; E & l; )
                        l >>= 1;
                    if (0 !== l ? (E &= l - 1,
                    E += l) : E = 0,
                    y++,
                    0 == --k[v]) {
                        if (v === x)
                            break;
                        v = e[r + o[y]]
                    }
                    if (w < v && (E & u) !== p) {
                        for (0 === C && (C = w),
                        f += b,
                        S = 1 << (_ = v - C); _ + C < x && !((S -= k[_ + C]) <= 0); )
                            _++,
                            S <<= 1;
                        if (P += 1 << _,
                        1 === t && 852 < P || 2 === t && 592 < P)
                            return 1;
                        a[p = E & u] = w << 24 | _ << 16 | f - i | 0
                    }
                }
                return 0 !== E && (a[f + E] = v - C << 24 | 64 << 16 | 0),
                s.bits = w,
                0
            }
        }
        , {
            "../utils/common": 41
        }],
        51: [function(t, e, r) {
            "use strict";
            e.exports = {
                2: "need dictionary",
                1: "stream end",
                0: "",
                "-1": "file error",
                "-2": "stream error",
                "-3": "data error",
                "-4": "insufficient memory",
                "-5": "buffer error",
                "-6": "incompatible version"
            }
        }
        , {}],
        52: [function(t, e, r) {
            "use strict";
            var s = t("../utils/common");
            function n(t) {
                for (var e = t.length; 0 <= --e; )
                    t[e] = 0
            }
            var g = 15
              , a = 16
              , l = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0]
              , c = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13]
              , o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7]
              , p = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
              , u = new Array(576);
            n(u);
            var f = new Array(60);
            n(f);
            var d = new Array(512);
            n(d);
            var h = new Array(256);
            n(h);
            var m = new Array(29);
            n(m);
            var A, v, y, b = new Array(30);
            function x(t, e, r, n, a) {
                this.static_tree = t,
                this.extra_bits = e,
                this.extra_base = r,
                this.elems = n,
                this.max_length = a,
                this.has_stree = t && t.length
            }
            function i(t, e) {
                this.dyn_tree = t,
                this.max_code = 0,
                this.stat_desc = e
            }
            function w(t) {
                return t < 256 ? d[t] : d[256 + (t >>> 7)]
            }
            function _(t, e) {
                t.pending_buf[t.pending++] = 255 & e,
                t.pending_buf[t.pending++] = e >>> 8 & 255
            }
            function C(t, e, r) {
                t.bi_valid > a - r ? (t.bi_buf |= e << t.bi_valid & 65535,
                _(t, t.bi_buf),
                t.bi_buf = e >> a - t.bi_valid,
                t.bi_valid += r - a) : (t.bi_buf |= e << t.bi_valid & 65535,
                t.bi_valid += r)
            }
            function S(t, e, r) {
                C(t, r[2 * e], r[2 * e + 1])
            }
            function P(t, e) {
                for (var r = 0; r |= 1 & t,
                t >>>= 1,
                r <<= 1,
                0 < --e; )
                    ;
                return r >>> 1
            }
            function E(t, e, r) {
                var n, a, i = new Array(g + 1), o = 0;
                for (n = 1; n <= g; n++)
                    i[n] = o = o + r[n - 1] << 1;
                for (a = 0; a <= e; a++) {
                    var s = t[2 * a + 1];
                    0 !== s && (t[2 * a] = P(i[s]++, s))
                }
            }
            function T(t) {
                var e;
                for (e = 0; e < 286; e++)
                    t.dyn_ltree[2 * e] = 0;
                for (e = 0; e < 30; e++)
                    t.dyn_dtree[2 * e] = 0;
                for (e = 0; e < 19; e++)
                    t.bl_tree[2 * e] = 0;
                t.dyn_ltree[512] = 1,
                t.opt_len = t.static_len = 0,
                t.last_lit = t.matches = 0
            }
            function L(t) {
                8 < t.bi_valid ? _(t, t.bi_buf) : 0 < t.bi_valid && (t.pending_buf[t.pending++] = t.bi_buf),
                t.bi_buf = 0,
                t.bi_valid = 0
            }
            function k(t, e, r, n) {
                var a = 2 * e
                  , i = 2 * r;
                return t[a] < t[i] || t[a] === t[i] && n[e] <= n[r]
            }
            function R(t, e, r) {
                for (var n = t.heap[r], a = r << 1; a <= t.heap_len && (a < t.heap_len && k(e, t.heap[a + 1], t.heap[a], t.depth) && a++,
                !k(e, n, t.heap[a], t.depth)); )
                    t.heap[r] = t.heap[a],
                    r = a,
                    a <<= 1;
                t.heap[r] = n
            }
            function F(t, e, r) {
                var n, a, i, o, s = 0;
                if (0 !== t.last_lit)
                    for (; n = t.pending_buf[t.d_buf + 2 * s] << 8 | t.pending_buf[t.d_buf + 2 * s + 1],
                    a = t.pending_buf[t.l_buf + s],
                    s++,
                    0 === n ? S(t, a, e) : (S(t, (i = h[a]) + 256 + 1, e),
                    0 !== (o = l[i]) && C(t, a -= m[i], o),
                    S(t, i = w(--n), r),
                    0 !== (o = c[i]) && C(t, n -= b[i], o)),
                    s < t.last_lit; )
                        ;
                S(t, 256, e)
            }
            function I(t, e) {
                var r, n, a, i = e.dyn_tree, o = e.stat_desc.static_tree, s = e.stat_desc.has_stree, l = e.stat_desc.elems, c = -1;
                for (t.heap_len = 0,
                t.heap_max = 573,
                r = 0; r < l; r++)
                    0 !== i[2 * r] ? (t.heap[++t.heap_len] = c = r,
                    t.depth[r] = 0) : i[2 * r + 1] = 0;
                for (; t.heap_len < 2; )
                    i[2 * (a = t.heap[++t.heap_len] = c < 2 ? ++c : 0)] = 1,
                    t.depth[a] = 0,
                    t.opt_len--,
                    s && (t.static_len -= o[2 * a + 1]);
                for (e.max_code = c,
                r = t.heap_len >> 1; 1 <= r; r--)
                    R(t, i, r);
                for (a = l; r = t.heap[1],
                t.heap[1] = t.heap[t.heap_len--],
                R(t, i, 1),
                n = t.heap[1],
                t.heap[--t.heap_max] = r,
                t.heap[--t.heap_max] = n,
                i[2 * a] = i[2 * r] + i[2 * n],
                t.depth[a] = (t.depth[r] >= t.depth[n] ? t.depth[r] : t.depth[n]) + 1,
                i[2 * r + 1] = i[2 * n + 1] = a,
                t.heap[1] = a++,
                R(t, i, 1),
                2 <= t.heap_len; )
                    ;
                t.heap[--t.heap_max] = t.heap[1],
                function(t, e) {
                    var r, n, a, i, o, s, l = e.dyn_tree, c = e.max_code, p = e.stat_desc.static_tree, u = e.stat_desc.has_stree, f = e.stat_desc.extra_bits, d = e.stat_desc.extra_base, h = e.stat_desc.max_length, m = 0;
                    for (i = 0; i <= g; i++)
                        t.bl_count[i] = 0;
                    for (l[2 * t.heap[t.heap_max] + 1] = 0,
                    r = t.heap_max + 1; r < 573; r++)
                        h < (i = l[2 * l[2 * (n = t.heap[r]) + 1] + 1] + 1) && (i = h,
                        m++),
                        l[2 * n + 1] = i,
                        c < n || (t.bl_count[i]++,
                        o = 0,
                        d <= n && (o = f[n - d]),
                        s = l[2 * n],
                        t.opt_len += s * (i + o),
                        u && (t.static_len += s * (p[2 * n + 1] + o)));
                    if (0 !== m) {
                        do {
                            for (i = h - 1; 0 === t.bl_count[i]; )
                                i--;
                            t.bl_count[i]--,
                            t.bl_count[i + 1] += 2,
                            t.bl_count[h]--,
                            m -= 2
                        } while (0 < m);for (i = h; 0 !== i; i--)
                            for (n = t.bl_count[i]; 0 !== n; )
                                c < (a = t.heap[--r]) || (l[2 * a + 1] !== i && (t.opt_len += (i - l[2 * a + 1]) * l[2 * a],
                                l[2 * a + 1] = i),
                                n--)
                    }
                }(t, e),
                E(i, c, t.bl_count)
            }
            function O(t, e, r) {
                var n, a, i = -1, o = e[1], s = 0, l = 7, c = 4;
                for (0 === o && (l = 138,
                c = 3),
                e[2 * (r + 1) + 1] = 65535,
                n = 0; n <= r; n++)
                    a = o,
                    o = e[2 * (n + 1) + 1],
                    ++s < l && a === o || (s < c ? t.bl_tree[2 * a] += s : 0 !== a ? (a !== i && t.bl_tree[2 * a]++,
                    t.bl_tree[32]++) : s <= 10 ? t.bl_tree[34]++ : t.bl_tree[36]++,
                    i = a,
                    c = (s = 0) === o ? (l = 138,
                    3) : a === o ? (l = 6,
                    3) : (l = 7,
                    4))
            }
            function B(t, e, r) {
                var n, a, i = -1, o = e[1], s = 0, l = 7, c = 4;
                for (0 === o && (l = 138,
                c = 3),
                n = 0; n <= r; n++)
                    if (a = o,
                    o = e[2 * (n + 1) + 1],
                    !(++s < l && a === o)) {
                        if (s < c)
                            for (; S(t, a, t.bl_tree),
                            0 != --s; )
                                ;
                        else
                            0 !== a ? (a !== i && (S(t, a, t.bl_tree),
                            s--),
                            S(t, 16, t.bl_tree),
                            C(t, s - 3, 2)) : s <= 10 ? (S(t, 17, t.bl_tree),
                            C(t, s - 3, 3)) : (S(t, 18, t.bl_tree),
                            C(t, s - 11, 7));
                        i = a,
                        c = (s = 0) === o ? (l = 138,
                        3) : a === o ? (l = 6,
                        3) : (l = 7,
                        4)
                    }
            }
            n(b);
            var N = !1;
            function D(t, e, r, n) {
                var a, i, o;
                C(t, 0 + (n ? 1 : 0), 3),
                i = e,
                o = r,
                L(a = t),
                _(a, o),
                _(a, ~o),
                s.arraySet(a.pending_buf, a.window, i, o, a.pending),
                a.pending += o
            }
            r._tr_init = function(t) {
                N || (function() {
                    var t, e, r, n, a, i = new Array(g + 1);
                    for (n = r = 0; n < 28; n++)
                        for (m[n] = r,
                        t = 0; t < 1 << l[n]; t++)
                            h[r++] = n;
                    for (h[r - 1] = n,
                    n = a = 0; n < 16; n++)
                        for (b[n] = a,
                        t = 0; t < 1 << c[n]; t++)
                            d[a++] = n;
                    for (a >>= 7; n < 30; n++)
                        for (b[n] = a << 7,
                        t = 0; t < 1 << c[n] - 7; t++)
                            d[256 + a++] = n;
                    for (e = 0; e <= g; e++)
                        i[e] = 0;
                    for (t = 0; t <= 143; )
                        u[2 * t + 1] = 8,
                        t++,
                        i[8]++;
                    for (; t <= 255; )
                        u[2 * t + 1] = 9,
                        t++,
                        i[9]++;
                    for (; t <= 279; )
                        u[2 * t + 1] = 7,
                        t++,
                        i[7]++;
                    for (; t <= 287; )
                        u[2 * t + 1] = 8,
                        t++,
                        i[8]++;
                    for (E(u, 287, i),
                    t = 0; t < 30; t++)
                        f[2 * t + 1] = 5,
                        f[2 * t] = P(t, 5);
                    A = new x(u,l,257,286,g),
                    v = new x(f,c,0,30,g),
                    y = new x(new Array(0),o,0,19,7)
                }(),
                N = !0),
                t.l_desc = new i(t.dyn_ltree,A),
                t.d_desc = new i(t.dyn_dtree,v),
                t.bl_desc = new i(t.bl_tree,y),
                t.bi_buf = 0,
                t.bi_valid = 0,
                T(t)
            }
            ,
            r._tr_stored_block = D,
            r._tr_flush_block = function(t, e, r, n) {
                var a, i, o = 0;
                0 < t.level ? (2 === t.strm.data_type && (t.strm.data_type = function(t) {
                    var e, r = 4093624447;
                    for (e = 0; e <= 31; e++,
                    r >>>= 1)
                        if (1 & r && 0 !== t.dyn_ltree[2 * e])
                            return 0;
                    if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26])
                        return 1;
                    for (e = 32; e < 256; e++)
                        if (0 !== t.dyn_ltree[2 * e])
                            return 1;
                    return 0
                }(t)),
                I(t, t.l_desc),
                I(t, t.d_desc),
                o = function(t) {
                    var e;
                    for (O(t, t.dyn_ltree, t.l_desc.max_code),
                    O(t, t.dyn_dtree, t.d_desc.max_code),
                    I(t, t.bl_desc),
                    e = 18; 3 <= e && 0 === t.bl_tree[2 * p[e] + 1]; e--)
                        ;
                    return t.opt_len += 3 * (e + 1) + 5 + 5 + 4,
                    e
                }(t),
                a = t.opt_len + 3 + 7 >>> 3,
                (i = t.static_len + 3 + 7 >>> 3) <= a && (a = i)) : a = i = r + 5,
                r + 4 <= a && -1 !== e ? D(t, e, r, n) : 4 === t.strategy || i === a ? (C(t, 2 + (n ? 1 : 0), 3),
                F(t, u, f)) : (C(t, 4 + (n ? 1 : 0), 3),
                function(t, e, r, n) {
                    var a;
                    for (C(t, e - 257, 5),
                    C(t, r - 1, 5),
                    C(t, n - 4, 4),
                    a = 0; a < n; a++)
                        C(t, t.bl_tree[2 * p[a] + 1], 3);
                    B(t, t.dyn_ltree, e - 1),
                    B(t, t.dyn_dtree, r - 1)
                }(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, o + 1),
                F(t, t.dyn_ltree, t.dyn_dtree)),
                T(t),
                n && L(t)
            }
            ,
            r._tr_tally = function(t, e, r) {
                return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255,
                t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e,
                t.pending_buf[t.l_buf + t.last_lit] = 255 & r,
                t.last_lit++,
                0 === e ? t.dyn_ltree[2 * r]++ : (t.matches++,
                e--,
                t.dyn_ltree[2 * (h[r] + 256 + 1)]++,
                t.dyn_dtree[2 * w(e)]++),
                t.last_lit === t.lit_bufsize - 1
            }
            ,
            r._tr_align = function(t) {
                var e;
                C(t, 2, 3),
                S(t, 256, u),
                16 === (e = t).bi_valid ? (_(e, e.bi_buf),
                e.bi_buf = 0,
                e.bi_valid = 0) : 8 <= e.bi_valid && (e.pending_buf[e.pending++] = 255 & e.bi_buf,
                e.bi_buf >>= 8,
                e.bi_valid -= 8)
            }
        }
        , {
            "../utils/common": 41
        }],
        53: [function(t, e, r) {
            "use strict";
            e.exports = function() {
                this.input = null,
                this.next_in = 0,
                this.avail_in = 0,
                this.total_in = 0,
                this.output = null,
                this.next_out = 0,
                this.avail_out = 0,
                this.total_out = 0,
                this.msg = "",
                this.state = null,
                this.data_type = 2,
                this.adler = 0
            }
        }
        , {}],
        54: [function(t, e, r) {
            "use strict";
            e.exports = "function" == typeof setImmediate ? setImmediate : function() {
                var t = [].slice.apply(arguments);
                t.splice(1, 0, 0),
                setTimeout.apply(null, t)
            }
        }
        , {}]
    }, {}, [10])(10)
}),
function i(o, s, l) {
    function c(e, t) {
        if (!s[e]) {
            if (!o[e]) {
                var r = "function" == typeof require && require;
                if (!t && r)
                    return r(e, !0);
                if (p)
                    return p(e, !0);
                var n = new Error("Cannot find module '" + e + "'");
                throw n.code = "MODULE_NOT_FOUND",
                n
            }
            var a = s[e] = {
                exports: {}
            };
            o[e][0].call(a.exports, function(t) {
                return c(o[e][1][t] || t)
            }, a, a.exports, i, o, s, l)
        }
        return s[e].exports
    }
    for (var p = "function" == typeof require && require, t = 0; t < l.length; t++)
        c(l[t]);
    return c
}({
    1: [function(t, e, r) {
        "use strict";
        t(2);
        var n, a = (n = t(15)) && n.__esModule ? n : {
            default: n
        };
        a.default._babelPolyfill && "undefined" != typeof console && console.warn && console.warn("@babel/polyfill is loaded more than once on this page. This is probably not desirable/intended and may have consequences if different versions of the polyfills are applied sequentially. If you do need to load the polyfill more than once, use @babel/polyfill/noConflict instead to bypass the warning."),
        a.default._babelPolyfill = !0
    }
    , {
        15: 15,
        2: 2
    }],
    2: [function(t, e, r) {
        "use strict";
        t(3),
        t(5),
        t(4),
        t(11),
        t(10),
        t(13),
        t(12),
        t(14),
        t(7),
        t(8),
        t(6),
        t(9),
        t(306),
        t(307)
    }
    , {
        10: 10,
        11: 11,
        12: 12,
        13: 13,
        14: 14,
        3: 3,
        306: 306,
        307: 307,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9
    }],
    3: [function(t, e, r) {
        t(278),
        t(214),
        t(216),
        t(215),
        t(218),
        t(220),
        t(225),
        t(219),
        t(217),
        t(227),
        t(226),
        t(222),
        t(223),
        t(221),
        t(213),
        t(224),
        t(228),
        t(229),
        t(180),
        t(182),
        t(181),
        t(231),
        t(230),
        t(201),
        t(211),
        t(212),
        t(202),
        t(203),
        t(204),
        t(205),
        t(206),
        t(207),
        t(208),
        t(209),
        t(210),
        t(184),
        t(185),
        t(186),
        t(187),
        t(188),
        t(189),
        t(190),
        t(191),
        t(192),
        t(193),
        t(194),
        t(195),
        t(196),
        t(197),
        t(198),
        t(199),
        t(200),
        t(265),
        t(270),
        t(277),
        t(268),
        t(260),
        t(261),
        t(266),
        t(271),
        t(273),
        t(256),
        t(257),
        t(258),
        t(259),
        t(262),
        t(263),
        t(264),
        t(267),
        t(269),
        t(272),
        t(274),
        t(275),
        t(276),
        t(175),
        t(177),
        t(176),
        t(179),
        t(178),
        t(163),
        t(161),
        t(168),
        t(165),
        t(171),
        t(173),
        t(160),
        t(167),
        t(157),
        t(172),
        t(155),
        t(170),
        t(169),
        t(162),
        t(166),
        t(154),
        t(156),
        t(159),
        t(158),
        t(174),
        t(164),
        t(247),
        t(248),
        t(254),
        t(249),
        t(250),
        t(251),
        t(252),
        t(253),
        t(232),
        t(183),
        t(255),
        t(290),
        t(291),
        t(279),
        t(280),
        t(285),
        t(288),
        t(289),
        t(283),
        t(286),
        t(284),
        t(287),
        t(281),
        t(282),
        t(233),
        t(234),
        t(235),
        t(236),
        t(237),
        t(240),
        t(238),
        t(239),
        t(241),
        t(242),
        t(243),
        t(244),
        t(246),
        t(245),
        e.exports = t(52)
    }
    , {
        154: 154,
        155: 155,
        156: 156,
        157: 157,
        158: 158,
        159: 159,
        160: 160,
        161: 161,
        162: 162,
        163: 163,
        164: 164,
        165: 165,
        166: 166,
        167: 167,
        168: 168,
        169: 169,
        170: 170,
        171: 171,
        172: 172,
        173: 173,
        174: 174,
        175: 175,
        176: 176,
        177: 177,
        178: 178,
        179: 179,
        180: 180,
        181: 181,
        182: 182,
        183: 183,
        184: 184,
        185: 185,
        186: 186,
        187: 187,
        188: 188,
        189: 189,
        190: 190,
        191: 191,
        192: 192,
        193: 193,
        194: 194,
        195: 195,
        196: 196,
        197: 197,
        198: 198,
        199: 199,
        200: 200,
        201: 201,
        202: 202,
        203: 203,
        204: 204,
        205: 205,
        206: 206,
        207: 207,
        208: 208,
        209: 209,
        210: 210,
        211: 211,
        212: 212,
        213: 213,
        214: 214,
        215: 215,
        216: 216,
        217: 217,
        218: 218,
        219: 219,
        220: 220,
        221: 221,
        222: 222,
        223: 223,
        224: 224,
        225: 225,
        226: 226,
        227: 227,
        228: 228,
        229: 229,
        230: 230,
        231: 231,
        232: 232,
        233: 233,
        234: 234,
        235: 235,
        236: 236,
        237: 237,
        238: 238,
        239: 239,
        240: 240,
        241: 241,
        242: 242,
        243: 243,
        244: 244,
        245: 245,
        246: 246,
        247: 247,
        248: 248,
        249: 249,
        250: 250,
        251: 251,
        252: 252,
        253: 253,
        254: 254,
        255: 255,
        256: 256,
        257: 257,
        258: 258,
        259: 259,
        260: 260,
        261: 261,
        262: 262,
        263: 263,
        264: 264,
        265: 265,
        266: 266,
        267: 267,
        268: 268,
        269: 269,
        270: 270,
        271: 271,
        272: 272,
        273: 273,
        274: 274,
        275: 275,
        276: 276,
        277: 277,
        278: 278,
        279: 279,
        280: 280,
        281: 281,
        282: 282,
        283: 283,
        284: 284,
        285: 285,
        286: 286,
        287: 287,
        288: 288,
        289: 289,
        290: 290,
        291: 291,
        52: 52
    }],
    4: [function(t, e, r) {
        t(292),
        e.exports = t(52).Array.flatMap
    }
    , {
        292: 292,
        52: 52
    }],
    5: [function(t, e, r) {
        t(293),
        e.exports = t(52).Array.includes
    }
    , {
        293: 293,
        52: 52
    }],
    6: [function(t, e, r) {
        t(294),
        e.exports = t(52).Object.entries
    }
    , {
        294: 294,
        52: 52
    }],
    7: [function(t, e, r) {
        t(295),
        e.exports = t(52).Object.getOwnPropertyDescriptors
    }
    , {
        295: 295,
        52: 52
    }],
    8: [function(t, e, r) {
        t(296),
        e.exports = t(52).Object.values
    }
    , {
        296: 296,
        52: 52
    }],
    9: [function(t, e, r) {
        "use strict";
        t(232),
        t(297),
        e.exports = t(52).Promise.finally
    }
    , {
        232: 232,
        297: 297,
        52: 52
    }],
    10: [function(t, e, r) {
        t(298),
        e.exports = t(52).String.padEnd
    }
    , {
        298: 298,
        52: 52
    }],
    11: [function(t, e, r) {
        t(299),
        e.exports = t(52).String.padStart
    }
    , {
        299: 299,
        52: 52
    }],
    12: [function(t, e, r) {
        t(301),
        e.exports = t(52).String.trimRight
    }
    , {
        301: 301,
        52: 52
    }],
    13: [function(t, e, r) {
        t(300),
        e.exports = t(52).String.trimLeft
    }
    , {
        300: 300,
        52: 52
    }],
    14: [function(t, e, r) {
        t(302),
        e.exports = t(151).f("asyncIterator")
    }
    , {
        151: 151,
        302: 302
    }],
    15: [function(t, e, r) {
        t(32),
        e.exports = t(18).global
    }
    , {
        18: 18,
        32: 32
    }],
    16: [function(t, e, r) {
        e.exports = function(t) {
            if ("function" != typeof t)
                throw TypeError(t + " is not a function!");
            return t
        }
    }
    , {}],
    17: [function(t, e, r) {
        var n = t(28);
        e.exports = function(t) {
            if (!n(t))
                throw TypeError(t + " is not an object!");
            return t
        }
    }
    , {
        28: 28
    }],
    18: [function(t, e, r) {
        var n = e.exports = {
            version: "2.6.11"
        };
        "number" == typeof __e && (__e = n)
    }
    , {}],
    19: [function(t, e, r) {
        var i = t(16);
        e.exports = function(n, a, t) {
            if (i(n),
            void 0 === a)
                return n;
            switch (t) {
            case 1:
                return function(t) {
                    return n.call(a, t)
                }
                ;
            case 2:
                return function(t, e) {
                    return n.call(a, t, e)
                }
                ;
            case 3:
                return function(t, e, r) {
                    return n.call(a, t, e, r)
                }
            }
            return function() {
                return n.apply(a, arguments)
            }
        }
    }
    , {
        16: 16
    }],
    20: [function(t, e, r) {
        e.exports = !t(23)(function() {
            return 7 != Object.defineProperty({}, "a", {
                get: function() {
                    return 7
                }
            }).a
        })
    }
    , {
        23: 23
    }],
    21: [function(t, e, r) {
        var n = t(28)
          , a = t(24).document
          , i = n(a) && n(a.createElement);
        e.exports = function(t) {
            return i ? a.createElement(t) : {}
        }
    }
    , {
        24: 24,
        28: 28
    }],
    22: [function(t, e, r) {
        var m = t(24)
          , g = t(18)
          , A = t(19)
          , v = t(26)
          , y = t(25)
          , b = "prototype"
          , x = function(t, e, r) {
            var n, a, i, o = t & x.F, s = t & x.G, l = t & x.S, c = t & x.P, p = t & x.B, u = t & x.W, f = s ? g : g[e] || (g[e] = {}), d = f[b], h = s ? m : l ? m[e] : (m[e] || {})[b];
            for (n in s && (r = e),
            r)
                (a = !o && h && void 0 !== h[n]) && y(f, n) || (i = a ? h[n] : r[n],
                f[n] = s && "function" != typeof h[n] ? r[n] : p && a ? A(i, m) : u && h[n] == i ? function(n) {
                    function t(t, e, r) {
                        if (this instanceof n) {
                            switch (arguments.length) {
                            case 0:
                                return new n;
                            case 1:
                                return new n(t);
                            case 2:
                                return new n(t,e)
                            }
                            return new n(t,e,r)
                        }
                        return n.apply(this, arguments)
                    }
                    return t[b] = n[b],
                    t
                }(i) : c && "function" == typeof i ? A(Function.call, i) : i,
                c && ((f.virtual || (f.virtual = {}))[n] = i,
                t & x.R && d && !d[n] && v(d, n, i)))
        };
        x.F = 1,
        x.G = 2,
        x.S = 4,
        x.P = 8,
        x.B = 16,
        x.W = 32,
        x.U = 64,
        x.R = 128,
        e.exports = x
    }
    , {
        18: 18,
        19: 19,
        24: 24,
        25: 25,
        26: 26
    }],
    23: [function(t, e, r) {
        e.exports = function(t) {
            try {
                return !!t()
            } catch (t) {
                return !0
            }
        }
    }
    , {}],
    24: [function(t, e, r) {
        var n = e.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
        "number" == typeof __g && (__g = n)
    }
    , {}],
    25: [function(t, e, r) {
        var n = {}.hasOwnProperty;
        e.exports = function(t, e) {
            return n.call(t, e)
        }
    }
    , {}],
    26: [function(t, e, r) {
        var n = t(29)
          , a = t(30);
        e.exports = t(20) ? function(t, e, r) {
            return n.f(t, e, a(1, r))
        }
        : function(t, e, r) {
            return t[e] = r,
            t
        }
    }
    , {
        20: 20,
        29: 29,
        30: 30
    }],
    27: [function(t, e, r) {
        e.exports = !t(20) && !t(23)(function() {
            return 7 != Object.defineProperty(t(21)("div"), "a", {
                get: function() {
                    return 7
                }
            }).a
        })
    }
    , {
        20: 20,
        21: 21,
        23: 23
    }],
    28: [function(t, e, r) {
        e.exports = function(t) {
            return "object" == typeof t ? null !== t : "function" == typeof t
        }
    }
    , {}],
    29: [function(t, e, r) {
        var n = t(17)
          , a = t(27)
          , i = t(31)
          , o = Object.defineProperty;
        r.f = t(20) ? Object.defineProperty : function(t, e, r) {
            if (n(t),
            e = i(e, !0),
            n(r),
            a)
                try {
                    return o(t, e, r)
                } catch (t) {}
            if ("get"in r || "set"in r)
                throw TypeError("Accessors not supported!");
            return "value"in r && (t[e] = r.value),
            t
        }
    }
    , {
        17: 17,
        20: 20,
        27: 27,
        31: 31
    }],
    30: [function(t, e, r) {
        e.exports = function(t, e) {
            return {
                enumerable: !(1 & t),
                configurable: !(2 & t),
                writable: !(4 & t),
                value: e
            }
        }
    }
    , {}],
    31: [function(t, e, r) {
        var a = t(28);
        e.exports = function(t, e) {
            if (!a(t))
                return t;
            var r, n;
            if (e && "function" == typeof (r = t.toString) && !a(n = r.call(t)))
                return n;
            if ("function" == typeof (r = t.valueOf) && !a(n = r.call(t)))
                return n;
            if (!e && "function" == typeof (r = t.toString) && !a(n = r.call(t)))
                return n;
            throw TypeError("Can't convert object to primitive value")
        }
    }
    , {
        28: 28
    }],
    32: [function(t, e, r) {
        var n = t(22);
        n(n.G, {
            global: t(24)
        })
    }
    , {
        22: 22,
        24: 24
    }],
    33: [function(t, e, r) {
        arguments[4][16][0].apply(r, arguments)
    }
    , {
        16: 16
    }],
    34: [function(t, e, r) {
        var n = t(48);
        e.exports = function(t, e) {
            if ("number" != typeof t && "Number" != n(t))
                throw TypeError(e);
            return +t
        }
    }
    , {
        48: 48
    }],
    35: [function(t, e, r) {
        var n = t(152)("unscopables")
          , a = Array.prototype;
        null == a[n] && t(72)(a, n, {}),
        e.exports = function(t) {
            a[n][t] = !0
        }
    }
    , {
        152: 152,
        72: 72
    }],
    36: [function(t, e, r) {
        "use strict";
        var n = t(129)(!0);
        e.exports = function(t, e, r) {
            return e + (r ? n(t, e).length : 1)
        }
    }
    , {
        129: 129
    }],
    37: [function(t, e, r) {
        e.exports = function(t, e, r, n) {
            if (!(t instanceof e) || void 0 !== n && n in t)
                throw TypeError(r + ": incorrect invocation!");
            return t
        }
    }
    , {}],
    38: [function(t, e, r) {
        arguments[4][17][0].apply(r, arguments)
    }
    , {
        17: 17,
        81: 81
    }],
    39: [function(t, e, r) {
        "use strict";
        var p = t(142)
          , u = t(137)
          , f = t(141);
        e.exports = [].copyWithin || function(t, e, r) {
            var n = p(this)
              , a = f(n.length)
              , i = u(t, a)
              , o = u(e, a)
              , s = 2 < arguments.length ? r : void 0
              , l = Math.min((void 0 === s ? a : u(s, a)) - o, a - i)
              , c = 1;
            for (o < i && i < o + l && (c = -1,
            o += l - 1,
            i += l - 1); 0 < l--; )
                o in n ? n[i] = n[o] : delete n[i],
                i += c,
                o += c;
            return n
        }
    }
    , {
        137: 137,
        141: 141,
        142: 142
    }],
    40: [function(t, e, r) {
        "use strict";
        var c = t(142)
          , p = t(137)
          , u = t(141);
        e.exports = function(t, e, r) {
            for (var n = c(this), a = u(n.length), i = arguments.length, o = p(1 < i ? e : void 0, a), s = 2 < i ? r : void 0, l = void 0 === s ? a : p(s, a); o < l; )
                n[o++] = t;
            return n
        }
    }
    , {
        137: 137,
        141: 141,
        142: 142
    }],
    41: [function(t, e, r) {
        var l = t(140)
          , c = t(141)
          , p = t(137);
        e.exports = function(s) {
            return function(t, e, r) {
                var n, a = l(t), i = c(a.length), o = p(r, i);
                if (s && e != e) {
                    for (; o < i; )
                        if ((n = a[o++]) != n)
                            return !0
                } else
                    for (; o < i; o++)
                        if ((s || o in a) && a[o] === e)
                            return s || o || 0;
                return !s && -1
            }
        }
    }
    , {
        137: 137,
        140: 140,
        141: 141
    }],
    42: [function(t, e, r) {
        var y = t(54)
          , b = t(77)
          , x = t(142)
          , w = t(141)
          , n = t(45);
        e.exports = function(u, t) {
            var f = 1 == u
              , d = 2 == u
              , h = 3 == u
              , m = 4 == u
              , g = 6 == u
              , A = 5 == u || g
              , v = t || n;
            return function(t, e, r) {
                for (var n, a, i = x(t), o = b(i), s = y(e, r, 3), l = w(o.length), c = 0, p = f ? v(t, l) : d ? v(t, 0) : void 0; c < l; c++)
                    if ((A || c in o) && (a = s(n = o[c], c, i),
                    u))
                        if (f)
                            p[c] = a;
                        else if (a)
                            switch (u) {
                            case 3:
                                return !0;
                            case 5:
                                return n;
                            case 6:
                                return c;
                            case 2:
                                p.push(n)
                            }
                        else if (m)
                            return !1;
                return g ? -1 : h || m ? m : p
            }
        }
    }
    , {
        141: 141,
        142: 142,
        45: 45,
        54: 54,
        77: 77
    }],
    43: [function(t, e, r) {
        var p = t(33)
          , u = t(142)
          , f = t(77)
          , d = t(141);
        e.exports = function(t, e, r, n, a) {
            p(e);
            var i = u(t)
              , o = f(i)
              , s = d(i.length)
              , l = a ? s - 1 : 0
              , c = a ? -1 : 1;
            if (r < 2)
                for (; ; ) {
                    if (l in o) {
                        n = o[l],
                        l += c;
                        break
                    }
                    if (l += c,
                    a ? l < 0 : s <= l)
                        throw TypeError("Reduce of empty array with no initial value")
                }
            for (; a ? 0 <= l : l < s; l += c)
                l in o && (n = e(n, o[l], l, i));
            return n
        }
    }
    , {
        141: 141,
        142: 142,
        33: 33,
        77: 77
    }],
    44: [function(t, e, r) {
        var n = t(81)
          , a = t(79)
          , i = t(152)("species");
        e.exports = function(t) {
            var e;
            return a(t) && ("function" != typeof (e = t.constructor) || e !== Array && !a(e.prototype) || (e = void 0),
            n(e) && null === (e = e[i]) && (e = void 0)),
            void 0 === e ? Array : e
        }
    }
    , {
        152: 152,
        79: 79,
        81: 81
    }],
    45: [function(t, e, r) {
        var n = t(44);
        e.exports = function(t, e) {
            return new (n(t))(e)
        }
    }
    , {
        44: 44
    }],
    46: [function(t, e, r) {
        "use strict";
        var i = t(33)
          , o = t(81)
          , s = t(76)
          , l = [].slice
          , c = {};
        e.exports = Function.bind || function(e) {
            var r = i(this)
              , n = l.call(arguments, 1)
              , a = function() {
                var t = n.concat(l.call(arguments));
                return this instanceof a ? function(t, e, r) {
                    if (!(e in c)) {
                        for (var n = [], a = 0; a < e; a++)
                            n[a] = "a[" + a + "]";
                        c[e] = Function("F,a", "return new F(" + n.join(",") + ")")
                    }
                    return c[e](t, r)
                }(r, t.length, t) : s(r, t, e)
            };
            return o(r.prototype) && (a.prototype = r.prototype),
            a
        }
    }
    , {
        33: 33,
        76: 76,
        81: 81
    }],
    47: [function(t, e, r) {
        var a = t(48)
          , i = t(152)("toStringTag")
          , o = "Arguments" == a(function() {
            return arguments
        }());
        e.exports = function(t) {
            var e, r, n;
            return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (r = function(t, e) {
                try {
                    return t[e]
                } catch (t) {}
            }(e = Object(t), i)) ? r : o ? a(e) : "Object" == (n = a(e)) && "function" == typeof e.callee ? "Arguments" : n
        }
    }
    , {
        152: 152,
        48: 48
    }],
    48: [function(t, e, r) {
        var n = {}.toString;
        e.exports = function(t) {
            return n.call(t).slice(8, -1)
        }
    }
    , {}],
    49: [function(t, e, r) {
        "use strict";
        function o(t, e) {
            var r, n = h(e);
            if ("F" !== n)
                return t._i[n];
            for (r = t._f; r; r = r.n)
                if (r.k == e)
                    return r
        }
        var s = t(99).f
          , l = t(98)
          , c = t(117)
          , p = t(54)
          , u = t(37)
          , f = t(68)
          , n = t(85)
          , a = t(87)
          , i = t(123)
          , d = t(58)
          , h = t(94).fastKey
          , m = t(149)
          , g = d ? "_s" : "size";
        e.exports = {
            getConstructor: function(t, i, r, n) {
                var a = t(function(t, e) {
                    u(t, a, i, "_i"),
                    t._t = i,
                    t._i = l(null),
                    t._f = void 0,
                    t._l = void 0,
                    t[g] = 0,
                    null != e && f(e, r, t[n], t)
                });
                return c(a.prototype, {
                    clear: function() {
                        for (var t = m(this, i), e = t._i, r = t._f; r; r = r.n)
                            r.r = !0,
                            r.p && (r.p = r.p.n = void 0),
                            delete e[r.i];
                        t._f = t._l = void 0,
                        t[g] = 0
                    },
                    delete: function(t) {
                        var e = m(this, i)
                          , r = o(e, t);
                        if (r) {
                            var n = r.n
                              , a = r.p;
                            delete e._i[r.i],
                            r.r = !0,
                            a && (a.n = n),
                            n && (n.p = a),
                            e._f == r && (e._f = n),
                            e._l == r && (e._l = a),
                            e[g]--
                        }
                        return !!r
                    },
                    forEach: function(t, e) {
                        m(this, i);
                        for (var r, n = p(t, 1 < arguments.length ? e : void 0, 3); r = r ? r.n : this._f; )
                            for (n(r.v, r.k, this); r && r.r; )
                                r = r.p
                    },
                    has: function(t) {
                        return !!o(m(this, i), t)
                    }
                }),
                d && s(a.prototype, "size", {
                    get: function() {
                        return m(this, i)[g]
                    }
                }),
                a
            },
            def: function(t, e, r) {
                var n, a, i = o(t, e);
                return i ? i.v = r : (t._l = i = {
                    i: a = h(e, !0),
                    k: e,
                    v: r,
                    p: n = t._l,
                    n: void 0,
                    r: !1
                },
                t._f || (t._f = i),
                n && (n.n = i),
                t[g]++,
                "F" !== a && (t._i[a] = i)),
                t
            },
            getEntry: o,
            setStrong: function(t, r, e) {
                n(t, r, function(t, e) {
                    this._t = m(t, r),
                    this._k = e,
                    this._l = void 0
                }, function() {
                    for (var t = this, e = t._k, r = t._l; r && r.r; )
                        r = r.p;
                    return t._t && (t._l = r = r ? r.n : t._t._f) ? a(0, "keys" == e ? r.k : "values" == e ? r.v : [r.k, r.v]) : (t._t = void 0,
                    a(1))
                }, e ? "entries" : "values", !e, !0),
                i(r)
            }
        }
    }
    , {
        117: 117,
        123: 123,
        149: 149,
        37: 37,
        54: 54,
        58: 58,
        68: 68,
        85: 85,
        87: 87,
        94: 94,
        98: 98,
        99: 99
    }],
    50: [function(t, e, r) {
        "use strict";
        function o(t) {
            return t._l || (t._l = new a)
        }
        function n(t, e) {
            return m(t.a, function(t) {
                return t[0] === e
            })
        }
        function a() {
            this.a = []
        }
        var s = t(117)
          , l = t(94).getWeak
          , i = t(38)
          , c = t(81)
          , p = t(37)
          , u = t(68)
          , f = t(42)
          , d = t(71)
          , h = t(149)
          , m = f(5)
          , g = f(6)
          , A = 0;
        a.prototype = {
            get: function(t) {
                var e = n(this, t);
                if (e)
                    return e[1]
            },
            has: function(t) {
                return !!n(this, t)
            },
            set: function(t, e) {
                var r = n(this, t);
                r ? r[1] = e : this.a.push([t, e])
            },
            delete: function(e) {
                var t = g(this.a, function(t) {
                    return t[0] === e
                });
                return ~t && this.a.splice(t, 1),
                !!~t
            }
        },
        e.exports = {
            getConstructor: function(t, r, n, a) {
                var i = t(function(t, e) {
                    p(t, i, r, "_i"),
                    t._t = r,
                    t._i = A++,
                    t._l = void 0,
                    null != e && u(e, n, t[a], t)
                });
                return s(i.prototype, {
                    delete: function(t) {
                        if (!c(t))
                            return !1;
                        var e = l(t);
                        return !0 === e ? o(h(this, r)).delete(t) : e && d(e, this._i) && delete e[this._i]
                    },
                    has: function(t) {
                        if (!c(t))
                            return !1;
                        var e = l(t);
                        return !0 === e ? o(h(this, r)).has(t) : e && d(e, this._i)
                    }
                }),
                i
            },
            def: function(t, e, r) {
                var n = l(i(e), !0);
                return !0 === n ? o(t).set(e, r) : n[t._i] = r,
                t
            },
            ufstore: o
        }
    }
    , {
        117: 117,
        149: 149,
        37: 37,
        38: 38,
        42: 42,
        68: 68,
        71: 71,
        81: 81,
        94: 94
    }],
    51: [function(t, e, r) {
        "use strict";
        var A = t(70)
          , v = t(62)
          , y = t(118)
          , b = t(117)
          , x = t(94)
          , w = t(68)
          , _ = t(37)
          , C = t(81)
          , S = t(64)
          , P = t(86)
          , E = t(124)
          , T = t(75);
        e.exports = function(n, t, e, r, a, i) {
            function o(t) {
                var r = p[t];
                y(p, t, "delete" == t ? function(t) {
                    return !(i && !C(t)) && r.call(this, 0 === t ? 0 : t)
                }
                : "has" == t ? function(t) {
                    return !(i && !C(t)) && r.call(this, 0 === t ? 0 : t)
                }
                : "get" == t ? function(t) {
                    return i && !C(t) ? void 0 : r.call(this, 0 === t ? 0 : t)
                }
                : "add" == t ? function(t) {
                    return r.call(this, 0 === t ? 0 : t),
                    this
                }
                : function(t, e) {
                    return r.call(this, 0 === t ? 0 : t, e),
                    this
                }
                )
            }
            var s = A[n]
              , l = s
              , c = a ? "set" : "add"
              , p = l && l.prototype
              , u = {};
            if ("function" == typeof l && (i || p.forEach && !S(function() {
                (new l).entries().next()
            }))) {
                var f = new l
                  , d = f[c](i ? {} : -0, 1) != f
                  , h = S(function() {
                    f.has(1)
                })
                  , m = P(function(t) {
                    new l(t)
                })
                  , g = !i && S(function() {
                    for (var t = new l, e = 5; e--; )
                        t[c](e, e);
                    return !t.has(-0)
                });
                m || (((l = t(function(t, e) {
                    _(t, l, n);
                    var r = T(new s, t, l);
                    return null != e && w(e, a, r[c], r),
                    r
                })).prototype = p).constructor = l),
                (h || g) && (o("delete"),
                o("has"),
                a && o("get")),
                (g || d) && o(c),
                i && p.clear && delete p.clear
            } else
                l = r.getConstructor(t, n, a, c),
                b(l.prototype, e),
                x.NEED = !0;
            return E(l, n),
            u[n] = l,
            v(v.G + v.W + v.F * (l != s), u),
            i || r.setStrong(l, n, a),
            l
        }
    }
    , {
        117: 117,
        118: 118,
        124: 124,
        37: 37,
        62: 62,
        64: 64,
        68: 68,
        70: 70,
        75: 75,
        81: 81,
        86: 86,
        94: 94
    }],
    52: [function(t, e, r) {
        arguments[4][18][0].apply(r, arguments)
    }
    , {
        18: 18
    }],
    53: [function(t, e, r) {
        "use strict";
        var n = t(99)
          , a = t(116);
        e.exports = function(t, e, r) {
            e in t ? n.f(t, e, a(0, r)) : t[e] = r
        }
    }
    , {
        116: 116,
        99: 99
    }],
    54: [function(t, e, r) {
        arguments[4][19][0].apply(r, arguments)
    }
    , {
        19: 19,
        33: 33
    }],
    55: [function(t, e, r) {
        "use strict";
        function a(t) {
            return 9 < t ? t : "0" + t
        }
        var n = t(64)
          , i = Date.prototype.getTime
          , o = Date.prototype.toISOString;
        e.exports = n(function() {
            return "0385-07-25T07:06:39.999Z" != o.call(new Date(-5e13 - 1))
        }) || !n(function() {
            o.call(new Date(NaN))
        }) ? function() {
            if (!isFinite(i.call(this)))
                throw RangeError("Invalid time value");
            var t = this
              , e = t.getUTCFullYear()
              , r = t.getUTCMilliseconds()
              , n = e < 0 ? "-" : 9999 < e ? "+" : "";
            return n + ("00000" + Math.abs(e)).slice(n ? -6 : -4) + "-" + a(t.getUTCMonth() + 1) + "-" + a(t.getUTCDate()) + "T" + a(t.getUTCHours()) + ":" + a(t.getUTCMinutes()) + ":" + a(t.getUTCSeconds()) + "." + (99 < r ? r : "0" + a(r)) + "Z"
        }
        : o
    }
    , {
        64: 64
    }],
    56: [function(t, e, r) {
        "use strict";
        var n = t(38)
          , a = t(143);
        e.exports = function(t) {
            if ("string" !== t && "number" !== t && "default" !== t)
                throw TypeError("Incorrect hint");
            return a(n(this), "number" != t)
        }
    }
    , {
        143: 143,
        38: 38
    }],
    57: [function(t, e, r) {
        e.exports = function(t) {
            if (null == t)
                throw TypeError("Can't call method on  " + t);
            return t
        }
    }
    , {}],
    58: [function(t, e, r) {
        arguments[4][20][0].apply(r, arguments)
    }
    , {
        20: 20,
        64: 64
    }],
    59: [function(t, e, r) {
        arguments[4][21][0].apply(r, arguments)
    }
    , {
        21: 21,
        70: 70,
        81: 81
    }],
    60: [function(t, e, r) {
        e.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
    }
    , {}],
    61: [function(t, e, r) {
        var s = t(107)
          , l = t(104)
          , c = t(108);
        e.exports = function(t) {
            var e = s(t)
              , r = l.f;
            if (r)
                for (var n, a = r(t), i = c.f, o = 0; a.length > o; )
                    i.call(t, n = a[o++]) && e.push(n);
            return e
        }
    }
    , {
        104: 104,
        107: 107,
        108: 108
    }],
    62: [function(t, e, r) {
        var m = t(70)
          , g = t(52)
          , A = t(72)
          , v = t(118)
          , y = t(54)
          , b = "prototype"
          , x = function(t, e, r) {
            var n, a, i, o, s = t & x.F, l = t & x.G, c = t & x.S, p = t & x.P, u = t & x.B, f = l ? m : c ? m[e] || (m[e] = {}) : (m[e] || {})[b], d = l ? g : g[e] || (g[e] = {}), h = d[b] || (d[b] = {});
            for (n in l && (r = e),
            r)
                i = ((a = !s && f && void 0 !== f[n]) ? f : r)[n],
                o = u && a ? y(i, m) : p && "function" == typeof i ? y(Function.call, i) : i,
                f && v(f, n, i, t & x.U),
                d[n] != i && A(d, n, o),
                p && h[n] != i && (h[n] = i)
        };
        m.core = g,
        x.F = 1,
        x.G = 2,
        x.S = 4,
        x.P = 8,
        x.B = 16,
        x.W = 32,
        x.U = 64,
        x.R = 128,
        e.exports = x
    }
    , {
        118: 118,
        52: 52,
        54: 54,
        70: 70,
        72: 72
    }],
    63: [function(t, e, r) {
        var n = t(152)("match");
        e.exports = function(e) {
            var r = /./;
            try {
                "/./"[e](r)
            } catch (t) {
                try {
                    return r[n] = !1,
                    !"/./"[e](r)
                } catch (t) {}
            }
            return !0
        }
    }
    , {
        152: 152
    }],
    64: [function(t, e, r) {
        arguments[4][23][0].apply(r, arguments)
    }
    , {
        23: 23
    }],
    65: [function(t, e, r) {
        "use strict";
        t(248);
        var p = t(118)
          , u = t(72)
          , f = t(64)
          , d = t(57)
          , h = t(152)
          , m = t(120)
          , g = h("species")
          , A = !f(function() {
            var t = /./;
            return t.exec = function() {
                var t = [];
                return t.groups = {
                    a: "7"
                },
                t
            }
            ,
            "7" !== "".replace(t, "$<a>")
        })
          , v = function() {
            var t = /(?:)/
              , e = t.exec;
            t.exec = function() {
                return e.apply(this, arguments)
            }
            ;
            var r = "ab".split(t);
            return 2 === r.length && "a" === r[0] && "b" === r[1]
        }();
        e.exports = function(r, t, e) {
            var n = h(r)
              , i = !f(function() {
                var t = {};
                return t[n] = function() {
                    return 7
                }
                ,
                7 != ""[r](t)
            })
              , a = i ? !f(function() {
                var t = !1
                  , e = /a/;
                return e.exec = function() {
                    return t = !0,
                    null
                }
                ,
                "split" === r && (e.constructor = {},
                e.constructor[g] = function() {
                    return e
                }
                ),
                e[n](""),
                !t
            }) : void 0;
            if (!i || !a || "replace" === r && !A || "split" === r && !v) {
                var o = /./[n]
                  , s = e(d, n, ""[r], function(t, e, r, n, a) {
                    return e.exec === m ? i && !a ? {
                        done: !0,
                        value: o.call(e, r, n)
                    } : {
                        done: !0,
                        value: t.call(r, e, n)
                    } : {
                        done: !1
                    }
                })
                  , l = s[0]
                  , c = s[1];
                p(String.prototype, r, l),
                u(RegExp.prototype, n, 2 == t ? function(t, e) {
                    return c.call(t, this, e)
                }
                : function(t) {
                    return c.call(t, this)
                }
                )
            }
        }
    }
    , {
        118: 118,
        120: 120,
        152: 152,
        248: 248,
        57: 57,
        64: 64,
        72: 72
    }],
    66: [function(t, e, r) {
        "use strict";
        var n = t(38);
        e.exports = function() {
            var t = n(this)
              , e = "";
            return t.global && (e += "g"),
            t.ignoreCase && (e += "i"),
            t.multiline && (e += "m"),
            t.unicode && (e += "u"),
            t.sticky && (e += "y"),
            e
        }
    }
    , {
        38: 38
    }],
    67: [function(t, e, r) {
        "use strict";
        var h = t(79)
          , m = t(81)
          , g = t(141)
          , A = t(54)
          , v = t(152)("isConcatSpreadable");
        e.exports = function t(e, r, n, a, i, o, s, l) {
            for (var c, p, u = i, f = 0, d = !!s && A(s, l, 3); f < a; ) {
                if (f in n) {
                    if (c = d ? d(n[f], f, r) : n[f],
                    p = !1,
                    m(c) && (p = void 0 !== (p = c[v]) ? !!p : h(c)),
                    p && 0 < o)
                        u = t(e, r, c, g(c.length), u, o - 1) - 1;
                    else {
                        if (9007199254740991 <= u)
                            throw TypeError();
                        e[u] = c
                    }
                    u++
                }
                f++
            }
            return u
        }
    }
    , {
        141: 141,
        152: 152,
        54: 54,
        79: 79,
        81: 81
    }],
    68: [function(t, e, r) {
        var f = t(54)
          , d = t(83)
          , h = t(78)
          , m = t(38)
          , g = t(141)
          , A = t(153)
          , v = {}
          , y = {};
        (r = e.exports = function(t, e, r, n, a) {
            var i, o, s, l, c = a ? function() {
                return t
            }
            : A(t), p = f(r, n, e ? 2 : 1), u = 0;
            if ("function" != typeof c)
                throw TypeError(t + " is not iterable!");
            if (h(c)) {
                for (i = g(t.length); u < i; u++)
                    if ((l = e ? p(m(o = t[u])[0], o[1]) : p(t[u])) === v || l === y)
                        return l
            } else
                for (s = c.call(t); !(o = s.next()).done; )
                    if ((l = d(s, p, o.value, e)) === v || l === y)
                        return l
        }
        ).BREAK = v,
        r.RETURN = y
    }
    , {
        141: 141,
        153: 153,
        38: 38,
        54: 54,
        78: 78,
        83: 83
    }],
    69: [function(t, e, r) {
        e.exports = t(126)("native-function-to-string", Function.toString)
    }
    , {
        126: 126
    }],
    70: [function(t, e, r) {
        arguments[4][24][0].apply(r, arguments)
    }
    , {
        24: 24
    }],
    71: [function(t, e, r) {
        arguments[4][25][0].apply(r, arguments)
    }
    , {
        25: 25
    }],
    72: [function(t, e, r) {
        arguments[4][26][0].apply(r, arguments)
    }
    , {
        116: 116,
        26: 26,
        58: 58,
        99: 99
    }],
    73: [function(t, e, r) {
        var n = t(70).document;
        e.exports = n && n.documentElement
    }
    , {
        70: 70
    }],
    74: [function(t, e, r) {
        arguments[4][27][0].apply(r, arguments)
    }
    , {
        27: 27,
        58: 58,
        59: 59,
        64: 64
    }],
    75: [function(t, e, r) {
        var i = t(81)
          , o = t(122).set;
        e.exports = function(t, e, r) {
            var n, a = e.constructor;
            return a !== r && "function" == typeof a && (n = a.prototype) !== r.prototype && i(n) && o && o(t, n),
            t
        }
    }
    , {
        122: 122,
        81: 81
    }],
    76: [function(t, e, r) {
        e.exports = function(t, e, r) {
            var n = void 0 === r;
            switch (e.length) {
            case 0:
                return n ? t() : t.call(r);
            case 1:
                return n ? t(e[0]) : t.call(r, e[0]);
            case 2:
                return n ? t(e[0], e[1]) : t.call(r, e[0], e[1]);
            case 3:
                return n ? t(e[0], e[1], e[2]) : t.call(r, e[0], e[1], e[2]);
            case 4:
                return n ? t(e[0], e[1], e[2], e[3]) : t.call(r, e[0], e[1], e[2], e[3])
            }
            return t.apply(r, e)
        }
    }
    , {}],
    77: [function(t, e, r) {
        var n = t(48);
        e.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t) {
            return "String" == n(t) ? t.split("") : Object(t)
        }
    }
    , {
        48: 48
    }],
    78: [function(t, e, r) {
        var n = t(88)
          , a = t(152)("iterator")
          , i = Array.prototype;
        e.exports = function(t) {
            return void 0 !== t && (n.Array === t || i[a] === t)
        }
    }
    , {
        152: 152,
        88: 88
    }],
    79: [function(t, e, r) {
        var n = t(48);
        e.exports = Array.isArray || function(t) {
            return "Array" == n(t)
        }
    }
    , {
        48: 48
    }],
    80: [function(t, e, r) {
        var n = t(81)
          , a = Math.floor;
        e.exports = function(t) {
            return !n(t) && isFinite(t) && a(t) === t
        }
    }
    , {
        81: 81
    }],
    81: [function(t, e, r) {
        arguments[4][28][0].apply(r, arguments)
    }
    , {
        28: 28
    }],
    82: [function(t, e, r) {
        var n = t(81)
          , a = t(48)
          , i = t(152)("match");
        e.exports = function(t) {
            var e;
            return n(t) && (void 0 !== (e = t[i]) ? !!e : "RegExp" == a(t))
        }
    }
    , {
        152: 152,
        48: 48,
        81: 81
    }],
    83: [function(t, e, r) {
        var i = t(38);
        e.exports = function(t, e, r, n) {
            try {
                return n ? e(i(r)[0], r[1]) : e(r)
            } catch (e) {
                var a = t.return;
                throw void 0 !== a && i(a.call(t)),
                e
            }
        }
    }
    , {
        38: 38
    }],
    84: [function(t, e, r) {
        "use strict";
        var n = t(98)
          , a = t(116)
          , i = t(124)
          , o = {};
        t(72)(o, t(152)("iterator"), function() {
            return this
        }),
        e.exports = function(t, e, r) {
            t.prototype = n(o, {
                next: a(1, r)
            }),
            i(t, e + " Iterator")
        }
    }
    , {
        116: 116,
        124: 124,
        152: 152,
        72: 72,
        98: 98
    }],
    85: [function(t, e, r) {
        "use strict";
        function y() {
            return this
        }
        var b = t(89)
          , x = t(62)
          , w = t(118)
          , _ = t(72)
          , C = t(88)
          , S = t(84)
          , P = t(124)
          , E = t(105)
          , T = t(152)("iterator")
          , L = !([].keys && "next"in [].keys())
          , k = "values";
        e.exports = function(t, e, r, n, a, i, o) {
            function s(t) {
                if (!L && t in h)
                    return h[t];
                switch (t) {
                case "keys":
                case k:
                    return function() {
                        return new r(this,t)
                    }
                }
                return function() {
                    return new r(this,t)
                }
            }
            S(r, e, n);
            var l, c, p, u = e + " Iterator", f = a == k, d = !1, h = t.prototype, m = h[T] || h["@@iterator"] || a && h[a], g = m || s(a), A = a ? f ? s("entries") : g : void 0, v = "Array" == e && h.entries || m;
            if (v && (p = E(v.call(new t))) !== Object.prototype && p.next && (P(p, u, !0),
            b || "function" == typeof p[T] || _(p, T, y)),
            f && m && m.name !== k && (d = !0,
            g = function() {
                return m.call(this)
            }
            ),
            b && !o || !L && !d && h[T] || _(h, T, g),
            C[e] = g,
            C[u] = y,
            a)
                if (l = {
                    values: f ? g : s(k),
                    keys: i ? g : s("keys"),
                    entries: A
                },
                o)
                    for (c in l)
                        c in h || w(h, c, l[c]);
                else
                    x(x.P + x.F * (L || d), e, l);
            return l
        }
    }
    , {
        105: 105,
        118: 118,
        124: 124,
        152: 152,
        62: 62,
        72: 72,
        84: 84,
        88: 88,
        89: 89
    }],
    86: [function(t, e, r) {
        var i = t(152)("iterator")
          , o = !1;
        try {
            var n = [7][i]();
            n.return = function() {
                o = !0
            }
            ,
            Array.from(n, function() {
                throw 2
            })
        } catch (t) {}
        e.exports = function(t, e) {
            if (!e && !o)
                return !1;
            var r = !1;
            try {
                var n = [7]
                  , a = n[i]();
                a.next = function() {
                    return {
                        done: r = !0
                    }
                }
                ,
                n[i] = function() {
                    return a
                }
                ,
                t(n)
            } catch (t) {}
            return r
        }
    }
    , {
        152: 152
    }],
    87: [function(t, e, r) {
        e.exports = function(t, e) {
            return {
                value: e,
                done: !!t
            }
        }
    }
    , {}],
    88: [function(t, e, r) {
        e.exports = {}
    }
    , {}],
    89: [function(t, e, r) {
        e.exports = !1
    }
    , {}],
    90: [function(t, e, r) {
        var n = Math.expm1;
        e.exports = !n || 22025.465794806718 < n(10) || n(10) < 22025.465794806718 || -2e-17 != n(-2e-17) ? function(t) {
            return 0 == (t = +t) ? t : -1e-6 < t && t < 1e-6 ? t + t * t / 2 : Math.exp(t) - 1
        }
        : n
    }
    , {}],
    91: [function(t, e, r) {
        var i = t(93)
          , n = Math.pow
          , o = n(2, -52)
          , s = n(2, -23)
          , l = n(2, 127) * (2 - s)
          , c = n(2, -126);
        e.exports = Math.fround || function(t) {
            var e, r, n = Math.abs(t), a = i(t);
            return n < c ? a * (n / c / s + 1 / o - 1 / o) * c * s : l < (r = (e = (1 + s / o) * n) - (e - n)) || r != r ? a * (1 / 0) : a * r
        }
    }
    , {
        93: 93
    }],
    92: [function(t, e, r) {
        e.exports = Math.log1p || function(t) {
            return -1e-8 < (t = +t) && t < 1e-8 ? t - t * t / 2 : Math.log(1 + t)
        }
    }
    , {}],
    93: [function(t, e, r) {
        e.exports = Math.sign || function(t) {
            return 0 == (t = +t) || t != t ? t : t < 0 ? -1 : 1
        }
    }
    , {}],
    94: [function(t, e, r) {
        function n(t) {
            s(t, a, {
                value: {
                    i: "O" + ++l,
                    w: {}
                }
            })
        }
        var a = t(147)("meta")
          , i = t(81)
          , o = t(71)
          , s = t(99).f
          , l = 0
          , c = Object.isExtensible || function() {
            return !0
        }
          , p = !t(64)(function() {
            return c(Object.preventExtensions({}))
        })
          , u = e.exports = {
            KEY: a,
            NEED: !1,
            fastKey: function(t, e) {
                if (!i(t))
                    return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;
                if (!o(t, a)) {
                    if (!c(t))
                        return "F";
                    if (!e)
                        return "E";
                    n(t)
                }
                return t[a].i
            },
            getWeak: function(t, e) {
                if (!o(t, a)) {
                    if (!c(t))
                        return !0;
                    if (!e)
                        return !1;
                    n(t)
                }
                return t[a].w
            },
            onFreeze: function(t) {
                return p && u.NEED && c(t) && !o(t, a) && n(t),
                t
            }
        }
    }
    , {
        147: 147,
        64: 64,
        71: 71,
        81: 81,
        99: 99
    }],
    95: [function(t, e, r) {
        var s = t(70)
          , l = t(136).set
          , c = s.MutationObserver || s.WebKitMutationObserver
          , p = s.process
          , u = s.Promise
          , f = "process" == t(48)(p);
        e.exports = function() {
            function t() {
                var t, e;
                for (f && (t = p.domain) && t.exit(); r; ) {
                    e = r.fn,
                    r = r.next;
                    try {
                        e()
                    } catch (t) {
                        throw r ? a() : n = void 0,
                        t
                    }
                }
                n = void 0,
                t && t.enter()
            }
            var r, n, a;
            if (f)
                a = function() {
                    p.nextTick(t)
                }
                ;
            else if (!c || s.navigator && s.navigator.standalone)
                if (u && u.resolve) {
                    var e = u.resolve(void 0);
                    a = function() {
                        e.then(t)
                    }
                } else
                    a = function() {
                        l.call(s, t)
                    }
                    ;
            else {
                var i = !0
                  , o = document.createTextNode("");
                new c(t).observe(o, {
                    characterData: !0
                }),
                a = function() {
                    o.data = i = !i
                }
            }
            return function(t) {
                var e = {
                    fn: t,
                    next: void 0
                };
                n && (n.next = e),
                r || (r = e,
                a()),
                n = e
            }
        }
    }
    , {
        136: 136,
        48: 48,
        70: 70
    }],
    96: [function(t, e, r) {
        "use strict";
        var a = t(33);
        function n(t) {
            var r, n;
            this.promise = new t(function(t, e) {
                if (void 0 !== r || void 0 !== n)
                    throw TypeError("Bad Promise constructor");
                r = t,
                n = e
            }
            ),
            this.resolve = a(r),
            this.reject = a(n)
        }
        e.exports.f = function(t) {
            return new n(t)
        }
    }
    , {
        33: 33
    }],
    97: [function(t, e, r) {
        "use strict";
        var f = t(58)
          , d = t(107)
          , h = t(104)
          , m = t(108)
          , g = t(142)
          , A = t(77)
          , a = Object.assign;
        e.exports = !a || t(64)(function() {
            var t = {}
              , e = {}
              , r = Symbol()
              , n = "abcdefghijklmnopqrst";
            return t[r] = 7,
            n.split("").forEach(function(t) {
                e[t] = t
            }),
            7 != a({}, t)[r] || Object.keys(a({}, e)).join("") != n
        }) ? function(t, e) {
            for (var r = g(t), n = arguments.length, a = 1, i = h.f, o = m.f; a < n; )
                for (var s, l = A(arguments[a++]), c = i ? d(l).concat(i(l)) : d(l), p = c.length, u = 0; u < p; )
                    s = c[u++],
                    f && !o.call(l, s) || (r[s] = l[s]);
            return r
        }
        : a
    }
    , {
        104: 104,
        107: 107,
        108: 108,
        142: 142,
        58: 58,
        64: 64,
        77: 77
    }],
    98: [function(n, t, e) {
        function a() {}
        var i = n(38)
          , o = n(100)
          , s = n(60)
          , l = n(125)("IE_PROTO")
          , c = "prototype"
          , p = function() {
            var t, e = n(59)("iframe"), r = s.length;
            for (e.style.display = "none",
            n(73).appendChild(e),
            e.src = "javascript:",
            (t = e.contentWindow.document).open(),
            t.write("<script>document.F=Object<\/script>"),
            t.close(),
            p = t.F; r--; )
                delete p[c][s[r]];
            return p()
        };
        t.exports = Object.create || function(t, e) {
            var r;
            return null !== t ? (a[c] = i(t),
            r = new a,
            a[c] = null,
            r[l] = t) : r = p(),
            void 0 === e ? r : o(r, e)
        }
    }
    , {
        100: 100,
        125: 125,
        38: 38,
        59: 59,
        60: 60,
        73: 73
    }],
    99: [function(t, e, r) {
        arguments[4][29][0].apply(r, arguments)
    }
    , {
        143: 143,
        29: 29,
        38: 38,
        58: 58,
        74: 74
    }],
    100: [function(t, e, r) {
        var o = t(99)
          , s = t(38)
          , l = t(107);
        e.exports = t(58) ? Object.defineProperties : function(t, e) {
            s(t);
            for (var r, n = l(e), a = n.length, i = 0; i < a; )
                o.f(t, r = n[i++], e[r]);
            return t
        }
    }
    , {
        107: 107,
        38: 38,
        58: 58,
        99: 99
    }],
    101: [function(t, e, r) {
        var n = t(108)
          , a = t(116)
          , i = t(140)
          , o = t(143)
          , s = t(71)
          , l = t(74)
          , c = Object.getOwnPropertyDescriptor;
        r.f = t(58) ? c : function(t, e) {
            if (t = i(t),
            e = o(e, !0),
            l)
                try {
                    return c(t, e)
                } catch (t) {}
            if (s(t, e))
                return a(!n.f.call(t, e), t[e])
        }
    }
    , {
        108: 108,
        116: 116,
        140: 140,
        143: 143,
        58: 58,
        71: 71,
        74: 74
    }],
    102: [function(t, e, r) {
        var n = t(140)
          , a = t(103).f
          , i = {}.toString
          , o = "object" == typeof window && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
        e.exports.f = function(t) {
            return o && "[object Window]" == i.call(t) ? function(t) {
                try {
                    return a(t)
                } catch (t) {
                    return o.slice()
                }
            }(t) : a(n(t))
        }
    }
    , {
        103: 103,
        140: 140
    }],
    103: [function(t, e, r) {
        var n = t(106)
          , a = t(60).concat("length", "prototype");
        r.f = Object.getOwnPropertyNames || function(t) {
            return n(t, a)
        }
    }
    , {
        106: 106,
        60: 60
    }],
    104: [function(t, e, r) {
        r.f = Object.getOwnPropertySymbols
    }
    , {}],
    105: [function(t, e, r) {
        var n = t(71)
          , a = t(142)
          , i = t(125)("IE_PROTO")
          , o = Object.prototype;
        e.exports = Object.getPrototypeOf || function(t) {
            return t = a(t),
            n(t, i) ? t[i] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? o : null
        }
    }
    , {
        125: 125,
        142: 142,
        71: 71
    }],
    106: [function(t, e, r) {
        var o = t(71)
          , s = t(140)
          , l = t(41)(!1)
          , c = t(125)("IE_PROTO");
        e.exports = function(t, e) {
            var r, n = s(t), a = 0, i = [];
            for (r in n)
                r != c && o(n, r) && i.push(r);
            for (; e.length > a; )
                o(n, r = e[a++]) && (~l(i, r) || i.push(r));
            return i
        }
    }
    , {
        125: 125,
        140: 140,
        41: 41,
        71: 71
    }],
    107: [function(t, e, r) {
        var n = t(106)
          , a = t(60);
        e.exports = Object.keys || function(t) {
            return n(t, a)
        }
    }
    , {
        106: 106,
        60: 60
    }],
    108: [function(t, e, r) {
        r.f = {}.propertyIsEnumerable
    }
    , {}],
    109: [function(t, e, r) {
        var a = t(62)
          , i = t(52)
          , o = t(64);
        e.exports = function(t, e) {
            var r = (i.Object || {})[t] || Object[t]
              , n = {};
            n[t] = e(r),
            a(a.S + a.F * o(function() {
                r(1)
            }), "Object", n)
        }
    }
    , {
        52: 52,
        62: 62,
        64: 64
    }],
    110: [function(t, e, r) {
        var l = t(58)
          , c = t(107)
          , p = t(140)
          , u = t(108).f;
        e.exports = function(s) {
            return function(t) {
                for (var e, r = p(t), n = c(r), a = n.length, i = 0, o = []; i < a; )
                    e = n[i++],
                    l && !u.call(r, e) || o.push(s ? [e, r[e]] : r[e]);
                return o
            }
        }
    }
    , {
        107: 107,
        108: 108,
        140: 140,
        58: 58
    }],
    111: [function(t, e, r) {
        var n = t(103)
          , a = t(104)
          , i = t(38)
          , o = t(70).Reflect;
        e.exports = o && o.ownKeys || function(t) {
            var e = n.f(i(t))
              , r = a.f;
            return r ? e.concat(r(t)) : e
        }
    }
    , {
        103: 103,
        104: 104,
        38: 38,
        70: 70
    }],
    112: [function(t, e, r) {
        var n = t(70).parseFloat
          , a = t(134).trim;
        e.exports = 1 / n(t(135) + "-0") != -1 / 0 ? function(t) {
            var e = a(String(t), 3)
              , r = n(e);
            return 0 === r && "-" == e.charAt(0) ? -0 : r
        }
        : n
    }
    , {
        134: 134,
        135: 135,
        70: 70
    }],
    113: [function(t, e, r) {
        var n = t(70).parseInt
          , a = t(134).trim
          , i = t(135)
          , o = /^[-+]?0[xX]/;
        e.exports = 8 !== n(i + "08") || 22 !== n(i + "0x16") ? function(t, e) {
            var r = a(String(t), 3);
            return n(r, e >>> 0 || (o.test(r) ? 16 : 10))
        }
        : n
    }
    , {
        134: 134,
        135: 135,
        70: 70
    }],
    114: [function(t, e, r) {
        e.exports = function(t) {
            try {
                return {
                    e: !1,
                    v: t()
                }
            } catch (t) {
                return {
                    e: !0,
                    v: t
                }
            }
        }
    }
    , {}],
    115: [function(t, e, r) {
        var n = t(38)
          , a = t(81)
          , i = t(96);
        e.exports = function(t, e) {
            if (n(t),
            a(e) && e.constructor === t)
                return e;
            var r = i.f(t);
            return (0,
            r.resolve)(e),
            r.promise
        }
    }
    , {
        38: 38,
        81: 81,
        96: 96
    }],
    116: [function(t, e, r) {
        arguments[4][30][0].apply(r, arguments)
    }
    , {
        30: 30
    }],
    117: [function(t, e, r) {
        var a = t(118);
        e.exports = function(t, e, r) {
            for (var n in e)
                a(t, n, e[n], r);
            return t
        }
    }
    , {
        118: 118
    }],
    118: [function(t, e, r) {
        var i = t(70)
          , o = t(72)
          , s = t(71)
          , l = t(147)("src")
          , n = t(69)
          , a = "toString"
          , c = ("" + n).split(a);
        t(52).inspectSource = function(t) {
            return n.call(t)
        }
        ,
        (e.exports = function(t, e, r, n) {
            var a = "function" == typeof r;
            a && (s(r, "name") || o(r, "name", e)),
            t[e] !== r && (a && (s(r, l) || o(r, l, t[e] ? "" + t[e] : c.join(String(e)))),
            t === i ? t[e] = r : n ? t[e] ? t[e] = r : o(t, e, r) : (delete t[e],
            o(t, e, r)))
        }
        )(Function.prototype, a, function() {
            return "function" == typeof this && this[l] || n.call(this)
        })
    }
    , {
        147: 147,
        52: 52,
        69: 69,
        70: 70,
        71: 71,
        72: 72
    }],
    119: [function(t, e, r) {
        "use strict";
        var a = t(47)
          , i = RegExp.prototype.exec;
        e.exports = function(t, e) {
            var r = t.exec;
            if ("function" == typeof r) {
                var n = r.call(t, e);
                if ("object" != typeof n)
                    throw new TypeError("RegExp exec method returned something other than an Object or null");
                return n
            }
            if ("RegExp" !== a(t))
                throw new TypeError("RegExp#exec called on incompatible receiver");
            return i.call(t, e)
        }
    }
    , {
        47: 47
    }],
    120: [function(t, e, r) {
        "use strict";
        var n, a, o = t(66), s = RegExp.prototype.exec, l = String.prototype.replace, i = s, c = "lastIndex", p = (n = /a/,
        a = /b*/g,
        s.call(n, "a"),
        s.call(a, "a"),
        0 !== n[c] || 0 !== a[c]), u = void 0 !== /()??/.exec("")[1];
        (p || u) && (i = function(t) {
            var e, r, n, a, i = this;
            return u && (r = new RegExp("^" + i.source + "$(?!\\s)",o.call(i))),
            p && (e = i[c]),
            n = s.call(i, t),
            p && n && (i[c] = i.global ? n.index + n[0].length : e),
            u && n && 1 < n.length && l.call(n[0], r, function() {
                for (a = 1; a < arguments.length - 2; a++)
                    void 0 === arguments[a] && (n[a] = void 0)
            }),
            n
        }
        ),
        e.exports = i
    }
    , {
        66: 66
    }],
    121: [function(t, e, r) {
        e.exports = Object.is || function(t, e) {
            return t === e ? 0 !== t || 1 / t == 1 / e : t != t && e != e
        }
    }
    , {}],
    122: [function(e, t, r) {
        function a(t, e) {
            if (i(t),
            !n(e) && null !== e)
                throw TypeError(e + ": can't set as prototype!")
        }
        var n = e(81)
          , i = e(38);
        t.exports = {
            set: Object.setPrototypeOf || ("__proto__"in {} ? function(t, r, n) {
                try {
                    (n = e(54)(Function.call, e(101).f(Object.prototype, "__proto__").set, 2))(t, []),
                    r = !(t instanceof Array)
                } catch (t) {
                    r = !0
                }
                return function(t, e) {
                    return a(t, e),
                    r ? t.__proto__ = e : n(t, e),
                    t
                }
            }({}, !1) : void 0),
            check: a
        }
    }
    , {
        101: 101,
        38: 38,
        54: 54,
        81: 81
    }],
    123: [function(t, e, r) {
        "use strict";
        var n = t(70)
          , a = t(99)
          , i = t(58)
          , o = t(152)("species");
        e.exports = function(t) {
            var e = n[t];
            i && e && !e[o] && a.f(e, o, {
                configurable: !0,
                get: function() {
                    return this
                }
            })
        }
    }
    , {
        152: 152,
        58: 58,
        70: 70,
        99: 99
    }],
    124: [function(t, e, r) {
        var n = t(99).f
          , a = t(71)
          , i = t(152)("toStringTag");
        e.exports = function(t, e, r) {
            t && !a(t = r ? t : t.prototype, i) && n(t, i, {
                configurable: !0,
                value: e
            })
        }
    }
    , {
        152: 152,
        71: 71,
        99: 99
    }],
    125: [function(t, e, r) {
        var n = t(126)("keys")
          , a = t(147);
        e.exports = function(t) {
            return n[t] || (n[t] = a(t))
        }
    }
    , {
        126: 126,
        147: 147
    }],
    126: [function(t, e, r) {
        var n = t(52)
          , a = t(70)
          , i = "__core-js_shared__"
          , o = a[i] || (a[i] = {});
        (e.exports = function(t, e) {
            return o[t] || (o[t] = void 0 !== e ? e : {})
        }
        )("versions", []).push({
            version: n.version,
            mode: t(89) ? "pure" : "global",
            copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
        })
    }
    , {
        52: 52,
        70: 70,
        89: 89
    }],
    127: [function(t, e, r) {
        var a = t(38)
          , i = t(33)
          , o = t(152)("species");
        e.exports = function(t, e) {
            var r, n = a(t).constructor;
            return void 0 === n || null == (r = a(n)[o]) ? e : i(r)
        }
    }
    , {
        152: 152,
        33: 33,
        38: 38
    }],
    128: [function(t, e, r) {
        "use strict";
        var n = t(64);
        e.exports = function(t, e) {
            return !!t && n(function() {
                e ? t.call(null, function() {}, 1) : t.call(null)
            })
        }
    }
    , {
        64: 64
    }],
    129: [function(t, e, r) {
        var l = t(139)
          , c = t(57);
        e.exports = function(s) {
            return function(t, e) {
                var r, n, a = String(c(t)), i = l(e), o = a.length;
                return i < 0 || o <= i ? s ? "" : void 0 : (r = a.charCodeAt(i)) < 55296 || 56319 < r || i + 1 === o || (n = a.charCodeAt(i + 1)) < 56320 || 57343 < n ? s ? a.charAt(i) : r : s ? a.slice(i, i + 2) : n - 56320 + (r - 55296 << 10) + 65536
            }
        }
    }
    , {
        139: 139,
        57: 57
    }],
    130: [function(t, e, r) {
        var n = t(82)
          , a = t(57);
        e.exports = function(t, e, r) {
            if (n(e))
                throw TypeError("String#" + r + " doesn't accept regex!");
            return String(a(t))
        }
    }
    , {
        57: 57,
        82: 82
    }],
    131: [function(t, e, r) {
        function n(t, e, r, n) {
            var a = String(o(t))
              , i = "<" + e;
            return "" !== r && (i += " " + r + '="' + String(n).replace(s, "&quot;") + '"'),
            i + ">" + a + "</" + e + ">"
        }
        var a = t(62)
          , i = t(64)
          , o = t(57)
          , s = /"/g;
        e.exports = function(e, t) {
            var r = {};
            r[e] = t(n),
            a(a.P + a.F * i(function() {
                var t = ""[e]('"');
                return t !== t.toLowerCase() || 3 < t.split('"').length
            }), "String", r)
        }
    }
    , {
        57: 57,
        62: 62,
        64: 64
    }],
    132: [function(t, e, r) {
        var p = t(141)
          , u = t(133)
          , f = t(57);
        e.exports = function(t, e, r, n) {
            var a = String(f(t))
              , i = a.length
              , o = void 0 === r ? " " : String(r)
              , s = p(e);
            if (s <= i || "" == o)
                return a;
            var l = s - i
              , c = u.call(o, Math.ceil(l / o.length));
            return c.length > l && (c = c.slice(0, l)),
            n ? c + a : a + c
        }
    }
    , {
        133: 133,
        141: 141,
        57: 57
    }],
    133: [function(t, e, r) {
        "use strict";
        var a = t(139)
          , i = t(57);
        e.exports = function(t) {
            var e = String(i(this))
              , r = ""
              , n = a(t);
            if (n < 0 || n == 1 / 0)
                throw RangeError("Count can't be negative");
            for (; 0 < n; (n >>>= 1) && (e += e))
                1 & n && (r += e);
            return r
        }
    }
    , {
        139: 139,
        57: 57
    }],
    134: [function(t, e, r) {
        function n(t, e, r) {
            var n = {}
              , a = s(function() {
                return !!l[t]() || "​" != "​"[t]()
            })
              , i = n[t] = a ? e(u) : l[t];
            r && (n[r] = i),
            o(o.P + o.F * a, "String", n)
        }
        var o = t(62)
          , a = t(57)
          , s = t(64)
          , l = t(135)
          , i = "[" + l + "]"
          , c = RegExp("^" + i + i + "*")
          , p = RegExp(i + i + "*$")
          , u = n.trim = function(t, e) {
            return t = String(a(t)),
            1 & e && (t = t.replace(c, "")),
            2 & e && (t = t.replace(p, "")),
            t
        }
        ;
        e.exports = n
    }
    , {
        135: 135,
        57: 57,
        62: 62,
        64: 64
    }],
    135: [function(t, e, r) {
        e.exports = "\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"
    }
    , {}],
    136: [function(t, e, r) {
        function n() {
            var t = +this;
            if (y.hasOwnProperty(t)) {
                var e = y[t];
                delete y[t],
                e()
            }
        }
        function a(t) {
            n.call(t.data)
        }
        var i, o, s, l = t(54), c = t(76), p = t(73), u = t(59), f = t(70), d = f.process, h = f.setImmediate, m = f.clearImmediate, g = f.MessageChannel, A = f.Dispatch, v = 0, y = {}, b = "onreadystatechange";
        h && m || (h = function(t) {
            for (var e = [], r = 1; r < arguments.length; )
                e.push(arguments[r++]);
            return y[++v] = function() {
                c("function" == typeof t ? t : Function(t), e)
            }
            ,
            i(v),
            v
        }
        ,
        m = function(t) {
            delete y[t]
        }
        ,
        "process" == t(48)(d) ? i = function(t) {
            d.nextTick(l(n, t, 1))
        }
        : A && A.now ? i = function(t) {
            A.now(l(n, t, 1))
        }
        : g ? (s = (o = new g).port2,
        o.port1.onmessage = a,
        i = l(s.postMessage, s, 1)) : f.addEventListener && "function" == typeof postMessage && !f.importScripts ? (i = function(t) {
            f.postMessage(t + "", "*")
        }
        ,
        f.addEventListener("message", a, !1)) : i = b in u("script") ? function(t) {
            p.appendChild(u("script"))[b] = function() {
                p.removeChild(this),
                n.call(t)
            }
        }
        : function(t) {
            setTimeout(l(n, t, 1), 0)
        }
        ),
        e.exports = {
            set: h,
            clear: m
        }
    }
    , {
        48: 48,
        54: 54,
        59: 59,
        70: 70,
        73: 73,
        76: 76
    }],
    137: [function(t, e, r) {
        var n = t(139)
          , a = Math.max
          , i = Math.min;
        e.exports = function(t, e) {
            return (t = n(t)) < 0 ? a(t + e, 0) : i(t, e)
        }
    }
    , {
        139: 139
    }],
    138: [function(t, e, r) {
        var n = t(139)
          , a = t(141);
        e.exports = function(t) {
            if (void 0 === t)
                return 0;
            var e = n(t)
              , r = a(e);
            if (e !== r)
                throw RangeError("Wrong length!");
            return r
        }
    }
    , {
        139: 139,
        141: 141
    }],
    139: [function(t, e, r) {
        var n = Math.ceil
          , a = Math.floor;
        e.exports = function(t) {
            return isNaN(t = +t) ? 0 : (0 < t ? a : n)(t)
        }
    }
    , {}],
    140: [function(t, e, r) {
        var n = t(77)
          , a = t(57);
        e.exports = function(t) {
            return n(a(t))
        }
    }
    , {
        57: 57,
        77: 77
    }],
    141: [function(t, e, r) {
        var n = t(139)
          , a = Math.min;
        e.exports = function(t) {
            return 0 < t ? a(n(t), 9007199254740991) : 0
        }
    }
    , {
        139: 139
    }],
    142: [function(t, e, r) {
        var n = t(57);
        e.exports = function(t) {
            return Object(n(t))
        }
    }
    , {
        57: 57
    }],
    143: [function(t, e, r) {
        arguments[4][31][0].apply(r, arguments)
    }
    , {
        31: 31,
        81: 81
    }],
    144: [function(t, e, r) {
        "use strict";
        if (t(58)) {
            var A = t(89)
              , v = t(70)
              , y = t(64)
              , b = t(62)
              , x = t(146)
              , n = t(145)
              , h = t(54)
              , w = t(37)
              , a = t(116)
              , _ = t(72)
              , i = t(117)
              , o = t(139)
              , C = t(141)
              , S = t(138)
              , s = t(137)
              , l = t(143)
              , c = t(71)
              , P = t(47)
              , E = t(81)
              , m = t(142)
              , g = t(78)
              , T = t(98)
              , L = t(105)
              , k = t(103).f
              , R = t(153)
              , p = t(147)
              , u = t(152)
              , f = t(42)
              , d = t(41)
              , F = t(127)
              , I = t(164)
              , O = t(88)
              , B = t(86)
              , N = t(123)
              , D = t(40)
              , M = t(39)
              , z = t(99)
              , U = t(101)
              , j = z.f
              , W = U.f
              , G = v.RangeError
              , H = v.TypeError
              , V = v.Uint8Array
              , Q = "ArrayBuffer"
              , Y = "Shared" + Q
              , q = "BYTES_PER_ELEMENT"
              , Z = "prototype"
              , X = Array[Z]
              , K = n.ArrayBuffer
              , J = n.DataView
              , $ = f(0)
              , tt = f(2)
              , et = f(3)
              , rt = f(4)
              , nt = f(5)
              , at = f(6)
              , it = d(!0)
              , ot = d(!1)
              , st = I.values
              , lt = I.keys
              , ct = I.entries
              , pt = X.lastIndexOf
              , ut = X.reduce
              , ft = X.reduceRight
              , dt = X.join
              , ht = X.sort
              , mt = X.slice
              , gt = X.toString
              , At = X.toLocaleString
              , vt = u("iterator")
              , yt = u("toStringTag")
              , bt = p("typed_constructor")
              , xt = p("def_constructor")
              , wt = x.CONSTR
              , _t = x.TYPED
              , Ct = x.VIEW
              , St = "Wrong length!"
              , Pt = f(1, function(t, e) {
                return Rt(F(t, t[xt]), e)
            })
              , Et = y(function() {
                return 1 === new V(new Uint16Array([1]).buffer)[0]
            })
              , Tt = !!V && !!V[Z].set && y(function() {
                new V(1).set({})
            })
              , Lt = function(t, e) {
                var r = o(t);
                if (r < 0 || r % e)
                    throw G("Wrong offset!");
                return r
            }
              , kt = function(t) {
                if (E(t) && _t in t)
                    return t;
                throw H(t + " is not a typed array!")
            }
              , Rt = function(t, e) {
                if (!(E(t) && bt in t))
                    throw H("It is not a typed array constructor!");
                return new t(e)
            }
              , Ft = function(t, e) {
                return It(F(t, t[xt]), e)
            }
              , It = function(t, e) {
                for (var r = 0, n = e.length, a = Rt(t, n); r < n; )
                    a[r] = e[r++];
                return a
            }
              , Ot = function(t, e, r) {
                j(t, e, {
                    get: function() {
                        return this._d[r]
                    }
                })
            }
              , Bt = function(t, e, r) {
                var n, a, i, o, s, l, c = m(t), p = arguments.length, u = 1 < p ? e : void 0, f = void 0 !== u, d = R(c);
                if (null != d && !g(d)) {
                    for (l = d.call(c),
                    i = [],
                    n = 0; !(s = l.next()).done; n++)
                        i.push(s.value);
                    c = i
                }
                for (f && 2 < p && (u = h(u, r, 2)),
                n = 0,
                a = C(c.length),
                o = Rt(this, a); n < a; n++)
                    o[n] = f ? u(c[n], n) : c[n];
                return o
            }
              , Nt = function() {
                for (var t = 0, e = arguments.length, r = Rt(this, e); t < e; )
                    r[t] = arguments[t++];
                return r
            }
              , Dt = !!V && y(function() {
                At.call(new V(1))
            })
              , Mt = function() {
                return At.apply(Dt ? mt.call(kt(this)) : kt(this), arguments)
            }
              , zt = {
                copyWithin: function(t, e, r) {
                    return M.call(kt(this), t, e, 2 < arguments.length ? r : void 0)
                },
                every: function(t, e) {
                    return rt(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                fill: function(t) {
                    return D.apply(kt(this), arguments)
                },
                filter: function(t, e) {
                    return Ft(this, tt(kt(this), t, 1 < arguments.length ? e : void 0))
                },
                find: function(t, e) {
                    return nt(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                findIndex: function(t, e) {
                    return at(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                forEach: function(t, e) {
                    $(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                indexOf: function(t, e) {
                    return ot(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                includes: function(t, e) {
                    return it(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                join: function(t) {
                    return dt.apply(kt(this), arguments)
                },
                lastIndexOf: function(t) {
                    return pt.apply(kt(this), arguments)
                },
                map: function(t, e) {
                    return Pt(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                reduce: function(t) {
                    return ut.apply(kt(this), arguments)
                },
                reduceRight: function(t) {
                    return ft.apply(kt(this), arguments)
                },
                reverse: function() {
                    for (var t, e = this, r = kt(e).length, n = Math.floor(r / 2), a = 0; a < n; )
                        t = e[a],
                        e[a++] = e[--r],
                        e[r] = t;
                    return e
                },
                some: function(t, e) {
                    return et(kt(this), t, 1 < arguments.length ? e : void 0)
                },
                sort: function(t) {
                    return ht.call(kt(this), t)
                },
                subarray: function(t, e) {
                    var r = kt(this)
                      , n = r.length
                      , a = s(t, n);
                    return new (F(r, r[xt]))(r.buffer,r.byteOffset + a * r.BYTES_PER_ELEMENT,C((void 0 === e ? n : s(e, n)) - a))
                }
            }
              , Ut = function(t, e) {
                return Ft(this, mt.call(kt(this), t, e))
            }
              , jt = function(t, e) {
                kt(this);
                var r = Lt(e, 1)
                  , n = this.length
                  , a = m(t)
                  , i = C(a.length)
                  , o = 0;
                if (n < i + r)
                    throw G(St);
                for (; o < i; )
                    this[r + o] = a[o++]
            }
              , Wt = {
                entries: function() {
                    return ct.call(kt(this))
                },
                keys: function() {
                    return lt.call(kt(this))
                },
                values: function() {
                    return st.call(kt(this))
                }
            }
              , Gt = function(t, e) {
                return E(t) && t[_t] && "symbol" != typeof e && e in t && String(+e) == String(e)
            }
              , Ht = function(t, e) {
                return Gt(t, e = l(e, !0)) ? a(2, t[e]) : W(t, e)
            }
              , Vt = function(t, e, r) {
                return !(Gt(t, e = l(e, !0)) && E(r) && c(r, "value")) || c(r, "get") || c(r, "set") || r.configurable || c(r, "writable") && !r.writable || c(r, "enumerable") && !r.enumerable ? j(t, e, r) : (t[e] = r.value,
                t)
            };
            wt || (U.f = Ht,
            z.f = Vt),
            b(b.S + b.F * !wt, "Object", {
                getOwnPropertyDescriptor: Ht,
                defineProperty: Vt
            }),
            y(function() {
                gt.call({})
            }) && (gt = At = function() {
                return dt.call(this)
            }
            );
            var Qt = i({}, zt);
            i(Qt, Wt),
            _(Qt, vt, Wt.values),
            i(Qt, {
                slice: Ut,
                set: jt,
                constructor: function() {},
                toString: gt,
                toLocaleString: Mt
            }),
            Ot(Qt, "buffer", "b"),
            Ot(Qt, "byteOffset", "o"),
            Ot(Qt, "byteLength", "l"),
            Ot(Qt, "length", "e"),
            j(Qt, yt, {
                get: function() {
                    return this[_t]
                }
            }),
            e.exports = function(t, u, e, i) {
                function f(t, a) {
                    j(t, a, {
                        get: function() {
                            return t = a,
                            (e = this._d).v[r](t * u + e.o, Et);
                            var t, e
                        },
                        set: function(t) {
                            return e = a,
                            r = t,
                            n = this._d,
                            i && (r = (r = Math.round(r)) < 0 ? 0 : 255 < r ? 255 : 255 & r),
                            void n.v[o](e * u + n.o, r, Et);
                            var e, r, n
                        },
                        enumerable: !0
                    })
                }
                var d = t + ((i = !!i) ? "Clamped" : "") + "Array"
                  , r = "get" + t
                  , o = "set" + t
                  , h = v[d]
                  , s = h || {}
                  , n = h && L(h)
                  , a = !h || !x.ABV
                  , l = {}
                  , c = h && h[Z];
                a ? (h = e(function(t, e, r, n) {
                    w(t, h, d, "_d");
                    var a, i, o, s, l = 0, c = 0;
                    if (E(e)) {
                        if (!(e instanceof K || (s = P(e)) == Q || s == Y))
                            return _t in e ? It(h, e) : Bt.call(h, e);
                        a = e,
                        c = Lt(r, u);
                        var p = e.byteLength;
                        if (void 0 === n) {
                            if (p % u)
                                throw G(St);
                            if ((i = p - c) < 0)
                                throw G(St)
                        } else if (p < (i = C(n) * u) + c)
                            throw G(St);
                        o = i / u
                    } else
                        o = S(e),
                        a = new K(i = o * u);
                    for (_(t, "_d", {
                        b: a,
                        o: c,
                        l: i,
                        e: o,
                        v: new J(a)
                    }); l < o; )
                        f(t, l++)
                }),
                c = h[Z] = T(Qt),
                _(c, "constructor", h)) : y(function() {
                    h(1)
                }) && y(function() {
                    new h(-1)
                }) && B(function(t) {
                    new h,
                    new h(null),
                    new h(1.5),
                    new h(t)
                }, !0) || (h = e(function(t, e, r, n) {
                    var a;
                    return w(t, h, d),
                    E(e) ? e instanceof K || (a = P(e)) == Q || a == Y ? void 0 !== n ? new s(e,Lt(r, u),n) : void 0 !== r ? new s(e,Lt(r, u)) : new s(e) : _t in e ? It(h, e) : Bt.call(h, e) : new s(S(e))
                }),
                $(n !== Function.prototype ? k(s).concat(k(n)) : k(s), function(t) {
                    t in h || _(h, t, s[t])
                }),
                h[Z] = c,
                A || (c.constructor = h));
                var p = c[vt]
                  , m = !!p && ("values" == p.name || null == p.name)
                  , g = Wt.values;
                _(h, bt, !0),
                _(c, _t, d),
                _(c, Ct, !0),
                _(c, xt, h),
                (i ? new h(1)[yt] == d : yt in c) || j(c, yt, {
                    get: function() {
                        return d
                    }
                }),
                l[d] = h,
                b(b.G + b.W + b.F * (h != s), l),
                b(b.S, d, {
                    BYTES_PER_ELEMENT: u
                }),
                b(b.S + b.F * y(function() {
                    s.of.call(h, 1)
                }), d, {
                    from: Bt,
                    of: Nt
                }),
                q in c || _(c, q, u),
                b(b.P, d, zt),
                N(d),
                b(b.P + b.F * Tt, d, {
                    set: jt
                }),
                b(b.P + b.F * !m, d, Wt),
                A || c.toString == gt || (c.toString = gt),
                b(b.P + b.F * y(function() {
                    new h(1).slice()
                }), d, {
                    slice: Ut
                }),
                b(b.P + b.F * (y(function() {
                    return [1, 2].toLocaleString() != new h([1, 2]).toLocaleString()
                }) || !y(function() {
                    c.toLocaleString.call([1, 2])
                })), d, {
                    toLocaleString: Mt
                }),
                O[d] = m ? p : g,
                A || m || _(c, vt, g)
            }
        } else
            e.exports = function() {}
    }
    , {
        101: 101,
        103: 103,
        105: 105,
        116: 116,
        117: 117,
        123: 123,
        127: 127,
        137: 137,
        138: 138,
        139: 139,
        141: 141,
        142: 142,
        143: 143,
        145: 145,
        146: 146,
        147: 147,
        152: 152,
        153: 153,
        164: 164,
        37: 37,
        39: 39,
        40: 40,
        41: 41,
        42: 42,
        47: 47,
        54: 54,
        58: 58,
        62: 62,
        64: 64,
        70: 70,
        71: 71,
        72: 72,
        78: 78,
        81: 81,
        86: 86,
        88: 88,
        89: 89,
        98: 98,
        99: 99
    }],
    145: [function(t, e, r) {
        "use strict";
        var n = t(70)
          , a = t(58)
          , i = t(89)
          , o = t(146)
          , s = t(72)
          , l = t(117)
          , c = t(64)
          , p = t(37)
          , u = t(139)
          , f = t(141)
          , d = t(138)
          , h = t(103).f
          , m = t(99).f
          , g = t(40)
          , A = t(124)
          , v = "ArrayBuffer"
          , y = "DataView"
          , b = "prototype"
          , x = "Wrong index!"
          , w = n[v]
          , _ = n[y]
          , C = n.Math
          , S = n.RangeError
          , P = n.Infinity
          , E = w
          , T = C.abs
          , L = C.pow
          , k = C.floor
          , R = C.log
          , F = C.LN2
          , I = "byteLength"
          , O = "byteOffset"
          , B = a ? "_b" : "buffer"
          , N = a ? "_l" : I
          , D = a ? "_o" : O;
        function M(t, e, r) {
            var n, a, i, o = new Array(r), s = 8 * r - e - 1, l = (1 << s) - 1, c = l >> 1, p = 23 === e ? L(2, -24) - L(2, -77) : 0, u = 0, f = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for ((t = T(t)) != t || t === P ? (a = t != t ? 1 : 0,
            n = l) : (n = k(R(t) / F),
            t * (i = L(2, -n)) < 1 && (n--,
            i *= 2),
            2 <= (t += 1 <= n + c ? p / i : p * L(2, 1 - c)) * i && (n++,
            i /= 2),
            l <= n + c ? (a = 0,
            n = l) : 1 <= n + c ? (a = (t * i - 1) * L(2, e),
            n += c) : (a = t * L(2, c - 1) * L(2, e),
            n = 0)); 8 <= e; o[u++] = 255 & a,
            a /= 256,
            e -= 8)
                ;
            for (n = n << e | a,
            s += e; 0 < s; o[u++] = 255 & n,
            n /= 256,
            s -= 8)
                ;
            return o[--u] |= 128 * f,
            o
        }
        function z(t, e, r) {
            var n, a = 8 * r - e - 1, i = (1 << a) - 1, o = i >> 1, s = a - 7, l = r - 1, c = t[l--], p = 127 & c;
            for (c >>= 7; 0 < s; p = 256 * p + t[l],
            l--,
            s -= 8)
                ;
            for (n = p & (1 << -s) - 1,
            p >>= -s,
            s += e; 0 < s; n = 256 * n + t[l],
            l--,
            s -= 8)
                ;
            if (0 === p)
                p = 1 - o;
            else {
                if (p === i)
                    return n ? NaN : c ? -P : P;
                n += L(2, e),
                p -= o
            }
            return (c ? -1 : 1) * n * L(2, p - e)
        }
        function U(t) {
            return t[3] << 24 | t[2] << 16 | t[1] << 8 | t[0]
        }
        function j(t) {
            return [255 & t]
        }
        function W(t) {
            return [255 & t, t >> 8 & 255]
        }
        function G(t) {
            return [255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255]
        }
        function H(t) {
            return M(t, 52, 8)
        }
        function V(t) {
            return M(t, 23, 4)
        }
        function Q(t, e, r) {
            m(t[b], e, {
                get: function() {
                    return this[r]
                }
            })
        }
        function Y(t, e, r, n) {
            var a = d(+r);
            if (a + e > t[N])
                throw S(x);
            var i = t[B]._b
              , o = a + t[D]
              , s = i.slice(o, o + e);
            return n ? s : s.reverse()
        }
        function q(t, e, r, n, a, i) {
            var o = d(+r);
            if (o + e > t[N])
                throw S(x);
            for (var s = t[B]._b, l = o + t[D], c = n(+a), p = 0; p < e; p++)
                s[l + p] = c[i ? p : e - p - 1]
        }
        if (o.ABV) {
            if (!c(function() {
                w(1)
            }) || !c(function() {
                new w(-1)
            }) || c(function() {
                return new w,
                new w(1.5),
                new w(NaN),
                w.name != v
            })) {
                for (var Z, X = (w = function(t) {
                    return p(this, w),
                    new E(d(t))
                }
                )[b] = E[b], K = h(E), J = 0; K.length > J; )
                    (Z = K[J++])in w || s(w, Z, E[Z]);
                i || (X.constructor = w)
            }
            var $ = new _(new w(2))
              , tt = _[b].setInt8;
            $.setInt8(0, 2147483648),
            $.setInt8(1, 2147483649),
            !$.getInt8(0) && $.getInt8(1) || l(_[b], {
                setInt8: function(t, e) {
                    tt.call(this, t, e << 24 >> 24)
                },
                setUint8: function(t, e) {
                    tt.call(this, t, e << 24 >> 24)
                }
            }, !0)
        } else
            w = function(t) {
                p(this, w, v);
                var e = d(t);
                this._b = g.call(new Array(e), 0),
                this[N] = e
            }
            ,
            _ = function(t, e, r) {
                p(this, _, y),
                p(t, w, y);
                var n = t[N]
                  , a = u(e);
                if (a < 0 || n < a)
                    throw S("Wrong offset!");
                if (n < a + (r = void 0 === r ? n - a : f(r)))
                    throw S("Wrong length!");
                this[B] = t,
                this[D] = a,
                this[N] = r
            }
            ,
            a && (Q(w, I, "_l"),
            Q(_, "buffer", "_b"),
            Q(_, I, "_l"),
            Q(_, O, "_o")),
            l(_[b], {
                getInt8: function(t) {
                    return Y(this, 1, t)[0] << 24 >> 24
                },
                getUint8: function(t) {
                    return Y(this, 1, t)[0]
                },
                getInt16: function(t, e) {
                    var r = Y(this, 2, t, e);
                    return (r[1] << 8 | r[0]) << 16 >> 16
                },
                getUint16: function(t, e) {
                    var r = Y(this, 2, t, e);
                    return r[1] << 8 | r[0]
                },
                getInt32: function(t, e) {
                    return U(Y(this, 4, t, e))
                },
                getUint32: function(t, e) {
                    return U(Y(this, 4, t, e)) >>> 0
                },
                getFloat32: function(t, e) {
                    return z(Y(this, 4, t, e), 23, 4)
                },
                getFloat64: function(t, e) {
                    return z(Y(this, 8, t, e), 52, 8)
                },
                setInt8: function(t, e) {
                    q(this, 1, t, j, e)
                },
                setUint8: function(t, e) {
                    q(this, 1, t, j, e)
                },
                setInt16: function(t, e, r) {
                    q(this, 2, t, W, e, r)
                },
                setUint16: function(t, e, r) {
                    q(this, 2, t, W, e, r)
                },
                setInt32: function(t, e, r) {
                    q(this, 4, t, G, e, r)
                },
                setUint32: function(t, e, r) {
                    q(this, 4, t, G, e, r)
                },
                setFloat32: function(t, e, r) {
                    q(this, 4, t, V, e, r)
                },
                setFloat64: function(t, e, r) {
                    q(this, 8, t, H, e, r)
                }
            });
        A(w, v),
        A(_, y),
        s(_[b], o.VIEW, !0),
        r[v] = w,
        r[y] = _
    }
    , {
        103: 103,
        117: 117,
        124: 124,
        138: 138,
        139: 139,
        141: 141,
        146: 146,
        37: 37,
        40: 40,
        58: 58,
        64: 64,
        70: 70,
        72: 72,
        89: 89,
        99: 99
    }],
    146: [function(t, e, r) {
        for (var n, a = t(70), i = t(72), o = t(147), s = o("typed_array"), l = o("view"), c = !(!a.ArrayBuffer || !a.DataView), p = c, u = 0, f = "Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(","); u < 9; )
            (n = a[f[u++]]) ? (i(n.prototype, s, !0),
            i(n.prototype, l, !0)) : p = !1;
        e.exports = {
            ABV: c,
            CONSTR: p,
            TYPED: s,
            VIEW: l
        }
    }
    , {
        147: 147,
        70: 70,
        72: 72
    }],
    147: [function(t, e, r) {
        var n = 0
          , a = Math.random();
        e.exports = function(t) {
            return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++n + a).toString(36))
        }
    }
    , {}],
    148: [function(t, e, r) {
        var n = t(70).navigator;
        e.exports = n && n.userAgent || ""
    }
    , {
        70: 70
    }],
    149: [function(t, e, r) {
        var n = t(81);
        e.exports = function(t, e) {
            if (!n(t) || t._t !== e)
                throw TypeError("Incompatible receiver, " + e + " required!");
            return t
        }
    }
    , {
        81: 81
    }],
    150: [function(t, e, r) {
        var n = t(70)
          , a = t(52)
          , i = t(89)
          , o = t(151)
          , s = t(99).f;
        e.exports = function(t) {
            var e = a.Symbol || (a.Symbol = i ? {} : n.Symbol || {});
            "_" == t.charAt(0) || t in e || s(e, t, {
                value: o.f(t)
            })
        }
    }
    , {
        151: 151,
        52: 52,
        70: 70,
        89: 89,
        99: 99
    }],
    151: [function(t, e, r) {
        r.f = t(152)
    }
    , {
        152: 152
    }],
    152: [function(t, e, r) {
        var n = t(126)("wks")
          , a = t(147)
          , i = t(70).Symbol
          , o = "function" == typeof i;
        (e.exports = function(t) {
            return n[t] || (n[t] = o && i[t] || (o ? i : a)("Symbol." + t))
        }
        ).store = n
    }
    , {
        126: 126,
        147: 147,
        70: 70
    }],
    153: [function(t, e, r) {
        var n = t(47)
          , a = t(152)("iterator")
          , i = t(88);
        e.exports = t(52).getIteratorMethod = function(t) {
            if (null != t)
                return t[a] || t["@@iterator"] || i[n(t)]
        }
    }
    , {
        152: 152,
        47: 47,
        52: 52,
        88: 88
    }],
    154: [function(t, e, r) {
        var n = t(62);
        n(n.P, "Array", {
            copyWithin: t(39)
        }),
        t(35)("copyWithin")
    }
    , {
        35: 35,
        39: 39,
        62: 62
    }],
    155: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(4);
        n(n.P + n.F * !t(128)([].every, !0), "Array", {
            every: function(t, e) {
                return a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        42: 42,
        62: 62
    }],
    156: [function(t, e, r) {
        var n = t(62);
        n(n.P, "Array", {
            fill: t(40)
        }),
        t(35)("fill")
    }
    , {
        35: 35,
        40: 40,
        62: 62
    }],
    157: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(2);
        n(n.P + n.F * !t(128)([].filter, !0), "Array", {
            filter: function(t, e) {
                return a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        42: 42,
        62: 62
    }],
    158: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(6)
          , i = "findIndex"
          , o = !0;
        i in [] && Array(1)[i](function() {
            o = !1
        }),
        n(n.P + n.F * o, "Array", {
            findIndex: function(t, e) {
                return a(this, t, 1 < arguments.length ? e : void 0)
            }
        }),
        t(35)(i)
    }
    , {
        35: 35,
        42: 42,
        62: 62
    }],
    159: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(5)
          , i = "find"
          , o = !0;
        i in [] && Array(1)[i](function() {
            o = !1
        }),
        n(n.P + n.F * o, "Array", {
            find: function(t, e) {
                return a(this, t, 1 < arguments.length ? e : void 0)
            }
        }),
        t(35)(i)
    }
    , {
        35: 35,
        42: 42,
        62: 62
    }],
    160: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(0)
          , i = t(128)([].forEach, !0);
        n(n.P + n.F * !i, "Array", {
            forEach: function(t, e) {
                return a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        42: 42,
        62: 62
    }],
    161: [function(t, e, r) {
        "use strict";
        var h = t(54)
          , n = t(62)
          , m = t(142)
          , g = t(83)
          , A = t(78)
          , v = t(141)
          , y = t(53)
          , b = t(153);
        n(n.S + n.F * !t(86)(function(t) {
            Array.from(t)
        }), "Array", {
            from: function(t, e, r) {
                var n, a, i, o, s = m(t), l = "function" == typeof this ? this : Array, c = arguments.length, p = 1 < c ? e : void 0, u = void 0 !== p, f = 0, d = b(s);
                if (u && (p = h(p, 2 < c ? r : void 0, 2)),
                null == d || l == Array && A(d))
                    for (a = new l(n = v(s.length)); f < n; f++)
                        y(a, f, u ? p(s[f], f) : s[f]);
                else
                    for (o = d.call(s),
                    a = new l; !(i = o.next()).done; f++)
                        y(a, f, u ? g(o, p, [i.value, f], !0) : i.value);
                return a.length = f,
                a
            }
        })
    }
    , {
        141: 141,
        142: 142,
        153: 153,
        53: 53,
        54: 54,
        62: 62,
        78: 78,
        83: 83,
        86: 86
    }],
    162: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(41)(!1)
          , i = [].indexOf
          , o = !!i && 1 / [1].indexOf(1, -0) < 0;
        n(n.P + n.F * (o || !t(128)(i)), "Array", {
            indexOf: function(t, e) {
                return o ? i.apply(this, arguments) || 0 : a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        41: 41,
        62: 62
    }],
    163: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Array", {
            isArray: t(79)
        })
    }
    , {
        62: 62,
        79: 79
    }],
    164: [function(t, e, r) {
        "use strict";
        var n = t(35)
          , a = t(87)
          , i = t(88)
          , o = t(140);
        e.exports = t(85)(Array, "Array", function(t, e) {
            this._t = o(t),
            this._i = 0,
            this._k = e
        }, function() {
            var t = this._t
              , e = this._k
              , r = this._i++;
            return !t || r >= t.length ? (this._t = void 0,
            a(1)) : a(0, "keys" == e ? r : "values" == e ? t[r] : [r, t[r]])
        }, "values"),
        i.Arguments = i.Array,
        n("keys"),
        n("values"),
        n("entries")
    }
    , {
        140: 140,
        35: 35,
        85: 85,
        87: 87,
        88: 88
    }],
    165: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(140)
          , i = [].join;
        n(n.P + n.F * (t(77) != Object || !t(128)(i)), "Array", {
            join: function(t) {
                return i.call(a(this), void 0 === t ? "," : t)
            }
        })
    }
    , {
        128: 128,
        140: 140,
        62: 62,
        77: 77
    }],
    166: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , i = t(140)
          , o = t(139)
          , s = t(141)
          , l = [].lastIndexOf
          , c = !!l && 1 / [1].lastIndexOf(1, -0) < 0;
        n(n.P + n.F * (c || !t(128)(l)), "Array", {
            lastIndexOf: function(t, e) {
                if (c)
                    return l.apply(this, arguments) || 0;
                var r = i(this)
                  , n = s(r.length)
                  , a = n - 1;
                for (1 < arguments.length && (a = Math.min(a, o(e))),
                a < 0 && (a = n + a); 0 <= a; a--)
                    if (a in r && r[a] === t)
                        return a || 0;
                return -1
            }
        })
    }
    , {
        128: 128,
        139: 139,
        140: 140,
        141: 141,
        62: 62
    }],
    167: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(1);
        n(n.P + n.F * !t(128)([].map, !0), "Array", {
            map: function(t, e) {
                return a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        42: 42,
        62: 62
    }],
    168: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(53);
        n(n.S + n.F * t(64)(function() {
            function t() {}
            return !(Array.of.call(t)instanceof t)
        }), "Array", {
            of: function() {
                for (var t = 0, e = arguments.length, r = new ("function" == typeof this ? this : Array)(e); t < e; )
                    a(r, t, arguments[t++]);
                return r.length = e,
                r
            }
        })
    }
    , {
        53: 53,
        62: 62,
        64: 64
    }],
    169: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(43);
        n(n.P + n.F * !t(128)([].reduceRight, !0), "Array", {
            reduceRight: function(t, e) {
                return a(this, t, arguments.length, e, !0)
            }
        })
    }
    , {
        128: 128,
        43: 43,
        62: 62
    }],
    170: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(43);
        n(n.P + n.F * !t(128)([].reduce, !0), "Array", {
            reduce: function(t, e) {
                return a(this, t, arguments.length, e, !1)
            }
        })
    }
    , {
        128: 128,
        43: 43,
        62: 62
    }],
    171: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(73)
          , c = t(48)
          , p = t(137)
          , u = t(141)
          , f = [].slice;
        n(n.P + n.F * t(64)(function() {
            a && f.call(a)
        }), "Array", {
            slice: function(t, e) {
                var r = u(this.length)
                  , n = c(this);
                if (e = void 0 === e ? r : e,
                "Array" == n)
                    return f.call(this, t, e);
                for (var a = p(t, r), i = p(e, r), o = u(i - a), s = new Array(o), l = 0; l < o; l++)
                    s[l] = "String" == n ? this.charAt(a + l) : this[a + l];
                return s
            }
        })
    }
    , {
        137: 137,
        141: 141,
        48: 48,
        62: 62,
        64: 64,
        73: 73
    }],
    172: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(42)(3);
        n(n.P + n.F * !t(128)([].some, !0), "Array", {
            some: function(t, e) {
                return a(this, t, e)
            }
        })
    }
    , {
        128: 128,
        42: 42,
        62: 62
    }],
    173: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(33)
          , i = t(142)
          , o = t(64)
          , s = [].sort
          , l = [1, 2, 3];
        n(n.P + n.F * (o(function() {
            l.sort(void 0)
        }) || !o(function() {
            l.sort(null)
        }) || !t(128)(s)), "Array", {
            sort: function(t) {
                return void 0 === t ? s.call(i(this)) : s.call(i(this), a(t))
            }
        })
    }
    , {
        128: 128,
        142: 142,
        33: 33,
        62: 62,
        64: 64
    }],
    174: [function(t, e, r) {
        t(123)("Array")
    }
    , {
        123: 123
    }],
    175: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Date", {
            now: function() {
                return (new Date).getTime()
            }
        })
    }
    , {
        62: 62
    }],
    176: [function(t, e, r) {
        var n = t(62)
          , a = t(55);
        n(n.P + n.F * (Date.prototype.toISOString !== a), "Date", {
            toISOString: a
        })
    }
    , {
        55: 55,
        62: 62
    }],
    177: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(142)
          , i = t(143);
        n(n.P + n.F * t(64)(function() {
            return null !== new Date(NaN).toJSON() || 1 !== Date.prototype.toJSON.call({
                toISOString: function() {
                    return 1
                }
            })
        }), "Date", {
            toJSON: function(t) {
                var e = a(this)
                  , r = i(e);
                return "number" != typeof r || isFinite(r) ? e.toISOString() : null
            }
        })
    }
    , {
        142: 142,
        143: 143,
        62: 62,
        64: 64
    }],
    178: [function(t, e, r) {
        var n = t(152)("toPrimitive")
          , a = Date.prototype;
        n in a || t(72)(a, n, t(56))
    }
    , {
        152: 152,
        56: 56,
        72: 72
    }],
    179: [function(t, e, r) {
        var n = Date.prototype
          , a = "Invalid Date"
          , i = n.toString
          , o = n.getTime;
        new Date(NaN) + "" != a && t(118)(n, "toString", function() {
            var t = o.call(this);
            return t == t ? i.call(this) : a
        })
    }
    , {
        118: 118
    }],
    180: [function(t, e, r) {
        var n = t(62);
        n(n.P, "Function", {
            bind: t(46)
        })
    }
    , {
        46: 46,
        62: 62
    }],
    181: [function(t, e, r) {
        "use strict";
        var n = t(81)
          , a = t(105)
          , i = t(152)("hasInstance")
          , o = Function.prototype;
        i in o || t(99).f(o, i, {
            value: function(t) {
                if ("function" != typeof this || !n(t))
                    return !1;
                if (!n(this.prototype))
                    return t instanceof this;
                for (; t = a(t); )
                    if (this.prototype === t)
                        return !0;
                return !1
            }
        })
    }
    , {
        105: 105,
        152: 152,
        81: 81,
        99: 99
    }],
    182: [function(t, e, r) {
        var n = t(99).f
          , a = Function.prototype
          , i = /^\s*function ([^ (]*)/;
        "name"in a || t(58) && n(a, "name", {
            configurable: !0,
            get: function() {
                try {
                    return ("" + this).match(i)[1]
                } catch (t) {
                    return ""
                }
            }
        })
    }
    , {
        58: 58,
        99: 99
    }],
    183: [function(t, e, r) {
        "use strict";
        var n = t(49)
          , a = t(149);
        e.exports = t(51)("Map", function(e) {
            return function(t) {
                return e(this, 0 < arguments.length ? t : void 0)
            }
        }, {
            get: function(t) {
                var e = n.getEntry(a(this, "Map"), t);
                return e && e.v
            },
            set: function(t, e) {
                return n.def(a(this, "Map"), 0 === t ? 0 : t, e)
            }
        }, n, !0)
    }
    , {
        149: 149,
        49: 49,
        51: 51
    }],
    184: [function(t, e, r) {
        var n = t(62)
          , a = t(92)
          , i = Math.sqrt
          , o = Math.acosh;
        n(n.S + n.F * !(o && 710 == Math.floor(o(Number.MAX_VALUE)) && o(1 / 0) == 1 / 0), "Math", {
            acosh: function(t) {
                return (t = +t) < 1 ? NaN : 94906265.62425156 < t ? Math.log(t) + Math.LN2 : a(t - 1 + i(t - 1) * i(t + 1))
            }
        })
    }
    , {
        62: 62,
        92: 92
    }],
    185: [function(t, e, r) {
        var n = t(62)
          , a = Math.asinh;
        n(n.S + n.F * !(a && 0 < 1 / a(0)), "Math", {
            asinh: function t(e) {
                return isFinite(e = +e) && 0 != e ? e < 0 ? -t(-e) : Math.log(e + Math.sqrt(e * e + 1)) : e
            }
        })
    }
    , {
        62: 62
    }],
    186: [function(t, e, r) {
        var n = t(62)
          , a = Math.atanh;
        n(n.S + n.F * !(a && 1 / a(-0) < 0), "Math", {
            atanh: function(t) {
                return 0 == (t = +t) ? t : Math.log((1 + t) / (1 - t)) / 2
            }
        })
    }
    , {
        62: 62
    }],
    187: [function(t, e, r) {
        var n = t(62)
          , a = t(93);
        n(n.S, "Math", {
            cbrt: function(t) {
                return a(t = +t) * Math.pow(Math.abs(t), 1 / 3)
            }
        })
    }
    , {
        62: 62,
        93: 93
    }],
    188: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            clz32: function(t) {
                return (t >>>= 0) ? 31 - Math.floor(Math.log(t + .5) * Math.LOG2E) : 32
            }
        })
    }
    , {
        62: 62
    }],
    189: [function(t, e, r) {
        var n = t(62)
          , a = Math.exp;
        n(n.S, "Math", {
            cosh: function(t) {
                return (a(t = +t) + a(-t)) / 2
            }
        })
    }
    , {
        62: 62
    }],
    190: [function(t, e, r) {
        var n = t(62)
          , a = t(90);
        n(n.S + n.F * (a != Math.expm1), "Math", {
            expm1: a
        })
    }
    , {
        62: 62,
        90: 90
    }],
    191: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            fround: t(91)
        })
    }
    , {
        62: 62,
        91: 91
    }],
    192: [function(t, e, r) {
        var n = t(62)
          , l = Math.abs;
        n(n.S, "Math", {
            hypot: function(t, e) {
                for (var r, n, a = 0, i = 0, o = arguments.length, s = 0; i < o; )
                    s < (r = l(arguments[i++])) ? (a = a * (n = s / r) * n + 1,
                    s = r) : a += 0 < r ? (n = r / s) * n : r;
                return s === 1 / 0 ? 1 / 0 : s * Math.sqrt(a)
            }
        })
    }
    , {
        62: 62
    }],
    193: [function(t, e, r) {
        var n = t(62)
          , a = Math.imul;
        n(n.S + n.F * t(64)(function() {
            return -5 != a(4294967295, 5) || 2 != a.length
        }), "Math", {
            imul: function(t, e) {
                var r = +t
                  , n = +e
                  , a = 65535 & r
                  , i = 65535 & n;
                return 0 | a * i + ((65535 & r >>> 16) * i + a * (65535 & n >>> 16) << 16 >>> 0)
            }
        })
    }
    , {
        62: 62,
        64: 64
    }],
    194: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            log10: function(t) {
                return Math.log(t) * Math.LOG10E
            }
        })
    }
    , {
        62: 62
    }],
    195: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            log1p: t(92)
        })
    }
    , {
        62: 62,
        92: 92
    }],
    196: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            log2: function(t) {
                return Math.log(t) / Math.LN2
            }
        })
    }
    , {
        62: 62
    }],
    197: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            sign: t(93)
        })
    }
    , {
        62: 62,
        93: 93
    }],
    198: [function(t, e, r) {
        var n = t(62)
          , a = t(90)
          , i = Math.exp;
        n(n.S + n.F * t(64)(function() {
            return -2e-17 != !Math.sinh(-2e-17)
        }), "Math", {
            sinh: function(t) {
                return Math.abs(t = +t) < 1 ? (a(t) - a(-t)) / 2 : (i(t - 1) - i(-t - 1)) * (Math.E / 2)
            }
        })
    }
    , {
        62: 62,
        64: 64,
        90: 90
    }],
    199: [function(t, e, r) {
        var n = t(62)
          , a = t(90)
          , i = Math.exp;
        n(n.S, "Math", {
            tanh: function(t) {
                var e = a(t = +t)
                  , r = a(-t);
                return e == 1 / 0 ? 1 : r == 1 / 0 ? -1 : (e - r) / (i(t) + i(-t))
            }
        })
    }
    , {
        62: 62,
        90: 90
    }],
    200: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Math", {
            trunc: function(t) {
                return (0 < t ? Math.floor : Math.ceil)(t)
            }
        })
    }
    , {
        62: 62
    }],
    201: [function(t, e, r) {
        "use strict";
        function n(t) {
            var e = p(t, !1);
            if ("string" == typeof e && 2 < e.length) {
                var r, n, a, i = (e = y ? e.trim() : d(e, 3)).charCodeAt(0);
                if (43 === i || 45 === i) {
                    if (88 === (r = e.charCodeAt(2)) || 120 === r)
                        return NaN
                } else if (48 === i) {
                    switch (e.charCodeAt(1)) {
                    case 66:
                    case 98:
                        n = 2,
                        a = 49;
                        break;
                    case 79:
                    case 111:
                        n = 8,
                        a = 55;
                        break;
                    default:
                        return +e
                    }
                    for (var o, s = e.slice(2), l = 0, c = s.length; l < c; l++)
                        if ((o = s.charCodeAt(l)) < 48 || a < o)
                            return NaN;
                    return parseInt(s, n)
                }
            }
            return +e
        }
        var a = t(70)
          , i = t(71)
          , o = t(48)
          , s = t(75)
          , p = t(143)
          , l = t(64)
          , c = t(103).f
          , u = t(101).f
          , f = t(99).f
          , d = t(134).trim
          , h = "Number"
          , m = a[h]
          , g = m
          , A = m.prototype
          , v = o(t(98)(A)) == h
          , y = "trim"in String.prototype;
        if (!m(" 0o1") || !m("0b1") || m("+0x1")) {
            m = function(t) {
                var e = arguments.length < 1 ? 0 : t
                  , r = this;
                return r instanceof m && (v ? l(function() {
                    A.valueOf.call(r)
                }) : o(r) != h) ? s(new g(n(e)), r, m) : n(e)
            }
            ;
            for (var b, x = t(58) ? c(g) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), w = 0; x.length > w; w++)
                i(g, b = x[w]) && !i(m, b) && f(m, b, u(g, b));
            (m.prototype = A).constructor = m,
            t(118)(a, h, m)
        }
    }
    , {
        101: 101,
        103: 103,
        118: 118,
        134: 134,
        143: 143,
        48: 48,
        58: 58,
        64: 64,
        70: 70,
        71: 71,
        75: 75,
        98: 98,
        99: 99
    }],
    202: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Number", {
            EPSILON: Math.pow(2, -52)
        })
    }
    , {
        62: 62
    }],
    203: [function(t, e, r) {
        var n = t(62)
          , a = t(70).isFinite;
        n(n.S, "Number", {
            isFinite: function(t) {
                return "number" == typeof t && a(t)
            }
        })
    }
    , {
        62: 62,
        70: 70
    }],
    204: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Number", {
            isInteger: t(80)
        })
    }
    , {
        62: 62,
        80: 80
    }],
    205: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Number", {
            isNaN: function(t) {
                return t != t
            }
        })
    }
    , {
        62: 62
    }],
    206: [function(t, e, r) {
        var n = t(62)
          , a = t(80)
          , i = Math.abs;
        n(n.S, "Number", {
            isSafeInteger: function(t) {
                return a(t) && i(t) <= 9007199254740991
            }
        })
    }
    , {
        62: 62,
        80: 80
    }],
    207: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Number", {
            MAX_SAFE_INTEGER: 9007199254740991
        })
    }
    , {
        62: 62
    }],
    208: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Number", {
            MIN_SAFE_INTEGER: -9007199254740991
        })
    }
    , {
        62: 62
    }],
    209: [function(t, e, r) {
        var n = t(62)
          , a = t(112);
        n(n.S + n.F * (Number.parseFloat != a), "Number", {
            parseFloat: a
        })
    }
    , {
        112: 112,
        62: 62
    }],
    210: [function(t, e, r) {
        var n = t(62)
          , a = t(113);
        n(n.S + n.F * (Number.parseInt != a), "Number", {
            parseInt: a
        })
    }
    , {
        113: 113,
        62: 62
    }],
    211: [function(t, e, r) {
        "use strict";
        function c(t, e) {
            for (var r = -1, n = e; ++r < 6; )
                n += t * o[r],
                o[r] = n % 1e7,
                n = i(n / 1e7)
        }
        function p(t) {
            for (var e = 6, r = 0; 0 <= --e; )
                r += o[e],
                o[e] = i(r / t),
                r = r % t * 1e7
        }
        function u() {
            for (var t = 6, e = ""; 0 <= --t; )
                if ("" !== e || 0 === t || 0 !== o[t]) {
                    var r = String(o[t]);
                    e = "" === e ? r : e + h.call("0", 7 - r.length) + r
                }
            return e
        }
        var n = t(62)
          , f = t(139)
          , d = t(34)
          , h = t(133)
          , a = 1..toFixed
          , i = Math.floor
          , o = [0, 0, 0, 0, 0, 0]
          , m = "Number.toFixed: incorrect invocation!"
          , g = function(t, e, r) {
            return 0 === e ? r : e % 2 == 1 ? g(t, e - 1, r * t) : g(t * t, e / 2, r)
        };
        n(n.P + n.F * (!!a && ("0.000" !== 8e-5.toFixed(3) || "1" !== .9.toFixed(0) || "1.25" !== 1.255.toFixed(2) || "1000000000000000128" !== (0xde0b6b3a7640080).toFixed(0)) || !t(64)(function() {
            a.call({})
        })), "Number", {
            toFixed: function(t) {
                var e, r, n, a, i = d(this, m), o = f(t), s = "", l = "0";
                if (o < 0 || 20 < o)
                    throw RangeError(m);
                if (i != i)
                    return "NaN";
                if (i <= -1e21 || 1e21 <= i)
                    return String(i);
                if (i < 0 && (s = "-",
                i = -i),
                1e-21 < i)
                    if (r = (e = function() {
                        for (var t = 0, e = i * g(2, 69, 1); 4096 <= e; )
                            t += 12,
                            e /= 4096;
                        for (; 2 <= e; )
                            t += 1,
                            e /= 2;
                        return t
                    }() - 69) < 0 ? i * g(2, -e, 1) : i / g(2, e, 1),
                    r *= 4503599627370496,
                    0 < (e = 52 - e)) {
                        for (c(0, r),
                        n = o; 7 <= n; )
                            c(1e7, 0),
                            n -= 7;
                        for (c(g(10, n, 1), 0),
                        n = e - 1; 23 <= n; )
                            p(1 << 23),
                            n -= 23;
                        p(1 << n),
                        c(1, 1),
                        p(2),
                        l = u()
                    } else
                        c(0, r),
                        c(1 << -e, 0),
                        l = u() + h.call("0", o);
                return 0 < o ? s + ((a = l.length) <= o ? "0." + h.call("0", o - a) + l : l.slice(0, a - o) + "." + l.slice(a - o)) : s + l
            }
        })
    }
    , {
        133: 133,
        139: 139,
        34: 34,
        62: 62,
        64: 64
    }],
    212: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(64)
          , i = t(34)
          , o = 1..toPrecision;
        n(n.P + n.F * (a(function() {
            return "1" !== o.call(1, void 0)
        }) || !a(function() {
            o.call({})
        })), "Number", {
            toPrecision: function(t) {
                var e = i(this, "Number#toPrecision: incorrect invocation!");
                return void 0 === t ? o.call(e) : o.call(e, t)
            }
        })
    }
    , {
        34: 34,
        62: 62,
        64: 64
    }],
    213: [function(t, e, r) {
        var n = t(62);
        n(n.S + n.F, "Object", {
            assign: t(97)
        })
    }
    , {
        62: 62,
        97: 97
    }],
    214: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Object", {
            create: t(98)
        })
    }
    , {
        62: 62,
        98: 98
    }],
    215: [function(t, e, r) {
        var n = t(62);
        n(n.S + n.F * !t(58), "Object", {
            defineProperties: t(100)
        })
    }
    , {
        100: 100,
        58: 58,
        62: 62
    }],
    216: [function(t, e, r) {
        var n = t(62);
        n(n.S + n.F * !t(58), "Object", {
            defineProperty: t(99).f
        })
    }
    , {
        58: 58,
        62: 62,
        99: 99
    }],
    217: [function(t, e, r) {
        var n = t(81)
          , a = t(94).onFreeze;
        t(109)("freeze", function(e) {
            return function(t) {
                return e && n(t) ? e(a(t)) : t
            }
        })
    }
    , {
        109: 109,
        81: 81,
        94: 94
    }],
    218: [function(t, e, r) {
        var n = t(140)
          , a = t(101).f;
        t(109)("getOwnPropertyDescriptor", function() {
            return function(t, e) {
                return a(n(t), e)
            }
        })
    }
    , {
        101: 101,
        109: 109,
        140: 140
    }],
    219: [function(t, e, r) {
        t(109)("getOwnPropertyNames", function() {
            return t(102).f
        })
    }
    , {
        102: 102,
        109: 109
    }],
    220: [function(t, e, r) {
        var n = t(142)
          , a = t(105);
        t(109)("getPrototypeOf", function() {
            return function(t) {
                return a(n(t))
            }
        })
    }
    , {
        105: 105,
        109: 109,
        142: 142
    }],
    221: [function(t, e, r) {
        var n = t(81);
        t(109)("isExtensible", function(e) {
            return function(t) {
                return !!n(t) && (!e || e(t))
            }
        })
    }
    , {
        109: 109,
        81: 81
    }],
    222: [function(t, e, r) {
        var n = t(81);
        t(109)("isFrozen", function(e) {
            return function(t) {
                return !n(t) || !!e && e(t)
            }
        })
    }
    , {
        109: 109,
        81: 81
    }],
    223: [function(t, e, r) {
        var n = t(81);
        t(109)("isSealed", function(e) {
            return function(t) {
                return !n(t) || !!e && e(t)
            }
        })
    }
    , {
        109: 109,
        81: 81
    }],
    224: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Object", {
            is: t(121)
        })
    }
    , {
        121: 121,
        62: 62
    }],
    225: [function(t, e, r) {
        var n = t(142)
          , a = t(107);
        t(109)("keys", function() {
            return function(t) {
                return a(n(t))
            }
        })
    }
    , {
        107: 107,
        109: 109,
        142: 142
    }],
    226: [function(t, e, r) {
        var n = t(81)
          , a = t(94).onFreeze;
        t(109)("preventExtensions", function(e) {
            return function(t) {
                return e && n(t) ? e(a(t)) : t
            }
        })
    }
    , {
        109: 109,
        81: 81,
        94: 94
    }],
    227: [function(t, e, r) {
        var n = t(81)
          , a = t(94).onFreeze;
        t(109)("seal", function(e) {
            return function(t) {
                return e && n(t) ? e(a(t)) : t
            }
        })
    }
    , {
        109: 109,
        81: 81,
        94: 94
    }],
    228: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Object", {
            setPrototypeOf: t(122).set
        })
    }
    , {
        122: 122,
        62: 62
    }],
    229: [function(t, e, r) {
        "use strict";
        var n = t(47)
          , a = {};
        a[t(152)("toStringTag")] = "z",
        a + "" != "[object z]" && t(118)(Object.prototype, "toString", function() {
            return "[object " + n(this) + "]"
        }, !0)
    }
    , {
        118: 118,
        152: 152,
        47: 47
    }],
    230: [function(t, e, r) {
        var n = t(62)
          , a = t(112);
        n(n.G + n.F * (parseFloat != a), {
            parseFloat: a
        })
    }
    , {
        112: 112,
        62: 62
    }],
    231: [function(t, e, r) {
        var n = t(62)
          , a = t(113);
        n(n.G + n.F * (parseInt != a), {
            parseInt: a
        })
    }
    , {
        113: 113,
        62: 62
    }],
    232: [function(r, t, e) {
        "use strict";
        function n() {}
        function u(t) {
            var e;
            return !(!g(t) || "function" != typeof (e = t.then)) && e
        }
        function a(p, r) {
            if (!p._n) {
                p._n = !0;
                var n = p._c;
                w(function() {
                    for (var l = p._v, c = 1 == p._s, t = 0, e = function(t) {
                        var e, r, n, a = c ? t.ok : t.fail, i = t.resolve, o = t.reject, s = t.domain;
                        try {
                            a ? (c || (2 == p._h && M(p),
                            p._h = 1),
                            !0 === a ? e = l : (s && s.enter(),
                            e = a(l),
                            s && (s.exit(),
                            n = !0)),
                            e === t.promise ? o(T("Promise-chain cycle")) : (r = u(e)) ? r.call(e, i, o) : i(e)) : o(l)
                        } catch (t) {
                            s && !n && s.exit(),
                            o(t)
                        }
                    }; n.length > t; )
                        e(n[t++]);
                    p._c = [],
                    p._n = !1,
                    r && !p._h && N(p)
                })
            }
        }
        function i(t) {
            var e = this;
            e._d || (e._d = !0,
            (e = e._w || e)._v = t,
            e._s = 2,
            e._a || (e._a = e._c.slice()),
            a(e, !0))
        }
        var o, s, l, c, p = r(89), f = r(70), d = r(54), h = r(47), m = r(62), g = r(81), A = r(33), v = r(37), y = r(68), b = r(127), x = r(136).set, w = r(95)(), _ = r(96), C = r(114), S = r(148), P = r(115), E = "Promise", T = f.TypeError, L = f.process, k = L && L.versions, R = k && k.v8 || "", F = f[E], I = "process" == h(L), O = s = _.f, B = !!function() {
            try {
                var t = F.resolve(1)
                  , e = (t.constructor = {})[r(152)("species")] = function(t) {
                    t(n, n)
                }
                ;
                return (I || "function" == typeof PromiseRejectionEvent) && t.then(n)instanceof e && 0 !== R.indexOf("6.6") && -1 === S.indexOf("Chrome/66")
            } catch (t) {}
        }(), N = function(i) {
            x.call(f, function() {
                var t, e, r, n = i._v, a = D(i);
                if (a && (t = C(function() {
                    I ? L.emit("unhandledRejection", n, i) : (e = f.onunhandledrejection) ? e({
                        promise: i,
                        reason: n
                    }) : (r = f.console) && r.error && r.error("Unhandled promise rejection", n)
                }),
                i._h = I || D(i) ? 2 : 1),
                i._a = void 0,
                a && t.e)
                    throw t.v
            })
        }, D = function(t) {
            return 1 !== t._h && 0 === (t._a || t._c).length
        }, M = function(e) {
            x.call(f, function() {
                var t;
                I ? L.emit("rejectionHandled", e) : (t = f.onrejectionhandled) && t({
                    promise: e,
                    reason: e._v
                })
            })
        }, z = function(t) {
            var r, n = this;
            if (!n._d) {
                n._d = !0,
                n = n._w || n;
                try {
                    if (n === t)
                        throw T("Promise can't be resolved itself");
                    (r = u(t)) ? w(function() {
                        var e = {
                            _w: n,
                            _d: !1
                        };
                        try {
                            r.call(t, d(z, e, 1), d(i, e, 1))
                        } catch (t) {
                            i.call(e, t)
                        }
                    }) : (n._v = t,
                    n._s = 1,
                    a(n, !1))
                } catch (t) {
                    i.call({
                        _w: n,
                        _d: !1
                    }, t)
                }
            }
        };
        B || (F = function(t) {
            v(this, F, E, "_h"),
            A(t),
            o.call(this);
            try {
                t(d(z, this, 1), d(i, this, 1))
            } catch (t) {
                i.call(this, t)
            }
        }
        ,
        (o = function(t) {
            this._c = [],
            this._a = void 0,
            this._s = 0,
            this._d = !1,
            this._v = void 0,
            this._h = 0,
            this._n = !1
        }
        ).prototype = r(117)(F.prototype, {
            then: function(t, e) {
                var r = O(b(this, F));
                return r.ok = "function" != typeof t || t,
                r.fail = "function" == typeof e && e,
                r.domain = I ? L.domain : void 0,
                this._c.push(r),
                this._a && this._a.push(r),
                this._s && a(this, !1),
                r.promise
            },
            catch: function(t) {
                return this.then(void 0, t)
            }
        }),
        l = function() {
            var t = new o;
            this.promise = t,
            this.resolve = d(z, t, 1),
            this.reject = d(i, t, 1)
        }
        ,
        _.f = O = function(t) {
            return t === F || t === c ? new l(t) : s(t)
        }
        ),
        m(m.G + m.W + m.F * !B, {
            Promise: F
        }),
        r(124)(F, E),
        r(123)(E),
        c = r(52)[E],
        m(m.S + m.F * !B, E, {
            reject: function(t) {
                var e = O(this);
                return (0,
                e.reject)(t),
                e.promise
            }
        }),
        m(m.S + m.F * (p || !B), E, {
            resolve: function(t) {
                return P(p && this === c ? F : this, t)
            }
        }),
        m(m.S + m.F * !(B && r(86)(function(t) {
            F.all(t).catch(n)
        })), E, {
            all: function(t) {
                var o = this
                  , e = O(o)
                  , s = e.resolve
                  , l = e.reject
                  , r = C(function() {
                    var n = []
                      , a = 0
                      , i = 1;
                    y(t, !1, function(t) {
                        var e = a++
                          , r = !1;
                        n.push(void 0),
                        i++,
                        o.resolve(t).then(function(t) {
                            r || (r = !0,
                            n[e] = t,
                            --i || s(n))
                        }, l)
                    }),
                    --i || s(n)
                });
                return r.e && l(r.v),
                e.promise
            },
            race: function(t) {
                var e = this
                  , r = O(e)
                  , n = r.reject
                  , a = C(function() {
                    y(t, !1, function(t) {
                        e.resolve(t).then(r.resolve, n)
                    })
                });
                return a.e && n(a.v),
                r.promise
            }
        })
    }
    , {
        114: 114,
        115: 115,
        117: 117,
        123: 123,
        124: 124,
        127: 127,
        136: 136,
        148: 148,
        152: 152,
        33: 33,
        37: 37,
        47: 47,
        52: 52,
        54: 54,
        62: 62,
        68: 68,
        70: 70,
        81: 81,
        86: 86,
        89: 89,
        95: 95,
        96: 96
    }],
    233: [function(t, e, r) {
        var n = t(62)
          , i = t(33)
          , o = t(38)
          , s = (t(70).Reflect || {}).apply
          , l = Function.apply;
        n(n.S + n.F * !t(64)(function() {
            s(function() {})
        }), "Reflect", {
            apply: function(t, e, r) {
                var n = i(t)
                  , a = o(r);
                return s ? s(n, e, a) : l.call(n, e, a)
            }
        })
    }
    , {
        33: 33,
        38: 38,
        62: 62,
        64: 64,
        70: 70
    }],
    234: [function(t, e, r) {
        var n = t(62)
          , l = t(98)
          , c = t(33)
          , p = t(38)
          , u = t(81)
          , a = t(64)
          , f = t(46)
          , d = (t(70).Reflect || {}).construct
          , h = a(function() {
            function t() {}
            return !(d(function() {}, [], t)instanceof t)
        })
          , m = !a(function() {
            d(function() {})
        });
        n(n.S + n.F * (h || m), "Reflect", {
            construct: function(t, e, r) {
                c(t),
                p(e);
                var n = arguments.length < 3 ? t : c(r);
                if (m && !h)
                    return d(t, e, n);
                if (t == n) {
                    switch (e.length) {
                    case 0:
                        return new t;
                    case 1:
                        return new t(e[0]);
                    case 2:
                        return new t(e[0],e[1]);
                    case 3:
                        return new t(e[0],e[1],e[2]);
                    case 4:
                        return new t(e[0],e[1],e[2],e[3])
                    }
                    var a = [null];
                    return a.push.apply(a, e),
                    new (f.apply(t, a))
                }
                var i = n.prototype
                  , o = l(u(i) ? i : Object.prototype)
                  , s = Function.apply.call(t, o, e);
                return u(s) ? s : o
            }
        })
    }
    , {
        33: 33,
        38: 38,
        46: 46,
        62: 62,
        64: 64,
        70: 70,
        81: 81,
        98: 98
    }],
    235: [function(t, e, r) {
        var n = t(99)
          , a = t(62)
          , i = t(38)
          , o = t(143);
        a(a.S + a.F * t(64)(function() {
            Reflect.defineProperty(n.f({}, 1, {
                value: 1
            }), 1, {
                value: 2
            })
        }), "Reflect", {
            defineProperty: function(t, e, r) {
                i(t),
                e = o(e, !0),
                i(r);
                try {
                    return n.f(t, e, r),
                    !0
                } catch (t) {
                    return !1
                }
            }
        })
    }
    , {
        143: 143,
        38: 38,
        62: 62,
        64: 64,
        99: 99
    }],
    236: [function(t, e, r) {
        var n = t(62)
          , a = t(101).f
          , i = t(38);
        n(n.S, "Reflect", {
            deleteProperty: function(t, e) {
                var r = a(i(t), e);
                return !(r && !r.configurable) && delete t[e]
            }
        })
    }
    , {
        101: 101,
        38: 38,
        62: 62
    }],
    237: [function(t, e, r) {
        "use strict";
        function n(t) {
            this._t = i(t),
            this._i = 0;
            var e, r = this._k = [];
            for (e in t)
                r.push(e)
        }
        var a = t(62)
          , i = t(38);
        t(84)(n, "Object", function() {
            var t, e = this._k;
            do {
                if (this._i >= e.length)
                    return {
                        value: void 0,
                        done: !0
                    }
            } while (!((t = e[this._i++])in this._t));return {
                value: t,
                done: !1
            }
        }),
        a(a.S, "Reflect", {
            enumerate: function(t) {
                return new n(t)
            }
        })
    }
    , {
        38: 38,
        62: 62,
        84: 84
    }],
    238: [function(t, e, r) {
        var n = t(101)
          , a = t(62)
          , i = t(38);
        a(a.S, "Reflect", {
            getOwnPropertyDescriptor: function(t, e) {
                return n.f(i(t), e)
            }
        })
    }
    , {
        101: 101,
        38: 38,
        62: 62
    }],
    239: [function(t, e, r) {
        var n = t(62)
          , a = t(105)
          , i = t(38);
        n(n.S, "Reflect", {
            getPrototypeOf: function(t) {
                return a(i(t))
            }
        })
    }
    , {
        105: 105,
        38: 38,
        62: 62
    }],
    240: [function(t, e, r) {
        var s = t(101)
          , l = t(105)
          , c = t(71)
          , n = t(62)
          , p = t(81)
          , u = t(38);
        n(n.S, "Reflect", {
            get: function t(e, r, n) {
                var a, i, o = arguments.length < 3 ? e : n;
                return u(e) === o ? e[r] : (a = s.f(e, r)) ? c(a, "value") ? a.value : void 0 !== a.get ? a.get.call(o) : void 0 : p(i = l(e)) ? t(i, r, o) : void 0
            }
        })
    }
    , {
        101: 101,
        105: 105,
        38: 38,
        62: 62,
        71: 71,
        81: 81
    }],
    241: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Reflect", {
            has: function(t, e) {
                return e in t
            }
        })
    }
    , {
        62: 62
    }],
    242: [function(t, e, r) {
        var n = t(62)
          , a = t(38)
          , i = Object.isExtensible;
        n(n.S, "Reflect", {
            isExtensible: function(t) {
                return a(t),
                !i || i(t)
            }
        })
    }
    , {
        38: 38,
        62: 62
    }],
    243: [function(t, e, r) {
        var n = t(62);
        n(n.S, "Reflect", {
            ownKeys: t(111)
        })
    }
    , {
        111: 111,
        62: 62
    }],
    244: [function(t, e, r) {
        var n = t(62)
          , a = t(38)
          , i = Object.preventExtensions;
        n(n.S, "Reflect", {
            preventExtensions: function(t) {
                a(t);
                try {
                    return i && i(t),
                    !0
                } catch (t) {
                    return !1
                }
            }
        })
    }
    , {
        38: 38,
        62: 62
    }],
    245: [function(t, e, r) {
        var n = t(62)
          , a = t(122);
        a && n(n.S, "Reflect", {
            setPrototypeOf: function(t, e) {
                a.check(t, e);
                try {
                    return a.set(t, e),
                    !0
                } catch (t) {
                    return !1
                }
            }
        })
    }
    , {
        122: 122,
        62: 62
    }],
    246: [function(t, e, r) {
        var c = t(99)
          , p = t(101)
          , u = t(105)
          , f = t(71)
          , n = t(62)
          , d = t(116)
          , h = t(38)
          , m = t(81);
        n(n.S, "Reflect", {
            set: function t(e, r, n, a) {
                var i, o, s = arguments.length < 4 ? e : a, l = p.f(h(e), r);
                if (!l) {
                    if (m(o = u(e)))
                        return t(o, r, n, s);
                    l = d(0)
                }
                if (f(l, "value")) {
                    if (!1 === l.writable || !m(s))
                        return !1;
                    if (i = p.f(s, r)) {
                        if (i.get || i.set || !1 === i.writable)
                            return !1;
                        i.value = n,
                        c.f(s, r, i)
                    } else
                        c.f(s, r, d(0, n));
                    return !0
                }
                return void 0 !== l.set && (l.set.call(s, n),
                !0)
            }
        })
    }
    , {
        101: 101,
        105: 105,
        116: 116,
        38: 38,
        62: 62,
        71: 71,
        81: 81,
        99: 99
    }],
    247: [function(t, e, r) {
        var n = t(70)
          , i = t(75)
          , a = t(99).f
          , o = t(103).f
          , s = t(82)
          , l = t(66)
          , c = n.RegExp
          , p = c
          , u = c.prototype
          , f = /a/g
          , d = /a/g
          , h = new c(f) !== f;
        if (t(58) && (!h || t(64)(function() {
            return d[t(152)("match")] = !1,
            c(f) != f || c(d) == d || "/a/i" != c(f, "i")
        }))) {
            function m(e) {
                e in c || a(c, e, {
                    configurable: !0,
                    get: function() {
                        return p[e]
                    },
                    set: function(t) {
                        p[e] = t
                    }
                })
            }
            c = function(t, e) {
                var r = this instanceof c
                  , n = s(t)
                  , a = void 0 === e;
                return !r && n && t.constructor === c && a ? t : i(h ? new p(n && !a ? t.source : t,e) : p((n = t instanceof c) ? t.source : t, n && a ? l.call(t) : e), r ? this : u, c)
            }
            ;
            for (var g = o(p), A = 0; g.length > A; )
                m(g[A++]);
            (u.constructor = c).prototype = u,
            t(118)(n, "RegExp", c)
        }
        t(123)("RegExp")
    }
    , {
        103: 103,
        118: 118,
        123: 123,
        152: 152,
        58: 58,
        64: 64,
        66: 66,
        70: 70,
        75: 75,
        82: 82,
        99: 99
    }],
    248: [function(t, e, r) {
        "use strict";
        var n = t(120);
        t(62)({
            target: "RegExp",
            proto: !0,
            forced: n !== /./.exec
        }, {
            exec: n
        })
    }
    , {
        120: 120,
        62: 62
    }],
    249: [function(t, e, r) {
        t(58) && "g" != /./g.flags && t(99).f(RegExp.prototype, "flags", {
            configurable: !0,
            get: t(66)
        })
    }
    , {
        58: 58,
        66: 66,
        99: 99
    }],
    250: [function(t, e, r) {
        "use strict";
        var u = t(38)
          , f = t(141)
          , d = t(36)
          , h = t(119);
        t(65)("match", 1, function(n, a, c, p) {
            return [function(t) {
                var e = n(this)
                  , r = null == t ? void 0 : t[a];
                return void 0 !== r ? r.call(t, e) : new RegExp(t)[a](String(e))
            }
            , function(t) {
                var e = p(c, t, this);
                if (e.done)
                    return e.value;
                var r = u(t)
                  , n = String(this);
                if (!r.global)
                    return h(r, n);
                for (var a, i = r.unicode, o = [], s = r.lastIndex = 0; null !== (a = h(r, n)); ) {
                    var l = String(a[0]);
                    "" === (o[s] = l) && (r.lastIndex = d(n, f(r.lastIndex), i)),
                    s++
                }
                return 0 === s ? null : o
            }
            ]
        })
    }
    , {
        119: 119,
        141: 141,
        36: 36,
        38: 38,
        65: 65
    }],
    251: [function(t, e, r) {
        "use strict";
        var C = t(38)
          , n = t(142)
          , S = t(141)
          , P = t(139)
          , E = t(36)
          , T = t(119)
          , L = Math.max
          , k = Math.min
          , f = Math.floor
          , d = /\$([$&`']|\d\d?|<[^>]*>)/g
          , h = /\$([$&`']|\d\d?)/g;
        t(65)("replace", 2, function(a, i, x, w) {
            return [function(t, e) {
                var r = a(this)
                  , n = null == t ? void 0 : t[i];
                return void 0 !== n ? n.call(t, r, e) : x.call(String(r), t, e)
            }
            , function(t, e) {
                var r = w(x, t, this, e);
                if (r.done)
                    return r.value;
                var n = C(t)
                  , a = String(this)
                  , i = "function" == typeof e;
                i || (e = String(e));
                var o = n.global;
                if (o) {
                    var s = n.unicode;
                    n.lastIndex = 0
                }
                for (var l = []; ; ) {
                    var c = T(n, a);
                    if (null === c)
                        break;
                    if (l.push(c),
                    !o)
                        break;
                    "" === String(c[0]) && (n.lastIndex = E(a, S(n.lastIndex), s))
                }
                for (var p, u = "", f = 0, d = 0; d < l.length; d++) {
                    c = l[d];
                    for (var h = String(c[0]), m = L(k(P(c.index), a.length), 0), g = [], A = 1; A < c.length; A++)
                        g.push(void 0 === (p = c[A]) ? p : String(p));
                    var v = c.groups;
                    if (i) {
                        var y = [h].concat(g, m, a);
                        void 0 !== v && y.push(v);
                        var b = String(e.apply(void 0, y))
                    } else
                        b = _(h, a, m, g, v, e);
                    f <= m && (u += a.slice(f, m) + b,
                    f = m + h.length)
                }
                return u + a.slice(f)
            }
            ];
            function _(i, o, s, l, c, t) {
                var p = s + i.length
                  , u = l.length
                  , e = h;
                return void 0 !== c && (c = n(c),
                e = d),
                x.call(t, e, function(t, e) {
                    var r;
                    switch (e.charAt(0)) {
                    case "$":
                        return "$";
                    case "&":
                        return i;
                    case "`":
                        return o.slice(0, s);
                    case "'":
                        return o.slice(p);
                    case "<":
                        r = c[e.slice(1, -1)];
                        break;
                    default:
                        var n = +e;
                        if (0 == n)
                            return t;
                        if (u < n) {
                            var a = f(n / 10);
                            return 0 === a ? t : a <= u ? void 0 === l[a - 1] ? e.charAt(1) : l[a - 1] + e.charAt(1) : t
                        }
                        r = l[n - 1]
                    }
                    return void 0 === r ? "" : r
                })
            }
        })
    }
    , {
        119: 119,
        139: 139,
        141: 141,
        142: 142,
        36: 36,
        38: 38,
        65: 65
    }],
    252: [function(t, e, r) {
        "use strict";
        var l = t(38)
          , c = t(121)
          , p = t(119);
        t(65)("search", 1, function(n, a, o, s) {
            return [function(t) {
                var e = n(this)
                  , r = null == t ? void 0 : t[a];
                return void 0 !== r ? r.call(t, e) : new RegExp(t)[a](String(e))
            }
            , function(t) {
                var e = s(o, t, this);
                if (e.done)
                    return e.value;
                var r = l(t)
                  , n = String(this)
                  , a = r.lastIndex;
                c(a, 0) || (r.lastIndex = 0);
                var i = p(r, n);
                return c(r.lastIndex, a) || (r.lastIndex = a),
                null === i ? -1 : i.index
            }
            ]
        })
    }
    , {
        119: 119,
        121: 121,
        38: 38,
        65: 65
    }],
    253: [function(t, e, r) {
        "use strict";
        var u = t(82)
          , y = t(38)
          , b = t(127)
          , x = t(36)
          , w = t(141)
          , _ = t(119)
          , f = t(120)
          , n = t(64)
          , C = Math.min
          , d = [].push
          , o = "split"
          , h = "length"
          , m = "lastIndex"
          , S = 4294967295
          , P = !n(function() {
            RegExp(S, "y")
        });
        t(65)("split", 2, function(a, i, g, A) {
            var v;
            return v = "c" == "abbc"[o](/(b)*/)[1] || 4 != "test"[o](/(?:)/, -1)[h] || 2 != "ab"[o](/(?:ab)*/)[h] || 4 != "."[o](/(.?)(.?)/)[h] || 1 < "."[o](/()()/)[h] || ""[o](/.?/)[h] ? function(t, e) {
                var r = String(this);
                if (void 0 === t && 0 === e)
                    return [];
                if (!u(t))
                    return g.call(r, t, e);
                for (var n, a, i, o = [], s = (t.ignoreCase ? "i" : "") + (t.multiline ? "m" : "") + (t.unicode ? "u" : "") + (t.sticky ? "y" : ""), l = 0, c = void 0 === e ? S : e >>> 0, p = new RegExp(t.source,s + "g"); (n = f.call(p, r)) && !(l < (a = p[m]) && (o.push(r.slice(l, n.index)),
                1 < n[h] && n.index < r[h] && d.apply(o, n.slice(1)),
                i = n[0][h],
                l = a,
                o[h] >= c)); )
                    p[m] === n.index && p[m]++;
                return l === r[h] ? !i && p.test("") || o.push("") : o.push(r.slice(l)),
                o[h] > c ? o.slice(0, c) : o
            }
            : "0"[o](void 0, 0)[h] ? function(t, e) {
                return void 0 === t && 0 === e ? [] : g.call(this, t, e)
            }
            : g,
            [function(t, e) {
                var r = a(this)
                  , n = null == t ? void 0 : t[i];
                return void 0 !== n ? n.call(t, r, e) : v.call(String(r), t, e)
            }
            , function(t, e) {
                var r = A(v, t, this, e, v !== g);
                if (r.done)
                    return r.value;
                var n = y(t)
                  , a = String(this)
                  , i = b(n, RegExp)
                  , o = n.unicode
                  , s = (n.ignoreCase ? "i" : "") + (n.multiline ? "m" : "") + (n.unicode ? "u" : "") + (P ? "y" : "g")
                  , l = new i(P ? n : "^(?:" + n.source + ")",s)
                  , c = void 0 === e ? S : e >>> 0;
                if (0 == c)
                    return [];
                if (0 === a.length)
                    return null === _(l, a) ? [a] : [];
                for (var p = 0, u = 0, f = []; u < a.length; ) {
                    l.lastIndex = P ? u : 0;
                    var d, h = _(l, P ? a : a.slice(u));
                    if (null === h || (d = C(w(l.lastIndex + (P ? 0 : u)), a.length)) === p)
                        u = x(a, u, o);
                    else {
                        if (f.push(a.slice(p, u)),
                        f.length === c)
                            return f;
                        for (var m = 1; m <= h.length - 1; m++)
                            if (f.push(h[m]),
                            f.length === c)
                                return f;
                        u = p = d
                    }
                }
                return f.push(a.slice(p)),
                f
            }
            ]
        })
    }
    , {
        119: 119,
        120: 120,
        127: 127,
        141: 141,
        36: 36,
        38: 38,
        64: 64,
        65: 65,
        82: 82
    }],
    254: [function(e, t, r) {
        "use strict";
        function n(t) {
            e(118)(RegExp.prototype, s, t, !0)
        }
        e(249);
        var a = e(38)
          , i = e(66)
          , o = e(58)
          , s = "toString"
          , l = /./[s];
        e(64)(function() {
            return "/a/b" != l.call({
                source: "a",
                flags: "b"
            })
        }) ? n(function() {
            var t = a(this);
            return "/".concat(t.source, "/", "flags"in t ? t.flags : !o && t instanceof RegExp ? i.call(t) : void 0)
        }) : l.name != s && n(function() {
            return l.call(this)
        })
    }
    , {
        118: 118,
        249: 249,
        38: 38,
        58: 58,
        64: 64,
        66: 66
    }],
    255: [function(t, e, r) {
        "use strict";
        var n = t(49)
          , a = t(149);
        e.exports = t(51)("Set", function(e) {
            return function(t) {
                return e(this, 0 < arguments.length ? t : void 0)
            }
        }, {
            add: function(t) {
                return n.def(a(this, "Set"), t = 0 === t ? 0 : t, t)
            }
        }, n)
    }
    , {
        149: 149,
        49: 49,
        51: 51
    }],
    256: [function(t, e, r) {
        "use strict";
        t(131)("anchor", function(e) {
            return function(t) {
                return e(this, "a", "name", t)
            }
        })
    }
    , {
        131: 131
    }],
    257: [function(t, e, r) {
        "use strict";
        t(131)("big", function(t) {
            return function() {
                return t(this, "big", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    258: [function(t, e, r) {
        "use strict";
        t(131)("blink", function(t) {
            return function() {
                return t(this, "blink", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    259: [function(t, e, r) {
        "use strict";
        t(131)("bold", function(t) {
            return function() {
                return t(this, "b", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    260: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(129)(!1);
        n(n.P, "String", {
            codePointAt: function(t) {
                return a(this, t)
            }
        })
    }
    , {
        129: 129,
        62: 62
    }],
    261: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , s = t(141)
          , l = t(130)
          , c = "endsWith"
          , p = ""[c];
        n(n.P + n.F * t(63)(c), "String", {
            endsWith: function(t, e) {
                var r = l(this, t, c)
                  , n = 1 < arguments.length ? e : void 0
                  , a = s(r.length)
                  , i = void 0 === n ? a : Math.min(s(n), a)
                  , o = String(t);
                return p ? p.call(r, o, i) : r.slice(i - o.length, i) === o
            }
        })
    }
    , {
        130: 130,
        141: 141,
        62: 62,
        63: 63
    }],
    262: [function(t, e, r) {
        "use strict";
        t(131)("fixed", function(t) {
            return function() {
                return t(this, "tt", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    263: [function(t, e, r) {
        "use strict";
        t(131)("fontcolor", function(e) {
            return function(t) {
                return e(this, "font", "color", t)
            }
        })
    }
    , {
        131: 131
    }],
    264: [function(t, e, r) {
        "use strict";
        t(131)("fontsize", function(e) {
            return function(t) {
                return e(this, "font", "size", t)
            }
        })
    }
    , {
        131: 131
    }],
    265: [function(t, e, r) {
        var n = t(62)
          , i = t(137)
          , o = String.fromCharCode
          , a = String.fromCodePoint;
        n(n.S + n.F * (!!a && 1 != a.length), "String", {
            fromCodePoint: function(t) {
                for (var e, r = [], n = arguments.length, a = 0; a < n; ) {
                    if (e = +arguments[a++],
                    i(e, 1114111) !== e)
                        throw RangeError(e + " is not a valid code point");
                    r.push(e < 65536 ? o(e) : o(55296 + ((e -= 65536) >> 10), e % 1024 + 56320))
                }
                return r.join("")
            }
        })
    }
    , {
        137: 137,
        62: 62
    }],
    266: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(130);
        n(n.P + n.F * t(63)("includes"), "String", {
            includes: function(t, e) {
                return !!~a(this, t, "includes").indexOf(t, 1 < arguments.length ? e : void 0)
            }
        })
    }
    , {
        130: 130,
        62: 62,
        63: 63
    }],
    267: [function(t, e, r) {
        "use strict";
        t(131)("italics", function(t) {
            return function() {
                return t(this, "i", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    268: [function(t, e, r) {
        "use strict";
        var n = t(129)(!0);
        t(85)(String, "String", function(t) {
            this._t = String(t),
            this._i = 0
        }, function() {
            var t, e = this._t, r = this._i;
            return r >= e.length ? {
                value: void 0,
                done: !0
            } : (t = n(e, r),
            this._i += t.length,
            {
                value: t,
                done: !1
            })
        })
    }
    , {
        129: 129,
        85: 85
    }],
    269: [function(t, e, r) {
        "use strict";
        t(131)("link", function(e) {
            return function(t) {
                return e(this, "a", "href", t)
            }
        })
    }
    , {
        131: 131
    }],
    270: [function(t, e, r) {
        var n = t(62)
          , o = t(140)
          , s = t(141);
        n(n.S, "String", {
            raw: function(t) {
                for (var e = o(t.raw), r = s(e.length), n = arguments.length, a = [], i = 0; i < r; )
                    a.push(String(e[i++])),
                    i < n && a.push(String(arguments[i]));
                return a.join("")
            }
        })
    }
    , {
        140: 140,
        141: 141,
        62: 62
    }],
    271: [function(t, e, r) {
        var n = t(62);
        n(n.P, "String", {
            repeat: t(133)
        })
    }
    , {
        133: 133,
        62: 62
    }],
    272: [function(t, e, r) {
        "use strict";
        t(131)("small", function(t) {
            return function() {
                return t(this, "small", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    273: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , i = t(141)
          , o = t(130)
          , s = "startsWith"
          , l = ""[s];
        n(n.P + n.F * t(63)(s), "String", {
            startsWith: function(t, e) {
                var r = o(this, t, s)
                  , n = i(Math.min(1 < arguments.length ? e : void 0, r.length))
                  , a = String(t);
                return l ? l.call(r, a, n) : r.slice(n, n + a.length) === a
            }
        })
    }
    , {
        130: 130,
        141: 141,
        62: 62,
        63: 63
    }],
    274: [function(t, e, r) {
        "use strict";
        t(131)("strike", function(t) {
            return function() {
                return t(this, "strike", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    275: [function(t, e, r) {
        "use strict";
        t(131)("sub", function(t) {
            return function() {
                return t(this, "sub", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    276: [function(t, e, r) {
        "use strict";
        t(131)("sup", function(t) {
            return function() {
                return t(this, "sup", "", "")
            }
        })
    }
    , {
        131: 131
    }],
    277: [function(t, e, r) {
        "use strict";
        t(134)("trim", function(t) {
            return function() {
                return t(this, 3)
            }
        })
    }
    , {
        134: 134
    }],
    278: [function(t, e, r) {
        "use strict";
        function n(t) {
            var e = Y[t] = k(z[W]);
            return e._k = t,
            e
        }
        function a(t, e) {
            C(t);
            for (var r, n = w(e = E(e)), a = 0, i = n.length; a < i; )
                et(t, r = n[a++], e[r]);
            return t
        }
        function i(t) {
            var e = V.call(this, t = T(t, !0));
            return !(this === Z && p(Y, t) && !p(q, t)) && (!(e || !p(this, t) || !p(Y, t) || p(this, G) && this[G][t]) || e)
        }
        function o(t, e) {
            if (t = E(t),
            e = T(e, !0),
            t !== Z || !p(Y, e) || p(q, e)) {
                var r = N(t, e);
                return !r || !p(Y, e) || p(t, G) && t[G][e] || (r.enumerable = !0),
                r
            }
        }
        function s(t) {
            for (var e, r = M(E(t)), n = [], a = 0; r.length > a; )
                p(Y, e = r[a++]) || e == G || e == h || n.push(e);
            return n
        }
        function l(t) {
            for (var e, r = t === Z, n = M(r ? q : E(t)), a = [], i = 0; n.length > i; )
                !p(Y, e = n[i++]) || r && !p(Z, e) || a.push(Y[e]);
            return a
        }
        var c = t(70)
          , p = t(71)
          , u = t(58)
          , f = t(62)
          , d = t(118)
          , h = t(94).KEY
          , m = t(64)
          , g = t(126)
          , A = t(124)
          , v = t(147)
          , y = t(152)
          , b = t(151)
          , x = t(150)
          , w = t(61)
          , _ = t(79)
          , C = t(38)
          , S = t(81)
          , P = t(142)
          , E = t(140)
          , T = t(143)
          , L = t(116)
          , k = t(98)
          , R = t(102)
          , F = t(101)
          , I = t(104)
          , O = t(99)
          , B = t(107)
          , N = F.f
          , D = O.f
          , M = R.f
          , z = c.Symbol
          , U = c.JSON
          , j = U && U.stringify
          , W = "prototype"
          , G = y("_hidden")
          , H = y("toPrimitive")
          , V = {}.propertyIsEnumerable
          , Q = g("symbol-registry")
          , Y = g("symbols")
          , q = g("op-symbols")
          , Z = Object[W]
          , X = "function" == typeof z && !!I.f
          , K = c.QObject
          , J = !K || !K[W] || !K[W].findChild
          , $ = u && m(function() {
            return 7 != k(D({}, "a", {
                get: function() {
                    return D(this, "a", {
                        value: 7
                    }).a
                }
            })).a
        }) ? function(t, e, r) {
            var n = N(Z, e);
            n && delete Z[e],
            D(t, e, r),
            n && t !== Z && D(Z, e, n)
        }
        : D
          , tt = X && "symbol" == typeof z.iterator ? function(t) {
            return "symbol" == typeof t
        }
        : function(t) {
            return t instanceof z
        }
          , et = function(t, e, r) {
            return t === Z && et(q, e, r),
            C(t),
            e = T(e, !0),
            C(r),
            p(Y, e) ? (r.enumerable ? (p(t, G) && t[G][e] && (t[G][e] = !1),
            r = k(r, {
                enumerable: L(0, !1)
            })) : (p(t, G) || D(t, G, L(1, {})),
            t[G][e] = !0),
            $(t, e, r)) : D(t, e, r)
        };
        X || (d((z = function(t) {
            if (this instanceof z)
                throw TypeError("Symbol is not a constructor!");
            var e = v(0 < arguments.length ? t : void 0)
              , r = function(t) {
                this === Z && r.call(q, t),
                p(this, G) && p(this[G], e) && (this[G][e] = !1),
                $(this, e, L(1, t))
            };
            return u && J && $(Z, e, {
                configurable: !0,
                set: r
            }),
            n(e)
        }
        )[W], "toString", function() {
            return this._k
        }),
        F.f = o,
        O.f = et,
        t(103).f = R.f = s,
        t(108).f = i,
        I.f = l,
        u && !t(89) && d(Z, "propertyIsEnumerable", i, !0),
        b.f = function(t) {
            return n(y(t))
        }
        ),
        f(f.G + f.W + f.F * !X, {
            Symbol: z
        });
        for (var rt = "hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), nt = 0; rt.length > nt; )
            y(rt[nt++]);
        for (var at = B(y.store), it = 0; at.length > it; )
            x(at[it++]);
        f(f.S + f.F * !X, "Symbol", {
            for: function(t) {
                return p(Q, t += "") ? Q[t] : Q[t] = z(t)
            },
            keyFor: function(t) {
                if (!tt(t))
                    throw TypeError(t + " is not a symbol!");
                for (var e in Q)
                    if (Q[e] === t)
                        return e
            },
            useSetter: function() {
                J = !0
            },
            useSimple: function() {
                J = !1
            }
        }),
        f(f.S + f.F * !X, "Object", {
            create: function(t, e) {
                return void 0 === e ? k(t) : a(k(t), e)
            },
            defineProperty: et,
            defineProperties: a,
            getOwnPropertyDescriptor: o,
            getOwnPropertyNames: s,
            getOwnPropertySymbols: l
        });
        var ot = m(function() {
            I.f(1)
        });
        f(f.S + f.F * ot, "Object", {
            getOwnPropertySymbols: function(t) {
                return I.f(P(t))
            }
        }),
        U && f(f.S + f.F * (!X || m(function() {
            var t = z();
            return "[null]" != j([t]) || "{}" != j({
                a: t
            }) || "{}" != j(Object(t))
        })), "JSON", {
            stringify: function(t) {
                for (var e, r, n = [t], a = 1; a < arguments.length; )
                    n.push(arguments[a++]);
                if (r = e = n[1],
                (S(e) || void 0 !== t) && !tt(t))
                    return _(e) || (e = function(t, e) {
                        if ("function" == typeof r && (e = r.call(this, t, e)),
                        !tt(e))
                            return e
                    }
                    ),
                    n[1] = e,
                    j.apply(U, n)
            }
        }),
        z[W][H] || t(72)(z[W], H, z[W].valueOf),
        A(z, "Symbol"),
        A(Math, "Math", !0),
        A(c.JSON, "JSON", !0)
    }
    , {
        101: 101,
        102: 102,
        103: 103,
        104: 104,
        107: 107,
        108: 108,
        116: 116,
        118: 118,
        124: 124,
        126: 126,
        140: 140,
        142: 142,
        143: 143,
        147: 147,
        150: 150,
        151: 151,
        152: 152,
        38: 38,
        58: 58,
        61: 61,
        62: 62,
        64: 64,
        70: 70,
        71: 71,
        72: 72,
        79: 79,
        81: 81,
        89: 89,
        94: 94,
        98: 98,
        99: 99
    }],
    279: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(146)
          , i = t(145)
          , c = t(38)
          , p = t(137)
          , u = t(141)
          , o = t(81)
          , s = t(70).ArrayBuffer
          , f = t(127)
          , d = i.ArrayBuffer
          , h = i.DataView
          , l = a.ABV && s.isView
          , m = d.prototype.slice
          , g = a.VIEW
          , A = "ArrayBuffer";
        n(n.G + n.W + n.F * (s !== d), {
            ArrayBuffer: d
        }),
        n(n.S + n.F * !a.CONSTR, A, {
            isView: function(t) {
                return l && l(t) || o(t) && g in t
            }
        }),
        n(n.P + n.U + n.F * t(64)(function() {
            return !new d(2).slice(1, void 0).byteLength
        }), A, {
            slice: function(t, e) {
                if (void 0 !== m && void 0 === e)
                    return m.call(c(this), t);
                for (var r = c(this).byteLength, n = p(t, r), a = p(void 0 === e ? r : e, r), i = new (f(this, d))(u(a - n)), o = new h(this), s = new h(i), l = 0; n < a; )
                    s.setUint8(l++, o.getUint8(n++));
                return i
            }
        }),
        t(123)(A)
    }
    , {
        123: 123,
        127: 127,
        137: 137,
        141: 141,
        145: 145,
        146: 146,
        38: 38,
        62: 62,
        64: 64,
        70: 70,
        81: 81
    }],
    280: [function(t, e, r) {
        var n = t(62);
        n(n.G + n.W + n.F * !t(146).ABV, {
            DataView: t(145).DataView
        })
    }
    , {
        145: 145,
        146: 146,
        62: 62
    }],
    281: [function(t, e, r) {
        t(144)("Float32", 4, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    282: [function(t, e, r) {
        t(144)("Float64", 8, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    283: [function(t, e, r) {
        t(144)("Int16", 2, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    284: [function(t, e, r) {
        t(144)("Int32", 4, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    285: [function(t, e, r) {
        t(144)("Int8", 1, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    286: [function(t, e, r) {
        t(144)("Uint16", 2, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    287: [function(t, e, r) {
        t(144)("Uint32", 4, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    288: [function(t, e, r) {
        t(144)("Uint8", 1, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        })
    }
    , {
        144: 144
    }],
    289: [function(t, e, r) {
        t(144)("Uint8", 1, function(n) {
            return function(t, e, r) {
                return n(this, t, e, r)
            }
        }, !0)
    }
    , {
        144: 144
    }],
    290: [function(t, e, r) {
        "use strict";
        function n(e) {
            return function(t) {
                return e(this, 0 < arguments.length ? t : void 0)
            }
        }
        var i, a = t(70), o = t(42)(0), s = t(118), l = t(94), c = t(97), p = t(50), u = t(81), f = t(149), d = t(149), h = !a.ActiveXObject && "ActiveXObject"in a, m = "WeakMap", g = l.getWeak, A = Object.isExtensible, v = p.ufstore, y = {
            get: function(t) {
                if (u(t)) {
                    var e = g(t);
                    return !0 === e ? v(f(this, m)).get(t) : e ? e[this._i] : void 0
                }
            },
            set: function(t, e) {
                return p.def(f(this, m), t, e)
            }
        }, b = e.exports = t(51)(m, n, y, p, !0, !0);
        d && h && (c((i = p.getConstructor(n, m)).prototype, y),
        l.NEED = !0,
        o(["delete", "has", "get", "set"], function(n) {
            var t = b.prototype
              , a = t[n];
            s(t, n, function(t, e) {
                if (!u(t) || A(t))
                    return a.call(this, t, e);
                this._f || (this._f = new i);
                var r = this._f[n](t, e);
                return "set" == n ? this : r
            })
        }))
    }
    , {
        118: 118,
        149: 149,
        42: 42,
        50: 50,
        51: 51,
        70: 70,
        81: 81,
        94: 94,
        97: 97
    }],
    291: [function(t, e, r) {
        "use strict";
        var n = t(50)
          , a = t(149);
        t(51)("WeakSet", function(e) {
            return function(t) {
                return e(this, 0 < arguments.length ? t : void 0)
            }
        }, {
            add: function(t) {
                return n.def(a(this, "WeakSet"), t, !0)
            }
        }, n, !1, !0)
    }
    , {
        149: 149,
        50: 50,
        51: 51
    }],
    292: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , i = t(67)
          , o = t(142)
          , s = t(141)
          , l = t(33)
          , c = t(45);
        n(n.P, "Array", {
            flatMap: function(t, e) {
                var r, n, a = o(this);
                return l(t),
                r = s(a.length),
                n = c(a, 0),
                i(n, a, a, r, 0, 1, t, e),
                n
            }
        }),
        t(35)("flatMap")
    }
    , {
        141: 141,
        142: 142,
        33: 33,
        35: 35,
        45: 45,
        62: 62,
        67: 67
    }],
    293: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(41)(!0);
        n(n.P, "Array", {
            includes: function(t, e) {
                return a(this, t, 1 < arguments.length ? e : void 0)
            }
        }),
        t(35)("includes")
    }
    , {
        35: 35,
        41: 41,
        62: 62
    }],
    294: [function(t, e, r) {
        var n = t(62)
          , a = t(110)(!0);
        n(n.S, "Object", {
            entries: function(t) {
                return a(t)
            }
        })
    }
    , {
        110: 110,
        62: 62
    }],
    295: [function(t, e, r) {
        var n = t(62)
          , l = t(111)
          , c = t(140)
          , p = t(101)
          , u = t(53);
        n(n.S, "Object", {
            getOwnPropertyDescriptors: function(t) {
                for (var e, r, n = c(t), a = p.f, i = l(n), o = {}, s = 0; i.length > s; )
                    void 0 !== (r = a(n, e = i[s++])) && u(o, e, r);
                return o
            }
        })
    }
    , {
        101: 101,
        111: 111,
        140: 140,
        53: 53,
        62: 62
    }],
    296: [function(t, e, r) {
        var n = t(62)
          , a = t(110)(!1);
        n(n.S, "Object", {
            values: function(t) {
                return a(t)
            }
        })
    }
    , {
        110: 110,
        62: 62
    }],
    297: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(52)
          , i = t(70)
          , o = t(127)
          , s = t(115);
        n(n.P + n.R, "Promise", {
            finally: function(e) {
                var r = o(this, a.Promise || i.Promise)
                  , t = "function" == typeof e;
                return this.then(t ? function(t) {
                    return s(r, e()).then(function() {
                        return t
                    })
                }
                : e, t ? function(t) {
                    return s(r, e()).then(function() {
                        throw t
                    })
                }
                : e)
            }
        })
    }
    , {
        115: 115,
        127: 127,
        52: 52,
        62: 62,
        70: 70
    }],
    298: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(132)
          , i = t(148)
          , o = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(i);
        n(n.P + n.F * o, "String", {
            padEnd: function(t, e) {
                return a(this, t, 1 < arguments.length ? e : void 0, !1)
            }
        })
    }
    , {
        132: 132,
        148: 148,
        62: 62
    }],
    299: [function(t, e, r) {
        "use strict";
        var n = t(62)
          , a = t(132)
          , i = t(148)
          , o = /Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(i);
        n(n.P + n.F * o, "String", {
            padStart: function(t, e) {
                return a(this, t, 1 < arguments.length ? e : void 0, !0)
            }
        })
    }
    , {
        132: 132,
        148: 148,
        62: 62
    }],
    300: [function(t, e, r) {
        "use strict";
        t(134)("trimLeft", function(t) {
            return function() {
                return t(this, 1)
            }
        }, "trimStart")
    }
    , {
        134: 134
    }],
    301: [function(t, e, r) {
        "use strict";
        t(134)("trimRight", function(t) {
            return function() {
                return t(this, 2)
            }
        }, "trimEnd")
    }
    , {
        134: 134
    }],
    302: [function(t, e, r) {
        t(150)("asyncIterator")
    }
    , {
        150: 150
    }],
    303: [function(t, e, r) {
        for (var n = t(164), a = t(107), i = t(118), o = t(70), s = t(72), l = t(88), c = t(152), p = c("iterator"), u = c("toStringTag"), f = l.Array, d = {
            CSSRuleList: !0,
            CSSStyleDeclaration: !1,
            CSSValueList: !1,
            ClientRectList: !1,
            DOMRectList: !1,
            DOMStringList: !1,
            DOMTokenList: !0,
            DataTransferItemList: !1,
            FileList: !1,
            HTMLAllCollection: !1,
            HTMLCollection: !1,
            HTMLFormElement: !1,
            HTMLSelectElement: !1,
            MediaList: !0,
            MimeTypeArray: !1,
            NamedNodeMap: !1,
            NodeList: !0,
            PaintRequestList: !1,
            Plugin: !1,
            PluginArray: !1,
            SVGLengthList: !1,
            SVGNumberList: !1,
            SVGPathSegList: !1,
            SVGPointList: !1,
            SVGStringList: !1,
            SVGTransformList: !1,
            SourceBufferList: !1,
            StyleSheetList: !0,
            TextTrackCueList: !1,
            TextTrackList: !1,
            TouchList: !1
        }, h = a(d), m = 0; m < h.length; m++) {
            var g, A = h[m], v = d[A], y = o[A], b = y && y.prototype;
            if (b && (b[p] || s(b, p, f),
            b[u] || s(b, u, A),
            l[A] = f,
            v))
                for (g in n)
                    b[g] || i(b, g, n[g], !0)
        }
    }
    , {
        107: 107,
        118: 118,
        152: 152,
        164: 164,
        70: 70,
        72: 72,
        88: 88
    }],
    304: [function(t, e, r) {
        var n = t(62)
          , a = t(136);
        n(n.G + n.B, {
            setImmediate: a.set,
            clearImmediate: a.clear
        })
    }
    , {
        136: 136,
        62: 62
    }],
    305: [function(t, e, r) {
        function n(a) {
            return function(t, e) {
                var r = 2 < arguments.length
                  , n = r && s.call(arguments, 2);
                return a(r ? function() {
                    ("function" == typeof t ? t : Function(t)).apply(this, n)
                }
                : t, e)
            }
        }
        var a = t(70)
          , i = t(62)
          , o = t(148)
          , s = [].slice
          , l = /MSIE .\./.test(o);
        i(i.G + i.B + i.F * l, {
            setTimeout: n(a.setTimeout),
            setInterval: n(a.setInterval)
        })
    }
    , {
        148: 148,
        62: 62,
        70: 70
    }],
    306: [function(t, e, r) {
        t(305),
        t(304),
        t(303),
        e.exports = t(52)
    }
    , {
        303: 303,
        304: 304,
        305: 305,
        52: 52
    }],
    307: [function(t, e, r) {
        var n = function(i) {
            "use strict";
            var l, t = Object.prototype, c = t.hasOwnProperty, e = "function" == typeof Symbol ? Symbol : {}, a = e.iterator || "@@iterator", r = e.asyncIterator || "@@asyncIterator", n = e.toStringTag || "@@toStringTag";
            function o(t, e, r, n) {
                var i, o, s, l, a = e && e.prototype instanceof A ? e : A, c = Object.create(a.prototype), p = new E(n || []);
                return c._invoke = (i = t,
                o = r,
                s = p,
                l = f,
                function(t, e) {
                    if (l === h)
                        throw new Error("Generator is already running");
                    if (l === m) {
                        if ("throw" === t)
                            throw e;
                        return L()
                    }
                    for (s.method = t,
                    s.arg = e; ; ) {
                        var r = s.delegate;
                        if (r) {
                            var n = C(r, s);
                            if (n) {
                                if (n === g)
                                    continue;
                                return n
                            }
                        }
                        if ("next" === s.method)
                            s.sent = s._sent = s.arg;
                        else if ("throw" === s.method) {
                            if (l === f)
                                throw l = m,
                                s.arg;
                            s.dispatchException(s.arg)
                        } else
                            "return" === s.method && s.abrupt("return", s.arg);
                        l = h;
                        var a = u(i, o, s);
                        if ("normal" === a.type) {
                            if (l = s.done ? m : d,
                            a.arg === g)
                                continue;
                            return {
                                value: a.arg,
                                done: s.done
                            }
                        }
                        "throw" === a.type && (l = m,
                        s.method = "throw",
                        s.arg = a.arg)
                    }
                }
                ),
                c
            }
            function u(t, e, r) {
                try {
                    return {
                        type: "normal",
                        arg: t.call(e, r)
                    }
                } catch (t) {
                    return {
                        type: "throw",
                        arg: t
                    }
                }
            }
            i.wrap = o;
            var f = "suspendedStart"
              , d = "suspendedYield"
              , h = "executing"
              , m = "completed"
              , g = {};
            function A() {}
            function s() {}
            function p() {}
            var v = {};
            v[a] = function() {
                return this
            }
            ;
            var y = Object.getPrototypeOf
              , b = y && y(y(T([])));
            b && b !== t && c.call(b, a) && (v = b);
            var x = p.prototype = A.prototype = Object.create(v);
            function w(t) {
                ["next", "throw", "return"].forEach(function(e) {
                    t[e] = function(t) {
                        return this._invoke(e, t)
                    }
                })
            }
            function _(l) {
                var e;
                this._invoke = function(r, n) {
                    function t() {
                        return new Promise(function(t, e) {
                            !function e(t, r, n, a) {
                                var i = u(l[t], l, r);
                                if ("throw" !== i.type) {
                                    var o = i.arg
                                      , s = o.value;
                                    return s && "object" == typeof s && c.call(s, "__await") ? Promise.resolve(s.__await).then(function(t) {
                                        e("next", t, n, a)
                                    }, function(t) {
                                        e("throw", t, n, a)
                                    }) : Promise.resolve(s).then(function(t) {
                                        o.value = t,
                                        n(o)
                                    }, function(t) {
                                        return e("throw", t, n, a)
                                    })
                                }
                                a(i.arg)
                            }(r, n, t, e)
                        }
                        )
                    }
                    return e = e ? e.then(t, t) : t()
                }
            }
            function C(t, e) {
                var r = t.iterator[e.method];
                if (r === l) {
                    if (e.delegate = null,
                    "throw" === e.method) {
                        if (t.iterator.return && (e.method = "return",
                        e.arg = l,
                        C(t, e),
                        "throw" === e.method))
                            return g;
                        e.method = "throw",
                        e.arg = new TypeError("The iterator does not provide a 'throw' method")
                    }
                    return g
                }
                var n = u(r, t.iterator, e.arg);
                if ("throw" === n.type)
                    return e.method = "throw",
                    e.arg = n.arg,
                    e.delegate = null,
                    g;
                var a = n.arg;
                return a ? a.done ? (e[t.resultName] = a.value,
                e.next = t.nextLoc,
                "return" !== e.method && (e.method = "next",
                e.arg = l),
                e.delegate = null,
                g) : a : (e.method = "throw",
                e.arg = new TypeError("iterator result is not an object"),
                e.delegate = null,
                g)
            }
            function S(t) {
                var e = {
                    tryLoc: t[0]
                };
                1 in t && (e.catchLoc = t[1]),
                2 in t && (e.finallyLoc = t[2],
                e.afterLoc = t[3]),
                this.tryEntries.push(e)
            }
            function P(t) {
                var e = t.completion || {};
                e.type = "normal",
                delete e.arg,
                t.completion = e
            }
            function E(t) {
                this.tryEntries = [{
                    tryLoc: "root"
                }],
                t.forEach(S, this),
                this.reset(!0)
            }
            function T(e) {
                if (e) {
                    var t = e[a];
                    if (t)
                        return t.call(e);
                    if ("function" == typeof e.next)
                        return e;
                    if (!isNaN(e.length)) {
                        var r = -1
                          , n = function t() {
                            for (; ++r < e.length; )
                                if (c.call(e, r))
                                    return t.value = e[r],
                                    t.done = !1,
                                    t;
                            return t.value = l,
                            t.done = !0,
                            t
                        };
                        return n.next = n
                    }
                }
                return {
                    next: L
                }
            }
            function L() {
                return {
                    value: l,
                    done: !0
                }
            }
            return s.prototype = x.constructor = p,
            p.constructor = s,
            p[n] = s.displayName = "GeneratorFunction",
            i.isGeneratorFunction = function(t) {
                var e = "function" == typeof t && t.constructor;
                return !!e && (e === s || "GeneratorFunction" === (e.displayName || e.name))
            }
            ,
            i.mark = function(t) {
                return Object.setPrototypeOf ? Object.setPrototypeOf(t, p) : (t.__proto__ = p,
                n in t || (t[n] = "GeneratorFunction")),
                t.prototype = Object.create(x),
                t
            }
            ,
            i.awrap = function(t) {
                return {
                    __await: t
                }
            }
            ,
            w(_.prototype),
            _.prototype[r] = function() {
                return this
            }
            ,
            i.AsyncIterator = _,
            i.async = function(t, e, r, n) {
                var a = new _(o(t, e, r, n));
                return i.isGeneratorFunction(e) ? a : a.next().then(function(t) {
                    return t.done ? t.value : a.next()
                })
            }
            ,
            w(x),
            x[n] = "Generator",
            x[a] = function() {
                return this
            }
            ,
            x.toString = function() {
                return "[object Generator]"
            }
            ,
            i.keys = function(r) {
                var n = [];
                for (var t in r)
                    n.push(t);
                return n.reverse(),
                function t() {
                    for (; n.length; ) {
                        var e = n.pop();
                        if (e in r)
                            return t.value = e,
                            t.done = !1,
                            t
                    }
                    return t.done = !0,
                    t
                }
            }
            ,
            i.values = T,
            E.prototype = {
                constructor: E,
                reset: function(t) {
                    if (this.prev = 0,
                    this.next = 0,
                    this.sent = this._sent = l,
                    this.done = !1,
                    this.delegate = null,
                    this.method = "next",
                    this.arg = l,
                    this.tryEntries.forEach(P),
                    !t)
                        for (var e in this)
                            "t" === e.charAt(0) && c.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = l)
                },
                stop: function() {
                    this.done = !0;
                    var t = this.tryEntries[0].completion;
                    if ("throw" === t.type)
                        throw t.arg;
                    return this.rval
                },
                dispatchException: function(r) {
                    if (this.done)
                        throw r;
                    var n = this;
                    function t(t, e) {
                        return i.type = "throw",
                        i.arg = r,
                        n.next = t,
                        e && (n.method = "next",
                        n.arg = l),
                        !!e
                    }
                    for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                        var a = this.tryEntries[e]
                          , i = a.completion;
                        if ("root" === a.tryLoc)
                            return t("end");
                        if (a.tryLoc <= this.prev) {
                            var o = c.call(a, "catchLoc")
                              , s = c.call(a, "finallyLoc");
                            if (o && s) {
                                if (this.prev < a.catchLoc)
                                    return t(a.catchLoc, !0);
                                if (this.prev < a.finallyLoc)
                                    return t(a.finallyLoc)
                            } else if (o) {
                                if (this.prev < a.catchLoc)
                                    return t(a.catchLoc, !0)
                            } else {
                                if (!s)
                                    throw new Error("try statement without catch or finally");
                                if (this.prev < a.finallyLoc)
                                    return t(a.finallyLoc)
                            }
                        }
                    }
                },
                abrupt: function(t, e) {
                    for (var r = this.tryEntries.length - 1; 0 <= r; --r) {
                        var n = this.tryEntries[r];
                        if (n.tryLoc <= this.prev && c.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                            var a = n;
                            break
                        }
                    }
                    a && ("break" === t || "continue" === t) && a.tryLoc <= e && e <= a.finallyLoc && (a = null);
                    var i = a ? a.completion : {};
                    return i.type = t,
                    i.arg = e,
                    a ? (this.method = "next",
                    this.next = a.finallyLoc,
                    g) : this.complete(i)
                },
                complete: function(t, e) {
                    if ("throw" === t.type)
                        throw t.arg;
                    return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg,
                    this.method = "return",
                    this.next = "end") : "normal" === t.type && e && (this.next = e),
                    g
                },
                finish: function(t) {
                    for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                        var r = this.tryEntries[e];
                        if (r.finallyLoc === t)
                            return this.complete(r.completion, r.afterLoc),
                            P(r),
                            g
                    }
                },
                catch: function(t) {
                    for (var e = this.tryEntries.length - 1; 0 <= e; --e) {
                        var r = this.tryEntries[e];
                        if (r.tryLoc === t) {
                            var n = r.completion;
                            if ("throw" === n.type) {
                                var a = n.arg;
                                P(r)
                            }
                            return a
                        }
                    }
                    throw new Error("illegal catch attempt")
                },
                delegateYield: function(t, e, r) {
                    return this.delegate = {
                        iterator: T(t),
                        resultName: e,
                        nextLoc: r
                    },
                    "next" === this.method && (this.arg = l),
                    g
                }
            },
            i
        }("object" == typeof e ? e.exports : {});
        try {
            regeneratorRuntime = n
        } catch (t) {
            Function("r", "regeneratorRuntime = r")(n)
        }
    }
    , {}]
}, {}, [1]);
var PptxGenJS = function(d) {
    "use strict";
    var l, t, c, e, L = 914400, g = 12700, A = "\r\n", i = 2147483649, o = /^[0-9a-fA-F]{6}$/, v = 1.67, p = 27, f = "solid", h = "666666", m = 1, k = [3, 3, 3, 3], y = {
        color: "888888",
        style: "solid",
        size: 1
    }, b = "000000", x = 12, w = 18, s = "LAYOUT_16x9", r = "DEFAULT", u = "333333", _ = {
        type: "outer",
        blur: 3,
        offset: 23e3 / 12700,
        angle: 90,
        color: "000000",
        opacity: .35,
        rotateWithShape: !0
    }, C = [.5, .5, .5, .5], R = {
        type: "outer",
        blur: 8,
        offset: 4,
        angle: 270,
        color: "000000",
        opacity: .75
    }, a = {
        size: 8,
        color: "FFFFFF",
        opacity: .75
    }, S = "2094734552", P = "2094734553", E = "2094734554", T = "2094734555", F = "2094734556", I = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), O = ["C0504D", "4F81BD", "9BBB59", "8064A2", "4BACC6", "F79646", "628FC6", "C86360", "C0504D", "4F81BD", "9BBB59", "8064A2", "4BACC6", "F79646", "628FC6", "C86360"], B = ["5DA5DA", "FAA43A", "60BD68", "F17CB0", "B2912F", "B276B2", "DECF3F", "F15854", "A7A7A7", "5DA5DA", "FAA43A", "60BD68", "F17CB0", "B2912F", "B276B2", "DECF3F", "F15854", "A7A7A7"];
    (t = l = l || {}).left = "left",
    t.center = "center",
    t.right = "right",
    t.justify = "justify",
    (e = c = c || {}).b = "b",
    e.ctr = "ctr",
    e.t = "t";
    var n, N, D, M, z, U, j, W, G, H, V, Q, Y, q, Z, X, K, J, $, tt, et, rt, nt, at, it, ot, st = "{F7021451-1387-4CA6-816F-3879F97B5CBC}";
    (N = n = n || {}).arraybuffer = "arraybuffer",
    N.base64 = "base64",
    N.binarystring = "binarystring",
    N.blob = "blob",
    N.nodebuffer = "nodebuffer",
    N.uint8array = "uint8array",
    (M = D = D || {}).area = "area",
    M.bar = "bar",
    M.bar3d = "bar3D",
    M.bubble = "bubble",
    M.doughnut = "doughnut",
    M.line = "line",
    M.pie = "pie",
    M.radar = "radar",
    M.scatter = "scatter",
    (U = z = z || {}).accentBorderCallout1 = "accentBorderCallout1",
    U.accentBorderCallout2 = "accentBorderCallout2",
    U.accentBorderCallout3 = "accentBorderCallout3",
    U.accentCallout1 = "accentCallout1",
    U.accentCallout2 = "accentCallout2",
    U.accentCallout3 = "accentCallout3",
    U.actionButtonBackPrevious = "actionButtonBackPrevious",
    U.actionButtonBeginning = "actionButtonBeginning",
    U.actionButtonBlank = "actionButtonBlank",
    U.actionButtonDocument = "actionButtonDocument",
    U.actionButtonEnd = "actionButtonEnd",
    U.actionButtonForwardNext = "actionButtonForwardNext",
    U.actionButtonHelp = "actionButtonHelp",
    U.actionButtonHome = "actionButtonHome",
    U.actionButtonInformation = "actionButtonInformation",
    U.actionButtonMovie = "actionButtonMovie",
    U.actionButtonReturn = "actionButtonReturn",
    U.actionButtonSound = "actionButtonSound",
    U.arc = "arc",
    U.bentArrow = "bentArrow",
    U.bentUpArrow = "bentUpArrow",
    U.bevel = "bevel",
    U.blockArc = "blockArc",
    U.borderCallout1 = "borderCallout1",
    U.borderCallout2 = "borderCallout2",
    U.borderCallout3 = "borderCallout3",
    U.bracePair = "bracePair",
    U.bracketPair = "bracketPair",
    U.callout1 = "callout1",
    U.callout2 = "callout2",
    U.callout3 = "callout3",
    U.can = "can",
    U.chartPlus = "chartPlus",
    U.chartStar = "chartStar",
    U.chartX = "chartX",
    U.chevron = "chevron",
    U.chord = "chord",
    U.circularArrow = "circularArrow",
    U.cloud = "cloud",
    U.cloudCallout = "cloudCallout",
    U.corner = "corner",
    U.cornerTabs = "cornerTabs",
    U.cube = "cube",
    U.curvedDownArrow = "curvedDownArrow",
    U.curvedLeftArrow = "curvedLeftArrow",
    U.curvedRightArrow = "curvedRightArrow",
    U.curvedUpArrow = "curvedUpArrow",
    U.decagon = "decagon",
    U.diagStripe = "diagStripe",
    U.diamond = "diamond",
    U.dodecagon = "dodecagon",
    U.donut = "donut",
    U.doubleWave = "doubleWave",
    U.downArrow = "downArrow",
    U.downArrowCallout = "downArrowCallout",
    U.ellipse = "ellipse",
    U.ellipseRibbon = "ellipseRibbon",
    U.ellipseRibbon2 = "ellipseRibbon2",
    U.flowChartAlternateProcess = "flowChartAlternateProcess",
    U.flowChartCollate = "flowChartCollate",
    U.flowChartConnector = "flowChartConnector",
    U.flowChartDecision = "flowChartDecision",
    U.flowChartDelay = "flowChartDelay",
    U.flowChartDisplay = "flowChartDisplay",
    U.flowChartDocument = "flowChartDocument",
    U.flowChartExtract = "flowChartExtract",
    U.flowChartInputOutput = "flowChartInputOutput",
    U.flowChartInternalStorage = "flowChartInternalStorage",
    U.flowChartMagneticDisk = "flowChartMagneticDisk",
    U.flowChartMagneticDrum = "flowChartMagneticDrum",
    U.flowChartMagneticTape = "flowChartMagneticTape",
    U.flowChartManualInput = "flowChartManualInput",
    U.flowChartManualOperation = "flowChartManualOperation",
    U.flowChartMerge = "flowChartMerge",
    U.flowChartMultidocument = "flowChartMultidocument",
    U.flowChartOfflineStorage = "flowChartOfflineStorage",
    U.flowChartOffpageConnector = "flowChartOffpageConnector",
    U.flowChartOnlineStorage = "flowChartOnlineStorage",
    U.flowChartOr = "flowChartOr",
    U.flowChartPredefinedProcess = "flowChartPredefinedProcess",
    U.flowChartPreparation = "flowChartPreparation",
    U.flowChartProcess = "flowChartProcess",
    U.flowChartPunchedCard = "flowChartPunchedCard",
    U.flowChartPunchedTape = "flowChartPunchedTape",
    U.flowChartSort = "flowChartSort",
    U.flowChartSummingJunction = "flowChartSummingJunction",
    U.flowChartTerminator = "flowChartTerminator",
    U.folderCorner = "folderCorner",
    U.frame = "frame",
    U.funnel = "funnel",
    U.gear6 = "gear6",
    U.gear9 = "gear9",
    U.halfFrame = "halfFrame",
    U.heart = "heart",
    U.heptagon = "heptagon",
    U.hexagon = "hexagon",
    U.homePlate = "homePlate",
    U.horizontalScroll = "horizontalScroll",
    U.irregularSeal1 = "irregularSeal1",
    U.irregularSeal2 = "irregularSeal2",
    U.leftArrow = "leftArrow",
    U.leftArrowCallout = "leftArrowCallout",
    U.leftBrace = "leftBrace",
    U.leftBracket = "leftBracket",
    U.leftCircularArrow = "leftCircularArrow",
    U.leftRightArrow = "leftRightArrow",
    U.leftRightArrowCallout = "leftRightArrowCallout",
    U.leftRightCircularArrow = "leftRightCircularArrow",
    U.leftRightRibbon = "leftRightRibbon",
    U.leftRightUpArrow = "leftRightUpArrow",
    U.leftUpArrow = "leftUpArrow",
    U.lightningBolt = "lightningBolt",
    U.line = "line",
    U.lineInv = "lineInv",
    U.mathDivide = "mathDivide",
    U.mathEqual = "mathEqual",
    U.mathMinus = "mathMinus",
    U.mathMultiply = "mathMultiply",
    U.mathNotEqual = "mathNotEqual",
    U.mathPlus = "mathPlus",
    U.moon = "moon",
    U.nonIsoscelesTrapezoid = "nonIsoscelesTrapezoid",
    U.noSmoking = "noSmoking",
    U.notchedRightArrow = "notchedRightArrow",
    U.octagon = "octagon",
    U.parallelogram = "parallelogram",
    U.pentagon = "pentagon",
    U.pie = "pie",
    U.pieWedge = "pieWedge",
    U.plaque = "plaque",
    U.plaqueTabs = "plaqueTabs",
    U.plus = "plus",
    U.quadArrow = "quadArrow",
    U.quadArrowCallout = "quadArrowCallout",
    U.rect = "rect",
    U.ribbon = "ribbon",
    U.ribbon2 = "ribbon2",
    U.rightArrow = "rightArrow",
    U.rightArrowCallout = "rightArrowCallout",
    U.rightBrace = "rightBrace",
    U.rightBracket = "rightBracket",
    U.round1Rect = "round1Rect",
    U.round2DiagRect = "round2DiagRect",
    U.round2SameRect = "round2SameRect",
    U.roundRect = "roundRect",
    U.rtTriangle = "rtTriangle",
    U.smileyFace = "smileyFace",
    U.snip1Rect = "snip1Rect",
    U.snip2DiagRect = "snip2DiagRect",
    U.snip2SameRect = "snip2SameRect",
    U.snipRoundRect = "snipRoundRect",
    U.squareTabs = "squareTabs",
    U.star10 = "star10",
    U.star12 = "star12",
    U.star16 = "star16",
    U.star24 = "star24",
    U.star32 = "star32",
    U.star4 = "star4",
    U.star5 = "star5",
    U.star6 = "star6",
    U.star7 = "star7",
    U.star8 = "star8",
    U.stripedRightArrow = "stripedRightArrow",
    U.sun = "sun",
    U.swooshArrow = "swooshArrow",
    U.teardrop = "teardrop",
    U.trapezoid = "trapezoid",
    U.triangle = "triangle",
    U.upArrow = "upArrow",
    U.upArrowCallout = "upArrowCallout",
    U.upDownArrow = "upDownArrow",
    U.upDownArrowCallout = "upDownArrowCallout",
    U.uturnArrow = "uturnArrow",
    U.verticalScroll = "verticalScroll",
    U.wave = "wave",
    U.wedgeEllipseCallout = "wedgeEllipseCallout",
    U.wedgeRectCallout = "wedgeRectCallout",
    U.wedgeRoundRectCallout = "wedgeRoundRectCallout",
    (W = j = j || {}).text1 = "tx1",
    W.text2 = "tx2",
    W.background1 = "bg1",
    W.background2 = "bg2",
    W.accent1 = "accent1",
    W.accent2 = "accent2",
    W.accent3 = "accent3",
    W.accent4 = "accent4",
    W.accent5 = "accent5",
    W.accent6 = "accent6",
    (H = G = G || {}).left = "left",
    H.center = "center",
    H.right = "right",
    H.justify = "justify",
    (Q = V = V || {}).top = "top",
    Q.middle = "middle",
    Q.bottom = "bottom",
    (q = Y = Y || {}).ACTION_BUTTON_BACK_OR_PREVIOUS = "actionButtonBackPrevious",
    q.ACTION_BUTTON_BEGINNING = "actionButtonBeginning",
    q.ACTION_BUTTON_CUSTOM = "actionButtonBlank",
    q.ACTION_BUTTON_DOCUMENT = "actionButtonDocument",
    q.ACTION_BUTTON_END = "actionButtonEnd",
    q.ACTION_BUTTON_FORWARD_OR_NEXT = "actionButtonForwardNext",
    q.ACTION_BUTTON_HELP = "actionButtonHelp",
    q.ACTION_BUTTON_HOME = "actionButtonHome",
    q.ACTION_BUTTON_INFORMATION = "actionButtonInformation",
    q.ACTION_BUTTON_MOVIE = "actionButtonMovie",
    q.ACTION_BUTTON_RETURN = "actionButtonReturn",
    q.ACTION_BUTTON_SOUND = "actionButtonSound",
    q.ARC = "arc",
    q.BALLOON = "wedgeRoundRectCallout",
    q.BENT_ARROW = "bentArrow",
    q.BENT_UP_ARROW = "bentUpArrow",
    q.BEVEL = "bevel",
    q.BLOCK_ARC = "blockArc",
    q.CAN = "can",
    q.CHART_PLUS = "chartPlus",
    q.CHART_STAR = "chartStar",
    q.CHART_X = "chartX",
    q.CHEVRON = "chevron",
    q.CHORD = "chord",
    q.CIRCULAR_ARROW = "circularArrow",
    q.CLOUD = "cloud",
    q.CLOUD_CALLOUT = "cloudCallout",
    q.CORNER = "corner",
    q.CORNER_TABS = "cornerTabs",
    q.CROSS = "plus",
    q.CUBE = "cube",
    q.CURVED_DOWN_ARROW = "curvedDownArrow",
    q.CURVED_DOWN_RIBBON = "ellipseRibbon",
    q.CURVED_LEFT_ARROW = "curvedLeftArrow",
    q.CURVED_RIGHT_ARROW = "curvedRightArrow",
    q.CURVED_UP_ARROW = "curvedUpArrow",
    q.CURVED_UP_RIBBON = "ellipseRibbon2",
    q.DECAGON = "decagon",
    q.DIAGONAL_STRIPE = "diagStripe",
    q.DIAMOND = "diamond",
    q.DODECAGON = "dodecagon",
    q.DONUT = "donut",
    q.DOUBLE_BRACE = "bracePair",
    q.DOUBLE_BRACKET = "bracketPair",
    q.DOUBLE_WAVE = "doubleWave",
    q.DOWN_ARROW = "downArrow",
    q.DOWN_ARROW_CALLOUT = "downArrowCallout",
    q.DOWN_RIBBON = "ribbon",
    q.EXPLOSION1 = "irregularSeal1",
    q.EXPLOSION2 = "irregularSeal2",
    q.FLOWCHART_ALTERNATE_PROCESS = "flowChartAlternateProcess",
    q.FLOWCHART_CARD = "flowChartPunchedCard",
    q.FLOWCHART_COLLATE = "flowChartCollate",
    q.FLOWCHART_CONNECTOR = "flowChartConnector",
    q.FLOWCHART_DATA = "flowChartInputOutput",
    q.FLOWCHART_DECISION = "flowChartDecision",
    q.FLOWCHART_DELAY = "flowChartDelay",
    q.FLOWCHART_DIRECT_ACCESS_STORAGE = "flowChartMagneticDrum",
    q.FLOWCHART_DISPLAY = "flowChartDisplay",
    q.FLOWCHART_DOCUMENT = "flowChartDocument",
    q.FLOWCHART_EXTRACT = "flowChartExtract",
    q.FLOWCHART_INTERNAL_STORAGE = "flowChartInternalStorage",
    q.FLOWCHART_MAGNETIC_DISK = "flowChartMagneticDisk",
    q.FLOWCHART_MANUAL_INPUT = "flowChartManualInput",
    q.FLOWCHART_MANUAL_OPERATION = "flowChartManualOperation",
    q.FLOWCHART_MERGE = "flowChartMerge",
    q.FLOWCHART_MULTIDOCUMENT = "flowChartMultidocument",
    q.FLOWCHART_OFFLINE_STORAGE = "flowChartOfflineStorage",
    q.FLOWCHART_OFFPAGE_CONNECTOR = "flowChartOffpageConnector",
    q.FLOWCHART_OR = "flowChartOr",
    q.FLOWCHART_PREDEFINED_PROCESS = "flowChartPredefinedProcess",
    q.FLOWCHART_PREPARATION = "flowChartPreparation",
    q.FLOWCHART_PROCESS = "flowChartProcess",
    q.FLOWCHART_PUNCHED_TAPE = "flowChartPunchedTape",
    q.FLOWCHART_SEQUENTIAL_ACCESS_STORAGE = "flowChartMagneticTape",
    q.FLOWCHART_SORT = "flowChartSort",
    q.FLOWCHART_STORED_DATA = "flowChartOnlineStorage",
    q.FLOWCHART_SUMMING_JUNCTION = "flowChartSummingJunction",
    q.FLOWCHART_TERMINATOR = "flowChartTerminator",
    q.FOLDED_CORNER = "folderCorner",
    q.FRAME = "frame",
    q.FUNNEL = "funnel",
    q.GEAR_6 = "gear6",
    q.GEAR_9 = "gear9",
    q.HALF_FRAME = "halfFrame",
    q.HEART = "heart",
    q.HEPTAGON = "heptagon",
    q.HEXAGON = "hexagon",
    q.HORIZONTAL_SCROLL = "horizontalScroll",
    q.ISOSCELES_TRIANGLE = "triangle",
    q.LEFT_ARROW = "leftArrow",
    q.LEFT_ARROW_CALLOUT = "leftArrowCallout",
    q.LEFT_BRACE = "leftBrace",
    q.LEFT_BRACKET = "leftBracket",
    q.LEFT_CIRCULAR_ARROW = "leftCircularArrow",
    q.LEFT_RIGHT_ARROW = "leftRightArrow",
    q.LEFT_RIGHT_ARROW_CALLOUT = "leftRightArrowCallout",
    q.LEFT_RIGHT_CIRCULAR_ARROW = "leftRightCircularArrow",
    q.LEFT_RIGHT_RIBBON = "leftRightRibbon",
    q.LEFT_RIGHT_UP_ARROW = "leftRightUpArrow",
    q.LEFT_UP_ARROW = "leftUpArrow",
    q.LIGHTNING_BOLT = "lightningBolt",
    q.LINE_CALLOUT_1 = "borderCallout1",
    q.LINE_CALLOUT_1_ACCENT_BAR = "accentCallout1",
    q.LINE_CALLOUT_1_BORDER_AND_ACCENT_BAR = "accentBorderCallout1",
    q.LINE_CALLOUT_1_NO_BORDER = "callout1",
    q.LINE_CALLOUT_2 = "borderCallout2",
    q.LINE_CALLOUT_2_ACCENT_BAR = "accentCallout2",
    q.LINE_CALLOUT_2_BORDER_AND_ACCENT_BAR = "accentBorderCallout2",
    q.LINE_CALLOUT_2_NO_BORDER = "callout2",
    q.LINE_CALLOUT_3 = "borderCallout3",
    q.LINE_CALLOUT_3_ACCENT_BAR = "accentCallout3",
    q.LINE_CALLOUT_3_BORDER_AND_ACCENT_BAR = "accentBorderCallout3",
    q.LINE_CALLOUT_3_NO_BORDER = "callout3",
    q.LINE_CALLOUT_4 = "borderCallout3",
    q.LINE_CALLOUT_4_ACCENT_BAR = "accentCallout3",
    q.LINE_CALLOUT_4_BORDER_AND_ACCENT_BAR = "accentBorderCallout3",
    q.LINE_CALLOUT_4_NO_BORDER = "callout3",
    q.LINE = "line",
    q.LINE_INVERSE = "lineInv",
    q.MATH_DIVIDE = "mathDivide",
    q.MATH_EQUAL = "mathEqual",
    q.MATH_MINUS = "mathMinus",
    q.MATH_MULTIPLY = "mathMultiply",
    q.MATH_NOT_EQUAL = "mathNotEqual",
    q.MATH_PLUS = "mathPlus",
    q.MOON = "moon",
    q.NON_ISOSCELES_TRAPEZOID = "nonIsoscelesTrapezoid",
    q.NOTCHED_RIGHT_ARROW = "notchedRightArrow",
    q.NO_SYMBOL = "noSmoking",
    q.OCTAGON = "octagon",
    q.OVAL = "ellipse",
    q.OVAL_CALLOUT = "wedgeEllipseCallout",
    q.PARALLELOGRAM = "parallelogram",
    q.PENTAGON = "homePlate",
    q.PIE = "pie",
    q.PIE_WEDGE = "pieWedge",
    q.PLAQUE = "plaque",
    q.PLAQUE_TABS = "plaqueTabs",
    q.QUAD_ARROW = "quadArrow",
    q.QUAD_ARROW_CALLOUT = "quadArrowCallout",
    q.RECTANGLE = "rect",
    q.RECTANGULAR_CALLOUT = "wedgeRectCallout",
    q.REGULAR_PENTAGON = "pentagon",
    q.RIGHT_ARROW = "rightArrow",
    q.RIGHT_ARROW_CALLOUT = "rightArrowCallout",
    q.RIGHT_BRACE = "rightBrace",
    q.RIGHT_BRACKET = "rightBracket",
    q.RIGHT_TRIANGLE = "rtTriangle",
    q.ROUNDED_RECTANGLE = "roundRect",
    q.ROUNDED_RECTANGULAR_CALLOUT = "wedgeRoundRectCallout",
    q.ROUND_1_RECTANGLE = "round1Rect",
    q.ROUND_2_DIAG_RECTANGLE = "round2DiagRect",
    q.ROUND_2_SAME_RECTANGLE = "round2SameRect",
    q.SMILEY_FACE = "smileyFace",
    q.SNIP_1_RECTANGLE = "snip1Rect",
    q.SNIP_2_DIAG_RECTANGLE = "snip2DiagRect",
    q.SNIP_2_SAME_RECTANGLE = "snip2SameRect",
    q.SNIP_ROUND_RECTANGLE = "snipRoundRect",
    q.SQUARE_TABS = "squareTabs",
    q.STAR_10_POINT = "star10",
    q.STAR_12_POINT = "star12",
    q.STAR_16_POINT = "star16",
    q.STAR_24_POINT = "star24",
    q.STAR_32_POINT = "star32",
    q.STAR_4_POINT = "star4",
    q.STAR_5_POINT = "star5",
    q.STAR_6_POINT = "star6",
    q.STAR_7_POINT = "star7",
    q.STAR_8_POINT = "star8",
    q.STRIPED_RIGHT_ARROW = "stripedRightArrow",
    q.SUN = "sun",
    q.SWOOSH_ARROW = "swooshArrow",
    q.TEAR = "teardrop",
    q.TRAPEZOID = "trapezoid",
    q.UP_ARROW = "upArrow",
    q.UP_ARROW_CALLOUT = "upArrowCallout",
    q.UP_DOWN_ARROW = "upDownArrow",
    q.UP_DOWN_ARROW_CALLOUT = "upDownArrowCallout",
    q.UP_RIBBON = "ribbon2",
    q.U_TURN_ARROW = "uturnArrow",
    q.VERTICAL_SCROLL = "verticalScroll",
    q.WAVE = "wave",
    (X = Z = Z || {}).AREA = "area",
    X.BAR = "bar",
    X.BAR3D = "bar3D",
    X.BUBBLE = "bubble",
    X.DOUGHNUT = "doughnut",
    X.LINE = "line",
    X.PIE = "pie",
    X.RADAR = "radar",
    X.SCATTER = "scatter",
    (J = K = K || {}).TEXT1 = "tx1",
    J.TEXT2 = "tx2",
    J.BACKGROUND1 = "bg1",
    J.BACKGROUND2 = "bg2",
    J.ACCENT1 = "accent1",
    J.ACCENT2 = "accent2",
    J.ACCENT3 = "accent3",
    J.ACCENT4 = "accent4",
    J.ACCENT5 = "accent5",
    J.ACCENT6 = "accent6",
    (tt = $ = $ || {}).chart = "chart",
    tt.image = "image",
    tt.line = "line",
    tt.rect = "rect",
    tt.text = "text",
    tt.placeholder = "placeholder",
    (rt = et = et || {}).chart = "chart",
    rt.hyperlink = "hyperlink",
    rt.image = "image",
    rt.media = "media",
    rt.online = "online",
    rt.placeholder = "placeholder",
    rt.table = "table",
    rt.tablecell = "tablecell",
    rt.text = "text",
    rt.notes = "notes",
    (at = nt = nt || {}).title = "title",
    at.body = "body",
    at.image = "pic",
    at.chart = "chart",
    at.table = "tbl",
    at.media = "media",
    (ot = it = it || {}).DEFAULT = "&#x2022;",
    ot.CHECK = "&#x2713;",
    ot.STAR = "&#x2605;",
    ot.TRIANGLE = "&#x25B6;";
    var lt = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAB3CAYAAAD1oOVhAAAGAUlEQVR4Xu2dT0xcRRzHf7tAYSsc0EBSIq2xEg8mtTGebVzEqOVIolz0siRE4gGTStqKwdpWsXoyGhMuyAVJOHBgqyvLNgonDkabeCBYW/8kTUr0wsJC+Wfm0bfuvn37Znbem9mR9303mJnf/Pb7ed95M7PDI5JIJPYJV5EC7e3t1N/fT62trdqViQCIu+bVgpIHEo/Hqbe3V/sdYVKHyWSSZmZm8ilVA0oeyNjYmEnaVC2Xvr6+qg5fAOJAz4DU1dURGzFSqZRVqtMpAFIGyMjICC0vL9PExIRWKADiAYTNshYWFrRCARAOEFZcCKWtrY0GBgaUTYkBRACIE4rKZwqACALR5RQAqQCIDqcASIVAVDsFQCSAqHQKgEgCUeUUAPEBRIVTAMQnEBvK5OQkbW9vk991CoAEAMQJxc86BUACAhKUUwAkQCBBOAVAAgbi1ykAogCIH6cAiCIgsk4BEIVAZJwCIIqBVLqiBxANQFgXS0tLND4+zl08AogmIG5OSSQS1gGKwgtANAIRcQqAaAbCe6YASBWA2E6xDyeyDUl7+AKQMkDYYevm5mZHabA/Li4uUiaTsYLau8QA4gLE/hU7wajyYtv1hReDAiAOxQcHBymbzark4BkbQKom/X8dp9Npmpqasn4BIAYAYSnYp+4BBEAMUcCwNOCQsAKZnp62NtQOw8WmwT09PUo+ijaHsOMx7GppaaH6+nolH0Z10K2tLVpdXbW6UfV3mNqBdHd3U1NTk2rtlMRfW1uj2dlZAFGirkRQAJEQTWUTAFGprkRsAJEQTWUTAFGprkRsAJEQTWUTAFGprkRsAJEQTWUTAFGprkRsAJEQTWUTAFGprkRsAJEQTWUTAGHqrm8caPzQ0WC1logbeiC7X3xJm0PvUmRzh45cuki1588FAmVn9BO6P3yF9utrqGH0MtW82S8UN9RA9v/4k7InjhcJFTs/TLVXLwmJV67S7vD7tHF5pKi46fYdosdOcOOGG8j1OcqefbFEJD9Q3GCwDhqT31HklS4A8VRgfYM2Op6k3bt/BQJl58J7lPvwg5JYNccepaMry0LPqFA7hCm39+NNyp2J0172b19QysGINj5CsRtpij57musOViH0QPJQXn6J9u7dlYJSFkbrMYolrwvDAJAC+WWdEpQz7FTgECeUCpzi6YxvvqXoM6eEhqnCSgDikEzUKUE7Aw7xuHctKB5OYU3dZlNR9syQdAaAcAYTC0pXF+39c09o2Ik+3EqxVKqiB7hbYAxZkk4pbBaEM+AQofv+wTrFwylBOQNABIGwavdfe4O2pg5elO+86l99nY58/VUF0byrYsjiSFluNlXYrOHcBar7+EogUADEQ0YRGHbzoKAASBkg2+9cpM1rV0tK2QOcXW7bLEFAARAXIF4w2DrDWoeUWaf4hQIgDiA8GPZ2iNfi0Q8UACkAIgrDbrJ385eDxaPLLrEsFAB5oG6lMPJQPLZZZKAACBGVhcG2Q+bmuLu2nk55e4jqPv1IeEoceiBeX7s2zCa5MAqdstl91vfXwaEGsv/rb5TtOFk6tWXOuJGh6KmnhO9sayrMninPx103JBtXblHkice58cINZP4Hyr5wpkgkdiChEmc4FWazLzenNKa/p0jncwDiqcD6BuWePk07t1asatZGoYQzSqA4nFJ7soNiP/+EUyfc25GI2GG53dHPrKo1g/1Cw4pIXLrzO+1c+/wg7tBbFDle/EbQcjFCPWQJCau5EoBoFpzXHYDwFNJcDiCaBed1ByA8hTSXA4hmwXndAQhPIc3lAKJZcF53AMJTSHM5gGgWnNcdgPAU0lwOIJoF53UHIDyFNJcfSiCdnZ0Ui8U0SxlMd7lcjubn561gh+Y1scFIU/0o/3sgeLO12E2k7UXKYumgFoAYdg8ACIAYpoBh6cAhAGKYAoalA4cAiGEKGJYOHAIghilgWDpwCIAYpoBh6cAhAGKYAoalA4cAiGEKGJYOHAIghilgWDpwCIAYpoBh6ZQ4JB6PKzviYthnNy4d9h+1M5mMlVckkUjsG5dhiBMCEMPg/wuOfrZZ/RSywQAAAABJRU5ErkJggg=="
      , ct = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAyAAAAHCCAYAAAAXY63IAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAFRdJREFUeNrs3WFz2lbagOEnkiVLxsYQsP//z9uZZmMswJIlS3k/tPb23U3TOAUM6Lpm8qkzbXM4A7p1dI4+/etf//oWAAAAB3ARETGdTo0EAACwV1VVRWIYAACAQxEgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAECAAAgAABAAAECAAAgAABAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAAQIAACAAAEAAAQIAACAAAEAAAQIAAAgQAAAAPbnwhAA8CuGYYiXl5fv/7hcXESSuMcFgAAB4G90XRffvn2L5+fniIho2zYiIvq+j77vf+nfmaZppGkaERF5nkdExOXlZXz69CmyLDPoAAIEgDFo2zaen5/j5eUl+r6Pruv28t/5c7y8Bs1ms3n751mWRZqmcXFxEZeXl2+RAoAAAeBEDcMQbdu+/dlXbPyKruve/n9ewyTLssjz/O2PR7oABAgAR67v+2iaJpqmeVt5OBWvUbLdbiPi90e3iqKIoijeHucCQIAAcATRsd1uo2maX96zcYxeV26qqoo0TaMoiphMJmIEQIAAcGjDMERd11HX9VE9WrXvyNput5FlWZRlGWVZekwLQIAAsE+vjyjVdT3qMei6LqqqirIsYzKZOFkLQIAAsEt1XcfT09PJ7es4xLjUdR15nsfV1VWUZWlQAAQIAP/kAnu9Xp/V3o59eN0vsl6v4+bmRogACBAAhMf+9X0fq9VKiAAIEAB+RtM0UVWV8NhhiEyn0yiKwqAACBAAXr1uqrbHY/ch8vDwEHmex3Q6tVkdQIAAjNswDLHZbN5evsd+tG0bX758iclkEtfX147vBRAgAOPTNE08Pj7GMAwG40BejzC+vb31WBaAAAEYh9f9CR63+hjDMLw9ljWfz62GAOyZb1mAD9Q0TXz58kV8HIG2beO3336LpmkMBsAeWQEB+ADDMERVVaN+g/mxfi4PDw9RlmVMp1OrIQACBOD0dV0XDw8PjtY9YnVdR9u2MZ/PnZQFsGNu7QAc+ML269ev4uME9H0fX79+tUoFsGNWQAAOZLVauZg9McMwxGq1iufn55jNZgYEQIAAnMZF7MPDg43mJ6yu6+j73ilZADvgWxRgj7qui69fv4qPM9C2rcfnAAQIwPHHR9d1BuOMPtMvX774TAEECMBxxoe3mp+fYRiEJYAAATgeryddiY/zjxAvLQQQIAAfHh+r1Up8jCRCHh4enGwGIEAAPkbTNLFarQzEyKxWKyshAAIE4LC6rovHx0cDMVKPj4/2hAAIEIDDxYc9H+NmYzqAAAEQH4gQAAECcF4XnI+Pj+IDcwJAgADs38PDg7vd/I+u6+Lh4cFAAAgQgN1ZrVbRtq2B4LvatnUiGoAAAdiNuq69+wHzBECAAOxf13VRVZWB4KdUVeUxPQABAvBrXt98bYMx5gyAAAHYu6qqou97A8G79H1v1QxAgAC8T9M0nufnl9V1HU3TGAgAAQLw9/q+j8fHx5P6f86yLMqy9OEdEe8HARAgAD9ltVqd3IXjp0+fYjabxWKxiDzPfYhH4HU/CIAAAeAvNU1z0u/7yPM8FotFzGazSBJf+R+tbVuPYgECxBAAfN8wDCf36NVfKcsy7u7u4vr62gf7wTyKBQgQAL5rs9mc1YVikiRxc3MT9/f3URSFD/gDw3az2RgIQIAA8B9d18V2uz3Lv1uapjGfz2OxWESWZT7sD7Ddbr2gEBAgAPzHGN7bkOd5LJfLmE6n9oeYYwACBOCjnPrG8/eaTCZxd3cXk8nEh39ANqQDAgSAiBjnnekkSWI6ncb9/b1je801AAECcCh1XUff96P9+6dpGovFIhaLRaRpakLsWd/3Ude1gQAECMBYrddrgxC/7w+5v7+P6+tr+0PMOQABArAPY1/9+J6bm5u4u7uLsiwNxp5YBQEECMBIuRP9Fz8USRKz2SyWy6X9IeYegAAB2AWrH38vy7JYLBYxn8/tD9kxqyCAAAEYmaenJ4Pwk4qiiOVyaX+IOQggQAB+Rdd1o3rvx05+PJIkbm5uYrlc2h+yI23bejs6IEAAxmC73RqEX5Smacxms1gsFpFlmQExFwEECMCPDMPg2fsdyPM8lstlzGYzj2X9A3VdxzAMBgIQIADnfMHH7pRlGXd3d3F9fW0wzEkAAQLgYu8APyx/7A+5v7+PoigMiDkJIEAAIn4/+tSm3/1J0zTm83ksFgvH9r5D13WOhAYECMA5suH3MPI8j/v7+5hOp/aHmJsAAgQYr6ZpDMIBTSaTuLu7i8lkYjDMTUCAAIxL3/cec/mIH50kiel0Gvf395HnuQExPwEBAjAO7jB/rDRNY7FYxHw+tz/EHAUECICLOw6jKIq4v7+P6+tr+0PMUUCAAJynYRiibVsDcURubm7i7u4uyrI0GH9o29ZLCQEBAnAuF3Yc4Q9SksRsNovlcml/iLkKCBAAF3UcRpZlsVgsYjabjX5/iLkKnKMLQwC4qOMYlWUZl5eXsd1u4+npaZSPI5mrwDmyAgKMjrefn9CPVJLEzc1NLJfLUe4PMVcBAQJw4txRPk1pmsZsNovFYhFZlpmzAAIE4DQ8Pz8bhBOW53ksl8uYzWajObbXnAXOjT0gwKi8vLwYhDPw5/0hm83GnAU4IVZAgFHp+94gnMsP2B/7Q+7v78/62F5zFhAgACfMpt7zk6ZpLBaLWCwWZ3lsrzkLCBAAF3IcoTzP4/7+PqbT6dntDzF3AQECcIK+fftmEEZgMpnE3d1dTCYTcxdAgAB8HKcJjejHLUliOp3Gcrk8i/0h5i4gQADgBGRZFovFIubz+VnuDwE4RY7hBUbDC93GqyiKKIoi1ut1PD09xTAM5i7AB7ECAsBo3NzcxN3dXZRlaTAABAjAfnmfAhG/7w+ZzWaxWCxOZn+IuQsIEAABwonL8zwWi0XMZrOj3x9i7gLnxB4QAEatLMu4vLyM7XZ7kvtDAE6NFRAA/BgmSdzc3MRyuYyiKAwIgAAB+Gfc1eZnpGka8/k8FotFZFlmDgMIEIBf8/LyYhD4aXmex3K5jNlsFkmSmMMAO2QPCAD8hT/vD9lsNgYEYAesgADAj34o/9gfcn9/fzLH9gIIEAAAgPAIFgD80DAMsdlsYrvdGgwAAQIA+/O698MJVAACBOB9X3YXvu74eW3bRlVV0XWdOQwgQADe71iOUuW49X0fVVVF0zTmMIAAAYD9GIbBUbsAAgQA9q+u61iv19H3vcEAECAAu5OmqYtM3rRtG+v1Otq2PYm5CyBAAAQIJ6jv+1iv11HX9UnNXQABAgAnZr1ex9PTk2N1AQQIwP7leX4Sj9uwe03TRFVVJ7sClue5DxEQIABw7Lqui6qqhCeAAAE4vMvLS8esjsQwDLHZbGK73Z7N3AUQIAAn5tOnTwZhBF7f53FO+zzMXUCAAJygLMsMwhlr2zZWq9VZnnRm7gICBOCEL+S6rjMQZ6Tv+1itVme7z0N8AAIE4ISlaSpAzsQwDG+PW537nAUQIACn+qV34WvvHNR1HVVVjeJ9HuYsIEAATpiTsE5b27ZRVdWoVrGcgAUIEIBT/tJzN/kk9X0fVVVF0zSj+7t7CSEgQABOWJIkNqKfkNd9Hk9PT6N43Oq/2YAOCBCAM5DnuQA5AXVdx3q9Pstjdd8zVwEECMAZXNSdyxuyz1HXdVFV1dkeqytAAAEC4KKOIzAMQ1RVFXVdGwxzFRAgAOcjSZLI89wd9iOyXq9Hu8/jR/GRJImBAAQIwDkoikKAHIGmaaKqqlHv8/jRHAUQIABndHFXVZWB+CB938dqtRKBAgQQIADjkKZppGnqzvuBDcMQm83GIQA/OT8BBAjAGSmKwoXwAW2329hsNvZ5/OTcBBAgAGdmMpkIkANo2zZWq5XVpnfOTQABAnBm0jT1VvQ96vs+qqqKpmkMxjtkWebxK0CAAJyrsiwFyI4Nw/D2uBW/NicBBAjAGV/sOQ1rd+q6jqqq7PMQIAACBOB7kiSJsiy9ffsfats2qqqymrSD+PDyQUCAAJy5q6srAfKL+r6P9Xpt/HY4FwEECMCZy/M88jz3Urx3eN3n8fT05HGrHc9DAAECMAJXV1cC5CfVdR3r9dqxunuYgwACBGAkyrJ0Uf03uq6LqqqE2h6kaWrzOSBAAMbm5uYmVquVgfgvwzBEVVX2eex57gEIEICRsQryv9brtX0ee2b1AxAgACNmFeR3bdvGarUSYweacwACBGCkxr4K0vd9rFYr+zwOxOoHIEAAGOUqyDAMsdlsYrvdmgAHnmsAAgRg5MqyjKenp9GsAmy329hsNvZ5HFie51Y/gFFKDAHA/xrDnem2bePLly9RVZX4MMcADsYKCMB3vN6dPsejZ/u+j6qqomkaH/QHKcvSW88BAQLA/zedTuP5+flsVgeGYXh73IqPkyRJTKdTAwGM93vQEAD89YXi7e3tWfxd6rqO3377TXwcgdvb20gSP7/AeFkBAfiBoigiz/OT3ZDetm2s12vH6h6JPM+jKAoDAYyaWzAAf2M2m53cHetv377FarWKf//73+LjWH5wkyRms5mBAHwfGgKAH0vT9OQexeq67iw30J+y29vbSNPUQAACxBAA/L2iKDw6g/kDIEAADscdbH7FKa6gAQgQgGP4wkySmM/nBoJ3mc/nTr0CECAAvybLMhuJ+Wmz2SyyLDMQAAIE4NeVZRllWRoIzBMAAQJwGO5s8yNWygAECMDOff78WYTw3fj4/PmzgQAQIAA7/gJNkri9vbXBGHMCQIAAHMbr3W4XnCRJYlUMQIAAiBDEB4AAATjDCJlOpwZipKbTqfgAECAAh1WWpZOPRmg2mzluF+AdLgwBwG4jJCKiqqoYhsGAnLEkSWI6nYoPgPd+fxoCgN1HiD0h5x8fnz9/Fh8AAgTgONiYfv7xYc8HgAABOMoIcaHqMwVAgAC4YOVd8jz3WQIIEIAT+KJNklgul/YLnLCyLGOxWHikDkCAAJyO2WzmmF6fG8DoOYYX4IDKsoyLi4t4eHiIvu8NyBFL0zTm87lHrgB2zAoIwIFlWRbL5TKKojAYR6ooilgul+IDYA+sgAB8gCRJYj6fR9M08fj46KWFR/S53N7eikMAAQJwnoqiiCzLYrVaRdu2BuQD5Xkes9ks0jQ1GAACBOB8pWkai8XCasgHseoBIEAARqkoisjzPKqqirquDcgBlGUZ0+nU8boAAgRgnJIkidlsFldXV7Ferz2WtSd5nsd0OrXJHECAAPB6gbxYLKKu61iv147s3ZE0TWM6nXrcCkCAAPA9ZVlGWZZCZAfhcXNz4230AAIEACEiPAAECABHHyJPT0/2iPyFPM/j6upKeAAIEAB2GSJt28bT05NTs/40LpPJxOZyAAECwD7kef52olNd11HXdXRdN6oxyLLsLcgcpwsgQAA4gCRJYjKZxGQyib7vY7vdRtM0Z7tXJE3TKIoiJpOJN5cDCBAAPvrifDqdxnQ6jb7vo2maaJrm5PeL5HkeRVFEURSiA0CAAHCsMfK6MjIMQ7Rt+/bn2B/VyrLs7RGzPM89XgUgQAA4JUmSvK0gvGrbNp6fn+Pl5SX6vv+wKMmyLNI0jYuLi7i8vIw8z31gAAIEgHPzurrwZ13Xxbdv3+L5+fktUiIi+r7/5T0laZq+PTb1+t+7vLyMT58+ObEKQIAAMGavQfB3qxDDMMTLy8v3f1wuLjwyBYAAAWB3kiTxqBQA7//9MAQAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAAAAQIAACBAAAAAAQIAACBAAAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAABAgAAAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAgAABAAAQIAAAgAABAAAQIAAAgAABAAAECAAAgAABAAAECAAAgAABAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAAIEAAAAABAgAACBAAAAABAgAACBAAAAABAgAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAAAgQAAECAAAAAAgQAAECAAAAAAgQAABAgAAAAAgQAABAgAAAAAgQAABAgAACAAAEAABAgAACAAAEAABAgAACAAAEAAASIIQAAAAQIAAAgQAAAAAQIAAAgQAAAAAQIAAAgQAAAAAECAAAgQAAAAAECAAAgQAAAAAECAAAIEAAAAAECAAAIEAAAAAECAAAIEAAAQIAAAAAIEAAAQIAAAAAIEAAAQIAAAAACBAAAQIAAAAACBAAAQIAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAAACBAAAECAAAIAAAQAAECAAAIAAAQAAECAAAIAAAQAABAgAAIAAAQAABAgAAIAAAQAABAgAACBAAAAAdu0iIqKqKiMBAADs3f8NAFFjCf5mB+leAAAAAElFTkSuQmCC";
    function pt() {
        for (var t = 0, e = 0, r = arguments.length; e < r; e++)
            t += arguments[e].length;
        var n = Array(t)
          , a = 0;
        for (e = 0; e < r; e++)
            for (var i = arguments[e], o = 0, s = i.length; o < s; o++,
            a++)
                n[a] = i[o];
        return n
    }
    function ut(t, e, r) {
        return "string" != typeof t || isNaN(Number(t)) || (t = Number(t)),
        "number" == typeof t && t < 100 ? mt(t) : "number" == typeof t && 100 <= t ? t : "string" == typeof t && -1 < t.indexOf("%") ? e && "X" === e ? Math.round(parseFloat(t) / 100 * r.width) : e && "Y" === e ? Math.round(parseFloat(t) / 100 * r.height) : Math.round(parseFloat(t) / 100 * r.width) : 0
    }
    function ft(t) {
        return t.replace(/[xy]/g, function(t) {
            var e = 16 * Math.random() | 0;
            return ("x" === t ? e : 3 & e | 8).toString(16)
        })
    }
    function dt() {
        for (var r = {}, t = function(t) {
            var e = n[t];
            e && Object.keys(e).forEach(function(t) {
                r[t] = e[t]
            })
        }, n = arguments, e = 0; e <= arguments.length; e++)
            t(e);
        return r
    }
    function ht(t) {
        return void 0 === t || null == t ? "" : t.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    }
    function mt(t) {
        return "number" == typeof t && 100 < t ? t : ("string" == typeof t && (t = Number(t.replace(/in*/gi, ""))),
        Math.round(L * t))
    }
    function gt(t) {
        var e = Number(t) || 0;
        return isNaN(e) ? 0 : Math.round(e * g)
    }
    function At(t) {
        return 6e4 * (360 < (t = t || 0) ? t - 360 : t)
    }
    function vt(t) {
        var e = t.toString(16);
        return 1 === e.length ? "0" + e : e
    }
    function yt(t, e, r) {
        return (vt(t) + vt(e) + vt(r)).toUpperCase()
    }
    function bt(t, e) {
        var r = (t || "").replace("#", "")
          , n = o.test(r);
        n || r === j.background1 || r === j.background2 || r === j.text1 || r === j.text2 || r === j.accent1 || r === j.accent2 || r === j.accent3 || r === j.accent4 || r === j.accent5 || r === j.accent6 || (console.warn('"' + r + '" is not a valid scheme color or hexa RGB! "' + b + "\" is used as a fallback. Pass 6-digit RGB or 'pptx.SchemeColor' values"),
        r = b);
        var a = n ? "srgbClr" : "schemeClr"
          , i = 'val="' + (n ? r.toUpperCase() : r) + '"';
        return e ? "<a:" + a + " " + i + ">" + e + "</a:" + a + ">" : "<a:" + a + " " + i + "/>"
    }
    function xt(t, e) {
        var r = ""
          , n = "solid"
          , a = ""
          , i = "";
        if (e && "string" == typeof e && (i += "<p:bg><p:bgPr>" + xt(e.replace("#", "")) + "<a:effectLst/></p:bgPr></p:bg>"),
        t)
            switch ("string" == typeof t ? r = t : (t.type && (n = t.type),
            t.color && (r = t.color),
            t.alpha && (a += '<a:alpha val="' + (100 - t.alpha) + '000"/>'),
            t.transparency && (a += '<a:alpha val="' + (100 - t.transparency) + '000"/>')),
            n) {
            case "solid":
                i += "<a:solidFill>" + bt(r, a) + "</a:solidFill>";
                break;
            default:
                i += ""
            }
        return i
    }
    function wt(t) {
        return t._rels.length + t._relsChart.length + t._relsMedia.length + 1
    }
    function _t(l, c, p, t) {
        void 0 === l && (l = []),
        void 0 === c && (c = {});
        var e, u = C, f = 0, d = 1 * L, r = 0, h = [{
            rows: []
        }];
        if (c.verbose && (console.log("-- VERBOSE MODE ----------------------------------"),
        console.log(".. (PARAMETERS)"),
        console.log("presLayout.height ......... = " + p.height / L),
        console.log("tabOpts.h ................. = " + c.h),
        console.log("tabOpts.w ................. = " + c.w),
        console.log("tabOpts.colW .............. = " + c.colW),
        console.log("tabOpts.slideMargin ....... = " + (c.slideMargin || "")),
        console.log(".. (/PARAMETERS)")),
        c.slideMargin || 0 === c.slideMargin || (c.slideMargin = C[0]),
        t && void 0 !== t._margin ? Array.isArray(t._margin) ? u = t._margin : isNaN(Number(t._margin)) || (u = [Number(t._margin), Number(t._margin), Number(t._margin), Number(t._margin)]) : !c.slideMargin && 0 !== c.slideMargin || (Array.isArray(c.slideMargin) ? u = c.slideMargin : isNaN(c.slideMargin) || (u = [c.slideMargin, c.slideMargin, c.slideMargin, c.slideMargin])),
        c.verbose && console.log("arrInchMargins ......... = " + u.toString()),
        (l[0] || []).forEach(function(t) {
            var e = (t = t || {
                _type: et.tablecell
            }).options || null;
            r += Number(e && e.colspan ? e.colspan : 1)
        }),
        c.verbose && console.log("numCols ................ = " + r),
        !c.w && c.colW && (Array.isArray(c.colW) ? c.colW.forEach(function(t) {
            "number" != typeof c.w ? c.w = 0 + t : c.w += t
        }) : c.w = c.colW * r),
        e = "number" == typeof c.w ? mt(c.w) : p.width - mt(("number" == typeof c.x ? c.x : u[1]) + u[3]),
        c.verbose && console.log("emuSlideTabW (in) ...... = " + (e / L).toFixed(1)),
        !c.colW || !Array.isArray(c.colW))
            if (c.colW && !isNaN(Number(c.colW))) {
                var n = [];
                (l[0] || []).forEach(function() {
                    return n.push(c.colW)
                }),
                c.colW = [],
                n.forEach(function(t) {
                    Array.isArray(c.colW) && c.colW.push(t)
                })
            } else {
                c.colW = [];
                for (var a = 0; a < r; a++)
                    c.colW.push(e / L / r)
            }
        for (var m = 0, i = function() {
            var a = l.shift();
            m++;
            var i = 0
              , o = []
              , e = 0
              , r = 0
              , t = h[h.length - 1]
              , n = [];
            a.forEach(function(t) {
                n.push({
                    type: et.tablecell,
                    text: "",
                    options: t.options
                }),
                t.options.margin && t.options.margin[0] && gt(t.options.margin[0]) > e ? e = gt(t.options.margin[0]) : c.margin && c.margin[0] && gt(c.margin[0]) > e && (e = gt(c.margin[0])),
                t.options.margin && t.options.margin[2] && gt(t.options.margin[2]) > r ? r = gt(t.options.margin[2]) : c.margin && c.margin[2] && gt(c.margin[2]) > r && (r = gt(c.margin[2]))
            }),
            d = c.h && "number" == typeof c.h ? c.h : p.height - mt(u[0] + u[2]) - (c.y && "number" == typeof c.y ? c.y : 0),
            c.verbose && console.log("emuSlideTabH (in) ...... = " + (d / L).toFixed(1)),
            1 < h.length && "number" == typeof c.autoPageSlideStartY ? d = c.h && "number" == typeof c.h ? c.h : p.height - mt(c.autoPageSlideStartY + u[2]) : 1 < h.length && "number" == typeof c.newSlideStartY ? d = c.h && "number" == typeof c.h ? c.h : p.height - mt(c.newSlideStartY + u[2]) : 1 < h.length && "number" == typeof c.y ? (d = p.height - mt((c.y / L < u[0] ? c.y / L : u[0]) + u[2]),
            "number" == typeof c.h && d < c.h && (d = c.h)) : "number" == typeof c.h && "number" == typeof c.y && (d = c.h ? c.h : p.height - mt((c.y / L || u[0]) + u[2])),
            a.forEach(function(r, n) {
                var t = {
                    _type: et.tablecell,
                    _lines: [],
                    _lineHeight: mt((r.options && r.options.fontSize ? r.options.fontSize : c.fontSize ? c.fontSize : x) * (v + (c.autoPageLineWeight ? c.autoPageLineWeight : 0)) / 100),
                    text: "",
                    options: r.options
                };
                t.options.rowspan && (t._lineHeight = 0),
                t.options.autoPageCharWeight = c.autoPageCharWeight ? c.autoPageCharWeight : null;
                var e = c.colW[n];
                r.options.colspan && Array.isArray(c.colW) && (e = c.colW.filter(function(t, e) {
                    return n <= e && e < e + r.options.colspan
                }).reduce(function(t, e) {
                    return t + e
                })),
                t._lines = function(t, e) {
                    var r = 2.2 + (t.options && t.options.autoPageCharWeight ? t.options.autoPageCharWeight : 0)
                      , n = e * L / ((t.options && t.options.fontSize || x) / r)
                      , a = []
                      , i = "";
                    return t.text && 0 === t.text.toString().trim().length ? [" "] : ((t.text || "").toString().trim().split("\n").forEach(function(t) {
                        t.split(" ").forEach(function(t) {
                            i.length + t.length + 1 < n ? i += t + " " : (i && a.push(i),
                            i = t + " ")
                        }),
                        i && a.push(i.trim() + A),
                        i = ""
                    }),
                    a[a.length - 1] = a[a.length - 1].trim(),
                    a)
                }(r, e / g),
                o.push(t)
            }),
            c.verbose && console.log("- SLIDE [" + h.length + "]: ROW [" + m + "]: maxCellMarTopEmu=" + e + " / maxCellMarBtmEmu=" + r),
            (f += e + r) + i <= d && t.rows.push(n),
            c.verbose && console.log("- SLIDE [" + h.length + "]: ROW [" + m + "]: START...");
            for (var s = function() {
                if (d < f + i) {
                    if (c.verbose && console.log("** NEW SLIDE CREATED ***************************************** (why?): " + (f / L).toFixed(2) + "+" + (i / L).toFixed(2) + " > " + d / L),
                    h.push({
                        rows: []
                    }),
                    f = 0,
                    (c.addHeaderToEach || c.autoPageRepeatHeader) && c._arrObjTabHeadRows) {
                        var e = [];
                        o.forEach(function(t) {
                            e.push({
                                type: et.tablecell,
                                text: t._lines.join(""),
                                options: t.options
                            })
                        }),
                        l.unshift(e);
                        var r = [];
                        return c._arrObjTabHeadRows.forEach(function(t) {
                            var e = [];
                            t.forEach(function(t) {
                                return e.push(t)
                            }),
                            r.push(e)
                        }),
                        l = pt(r, l),
                        "break"
                    }
                    var t = h[h.length - 1]
                      , n = [];
                    a.forEach(function(t) {
                        n.push({
                            type: et.tablecell,
                            text: "",
                            options: t.options
                        })
                    }),
                    t.rows.push(n)
                }
                o.forEach(function(t, e) {
                    if (0 < t._lines.length) {
                        var r = h[h.length - 1]
                          , n = r.rows[r.rows.length - 1][e]
                          , a = n.text.toString();
                        n.text += (0 < a.length && !RegExp(/\n$/g).test(a) ? A : "").replace(/[\r\n]+$/g, A) + t._lines.shift(),
                        t._lineHeight > i && (i = t._lineHeight)
                    }
                }),
                f += i,
                c.verbose && console.log("- SLIDE [" + h.length + "]: ROW [" + m + "]: one line added ... emuTabCurrH = " + (f / L).toFixed(2))
            }; 0 < o.filter(function(t) {
                return 0 < t._lines.length
            }).length; ) {
                if ("break" === s())
                    break
            }
            c.verbose && console.log("- SLIDE [" + h.length + "]: ROW [" + m + "]: ...COMPLETE ...... emuTabCurrH = " + (f / L).toFixed(2) + " ( emuSlideTabH = " + (d / L).toFixed(2) + " )")
        }; 0 < l.length; )
            i();
        return c.verbose && (console.log("\n|================================================|\n| FINAL: tableRowSlides.length = " + h.length),
        console.log(h),
        console.log("|================================================|\n\n")),
        h
    }
    var Ct = {
        cover: function(t, e) {
            var r = t.h / t.w
              , n = r < e.h / e.w
              , a = n ? e.h / r : e.w
              , i = n ? e.h : e.w * r
              , o = Math.round(5e4 * (1 - e.w / a))
              , s = Math.round(5e4 * (1 - e.h / i));
            return '<a:srcRect l="' + o + '" r="' + o + '" t="' + s + '" b="' + s + '"/><a:stretch/>'
        },
        contain: function(t, e) {
            var r = t.h / t.w
              , n = r < e.h / e.w
              , a = n ? e.w : e.h / r
              , i = n ? e.w * r : e.h
              , o = Math.round(5e4 * (1 - e.w / a))
              , s = Math.round(5e4 * (1 - e.h / i));
            return '<a:srcRect l="' + o + '" r="' + o + '" t="' + s + '" b="' + s + '"/><a:stretch/>'
        },
        crop: function(t, e) {
            var r = e.x
              , n = t.w - (e.x + e.w)
              , a = e.y
              , i = t.h - (e.y + e.h);
            return '<a:srcRect l="' + Math.round(r / t.w * 1e5) + '" r="' + Math.round(n / t.w * 1e5) + '" t="' + Math.round(a / t.h * 1e5) + '" b="' + Math.round(i / t.h * 1e5) + '"/><a:stretch/>'
        }
    };
    function St(P) {
        var E = P._name ? '<p:cSld name="' + P._name + '">' : "<p:cSld>"
          , T = 1;
        return P.bkgd ? E += xt(null, P.bkgd) : !P.bkgd && P._name && P._name === r && (E += '<p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg>'),
        P._bkgdImgRid && (E += '<p:bg><p:bgPr><a:blipFill dpi="0" rotWithShape="1"><a:blip r:embed="rId' + P._bkgdImgRid + '"><a:lum/></a:blip><a:srcRect/><a:stretch><a:fillRect/></a:stretch></a:blipFill><a:effectLst/></p:bgPr></p:bg>'),
        E += "<p:spTree>",
        E += '<p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>',
        E += '<p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/>',
        E += '<a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>',
        P._slideObjects.forEach(function(a, t) {
            var e, r = 0, n = 0, i = ut("75%", "X", P._presLayout), o = 0, s = "";
            switch (void 0 !== P._slideLayout && void 0 !== P._slideLayout._slideObjects && a.options && a.options.placeholder && (e = P._slideLayout._slideObjects.filter(function(t) {
                return t.options.placeholder === a.options.placeholder
            })[0]),
            a.options = a.options || {},
            void 0 !== a.options.x && (r = ut(a.options.x, "X", P._presLayout)),
            void 0 !== a.options.y && (n = ut(a.options.y, "Y", P._presLayout)),
            void 0 !== a.options.w && (i = ut(a.options.w, "X", P._presLayout)),
            void 0 !== a.options.h && (o = ut(a.options.h, "Y", P._presLayout)),
            e && (!e.options.x && 0 !== e.options.x || (r = ut(e.options.x, "X", P._presLayout)),
            !e.options.y && 0 !== e.options.y || (n = ut(e.options.y, "Y", P._presLayout)),
            !e.options.w && 0 !== e.options.w || (i = ut(e.options.w, "X", P._presLayout)),
            !e.options.h && 0 !== e.options.h || (o = ut(e.options.h, "Y", P._presLayout))),
            a.options.flipH && (s += ' flipH="1"'),
            a.options.flipV && (s += ' flipV="1"'),
            a.options.rotate && (s += ' rot="' + At(a.options.rotate) + '"'),
            a._type) {
            case et.table:
                var l, c = {}, p = a.arrTabRows, u = a.options, f = 0, d = 0;
                p[0].forEach(function(t) {
                    l = t.options || null,
                    f += l && l.colspan ? Number(l.colspan) : 1
                });
                var h = '<p:graphicFrame>  <p:nvGraphicFramePr>    <p:cNvPr id="' + (T * P._slideNum + 1) + '" name="Table ' + T * P._slideNum + '"/>    <p:cNvGraphicFramePr><a:graphicFrameLocks noGrp="1"/></p:cNvGraphicFramePr>    <p:nvPr><p:extLst><p:ext uri="{D42A27DB-BD31-4B8C-83A1-F6EECF244321}"><p14:modId xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1579011935"/></p:ext></p:extLst></p:nvPr>  </p:nvGraphicFramePr>  <p:xfrm>    <a:off x="' + (r || (0 === r ? 0 : L)) + '" y="' + (n || (0 === n ? 0 : L)) + '"/>    <a:ext cx="' + (i || (0 === i ? 0 : L)) + '" cy="' + (o || L) + '"/>  </p:xfrm>  <a:graphic>    <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">      <a:tbl>        <a:tblPr/>';
                if (Array.isArray(u.colW)) {
                    h += "<a:tblGrid>";
                    for (var m = 0; m < f; m++)
                        h += '<a:gridCol w="' + Math.round(mt(u.colW[m]) || ("number" == typeof a.options.w ? a.options.w : 1) / f) + '"/>';
                    h += "</a:tblGrid>"
                } else {
                    d = u.colW ? u.colW : L,
                    a.options.w && !u.colW && (d = Math.round(("number" == typeof a.options.w ? a.options.w : 1) / f)),
                    h += "<a:tblGrid>";
                    for (var g = 0; g < f; g++)
                        h += '<a:gridCol w="' + d + '"/>';
                    h += "</a:tblGrid>"
                }
                p.forEach(function(t, o) {
                    c[o] || (c[o] = {}),
                    t.forEach(function(t, e) {
                        for (var r = 0; e + r < f; r++) {
                            var n = e + r;
                            if (!c[o][n]) {
                                if ((c[o][n] = t) && t.options && t.options.colspan && !isNaN(Number(t.options.colspan)))
                                    for (var a = 1; a < Number(t.options.colspan); a++)
                                        c[o][n + a] = {
                                            _hmerge: !0,
                                            text: "hmerge"
                                        };
                                else if (t && t.options && t.options.rowspan && !isNaN(Number(t.options.rowspan)))
                                    for (var i = 1; i < Number(t.options.rowspan); i++)
                                        c[o + i] || (c[o + i] = {}),
                                        c[o + i][n] = {
                                            _vmerge: !0,
                                            text: "vmerge"
                                        };
                                break
                            }
                        }
                    })
                }),
                Object.entries(c).forEach(function(t) {
                    var e = t[0]
                      , r = t[1]
                      , n = 0;
                    Array.isArray(u.rowH) && u.rowH[e] ? n = mt(Number(u.rowH[e])) : u.rowH && !isNaN(Number(u.rowH)) ? n = mt(Number(u.rowH)) : (a.options.cy || a.options.h) && (n = Math.round((a.options.h ? mt(a.options.h) : "number" == typeof a.options.cy ? a.options.cy : 1) / p.length)),
                    h += '<a:tr h="' + n + '">',
                    Object.entries(r).forEach(function(t) {
                        t[0];
                        var e = t[1];
                        if (!e._hmerge) {
                            var r = e.options || {};
                            e.options = r,
                            ["align", "bold", "border", "color", "fill", "fontFace", "fontSize", "margin", "underline", "valign"].forEach(function(t) {
                                u[t] && !r[t] && 0 !== r[t] && (r[t] = u[t])
                            });
                            var n = r.valign ? ' anchor="' + r.valign.replace(/^c$/i, "ctr").replace(/^m$/i, "ctr").replace("center", "ctr").replace("middle", "ctr").replace("top", "t").replace("btm", "b").replace("bottom", "b") + '"' : ""
                              , a = r.colspan ? ' gridSpan="' + r.colspan + '"' : ""
                              , i = r.rowspan ? ' rowSpan="' + r.rowspan + '"' : ""
                              , o = e._optImp && e._optImp.fill && e._optImp.fill.color ? e._optImp.fill.color : e._optImp && e._optImp.fill && "string" == typeof e._optImp.fill ? e._optImp.fill : ""
                              , s = (o = o || r.fill && r.fill.color ? r.fill.color : r.fill && "string" == typeof r.fill ? r.fill : "") ? "<a:solidFill>" + bt(o) + "</a:solidFill>" : ""
                              , l = 0 === r.margin || r.margin ? r.margin : k;
                            Array.isArray(l) || "number" != typeof l || (l = [l, l, l, l]);
                            var c = ' marL="' + gt(l[3]) + '" marR="' + gt(l[1]) + '" marT="' + gt(l[0]) + '" marB="' + gt(l[2]) + '"';
                            if (e._vmerge)
                                h += '<a:tc vMerge="1"><a:tcPr/></a:tc>';
                            else if (h += "<a:tc" + a + i + ">" + Lt(e) + "<a:tcPr" + c + n + ">",
                            r.border && Array.isArray(r.border) && [{
                                idx: 3,
                                name: "lnL"
                            }, {
                                idx: 1,
                                name: "lnR"
                            }, {
                                idx: 0,
                                name: "lnT"
                            }, {
                                idx: 2,
                                name: "lnB"
                            }].forEach(function(t) {
                                "none" !== r.border[t.idx].type ? (h += "<a:" + t.name + ' w="' + gt(r.border[t.idx].pt) + '" cap="flat" cmpd="sng" algn="ctr">',
                                h += "<a:solidFill>" + bt(r.border[t.idx].color) + "</a:solidFill>",
                                h += '<a:prstDash val="' + ("dash" === r.border[t.idx].type ? "sysDash" : "solid") + '"/><a:round/><a:headEnd type="none" w="med" len="med"/><a:tailEnd type="none" w="med" len="med"/>',
                                h += "</a:" + t.name + ">") : h += "<a:" + t.name + ' w="0" cap="flat" cmpd="sng" algn="ctr"><a:noFill/></a:' + t.name + ">"
                            }),
                            h += s,
                            h += "  </a:tcPr>",
                            h += " </a:tc>",
                            r.colspan)
                                for (var p = 1; p < Number(r.colspan); p++)
                                    h += '<a:tc hMerge="1"><a:tcPr/></a:tc>'
                        }
                    }),
                    h += "</a:tr>"
                }),
                h += "      </a:tbl>",
                h += "    </a:graphicData>",
                h += "  </a:graphic>",
                E += h += "</p:graphicFrame>",
                T++;
                break;
            case et.text:
            case et.placeholder:
                var A = a.options.shapeName ? ht(a.options.shapeName) : "Object" + (t + 1);
                a.options.line || 0 !== o || (o = .3 * L),
                a.options.margin && Array.isArray(a.options.margin) ? (a.options._bodyProp.lIns = gt(a.options.margin[0] || 0),
                a.options._bodyProp.rIns = gt(a.options.margin[1] || 0),
                a.options._bodyProp.bIns = gt(a.options.margin[2] || 0),
                a.options._bodyProp.tIns = gt(a.options.margin[3] || 0)) : "number" == typeof a.options.margin && (a.options._bodyProp.lIns = gt(a.options.margin),
                a.options._bodyProp.rIns = gt(a.options.margin),
                a.options._bodyProp.bIns = gt(a.options.margin),
                a.options._bodyProp.tIns = gt(a.options.margin)),
                E += "<p:sp>",
                E += '<p:nvSpPr><p:cNvPr id="' + (t + 2) + '" name="' + A + '">',
                a.options.hyperlink && a.options.hyperlink.url && (E += '<a:hlinkClick r:id="rId' + a.options.hyperlink._rId + '" tooltip="' + (a.options.hyperlink.tooltip ? ht(a.options.hyperlink.tooltip) : "") + '"/>'),
                a.options.hyperlink && a.options.hyperlink.slide && (E += '<a:hlinkClick r:id="rId' + a.options.hyperlink._rId + '" tooltip="' + (a.options.hyperlink.tooltip ? ht(a.options.hyperlink.tooltip) : "") + '" action="ppaction://hlinksldjump"/>'),
                E += "</p:cNvPr>",
                E += "<p:cNvSpPr" + (a.options && a.options.isTextBox ? ' txBox="1"/>' : "/>"),
                E += "<p:nvPr>" + ("placeholder" === a._type ? kt(a) : kt(e)) + "</p:nvPr>",
                E += "</p:nvSpPr><p:spPr>",
                E += "<a:xfrm" + s + ">",
                E += '<a:off x="' + r + '" y="' + n + '"/>',
                E += '<a:ext cx="' + i + '" cy="' + o + '"/></a:xfrm>',
                E += '<a:prstGeom prst="' + a.shape + '"><a:avLst>' + (a.options.rectRadius ? '<a:gd name="adj" fmla="val ' + Math.round(a.options.rectRadius * L * 1e5 / Math.min(i, o)) + '"/>' : "") + "</a:avLst></a:prstGeom>",
                E += a.options.fill ? xt(a.options.fill) : "<a:noFill/>",
                a.options.line && (E += a.options.line.width ? '<a:ln w="' + gt(a.options.line.width) + '">' : "<a:ln>",
                E += xt(a.options.line.color),
                a.options.line.dashType && (E += '<a:prstDash val="' + a.options.line.dashType + '"/>'),
                a.options.line.beginArrowType && (E += '<a:headEnd type="' + a.options.line.beginArrowType + '"/>'),
                a.options.line.endArrowType && (E += '<a:tailEnd type="' + a.options.line.endArrowType + '"/>'),
                E += "</a:ln>"),
                a.options.shadow && (a.options.shadow.type = a.options.shadow.type || "outer",
                a.options.shadow.blur = gt(a.options.shadow.blur || 8),
                a.options.shadow.offset = gt(a.options.shadow.offset || 4),
                a.options.shadow.angle = Math.round(6e4 * (a.options.shadow.angle || 270)),
                a.options.shadow.opacity = Math.round(1e5 * (a.options.shadow.opacity || .75)),
                a.options.shadow.color = a.options.shadow.color || R.color,
                E += "<a:effectLst>",
                E += "<a:" + a.options.shadow.type + 'Shdw sx="100000" sy="100000" kx="0" ky="0" ',
                E += ' algn="bl" rotWithShape="0" blurRad="' + a.options.shadow.blur + '" ',
                E += ' dist="' + a.options.shadow.offset + '" dir="' + a.options.shadow.angle + '">',
                E += '<a:srgbClr val="' + a.options.shadow.color + '">',
                E += '<a:alpha val="' + a.options.shadow.opacity + '"/></a:srgbClr>',
                E += "</a:outerShdw>",
                E += "</a:effectLst>"),
                E += "</p:spPr>",
                E += Lt(a),
                E += "</p:sp>";
                break;
            case et.image:
                var v = a.options.sizing
                  , y = a.options.rounding
                  , b = i
                  , x = o;
                if (E += "<p:pic>",
                E += "  <p:nvPicPr>",
                E += '    <p:cNvPr id="' + (t + 2) + '" name="Object ' + (t + 1) + '" descr="' + ht(a.image) + '">',
                a.hyperlink && a.hyperlink.url && (E += '<a:hlinkClick r:id="rId' + a.hyperlink._rId + '" tooltip="' + (a.hyperlink.tooltip ? ht(a.hyperlink.tooltip) : "") + '"/>'),
                a.hyperlink && a.hyperlink.slide && (E += '<a:hlinkClick r:id="rId' + a.hyperlink._rId + '" tooltip="' + (a.hyperlink.tooltip ? ht(a.hyperlink.tooltip) : "") + '" action="ppaction://hlinksldjump"/>'),
                E += "    </p:cNvPr>",
                E += '    <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>',
                E += "    <p:nvPr>" + kt(e) + "</p:nvPr>",
                E += "  </p:nvPicPr>",
                E += "<p:blipFill>",
                (P._relsMedia || []).filter(function(t) {
                    return t.rId === a.imageRid
                })[0] && "svg" === (P._relsMedia || []).filter(function(t) {
                    return t.rId === a.imageRid
                })[0].extn ? (E += '<a:blip r:embed="rId' + (a.imageRid - 1) + '">',
                E += " <a:extLst>",
                E += '  <a:ext uri="{96DAC541-7B7A-43D3-8B79-37D633B846F1}">',
                E += '   <asvg:svgBlip xmlns:asvg="http://schemas.microsoft.com/office/drawing/2016/SVG/main" r:embed="rId' + a.imageRid + '"/>',
                E += "  </a:ext>",
                E += " </a:extLst>",
                E += "</a:blip>") : E += '<a:blip r:embed="rId' + a.imageRid + '"/>',
                v && v.type) {
                    var w = v.w ? ut(v.w, "X", P._presLayout) : i
                      , _ = v.h ? ut(v.h, "Y", P._presLayout) : o
                      , C = ut(v.x || 0, "X", P._presLayout)
                      , S = ut(v.y || 0, "Y", P._presLayout);
                    E += Ct[v.type]({
                        w: b,
                        h: x
                    }, {
                        w: w,
                        h: _,
                        x: C,
                        y: S
                    }),
                    b = w,
                    x = _
                } else
                    E += "  <a:stretch><a:fillRect/></a:stretch>";
                E += "</p:blipFill>",
                E += "<p:spPr>",
                E += " <a:xfrm" + s + ">",
                E += '  <a:off x="' + r + '" y="' + n + '"/>',
                E += '  <a:ext cx="' + b + '" cy="' + x + '"/>',
                E += " </a:xfrm>",
                E += ' <a:prstGeom prst="' + (y ? "ellipse" : "rect") + '"><a:avLst/></a:prstGeom>',
                E += "</p:spPr>",
                E += "</p:pic>";
                break;
            case et.media:
                "online" === a.mtype ? (E += "<p:pic>",
                E += " <p:nvPicPr>",
                E += ' <p:cNvPr id="' + (a.mediaRid + 2) + '" name="Picture' + (t + 1) + '"/>',
                E += " <p:cNvPicPr/>",
                E += " <p:nvPr>",
                E += '  <a:videoFile r:link="rId' + a.mediaRid + '"/>',
                E += " </p:nvPr>",
                E += " </p:nvPicPr>",
                E += ' <p:blipFill><a:blip r:embed="rId' + (a.mediaRid + 1) + '"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>') : (E += "<p:pic>",
                E += " <p:nvPicPr>",
                E += ' <p:cNvPr id="' + (a.mediaRid + 2) + '" name="' + a.media.split("/").pop().split(".").shift() + '"><a:hlinkClick r:id="" action="ppaction://media"/></p:cNvPr>',
                E += ' <p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr>',
                E += " <p:nvPr>",
                E += '  <a:videoFile r:link="rId' + a.mediaRid + '"/>',
                E += "  <p:extLst>",
                E += '   <p:ext uri="{DAA4B4D4-6D71-4841-9C94-3DE7FCFB9230}">',
                E += '    <p14:media xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" r:embed="rId' + (a.mediaRid + 1) + '"/>',
                E += "   </p:ext>",
                E += "  </p:extLst>",
                E += " </p:nvPr>",
                E += " </p:nvPicPr>",
                E += ' <p:blipFill><a:blip r:embed="rId' + (a.mediaRid + 2) + '"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>'),
                E += " <p:spPr>",
                E += "  <a:xfrm" + s + ">",
                E += '   <a:off x="' + r + '" y="' + n + '"/>',
                E += '   <a:ext cx="' + i + '" cy="' + o + '"/>',
                E += "  </a:xfrm>",
                E += '  <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>',
                E += " </p:spPr>",
                E += "</p:pic>";
                break;
            case et.chart:
                E += "<p:graphicFrame>",
                E += " <p:nvGraphicFramePr>",
                E += '   <p:cNvPr id="' + (t + 2) + '" name="Chart ' + (t + 1) + '"/>',
                E += "   <p:cNvGraphicFramePr/>",
                E += "   <p:nvPr>" + kt(e) + "</p:nvPr>",
                E += " </p:nvGraphicFramePr>",
                E += " <p:xfrm>",
                E += '  <a:off x="' + r + '" y="' + n + '"/>',
                E += '  <a:ext cx="' + i + '" cy="' + o + '"/>',
                E += " </p:xfrm>",
                E += ' <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">',
                E += '  <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">',
                E += '   <c:chart r:id="rId' + a.chartRid + '" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"/>',
                E += "  </a:graphicData>",
                E += " </a:graphic>",
                E += "</p:graphicFrame>";
                break;
            default:
                E += ""
            }
        }),
        P._slideNumberProps && (E += '<p:sp>  <p:nvSpPr>    <p:cNvPr id="25" name="Slide Number Placeholder 24"/>    <p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr>    <p:nvPr><p:ph type="sldNum" sz="quarter" idx="4294967295"/></p:nvPr>  </p:nvSpPr>  <p:spPr>    <a:xfrm>      <a:off x="' + ut(P._slideNumberProps.x, "X", P._presLayout) + '" y="' + ut(P._slideNumberProps.y, "Y", P._presLayout) + '"/>      <a:ext cx="' + (P._slideNumberProps.w ? ut(P._slideNumberProps.w, "X", P._presLayout) : 8e5) + '" cy="' + (P._slideNumberProps.h ? ut(P._slideNumberProps.h, "Y", P._presLayout) : 3e5) + '"/>    </a:xfrm>    <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>    <a:extLst><a:ext uri="{C572A759-6A51-4108-AA02-DFA0A04FC94B}"><ma14:wrappingTextBoxFlag val="0" xmlns:ma14="http://schemas.microsoft.com/office/mac/drawingml/2011/main"/></a:ext></a:extLst>  </p:spPr>',
        E += "<p:txBody>",
        E += "  <a:bodyPr/>",
        E += "  <a:lstStyle><a:lvl1pPr>",
        (P._slideNumberProps.fontFace || P._slideNumberProps.fontSize || P._slideNumberProps.color) && (E += '<a:defRPr sz="' + (P._slideNumberProps.fontSize ? Math.round(P._slideNumberProps.fontSize) : "12") + '00">',
        P._slideNumberProps.color && (E += xt(P._slideNumberProps.color)),
        P._slideNumberProps.fontFace && (E += '<a:latin typeface="' + P._slideNumberProps.fontFace + '"/><a:ea typeface="' + P._slideNumberProps.fontFace + '"/><a:cs typeface="' + P._slideNumberProps.fontFace + '"/>'),
        E += "</a:defRPr>"),
        E += "</a:lvl1pPr></a:lstStyle>",
        E += '<a:p><a:fld id="' + st + '" type="slidenum"><a:rPr lang="en-US"/><a:t></a:t></a:fld><a:endParaRPr lang="en-US"/></a:p>',
        E += "</p:txBody></p:sp>"),
        E += "</p:spTree>",
        E += "</p:cSld>"
    }
    function Pt(t, e) {
        var r = 0
          , n = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
        return t._rels.forEach(function(t) {
            r = Math.max(r, t.rId),
            -1 < t.type.toLowerCase().indexOf("hyperlink") ? "slide" === t.data ? n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slide' + t.Target + '.xml"/>' : n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + t.Target + '" TargetMode="External"/>' : -1 < t.type.toLowerCase().indexOf("notesSlide") && (n += '<Relationship Id="rId' + t.rId + '" Target="' + t.Target + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide"/>')
        }),
        (t._relsChart || []).forEach(function(t) {
            r = Math.max(r, t.rId),
            n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="' + t.Target + '"/>'
        }),
        (t._relsMedia || []).forEach(function(t) {
            r = Math.max(r, t.rId),
            -1 < t.type.toLowerCase().indexOf("image") ? n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="' + t.Target + '"/>' : -1 < t.type.toLowerCase().indexOf("audio") ? -1 < n.indexOf(' Target="' + t.Target + '"') ? n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.microsoft.com/office/2007/relationships/media" Target="' + t.Target + '"/>' : n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/audio" Target="' + t.Target + '"/>' : -1 < t.type.toLowerCase().indexOf("video") ? -1 < n.indexOf(' Target="' + t.Target + '"') ? n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.microsoft.com/office/2007/relationships/media" Target="' + t.Target + '"/>' : n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video" Target="' + t.Target + '"/>' : -1 < t.type.toLowerCase().indexOf("online") && (-1 < n.indexOf(' Target="' + t.Target + '"') ? n += '<Relationship Id="rId' + t.rId + '" Type="http://schemas.microsoft.com/office/2007/relationships/image" Target="' + t.Target + '"/>' : n += '<Relationship Id="rId' + t.rId + '" Target="' + t.Target + '" TargetMode="External" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/video"/>')
        }),
        e.forEach(function(t, e) {
            n += '<Relationship Id="rId' + (r + e + 1) + '" Type="' + t.type + '" Target="' + t.target + '"/>'
        }),
        n += "</Relationships>"
    }
    function Et(t, e) {
        var r = ""
          , n = ""
          , a = ""
          , i = e ? "a:lvl1pPr" : "a:pPr"
          , o = gt(p)
          , s = "<" + i + (t.options.rtlMode ? ' rtl="1" ' : "");
        if (t.options.align)
            switch (t.options.align) {
            case "left":
                s += ' algn="l"';
                break;
            case "right":
                s += ' algn="r"';
                break;
            case "center":
                s += ' algn="ctr"';
                break;
            case "justify":
                s += ' algn="just"';
                break;
            default:
                s += ""
            }
        if (t.options.lineSpacing && (n = '<a:lnSpc><a:spcPts val="' + 100 * t.options.lineSpacing + '"/></a:lnSpc>'),
        t.options.indentLevel && !isNaN(Number(t.options.indentLevel)) && 0 < t.options.indentLevel && (s += ' lvl="' + t.options.indentLevel + '"'),
        t.options.paraSpaceBefore && !isNaN(Number(t.options.paraSpaceBefore)) && 0 < t.options.paraSpaceBefore && (a += '<a:spcBef><a:spcPts val="' + 100 * t.options.paraSpaceBefore + '"/></a:spcBef>'),
        t.options.paraSpaceAfter && !isNaN(Number(t.options.paraSpaceAfter)) && 0 < t.options.paraSpaceAfter && (a += '<a:spcAft><a:spcPts val="' + 100 * t.options.paraSpaceAfter + '"/></a:spcAft>'),
        "object" == typeof t.options.bullet)
            if (t && t.options && t.options.bullet && t.options.bullet.indent && (o = gt(t.options.bullet.indent)),
            t.options.bullet.type)
                "number" === t.options.bullet.type.toString().toLowerCase() && (s += ' marL="' + (t.options.indentLevel && 0 < t.options.indentLevel ? o + o * t.options.indentLevel : o) + '" indent="-' + o + '"',
                r = '<a:buSzPct val="100000"/><a:buFont typeface="+mj-lt"/><a:buAutoNum type="' + (t.options.bullet.style || "arabicPeriod") + '" startAt="' + (t.options.bullet.numberStartAt || t.options.bullet.startAt || "1") + '"/>');
            else if (t.options.bullet.characterCode) {
                var l = "&#x" + t.options.bullet.characterCode + ";";
                !1 === /^[0-9A-Fa-f]{4}$/.test(t.options.bullet.characterCode) && (console.warn("Warning: `bullet.characterCode should be a 4-digit unicode charatcer (ex: 22AB)`!"),
                l = it.DEFAULT),
                s += ' marL="' + (t.options.indentLevel && 0 < t.options.indentLevel ? o + o * t.options.indentLevel : o) + '" indent="-' + o + '"',
                r = '<a:buSzPct val="100000"/><a:buChar char="' + l + '"/>'
            } else if (t.options.bullet.code) {
                l = "&#x" + t.options.bullet.code + ";";
                !1 === /^[0-9A-Fa-f]{4}$/.test(t.options.bullet.code) && (console.warn("Warning: `bullet.code should be a 4-digit hex code (ex: 22AB)`!"),
                l = it.DEFAULT),
                s += ' marL="' + (t.options.indentLevel && 0 < t.options.indentLevel ? o + o * t.options.indentLevel : o) + '" indent="-' + o + '"',
                r = '<a:buSzPct val="100000"/><a:buChar char="' + l + '"/>'
            } else
                s += ' marL="' + (t.options.indentLevel && 0 < t.options.indentLevel ? o + o * t.options.indentLevel : o) + '" indent="-' + o + '"',
                r = '<a:buSzPct val="100000"/><a:buChar char="' + it.DEFAULT + '"/>';
        else
            !0 === t.options.bullet ? (s += ' marL="' + (t.options.indentLevel && 0 < t.options.indentLevel ? o + o * t.options.indentLevel : o) + '" indent="-' + o + '"',
            r = '<a:buSzPct val="100000"/><a:buChar char="' + it.DEFAULT + '"/>') : !1 === t.options.bullet && (s += ' indent="0" marL="0"',
            r = "<a:buNone/>");
        return s += ">" + n + a + r,
        e && (s += Tt(t.options, !0)),
        s += "</" + i + ">"
    }
    function Tt(t, e) {
        var r = ""
          , n = e ? "a:defRPr" : "a:rPr";
        if (r += "<" + n + ' lang="' + (t.lang ? t.lang : "en-US") + '"' + (t.lang ? ' altLang="en-US"' : ""),
        r += t.fontSize ? ' sz="' + Math.round(t.fontSize) + '00"' : "",
        r += t.bold ? ' b="1"' : "",
        r += t.italic ? ' i="1"' : "",
        r += t.strike ? ' strike="sngStrike"' : "",
        r += t.underline || t.hyperlink ? ' u="sng"' : "",
        r += t.subscript ? ' baseline="-40000"' : t.superscript ? ' baseline="30000"' : "",
        r += t.charSpacing ? ' spc="' + 100 * t.charSpacing + '" kern="0"' : "",
        r += ' dirty="0">',
        (t.color || t.fontFace || t.outline) && (t.outline && "object" == typeof t.outline && (r += '<a:ln w="' + gt(t.outline.size || .75) + '">' + xt(t.outline.color || "FFFFFF") + "</a:ln>"),
        t.color && (r += xt(t.color)),
        t.glow && (r += "<a:effectLst>" + function(t, e) {
            var r = ""
              , n = dt(e, t);
            return r += '<a:glow rad="' + n.size * g + '">',
            r += bt(n.color, '<a:alpha val="' + 1e5 * n.opacity + '"/>'),
            r += "</a:glow>"
        }(t.glow, a) + "</a:effectLst>"),
        t.fontFace && (r += '<a:latin typeface="' + t.fontFace + '" pitchFamily="34" charset="0"/><a:ea typeface="' + t.fontFace + '" pitchFamily="34" charset="-122"/><a:cs typeface="' + t.fontFace + '" pitchFamily="34" charset="-120"/>')),
        t.hyperlink) {
            if ("object" != typeof t.hyperlink)
                throw new Error("ERROR: text `hyperlink` option should be an object. Ex: `hyperlink:{url:'https://github.com'}` ");
            if (!t.hyperlink.url && !t.hyperlink.slide)
                throw new Error("ERROR: 'hyperlink requires either `url` or `slide`'");
            t.hyperlink.url ? r += '<a:hlinkClick r:id="rId' + t.hyperlink._rId + '" invalidUrl="" action="" tgtFrame="" tooltip="' + (t.hyperlink.tooltip ? ht(t.hyperlink.tooltip) : "") + '" history="1" highlightClick="0" endSnd="0"/>' : t.hyperlink.slide && (r += '<a:hlinkClick r:id="rId' + t.hyperlink._rId + '" action="ppaction://hlinksldjump" tooltip="' + (t.hyperlink.tooltip ? ht(t.hyperlink.tooltip) : "") + '"/>')
        }
        return r += "</" + n + ">"
    }
    function Lt(n) {
        var a = n.options || {}
          , t = []
          , r = [];
        if (a && n._type !== et.tablecell && (void 0 === n.text || null === n.text))
            return "";
        var i = n._type === et.tablecell ? "<a:txBody>" : "<p:txBody>";
        i += function(t) {
            var e = "<a:bodyPr";
            return t && t._type === et.text && t.options._bodyProp ? (e += t.options._bodyProp.wrap ? ' wrap="' + t.options._bodyProp.wrap + '"' : ' wrap="square"',
            !t.options._bodyProp.lIns && 0 !== t.options._bodyProp.lIns || (e += ' lIns="' + t.options._bodyProp.lIns + '"'),
            !t.options._bodyProp.tIns && 0 !== t.options._bodyProp.tIns || (e += ' tIns="' + t.options._bodyProp.tIns + '"'),
            !t.options._bodyProp.rIns && 0 !== t.options._bodyProp.rIns || (e += ' rIns="' + t.options._bodyProp.rIns + '"'),
            !t.options._bodyProp.bIns && 0 !== t.options._bodyProp.bIns || (e += ' bIns="' + t.options._bodyProp.bIns + '"'),
            e += ' rtlCol="0"',
            t.options._bodyProp.anchor && (e += ' anchor="' + t.options._bodyProp.anchor + '"'),
            t.options._bodyProp.vert && (e += ' vert="' + t.options._bodyProp.vert + '"'),
            e += ">",
            t.options.fit && ("none" === t.options.fit ? e += "" : "shrink" === t.options.fit ? e += "<a:normAutofit/>" : "resize" === t.options.fit && (e += "<a:spAutoFit/>")),
            t.options.shrinkText && (e += "<a:normAutofit/>"),
            e += !1 !== t.options._bodyProp.autoFit ? "<a:spAutoFit/>" : "") : e += ' wrap="square" rtlCol="0">',
            e += "</a:bodyPr>",
            t._type === et.tablecell ? "<a:bodyPr/>" : e
        }(n),
        0 === a.h && a.line && a.align ? i += '<a:lstStyle><a:lvl1pPr algn="l"/></a:lstStyle>' : "placeholder" === n._type ? i += "<a:lstStyle>" + Et(n, !0) + "</a:lstStyle>" : i += "<a:lstStyle/>",
        "string" == typeof n.text || "number" == typeof n.text ? t.push({
            text: n.text.toString(),
            options: a || {}
        }) : !Array.isArray(n.text) && n.text.hasOwnProperty("text") ? t.push({
            text: n.text || "",
            options: n.options || {}
        }) : Array.isArray(n.text) && (t = n.text.map(function(t) {
            return {
                text: t.text,
                options: t.options
            }
        })),
        t.forEach(function(e, t) {
            e.text || (e.text = ""),
            e.options = e.options || a || {},
            0 === t && e.options && !e.options.bullet && a.bullet && (e.options.bullet = a.bullet),
            "string" != typeof e.text && "number" != typeof e.text || (e.text = e.text.toString().replace(/\r*\n/g, A)),
            -1 < e.text.indexOf(A) && null === e.text.match(/\n$/g) ? e.text.split(A).forEach(function(t) {
                e.options.breakLine = !0,
                r.push({
                    text: t,
                    options: e.options
                })
            }) : r.push(e)
        });
        var o = []
          , s = [];
        return r.forEach(function(t, e) {
            0 < s.length && (t.options.align || a.align) ? t.options.align != r[e - 1].options.align && (o.push(s),
            s = []) : 0 < s.length && t.options.bullet && 0 < s.length && (o.push(s),
            s = [],
            t.options.breakLine = !1),
            s.push(t),
            0 < s.length && t.options.breakLine && e + 1 < r.length && (o.push(s),
            s = []),
            e + 1 === r.length && o.push(s)
        }),
        o.forEach(function(t) {
            var e = !1;
            i += "<a:p>";
            var r = "<a:pPr " + (t[0].options && t[0].options.rtlMode ? ' rtl="1" ' : "");
            t.forEach(function(n, t) {
                n.options._lineIdx = t,
                n.options.align = n.options.align || a.align,
                n.options.lineSpacing = n.options.lineSpacing || a.lineSpacing,
                n.options.indentLevel = n.options.indentLevel || a.indentLevel,
                n.options.paraSpaceBefore = n.options.paraSpaceBefore || a.paraSpaceBefore,
                n.options.paraSpaceAfter = n.options.paraSpaceAfter || a.paraSpaceAfter,
                r = Et(n, !1),
                i += r,
                Object.entries(a).forEach(function(t) {
                    var e = t[0]
                      , r = t[1];
                    "bullet" === e || n.options[e] || (n.options[e] = r)
                }),
                i += function(t) {
                    return t.text ? "<a:r>" + Tt(t.options, !1) + "<a:t>" + ht(t.text) + "</a:t></a:r>" : ""
                }(n),
                (!n.text && a.fontSize || n.options.fontSize) && (e = !0,
                a.fontSize = a.fontSize || n.options.fontSize)
            }),
            n._type === et.tablecell && (a.fontSize || a.fontFace) ? a.fontFace ? (i += '<a:endParaRPr lang="' + (a.lang || "en-US") + '"' + (a.fontSize ? ' sz="' + Math.round(a.fontSize) + '00"' : "") + ' dirty="0">',
            i += '<a:latin typeface="' + a.fontFace + '" charset="0"/>',
            i += '<a:ea typeface="' + a.fontFace + '" charset="0"/>',
            i += '<a:cs typeface="' + a.fontFace + '" charset="0"/>',
            i += "</a:endParaRPr>") : i += '<a:endParaRPr lang="' + (a.lang || "en-US") + '"' + (a.fontSize ? ' sz="' + Math.round(a.fontSize) + '00"' : "") + ' dirty="0"/>' : i += e ? '<a:endParaRPr lang="' + (a.lang || "en-US") + '"' + (a.fontSize ? ' sz="' + Math.round(a.fontSize) + '00"' : "") + ' dirty="0"/>' : '<a:endParaRPr lang="' + (a.lang || "en-US") + '" dirty="0"/>',
            i += "</a:p>"
        }),
        i += n._type === et.tablecell ? "</a:txBody>" : "</p:txBody>"
    }
    function kt(t) {
        if (!t)
            return "";
        var e = t.options && t.options._placeholderIdx ? t.options._placeholderIdx : ""
          , r = t.options && t.options._placeholderType ? t.options._placeholderType : "";
        return "<p:ph\n\t\t" + (e ? ' idx="' + e + '"' : "") + "\n\t\t" + (r && nt[r] ? ' type="' + nt[r] + '"' : "") + "\n\t\t" + (t.text && 0 < t.text.length ? ' hasCustomPrompt="1"' : "") + "\n\t\t/>"
    }
    function Rt(t) {
        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:notes xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Slide Image Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg"/></p:nvPr></p:nvSpPr><p:spPr/></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Notes Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" dirty="0"/><a:t>' + ht(function(t) {
            var e = "";
            return t._slideObjects.forEach(function(t) {
                "notes" === t._type && (e += t.text)
            }),
            e.replace(/\r*\n/g, A)
        }(t)) + '</a:t></a:r><a:endParaRPr lang="en-US" dirty="0"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="4" name="Slide Number Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="10"/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:fld id="' + st + '" type="slidenum"><a:rPr lang="en-US"/><a:t>' + t._slideNum + '</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp></p:spTree><p:extLst><p:ext uri="{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}"><p14:creationId xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1024086991"/></p:ext></p:extLst></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:notes>'
    }
    function Ft(t) {
        t && "object" == typeof t && ("outer" !== t.type && "inner" !== t.type && "none" !== t.type && (console.warn("Warning: shadow.type options are `outer`, `inner` or `none`."),
        t.type = "outer"),
        t.angle && ((isNaN(Number(t.angle)) || t.angle < 0 || 359 < t.angle) && (console.warn("Warning: shadow.angle can only be 0-359"),
        t.angle = 270),
        t.angle = Math.round(Number(t.angle))),
        t.opacity && ((isNaN(Number(t.opacity)) || t.opacity < 0 || 1 < t.opacity) && (console.warn("Warning: shadow.opacity can only be 0-1"),
        t.opacity = .75),
        t.opacity = Number(t.opacity)))
    }
    var It = 0;
    function Ot(t, e, r, n) {
        function a(t) {
            t && "none" !== t.style && (void 0 !== t.size && (isNaN(Number(t.size)) || t.size <= 0) && (console.warn("Warning: chart.gridLine.size must be greater than 0."),
            delete t.size),
            t.style && ["solid", "dash", "dot"].indexOf(t.style) < 0 && (console.warn("Warning: chart.gridLine.style options: `solid`, `dash`, `dot`."),
            delete t.style))
        }
        var i, o, s = ++It, l = {
            _type: null,
            text: null,
            options: null,
            chartRid: null
        }, c = [];
        return i = Array.isArray(e) ? (e.forEach(function(t) {
            c = c.concat(t.data)
        }),
        r || n) : (c = r,
        n),
        c.forEach(function(t, e) {
            t.index = e
        }),
        (o = i && "object" == typeof i ? i : {})._type = e,
        o.x = void 0 === o.x || null == o.x || isNaN(Number(o.x)) ? 1 : o.x,
        o.y = void 0 === o.y || null == o.y || isNaN(Number(o.y)) ? 1 : o.y,
        o.w = o.w || "50%",
        o.h = o.h || "50%",
        ["bar", "col"].indexOf(o.barDir || "") < 0 && (o.barDir = "col"),
        ["bestFit", "b", "ctr", "inBase", "inEnd", "l", "outEnd", "r", "t"].indexOf(o.dataLabelPosition || "") < 0 && (o.dataLabelPosition = o._type === Z.PIE || o._type === Z.DOUGHNUT ? "bestFit" : "ctr"),
        o.dataLabelBkgrdColors = (!0 === o.dataLabelBkgrdColors || !1 === o.dataLabelBkgrdColors) && o.dataLabelBkgrdColors,
        ["b", "l", "r", "t", "tr"].indexOf(o.legendPos || "") < 0 && (o.legendPos = "r"),
        ["clustered", "standard", "stacked", "percentStacked"].indexOf(o.barGrouping || "") < 0 && (o.barGrouping = "standard"),
        -1 < o.barGrouping.indexOf("tacked") && (o.dataLabelPosition = "ctr",
        o.barGapWidthPct || (o.barGapWidthPct = 50)),
        ["cone", "coneToMax", "box", "cylinder", "pyramid", "pyramidToMax"].indexOf(o.bar3DShape || "") < 0 && (o.bar3DShape = "box"),
        ["circle", "dash", "diamond", "dot", "none", "square", "triangle"].indexOf(o.lineDataSymbol || "") < 0 && (o.lineDataSymbol = "circle"),
        ["gap", "span"].indexOf(o.displayBlanksAs || "") < 0 && (o.displayBlanksAs = "span"),
        ["standard", "marker", "filled"].indexOf(o.radarStyle || "") < 0 && (o.radarStyle = "standard"),
        o.lineDataSymbolSize = o.lineDataSymbolSize && !isNaN(o.lineDataSymbolSize) ? o.lineDataSymbolSize : 6,
        o.lineDataSymbolLineSize = o.lineDataSymbolLineSize && !isNaN(o.lineDataSymbolLineSize) ? gt(o.lineDataSymbolLineSize) : gt(.75),
        o.layout && ["x", "y", "w", "h"].forEach(function(t) {
            var e = o.layout[t];
            (isNaN(Number(e)) || e < 0 || 1 < e) && (console.warn("Warning: chart.layout." + t + " can only be 0-1"),
            delete o.layout[t])
        }),
        o.catGridLine = o.catGridLine || (o._type === Z.SCATTER ? {
            color: "D9D9D9",
            size: 1
        } : {
            style: "none"
        }),
        o.valGridLine = o.valGridLine || (o._type === Z.SCATTER ? {
            color: "D9D9D9",
            size: 1
        } : {}),
        o.serGridLine = o.serGridLine || (o._type === Z.SCATTER ? {
            color: "D9D9D9",
            size: 1
        } : {
            style: "none"
        }),
        a(o.catGridLine),
        a(o.valGridLine),
        a(o.serGridLine),
        Ft(o.shadow),
        o.showDataTable = (!0 === o.showDataTable || !1 === o.showDataTable) && o.showDataTable,
        o.showDataTableHorzBorder = !0 !== o.showDataTableHorzBorder && !1 !== o.showDataTableHorzBorder || o.showDataTableHorzBorder,
        o.showDataTableVertBorder = !0 !== o.showDataTableVertBorder && !1 !== o.showDataTableVertBorder || o.showDataTableVertBorder,
        o.showDataTableOutline = !0 !== o.showDataTableOutline && !1 !== o.showDataTableOutline || o.showDataTableOutline,
        o.showDataTableKeys = !0 !== o.showDataTableKeys && !1 !== o.showDataTableKeys || o.showDataTableKeys,
        o.showLabel = (!0 === o.showLabel || !1 === o.showLabel) && o.showLabel,
        o.showLegend = (!0 === o.showLegend || !1 === o.showLegend) && o.showLegend,
        o.showPercent = !0 !== o.showPercent && !1 !== o.showPercent || o.showPercent,
        o.showTitle = (!0 === o.showTitle || !1 === o.showTitle) && o.showTitle,
        o.showValue = (!0 === o.showValue || !1 === o.showValue) && o.showValue,
        o.showLeaderLines = (!0 === o.showLeaderLines || !1 === o.showLeaderLines) && o.showLeaderLines,
        o.catAxisLineShow = void 0 === o.catAxisLineShow || o.catAxisLineShow,
        o.valAxisLineShow = void 0 === o.valAxisLineShow || o.valAxisLineShow,
        o.serAxisLineShow = void 0 === o.serAxisLineShow || o.serAxisLineShow,
        o.v3DRotX = !isNaN(o.v3DRotX) && -90 <= o.v3DRotX && o.v3DRotX <= 90 ? o.v3DRotX : 30,
        o.v3DRotY = !isNaN(o.v3DRotY) && 0 <= o.v3DRotY && o.v3DRotY <= 360 ? o.v3DRotY : 30,
        o.v3DRAngAx = !0 !== o.v3DRAngAx && !1 !== o.v3DRAngAx || o.v3DRAngAx,
        o.v3DPerspective = !isNaN(o.v3DPerspective) && 0 <= o.v3DPerspective && o.v3DPerspective <= 240 ? o.v3DPerspective : 30,
        o.barGapWidthPct = !isNaN(o.barGapWidthPct) && 0 <= o.barGapWidthPct && o.barGapWidthPct <= 1e3 ? o.barGapWidthPct : 150,
        o.barGapDepthPct = !isNaN(o.barGapDepthPct) && 0 <= o.barGapDepthPct && o.barGapDepthPct <= 1e3 ? o.barGapDepthPct : 150,
        o.chartColors = Array.isArray(o.chartColors) ? o.chartColors : o._type === Z.PIE || o._type === Z.DOUGHNUT ? B : O,
        o.chartColorsOpacity = o.chartColorsOpacity && !isNaN(o.chartColorsOpacity) ? o.chartColorsOpacity : null,
        o.border = o.border && "object" == typeof o.border ? o.border : null,
        !o.border || o.border.pt && !isNaN(o.border.pt) || (o.border.pt = 1),
        !o.border || o.border.color && "string" == typeof o.border.color && 6 === o.border.color.length || (o.border.color = "363636"),
        o.dataBorder = o.dataBorder && "object" == typeof o.dataBorder ? o.dataBorder : null,
        !o.dataBorder || o.dataBorder.pt && !isNaN(o.dataBorder.pt) || (o.dataBorder.pt = .75),
        !o.dataBorder || o.dataBorder.color && "string" == typeof o.dataBorder.color && 6 === o.dataBorder.color.length || (o.dataBorder.color = "F9F9F9"),
        o.dataLabelFormatCode || o._type !== Z.SCATTER || (o.dataLabelFormatCode = "General"),
        o.dataLabelFormatCode = o.dataLabelFormatCode && "string" == typeof o.dataLabelFormatCode ? o.dataLabelFormatCode : "#,##0",
        o._type !== Z.PIE && o._type !== Z.DOUGHNUT || (o.dataLabelFormatCode = o.showPercent ? "0%" : "General"),
        o.dataLabelFormatScatter || o._type !== Z.SCATTER || (o.dataLabelFormatScatter = "custom"),
        o.lineSize = "number" == typeof o.lineSize ? o.lineSize : 2,
        o.valAxisMajorUnit = "number" == typeof o.valAxisMajorUnit ? o.valAxisMajorUnit : null,
        o.valAxisCrossesAt = o.valAxisCrossesAt || "autoZero",
        l._type = "chart",
        l.options = o,
        l.chartRid = wt(t),
        t._relsChart.push({
            rId: wt(t),
            data: c,
            opts: o,
            type: o._type,
            globalId: s,
            fileName: "chart" + s + ".xml",
            Target: "/ppt/charts/chart" + s + ".xml"
        }),
        t._slideObjects.push(l),
        l
    }
    function Bt(t, e) {
        var r = {
            _type: null,
            text: null,
            options: null,
            image: null,
            imageRid: null,
            hyperlink: null
        }
          , n = e.x || 0
          , a = e.y || 0
          , i = e.w || 0
          , o = e.h || 0
          , s = e.sizing || null
          , l = e.hyperlink || ""
          , c = e.data || ""
          , p = e.path || ""
          , u = wt(t);
        if (!p && !c)
            return console.error("ERROR: addImage() requires either 'data' or 'path' parameter!"),
            null;
        if (p && "string" != typeof p)
            return console.error("ERROR: addImage() 'path' should be a string, ex: {path:'/img/sample.png'} - you sent " + p),
            null;
        if (c && "string" != typeof c)
            return console.error("ERROR: addImage() 'data' should be a string, ex: {data:'image/png;base64,NMP[...]'} - you sent " + c),
            null;
        if (c && "string" == typeof c && -1 === c.toLowerCase().indexOf("base64,"))
            return console.error("ERROR: Image `data` value lacks a base64 header! Ex: 'image/png;base64,NMP[...]')"),
            null;
        var f = p.substring(p.lastIndexOf("/") + 1).split("?")[0].split(".").pop().split("#")[0] || "png";
        if (c && /image\/(\w+);/.exec(c) && 0 < /image\/(\w+);/.exec(c).length ? f = /image\/(\w+);/.exec(c)[1] : c && -1 < c.toLowerCase().indexOf("image/svg+xml") && (f = "svg"),
        r._type = et.image,
        r.image = p || "preencoded.png",
        r.options = {
            x: n || 0,
            y: a || 0,
            w: i || 1,
            h: o || 1,
            rounding: "boolean" == typeof e.rounding && e.rounding,
            sizing: s,
            placeholder: e.placeholder,
            rotate: e.rotate || 0
        },
        "svg" === f ? (t._relsMedia.push({
            path: p || c + "png",
            type: "image/png",
            extn: "png",
            data: c || "",
            rId: u,
            Target: "../media/image-" + t._slideNum + "-" + (t._relsMedia.length + 1) + ".png",
            isSvgPng: !0,
            svgSize: {
                w: ut(r.options.w, "X", t._presLayout),
                h: ut(r.options.h, "Y", t._presLayout)
            }
        }),
        r.imageRid = u,
        t._relsMedia.push({
            path: p || c,
            type: "image/svg+xml",
            extn: f,
            data: c || "",
            rId: u + 1,
            Target: "../media/image-" + t._slideNum + "-" + (t._relsMedia.length + 1) + "." + f
        }),
        r.imageRid = u + 1) : (t._relsMedia.push({
            path: p || "preencoded." + f,
            type: "image/" + f,
            extn: f,
            data: c || "",
            rId: u,
            Target: "../media/image-" + t._slideNum + "-" + (t._relsMedia.length + 1) + "." + f
        }),
        r.imageRid = u),
        "object" == typeof l) {
            if (!l.url && !l.slide)
                throw new Error("ERROR: `hyperlink` option requires either: `url` or `slide`");
            u++,
            t._rels.push({
                type: et.hyperlink,
                data: l.slide ? "slide" : "dummy",
                rId: u,
                Target: l.url || l.slide.toString()
            }),
            l._rId = u,
            r.hyperlink = l
        }
        t._slideObjects.push(r)
    }
    function Nt(t, e, r) {
        var n = "object" == typeof r ? r : {};
        n.line = n.line || {
            type: "none"
        };
        var a = {
            _type: et.text,
            shape: e || Y.RECTANGLE,
            options: n,
            text: null
        };
        if (!e)
            throw new Error("Missing/Invalid shape parameter! Example: `addShape(pptxgen.shapes.LINE, {x:1, y:1, w:1, h:1});`");
        var i = {
            type: n.line.type || "solid",
            color: n.line.color || u,
            transparency: n.line.transparency || 0,
            width: n.line.width || 1,
            dashType: n.line.dashType || "solid",
            beginArrowType: n.line.beginArrowType || null,
            endArrowType: n.line.endArrowType || null
        };
        if ("object" == typeof n.line && "none" !== n.line.type && (n.line = i),
        n.x = n.x || (0 === n.x ? 0 : 1),
        n.y = n.y || (0 === n.y ? 0 : 1),
        n.w = n.w || (0 === n.w ? 0 : 1),
        n.h = n.h || (0 === n.h ? 0 : 1),
        "string" == typeof n.line) {
            var o = i;
            o.color = n.line.toString(),
            n.line = o
        }
        "number" == typeof n.lineSize && (n.line.width = n.lineSize),
        "string" == typeof n.lineDash && (n.line.dashType = n.lineDash),
        "string" == typeof n.lineHead && (n.line.beginArrowType = n.lineHead),
        "string" == typeof n.lineTail && (n.line.endArrowType = n.lineTail),
        zt(t, a),
        t._slideObjects.push(a)
    }
    function Dt(t, e, r, n) {
        var a = r || {};
        a.line = a.line || {},
        a._bodyProp || (a._bodyProp = {});
        var i = {
            _type: n ? et.placeholder : et.text,
            shape: a.shape || Y.RECTANGLE,
            text: (Array.isArray(e) && 0 === e.length ? "" : e || "") || "",
            options: a
        };
        if (a.placeholder || (a.color = a.color || t.color || b),
        (a.placeholder || n) && (a.bullet = a.bullet || !1),
        a.shape === Y.LINE) {
            var o = {
                type: a.line.type || "solid",
                color: a.line.color || u,
                transparency: a.line.transparency || 0,
                width: a.line.width || 1,
                dashType: a.line.dashType || "solid",
                beginArrowType: a.line.beginArrowType || null,
                endArrowType: a.line.endArrowType || null
            };
            if ("object" == typeof a.line && (a.line = o),
            "string" == typeof a.line) {
                var s = o;
                s.color = a.line.toString(),
                a.line = s
            }
            "number" == typeof a.lineSize && (a.line.width = a.lineSize),
            "string" == typeof a.lineDash && (a.line.dashType = a.lineDash),
            "string" == typeof a.lineHead && (a.line.beginArrowType = a.lineHead),
            "string" == typeof a.lineTail && (a.line.endArrowType = a.lineTail)
        }
        i.options.lineSpacing = a.lineSpacing && !isNaN(a.lineSpacing) ? a.lineSpacing : null,
        i.options._bodyProp.autoFit = a.autoFit || !1,
        i.options._bodyProp.anchor = a.placeholder ? null : c.ctr,
        i.options._bodyProp.vert = a.vert || null,
        (a.inset && !isNaN(Number(a.inset)) || 0 === a.inset) && (i.options._bodyProp.lIns = mt(a.inset),
        i.options._bodyProp.rIns = mt(a.inset),
        i.options._bodyProp.tIns = mt(a.inset),
        i.options._bodyProp.bIns = mt(a.inset)),
        0 === (i.options.align || "").toLowerCase().indexOf("c") ? i.options._bodyProp.align = l.center : 0 === (i.options.align || "").toLowerCase().indexOf("l") ? i.options._bodyProp.align = l.left : 0 === (i.options.align || "").toLowerCase().indexOf("r") ? i.options._bodyProp.align = l.right : 0 === (i.options.align || "").toLowerCase().indexOf("j") && (i.options._bodyProp.align = l.justify),
        0 === (i.options.valign || "").toLowerCase().indexOf("b") ? i.options._bodyProp.anchor = c.b : 0 === (i.options.valign || "").toLowerCase().indexOf("m") ? i.options._bodyProp.anchor = c.ctr : 0 === (i.options.valign || "").toLowerCase().indexOf("t") && (i.options._bodyProp.anchor = c.t),
        Ft(a.shadow),
        "string" != typeof e && "number" != typeof e || (i.text = [{
            text: e,
            options: i.options
        }]),
        zt(t, i.text || ""),
        t._slideObjects.push(i)
    }
    function Mt(t, e) {
        if ("object" == typeof t && (t.path || t.data)) {
            t.path = t.path || "preencoded.png";
            var r = (t.path.split(".").pop() || "png").split("?")[0];
            "jpg" === r && (r = "jpeg"),
            e._relsMedia = e._relsMedia || [];
            var n = e._relsMedia.length + 1;
            e._relsMedia.push({
                path: t.path,
                type: et.image,
                extn: r,
                data: t.data || null,
                rId: n,
                Target: "../media/" + (e._name || "").replace(/\s+/gi, "-") + "-image-" + (e._relsMedia.length + 1) + "." + r
            }),
            e._bkgdImgRid = n
        } else
            t && t.fill && "string" == typeof t.fill && (e.bkgd = t.fill)
    }
    function zt(r, t) {
        var e = [];
        "string" != typeof t && "number" != typeof t && (Array.isArray(t) ? e = t : "object" == typeof t && (e = [t]),
        e.forEach(function(t) {
            if (Array.isArray(t))
                zt(r, t);
            else if (t && "object" == typeof t && t.options && t.options.hyperlink && !t.options.hyperlink._rId)
                if ("object" != typeof t.options.hyperlink)
                    console.log("ERROR: text `hyperlink` option should be an object. Ex: `hyperlink: {url:'https://github.com'}` ");
                else if (t.options.hyperlink.url || t.options.hyperlink.slide) {
                    var e = wt(r);
                    r._rels.push({
                        type: et.hyperlink,
                        data: t.options.hyperlink.slide ? "slide" : "dummy",
                        rId: e,
                        Target: ht(t.options.hyperlink.url) || t.options.hyperlink.slide.toString()
                    }),
                    t.options.hyperlink._rId = e
                } else
                    console.log("ERROR: 'hyperlink requires either: `url` or `slide`'")
        }))
    }
    var Ut = (Object.defineProperty(jt.prototype, "bkgd", {
        get: function() {
            return this._bkgd
        },
        set: function(t) {
            this._bkgd = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(jt.prototype, "background", {
        get: function() {
            return this._background
        },
        set: function(t) {
            Mt(t, this)
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(jt.prototype, "color", {
        get: function() {
            return this._color
        },
        set: function(t) {
            this._color = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(jt.prototype, "hidden", {
        get: function() {
            return this._hidden
        },
        set: function(t) {
            this._hidden = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(jt.prototype, "slideNumber", {
        get: function() {
            return this._slideNumberProps
        },
        set: function(t) {
            this._slideNumberProps = t,
            this._setSlideNum(t)
        },
        enumerable: !1,
        configurable: !0
    }),
    jt.prototype.addChart = function(t, e, r) {
        return Ot(this, (r || {})._type = t, e, r),
        this
    }
    ,
    jt.prototype.addImage = function(t) {
        return Bt(this, t),
        this
    }
    ,
    jt.prototype.addMedia = function(t) {
        return function(t, e) {
            var r, n = t._relsMedia.length + 1, a = e.x || 0, i = e.y || 0, o = e.w || 2, s = e.h || 2, l = e.data || "", c = e.link || "", p = e.path || "", u = e.type || "audio", f = {
                _type: et.media
            };
            if (!p && !l && "online" !== u)
                throw new Error("addMedia() error: either 'data' or 'path' are required!");
            if (l && -1 === l.toLowerCase().indexOf("base64,"))
                throw new Error("addMedia() error: `data` value lacks a base64 header! Ex: 'video/mpeg;base64,NMP[...]')");
            if ("online" === u && !c)
                throw new Error("addMedia() error: online videos require `link` value");
            r = l ? l.split(";")[0].split("/")[1] : p.split(".").pop(),
            f.mtype = u,
            f.media = p || "preencoded.mov",
            f.options = {},
            f.options.x = a,
            f.options.y = i,
            f.options.w = o,
            f.options.h = s,
            "online" === u ? (t._relsMedia.push({
                path: p || "preencoded" + r,
                data: "dummy",
                type: "online",
                extn: r,
                rId: n + 1,
                Target: c
            }),
            f.mediaRid = t._relsMedia[t._relsMedia.length - 1].rId,
            t._relsMedia.push({
                path: "preencoded.png",
                data: ct,
                type: "image/png",
                extn: "png",
                rId: n + 2,
                Target: "../media/image-" + t._slideNum + "-" + (t._relsMedia.length + 1) + ".png"
            })) : (t._relsMedia.push({
                path: p || "preencoded" + r,
                type: u + "/" + r,
                extn: r,
                data: l || "",
                rId: n + 0,
                Target: "../media/media-" + t._slideNum + "-" + (t._relsMedia.length + 1) + "." + r
            }),
            f.mediaRid = t._relsMedia[t._relsMedia.length - 1].rId,
            t._relsMedia.push({
                path: p || "preencoded" + r,
                type: u + "/" + r,
                extn: r,
                data: l || "",
                rId: n + 1,
                Target: "../media/media-" + t._slideNum + "-" + (t._relsMedia.length + 0) + "." + r
            }),
            t._relsMedia.push({
                data: ct,
                path: "preencoded.png",
                type: "image/png",
                extn: "png",
                rId: n + 2,
                Target: "../media/image-" + t._slideNum + "-" + (t._relsMedia.length + 1) + ".png"
            })),
            t._slideObjects.push(f)
        }(this, t),
        this
    }
    ,
    jt.prototype.addNotes = function(t) {
        return function(t, e) {
            t._slideObjects.push({
                _type: et.notes,
                text: e
            })
        }(this, t),
        this
    }
    ,
    jt.prototype.addShape = function(t, e) {
        return Nt(this, t, e),
        this
    }
    ,
    jt.prototype.addTable = function(t, e) {
        return function(n, t, e, a, r, i, o) {
            var s = e && "object" == typeof e ? e : {}
              , l = [n];
            if (null === t || 0 === t.length || !Array.isArray(t))
                throw new Error("addTable: Array expected! EX: 'slide.addTable( [rows], {options} );' (https://gitbrent.github.io/PptxGenJS/docs/api-tables.html)");
            if (!t[0] || !Array.isArray(t[0]))
                throw new Error("addTable: 'rows' should be an array of cells! EX: 'slide.addTable( [ ['A'], ['B'], {text:'C',options:{align:'center'}} ] );' (https://gitbrent.github.io/PptxGenJS/docs/api-tables.html)");
            var c = [];
            t.forEach(function(t) {
                var n = [];
                Array.isArray(t) ? t.forEach(function(t) {
                    var e = {
                        _type: et.tablecell,
                        text: "",
                        options: "object" == typeof t && t.options ? t.options : {}
                    };
                    "string" == typeof t || "number" == typeof t ? e.text = t.toString() : t.text && ("string" == typeof t.text || "number" == typeof t.text ? e.text = t.text.toString() : t.text && (e.text = t.text),
                    t.options && "object" == typeof t.options && (e.options = t.options)),
                    e.options.border = e.options.border || s.border || [{
                        type: "none"
                    }, {
                        type: "none"
                    }, {
                        type: "none"
                    }, {
                        type: "none"
                    }];
                    var r = e.options.border;
                    Array.isArray(r) || "object" != typeof r || (e.options.border = [r, r, r, r]),
                    e.options.border[0] || (e.options.border[0] = {
                        type: "none"
                    }),
                    e.options.border[1] || (e.options.border[1] = {
                        type: "none"
                    }),
                    e.options.border[2] || (e.options.border[2] = {
                        type: "none"
                    }),
                    e.options.border[3] || (e.options.border[3] = {
                        type: "none"
                    }),
                    [0, 1, 2, 3].forEach(function(t) {
                        e.options.border[t] = {
                            type: e.options.border[t].type || f,
                            color: e.options.border[t].color || h,
                            pt: "number" == typeof e.options.border[t].pt ? e.options.border[t].pt : m
                        }
                    }),
                    n.push(e)
                }) : (console.log("addTable: tableRows has a bad row. A row should be an array of cells. You provided:"),
                console.log(t)),
                c.push(n)
            }),
            s.x = ut(s.x || (0 === s.x ? 0 : L / 2), "X", r),
            s.y = ut(s.y || (0 === s.y ? 0 : L / 2), "Y", r),
            s.h && (s.h = ut(s.h, "Y", r)),
            s.fontSize = s.fontSize || x,
            s.margin = 0 === s.margin || s.margin ? s.margin : k,
            "number" == typeof s.margin && (s.margin = [Number(s.margin), Number(s.margin), Number(s.margin), Number(s.margin)]),
            s.color || (s.color = s.color || b),
            "string" == typeof s.border ? (console.warn("addTable `border` option must be an object. Ex: `{border: {type:'none'}}`"),
            s.border = null) : Array.isArray(s.border) && [0, 1, 2, 3].forEach(function(t) {
                s.border[t] = s.border[t] ? {
                    type: s.border[t].type || f,
                    color: s.border[t].color || h,
                    pt: s.border[t].pt || m
                } : {
                    type: "none"
                }
            }),
            s.autoPage = "boolean" == typeof s.autoPage && s.autoPage,
            s.autoPageRepeatHeader = "boolean" == typeof s.autoPageRepeatHeader && s.autoPageRepeatHeader,
            s.autoPageHeaderRows = void 0 === s.autoPageHeaderRows || isNaN(Number(s.autoPageHeaderRows)) ? 1 : Number(s.autoPageHeaderRows),
            s.autoPageLineWeight = void 0 === s.autoPageLineWeight || isNaN(Number(s.autoPageLineWeight)) ? 0 : Number(s.autoPageLineWeight),
            s.autoPageLineWeight && (1 < s.autoPageLineWeight ? s.autoPageLineWeight = 1 : s.autoPageLineWeight < -1 && (s.autoPageLineWeight = -1));
            var p = C;
            if (a && void 0 !== a._margin && (Array.isArray(a._margin) ? p = a._margin : isNaN(Number(a._margin)) || (p = [Number(a._margin), Number(a._margin), Number(a._margin), Number(a._margin)])),
            s.colW) {
                var u = c[0].reduce(function(t, e) {
                    return e && e.options && e.options.colspan && "number" == typeof e.options.colspan ? t += e.options.colspan : t += 1,
                    t
                }, 0);
                "string" == typeof s.colW || "number" == typeof s.colW ? (s.w = Math.floor(Number(s.colW) * u),
                s.colW = null) : s.colW && Array.isArray(s.colW) && 1 === s.colW.length && 1 < u ? (s.w = Math.floor(Number(s.colW) * u),
                s.colW = null) : s.colW && Array.isArray(s.colW) && s.colW.length !== u && (console.warn("addTable: mismatch: (colW.length != data.length) Therefore, defaulting to evenly distributed col widths."),
                s.colW = null)
            } else
                s.w ? s.w = ut(s.w, "X", r) : s.w = Math.floor(r._sizeW / L - p[1] - p[3]);
            s.x && s.x < 20 && (s.x = mt(s.x)),
            s.y && s.y < 20 && (s.y = mt(s.y)),
            s.w && s.w < 20 && (s.w = mt(s.w)),
            s.h && s.h < 20 && (s.h = mt(s.h)),
            c.forEach(function(r) {
                r.forEach(function(t, e) {
                    "number" == typeof t || "string" == typeof t ? r[e] = {
                        _type: et.tablecell,
                        text: r[e].toString(),
                        options: s
                    } : "object" == typeof t && ("number" == typeof t.text ? r[e].text = r[e].text.toString() : void 0 !== t.text && null !== t.text || (r[e].text = ""),
                    r[e].options = t.options || {},
                    r[e]._type = et.tablecell),
                    t.text && Array.isArray(t.text) && (s.autoPage = !1)
                })
            }),
            s && !1 === s.autoPage ? (zt(n, c),
            n._slideObjects.push({
                _type: et.table,
                arrTabRows: c,
                options: Object.assign({}, s)
            })) : (s.autoPageRepeatHeader && (s._arrObjTabHeadRows = c.filter(function(t, e) {
                return e < s.autoPageHeaderRows
            })),
            _t(c, s, r, a).forEach(function(t, e) {
                o(n._slideNum + e) || l.push(i(a ? a._name : null)),
                0 < e && (s.y = mt(s.autoPageSlideStartY || s.newSlideStartY || p[0]));
                var r = o(n._slideNum + e);
                s.autoPage = !1,
                zt(r, t.rows),
                r.addTable(t.rows, Object.assign({}, s))
            }))
        }(this, t, e, this._slideLayout, this._presLayout, this.addSlide, this.getSlide),
        this
    }
    ,
    jt.prototype.addText = function(t, e) {
        return Dt(this, t, e, !1),
        this
    }
    ,
    jt);
    function jt(t) {
        this.addSlide = t.addSlide,
        this.getSlide = t.getSlide,
        this._name = "Slide " + t.slideNumber,
        this._presLayout = t.presLayout,
        this._rId = t.slideRId,
        this._rels = [],
        this._relsChart = [],
        this._relsMedia = [],
        this._setSlideNum = t.setSlideNum,
        this._slideId = t.slideId,
        this._slideLayout = t.slideLayout || null,
        this._slideNum = t.slideNumber,
        this._slideObjects = [],
        this._slideNumberProps = this._slideLayout && this._slideLayout._slideNumberProps ? this._slideLayout._slideNumberProps : null
    }
    function Wt(p, u) {
        var f = p.data;
        return new Promise(function(e, r) {
            var t = new d
              , a = 2 * (f.length - 1) + 1;
            t.folder("_rels"),
            t.folder("docProps"),
            t.folder("xl/_rels"),
            t.folder("xl/tables"),
            t.folder("xl/theme"),
            t.folder("xl/worksheets"),
            t.folder("xl/worksheets/_rels"),
            t.file("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">  <Default Extension="xml" ContentType="application/xml"/>  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>  <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>  <Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>  <Override PartName="/xl/tables/table1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml"/>  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>\n'),
            t.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>\n'),
            t.file("docProps/app.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Microsoft Excel</Application><DocSecurity>0</DocSecurity><ScaleCrop>false</ScaleCrop><HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>1</vt:i4></vt:variant></vt:vector></HeadingPairs><TitlesOfParts><vt:vector size="1" baseType="lpstr"><vt:lpstr>Sheet1</vt:lpstr></vt:vector></TitlesOfParts></Properties>\n'),
            t.file("docProps/core.xml", '<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:creator>PptxGenJS</dc:creator><cp:lastModifiedBy>Ely, Brent</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">' + (new Date).toISOString() + '</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">' + (new Date).toISOString() + "</dcterms:modified></cp:coreProperties>\n"),
            t.file("xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/></Relationships>\n'),
            t.file("xl/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="0" formatCode="General"/></numFmts><fonts count="4"><font><sz val="9"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="9"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="10"/><color indexed="8"/><name val="Geneva"/></font><font><sz val="18"/><color indexed="8"/><name val="Arial"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><dxfs count="0"/><tableStyles count="0"/><colors><indexedColors><rgbColor rgb="ff000000"/><rgbColor rgb="ffffffff"/><rgbColor rgb="ffff0000"/><rgbColor rgb="ff00ff00"/><rgbColor rgb="ff0000ff"/><rgbColor rgb="ffffff00"/><rgbColor rgb="ffff00ff"/><rgbColor rgb="ff00ffff"/><rgbColor rgb="ff000000"/><rgbColor rgb="ffffffff"/><rgbColor rgb="ff878787"/><rgbColor rgb="fff9f9f9"/></indexedColors></colors></styleSheet>\n'),
            t.file("xl/theme/theme1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="Yu Gothic Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="DengXian Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="Yu Gothic"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="DengXian"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Tahoma"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'),
            t.file("xl/workbook.xml", '<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x15" xmlns:x15="http://schemas.microsoft.com/office/spreadsheetml/2010/11/main"><fileVersion appName="xl" lastEdited="6" lowestEdited="6" rupBuild="14420"/><workbookPr /><bookViews><workbookView xWindow="0" yWindow="0" windowWidth="15960" windowHeight="18080"/></bookViews><sheets><sheet name="Sheet1" sheetId="1" r:id="rId1" /></sheets><calcPr calcId="171026" concurrentCalc="0"/></workbook>\n'),
            t.file("xl/worksheets/_rels/sheet1.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/table" Target="../tables/table1.xml"/></Relationships>\n');
            var n = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            p.opts._type === Z.BUBBLE ? n += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + (1 + a) + '" uniqueCount="' + (1 + a) + '">' : p.opts._type === Z.SCATTER ? n += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + (f.length + 1) + '" uniqueCount="' + (f.length + 1) + '">' : (n += '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + (f[0].labels.length + f.length + 1) + '" uniqueCount="' + (f[0].labels.length + f.length + 1) + '">',
            n += '<si><t xml:space="preserve"></t></si>'),
            p.opts._type === Z.BUBBLE ? f.forEach(function(t, e) {
                0 === e ? n += "<si><t>X-Axis</t></si>" : (n += "<si><t>" + ht(t.name || " ") + "</t></si>",
                n += "<si><t>" + ht("Size " + e) + "</t></si>")
            }) : f.forEach(function(t) {
                n += "<si><t>" + ht((t.name || " ").replace("X-Axis", "X-Values")) + "</t></si>"
            }),
            p.opts._type !== Z.BUBBLE && p.opts._type !== Z.SCATTER && f[0].labels.forEach(function(t) {
                n += "<si><t>" + ht(t) + "</t></si>"
            }),
            n += "</sst>\n",
            t.file("xl/sharedStrings.xml", n);
            var i = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            p.opts._type === Z.BUBBLE || (p.opts._type === Z.SCATTER ? (i += '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="Table1" displayName="Table1" ref="A1:' + I[f.length - 1] + (f[0].values.length + 1) + '" totalsRowShown="0">',
            i += '<tableColumns count="' + f.length + '">',
            f.forEach(function(t, e) {
                i += '<tableColumn id="' + (e + 1) + '" name="' + (0 === e ? "X-Values" : "Y-Value " + e) + '" />'
            })) : (i += '<table xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" id="1" name="Table1" displayName="Table1" ref="A1:' + I[f.length] + (f[0].labels.length + 1) + '" totalsRowShown="0">',
            i += '<tableColumns count="' + (f.length + 1) + '">',
            i += '<tableColumn id="1" name=" " />',
            f.forEach(function(t, e) {
                i += '<tableColumn id="' + (e + 2) + '" name="' + ht(t.name) + '" />'
            }))),
            i += "</tableColumns>",
            i += '<tableStyleInfo showFirstColumn="0" showLastColumn="0" showRowStripes="1" showColumnStripes="0" />',
            i += "</table>",
            t.file("xl/tables/table1.xml", i);
            var o = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
            if (o += '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac">',
            p.opts._type === Z.BUBBLE ? o += '<dimension ref="A1:' + I[a - 1] + (f[0].values.length + 1) + '" />' : p.opts._type === Z.SCATTER ? o += '<dimension ref="A1:' + I[f.length - 1] + (f[0].values.length + 1) + '" />' : o += '<dimension ref="A1:' + I[f.length] + (f[0].labels.length + 1) + '" />',
            o += '<sheetViews><sheetView tabSelected="1" workbookViewId="0"><selection activeCell="B1" sqref="B1" /></sheetView></sheetViews>',
            o += '<sheetFormatPr baseColWidth="10" defaultColWidth="11.5" defaultRowHeight="12" />',
            p.opts._type === Z.BUBBLE) {
                o += "<cols>",
                o += '<col min="1" max="' + f.length + '" width="11" customWidth="1" />',
                o += "</cols>",
                o += "<sheetData>",
                o += '<row r="1" spans="1:' + a + '">',
                o += '<c r="A1" t="s"><v>0</v></c>';
                for (var s = 1; s < a; s++)
                    o += '<c r="' + (s < 26 ? I[s] : "A" + I[s % I.length]) + '1" t="s">',
                    o += "<v>" + s + "</v>",
                    o += "</c>";
                o += "</row>",
                f[0].values.forEach(function(t, e) {
                    o += '<row r="' + (e + 2) + '" spans="1:' + a + '">',
                    o += '<c r="A' + (e + 2) + '"><v>' + t + "</v></c>";
                    for (var r = 1, n = 1; n < f.length; n++)
                        o += '<c r="' + (r < 26 ? I[r] : "A" + I[r % I.length]) + (e + 2) + '">',
                        o += "<v>" + (f[n].values[e] || "") + "</v>",
                        o += "</c>",
                        o += '<c r="' + (++r < 26 ? I[r] : "A" + I[r % I.length]) + (e + 2) + '">',
                        o += "<v>" + (f[n].sizes[e] || "") + "</v>",
                        o += "</c>",
                        r++;
                    o += "</row>"
                })
            } else if (p.opts._type === Z.SCATTER) {
                o += "<cols>",
                o += '<col min="1" max="' + f.length + '" width="11" customWidth="1" />',
                o += "</cols>",
                o += "<sheetData>",
                o += '<row r="1" spans="1:' + f.length + '">',
                o += '<c r="A1" t="s"><v>0</v></c>';
                for (var l = 1; l < f.length; l++)
                    o += '<c r="' + (l < 26 ? I[l] : "A" + I[l % I.length]) + '1" t="s">',
                    o += "<v>" + l + "</v>",
                    o += "</c>";
                o += "</row>",
                f[0].values.forEach(function(t, e) {
                    o += '<row r="' + (e + 2) + '" spans="1:' + f.length + '">',
                    o += '<c r="A' + (e + 2) + '"><v>' + t + "</v></c>";
                    for (var r = 1; r < f.length; r++)
                        o += '<c r="' + (r < 26 ? I[r] : "A" + I[r % I.length]) + (e + 2) + '">',
                        o += "<v>" + (f[r].values[e] || 0 === f[r].values[e] ? f[r].values[e] : "") + "</v>",
                        o += "</c>";
                    o += "</row>"
                })
            } else {
                o += "<cols>",
                o += '<col min="1" max="1" width="11" customWidth="1" />',
                o += "</cols>",
                o += "<sheetData>",
                o += '<row r="1" spans="1:' + (f.length + 1) + '">',
                o += '<c r="A1" t="s"><v>0</v></c>';
                for (var c = 1; c <= f.length; c++)
                    o += '<c r="' + (c < 26 ? I[c] : "A" + I[c % I.length]) + '1" t="s">',
                    o += "<v>" + c + "</v>",
                    o += "</c>";
                o += "</row>",
                f[0].labels.forEach(function(t, e) {
                    o += '<row r="' + (e + 2) + '" spans="1:' + (f.length + 1) + '">',
                    o += '<c r="A' + (e + 2) + '" t="s">',
                    o += "<v>" + (f.length + e + 1) + "</v>",
                    o += "</c>";
                    for (var r = 0; r < f.length; r++)
                        o += '<c r="' + (r + 1 < 26 ? I[r + 1] : "A" + I[(r + 1) % I.length]) + (e + 2) + '">',
                        o += "<v>" + (f[r].values[e] || "") + "</v>",
                        o += "</c>";
                    o += "</row>"
                })
            }
            o += "</sheetData>",
            o += '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3" />',
            o += "</worksheet>\n",
            t.file("xl/worksheets/sheet1.xml", o),
            t.generateAsync({
                type: "base64"
            }).then(function(t) {
                u.file("ppt/embeddings/Microsoft_Excel_Worksheet" + p.globalId + ".xlsx", t, {
                    base64: !0
                }),
                u.file("ppt/charts/_rels/" + p.fileName + ".rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/package" Target="../embeddings/Microsoft_Excel_Worksheet' + p.globalId + '.xlsx"/></Relationships>'),
                u.file("ppt/charts/" + p.fileName, function(a) {
                    var i = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
                      , o = !1;
                    i += '<c:chartSpace xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
                    i += '<c:date1904 val="0"/>',
                    i += "<c:chart>",
                    a.opts.showTitle ? (i += Qt({
                        title: a.opts.title || "Chart Title",
                        fontSize: a.opts.titleFontSize || w,
                        color: a.opts.titleColor,
                        fontFace: a.opts.titleFontFace,
                        rotate: a.opts.titleRotate,
                        titleAlign: a.opts.titleAlign,
                        titlePos: a.opts.titlePos
                    }),
                    i += '<c:autoTitleDeleted val="0"/>') : i += '<c:autoTitleDeleted val="1"/>';
                    a.opts._type === Z.BAR3D && (i += "<c:view3D>",
                    i += ' <c:rotX val="' + a.opts.v3DRotX + '"/>',
                    i += ' <c:rotY val="' + a.opts.v3DRotY + '"/>',
                    i += ' <c:rAngAx val="' + (!1 === a.opts.v3DRAngAx ? 0 : 1) + '"/>',
                    i += ' <c:perspective val="' + a.opts.v3DPerspective + '"/>',
                    i += "</c:view3D>");
                    i += "<c:plotArea>",
                    a.opts.layout ? (i += "<c:layout>",
                    i += " <c:manualLayout>",
                    i += '  <c:layoutTarget val="inner" />',
                    i += '  <c:xMode val="edge" />',
                    i += '  <c:yMode val="edge" />',
                    i += '  <c:x val="' + (a.opts.layout.x || 0) + '" />',
                    i += '  <c:y val="' + (a.opts.layout.y || 0) + '" />',
                    i += '  <c:w val="' + (a.opts.layout.w || 1) + '" />',
                    i += '  <c:h val="' + (a.opts.layout.h || 1) + '" />',
                    i += " </c:manualLayout>",
                    i += "</c:layout>") : i += "<c:layout/>";
                    Array.isArray(a.opts._type) ? a.opts._type.forEach(function(t) {
                        var e = dt(a.opts, t.options)
                          , r = e.secondaryValAxis ? P : S
                          , n = e.secondaryCatAxis ? T : E;
                        o = o || e.secondaryValAxis,
                        i += Gt(t.type, t.data, e, r, n, !0)
                    }) : i += Gt(a.opts._type, a.data, a.opts, S, E, !1);
                    if (a.opts._type !== Z.PIE && a.opts._type !== Z.DOUGHNUT) {
                        if (a.opts.valAxes && !o)
                            throw new Error("Secondary axis must be used by one of the multiple charts");
                        if (a.opts.catAxes) {
                            if (!a.opts.valAxes || a.opts.valAxes.length !== a.opts.catAxes.length)
                                throw new Error("There must be the same number of value and category axes.");
                            i += Ht(dt(a.opts, a.opts.catAxes[0]), E, S),
                            a.opts.catAxes[1] && (i += Ht(dt(a.opts, a.opts.catAxes[1]), T, S))
                        } else
                            i += Ht(a.opts, E, S);
                        a.opts.valAxes ? (i += Vt(dt(a.opts, a.opts.valAxes[0]), S),
                        a.opts.valAxes[1] && (i += Vt(dt(a.opts, a.opts.valAxes[1]), P))) : (i += Vt(a.opts, S),
                        a.opts._type === Z.BAR3D && (i += function(e, t, r) {
                            var n = "";
                            n += "<c:serAx>",
                            n += '  <c:axId val="' + t + '"/>',
                            n += '  <c:scaling><c:orientation val="' + (e.serAxisOrientation || (e.barDir,
                            "minMax")) + '"/></c:scaling>',
                            n += '  <c:delete val="' + (e.serAxisHidden ? 1 : 0) + '"/>',
                            n += '  <c:axPos val="' + ("col" === e.barDir ? "b" : "l") + '"/>',
                            n += "none" !== e.serGridLine.style ? Zt(e.serGridLine) : "",
                            e.showSerAxisTitle && (n += Qt({
                                color: e.serAxisTitleColor,
                                fontFace: e.serAxisTitleFontFace,
                                fontSize: e.serAxisTitleFontSize,
                                rotate: e.serAxisTitleRotate,
                                title: e.serAxisTitle || "Axis Title"
                            }));
                            n += '  <c:numFmt formatCode="' + (e.serLabelFormatCode || "General") + '" sourceLinked="0"/>',
                            n += '  <c:majorTickMark val="out"/>',
                            n += '  <c:minorTickMark val="none"/>',
                            n += '  <c:tickLblPos val="' + (e.serAxisLabelPos || "col" === e.barDir ? "low" : "nextTo") + '"/>',
                            n += "  <c:spPr>",
                            n += '    <a:ln w="12700" cap="flat">',
                            n += !1 === e.serAxisLineShow ? "<a:noFill/>" : '<a:solidFill><a:srgbClr val="' + y.color + '"/></a:solidFill>',
                            n += '      <a:prstDash val="solid"/>',
                            n += "      <a:round/>",
                            n += "    </a:ln>",
                            n += "  </c:spPr>",
                            n += "  <c:txPr>",
                            n += "    <a:bodyPr/>",
                            n += "    <a:lstStyle/>",
                            n += "    <a:p>",
                            n += "    <a:pPr>",
                            n += '    <a:defRPr sz="' + (e.serAxisLabelFontSize || x) + '00" b="0" i="0" u="none" strike="noStrike">',
                            n += '      <a:solidFill><a:srgbClr val="' + (e.serAxisLabelColor || b) + '"/></a:solidFill>',
                            n += '      <a:latin typeface="' + (e.serAxisLabelFontFace || "Arial") + '"/>',
                            n += "   </a:defRPr>",
                            n += "  </a:pPr>",
                            n += '  <a:endParaRPr lang="' + (e.lang || "en-US") + '"/>',
                            n += "  </a:p>",
                            n += " </c:txPr>",
                            n += ' <c:crossAx val="' + r + '"/>',
                            n += ' <c:crosses val="autoZero"/>',
                            e.serAxisLabelFrequency && (n += ' <c:tickLblSkip val="' + e.serAxisLabelFrequency + '"/>');
                            e.serLabelFormatCode && (["serAxisBaseTimeUnit", "serAxisMajorTimeUnit", "serAxisMinorTimeUnit"].forEach(function(t) {
                                !e[t] || "string" == typeof e[t] && -1 !== ["days", "months", "years"].indexOf(t.toLowerCase()) || (console.warn("`" + t + "` must be one of: 'days','months','years' !"),
                                e[t] = null)
                            }),
                            e.serAxisBaseTimeUnit && (n += ' <c:baseTimeUnit  val="' + e.serAxisBaseTimeUnit.toLowerCase() + '"/>'),
                            e.serAxisMajorTimeUnit && (n += ' <c:majorTimeUnit val="' + e.serAxisMajorTimeUnit.toLowerCase() + '"/>'),
                            e.serAxisMinorTimeUnit && (n += ' <c:minorTimeUnit val="' + e.serAxisMinorTimeUnit.toLowerCase() + '"/>'),
                            e.serAxisMajorUnit && (n += ' <c:majorUnit     val="' + e.serAxisMajorUnit + '"/>'),
                            e.serAxisMinorUnit && (n += ' <c:minorUnit     val="' + e.serAxisMinorUnit + '"/>'));
                            return n += "</c:serAx>"
                        }(a.opts, F, S)))
                    }
                    a.opts.showDataTable && (i += "<c:dTable>",
                    i += '  <c:showHorzBorder val="' + (!1 === a.opts.showDataTableHorzBorder ? 0 : 1) + '"/>',
                    i += '  <c:showVertBorder val="' + (!1 === a.opts.showDataTableVertBorder ? 0 : 1) + '"/>',
                    i += '  <c:showOutline    val="' + (!1 === a.opts.showDataTableOutline ? 0 : 1) + '"/>',
                    i += '  <c:showKeys       val="' + (!1 === a.opts.showDataTableKeys ? 0 : 1) + '"/>',
                    i += "  <c:spPr>",
                    i += "    <a:noFill/>",
                    i += '    <a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="tx1"><a:lumMod val="15000"/><a:lumOff val="85000"/></a:schemeClr></a:solidFill><a:round/></a:ln>',
                    i += "    <a:effectLst/>",
                    i += "  </c:spPr>",
                    i += "  <c:txPr>",
                    i += '\t  <a:bodyPr rot="0" spcFirstLastPara="1" vertOverflow="ellipsis" vert="horz" wrap="square" anchor="ctr" anchorCtr="1"/>',
                    i += "\t  <a:lstStyle/>",
                    i += "\t  <a:p>",
                    i += '\t\t<a:pPr rtl="0">',
                    i += '       <a:defRPr sz="' + (a.opts.dataTableFontSize || x) + '00" b="0" i="0" u="none" strike="noStrike" kern="1200" baseline="0">',
                    i += '\t\t\t<a:solidFill><a:schemeClr val="tx1"><a:lumMod val="65000"/><a:lumOff val="35000"/></a:schemeClr></a:solidFill>',
                    i += '\t\t\t<a:latin typeface="+mn-lt"/>',
                    i += '\t\t\t<a:ea typeface="+mn-ea"/>',
                    i += '\t\t\t<a:cs typeface="+mn-cs"/>',
                    i += "\t\t  </a:defRPr>",
                    i += "\t\t</a:pPr>",
                    i += '\t\t<a:endParaRPr lang="en-US"/>',
                    i += "\t  </a:p>",
                    i += "\t</c:txPr>",
                    i += "</c:dTable>");
                    i += "  <c:spPr>",
                    i += a.opts.fill ? xt(a.opts.fill) : "<a:noFill/>",
                    i += a.opts.border ? '<a:ln w="' + gt(a.opts.border.pt) + '" cap="flat">' + xt(a.opts.border.color) + "</a:ln>" : "<a:ln><a:noFill/></a:ln>",
                    i += "    <a:effectLst/>",
                    i += "  </c:spPr>",
                    i += "</c:plotArea>",
                    a.opts.showLegend && (i += "<c:legend>",
                    i += '<c:legendPos val="' + a.opts.legendPos + '"/>',
                    i += '<c:overlay val="0"/>',
                    (a.opts.legendFontFace || a.opts.legendFontSize || a.opts.legendColor) && (i += "<c:txPr>",
                    i += "  <a:bodyPr/>",
                    i += "  <a:lstStyle/>",
                    i += "  <a:p>",
                    i += "    <a:pPr>",
                    i += a.opts.legendFontSize ? '<a:defRPr sz="' + 100 * Number(a.opts.legendFontSize) + '">' : "<a:defRPr>",
                    a.opts.legendColor && (i += xt(a.opts.legendColor)),
                    a.opts.legendFontFace && (i += '<a:latin typeface="' + a.opts.legendFontFace + '"/>'),
                    a.opts.legendFontFace && (i += '<a:cs    typeface="' + a.opts.legendFontFace + '"/>'),
                    i += "      </a:defRPr>",
                    i += "    </a:pPr>",
                    i += '    <a:endParaRPr lang="en-US"/>',
                    i += "  </a:p>",
                    i += "</c:txPr>"),
                    i += "</c:legend>");
                    i += '  <c:plotVisOnly val="1"/>',
                    i += '  <c:dispBlanksAs val="' + a.opts.displayBlanksAs + '"/>',
                    a.opts._type === Z.SCATTER && (i += '<c:showDLblsOverMax val="1"/>');
                    return i += "</c:chart>",
                    i += "<c:spPr>",
                    i += "  <a:noFill/>",
                    i += '  <a:ln w="12700" cap="flat"><a:noFill/><a:miter lim="400000"/></a:ln>',
                    i += "  <a:effectLst/>",
                    i += "</c:spPr>",
                    i += '<c:externalData r:id="rId1"><c:autoUpdate val="0"/></c:externalData>',
                    i += "</c:chartSpace>"
                }(p)),
                e()
            }).catch(function(t) {
                r(t)
            })
        }
        )
    }
    function Gt(n, a, i, t, e, r) {
        var o = "";
        switch (n) {
        case Z.AREA:
        case Z.BAR:
        case Z.BAR3D:
        case Z.LINE:
        case Z.RADAR:
            o += "<c:" + n + "Chart>",
            n === Z.AREA && "stacked" === i.barGrouping && (o += '<c:grouping val="' + i.barGrouping + '"/>'),
            n !== Z.BAR && n !== Z.BAR3D || (o += '<c:barDir val="' + i.barDir + '"/>',
            o += '<c:grouping val="' + i.barGrouping + '"/>'),
            n === Z.RADAR && (o += '<c:radarStyle val="' + i.radarStyle + '"/>'),
            o += '<c:varyColors val="0"/>';
            var s = -1;
            a.forEach(function(t) {
                s++;
                var e = t.index;
                o += "<c:ser>",
                o += '  <c:idx val="' + e + '"/>',
                o += '  <c:order val="' + e + '"/>',
                o += "  <c:tx>",
                o += "    <c:strRef>",
                o += "      <c:f>Sheet1!$" + Yt(e + 1) + "$1</c:f>",
                o += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + ht(t.name) + "</c:v></c:pt></c:strCache>",
                o += "    </c:strRef>",
                o += "  </c:tx>",
                o += '  <c:invertIfNegative val="0"/>';
                var r = i.chartColors ? i.chartColors[s % i.chartColors.length] : null;
                o += "  <c:spPr>",
                "transparent" === r ? o += "<a:noFill/>" : i.chartColorsOpacity ? o += "<a:solidFill>" + bt(r, '<a:alpha val="' + i.chartColorsOpacity + '000"/>') + "</a:solidFill>" : o += "<a:solidFill>" + bt(r) + "</a:solidFill>",
                n === Z.LINE ? 0 === i.lineSize ? o += "<a:ln><a:noFill/></a:ln>" : (o += '<a:ln w="' + gt(i.lineSize) + '" cap="flat"><a:solidFill>' + bt(r) + "</a:solidFill>",
                o += '<a:prstDash val="' + (i.lineDash || "solid") + '"/><a:round/></a:ln>') : i.dataBorder && (o += '<a:ln w="' + gt(i.dataBorder.pt) + '" cap="flat"><a:solidFill>' + bt(i.dataBorder.color) + '</a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>'),
                o += qt(i.shadow, _),
                o += "  </c:spPr>",
                n !== Z.RADAR && (o += "  <c:dLbls>",
                o += '    <c:numFmt formatCode="' + i.dataLabelFormatCode + '" sourceLinked="0"/>',
                i.dataLabelBkgrdColors && (o += "    <c:spPr>",
                o += "       <a:solidFill>" + bt(r) + "</a:solidFill>",
                o += "    </c:spPr>"),
                o += "    <c:txPr>",
                o += "      <a:bodyPr/>",
                o += "      <a:lstStyle/>",
                o += "      <a:p><a:pPr>",
                o += '        <a:defRPr b="0" i="0" strike="noStrike" sz="' + (i.dataLabelFontSize || x) + '00" u="none">',
                o += "          <a:solidFill>" + bt(i.dataLabelColor || b) + "</a:solidFill>",
                o += '          <a:latin typeface="' + (i.dataLabelFontFace || "Arial") + '"/>',
                o += "        </a:defRPr>",
                o += "      </a:pPr></a:p>",
                o += "    </c:txPr>",
                n !== Z.AREA && n !== Z.BAR3D && i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
                o += '    <c:showLegendKey val="0"/>',
                o += '    <c:showVal val="' + (i.showValue ? "1" : "0") + '"/>',
                o += '    <c:showCatName val="0"/>',
                o += '    <c:showSerName val="0"/>',
                o += '    <c:showPercent val="0"/>',
                o += '    <c:showBubbleSize val="0"/>',
                o += '    <c:showLeaderLines val="' + (i.showLeaderLines ? "1" : "0") + '"/>',
                o += "  </c:dLbls>"),
                n !== Z.LINE && n !== Z.RADAR || (o += "<c:marker>",
                o += '  <c:symbol val="' + i.lineDataSymbol + '"/>',
                i.lineDataSymbolSize && (o += '  <c:size val="' + i.lineDataSymbolSize + '"/>'),
                o += "  <c:spPr>",
                o += "    <a:solidFill>" + bt(i.chartColors[e + 1 > i.chartColors.length ? Math.floor(Math.random() * i.chartColors.length) : e]) + "</a:solidFill>",
                o += '    <a:ln w="' + i.lineDataSymbolLineSize + '" cap="flat"><a:solidFill>' + bt(i.lineDataSymbolLineColor || r) + '</a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>',
                o += "    <a:effectLst/>",
                o += "  </c:spPr>",
                o += "</c:marker>"),
                n !== Z.BAR && n !== Z.BAR3D || 1 !== a.length && !i.valueBarColors || i.chartColors === O || t.values.forEach(function(t, e) {
                    var r = t < 0 ? i.invertedColors || i.chartColors || O : i.chartColors || [];
                    o += "  <c:dPt>",
                    o += '    <c:idx val="' + e + '"/>',
                    o += '      <c:invertIfNegative val="0"/>',
                    o += '    <c:bubble3D val="0"/>',
                    o += "    <c:spPr>",
                    0 === i.lineSize ? o += "<a:ln><a:noFill/></a:ln>" : n === Z.BAR ? (o += "<a:solidFill>",
                    o += '  <a:srgbClr val="' + r[e % r.length] + '"/>',
                    o += "</a:solidFill>") : (o += "<a:ln>",
                    o += "  <a:solidFill>",
                    o += '   <a:srgbClr val="' + r[e % r.length] + '"/>',
                    o += "  </a:solidFill>",
                    o += "</a:ln>"),
                    o += qt(i.shadow, _),
                    o += "    </c:spPr>",
                    o += "  </c:dPt>"
                }),
                o += "<c:cat>",
                i.catLabelFormatCode ? (o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$A$2:$A$" + (t.labels.length + 1) + "</c:f>",
                o += "    <c:numCache>",
                o += "      <c:formatCode>" + (i.catLabelFormatCode || "General") + "</c:formatCode>",
                o += '      <c:ptCount val="' + t.labels.length + '"/>',
                t.labels.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + ht(t) + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>") : (o += "  <c:strRef>",
                o += "    <c:f>Sheet1!$A$2:$A$" + (t.labels.length + 1) + "</c:f>",
                o += "    <c:strCache>",
                o += '\t     <c:ptCount val="' + t.labels.length + '"/>',
                t.labels.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + ht(t) + "</c:v></c:pt>"
                }),
                o += "    </c:strCache>",
                o += "  </c:strRef>"),
                o += "</c:cat>",
                o += "<c:val>",
                o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$" + Yt(e + 1) + "$2:$" + Yt(e + 1) + "$" + (t.labels.length + 1) + "</c:f>",
                o += "    <c:numCache>",
                o += "      <c:formatCode>" + (i.valLabelFormatCode || i.dataTableFormatCode || "General") + "</c:formatCode>",
                o += '      <c:ptCount val="' + t.labels.length + '"/>',
                t.values.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (t || 0 === t ? t : "") + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>",
                o += "</c:val>",
                n === Z.LINE && (o += '<c:smooth val="' + (i.lineSmooth ? "1" : "0") + '"/>'),
                o += "</c:ser>"
            }),
            o += "  <c:dLbls>",
            o += '    <c:numFmt formatCode="' + i.dataLabelFormatCode + '" sourceLinked="0"/>',
            o += "    <c:txPr>",
            o += "      <a:bodyPr/>",
            o += "      <a:lstStyle/>",
            o += "      <a:p><a:pPr>",
            o += '        <a:defRPr b="' + (i.dataLabelFontBold ? 1 : 0) + '" i="0" strike="noStrike" sz="' + (i.dataLabelFontSize || x) + '00" u="none">',
            o += "          <a:solidFill>" + bt(i.dataLabelColor || b) + "</a:solidFill>",
            o += '          <a:latin typeface="' + (i.dataLabelFontFace || "Arial") + '"/>',
            o += "        </a:defRPr>",
            o += "      </a:pPr></a:p>",
            o += "    </c:txPr>",
            i._type === Z.AREA || i._type === Z.RADAR || r || i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
            o += '    <c:showLegendKey val="0"/>',
            o += '    <c:showVal val="' + (i.showValue ? "1" : "0") + '"/>',
            o += '    <c:showCatName val="0"/>',
            o += '    <c:showSerName val="0"/>',
            o += '    <c:showPercent val="0"/>',
            o += '    <c:showBubbleSize val="0"/>',
            o += '    <c:showLeaderLines val="' + (i.showLeaderLines ? "1" : "0") + '"/>',
            o += "  </c:dLbls>",
            n === Z.BAR ? (o += '  <c:gapWidth val="' + i.barGapWidthPct + '"/>',
            o += '  <c:overlap val="' + (-1 < (i.barGrouping || "").indexOf("tacked") ? 100 : 0) + '"/>') : n === Z.BAR3D ? (o += '  <c:gapWidth val="' + i.barGapWidthPct + '"/>',
            o += '  <c:gapDepth val="' + i.barGapDepthPct + '"/>',
            o += '  <c:shape val="' + i.bar3DShape + '"/>') : n === Z.LINE && (o += '  <c:marker val="1"/>'),
            o += '  <c:axId val="' + e + '"/>',
            o += '  <c:axId val="' + t + '"/>',
            o += '  <c:axId val="' + F + '"/>',
            o += "</c:" + n + "Chart>";
            break;
        case Z.SCATTER:
            o += "<c:" + n + "Chart>",
            o += '<c:scatterStyle val="lineMarker"/>',
            o += '<c:varyColors val="0"/>',
            s = -1,
            a.filter(function(t, e) {
                return 0 < e
            }).forEach(function(r, t) {
                s++,
                o += "<c:ser>",
                o += '  <c:idx val="' + t + '"/>',
                o += '  <c:order val="' + t + '"/>',
                o += "  <c:tx>",
                o += "    <c:strRef>",
                o += "      <c:f>Sheet1!$" + I[t + 1] + "$1</c:f>",
                o += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + r.name + "</c:v></c:pt></c:strCache>",
                o += "    </c:strRef>",
                o += "  </c:tx>",
                o += "  <c:spPr>";
                var e = i.chartColors[s % i.chartColors.length];
                if ("transparent" === e ? o += "<a:noFill/>" : i.chartColorsOpacity ? o += "<a:solidFill>" + bt(e, '<a:alpha val="' + i.chartColorsOpacity + '000"/>') + "</a:solidFill>" : o += "<a:solidFill>" + bt(e) + "</a:solidFill>",
                0 === i.lineSize ? o += "<a:ln><a:noFill/></a:ln>" : (o += '<a:ln w="' + gt(i.lineSize) + '" cap="flat"><a:solidFill>' + bt(e) + "</a:solidFill>",
                o += '<a:prstDash val="' + (i.lineDash || "solid") + '"/><a:round/></a:ln>'),
                o += qt(i.shadow, _),
                o += "  </c:spPr>",
                o += "<c:marker>",
                o += '  <c:symbol val="' + i.lineDataSymbol + '"/>',
                i.lineDataSymbolSize && (o += '  <c:size val="' + i.lineDataSymbolSize + '"/>'),
                o += "  <c:spPr>",
                o += "    <a:solidFill>" + bt(i.chartColors[t + 1 > i.chartColors.length ? Math.floor(Math.random() * i.chartColors.length) : t]) + "</a:solidFill>",
                o += '    <a:ln w="' + i.lineDataSymbolLineSize + '" cap="flat"><a:solidFill>' + bt(i.lineDataSymbolLineColor || i.chartColors[s % i.chartColors.length]) + '</a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>',
                o += "    <a:effectLst/>",
                o += "  </c:spPr>",
                o += "</c:marker>",
                i.showLabel) {
                    var n = ft("-xxxx-xxxx-xxxx-xxxxxxxxxxxx");
                    !r.labels || "custom" !== i.dataLabelFormatScatter && "customXY" !== i.dataLabelFormatScatter || (o += "<c:dLbls>",
                    r.labels.forEach(function(t, e) {
                        "custom" !== i.dataLabelFormatScatter && "customXY" !== i.dataLabelFormatScatter || (o += "  <c:dLbl>",
                        o += '    <c:idx val="' + e + '"/>',
                        o += "    <c:tx>",
                        o += "      <c:rich>",
                        o += "\t\t\t<a:bodyPr>",
                        o += "\t\t\t\t<a:spAutoFit/>",
                        o += "\t\t\t</a:bodyPr>",
                        o += "        \t<a:lstStyle/>",
                        o += "        \t<a:p>",
                        o += "\t\t\t\t<a:pPr>",
                        o += "\t\t\t\t\t<a:defRPr/>",
                        o += "\t\t\t\t</a:pPr>",
                        o += "          \t<a:r>",
                        o += '            \t\t<a:rPr lang="' + (i.lang || "en-US") + '" dirty="0"/>',
                        o += "            \t\t<a:t>" + ht(t) + "</a:t>",
                        o += "          \t</a:r>",
                        "customXY" !== i.dataLabelFormatScatter || /^ *$/.test(t) || (o += "          \t<a:r>",
                        o += '          \t\t<a:rPr lang="' + (i.lang || "en-US") + '" baseline="0" dirty="0"/>',
                        o += "          \t\t<a:t> (</a:t>",
                        o += "          \t</a:r>",
                        o += '          \t<a:fld id="{' + ft("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") + '}" type="XVALUE">',
                        o += '          \t\t<a:rPr lang="' + (i.lang || "en-US") + '" baseline="0"/>',
                        o += "          \t\t<a:pPr>",
                        o += "          \t\t\t<a:defRPr/>",
                        o += "          \t\t</a:pPr>",
                        o += "          \t\t<a:t>[" + ht(r.name) + "</a:t>",
                        o += "          \t</a:fld>",
                        o += "          \t<a:r>",
                        o += '          \t\t<a:rPr lang="' + (i.lang || "en-US") + '" baseline="0" dirty="0"/>',
                        o += "          \t\t<a:t>, </a:t>",
                        o += "          \t</a:r>",
                        o += '          \t<a:fld id="{' + ft("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") + '}" type="YVALUE">',
                        o += '          \t\t<a:rPr lang="' + (i.lang || "en-US") + '" baseline="0"/>',
                        o += "          \t\t<a:pPr>",
                        o += "          \t\t\t<a:defRPr/>",
                        o += "          \t\t</a:pPr>",
                        o += "          \t\t<a:t>[" + ht(r.name) + "]</a:t>",
                        o += "          \t</a:fld>",
                        o += "          \t<a:r>",
                        o += '          \t\t<a:rPr lang="' + (i.lang || "en-US") + '" baseline="0" dirty="0"/>',
                        o += "          \t\t<a:t>)</a:t>",
                        o += "          \t</a:r>",
                        o += '          \t<a:endParaRPr lang="' + (i.lang || "en-US") + '" dirty="0"/>'),
                        o += "        \t</a:p>",
                        o += "      </c:rich>",
                        o += "    </c:tx>",
                        o += "    <c:spPr>",
                        o += "    \t<a:noFill/>",
                        o += "    \t<a:ln>",
                        o += "    \t\t<a:noFill/>",
                        o += "    \t</a:ln>",
                        o += "    \t<a:effectLst/>",
                        o += "    </c:spPr>",
                        i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
                        o += '    <c:showLegendKey val="0"/>',
                        o += '    <c:showVal val="0"/>',
                        o += '    <c:showCatName val="0"/>',
                        o += '    <c:showSerName val="0"/>',
                        o += '    <c:showPercent val="0"/>',
                        o += '    <c:showBubbleSize val="0"/>',
                        o += '\t   <c:showLeaderLines val="1"/>',
                        o += "    <c:extLst>",
                        o += '      <c:ext uri="{CE6537A1-D6FC-4f65-9D91-7224C49458BB}" xmlns:c15="http://schemas.microsoft.com/office/drawing/2012/chart"/>',
                        o += '      <c:ext uri="{C3380CC4-5D6E-409C-BE32-E72D297353CC}" xmlns:c16="http://schemas.microsoft.com/office/drawing/2014/chart">',
                        o += '\t\t\t<c16:uniqueId val="{' + "00000000".substring(0, 8 - (e + 1).toString().length).toString() + (e + 1) + n + '}"/>',
                        o += "      </c:ext>",
                        o += "\t\t</c:extLst>",
                        o += "</c:dLbl>")
                    }),
                    o += "</c:dLbls>"),
                    "XY" === i.dataLabelFormatScatter && (o += "<c:dLbls>",
                    o += "\t<c:spPr>",
                    o += "\t\t<a:noFill/>",
                    o += "\t\t<a:ln>",
                    o += "\t\t\t<a:noFill/>",
                    o += "\t\t</a:ln>",
                    o += "\t  \t<a:effectLst/>",
                    o += "\t</c:spPr>",
                    o += "\t<c:txPr>",
                    o += "\t\t<a:bodyPr>",
                    o += "\t\t\t<a:spAutoFit/>",
                    o += "\t\t</a:bodyPr>",
                    o += "\t\t<a:lstStyle/>",
                    o += "\t\t<a:p>",
                    o += "\t    \t<a:pPr>",
                    o += "        \t\t<a:defRPr/>",
                    o += "\t    \t</a:pPr>",
                    o += '\t    \t<a:endParaRPr lang="en-US"/>',
                    o += "\t\t</a:p>",
                    o += "\t</c:txPr>",
                    i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
                    o += '\t<c:showLegendKey val="0"/>',
                    o += ' <c:showVal val="' + (i.showLabel ? "1" : "0") + '"/>',
                    o += ' <c:showCatName val="' + (i.showLabel ? "1" : "0") + '"/>',
                    o += '\t<c:showSerName val="0"/>',
                    o += '\t<c:showPercent val="0"/>',
                    o += '\t<c:showBubbleSize val="0"/>',
                    o += "\t<c:extLst>",
                    o += '\t\t<c:ext uri="{CE6537A1-D6FC-4f65-9D91-7224C49458BB}" xmlns:c15="http://schemas.microsoft.com/office/drawing/2012/chart">',
                    o += '\t\t\t<c15:showLeaderLines val="1"/>',
                    o += "\t\t</c:ext>",
                    o += "\t</c:extLst>",
                    o += "</c:dLbls>")
                }
                1 !== a.length && !i.valueBarColors || i.chartColors === O || r.values.forEach(function(t, e) {
                    var r = t < 0 ? i.invertedColors || O : i.chartColors || [];
                    o += "  <c:dPt>",
                    o += '    <c:idx val="' + e + '"/>',
                    o += '      <c:invertIfNegative val="0"/>',
                    o += '    <c:bubble3D val="0"/>',
                    o += "    <c:spPr>",
                    0 === i.lineSize ? o += "<a:ln><a:noFill/></a:ln>" : (o += "<a:solidFill>",
                    o += ' <a:srgbClr val="' + r[e % r.length] + '"/>',
                    o += "</a:solidFill>"),
                    o += qt(i.shadow, _),
                    o += "    </c:spPr>",
                    o += "  </c:dPt>"
                }),
                o += "<c:xVal>",
                o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$A$2:$A$" + (a[0].values.length + 1) + "</c:f>",
                o += "    <c:numCache>",
                o += "      <c:formatCode>General</c:formatCode>",
                o += '      <c:ptCount val="' + a[0].values.length + '"/>',
                a[0].values.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (t || 0 === t ? t : "") + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>",
                o += "</c:xVal>",
                o += "<c:yVal>",
                o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$" + Yt(t + 1) + "$2:$" + Yt(t + 1) + "$" + (a[0].values.length + 1) + "</c:f>",
                o += "    <c:numCache>",
                o += "      <c:formatCode>General</c:formatCode>",
                o += '      <c:ptCount val="' + a[0].values.length + '"/>',
                a[0].values.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (r.values[e] || 0 === r.values[e] ? r.values[e] : "") + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>",
                o += "</c:yVal>",
                o += '<c:smooth val="' + (i.lineSmooth ? "1" : "0") + '"/>',
                o += "</c:ser>"
            }),
            o += "  <c:dLbls>",
            o += '    <c:numFmt formatCode="' + i.dataLabelFormatCode + '" sourceLinked="0"/>',
            o += "    <c:txPr>",
            o += "      <a:bodyPr/>",
            o += "      <a:lstStyle/>",
            o += "      <a:p><a:pPr>",
            o += '        <a:defRPr b="0" i="0" strike="noStrike" sz="' + (i.dataLabelFontSize || x) + '00" u="none">',
            o += "          <a:solidFill>" + bt(i.dataLabelColor || b) + "</a:solidFill>",
            o += '          <a:latin typeface="' + (i.dataLabelFontFace || "Arial") + '"/>',
            o += "        </a:defRPr>",
            o += "      </a:pPr></a:p>",
            o += "    </c:txPr>",
            i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
            o += '    <c:showLegendKey val="0"/>',
            o += '    <c:showVal val="' + (i.showValue ? "1" : "0") + '"/>',
            o += '    <c:showCatName val="0"/>',
            o += '    <c:showSerName val="0"/>',
            o += '    <c:showPercent val="0"/>',
            o += '    <c:showBubbleSize val="0"/>',
            o += "  </c:dLbls>",
            o += '  <c:axId val="' + e + '"/>',
            o += '  <c:axId val="' + t + '"/>',
            o += "</c:" + n + "Chart>";
            break;
        case Z.BUBBLE:
            o += "<c:" + n + "Chart>",
            o += '<c:varyColors val="0"/>',
            s = -1;
            var l = 1;
            a.filter(function(t, e) {
                return 0 < e
            }).forEach(function(r, t) {
                s++,
                o += "<c:ser>",
                o += '  <c:idx val="' + t + '"/>',
                o += '  <c:order val="' + t + '"/>',
                o += "  <c:tx>",
                o += "    <c:strRef>",
                o += "      <c:f>Sheet1!$" + I[l] + "$1</c:f>",
                o += '      <c:strCache><c:ptCount val="1"/><c:pt idx="0"><c:v>' + r.name + "</c:v></c:pt></c:strCache>",
                o += "    </c:strRef>",
                o += "  </c:tx>",
                o += "<c:spPr>";
                var e = i.chartColors[s % i.chartColors.length];
                "transparent" === e ? o += "<a:noFill/>" : i.chartColorsOpacity ? o += "<a:solidFill>" + bt(e, '<a:alpha val="' + i.chartColorsOpacity + '000"/>') + "</a:solidFill>" : o += "<a:solidFill>" + bt(e) + "</a:solidFill>",
                0 === i.lineSize ? o += "<a:ln><a:noFill/></a:ln>" : i.dataBorder ? o += '<a:ln w="' + gt(i.dataBorder.pt) + '" cap="flat"><a:solidFill>' + bt(i.dataBorder.color) + '</a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>' : (o += '<a:ln w="' + gt(i.lineSize) + '" cap="flat"><a:solidFill>' + bt(e) + "</a:solidFill>",
                o += '<a:prstDash val="' + (i.lineDash || "solid") + '"/><a:round/></a:ln>'),
                o += qt(i.shadow, _),
                o += "</c:spPr>",
                o += "<c:xVal>",
                o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$A$2:$A$" + (a[0].values.length + 1) + "</c:f>",
                o += "    <c:numCache>",
                o += "      <c:formatCode>General</c:formatCode>",
                o += '      <c:ptCount val="' + a[0].values.length + '"/>',
                a[0].values.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (t || 0 === t ? t : "") + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>",
                o += "</c:xVal>",
                o += "<c:yVal>",
                o += "  <c:numRef>",
                o += "    <c:f>Sheet1!$" + Yt(l) + "$2:$" + Yt(l) + "$" + (a[0].values.length + 1) + "</c:f>",
                l++,
                o += "    <c:numCache>",
                o += "      <c:formatCode>General</c:formatCode>",
                o += '      <c:ptCount val="' + a[0].values.length + '"/>',
                a[0].values.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (r.values[e] || 0 === r.values[e] ? r.values[e] : "") + "</c:v></c:pt>"
                }),
                o += "    </c:numCache>",
                o += "  </c:numRef>",
                o += "</c:yVal>",
                o += "  <c:bubbleSize>",
                o += "    <c:numRef>",
                o += "      <c:f>Sheet1!$" + Yt(l) + "$2:$" + Yt(t + 2) + "$" + (r.sizes.length + 1) + "</c:f>",
                l++,
                o += "      <c:numCache>",
                o += "        <c:formatCode>General</c:formatCode>",
                o += '\t       <c:ptCount val="' + r.sizes.length + '"/>',
                r.sizes.forEach(function(t, e) {
                    o += '<c:pt idx="' + e + '"><c:v>' + (t || "") + "</c:v></c:pt>"
                }),
                o += "      </c:numCache>",
                o += "    </c:numRef>",
                o += "  </c:bubbleSize>",
                o += '  <c:bubble3D val="0"/>',
                o += "</c:ser>"
            }),
            o += "  <c:dLbls>",
            o += '    <c:numFmt formatCode="' + i.dataLabelFormatCode + '" sourceLinked="0"/>',
            o += "    <c:txPr>",
            o += "      <a:bodyPr/>",
            o += "      <a:lstStyle/>",
            o += "      <a:p><a:pPr>",
            o += '        <a:defRPr b="0" i="0" strike="noStrike" sz="' + (i.dataLabelFontSize || x) + '00" u="none">',
            o += "          <a:solidFill>" + bt(i.dataLabelColor || b) + "</a:solidFill>",
            o += '          <a:latin typeface="' + (i.dataLabelFontFace || "Arial") + '"/>',
            o += "        </a:defRPr>",
            o += "      </a:pPr></a:p>",
            o += "    </c:txPr>",
            i.dataLabelPosition && (o += ' <c:dLblPos val="' + i.dataLabelPosition + '"/>'),
            o += '    <c:showLegendKey val="0"/>',
            o += '    <c:showVal val="' + (i.showValue ? "1" : "0") + '"/>',
            o += '    <c:showCatName val="0"/>',
            o += '    <c:showSerName val="0"/>',
            o += '    <c:showPercent val="0"/>',
            o += '    <c:showBubbleSize val="0"/>',
            o += "  </c:dLbls>",
            o += '  <c:axId val="' + e + '"/>',
            o += '  <c:axId val="' + t + '"/>',
            o += "</c:" + n + "Chart>";
            break;
        case Z.DOUGHNUT:
        case Z.PIE:
            var c = a[0];
            o += "<c:" + n + "Chart>",
            o += '  <c:varyColors val="0"/>',
            o += "<c:ser>",
            o += '  <c:idx val="0"/>',
            o += '  <c:order val="0"/>',
            o += "  <c:tx>",
            o += "    <c:strRef>",
            o += "      <c:f>Sheet1!$B$1</c:f>",
            o += "      <c:strCache>",
            o += '        <c:ptCount val="1"/>',
            o += '        <c:pt idx="0"><c:v>' + ht(c.name) + "</c:v></c:pt>",
            o += "      </c:strCache>",
            o += "    </c:strRef>",
            o += "  </c:tx>",
            o += "  <c:spPr>",
            o += '    <a:solidFill><a:schemeClr val="accent1"/></a:solidFill>',
            o += '    <a:ln w="9525" cap="flat"><a:solidFill><a:srgbClr val="F9F9F9"/></a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>',
            i.dataNoEffects ? o += "<a:effectLst/>" : o += qt(i.shadow, _),
            o += "  </c:spPr>",
            c.labels.forEach(function(t, e) {
                o += "<c:dPt>",
                o += ' <c:idx val="' + e + '"/>',
                o += ' <c:bubble3D val="0"/>',
                o += " <c:spPr>",
                o += "<a:solidFill>" + bt(i.chartColors[e + 1 > i.chartColors.length ? Math.floor(Math.random() * i.chartColors.length) : e]) + "</a:solidFill>",
                i.dataBorder && (o += '<a:ln w="' + gt(i.dataBorder.pt) + '" cap="flat"><a:solidFill>' + bt(i.dataBorder.color) + '</a:solidFill><a:prstDash val="solid"/><a:round/></a:ln>'),
                o += qt(i.shadow, _),
                o += "  </c:spPr>",
                o += "</c:dPt>"
            }),
            o += "<c:dLbls>",
            c.labels.forEach(function(t, e) {
                o += "<c:dLbl>",
                o += ' <c:idx val="' + e + '"/>',
                o += '  <c:numFmt formatCode="' + (i.dataLabelFormatCode || "General") + '" sourceLinked="0"/>',
                o += "  <c:spPr/><c:txPr>",
                o += "   <a:bodyPr/><a:lstStyle/>",
                o += "   <a:p><a:pPr>",
                o += '   <a:defRPr sz="' + (i.dataLabelFontSize || x) + '00" b="' + (i.dataLabelFontBold ? 1 : 0) + '" i="0" u="none" strike="noStrike">',
                o += "    <a:solidFill>" + bt(i.dataLabelColor || b) + "</a:solidFill>",
                o += '    <a:latin typeface="' + (i.dataLabelFontFace || "Arial") + '"/>',
                o += "   </a:defRPr>",
                o += "      </a:pPr></a:p>",
                o += "    </c:txPr>",
                n === Z.PIE && i.dataLabelPosition,
                o += '    <c:showLegendKey val="0"/>',
                o += '    <c:showVal val="' + (i.showValue ? "1" : "0") + '"/>',
                o += '    <c:showCatName val="' + (i.showLabel ? "1" : "0") + '"/>',
                o += '    <c:showSerName val="0"/>',
                o += '    <c:showPercent val="' + (i.showPercent ? "1" : "0") + '"/>',
                o += '    <c:showBubbleSize val="0"/>',
                o += "  </c:dLbl>"
            }),
            o += ' <c:numFmt formatCode="' + (i.dataLabelFormatCode || "General") + '" sourceLinked="0"/>',
            o += "\t<c:txPr>",
            o += "\t  <a:bodyPr/>",
            o += "\t  <a:lstStyle/>",
            o += "\t  <a:p>",
            o += "\t\t<a:pPr>",
            o += '\t\t  <a:defRPr sz="1800" b="0" i="0" u="none" strike="noStrike">',
            o += '\t\t\t<a:solidFill><a:srgbClr val="000000"/></a:solidFill><a:latin typeface="Arial"/>',
            o += "\t\t  </a:defRPr>",
            o += "\t\t</a:pPr>",
            o += "\t  </a:p>",
            o += "\t</c:txPr>",
            o += n === Z.PIE ? '<c:dLblPos val="ctr"/>' : "",
            o += '\t<c:showLegendKey val="0"/>',
            o += '\t<c:showVal val="0"/>',
            o += '\t<c:showCatName val="1"/>',
            o += '\t<c:showSerName val="0"/>',
            o += '\t<c:showPercent val="1"/>',
            o += '\t<c:showBubbleSize val="0"/>',
            o += ' <c:showLeaderLines val="' + (i.showLeaderLines ? "1" : "0") + '"/>',
            o += "</c:dLbls>",
            o += "<c:cat>",
            o += "  <c:strRef>",
            o += "    <c:f>Sheet1!$A$2:$A$" + (c.labels.length + 1) + "</c:f>",
            o += "    <c:strCache>",
            o += '\t     <c:ptCount val="' + c.labels.length + '"/>',
            c.labels.forEach(function(t, e) {
                o += '<c:pt idx="' + e + '"><c:v>' + ht(t) + "</c:v></c:pt>"
            }),
            o += "    </c:strCache>",
            o += "  </c:strRef>",
            o += "</c:cat>",
            o += "  <c:val>",
            o += "    <c:numRef>",
            o += "      <c:f>Sheet1!$B$2:$B$" + (c.labels.length + 1) + "</c:f>",
            o += "      <c:numCache>",
            o += '\t       <c:ptCount val="' + c.labels.length + '"/>',
            c.values.forEach(function(t, e) {
                o += '<c:pt idx="' + e + '"><c:v>' + (t || 0 === t ? t : "") + "</c:v></c:pt>"
            }),
            o += "      </c:numCache>",
            o += "    </c:numRef>",
            o += "  </c:val>",
            o += "  </c:ser>",
            o += '  <c:firstSliceAng val="0"/>',
            n === Z.DOUGHNUT && (o += '  <c:holeSize val="' + (i.holeSize || 50) + '"/>'),
            o += "</c:" + n + "Chart>";
            break;
        default:
            o += ""
        }
        return o
    }
    function Ht(e, t, r) {
        var n = "";
        return e._type === Z.SCATTER || e._type === Z.BUBBLE ? n += "<c:valAx>" : n += "<c:" + (e.catLabelFormatCode ? "dateAx" : "catAx") + ">",
        n += '  <c:axId val="' + t + '"/>',
        n += "  <c:scaling>",
        n += '<c:orientation val="' + (e.catAxisOrientation || (e.barDir,
        "minMax")) + '"/>',
        !e.catAxisMaxVal && 0 !== e.catAxisMaxVal || (n += '<c:max val="' + e.catAxisMaxVal + '"/>'),
        !e.catAxisMinVal && 0 !== e.catAxisMinVal || (n += '<c:min val="' + e.catAxisMinVal + '"/>'),
        n += "</c:scaling>",
        n += '  <c:delete val="' + (e.catAxisHidden ? 1 : 0) + '"/>',
        n += '  <c:axPos val="' + ("col" === e.barDir ? "b" : "l") + '"/>',
        n += "none" !== e.catGridLine.style ? Zt(e.catGridLine) : "",
        e.showCatAxisTitle && (n += Qt({
            color: e.catAxisTitleColor,
            fontFace: e.catAxisTitleFontFace,
            fontSize: e.catAxisTitleFontSize,
            rotate: e.catAxisTitleRotate,
            title: e.catAxisTitle || "Axis Title"
        })),
        e._type === Z.SCATTER || e._type === Z.BUBBLE ? n += '  <c:numFmt formatCode="' + (e.valAxisLabelFormatCode ? e.valAxisLabelFormatCode : "General") + '" sourceLinked="0"/>' : n += '  <c:numFmt formatCode="' + (e.catLabelFormatCode || "General") + '" sourceLinked="0"/>',
        e._type === Z.SCATTER ? (n += '  <c:majorTickMark val="none"/>',
        n += '  <c:minorTickMark val="none"/>',
        n += '  <c:tickLblPos val="nextTo"/>') : (n += '  <c:majorTickMark val="' + (e.catAxisMajorTickMark || "out") + '"/>',
        n += '  <c:minorTickMark val="' + (e.catAxisMajorTickMark || "none") + '"/>',
        n += '  <c:tickLblPos val="' + (e.catAxisLabelPos || "col" === e.barDir ? "low" : "nextTo") + '"/>'),
        n += "  <c:spPr>",
        n += '    <a:ln w="12700" cap="flat">',
        n += !1 === e.catAxisLineShow ? "<a:noFill/>" : '<a:solidFill><a:srgbClr val="' + y.color + '"/></a:solidFill>',
        n += '      <a:prstDash val="solid"/>',
        n += "      <a:round/>",
        n += "    </a:ln>",
        n += "  </c:spPr>",
        n += "  <c:txPr>",
        n += "    <a:bodyPr" + (e.catAxisLabelRotate ? ' rot="' + At(e.catAxisLabelRotate) + '"' : "") + "/>",
        n += "    <a:lstStyle/>",
        n += "    <a:p>",
        n += "    <a:pPr>",
        n += '    <a:defRPr sz="' + (e.catAxisLabelFontSize || x) + '00" b="' + (e.catAxisLabelFontBold ? 1 : 0) + '" i="0" u="none" strike="noStrike">',
        n += '      <a:solidFill><a:srgbClr val="' + (e.catAxisLabelColor || b) + '"/></a:solidFill>',
        n += '      <a:latin typeface="' + (e.catAxisLabelFontFace || "Arial") + '"/>',
        n += "   </a:defRPr>",
        n += "  </a:pPr>",
        n += '  <a:endParaRPr lang="' + (e.lang || "en-US") + '"/>',
        n += "  </a:p>",
        n += " </c:txPr>",
        n += ' <c:crossAx val="' + r + '"/>',
        n += " <c:" + ("number" == typeof e.valAxisCrossesAt ? "crossesAt" : "crosses") + ' val="' + e.valAxisCrossesAt + '"/>',
        n += ' <c:auto val="1"/>',
        n += ' <c:lblAlgn val="ctr"/>',
        n += ' <c:noMultiLvlLbl val="1"/>',
        e.catAxisLabelFrequency && (n += ' <c:tickLblSkip val="' + e.catAxisLabelFrequency + '"/>'),
        e.catLabelFormatCode && (["catAxisBaseTimeUnit", "catAxisMajorTimeUnit", "catAxisMinorTimeUnit"].forEach(function(t) {
            !e[t] || "string" == typeof e[t] && -1 !== ["days", "months", "years"].indexOf(e[t].toLowerCase()) || (console.warn("`" + t + "` must be one of: 'days','months','years' !"),
            e[t] = null)
        }),
        e.catAxisBaseTimeUnit && (n += '<c:baseTimeUnit val="' + e.catAxisBaseTimeUnit.toLowerCase() + '"/>'),
        e.catAxisMajorTimeUnit && (n += '<c:majorTimeUnit val="' + e.catAxisMajorTimeUnit.toLowerCase() + '"/>'),
        e.catAxisMinorTimeUnit && (n += '<c:minorTimeUnit val="' + e.catAxisMinorTimeUnit.toLowerCase() + '"/>'),
        e.catAxisMajorUnit && (n += '<c:majorUnit val="' + e.catAxisMajorUnit + '"/>'),
        e.catAxisMinorUnit && (n += '<c:minorUnit val="' + e.catAxisMinorUnit + '"/>')),
        e._type === Z.SCATTER || e._type === Z.BUBBLE ? n += "</c:valAx>" : n += "</c:" + (e.catLabelFormatCode ? "dateAx" : "catAx") + ">",
        n
    }
    function Vt(t, e) {
        var r = e === S ? "col" === t.barDir ? "l" : "b" : "col" !== t.barDir ? "r" : "t"
          , n = ""
          , a = "r" == r || "t" == r ? "max" : "autoZero"
          , i = e === S ? E : T;
        return n += "<c:valAx>",
        n += '  <c:axId val="' + e + '"/>',
        n += "  <c:scaling>",
        n += '    <c:orientation val="' + (t.valAxisOrientation || (t.barDir,
        "minMax")) + '"/>',
        !t.valAxisMaxVal && 0 !== t.valAxisMaxVal || (n += '<c:max val="' + t.valAxisMaxVal + '"/>'),
        !t.valAxisMinVal && 0 !== t.valAxisMinVal || (n += '<c:min val="' + t.valAxisMinVal + '"/>'),
        n += "  </c:scaling>",
        n += '  <c:delete val="' + (t.valAxisHidden ? 1 : 0) + '"/>',
        n += '  <c:axPos val="' + r + '"/>',
        "none" !== t.valGridLine.style && (n += Zt(t.valGridLine)),
        t.showValAxisTitle && (n += Qt({
            color: t.valAxisTitleColor,
            fontFace: t.valAxisTitleFontFace,
            fontSize: t.valAxisTitleFontSize,
            rotate: t.valAxisTitleRotate,
            title: t.valAxisTitle || "Axis Title"
        })),
        n += ' <c:numFmt formatCode="' + (t.valAxisLabelFormatCode ? t.valAxisLabelFormatCode : "General") + '" sourceLinked="0"/>',
        t._type === Z.SCATTER ? (n += '  <c:majorTickMark val="none"/>',
        n += '  <c:minorTickMark val="none"/>',
        n += '  <c:tickLblPos val="nextTo"/>') : (n += ' <c:majorTickMark val="' + (t.valAxisMajorTickMark || "out") + '"/>',
        n += ' <c:minorTickMark val="' + (t.valAxisMinorTickMark || "none") + '"/>',
        n += ' <c:tickLblPos val="' + (t.valAxisLabelPos || "col" === t.barDir ? "nextTo" : "low") + '"/>'),
        n += " <c:spPr>",
        n += '   <a:ln w="12700" cap="flat">',
        n += !1 === t.valAxisLineShow ? "<a:noFill/>" : '<a:solidFill><a:srgbClr val="' + y.color + '"/></a:solidFill>',
        n += '     <a:prstDash val="solid"/>',
        n += "     <a:round/>",
        n += "   </a:ln>",
        n += " </c:spPr>",
        n += " <c:txPr>",
        n += "  <a:bodyPr " + (t.valAxisLabelRotate ? 'rot="' + At(t.valAxisLabelRotate) + '"' : "") + "/>",
        n += "  <a:lstStyle/>",
        n += "  <a:p>",
        n += "    <a:pPr>",
        n += '      <a:defRPr sz="' + (t.valAxisLabelFontSize || x) + '00" b="' + (t.valAxisLabelFontBold ? 1 : 0) + '" i="0" u="none" strike="noStrike">',
        n += '        <a:solidFill><a:srgbClr val="' + (t.valAxisLabelColor || b) + '"/></a:solidFill>',
        n += '        <a:latin typeface="' + (t.valAxisLabelFontFace || "Arial") + '"/>',
        n += "      </a:defRPr>",
        n += "    </a:pPr>",
        n += '  <a:endParaRPr lang="' + (t.lang || "en-US") + '"/>',
        n += "  </a:p>",
        n += " </c:txPr>",
        n += ' <c:crossAx val="' + i + '"/>',
        n += ' <c:crosses val="' + a + '"/>',
        n += ' <c:crossBetween val="' + (t._type !== Z.SCATTER && !(Array.isArray(t._type) && 0 < t._type.filter(function(t) {
            return t.type === Z.AREA
        }).length) ? "between" : "midCat") + '"/>',
        t.valAxisMajorUnit && (n += ' <c:majorUnit val="' + t.valAxisMajorUnit + '"/>'),
        t.valAxisDisplayUnit && (n += '<c:dispUnits><c:builtInUnit val="' + t.valAxisDisplayUnit + '"/>' + (t.valAxisDisplayUnitLabel ? "<c:dispUnitsLbl/>" : "") + "</c:dispUnits>"),
        n += "</c:valAx>"
    }
    function Qt(t) {
        var e = "left" === t.titleAlign || "right" === t.titleAlign ? '<a:pPr algn="' + t.titleAlign.substring(0, 1) + '">' : "<a:pPr>"
          , r = t.rotate ? '<a:bodyPr rot="' + At(t.rotate) + '"/>' : "<a:bodyPr/>"
          , n = t.fontSize ? 'sz="' + Math.round(t.fontSize) + '00"' : ""
          , a = t.titlePos && t.titlePos.x && t.titlePos.y ? '<c:layout><c:manualLayout><c:xMode val="edge"/><c:yMode val="edge"/><c:x val="' + t.titlePos.x + '"/><c:y val="' + t.titlePos.y + '"/></c:manualLayout></c:layout>' : "<c:layout/>";
        return "<c:title>\n\t  <c:tx>\n\t    <c:rich>\n\t      " + r + "\n\t      <a:lstStyle/>\n\t      <a:p>\n\t        " + e + "\n\t        <a:defRPr " + n + ' b="0" i="0" u="none" strike="noStrike">\n\t          <a:solidFill><a:srgbClr val="' + (t.color || b) + '"/></a:solidFill>\n\t          <a:latin typeface="' + (t.fontFace || "Arial") + '"/>\n\t        </a:defRPr>\n\t      </a:pPr>\n\t      <a:r>\n\t        <a:rPr ' + n + ' b="0" i="0" u="none" strike="noStrike">\n\t          <a:solidFill><a:srgbClr val="' + (t.color || b) + '"/></a:solidFill>\n\t          <a:latin typeface="' + (t.fontFace || "Arial") + '"/>\n\t        </a:rPr>\n\t        <a:t>' + (ht(t.title) || "") + "</a:t>\n\t      </a:r>\n\t    </a:p>\n\t    </c:rich>\n\t  </c:tx>\n\t  " + a + '\n\t  <c:overlay val="0"/>\n\t</c:title>'
    }
    function Yt(t) {
        var e = "";
        return t <= 26 ? e = I[t] : (e += I[Math.floor(t / I.length) - 1],
        e += I[t % I.length]),
        e
    }
    function qt(t, e) {
        if (!t)
            return "<a:effectLst/>";
        if ("object" != typeof t)
            return console.warn("`shadow` options must be an object. Ex: `{shadow: {type:'none'}}`"),
            "<a:effectLst/>";
        var r = "<a:effectLst>"
          , n = dt(e, t)
          , a = n.type || "outer"
          , i = gt(n.blur)
          , o = gt(n.offset)
          , s = 6e4 * n.angle
          , l = n.color
          , c = 1e5 * n.opacity;
        return r += "<a:" + a + 'Shdw sx="100000" sy="100000" kx="0" ky="0"  algn="bl" blurRad="' + i + '" ',
        r += 'rotWithShape="' + +(n.rotateWithShape ? 1 : 0) + '"',
        r += ' dist="' + o + '" dir="' + s + '">',
        r += '<a:srgbClr val="' + l + '">',
        r += '<a:alpha val="' + c + '"/></a:srgbClr>',
        r += "</a:" + a + "Shdw>",
        r += "</a:effectLst>"
    }
    function Zt(t) {
        var e = "<c:majorGridlines>";
        return e += " <c:spPr>",
        e += '  <a:ln w="' + gt(t.size || y.size) + '" cap="flat">',
        e += '  <a:solidFill><a:srgbClr val="' + (t.color || y.color) + '"/></a:solidFill>',
        e += '   <a:prstDash val="' + (t.style || y.style) + '"/><a:round/>',
        e += "  </a:ln>",
        e += " </c:spPr>",
        e += "</c:majorGridlines>"
    }
    function Xt(t) {
        var i = "undefined" != typeof require && "undefined" == typeof window ? require("fs") : null
          , o = "undefined" != typeof require && "undefined" == typeof window ? require("https") : null
          , e = [];
        return t._relsMedia.filter(function(t) {
            return "online" !== t.type && !t.data && (!t.path || t.path && -1 === t.path.indexOf("preencoded"))
        }).forEach(function(a) {
            e.push(new Promise(function(r, n) {
                if (i && 0 !== a.path.indexOf("http"))
                    try {
                        var t = i.readFileSync(a.path);
                        a.data = Buffer.from(t).toString("base64"),
                        r("done")
                    } catch (t) {
                        a.data = lt,
                        n('ERROR: Unable to read media: "' + a.path + '"\n' + t.toString())
                    }
                else if (i && o && 0 === a.path.indexOf("http"))
                    o.get(a.path, function(t) {
                        var e = "";
                        t.setEncoding("binary"),
                        t.on("data", function(t) {
                            return e += t
                        }),
                        t.on("end", function() {
                            a.data = Buffer.from(e, "binary").toString("base64"),
                            r("done")
                        }),
                        t.on("error", function(t) {
                            a.data = lt,
                            n("ERROR! Unable to load image (https.get): " + a.path)
                        })
                    });
                else {
                    var e = new XMLHttpRequest;
                    e.onload = function() {
                        var t = new FileReader;
                        t.onloadend = function() {
                            a.data = t.result,
                            a.isSvgPng ? Kt(a).then(function() {
                                r("done")
                            }).catch(function(t) {
                                n(t)
                            }) : r("done")
                        }
                        ,
                        t.readAsDataURL(e.response)
                    }
                    ,
                    e.onerror = function(t) {
                        a.data = lt,
                        n("ERROR! Unable to load image (xhr.onerror): " + a.path)
                    }
                    ,
                    e.open("GET", a.path),
                    e.responseType = "blob",
                    e.send()
                }
            }
            ))
        }),
        t._relsMedia.filter(function(t) {
            return t.isSvgPng && t.data
        }).forEach(function(t) {
            i ? (t.data = lt,
            e.push(Promise.resolve().then(function() {
                return "done"
            }))) : e.push(Kt(t))
        }),
        e
    }
    function Kt(a) {
        return new Promise(function(r, e) {
            var n = new Image;
            n.onload = function() {
                n.width + n.height === 0 && n.onerror("h/w=0");
                var t = document.createElement("CANVAS")
                  , e = t.getContext("2d");
                t.width = n.width,
                t.height = n.height,
                e.drawImage(n, 0, 0);
                try {
                    a.data = t.toDataURL(a.type),
                    r("done")
                } catch (t) {
                    n.onerror(t)
                }
                t = null
            }
            ,
            n.onerror = function(t) {
                a.data = lt,
                e("ERROR! Unable to load image (image.onerror): " + a.path)
            }
            ,
            n.src = "string" == typeof a.data ? a.data : lt
        }
        )
    }
    function Jt() {
        var a = this;
        this._version = "3.3.1",
        this._alignH = G,
        this._alignV = V,
        this._chartType = D,
        this._outputType = n,
        this._schemeColor = j,
        this._shapeType = z,
        this._charts = Z,
        this._colors = K,
        this._shapes = Y,
        this.addNewSlide = function(t) {
            var e = 0 < a.sections.length && 0 < a.sections[a.sections.length - 1]._slides.filter(function(t) {
                return t._slideNum === a.slides[a.slides.length - 1]._slideNum
            }).length;
            return a.addSlide({
                masterName: t,
                sectionTitle: e ? a.sections[a.sections.length - 1].title : null
            })
        }
        ,
        this.getSlide = function(e) {
            return a.slides.filter(function(t) {
                return t._slideNum === e
            })[0]
        }
        ,
        this.setSlideNumber = function(t) {
            a.masterSlide._slideNumberProps = t,
            a.slideLayouts.filter(function(t) {
                return t._name === r
            })[0]._slideNumberProps = t
        }
        ,
        this.createChartMediaRels = function(t, r, e) {
            t._relsChart.forEach(function(t) {
                return e.push(Wt(t, r))
            }),
            t._relsMedia.forEach(function(t) {
                if ("online" !== t.type && "hyperlink" !== t.type) {
                    var e = t.data && "string" == typeof t.data ? t.data : "";
                    -1 === e.indexOf(",") && -1 === e.indexOf(";") ? e = "image/png;base64," + e : -1 === e.indexOf(",") ? e = "image/png;base64," + e : -1 === e.indexOf(";") && (e = "image/png;" + e),
                    r.file(t.Target.replace("..", "ppt"), e.split(",").pop(), {
                        base64: !0
                    })
                }
            })
        }
        ,
        this.writeFileToBrowser = function(t, e) {
            var r = document.createElement("a");
            if (r.setAttribute("style", "display:none;"),
            r.dataset.interception = "off",
            document.body.appendChild(r),
            window.navigator.msSaveOrOpenBlob) {
                var n = new Blob([e],{
                    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                });
                return r.onclick = function() {
                    window.navigator.msSaveOrOpenBlob(n, t)
                }
                ,
                r.click(),
                document.body.removeChild(r),
                Promise.resolve(t)
            }
            if (window.URL.createObjectURL) {
                var a = window.URL.createObjectURL(new Blob([e],{
                    type: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
                }));
                return r.href = a,
                r.download = t,
                r.click(),
                setTimeout(function() {
                    window.URL.revokeObjectURL(a),
                    document.body.removeChild(r)
                }, 100),
                Promise.resolve(t)
            }
        }
        ,
        this.exportPresentation = function(t) {
            var e = []
              , r = []
              , n = new d;
            return a.slides.forEach(function(t) {
                r = r.concat(Xt(t))
            }),
            a.slideLayouts.forEach(function(t) {
                r = r.concat(Xt(t))
            }),
            r = r.concat(Xt(a.masterSlide)),
            Promise.all(r).then(function() {
                return a.slides.forEach(function(t) {
                    t._slideLayout && function(t) {
                        (t._slideLayout._slideObjects || []).forEach(function(e) {
                            e._type === et.placeholder && 0 === t._slideObjects.filter(function(t) {
                                return t.options && t.options.placeholder === e.options.placeholder
                            }).length && Dt(t, "", {
                                placeholder: e.options.placeholder
                            }, !1)
                        })
                    }(t)
                }),
                n.folder("_rels"),
                n.folder("docProps"),
                n.folder("ppt").folder("_rels"),
                n.folder("ppt/charts").folder("_rels"),
                n.folder("ppt/embeddings"),
                n.folder("ppt/media"),
                n.folder("ppt/slideLayouts").folder("_rels"),
                n.folder("ppt/slideMasters").folder("_rels"),
                n.folder("ppt/slides").folder("_rels"),
                n.folder("ppt/theme"),
                n.folder("ppt/notesMasters").folder("_rels"),
                n.folder("ppt/notesSlides").folder("_rels"),
                n.file("[Content_Types].xml", function(t, e, r) {
                    var n = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A;
                    return n += '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
                    n += '<Default Extension="xml" ContentType="application/xml"/>',
                    n += '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
                    n += '<Default Extension="jpeg" ContentType="image/jpeg"/>',
                    n += '<Default Extension="jpg" ContentType="image/jpg"/>',
                    n += '<Default Extension="png" ContentType="image/png"/>',
                    n += '<Default Extension="gif" ContentType="image/gif"/>',
                    n += '<Default Extension="m4v" ContentType="video/mp4"/>',
                    n += '<Default Extension="mp4" ContentType="video/mp4"/>',
                    t.forEach(function(t) {
                        (t._relsMedia || []).forEach(function(t) {
                            "image" !== t.type && "online" !== t.type && "chart" !== t.type && "m4v" !== t.extn && -1 === n.indexOf(t.type) && (n += '<Default Extension="' + t.extn + '" ContentType="' + t.type + '"/>')
                        })
                    }),
                    n += '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/>',
                    n += '<Default Extension="xlsx" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"/>',
                    n += '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
                    n += '<Override PartName="/ppt/notesMasters/notesMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesMaster+xml"/>',
                    t.forEach(function(t, e) {
                        n += '<Override PartName="/ppt/slideMasters/slideMaster' + (e + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
                        n += '<Override PartName="/ppt/slides/slide' + (e + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>',
                        t._relsChart.forEach(function(t) {
                            n += ' <Override PartName="' + t.Target + '" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
                        })
                    }),
                    n += '<Override PartName="/ppt/presProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presProps+xml"/>',
                    n += '<Override PartName="/ppt/viewProps.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.viewProps+xml"/>',
                    n += '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>',
                    n += '<Override PartName="/ppt/tableStyles.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.tableStyles+xml"/>',
                    e.forEach(function(t, e) {
                        n += '<Override PartName="/ppt/slideLayouts/slideLayout' + (e + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
                        (t._relsChart || []).forEach(function(t) {
                            n += ' <Override PartName="' + t.Target + '" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
                        })
                    }),
                    t.forEach(function(t, e) {
                        n += ' <Override PartName="/ppt/notesSlides/notesSlide' + (e + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.notesSlide+xml"/>'
                    }),
                    r._relsChart.forEach(function(t) {
                        n += ' <Override PartName="' + t.Target + '" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>'
                    }),
                    r._relsMedia.forEach(function(t) {
                        "image" !== t.type && "online" !== t.type && "chart" !== t.type && "m4v" !== t.extn && -1 === n.indexOf(t.type) && (n += ' <Default Extension="' + t.extn + '" ContentType="' + t.type + '"/>')
                    }),
                    n += ' <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>',
                    n += ' <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>',
                    n += "</Types>"
                }(a.slides, a.slideLayouts, a.masterSlide)),
                n.file("_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n\t\t<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>\n\t\t<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>\n\t\t<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>\n\t\t</Relationships>'),
                n.file("docProps/app.xml", function(t, e) {
                    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">\n\t<TotalTime>0</TotalTime>\n\t<Words>0</Words>\n\t<Application>Microsoft Office PowerPoint</Application>\n\t<PresentationFormat>On-screen Show (16:9)</PresentationFormat>\n\t<Paragraphs>0</Paragraphs>\n\t<Slides>' + t.length + "</Slides>\n\t<Notes>" + t.length + '</Notes>\n\t<HiddenSlides>0</HiddenSlides>\n\t<MMClips>0</MMClips>\n\t<ScaleCrop>false</ScaleCrop>\n\t<HeadingPairs>\n\t\t<vt:vector size="6" baseType="variant">\n\t\t\t<vt:variant><vt:lpstr>Fonts Used</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>2</vt:i4></vt:variant>\n\t\t\t<vt:variant><vt:lpstr>Theme</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>1</vt:i4></vt:variant>\n\t\t\t<vt:variant><vt:lpstr>Slide Titles</vt:lpstr></vt:variant>\n\t\t\t<vt:variant><vt:i4>' + t.length + '</vt:i4></vt:variant>\n\t\t</vt:vector>\n\t</HeadingPairs>\n\t<TitlesOfParts>\n\t\t<vt:vector size="' + (t.length + 1 + 2) + '" baseType="lpstr">\n\t\t\t<vt:lpstr>Arial</vt:lpstr>\n\t\t\t<vt:lpstr>Calibri</vt:lpstr>\n\t\t\t<vt:lpstr>Office Theme</vt:lpstr>\n\t\t\t' + t.map(function(t, e) {
                        return "<vt:lpstr>Slide " + (e + 1) + "</vt:lpstr>\n"
                    }).join("") + "\n\t\t</vt:vector>\n\t</TitlesOfParts>\n\t<Company>" + e + "</Company>\n\t<LinksUpToDate>false</LinksUpToDate>\n\t<SharedDoc>false</SharedDoc>\n\t<HyperlinksChanged>false</HyperlinksChanged>\n\t<AppVersion>16.0000</AppVersion>\n\t</Properties>"
                }(a.slides, a.company)),
                n.file("docProps/core.xml", function(t, e, r, n) {
                    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\t<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n\t\t<dc:title>' + ht(t) + "</dc:title>\n\t\t<dc:subject>" + ht(e) + "</dc:subject>\n\t\t<dc:creator>" + ht(r) + "</dc:creator>\n\t\t<cp:lastModifiedBy>" + ht(r) + "</cp:lastModifiedBy>\n\t\t<cp:revision>" + n + '</cp:revision>\n\t\t<dcterms:created xsi:type="dcterms:W3CDTF">' + (new Date).toISOString().replace(/\.\d\d\dZ/, "Z") + '</dcterms:created>\n\t\t<dcterms:modified xsi:type="dcterms:W3CDTF">' + (new Date).toISOString().replace(/\.\d\d\dZ/, "Z") + "</dcterms:modified>\n\t</cp:coreProperties>"
                }(a.title, a.subject, a.author, a.revision)),
                n.file("ppt/_rels/presentation.xml.rels", function(t) {
                    var e = 1
                      , r = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A;
                    r += '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
                    r += '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>';
                    for (var n = 1; n <= t.length; n++)
                        r += '<Relationship Id="rId' + ++e + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide' + n + '.xml"/>';
                    return r += '<Relationship Id="rId' + ++e + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster" Target="notesMasters/notesMaster1.xml"/><Relationship Id="rId' + (e + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/presProps" Target="presProps.xml"/><Relationship Id="rId' + (e + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/viewProps" Target="viewProps.xml"/><Relationship Id="rId' + (e + 3) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/><Relationship Id="rId' + (e + 4) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/tableStyles" Target="tableStyles.xml"/></Relationships>'
                }(a.slides)),
                n.file("ppt/theme/theme1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme"><a:themeElements><a:clrScheme name="Office"><a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1><a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="44546A"/></a:dk2><a:lt2><a:srgbClr val="E7E6E6"/></a:lt2><a:accent1><a:srgbClr val="4472C4"/></a:accent1><a:accent2><a:srgbClr val="ED7D31"/></a:accent2><a:accent3><a:srgbClr val="A5A5A5"/></a:accent3><a:accent4><a:srgbClr val="FFC000"/></a:accent4><a:accent5><a:srgbClr val="5B9BD5"/></a:accent5><a:accent6><a:srgbClr val="70AD47"/></a:accent6><a:hlink><a:srgbClr val="0563C1"/></a:hlink><a:folHlink><a:srgbClr val="954F72"/></a:folHlink></a:clrScheme><a:fontScheme name="Office"><a:majorFont><a:latin typeface="Calibri Light" panose="020F0302020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック Light"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线 Light"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Times New Roman"/><a:font script="Hebr" typeface="Times New Roman"/><a:font script="Thai" typeface="Angsana New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="MoolBoran"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Times New Roman"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:majorFont><a:minorFont><a:latin typeface="Calibri" panose="020F0502020204030204"/><a:ea typeface=""/><a:cs typeface=""/><a:font script="Jpan" typeface="游ゴシック"/><a:font script="Hang" typeface="맑은 고딕"/><a:font script="Hans" typeface="等线"/><a:font script="Hant" typeface="新細明體"/><a:font script="Arab" typeface="Arial"/><a:font script="Hebr" typeface="Arial"/><a:font script="Thai" typeface="Cordia New"/><a:font script="Ethi" typeface="Nyala"/><a:font script="Beng" typeface="Vrinda"/><a:font script="Gujr" typeface="Shruti"/><a:font script="Khmr" typeface="DaunPenh"/><a:font script="Knda" typeface="Tunga"/><a:font script="Guru" typeface="Raavi"/><a:font script="Cans" typeface="Euphemia"/><a:font script="Cher" typeface="Plantagenet Cherokee"/><a:font script="Yiii" typeface="Microsoft Yi Baiti"/><a:font script="Tibt" typeface="Microsoft Himalaya"/><a:font script="Thaa" typeface="MV Boli"/><a:font script="Deva" typeface="Mangal"/><a:font script="Telu" typeface="Gautami"/><a:font script="Taml" typeface="Latha"/><a:font script="Syrc" typeface="Estrangelo Edessa"/><a:font script="Orya" typeface="Kalinga"/><a:font script="Mlym" typeface="Kartika"/><a:font script="Laoo" typeface="DokChampa"/><a:font script="Sinh" typeface="Iskoola Pota"/><a:font script="Mong" typeface="Mongolian Baiti"/><a:font script="Viet" typeface="Arial"/><a:font script="Uigh" typeface="Microsoft Uighur"/><a:font script="Geor" typeface="Sylfaen"/><a:font script="Armn" typeface="Arial"/><a:font script="Bugi" typeface="Leelawadee UI"/><a:font script="Bopo" typeface="Microsoft JhengHei"/><a:font script="Java" typeface="Javanese Text"/><a:font script="Lisu" typeface="Segoe UI"/><a:font script="Mymr" typeface="Myanmar Text"/><a:font script="Nkoo" typeface="Ebrima"/><a:font script="Olck" typeface="Nirmala UI"/><a:font script="Osma" typeface="Ebrima"/><a:font script="Phag" typeface="Phagspa"/><a:font script="Syrn" typeface="Estrangelo Edessa"/><a:font script="Syrj" typeface="Estrangelo Edessa"/><a:font script="Syre" typeface="Estrangelo Edessa"/><a:font script="Sora" typeface="Nirmala UI"/><a:font script="Tale" typeface="Microsoft Tai Le"/><a:font script="Talu" typeface="Microsoft New Tai Lue"/><a:font script="Tfng" typeface="Ebrima"/></a:minorFont></a:fontScheme><a:fmtScheme name="Office"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:lumMod val="110000"/><a:satMod val="105000"/><a:tint val="67000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="103000"/><a:tint val="73000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="105000"/><a:satMod val="109000"/><a:tint val="81000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:satMod val="103000"/><a:lumMod val="102000"/><a:tint val="94000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:satMod val="110000"/><a:lumMod val="100000"/><a:shade val="100000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:lumMod val="99000"/><a:satMod val="120000"/><a:shade val="78000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w="6350" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:ln w="19050" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst/></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="63000"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:solidFill><a:schemeClr val="phClr"><a:tint val="95000"/><a:satMod val="170000"/></a:schemeClr></a:solidFill><a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="93000"/><a:satMod val="150000"/><a:shade val="98000"/><a:lumMod val="102000"/></a:schemeClr></a:gs><a:gs pos="50000"><a:schemeClr val="phClr"><a:tint val="98000"/><a:satMod val="130000"/><a:shade val="90000"/><a:lumMod val="103000"/></a:schemeClr></a:gs><a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="63000"/><a:satMod val="120000"/></a:schemeClr></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults/><a:extraClrSchemeLst/><a:extLst><a:ext uri="{05A4C25C-085E-4340-85A3-A5531E510DB2}"><thm15:themeFamily xmlns:thm15="http://schemas.microsoft.com/office/thememl/2012/main" name="Office Theme" id="{62F939B6-93AF-4DB8-9C6B-D6C7DFDC589F}" vid="{4A3C46E8-61CC-4603-A589-7422A47A8E4A}"/></a:ext></a:extLst></a:theme>'),
                n.file("ppt/presentation.xml", function(t) {
                    var e = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" ' + (t.rtlMode ? 'rtl="1"' : "") + ' saveSubsetFonts="1" autoCompressPictures="0">';
                    e += '<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rId1"/></p:sldMasterIdLst>',
                    e += "<p:sldIdLst>",
                    t.slides.forEach(function(t) {
                        return e += '<p:sldId id="' + t._slideId + '" r:id="rId' + t._rId + '"/>'
                    }),
                    e += "</p:sldIdLst>",
                    e += '<p:notesMasterIdLst><p:notesMasterId r:id="rId' + (t.slides.length + 2) + '"/></p:notesMasterIdLst>',
                    e += '<p:sldSz cx="' + t.presLayout.width + '" cy="' + t.presLayout.height + '"/>',
                    e += '<p:notesSz cx="' + t.presLayout.height + '" cy="' + t.presLayout.width + '"/>',
                    e += "<p:defaultTextStyle>";
                    for (var r = 1; r < 10; r++)
                        e += "<a:lvl" + r + 'pPr marL="' + 457200 * (r - 1) + '" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl' + r + "pPr>";
                    return e += "</p:defaultTextStyle>",
                    t.sections && 0 < t.sections.length && (e += '<p:extLst><p:ext uri="{521415D9-36F7-43E2-AB2F-B90AF26B5E84}">',
                    e += '<p14:sectionLst xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main">',
                    t.sections.forEach(function(t) {
                        e += '<p14:section name="' + ht(t.title) + '" id="{' + ft("xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") + '}"><p14:sldIdLst>',
                        t._slides.forEach(function(t) {
                            return e += '<p14:sldId id="' + t._slideId + '"/>'
                        }),
                        e += "</p14:sldIdLst></p14:section>"
                    }),
                    e += "</p14:sectionLst></p:ext>",
                    e += '<p:ext uri="{EFAFB233-063F-42B5-8137-9DF3F51BA10A}"><p15:sldGuideLst xmlns:p15="http://schemas.microsoft.com/office/powerpoint/2012/main"/></p:ext>',
                    e += "</p:extLst>"),
                    e += "</p:presentation>"
                }(a)),
                n.file("ppt/presProps.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:presentationPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"/>'),
                n.file("ppt/tableStyles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<a:tblStyleLst xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" def="{5C22544A-7EE6-4342-B048-85BDC9FD1C3A}"/>'),
                n.file("ppt/viewProps.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:viewPr xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:normalViewPr horzBarState="maximized"><p:restoredLeft sz="15611"/><p:restoredTop sz="94610"/></p:normalViewPr><p:slideViewPr><p:cSldViewPr snapToGrid="0" snapToObjects="1"><p:cViewPr varScale="1"><p:scale><a:sx n="136" d="100"/><a:sy n="136" d="100"/></p:scale><p:origin x="216" y="312"/></p:cViewPr><p:guideLst/></p:cSldViewPr></p:slideViewPr><p:notesTextViewPr><p:cViewPr><p:scale><a:sx n="1" d="1"/><a:sy n="1" d="1"/></p:scale><p:origin x="0" y="0"/></p:cViewPr></p:notesTextViewPr><p:gridSpacing cx="76200" cy="76200"/></p:viewPr>'),
                a.slideLayouts.forEach(function(t, e) {
                    n.file("ppt/slideLayouts/slideLayout" + (e + 1) + ".xml", function(t) {
                        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\t\t<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" preserve="1">\n\t\t' + St(t) + "\n\t\t<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>"
                    }(t)),
                    n.file("ppt/slideLayouts/_rels/slideLayout" + (e + 1) + ".xml.rels", function(t, e) {
                        return Pt(e[t - 1], [{
                            target: "../slideMasters/slideMaster1.xml",
                            type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster"
                        }])
                    }(e + 1, a.slideLayouts))
                }),
                a.slides.forEach(function(t, e) {
                    n.file("ppt/slides/slide" + (e + 1) + ".xml", function(t) {
                        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"' + (t && t.hidden ? ' show="0"' : "") + ">" + St(t) + "<p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>"
                    }(t)),
                    n.file("ppt/slides/_rels/slide" + (e + 1) + ".xml.rels", function(t, e, r) {
                        return Pt(t[r - 1], [{
                            target: "../slideLayouts/slideLayout" + function(t, e, r) {
                                for (var n = 0; n < e.length; n++)
                                    if (e[n]._name === t[r - 1]._slideLayout._name)
                                        return n + 1;
                                return 1
                            }(t, e, r) + ".xml",
                            type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout"
                        }, {
                            target: "../notesSlides/notesSlide" + r + ".xml",
                            type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide"
                        }])
                    }(a.slides, a.slideLayouts, e + 1)),
                    n.file("ppt/notesSlides/notesSlide" + (e + 1) + ".xml", Rt(t)),
                    n.file("ppt/notesSlides/_rels/notesSlide" + (e + 1) + ".xml.rels", function(t) {
                        return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n\t\t<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n\t\t\t<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesMaster" Target="../notesMasters/notesMaster1.xml"/>\n\t\t\t<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="../slides/slide' + t + '.xml"/>\n\t\t</Relationships>'
                    }(e + 1))
                }),
                n.file("ppt/slideMasters/slideMaster1.xml", function(r, t) {
                    var e = t.map(function(t, e) {
                        return '<p:sldLayoutId id="' + (i + e) + '" r:id="rId' + (r._rels.length + e + 1) + '"/>'
                    })
                      , n = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A;
                    return n += '<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">',
                    n += St(r),
                    n += '<p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>',
                    n += "<p:sldLayoutIdLst>" + e.join("") + "</p:sldLayoutIdLst>",
                    n += '<p:hf sldNum="0" hdr="0" ftr="0" dt="0"/>',
                    n += '<p:txStyles> <p:titleStyle>  <a:lvl1pPr algn="ctr" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="0"/></a:spcBef><a:buNone/><a:defRPr sz="4400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mj-lt"/><a:ea typeface="+mj-ea"/><a:cs typeface="+mj-cs"/></a:defRPr></a:lvl1pPr> </p:titleStyle> <p:bodyStyle>  <a:lvl1pPr marL="342900" indent="-342900" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="3200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr>  <a:lvl2pPr marL="742950" indent="-285750" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="–"/><a:defRPr sz="2800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr>  <a:lvl3pPr marL="1143000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2400" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr>  <a:lvl4pPr marL="1600200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="–"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr>  <a:lvl5pPr marL="2057400" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="»"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr>  <a:lvl6pPr marL="2514600" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr>  <a:lvl7pPr marL="2971800" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr>  <a:lvl8pPr marL="3429000" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr>  <a:lvl9pPr marL="3886200" indent="-228600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:spcBef><a:spcPct val="20000"/></a:spcBef><a:buFont typeface="Arial" pitchFamily="34" charset="0"/><a:buChar char="•"/><a:defRPr sz="2000" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr> </p:bodyStyle> <p:otherStyle>  <a:defPPr><a:defRPr lang="en-US"/></a:defPPr>  <a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr>  <a:lvl2pPr marL="457200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr>  <a:lvl3pPr marL="914400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr>  <a:lvl4pPr marL="1371600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr>  <a:lvl5pPr marL="1828800" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr>  <a:lvl6pPr marL="2286000" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr>  <a:lvl7pPr marL="2743200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr>  <a:lvl8pPr marL="3200400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr>  <a:lvl9pPr marL="3657600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1800" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr> </p:otherStyle></p:txStyles>',
                    n += "</p:sldMaster>"
                }(a.masterSlide, a.slideLayouts)),
                n.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", function(t, e) {
                    var r = e.map(function(t, e) {
                        return {
                            target: "../slideLayouts/slideLayout" + (e + 1) + ".xml",
                            type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout"
                        }
                    });
                    return r.push({
                        target: "../theme/theme1.xml",
                        type: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme"
                    }),
                    Pt(t, r)
                }(a.masterSlide, a.slideLayouts)),
                n.file("ppt/notesMasters/notesMaster1.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<p:notesMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgRef idx="1001"><a:schemeClr val="bg1"/></p:bgRef></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:sp><p:nvSpPr><p:cNvPr id="2" name="Header Placeholder 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="hdr" sz="quarter"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="2971800" cy="458788"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"/><a:lstStyle><a:lvl1pPr algn="l"><a:defRPr sz="1200"/></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="3" name="Date Placeholder 2"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="dt" idx="1"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="3884613" y="0"/><a:ext cx="2971800" cy="458788"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"/><a:lstStyle><a:lvl1pPr algn="r"><a:defRPr sz="1200"/></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{5282F153-3F37-0F45-9E97-73ACFA13230C}" type="datetimeFigureOut"><a:rPr lang="en-US"/><a:t>7/23/19</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="4" name="Slide Image Placeholder 3"/><p:cNvSpPr><a:spLocks noGrp="1" noRot="1" noChangeAspect="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldImg" idx="2"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="1143000"/><a:ext cx="5486400" cy="3086100"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="12700"><a:solidFill><a:prstClr val="black"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="ctr"/><a:lstStyle/><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="5" name="Notes Placeholder 4"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="body" sz="quarter" idx="3"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="685800" y="4400550"/><a:ext cx="5486400" cy="3600450"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0"/><a:lstStyle/><a:p><a:pPr lvl="0"/><a:r><a:rPr lang="en-US"/><a:t>Click to edit Master text styles</a:t></a:r></a:p><a:p><a:pPr lvl="1"/><a:r><a:rPr lang="en-US"/><a:t>Second level</a:t></a:r></a:p><a:p><a:pPr lvl="2"/><a:r><a:rPr lang="en-US"/><a:t>Third level</a:t></a:r></a:p><a:p><a:pPr lvl="3"/><a:r><a:rPr lang="en-US"/><a:t>Fourth level</a:t></a:r></a:p><a:p><a:pPr lvl="4"/><a:r><a:rPr lang="en-US"/><a:t>Fifth level</a:t></a:r></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="6" name="Footer Placeholder 5"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="ftr" sz="quarter" idx="4"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="0" y="8685213"/><a:ext cx="2971800" cy="458787"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="b"/><a:lstStyle><a:lvl1pPr algn="l"><a:defRPr sz="1200"/></a:lvl1pPr></a:lstStyle><a:p><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp><p:sp><p:nvSpPr><p:cNvPr id="7" name="Slide Number Placeholder 6"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr><p:ph type="sldNum" sz="quarter" idx="5"/></p:nvPr></p:nvSpPr><p:spPr><a:xfrm><a:off x="3884613" y="8685213"/><a:ext cx="2971800" cy="458787"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr><p:txBody><a:bodyPr vert="horz" lIns="91440" tIns="45720" rIns="91440" bIns="45720" rtlCol="0" anchor="b"/><a:lstStyle><a:lvl1pPr algn="r"><a:defRPr sz="1200"/></a:lvl1pPr></a:lstStyle><a:p><a:fld id="{CE5E9CC1-C706-0F49-92D6-E571CC5EEA8F}" type="slidenum"><a:rPr lang="en-US"/><a:t>‹#›</a:t></a:fld><a:endParaRPr lang="en-US"/></a:p></p:txBody></p:sp></p:spTree><p:extLst><p:ext uri="{BB962C8B-B14F-4D97-AF65-F5344CB8AC3E}"><p14:creationId xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" val="1024086991"/></p:ext></p:extLst></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:notesStyle><a:lvl1pPr marL="0" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl1pPr><a:lvl2pPr marL="457200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl2pPr><a:lvl3pPr marL="914400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl3pPr><a:lvl4pPr marL="1371600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl4pPr><a:lvl5pPr marL="1828800" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl5pPr><a:lvl6pPr marL="2286000" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl6pPr><a:lvl7pPr marL="2743200" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl7pPr><a:lvl8pPr marL="3200400" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl8pPr><a:lvl9pPr marL="3657600" algn="l" defTabSz="914400" rtl="0" eaLnBrk="1" latinLnBrk="0" hangingPunct="1"><a:defRPr sz="1200" kern="1200"><a:solidFill><a:schemeClr val="tx1"/></a:solidFill><a:latin typeface="+mn-lt"/><a:ea typeface="+mn-ea"/><a:cs typeface="+mn-cs"/></a:defRPr></a:lvl9pPr></p:notesStyle></p:notesMaster>'),
                n.file("ppt/notesMasters/_rels/notesMaster1.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + A + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n\t\t<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>\n\t\t</Relationships>'),
                a.slideLayouts.forEach(function(t) {
                    a.createChartMediaRels(t, n, e)
                }),
                a.slides.forEach(function(t) {
                    a.createChartMediaRels(t, n, e)
                }),
                a.createChartMediaRels(a.masterSlide, n, e),
                Promise.all(e).then(function() {
                    return "STREAM" === t ? n.generateAsync({
                        type: "nodebuffer"
                    }) : t ? n.generateAsync({
                        type: t
                    }) : n.generateAsync({
                        type: "blob"
                    })
                })
            })
        }
        ,
        this.LAYOUTS = {
            LAYOUT_4x3: {
                name: "screen4x3",
                width: 9144e3,
                height: 6858e3
            },
            LAYOUT_16x9: {
                name: "screen16x9",
                width: 9144e3,
                height: 5143500
            },
            LAYOUT_16x10: {
                name: "screen16x10",
                width: 9144e3,
                height: 5715e3
            },
            LAYOUT_WIDE: {
                name: "custom",
                width: 12192e3,
                height: 6858e3
            }
        },
        this._author = "PptxGenJS",
        this._company = "PptxGenJS",
        this._revision = "1",
        this._subject = "PptxGenJS Presentation",
        this._title = "PptxGenJS Presentation",
        this._presLayout = {
            name: this.LAYOUTS[s].name,
            _sizeW: this.LAYOUTS[s].width,
            _sizeH: this.LAYOUTS[s].height,
            width: this.LAYOUTS[s].width,
            height: this.LAYOUTS[s].height
        },
        this._rtlMode = !1,
        this._slideLayouts = [{
            _margin: C,
            _name: r,
            _presLayout: this._presLayout,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slide: null,
            _slideNum: 1e3,
            _slideNumberProps: null,
            _slideObjects: []
        }],
        this._slides = [],
        this._sections = [],
        this._masterSlide = {
            addChart: null,
            addImage: null,
            addMedia: null,
            addNotes: null,
            addShape: null,
            addTable: null,
            addText: null,
            _name: null,
            _presLayout: this._presLayout,
            _rId: null,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slideId: null,
            _slideLayout: null,
            _slideNum: null,
            _slideNumberProps: null,
            _slideObjects: []
        }
    }
    return Object.defineProperty(Jt.prototype, "layout", {
        get: function() {
            return this._layout
        },
        set: function(t) {
            var e = this.LAYOUTS[t];
            if (!e)
                throw new Error("UNKNOWN-LAYOUT");
            this._layout = t,
            this._presLayout = e
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "version", {
        get: function() {
            return this._version
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "author", {
        get: function() {
            return this._author
        },
        set: function(t) {
            this._author = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "company", {
        get: function() {
            return this._company
        },
        set: function(t) {
            this._company = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "revision", {
        get: function() {
            return this._revision
        },
        set: function(t) {
            this._revision = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "subject", {
        get: function() {
            return this._subject
        },
        set: function(t) {
            this._subject = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "title", {
        get: function() {
            return this._title
        },
        set: function(t) {
            this._title = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "rtlMode", {
        get: function() {
            return this._rtlMode
        },
        set: function(t) {
            this._rtlMode = t
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "masterSlide", {
        get: function() {
            return this._masterSlide
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "slides", {
        get: function() {
            return this._slides
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "sections", {
        get: function() {
            return this._sections
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "slideLayouts", {
        get: function() {
            return this._slideLayouts
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "AlignH", {
        get: function() {
            return this._alignH
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "AlignV", {
        get: function() {
            return this._alignV
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "ChartType", {
        get: function() {
            return this._chartType
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "OutputType", {
        get: function() {
            return this._outputType
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "presLayout", {
        get: function() {
            return this._presLayout
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "SchemeColor", {
        get: function() {
            return this._schemeColor
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "ShapeType", {
        get: function() {
            return this._shapeType
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "charts", {
        get: function() {
            return this._charts
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "colors", {
        get: function() {
            return this._colors
        },
        enumerable: !1,
        configurable: !0
    }),
    Object.defineProperty(Jt.prototype, "shapes", {
        get: function() {
            return this._shapes
        },
        enumerable: !1,
        configurable: !0
    }),
    Jt.prototype.stream = function() {
        return this.exportPresentation("STREAM")
    }
    ,
    Jt.prototype.write = function(t) {
        return this.exportPresentation(t)
    }
    ,
    Jt.prototype.writeFile = function(t) {
        var e = this
          , n = "undefined" != typeof require && "undefined" == typeof window ? require("fs") : null
          , a = t ? t.toString().toLowerCase().endsWith(".pptx") ? t : t + ".pptx" : "Presentation.pptx";
        return this.exportPresentation(n ? "nodebuffer" : null).then(function(t) {
            return n ? new Promise(function(e, r) {
                n.writeFile(a, t, function(t) {
                    t ? r(t) : e(a)
                })
            }
            ) : e.writeFileToBrowser(a, t)
        })
    }
    ,
    Jt.prototype.addSection = function(t) {
        t ? t.title || console.warn("addSection requires a title") : console.warn("addSection requires an argument");
        var e = {
            _type: "user",
            _slides: [],
            title: t.title
        };
        t.order ? this.sections.splice(t.order, 0, e) : this._sections.push(e)
    }
    ,
    Jt.prototype.addSlide = function(e) {
        var r = "string" == typeof e ? e : e && e.masterName ? e.masterName : ""
          , t = {
            _name: this.LAYOUTS[s].name,
            _presLayout: this.presLayout,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slideNum: this.slides.length + 1
        };
        if (r) {
            var n = this.slideLayouts.filter(function(t) {
                return t._name === r
            })[0];
            n && (t = n)
        }
        var a = new Ut({
            addSlide: this.addNewSlide,
            getSlide: this.getSlide,
            presLayout: this.presLayout,
            setSlideNum: this.setSlideNumber,
            slideId: this.slides.length + 256,
            slideRId: this.slides.length + 2,
            slideNumber: this.slides.length + 1,
            slideLayout: t
        });
        if (this._slides.push(a),
        e && e.sectionTitle) {
            var i = this.sections.filter(function(t) {
                return t.title === e.sectionTitle
            })[0];
            i ? i._slides.push(a) : console.warn('addSlide: unable to find section with title: "' + e.sectionTitle + '"')
        } else if (this.sections && 0 < this.sections.length && (!e || !e.sectionTitle)) {
            var o = this._sections[this.sections.length - 1];
            "default" === o._type ? o._slides.push(a) : this._sections.push({
                title: "Default-" + (this.sections.filter(function(t) {
                    return "default" === t._type
                }).length + 1),
                _type: "default",
                _slides: [a]
            })
        }
        return a
    }
    ,
    Jt.prototype.defineLayout = function(t) {
        t ? t.name ? t.width ? t.height ? "number" != typeof t.height ? console.warn("defineLayout `height` should be a number (inches)") : "number" != typeof t.width && console.warn("defineLayout `width` should be a number (inches)") : console.warn("defineLayout requires `height`") : console.warn("defineLayout requires `width`") : console.warn("defineLayout requires `name`") : console.warn("defineLayout requires `{name, width, height}`"),
        this.LAYOUTS[t.name] = {
            name: t.name,
            _sizeW: Math.round(Number(t.width) * L),
            _sizeH: Math.round(Number(t.height) * L),
            width: Math.round(Number(t.width) * L),
            height: Math.round(Number(t.height) * L)
        }
    }
    ,
    Jt.prototype.defineSlideMaster = function(t) {
        if (!t.title)
            throw Error("defineSlideMaster() object argument requires a `title` value. (https://gitbrent.github.io/PptxGenJS/docs/masters.html)");
        var e = {
            _margin: t.margin || C,
            _name: t.title,
            _presLayout: this.presLayout,
            _rels: [],
            _relsChart: [],
            _relsMedia: [],
            _slide: null,
            _slideNum: 1e3 + this.slideLayouts.length + 1,
            _slideNumberProps: t.slideNumber || null,
            _slideObjects: []
        };
        t.bkgd && !t.background && (t.background = {},
        "string" == typeof t.bkgd ? t.background.fill = t.bkgd : (t.bkgd.data && (t.background.data = t.bkgd.data),
        t.bkgd.path && (t.background.path = t.bkgd.path),
        t.bkgd.src && (t.background.path = t.bkgd.src)),
        delete t.bkgd),
        function(t, a) {
            t.background && Mt(t.background, a),
            t.objects && Array.isArray(t.objects) && 0 < t.objects.length && t.objects.forEach(function(t, e) {
                var r = Object.keys(t)[0]
                  , n = a;
                $[r] && "chart" === r ? Ot(n, t[r].type, t[r].data, t[r].opts) : $[r] && "image" === r ? Bt(n, t[r]) : $[r] && "line" === r ? Nt(n, Y.LINE, t[r]) : $[r] && "rect" === r ? Nt(n, Y.RECTANGLE, t[r]) : $[r] && "text" === r ? Dt(n, t[r].text, t[r].options, !1) : $[r] && "placeholder" === r && (t[r].options.placeholder = t[r].options.name,
                delete t[r].options.name,
                t[r].options._placeholderType = t[r].options.type,
                delete t[r].options.type,
                t[r].options._placeholderIdx = 100 + e,
                Dt(n, t[r].text, t[r].options, !0))
            }),
            t.slideNumber && "object" == typeof t.slideNumber && (a._slideNumberProps = t.slideNumber)
        }(t, e),
        this.slideLayouts.push(e),
        e._slideNumberProps && !this.masterSlide._slideNumberProps && (this.masterSlide._slideNumberProps = e._slideNumberProps)
    }
    ,
    Jt.prototype.tableToSlides = function(t, e) {
        void 0 === e && (e = {}),
        function(n, o, t, e) {
            void 0 === t && (t = {});
            var a = t || {};
            a.slideMargin = a.slideMargin || 0 === a.slideMargin ? a.slideMargin : .5;
            var s = a.w || n.presLayout.width
              , r = []
              , i = []
              , l = []
              , c = []
              , p = []
              , u = [.5, .5, .5, .5]
              , f = 0;
            if (!document.getElementById(o))
                throw new Error('tableToSlides: Table ID "' + o + '" does not exist!');
            e && e._margin ? (Array.isArray(e._margin) ? u = e._margin : isNaN(e._margin) || (u = [e._margin, e._margin, e._margin, e._margin]),
            a.slideMargin = u) : a && a.slideMargin && (Array.isArray(a.slideMargin) ? u = a.slideMargin : isNaN(a.slideMargin) || (u = [a.slideMargin, a.slideMargin, a.slideMargin, a.slideMargin])),
            s = (a.w ? mt(a.w) : n.presLayout.width) - mt(u[1] + u[3]),
            a.verbose && console.log("-- VERBOSE MODE ----------------------------------"),
            a.verbose && console.log("opts.h ................. = " + a.h),
            a.verbose && console.log("opts.w ................. = " + a.w),
            a.verbose && console.log("pptx.presLayout.width .. = " + n.presLayout.width / L),
            a.verbose && console.log("emuSlideTabW (in)....... = " + s / L);
            var d = document.querySelectorAll("#" + o + " tr:first-child th");
            0 === d.length && (d = document.querySelectorAll("#" + o + " tr:first-child td")),
            d.forEach(function(t) {
                if (t.getAttribute("colspan"))
                    for (var e = 0; e < Number(t.getAttribute("colspan")); e++)
                        p.push(Math.round(t.offsetWidth / Number(t.getAttribute("colspan"))));
                else
                    p.push(t.offsetWidth)
            }),
            p.forEach(function(t) {
                f += t
            }),
            p.forEach(function(t, e) {
                var r = Number((Number(s) * (t / f * 100) / 100 / L).toFixed(2))
                  , n = 0
                  , a = document.querySelector("#" + o + " thead tr:first-child th:nth-child(" + (e + 1) + ")");
                a && (n = Number(a.getAttribute("data-pptx-min-width")));
                var i = document.querySelector("#" + o + " thead tr:first-child th:nth-child(" + (e + 1) + ")");
                i && (n = Number(i.getAttribute("data-pptx-width"))),
                c.push(r < n ? n : r)
            }),
            a.verbose && console.log("arrColW ................ = " + c.toString()),
            ["thead", "tbody", "tfoot"].forEach(function(e) {
                document.querySelectorAll("#" + o + " " + e + " tr").forEach(function(t) {
                    var a = [];
                    switch (Array.from(t.cells).forEach(function(i) {
                        var t = window.getComputedStyle(i).getPropertyValue("color").replace(/\s+/gi, "").replace("rgba(", "").replace("rgb(", "").replace(")", "").split(",")
                          , e = window.getComputedStyle(i).getPropertyValue("background-color").replace(/\s+/gi, "").replace("rgba(", "").replace("rgb(", "").replace(")", "").split(",");
                        "rgba(0, 0, 0, 0)" !== window.getComputedStyle(i).getPropertyValue("background-color") && !window.getComputedStyle(i).getPropertyValue("transparent") || (e = ["255", "255", "255"]);
                        var o = {
                            align: null,
                            bold: "bold" === window.getComputedStyle(i).getPropertyValue("font-weight") || 500 <= Number(window.getComputedStyle(i).getPropertyValue("font-weight")),
                            border: null,
                            color: yt(Number(t[0]), Number(t[1]), Number(t[2])),
                            fill: {
                                color: yt(Number(e[0]), Number(e[1]), Number(e[2]))
                            },
                            fontFace: (window.getComputedStyle(i).getPropertyValue("font-family") || "").split(",")[0].replace(/"/g, "").replace("inherit", "").replace("initial", "") || null,
                            fontSize: Number(window.getComputedStyle(i).getPropertyValue("font-size").replace(/[a-z]/gi, "")),
                            margin: null,
                            colspan: Number(i.getAttribute("colspan")) || null,
                            rowspan: Number(i.getAttribute("rowspan")) || null,
                            valign: null
                        };
                        if (-1 < ["left", "center", "right", "start", "end"].indexOf(window.getComputedStyle(i).getPropertyValue("text-align"))) {
                            var r = window.getComputedStyle(i).getPropertyValue("text-align").replace("start", "left").replace("end", "right");
                            o.align = "center" === r ? "center" : "left" === r ? "left" : "right" === r ? "right" : null
                        }
                        if (-1 < ["top", "middle", "bottom"].indexOf(window.getComputedStyle(i).getPropertyValue("vertical-align"))) {
                            var n = window.getComputedStyle(i).getPropertyValue("vertical-align");
                            o.valign = "top" === n ? "top" : "middle" === n ? "middle" : "bottom" === n ? "bottom" : null
                        }
                        window.getComputedStyle(i).getPropertyValue("padding-left") && (o.margin = [0, 0, 0, 0],
                        ["padding-top", "padding-right", "padding-bottom", "padding-left"].forEach(function(t, e) {
                            o.margin[e] = Math.round(Number(window.getComputedStyle(i).getPropertyValue(t).replace(/\D/gi, "")))
                        })),
                        (window.getComputedStyle(i).getPropertyValue("border-top-width") || window.getComputedStyle(i).getPropertyValue("border-right-width") || window.getComputedStyle(i).getPropertyValue("border-bottom-width") || window.getComputedStyle(i).getPropertyValue("border-left-width")) && (o.border = [null, null, null, null],
                        ["top", "right", "bottom", "left"].forEach(function(t, e) {
                            var r, n = Math.round(Number(window.getComputedStyle(i).getPropertyValue("border-" + t + "-width").replace("px", "")));
                            r = window.getComputedStyle(i).getPropertyValue("border-" + t + "-color").replace(/\s+/gi, "").replace("rgba(", "").replace("rgb(", "").replace(")", "").split(",");
                            var a = yt(Number(r[0]), Number(r[1]), Number(r[2]));
                            o.border[e] = {
                                pt: n,
                                color: a
                            }
                        })),
                        a.push({
                            _type: et.tablecell,
                            text: i.innerText,
                            options: o
                        })
                    }),
                    e) {
                    case "thead":
                        r.push(a);
                        break;
                    case "tbody":
                        i.push(a);
                        break;
                    case "tfoot":
                        l.push(a);
                        break;
                    default:
                        console.log("table parsing: unexpected table part: " + e)
                    }
                })
            }),
            a._arrObjTabHeadRows = r || null,
            a.colW = c,
            _t(pt(r, i, l), a, n.presLayout, e).forEach(function(t, e) {
                var r = n.addSlide({
                    masterName: a.masterSlideName || null
                });
                0 === e && (a.y = a.y || u[0]),
                0 < e && (a.y = a.autoPageSlideStartY || a.newSlideStartY || u[0]),
                a.verbose && console.log("opts.autoPageSlideStartY:" + a.autoPageSlideStartY + " / arrInchMargins[0]:" + u[0] + " => opts.y = " + a.y),
                r.addTable(t.rows, {
                    x: a.x || u[3],
                    y: a.y,
                    w: Number(s) / L,
                    colW: c,
                    autoPage: !1
                }),
                a.addImage && r.addImage({
                    path: a.addImage.url,
                    x: a.addImage.x,
                    y: a.addImage.y,
                    w: a.addImage.w,
                    h: a.addImage.h
                }),
                a.addShape && r.addShape(a.addShape.shape, a.addShape.options || {}),
                a.addTable && r.addTable(a.addTable.rows, a.addTable.options || {}),
                a.addText && r.addText(a.addText.text, a.addText.options || {})
            })
        }(this, t, e, e && e.masterSlideName ? this.slideLayouts.filter(function(t) {
            return t._name === e.masterSlideName
        })[0] : null)
    }
    ,
    Jt
}(JSZip);
//# sourceMappingURL=pptxgen.bundle.js.map
