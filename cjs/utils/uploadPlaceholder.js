"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _uuid = require("uuid");

var _decorate = _interopRequireDefault(require("./decorate"));

var _tool = require("./tool");

function getUploadPlaceholder(file, onImageUpload) {
  var placeholder = (0, _decorate.default)('', 'image', {
    target: "Uploading_" + (0, _uuid.v4)(),
    imageUrl: ''
  }).text;
  var uploaded = new Promise(function (resolve) {
    var isCallback = true;

    var handleUploaded = function handleUploaded(url) {
      if (isCallback) {
        console.warn('Deprecated: onImageUpload should return a Promise, callback will be removed in future');
      }

      resolve((0, _decorate.default)('', 'image', {
        target: file.name,
        imageUrl: url
      }).text);
    }; // 兼容回调和Promise


    var upload = onImageUpload(file, handleUploaded);

    if ((0, _tool.isPromise)(upload)) {
      isCallback = false;
      upload.then(handleUploaded);
    }
  });
  return {
    placeholder: placeholder,
    uploaded: uploaded
  };
}

var _default = getUploadPlaceholder;
exports.default = _default;