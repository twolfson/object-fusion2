var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert');

// Basics
describe('An object outline and object content', function () {
  before(function () {
    // Create and save outline/content
    this.outline = require('./basic.outline');
    this.content = require('./basic.content');
  });

  describe('when fused', function () {
    before(function () {
      // Fuse together outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content
      });
    });

    it('returns an object', function () {
      assert.strictEqual(typeof this.fusedObject, 'object');
    });

    it('returns a fused object', function () {
      // Assert the output is as we expected
      var content = this.content;
      assert.deepEqual({
        'One': {
          'value': content.One,
          'child': {
            'is equal to one': {
              'value': content['is equal to one']
            }
          }
        }
      }, this.fusedObject);
    });
  });
});

// Intermediate
describe('An outline and content containing keys', function () {
  before(function () {
    // Create and save outline/content
    this.outline = require('./aliasing.outline');
    this.content = require('./aliasing.content');
  });

  describe('fused with aliasing', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content,
        'value proxy': objectFusion.aliasProxy
      });
    });

    // Assert the output is what we anticipated
    it('observes aliasing', function () {
      var content = this.content;
      assert.deepEqual({
        'Two': {
          'value': content.Dos,
          'child': {
            'is equal to two': {
              'value': content['is equal to two']
            }
          }
        }
      }, this.fusedObject);
    });
  });
});

describe('An outline and content containing arrays', function () {
  before(function () {
    // Create and save outline/content
    this.outline = require('./expansion.outline');
    this.content = require('./expansion.content');
  });

  describe('fused with expansion', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content,
        'value proxy': objectFusion.expandProxy
      });
    });

    it('observes expansion', function () {
      var content = this.content;
      assert.deepEqual({
        'One plus one': {
          'value': [content.One, content['plus one']],
          'child': {
            'is equal to two': {
              'value': content['is equal to two']
            }
          }
        }
      }, this.fusedObject);
    });
  });
});

// Kitchen sink
describe('An reverse alphabetical outline', function () {
  before(function () {
    // Write out a reserve alphabetical outline
    this.outline = {
      'z': true,
      'a': true
    };
    this.content = {};
  });

  describe('when fused', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content
      });
    });

    it('preserves order', function () {
      // Pluck the keys in order from the fusedObject
      var fusedObject = this.fusedObject,
          keys = [],
          key;
      for (key in fusedObject) {
        if (fusedObject.hasOwnProperty(key)) {
          keys.push(key);
        }
      }

      // Assert the keys are still in reverse order
      assert.deepEqual(keys, ['z', 'a']);
    });
  });
});