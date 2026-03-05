import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/types/api';

type QueryLikeMeta = {
	meta?: {
		silent?: boolean;
	};
};

function handleGlobalError(error: unknown, meta?: QueryLikeMeta) {
	if (meta?.meta?.silent) return;
	const apiError = error as ApiError;
	console.log('Global error handler:', apiError);
	if (!apiError) {
		toast.error('Something went wrong');
		return;
	}
	switch (apiError.code) {
		case 'REQUEST_TIMEOUT':
			toast.error('Server phản hồi quá chậm');
			break;

		case 'NETWORK_ERROR':
			toast.error('Không thể kết nối server');
			break;

		case 'NOT_FOUND':
			toast.error('Không tìm thấy tài nguyên');
			break;

		default:
			toast.error(apiError.message ?? 'Something went wrong');
	}
}

function handleMutationError(error: unknown) {
	const apiError = error as ApiError;
	console.log('Mutation error handler:', apiError);
	if (!apiError) {
		toast.error('Something went wrong');
		return;
	}
	switch (apiError.code) {
		case 'REQUEST_TIMEOUT':
			toast.error('Server phản hồi quá chậm');
			break;

		case 'NETWORK_ERROR':
			toast.error('Không thể kết nối server');
			break;

		case 'NOT_FOUND':
			toast.error('Không tìm thấy tài nguyên');
			break;

		default:
			toast.error(apiError.message ?? 'Something went wrong');
	}
}

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error, query) => {
			if ((query?.meta as QueryLikeMeta)?.meta?.silent) return;
			handleGlobalError(error);
		},
	}),
	mutationCache: new MutationCache({
		onError: (error) => {
			handleMutationError(error);
		},
	}),

	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});
