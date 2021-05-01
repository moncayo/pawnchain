import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { accountReducer } from './reducers/accountReducers'
import { tokenReducer } from './reducers/tokenReducers';
import { positionReducer } from './reducers/positionReducers';

const reducer = combineReducers({
    accountStatus: accountReducer,
    tokens: tokenReducer,
    boardPosition: positionReducer
})

const initialState = {}

const middleware = [thunk]

const store = createStore(
    reducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store;