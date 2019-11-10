# react-markdown-editor-lite

* A light-weight(size 69KB) Markdown editor of React component
* Support TypeScript
* Support custom markdown parser
* Support Markdown Syntax: bold, italic, etc.
* Support UI configuration: show only editor or previewer area
* Support image upload
* Support synch scrolling with editor and previewer
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有69KB
* 支持TypeScript
* 支持自定义Markdown解析器
* 界面可配置, 如只显示编辑区或预览区
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持图片上传
* 支持编辑区和预览区同步滚动

## Demo

online demo [https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)
![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/example/react-markdown-editor-lite-v-0-4-6.PNG?raw=true)

## Install

```
npm install react-markdown-editor-lite --save
```

## Props

| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| value | markdown content | String | '' | required |
| name | the name prop of textarea | String | 'textarea' | not required |
| style | component container style | Object | {height: '100%'} | not required |
| config | component config | Object | {view: {...}, logger: {...}} | not required |
| config.view | component UI | Object | {menu: true, md: true, html: true} |  |
| config.htmlClass | Html section class attribute | String | `<Empty string>` |  |
| config.markdownClass | Markdown section class attribute | String | `<Empty string>` |  |
| config.imageUrl | default image url | String | '' | |
| config.linkUrl | default link url | String | '' | |
| config.table | table maximum value of row and column | Object | {maxRow: 4, maxCol: 6} | |
| config.logger | logger in order to undo or redo | Object | {interval: 3000} | |
| config.synchScroll | Does it support synch scroll? | Boolean | true | |
| config.imageAccept | Accept image extensions, such as `.jpg,.png` | String | `<Empty string>` | |
| onChange | emitting when editor has changed | Function | ({html, text}, event) => {} | not required |
| onImageUpload | when image uploaded, callback emitting will get image markdown text | (file: File, callback: (url: string) => void) => void; | ({file, callback}) => {} | not required |
| renderHTML | Render markdown text to HTML. You can return either string, function or Promise | (text: string) => string\|function\|Promise | none | **required** |

## API

### MdEditor.getMdValue () => String

this api return a markdown content 

### MdEditor.getHtmlValue () => String

this api return a html text

## Custom Markdown Parser
we recommend using [markdown-it](https://github.com/markdown-it/markdown-it) as markown parser, because it supports configurable syntax and has many community-written plugins.You can use any other parser instead of markdown-it.
```
npm install markdown-it --save
```

## Basic Usage

Use markdown-it as markdown parser

```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

const MOCK_DATA = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  mdParser = null
  constructor(props) {
    super(props)
    this.mdParser = new MarkdownIt(/* Markdown-it options */)
  }
  handleEditorChange ({html, text}) {    
    console.log('handleEditorChange', html, text)
  }
  render() {
    return (      
      <div style="height: 500px">
        <MdEditor
          value={MOCK_DATA}
          renderHTML={(text) => this.mdParser.render(text)}
          onChange={this.handleEditorChange} 
        />                
      </div>
    )
  }
}
```

## More Example

```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
// import 'highlight.js/styles/github.css'
import './index.less';

const MOCK_DATA = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  mdEditor = null
  mdParser = null
  constructor(props) {
    super(props)
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }    
        return '' // use external default escaping
      }
    })
    .use(emoji)
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists, { enabled: this.taskLists })
    this.renderHTML = this.renderHTML.bind(this)
  }
  handleEditorChange({html, text}, event) {
    console.log('handleEditorChange', html, text, event)
  }
  handleImageUpload(file, callback) {
    const reader = new FileReader()
    reader.onload = () => {      
      const convertBase64UrlToBlob = (urlData) => {  
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type:mime})
      }
      const blob = convertBase64UrlToBlob(reader.result)
      setTimeout(() => {
        // setTimeout 模拟异步上传图片
        // 当异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
        callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
      }, 1000)
    }
    reader.readAsDataURL(file)
  }
  renderHTML(text) {
    // 模拟异步渲染Markdown
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mdParser.render(text))
      }, 1000)
    })
  }
  handleGetMdValue = () => {   
    this.mdEditor && alert(this.mdEditor.getMdValue())      
  }
  handleGetHtmlValue = () => {    
    this.mdEditor && alert(this.mdEditor.getHtmlValue())
  }
  render() {
    return (      
      <div>
        <nav>
          <button onClick={this.handleGetMdValue} >getMdValue</button>  
          <button onClick={this.handleGetHtmlValue} >getHtmlValue</button>  
        </nav>
        <section style="height: 500px">
          <MdEditor 
            ref={node => this.mdEditor = node}
            value={MOCK_DATA}
            style={{height: '400px'}}
            renderHTML={this.renderHTML}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
            onImageUpload={this.handleImageUpload}
          />
        </section>                        
      </div>      
    )
  }
}
```

## Using in Next.js

```js
import dynamic from 'next/dynamic'

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

## Authors
- HarryChen0506 [github/HarryChen0506](https://github.com/HarryChen0506)
- sylingd [github/sylingd](https://github.com/sylingd)

## License

[MIT](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/LICENSE)

