import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { expect } from 'chai';
import * as React from 'react';
import DropList from '../src/components/DropList';
import Icon from '../src/components/Icon';

describe('Test Components', function() {
  // render
  it('DropList render', function() {
    let isClosed = false;
    render(<DropList show={true} onClose={() => isClosed = true}>dropdown-item</DropList>);

    const item = screen.queryByText('dropdown-item');

    expect(item).not.to.be.null;

    // click a item
    if (item !== null) {
      fireEvent.click(item);
    }

    expect(isClosed).to.be.true;
  });


  it('Icon render', function() {
    const { container } = render(<Icon type="test" />);

    expect(container.querySelector('.rmel-iconfont')).not.to.be.null;
    expect(container.querySelector('.rmel-icon-test')).not.to.be.null;
  });

  afterEach(cleanup);
});