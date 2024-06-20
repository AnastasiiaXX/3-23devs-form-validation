document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('password').value = '';
  document.getElementById('password-confirm').value = '';
});

const state = {
  fields: {
    'first-name': false,
    'last-name': false,
    'email': false,
    'password': false,
    'password-confirm': false,
    'birth-day': false
  },
  errors: {
    'first-name': 'Поле содержит только буквы и не может быть пустым',
    'last-name': 'Поле содержит только буквы и не может быть пустым',
    'email': 'Неверный формат e-mail',
    'password': 'Пароль должен содержать заглавную букву, хотя бы одну цифру и специальный символ',
    'password-confirm': 'Пароли не совпадают',
    'birth-day': 'Возраст должен быть 18 лет и старше'
  }
};

const isAdult = birthday => {
  const today = new Date();
  const birthdateObj = new Date(birthday);
  const ageInMilliseconds = today - birthdateObj;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  return ageInYears >= 18;
};

const isValidPassword = password => {
  const hasUppercase = /[A-ZА-Я]/.test(password);
  const hasLowercase = /[a-zа-я]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()]/.test(password);

  return (
    hasUppercase &&
    hasLowercase &&
    hasDigit &&
    hasSymbol &&
    password.length >= 8
  );
};

const validateFields = {
  'first-name': e => /^[а-яА-Яa-zA-Z]+$/.test(e.value) && e.value.length < 20,
  'last-name': e => /^[а-яА-Яa-zA-Z]+$/.test(e.value) && e.value.length < 52,
  'email': e => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.value),
  'password': e => isValidPassword(e.value),
  'password-confirm': e => {
    const passwordValue = document.getElementById('password').value;
    return e.value === passwordValue;
  },
  'birth-day': e => isAdult(e.value)
};

const renderValidation = (e, isValid) => {
  const messageElement = document.getElementById(`${e.id}-error`);
  if (!messageElement) return;

  e.classList.toggle('is-valid', isValid);
  e.classList.toggle('is-invalid', !isValid);
  messageElement.textContent = isValid ? '' : state.errors[e.id];
};

const validateForm = () => {
  let isValidForm = true;

  document.querySelectorAll('input').forEach(input => {
    const validationFunction = validateFields[input.id];

    if (validationFunction) {
      const isValid = validationFunction(input); 
      state.fields[input.id] = isValid;
      renderValidation(input, isValid);

      if (!isValid) {
        isValidForm = false;
      }
    }
  });

  document.getElementById('form-button').disabled = !isValidForm;
};

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', validateForm);
  input.addEventListener('blur', validateForm);
});

document.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  if (document.getElementById('form-button').disabled) {
    alert('Пожалуйста, заполните форму корректно.');
  } else {
    e.target.innerHTML = '<p>Вы успешно заполнили форму!</p>';
  }
  e.target.reset(); 
});
