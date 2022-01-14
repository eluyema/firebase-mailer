import React, { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import './App.scss';
import errorIcon from './images/error.svg';
import Loader from './components/loader/loader';
import Popup from './components/popup/popup';

const initialState = {
  spinnerStatus: false,
  popupStatus: false,
  popupMessage: '',
  popupIsError: false,
};

const EMPTY_FIELD_ERROR_MESSAGE = 'Поле должно быть заполненно';

function reducer(state, action) {
  switch (action.type) {
    case 'spinnerStatus':
      return { ...state, spinnerStatus: action.payload };
    case 'popupStatus':
      return { ...state, popupStatus: action.payload };
    case 'popupMessage':
      return { ...state, popupMessage: action.payload };
    case 'popupIsError':
      return { ...state, popupIsError: action.payload };
  }
}

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSubmit = async (data) => {
    dispatch({ type: 'spinnerStatus', payload: true });
    dispatch({ type: 'popupStatus', payload: false });
    try {
      const response = await fetch('/api/mailer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const { message } = await response.json();
      dispatch({ type: 'popupIsError', payload: response.status !== 200 });
      dispatch({ type: 'popupMessage', payload: message });
    } catch (error) {
      dispatch({ type: 'popupIsError', payload: true });
      dispatch({ type: 'popupMessage', payload: 'Connection error' });
    } finally {
      dispatch({ type: 'spinnerStatus', payload: false });
      dispatch({ type: 'popupStatus', payload: true });
    }
  };
  return (
    <div className="form-wrapper">
      {state.spinnerStatus && <Loader />}
      {state.popupStatus && (
        <Popup
          message={state.popupMessage}
          isError={state.popupIsError}
          setStatus={(value) =>
            dispatch({ type: 'popupStatus', payload: value })
          }
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="form-mailer">
        <label className="input-field">
          <p className="input-name">Your name</p>
          <input
            {...register('name', {
              required: { value: true, message: EMPTY_FIELD_ERROR_MESSAGE },
            })}
            className="text-input"
          />
          <p className="input-error">
            {errors?.name && (
              <>
                <img src={errorIcon} alt="" className="error-icon" />
                {errors?.name.message}
              </>
            )}
          </p>
        </label>
        <label className="input-field">
          <p className="input-name">Recipient email</p>
          <input
            {...register('email', {
              required: { value: true, message: EMPTY_FIELD_ERROR_MESSAGE },
              pattern: {
                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Вписан неккоректный email',
              },
            })}
            className="text-input"
          />
          <p className="input-error">
            {errors?.email && (
              <>
                <img src={errorIcon} alt="" className="error-icon" />
                {errors?.email.message}
              </>
            )}
          </p>
        </label>
        <label className="input-field">
          <p className="input-name">Your message</p>
          <textarea
            {...register('text', {
              required: { value: true, message: EMPTY_FIELD_ERROR_MESSAGE },
            })}
            className="textarea-input"
          />
          <p className="input-error">
            {errors?.text && (
              <>
                <img src={errorIcon} alt="" className="error-icon" />
                {errors?.text.message}
              </>
            )}
          </p>
        </label>
        <input type="submit" disabled={!isValid} className="submit-button" />
      </form>
    </div>
  );
}

export default App;
