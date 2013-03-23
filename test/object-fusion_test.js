var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert');

// TODO: Test preservation of ordering
// TODO: Test optional expansion -- make something like `processValue`

describe('An object outline and object content', function () {
  before(function () {
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
      var content = this.content;
      // DEV: Layout is subject to change...
      // DEV: I feel like I should be using a standard markup format
      // but am failing to see the reason/benefit
      // For HTML, this would be attributes (value -> object) + childNodes (object -> array of objects)
      console.log(this.fusedObject);
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
