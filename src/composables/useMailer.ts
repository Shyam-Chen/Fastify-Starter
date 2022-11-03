import nodemailer from 'nodemailer';

export default () => {
  return nodemailer.createTransport(
    { url: process.env.SMTP_URL },
    { from: '"Fred Foo 👻" <foo@example.com>' },
  );
};
