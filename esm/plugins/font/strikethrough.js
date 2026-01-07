import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var FontStrikethrough = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(FontStrikethrough, _PluginComponent);

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
      title: i18n.get('btnStrikethrough'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('strikethrough');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "strikethrough"
    }));
  };

  return FontStrikethrough;
}(PluginComponent);

FontStrikethrough.pluginName = 'font-strikethrough';
export { FontStrikethrough as default };