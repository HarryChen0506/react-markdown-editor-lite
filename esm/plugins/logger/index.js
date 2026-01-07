import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';
import LoggerPlugin from './logger';

var Logger = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Logger, _PluginComponent);

  function Logger(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.logger = void 0;
    _this.timerId = void 0;
    _this.handleKeyboards = [];
    _this.lastPop = null;
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleRedo = _this.handleRedo.bind(_assertThisInitialized(_this));
    _this.handleUndo = _this.handleUndo.bind(_assertThisInitialized(_this)); // Mac的Redo比较特殊，是Command+Shift+Z，优先处理

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
    _this.logger = new LoggerPlugin({
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
      title: i18n.get('btnUndo'),
      onClick: this.handleUndo
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "undo"
    })), /*#__PURE__*/React.createElement("span", {
      className: "button button-type-redo " + (hasRedo ? '' : 'disabled'),
      title: i18n.get('btnRedo'),
      onClick: this.handleRedo
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "redo"
    })));
  };

  return Logger;
}(PluginComponent);

Logger.pluginName = 'logger';
export { Logger as default };