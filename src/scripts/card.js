export const addCard = (cardData, toBegin = false) => {  
  const content = document.querySelector('.content');
  const placesListContainer = content.querySelector('.places__list');
  const cardElement = createCardElement({
    cardData, 
    onDeleteCard: handleRemoveCard,
    onLikeCard: handleLikeCard
  });

  if (toBegin)
    placesListContainer.prepend(cardElement)
  else 
    placesListContainer.append(cardElement);
};

const handleRemoveCard = (card) => {
  card.remove();
};

const handleLikeCard = (evt) => {
  evt.target.classList.toggle('card__like-button_is-active');
};

const createCardElement = ({ cardData, onDeleteCard, onLikeCard }) => {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true); 

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');

  image.src = cardData.link;
  image.alt = cardData.name;
  title.textContent = cardData.name;  
  deleteButton.addEventListener('click', () => onDeleteCard(cardElement));
  likeButton.addEventListener('click', onLikeCard);
  
  return cardElement;
};

