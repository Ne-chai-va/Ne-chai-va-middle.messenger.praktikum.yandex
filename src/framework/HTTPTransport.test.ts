import { describe, it, expect, vi, beforeEach } from "vitest";

const { getLastXHR } = vi.hoisted(() => {
  let lastInstance: MockXMLHttpRequest | null = null;

  class MockXMLHttpRequest {
    open = vi.fn();
    send = vi.fn();
    setRequestHeader = vi.fn();
    getResponseHeader = vi.fn();

    withCredentials = false;
    timeout = 0;
    responseType = "";
    status = 200;
    responseText = "";
    response: unknown = null;

    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;
    ontimeout: (() => void) | null = null;

    constructor() {
      lastInstance = this;
    }
  }

  class MockFormData {}

  vi.stubGlobal("XMLHttpRequest", MockXMLHttpRequest);
  if (typeof FormData === "undefined") {
    vi.stubGlobal("FormData", MockFormData);
  }

  return {
    MockXHR: MockXMLHttpRequest,
    getLastXHR: () => lastInstance!,
  };
});

import { HTTPTransport } from "./HTTPTransport";

describe("HTTPTransport", () => {
  const baseUrl = "https://example.com";
  let http: HTTPTransport;

  beforeEach(() => {
    vi.clearAllMocks();
    http = new HTTPTransport(baseUrl);
  });

  describe("GET requests and queryStringify", () => {
    it("should send a simple GET request with baseUrl and withCredentials = true", async () => {
      const promise = http.get("/users");
      const xhr = getLastXHR();

      expect(xhr.open).toHaveBeenCalledWith("GET", "https://example.com/users");
      expect(xhr.withCredentials).toBe(true);
      expect(xhr.send).toHaveBeenCalledWith();

      xhr.status = 200;
      xhr.responseText = "ok";
      xhr.onload?.();

      await expect(promise).resolves.toBe("ok");
    });

    it("should serialize data object into query string for GET requests", async () => {
      const promise = http.get("/search", {
        data: { query: "hello world", page: 2, empty: null },
      });
      const xhr = getLastXHR();

      expect(xhr.open).toHaveBeenCalledWith(
        "GET",
        "https://example.com/search?query=hello%20world&page=2&",
      );

      xhr.status = 200;
      xhr.onload?.();
      await promise;
    });
  });

  describe("POST, PUT, DELETE requests and body serialization", () => {
    it("should send JSON body and set Content-Type header by default for POST", async () => {
      const payload = { login: "user", password: "123" };
      const promise = http.post("/auth/signin", { data: payload });
      const xhr = getLastXHR();

      expect(xhr.open).toHaveBeenCalledWith(
        "POST",
        "https://example.com/auth/signin",
      );
      expect(xhr.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/json",
      );
      expect(xhr.send).toHaveBeenCalledWith(JSON.stringify(payload));

      xhr.status = 200;
      xhr.onload?.();
      await promise;
    });

    it("should send FormData directly without setting application/json header", async () => {
      const formData = new FormData();
      const promise = http.put("/user/avatar", { data: formData });
      const xhr = getLastXHR();

      expect(xhr.open).toHaveBeenCalledWith(
        "PUT",
        "https://example.com/user/avatar",
      );
      expect(xhr.setRequestHeader).not.toHaveBeenCalledWith(
        "Content-Type",
        "application/json",
      );
      expect(xhr.send).toHaveBeenCalledWith(formData);

      xhr.status = 200;
      xhr.onload?.();
      await promise;
    });

    it("should send DELETE request with custom headers", async () => {
      const promise = http.delete("/chats", {
        headers: { Authorization: "Bearer token123" },
        data: { chatId: 1 },
      });
      const xhr = getLastXHR();

      expect(xhr.open).toHaveBeenCalledWith(
        "DELETE",
        "https://example.com/chats",
      );
      expect(xhr.setRequestHeader).toHaveBeenCalledWith(
        "Authorization",
        "Bearer token123",
      );

      xhr.status = 200;
      xhr.onload?.();
      await promise;
    });
  });

  describe("Response parsing", () => {
    it("should automatically parse JSON response when Content-Type is application/json", async () => {
      const promise = http.get("/user");
      const xhr = getLastXHR();

      xhr.status = 200;
      xhr.getResponseHeader.mockReturnValue("application/json; charset=utf-8");
      xhr.responseText = JSON.stringify({ id: 1, name: "Alex" });
      xhr.onload?.();

      const result = await promise;
      expect(result).toEqual({ id: 1, name: "Alex" });
    });

    it("should return xhr.response directly when responseType is specified", async () => {
      const promise = http.get("/file", { responseType: "blob" });
      const xhr = getLastXHR();

      expect(xhr.responseType).toBe("blob");

      const mockBlob = { size: 100 };
      xhr.status = 200;
      xhr.response = mockBlob;
      xhr.onload?.();

      await expect(promise).resolves.toBe(mockBlob);
    });
  });

  describe("Error handling", () => {
    it("should reject if HTTP method is missing in request()", async () => {
      await expect(http.request("/test", {})).rejects.toThrow(
        "HTTP method is required",
      );
    });

    it("should reject with status and responseText on non-2xx HTTP status (e.g. 401 or 500)", async () => {
      const promise = http.get("/private");
      const xhr = getLastXHR();

      xhr.status = 401;
      xhr.responseText = '{"reason":"Cookie is not valid"}';
      xhr.onload?.();

      await expect(promise).rejects.toEqual({
        status: 401,
        response: '{"reason":"Cookie is not valid"}',
      });
    });

    it("should reject on network error, abort, and timeout", async () => {
      const netPromise = http.get("/net-err");
      getLastXHR().onerror?.();
      await expect(netPromise).rejects.toEqual({ reason: "Network error" });

      const abortPromise = http.get("/abort-err");
      getLastXHR().onabort?.();
      await expect(abortPromise).rejects.toEqual({ reason: "Request aborted" });

      const timeoutPromise = http.get("/timeout-err", { timeout: 1000 });
      const xhr = getLastXHR();
      expect(xhr.timeout).toBe(1000);
      xhr.ontimeout?.();
      await expect(timeoutPromise).rejects.toEqual({
        reason: "Request timeout",
      });
    });
  });
});
