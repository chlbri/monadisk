function sleep(ms) {
  if (ms === void 0) {
    ms = 300;
  }
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
var id = 0;
function _classPrivateFieldLooseKey(name) {
  return "__private_" + id++ + "_" + name;
}
function _classPrivateFieldLooseBase(receiver, privateKey) {
  if (!Object.prototype.hasOwnProperty.call(receiver, privateKey)) {
    throw new TypeError("attempted to use private field on non-instance");
  }
  return receiver;
}

var _history = /*#__PURE__*/_classPrivateFieldLooseKey("history");
var _subscribers = /*#__PURE__*/_classPrivateFieldLooseKey("subscribers");
var _mapper = /*#__PURE__*/_classPrivateFieldLooseKey("mapper");
var _mapped2 = /*#__PURE__*/_classPrivateFieldLooseKey("mapped");
var _addHistory = /*#__PURE__*/_classPrivateFieldLooseKey("addHistory");
var _flushSubcribers = /*#__PURE__*/_classPrivateFieldLooseKey("flushSubcribers");
var _map = /*#__PURE__*/_classPrivateFieldLooseKey("map");
var Monad = /*#__PURE__*/function () {
  function Monad(def, current) {
    var _this = this;
    Object.defineProperty(this, _history, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _subscribers, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _mapper, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _mapped2, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _addHistory, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _flushSubcribers, {
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, _map, {
      writable: true,
      value: void 0
    });
    this.def = def;
    this.current = current;
    _classPrivateFieldLooseBase(this, _history)[_history] = [];
    _classPrivateFieldLooseBase(this, _subscribers)[_subscribers] = [];
    _classPrivateFieldLooseBase(this, _addHistory)[_addHistory] = function () {
      var hist = {
        input: _this.current,
        output: _classPrivateFieldLooseBase(_this, _mapped2)[_mapped2]
      };
      _classPrivateFieldLooseBase(_this, _history)[_history].push(hist);
    };
    _classPrivateFieldLooseBase(this, _flushSubcribers)[_flushSubcribers] = function () {
      _classPrivateFieldLooseBase(_this, _subscribers)[_subscribers].forEach(function (subscriber) {
        return subscriber(_this.current, _classPrivateFieldLooseBase(_this, _mapped2)[_mapped2]);
      });
    };
    _classPrivateFieldLooseBase(this, _map)[_map] = function (mapper) {
      var entries = Object.entries(_this.def);
      for (var _i = 0, _entries = entries; _i < _entries.length; _i++) {
        var _entries$_i = _entries[_i],
          key = _entries$_i[0],
          cond = _entries$_i[1];
        var func = mapper[key];
        var validated = cond(_this.current);
        if (func && validated) {
          return func(_this.current);
        }
      }
      return mapper["else"](_this.current);
    };
    this.createMap = function (mapper) {
      return mapper;
    };
    this.subscribe = function (subscriber) {
      _classPrivateFieldLooseBase(_this, _subscribers)[_subscribers].push(subscriber);
    };
    this.setMapper = function (mapper) {
      if (mapper) _classPrivateFieldLooseBase(_this, _mapper)[_mapper] = mapper;
    };
    this.change = function (other, mapper) {
      var current = mapper ? _classPrivateFieldLooseBase(_this, _map)[_map](mapper) : other.current;
      return new Monad(other.def, current);
    };
    this.next = function () {
      for (var _len = arguments.length, datas = new Array(_len), _key = 0; _key < _len; _key++) {
        datas[_key] = arguments[_key];
      }
      datas.forEach(function (data) {
        _this.current = data;
        if (!_classPrivateFieldLooseBase(_this, _mapper)[_mapper]) throw new Error('No mapper');
        _this.transform(_classPrivateFieldLooseBase(_this, _mapper)[_mapper], true);
      });
    };
  }
  var _proto = Monad.prototype;
  _proto.transform = function transform(mapper, flush) {
    if (flush === void 0) {
      flush = false;
    }
    this.setMapper(mapper);
    if (!_classPrivateFieldLooseBase(this, _mapper)[_mapper]) throw new Error('No mapper');
    var _mapped = _classPrivateFieldLooseBase(this, _map)[_map](_classPrivateFieldLooseBase(this, _mapper)[_mapper]);
    _classPrivateFieldLooseBase(this, _mapped2)[_mapped2] = _mapped;
    _classPrivateFieldLooseBase(this, _addHistory)[_addHistory]();
    flush && _classPrivateFieldLooseBase(this, _flushSubcribers)[_flushSubcribers]();
    return _mapped;
  };
  _proto.transformValue = function transformValue(data) {
    this.current = data;
    return this.transform();
  };
  _createClass(Monad, [{
    key: "isUndefined",
    get: function get() {
      return this.current === undefined;
    }
  }, {
    key: "_mapped",
    get: function get() {
      return _classPrivateFieldLooseBase(this, _mapped2)[_mapped2];
    }
  }, {
    key: "history",
    get: function get() {
      return _classPrivateFieldLooseBase(this, _history)[_history];
    }
  }]);
  return Monad;
}();

export { Monad, sleep };
//# sourceMappingURL=monadisk.esm.js.map
