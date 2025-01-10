import React from 'react';
import Hero from '../../components/Hero';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Event } from '../../types/firebase';
import RegisterEventModal from '../../components/events/RegisterEventModal';
import { where } from 'firebase/firestore';

export default function EventsPage() {
  const [selectedType, setSelectedType] = React.useState('All Types');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = React.useState(false);

  const { data: events, loading } = useFirestore<Event>({
    collection: 'events',
    queries: [where('status', '==', 'Published')]
  });

  const filteredEvents = React.useMemo(() => {
    return events.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All Types' || event.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [events, searchTerm, selectedType]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <Hero
        title="Events & Programs"
        subtitle="Join our transformative events and leadership programs"
        image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        height="half"
      />

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>All Types</option>
            <option>Conference</option>
            <option>Workshop</option>
            <option>Webinar</option>
            <option>Networking</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No events found</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {event.poster ? (
                  <img
                    src={event.poster}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-indigo-100 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-indigo-600" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'Conference' ? 'bg-purple-100 text-purple-800' :
                      event.type === 'Workshop' ? 'bg-blue-100 text-blue-800' :
                      event.type === 'Webinar' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-500">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.startDate)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location.type === 'Physical' ? event.location.address : 'Virtual Event'}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {event.capacity} spots available
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {new Date(event.endDate).getHours() - new Date(event.startDate).getHours()} hours
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsRegisterModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedEvent && (
        <RegisterEventModal
          isOpen={isRegisterModalOpen}
          onClose={() => {
            setIsRegisterModalOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
        />
      )}
    </div>
  );
}