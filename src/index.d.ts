import * as React from 'react';

declare namespace ReactMarkdownEditorLite {
  export interface MdEditorProps {
    name: string;
    value: string;
    renderHTML: (text: string) => string | Promise<string>;
    style?: React.CSSProperties;
    config?: {
      theme?: string;
      view?: {
        menu: boolean;
        md: boolean;
        html: boolean;
      };
      htmlClass?: string;
      markdownClass?: string;
      logger?: {
        interval: number;
      };
      synchScroll?: boolean;
      imageUrl?: string;
      imageAccept?: string;
      linkUrl?: string;
      table?: {
        maxRow: number;
        maxCol: number;
      }
    }
    onChange?: (data: {
      text: string;
      html: string;
    }, event: any) => void;
    onImageUpload?: (file: File, callback: (url: string) => void) => void;
  }
  class MdEditor extends React.Component<MdEditorProps, any> {
  }
}

import MdEditor = ReactMarkdownEditorLite.MdEditor;

export default MdEditor;
