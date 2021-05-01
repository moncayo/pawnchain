import {
    TOKEN_REQUEST,
    TOKEN_REQUEST_SUCCESS,
    TOKEN_REQUEST_FAIL
} from '../constants/tokenConstants';

export const tokenReducer = (state = { tokens: [] }, action) => {
    switch (action.type) {
        case TOKEN_REQUEST:
            return { loading: true, tokens: [] }
        case TOKEN_REQUEST_SUCCESS:
            return { loading: false, tokens: action.payload }
        case TOKEN_REQUEST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}