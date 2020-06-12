# Plugins
[中文文档见此](./plugin.zh-CN.md)
## What can plugins do?
Plugins can insert buttons into menu bar, and control editor's content.
## Use a plugin
See [API documention](./api.md)
## Built-in plugins
### Plugins list
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
* auto-resize：auto-resize plugin (Disabled by default)
```js
['header', 'fonts', 'table', 'image', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen']
```
### Use auto-resize plugin
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.AutoResize, {
  min: 200, // min height
  max: 600, // max height
});
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
### Demo
[View online](https://codesandbox.io/s/rmel-demo-write-plugin-p82fc)
### Normal
Plugin is a React Component, and must extend PluginComponent.

In PluginComponent, you can:
* Get editor instance by `this.editor`, and call all editor's APIs.
* Get editor's config by `this.editorConfig`.
* Get the options passed in use by `this.getConfig` or `this.props.config`.

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
  // Define default config if required
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

### Function component
You can aslo use function component to write a plugin
```js
import * as React from 'react';
import { PluginProps } from 'react-markdown-editor-lite';

interface CounterState {
  num: number;
}

const Counter = (props: PluginProps) => {
  const [num, setNum] = React.useState(props.config.start);
  
  const handleClick = () => {
    // Call API, insert number to editor
    props.editor.insertText(num);
    // Update itself's state
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
// Define default config if required
Counter.defaultConfig = {
  start: 0
}
Counter.align = 'left';
Counter.pluginName = 'counter';


// Usage:
Editor.use(Counter, {
  start: 10
});
```
## Is it possible not to render any UI ?
Yes, just return a empty element (such as `<span></span>`, etc) in `render` method.