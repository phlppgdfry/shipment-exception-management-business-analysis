"use client";
// React bindings for the mock API: a live snapshot for rendering, queries with loading/error states,
// and commands that surface the API's problem details to the user.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { ApiError, getApi, serverSnapshot, type MockControlTowerApi } from "@/api/mock-api";
import type { DemoState } from "@/domain/types";

const noopSubscribe = () => () => {};

export function useApi(): MockControlTowerApi {
  return getApi();
}

/** The current demo state. During prerendering and hydration this is the deterministic start state. */
export function useDemoState(): DemoState {
  const isClient = typeof window !== "undefined";
  const api = isClient ? getApi() : null;
  return useSyncExternalStore(api ? api.subscribe : noopSubscribe, api ? api.snapshot : serverSnapshot, serverSnapshot);
}

export interface Query<T> {
  data: T | undefined;
  error: ApiError | null;
  loading: boolean;
  retry: () => void;
}

/** Calls a read endpoint and re-runs it whenever the demo state changes. Keeps showing old data while refreshing. */
export function useQuery<T>(fetcher: (api: MockControlTowerApi) => Promise<T>, key: string): Query<T> {
  const state = useDemoState();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ data: T | undefined; error: ApiError | null; loading: boolean; key: string }>({ data: undefined, error: null, loading: true, key });
  useEffect(() => {
    let cancelled = false;
    fetcher(getApi())
      .then((data) => !cancelled && setResult({ data, error: null, loading: false, key }))
      .catch((e: unknown) => !cancelled && setResult((r) => ({ data: r.key === key ? r.data : undefined, error: e instanceof ApiError ? e : new ApiError({ type: "about:blank", title: "Error", status: 500, detail: String(e) }), loading: false, key })));
    return () => {
      cancelled = true;
    };
    // fetcher is recreated on every render; the key, the state and the retry counter decide when to refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, key, attempt]);
  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  const stale = result.key !== key;
  return { data: stale ? undefined : result.data, error: stale ? null : result.error, loading: stale || (result.loading && result.data === undefined), retry };
}

/** Runs a command; exposes pending and the problem detail of a failure. */
export function useCommand() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const run = useCallback(async <T,>(fn: (api: MockControlTowerApi) => Promise<T>): Promise<T | undefined> => {
    setPending(true);
    setError(null);
    try {
      return await fn(getApi());
    } catch (e) {
      setError(e instanceof ApiError ? `${e.problem.title} (${e.problem.status}): ${e.problem.detail}` : String(e));
      return undefined;
    } finally {
      setPending(false);
    }
  }, []);
  return { run, pending, error, clearError: () => setError(null) };
}

// "Acting as": the role the person using the demo plays. Decides which actions are allowed (NFR-06).
interface ActingAs {
  userId: string;
  setUserId: (id: string) => void;
}
const ActingAsContext = createContext<ActingAs>({ userId: "USR-PLANNER", setUserId: () => {} });
const ACTING_KEY = "control-tower-acting-as";

export function ActingAsProvider({ children }: { children: ReactNode }) {
  const [userId, setUserIdState] = useState("USR-PLANNER");
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(ACTING_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring a per-tab preference after hydration
      if (stored) setUserIdState(stored);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    try {
      window.sessionStorage.setItem(ACTING_KEY, id);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const value = useMemo(() => ({ userId, setUserId }), [userId, setUserId]);
  return <ActingAsContext.Provider value={value}>{children}</ActingAsContext.Provider>;
}

export const useActingAs = () => useContext(ActingAsContext);

export function useClientReady() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
