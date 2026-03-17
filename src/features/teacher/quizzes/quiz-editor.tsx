'use client';

import { ArrowLeft, ChevronDown, ChevronUp, Plus, Save, Sparkles, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useClassList } from '@/hooks/queries/class/use-class-query';
import { useQuizDetail, useQuizQuestions } from '@/hooks/queries/quiz/use-quiz-query';
import {
  useCreateQuizQuestion,
  useDeleteQuizQuestion,
  useGenerateQuizWithAi,
  useReorderQuizQuestions,
  useUpdateQuiz,
  useUpdateQuizQuestion,
} from '@/hooks/queries/quiz/use-quiz-mutation';
import { ConfirmActionModal } from '@/features/teacher/classroom/components/confirm-action-modal';
import type {
  AiGeneratedQuizQuestion,
  QuizDocumentType,
  QuizQuestion,
  QuizQuestionType,
} from '@/types/quiz';

function QuestionTypePill({ type }: { type: QuizQuestionType }) {
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-[#F0EDE8] text-[#666]">
      {type}
    </span>
  );
}

export default function QuizEditor({ quizId }: { quizId: string }) {
  const { data: quiz, isLoading: isQuizLoading } = useQuizDetail(quizId);
  const { data: questions, isLoading: isQuestionsLoading } = useQuizQuestions(quizId);
  const { data: classes } = useClassList();

  const updateQuiz = useUpdateQuiz(quizId);
  const createQuestion = useCreateQuizQuestion(quizId);
  const updateQuestion = useUpdateQuizQuestion(quizId);
  const deleteQuestion = useDeleteQuizQuestion(quizId);
  const reorder = useReorderQuizQuestions(quizId);
  const aiGenerate = useGenerateQuizWithAi(quizId);

  const classOptions = useMemo(() => classes?.data ?? [], [classes]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classroomId, setClassroomId] = useState<number | undefined>(undefined);
  const [documentType, setDocumentType] = useState<QuizDocumentType>('ASSIGNMENT');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);
  const [totalPoints, setTotalPoints] = useState<number | undefined>(undefined);
  const [dueDate, setDueDate] = useState<string>('');

  const [newQType, setNewQType] = useState<QuizQuestionType>('MCQ');
  const [newQText, setNewQText] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);
  const [newMaxScore, setNewMaxScore] = useState<number>(1);
  const [newExpectedAnswer, setNewExpectedAnswer] = useState<string>('');

  // AI generator (Gemini)
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTotalQuestions, setAiTotalQuestions] = useState<number>(10);
  const [aiMcqCount, setAiMcqCount] = useState<number>(7);
  const [aiEssayCount, setAiEssayCount] = useState<number>(3);
  const [aiPointsPerQuestion, setAiPointsPerQuestion] = useState<number>(1);
  const [aiGenerated, setAiGenerated] = useState<AiGeneratedQuizQuestion[] | null>(null);
  const [aiError, setAiError] = useState<string>('');

  // Hydrate local form from server once
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (!quiz || hydrated) return;
    setTitle(quiz.title);
    setDescription(quiz.description ?? '');
    setClassroomId(quiz.classroom?.id ?? undefined);
    setDocumentType(quiz.documentType);
    setTimeLimitMinutes(quiz.timeLimitMinutes ?? undefined);
    setTotalPoints(quiz.totalPoints ?? undefined);
    setDueDate(quiz.dueDate ? new Date(quiz.dueDate).toISOString().slice(0, 16) : '');
    setHydrated(true);
  }, [hydrated, quiz]);

  const onSaveQuiz = async () => {
    await updateQuiz.mutateAsync({
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      classroomId,
      documentType,
      timeLimitMinutes,
      totalPoints,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
    });
  };

  const sortedQuestions = useMemo(() => {
    return [...(questions ?? [])].sort((a, b) => a.positionOrder - b.positionOrder);
  }, [questions]);

  const moveQuestion = async (index: number, dir: -1 | 1) => {
    const next = [...sortedQuestions];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= next.length) return;

    const tmp = next[index];
    next[index] = next[swapIndex];
    next[swapIndex] = tmp;

    await reorder.mutateAsync({
      quizId,
      orderedQuestionIds: next.map((q) => q.id),
    });
  };

  const onAddQuestion = async () => {
    const questionText = newQText.trim();
    if (!questionText) return;

    if (newQType === 'MCQ') {
      const options = newOptions.map((o) => o.trim()).filter(Boolean);
      if (options.length < 2) return;
      const correctIndex = Math.min(newCorrectIndex, options.length - 1);
      await createQuestion.mutateAsync({
        quizId,
        type: 'MCQ',
        questionText,
        options,
        correctIndex,
        maxScore: newMaxScore,
      });
    } else {
      await createQuestion.mutateAsync({
        quizId,
        type: 'ESSAY',
        questionText,
        maxScore: newMaxScore,
        expectedAnswer: newExpectedAnswer.trim() || undefined,
      });
    }

    setNewQText('');
    setNewOptions(['', '', '', '']);
    setNewCorrectIndex(0);
    setNewMaxScore(1);
    setNewExpectedAnswer('');
  };

  const onGenerateWithAi = async () => {
    setAiError('');
    setAiGenerated(null);
    const prompt = aiPrompt.trim();
    if (!prompt) return;

    try {
      const res = await aiGenerate.mutateAsync({
        prompt,
        totalQuestions: aiTotalQuestions,
        mcqCount: aiMcqCount,
        essayCount: aiEssayCount,
        pointsPerQuestion: aiPointsPerQuestion,
        language: 'vi',
      });
      setAiGenerated(res.questions ?? []);
    } catch (e: any) {
      setAiError(e?.message ?? 'AI generate failed');
    }
  };

  const onInsertAiQuestions = async () => {
    if (!aiGenerated || aiGenerated.length === 0) return;
    setAiError('');
    try {
      for (const q of aiGenerated) {
        if (q.type === 'MCQ') {
          await createQuestion.mutateAsync({
            quizId,
            type: 'MCQ',
            questionText: q.questionText,
            options: q.options,
            correctIndex: q.correctIndex,
            maxScore: q.maxScore ?? aiPointsPerQuestion,
          });
        } else {
          await createQuestion.mutateAsync({
            quizId,
            type: 'ESSAY',
            questionText: q.questionText,
            expectedAnswer: q.expectedAnswer,
            maxScore: q.maxScore ?? aiPointsPerQuestion,
          });
        }
      }
      setAiGenerated(null);
      setAiPrompt('');
    } catch (e: any) {
      setAiError(e?.message ?? 'Insert questions failed');
    }
  };

  const onUpdateQuestion = async (q: QuizQuestion, patch: Partial<QuizQuestion>) => {
    if (q.type === 'MCQ') {
      await updateQuestion.mutateAsync({
        questionId: q.id,
        payload: {
          type: 'MCQ',
          questionText: patch.questionText ?? q.questionText,
          options: (patch as any).options ?? q.options,
          correctIndex: (patch as any).correctIndex ?? q.correctIndex,
          maxScore: (patch as any).maxScore ?? q.maxScore,
        },
      });
      return;
    }

    await updateQuestion.mutateAsync({
      questionId: q.id,
      payload: {
        type: 'ESSAY',
        questionText: patch.questionText ?? q.questionText,
        maxScore: (patch as any).maxScore ?? q.maxScore,
        expectedAnswer:
          (patch as any).expectedAnswer !== undefined
            ? ((patch as any).expectedAnswer as any)
            : ((q as any).expectedAnswer ?? null),
      },
    });
  };

  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] grid-paper flex items-center justify-center text-[#666]">
        Loading quiz editor...
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] grid-paper flex items-center justify-center text-[#666]">
        Quiz not found.
      </div>
    );
  }

  const isSaving = updateQuiz.isPending;

  return (
    <div className="min-h-screen bg-[#FAF9F6] grid-paper">
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E0DCD5]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href={`/quizzes/${quizId}`} className="inline-flex items-center gap-2 text-sm text-[#666] hover:text-[#333]">
              <ArrowLeft className="w-4 h-4" />
              Back to Quiz
            </Link>
            <h1 className="font-sans font-bold text-2xl text-[#333] mt-1 truncate">Edit Quiz</h1>
          </div>

          <Button onClick={onSaveQuiz} disabled={isSaving} className="rounded-xl bg-gradient-to-r from-[#F5B041] to-[#FA8D3E] text-white border-0 shadow-md hover:shadow-lg transition-all">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* AI Generator */}
        <section className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E0DCD5] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C5B4E3]/25 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#5a3ea6]" />
              </div>
              <div>
                <h2 className="font-sans font-bold text-lg text-[#333]">AI Quiz Generator</h2>
                <p className="text-sm text-[#666]">Nhập yêu cầu bằng tiếng Việt để tạo câu hỏi + đáp án.</p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-4">
            <Textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder='Ví dụ: "Tạo quiz 10 câu về chủ đề Phân số lớp 5, gồm 7 trắc nghiệm và 3 tự luận. Mức độ từ dễ đến trung bình."'
              className="min-h-[96px] rounded-xl bg-[#F9F8F6] border-[#E0DCD5]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#666] mb-1">Tổng số câu</label>
                <Input
                  type="number"
                  value={aiTotalQuestions}
                  onChange={(e) => setAiTotalQuestions(Number(e.target.value) || 10)}
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#666] mb-1">Trắc nghiệm (MCQ)</label>
                <Input
                  type="number"
                  value={aiMcqCount}
                  onChange={(e) => setAiMcqCount(Number(e.target.value) || 0)}
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#666] mb-1">Tự luận (Essay)</label>
                <Input
                  type="number"
                  value={aiEssayCount}
                  onChange={(e) => setAiEssayCount(Number(e.target.value) || 0)}
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#666] mb-1">Điểm / câu</label>
                <Input
                  type="number"
                  value={aiPointsPerQuestion}
                  onChange={(e) => setAiPointsPerQuestion(Number(e.target.value) || 1)}
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
            </div>

            {aiError ? <p className="text-sm text-red-600">{aiError}</p> : null}

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Button
                onClick={onGenerateWithAi}
                disabled={aiGenerate.isPending || !aiPrompt.trim()}
                className="rounded-xl bg-gradient-to-r from-[#C5B4E3] to-[#A8D4E6] text-[#113] border-0 shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {aiGenerate.isPending ? 'Generating...' : 'Generate'}
              </Button>

              <Button
                variant="outline"
                onClick={onInsertAiQuestions}
                disabled={!aiGenerated || aiGenerated.length === 0 || createQuestion.isPending}
                className="rounded-xl bg-transparent"
              >
                Insert into quiz
              </Button>

              {aiGenerated ? (
                <span className="text-sm text-[#666]">{aiGenerated.length} questions generated</span>
              ) : null}
            </div>

            {aiGenerated && aiGenerated.length > 0 ? (
              <div className="mt-2 rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-4 space-y-3">
                {aiGenerated.slice(0, 10).map((q, idx) => (
                  <div key={idx} className="rounded-xl bg-white border border-[#E0DCD5] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#333]">
                          {idx + 1}. {q.questionText}
                        </p>
                      </div>
                      <QuestionTypePill type={q.type} />
                    </div>
                    {q.type === 'MCQ' ? (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, i) => (
                          <div
                            key={i}
                            className={`text-sm px-2 py-1 rounded-lg border ${i === q.correctIndex ? 'border-[#A8D5BA] bg-[#A8D5BA]/15' : 'border-[#E0DCD5]'
                              }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </div>
                        ))}
                      </div>
                    ) : q.expectedAnswer ? (
                      <p className="mt-2 text-sm text-[#666]">
                        <span className="font-semibold">Expected:</span> {q.expectedAnswer}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#666] mb-2">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#666] mb-2">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as QuizDocumentType)}
                className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors cursor-pointer"
              >
                <option value="ASSIGNMENT">ASSIGNMENT</option>
                <option value="EXAM">EXAM</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#666] mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors resize-none"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#666] mb-2">Classroom</label>
              <select
                value={classroomId ?? ''}
                onChange={(e) => {
                  const v = e.target.value ? Number(e.target.value) : NaN;
                  setClassroomId(Number.isNaN(v) ? undefined : v);
                }}
                className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] focus:bg-white focus:border-[#F59E0B] outline-none transition-colors cursor-pointer"
              >
                <option value="">No classroom (draft)</option>
                {classOptions.map((c) => (
                  <option key={c.classId} value={c.classId}>
                    {c.className}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-[#666] mb-2">Time Limit</label>
                <Input
                  type="number"
                  min={0}
                  value={timeLimitMinutes ?? ''}
                  onChange={(e) => setTimeLimitMinutes(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="minutes"
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666] mb-2">Total Points</label>
                <Input
                  type="number"
                  min={0}
                  value={totalPoints ?? ''}
                  onChange={(e) => setTotalPoints(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="points"
                  className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#666] mb-2">Due date</label>
              <Input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
              />
              <p className="mt-1 text-xs text-[#999]">Optional. Leave empty for no deadline.</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#E0DCD5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#E0DCD5] flex items-center justify-between">
            <div>
              <h2 className="font-sans font-bold text-lg text-[#333]">Question Builder</h2>
              <p className="text-sm text-[#666]">Add MCQ or Essay questions, then reorder.</p>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <div className="rounded-2xl border border-[#E0DCD5] bg-[#FFFCF5] p-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                <div className="sm:w-48">
                  <label className="block text-sm font-semibold text-[#666] mb-2">Type</label>
                  <select
                    value={newQType}
                    onChange={(e) => setNewQType(e.target.value as QuizQuestionType)}
                    className="w-full rounded-xl border border-[#E0DCD5] bg-white p-3 text-sm text-[#333] outline-none cursor-pointer"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="ESSAY">ESSAY</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-semibold text-[#666] mb-2">Question text</label>
                  <Input
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    placeholder="Type the question..."
                    className="rounded-xl border-[#E0DCD5] bg-white text-[#333]"
                  />
                </div>

                <div className="sm:w-40">
                  <label className="block text-sm font-semibold text-[#666] mb-2">Max score</label>
                  <Input
                    type="number"
                    min={0}
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value || 0))}
                    className="rounded-xl border-[#E0DCD5] bg-white text-[#333]"
                  />
                </div>
              </div>

              {newQType === 'MCQ' && (
                <div className="mt-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    {newOptions.map((opt, idx) => (
                      <div key={idx}>
                        <label className="block text-xs font-semibold text-[#666] mb-1">Option {idx + 1}</label>
                        <Input
                          value={opt}
                          onChange={(e) => {
                            const next = [...newOptions];
                            next[idx] = e.target.value;
                            setNewOptions(next);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="rounded-xl border-[#E0DCD5] bg-white text-[#333]"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#666] mb-1">Correct answer</label>
                      <select
                        value={newCorrectIndex}
                        onChange={(e) => setNewCorrectIndex(Number(e.target.value))}
                        className="rounded-xl border border-[#E0DCD5] bg-white px-3 py-2 text-sm text-[#333] outline-none cursor-pointer"
                      >
                        {newOptions.map((_, i) => (
                          <option key={i} value={i}>
                            Option {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {newQType === 'ESSAY' && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#666] mb-1">
                    Expected answer / rubric (optional)
                  </label>
                  <Textarea
                    value={newExpectedAnswer}
                    onChange={(e) => setNewExpectedAnswer(e.target.value)}
                    placeholder="Provide a sample answer or grading rubric..."
                    className="rounded-xl bg-white"
                  />
                </div>
              )}

              <div className="mt-4">
                <Button
                  onClick={onAddQuestion}
                  disabled={createQuestion.isPending || !newQText.trim()}
                  className="rounded-xl bg-gradient-to-r from-[#A8D5BA] to-[#7FC8A9] text-[#113] border-0 shadow-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {createQuestion.isPending ? 'Adding...' : 'Add Question'}
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-sans font-bold text-[#333]">Questions ({sortedQuestions.length})</h3>

              {isQuestionsLoading && <p className="text-[#666]">Loading questions...</p>}

              {!isQuestionsLoading && sortedQuestions.length === 0 && (
                <p className="text-[#666]">No questions yet. Use the builder above to add one.</p>
              )}

              {sortedQuestions.map((q, idx) => (
                <div key={q.id} className="rounded-2xl border border-[#E0DCD5] bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-[#666]">Q{idx + 1}</p>
                        <QuestionTypePill type={q.type} />
                      </div>

                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-[#666] mb-1">Question</label>
                        <Input
                          defaultValue={q.questionText}
                          onBlur={(e) => {
                            const value = e.target.value.trim();
                            if (value && value !== q.questionText) onUpdateQuestion(q, { questionText: value });
                          }}
                          className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                        />
                      </div>

                      {q.type === 'MCQ' && (
                        <div className="mt-3 grid sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => (
                            <div key={`${q.id}-opt-${optIdx}`}>
                              <label className="block text-xs font-semibold text-[#666] mb-1">
                                Option {optIdx + 1} {optIdx === q.correctIndex ? '(correct)' : ''}
                              </label>
                              <Input
                                defaultValue={opt}
                                onBlur={(e) => {
                                  const value = e.target.value;
                                  if (value === opt) return;
                                  const nextOptions = [...q.options];
                                  nextOptions[optIdx] = value;
                                  onUpdateQuestion(q, { ...(q as any), options: nextOptions } as any);
                                }}
                                className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                              />
                            </div>
                          ))}

                          <div>
                            <label className="block text-xs font-semibold text-[#666] mb-1">Correct answer</label>
                            <select
                              value={q.correctIndex}
                              onChange={(e) =>
                                onUpdateQuestion(q, { ...(q as any), correctIndex: Number(e.target.value) } as any)
                              }
                              className="w-full rounded-xl border border-[#E0DCD5] bg-[#F9F8F6] p-3 text-sm text-[#333] outline-none cursor-pointer"
                            >
                              {q.options.map((_, i) => (
                                <option key={i} value={i}>
                                  Option {i + 1}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {q.type === 'ESSAY' && (
                        <div className="mt-3">
                          <label className="block text-xs font-semibold text-[#666] mb-1">
                            Expected answer / rubric (optional)
                          </label>
                          <Textarea
                            defaultValue={(q as any).expectedAnswer ?? ''}
                            onBlur={(e) => {
                              const value = e.target.value;
                              const current = (q as any).expectedAnswer ?? '';
                              if (value === current) return;
                              onUpdateQuestion(q, { ...(q as any), expectedAnswer: value } as any);
                            }}
                            className="rounded-xl bg-[#F9F8F6] focus:bg-white"
                          />
                        </div>
                      )}

                      <div className="mt-3 grid sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <label className="block text-xs font-semibold text-[#666] mb-1">Max score</label>
                          <Input
                            type="number"
                            min={0}
                            defaultValue={q.maxScore}
                            onBlur={(e) => {
                              const value = Number(e.target.value || 0);
                              if (!Number.isFinite(value) || value === q.maxScore) return;
                              onUpdateQuestion(q, { ...(q as any), maxScore: value } as any);
                            }}
                            className="rounded-xl border-[#E0DCD5] bg-[#F9F8F6] focus:bg-white text-[#333]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          onClick={() => moveQuestion(idx, -1)}
                          disabled={reorder.isPending || idx === 0}
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-xl"
                          onClick={() => moveQuestion(idx, 1)}
                          disabled={reorder.isPending || idx === sortedQuestions.length - 1}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                      </div>

                      <ConfirmActionModal
                        title="Delete question?"
                        description="This will remove the question and its answer key."
                        confirmLabel="Delete"
                        isPending={deleteQuestion.isPending}
                        onConfirm={() => deleteQuestion.mutateAsync(q.id)}
                        trigger={
                          <Button variant="destructive" size="icon" className="rounded-xl">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

