// markdown editor 
import React from 'react'
import ReactDOM from 'react-dom'
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
// import hljs from 'highlight.js'

import tool from '../utils/tool'
import Logger from '../utils/logger'
import Decorate from '../utils/decorate'
import NavigationBar from '../components/NavigationBar'
import DropList from '../components/DropList'
import HeaderList from '../components/HeaderList'
import TableList from '../components/TableList'
import InputFile from '../components/InputFile'
import Icon from '../components/Icon'
import ToolBar from '../components/ToolBar'
import _config from '../config.js'

import './index.less'
// import 'highlight.js/styles/github.css'

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
      text: (this.formatString(this.props.value) || '').replace(/↵/g,'\n'),
      html: '',      
      view: this.config.view,
      htmlType: 'render', // 'render' 'source'
      dropButton: {
        header: false,
        table: false
      },
      fullScreen: false,
      table: this.config.table
    }
  } 

  config = {}

  logger = {}

  loggerTimerId = null

  mdjs = null  

  nodeMdText = null

  nodeMdPreview = null

  nodeMdPreviewWraper = null

  inputFile = null

  scale = 0

  willScrollEle = '' // 即将滚动的元素 md html

  hasContentChanged = true
  
  initialSelection = {
    isSelected: false,
    start: 0,
    end: 0,
    text: ''
  }

  selection = {...this.initialSelection}

  componentDidMount() {
    this.init()
    this.initLogger()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) {
      // console.log('value not change')
      return
    }   
    let { value } = nextProps    
    value = this.formatString(value)
    value = value && value.replace(/↵/g, '\n')    
    this.setState({
      text: value,
      html: this.renderHTML(value)
    })
  }

  componentWillUnmount () {
    this.endLogger()
  }

  init = () => {
    let { value } = this.props
    value = this.formatString(value)
    this.mdjs = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      // highlight: function (str, lang) {
      //   if (lang && hljs.getLanguage(lang)) {
      //     try {
      //       return hljs.highlight(lang, str).value
      //     } catch (__) {}
      //   }    
      //   return '' // use external default escaping
      // }
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

  formatString = (value) => {
    if (typeof this.props.value !== 'string') {
      console && console.error && console.error('The type of "value" must be String!')
      return new String(value).toString()
    } 
    return value
  }

  initConfig = () => {
    return {..._config, ...this.props.config}
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

  handleDecorate = (type, option={}) => {
    const clearList = [
      'h1', 
      'h2', 
      'h3', 
      'h4', 
      'h5', 
      'h6', 
      'bold', 
      'italic', 
      'underline', 
      'strikethrough', 
      'unorder', 
      'order',
      'quote',
      'hr',
      'inlinecode',
      'code',
      'table',
      'image', 
      'link'
    ]
    if (clearList.indexOf(type) > -1) {
      if (!this.selection.isSelected) {
        return
      }
      const content = this._getDecoratedText(type, option)
      this._setMdText(content)
      this._clearSelection()
    } else {
      const content = this._getDecoratedText(type, option)
      this._setMdText(content)
    }    
  }

  _getDecoratedText = (type, option) => {
    const {text = ''} = this.state
    const {selection} = this
    const beforeContent = text.slice(0, selection.start)
    const afterContent = text.slice(selection.end, text.length)
    const decorate = new Decorate(selection.text)
    let decoratedText = ''
    if (type === 'image') {
      decoratedText = decorate.getDecoratedText(type, {
        imageUrl: option.imageUrl || this.config.imageUrl
      })
    } else if (type === 'link') {
      decoratedText = decorate.getDecoratedText(type, {
        linkUrl: this.config.linkUrl
      })
    } else {
      decoratedText = decorate.getDecoratedText(type, option)
    }
    const result = beforeContent + `${decoratedText}` + afterContent
    return result
  }

  renderHTML = (markdownText) => { 
    if (typeof markdownText === 'string' ) {
      return this.mdjs.render(markdownText)
    }
    return ''
  }

  handleToggleFullScreen = () => {
    const {fullScreen} = this.state
    this.setState({
      fullScreen: !fullScreen
    })
  }

  changeView = (key = 'md', val = true) =>{
    const view = {...this.state.view, ...{
      [key]: val
    }}
    this.setState({
      view: view
    }, () => {
    })
  }

  handleToggleMenu = () => {
    const {view} = this.state
    this.changeView('menu', !view.menu)
  }

  handleToggleView = (type) => {
    if (type === 'md') {
      const view = {...this.state.view, ...{
        md: false,
        html: true
      }}
      this.setState({
        view: view
      })
    } else {
      const view = {...this.state.view, ...{
        md: true,
        html: false
      }}
      this.setState({
        view: view
      })
    }
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

  handleImageUpload = () => {
    const {onImageUpload} = this.props
    if (typeof onImageUpload === 'function') {
      this.inputFile && this.inputFile.click()
    } else {
      this.handleDecorate('image')
    }    
  }

  onImageChanged = (file) => {
    const {onImageUpload} = this.props
    onImageUpload(file, (imageUrl) => {
      this.handleDecorate('image', {imageUrl})
    })
  }

  handleChange = (e) => {
    this.startLogger() 
    const value = e.target.value   
    if (!this.hasContentChanged) {
      this.hasContentChanged = true
    }
    this._setMdText(value)
  }

  handleInputSelect = (e) => {
    e.persist()    
    this.selection = {...this.selection, ...{isSelected: true}, ...this._getSelectionInfo(e)}
    // console.log('handleInputSelect', e, this.selection)
  }

  handleScrollEle = (node) => {
    this.willScrollEle = node
  }

  handleInputScroll = tool.throttle((e) => {
    const {synchScroll} = this.config
    if (!synchScroll) {
      return
    }
    e.persist()    
    if (this.willScrollEle === 'md') {
      this.hasContentChanged && this._setScrollValue()  
      this.nodeMdPreviewWraper.scrollTop = this.nodeMdText.scrollTop / this.scale
    }     
  }, 1000/60) 

  handlePreviewScroll = tool.throttle((e) => {
    const {synchScroll} = this.config
    if (!synchScroll) {
      return
    }
    e.persist()    
    if (this.willScrollEle === 'html') { 
      this.hasContentChanged && this._setScrollValue()
      this.nodeMdText.scrollTop = this.nodeMdPreviewWraper.scrollTop * this.scale
    }    
  }, 1000/60)

  _setScrollValue = () => {
    // 设置值，方便 scrollBy 操作
    const {nodeMdText, nodeMdPreview, nodeMdPreviewWraper} = this
    this.scale = (nodeMdText.scrollHeight - nodeMdText.offsetHeight) / (nodeMdPreview.offsetHeight - nodeMdPreviewWraper.offsetHeight)
    this.hasContentChanged = false
    // console.log('this.scale', this.scale)    
  }

  _clearSelection = () => {
    this.selection = {...this.initialSelection}
  }

  _getSelectionInfo = (e) => {
    const source = e.srcElement || e.target
    const start = source.selectionStart
    const end = source.selectionEnd
    const text = (source.value || '').slice(start, end)
    const selection = {start, end, text}
    return selection
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

  showDropList = (type = 'header', flag) => {
    const {dropButton} = this.state
    this.setState({
      dropButton: {...dropButton, [type]: flag}
    })
  }

  render() {    
    const { view, dropButton, fullScreen, table } = this.state    
    const renderNavigation = () => {
      return view.menu && 
      <NavigationBar 
        left={
          <div className="button-wrap">
            <span className="button" title="header" 
              onMouseEnter={() => this.showDropList('header', true)} 
              onMouseLeave={() => this.showDropList('header', false)} 
              >
              <Icon type="icon-header"/>
              <DropList 
                show={dropButton.header}
                onClose={() => {
                  this.showDropList('header', false)
                }}
                render={() => {
                  return (
                    <HeaderList onSelectHeader={(header) => {
                      this.handleDecorate(header)
                    }}/>
                  )
                }}
              />
            </span>
            <span className="button" title="bold" onClick={() => this.handleDecorate('bold')}><Icon type="icon-bold"/></span>
            <span className="button" title="italic" onClick={() => this.handleDecorate('italic')}><Icon type="icon-italic"/></span>            
            <span className="button" title="italic" onClick={() => this.handleDecorate('underline')}><Icon type="icon-underline"/></span> 
            <span className="button" title="strikethrough" onClick={() => this.handleDecorate('strikethrough')}><Icon type="icon-strikethrough"/></span> 
            <span className="button" title="unorder" onClick={() => this.handleDecorate('unorder')}><Icon type="icon-list-ul"/></span>    
            <span className="button" title="order" onClick={() => this.handleDecorate('order')}><Icon type="icon-list-ol"/></span>    
            <span className="button" title="quote" onClick={() => this.handleDecorate('quote')}><Icon type="icon-quote-left"/></span>    
            <span className="button" title="hr" onClick={() => this.handleDecorate('hr')}><Icon type="icon-window-minimize" /></span>
            <span className="button" title="inline code" onClick={() => this.handleDecorate('inlinecode')}><Icon type="icon-embed"/></span>    
            <span className="button" title="code" onClick={() => this.handleDecorate('code')}><Icon type="icon-embed2" /></span> 
            <span className="button" title="table"
              onMouseEnter={() => this.showDropList('table', true)} 
              onMouseLeave={() => this.showDropList('table', false)} 
              >
              <Icon type="icon-table"/>
              <DropList
                show={dropButton.table}
                onClose={() => {
                  this.showDropList('table', false)
                }}
                render={() => {
                  return (
                    <TableList maxRow={table.maxRow} maxCol={table.maxCol} onSetTable={(option) => {
                      this.handleDecorate('table', option)
                    }}/>
                  )
                }}
              />     
            </span> 
            <span className="button" title="image" onClick={this.handleImageUpload} style={{position: 'relative'}}>
              <Icon type="icon-photo"/>
              <InputFile ref={(input) => { this.inputFile = input }} onChange={(e)=>{
                e.persist() 
                const file = e.target.files[0]
                this.onImageChanged(file)
              }} />
            </span> 
            <span className="button" title="link" onClick={() => this.handleDecorate('link')}><Icon type="icon-link"/></span>           
                                 
            <span className="button" title="empty" onClick={this.handleEmpty}><Icon type="icon-trash"/></span>            
            <span className="button" title="undo" onClick={this.handleUndo}><Icon type="icon-reply"/></span>
            <span className="button" title="redo" onClick={this.handleRedo}><Icon type="icon-share"/></span>            
          </div> 
        }
        right={
          <div className="button-wrap">
            <span className="button" title="full screen" onClick={this.handleToggleFullScreen}>
              {fullScreen ? <Icon type="icon-shrink"/>:<Icon type="icon-enlarge"/>}
            </span>
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
                  {view.menu ? <Icon type="icon-chevron-up"/>:<Icon type="icon-chevron-down"/>}
                </span>
                <span className="button" title={view.html ? 'preview' : 'column'} onClick={this.handleMdPreview}>
                  {view.html ? <Icon type="icon-desktop"/>:<Icon type="icon-columns"/>}
                </span>    
                <span className="button" title={'toggle'} onClick={() => this.handleToggleView('md')}><Icon type="icon-refresh"/></span>            
              </>
            }
          ></ToolBar>          
          <textarea
            id="textarea"
            ref={node => this.nodeMdText = node}
            value={text}
            className={'input'}
            wrap="hard"
            onChange={this.handleChange}
            onSelect={this.handleInputSelect}
            onScroll={this.handleInputScroll}
            onMouseOver={() => this.handleScrollEle('md')}
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
                <span className="button" title={view.md ? 'preview' : 'column'} onClick={this.handleHtmlPreview}>
                  {view.md ? <Icon type="icon-desktop"/> 
                    :<Icon type="icon-columns"/>
                  }
                </span>
                <span className="button" title={'toggle'} onClick={() => this.handleToggleView('html')}><Icon type="icon-refresh"/></span>   
                <span className="button" title="HTML code" onClick={this.hanldeToggleHtmlType}>
                  {htmlType === 'render' ? <Icon type="icon-code"/>
                    : <Icon type="icon-eye"/>
                  }
                </span>                         
              </>
            }
          ></ToolBar>          
          {htmlType === 'render' ? 
            (<div className="html-wrap" 
              ref={node => this.nodeMdPreviewWraper = node} 
              onMouseOver={() => this.handleScrollEle('html')}
              onScroll={this.handlePreviewScroll}>
              <HtmlRender html={html} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)}/>
            </div>)
            : (<div className={'html-code-wrap'} 
                ref={node => this.nodeMdPreviewWraper = ReactDOM.findDOMNode(node)}
                onScroll={this.handlePreviewScroll}>
                <HtmlCode html={html} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)}/>
              </div>)
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
      <div className={`rc-md-editor ${fullScreen ? 'full' : ''}`} style={this.props.style}>        
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