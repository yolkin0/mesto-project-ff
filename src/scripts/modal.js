const popupIsOpenedClassName = "popup_is-opened";

const handleEscKeyUp = (e) => {
  if (e.key === "Escape") {
    const popup = document.querySelector("." + popupIsOpenedClassName); // находим открытый попап
    closeModal(popup);
  }
};

export const openModal = (modal) => {
  modal.classList.add(popupIsOpenedClassName);
  
  // Обработчик события keydown для клавиши Escape должен 
  // добавляться при открытии модального окна
  document.addEventListener("keydown", handleEscKeyUp);
};

export const closeModal= (modal) => {
  modal.classList.remove(popupIsOpenedClassName);
  
  // Обработчик события keydown для клавиши Escape 
  // должен удаляться при его закрытии.
  document.removeEventListener("keydown", handleEscKeyUp);
};

export const setPopupEventListeners = (popupElement) => {
  // ищем кнопку крестик в попапе
  const popupCloseElement = popupElement.querySelector('.popup__close');
  popupCloseElement.addEventListener("click", () => {
    closeModal(popupElement);
  });

  popupElement.addEventListener("mousedown", (event) => {
    // если event.target содержит класс "popup", то закрываем
    if (event.target.classList.contains("popup")) {
      closeModal(event.target);
    }    
  });
}

