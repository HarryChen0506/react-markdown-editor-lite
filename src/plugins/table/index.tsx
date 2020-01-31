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
  config?: {
    maxRow?: number;
    maxCol?: number;
  };
}

export default class Table extends PluginComponent<State, Props> {
  static pluginName = 'table';

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
            maxRow={this.getConfig('maxRow', 6)}
            maxCol={this.getConfig('maxCol', 6)}
            onSetTable={(option: any) => this.editor.insertMarkdown('table', option)}
          />
        </DropList>
      </span>
    );
  }
}
