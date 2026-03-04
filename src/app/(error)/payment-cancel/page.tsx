'use client';

import { AlertCircle, ArrowRight, HeadsetIcon, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentCancelPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#fef7f3] to-[#f3ede4] py-12 px-4 sm:px-6 lg:px-8">
			{/* Header */}
			<div className="max-w-4xl mx-auto mb-12">
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-[#f5b041] hover:text-[#e5a030] transition-colors mb-8"
				>
					<Home className="w-5 h-5" />
					<span className="font-semibold">Quay lại trang chủ</span>
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
								<div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#a8d4e6]/30 to-[#a8d5ba]/20 blur-2xl"></div>

								{/* Cancel Icon Container */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="relative">
										{/* Pulsing background */}
										<div className="absolute inset-0 bg-[#a8d4e6]/40 rounded-full animate-pulse blur-xl"></div>

										{/* Main icon background */}
										<div className="relative bg-[#a8d4e6] rounded-full p-8 shadow-lg">
											<AlertCircle className="w-20 h-20 text-[#1976d2] animate-bounce" />
										</div>
									</div>
								</div>
							</div>

							{/* Decorative elements */}
							<div
								className="absolute top-4 right-4 w-12 h-12 bg-[#f5b041]/40 rounded-lg animate-spin"
								style={{ animationDuration: '4s' }}
							></div>
							<div className="absolute bottom-8 left-2 w-8 h-8 bg-[#c5b4e3]/40 rounded-full animate-pulse"></div>
						</div>
					</div>

					{/* Right Side - Content */}
					<div className="space-y-6">
						{/* Title Section */}
						<div className="space-y-2">
							<h1 className="text-4xl font-bold text-[#333333]">Đã hủy thanh toán</h1>
							<p className="text-lg text-[#666666]">Bạn đã hủy giao dịch thanh toán của mình</p>
						</div>

						{/* Info Card */}
						<Card className="bg-white border border-[#e0dcd5] p-4 space-y-3">
							<div className="space-y-2">
								<h3 className="font-semibold text-[#333333] text-sm">Thông tin:</h3>
								<p className="text-[#666666] text-sm flex items-start gap-2">
									<span className="text-[#a8d4e6] mt-1">•</span>
									<span>
										Giao dịch của bạn đã được hủy an toàn. Không có khoản tiền nào được trừ từ tài
										khoản của bạn.
									</span>
								</p>
							</div>
						</Card>

						{/* What You Can Do Section */}
						<div className="space-y-3">
							<h3 className="font-semibold text-[#333333]">Bước tiếp theo:</h3>
							<div className="space-y-2">
								<div className="flex items-start gap-3 p-3 bg-[#a8d5ba]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#a8d5ba] text-white rounded-full text-sm font-bold flex-shrink-0">
										1
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Quay lại trang giá</p>
										<p className="text-xs text-[#666666]">
											Xem lại các gói dịch vụ và chọn gói phù hợp
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-[#c5b4e3]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#c5b4e3] text-white rounded-full text-sm font-bold flex-shrink-0">
										2
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Thử lại thanh toán</p>
										<p className="text-xs text-[#666666]">
											Khi sẵn sàng, bạn có thể tiếp tục thanh toán
										</p>
									</div>
								</div>

								<div className="flex items-start gap-3 p-3 bg-[#a8d4e6]/10 rounded-lg">
									<span className="flex items-center justify-center w-6 h-6 bg-[#a8d4e6] text-white rounded-full text-sm font-bold flex-shrink-0">
										3
									</span>
									<div>
										<p className="font-medium text-[#333333] text-sm">Liên hệ bộ phận hỗ trợ</p>
										<p className="text-xs text-[#666666]">
											Có câu hỏi? Đội hỗ trợ của chúng tôi sẵn lòng giúp
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4">
							<Button
								size="lg"
								className="bg-[#f5b041] hover:bg-[#e5a030] text-[#333333] font-semibold flex items-center gap-2 flex-1"
								asChild
							>
								<Link href="/subscription">
									<RefreshCw className="w-4 h-4" />
									<span>Quay lại trang giá</span>
								</Link>
							</Button>

							<Button
								size="lg"
								variant="outline"
								className="border-[#e0dcd5] text-[#333333] hover:bg-[#f0ede8] flex items-center gap-2 flex-1"
							>
								<HeadsetIcon className="w-4 h-4" />
								Liên hệ hỗ trợ
							</Button>
						</div>

						{/* Secondary Link */}
						<Link
							href="/dashboard"
							className="inline-flex items-center gap-2 text-[#f5b041] hover:text-[#e5a030] font-medium transition-colors"
						>
							<span>Tiếp tục quản lý lớp học</span>
							<ArrowRight className="w-4 h-4" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
