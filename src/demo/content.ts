const content =  `
# 手把手教你写一个markdown编辑器
### 前言
>笔者在18年年末的时候接到一个开发任务——搭建一个AI项目的开放平台，其中的产品文档为转化为HTML格式的markdown文档。考虑到文档的即时更新，将文档信息做成了Ajax接口的形式。因此管理后台只需将textarea表单的内容通过markdown解析器进行HTML格式转化，然后将markdown内容和经转化的HTML文档都保存到数据库即可。
> 基本需求完成后，为了更好的用户体验，考虑将常用的编辑功能添加进来。改进版不仅支持了常用的文本编辑功能，还实现的UI界面的配置化，自定义语法解析器。本着造福伸手党的目的，以及积累些开源经验，笔者将该react 组件 [react-markdown-editor-lite](https://github.com/HarryChen0506/react-markdown-editor-lite) 进行了封装改造，并且发布到了开源社区。

### 预览
在线体验 [https://harrychen0506.github.io/react-markdown-editor-lite/](https://harrychen0506.github.io/react-markdown-editor-lite/)

![image](https://github.com//HarryChen0506/react-markdown-editor-lite/blob/master/example/react-markdown-editor-lite-v-0-3-6.PNG?raw=true)

### 特点
* 轻量、基于React
* UI可配置, 如只显示编辑区或预览区
* 支持自定义markdown语法解析器,语法高亮等
* 支持常用的markdown编辑功能，如加粗，斜体等等...
* 支持编辑区和预览区同步滚动

### 开发心得

- 文本编辑

  大多数常见的编辑器，包括富文本编辑器，利用了某些元素如div的contenteditable属性，配合selection、range、execCommand等API，实现了富文本编辑功能。这里面的实现比较复杂，所以有了"[为什么都说富文本编辑器是天坑？](https://www.zhihu.com/question/38699645)"这个说法。

  而markdown编辑器，核心的处理内容为简单语法的纯文本，复杂度相对来说比较低，并且input标签自带onSelect事件，可以很方便的获取选择信息（选择起始位置和选择文本值），因此要想实现编辑功能，只需将要改动的内容进行文本转换，然后进行重新拼接首尾，大功告成。
  
- markdown解析

  考察了几个社区流行的markdown解析器，比较流行的有[markdown](https://www.npmjs.com/package/markdown), [markdown-it](https://www.npmjs.com/package/markdown-it), [marked](https://www.npmjs.com/package/marked) 等等。综合考虑扩展性以及稳定性，笔者推荐使用markdown-it作为markdown的词法解析器，因为该解析器有比较多的插件，并且支持语法高亮。

- 同步滚动

  当选择分栏编辑的时候，滚动左侧的编辑区，右侧的预览区能自动滚动到对应的区域。方案参考了《[手把手教你用 100行代码实现基于 react的 markdown 输入 + 即时预览在线编辑器（一）](https://github.com/accforgit/blog-data/blob/master/%E5%9C%A8%E7%BA%BF%E7%BC%96%E8%BE%91%E5%99%A8/README/README1.md)》。只需先计算出输入框容器元素与预览框容器元素之间最大scroll范围的比例值，然后根据主动滚动元素自身的scrollTop做相应的比例换算，即可知道对方区域的scrollTop值。

- 关于UI
 
  - 项目的字体库选择了Font Awesome风格，并且只选取了项目所需要的一些图标。
  - 编辑器的整体css均可通过全局覆盖的形式进行自定义。目前暂时只支持灰色主题。
  - 编辑器的显示区域包括菜单栏，编辑器，预览区，工具栏，通过配置组件的config属性，可以选择默认的展示区域。
  
### Install

\`\`\`
npm install react-markdown-editor-lite --save
\`\`\`

### Props

| Property | Description | Type | default | Remarks |
| --- | --- | --- | --- | --- |
| value | markdown content | String | '' | required |
| style | component container style | Object | {height: '100%'} | not required |

### Example

\`\`\` js
'use strict';
import React from 'react'
import ReactDOM from 'react-dom'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import subscript from 'markdown-it-sub'
import superscript from 'markdown-it-sup'
import footnote from 'markdown-it-footnote'
import deflist from 'markdown-it-deflist'
import abbreviation from 'markdown-it-abbr'
import insert from 'markdown-it-ins'
import mark from 'markdown-it-mark'
import tasklists from 'markdown-it-task-lists'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
// import 'highlight.js/styles/github.css'
import './index.less';

const MOCK_DATA = "Love it or leave it."
export default class Demo extends React.Component {
  mdEditor = null
  mdParser = null
  constructor(props) {
    super(props)
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }    
        return '' // use external default escaping
      }
    })
    .use(emoji)
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists, { enabled: this.taskLists })
    this.renderHTML = this.renderHTML.bind(this)
  }
  handleEditorChange({html, md}) {
    console.log('handleEditorChange', html, md)
  }
  handleImageUpload(file, callback) {
    const reader = new FileReader()
    reader.onload = () => {      
      const convertBase64UrlToBlob = (urlData) => {  
        let arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {type:mime})
      }
      const blob = convertBase64UrlToBlob(reader.result)
      setTimeout(() => {
        // setTimeout 模拟异步上传图片
        // 当异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
        callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
      }, 1000)
    }
    reader.readAsDataURL(file)
  }
  renderHTML(text) {
    // 模拟异步渲染Markdown
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.mdParser.render(text))
      }, 1000)
    })
  }
  handleGetMdValue = () => {   
    this.mdEditor && alert(this.mdEditor.getMdValue())      
  }
  handleGetHtmlValue = () => {    
    this.mdEditor && alert(this.mdEditor.getHtmlValue())
  }
  render() {
    return (      
      <div>
        <nav>
          <button onClick={this.handleGetMdValue} >getMdValue</button>  
          <button onClick={this.handleGetHtmlValue} >getHtmlValue</button>  
        </nav>
        <section style="height: 500px">
          <MdEditor 
            ref={node => this.mdEditor = node}
            value={MOCK_DATA}
            style={{height: '400px'}}
            renderHTML={this.renderHTML}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
            onImageUpload={this.handleImageUpload}
          />
        </section>                        
      </div>      
    )
  }
}
\`\`\`

### 最后

   欢迎大家使用和反馈，[项目地址](https://github.com/HarryChen0506/react-markdown-editor-lite) (https://github.com/HarryChen0506/react-markdown-editor-lite)， 你的点赞将是我莫大的动力😊

`
export default content