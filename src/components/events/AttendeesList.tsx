import React from 'react';
import { Search, Mail, Building2, UserRound, Calendar, BadgeCheck, CreditCard } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Attendee, Event } from '../../types/firebase';

export default function AttendeesList() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState('All Events');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');
  const [selectedTicketType, setSelectedTicketType] = React.useState('All Types');

  const { data: attendees, loading, error } = useFirestore<Attendee>({
    collection: 'attendees'
  });

  const { data: events } = useFirestore<Event>({
    collection: 'events'
  });

  const filteredAttendees = React.useMemo(() => {
    return attendees.filter(attendee => {
      const matchesSearch = 
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEvent = selectedEvent === 'All Events' || attendee.eventId === selectedEvent;
      const matchesStatus = selectedStatus === 'All Status' || attendee.status === selectedStatus;
      const matchesTicketType = selectedTicketType === 'All Types' || attendee.ticketType === selectedTicketType;
      return matchesSearch && matchesEvent && matchesStatus && matchesTicketType;
    });
  }, [attendees, searchTerm, selectedEvent, selectedStatus, selectedTicketType]);

  const getEventTitle = (eventId: string) => {
    return events.find(event => event.id === eventId)?.title || 'Unknown Event';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Event Attendees</h2>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search attendees..."
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
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Registered</option>
              <option>Confirmed</option>
              <option>Attended</option>
              <option>Cancelled</option>
            </select>
          </div>
          <div className="mt-4">
            <div className="flex space-x-2">
              {['All Types', 'Regular', 'VIP', 'Student', 'Speaker'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedTicketType(type)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedTicketType === type
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading attendees...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-red-500">
                    Error loading attendees: {error.message}
                  </td>
                </tr>
              ) : filteredAttendees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No attendees found
                  </td>
                </tr>
              ) : (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <UserRound className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {attendee.name}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="h-4 w-4" />
                            <span>{attendee.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Building2 className="h-4 w-4" />
                            <span>{attendee.organization}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{getEventTitle(attendee.eventId)}</div>
                      <div className="text-sm text-gray-500">{attendee.ticketType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(attendee.registrationDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <BadgeCheck className={`h-4 w-4 mr-1 ${
                          attendee.status === 'Attended' 
                            ? 'text-green-500'
                            : attendee.status === 'Confirmed'
                            ? 'text-blue-500'
                            : attendee.status === 'Registered'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`} />
                        <span className={`text-sm ${
                          attendee.status === 'Attended'
                            ? 'text-green-800'
                            : attendee.status === 'Confirmed'
                            ? 'text-blue-800'
                            : attendee.status === 'Registered'
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}>
                          {attendee.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className={`h-4 w-4 mr-1 ${
                          attendee.paymentStatus === 'Completed'
                            ? 'text-green-500'
                            : attendee.paymentStatus === 'Pending'
                            ? 'text-yellow-500'
                            : 'text-red-500'
                        }`} />
                        <span className={`text-sm ${
                          attendee.paymentStatus === 'Completed'
                            ? 'text-green-800'
                            : attendee.paymentStatus === 'Pending'
                            ? 'text-yellow-800'
                            : 'text-red-800'
                        }`}>
                          {attendee.paymentStatus}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}