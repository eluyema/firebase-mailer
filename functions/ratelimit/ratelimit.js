'use strict';

function ratelimit(request, ipCounter) {
  const userIP =
    (request.headers['x-forwarded-for'] || '').split(',')[0] ||
    request.connection.remoteAddress;
  let rateNum = 1;
  if (ipCounter.has(userIP)) {
    rateNum = ipCounter.get(userIP) + 1;
    if (rateNum <= 5) ipCounter.set(userIP, rateNum);
  } else {
    ipCounter.set(userIP, rateNum);
  }
  return rateNum <= 5;
}

module.exports = { ratelimit };
