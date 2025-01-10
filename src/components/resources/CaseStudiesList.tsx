import React from 'react';
import { Plus, Search, FileText, Download, Edit, Trash2 } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { CaseStudy } from '../../types/firebase';
import AddCaseStudyModal from './AddCaseStudyModal';
import { getFileContent } from '../../lib/utils/fileService';

export default function CaseStudiesList() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIndustry, setSelectedIndustry] = React.useState('All Industries');
  const [selectedStatus, setSelectedStatus] = React.useState('All Status');

  const { data: caseStudies, loading, error, add, remove, update } = useFirestore<CaseStudy>({
    collection: 'case-studies'
  });

  const industries = React.useMemo(() => {
    const uniqueIndustries = new Set(caseStudies.map(study => study.industry));
    return Array.from(uniqueIndustries);
  }, [caseStudies]);

  const filteredCaseStudies = React.useMemo(() => {
    return caseStudies.filter(study => {
      const matchesSearch = 
        study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        study.organization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = selectedIndustry === 'All Industries' || study.industry === selectedIndustry;
      const matchesStatus = selectedStatus === 'All Status' || study.status === selectedStatus;
      return matchesSearch && matchesIndustry && matchesStatus;
    });
  }, [caseStudies, searchTerm, selectedIndustry, selectedStatus]);

  const handleDownload = async (study: CaseStudy) => {
    if (study.id) {
      await update(study.id, { downloads: (study.downloads || 0) + 1 });
      
      // Get the file content from Firestore
      const pdfContent = await getFileContent(study.pdfUrl);
      
      // Create a temporary link to download the PDF
      const link = document.createElement('a');
      link.href = pdfContent;
      link.download = `${study.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Case Studies</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Case Study
        </button>
      </div>

      <AddCaseStudyModal
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
                placeholder="Search case studies..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option>All Industries</option>
              {industries.map(industry => (
                <option key={industry}>{industry}</option>
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
            <div className="p-6 text-center text-gray-500">Loading case studies...</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading case studies: {error.message}
            </div>
          ) : filteredCaseStudies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No case studies found</div>
          ) : (
            filteredCaseStudies.map((study) => (
              <div key={study.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    {study.thumbnail ? (
                      <img
                        src={study.thumbnail}
                        alt={study.title}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="h-24 w-24 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-8 w-8 text-indigo-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {study.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-indigo-600">
                        {study.organization}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div>Industry: {study.industry}</div>
                        <div>
                          Implemented: {new Date(study.implementationDate).toLocaleDateString()}
                        </div>
                        <div>Downloads: {study.downloads || 0}</div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {study.challenge}
                        </p>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {study.tags.map((tag) => (
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
                      onClick={() => handleDownload(study)}
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
                        if (study.id && confirm('Are you sure you want to delete this case study?')) {
                          remove(study.id);
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