import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from '../Plugin';
import { KeyboardEventListener } from 'src/share/var';

export default class ListOrdered extends PluginComponent {
  static pluginName = 'list-ordered';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: '7',
      keyCode: 55,
      withKey: ['ctrlKey', 'shiftKey'],
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
