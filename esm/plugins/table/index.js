import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import DropList from '../../components/DropList';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';
import TableList from './table';

var Table = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Table, _PluginComponent);

  function Table(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.show = _this.show.bind(_assertThisInitialized(_this));
    _this.hide = _this.hide.bind(_assertThisInitialized(_this));
    _this.state = {
      show: false
    };
    return _this;
  }

  var _proto = Table.prototype;

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

    var config = this.editorConfig.table || this.props.config;
    return /*#__PURE__*/React.createElement("span", {
      className: "button button-type-table",
      title: i18n.get('btnTable'),
      onMouseEnter: this.show,
      onMouseLeave: this.hide
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "grid"
    }), /*#__PURE__*/React.createElement(DropList, {
      show: this.state.show,
      onClose: this.hide
    }, /*#__PURE__*/React.createElement(TableList, {
      visibility: this.state.show,
      maxRow: config.maxRow,
      maxCol: config.maxCol,
      onSetTable: function onSetTable(option) {
        return _this2.editor.insertMarkdown('table', option);
      }
    })));
  };

  return Table;
}(PluginComponent);

Table.pluginName = 'table';
Table.defaultConfig = {
  maxRow: 6,
  maxCol: 6
};
export { Table as default };