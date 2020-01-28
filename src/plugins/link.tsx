import Icon from 'components/Icon';
import i18n from 'i18n';
import * as React from 'react';
import { PluginComponent } from './Plugin';

export default class Link extends PluginComponent {
  static pluginName = 'link';

  render() {
    return (
      <span
        className="button button-type-link"
        title={i18n.get('btnLink')}
        onClick={() => this.editor.insertMarkdown('link')}
      >
        <Icon type="icon-link" />
      </span>
    );
  }
}
