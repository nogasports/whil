import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/hooks/useAuth';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import PublicAboutPage from './pages/public/AboutPage';
import PublicEventsPage from './pages/public/EventsPage';
import PublicResearchPage from './pages/public/ResearchPage';
import PublicResourcesPage from './pages/public/ResourcesPage';
import PublicBlogPage from './pages/public/BlogPage';
import PublicGalleryPage from './pages/public/GalleryPage';
import LoginPage from './pages/LoginPage';
import AuthGuard from './components/AuthGuard';
import HomePage from './pages/public/HomePage';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProjectsPage from './pages/admin/ProjectsPage';
import AdminEventsPage from './pages/admin/EventsPage';
import AdminResourcesPage from './pages/admin/ResourcesPage';
import AdminPage from './pages/admin/AdminPage';
import CommunityPage from './pages/admin/CommunityPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<PublicAboutPage />} />
          <Route path="events" element={<PublicEventsPage />} />
          <Route path="research" element={<PublicResearchPage />} />
          <Route path="resources" element={<PublicResourcesPage />} />
          <Route path="blog" element={<PublicBlogPage />} />
          <Route path="gallery" element={<PublicGalleryPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<DashboardPage />} />
          <Route path="projects/*" element={<AdminProjectsPage />} />
          <Route path="events/*" element={<AdminEventsPage />} />
          <Route path="resources/*" element={<AdminResourcesPage />} />
          <Route path="users/*" element={<AdminPage />} />
          <Route path="community/*" element={<CommunityPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
