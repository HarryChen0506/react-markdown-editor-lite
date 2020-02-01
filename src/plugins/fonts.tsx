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
          <Icon type="bold" />
        </span>
        <span
          className="button button-type-italic"
          title={i18n.get('btnItalic')}
          onClick={() => this.editor.insertMarkdown('italic')}
        >
          <Icon type="italic" />
        </span>
        <span
          className="button button-type-underline"
          title={i18n.get('btnUnderline')}
          onClick={() => this.editor.insertMarkdown('underline')}
        >
          <Icon type="underline" />
        </span>
        <span
          className="button button-type-strikethrough"
          title={i18n.get('btnStrikethrough')}
          onClick={() => this.editor.insertMarkdown('strikethrough')}
        >
          <Icon type="strikethrough" />
        </span>
        <span
          className="button button-type-unordered"
          title={i18n.get('btnUnordered')}
          onClick={() => this.editor.insertMarkdown('unordered')}
        >
          <Icon type="list-unordered" />
        </span>
        <span
          className="button button-type-ordered"
          title={i18n.get('btnOrdered')}
          onClick={() => this.editor.insertMarkdown('order')}
        >
          <Icon type="list-ordered" />
        </span>
        <span
          className="button button-type-quote"
          title={i18n.get('btnQuote')}
          onClick={() => this.editor.insertMarkdown('quote')}
        >
          <Icon type="quote" />
        </span>
        <span
          className="button button-type-hr"
          title={i18n.get('btnLineBreak')}
          onClick={() => this.editor.insertMarkdown('hr')}
        >
          <Icon type="wrap" />
        </span>
        <span
          className="button button-type-inlinecode"
          title={i18n.get('btnInlineCode')}
          onClick={() => this.editor.insertMarkdown('inlinecode')}
        >
          <Icon type="code" />
        </span>
        <span
          className="button button-type-code"
          title={i18n.get('btnCode')}
          onClick={() => this.editor.insertMarkdown('code')}
        >
          <Icon type="code-block" />
        </span>
      </React.Fragment>
    );
  }
}
