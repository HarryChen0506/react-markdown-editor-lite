import Logger from '../../src/plugins/logger/logger';
import { expect } from 'chai';

describe("Test Logger", function() {
  describe("undo", function() {
    it("Return previous if top is not current", function() {
      const logger = new Logger();
      logger.push('S');
      logger.push('Sh');
      expect(logger.undo('She')).to.equal('Sh');
      expect(logger.undo('Sh')).to.equal('S');
    });

    it("Return previous if top is current", function() {
      const logger = new Logger();
      logger.push('S');
      logger.push('Sh');
      logger.push('She');
      expect(logger.undo('She')).to.equal('Sh');
    });

    it("Will return initValue", function() {
      const logger = new Logger();
      logger.initValue = 'init';
      expect(logger.undo()).to.equals('init');
    })
  });
});