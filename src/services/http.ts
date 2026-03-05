import { handleAuthError } from '@/lib/handlers/handleAuthError';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError, ApiResponse } from '@/types/api';

const DEFAULT_TIMEOUT = 15_000;
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

type HttpOptions = Omit<RequestInit, 'body'> & {
	body?: unknown;
	retry?: boolean; // tránh infinite retry
};

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
	const token = useAuthStore.getState().token;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

	try {
		const isFormData = options.body instanceof FormData;

		// Resolve body safely
		const resolvedBody: BodyInit | undefined =
			options.body == null
				? undefined
				: typeof options.body === 'string' ||
						options.body instanceof Blob ||
						options.body instanceof FormData ||
						options.body instanceof URLSearchParams ||
						options.body instanceof ReadableStream ||
						options.body instanceof ArrayBuffer
					? options.body
					: JSON.stringify(options.body);

		// Safe headers
		const headers = new Headers(options.headers);

		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		// Content-Type handling
		if (isFormData) {
			headers.delete('Content-Type');
		} else if (!headers.has('Content-Type')) {
			headers.set('Content-Type', 'application/json');
		}

		const res = await fetch(`${API_URL}${url}`, {
			...options,
			headers,
			body: resolvedBody,
			signal: controller.signal,
		});

		// 204 No Content
		if (res.status === 204) {
			return null as T;
		}

		// Safe JSON parse
		let json: any = null;
		const contentType = res.headers.get('content-type');

		if (contentType?.includes('application/json')) {
			json = await res.json();
		}

		// HTTP error
		if (!res.ok || json?.success === false) {
			const error: ApiError = {
				status: json?.statusCode ?? res.status,
				code: json?.code ?? 'UNKNOWN_ERROR',
				message: json?.message ?? res.statusText ?? 'Something went wrong',
			};

			// Retry only once (avoid infinite loop)
			if (!options.retry) {
				try {
					await handleAuthError(error);
					return http<T>(url, { ...options, retry: true });
				} catch {
					throw error;
				}
			}

			throw error;
		}

		return (json as ApiResponse<T>)?.data ?? (null as T);
	} catch (error: unknown) {
		const unknownError = error as {
			status?: number;
			code?: string;
			name?: string;
		};

		// Nếu đã là ApiError → throw lại
		if (unknownError.status !== undefined && unknownError.code) {
			throw error;
		}

		// Timeout
		if (unknownError.name === 'AbortError') {
			throw {
				status: 0,
				code: 'REQUEST_TIMEOUT',
				message: 'Server is not responding. Please try again later.',
			} as ApiError;
		}

		// Network error
		throw {
			status: 0,
			code: 'NETWORK_ERROR',
			message: 'Network error. Please check your connection.',
		} as ApiError;
	} finally {
		clearTimeout(timeoutId);
	}
}
