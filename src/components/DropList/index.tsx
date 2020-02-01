import * as React from 'react';
import './index.less';

interface DropListProps {
  show: boolean;
  onClose?: () => void;
}

class DropList extends React.Component<DropListProps, any> {
  constructor(props: any) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }
  handleClose(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const { onClose } = this.props;
    if (typeof onClose === 'function') {
      onClose();
    }
  }
  render() {
    return (
      <div className={`drop-wrap ${this.props.show ? 'show' : 'hidden'}`} onClick={this.handleClose}>
        {this.props.children}
      </div>
    );
  }
}
export default DropList;
