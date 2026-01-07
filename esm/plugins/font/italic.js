import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var FontItalic = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(FontItalic, _PluginComponent);

  function FontItalic(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: 'i',
      keyCode: 73,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: function callback() {
        return _this.editor.insertMarkdown('italic');
      }
    };
    return _this;
  }

  var _proto = FontItalic.prototype;

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
      className: "button button-type-italic",
      title: i18n.get('btnItalic'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('italic');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "italic"
    }));
  };

  return FontItalic;
}(PluginComponent);

FontItalic.pluginName = 'font-italic';
export { FontItalic as default };