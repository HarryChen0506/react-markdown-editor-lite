import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';

export default class BlockWrap extends PluginComponent {
  static pluginName = 'block-wrap';

  render() {
    return (
      <span
        className="button button-type-wrap"
        title={i18n.get('btnLineBreak')}
        onClick={() => this.editor.insertMarkdown('hr')}
      >
        <Icon type="wrap" />
      </span>
    );
  }
}
