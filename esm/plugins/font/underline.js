import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var FontUnderline = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(FontUnderline, _PluginComponent);

  function FontUnderline(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: 'u',
      keyCode: 85,
      withKey: ['ctrlKey'],
      callback: function callback() {
        return _this.editor.insertMarkdown('underline');
      }
    };
    return _this;
  }

  var _proto = FontUnderline.prototype;

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
      className: "button button-type-underline",
      title: i18n.get('btnUnderline'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('underline');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "underline"
    }));
  };

  return FontUnderline;
}(PluginComponent);

FontUnderline.pluginName = 'font-underline';
export { FontUnderline as default };