var EventEmitter = require('events').EventEmitter;

function Fuser() {
  // Create storage for values
  this.values = {};

  // Inherit from event emitter
  EventEmitter.call(this);
}
var FuserProto = {
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

    // Expose value key
    this.set('value key', name);

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('value proxy');
    if (proxy) {
      val = proxy.call(this, val);
    }

    // Emit that a key was used
    this.emit('value key used', name);

    // If the value is not defined, emit a key not found
    if (!val) {
      this.emit('value key not found', name);
    }

    // Unset value key
    this.set('value key', null);

    return val;
  },
  // Layer between direct accessing of children
  getChild: function (obj, name) {
    var child = obj[name];

    // Expose child name
    this.set('child key', name);

    // If there is a setting for `value proxy`, use it
    var proxy = this.get('child proxy');
    if (proxy) {
      child = proxy.call(this, child);
    }

    // Emit that a key was used
    this.emit('child key used', name);

    // If the child is not defined, emit a key not found
    if (!child) {
      this.emit('child key not found', name);
    }

    // Unset child key
    this.set('child key', null);

    return child;
  },
  // Translate object via saved properties
  translate: function (input) {
    // Assume the input is a string
    var nodeName = input,
        childNodes;

    // Prepare an object to return
    var node = {},
        _node = this.get('node');
    this.set('node', node);

    // If the input is an object
    if (typeof input === 'object') {
      // Iterate over the keys of the object (there should only be one)
      var keys = Object.getOwnPropertyNames(input);

      // If there is more than one key, throw an error
      // DEV: This might feel like a design flaw but it is intentional.
      // DEV: Techincally speaking, JSON is a lot more lossy than XML.
      if (keys.length > 2) {
        throw new Error('Objects can have at most one key. Found ' + JSON.stringify(input) + ' with multiple keys.');
      }

      // Update the nodeName
      nodeName = keys[0];

      // If there are any child nodes, iterate over them
      var children = this.getChild(input, nodeName);
      if (children) {
        // If the array is not an array, throw an array
        if (!Array.isArray(children)) {
          throw new Error('Value of objects can only be arrays. Found "' + nodeName + '" to have value ' + JSON.stringify(children));
        }

        // Map the children through Fuser.translate
        node.childNodes = children.map(this.translate, this);
      }
    }

    // Save the name of the node
    node.nodeName = nodeName;

    // Grab the value for the node
    var value = this.getValue(nodeName);
    if (value !== undefined) {
      node.value = value;
    }

    // Return the node to the original
    this.set('node', _node);

    // Return the return object
    return node;
  }
};
Fuser.prototype = FuserProto;

// Duck punch inheritance from EventEmitter
var EventProto = EventEmitter.prototype,
    EventProtoKeys = Object.getOwnPropertyNames(EventProto);
EventProtoKeys.forEach(function (key) {
  FuserProto[key] = EventProto[key];
});

// Export Fuser
module.exports = Fuser;