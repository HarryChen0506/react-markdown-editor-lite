// navigationBar
import React from 'react'

interface NavigationBarProps {
  left?: JSX.Element;
  middle?: JSX.Element;
  right?: JSX.Element;
}

class NavigationBar extends React.Component<NavigationBarProps, any> {
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