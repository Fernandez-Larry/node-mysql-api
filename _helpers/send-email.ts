import nodemailer from 'nodemailer';

export default async function sendEmail({ to, subject, html, from = process.env.EMAIL_FROM || 'info@my-node-api.com' }: any) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASS || ''
        }
    } as any);
    await transporter.sendMail({ from, to, subject, html });
}
