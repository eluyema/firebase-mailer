import React from 'react';
import { useForm } from 'react-hook-form';
import '/web-lab-2/client/src/App.scss';
import errorIcon from '/web-lab-2/client/src/images/error.svg';
function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onBlur' });
  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };
  return (
    <div className="form-wrapper">
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
