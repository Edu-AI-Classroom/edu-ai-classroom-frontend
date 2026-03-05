import { useQuery } from '@tanstack/react-query';
import { AuthService } from '@/services/auth/auth.service';

export function useTeacherSearch(search: string) {
	const normalizedSearch = search.trim();

	return useQuery({
		queryKey: ['auth', 'teacher-search', normalizedSearch],
		queryFn: () => AuthService.searchTeachers(normalizedSearch),
		enabled: normalizedSearch.length >= 2,
		staleTime: 1000 * 60,
	});
}
