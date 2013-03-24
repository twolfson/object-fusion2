// Generate common value proxies
// Proxy to alias strings to other keys
function aliasProxy(val) {
  // If it is an alias, look it up
  if (typeof val === 'string') {
    val = this.getValue(val);
  }

  // Return the value
  return val;
}

// Proxy to expand arrays of strings into keys
function expandProxy(val) {
  // If it is an array, expand it
  if (Array.isArray(val)) {
    val = val.map(aliasProxy, this);
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