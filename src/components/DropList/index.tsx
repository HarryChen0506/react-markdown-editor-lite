// DropList
import * as React from 'react'
import './index.less'

interface DropListProps {
  show: boolean;
  onClose?: () => void;
  render: () => JSX.Element;
}

class DropList extends React.Component<DropListProps, any> {
  constructor(props: any) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const { onClose } = this.props;
    typeof onClose === 'function' && onClose();
  }
  render() {
    return (
      <div className={`drop-wrap ${this.props.show ? 'show' : 'hidden'}`} onClick={this.handleClose}>
        {typeof this.props.render === 'function' && this.props.render()}
      </div>
    )
  }
}
export default DropList