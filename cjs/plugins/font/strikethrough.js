"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../../components/Icon"));

var _i18n = _interopRequireDefault(require("../../i18n"));

var _Plugin = require("../Plugin");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FontStrikethrough = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(FontStrikethrough, _PluginComponent);

  function FontStrikethrough(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: 'd',
      keyCode: 68,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: function callback() {
        return _this.editor.insertMarkdown('strikethrough');
      }
    };
    return _this;
  }

  var _proto = FontStrikethrough.prototype;

  _proto.componentDidMount = function componentDidMount() {
    if (this.editorConfig.shortcuts) {
      this.editor.onKeyboard(this.handleKeyboard);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.offKeyboard(this.handleKeyboard);
  };

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-strikethrough",
      title: _i18n.default.get('btnStrikethrough'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('strikethrough');
      }
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "strikethrough"
    }));
  };

  return FontStrikethrough;
}(_Plugin.PluginComponent);

exports.default = FontStrikethrough;
FontStrikethrough.pluginName = 'font-strikethrough';