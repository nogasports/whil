import React from 'react';
import { Plus, Search, Star, MessageSquare, List, Edit, Trash2 } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { FeedbackQuestion, Event, FeedbackResponse } from '../../types/firebase';
import AddFeedbackQuestionModal from './AddFeedbackQuestionModal';

export default function FeedbackList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState('All Events');

  const { data: questions, loading, error, add, remove } = useFirestore<FeedbackQuestion>({
    collection: 'feedback-questions'
  });

  const { data: events } = useFirestore<Event>({
    collection: 'events'
  });

  const { data: responses } = useFirestore<FeedbackResponse>({
    collection: 'feedback-responses'
  });

  const filteredQuestions = React.useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEvent = selectedEvent === 'All Events' || question.eventId === selectedEvent;
      return matchesSearch && matchesEvent;
    });
  }, [questions, searchTerm, selectedEvent]);

  const getEventTitle = (eventId: string) => {
    return events.find(event => event.id === eventId)?.title || 'Unknown Event';
  };

  const getResponseCount = (questionId: string) => {
    return responses.filter(response => 
      response.responses.some(r => r.questionId === questionId)
    ).length;
  };

  const getQuestionIcon = (type: FeedbackQuestion['type']) => {
    switch (type) {
      case 'Rating':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'Text':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'MultipleChoice':
        return <List className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Feedback Questions</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </button>
      </div>

      <AddFeedbackQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={add}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search questions..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Events</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading questions...
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading questions: {error.message}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No questions found
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div key={question.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getQuestionIcon(question.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {question.question}
                      </h3>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>{getEventTitle(question.eventId)}</span>
                        <span>•</span>
                        <span>{question.type}</span>
                        <span>•</span>
                        <span>{getResponseCount(question.id!)} responses</span>
                      </div>
                      {question.type === 'MultipleChoice' && question.options && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {question.options.map((option, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-500">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (question.id && confirm('Are you sure you want to delete this question?')) {
                          remove(question.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}