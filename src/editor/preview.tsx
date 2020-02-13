import * as React from 'react';

export type HtmlType = string | React.ReactElement;

export interface PreviewProps {
  html: HtmlType;
  className?: string;
  applyDefaultHtmlStyle?: boolean;
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
    const customHtmlStyle = this.props.applyDefaultHtmlStyle === undefined || this.props.applyDefaultHtmlStyle;
    const className = [customHtmlStyle ? 'custom-html-style' : '', this.props.className || ''].join(' ');

    return typeof this.props.html === 'string'
      ? React.createElement('div', {
          ref: this.el,
          dangerouslySetInnerHTML: { __html: this.props.html },
          className,
        })
      : React.createElement(
          'div',
          {
            ref: this.el,
            className,
          },
          this.props.html,
        );
  }
}

export default HtmlRender;
