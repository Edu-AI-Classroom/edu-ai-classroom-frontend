import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/api/query-keys';
import { AssignmentService } from '@/services/assignment/assignment.service';
import type { PaginationParams } from '@/types/api';
import type {
    CreateAssignmentPayload,
    UpdateAssignmentPayload,
} from '@/types/class';

// ==================== QUERIES ====================

/**
 * Fetch all assignments with optional pagination
 */
export function useAssignments(params?: PaginationParams) {
    return useQuery({
        queryKey: queryKeys.assignment.list(params),
        queryFn: () => AssignmentService.getAssignments(params),
    });
}

/**
 * Fetch assignments for a specific classroom
 */
export function useAssignmentsByClassroom(classId: number | null) {
    return useQuery({
        queryKey: ['assignments', 'classroom', classId],
        queryFn: () => AssignmentService.getAssignmentsByClassroom(classId!),
        enabled: classId !== null && classId !== undefined,
    });
}

/**
 * Fetch a single assignment by ID
 */
export function useAssignmentDetail(assignmentId: number | null) {
    return useQuery({
        queryKey: queryKeys.assignment.detail(assignmentId ?? ''),
        queryFn: () => AssignmentService.getAssignmentDetail(assignmentId!),
        enabled: assignmentId !== null && assignmentId !== undefined,
    });
}

// ==================== MUTATIONS ====================

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message?: string }).message ?? fallback);
    }
    return fallback;
};

/**
 * Create a new assignment
 */
export function useCreateAssignment(classId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateAssignmentPayload) =>
            AssignmentService.createAssignment(payload),
        onSuccess: () => {
            // Invalidate both general list and classroom-specific list
            queryClient.invalidateQueries({ queryKey: queryKeys.assignment.all });
            if (classId) {
                queryClient.invalidateQueries({
                    queryKey: ['assignments', 'classroom', classId],
                });
            }
        },
    });
}

/**
 * Update an existing assignment
 */
export function useUpdateAssignment(classId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            assignmentId,
            payload,
        }: {
            assignmentId: number;
            payload: UpdateAssignmentPayload;
        }) => AssignmentService.updateAssignment(assignmentId, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.assignment.detail(variables.assignmentId),
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.assignment.all });
            if (classId) {
                queryClient.invalidateQueries({
                    queryKey: ['assignments', 'classroom', classId],
                });
            }
        },
    });
}

/**
 * Delete an assignment
 */
export function useDeleteAssignment(classId?: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (assignmentId: number) =>
            AssignmentService.deleteAssignment(assignmentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.assignment.all });
            if (classId) {
                queryClient.invalidateQueries({
                    queryKey: ['assignments', 'classroom', classId],
                });
            }
        },
    });
}
