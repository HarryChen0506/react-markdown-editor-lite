# Plugins
[中文文档见此](./plugin.zh-CN.md)
## What can plugins do?
Plugins can insert buttons into menu bar, and control editor's content.
## Use or un-use a plugin
See [API documentation](./api.md)
## Built-in plugins
### Plugins list
Those plugins are built-in plugin:
* header: title
* font-bold: bold
* font-italic: italic
* font-underline: underline
* font-strikethrough: strikethrough
* list-unordered: unordered
* list-ordered: ordered
* block-quote: quote
* block-wrap: wrap new line
* block-code-inline: inline code
* block-code-block: block code
* table: table
* image: image upload
* link: hyperlinks
* clear: clear texts
* logger: history (undo/redo)
* mode-toggle: toggle view mode
* full-screen: toggle full screen
* auto-resize: auto-resize plugin (disabled by default)
* tab-insert: insert tab or spaces (disabled by default)
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

* If you enabled `logger` plugin, it will auto register `undo` and `redo` API, you can use them with `callPluginApi`.

### Un-use a built-in plugin
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.unuse(Plugins.Header); // header
Editor.unuse(Plugins.FontBold); // font-bold
```
### Use auto-resize plugin
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.AutoResize, {
  min: 200, // min height
  max: 600, // max height
});
```
### Use tab-insert plugin
By default, Markdown Editor will lose input focus when user type a Tab key. You can use the built-in tab-insert plugin to solve this problem.
```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

Editor.use(Plugins.TabInsert, {
  /**
   * Number of spaces will be inputted when user type a Tab key. 
   * Especially, note that 1 means a '\t' instead of ' '.
   * Default value is 1.
   */
  tabMapValue: 1,
});
```
### Insert dividers

`divider` is a special plugin, you can not un-use it, and you also shouldn't use it. If you want to insert a divider into toolbar, just put `divider` into the `plugins` array.

```js
import Editor, { Plugins } from 'react-markdown-editor-lite';

const plugins = ['header', 'table', 'divider', 'link', 'clear', 'divider', 'font-bold'];

<Editor plugins={plugins} />
```

## Demo
```js
import Editor, { Plugins }  from 'react-markdown-editor-lite';
import MyPlugin from './MyPlugin';

Editor.use(MyPlugin);

// Remove built-in header plugin here, in all editors
Editor.unuse(Plugins.Header);

// Remove built-in image plugin here, only this editor
const plugins = ['header', 'table', 'my-plugins', 'link', 'clear', 'logger', 'mode-toggle', 'full-screen'];
<Editor plugins={plugins} />
```

## Written a plugin
### Demos
* [Demo](https://codesandbox.io/s/rmel-demo-write-plugin-p82fc)
* [SSR Demo](https://codesandbox.io/s/next-js-80bne)
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
  // Define which place to be render, default is left, you can also use 'right'
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
You can also use function component to write a plugin
```js
import React from 'react';
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
