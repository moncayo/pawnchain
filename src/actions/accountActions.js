import {
    ACCOUNT_REQUEST,
    ACCOUNT_REQUEST_SUCCESS,
    ACCOUNT_REQUEST_FAIL
} from '../constants/accountConstants';


export const account = (address) => async (dispatch) => {
    try {
        dispatch({ type: ACCOUNT_REQUEST })
        
        dispatch({
            type: ACCOUNT_REQUEST_SUCCESS,
            payload: address
        })
    } catch (error) {
        dispatch({
            type: ACCOUNT_REQUEST_FAIL,
            payload: 
                error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message
        })
    }
}
