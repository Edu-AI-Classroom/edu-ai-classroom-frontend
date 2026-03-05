import { http } from './http';

export const httpGet = <T>(url: string, options?: RequestInit) =>
	http<T>(url, { ...options, method: 'GET' });

export const httpPost = <T>(url: string, body?: unknown) =>
	http<T>(url, { method: 'POST', body } as RequestInit);

export const httpPut = <T>(url: string, body?: unknown) =>
	http<T>(url, { method: 'PUT', body } as RequestInit);

export const httpPatch = <T>(url: string, body?: unknown) =>
	http<T>(url, { method: 'PATCH', body } as RequestInit);

export const httpDelete = <T>(url: string) => http<T>(url, { method: 'DELETE' });
