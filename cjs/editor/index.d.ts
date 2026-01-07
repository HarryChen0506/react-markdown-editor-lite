import * as React from 'react';
import { EditorConfig, EditorEvent, KeyboardEventListener, Selection } from '../share/var';
import { HtmlType } from './preview';
interface EditorProps extends EditorConfig {
    id?: string;
    defaultValue?: string;
    value?: string;
    renderHTML: (text: string) => HtmlType | Promise<HtmlType> | (() => HtmlType);
    style?: React.CSSProperties;
    autoFocus?: boolean;
    placeholder?: string;
    readOnly?: boolean;
    className?: string;
    config?: any;
    plugins?: string[];
    onChange?: (data: {
        text: string;
        html: string;
    }, event?: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onScroll?: (e: React.UIEvent<HTMLTextAreaElement | HTMLDivElement>, type: 'md' | 'html') => void;
}
interface EditorState {
    text: string;
    html: HtmlType;
    fullScreen: boolean;
    plugins: {
        [x: string]: React.ReactElement[];
    };
    view: {
        menu: boolean;
        md: boolean;
        html: boolean;
    };
}
declare class Editor extends React.Component<EditorProps, EditorState> {
    private static plugins;
    /**
     * Register plugin
     * @param {any} comp Plugin component
     * @param {any} config Other configs
     */
    static use(comp: any, config?: any): void;
    /**
     * Unregister plugin
     * @param {any} comp Plugin component
     */
    static unuse(comp: any): void;
    /**
     * Unregister all plugins
     * @param {any} comp Plugin component
     */
    static unuseAll(): void;
    /**
     * Locales
     */
    static addLocale: any;
    static useLocale: any;
    static getLocale: any;
    private config;
    private emitter;
    private nodeMdText;
    private nodeMdPreview;
    private nodeMdPreviewWrapper;
    private hasContentChanged;
    private composing;
    private pluginApis;
    private handleInputScroll;
    private handlePreviewScroll;
    constructor(props: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: EditorProps): void;
    isComposing(): boolean;
    private getPlugins;
    private scrollScale;
    private isSyncingScroll;
    private shouldSyncScroll;
    private handleSyncScroll;
    private renderHTML;
    private setHtml;
    private handleToggleMenu;
    private handleFocus;
    private handleBlur;
    /**
     * Text area change event
     * @param {React.ChangeEvent} e
     */
    private handleChange;
    /**
     * Listen paste event to support paste images
     */
    private handlePaste;
    private handleDrop;
    private handleEditorKeyDown;
    private handleLocaleUpdate;
    /**
     * Get elements
     */
    getMdElement(): HTMLTextAreaElement;
    getHtmlElement(): HTMLDivElement;
    /**
     * Clear selected
     */
    clearSelection(): void;
    /**
     * Get selected
     * @return {Selection}
     */
    getSelection(): Selection;
    /**
     * Set selected
     * @param {Selection} to
     */
    setSelection(to: {
        start: number;
        end: number;
    }): void;
    /**
     * Insert markdown text
     * @param type
     * @param option
     */
    insertMarkdown(type: string, option?: any): void;
    /**
     * Insert a placeholder, and replace it when the Promise resolved
     * @param placeholder
     * @param wait
     */
    insertPlaceholder(placeholder: string, wait: Promise<string>): void;
    /**
     * Insert text
     * @param {string} value The text will be insert
     * @param {boolean} replaceSelected Replace selected text
     * @param {Selection} newSelection New selection
     */
    insertText(value?: string, replaceSelected?: boolean, newSelection?: {
        start: number;
        end: number;
    }): void;
    /**
     * Set text, and trigger onChange event
     * @param {string} value
     * @param {any} event
     */
    setText(value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, newSelection?: {
        start: number;
        end: number;
    }): void;
    /**
     * Get text value
     * @return {string}
     */
    getMdValue(): string;
    /**
     * Get rendered html
     * @returns {string}
     */
    getHtmlValue(): string;
    /**
     * Listen keyboard events
     */
    private keyboardListeners;
    /**
     * Listen keyboard events
     * @param {KeyboardEventListener} data
     */
    onKeyboard(data: KeyboardEventListener | KeyboardEventListener[]): void;
    /**
     * Un-listen keyboard events
     * @param {KeyboardEventListener} data
     */
    offKeyboard(data: KeyboardEventListener | KeyboardEventListener[]): void;
    private handleKeyDown;
    private getEventType;
    /**
     * Listen events
     * @param {EditorEvent} event Event type
     * @param {any} cb Callback
     */
    on(event: EditorEvent, cb: any): void;
    /**
     * Un-listen events
     * @param {EditorEvent} event Event type
     * @param {any} cb Callback
     */
    off(event: EditorEvent, cb: any): void;
    /**
     * Set view property
     * Can show or hide: editor, preview, menu
     * @param {object} to
     */
    setView(to: {
        md?: boolean;
        menu?: boolean;
        html?: boolean;
    }): void;
    /**
     * Get view property
     * @return {object}
     */
    getView(): {
        menu: boolean;
        md: boolean;
        html: boolean;
    };
    /**
     * Enter or exit full screen
     * @param {boolean} enable
     */
    fullScreen(enable: boolean): void;
    /**
     * Register a plugin API
     * @param {string} name API name
     * @param {any} cb callback
     */
    registerPluginApi(name: string, cb: any): void;
    unregisterPluginApi(name: string): void;
    /**
     * Call a plugin API
     * @param {string} name API name
     * @param {any} others arguments
     * @returns {any}
     */
    callPluginApi<T = any>(name: string, ...others: any): T;
    /**
     * Is full screen
     * @return {boolean}
     */
    isFullScreen(): boolean;
    private uploadWithDataTransfer;
    render(): React.JSX.Element;
}
export default Editor;
