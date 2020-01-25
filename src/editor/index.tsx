// markdown editor
import * as React from 'react';
import Icon from '../components/Icon';
import NavigationBar from '../components/NavigationBar';
import ToolBar from '../components/ToolBar';
import emitter from '../share/emitter';
import { EditorConfig, initialSelection, KeyboardEventListener, Selection } from '../share/var';
import getDecorated from '../utils/decorate';
import mergeConfig from '../utils/mergeConfig';
import * as tool from '../utils/tool';
import defaultConfig from './defaultConfig';
import './index.less';
import { HtmlCode, HtmlRender } from './preview';

type Plugin = { comp: any; config: any };

interface EditorProps extends EditorConfig {
  value: string;
  renderHTML: (text: string) => string | Promise<string> | (() => string);
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

class Editor extends React.Component<EditorProps, any> {
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

  private scale = 0;

  private willScrollEle: 'md' | 'html' | '' = ''; // 即将滚动的元素 md html

  private hasContentChanged = true;

  private selection: Selection = { ...initialSelection };

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
      text: (this.formatString(this.props.value) || '').replace(/↵/g, '\n'),
      html: '',
      view: this.config.view,
      htmlType: 'render', // 'render' 'source'
      dropButton: {
        header: false,
        table: false,
      },
      fullScreen: false,
      table: this.config.table,
    };

    this.nodeMdText = React.createRef();
    this.nodeMdPreviewWraper = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleInputSelect = this.handleInputSelect.bind(this);
    this.handleToggleFullScreen = this.handleToggleFullScreen.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleToggleView = this.handleToggleView.bind(this);
    this.handleMdPreview = this.handleMdPreview.bind(this);
    this.handleHtmlPreview = this.handleHtmlPreview.bind(this);
    this.handleToggleHtmlType = this.handleToggleHtmlType.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.handleInputScroll = tool
      .throttle((e: any) => {
        const { syncScrollMode = [] } = this.config;
        if (!syncScrollMode.includes('rightFollowLeft')) {
          return;
        }
        e.persist();
        if (this.willScrollEle === 'md') {
          if (this.hasContentChanged) {
            this._setScrollValue();
          }
          if (this.nodeMdPreviewWraper.current && this.nodeMdText.current) {
            this.nodeMdPreviewWraper.current.scrollTop = this.nodeMdText.current.scrollTop / this.scale;
          }
        }
      }, 1000 / 60)
      .bind(this);
    this.handlePreviewScroll = tool
      .throttle((e: any) => {
        const { syncScrollMode = [] } = this.config;
        if (!syncScrollMode.includes('leftFollowRight')) {
          return;
        }
        e.persist();
        if (this.willScrollEle === 'html') {
          if (this.hasContentChanged) {
            this._setScrollValue();
          }
          if (this.nodeMdText.current && this.nodeMdPreviewWraper.current)
            this.nodeMdText.current.scrollTop = this.nodeMdPreviewWraper.current.scrollTop * this.scale;
        }
      }, 1000 / 60)
      .bind(this);
  }

  componentDidMount() {
    this.renderHTML(this.props.value || '').then(html => {
      this.setState({
        html,
      });
    });
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.value === this.props.value) {
      // console.log('value not change')
      return;
    }
    let { value } = nextProps;
    value = this.formatString(value);
    value = value && value.replace(/↵/g, '\n');
    this.renderHTML(value).then(html => {
      this.setState({
        text: value,
        html,
      });
    });
  }

  private formatString(value: string) {
    if (typeof this.props.value !== 'string') {
      console.error('The type of "value" must be String!');
      return String(value).toString();
    }
    return value;
  }

  insertMarkdown(type: string, option: any = {}) {
    const { text = '' } = this.state;
    const { selection } = this;
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(selection.end, text.length);
    let decorateOption = null;
    if (type === 'image') {
      decorateOption = {
        target: option.target || '',
        imageUrl: option.imageUrl || this.config.imageUrl,
      };
    }
    if (type === 'link') {
      decorateOption = {
        linkUrl: this.config.linkUrl,
      };
    }
    const decorate = getDecorated(selection.text, type, decorateOption);
    this.setText(
      beforeContent + decorate.text + afterContent,
      undefined,
      decorate.selection
        ? {
            start: decorate.selection.start + beforeContent.length,
            end: decorate.selection.end + beforeContent.length,
            text: '',
          }
        : {
            start: beforeContent.length,
            end: beforeContent.length,
            text: '',
          },
    );
  }

  private renderHTML(markdownText: string): Promise<string> {
    if (!this.props.renderHTML) {
      console.error('renderHTML props is required!');
      return Promise.resolve('');
    }
    const res = this.props.renderHTML(markdownText);
    if (typeof res === 'string') {
      return Promise.resolve(res);
    } else if (typeof res === 'function') {
      return Promise.resolve(res() as string);
    } else if (typeof res === 'object' && typeof res.then === 'function') {
      return res;
    }
    return Promise.resolve('');
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
    emitter.emit(emitter.EVENT_CHANGE, value, e);
    this.setText(value, e);
  }

  private handleInputSelect(e: React.SyntheticEvent<HTMLTextAreaElement, Event>) {
    e.persist();
    if (!this.nodeMdText.current) {
      return;
    }
    const event = e.nativeEvent;
    const source = (event.srcElement || event.currentTarget) as HTMLTextAreaElement;
    if (source !== this.nodeMdText.current) {
      return;
    }
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const text = (source.value || '').slice(start, end);
    this.selection = {
      ...this.selection,
      start,
      end,
      text,
    };
    console.log('handleInputSelect', this.selection);
  }

  private handleScrollEle(node: 'md' | 'html') {
    this.willScrollEle = node;
  }

  private _setScrollValue() {
    // 设置值，方便 scrollBy 操作
    if (!this.nodeMdText.current || !this.nodeMdPreview || !this.nodeMdPreviewWraper.current) {
      return;
    }
    this.scale =
      (this.nodeMdText.current.scrollHeight - this.nodeMdText.current.offsetHeight + 35) /
      (this.nodeMdPreview.getHeight() - this.nodeMdPreviewWraper.current.offsetHeight + 35);
    this.hasContentChanged = false;
  }

  /**
   * 清除已选择区域
   */
  clearSelection() {
    this.selection = { ...initialSelection };
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(0, 0, 'none');
    }
  }

  /**
   * 获取已选择区域
   * @return {Selection}
   */
  getSelection() {
    return { ...this.selection };
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
    this.selection = { ...initialSelection, ...to };
    console.log('setSelection', this.selection);
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
    emitter.emit(emitter.EVENT_CHANGE, value, event);
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
    this.renderHTML(text).then(html => {
      this.setState({
        html,
      });
      if (this.props.onChange) {
        this.props.onChange({ text, html }, event);
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
  onChange(cb: (value: string, e?: React.ChangeEvent<HTMLTextAreaElement>) => void) {
    emitter.on(emitter.EVENT_CHANGE, cb);
  }
  offChange(cb: any) {
    emitter.off(emitter.EVENT_CHANGE, cb);
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
    return this.state.html;
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
              onSelect={this.handleInputSelect}
              onScroll={this.handleInputScroll}
              onMouseOver={() => this.handleScrollEle('md')}
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
                onMouseOver={() => this.handleScrollEle('html')}
                onScroll={this.handlePreviewScroll}
              >
                <HtmlRender
                  html={html}
                  className={this.config.htmlClass}
                  ref={(instance: HtmlRender) => (this.nodeMdPreview = instance)}
                />
              </div>
            ) : (
              <div className={'html-code-wrap'} ref={this.nodeMdPreviewWraper} onScroll={this.handlePreviewScroll}>
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
