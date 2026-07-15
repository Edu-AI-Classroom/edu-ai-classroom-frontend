'use client';

import {
	Maximize2,
	Mic,
	MicOff,
	Minimize2,
	PhoneOff,
	UserRound,
	Video,
	VideoOff,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useConversationCall, useEndConversationCall } from '@/hooks/queries/agora/use-agora-query';
import { cn } from '@/lib/utils/utils';
import { AgoraService } from '@/services/agora/agora.service';
import type { AgoraConversationCall } from '@/types/agora';

type AgoraPrivateCallProps = {
	call: AgoraConversationCall;
	isMinimized?: boolean;
	onMinimize?: () => void;
	onRestore?: () => void;
	onClose: () => void;
};

type AgoraClient = any;
type AgoraTrack = any;
type RemoteUser = { uid: string | number; hasVideo: boolean };

const AGORA_CDN_SRC = 'https://download.agora.io/sdk/release/AgoraRTC_N.js';

export function AgoraPrivateCall({
	call,
	isMinimized = false,
	onMinimize,
	onRestore,
	onClose,
}: AgoraPrivateCallProps) {
	const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
	const { data: latestCall = call } = useConversationCall(call.callId);
	const endCall = useEndConversationCall();
	const clientRef = useRef<AgoraClient | null>(null);
	const joinStartedRef = useRef(false);
	const localTracksRef = useRef<AgoraTrack[]>([]);
	const remoteVideoTracksRef = useRef(new Map<string | number, AgoraTrack>());
	const localVideoRef = useRef<HTMLDivElement | null>(null);
	const [joined, setJoined] = useState(false);
	const [joining, setJoining] = useState(false);
	const [micEnabled, setMicEnabled] = useState(true);
	const [cameraEnabled, setCameraEnabled] = useState(true);
	const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: cleanup should only run when this call component unmounts.
	useEffect(() => {
		return () => {
			void leaveAgoraOnly();
		};
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: join/leave are guarded by refs; adding callbacks here can re-enter Agora joins.
	useEffect(() => {
		if (latestCall.status === 'ACTIVE' && !joined && !joining) {
			void joinAgora();
		}
		if (latestCall.status === 'DECLINED' || latestCall.status === 'ENDED') {
			void leaveAgoraOnly();
		}
	}, [latestCall.status, joined, joining]);

	useEffect(() => {
		for (const user of remoteUsers) {
			if (!user.hasVideo) continue;
			const track = remoteVideoTracksRef.current.get(user.uid);
			const videoElement = document.getElementById(getPrivateRemoteVideoId(user.uid));
			if (track && videoElement) {
				track.play(videoElement);
			}
		}
	}, [remoteUsers]);

	const otherName = latestCall.incoming ? latestCall.callerName : latestCall.recipientName;

	const joinAgora = async () => {
		if (joinStartedRef.current || clientRef.current) return;
		if (!appId) {
			toast.error('Missing NEXT_PUBLIC_AGORA_APP_ID in frontend .env');
			return;
		}
		if (latestCall.status !== 'ACTIVE') return;

		joinStartedRef.current = true;
		setJoining(true);
		try {
			await loadAgoraSdk();
			const AgoraRTC = (window as any).AgoraRTC;
			const token = await AgoraService.issueConversationCallToken(latestCall.callId);
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
			const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
			localTracksRef.current = tracks;
			if (localVideoRef.current) {
				tracks[1].play(localVideoRef.current);
			}
			await client.publish(tracks);
			setJoined(true);
			setMicEnabled(true);
			setCameraEnabled(true);
		} catch (error: any) {
			const message = String(error?.message ?? '');
			toast.error(
				message.includes('UID_CONFLICT')
					? 'This account is already in this call from another tab or an old session. Leave that call, then try again.'
					: error?.message || 'Could not join video call.',
			);
			await leaveAgoraOnly();
		} finally {
			setJoining(false);
		}
	};

	const leaveAgoraOnly = async () => {
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
		joinStartedRef.current = false;
		setRemoteUsers([]);
		setJoined(false);
	};

	const endAndClose = async () => {
		await leaveAgoraOnly();
		if (latestCall.status === 'RINGING' || latestCall.status === 'ACTIVE') {
			await endCall.mutateAsync(latestCall.callId);
		}
		onClose();
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

	if (latestCall.status === 'RINGING') {
		return (
			<div
				className={cn(
					'flex flex-col items-center justify-center bg-[#FAF9F6] text-center',
					isMinimized ? 'h-full p-4' : 'min-h-[460px] rounded-3xl p-8',
				)}
			>
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F5B041]/20 text-[#333] shadow-inner">
					<Video className="h-10 w-10" />
				</div>
				<h3 className="mt-4 font-sans text-xl font-bold text-[#333]">Calling {otherName}</h3>
				{!isMinimized && (
					<p className="mt-2 max-w-sm text-sm text-[#666]">
						Waiting for them to accept the video call.
					</p>
				)}
				<div className="mt-6 flex items-center justify-center gap-2">
					<CallControlButton
						label={isMinimized ? 'Restore' : 'Minimize'}
						onClick={isMinimized ? onRestore : onMinimize}
					>
						{isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
					</CallControlButton>
					<CallControlButton label="Cancel call" danger onClick={() => void endAndClose()}>
						<PhoneOff className="h-4 w-4" />
					</CallControlButton>
				</div>
			</div>
		);
	}

	return (
		<div className={cn('relative flex h-full min-h-0 flex-col', isMinimized ? 'gap-0' : 'gap-4')}>
			<div
				className={cn(
					'grid min-h-0 flex-1 gap-4 bg-[#1F1F1F]',
					isMinimized ? 'h-full grid-cols-1 rounded-none p-2' : 'rounded-3xl p-4 lg:grid-cols-2',
				)}
			>
				<div
					className={cn(
						'relative min-h-0 overflow-hidden rounded-2xl bg-[#333]',
						isMinimized ? 'min-h-[244px]' : 'h-full',
					)}
				>
					<div
						ref={localVideoRef}
						className={cn(
							'h-full w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover',
							isMinimized ? 'min-h-[244px]' : 'min-h-[560px]',
						)}
					/>
					<div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
						You
					</div>
					{!joined && (
						<div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
							<UserRound className="h-10 w-10" />
							<p className="mt-2 text-sm">
								{joining ? 'Joining...' : 'Camera preview unavailable'}
							</p>
						</div>
					)}
				</div>

				<div className={cn('grid min-h-0 gap-4', isMinimized && 'hidden')}>
					{remoteUsers.map((user) => (
						<div
							key={user.uid}
							className="relative h-full min-h-[560px] overflow-hidden rounded-2xl bg-[#333]"
						>
							<div
								id={getPrivateRemoteVideoId(user.uid)}
								className="h-full min-h-[560px] w-full [&_video]:h-full [&_video]:w-full [&_video]:object-cover"
							/>
							<div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
								{otherName}
							</div>
							{!user.hasVideo && (
								<div className="absolute inset-0 flex items-center justify-center text-white/70">
									<UserRound className="h-9 w-9" />
								</div>
							)}
						</div>
					))}
					{remoteUsers.length === 0 && (
						<div className="flex h-full min-h-[560px] items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 text-center text-sm text-white/70">
							Waiting for {otherName} to join.
						</div>
					)}
				</div>

				{isMinimized && (
					<div className="absolute top-3 right-3 flex items-center gap-2">
						<CallControlButton label="Restore" compact onClick={onRestore}>
							<Maximize2 className="h-4 w-4" />
						</CallControlButton>
						<CallControlButton label="End call" compact danger onClick={() => void endAndClose()}>
							<PhoneOff className="h-4 w-4" />
						</CallControlButton>
					</div>
				)}
			</div>

			<div
				className={cn(
					'absolute right-4 bottom-4 left-4 z-20 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-black/35 p-3 backdrop-blur-md',
					isMinimized ? 'right-3 bottom-3 left-3 bg-black/50 p-2' : '',
				)}
			>
				<CallControlButton
					label={micEnabled ? 'Turn off mic' : 'Turn on mic'}
					disabled={!joined}
					active={micEnabled}
					onClick={toggleMic}
				>
					{micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
				</CallControlButton>
				<CallControlButton
					label={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
					disabled={!joined}
					active={cameraEnabled}
					onClick={toggleCamera}
				>
					{cameraEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
				</CallControlButton>
				<CallControlButton
					label={isMinimized ? 'Restore' : 'Minimize'}
					onClick={isMinimized ? onRestore : onMinimize}
				>
					{isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
				</CallControlButton>
				<CallControlButton label="End call" danger onClick={() => void endAndClose()}>
					<PhoneOff className="h-4 w-4" />
				</CallControlButton>
			</div>
		</div>
	);
}

function CallControlButton({
	children,
	label,
	active,
	danger,
	compact,
	disabled,
	onClick,
}: {
	children: React.ReactNode;
	label: string;
	active?: boolean;
	danger?: boolean;
	compact?: boolean;
	disabled?: boolean;
	onClick?: () => void | Promise<void>;
}) {
	return (
		<Button
			type="button"
			size="icon"
			variant="outline"
			title={label}
			aria-label={label}
			disabled={disabled}
			onClick={() => void onClick?.()}
			className={cn(
				'rounded-full border-white/20 bg-white/90 text-[#333] shadow-lg hover:bg-white',
				compact ? 'h-8 w-8' : 'h-11 w-11',
				active === false && 'bg-[#F0EDE8] text-[#666]',
				active === true && 'bg-[#A8D5BA] text-[#333]',
				danger && 'border-[#E57373] bg-[#E57373] text-white hover:bg-[#d45f5f]',
			)}
		>
			{children}
		</Button>
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

function getPrivateRemoteVideoId(uid: string | number) {
	return `agora-private-remote-${String(uid).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
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
