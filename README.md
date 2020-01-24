# react-markdown-editor-lite

* A light-weight(27KB) Markdown editor of React component
* Supports TypeScript
* Supports custom markdown parser
* Full markdown support
* Full control over UI
* Supports image upload
* Supports synced scrolling between editor and preview
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有27KB
* 支持TypeScript
* 支持自定义Markdown解析器
* 界面可配置, 如只显示编辑区或预览区
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持图片上传
* 支持编辑区和预览区同步滚动

## Demo

Online demo <br>[https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/image/react-markdown-editor-lite-v0.6.0.PNG?raw=true)
## Install

### Npm
```
npm install react-markdown-editor-lite --save
```
### Yarn
```
yarn add react-markdown-editor-lite
```

## Props

| Property | Description | Type | default | Notes |
| --- | --- | --- | --- | --- |
| value | Markdown content | String | `''` | **required** |
| name | the name prop of textarea | String | 'textarea' |  |
| style | Inline styles for the component container | Object | `{height: '100%'}` |  |
| renderHTML | Render markdown text to HTML. You can return either string, function or Promise | `(text: string) => string\|function\|Promise` | none | **required** |
| config | Configuration object for the editor | Object | See config.js for defaults |  |
| config.view | Controls the editor panes open by default. menu: Menu bar, md: Markdown editor, html: rendered preview | Object | `{menu: true, md: true, html: true, fullScreen: true}` |  |
| config.htmlClass | className of preview pane | String | `''` |  |
| config.markdownClass | className of editorpane | String | `''` |  |
| config.imageUrl | default image url | String | `''` | DEBUG USE ONLY |
| config.linkUrl | default link url | String | `''` | DEBUG USE ONLY |
| config.table | Max amount of rows and columns that a table created through the toolbar can have | Object | `{maxRow: 4, maxCol: 6}` | |
| config.logger | How often to log events for undo/redo ms | Object | `{interval: 3000}` | |
| config.syncScrollMode | Scroll sync mode between editor and preview | Array | `['rightFollowLeft', 'leftFollowRight']` | |
| config.clearTip | default clear tip| String | `'Are you sure you want to clear your markdown ?'` | |
| config.imageAccept | Accepted file extensions for images, list of comma seperated values i.e `.jpg,.png` | String | `''` | |
| onChange | Callback called on editor change | Function | `({html, text}, event) => {}` |  |
| onImageUpload | Callback called on image upload | `(file: File, callback: (url: string) => void) => void;` | `({file, callback}) => {}` |  |
| onCustomImageUpload | custom image upload here, needs return Promise | `() => Promise` | See detail in src/editor/index.jsx |  |
| onBeforeClear | custom clear confirm dialog here, You can return either function or Promise | `() => function\|Promise` | See detail in src/editor/index.jsx |  |

## API

### MdEditor.getMdValue () => String

Get the markdown content as a string

### MdEditor.getHtmlValue () => String

Get the content of the editor as html

## Markdown Parser
We recommend using [markdown-it](https://github.com/markdown-it/markdown-it) as markown parser because it supports configurable syntax and has many community-written plugins. However, you can use any markdown parser you please.

```
npm install markdown-it --save
```

## Basic Usage

Using markdown-it as the markdown parser

```js
'use strict';
// import react, react-markdown-editor-lite, and a markdown parser you like
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

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

## More complicated example

```js
'use strict';
import * as React from 'react'
import * as ReactDOM from 'react-dom'
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
import 'react-markdown-editor-lite/lib/index.css';
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
        const uploadedUrl = 'https://avatars0.githubusercontent.com/u/21263805?s=40&v=4'
        callback(uploadedUrl)
      }, 1000)
    }
    reader.readAsDataURL(file)
  }
  onCustomImageUpload = () => {
    return new Promise((resolve, reject) => {
      const result = window.prompt('Please enter image url here')
      resolve({ url: result })
      // custom confirm message pseudo code
      // YourCustomDialog.open(() => {
      //   setTimeout(() => {
      //     // setTimeout 模拟oss异步上传图片
      //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
      //     resolve({url: url, name: 'pic'})
      //   }, 1000)
      // })
    })
  }
  renderHTML(text) {
    // 模拟异步渲染Markdown
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mdParser.render(text))
      }, 1000)
    })
  }
  onBeforeClear = () => {
    return new Promise((resolve, reject) => {
      const result = window.confirm('Are you sure you want to clear your markdown :-)')
      const toClear = result ? true : false
      resolve(toClear)
      // custom confirm dialog pseudo code
      // YourCustomDialog.open(() => {
      //   // confirm callback
      //   resolve(true)
      // }, () => {
      //   // cancel callback
      //   resolve(false)
      // })
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
                html: true,
                fullScreen: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
            onImageUpload={this.handleImageUpload}
            // onCustomImageUpload={this.onCustomImageUpload} // if using onCustomImageUpload, onImageUpload will be not working
            onBeforeClear={this.onBeforeClear}
          />
        </section>                        
      </div>      
    )
  }
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

## Authors
- HarryChen0506 [github/HarryChen0506](https://github.com/HarryChen0506)
- sylingd [github/sylingd](https://github.com/sylingd)

## License

[MIT](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/LICENSE)

