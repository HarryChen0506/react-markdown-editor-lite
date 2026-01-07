import { v4 as uuid } from 'uuid';
import getDecorated from './decorate';
import { isPromise } from './tool';

function getUploadPlaceholder(file, onImageUpload) {
  var placeholder = getDecorated('', 'image', {
    target: "Uploading_" + uuid(),
    imageUrl: ''
  }).text;
  var uploaded = new Promise(function (resolve) {
    var isCallback = true;

    var handleUploaded = function handleUploaded(url) {
      if (isCallback) {
        console.warn('Deprecated: onImageUpload should return a Promise, callback will be removed in future');
      }

      resolve(getDecorated('', 'image', {
        target: file.name,
        imageUrl: url
      }).text);
    }; // 兼容回调和Promise


    var upload = onImageUpload(file, handleUploaded);

    if (isPromise(upload)) {
      isCallback = false;
      upload.then(handleUploaded);
    }
  });
  return {
    placeholder: placeholder,
    uploaded: uploaded
  };
}

export default getUploadPlaceholder;