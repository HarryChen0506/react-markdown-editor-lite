import { UploadFunc } from '../share/var';
declare function getUploadPlaceholder(file: File, onImageUpload: UploadFunc): {
    placeholder: string;
    uploaded: Promise<string>;
};
export default getUploadPlaceholder;
