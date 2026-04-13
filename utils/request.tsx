import { useLoading } from "@/context/loadingContext";
import { configs } from "./configs";

export function useRequest() {
  const { setLoading } = useLoading();

  async function request(
    urlComplement: string,
    method: string,
    body?: any,
    signal?: AbortSignal,
  ) {
    const url = `${configs.apiUrl}${urlComplement}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      signal,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      setLoading(true);

      const response = await fetch(url, options);
      return response;
    } finally {
      setLoading(false);
    }
  }

  return { request };
}
