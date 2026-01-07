"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.Plugins = exports.getDecorated = void 0;

var _editor = _interopRequireDefault(require("./editor"));

var _autoResize = _interopRequireDefault(require("./plugins/autoResize"));

var _codeBlock = _interopRequireDefault(require("./plugins/block/code-block"));

var _codeInline = _interopRequireDefault(require("./plugins/block/code-inline"));

var _quote = _interopRequireDefault(require("./plugins/block/quote"));

var _wrap = _interopRequireDefault(require("./plugins/block/wrap"));

var _clear = _interopRequireDefault(require("./plugins/clear"));

var _bold = _interopRequireDefault(require("./plugins/font/bold"));

var _italic = _interopRequireDefault(require("./plugins/font/italic"));

var _strikethrough = _interopRequireDefault(require("./plugins/font/strikethrough"));

var _underline = _interopRequireDefault(require("./plugins/font/underline"));

var _fullScreen = _interopRequireDefault(require("./plugins/fullScreen"));

var _header = _interopRequireDefault(require("./plugins/header"));

var _Image = _interopRequireDefault(require("./plugins/Image"));

var _link = _interopRequireDefault(require("./plugins/link"));

var _ordered = _interopRequireDefault(require("./plugins/list/ordered"));

var _unordered = _interopRequireDefault(require("./plugins/list/unordered"));

var _logger = _interopRequireDefault(require("./plugins/logger"));

var _modeToggle = _interopRequireDefault(require("./plugins/modeToggle"));

var _table = _interopRequireDefault(require("./plugins/table"));

var _tabInsert = _interopRequireDefault(require("./plugins/tabInsert"));

var _Plugin = require("./plugins/Plugin");

exports.PluginComponent = _Plugin.PluginComponent;

var _index = _interopRequireDefault(require("./components/DropList/index"));

exports.DropList = _index.default;

var _decorate = _interopRequireDefault(require("./utils/decorate"));

exports.getDecorated = _decorate.default;

// 注册默认插件
_editor.default.use(_header.default);

_editor.default.use(_bold.default);

_editor.default.use(_italic.default);

_editor.default.use(_underline.default);

_editor.default.use(_strikethrough.default);

_editor.default.use(_unordered.default);

_editor.default.use(_ordered.default);

_editor.default.use(_quote.default);

_editor.default.use(_wrap.default);

_editor.default.use(_codeInline.default);

_editor.default.use(_codeBlock.default);

_editor.default.use(_table.default);

_editor.default.use(_Image.default);

_editor.default.use(_link.default);

_editor.default.use(_clear.default);

_editor.default.use(_logger.default);

_editor.default.use(_modeToggle.default);

_editor.default.use(_fullScreen.default); // 导出声明
// 导出工具组件


// 导出内置插件
var Plugins = {
  Header: _header.default,
  FontBold: _bold.default,
  FontItalic: _italic.default,
  FontUnderline: _underline.default,
  FontStrikethrough: _strikethrough.default,
  ListUnordered: _unordered.default,
  ListOrdered: _ordered.default,
  BlockQuote: _quote.default,
  BlockWrap: _wrap.default,
  BlockCodeInline: _codeInline.default,
  BlockCodeBlock: _codeBlock.default,
  Table: _table.default,
  Image: _Image.default,
  Link: _link.default,
  Clear: _clear.default,
  Logger: _logger.default,
  ModeToggle: _modeToggle.default,
  FullScreen: _fullScreen.default,
  AutoResize: _autoResize.default,
  TabInsert: _tabInsert.default
}; // 导出编辑器

exports.Plugins = Plugins;
var _default = _editor.default;
exports.default = _default;