import React from 'react';
import { Plus, Search, FileText, Download, Edit, Trash2 } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Report } from '../../types/firebase';
import AddReportModal from './AddReportModal';

export default function ReportsList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSubject, setSelectedSubject] = React.useState('All Subjects');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');

  const { data: reports, loading, error, add, remove, update } = useFirestore<Report>({
    collection: 'reports'
  });

  const subjects = React.useMemo(() => {
    const uniqueSubjects = new Set(reports.map(report => report.subject));
    return Array.from(uniqueSubjects);
  }, [reports]);

  const filteredReports = React.useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = 
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.authors.some(author => 
          author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          author.organization.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesSubject = selectedSubject === 'All Subjects' || report.subject === selectedSubject;
      const matchesStatus = selectedStatus === 'All Status' || report.status === selectedStatus;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [reports, searchTerm, selectedSubject, selectedStatus]);

  const handleDownload = async (report: Report) => {
    if (report.id) {
      // Increment download count
      await update(report.id, { downloads: (report.downloads || 0) + 1 });
      // Open PDF in new tab
      window.open(report.pdfUrl, '_blank');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reports</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report
        </button>
      </div>

      <AddReportModal
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
                placeholder="Search reports..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Subjects</option>
              {subjects.map(subject => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Status</option>
              <option>Draft</option>
              <option>Published</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading reports...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading reports: {error.message}
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No reports found</div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {report.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {report.summary}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div>
                          By: {report.authors.map(author => author.name).join(', ')}
                        </div>
                        <div>
                          Released: {new Date(report.releaseDate).toLocaleDateString()}
                        </div>
                        <div>
                          Downloads: {report.downloads || 0}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {report.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <button
                      onClick={() => handleDownload(report)}
                      className="p-2 text-gray-400 hover:text-indigo-600"
                      title="Download"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (report.id && confirm('Are you sure you want to delete this report?')) {
                          remove(report.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600"
                      title="Delete"
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