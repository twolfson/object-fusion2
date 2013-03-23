var assert = require('assert');

// TODO: Rename all `property` to `value`

function Fuser() {
  // Create storage for properties
  this.properties = {};
}
Fuser.prototype = {
  // Bind settings directly to this (express style)
  set: function (name, val) {
    this[name] = val;
  },
  get: function (name) {
    return this[name];
  },

  // Save properties for translation
  addProperty: function (name, val) {
    this.properties[name] = val;
  },
  // Helper for batch adding of properties
  addProperties: function (propObj) {
    // Iterate over the properties and add each
    var names = Object.getOwnPropertyNames(propObj),
        that = this;
    names.forEach(function addPropertyFn (name) {
      that.addProperty(name, propObj[name]);
    });
  },
  // Helper to get properties
  getProperty: function (name) {
    var prop = this.properties[name];

    // If there is a setting for `property proxy`, use it
    var proxy = this.get('property proxy');
    if (proxy) {
      prop = proxy.call(this, prop);
    }

    return prop;
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
        // properties = {'one': fn}, value = fn
        // properties = {'one': 'alias for one'}
        // properties = {'two': ['one', 'one']} -> how do I get child to budge for this? don't. mocha can handle itself for nesting of topics (honestly, just a chain).
        // just expand each of these -- need to figure out how to do that
        var value = this.getProperty(key);
        if (value !== undefined) {
          node.value = value;
        }

        // Grab the child and iterate it (if possible)
        // TODO: We might want a getChild later on
        // obj = {'one': {'is equal to one': true}}, child = {'is equal to one': true} || true
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

/**
 * Fuse outline and content objects together
 * @param {Object} params Container for parameters
 * @param {Object} params.outline Object containing strings or nested objects of similar format
 * @param {Object} params.content Key/value pairs that correspond to those in params.outline
 * @param {Function} [params['property proxy']] Optional proxy for `property` once looked up
 * @returns {Object} Combined object fused by params.outline values to params.content keys
 */
function objectFusion(params) {
  var fuser = new Fuser(),
      outline = params.outline,
      content = params.content;

  // Assert that we have params.outline and content
  assert(outline, 'objectFusion could not find "outline" parameter');
  assert(content, 'objectFusion could not find "content" parameter');

  // Add outline to our fuser
  fuser.addProperties(content);

  // If there is a property proxy, set it
  var propertyProxy = params['property proxy'];
  if (propertyProxy) {
    fuser.set('property proxy', propertyProxy);
  }

  // Process and return content
  var retObj = fuser.translate(outline);
  return retObj;
}

// Expose Fuser on objectFusion
objectFusion.Fuser = Fuser;

// Expose objectFusion
module.exports = objectFusion;