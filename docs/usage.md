# 使用说明

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

# Usage

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

* Configuration items see [here](./configure.md);