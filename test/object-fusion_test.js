var objectFusion2 = require('../lib/object-fusion2.js'),
    assert = require('assert');

// Basics
describe('An object outline and object content', function () {
  before(function () {
    // Create and save outline/content
    this.input = require('./basic.input');
  });

  describe('when fused', function () {
    before(function () {
      // Fuse together outline/content
      this.fusedObject = objectFusion2({
        outline: this.input.outline,
        content: this.input.content
      });
    });

    it('returns an object', function () {
      assert.strictEqual(typeof this.fusedObject, 'object');
    });

    it('returns a fused object', function () {
      // Assert the output is as we expected
      var content = this.content;
      assert.deepEqual(require('./basic.output'), this.fusedObject);
    });
  });
});

// Intermediate
describe('An outline and content containing keys', function () {
  before(function () {
    // Create and save outline/content
    this.input = require('./aliasing.input');
  });

  describe('fused with aliasing', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion2({
        outline: this.input.outline,
        content: this.input.content,
        'value proxy': objectFusion2.aliasProxy
      });
    });

    // Assert the output is what we anticipated
    it('observes aliasing', function () {
      var content = this.content;
      assert.deepEqual(require('./aliasing.output'), this.fusedObject);
    });
  });
});

describe('An outline and content containing arrays', function () {
  before(function () {
    // Create and save outline/content
    this.input = require('./expansion.input');
  });

  describe('fused with expansion', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion2({
        outline: this.input.outline,
        content: this.input.content,
        'value proxy': objectFusion2.expandProxy
      });
    });

    it('observes expansion', function () {
      var content = this.content;
      assert.deepEqual(require('./expansion.output'), this.fusedObject);
    });
  });
});