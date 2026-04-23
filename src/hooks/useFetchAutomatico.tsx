import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import type { httpMethod } from "../models/types/htppMethodType";
import { axiosInterceptor } from "../interceptors";

export const useFetchAutomatico = <T,>(url: string, method: httpMethod = "get") => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const config = {
      method: method,
      signal: controller.signal,
    }

    setError(null);
    setIsLoading(true);
    axiosInterceptor(url, config)
      .then(data => setData(data.data))
      .catch((err: AxiosError) => {
        if (controller.signal.aborted) {
          // La petición fue cancelada intencionalmente, no hacemos nada
          console.log("Petición cancelada.");
        } else {
          // Es un error real de red o del servidor
          setError(err);
          setIsLoading(false);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    }
  }, []);

  return { data, isLoading, error } as const;
}