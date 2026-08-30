'use server';

export async function submitContact(data: { name: string; email: string; subject: string; message: string }) {
  const { name, email, subject, message } = data;

  if (!name || !email || !subject || !message) {
    return { success: false, error: 'All fields are required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: 'Invalid email address.' };
  }

  // Simulate network request to email service using EMAIL_API_KEY
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (process.env.EMAIL_API_KEY === 'fail') {
    return { success: false, error: 'Failed to send message due to server error.' };
  }

  return { success: true };
}
