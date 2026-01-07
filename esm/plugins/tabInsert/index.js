import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

/**
 * Since the Markdown Editor will lose input focus when user tpye a Tab key,
 * this is a built-in plugin to enable user to input Tab character.
 * see src/demo/index.tsx.
 */
import * as React from 'react';
import { PluginComponent } from '../Plugin';
import DropList from '../../components/DropList';
import i18n from '../../i18n';
import TabMapList from './TabMapList';
import Icon from '../../components/Icon';
/**
 * @field tabMapValue:  Number of spaces will be inputted. Especially, note that 1 means a '\t' instead of ' '.
 * @field show:         Whether to show TabMapList.
 */

var TabInsert = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(TabInsert, _PluginComponent);

  function TabInsert(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleKeyboard = void 0;
    _this.show = _this.show.bind(_assertThisInitialized(_this));
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    _this.handleChangeMapValue = _this.handleChangeMapValue.bind(_assertThisInitialized(_this));
    _this.state = {
      tabMapValue: _this.getConfig('tabMapValue'),
      show: false
    };
    _this.handleKeyboard = {
      key: 'Tab',
      keyCode: 9,
      aliasCommand: true,
      withKey: [],
      callback: function callback() {
        return _this.editor.insertMarkdown('tab', {
          tabMapValue: _this.state.tabMapValue
        });
      }
    };
    return _this;
  }

  var _proto = TabInsert.prototype;

  _proto.show = function show() {
    this.setState({
      show: true
    });
  };

  _proto.hide = function hide() {
    this.setState({
      show: false
    });
  };

  _proto.handleChangeMapValue = function handleChangeMapValue(mapValue) {
    this.setState({
      tabMapValue: mapValue
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    if (this.editorConfig.shortcuts) {
      this.editor.onKeyboard(this.handleKeyboard);
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.offKeyboard(this.handleKeyboard);
  };

  _proto.render = function render() {
    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-header",
      title: i18n.get('selectTabMap'),
      onClick: this.show,
      onMouseLeave: this.hide
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "tab"
    }), /*#__PURE__*/React.createElement(DropList, {
      show: this.state.show,
      onClose: this.hide
    }, /*#__PURE__*/React.createElement(TabMapList, {
      value: this.state.tabMapValue,
      onSelectMapValue: this.handleChangeMapValue
    })));
  };

  return TabInsert;
}(PluginComponent);

TabInsert.pluginName = 'tab-insert';
TabInsert.defaultConfig = {
  tabMapValue: 1
};
export { TabInsert as default };