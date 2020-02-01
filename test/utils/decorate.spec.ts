import getDecorated from '../../src/utils/decorate';
import { expect } from 'chai';

describe('Test getDecorated', function() {
  // H1
  it('Header', function() {
    expect(getDecorated('text', 'h1')).to.deep.equal({
      text: "\n# text\n",
      selection: {
        start: 3,
        end: 7
      }
    });
  });
  // 加粗
  it('Bold', function() {
    expect(getDecorated('text', 'bold')).to.deep.equal({
      text: "**text**",
      selection: {
        start: 2,
        end: 6
      }
    });
  });
  // 有序列表
  it('Order List', function() {
    expect(getDecorated('a\nb\nc', 'order')).to.deep.equal({
      text: "\n1. a\n2. b\n3. c\n"
    });
  });
  // 无序列表
  it('Unorder List', function() {
    expect(getDecorated('a\nb\nc', 'unordered')).to.deep.equal({
      text: "\n* a\n* b\n* c\n"
    });
  });
  // 图片
  it('Image', function() {
    expect(getDecorated('text', 'image', {
      imageUrl: 'https://example.com/img.jpg'
    })).to.deep.equal({
      text: "![text](https://example.com/img.jpg)",
      selection: {
        start: 2,
        end: 6
      }
    });
  });
  // 链接
  it('Link', function() {
    expect(getDecorated('text', 'link', {
      linkUrl: 'https://example.com'
    })).to.deep.equal({
      text: "[text](https://example.com)",
      selection: {
        start: 1,
        end: 5
      }
    });
  });
  // 表格
  it('Table', function() {
    expect(getDecorated('', 'table', {
      row: 2,
      col: 3
    })).to.deep.equal({
      text: "\n| Head | Head |\n| --- | --- |\n| Data | Data |\n| Data | Data |\n| Data | Data |\n"
    });
  });
});