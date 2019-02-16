import React from 'react'
import ReactDOM from 'react-dom'

import MdEditor from '../src/index.js'
// import MdEditor from '../lib/rc-md2html.min.js'

import './index.less'
// const mock_text = "Hello.\n\n * This is markdown.\n * It is fun\n * Love it or leave it."
const mock_text = `
  ### [Emojies](https://github.com/markdown-it/markdown-it-emoji)

  > Classic markup: :wink: :crush: :cry: :tear: :laughing: :yum:

  > Shortcuts (emoticons): :-) :-( 8-) ;)

  see [how to change output](https://github.com/markdown-it/markdown-it-emoji#change-output) with twemoji.
`

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
          <MdEditor value={mock_text} defaultShow="both" mdStyle={{color: '#fff'}} onChange={this.onEditorChange} />  
        </div> 
      </div>      
    )
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
)