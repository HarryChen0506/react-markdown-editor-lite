# API
[English documention see here](./api.md)
## 插件
### 编写插件
见[plugin.md](./plugin.md)
### Editor.use
注册插件
```js
/**
  * 注册插件
  * @param comp 插件
  * @param config 其他配置
  */
static use(comp: any, config?: any): void;
```
## 多语言
Editor.addLocale / useLocale / getLocale，分别为添加语言包、设置当前语言、获取当前语言
```js
/**
  * 设置所使用的语言文案
  */
static addLocale: (langName: string, lang: {
    [x: string]: string;
}) => void;
static useLocale: (langName: string) => void;
static getLocale: () => string;
```
例如，添加繁体中文并使用：
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

### 插件注册/反注册API及调用
用于插件本身对外暴露一些API，供用户调用
```js
/**
 * 注册插件API
 * @param {string} name API名称
 * @param {any} cb 回调
 */
registerPluginApi(name: string, cb: any): void;
unregisterPluginApi(name: string): void;

/**
 * 调用插件API
 * @param {string} name API名称
 * @param {any} others 参数
 * @returns {any}
 */
callPluginApi<T = any>(name: string, ...others: any): T;
```

例如：
```js
// 在你的插件中注册API
this.editor.registerPluginApi("my-api", (number1, number2) => {
  console.log(number1 + number2);
});

// 通过编辑器的ref调用API
editorRef.current.callPluginApi("my-api", 1, 2);
```

## 操作选中区域
### 数据结构
```js
interface Selection {
  start: number; // 开始位置，从0开始
  end: number; // 结束位置
  text: string; // 选中的文字
}
```
### clearSelection
清除已选择区域，注意此函数会把光标移动到开头，如果只是想清除选择，而不移动光标位置，请使用setSelection
```js
/**
  * 清除已选择区域
  */
clearSelection(): void;
```
### getSelection
获取已选择区域
```js
/**
  * 获取已选择区域
  * @return {Selection}
  */
getSelection(): Selection;
```
## setSelection
设置已选择区域，当`to.start`与`to.end`相等时，光标位置将会被移动到`to.start`处。

另外，本函数中，Selection的text无实际意义
```js
/**
  * 设置已选择区域
  * @param {Selection} to
  */
setSelection(to: Selection): void;
```
## 内容
### insertMarkdown
插入Markdown语法，支持常见Markdown语法。完整示例见下方。
```js
/**
  * 插入Markdown语法
  * @param type
  * @param option
  */
insertMarkdown(type: string, option?: any): void;
```
### insertPlaceholder
插入占位符，并在Promise结束后自动覆盖，例如上传图片时，可以先插入一个占位符，在上传完成后自动将占位符替换为真实图片。
```js
/**
  * 插入占位符，并在Promise结束后自动覆盖
  * @param placeholder
  * @param wait
  */
insertPlaceholder(placeholder: string, wait: Promise<string>): void;
```
### insertText
插入文本
```js
/**
  * 插入文本
  * @param {string} value 要插入的文本
  * @param {boolean} replaceSelected 是否替换掉当前选择的文本
  * @param {Selection} newSelection 新的选择区域
  */
insertText(value?: string, replaceSelected?: boolean, newSelection?: {
    start: number;
    end: number;
}): void;
```
### setText
设置文本，同时触发onChange。注意避免在onChange里面调用此方法，以免造成死循环
```js
/**
  * 设置文本，同时触发onChange
  * @param {string} value
  * @param {any} event
  */
setText(value?: string, event?: React.ChangeEvent<HTMLTextAreaElement>, newSelection?: Selection): void;
```
### getMdValue
获取文本值
```js
/**
  * 获取文本值
  * @return {string}
  */
getMdValue(): string;
```
### getHtmlValue
获取渲染后的HTML
```js
/**
  * 获取渲染后的HTML
  * @returns {string}
  */
getHtmlValue(): string;
```
## 事件
### on / off
监听常规事件和取消监听事件。支持事件：
* change：编辑器内容变化
* fullscreen：全屏状态改变
* viewchange：视图区域改变（例如预览区域、菜单栏被隐藏/显示）
* keydown：按下键盘按键
```js
on(event: EditorEvent, cb: any): void;
off(event: EditorEvent, cb: any): void;
```
### onKeyboard / offKeyboard
监听键盘事件或取消监听
```js
interface KeyboardEventListener {
  key?: string; // 按键名称，优先使用此属性，例如“z”
  keyCode: number; // 按键代码，如果没有key的时候则使用此属性，例如90
  withKey?: ('ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey')[]; // 是否同时按下其他按键，包括ctrl、shift、alt、meta（即Mac上的Command按键）
  callback: (e: React.KeyboardEvent<HTMLDivElement>) => void; // 回调
}
onKeyboard(data: KeyboardEventListener): void;
offKeyboard(data: KeyboardEventListener): void;
```
## 界面相关
### setView
```js
/**
  * 设置视图属性
  * 可显示或隐藏：编辑器，预览区域，菜单栏
  * @param enable
  */
setView({
    md?: boolean;
    menu?: boolean;
    html?: boolean;
}): void;
```
### getView
获取视图属性
```js
getView(): {
    menu: boolean;
    md: boolean;
    html: boolean;
};
```
### fullScreen
进入或退出全屏模式
```js
/**
  * 进入或退出全屏模式
  * @param {boolean} enable 是否开启全屏模式
  */
fullScreen(enable: boolean): void;
```
### isFullScreen
是否处于全屏状态
```js
isFullScreen(): boolean;
```
## 元素
可以通过以下API获取编辑器实际元素。请注意：你必须明白自己在做什么，否则不要轻易操作编辑器实际元素。
### getMdElement
获取编辑区域元素
```js
getMdElement(): HTMLTextAreaElement | null;
```
### getHtmlElement
获取预览区域元素
```js
getHtmlElement(): HTMLDivElement | null;
```

## insertMarkdown 示例
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