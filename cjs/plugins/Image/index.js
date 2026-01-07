"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/inheritsLoose"));

var React = _interopRequireWildcard(require("react"));

var _Icon = _interopRequireDefault(require("../../components/Icon"));

var _i18n = _interopRequireDefault(require("../../i18n"));

var _Plugin = require("../Plugin");

var _tool = require("../../utils/tool");

var _uploadPlaceholder = _interopRequireDefault(require("../../utils/uploadPlaceholder"));

var _inputFile = _interopRequireDefault(require("./inputFile"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Image = /*#__PURE__*/function (_PluginComponent) {
  (0, _inheritsLoose2.default)(Image, _PluginComponent);

  function Image(props) {
    var _this;

    _this = _PluginComponent.call(this, props) || this;
    _this.inputFile = void 0;
    _this.inputFile = /*#__PURE__*/React.createRef();
    _this.onImageChanged = _this.onImageChanged.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleCustomImageUpload = _this.handleCustomImageUpload.bind((0, _assertThisInitialized2.default)(_this));
    _this.handleImageUpload = _this.handleImageUpload.bind((0, _assertThisInitialized2.default)(_this));
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
      var placeholder = (0, _uploadPlaceholder.default)(file, onImageUpload);
      this.editor.insertPlaceholder(placeholder.placeholder, placeholder.uploaded);
    }
  };

  _proto.handleCustomImageUpload = function handleCustomImageUpload(e) {
    var _this2 = this;

    var onCustomImageUpload = this.editorConfig.onCustomImageUpload;

    if (onCustomImageUpload) {
      var res = onCustomImageUpload.call(this, e);

      if ((0, _tool.isPromise)(res)) {
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
      title: _i18n.default.get('btnImage'),
      onClick: this.handleCustomImageUpload
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "image"
    })) : /*#__PURE__*/React.createElement("span", {
      className: "button button-type-image",
      title: _i18n.default.get('btnImage'),
      onClick: this.handleImageUpload,
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(_Icon.default, {
      type: "image"
    }), /*#__PURE__*/React.createElement(_inputFile.default, {
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
}(_Plugin.PluginComponent);

exports.default = Image;
Image.pluginName = 'image';