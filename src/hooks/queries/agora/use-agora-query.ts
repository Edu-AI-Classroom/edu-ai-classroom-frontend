import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AgoraService } from '@/services/agora/agora.service';
import { queryKeys } from '@/services/api/query-keys';
import type { CreateAgoraSessionDto } from '@/types/agora';

export function useAgoraSessions(classId: number) {
	return useQuery({
		queryKey: queryKeys.agora.sessions(classId),
		queryFn: () => AgoraService.listSessions(classId),
		refetchInterval: 5000,
	});
}

export function useAgoraSession(classId: number, sessionId?: string) {
	return useQuery({
		queryKey: queryKeys.agora.session(classId, sessionId),
		queryFn: () => AgoraService.getSession(classId, sessionId as string),
		enabled: !!sessionId,
		refetchInterval: 5000,
	});
}

export function useCreateAgoraSession(classId: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateAgoraSessionDto) => AgoraService.createSession(classId, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.agora.sessions(classId) });
			toast.success('Live session created.');
		},
		onError: (error: any) => toast.error(error?.message || 'Could not create live session.'),
	});
}

export function useEndAgoraSession(classId: number) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (sessionId: string) => AgoraService.endSession(classId, sessionId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.agora.sessions(classId) });
			toast.success('Live session ended.');
		},
		onError: (error: any) => toast.error(error?.message || 'Could not end live session.'),
	});
}

export function useUpdateAgoraParticipant(classId: number, sessionId?: string) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			participantId,
			speakerEnabled,
		}: {
			participantId: number;
			speakerEnabled: boolean;
		}) =>
			AgoraService.updateParticipant(classId, sessionId as string, participantId, speakerEnabled),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.agora.session(classId, sessionId) });
			queryClient.invalidateQueries({ queryKey: queryKeys.agora.sessions(classId) });
		},
		onError: (error: any) => toast.error(error?.message || 'Could not update participant.'),
	});
}

export function useActiveConversationCalls() {
	return useQuery({
		queryKey: ['agora', 'conversation-calls', 'active'],
		queryFn: () => AgoraService.listActiveConversationCalls(),
		refetchInterval: 3000,
	});
}

export function useConversationCall(callId?: string) {
	return useQuery({
		queryKey: ['agora', 'conversation-call', callId],
		queryFn: () => AgoraService.getConversationCall(callId as string),
		enabled: !!callId,
		refetchInterval: callId ? 2000 : false,
	});
}

export function useStartConversationCall() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (conversationId: number) => AgoraService.startConversationCall(conversationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-calls', 'active'] });
		},
		onError: (error: any) => toast.error(error?.message || 'Could not start video call.'),
	});
}

export function useAcceptConversationCall() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (callId: string) => AgoraService.acceptConversationCall(callId),
		onSuccess: (call) => {
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-calls', 'active'] });
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-call', call.callId] });
		},
		onError: (error: any) => toast.error(error?.message || 'Could not accept video call.'),
	});
}

export function useDeclineConversationCall() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (callId: string) => AgoraService.declineConversationCall(callId),
		onSuccess: (call) => {
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-calls', 'active'] });
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-call', call.callId] });
		},
		onError: (error: any) => toast.error(error?.message || 'Could not decline video call.'),
	});
}

export function useEndConversationCall() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (callId: string) => AgoraService.endConversationCall(callId),
		onSuccess: (call) => {
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-calls', 'active'] });
			queryClient.invalidateQueries({ queryKey: ['agora', 'conversation-call', call.callId] });
		},
		onError: (error: any) => toast.error(error?.message || 'Could not end video call.'),
	});
}
