import Icon from 'components/Icon';
import NavigationBar from 'components/NavigationBar';
import ToolBar from 'components/ToolBar';
import * as React from 'react';
import emitter from 'share/emitter';
import { EditorConfig, initialSelection, KeyboardEventListener, Selection } from 'share/var';
import getDecorated from 'utils/decorate';
import mergeConfig from 'utils/mergeConfig';
import * as tool from 'utils/tool';
import defaultConfig from './defaultConfig';
import './index.less';
import { HtmlCode, HtmlRender, HtmlType } from './preview';

type Plugin = { comp: any; config: any };

interface EditorProps extends EditorConfig {
  value: string;
  renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType);
  style?: React.CSSProperties;
  config?: any;
  // Configs
  onChange?: (
    data: {
      text: string;
      html: string;
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
}

interface EditorState {
  text: string;
  html: HtmlType;
  htmlType: 'render' | 'source';
  fullScreen: boolean;
  view: {
    menu: boolean;
    md: boolean;
    html: boolean;
    fullScreen: boolean;
  };
  table: {
    maxRow: number;
    maxCol: number;
  };
}

class Editor extends React.Component<EditorProps, EditorState> {
  static defaultProps = {
    value: '',
    onBeforeClear(this: Editor): Promise<boolean> {
      return new Promise(resolve => {
        if (window.confirm && typeof window.confirm === 'function') {
          const result = window.confirm(this.config.clearTip);
          const toClear = result ? true : false;
          resolve(toClear);
        } else {
          resolve(true);
        }
      });
    },
  };

  private config: EditorConfig;

  private nodeMdText: React.RefObject<HTMLTextAreaElement>;
  private nodeMdPreview?: HtmlCode | HtmlRender;
  private nodeMdPreviewWraper: React.RefObject<HTMLDivElement>;

  private hasContentChanged = true;

  private handleInputScroll: () => void;
  private handlePreviewScroll: () => void;

  private static plugins: Plugin[] = [];
  static use(comp: any, config: any = {}) {
    Editor.plugins.push({ comp, config });
  }

  constructor(props: any) {
    super(props);

    this.config = mergeConfig(defaultConfig, this.props.config, this.props);

    this.state = {
      text: (this.props.value || '').replace(/↵/g, '\n'),
      html: '',
      view: this.config.view || defaultConfig.view!,
      htmlType: 'render', // 'render' 'source'
      fullScreen: false,
      table: this.config.table || defaultConfig.table!,
    };

    this.nodeMdText = React.createRef();
    this.nodeMdPreviewWraper = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleToggleFullScreen = this.handleToggleFullScreen.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleMdPreview = this.handleMdPreview.bind(this);
    this.handleHtmlPreview = this.handleHtmlPreview.bind(this);
    this.handleToggleHtmlType = this.handleToggleHtmlType.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.handleInputScroll = this.handleSyncScroll.bind(this, 'input');
    this.handlePreviewScroll = this.handleSyncScroll.bind(this, 'preview');
  }

  componentDidMount() {
    this.renderHTML(this.props.value || '');
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.value !== this.props.value) {
      let value = this.props.value;
      if (typeof value !== 'string') {
        value = String(value).toString();
      }
      value = value.replace(/↵/g, '\n');
      this.setState({
        text: value,
      });
      this.renderHTML(value);
    }
  }

  // 左右同步滚动
  private scrollScale = 1;
  private isSyncingScroll = false;
  private shouldSyncScroll: 'input' | 'preview' = 'input';
  private handleSyncScroll(type: 'input' | 'preview') {
    // 防止死循环
    if (type !== this.shouldSyncScroll) {
      return;
    }
    const { syncScrollMode = [] } = this.config;
    // 根据配置，看看是否需要同步滚动
    if (!syncScrollMode.includes(type === 'input' ? 'rightFollowLeft' : 'leftFollowRight')) {
      return;
    }
    if (this.hasContentChanged && this.nodeMdText.current && this.nodeMdPreview) {
      // 计算出左右的比例
      this.scrollScale = this.nodeMdText.current.scrollHeight / this.nodeMdPreview.getHeight();
      this.hasContentChanged = false;
    }
    if (!this.isSyncingScroll) {
      this.isSyncingScroll = true;
      requestAnimationFrame(() => {
        if (this.nodeMdText.current && this.nodeMdPreviewWraper.current) {
          if (type === 'input') {
            // left to right
            this.nodeMdPreviewWraper.current.scrollTop = this.nodeMdText.current.scrollTop / this.scrollScale;
          } else {
            // right to left
            this.nodeMdText.current.scrollTop = this.nodeMdPreviewWraper.current.scrollTop * this.scrollScale;
          }
        }
        this.isSyncingScroll = false;
      });
    }
  }

  private renderHTML(markdownText: string): Promise<void> {
    if (!this.props.renderHTML) {
      console.error('renderHTML props is required!');
      return Promise.resolve();
    }
    const res = this.props.renderHTML(markdownText);
    if (tool.isPromise(res)) {
      // @ts-ignore
      return res.then((r: HtmlType) => this.setHtml(r));
    } else if (typeof res === 'function') {
      return this.setHtml(res());
    } else {
      return this.setHtml(res);
    }
  }

  private setHtml(html: HtmlType): Promise<void> {
    return new Promise(resolve => {
      this.setState({ html }, resolve);
    });
  }

  private handleToggleFullScreen() {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  }

  private changeView(to: any) {
    const view = { ...this.state.view, ...to };
    this.setState({
      view,
    });
  }

  private handleToggleMenu() {
    this.changeView({
      menu: !this.state.view.menu,
    });
  }

  private handleToggleView(type: 'md' | 'html') {
    if (type === 'md') {
      this.changeView({
        md: false,
        html: true,
      });
    } else {
      this.changeView({
        md: true,
        html: false,
      });
    }
  }

  private handleMdPreview() {
    this.changeView({
      html: !this.state.view.html,
    });
  }

  private handleHtmlPreview() {
    this.changeView({
      md: !this.state.view.md,
    });
  }

  private handleToggleHtmlType() {
    let { htmlType } = this.state;
    if (htmlType === 'render') {
      htmlType = 'source';
    } else if (htmlType === 'source') {
      htmlType = 'render';
    }
    this.setState({
      htmlType,
    });
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.persist();
    const value = e.target.value;
    if (!this.hasContentChanged) {
      this.hasContentChanged = true;
    }
    // 触发内部事件
    emitter.emit(emitter.EVENT_CHANGE, value, e, false);
    this.setText(value, e);
  }

  /**
   * 清除已选择区域
   */
  clearSelection() {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(0, 0, 'none');
    }
  }

  /**
   * 获取已选择区域
   * @return {Selection}
   */
  getSelection(): Selection {
    const source = this.nodeMdText.current;
    if (!source) {
      return { ...initialSelection };
    }
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const text = (source.value || '').slice(start, end);
    return {
      start,
      end,
      text,
    };
  }

  /**
   * 设置已选择区域
   * @param {Selection} to
   */
  setSelection(to: Selection) {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(to.start, to.end, 'forward');
      this.nodeMdText.current.focus();
      to.text = this.nodeMdText.current.value.substr(to.start, to.end - to.start);
    }
  }

  /**
   * 插入Markdown语法
   * @param type
   * @param option
   */
  insertMarkdown(type: string, option: any = {}) {
    const selection = this.getSelection();
    let decorateOption = option ? { ...option } : {};
    if (type === 'image') {
      decorateOption = {
        ...decorateOption,
        target: option.target || '',
        imageUrl: option.imageUrl || this.config.imageUrl,
      };
    }
    if (type === 'link') {
      decorateOption = {
        ...decorateOption,
        linkUrl: this.config.linkUrl,
      };
    }
    const decorate = getDecorated(selection.text, type, decorateOption);
    this.insertText(decorate.text, !!decorate.selection, decorate.selection);
  }

  /**
   * 插入文本
   * @param {string} value 要插入的文本
   * @param {boolean} replaceSelected 是否替换掉当前选择的文本
   * @param {Selection} newSelection 新的选择区域
   */
  insertText(value: string = '', replaceSelected: boolean = false, newSelection?: { start: number; end: number }) {
    const { text = '' } = this.state;
    const selection = this.getSelection();
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(replaceSelected ? selection.start : selection.end, text.length);

    this.setText(
      beforeContent + value + afterContent,
      undefined,
      newSelection
        ? {
            start: newSelection.start + beforeContent.length,
            end: newSelection.end + beforeContent.length,
            text: '',
          }
        : {
            start: beforeContent.length,
            end: beforeContent.length,
            text: '',
          },
    );
  }

  /**
   * 设置文本，同时触发onChange
   * 注意避免在onChange里面调用此方法，以免造成死循环
   * @param {string} value
   * @param {any} event
   */
  setText(value: string = '', event?: React.ChangeEvent<HTMLTextAreaElement>, newSelection?: Selection) {
    const text = value.replace(/↵/g, '\n');
    if (this.state.text === value) {
      return;
    }
    emitter.emit(emitter.EVENT_CHANGE, value, event, true);
    this.setState(
      {
        text: value,
      },
      () => {
        if (newSelection) {
          setTimeout(() => this.setSelection(newSelection));
        }
      },
    );
    this.renderHTML(text).then(() => {
      if (this.props.onChange) {
        this.props.onChange({ text, html: this.getHtmlValue() }, event);
      }
    });
  }

  private _isKeyMatch(event: React.KeyboardEvent<HTMLDivElement>, keyCode: number, key?: string, withKey?: any) {
    if (withKey && withKey.length > 0) {
      for (const it of withKey) {
        // @ts-ignore
        if (typeof event[it] !== 'undefined' && !event[it]) {
          return false;
        }
      }
    }
    if (event.key) {
      return event.key === key;
    } else {
      return event.keyCode === keyCode;
    }
  }
  /**
   * 其他事件监听
   */
  private getEventType(event: string) {
    switch (event) {
      case 'change':
        return emitter.EVENT_CHANGE;
    }
  }
  on(event: 'change', cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.on(eventType, cb);
    }
  }
  off(event: 'change', cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.off(eventType, cb);
    }
  }

  /**
   * 监听键盘事件
   */
  private keyboardListeners: KeyboardEventListener[] = [];
  onKeyboard(data: KeyboardEventListener) {
    if (!this.keyboardListeners.includes(data)) {
      this.keyboardListeners.push(data);
    }
  }
  offKeyboard(data: KeyboardEventListener) {
    const index = this.keyboardListeners.indexOf(data);
    if (index >= 0) {
      this.keyboardListeners.splice(index, 1);
    }
  }

  private handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // 遍历监听数组，找找有没有被监听
    for (const it of this.keyboardListeners) {
      if (this._isKeyMatch(e, it.keyCode, it.key, it.withKey)) {
        e.preventDefault();
        it.callback(e);
        return;
      }
    }
  }

  /**
   * 获取文本值
   * @return {string}
   */
  getMdValue(): string {
    return this.state.text;
  }

  /**
   * 获取渲染后的HTML
   * @returns {string}
   */
  getHtmlValue(): string {
    if (typeof this.state.html === 'string') {
      return this.state.html;
    } else {
      if (this.nodeMdPreview) {
        return this.nodeMdPreview.getHtml();
      } else {
        return '';
      }
    }
  }

  /**
   * 监听粘贴事件，实现自动上传图片
   */
  handlePaste(e: React.SyntheticEvent) {
    if (!this.config.allowPasteImage) {
      return;
    }
    const onPasteImage = this.config.onPasteImage || defaultConfig.onPasteImage!;
    e.preventDefault();
    const event = e.nativeEvent as ClipboardEvent;
    const items = (event.clipboardData || window.clipboardData).items as DataTransferItemList;
    const queue: Promise<string>[] = [];
    Array.prototype.forEach.call(items, (it: DataTransferItem) => {
      if (it.kind === 'file' && it.type.includes('image')) {
        const file = it.getAsFile();
        if (file) {
          queue.push(
            onPasteImage(file)
              .then(url =>
                getDecorated('', 'image', {
                  target: file.name || '',
                  imageUrl: url,
                }),
              )
              .then(decorated => decorated.text),
          );
        }
      } else {
        queue.push(new Promise(resolve => it.getAsString(resolve)));
      }
    });
    Promise.all(queue).then(res => {
      const text = res.join('');
      this.insertText(text, true);
    });
  }

  render() {
    const { view, fullScreen } = this.state;
    const renderContent = () => {
      const { html, text, htmlType } = this.state;
      const res = [];
      if (view.md) {
        res.push(
          <section className={'sec-md'} key="md">
            <ToolBar>
              <span
                className="button button-type-menu"
                title={view.menu ? 'Hide menu' : 'Show menu'}
                onClick={this.handleToggleMenu}
              >
                {view.menu ? <Icon type="icon-chevron-up" /> : <Icon type="icon-chevron-down" />}
              </span>
              <span
                className="button button-type-preview"
                title={view.html ? 'Hide preview' : 'Show preview'}
                onClick={this.handleMdPreview}
              >
                {view.html ? <Icon type="icon-desktop" /> : <Icon type="icon-columns" />}
              </span>
              <span className="button button-type-md" title={'Preview'} onClick={() => this.handleToggleView('md')}>
                <Icon type="icon-refresh" />
              </span>
            </ToolBar>
            <textarea
              id="textarea"
              ref={this.nodeMdText}
              name={this.props.name || 'textarea'}
              value={text}
              className={`input ${this.config.markdownClass || ''}`}
              wrap="hard"
              onChange={this.handleChange}
              onScroll={this.handleInputScroll}
              onMouseOver={() => (this.shouldSyncScroll = 'input')}
              onPaste={this.handlePaste}
            />
          </section>,
        );
      }
      if (view.html) {
        res.push(
          <section className={'sec-html'} key="html">
            <ToolBar style={{ right: '20px' }}>
              <span
                className="button button-type-menu"
                title={view.menu ? 'hidden menu' : 'show menu'}
                onClick={this.handleToggleMenu}
              >
                {view.menu ? <Icon type="icon-chevron-up" /> : <Icon type="icon-chevron-down" />}
              </span>
              <span
                className="button button-type-editor"
                title={view.md ? 'Hide editor' : 'Show editor'}
                onClick={this.handleHtmlPreview}
              >
                {view.md ? <Icon type="icon-desktop" /> : <Icon type="icon-columns" />}
              </span>
              <span
                className="button button-type-toggle"
                title={'Toggle'}
                onClick={() => this.handleToggleView('html')}
              >
                <Icon type="icon-refresh" />
              </span>
              <span className="button button-type-html" title="Show HTML" onClick={this.handleToggleHtmlType}>
                {htmlType === 'render' ? <Icon type="icon-embed" /> : <Icon type="icon-eye" />}
              </span>
            </ToolBar>
            {htmlType === 'render' ? (
              <div
                className="html-wrap"
                ref={this.nodeMdPreviewWraper}
                onMouseOver={() => (this.shouldSyncScroll = 'preview')}
                onScroll={this.handlePreviewScroll}
              >
                <HtmlRender
                  html={html}
                  className={this.config.htmlClass}
                  ref={(instance: HtmlRender) => (this.nodeMdPreview = instance)}
                />
              </div>
            ) : (
              <div
                className={'html-code-wrap'}
                ref={this.nodeMdPreviewWraper}
                onScroll={this.handlePreviewScroll}
                onMouseOver={() => (this.shouldSyncScroll = 'preview')}
              >
                <HtmlCode
                  html={html}
                  className={this.config.htmlClass}
                  ref={(instance: HtmlCode) => (this.nodeMdPreview = instance)}
                />
              </div>
            )}
          </section>,
        );
      }
      return res;
    };
    return (
      <div
        className={`rc-md-editor ${fullScreen ? 'full' : ''}`}
        style={this.props.style}
        onKeyDown={this.handleKeyDown}
      >
        {view.menu && (
          <NavigationBar
            left={
              <div className="button-wrap">
                {Editor.plugins.map(it => {
                  return React.createElement(it.comp, {
                    editor: this,
                    editorConfig: this.config,
                    config: it.config,
                    key: it.comp.name,
                  });
                })}
              </div>
            }
            right={
              <div className="button-wrap">
                {view.fullScreen && (
                  <span
                    className="button button-type-fullscreen"
                    title="Full screen"
                    onClick={this.handleToggleFullScreen}
                  >
                    {fullScreen ? <Icon type="icon-shrink" /> : <Icon type="icon-enlarge" />}
                  </span>
                )}
              </div>
            }
          />
        )}
        <div className="editor-container">{renderContent()}</div>
      </div>
    );
  }
}

export default Editor;
