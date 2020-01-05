// Icon
import React, { Component } from 'react'
import './font.less'

class Icon extends Component {
  render() {
    return (
      <span className={'rmel-' + this.props.type} />
    )
  }
}
export default Icon