// navigationBar
import React from 'react'
import Icon from './Icon'
class NavigationBar extends React.Component {
  constructor(props) {
    super(props)    
    this.state = {}
  }
  render() {   
    return ( 
      <div className={'rc-md2html-navigation'}>
        <div className="navigation-nav left">
          <div className="button-wrap">
            <a className="button" title="empty"><Icon type="icon-trash-o"/></a>
            <a className="button" title="undo"><Icon type="icon-reply"/></a>
            <a className="button" title="redo"><Icon type="icon-share"/></a>
          </div>  
        </div>
        <div className="navigation-nav middle">
          {/* <span>提示</span> */}
        </div>
        <div className="navigation-nav right">
          <div className="button-wrap">
            {/* <a className="button" title="clean"><Icon type="icon-cog"/></a> */}
          </div> 
        </div>        
      </div>
    )
  }
}
export default NavigationBar