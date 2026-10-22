"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs `fetcher` whenever `deps` change (or `reload` is called) and keeps the previous
 * data on screen while the next request is in flight.
 *
 * Returns { data, error, loading, reload }.
 */
export function useFetch(fetcher, deps = [], { enabled = true } = {}) {
  const [reloadCount, setReloadCount] = useState(0);
  const [state, setState] = useState({ key: null, data: null, error: null });
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const key = enabled ? `${JSON.stringify(deps)}#${reloadCount}` : null;

  useEffect(() => {
    if (!key) return undefined;
    let active = true;

    fetcherRef
      .current()
      .then((data) => active && setState({ key, data, error: null }))
      .catch((error) => active && setState((prev) => ({ key, data: prev.data, error })));

    return () => {
      active = false;
    };
  }, [key]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return {
    data: state.data,
    error: state.key === key ? state.error : null,
    loading: enabled && state.key !== key,
    reload,
  };
}
