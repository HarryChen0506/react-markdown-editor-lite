import * as React from 'react';
import { PluginComponent } from './Plugin';
export default class AutoResize extends PluginComponent {
    static pluginName: string;
    static align: string;
    static defaultConfig: {
        min: number;
        max: number;
        useTimer: boolean;
    };
    private timer;
    private useTimer;
    constructor(props: any);
    doResize(): void;
    handleChange(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
