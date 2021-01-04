/**
 * Since the Markdown Editor will lose input focus when user tpye a Tab key,
 * this is a built-in plugin to enable user to input Tab character.
 * see src/demo/index.tsx.
 */

import * as React from 'react';
import { KeyboardEventListener } from '../../share/var';
import { PluginComponent } from '../Plugin';
import DropList from '../../components/DropList';
import i18n from '../../i18n';
import TabMapList from './TabMapList';
import Icon from '../../components/Icon';

/**
 * @field tabMapValue:  Number of spaces will be inputted. Especially, note that 1 means a '\t' instead of ' '.
 * @field show:         Whether to show TabMapList.
 */
interface TabInsertState {
  tabMapValue: number;
  show: boolean;
}

export default class TabInsert extends PluginComponent<TabInsertState> {
  static pluginName = 'tab-insert';
  static defaultConfig = {
    tabMapValue: 1,
  };

  private handleKeyboard: KeyboardEventListener;

  constructor(props: any) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.handleChangeMapValue = this.handleChangeMapValue.bind(this);

    this.state = {
      tabMapValue: this.getConfig('tabMapValue'),
      show: false,
    };
    this.handleKeyboard = {
      key: 'Tab',
      keyCode: 9,
      aliasCommand: true,
      withKey: [],
      callback: () => this.editor.insertMarkdown('tab', { tabMapValue: this.state.tabMapValue }),
    };
  }

  private show() {
    this.setState({
      show: true,
    });
  }

  private hide() {
    this.setState({
      show: false,
    });
  }

  private handleChangeMapValue(mapValue: number) {
    this.setState({
      tabMapValue: mapValue,
    });
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
        className="button button-type-header"
        title={i18n.get('selectTabMap')}
        onClick={this.show}
        onMouseLeave={this.hide}
      >
        <Icon type="tab" />
        <DropList show={this.state.show} onClose={this.hide}>
          <TabMapList value={this.state.tabMapValue} onSelectMapValue={this.handleChangeMapValue} />
        </DropList>
      </span>
    );
  }
}
