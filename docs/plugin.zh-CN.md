# 插件
[English documention see here](./plugin.md)
## 插件可以干什么？
插件可以往工具栏添加按钮，并操作编辑器的内容。
## 使用插件
参见[API文档](./api.zh-CN.md)
## 内置插件
### 插件列表
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
* auto-resize：编辑器自动调整尺寸插件（默认不启用）
```js
['header', 'fonts', 'table', 'image', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen']
```
### 使用自动调整尺寸插件
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.AutoResize, {
  min: 200, // 最小高度
  max: 600, // 最大高度
});
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
  // 定义按钮被防止在哪个位置，默认为左侧，还可以放置在右侧（right）
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
import * as React from 'react';
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
