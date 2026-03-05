import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { SubjectService } from '@/services/subject/subject.service';

export function useSubjects() {
	return useQuery({
		queryKey: queryKeys.subject.all,
		queryFn: () => SubjectService.getSubjects(),
	});
}
