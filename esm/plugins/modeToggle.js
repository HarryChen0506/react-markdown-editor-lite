import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../components/Icon';
import i18n from '../i18n';
import { PluginComponent } from './Plugin';
var NEXT_ACTION;

(function (NEXT_ACTION) {
  NEXT_ACTION[NEXT_ACTION["SHOW_ALL"] = 0] = "SHOW_ALL";
  NEXT_ACTION[NEXT_ACTION["SHOW_MD"] = 1] = "SHOW_MD";
  NEXT_ACTION[NEXT_ACTION["SHOW_HTML"] = 2] = "SHOW_HTML";
})(NEXT_ACTION || (NEXT_ACTION = {}));

var ModeToggle = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(ModeToggle, _PluginComponent);

  function ModeToggle(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
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
        title: i18n.get("btnMode" + display.title),
        onClick: this.handleClick
      }, /*#__PURE__*/React.createElement(Icon, {
        type: display.icon
      }));
    }

    return null;
  };

  _createClass(ModeToggle, [{
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
}(PluginComponent);

ModeToggle.pluginName = 'mode-toggle';
ModeToggle.align = 'right';
export default ModeToggle;