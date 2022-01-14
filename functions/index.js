'use strict';

require('dotenv').config();

const functions = require('firebase-functions');
const sanitizeHtml = require('sanitize-html');
const mailer = require('./nodemailer/nodemailer');
const { validateMailData } = require('./validate/validate');
const { ratelimit } = require('./ratelimit/ratelimit');

const ipCounter = new Map();
const lastIpDate = new Date();

exports.mailer = functions.https.onRequest(async (request, response) => {
  if (request.method === 'POST') {
    const isAllowed = ratelimit(request, ipCounter, lastIpDate);
    if (!isAllowed) {
      const message =
        'The number of requests has ended. Please try again later';
      return response.status(429).json({
        message,
      });
    } else {
      const { name, email, text } = request.body;
      const { dataStatus, isvalid } = validateMailData(name, email, text);
      if (!isvalid) {
        const message = dataStatus;
        return response.status(404).json({
          message,
        });
      }
      const mail = {
        from: `${name} <${functions.config().mailer.user}>`,
        to: email,
        text: sanitizeHtml(text),
      };

      try {
        await mailer(mail);
        const message = 'Mail was sent';
        return response.status(200).json({
          message,
        });
      } catch (err) {
        const message = `Error occurred while sending. Check mail for correctness`;
        return response.status(400).json({
          message,
        });
      }
    }
  } else {
    const message = 'Method can be only POST';
    return response.status(404).json({
      message,
    });
  }
});
