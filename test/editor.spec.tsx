import { cleanup, render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import Editor from '../src';

describe('Test Editor', () => {
  // render
  it('render', () => {
    const value = Math.random().toString();
    const { container, rerender } = render(
      <Editor renderHTML={text => text} value={value} />,
    );

    expect(container.querySelector('.rc-md-editor')).not.to.be.null;

    const textarea = container.querySelector('textarea');
    expect(textarea).not.to.be.null;
    if (textarea !== null) {
      expect(textarea.value).to.equals(value);
      // Update value
      const newValue = value + Math.random().toString();
      rerender(<Editor renderHTML={text => text} value={newValue} />);

      expect(textarea.value).to.equals(newValue);
    }
  });

  // render with label
  it('render with label', () => {
    const { queryByLabelText } = render(
      <div>
        <label htmlFor="myeditor_md">My Editor</label>
        <Editor id="myeditor" renderHTML={text => text} value="123456" />
      </div>,
    );

    const textarea = queryByLabelText('My Editor');
    expect(textarea).not.to.be.null;
    if (textarea !== null) {
      expect((textarea as HTMLTextAreaElement).value).to.equals('123456');
    }
  });

  // render with default value produces a preview
  it('render with default value', () => {
    const text = 'Hello World!';
    const { getByText } = render(
      <Editor id="myeditor" renderHTML={text => text} defaultValue={text} />,
    );

    // Attempt to fetch the preview pane by using the CSS selector
    const element = getByText(text, { selector: '.custom-html-style' });
    expect(element.innerHTML).to.equals(text);
  });

  afterEach(cleanup);
});
