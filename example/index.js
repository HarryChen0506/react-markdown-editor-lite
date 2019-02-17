import React from 'react'
import ReactDOM from 'react-dom'

// import MdEditor from '../src/index.js'
import MdEditor from '../lib/rc-md2html.min.js'
import content  from './content.js'
import './index.less'
// const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
const mock_content = content

class Demo extends React.Component {

  handleEditorChange ({html, text}) {
    console.log('handleEditorChange', html, text)
  }

  render () {
    return (
      <div className="demo-wrap">
        <h3>rc-md2html demo</h3>  
        <div className="editor-wrap">
          <MdEditor 
            value={mock_content}
            style={{height: '500px', width: '100%'}}
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
      </div>      
    )
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
)