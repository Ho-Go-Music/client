import axios from 'axios';

const API_URL = 'http://localhost:5173';

// 创建 axios 实例
const instance = axios.create({
    baseURL: API_URL
});

// 定义接口函数
export function LogIn(userData) {
    return instance.post('/api/LogIn', userData);
};

export function SignUp(userData) {
    return axios.post('/api/SignUp', userData);
};

export function userList() {
    return instance.get('/api/userList');
}

export function deleteUser(name) {
    return instance.post('/api/deleteUser', name);
}

export function deactiveUser(name) {
    return instance.post('/api/stopUser', name);
}

export function getSongList() {
    return instance.get('/api/getSongList');
}

export function commentSong(name) {
    return instance.post('/api/commentSong', name);
}

export function getSongComment(name) {
    return instance.get('/api/getSongComment', name);
}
export function deleteMusic(name) {
    return instance.post('/api/deleteMusic', name);
}

export function uploadMusicFile(formData) {
    return instance.post('/api/uploadMusicFile', formData);
}

export function addMusic(params) {
    return instance.post('/api/addMusic', params);
}

export function modifyMusic(params) {
    return instance.post('/api/modifyMusic', params);
}

export function payVip(params){
    return instance.post('api/pay',params)
}

export function shopVip(params){
    return instance.post('/api/payVip',params)
}

export function checkVipStatus(params) {
    return instance.post('/api/checkVipStatus', params)
}
