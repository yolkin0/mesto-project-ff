export const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  // if error, reject promise
  return Promise.reject(`Ошибка: ${res.status}`);
};

export const request = (url, options) => {
  return fetch(url, options).then(checkResponse);
};

export const handleSubmit = (request, evt, errorHandler, loadingText = "Сохранение...") => {
 // всегда нужно предотвращать перезагрузку формы при сабмите
  evt.preventDefault();

  // универсально получаем кнопку сабмита из `evt`
  const submitButton = evt.submitter;
  // записываем начальный текст кнопки до вызова запроса
  const initialText = submitButton.textContent;
  // изменяем текст кнопки до вызова запроса
  renderLoading(true, submitButton, initialText, loadingText);
  request()
    .then(() => {
      // любую форму нужно очищать после успешного ответа от сервера
      // а также `reset` может запустить деактивацию кнопки сабмита (смотрите в `validate.js`)
      evt.target.reset();
    })
    .catch((err) => {
      // в каждом запросе нужно ловить ошибку
      errorHandler(err);
    })
    // в каждом запросе в `finally` нужно возвращать обратно начальный текст кнопки
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
};

const renderLoading = (isLoading, buttonElement, initialText, loadingText) => {
  if (isLoading) {
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
    buttonElement.classList.add("popup__button_disabled");
  } else {
    buttonElement.textContent = initialText;
    buttonElement.disabled = false;
    buttonElement.classList.remove("popup__button_disabled");
  }
};