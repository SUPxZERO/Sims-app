import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { AxiosError } from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string, autoFetch: boolean = true) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: autoFetch,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await api.get<any>(url);
      setState({
        data: response.data.data !== undefined ? response.data.data : response.data,
        loading: false,
        error: null,
      });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setState({
        data: null,
        loading: false,
        error: axiosError.response?.data?.message || axiosError.message || 'An error occurred.',
      });
    }
  }, [url]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { ...state, refetch: fetchData };
}
