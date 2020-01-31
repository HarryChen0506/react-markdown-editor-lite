# react-markdown-editor-lite

* A light-weight(20KB zipped) Markdown editor of React component
* Supports TypeScript
* Supports custom markdown parser
* Full markdown support
* Supports pluggable function bars
* Full control over UI
* Supports image upload
* Supports synced scrolling between editor and preview
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有20KB
* 支持TypeScript
* 支持自定义Markdown解析器
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持插件化的功能按钮
* 界面可配置, 如只显示编辑区或预览区
* 支持图片上传
* 支持编辑区和预览区同步滚动

## Demo
Online demo <br>[https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)

Default configuration

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/dev/image/react-markdown-editor-lite-v1.0.0.PNG?raw=true)

Pluggable bars

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/dev/image/react-markdown-editor-lite-v1.0.0-plugins.PNG?raw=true)


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

* Configuration items see [here](./configure.md)
* APIs see [here](./api.md)
* Plugins developer see [here](./plugin.md)
* Full demo see [src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)

## 安装

```shell
npm install react-markdown-editor-lite --save
# or
yarn add react-markdown-editor-lite
```

## 基本使用

基本使用分为以下几步：
* 导入react-markdown-editor-lite
* 注册插件（如果需要）
* 初始化任意Markdown解析器，例如markdown-it
* 开始使用

```js
// 导入React、react-markdown-editor-lite，以及一个你喜欢的Markdown渲染器
import * as React from 'react'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// 导入编辑器的样式
import 'react-markdown-editor-lite/lib/index.css';

// 注册插件（如果有的话）
// MdEditor.use(YOUR_PLUGINS_HERE);

// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);

// 完成！
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

## 在Next.js中使用

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

## 更多

* 配置项目：点击[这里](./configure.md)查看
* API：点击[这里](./api.md)查看
* 插件开发：点击[这里](./plugin.md)查看
* 完整Demo见[src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)


## Authors
- ShuangYa [github/sylingd](https://github.com/sylingd)
- HarryChen0506 [github/HarryChen0506](https://github.com/HarryChen0506)

## License
[MIT](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/LICENSE)