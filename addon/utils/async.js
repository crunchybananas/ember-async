import Ember from 'ember';
import DS from 'ember-data';

const { computed, get } = Ember;
const { PromiseObject, PromiseArray } = DS;

const PROMISE_TYPES = {
  'object': PromiseObject,
  'array': PromiseArray
};

/**
 * This helper returns a new property descriptor that wraps the passed async
 * computed property function. It works the same as the `computed` helper,
 * except that it require an async function (or any function that returns a
 * Promise) and a return type to be passed in. The return type should be passed
 * as the final parameter, and can be either `object` or `array`. If not
 * specified, it defaults to `object`.
 *
 * Instead of a single function, an object containing a `get` and/or `set`
 * functions can be passed in. Both functions must be async.
 *
 * # Examples
 *
 * ```
 * model: asyncComputed(async function() {
 *   let data = await this.get('store').findAll('datum');
 *    // transform data
 *   return data;
 * }, 'array')
 *
 * user: asyncComputed('userId', async function() {
 *   let data = await this.get('store').findRecord('user', this.get('userId'));
 *    // transform data
 *   return data;
 * })
 * ```
 *
 * @return a property descriptor
 * @public
 */
export function asyncComputed(...args) {
  let func = args.pop();
  let type = 'object';
  let descriptor;

  if (typeof func === 'string') {
    type = func;
    func = args.pop();
  }

  if (PROMISE_TYPES[type] == null) {
    throw new Error(`Invalid return type for asyncComputed: ${type}`);
  }

  if (typeof func === 'function') {
    descriptor = function() {
      return PROMISE_TYPES[type].create({
        promise: func.call(this)
      });
    };
  } else if (typeof func === 'object') {
    descriptor = {};

    if (func.get) {
      descriptor.get = function() {
        // TODO: Think about testing that the result of func.get is a Promise
        //       before wrapping in a promise; otherwise log a warning.
        //       [twl 25.May.17]
        return PROMISE_TYPES[type].create({
          promise: func.get.call(this)
        });
      };
    }

    if (func.set) {
      descriptor.set = function() {
        // TODO: Think about testing that the result of func.get is a Promise
        //       before wrapping in a promise; otherwise log a warning.
        //       [twl 25.May.17]
        return PROMISE_TYPES[type].create({
          promise: func.set.call(this)
        });
      };
    }
  } else {
    throw new Error('Unknown descriptor: must be either a functon or an object in the for `{ get, set }`');
  }

  args.push(descriptor);

  return computed.apply(this, args);
}

/**
 * This helper returns a new property descriptor that wraps the passed async
 * computed property function. It works the same as the `computed` helper,
 * except that it requires an async functions (or any function that returns a
 * Promise) that resolves to an object.
 *
 * Instead of a function, an object containing a `get` and/or `set` function can
 * be passed in. Both functions must be async.
 *
 * # Examples
 *
 * ```
 * user: asyncComputedObject('userId', async function() {
 *   let data = await this.get('store').findRecord('user', this.get('userId'));
 *    // transform data
 *   return data;
 * })
 * ```
 *
 * @return a property descriptor
 * @public
 */
export function asyncComputedObject(...args) {
  args.push('object');

  return asyncComputed(...args);
}

/**
 * This helper returns a new property descriptor that wraps the passed async
 * computed property function. It works the same as the `computed` helper,
 * except that it requires an async functions (or any function that returns a
 * Promise) that resolves to an array.
 *
 * Instead of a function, an object containing a `get` and/or `set` function can
 * be passed in. Both functions must be async.
 *
 * # Examples
 *
 * ```
 * model: asyncComputedArray(async function() {
 *   let data = await this.get('store').findAll('datum');
 *    // transform data
 *   return data;
 * })
 * ```
 *
 * @return a property descriptor
 * @public
 */
export function asyncComputedArray(...args) {
  args.push('array');

  return asyncComputed(...args);
}

/**
 * Returns the value at the `path` underneath the `object`, waiting to resolve
 * any promises in the path before returning the value. If any part of the path
 * resolves to null or undefined, then undefined is returned.
 *
 * @param  {object} object The root object whose property will be returned
 * @param  {string} path   A dotted path to the property to return
 *
 * @return {any|Promise<any>} The value or a promise that resolves to the value
 *                            at the path underneath the object
 * @public
 */
export async function asyncGet(object, path) {
  let keys = path.split('.');

  object = await object;

  do {
    if (object == null) {
      break;
    }

    object = await get(object, keys.shift());
  }
  while (keys.length > 0);

  return object;
}
