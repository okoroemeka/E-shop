import { AsyncStorage } from 'react-native';
export const AUTHENTICATE = 'AUTHENTICATE';
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const authenticate = payload => dispatch => {
  dispatch(setLogOutTimer(payload.expiryTime));
  dispatch({ type: AUTHENTICATE, payload });
};
let timer;
export const logout = () => ({
  type: LOGOUT
});
export const signUp = (email, password) => async dispatch => {
  try {
    const res = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCjgD9rpJaN6tvechUzyw-2VkrpxDxQKTI',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
    if (!res.ok == true) {
      const errorResData = await res.json();
      let message = 'Something went wrong';
      const errorId = errorResData.error.message;
      if (errorId === 'EMAIL_EXISTS') {
        message = 'email already exist';
      }
      throw new Error(message);
    }
    const resData = await res.json();
    dispatch(
      authenticate({
        token: resData.idToken,
        userId: resData.localId,
        expiryTime: +resData.expiresIn * 1000
      })
    );
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    saveToLocalStorage(resData.idToken, resData.localId, expirationDate);
  } catch (error) {
    throw error;
  }
};

export const login = (email, password) => async dispatch => {
  try {
    const res = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCjgD9rpJaN6tvechUzyw-2VkrpxDxQKTI',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );
    if (!res.ok == true) {
      const errorResData = await res.json();
      let message = 'Something went wrong';
      const errorId = errorResData.error.message;
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'Invalid email';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'Invalid password';
      }
      throw new Error(message);
    }
    const resData = await res.json();
    dispatch(
      authenticate({
        token: resData.idToken,
        userId: resData.localId,
        expiryTime: +resData.expiresIn * 1000
      })
    );
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    saveToLocalStorage(resData.idToken, resData.localId, expirationDate);
  } catch (error) {
    throw error;
  }
};
const clearLogOutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};
const logOut = () => {
  AsyncStorage.removeItem('userData');
  clearLogOutTimer();
  return {
    type: LOGOUT
  };
};
const setLogOutTimer = expiryTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logOut());
    }, expiryTime);
  };
};
const saveToLocalStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
