// Generate common value proxies
// Proxy to alias strings to other keys
function aliasProxy(key) {
  // If it is an alias, look it up
  var val = key,
      valueKey = this.get('value key');
  if (typeof val === 'string') {
    val = this.getValue(key);

    // Emit an alias event (from -> to)
    this.emit('content aliased', key, val);
  }

  // Emit that a key was used
  this.emit('value key used', valueKey);

  // If the value is not defined, emit a key not found
  if (!val) {
    this.emit('value key not found', valueKey);
  }

  // Return the value
  return val;
}

// Proxy to expand arrays of strings into keys
function expandProxy(key) {
  // If it is an array, expand it
  var val = key;
  if (Array.isArray(key)) {
    val = key.map(aliasProxy, this);

    // Emit an expansion event (from -> to)
    this.emit('content expanded', key, val);
  }

  // Return the value
  return val;
}

// Proxy to allow aliasing and expansion
function aliasAndExpandProxy(val) {
  // Attempt to expand strings and arrays
  val = aliasProxy.call(this, val);
  val = expandProxy.call(this, val);

  // Then return
  return val;
}

// Export the proxies
module.exports = {
  aliasProxy: aliasProxy,
  expandProxy: expandProxy,
  aliasAndExpandProxy: aliasAndExpandProxy
};