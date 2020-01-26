import * as React from 'react';
import * as ReactDOM from 'react-dom';

export type HtmlType = string | React.ReactElement;

export interface PreviewProps {
  html: HtmlType;
  className?: string;
}

export abstract class Preview<T extends HTMLElement> extends React.Component<PreviewProps, any> {
  protected el: React.RefObject<T>;
  constructor(props: any) {
    super(props);
    this.el = React.createRef();
  }
  abstract getHtml(): string;
  getHeight() {
    return this.el.current ? this.el.current.offsetHeight : 0;
  }
}

function getHtmlFromReact(node: React.ReactElement) {
  return '';
  // const element = document.createElement("div");
  // ReactDOM.render(node, element);
  // return element.innerHTML;
}

export class HtmlCode extends Preview<HTMLTextAreaElement> {
  getHtml() {
    return typeof this.props.html === 'string' ? this.props.html : getHtmlFromReact(this.props.html);
  }
  render() {
    return (
      <textarea
        ref={this.el}
        className={`html-code ${this.props.className || ''}`}
        value={this.getHtml()}
        onChange={() => {}}
      />
    );
  }
}

export class HtmlRender extends Preview<HTMLDivElement> {
  getHtml() {
    if (typeof this.props.html === 'string') {
      return this.props.html;
    }
    if (this.el.current) {
      return this.el.current.innerHTML;
    } else {
      return '';
    }
  }
  render() {
    return typeof this.props.html === 'string'
      ? React.createElement('div', {
          ref: this.el,
          dangerouslySetInnerHTML: { __html: this.props.html },
          className: `custom-html-style ${this.props.className || ''}`,
        })
      : React.createElement(
          'div',
          {
            ref: this.el,
            className: `custom-html-style ${this.props.className || ''}`,
          },
          this.props.html,
        );
  }
}

export default HtmlRender;
