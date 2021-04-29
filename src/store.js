import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { accountReducer } from './reducers/accountReducers'

const reducer = combineReducers({
    accountStatus: accountReducer
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;