import * as React from 'react';
import { PluginComponent } from './Plugin';
interface FullScreenState {
    enable: boolean;
}
export default class FullScreen extends PluginComponent<FullScreenState> {
    static pluginName: string;
    static align: string;
    constructor(props: any);
    private handleClick;
    private handleChange;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export {};
