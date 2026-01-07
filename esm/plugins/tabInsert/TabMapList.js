import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import classNames from 'classnames';
import * as React from 'react';
import i18n from '../../i18n';

var TabMapList = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(TabMapList, _React$Component);

  function TabMapList() {
    return _React$Component.apply(this, arguments) || this;
  }

  var _proto = TabMapList.prototype;

  _proto.handleSelectMapValue = function handleSelectMapValue(mapValue) {
    var onSelectMapValue = this.props.onSelectMapValue;

    if (typeof onSelectMapValue === 'function') {
      onSelectMapValue(mapValue);
    }
  };

  _proto.render = function render() {
    var _this = this;

    var value = this.props.value;
    return /*#__PURE__*/React.createElement("ul", {
      className: "tab-map-list"
    }, [1, 2, 4, 8].map(function (it) {
      return /*#__PURE__*/React.createElement("li", {
        key: it,
        className: classNames('list-item', {
          active: value === it
        })
      }, /*#__PURE__*/React.createElement("div", {
        onClick: _this.handleSelectMapValue.bind(_this, it)
      }, it === 1 ? i18n.get('tab') : it + " " + i18n.get('spaces')));
    }));
  };

  return TabMapList;
}(React.Component);

export default TabMapList;