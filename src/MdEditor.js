// markdown editor 
import React from 'react'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import NavigationBar from './NavigationBar'
import Icon from './Icon'
import './index.less'

export class HtmlRender extends React.Component {
  render() {
    return (
      <div className={'html-wrap'}>
        <div dangerouslySetInnerHTML = {{ __html: this.props.html}} className={'custom-html-style'} />
      </div>
    )
  }
}

class MdEditor extends React.Component {

  constructor(props) {
    super(props)    
    this.state = {
      text: (this.props.value || '').replace(/↵/g,'\n'),
      html: '',
      showType: this.props.defaultShow || 'md', // 展示区域 md, preview, both      
    }
  }  

  mdjs = null

  componentDidMount() {
    this.init()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) {
      // console.log('value not change')
      return
    }   
    let { value } = nextProps    
    const {text} = this.state
    value = value && value.replace(/↵/g, '\n')    
    this.setState({
      text: value,
      html: this.renderHTML(value)
    })
  }

  init = () => {
    const { value } = this.props
    this.mdjs = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })
    // 插件
    this.mdjs.use(emoji)

    this.setState({
      html: this.renderHTML(value)
    })
  }

  handleShowMd = () => {
    this.setState({
      showType: 'md',
    })
  }

  handleShowPreview = () => {
    this.setState({
      showType: 'preview',
    })
  }

  handleShowAll = () => {
    this.setState({
      showType: 'both',
    })
  } 

  renderHTML = (markdownText = '') => { 
    return this.mdjs.render(markdownText)
  }

  handleChange = (e) => {
    const value = e.target.value   
    // console.log('value', {value: value.replace(/[\n]/g,'\\n')})
    // const text = value.replace(/[\n]/g,'\\n')
    const text = value.replace(/↵/g,'\n')
    const html = this.renderHTML(text)
    const {showType} = this.state
    this.setState({
      html,
      text: value
    })
    this.onEmit({
      text,
      html,
      show: showType
    })
  }

  onEmit = (output) => {
    const { onChange } = this.props;
    onChange && onChange(output)
  }  

  render() {
    const renderControl = () => {
      const { showType } = this.state;
      const mdClass = showType === 'md' ? 'checked' : '';
      const previewClass = showType === 'preview' ? 'checked' : '';
      const bothClass = showType === 'both' ? 'checked' : '';
      return (
        <div className={'ctrl-wrap'}>  
          <button className={mdClass} onClick={this.handleShowMd}>
            MD
          </button>
          <button className={previewClass} onClick={this.handleShowPreview}>
            预览
          </button> 
          <button className={bothClass} onClick={this.handleShowAll}>
            全部
          </button>
        </div> 
      )
    }
    const renderContent = () => {
      const { mdStyle } = this.props;
      const { html, text, showType } = this.state;    
      const MD = (
        <div className={'input-wrap'}>
          <textarea
            id="textarea"
            ref={node => this.textarea = node}
            value={text}
            style={mdStyle}
            className={'input'}
            wrap="hard"
            onChange={this.handleChange}
          />
        </div>
      );
      const PREVIEW = (
        <HtmlRender html={html}/>
      ); 
      if (showType === 'md') {
        return MD
      } else if (showType === 'preview') {
        return PREVIEW
      } else if (showType === 'both') {
        return (
          <>
            {MD}
            {PREVIEW}
          </>
        )
      }
    };
    return ( 
      <div className={'rc-md2html-editor'}>
        <NavigationBar />
        <div className="editor-container">          
          {renderContent()}
        </div>        
      </div>
    )
  }
}
MdEditor.HtmlRender = HtmlRender
export default MdEditor