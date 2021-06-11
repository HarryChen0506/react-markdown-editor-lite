import { expect } from 'chai';
import * as Tools from '../../src/utils/tool';

function createKeyboardEvent(data: any): React.KeyboardEvent<HTMLDivElement> {
  return {
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    ...data
  };
}

const zWithCommand = createKeyboardEvent({
  key: 'z',
  keyCode: 90,
  metaKey: true
});

describe('Test tools', function() {
  // deepClone
  it('Test deepClone', function() {
    const obj = {
      a: 1,
      b: [1, 2, 3],
      c: "string",
      d: {
        da: 123,
        db: ['a', 'b']
      }
    };
    expect(Tools.deepClone(obj)).to.deep.equal(obj);
  });
  // isEmpty
  it('Test isEmpty', function() {
    expect(Tools.isEmpty('')).to.be.true;
    expect(Tools.isEmpty(null)).to.be.true;
    expect(Tools.isEmpty(undefined)).to.be.true;
    expect(Tools.isEmpty(0)).to.be.false;
    expect(Tools.isEmpty('str')).to.be.false;
  });
  it('Test isPromise', function() {
    expect(Tools.isPromise(Promise.resolve())).to.be.true;
    expect(Tools.isPromise(Promise.all([]))).to.be.true;
    expect(Tools.isPromise('123')).to.be.false;
    expect(Tools.isPromise(function() { })).to.be.false;
  });
  it('Test getLineAndCol', function() {
    const text = "123\n456\n789";
    expect(Tools.getLineAndCol(text, 5)).to.deep.equal({
      line: 2,
      col: 1,
      beforeText: "123\n4",
      afterText: "56\n789",
      curLine: "456",
      prevLine: "123",
      nextLine: "789"
    });
    expect(Tools.getLineAndCol(text, 2).prevLine).to.be.null;
    expect(Tools.getLineAndCol(text, 8).nextLine).to.be.null;
  });
  // KeyMatch
  it('Test isKeyMatch (Match)', function() {
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90,
      withKey: ['metaKey']
    })).to.be.true;
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90,
      aliasCommand: true,
      withKey: ['ctrlKey']
    })).to.be.true;
  });
  it('Test isKeyMatch (Not match)', function() {
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90,
      withKey: ['ctrlKey']
    })).to.be.false;
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90,
      withKey: ['metaKey', 'altKey']
    })).to.be.false;
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90,
      withKey: ['altKey']
    })).to.be.false;
    expect(Tools.isKeyMatch(zWithCommand, {
      key: 'z',
      keyCode: 90
    })).to.be.false;
  });
});