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
        <div className="nav-left">
          <div className="button-wrap">
            <button className="button" name="undo"><Icon type="icon-reply"/></button>
            <button className="button" name="redo"><Icon type="icon-share"/></button>
          </div>  
        </div>
        <div class="nav-middle">
          <span>提示</span>
        </div>
        <div class="nav-right">
          <div className="button-wrap">
            <button className="button"><Icon type="icon-arrows-alt"/></button>
            <button className="button"><Icon type="icon-arrows-alt"/></button>
          </div> 
        </div>
        
      </div>
    )
  }
}
export default NavigationBar