import * as React from 'react';
import { KeyboardEventListener } from '../share/var';
import { PluginComponent } from './Plugin';

export default class TabInsert extends PluginComponent {
  static pluginName = 'tab-insert';

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);
    this.state = {
      tabMapValue: this.getConfig('tabMapValue'),
    };
    this.handleKeyboard = {
      key: 'Tab',
      keyCode: 9,
      aliasCommand: true,
      withKey: [],
      callback: () => this.editor.insertMarkdown('tab'),
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
    return <span />;
  }
}
