import { handleAuthError } from '@/lib/handlers/handleAuthError';
import { useAuthStore } from '@/stores/auth-store';
import type { ApiError, ApiResponse } from '@/types/api';

const DEFAULT_TIMEOUT = 15_000; // 15s
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
	const token = useAuthStore.getState().token;

	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
	}, DEFAULT_TIMEOUT);

	try {
		// 1. Nhận diện FormData
		const isFormData = options.body instanceof FormData;

		// 2. Xử lý body: Không stringify nếu là FormData
		const resolvedBody =
			options.body && typeof options.body !== 'string' && !isFormData
				? JSON.stringify(options.body)
				: options.body;

		// 3. Xử lý an toàn Headers bằng class Headers (tránh lỗi khi spread object)
		const headers = new Headers(options.headers);

		if (token) {
			headers.set('Authorization', `Bearer ${token}`);
		}

		// 4. Thiết lập Content-Type linh hoạt
		if (isFormData) {
			// Trình duyệt sẽ tự động thêm 'multipart/form-data' và chuỗi 'boundary'.
			// Cần xóa Content-Type (nếu vô tình bị set) để trình duyệt tự làm việc của nó.
			headers.delete('Content-Type');
		} else if (!headers.has('Content-Type')) {
			// Nếu không phải gửi file và chưa có Content-Type, mặc định là JSON
			headers.set('Content-Type', 'application/json');
		}

		const res = await fetch(`${API_URL}${url}`, {
			...options,
			headers, // Gắn headers đã xử lý
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

			try {
				await handleAuthError(error);
				return http<T>(url, options); // retry request
			} catch {
				throw error;
			}
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
