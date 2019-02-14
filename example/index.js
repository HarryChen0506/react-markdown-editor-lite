import React from 'react'
import ReactDOM from 'react-dom'

class Foo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: "Foo",
    }
  }

  componentWillReceiveProps(props) {
    console.log('Foo componentWillReceiveProps', props)
  }

  componentWillUpdate (props, state) {
    console.log('Foo componentWillUpdate', props, state)
  }

  shouldComponentUpdate (nextProps, nextState) {
    console.log('Foo shouldComponentUpdate', nextProps, nextState)
    // if (nextProps.title !== this.props.title) {
    //   return true
    // }
    // return false
    return true
  }

  render () {
    console.log('Foo render')
    return <span>组件</span>
  }
}
class Hello extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.state = {
      count: 1
    }
  }
  // componentWillMount () {
  //   console.log('react componentWillMount')
  // }
  // componentDidMount () {
  //   console.log('react componentDidMount')
  // }

  // componentWillReceiveProps(props) {
  //   console.log('Hello componentWillReceiveProps', props)
  // }
  
  // componentWillUpdate (props, state) {
  //   console.log('Hello componentWillUpdate', props, state)
  // }
  
  handleClick (e) {
    // console.log('click me', e)
    const count = this.state.count
    this.setState({
      count: count + 1
    })
  }
  renderCount () {    
    return <span name="span">{this.state.count}</span>       
  }
  render () {
    return (
      <div className="wrap">
        <Foo title="foo"/>
        {this.renderCount()}
        <button onClick={this.handleClick}>click me</button>  
      </div>      
    )
  }
}

const Demo = (
  <div className="title" style={{color: 'red', fontSize: '30px'}} key={'title'}>
    <Hello name="harry"/>
  </div>
)

ReactDOM.render(
  Demo,
  document.getElementById('root')
)