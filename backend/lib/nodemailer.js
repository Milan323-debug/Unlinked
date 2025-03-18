import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER || '3d33dd77bfb227',
    pass: process.env.MAILTRAP_PASSWORD
  }
});

// Sender information
export const sender = {
  email: process.env.EMAIL_FROM || 'noreply@demomailtrap.co',
  name: process.env.EMAIL_FROM_NAME || 'UnLinked'
};

// Test the connection
transporter.verify()
  .then(() => console.log('SMTP server connection established successfully'))
  .catch(err => console.error('Error connecting to SMTP server:', err)); 