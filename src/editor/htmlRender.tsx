import React from 'react'

import { Preview, PreviewProps } from './preview';

class HtmlRender extends React.Component<PreviewProps, any> implements Preview {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.html }} className={`custom-html-style ${this.props.className || ""}`} />
    )
  }
}

export default HtmlRender;