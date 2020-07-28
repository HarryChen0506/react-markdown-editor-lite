import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { KeyboardEventListener } from 'src/share/var';
import { PluginComponent } from '../Plugin';

export default class FontItalic extends PluginComponent {
  static pluginName = 'font-italic';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.handleKeyboard = {
      key: 'i',
      keyCode: 73,
      withKey: ['ctrlKey'],
      callback: () => this.editor.insertMarkdown('italic'),
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
        className="button button-type-italic"
        title={i18n.get('btnItalic')}
        onClick={() => this.editor.insertMarkdown('italic')}
      >
        <Icon type="italic" />
      </span>
    );
  }
}
