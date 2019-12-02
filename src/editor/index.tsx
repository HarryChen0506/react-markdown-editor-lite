// markdown editor 
import * as React from 'react'
import * as tool from '../utils/tool'
import Logger from '../utils/logger'
import Decorate from '../utils/decorate'
import NavigationBar from '../components/NavigationBar'
import DropList from '../components/DropList'
import HeaderList from '../components/HeaderList'
import TableList from '../components/TableList'
import InputFile from '../components/InputFile'
import Icon from '../components/Icon'
import ToolBar from '../components/ToolBar'

import { HtmlRender, HtmlCode } from './preview';

import './index.less'
import defaultConfig from './defaultConfig';
import mergeConfig from '../utils/mergeConfig';

interface EditorConfig {
  theme?: string;
  name?: string;
  view?: {
    menu: boolean;
    md: boolean;
    html: boolean;
  };
  htmlClass?: string;
  markdownClass?: string;
  logger?: {
    interval: number;
  };
  synchScroll?: boolean;
  imageUrl?: string;
  imageAccept?: string;
  linkUrl?: string;
  table?: {
    maxRow: number;
    maxCol: number;
  }
  syncScrollMode?: string[];
  clearTip?: string;
}

interface EditorProps extends EditorConfig {
  value: string;
  renderHTML: (text: string) => string | Promise<string> | (() => string);
  style?: React.CSSProperties;
  config?: any;
  // Configs
  onChange?: (data: {
    text: string;
    html: string;
  }, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBeforeClear?: (this: Editor) => Promise<boolean> | boolean;
  onImageUpload?: (file: File, callback: (url: string) => void) => void;
}

class Editor extends React.Component<EditorProps, any> {
  static defaultProps = {
    value: "",
    onBeforeClear: function(this: Editor) {
      return new Promise((resolve) => {
        if (window.confirm && typeof window.confirm === 'function') {
          const result = window.confirm(this.config.clearTip)
          const toClear = result ? true : false
          resolve(toClear)
        } else {
          resolve(true)
        }
      })
    }
  };

  private config: EditorConfig;

  private logger: Logger;

  private loggerTimerId?: number;

  private nodeMdText: React.RefObject<HTMLTextAreaElement>;
  private nodeMdPreview?: HtmlCode | HtmlRender;
  private nodeMdPreviewWraper: React.RefObject<HTMLDivElement>;
  private inputFile: React.RefObject<InputFile>;

  private scale = 0

  private willScrollEle: "md" | "html" | "" = '' // 即将滚动的元素 md html

  private hasContentChanged = true

  private initialSelection = {
    isSelected: false,
    start: 0,
    end: 0,
    text: ''
  }

  private selection = { ...this.initialSelection };

  private handleInputScroll: () => void;
  private handlePreviewScroll: () => void;
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
        table: false
      },
      fullScreen: false,
      table: this.config.table
    }

    this.nodeMdText = React.createRef();
    this.nodeMdPreviewWraper = React.createRef();
    this.inputFile = React.createRef();

    this.handleChange = this.handleChange.bind(this)
    this.handleInputSelect = this.handleInputSelect.bind(this)
    this.handleImageUpload = this.handleImageUpload.bind(this)
    this.handleEmpty = this.handleEmpty.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.handleRedo = this.handleRedo.bind(this)
    this.handleToggleFullScreen = this.handleToggleFullScreen.bind(this)
    this.handleToggleMenu = this.handleToggleMenu.bind(this)
    this.handleToggleView = this.handleToggleView.bind(this)
    this.handleMdPreview = this.handleMdPreview.bind(this)
    this.handleHtmlPreview = this.handleHtmlPreview.bind(this)
    this.handleToggleHtmlType = this.handleToggleHtmlType.bind(this)
    this.handleonKeyDown = this.handleonKeyDown.bind(this)

    this.handleInputScroll = tool.throttle((e: any) => {
      const { syncScrollMode = [] } = this.config
      if (!syncScrollMode.includes('rightFollowLeft')) {
        return
      }
      e.persist()
      if (this.willScrollEle === 'md') {
        this.hasContentChanged && this._setScrollValue()
        if (this.nodeMdPreviewWraper.current && this.nodeMdText.current) {
          this.nodeMdPreviewWraper.current.scrollTop = this.nodeMdText.current.scrollTop / this.scale
        }
      }
    }, 1000 / 60).bind(this);
    this.handlePreviewScroll = tool.throttle((e: any) => {
      const { syncScrollMode = [] } = this.config
      if (!syncScrollMode.includes('leftFollowRight')) {
        return
      }
      e.persist()
      if (this.willScrollEle === 'html') {
        this.hasContentChanged && this._setScrollValue()
        if (this.nodeMdText.current && this.nodeMdPreviewWraper.current)
          this.nodeMdText.current.scrollTop = this.nodeMdPreviewWraper.current.scrollTop * this.scale
      }
    }, 1000 / 60).bind(this);

    // init Logger
    this.logger = new Logger();
  }

  public componentDidMount() {
    this.renderHTML(this.props.value || "")
      .then(html => {
        this.setState({
          html: html
        })
      })
    this.initLogger()
  }

  public componentWillReceiveProps(nextProps: EditorProps) {
    if (nextProps.value === this.props.value) {
      // console.log('value not change')
      return
    }
    let { value } = nextProps
    value = this.formatString(value)
    value = value && value.replace(/↵/g, '\n')
    this.renderHTML(value)
      .then(html => {
        this.setState({
          text: value,
          html: html
        })
      })
  }

  public componentWillUnmount() {
    this.endLogger()
  }

  private formatString(value: string) {
    if (typeof this.props.value !== 'string') {
      console && console.error && console.error('The type of "value" must be String!')
      return new String(value).toString()
    }
    return value
  }

  private initLogger() {
    this.startLogger()
    this.logger.pushRecord(this.state.text)
  }

  private startLogger() {
    // 清空redo历史
    this.logger.cleanRedoList()
  }

  private endLogger() {
    if (this.loggerTimerId) {
      clearInterval(this.loggerTimerId)
      this.loggerTimerId = undefined
    }
  }

  private handleUndo() {
    this.logger.undo((last) => {
      this.endLogger()
      this._setMdText(last)
    });
  }

  private handleRedo() {
    this.logger.redo(last => {
      this._setMdText(last)
    });
  }

  private handleDecorate(type: string, option: any = {}) {
    const clearList = [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'unordered',
      'order',
      'quote',
      'hr',
      'inlinecode',
      'code',
      'table',
      'image',
      'link'
    ];
    if (clearList.indexOf(type) > -1) {
      if (!this.selection.isSelected) {
        return;
      }
      const content = this._getDecoratedText(type, option)
      this._setMdText(content);
      this._clearSelection();
    } else {
      const content = this._getDecoratedText(type, option)
      this._setMdText(content);
    }
  }

  private _getDecoratedText(type: string, option: any) {
    const { text = '' } = this.state;
    const { selection } = this;
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(selection.end, text.length);
    const decorate = new Decorate(selection.text)
    let decoratedText = ''
    if (type === 'image') {
      decoratedText = decorate.getDecoratedText(type, {
        target: option.target || "",
        imageUrl: option.imageUrl || this.config.imageUrl
      })
    } else if (type === 'link') {
      decoratedText = decorate.getDecoratedText(type, {
        linkUrl: this.config.linkUrl
      })
    } else {
      decoratedText = decorate.getDecoratedText(type, option)
    }
    const result = beforeContent + `${decoratedText}` + afterContent;
    return result;
  }

  private renderHTML(markdownText: string): Promise<string> {
    if (!this.props.renderHTML) {
      console.error('renderHTML props is required!')
      return Promise.resolve("");
    }
    const res = this.props.renderHTML(markdownText)
    if (typeof res === "string") {
      return Promise.resolve(res)
    } else if (typeof res === "function") {
      return Promise.resolve(res() as string)
    } else if (typeof res === 'object' && typeof res.then === 'function') {
      return res;
    }
    return Promise.resolve("");
  }

  private handleToggleFullScreen() {
    this.setState({
      fullScreen: !this.state.fullScreen
    });
  }

  private changeView(to: any) {
    const view = Object.assign({}, this.state.view, to)
    this.setState({
      view: view
    });
  }

  private handleToggleMenu() {
    this.changeView({
      'menu': !this.state.view.menu
    });
  }

  private handleToggleView(type: "md" | "html") {
    if (type === 'md') {
      this.changeView({
        'md': false,
        'html': true
      });
    } else {
      this.changeView({
        'md': true,
        'html': false
      });
    }
  }

  private handleMdPreview() {
    this.changeView({
      'html': !this.state.view.html
    });
  }

  private handleHtmlPreview() {
    this.changeView({
      'md': !this.state.view.md
    });
  }

  private handleToggleHtmlType() {
    let { htmlType } = this.state
    if (htmlType === 'render') {
      htmlType = 'source';
    } else if (htmlType === 'source') {
      htmlType = 'render';
    }
    this.setState({
      htmlType: htmlType
    });
  }

  private handleEmpty() {
    const { onBeforeClear } = this.props
    const clearText = () => {
      this.setState({
        text: '',
        html: ''
      })
    }
    if (onBeforeClear) {
      if (typeof onBeforeClear === 'function') {
        const res = onBeforeClear.call(this)
        if (typeof res === 'object' && typeof res.then === 'function') {
          res.then((toClear) => {
            if (toClear) {
              clearText()
            }
          })
        } else if (res === true) {
          clearText()
        }
      }
    } else {
      clearText();
    }
  }

  private handleImageUpload() {
    const { onImageUpload } = this.props
    if (typeof onImageUpload === 'function') {
      this.inputFile.current && this.inputFile.current.click();
    } else {
      this.handleDecorate('image');
    }
  }

  private onImageChanged(file: File) {
    if (this.props.onImageUpload) {
      this.props.onImageUpload(file, imageUrl => {
        this.handleDecorate('image', {
          target: file.name,
          imageUrl
        });
      })
    }
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.persist();
    this.startLogger();
    const value = e.target.value;
    if (!this.hasContentChanged) {
      this.hasContentChanged = true;
    }
    // 历史记录
    this.startLogger();
    if (this.loggerTimerId) {
      window.clearTimeout(this.loggerTimerId);
      this.loggerTimerId = 0;
    }
    this.loggerTimerId = window.setTimeout(() => {
      if (this.logger.getLastRecord() !== value) {
        this.logger.pushRecord(value);
      }
      window.clearTimeout(this.loggerTimerId);
      this.loggerTimerId = 0;
    }, this.config.logger ? this.config.logger.interval : defaultConfig.logger.interval);
    this._setMdText(value, e);
  }

  private handleInputSelect(e: React.SyntheticEvent<HTMLTextAreaElement, Event>) {
    e.persist();
    this.selection = Object.assign({}, this.selection, {
      isSelected: true
    }, this._getSelectionInfo(e));
  }

  private handleScrollEle(node: "md" | "html") {
    this.willScrollEle = node
  }

  private _setScrollValue() {
    // 设置值，方便 scrollBy 操作
    if (!this.nodeMdText.current || !this.nodeMdPreview || !this.nodeMdPreviewWraper.current) {
      return;
    }
    this.scale = (this.nodeMdText.current.scrollHeight - this.nodeMdText.current.offsetHeight + 35) / (this.nodeMdPreview.getHeight() - this.nodeMdPreviewWraper.current.offsetHeight + 35);
    this.hasContentChanged = false;
  }

  private _clearSelection() {
    this.selection = Object.assign({}, this.initialSelection)
  }

  private _getSelectionInfo(e: React.SyntheticEvent<HTMLTextAreaElement, Event>) {
    const event = e.nativeEvent;
    const source = (event.srcElement || event.currentTarget) as HTMLTextAreaElement;
    const start = source.selectionStart;
    const end = source.selectionEnd;
    const text = (source.value || '').slice(start, end);
    return { start, end, text };
  }

  private _setMdText(value: string = '', event?: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = value.replace(/↵/g, '\n');
    this.setState({
      text: value
    });
    this.renderHTML(text)
      .then(html => {
        this.setState({
          html
        });
        if (this.props.onChange) {
          this.props.onChange({ text, html }, event);
        }
      })
  }

  private _isKeyMatch(event: React.KeyboardEvent<HTMLDivElement>, key: string, keyCode: number, withCtrl: boolean = false) {
    if (event.ctrlKey !== withCtrl && event.metaKey !== withCtrl) {
      return false;
    }
    if (event.key) {
      return event.key === key;
    } else {
      return event.keyCode === keyCode;
    }
  }

  private handleonKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (this._isKeyMatch(e, 'z', 90, true)) {
      this.handleUndo()
      e.preventDefault()
    }
    if (this._isKeyMatch(e, 'y', 89, true)) {
      this.handleRedo()
      e.preventDefault()
    }
  }

  public getMdValue(): string {
    return this.state.text
  }

  public getHtmlValue(): string {
    return this.state.html
  }

  private showDropList(type: "header" | "table", flag: boolean) {
    const { dropButton } = this.state;
    this.setState({
      dropButton: { ...dropButton, [type]: flag }
    });
  }

  public render() {
    const { view, dropButton, fullScreen, table } = this.state
    const renderNavigation = () => {
      return view.menu &&
        <NavigationBar
          left={
            <div className="button-wrap">
              <span className="button" title="Header"
                onMouseEnter={() => this.showDropList('header', true)}
                onMouseLeave={() => this.showDropList('header', false)}
              >
                <Icon type="icon-header" />
                <DropList
                  show={dropButton.header}
                  onClose={() => {
                    this.showDropList('header', false)
                  }}
                  render={() => {
                    return (
                      <HeaderList onSelectHeader={(header: string) => {
                        this.handleDecorate(header)
                      }} />
                    )
                  }}
                />
              </span>
              <span className="button" title="Bold" onClick={() => this.handleDecorate('bold')}><Icon type="icon-bold" /></span>
              <span className="button" title="Italic" onClick={() => this.handleDecorate('italic')}><Icon type="icon-italic" /></span>
              <span className="button" title="Underline" onClick={() => this.handleDecorate('underline')}><Icon type="icon-underline" /></span>
              <span className="button" title="Strikethrough" onClick={() => this.handleDecorate('strikethrough')}><Icon type="icon-strikethrough" /></span>
              <span className="button" title="Unordered list" onClick={() => this.handleDecorate('unordered')}><Icon type="icon-list-ul" /></span>
              <span className="button" title="Ordered list" onClick={() => this.handleDecorate('order')}><Icon type="icon-list-ol" /></span>
              <span className="button" title="Quote" onClick={() => this.handleDecorate('quote')}><Icon type="icon-quote-left" /></span>
              <span className="button" title="Line break" onClick={() => this.handleDecorate('hr')}><Icon type="icon-window-minimize" /></span>
              <span className="button" title="Inline code" onClick={() => this.handleDecorate('inlinecode')}><Icon type="icon-embed" /></span>
              <span className="button" title="Block code" onClick={() => this.handleDecorate('code')}><Icon type="icon-embed2" /></span>
              <span className="button" title="Table"
                onMouseEnter={() => this.showDropList('table', true)}
                onMouseLeave={() => this.showDropList('table', false)}
              >
                <Icon type="icon-table" />
                <DropList
                  show={dropButton.table}
                  onClose={() => {
                    this.showDropList('table', false)
                  }}
                  render={() => {
                    return (
                      <TableList maxRow={table.maxRow} maxCol={table.maxCol} onSetTable={(option: any) => {
                        this.handleDecorate('table', option)
                      }} />
                    )
                  }}
                />
              </span>
              <span className="button" title="Image" onClick={this.handleImageUpload} style={{ position: 'relative' }}>
                <Icon type="icon-photo" />
                <InputFile accept={this.config.imageAccept || ""} ref={this.inputFile} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  e.persist();
                  if (e.target.files && e.target.files.length > 0) {
                    this.onImageChanged(e.target.files[0]);
                  }
                }} />
              </span>
              <span className="button" title="Link" onClick={() => this.handleDecorate('link')}><Icon type="icon-link" /></span>

              <span className="button" title="Clear" onClick={this.handleEmpty}><Icon type="icon-trash" /></span>
              <span className="button" title="Undo" onClick={this.handleUndo}><Icon type="icon-reply" /></span>
              <span className="button" title="Redo" onClick={this.handleRedo}><Icon type="icon-share" /></span>
            </div>
          }
          right={
            <div className="button-wrap">
              {view.fullScreen &&
                <span className="button" title="Full screen" onClick={this.handleToggleFullScreen}>
                  {fullScreen ? <Icon type="icon-shrink" /> : <Icon type="icon-enlarge" />}
                </span>
              }
            </div>
          }
        />
    }
    const renderContent = () => {
      const { html, text, view, htmlType } = this.state
      const res = []
      if (view.md) {
        res.push(
          <section className={'sec-md'} key="md">
            <ToolBar>
              <span className="button" title={view.menu ? 'Hide menu' : 'Show menu'} onClick={this.handleToggleMenu}>
                {view.menu ? <Icon type="icon-chevron-up" /> : <Icon type="icon-chevron-down" />}
              </span>
              <span className="button" title={view.html ? 'Hide preview' : 'Show preview'} onClick={this.handleMdPreview}>
                {view.html ? <Icon type="icon-desktop" /> : <Icon type="icon-columns" />}
              </span>
              <span className="button" title={'Preview'} onClick={() => this.handleToggleView('md')}><Icon type="icon-refresh" /></span>
            </ToolBar>
            <textarea
              id="textarea"
              ref={this.nodeMdText}
              name={this.props.name || "textarea"}
              value={text}
              className={`input ${this.config.markdownClass || ""}`}
              wrap="hard"
              onChange={this.handleChange}
              onSelect={this.handleInputSelect}
              onScroll={this.handleInputScroll}
              onMouseOver={() => this.handleScrollEle('md')}
            />
          </section>)
      }
      if (view.html) {
        res.push(
          <section className={'sec-html'} key="html">
            <ToolBar style={{ right: '20px' }}>
              <span className="button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                {view.menu ? <Icon type="icon-chevron-up" />
                  : <Icon type="icon-chevron-down" />
                }
              </span>
              <span className="button" title={view.md ? 'Hide editor' : 'Show editor'} onClick={this.handleHtmlPreview}>
                {view.md ? <Icon type="icon-desktop" />
                  : <Icon type="icon-columns" />
                }
              </span>
              <span className="button" title={'Toggle'} onClick={() => this.handleToggleView('html')}><Icon type="icon-refresh" /></span>
              <span className="button" title="Show HTML" onClick={this.handleToggleHtmlType}>
                {htmlType === 'render' ? <Icon type="icon-embed" />
                  : <Icon type="icon-eye" />
                }
              </span>
            </ToolBar>
            {htmlType === 'render' ?
              (<div className="html-wrap"
                ref={this.nodeMdPreviewWraper}
                onMouseOver={() => this.handleScrollEle('html')}
                onScroll={this.handlePreviewScroll}>
                <HtmlRender html={html} className={this.config.htmlClass} ref={(instance: HtmlRender) => this.nodeMdPreview = instance} />
              </div>)
              : (<div className={'html-code-wrap'}
                ref={this.nodeMdPreviewWraper}
                onScroll={this.handlePreviewScroll}>
                <HtmlCode html={html} className={this.config.htmlClass} ref={(instance: HtmlCode) => this.nodeMdPreview = instance} />
              </div>)
            }
          </section>
        )
      }
      return res
    }
    return (
      <div
        className={`rc-md-editor ${fullScreen ? 'full' : ''}`}
        style={this.props.style} onKeyDown={this.handleonKeyDown}
      >
        {renderNavigation()}
        <div className="editor-container">
          {renderContent()}
        </div>
      </div>
    )
  }
}

export default Editor
