import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var BlockCodeInline = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(BlockCodeInline, _PluginComponent);

  function BlockCodeInline() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = BlockCodeInline.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-code-inline",
      title: i18n.get('btnInlineCode'),
      onClick: function onClick() {
        return _this.editor.insertMarkdown('inlinecode');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "code"
    }));
  };

  return BlockCodeInline;
}(PluginComponent);

BlockCodeInline.pluginName = 'block-code-inline';
export { BlockCodeInline as default };