import * as actionTypes from './actionTypes'
import axios from 'axios'
import * as config from '../../config'

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  }
}

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId,
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  }
}

export const auth = (email, password, isSignup) => {
  return (dispatch) => {
    dispatch(authStart())
    let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.API_KEY}`
    if (isSignup) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${config.API_KEY}`
    }
    axios
      .post(url, {
        email,
        password,
        returnSecureToken: true,
      })
      .then((response) => {
        console.log(response)
        dispatch(authSuccess(response.data.idToken, response.data.localId))
      })
      .catch((err) => {
        console.log(err)
        dispatch(authFail(err))
      })
  }
}
