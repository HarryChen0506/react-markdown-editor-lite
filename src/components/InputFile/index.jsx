// TableList
import React, { Component } from 'react'
import './index.less'

class InputFile extends Component {
  constructor(props) {
    super(props)
  }

  click() {
    if (this.locked) {
      return
    }
    this.locked = true
    this.input.value = ''
    this.input.click()
    this.timerId && clearTimeout(this.timerId)
    this.timerId = setTimeout(() => { this.locked = false }, 200)
  }

  componentWillUnmount() {
    this.timerId && clearTimeout(this.timerId)
  }

  render() {
    return (
      <input type="file"
        ref={(el) => { this.input = el }}
        accept={this.props.accept}
        style={{
          position: 'absolute',
          zIndex: -1,
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          opacity: 0,
        }}
        onChange={this.props.onChange} />
    )
  }
}
export default InputFile