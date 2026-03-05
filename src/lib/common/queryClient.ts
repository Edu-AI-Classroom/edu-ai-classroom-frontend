import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/types/api';

type QueryLikeMeta = {
	meta?: {
		silent?: boolean;
	};
};

function handleGlobalError(error: unknown, target?: QueryLikeMeta) {
	if (target?.meta?.silent) return;
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

const handleQueryError = (error: unknown, query: QueryLikeMeta) => {
	handleGlobalError(error, query);
};

const handleMutationError = (
	error: unknown,
	_variables: unknown,
	_onMutateResult: unknown,
	mutation: { options?: QueryLikeMeta },
) => {
	handleGlobalError(error, mutation.options);
};

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: handleQueryError,
	}),
	mutationCache: new MutationCache({
		onError: handleMutationError,
	}),

	defaultOptions: {
		queries: {
			retry: false,
			refetchOnWindowFocus: false,
		},
	},
});
