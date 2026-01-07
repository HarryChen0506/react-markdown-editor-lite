import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var BlockCodeBlock = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(BlockCodeBlock, _PluginComponent);

  function BlockCodeBlock() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = BlockCodeBlock.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-code-block",
      title: i18n.get('btnCode'),
      onClick: function onClick() {
        return _this.editor.insertMarkdown('code');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "code-block"
    }));
  };

  return BlockCodeBlock;
}(PluginComponent);

BlockCodeBlock.pluginName = 'block-code-block';
export { BlockCodeBlock as default };