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
        导航
        <Icon type="icon-arrows-alt"/>
      </div>
    )
  }
}
export default NavigationBar