import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

var ListOrdered = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(ListOrdered, _PluginComponent);

  function ListOrdered(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: '7',
      keyCode: 55,
      withKey: ['ctrlKey', 'shiftKey'],
      aliasCommand: true,
      callback: function callback() {
        return _this.editor.insertMarkdown('order');
      }
    };
    return _this;
  }

  var _proto = ListOrdered.prototype;

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
      className: "button button-type-ordered",
      title: i18n.get('btnOrdered'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('order');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "list-ordered"
    }));
  };

  return ListOrdered;
}(PluginComponent);

ListOrdered.pluginName = 'list-ordered';
export { ListOrdered as default };