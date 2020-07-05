import * as MarkdownIt from 'markdown-it';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactMarkdown from 'react-markdown';
import MdEditor, { Plugins } from '../index';
import content from './content';
import './index.less';

const MOCK_DATA = content;

const PLUGINS = undefined;
// const PLUGINS = ['header', 'image', 'full-screen'];

// MdEditor.use(Plugins.AutoResize, {
//   min: 200,
//   max: 800
// });

class Demo extends React.Component<any, any> {
  mdEditor?: MdEditor = undefined;

  mdParser: MarkdownIt;

  constructor(props: any) {
    super(props);
    this.renderHTML = this.renderHTML.bind(this);
    // initial a parser
    this.mdParser = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight(str, lang) {
        /*
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }
        return '' // use external default escaping
        */
      },
    });

    this.state = {
      value: MOCK_DATA,
    };
  }

  handleEditorChange = (it: { text: string; html: string }, event: any) => {
    // console.log('handleEditorChange', it.text, it.html, event);
    this.setState({
      value: it.text,
    });
  };

  handleImageUpload = (file: File): Promise<string> => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = data => {
        // @ts-ignore
        resolve(data.target.result);
      };
      reader.readAsDataURL(file);
    });
  };

  onCustomImageUpload = (event: any): Promise<any> => {
    console.log('onCustomImageUpload', event);
    return new Promise((resolve, reject) => {
      const result = window.prompt('Please enter image url here...') as string;
      resolve({ url: result });
      // custom confirm message pseudo code
      // YourCustomDialog.open(() => {
      //   setTimeout(() => {
      //     // setTimeout 模拟oss异步上传图片
      //     // 当oss异步上传获取图片地址后，执行calback回调（参数为imageUrl字符串），即可将图片地址写入markdown
      //     const url = 'https://avatars0.githubusercontent.com/u/21263805?s=80&v=4'
      //     resolve({url: url, name: 'pic'})
      //   }, 1000)
      // })
    });
  };

  handleGetMdValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getMdValue());
    }
  };

  handleGetHtmlValue = () => {
    if (this.mdEditor) {
      alert(this.mdEditor.getHtmlValue());
    }
  };

  handleSetValue = () => {
    const text = window.prompt('Content');
    this.setState({
      value: text,
    });
  };

  renderHTML(text: string) {
    // return this.mdParser.render(text);
    // Using react-markdown
    return React.createElement(ReactMarkdown, {
      source: text,
    });
  }

  render() {
    return (
      <div className="demo-wrap">
        <h3>react-markdown-editor-lite demo</h3>
        <nav className="nav">
          <button onClick={this.handleGetMdValue}>getMdValue</button>
          <button onClick={this.handleGetHtmlValue}>getHtmlValue</button>
          <button onClick={this.handleSetValue}>setValue</button>
        </nav>
        <div className="editor-wrap" style={{ marginTop: '30px' }}>
          <MdEditor
            ref={node => (this.mdEditor = node || undefined)}
            value={this.state.value}
            style={{ height: '500px', width: '100%' }}
            renderHTML={this.renderHTML}
            plugins={PLUGINS}
            config={{
              view: {
                menu: true,
                md: true,
                html: true,
                fullScreen: true,
                hideMenu: true,
              },
              table: {
                maxRow: 5,
                maxCol: 6,
              },
              imageUrl: 'https://octodex.github.com/images/minion.png',
              syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
            }}
            onChange={this.handleEditorChange}
            onImageUpload={this.handleImageUpload}
            onFocus={e => console.log('focus', e)}
            onBlur={e => console.log('blur', e)}
            // onCustomImageUpload={this.onCustomImageUpload}
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
    );
  }
}

ReactDOM.render(<Demo />, document.getElementById('app'));
