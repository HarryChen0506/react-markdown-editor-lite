import DropList from 'components/DropList';
import Icon from 'components/Icon';
import { PluginComponent, PluginProps } from 'plugins/Plugin';
import * as React from 'react';
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

export default class Table extends PluginComponent<Props, State> {
  name = 'table';

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
      <span className="button button-type-table" title="Table" onMouseEnter={this.show} onMouseLeave={this.hide}>
        <Icon type="icon-table" />
        <DropList
          show={this.state.show}
          onClose={this.hide}
          render={() => {
            return (
              <TableList
                maxRow={this.getConfig('maxRow', 6)}
                maxCol={this.getConfig('maxCol', 6)}
                onSetTable={(option: any) => this.editor.insertMarkdown('table', option)}
              />
            );
          }}
        />
      </span>
    );
  }
}
