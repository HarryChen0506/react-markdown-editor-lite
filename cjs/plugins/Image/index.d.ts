import * as React from 'react';
import { PluginComponent } from '../Plugin';
interface State {
    show: boolean;
}
export default class Image extends PluginComponent<State> {
    static pluginName: string;
    private inputFile;
    constructor(props: any);
    private handleImageUpload;
    private onImageChanged;
    private handleCustomImageUpload;
    render(): React.JSX.Element;
}
export {};
