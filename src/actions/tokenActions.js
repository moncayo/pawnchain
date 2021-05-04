import {
    TOKEN_REQUEST,
    TOKEN_REQUEST_SUCCESS,
    TOKEN_REQUEST_FAIL
} from '../constants/tokenConstants';

import Firebase from 'firebase';
import FirebaseConfig from '../config/firebaseConfig'

Firebase.initializeApp(FirebaseConfig);

export const listTokens = () => async (dispatch) => {
    try {
        dispatch({ type: TOKEN_REQUEST })
        
        Firebase.database()
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
