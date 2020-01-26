import { EditorConfig } from 'share/var';

const defaultConfig: EditorConfig = {
  theme: 'default',
  view: {
    menu: true,
    md: true,
    html: true,
    fullScreen: true,
  },
  htmlClass: '',
  markdownClass: '',
  logger: {
    interval: 800,
  },
  syncScrollMode: ['rightFollowLeft', 'leftFollowRight'],
  imageUrl: '',
  imageAccept: '',
  linkUrl: '',
  table: {
    maxRow: 4,
    maxCol: 6,
  },
  clearTip: 'Are you sure you want to clear your markdown ?',
  allowPasteImage: true,
  onPasteImage: (image: File) => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        // @ts-ignore
        resolve(data.target.result);
      };
      reader.readAsDataURL(image);
    });
  },
};

export default defaultConfig;
