import React from 'react'
import ReactDOM from 'react-dom'

import MdEditor from '../src/index.js'
// import MdEditor from '../lib/rc-md2html.min.js'
import content  from './content.js'
import './index.less'
const mock_content = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
// const mock_content = "### Hello :-)\n "
// const mock_content = content

class Demo extends React.Component {

  mdEditor = null

  handleEditorChange = ({html, text}) => {
    // console.log('handleEditorChange', text)
  }

  handleGetMdValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue())      
    }
  }

  handleGetHtmlValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getHtmlValue())      
    }
  }

  render () {
    return (
      <div className="demo-wrap">
        <h3>rc-md2html demo</h3>  
        <nav className="nav">
          <button onClick={this.handleGetMdValue} >getMdValue</button>  
          <button onClick={this.handleGetHtmlValue} >getHtmlValue</button>  
        </nav>
        <div className="editor-wrap">
          <MdEditor 
            ref={node => this.mdEditor = node}
            value={mock_content}
            style={{height: '300px', width: '100%'}}
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