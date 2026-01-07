"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../components/Icon"));

var _i18n = _interopRequireDefault(require("../i18n"));

var _Plugin = require("./Plugin");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var NEXT_ACTION;

(function (NEXT_ACTION) {
  NEXT_ACTION[NEXT_ACTION["SHOW_ALL"] = 0] = "SHOW_ALL";
  NEXT_ACTION[NEXT_ACTION["SHOW_MD"] = 1] = "SHOW_MD";
  NEXT_ACTION[NEXT_ACTION["SHOW_HTML"] = 2] = "SHOW_HTML";
})(NEXT_ACTION || (NEXT_ACTION = {}));

var ModeToggle = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(ModeToggle, _PluginComponent);

  function ModeToggle(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleChange = _this.handleChange.bind((0, _assertThisInitialized2.default)(_this));
    _this.state = {
      view: _this.editor.getView()
    };
    return _this;
  }

  var _proto = ModeToggle.prototype;

  _proto.handleClick = function handleClick() {
    switch (this.next) {
      case NEXT_ACTION.SHOW_ALL:
        this.editor.setView({
          html: true,
          md: true
        });
        break;

      case NEXT_ACTION.SHOW_HTML:
        this.editor.setView({
          html: true,
          md: false
        });
        break;

      case NEXT_ACTION.SHOW_MD:
        this.editor.setView({
          html: false,
          md: true
        });
        break;
    }
  };

  _proto.handleChange = function handleChange(view) {
    this.setState({
      view: view
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('viewchange', this.handleChange);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('viewchange', this.handleChange);
  };

  _proto.getDisplayInfo = function getDisplayInfo() {
    var next = this.next;

    switch (next) {
      case NEXT_ACTION.SHOW_ALL:
        return {
          icon: 'view-split',
          title: 'All'
        };

      case NEXT_ACTION.SHOW_HTML:
        return {
          icon: 'visibility',
          title: 'Preview'
        };

      default:
        return {
          icon: 'keyboard',
          title: 'Editor'
        };
    }
  };

  _proto.render = function render() {
    if (this.isDisplay) {
      var display = this.getDisplayInfo();
      return /*#__PURE__*/React.createElement("span", {
        className: "button button-type-mode",
        title: _i18n.default.get("btnMode" + display.title),
        onClick: this.handleClick
      }, /*#__PURE__*/React.createElement(_Icon.default, {
        type: display.icon
      }));
    }

    return null;
  };

  (0, _createClass2.default)(ModeToggle, [{
    key: "isDisplay",
    get: function get() {
      var canView = this.editorConfig.canView;

      if (canView) {
        // 至少有两种情况可以显示的时候，才会显示切换按钮
        return [canView.html, canView.md, canView.both].filter(function (it) {
          return it;
        }).length >= 2;
      }

      return false;
    }
    /**
     * 显示标准：
     * 两个都显示的时候，点击显示MD，隐藏HTML
     * 只显示HTML的时候，点击全部显示
     * 只显示MD的时候，点击显示HTML，隐藏MD
     * 如果当前标准因canView不可用，则顺延至下一个
     * 如果都不可用，则返回当前状态
     */

  }, {
    key: "next",
    get: function get() {
      var canView = this.editorConfig.canView;
      var view = this.state.view;
      var actions = [NEXT_ACTION.SHOW_ALL, NEXT_ACTION.SHOW_MD, NEXT_ACTION.SHOW_HTML];

      if (canView) {
        if (!canView.both) {
          actions.splice(actions.indexOf(NEXT_ACTION.SHOW_ALL), 1);
        }

        if (!canView.md) {
          actions.splice(actions.indexOf(NEXT_ACTION.SHOW_MD), 1);
        }

        if (!canView.html) {
          actions.splice(actions.indexOf(NEXT_ACTION.SHOW_HTML), 1);
        }
      }

      var current = NEXT_ACTION.SHOW_MD;

      if (view.html) {
        current = NEXT_ACTION.SHOW_HTML;
      }

      if (view.html && view.md) {
        current = NEXT_ACTION.SHOW_ALL;
      }

      if (actions.length === 0) return current;
      if (actions.length === 1) return actions[0];
      var index = actions.indexOf(current);
      return index < actions.length - 1 ? actions[index + 1] : actions[0];
    }
  }]);
  return ModeToggle;
}(_Plugin.PluginComponent);

ModeToggle.pluginName = 'mode-toggle';
ModeToggle.align = 'right';
var _default = ModeToggle;
exports.default = _default;