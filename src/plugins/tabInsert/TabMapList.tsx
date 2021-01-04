import classNames from 'classnames';
import * as React from 'react';
import i18n from '../../i18n';
import './TabMapList.less';

interface TabMapListProps {
  value: number;
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
    const { value } = this.props;

    return (
      <ul className="tab-map-list">
        {[1, 2, 4, 8].map(it => {
          return (
            <li
              key={it}
              className={classNames('list-item', {
                active: value === it,
              })}
            >
              <div onClick={this.handleSelectMapValue.bind(this, it)}>
                {it === 1 ? i18n.get('tab') : `${it} ${i18n.get('spaces')}`}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }
}
export default TabMapList;
