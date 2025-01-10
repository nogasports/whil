import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import EventList from '../../components/events/EventList';
import ProgramList from '../../components/events/ProgramList';
import AttendeesList from '../../components/events/AttendeesList';
import FeedbackList from '../../components/events/FeedbackList';

const tabs = [
  { name: 'Events', href: '' },
  { name: 'Programs', href: '/programs' },
  { name: 'Attendees', href: '/attendees' },
  { name: 'Feedback', href: '/feedback' },
];

function Events() {
  return (
    <div className="p-6">
      <EventList />
    </div>
  );
}

function Programs() {
  return (
    <div className="p-6">
      <ProgramList />
    </div>
  );
}

function Attendees() {
  return (
    <div className="p-6">
      <AttendeesList />
    </div>
  );
}

function Feedback() {
  return (
    <div className="p-6">
      <FeedbackList />
    </div>
  );
}

export default function EventsPage() {
  return (
    <div>
      <TabNavigation tabs={tabs} basePath="/admin/events" />
      <Routes>
        <Route index element={<Events />} />
        <Route path="programs" element={<Programs />} />
        <Route path="attendees" element={<Attendees />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="*" element={<Navigate to="/admin/events" replace />} />
      </Routes>
    </div>
  );
}