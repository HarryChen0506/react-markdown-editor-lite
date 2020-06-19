import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class FontItalic extends PluginComponent {
  static pluginName = 'font-italic';

  render() {
    return (
      <span
        className="button button-type-italic"
        title={i18n.get('btnItalic')}
        onClick={() => this.editor.insertMarkdown('italic')}
      >
        <Icon type="italic" />
      </span>
    );
  }
}
