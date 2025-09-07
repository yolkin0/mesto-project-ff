export const createCardElement = ({ cardData, userId, onDeleteCardServer, onLikeCard, onImageClick }) => {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);  
  
  const cardId = cardData._id;  

  cardElement.dataset.id = cardId;

  const image = cardElement.querySelector('.card__image');
  const title = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');

  image.src = cardData.link;
  image.alt = cardData.name;
  title.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  // Delete button
  if (cardData.owner && cardData.owner._id === userId) {
    deleteButton.style.display = 'block';
    deleteButton.addEventListener('click', () => {
      if (onDeleteCardServer(cardData._id))
        cardElement.remove();
    });
  } else {
    deleteButton.style.display = 'none';
  }
  
  // Like handlers  
  likeButton.addEventListener('click', () => {
		onLikeCard(likeButton, cardId, likeCountElement);
	})  

  const isCurrentUserLiked = cardData.likes.some(like => like._id === userId);
	if (isCurrentUserLiked) {
		likeButton.classList.add('card__like-button_is-active');
	}
  
  // Open image popup
  image.addEventListener('click', onImageClick);
  
  return cardElement;
};

