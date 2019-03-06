import React, { Component } from 'react';
import ReactDom from 'react-dom';
import './index.less';
class Dom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  // onInputChange = (e, key) => {
  //   this.setState({
  //     [key]: e.target.value
  //   });
  // };
  handleClose = () => {
    const { remove } = this.props;
    this.setState(
      {
        visible: false
      },
      () => {
        remove();
      }
    );
  };
  handleOk = () => {
    const { onOk } = this.props;
    const { row, col } = this.state;
    const val = { row, col };
    this.handleClose();
    onOk(val);
  };
  render() {
    const { title, content } = this.props;
    const { visible } = this.state;
    return (
      <div
        className="container"
        style={{
          display: visible ? 'block' : 'none'
        }}
      >
        <div className={'dialog'}>
          <div className={'dialog_header'}>
            <span>{title}</span>
          </div>
          <div className={'dialog_body'}>
            {content()}
          </div>
          <div className="footer">
            <div className={'dialog_buttons'}>
              <button onClick={this.handleOk} className="btn-ok">
                确认
              </button>
              <button onClick={this.handleClose} className="btn-cancel">
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function Modal(options) {
  let container = document.createElement('div');
  document.body.appendChild(container);
  const remove = () => {
    ReactDom.unmountComponentAtNode(container);
    document.body.removeChild(container);
  };
  ReactDom.render(<Dom {...options} remove={remove} />, container);
}
