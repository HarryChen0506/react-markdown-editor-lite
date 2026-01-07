"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.HtmlRender = exports.Preview = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Preview = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(Preview, _React$Component);

  function Preview(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.el = void 0;
    _this.el = /*#__PURE__*/React.createRef();
    return _this;
  }

  var _proto = Preview.prototype;

  _proto.getElement = function getElement() {
    return this.el.current;
  };

  _proto.getHeight = function getHeight() {
    return this.el.current ? this.el.current.offsetHeight : 0;
  };

  return Preview;
}(React.Component);

exports.Preview = Preview;

var HtmlRender = /*#__PURE__*/function (_Preview2) {
  (0, _inheritsLoose2.default)(HtmlRender, _Preview2);

  function HtmlRender() {
    return _Preview2.apply(this, arguments) || this;
  }

  var _proto2 = HtmlRender.prototype;

  _proto2.getHtml = function getHtml() {
    if (typeof this.props.html === 'string') {
      return this.props.html;
    }

    if (this.el.current) {
      return this.el.current.innerHTML;
    }

    return '';
  };

  _proto2.render = function render() {
    return typeof this.props.html === 'string' ? /*#__PURE__*/React.createElement('div', {
      ref: this.el,
      dangerouslySetInnerHTML: {
        __html: this.props.html
      },
      className: this.props.className || 'custom-html-style'
    }) : /*#__PURE__*/React.createElement('div', {
      ref: this.el,
      className: this.props.className || 'custom-html-style'
    }, this.props.html);
  };

  return HtmlRender;
}(Preview);

exports.HtmlRender = HtmlRender;
var _default = HtmlRender;
exports.default = _default;