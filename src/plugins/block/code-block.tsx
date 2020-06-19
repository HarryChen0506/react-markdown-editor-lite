import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class BlockCodeBlock extends PluginComponent {
  static pluginName = 'block-code-block';

  render() {
    return (
      <span
        className="button button-type-code-block"
        title={i18n.get('btnCode')}
        onClick={() => this.editor.insertMarkdown('code')}
      >
        <Icon type="code-block" />
      </span>
    );
  }
}
