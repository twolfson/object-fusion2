module.exports = {
  'Two': 'Dos',
  'Dos': function () {
    this.two = 2;
  },
  'is equal to two': function () {
    assert.strictEqual(this.two, 2);
  }
};