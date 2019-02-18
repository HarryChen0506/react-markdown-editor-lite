// markdown editor 
import React from 'react'
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

import Logger from './logger'
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

class HtmlCode extends React.Component {
  render() {
    return ( 
      <textarea className="html-code" value={this.props.html} onChange={() => {}}></textarea>
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
      view: this.config.view,
      htmlType: 'render', // 'render' 'source'
    }
  } 

  config = {}

  logger = {}

  loggerTimerId = null

  mdjs = null  

  mdText = null

  componentDidMount() {
    this.init()
    this.initLogger()
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

  UNSAFE_componentWillUnmount () {
    this.endLogger()
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
    .use(subscript)
    .use(superscript)
    .use(footnote)
    .use(deflist)
    .use(abbreviation)
    .use(insert)
    .use(mark)
    .use(tasklists, { enabled: this.taskLists })

    this.setState({
      html: this.renderHTML(value)
    })
  }

  initConfig = () => {
    return Object.assign({}, _config, this.props.config)
  }

  initLogger = () => {
    this.logger = new Logger()
    this.startLogger()
  }

  startLogger = () => {    
    if (!this.loggerTimerId) {
      this.loggerTimerId = setInterval(() => {
        const {text} = this.state
        if (this.logger.getLastRecord() !== text) {
          this.logger.pushRecord(text)        
        }
      }, this.config.logger.interval)
    }   
    // 清空redo历史
    this.logger.cleanRedoList() 
  }

  endLogger = () => {
    if (this.loggerTimerId) {
      clearInterval(this.loggerTimerId)
      this.loggerTimerId = null
    }    
  }

  handleGetLogger = () => {
    console.log('handleGetLogger', this.logger)
  }

  handleUndo = () => {
    this.logger.undo((last) => {
      this.endLogger()
      this._setMdText(last)
    })
  }

  handleRedo = () => {
    this.logger.redo((last) => {
      this._setMdText(last)
    })
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
    }, () => {
      // console.log('state', this.state)
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

  hanldeToggleHtmlType = () => {
    let {htmlType} = this.state
    if (htmlType === 'render') {
      htmlType = 'source'
    } else if (htmlType === 'source') {
      htmlType = 'render'
    }
    this.setState({
      htmlType: htmlType
    })
  }

  handleEmpty = () => {
    if (window.confirm) {
      const result = window.confirm('Are you sure to empty markdown ?')
      if (result) {
        this.setState({
          text: '',
          html: ''
        })
      }
    }    
  }

  handleChange = (e) => {
    this.startLogger() 
    const value = e.target.value   
    this._setMdText(value)
  }
  _setMdText = (value = '') => {
    // console.log('value', {value: value.replace(/[\n]/g,'\\n')})
    // const text = value.replace(/[\n]/g,'\\n')
    const text = value.replace(/↵/g,'\n')
    const html = this.renderHTML(text)
    this.setState({
      html,
      text: value
    })
    this.onEmit({
      text,
      html
    })
  }

  onEmit = (output) => {
    const { onChange } = this.props;
    onChange && onChange(output)
  }  

  getMdValue = () => {    
    return this.state.text
  }

  getHtmlValue = () => {
    return this.state.html
  }

  render() {    
    const { view } = this.state
    const renderNavigation = () => {
      return view.menu && 
      <NavigationBar 
        left={
          <div className="button-wrap">
            <span className="button" title="empty" onClick={this.handleEmpty}><Icon type="icon-trash-o"/></span>            
            {/* <span className="button" title="show" onClick={this.handleGetLogger}><Icon type="icon-tablet"/></span> */}
            <span className="button" title="undo" onClick={this.handleUndo}><Icon type="icon-reply"/></span>
            <span className="button" title="redo" onClick={this.handleRedo}><Icon type="icon-share"/></span>
          </div> 
        }
      />
    }
    const renderContent = () => {       
      const { html, text, view, htmlType } = this.state 
      const MD = (
        <section className={'sec-md'}>
          <ToolBar
            render={
              <>
                <span className="button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                  {view.menu ? <Icon type="icon-chevron-up"/> 
                    :<Icon type="icon-chevron-down"/>
                  }
                </span>
                <span className="button" title={view.html ? 'preview' : 'both'} onClick={this.handleMdPreview}>
                  {view.html ? <Icon type="icon-desktop"/> 
                    :<Icon type="icon-columns"/>
                  }
                </span>                
              </>
            }
          ></ToolBar>
          <textarea
            id="textarea"
            ref={node => this.mdText = node}
            value={text}
            className={'input'}
            wrap="hard"
            onChange={this.handleChange}
          />
        </section>
      )
      const PREVIEW = (
        <section className={'sec-html'}>
          <ToolBar
            style={{right: '20px'}}
            render={
              <>
                <span className="button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                  {view.menu ? <Icon type="icon-chevron-up"/> 
                    :<Icon type="icon-chevron-down"/>
                  }
                </span>
                <span className="button" title={view.md ? 'preview' : 'both'} onClick={this.handleHtmlPreview}>
                  {view.md ? <Icon type="icon-desktop"/> 
                    :<Icon type="icon-columns"/>
                  }
                </span>
                <span className="button" title="HTML code" onClick={this.hanldeToggleHtmlType}>
                  {htmlType === 'render' ? <Icon type="icon-code"/>
                    : <Icon type="icon-eye"/>
                  }
                </span>
              </>
            }
          ></ToolBar>          
          {htmlType === 'render' ? 
            <div className="html-wrap"><HtmlRender html={html}/></div>
            : <div className={'html-code-wrap'}><HtmlCode html={html}/></div>
          }  
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
      <div className={'rc-md2html-editor'} style={this.props.style}>
        {renderNavigation()}
        <div className="editor-container">          
          {renderContent()}
        </div>        
      </div>
    )
  }
}
MdEditor.HtmlRender = HtmlRender
export default MdEditor