import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { queryKeys } from '@/services/api/query-keys';
import { ClassService } from '@/services/classroom/class.service';
import { useClassStore } from '@/stores/class-store';
import type {
	AddStudentPayload,
	AddTeacherPayload,
	AssignStudentToGroupPayload,
	CreateClassroomPayload,
	CreateStudentGroupPayload,
	UpdateClassroomPayload,
	UpdateStudentGroupPayload,
} from '@/types/class';

type ClassId = number;
type GroupId = number;
type UserId = number;

const getErrorMessage = (error: unknown, fallback: string) => {
	if (error && typeof error === 'object' && 'message' in error) {
		return String((error as { message?: string }).message ?? fallback);
	}
	return fallback;
};

type UpdateClassInput = {
	classId: ClassId;
	payload: UpdateClassroomPayload;
};

type DeleteClassInput = {
	classId: ClassId;
};

type AddTeacherInput = {
	classId: ClassId;
	payload: AddTeacherPayload;
};

type RemoveTeacherInput = {
	classId: ClassId;
	teacherId: UserId;
};

type AddStudentInput = {
	classId: ClassId;
	payload: AddStudentPayload;
};

type RemoveStudentInput = {
	classId: ClassId;
	studentId: UserId;
};

type CreateGroupInput = {
	classId: ClassId;
	payload: CreateStudentGroupPayload;
};

type UpdateGroupInput = {
	classId: ClassId;
	groupId: GroupId;
	payload: UpdateStudentGroupPayload;
};

type DeleteGroupInput = {
	classId: ClassId;
	groupId: GroupId;
};

type AssignStudentToGroupInput = {
	classId: ClassId;
	groupId: GroupId;
	payload: AssignStudentToGroupPayload;
};

type RemoveStudentFromGroupInput = {
	classId: ClassId;
	groupId: GroupId;
	studentId: UserId;
};

export const useClassMutations = () => {
	const queryClient = useQueryClient();
	const [classError, setClassError] = useState<string | null>(null);

	const selectedClassId = useClassStore((state) => state.selectedClassId);
	const selectedGroupId = useClassStore((state) => state.selectedGroupId);
	const resetClassContext = useClassStore((state) => state.resetClassContext);
	const setSelectedGroupId = useClassStore((state) => state.setSelectedGroupId);

	const invalidateClassList = () =>
		queryClient.invalidateQueries({ queryKey: queryKeys.class.all });

	const invalidateClassDetail = (classId: ClassId) =>
		queryClient.invalidateQueries({
			queryKey: queryKeys.class.detail(classId),
		});

	const invalidateStudents = (classId: ClassId) =>
		queryClient.invalidateQueries({
			queryKey: ['class', classId, 'students'],
		});

	const invalidateTeachers = (classId: ClassId) =>
		queryClient.invalidateQueries({
			queryKey: queryKeys.class.teachers.list(classId),
		});

	const invalidateGroups = (classId: ClassId) =>
		queryClient.invalidateQueries({
			queryKey: ['class', classId, 'groups'],
		});

	const createClassMutation = useMutation({
		mutationFn: (payload: CreateClassroomPayload) => ClassService.createClass(payload),
		onSuccess: async () => {
			setClassError(null);
			await invalidateClassList();
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Create class failed'));
		},
	});

	const updateClassMutation = useMutation({
		mutationFn: ({ classId, payload }: UpdateClassInput) =>
			ClassService.updateClassDetail(classId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([invalidateClassList(), invalidateClassDetail(variables.classId)]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Update class failed'));
		},
	});

	const deleteClassMutation = useMutation({
		mutationFn: ({ classId }: DeleteClassInput) => ClassService.deleteClass(classId),
		onSuccess: (_data, variables) => {
			setClassError(null);
			void invalidateClassList();
			queryClient.removeQueries({
				queryKey: queryKeys.class.detail(variables.classId),
			});

			if (selectedClassId !== null && selectedClassId === variables.classId) {
				resetClassContext();
			}
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Delete class failed'));
		},
	});

	const addTeacherToClassMutation = useMutation({
		mutationFn: ({ classId, payload }: AddTeacherInput) =>
			ClassService.addTeacherToClass(classId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateTeachers(variables.classId),
				invalidateClassDetail(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Add teacher failed'));
		},
	});

	const removeTeacherFromClassMutation = useMutation({
		mutationFn: ({ classId, teacherId }: RemoveTeacherInput) =>
			ClassService.removeTeacherFromClass(classId, teacherId),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateTeachers(variables.classId),
				invalidateClassDetail(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Remove teacher failed'));
		},
	});

	const addStudentToClassMutation = useMutation({
		mutationFn: ({ classId, payload }: AddStudentInput) =>
			ClassService.addStudentToClass(classId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateStudents(variables.classId),
				invalidateClassDetail(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Add student failed'));
		},
	});

	const removeStudentFromClassMutation = useMutation({
		mutationFn: ({ classId, studentId }: RemoveStudentInput) =>
			ClassService.removeStudentFromClass(classId, studentId),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateStudents(variables.classId),
				invalidateClassDetail(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Remove student failed'));
		},
	});

	const createGroupMutation = useMutation({
		mutationFn: ({ classId, payload }: CreateGroupInput) =>
			ClassService.createStudentGroup(classId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateGroups(variables.classId),
				invalidateClassDetail(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Create group failed'));
		},
	});

	const updateGroupMutation = useMutation({
		mutationFn: ({ classId, groupId, payload }: UpdateGroupInput) =>
			ClassService.updateStudentGroupDetail(classId, groupId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateGroups(variables.classId),
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.detail(variables.classId, variables.groupId),
				}),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Update group failed'));
		},
	});

	const deleteGroupMutation = useMutation({
		mutationFn: ({ classId, groupId }: DeleteGroupInput) =>
			ClassService.deleteStudentGroup(classId, groupId),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				invalidateGroups(variables.classId),
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.detail(variables.classId, variables.groupId),
				}),
			]);

			if (selectedGroupId !== null && selectedGroupId === variables.groupId) {
				setSelectedGroupId(null);
			}
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Delete group failed'));
		},
	});

	const assignStudentToGroupMutation = useMutation({
		mutationFn: ({ classId, groupId, payload }: AssignStudentToGroupInput) =>
			ClassService.assignStudentToGroup(classId, groupId, payload),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.students.list(variables.classId, variables.groupId),
				}),
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.detail(variables.classId, variables.groupId),
				}),
				invalidateStudents(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Assign student to group failed'));
		},
	});

	const removeStudentFromGroupMutation = useMutation({
		mutationFn: ({ classId, groupId, studentId }: RemoveStudentFromGroupInput) =>
			ClassService.removeStudentFromGroup(classId, groupId, studentId),
		onSuccess: async (_data, variables) => {
			setClassError(null);
			await Promise.all([
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.students.list(variables.classId, variables.groupId),
				}),
				queryClient.invalidateQueries({
					queryKey: queryKeys.class.groups.detail(variables.classId, variables.groupId),
				}),
				invalidateStudents(variables.classId),
			]);
		},
		onError: (error: unknown) => {
			setClassError(getErrorMessage(error, 'Remove student from group failed'));
		},
	});

	const clearClassError = useCallback(() => setClassError(null), []);

	return {
		classError,
		clearClassError,

		createClassMutation,
		updateClassMutation,
		deleteClassMutation,

		addTeacherToClassMutation,
		removeTeacherFromClassMutation,
		addStudentToClassMutation,
		removeStudentFromClassMutation,

		createGroupMutation,
		updateGroupMutation,
		deleteGroupMutation,
		assignStudentToGroupMutation,
		removeStudentFromGroupMutation,
	};
};
