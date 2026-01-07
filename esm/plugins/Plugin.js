import _createClass from "@babel/runtime/helpers/createClass";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
export var PluginComponent = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(PluginComponent, _React$Component);

  function PluginComponent() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = PluginComponent.prototype;

  _proto.getConfig = function getConfig(key, defaultValue) {
    return typeof this.props.config[key] !== 'undefined' && this.props.config[key] !== null ? this.props.config[key] : defaultValue;
  };

  _createClass(PluginComponent, [{
    key: "editor",
    get: function get() {
      return this.props.editor;
    }
  }, {
    key: "editorConfig",
    get: function get() {
      return this.props.editorConfig;
    }
  }]);

  return PluginComponent;
}(React.Component);
PluginComponent.pluginName = '';
PluginComponent.align = 'left';
PluginComponent.defaultConfig = {};