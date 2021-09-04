// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}

},{}],"utils/observeble/subject.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subject = void 0;

const observeble_1 = require("./observeble");

function deferPromise() {
  let resolvingFunctions;
  const promise = new Promise((resolve, reject) => {
    resolvingFunctions = {
      resolve,
      reject
    };
  }); // @ts-ignore

  return Object.assign({
    promise
  }, resolvingFunctions);
}

class Subject {
  constructor(value) {
    this.hasValue = arguments.length > 0;

    if (this.hasValue) {
      this._value = value;
    }

    this.deferPromise = deferPromise();
  }

  next(value) {
    const nextdeferPromise = deferPromise();
    this._value = value;
    this.hasValue = true;
    this.deferPromise.resolve({
      value: this._value,
      next: nextdeferPromise.promise
    });
    this.deferPromise = nextdeferPromise;
  }

  asObserveble() {
    if (this.hasValue) {
      return new observeble_1.Observable(this.deferPromise.promise, this._value);
    }

    return new observeble_1.Observable(this.deferPromise.promise);
  }

}

exports.Subject = Subject;
},{"./observeble":"utils/observeble/observeble.ts"}],"utils/observeble/subscription.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = void 0;

class Subscription {
  constructor(onUnsubscribe) {
    this.onUnsubscribe = onUnsubscribe;
  }

  unsubscribe() {
    this.onUnsubscribe(this);
  }

}

exports.Subscription = Subscription;
},{}],"utils/observeble/observeble.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

const subject_1 = require("./subject");

const subscription_1 = require("./subscription");

class Observable {
  constructor(chainPromise, value) {
    this.subscriptionMap = new Map();
    this.hasValue = false;

    if (arguments.length > 1) {
      this._value = value;
      this.hasValue = true;
    }

    this.promise = chainPromise;
    chainPromise.then(value => this.onNext(value));
  }

  static all(observebles) {
    return Observable.combine(observebles, true);
  }

  static concat(observebles) {
    return Observable.combine(observebles, false);
  }

  static event(element, eventName) {
    const emitter = new subject_1.Subject();
    element.addEventListener(eventName, e => emitter.next(e));
    return emitter.asObserveble();
  }

  subscribe(handler) {
    const subscription = new subscription_1.Subscription(this.getUnsubscribeFunction(this.subscriptionMap));
    this.subscriptionMap.set(subscription, handler); // Т.к. следующее значение может быть и undefined, используем hasValue

    if (this.hasValue) {
      handler(this._value);
    }

    return subscription;
  }

  map(handler) {
    function mapPromise(promise) {
      return promise.then(chain => ({
        value: handler(chain.value),
        next: mapPromise(chain.next)
      }));
    }

    if (this.hasValue) {
      return new Observable(mapPromise(this.promise), handler(this._value));
    }

    return new Observable(mapPromise(this.promise));
  }

  filter(handler) {
    function filterPromise(promise) {
      return promise.then(chain => {
        if (handler(chain.value)) {
          return {
            value: chain.value,
            next: filterPromise(chain.next)
          };
        }

        return filterPromise(chain.next);
      });
    }

    if (this.hasValue && handler(this._value)) {
      return new Observable(filterPromise(this.promise), this._value);
    }

    return new Observable(filterPromise(this.promise));
  }

  on(handler) {
    function onPromise(promise) {
      return promise.then(chain => {
        handler(chain.value);
        return {
          value: chain.value,
          next: onPromise(chain.next)
        };
      });
    }

    if (this._value) {
      handler(this._value);
    }

    if (this.hasValue) {
      return new Observable(onPromise(this.promise), this._value);
    }

    return new Observable(onPromise(this.promise));
  }

  startWith(value) {
    return new Observable(this.promise, value);
  }

  uniqueNext(approveFirst = true, checkUnicue = (last, next) => last !== next || !this.hasValue && approveFirst) {
    let last = this._value;
    let firstAppruved = false;
    return this.filter(value => !firstAppruved || checkUnicue(last, value)).on(() => {
      firstAppruved = true;
    }).on(value => {
      last = value;
    });
  }

  only(count) {
    const emptyPromise = new Promise(() => {});

    if (this.hasValue) {
      return new Observable(count ? this.promise : emptyPromise, this._value).filter(() => count-- > 0);
    }

    return new Observable(count ? this.promise : emptyPromise).filter(() => count-- > 0);
  }

  select(selector) {
    return this.map(selector).uniqueNext();
  }

  static combine(observebles, waitAll) {
    const subject = new subject_1.Subject();
    const values = Array(observebles.length).fill(undefined);
    const hasValues = Array(observebles.length).fill(false);
    let hasAllValues = false;

    const subscribeobserveble = (observeble, index) => {
      observeble.subscribe(value => {
        values[index] = value;

        if (hasAllValues || !waitAll) {
          subject.next(values.slice());
        } else {
          hasValues[index] = true;
          hasAllValues = hasValues.every(has => has);

          if (hasAllValues) {
            subject.next(values.slice());
          }
        }
      });
    };

    for (let index = 0; index < observebles.length; index++) {
      subscribeobserveble(observebles[index], index);
    }

    return subject.asObserveble();
  }

  onNext(value) {
    if (!value) {
      this.onFinish();
      return;
    }

    this._value = value.value;
    this.hasValue = true;
    this.emitValue(value.value);
    this.promise = value.next;
    value.next.then(value => this.onNext(value));
  }

  emitValue(value) {
    for (const handler of this.subscriptionMap.values()) {
      handler(value);
    }
  }

  onFinish() {
    this.subscriptionMap.clear();
  }

  getUnsubscribeFunction(map) {
    return function (subscription) {
      if (map.has(subscription)) {
        map.delete(subscription);
      }
    };
  }

}

exports.Observable = Observable;
},{"./subject":"utils/observeble/subject.ts","./subscription":"utils/observeble/subscription.ts"}],"utils/templator/renderer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;

const observeble_1 = require("../observeble/observeble");

const subject_1 = require("../observeble/subject");

class Renderer {
  constructor(context) {
    this.$staticValues = new subject_1.Subject();
    this.context = context;
  }

  getFieldValue(fieldName) {
    let out = this.context;

    for (const field of fieldName.split('.')) {
      if (field in out) {
        // @ts-ignore
        out = out[field];
      } else {
        // Только так мы можем понять что поле отсутствует
        // Любой корректный выход из этой функции считается найденным значением
        throw new Error(`field ${fieldName} not found`);
      }
    }

    return out;
  }

  needSelectValueInObservable(fieldName) {
    const fieldPath = fieldName.split('.');
    return fieldPath.length > 1 && fieldPath[0].length > 0 && this.firstFieldIsObservable(fieldName);
  }

  firstFieldIsObservable(fieldName) {
    return this.getFirstFieldByFieldName(fieldName) instanceof observeble_1.Observable;
  }

  getSelectedObservable(fieldName) {
    if (!this.firstFieldIsObservable(fieldName)) {
      throw new Error(`first field is not observable: ${fieldName}`);
    }

    return this.getFirstFieldByFieldName(fieldName).select(this.createSelectorByFieldName(fieldName));
  }

  initObserveblesSubscription(observebles, onValuesChanged) {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = this.getObservable(observebles).subscribe(onValuesChanged);
    return this.subscription;
  } // TODO: Изменить реализацию метода, когда появится метод merge у Observeble


  getObservable(observebles) {
    // Тут проблема с типами из-за костыльной реализации метода
    // метод merge должен решить эту проблему
    return observeble_1.Observable.all([this.$staticValues.asObserveble(), ...observebles]).map(data => data.length > 1 ? data[0].concat(data.slice(1, data.length)) : data[0]);
  }

  mapTemplateToField(template) {
    return template.replace(/[\s{}()[\]]+/gim, '');
  }

  getFirstFieldByFieldName(fieldName) {
    // @ts-ignore
    return this.context[fieldName.split('.')[0]];
  }

  createSelectorByFieldName(fieldName) {
    const fieldPath = fieldName.split('.');
    fieldPath.shift();
    return function (value) {
      let out = value;

      for (const fieldName of fieldPath) {
        if (typeof out !== 'object') {
          throw new Error(`Templator: invalid selector (${fieldName}) or observeble value`);
        } // @ts-ignore


        out = out[fieldName];
      }

      return out;
    };
  }

}

exports.Renderer = Renderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts"}],"utils/templator/html-element-renderer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLElementRenderer = void 0;

const observeble_1 = require("../observeble/observeble");

const renderer_1 = require("./renderer");
/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */
// TODO: не может читать значение атрибута с пробелом


const TEG_ATTRIBUTES = /([(<|</)\w\-@]+(?:=)?(?:"|'|\{\{|\}\}|\]\]|\[\[)?[\w\-|(|)|.|$]+(?:"|'|\{\{|\}\}|\]\]|\[\[])?)/gim;

class HTMLElementRenderer extends renderer_1.Renderer {
  constructor(tagStr, context) {
    super(context);
    this.customAttributes = new Map();
    this.eventListenersMap = new Map();
    const tagArr = tagStr.match(TEG_ATTRIBUTES) || [];
    const tagName = tagArr[0].replace(/</g, '');
    const tagAttributeStrs = tagArr.splice(1);
    this.element = document.createElement(tagName);

    for (const attributeStr of tagAttributeStrs) {
      const attribute = this.mapStrToAttribute(attributeStr);

      if (this.isCustomAttribute(attribute)) {
        this.customAttributes.set(attribute.name, attribute.value); // @ts-ignore
      } else if (this.isInjectableAttribute(attribute) && this.element.inject) {
        this.injectAttribute(attribute);
      } else {
        this.element.setAttribute(attribute.name, this.mapAttributeValueToValue(attribute.value));
      }
    }
  }

  render() {
    const observebles = [];
    const staticValues = [];

    for (const customAttributeEntries of this.customAttributes.entries()) {
      try {
        const value = this.getFieldValue(this.mapTemplateToField(customAttributeEntries[1]));
        const customAttribute = {
          name: customAttributeEntries[0],
          valueTemplate: customAttributeEntries[1]
        };

        if (value instanceof observeble_1.Observable) {
          this.addObservable(observebles, value, customAttribute.name, customAttribute.valueTemplate);
        } else {
          staticValues.push(Object.assign(Object.assign({}, customAttribute), {
            value
          }));
        }
      } catch (e) {
        console.error(`Error when rendering attribute in ${this.element.tagName} HTMLElement: ${e}`);
      }
    }

    if (!this.subscription) {
      this.initObserveblesSubscription(observebles, values => this.onValuesChanged(values));
    }

    this.$staticValues.next(staticValues);
  }

  onValuesChanged(values) {
    for (const value of values) {
      this.onValueChanged(value);
    }
  }

  onValueChanged(attribute) {
    if (attribute.name[0] === '@') {
      if (typeof attribute.value !== 'function') {
        throw new Error(`HTMLElementRenderer: ${attribute.name} is not a function`);
      }

      if (this.eventListenersMap.has(attribute.name) && this.eventListenersMap.get(attribute.name).includes(attribute.value)) {
        return;
      }

      if (this.eventListenersMap.has(attribute.name)) {
        this.eventListenersMap.get(attribute.name).push(attribute.value);
      } else {
        this.eventListenersMap.set(attribute.name, [attribute.value]);
      }

      const name = attribute.name.slice(1);
      this.element.addEventListener(name, e => attribute.value.call(this.context, e));
      return;
    }

    switch (typeof attribute.value) {
      case 'function':
        this.element.setAttribute(attribute.name, String(attribute.value()));
        break;

      case 'string':
        this.element.setAttribute(attribute.name, attribute.value);
        break;

      case 'boolean':
        if (attribute.value) {
          if (!this.element.hasAttribute(attribute.name)) {
            this.element.setAttribute(attribute.name, '');
          }
        } else {
          this.element.removeAttribute(attribute.name);
        }

        break;

      default:
        this.element.setAttribute(attribute.name, String(attribute.value));
        break;
    }
  }

  injectAttribute(attribute) {
    try {
      const value = this.getFieldValue(this.mapTemplateToField(attribute.value)); // @ts-ignore

      this.element.inject(attribute.name, value);
    } catch (e) {
      console.error(`Error when inject in ${this.element.tagName} HTMLElement: ${e}`);
    }
  }

  addObservable(observebles, observeble, name, valueTemplate) {
    observebles.push(observeble.map(value => ({
      name,
      value,
      valueTemplate
    })));
  }

  mapStrToAttribute(str) {
    const strArr = str.split('=');
    return strArr.length > 1 ? {
      name: strArr[0],
      value: strArr[1]
    } : {
      name: strArr[0]
    };
  }

  mapAttributeValueToValue(template) {
    if (!template) {
      return;
    }

    return String(template).replace(/['"]+/g, '');
  }

  isCustomAttribute(attribute) {
    if (!attribute.value) {
      return false;
    }

    return /[{]{2}(.+)[}]{2}/.test(String(attribute.value));
  }

  isInjectableAttribute(attribute) {
    if (!attribute.value) {
      return false;
    }

    return /[[]{2}(.+)[\]]{2}/.test(String(attribute.value));
  }

}

exports.HTMLElementRenderer = HTMLElementRenderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./renderer":"utils/templator/renderer.ts"}],"utils/templator/html-elements-render-manager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLElementsRenderManager = void 0;

const html_element_renderer_1 = require("./html-element-renderer");

class HTMLElementsRenderManager {
  constructor(context) {
    this.renderers = [];
    this.context = context;
  }

  initNode(tagStr) {
    const elementRenderer = new html_element_renderer_1.HTMLElementRenderer(tagStr, this.context);
    this.renderers.push(elementRenderer);
    return elementRenderer.element;
  }

  renderAll() {
    for (const elementRenderer of this.renderers) {
      elementRenderer.render();
    }
  }

}

exports.HTMLElementsRenderManager = HTMLElementsRenderManager;
},{"./html-element-renderer":"utils/templator/html-element-renderer.ts"}],"utils/templator/text-node-renderer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextNodeRenderer = void 0;

const observeble_1 = require("../observeble/observeble");

const renderer_1 = require("./renderer");
/**
* Шаблон для поиска вставляемого элемента
* 'server has bin started on port {{PORT}}' => ['{{PORT}}']
*/


const VARIEBLES = /[{]{2}[\s]*[^\s]+[\s]*[}]{2}/g;

class TextNodeRenderer extends renderer_1.Renderer {
  constructor(content, context) {
    super(context);
    this.content = content;
    this.node = document.createTextNode(content);
    this.variablesNames = this.getFieldsNamesFromContent(this.content);
  }

  render() {
    const observebles = [];
    const staticValues = [];

    for (const [fieldTemplate, fieldName] of this.variablesNames.entries()) {
      try {
        if (this.needSelectValueInObservable(fieldName)) {
          this.addObservable(observebles, fieldTemplate, this.getSelectedObservable(fieldName));
        } else {
          let fieldValue = this.getFieldValue(fieldName);

          if (typeof fieldValue === 'function') {
            fieldValue = fieldValue.call(this.context);
          }

          if (fieldValue instanceof observeble_1.Observable) {
            this.addObservable(observebles, fieldTemplate, fieldValue);
          } else {
            staticValues.push({
              tempate: fieldTemplate,
              value: fieldValue
            });
          }
        }
      } catch (e) {
        console.error(`Error when rendering text: ${e}`);
      }
    }

    if (!this.subscription) {
      this.initObserveblesSubscription(observebles, values => this.onValuesChanged(values));
    }

    this.$staticValues.next(staticValues);
  }

  getFieldsNamesFromContent(text) {
    return new Map([...new Set(text.match(VARIEBLES) || [])].map(fieldTemplate => [fieldTemplate, this.mapTemplateToField(fieldTemplate)]));
  }

  addObservable(observebles, fieldTemplate, fieldValue) {
    observebles.push(fieldValue.map(value => ({
      tempate: fieldTemplate,
      value
    })));
  }

  onValuesChanged(values) {
    let {
      content
    } = this;

    for (const value of values) {
      switch (typeof value.value) {
        case 'function':
          content = content.replaceAll(value.tempate, value.value.call(this.context));
          break;

        default:
          content = content.replaceAll(value.tempate, String(value.value));
      }
    }

    this.node.textContent = content.trim();
  }

}

exports.TextNodeRenderer = TextNodeRenderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./renderer":"utils/templator/renderer.ts"}],"utils/templator/text-nodes-render-manager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextNodesRenderManager = void 0;

const text_node_renderer_1 = require("./text-node-renderer");

class TextNodesRenderManager {
  constructor(context) {
    this.renderers = [];
    this.context = context;
  }

  initTextNode(content) {
    const renderer = new text_node_renderer_1.TextNodeRenderer(content, this.context);
    this.renderers.push(renderer);
    return renderer.node;
  }

  renderAll() {
    for (const renderer of this.renderers) {
      renderer.render();
    }
  }

}

exports.TextNodesRenderManager = TextNodesRenderManager;
},{"./text-node-renderer":"utils/templator/text-node-renderer.ts"}],"utils/templator/templator.ts":[function(require,module,exports) {
"use strict"; // TODO: Возможно стоит переписать класс. без регулярок выйдет за o(n)
// TODO: * почему-то ломает текстовую ноду. Надо править регулярки
// TODO: Вынести часть реализации в helper
// TODO: Когда появятся тесты, описание можно будет убрать

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Templator = void 0;

const observeble_1 = require("../observeble/observeble");

const html_elements_render_manager_1 = require("./html-elements-render-manager");

const text_nodes_render_manager_1 = require("./text-nodes-render-manager");
/**
 * Разбивает html на массив по одному тегу в каждом элементе и при этом тег на первом месте. Пример:
 * <div>content<p>text</p>content2</div> =>
 * ['<div>content', '<p>text', '</p>content2', '</div>']
 */


const HTML_TAG_AND_CONTENT = /<.*?>[^<>]*/gim;
/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */

const TEG_ATTRIBUTES = /([(<|</)\w-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|(|)|.|$]+(?:"|'|\{\{|\}\})?)/gim;
/**
 * Выделяет тег. Пример:
 * '<div hidden name={{name}}> content text' => ['<div hidden name={{name}}>']
 */

const TEG = /^<.*?>/;
/**
 * Начинается не с </
 */

const OPEN_TEG = /^<\//;
/**
 * Выделяет из строки всё, кроме '<', '/' и пробелов
 */

const TEG_NAME = /[^</\s]+/; // TODO: Разобраться с типизацией страниц и компонентов type Context = {[key: string]: any};

class Templator {
  constructor(context, template = '') {
    this.slotsMap = new Map();

    if (typeof template !== 'string') {
      throw new Error('Templator: template is not string');
    }

    this.context = context;
    this.template = template;
    this.textNodesRenderManager = new text_nodes_render_manager_1.TextNodesRenderManager(this.context);
    this.htmlElementRendererManager = new html_elements_render_manager_1.HTMLElementsRenderManager(this.context);
    this.nodes = this.initTemplate(this.template);
  }

  initTemplate(str) {
    const outNodes = [];

    const addToChain = (node, content) => {
      const getParent = () => {
        // Из-за того что есть не закрывающиеся теги
        const parentIndex = htmlElements[htmlElements.length - 1] === node ? htmlElements.length - 2 : htmlElements.length - 1;

        if (!htmlElements[parentIndex]) {
          throw new Error('Templator: the parent could not be found, most likely the element with the "slot" attribute lies in the root of the template');
        }

        return htmlElements[parentIndex];
      };

      if (node.hasAttribute('slot')) {
        const parent = getParent();

        if (this.slotsMap.has(parent)) {
          this.slotsMap.get(parent).push(node);
        } else {
          this.slotsMap.set(parent, [node]);
        }

        parent.appendChild(node);
        return;
      }

      if (htmlElements.length > 1) {
        const parent = getParent();
        parent.appendChild(node);
        parent.appendChild(this.textNodesRenderManager.initTextNode(content));
      } else {
        outNodes.push(node);
        outNodes.push(this.textNodesRenderManager.initTextNode(content));
      }
    }; // Получаем массив, который содержит один тег и контент до следующего тега


    const htmlConfig = (str.match(HTML_TAG_AND_CONTENT) || []).map(str => {
      // Выбираем только тег
      const tagStr = str.match(TEG)[0];
      const content = str.split(tagStr)[1]; // Разбиваем тег на массив из имени тега и атрибутов

      const tagArray = tagStr.match(TEG_ATTRIBUTES) || [];
      const tag = {
        isOpen: !OPEN_TEG.test(tagStr),
        name: tagArray[0].match(TEG_NAME)[0],
        str: tagStr
      };
      return {
        tag,
        content
      };
    });
    const htmlElements = [];

    for (const item of htmlConfig) {
      if (item.tag.isOpen) {
        const element = this.htmlElementRendererManager.initNode(item.tag.str);

        if (this.isSolloTag(element)) {
          if (this.isContentElement(element)) {
            this.contentElement = element;
          }

          addToChain(element, item.content);
        } else {
          element.appendChild(this.textNodesRenderManager.initTextNode(item.content));
          htmlElements.push(element);
        }
      } else {
        if (!htmlElements[htmlElements.length - 1] || htmlElements[htmlElements.length - 1].tagName !== item.tag.name.toUpperCase()) {
          throw Error(`Templator: invalid html template: ${str}`);
        }

        addToChain(htmlElements[htmlElements.length - 1], item.content);
        htmlElements.pop();
      }
    }

    if (htmlElements.length) {
      throw Error(`Templator: invalid html template: ${str}`);
    }

    return outNodes;
  }

  render(options = {}) {
    if (options.content && this.contentElement && !this.contentSubscription) {
      this.setContent(options.content);
    }

    this.textNodesRenderManager.renderAll();
    this.htmlElementRendererManager.renderAll();
    this.setSlots();
  }

  setContent(content = []) {
    if (content instanceof observeble_1.Observable) {
      this.contentSubscription = content.subscribe(elements => {
        while (this.contentElement.firstChild) {
          this.contentElement.removeChild(this.contentElement.firstChild);
        }

        for (const node of elements) {
          this.contentElement.appendChild(node);
        }
      });
    } else {
      for (const node of content) {
        this.contentElement.appendChild(node);
      }
    }
  }

  setSlots() {
    for (const parent of this.getMapKeys(this.slotsMap)) {
      for (const slot of this.slotsMap.get(parent)) {
        const slotNode = this.getSlotNode(parent, slot.getAttribute('slot'));

        if (slotNode) {
          slotNode.appendChild(slot);
        }
      }
    }
  } // TODO: вынести в утилиту


  getMapKeys(map) {
    const keys = [];
    map.forEach((_value, key) => keys.push(key));
    return keys;
  }

  isSolloTag(element) {
    const solloTags = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'content'];
    return solloTags.includes(element.tagName.toLowerCase());
  }

  isContentElement(element) {
    return element.tagName.toLowerCase() === 'content';
  } // Node.querySelector("slot[name="name"]")


  getSlotNode(node, name) {
    for (let index = 0; index < node.children.length; index++) {
      const child = node.children.item(index);

      if (child.tagName === 'SLOT' && child.getAttribute('name') === name) {
        return child;
      }

      const req = this.getSlotNode(child, name);

      if (req) {
        return req;
      }
    }

    return null;
  }

}

exports.Templator = Templator;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./html-elements-render-manager":"utils/templator/html-elements-render-manager.ts","./text-nodes-render-manager":"utils/templator/text-nodes-render-manager.ts"}],"utils/component.ts":[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = void 0;

const templator_1 = require("./templator/templator");

var defaultObservedAttributes;

(function (defaultObservedAttributes) {
  defaultObservedAttributes["hidden"] = "hidden";
  defaultObservedAttributes["style"] = "style";
})(defaultObservedAttributes || (defaultObservedAttributes = {}));

function component(config) {
  return function (Clazz) {
    class CustomElement extends HTMLElement {
      constructor() {
        super();
        this.template = config.template;
        this.clazz = new Clazz();
      }

      connectedCallback() {
        if (config.guards) {
          this.checkGuards(config.guards);
        }

        if (this.clazz.onInit) {
          this.clazz.onInit();
        }

        this.render();

        if (this.clazz.onRendered) {
          this.clazz.onRendered(this);
        }
      }

      disconnectedCallback() {
        if (this.clazz.onDestroy) {
          this.clazz.onDestroy();
        }
      }

      static get observedAttributes() {
        // @ts-ignore
        return Object.values(defaultObservedAttributes).concat(config.observedAttributes ? config.observedAttributes : []).concat(Clazz.observedAttributes ? Clazz.observedAttributes : []);
      }

      attributeChangedCallback(name, oldValue, newValue) {
        let needRender = false; // @ts-ignore name - строка не обязательно содержааяся в defaultObservedAttributes

        if (Object.values(defaultObservedAttributes).includes(name)) {
          needRender = this.onDefaultAttributeChanged(name, oldValue, newValue);
        }

        if (this.clazz.onAttributeChanged) {
          needRender = this.clazz.onAttributeChanged(name, oldValue, newValue) || needRender;
        }

        if (needRender) {
          this.render();
        }
      } // @ts-ignore используется внешними компонентами


      inject(fieldName, value) {
        // @ts-ignore
        this.clazz[fieldName] = value;
      }

      render() {
        const options = {};
        const {
          content
        } = this.clazz;

        if (content) {
          options.content = content;
        }

        if (!this.templator) {
          this.init();
        }

        this.templator.render(this.clazz);
      }

      init() {
        this.templator = new templator_1.Templator(this.clazz, this.template);

        for (const node of this.templator.nodes) {
          this.appendChild(node);
        }
      }

      onDefaultAttributeChanged(name, _oldValue, newValue) {
        switch (name) {
          case defaultObservedAttributes.hidden:
            this.style.display = this.hasAttribute(defaultObservedAttributes.hidden) ? 'none' : '';
            break;

          case defaultObservedAttributes.style:
            if (!newValue) {
              this.removeAttribute(defaultObservedAttributes.style);
            }

            break;

          default:
            return false;
        }

        return false;
      }

      checkGuards(guards) {
        return __awaiter(this, void 0, void 0, function* () {
          for (const GuardConstructor of guards) {
            const guard = new GuardConstructor();
            const canOpen = guard.canOpen();

            if (canOpen instanceof Promise) {
              if (!(yield canOpen)) {
                guard.onOpenError();
                this.fillsWithEmptiness();
                return;
              }
            } else if (!canOpen) {
              guard.onOpenError();
              this.fillsWithEmptiness();
              return;
            }
          }
        });
      }

      fillsWithEmptiness() {
        this.template = '';
        this.clazz = {};
      }

    }

    customElements.define(config.name, CustomElement);
    return CustomElement;
  };
}

exports.component = component;
},{"./templator/templator":"utils/templator/templator.ts"}],"app-root.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <content>
`;
},{}],"pages/main/page-main.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <p>страничка с чатами</p>
    <button @click={{navigateToAuth()}}>
        Перейти к страничке авторизации
    </button>
    <button @click={{navigateToProfile()}}>
        Перейти к страничке профиля
    </button>
    <button @click={{logout()}}>
        Выйти из аккаунта
    </button>
`;
},{}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"pages/main/page-main.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"service/router/pages.config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pages = void 0;
var pages;

(function (pages) {
  pages["main"] = "/";
  pages["chats"] = "/";
  pages["auth"] = "/auth";
  pages["profile"] = "/profile";
  pages["default"] = "default";
})(pages = exports.pages || (exports.pages = {}));
},{}],"store/enums/data-status.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataStatus = void 0;
var dataStatus;

(function (dataStatus) {
  dataStatus["loading"] = "loading";
  dataStatus["valid"] = "valid";
  dataStatus["invalid"] = "invalid";
  dataStatus["error"] = "error";
  dataStatus["default"] = "default";
})(dataStatus = exports.dataStatus || (exports.dataStatus = {}));
},{}],"store/selectors/data/select-status.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectDataStatus = void 0;

function selectDataStatus(data) {
  return data.status;
}

exports.selectDataStatus = selectDataStatus;
},{}],"store/selectors/authorization/select-auth-token.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectAuthToken = void 0;

function selectAuthToken(state) {
  return state.authorization.authToken;
}

exports.selectAuthToken = selectAuthToken;
},{}],"store/selectors/authorization/select-is-authorized.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectIsAuthorized = void 0;

const data_status_enum_1 = require("../../enums/data-status.enum");

const select_status_1 = require("../data/select-status");

const select_auth_token_1 = require("./select-auth-token");

function selectIsAuthorized(state) {
  const authTokenStatus = select_status_1.selectDataStatus(select_auth_token_1.selectAuthToken(state)); // По дефолту считаем что мы авторизированы,
  // поскольку нет валидных способов узнать есть ли токен в куках(

  return authTokenStatus === data_status_enum_1.dataStatus.valid || authTokenStatus === data_status_enum_1.dataStatus.default;
}

exports.selectIsAuthorized = selectIsAuthorized;
},{"../../enums/data-status.enum":"store/enums/data-status.enum.ts","../data/select-status":"store/selectors/data/select-status.ts","./select-auth-token":"store/selectors/authorization/select-auth-token.ts"}],"store/functions/get-default-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultData = void 0;

const data_status_enum_1 = require("../enums/data-status.enum");

function getDefaultData() {
  return {
    status: data_status_enum_1.dataStatus.default,
    time: undefined,
    error: undefined,
    value: undefined
  };
}

exports.getDefaultData = getDefaultData;
},{"../enums/data-status.enum":"store/enums/data-status.enum.ts"}],"store/consts/default-state.const.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultState = void 0;

const get_default_data_1 = require("../functions/get-default-data");

exports.defaultState = {
  authorization: {
    authToken: get_default_data_1.getDefaultData(),
    logout: get_default_data_1.getDefaultData(),
    userData: get_default_data_1.getDefaultData()
  },
  user: {
    changePassword: get_default_data_1.getDefaultData(),
    changeUserData: get_default_data_1.getDefaultData()
  },
  chats: {
    list: get_default_data_1.getDefaultData(),
    createChat: get_default_data_1.getDefaultData(),
    deleteChat: get_default_data_1.getDefaultData(),
    tokens: {},
    deleteChatUsers: get_default_data_1.getDefaultData(),
    addChatUsers: get_default_data_1.getDefaultData()
  },
  activeChats: {
    managers: {},
    chatsReadyStates: {}
  }
};
},{"../functions/get-default-data":"store/functions/get-default-data.ts"}],"store/enums/active-chats-actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activeChatsActionType = void 0;
var activeChatsActionType;

(function (activeChatsActionType) {
  activeChatsActionType["addActiveChat"] = "activeChats-addActiveChat";
  activeChatsActionType["removeActiveChat"] = "activeChats-removeActiveChat";
  activeChatsActionType["changeChatReadyState"] = "activeChats-changeReadyState";
})(activeChatsActionType = exports.activeChatsActionType || (exports.activeChatsActionType = {}));
},{}],"store/functions/reduser-adaptor.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducerAdapt = void 0;

function reducerAdapt(reducers, selector) {
  const globalReducers = {};

  for (const [actionType, reducer] of Object.entries(reducers)) {
    // @ts-ignore
    globalReducers[actionType] = function (state, action) {
      return Object.assign(Object.assign({}, state), {
        [selector]: reducer(state[selector], action)
      });
    };
  }

  return globalReducers;
}

exports.reducerAdapt = reducerAdapt;
},{}],"store/reducers/active-chats-state.reducers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activeChatsReducers = void 0;

const active_chats_actions_1 = require("../enums/active-chats-actions");

const reduser_adaptor_1 = require("../functions/reduser-adaptor");

const _activeChatsReducers = {
  [active_chats_actions_1.activeChatsActionType.addActiveChat]: (state, action) => Object.assign(Object.assign({}, state), {
    managers: Object.assign(Object.assign({}, state.managers), {
      [action.payload.chatId]: {
        controller: action.payload.controller,
        listener: action.payload.listener
      }
    })
  }),
  [active_chats_actions_1.activeChatsActionType.removeActiveChat]: (state, action) => {
    const controllers = Object.assign({}, state.managers);
    delete controllers[action.payload];
    return Object.assign(Object.assign({}, state), {
      controllers
    });
  },
  [active_chats_actions_1.activeChatsActionType.changeChatReadyState]: (state, action) => Object.assign(Object.assign({}, state), {
    chatsReadyStates: Object.assign(Object.assign({}, state.chatsReadyStates), {
      [action.payload.chatId]: action.payload.readyState
    })
  })
};
exports.activeChatsReducers = reduser_adaptor_1.reducerAdapt(_activeChatsReducers, 'activeChats');
},{"../enums/active-chats-actions":"store/enums/active-chats-actions.ts","../functions/reduser-adaptor":"store/functions/reduser-adaptor.ts"}],"store/enums/authorization-action-type.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationActionType = void 0;
var authorizationActionType;

(function (authorizationActionType) {
  authorizationActionType["authTokenUpload"] = "authorization-authToken__upload";
  authorizationActionType["authTokenUploaded"] = "authorization-authToken__uploaded";
  authorizationActionType["authTokenUploadError"] = "authorization-authToken__uploadError";
  authorizationActionType["logoutUpload"] = "authorization-logout__upload";
  authorizationActionType["logoutUploaded"] = "authorization-logout__uploaded";
  authorizationActionType["logoutUploadError"] = "authorization-logout__uploadError";
  authorizationActionType["userDataUpload"] = "authorization-userData__upload";
  authorizationActionType["userDataUploaded"] = "authorization-userData__uploaded";
  authorizationActionType["userDataUploadError"] = "authorization-userData__uploadError";
})(authorizationActionType = exports.authorizationActionType || (exports.authorizationActionType = {}));
},{}],"store/reducers/authorization-reducers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationReducers = void 0;

const data_status_enum_1 = require("../enums/data-status.enum");

const authorization_action_type_enum_1 = require("../enums/authorization-action-type.enum");

const reduser_adaptor_1 = require("../functions/reduser-adaptor"); // TODO: кажется, нужно создавать редьюсеры для изменения состояния Data в одном месте,
// иначе изменить интерфейс Data потом будет нереально


const _authorizationReducers = {
  [authorization_action_type_enum_1.authorizationActionType.authTokenUpload]: state => Object.assign(Object.assign({}, state), {
    authToken: Object.assign(Object.assign({}, state.authToken), {
      status: data_status_enum_1.dataStatus.loading
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.authTokenUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    authToken: Object.assign(Object.assign({}, state.authToken), {
      error: undefined,
      status: data_status_enum_1.dataStatus.valid,
      value: action.payload,
      time: Date.now()
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.authTokenUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    authToken: Object.assign(Object.assign({}, state.authToken), {
      status: data_status_enum_1.dataStatus.error,
      error: action.payload
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.logoutUpload]: state => Object.assign(Object.assign({}, state), {
    authToken: Object.assign(Object.assign({}, state.authToken), {
      status: data_status_enum_1.dataStatus.loading
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.logoutUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    logout: Object.assign(Object.assign({}, state.logout), {
      error: undefined,
      status: data_status_enum_1.dataStatus.valid,
      value: action.payload,
      time: Date.now()
    }),
    authToken: Object.assign(Object.assign({}, state.authToken), {
      status: data_status_enum_1.dataStatus.invalid
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.logoutUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    logout: Object.assign(Object.assign({}, state.logout), {
      status: data_status_enum_1.dataStatus.error,
      error: action.payload
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.userDataUpload]: state => Object.assign(Object.assign({}, state), {
    logout: Object.assign(Object.assign({}, state.logout), {
      status: data_status_enum_1.dataStatus.loading
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.userDataUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    userData: Object.assign(Object.assign({}, state.userData), {
      error: undefined,
      status: data_status_enum_1.dataStatus.valid,
      value: action.payload,
      time: Date.now()
    })
  }),
  [authorization_action_type_enum_1.authorizationActionType.userDataUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    userData: Object.assign(Object.assign({}, state.userData), {
      status: data_status_enum_1.dataStatus.error,
      error: action.payload
    })
  })
};
exports.authorizationReducers = reduser_adaptor_1.reducerAdapt(_authorizationReducers, 'authorization');
},{"../enums/data-status.enum":"store/enums/data-status.enum.ts","../enums/authorization-action-type.enum":"store/enums/authorization-action-type.enum.ts","../functions/reduser-adaptor":"store/functions/reduser-adaptor.ts"}],"utils/data-reducers-helper.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataReducersHelper = void 0;

const data_status_enum_1 = require("../store/enums/data-status.enum");

class DataReducersHelper {
  static createUploadReducer(field) {
    return state => Object.assign(Object.assign({}, state), {
      [field]: Object.assign(Object.assign({}, state[field]), {
        status: data_status_enum_1.dataStatus.loading
      })
    });
  }

  static createUploadedReducer(field) {
    return (state, action) => Object.assign(Object.assign({}, state), {
      [field]: Object.assign(Object.assign({}, state[field]), {
        error: undefined,
        status: data_status_enum_1.dataStatus.valid,
        value: action.payload,
        time: Date.now()
      })
    });
  }

  static createUploadErrorReducer(field) {
    return (state, action) => Object.assign(Object.assign({}, state), {
      [field]: Object.assign(Object.assign({}, state[field]), {
        status: data_status_enum_1.dataStatus.error,
        error: action.payload
      })
    });
  }

}

exports.DataReducersHelper = DataReducersHelper;
},{"../store/enums/data-status.enum":"store/enums/data-status.enum.ts"}],"store/enums/chats-action-type.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chatsActionType = void 0;
var chatsActionType;

(function (chatsActionType) {
  chatsActionType["chatListUpload"] = "chats-chatList__upload";
  chatsActionType["chatListUploaded"] = "chats-chatList__uploaded";
  chatsActionType["chatListUploadError"] = "chats-chatList__uploadError";
  chatsActionType["createChatUpload"] = "chats-createChat__upload";
  chatsActionType["createChatUploaded"] = "chats-createChat__uploaded";
  chatsActionType["createChatUploadError"] = "chats-createChat__uploadError";
  chatsActionType["deleteChatUpload"] = "chats-deleteChat__upload";
  chatsActionType["deleteChatUploaded"] = "chats-deleteChat__uploaded";
  chatsActionType["deleteChatUploadError"] = "chats-deleteChat__uploadError";
  chatsActionType["chatTokenUpload"] = "chats-chatToken__upload";
  chatsActionType["chatTokenUploaded"] = "chats-chatToken__uploaded";
  chatsActionType["chatTokenUploadError"] = "chats-chatToken__uploadError";
  chatsActionType["deleteChatUsersUpload"] = "chats-deleteChatUsers__upload";
  chatsActionType["deleteChatUsersUploaded"] = "chats-deleteChatUsers__uploaded";
  chatsActionType["deleteChatUsersUploadError"] = "chats-deleteChatUsers__uploadError";
  chatsActionType["addChatUsersUpload"] = "chats-addChatUsers__upload";
  chatsActionType["addChatUsersUploaded"] = "chats-addChatUsers__uploaded";
  chatsActionType["addChatUsersUploadError"] = "chats-addChatUsers__uploadError";
})(chatsActionType = exports.chatsActionType || (exports.chatsActionType = {}));
},{}],"store/reducers/chats-reducers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chatsReducers = void 0;

const data_reducers_helper_1 = require("../../utils/data-reducers-helper");

const chats_action_type_enum_1 = require("../enums/chats-action-type.enum");

const data_status_enum_1 = require("../enums/data-status.enum");

const reduser_adaptor_1 = require("../functions/reduser-adaptor");

const _chatsReducers = {
  [chats_action_type_enum_1.chatsActionType.chatListUpload]: data_reducers_helper_1.DataReducersHelper.createUploadReducer('list'),
  [chats_action_type_enum_1.chatsActionType.chatListUploaded]: data_reducers_helper_1.DataReducersHelper.createUploadedReducer('list'),
  [chats_action_type_enum_1.chatsActionType.chatListUploadError]: data_reducers_helper_1.DataReducersHelper.createUploadErrorReducer('list'),
  [chats_action_type_enum_1.chatsActionType.createChatUpload]: data_reducers_helper_1.DataReducersHelper.createUploadReducer('createChat'),
  [chats_action_type_enum_1.chatsActionType.createChatUploaded]: data_reducers_helper_1.DataReducersHelper.createUploadedReducer('createChat'),
  [chats_action_type_enum_1.chatsActionType.createChatUploadError]: data_reducers_helper_1.DataReducersHelper.createUploadErrorReducer('createChat'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUpload]: data_reducers_helper_1.DataReducersHelper.createUploadReducer('deleteChat'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUploaded]: data_reducers_helper_1.DataReducersHelper.createUploadedReducer('deleteChat'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUploadError]: data_reducers_helper_1.DataReducersHelper.createUploadErrorReducer('deleteChat'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUsersUpload]: data_reducers_helper_1.DataReducersHelper.createUploadReducer('deleteChatUsers'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUsersUploaded]: data_reducers_helper_1.DataReducersHelper.createUploadedReducer('deleteChatUsers'),
  [chats_action_type_enum_1.chatsActionType.deleteChatUsersUploadError]: data_reducers_helper_1.DataReducersHelper.createUploadErrorReducer('deleteChatUsers'),
  [chats_action_type_enum_1.chatsActionType.addChatUsersUpload]: data_reducers_helper_1.DataReducersHelper.createUploadReducer('addChatUsers'),
  [chats_action_type_enum_1.chatsActionType.addChatUsersUploaded]: data_reducers_helper_1.DataReducersHelper.createUploadedReducer('addChatUsers'),
  [chats_action_type_enum_1.chatsActionType.addChatUsersUploadError]: data_reducers_helper_1.DataReducersHelper.createUploadErrorReducer('addChatUsers'),
  [chats_action_type_enum_1.chatsActionType.chatTokenUpload]: (state, action) => Object.assign(Object.assign({}, state), {
    tokens: Object.assign(Object.assign({}, state.tokens), {
      [action.payload]: Object.assign(Object.assign({}, state.tokens[action.payload]), {
        status: data_status_enum_1.dataStatus.loading
      })
    })
  }),
  [chats_action_type_enum_1.chatsActionType.chatTokenUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    tokens: Object.assign(Object.assign({}, state.tokens), {
      [action.payload.chatId]: Object.assign(Object.assign({}, state.tokens[action.payload.chatId]), {
        error: undefined,
        status: data_status_enum_1.dataStatus.valid,
        value: action.payload.chatToken,
        time: Date.now()
      })
    })
  }),
  [chats_action_type_enum_1.chatsActionType.chatTokenUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    tokens: Object.assign(Object.assign({}, state.tokens), {
      [action.payload.chatId]: Object.assign(Object.assign({}, state.tokens[action.payload.chatId]), {
        status: data_status_enum_1.dataStatus.error,
        error: action.payload.error
      })
    })
  })
};
exports.chatsReducers = reduser_adaptor_1.reducerAdapt(_chatsReducers, 'chats');
},{"../../utils/data-reducers-helper":"utils/data-reducers-helper.ts","../enums/chats-action-type.enum":"store/enums/chats-action-type.enum.ts","../enums/data-status.enum":"store/enums/data-status.enum.ts","../functions/reduser-adaptor":"store/functions/reduser-adaptor.ts"}],"store/enums/user-action-type.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userActionType = void 0;
var userActionType;

(function (userActionType) {
  userActionType["changePasswordUpload"] = "user-changePassword__upload";
  userActionType["changePasswordUploaded"] = "user-changePassword__uploaded";
  userActionType["changePasswordUploadError"] = "user-changePassword__uploadError";
  userActionType["changeUserDataUpload"] = "user-changeUserData__upload";
  userActionType["changeUserDataUploaded"] = "user-changeUserData__uploaded";
  userActionType["changeUserDataUploadError"] = "user-changeUserData__uploadError";
})(userActionType = exports.userActionType || (exports.userActionType = {}));
},{}],"store/reducers/user-reducers.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userReducers = void 0;

const data_status_enum_1 = require("../enums/data-status.enum");

const user_action_type_enum_1 = require("../enums/user-action-type.enum");

const reduser_adaptor_1 = require("../functions/reduser-adaptor");

const _userReducers = {
  [user_action_type_enum_1.userActionType.changePasswordUpload]: state => Object.assign(Object.assign({}, state), {
    changePassword: Object.assign(Object.assign({}, state.changePassword), {
      status: data_status_enum_1.dataStatus.loading
    })
  }),
  [user_action_type_enum_1.userActionType.changePasswordUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    changePassword: Object.assign(Object.assign({}, state.changePassword), {
      error: undefined,
      status: data_status_enum_1.dataStatus.valid,
      value: action.payload,
      time: Date.now()
    })
  }),
  [user_action_type_enum_1.userActionType.changePasswordUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    changePassword: Object.assign(Object.assign({}, state.changePassword), {
      status: data_status_enum_1.dataStatus.error,
      error: action.payload
    })
  }),
  [user_action_type_enum_1.userActionType.changeUserDataUpload]: state => Object.assign(Object.assign({}, state), {
    changeUserData: Object.assign(Object.assign({}, state.changeUserData), {
      status: data_status_enum_1.dataStatus.loading
    })
  }),
  [user_action_type_enum_1.userActionType.changeUserDataUploadError]: (state, action) => Object.assign(Object.assign({}, state), {
    changeUserData: Object.assign(Object.assign({}, state.changeUserData), {
      status: data_status_enum_1.dataStatus.error,
      error: action.payload
    })
  })
};
const _globalUserReducers = {
  [user_action_type_enum_1.userActionType.changeUserDataUploaded]: (state, action) => Object.assign(Object.assign({}, state), {
    user: Object.assign(Object.assign({}, state.user), {
      changeUserData: Object.assign(Object.assign({}, state.user.changeUserData), {
        error: undefined,
        status: data_status_enum_1.dataStatus.valid,
        value: undefined,
        time: Date.now()
      })
    }),
    authorization: Object.assign(Object.assign({}, state.authorization), {
      userData: Object.assign(Object.assign({}, state.authorization.userData), {
        error: undefined,
        status: data_status_enum_1.dataStatus.valid,
        value: action.payload,
        time: Date.now()
      })
    })
  })
};
exports.userReducers = Object.assign(reduser_adaptor_1.reducerAdapt(_userReducers, 'user'), _globalUserReducers);
},{"../enums/data-status.enum":"store/enums/data-status.enum.ts","../enums/user-action-type.enum":"store/enums/user-action-type.enum.ts","../functions/reduser-adaptor":"store/functions/reduser-adaptor.ts"}],"store/reducers/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReducer = void 0;

const active_chats_state_reducers_1 = require("./active-chats-state.reducers");

const authorization_reducers_1 = require("./authorization-reducers");

const chats_reducers_1 = require("./chats-reducers");

const user_reducers_1 = require("./user-reducers");

function getReducer() {
  const reducers = Object.assign(Object.assign(Object.assign(Object.assign({}, authorization_reducers_1.authorizationReducers), user_reducers_1.userReducers), chats_reducers_1.chatsReducers), active_chats_state_reducers_1.activeChatsReducers);
  return function (state, action) {
    return reducers[action.type](state, action);
  };
}

exports.getReducer = getReducer;
},{"./active-chats-state.reducers":"store/reducers/active-chats-state.reducers.ts","./authorization-reducers":"store/reducers/authorization-reducers.ts","./chats-reducers":"store/reducers/chats-reducers.ts","./user-reducers":"store/reducers/user-reducers.ts"}],"store/store.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

const subject_1 = require("../utils/observeble/subject");

const default_state_const_1 = require("./consts/default-state.const");

const reducer_1 = require("./reducers/reducer");

let instance;

class Store {
  constructor() {
    this._state = default_state_const_1.defaultState;
    this._$state = new subject_1.Subject(this._state);
    this.reduser = reducer_1.getReducer();

    if (instance) {
      return instance;
    }

    instance = this;
  }

  get $state() {
    return this._$state.asObserveble();
  }

  get state() {
    return this._state;
  }

  dispatch(action) {
    const nextState = this.reduser(this._state, action);
    this._state = nextState;

    this._$state.next(nextState);
  }

}

exports.Store = Store;
},{"../utils/observeble/subject":"utils/observeble/subject.ts","./consts/default-state.const":"store/consts/default-state.const.ts","./reducers/reducer":"store/reducers/reducer.ts"}],"guards/auth-guard.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthGuard = void 0;

const pages_config_1 = require("../service/router/pages.config");

const router_service_1 = require("../service/router/router.service");

const select_is_authorized_1 = require("../store/selectors/authorization/select-is-authorized");

const store_1 = require("../store/store");

class AuthGuard {
  constructor() {
    this.store = new store_1.Store();
    this.routerService = new router_service_1.RouterService();
  }

  canOpen() {
    return select_is_authorized_1.selectIsAuthorized(this.store.state);
  }

  onOpenError() {
    this.routerService.navigateTo(pages_config_1.pages.auth);
  }

}

exports.AuthGuard = AuthGuard;
},{"../service/router/pages.config":"service/router/pages.config.ts","../service/router/router.service":"service/router/router.service.ts","../store/selectors/authorization/select-is-authorized":"store/selectors/authorization/select-is-authorized.ts","../store/store":"store/store.ts"}],"store/actions/authorization.actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadErrorUserDataAction = exports.UploadedUserDataAction = exports.UploadUserDataAction = exports.UploadErrorLogoutAction = exports.UploadedLogoutAction = exports.UploadLogoutAction = exports.UploadErrorAuthTokenAction = exports.UploadedAuthTokenAction = exports.UploadAuthTokenAction = void 0;

const authorization_action_type_enum_1 = require("../enums/authorization-action-type.enum");

class UploadAuthTokenAction {
  constructor() {
    this.type = authorization_action_type_enum_1.authorizationActionType.authTokenUpload;
  }

}

exports.UploadAuthTokenAction = UploadAuthTokenAction;

class UploadedAuthTokenAction {
  constructor() {
    this.type = authorization_action_type_enum_1.authorizationActionType.authTokenUploaded;
    this.payload = undefined;
  }

}

exports.UploadedAuthTokenAction = UploadedAuthTokenAction;

class UploadErrorAuthTokenAction {
  constructor(error) {
    this.type = authorization_action_type_enum_1.authorizationActionType.userDataUploadError;
    this.payload = error;
  }

}

exports.UploadErrorAuthTokenAction = UploadErrorAuthTokenAction;

class UploadLogoutAction {
  constructor() {
    this.type = authorization_action_type_enum_1.authorizationActionType.logoutUpload;
  }

}

exports.UploadLogoutAction = UploadLogoutAction;

class UploadedLogoutAction {
  constructor() {
    this.type = authorization_action_type_enum_1.authorizationActionType.logoutUploaded;
    this.payload = undefined;
  }

}

exports.UploadedLogoutAction = UploadedLogoutAction;

class UploadErrorLogoutAction {
  constructor(error) {
    this.type = authorization_action_type_enum_1.authorizationActionType.logoutUploadError;
    this.payload = error;
  }

}

exports.UploadErrorLogoutAction = UploadErrorLogoutAction;

class UploadUserDataAction {
  constructor() {
    this.type = authorization_action_type_enum_1.authorizationActionType.userDataUpload;
  }

}

exports.UploadUserDataAction = UploadUserDataAction;

class UploadedUserDataAction {
  constructor(data) {
    this.type = authorization_action_type_enum_1.authorizationActionType.userDataUploaded;
    this.payload = data;
  }

}

exports.UploadedUserDataAction = UploadedUserDataAction;

class UploadErrorUserDataAction {
  constructor(error) {
    this.type = authorization_action_type_enum_1.authorizationActionType.userDataUploadError;
    this.payload = error;
  }

}

exports.UploadErrorUserDataAction = UploadErrorUserDataAction;
},{"../enums/authorization-action-type.enum":"store/enums/authorization-action-type.enum.ts"}],"store/selectors/authorization/select-user-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectUserData = void 0;

function selectUserData(state) {
  return state.authorization.userData;
}

exports.selectUserData = selectUserData;
},{}],"interceptor/auth-interceptor.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthInterceptor = void 0;

const pages_config_1 = require("../service/router/pages.config");

const router_service_1 = require("../service/router/router.service");

class AuthInterceptor {
  constructor() {
    this.routerService = new router_service_1.RouterService();
  }

  interceptRequest(request) {
    if (request.status === 401) {
      this.routerService.navigateTo(pages_config_1.pages.auth);
    }
  }

}

exports.AuthInterceptor = AuthInterceptor;
},{"../service/router/pages.config":"service/router/pages.config.ts","../service/router/router.service":"service/router/router.service.ts"}],"utils/api/http-method.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPMethod = void 0;
var HTTPMethod;

(function (HTTPMethod) {
  HTTPMethod["GET"] = "GET";
  HTTPMethod["PUT"] = "PUT";
  HTTPMethod["POST"] = "POST";
  HTTPMethod["DELETE"] = "DELETE";
})(HTTPMethod = exports.HTTPMethod || (exports.HTTPMethod = {}));
},{}],"utils/api/http-client.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClient = void 0;

class HTTPClient {
  constructor(origin, interseptors) {
    this.origin = origin;
    this.interseptors = interseptors;
  }

  upload(appRequest) {
    const request = Object.create(appRequest);
    request.origin = this.origin || window.location.origin;
    return this._upload(request);
  }

  static queryStringify(query) {
    if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
      return '';
    }

    return `?${Object.keys(query).map(key => `${key}=${query[key]}`).join('&')}`;
  }

  static mapXMLHttpRequestToResponse(xhr) {
    return {
      status: xhr.status,
      statusText: xhr.statusText,
      body: xhr.response
    };
  }

  _upload(request) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      if (request.timeout) {
        xhr.timeout = request.timeout;
      }

      xhr.responseType = 'json';
      xhr.withCredentials = true;
      xhr.onabort = this.getXMLHttpRequestHandler(resolve, reject);
      xhr.onerror = this.getXMLHttpRequestHandler(resolve, reject);
      xhr.ontimeout = this.getXMLHttpRequestHandler(resolve, reject);
      xhr.onload = this.getXMLHttpRequestHandler(resolve, reject);
      xhr.open(request.method, `${request.origin}/${request.pathname.join('/')}${HTTPClient.queryStringify(request.queryParams)}`);

      if (request.headers) {
        for (const [key, value] of Object.entries(request.headers)) {
          xhr.setRequestHeader(key, value);
        }
      }

      xhr.setRequestHeader('Content-Type', 'application/json');
      const body = typeof request.body === 'object' ? JSON.stringify(request.body) : request.body;
      xhr.send(body);
    });
  }

  getXMLHttpRequestHandler(resolve, reject) {
    const {
      interseptors
    } = this;
    return function (_event) {
      if (interseptors) {
        for (const interseptor of interseptors) {
          interseptor.interceptRequest(this, _event);
        }
      }

      if (this.status >= 200 && this.status < 300) {
        resolve(HTTPClient.mapXMLHttpRequestToResponse(this));
      } else {
        reject(HTTPClient.mapXMLHttpRequestToResponse(this));
      }
    };
  }

}

exports.HTTPClient = HTTPClient;
},{}],"utils/api/http-client-module.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClientModule = void 0;

const http_client_1 = require("./http-client");

class HTTPClientModule {
  constructor(origin, mutualPathname = [], interceptors = []) {
    this.httpClient = new http_client_1.HTTPClient(origin, interceptors);
    this.mutualPathname = mutualPathname;
  }

  upload(request) {
    const moduleRequest = Object.assign({}, request);
    moduleRequest.pathname = this.mutualPathname.concat(moduleRequest.pathname);
    return this.httpClient.upload(moduleRequest);
  }

}

exports.HTTPClientModule = HTTPClientModule;
},{"./http-client":"utils/api/http-client.ts"}],"service/api/modules/auth-http-client-module.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthHTTPClientModule = void 0;

const http_method_1 = require("../../../utils/api/http-method");

const http_client_module_1 = require("../../../utils/api/http-client-module");

class AuthHTTPClientModule extends http_client_module_1.HTTPClientModule {
  constructor(origin, mutualPathname, interseptors = []) {
    super(origin, mutualPathname.concat(AuthHTTPClientModule.moduleMutualPathname), interseptors);
  }

  registration(body) {
    return this.upload({
      method: http_method_1.HTTPMethod.POST,
      pathname: ['signup'],
      body
    });
  }

  authorization(body) {
    return this.upload({
      method: http_method_1.HTTPMethod.POST,
      pathname: ['signin'],
      body
    });
  }

  logout() {
    return this.upload({
      method: http_method_1.HTTPMethod.POST,
      pathname: ['logout']
    });
  }

  getUserData() {
    return this.upload({
      method: http_method_1.HTTPMethod.GET,
      pathname: ['user']
    });
  }

}

exports.AuthHTTPClientModule = AuthHTTPClientModule;
AuthHTTPClientModule.moduleMutualPathname = ['auth'];
},{"../../../utils/api/http-method":"utils/api/http-method.ts","../../../utils/api/http-client-module":"utils/api/http-client-module.ts"}],"service/api/modules/chats-http-client-module.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatsHttpClientModule = void 0;

const http_client_module_1 = require("../../../utils/api/http-client-module");

const http_method_1 = require("../../../utils/api/http-method");

const DEFAULT_CHATS_LIMIT = 30;

class ChatsHttpClientModule extends http_client_module_1.HTTPClientModule {
  constructor(origin, mutualPathname, interseptors = []) {
    super(origin, mutualPathname.concat(ChatsHttpClientModule.moduleMutualPathname), interseptors);
  }

  uploadChats(queryParams = {
    limit: DEFAULT_CHATS_LIMIT
  }) {
    if (!queryParams.limit) {
      queryParams.limit = DEFAULT_CHATS_LIMIT;
    }

    return this.upload({
      method: http_method_1.HTTPMethod.GET,
      pathname: [],
      queryParams
    });
  }

  createChat(title) {
    return this.upload({
      method: http_method_1.HTTPMethod.POST,
      pathname: [],
      body: {
        title
      }
    });
  }

  deleteChat(chatId) {
    return this.upload({
      method: http_method_1.HTTPMethod.DELETE,
      pathname: [],
      body: {
        chatId
      }
    });
  }

  getTokenForChat(chatId) {
    return this.upload({
      method: http_method_1.HTTPMethod.POST,
      pathname: ['token', String(chatId)]
    });
  }

  deleteUsersFormChat(usersIds, chatId) {
    return this.upload({
      method: http_method_1.HTTPMethod.DELETE,
      pathname: ['users'],
      body: {
        usersIds,
        chatId
      }
    });
  }

  addUsersToChat(usersIds, chatId) {
    return this.upload({
      method: http_method_1.HTTPMethod.PUT,
      pathname: ['users'],
      body: {
        usersIds,
        chatId
      }
    });
  }

}

exports.ChatsHttpClientModule = ChatsHttpClientModule;
ChatsHttpClientModule.moduleMutualPathname = ['chats'];
},{"../../../utils/api/http-client-module":"utils/api/http-client-module.ts","../../../utils/api/http-method":"utils/api/http-method.ts"}],"service/api/modules/user-http-client-module.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserHTTPClientModule = void 0;

const http_client_module_1 = require("../../../utils/api/http-client-module");

const http_method_1 = require("../../../utils/api/http-method");

class UserHTTPClientModule extends http_client_module_1.HTTPClientModule {
  constructor(origin, mutualPathname, interseptors = []) {
    super(origin, mutualPathname.concat(UserHTTPClientModule.moduleMutualPathname), interseptors);
  }

  changeData(body) {
    return this.upload({
      method: http_method_1.HTTPMethod.PUT,
      pathname: ['profile'],
      body
    });
  }

  changePassword(body) {
    return this.upload({
      method: http_method_1.HTTPMethod.PUT,
      pathname: ['password'],
      body
    });
  }

}

exports.UserHTTPClientModule = UserHTTPClientModule;
UserHTTPClientModule.moduleMutualPathname = ['user'];
},{"../../../utils/api/http-client-module":"utils/api/http-client-module.ts","../../../utils/api/http-method":"utils/api/http-method.ts"}],"service/api/http-client.facade.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClientFacade = exports.API_SERVER = void 0;

const auth_interceptor_1 = require("../../interceptor/auth-interceptor");

const auth_http_client_module_1 = require("./modules/auth-http-client-module");

const chats_http_client_module_1 = require("./modules/chats-http-client-module");

const user_http_client_module_1 = require("./modules/user-http-client-module");

let instance;
exports.API_SERVER = 'ya-praktikum.tech';

class HTTPClientFacade {
  constructor() {
    this.mutualPathname = ['api', 'v2'];
    this.origin = `https://${exports.API_SERVER}`;
    this.interseptors = [new auth_interceptor_1.AuthInterceptor()];

    if (instance) {
      return instance;
    }

    instance = this;
    this.auth = new auth_http_client_module_1.AuthHTTPClientModule(this.origin, this.mutualPathname, this.interseptors);
    this.user = new user_http_client_module_1.UserHTTPClientModule(this.origin, this.mutualPathname, this.interseptors);
    this.chats = new chats_http_client_module_1.ChatsHttpClientModule(this.origin, this.mutualPathname, this.interseptors);
  }

}

exports.HTTPClientFacade = HTTPClientFacade;
},{"../../interceptor/auth-interceptor":"interceptor/auth-interceptor.ts","./modules/auth-http-client-module":"service/api/modules/auth-http-client-module.ts","./modules/chats-http-client-module":"service/api/modules/chats-http-client-module.ts","./modules/user-http-client-module":"service/api/modules/user-http-client-module.ts"}],"service/auth.service.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthService = void 0;

const authorization_actions_1 = require("../store/actions/authorization.actions");

const data_status_enum_1 = require("../store/enums/data-status.enum");

const select_is_authorized_1 = require("../store/selectors/authorization/select-is-authorized");

const select_user_data_1 = require("../store/selectors/authorization/select-user-data");

const select_status_1 = require("../store/selectors/data/select-status");

const store_1 = require("../store/store");

const http_client_facade_1 = require("./api/http-client.facade");

let instance;

class AuthService {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.httpClientFacade = new http_client_facade_1.HTTPClientFacade();
    this.store = new store_1.Store();
  }

  authorization(authData) {
    return (select_is_authorized_1.selectIsAuthorized(this.store.state) ? this.logout().catch() : Promise.resolve()).then(() => this.store.dispatch(new authorization_actions_1.UploadAuthTokenAction())).then(() => this.httpClientFacade.auth.authorization(authData)).then(() => this.store.dispatch(new authorization_actions_1.UploadedAuthTokenAction())).catch(error => {
      this.store.dispatch(new authorization_actions_1.UploadErrorAuthTokenAction(error));
      throw error;
    });
  }

  registration(registrationData) {
    return (select_is_authorized_1.selectIsAuthorized(this.store.state) ? this.logout().catch() : Promise.resolve()).then(() => this.store.dispatch(new authorization_actions_1.UploadAuthTokenAction())).then(() => this.httpClientFacade.auth.registration(registrationData)).then(() => this.store.dispatch(new authorization_actions_1.UploadedAuthTokenAction())).catch(error => {
      this.store.dispatch(new authorization_actions_1.UploadErrorAuthTokenAction(error));
      throw error;
    });
  }

  logout() {
    this.store.dispatch(new authorization_actions_1.UploadLogoutAction());
    return this.httpClientFacade.auth.logout().then(() => this.store.dispatch(new authorization_actions_1.UploadedLogoutAction())).catch(error => {
      this.store.dispatch(new authorization_actions_1.UploadErrorLogoutAction(error));
      throw error;
    });
  }

  uploadUserData() {
    this.store.dispatch(new authorization_actions_1.UploadUserDataAction());
    return this.httpClientFacade.auth.getUserData().then(response => this.store.dispatch(new authorization_actions_1.UploadedUserDataAction(response.body))).catch(error => {
      this.store.dispatch(new authorization_actions_1.UploadErrorUserDataAction(error));
      throw error;
    });
  }

  uploadUserDataIfNot() {
    return select_status_1.selectDataStatus(select_user_data_1.selectUserData(this.store.state)) === data_status_enum_1.dataStatus.valid ? Promise.resolve() : this.uploadUserData();
  }

}

exports.AuthService = AuthService;
},{"../store/actions/authorization.actions":"store/actions/authorization.actions.ts","../store/enums/data-status.enum":"store/enums/data-status.enum.ts","../store/selectors/authorization/select-is-authorized":"store/selectors/authorization/select-is-authorized.ts","../store/selectors/authorization/select-user-data":"store/selectors/authorization/select-user-data.ts","../store/selectors/data/select-status":"store/selectors/data/select-status.ts","../store/store":"store/store.ts","./api/http-client.facade":"service/api/http-client.facade.ts"}],"pages/main/service/main-page-manager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainPageManager = void 0;

const auth_service_1 = require("../../../service/auth.service");

const pages_config_1 = require("../../../service/router/pages.config");

const router_service_1 = require("../../../service/router/router.service");

let instance;

class MainPageManager {
  // Private readonly activeChatsService: ActiveChatsService;
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.routerService = new router_service_1.RouterService();
    this.authService = new auth_service_1.AuthService(); // This.activeChatsService = new ActiveChatsService();
  }

  navigateToAuth() {
    this.routerService.navigateTo(pages_config_1.pages.auth);
  }

  navigateToProfile() {
    this.routerService.navigateTo(pages_config_1.pages.profile);
  }

  logout() {
    this.authService.logout().catch().then(() => this.navigateToAuth());
  }

}

exports.MainPageManager = MainPageManager;
},{"../../../service/auth.service":"service/auth.service.ts","../../../service/router/pages.config":"service/router/pages.config.ts","../../../service/router/router.service":"service/router/router.service.ts"}],"pages/main/page-main.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageMain = void 0;

const component_1 = require("../../utils/component");

const page_main_tmpl_1 = require("./page-main.tmpl");

require("./page-main.less");

const auth_guard_1 = require("../../guards/auth-guard");

const main_page_manager_1 = require("./service/main-page-manager");

let PageMain = class PageMain {
  constructor() {
    this.mainPageManager = new main_page_manager_1.MainPageManager();
  }

  onInit() {}

  navigateToAuth() {
    this.mainPageManager.navigateToAuth();
  }

  navigateToProfile() {
    this.mainPageManager.navigateToProfile();
  }

  logout() {
    this.mainPageManager.logout();
  }

};
PageMain = __decorate([component_1.component({
  name: 'page-main',
  template: page_main_tmpl_1.template,
  guards: [auth_guard_1.AuthGuard]
})], PageMain);
exports.PageMain = PageMain;
},{"../../utils/component":"utils/component.ts","./page-main.tmpl":"pages/main/page-main.tmpl.ts","./page-main.less":"pages/main/page-main.less","../../guards/auth-guard":"guards/auth-guard.ts","./service/main-page-manager":"pages/main/service/main-page-manager.ts"}],"pages/auth/page-auth.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <main>
        <h1>
            {{$title}}
        </h1>

        <app-form name="authorization" hidden={{$isRegistration}} formGroup=[[authForm]]>
            <app-input slot="field" formControl=[[authForm.controls.login]]>
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" formControl=[[authForm.controls.password]]>
                <span slot="label">Пароль</span>
            </app-input>

            <app-button slot="submit" class="space-top_8" @disabledclick={{onDisabledClickFormAuthorization()}} disabled={{$isDisabledAuthorizationForm}} appearance="primary">
                <span slot="label">
                    Авторизироваться
                </span>
            </app-button>
        </app-form>

        <app-form name="registration" hidden={{$isAuthorization}} formGroup=[[registrationForm]]>
            <app-input slot="field" formControl=[[registrationForm.controls.first_name]]>
                <span slot="label">Имя</span>
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.second_name]]>
                <span slot="label">Фамилия</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.login]]>
                <span slot="label">Логин</span>
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.email]]>
                <span slot="label">Почта</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.password]]>
                <span slot="label">Пароль</span>    
            </app-input>
            <app-input slot="field" formControl=[[registrationForm.controls.phone]]>
                <span slot="label">Телефон</span> 
            </app-input>

            <app-button slot="submit" class="space-top_8" @disabledclick={{onDisabledClickFormRegistration()}} disabled={{$isDisabledRegistrationForm}} appearance="primary">
                <span slot="label">
                    Регистрация
                </span>
            </app-button>
        </app-form>

        <app-button @click={{navigateToAuthorization()}} appearance="secondary" hidden={{$isRegistration}}>
            <span slot="label">
                Войти
            </span>
        </app-button>

        <app-button @click={{navigateToRegistration()}} appearance="secondary" hidden={{$isAuthorization}}>
            <span slot="label">
                Нет акаунта?
            </span>
    </app-button>
    </main>
`;
},{}],"utils/animation/animation-utils/transform.functions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;
exports.transform = {
  rotate(deg) {
    return `rotate(${deg}deg)`;
  },

  scale(size) {
    return `scale(${size})`;
  }

};
},{}],"utils/animation/animations/shaking-animation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShakingAnimation = void 0;

const transform_functions_1 = require("../animation-utils/transform.functions");

class ShakingAnimation {
  constructor() {
    this.keyFrames = [{
      transform: transform_functions_1.transform.rotate(0)
    }, {
      transform: transform_functions_1.transform.rotate(1)
    }, {
      transform: transform_functions_1.transform.rotate(-1)
    }, {
      transform: transform_functions_1.transform.rotate(0)
    }];
    this.keyframeAnimationOptions = {
      duration: 70,
      iterations: 10
    };
  }

}

exports.ShakingAnimation = ShakingAnimation;
},{"../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts"}],"utils/form/form-control.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormControl = exports.FormStatusType = void 0;

const observeble_1 = require("../observeble/observeble");

const subject_1 = require("../observeble/subject");

var FormStatusType;

(function (FormStatusType) {
  FormStatusType["valid"] = "VALID";
  FormStatusType["invalid"] = "INVALID";
})(FormStatusType = exports.FormStatusType || (exports.FormStatusType = {}));

class FormControl {
  constructor(config) {
    this.touched = new subject_1.Subject(false);
    this.hasFocus = new subject_1.Subject(false);
    this.disabled = new subject_1.Subject(false);
    this.animations = new subject_1.Subject();
    this.$value = new subject_1.Subject(config.value || '');
    this._value = config.value;
    this.name = config.name;
    this.validators = config.validators || [];
    this.asyncValidators = config.asyncValidators || [];
  }

  get value() {
    return this._value;
  }

  get $valueChanged() {
    return this.$value.asObserveble();
  }

  get $statusChanged() {
    return observeble_1.Observable.all([this.$valueChanged, ...this.asyncValidators.map(validate => validate(this.$valueChanged))]).map(([value, ...asyncValidatorsResults]) => this.mapValueToStatus(value, asyncValidatorsResults)).uniqueNext(true, (last, next) => FormControl.hasDiffInStatuses(last, next));
  }

  get $touched() {
    return this.touched.asObserveble();
  }

  get $changeFocus() {
    return this.hasFocus.asObserveble().uniqueNext();
  }

  get $isValid() {
    return this.$statusChanged.map(status => status.status === FormStatusType.valid).uniqueNext();
  }

  get $disabled() {
    return this.disabled.asObserveble().uniqueNext();
  }

  get $animations() {
    return this.animations.asObserveble();
  }

  next(value) {
    this._value = value;
    this.$value.next(value || '');
  }

  touch() {
    this.touched.next(true);
  }

  disable(disabled) {
    this.disabled.next(disabled);
  }

  changeFocus(hasFocus) {
    this.hasFocus.next(hasFocus);
  }

  animate(animations) {
    this.animations.next(animations);
  }

  static hasDiffInStatuses(last, next) {
    const hasStatusDiff = last.status !== next.status;
    return hasStatusDiff || FormControl.hasErrorsDiff(last.errors, next.errors);
  }

  static hasErrorsDiff(last, next) {
    if (last && !next || !last && next) {
      return true;
    }

    if (last === undefined && next === undefined) {
      return false;
    }

    if (last.length !== next.length) {
      return true;
    }

    for (let index = 0; index < last.length; index++) {
      if (!last[index].equals(next[index])) {
        return true;
      }
    }

    return false;
  }

  mapValueToStatus(value, asyncValidatorsResults) {
    let errors = [];

    for (const validator of this.validators) {
      const error = validator(value);

      if (error) {
        errors.push(error);
      }
    }

    errors = errors.concat(asyncValidatorsResults.filter(error => Boolean(error)));

    if (errors.length === 0) {
      return {
        status: FormStatusType.valid
      };
    }

    return {
      status: FormStatusType.invalid,
      errors
    };
  }

}

exports.FormControl = FormControl;
},{"../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts"}],"utils/form/form-group.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormGroup = void 0;

const shaking_animation_1 = require("../animation/animations/shaking-animation");

const observeble_1 = require("../observeble/observeble");

const subject_1 = require("../observeble/subject");

const form_control_1 = require("./form-control");

class FormGroup {
  constructor(config) {
    this._$submit = new subject_1.Subject();
    const controls = {};

    if (config.controls) {
      for (const [name, formConfig] of Object.entries(config.controls)) {
        controls[name] = this.initFormControl(name, formConfig, config);
      }
    }

    this.controls = controls;
  }

  get value() {
    return Object.values(this.controls).reduce((out, control) => {
      out[control.name] = String(control.value);
      return out;
    }, {});
  }

  get $submit() {
    return this._$submit.asObserveble();
  }

  get $valueChanged() {
    return observeble_1.Observable.concat(Object.values(this.controls).map(control => control.$valueChanged.map(value => ({
      value,
      name: control.name
    })))).map(entrys => entrys.reduce((out, entry) => {
      if (entry) {
        out[entry.name] = String(entry.value);
      }

      return out;
    }, {}));
  }

  get $statusChanged() {
    return observeble_1.Observable.concat(Object.values(this.controls).map(control => control.$statusChanged.map(status => Object.assign(Object.assign({}, status), {
      name: control.name
    })))).map(statuses => {
      const isValid = statuses.every(status => status.status === form_control_1.FormStatusType.valid);

      if (isValid) {
        return {
          status: form_control_1.FormStatusType.valid
        };
      }

      const errors = statuses.reduce((out, status) => {
        if (status && status.errors) {
          out[status.name] = status.errors;
        }

        return out;
      }, {});
      return {
        status: form_control_1.FormStatusType.invalid,
        errors
      };
    });
  }

  get $isValid() {
    return observeble_1.Observable.concat(Object.values(this.controls).map(control => control.$isValid)).map(isValidFieldsArray => isValidFieldsArray.every(isValid => isValid));
  }

  touch() {
    for (const control of Object.values(this.controls)) {
      control.touch();
    }
  }

  disable(disabled) {
    for (const control of Object.values(this.controls)) {
      control.disable(disabled);
    }
  }

  submit(value) {
    this._$submit.next(value);
  }

  next(formValue) {
    for (const [key, value] of Object.entries(formValue)) {
      if (this.controls[key]) {
        this.controls[key].next(value);
      }
    }
  }

  shakingFirstInvalidField() {
    observeble_1.Observable.all(Object.values(this.controls).map(control => control.$isValid.map(isValid => ({
      isValid,
      name: control.name
    })))).only(1).subscribe(isValidObjArray => {
      var _a;

      const firstInvalidControlsName = (_a = isValidObjArray.find(isValidObj => !isValidObj.isValid)) === null || _a === void 0 ? void 0 : _a.name;

      if (firstInvalidControlsName) {
        this.controls[firstInvalidControlsName].animate(new shaking_animation_1.ShakingAnimation());
      }
    });
  }

  initFormControl(name, formConfig, config) {
    if (config.fieldValidators) {
      const formFieldValidators = config.fieldValidators.filter(fieldValidator => fieldValidator.targets.includes(name)).map(fieldValidator => fieldValidator.validators).reduce((out, validators) => out.concat(validators), []);

      if (formFieldValidators.length !== 0) {
        const asyncValidators = [];

        for (const validator of formFieldValidators) {
          asyncValidators.push(() => this.$valueChanged.map(validator));
        }

        formConfig.asyncValidators = (formConfig.asyncValidators || []).concat(asyncValidators);
      }
    }

    return new form_control_1.FormControl(Object.assign({
      name
    }, formConfig));
  }

}

exports.FormGroup = FormGroup;
},{"../animation/animations/shaking-animation":"utils/animation/animations/shaking-animation.ts","../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts","./form-control":"utils/form/form-control.ts"}],"utils/form/validator-error.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorError = exports.ValidationErrorType = void 0;
var ValidationErrorType;

(function (ValidationErrorType) {
  ValidationErrorType["shown"] = "SHOWN";
  ValidationErrorType["hidden"] = "HIDDEN";
})(ValidationErrorType = exports.ValidationErrorType || (exports.ValidationErrorType = {}));

class ValidatorError extends Error {
  constructor(message, type = ValidationErrorType.shown) {
    super(message);
    this.type = type;
  }

  equals(other) {
    return other.type === this.type && other.message === this.message;
  }

}

exports.ValidatorError = ValidatorError;
},{}],"utils/form/validators.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validators = void 0;

const validator_error_1 = require("./validator-error");

const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const defaultMessages = {
  empty: 'Поле должно быть заполнено',
  required: 'Поле заполнено неверно',
  maxLength: length => `Длинна поля не должна быть больше ${length}`,
  minLength: length => `Длинна поля не должна быть меньше ${length}`,
  noSpaces: 'В поле не должно быть пробелов',
  email: 'Почта должна быть в формате my-email@domen.ru'
};

class Validators {
  static empty(error) {
    return function (value) {
      return value ? null : error || new validator_error_1.ValidatorError(defaultMessages.empty);
    };
  }

  static required(regExp, error) {
    return function (value) {
      return regExp.test(Validators.nonNullable(value)) ? null : error || new validator_error_1.ValidatorError(defaultMessages.required);
    };
  }

  static maxLength(length, error) {
    return function (value) {
      return Validators.toString(value).length > length ? error || new validator_error_1.ValidatorError(defaultMessages.maxLength(length)) : null;
    };
  }

  static minLength(length, error) {
    return function (value) {
      return Validators.toString(value).length < length ? error || new validator_error_1.ValidatorError(defaultMessages.minLength(length)) : null;
    };
  }

  static noSpaces(error) {
    return function (value) {
      return /\s/g.test(Validators.toString(value).trim()) ? error || new validator_error_1.ValidatorError(defaultMessages.noSpaces) : null;
    };
  }

  static email(error) {
    return function (value) {
      return EMAIL.test(Validators.toString(value).toLowerCase()) ? null : error || new validator_error_1.ValidatorError(defaultMessages.email);
    };
  }

  static nonNullable(value) {
    return value === undefined || value === null ? '' : value;
  }

  static toString(value) {
    return String(Validators.nonNullable(value));
  }

}

exports.Validators = Validators;
},{"./validator-error":"utils/form/validator-error.ts"}],"const/form-validators.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formValidators = void 0;

const validator_error_1 = require("../utils/form/validator-error");

const validators_1 = require("../utils/form/validators");

const defaultValidators = [validators_1.Validators.noSpaces(), validators_1.Validators.maxLength(50), validators_1.Validators.empty()];
exports.formValidators = {
  password: [...defaultValidators, validators_1.Validators.minLength(6)],
  login: [...defaultValidators, validators_1.Validators.minLength(4)],
  first_name: [...defaultValidators],
  second_name: [...defaultValidators],
  email: [...defaultValidators, validators_1.Validators.email()],
  phone: [...defaultValidators, validators_1.Validators.required(/^\+?\d+$/, new validator_error_1.ValidatorError('Телефон может содержать только цифры и "+" в начале'))],
  display_name: [...defaultValidators, validators_1.Validators.minLength(4)]
};
},{"../utils/form/validator-error":"utils/form/validator-error.ts","../utils/form/validators":"utils/form/validators.ts"}],"components/input/app-input.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <label for={{$name}} status={{$inputStatus}}>
        <slot name="label" instead-of-text={{$labelIsInsteadOfText}}></slot>
    </label>
    <input type="text" name={{$name}} id={{$name}} disabled={{$disabled}} @focus={{onFocus}} @blur={{onBlur}} @input={{onInput}}>
    <div underline={{$inputStatus}}></div>
    <p transparent={{$needHiddenErrors}} class="error">
        {{$errorMessage}}
    </p>
`;
},{}],"components/input/app-input.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"utils/animation/animation-utils/play-animation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playAnimation = void 0;

function playAnimation(element, animation) {
  return new Promise(resolve => {
    if (animation.onStart) {
      for (const onStartFunction of animation.onStart) {
        onStartFunction(element);
      }
    }

    resolve();
  }).then(() => element.animate(animation.keyFrames, animation.keyframeAnimationOptions).finished).then(() => {
    if (animation.onFinish) {
      for (const onFinishFunction of animation.onFinish) {
        onFinishFunction(element);
      }
    }
  });
}

exports.playAnimation = playAnimation;
},{}],"components/input/app-input.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppInput = void 0;

const component_1 = require("../../utils/component");

const app_input_tmpl_1 = require("./app-input.tmpl");

require("./app-input.less");

const form_control_1 = require("../../utils/form/form-control");

const observeble_1 = require("../../utils/observeble/observeble");

const validator_error_1 = require("../../utils/form/validator-error");

const play_animation_1 = require("../../utils/animation/animation-utils/play-animation");

const subject_1 = require("../../utils/observeble/subject");

let AppInput = class AppInput {
  constructor() {
    this._$name = new subject_1.Subject();
  }

  onInit() {
    this._$name.next(this.formControl ? this.formControl.name : false);
  }

  get $name() {
    return this._$name.asObserveble();
  } // TODO: Разбить на методы


  onRendered(element) {
    this.input = element.querySelector('input');

    if (this.formControl) {
      this.formControl.$valueChanged.subscribe(value => {
        this.input.value = value || '';
      });
    } else {
      this.formControl = new form_control_1.FormControl({
        name: ''
      });
    }

    observeble_1.Observable.event(element, 'click').subscribe(() => this.setFocusForInput());
    this.formControl.$animations.subscribe(animation => play_animation_1.playAnimation(element, animation));
  }

  get $hasFocus() {
    return this.formControl.$changeFocus;
  }

  get $hasErrors() {
    return this.formControl.$statusChanged.map(status => Boolean(status === null || status === void 0 ? void 0 : status.errors) && status.errors.some(error => error.type === validator_error_1.ValidationErrorType.shown));
  }

  get $disabled() {
    return this.formControl.$disabled;
  }

  get $errorMessage() {
    return this.formControl.$statusChanged.map(status => {
      var _a, _b;

      return ((_b = (_a = status.errors) === null || _a === void 0 ? void 0 : _a.find(error => error.type === validator_error_1.ValidationErrorType.shown)) === null || _b === void 0 ? void 0 : _b.message) || '';
    }) // WARNING: Благодаря этому, текст ошибки не исчезает мгновенно,
    // а становится прозрачным c анимацией.
    .filter(message => Boolean(message));
  }

  get $needHiddenErrors() {
    return observeble_1.Observable.all([this.$hasErrors, this.formControl.$touched, this.formControl.$disabled]).map(([hasErrors, touched, disabled]) => !hasErrors || !touched || disabled);
  }

  get $inputStatus() {
    return observeble_1.Observable.all([this.$hasErrors, this.formControl.$changeFocus, this.formControl.$touched, this.formControl.$disabled]).map(([hasErrors, hasFocus, touched, disabled]) => {
      if (disabled) {
        return 'disabled';
      }

      if (!touched) {
        return hasFocus ? 'focus' : '';
      }

      if (hasErrors) {
        return 'error';
      }

      if (hasFocus) {
        return 'focus';
      }

      return 'valid';
    }).uniqueNext();
  }

  get $labelIsInsteadOfText() {
    return observeble_1.Observable.all([this.formControl.$changeFocus, this.formControl.$valueChanged.map(value => Boolean(value))]).map(([hasFocus, hasValue]) => !hasFocus && !hasValue);
  }

  onFocus() {
    this.formControl.changeFocus(true);
  }

  onBlur() {
    this.formControl.changeFocus(false);
    this.formControl.touch();
  }

  onInput(event) {
    this.formControl.next(event.target.value);
  }

  setFocusForInput() {
    this.input.focus();
  }

  onAttributeChanged(name, _oldValue, newValue) {
    switch (name) {
      case 'name':
        if (newValue) {
          this._$name.next(newValue);
        } else {
          this._$name.next(false);
        }

        break;

      default:
        break;
    }

    return false;
  }

};
AppInput = __decorate([component_1.component({
  name: 'app-input',
  template: app_input_tmpl_1.template
})], AppInput);
exports.AppInput = AppInput;
},{"../../utils/component":"utils/component.ts","./app-input.tmpl":"components/input/app-input.tmpl.ts","./app-input.less":"components/input/app-input.less","../../utils/form/form-control":"utils/form/form-control.ts","../../utils/observeble/observeble":"utils/observeble/observeble.ts","../../utils/form/validator-error":"utils/form/validator-error.ts","../../utils/animation/animation-utils/play-animation":"utils/animation/animation-utils/play-animation.ts","../../utils/observeble/subject":"utils/observeble/subject.ts"}],"components/form/app-form.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <form name={{$name}} @submit={{onSubmit}}>
        <slot name="field"></slot>
        <slot name="submit"></slot>
    </form>
`;
},{}],"components/form/app-form.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/form/app-form.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppForm = void 0;

const component_1 = require("../../utils/component");

const app_form_tmpl_1 = require("./app-form.tmpl");

require("./app-form.less");

const observeble_1 = require("../../utils/observeble/observeble");

const subject_1 = require("../../utils/observeble/subject");

let AppForm = class AppForm {
  constructor() {
    this._$name = new subject_1.Subject();
  }

  get $name() {
    return this._$name.asObserveble();
  }

  onSubmit(event) {
    event.preventDefault();

    if (!this.formGroup) {
      return;
    }

    observeble_1.Observable.all([this.formGroup.$isValid, this.formGroup.$valueChanged]).only(1).filter(([isValid]) => Boolean(isValid)).on(args => {
      var _a;

      return (_a = this.formGroup) === null || _a === void 0 ? void 0 : _a.submit(args[1]);
    });
  }

  onAttributeChanged(name, _oldValue, newValue) {
    switch (name) {
      case 'name':
        if (newValue) {
          this._$name.next(newValue);
        } else {
          this._$name.next(false);
        }

        break;

      default:
        break;
    }

    return false;
  }

};
AppForm = __decorate([component_1.component({
  name: 'app-form',
  template: app_form_tmpl_1.template,
  observedAttributes: ['name']
})], AppForm);
exports.AppForm = AppForm;
},{"../../utils/component":"utils/component.ts","./app-form.tmpl":"components/form/app-form.tmpl.ts","./app-form.less":"components/form/app-form.less","../../utils/observeble/observeble":"utils/observeble/observeble.ts","../../utils/observeble/subject":"utils/observeble/subject.ts"}],"components/button/app-button.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <button button-disabled={{$disabled}}>
        <slot name="label"></slot>
    </button>
`;
},{}],"components/button/app-button.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/button/app-button.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppButton = void 0;

const component_1 = require("../../utils/component");

const app_button_tmpl_1 = require("./app-button.tmpl");

require("./app-button.less");

const subject_1 = require("../../utils/observeble/subject");

let AppButton = class AppButton {
  constructor() {
    this.disabled = new subject_1.Subject(false);
    this._disabled = false;
  }

  get $disabled() {
    return this.disabled.asObserveble();
  }

  onRendered(element) {
    element.querySelector('button').addEventListener('click', event => {
      if (this._disabled) {
        event.stopPropagation();
        element.dispatchEvent(new CustomEvent('disabledclick'));
      }
    });
  }

  onAttributeChanged(name, _, newValue) {
    switch (name) {
      case 'disabled':
        this._disabled = newValue !== null;
        this.disabled.next(newValue !== null);
        return true;

      default:
        return false;
    }
  }

};
AppButton = __decorate([component_1.component({
  name: 'app-button',
  template: app_button_tmpl_1.template,
  observedAttributes: ['disabled']
})], AppButton);
exports.AppButton = AppButton;
},{"../../utils/component":"utils/component.ts","./app-button.tmpl":"components/button/app-button.tmpl.ts","./app-button.less":"components/button/app-button.less","../../utils/observeble/subject":"utils/observeble/subject.ts"}],"pages/auth/page-auth.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/auth/enums/auth-page-type.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authPageType = void 0;
var authPageType;

(function (authPageType) {
  authPageType["registration"] = "registration";
})(authPageType = exports.authPageType || (exports.authPageType = {}));
},{}],"pages/auth/services/auth-page-manager.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthPageManager = void 0;

const auth_service_1 = require("../../../service/auth.service");

const pages_config_1 = require("../../../service/router/pages.config");

const router_service_1 = require("../../../service/router/router.service");

const auth_page_type_enum_1 = require("../enums/auth-page-type.enum");

let instance;

class AuthPageManager {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.routerService = new router_service_1.RouterService();
    this.authService = new auth_service_1.AuthService();
  }

  get $isRegistration() {
    return this.routerService.$queryParams.map(query => query.type === auth_page_type_enum_1.authPageType.registration);
  }

  navigateToAuthorization() {
    this.routerService.navigateTo(pages_config_1.pages.auth, {
      type: auth_page_type_enum_1.authPageType.registration
    });
  }

  navigateToRegistration() {
    this.routerService.navigateTo(pages_config_1.pages.auth);
  }

  authorization(authData) {
    this.authService.authorization(authData).then(() => this.navigateToChats());
  }

  registration(registrationData) {
    this.authService.registration(registrationData).then(() => this.navigateToChats());
  }

  navigateToChats() {
    this.routerService.navigateTo(pages_config_1.pages.chats);
  }

}

exports.AuthPageManager = AuthPageManager;
},{"../../../service/auth.service":"service/auth.service.ts","../../../service/router/pages.config":"service/router/pages.config.ts","../../../service/router/router.service":"service/router/router.service.ts","../enums/auth-page-type.enum":"pages/auth/enums/auth-page-type.enum.ts"}],"pages/auth/enums/form-title.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authPageFormTitle = void 0;
var authPageFormTitle;

(function (authPageFormTitle) {
  authPageFormTitle["registration"] = "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F";
  authPageFormTitle["authorization"] = "\u0412\u0445\u043E\u0434";
})(authPageFormTitle = exports.authPageFormTitle || (exports.authPageFormTitle = {}));
},{}],"pages/auth/page-auth.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageAuth = void 0;

const page_auth_tmpl_1 = require("./page-auth.tmpl");

const form_group_1 = require("../../utils/form/form-group");

const component_1 = require("../../utils/component");

const form_validators_1 = require("../../const/form-validators");

require("../../components/input/app-input");

require("../../components/form/app-form");

require("../../components/button/app-button");

require("./page-auth.less");

const auth_page_manager_1 = require("./services/auth-page-manager");

const form_title_enum_1 = require("./enums/form-title.enum");

let PageAuth = class PageAuth {
  constructor() {
    this.authForm = new form_group_1.FormGroup({
      controls: {
        login: {
          validators: form_validators_1.formValidators.login
        },
        password: {
          validators: form_validators_1.formValidators.password
        }
      }
    });
    this.registrationForm = new form_group_1.FormGroup({
      controls: {
        first_name: {
          validators: form_validators_1.formValidators.first_name
        },
        second_name: {
          validators: form_validators_1.formValidators.second_name
        },
        login: {
          validators: form_validators_1.formValidators.login
        },
        email: {
          validators: form_validators_1.formValidators.email
        },
        password: {
          validators: form_validators_1.formValidators.password
        },
        phone: {
          validators: form_validators_1.formValidators.phone
        }
      }
    });
    this.authPageManager = new auth_page_manager_1.AuthPageManager();
  }

  onInit() {
    this.authorizationSubscription = this.authForm.$submit.subscribe(formData => this.onAuthorization(formData));
    this.registrationSubscription = this.registrationForm.$submit.subscribe(formData => this.onRegistration(formData));
  }

  onDestroy() {
    if (this.authorizationSubscription) {
      this.authorizationSubscription.unsubscribe();
    }

    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }
  }

  get $title() {
    return this.$isRegistration.map(isRegistration => isRegistration ? form_title_enum_1.authPageFormTitle.registration : form_title_enum_1.authPageFormTitle.authorization);
  }

  get $isRegistration() {
    return this.authPageManager.$isRegistration;
  }

  get $isAuthorization() {
    return this.$isRegistration.map(isAuthorization => !isAuthorization);
  }

  get $isDisabledAuthorizationForm() {
    return this.authForm.$isValid.map(isValid => !isValid);
  }

  get $isDisabledRegistrationForm() {
    return this.registrationForm.$isValid.map(isValid => !isValid);
  }

  onDisabledClickFormAuthorization() {
    this.authForm.touch();
    this.authForm.shakingFirstInvalidField();
  }

  onDisabledClickFormRegistration() {
    this.registrationForm.touch();
    this.registrationForm.shakingFirstInvalidField();
  }

  navigateToAuthorization() {
    this.authPageManager.navigateToAuthorization();
  }

  navigateToRegistration() {
    this.authPageManager.navigateToRegistration();
  }

  onAuthorization(authData) {
    this.authPageManager.authorization(authData);
  }

  onRegistration(registrationData) {
    this.authPageManager.registration(registrationData);
  }

};
PageAuth = __decorate([component_1.component({
  name: 'page-auth',
  template: page_auth_tmpl_1.template
})], PageAuth);
exports.PageAuth = PageAuth;
},{"./page-auth.tmpl":"pages/auth/page-auth.tmpl.ts","../../utils/form/form-group":"utils/form/form-group.ts","../../utils/component":"utils/component.ts","../../const/form-validators":"const/form-validators.ts","../../components/input/app-input":"components/input/app-input.ts","../../components/form/app-form":"components/form/app-form.ts","../../components/button/app-button":"components/button/app-button.ts","./page-auth.less":"pages/auth/page-auth.less","./services/auth-page-manager":"pages/auth/services/auth-page-manager.ts","./enums/form-title.enum":"pages/auth/enums/form-title.enum.ts"}],"pages/profile/page-profile.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <main>
        <section id="label">
            <img alt="avatar" src={{$avatar}}>
            <h1>{{$userData.login}}</h1>
        </section>

        <section class="content-wrapper">
            <user-data class="content" hidden-with-animtion={{$hideDataList}}></user-data>
            <form-user-data class="content" hidden-with-animtion={{$hideFormUserData}}></form-user-data>
            <form-password class="content" hidden-with-animtion={{$hideFormPassword}}></form-password>
        </section>
    </main>
`;
},{}],"pages/profile/components/user-data/user-data.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
<section id="data-list">
    <dl class="field-list">
        <dt class="text-primary">Почта</dt>
        <dd class="text-secondary">{{ $userData.email }}</dd>

        <dt class="text-primary">Логин</dt>
        <dd class="text-secondary">{{ $userData.login }}</dd>

        <dt class="text-primary">Имя</dt>
        <dd class="text-secondary">{{ $userData.first_name }}</dd>

        <dt class="text-primary">Фамилия</dt>
        <dd class="text-secondary">{{ $userData.second_name }}</dd>

        <dt class="text-primary">Имя в чате</dt>
        <dd class="text-secondary">{{ $userData.display_name }}</dd>

        <dt class="text-primary">Телефон</dt>
        <dd class="text-secondary">{{ $userData.phone }}</dd>
    </dl>
</section>

<section id="footer-buttons">
    <div class="buttons">
        <ul class="field-list">
            <li>
                <app-button @click={{onChangeData()}} appearance="secondary">
                    <span slot="label">
                        Изменить данные
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onChangePassword()}} appearance="secondary">
                    <span slot="label">
                        Изменить пароль
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onExit()}} appearance="error">
                    <span slot="label">
                        Выйти
                    </span>
                </app-button>
            </li>
        </ul>
    </div>
</section>
`;
},{}],"pages/profile/components/user-data/user-data.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"utils/functions/hide-element.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showElement = exports.hideElement = void 0;

function hideElement(element) {
  element.setAttribute('hidden', '');
}

exports.hideElement = hideElement;

function showElement(element) {
  element.removeAttribute('hidden');
}

exports.showElement = showElement;
},{}],"utils/animation/configs/visibility.config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VISIBILITY_CONFIG = void 0;
exports.VISIBILITY_CONFIG = {
  duration: 70,
  scaleChange: 0.1
};
},{}],"utils/animation/animations/hide-animation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HideAnimation = void 0;

const hide_element_1 = require("../../functions/hide-element");

const transform_functions_1 = require("../animation-utils/transform.functions");

const visibility_config_1 = require("../configs/visibility.config");

class HideAnimation {
  constructor() {
    this.keyFrames = [{
      opacity: 0,
      transform: transform_functions_1.transform.scale(1 - visibility_config_1.VISIBILITY_CONFIG.scaleChange)
    }];
    this.keyframeAnimationOptions = {
      duration: visibility_config_1.VISIBILITY_CONFIG.duration
    };
    this.onFinish = [hide_element_1.hideElement];
  }

}

exports.HideAnimation = HideAnimation;
},{"../../functions/hide-element":"utils/functions/hide-element.ts","../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts","../configs/visibility.config":"utils/animation/configs/visibility.config.ts"}],"utils/animation/animations/show-animation.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShowAnimation = void 0;

const hide_element_1 = require("../../functions/hide-element");

const transform_functions_1 = require("../animation-utils/transform.functions");

const visibility_config_1 = require("../configs/visibility.config");

class ShowAnimation {
  constructor() {
    this.keyFrames = [{
      opacity: 0,
      transform: transform_functions_1.transform.scale(1 + visibility_config_1.VISIBILITY_CONFIG.scaleChange)
    }, {
      opacity: 1
    }];
    this.keyframeAnimationOptions = {
      duration: visibility_config_1.VISIBILITY_CONFIG.duration
    };
    this.onStart = [hide_element_1.showElement];
  }

}

exports.ShowAnimation = ShowAnimation;
},{"../../functions/hide-element":"utils/functions/hide-element.ts","../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts","../configs/visibility.config":"utils/animation/configs/visibility.config.ts"}],"pages/profile/elements/profile-content.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileContent = void 0;

const play_animation_1 = require("../../../utils/animation/animation-utils/play-animation");

const hide_animation_1 = require("../../../utils/animation/animations/hide-animation");

const show_animation_1 = require("../../../utils/animation/animations/show-animation");

const hide_element_1 = require("../../../utils/functions/hide-element");

const page_profile_1 = require("../page-profile");

var profileContentAttributes;

(function (profileContentAttributes) {
  profileContentAttributes["hiddenWithAnimtion"] = "hidden-with-animtion";
})(profileContentAttributes || (profileContentAttributes = {}));

class ProfileContent {
  constructor() {
    this.isInitHiddenStatus = true;
  }

  onRendered(element) {
    this.element = element;
  }

  static get observedAttributes() {
    return [profileContentAttributes.hiddenWithAnimtion];
  }

  onAttributeChanged(name, _oldValue, newValue) {
    switch (name) {
      case profileContentAttributes.hiddenWithAnimtion:
        if (_oldValue === newValue) {
          return false;
        }

        if (!this.element) {
          return false;
        }

        if (this.isInitHiddenStatus) {
          this.isInitHiddenStatus = false;

          if (newValue === page_profile_1.hiddenWithAnimtionValue.false) {
            hide_element_1.showElement(this.element);
          } else {
            hide_element_1.hideElement(this.element);
          }

          return false;
        }

        if (newValue === page_profile_1.hiddenWithAnimtionValue.false) {
          this.show(this.element);
        } else {
          this.hide(this.element);
        }

        return false;

      default:
        return false;
    }
  }

  hide(element) {
    play_animation_1.playAnimation(element, new hide_animation_1.HideAnimation());
  }

  show(element) {
    play_animation_1.playAnimation(element, new show_animation_1.ShowAnimation());
  }

}

exports.ProfileContent = ProfileContent;
},{"../../../utils/animation/animation-utils/play-animation":"utils/animation/animation-utils/play-animation.ts","../../../utils/animation/animations/hide-animation":"utils/animation/animations/hide-animation.ts","../../../utils/animation/animations/show-animation":"utils/animation/animations/show-animation.ts","../../../utils/functions/hide-element":"utils/functions/hide-element.ts","../page-profile":"pages/profile/page-profile.ts"}],"store/actions/user.actions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadErrorChangePasswordAction = exports.UploadedChangePasswordAction = exports.UploadChangePasswordAction = exports.UploadErrorChangeUserDataAction = exports.UploadedChangeUserDataAction = exports.UploadChangeUserDataAction = void 0;

const user_action_type_enum_1 = require("../enums/user-action-type.enum");

class UploadChangeUserDataAction {
  constructor() {
    this.type = user_action_type_enum_1.userActionType.changeUserDataUpload;
  }

}

exports.UploadChangeUserDataAction = UploadChangeUserDataAction;

class UploadedChangeUserDataAction {
  constructor(newUserData) {
    this.type = user_action_type_enum_1.userActionType.changeUserDataUploaded;
    this.payload = newUserData;
  }

}

exports.UploadedChangeUserDataAction = UploadedChangeUserDataAction;

class UploadErrorChangeUserDataAction {
  constructor(error) {
    this.type = user_action_type_enum_1.userActionType.changeUserDataUploadError;
    this.payload = error;
  }

}

exports.UploadErrorChangeUserDataAction = UploadErrorChangeUserDataAction;

class UploadChangePasswordAction {
  constructor() {
    this.type = user_action_type_enum_1.userActionType.changePasswordUpload;
  }

}

exports.UploadChangePasswordAction = UploadChangePasswordAction;

class UploadedChangePasswordAction {
  constructor() {
    this.type = user_action_type_enum_1.userActionType.changePasswordUploaded;
  }

}

exports.UploadedChangePasswordAction = UploadedChangePasswordAction;

class UploadErrorChangePasswordAction {
  constructor(error) {
    this.type = user_action_type_enum_1.userActionType.changePasswordUploadError;
    this.payload = error;
  }

}

exports.UploadErrorChangePasswordAction = UploadErrorChangePasswordAction;
},{"../enums/user-action-type.enum":"store/enums/user-action-type.enum.ts"}],"service/user.service.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserService = void 0;

const user_actions_1 = require("../store/actions/user.actions");

const store_1 = require("../store/store");

const http_client_facade_1 = require("./api/http-client.facade");

let instance;

class UserService {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.httpClientFacade = new http_client_facade_1.HTTPClientFacade();
    this.store = new store_1.Store();
  }

  changeUserData(data) {
    this.store.dispatch(new user_actions_1.UploadChangeUserDataAction());
    return this.httpClientFacade.user.changeData(data).then(response => this.store.dispatch(new user_actions_1.UploadedChangeUserDataAction(response.body))).catch(error => {
      this.store.dispatch(new user_actions_1.UploadErrorChangeUserDataAction(error));
      throw error;
    });
  }

  changePassword(data) {
    this.store.dispatch(new user_actions_1.UploadChangePasswordAction());
    return this.httpClientFacade.user.changePassword(data).then(() => this.store.dispatch(new user_actions_1.UploadedChangePasswordAction())).catch(error => {
      this.store.dispatch(new user_actions_1.UploadErrorChangePasswordAction(error));
      throw error;
    });
  }

}

exports.UserService = UserService;
},{"../store/actions/user.actions":"store/actions/user.actions.ts","../store/store":"store/store.ts","./api/http-client.facade":"service/api/http-client.facade.ts"}],"store/selectors/data/select-data-value.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectDataValue = void 0;

function selectDataValue(data) {
  return data.value;
}

exports.selectDataValue = selectDataValue;
},{}],"pages/profile/enums/profile-page-form-type.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.profilePageFormType = void 0;
var profilePageFormType;

(function (profilePageFormType) {
  profilePageFormType["changeData"] = "changeData";
  profilePageFormType["changePassword"] = "changePassword";
})(profilePageFormType = exports.profilePageFormType || (exports.profilePageFormType = {}));
},{}],"resources/img/default_avatar.png":[function(require,module,exports) {
module.exports = "/default_avatar.bfcd01d6.png";
},{}],"pages/profile/service/profile-page-manager.ts":[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfilePageManager = exports.profilePageContent = exports.DEFAULT_USER_AVATAR_URL = void 0;

const auth_service_1 = require("../../../service/auth.service");

const pages_config_1 = require("../../../service/router/pages.config");

const router_service_1 = require("../../../service/router/router.service");

const user_service_1 = require("../../../service/user.service");

const select_user_data_1 = require("../../../store/selectors/authorization/select-user-data");

const select_data_value_1 = require("../../../store/selectors/data/select-data-value");

const store_1 = require("../../../store/store");

const profile_page_form_type_enum_1 = require("../enums/profile-page-form-type.enum"); // @ts-ignore


const default_avatar_png_1 = __importDefault(require("../../../resources/img/default_avatar.png"));

exports.DEFAULT_USER_AVATAR_URL = default_avatar_png_1.default;
var profilePageContent;

(function (profilePageContent) {
  profilePageContent[profilePageContent["userData"] = 0] = "userData";
  profilePageContent[profilePageContent["formUserData"] = 1] = "formUserData";
  profilePageContent[profilePageContent["formPassword"] = 2] = "formPassword";
})(profilePageContent = exports.profilePageContent || (exports.profilePageContent = {}));

let instance;

class ProfilePageManager {
  constructor() {
    if (instance) {
      return instance;
    }

    instance = this;
    this.authService = new auth_service_1.AuthService();
    this.userService = new user_service_1.UserService();
    this.routerService = new router_service_1.RouterService();
    this.store = new store_1.Store();
  }

  get $userData() {
    return this.store.$state.select(select_user_data_1.selectUserData).select(select_data_value_1.selectDataValue).filter(userData => Boolean(userData));
  }

  get $profilePageContent() {
    return this.routerService.$queryParams.map(query => {
      switch (query.form) {
        case profile_page_form_type_enum_1.profilePageFormType.changeData:
          return profilePageContent.formUserData;

        case profile_page_form_type_enum_1.profilePageFormType.changePassword:
          return profilePageContent.formPassword;

        default:
          return profilePageContent.userData;
      }
    }).uniqueNext();
  }

  uploadUserData() {
    this.authService.uploadUserDataIfNot();
  }

  changeData(changeUserData) {
    this.userService.changeUserData(changeUserData);
  }

  changePassword(passwordsData) {
    this.userService.changePassword(passwordsData);
  }

  goToUserData() {
    this.routerService.navigateTo(pages_config_1.pages.profile);
  }

  goToFormData() {
    this.routerService.navigateTo(pages_config_1.pages.profile, {
      form: profile_page_form_type_enum_1.profilePageFormType.changeData
    });
  }

  goToFormPassword() {
    this.routerService.navigateTo(pages_config_1.pages.profile, {
      form: profile_page_form_type_enum_1.profilePageFormType.changePassword
    });
  }

  goToChats() {
    this.routerService.navigateTo(pages_config_1.pages.chats);
  }

}

exports.ProfilePageManager = ProfilePageManager;
},{"../../../service/auth.service":"service/auth.service.ts","../../../service/router/pages.config":"service/router/pages.config.ts","../../../service/router/router.service":"service/router/router.service.ts","../../../service/user.service":"service/user.service.ts","../../../store/selectors/authorization/select-user-data":"store/selectors/authorization/select-user-data.ts","../../../store/selectors/data/select-data-value":"store/selectors/data/select-data-value.ts","../../../store/store":"store/store.ts","../enums/profile-page-form-type.enum":"pages/profile/enums/profile-page-form-type.enum.ts","../../../resources/img/default_avatar.png":"resources/img/default_avatar.png"}],"pages/profile/components/user-data/user-data.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserData = void 0;

const component_1 = require("../../../../utils/component");

const user_data_tmpl_1 = require("./user-data.tmpl");

require("./user-data.less");

const profile_content_1 = require("../../elements/profile-content");

const profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore


let UserData = class UserData extends profile_content_1.ProfileContent {
  constructor() {
    super();
    this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
  }

  static get observedAttributes() {
    return super.observedAttributes;
  }

  onInit() {}

  get $userData() {
    return this.profilePageManager.$userData;
  }

  onChangeData() {
    this.profilePageManager.goToFormData();
  }

  onChangePassword() {
    this.profilePageManager.goToFormPassword();
  }

  onExit() {
    this.profilePageManager.goToChats();
  }

};
UserData = __decorate([component_1.component({
  name: 'user-data',
  template: user_data_tmpl_1.template
})], UserData);
exports.UserData = UserData;
},{"../../../../utils/component":"utils/component.ts","./user-data.tmpl":"pages/profile/components/user-data/user-data.tmpl.ts","./user-data.less":"pages/profile/components/user-data/user-data.less","../../elements/profile-content":"pages/profile/elements/profile-content.ts","../../service/profile-page-manager":"pages/profile/service/profile-page-manager.ts"}],"pages/profile/components/form-user-data/form-user-data.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
<section>
    <app-form name="user_data">
        <app-input slot="field" formControl=[[form.controls.email]]>
            <span slot="label">Почта</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.login]]>
            <span slot="label">Логин</span>    
        </app-input>
        <app-input slot="field" formControl=[[form.controls.first_name]]>
            <span slot="label">Имя</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.second_name]]>
            <span slot="label">Фамилия</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.display_name]]>
            <span slot="label">Имя в чате</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.phone]]>
            <span slot="label">Телефон</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <div class="buttons">
        <ul class="field-list">
            <li>
                <app-button @click={{onChangeData()}} @disabledclick={{onDisabledClick()}} disabled={{$isInvalidForm}} onDisabledClick appearance="primary">
                    <span slot="label">
                        Сохранить
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onBack()}} appearance="error">
                    <span slot="label">
                        Назад
                    </span>
                </app-button>
            </li>
        </ul>
    </div>
</section>
`;
},{}],"pages/profile/components/form-user-data/form-user-data.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/profile/components/form-user-data/form-user-data.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormUserData = void 0;

const component_1 = require("../../../../utils/component");

const form_user_data_tmpl_1 = require("./form-user-data.tmpl");

require("../../../../components/form/app-form");

require("../../../../components/input/app-input");

require("../../../../components/button/app-button");

require("./form-user-data.less");

const form_group_1 = require("../../../../utils/form/form-group");

const form_validators_1 = require("../../../../const/form-validators");

const profile_content_1 = require("../../elements/profile-content");

const profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore


let FormUserData = class FormUserData extends profile_content_1.ProfileContent {
  constructor() {
    super();
    this.form = new form_group_1.FormGroup({
      controls: {
        email: {
          validators: form_validators_1.formValidators.email
        },
        login: {
          validators: form_validators_1.formValidators.login
        },
        first_name: {
          validators: form_validators_1.formValidators.first_name
        },
        second_name: {
          validators: form_validators_1.formValidators.second_name
        },
        display_name: {
          validators: form_validators_1.formValidators.display_name
        },
        phone: {
          validators: form_validators_1.formValidators.phone
        }
      }
    });
    this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
  }

  onInit() {
    this.userDataSubscription = this.profilePageManager.$userData.subscribe(userData => this.form.next(userData));
  }

  onDestroy() {
    this.userDataSubscription.unsubscribe();
  }

  get $isInvalidForm() {
    return this.form.$isValid.map(isValid => !isValid);
  }

  static get observedAttributes() {
    return super.observedAttributes;
  }

  onBack() {
    this.profilePageManager.goToUserData();
  }

  onChangeData() {
    this.profilePageManager.changeData(this.form.value);
  }

  onDisabledClick() {
    this.form.touch();
    this.form.shakingFirstInvalidField();
  }

};
FormUserData = __decorate([component_1.component({
  name: 'form-user-data',
  template: form_user_data_tmpl_1.template
})], FormUserData);
exports.FormUserData = FormUserData;
},{"../../../../utils/component":"utils/component.ts","./form-user-data.tmpl":"pages/profile/components/form-user-data/form-user-data.tmpl.ts","../../../../components/form/app-form":"components/form/app-form.ts","../../../../components/input/app-input":"components/input/app-input.ts","../../../../components/button/app-button":"components/button/app-button.ts","./form-user-data.less":"pages/profile/components/form-user-data/form-user-data.less","../../../../utils/form/form-group":"utils/form/form-group.ts","../../../../const/form-validators":"const/form-validators.ts","../../elements/profile-content":"pages/profile/elements/profile-content.ts","../../service/profile-page-manager":"pages/profile/service/profile-page-manager.ts"}],"pages/profile/components/form-password/form-password.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
<section>
    <app-form name="password">
        <app-input slot="field" formControl=[[form.controls.oldPassword]]>
            <span slot="label">Старый пароль</span>
        </app-input>
        <app-input slot="field" formControl=[[form.controls.newPassword]]>
            <span slot="label">Новый пароль</span>    
        </app-input>
        <app-input slot="field" formControl=[[form.controls.repeatPassword]]>
            <span slot="label">Повторите пароль</span>
        </app-input>
    </app-form>
</section>

<section id="footer-buttons">
    <div class="buttons">
        <ul class="field-list">
            <li>
                <app-button @click={{onChangePassword()}} @disabledclick={{onDisabledClick()}} disabled={{$isInvalidForm}} appearance="primary">
                    <span slot="label">
                        Сохранить
                    </span>
                </app-button>
            </li>
            <li>
                <app-button @click={{onBack()}} appearance="error">
                    <span slot="label">
                        Назад
                    </span>
                </app-button>
            </li>
        </ul>
    </div>
</section>
`;
},{}],"pages/profile/components/form-password/form-password.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/profile/components/form-password/form-password.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormPassword = void 0;

const form_group_1 = require("../../../../utils/form/form-group");

const component_1 = require("../../../../utils/component");

const form_validators_1 = require("../../../../const/form-validators");

const form_password_tmpl_1 = require("./form-password.tmpl");

require("./form-password.less");

const profile_content_1 = require("../../elements/profile-content");

const validator_error_1 = require("../../../../utils/form/validator-error");

const profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore никак не могу написать типы для component (


let FormPassword = class FormPassword extends profile_content_1.ProfileContent {
  constructor() {
    super();
    this.form = new form_group_1.FormGroup({
      controls: {
        oldPassword: {
          validators: form_validators_1.formValidators.password
        },
        newPassword: {
          validators: form_validators_1.formValidators.password
        },
        repeatPassword: {
          validators: form_validators_1.formValidators.password
        }
      },
      fieldValidators: [{
        targets: ['repeatPassword'],
        validators: [({
          newPassword,
          repeatPassword
        }) => newPassword === repeatPassword ? null : new validator_error_1.ValidatorError('Пароли не совпадают')]
      }, {
        targets: ['repeatPassword'],
        validators: [({
          oldPassword,
          repeatPassword
        }) => oldPassword === repeatPassword ? new validator_error_1.ValidatorError('Новый пароль не отличается от старого') : null]
      }, {
        targets: ['newPassword'],
        validators: [({
          oldPassword,
          newPassword
        }) => oldPassword === newPassword ? new validator_error_1.ValidatorError('Новый пароль не отличается от старого') : null]
      }]
    });
    this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
  }

  static get observedAttributes() {
    return super.observedAttributes;
  }

  get $isInvalidForm() {
    return this.form.$isValid.map(isValid => !isValid);
  }

  onBack() {
    this.profilePageManager.goToUserData();
  }

  onChangePassword() {
    this.profilePageManager.changePassword(this.getChangePasswordData());
  }

  onDisabledClick() {
    this.form.touch();
    this.form.shakingFirstInvalidField();
  }

  getChangePasswordData() {
    const {
      newPassword,
      oldPassword
    } = this.form.value;
    return {
      newPassword,
      oldPassword
    };
  }

};
FormPassword = __decorate([component_1.component({
  name: 'form-password',
  template: form_password_tmpl_1.template
})], FormPassword);
exports.FormPassword = FormPassword;
},{"../../../../utils/form/form-group":"utils/form/form-group.ts","../../../../utils/component":"utils/component.ts","../../../../const/form-validators":"const/form-validators.ts","./form-password.tmpl":"pages/profile/components/form-password/form-password.tmpl.ts","./form-password.less":"pages/profile/components/form-password/form-password.less","../../elements/profile-content":"pages/profile/elements/profile-content.ts","../../../../utils/form/validator-error":"utils/form/validator-error.ts","../../service/profile-page-manager":"pages/profile/service/profile-page-manager.ts"}],"pages/profile/page-profile.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/profile/page-profile.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageProfile = exports.hiddenWithAnimtionValue = void 0;

const component_1 = require("../../utils/component");

const page_profile_tmpl_1 = require("./page-profile.tmpl");

require("../../components/button/app-button");

require("./components/user-data/user-data");

require("./components/form-user-data/form-user-data");

require("./components/form-password/form-password");

require("./page-profile.less");

const profile_page_manager_1 = require("./service/profile-page-manager");

const auth_guard_1 = require("../../guards/auth-guard");

var hiddenWithAnimtionValue;

(function (hiddenWithAnimtionValue) {
  hiddenWithAnimtionValue["true"] = "true";
  hiddenWithAnimtionValue["false"] = "false";
})(hiddenWithAnimtionValue = exports.hiddenWithAnimtionValue || (exports.hiddenWithAnimtionValue = {}));

let PageProfile = class PageProfile {
  constructor() {
    this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
  }

  onInit() {
    this.profilePageManager.uploadUserData();
  }

  get $userData() {
    return this.profilePageManager.$userData;
  }

  get $avatar() {
    return this.$userData.map(userData => userData.avatarUrl || profile_page_manager_1.DEFAULT_USER_AVATAR_URL);
  } // Костыльно, но мы ограничены возможностями шаблонзатора


  get $hideDataList() {
    return this.$getIsHideContent(profile_page_manager_1.profilePageContent.userData);
  }

  get $hideFormPassword() {
    return this.$getIsHideContent(profile_page_manager_1.profilePageContent.formPassword);
  }

  get $hideFormUserData() {
    return this.$getIsHideContent(profile_page_manager_1.profilePageContent.formUserData);
  }

  $getIsHideContent(content) {
    return this.profilePageManager.$profilePageContent.map(pageContent => pageContent === content ? hiddenWithAnimtionValue.false : hiddenWithAnimtionValue.true);
  }

};
PageProfile = __decorate([component_1.component({
  name: 'page-profile',
  template: page_profile_tmpl_1.template,
  guards: [auth_guard_1.AuthGuard]
})], PageProfile);
exports.PageProfile = PageProfile;
},{"../../utils/component":"utils/component.ts","./page-profile.tmpl":"pages/profile/page-profile.tmpl.ts","../../components/button/app-button":"components/button/app-button.ts","./components/user-data/user-data":"pages/profile/components/user-data/user-data.ts","./components/form-user-data/form-user-data":"pages/profile/components/form-user-data/form-user-data.ts","./components/form-password/form-password":"pages/profile/components/form-password/form-password.ts","./page-profile.less":"pages/profile/page-profile.less","./service/profile-page-manager":"pages/profile/service/profile-page-manager.ts","../../guards/auth-guard":"guards/auth-guard.ts"}],"pages/default/consts/default-description.const.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultDescription = void 0;
exports.defaultDescription = 'Кажется, что-то пошло не так :(';
},{}],"pages/default/page-default.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = `
    <main>
        <h1 id="title">{{ code }}</h1>
        <p id="description">{{ description }}</p>
        <app-button id="back" appearance="secondary" @click={{navigateToChats()}}>
            <span slot="label">Назад к чатам</span>
        </app-button>
    </main>
`;
},{}],"pages/default/page-default.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/default/page-default.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageDefault = void 0;

const component_1 = require("../../utils/component");

const router_service_1 = require("../../service/router/router.service");

const default_description_const_1 = require("./consts/default-description.const");

require("../../components/input/app-input");

require("../../components/button/app-button");

const pages_config_1 = require("../../service/router/pages.config");

const page_default_tmpl_1 = require("./page-default.tmpl");

require("./page-default.less");

let PageDefault = class PageDefault {
  constructor() {
    this.routerService = new router_service_1.RouterService();
  }

  onInit() {
    this.code = Number(this.routerService.urlParams.queryParams.code) || 404;
  }

  get description() {
    return this.getDescriptionByCode(this.code) || this.getDescriptionByCode(this.floorToHundreds(this.code)) || default_description_const_1.defaultDescription;
  }

  navigateToChats() {
    this.routerService.navigateTo(pages_config_1.pages.chats);
  }

  getDescriptionByCode(code) {
    switch (code) {
      case 404:
        return 'Не туда попали';

      case 500:
        return 'Мы уже фиксим';

      default:
        return undefined;
    }
  }

  floorToHundreds(number) {
    return Math.floor(number / 100) * 100;
  }

};
PageDefault = __decorate([component_1.component({
  name: 'page-default',
  template: page_default_tmpl_1.template
})], PageDefault);
exports.PageDefault = PageDefault;
},{"../../utils/component":"utils/component.ts","../../service/router/router.service":"service/router/router.service.ts","./consts/default-description.const":"pages/default/consts/default-description.const.ts","../../components/input/app-input":"components/input/app-input.ts","../../components/button/app-button":"components/button/app-button.ts","../../service/router/pages.config":"service/router/pages.config.ts","./page-default.tmpl":"pages/default/page-default.tmpl.ts","./page-default.less":"pages/default/page-default.less"}],"service/router/router.config.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerConfig = void 0;

const page_main_1 = require("../../pages/main/page-main");

const page_auth_1 = require("../../pages/auth/page-auth");

const page_profile_1 = require("../../pages/profile/page-profile");

const page_default_1 = require("../../pages/default/page-default");

const pages_config_1 = require("./pages.config");

exports.routerConfig = {
  [pages_config_1.pages.main]: page_main_1.PageMain,
  [pages_config_1.pages.auth]: page_auth_1.PageAuth,
  [pages_config_1.pages.profile]: page_profile_1.PageProfile,
  [pages_config_1.pages.default]: page_default_1.PageDefault
};
},{"../../pages/main/page-main":"pages/main/page-main.ts","../../pages/auth/page-auth":"pages/auth/page-auth.ts","../../pages/profile/page-profile":"pages/profile/page-profile.ts","../../pages/default/page-default":"pages/default/page-default.ts","./pages.config":"service/router/pages.config.ts"}],"service/router/router.service.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterService = void 0;

const router_config_1 = require("./router.config");

const pages_config_1 = require("./pages.config");

const subject_1 = require("../../utils/observeble/subject");

const observeble_1 = require("../../utils/observeble/observeble");

let instance;

class RouterService {
  constructor() {
    this._popstate = new subject_1.Subject();

    if (instance) {
      return instance;
    }

    instance = this;
    observeble_1.Observable.event(window, 'popstate').subscribe(() => this.onPopState());
  }

  get config() {
    return router_config_1.routerConfig;
  }

  get $popstate() {
    return this._popstate.asObserveble();
  }

  get $path() {
    return this.$popstate.map(urlParams => urlParams.pathname).startWith(this.urlParams.pathname).uniqueNext();
  }

  get $queryParams() {
    return this.$popstate.map(urlParams => urlParams.queryParams).uniqueNext(false, this.hasQueryParamsDiff).startWith(this.urlParams.queryParams);
  }

  get urlParams() {
    let {
      hash,
      pathname,
      search
    } = window.location;
    const queryParams = (search.match(/[^?&]*/g) || []).filter(value => value).reduce((out, str) => {
      const param = str.split('=');

      if (param[1]) {
        // @ts-ignore
        out[param[0]] = param[1];
      }

      return out;
    }, {});
    hash = hash.replace('#', '');
    return {
      hash,
      pathname,
      queryParams
    };
  } // TODO нужно переходить на url не перезагружая страницу history.pushState


  navigateTo(path = pages_config_1.pages.main, query = {}, hash = '') {
    let queryStr = '';

    if (path[0] !== '/') {
      path = `/${path}`;
    }

    if (Object.keys(query).length !== 0) {
      queryStr = '?' + Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    }

    if (hash && hash[0] !== '#') {
      hash = `#${hash}`;
    }

    history.pushState({}, 'page', `${window.location.origin}${path}${queryStr}${hash}`);
    this.emitUrl(path, query, hash);
  }

  getPageByPath(path = pages_config_1.pages.main) {
    path = path.split('?')[0];

    if (path[path.length - 1] === '/' && path.length > 1) {
      path = path.slice(0, -1);
    }

    if (path[0] !== '/') {
      path = `/${path}`;
    }

    return this.config[path] || this.config[pages_config_1.pages.default];
  }

  getPage() {
    return this.getPageByPath(this.urlParams.pathname);
  }

  onPopState() {
    this._popstate.next(this.urlParams);
  }

  emitUrl(pathname = pages_config_1.pages.main, queryParams = {}, hash = '') {
    if (pathname[0] !== '/') {
      pathname = `/${pathname}`;
    }

    hash = hash.replace('#', '');

    this._popstate.next({
      pathname,
      queryParams,
      hash
    });
  }

  hasQueryParamsDiff(last, next) {
    if (!last) {
      return true;
    }

    if (Object.keys(last).length !== Object.keys(next).length) {
      return true;
    }

    for (const key in last) {
      if (last[key] !== next[key]) {
        return true;
      }
    }

    return false;
  }

}

exports.RouterService = RouterService;
},{"./router.config":"service/router/router.config.ts","./pages.config":"service/router/pages.config.ts","../../utils/observeble/subject":"utils/observeble/subject.ts","../../utils/observeble/observeble":"utils/observeble/observeble.ts"}],"app-root.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app-root.ts":[function(require,module,exports) {
"use strict";

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppRoot = void 0; // For async/await

require("regenerator-runtime/runtime");

const component_1 = require("./utils/component");

const app_root_tmpl_1 = require("./app-root.tmpl");

const router_service_1 = require("./service/router/router.service");

require("./app-root.less");

let AppRoot = class AppRoot {
  constructor() {
    this.router = new router_service_1.RouterService();
  }

  onInit() {}

  get content() {
    return this.router.$path.map(pathname => this.router.getPageByPath(pathname)) // TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
    .map(constructor => [new constructor()]);
  }

};
AppRoot = __decorate([component_1.component({
  name: 'app-root',
  template: app_root_tmpl_1.template
})], AppRoot);
exports.AppRoot = AppRoot;
},{"regenerator-runtime/runtime":"../node_modules/regenerator-runtime/runtime.js","./utils/component":"utils/component.ts","./app-root.tmpl":"app-root.tmpl.ts","./service/router/router.service":"service/router/router.service.ts","./app-root.less":"app-root.less"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37941" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app-root.ts"], null)
//# sourceMappingURL=/app-root.8d0640f3.js.map