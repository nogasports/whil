import React from 'react';
import { Plus, Search, Calendar, Users, BookOpen, Edit, Trash2 } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Program } from '../../types/firebase';
import AddProgramModal from './AddProgramModal';

export default function ProgramList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('All Types');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');

  const { data: programs, loading, error, add, remove } = useFirestore<Program>({
    collection: 'programs'
  });

  const filteredPrograms = React.useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All Types' || program.type === selectedType;
      const matchesStatus = selectedStatus === 'All Status' || program.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [programs, searchTerm, selectedType, selectedStatus]);

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
        <h2 className="text-xl font-semibold text-gray-900">Programs</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </button>
      </div>

      <AddProgramModal
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
                placeholder="Search programs..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Types</option>
              <option>Research</option>
              <option>Leadership</option>
              <option>Mentorship</option>
              <option>Training</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading programs...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading programs: {error.message}
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No programs found</div>
          ) : (
            filteredPrograms.map((program) => (
              <div key={program.id} className="p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-lg font-medium text-gray-900">
                      {program.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {program.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(program.startDate)} - {formatDate(program.endDate)}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {program.capacity} participants
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {program.type}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      program.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : program.status === 'Upcoming'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // Handle edit
                        }}
                        className="p-1 text-gray-600 hover:text-gray-900"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (program.id && confirm('Are you sure you want to delete this program?')) {
                            remove(program.id);
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