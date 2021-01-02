/**
 * Since the Markdown Editor will lose input focus when user tpye a Tab key,
 * this is a built-in plugin to enable user to input Tab character.
 * Developer can assign its `defaultConfig` to determine
 * the actually input when user type a Tab key and
 * whether to display a switch in the toolbar,
 * see src/demo/index.tsx.
 */
import * as React from 'react';
import { KeyboardEventListener } from '../share/var';
import { PluginComponent } from './Plugin';
import i18n from '../i18n';

/**
 * @field tabMapValue:  Number of spaces will be inputted. Especially, note that 1 means a '\t' instead of ' '.
 * @field visible:      Whether to display a tab-map-value switch(a <select> tag) in the toolbar.
 */
interface TabInsertState {
  tabMapValue: number;
  visible: boolean;
}
export default class TabInsert extends PluginComponent<TabInsertState> {
  static pluginName = 'tab-insert';
  static align = 'right';
  static defaultConfig = {
    tabMapValue: 1,
    visible: false,
  };

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);
    this.state = {
      tabMapValue: this.getConfig('tabMapValue'),
      visible: this.getConfig('visible'),
    };
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
    return this.state.visible ? (
      <span title={i18n.get('selectTabMap')}>
        <select onChange={this.handleSelectChange} defaultValue={this.getConfig('tabMapValue')}>
          <option value="1">1 Tab</option>
          <option value="2">2 Spaces</option>
          <option value="4">4 Spaces</option>
          <option value="8">8 Spaces</option>
        </select>
      </span>
    ) : (
      <span />
    );
  }
}
