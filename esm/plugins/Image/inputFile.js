import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
// TableList
import * as React from 'react';

var InputFile = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(InputFile, _React$Component);

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

export default InputFile;