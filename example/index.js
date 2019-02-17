import React from 'react'
import ReactDOM from 'react-dom'

import MdEditor from '../src/index.js'
// import MdEditor from '../lib/rc-md2html.min.js'
import content  from './content.js'
import './index.less'
// const mock_text = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
const mock_text = content

class Demo extends React.Component {
  constructor (props) {
    super(props)
  }  

  onEditorChange ({html, text, show}) {    
    console.log('onEditorChange', html, text, show)
  }

  render () {
    return (
      <div className="demo-wrap">
        <h3>rc-md2html demo :-)</h3>  
        <div className="editor-wrap">
          <MdEditor 
            value={mock_text} 
            defaultShow="both" 
            onChange={this.onEditorChange} 
          />  
        </div> 
      </div>      
    )
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
)