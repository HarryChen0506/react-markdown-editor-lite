import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from './Plugin';

interface FullScreenState {
  enable: boolean;
}

export default class FullScreen extends PluginComponent<FullScreenState> {
  static pluginName = 'full-screen';
  static align = 'right';

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      enable: this.editor.isFullScreen(),
    };
  }

  private handleClick() {
    this.editor.fullScreen(!this.state.enable);
  }

  private handleChange(enable: boolean) {
    this.setState({ enable });
  }

  componentDidMount() {
    this.editor.on('fullscreen', this.handleChange);
  }

  componentWillUnmount() {
    this.editor.off('fullscreen', this.handleChange);
  }

  render() {
    if (this.editorConfig.canView && this.editorConfig.canView.fullScreen) {
      const { enable } = this.state;
      return (
        <span
          className="button button-type-fullscreen"
          title={i18n.get(enable ? 'btnExitFullScreen' : 'btnFullScreen')}
          onClick={this.handleClick}
        >
          <Icon type={enable ? 'fullscreen-exit' : 'fullscreen'} />
        </span>
      );
    } else {
      return null;
    }
  }
}
