# Props

[中文文档见此](./configure.zh-CN.md)

## Props list

| Property | Description | Type | default | Notes |
| --- | --- | --- | --- | --- |
| id | Element ID | String | `undefined` | If not empty, the id attributes of editor, text area and preview area are `{id}`, `{id}_md`, `{id}_html` |
| value | Markdown content | String | `''` |  |
| name | the name prop of textarea | String | 'textarea' |  |
| renderHTML | Render markdown text to HTML. You can return either string, function or Promise | `(text: string) => string | ReactElement | Promise<string> | Promise<ReactElement>` | none | **required** |
| placeholder | Default hint | String | undefined |  |
| readOnly | Is readonly | Boolean | false | |
| plugins | Plugin list | string[] | undefined |  |
| shortcuts | Enable markdown shortcuts | boolean | false |  |
| view | Controls which items will be displayd by default, includes: menu(Menu bar), md(Editor), html(Preview) | Object | `{ menu: true, md: true, html: true }` |  |
| canView | Controls which items can be displayd, includes: menu(Menu bar), md(Editor), html(Preview), fullScreen(Full screen)，hideMenu(Hide button to toggle menu bar) | Object | `{ menu: true, md: true, html: true, fullScreen: true, hideMenu: true }` |  |
| htmlClass | className of preview pane. If you require default html, please do not remove `custom-html-style`, like `your-style custom-html-style` | String | `'custom-html-style'` |  |
| markdownClass | className of editor panel | String | `''` |  |
| imageUrl | default image url | String | `''` |  |
| linkUrl | default link url | String | `''` |  |
| loggerMaxSize | max history logger size | number | 100 |  |
| loggerInterval | history logger interval (ms) | number | 600 |  |
| table | Max amount of rows and columns that a table created through the toolbar can have | Object | `{ maxRow: 4, maxCol: 6 }` | |
| syncScrollMode | Scroll sync mode between editor and preview | Array | `['rightFollowLeft', 'leftFollowRight']` | |
| imageAccept | Accepted file extensions for images, list of comma separated values i.e `.jpg,.png` | String | `''` | |
| onChange | Callback called on editor change | Function | `({html, text}, event) => {}` |  |
| onChangeTrigger | Configure when the onChange will be triggered, allow: both, beforeRender (before render html), afterRender (after render html) | Enum | `'both` |  |
| onImageUpload | Called on image upload, return a Promise that resolved with image url | `(file: File) => Promise<string>;` | undefined |  |
| onCustomImageUpload | custom image upload here, needs return Promise | `() => Promise` | See detail in src/editor/index.jsx |  |

## renderHTML
renderHTML support both HTML or ReactElement, for example, markdown-it returns HTML and react-markdown returns ReactElement.
Please note: what the onChange callback gets is the properties of the current state. If renderHTML is performed asynchronously, text and html may not correspond exactly.

```js
import React from 'react';
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
