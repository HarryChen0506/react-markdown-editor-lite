import { UploadFunc } from 'src/share/var';
import { v4 as uuid } from 'uuid';
import getDecorated from './decorate';
import { isPromise } from './tool';

function getUploadPlaceholder(file: File, onImageUpload: UploadFunc) {
  const placeholder = getDecorated('', 'image', {
    target: 'Uploading_' + uuid(),
    imageUrl: '',
  }).text;
  const uploaded = new Promise((resolve: (url: string) => void) => {
    const handleUploaded = (url: string) => {
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
      upload.then(handleUploaded);
    }
  });
  return { placeholder, uploaded };
}

export default getUploadPlaceholder;
