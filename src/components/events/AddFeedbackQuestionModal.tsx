import React from 'react';
import Modal from '../Modal';
import { FeedbackQuestion, Event } from '../../types/firebase';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { where } from 'firebase/firestore';

interface AddFeedbackQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: Omit<FeedbackQuestion, 'id'>) => void;
}

export default function AddFeedbackQuestionModal({
  isOpen,
  onClose,
  onSubmit
}: AddFeedbackQuestionModalProps) {
  const [formData, setFormData] = React.useState<Omit<FeedbackQuestion, 'id'>>({
    eventId: '',
    question: '',
    type: 'Rating',
    options: [],
    required: true,
    order: 0
  });

  const [newOption, setNewOption] = React.useState('');

  const { data: events } = useFirestore<Event>({
    collection: 'events',
    queries: [where('status', '==', 'Published')]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        eventId: '',
        question: '',
        type: 'Rating',
        options: [],
        required: true,
        order: 0
      });
    } catch (error) {
      console.error('Error adding feedback question:', error);
    }
  };

  const addOption = () => {
    if (newOption.trim() && formData.options) {
      setFormData({
        ...formData,
        options: [...formData.options, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    if (formData.options) {
      const newOptions = [...formData.options];
      newOptions.splice(index, 1);
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Feedback Question">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="eventId" className="block text-sm font-medium text-gray-700">
            Select Event
          </label>
          <select
            id="eventId"
            required
            value={formData.eventId}
            onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select an event...</option>
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700">
            Question
          </label>
          <input
            type="text"
            id="question"
            required
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Question Type
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as FeedbackQuestion['type'] })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="Rating">Rating (1-5)</option>
            <option value="Text">Text Response</option>
            <option value="MultipleChoice">Multiple Choice</option>
          </select>
        </div>

        {formData.type === 'MultipleChoice' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Options
            </label>
            <div className="mt-2 space-y-2">
              {formData.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{index + 1}.</span>
                  <input
                    type="text"
                    value={option}
                    readOnly
                    className="flex-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newOption}
                  onChange={(e) => setNewOption(e.target.value)}
                  placeholder="Add new option"
                  className="flex-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={addOption}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={formData.required}
            onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
            Required question
          </label>
        </div>

        <div>
          <label htmlFor="order" className="block text-sm font-medium text-gray-700">
            Question Order
          </label>
          <input
            type="number"
            id="order"
            min="0"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="inline-flex w-full justify-center bg-primary-DEFAULT px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark sm:ml-3 sm:w-auto border-none"
          >
            Add Question
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 inline-flex w-full justify-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm border border-neutral-DEFAULT hover:bg-neutral-light sm:mt-0 sm:w-auto border-none"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}