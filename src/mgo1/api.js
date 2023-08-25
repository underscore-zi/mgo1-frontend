const BASE_URL = 'https://api.mgo1.savemgo.com'; // replace with your actual base URL

// This is just a double-submit token it limits CSRF attacks but its not really used for auth
// it just proves that the client is able to craft headers in a request, something you cannot do
// cross-origin
const TOKEN_HEADER = 'X-API-TOKEN'
const TOKEN = "RFNLbTunTpeqmVcRJEZmqfgM"

import { Game } from './objects/game.js';
import { User, UserStats } from './objects/user.js';
import emitter from 'tiny-emitter/instance'



export async function get(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {credentials: "include"});
  let data;
  const backupResponse = response.clone();
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(await backupResponse.text());
  }

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.data);
  }
}

export async function post(endpoint, payload) {
  const headers = {}
  headers['Content-Type'] = 'application/json'
  headers[TOKEN_HEADER] = TOKEN  
  payload['token'] = TOKEN

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  let data;
  const backupResponse = response.clone();
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(await backupResponse.text());
  }

  if (data.success) {
    return data.data;
  } else {
    throw new Error(data.data);
  }
}


export async function getLobbies() {
    return await get('/api/v1/lobby/list');
}

export async function getNews() {
  return await get('/api/v1/news/list');
}
export async function getPolicy() {
  return await get('/api/v1/policy');
}

export async function getGames() {
  const games = [];  
  const list = await get('/api/v1/games/list');
  list.forEach(game => {
    games.push(new Game(game));
  });
  return games;
}

export async function getGame(id) {
    return new Game(await get(`/api/v1/games/${id}`));
}

export async function getUserSummary(id) {
  return new User(await get(`/api/v1/user/${id}`));
}
export async function getUserStats(id) {
  return new UserStats(await get(`/api/v1/user/${id}/stats`));
}
export async function getUserGames(id, page=1) {
  const games = await get(`/api/v1/user/${id}/games/${page}`);
  return games
}

export async function searchName(name, page) {
  const users = await get(`/api/v1/user/search/${name}/${page}`);
  if(users == null) return [];
  return users.map(user => new User(user));
}

export async function getLeaderboard(period, mode, page) {
    return await get(`/api/v1/rankings/${period}/${page}?mode=${mode}`);
}



export async function loginUser(username, password) {
  return await post('/api/v1/login', {username, password});
}
export async function loginAdmin(username, password) {
  return await post('/api/v1/admin/login', {username, password});
}

export async function whoAmI() {
  const data = await get('/api/v1/whoami');
  if(data.admin_user != 0) {
    data.admin_user = await get('/api/v1/admin/whoami')
  }
  return data
}

export async function logout() {
  return await get('/api/v1/logout');
}

export async function updateProfile(display_name, old_password, password) {
  try{
    return await post('/api/v1/user/profile', {display_name, old_password, password});
  } catch (e) { 
    emitter.emit('error', e) 
    return false
  }
}

export async function getIngameSettings(user_id) {
  try {
    return await get(`/api/v1/user/${user_id}/settings`);
  } catch (e) { 
    emitter.emit('error', e) 
    return false
  }
}

export async function saveSettings(settings) {
  try {
    return await post(`/api/v1/user/settings`, settings);
  } catch (e) { 
    emitter.emit('error', e) 
    return false
  }
}