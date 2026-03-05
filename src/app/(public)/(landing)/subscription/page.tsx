'use client';

import {
	AlertCircle,
	ArrowRight,
	Award,
	BarChart3,
	Check,
	Headset,
	MessageSquare,
	Shield,
	Users,
	Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubscriptionPlans } from '@/hooks/queries/subscription/use-subscription-query';
import { useUserSubscription } from '@/hooks/queries/subscription/use-user-subscription';
import { paymentService } from '@/services/payment/payment.service';
import { useAuthStore } from '@/stores/auth-store';
import type { SubscriptionPlan } from '@/types/subscription';

const faqs = [
	{
		question: 'Can I upgrade or downgrade my plan anytime?',
		answer:
			'Yes! You can change your plan at any time. Changes take effect at the next billing cycle. If you upgrade, you will be charged the prorated difference immediately.',
	},
	{
		question: 'What payment methods do you accept?',
		answer:
			'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for enterprise customers.',
	},
	{
		question: 'Is there a free trial?',
		answer:
			'Yes, we offer a 14-day free trial for Professional and Enterprise plans. No credit card required to start your trial.',
	},
	{
		question: 'What happens to my data if I cancel?',
		answer:
			'Your data remains available for 30 days after cancellation. You can export all your class materials, lesson plans, and student data before your account is deleted.',
	},
	{
		question: 'Do you offer discounts for annual billing?',
		answer:
			'Yes! Save 20% when you pay annually. For schools and districts, we offer special multi-license discounts. Contact our sales team for details.',
	},
	{
		question: 'Is technical support included?',
		answer:
			'All plans include email support. Professional plans get faster response times. Enterprise customers get dedicated account manager and 24/7 priority support.',
	},
];

const tierColorMap: Record<string, { color: string; icon: React.ReactNode }> = {
	FREE: { color: '#a8d5ba', icon: <Users className="w-6 h-6" /> },
	PRO_MONTH: { color: '#f5b041', icon: <Award className="w-6 h-6" /> },
	PRO_YEAR: { color: '#f5b041', icon: <Award className="w-6 h-6" /> },
	ENTERPRISE: { color: '#c5b4e3', icon: <Zap className="w-6 h-6" /> },
};

const featureMap: Record<string, string[]> = {
	FREE: [
		'Up to 2 classes',
		'Up to 30 students per class',
		'Basic lesson creation',
		'Asset library access',
		'Standard support',
	],
	PRO_MONTH: [
		'Up to 10 classes',
		'Unlimited students',
		'Advanced lesson builder',
		'Asset library access',
		'Priority email support',
		'Advanced analytics',
		'AI-powered insights',
	],
	PRO_YEAR: [
		'Up to 20 classes',
		'Unlimited students',
		'Advanced lesson builder',
		'Asset library access',
		'Priority email support',
		'Advanced analytics',
		'AI-powered insights',
		'Annual discount (20% off)',
	],
	ENTERPRISE: [
		'Unlimited classes',
		'Unlimited students',
		'Advanced lesson builder',
		'Asset library access',
		'Priority support 24/7',
		'Advanced analytics',
		'AI-powered insights',
		'Custom features',
	],
};

function PricingSkeleton() {
	return (
		<div className="grid md:grid-cols-3 gap-8">
			{[1, 2, 3].map((i) => (
				<Card key={i} className="p-8">
					<Skeleton className="h-8 w-32 mb-4" />
					<Skeleton className="h-12 w-24 mb-6" />
					<Skeleton className="h-10 w-full mb-8" />
					<div className="space-y-4">
						{[1, 2, 3, 4].map((j) => (
							<Skeleton key={j} className="h-4 w-full" />
						))}
					</div>
				</Card>
			))}
		</div>
	);
}

function formatPrice(price: number): string {
	// Convert Vietnamese Dong to display format
	if (price === 0) return '0';
	return new Intl.NumberFormat('vi-VN').format(price);
}

export default function SubscriptionPage() {
	const router = useRouter();
	const { token, hasHydrated } = useAuthStore();
	const { data: plans, isLoading, error } = useSubscriptionPlans();
	const { data: userSubscription } = useUserSubscription();
	const plansArray = plans ?? [];
	const [paymentLoading, setPaymentLoading] = useState<number | null>(null);
	const isAuthenticated = !!token;
	const loginRedirect = `/login?redirect=${encodeURIComponent('/subscription')}`;

	const handleChoosePlan = async (plan: SubscriptionPlan) => {
		if (!hasHydrated) return;

		if (!isAuthenticated) {
			router.push(loginRedirect);
			return;
		}

		try {
			setPaymentLoading(plan.subId);

			// For free plan, just show success or redirect
			if (plan.price === 0) {
				// Handle free plan subscription
				router.push('/success');
				return;
			}

			// Create payment link for paid plans
			const response = await paymentService.createPaymentLink({
				amount: plan.price,
				transaction_type: 'PAYMENT',
				payment_gateway: 'PAYOS',
				sub_id: plan.subId,
			});

			// Redirect to payment link
			const paymentUrl =
				response.data?.payment_link ||
				response.data?.checkoutUrl ||
				response.payment_link ||
				response.checkoutUrl;

			if (paymentUrl) {
				window.location.href = paymentUrl;
			} else {
				console.error('No payment URL returned from API');
			}
		} catch (err) {
			console.error('Payment error:', err);
		} finally {
			setPaymentLoading(null);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#fef7f3] to-[#f3ede4]">
			{/* Hero Section */}
			<section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
					<h1 className="text-5xl md:text-6xl font-bold text-[#333333]">
						Simple, Transparent Pricing
					</h1>
					<p className="text-xl text-[#666666]">
						Choose the perfect plan for your teaching journey. All plans come with our dedicated
						support team.
					</p>
				</div>

				{/* Error State */}
				{error && (
					<div className="max-w-4xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
						<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
						<div>
							<h3 className="font-semibold text-red-900">Unable to load pricing</h3>
							<p className="text-red-800 text-sm mt-1">
								Please refresh the page or contact support if this issue persists.
							</p>
						</div>
					</div>
				)}

				{/* Pricing Cards */}
				<div className="max-w-7xl mx-auto">
					{isLoading ? (
						<PricingSkeleton />
					) : (
						<div className="grid md:grid-cols-3 gap-8 mb-12">
							{plansArray.map((plan, _idx) => {
								const tierConfig = tierColorMap[plan.subCode] || tierColorMap.PRO_MONTH;
								const features = featureMap[plan.subCode] || [];
								const isPopular = plan.subCode === 'PRO_YEAR';

								return (
									<Card
										key={plan.subId}
										className={`relative flex flex-col p-8 transition-all duration-300 hover:shadow-xl ${
											isPopular
												? 'md:scale-105 border-2 bg-white border-[#f5b041] shadow-xl'
												: 'border border-[#e0dcd5] bg-white hover:border-[#f5b041]'
										}`}
									>
										{/* Badge for popular */}
										{isPopular && (
											<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
												<div className="bg-[#f5b041] text-[#333333] px-4 py-1 rounded-full text-sm font-semibold">
													Most Popular
												</div>
											</div>
										)}

										{/* Icon & Title */}
										<div className="flex items-center gap-3 mb-4">
											<div
												className="p-3 rounded-lg text-white"
												style={{ backgroundColor: tierConfig.color }}
											>
												{tierConfig.icon}
											</div>
											<div>
												<h3 className="text-2xl font-bold text-[#333333]">{plan.subName}</h3>
												<p className="text-sm text-[#666666]">
													{plan.durationDays === 365 ? 'Per 66' : 'Per month'}
												</p>
											</div>
										</div>

										{/* Price */}
										<div className="mb-6">
											<div className="flex items-baseline gap-1">
												<span className="text-4xl font-bold text-[#333333]">
													{plan.price === 0 ? 'Free' : `${formatPrice(plan.price)}đ`}
												</span>
												{plan.price > 0 && (
													<span className="text-[#666666]">
														/{plan.durationDays === 365 ? 'year' : 'month'}
													</span>
												)}
											</div>
											{plan.price === 0 && (
												<p className="text-sm text-[#a8d5ba] font-semibold mt-2">Forever free</p>
											)}
										</div>

										{/* CTA Button */}
										<Button
											size="lg"
											onClick={() => handleChoosePlan(plan)}
											disabled={
												!hasHydrated ||
												paymentLoading !== null ||
												userSubscription?.subId === plan.subId
											}
											className={`w-full mb-8 font-semibold ${
												userSubscription?.subId === plan.subId
													? 'bg-[#a8d5ba] hover:bg-[#9dcaa9] text-[#333333]'
													: isPopular
														? 'bg-[#f5b041] hover:bg-[#e5a030] text-[#333333] disabled:bg-[#d4a037]'
														: 'bg-[#e8e4df] hover:bg-[#d8d4cf] text-[#333333] disabled:bg-[#d0ccc7]'
											}`}
										>
											{paymentLoading === plan.subId ? (
												<>
													<div className="w-4 h-4 border-2 border-[#333333] border-t-transparent rounded-full animate-spin mr-2" />
													Processing...
												</>
											) : userSubscription?.subId === plan.subId ? (
												<>
													<Check className="w-4 h-4 mr-2" />
													Bạn đã đăng ký
												</>
											) : (
												<>
													Choose Plan
													<ArrowRight className="w-4 h-4 ml-2" />
												</>
											)}
										</Button>

										{/* Features List */}
										<div className="space-y-4 flex-grow">
											{/* Display actual features from API data */}
											<div className="mb-4">
												<p className="text-sm font-semibold text-[#333333] mb-3">Limits:</p>
												<div className="space-y-2">
													<div className="flex items-center gap-2">
														<Check className="w-5 h-5 text-[#a8d5ba] flex-shrink-0" />
														<span className="text-sm text-[#333333]">
															Up to {plan.maxClasses} classes
														</span>
													</div>
													<div className="flex items-center gap-2">
														<Check className="w-5 h-5 text-[#a8d5ba] flex-shrink-0" />
														<span className="text-sm text-[#333333]">
															{plan.aiTokenLimit.toLocaleString()} AI tokens
														</span>
													</div>
												</div>
											</div>

											{/* Features from feature map */}
											{features.map((feature) => (
												<div key={feature} className="flex items-start gap-3">
													<Check className="w-5 h-5 text-[#a8d5ba] flex-shrink-0 mt-0.5" />
													<span className="text-sm text-[#333333]">{feature}</span>
												</div>
											))}
										</div>
									</Card>
								);
							})}
						</div>
					)}
				</div>
			</section>

			{/* Comparison Table */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-4xl font-bold text-[#333333] text-center mb-12">
						Feature Comparison
					</h2>

					<Card className="overflow-hidden border border-[#e0dcd5]">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-[#f0ede8] border-b border-[#e0dcd5]">
									<tr>
										<th className="px-6 py-4 text-left text-sm font-semibold text-[#333333]">
											Features
										</th>
										{isLoading ? (
											<>
												<th className="px-6 py-4 text-center text-sm font-semibold text-[#333333]">
													<Skeleton className="h-4 w-20 mx-auto" />
												</th>
												<th className="px-6 py-4 text-center text-sm font-semibold text-[#333333]">
													<Skeleton className="h-4 w-20 mx-auto" />
												</th>
											</>
										) : (
											plansArray.map((plan) => (
												<th
													key={plan.subId}
													className="px-6 py-4 text-center text-sm font-semibold text-[#333333]"
												>
													{plan.subName}
												</th>
											))
										)}
									</tr>
								</thead>
								<tbody>
									{[
										{
											name: 'Max Classes',
											getValue: (plan: SubscriptionPlan) => plan.maxClasses.toString(),
										},
										{
											name: 'AI Token Limit',
											getValue: (plan: SubscriptionPlan) => `${plan.aiTokenLimit.toLocaleString()}`,
										},
										{
											name: 'Duration',
											getValue: (plan: SubscriptionPlan) => `${plan.durationDays} days`,
										},
										{
											name: 'Status',
											getValue: (plan: SubscriptionPlan) => (plan.isActive ? 'Active' : 'Inactive'),
										},
									].map((row) => (
										<tr
											key={row.name}
											className={`border-b border-[#e0dcd5] ${row.name === 'Max Classes' || row.name === 'Duration' ? 'bg-white' : 'bg-[#faf9f6]'}`}
										>
											<td className="px-6 py-4 text-sm font-medium text-[#333333]">{row.name}</td>
											{isLoading ? (
												<>
													<td className="px-6 py-4 text-sm text-center">
														<Skeleton className="h-4 w-16 mx-auto" />
													</td>
													<td className="px-6 py-4 text-sm text-center">
														<Skeleton className="h-4 w-16 mx-auto" />
													</td>
												</>
											) : (
												plansArray.map((plan) => (
													<td
														key={plan.subId}
														className="px-6 py-4 text-sm text-center text-[#666666]"
													>
														{row.getValue(plan)}
													</td>
												))
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
				<div className="max-w-6xl mx-auto">
					<h2 className="text-4xl font-bold text-[#333333] text-center mb-12">What's Included</h2>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								icon: BarChart3,
								title: 'Advanced Analytics',
								desc: 'Track student progress in real-time',
							},
							{
								icon: Shield,
								title: 'Enterprise Security',
								desc: 'Bank-level encryption and compliance',
							},
							{
								icon: Headset,
								title: '24/7 Support',
								desc: 'Dedicated support team always ready',
							},
							{
								icon: MessageSquare,
								title: 'Community',
								desc: 'Connect with 10,000+ educators',
							},
						].map((item) => (
							<Card
								key={item.title}
								className="p-6 border border-[#e0dcd5] text-center hover:shadow-lg transition-shadow"
							>
								<item.icon className="w-8 h-8 mx-auto mb-3 text-[#f5b041]" />
								<h3 className="font-semibold text-[#333333] mb-2">{item.title}</h3>
								<p className="text-sm text-[#666666]">{item.desc}</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<h2 className="text-4xl font-bold text-[#333333] text-center mb-12">
						Frequently Asked Questions
					</h2>

					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq) => (
							<AccordionItem
								key={faq.question}
								value={faq.question}
								className="border border-[#e0dcd5] rounded-lg px-6 bg-white"
							>
								<AccordionTrigger className="py-4 hover:text-[#f5b041] font-semibold text-[#333333]">
									{faq.question}
								</AccordionTrigger>
								<AccordionContent className="text-[#666666]">{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 px-4 sm:px-6 lg:px-8">
				<Card className="max-w-3xl mx-auto bg-gradient-to-r from-[#c5b4e3]/20 to-[#a8d4e6]/20 border border-[#c5b4e3]/40 p-8 md:p-12 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
						Ready to Transform Your Classroom?
					</h2>
					<p className="text-lg text-[#666666] mb-8">
						Join thousands of educators using Teachify to create engaging learning experiences.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-[#f5b041] hover:bg-[#e5a030] text-[#333333] font-semibold"
						>
							Start Free Trial
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-[#e0dcd5] text-[#333333] hover:bg-[#f0ede8]"
						>
							Schedule Demo
						</Button>
					</div>
				</Card>
			</section>
		</div>
	);
}
