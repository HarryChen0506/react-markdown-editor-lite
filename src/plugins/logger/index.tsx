import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from 'src/plugins/Plugin';
import { KeyboardEventListener } from 'src/share/var';
import LoggerPlugin from './logger';

const LOGGER_INTERVAL = 600;

export default class Logger extends PluginComponent {
  static pluginName = 'logger';

  private logger: LoggerPlugin;
  private timerId?: number;
  private handleKeyboards: KeyboardEventListener[] = [];
  private lastPop: string | null = null;

  constructor(props: any) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleRedo = this.handleRedo.bind(this);
    this.handleUndo = this.handleUndo.bind(this);
    // Mac的Redo比较特殊，是Command+Shift+Z，优先处理
    this.handleKeyboards = [
      { key: 'y', keyCode: 89, withKey: ['ctrlKey'], callback: this.handleRedo },
      { key: 'z', keyCode: 90, withKey: ['metaKey', 'shiftKey'], callback: this.handleRedo },
      { key: 'z', keyCode: 90, withKey: ['ctrlKey'], callback: this.handleUndo },
      { key: 'z', keyCode: 90, withKey: ['metaKey'], callback: this.handleUndo },
    ];

    this.logger = new LoggerPlugin();
  }

  private handleUndo() {
    const last = this.logger.undo(this.editor.getMdValue());
    if (typeof last !== 'undefined') {
      this.pause();
      this.lastPop = last;
      this.editor.setText(last);
      this.forceUpdate();
    }
  }

  private handleRedo() {
    const last = this.logger.redo();
    if (typeof last !== 'undefined') {
      this.lastPop = last;
      this.editor.setText(last);
      this.forceUpdate();
    }
  }

  handleChange(value: string, e: any, isChange: boolean) {
    if (this.logger.getLast() === value || (this.lastPop !== null && this.lastPop === value)) {
      return;
    }
    this.logger.cleanRedo();
    if (isChange) {
      this.logger.push(value);
      this.lastPop = null;
      this.forceUpdate();
      return;
    }
    if (this.timerId) {
      window.clearTimeout(this.timerId);
      this.timerId = 0;
    }
    this.timerId = window.setTimeout(() => {
      if (this.logger.getLast() !== value) {
        this.logger.push(value);
        this.lastPop = null;
        this.forceUpdate();
      }
      window.clearTimeout(this.timerId);
      this.timerId = 0;
    }, LOGGER_INTERVAL);
  }

  componentDidMount() {
    // 监听变化事件
    this.editor.on('change', this.handleChange);
    // 监听键盘事件
    this.handleKeyboards.forEach(it => this.editor.onKeyboard(it));
    // 初始化时，把已有值填充进logger
    this.logger.initValue = this.editor.getMdValue();
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.editor.off('change', this.handleChange);
    this.handleKeyboards.forEach(it => this.editor.offKeyboard(it));
  }

  pause() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = undefined;
    }
  }

  render() {
    const hasUndo = this.logger.getUndoCount() > 1 || this.logger.initValue !== this.editor.getMdValue();
    const hasRedo = this.logger.getRedoCount() > 0;
    return (
      <React.Fragment>
        <span
          className={`button button-type-undo ${hasUndo ? '' : 'disabled'}`}
          title={i18n.get('btnUndo')}
          onClick={this.handleUndo}
        >
          <Icon type="undo" />
        </span>
        <span
          className={`button button-type-redo ${hasRedo ? '' : 'disabled'}`}
          title={i18n.get('btnRedo')}
          onClick={this.handleRedo}
        >
          <Icon type="redo" />
        </span>
      </React.Fragment>
    );
  }
}
