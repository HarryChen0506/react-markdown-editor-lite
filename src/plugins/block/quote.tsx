import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';

export default class BlockQuote extends PluginComponent {
  static pluginName = 'block-quote';

  render() {
    return (
      <span
        className="button button-type-quote"
        title={i18n.get('btnQuote')}
        onClick={() => this.editor.insertMarkdown('quote')}
      >
        <Icon type="quote" />
      </span>
    );
  }
}
