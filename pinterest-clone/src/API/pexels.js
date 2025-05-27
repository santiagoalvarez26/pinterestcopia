import axios from 'axios';

const API_KEY = process.env.REACT_APP_PEXELS_API_KEY;
const BASE_URL = 'https://api.pexels.com/v1';

export const searchImages = async (query = 'nature') => {
  const response = await axios.get(`${BASE_URL}/search`, {
    headers: {
      Authorization: API_KEY,
    },
    params: {
      query,
      per_page: 100,
    },
  });

  return response.data.photos;
};
