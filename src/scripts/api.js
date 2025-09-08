import { apiConfig } from './constants.js';
import { request } from './utils.js';

const apiRequest = (endpoint, options = {}) => {
  return request(
    apiConfig.baseUrl + endpoint,
    {
      headers: apiConfig.headers,
      ...options,
    }
  );
};

export const getInitialCards = () => {  
  return apiRequest('/cards');
};

export const addCardServer = ({ name, link }) => {
  return apiRequest('/cards', {
    method: "POST",
    body: JSON.stringify({ name, link })
  });
};

export const deleteCardServer = (cardId) => {
  return apiRequest(`/cards/${cardId}`, {
    method: "DELETE"
  });
};

export const getUserInfo = () => {
  return apiRequest('/users/me');
};

export const updateUserInfo = ({ name, about }) => {
  return apiRequest('/users/me', {
    method: "PATCH",
    body: JSON.stringify({ name, about })
  });
};

export const setLike = (cardId, isLiked) => {
	const method = isLiked ? 'DELETE' : 'PUT';
	return apiRequest(`/cards/likes/${cardId}`, {
		method
	});
};

export const updateAvatar = (avatarUrl) => {
  return apiRequest('/users/me/avatar', {
    method: "PATCH",
    body: JSON.stringify({ avatar: avatarUrl })
  });
};