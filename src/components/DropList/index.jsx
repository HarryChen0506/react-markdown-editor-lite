// DropList
import React, { Component } from 'react'
import './index.less'

class DropList extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this._handleClose.bind(this);
  }
  _handleClose(e) {
    e.stopPropagation()
    const { onClose } = this.props
    typeof onClose === 'function' && onClose()
  }
  render() {
    return (
      <div className={`drop-wrap ${this.props.show ? 'show' : 'hidden'}`} onClick={this.handleClose}>
        {typeof this.props.render === 'function' && this.props.render()}
      </div>
    )
  }
}
export default DropList