import axios from 'axios';

const BASE_URL = 'https://recycluster.social';

export const getStats = async (token) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: '/stats',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const getUsers = async (token, page) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: `/users/all/${page}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const getUser = async (username) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: `/users/${username}`,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const restorePassword = async (email) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: `/users/restore/${email}`,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const changeUserVisibility = async (token, username) => {
  let response = {};
  try {
    response = await axios({
      method: 'PUT',
      baseURL: BASE_URL,
      url: `/admin/user/status/${username}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const createUser = async (username, email, phone, pass) => {
  let response = {};
  try {
    response = await axios({
      method: 'POST',
      baseURL: BASE_URL,
      url: '/users',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: username,
        email: email,
        phone: phone,
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

export const getAllReports = async (page) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: `/reports/all/${page}`,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const getReport = async (id) => {
  let response = {};
  try {
    response = await axios({
      method: 'GET',
      baseURL: BASE_URL,
      url: `/reports/${id}`,
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const changePostVisibility = async (token, id) => {
  let response = {};
  try {
    response = await axios({
      method: 'PUT',
      baseURL: BASE_URL,
      url: `/admin/post/status/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};

export const deleteReport = async (id, token) => {
  let response = {};
  try {
    response = await axios({
      method: 'DELETE',
      baseURL: BASE_URL,
      url: `/reports/${id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
  } finally {
    console.log(response);
    return response;
  }
};
