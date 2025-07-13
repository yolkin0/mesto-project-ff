export const addCard = ({ cardData, onImageClick, toBegin = false }) => {  
  const content = document.querySelector('.content');
  const placesListContainer = content.querySelector('.places__list');
  const cardElement = createCardElement({
    cardData, 
    onDeleteCard: handleRemoveCard,
    onLikeCard: handleLikeCard,
    onImageClick: onImageClick
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

const createCardElement = ({ cardData, onDeleteCard, onLikeCard, onImageClick }) => {
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
  image.addEventListener('click', onImageClick);
  
  return cardElement;
};

