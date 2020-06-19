import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class BlockCodeInline extends PluginComponent {
  static pluginName = 'block-code-inline';

  render() {
    return (
      <span
        className="button button-type-code-inline"
        title={i18n.get('btnInlineCode')}
        onClick={() => this.editor.insertMarkdown('inlinecode')}
      >
        <Icon type="code" />
      </span>
    );
  }
}
