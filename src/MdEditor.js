// markdown editor 
import React from 'react'
import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'
import NavigationBar from './NavigationBar'
import Icon from './Icon'
import ToolBar from './ToolBar'
import _config from './config'
import './index.less'

export class HtmlRender extends React.Component {
  render() {
    return (      
      <div dangerouslySetInnerHTML = {{ __html: this.props.html}} className={'custom-html-style'} />  
    )
  }
}

class MdEditor extends React.Component {
  constructor(props) {
    super(props)    
    this.config = this.initConfig()
    this.state = {
      text: (this.props.value || '').replace(/↵/g,'\n'),
      html: '',      
      view: this.config.view
    }
  } 

  config = {}

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

  initConfig = () => {
    return Object.assign({}, _config, this.props.config)
  }

  renderHTML = (markdownText = '') => { 
    return this.mdjs.render(markdownText)
  }

  changeView = (key = 'md', val = true) =>{
    const view = {...this.state.view, ...{
      [key]: val
    }}
    this.setState({
      view: view
    })
  }

  handleToggleMenu = () => {
    const {view} = this.state
    this.changeView('menu', !view.menu)
  }

  handleMdPreview = () => {
    const {view} = this.state
    this.changeView('html', !view.html)
  }

  handleHtmlPreview = () => {
    const {view} = this.state
    this.changeView('md', !view.md)
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
    const { view } = this.state
    const renderContent = () => {       
      const { html, text, view } = this.state 
      const MD = (
        <section className={'sec-md'}>
          <ToolBar
            render={
              <>
                <a className="button" title="hidden menu" onClick={this.handleToggleMenu}><Icon type="icon-chevron-up"/></a>
                <a className="button" title="copy"><Icon type="icon-copy"/></a>
                <a className="button" title="preview" onClick={this.handleHtmlPreview}><Icon type="icon-desktop"/></a>
                <a className="button" title="empty"><Icon type="icon-expand"/></a>
              </>
            }
          ></ToolBar>
          <textarea
            id="textarea"
            ref={node => this.textarea = node}
            value={text}
            className={'input'}
            wrap="hard"
            onChange={this.handleChange}
          />
        </section>
      );
      const PREVIEW = (
        <section className={'sec-html'}>
          <ToolBar
            style={{right: '15px'}}
            render={
              <>
                <a className="button" title="hidden menu" onClick={this.handleToggleMenu}><Icon type="icon-chevron-up"/></a>
                <a className="button" title="copy"><Icon type="icon-copy"/></a>
                <a className="button" title="preview" onClick={this.handleHtmlPreview}><Icon type="icon-desktop"/></a>
                <a className="button" title="empty"><Icon type="icon-expand"/></a>
              </>
            }
          ></ToolBar>
          <div className="html-wrap">
            <HtmlRender html={html}/> 
          </div>
        </section>
      )      
      return (
        <>
          {view.md && MD}
          {view.html && PREVIEW}
        </>
      )
    }
    return ( 
      <div className={'rc-md2html-editor'}>
        {view.menu && <NavigationBar />}
        <div className="editor-container">          
          {renderContent()}
        </div>        
      </div>
    )
  }
}
MdEditor.HtmlRender = HtmlRender
export default MdEditor