import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ParentService, StudentParentLinkService } from '@/services/parent/parent.service';

export function useParentStudents() {
	return useQuery({
		queryKey: ['parent', 'students'],
		queryFn: ParentService.getStudents,
	});
}

export function useParentStudentClasses(studentId?: number) {
	return useQuery({
		queryKey: ['parent', 'students', studentId, 'classes'],
		queryFn: () => ParentService.getStudentClasses(studentId as number),
		enabled: !!studentId,
	});
}

export function useParentGradebook(studentId?: number, classId?: number) {
	return useQuery({
		queryKey: ['parent', 'students', studentId, 'classes', classId, 'gradebook'],
		queryFn: () => ParentService.getStudentClassGradebook(studentId as number, classId as number),
		enabled: !!studentId && !!classId,
	});
}

export function useParentConversations() {
	return useQuery({
		queryKey: ['parent', 'conversations'],
		queryFn: ParentService.getConversations,
		refetchInterval: 8000,
	});
}

export function useConsumeParentLinkCode() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ code, relationship }: { code: string; relationship?: string }) =>
			ParentService.consumeLinkCode(code, relationship),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['parent'] });
		},
	});
}

export function useCreateParentConversation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ studentId, classId }: { studentId: number; classId: number }) =>
			ParentService.createConversation(studentId, classId),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['parent', 'conversations'] });
		},
	});
}

export function useStudentParentLinkCode() {
	return useQuery({
		queryKey: ['student', 'parent-link-code', 'active'],
		queryFn: StudentParentLinkService.active,
	});
}

export function useCreateStudentParentLinkCode() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: StudentParentLinkService.create,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['student', 'parent-link-code'] });
		},
	});
}

export function useRevokeStudentParentLinkCode() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: StudentParentLinkService.revoke,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['student', 'parent-link-code'] });
		},
	});
}
