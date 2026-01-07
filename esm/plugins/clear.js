import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../components/Icon';
import i18n from '../i18n';
import { PluginComponent } from './Plugin';

var Clear = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Clear, _PluginComponent);

  function Clear(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  var _proto = Clear.prototype;

  _proto.handleClick = function handleClick() {
    if (this.editor.getMdValue() === '') {
      return;
    }

    if (window.confirm && typeof window.confirm === 'function') {
      var result = window.confirm(i18n.get('clearTip'));

      if (result) {
        this.editor.setText('');
      }
    }
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-clear",
      title: i18n.get('btnClear'),
      onClick: this.handleClick
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "delete"
    }));
  };

  return Clear;
}(PluginComponent);

Clear.pluginName = 'clear';
export { Clear as default };