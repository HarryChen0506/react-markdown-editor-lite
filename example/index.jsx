import React from 'react';
import ReactDOM from 'react-dom';
import MdEditor from '../src/index.js';
// import MdEditor from '../lib/index.js'
import MarkdownIt from 'markdown-it';
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
// import content from './content.js';
import content from './content.1.js';
import './index.less';

const MOCK_DATA = content

class Demo extends React.Component {

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
  }

  handleEditorChange = ({ html, text}, event) => {
    console.log('handleEditorChange', event)
  }

  handleImageUpload = (file, callback) => {
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
        return new Blob([u8arr], { type: mime })
      }
      const blob = convertBase64UrlToBlob(reader.result)
      setTimeout(() => {
        // setTimeout 模拟oss异步上传图片
        // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
        const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
        callback(url)
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  handleGetMdValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue())
    }
  }

  handleGetHtmlValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getHtmlValue())
    }
  }

  render() {
    return (
      <div className="demo-wrap">
        <h3>react-markdown-editor-lite demo</h3>
        <nav className="nav">
          <button onClick={this.handleGetMdValue} >getMdValue</button>
          <button onClick={this.handleGetHtmlValue} >getHtmlValue</button>
        </nav>
        <div className="editor-wrap" style={{ marginTop: '30px' }}>
          <MdEditor
            ref={node => this.mdEditor = node}
            value={MOCK_DATA}
            style={{ height: '500px', width: '100%' }}
            renderHTML={(text) => this.mdParser.render(text)}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              table: {
                maxRow: 5,
                maxCol: 6
              },
              imageUrl: 'https://octodex.github.com/images/minion.png',
            }}
            onChange={this.handleEditorChange}
            onImageUpload={this.handleImageUpload}
          />
        </div>
        {/* <div style={{marginTop: '30px'}}>
          <MdEditor
            value={MOCK_DATA}
            style={{height: '200px', width: '100%'}}
            config={{
              view: {
                menu: true,
                md: true,
                html: true
              },
              imageUrl: 'https://octodex.github.com/images/minion.png'
            }}
            onChange={this.handleEditorChange} 
          />  
        </div> */}
      </div>
    )
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
)