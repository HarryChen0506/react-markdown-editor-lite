import MarkdownIt from 'markdown-it';
import React from 'react';
import ReactDOM from 'react-dom';
import MdEditor from '../src/index.js';
// import MdEditor from '../lib/react-markdown-editor-lite.min.js'
import content from './content.js';
import './index.less';
const mock_content = content


class Demo extends React.Component {

  mdEditor = null

  mdit = null

  constructor(props) {
    super(props)

    this.mdit = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })
  }

  handleEditorChange({ html, text }) {
    // console.log('handleEditorChange', text)
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
        return new Blob([u8arr], { type: mime })
      }
      const blob = convertBase64UrlToBlob(reader.result)
      setTimeout(() => {
        // setTimeout 模拟oss异步上传图片
        // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
        callback('https://avatars0.githubusercontent.com/u/21263805?s=40&v=4')
      }, 1000)
    }
    reader.readAsDataURL(file)
  }

  handleGetMdValue() {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue())
    }
  }

  handleGetHtmlValue() {
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
            value={mock_content}
            style={{ height: '500px', width: '100%' }}
            renderHTML={(text) => this.mdit.render(text)}
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
            value={mock_content_1}
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
        </div>  */}

      </div>
    )
  }
}

ReactDOM.render(
  <Demo />,
  document.getElementById('root')
)