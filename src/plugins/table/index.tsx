import * as React from 'react';
import DropList from 'src/components/DropList';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent, PluginProps } from 'src/plugins/Plugin';
import TableList from './table';

interface State {
  show: boolean;
}

interface Props extends PluginProps {
  config: {
    maxRow?: number;
    maxCol?: number;
  };
}

export default class Table extends PluginComponent<State, Props> {
  static pluginName = 'table';
  static defaultConfig = {
    maxRow: 6,
    maxCol: 6,
  };

  constructor(props: any) {
    super(props);

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this.state = {
      show: false,
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

  render() {
    const config = this.editorConfig.table || this.props.config;
    return (
      <span
        className="button button-type-table"
        title={i18n.get('btnTable')}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        <Icon type="grid" />
        <DropList show={this.state.show} onClose={this.hide}>
          <TableList
            visiblity={this.state.show}
            maxRow={config.maxRow}
            maxCol={config.maxCol}
            onSetTable={(option: any) => this.editor.insertMarkdown('table', option)}
          />
        </DropList>
      </span>
    );
  }
}
