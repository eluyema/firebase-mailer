'use strict';

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'mr.mailer.web.lab.2@gmail.com',
    pass: 'SomE1234',
  },
});

const mailer = async (mail) => transporter.sendMail(mail);

module.exports = mailer;
