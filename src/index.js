import React, {Component} from 'react'
import MdEditor from './MdEditor'
// export default MdEditor

export default class App extends Component {
  state = {}
  componentWillMount() {
    this.setState({
      text: ''
    })
  }
  componentDidMount() {
    this.setState({
      text: undefined
    })
  }
  render() {
    const {text} = this.state;
    return <MdEditor value={text}></MdEditor>
  }
}