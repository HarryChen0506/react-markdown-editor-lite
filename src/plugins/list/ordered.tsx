import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class ListOrdered extends PluginComponent {
  static pluginName = 'list-ordered';

  render() {
    return (
      <span
        className="button button-type-ordered"
        title={i18n.get('btnOrdered')}
        onClick={() => this.editor.insertMarkdown('order')}
      >
        <Icon type="list-ordered" />
      </span>
    );
  }
}
