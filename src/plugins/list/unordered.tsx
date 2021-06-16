import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { KeyboardEventListener } from '../../share/var';
import { PluginComponent } from '../Plugin';

export default class ListUnordered extends PluginComponent {
  static pluginName = 'list-unordered';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: '8',
      keyCode: 56,
      withKey: ['ctrlKey', 'shiftKey'],
      aliasCommand: true,
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
