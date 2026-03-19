'use client';

import type React from 'react';

import { cn } from '@/lib/utils/utils';

interface StickerIconProps {
	children: React.ReactNode;
	className?: string;
	bgColor?: string;
}

export function StickerIcon({ children, className, bgColor = 'bg-[#A8D5BA]' }: StickerIconProps) {
	return (
		<div
			className={cn(
				'relative inline-flex items-center justify-center p-3 rounded-full sticker',
				bgColor,
				className,
			)}
		>
			<div className="absolute inset-0 rounded-full border-[3px] border-white" />
			{children}
		</div>
	);
}
