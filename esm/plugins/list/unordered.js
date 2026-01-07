import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var ListUnordered = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(ListUnordered, _PluginComponent);

  function ListUnordered(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: '8',
      keyCode: 56,
      withKey: ['ctrlKey', 'shiftKey'],
      aliasCommand: true,
      callback: function callback() {
        return _this.editor.insertMarkdown('unordered');
      }
    };
    return _this;
  }

  var _proto = ListUnordered.prototype;

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
      className: "button button-type-unordered",
      title: i18n.get('btnUnordered'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('unordered');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "list-unordered"
    }));
  };

  return ListUnordered;
}(PluginComponent);

ListUnordered.pluginName = 'list-unordered';
export { ListUnordered as default };