import * as React from 'react';
import Icon from 'src/components/Icon';
import i18n from 'src/i18n';
import { PluginComponent } from 'src/plugins/Plugin';
import { isPromise } from 'src/utils/tool';
import getUploadPlaceholder from 'src/utils/uploadPlaceholder';
import InputFile from './inputFile';

interface State {
  show: boolean;
}

export default class Image extends PluginComponent<State> {
  static pluginName = 'image';

  private inputFile: React.RefObject<InputFile>;

  constructor(props: any) {
    super(props);

    this.inputFile = React.createRef();
    this.onImageChanged = this.onImageChanged.bind(this);
    this.handleCustomImageUpload = this.handleCustomImageUpload.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);

    this.state = {
      show: false,
    };
  }

  private handleImageUpload() {
    const { onImageUpload } = this.editorConfig;
    if (typeof onImageUpload === 'function') {
      if (this.inputFile.current) {
        this.inputFile.current.click();
      }
    } else {
      this.editor.insertMarkdown('image');
    }
  }

  private onImageChanged(file: File) {
    const { onImageUpload } = this.editorConfig;
    if (onImageUpload) {
      const placeholder = getUploadPlaceholder(file, onImageUpload);
      this.editor.insertPlaceholder(placeholder.placeholder, placeholder.uploaded);
    }
  }

  private handleCustomImageUpload(e: any) {
    const { onCustomImageUpload } = this.editorConfig;
    if (onCustomImageUpload) {
      const res = onCustomImageUpload.call(this, e);
      if (isPromise(res)) {
        res.then(result => {
          if (result && result.url) {
            this.editor.insertMarkdown('image', {
              target: result.text,
              imageUrl: result.url,
            });
          }
        });
      }
    }
  }

  render() {
    const isCustom = !!this.editorConfig.onCustomImageUpload;
    return isCustom ? (
      <span className="button button-type-image" title={i18n.get('btnImage')} onClick={this.handleCustomImageUpload}>
        <Icon type="image" />
      </span>
    ) : (
      <span
        className="button button-type-image"
        title={i18n.get('btnImage')}
        onClick={this.handleImageUpload}
        style={{ position: 'relative' }}
      >
        <Icon type="image" />
        <InputFile
          accept={this.editorConfig.imageAccept || ''}
          ref={this.inputFile}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();
            if (e.target.files && e.target.files.length > 0) {
              this.onImageChanged(e.target.files[0]);
            }
          }}
        />
      </span>
    );
  }
}
