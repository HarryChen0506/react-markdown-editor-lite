import * as React from 'react';
import { KeyboardEventListener } from '../share/var';
import { PluginComponent } from './Plugin';
import i18n from '../i18n';

interface TabInsertState {
  tabMapValue: number;
}
export default class TabInsert extends PluginComponent<TabInsertState> {
  static pluginName = 'tab-insert';
  static align = 'right';
  static defaultConfig = {
    tabMapValue: 1,
  };

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);
    this.handleKeyboard = {
      key: 'Tab',
      keyCode: 9,
      aliasCommand: true,
      withKey: [],
      callback: () => this.editor.insertMarkdown('tab', { tabMapValue: this.state.tabMapValue }),
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  private handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ tabMapValue: parseInt(e.target.value) });
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
      <span title={i18n.get('selectTabMap')}>
        <select onChange={this.handleSelectChange} defaultValue="1">
          <option value="1">1 Tab</option>
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="8">8 Spaces</option>
        </select>
      </span>
    );
  }
}
