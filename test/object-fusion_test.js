var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert');

// TODO: Test preservation of ordering
// TODO: Test optional expansion -- make something like `processValue`

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
      // TODO: This might become async during dev
      // TODO: The reason is we might introduced events (e.g. expand, missingKey/missingProperty
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
      // DEV: Layout is subject to change...
      // DEV: I feel like I should be using a standard markup format
      // but am failing to see the reason/benefit
      // For HTML, this would be attributes (value -> object) + childNodes (object -> array of objects)
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
        // TODO: Make this a predefined property of object fusion
        // TODO: Inside of `set`, have logic to expand this out from a string key `alias`
        'property proxy': function (prop) {
          // If it is an alias, look it up
          if (typeof prop === 'string') {
            prop = this.getProperty(prop);
          }

          // Return the property
          return prop;
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
        // TODO: Make this a predefined property of object fusion
        // TODO: Inside of `set`, have logic to expand this out from a string key `alias`
        'property proxy': function (prop) {
          // If it is an array, expand it
          if (Array.isArray(prop)) {
            prop = prop.map(this.getProperty, this);
          }

          // Return the property
          return prop;
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
