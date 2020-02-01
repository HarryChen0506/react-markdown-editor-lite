react-markdown-editor-lite
========

[![NPM package][npm]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

[中文文档](README_CN.md)

* A light-weight(20KB zipped) Markdown editor of React component
* Supports TypeScript
* Supports custom markdown parser
* Full markdown support
* Supports pluggable function bars
* Full control over UI
* Supports image uploading and dragging
* Supports synced scrolling between editor and preview
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有20KB
* 支持TypeScript
* 支持自定义Markdown解析器
* 支持常用的Markdown编辑功能，如加粗，斜体等等...
* 支持插件化的功能键
* 界面可配置, 如只显示编辑区或预览区
* 支持图片上传或拖拽
* 支持编辑区和预览区同步滚动

## Demo
Online demo <br>[https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)

Default configuration

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/image/react-markdown-editor-lite-v1.0.0.PNG?raw=true)

Pluggable bars

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/image/react-markdown-editor-lite-v1.0.0-plugins.PNG?raw=true)


## Install

```shell
npm install react-markdown-editor-lite --save
# or
yarn add react-markdown-editor-lite
```

## Basic usage
Following steps:
* Import react-markdown-editor-lite
* Register plugins if required
* Initialize a markdown parser, such as markdown-it
* Start usage

```js
// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({html, text}) {    
  console.log('handleEditorChange', html, text)
}
export default (props) => {
  return (
    <MdEditor
      value=""
      renderHTML={(text) => mdParser.render(text)}
      onChange={handleEditorChange}
      />
  )
}
```

## Usage in Next.js

```js
import dynamic from 'next/dynamic'
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

export default function() {
  return (      
    <div style="height: 500px">
      <MdEditor
        value=""
        renderHTML={/* Render function */}
      />                
    </div>
  )
}
```


## More

* Configuration items see [here](./docs/configure.md)
* APIs see [here](./docs/api.md)
* Plugins developer see [here](./docs/plugin.md)
* Full demo see [src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)

## Authors
- ShuangYa [github/sylingd](https://github.com/sylingd)
- HarryChen0506 [github/HarryChen0506](https://github.com/HarryChen0506)

## License
[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/react-markdown-editor-lite.svg
[npm-url]: https://www.npmjs.com/package/react-markdown-editor-lite
[npm-downloads-image]: http://img.shields.io/npm/dm/react-markdown-editor-lite.svg?style=flat
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE