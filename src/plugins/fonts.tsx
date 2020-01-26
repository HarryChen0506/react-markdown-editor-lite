import Icon from 'components/Icon';
import * as React from 'react';
import { PluginComponent } from './Plugin';

export default class Fonts extends PluginComponent {
  name = 'fonts';

  render() {
    return (
      <React.Fragment>
        <span className="button button-type-bold" title="Bold" onClick={() => this.editor.insertMarkdown('bold')}>
          <Icon type="icon-bold" />
        </span>
        <span className="button button-type-italic" title="Italic" onClick={() => this.editor.insertMarkdown('italic')}>
          <Icon type="icon-italic" />
        </span>
        <span
          className="button button-type-underline"
          title="Underline"
          onClick={() => this.editor.insertMarkdown('underline')}
        >
          <Icon type="icon-underline" />
        </span>
        <span
          className="button button-type-strikethrough"
          title="Strikethrough"
          onClick={() => this.editor.insertMarkdown('strikethrough')}
        >
          <Icon type="icon-strikethrough" />
        </span>
        <span
          className="button button-type-unordered"
          title="Unordered list"
          onClick={() => this.editor.insertMarkdown('unordered')}
        >
          <Icon type="icon-list-ul" />
        </span>
        <span
          className="button button-type-ordered"
          title="Ordered list"
          onClick={() => this.editor.insertMarkdown('order')}
        >
          <Icon type="icon-list-ol" />
        </span>
        <span className="button button-type-quote" title="Quote" onClick={() => this.editor.insertMarkdown('quote')}>
          <Icon type="icon-quote-left" />
        </span>
        <span className="button button-type-hr" title="Line break" onClick={() => this.editor.insertMarkdown('hr')}>
          <Icon type="icon-window-minimize" />
        </span>
        <span
          className="button button-type-inlinecode"
          title="Inline code"
          onClick={() => this.editor.insertMarkdown('inlinecode')}
        >
          <Icon type="icon-embed" />
        </span>
        <span className="button button-type-code" title="Block code" onClick={() => this.editor.insertMarkdown('code')}>
          <Icon type="icon-embed2" />
        </span>
      </React.Fragment>
    );
  }
}
