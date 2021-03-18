import * as React from 'react';
import { PluginComponent } from '../Plugin';
import './index.less';

export default class Divider extends PluginComponent {
  static pluginName = 'divider';

  render() {
    return <span className="rmel-divider" />;
  }
}
