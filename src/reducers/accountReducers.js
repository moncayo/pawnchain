import { 
    ACCOUNT_REQUEST, 
    ACCOUNT_REQUEST_SUCCESS, 
    ACCOUNT_REQUEST_FAIL
} from '../constants/accountConstants';

export const accountReducer = (state = { currentAccount: '' }, action) => {
    switch (action.type) {
        case ACCOUNT_REQUEST:
            return { currentAccount: '' }
        case ACCOUNT_REQUEST_SUCCESS:
            return { currentAccount: action.payload }
        case ACCOUNT_REQUEST_FAIL:
            return { error: action.payload }
        default:
            return state;
    }
}