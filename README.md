# rc-md2html
一款轻量的将markdown语法解析成HTML语言的react组件

### demo
![image](https://github.com/HarryChen0506/rc-md2html/blob/master/example/rc-md2html.png)

### Install

```
npm install rc-md2html --save
```

### Example
```js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'rc-md2html'
import './index.less'
const mock_text = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
class Demo extends React.Component {
  handleEditorChange ({html, text}) {    
    console.log('handleEditorChange', html, text)
  }
  render() {
    return (      
        <div>
          <h3>示例</h3>
          <MdEditor 
            value={mock_content}
            style={{height: '500px'}}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              }
            }}
            onChange={this.handleEditorChange} 
          />                
        </div>      
    )
  }
}
export default Demo
```

