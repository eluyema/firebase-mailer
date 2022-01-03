'use strict';

require('dotenv').config();

const functions = require('firebase-functions');
const cors = require('cors');

const {
  getTimeToTomorrow,
} = require('/web-lab-2/functions/nodemailer/nodemailer');
const mailer = require('/web-lab-2/functions/nodemailer/nodemailer');
const { validateMailData } = require('/web-lab-2/functions/validate/validate');
const { ratelimit } = require('/web-lab-2/functions/ratelimit/ratelimit');

const ipCounter = new Map();
const lastIpDate = new Date();

exports.mailer = functions.https.onRequest((request, response) => {
  cors()(request, response, async () => {
    if (request.method === 'POST') {
      const isAllowed = ratelimit(request, ipCounter, lastIpDate);
      if (!isAllowed) {
        const timeLeft = getTimeToTomorrow();
        const message =
          'The number of requests has ended for today' +
          `\n ${timeLeft.getHours()} hours, ${timeLeft.getMinutes()} ` +
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
          from: `${name} <${functions.config().mailer.user}>`,
          to: email,
          text,
        };

        try {
          await mailer(mail);
          const message = 'Mail was sent';
          console.log('env', functions.config().mailer.user);
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
