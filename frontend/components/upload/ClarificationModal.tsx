'use client';

import { useState } from 'react';

interface ClarificationModalProps {
  questions: string[];
  onSubmit: (answers: { question: string; answer: string; skipped?: boolean }[]) => void;
  onClose: () => void;
}

export default function ClarificationModal({ questions, onSubmit, onClose }: ClarificationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ question: string; answer: string; skipped?: boolean }[]>(
    questions.map((q) => ({ question: q, answer: '', skipped: false }))
  );

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      question: currentQuestion,
      answer: value,
      skipped: false,
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      question: currentQuestion,
      answer: '',
      skipped: true,
    };
    setAnswers(newAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const canProceed = answers[currentIndex]?.answer.length > 0 || answers[currentIndex]?.skipped;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Project Clarification</h2>
              <p className="text-sm text-indigo-100 mt-1">
                Answer a few questions to improve your build specification
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white mb-2">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Question */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {currentQuestion}
              </label>
              <textarea
                value={answers[currentIndex]?.answer || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Your answer..."
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {answers[currentIndex]?.answer.length || 0} characters
                </p>
                {answers[currentIndex]?.skipped && (
                  <span className="text-xs text-yellow-600 font-medium">Skipped</span>
                )}
              </div>
            </div>

            {/* Previous Answers Summary */}
            {currentIndex > 0 && (
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Previous Answers:</p>
                <div className="space-y-2">
                  {answers.slice(0, currentIndex).map((ans, idx) => (
                    <div key={idx} className="text-xs bg-gray-50 rounded p-2">
                      <p className="font-medium text-gray-700">Q{idx + 1}:</p>
                      <p className="text-gray-600 truncate">
                        {ans.skipped ? '(Skipped)' : ans.answer || '(No answer)'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentIndex === questions.length - 1 ? 'Submit All Answers' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
