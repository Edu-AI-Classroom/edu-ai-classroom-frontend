import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
	return (
		<div className="h-screen flex items-center justify-center">
			<div className="text-center space-y-4">
				<h1 className="text-3xl font-bold">403</h1>
				<p>Bạn không có quyền truy cập trang này</p>
				<Button asChild>
					<Link href="/login">Về trang đăng nhập</Link>
				</Button>
			</div>
		</div>
	);
}
