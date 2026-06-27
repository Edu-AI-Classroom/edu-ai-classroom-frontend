'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, CheckCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { queryKeys } from '@/services/api/query-keys';
import { paymentService } from '@/services/payment/payment.service';
import { subscriptionService } from '@/services/payment/subscription.service';
import { useAuthStore } from '@/stores/auth-store';

export default function PaymentSuccessContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryClient = useQueryClient();
	const authUser = useAuthStore((state) => state.user);
	const setUser = useAuthStore((state) => state.setUser);

	const [mounted, setMounted] = useState(false);
	const [isSyncingSubscription, setIsSyncingSubscription] = useState(true);
	const [tokenBalance, setTokenBalance] = useState<number | null>(null);

	const planName = searchParams.get('plan') || 'Premium';
	const amount = searchParams.get('amount') || '0';
	const orderCode = searchParams.get('orderCode');

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		let cancelled = false;
		let timeoutId: number | undefined;
		let attempts = 0;

		const syncSubscription = async () => {
			try {
				if (attempts === 0 && orderCode) {
					await paymentService.confirmPaymentSuccess(orderCode);
				}

				const currentSubscription = await subscriptionService.getUserCurrentSubscription();
				if (cancelled) return;

				const remaining = currentSubscription?.aiTokensRemaining ?? 0;
				const isReady =
					currentSubscription?.status === 'ACTIVE' &&
					(currentSubscription.aiTokenLimit == null || remaining > 0);

				setTokenBalance(remaining);

				if (isReady) {
					if (authUser) {
						setUser({
							...authUser,
							credit: remaining,
						});
					}
					await queryClient.invalidateQueries({
						queryKey: queryKeys.subscription.userCurrent(),
					});
					setIsSyncingSubscription(false);
					return;
				}
			} catch {
				// Retry for a short period because PayOS webhook may arrive after redirect.
			}

			attempts += 1;
			if (attempts >= (orderCode ? 5 : 3)) {
				if (!cancelled) {
					setIsSyncingSubscription(false);
				}
				return;
			}

			timeoutId = window.setTimeout(() => {
				void syncSubscription();
			}, 2000);
		};

		void syncSubscription();

		return () => {
			cancelled = true;
			if (timeoutId) {
				window.clearTimeout(timeoutId);
			}
		};
	}, [authUser, orderCode, queryClient, setUser]);

	if (!mounted) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#fef7f3] to-[#f3ede4] px-4 py-12 sm:px-6 lg:px-8">
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-[#a8d5ba]/10 blur-3xl" />
				<div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-[#c5b4e3]/10 blur-3xl" />
			</div>

			<div className="relative z-10 mx-auto mb-12 max-w-4xl">
				<Link
					href="/dashboard"
					className="mb-8 inline-flex items-center gap-2 text-[#f5b041] transition-colors hover:text-[#e5a030]"
				>
					<Home className="h-5 w-5" />
					<span className="font-semibold">Back to dashboard</span>
				</Link>
			</div>

			<div className="relative z-10 mx-auto max-w-4xl">
				<div className="flex min-h-[600px] flex-col items-center justify-center">
					<div className="mb-12 flex justify-center">
						<div className="relative">
							<div className="absolute inset-0 h-32 w-32 rounded-full bg-[#a8d5ba]/20 blur-xl animate-pulse" />
							<div
								className="absolute inset-0 h-32 w-32 rounded-full bg-[#a8d5ba]/10 blur-2xl animate-pulse"
								style={{ animationDelay: '0.5s' }}
							/>
							<div className="relative flex items-center justify-center">
								<div className="flex h-32 w-32 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-[#a8d5ba] to-[#7bb89e] shadow-2xl">
									<CheckCircle className="h-16 w-16 text-white" />
								</div>
							</div>
						</div>
					</div>

					<div className="mb-12 space-y-4 text-center">
						<h1 className="text-5xl font-bold text-[#333333] md:text-6xl">Payment successful</h1>
						<p className="mx-auto max-w-2xl text-xl text-[#666666]">
							Your subscription is being activated and your AI token balance is syncing.
						</p>
					</div>

					<Card className="mb-12 w-full max-w-2xl border-2 border-[#a8d5ba] bg-white p-8 shadow-xl">
						<div className="space-y-6">
							<div className="flex items-center justify-between border-b border-[#e0dcd5] pb-6">
								<div>
									<p className="mb-1 text-sm font-medium text-[#666666]">Plan</p>
									<h2 className="text-3xl font-bold text-[#333333]">{planName}</h2>
								</div>
								<div className="text-right">
									<p className="mb-1 text-sm font-medium text-[#666666]">Amount</p>
									<p className="text-3xl font-bold text-[#f5b041]">{amount}d</p>
								</div>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								<div className="rounded-lg bg-[#a8d5ba]/5 p-4">
									<p className="mb-2 text-sm text-[#666666]">Date</p>
									<p className="font-semibold text-[#333333]">
										{new Date().toLocaleDateString('vi-VN')}
									</p>
								</div>
								<div className="rounded-lg bg-[#f5b041]/5 p-4">
									<p className="mb-2 text-sm text-[#666666]">Status</p>
									<p className="flex items-center gap-2 font-semibold text-[#a8d5ba]">
										<span className="h-2 w-2 rounded-full bg-[#a8d5ba]" />
										Success
									</p>
								</div>
								<div className="rounded-lg bg-[#c5b4e3]/5 p-4">
									<p className="mb-2 text-sm text-[#666666]">AI Tokens</p>
									<p className="font-semibold text-[#333333]">
										{isSyncingSubscription
											? 'Syncing...'
											: `${tokenBalance ?? authUser?.credit ?? 0} remaining`}
									</p>
								</div>
							</div>

							<div className="rounded-xl border border-[#F0D6A2] bg-[#FFF8EB] p-4">
								<p className="mb-1 text-sm font-semibold text-[#9A6A07]">Subscription sync</p>
								<p className="text-sm text-[#7A5A1F]">
									{isSyncingSubscription
										? 'Waiting for payment confirmation and token allocation from the backend.'
										: `AI token balance updated to ${tokenBalance ?? authUser?.credit ?? 0}.`}
								</p>
							</div>
						</div>
					</Card>

					<div className="w-full max-w-2xl gap-4 sm:flex">
						<Button
							size="lg"
							className="flex-1 bg-[#a8d5ba] font-semibold text-white hover:bg-[#9dcaa9]"
							onClick={() => router.push('/dashboard')}
						>
							<ArrowRight className="mr-2 h-4 w-4" />
							Go to dashboard
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="mt-4 flex-1 border-[#e0dcd5] text-[#333333] hover:bg-[#f0ede8] sm:mt-0"
						>
							<Download className="mr-2 h-4 w-4" />
							Download invoice
						</Button>
					</div>

					<p className="mt-12 max-w-2xl text-center text-sm text-[#666666]">
						If your plan does not appear immediately, keep this page open for a few seconds and let
						the sync finish.
					</p>
				</div>
			</div>
		</div>
	);
}
