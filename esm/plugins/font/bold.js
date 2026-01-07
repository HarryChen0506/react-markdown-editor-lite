import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var FontBold = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(FontBold, _PluginComponent);

  function FontBold(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: 'b',
      keyCode: 66,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: function callback() {
        return _this.editor.insertMarkdown('bold');
      }
    };
    return _this;
  }

  var _proto = FontBold.prototype;

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
      className: "button button-type-bold",
      title: i18n.get('btnBold'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('bold');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "bold"
    }));
  };

  return FontBold;
}(PluginComponent);

FontBold.pluginName = 'font-bold';
export { FontBold as default };