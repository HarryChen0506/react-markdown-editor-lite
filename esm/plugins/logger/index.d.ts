import * as React from 'react';
import { PluginComponent } from '../Plugin';
export default class Logger extends PluginComponent {
    static pluginName: string;
    private logger;
    private timerId?;
    private handleKeyboards;
    private lastPop;
    constructor(props: any);
    private handleUndo;
    private handleRedo;
    handleChange(value: string, e: any, isNotInput: boolean): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    pause(): void;
    render(): React.JSX.Element;
}
