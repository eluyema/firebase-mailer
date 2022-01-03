'use strict';

const { isToday } = require('./utils');

function ratelimit(request, ipCounter, lastIpDate) {
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
    if (rateNum <= 30) ipCounter.set(userIP, rateNum);
  } else {
    ipCounter.set(userIP, rateNum);
  }
  return rateNum <= 30;
}

module.exports = { ratelimit };
