'use client';
import { useCallback, useEffect, useState } from 'react';

// The API clients don't agree on how much of the envelope they unwrap. A paginated
// payload is the object whose `data` is the item array; find it at either depth.
export function toPagePayload(res) {
  return Array.isArray(res?.data) ? res : res?.data;
}

function useAsync(run, deps) {
  const [state, setState] = useState({ status: 'loading', value: null, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Keep the previous value while the next request is in flight so the page can
    // keep its header, totals and pagination in place.
    setState((s) => ({ ...s, status: 'loading', error: null }));
    run().then(
      (value) => !cancelled && setState({ status: 'ready', value, error: null }),
      (error) => !cancelled && setState((s) => ({ ...s, status: 'error', error })),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, loading: state.status === 'loading', reload };
}

/**
 * Fetch one page of a FreeAPI collection.
 * `fetchPage` receives both `results` and `limit` since the clients use different names.
 */
export function usePaginated(fetchPage, { page, pageSize }) {
  const { value, ...rest } = useAsync(
    () => fetchPage({ page, results: pageSize, limit: pageSize }).then(toPagePayload),
    [fetchPage, page, pageSize],
  );
  return {
    ...rest,
    items: value?.data || [],
    totalItems: value?.totalItems ?? null,
    totalPages: value?.totalPages ?? null,
    hasNext: Boolean(value?.nextPage),
    hasLoaded: value !== null,
  };
}

/** Fetch a single resource; clients return the `{ statusCode, data }` envelope. */
export function useResource(fetchOne, id) {
  const { value, ...rest } = useAsync(
    () => (id ? fetchOne(id).then((res) => res?.data ?? null) : Promise.resolve(null)),
    [fetchOne, id],
  );
  return { ...rest, data: value };
}
