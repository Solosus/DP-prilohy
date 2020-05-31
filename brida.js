'use strict';

// 1 - FRIDA EXPORTS

rpc.exports = {

    // rpc.exports.foo = function () {
    // return new Promise(function (resolve, reject) {
    // Java.perform(function () {
    // try {
    // var result = ...
    // resolve(result);
    // } catch (e) {
    // reject(e);
    // }
    // });
    // });
// };
    // BE CAREFUL: Do not use uppercase characters in exported function name (automatically converted lowercase by Pyro)



    
    // Function executed when executed Brida contextual menu option 1.
    // Input is passed from Brida encoded in ASCII HEX and must be returned in ASCII HEX (because Brida will decode the output
    // from ASCII HEX). Use auxiliary functions for the conversions.
    contextcustom1: function (message) {
        return new Promise(function (resolve, reject) {
            if (Java.available) {
                Java.perform(function () {
                    var request = hexToString(message);
                    var fields = request.split("&");
                    const HashMap = Java.use("java.util.HashMap");
                    const map = HashMap.$new();
                    var index;
                    for (index = 0; index < fields.length; ++index) {
                        var parameter = fields[index].split("=");
                        if (["nonce", "timestamp", "signature"].indexOf(parameter[0]) >= 0) {
                            continue;
                        }
                        map.put(parameter[0], parameter[1]);
                        console.log("adding to map key: " + parameter[0] + " value: " + parameter[1]);
                    }
                    const SignClass = Java.use("cz.vutbr.pavol.obfuscation.experimental.main.o");
                    console.log("* after class");
                    var method = SignClass.c.overload("java.util.Map");
                    var signedMap = method.call(SignClass, map);
                    var HashMapNode = Java.use("java.util.HashMap$Node");
                    var iterator = signedMap.entrySet().iterator();
                    var body = "";
                    while (iterator.hasNext()) {
                        var entry = Java.cast(iterator.next(), HashMapNode);
                        console.log(entry.getKey() + "=" + entry.getValue());
                        body += entry.getKey() + "=" + entry.getValue() + "&";
                    }
                    body = body.substring(0, body.length - 1);
                    try {
                        resolve(stringToHex(body));
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        });
    },

    // Function executed when executed Brida contextual menu option 2.
    // Input is passed from Brida encoded in ASCII HEX and must be returned in ASCII HEX (because Brida will decode the output
    // from ASCII HEX). Use auxiliary functions for the conversions.
    contextcustom2: function (message) {
       
    },

    // Function executed when executed Brida contextual menu option 3.
    // Input is passed from Brida encoded in ASCII HEX and must be returned in ASCII HEX (because Brida will decode the output
    // from ASCII HEX). Use auxiliary functions for the conversions.
    contextcustom3: function (message) {
        
    },

    // Function executed when executed Brida contextual menu option 4.
    // Input is passed from Brida encoded in ASCII HEX and must be returned in ASCII HEX (because Brida will decode the output
    // from ASCII HEX). Use auxiliary functions for the conversions.
    contextcustom4: function (message) {
        return "";
    },

    // **** BE CAREFULL ****
    // Do not remove these functions. They are used by Brida plugin in the "Analyze binary" tab!
    // *********************
    getallclasses: function () {
        var result = []
        if (ObjC.available) {
            for (var className in ObjC.classes) {
                if (ObjC.classes.hasOwnProperty(className)) {
                    result.push(className);
                }
            }
        } else if (Java.available) {
            Java.perform(function () {
                Java.enumerateLoadedClasses({
                    onMatch: function (className) {
                        result.push(className);
                    },
                    onComplete: function () {
                    }
                });
            });
        }
        return result;
    },

    getallmodules: function () {
        var results = {}
        var matches = Process.enumerateModules({
            onMatch: function (module) {
                results[module['name']] = module['base'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    getmoduleimports: function (importname) {
        var results = {}
        var matches = Module.enumerateImports(importname, {
            onMatch: function (module) {
                results[module['type'] + ": " + module['name']] = module['address'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    getmoduleexports: function (exportname) {
        var results = {}
        var matches = Module.enumerateExports(exportname, {
            onMatch: function (module) {
                results[module['type'] + ": " + module['name']] = module['address'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    getclassmethods: function (classname) {
        var results = {}
        if (ObjC.available) {
            var resolver = new ApiResolver("objc");
            var matches = resolver.enumerateMatches("*[" + classname + " *]", {
                onMatch: function (match) {
                    results[match['name']] = match['address'];
                },
                onComplete: function () {
                }
            });
        } else if (Java.available) {
            Java.perform(function () {
                results = getJavaMethodArgumentTypes(classname);
            });
        }
        return results;
    },

    findobjcmethods: function (searchstring) {
        var results = {}
        var resolver = new ApiResolver("objc");
        var matches = resolver.enumerateMatches("*[*" + searchstring + "* *]", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        matches = resolver.enumerateMatches("*[* *" + searchstring + "*]", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    findimports: function (searchstring) {
        var results = {}
        var resolver = new ApiResolver("module");
        var matches = resolver.enumerateMatches("imports:*" + searchstring + "*!*", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        matches = resolver.enumerateMatches("imports:*!*" + searchstring + "*", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    findexports: function (searchstring) {
        var results = {}
        var resolver = new ApiResolver("module");
        var matches = resolver.enumerateMatches("exports:*" + searchstring + "*!*", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        matches = resolver.enumerateMatches("exports:*!*" + searchstring + "*", {
            onMatch: function (match) {
                results[match['name']] = match['address'];
            },
            onComplete: function () {
            }
        });
        return results;
    },

    detachall: function () {
        Interceptor.detachAll();
    },

    // generic trace
    trace: function (pattern, type, backtrace) {
        // SINGLE EXPORT (ALL EXPORT OF A MODULE CAN BE A MESS AND CRASH THE APP)
        if (type == "export") {
            var res = new ApiResolver("module");
            pattern = "exports:" + pattern;
            var matches = res.enumerateMatchesSync(pattern);
            var targets = uniqBy(matches, JSON.stringify);
            targets.forEach(function (target) {
                traceModule(target.address, target.name, backtrace);
            });
            //OBJC
        } else if (type.startsWith("objc")) {
            if (ObjC.available) {
                var res;
                if (type === "objc_class") {
                    res = new ApiResolver("objc");
                    pattern = "*[" + pattern + " *]";
                } else if (type === "objc_method") {
                    res = new ApiResolver("objc");
                }
                var matches = res.enumerateMatchesSync(pattern);
                var targets = uniqBy(matches, JSON.stringify);
                targets.forEach(function (target) {
                    traceObjC(target.address, target.name, backtrace);
                });
            }
            // ANDROID
        } else if (type.startsWith("java")) {
            if (Java.available) {
                Java.perform(function () {
                    if (type === "java_class") {
                        var methodsDictionary = getJavaMethodArgumentTypes(pattern);
                        var targets = Object.keys(methodsDictionary);
                        targets.forEach(function (targetMethod) {
                            traceJavaMethod(targetMethod, backtrace);
                        });
                    } else {
                        traceJavaMethod(pattern, backtrace);
                    }
                });
            }
        }
    },

    changereturnvalue: function (pattern, type, typeret, newret) {
        if (ObjC.available) {
            changeReturnValueIOS(pattern, type, typeret, newret);
        } else if (Java.available) {
            Java.perform(function () {
                changeReturnValueAndroid(pattern, type, typeret, newret);
            });
        } else {
            changeReturnValueGeneric(pattern, type, typeret, newret);
        }
    },

    getplatform: function () {

        if (Java.available) {
            return 0;
        } else if (ObjC.available) {
            return 1;
        } else {
            return 2;
        }

    }

}

// 2 - AUXILIARY FUNCTIONS

// Convert a hex string to a byte array
function hexToBytes(hex) {
    for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    return bytes;
}

// Convert a ASCII string to a hex string
function stringToHex(str) {
    return str.split("").map(function (c) {
        return ("0" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join("");
}

// Convert a hex string to a ASCII string
function hexToString(hexStr) {
    var hex = hexStr.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
    for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
    }
    return hex.join("");
}

// remove duplicates from array
function uniqBy(array, key) {
    var seen = {};
    return array.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
}

function Utf8Encode(strUni) {
    return String(strUni).replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        }
    ).replace(
        /[\ud800-\udbff][\udc00-\udfff]/g,  // surrogate pair
        function (c) {
            var high = c.charCodeAt(0);
            var low = c.charCodeAt(1);
            var cc = ((high & 0x03ff) << 10 | (low & 0x03ff)) + 0x10000;
            // U+10000 - U+10FFFF => 4 bytes 11110www 10xxxxxx, 10yyyyyy, 10zzzzzz
            return String.fromCharCode(0xf0 | cc >> 18, 0x80 | cc >> 12 & 0x3f, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);
        }
    ).replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function (c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3f, 0x80 | cc & 0x3f);
        }
    );
}

function Utf8Decode(strUtf) {
    // note: decode 2-byte chars last as decoded 2-byte strings could appear to be 3-byte or 4-byte char!
    return String(strUtf).replace(
        /[\u00f0-\u00f7][\u0080-\u00bf][\u0080-\u00bf][\u0080-\u00bf]/g,  // 4-byte chars
        function (c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0) & 0x07) << 18) | ((c.charCodeAt(1) & 0x3f) << 12) | ((c.charCodeAt(2) & 0x3f) << 6) | (c.charCodeAt(3) & 0x3f);
            var tmp = cc - 0x10000;
            // TODO: throw error(invalid utf8) if tmp > 0xfffff
            return String.fromCharCode(0xd800 + (tmp >> 10), 0xdc00 + (tmp & 0x3ff)); // surrogate pair
        }
    ).replace(
        /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
        function (c) {  // (note parentheses for precedence)
            var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
            return String.fromCharCode(cc);
        }
    ).replace(
        /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
        function (c) {  // (note parentheses for precedence)
            var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
            return String.fromCharCode(cc);
        }
    );
}

/*
This method is used to get Java methods with arguments in bytecode syntex. By simply calling the getDeclaredMethods of a Java Class object
and then calling toString on each Method object we do not get types in bytecode format. For example we get 'byte[]' instead of
'[B'. This function uses overload object of frida to get types in correct bytecode form.
*/
function getJavaMethodArgumentTypes(classname) {
    if (Java.available) {
        var results = {};
        Java.perform(function () {
            var hook = Java.use(classname);
            var res = hook.class.getDeclaredMethods();
            res.forEach(function (s) {
                //console.log("s " + s);
                var targetClassMethod = parseJavaMethod(s.toString());
                //console.log("targetClassMethod " + targetClassMethod);
                var delim = targetClassMethod.lastIndexOf(".");
                if (delim === -1) return;
                var targetClass = targetClassMethod.slice(0, delim)
                var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length)
                //console.log("targetClass " + targetClass);
                //console.log("targetMethod " + targetMethod);
                var hookClass = Java.use(targetClass);
                var classMethodOverloads = hookClass[targetMethod].overloads;
                classMethodOverloads.forEach(function (cmo) {
                    // overload.argumentTypes is an array of objects representing the arguments. In the "className" field of each object there
                    // is the bytecode form of the class of the current argument
                    var argumentTypes = cmo.argumentTypes;
                    var argumentTypesArray = []
                    argumentTypes.forEach(function (cmo) {
                        argumentTypesArray.push(cmo.className);
                    });
                    var argumentTypesString = argumentTypesArray.toString();
                    // overload.returnType.className contain the bytecode form of the class of the return value
                    var currentReturnType = cmo.returnType.className;
                    var newPattern = currentReturnType + " " + targetClassMethod + "(" + argumentTypesString + ")";
                    //console.log(newPattern);
                    results[newPattern] = 0;
                });
                hookClass.$dispose;
            });
            hook.$dispose;
        });
        return results;
    }
}

function changeReturnValueIOS(pattern, type, typeret, newret) {
    var res;
    if (type === "objc_method") {
        res = new ApiResolver("objc");
    } else {
        // SINGLE EXPORT
        res = new ApiResolver("module");
        pattern = "exports:" + pattern;
    }
    var matches = res.enumerateMatchesSync(pattern);
    var targets = uniqBy(matches, JSON.stringify);
    targets.forEach(function (target) {
        Interceptor.attach(target.address, {
            onEnter: function (args) {
            },
            onLeave: function (retval) {
                if (typeret === "String") {
                    var a1 = ObjC.classes.NSString.stringWithString_(newret);
                    try {
                        console.log("*** " + pattern + " Replacing " + ObjC.Object(retval) + " with " + a1);
                    } catch (err) {
                        console.log("*** " + pattern + " Replacing " + retval + " with " + a1);
                    }
                    retval.replace(a1);
                } else if (typeret === "Ptr") {
                    console.log("*** " + pattern + " Replacing " + ptr(retval) + " with " + ptr(newret));
                    retval.replace(ptr(newret));
                } else if (typeret === "Boolean") {
                    if (newret === "true") {
                        var toRet = 1;
                    } else {
                        var toRet = 0;
                    }
                    console.log("*** " + pattern + " Replacing " + retval + " with " + toRet);
                    retval.replace(toRet);
                } else {
                    console.log("*** " + pattern + " Replacing " + retval + " with " + newret);
                    retval.replace(newret);
                }
            }
        });
    });
    console.log("*** Replacing return value of " + pattern + " with " + newret);
}

function changeReturnValueGeneric(pattern, type, typeret, newret) {
    var res = new ApiResolver("module");
    pattern = "exports:" + pattern;
    var matches = res.enumerateMatchesSync(pattern);
    var targets = uniqBy(matches, JSON.stringify);
    targets.forEach(function (target) {
        Interceptor.attach(target.address, {
            onEnter: function (args) {
            },
            onLeave: function (retval) {
                if (typeret === "Ptr") {
                    console.log("*** " + pattern + " Replacing " + ptr(retval) + " with " + ptr(newret));
                    retval.replace(ptr(newret));
                } else if (typeret === "Boolean") {
                    if (newret === "true") {
                        var toRet = 1;
                    } else {
                        var toRet = 0;
                    }
                    console.log("*** " + pattern + " Replacing " + retval + " with " + toRet);
                    retval.replace(toRet);
                } else {
                    console.log("*** " + pattern + " Replacing " + retval + " with " + newret);
                    retval.replace(newret);
                }
            }
        });
    });
    console.log("*** Replacing return value of " + pattern + " with " + newret);
}

function changeReturnValueAndroid(pattern, type, typeret, newret) {
    if (type === "java_method") {
        var targetClassMethod = parseJavaMethod(pattern);
        //console.log(targetClassMethod);
        var argsTargetClassMethod = getJavaMethodArguments(pattern);
        //console.log(argsTargetClassMethod);
        var delim = targetClassMethod.lastIndexOf(".");
        if (delim === -1) return;
        var targetClass = targetClassMethod.slice(0, delim)
        var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length)
        //console.log(targetClass);
        //console.log(targetMethod);
        var hook = Java.use(targetClass);
        hook[targetMethod].overload.apply(this, argsTargetClassMethod).implementation = function () {
            var retval = this[targetMethod].apply(this, arguments);
            var toRet = newret;
            if (typeret === "String") {
                var stringClass = Java.use("java.lang.String");
                toRet = stringClass.$new(newret);
            } else if (typeret === "Ptr") {
                toRet = ptr(newret);
            } else if (typeret === "Boolean") {
                if (newret === "true") {
                    toRet = true;
                } else {
                    toRet = false;
                }
            }
            console.log("*** " + pattern + " Replacing " + retval + " with " + toRet);
            return toRet;
        }
        // SINGLE EXPORT
    } else {
        var res = new ApiResolver("module");
        var pattern = "exports:" + pattern;
        var matches = res.enumerateMatchesSync(pattern);
        var targets = uniqBy(matches, JSON.stringify);
        targets.forEach(function (target) {
            Interceptor.attach(target.address, {
                onEnter: function (args) {
                },
                onLeave: function (retval) {
                    var toRet = newret;
                    if (typeret === "String") {
                        var stringClass = Java.use("java.lang.String");
                        var toRet = stringClass.$new(newret);
                    } else if (typeret === "ptr") {
                        toRet = ptr(newret);
                    } else if (typeret === "Boolean") {
                        if (newret === "true") {
                            var toRet = 1;
                        } else {
                            var toRet = 0;
                        }
                        console.log("*** " + pattern + " Replacing " + retval + " with " + toRet);
                        retval.replace(toRet);
                    }
                    console.log("*** " + pattern + " Replacing " + retval + " with " + toRet);
                    retval.replace(toRet);
                }
            });
        });
    }
    console.log("*** Replacing return value of " + pattern + " with " + newret);
}

// trace ObjC methods
function traceObjC(impl, name, backtrace) {
    console.log("*** Tracing " + name);
    Interceptor.attach(impl, {
        onEnter: function (args) {
            console.log("*** entered " + name);
            console.log("Caller: " + DebugSymbol.fromAddress(this.returnAddress));
            // print args
            if (name.indexOf(":") !== -1) {
                console.log("Parameters:");
                var par = name.split(":");
                par[0] = par[0].split(" ")[1];
                for (var i = 0; i < par.length - 1; i++) {
                    printArg(par[i] + ": ", args[i + 2]);
                }
            }
            if (backtrace === "true") {
                console.log("Backtrace:\n\t" + Thread.backtrace(this.context, Backtracer.ACCURATE)
                    .map(DebugSymbol.fromAddress).join("\n\t"));
            }
        },
        onLeave: function (retval) {
            console.log("*** exiting " + name);
            console.log("Return value:");
            printArg("retval: ", retval);
        }
    });
}

/*
INPUT LIKE: public boolean a.b.functionName(java.lang.String)
OUTPUT LIKE: a.b.functionName
*/
function parseJavaMethod(method) {
    var parSplit = method.split("(");
    var spaceSplit = parSplit[0].split(" ");
    return spaceSplit[spaceSplit.length - 1];
}

//INPUT LIKE: public boolean a.b.functionName(java.lang.String,java.lang.String)
//OUTPUT LIKE: ["java.lang.String","java.lang.String"]
function getJavaMethodArguments(method) {
    var m = method.match(/.*\((.*)\).*/);
    if (m[1] !== "") {
        return m[1].split(",");
    } else {
        return [];
    }
}

// trace a specific Java Method
function traceJavaMethod(pattern, backtrace) {
    var targetClassMethod = parseJavaMethod(pattern);
    //console.log(targetClassMethod);
    var argsTargetClassMethod = getJavaMethodArguments(pattern);
    //console.log(argsTargetClassMethod);
    var delim = targetClassMethod.lastIndexOf(".");
    if (delim === -1) return;
    var targetClass = targetClassMethod.slice(0, delim)
    var targetMethod = targetClassMethod.slice(delim + 1, targetClassMethod.length)
    var hook = Java.use(targetClass);
    //var overloadCount = hook[targetMethod].overloads.length;
    console.log("*** Tracing " + pattern);
    hook[targetMethod].overload.apply(this, argsTargetClassMethod).implementation = function () {
        console.log("*** entered " + targetClassMethod);
        // print args
        if (arguments.length) console.log("Parameters:");
        for (var j = 0; j < arguments.length; j++) {
            //console.log("\targ[" + j + "]: " + arguments[j] + " Signature: " + pattern);
            send("\targ[" + j + "]: " + arguments[j] + " Signature: " + pattern);
        }
        // print backtrace
        if (backtrace === "true") {
            Java.perform(function () {
                var threadClass = Java.use("java.lang.Thread");
                var currentThread = threadClass.currentThread();
                var currentStackTrace = currentThread.getStackTrace();
                console.log("Backtrace:");
                currentStackTrace.forEach(function (st) {
                    console.log("\t" + st.toString());
                });
            });
        }
        // print retval
        var retval = this[targetMethod].apply(this, arguments);
        console.log("*** exiting " + targetClassMethod);
        console.log("Return value:");
        console.log("\tretval: " + retval);
        return retval;
    }
}

// trace Module functions
function traceModule(impl, name, backtrace) {
    console.log("*** Tracing " + name);
    Interceptor.attach(impl, {
        onEnter: function (args) {
            console.log("*** entered " + name);
            if (backtrace === "true") {
                console.log("Backtrace:\n\t" + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n\t"));
            }
        },
        onLeave: function (retval) {
            console.log("*** exiting " + name);
            console.log("Return value:");
            if (ObjC.available) {
                printArg("retval: ", retval);
            } else {
                console.log("\tretval: ", retval);
            }
        }
    });
}

// print helper
function printArg(desc, arg) {
    if (arg != 0x0) {
        try {
            var objectArg = ObjC.Object(arg);
            console.log("\t(" + objectArg.$className + ") " + desc + objectArg.toString());
        } catch (err2) {
            console.log("\t" + desc + arg);
        }
    } else {
        console.log("\t" + desc + "0x0");
    }
}
