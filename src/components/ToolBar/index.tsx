import * as React from 'react'
import './index.less'

interface ToolBarProps {
  style?: React.CSSProperties;
}

class ToolBar extends React.Component<ToolBarProps, any> {
  render() {
    return (
      <div className="tool-bar" style={this.props.style}>
        {this.props.children}
      </div>
    )
  }
}
export default ToolBar