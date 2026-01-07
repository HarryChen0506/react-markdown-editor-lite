"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../components/Icon"));

var _i18n = _interopRequireDefault(require("../i18n"));

var _Plugin = require("./Plugin");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FullScreen = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(FullScreen, _PluginComponent);

  function FullScreen(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)(_this));
    _this.state = {
      enable: _this.editor.isFullScreen()
    };
    return _this;
  }

  var _proto = FullScreen.prototype;

  _proto.handleClick = function handleClick() {
    this.editor.fullScreen(!this.state.enable);
  };

  _proto.handleChange = function handleChange(enable) {
    this.setState({
      enable: enable
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('fullscreen', this.handleChange);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('fullscreen', this.handleChange);
  };

  _proto.render = function render() {
    if (this.editorConfig.canView && this.editorConfig.canView.fullScreen) {
      var enable = this.state.enable;
      return /*#__PURE__*/React.createElement("span", {
        className: "button button-type-fullscreen",
        title: _i18n.default.get(enable ? 'btnExitFullScreen' : 'btnFullScreen'),
        onClick: this.handleClick
      }, /*#__PURE__*/React.createElement(_Icon.default, {
        type: enable ? 'fullscreen-exit' : 'fullscreen'
      }));
    }

    return null;
  };

  return FullScreen;
}(_Plugin.PluginComponent);

exports.default = FullScreen;
FullScreen.pluginName = 'full-screen';
FullScreen.align = 'right';