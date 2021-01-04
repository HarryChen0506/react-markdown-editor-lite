import * as React from 'react';
import DropList from '../../components/DropList';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../../plugins/Plugin';
import HeaderList from './HeaderList';

interface State {
  show: boolean;
}

export default class Header extends PluginComponent<State> {
  static pluginName = 'header';

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
        className="button button-type-header"
        title={i18n.get('btnHeader')}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        <Icon type="font-size" />
        <DropList show={this.state.show} onClose={this.hide}>
          <HeaderList onSelectHeader={(header: string) => this.editor.insertMarkdown(header)} />
        </DropList>
      </span>
    );
  }
}
