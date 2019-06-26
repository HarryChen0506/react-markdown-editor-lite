import React from 'react'
import { Preview, PreviewProps } from './preview';

class HtmlCode extends React.Component<PreviewProps, any> implements Preview {
  render() {
    return (
      <textarea className={`html-code ${this.props.className || ""}`} value={this.props.html} onChange={() => { }}></textarea>
    )
  }
}

export default HtmlCode;