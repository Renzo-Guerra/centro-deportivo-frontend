import { useState } from "react";
import axios, { AxiosError } from "axios";
import type { httpMethod } from "../models/types/htppMethodType";

const useFetch = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError | null>(null);

  const submitRequest = (url: string, method: httpMethod = "get", body: any) => {
    const controller = new AbortController();

    const config = {
      method: method,
      data: body,
      signal: controller.signal,
    }

    setIsLoading(true);
    setError(null);

    axios(url, config)
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

export default useFetch;