'use client';

import { PhoneCall, PhoneOff, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { AgoraPrivateCall } from '@/features/agora/agora-private-call';
import {
	useAcceptConversationCall,
	useActiveConversationCalls,
	useDeclineConversationCall,
	useEndConversationCall,
} from '@/hooks/queries/agora/use-agora-query';
import type { AgoraConversationCall } from '@/types/agora';

export function ConversationCallCenter() {
	const [videoCallOpen, setVideoCallOpen] = useState(false);
	const [videoCallMinimized, setVideoCallMinimized] = useState(false);
	const [activeCall, setActiveCall] = useState<AgoraConversationCall | null>(null);
	const [incomingCall, setIncomingCall] = useState<AgoraConversationCall | null>(null);
	const { data: activeCalls = [] } = useActiveConversationCalls();
	const acceptCallMutation = useAcceptConversationCall();
	const declineCallMutation = useDeclineConversationCall();
	const endCallMutation = useEndConversationCall();

	useEffect(() => {
		const incoming = activeCalls.find((call) => call.incoming && call.status === 'RINGING') ?? null;
		setIncomingCall((current) => {
			if (!current) return incoming;
			const stillRinging = activeCalls.some(
				(call) => call.callId === current.callId && call.status === 'RINGING',
			);
			return stillRinging ? current : incoming;
		});

		if (activeCall) {
			const updated = activeCalls.find((call) => call.callId === activeCall.callId);
			if (updated) {
				setActiveCall(updated);
				if (updated.status === 'ACTIVE' || updated.status === 'RINGING') {
					setVideoCallOpen(true);
				}
				if (updated.status === 'DECLINED' || updated.status === 'ENDED') {
					setVideoCallOpen(false);
					setVideoCallMinimized(false);
				}
				return;
			}
			setVideoCallOpen(false);
			setVideoCallMinimized(false);
			setActiveCall(null);
			return;
		}

		const outgoingOrActive = activeCalls.find(
			(call) => !call.incoming && (call.status === 'RINGING' || call.status === 'ACTIVE'),
		);
		if (outgoingOrActive) {
			setActiveCall(outgoingOrActive);
			setVideoCallOpen(true);
			setVideoCallMinimized(false);
		}
	}, [activeCalls, activeCall]);

	const acceptIncomingCall = async () => {
		if (!incomingCall) return;
		const call = await acceptCallMutation.mutateAsync(incomingCall.callId);
		setIncomingCall(null);
		setActiveCall(call);
		setVideoCallOpen(true);
		setVideoCallMinimized(false);
	};

	const declineIncomingCall = async () => {
		if (!incomingCall) return;
		await declineCallMutation.mutateAsync(incomingCall.callId);
		setIncomingCall(null);
	};

	const closeVideoCall = async () => {
		const callToEnd = activeCall;
		setVideoCallOpen(false);
		setVideoCallMinimized(false);
		setActiveCall(null);
		if (callToEnd && (callToEnd.status === 'RINGING' || callToEnd.status === 'ACTIVE')) {
			await endCallMutation.mutateAsync(callToEnd.callId);
		}
	};

	return (
		<>
			<Dialog open={!!incomingCall} onOpenChange={(open) => !open && setIncomingCall(null)}>
				<DialogContent className="max-w-md rounded-3xl border-[#E0DCD5] bg-white p-0">
					<div className="p-6 text-center">
						<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F5B041]/20">
							<PhoneCall className="h-7 w-7 text-[#333]" />
						</div>
						<DialogTitle className="mt-4 text-xl">Incoming video call</DialogTitle>
						<DialogDescription className="mt-2">
							{incomingCall?.callerName} is calling about {incomingCall?.className ?? 'this class'}.
						</DialogDescription>
						<div className="mt-6 flex justify-center gap-3">
							<Button
								type="button"
								variant="outline"
								className="rounded-full border-[#E57373] text-[#B94A48] hover:bg-[#FDECEC]"
								onClick={() => void declineIncomingCall()}
								disabled={declineCallMutation.isPending}
							>
								<PhoneOff className="mr-2 h-4 w-4" />
								Decline
							</Button>
							<Button
								type="button"
								className="rounded-full bg-[#A8D5BA] text-[#333] hover:bg-[#94c6a7]"
								onClick={() => void acceptIncomingCall()}
								disabled={acceptCallMutation.isPending}
							>
								<PhoneCall className="mr-2 h-4 w-4" />
								Accept
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{activeCall && videoCallOpen && (
				<div
					className={
						videoCallMinimized
							? 'fixed right-5 bottom-5 z-50 w-[360px] overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)]'
							: 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
					}
				>
					<div
						className={
							videoCallMinimized
								? 'h-[260px] w-full'
								: 'flex h-[96vh] w-[98vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl border border-[#E0DCD5] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.25)]'
						}
					>
						{!videoCallMinimized && (
							<div className="flex items-start justify-between gap-4 border-b border-[#E0DCD5] px-6 py-5">
								<div>
									<h2 className="font-sans text-xl font-bold text-[#333]">Video call</h2>
									<p className="mt-1 text-sm text-[#666]">
										{activeCall.className ?? 'Class'} - {activeCall.studentName ?? 'Student'}
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="h-9 w-9 rounded-full border-[#E0DCD5] bg-white text-[#333] shadow-sm hover:border-[#E57373] hover:bg-[#FDECEC] hover:text-[#B94A48]"
									aria-label="End video call"
									title="End video call"
									onClick={() => void closeVideoCall()}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}
						<div
							className={videoCallMinimized ? 'h-full' : 'min-h-0 flex-1 overflow-hidden px-6 py-5'}
						>
							<AgoraPrivateCall
								call={activeCall}
								isMinimized={videoCallMinimized}
								onMinimize={() => setVideoCallMinimized(true)}
								onRestore={() => setVideoCallMinimized(false)}
								onClose={() => {
									setVideoCallOpen(false);
									setVideoCallMinimized(false);
									setActiveCall(null);
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
