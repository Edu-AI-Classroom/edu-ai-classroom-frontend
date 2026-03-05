import { http } from './http';

export const httpGet = <T>(url: string, options?: RequestInit) =>
	http<T>(url, { ...options, method: 'GET' });

export const httpPost = <T>(url: string, body?: any) => http<T>(url, { method: 'POST', body });

export const httpPut = <T>(url: string, body?: any) => http<T>(url, { method: 'PUT', body });

export const httpPatch = <T>(url: string, body?: any) => http<T>(url, { method: 'PATCH', body });

export const httpDelete = <T>(url: string) => http<T>(url, { method: 'DELETE' });
