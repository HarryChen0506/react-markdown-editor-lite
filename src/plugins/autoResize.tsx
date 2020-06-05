import * as React from 'react';
import { PluginComponent } from './Plugin';

export default class AutoResize extends PluginComponent {
  static pluginName = 'auto-resize';
  static align = 'left';
  static defaultConfig = {
    min: 200,
    max: Infinity,
    useTimer: false,
  };

  private timer: number | null = null;
  private useTimer: boolean;

  constructor(props: any) {
    super(props);

    this.useTimer = this.getConfig('useTimer') || typeof requestAnimationFrame === 'undefined';

    this.handleChange = this.handleChange.bind(this);
    this.doResize = this.doResize.bind(this);
  }

  doResize() {
    const resizeElement = (e: HTMLElement) => {
      e.style.height = 'auto';
      const height = Math.min(Math.max(this.getConfig('min'), e.scrollHeight), this.getConfig('max'));
      e.style.height = height + 'px';
      return height;
    };

    this.timer = null;
    // 如果渲染了编辑器，就以编辑器为准
    const view = this.editor.getView();
    const el = this.editor.getMdElement();
    const previewer = this.editor.getHtmlElement();
    if (el && view.md) {
      const height = resizeElement(el);
      if (previewer) {
        previewer.style.height = height + 'px';
      }
      return;
    }
    // 否则，以预览区域为准
    if (previewer && view.html) {
      resizeElement(previewer);
    }
  }

  handleChange() {
    if (this.timer !== null) {
      return;
    }

    if (this.useTimer) {
      this.timer = window.setTimeout(this.doResize);
      return;
    }

    this.timer = requestAnimationFrame(this.doResize);
  }

  componentDidMount() {
    this.editor.on('change', this.handleChange);
    this.editor.on('viewchange', this.handleChange);
    this.handleChange();
  }

  componentWillUnmount() {
    this.editor.off('change', this.handleChange);
    this.editor.off('viewchange', this.handleChange);
    if (this.timer !== null && this.useTimer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  render() {
    return <span />;
  }
}
