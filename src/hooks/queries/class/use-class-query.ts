import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/services/api/query-keys';
import { ClassService } from '@/services/classroom/class.service';
import { useClassStore } from '@/stores/class-store';
import type { PaginationParams } from '@/types/api';

type ClassId = number;
type GroupId = number;

export function useSelectedClassId() {
	return useClassStore((state) => state.selectedClassId);
}

export function useSelectedGroupId() {
	return useClassStore((state) => state.selectedGroupId);
}

export function useClassListParams() {
	return useClassStore((state) => state.classListParams);
}

export function useStudentListParams() {
	return useClassStore((state) => state.studentListParams);
}

export function useGroupListParams() {
	return useClassStore((state) => state.groupListParams);
}

export function useClassList(params?: PaginationParams) {
	const storeParams = useClassListParams();
	const mergedParams = { ...storeParams, ...params };

	return useQuery({
		queryKey: queryKeys.class.list(mergedParams),
		queryFn: () => ClassService.getClassList(mergedParams),
	});
}

export function useClassDetail(classId: ClassId) {
	return useQuery({
		queryKey: queryKeys.class.detail(classId),
		queryFn: () => ClassService.getClassDetail(classId),
		enabled: classId !== null && classId !== undefined,
	});
}

export function useClassStudents(classId: ClassId, params?: PaginationParams) {
	const storeParams = useStudentListParams();
	const mergedParams = { ...storeParams, ...params };

	return useQuery({
		queryKey: queryKeys.class.students.list(classId, mergedParams),
		queryFn: () => ClassService.getStudents(classId as number, mergedParams),
		enabled: classId !== null && classId !== undefined,
	});
}

export function useClassTeachers(classId: ClassId, params?: PaginationParams) {
	return useQuery({
		queryKey: queryKeys.class.teachers.list(classId),
		queryFn: () => ClassService.getTeachers(classId as number, params),
		enabled: classId !== null && classId !== undefined,
	});
}

export function useClassGroups(classId: ClassId, params?: PaginationParams) {
	const storeParams = useGroupListParams();
	const mergedParams = { ...storeParams, ...params };

	return useQuery({
		queryKey: queryKeys.class.groups.list(classId, mergedParams),
		queryFn: () => ClassService.getStudentGroupList(classId, mergedParams),
		enabled: classId !== null && classId !== undefined,
	});
}

export function useClassGroupDetail(classId: ClassId, groupId: GroupId) {
	return useQuery({
		queryKey: queryKeys.class.groups.detail(classId, groupId),
		queryFn: () => ClassService.getStudentGroupDetail(classId, groupId),
		enabled: classId !== null && classId !== undefined && groupId !== null && groupId !== undefined,
	});
}
