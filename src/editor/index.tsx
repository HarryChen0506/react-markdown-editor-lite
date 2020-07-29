import * as React from 'react';
import Icon from 'src/components/Icon';
import NavigationBar from 'src/components/NavigationBar';
import ToolBar from 'src/components/ToolBar';
import i18n from 'src/i18n';
import emitter from 'src/share/emitter';
import { EditorConfig, EditorEvent, initialSelection, KeyboardEventListener, Selection } from 'src/share/var';
import getDecorated from 'src/utils/decorate';
import mergeConfig from 'src/utils/mergeConfig';
import { isKeyMatch, isPromise } from 'src/utils/tool';
import getUploadPlaceholder from 'src/utils/uploadPlaceholder';
import defaultConfig from './defaultConfig';
import './index.less';
import { HtmlRender, HtmlType } from './preview';

type Plugin = { comp: any; config: any };

interface EditorProps extends EditorConfig {
  id?: string;
  defaultValue?: string;
  value?: string;
  renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType);
  style?: React.CSSProperties;
  placeholder?: string;
  readOnly?: boolean;
  config?: any;
  plugins?: string[];
  // Configs
  onChange?: (
    data: {
      text: string;
      html: string;
    },
    event?: React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onScroll?: (e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>, type: 'md' | 'html') => void;
}

interface EditorState {
  text: string;
  html: HtmlType;
  fullScreen: boolean;
  plugins: { [x: string]: React.ReactElement[] };
  view: {
    menu: boolean;
    md: boolean;
    html: boolean;
  };
  table: {
    maxRow: number;
    maxCol: number;
  };
}

class Editor extends React.Component<EditorProps, EditorState> {
  private static plugins: Plugin[] = [];
  /**
   * Register plugin
   * @param {any} comp Plugin component
   * @param {any} config Other configs
   */
  static use(comp: any, config: any = {}) {
    // Check for duplicate plugins
    for (let i = 0; i < Editor.plugins.length; i++) {
      if (Editor.plugins[i].comp === comp) {
        Editor.plugins.splice(i, 1, { comp, config });
        return;
      }
    }
    Editor.plugins.push({ comp, config });
  }
  /**
   * Unregister plugin
   * @param {any} comp Plugin component
   */
  static unuse(comp: any) {
    for (let i = 0; i < Editor.plugins.length; i++) {
      if (Editor.plugins[i].comp === comp) {
        Editor.plugins.splice(i, 1);
        return;
      }
    }
  }
  /**
   * Unregister all plugins
   * @param {any} comp Plugin component
   */
  static unuseAll() {
    Editor.plugins = [];
  }
  /**
   * Locales
   */
  static addLocale = i18n.add.bind(i18n);
  static useLocale = i18n.setCurrent.bind(i18n);
  static getLocale = i18n.getCurrent.bind(i18n);

  private config: EditorConfig;

  private nodeMdText = React.createRef<HTMLTextAreaElement>();
  private nodeMdPreview = React.createRef<HtmlRender>();
  private nodeMdPreviewWraper = React.createRef<HTMLDivElement>();

  private hasContentChanged = true;

  private handleInputScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void;
  private handlePreviewScroll: (e: React.UIEvent<HTMLDivElement>) => void;

  constructor(props: any) {
    super(props);

    this.config = mergeConfig(defaultConfig, this.props.config, this.props);

    this.state = {
      text: (this.props.value || this.props.defaultValue || '').replace(/↵/g, '\n'),
      html: '',
      view: this.config.view || defaultConfig.view!,
      fullScreen: false,
      table: this.config.table || defaultConfig.table!,
      plugins: this.getPlugins(),
    };

    this.nodeMdText = React.createRef();
    this.nodeMdPreviewWraper = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleToggleMenu = this.handleToggleMenu.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleLocaleUpdate = this.handleLocaleUpdate.bind(this);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.handleInputScroll = this.handleSyncScroll.bind(this, 'md');
    this.handlePreviewScroll = this.handleSyncScroll.bind(this, 'html');
  }

  componentDidMount() {
    this.renderHTML(this.props.value || '');
    emitter.on(emitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
    // init i18n
    i18n.setUp();
  }

  componentWillUnmount() {
    emitter.off(emitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (typeof this.props.value !== 'undefined' && this.props.value !== this.state.text) {
      let value = this.props.value;
      if (typeof value !== 'string') {
        value = String(value).toString();
      }
      value = value.replace(/↵/g, '\n');
      if (this.state.text !== value) {
        this.setState({
          text: value,
        });
        this.renderHTML(value);
      }
    }
    if (prevProps.plugins !== this.props.plugins) {
      this.setState({
        plugins: this.getPlugins(),
      });
    }
  }

  private getPlugins() {
    let plugins: Plugin[] = [];
    if (this.props.plugins) {
      // If plugins option is configured, use only specified plugins
      const addToPlugins = (name: string) => {
        for (const it of Editor.plugins) {
          if (it.comp.pluginName === name) {
            plugins.push(it);
            return;
          }
        }
      };
      for (const name of this.props.plugins) {
        // Special handling of fonts to ensure backward compatibility
        if (name === 'fonts') {
          addToPlugins('font-bold');
          addToPlugins('font-italic');
          addToPlugins('font-underline');
          addToPlugins('font-strikethrough');
          addToPlugins('list-unordered');
          addToPlugins('list-ordered');
          addToPlugins('block-quote');
          addToPlugins('block-wrap');
          addToPlugins('block-code-inline');
          addToPlugins('block-code-block');
        } else {
          addToPlugins(name);
        }
      }
    } else {
      // Use all registered plugins
      plugins = [...Editor.plugins];
    }
    const result: { [x: string]: React.ReactElement[] } = {};
    plugins.forEach(it => {
      if (typeof result[it.comp.align] === 'undefined') {
        result[it.comp.align] = [];
      }
      result[it.comp.align].push(
        React.createElement(it.comp, {
          editor: this,
          editorConfig: this.config,
          config: {
            ...(it.comp.defaultConfig || {}),
            ...(it.config || {}),
          },
          key: it.comp.pluginName,
        }),
      );
    });
    return result;
  }

  // sync left and right section's scroll
  private scrollScale = 1;
  private isSyncingScroll = false;
  private shouldSyncScroll: 'md' | 'html' = 'md';
  private handleSyncScroll(type: 'md' | 'html', e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>) {
    // prevent loop
    if (type !== this.shouldSyncScroll) {
      return;
    }
    // trigger events
    if (this.props.onScroll) {
      this.props.onScroll(e, type);
    }
    emitter.emit(emitter.EVENT_SCROLL, e, type);
    // should sync scroll?
    const { syncScrollMode = [] } = this.config;
    if (!syncScrollMode.includes(type === 'md' ? 'rightFollowLeft' : 'leftFollowRight')) {
      return;
    }
    if (this.hasContentChanged && this.nodeMdText.current && this.nodeMdPreviewWraper.current) {
      // 计算出左右的比例
      this.scrollScale = this.nodeMdText.current.scrollHeight / this.nodeMdPreviewWraper.current.scrollHeight;
      this.hasContentChanged = false;
    }
    if (!this.isSyncingScroll) {
      this.isSyncingScroll = true;
      requestAnimationFrame(() => {
        if (this.nodeMdText.current && this.nodeMdPreviewWraper.current) {
          if (type === 'md') {
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
    if (isPromise(res)) {
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

  private handleToggleMenu() {
    this.setView({
      menu: !this.state.view.menu,
    });
  }

  private handleFocus(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(e);
    }
    emitter.emit(emitter.EVENT_FOCUS, e);
  }

  private handleBlur(e: React.FocusEvent<HTMLTextAreaElement>) {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(e);
    }
    emitter.emit(emitter.EVENT_BLUR, e);
  }

  /**
   * Text area change event
   * @param {React.ChangeEvent} e
   */
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.persist();
    const value = e.target.value;
    // 触发内部事件
    this.setText(value, e);
  }

  /**
   * Listen paste event to support paste images
   */
  private handlePaste(e: React.SyntheticEvent) {
    if (!this.config.allowPasteImage || !this.config.onImageUpload) {
      return;
    }
    const event = e.nativeEvent as ClipboardEvent;
    // @ts-ignore
    const items = (event.clipboardData || window.clipboardData).items as DataTransferItemList;

    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  }

  // Drag images to upload
  private handleDrop(e: React.SyntheticEvent) {
    if (!this.config.onImageUpload) {
      return;
    }
    const event = e.nativeEvent as DragEvent;
    if (!event.dataTransfer) {
      return;
    }
    const items = event.dataTransfer.items;
    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  }

  // Handle language change
  private handleLocaleUpdate() {
    this.forceUpdate();
  }

  /**
   * Get elements
   */
  getMdElement() {
    return this.nodeMdText.current;
  }
  getHtmlElement() {
    return this.nodeMdPreviewWraper.current;
  }

  /**
   * Clear selected
   */
  clearSelection() {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(0, 0, 'none');
    }
  }
  /**
   * Get selected
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
   * Set selected
   * @param {Selection} to
   */
  setSelection(to: { start: number; end: number }) {
    if (this.nodeMdText.current) {
      this.nodeMdText.current.setSelectionRange(to.start, to.end, 'forward');
      this.nodeMdText.current.focus();
    }
  }

  /**
   * Insert markdown text
   * @param type
   * @param option
   */
  insertMarkdown(type: string, option: any = {}) {
    const selection = this.getSelection();
    let decorateOption = option ? { ...option } : {};
    if (type === 'image') {
      decorateOption = {
        ...decorateOption,
        target: option.target || selection.text || '',
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
    this.insertText(decorate.text, true, decorate.selection);
  }
  /**
   * Insert a placeholder, and replace it when the Promise resolved
   * @param placeholder
   * @param wait
   */
  insertPlaceholder(placeholder: string, wait: Promise<string>) {
    this.insertText(placeholder, true);
    wait.then(str => {
      const text = this.getMdValue().replace(placeholder, str);
      this.setText(text);
    });
  }
  /**
   * Insert text
   * @param {string} value The text will be insert
   * @param {boolean} replaceSelected Replace selected text
   * @param {Selection} newSelection New selection
   */
  insertText(value: string = '', replaceSelected: boolean = false, newSelection?: { start: number; end: number }) {
    const { text } = this.state;
    const selection = this.getSelection();
    const beforeContent = text.slice(0, selection.start);
    const afterContent = text.slice(replaceSelected ? selection.end : selection.start, text.length);

    this.setText(
      beforeContent + value + afterContent,
      undefined,
      newSelection
        ? {
            start: newSelection.start + beforeContent.length,
            end: newSelection.end + beforeContent.length,
          }
        : {
            start: selection.start,
            end: selection.start,
          },
    );
  }

  /**
   * Set text, and trigger onChange event
   * @param {string} value
   * @param {any} event
   */
  setText(
    value: string = '',
    event?: React.ChangeEvent<HTMLTextAreaElement>,
    newSelection?: { start: number; end: number },
  ) {
    const text = value.replace(/↵/g, '\n');
    if (this.state.text === value) {
      return;
    }
    this.setState({ text });
    if (this.props.onChange) {
      this.props.onChange({ text, html: this.getHtmlValue() }, event);
    }
    emitter.emit(emitter.EVENT_CHANGE, value, event, typeof event === 'undefined');
    if (newSelection) {
      setTimeout(() => this.setSelection(newSelection));
    }
    if (!this.hasContentChanged) {
      this.hasContentChanged = true;
    }
    this.renderHTML(text).then(() => {
      if (this.props.onChange) {
        this.props.onChange(
          {
            text: this.state.text,
            html: this.getHtmlValue(),
          },
          event,
        );
      }
    });
  }

  /**
   * Get text value
   * @return {string}
   */
  getMdValue(): string {
    return this.state.text;
  }

  /**
   * Get rendered html
   * @returns {string}
   */
  getHtmlValue(): string {
    if (typeof this.state.html === 'string') {
      return this.state.html;
    } else {
      if (this.nodeMdPreview.current) {
        return this.nodeMdPreview.current.getHtml();
      } else {
        return '';
      }
    }
  }

  /**
   * Listen keyboard events
   */
  private keyboardListeners: KeyboardEventListener[] = [];
  /**
   * Listen keyboard events
   * @param {KeyboardEventListener} data
   */
  onKeyboard(data: KeyboardEventListener) {
    if (!this.keyboardListeners.includes(data)) {
      this.keyboardListeners.push(data);
    }
  }
  /**
   * Unlisten keyboard events
   * @param {KeyboardEventListener} data
   */
  offKeyboard(data: KeyboardEventListener) {
    const index = this.keyboardListeners.indexOf(data);
    if (index >= 0) {
      this.keyboardListeners.splice(index, 1);
    }
  }
  private handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    // 遍历监听数组，找找有没有被监听
    for (const it of this.keyboardListeners) {
      if (isKeyMatch(e, it.keyCode, it.key, it.withKey)) {
        e.preventDefault();
        it.callback(e);
        return;
      }
    }
    // 如果没有，触发默认事件
    emitter.emit(emitter.EVENT_KEY_DOWN, e);
  }

  private getEventType(event: EditorEvent) {
    switch (event) {
      case 'change':
        return emitter.EVENT_CHANGE;
      case 'fullscreen':
        return emitter.EVENT_FULL_SCREEN;
      case 'viewchange':
        return emitter.EVENT_VIEW_CHANGE;
      case 'keydown':
        return emitter.EVENT_KEY_DOWN;
      case 'blur':
        return emitter.EVENT_BLUR;
      case 'focus':
        return emitter.EVENT_FOCUS;
      case 'scroll':
        return emitter.EVENT_SCROLL;
    }
  }
  /**
   * Listen events
   * @param {EditorEvent} event Event type
   * @param {any} cb Callback
   */
  on(event: EditorEvent, cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.on(eventType, cb);
    }
  }
  /**
   * Unlisten events
   * @param {EditorEvent} event Event type
   * @param {any} cb Callback
   */
  off(event: EditorEvent, cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.off(eventType, cb);
    }
  }

  /**
   * Set view property
   * Can show or hide: editor, preview, menu
   * @param {object} to
   */
  setView(to: { md?: boolean; menu?: boolean; html?: boolean }) {
    const newView = { ...this.state.view, ...to };
    this.setState(
      {
        view: newView,
      },
      () => {
        emitter.emit(emitter.EVENT_VIEW_CHANGE, newView);
      },
    );
  }
  /**
   * Get view property
   * @return {object}
   */
  getView() {
    return { ...this.state.view };
  }

  /**
   * Enter or exit full screen
   * @param {boolean} enable
   */
  fullScreen(enable: boolean) {
    if (this.state.fullScreen !== enable) {
      this.setState(
        {
          fullScreen: enable,
        },
        () => {
          emitter.emit(emitter.EVENT_FULL_SCREEN, enable);
        },
      );
    }
  }
  /**
   * Is full screen
   * @return {boolean}
   */
  isFullScreen(): boolean {
    return this.state.fullScreen;
  }

  private uploadWithDataTransfer(items: DataTransferItemList) {
    const { onImageUpload } = this.config;
    if (!onImageUpload) {
      return;
    }
    const queue: Promise<string>[] = [];
    Array.prototype.forEach.call(items, (it: DataTransferItem) => {
      if (it.kind === 'file' && it.type.includes('image')) {
        const file = it.getAsFile();
        if (file) {
          const placeholder = getUploadPlaceholder(file, onImageUpload);
          queue.push(Promise.resolve(placeholder.placeholder));
          placeholder.uploaded.then(str => {
            const text = this.getMdValue().replace(placeholder.placeholder, str);
            const offset = str.length - placeholder.placeholder.length;
            // 计算出替换后的光标位置
            const selection = this.getSelection();
            this.setText(text, undefined, {
              start: selection.start + offset,
              end: selection.start + offset,
            });
          });
        }
      } else if (it.kind === 'string' && it.type === 'text/plain') {
        queue.push(new Promise(resolve => it.getAsString(resolve)));
      }
    });
    Promise.all(queue).then(res => {
      const text = res.join('');
      const selection = this.getSelection();
      this.insertText(text, true, {
        start: selection.start === selection.end ? text.length : 0,
        end: text.length,
      });
    });
  }

  render() {
    const showHideMenu = this.config.canView && this.config.canView.hideMenu === true;
    const { view, fullScreen } = this.state;
    const getPluginAt = (at: string) => this.state.plugins[at] || [];
    const isShowMenu = !!view.menu;
    const { id } = this.props;
    const editorId = id ? `${id}_md` : undefined;
    const previewerId = id ? `${id}_html` : undefined;
    return (
      <div
        id={id}
        className={`rc-md-editor ${fullScreen ? 'full' : ''}`}
        style={this.props.style}
        onKeyDown={this.handleKeyDown}
        onDrop={this.handleDrop}
      >
        <NavigationBar visible={isShowMenu} left={getPluginAt('left')} right={getPluginAt('right')} />
        <div className="editor-container">
          {showHideMenu && (
            <ToolBar>
              <span
                className="button button-type-menu"
                title={isShowMenu ? 'hidden menu' : 'show menu'}
                onClick={this.handleToggleMenu}
              >
                <Icon type={`expand-${isShowMenu ? 'less' : 'more'}`} />
              </span>
            </ToolBar>
          )}
          <section className={`section sec-md ${view.md ? 'visible' : 'in-visible'}`}>
            <textarea
              id={editorId}
              ref={this.nodeMdText}
              name={this.props.name || 'textarea'}
              placeholder={this.props.placeholder}
              readOnly={this.props.readOnly}
              value={this.state.text}
              className={`section-container input ${this.config.markdownClass || ''}`}
              wrap="hard"
              onChange={this.handleChange}
              onScroll={this.handleInputScroll}
              onMouseOver={() => (this.shouldSyncScroll = 'md')}
              onPaste={this.handlePaste}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
            />
          </section>
          <section className={`section sec-html ${view.html ? 'visible' : 'in-visible'}`}>
            <div
              id={previewerId}
              className="section-container html-wrap"
              ref={this.nodeMdPreviewWraper}
              onMouseOver={() => (this.shouldSyncScroll = 'html')}
              onScroll={this.handlePreviewScroll}
            >
              <HtmlRender html={this.state.html} className={this.config.htmlClass} ref={this.nodeMdPreview} />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Editor;
