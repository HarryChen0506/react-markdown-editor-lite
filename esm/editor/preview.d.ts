import * as React from 'react';
export type HtmlType = string | React.ReactElement;
export interface PreviewProps {
    html: HtmlType;
    className?: string;
}
export declare abstract class Preview<T extends HTMLElement> extends React.Component<PreviewProps, any> {
    protected el: React.RefObject<T | null>;
    constructor(props: any);
    abstract getHtml(): string;
    getElement(): T | null;
    getHeight(): number;
}
export declare class HtmlRender extends Preview<HTMLDivElement> {
    getHtml(): string;
    render(): React.DetailedReactHTMLElement<{
        ref: React.RefObject<HTMLDivElement>;
        className: string;
    }, HTMLDivElement>;
}
export default HtmlRender;
