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
});