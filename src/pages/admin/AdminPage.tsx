import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import ProfilePage from './ProfilePage';
import GalleryPage from './GalleryPage';

const tabs = [
  { name: 'Settings', href: '' },
  { name: 'Profile', href: '/profile' },
  { name: 'Gallery', href: '/gallery' },
];

function Settings() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
      {/* Add your settings content here */}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div>
      <TabNavigation tabs={tabs} basePath="/admin/users" />
      <Routes>
        <Route index element={<Settings />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="*" element={<Navigate to="/admin/users" replace />} />
      </Routes>
    </div>
  );
}