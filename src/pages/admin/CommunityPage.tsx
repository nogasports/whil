import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import PeopleList from '../../components/community/PeopleList';
import NewsletterManager from '../../components/community/NewsletterManager';

const tabs = [
  { name: 'People', href: '' },
  { name: 'Newsletter', href: '/newsletter' },
];

function People() {
  return (
    <div className="p-6">
      <PeopleList />
    </div>
  );
}

function Newsletter() {
  return (
    <div className="p-6">
      <NewsletterManager />
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div>
      <TabNavigation tabs={tabs} basePath="/admin/community" />
      <Routes>
        <Route index element={<People />} />
        <Route path="newsletter" element={<Newsletter />} />
        <Route path="*" element={<Navigate to="/admin/community" replace />} />
      </Routes>
    </div>
  );
}