import React from 'react';
import { Plus, Search, Calendar, MapPin, Users, Edit, Trash2, UserPlus } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Event } from '../../types/firebase';
import AddEventModal from './AddEventModal';
import EditEventModal from './EditEventModal';
import RegisterEventModal from './RegisterEventModal';

export default function EventList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('All Types');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');

  const { data: events, loading, error, add, update, remove } = useFirestore<Event>({
    collection: 'events'
  });

  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All Types' || event.type === selectedType;
      const matchesStatus = selectedStatus === 'All Status' || event.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [events, searchTerm, selectedType, selectedStatus]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Events</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </button>
      </div>

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={add}
      />

      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedEvent(null);
            }}
            onSubmit={async (data) => {
              if (selectedEvent.id) {
                await update(selectedEvent.id, data);
              }
            }}
            event={selectedEvent}
          />
          <RegisterEventModal
            isOpen={isRegisterModalOpen}
            onClose={() => {
              setIsRegisterModalOpen(false);
              setSelectedEvent(null);
            }}
            event={selectedEvent}
          />
        </>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Types</option>
              <option>Conference</option>
              <option>Workshop</option>
              <option>Webinar</option>
              <option>Networking</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading events...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading events: {error.message}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No events found</div>
          ) : (
            filteredEvents.map((event) => (
              <div key={event.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex mb-4 sm:mb-0">
                    {event.poster ? (
                      <img
                        src={event.poster || ''}
                        alt={event.title}
                        className="h-24 w-24 object-cover rounded-lg mr-4"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-2xl font-bold text-indigo-600">
                          {event.title.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {event.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.startDate)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location.type === 'Physical' 
                            ? event.location.address 
                            : 'Virtual Event'}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.capacity} spots
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'Published' 
                        ? 'bg-green-100 text-green-800'
                        : event.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.status}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                      {event.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsRegisterModalOpen(true);
                        }}
                        className="p-1 text-indigo-600 hover:text-indigo-900"
                        title="Register"
                      >
                        <UserPlus className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (event.id && confirm('Are you sure you want to delete this event?')) {
                            remove(event.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
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