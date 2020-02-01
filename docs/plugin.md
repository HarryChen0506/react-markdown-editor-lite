# 插件
## 插件可以干什么？
插件可以往工具栏添加按钮，并操作编辑器的内容。
## 使用插件
参见[API文档](./api.md)
## 内置插件
内置以下插件：
* header：标题
* fonts：字体相关，如加粗、斜体等
* table：表格
* image：图片上传
* link：超链接
* clear：清空内容
* logger：历史记录（撤销、重做）
* mode-toggle：显示模式切换
* full-screen：全屏模式切换
```js
['header', 'fonts', 'table', 'image', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen']
```
## Demo
```js
import Editor from 'react-markdown-editor-lite';
import MyPlugin from './MyPlugin';

Editor.use(MyPlugin);

// 这里去掉了内置的image插件
const plugins = ['header', 'fonts', 'table', 'my-plugins', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen'];
<Editor plugins={plugins} />
```
## 编写插件
插件本身是一个React Component，需要继承自PluginComponent。

在PluginComponent中，可以：
* 通过`this.editor`获取编辑器实例，调用所有编辑器API。
* 通过`this.editorConfig`获取编辑器的设置。
* 通过`this.config`获取use时传入的数据。

下面，我们编写一个计数器，每次点击均往编辑器中插入一个递增的数字。起始数字从use时传入的选项读取。
```js
import { PluginComponent } from 'react-markdown-editor-lite';

interface CounterState {
  num: number;
}

class Counter extends PluginComponent<CounterState> {
  // 这里定义插件名称，注意不能重复
  static pluginName = 'counter';
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
  static align = 'left';
  
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      num: this.config.start
    };
  }

  handleClick() {
    // 调用API，往编辑器中插入一个数字
    this.editor.insertText(this.state.num);
    // 更新一下自身的state
    this.setState({
      num: this.state.num++
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

# Plugins
## What can plugins do?
Plugins can insert buttons into menu bar, and control editor's content.
## Use a plugin
See [API documention](./api.md)
## Built-in plugins
Those plugins are built-in plugin:
* header: title
* fonts: about fonts, such as bold, italic
* table: table
* image: image upload
* link: hyperlinks
* clear: clear texts
* logger: history(undo/redo)
* mode-toggle: toggle view mode
* full-screen: toggle full screen
```js
['header', 'fonts', 'table', 'image', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen']
```
## Demo
```js
import Editor from 'react-markdown-editor-lite';
import MyPlugin from './MyPlugin';

Editor.use(MyPlugin);

// Remove built-in image plugin here
const plugins = ['header', 'fonts', 'table', 'my-plugins', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen'];
<Editor plugins={plugins} />
```
## Written a plugin
Plugin is a React Component, and must extend PluginComponent.

In PluginComponent, you can:
* Get editor instance by `this.editor`, and call all editor's APIs.
* Get editor's config by `this.editorConfig`.
* Get the options passed in use by `this.config`.

In following, we written a counter, insert an increasing number into the editor with each click. The starting number is read from the options passed in use.
```js
import { PluginComponent } from 'react-markdown-editor-lite';

interface CounterState {
  num: number;
}

class Counter extends PluginComponent<CounterState> {
  // Define plugin name here, must be unique
  static pluginName = 'counter';
  // Define which place to be render, default is left, you can aslo use 'right'
  static align = 'left';
  
  constructor(props: any) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.state = {
      num: this.config.start
    };
  }

  handleClick() {
    // Call API, insert number to editor
    this.editor.insertText(this.state.num);
    // Update itself's state
    this.setState({
      num: this.state.num++
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


// Usage:
Editor.use(Counter, {
  start: 10
});
```