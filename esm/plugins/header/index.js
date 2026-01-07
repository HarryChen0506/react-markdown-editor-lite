import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import DropList from '../../components/DropList';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';
import HeaderList from './HeaderList';

var Header = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Header, _PluginComponent);

  function Header(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.show = _this.show.bind(_assertThisInitialized(_this));
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    _this.state = {
      show: false
    };
    return _this;
  }

  var _proto = Header.prototype;

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

  _proto.render = function render() {
    var _this2 = this;

    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-header",
      title: i18n.get('btnHeader'),
      onMouseEnter: this.show,
      onMouseLeave: this.hide
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "font-size"
    }), /*#__PURE__*/React.createElement(DropList, {
      show: this.state.show,
      onClose: this.hide
    }, /*#__PURE__*/React.createElement(HeaderList, {
      onSelectHeader: function onSelectHeader(header) {
        return _this2.editor.insertMarkdown(header);
      }
    })));
  };

  return Header;
}(PluginComponent);

Header.pluginName = 'header';
export { Header as default };