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
    <div>
      <TabNavigation tabs={tabs} basePath="/admin/projects" />
      <Routes>
        <Route index element={<AboutProjectTab />} />
        <Route path="partners" element={<PartnersTab />} />
        <Route path="team" element={<TeamTab />} />
        <Route path="*" element={<Navigate to="/admin/projects" replace />} />
      </Routes>
    </div>
  );
}