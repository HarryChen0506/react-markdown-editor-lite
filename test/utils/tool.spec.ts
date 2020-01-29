import * as Tools from '../../src/utils/tool';
import { expect } from 'chai';

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
  // KeyMatch
  it('Test isKeyMatch (Match)', function() {
    expect(Tools.isKeyMatch(zWithCommand, 90, 'z', ['metaKey'])).to.be.true;
  });
  it('Test isKeyMatch (Not match)', function() {
    expect(Tools.isKeyMatch(zWithCommand, 90, 'z', ['metaKey', 'altKey'])).to.be.false;
    expect(Tools.isKeyMatch(zWithCommand, 90, 'z', ['altKey'])).to.be.false;
    expect(Tools.isKeyMatch(zWithCommand, 90, 'z')).to.be.false;
  });
});