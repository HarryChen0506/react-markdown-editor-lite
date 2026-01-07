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

var BlockQuote = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(BlockQuote, _PluginComponent);

  function BlockQuote() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = BlockQuote.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-quote",
      title: _i18n.default.get('btnQuote'),
      onClick: function onClick() {
        return _this.editor.insertMarkdown('quote');
      }
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "quote"
    }));
  };

  return BlockQuote;
}(_Plugin.PluginComponent);

exports.default = BlockQuote;
BlockQuote.pluginName = 'block-quote';