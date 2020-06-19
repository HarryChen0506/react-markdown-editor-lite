import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class ListUnordered extends PluginComponent {
  static pluginName = 'list-unordered';

  render() {
    return (
      <span
        className="button button-type-unordered"
        title={i18n.get('btnUnordered')}
        onClick={() => this.editor.insertMarkdown('unordered')}
      >
        <Icon type="list-unordered" />
      </span>
    );
  }
}
