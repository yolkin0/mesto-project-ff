import "../pages/index.css";
import { validationConfig } from './constants.js';
import { createCardElement } from './card.js';
import { initialCards } from './cards.js';
import { openModal, closeModal, setPopupEventListeners } from "./modal.js";
import { enableValidation, resetValidation } from './validation.js';
import { getInitialCards, addCardServer, deleteCardServer, 
  getUserInfo, updateUserInfo, setLike, updateAvatar } from './api.js';
import { handleSubmit } from './utils.js';

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
const formEditElement = document.forms['edit-profile'];
const nameInput = formEditElement.querySelector('.popup__input_type_name');
const jobInput = formEditElement.querySelector('.popup__input_type_description');

// New card form elements
const formNewCard = document.forms['new-place'];
const cardNameInput = formNewCard.querySelector('.popup__input_type_card-name');
const cardUrlInput = formNewCard.querySelector('.popup__input_type_url');

// Edit avatar form elements
const formEditAvatar = document.forms['edit-avatar'];
const avatarLinkInput = formEditAvatar.querySelector('.popup__input_type_avatar_link');

const handleError = (error) => {
  console.error('[Error]:', error);
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

const addCardToContainer = (cardElement, toBegin = false) => {
  if (toBegin)
    placesListContainer.prepend(cardElement)
  else 
    placesListContainer.append(cardElement);
};

const renderCard = (cardOptions, method = "prepend") => {
  // создаем карточку, передавая обработчики в виде объекта `cardOptions`
  const cardElement = createCardElement(cardOptions);
  // вставляем карточку, используя метод (вставится `prepend` или `append`)
  placesListContainer[ method ](cardElement);
}

const handleFormEditElementSubmit = (evt) => {
  const makeRequest = () => {
    return updateUserInfo({ name: nameInput.value, about: jobInput.value })
      .then((updatedUser) => {
        updateProfile(updatedUser);
        closeModal(popupEditElement);
      });
  };
  handleSubmit(makeRequest, evt, handleError);
};

const handleFormNewCardSubmit = (evt) => {
  const makeRequest = () => {
    return addCardServer({ name: cardNameInput.value, link: cardUrlInput.value })
      .then((card) => {
        renderCard({
          cardData: card,
          userId: currentUserId,
          onDeleteCardServer: handleDeleteCardServer,
          onLikeCard: handleLikeCard,
          onImageClick: openImagePopup
        });
        // Close form
        closeModal(popupNewCard);
        // Reset form
        formNewCard.reset();
      });
  };
  handleSubmit(makeRequest, evt, handleError);    
};

const handleFormEditAvatarSubmit = (evt) => {
  const makeRequest = () => {
    return updateAvatar(avatarLinkInput.value)
      .then((updatedUser) => {
        updateProfile(updatedUser);
        
        // Close form
        closeModal(popupAvatar);
        
        formEditAvatar.reset();      
      });
  };
  handleSubmit(makeRequest, evt, handleError);  
}

const handleDeleteCardServer = (cardId) => {
  return deleteCardServer(cardId)
    .then(() => {
      return true;
    })
    .catch((error) => {
      handleError(error);
      return false; // Error
    });
};

const handleLikeCard = (likeButtonElement, cardId, likesCountElement) => {
  const isCurrentUserLiked = likeButtonElement.classList.contains('card__like-button_is-active');

  setLike(cardId, isCurrentUserLiked)
		.then(updatedCard => {
			likeButtonElement.classList.toggle('card__like-button_is-active');
			likesCountElement.textContent = updatedCard.likes.length;
		})
		.catch((error) => handleError(error));
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
  formNewCard.reset();
  resetValidation(formNewCard, validationConfig);
  
  openModal(popupNewCard);
});

profileImage.addEventListener("click", () => {
  formEditAvatar.reset();
  resetValidation(formEditAvatar, validationConfig);
  
  openModal(popupAvatar);
});

// Get data from API
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {  
    updateProfile(userData);
    cards.forEach((cardData) => {
      renderCard(
        {
          cardData: cardData,
          userId: currentUserId,
          onDeleteCardServer: handleDeleteCardServer,
          onLikeCard: handleLikeCard,
          onImageClick: openImagePopup
        },
        'append'
      );

    });
  })
  .catch((error) => handleError(error));

enableValidation(validationConfig);