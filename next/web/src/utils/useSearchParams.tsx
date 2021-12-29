import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { NavigateOptions, useLocation, useNavigate } from 'react-router-dom';
import { noop } from 'lodash-es';

export const SearchParamsContext = createContext({
  params: {} as Record<string, string | undefined>,
  set: noop as (params: Record<string, string | undefined>, options?: NavigateOptions) => void,
  merge: noop as (params: Record<string, string | undefined>, options?: NavigateOptions) => void,
});

export function SearchParamsProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { search } = useLocation();

  const $dirtyParams = useRef<Record<string, string | undefined>>();
  useEffect(() => () => ($dirtyParams.current = undefined));

  const params = useMemo(() => {
    const params: Record<string, string> = {};
    new URLSearchParams(search).forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [search]);

  const set = useCallback(
    (newParams: Record<string, string | undefined>, options?: NavigateOptions) => {
      const searchParams = new URLSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value);
        }
      });
      navigate({ search: searchParams.toString() }, options);
    },
    [navigate]
  );

  const merge = useCallback(
    (newParams: Record<string, string | undefined>, options?: NavigateOptions) => {
      $dirtyParams.current = { ...params, ...$dirtyParams.current, ...newParams };
      set($dirtyParams.current, options);
    },
    [params, set]
  );

  return (
    <SearchParamsContext.Provider value={{ params, set, merge }}>
      {children}
    </SearchParamsContext.Provider>
  );
}

export function useSearchParams() {
  const { params, set, merge } = useContext(SearchParamsContext);
  return [params, { set, merge }] as const;
}

export function useSearchParam(key: string) {
  const [params, { merge }] = useSearchParams();
  const param = useMemo(() => params[key], [params, key]);
  const set = useCallback(
    (value: string | undefined, options?: NavigateOptions) => {
      merge({ [key]: value }, options);
    },
    [merge, key]
  );
  return [param, set] as const;
}