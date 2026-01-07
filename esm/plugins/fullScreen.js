import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../components/Icon';
import i18n from '../i18n';
import { PluginComponent } from './Plugin';

var FullScreen = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(FullScreen, _PluginComponent);

  function FullScreen(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_this));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.state = {
      enable: _this.editor.isFullScreen()
    };
    return _this;
  }

  var _proto = FullScreen.prototype;

  _proto.handleClick = function handleClick() {
    this.editor.fullScreen(!this.state.enable);
  };

  _proto.handleChange = function handleChange(enable) {
    this.setState({
      enable: enable
    });
  };

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('fullscreen', this.handleChange);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('fullscreen', this.handleChange);
  };

  _proto.render = function render() {
    if (this.editorConfig.canView && this.editorConfig.canView.fullScreen) {
      var enable = this.state.enable;
      return /*#__PURE__*/React.createElement("span", {
        className: "button button-type-fullscreen",
        title: i18n.get(enable ? 'btnExitFullScreen' : 'btnFullScreen'),
        onClick: this.handleClick
      }, /*#__PURE__*/React.createElement(Icon, {
        type: enable ? 'fullscreen-exit' : 'fullscreen'
      }));
    }

    return null;
  };

  return FullScreen;
}(PluginComponent);

FullScreen.pluginName = 'full-screen';
FullScreen.align = 'right';
export { FullScreen as default };