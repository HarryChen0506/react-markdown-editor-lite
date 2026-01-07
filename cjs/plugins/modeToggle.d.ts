import * as React from 'react';
import { PluginComponent } from './Plugin';
interface ModeToggleState {
    view: {
        html: boolean;
        md: boolean;
    };
}
declare class ModeToggle extends PluginComponent<ModeToggleState> {
    static pluginName: string;
    static align: string;
    private get isDisplay();
    /**
     * 显示标准：
     * 两个都显示的时候，点击显示MD，隐藏HTML
     * 只显示HTML的时候，点击全部显示
     * 只显示MD的时候，点击显示HTML，隐藏MD
     * 如果当前标准因canView不可用，则顺延至下一个
     * 如果都不可用，则返回当前状态
     */
    private get next();
    constructor(props: any);
    private handleClick;
    private handleChange;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getDisplayInfo(): {
        icon: string;
        title: string;
    };
    render(): React.JSX.Element;
}
export default ModeToggle;
