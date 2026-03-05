import { handleAuthError } from '@/lib/handlers/handleAuthError';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError, ApiResponse } from '@/types/api';

const DEFAULT_TIMEOUT = 15_000; // 15s
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

type HttpOptions = Omit<RequestInit, 'body'> & {
	body?: unknown;
};

export async function http<T>(url: string, options: HttpOptions = {}): Promise<T> {
	const token = useAuthStore.getState().token;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, DEFAULT_TIMEOUT);

	try {
		const resolvedBody: BodyInit | null | undefined =
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
		const resolvedHeaders = {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(options.headers ?? {}),
		};

		const res = await fetch(`${API_URL}${url}`, {
			...options,
			headers: resolvedHeaders,
			body: resolvedBody,
			signal: controller.signal,
		});

		// 204 No Content
		if (res.status === 204) return null as T;

		const json = await res.json();

		// HTTP error
		if (!res.ok || json.success === false) {
			const error: ApiError = {
				status: json.statusCode || res.status,
				code: json.code ?? 'UNKNOWN_ERROR',
				message: json.message ?? 'Something went wrong',
			};
			await handleAuthError(error);
			return http<T>(url, options); // retry request
		}

		return (json as ApiResponse<T>).data;
	} catch (error: unknown) {
		const unknownError = error as {
			status?: number;
			code?: string;
			name?: string;
		};

		// Nếu đã là ApiError → throw lại nguyên bản
		if (unknownError.status !== undefined && unknownError.code) {
			throw error;
		}

		// fetch bị abort → timeout
		if (unknownError.name === 'AbortError') {
			throw {
				status: 0,
				code: 'REQUEST_TIMEOUT',
				message: 'Server is not responding. Please try again later.',
			} as ApiError;
		}

		if (unknownError.status === 404) {
			throw {
				status: 0,
				code: 'NOT_FOUND',
				message: 'Server error. Please try again later.',
			} as ApiError;
		}

		// network error (offline, DNS, CORS)
		throw {
			status: 0,
			code: 'NETWORK_ERROR',
			message: 'Network error. Please check your connection.',
		} as ApiError;
	} finally {
		clearTimeout(timeoutId);
	}
}
