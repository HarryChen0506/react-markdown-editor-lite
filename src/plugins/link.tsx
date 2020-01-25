import * as React from 'react';
import Icon from '../components/Icon';
import { PluginComponent } from './Plugin';

export default class Link extends PluginComponent {
  name = 'link';

  render() {
    return (
      <span className="button button-type-link" title="Link" onClick={() => this.editor.insertMarkdown('link')}>
        <Icon type="icon-link" />
      </span>
    );
  }
}
