import React, { Component } from 'react'
import './index.less'

class ToolBar extends Component {
  render() {
    return (
      <div className="tool-bar" style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}
export default ToolBar