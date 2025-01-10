import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import ReportsList from '../../components/resources/ReportsList';
import CaseStudiesList from '../../components/resources/CaseStudiesList';
import BlogList from '../../components/resources/BlogList';

const tabs = [
  { name: 'Reports', href: '' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Blog', href: '/blog' },
];

function Reports() {
  return (
    <div className="p-6">
      <ReportsList />
    </div>
  );
}

function CaseStudies() {
  return (
    <div className="p-6">
      <CaseStudiesList />
    </div>
  );
}

function Blog() {
  return (
    <div className="p-6">
      <BlogList />
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div>
      <TabNavigation tabs={tabs} basePath="/admin/resources" />
      <Routes>
        <Route index element={<Reports />} />
        <Route path="case-studies" element={<CaseStudies />} />
        <Route path="blog" element={<Blog />} />
        <Route path="*" element={<Navigate to="/admin/resources" replace />} />
      </Routes>
    </div>
  );
}