import * as actionTypes from './types'

export const clearStore = () => {
  return {
    type: actionTypes.CLEAR_STORAGE,
  }
}

export const setUser = (user) => {
  return {
    type: actionTypes.SET_USER,
    payload: {
      currentUser: user,
    },
  }
}
