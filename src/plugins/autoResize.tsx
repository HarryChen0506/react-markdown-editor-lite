import * as React from 'react';
import { PluginProps } from './Plugin';

const autoResize = (props: PluginProps) => {
  React.useEffect(() => {
    let timer: number | null = null;

    const useTimer = props.config.useTimer || typeof requestAnimationFrame === 'undefined';

    const resizeElement = (el: HTMLElement) => {
      el.style.height = 'auto';
      const height = Math.min(Math.max(props.config.min, el.scrollHeight), props.config.max);
      el.style.height = height + 'px';
      return height;
    };

    const resize = () => {
      timer = null;
      // 如果渲染了编辑器，就以编辑器为准
      const view = props.editor.getView();
      const el = props.editor.getMdElement();
      const previewer = props.editor.getHtmlElement();
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
    };

    const handleChange = () => {
      if (timer !== null) {
        return;
      }

      if (useTimer) {
        timer = window.setTimeout(resize);
        return;
      }

      timer = requestAnimationFrame(resize);
    };

    props.editor.on('change', handleChange);
    props.editor.on('viewchange', handleChange);
    handleChange();

    return () => {
      props.editor.off('change', handleChange);
      props.editor.off('viewchange', handleChange);
      if (timer !== null && useTimer) {
        window.clearTimeout(timer);
        timer = null;
      }
    };
  }, []);

  return <span />;
};

autoResize.defaultConfig = {
  min: 200,
  max: Infinity,
  useTimer: false,
};
autoResize.align = 'left';
autoResize.pluginName = 'auto-resize';

export default autoResize;
