import * as React from 'react';
import { PluginComponent } from '../Plugin';
interface State {
    show: boolean;
}
export default class Header extends PluginComponent<State> {
    static pluginName: string;
    constructor(props: any);
    private show;
    private hide;
    render(): React.JSX.Element;
}
export {};
