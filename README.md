Ember Async
===========

A collection of components and helpers for handling async data in Ember.


Installation
------------

```
ember install ember-async
```


Usage
-----

### Async-View Component

The `async-view` component is a higher-order component providing support for
deferred value resolution using promises, rendering different views for the
different promise states.

When passed a value, if the value is a promise, a pending view is rendered
until the promise settles. If the promise fulfills successfully, then this
component yields to its block expression; if the promise is rejected, an
error view is displayed. If the value passed is not a promise, it is rendered
immediately by yielding to its block expression.

When yielding to the block expression, both the `fulfilledValue` and `state` are
passed; when yielding to a pending or rejected component, the original `value`
and `state` are passed (thus allowing the `reason` to be retrieved from a
rejected promise).

Using this component, the `fulfilledValue` is guaranteed to be the resolved
value from the promise, or be undefined, thus allowing components that require
an actual model instance (such as `ember-form-for` when getting a localized
string) to work correctly.

> Note: This component has been designed for values that implement
 [Ember.PromiseProxyMixin](https://emberjs.com/api/classes/Ember.PromiseProxyMixin.html),
 such as models returned from a store. Regular promises are not yet supported.

#### Using default configuration

```
{{#async-view model as |loadedModel|}}
  {{my-form loadedModel}}
{{#/async-view}}
```

#### Configuring with parameters

```
{{#async-view model
    pendingMessage="Fetching..."
    rejectedMessage="Oops! Something went wrong"
    as |loadedModel|}}

  {{my-form loadedModel}}

{{#/async-view}}
```

```
{{#async-view model
    pendingComponent=(component "spinner")
    rejectedComponent=(component "error-message")
    as |loadedModel|}}

  {{my-form loadedModel}}

{{#/async-view}}
```

#### Configuring with environment

If using `async-view` throughout an application, it can be convenient to specify
configuration information globally. This can be done through the environment
under the key `async-view` within the `ember-async` section.

Use the component in a template the same as with the default configuration:

```
{{#async-view model as |loadedModel|}}
  {{my-form loadedModel}}
{{#/async-view}}
```

Then specify your options in the app configuration:

```
ENV['ember-async'] = {
  'async-view': {
    'pendingComponent': 'spinner',
    'rejectedMessage': 'Oops! An error occurred'
  }
}
```

If you specify any parameters in a template, they will override the parameters
specified in the configuration.


#### Positional Parameters

##### value

The value to resolve.

#### Named Parameters

##### pendingClass

The class name to use on the element wrapping the `pendingMessage` or
`pendingComponent`. Defaults to `async-view--pending`.

##### pendingMessage

The message to display while a promise is pending. Ignored if
`pendingComponent` is specified. Defaults to `Loading...`.

##### pendingComponent

The component to render while a promise is pending. Can be set to either a
component instance, or the name of the component. Passed `value` and `state` as
positional parameters.

##### rejectedClass

The class name to use on the element wrapping the `rejectedMessage` or
`rejectedComponent`. Defaults to `async-view--rejected`.

##### rejectedMessage

The message to display when a promise is rejected. Ignored if
`rejectedComponent` is specified. If neither `rejectedMessage` or
`rejectedComponent` are specified, then the message from the reason for the
rejection will be displayed.

##### rejectedComponent

The component to render when a promise is rejected. Can be set to either a
component instance, or the name of the component. Passed `value` and `state` as
positional parameters.

#### Positional Block Variables

##### fulfilledValue

If `value` is a promise, the resolved value of that promise once it is
fulfilled; otherwise, if the promise remains pending or was rejected,
`undefined`. If `value` is not a promise, then returns `value`.

##### state

An object representing the state of the promise containing four properties:
`isPending`, `isSettled`, `isFulfilled` and `isRejected`.

#### Styling

When a promise is pending or rejected, the message or component is wrapped in a
`div` using the class name `async-view--pending` or `async-view--rejected`,
respectively.

When this component yields to its block expression, it does so without extra
DOM elements, so no styling can be applied.


Related Libraries
-----------------

### [ember-promise-helpers](https://github.com/fivetanley/ember-promise-helpers)

Provides helpers for handling async data within templates.

### [ember-async-button](https://github.com/DockYard/ember-async-button)

A button whose state reflects the state of a promise returned from a closure
action, e.g. for updating the text based on the state of saving a form.


Authors
-------

- [Trevor Lohrbeer](https://github.com/fastfedora)


Legal
-----

© 2017 Crunchy Bananas, LLC

[CrunchyBananas.com](https://crunchybananas.com/)

Licensed under the [MIT license](http://www.opensource.org/licenses/mit-license.php)
