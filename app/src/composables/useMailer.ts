import nodemailer from 'nodemailer';

/**
 * Google Account -> Security -> App passwords (Signing in to Google)
 *  -> Select app -> Other (Custom name)
 *  -> GENERATE
 *
 * smtps://__EMAIL_ADDRESS__:__APP_PASSWORD__@smtp.gmail.com:465?name=__EMAIL_ADDRESS__
 */
const transport = nodemailer.createTransport({ url: process.env.SMTP_URL });

export default () => {
  return transport;
};
