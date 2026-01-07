"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../../components/Icon"));

var _i18n = _interopRequireDefault(require("../../i18n"));

var _Plugin = require("../Plugin");

var _logger = _interopRequireDefault(require("./logger"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Logger = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(Logger, _PluginComponent);

  function Logger(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.logger = void 0;
    _this.timerId = void 0;
    _this.handleKeyboards = [];
    _this.lastPop = null;
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleRedo = _this.handleRedo.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleUndo = _this.handleUndo.bind((0, _assertThisInitialized2.default)(_this)); // Mac的Redo比较特殊，是Command+Shift+Z，优先处理

    _this.handleKeyboards = [{
      key: 'y',
      keyCode: 89,
      withKey: ['ctrlKey'],
      callback: _this.handleRedo
    }, {
      key: 'z',
      keyCode: 90,
      withKey: ['metaKey', 'shiftKey'],
      callback: _this.handleRedo
    }, {
      key: 'z',
      keyCode: 90,
      aliasCommand: true,
      withKey: ['ctrlKey'],
      callback: _this.handleUndo
    }];
    _this.logger = new _logger.default({
      maxSize: _this.editorConfig.loggerMaxSize
    }); // 注册API

    _this.editor.registerPluginApi('undo', _this.handleUndo);

    _this.editor.registerPluginApi('redo', _this.handleRedo);

    return _this;
  }

  var _proto = Logger.prototype;

  _proto.handleUndo = function handleUndo() {
    var last = this.logger.undo(this.editor.getMdValue());

    if (typeof last !== 'undefined') {
      this.pause();
      this.lastPop = last;
      this.editor.setText(last);
      this.forceUpdate();
    }
  };

  _proto.handleRedo = function handleRedo() {
    var last = this.logger.redo();

    if (typeof last !== 'undefined') {
      this.lastPop = last;
      this.editor.setText(last);
      this.forceUpdate();
    }
  };

  _proto.handleChange = function handleChange(value, e, isNotInput) {
    var _this2 = this;

    if (this.logger.getLast() === value || this.lastPop !== null && this.lastPop === value) {
      return;
    }

    this.logger.cleanRedo();

    if (isNotInput) {
      // from setText API call, not a input
      this.logger.push(value);
      this.lastPop = null;
      this.forceUpdate();
      return;
    }

    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = 0;
    }

    this.timerId = window.setTimeout(function () {
      if (_this2.logger.getLast() !== value) {
        _this2.logger.push(value);

        _this2.lastPop = null;

        _this2.forceUpdate();
      }

      window.clearTimeout(_this2.timerId);
      _this2.timerId = 0;
    }, this.editorConfig.loggerInterval);
  };

  _proto.componentDidMount = function componentDidMount() {
    var _this3 = this;

    // 监听变化事件
    this.editor.on('change', this.handleChange); // 监听键盘事件

    this.handleKeyboards.forEach(function (it) {
      return _this3.editor.onKeyboard(it);
    }); // 初始化时，把已有值填充进logger

    this.logger.initValue = this.editor.getMdValue();
    this.forceUpdate();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    var _this4 = this;

    if (this.timerId) {
      window.clearTimeout(this.timerId);
    }

    this.editor.off('change', this.handleChange);
    this.editor.unregisterPluginApi('undo');
    this.editor.unregisterPluginApi('redo');
    this.handleKeyboards.forEach(function (it) {
      return _this4.editor.offKeyboard(it);
    });
  };

  _proto.pause = function pause() {
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  };

  _proto.render = function render() {
    var hasUndo = this.logger.getUndoCount() > 1 || this.logger.initValue !== this.editor.getMdValue();
    var hasRedo = this.logger.getRedoCount() > 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "button button-type-undo " + (hasUndo ? '' : 'disabled'),
      title: _i18n.default.get('btnUndo'),
      onClick: this.handleUndo
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "undo"
    })), /*#__PURE__*/React.createElement("span", {
      className: "button button-type-redo " + (hasRedo ? '' : 'disabled'),
      title: _i18n.default.get('btnRedo'),
      onClick: this.handleRedo
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "redo"
    })));
  };

  return Logger;
}(_Plugin.PluginComponent);

exports.default = Logger;
Logger.pluginName = 'logger';