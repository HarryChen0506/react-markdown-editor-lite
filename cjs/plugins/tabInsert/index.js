"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Plugin = require("../Plugin");

var _DropList = _interopRequireDefault(require("../../components/DropList"));

var _i18n = _interopRequireDefault(require("../../i18n"));

var _TabMapList = _interopRequireDefault(require("./TabMapList"));

var _Icon = _interopRequireDefault(require("../../components/Icon"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/**
 * Since the Markdown Editor will lose input focus when user tpye a Tab key,
 * this is a built-in plugin to enable user to input Tab character.
 * see src/demo/index.tsx.
 */
var TabInsert = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(TabInsert, _PluginComponent);

  function TabInsert(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.show = _this.show.bind((0, _assertThisInitialized2.default)(_this));
    _this.hide = _this.hide.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleChangeMapValue = _this.handleChangeMapValue.bind((0, _assertThisInitialized2.default)(_this));
    _this.state = {
      tabMapValue: _this.getConfig('tabMapValue'),
      show: false
    };
    _this.handleKeyboard = {
      key: 'Tab',
      keyCode: 9,
      aliasCommand: true,
      withKey: [],
      callback: function callback() {
        return _this.editor.insertMarkdown('tab', {
          tabMapValue: _this.state.tabMapValue
        });
      }
    };
    return _this;
  }

  var _proto = TabInsert.prototype;

  _proto.show = function show() {
    this.setState({
      show: true
    });
  };

  _proto.hide = function hide() {
    this.setState({
      show: false
    });
  };

  _proto.handleChangeMapValue = function handleChangeMapValue(mapValue) {
    this.setState({
      tabMapValue: mapValue
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    if (this.editorConfig.shortcuts) {
      this.editor.onKeyboard(this.handleKeyboard);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.offKeyboard(this.handleKeyboard);
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-header",
      title: _i18n.default.get('selectTabMap'),
      onClick: this.show,
      onMouseLeave: this.hide
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "tab"
    }), /*#__PURE__*/React.createElement(_DropList.default, {
      show: this.state.show,
      onClose: this.hide
    }, /*#__PURE__*/React.createElement(_TabMapList.default, {
      value: this.state.tabMapValue,
      onSelectMapValue: this.handleChangeMapValue
    })));
  };

  return TabInsert;
}(_Plugin.PluginComponent);

exports.default = TabInsert;
TabInsert.pluginName = 'tab-insert';
TabInsert.defaultConfig = {
  tabMapValue: 1
};