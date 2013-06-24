# object-fusion2 [![Donate on Gittip](http://badgr.co/gittip/twolfson.png)](https://www.gittip.com/twolfson/)

Another way to combine outline and content into an object.

This is a fork of [object-fusion][object-fusion] and used as a component for [doubleshot][doubleshot] to combine specification with content.

The reason this is a fork, is [object-fusion][object-fusion] supports a simpler outline but lacks order. This fork requires arrays and therefore has order at each level.

[object-fusion]: https://github.com/twolfson/object-fusion
[dobuleshot]: https://github.com/twolfson/doubleshot

## Getting Started
Install the module with: `npm install object-fusion2`

```javascript
// Load in objectFusion
var objectFusion2 = require('object-fusion2');

// An outline acts as the shell that keys will line up to
var outline = {
  'One': ['is equal to one']
};

// Content acts as the values to match up to the keys of value
var content = {
  'One': function () {
    this.one = 1;
  },
  'is equal to one': function () {
    assert.strictEqual(this.one, 1);
  }
};

// Match up the strings to the values
var fusedObject = objectFusion2({
      outline: outline,
      content: content
    });

// The result looks like
{
  'nodeName': 'One',
  'value': function () {
    this.one = 1;
  },
  'childNodes': [{
    'nodeName': 'is equal to one',
    'value': function () {
      assert.strictEqual(this.one, 1);
    }
  }]
}
```

## Documentation
__TODO__

## Examples
__TODO__

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
