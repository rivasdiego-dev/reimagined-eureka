import axios from 'axios';

const BASE_URL = 'https://recycluster.social';

export const login = async (username, pass) => {
  let response = {};
  try {
    response = await axios({
      method: 'POST',
      baseURL: BASE_URL,
      url: '/login/admin',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: username,
        password: pass,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};
