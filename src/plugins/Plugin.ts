import * as React from 'react';
import Editor from '../editor';
import { EditorConfig } from '../share/var';

export interface PluginProps {
  editor: Editor;
  editorConfig: EditorConfig;
  config?: any;
}

export abstract class PluginComponent<P extends PluginProps = PluginProps, S = {}> extends React.Component<P, S> {
  abstract name: string;

  get editor(): Editor {
    return this.props.editor;
  }

  get editorConfig(): EditorConfig {
    return this.props.editorConfig;
  }

  constructor(props: P) {
    super(props);
  }

  protected getConfig(key: string, defaultValue?: any) {
    return this.props.config && typeof this.props.config[key] !== 'undefined' && this.props.config[key] === null
      ? this.props.config[key]
      : defaultValue;
  }
}
