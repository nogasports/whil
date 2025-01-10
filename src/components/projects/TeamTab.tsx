import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import AboutProjectTab from '../../components/projects/AboutProjectTab';
import PartnersTab from '../../components/projects/PartnersTab';
import TeamTab from '../../components/projects/TeamTab';

const tabs = [
  { name: 'About Project', href: '' },
  { name: 'Partners', href: '/partners' },
  { name: 'Team', href: '/team' },
];

export default function ProjectsPage() {
  return (
    <div className="p-6">
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        basePath="/admin/projects"
        className="mb-6"
        tabClassName="text-[#06205c] hover:bg-gray-100 px-4 py-2 rounded-none border-b-2 border-transparent hover:border-[#06205c]"
        activeTabClassName="border-[#06205c] text-[#06205c] font-semibold"
      />

      {/* Routes */}
      <div className="bg-white border border-gray-200 rounded-none p-6">
        <Routes>
          <Route index element={<AboutProjectTab />} />
          <Route path="partners" element={<PartnersTab />} />
          <Route path="team" element={<TeamTab />} />
          <Route path="*" element={<Navigate to="/admin/projects" replace />} />
        </Routes>
      </div>
    </div>
  );
}