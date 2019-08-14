import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MdEditor from '../editor';
import * as MarkdownIt from 'markdown-it';
import content from './content';
import './index.less';

const MOCK_DATA = content

class Demo extends React.Component {

  mdEditor?: MdEditor = undefined

  mdParser?: MarkdownIt = undefined

  constructor(props: any) {
    super(props)
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        /*
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }
        return '' // use external default escaping
        */
      }
    })
  }

  handleEditorChange = (it: any) => {
    console.log('handleEditorChange', it)
  }

  handleImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader()
    reader.onload = (_: ProgressEvent) => {
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
            ref={node => this.mdEditor = node || undefined}
            value={MOCK_DATA}
            style={{ height: '500px', width: '100%' }}
            renderHTML={(text) => this.mdParser ? this.mdParser.render(text) : ""}
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
  document.getElementById('app')
)