import React from 'react'
import ReactDOM from 'react-dom'

import MdEditor from '../src/index.js'
import './index.less'
const mock_text = "#123"

class Hello extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      count: 1
    }
  } 
  
  handleClick (e) {
    // console.log('click me', e)
    const count = this.state.count
    this.setState({
      count: count + 1
    })
  }

  renderCount () {    
    return <span name="span">{this.state.count}</span>       
  }

  onEditorChange ({html, text, show}) {    
    console.log('onEditorChange', html, text, show)
  }

  render () {
    return (
      <div className="wrap">
        {this.renderCount()}
        <button onClick={this.handleClick}>click me</button>  
        <MdEditor value={mock_text} defaultShow="md" mdStyle={{color: '#fff'}} onChange={this.onEditorChange} />         
      </div>      
    )
  }
}

const Demo = (
  <div className={'title'} key={'title'}>
    <Hello name="harry"/>    
  </div>
)

ReactDOM.render(
  Demo,
  document.getElementById('root')
)