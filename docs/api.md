# API
[中文文档见此](./api.zh-CN.md)
## Plugins
### Written a plugin
See [plugin.md](./plugin.md)
### Editor.use
Register plugin
```js
/**
  * Register plugin
  * @param comp Plugin
  * @param config Other configurations
  */
static use(comp: any, config?: any): void;
```
## Locales
* addLocale: Add language pack
* useLocale: Set current language pack
* getLocale: Get current language pack's name
```js
static addLocale: (langName: string, lang: {
    [x: string]: string;
}) => void;
static useLocale: (langName: string) => void;
static getLocale: () => string;
```
For example, add traditional Chinese, and use it:
```js
Editor.addLocale('zh-TW', {
  btnHeader: '標頭',
  btnClear: '清除',
  btnBold: '粗體',
});
Editor.useLocale('zh-TW');

const MyEditor = () => {
  return (
    <Editor renderHtml={/* ... */} />
  )
}
```

### Plugin register/unregister API and use it
Plugin can export some methods to users.
```js
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
```

Example:
```js
// Register API in your plugin
this.editor.registerPluginApi("my-api", (number1, number2) => {
  console.log(number1 + number2);
});

// Call API with editor's ref
editorRef.current.callPluginApi("my-api", 1, 2);
```

## Selected
### Data struct
```js
interface Selection {
  start: number; // Start position, start at 0
  end: number; // End position
  text: string; // Selected text
}
```
### clearSelection
Clear selection, note that this method will move cursor to start, if you only want to clear selections but do not want to move cursor, please use setSelection
```js
/**
  * Clear selection
  */
clearSelection(): void;
```
### getSelection
Get selection
```js
/**
  * Get selection
  * @return {Selection}
  */
getSelection(): Selection;
```
## setSelection
Set current selection, if `to.start` is same as `to.end`, cursor will move to `to.start`

BTW, in this method, "text" in Selection take no effect.
```js
/**
  * Set current selection
  * @param {Selection} to
  */
setSelection(to: Selection): void;
```
## Contents
### insertMarkdown
Insert markdown text, see below for a complete example.
```js
/**
  * Insert markdown text
  * @param type
  * @param option
  */
insertMarkdown(type: string, option?: any): void;
```
### insertPlaceholder
Insert a placeholder, and replace it after the Promise resolved, for example, when uploading a image, you can insert a placeholder, and replace the placeholder to image's url after upload.
```js
/**
  * @param placeholder
  * @param wait
  */
insertPlaceholder(placeholder: string, wait: Promise<string>): void;
```
### insertText
Insert text
```js
/**
  * Insert text
  * @param {string} value The text you want to insert
  * @param {boolean} replaceSelected Replace selected text or not
  * @param {Selection} newSelection New selection
  */
insertText(value?: string, replaceSelected?: boolean, newSelection?: {
    start: number;
    end: number;
}): void;
```
### setText
Set text and trigger onChange event. Note that you should't call this method in onChange callback.
```js
/**
  * @param {string} value
  * @param {any} event
  */
setText(value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, newSelection?: Selection): void;
```
### getMdValue
Get text value
```js
/**
  * Get text value
  * @return {string}
  */
getMdValue(): string;
```
### getHtmlValue
Get rendered html source code
```js
/**
  * Get rendered html source code
  * @returns {string}
  */
getHtmlValue(): string;
```
## Event
### on / off
Listen or unlisten events, events:
* change: Editor's content has changed
* fullscreen: Full screen status changed
* viewchange: View status changed, such as show / hide preview area, or menu bars
* keydown: Press the keyboard key
```js
on(event: EditorEvent, cb: any): void;
off(event: EditorEvent, cb: any): void;
```
### onKeyboard / offKeyboard
Listen or unlisten keyboard events
```js
interface KeyboardEventListener {
  key?: string; // Key name, use this property at first, such as "z"
  keyCode: number; // Key code, if key name not exists, use this, such as 90
  withKey?: ('ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey')[]; // Press other keys at same time?
  callback: (e: React.KeyboardEvent<HTMLDivElement>) => void; // Callback
}
onKeyboard(data: KeyboardEventListener): void;
offKeyboard(data: KeyboardEventListener): void;
```
## UI
### setView
```js
/**
  * Set view status
  * You can hide or show: editor(md), preview(html), menu bar(menu)
  * @param enable
  */
setView({
    md?: boolean;
    menu?: boolean;
    html?: boolean;
}): void;
```
### getView
Get view status
```js
getView(): {
    menu: boolean;
    md: boolean;
    html: boolean;
};
```
### fullScreen
Enter or exit full screen
```js
/**
  * Enter or exit full screen
  * @param {boolean} enable Enable full screen?
  */
fullScreen(enable: boolean): void;
```
### isFullScreen
Is full screen enable or not
```js
isFullScreen(): boolean;
```
## Element
The actual elements of the editor can be reached by the following APIs. Please note: you MUST understand what you are doing, otherwise do not manipulate the actual elements of the editor.
### getMdElement
Get edit area elements
```js
getMdElement(): HTMLTextAreaElement | null;
```
### getHtmlElement
Get preview area element
```js
getHtmlElement(): HTMLDivElement | null;
```

## insertMarkdown Demo
```js
insertMarkdown('bold'); // **text**
insertMarkdown('italic'); // *text*
insertMarkdown('underline'); // ++text++
insertMarkdown('strikethrough'); // ~~text~~
insertMarkdown('quote'); // > text
insertMarkdown('inlinecode'); // `text`
insertMarkdown('hr'); // ---

/*
\```
text
\```
*/
insertMarkdown('code');
/*
* text
* text
* text
*/
insertMarkdown('unordered');
/*
1. text
2. text
3. text
*/
insertMarkdown('order');
/*
| Head | Head | Head | Head |
| --- | --- | --- | --- |
| Data | Data | Data | Data |
| Data | Data | Data | Data |
*/
insertMarkdown('table', {
  row: 2,
  col: 4
});
/*
![text](http://example.com/image.jpg)
*/
insertMarkdown('image', {
  imageUrl: "http://example.com/image.jpg"
});
/*
[text](http://example.com/)
*/
insertMarkdown('link', {
  linkUrl: "http://example.com/"
});
```