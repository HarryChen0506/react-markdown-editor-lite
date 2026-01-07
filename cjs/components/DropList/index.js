"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DropList = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(DropList, _React$Component);

  function DropList(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.handleClose = _this.handleClose.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  var _proto = DropList.prototype;

  _proto.handleClose = function handleClose(e) {
    e.stopPropagation();
    var onClose = this.props.onClose;

    if (typeof onClose === 'function') {
      onClose();
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("div", {
      className: "drop-wrap " + (this.props.show ? 'show' : 'hidden'),
      onClick: this.handleClose
    }, this.props.children);
  };

  return DropList;
}(React.Component);

var _default = DropList;
exports.default = _default;