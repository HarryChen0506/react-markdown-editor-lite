import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
export var Preview = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Preview, _React$Component);

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
export var HtmlRender = /*#__PURE__*/function (_Preview2) {
  _inheritsLoose(HtmlRender, _Preview2);

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
export default HtmlRender;