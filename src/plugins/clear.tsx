import Icon from 'components/Icon';
import * as React from 'react';
import { isPromise } from 'utils/tool';
import { PluginComponent } from './Plugin';

export default class Clear extends PluginComponent {
  name = 'clear';

  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { onBeforeClear } = this.editorConfig;
    if (this.editor.getMdValue() === '') {
      return;
    }
    const clearText = () => {
      this.editor.setText('');
    };
    if (typeof onBeforeClear === 'function') {
      const res = onBeforeClear.call(this.editor);
      if (isPromise(res)) {
        res.then((toClear: boolean) => {
          if (toClear) {
            clearText();
          }
        });
      } else if (res === true) {
        clearText();
      }
    } else {
      clearText();
    }
  }

  render() {
    return (
      <span className="button button-type-clear" title="Clear" onClick={this.handleClick}>
        <Icon type="icon-trash" />
      </span>
    );
  }
}
