'use strict';

require('dotenv').config();

const functions = require('firebase-functions');
const sanitizeHtml = require('sanitize-html');
const mailer = require('./nodemailer/nodemailer');
const { validateRequestBody } = require('./validate/validate');
const { ratelimit } = require('./ratelimit/ratelimit');

const ipCounter = new Map();

exports.mailer = functions.https.onRequest(async (request, response) => {
  if (!ratelimit(request, ipCounter)) {
    return response.status(429).json({
      message: 'The number of requests has ended. Please try again later',
    });
  }
  const { dataStatus, isValid } = validateRequestBody(request.body);
  if (!isValid) {
    return response.status(400).json({
      message: dataStatus,
    });
  }
  const { name, email, text } = request.body;
  const mail = {
    from: `${name} <${functions.config().mailer.user}>`,
    to: email,
    text: sanitizeHtml(text),
  };

  try {
    await mailer(mail);
    return response.status(200).json({
      message: 'Mail was sent',
    });
  } catch (err) {
    return response.status(400).json({
      message: 'Error occurred while sending. Check mail for correctness',
    });
  }
});
