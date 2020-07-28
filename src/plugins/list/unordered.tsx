import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';
import { KeyboardEventListener } from 'src/share/var';

export default class ListUnordered extends PluginComponent {
  static pluginName = 'list-unordered';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: '8',
      keyCode: 56,
      withKey: ['ctrlKey', 'shiftKey'],
      callback: () => this.editor.insertMarkdown('unordered'),
    };
  }

  componentDidMount() {
    if (this.editorConfig.shortcuts) {
      this.editor.onKeyboard(this.handleKeyboard);
    }
  }

  componentWillUnmount() {
    this.editor.offKeyboard(this.handleKeyboard);
  }

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
