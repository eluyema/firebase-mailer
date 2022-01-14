'use strict';

const nodemailer = require('nodemailer');
const functions = require('firebase-functions');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: functions.config().mailer.user,
    pass: functions.config().mailer.pass,
  },
});

const mailer = async (mail) => transporter.sendMail(mail);

module.exports = mailer;
