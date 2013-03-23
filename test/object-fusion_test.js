var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert');

// Basics
describe('An object outline and object content', function () {
  before(function () {
    // Create and save outline/content
    this.outline = {
      'One': {
        'is equal to one': true
      }
    };

    this.content = {
      'One': function () {
        this.one = 1;
      },
      'is equal to one': function () {
        assert.strictEqual(this.one, 1);
      }
    };
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
    this.outline = {
      'Two': {
        'is equal to two': true
      }
    };

    this.content = {
      'Two': 'Dos',
      'Dos': function () {
        this.two = 2;
      },
      'is equal to two': function () {
        assert.strictEqual(this.two, 2);
      }
    };
  });

  describe('fused with aliasing', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content,
        // TODO: Make this a predefined value of object fusion
        // TODO: Inside of `set`, have logic to expand this out from a string key `alias`
        'value proxy': function (val) {
          // If it is an alias, look it up
          if (typeof val === 'string') {
            val = this.getValue(val);
          }

          // Return the value
          return val;
        }
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
    this.outline = {
      'One plus one': {
        'is equal to two': true
      }
    };

    this.content = {
      'One': function () {
        this.sum = 1;
      },
      'plus one': function () {
        this.sum += 1;
      },
      'One plus one': ['One', 'plus one'],
      'is equal to two': function () {
        assert.strictEqual(this.sum, 2);
      }
    };
  });

  describe('fused with expansion', function () {
    before(function () {
      // Fused outline/content
      this.fusedObject = objectFusion({
        outline: this.outline,
        content: this.content,
        'value proxy': function (val) {
          // If it is an array, expand it
          if (Array.isArray(val)) {
            val = val.map(this.getValue, this);
          }

          // Return the value
          return val;
        }
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