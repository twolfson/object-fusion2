module.exports = {
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