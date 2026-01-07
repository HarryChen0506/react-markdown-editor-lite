import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
// HeaderList
import * as React from 'react';

var HeaderList = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(HeaderList, _React$Component);

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

export default HeaderList;