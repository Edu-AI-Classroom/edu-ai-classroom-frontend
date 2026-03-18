import { useQuery } from '@tanstack/react-query';
import { GradebookService } from '@/services/gradebook/gradebook.service';

export function useClassGradebook(classId?: number) {
	return useQuery({
		queryKey: ['gradebook', 'class', classId] as const,
		queryFn: () => GradebookService.getClassGradebook(classId as number),
		enabled: classId !== null && classId !== undefined,
	});
}
