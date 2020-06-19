import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class FontUnderline extends PluginComponent {
  static pluginName = 'font-underline';

  render() {
    return (
      <span
        className="button button-type-underline"
        title={i18n.get('btnUnderline')}
        onClick={() => this.editor.insertMarkdown('underline')}
      >
        <Icon type="underline" />
      </span>
    );
  }
}
