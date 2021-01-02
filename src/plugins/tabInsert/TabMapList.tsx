import * as React from 'react';
import './TabMapList.less';

interface TabMapListProps {
  onSelectMapValue?: (mapValue: number) => void;
}

class TabMapList extends React.Component<TabMapListProps, any> {
  handleSelectMapValue(mapValue: number) {
    const { onSelectMapValue } = this.props;
    if (typeof onSelectMapValue === 'function') {
      onSelectMapValue(mapValue);
    }
  }
  render() {
    return (
      <ul className="tab-map-list">
        <li className="list-item">
          <div onClick={this.handleSelectMapValue.bind(this, 1)}>1 Tab</div>
        </li>
        <li className="list-item">
          <div onClick={this.handleSelectMapValue.bind(this, 2)}>2 Spaces</div>
        </li>
        <li className="list-item">
          <div onClick={this.handleSelectMapValue.bind(this, 4)}>4 Spaces</div>
        </li>
        <li className="list-item">
          <div onClick={this.handleSelectMapValue.bind(this, 8)}>8 Spaces</div>
        </li>
      </ul>
    );
  }
}
export default TabMapList;
