import React from 'react';
import PropTypes from 'prop-types';
import './popup.scss';

function Popup({ isError, message, setStatus }) {
  return (
    <div className={`popup`}>
      <div className={`popup-${isError ? 'error' : 'success'}`}>
        <div className="popup-header">
          <div className="popup-title">{isError ? 'Error' : 'Success'}</div>
          <div className="popup-close" onClick={() => setStatus('')}>
            &#10006;
          </div>
        </div>
        <div className="popup-main">{message}</div>
      </div>
    </div>
  );
}
Popup.propTypes = {
  isError: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};
export default Popup;
