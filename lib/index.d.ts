import * as React from 'react';

declare namespace ReactMarkdownEditorLite {
  export interface MdEditorProps {
    value: string;
    renderHTML: (text: string) => string | Promise;
    style?: React.HTMLAttributes.style;
    config?: {
      theme?: string;
      view?: {
        menu: boolean;
        md: boolean;
        html: boolean;
      },
      logger?: {
        interval: number;
      },
      synchScroll?: boolean;
      imageUrl?: string;
      linkUrl?: string;
      table?: {
        maxRow: number;
        maxCol: number;
      }
    }
    onChange?: (data: {
      text: string;
      html: string;
    }) => void;
    onImageUpload?: (file: File, callback: (url: string) => void) => void;
  }
  class MdEditor extends React.Component<MdEditorProps, any> {
  }
}

import MdEditor = ReactMarkdownEditorLite.MdEditor;

export default MdEditor;
