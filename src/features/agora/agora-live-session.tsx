'use client';

import {
	Mic,
	MicOff,
	PhoneOff,
	Radio,
	ScreenShare,
	UserRound,
	Video,
	VideoOff,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	useAgoraSession,
	useAgoraSessions,
	useCreateAgoraSession,
	useEndAgoraSession,
	useUpdateAgoraParticipant,
} from '@/hooks/queries/agora/use-agora-query';
import { useAuthUser } from '@/hooks/queries/auth/use-auth-mutation';
import { cn } from '@/lib/utils/utils';
import { AgoraService } from '@/services/agora/agora.service';
import type { AgoraSession } from '@/types/agora';

type AgoraLiveSessionProps = {
	classId: number;
	className?: string;
	isTeacher?: boolean;
};

type RemoteUser = {
	uid: string | number;
	hasVideo: boolean;
};

type AgoraClient = any;
type AgoraTrack = any;

const AGORA_CDN_SRC = 'https://download.agora.io/sdk/release/AgoraRTC_N.js';

export function AgoraLiveSession({ classId, className, isTeacher }: AgoraLiveSessionProps) {
	const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
	const authUser = useAuthUser();
	const { data: sessions = [] } = useAgoraSessions(classId);
	const createSession = useCreateAgoraSession(classId);
	const endSession = useEndAgoraSession(classId);
	const [title, setTitle] = useState('');
	const [selectedSessionId, setSelectedSessionId] = useState<string | undefined>();
	const activeSession = useMemo(
		() => sessions.find((session) => session.status === 'ACTIVE') ?? sessions[0],
		[sessions],
	);
	const sessionId = selectedSessionId ?? activeSession?.sessionId;
	const { data: selectedSession } = useAgoraSession(classId, sessionId);
	const updateParticipant = useUpdateAgoraParticipant(classId, sessionId);

	const clientRef = useRef<AgoraClient | null>(null);
	const localTracksRef = useRef<AgoraTrack[]>([]);
	const remoteVideoTracksRef = useRef(new Map<string | number, AgoraTrack>());
	const localVideoRef = useRef<HTMLDivElement | null>(null);
	const [joined, setJoined] = useState(false);
	const [joining, setJoining] = useState(false);
	const [micEnabled, setMicEnabled] = useState(true);
	const [cameraEnabled, setCameraEnabled] = useState(true);
	const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

	useEffect(() => {
		if (!selectedSessionId && activeSession?.sessionId) {
			setSelectedSessionId(activeSession.sessionId);
		}
	}, [activeSession?.sessionId, selectedSessionId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: cleanup should only run when this call component unmounts.
	useEffect(() => {
		return () => {
			void leaveCall(false);
		};
	}, []);

	useEffect(() => {
		for (const user of remoteUsers) {
			if (!user.hasVideo) continue;
			const track = remoteVideoTracksRef.current.get(user.uid);
			const videoElement = document.getElementById(getRemoteVideoId(user.uid));
			if (track && videoElement) {
				track.play(videoElement);
			}
		}
	}, [remoteUsers]);

	const session = selectedSession ?? activeSession;
	const currentUserId = Number(authUser?.userId ?? 0);
	const currentParticipant = session?.participants.find(
		(participant) => participant.userId === currentUserId,
	);
	const canPublish = !!isTeacher || !!currentParticipant?.speakerEnabled;

	const createLiveSession = async () => {
		const created = await createSession.mutateAsync({
			title: title.trim() || `${className ?? 'Class'} live session`,
		});
		setSelectedSessionId(created.sessionId);
		setTitle('');
	};

	const joinCall = async () => {
		if (!appId) {
			toast.error('Missing NEXT_PUBLIC_AGORA_APP_ID in frontend .env');
			return;
		}
		if (!session) {
			toast.error('No active live session to join.');
			return;
		}

		setJoining(true);
		try {
			await loadAgoraSdk();
			const AgoraRTC = (window as any).AgoraRTC;
			const token = await AgoraService.issueToken(classId, session.sessionId, !!canPublish);
			await AgoraService.joinSession(classId, session.sessionId);

			const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
			clientRef.current = client;

			client.on('user-published', async (user: any, mediaType: 'audio' | 'video') => {
				await client.subscribe(user, mediaType);
				if (mediaType === 'video') {
					remoteVideoTracksRef.current.set(user.uid, user.videoTrack);
					setRemoteUsers((current) => upsertRemoteUser(current, user.uid, true));
				}
				if (mediaType === 'audio') {
					setRemoteUsers((current) => upsertRemoteUser(current, user.uid, false));
					user.audioTrack?.play();
				}
			});

			client.on('user-unpublished', (user: any, mediaType: 'audio' | 'video') => {
				if (mediaType === 'video') {
					remoteVideoTracksRef.current.get(user.uid)?.stop?.();
					remoteVideoTracksRef.current.delete(user.uid);
					setRemoteUsers((current) =>
						current.map((item) => (item.uid === user.uid ? { ...item, hasVideo: false } : item)),
					);
				}
			});

			client.on('user-left', (user: any) => {
				remoteVideoTracksRef.current.get(user.uid)?.stop?.();
				remoteVideoTracksRef.current.delete(user.uid);
				setRemoteUsers((current) => current.filter((item) => item.uid !== user.uid));
			});

			await client.join(token.appId || appId, token.channelName, token.rtcToken, token.uid);

			if (token.role === 'PUBLISHER') {
				const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
				localTracksRef.current = tracks;
				if (localVideoRef.current) {
					tracks[1].play(localVideoRef.current);
				}
				await client.publish(tracks);
			}

			setJoined(true);
			setMicEnabled(true);
			setCameraEnabled(true);
		} catch (error: any) {
			toast.error(error?.message || 'Could not join Agora session.');
			await leaveCall(false);
		} finally {
			setJoining(false);
		}
	};

	const leaveCall = async (notify = true) => {
		try {
			for (const track of localTracksRef.current) {
				track.stop?.();
				track.close?.();
			}
			localTracksRef.current = [];
			for (const track of remoteVideoTracksRef.current.values()) {
				track.stop?.();
			}
			remoteVideoTracksRef.current.clear();
			await clientRef.current?.leave?.();
			clientRef.current = null;
			setRemoteUsers([]);
			setJoined(false);
			if (notify && session) {
				await AgoraService.leaveSession(classId, session.sessionId);
			}
		} catch {
			if (notify) toast.error('Could not leave the live session cleanly.');
		}
	};

	const toggleMic = async () => {
		const audioTrack = localTracksRef.current[0];
		if (!audioTrack) return;
		await audioTrack.setEnabled(!micEnabled);
		setMicEnabled((value) => !value);
	};

	const toggleCamera = async () => {
		const videoTrack = localTracksRef.current[1];
		if (!videoTrack) return;
		await videoTrack.setEnabled(!cameraEnabled);
		setCameraEnabled((value) => !value);
	};

	const endLiveSession = async () => {
		if (!session) return;
		await leaveCall(false);
		await endSession.mutateAsync(session.sessionId);
	};

	return (
		<div className="space-y-5">
			<div className="rounded-2xl border border-[#E0DCD5] bg-white p-5 shadow-sm">
				<div className="grid gap-4 xl:grid-cols-[minmax(220px,0.6fr)_minmax(0,1.4fr)] xl:items-center">
					<div className="min-w-0">
						<h2 className="flex items-center gap-2 font-sans text-xl font-bold text-[#333]">
							<Radio className="h-5 w-5 text-[#F5B041]" />
							Live classroom
						</h2>
						<p className="mt-1 text-sm text-[#666]">
							Start or join an Agora video session for this class.
						</p>
					</div>
					{isTeacher && (
						<div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
							<Input
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								placeholder="Session title"
								className="rounded-xl sm:w-64"
							/>
							<Button
								type="button"
								onClick={createLiveSession}
								disabled={createSession.isPending}
								className="rounded-xl bg-[#F5B041] px-5 text-[#333] hover:bg-[#e5a23c]"
							>
								Start live
							</Button>
						</div>
					)}
				</div>

				<div className="mt-4 grid gap-3 md:grid-cols-2">
					{sessions.map((item) => (
						<button
							key={item.sessionId}
							type="button"
							onClick={() => setSelectedSessionId(item.sessionId)}
							className={cn(
								'rounded-xl border p-4 text-left transition',
								item.sessionId === session?.sessionId
									? 'border-[#F5B041] bg-[#FFF8E1]'
									: 'border-[#E0DCD5] bg-[#FAF9F6] hover:border-[#F5B041]/60',
							)}
						>
							<div className="flex items-start justify-between gap-3">
								<div>
									<p className="font-semibold text-[#333]">
										{item.title || 'Untitled live session'}
									</p>
									<p className="mt-1 text-xs text-[#666]">Host: {item.createdByUserName}</p>
								</div>
								<span
									className={cn(
										'rounded-full px-2.5 py-1 text-xs font-semibold',
										item.status === 'ACTIVE'
											? 'bg-[#E8F5E9] text-[#2E7D32]'
											: 'bg-[#F0EDE8] text-[#666]',
									)}
								>
									{item.status}
								</span>
							</div>
							<p className="mt-3 text-xs text-[#999]">
								{item.participantCount} online · {item.attendanceCount} joined
							</p>
						</button>
					))}
					{sessions.length === 0 && (
						<div className="rounded-xl border border-dashed border-[#E0DCD5] bg-[#FAF9F6] p-6 text-sm text-[#666] md:col-span-2">
							No live session yet.
						</div>
					)}
				</div>
			</div>

			<div className="grid min-w-0 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0 rounded-2xl border border-[#E0DCD5] bg-[#1F1F1F] p-4 shadow-sm">
					<div className="grid min-h-[520px] gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
						<div className="relative overflow-hidden rounded-xl bg-[#333]">
							<div ref={localVideoRef} className="h-full min-h-[320px] w-full" />
							<div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
								You {canPublish ? '' : '(listener)'}
							</div>
							{(!joined || !canPublish) && (
								<div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
									<UserRound className="h-10 w-10" />
									<p className="mt-2 text-sm">Camera preview unavailable</p>
								</div>
							)}
						</div>

						<div className="grid min-w-0 gap-4">
							{remoteUsers.map((user) => (
								<div
									key={user.uid}
									className="relative min-h-[250px] overflow-hidden rounded-xl bg-[#333]"
								>
									<div id={getRemoteVideoId(user.uid)} className="h-full min-h-[250px] w-full" />
									<div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
										User {String(user.uid)}
									</div>
									{!user.hasVideo && (
										<div className="absolute inset-0 flex items-center justify-center text-white/70">
											<UserRound className="h-9 w-9" />
										</div>
									)}
								</div>
							))}
							{remoteUsers.length === 0 && (
								<div className="flex min-h-[320px] items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-center text-sm text-white/70">
									No remote participants yet.
								</div>
							)}
						</div>
					</div>

					<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
						<Button
							type="button"
							onClick={joined ? () => leaveCall(true) : joinCall}
							disabled={!session || joining}
							className={cn(
								'rounded-xl',
								joined
									? 'bg-[#E57373] text-white hover:bg-[#d45f5f]'
									: 'bg-[#A8D5BA] text-[#333] hover:bg-[#94c6a7]',
							)}
						>
							{joined ? <PhoneOff className="mr-2 h-4 w-4" /> : <Video className="mr-2 h-4 w-4" />}
							{joined ? 'Leave' : joining ? 'Joining...' : 'Join live'}
						</Button>
						<Button
							type="button"
							variant="outline"
							className="rounded-xl"
							disabled={!joined || !canPublish}
							onClick={toggleMic}
						>
							{micEnabled ? <Mic className="mr-2 h-4 w-4" /> : <MicOff className="mr-2 h-4 w-4" />}
							Mic
						</Button>
						<Button
							type="button"
							variant="outline"
							className="rounded-xl"
							disabled={!joined || !canPublish}
							onClick={toggleCamera}
						>
							{cameraEnabled ? (
								<Video className="mr-2 h-4 w-4" />
							) : (
								<VideoOff className="mr-2 h-4 w-4" />
							)}
							Camera
						</Button>
						{isTeacher && session?.status === 'ACTIVE' && (
							<Button
								type="button"
								variant="outline"
								className="rounded-xl"
								onClick={endLiveSession}
							>
								<PhoneOff className="mr-2 h-4 w-4" />
								End session
							</Button>
						)}
					</div>
				</div>

				<ParticipantsPanel
					session={session}
					isTeacher={!!isTeacher}
					onToggleSpeaker={(participantId, speakerEnabled) =>
						updateParticipant.mutate({ participantId, speakerEnabled })
					}
				/>
			</div>
		</div>
	);
}

function ParticipantsPanel({
	session,
	isTeacher,
	onToggleSpeaker,
}: {
	session?: AgoraSession;
	isTeacher: boolean;
	onToggleSpeaker: (participantId: number, speakerEnabled: boolean) => void;
}) {
	return (
		<div className="rounded-2xl border border-[#E0DCD5] bg-white p-4 shadow-sm">
			<h3 className="font-sans text-lg font-bold text-[#333]">Participants</h3>
			<p className="mt-1 text-sm text-[#666]">{session?.participantCount ?? 0} online now</p>

			<div className="mt-4 space-y-3">
				{session?.participants.map((participant) => (
					<div
						key={participant.userId}
						className="rounded-xl border border-[#E0DCD5] bg-[#FAF9F6] p-3"
					>
						<div className="flex items-start justify-between gap-3">
							<div>
								<p className="font-medium text-[#333]">{participant.userName}</p>
								<p className="text-xs text-[#999]">{participant.role}</p>
							</div>
							<span
								className={cn(
									'rounded-full px-2 py-1 text-xs font-semibold',
									participant.leftAt == null && participant.joinedAt
										? 'bg-[#E8F5E9] text-[#2E7D32]'
										: 'bg-[#F0EDE8] text-[#666]',
								)}
							>
								{participant.leftAt == null && participant.joinedAt ? 'Online' : 'Offline'}
							</span>
						</div>
						<div className="mt-3 flex items-center justify-between gap-2">
							<span className="text-xs text-[#666]">
								{participant.speakerEnabled ? 'Can speak' : 'Listener'}
							</span>
							{isTeacher && participant.role !== 'TEACHER' && (
								<Button
									type="button"
									size="sm"
									variant="outline"
									className="rounded-xl"
									onClick={() => onToggleSpeaker(participant.userId, !participant.speakerEnabled)}
								>
									<ScreenShare className="mr-1 h-3.5 w-3.5" />
									{participant.speakerEnabled ? 'Demote' : 'Promote'}
								</Button>
							)}
						</div>
					</div>
				))}
				{(!session || session.participants.length === 0) && (
					<div className="rounded-xl border border-dashed border-[#E0DCD5] p-6 text-sm text-[#666]">
						Participants will appear after joining.
					</div>
				)}
			</div>
		</div>
	);
}

function upsertRemoteUser(users: RemoteUser[], uid: string | number, hasVideo: boolean) {
	const existing = users.find((user) => user.uid === uid);
	if (existing) {
		return users.map((user) =>
			user.uid === uid ? { ...user, hasVideo: user.hasVideo || hasVideo } : user,
		);
	}
	return [...users, { uid, hasVideo }];
}

function getRemoteVideoId(uid: string | number) {
	return `agora-remote-${String(uid).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function loadAgoraSdk() {
	if ((window as any).AgoraRTC) return Promise.resolve();

	return new Promise<void>((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>('script[data-agora-sdk="true"]');
		if (existing) {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error('Could not load Agora SDK.')), {
				once: true,
			});
			return;
		}

		const script = document.createElement('script');
		script.src = AGORA_CDN_SRC;
		script.async = true;
		script.dataset.agoraSdk = 'true';
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Could not load Agora SDK.'));
		document.head.appendChild(script);
	});
}
