"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// TableList
var InputFile = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(InputFile, _React$Component);

  function InputFile(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.timerId = void 0;
    _this.locked = void 0;
    _this.input = void 0;
    _this.timerId = undefined;
    _this.locked = false;
    _this.input = /*#__PURE__*/React.createRef();
    return _this;
  }

  var _proto = InputFile.prototype;

  _proto.click = function click() {
    var _this2 = this;

    if (this.locked || !this.input.current) {
      return;
    }

    this.locked = true;
    this.input.current.value = '';
    this.input.current.click();

    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }

    this.timerId = window.setTimeout(function () {
      _this2.locked = false;
      window.clearTimeout(_this2.timerId);
      _this2.timerId = undefined;
    }, 200);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("input", {
      type: "file",
      ref: this.input,
      accept: this.props.accept,
      style: {
        position: 'absolute',
        zIndex: -1,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        opacity: 0
      },
      onChange: this.props.onChange
    });
  };

  return InputFile;
}(React.Component);

var _default = InputFile;
exports.default = _default;