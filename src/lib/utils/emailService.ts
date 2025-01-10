import { Newsletter } from '../../types/firebase';

export async function sendNewsletter(newsletter: Newsletter, recipients: string[]) {
  try {
    const response = await fetch('/api/send-newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newsletter,
        recipients,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send newsletter');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw error;
  }
}