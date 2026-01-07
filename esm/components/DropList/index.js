import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';

var DropList = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(DropList, _React$Component);

  function DropList(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.handleClose = _this.handleClose.bind(_assertThisInitialized(_this));
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

export default DropList;