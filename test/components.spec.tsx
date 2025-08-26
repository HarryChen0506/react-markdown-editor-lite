import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import DropList from '../src/components/DropList';
import Icon from '../src/components/Icon';

const user = userEvent.setup();

describe('Test Components', () => {
  // render
  it('DropList render', async () => {
    let isClosed = false;

    render(
      <DropList show={true} onClose={() => (isClosed = true)}>
        dropdown-item
      </DropList>,
    );

    const item = screen.queryByText('dropdown-item');

    expect(item).not.to.be.null;

    // click a item
    if (item !== null) {
      await user.click(item);
    }

    expect(isClosed).to.be.true;
  });

  it('Icon render', () => {
    const { container } = render(<Icon type="test" />);

    expect(container.querySelector('.rmel-iconfont')).not.to.be.null;
    expect(container.querySelector('.rmel-icon-test')).not.to.be.null;
  });

  afterEach(cleanup);
});
