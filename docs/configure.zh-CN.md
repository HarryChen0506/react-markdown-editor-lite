# Props
[English documentation see here](./configure.md)
## Props列表
| 名称 | 描述 | 类型 | 默认 | 备注 |
| --- | --- | --- | --- | --- |
| id | 元素ID | String | `undefined` | 若不为空，则编辑器、文本区域、预览区域ID分别是`{id}`、`{id}_md`、`{id}_html` |
| value | 内容 | String | `''` |  |
| name | textarea的名称 | String | 'textarea' |  |
| renderHTML | 将Markdown渲染为HTML或ReactElement | `(text: string) => string | ReactElement | Promise<string> | Promise<ReactElement>` | none | **必填** |
| placeholder | 默认提示内容 | String | undefined |  |
| readOnly | 是否只读状态 | Boolean | false | |
| plugins | 插件列表 | string[] | undefined |  |
| shortcuts | 启用markdown快捷键 | boolean | false |  |
| view | 配置哪些项目默认被显示，包括：menu（菜单栏），md（编辑器)，html（预览区） | Object | `{ menu: true, md: true, html: true }` |  |
| canView | 配置哪些项目可以被显示，包括：menu（菜单栏），md（编辑器)，html（预览区），fullScreen（全屏），hideMenu（隐藏菜单按钮） | Object | `{ menu: true, md: true, html: true, fullScreen: true, hideMenu: true }` |  |
| htmlClass | 预览区域的className。如果需要默认样式，请保留`custom-html-style`。例如`your-style custom-html-style` | String | `'custom-html-style'` |  |
| markdownClass | 编辑区域的className | String | `''` |  |
| imageUrl | 当没有定义上传函数时，默认插入的图片 | String | `''` |  |
| linkUrl | 默认插入的链接日志 | String | `''` |  |
| loggerMaxSize | 历史记录最大容量（条） | number | 100 |  |
| loggerInterval | 历史记录触发间隔（ms） | number | 600 |  |
| table | 通过菜单栏创建表格的最大行、列 | Object | `{maxRow: 4, maxCol: 6}` | |
| syncScrollMode | 同步滚动预览区域与编辑区域 | Array | `['rightFollowLeft', 'leftFollowRight']` | |
| imageAccept | 接受上传的图片类型，例如`.jpg,.png` | String | `''` | |
| onChange | 编辑器内容改变时回调 | Function | `({text, html}, event) => {}` |  |
| onChangeTrigger | 配置改变回调触发的时机，可选：both、beforeRender（渲染HTML前）、afterRender（渲染HTML后） | Enum | `'both` |  |
| onImageUpload | 上传图片时调用，需要返回一个Promise，完成时返回图片地址 | `(file: File) => Promise<string>;` | undefined |  |
| onCustomImageUpload | 自定义图片按钮点击事件，返回一个Promise，完成时返回图片地址。若定义了此函数，则onImageUpload不起作用 | `() => Promise<string>` | undefined |  |

## renderHTML
renderHTML支持返回HTML文本或ReactElement，例如，markdown-it返回的是HTML文本，而react-markdown返回的是ReactElement。
请注意：onChange回调获取到的是当前状态的属性。如果renderHTML是异步进行，则text和html不一定完全对应。

```js
import React from 'react';
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
