import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from './Plugin';

export default class Fonts extends PluginComponent {
  static pluginName = 'fonts';

  render() {
    return (
      <React.Fragment>
        <span
          className="button button-type-bold"
          title={i18n.get('btnBold')}
          onClick={() => this.editor.insertMarkdown('bold')}
        >
          <Icon type="icon-bold" />
        </span>
        <span
          className="button button-type-italic"
          title={i18n.get('btnItalic')}
          onClick={() => this.editor.insertMarkdown('italic')}
        >
          <Icon type="icon-italic" />
        </span>
        <span
          className="button button-type-underline"
          title={i18n.get('btnUnderline')}
          onClick={() => this.editor.insertMarkdown('underline')}
        >
          <Icon type="icon-underline" />
        </span>
        <span
          className="button button-type-strikethrough"
          title={i18n.get('btnStrikethrough')}
          onClick={() => this.editor.insertMarkdown('strikethrough')}
        >
          <Icon type="icon-strikethrough" />
        </span>
        <span
          className="button button-type-unordered"
          title={i18n.get('btnUnordered')}
          onClick={() => this.editor.insertMarkdown('unordered')}
        >
          <Icon type="icon-list-ul" />
        </span>
        <span
          className="button button-type-ordered"
          title={i18n.get('btnOrdered')}
          onClick={() => this.editor.insertMarkdown('order')}
        >
          <Icon type="icon-list-ol" />
        </span>
        <span
          className="button button-type-quote"
          title={i18n.get('btnQuote')}
          onClick={() => this.editor.insertMarkdown('quote')}
        >
          <Icon type="icon-quote-left" />
        </span>
        <span
          className="button button-type-hr"
          title={i18n.get('btnLineBreak')}
          onClick={() => this.editor.insertMarkdown('hr')}
        >
          <Icon type="icon-window-minimize" />
        </span>
        <span
          className="button button-type-inlinecode"
          title={i18n.get('btnInlineCode')}
          onClick={() => this.editor.insertMarkdown('inlinecode')}
        >
          <Icon type="icon-embed" />
        </span>
        <span
          className="button button-type-code"
          title={i18n.get('btnCode')}
          onClick={() => this.editor.insertMarkdown('code')}
        >
          <Icon type="icon-embed2" />
        </span>
      </React.Fragment>
    );
  }
}
