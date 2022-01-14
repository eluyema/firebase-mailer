'use strict';

function ratelimit(request, ipCounter) {
  const userIP =
    (request.headers['x-forwarded-for'] || '').split(',')[0] ||
    request.connection.remoteAddress;
  let rateNum = ipCounter.get(userIP) || 1;

  ipCounter.set(userIP, ++rateNum);

  return rateNum <= 5;
}

module.exports = { ratelimit };
