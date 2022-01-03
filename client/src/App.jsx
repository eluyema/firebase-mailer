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
function reducer(state, action) {
  console.log(action.payload);
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
  } = useForm({ mode: 'onBlur' });
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSubmit = async (data) => {
    dispatch({ type: 'spinnerStatus', payload: true });
    dispatch({ type: 'popupStatus', payload: false });

    const response = await fetch(
      'https://us-central1-web-lab-2-form-mailer.cloudfunctions.net/mailer',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );
    const { message } = await response.json();
    dispatch({ type: 'popupMessage', payload: message });
    dispatch({ type: 'spinnerStatus', payload: false });
    dispatch({ type: 'popupIsError', payload: response.status !== 200 });
    dispatch({ type: 'popupStatus', payload: true });
    console.log(state);
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
              required: { value: true, message: 'Поле должно быть заполненно' },
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
              required: { value: true, message: 'Поле должно быть заполненно' },
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
              required: { value: true, message: 'Поле должно быть заполненно' },
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
