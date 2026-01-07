import * as React from 'react';
export default function NavigationBar(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rc-md-navigation " + (props.visible ? 'visible' : 'in-visible')
  }, /*#__PURE__*/React.createElement("div", {
    className: "navigation-nav left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "button-wrap"
  }, props.left)), /*#__PURE__*/React.createElement("div", {
    className: "navigation-nav right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "button-wrap"
  }, props.right)));
}