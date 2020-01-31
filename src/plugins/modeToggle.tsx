import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from './Plugin';

interface ModeToggleState {
  view: {
    html: boolean;
    md: boolean;
  };
}

enum NEXT_ACTION {
  SHOW_ALL,
  SHOW_MD,
  SHOW_HTML,
}

export default class ModeToggle extends PluginComponent<ModeToggleState> {
  static pluginName = 'mode-toggle';
  static align = 'right';

  private get isDisplay() {
    if (this.editorConfig.canView) {
      return this.editorConfig.canView.html && this.editorConfig.canView.md;
    }
    return false;
  }

  /**
   * 显示标准：
   * 两个都显示的时候，点击显示MD，隐藏HTML
   * 只显示HTML的时候，点击全部显示
   * 只显示MD的时候，点击显示HTML，隐藏MD
   */
  private get next(): NEXT_ACTION {
    const { view } = this.state;
    if (view.html && view.md) {
      return NEXT_ACTION.SHOW_MD;
    } else if (!this.state.view.html) {
      return NEXT_ACTION.SHOW_HTML;
    } else {
      return NEXT_ACTION.SHOW_ALL;
    }
  }

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      view: this.editor.getView(),
    };
  }

  private handleClick() {
    switch (this.next) {
      case NEXT_ACTION.SHOW_ALL:
        this.editor.setView({
          html: true,
          md: true,
        });
        break;
      case NEXT_ACTION.SHOW_HTML:
        this.editor.setView({
          html: true,
          md: false,
        });
        break;
      case NEXT_ACTION.SHOW_MD:
        this.editor.setView({
          html: false,
          md: true,
        });
        break;
    }
  }

  private handleChange(view: { html: boolean; md: boolean }) {
    this.setState({ view });
  }

  componentDidMount() {
    this.editor.on('viewchange', this.handleChange);
  }

  componentWillUnmount() {
    this.editor.off('viewchange', this.handleChange);
  }

  getDisplayInfo() {
    const next = this.next;
    switch (next) {
      case NEXT_ACTION.SHOW_ALL:
        return {
          icon: 'view-split',
          title: 'All',
        };
      case NEXT_ACTION.SHOW_HTML:
        return {
          icon: 'visibility',
          title: 'Preview',
        };
      default:
        return {
          icon: 'keyboard',
          title: 'Editor',
        };
    }
  }

  render() {
    if (this.isDisplay) {
      const display = this.getDisplayInfo();
      return (
        <span
          className="button button-type-mode"
          title={i18n.get('btnMode' + display.title)}
          onClick={this.handleClick}
        >
          <Icon type={display.icon} />
        </span>
      );
    } else {
      return null;
    }
  }
}
