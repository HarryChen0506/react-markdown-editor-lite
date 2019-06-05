// navigationBar
import React from 'react'
class NavigationBar extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className={'rc-md-navigation'}>
        <div className="navigation-nav left">
          {this.props.left}
        </div>
        <div className="navigation-nav middle">
          {this.props.middle}
        </div>
        <div className="navigation-nav right">
          {this.props.right}
        </div>
      </div>
    )
  }
}
export default NavigationBar