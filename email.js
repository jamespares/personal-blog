const nodemailer = require('nodemailer');
const { subscribers } = require('./db');

let transporter = null;

function getTransporter() {
    if (transporter) return transporter;
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    return transporter;
}

async function notifySubscribers(post) {
    const transport = getTransporter();
    if (!transport) {
        console.log('SMTP not configured — skipping email notifications');
        return;
    }

    const allSubscribers = subscribers.getAll();
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    for (const sub of allSubscribers) {
        try {
            await transport.sendMail({
                from: process.env.FROM_EMAIL,
                to: sub.email,
                subject: `New Post: ${post.title}`,
                html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a1a;">${post.title}</h2>
            <p style="color: #555; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">${post.topic}</p>
            <p style="color: #333; line-height: 1.6;">${post.excerpt || post.content.substring(0, 200) + '...'}</p>
            <p><a href="${baseUrl}/post/${post.slug}" style="color: #2563eb;">Read more →</a></p>
            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
            <p style="font-size: 12px; color: #999;">
              <a href="${baseUrl}/unsubscribe?token=${sub.unsubscribe_token}" style="color: #999;">Unsubscribe</a>
            </p>
          </div>
        `
            });
        } catch (err) {
            console.error(`Failed to send to ${sub.email}:`, err.message);
        }
    }
}

async function sendWelcomeEmail(email, unsubscribeToken) {
    const transport = getTransporter();
    if (!transport) {
        console.log('SMTP not configured — skipping welcome email');
        return;
    }

    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    try {
        await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Congratulations, you signed up.',
            html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; line-height: 1.6;">
          <p>Hello,</p>
          <p>Thanks for signing up. I'll try to say something interesting from time to time, though no promises.</p>
          <p>If you find yourself regretting this decision, you can always click below to make it stop.</p>
          <p><a href="${baseUrl}/unsubscribe?token=${unsubscribeToken}" style="color: #999; font-size: 12px;">Unsubscribe</a></p>
          <p style="margin-top: 30px; font-style: italic;">— James Pares</p>
        </div>
      `
        });
    } catch (err) {
        console.error(`Failed to send welcome email to ${email}:`, err.message);
    }
}

module.exports = { notifySubscribers, sendWelcomeEmail };
