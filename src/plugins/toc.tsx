import * as React from 'react';
// import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from './Plugin';

export default class Toc extends PluginComponent {
  static pluginName = 'toc';

  render() {
    return (
      <span
        className="button button-type-toc"
        title={i18n.get('btnToc')}
        onClick={() => this.editor.insertMarkdown('toc')}
      >
        <i className="icon icon-th" />
      </span>
    );
  }
}
