# 插件
[English documentation see here](./plugin.md)
## 插件可以干什么？
插件可以往工具栏添加按钮，并操作编辑器的内容。
## 使用和卸载插件
参见[API文档](./api.zh-CN.md)
## 内置插件
### 插件列表
内置以下插件：
* header：标题
* font-bold：加粗
* font-italic：斜体
* font-underline：下划线
* font-strikethrough：删除线
* list-unordered：无序列表
* list-ordered：有序列表
* block-quote：引用
* block-wrap：换行
* block-code-inline：行内代码
* block-code-block：块状代码
* table：表格
* image：图片上传
* link：超链接
* clear：清空内容
* logger：历史记录（撤销、重做）
* mode-toggle：显示模式切换
* full-screen：全屏模式切换
* auto-resize：编辑器自动调整尺寸插件（默认不启用）
* tab-insert：插入制表符或空格（默认不启用）
```js
[
  'header',
  'font-bold',
  'font-italic',
  'font-underline',
  'font-strikethrough',
  'list-unordered',
  'list-ordered',
  'block-quote',
  'block-wrap',
  'block-code-inline',
  'block-code-block',
  'table',
  'image',
  'link',
  'clear',
  'logger',
  'mode-toggle',
  'full-screen',
  'tab-insert'
]
```

* 如果启用了`logger`插件，则会自动注册`undo`和`redo`两个API，可通过`callPluginApi`调用。

### 卸载内置插件
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.unuse(Plugins.Header); // header
Editor.unuse(Plugins.FontBold); // font-bold
```
### 使用自动调整尺寸插件
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.AutoResize, {
  min: 200, // 最小高度
  max: 600, // 最大高度
});
```
### 使用 tab 输入插件
在默认情况下，用户在 Markdown 编辑区按下 Tab 键时会失去输入焦点，可以使用内置的 Tab 输入插件来解决这个问题。
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.TabInsert, {
  /**
   * 用户按下 Tab 键时输入的空格的数目
   * 特别地，1 代表输入一个'\t'，而不是一个空格
   * 默认值是 1
   */
  tabMapValue: 1,
});
```
### 插入分隔线

`divider` 是一个特殊的插件，你不能卸载它，但你也不需要手动添加它。如果你想在工具栏上插入一个分隔符，将 `divider` 添加到 `plugins` 数组中即可。

```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

const plugins = ['header', 'table', 'divider', 'link', 'clear', 'divider', 'font-bold'];

<Editor plugins={plugins} />
```
## Demo
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';
import MyPlugin from './MyPlugin';

Editor.use(MyPlugin);

// 卸载掉所有编辑器的Header插件
Editor.unuse(Plugins.Header);

// 这里去掉了内置的image插件，仅单个编辑器生效
const plugins = ['header', 'table', 'my-plugins', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen'];
<Editor plugins={plugins} />
```
## 带自定义插件的NextJS Demo
```js
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

const MdEditor = dynamic(
  () => {
    return new Promise((resolve) => {
      Promise.all([
        import("react-markdown-editor-lite"),
        import("./plugin")
      ]).then((res) => {
        res[0].default.use(res[1].default);
        resolve(res[0].default);
      });
    });
  },
  {
    ssr: false
  }
);
```
## 编写插件
### Demo
[在线查看](https://codesandbox.io/s/rmel-demo-write-plugin-p82fc)
### 普通方式
插件本身是一个React Component，需要继承自PluginComponent。

在PluginComponent中，可以：
* 通过`this.editor`获取编辑器实例，调用所有编辑器API。
* 通过`this.editorConfig`获取编辑器的设置。
* 通过`this.getConfig`或`this.props.config`获取use时传入的数据。

下面，我们编写一个计数器，每次点击均往编辑器中插入一个递增的数字。起始数字从use时传入的选项读取。
```js
import { PluginComponent } from 'react-markdown-editor-lite';

interface CounterState {
  num: number;
}

class Counter extends PluginComponent<CounterState> {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'counter';
  // 定义按钮被放置在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left';
  // 如果需要的话，可以在这里定义默认选项
  static defaultConfig = {
    start: 0
  }
  
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      num: this.getConfig('start')
    };
  }

  handleClick() {
    // 调用API，往编辑器中插入一个数字
    this.editor.insertText(this.state.num);
    // 更新一下自身的state
    this.setState({
      num: this.state.num + 1
    });
  }

  render() {
    return (
      <span
        className="button button-type-counter"
        title="Counter"
        onClick={this.handleClick}
      >
        {this.state.num}
      </span>
    );
  }
}


// 使用：
Editor.use(Counter, {
  start: 10
});
```
### 函数组件
同样可以使用函数组件来编写插件
```js
import React from 'react';
import { PluginProps } from 'react-markdown-editor-lite';

interface CounterState {
  num: number;
}

const Counter = (props: PluginProps) => {
  const [num, setNum] = React.useState(props.config.start);
  
  const handleClick = () => {
    // 调用API，往编辑器中插入一个数字
    props.editor.insertText(num);
    // 更新一下自身的state
    setNum(num + 1);
  }

  return (
    <span
      className="button button-type-counter"
      title="Counter"
      onClick={handleClick}
    >
      {num}
    </span>
  );
}
// 如果需要的话，可以在这里定义默认选项
Counter.defaultConfig = {
  start: 0
}
Counter.align = 'left';
Counter.pluginName = 'counter';

// 使用：
Editor.use(Counter, {
  start: 10
});
```

## 是否可以不渲染任何UI？
可以，`render`函数返回一个空元素即可，例如返回`<span></span>`
