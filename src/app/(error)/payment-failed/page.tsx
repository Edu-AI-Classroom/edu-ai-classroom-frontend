'use client';

import { AlertCircle, ArrowRight, HeadsetIcon, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentFailedPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#fef7f3] to-[#f3ede4] py-12 px-4 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="max-w-4xl mx-auto mb-12">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[#f5b041] hover:text-[#e5a030] transition-colors mb-8"
				>
					<Home className="w-5 h-5" />
					<span className="font-semibold">Back to Home</span>
				</Link>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					{/* Left Side - Illustration Area */}
					<div className="flex items-center justify-center">
						<div className="relative w-full max-w-sm">
							{/* Background circle with pattern */}
							<div className="relative w-64 h-64 mx-auto mb-6">
								{/* Outer circle */}
								<div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f2c4ce]/30 to-[#c5b4e3]/20 blur-2xl"></div>

								{/* Error Icon Container */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative">
										{/* Pulsing background */}
										<div className="absolute inset-0 bg-[#f2c4ce]/40 rounded-full animate-pulse blur-xl"></div>

										{/* Main icon background */}
										<div className="relative bg-[#f2c4ce] rounded-full p-8 shadow-lg">
											<AlertCircle className="w-20 h-20 text-[#d32f2f] animate-bounce" />
										</div>
									</div>
								</div>
							</div>

							{/* Decorative elements */}
							<div
								className="absolute top-4 right-4 w-12 h-12 bg-[#a8d4e6]/40 rounded-lg animate-spin"
								style={{ animationDuration: '4s' }}
							></div>
							<div className="absolute bottom-8 left-2 w-8 h-8 bg-[#a8d5ba]/40 rounded-full animate-pulse"></div>
						</div>
					</div>

					{/* Right Side - Content */}
					<div className="space-y-6">
						{/* Title Section */}
						<div className="space-y-2">
							<h1 className="text-4xl font-bold text-[#333333]">Payment Failed</h1>
							<p className="text-lg text-[#666666]">
								Sorry, your transaction could not be completed.
							</p>
						</div>

						{/* Error Details Card */}
						<Card className="bg-white border border-[#e0dcd5] p-4 space-y-3">
							<div className="space-y-2">
								<h3 className="font-semibold text-[#333333] text-sm">Reason for failure:</h3>
								<p className="text-[#666666] text-sm flex items-start gap-2">
									<span className="text-[#f5b041] mt-1">•</span>
									<span>Your credit card limit has been exceeded. Please contact your bank.</span>
								</p>
							</div>
						</Card>

						{/* What You Can Do Section */}
						<div className="space-y-3">
							<h3 className="font-semibold text-[#333333]">Next steps:</h3>
							<div className="space-y-2">
								<div className="flex items-start gap-3 p-3 bg-[#a8d5ba]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#a8d5ba] text-white rounded-full text-sm font-bold flex-shrink-0">
										1
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Check card details</p>
										<p className="text-xs text-[#666666]">
											Verify your card number and expiry date.
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-[#c5b4e3]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#c5b4e3] text-white rounded-full text-sm font-bold flex-shrink-0">
										2
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Try another payment method</p>
										<p className="text-xs text-[#666666]">We support multiple payment methods.</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-[#a8d4e6]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#a8d4e6] text-white rounded-full text-sm font-bold flex-shrink-0">
										3
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Contact support</p>
										<p className="text-xs text-[#666666]">We are here to help you 24/7.</p>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4">
							<Button
								size="lg"
								className="bg-[#f5b041] hover:bg-[#e5a030] text-[#333333] font-semibold flex items-center gap-2 flex-1"
							>
								<RefreshCw className="w-4 h-4" />
								Try Payment Again
							</Button>

							<Button
								size="lg"
								variant="outline"
								className="border-[#e0dcd5] text-[#333333] hover:bg-[#f0ede8] flex items-center gap-2 flex-1"
							>
								<HeadsetIcon className="w-4 h-4" />
								Contact Support
							</Button>
						</div>

						{/* Secondary Link */}
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 text-[#f5b041] hover:text-[#e5a030] font-medium transition-colors"
						>
							<span>Continue managing your classroom</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="max-w-4xl mx-auto mt-16">
				<Card className="bg-white border border-[#e0dcd5] p-6 md:p-8">
					<h2 className="text-2xl font-bold text-[#333333] mb-6">Frequently Asked Questions</h2>

					<div className="grid md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<h3 className="font-semibold text-[#333333]">Why was my payment declined?</h3>
							<p className="text-sm text-[#666666]">
								There are several possible reasons: incorrect card details, a bank-side decline, or
								a temporarily blocked account.
							</p>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-[#333333]">Is my data secure?</h3>
							<p className="text-sm text-[#666666]">
								We use 256-bit SSL encryption and do not store credit card information on our
								servers.
							</p>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-[#333333]">
								What if I do not recognize this transaction?
							</h3>
							<p className="text-sm text-[#666666]">
								If you do not recognize this transaction, please contact your bank immediately to
								report potential fraud.
							</p>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-[#333333]">When will I receive my refund?</h3>
							<p className="text-sm text-[#666666]">
								Refunds usually take 3-5 business days, depending on your bank's processing time.
							</p>
						</div>
					</div>
				</Card>
			</div>

			{/* Contact Support Section */}
			<div className="max-w-4xl mx-auto mt-12">
				<Card className="bg-gradient-to-r from-[#c5b4e3]/20 to-[#a8d4e6]/20 border border-[#c5b4e3]/40 p-6 md:p-8">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
						<div>
							<h3 className="text-lg font-bold text-[#333333] mb-2">Need Help?</h3>
							<p className="text-[#666666]">Our support team is available 24/7.</p>
						</div>
						<Button
							size="lg"
							className="bg-[#f5b041] hover:bg-[#e5a030] text-[#333333] font-semibold"
						>
							Chat with Support
						</Button>
					</div>
				</Card>
			</div>
		</div>
	);
}
