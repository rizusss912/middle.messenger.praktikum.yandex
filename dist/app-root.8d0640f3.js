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
})({"utils/observeble/subject.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subject = void 0;

var observeble_1 = require("./observeble");

function deferPromise() {
  var resolvingFunctions;
  var promise = new Promise(function (resolve, reject) {
    resolvingFunctions = {
      resolve: resolve,
      reject: reject
    };
  }); // @ts-ignore

  return Object.assign({
    promise: promise
  }, resolvingFunctions);
}

var Subject = /*#__PURE__*/function () {
  function Subject(value) {
    _classCallCheck(this, Subject);

    this.hasValue = arguments.length > 0;

    if (this.hasValue) {
      this._value = value;
    }

    this.deferPromise = deferPromise();
  }

  _createClass(Subject, [{
    key: "next",
    value: function next(value) {
      var nextdeferPromise = deferPromise();
      this._value = value;
      this.hasValue = true;
      this.deferPromise.resolve({
        value: this._value,
        next: nextdeferPromise.promise
      });
      this.deferPromise = nextdeferPromise;
    }
  }, {
    key: "asObserveble",
    value: function asObserveble() {
      if (this.hasValue) {
        return new observeble_1.Observable(this.deferPromise.promise, this._value);
      }

      return new observeble_1.Observable(this.deferPromise.promise);
    }
  }]);

  return Subject;
}();

exports.Subject = Subject;
},{"./observeble":"utils/observeble/observeble.ts"}],"utils/observeble/subscription.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Subscription = void 0;

var Subscription = /*#__PURE__*/function () {
  function Subscription(onUnsubscribe) {
    _classCallCheck(this, Subscription);

    this.onUnsubscribe = onUnsubscribe;
  }

  _createClass(Subscription, [{
    key: "unsubscribe",
    value: function unsubscribe() {
      this.onUnsubscribe(this);
    }
  }]);

  return Subscription;
}();

exports.Subscription = Subscription;
},{}],"utils/observeble/observeble.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observable = void 0;

var subject_1 = require("./subject");

var subscription_1 = require("./subscription");

var Observable = /*#__PURE__*/function () {
  function Observable(chainPromise, value) {
    var _this = this;

    _classCallCheck(this, Observable);

    this.subscriptionMap = new Map();
    this.hasValue = false;

    if (arguments.length > 1) {
      this._value = value;
      this.hasValue = true;
    }

    this.promise = chainPromise;
    chainPromise.then(function (value) {
      return _this.onNext(value);
    });
  }

  _createClass(Observable, [{
    key: "subscribe",
    value: function subscribe(handler) {
      var subscription = new subscription_1.Subscription(this.getUnsubscribeFunction(this.subscriptionMap));
      this.subscriptionMap.set(subscription, handler); // Т.к. следующее значение может быть и undefined, используем hasValue

      if (this.hasValue) {
        handler(this._value);
      }

      return subscription;
    }
  }, {
    key: "map",
    value: function map(handler) {
      function mapPromise(promise) {
        return promise.then(function (chain) {
          return {
            value: handler(chain.value),
            next: mapPromise(chain.next)
          };
        });
      }

      if (this.hasValue) {
        return new Observable(mapPromise(this.promise), handler(this._value));
      }

      return new Observable(mapPromise(this.promise));
    }
  }, {
    key: "filter",
    value: function filter(handler) {
      function filterPromise(promise) {
        return promise.then(function (chain) {
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
  }, {
    key: "on",
    value: function on(handler) {
      function onPromise(promise) {
        return promise.then(function (chain) {
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
  }, {
    key: "startWith",
    value: function startWith(value) {
      return new Observable(this.promise, value);
    }
  }, {
    key: "uniqueNext",
    value: function uniqueNext() {
      var _this2 = this;

      var approveFirst = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var checkUnicue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (last, next) {
        return last !== next || !_this2.hasValue && approveFirst;
      };
      var last = this._value;
      var firstAppruved = false;
      return this.filter(function (value) {
        return !firstAppruved || checkUnicue(last, value);
      }).on(function () {
        firstAppruved = true;
      }).on(function (value) {
        last = value;
      });
    }
  }, {
    key: "only",
    value: function only(count) {
      var emptyPromise = new Promise(function () {});

      if (this.hasValue) {
        return new Observable(count ? this.promise : emptyPromise, this._value).filter(function () {
          return count-- > 0;
        });
      }

      return new Observable(count ? this.promise : emptyPromise).filter(function () {
        return count-- > 0;
      });
    }
  }, {
    key: "select",
    value: function select(selector) {
      return this.map(selector).uniqueNext();
    }
  }, {
    key: "onNext",
    value: function onNext(value) {
      var _this3 = this;

      if (!value) {
        this.onFinish();
        return;
      }

      this._value = value.value;
      this.hasValue = true;
      this.emitValue(value.value);
      this.promise = value.next;
      value.next.then(function (value) {
        return _this3.onNext(value);
      });
    }
  }, {
    key: "emitValue",
    value: function emitValue(value) {
      var _iterator = _createForOfIteratorHelper(this.subscriptionMap.values()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var handler = _step.value;
          handler(value);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "onFinish",
    value: function onFinish() {
      this.subscriptionMap.clear();
    }
  }, {
    key: "getUnsubscribeFunction",
    value: function getUnsubscribeFunction(map) {
      return function (subscription) {
        if (map.has(subscription)) {
          map.delete(subscription);
        }
      };
    }
  }], [{
    key: "all",
    value: function all(observebles) {
      return Observable.combine(observebles, true);
    }
  }, {
    key: "concat",
    value: function concat(observebles) {
      return Observable.combine(observebles, false);
    }
  }, {
    key: "event",
    value: function event(element, eventName) {
      var emitter = new subject_1.Subject();
      element.addEventListener(eventName, function (e) {
        return emitter.next(e);
      });
      return emitter.asObserveble();
    }
  }, {
    key: "combine",
    value: function combine(observebles, waitAll) {
      var subject = new subject_1.Subject();
      var values = Array(observebles.length).fill(undefined);
      var hasValues = Array(observebles.length).fill(false);
      var hasAllValues = false;

      var subscribeobserveble = function subscribeobserveble(observeble, index) {
        observeble.subscribe(function (value) {
          values[index] = value;

          if (hasAllValues || !waitAll) {
            subject.next(values.slice());
          } else {
            hasValues[index] = true;
            hasAllValues = hasValues.every(function (has) {
              return has;
            });

            if (hasAllValues) {
              subject.next(values.slice());
            }
          }
        });
      };

      for (var index = 0; index < observebles.length; index++) {
        subscribeobserveble(observebles[index], index);
      }

      return subject.asObserveble();
    }
  }]);

  return Observable;
}();

exports.Observable = Observable;
},{"./subject":"utils/observeble/subject.ts","./subscription":"utils/observeble/subscription.ts"}],"utils/templator/renderer.ts":[function(require,module,exports) {
"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = void 0;

var observeble_1 = require("../observeble/observeble");

var subject_1 = require("../observeble/subject");

var Renderer = /*#__PURE__*/function () {
  function Renderer(context) {
    _classCallCheck(this, Renderer);

    this.$staticValues = new subject_1.Subject();
    this.context = context;
  }

  _createClass(Renderer, [{
    key: "getFieldValue",
    value: function getFieldValue(fieldName) {
      var out = this.context;

      var _iterator = _createForOfIteratorHelper(fieldName.split('.')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var field = _step.value;

          if (field in out) {
            out = out[field];
          } else {
            // Только так мы можем понять что поле отсутствует
            // Любой корректный выход из этой функции считается найденным значением
            throw new Error("field ".concat(fieldName, " not found"));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return out;
    }
  }, {
    key: "initObserveblesSubscription",
    value: function initObserveblesSubscription(observebles, onValuesChanged) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      this.subscription = this.getObservable(observebles).subscribe(onValuesChanged);
      return this.subscription;
    } // TODO: Изменить реализацию метода, когда появится метод merge у Observeble

  }, {
    key: "getObservable",
    value: function getObservable(observebles) {
      // Тут проблема с типами из-за костыльной реализации метода
      // метод merge должен решить эту проблему
      return observeble_1.Observable.all([this.$staticValues.asObserveble()].concat(_toConsumableArray(observebles))).map(function (data) {
        return data.length > 1 ? data[0].concat(data.slice(1, data.length)) : data[0];
      });
    }
  }, {
    key: "mapTemplateToField",
    value: function mapTemplateToField(template) {
      return template.replace(/[\s{}()[\]]+/gim, '');
    }
  }]);

  return Renderer;
}();

exports.Renderer = Renderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts"}],"utils/templator/html-element-renderer.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLElementRenderer = void 0;

var observeble_1 = require("../observeble/observeble");

var renderer_1 = require("./renderer");
/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */
// TODO: не может читать значение атрибута с пробелом


var TEG_ATTRIBUTES = /([(<|</)\w\-@]+(?:=)?(?:"|'|\{\{|\}\}|\]\]|\[\[)?[\w\-|(|)|.|$]+(?:"|'|\{\{|\}\}|\]\]|\[\[])?)/gim;

var HTMLElementRenderer = /*#__PURE__*/function (_renderer_1$Renderer) {
  _inherits(HTMLElementRenderer, _renderer_1$Renderer);

  var _super = _createSuper(HTMLElementRenderer);

  function HTMLElementRenderer(tagStr, context) {
    var _this;

    _classCallCheck(this, HTMLElementRenderer);

    _this = _super.call(this, context);
    _this.customAttributes = new Map();
    _this.eventListenersMap = new Map();
    var tagArr = tagStr.match(TEG_ATTRIBUTES);
    var tagName = tagArr[0].replace(/</g, '');
    var tagAttributeStrs = tagArr.splice(1);
    _this.element = document.createElement(tagName);

    var _iterator = _createForOfIteratorHelper(tagAttributeStrs),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var attributeStr = _step.value;

        var attribute = _this.mapStrToAttribute(attributeStr);

        if (_this.isCustomAttribute(attribute)) {
          _this.customAttributes.set(attribute.name, attribute.value); // @ts-ignore

        } else if (_this.isInjectableAttribute(attribute) && _this.element.inject) {
          _this.injectAttribute(attribute);
        } else {
          _this.element.setAttribute(attribute.name, _this.mapAttributeValueToValue(attribute.value));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return _this;
  }

  _createClass(HTMLElementRenderer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var observebles = [];
      var staticValues = [];

      var _iterator2 = _createForOfIteratorHelper(this.customAttributes.entries()),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var customAttributeEntries = _step2.value;

          try {
            var value = this.getFieldValue(this.mapTemplateToField(customAttributeEntries[1]));
            var customAttribute = {
              name: customAttributeEntries[0],
              valueTemplate: customAttributeEntries[1]
            };

            if (value instanceof observeble_1.Observable) {
              this.addObservable(observebles, value, customAttribute.name, customAttribute.valueTemplate);
            } else {
              staticValues.push(Object.assign(Object.assign({}, customAttribute), {
                value: value
              }));
            }
          } catch (e) {
            console.error("Error when rendering attribute in ".concat(this.element.tagName, " HTMLElement: ").concat(e));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (!this.subscription) {
        this.initObserveblesSubscription(observebles, function (values) {
          return _this2.onValuesChanged(values);
        });
      }

      this.$staticValues.next(staticValues);
    }
  }, {
    key: "onValuesChanged",
    value: function onValuesChanged(values) {
      var _iterator3 = _createForOfIteratorHelper(values),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var value = _step3.value;
          this.onValueChanged(value);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "onValueChanged",
    value: function onValueChanged(attribute) {
      var _this3 = this;

      if (attribute.name[0] === '@') {
        if (typeof attribute.value !== 'function') {
          throw new Error("HTMLElementRenderer: ".concat(attribute.name, " is not a function"));
        }

        if (this.eventListenersMap.has(attribute.name) && this.eventListenersMap.get(attribute.name).includes(attribute.value)) {
          return;
        }

        if (this.eventListenersMap.has(attribute.name)) {
          this.eventListenersMap.get(attribute.name).push(attribute.value);
        } else {
          this.eventListenersMap.set(attribute.name, [attribute.value]);
        }

        var name = attribute.name.slice(1);
        this.element.addEventListener(name, function (e) {
          return attribute.value.call(_this3.context, e);
        });
        return;
      }

      switch (_typeof(attribute.value)) {
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
  }, {
    key: "injectAttribute",
    value: function injectAttribute(attribute) {
      try {
        var value = this.getFieldValue(this.mapTemplateToField(attribute.value)); // @ts-ignore

        this.element.inject(attribute.name, value);
      } catch (e) {
        console.error("Error when inject in ".concat(this.element.tagName, " HTMLElement: ").concat(e));
      }
    }
  }, {
    key: "addObservable",
    value: function addObservable(observebles, observeble, name, valueTemplate) {
      observebles.push(observeble.map(function (value) {
        return {
          name: name,
          value: value,
          valueTemplate: valueTemplate
        };
      }));
    }
  }, {
    key: "mapStrToAttribute",
    value: function mapStrToAttribute(str) {
      var strArr = str.split('=');
      return strArr.length > 1 ? {
        name: strArr[0],
        value: strArr[1]
      } : {
        name: strArr[0]
      };
    }
  }, {
    key: "mapAttributeValueToValue",
    value: function mapAttributeValueToValue(template) {
      if (!template) {
        return;
      }

      return String(template).replace(/['"]+/g, '');
    }
  }, {
    key: "isCustomAttribute",
    value: function isCustomAttribute(attribute) {
      if (!attribute.value) {
        return false;
      }

      return /[{]{2}(.+)[}]{2}/.test(String(attribute.value));
    }
  }, {
    key: "isInjectableAttribute",
    value: function isInjectableAttribute(attribute) {
      if (!attribute.value) {
        return false;
      }

      return /[[]{2}(.+)[\]]{2}/.test(String(attribute.value));
    }
  }]);

  return HTMLElementRenderer;
}(renderer_1.Renderer);

exports.HTMLElementRenderer = HTMLElementRenderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./renderer":"utils/templator/renderer.ts"}],"utils/templator/html-elements-render-manager.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTMLElementsRenderManager = void 0;

var html_element_renderer_1 = require("./html-element-renderer");

var HTMLElementsRenderManager = /*#__PURE__*/function () {
  function HTMLElementsRenderManager(context) {
    _classCallCheck(this, HTMLElementsRenderManager);

    this.renderers = [];
    this.context = context;
  }

  _createClass(HTMLElementsRenderManager, [{
    key: "initNode",
    value: function initNode(tagStr) {
      var elementRenderer = new html_element_renderer_1.HTMLElementRenderer(tagStr, this.context);
      this.renderers.push(elementRenderer);
      return elementRenderer.element;
    }
  }, {
    key: "renderAll",
    value: function renderAll() {
      var _iterator = _createForOfIteratorHelper(this.renderers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var elementRenderer = _step.value;
          elementRenderer.render();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return HTMLElementsRenderManager;
}();

exports.HTMLElementsRenderManager = HTMLElementsRenderManager;
},{"./html-element-renderer":"utils/templator/html-element-renderer.ts"}],"utils/templator/text-node-renderer.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextNodeRenderer = void 0;

var observeble_1 = require("../observeble/observeble");

var renderer_1 = require("./renderer");
/**
* Шаблон для поиска вставляемого элемента
* 'server has bin started on port {{PORT}}' => ['{{PORT}}']
*/


var VARIEBLES = /[{]{2}[\s]*[^\s]+[\s]*[}]{2}/g;

var TextNodeRenderer = /*#__PURE__*/function (_renderer_1$Renderer) {
  _inherits(TextNodeRenderer, _renderer_1$Renderer);

  var _super = _createSuper(TextNodeRenderer);

  function TextNodeRenderer(content, context) {
    var _this;

    _classCallCheck(this, TextNodeRenderer);

    _this = _super.call(this, context);
    _this.content = content;
    _this.node = document.createTextNode(content);
    _this.variablesNames = _this.getFieldsNamesFromContent(_this.content);
    return _this;
  }

  _createClass(TextNodeRenderer, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var observebles = [];
      var staticValues = [];

      var _iterator = _createForOfIteratorHelper(this.variablesNames.entries()),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
              fieldTemplate = _step$value[0],
              fieldName = _step$value[1];

          try {
            var fieldValue = this.getFieldValue(fieldName);

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
          } catch (e) {
            console.error("Error when rendering text: ".concat(e));
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (!this.subscription) {
        this.initObserveblesSubscription(observebles, function (values) {
          return _this2.onValuesChanged(values);
        });
      }

      this.$staticValues.next(staticValues);
    }
  }, {
    key: "getFieldsNamesFromContent",
    value: function getFieldsNamesFromContent(text) {
      var _this3 = this;

      return new Map(_toConsumableArray(new Set(text.match(VARIEBLES) || [])).map(function (fieldTemplate) {
        return [fieldTemplate, _this3.mapTemplateToField(fieldTemplate)];
      }));
    }
  }, {
    key: "addObservable",
    value: function addObservable(observebles, fieldTemplate, fieldValue) {
      observebles.push(fieldValue.map(function (value) {
        return {
          tempate: fieldTemplate,
          value: value
        };
      }));
    }
  }, {
    key: "onValuesChanged",
    value: function onValuesChanged(values) {
      var content = this.content;

      var _iterator2 = _createForOfIteratorHelper(values),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var value = _step2.value;

          switch (_typeof(value.value)) {
            case 'function':
              content = content.replaceAll(value.tempate, value.value.call(this.context));
              break;

            default:
              content = content.replaceAll(value.tempate, String(value.value));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.node.textContent = content.trim();
    }
  }]);

  return TextNodeRenderer;
}(renderer_1.Renderer);

exports.TextNodeRenderer = TextNodeRenderer;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./renderer":"utils/templator/renderer.ts"}],"utils/templator/text-nodes-render-manager.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextNodesRenderManager = void 0;

var text_node_renderer_1 = require("./text-node-renderer");

var TextNodesRenderManager = /*#__PURE__*/function () {
  function TextNodesRenderManager(context) {
    _classCallCheck(this, TextNodesRenderManager);

    this.renderers = [];
    this.context = context;
  }

  _createClass(TextNodesRenderManager, [{
    key: "initTextNode",
    value: function initTextNode(content) {
      var renderer = new text_node_renderer_1.TextNodeRenderer(content, this.context);
      this.renderers.push(renderer);
      return renderer.node;
    }
  }, {
    key: "renderAll",
    value: function renderAll() {
      var _iterator = _createForOfIteratorHelper(this.renderers),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var renderer = _step.value;
          renderer.render();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);

  return TextNodesRenderManager;
}();

exports.TextNodesRenderManager = TextNodesRenderManager;
},{"./text-node-renderer":"utils/templator/text-node-renderer.ts"}],"utils/templator/templator.ts":[function(require,module,exports) {
"use strict"; // TODO: Возможно стоит переписать класс. без регулярок выйдет за o(n)
// TODO: * почему-то ломает текстовую ноду. Надо править регулярки
// TODO: Вынести часть реализации в helper
// TODO: Когда появятся тесты, описание можно будет убрать

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Templator = void 0;

var observeble_1 = require("../observeble/observeble");

var html_elements_render_manager_1 = require("./html-elements-render-manager");

var text_nodes_render_manager_1 = require("./text-nodes-render-manager");
/**
 * Разбивает html на массив по одному тегу в каждом элементе и при этом тег на первом месте. Пример:
 * <div>content<p>text</p>content2</div> =>
 * ['<div>content', '<p>text', '</p>content2', '</div>']
 */


var HTML_TAG_AND_CONTENT = /<.*?>[^<>]*/gim;
/**
 * Разбивает тег на массив атрибутов. Пример:
 * <div name={{name}} click={{handler()}} type="test" hidden> =>
 * ['<div', 'name={{name}}', 'click={{handler()}}', 'type="test"', 'hidden']
 */

var TEG_ATTRIBUTES = /([(<|</)\w-]+(?:=)?(?:"|'|\{\{|\}\})?[\w\-|(|)|.|$]+(?:"|'|\{\{|\}\})?)/gim;
/**
 * Выделяет тег. Пример:
 * '<div hidden name={{name}}> content text' => ['<div hidden name={{name}}>']
 */

var TEG = /^<.*?>/;
/**
 * Начинается не с </
 */

var OPEN_TEG = /^<\//;
/**
 * Выделяет из строки всё, кроме '<', '/' и пробелов
 */

var TEG_NAME = /[^</\s]+/; // TODO: Разобраться с типизацией страниц и компонентов type Context = {[key: string]: any};

var Templator = /*#__PURE__*/function () {
  function Templator(context) {
    var template = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    _classCallCheck(this, Templator);

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

  _createClass(Templator, [{
    key: "initTemplate",
    value: function initTemplate(str) {
      var _this = this;

      var outNodes = [];

      var addToChain = function addToChain(node, content) {
        var getParent = function getParent() {
          // Из-за того что есть не закрывающиеся теги
          var parentIndex = htmlElements[htmlElements.length - 1] === node ? htmlElements.length - 2 : htmlElements.length - 1;

          if (!htmlElements[parentIndex]) {
            throw new Error('Templator: the parent could not be found, most likely the element with the "slot" attribute lies in the root of the template');
          }

          return htmlElements[parentIndex];
        };

        if (node.hasAttribute('slot')) {
          var parent = getParent();

          if (_this.slotsMap.has(parent)) {
            _this.slotsMap.get(parent).push(node);
          } else {
            _this.slotsMap.set(parent, [node]);
          }

          parent.appendChild(node);
          return;
        }

        if (htmlElements.length > 1) {
          var _parent = getParent();

          _parent.appendChild(node);

          _parent.appendChild(_this.textNodesRenderManager.initTextNode(content));
        } else {
          outNodes.push(node);
          outNodes.push(_this.textNodesRenderManager.initTextNode(content));
        }
      }; // Получаем массив, который содержит один тег и контент до следующего тега


      var htmlConfig = str.match(HTML_TAG_AND_CONTENT).map(function (str) {
        // Выбираем только тег
        var tagStr = str.match(TEG)[0];
        var content = str.split(tagStr)[1]; // Разбиваем тег на массив из имени тега и атрибутов

        var tagArray = tagStr.match(TEG_ATTRIBUTES);
        var tag = {
          isOpen: !OPEN_TEG.test(tagStr),
          name: tagArray[0].match(TEG_NAME)[0],
          str: tagStr
        };
        return {
          tag: tag,
          content: content
        };
      });
      var htmlElements = [];

      var _iterator = _createForOfIteratorHelper(htmlConfig),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          if (item.tag.isOpen) {
            var element = this.htmlElementRendererManager.initNode(item.tag.str);

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
              throw Error("Templator: invalid html template: ".concat(str));
            }

            addToChain(htmlElements[htmlElements.length - 1], item.content);
            htmlElements.pop();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      if (htmlElements.length) {
        throw Error("Templator: invalid html template: ".concat(str));
      }

      return outNodes;
    }
  }, {
    key: "render",
    value: function render() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (options.content && this.contentElement && !this.contentSubscription) {
        this.setContent(options.content);
      }

      this.textNodesRenderManager.renderAll();
      this.htmlElementRendererManager.renderAll();
      this.setSlots();
    }
  }, {
    key: "setContent",
    value: function setContent() {
      var _this2 = this;

      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (content instanceof observeble_1.Observable) {
        this.contentSubscription = content.subscribe(function (elements) {
          while (_this2.contentElement.firstChild) {
            _this2.contentElement.removeChild(_this2.contentElement.firstChild);
          }

          var _iterator2 = _createForOfIteratorHelper(elements),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var node = _step2.value;

              _this2.contentElement.appendChild(node);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        });
      } else {
        var _iterator3 = _createForOfIteratorHelper(content),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var node = _step3.value;
            this.contentElement.appendChild(node);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }
  }, {
    key: "setSlots",
    value: function setSlots() {
      var _iterator4 = _createForOfIteratorHelper(this.getMapKeys(this.slotsMap)),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var parent = _step4.value;

          var _iterator5 = _createForOfIteratorHelper(this.slotsMap.get(parent)),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var slot = _step5.value;
              var slotNode = this.getSlotNode(parent, slot.getAttribute('slot'));

              if (slotNode) {
                slotNode.appendChild(slot);
              }
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    } // TODO: вынести в утилиту

  }, {
    key: "getMapKeys",
    value: function getMapKeys(map) {
      var keys = [];
      map.forEach(function (value, key) {
        return keys.push(key);
      });
      return keys;
    }
  }, {
    key: "isSolloTag",
    value: function isSolloTag(element) {
      var solloTags = ['area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'content'];
      return solloTags.includes(element.tagName.toLowerCase());
    }
  }, {
    key: "isContentElement",
    value: function isContentElement(element) {
      return element.tagName.toLowerCase() === 'content';
    } // Node.querySelector("slot[name="name"]")

  }, {
    key: "getSlotNode",
    value: function getSlotNode(node, name) {
      for (var index = 0; index < node.children.length; index++) {
        var child = node.children.item(index);

        if (child.tagName === 'SLOT' && child.getAttribute('name') === name) {
          return child;
        }

        var req = this.getSlotNode(child, name);

        if (req) {
          return req;
        }
      }

      return null;
    }
  }]);

  return Templator;
}();

exports.Templator = Templator;
},{"../observeble/observeble":"utils/observeble/observeble.ts","./html-elements-render-manager":"utils/templator/html-elements-render-manager.ts","./text-nodes-render-manager":"utils/templator/text-nodes-render-manager.ts"}],"utils/component.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.component = void 0;

var templator_1 = require("./templator/templator");

var defaultObservedAttributes;

(function (defaultObservedAttributes) {
  defaultObservedAttributes["hidden"] = "hidden";
  defaultObservedAttributes["style"] = "style";
})(defaultObservedAttributes || (defaultObservedAttributes = {}));

function component(config) {
  return function (Clazz) {
    var CustomElement = /*#__PURE__*/function (_HTMLElement) {
      _inherits(CustomElement, _HTMLElement);

      var _super = _createSuper(CustomElement);

      function CustomElement() {
        var _this;

        _classCallCheck(this, CustomElement);

        _this = _super.call(this);
        _this.clazz = new Clazz();
        return _this;
      }

      _createClass(CustomElement, [{
        key: "connectedCallback",
        value: function connectedCallback() {
          if (this.clazz.onInit) {
            this.clazz.onInit();
          }

          this.render();

          if (this.clazz.onRendered) {
            this.clazz.onRendered(this);
          }
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          if (this.clazz.onDestroy) {
            this.clazz.onDestroy();
          }
        }
      }, {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(name, oldValue, newValue) {
          var needRender = false; // @ts-ignore name - строка не обязательно содержааяся в defaultObservedAttributes

          if (Object.values(defaultObservedAttributes).includes(name)) {
            needRender = this.onDefaultAttributeChanged(name, oldValue, newValue);
          }

          if (this.clazz.onAttributeChanged) {
            needRender = this.clazz.onAttributeChanged(name, oldValue, newValue) || needRender;
          }

          if (needRender) {
            this.render();
          }
        }
      }, {
        key: "render",
        value: function render() {
          var options = {};
          var content = this.clazz.content;

          if (content) {
            options.content = content;
          }

          if (!this.templator) {
            this.init();
          }

          this.templator.render(this.clazz);
        }
      }, {
        key: "init",
        value: function init() {
          this.templator = new templator_1.Templator(this.clazz, config.template);

          var _iterator = _createForOfIteratorHelper(this.templator.nodes),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var node = _step.value;
              this.appendChild(node);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }, {
        key: "inject",
        value: function inject(fieldName, value) {
          // @ts-ignore
          this.clazz[fieldName] = value;
        }
      }, {
        key: "onDefaultAttributeChanged",
        value: function onDefaultAttributeChanged(name, _oldValue, newValue) {
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
      }], [{
        key: "observedAttributes",
        get: function get() {
          // @ts-ignore
          return Object.values(defaultObservedAttributes).concat(config.observedAttributes ? config.observedAttributes : []).concat(Clazz.observedAttributes ? Clazz.observedAttributes : []);
        }
      }]);

      return CustomElement;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

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
exports.template = "\n    <content>\n";
},{}],"service/router/pages.config.ts":[function(require,module,exports) {
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
},{}],"pages/main/page-main.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <p>\u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043A\u0430 \u0441 \u0447\u0430\u0442\u0430\u043C\u0438</p>\n    <button @click={{navigateToAuth()}}>\n        \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043A\u0435 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438\n    </button>\n    <button @click={{navigateToProfile()}} hidden={{$hidden}}>\n        \u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0441\u0442\u0440\u0430\u043D\u0438\u0447\u043A\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F\n    </button>\n\n    <p>{{text}}</p>\n    <p>\u0428\u0430\u0431\u043B\u043E\u043D\u0438\u0437\u0430\u0442\u043E\u0440 \u0443\u043C\u0435\u0435\u0442 \u043F\u043E\u0434\u043F\u0438\u0441\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 observeble</p>\n    <p>\u0422\u0435\u043A\u0443\u0449\u0430\u044F \u0434\u0430\u0442\u0430: {{$data}}</p>\n";
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
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/main/page-main.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageMain = void 0;

var component_1 = require("../../utils/component");

var router_service_1 = require("../../service/router/router.service");

var pages_config_1 = require("../../service/router/pages.config");

var page_main_tmpl_1 = require("./page-main.tmpl");

require("./page-main.less");

var subject_1 = require("../../utils/observeble/subject");

var PageMain = /*#__PURE__*/function () {
  function PageMain() {
    _classCallCheck(this, PageMain);

    this.s = new subject_1.Subject(new Date());
    this.hidden = new subject_1.Subject(false);
    this.text = 'Шаблонизатор умеет получать значения из класса';
    this.routerService = new router_service_1.RouterService();
  }

  _createClass(PageMain, [{
    key: "onInit",
    value: function onInit() {
      var _this = this;

      setInterval(function () {
        return _this.s.next(new Date());
      }, 1000);
      var f = 0;
      setInterval(function () {
        return _this.hidden.next(f++ % 2 === 0);
      }, 1000);
    }
  }, {
    key: "$data",
    get: function get() {
      return this.s.asObserveble();
    }
  }, {
    key: "$hidden",
    get: function get() {
      return this.hidden.asObserveble();
    }
  }, {
    key: "navigateToAuth",
    value: function navigateToAuth() {
      this.routerService.navigateTo(pages_config_1.pages.auth);
    }
  }, {
    key: "navigateToProfile",
    value: function navigateToProfile() {
      this.routerService.navigateTo(pages_config_1.pages.profile);
    }
  }]);

  return PageMain;
}();

PageMain = __decorate([component_1.component({
  name: 'page-main',
  template: page_main_tmpl_1.template
})], PageMain);
exports.PageMain = PageMain;
},{"../../utils/component":"utils/component.ts","../../service/router/router.service":"service/router/router.service.ts","../../service/router/pages.config":"service/router/pages.config.ts","./page-main.tmpl":"pages/main/page-main.tmpl.ts","./page-main.less":"pages/main/page-main.less","../../utils/observeble/subject":"utils/observeble/subject.ts"}],"pages/auth/page-auth.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <main>\n        <h1>\n            {{$title}}\n        </h1>\n\n        <app-form name=\"authorization\" hidden={{$isRegistration}} formGroup=[[authForm]]>\n            <app-input slot=\"field\" formControl=[[authForm.controls.login]]>\n                <span slot=\"label\">\u041B\u043E\u0433\u0438\u043D</span>\n            </app-input>\n            <app-input slot=\"field\" formControl=[[authForm.controls.password]]>\n                <span slot=\"label\">\u041F\u0430\u0440\u043E\u043B\u044C</span>\n            </app-input>\n\n            <app-button slot=\"submit\" class=\"space-top_8\" @disabledclick={{onDisabledClickFormAuthorization()}} disabled={{$isDisabledAuthorizationForm}} appearance=\"primary\">\n                <span slot=\"label\">\n                    \u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F\n                </span>\n            </app-button>\n        </app-form>\n\n        <app-form name=\"registration\" hidden={{$isAuthorization}} formGroup=[[registrationForm]]>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.first_name]]>\n                <span slot=\"label\">\u0418\u043C\u044F</span>\n            </app-input>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.second_name]]>\n                <span slot=\"label\">\u0424\u0430\u043C\u0438\u043B\u0438\u044F</span>    \n            </app-input>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.login]]>\n                <span slot=\"label\">\u041B\u043E\u0433\u0438\u043D</span>\n            </app-input>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.email]]>\n                <span slot=\"label\">\u041F\u043E\u0447\u0442\u0430</span>    \n            </app-input>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.password]]>\n                <span slot=\"label\">\u041F\u0430\u0440\u043E\u043B\u044C</span>    \n            </app-input>\n            <app-input slot=\"field\" formControl=[[registrationForm.controls.phone]]>\n                <span slot=\"label\">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</span> \n            </app-input>\n\n            <app-button slot=\"submit\" class=\"space-top_8\" @disabledclick={{onDisabledClickFormRegistration()}} disabled={{$isDisabledRegistrationForm}} appearance=\"primary\">\n                <span slot=\"label\">\n                    \u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F\n                </span>\n            </app-button>\n        </app-form>\n\n        <app-button @click={{navigateToAuthorization()}} appearance=\"secondary\" hidden={{$isRegistration}}>\n            <span slot=\"label\">\n                \u0412\u043E\u0439\u0442\u0438\n            </span>\n        </app-button>\n\n        <app-button @click={{navigateToRegistration()}} appearance=\"secondary\" hidden={{$isAuthorization}}>\n            <span slot=\"label\">\n                \u041D\u0435\u0442 \u0430\u043A\u0430\u0443\u043D\u0442\u0430?\n            </span>\n    </app-button>\n    </main>\n";
},{}],"utils/animation/animation-utils/transform.functions.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transform = void 0;
exports.transform = {
  rotate: function rotate(deg) {
    return "rotate(".concat(deg, "deg)");
  },
  scale: function scale(size) {
    return "scale(".concat(size, ")");
  }
};
},{}],"utils/animation/animations/shaking-animation.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShakingAnimation = void 0;

var transform_functions_1 = require("../animation-utils/transform.functions");

var ShakingAnimation = function ShakingAnimation() {
  _classCallCheck(this, ShakingAnimation);

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
};

exports.ShakingAnimation = ShakingAnimation;
},{"../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts"}],"utils/form/form-control.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormControl = exports.FormStatusType = void 0;

var observeble_1 = require("../observeble/observeble");

var subject_1 = require("../observeble/subject");

var FormStatusType;

(function (FormStatusType) {
  FormStatusType["valid"] = "VALID";
  FormStatusType["invalid"] = "INVALID";
})(FormStatusType = exports.FormStatusType || (exports.FormStatusType = {}));

var FormControl = /*#__PURE__*/function () {
  function FormControl(config) {
    _classCallCheck(this, FormControl);

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

  _createClass(FormControl, [{
    key: "value",
    get: function get() {
      return this._value;
    }
  }, {
    key: "$valueChanged",
    get: function get() {
      return this.$value.asObserveble();
    }
  }, {
    key: "$statusChanged",
    get: function get() {
      var _this = this;

      return observeble_1.Observable.all([this.$valueChanged].concat(_toConsumableArray(this.asyncValidators.map(function (validate) {
        return validate(_this.$valueChanged);
      })))).map(function (_ref) {
        var _ref2 = _toArray(_ref),
            value = _ref2[0],
            asyncValidatorsResults = _ref2.slice(1);

        return _this.mapValueToStatus(value, asyncValidatorsResults);
      }).uniqueNext(true, function (last, next) {
        return FormControl.hasDiffInStatuses(last, next);
      });
    }
  }, {
    key: "$touched",
    get: function get() {
      return this.touched.asObserveble();
    }
  }, {
    key: "$changeFocus",
    get: function get() {
      return this.hasFocus.asObserveble().uniqueNext();
    }
  }, {
    key: "$isValid",
    get: function get() {
      return this.$statusChanged.map(function (status) {
        return status.status === FormStatusType.valid;
      }).uniqueNext();
    }
  }, {
    key: "$disabled",
    get: function get() {
      return this.disabled.asObserveble().uniqueNext();
    }
  }, {
    key: "$animations",
    get: function get() {
      return this.animations.asObserveble();
    }
  }, {
    key: "next",
    value: function next(value) {
      this._value = value;
      this.$value.next(value || '');
    }
  }, {
    key: "touch",
    value: function touch() {
      this.touched.next(true);
    }
  }, {
    key: "disable",
    value: function disable(disabled) {
      this.disabled.next(disabled);
    }
  }, {
    key: "changeFocus",
    value: function changeFocus(hasFocus) {
      this.hasFocus.next(hasFocus);
    }
  }, {
    key: "animate",
    value: function animate(animations) {
      this.animations.next(animations);
    }
  }, {
    key: "mapValueToStatus",
    value: function mapValueToStatus(value, asyncValidatorsResults) {
      var errors = [];

      var _iterator = _createForOfIteratorHelper(this.validators),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var validator = _step.value;
          var error = validator(value);

          if (error) {
            errors.push(error);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      errors = errors.concat(asyncValidatorsResults.filter(function (error) {
        return Boolean(error);
      }));

      if (errors.length === 0) {
        return {
          status: FormStatusType.valid
        };
      }

      return {
        status: FormStatusType.invalid,
        errors: errors
      };
    }
  }], [{
    key: "hasDiffInStatuses",
    value: function hasDiffInStatuses(last, next) {
      var hasStatusDiff = last.status !== next.status;
      return hasStatusDiff || FormControl.hasErrorsDiff(last.errors, next.errors);
    }
  }, {
    key: "hasErrorsDiff",
    value: function hasErrorsDiff(last, next) {
      if (last && !next || !last && next) {
        return true;
      }

      if (last === undefined && next === undefined) {
        return false;
      }

      if (last.length !== next.length) {
        return true;
      }

      for (var index = 0; index < last.length; index++) {
        if (!last[index].equals(next[index])) {
          return true;
        }
      }

      return false;
    }
  }]);

  return FormControl;
}();

exports.FormControl = FormControl;
},{"../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts"}],"utils/form/form-group.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormGroup = void 0;

var shaking_animation_1 = require("../animation/animations/shaking-animation");

var observeble_1 = require("../observeble/observeble");

var subject_1 = require("../observeble/subject");

var form_control_1 = require("./form-control");

var FormGroup = /*#__PURE__*/function () {
  function FormGroup(config) {
    _classCallCheck(this, FormGroup);

    this._$submit = new subject_1.Subject();
    var controls = {};

    if (config.controls) {
      for (var _i = 0, _Object$entries = Object.entries(config.controls); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            name = _Object$entries$_i[0],
            formConfig = _Object$entries$_i[1];

        controls[name] = this.initFormControl(name, formConfig, config);
      }
    }

    this.controls = controls;
  }

  _createClass(FormGroup, [{
    key: "value",
    get: function get() {
      return Object.values(this.controls).reduce(function (out, control) {
        out[control.name] = String(control.value);
        return out;
      }, {});
    }
  }, {
    key: "$submit",
    get: function get() {
      return this._$submit.asObserveble();
    }
  }, {
    key: "$valueChanged",
    get: function get() {
      return observeble_1.Observable.concat(Object.values(this.controls).map(function (control) {
        return control.$valueChanged.map(function (value) {
          return {
            value: value,
            name: control.name
          };
        });
      })).map(function (entrys) {
        return entrys.reduce(function (out, entry) {
          if (entry) {
            out[entry.name] = String(entry.value);
          }

          return out;
        }, {});
      });
    }
  }, {
    key: "$statusChanged",
    get: function get() {
      return observeble_1.Observable.concat(Object.values(this.controls).map(function (control) {
        return control.$statusChanged.map(function (status) {
          return Object.assign(Object.assign({}, status), {
            name: control.name
          });
        });
      })).map(function (statuses) {
        var isValid = statuses.every(function (status) {
          return status.status === form_control_1.FormStatusType.valid;
        });

        if (isValid) {
          return {
            status: form_control_1.FormStatusType.valid
          };
        }

        var errors = statuses.reduce(function (out, status) {
          if (status && status.errors) {
            out[status.name] = status.errors;
          }

          return out;
        }, {});
        return {
          status: form_control_1.FormStatusType.invalid,
          errors: errors
        };
      });
    }
  }, {
    key: "$isValid",
    get: function get() {
      return observeble_1.Observable.concat(Object.values(this.controls).map(function (control) {
        return control.$isValid;
      })).map(function (isValidFieldsArray) {
        return isValidFieldsArray.every(function (isValid) {
          return isValid;
        });
      });
    }
  }, {
    key: "touch",
    value: function touch() {
      for (var _i2 = 0, _Object$values = Object.values(this.controls); _i2 < _Object$values.length; _i2++) {
        var control = _Object$values[_i2];
        control.touch();
      }
    }
  }, {
    key: "disable",
    value: function disable(disabled) {
      for (var _i3 = 0, _Object$values2 = Object.values(this.controls); _i3 < _Object$values2.length; _i3++) {
        var control = _Object$values2[_i3];
        control.disable(disabled);
      }
    }
  }, {
    key: "submit",
    value: function submit(value) {
      this._$submit.next(value);
    }
  }, {
    key: "next",
    value: function next(formValue) {
      for (var _i4 = 0, _Object$entries2 = Object.entries(formValue); _i4 < _Object$entries2.length; _i4++) {
        var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i4], 2),
            key = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];

        if (this.controls[key]) {
          this.controls[key].next(value);
        }
      }
    }
  }, {
    key: "shakingFirstInvalidField",
    value: function shakingFirstInvalidField() {
      var _this = this;

      observeble_1.Observable.all(Object.values(this.controls).map(function (control) {
        return control.$isValid.map(function (isValid) {
          return {
            isValid: isValid,
            name: control.name
          };
        });
      })).only(1).subscribe(function (isValidObjArray) {
        var _a;

        var firstInvalidControlsName = (_a = isValidObjArray.find(function (isValidObj) {
          return !isValidObj.isValid;
        })) === null || _a === void 0 ? void 0 : _a.name;

        if (firstInvalidControlsName) {
          _this.controls[firstInvalidControlsName].animate(new shaking_animation_1.ShakingAnimation());
        }
      });
    }
  }, {
    key: "initFormControl",
    value: function initFormControl(name, formConfig, config) {
      var _this2 = this;

      if (config.fieldValidators) {
        var formFieldValidators = config.fieldValidators.filter(function (fieldValidator) {
          return fieldValidator.targets.includes(name);
        }).map(function (fieldValidator) {
          return fieldValidator.validators;
        }).reduce(function (out, validators) {
          return out.concat(validators);
        }, []);

        if (formFieldValidators.length !== 0) {
          var asyncValidators = [];

          var _iterator = _createForOfIteratorHelper(formFieldValidators),
              _step;

          try {
            var _loop = function _loop() {
              var validator = _step.value;
              asyncValidators.push(function () {
                return _this2.$valueChanged.map(validator);
              });
            };

            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          formConfig.asyncValidators = (formConfig.asyncValidators || []).concat(asyncValidators);
        }
      }

      return new form_control_1.FormControl(Object.assign({
        name: name
      }, formConfig));
    }
  }]);

  return FormGroup;
}();

exports.FormGroup = FormGroup;
},{"../animation/animations/shaking-animation":"utils/animation/animations/shaking-animation.ts","../observeble/observeble":"utils/observeble/observeble.ts","../observeble/subject":"utils/observeble/subject.ts","./form-control":"utils/form/form-control.ts"}],"utils/form/validator-error.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidatorError = exports.ValidationErrorType = void 0;
var ValidationErrorType;

(function (ValidationErrorType) {
  ValidationErrorType["shown"] = "SHOWN";
  ValidationErrorType["hidden"] = "HIDDEN";
})(ValidationErrorType = exports.ValidationErrorType || (exports.ValidationErrorType = {}));

var ValidatorError = /*#__PURE__*/function (_Error) {
  _inherits(ValidatorError, _Error);

  var _super = _createSuper(ValidatorError);

  function ValidatorError(message) {
    var _this;

    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ValidationErrorType.shown;

    _classCallCheck(this, ValidatorError);

    _this = _super.call(this, message);
    _this.type = type;
    return _this;
  }

  _createClass(ValidatorError, [{
    key: "equals",
    value: function equals(other) {
      return other.type === this.type && other.message === this.message;
    }
  }]);

  return ValidatorError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ValidatorError = ValidatorError;
},{}],"utils/form/validators.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Validators = void 0;

var validator_error_1 = require("./validator-error");

var EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var defaultMessages = {
  empty: 'Поле должно быть заполнено',
  required: 'Поле заполнено неверно',
  maxLength: function maxLength(length) {
    return "\u0414\u043B\u0438\u043D\u043D\u0430 \u043F\u043E\u043B\u044F \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 ".concat(length);
  },
  minLength: function minLength(length) {
    return "\u0414\u043B\u0438\u043D\u043D\u0430 \u043F\u043E\u043B\u044F \u043D\u0435 \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043C\u0435\u043D\u044C\u0448\u0435 ".concat(length);
  },
  noSpaces: 'В поле не должно быть пробелов',
  email: 'Почта должна быть в формате my-email@domen.ru'
};

var Validators = /*#__PURE__*/function () {
  function Validators() {
    _classCallCheck(this, Validators);
  }

  _createClass(Validators, null, [{
    key: "empty",
    value: function empty(error) {
      return function (value) {
        return value ? null : error || new validator_error_1.ValidatorError(defaultMessages.empty);
      };
    }
  }, {
    key: "required",
    value: function required(regExp, error) {
      return function (value) {
        return regExp.test(Validators.nonNullable(value)) ? null : error || new validator_error_1.ValidatorError(defaultMessages.required);
      };
    }
  }, {
    key: "maxLength",
    value: function maxLength(length, error) {
      return function (value) {
        return Validators.toString(value).length > length ? error || new validator_error_1.ValidatorError(defaultMessages.maxLength(length)) : null;
      };
    }
  }, {
    key: "minLength",
    value: function minLength(length, error) {
      return function (value) {
        return Validators.toString(value).length < length ? error || new validator_error_1.ValidatorError(defaultMessages.minLength(length)) : null;
      };
    }
  }, {
    key: "noSpaces",
    value: function noSpaces(error) {
      return function (value) {
        return /\s/g.test(Validators.toString(value).trim()) ? error || new validator_error_1.ValidatorError(defaultMessages.noSpaces) : null;
      };
    }
  }, {
    key: "email",
    value: function email(error) {
      return function (value) {
        return EMAIL.test(Validators.toString(value).toLowerCase()) ? null : error || new validator_error_1.ValidatorError(defaultMessages.email);
      };
    }
  }, {
    key: "nonNullable",
    value: function nonNullable(value) {
      return value === undefined || value === null ? '' : value;
    }
  }, {
    key: "toString",
    value: function toString(value) {
      return String(Validators.nonNullable(value));
    }
  }]);

  return Validators;
}();

exports.Validators = Validators;
},{"./validator-error":"utils/form/validator-error.ts"}],"const/form-validators.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formValidators = void 0;

var validator_error_1 = require("../utils/form/validator-error");

var validators_1 = require("../utils/form/validators");

var defaultValidators = [validators_1.Validators.noSpaces(), validators_1.Validators.maxLength(50), validators_1.Validators.empty()];
exports.formValidators = {
  password: [].concat(defaultValidators, [validators_1.Validators.minLength(6)]),
  login: [].concat(defaultValidators, [validators_1.Validators.minLength(4)]),
  first_name: [].concat(defaultValidators),
  second_name: [].concat(defaultValidators),
  email: [].concat(defaultValidators, [validators_1.Validators.email()]),
  phone: [].concat(defaultValidators, [validators_1.Validators.required(/^\+?\d+$/, new validator_error_1.ValidatorError('Телефон может содержать только цифры и "+" в начале'))]),
  display_name: [].concat(defaultValidators, [validators_1.Validators.minLength(4)])
};
},{"../utils/form/validator-error":"utils/form/validator-error.ts","../utils/form/validators":"utils/form/validators.ts"}],"components/input/app-input.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <label for={{name}} status={{$inputStatus}}>\n        <slot name=\"label\" instead-of-text={{$labelIsInsteadOfText}}></slot>\n    </label>\n    <input type=\"text\" name={{name}} id={{name}} disabled={{$disabled}} @focus={{onFocus}} @blur={{onBlur}} @input={{onInput}}>\n    <div underline={{$inputStatus}}></div>\n    <p transparent={{$needHiddenErrors}} class=\"error\">\n        {{$errorMessage}}\n    </p>\n";
},{}],"components/input/app-input.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"utils/animation/animation-utils/play-animation.ts":[function(require,module,exports) {
"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playAnimation = void 0;

function playAnimation(element, animation) {
  return new Promise(function (resolve) {
    if (animation.onStart) {
      var _iterator = _createForOfIteratorHelper(animation.onStart),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var onStartFunction = _step.value;
          onStartFunction(element);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    resolve();
  }).then(function () {
    return element.animate(animation.keyFrames, animation.keyframeAnimationOptions).finished;
  }).then(function () {
    if (animation.onFinish) {
      var _iterator2 = _createForOfIteratorHelper(animation.onFinish),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var onFinishFunction = _step2.value;
          onFinishFunction(element);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  });
}

exports.playAnimation = playAnimation;
},{}],"components/input/app-input.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppInput = void 0;

var component_1 = require("../../utils/component");

var app_input_tmpl_1 = require("./app-input.tmpl");

require("./app-input.less");

var form_control_1 = require("../../utils/form/form-control");

var observeble_1 = require("../../utils/observeble/observeble");

var validator_error_1 = require("../../utils/form/validator-error");

var play_animation_1 = require("../../utils/animation/animation-utils/play-animation");

var AppInput = /*#__PURE__*/function () {
  function AppInput() {
    _classCallCheck(this, AppInput);
  }

  _createClass(AppInput, [{
    key: "onInit",
    value: function onInit() {
      this.name = this.formControl ? this.formControl.name : false;
    } // TODO: Разбить на методы

  }, {
    key: "onRendered",
    value: function onRendered(element) {
      var _this = this;

      this.input = element.querySelector('input');

      if (this.formControl) {
        this.formControl.$valueChanged.subscribe(function (value) {
          _this.input.value = value || '';
        });
      } else {
        this.formControl = new form_control_1.FormControl({
          name: ''
        });
      }

      observeble_1.Observable.event(element, 'click').subscribe(function () {
        return _this.setFocusForInput();
      });
      this.formControl.$animations.subscribe(function (animation) {
        return play_animation_1.playAnimation(element, animation);
      });
    }
  }, {
    key: "$hasFocus",
    get: function get() {
      return this.formControl.$changeFocus;
    }
  }, {
    key: "$hasErrors",
    get: function get() {
      return this.formControl.$statusChanged.map(function (status) {
        return Boolean(status === null || status === void 0 ? void 0 : status.errors) && status.errors.some(function (error) {
          return error.type === validator_error_1.ValidationErrorType.shown;
        });
      });
    }
  }, {
    key: "$disabled",
    get: function get() {
      return this.formControl.$disabled;
    }
  }, {
    key: "$errorMessage",
    get: function get() {
      return this.formControl.$statusChanged.map(function (status) {
        var _a, _b;

        return ((_b = (_a = status.errors) === null || _a === void 0 ? void 0 : _a.find(function (error) {
          return error.type === validator_error_1.ValidationErrorType.shown;
        })) === null || _b === void 0 ? void 0 : _b.message) || '';
      }) // WARNING: Благодаря этому, текст ошибки не исчезает мгновенно,
      // а становится прозрачным c анимацией.
      .filter(function (message) {
        return Boolean(message);
      });
    }
  }, {
    key: "$needHiddenErrors",
    get: function get() {
      return observeble_1.Observable.all([this.$hasErrors, this.formControl.$touched, this.formControl.$disabled]).map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 3),
            hasErrors = _ref2[0],
            touched = _ref2[1],
            disabled = _ref2[2];

        return !hasErrors || !touched || disabled;
      });
    }
  }, {
    key: "$inputStatus",
    get: function get() {
      return observeble_1.Observable.all([this.$hasErrors, this.formControl.$changeFocus, this.formControl.$touched, this.formControl.$disabled]).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 4),
            hasErrors = _ref4[0],
            hasFocus = _ref4[1],
            touched = _ref4[2],
            disabled = _ref4[3];

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
  }, {
    key: "$labelIsInsteadOfText",
    get: function get() {
      return observeble_1.Observable.all([this.formControl.$changeFocus, this.formControl.$valueChanged.map(function (value) {
        return Boolean(value);
      })]).map(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            hasFocus = _ref6[0],
            hasValue = _ref6[1];

        return !hasFocus && !hasValue;
      });
    }
  }, {
    key: "onFocus",
    value: function onFocus() {
      this.formControl.changeFocus(true);
    }
  }, {
    key: "onBlur",
    value: function onBlur() {
      this.formControl.changeFocus(false);
      this.formControl.touch();
    }
  }, {
    key: "onInput",
    value: function onInput(event) {
      this.formControl.next(event.target.value);
    }
  }, {
    key: "setFocusForInput",
    value: function setFocusForInput() {
      this.input.focus();
    }
  }]);

  return AppInput;
}();

AppInput = __decorate([component_1.component({
  name: 'app-input',
  template: app_input_tmpl_1.template
})], AppInput);
exports.AppInput = AppInput;
},{"../../utils/component":"utils/component.ts","./app-input.tmpl":"components/input/app-input.tmpl.ts","./app-input.less":"components/input/app-input.less","../../utils/form/form-control":"utils/form/form-control.ts","../../utils/observeble/observeble":"utils/observeble/observeble.ts","../../utils/form/validator-error":"utils/form/validator-error.ts","../../utils/animation/animation-utils/play-animation":"utils/animation/animation-utils/play-animation.ts"}],"components/form/app-form.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <form name={{name}} @submit={{onSubmit}}>\n        <slot name=\"field\"></slot>\n        <slot name=\"submit\"></slot>\n    </form>\n";
},{}],"components/form/app-form.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/form/app-form.ts":[function(require,module,exports) {
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppForm = void 0;

var component_1 = require("../../utils/component");

var app_form_tmpl_1 = require("./app-form.tmpl");

require("./app-form.less");

var observeble_1 = require("../../utils/observeble/observeble");

var AppForm = /*#__PURE__*/function () {
  function AppForm() {
    _classCallCheck(this, AppForm);
  }

  _createClass(AppForm, [{
    key: "onSubmit",
    value: function onSubmit(event) {
      var _this = this;

      event.preventDefault();

      if (!this.formGroup) {
        return;
      }

      observeble_1.Observable.all([this.formGroup.$isValid, this.formGroup.$valueChanged]).only(1).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            isValid = _ref2[0],
            _value = _ref2[1];

        return Boolean(isValid);
      }).on(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            _isValid = _ref4[0],
            value = _ref4[1];

        var _a;

        return (_a = _this.formGroup) === null || _a === void 0 ? void 0 : _a.submit(value);
      });
    }
  }, {
    key: "onAttributeChanged",
    value: function onAttributeChanged(name, _oldValue, newValue) {
      switch (name) {
        case 'name':
          if (newValue) {
            this.name = newValue;
          }

          break;

        default:
          break;
      }

      return false;
    }
  }]);

  return AppForm;
}();

AppForm = __decorate([component_1.component({
  name: 'app-form',
  template: app_form_tmpl_1.template,
  observedAttributes: ['name']
})], AppForm);
exports.AppForm = AppForm;
},{"../../utils/component":"utils/component.ts","./app-form.tmpl":"components/form/app-form.tmpl.ts","./app-form.less":"components/form/app-form.less","../../utils/observeble/observeble":"utils/observeble/observeble.ts"}],"components/button/app-button.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <button button-disabled={{$disabled}}>\n        <slot name=\"label\"></slot>\n    </button>\n";
},{}],"components/button/app-button.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"components/button/app-button.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppButton = void 0;

var component_1 = require("../../utils/component");

var app_button_tmpl_1 = require("./app-button.tmpl");

require("./app-button.less");

var subject_1 = require("../../utils/observeble/subject");

var AppButton = /*#__PURE__*/function () {
  function AppButton() {
    _classCallCheck(this, AppButton);

    this.disabled = new subject_1.Subject(false);
    this._disabled = false;
  }

  _createClass(AppButton, [{
    key: "$disabled",
    get: function get() {
      return this.disabled.asObserveble();
    }
  }, {
    key: "onRendered",
    value: function onRendered(element) {
      var _this = this;

      element.querySelector('button').addEventListener('click', function (event) {
        if (_this._disabled) {
          event.stopPropagation();
          element.dispatchEvent(new CustomEvent('disabledclick'));
        }
      });
    }
  }, {
    key: "onAttributeChanged",
    value: function onAttributeChanged(name, _, newValue) {
      switch (name) {
        case 'disabled':
          this._disabled = newValue !== null;
          this.disabled.next(newValue !== null);
          return true;

        default:
          return false;
      }
    }
  }]);

  return AppButton;
}();

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
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"store/enums/user-data.enum.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userDataActionType = void 0;
var userDataActionType;

(function (userDataActionType) {
  userDataActionType["upload"] = "userData__upload";
  userDataActionType["uploaded"] = "userData__uploaded";
  userDataActionType["uploadError"] = "userData__uploadError";
})(userDataActionType = exports.userDataActionType || (exports.userDataActionType = {}));
},{}],"store/actions/user-data.actions.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UploadErrorUserDataAction = exports.UploadedUserDataAction = exports.UploadUserDataAction = void 0;

var user_data_enum_1 = require("../enums/user-data.enum");

var UploadUserDataAction = function UploadUserDataAction() {
  _classCallCheck(this, UploadUserDataAction);

  this.type = user_data_enum_1.userDataActionType.upload;
};

exports.UploadUserDataAction = UploadUserDataAction;

var UploadedUserDataAction = function UploadedUserDataAction(data) {
  _classCallCheck(this, UploadedUserDataAction);

  this.type = user_data_enum_1.userDataActionType.uploaded;
  this.payload = data;
};

exports.UploadedUserDataAction = UploadedUserDataAction;

var UploadErrorUserDataAction = function UploadErrorUserDataAction(error) {
  _classCallCheck(this, UploadErrorUserDataAction);

  this.type = user_data_enum_1.userDataActionType.uploadError;
  this.payload = error;
};

exports.UploadErrorUserDataAction = UploadErrorUserDataAction;
},{"../enums/user-data.enum":"store/enums/user-data.enum.ts"}],"store/enums/data-status.enum.ts":[function(require,module,exports) {
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
},{}],"store/functions/get-default-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDefaultData = void 0;

var data_status_enum_1 = require("../enums/data-status.enum");

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

var get_default_data_1 = require("../functions/get-default-data");

exports.defaultState = {
  userData: get_default_data_1.getDefaultData()
};
},{"../functions/get-default-data":"store/functions/get-default-data.ts"}],"store/functions/reduser-adaptor.ts":[function(require,module,exports) {
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducerAdapt = void 0;

function reducerAdapt(reducers, selector) {
  var globalReducers = {};

  var _loop = function _loop() {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        actionType = _Object$entries$_i[0],
        reducer = _Object$entries$_i[1];

    //@ts-ignore
    globalReducers[actionType] = function (state, action) {
      return Object.assign(Object.assign({}, state), _defineProperty({}, selector, reducer(state[selector], action)));
    };
  };

  for (var _i = 0, _Object$entries = Object.entries(reducers); _i < _Object$entries.length; _i++) {
    _loop();
  }

  return globalReducers;
}

exports.reducerAdapt = reducerAdapt;
},{}],"store/reducers/user-data-reducers.ts":[function(require,module,exports) {
"use strict";

var _userDataReducers2;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userDataReducers = void 0;

var data_status_enum_1 = require("../enums/data-status.enum");

var user_data_enum_1 = require("../enums/user-data.enum");

var reduser_adaptor_1 = require("../functions/reduser-adaptor");

var _userDataReducers = (_userDataReducers2 = {}, _defineProperty(_userDataReducers2, user_data_enum_1.userDataActionType.upload, function (state) {
  return Object.assign(Object.assign({}, state), {
    status: data_status_enum_1.dataStatus.loading
  });
}), _defineProperty(_userDataReducers2, user_data_enum_1.userDataActionType.uploaded, function (state, action) {
  return Object.assign(Object.assign({}, state), {
    status: data_status_enum_1.dataStatus.valid,
    data: action.payload,
    time: Date.now()
  });
}), _defineProperty(_userDataReducers2, user_data_enum_1.userDataActionType.uploadError, function (state, action) {
  return Object.assign(Object.assign({}, state), {
    status: data_status_enum_1.dataStatus.error,
    error: action.payload
  });
}), _userDataReducers2);

exports.userDataReducers = reduser_adaptor_1.reducerAdapt(_userDataReducers, 'userData');
},{"../enums/data-status.enum":"store/enums/data-status.enum.ts","../enums/user-data.enum":"store/enums/user-data.enum.ts","../functions/reduser-adaptor":"store/functions/reduser-adaptor.ts"}],"store/reducers/reducer.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getReducer = void 0;

var user_data_reducers_1 = require("./user-data-reducers");

function getReducer() {
  var reducers = Object.assign({}, user_data_reducers_1.userDataReducers);
  return function (state, action) {
    return reducers[action.type](state, action);
  };
}

exports.getReducer = getReducer;
},{"./user-data-reducers":"store/reducers/user-data-reducers.ts"}],"store/store.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;

var subject_1 = require("../utils/observeble/subject");

var default_state_const_1 = require("./consts/default-state.const");

var reducer_1 = require("./reducers/reducer");

var instance;

var Store = /*#__PURE__*/function () {
  function Store() {
    _classCallCheck(this, Store);

    this._state = default_state_const_1.defaultState;
    this._$state = new subject_1.Subject(this._state);
    this.reduser = reducer_1.getReducer();
    if (instance) return instance;
    instance = this;
  }

  _createClass(Store, [{
    key: "$state",
    get: function get() {
      return this._$state.asObserveble();
    }
  }, {
    key: "state",
    get: function get() {
      return this._state;
    }
  }, {
    key: "dispatch",
    value: function dispatch(action) {
      var nextState = this.reduser(this._state, action);
      this._state = nextState;

      this._$state.next(nextState);
    }
  }]);

  return Store;
}();

exports.Store = Store;
},{"../utils/observeble/subject":"utils/observeble/subject.ts","./consts/default-state.const":"store/consts/default-state.const.ts","./reducers/reducer":"store/reducers/reducer.ts"}],"utils/api/http-method.ts":[function(require,module,exports) {
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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClient = void 0;

var HTTPClient = /*#__PURE__*/function () {
  function HTTPClient(origin) {
    _classCallCheck(this, HTTPClient);

    this.origin = origin;
  }

  _createClass(HTTPClient, [{
    key: "upload",
    value: function upload(appRequest) {
      var request = Object.create(appRequest);
      request.origin = this.origin || window.location.origin;
      return HTTPClient.upload(request);
    }
  }], [{
    key: "queryStringify",
    value: function queryStringify(query) {
      if (!query || _typeof(query) !== 'object' || Object.keys(query).length === 0) {
        return '';
      }

      return "?".concat(Object.keys(query).map(function (key) {
        return "".concat(key, "=").concat(query[key]);
      }).join('&'));
    }
  }, {
    key: "upload",
    value: function upload(request) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

        if (request.timeout) {
          xhr.timeout = request.timeout;
        }

        xhr.responseType = "json";
        xhr.onabort = _this.getXMLHttpRequestHandler(resolve, reject);
        xhr.onerror = _this.getXMLHttpRequestHandler(resolve, reject);
        xhr.ontimeout = _this.getXMLHttpRequestHandler(resolve, reject);
        xhr.onload = _this.getXMLHttpRequestHandler(resolve, reject);
        xhr.open(request.method, "".concat(request.origin, "/").concat(request.pathname.join('/')).concat(HTTPClient.queryStringify(request.queryParams)));

        if (request.headers) {
          for (var _i = 0, _Object$entries = Object.entries(request.headers); _i < _Object$entries.length; _i++) {
            var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
                key = _Object$entries$_i[0],
                value = _Object$entries$_i[1];

            xhr.setRequestHeader(key, value);
          }
        }

        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Referer', 'https://ya-praktikum.tech');
        var body = _typeof(request.body) === 'object' ? JSON.stringify(request.body) : request.body;
        xhr.send(body);
      });
    }
  }, {
    key: "getXMLHttpRequestHandler",
    value: function getXMLHttpRequestHandler(resolve, reject) {
      return function (_event) {
        if (this.status >= 200 && this.status < 300) {
          resolve(HTTPClient.mapXMLHttpRequestToResponse(this));
        } else {
          reject(HTTPClient.mapXMLHttpRequestToResponse(this));
        }
      };
    }
  }, {
    key: "mapXMLHttpRequestToResponse",
    value: function mapXMLHttpRequestToResponse(xhr) {
      return {
        status: xhr.status,
        statusText: xhr.statusText,
        body: xhr.response
      };
    }
  }]);

  return HTTPClient;
}();

exports.HTTPClient = HTTPClient;
},{}],"utils/api/http-client-module.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClientModule = void 0;

var http_client_1 = require("./http-client");

var HTTPClientModule = /*#__PURE__*/function () {
  function HTTPClientModule(origin) {
    var mutualPathname = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, HTTPClientModule);

    this.httpClient = new http_client_1.HTTPClient(origin);
    this.mutualPathname = mutualPathname;
  }

  _createClass(HTTPClientModule, [{
    key: "upload",
    value: function upload(request) {
      var moduleRequest = Object.assign({}, request);
      moduleRequest.pathname = this.mutualPathname.concat(moduleRequest.pathname);
      return this.httpClient.upload(moduleRequest);
    }
  }]);

  return HTTPClientModule;
}();

exports.HTTPClientModule = HTTPClientModule;
},{"./http-client":"utils/api/http-client.ts"}],"service/api/modules/auth-http-client-module.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthHTTPClientModule = void 0;

var http_method_1 = require("../../../utils/api/http-method");

var http_client_module_1 = require("../../../utils/api/http-client-module");

var AuthHTTPClientModule = /*#__PURE__*/function (_http_client_module_) {
  _inherits(AuthHTTPClientModule, _http_client_module_);

  var _super = _createSuper(AuthHTTPClientModule);

  function AuthHTTPClientModule(origin, mutualPathname) {
    _classCallCheck(this, AuthHTTPClientModule);

    return _super.call(this, origin, mutualPathname.concat(AuthHTTPClientModule.moduleMutualPathname));
  }

  _createClass(AuthHTTPClientModule, [{
    key: "registration",
    value: function registration(body) {
      return this.upload({
        method: http_method_1.HTTPMethod.POST,
        pathname: ['signup'],
        body: body
      });
    }
  }, {
    key: "authorization",
    value: function authorization(body) {
      return this.upload({
        method: http_method_1.HTTPMethod.POST,
        pathname: ['signin'],
        body: body
      });
    }
  }, {
    key: "logoout",
    value: function logoout() {
      return this.upload({
        method: http_method_1.HTTPMethod.POST,
        pathname: ['logoout']
      });
    }
  }, {
    key: "getUserData",
    value: function getUserData() {
      return this.upload({
        method: http_method_1.HTTPMethod.GET,
        pathname: ['user']
      });
    }
  }]);

  return AuthHTTPClientModule;
}(http_client_module_1.HTTPClientModule);

exports.AuthHTTPClientModule = AuthHTTPClientModule;
AuthHTTPClientModule.moduleMutualPathname = ['auth'];
},{"../../../utils/api/http-method":"utils/api/http-method.ts","../../../utils/api/http-client-module":"utils/api/http-client-module.ts"}],"service/api/http-client.facade.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTTPClientFacade = void 0;

var auth_http_client_module_1 = require("./modules/auth-http-client-module");

var instance;

var HTTPClientFacade = function HTTPClientFacade() {
  _classCallCheck(this, HTTPClientFacade);

  this.mutualPathname = ['api', 'v2'];
  this.origin = ' https://ya-praktikum.tech';

  if (instance) {
    return instance;
  }

  instance = this;
  this.auth = new auth_http_client_module_1.AuthHTTPClientModule(this.origin, this.mutualPathname);
};

exports.HTTPClientFacade = HTTPClientFacade;
},{"./modules/auth-http-client-module":"service/api/modules/auth-http-client-module.ts"}],"service/auth.service.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthService = void 0;

var user_data_actions_1 = require("../store/actions/user-data.actions");

var store_1 = require("../store/store");

var http_client_facade_1 = require("./api/http-client.facade");

var instance;

var AuthService = /*#__PURE__*/function () {
  function AuthService() {
    _classCallCheck(this, AuthService);

    if (instance) return instance;
    instance = this;
    this.httpClientFacade = new http_client_facade_1.HTTPClientFacade();
    this.store = new store_1.Store();
  }

  _createClass(AuthService, [{
    key: "authorization",
    value: function authorization(authData) {
      var _this = this;

      this.store.dispatch(new user_data_actions_1.UploadUserDataAction());
      this.httpClientFacade.auth.authorization(authData).then(function () {
        return _this.httpClientFacade.auth.getUserData();
      }).then(function (response) {
        return _this.store.dispatch(new user_data_actions_1.UploadedUserDataAction(response.body));
      }).catch(function (error) {
        return _this.store.dispatch(new user_data_actions_1.UploadErrorUserDataAction(error));
      });
    }
  }, {
    key: "registration",
    value: function registration(registrationData) {
      var _this2 = this;

      this.store.dispatch(new user_data_actions_1.UploadUserDataAction());
      this.httpClientFacade.auth.registration(registrationData).then(function () {
        return _this2.httpClientFacade.auth.getUserData();
      }).then(function (response) {
        return _this2.store.dispatch(new user_data_actions_1.UploadedUserDataAction(response.body));
      }).catch(function (error) {
        return _this2.store.dispatch(new user_data_actions_1.UploadErrorUserDataAction(error));
      });
    }
  }, {
    key: "logoout",
    value: function logoout() {}
  }]);

  return AuthService;
}();

exports.AuthService = AuthService;
},{"../store/actions/user-data.actions":"store/actions/user-data.actions.ts","../store/store":"store/store.ts","./api/http-client.facade":"service/api/http-client.facade.ts"}],"pages/auth/services/auth-page-manager.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthPageManager = void 0;

var auth_service_1 = require("../../../service/auth.service");

var pages_config_1 = require("../../../service/router/pages.config");

var router_service_1 = require("../../../service/router/router.service");

var authPageType;

(function (authPageType) {
  authPageType["registration"] = "registration";
})(authPageType || (authPageType = {}));

var instance;

var AuthPageManager = /*#__PURE__*/function () {
  function AuthPageManager() {
    _classCallCheck(this, AuthPageManager);

    if (instance) return instance;
    instance = this;
    this.routerService = new router_service_1.RouterService();
    this.authService = new auth_service_1.AuthService();
  }

  _createClass(AuthPageManager, [{
    key: "$isRegistration",
    get: function get() {
      return this.routerService.$queryParams.map(function (query) {
        return query.type === authPageType.registration;
      });
    }
  }, {
    key: "navigateToAuthorization",
    value: function navigateToAuthorization() {
      this.routerService.navigateTo(pages_config_1.pages.auth, {
        type: authPageType.registration
      });
    }
  }, {
    key: "navigateToRegistration",
    value: function navigateToRegistration() {
      this.routerService.navigateTo(pages_config_1.pages.auth);
    }
  }, {
    key: "authorization",
    value: function authorization(authData) {
      this.authService.authorization(authData);
    }
  }, {
    key: "registration",
    value: function registration(registrationData) {
      this.authService.registration(registrationData);
    }
  }]);

  return AuthPageManager;
}();

exports.AuthPageManager = AuthPageManager;
},{"../../../service/auth.service":"service/auth.service.ts","../../../service/router/pages.config":"service/router/pages.config.ts","../../../service/router/router.service":"service/router/router.service.ts"}],"pages/auth/page-auth.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageAuth = void 0;

var page_auth_tmpl_1 = require("./page-auth.tmpl");

var form_group_1 = require("../../utils/form/form-group");

var component_1 = require("../../utils/component");

var form_validators_1 = require("../../const/form-validators");

require("../../components/input/app-input");

require("../../components/form/app-form");

require("../../components/button/app-button");

require("./page-auth.less");

var auth_page_manager_1 = require("./services/auth-page-manager");

var FORM_TITLE = {
  registration: 'Регистрация',
  authorization: 'Вход'
};

var PageAuth = /*#__PURE__*/function () {
  function PageAuth() {
    _classCallCheck(this, PageAuth);

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

  _createClass(PageAuth, [{
    key: "onInit",
    value: function onInit() {
      var _this = this;

      this.authorizationSubscription = this.authForm.$submit.subscribe(function (formData) {
        return _this.onAuthorization(formData);
      });
      this.registrationSubscription = this.registrationForm.$submit.subscribe(function (formData) {
        return _this.onRegistration(formData);
      });
    }
  }, {
    key: "onDestroy",
    value: function onDestroy() {
      if (this.authorizationSubscription) this.authorizationSubscription.unsubscribe();
      if (this.registrationSubscription) this.registrationSubscription.unsubscribe();
    }
  }, {
    key: "$title",
    get: function get() {
      return this.$isRegistration.map(function (isRegistration) {
        return isRegistration ? FORM_TITLE.registration : FORM_TITLE.authorization;
      });
    }
  }, {
    key: "$isRegistration",
    get: function get() {
      return this.authPageManager.$isRegistration;
    }
  }, {
    key: "$isAuthorization",
    get: function get() {
      return this.$isRegistration.map(function (isAuthorization) {
        return !isAuthorization;
      });
    }
  }, {
    key: "$isDisabledAuthorizationForm",
    get: function get() {
      return this.authForm.$isValid.map(function (isValid) {
        return !isValid;
      });
    }
  }, {
    key: "$isDisabledRegistrationForm",
    get: function get() {
      return this.registrationForm.$isValid.map(function (isValid) {
        return !isValid;
      });
    }
  }, {
    key: "onDisabledClickFormAuthorization",
    value: function onDisabledClickFormAuthorization() {
      this.authForm.touch();
      this.authForm.shakingFirstInvalidField();
    }
  }, {
    key: "onDisabledClickFormRegistration",
    value: function onDisabledClickFormRegistration() {
      this.registrationForm.touch();
      this.registrationForm.shakingFirstInvalidField();
    }
  }, {
    key: "navigateToAuthorization",
    value: function navigateToAuthorization() {
      this.authPageManager.navigateToAuthorization();
    }
  }, {
    key: "navigateToRegistration",
    value: function navigateToRegistration() {
      this.authPageManager.navigateToRegistration();
    }
  }, {
    key: "onAuthorization",
    value: function onAuthorization(authData) {
      this.authPageManager.authorization(authData);
    }
  }, {
    key: "onRegistration",
    value: function onRegistration(registrationData) {
      this.authPageManager.registration(registrationData);
    }
  }]);

  return PageAuth;
}();

PageAuth = __decorate([component_1.component({
  name: 'page-auth',
  template: page_auth_tmpl_1.template
})], PageAuth);
exports.PageAuth = PageAuth;
},{"./page-auth.tmpl":"pages/auth/page-auth.tmpl.ts","../../utils/form/form-group":"utils/form/form-group.ts","../../utils/component":"utils/component.ts","../../const/form-validators":"const/form-validators.ts","../../components/input/app-input":"components/input/app-input.ts","../../components/form/app-form":"components/form/app-form.ts","../../components/button/app-button":"components/button/app-button.ts","./page-auth.less":"pages/auth/page-auth.less","./services/auth-page-manager":"pages/auth/services/auth-page-manager.ts"}],"pages/profile/page-profile.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <main>\n        <section id=\"label\">\n            <img alt=\"avatar\" src={{userData.avatarUrl}}>\n            <h1>{{userData.login}}</h1>\n        </section>\n\n        <section class=\"content-wrapper\">\n            <user-data class=\"content\" hidden-with-animtion={{$hideDataList}}></user-data>\n            <form-user-data class=\"content\" hidden-with-animtion={{$hideFormUserData}}></form-user-data>\n            <form-password class=\"content\" hidden-with-animtion={{$hideFormPassword}}></form-password>\n        </section>\n    </main>\n";
},{}],"pages/profile/components/user-data/user-data.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n<section id=\"data-list\">\n    <dl class=\"field-list\">\n        <dt class=\"text-primary\">\u041F\u043E\u0447\u0442\u0430</dt>\n        <dd class=\"text-secondary\">{{ userData.email }}</dd>\n\n        <dt class=\"text-primary\">\u041B\u043E\u0433\u0438\u043D</dt>\n        <dd class=\"text-secondary\">{{ userData.login }}</dd>\n\n        <dt class=\"text-primary\">\u0418\u043C\u044F</dt>\n        <dd class=\"text-secondary\">{{ userData.first_name }}</dd>\n\n        <dt class=\"text-primary\">\u0424\u0430\u043C\u0438\u043B\u0438\u044F</dt>\n        <dd class=\"text-secondary\">{{ userData.second_name }}</dd>\n\n        <dt class=\"text-primary\">\u0418\u043C\u044F \u0432 \u0447\u0430\u0442\u0435</dt>\n        <dd class=\"text-secondary\">{{ userData.display_name }}</dd>\n\n        <dt class=\"text-primary\">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</dt>\n        <dd class=\"text-secondary\">{{ userData.phone }}</dd>\n    </dl>\n</section>\n\n<section id=\"footer-buttons\">\n    <div class=\"buttons\">\n        <ul class=\"field-list\">\n            <li>\n                <app-button @click={{onChangeData()}} appearance=\"secondary\">\n                    <span slot=\"label\">\n                        \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435\n                    </span>\n                </app-button>\n            </li>\n            <li>\n                <app-button @click={{onChangePassword()}} appearance=\"secondary\">\n                    <span slot=\"label\">\n                        \u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C\n                    </span>\n                </app-button>\n            </li>\n            <li>\n                <app-button @click={{onExit()}} appearance=\"error\">\n                    <span slot=\"label\">\n                        \u0412\u044B\u0439\u0442\u0438\n                    </span>\n                </app-button>\n            </li>\n        </ul>\n    </div>\n</section>\n";
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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HideAnimation = void 0;

var hide_element_1 = require("../../functions/hide-element");

var transform_functions_1 = require("../animation-utils/transform.functions");

var visibility_config_1 = require("../configs/visibility.config");

var HideAnimation = function HideAnimation() {
  _classCallCheck(this, HideAnimation);

  this.keyFrames = [{
    opacity: 0,
    transform: transform_functions_1.transform.scale(1 - visibility_config_1.VISIBILITY_CONFIG.scaleChange)
  }];
  this.keyframeAnimationOptions = {
    duration: visibility_config_1.VISIBILITY_CONFIG.duration
  };
  this.onFinish = [hide_element_1.hideElement];
};

exports.HideAnimation = HideAnimation;
},{"../../functions/hide-element":"utils/functions/hide-element.ts","../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts","../configs/visibility.config":"utils/animation/configs/visibility.config.ts"}],"utils/animation/animations/show-animation.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShowAnimation = void 0;

var hide_element_1 = require("../../functions/hide-element");

var transform_functions_1 = require("../animation-utils/transform.functions");

var visibility_config_1 = require("../configs/visibility.config");

var ShowAnimation = function ShowAnimation() {
  _classCallCheck(this, ShowAnimation);

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
};

exports.ShowAnimation = ShowAnimation;
},{"../../functions/hide-element":"utils/functions/hide-element.ts","../animation-utils/transform.functions":"utils/animation/animation-utils/transform.functions.ts","../configs/visibility.config":"utils/animation/configs/visibility.config.ts"}],"pages/profile/elements/profile-content.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfileContent = void 0;

var play_animation_1 = require("../../../utils/animation/animation-utils/play-animation");

var hide_animation_1 = require("../../../utils/animation/animations/hide-animation");

var show_animation_1 = require("../../../utils/animation/animations/show-animation");

var hide_element_1 = require("../../../utils/functions/hide-element");

var page_profile_1 = require("../page-profile");

var profileContentAttributes;

(function (profileContentAttributes) {
  profileContentAttributes["hiddenWithAnimtion"] = "hidden-with-animtion";
})(profileContentAttributes || (profileContentAttributes = {}));

var ProfileContent = /*#__PURE__*/function () {
  function ProfileContent() {
    _classCallCheck(this, ProfileContent);

    this.isInitHiddenStatus = true;
  }

  _createClass(ProfileContent, [{
    key: "onRendered",
    value: function onRendered(element) {
      this.element = element;
    }
  }, {
    key: "onAttributeChanged",
    value: function onAttributeChanged(name, _oldValue, newValue) {
      switch (name) {
        case profileContentAttributes.hiddenWithAnimtion:
          if (_oldValue === newValue) {
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
            this.show();
          } else {
            this.hide();
          }

          return false;

        default:
          return false;
      }
    }
  }, {
    key: "hide",
    value: function hide() {
      play_animation_1.playAnimation(this.element, new hide_animation_1.HideAnimation());
    }
  }, {
    key: "show",
    value: function show() {
      play_animation_1.playAnimation(this.element, new show_animation_1.ShowAnimation());
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return [profileContentAttributes.hiddenWithAnimtion];
    }
  }]);

  return ProfileContent;
}();

exports.ProfileContent = ProfileContent;
},{"../../../utils/animation/animation-utils/play-animation":"utils/animation/animation-utils/play-animation.ts","../../../utils/animation/animations/hide-animation":"utils/animation/animations/hide-animation.ts","../../../utils/animation/animations/show-animation":"utils/animation/animations/show-animation.ts","../../../utils/functions/hide-element":"utils/functions/hide-element.ts","../page-profile":"pages/profile/page-profile.ts"}],"store/selectors/select-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectDataValue = void 0;

function selectDataValue(data) {
  return data.value;
}

exports.selectDataValue = selectDataValue;
},{}],"store/selectors/select-user-data.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectUserData = void 0;

function selectUserData(state) {
  return state.userData;
}

exports.selectUserData = selectUserData;
},{}],"pages/profile/service/profile-page-manager.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ProfilePageManager = exports.profilePageContent = void 0;

var pages_config_1 = require("../../../service/router/pages.config");

var router_service_1 = require("../../../service/router/router.service");

var user_data_actions_1 = require("../../../store/actions/user-data.actions");

var select_data_1 = require("../../../store/selectors/select-data");

var select_user_data_1 = require("../../../store/selectors/select-user-data");

var store_1 = require("../../../store/store");

var profilePageContent;

(function (profilePageContent) {
  profilePageContent[profilePageContent["userData"] = 0] = "userData";
  profilePageContent[profilePageContent["formUserData"] = 1] = "formUserData";
  profilePageContent[profilePageContent["formPassword"] = 2] = "formPassword";
})(profilePageContent = exports.profilePageContent || (exports.profilePageContent = {}));

var profilePageFormType;

(function (profilePageFormType) {
  profilePageFormType["changeData"] = "changeData";
  profilePageFormType["changePassword"] = "changePassword";
})(profilePageFormType || (profilePageFormType = {}));

var instance;

var ProfilePageManager = /*#__PURE__*/function () {
  function ProfilePageManager() {
    _classCallCheck(this, ProfilePageManager);

    if (instance) {
      return instance;
    }

    instance = this;
    this.routerService = new router_service_1.RouterService();
    this.store = new store_1.Store();
    this.store.dispatch(new user_data_actions_1.UploadedUserDataAction(this.userData));
  }

  _createClass(ProfilePageManager, [{
    key: "$userData",
    get: function get() {
      return this.store.$state.select(select_user_data_1.selectUserData).select(select_data_1.selectDataValue);
    }
  }, {
    key: "$profilePageContent",
    get: function get() {
      return this.routerService.$queryParams.map(function (query) {
        switch (query.form) {
          case profilePageFormType.changeData:
            return profilePageContent.formUserData;

          case profilePageFormType.changePassword:
            return profilePageContent.formPassword;

          default:
            return profilePageContent.userData;
        }
      }).uniqueNext();
    }
  }, {
    key: "goToUserData",
    value: function goToUserData() {
      this.routerService.navigateTo(pages_config_1.pages.profile);
    }
  }, {
    key: "goToFormData",
    value: function goToFormData() {
      this.routerService.navigateTo(pages_config_1.pages.profile, {
        form: profilePageFormType.changeData
      });
    }
  }, {
    key: "goToFormPassword",
    value: function goToFormPassword() {
      this.routerService.navigateTo(pages_config_1.pages.profile, {
        form: profilePageFormType.changePassword
      });
    }
  }, {
    key: "goToChats",
    value: function goToChats() {
      this.routerService.navigateTo(pages_config_1.pages.chats);
    }
  }, {
    key: "userData",
    get: function get() {
      return {
        first_name: 'Вадим',
        second_name: 'Кошечкин',
        display_name: 'Вадим',
        avatarUrl: 'https://sun1-87.userapi.com/s/v1/if1/75kO7SiwUAoiofoYlkEX407eGBwbwRzlxVgqp-j8n_5kJZsBMSTOpA1BrMezYnl6lhaecWsP.jpg?size=400x0&quality=96&crop=6,335,1299,1299&ava=1',
        email: 'Rizus912@yandex.ru',
        login: 'rizus',
        phone: '88005553535'
      };
    }
  }]);

  return ProfilePageManager;
}();

exports.ProfilePageManager = ProfilePageManager;
},{"../../../service/router/pages.config":"service/router/pages.config.ts","../../../service/router/router.service":"service/router/router.service.ts","../../../store/actions/user-data.actions":"store/actions/user-data.actions.ts","../../../store/selectors/select-data":"store/selectors/select-data.ts","../../../store/selectors/select-user-data":"store/selectors/select-user-data.ts","../../../store/store":"store/store.ts"}],"pages/profile/components/user-data/user-data.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserData = void 0;

var component_1 = require("../../../../utils/component");

var user_data_tmpl_1 = require("./user-data.tmpl");

require("./user-data.less");

var profile_content_1 = require("../../elements/profile-content");

var profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore


var UserData = /*#__PURE__*/function (_profile_content_1$Pr) {
  _inherits(UserData, _profile_content_1$Pr);

  var _super = _createSuper(UserData);

  function UserData() {
    var _this;

    _classCallCheck(this, UserData);

    _this = _super.call(this);
    _this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
    return _this;
  }

  _createClass(UserData, [{
    key: "onInit",
    value: function onInit() {
      this.userData = this.profilePageManager.userData;
    }
  }, {
    key: "onChangeData",
    value: function onChangeData() {
      this.profilePageManager.goToFormData();
    }
  }, {
    key: "onChangePassword",
    value: function onChangePassword() {
      this.profilePageManager.goToFormPassword();
    }
  }, {
    key: "onExit",
    value: function onExit() {
      this.profilePageManager.goToChats();
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return _get(_getPrototypeOf(UserData), "observedAttributes", this);
    }
  }]);

  return UserData;
}(profile_content_1.ProfileContent);

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
exports.template = "\n<section>\n    <app-form name=\"user_data\">\n        <app-input slot=\"field\" formControl=[[form.controls.email]]>\n            <span slot=\"label\">\u041F\u043E\u0447\u0442\u0430</span>\n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.login]]>\n            <span slot=\"label\">\u041B\u043E\u0433\u0438\u043D</span>    \n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.first_name]]>\n            <span slot=\"label\">\u0418\u043C\u044F</span>\n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.second_name]]>\n            <span slot=\"label\">\u0424\u0430\u043C\u0438\u043B\u0438\u044F</span>\n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.display_name]]>\n            <span slot=\"label\">\u0418\u043C\u044F \u0432 \u0447\u0430\u0442\u0435</span>\n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.phone]]>\n            <span slot=\"label\">\u0422\u0435\u043B\u0435\u0444\u043E\u043D</span>\n        </app-input>\n    </app-form>\n</section>\n\n<section id=\"footer-buttons\">\n    <div class=\"buttons\">\n        <ul class=\"field-list\">\n            <li>\n                <app-button @click={{onChangeData()}} @disabledclick={{onDisabledClick()}} disabled={{$isInvalidForm}} onDisabledClick appearance=\"primary\">\n                    <span slot=\"label\">\n                        \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\n                    </span>\n                </app-button>\n            </li>\n            <li>\n                <app-button @click={{onBack()}} appearance=\"error\">\n                    <span slot=\"label\">\n                        \u041D\u0430\u0437\u0430\u0434\n                    </span>\n                </app-button>\n            </li>\n        </ul>\n    </div>\n</section>\n";
},{}],"pages/profile/components/form-user-data/form-user-data.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/profile/components/form-user-data/form-user-data.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormUserData = void 0;

var component_1 = require("../../../../utils/component");

var form_user_data_tmpl_1 = require("./form-user-data.tmpl");

require("../../../../components/form/app-form");

require("../../../../components/input/app-input");

require("../../../../components/button/app-button");

require("./form-user-data.less");

var form_group_1 = require("../../../../utils/form/form-group");

var form_validators_1 = require("../../../../const/form-validators");

var profile_content_1 = require("../../elements/profile-content");

var profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore


var FormUserData = /*#__PURE__*/function (_profile_content_1$Pr) {
  _inherits(FormUserData, _profile_content_1$Pr);

  var _super = _createSuper(FormUserData);

  function FormUserData() {
    var _this;

    _classCallCheck(this, FormUserData);

    _this = _super.call(this);
    _this.form = new form_group_1.FormGroup({
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
    _this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
    return _this;
  }

  _createClass(FormUserData, [{
    key: "onInit",
    value: function onInit() {
      this.form.next(this.profilePageManager.userData);
    }
  }, {
    key: "$isInvalidForm",
    get: function get() {
      return this.form.$isValid.map(function (isValid) {
        return !isValid;
      });
    }
  }, {
    key: "onBack",
    value: function onBack() {
      this.profilePageManager.goToUserData();
    }
  }, {
    key: "onChangeData",
    value: function onChangeData() {
      console.log(this.form.value);
    }
  }, {
    key: "onDisabledClick",
    value: function onDisabledClick() {
      this.form.touch();
      this.form.shakingFirstInvalidField();
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return _get(_getPrototypeOf(FormUserData), "observedAttributes", this);
    }
  }]);

  return FormUserData;
}(profile_content_1.ProfileContent);

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
exports.template = "\n<section>\n    <app-form name=\"password\">\n        <app-input slot=\"field\" formControl=[[form.controls.last]]>\n            <span slot=\"label\">\u0421\u0442\u0430\u0440\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C</span>\n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.next]]>\n            <span slot=\"label\">\u041D\u043E\u0432\u044B\u0439 \u043F\u0430\u0440\u043E\u043B\u044C</span>    \n        </app-input>\n        <app-input slot=\"field\" formControl=[[form.controls.repeat]]>\n            <span slot=\"label\">\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u0430\u0440\u043E\u043B\u044C</span>\n        </app-input>\n    </app-form>\n</section>\n\n<section id=\"footer-buttons\">\n    <div class=\"buttons\">\n        <ul class=\"field-list\">\n            <li>\n                <app-button @click={{onChangePassword()}} @disabledclick={{onDisabledClick()}} disabled={{$isInvalidForm}} appearance=\"primary\">\n                    <span slot=\"label\">\n                        \u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C\n                    </span>\n                </app-button>\n            </li>\n            <li>\n                <app-button @click={{onBack()}} appearance=\"error\">\n                    <span slot=\"label\">\n                        \u041D\u0430\u0437\u0430\u0434\n                    </span>\n                </app-button>\n            </li>\n        </ul>\n    </div>\n</section>\n";
},{}],"pages/profile/components/form-password/form-password.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/profile/components/form-password/form-password.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormPassword = void 0;

var form_group_1 = require("../../../../utils/form/form-group");

var component_1 = require("../../../../utils/component");

var form_validators_1 = require("../../../../const/form-validators");

var form_password_tmpl_1 = require("./form-password.tmpl");

require("./form-password.less");

var profile_content_1 = require("../../elements/profile-content");

var validator_error_1 = require("../../../../utils/form/validator-error");

var profile_page_manager_1 = require("../../service/profile-page-manager"); // @ts-ignore никак не могу написать типы для component (


var FormPassword = /*#__PURE__*/function (_profile_content_1$Pr) {
  _inherits(FormPassword, _profile_content_1$Pr);

  var _super = _createSuper(FormPassword);

  function FormPassword() {
    var _this;

    _classCallCheck(this, FormPassword);

    _this = _super.call(this);
    _this.form = new form_group_1.FormGroup({
      controls: {
        last: {
          validators: form_validators_1.formValidators.password
        },
        next: {
          validators: form_validators_1.formValidators.password
        },
        repeat: {
          validators: form_validators_1.formValidators.password
        }
      },
      fieldValidators: [{
        targets: ['repeat'],
        validators: [function (_ref) {
          var next = _ref.next,
              repeat = _ref.repeat;
          return next === repeat ? null : new validator_error_1.ValidatorError('Пароли не совпадают');
        }]
      }, {
        targets: ['repeat'],
        validators: [function (_ref2) {
          var last = _ref2.last,
              repeat = _ref2.repeat;
          return last === repeat ? new validator_error_1.ValidatorError('Новый пароль не отличается от старого') : null;
        }]
      }, {
        targets: ['next'],
        validators: [function (_ref3) {
          var last = _ref3.last,
              next = _ref3.next;
          return last === next ? new validator_error_1.ValidatorError('Новый пароль не отличается от старого') : null;
        }]
      }]
    });
    _this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
    return _this;
  }

  _createClass(FormPassword, [{
    key: "$isInvalidForm",
    get: function get() {
      return this.form.$isValid.map(function (isValid) {
        return !isValid;
      });
    }
  }, {
    key: "onInit",
    value: function onInit() {}
  }, {
    key: "onBack",
    value: function onBack() {
      this.profilePageManager.goToUserData();
    }
  }, {
    key: "onChangePassword",
    value: function onChangePassword() {
      console.log(this.form.value);
    }
  }, {
    key: "onDisabledClick",
    value: function onDisabledClick() {
      this.form.touch();
      this.form.shakingFirstInvalidField();
    }
  }], [{
    key: "observedAttributes",
    get: function get() {
      return _get(_getPrototypeOf(FormPassword), "observedAttributes", this);
    }
  }]);

  return FormPassword;
}(profile_content_1.ProfileContent);

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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageProfile = exports.hiddenWithAnimtionValue = void 0;

var component_1 = require("../../utils/component");

var page_profile_tmpl_1 = require("./page-profile.tmpl");

require("../../components/button/app-button");

require("./components/user-data/user-data");

require("./components/form-user-data/form-user-data");

require("./components/form-password/form-password");

require("./page-profile.less");

var profile_page_manager_1 = require("./service/profile-page-manager");

var hiddenWithAnimtionValue;

(function (hiddenWithAnimtionValue) {
  hiddenWithAnimtionValue["true"] = "true";
  hiddenWithAnimtionValue["false"] = "false";
})(hiddenWithAnimtionValue = exports.hiddenWithAnimtionValue || (exports.hiddenWithAnimtionValue = {}));

var PageProfile = /*#__PURE__*/function () {
  function PageProfile() {
    _classCallCheck(this, PageProfile);

    this.profilePageManager = new profile_page_manager_1.ProfilePageManager();
    this.userData = this.profilePageManager.userData;
  }

  _createClass(PageProfile, [{
    key: "onInit",
    value: function onInit() {} // Костыльно, но мы ограничены возможностями шаблонзатора

  }, {
    key: "$hideDataList",
    get: function get() {
      return this.$getIsHideContent(profile_page_manager_1.profilePageContent.userData);
    }
  }, {
    key: "$hideFormPassword",
    get: function get() {
      return this.$getIsHideContent(profile_page_manager_1.profilePageContent.formPassword);
    }
  }, {
    key: "$hideFormUserData",
    get: function get() {
      return this.$getIsHideContent(profile_page_manager_1.profilePageContent.formUserData);
    }
  }, {
    key: "$getIsHideContent",
    value: function $getIsHideContent(content) {
      return this.profilePageManager.$profilePageContent.map(function (pageContent) {
        return pageContent === content ? hiddenWithAnimtionValue.false : hiddenWithAnimtionValue.true;
      });
    }
  }]);

  return PageProfile;
}();

PageProfile = __decorate([component_1.component({
  name: 'page-profile',
  template: page_profile_tmpl_1.template
})], PageProfile);
exports.PageProfile = PageProfile;
},{"../../utils/component":"utils/component.ts","./page-profile.tmpl":"pages/profile/page-profile.tmpl.ts","../../components/button/app-button":"components/button/app-button.ts","./components/user-data/user-data":"pages/profile/components/user-data/user-data.ts","./components/form-user-data/form-user-data":"pages/profile/components/form-user-data/form-user-data.ts","./components/form-password/form-password":"pages/profile/components/form-password/form-password.ts","./page-profile.less":"pages/profile/page-profile.less","./service/profile-page-manager":"pages/profile/service/profile-page-manager.ts"}],"pages/default/page-default.tmpl.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.template = void 0;
exports.template = "\n    <main>\n        <h1>{{ code }}</h1>\n        <p>{{ description }}</p>\n        <app-button appearance=\"secondary\" @click={{navigateToChats()}}>\n            <span slot=\"label\">\u041D\u0430\u0437\u0430\u0434 \u043A \u0447\u0430\u0442\u0430\u043C</span>\n        </app-button>\n    </main>\n";
},{}],"pages/default/page-default.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"pages/default/page-default.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageDefault = void 0;

var component_1 = require("../../utils/component");

var router_service_1 = require("../../service/router/router.service");

require("../../components/input/app-input");

require("../../components/button/app-button");

var pages_config_1 = require("../../service/router/pages.config");

var page_default_tmpl_1 = require("./page-default.tmpl");

require("./page-default.less");

var CODE_DESCRIPTION = {
  404: 'Не туда попали',
  500: 'Мы уже фиксим'
};

var PageDefault = /*#__PURE__*/function () {
  function PageDefault() {
    _classCallCheck(this, PageDefault);

    this.routerService = new router_service_1.RouterService();
  }

  _createClass(PageDefault, [{
    key: "onInit",
    value: function onInit() {
      this.code = this.routerService.urlParams.queryParams.code || '404';
    }
  }, {
    key: "description",
    get: function get() {
      return CODE_DESCRIPTION[this.code] || CODE_DESCRIPTION["".concat(this.code[0], "00")] || 'Кажется, что-то пошло не так :(';
    }
  }, {
    key: "navigateToChats",
    value: function navigateToChats() {
      this.routerService.navigateTo(pages_config_1.pages.chats);
    }
  }]);

  return PageDefault;
}();

PageDefault = __decorate([component_1.component({
  name: 'page-default',
  template: page_default_tmpl_1.template
})], PageDefault);
exports.PageDefault = PageDefault;
},{"../../utils/component":"utils/component.ts","../../service/router/router.service":"service/router/router.service.ts","../../components/input/app-input":"components/input/app-input.ts","../../components/button/app-button":"components/button/app-button.ts","../../service/router/pages.config":"service/router/pages.config.ts","./page-default.tmpl":"pages/default/page-default.tmpl.ts","./page-default.less":"pages/default/page-default.less"}],"service/router/router.config.ts":[function(require,module,exports) {
"use strict";

var _exports$routerConfig;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerConfig = void 0;

var page_main_1 = require("../../pages/main/page-main");

var page_auth_1 = require("../../pages/auth/page-auth");

var page_profile_1 = require("../../pages/profile/page-profile");

var page_default_1 = require("../../pages/default/page-default");

var pages_config_1 = require("./pages.config");

exports.routerConfig = (_exports$routerConfig = {}, _defineProperty(_exports$routerConfig, pages_config_1.pages.main, page_main_1.PageMain), _defineProperty(_exports$routerConfig, pages_config_1.pages.auth, page_auth_1.PageAuth), _defineProperty(_exports$routerConfig, pages_config_1.pages.profile, page_profile_1.PageProfile), _defineProperty(_exports$routerConfig, pages_config_1.pages.default, page_default_1.PageDefault), _exports$routerConfig);
},{"../../pages/main/page-main":"pages/main/page-main.ts","../../pages/auth/page-auth":"pages/auth/page-auth.ts","../../pages/profile/page-profile":"pages/profile/page-profile.ts","../../pages/default/page-default":"pages/default/page-default.ts","./pages.config":"service/router/pages.config.ts"}],"service/router/router.service.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RouterService = void 0;

var router_config_1 = require("./router.config");

var pages_config_1 = require("./pages.config");

var subject_1 = require("../../utils/observeble/subject");

var observeble_1 = require("../../utils/observeble/observeble");

var instance;

var RouterService = /*#__PURE__*/function () {
  function RouterService() {
    var _this = this;

    _classCallCheck(this, RouterService);

    this._popstate = new subject_1.Subject();

    if (instance) {
      return instance;
    }

    instance = this;
    observeble_1.Observable.event(window, 'popstate').subscribe(function () {
      return _this.onPopState();
    });
  }

  _createClass(RouterService, [{
    key: "config",
    get: function get() {
      return router_config_1.routerConfig;
    }
  }, {
    key: "$popstate",
    get: function get() {
      return this._popstate.asObserveble();
    }
  }, {
    key: "$path",
    get: function get() {
      return this.$popstate.map(function (urlParams) {
        return urlParams.pathname;
      }).startWith(this.urlParams.pathname).uniqueNext();
    }
  }, {
    key: "$queryParams",
    get: function get() {
      return this.$popstate.map(function (urlParams) {
        return urlParams.queryParams;
      }).uniqueNext(false, this.hasQueryParamsDiff).startWith(this.urlParams.queryParams);
    }
  }, {
    key: "urlParams",
    get: function get() {
      var _window$location = window.location,
          hash = _window$location.hash,
          pathname = _window$location.pathname,
          search = _window$location.search;
      var queryParams = (search.match(/[^?&]*/g) || []).filter(function (value) {
        return value;
      }).reduce(function (out, str) {
        var param = str.split('=');

        if (param[1]) {
          // @ts-ignore
          out[param[0]] = param[1];
        }

        return out;
      }, {});
      hash = hash.replace('#', '');
      return {
        hash: hash,
        pathname: pathname,
        queryParams: queryParams
      };
    } // TODO нужно переходить на url не перезагружая страницу history.pushState

  }, {
    key: "navigateTo",
    value: function navigateTo() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pages_config_1.pages.main;
      var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var queryStr = '';

      if (path[0] !== '/') {
        path = "/".concat(path);
      }

      if (Object.keys(query).length !== 0) {
        queryStr = '?' + Object.keys(query).map(function (key) {
          return "".concat(key, "=").concat(query[key]);
        }).join('&');
      }

      if (hash && hash[0] !== '#') {
        hash = "#".concat(hash);
      }

      history.pushState({}, 'page', "".concat(window.location.origin).concat(path).concat(queryStr).concat(hash));
      this.emitUrl(path, query, hash);
    }
  }, {
    key: "getPageByPath",
    value: function getPageByPath() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pages_config_1.pages.main;
      path = path.split('?')[0];

      if (path[path.length - 1] === '/' && path.length > 1) {
        path = path.slice(0, -1);
      }

      if (path[0] !== '/') {
        path = "/".concat(path);
      }

      return this.config[path] || this.config[pages_config_1.pages.default];
    }
  }, {
    key: "getPage",
    value: function getPage() {
      return this.getPageByPath(this.urlParams.pathname);
    }
  }, {
    key: "onPopState",
    value: function onPopState() {
      this._popstate.next(this.urlParams);
    }
  }, {
    key: "emitUrl",
    value: function emitUrl() {
      var pathname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : pages_config_1.pages.main;
      var queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var hash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      if (pathname[0] !== '/') {
        pathname = "/".concat(pathname);
      }

      hash = hash.replace('#', '');

      this._popstate.next({
        pathname: pathname,
        queryParams: queryParams,
        hash: hash
      });
    }
  }, {
    key: "hasQueryParamsDiff",
    value: function hasQueryParamsDiff(last, next) {
      if (!last) {
        return true;
      }

      if (Object.keys(last).length !== Object.keys(next).length) {
        return true;
      }

      for (var key in last) {
        if (last[key] !== next[key]) {
          return true;
        }
      }

      return false;
    }
  }]);

  return RouterService;
}();

exports.RouterService = RouterService;
},{"./router.config":"service/router/router.config.ts","./pages.config":"service/router/pages.config.ts","../../utils/observeble/subject":"utils/observeble/subject.ts","../../utils/observeble/observeble":"utils/observeble/observeble.ts"}],"app-root.less":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app-root.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppRoot = void 0;

var component_1 = require("./utils/component");

var app_root_tmpl_1 = require("./app-root.tmpl");

var router_service_1 = require("./service/router/router.service");

require("./app-root.less");

var AppRoot = /*#__PURE__*/function () {
  function AppRoot() {
    _classCallCheck(this, AppRoot);

    this.router = new router_service_1.RouterService();
  }

  _createClass(AppRoot, [{
    key: "onInit",
    value: function onInit() {}
  }, {
    key: "content",
    get: function get() {
      var _this = this;

      return this.router.$path.map(function (pathname) {
        return _this.router.getPageByPath(pathname);
      }) // TODO: Проблема с типизацией. HTMLPage !== HTMLElement (
      .map(function (constructor) {
        return [new constructor()];
      });
    }
  }]);

  return AppRoot;
}();

AppRoot = __decorate([component_1.component({
  name: 'app-root',
  template: app_root_tmpl_1.template
})], AppRoot);
exports.AppRoot = AppRoot;
},{"./utils/component":"utils/component.ts","./app-root.tmpl":"app-root.tmpl.ts","./service/router/router.service":"service/router/router.service.ts","./app-root.less":"app-root.less"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "37295" + '/');

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