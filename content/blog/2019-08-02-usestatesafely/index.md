---
title: Introducing useStateSafely
date: "2019-08-02T12:00:00.000Z"
description: A custom hook for setting state without memory leaks.
---

If you just want to see the custom hook implementation in action, [check out this Code Sandbox](https://codesandbox.io/embed/ecstatic-hooks-nd0ky). Otherwise, read on for my ramblings on the problem space and path to a solution.

# The problem

We've all seen this error before:

```
Warning: Can't perform a React state update on an
unmounted component. This is a no-op, but it indicates
a memory leak in your application. To fix, cancel all
subscriptions and asynchronous tasks in a useEffect
cleanup function.
    in SomeComponent (created by App)
```

Whether it's due to a `setTimeout` or a Promise resolving too late, it happens. There are already a few solutions out there to fix this.

For example, when implementing setState in a [custom hook for data fetching](https://jeffchheng.github.io/brains-base/2019-06-12-data-fetching-with-hooks/), you need to set a boolean and check before setting state. This will prevent setStates when props have changed _and_ component unmount.

```javascript
// ...
useEffect(() => {
  let shouldRun = true;

  if (url) {
    fetch(url)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('not ok');
      })
      .then(res => shouldRun && setData(res))
      .catch(err => shouldRun && setData(ERROR));
  }

  return () => {
    shouldRun = false;
  }
}, [url]);
// ...
```

In a class component, you can set an [instance variable](https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html).

```javascript
import React from 'react';

export const ERROR = Symbol('error');

export class Component extends React.Component {
  state = {};

  componentDidMount() {
    this._mounted = true;
    fetch('/api/v1/users')
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('not ok');
      })
      .then(res => this._mounted && setData(res))
      .catch(err => this._mounted && setData(ERROR));
  }

  componentWillUnmount() {
    this._mounted = false;
  }
}
```

Fairly similar. Reusing the class version is more difficult, but it's easier to access to any mutable variable for the component instance through `this`.

But in the end, it's the same principal that will allow for implementing a safe version of `useState` that can be arbitrarily called at any point in time, whether that's through a outstanding network request, or some errant `setTimeout`. That is, we need a variable to keep track of whether a component is still mounted.

That's where [refs](https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables) come in. On component mount, you can initialize the ref to `true`, an analog to `this._mounted = true`. Then, on unmount, you can set the ref to `false`, the equivalent of `this._mounted = false;`. Putting this together...

# The solution: useStateSafely!

```javascript
function useStateSafely(initialValue) {
  const [value, setValue] = useState(initialValue);
  const isSafe = useRef(true);

  useEffect(() => {
    // Future proofing for double-invoking
    // effects in Strict Mode.
    isSafe.current = true;
    return () => {
      isSafe.current = false;
    };
  }, []);

  const setValueSafely = newValue => {
    if (isSafe.current) {
      setValue(newValue);
    }
  };

  return [value, setValueSafely];
}
```

This has the same public API as useState*, but will not log an error when you attempt to setState on an unmounted component because this custom hook won't let it happen.

(*setState will log an error if you pass in more than one arg, but effectively the same outcome. Feel free to change `newValue` to `...args` to more accurately simulate setState.)

# Where would I use this?

There are a couple use cases, I think.

If you're using Redux with thunks and callbacks to setState, this'll be handy for that. Maybe you're loading something on a page, it's going to error, but the user navigates away. Maybe you don't have a library or polyfill for canceling network requests, so your callback is gonna run regardless.

Using `setTimeout` on user interaction, like a click handler. There's probably a use case for typing in an input field, but maybe a `useDebounce` custom hook would fit that use case better. Included here, because why not?

```javascript
import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => {
			clearTimeout(id);
		};
	}, [setDebouncedValue, value, delay]);

	return debouncedValue;
}
```

# Final thoughts

Even though this blog is about using `setState` without memory leaks, I would not recommend wholesale replacing `useState` with this version. It's more an escape hatch for rare cases.

You should carefully consider other, better patterns for avoiding memory leaks. But sometimes, we don't have that luxury in app development, so I hope this helps in those cases.
