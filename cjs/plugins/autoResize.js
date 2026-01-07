"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Plugin = require("./Plugin");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var AutoResize = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(AutoResize, _PluginComponent);

  function AutoResize(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.timer = null;
    _this.useTimer = void 0;
    _this.useTimer = _this.getConfig('useTimer') || typeof requestAnimationFrame === 'undefined';
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)(_this));
    _this.doResize = _this.doResize.bind((0, _assertThisInitialized2.default)(_this));
    return _this;
  }

  var _proto = AutoResize.prototype;

  _proto.doResize = function doResize() {
    var _this2 = this;

    var resizeElement = function resizeElement(e) {
      e.style.height = 'auto';
      var height = Math.min(Math.max(_this2.getConfig('min'), e.scrollHeight), _this2.getConfig('max'));
      e.style.height = height + "px";
      return height;
    };

    this.timer = null; // 如果渲染了编辑器，就以编辑器为准

    var view = this.editor.getView();
    var el = this.editor.getMdElement();
    var previewer = this.editor.getHtmlElement();

    if (el && view.md) {
      var height = resizeElement(el);

      if (previewer) {
        previewer.style.height = height + "px";
      }

      return;
    } // 否则，以预览区域为准


    if (previewer && view.html) {
      resizeElement(previewer);
    }
  };

  _proto.handleChange = function handleChange() {
    if (this.timer !== null) {
      return;
    }

    if (this.useTimer) {
      this.timer = window.setTimeout(this.doResize);
      return;
    }

    this.timer = requestAnimationFrame(this.doResize);
  };

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('change', this.handleChange);
    this.editor.on('viewchange', this.handleChange);
    this.handleChange();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('change', this.handleChange);
    this.editor.off('viewchange', this.handleChange);

    if (this.timer !== null && this.useTimer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", null);
  };

  return AutoResize;
}(_Plugin.PluginComponent);

exports.default = AutoResize;
AutoResize.pluginName = 'auto-resize';
AutoResize.align = 'left';
AutoResize.defaultConfig = {
  min: 200,
  max: Infinity,
  useTimer: false
};