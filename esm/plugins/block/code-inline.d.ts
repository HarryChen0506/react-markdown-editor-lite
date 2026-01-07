import * as React from 'react';
import { PluginComponent } from '../Plugin';
export default class BlockCodeInline extends PluginComponent {
    static pluginName: string;
    render(): React.JSX.Element;
}
