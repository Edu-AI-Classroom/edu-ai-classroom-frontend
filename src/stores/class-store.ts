import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { PaginationParams } from '@/types/api';

type ClassId = string | number;
type GroupId = string | number;

interface ClassStoreState {
	selectedClassId: ClassId | null;
	selectedGroupId: GroupId | null;

	classListParams: PaginationParams;
	studentListParams: PaginationParams;
	groupListParams: PaginationParams;

	hasHydrated: boolean;

	setSelectedClassId: (classId: ClassId | null) => void;
	setSelectedGroupId: (groupId: GroupId | null) => void;

	setClassListParams: (params: Partial<PaginationParams>) => void;
	setStudentListParams: (params: Partial<PaginationParams>) => void;
	setGroupListParams: (params: Partial<PaginationParams>) => void;

	resetClassListParams: () => void;
	resetStudentListParams: () => void;
	resetGroupListParams: () => void;

	resetClassContext: () => void;
	setHasHydrated: (value: boolean) => void;
}

const defaultPaginationParams: PaginationParams = {
	page: 1,
	limit: 10,
};

export const useClassStore = create<ClassStoreState>()(
	persist(
		(set) => ({
			selectedClassId: null,
			selectedGroupId: null,

			classListParams: defaultPaginationParams,
			studentListParams: defaultPaginationParams,
			groupListParams: defaultPaginationParams,

			hasHydrated: false,

			setSelectedClassId: (classId) =>
				set({
					selectedClassId: classId,
					selectedGroupId: null,
				}),

			setSelectedGroupId: (groupId) => set({ selectedGroupId: groupId }),

			setClassListParams: (params) =>
				set((state) => ({
					classListParams: {
						...state.classListParams,
						...params,
					},
				})),

			setStudentListParams: (params) =>
				set((state) => ({
					studentListParams: {
						...state.studentListParams,
						...params,
					},
				})),

			setGroupListParams: (params) =>
				set((state) => ({
					groupListParams: {
						...state.groupListParams,
						...params,
					},
				})),

			resetClassListParams: () => set({ classListParams: defaultPaginationParams }),

			resetStudentListParams: () => set({ studentListParams: defaultPaginationParams }),

			resetGroupListParams: () => set({ groupListParams: defaultPaginationParams }),

			resetClassContext: () =>
				set({
					selectedClassId: null,
					selectedGroupId: null,
					studentListParams: defaultPaginationParams,
					groupListParams: defaultPaginationParams,
				}),

			setHasHydrated: (value) => set({ hasHydrated: value }),
		}),
		{
			name: 'class-store',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				selectedClassId: state.selectedClassId,
				selectedGroupId: state.selectedGroupId,
				classListParams: state.classListParams,
				studentListParams: state.studentListParams,
				groupListParams: state.groupListParams,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);
