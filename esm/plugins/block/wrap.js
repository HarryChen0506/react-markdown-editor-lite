import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var BlockWrap = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(BlockWrap, _PluginComponent);

  function BlockWrap() {
    return _PluginComponent.apply(this, arguments) || this;
  }

  var _proto = BlockWrap.prototype;

  _proto.render = function render() {
    var _this = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-wrap",
      title: i18n.get('btnLineBreak'),
      onClick: function onClick() {
        return _this.editor.insertMarkdown('hr');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "wrap"
    }));
  };

  return BlockWrap;
}(PluginComponent);

BlockWrap.pluginName = 'block-wrap';
export { BlockWrap as default };