import React from 'react';
import Modal from '../Modal';
import { Program, Event } from '../../types/firebase';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { where } from 'firebase/firestore';

interface AddProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (program: Omit<Program, 'id'>) => void;
}

interface Session {
  title: string;
  type: 'Presentation' | 'Keynote' | 'Breakout' | 'Panel' | 'Other';
  startTime: string;
  endTime: string;
  speakers: {
    name: string;
    role: string;
    organization: string;
  }[];
  description: string;
  location?: string;
  materials?: string[];
}

export default function AddProgramModal({ isOpen, onClose, onSubmit }: AddProgramModalProps) {
  const [formData, setFormData] = React.useState<Omit<Program, 'id'>>({
    eventId: '',
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'Research',
    status: 'Upcoming',
    coordinator: '',
    capacity: 0,
    sessions: []
  });

  const [sessions, setSessions] = React.useState<Session[]>([]);

  const { data: events, loading: eventsLoading } = useFirestore<Event>({
    collection: 'events',
    queries: [where('status', '==', 'Published')]
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        eventId: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'Research',
        status: 'Upcoming',
        coordinator: '',
        capacity: 0,
        sessions: []
      });
      setSessions([]);
    }
  }, [isOpen]);

  // Update program dates when event is selected
  React.useEffect(() => {
    if (formData.eventId) {
      const selectedEvent = events.find(event => event.id === formData.eventId);
      if (selectedEvent) {
        setFormData(prev => ({
          ...prev,
          startDate: selectedEvent.startDate.split('T')[0],
          endDate: selectedEvent.endDate.split('T')[0]
        }));
      }
    }
  }, [formData.eventId, events]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        sessions: sessions.map((session, index) => ({
          id: `session-${index + 1}`,
          ...session
        }))
      });
      onClose();
      setFormData({
        eventId: '',
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        type: 'Research',
        status: 'Upcoming',
        coordinator: '',
        capacity: 0,
        sessions: []
      });
      setSessions([]);
    } catch (error) {
      console.error('Error adding program:', error);
    }
  };

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        title: '',
        type: 'Presentation',
        startTime: '',
        endTime: '',
        speakers: [{
          name: '',
          role: '',
          organization: ''
        }],
        description: '',
        location: '',
        materials: []
      }
    ]);
  };

  const updateSession = (index: number, field: keyof Session, value: string) => {
    const updatedSessions = [...sessions];
    updatedSessions[index] = {
      ...updatedSessions[index],
      [field]: value
    };
    setSessions(updatedSessions);
  };

  const removeSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Program">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            {eventsLoading ? (
              <option value="" disabled>Loading events...</option>
            ) : (
              events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.title} ({new Date(event.startDate).toLocaleDateString()})
                </option>
              ))
            )}
          </select>
          {formData.eventId && (
            <p className="mt-1 text-sm text-gray-500">
              Selected event dates: {new Date(formData.startDate).toLocaleDateString()} - {new Date(formData.endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Program Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Program Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Program['type'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Research">Research</option>
              <option value="Leadership">Leadership</option>
              <option value="Mentorship">Mentorship</option>
              <option value="Training">Training</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Program['status'] })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              required
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="coordinator" className="block text-sm font-medium text-gray-700">
              Program Coordinator
            </label>
            <input
              type="text"
              id="coordinator"
              required
              value={formData.coordinator}
              onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
              Capacity
            </label>
            <input
              type="number"
              id="capacity"
              required
              min="1"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Program Description
          </label>
          <textarea
            id="description"
            rows={4}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium text-gray-900">Program Sessions</h4>
            <button
              type="button"
              onClick={addSession}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              Add Session
            </button>
          </div>

          <div className="space-y-4">
            {sessions.map((session, index) => (
              <div key={index} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h5 className="text-sm font-medium text-gray-700">Session {index + 1}</h5>
                  <button
                    type="button"
                    onClick={() => removeSession(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Session Title"
                    required
                    value={session.title}
                    onChange={(e) => updateSession(index, 'title', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <select
                    value={session.type}
                    onChange={(e) => updateSession(index, 'type', e.target.value as Session['type'])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="Presentation">Presentation</option>
                    <option value="Keynote">Keynote</option>
                    <option value="Breakout">Breakout Session</option>
                    <option value="Panel">Panel Discussion</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      required
                      value={session.startTime}
                      onChange={(e) => updateSession(index, 'startTime', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                      type="time"
                      required
                      value={session.endTime}
                      onChange={(e) => updateSession(index, 'endTime', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h6 className="text-sm font-medium text-gray-700">Speakers</h6>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedSessions = [...sessions];
                          updatedSessions[index].speakers.push({
                            name: '',
                            role: '',
                            organization: ''
                          });
                          setSessions(updatedSessions);
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        Add Speaker
                      </button>
                    </div>
                    {session.speakers.map((speaker, speakerIndex) => (
                      <div key={speakerIndex} className="space-y-2 p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Speaker {speakerIndex + 1}</span>
                          {session.speakers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updatedSessions = [...sessions];
                                updatedSessions[index].speakers.splice(speakerIndex, 1);
                                setSessions(updatedSessions);
                              }}
                              className="text-sm text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="Name"
                          required
                          value={speaker.name}
                          onChange={(e) => {
                            const updatedSessions = [...sessions];
                            updatedSessions[index].speakers[speakerIndex].name = e.target.value;
                            setSessions(updatedSessions);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Role"
                          required
                          value={speaker.role}
                          onChange={(e) => {
                            const updatedSessions = [...sessions];
                            updatedSessions[index].speakers[speakerIndex].role = e.target.value;
                            setSessions(updatedSessions);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Organization"
                          required
                          value={speaker.organization}
                          onChange={(e) => {
                            const updatedSessions = [...sessions];
                            updatedSessions[index].speakers[speakerIndex].organization = e.target.value;
                            setSessions(updatedSessions);
                          }}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    ))}
                  </div>

                  <textarea
                    placeholder="Session Description"
                    rows={2}
                    required
                    value={session.description}
                    onChange={(e) => updateSession(index, 'description', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  
                  <input
                    type="text"
                    placeholder="Location (Room/Virtual Link)"
                    value={session.location || ''}
                    onChange={(e) => updateSession(index, 'location', e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="inline-flex w-full justify-center bg-primary-DEFAULT px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark sm:ml-3 sm:w-auto border-none"
          >
            Create Program
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