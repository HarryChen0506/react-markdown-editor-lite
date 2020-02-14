import Logger from '../../src/plugins/logger/logger';
import { expect } from 'chai';

describe("Logger", function() {
  describe("undo", function() {
    it("returns undefined if there is no previous value", function() {
      const logger = new Logger();
      expect(logger.undo()).to.be.undefined;
    });

    it("returns the previous value if there is one", function() {
      const logger = new Logger();
      logger.push('S');
      logger.push('Sh');
      logger.push('She');
      expect(logger.undo()).to.equal('Sh');
      expect(logger.undo()).to.equal('S');
    });
  });
});
