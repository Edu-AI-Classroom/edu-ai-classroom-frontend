import { API_ENDPOINTS } from '@/services/api/api.endpoint';
import { httpGet } from '@/services/http.helpers';
import type { ClassGradebook } from '@/types/gradebook';

export const GradebookService = {
  getClassGradebook: (classId: number) => httpGet<ClassGradebook>(API_ENDPOINTS.CLASS.GRADEBOOK(classId)),
};

