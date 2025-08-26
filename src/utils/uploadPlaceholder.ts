import { nanoid } from 'nanoid';
import type { UploadFunc } from '../share/var';
import getDecorated from './decorate';
import { isPromise } from './tool';

function getUploadPlaceholder(file: File, onImageUpload: UploadFunc) {
  const placeholder = getDecorated('', 'image', {
    target: `Uploading_${nanoid()}`,
    imageUrl: '',
  }).text;
  const uploaded = new Promise((resolve: (url: string) => void) => {
    let isCallback = true;
    const handleUploaded = (url: string) => {
      if (isCallback) {
        console.warn(
          'Deprecated: onImageUpload should return a Promise, callback will be removed in future',
        );
      }
      resolve(
        getDecorated('', 'image', {
          target: file.name,
          imageUrl: url,
        }).text,
      );
    };
    // 兼容回调和Promise
    const upload = onImageUpload(file, handleUploaded);
    if (isPromise(upload)) {
      isCallback = false;
      upload.then(handleUploaded);
    }
  });
  return { placeholder, uploaded };
}

export default getUploadPlaceholder;
