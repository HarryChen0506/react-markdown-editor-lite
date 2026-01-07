import * as React from 'react';
import { PluginComponent, PluginProps } from '../Plugin';
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
    static pluginName: string;
    static defaultConfig: {
        maxRow: number;
        maxCol: number;
    };
    constructor(props: any);
    private show;
    private hide;
    render(): React.JSX.Element;
}
export {};
