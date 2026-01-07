"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// HeaderList
var HeaderList = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(HeaderList, _React$Component);

  function HeaderList() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = HeaderList.prototype;

  _proto.handleHeader = function handleHeader(header) {
    var onSelectHeader = this.props.onSelectHeader;

    if (typeof onSelectHeader === 'function') {
      onSelectHeader(header);
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("ul", {
      className: "header-list"
    }, /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h1", {
      onClick: this.handleHeader.bind(this, 'h1')
    }, "H1")), /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h2", {
      onClick: this.handleHeader.bind(this, 'h2')
    }, "H2")), /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h3", {
      onClick: this.handleHeader.bind(this, 'h3')
    }, "H3")), /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h4", {
      onClick: this.handleHeader.bind(this, 'h4')
    }, "H4")), /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h5", {
      onClick: this.handleHeader.bind(this, 'h5')
    }, "H5")), /*#__PURE__*/React.createElement("li", {
      className: "list-item"
    }, /*#__PURE__*/React.createElement("h6", {
      onClick: this.handleHeader.bind(this, 'h6')
    }, "H6")));
  };

  return HeaderList;
}(React.Component);

var _default = HeaderList;
exports.default = _default;