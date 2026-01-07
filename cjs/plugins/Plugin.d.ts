import * as React from 'react';
import type Editor from '../editor';
import { EditorConfig } from '../share/var';
export interface PluginProps {
    editor: Editor;
    editorConfig: EditorConfig;
    config: any;
}
export declare abstract class PluginComponent<S = {}, P extends PluginProps = PluginProps> extends React.Component<P, S> {
    static pluginName: string;
    static align: string;
    static defaultConfig: {};
    protected get editor(): Editor;
    protected get editorConfig(): EditorConfig;
    protected getConfig(key: string, defaultValue?: any): any;
}
