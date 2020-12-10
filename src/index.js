import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import reportWebVitals from './reportWebVitals'
import burgerBuilderReducer from './store/reducers/burgerBuilder'
import orderReducer from './store/reducers/order'

import asyncFunctionMiddleware from './middlewares/asyncFunctionMiddleware'

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose
/**
 * NOTE: I am using this middleware in place of redux-thunk for edu purpose
 */
const enhancers = composeEnhancers(applyMiddleware(asyncFunctionMiddleware))

const rootReducer = combineReducers({
  burgerBuilder: burgerBuilderReducer,
  order: orderReducer,
})

const store = createStore(rootReducer, enhancers)
const app = (
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
