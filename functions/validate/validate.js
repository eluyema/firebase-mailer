'use strict';

function validateEmail(email) {
  if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
    return true;
  }
  return false;
}
function validateMailData(name, email, text) {
  if (!(text && name && email)) {
    return {
      dataStatus: 'Some of requested data is empty',
      isValid: false,
    };
  }
  if (!validateEmail(email)) {
    return { dataStatus: 'Email is not valid', isValid: false };
  }
  return {
    dataStatus: 'Data is valid',
    isValid: true,
  };
}

function validateExtraProperty(body) {
  const requestedProperty = ['email', 'name', 'text'];
  return Object.keys(body).every((prop) => requestedProperty.includes(prop));
}

function validateRequestBody(body) {
  if (!validateExtraProperty(body))
    return { isValid: false, dataStatus: 'Request body have extra property' };
  const { name, email, text } = body;
  const validationMailInfo = validateMailData(name, email, text);
  if (!validationMailInfo.isValid) return validationMailInfo;
  return {
    dataStatus: 'Body is valid',
    isValid: true,
  };
}

module.exports = { validateEmail, validateMailData, validateRequestBody };
