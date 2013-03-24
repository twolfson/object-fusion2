# object-fusion

Combine outline and content into an object

## Getting Started
Install the module with: `npm install object-fusion`

```javascript
// Load in objectFusion
var objectFusion = require('object-fusion');

// Create an outline and content to fuse
var outline = {
  'One': {
    'is equal to one': true
  }
};

var content = {
  'One': function () {
    this.one = 1;
  },
  'is equal to one': function () {
    assert.strictEqual(this.one, 1);
  }
};

// Fuse them together
var fusedObject = objectFusion({
      outline: outline,
      content: content
    });

// The result looks like
{
  'One': {
    'value': function () {
      this.one = 1;
    },
    'child': {
      'is equal to one': {
        'value': function () {
          assert.strictEqual(this.one, 1);
        }
      }
    }
  }
}
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint your code using [grunt](https://github.com/gruntjs/grunt) and test via `npm test`.

## License
Copyright (c) 2013 Todd Wolfson

Licensed under the MIT license.
