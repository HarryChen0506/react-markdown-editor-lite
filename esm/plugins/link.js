import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../components/Icon';
import i18n from '../i18n';
import { PluginComponent } from './Plugin';

var Link = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Link, _PluginComponent);

  function Link(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.handleKeyboard = {
      key: 'k',
      keyCode: 75,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: function callback() {
        return _this.editor.insertMarkdown('link');
      }
    };
    return _this;
  }

  var _proto = Link.prototype;

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
      className: "button button-type-link",
      title: i18n.get('btnLink'),
      onClick: function onClick() {
        return _this2.editor.insertMarkdown('link');
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "link"
    }));
  };

  return Link;
}(PluginComponent);

Link.pluginName = 'link';
export { Link as default };