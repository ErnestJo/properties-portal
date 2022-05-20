import { createStore, applyMiddleware, compose } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers/index'
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk'

const middleware = [thunk]
const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middleware), composeWithDevTools()),
)

export const persistor = persistStore(store)
export default store
