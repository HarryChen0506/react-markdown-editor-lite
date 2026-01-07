"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _DropList = _interopRequireDefault(require("../../components/DropList"));

var _Icon = _interopRequireDefault(require("../../components/Icon"));

var _i18n = _interopRequireDefault(require("../../i18n"));

var _Plugin = require("../Plugin");

var _table = _interopRequireDefault(require("./table"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Table = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(Table, _PluginComponent);

  function Table(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.show = _this.show.bind((0, _assertThisInitialized2.default)(_this));
    _this.hide = _this.hide.bind((0, _assertThisInitialized2.default)(_this));
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
      title: _i18n.default.get('btnTable'),
      onMouseEnter: this.show,
      onMouseLeave: this.hide
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "grid"
    }), /*#__PURE__*/React.createElement(_DropList.default, {
      show: this.state.show,
      onClose: this.hide
    }, /*#__PURE__*/React.createElement(_table.default, {
      visibility: this.state.show,
      maxRow: config.maxRow,
      maxCol: config.maxCol,
      onSetTable: function onSetTable(option) {
        return _this2.editor.insertMarkdown('table', option);
      }
    })));
  };

  return Table;
}(_Plugin.PluginComponent);

exports.default = Table;
Table.pluginName = 'table';
Table.defaultConfig = {
  maxRow: 6,
  maxCol: 6
};