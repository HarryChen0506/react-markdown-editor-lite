# react-markdown-editor-lite

[![NPM package][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![Workflow][workflow-image]][workflow-url]

[中文说明](README_CN.md)

- A light-weight(20KB zipped) Markdown editor of React component
- Supports TypeScript
- Supports custom markdown parser
- Full markdown support
- Supports pluggable function bars
- Full control over UI
- Supports image uploading and dragging
- Supports synced scrolling between editor and preview
- 一款轻量的基于 React 的 Markdown 编辑器, 压缩后代码只有 20KB
- 支持 TypeScript
- 支持自定义 Markdown 解析器
- 支持常用的 Markdown 编辑功能，如加粗，斜体等等...
- 支持插件化的功能键
- 界面可配置, 如只显示编辑区或预览区
- 支持图片上传或拖拽
- 支持编辑区和预览区同步滚动

## Demo

Online demo <br>[https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)

Default configuration

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/image/react-markdown-editor-lite-v1.0.0.PNG?raw=true)

Pluggable bars

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/image/react-markdown-editor-lite-v1.0.0-plugins.PNG?raw=true)

## Install

```shell
npm install react-markdown-editor-lite --save
# or
yarn add react-markdown-editor-lite
```

## Basic usage

Following steps:

- Import react-markdown-editor-lite
- Register plugins if required
- Initialize a markdown parser, such as markdown-it
- Start usage

```js
// import react, react-markdown-editor-lite, and a markdown parser you like
import React from 'react';
import * as ReactDOM from 'react-dom';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}
export default props => {
  return (
    <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
  );
};
```

- Props and configurations see [here](./docs/configure.md)
- APIs see [here](./docs/api.md)
- Plugins developer see [here](./docs/plugin.md)
- Full demo see [src/demo/index.tsx](https://github.com/HarryChen0506/react-markdown-editor-lite/blob/master/src/demo/index.tsx)

## Usage in server-side render

If you are using a server-side render framework, like Next.js, Gatsby, please use client-side render for this editor.

For example, Next.js has [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import), Gatsby has [loadable-components](https://www.gatsbyjs.org/docs/using-client-side-only-packages/#workaround-3-load-client-side-dependent-components-with-loadable-components)

Following is a example for Next.js:

```js
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

export default function() {
  return <MdEditor style={{ height: '500px' }} renderHTML={/* Render function */} />;
}
```

With plugins:

```js
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(
  () => {
    return new Promise(resolve => {
      Promise.all([
        import('react-markdown-editor-lite'),
        import('./my-plugin'),
        /** Add more plugins, and use below */
      ]).then(res => {
        res[0].default.use(res[1].default);
        resolve(res[0].default);
      });
    });
  },
  {
    ssr: false,
  },
);

export default function() {
  return <MdEditor style={{ height: '500px' }} renderHTML={/* Render function */} />;
}
```

Full example see [here](https://codesandbox.io/s/next-js-80bne)

## Import in Browser

Since 1.1.0, You can add `script` and `link` tags in your browser and use the global variable `ReactMarkdownEditorLite`.

You can download these files directly from [![cdnjs][cdnjs-image]][cdnjs-url] [![jsdelivr][jsdelivr-image]][jsdelivr-url] [![unpkg][unpkg-image]][unpkg-url]

Note: you should import react before `ReactMarkdownEditorLite`.

For example, in webpack, you import ReactMarkdownEditorLite by `script` tag in your page, and write webpack config like this:

```js
externals: {
  react: 'React',
  'react-markdown-editor-lite': 'ReactMarkdownEditorLite'
}
```

## More demos
* [Basic usage](https://codesandbox.io/s/rmel-demo-ref-in-function-component-u04gb)
* [With unform](https://codesandbox.io/s/rmel-demo-with-unform-qx34y)
* [Write a plugin](https://codesandbox.io/s/rmel-demo-write-plugin-p82fc)
* [Replace default icons](https://codesandbox.io/s/rmel-demo-replace-icon-pl1n3)
* [In Next.js](https://codesandbox.io/s/next-js-80bne)

## Authors

- ShuangYa [github/sylingd](https://github.com/sylingd)
- HarryChen0506 [github/HarryChen0506](https://github.com/HarryChen0506)

## License

[MIT](LICENSE)

[npm-version-image]: https://img.shields.io/npm/v/react-markdown-editor-lite.svg
[npm-downloads-image]: https://img.shields.io/npm/dm/react-markdown-editor-lite.svg?style=flat
[npm-url]: https://www.npmjs.com/package/react-markdown-editor-lite
[workflow-image]: https://img.shields.io/github/workflow/status/HarryChen0506/react-markdown-editor-lite/main
[workflow-url]: https://github.com/HarryChen0506/react-markdown-editor-lite/actions?query=workflow%3Amain
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE
[jsdelivr-image]: https://img.shields.io/jsdelivr/npm/hm/react-markdown-editor-lite
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/react-markdown-editor-lite?path=lib
[cdnjs-image]: https://img.shields.io/cdnjs/v/react-markdown-editor-lite?style=flat
[cdnjs-url]: https://cdnjs.com/libraries/react-markdown-editor-lite
[unpkg-image]: https://img.shields.io/npm/v/react-markdown-editor-lite?label=unpkg&style=flat
[unpkg-url]: https://unpkg.com/browse/react-markdown-editor-lite/lib/
