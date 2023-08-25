import { get, post } from './api.js';
import { User } from './objects/user.js';
import emitter from 'tiny-emitter/instance'

export async function searchName(name, page) {
    const users = await get(`/api/v1/admin/search/${name}/${page}`);
    if(users == null) return [];
    return users.map(user => new User(user));
}

export async function searchIP(ip, page) {
    const connections = await get(`/api/v1/admin/ip/${ip}/${page}`);
    if(connections == null) return [];
    connections.map(c => {c.user = new User(c.user); return c;})
    return connections;
}
    

export async function getBans() {
    try {
        return await get('/api/v1/admin/bans/list');
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}
export async function updateBan(ban_id, ban_type, expires_at, reason, user_id) {
    try {
        return await post('/api/v1/admin/bans/update', {ban_id, ban_type, expires_at, reason, user_id});
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}

export async function getUserAndRoles() {
    try {
        return await get('/api/v1/admin/users/list');
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}

export async function updateUser(user_id, username, password, role_id, shouldDelete) {
    const args = {
        user_id,
        username,
        password,
        role_id,
        delete: shouldDelete
    }
    try {
        return await post('/api/v1/admin/users/update', args);
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}
export async function updateRole(role, shouldDelete) {
    try {
        return await post('/api/v1/admin/roles/update', {role, delete: shouldDelete});
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}


export async function updateGameProfile(uid, displayName, password) {
    const args = {
        display_name: displayName,
        password: password
    }
    try {
        return await post(`/api/v1/admin/user/${uid}/profile`, args)
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}

export async function updateEmblem(uid, emblem_text) {
    const has_emblem = emblem_text.length > 0;
    const args = {
        emblem_text: emblem_text,
        has_emblem: has_emblem,
    }
    try {
        return await post(`/api/v1/admin/user/${uid}/emblem`, args)
    } catch (e) { emitter.emit('error', e); 
        return false
    }
}


export async function createNews(topic, body) {
    const args = { topic, body }
    try {
        return await post(`/api/v1/admin/news/create`, args)
    } catch (e) { emitter.emit('error', e); 
    return false
}
}

export async function updateNews(id, topic, body) {
    const args = { topic, body }
    try {
        return await post(`/api/v1/admin/news/${id}/update`, args)
    } catch (e) { emitter.emit('error', e); 
    return false
}
}

export async function updatePolicy(body) {
    const args = { body }
    try {
        return await post(`/api/v1/admin/policy/update`, args)
    } catch (e) { 
        emitter.emit('error', e); 
        return false
    }
}