import {
    TOKEN_REQUEST,
    TOKEN_REQUEST_SUCCESS,
    TOKEN_REQUEST_FAIL
} from '../constants/tokenConstants';

import firebase from 'firebase/app';
import 'firebase/database';

export const listTokens = () => async (dispatch) => {
    try {
        dispatch({ type: TOKEN_REQUEST })
        
        firebase.database()
            .ref('/')
            .once('value')
            .then(snapshot => dispatch({
                type: TOKEN_REQUEST_SUCCESS,
                payload: snapshot.val()
            }))
            .catch(error => {
                dispatch({
                    type: TOKEN_REQUEST_FAIL,
                    payload: error.response && error.response.data.message 
                                ? error.response.data.message 
                                : error.message
                })
            })
    } catch (error) {
        dispatch({
            type: TOKEN_REQUEST_FAIL,
            payload: 
                error.response && error.response.data.message 
                    ? error.response.data.message 
                    : error.message
        })
    }
}
