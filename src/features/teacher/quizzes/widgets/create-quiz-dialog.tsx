'use client';

import { Plus } from 'lucide-react';
import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateQuiz } from '@/hooks/queries/quiz/use-quiz-mutation';
import type { QuizDocumentType } from '@/types/quiz';
import type { Classroom } from '@/types/class';

export function CreateQuizDialog({
  trigger,
  classOptions,
}: {
  trigger?: ReactNode;
  classOptions: Classroom[];
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classroomId, setClassroomId] = useState<number | undefined>(undefined);
  const [documentType, setDocumentType] = useState<QuizDocumentType>('ASSIGNMENT');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);
  const [totalPoints, setTotalPoints] = useState<number | undefined>(undefined);

  const create = useCreateQuiz();

  const canSubmit = title.trim().length > 0;
  const isSubmitting = create.isPending;

  const normalizedClasses = useMemo(() => classOptions ?? [], [classOptions]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    await create.mutateAsync({
      title: title.trim(),
      description: description.trim() || undefined,
      classroomId,
      documentType,
      timeLimitMinutes,
      totalPoints,
    });

    setTitle('');
    setDescription('');
    setClassroomId(undefined);
    setDocumentType('ASSIGNMENT');
    setTimeLimitMinutes(undefined);
    setTotalPoints(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            className="rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7FC8A9] text-[#113] border-0 shadow-md hover:shadow-lg transition-all"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-3xl bg-white shadow-xl max-w-lg border border-[#E0DCD5]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#333]">Create New Quiz</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5 py-2">
          <div>
            <label htmlFor="quiz-title" className="block text-sm font-semibold text-[#666] mb-2">
              Title *
            </label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Midterm Quiz - Algebra"
              className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="quiz-description" className="block text-sm font-semibold text-[#666] mb-2">
              Description
            </label>
            <textarea
              id="quiz-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Instructions for students (optional)..."
              className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#A8D5BA] outline-none transition-colors resize-none"
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quiz-classroom" className="block text-sm font-semibold text-[#666] mb-2">
                Classroom
              </label>
              <select
                id="quiz-classroom"
                value={classroomId ?? ''}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : NaN;
                  setClassroomId(Number.isNaN(v) ? undefined : v);
                }}
                className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#A8D5BA] outline-none transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="">No classroom (draft)</option>
                {normalizedClasses.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quiz-type" className="block text-sm font-semibold text-[#666] mb-2">
                Document Type
              </label>
              <select
                id="quiz-type"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as QuizDocumentType)}
                className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#A8D5BA] outline-none transition-colors cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="ASSIGNMENT">ASSIGNMENT</option>
                <option value="EXAM">EXAM</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quiz-time-limit" className="block text-sm font-semibold text-[#666] mb-2">
                Time Limit (minutes)
              </label>
              <Input
                id="quiz-time-limit"
                type="number"
                min={0}
                value={timeLimitMinutes ?? ''}
                onChange={(e) => setTimeLimitMinutes(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 45"
                className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="quiz-total-points" className="block text-sm font-semibold text-[#666] mb-2">
                Total Points
              </label>
              <Input
                id="quiz-total-points"
                type="number"
                min={0}
                value={totalPoints ?? ''}
                onChange={(e) => setTotalPoints(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g., 100"
                className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E0DCD5] text-[#666] font-semibold hover:bg-[#F9F8F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7FC8A9] text-[#113] font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

