import { 
    ACCOUNT_REQUEST, 
    ACCOUNT_REQUEST_SUCCESS, 
    ACCOUNT_REQUEST_FAIL
} from '../constants/accountConstants';

export const accountReducer = (state = { currentAccount: '' }, action) => {
    switch (action.type) {
        case ACCOUNT_REQUEST:
            return { loading: true, currentAccount: '' }
        case ACCOUNT_REQUEST_SUCCESS:
            return { loading: false, currentAccount: action.payload }
        case ACCOUNT_REQUEST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state;
    }
}