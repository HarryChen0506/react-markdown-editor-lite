import * as React from 'react';
import { PluginProps } from './Plugin';

const autoResize = (props: PluginProps) => {
  React.useEffect(() => {
    let timer: number | null = null;

    const useTimer = typeof requestAnimationFrame === 'undefined';

    const resize = () => {
      const el = props.editor.getMdElement();
      if (el) {
        el.style.height = 'auto';
        const height = Math.min(Math.max(props.config.min, el.scrollHeight), props.config.max);
        console.log(props.config, height);
        el.style.height = height + 'px';
        const previewer = props.editor.getHtmlElement();
        if (previewer) {
          previewer.style.height = height + 'px';
        }
      }
      timer = null;
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
    handleChange();

    return () => {
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
};
autoResize.align = 'left';
autoResize.pluginName = 'auto-resize';

export default autoResize;
