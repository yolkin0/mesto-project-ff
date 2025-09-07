const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);  
};

const hideInputError = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;

  inputElement.classList.remove(config.inputErrorClass);
  errorElement.textContent = "";
  errorElement.classList.remove(config.errorClass);  
};

const checkInputValidity = (formElement, inputElement, config) => {
  let errorMessage = "";

  if (inputElement.validity.valueMissing)
    errorMessage = inputElement.dataset.errorValueMissing
  else if (inputElement.validity.patternMismatch)
    errorMessage = inputElement.dataset.errorPatternMismatch
  else if (inputElement.validity.typeMismatch)
    errorMessage = inputElement.dataset.errorTypeMismatch;
  
  if (!errorMessage)
    errorMessage = inputElement.validationMessage;  

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, errorMessage, config);
    return false;
  }

  hideInputError(formElement, inputElement, config);
  return true;
};

const hasInvalidInput = (inputList) => {  
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}; 

const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

const setFormValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  // чтобы проверить состояние кнопки в самом начале
  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement, config);
      // чтобы проверять его при изменении любого из полей
      toggleButtonState(inputList, buttonElement, config);
    });
  });  
}

export const enableValidation = (config) => {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach((formElement) => {
    setFormValidation(formElement, config);
  });
};

export const resetValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, config);
  });

  toggleButtonState(inputList, buttonElement, config);
}