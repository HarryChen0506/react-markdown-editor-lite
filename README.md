# rc-md2html
一款轻量的将markdown语法解析成HTML语言的react组件

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
  handleEditorChange ({html, text, show}) {    
    console.log('handleEditorChange', html, text, show)
  }
  render() {
    return (      
        <div>
          <h3>示例</h3>
          <MdEditor 
            value={mock_text} 
            defaultShow="md" 
            mdStyle={{color: '#fff'}} 
            onChange={this.handleEditorChange}
          />                
        </div>      
    )
  }
}
export default Demo
```

