import { authClient } from "@/lib/auth-client";
import type { Book, BookInput } from "@/types/book";
import type { Borrow } from "@/types/borrow";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  error?: string;
  count?: number;
  data: T;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

function logApiError(context: string, error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error(`[api] ${context}`, error);
  }
}

function getApiUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return baseUrl;
}

async function getBearerToken(): Promise<string> {
  try {
    const { data, error } = await authClient.token();
    if (error || !data?.token) {
      logApiError("authClient.token() returned no token", error ?? data);
      throw new ApiError("Your session has expired. Please log in again.", 401);
    }
    return data.token;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logApiError("authClient.token() threw", error);
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }
}

/**
 * The Express API trusts a Better Auth JWT, verified against the JWKS
 * endpoint. Every private request asks Better Auth for a fresh token.
 */
export async function apiFetch<T>(
  path: string,
  { method = "GET", body, auth = true, signal }: RequestOptions = {},
): Promise<T> {
  const apiUrl = getApiUrl();
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = await getBearerToken();
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof TypeError) {
      logApiError(`network failure for ${method} ${apiUrl}${path}`, error);
      throw new ApiError(
        "Could not reach the library service. Make sure the BookNook API is running and try again.",
        0,
      );
    }
    logApiError(`unexpected fetch failure for ${method} ${apiUrl}${path}`, error);
    throw error;
  }

  const payload = (await response.json().catch((error) => {
    logApiError(`could not parse JSON from ${method} ${path}`, error);
    return null;
  })) as (ApiEnvelope<T> & { success?: boolean }) | null;

  if (!response.ok) {
    const message =
      payload?.message ??
      payload?.error ??
      `The library service returned an unexpected response (${response.status}).`;
    logApiError(
      `${method} ${path} failed with status ${response.status}`,
      message,
    );
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export interface GetBooksParams {
  category?: string;
  search?: string;
  sort?: string;
  limit?: number;
  mine?: boolean;
}

export async function getBooks(params: GetBooksParams = {}): Promise<Book[]> {
  const query = buildQuery({
    category: params.category,
    search: params.search,
    sort: params.sort,
    limit: params.limit,
    mine: params.mine ? "true" : undefined,
  });

  const result = await apiFetch<ApiEnvelope<Book[]>>(`/books${query}`, {
    auth: Boolean(params.mine),
  });

  return Array.isArray(result.data) ? result.data : [];
}

export async function getBook(id: string): Promise<Book> {
  const result = await apiFetch<ApiEnvelope<Book>>(`/books/${id}`);
  return result.data;
}

export async function createBook(input: BookInput): Promise<Book> {
  const result = await apiFetch<ApiEnvelope<Book>>("/books", {
    method: "POST",
    body: input,
  });
  return result.data;
}

export async function updateBook(
  id: string,
  input: Partial<BookInput>,
): Promise<Book> {
  const result = await apiFetch<ApiEnvelope<Book>>(`/books/${id}`, {
    method: "PATCH",
    body: input,
  });
  return result.data;
}

export async function deleteBook(id: string): Promise<void> {
  await apiFetch<ApiEnvelope<null>>(`/books/${id}`, { method: "DELETE" });
}

export async function getMyBorrows(): Promise<Borrow[]> {
  const result = await apiFetch<ApiEnvelope<Borrow[]>>("/borrows");
  return Array.isArray(result.data) ? result.data : [];
}

export async function borrowBook(bookId: string): Promise<Borrow> {
  const result = await apiFetch<ApiEnvelope<Borrow>>("/borrows", {
    method: "POST",
    body: { bookId },
  });
  return result.data;
}

export async function returnBook(borrowId: string): Promise<void> {
  await apiFetch<ApiEnvelope<null>>(`/borrows/${borrowId}`, {
    method: "DELETE",
  });
}
