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
  value?: string;
  renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType);
  style?: React.CSSProperties;
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
  static defaultProps = {
    value: '',
  };

  private static plugins: Plugin[] = [];
  /**
   * 注册插件
   * @param comp 插件
   * @param config 其他配置
   */
  static use(comp: any, config: any = {}) {
    Editor.plugins.push({ comp, config });
  }
  /**
   * 设置所使用的语言文案
   */
  static addLocale = i18n.add;
  static useLocale = i18n.setCurrent;
  static getLocale = i18n.getCurrent;

  private config: EditorConfig;

  private nodeMdText: React.RefObject<HTMLTextAreaElement>;
  private nodeMdPreview?: HtmlRender;
  private nodeMdPreviewWraper: React.RefObject<HTMLDivElement>;

  private hasContentChanged = true;

  private handleInputScroll: () => void;
  private handlePreviewScroll: () => void;

  constructor(props: any) {
    super(props);

    this.config = mergeConfig(defaultConfig, this.props.config, this.props);

    this.state = {
      text: (this.props.value || '').replace(/↵/g, '\n'),
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

    this.handleInputScroll = this.handleSyncScroll.bind(this, 'input');
    this.handlePreviewScroll = this.handleSyncScroll.bind(this, 'preview');
  }

  componentDidMount() {
    this.renderHTML(this.props.value || '');
    emitter.on(emitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
  }

  componentWillUnmount() {
    emitter.off(emitter.EVENT_LANG_CHANGE, this.handleLocaleUpdate);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.value !== this.props.value && this.props.value !== this.state.text) {
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
    if (prevProps.plugins !== this.props.plugins) {
      this.setState({
        plugins: this.getPlugins(),
      });
    }
  }

  private getPlugins() {
    let plugins: Plugin[] = [];
    if (this.props.plugins) {
      const findPlugin = (name: string) => {
        for (const it of Editor.plugins) {
          if (it.comp.pluginName === name) {
            return it;
          }
        }
      };
      plugins = this.props.plugins.map(name => findPlugin(name)).filter(it => !!it) as Plugin[];
    } else {
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
          config: it.config,
          key: it.comp.pluginName,
        }),
      );
    });
    return result;
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

  /**
   * 文本区域变化事件
   * @param {React.ChangeEvent} e
   */
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
   * 监听粘贴事件，实现自动上传图片
   */
  private handlePaste(e: React.SyntheticEvent) {
    if (!this.config.allowPasteImage || !this.config.onImageUpload) {
      return;
    }
    const event = e.nativeEvent as ClipboardEvent;
    const items = (event.clipboardData || window.clipboardData).items as DataTransferItemList;

    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  }

  // 拖放上传
  private handleDrop(e: React.SyntheticEvent) {
    if (!this.config.onImageUpload) {
      return;
    }
    const event = e.nativeEvent as DragEvent;
    const items = event.dataTransfer?.items;
    if (items) {
      e.preventDefault();
      this.uploadWithDataTransfer(items);
    }
  }

  // 语言变化事件
  private handleLocaleUpdate() {
    this.forceUpdate();
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
   * 插入占位符，并在Promise结束后自动覆盖
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
   * 插入文本
   * @param {string} value 要插入的文本
   * @param {boolean} replaceSelected 是否替换掉当前选择的文本
   * @param {Selection} newSelection 新的选择区域
   */
  insertText(value: string = '', replaceSelected: boolean = false, newSelection?: { start: number; end: number }) {
    const { text = '' } = this.state;
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
    this.setState(
      {
        text: value,
      },
      () => {
        emitter.emit(emitter.EVENT_CHANGE, value, event, true);
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
      if (isKeyMatch(e, it.keyCode, it.key, it.withKey)) {
        e.preventDefault();
        it.callback(e);
        return;
      }
    }
  }

  /**
   * 其他事件监听
   */
  private getEventType(event: EditorEvent) {
    switch (event) {
      case 'change':
        return emitter.EVENT_CHANGE;
      case 'fullscreen':
        return emitter.EVENT_FULL_SCREEN;
      case 'viewchange':
        return emitter.EVENT_VIEW_CHANGE;
    }
  }
  on(event: EditorEvent, cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.on(eventType, cb);
    }
  }
  off(event: EditorEvent, cb: any) {
    const eventType = this.getEventType(event);
    if (eventType) {
      emitter.off(eventType, cb);
    }
  }

  /**
   * 设置视图属性
   * 可显示或隐藏：编辑器，预览区域，菜单栏
   * @param enable
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
  getView() {
    return { ...this.state.view };
  }

  /**
   * 进入或退出全屏模式
   * @param {boolean} enable 是否开启全屏模式
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
  isFullScreen() {
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
            this.setText(text);
          });
        }
      } else if (it.kind === 'string' && it.type === 'text/plain') {
        queue.push(new Promise(resolve => it.getAsString(resolve)));
      }
    });
    Promise.all(queue).then(res => {
      const text = res.join('');
      this.insertText(text, true);
    });
  }

  render() {
    const showHideMenu = this.config.canView && this.config.canView.hideMenu === true;
    const { view, fullScreen } = this.state;
    const getPluginAt = (at: string) => this.state.plugins[at] || [];
    const isShowMenu = !!view.menu;
    return (
      <div
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
                <Icon type={`icon-chevron-${isShowMenu ? 'up' : 'down'}`} />
              </span>
            </ToolBar>
          )}
          <section className={`section sec-md ${view.md ? 'visible' : 'in-visible'}`}>
            <textarea
              id="textarea"
              ref={this.nodeMdText}
              name={this.props.name || 'textarea'}
              value={this.state.text}
              className={`section-container input ${this.config.markdownClass || ''}`}
              wrap="hard"
              onChange={this.handleChange}
              onScroll={this.handleInputScroll}
              onMouseOver={() => (this.shouldSyncScroll = 'input')}
              onPaste={this.handlePaste}
            />
          </section>
          <section className={`section sec-html ${view.html ? 'visible' : 'in-visible'}`}>
            <div
              className="section-container html-wrap"
              ref={this.nodeMdPreviewWraper}
              onMouseOver={() => (this.shouldSyncScroll = 'preview')}
              onScroll={this.handlePreviewScroll}
            >
              <HtmlRender
                html={this.state.html}
                className={this.config.htmlClass}
                ref={(instance: HtmlRender) => (this.nodeMdPreview = instance)}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default Editor;
