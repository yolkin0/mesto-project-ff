import "../pages/index.css";
import { createCardElement } from './card.js';
import { initialCards } from './cards.js';
import { openModal, closeModal, setPopupEventListeners } from "./modal.js";
import { enableValidation, resetValidation } from './validation.js';
import { getInitialCards, addCardServer, deleteCardServer, 
  getUserInfo, updateUserInfo, setLike, updateAvatar } from './api.js';

let currentUserId = null;

const content = document.querySelector('.content');
const placesListContainer = content.querySelector('.places__list');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');

// Popups
const popupEditElement = document.querySelector('.popup_type_edit');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImageImgElement = popupImage.querySelector('.popup__image');
const popupImageCaptionElement = popupImage.querySelector('.popup__caption');
const popupAvatar = document.querySelector(".popup_type_avatar");

// Profile elements
const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

// Profile edit form elements
const formEditElement = popupEditElement.querySelector('.popup__form');
const nameInput = formEditElement.querySelector('.popup__input_type_name');
const jobInput = formEditElement.querySelector('.popup__input_type_description');

// New card form elements
const formNewCard = popupNewCard.querySelector('.popup__form');
const cardNameInput = formNewCard.querySelector('.popup__input_type_card-name');
const cardUrlInput = formNewCard.querySelector('.popup__input_type_url');

// Edit avatar form elements
const formEditAvatar = popupAvatar.querySelector('.popup__form');
const avatarLinkInput = formEditAvatar.querySelector('.popup__input_type_avatar_link');

// Imputs validation config
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const updateProfile = (userData) => {
  profileName.textContent = userData.name;
  profileAbout.textContent = userData.about;
  profileImage.style.backgroundImage = `url(${userData.avatar})`;
  currentUserId = userData._id;
};

const editElementPopup = () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileAbout.textContent;

  resetValidation(formEditElement, validationConfig);

  openModal(popupEditElement);
};

export const addCardToContainer = (cardElement, toBegin = false) => {  
  if (toBegin)
    placesListContainer.prepend(cardElement)
  else 
    placesListContainer.append(cardElement);
};

const handleFormEditElementSubmit = (evt) => {
  evt.preventDefault();

  const buttonElement = formEditElement.querySelector(".popup__button");
  renderButtonLoading(buttonElement, true);  

  updateUserInfo({ name: nameInput.value, about: jobInput.value })
    .then((updatedUser) => {
      updateProfile(updatedUser);
      closeModal(popupEditElement);
    })
    .catch(console.error)
    .finally(() => {
      renderButtonLoading(buttonElement, false);
    });

};

const handleFormNewCardSubmit = (evt) => {
  evt.preventDefault();

  const buttonElement = formNewCard.querySelector(".popup__button");
  renderButtonLoading(buttonElement, true);

  addCardServer({ name: cardNameInput.value, link: cardUrlInput.value })
    .then((card) => {
      const cardElement = createCardElement({
        cardData: card,
        userId: currentUserId,
        onDeleteCardServer: handleDeleteCardServer,
        onLikeCard: handleLikeCard,
        onImageClick: openImagePopup
      });
      addCardToContainer(cardElement, true);

      // Close form
      closeModal(popupNewCard);

      formEditElement.reset();
      resetValidation(formEditElement, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      renderButtonLoading(buttonElement, false);
    });  
};

const handleFormEditAvatarSubmit = (evt) => {
  evt.preventDefault();

  const buttonElement = formEditAvatar.querySelector(".popup__button");
  renderButtonLoading(buttonElement, true);  

  updateAvatar(avatarLinkInput.value)
    .then((updatedUser) => {
      updateProfile(updatedUser);
      
      // Close form
      closeModal(popupAvatar);
      
      formEditAvatar.reset();
      resetValidation(formEditAvatar, validationConfig);
    })
    .catch(console.error)
    .finally(() => {
      renderButtonLoading(buttonElement, false);
    });
}

function handleDeleteCardServer(cardId) {
  let result = false;
  deleteCardServer(cardId)
    .then(() => {
      result = true;
    })
    .catch(console.error);

  return result;
}

const handleLikeCard = (likeButtonElement, cardId, likesCountElement) => {
  const isCurrentUserLiked = likeButtonElement.classList.contains('card__like-button_is-active');

  setLike(cardId, isCurrentUserLiked)
		.then(updatedCard => {
			likeButtonElement.classList.toggle('card__like-button_is-active');
			likesCountElement.textContent = updatedCard.likes.length;
		})
		.catch(console.error);
};

const renderButtonLoading = (buttonElement, isLoading) => {
  if (isLoading) {
    buttonElement.textContent = "Сохранение...";
    buttonElement.disabled = true;
    buttonElement.classList.add("popup__button_disabled");
  } else {
    buttonElement.textContent = "Сохранить";
    buttonElement.disabled = false;
    buttonElement.classList.remove("popup__button_disabled");
  }
};

const openImagePopup = (event) => {
  popupImageImgElement.src = event.target.src;
  popupImageImgElement.alt = event.target.alt;
  popupImageCaptionElement.textContent = event.target.alt;
  openModal(popupImage);
};

setPopupEventListeners(popupEditElement);
setPopupEventListeners(popupNewCard);
setPopupEventListeners(popupImage);
setPopupEventListeners(popupAvatar);

profileEditButton.addEventListener('click', () => {  
  editElementPopup();
});

// Forms submit events
formEditElement.addEventListener('submit', handleFormEditElementSubmit);
formNewCard.addEventListener('submit', handleFormNewCardSubmit);
formEditAvatar.addEventListener('submit', handleFormEditAvatarSubmit);

profileAddButton.addEventListener('click', () => {
  resetValidation(formNewCard, validationConfig);
  
  formNewCard.reset();
  openModal(popupNewCard);
});

profileImage.addEventListener("click", () => {
  resetValidation(formEditAvatar, validationConfig);
  
  formEditAvatar.reset();
  openModal(popupAvatar);
});

// Get data from API
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {  
    updateProfile(userData);
    cards.forEach((cardData) => {
      addCardToContainer(createCardElement({
        cardData: cardData,
        userId: currentUserId,
        onDeleteCardServer: handleDeleteCardServer,
        onLikeCard: handleLikeCard,
        onImageClick: openImagePopup
      }));

    });
  })
  .catch(console.error);

enableValidation(validationConfig);