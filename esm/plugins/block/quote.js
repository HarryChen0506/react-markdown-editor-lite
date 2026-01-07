import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var BlockQuote = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(BlockQuote, _PluginComponent);

  function BlockQuote() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = BlockQuote.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-quote",
      title: i18n.get('btnQuote'),
      onClick: function onClick() {
        return _this.editor.insertMarkdown('quote');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "quote"
    }));
  };

  return BlockQuote;
}(PluginComponent);

BlockQuote.pluginName = 'block-quote';
export { BlockQuote as default };