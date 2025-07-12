import "../pages/index.css";
import { addCard } from './card.js';
import { initialCards } from './cards.js';
import { openModal, closeModal, setPopupEventListeners } from "./modal.js";

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

// Profile elements
const profileName = document.querySelector(".profile__title");
const profileAbout = document.querySelector(".profile__description");

// Profile edit form elements
const formEditElement = popupEditElement.querySelector('.popup__form');
const nameInput = formEditElement.querySelector('.popup__input_type_name');
const jobInput = formEditElement.querySelector('.popup__input_type_description');

// New card form elements
const formNewCard = popupNewCard.querySelector('.popup__form');
const cardNameInput = formNewCard.querySelector('.popup__input_type_card-name');
const cardUrlInput = formNewCard.querySelector('.popup__input_type_url');

const editElementPopup = () => {  
  nameInput.value = profileName.textContent;
  jobInput.value = profileAbout.textContent;
  openModal(popupEditElement);
};

const handleFormEditElementSubmit = (evt) => {
  evt.preventDefault();
    
  profileName.textContent = nameInput.value;
  profileAbout.textContent = jobInput.value;

  closeModal(popupEditElement);
};

const handleFormNewCardSubmit = (evt) => {
  evt.preventDefault();

  addCard({
    name: cardNameInput.value,
    link: cardUrlInput.value
  }, true);

  // Close form
  closeModal(popupNewCard);

  // Clear fields
  nameInput.value = profileName.textContent;
  jobInput.value = profileAbout.textContent;
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

profileEditButton.addEventListener('click', () => {  
  editElementPopup();
});

formEditElement.addEventListener('submit', handleFormEditElementSubmit);

formNewCard.addEventListener('submit', handleFormNewCardSubmit);

profileAddButton.addEventListener('click', () => {
  cardNameInput.value = '';
  cardUrlInput.value = '';
  openModal(popupNewCard);
});

placesListContainer.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('card__image')) {
    openImagePopup(evt);
  }
}); 

// Add cards 
initialCards.forEach((cardData) => {
  addCard(cardData);
});
