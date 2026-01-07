"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.PluginComponent = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var PluginComponent = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(PluginComponent, _React$Component);

  function PluginComponent() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = PluginComponent.prototype;

  _proto.getConfig = function getConfig(key, defaultValue) {
    return typeof this.props.config[key] !== 'undefined' && this.props.config[key] !== null ? this.props.config[key] : defaultValue;
  };

  (0, _createClass2.default)(PluginComponent, [{
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

exports.PluginComponent = PluginComponent;
PluginComponent.pluginName = '';
PluginComponent.align = 'left';
PluginComponent.defaultConfig = {};