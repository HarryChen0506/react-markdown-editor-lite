import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import { PluginComponent } from '../Plugin';

var Divider = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Divider, _PluginComponent);

  function Divider() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = Divider.prototype;

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "rc-md-divider"
    });
  };

  return Divider;
}(PluginComponent);

Divider.pluginName = 'divider';
export { Divider as default };