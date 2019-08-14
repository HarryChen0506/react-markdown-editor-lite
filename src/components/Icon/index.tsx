// Icon
import * as React from 'react'
import './font.less'

interface IconProps {
  type: string;
}

class Icon extends React.Component<IconProps, any> {
  render() {   
    return ( 
      <span className={this.props.type}></span>
    )
  }
}
export default Icon