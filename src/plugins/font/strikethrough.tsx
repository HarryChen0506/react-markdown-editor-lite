import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class FontStrikethrough extends PluginComponent {
  static pluginName = 'font-strikethrough';

  render() {
    return (
      <span
        className="button button-type-strikethrough"
        title={i18n.get('btnStrikethrough')}
        onClick={() => this.editor.insertMarkdown('strikethrough')}
      >
        <Icon type="strikethrough" />
      </span>
    );
  }
}
