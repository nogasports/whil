export interface Partner {
  id?: string;
  name: string;
  type: 'Grantor' | 'Grantee' | 'Sub Grantee';
  status: 'Active' | 'Inactive';
  website: string;
  logo: string;
  description: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  partnerId: string;
  linkedIn: string;
  bio: string;
  avatar: string;
}

export interface Project {
  id?: string;
  missionStatement: string;
  goals: string[];
  timeline: {
    startDate: string;
    endDate: string;
  };
  description: string;
}

export interface Event {
  id?: string;
  title: string;
  description: string;
  type: 'Conference' | 'Workshop' | 'Webinar' | 'Networking';
  startDate: string;
  endDate: string;
  location: {
    type: 'Physical' | 'Virtual';
    address?: string;
    link?: string;
  };
  poster?: string;
  capacity: number;
  price: number;
  status: 'Draft' | 'Published' | 'Cancelled';
}

export interface Program {
  id?: string;
  eventId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'Research' | 'Leadership' | 'Mentorship' | 'Training';
  status: 'Active' | 'Upcoming' | 'Completed';
  coordinator: string;
  capacity: number;
  sessions: {
    id: string;
    title: string;
    type: 'Presentation' | 'Keynote' | 'Breakout' | 'Panel' | 'Other';
    startTime: string;
    endTime: string;
    speakers: {
      name: string;
      role: string;
      organization: string;
    }[];
    description: string;
    location?: string;
    materials?: string[];
  }[];
}

export interface Attendee {
  id?: string;
  eventId: string;
  name: string;
  email: string;
  organization: string;
  role: string;
  registrationDate: string;
  status: 'Registered' | 'Confirmed' | 'Attended' | 'Cancelled';
  ticketType: 'Regular' | 'VIP' | 'Student' | 'Speaker';
  paymentStatus: 'Pending' | 'Completed' | 'Refunded';
}

export interface FeedbackQuestion {
  id?: string;
  eventId: string;
  question: string;
  type: 'Rating' | 'Text' | 'MultipleChoice';
  options?: string[];
  required: boolean;
  order: number;
}

export interface FeedbackResponse {
  id?: string;
  eventId: string;
  attendeeId: string;
  responses: {
    questionId: string;
    answer: string | number;
  }[];
  submittedAt: string;
}

export interface Report {
  id?: string;
  title: string;
  thumbnail: string;
  authors: {
    name: string;
    role: string;
    organization: string;
  }[];
  subject: string;
  summary: string;
  releaseDate: string;
  pdfUrl: string;
  tags: string[];
  status: 'Draft' | 'Published' | 'Archived';
  downloads: number;
}

export interface CaseStudy {
  id?: string;
  title: string;
  thumbnail: string;
  organization: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string;
  implementationDate: string;
  contactPerson: {
    name: string;
    role: string;
    email: string;
  };
  pdfUrl: string;
  tags: string[];
  status: 'Draft' | 'Published' | 'Archived';
  downloads: number;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  categories: string[];
  tags: string[];
  publishDate: string;
  status: 'Draft' | 'Published' | 'Archived';
  featured: boolean;
  readTime: number;
  views: number;
  likes: number;
}

export interface Person {
  id?: string;
  name: string;
  email: string;
  organization?: string;
  source: 'Event' | 'Report Download' | 'Newsletter Signup' | 'Website';
  joinedAt: string;
  interests: string[];
  activities: {
    type: 'event' | 'download';
    description: string;
    date: string;
  }[];
}

export interface Newsletter {
  id?: string;
  subject: string;
  content: string;
  preview: string;
  sentAt: string;
  recipients: number;
  openRate: number;
  status: 'Draft' | 'Sent';
}

export interface ResearchTeamMember {
  id?: string;
  name: string;
  role: string;
  bio: string;
  order: number;
}

export interface ResearchPartner {
  id?: string;
  name: string;
  type: 'Grantor' | 'Grantee' | 'Sub Grantee';
  description: string;
  order: number;
}

export interface Album {
  id?: string;
  name: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryImage {
  id?: string;
  albumId: string;
  url: string;
  caption?: string;
  createdAt: string;
}