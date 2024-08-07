export const AUTH_KEY = 'AUTH_TOKEN';
export const USER_KEY = 'USER_KEY';
export const getObjectByKey = (KEY) => {
    return localStorage.getItem(KEY);
};
export const setObjectByKey = (KEY, VAL) => {
    localStorage.setItem(KEY, VAL);
};
export const removeObjectByKey = (KEY) => {
    localStorage.removeItem(KEY);
};

export const removeTokenFromCookie = () => {
    document.cookie = `Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export const getGoogleToken = () => {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        const parts = cookie.split('=');
        if (parts[0].trim() === 'Token') {
            return parts[1].trim();
        }
    }
    return null;
};

export const getToken = () => getObjectByKey(AUTH_KEY);
export const setToken = (token) => setObjectByKey(AUTH_KEY, token);
export const removeToken = () => removeObjectByKey(AUTH_KEY);
export const getUserInfo = () => JSON.parse(getObjectByKey(USER_KEY));
export const setUserInfo = (info) => setObjectByKey(USER_KEY, JSON.stringify(info));
export const removeUserInfo = () => removeObjectByKey(USER_KEY);
