import React from 'react'
import './index.less'

class ToolBar extends React.Component {
  render() {
    return (
      <div className="tool-bar" style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}
export default ToolBar