# Props

## Props列表
| 名称 | 描述 | 类型 | 默认 | 备注 |
| --- | --- | --- | --- | --- |
| value | 内容 | String | `''` |  |
| name | textarea的名称 | String | 'textarea' |  |
| renderHTML | 将Markdown渲染为HTML或ReactElement | `(text: string) => string | ReactElement | Promise<string> | Promise<ReactElement>` | none | **必填** |
| plugins | 插件列表 | string[] | undefined |  |
| config | 其他配置项 | Object |  |  |
| config.view | 配置哪些项目默认被显示，包括：menu（菜单栏），md（编辑器)，html（预览区） | Object | `{ menu: true, md: true, html: true }` |  |
| config.canView | 配置哪些项目可以被显示，包括：menu（菜单栏），md（编辑器)，html（预览区），fullScreen（全屏），hideMenu（隐藏菜单按钮） | Object | `{ menu: true, md: true, html: true, fullScreen: true, hideMenu: true }` |  |
| config.htmlClass | 预览区域的className | String | `''` |  |
| config.markdownClass | 编辑区域的className | String | `''` |  |
| config.imageUrl | 当没有定义上传函数时，默认插入的图片 | String | `''` |  |
| config.linkUrl | 默认插入的链接日志 | String | `''` |  |
| config.table | 通过菜单栏创建表格的最大行、列 | Object | `{maxRow: 4, maxCol: 6}` | |
| config.syncScrollMode | 同步滚动预览区域与编辑区域 | Array | `['rightFollowLeft', 'leftFollowRight']` | |
| config.imageAccept | 接受上传的图片类型，例如`.jpg,.png` | String | `''` | |
| onChange | 编辑器内容改变时回调 | Function | `({text, html}, event) => {}` |  |
| onImageUpload | 上传图片时调用，需要返回一个Promise，完成时返回图片地址 | `(file: File) => Promise<string>;` | undefined |  |
| onCustomImageUpload | 自定义图片按钮点击事件，返回一个Promise，完成时返回图片地址。若定义了此函数，则onImageUpload不起作用 | `() => Promise<string>` | undefined |  |

## renderHTML
renderHTML支持返回HTML文本或ReactElement，例如，markdown-it返回的是HTML文本，而react-markdown返回的是ReactElement。

```js
import * as React from 'react';
import MdEditor from 'react-markdown-editor-lite';
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';
// 两种不同的解析器
import MarkdownIt from 'markdown-it';
import * as ReactMarkdown from 'react-markdown';

const mdParser = new MarkdownIt(/* Markdown-it options */);

function renderHTML(text: string) {
  // 使用 markdown-it
  return mdParser.render(text);
  // 使用 react-markdown
  return React.createElement(ReactMarkdown, {
    source: text,
  });
}

export default (props) => {
  return (<MdEditor renderHTML={renderHTML} />)
}
```

## onImageUpload

上传图片回调

```js
// 这个函数可以把File转为datauri字符串，作为演示
function onImageUpload(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = data => {
      resolve(data.target.result);
    };
    reader.readAsDataURL(file);
  });
}
export default (props) => {
  return (<MdEditor onImageUpload={onImageUpload} />)
}
```

## 其他

完整演示请参见[src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)

# Props

## Props list

| Property | Description | Type | default | Notes |
| --- | --- | --- | --- | --- |
| value | Markdown content | String | `''` |  |
| name | the name prop of textarea | String | 'textarea' |  |
| renderHTML | Render markdown text to HTML. You can return either string, function or Promise | `(text: string) => string | ReactElement | Promise<string> | Promise<ReactElement>` | none | **required** |
| plugins | Plugin list | string[] | undefined |  |
| config | Configuration object | Object |  |  |
| config.view | Controls which items will be displayd by default, includes: menu(Menu bar), md(Editor), html(Preview) | Object | `{ menu: true, md: true, html: true }` |  |
| config.canView | Controls which items can be displayd, includes: menu(Menu bar), md(Editor), html(Preview), fullScreen(Full screen)，hideMenu(Hide button to toggle menu bar) | Object | `{ menu: true, md: true, html: true, fullScreen: true, hideMenu: true }` |  |
| config.htmlClass | className of preview pane | String | `''` |  |
| config.markdownClass | className of editorpane | String | `''` |  |
| config.imageUrl | default image url | String | `''` |  |
| config.linkUrl | default link url | String | `''` |  |
| config.table | Max amount of rows and columns that a table created through the toolbar can have | Object | `{ maxRow: 4, maxCol: 6 }` | |
| config.syncScrollMode | Scroll sync mode between editor and preview | Array | `['rightFollowLeft', 'leftFollowRight']` | |
| config.imageAccept | Accepted file extensions for images, list of comma seperated values i.e `.jpg,.png` | String | `''` | |
| onChange | Callback called on editor change | Function | `({html, text}, event) => {}` |  |
| onImageUpload | Called on image upload, return a Promise that resolved with image url | `(file: File) => Promise<string>;` | undefined |  |
| onCustomImageUpload | custom image upload here, needs return Promise | `() => Promise` | See detail in src/editor/index.jsx |  |

## renderHTML
renderHTML support both HTML or ReactElement, for example, markdown-it returns HTML and react-markdown returns ReactElement.

```js
import * as React from 'react';
import MdEditor from 'react-markdown-editor-lite';
// Import styles
import 'react-markdown-editor-lite/lib/index.css';
// Two different markdown parser
import MarkdownIt from 'markdown-it';
import * as ReactMarkdown from 'react-markdown';

const mdParser = new MarkdownIt(/* Markdown-it options */);

function renderHTML(text: string) {
  // Using markdown-it
  return mdParser.render(text);
  // Using react-markdown
  return React.createElement(ReactMarkdown, {
    source: text,
  });
}

export default (props) => {
  return (<MdEditor renderHTML={renderHTML} />)
}
```

## onImageUpload

Called on image upload

```js
// This function can convert File object to a datauri string
function onImageUpload(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = data => {
      resolve(data.target.result);
    };
    reader.readAsDataURL(file);
  });
}
export default (props) => {
  return (<MdEditor onImageUpload={onImageUpload} />)
}
```

## Other

Full demo see [src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)