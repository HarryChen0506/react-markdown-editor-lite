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

var Clear = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(Clear, _PluginComponent);

  function Clear(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  var _proto = Clear.prototype;

  _proto.handleClick = function handleClick() {
    if (this.editor.getMdValue() === '') {
      return;
    }

    if (window.confirm && typeof window.confirm === 'function') {
      var result = window.confirm(_i18n.default.get('clearTip'));

      if (result) {
        this.editor.setText('');
      }
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-clear",
      title: _i18n.default.get('btnClear'),
      onClick: this.handleClick
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "delete"
    }));
  };

  return Clear;
}(_Plugin.PluginComponent);

exports.default = Clear;
Clear.pluginName = 'clear';