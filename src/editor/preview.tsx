import React from 'react'

export interface PreviewProps {
  html: string;
  className?: string;
}

export abstract class Preview<T extends HTMLElement> extends React.Component<PreviewProps, any> {
  protected el: React.RefObject<T>;
  constructor(props: any) {
    super(props);
    this.el = React.createRef();
  }
  getHeight() {
    return this.el.current ? this.el.current.offsetHeight : 0;
  }
}

export class HtmlCode extends Preview<HTMLTextAreaElement> {
  render() {
    return (
      <textarea ref={this.el} className={`html-code ${this.props.className || ""}`} value={this.props.html} onChange={() => { }}></textarea>
    )
  }
}

export class HtmlRender extends Preview<HTMLDivElement> {
  render() {
    return (
      <div ref={this.el} dangerouslySetInnerHTML={{ __html: this.props.html }} className={`custom-html-style ${this.props.className || ""}`} />
    )
  }
}

export default HtmlRender;