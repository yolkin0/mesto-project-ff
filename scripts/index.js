function createCardElement(imageSrc, titleValue, onDelete) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true); 

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  image.src = imageSrc;
  image.alt = titleValue;
  title.textContent = titleValue;
  deleteButton.addEventListener('click', onDelete);
  
  return cardElement;
}

const content = document.querySelector('.content');
const placesListContainer = content.querySelector('.places__list');

const handleDeleteCard = (evt) => {
  evt.target.closest('.card').remove();
};

initialCards.forEach((cardData) => {  
  const cardElement = createCardElement(cardData.link,
    cardData.name, handleDeleteCard);
  placesListContainer.append(cardElement);
});
