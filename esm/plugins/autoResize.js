import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import { PluginComponent } from './Plugin';

var AutoResize = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(AutoResize, _PluginComponent);

  function AutoResize(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.timer = null;
    _this.useTimer = void 0;
    _this.useTimer = _this.getConfig('useTimer') || typeof requestAnimationFrame === 'undefined';
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.doResize = _this.doResize.bind(_assertThisInitialized(_this));
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
}(PluginComponent);

AutoResize.pluginName = 'auto-resize';
AutoResize.align = 'left';
AutoResize.defaultConfig = {
  min: 200,
  max: Infinity,
  useTimer: false
};
export { AutoResize as default };