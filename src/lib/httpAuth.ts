import { useRootStore } from "@/store/rootStore";

export class HttpError extends Error {
  public validationErrors?: Record<string, string[]>;

  constructor(
    public status: number,
    public statusText: string,
    message?: string,
    validationErrors?: Record<string, string[]>,
  ) {
    super(message || `HTTP Error: ${status} ${statusText}`);
    this.name = "HttpError";
    this.validationErrors = validationErrors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

interface ErrorResponse {
  errors?: Record<string, string[]>;
  message?: string;
}

class HttpAuth {
  private baseURL: string;

  constructor(baseURL = "") {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { auth } = useRootStore.getState();

    if (auth.status === "login" && auth.user) {
      try {
        const token = await auth.user.getIdToken();
        return {
          Authorization: `Bearer ${token}`,
        };
      } catch (error) {
        console.warn("Failed to get auth token:", error);
      }
    }

    return {};
  }

  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers = {}, ...restOptions } = options;

    const authHeaders = await this.getAuthHeaders();

    const finalHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(headers as Record<string, string>),
    };

    const finalBody = body ? JSON.stringify(body) : undefined;

    const response = await fetch(`${this.baseURL}${url}`, {
      ...restOptions,
      headers: finalHeaders,
      body: finalBody,
    });

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorData: ErrorResponse | undefined;
      let validationErrors: Record<string, string[]> | undefined;
      let errorMessage: string | undefined;

      if (contentType?.includes("application/json")) {
        try {
          errorData = await response.json();
          // Railsのバリデーションエラー形式をチェック
          if (errorData?.errors && typeof errorData.errors === "object") {
            validationErrors = errorData.errors;
          }
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // JSON パースに失敗した場合は無視
        }
      }

      throw new HttpError(response.status, response.statusText, errorMessage, validationErrors);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return response.json();
    }

    return response.text() as T;
  }

  async get<T>(url: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" });
  }

  async post<T>(
    url: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "POST", body });
  }

  async put<T>(
    url: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method" | "body">,
  ): Promise<T> {
    return this.request<T>(url, { ...options, method: "PUT", body });
  }

  async delete<T>(url: string, options?: Omit<RequestOptions, "method" | "body">): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" });
  }
}

export const httpAuth = new HttpAuth(import.meta.env.VITE_API_BASE_URL);
