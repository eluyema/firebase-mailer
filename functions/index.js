'use strict';

const functions = require('firebase-functions');

const { getTimeToTomorrow, isToday } = require('./ratelimit/utils');

const ipCounter = new Map();
const lastIpDate = new Date();

exports.helloWorld = functions.https.onRequest((request, response) => {
  if (!isToday(lastIpDate)) {
    ipCounter.clear();
  }
  lastIpDate.setTime(Date.now());
  const userIP =
    (request.headers['x-forwarded-for'] || '').split(',')[0] ||
    request.connection.remoteAddress;
  let rateNum = 1;
  if (ipCounter.has(userIP)) {
    rateNum = ipCounter.get(userIP) + 1;
    ipCounter.set(userIP, rateNum);
  } else {
    ipCounter.set(userIP, rateNum);
  }
  if (rateNum <= 40) {
    return response.status(200).json({
      count: ipCounter.get(userIP),
    });
  } else {
    const timeLeft = getTimeToTomorrow();
    const message =
      'The number of requests has ended for today' +
      `\n ${timeLeft.getHours()} hours, ${timeLeft.getMinutes()} ` +
      'left until new requests appear';
    return response.status(403).json({
      message,
    });
  }
});
