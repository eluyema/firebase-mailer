'use strict';

function validateEmail(email) {
  if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
    return true;
  }
  return false;
}
function validateMailData(name, email, text) {
  let dataStatus = 'Data is valid';
  let isvalid = true;
  if (!(text && name && email)) {
    dataStatus = 'Some of requested data is empty';
    isvalid = false;
  }
  if (!validateEmail(email)) {
    dataStatus = 'Email is not valid';
    isvalid = false;
  }
  return {
    dataStatus,
    isvalid,
  };
}

module.exports = { validateEmail, validateMailData };
