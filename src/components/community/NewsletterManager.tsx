import React from 'react';
import { Send, Users, Mail, Calendar, Plus, Search, Eye, ArrowRight } from 'lucide-react';
import { useFirestore } from '../../lib/hooks/useFirestore';
import { Newsletter, Person } from '../../types/firebase';
import Button from '../Button';
import ComposeNewsletterModal from './ComposeNewsletterModal';
import { getFileContent } from '../../lib/utils/fileService';
import { sendNewsletter } from '../../lib/utils/emailService';

export default function NewsletterManager() {
  const [isComposing, setIsComposing] = React.useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = React.useState<Newsletter | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sending, setSending] = React.useState(false);

  const { data: newsletters, loading, add } = useFirestore<Newsletter>({
    collection: 'newsletters'
  });

  const { data: subscribers } = useFirestore<Person>({
    collection: 'people'
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredNewsletters = React.useMemo(() => {
    return newsletters.filter(newsletter =>
      newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      newsletter.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [newsletters, searchTerm]);

  const handleSend = async (newsletter: Newsletter, test = false) => {
    try {
      setSending(true);
      
      // Process any embedded images in the content
      let processedContent = newsletter.content;
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;
      
      while ((match = imgRegex.exec(newsletter.content)) !== null) {
        const imgUrl = match[1];
        if (imgUrl.startsWith('firestore://')) {
          const base64Content = await getFileContent(imgUrl);
          processedContent = processedContent.replace(imgUrl, base64Content);
        }
      }
      
      const recipients = test 
        ? [subscribers[0]?.email].filter(Boolean)
        : subscribers.map(s => s.email);

      await sendNewsletter({ ...newsletter, content: processedContent }, recipients);

      if (!test) {
        // Update newsletter status and stats
        const now = new Date().toISOString();
        await update(newsletter.id!, {
          status: 'Sent',
          sentAt: now,
          recipients: recipients.length
        });
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Newsletter</h2>
        <Button
          onClick={() => setIsComposing(true)}
          className="inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Compose Newsletter
        </Button>
      </div>

      <ComposeNewsletterModal
        isOpen={isComposing}
        onClose={() => setIsComposing(false)}
        onSubmit={add}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Subscribers</h3>
              <p className="text-2xl font-semibold text-gray-900">3,240</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Newsletters Sent</h3>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Last Sent</h3>
              <p className="text-lg font-semibold text-gray-900">
                {newsletters[0]?.sentAt ? formatDate(newsletters[0].sentAt) : 'Never'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter List */}
      <div className="mt-8 bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search newsletters..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading newsletters...</div>
          ) : newsletters.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No newsletters found</div>
          ) : (
            filteredNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{newsletter.subject}</h4>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {newsletter.preview}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatDate(newsletter.sentAt)}</span>
                      <span>{newsletter.recipients} recipients</span>
                      <span>{newsletter.openRate}% open rate</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSend(newsletter, true)}
                      disabled={sending}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      Test Send
                    </button>
                    <button
                      onClick={() => handleSend(newsletter)}
                      disabled={sending || newsletter.status === 'Sent'}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {sending ? 'Sending...' : newsletter.status === 'Sent' ? 'Sent' : 'Send'}
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