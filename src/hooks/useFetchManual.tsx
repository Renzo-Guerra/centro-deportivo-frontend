import { useState } from "react";
import { AxiosError } from "axios";
import { axiosInterceptor } from "../interceptors";
import type { HttpMethodType } from "../models";

export const useFetchManual = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const submitRequest = <E,>(url: string, method: HttpMethodType = "GET", body?: E) => {
    const controller = new AbortController();

    const config = {
      method: method,
      data: body,
      signal: controller.signal,
    }

    setIsLoading(true);
    setError(null);

    axiosInterceptor(url, config)
      .then(response => setData(response.data))
      .catch(err => {
        console.error(err);
        setError(err);
        setData(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return { data, isLoading, error, submitRequest } as const;
}