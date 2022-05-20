import * as actionTypes from '../actions/types'
import changeState from './rest'
import { combineReducers } from 'redux'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const initialState = {
  currentUser: null,
  isLoading: true,
}

const user_reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        currentUser: action.payload.currentUser,
        isLoading: false,
      }

      break
    case actionTypes.CLEAR_STORAGE:
      return {
        ...state,
        currentUser: '',
        loading: false,
      }
    default:
      return state
  }
}

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
}

const rootReducer = combineReducers({
  user: user_reducer,
})

export default persistReducer(persistConfig, rootReducer)
