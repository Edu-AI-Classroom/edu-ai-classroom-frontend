'use client';

import { ArrowRight, CheckCircle, Download, Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function PaymentSuccessContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [mounted, setMounted] = useState(false);

	const planName = searchParams.get('plan') || 'Premium';
	const amount = searchParams.get('amount') || '0';

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#faf9f6] via-[#fef7f3] to-[#f3ede4] py-12 px-4 sm:px-6 lg:px-8">
			{/* Background decorations */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 right-10 w-72 h-72 bg-[#a8d5ba]/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 left-10 w-72 h-72 bg-[#c5b4e3]/10 rounded-full blur-3xl"></div>
			</div>

			{/* Header */}
			<div className="max-w-4xl mx-auto mb-12 relative z-10">
				<Link
					href="/dashboard"
					className="inline-flex items-center gap-2 text-[#f5b041] hover:text-[#e5a030] transition-colors mb-8"
				>
					<Home className="w-5 h-5" />
					<span className="font-semibold">Quay lại dashboard</span>
				</Link>
			</div>

			{/* Main Content */}
			<div className="max-w-4xl mx-auto relative z-10">
				<div className="flex flex-col items-center justify-center min-h-[600px]">
					{/* Success Animation */}
					<div className="mb-12 flex justify-center">
						<div className="relative">
							{/* Pulsing background circles */}
							<div className="absolute inset-0 w-32 h-32 bg-[#a8d5ba]/20 rounded-full animate-pulse blur-xl"></div>
							<div
								className="absolute inset-0 w-32 h-32 bg-[#a8d5ba]/10 rounded-full animate-pulse blur-2xl"
								style={{ animationDelay: '0.5s' }}
							></div>

							{/* Success icon */}
							<div className="relative flex items-center justify-center">
								<div className="w-32 h-32 bg-gradient-to-br from-[#a8d5ba] to-[#7bb89e] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
									<CheckCircle className="w-16 h-16 text-white" />
								</div>
							</div>
						</div>
					</div>

					{/* Success Message */}
					<div className="text-center space-y-4 mb-12">
						<h1 className="text-5xl md:text-6xl font-bold text-[#333333]">
							Thanh toán thành công!
						</h1>
						<p className="text-xl text-[#666666] max-w-2xl mx-auto">
							Cảm ơn bạn đã đăng ký. Gói dịch vụ của bạn đã được kích hoạt.
						</p>
					</div>

					{/* Subscription Details */}
					<Card className="w-full max-w-2xl p-8 mb-12 border-2 border-[#a8d5ba] bg-white shadow-xl">
						<div className="space-y-6">
							{/* Plan info */}
							<div className="flex items-center justify-between pb-6 border-b border-[#e0dcd5]">
								<div>
									<p className="text-sm text-[#666666] font-medium mb-1">Gói đã mua</p>
									<h2 className="text-3xl font-bold text-[#333333]">{planName}</h2>
								</div>
								<div className="text-right">
									<p className="text-sm text-[#666666] font-medium mb-1">Tổng tiền</p>
									<p className="text-3xl font-bold text-[#f5b041]">{amount}đ</p>
								</div>
							</div>

							{/* Transaction details */}
							<div className="grid md:grid-cols-3 gap-4">
								<div className="p-4 bg-[#a8d5ba]/5 rounded-lg">
									<p className="text-sm text-[#666666] mb-2">Mã giao dịch</p>
									<p className="font-mono text-[#333333] font-semibold break-all">TXN20260304001</p>
								</div>
								<div className="p-4 bg-[#f5b041]/5 rounded-lg">
									<p className="text-sm text-[#666666] mb-2">Ngày thanh toán</p>
									<p className="font-semibold text-[#333333]">
										{new Date().toLocaleDateString('vi-VN')}
									</p>
								</div>
								<div className="p-4 bg-[#c5b4e3]/5 rounded-lg">
									<p className="text-sm text-[#666666] mb-2">Trạng thái</p>
									<p className="font-semibold text-[#a8d5ba] flex items-center gap-2">
										<span className="w-2 h-2 bg-[#a8d5ba] rounded-full"></span>
										Thành công
									</p>
								</div>
							</div>

							{/* What's included */}
							<div className="pt-6 border-t border-[#e0dcd5]">
								<p className="text-sm font-semibold text-[#333333] mb-4">Gói của bạn bao gồm:</p>
								<div className="grid md:grid-cols-2 gap-3">
									<div className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#a8d5ba] flex-shrink-0 mt-0.5" />
										<span className="text-sm text-[#333333]">Truy cập đầy đủ nền tảng</span>
									</div>
									<div className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#a8d5ba] flex-shrink-0 mt-0.5" />
										<span className="text-sm text-[#333333]">AI tokens hạn chế</span>
									</div>
									<div className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#a8d5ba] flex-shrink-0 mt-0.5" />
										<span className="text-sm text-[#333333]">Hỗ trợ ưu tiên</span>
									</div>
									<div className="flex items-start gap-3">
										<CheckCircle className="w-5 h-5 text-[#a8d5ba] flex-shrink-0 mt-0.5" />
										<span className="text-sm text-[#333333]">Cập nhật tính năng mới</span>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Next Steps */}
					<div className="w-full max-w-2xl mb-12">
						<h3 className="text-lg font-bold text-[#333333] mb-6 text-center">Bước tiếp theo</h3>
						<div className="space-y-4">
							<div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0dcd5]">
								<div className="flex-shrink-0 w-8 h-8 bg-[#a8d5ba] text-white rounded-full flex items-center justify-center font-bold">
									1
								</div>
								<div>
									<p className="font-semibold text-[#333333]">Truy cập dashboard</p>
									<p className="text-sm text-[#666666] mt-1">
										Bắt đầu sử dụng các tính năng cao cấp của gói dịch vụ
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0dcd5]">
								<div className="flex-shrink-0 w-8 h-8 bg-[#f5b041] text-white rounded-full flex items-center justify-center font-bold">
									2
								</div>
								<div>
									<p className="font-semibold text-[#333333]">Nhận hóa đơn điện tử</p>
									<p className="text-sm text-[#666666] mt-1">
										Kiểm tra email để nhận hóa đơn và thông tin gói dịch vụ
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-[#e0dcd5]">
								<div className="flex-shrink-0 w-8 h-8 bg-[#c5b4e3] text-white rounded-full flex items-center justify-center font-bold">
									3
								</div>
								<div>
									<p className="font-semibold text-[#333333]">Liên hệ hỗ trợ nếu cần</p>
									<p className="text-sm text-[#666666] mt-1">
										Đội hỗ trợ 24/7 sẵn sàng trợ giúp bạn
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="w-full max-w-2xl flex flex-col sm:flex-row gap-4">
						<Button
							size="lg"
							className="flex-1 bg-[#a8d5ba] hover:bg-[#9dcaa9] text-white font-semibold"
							onClick={() => router.push('/dashboard')}
						>
							<ArrowRight className="w-4 h-4 mr-2" />
							Vào Dashboard
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="flex-1 border-[#e0dcd5] text-[#333333] hover:bg-[#f0ede8]"
						>
							<Download className="w-4 h-4 mr-2" />
							Tải hóa đơn
						</Button>
					</div>

					{/* Footer Note */}
					<p className="text-sm text-[#666666] text-center mt-12 max-w-2xl">
						Nếu bạn không thấy gói dịch vụ được kích hoạt, hãy chờ vài phút hoặc liên hệ với bộ phận
						hỗ trợ.
					</p>
				</div>
			</div>
		</div>
	);
}
