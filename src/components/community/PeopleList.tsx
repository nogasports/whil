import React from 'react';
import { Search, Mail, Building2, Calendar, Download, FileText, Tag, Plus } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Person } from '../../types/firebase';
import AddPersonModal from './AddPersonModal';
import Button from '../Button';

export default function PeopleList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSource, setSelectedSource] = React.useState('All Sources');
  const [selectedInterest, setSelectedInterest] = React.useState('All Interests');

  const { data: people, loading, add } = useFirestore<Person>({
    collection: 'people'
  });

  const filteredPeople = React.useMemo(() => {
    return people.filter(person => {
      const matchesSearch = 
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = selectedSource === 'All Sources' || person.source === selectedSource;
      const matchesInterest = selectedInterest === 'All Interests' || person.interests.includes(selectedInterest);
      return matchesSearch && matchesSource && matchesInterest;
    });
  }, [people, searchTerm, selectedSource, selectedInterest]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Community Members</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <AddPersonModal
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
                placeholder="Search people..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Sources</option>
              <option>Event</option>
              <option>Report Download</option>
              <option>Newsletter Signup</option>
              <option>Website</option>
            </select>
            <select
              value={selectedInterest}
              onChange={(e) => setSelectedInterest(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Interests</option>
              <option>Research</option>
              <option>Leadership</option>
              <option>Events</option>
              <option>Resources</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Person
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading people...
                  </td>
                </tr>
              ) : filteredPeople.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No people found
                  </td>
                </tr>
              ) : (
                filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-indigo-600">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {person.name}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="h-4 w-4" />
                            <span>{person.email}</span>
                          </div>
                          {person.organization && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <Building2 className="h-4 w-4" />
                              <span>{person.organization}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {person.source === 'Event' && (
                          <Calendar className="h-4 w-4 text-green-500 mr-2" />
                        )}
                        {person.source === 'Report Download' && (
                          <Download className="h-4 w-4 text-blue-500 mr-2" />
                        )}
                        {person.source === 'Newsletter Signup' && (
                          <Mail className="h-4 w-4 text-purple-500 mr-2" />
                        )}
                        {person.source === 'Website' && (
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        )}
                        <span className="text-sm text-gray-900">{person.source}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(person.joinedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        {person.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        {person.activities.slice(0, 2).map((activity, index) => (
                          <div key={index} className="flex items-center">
                            {activity.type === 'event' && (
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            )}
                            {activity.type === 'download' && (
                              <Download className="h-4 w-4 text-gray-400 mr-2" />
                            )}
                            <span>{activity.description}</span>
                          </div>
                        ))}
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