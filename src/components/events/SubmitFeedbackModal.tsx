import React from 'react';
import Modal from '../Modal';
import { Event, FeedbackQuestion, FeedbackResponse, Attendee } from '../../types/firebase';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { where } from 'firebase/firestore';
import { Star } from 'lucide-react';

interface SubmitFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  attendee: Attendee;
}

export default function SubmitFeedbackModal({
  isOpen,
  onClose,
  event,
  attendee
}: SubmitFeedbackModalProps) {
  const [responses, setResponses] = React.useState<Record<string, string | number>>({});

  const { data: questions } = useFirestore<FeedbackQuestion>({
    collection: 'feedback-questions',
    queries: [where('eventId', '==', event.id)]
  });

  const { add: addResponse } = useFirestore<FeedbackResponse>({
    collection: 'feedback-responses'
  });

  const sortedQuestions = React.useMemo(() => {
    return [...questions].sort((a, b) => a.order - b.order);
  }, [questions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const feedbackResponse: Omit<FeedbackResponse, 'id'> = {
        eventId: event.id!,
        attendeeId: attendee.id!,
        responses: Object.entries(responses).map(([questionId, answer]) => ({
          questionId,
          answer
        })),
        submittedAt: new Date().toISOString()
      };

      await addResponse(feedbackResponse);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const renderQuestion = (question: FeedbackQuestion) => {
    switch (question.type) {
      case 'Rating':
        return (
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setResponses({ ...responses, [question.id!]: rating })}
                className={`p-2 rounded-full ${
                  responses[question.id!] === rating
                    ? 'text-yellow-500'
                    : 'text-gray-300 hover:text-yellow-500'
                }`}
              >
                <Star className="h-6 w-6" />
              </button>
            ))}
          </div>
        );

      case 'Text':
        return (
          <textarea
            required={question.required}
            value={responses[question.id!] as string || ''}
            onChange={(e) => setResponses({ ...responses, [question.id!]: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        );

      case 'MultipleChoice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={question.id}
                  required={question.required}
                  value={option}
                  checked={responses[question.id!] === option}
                  onChange={(e) => setResponses({ ...responses, [question.id!]: e.target.value })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Feedback for ${event.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {sortedQuestions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.question}
              {question.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderQuestion(question)}
          </div>
        ))}

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            Submit Feedback
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}