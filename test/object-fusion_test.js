var objectFusion = require('../lib/object-fusion.js'),
    assert = require('assert');

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

  described('when fused', function () {
    before(function () {
      // TODO: This might become async during dev
      // TODO: The reason is we might introduced events (e.g. expand)
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
      assert.deepEqual({
        'One': {
          'value': content.One,
          'child': {
            'is equal to one': {
              'value': content['is equal to one']
            }
          }
        }
      });
    });
  });
});
