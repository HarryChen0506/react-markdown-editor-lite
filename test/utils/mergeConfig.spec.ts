import mergeConfig from '../../src/utils/mergeConfig';
import { expect } from 'chai';

describe("Test mergeConfig", function() {
  it("Merge objects", function() {
    const obj1 = { a: 1, b: 5 };
    const obj2 = { b: 2, c: 3 };
    const res = mergeConfig(obj1, obj2);
    expect(res).to.deep.equal({ a: 1, b: 2 });
  });
  it("Merge should ignore non-objects", function() {
    const obj1 = { a: 1, b: 5 };
    const obj2 = 123;
    const obj3 = { a: 2, c: 6 };
    const res = mergeConfig(obj1, obj2, obj3);
    expect(res).to.deep.equal({ a: 2, b: 5 });
  });
});