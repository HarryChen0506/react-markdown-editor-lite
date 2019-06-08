# react-markdown-editor-lite

* A light-weight(size 66KB) Markdown editor of React component
* Support TypeScript
* Support custom markdown parser
* Support Markdown Syntax: bold, italic, etc.
* Support UI configuration: show only editor or previewer area
* Support image upload
* Support synch scrolling with editor and previewer
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有66KB
* 支持TypeScript
* 支持自定义Markdown解析器
* 界面可配置, 如只显示编辑区或预览区
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持图片上传
* 支持编辑区和预览区同步滚动

## Demo

online demo [https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)
![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/example/react-markdown-editor-lite-v-0-3-6.PNG?raw=true)

## Install

```
npm install react-markdown-editor-lite --save
```

## Props

| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| value | markdown content | String | '' | required |
| style | component container style | Object | {height: '100%'} | not required |
| config | component config | Object | {view: {...}, logger: {...}} | not required |
| config.view | component UI | Object | {menu: true, md: true, html: true} |  |
| config.imageUrl | default image url | String | '' | |
| config.linkUrl | default link url | String | '' | |
| config.table | table maximum value of row and column | Object | {maxRow: 4, maxCol: 6} | |
| config.logger | logger in order to undo or redo | Object | {interval: 3000} | |
| config.synchScroll | Does it support synch scroll? | Boolean | true | |
| config.imageAccept | Accept image extensions, such as `.jpg,.png` | String | `<Empty string>` | |
| onChange | emitting when editor has changed | Function | ({html, md}) => {} | not required |
| onImageUpload | when image uploaded, callback emitting will get image markdown text | (file: File, callback: (url: string) => void) => void; | ({file, callback}) => {} | not required |
| renderHTML | Render markdown text to HTML. You can return either string and Promise | (text: string) => string | Promise | none | **required** |

## API

### MdEditor.getMdValue () => String

this api return a markdown content 

### MdEditor.getHtmlValue () => String

this api return a html text

## Basic Usage

Use markdown-it as markdown parser

```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  mdit = null
  constructor(props) {
    super(props)
    this.mdit = new MarkdownIt(/* Markdown-it options */)
  }
  handleEditorChange ({html, md}) {    
    console.log('handleEditorChange', html, md)
  }
  render() {
    return (      
      <div style="height: 500px">
        <MdEditor
          value={mock_content}
          renderHTML={(text) => this.mdit.render(text)}
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

const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  mdEditor = null
  mdit = null
  constructor(props) {
    super(props)
    this.mdit = new MarkdownIt(/* Markdown-it options */)
    this.renderHTML = this.renderHTML.bind(this)
  }
  handleEditorChange({html, md}) {
    console.log('handleEditorChange', html, md)
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
        resolve(this.mdit.render(text))
      }, 1000)
    })
  }
  handleGetMdValue() {   
    this.mdEditor && alert(this.mdEditor.getMdValue())      
  }
  handleGetHtmlValue() {    
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
            value={mock_content}
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

## References / Thanks

Big thanks to [markdown-it](https://github.com/markdown-it/markdown-it) authors

## License

[MIT](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/LICENSE)

