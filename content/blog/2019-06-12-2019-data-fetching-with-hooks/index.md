---
date: "2019-06-12T12:00:00.000Z"
---

The benefits of Redux are well documented. It has predictability, testability, and the entire ecosystem of support. When your users don't give you the best repro steps, the action log can be a lifesaver for determing the steps a user took to get into this state. You can trace it back to the components or event handlers that triggered those actions. Having state all in one, serializable place is also fantastic for snapshotting and sending in crash logs.

But sometimes, you want a scalpel, and Redux and its ecosystem can feel like a jackhammer. What if I just want to fetch some state and not throw it in a global store? It just needs to live as long as this component or its sub-tree does. That's where hooks can come in!

## Introducing useFetch!

First, let's start with a basic `useFetch` custom hook that just handles GETs:

```javascript
import { useState, useEffect } from 'react';

export const ERROR = Symbol('error');

export function useFetch(url) {
  const [data, setData] = useState(null);
  
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
  }, [url])

  return data;
}
```

Given a truthy URL, it will attempt to fetch the data. Initially, data is `null` to signify loading or no request. On success, it'll set the data and return it. On error, it'll set the data as a special error Symbol that can be compared to. `shouldRun` is a boolean flag telling the effect whether it should call `setData`, because the effect could've been re-run due to the URL changing, or the component being unmounted.

This is super simple and easy to use for set-and-forget types of data.

*Caveat:* I don't know how this will play with Suspense for data fetching, but for now, this suffices for those cases we just need to get some data that isn't long for this world. I imagine it wouldn't be too difficult to transition to the Suspense API, but who knows? 

Here's an example implementation (imagine the active user and member list section of Discord or Slack):

```javascript
export const UserContext = React.createContext(null);

export function UserProvider({ id, children }) {
  const user = useFetch(id && `/api/v1/users/${id}`);

  if (!user) {
    return <Loading />;
  }

  if (user === ERROR) {
    return <Fallback />;
  }

  return <UserContext.Provider value={user}>{ children }</UserContext.Provider>;
}

export function ProfileBanner() {
  return (
    <UserProvider id="foo">
      <Avatar />
      <Username />
      <Settings />
    </UserProvider>
  )
}

export function MemberList({ members }) {
  return members.map(x => (
    <UserProvider key={ x.id } id={ x.id }>
      <Avatar />
      <Username />
      <NowPlaying />
    </UserProvider>
  ));
}
```

No HOCs, no action creators, no reducers, no thunks, no indirection. Just pure React. Of course, this is a contrived example of not-real code. But I wanted to demonstrate the simplicity yet power of custom hooks.

There is a clear parent-child relationship again with unidirectional data flow. This makes it obvious when there's a problem: it's either in the API, the parent that fetched the data, or the child who consumes it. You have to clearly place your children inside contexts that give them the data you need; create and provide those contexts yourself, or pass them as props the old-fashioned way; or you need to lift another provider up. This explicitness eliminates some of the footguns of using Redux for data fetching. When something goes wroung, I don't have to check action creators, reducers, selectors, middlewares, custom loaders, connected components, and so on to figure out the source of the issue.

## Winning hearts and minds

For me, the explicitness and fewer points of failure were enough, but that wasn't the case for others.

From another dev's point of view, there's a clear opportunity cost: "If I'm going to be on the hook [no pun intended] for bugs in production, I want to be able to see it in the debug logs." We were so use to storing everything in one place that it was hard to give that up, even for small one-off GETs.

That's a totally fair concern. This is people's money and their livelihoods on the line. It's a hard sell for someone who hasn't completely drunk the hooks kool-aid like I have.

## Introducing useSnapshot!

And so I set off to find a way to have my cake and eat it too. That's when I came up with the idea for a `useSnapshot` custom hook and a few creative uses of context to support snapshotting React state as well as Redux state to send in our debug logs:

```javascript
import React, {
	useState,
	useReducer,
	useEffect,
	useContext
} from 'react';

export const SnapshotDispatch = React.createContext(() => null);
export const StateSnapshot = React.createContext({});
export const ShouldSnapshot = React.createContext(false);
export const SetShouldSnapshot = React.createContext(() => null);

export const initialState = {};

export function reducer(state, { type, key, value }) {
  switch (type) {
    case 'save': return { ...state, [key]: value };
    case 'reset': return initialState;
    default: throw new Error();
  }
}

// Wrap your app or some component near the root.
export function SnapshotWrapper({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [shouldSnapshot, setShouldSnapshot] = useState(false);

  return (
    <SnapshotDispatch.Provider value={ dispatch }>
      <SetShouldSnapshot.Provider value={ setShouldSnapshot }>
        <ShouldSnapshot.Provider value={ shouldSnapshot }>
          <StateSnapshot.Provider value={ state }>
            { children }
          </StateSnapshot.Provider>
        </ShouldSnapshot.Provider>
      </SetShouldSnapshot.Provider>
    </SnapshotDispatch.Provider>
  );
}

/**
 * useSnapshot will save anything available in a component's render to send in a debug log.
 * @param {string} key An identifier for the data, such a component name + url.
 * @param {object} value The data to send in a debug log.
 * @param {boolean} shouldSave Specify whether the data should be saved.
 *  For example, `useSnapshot('Component ' + url, data, data && data.id !== props.id)`
 *  will only send the data once it has been loaded and does not match the shape you'd expect.
 *  Ignore this param if you'd like to always save a snapshot of the value.
 */
export function useSnapshot(key, value, shouldSave = true) {
  const dispatch = useContext(SnapshotDispatch);
  const shouldSnapshot = useContext(ShouldSnapshot);

  useEffect(() => {
    if (shouldSnapshot && shouldSave && key && value) {
      dispatch({ type: 'save', key, value });
    }
  }, [key, value, shouldSave, shouldSnapshot, dispatch]);
}

// Wrap your report-a-problem component (or equivalent)
// with this so that when it mounts, it will trigger useSnapshot
// to report back its state!
export function ReportProblemWrapper() {
  const dispatch = useContext(SnapshotDispatch);
  const state = useContext(StateSnapshot);
  const setShouldSnapshot = useContext(SetShouldSnapshot);

  useEffect(() => {
    setShouldSnapshot(true);

    return () => {
      dispatch({ type: 'reset' });
      setShouldSnapshot(false);
    }
  }, [dispatch, setShouldSnapshot]);

  return <ReportProblem stateSnapshot={ state } />;
}
```

Basically, `<SnapshotWrapper />` provides the app with a few functions, a boolean, and a state snapshot through [the new Context API](https://reactjs.org/docs/context.html).
- `SnapshotDispatch` is used by `useSnapshot` to snapshot state. It's also used by `<ReportProblemWrapper />` to reset the state when it is no longer needed.
- `StateSnapshot` is used by `<ReportProblemWapper />` to pass on to your `<ReportProblem />` component that sends the state off to your data store or whatever.
- `SetShouldSnapshot` is used by `<ReportProblemWapper />` to tell users of `useSnapshot` to save their current values.
- `ShouldSnapshot` is used by `useSnapshot` to determine whether it should save its current value.

Thanks to the new [`useContext` hook](https://reactjs.org/docs/hooks-reference.html#usecontext), context has been super ergonomic to use!

This is why I love hooks so much. I'm able to encapsulate logic that can be reused easily between wildly different components. I can even compose multiple `useFetch`es or `useSnapshot`s in one component if I wanted. The React team really nailed it with hooks. The possibilities are endless! I look forward to seeing what custom hooks the community and my team comes up with as we run into problems with this new tool.

Anyway, for anyone else who runs into the issue of saving React state or weaning themselves off Redux, I hope this helps. :)
