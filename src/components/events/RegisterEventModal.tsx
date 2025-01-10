import React from 'react';
import Modal from '../Modal';
import { Event, Attendee } from '../../types/firebase';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Person } from '../../types/firebase';
import Button from '../Button';

interface RegisterEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export default function RegisterEventModal({ isOpen, onClose, event }: RegisterEventModalProps) {
  const { add } = useFirestore<Attendee>({
    collection: 'attendees'
  });

  const { add: addToCommunity } = useFirestore<Person>({
    collection: 'people'
  });

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    organization: '',
    role: '',
    ticketType: 'Regular' as Attendee['ticketType']
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Create attendee record
      const attendee: Omit<Attendee, 'id'> = {
        eventId: event.id!,
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        role: formData.role,
        registrationDate: new Date().toISOString(),
        status: 'Registered',
        ticketType: formData.ticketType,
        paymentStatus: event.price === 0 ? 'Completed' : 'Pending'
      };

      // Add to community members
      const communityMember: Omit<Person, 'id'> = {
        name: formData.name,
        email: formData.email,
        organization: formData.organization,
        source: 'Event',
        joinedAt: new Date().toISOString(),
        interests: [],
        activities: [{
          type: 'event',
          description: `Registered for ${event.title}`,
          date: new Date().toISOString()
        }]
      };

      await add(attendee);
      await addToCommunity(communityMember);

      setSuccess(true);
    } catch (error) {
      setError('Failed to register for event. Please try again.');
      console.error('Error registering for event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      organization: '',
      role: '',
      ticketType: 'Regular'
    });
    setError('');
    setSuccess(false);
    onClose();
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Registration Successful">
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Thank you for registering!</h3>
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to {formData.email} with all the event details.
          </p>
          <Button onClick={handleClose}>Close</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Register for ${event.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#00205b] focus:ring-[#00205b] sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#00205b] focus:ring-[#00205b] sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
            Organization
          </label>
          <input
            type="text"
            id="organization"
            required
            value={formData.organization}
            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#00205b] focus:ring-[#00205b] sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            type="text"
            id="role"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#00205b] focus:ring-[#00205b] sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700">
            Ticket Type
          </label>
          <select
            id="ticketType"
            value={formData.ticketType}
            onChange={(e) => setFormData({ ...formData, ticketType: e.target.value as Attendee['ticketType'] })}
            className="mt-1 block w-full border-gray-300 shadow-sm focus:border-[#00205b] focus:ring-[#00205b] sm:text-sm"
          >
            <option value="Regular">Regular</option>
            <option value="VIP">VIP</option>
            <option value="Student">Student</option>
            <option value="Speaker">Speaker</option>
          </select>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Registering...' : 'Register Now'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}