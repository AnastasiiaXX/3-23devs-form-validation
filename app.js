import * as yup from 'yup';
import onChange from 'on-change';

const today = new Date();
const adultAge = new Date();
adultAge.setFullYear(today.getFullYear() - 18);

const schema = yup.object().shape({
    firstName: yup.string()
        .trim()
        .required('Имя обязательно')
        .matches(/^[A-Za-zА-Яа-яЁё'-]+$/, 'Имя содержит недопустимые символы')
        .max(20, 'Имя должно содержать не более 20 символов'),
    lastName: yup.string()
        .trim()
        .required('Фамилия обязательна')
        .matches(/^[A-Za-zА-Яа-яЁё'-]+$/, 'Фамилия содержит недопустимые символы')
        .max(20, 'Фамилия должна содержать не более 20 символов'),
    email: yup.string()
        .email('Неверный формат email')
        .required('Email обязателен'),
    password: yup.string()
        .required('Пароль обязателен')
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).*$/, 'Пароль должен содержать минимум одну цифру, одну заглавную букву, одну строчную букву и один специальный символ'),
    passwordConfirmation: yup.string()
        .required('Подтверждение пароля обязательно')
        .oneOf([yup.ref('password'), null], 'Пароли не совпадают'),
    birthDay: yup.date()
        .required('Дата рождения обязательна')
        .max(adultAge, 'Возраст должен быть не менее 18 лет')
});

const app = () => {
  const state = {
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    birthDay: '',
  };

  const form = document.querySelector('form');
  const submit = document.querySelector('input[type="submit"]');

  const watchedState = onChange(state, (path) => {
    const input = form.querySelector(`[name="${path}"]`);
    const errors = validate(state);

    if (isEmpty(errors)) {
      submit.removeAttribute('disabled');
    } else submit.setAttribute('disabled', 'true');

    if (has(errors, path)) {
      const div = document.createElement('div');
      div.classList.add('invalid-feedback');
      div.textContent = errors[path].errors;
      input.classList.add('is-invalid');
      if (!input.parentNode.querySelector('div')) {
        input.parentNode.append(div);
      }
    } else input.classList.remove('is-invalid');
  });

  form.addEventListener('input', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const input = e.target.name;
    const value = formData.get(input);
    watchedState[input] = value;
  });
}
