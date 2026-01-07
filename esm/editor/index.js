import _extends from "@babel/runtime/helpers/extends";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import * as React from 'react';
import { v4 as uuid } from 'uuid';
import Icon from '../components/Icon';
import NavigationBar from '../components/NavigationBar';
import ToolBar from '../components/ToolBar';
import i18n from '../i18n';
import DividerPlugin from '../plugins/divider';
import Emitter, { globalEmitter } from '../share/emitter';
import { initialSelection } from '../share/var';
import getDecorated from '../utils/decorate';
import mergeConfig from '../utils/mergeConfig';
import { getLineAndCol, isKeyMatch, isPromise } from '../utils/tool';
import getUploadPlaceholder from '../utils/uploadPlaceholder';
import defaultConfig from './defaultConfig';
import { HtmlRender } from './preview';

var Editor = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(Editor, _React$Component);

  /**
   * Register plugin
   * @param {any} comp Plugin component
   * @param {any} config Other configs
   */
  Editor.use = function use(comp, config) {
    if (config === void 0) {
      config = {};
    }

    // Check for duplicate plugins
    for (var i = 0; i < Editor.plugins.length; i++) {
      if (Editor.plugins[i].comp === comp) {
        Editor.plugins.splice(i, 1, {
          comp: comp,
          config: config
        });
        return;
      }
    }

    Editor.plugins.push({
      comp: comp,
      config: config
    });
  }
  /**
   * Unregister plugin
   * @param {any} comp Plugin component
   */
  ;

  Editor.unuse = function unuse(comp) {
    for (var i = 0; i < Editor.plugins.length; i++) {
      if (Editor.plugins[i].comp === comp) {
        Editor.plugins.splice(i, 1);
        return;
      }
    }
  }
  /**
   * Unregister all plugins
   * @param {any} comp Plugin component
   */
  ;

  Editor.unuseAll = function unuseAll() {
    Editor.plugins = [];
  }
  /**
   * Locales
   */
  ;

  function Editor(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.config = void 0;
    _this.emitter = void 0;
    _this.nodeMdText = /*#__PURE__*/React.createRef();
    _this.nodeMdPreview = /*#__PURE__*/React.createRef();
    _this.nodeMdPreviewWrapper = /*#__PURE__*/React.createRef();
    _this.hasContentChanged = true;
    _this.composing = false;
    _this.pluginApis = new Map();
    _this.handleInputScroll = void 0;
    _this.handlePreviewScroll = void 0;
    // sync left and right section's scroll
    _this.scrollScale = 1;
    _this.isSyncingScroll = false;
    _this.shouldSyncScroll = 'md';

    /**
     * Listen keyboard events
     */
    _this.keyboardListeners = [];
    _this.emitter = new Emitter();
    _this.config = mergeConfig(defaultConfig, _this.props.config, _this.props);
    _this.state = {
      text: (_this.props.value || _this.props.defaultValue || '').replace(/↵/g, '\n'),
      html: '',
      view: _this.config.view || defaultConfig.view,
      fullScreen: false,
      plugins: _this.getPlugins()
    };

    if (_this.config.canView && !_this.config.canView.menu) {
      _this.state.view.menu = false;
    }

    _this.nodeMdText = /*#__PURE__*/React.createRef();
    _this.nodeMdPreviewWrapper = /*#__PURE__*/React.createRef();
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handlePaste = _this.handlePaste.bind(_assertThisInitialized(_this));
    _this.handleDrop = _this.handleDrop.bind(_assertThisInitialized(_this));
    _this.handleToggleMenu = _this.handleToggleMenu.bind(_assertThisInitialized(_this));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_this));
    _this.handleEditorKeyDown = _this.handleEditorKeyDown.bind(_assertThisInitialized(_this));
    _this.handleLocaleUpdate = _this.handleLocaleUpdate.bind(_assertThisInitialized(_this));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    _this.handleInputScroll = _this.handleSyncScroll.bind(_assertThisInitialized(_this), 'md');
    _this.handlePreviewScroll = _this.handleSyncScroll.bind(_assertThisInitialized(_this), 'html');
    return _this;
  }

  var _proto = Editor.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var text = this.state.text;
    this.renderHTML(text);
    globalEmitter.on(globalEmitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate); // init i18n

    i18n.setUp();
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    globalEmitter.off(globalEmitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps) {
    if (typeof this.props.value !== 'undefined' && this.props.value !== this.state.text) {
      var value = this.props.value;

      if (typeof value !== 'string') {
        value = String(value).toString();
      }

      value = value.replace(/↵/g, '\n');

      if (this.state.text !== value) {
        this.setState({
          text: value
        });
        this.renderHTML(value);
      }
    }

    if (prevProps.plugins !== this.props.plugins) {
      this.setState({
        plugins: this.getPlugins()
      });
    }
  };

  _proto.isComposing = function isComposing() {
    return this.composing;
  };

  _proto.getPlugins = function getPlugins() {
    var _this2 = this;

    var plugins = [];

    if (this.props.plugins) {
      // If plugins option is configured, use only specified plugins
      var addToPlugins = function addToPlugins(name) {
        if (name === DividerPlugin.pluginName) {
          plugins.push({
            comp: DividerPlugin,
            config: {}
          });
          return;
        }

        for (var _iterator = _createForOfIteratorHelperLoose(Editor.plugins), _step; !(_step = _iterator()).done;) {
          var it = _step.value;

          if (it.comp.pluginName === name) {
            plugins.push(it);
            return;
          }
        }
      };

      for (var _iterator2 = _createForOfIteratorHelperLoose(this.props.plugins), _step2; !(_step2 = _iterator2()).done;) {
        var name = _step2.value;

        // Special handling of fonts to ensure backward compatibility
        if (name === 'fonts') {
          addToPlugins('font-bold');
          addToPlugins('font-italic');
          addToPlugins('font-underline');
          addToPlugins('font-strikethrough');
          addToPlugins('list-unordered');
          addToPlugins('list-ordered');
          addToPlugins('block-quote');
          addToPlugins('block-wrap');
          addToPlugins('block-code-inline');
          addToPlugins('block-code-block');
        } else {
          addToPlugins(name);
        }
      }
    } else {
      // Use all registered plugins
      plugins = [].concat(Editor.plugins);
    }

    var result = {};
    plugins.forEach(function (it) {
      if (typeof result[it.comp.align] === 'undefined') {
        result[it.comp.align] = [];
      }

      var key = it.comp.pluginName === 'divider' ? uuid() : it.comp.pluginName;
      result[it.comp.align].push( /*#__PURE__*/React.createElement(it.comp, {
        editor: _this2,
        editorConfig: _this2.config,
        config: _extends({}, it.comp.defaultConfig || {}, it.config || {}),
        key: key
      }));
    });
    return result;
  };

  _proto.handleSyncScroll = function handleSyncScroll(type, e) {
    var _this3 = this;

    // prevent loop
    if (type !== this.shouldSyncScroll) {
      return;
    } // trigger events


    if (this.props.onScroll) {
      this.props.onScroll(e, type);
    }

    this.emitter.emit(this.emitter.EVENT_SCROLL, e, type); // should sync scroll?

    var _this$config$syncScro = this.config.syncScrollMode,
        syncScrollMode = _this$config$syncScro === void 0 ? [] : _this$config$syncScro;

    if (!syncScrollMode.includes(type === 'md' ? 'rightFollowLeft' : 'leftFollowRight')) {
      return;
    }

    if (this.hasContentChanged && this.nodeMdText.current && this.nodeMdPreviewWrapper.current) {
      // 计算出左右的比例
      this.scrollScale = this.nodeMdText.current.scrollHeight / this.nodeMdPreviewWrapper.current.scrollHeight;
      this.hasContentChanged = false;
    }

    if (!this.isSyncingScroll) {
      this.isSyncingScroll = true;
      requestAnimationFrame(function () {
        if (_this3.nodeMdText.current && _this3.nodeMdPreviewWrapper.current) {
          if (type === 'md') {
            // left to right
            _this3.nodeMdPreviewWrapper.current.scrollTop = _this3.nodeMdText.current.scrollTop / _this3.scrollScale;
          } else {
            // right to left
            _this3.nodeMdText.current.scrollTop = _this3.nodeMdPreviewWrapper.current.scrollTop * _this3.scrollScale;
          }
        }

        _this3.isSyncingScroll = false;
      });
    }
  };

  _proto.renderHTML = function renderHTML(markdownText) {
    var _this4 = this;

    if (!this.props.renderHTML) {
      console.error('renderHTML props is required!');
      return Promise.resolve();
    }

    var res = this.props.renderHTML(markdownText);

    if (isPromise(res)) {
      // @ts-ignore
      return res.then(function (r) {
        return _this4.setHtml(r);
      });
    }

    if (typeof res === 'function') {
      return this.setHtml(res());
    }

    return this.setHtml(res);
  };

  _proto.setHtml = function setHtml(html) {
    var _this5 = this;

    return new Promise(function (resolve) {
      _this5.setState({
        html: html
      }, resolve);
    });
  };

  _proto.handleToggleMenu = function handleToggleMenu() {
    this.setView({
      menu: !this.state.view.menu
    });
  };

  _proto.handleFocus = function handleFocus(e) {
    var onFocus = this.props.onFocus;

    if (onFocus) {
      onFocus(e);
    }

    this.emitter.emit(this.emitter.EVENT_FOCUS, e);
  };

  _proto.handleBlur = function handleBlur(e) {
    var onBlur = this.props.onBlur;

    if (onBlur) {
      onBlur(e);
    }

    this.emitter.emit(this.emitter.EVENT_BLUR, e);
  }
  /**
   * Text area change event
   * @param {React.ChangeEvent} e
   */
  ;

  _proto.handleChange = function handleChange(e) {
    e.persist();
    var value = e.target.value; // 触发内部事件

    this.setText(value, e);
  }
  /**
   * Listen paste event to support paste images
   */
  ;

  _proto.handlePaste = function handlePaste(e) {
    if (!this.config.allowPasteImage || !this.config.onImageUpload) {
      return;
    }

    var event = e.nativeEvent; // @ts-ignore

    var items = (event.clipboardData || window.clipboardData).items;

    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  } // Drag images to upload
  ;

  _proto.handleDrop = function handleDrop(e) {
    if (!this.config.onImageUpload) {
      return;
    }

    var event = e.nativeEvent;

    if (!event.dataTransfer) {
      return;
    }

    var items = event.dataTransfer.items;

    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  };

  _proto.handleEditorKeyDown = function handleEditorKeyDown(e) {
    var _this6 = this;

    var keyCode = e.keyCode,
        key = e.key,
        currentTarget = e.currentTarget;

    if ((keyCode === 13 || key === 'Enter') && this.composing === false) {
      var _text = currentTarget.value;
      var curPos = currentTarget.selectionStart;
      var lineInfo = getLineAndCol(_text, curPos);

      var emptyCurrentLine = function emptyCurrentLine() {
        var newValue = currentTarget.value.substr(0, curPos - lineInfo.curLine.length) + currentTarget.value.substr(curPos);

        _this6.setText(newValue, undefined, {
          start: curPos - lineInfo.curLine.length,
          end: curPos - lineInfo.curLine.length
        });

        e.preventDefault();
      };

      var addSymbol = function addSymbol(symbol) {
        _this6.insertText("\n" + symbol, false, {
          start: symbol.length + 1,
          end: symbol.length + 1
        });

        e.preventDefault();
      }; // Enter key, check previous line


      var isSymbol = lineInfo.curLine.match(/^(\s*?)\* /);

      if (isSymbol) {
        if (/^(\s*?)\* $/.test(lineInfo.curLine)) {
          emptyCurrentLine();
          return;
        }

        addSymbol(isSymbol[0]);
        return;
      }

      var isOrderList = lineInfo.curLine.match(/^(\s*?)(\d+)\. /);

      if (isOrderList) {
        if (/^(\s*?)(\d+)\. $/.test(lineInfo.curLine)) {
          emptyCurrentLine();
          return;
        }

        var toInsert = "" + isOrderList[1] + (parseInt(isOrderList[2], 10) + 1) + ". ";
        addSymbol(toInsert);
        return;
      }
    } // 触发默认事件


    this.emitter.emit(this.emitter.EVENT_EDITOR_KEY_DOWN, e);
  } // Handle language change
  ;

  _proto.handleLocaleUpdate = function handleLocaleUpdate() {
    this.forceUpdate();
  }
  /**
   * Get elements
   */
  ;

  _proto.getMdElement = function getMdElement() {
    return this.nodeMdText.current;
  };

  _proto.getHtmlElement = function getHtmlElement() {
    return this.nodeMdPreviewWrapper.current;
  }
  /**
   * Clear selected
   */
  ;

  _proto.clearSelection = function clearSelection() {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(0, 0, 'none');
    }
  }
  /**
   * Get selected
   * @return {Selection}
   */
  ;

  _proto.getSelection = function getSelection() {
    var source = this.nodeMdText.current;

    if (!source) {
      return _extends({}, initialSelection);
    }

    var start = source.selectionStart;
    var end = source.selectionEnd;
    var text = (source.value || '').slice(start, end);
    return {
      start: start,
      end: end,
      text: text
    };
  }
  /**
   * Set selected
   * @param {Selection} to
   */
  ;

  _proto.setSelection = function setSelection(to) {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(to.start, to.end, 'forward');
      this.nodeMdText.current.focus();
    }
  }
  /**
   * Insert markdown text
   * @param type
   * @param option
   */
  ;

  _proto.insertMarkdown = function insertMarkdown(type, option) {
    if (option === void 0) {
      option = {};
    }

    var curSelection = this.getSelection();
    var decorateOption = option ? _extends({}, option) : {};

    if (type === 'image') {
      decorateOption = _extends({}, decorateOption, {
        target: option.target || curSelection.text || '',
        imageUrl: option.imageUrl || this.config.imageUrl
      });
    }

    if (type === 'link') {
      decorateOption = _extends({}, decorateOption, {
        linkUrl: this.config.linkUrl
      });
    }

    if (type === 'tab' && curSelection.start !== curSelection.end) {
      var curLineStart = this.getMdValue().slice(0, curSelection.start).lastIndexOf('\n') + 1;
      this.setSelection({
        start: curLineStart,
        end: curSelection.end
      });
    }

    var decorate = getDecorated(curSelection.text, type, decorateOption);
    var text = decorate.text;
    var selection = decorate.selection;

    if (decorate.newBlock) {
      var startLineInfo = getLineAndCol(this.getMdValue(), curSelection.start);
      var col = startLineInfo.col,
          curLine = startLineInfo.curLine;

      if (col > 0 && curLine.length > 0) {
        text = "\n" + text;

        if (selection) {
          selection.start++;
          selection.end++;
        }
      }

      var afterText = startLineInfo.afterText;

      if (curSelection.start !== curSelection.end) {
        afterText = getLineAndCol(this.getMdValue(), curSelection.end).afterText;
      }

      if (afterText.trim() !== '' && afterText.substr(0, 2) !== '\n\n') {
        if (afterText.substr(0, 1) !== '\n') {
          text += '\n';
        }

        text += '\n';
      }
    }

    this.insertText(text, true, selection);
  }
  /**
   * Insert a placeholder, and replace it when the Promise resolved
   * @param placeholder
   * @param wait
   */
  ;

  _proto.insertPlaceholder = function insertPlaceholder(placeholder, wait) {
    var _this7 = this;

    this.insertText(placeholder, true);
    wait.then(function (str) {
      var text = _this7.getMdValue().replace(placeholder, str);

      _this7.setText(text);
    });
  }
  /**
   * Insert text
   * @param {string} value The text will be insert
   * @param {boolean} replaceSelected Replace selected text
   * @param {Selection} newSelection New selection
   */
  ;

  _proto.insertText = function insertText(value, replaceSelected, newSelection) {
    if (value === void 0) {
      value = '';
    }

    if (replaceSelected === void 0) {
      replaceSelected = false;
    }

    var text = this.state.text;
    var selection = this.getSelection();
    var beforeContent = text.slice(0, selection.start);
    var afterContent = text.slice(replaceSelected ? selection.end : selection.start, text.length);
    this.setText(beforeContent + value + afterContent, undefined, newSelection ? {
      start: newSelection.start + beforeContent.length,
      end: newSelection.end + beforeContent.length
    } : {
      start: selection.start,
      end: selection.start
    });
  }
  /**
   * Set text, and trigger onChange event
   * @param {string} value
   * @param {any} event
   */
  ;

  _proto.setText = function setText(value, event, newSelection) {
    var _this8 = this;

    if (value === void 0) {
      value = '';
    }

    var _this$config$onChange = this.config.onChangeTrigger,
        onChangeTrigger = _this$config$onChange === void 0 ? 'both' : _this$config$onChange;
    var text = value.replace(/↵/g, '\n');

    if (this.state.text === value) {
      return;
    }

    this.setState({
      text: text
    });

    if (this.props.onChange && (onChangeTrigger === 'both' || onChangeTrigger === 'beforeRender')) {
      this.props.onChange({
        text: text,
        html: this.getHtmlValue()
      }, event);
    }

    this.emitter.emit(this.emitter.EVENT_CHANGE, value, event, typeof event === 'undefined');

    if (newSelection) {
      setTimeout(function () {
        return _this8.setSelection(newSelection);
      });
    }

    if (!this.hasContentChanged) {
      this.hasContentChanged = true;
    }

    var rendering = this.renderHTML(text);

    if (onChangeTrigger === 'both' || onChangeTrigger === 'afterRender') {
      rendering.then(function () {
        if (_this8.props.onChange) {
          _this8.props.onChange({
            text: _this8.state.text,
            html: _this8.getHtmlValue()
          }, event);
        }
      });
    }
  }
  /**
   * Get text value
   * @return {string}
   */
  ;

  _proto.getMdValue = function getMdValue() {
    return this.state.text;
  }
  /**
   * Get rendered html
   * @returns {string}
   */
  ;

  _proto.getHtmlValue = function getHtmlValue() {
    if (typeof this.state.html === 'string') {
      return this.state.html;
    }

    if (this.nodeMdPreview.current) {
      return this.nodeMdPreview.current.getHtml();
    }

    return '';
  };

  /**
   * Listen keyboard events
   * @param {KeyboardEventListener} data
   */
  _proto.onKeyboard = function onKeyboard(data) {
    var _this9 = this;

    if (Array.isArray(data)) {
      data.forEach(function (it) {
        return _this9.onKeyboard(it);
      });
      return;
    }

    if (!this.keyboardListeners.includes(data)) {
      this.keyboardListeners.push(data);
    }
  }
  /**
   * Un-listen keyboard events
   * @param {KeyboardEventListener} data
   */
  ;

  _proto.offKeyboard = function offKeyboard(data) {
    var _this10 = this;

    if (Array.isArray(data)) {
      data.forEach(function (it) {
        return _this10.offKeyboard(it);
      });
      return;
    }

    var index = this.keyboardListeners.indexOf(data);

    if (index >= 0) {
      this.keyboardListeners.splice(index, 1);
    }
  };

  _proto.handleKeyDown = function handleKeyDown(e) {
    // 遍历监听数组，找找有没有被监听
    for (var _iterator3 = _createForOfIteratorHelperLoose(this.keyboardListeners), _step3; !(_step3 = _iterator3()).done;) {
      var it = _step3.value;

      if (isKeyMatch(e, it)) {
        e.preventDefault();
        it.callback(e);
        return;
      }
    } // 如果没有，触发默认事件


    this.emitter.emit(this.emitter.EVENT_KEY_DOWN, e);
  };

  _proto.getEventType = function getEventType(event) {
    switch (event) {
      case 'change':
        return this.emitter.EVENT_CHANGE;

      case 'fullscreen':
        return this.emitter.EVENT_FULL_SCREEN;

      case 'viewchange':
        return this.emitter.EVENT_VIEW_CHANGE;

      case 'keydown':
        return this.emitter.EVENT_KEY_DOWN;

      case 'editor_keydown':
        return this.emitter.EVENT_EDITOR_KEY_DOWN;

      case 'blur':
        return this.emitter.EVENT_BLUR;

      case 'focus':
        return this.emitter.EVENT_FOCUS;

      case 'scroll':
        return this.emitter.EVENT_SCROLL;
    }
  }
  /**
   * Listen events
   * @param {EditorEvent} event Event type
   * @param {any} cb Callback
   */
  ;

  _proto.on = function on(event, cb) {
    var eventType = this.getEventType(event);

    if (eventType) {
      this.emitter.on(eventType, cb);
    }
  }
  /**
   * Un-listen events
   * @param {EditorEvent} event Event type
   * @param {any} cb Callback
   */
  ;

  _proto.off = function off(event, cb) {
    var eventType = this.getEventType(event);

    if (eventType) {
      this.emitter.off(eventType, cb);
    }
  }
  /**
   * Set view property
   * Can show or hide: editor, preview, menu
   * @param {object} to
   */
  ;

  _proto.setView = function setView(to) {
    var _this11 = this;

    var newView = _extends({}, this.state.view, to);

    this.setState({
      view: newView
    }, function () {
      _this11.emitter.emit(_this11.emitter.EVENT_VIEW_CHANGE, newView);
    });
  }
  /**
   * Get view property
   * @return {object}
   */
  ;

  _proto.getView = function getView() {
    return _extends({}, this.state.view);
  }
  /**
   * Enter or exit full screen
   * @param {boolean} enable
   */
  ;

  _proto.fullScreen = function fullScreen(enable) {
    var _this12 = this;

    if (this.state.fullScreen !== enable) {
      this.setState({
        fullScreen: enable
      }, function () {
        _this12.emitter.emit(_this12.emitter.EVENT_FULL_SCREEN, enable);
      });
    }
  }
  /**
   * Register a plugin API
   * @param {string} name API name
   * @param {any} cb callback
   */
  ;

  _proto.registerPluginApi = function registerPluginApi(name, cb) {
    this.pluginApis.set(name, cb);
  };

  _proto.unregisterPluginApi = function unregisterPluginApi(name) {
    this.pluginApis.delete(name);
  }
  /**
   * Call a plugin API
   * @param {string} name API name
   * @param {any} others arguments
   * @returns {any}
   */
  ;

  _proto.callPluginApi = function callPluginApi(name) {
    var handler = this.pluginApis.get(name);

    if (!handler) {
      throw new Error("API " + name + " not found");
    }

    for (var _len = arguments.length, others = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      others[_key - 1] = arguments[_key];
    }

    return handler.apply(void 0, others);
  }
  /**
   * Is full screen
   * @return {boolean}
   */
  ;

  _proto.isFullScreen = function isFullScreen() {
    return this.state.fullScreen;
  };

  _proto.uploadWithDataTransfer = function uploadWithDataTransfer(items) {
    var _this13 = this;

    var onImageUpload = this.config.onImageUpload;

    if (!onImageUpload) {
      return;
    }

    var queue = [];
    Array.prototype.forEach.call(items, function (it) {
      if (it.kind === 'file' && it.type.includes('image')) {
        var file = it.getAsFile();

        if (file) {
          var placeholder = getUploadPlaceholder(file, onImageUpload);
          queue.push(Promise.resolve(placeholder.placeholder));
          placeholder.uploaded.then(function (str) {
            var text = _this13.getMdValue().replace(placeholder.placeholder, str);

            var offset = str.length - placeholder.placeholder.length; // 计算出替换后的光标位置

            var selection = _this13.getSelection();

            _this13.setText(text, undefined, {
              start: selection.start + offset,
              end: selection.start + offset
            });
          });
        }
      } else if (it.kind === 'string' && it.type === 'text/plain') {
        queue.push(new Promise(function (resolve) {
          return it.getAsString(resolve);
        }));
      }
    });
    Promise.all(queue).then(function (res) {
      var text = res.join('');

      var selection = _this13.getSelection();

      _this13.insertText(text, true, {
        start: selection.start === selection.end ? text.length : 0,
        end: text.length
      });
    });
  };

  _proto.render = function render() {
    var _this14 = this;

    var _this$state = this.state,
        view = _this$state.view,
        fullScreen = _this$state.fullScreen,
        text = _this$state.text,
        html = _this$state.html;
    var _this$props = this.props,
        id = _this$props.id,
        _this$props$className = _this$props.className,
        className = _this$props$className === void 0 ? '' : _this$props$className,
        style = _this$props.style,
        _this$props$name = _this$props.name,
        name = _this$props$name === void 0 ? 'textarea' : _this$props$name,
        autoFocus = _this$props.autoFocus,
        placeholder = _this$props.placeholder,
        readOnly = _this$props.readOnly;
    var showHideMenu = this.config.canView && this.config.canView.hideMenu && !this.config.canView.menu;

    var getPluginAt = function getPluginAt(at) {
      return _this14.state.plugins[at] || [];
    };

    var isShowMenu = !!view.menu;
    var editorId = id ? id + "_md" : undefined;
    var previewerId = id ? id + "_html" : undefined;
    return /*#__PURE__*/React.createElement("div", {
      id: id,
      className: "rc-md-editor " + (fullScreen ? 'full' : '') + " " + className,
      style: style,
      onKeyDown: this.handleKeyDown,
      onDrop: this.handleDrop
    }, /*#__PURE__*/React.createElement(NavigationBar, {
      visible: isShowMenu,
      left: getPluginAt('left'),
      right: getPluginAt('right')
    }), /*#__PURE__*/React.createElement("div", {
      className: "editor-container"
    }, showHideMenu && /*#__PURE__*/React.createElement(ToolBar, null, /*#__PURE__*/React.createElement("span", {
      className: "button button-type-menu",
      title: isShowMenu ? 'hidden menu' : 'show menu',
      onClick: this.handleToggleMenu
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "expand-" + (isShowMenu ? 'less' : 'more')
    }))), /*#__PURE__*/React.createElement("section", {
      className: "section sec-md " + (view.md ? 'visible' : 'in-visible')
    }, /*#__PURE__*/React.createElement("textarea", {
      id: editorId,
      ref: this.nodeMdText,
      name: name,
      autoFocus: autoFocus,
      placeholder: placeholder,
      readOnly: readOnly,
      value: text,
      className: "section-container input " + (this.config.markdownClass || ''),
      wrap: "hard",
      onChange: this.handleChange,
      onScroll: this.handleInputScroll,
      onMouseOver: function onMouseOver() {
        return _this14.shouldSyncScroll = 'md';
      },
      onKeyDown: this.handleEditorKeyDown,
      onCompositionStart: function onCompositionStart() {
        return _this14.composing = true;
      },
      onCompositionEnd: function onCompositionEnd() {
        return _this14.composing = false;
      },
      onPaste: this.handlePaste,
      onFocus: this.handleFocus,
      onBlur: this.handleBlur
    })), /*#__PURE__*/React.createElement("section", {
      className: "section sec-html " + (view.html ? 'visible' : 'in-visible')
    }, /*#__PURE__*/React.createElement("div", {
      id: previewerId,
      className: "section-container html-wrap",
      ref: this.nodeMdPreviewWrapper,
      onMouseOver: function onMouseOver() {
        return _this14.shouldSyncScroll = 'html';
      },
      onScroll: this.handlePreviewScroll
    }, /*#__PURE__*/React.createElement(HtmlRender, {
      html: html,
      className: this.config.htmlClass,
      ref: this.nodeMdPreview
    })))));
  };

  return Editor;
}(React.Component);

Editor.plugins = [];
Editor.addLocale = i18n.add.bind(i18n);
Editor.useLocale = i18n.setCurrent.bind(i18n);
Editor.getLocale = i18n.getCurrent.bind(i18n);
export default Editor;