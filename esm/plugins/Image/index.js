import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import * as React from 'react';
import Icon from '../../components/Icon';
import i18n from '../../i18n';
import { PluginComponent } from '../Plugin';
import { isPromise } from '../../utils/tool';
import getUploadPlaceholder from '../../utils/uploadPlaceholder';
import InputFile from './inputFile';

var Image = /*#__PURE__*/function (_PluginComponent) {
  _inheritsLoose(Image, _PluginComponent);

  function Image(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.inputFile = void 0;
    _this.inputFile = /*#__PURE__*/React.createRef();
    _this.onImageChanged = _this.onImageChanged.bind(_assertThisInitialized(_this));
    _this.handleCustomImageUpload = _this.handleCustomImageUpload.bind(_assertThisInitialized(_this));
    _this.handleImageUpload = _this.handleImageUpload.bind(_assertThisInitialized(_this));
    _this.state = {
      show: false
    };
    return _this;
  }

  var _proto = Image.prototype;

  _proto.handleImageUpload = function handleImageUpload() {
    var onImageUpload = this.editorConfig.onImageUpload;

    if (typeof onImageUpload === 'function') {
      if (this.inputFile.current) {
        this.inputFile.current.click();
      }
    } else {
      this.editor.insertMarkdown('image');
    }
  };

  _proto.onImageChanged = function onImageChanged(file) {
    var onImageUpload = this.editorConfig.onImageUpload;

    if (onImageUpload) {
      var placeholder = getUploadPlaceholder(file, onImageUpload);
      this.editor.insertPlaceholder(placeholder.placeholder, placeholder.uploaded);
    }
  };

  _proto.handleCustomImageUpload = function handleCustomImageUpload(e) {
    var _this2 = this;

    var onCustomImageUpload = this.editorConfig.onCustomImageUpload;

    if (onCustomImageUpload) {
      var res = onCustomImageUpload.call(this, e);

      if (isPromise(res)) {
        res.then(function (result) {
          if (result && result.url) {
            _this2.editor.insertMarkdown('image', {
              target: result.text,
              imageUrl: result.url
            });
          }
        });
      }
    }
  };

  _proto.render = function render() {
    var _this3 = this;

    var isCustom = !!this.editorConfig.onCustomImageUpload;
    return isCustom ? /*#__PURE__*/React.createElement("span", {
      className: "button button-type-image",
      title: i18n.get('btnImage'),
      onClick: this.handleCustomImageUpload
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "image"
    })) : /*#__PURE__*/React.createElement("span", {
      className: "button button-type-image",
      title: i18n.get('btnImage'),
      onClick: this.handleImageUpload,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      type: "image"
    }), /*#__PURE__*/React.createElement(InputFile, {
      accept: this.editorConfig.imageAccept || '',
      ref: this.inputFile,
      onChange: function onChange(e) {
        e.persist();

        if (e.target.files && e.target.files.length > 0) {
          _this3.onImageChanged(e.target.files[0]);
        }
      }
    }));
  };

  return Image;
}(PluginComponent);

Image.pluginName = 'image';
export { Image as default };