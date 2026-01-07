"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var _classnames = _interopRequireDefault(require("classnames"));

var React = _interopRequireWildcard(require("react"));

var _i18n = _interopRequireDefault(require("../../i18n"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var TabMapList = /*#__PURE__*/function (_React$Component) {
  (0, _inheritsLoose2.default)(TabMapList, _React$Component);

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
        className: (0, _classnames.default)('list-item', {
          active: value === it
        })
      }, /*#__PURE__*/React.createElement("div", {
        onClick: _this.handleSelectMapValue.bind(_this, it)
      }, it === 1 ? _i18n.default.get('tab') : it + " " + _i18n.default.get('spaces')));
    }));
  };

  return TabMapList;
}(React.Component);

var _default = TabMapList;
exports.default = _default;