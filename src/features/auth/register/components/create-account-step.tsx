'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { RegisterFormData } from '../types';

type CreateAccountStepProps = {
	data: RegisterFormData;
	onChange: (field: keyof RegisterFormData, value: string) => void;
};

export function CreateAccountStep({ data, onChange }: CreateAccountStepProps) {
	return (
		<div className="space-y-5">
			<div>
				<h2 className="text-2xl font-semibold text-[#333]">Tạo tài khoản</h2>
				<p className="text-sm text-[#666]">Điền thông tin cơ bản để bắt đầu.</p>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-name">Họ và tên</Label>
				<Input
					id="register-name"
					value={data.name}
					onChange={(event) => onChange('name', event.target.value)}
					placeholder="Nguyễn Văn A"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-email">Email</Label>
				<Input
					id="register-email"
					type="email"
					value={data.email}
					onChange={(event) => onChange('email', event.target.value)}
					placeholder="student@school.edu"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="register-password">Mật khẩu</Label>
				<Input
					id="register-password"
					type="password"
					value={data.password}
					onChange={(event) => onChange('password', event.target.value)}
					placeholder="••••••••"
				/>
				<p className="text-xs text-[#888]">Mật khẩu tối thiểu 6 ký tự.</p>
			</div>
		</div>
	);
}
