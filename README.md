# rc-md2html
* a light react component to covert markdown into HTML
* 一款轻量的将markdown语法解析成HTML语言的react组件

### demo
![image](https://github.com//HarryChen0506/rc-md2html/blob/master/example/rc-md2html.PNG?raw=true)

### Install

```
npm install rc-md2html --save
```

### Props

| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| value | markdown content | String | '' |  |
| style | component container style | Object | {height: '100%'} |  |
| config | component config | Object | {view: {...}, logger: {...}} |  |
| config.view | component UI | Object | {menu: true, md: true, html: true} |  |
| config.logger | logger in order to undo or redo | Object | {interval: 3000} | |
| onChange | emitting when editor has changed | Function | ({html, md}) => {} |  |


### Basic Example
```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'rc-md2html'

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

### More Example
```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'rc-md2html'

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
              }
            }}
            onChange={this.handleEditorChange} 
          />
        </section>                        
      </div>      
    )
  }
}
```

