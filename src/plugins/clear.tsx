import Icon from 'components/Icon';
import i18n from 'i18n';
import * as React from 'react';
import { isPromise } from 'utils/tool';
import { PluginComponent } from './Plugin';

export default class Clear extends PluginComponent {
  static pluginName = 'clear';

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.editor.getMdValue() === '') {
      return;
    }
    if (window.confirm && typeof window.confirm === 'function') {
      const result = window.confirm(i18n.get('clearTip'));
      if (result) {
        this.editor.setText('');
      }
    }
  }

  render() {
    return (
      <span className="button button-type-clear" title={i18n.get('btnClear')} onClick={this.handleClick}>
        <Icon type="icon-trash" />
      </span>
    );
  }
}
