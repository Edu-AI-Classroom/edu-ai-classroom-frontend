import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { LessonService } from '@/services/lesson/lesson.service';

export const useLessonList = (classId: number) => {
	return useQuery({
		queryKey: queryKeys.lesson.list(classId),
		queryFn: () => LessonService.list(classId),
		enabled: !!classId,
	});
};

export const useCreateLesson = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (formData: FormData) => LessonService.create(formData),
		onSuccess: () => {
			// Refetch lại danh sách lesson sau khi tạo thành công
			queryClient.invalidateQueries({ queryKey: queryKeys.lesson.all });
		},
	});
};

export const useDeleteLesson = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		mutationFn: (id: string) => LessonService.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.lesson.all });
		},
	});
};

export const useUpdateLesson = () => {
	const queryClient = useQueryClient();
	
	return useMutation({
		// Vì hàm update cần cả id và payload, ta bọc nó vào một object
		mutationFn: ({ id, formData }: { id: string; formData: FormData }) => 
			LessonService.update(id, formData),
		onSuccess: () => {
			// Refetch lại danh sách lesson sau khi cập nhật thành công
			queryClient.invalidateQueries({ queryKey: queryKeys.lesson.all });
		},
	});
};