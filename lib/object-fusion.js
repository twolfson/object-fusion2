var assert = require('assert'),
    Fuser = require('./fuser'),
    proxies = require('./proxies');

/**
 * Fuse outline and content objects together
 * @param {Object} params Container for parameters
 * @param {Object} params.outline Object containing strings or nested objects of similar format
 * @param {Object} params.content Key/value pairs that correspond to those in params.outline
 * @param {Function} [params['value proxy']] Optional proxy for `value` once looked up
 * @param {Function} [params['child proxy']] Optional proxy for `child` once looked up
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
  fuser.addValues(content);

  // If there is a value proxy, set it
  var valueProxy = params['value proxy'];
  if (valueProxy) {
    fuser.set('value proxy', valueProxy);
  }

  // If there is a child proxy, set it
  var childProxy = params['child proxy'];
  if (childProxy) {
    fuser.set('child proxy', childProxy);
  }

  // Process and return outline
  var retObj = fuser.translate(outline);
  return retObj;
}

// Expose Fuser on objectFusion
objectFusion.Fuser = Fuser;

// Expose common proxies
objectFusion.aliasProxy = proxies.aliasProxy;
objectFusion.expandProxy = proxies.expandProxy;
objectFusion.aliasAndExpandProxy = proxies.aliasAndExpandProxy;

// Expose objectFusion
module.exports = objectFusion;