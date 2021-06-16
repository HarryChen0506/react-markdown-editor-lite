import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { KeyboardEventListener } from '../../share/var';
import { PluginComponent } from '../Plugin';

export default class ListOrdered extends PluginComponent {
  static pluginName = 'list-ordered';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: '7',
      keyCode: 55,
      withKey: ['ctrlKey', 'shiftKey'],
      aliasCommand: true,
      callback: () => this.editor.insertMarkdown('order'),
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
        className="button button-type-ordered"
        title={i18n.get('btnOrdered')}
        onClick={() => this.editor.insertMarkdown('order')}
      >
        <Icon type="list-ordered" />
      </span>
    );
  }
}
