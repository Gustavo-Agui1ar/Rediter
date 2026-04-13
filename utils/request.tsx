import { configs } from "./configs";

interface RequestOptions {
  urlComplement: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
  setLoading?: (loading: boolean) => void;
  signal?: AbortSignal;
  multipart?: boolean;
}

export async function request({
  urlComplement,
  method,
  headers,
  body,
  signal,
  setLoading,
}: RequestOptions) {
  const optionsBase: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body && method !== "GET") {
    optionsBase.body = JSON.stringify(body);
  }

  let lastError: any;

  try {
    setLoading?.(true);

    for (const baseUrl of configs.apiUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), configs.timeout);

      try {
        const url = `${baseUrl}${urlComplement}`;

        const response = await fetch(url, {
          ...optionsBase,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response;
      } catch (err) {
        clearTimeout(timeoutId);
        lastError = err;

        console.log(`Falhou em ${baseUrl}, tentando próximo...`);
      }
    }

    throw lastError;
  } finally {
    setLoading?.(false);
  }
}
