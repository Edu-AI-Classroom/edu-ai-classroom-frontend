'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

interface ConfirmActionModalProps {
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	isPending?: boolean;
	onConfirm: () => Promise<void> | void;
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function ConfirmActionModal({
	title,
	description,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	isPending = false,
	onConfirm,
	trigger,
	open,
	onOpenChange,
}: ConfirmActionModalProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = typeof open === 'boolean';
	const currentOpen = isControlled ? open : internalOpen;

	const setOpen = (nextOpen: boolean) => {
		if (isPending && !nextOpen) return;
		if (!isControlled) setInternalOpen(nextOpen);
		onOpenChange?.(nextOpen);
	};

	const handleConfirm = async () => {
		await onConfirm();
		setOpen(false);
	};

	return (
		<Dialog open={currentOpen} onOpenChange={setOpen}>
			{trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
			<DialogContent
				className="sm:max-w-lg border-0 bg-transparent p-0 shadow-none"
				onEscapeKeyDown={(event) => {
					if (isPending) event.preventDefault();
				}}
				onPointerDownOutside={(event) => {
					if (isPending) event.preventDefault();
				}}
				onInteractOutside={(event) => {
					if (isPending) event.preventDefault();
				}}
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 16, rotate: -1 }}
					animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
					transition={{ type: 'spring', stiffness: 250, damping: 18 }}
					className="relative rounded-3xl border-[3px] border-[#333] bg-[#FFFCF5] p-7 shadow-[8px_10px_0_#33333322]"
					style={{
						backgroundImage:
							'radial-gradient(circle at 1px 1px, rgba(51,51,51,0.08) 1px, transparent 1px), linear-gradient(170deg, rgba(255,255,255,0.7), rgba(229,115,115,0.10))',
						backgroundSize: '5px 5px, 100% 100%',
					}}
				>
					<div className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 -rotate-3 rounded-sm bg-[#E8B4B8]/90 shadow-sm" />

					<DialogHeader className="text-left">
						<DialogTitle className="flex items-center gap-2 font-sans text-2xl font-bold text-[#333]">
							<AlertTriangle className="h-5 w-5 text-[#C62828]" />
							{title}
						</DialogTitle>
						<DialogDescription className="pt-1 text-[#666]">{description}</DialogDescription>
					</DialogHeader>

					<DialogFooter className="mt-7">
						<Button
							type="button"
							variant="outline"
							className="rounded-xl border-[#333]/25"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							{cancelLabel}
						</Button>
						<Button
							type="button"
							variant="destructive"
							className="rounded-xl"
							onClick={handleConfirm}
							disabled={isPending}
						>
							{isPending ? 'Deleting...' : confirmLabel}
						</Button>
					</DialogFooter>
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
