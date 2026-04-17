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
  body,
  headers = {}, // Inicializa os headers
  signal,
  setLoading,
}: RequestOptions) {
  const isFormData = body instanceof FormData;

  const optionsBase: RequestInit = {
    method,
    signal,
    headers: { ...headers },
  };

  if (body && method !== "GET") {
    if (isFormData) {
      optionsBase.body = body;
    } else {
      optionsBase.body = JSON.stringify(body);

      optionsBase.headers = {
        ...optionsBase.headers,
        "Content-Type": "application/json",
      };
    }
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
