'use client';

import { Activity, Brain, FileText, Layout, Pencil, Plus, Shield, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ConfirmActionModal } from '@/features/teacher/classroom/components/confirm-action-modal';
import {
	useCreateSubscriptionPlan,
	useDeleteSubscriptionPlan,
	useSubscriptionPlans,
	useUpdateSubscriptionPlan,
} from '@/hooks/queries/admin/use-subscription-plan';
import { cn } from '@/lib/utils/utils';
import type { SubscriptionPlan } from '@/types/subscription';

export function SubscriptionPlanManagement() {
	const { data: plans, isLoading } = useSubscriptionPlans();
	const createPlan = useCreateSubscriptionPlan();
	const updatePlan = useUpdateSubscriptionPlan();
	const deletePlan = useDeleteSubscriptionPlan();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
	const [showInactive, setShowInactive] = useState(false);

	// Form state
	const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
		subCode: '',
		subName: '',
		price: 0,
		durationDays: 30,
		aiTokenLimit: 1000,
		aiRequestLimit: null,
		maxClasses: 1,
		maxDocuments: null,
		isActive: true,
	});

	const handleOpenCreate = () => {
		setEditingPlan(null);
		setFormData({
			subCode: '',
			subName: '',
			price: 0,
			durationDays: 30,
			aiTokenLimit: 1000,
			aiRequestLimit: null,
			maxClasses: 1,
			maxDocuments: null,
			isActive: true,
		});
		setIsDialogOpen(true);
	};

	const handleOpenEdit = (plan: SubscriptionPlan) => {
		setEditingPlan(plan);
		setFormData(plan);
		setIsDialogOpen(true);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (editingPlan) {
			await updatePlan.mutateAsync({ id: editingPlan.subId, dto: formData });
		} else {
			await createPlan.mutateAsync(formData);
		}
		setIsDialogOpen(false);
	};

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F5B041] border-t-transparent" />
			</div>
		);
	}

	const visiblePlans = plans?.filter((plan) => showInactive || plan.isActive) ?? [];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-[#666]">
						Subscription Management
					</h2>
					<p className="text-sm text-[#999]">Manage pricing plans and feature limits.</p>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3 rounded-xl border border-[#E0DCD5] bg-white px-3 py-2">
						<div>
							<p className="text-sm font-medium text-[#333]">Show inactive plans</p>
							<p className="text-xs text-[#999]">Keep inactive plans hidden by default.</p>
						</div>
						<Switch checked={showInactive} onCheckedChange={setShowInactive} />
					</div>
					<Button
						onClick={handleOpenCreate}
						className="rounded-xl bg-[#333] text-white hover:bg-[#444]"
					>
						<Plus className="mr-2 h-4 w-4" />
						Create New Plan
					</Button>
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{visiblePlans.map((plan) => (
					<Card
						key={plan.subId}
						className={cn(
							'relative overflow-hidden border-[#E0DCD5] transition-all hover:shadow-md',
							!plan.isActive && 'opacity-60',
						)}
					>
						<CardHeader className="pb-4">
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-lg font-bold text-[#333]">{plan.subName}</CardTitle>
									<CardDescription className="font-mono text-xs uppercase text-[#999]">
										{plan.subCode}
									</CardDescription>
								</div>
								<div className="flex items-center gap-1">
									<Button
										variant="ghost"
										size="icon"
										className="h-8 w-8 rounded-lg text-[#666] hover:bg-[#F0EDE8]"
										onClick={() => handleOpenEdit(plan)}
									>
										<Pencil className="h-4 w-4" />
									</Button>
									<ConfirmActionModal
										title="Delete Plan?"
										description={`Are you sure you want to delete the "${plan.subName}" plan? This action cannot be undone.`}
										confirmLabel="Delete"
										isPending={deletePlan.isPending}
										onConfirm={async () => {
											await deletePlan.mutateAsync(plan.subId);
										}}
										trigger={
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										}
									/>
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-baseline gap-1">
								<span className="text-2xl font-bold text-[#333]">
									{new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND',
									}).format(plan.price)}
								</span>
								<span className="text-sm text-[#999]">/ {plan.durationDays} days</span>
							</div>

							<div className="space-y-2 border-t border-[#F0EDE8] pt-4">
								<FeatureItem
									icon={Brain}
									label="AI Tokens"
									value={plan.aiTokenLimit.toLocaleString()}
								/>
								<FeatureItem
									icon={Activity}
									label="AI Requests"
									value={plan.aiRequestLimit ?? 'Unlimited'}
								/>
								<FeatureItem icon={Layout} label="Max Classes" value={plan.maxClasses} />
								<FeatureItem
									icon={FileText}
									label="Max Documents"
									value={plan.maxDocuments ?? 'Unlimited'}
								/>
								<FeatureItem
									icon={Shield}
									label="Status"
									value={plan.isActive ? 'Active' : 'Inactive'}
									statusColor={plan.isActive ? 'text-green-600' : 'text-red-500'}
								/>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
			{!visiblePlans.length ? (
				<div className="rounded-2xl border border-dashed border-[#E0DCD5] bg-white/80 px-6 py-10 text-center">
					<p className="font-medium text-[#333]">No plans match this view.</p>
					<p className="mt-1 text-sm text-[#999]">
						Turn on inactive plans to review archived pricing entries.
					</p>
				</div>
			) : null}

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className="max-w-md rounded-2xl sm:max-w-lg">
					<form onSubmit={handleSubmit}>
						<DialogHeader>
							<DialogTitle>
								{editingPlan ? 'Edit Subscription Plan' : 'Create New Plan'}
							</DialogTitle>
							<DialogDescription>
								Set the details and limits for this subscription plan.
							</DialogDescription>
						</DialogHeader>

						<div className="grid gap-4 py-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="subName">Plan Name</Label>
								<Input
									id="subName"
									placeholder="e.g. Professional"
									value={formData.subName}
									onChange={(e) => setFormData({ ...formData, subName: e.target.value })}
									className="rounded-xl"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="subCode">Plan Code</Label>
								<Input
									id="subCode"
									placeholder="e.g. PRO_MONTHLY"
									value={formData.subCode}
									onChange={(e) =>
										setFormData({ ...formData, subCode: e.target.value.toUpperCase() })
									}
									className="rounded-xl font-mono"
									disabled={!!editingPlan}
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="price">Price (VND)</Label>
								<Input
									id="price"
									type="number"
									min="0"
									step="0.01"
									value={formData.price}
									onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
									className="rounded-xl"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="durationDays">Duration (Days)</Label>
								<Input
									id="durationDays"
									type="number"
									min="1"
									value={formData.durationDays}
									onChange={(e) =>
										setFormData({ ...formData, durationDays: Number(e.target.value) })
									}
									className="rounded-xl"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="aiTokenLimit">AI Token Limit</Label>
								<Input
									id="aiTokenLimit"
									type="number"
									min="0"
									value={formData.aiTokenLimit}
									onChange={(e) =>
										setFormData({ ...formData, aiTokenLimit: Number(e.target.value) })
									}
									className="rounded-xl"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="aiRequestLimit">AI Request Limit (null = unlimited)</Label>
								<Input
									id="aiRequestLimit"
									type="number"
									placeholder="Unlimited"
									value={formData.aiRequestLimit ?? ''}
									onChange={(e) =>
										setFormData({
											...formData,
											aiRequestLimit: e.target.value ? Number(e.target.value) : null,
										})
									}
									className="rounded-xl"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxClasses">Max Classes</Label>
								<Input
									id="maxClasses"
									type="number"
									min="1"
									value={formData.maxClasses}
									onChange={(e) => setFormData({ ...formData, maxClasses: Number(e.target.value) })}
									className="rounded-xl"
									required
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="maxDocuments">Max Docs (null = unlimited)</Label>
								<Input
									id="maxDocuments"
									type="number"
									placeholder="Unlimited"
									value={formData.maxDocuments ?? ''}
									onChange={(e) =>
										setFormData({
											...formData,
											maxDocuments: e.target.value ? Number(e.target.value) : null,
										})
									}
									className="rounded-xl"
								/>
							</div>
							<div className="flex items-center gap-2 sm:col-span-2 pt-2">
								<input
									type="checkbox"
									id="isActive"
									checked={formData.isActive}
									onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
									className="h-4 w-4 rounded border-gray-300 text-[#F5B041] focus:ring-[#F5B041]"
								/>
								<Label htmlFor="isActive" className="text-sm font-medium">
									This plan is active and available for users
								</Label>
							</div>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								className="rounded-xl"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								disabled={createPlan.isPending || updatePlan.isPending}
								className="rounded-xl bg-[#333] text-white hover:bg-[#444]"
							>
								{editingPlan ? 'Update Plan' : 'Create Plan'}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function FeatureItem({
	icon: Icon,
	label,
	value,
	statusColor,
}: {
	icon: any;
	label: string;
	value: string | number;
	statusColor?: string;
}) {
	return (
		<div className="flex items-center justify-between text-sm">
			<div className="flex items-center gap-2 text-[#666]">
				<Icon className="h-3.5 w-3.5" />
				<span>{label}</span>
			</div>
			<span className={cn('font-medium text-[#333]', statusColor)}>{value}</span>
		</div>
	);
}
