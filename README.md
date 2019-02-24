# react-markdown-editor-lite

* a light-weight(size 66KB) Markdown editor of React component
* use [markdown-it](https://github.com/markdown-it/markdown-it) as a parser
* Support Markdown Syntax: bold, italic, etc.
* Support UI configuration: show only editor or previewer area
* Support synch scrolling with editor and previewer
* 一款轻量的基于React的Markdown编辑器, 压缩后代码只有66KB
* 使用markdown-it作为Markdown解析器
* 界面可配置, 如只显示编辑区或预览区
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持编辑区和预览区同步滚动

## Demo

online demo [https://react-markdown-editor-lite.github.io/](https://react-markdown-editor-lite.github.io/)
![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/example/react-markdown-editor-lite-v-0-3-2.PNG?raw=true)

## Install

```
npm install react-markdown-editor-lite --save
```

## Props

| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| value | markdown content | String | '' |  |
| style | component container style | Object | {height: '100%'} |  |
| config | component config | Object | {view: {...}, logger: {...}} |  |
| config.view | component UI | Object | {menu: true, md: true, html: true} |  |
| config.imageUrl | default image url | String | '' | |
| config.linkUrl | default link url | String | '' | |
| config.logger | logger in order to undo or redo | Object | {interval: 3000} | |
| onChange | emitting when editor has changed | Function | ({html, md}) => {} |  |

## API

### MdEditor.getMdValue () => String

this api return a markdown content 

### MdEditor.getHtmlValue () => String

this api return a html text parsed by markdown-it

## Basic Usage

```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'react-markdown-editor-lite'

const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  handleEditorChange ({html, md}) {    
    console.log('handleEditorChange', html, md)
  }
  render() {
    return (      
      <div style="height: 500px">
        <MdEditor
          value={mock_content}
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

const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
export default class Demo extends React.Component {
  mdEditor = null
  handleEditorChange ({html, md}) {    
    console.log('handleEditorChange', html, md)
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
            value={mock_content}
            style={{height: '400px'}}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
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

