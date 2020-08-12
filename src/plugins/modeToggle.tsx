import * as React from 'react';
import Icon from '../components/Icon';
import i18n from '../i18n';
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
    const { canView } = this.editorConfig;
    if (canView) {
      // 至少有两种情况可以显示的时候，才会显示切换按钮
      return [canView.html, canView.md, canView.both].filter(it => it).length >= 2;
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
  private get next(): NEXT_ACTION {
    const { canView } = this.editorConfig;
    const { view } = this.state;

    const actions = [NEXT_ACTION.SHOW_ALL, NEXT_ACTION.SHOW_MD, NEXT_ACTION.SHOW_HTML];

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

    let current = NEXT_ACTION.SHOW_MD;
    if (view.html) {
      current = NEXT_ACTION.SHOW_HTML;
    }
    if (view.html && view.md) {
      current = NEXT_ACTION.SHOW_ALL;
    }

    if (actions.length === 0) return current;
    if (actions.length === 1) return actions[0];

    const index = actions.indexOf(current);
    return index < actions.length - 1 ? actions[index + 1] : actions[0];
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
