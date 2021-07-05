// HeaderList
import * as React from 'react';

interface HeaderListProps {
  onSelectHeader?: (header: string) => void;
}

class HeaderList extends React.Component<HeaderListProps, any> {
  handleHeader(header: string) {
    const { onSelectHeader } = this.props;
    if (typeof onSelectHeader === 'function') {
      onSelectHeader(header);
    }
  }

  render() {
    return (
      <ul className="header-list">
        <li className="list-item">
          <h1 onClick={this.handleHeader.bind(this, 'h1')}>H1</h1>
        </li>
        <li className="list-item">
          <h2 onClick={this.handleHeader.bind(this, 'h2')}>H2</h2>
        </li>
        <li className="list-item">
          <h3 onClick={this.handleHeader.bind(this, 'h3')}>H3</h3>
        </li>
        <li className="list-item">
          <h4 onClick={this.handleHeader.bind(this, 'h4')}>H4</h4>
        </li>
        <li className="list-item">
          <h5 onClick={this.handleHeader.bind(this, 'h5')}>H5</h5>
        </li>
        <li className="list-item">
          <h6 onClick={this.handleHeader.bind(this, 'h6')}>H6</h6>
        </li>
      </ul>
    );
  }
}
export default HeaderList;
