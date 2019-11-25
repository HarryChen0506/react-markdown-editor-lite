import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as tool from '../utils/tool'
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

export class HtmlRender extends Component {
  render() {
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.html }} className={`custom-html-style ${this.props.className || ""}`} />
    )
  }
}

class HtmlCode extends Component {
  render() {
    return (
      <textarea className={`html-code ${this.props.className || ""}`} value={this.props.html} onChange={() => { }}></textarea>
    )
  }
}

export class MdEditor extends Component {

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

  selection = { ...this.initialSelection }

  constructor(props) {
    super(props)
    this.config = this.initConfig()

    this.state = {
      text: (this.formatString(this.props.value) || '').replace(/↵/g, '\n'),
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
    this.handleChange = this._handleChange.bind(this)
    this.handleInputSelect = this._handleInputSelect.bind(this)
    this.handleImageUpload = this._handleImageUpload.bind(this)
    this.handleEmpty = this._handleEmpty.bind(this)
    this.handleUndo = this._handleUndo.bind(this)
    this.handleRedo = this._handleRedo.bind(this)
    this.handleToggleFullScreen = this._handleToggleFullScreen.bind(this)
    this.handleToggleMenu = this._handleToggleMenu.bind(this)
    this.handleToggleView = this._handleToggleView.bind(this)
    this.handleMdPreview = this._handleMdPreview.bind(this)
    this.handleHtmlPreview = this._handleHtmlPreview.bind(this)
    this.handleToggleHtmlType = this._handleToggleHtmlType.bind(this)
    this.handleonKeyDown = this._handleonKeyDown.bind(this)

    this.handleInputScroll = tool.throttle((e) => {
      const { synchScroll } = this.config
      if (!synchScroll) {
        return
      }
      e.persist()
      if (this.willScrollEle === 'md') {
        this.hasContentChanged && this._setScrollValue()
        if (this.nodeMdPreviewWraper && this.nodeMdText) {
          this.nodeMdPreviewWraper.scrollTop = this.nodeMdText.scrollTop / this.scale
        }
      }
    }, 1000 / 60)
    this.handlePreviewScroll = tool.throttle((e) => {
      const { synchScroll } = this.config
      if (!synchScroll) {
        return
      }
      e.persist()
      if (this.willScrollEle === 'html') {
        this.hasContentChanged && this._setScrollValue()
        if (this.nodeMdText && this.nodeMdPreviewWraper)
          this.nodeMdText.scrollTop = this.nodeMdPreviewWraper.scrollTop * this.scale
      }
    }, 1000 / 60)
  }

  componentDidMount() {
    this.renderHTML(this.props.value || "")
      .then(html => {
        this.setState({
          html: html
        })
      })
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
    this.renderHTML(value)
      .then(html => {
        this.setState({
          text: value,
          html: html
        })
      })
  }

  componentWillUnmount() {
    this.endLogger()
  }

  formatString(value) {
    if (typeof this.props.value !== 'string') {
      console && console.error && console.error('The type of "value" must be String!')
      return new String(value).toString()
    }
    return value
  }

  initConfig() {
    return { ..._config, ...this.props.config }
  }

  initLogger() {
    this.logger = new Logger()
    this.startLogger()
    this.logger.pushRecord(this.state.text)
  }

  startLogger() {
    if (!this.loggerTimerId) {
      this.loggerTimerId = setInterval(() => {
        const { text } = this.state
        if (this.logger.getLastRecord() !== text) {
          this.logger.pushRecord(text)
        }
      }, this.config.logger.interval)
    }
    // 清空redo历史
    this.logger.cleanRedoList()
  }

  endLogger() {
    if (this.loggerTimerId) {
      clearInterval(this.loggerTimerId)
      this.loggerTimerId = null
    }
  }

  handleGetLogger() {
    console.log('handleGetLogger', this.logger)
  }

  _handleUndo() {
    this.logger.undo((last) => {
      this.endLogger()
      this._setMdText(last)
    })
  }

  _handleRedo() {
    this.logger.redo((last) => {
      this._setMdText(last)
    })
  }

  handleDecorate(type, option = {}) {
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
      'unordered',
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

  _getDecoratedText(type, option) {
    const { text = '' } = this.state
    const { selection } = this
    const beforeContent = text.slice(0, selection.start)
    const afterContent = text.slice(selection.end, text.length)
    const decorate = new Decorate(selection.text)
    let decoratedText = ''
    if (type === 'image') {
      decoratedText = decorate.getDecoratedText(type, {
        target: option.target || "",
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

  renderHTML(markdownText) {
    if (!this.props.renderHTML) {
      console.error('renderHTML props must be required!')
      return
    }
    const res = this.props.renderHTML(markdownText)
    if (typeof res === "string") {
      return Promise.resolve(res)
    } else if (typeof res === "function") {
      return Promise.resolve(res())
    } else if (typeof res === 'object' && typeof res.then === 'function') {
      return res
    }
    return res
  }

  _handleToggleFullScreen() {
    this.setState({
      fullScreen: !this.state.fullScreen
    })
  }

  changeView(to) {
    const view = Object.assign({}, this.state.view, to)
    this.setState({
      view: view
    })
  }

  _handleToggleMenu() {
    this.changeView({
      'menu': !this.state.view.menu
    })
  }

  _handleToggleView(type) {
    if (type === 'md') {
      this.changeView({
        'md': false,
        'html': true
      })
    } else {
      this.changeView({
        'md': true,
        'html': false
      })
    }
  }

  _handleMdPreview() {
    this.changeView({
      'html': !this.state.view.html
    })
  }

  _handleHtmlPreview() {
    this.changeView({
      'md': !this.state.view.md
    })
  }

  _handleToggleHtmlType() {
    let { htmlType } = this.state
    if (htmlType === 'render') {
      htmlType = 'source'
    } else if (htmlType === 'source') {
      htmlType = 'render'
    }
    this.setState({
      htmlType: htmlType
    })
  }

  _handleEmpty() {
    if (window.confirm) {
      //TODO: Allow custom confirm message
      const result = window.confirm('Are you sure you want to clear your markdown?')
      if (result) {
        this.setState({
          text: '',
          html: ''
        })
      }
    }
  }

  _handleImageUpload() {
    const { onImageUpload } = this.props
    if (typeof onImageUpload === 'function') {
      this.inputFile && this.inputFile.click()
    } else {
      this.handleDecorate('image')
    }
  }

  onImageChanged(file) {
    const { onImageUpload } = this.props
    onImageUpload(file, (imageUrl) => {
      this.handleDecorate('image', { target: file.name, imageUrl })
    })
  }

  _handleChange(e) {
    e.persist();
    this.startLogger()
    const value = e.target.value
    if (!this.hasContentChanged) {
      this.hasContentChanged = true
    }
    this._setMdText(value, e)
  }

  _handleInputSelect(e) {
    e.persist()
    this.selection = Object.assign({}, this.selection, { isSelected: true }, this._getSelectionInfo(e))
  }

  handleScrollEle(node) {
    this.willScrollEle = node
  }

  _setScrollValue() {
    // 设置值，方便 scrollBy 操作
    const { nodeMdText = {}, nodeMdPreview = {}, nodeMdPreviewWraper = {} } = this
    this.scale = (nodeMdText.scrollHeight - nodeMdText.offsetHeight + 35) / (nodeMdPreview.offsetHeight - nodeMdPreviewWraper.offsetHeight + 35)
    this.hasContentChanged = false
  }

  _clearSelection() {
    this.selection = Object.assign({}, this.initialSelection)
  }

  _getSelectionInfo(e) {
    const source = e.srcElement || e.target
    const start = source.selectionStart
    const end = source.selectionEnd
    const text = (source.value || '').slice(start, end)
    const selection = { start, end, text }
    return selection
  }

  _setMdText(value = '', e) {
    const text = value.replace(/↵/g, '\n')
    this.setState({
      text: value
    })
    this.renderHTML(text)
      .then(html => {
        this.setState({
          html
        })
        this.onEmit({
          text,
          html,
        }, e)
      })
  }

  _isKeyMatch(event, key, keyCode, withCtrl = false) {
    if (event.ctrlKey !== withCtrl) {
      return false
    }
    if (event.key) {
      return event.key === key
    } else {
      return event.keyCode === keyCode
    }
  }

  _handleonKeyDown(e) {
    if (this._isKeyMatch(e, 'z', 90, true)) {
      this._handleUndo()
      e.preventDefault()
    }
    if (this._isKeyMatch(e, 'y', 89, true)) {
      this._handleRedo()
      e.preventDefault()
    }
  }

  onEmit(output, event) {
    const { onChange } = this.props;
    typeof onChange === 'function' && onChange(output, event)
  }

  getMdValue() {
    return this.state.text
  }

  getHtmlValue() {
    return this.state.html
  }

  showDropList(type = 'header', flag) {
    const { dropButton } = this.state
    this.setState({
      dropButton: { ...dropButton, [type]: flag }
    })
  }

  render() {
    const { view, dropButton, fullScreen, table } = this.state
    const renderNavigation = () => {
      return view.menu &&
        <NavigationBar
          left={
            <div className="button-wrap">
              <span className="button" title="Header"
                onMouseEnter={() => this.showDropList('header', true)}
                onMouseLeave={() => this.showDropList('header', false)}
              >
                <Icon type="icon-header" />
                <DropList
                  show={dropButton.header}
                  onClose={() => {
                    this.showDropList('header', false)
                  }}
                  render={() => {
                    return (
                      <HeaderList onSelectHeader={(header) => {
                        this.handleDecorate(header)
                      }} />
                    )
                  }}
                />
              </span>
              <span className="button" title="Bold" onClick={() => this.handleDecorate('bold')}><Icon type="icon-bold" /></span>
              <span className="button" title="Italic" onClick={() => this.handleDecorate('italic')}><Icon type="icon-italic" /></span>
              <span className="button" title="Underline" onClick={() => this.handleDecorate('underline')}><Icon type="icon-underline" /></span>
              <span className="button" title="Strikethrough" onClick={() => this.handleDecorate('strikethrough')}><Icon type="icon-strikethrough" /></span>
              <span className="button" title="Unordered list" onClick={() => this.handleDecorate('unordered')}><Icon type="icon-list-ul" /></span>
              <span className="button" title="Ordered list" onClick={() => this.handleDecorate('order')}><Icon type="icon-list-ol" /></span>
              <span className="button" title="Quote" onClick={() => this.handleDecorate('quote')}><Icon type="icon-quote-left" /></span>
              <span className="button" title="Line break" onClick={() => this.handleDecorate('hr')}><Icon type="icon-window-minimize" /></span>
              <span className="button" title="Inline code" onClick={() => this.handleDecorate('inlinecode')}><Icon type="icon-embed" /></span>
              <span className="button" title="Block code" onClick={() => this.handleDecorate('code')}><Icon type="icon-embed2" /></span>
              <span className="button" title="Table"
                onMouseEnter={() => this.showDropList('table', true)}
                onMouseLeave={() => this.showDropList('table', false)}
              >
                <Icon type="icon-table" />
                <DropList
                  show={dropButton.table}
                  onClose={() => {
                    this.showDropList('table', false)
                  }}
                  render={() => {
                    return (
                      <TableList maxRow={table.maxRow} maxCol={table.maxCol} onSetTable={(option) => {
                        this.handleDecorate('table', option)
                      }} />
                    )
                  }}
                />
              </span>
              <span className="button" title="Image" onClick={this.handleImageUpload} style={{ position: 'relative' }}>
                <Icon type="icon-photo" />
                <InputFile accept={this.config.imageAccept || ""} ref={(input) => { this.inputFile = input }} onChange={(e) => {
                  e.persist()
                  const file = e.target.files[0]
                  this.onImageChanged(file)
                }} />
              </span>
              <span className="button" title="Link" onClick={() => this.handleDecorate('link')}><Icon type="icon-link" /></span>

              <span className="button" title="Clear" onClick={this.handleEmpty}><Icon type="icon-trash" /></span>
              <span className="button" title="Undo" onClick={this.handleUndo}><Icon type="icon-reply" /></span>
              <span className="button" title="Redo" onClick={this.handleRedo}><Icon type="icon-share" /></span>
            </div>
          }
          right={
            <div className="button-wrap">
              <span className="button" title="Full screen" onClick={this.handleToggleFullScreen}>
                {fullScreen ? <Icon type="icon-shrink" /> : <Icon type="icon-enlarge" />}
              </span>
            </div>
          }
        />
    }
    const renderContent = () => {
      const { html, text, view, htmlType } = this.state
      const res = []
      if (view.md) {
        res.push(
          <section className={'sec-md'} key="md">
            <ToolBar>
              <span className="button" title={view.menu ? 'Hide menu' : 'Show menu'} onClick={this.handleToggleMenu}>
                {view.menu ? <Icon type="icon-chevron-up" /> : <Icon type="icon-chevron-down" />}
              </span>
              <span className="button" title={view.html ? 'Hide preview' : 'Show preview'} onClick={this.handleMdPreview}>
                {view.html ? <Icon type="icon-desktop" /> : <Icon type="icon-columns" />}
              </span>
              <span className="button" title={'Preview'} onClick={() => this.handleToggleView('md')}><Icon type="icon-refresh" /></span>
            </ToolBar>
            <textarea
              id="textarea"
              name={this.props.name || "textarea"}
              ref={node => this.nodeMdText = node}
              value={text}
              className={`input ${this.config.markdownClass || ""}`}
              wrap="hard"
              onChange={this.handleChange}
              onSelect={this.handleInputSelect}
              onScroll={this.handleInputScroll}
              onMouseOver={() => this.handleScrollEle('md')}
            />
          </section>)
      }
      if (view.html) {
        res.push(
          <section className={'sec-html'} key="html">
            <ToolBar style={{ right: '20px' }}>
              <span className="button" title={view.menu ? 'hidden menu' : 'show menu'} onClick={this.handleToggleMenu}>
                {view.menu ? <Icon type="icon-chevron-up" />
                  : <Icon type="icon-chevron-down" />
                }
              </span>
              <span className="button" title={view.md ? 'Hide editor' : 'Show editor'} onClick={this.handleHtmlPreview}>
                {view.md ? <Icon type="icon-desktop" />
                  : <Icon type="icon-columns" />
                }
              </span>
              <span className="button" title={'toggle'} onClick={() => this.handleToggleView('html')}><Icon type="icon-refresh" /></span>
              <span className="button" title="Show HTML" onClick={this.handleToggleHtmlType}>
                {htmlType === 'render' ? <Icon type="icon-embed" />
                  : <Icon type="icon-eye" />
                }
              </span>
            </ToolBar>
            {htmlType === 'render' ?
              (<div className="html-wrap"
                ref={node => this.nodeMdPreviewWraper = node}
                onMouseOver={() => this.handleScrollEle('html')}
                onScroll={this.handlePreviewScroll}>
                <HtmlRender html={html} className={this.config.htmlClass} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)} />
              </div>)
              : (<div className={'html-code-wrap'}
                ref={node => this.nodeMdPreviewWraper = ReactDOM.findDOMNode(node)}
                onScroll={this.handlePreviewScroll}>
                <HtmlCode html={html} className={this.config.htmlClass} ref={node => this.nodeMdPreview = ReactDOM.findDOMNode(node)} />
              </div>)
            }
          </section>
        )
      }
      return res
    }
    return (
      <div
        className={`rc-md-editor ${fullScreen ? 'full' : ''}`}
        style={this.props.style} onKeyDown={this.handleonKeyDown}
      >
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