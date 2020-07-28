import * as React from 'react';

export type UploadFunc = ((file: File) => Promise<string>) | ((file: File, callback: (url: string) => void) => void);

export type EditorEvent = 'change' | 'fullscreen' | 'viewchange' | 'keydown' | 'focus' | 'blur' | 'scroll';

export interface EditorConfig {
  theme?: string;
  name?: string;
  view?: {
    menu: boolean;
    md: boolean;
    html: boolean;
  };
  canView?: {
    menu: boolean;
    md: boolean;
    html: boolean;
    fullScreen: boolean;
    hideMenu: boolean;
  };
  htmlClass?: string;
  markdownClass?: string;
  imageUrl?: string;
  imageAccept?: string;
  linkUrl?: string;
  table?: {
    maxRow: number;
    maxCol: number;
  };
  syncScrollMode?: string[];
  allowPasteImage?: boolean;
  onImageUpload?: UploadFunc;
  onCustomImageUpload?: (event: any) => Promise<{ url: string; text?: string }>;
  shortcuts?: boolean;
}

export interface Selection {
  start: number;
  end: number;
  text: string;
}

export const initialSelection: Selection = {
  start: 0,
  end: 0,
  text: '',
};

export type KeyboardEventCallback = (e: React.KeyboardEvent<HTMLDivElement>) => void;
export interface KeyboardEventListener {
  key?: string;
  keyCode: number;
  withKey?: ('ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey')[];
  callback: KeyboardEventCallback;
}
