import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class FontBold extends PluginComponent {
  static pluginName = 'font-bold';

  render() {
    return (
      <span
        className="button button-type-bold"
        title={i18n.get('btnBold')}
        onClick={() => this.editor.insertMarkdown('bold')}
      >
        <Icon type="bold" />
      </span>
    );
  }
}
