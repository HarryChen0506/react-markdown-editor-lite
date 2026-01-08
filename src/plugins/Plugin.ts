import React from 'react';
import type Editor from '../editor';
import type { EditorConfig, PluginProps } from '../share/var';

export abstract class PluginComponent<
  S = any,
  C = any,
  P extends PluginProps = PluginProps<C>,
> extends React.Component<P, S> {
  static pluginName: string = '';

  static align: string = 'left';

  static defaultConfig = {};

  protected get editor(): Editor {
    return this.props.editor;
  }

  protected get editorConfig(): EditorConfig {
    return this.props.editorConfig;
  }

  protected get config(): C {
    return this.props.config;
  }

  protected getConfig(key: string, defaultValue?: any) {
    return typeof this.props.config[key] !== 'undefined' &&
      this.props.config[key] !== null
      ? this.props.config[key]
      : defaultValue;
  }
}
