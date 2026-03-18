import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet } from '@/services/http.helpers';
import type { Subject } from '@/types/subject';

type SubjectApiResponse = {
	subject_id: number;
	subject_name: string;
};

export const SubjectService = {
	getSubjects: async (): Promise<Subject[]> => {
		const subjects = await httpGet<SubjectApiResponse[]>(API_ENDPOINTS.SUBJECT.GET_SUBJECTS);

		return subjects.map((subject) => ({
			id: subject.subject_id,
			name: subject.subject_name,
		}));
	},
};
