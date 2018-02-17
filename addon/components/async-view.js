import Ember from 'ember';
import layout from '../templates/components/async-view';

const { Component, computed, get, getOwner, getProperties, set } = Ember;

/**
 * A higher-order component providing support for deferred value resolution
 * using promises, rendering different views for the different promise states.
 *
 * When passed a value, if the value is a promise, a pending view is rendered
 * until the promise settles. If the promise fulfills successfully, then this
 * component yields to its block expression; if the promise is rejected, an
 * error view is displayed. If the value passed is not a promise, it is rendered
 * immediately by yielding to its block expression.
 *
 * # Positional Parameters
 *
 * value
 * : The value to resolve
 *
 * # Positional Variables
 *
 * fulfilledValue
 * : If `value` is a promise, the resolved value of that promise once it is
 *   fulfilled; otherwise, if the promsie remains pending or was rejected,
 *   `undefined`. If `value` is not a promise, then returns `value`.
 *
 * state
 * : An object representing the state of the promise containing four properties:
 *   `isPending`, `isSettled`, `isFulfilled` and `isRejected`.
 *
 *
 * @note This component has been designed for values that implement
 *       `Ember.PromiseProxyMixin`. Regular promises are not yet supported.
 *
 * @public
 */
let AsyncView = Component.extend({
  /**
   * Initialize this component by configuring defaults set via the `async-view`
   * key on the `ember-async` key in the app configuration.
   *
   * @protected
   */
  init() {
    this._super(...arguments);

    const config = getOwner(this).resolveRegistration('config:environment');
    const defaults = get(config, 'ember-async.async-view');

    for (let key in defaults) {
      if (typeof this.attrs[key] === 'undefined') {
        set(this, key, defaults[key]);
      }
    }
  },

  /**
   * The template for this component.
   *
   * @protected
   */
  layout,

  /**
   * The tag name used for this component; an empty string prevents a DOM
   * element from being created, instead rendering the template for this
   * component directly underneath its parent.
   *
   * @type {string}
   * @protected
   */
  tagName: '',

  /**
   * The value to be resolved.
   *
   * @type {Promise|any}
   * @public
   */
  value: undefined,

  /**
   * The resolved `value` after a promise has resolved, the `value` itself if it
   * was not a promise, or undefined if the promise is pending or was rejected.
   *
   * @type {any}
   * @public
   */
  fulfilledValue: computed('value', 'value.isPending', 'value.content', function() {
    let value = get(this, 'value');
    debugger;
    return value && typeof value.get('isPending') !== 'undefined' ?
      (typeof value.content !== 'undefined' ? value.content : undefined) :
      value;
  }),

  /**
   * An object representing the async state of this view, based on the current
   * state of the value. Properties of the object include `isPending`,
   * `isSettled`, `isFulfilled` and `isRejected`. See the documentation for the
   * `Ember.PromiseProxyMixin` for how these are set for Promise.
   *
   * If the value does not implement PromiseProxyMixin, the object returned has
   * `isSettled` and `isFulfilled` set to true and `isPending` and `isRejected`
   * set to false.
   *
   * @return {object} An object indicating the state of this view
   * @public
   */
  state: computed('value', 'value.isPending', 'value.isSettled',
                  'value.isRejected', 'value.isFulfilled', function() {
    let value = get(this, 'value');
    debugger;
    return value && typeof value.get('isPending') !== 'undefined' ? getProperties(value, 'isPending', 'isSettled', 'isFulfilled', 'isRejected')
    : {
      isPending: false,
      isSettled: true,
      isFulfilled: true,
      isRejected: false
    };
  }),

  /**
   * The class name to use on the element wrapping the `pendingMessage` or
   * `pendingComponent`.
   *
   * @type {string}
   * @public
   */
  pendingClass: 'async-view--pending',

  /**
   * The message to display while a promise is pending. Ignored if
   * `pendingComponent` is specified.
   *
   * @type {string}
   * @public
   */
  pendingMessage: 'Loading...',

  /**
   * The component to render while a promise is pending. Passed `value` as a
   * positional parameter.
   *
   * @type {string|Ember.Component}
   * @public
   */
  pendingComponent: undefined,

  /**
   * The class name to use on the element wrapping the `rejectedMessage` or
   * `rejectedComponent`.
   *
   * @type {string}
   * @public
   */
  rejectedClass: 'async-view--rejected',

  /**
   * The message to display when a promise is rejected. Ignored if
   * `rejectedComponent` is specified. If neither `rejectedMessage` or
   * `rejectedComponent` are specified, then the message from the reason for the
   * rejection will be displayed.
   *
   * @type {string}
   * @public
   */
  rejectedMessage: undefined,

  /**
   * The component to render when a promise is rejected. Passed `value` as a
   * positional parameter.
   *
   * @type {string|Ember.Component}
   * @public
   */
  rejectedComponent: undefined

});

AsyncView.reopenClass({
  positionalParams: ['value']
});

export default AsyncView;
