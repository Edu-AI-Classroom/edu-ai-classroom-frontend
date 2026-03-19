import { http } from './http';

export const httpGet = <T>(url: string, options?: RequestInit & { timeout?: number }) =>
	http<T>(url, { ...options, method: 'GET' });

export const httpPost = <T>(url: string, body?: unknown, options?: { timeout?: number }) =>
	http<T>(url, { ...options, method: 'POST', body });

export const httpPut = <T>(url: string, body?: unknown, options?: { timeout?: number }) =>
	http<T>(url, { ...options, method: 'PUT', body });

export const httpPatch = <T>(url: string, body?: unknown, options?: { timeout?: number }) =>
	http<T>(url, { ...options, method: 'PATCH', body });

export const httpDelete = <T>(url: string, options?: { timeout?: number }) =>
	http<T>(url, { ...options, method: 'DELETE' });
