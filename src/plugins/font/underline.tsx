import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { KeyboardEventListener } from 'src/share/var';
import { PluginComponent } from '../Plugin';

export default class FontUnderline extends PluginComponent {
  static pluginName = 'font-underline';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: 'u',
      keyCode: 85,
      withKey: ['ctrlKey'],
      callback: () => this.editor.insertMarkdown('underline'),
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
        className="button button-type-underline"
        title={i18n.get('btnUnderline')}
        onClick={() => this.editor.insertMarkdown('underline')}
      >
        <Icon type="underline" />
      </span>
    );
  }
}
