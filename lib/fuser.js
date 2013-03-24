function Fuser() {
  // Create storage for values
  this.values = {};
}
Fuser.prototype = {
  // Bind settings directly to this (express style)
  set: function (name, val) {
    this[name] = val;
  },
  get: function (name) {
    return this[name];
  },

  // Save values for translation
  addValue: function (name, val) {
    this.values[name] = val;
  },
  // Helper for batch adding of values
  addValues: function (valObj) {
    // Iterate over the properties and add each
    var names = Object.getOwnPropertyNames(valObj),
        that = this;
    names.forEach(function addValFn (name) {
      that.addValue(name, valObj[name]);
    });
  },
  // Helper to get values
  getValue: function (name) {
    var val = this.values[name];

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('value proxy');
    if (proxy) {
      val = proxy.call(this, val);
    }

    return val;
  },
  // Layer between direct accessing of children
  getChild: function (obj, name) {
    var child = obj[name];

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('child proxy');
    if (proxy) {
      child = proxy.call(this, child);
    }

    return child;
  },
  // Translate object via saved properties
  translate: function (obj) {
    // Iterate over the object (via for in to preserve ordering)
    var key,
        retObj = {};
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Create a node for this index
        var node = {};

        // Lookup the value of the node and save it (if possible)
        var value = this.getValue(key);
        if (value !== undefined) {
          node.value = value;
        }

        // Grab the child and iterate it (if possible)
        var child = obj[key];
        if (typeof child === 'object') {
          node.child = this.translate(child);
        }

        // Save node to retObj
        retObj[key] = node;
      }
    }

    // Return the retObj
    return retObj;
  }
};

// Export Fuser
module.exports = Fuser;