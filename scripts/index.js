const content = document.querySelector('.content');
const placesListContainer = content.querySelector('.places__list');

const handleRemoveCard = (card) => {
  card.remove();
};

function createCardElement(cardData, deleteCard) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true); 

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  image.src = cardData.link;
  image.alt = cardData.name;
  title.textContent = cardData.name;  
  deleteButton.addEventListener('click', () => deleteCard(cardElement));
  
  return cardElement;
}

// Add cards 
initialCards.forEach((cardData) => {  
  const cardElement = createCardElement(cardData, handleRemoveCard);
  placesListContainer.append(cardElement);
});
