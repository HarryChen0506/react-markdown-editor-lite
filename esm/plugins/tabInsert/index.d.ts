/**
 * Since the Markdown Editor will lose input focus when user tpye a Tab key,
 * this is a built-in plugin to enable user to input Tab character.
 * see src/demo/index.tsx.
 */
import * as React from 'react';
import { PluginComponent } from '../Plugin';
/**
 * @field tabMapValue:  Number of spaces will be inputted. Especially, note that 1 means a '\t' instead of ' '.
 * @field show:         Whether to show TabMapList.
 */
interface TabInsertState {
    tabMapValue: number;
    show: boolean;
}
export default class TabInsert extends PluginComponent<TabInsertState> {
    static pluginName: string;
    static defaultConfig: {
        tabMapValue: number;
    };
    private handleKeyboard;
    constructor(props: any);
    private show;
    private hide;
    private handleChangeMapValue;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.JSX.Element;
}
export {};
