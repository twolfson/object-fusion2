// Load in our library and dependencies
var objectFusion2 = require('../lib/object-fusion2.js'),
    assert = require('assert'),
    glob = require('glob');

// Find all input/output files
var inputFiles = glob.sync('*.input.*', {cwd: __dirname});

// Iterate over them
describe('object-fusion', function () {
  // Create an `it` method for each input
  inputFiles.forEach(function beginTest (inputFile) {
    // Begin the test
    it('interpretting "' + inputFile + '" matches expected output', function testFn () {
      // Load in the input and output files
      var outputFile = inputFile.replace('input', 'output'),
          input = require('./' + inputFile),
          expectedOutput = require('./' + outputFile);

      // If there is a value proxy, swap it out
      var valueProxy = input['value proxy'];
      if (valueProxy) {
        if (valueProxy === 'alias') {
          input['value proxy'] = objectFusion2.aliasProxy;
        } else if (valueProxy === 'expand') {
          input['value proxy'] = objectFusion2.expandProxy;
        }
      }

      // Process the input via object-fusion
      var actualOutput = objectFusion2(input);

      // Compare it to the output
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });
});