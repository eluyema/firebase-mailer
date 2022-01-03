'use strict';

require('dotenv').config();

const functions = require('firebase-functions');
const cors = require('cors');
const sanitizeHtml = require('sanitize-html');

const { getTimeToTomorrow } = require('./ratelimit/utils');
const mailer = require('./nodemailer/nodemailer');
const { validateMailData } = require('./validate/validate');
const { ratelimit } = require('./ratelimit/ratelimit');

const ipCounter = new Map();
const lastIpDate = new Date();

exports.mailer = functions.https.onRequest((request, response) => {
  cors()(request, response, async () => {
    if (request.method === 'POST') {
      const isAllowed = ratelimit(request, ipCounter, lastIpDate);
      if (!isAllowed) {
        const timeLeft = getTimeToTomorrow();
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.round(timeLeft / (1000 * 60) - hours * 60);
        const message =
          'The number of requests has ended for today. ' +
          `${hours} hours, ${minutes} minutes ` +
          'left until new requests appear';
        return response.status(403).json({
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
          from: `${name} <mr.mailer.web.lab.2@gmail.com>`,
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
          const message = `Error occurred while sending`;
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
});
