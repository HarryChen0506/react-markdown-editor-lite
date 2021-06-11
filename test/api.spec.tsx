import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { expect } from 'chai';
import * as React from 'react';
import Editor from '../src';

const TextComponent = (props: { onClick: (ref: Editor) => void; value?: string }) => {
  const { value, onClick } = props;
  const ref = React.useRef<Editor>(null);

  return (
    <div>
      <button id="click_handler" onClick={() => ref.current && onClick(ref.current)}>
        Click
      </button>
      <label htmlFor="myeditor_md">My Editor</label>
      <Editor ref={ref} id="myeditor" renderHTML={text => text} defaultValue={value || '123456'} />
    </div>
  );
};

const doClick = (
  onClick: (ref: Editor) => void,
  options: {
    value?: string;
    start?: number;
    end?: number;
  } = {},
) => {
  const handler = render(<TextComponent onClick={onClick} value={options.value} />);

  const textarea = handler.queryByLabelText('My Editor') as HTMLTextAreaElement;

  if (!textarea) {
    throw new Error('Not found textarea');
  }

  textarea.setSelectionRange(
    typeof options.start === 'undefined' ? 1 : options.start,
    typeof options.end === 'undefined' ? 3 : options.end,
    'forward',
  );

  const btn = handler.container.querySelector('#click_handler');
  if (btn) {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(btn, event);
  }

  return {
    ...handler,
    textarea,
  };
};

const next = (cb: any, time = 10) => {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      cb();
      resolve();
    }, time);
  });
};

describe('Test API', function() {
  // getSelection
  it('getSelection', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      selected = editor.getSelection().text;
    };
    doClick(handleClick);
    expect(selected).to.equals('23');
  });

  // setText with newSelection
  it('setText', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.setText('abcdefg', undefined, {
        start: 0,
        end: 2,
      });

      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick);
    expect(textarea.value).to.equals('abcdefg');
    return next(() => expect(selected).to.equals('ab'));
  });

  // insertText
  it('insertText 1', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.insertText('xx', true);
      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick);
    expect(textarea.value).to.equals('1xx456');
    return next(() => expect(selected).to.equals(''));
  });
  // insertText
  it('insertText 2', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.insertText('xx', false, {
        start: 0,
        end: 1,
      });
      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick);
    expect(textarea.value).to.equals('1xx23456');
    return next(() => expect(selected).to.equals('x'));
  });

  // insertMarkdown
  it('insertMarkdown bold', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.insertMarkdown('bold');
      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick);
    expect(textarea.value).to.equals('1**23**456');
    return next(() => expect(selected).to.equals('23'));
  });

  // insertMarkdown
  it('insertMarkdown unordered', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.insertMarkdown('unordered');
      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick, {
      value: '123\n234\n345\n456',
      start: 2,
      end: 10,
    });
    expect(textarea.value).to.equals('12\n* 3\n* 234\n* 34\n\n5\n456');
    return next(() => expect(selected).to.equals(''));
  });

  // insertMarkdown
  it('insertMarkdown table', function() {
    let selected = '';
    const handleClick = (editor: Editor) => {
      editor.insertMarkdown('table', {
        row: 2,
        col: 4,
      });
      setTimeout(() => (selected = editor.getSelection().text));
    };
    const { textarea } = doClick(handleClick);
    const expectTable =
      '| Head | Head | Head | Head |\n| --- | --- | --- | --- |\n| Data | Data | Data | Data |\n| Data | Data | Data | Data |';
    expect(textarea.value).to.equals('1\n' + expectTable + '\n\n456');
    return next(() => expect(selected).to.equals(''));
  });

  // insertPlaceholder
  it('insertPlaceholder', function() {
    const handleClick = (editor: Editor) => {
      editor.insertPlaceholder(
        '_placeholder_',
        new Promise(resolve => {
          setTimeout(() => {
            resolve('_resolved_');
          }, 5);
        }),
      );
    };
    const { textarea } = doClick(handleClick);
    expect(textarea.value).to.equals('1_placeholder_456');
    return next(() => expect(textarea.value).to.equals('1_resolved_456'));
  });

  afterEach(cleanup);
});
