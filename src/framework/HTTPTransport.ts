export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type HttpMethod = (typeof HttpMethods)[keyof typeof HttpMethods];

export type HttpOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
  responseType?: XMLHttpRequestResponseType;
};

function queryStringify(data: Record<string, unknown>): string {
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be a non-null object");
  }
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return "";
  }
  return keys.reduce((result, key, index) => {
    if (data[key] === undefined || data[key] === null) {
      return result;
    }
    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(String(data[key]));
    const separator = index < keys.length - 1 ? "&" : "";
    return `${result}${encodedKey}=${encodedValue}${separator}`;
  }, "?");
}

export class HTTPTransport {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  get = (url: string, options: HttpOptions = {}) => {
    return this.request(
      url,
      { ...options, method: HttpMethods.GET },
      options.timeout,
    );
  };

  post = (url: string, options: HttpOptions = {}) => {
    return this.request(
      url,
      { ...options, method: HttpMethods.POST },
      options.timeout,
    );
  };

  put = (url: string, options: HttpOptions = {}) => {
    return this.request(
      url,
      { ...options, method: HttpMethods.PUT },
      options.timeout,
    );
  };

  delete = (url: string, options: HttpOptions = {}) => {
    return this.request(
      url,
      { ...options, method: HttpMethods.DELETE },
      options.timeout,
    );
  };

  request = (
    url: string,
    options: HttpOptions = {},
    timeout: number = 5000,
  ): Promise<unknown> => {
    const { headers = {}, method, data, responseType } = options;

    return new Promise((resolve, reject) => {
      if (!method) {
        reject(new Error("HTTP method is required"));
        return;
      }

      const xhr = new XMLHttpRequest();
      const isGet = method === HttpMethods.GET;

      const fullUrl = this.baseUrl + url;

      xhr.open(
        method,
        isGet && data
          ? `${fullUrl}${queryStringify(data as Record<string, unknown>)}`
          : fullUrl,
      );

      if (responseType) {
        xhr.responseType = responseType;
      }

      Object.keys(headers).forEach((key) => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          let response;
          if (xhr.responseType) {
            response = xhr.response;
          } else {
            try {
              const contentType = xhr.getResponseHeader("Content-Type");
              if (contentType && contentType.includes("application/json")) {
                response = JSON.parse(xhr.responseText);
              } else {
                response = xhr.responseText;
              }
            } catch (e) {
              response = xhr.responseText;
            }
          }
          resolve(response);
        } else {
          reject({ status: xhr.status, response: xhr.responseText });
        }
      };

      xhr.onabort = () => reject({ reason: "Request aborted" });
      xhr.onerror = () => reject({ reason: "Network error" });
      xhr.timeout = timeout;
      xhr.ontimeout = () => reject({ reason: "Request timeout" });

      if (isGet || !data) {
        xhr.send();
      } else if (data instanceof FormData) {
        xhr.send(data);
      } else if (typeof data === "object") {
        if (!headers["Content-Type"]) {
          xhr.setRequestHeader("Content-Type", "application/json");
        }
        xhr.send(JSON.stringify(data));
      } else {
        xhr.send(data as string | Document | Blob | ArrayBuffer | null);
      }
    });
  };
}
