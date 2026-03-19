export interface ApiResponse<T> {
	success?: boolean;
	data: T;
	message?: string;
	error?: ApiError;
}

export interface ApiMetaResponse {
	success: boolean;
	statusCode: number;
	message: string;
	path: string;
	timestamp: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
	search?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
}

export interface ApiError {
	status: number;
	code: string;
	message: string;
}
